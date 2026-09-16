const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const { buildSite, versionAssetUrl, versionHtmlAssets } = require('../scripts/build');
const sha = '0123456789abcdef0123456789abcdef01234567';

test('local asset versions preserve relative paths, existing parameters and fragments', () => {
  assert.equal(versionAssetUrl('../data/cards.js', sha), `../data/cards.js?v=${sha}`);
  assert.equal(versionAssetUrl('/css/styles.css?theme=a%20b&v=old&flag#colors', sha), `/css/styles.css?theme=a%20b&flag&v=${sha}#colors`);
  assert.equal(versionAssetUrl('./js/app.js#module', sha), `./js/app.js?v=${sha}#module`);
  assert.equal(versionAssetUrl(`./js/app.js?v=${sha}`, sha), `./js/app.js?v=${sha}`);
  for (const url of ['https://cdn.example/app.js?x=1#hash', '//cdn.example/styles.css', 'data:text/javascript,alert(1)', 'images/card.png', '#section']) {
    assert.equal(versionAssetUrl(url, sha), url);
  }
});

test('HTML versioning leaves CDN references and inline code intact', () => {
  const inline = 'const template = `<script src="ignored.js"><\\/script>`;';
  const html = `<!doctype html><html><head><link href="../css/styles.css?mode=dark&amp;v=old#top" rel="stylesheet"><script src="https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js"></script></head><body><script src="../data/cards.js"></script><script>${inline}</script></body></html>`;
  const dom = new JSDOM(versionHtmlAssets(html, sha));
  try {
    assert.equal(dom.window.document.querySelector('link').getAttribute('href'), `../css/styles.css?mode=dark&v=${sha}#top`);
    assert.equal(dom.window.document.querySelector('script[src^="https:"]').getAttribute('src'), 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app-compat.js');
    assert.equal(dom.window.document.querySelector('script[src^="../"]').getAttribute('src'), `../data/cards.js?v=${sha}`);
    assert.equal(dom.window.document.querySelector('script:not([src])').textContent, inline);
  } finally { dom.window.close(); }
});

test('build versions every nested page without changing sources or publishing tooling', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'cardmax-build-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const html = '<!doctype html><html><head><link rel="stylesheet" href="/css/styles.css"></head><body><script src="../data/cards.js"></script></body></html>';
  const pages = ['index.html', 'pages/cards.html', 'pages/nested/detail.html', 'bilt/index.html', 'bilt/v2/index.html'];
  for (const file of pages) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), html);
  }
  fs.mkdirSync(path.join(root, 'scripts')); fs.writeFileSync(path.join(root, 'scripts/private.js'), 'not a website asset');
  fs.writeFileSync(path.join(root, '.env'), 'do not publish');
  const { output } = buildSite({ root, sha });
  for (const file of pages) {
    const outputHtml = fs.readFileSync(path.join(output, file), 'utf8');
    assert.match(outputHtml, new RegExp(`cards\\.js\\?v=${sha}`));
    assert.match(outputHtml, new RegExp(`styles\\.css\\?v=${sha}`));
    assert.equal(fs.readFileSync(path.join(root, file), 'utf8'), html, `${file} source remains unchanged`);
  }
  assert.equal(JSON.parse(fs.readFileSync(path.join(output, 'version.json'), 'utf8')).commit, sha);
  assert.equal(fs.existsSync(path.join(output, 'scripts')), false);
  assert.equal(fs.existsSync(path.join(output, '.env')), false);
});
