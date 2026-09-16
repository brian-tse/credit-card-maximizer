const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { JSDOM } = require('jsdom');
const projectRoot = path.resolve(__dirname, '..');
// Publish only website assets. Never publish tooling, tests, repo config or secrets.
const entries = ['index.html', 'favicon.ico', 'css', 'js', 'data', 'images', 'assets', 'pages', 'bilt', '.well-known', '_headers', 'robots.txt', 'sitemap.xml'];

function versionAssetUrl(value, sha) {
  if (!value || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return value;
  const hashIndex = value.indexOf('#');
  const hash = hashIndex < 0 ? '' : value.slice(hashIndex);
  const beforeHash = hashIndex < 0 ? value : value.slice(0, hashIndex);
  const queryIndex = beforeHash.indexOf('?');
  const pathname = queryIndex < 0 ? beforeHash : beforeHash.slice(0, queryIndex);
  if (!/\.(?:js|css)$/i.test(pathname)) return value;
  const query = queryIndex < 0 ? '' : beforeHash.slice(queryIndex + 1);
  const params = query.split('&').filter(part => {
    if (!part) return false;
    try { return decodeURIComponent(part.split('=')[0]) !== 'v'; }
    catch { return true; }
  });
  params.push(`v=${encodeURIComponent(sha)}`);
  return `${pathname}?${params.join('&')}${hash}`;
}

function versionHtmlAssets(html, sha) {
  const dom = new JSDOM(html);
  try {
    for (const element of dom.window.document.querySelectorAll('[src], [href]')) {
      for (const attribute of ['src', 'href']) {
        if (!element.hasAttribute(attribute)) continue;
        const original = element.getAttribute(attribute);
        const versioned = versionAssetUrl(original, sha);
        if (versioned !== original) element.setAttribute(attribute, versioned);
      }
    }
    return dom.serialize();
  } finally { dom.window.close(); }
}

function versionOutputHtml(directory, sha) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) versionOutputHtml(filename, sha);
    else if (entry.isFile() && /\.html$/i.test(entry.name)) {
      fs.writeFileSync(filename, versionHtmlAssets(fs.readFileSync(filename, 'utf8'), sha));
    }
  }
}

function buildSite({ root = projectRoot, output = path.join(root, 'dist'), sha } = {}) {
  if (path.resolve(output) === path.resolve(root)) throw new Error('Build output must differ from the source directory');
  const commit = sha || execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  fs.rmSync(output, { recursive: true, force: true });
  fs.mkdirSync(output, { recursive: true });
  for (const entry of entries) {
    const source = path.join(root, entry);
    if (fs.existsSync(source)) fs.cpSync(source, path.join(output, entry), { recursive: true });
  }
  // Editorial source shards are compiled into cards.js, not published twice.
  fs.rmSync(path.join(output, 'data', 'reviewed'), { recursive: true, force: true });
  versionOutputHtml(output, commit);
  fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({ commit, builtAt: new Date().toISOString() }) + '\n');
  return { output, commit };
}

module.exports = { buildSite, versionAssetUrl, versionHtmlAssets };
if (require.main === module) {
  buildSite();
  console.log('Built website assets into dist/ with versioned local JavaScript and CSS.');
}
