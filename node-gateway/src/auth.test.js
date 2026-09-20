import { test } from 'node:test';
import assert from 'node:assert/strict';
import { requireApiKey } from './auth.js';

function mockRes() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };
}

test('rejects a missing api key', () => {
  process.env.GATEWAY_API_KEY = 'secret';
  const req = { get: () => undefined };
  const res = mockRes();
  let nextCalled = false;

  requireApiKey(req, res, () => { nextCalled = true; });

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('rejects a wrong api key', () => {
  process.env.GATEWAY_API_KEY = 'secret';
  const req = { get: () => 'wrong' };
  const res = mockRes();

  requireApiKey(req, res, () => {});

  assert.equal(res.statusCode, 401);
});

test('calls next on a correct api key', () => {
  process.env.GATEWAY_API_KEY = 'secret';
  const req = { get: () => 'secret' };
  const res = mockRes();
  let nextCalled = false;

  requireApiKey(req, res, () => { nextCalled = true; });

  assert.equal(nextCalled, true);
  assert.equal(res.statusCode, null);
});
