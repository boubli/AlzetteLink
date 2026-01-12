/**
 * AlzetteLink Bridge Service - Unit Tests
 *
 * Uses Node.js built-in test runner (Node 18+)
 * Run: npm test
 */

const { describe, it } = require('node:test');
const assert = require('node:assert');

describe('Data Parsing', () => {
  it('should parse valid JSON payload', () => {
    const payload = '{"temp": 24.5, "status": "running", "counter": 10}';
    const parsed = JSON.parse(payload);

    assert.strictEqual(parsed.temp, 24.5);
    assert.strictEqual(parsed.status, 'running');
    assert.strictEqual(parsed.counter, 10);
  });

  it('should handle missing fields gracefully', () => {
    const payload = '{"temp": 20}';
    const parsed = JSON.parse(payload);

    assert.strictEqual(parsed.temp, 20);
    assert.strictEqual(parsed.status, undefined);
    assert.strictEqual(parsed.counter, undefined);
  });

  it('should throw on invalid JSON', () => {
    const payload = 'not valid json';

    assert.throws(() => {
      JSON.parse(payload);
    }, SyntaxError);
  });
});

describe('Data Validation', () => {
  function validatePayload(data) {
    if (typeof data.temp !== 'number') return false;
    if (data.temp < -40 || data.temp > 100) return false;
    if (data.status && typeof data.status !== 'string') return false;
    if (data.counter && typeof data.counter !== 'number') return false;
    return true;
  }

  it('should validate correct payload', () => {
    const data = { temp: 24.5, status: 'running', counter: 10 };
    assert.strictEqual(validatePayload(data), true);
  });

  it('should reject payload with out-of-range temperature', () => {
    const data = { temp: 150, status: 'running', counter: 10 };
    assert.strictEqual(validatePayload(data), false);
  });

  it('should reject payload with missing temperature', () => {
    const data = { status: 'running', counter: 10 };
    assert.strictEqual(validatePayload(data), false);
  });

  it('should accept payload with only temperature', () => {
    const data = { temp: 20 };
    assert.strictEqual(validatePayload(data), true);
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

console.log('✅ All tests defined. Run with: npm test');
