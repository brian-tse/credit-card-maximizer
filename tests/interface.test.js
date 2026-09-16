const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

test('shared navigation works on extensionless nested routes and has keyboard escape and skip behavior', async t => {
  const dom = new JSDOM(`<nav class="navbar"><ul class="nav-links"><li><a href="../index.html">My Cards</a></li><li><a href="cards.html">All Cards</a></li></ul></nav><nav class="sub-navbar"></nav><div class="container"><h1>Cards</h1></div><button id="feedback-fab">!</button>`, { url: 'https://cardmax.test/pages/cards', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window: w } = dom;
  const script = w.document.createElement('script');
  script.src = 'https://cardmax.test/js/interface.js?v=release';
  Object.defineProperty(w.document, 'currentScript', { value: script });
  w.eval(read('js/interface.js'));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  assert.equal(w.document.querySelector('.navbar').getAttribute('aria-label'), 'Primary');
  assert.equal(w.document.querySelector('a[aria-current="page"]').textContent, 'All Cards');
  assert.equal(w.document.querySelector('.tools-menu a:last-child').href, 'https://cardmax.test/bilt/');
  const menu = w.document.querySelector('.tools-menu');
  menu.open = true;
  menu.querySelector('a').focus();
  menu.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(menu.open, false);
  assert.equal(w.document.activeElement, menu.querySelector('summary'));
  w.document.querySelector('.skip-link').click();
  assert.equal(w.document.activeElement, w.document.querySelector('[role="main"]'));
  assert.equal(w.document.querySelector('.site-utilities #feedback-fab').textContent, 'Report an issue');
});

test('dialog closes without leaving the page scroll-locked and returns focus to its opener', t => {
  const dom = new JSDOM('<button id="opener">Details</button><div id="card-modal" class="modal-overlay"><div role="dialog"><button>Close</button></div></div>', { url: 'https://cardmax.test/', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window: w } = dom;
  w.eval(read('js/dialogs.js'));
  const opener = w.document.getElementById('opener');
  opener.focus();
  w.CardMaxDialogs.open('card-modal');
  assert(w.document.body.classList.contains('has-open-dialog'));
  assert.equal(w.document.querySelector('[role="dialog"]').getAttribute('aria-modal'), 'true');
  // A settings edit can replace the opener while the dialog remains open.
  const replacement = opener.cloneNode(true);
  opener.replaceWith(replacement);
  w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert(!w.document.body.classList.contains('has-open-dialog'));
  assert.equal(w.document.activeElement, replacement);
});

test('deferred interface collects feedback created by an earlier DOM-ready handler', async t => {
  const dom = new JSDOM('<main>Cards</main>', { url: 'https://cardmax.test/', runScripts: 'outside-only' });
  t.after(() => dom.window.close());
  const { window: w } = dom;
  Object.defineProperty(w.document, 'readyState', { get: () => 'interactive' });
  w.document.addEventListener('DOMContentLoaded', () => {
    w.document.body.insertAdjacentHTML('beforeend', '<button id="feedback-fab">!</button>');
  });
  w.eval(read('js/interface.js'));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  assert.equal(w.document.querySelectorAll('.site-footer').length, 1);
  assert.equal(w.document.querySelector('.site-utilities #feedback-fab').textContent, 'Report an issue');
});
