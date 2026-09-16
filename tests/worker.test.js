const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const workerPromise = import('data:text/javascript;base64,' + Buffer.from(fs.readFileSync(path.join(__dirname, '../workers/card-suggestion.js'))).toString('base64'));
const env = () => ({ GITHUB_TOKEN: 'test-secret', SUGGESTION_RATE_LIMITER: { limit: async () => ({ success: true }) } });
const request = (data, origin = 'https://cardmax.cc') => new Request('https://worker.test/', {
  method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify(data),
});

test('legacy email and contact details never reach a public issue; no mention ping', async () => {
  const worker = (await workerPromise).default;
  const originalFetch = global.fetch;
  let sent;
  global.fetch = async (_url, options) => {
    sent = JSON.parse(options.body);
    return Response.json({ number: 123 });
  };
  try {
    const response = await worker.fetch(request({ issuer: 'Chase', cardName: 'Test', email: 'private@example.com', notes: 'Reply to notes@example.com @maintainer' }), env());
    assert.equal(response.status, 200);
    assert.equal(JSON.stringify(sent).includes('@example.com'), false);
    assert.equal(sent.body.includes('<!-- EMAIL:'), false);
    assert.equal(sent.body.includes('@maintainer'), false);
    assert.equal((await response.json()).issueUrl, 'https://github.com/brian-tse/credit-card-maximizer/issues/123');
  } finally { global.fetch = originalFetch; }
});

test('bad origins, malformed data and oversized payloads never create an issue', async () => {
  const worker = (await workerPromise).default;
  assert.equal((await worker.fetch(request({ issuer: 'A', cardName: 'B' }, 'https://evil.test'), env())).status, 403);
  for (const value of [null, [], { issuer: {}, cardName: 'B' }, { issuer: '', cardName: 'B' }, { issuer: 'A', cardName: 'B', notes: 'x'.repeat(3001) }]) {
    assert.equal((await worker.fetch(request(value), env())).status, 400);
  }
  assert.equal((await worker.fetch(request({ issuer: 'A', cardName: 'B', junk: 'x'.repeat(9000) }), env())).status, 413);
});

test('rate limit and missing config fail closed; health never publishes secrets', async () => {
  const worker = (await workerPromise).default;
  const limited = env(); limited.SUGGESTION_RATE_LIMITER.limit = async () => ({ success: false });
  const response = await worker.fetch(request({ issuer: 'A', cardName: 'B' }), limited);
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('Retry-After'), '60');
  assert.equal((await worker.fetch(request({ issuer: 'A', cardName: 'B' }), {})).status, 503);
  const health = await worker.fetch(new Request('https://worker.test/health'), env());
  const data = await health.json();
  assert.equal(data.collectsEmail, false);
  assert.equal(JSON.stringify(data).includes('test-secret'), false);
});

test('upstream failures return safe errors, not issuer text or credentials', async () => {
  const worker = (await workerPromise).default;
  const originalFetch = global.fetch;
  global.fetch = async () => { throw new Error('test-secret sensitive upstream'); };
  try {
    const response = await worker.fetch(request({ issuer: 'A', cardName: 'B' }), env());
    assert.equal(response.status, 502);
    assert.equal((await response.text()).includes('test-secret'), false);
  } finally { global.fetch = originalFetch; }
});
