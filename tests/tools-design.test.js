const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
function load(file, scripts, ids = []) {
  const html = read(file);
  const dom = new JSDOM(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g, ''), { url: `https://cardmax.cc/${file}`, runScripts: 'dangerously' });
  const w = dom.window;
  w.localStorage.setItem('cardmax_user_cards', JSON.stringify(ids));
  w.CardMaxAuth = { autoSync() {} };
  w.HTMLElement.prototype.scrollIntoView = function () {};
  w.eval(scripts.map(read).join('\n') + '\n' + [...html.matchAll(/<script(?![^>]*src=)[^>]*>([\s\S]*?)<\/script>/g)].map(match => match[1]).join('\n'));
  w.document.dispatchEvent(new w.Event('DOMContentLoaded'));
  return dom;
}
const wallet = ['amex-gold', 'capital-one-venture-x', 'chase-sapphire-preferred'];
const model = ['data/cards.js', 'js/card-model.js'];

test('category view switches rates without dropping caps, portal grouping or focus', t => {
  const dom = load('pages/categories.html', [...model, 'data/valuations.js', 'js/dialogs.js'], wallet);
  t.after(() => dom.window.close());
  const d = dom.window.document;
  assert.match(d.querySelector('.effective-return').textContent, /% est\. value/);
  assert.equal(d.querySelectorAll('.category-group').length, 2);
  const portal = [...d.querySelectorAll('.category-group')].find(group => group.querySelector('h2').textContent.includes('portals'));
  assert.match(portal.textContent, /Capital One Travel/);
  const before = d.querySelector('.category-group').textContent;
  const rate = d.getElementById('ranking-rate'); rate.focus(); rate.click();
  assert.equal(d.activeElement.id, 'ranking-rate');
  assert.equal(d.getElementById('ranking-rate').getAttribute('aria-pressed'), 'true');
  assert.equal(d.getElementById('ranking-value').getAttribute('aria-pressed'), 'false');
  assert.match(d.querySelector('.earning-rate').textContent, /x|%/);
  // U.S. supermarket and restaurant annual caps must stay visible in either view.
  assert.match(before, /25,000|50,000/);
  assert.match(d.querySelector('.category-group').textContent, /25,000|50,000/);
});

test('partner search combines with type filter, handles no results and retains search focus', t => {
  const dom = load('pages/partners.html', model, wallet);
  t.after(() => dom.window.close());
  const w = dom.window, d = w.document, input = d.getElementById('partner-search');
  input.focus(); input.value = 'Aeroplan'; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('.partner-card').length, 1);
  assert.equal(d.activeElement, input);
  assert.match(d.getElementById('partner-status').textContent, /1 program found/);
  d.querySelector('[data-filter="hotel"]').click();
  assert.equal(d.querySelector('[data-filter="hotel"]').getAttribute('aria-pressed'), 'true');
  assert.equal(d.querySelectorAll('.partner-card').length, 0);
  assert.match(d.getElementById('partner-grid').textContent, /No matching programs/);
  d.querySelector('[data-filter="all"]').click();
  assert.equal(d.querySelectorAll('.partner-card').length, 1);
  input.value = '<script>'; input.dispatchEvent(new w.Event('input'));
  assert.equal(d.querySelectorAll('#partner-grid script').length, 0);
  assert.match(d.getElementById('partner-grid').textContent, /<script>/);
});

test('partner details have an intentional focus destination and return to the original program', t => {
  const dom = load('pages/partners.html', model, wallet);
  t.after(() => dom.window.close());
  const d = dom.window.document, original = d.querySelector('.partner-card');
  original.focus(); original.click();
  assert.equal(d.activeElement.id, 'partner-detail-title');
  assert.equal(original.getAttribute('aria-expanded'), 'true');
  assert.match(d.getElementById('partner-status').textContent, /details opened/);
  assert.ok(d.querySelector('.transfer-card-identity'));
  assert.ok(d.querySelector('.transfer-rate-cell'));
  assert.ok(d.querySelector('.transfer-conditions'));
  d.querySelector('.close-detail-btn').click();
  assert.equal(d.activeElement, original);
  assert.equal(original.getAttribute('aria-expanded'), 'false');
});

test('Bilt mobile summary matches the breakdown and hides when amounts are invalid', t => {
  const dom = load('bilt/index.html', ['data/cards.js', 'bilt/calculator-model.js', 'bilt/calculator.js']);
  t.after(() => dom.window.close());
  const w = dom.window, d = w.document;
  assert.equal(d.getElementById('mobile-housing-total').textContent, d.getElementById('housing-total').textContent + ' points');
  assert.equal(d.getElementById('mobile-flexible-total').textContent, d.getElementById('flexible-total').textContent + ' points');
  assert.match(d.getElementById('mobile-cash-remaining').textContent, /40\.00 Bilt Cash \(restricted program value\)/);
  const spend = d.getElementById('spend'); spend.value = '1000'; spend.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(d.getElementById('mobile-housing-total').textContent, d.getElementById('housing-total').textContent + ' points');
  assert.equal(d.getElementById('mobile-flexible-total').textContent, d.getElementById('flexible-total').textContent + ' points');
  spend.value = '-1'; spend.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(d.getElementById('mobile-results-summary').hidden, true);
  assert.equal(d.getElementById('results').hidden, true);
  spend.value = '0'; spend.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(d.getElementById('mobile-results-summary').hidden, false);
  assert.equal(d.querySelector('.mobile-results-summary a').getAttribute('href'), '#results');
});
