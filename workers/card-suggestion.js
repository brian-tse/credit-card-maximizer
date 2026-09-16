/** Public card suggestions. Contact details are never accepted or stored. */
const REPOSITORY = 'brian-tse/credit-card-maximizer';
const ORIGINS = new Set(['https://cardmax.cc', 'https://www.cardmax.cc', 'http://localhost:3000']);
const MAX_BYTES = 8192;
const VERSION = '2026-09-16-privacy-v2';

function json(data, status = 200, origin = '') {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Vary': 'Origin',
  };
  if (ORIGINS.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return new Response(JSON.stringify(data), { status, headers });
}

export function publicText(value) {
  return value.replace(/[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]')
    .replace(/<!--[^]*?-->/g, '')
    .replace(/@/g, '@\u200b'); // Avoid unsolicited GitHub mention notifications.
}

function field(data, name, max, required = false) {
  const value = data[name] ?? '';
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) {
    throw new Error(`Invalid ${name}`);
  }
  return publicText(value.trim());
}

async function readBody(request) {
  const declared = Number(request.headers.get('Content-Length'));
  if (declared > MAX_BYTES) throw new RangeError('Request too large');
  if (!request.body) throw new Error('Missing body');
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) {
        await reader.cancel();
        throw new RangeError('Request too large');
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'GET' && new URL(request.url).pathname === '/health') {
      return json({ status: 'ok', version: VERSION, collectsEmail: false });
    }
    if (!ORIGINS.has(origin)) return json({ success: false, error: 'Forbidden' }, 403);
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin',
      } });
    }
    if (request.method !== 'POST') return json({ success: false, error: 'Method not allowed' }, 405, origin);
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) {
      return json({ success: false, error: 'JSON required' }, 415, origin);
    }
    if (!env.SUGGESTION_RATE_LIMITER || !env.GITHUB_TOKEN) {
      return json({ success: false, error: 'Suggestions are temporarily unavailable' }, 503, origin);
    }
    const actor = request.headers.get('CF-Connecting-IP') || 'local';
    try {
      const { success } = await env.SUGGESTION_RATE_LIMITER.limit({ key: `card-suggestions:${actor}` });
      if (!success) {
        const response = json({ success: false, error: 'Please wait a minute before submitting again' }, 429, origin);
        response.headers.set('Retry-After', '60');
        return response;
      }
    } catch {
      return json({ success: false, error: 'Suggestions are temporarily unavailable' }, 503, origin);
    }
    let issuer, cardName, notes;
    try {
      const data = await readBody(request);
      if (!data || typeof data !== 'object' || Array.isArray(data)) throw new Error('Invalid form');
      issuer = field(data, 'issuer', 100, true);
      cardName = field(data, 'cardName', 150, true);
      notes = field(data, 'notes', 3000);
      // Legacy clients may send email. Deliberately never read or forward it.
    } catch (error) {
      return json({ success: false, error: error instanceof RangeError ? 'Request too large' : 'Check the form fields' },
        error instanceof RangeError ? 413 : 400, origin);
    }
    const body = `## New Card Suggestion\n\n**Issuer:** ${issuer}\n**Card Name:** ${cardName}\n` +
      `**Submitted:** ${new Date().toISOString()}\n\n` +
      (notes ? `### Notes\n${notes}\n\n` : '') +
      '*Submitted via the public CardMax suggestion form. Contact details are not collected.*\n\n<!-- CARDMAX_SUGGESTION -->';
    try {
      const result = await fetch(`https://api.github.com/repos/${REPOSITORY}/issues`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'User-Agent': 'CardMax-Worker',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: `Card Suggestion: ${issuer} ${cardName}`, body, labels: ['card-suggestion'] }),
        signal: AbortSignal.timeout(10000),
      });
      if (!result.ok) {
        console.error('Suggestion upstream status', result.status);
        return json({ success: false, error: 'Could not save your suggestion. Please try again later.' }, 502, origin);
      }
      const issue = await result.json();
      return json({ success: true, message: 'Suggestion submitted. You can follow progress on GitHub.',
        issueNumber: issue.number, issueUrl: `https://github.com/${REPOSITORY}/issues/${issue.number}` }, 200, origin);
    } catch {
      return json({ success: false, error: 'Could not save your suggestion. Please try again later.' }, 502, origin);
    }
  },
};
