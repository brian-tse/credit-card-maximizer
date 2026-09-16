import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Official issuers, loyalty programs and benefit providers cited by reviewed records.
// Do not add general hosting/CDN domains to make a failed source check pass.
const issuerHosts = [
  'chase.com', 'chasecdn.com', 'americanexpress.com', 'thecenturionlounge.com',
  'capitalone.com', 'capitalonetravel.com', 'wellsfargo.com', 'wf.com',
  'citi.com', 'citicards.com', 'citigroup.com', 'thankyou.com', 'bankofamerica.com',
  'barclaycardus.com', 'barclaysus.com', 'discover.com', 'usbank.com',
  'biltrewards.com', 'bilt.com', 'cardless.com', 'gemini.com', 'synchrony.com', 'syf.com',
  'fidelity.com', 'robinhood.com', 'virgin.com', 'virginred.com', 'qatarairways.com',
  'emirates.com', 'southwest.com', 'united.com', 'delta.com', 'aa.com', 'alaskaair.com',
  'jetblue.com', 'britishairways.com', 'hilton.com', 'marriott.com', 'hyatt.com',
  'ihg.com', 'wyndhamhotels.com', 'choicehotels.com', 'accor.com', 'iprefer.com',
  'turo.com', 'mycardgtb.com'
];
export function allowedSource(source) {
  try {
    const url = new URL(source);
    return url.protocol === 'https:' && !url.username && !url.password && issuerHosts.some(host => url.hostname === host || url.hostname.endsWith('.' + host));
  } catch { return false; }
}
function visit(record, callback, scope = '') {
  if (!record || typeof record !== 'object') return;
  callback(record, scope);
  for (const [key, value] of Object.entries(record)) if (value && typeof value === 'object') visit(value, callback, scope ? `${scope}.${key}` : key);
}
export function fieldReviews(card) {
  const unresolved = new Set(['needs-review', 'unverified', 'unresolved', 'unsupported', 'ambiguous', 'pending', 'manual-review']);
  return Object.entries(card.fieldSources || {}).map(([field, item]) => {
    const source = item && typeof item === 'object' ? item : {};
    const status = source.verificationStatus || source.status || 'needs-review';
    return { field, status, unresolved: unresolved.has(status) || unresolved.has(source.status),
      reviewedAt: source.reviewedAt || null, sourceUrl: source.sourceUrl || null,
      note: source.note || source.description || null };
  });
}
export function collectSourceUrls(record) {
  const urls = new Set();
  visit(record, item => {
    if (typeof item.sourceUrl === 'string') urls.add(item.sourceUrl);
    if (Array.isArray(item.sourceUrls)) item.sourceUrls.filter(url => typeof url === 'string').forEach(url => urls.add(url));
  });
  return [...urls];
}
export function pageText(html) {
  const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
  return html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ').replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (match, entity) => {
      if (entity[0] !== '#') return entities[entity.toLowerCase()] || match;
      const value = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return value > 0 && value <= 0x10ffff && !(value >= 0xd800 && value <= 0xdfff) ? String.fromCodePoint(value) : match;
    }).replace(/\s+/g, ' ').trim();
}
function evidence(text) {
  return text.match(/.{0,80}(annual fee|statement credit|\d+[xX] points|transfer|lounge|credit|anniversary|effective).{0,180}/gi)?.slice(0, 20) || [text.slice(0, 260)];
}
function changedExcerpt(before, after) {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  return { before: before.slice(Math.max(0, start - 100), start + 400), after: after.slice(Math.max(0, start - 100), start + 400) };
}
export function compareSourceHtml(html, previous = {}, today = new Date().toISOString().slice(0, 10)) {
  const text = pageText(html);
  const hash = crypto.createHash('sha256').update(text).digest('hex');
  const currentEvidence = evidence(text);
  const changed = !!previous.hash && previous.hash !== hash;
  const result = { status: changed ? 'changed-review-needed' : previous.hash ? 'unchanged-page' : 'baseline-created', hash, checkedAt: today, text, evidence: currentEvidence };
  if (changed) {
    result.beforeEvidence = (previous.evidence || []).filter(snippet => !currentEvidence.includes(snippet));
    result.afterEvidence = currentEvidence.filter(snippet => !(previous.evidence || []).includes(snippet));
    if (!result.beforeEvidence.length && !result.afterEvidence.length && typeof previous.text === 'string') {
      const excerpt = changedExcerpt(previous.text, text);
      result.beforeEvidence = [excerpt.before]; result.afterEvidence = [excerpt.after];
    }
    if (!result.beforeEvidence.length) result.beforeEvidence = previous.evidence || ['No previous excerpt was captured.'];
    if (!result.afterEvidence.length) result.afterEvidence = currentEvidence;
    result.previousCheckedAt = previous.checkedAt || null;
  }
  return result;
}
export async function inspectSource(url, previous = {}, { fetchImpl = fetch, today = new Date().toISOString().slice(0, 10) } = {}) {
  if (!allowedSource(url)) return { status: 'manual-review', detail: 'Issuer host requires review' };
  try {
    let currentUrl = url;
    for (let redirects = 0; redirects <= 5; redirects++) {
      const response = await fetchImpl(currentUrl, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'User-Agent': 'CardMaxSourceReview/1.0 (+https://cardmax.cc)' } });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get('Location');
        if (!location) return { status: 'unavailable', detail: 'Redirect missing location' };
        currentUrl = new URL(location, currentUrl).href;
        if (!allowedSource(currentUrl)) return { status: 'manual-review', detail: 'Redirect destination needs issuer-host review' };
        continue;
      }
      if (!response.ok) return { status: 'unavailable', httpStatus: response.status };
      const contentType = (response.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
      if (contentType === 'application/pdf' || /\.pdf(?:[?#]|$)/i.test(currentUrl)) {
        return { status: 'manual-review', detail: 'PDF source requires a document read and comparison', contentType, finalUrl: currentUrl };
      }
      if (!['text/html', 'application/xhtml+xml', 'text/plain'].includes(contentType)) {
        return { status: 'manual-review', detail: 'Non-text or unidentified source requires a manual read', contentType: contentType || 'missing', finalUrl: currentUrl };
      }
      return { ...compareSourceHtml(await response.text(), previous, today), finalUrl: currentUrl };
    }
    return { status: 'unavailable', detail: 'Too many redirects' };
  } catch { return { status: 'unavailable', detail: 'Timeout or network error' }; }
}
const esc = value => String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|').replace(/[\r\n]+/g, ' ');
export function upcomingTerms(card, today, days = 45) {
  const deadline = new Date(Date.parse(today) + days * 86400000).toISOString().slice(0, 10);
  const upcoming = [];
  visit(card, (item, scope) => {
    for (const [field, change] of [['effectiveFrom', 'starts'], ['effectiveUntil', 'expires']]) {
      if (item[field] >= today && item[field] <= deadline) {
        // Nested term variants may put their program name on the enclosing record.
        const parts = scope.split('.');
        const ownName = item.name || item.category;
        let parent = card, name = ownName;
        for (const part of parts) {
          if (!parent || typeof parent !== 'object') break;
          if (!ownName && (parent.name || parent.category)) name = parent.name || parent.category;
          parent = parent[part];
        }
        const term = item.ratio ? `ratio ${item.ratio}` : item.multiplier != null ? `${item.multiplier}x earning` : null;
        upcoming.push({ id: item.id || scope || card.id, name: name || scope || card.name, change, date: item[field],
          eligibility: item.eligibility || item.cohort || null, term, description: item.description || item.termsNote || null });
      }
    }
  });
  return upcoming;
}
export function buildReport(cards, results = {}, today = new Date().toISOString().slice(0, 10)) {
  const priority = ['changed-review-needed', 'unavailable', 'manual-review', 'baseline-created', 'unchanged-page', 'not-fetched'];
  const rows = cards.map(card => {
    const age = card.verifiedAt ? Math.floor((Date.parse(today) - Date.parse(card.verifiedAt)) / 86400000) : null;
    const sourceChecks = collectSourceUrls(card).map(url => ({ url, status: results[url]?.status || 'not-fetched' }));
    return { id: card.id, name: card.name, status: card.verificationStatus, verifiedAt: card.verifiedAt, reviewedAt: card.reviewedAt, overdue: age === null || age > 90, sourceUrl: card.sourceUrl,
      sourceCheck: priority.find(status => sourceChecks.some(check => check.status === status)) || 'not-fetched', sourceChecks,
      fieldReviews: fieldReviews(card), unresolvedFields: fieldReviews(card).filter(field => field.unresolved), upcoming: upcomingTerms(card, today) };
  });
  let markdown = `# CardMax data review — ${today}\n\n${cards.length} cards. ${rows.filter(row => row.overdue).length} need a complete or overdue source review.\n\nPage changes are review signals, not verified fact changes. Before/after excerpts compare issuer pages; proposed catalog edits still require a human source review. No card values or verification dates were changed.\n\n| Card | Review status | Source check (all cited pages) | Issuer |\n|---|---|---|---|\n`;
  for (const row of rows) markdown += `| ${esc(row.name)} | ${esc(row.status)}${row.reviewedAt ? `; partial ${row.reviewedAt}` : ''} | ${row.sourceCheck} (${row.sourceChecks.length} pages) | [Source](${row.sourceUrl}) |\n`;
  const unresolvedRows = rows.filter(row => row.unresolvedFields.length);
  if (unresolvedRows.length) {
    markdown += '\n## Fields still needing source review\n\nAn unchanged source page does not resolve these open questions or certify an account’s legacy terms.\n';
    for (const row of unresolvedRows) {
      markdown += `\n### ${esc(row.name)}\n`;
      for (const field of row.unresolvedFields) markdown += `\n- ${esc(field.field)} — ${esc(field.status)}${field.note ? `: ${esc(field.note)}` : ''}${field.sourceUrl ? ` ([source](${field.sourceUrl}))` : ''}\n`;
    }
  }
  for (const [url, result] of Object.entries(results)) {
    if (!['changed-review-needed', 'unavailable', 'manual-review'].includes(result.status)) continue;
    markdown += `\n## ${esc(url)}\n\nStatus: ${result.status}${result.httpStatus ? ` (${result.httpStatus})` : ''}.${result.detail ? ` ${esc(result.detail)}.` : ''}\n`;
    if (result.status === 'changed-review-needed') {
      markdown += `\n### Before${result.previousCheckedAt ? ` (${result.previousCheckedAt})` : ''}\n`;
      for (const snippet of result.beforeEvidence || []) markdown += `\n> ${esc(snippet)}\n`;
      markdown += `\n### After (${today})\n`;
      for (const snippet of result.afterEvidence || []) markdown += `\n> ${esc(snippet)}\n`;
    }
  }
  const upcoming = rows.flatMap(row => row.upcoming.map(term => `${row.name}: ${term.name} ${term.change} ${term.date}${term.term ? ` — ${term.term}` : ''}${term.eligibility ? ` (${term.eligibility})` : ''}${term.description ? `. ${term.description}` : ''}`));
  if (upcoming.length) markdown += '\n## Terms starting or expiring within 45 days\n\n' + upcoming.map(item => `- ${esc(item)}`).join('\n') + '\n';
  // Full page text is kept only in the local cache; reports contain bounded excerpts.
  const sources = Object.fromEntries(Object.entries(results).map(([url, { text, ...result }]) => [url, result]));
  return { markdown, report: { checkedAt: today, cards: rows, sources } };
}
export async function runReview({ cards = require('../data/cards.js'), online = false, directory = projectRoot, today = new Date().toISOString().slice(0, 10), fetchImpl = fetch } = {}) {
  const reportsPath = path.join(directory, 'reports'), cachePath = path.join(directory, '.cache');
  fs.mkdirSync(reportsPath, { recursive: true }); fs.mkdirSync(cachePath, { recursive: true });
  const snapshotPath = path.join(cachePath, 'issuer-sources.json');
  let previous = {};
  try { previous = JSON.parse(fs.readFileSync(snapshotPath, 'utf8')); } catch {}
  const results = {}, urls = collectSourceUrls(cards);
  if (online) {
    let next = 0;
    await Promise.all(Array.from({ length: 4 }, async () => {
      while (next < urls.length) { const url = urls[next++]; results[url] = await inspectSource(url, previous[url], { fetchImpl, today }); }
    }));
    const merged = { ...previous };
    for (const [url, result] of Object.entries(results)) if (result.hash) {
      const { hash, text, evidence, checkedAt, finalUrl } = result;
      merged[url] = { hash, text, evidence, checkedAt, finalUrl };
    }
    fs.writeFileSync(snapshotPath, JSON.stringify(merged, null, 2));
  }
  const { markdown, report } = buildReport(cards, results, today);
  fs.writeFileSync(path.join(reportsPath, 'data-review.md'), markdown);
  fs.writeFileSync(path.join(reportsPath, 'data-review.json'), JSON.stringify(report, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown);
  return report;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const report = await runReview({ online: process.argv.includes('--fetch') });
  console.log(`Created review report for ${report.cards.length} cards; checked ${Object.keys(report.sources).length} source pages. No catalog changes made.`);
}
