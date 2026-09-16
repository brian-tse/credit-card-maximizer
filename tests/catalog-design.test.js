const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function loadPage(page, scripts) {
  const dom = new JSDOM(read(page).replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''), { url: `https://cardmax.cc/${page}`, runScripts: 'dangerously' });
  dom.window.eval(['data/cards.js', 'js/card-model.js', ...scripts].map(read).join('\n'));
  dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));
  return dom;
}

test('source details preserve limitations without overwhelming the default card summary', t => {
  const dom = loadPage('pages/cards.html', ['js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  const doc = dom.window.document;
  const source = doc.querySelector('.source-details');
  assert.equal(source.open, false);
  assert.match(source.textContent, /Reviewed fields/);
  assert.match(doc.querySelector('.review-badge').textContent, /Partially reviewed|Verified|Not yet verified/);
  assert.equal(dom.window.CardMaxModel.reviewedFieldLabel('transferPartners.turkish-airlines'), 'Turkish Airlines transfers');
  source.querySelector('summary').click();
  assert.equal(source.open, true);
});

test('catalog quick add preserves focus and disclosures while exposing the saved state', t => {
  const dom = loadPage('pages/cards.html', ['js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  const doc = dom.window.document;
  const button = doc.querySelector('[data-add-card="capital-one-venture-x"]');
  const source = button.closest('article').querySelector('details');
  source.open = true;
  button.focus(); button.click();
  assert.equal(doc.activeElement, button);
  assert.equal(button.getAttribute('aria-disabled'), 'true');
  assert.equal(source.open, true);
  assert.deepEqual(JSON.parse(dom.window.localStorage.getItem('cardmax_user_cards')), ['capital-one-venture-x']);
});

test('modal tabs support arrows, Home and End, with one selected tab and named panel', t => {
  const dom = loadPage('pages/cards.html', ['js/dialogs.js', 'js/app.js']);
  t.after(() => dom.window.close());
  const w = dom.window, doc = w.document;
  w.openCardModal('bilt-obsidian');
  const overview = doc.getElementById('tab-overview');
  overview.focus();
  overview.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'End', bubbles: true }));
  assert.equal(doc.activeElement.id, 'tab-perks');
  assert.equal(doc.querySelectorAll('[role="tab"][aria-selected="true"]').length, 1);
  assert.equal(doc.getElementById('modal-content').getAttribute('aria-labelledby'), 'tab-perks');
  doc.activeElement.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  assert.equal(doc.activeElement, overview);
  assert.equal(doc.querySelectorAll('[role="tab"][tabindex="0"]').length, 1);
  assert.match(doc.querySelector('.bilt-calculator-link').href, /\/bilt\/$/);
  assert.ok(doc.querySelector('#modal-content .overview-facts'));
});

test('comparison starts compact and searching retains full card names and keyboard focus', t => {
  const dom = loadPage('pages/compare.html', ['js/compare.js']);
  t.after(() => dom.window.close());
  const w = dom.window, doc = w.document;
  assert.equal(doc.querySelectorAll('[data-pick-card]').length, 6);
  const search = doc.getElementById('card-search');
  search.value = 'Venture X'; w.filterCards();
  const button = doc.querySelector('[data-pick-card="capital-one-venture-x"]');
  assert.equal(button.querySelector('.card-name').textContent, 'Capital One Venture X');
  button.focus(); button.click();
  assert.equal(doc.activeElement, button);
  assert.equal(button.getAttribute('aria-pressed'), 'true');
  assert.match(doc.getElementById('selected-card-chips').textContent, /Capital One Venture X/);
  search.value = 'Chase'; w.filterCards();
  assert.match(doc.getElementById('selected-card-chips').textContent, /Capital One Venture X/);
  assert.equal(doc.getElementById('compare-selected').getAttribute('aria-disabled'), 'false');
});

test('comparison removes cards with predictable focus and caps selections at four', t => {
  const dom = loadPage('pages/compare.html', ['js/compare.js']);
  t.after(() => dom.window.close());
  const w = dom.window, doc = w.document;
  ['capital-one-venture-x', 'chase-sapphire-preferred', 'amex-gold', 'amex-platinum', 'chase-sapphire-reserve'].forEach(w.toggleCardSelection);
  assert.equal(doc.getElementById('selected-count').textContent, '4');
  assert.match(doc.getElementById('comparison-status').textContent, /up to four/);
  const firstRemove = doc.querySelector('[data-remove-card="capital-one-venture-x"]');
  firstRemove.focus(); firstRemove.click();
  assert.equal(doc.activeElement.dataset.removeCard, 'chase-sapphire-preferred');
  doc.getElementById('clear-selection').focus(); w.clearSelection();
  assert.equal(doc.activeElement.id, 'card-search');
  assert.equal(doc.getElementById('selected-count').textContent, '0');
});

test('differences filter hides equal values and restores rows when disabled', t => {
  const dom = loadPage('pages/compare.html', ['js/compare.js']);
  t.after(() => dom.window.close());
  const w = dom.window, doc = w.document;
  w.toggleCardSelection('chase-freedom-unlimited');
  w.toggleCardSelection('chase-freedom-flex');
  const feeRow = [...doc.querySelectorAll('.comparison-table tbody tr')].find(row => row.querySelector('.row-label').textContent === 'Annual Fee');
  const filter = doc.getElementById('differences-only');
  filter.checked = true; w.applyDifferenceFilter();
  assert.equal(feeRow.hidden, true);
  filter.checked = false; w.applyDifferenceFilter();
  assert.equal(feeRow.hidden, false);
});
