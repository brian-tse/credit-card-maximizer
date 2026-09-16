const test = require('node:test');
const assert = require('node:assert/strict');
test('legacy suggestion redaction preserves useful request, removes both email copies', async () => {
  const { redactSuggestionBody } = await import('../scripts/redact-suggestion-emails.mjs');
  const original = '## New Card Suggestion\n**Card Name:** Example\n\n### Notes\nPlease add it.\n\n### Notification\n📧 Notify when added: person@example.com\n\n---\n*Submitted via CardMax suggestion form*\n<!-- CARDMAX_SUGGESTION -->\n<!-- EMAIL:person@example.com -->';
  const clean = redactSuggestionBody(original);
  assert(clean.includes('**Card Name:** Example'));
  assert(clean.includes('Please add it.'));
  assert(clean.includes('CARDMAX_SUGGESTION'));
  assert(!clean.includes('person@example.com'));
  assert(!clean.includes('EMAIL:'));
  assert.equal(redactSuggestionBody(clean), clean);
});
