// @ts-nocheck
const OBJECT_TYPE_MAP = {
  screen: ['objectType', 'nodeId', 'appId', 'screenId', 'title', 'status'],
  transition: ['objectType', 'nodeId', 'appId', 'transitionId', 'title', 'sourceScreenId', 'targetScreenId', 'trigger', 'status'],
  scenario: ['objectType', 'nodeId', 'appId', 'scenarioId', 'title', 'goal', 'actor', 'steps', 'status'],
  integration: ['objectType', 'nodeId', 'appId', 'integrationId', 'title', 'direction', 'targetType', 'targetId', 'purpose', 'status'],
};

const KNOWN_TYPES = ['screen', 'transition', 'scenario', 'integration'];
const KNOWN_STATUSES = ['draft', 'active', 'deprecated'];

export function validateAppDoc(objectType: string, data: unknown): { valid: true; data: Record<string, unknown> } | { valid: false; errors: string[] } {
  if (!KNOWN_TYPES.includes(objectType)) {
    return { valid: false, errors: [`Unknown objectType: ${objectType}`] };
  }

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }

  const obj = data as Record<string, unknown>;
  if (obj.objectType !== objectType) {
    return { valid: false, errors: [`objectType mismatch`] };
  }

  const requiredFields = OBJECT_TYPE_MAP[objectType];
  const errors: string[] = [];

  for (const field of requiredFields) {
    if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (obj.status && !KNOWN_STATUSES.includes(String(obj.status))) {
    errors.push(`Invalid status: must be draft|active|deprecated`);
  }

  if (objectType === 'integration') {
    if (obj.direction && !['inbound', 'outbound', 'bidirectional'].includes(String(obj.direction))) {
      errors.push(`Invalid direction`);
    }
    if (obj.targetType && !['app', 'node', 'service', 'external-system'].includes(String(obj.targetType))) {
      errors.push(`Invalid targetType`);
    }
  }

  return errors.length > 0 ? { valid: false, errors } : { valid: true, data: obj };
}

export function validateLinkedView(data: unknown): { valid: true } | { valid: false; errors: string[] } {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }

  const obj = data as Record<string, unknown>;
  if (obj.version !== '1.0.0') return { valid: false, errors: ['Invalid version'] };
  if (!obj.nodeId || !obj.appId) return { valid: false, errors: ['Missing nodeId or appId'] };
  if (!obj.counters) return { valid: false, errors: ['Missing counters'] };

  return { valid: true };
}
