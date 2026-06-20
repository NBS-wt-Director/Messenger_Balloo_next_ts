const OBJECT_TYPE_MAP = {
  screen: ['objectType', 'nodeId', 'appId', 'screenId', 'title', 'status'],
  transition: ['objectType', 'nodeId', 'appId', 'transitionId', 'title', 'sourceScreenId', 'targetScreenId', 'trigger', 'status'],
  scenario: ['objectType', 'nodeId', 'appId', 'scenarioId', 'title', 'goal', 'actor', 'steps', 'status'],
  integration: ['objectType', 'nodeId', 'appId', 'integrationId', 'title', 'direction', 'targetType', 'targetId', 'purpose', 'status'],
};

const KNOWN_TYPES = ['screen', 'transition', 'scenario', 'integration'];
const KNOWN_STATUSES = ['draft', 'active', 'deprecated'];

function validateAppDoc(objectType, data) {
  if (!KNOWN_TYPES.includes(objectType)) {
    return { valid: false, errors: [`Unknown objectType: ${objectType}`] };
  }

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }

  if (data.objectType !== objectType) {
    return { valid: false, errors: [`objectType mismatch: expected "${objectType}", got "${data.objectType}"`] };
  }

  const requiredFields = OBJECT_TYPE_MAP[objectType];
  const errors = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`Missing required field: ${field}`);
    }
  }

  if (data.status && !KNOWN_STATUSES.includes(data.status)) {
    errors.push(`Invalid status: "${data.status}". Must be draft|active|deprecated`);
  }

  // Direction validation for integration
  if (objectType === 'integration' && data.direction && !['inbound', 'outbound', 'bidirectional'].includes(data.direction)) {
    errors.push(`Invalid direction: "${data.direction}". Must be inbound|outbound|bidirectional`);
  }

  // TargetType validation for integration
  if (objectType === 'integration' && data.targetType && !['app', 'node', 'service', 'external-system'].includes(data.targetType)) {
    errors.push(`Invalid targetType: "${data.targetType}". Must be app|node|service|external-system`);
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data };
}

function validateLinkedView(data) {
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Data must be an object'] };
  }

  if (data.version !== '1.0.0') {
    return { valid: false, errors: ['Invalid version'] };
  }

  if (!data.nodeId || !data.appId) {
    return { valid: false, errors: ['Missing nodeId or appId'] };
  }

  if (!data.counters) {
    return { valid: false, errors: ['Missing counters'] };
  }

  return { valid: true };
}

module.exports = { validateAppDoc, validateLinkedView };
