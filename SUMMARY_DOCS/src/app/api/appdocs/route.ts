// @ts-nocheck
import fs from 'fs';
import path from 'path';

const OBJECT_TYPE_MAP = {
  screen: ['objectType', 'nodeId', 'appId', 'screenId', 'title', 'status'],
  transition: ['objectType', 'nodeId', 'appId', 'transitionId', 'title', 'sourceScreenId', 'targetScreenId', 'trigger', 'status'],
  scenario: ['objectType', 'nodeId', 'appId', 'scenarioId', 'title', 'goal', 'actor', 'steps', 'status'],
  integration: ['objectType', 'nodeId', 'appId', 'integrationId', 'title', 'direction', 'targetType', 'targetId', 'purpose', 'status'],
};
const KNOWN_TYPES = ['screen', 'transition', 'scenario', 'integration'];
const KNOWN_STATUSES = ['draft', 'active', 'deprecated'];

function readSettings() {
  const candidates = [
    path.join(process.cwd(), 'settings', '.env'),
    path.join(process.cwd(), 'settings', '.env.prod'),
    path.join(process.cwd(), 'settings', '.env.example.dev'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      const content = fs.readFileSync(candidate, 'utf-8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed.startsWith('GENERAL_PASSWORD=')) {
          return trimmed.split('=', 2)[1].trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
  return process.env.GENERAL_PASSWORD;
}

function validateAppDoc(objectType, data) {
  if (!KNOWN_TYPES.includes(objectType)) return { valid: false, errors: ['Unknown type: ' + objectType] };
  if (!data || typeof data !== 'object') return { valid: false, errors: ['Data must be object'] };
  if (data.objectType !== objectType) return { valid: false, errors: ['Type mismatch'] };
  const errors = [];
  for (const field of OBJECT_TYPE_MAP[objectType]) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push('Missing: ' + field);
    }
  }
  if (data.status && !KNOWN_STATUSES.includes(String(data.status))) errors.push('Invalid status');
  return errors.length > 0 ? { valid: false, errors } : { valid: true, data };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const nodeId = searchParams.get('nodeId');
  const appId = searchParams.get('appId');
  const type = searchParams.get('type');
  const id = searchParams.get('id');

  if (action === 'linked-view') {
    if (!nodeId || !appId) return Response.json({ success: false, message: 'nodeId and appId required' }, { status: 400 });
    const viewPath = path.join(process.cwd(), 'docs', 'app-canonical', nodeId, appId, 'maps', 'linked-view.json');
    try {
      const content = fs.readFileSync(viewPath, 'utf-8');
      return Response.json({ success: true, data: JSON.parse(content) });
    } catch {
      return Response.json({ success: false, message: 'Linked view not found' }, { status: 404 });
    }
  }

  if (action === 'object') {
    if (!type || !id) return Response.json({ success: false, message: 'type and id required' }, { status: 400 });
    const dir = type === 'screen' ? 'screens' : type === 'transition' ? 'transitions' : type === 'scenario' ? 'scenarios' : 'integrations';
    const filePath = path.join(process.cwd(), 'docs', 'app-canonical', nodeId, appId, dir, id + '.md');
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (!match) return Response.json({ success: false, message: 'Invalid format' }, { status: 400 });
      const data = {};
      for (const line of match[1].split('\n')) {
        const eq = line.indexOf(':');
        if (eq > 0) {
          const key = line.slice(0, eq).trim();
          let value = line.slice(eq + 1).trim();
          try { value = JSON.parse(value); } catch { /* keep string */ }
          data[key] = value;
        }
      }
      return Response.json({ success: true, data });
    } catch {
      return Response.json({ success: false, message: 'Object not found' }, { status: 404 });
    }
  }

  return Response.json({ success: true, message: 'App Docs API. Use ?action=linked-view or ?action=object or POST' });
}

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const body = await request.json();

  if (action === 'verify-privilege') {
    const { generalPassword } = body;
    if (!generalPassword) return Response.json({ success: false, message: 'Password required' }, { status: 400 });
    const password = readSettings();
    if (password !== generalPassword) {
      return Response.json({ success: false, message: 'Invalid privilege verification' }, { status: 403 });
    }
    const token = 'appdoc-session-' + Date.now() + '-' + Math.random().toString(36).slice(2);
    return Response.json({ success: true, sessionToken: token, expiresIn: 900 });
  }

  if (action === 'save') {
    const { sessionToken, nodeId, appId, objectType, objectId, data } = body;
    if (!sessionToken || !sessionToken.startsWith('appdoc-session-')) {
      return Response.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    const validation = validateAppDoc(objectType, data);
    if (!validation.valid) {
      return Response.json({ success: false, errors: validation.errors }, { status: 400 });
    }
    const dir = objectType === 'screen' ? 'screens' : objectType === 'transition' ? 'transitions' : objectType === 'scenario' ? 'scenarios' : 'integrations';
    const filePath = path.join(process.cwd(), 'docs', 'app-canonical', nodeId, appId, dir, objectId + '.md');
    const fm = Object.entries(validation.data)
      .filter(function(entry) { return entry[1] !== undefined && entry[1] !== null; })
      .map(function(entry) {
        var k = entry[0], v = entry[1];
        return Array.isArray(v) ? k + ':\n' + v.map(function(i) { return '  - ' + i; }).join('\n') : k + ': ' + JSON.stringify(v);
      })
      .join('\n');
    var title = validation.data.title || 'Untitled';
    var content = '#' + objectType + ': ' + title + '\n\nUpdated.\n';
    fs.writeFileSync(filePath, '---\n' + fm + '\n---\n\n' + content, 'utf-8');
    return Response.json({ success: true, auditId: 'audit-' + Date.now(), message: objectType + ' saved' });
  }

  return Response.json({ success: false, message: 'Unknown action' }, { status: 400 });
}
