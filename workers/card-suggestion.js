/**
 * CardMax Card Suggestion Worker
 * 
 * Receives form submissions and creates GitHub Issues
 * 
 * Required secrets (set in Cloudflare dashboard):
 * - GITHUB_TOKEN: Personal access token with repo scope
 * 
 * Deploy: wrangler deploy
 */

const GITHUB_REPO = 'brian-tse/credit-card-maximizer';
const ALLOWED_ORIGINS = [
  'https://cardmax.cc',
  'https://www.cardmax.cc',
  'http://localhost:3000', // for local testing
];

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handleCORS(request);
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Check origin
    const origin = request.headers.get('Origin');
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    try {
      const data = await request.json();
      
      // Validate required fields
      if (!data.issuer || !data.cardName) {
        return jsonResponse({ success: false, error: 'Missing required fields' }, 400, origin);
      }

      // Create GitHub issue
      const issue = await createGitHubIssue(env.GITHUB_TOKEN, {
        issuer: data.issuer,
        cardName: data.cardName,
        notes: data.notes || '',
        email: data.email || '',
        submittedAt: new Date().toISOString(),
      });

      return jsonResponse({ 
        success: true, 
        message: 'Suggestion submitted! We\'ll notify you when the card is added.',
        issueNumber: issue.number 
      }, 200, origin);

    } catch (error) {
      console.error('Worker error:', error);
      return jsonResponse({ success: false, error: 'Internal error' }, 500, origin);
    }
  }
};

async function createGitHubIssue(token, data) {
  const title = `Card Suggestion: ${data.issuer} ${data.cardName}`;
  
  let body = `## New Card Suggestion\n\n`;
  body += `**Issuer:** ${data.issuer}\n`;
  body += `**Card Name:** ${data.cardName}\n`;
  body += `**Submitted:** ${data.submittedAt}\n\n`;
  
  if (data.notes) {
    body += `### Notes\n${data.notes}\n\n`;
  }
  
  if (data.email) {
    body += `### Notification\n📧 Notify when added: ${data.email}\n\n`;
  }
  
  body += `---\n`;
  body += `*Submitted via CardMax suggestion form*\n`;
  body += `\n<!-- CARDMAX_SUGGESTION -->\n`;
  body += `<!-- EMAIL:${data.email || 'none'} -->`;

  const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/issues`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'CardMax-Worker',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['card-suggestion'],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${error}`);
  }

  return response.json();
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

function handleCORS(request) {
  const origin = request.headers.get('Origin');
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : '',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',
    },
  });
}
