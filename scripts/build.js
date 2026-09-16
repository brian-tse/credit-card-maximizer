const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
// Publish only website assets. Never publish tooling, tests, repo config or secrets.
const entries = ['index.html', 'favicon.ico', 'css', 'js', 'data', 'images', 'assets', 'pages', 'bilt', '.well-known', '_headers', 'robots.txt', 'sitemap.xml'];
for (const entry of entries) {
  const source = path.join(root, entry);
  if (fs.existsSync(source)) fs.cpSync(source, path.join(output, entry), { recursive: true });
}
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(output, 'version.json'), JSON.stringify({ commit: sha, builtAt: new Date().toISOString() }) + '\n');
console.log('Built website assets into dist/');
