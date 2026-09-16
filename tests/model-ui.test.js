const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function page(file, scripts, ids = []) {
  const html = read(file);
  const dom = new JSDOM(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''), { url: 'https://cardmax.cc/' + file, runScripts: 'dangerously' });
  const { window } = dom;
  window.localStorage.setItem('cardmax_user_cards', JSON.stringify(ids));
  window.CardMaxAuth = { autoSync() {}, init() {}, isSignedIn() { return false; } };
  // Evaluate classic scripts together so lexical globals match real script tags.
  window.eval(scripts.map(read).join('\n') + '\n' + [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n'));
  window.document.dispatchEvent(new window.Event('DOMContentLoaded'));
  return dom;
}

test('catalog modal adds the displayed card, with no null ID or false success', t => {
  const dom = page('pages/cards.html', ['data/cards.js', 'js/card-model.js', 'js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  const { window } = dom;
  window.openCardModal('chase-sapphire-preferred');
  window.document.getElementById('add-to-collection-btn').click();
  assert.deepEqual(JSON.parse(window.localStorage.getItem('cardmax_user_cards')), ['chase-sapphire-preferred']);
  assert.equal(window.document.getElementById('add-to-collection-btn').disabled, true);
  window.quickAddCard(null);
  window.quickAddCard('does-not-exist');
  assert.deepEqual(JSON.parse(window.localStorage.getItem('cardmax_user_cards')), ['chase-sapphire-preferred']);
  window.openCardModal('capital-one-venture-x');
  window.renderModalContent('credits');
  assert.match(window.document.getElementById('modal-content').textContent, /\$330/);
  assert.doesNotMatch(window.document.getElementById('modal-content').textContent, /\$10,?000/);
});

test('modal add failure preserves the actionable button and reports save failure', t => {
  const dom = page('pages/cards.html', ['data/cards.js', 'js/card-model.js', 'js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  const { window } = dom;
  window.openCardModal('capital-one-venture-x');
  const prototype = Object.getPrototypeOf(window.localStorage), original = prototype.setItem;
  prototype.setItem = () => { throw new Error('Storage full'); };
  window.document.getElementById('add-to-collection-btn').click();
  prototype.setItem = original;
  assert.equal(window.document.getElementById('add-to-collection-btn').disabled, false);
  assert.deepEqual(JSON.parse(window.localStorage.getItem('cardmax_user_cards')), []);
  assert.match(window.document.querySelector('[role="status"]').textContent + window.document.querySelector('.quick-add-toast').textContent, /Could not save/);
});

test('dashboard migrates invalid saved IDs and starts with an honest saved state', t => {
  const dom = page('index.html', ['data/cards.js', 'js/card-model.js'], [null, 'missing', 'capital-one-venture-x', 'capital-one-venture-x']);
  t.after(() => dom.window.close());
  const { window } = dom;
  assert.deepEqual(JSON.parse(window.localStorage.getItem('cardmax_user_cards')), ['capital-one-venture-x']);
  assert.equal(window.document.getElementById('stat-my-cards').textContent, '1');
  assert.equal(window.document.getElementById('stat-total-credits').textContent, '$330');
  assert.equal(window.document.getElementById('stat-net-value').textContent, '-$65');
  assert.match(window.document.getElementById('save-status').textContent, /Saved on this device/);
});

test('comparison uses the same cash value and explicit point units', t => {
  const dom = page('pages/compare.html', ['data/cards.js', 'js/card-model.js', 'js/compare.js']);
  t.after(() => dom.window.close());
  const { window } = dom;
  window.toggleCardSelection('capital-one-venture-x');
  const comparison = window.document.getElementById('comparison-container').textContent;
  assert.match(comparison, /\$330/);
  assert.match(comparison, /-\$65/);
  assert.match(comparison, /10,000 pts/);
  assert.doesNotMatch(comparison, /\$10,?000/);
  assert.equal(window.document.querySelector('button.card-pick-item[aria-pressed="true"]').getAttribute('aria-label'), 'Compare Capital One Venture X');
});

test('public suggestion form contains no email input and discloses publication', t => {
  const dom = page('pages/cards.html', ['data/cards.js', 'js/card-model.js', 'js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  assert.equal(dom.window.document.querySelector('#card-suggestion-form [name="email"]'), null);
  assert.match(dom.window.document.getElementById('suggestion-disclosure').textContent, /public GitHub/);
  assert.doesNotMatch(read('pages/cards.html'), /web3forms|form\.email/);
});

test('dashboard fee overrides persist zero and clear back to the listed fee', t => {
  const dom = page('index.html', ['data/cards.js', 'js/card-model.js'], ['capital-one-venture-x']);
  t.after(() => dom.window.close());
  const { window } = dom;
  window.updateAnnualFee('capital-one-venture-x', '0');
  assert.equal(window.document.getElementById('stat-annual-fees').textContent, '$0');
  assert.equal(window.document.getElementById('stat-net-value').textContent, '$330');
  assert.deepEqual(JSON.parse(window.localStorage.getItem('cardmax_annual_fees')), { 'capital-one-venture-x': 0 });
  window.updateAnnualFee('capital-one-venture-x', '');
  assert.equal(window.document.getElementById('stat-annual-fees').textContent, '$395');
  assert.equal(window.document.getElementById('stat-net-value').textContent, '-$65');
});
