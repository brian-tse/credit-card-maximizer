# CardMax suggestion Worker

`card-suggestion.js` creates a public GitHub issue with card issuer, name and optional notes. It never reads or forwards the legacy email field, redacts pasted email addresses, limits field/body size, suppresses mention pings, and uses the Cloudflare rate limiter (three requests per minute per connecting IP per location). Rate limiting is abuse mitigation, not user authentication.

Deployment config is `wrangler.jsonc`. The existing endpoint is `https://cardmax-suggestions.briantse.workers.dev`; no DNS changes are needed. `GET /health` returns only the release marker and `collectsEmail: false`.

The server-side `GITHUB_TOKEN` secret must have permission to create issues in `brian-tse/credit-card-maximizer`. Preserve that secret; do not copy it into local files or logs. Use local Wrangler authentication for manual maintenance. The main GitHub deployment workflow also deploys this Worker using the existing Cloudflare secrets.

```sh
npx wrangler deploy --dry-run --config workers/wrangler.jsonc
npx wrangler dev --config workers/wrangler.jsonc
```

Unit tests mock GitHub and the rate limiter so they cannot publish test issues. Do not send valid production test submissions. A missing rate-limiter binding or GitHub secret returns 503 rather than disabling protection. A blocked origin, malformed input or oversized request fails without creating an issue.

The form now offers a GitHub issue link for following progress. No automatic email notification or external polling service is claimed. Legacy public issue body redaction and removal of old email-containing edit-history revisions are separate tasks.
