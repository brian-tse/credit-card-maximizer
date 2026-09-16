import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
export function verifyCatalogPrivacy(catalog) {
  assert(catalog.includes('card-model.js'), 'Shared calculation module missing');
  const suggestionForm = catalog.match(/<form\b[^>]*\bid=["']card-suggestion-form["'][^>]*>([\s\S]*?)<\/form>/i)?.[1];
  assert(suggestionForm, 'Suggestion form missing');
  assert(!/<(?:input|textarea)\b[^>]*\b(?:name|type)\s*=\s*["']?email(?:["'\s>])/i.test(suggestionForm), 'Legacy email input remains');
  assert(!/web3forms|form\.email|user_email/i.test(catalog), 'Legacy suggestion email forwarding remains');
  assert(/public\s+GitHub/i.test(suggestionForm), 'Public submission disclosure missing');
}
export async function waitForVersion({ base, expectedCommit, fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), now = Date.now, timeoutMs = 120000 } = {}) {
  const deadline = now() + timeoutMs;
  let attempts = 0;
  while (now() < deadline) {
    try {
      const response = await fetchImpl(`${base}/version.json?check=${now()}`, { signal: AbortSignal.timeout(Math.max(1, Math.min(15000, deadline - now()))), cache: 'no-store' });
      if (response.status === 200) {
        const version = await response.json();
        if (typeof version.commit === 'string' && (!expectedCommit || version.commit === expectedCommit)) return version;
      }
    } catch { /* Deployment propagation and transient failures retry without printing response content. */ }
    const remaining = deadline - now();
    if (remaining <= 0) break;
    await sleep(Math.min(1000 * 2 ** Math.min(attempts++, 5), remaining));
  }
  throw new Error('Production version did not reach the expected release within two minutes');
}
export async function verifyProduction({ base = process.env.SITE_URL || 'https://cardmax.cc', expectedCommit = process.env.GITHUB_SHA, fetchImpl = fetch } = {}) {
  const version = await waitForVersion({ base, expectedCommit, fetchImpl });
  async function get(path) {
    const response = await fetchImpl(`${base}${path}`, { signal: AbortSignal.timeout(15000), cache: 'no-store' });
    assert.equal(response.status, 200, `${path} must return 200`);
    return response;
  }
  const catalog = await (await get('/pages/cards')).text();
  verifyCatalogPrivacy(catalog);
  const home = await (await get('/')).text();
  assert(home.includes('storage.js'), 'Storage module missing');
  for (const html of [home, catalog]) {
    const assets = [...html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)].map(match => new URL(match[1].replace(/&amp;/g, '&'), base)).filter(url => url.origin === new URL(base).origin && /\.(?:js|css)$/.test(url.pathname));
    assert(assets.length > 0, 'Local release assets missing');
    for (const url of assets) assert.equal(url.searchParams.get('v'), version.commit, `Unversioned release asset: ${url.pathname}`);
  }
  const data = await (await get(`/data/cards.js?v=${version.commit}`)).text();
  const digest = value => createHash('sha256').update(value).digest('hex');
  assert.equal(digest(data), digest(readFileSync(new URL('../data/cards.js', import.meta.url))), 'Production catalog bytes differ from this release');
  const health = await fetchImpl('https://cardmax-suggestions.briantse.workers.dev/health', { signal: AbortSignal.timeout(15000) });
  assert.equal(health.status, 200, 'Suggestion Worker health');
  assert.equal((await health.json()).collectsEmail, false, 'Suggestion privacy release missing');
  return version;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const version = await verifyProduction();
  console.log(`Verified HTTPS, production commit ${version.commit.slice(0, 12)}, shared scripts and non-email suggestion service.`);
}
