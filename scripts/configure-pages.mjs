// Keep the existing Pages project and domains; use checked Actions releases for production.
import assert from 'node:assert/strict';
const account = process.env.CLOUDFLARE_ACCOUNT_ID;
const token = process.env.CLOUDFLARE_API_TOKEN;
assert(account && token, 'Cloudflare deployment credentials are required');
const endpoint = `https://api.cloudflare.com/client/v4/accounts/${account}/pages/projects/cardmax`;
async function request(method, body) {
  const response = await fetch(endpoint, { method, signal: AbortSignal.timeout(20000), headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, ...(body ? { body: JSON.stringify(body) } : {}) });
  const result = await response.json();
  assert(response.ok && result.success, `Pages configuration request failed (${response.status}); inspect Cloudflare project permissions`);
  return result.result;
}
const project = await request('GET');
assert.equal(project.name, 'cardmax');
if (project.source?.type === 'github' && project.source.config.production_deployments_enabled !== false) {
  await request('PATCH', { source: { type: project.source.type, config: { ...project.source.config, production_deployments_enabled: false } } });
  const verified = await request('GET');
  assert.equal(verified.source.config.production_deployments_enabled, false, 'Duplicate production builds remain enabled');
}
console.log('Pages production uses checked Actions releases; existing domains and preview settings preserved.');
