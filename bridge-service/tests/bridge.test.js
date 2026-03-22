/**
 * AlzetteLink Bridge Service - Unit Tests
 *
 * Uses Node.js built-in test runner (Node 18+)
 * Run: npm test
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

// Import actual production functions
const { validatePayload, safeJsonParse } = require('../index');

describe('safeJsonParse', () => {
  it('should parse valid JSON payload', () => {
    const payload = '{"temp": 24.5, "status": "running", "counter": 10}';
    const parsed = safeJsonParse(payload);

    assert.strictEqual(parsed.temp, 24.5);
    assert.strictEqual(parsed.status, 'running');
    assert.strictEqual(parsed.counter, 10);
  });

  it('should handle missing fields gracefully', () => {
    const payload = '{"temp": 20}';
    const parsed = safeJsonParse(payload);

    assert.strictEqual(parsed.temp, 20);
    assert.strictEqual(parsed.status, undefined);
    assert.strictEqual(parsed.counter, undefined);
  });

  it('should return null on invalid JSON', () => {
    const result = safeJsonParse('not valid json');
    assert.strictEqual(result, null);
  });

  it('should return null on empty string', () => {
    const result = safeJsonParse('');
    assert.strictEqual(result, null);
  });
});

describe('validatePayload', () => {
  it('should validate correct full payload', () => {
    const data = { temp: 24.5, status: 'running', counter: 10 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, true);
    assert.strictEqual(result.errors.length, 0);
  });

  it('should reject payload with out-of-range temperature (too high)', () => {
    const data = { temp: 150, status: 'running', counter: 10 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors[0].includes('out of valid range'));
  });

  it('should reject payload with out-of-range temperature (too low)', () => {
    const data = { temp: -50, status: 'running', counter: 10 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
  });

  it('should reject payload with missing temperature', () => {
    const data = { status: 'running', counter: 10 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors[0].includes('temp'));
  });

  it('should reject payload with string temperature', () => {
    const data = { temp: 'hot' };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
  });

  it('should accept payload with only temperature', () => {
    const data = { temp: 20 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, true);
  });

  it('should accept boundary temperature values', () => {
    assert.strictEqual(validatePayload({ temp: -40 }).valid, true);
    assert.strictEqual(validatePayload({ temp: 100 }).valid, true);
    assert.strictEqual(validatePayload({ temp: 0 }).valid, true);
  });

  it('should reject non-string status', () => {
    const data = { temp: 20, status: 123 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors[0].includes('status'));
  });

  it('should reject negative counter', () => {
    const data = { temp: 20, counter: -1 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors[0].includes('counter'));
  });

  it('should reject float counter', () => {
    const data = { temp: 20, counter: 1.5 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
  });

  it('should collect multiple errors', () => {
    const data = { status: 123, counter: -1 };
    const result = validatePayload(data);
    assert.strictEqual(result.valid, false);
    assert.ok(result.errors.length >= 2);
  });
});

describe('MQTT Topic Validation', () => {
  function isValidTopic(topic) {
    if (!topic || typeof topic !== 'string') return false;
    if (topic.length === 0 || topic.length > 256) return false;
    if (topic.includes('#') || topic.includes('+')) return false;
    return true;
  }

  it('should accept valid topic', () => {
    assert.strictEqual(isValidTopic('alzette/machine/data'), true);
  });

  it('should reject topic with wildcards', () => {
    assert.strictEqual(isValidTopic('alzette/+/data'), false);
    assert.strictEqual(isValidTopic('alzette/#'), false);
  });

  it('should reject empty topic', () => {
    assert.strictEqual(isValidTopic(''), false);
    assert.strictEqual(isValidTopic(null), false);
  });
});
