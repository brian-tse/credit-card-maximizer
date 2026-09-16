// Run with --apply to redact legacy generated suggestion bodies. Never logs their content.
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function redactSuggestionBody(body) {
  return body
    .replace(/### Notification\s*\n[^]*?(?=\n---|\n### |$)/g, '')
    .replace(/<!--\s*EMAIL:[^]*?-->/gi, '')
    .replace(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]')
    .trim();
}

function api(args, input) {
  return JSON.parse(execFileSync('gh', ['api', ...args], {
    encoding: 'utf8', input: input ? JSON.stringify(input) : undefined,
    stdio: ['pipe', 'pipe', 'pipe'], maxBuffer: 10 * 1024 * 1024,
  }));
}

export function run(apply = false) {
  const base = 'repos/brian-tse/credit-card-maximizer';
  const issues = api([`${base}/issues?state=all&labels=card-suggestion&per_page=100`, '--paginate', '--slurp']).flat();
  const changed = [];
  for (const issue of issues) {
    if (issue.pull_request || !issue.body?.includes('CARDMAX_SUGGESTION')) continue;
    const body = redactSuggestionBody(issue.body);
    if (body === issue.body.trim()) continue;
    if (apply) {
      api([`${base}/issues/${issue.number}`, '--method', 'PATCH', '--input', '-'], { body });
      const verified = api([`${base}/issues/${issue.number}`]);
      if (verified.body !== body) throw new Error(`Issue ${issue.number} did not verify`);
    }
    changed.push(issue.number);
  }
  console.log(JSON.stringify({ mode: apply ? 'applied' : 'dry-run', count: changed.length, issues: changed }));
  if (apply) console.log('Issue bodies redacted. Historical revisions must also be purged through GitHub edit-history controls.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { run(process.argv.includes('--apply')); }
  catch { console.error('Redaction failed; inspect GitHub access or connectivity. No content was logged.'); process.exitCode = 1; }
}
