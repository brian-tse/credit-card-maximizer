# CardMax Workers

Cloudflare Workers for CardMax automation.

## card-suggestion.js

Handles card suggestion form submissions and creates GitHub Issues.

### Setup

1. Install Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```

2. Login to Cloudflare:
   ```bash
   wrangler login
   ```

3. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Create token with `repo` scope
   - Copy the token

4. Add the secret to Cloudflare:
   ```bash
   cd workers
   wrangler secret put GITHUB_TOKEN
   # Paste your token when prompted
   ```

5. Deploy:
   ```bash
   wrangler deploy
   ```

### Worker URL

After deployment, the worker will be available at:
```
https://cardmax-suggestions.briantse.workers.dev
```

### How It Works

1. User submits card suggestion form on cardmax.cc
2. Form POSTs to this worker
3. Worker creates a GitHub Issue with label `card-suggestion`
4. Clawd polls for new issues 3x daily (9am, 2pm, 7pm)
5. Clawd researches the card and adds it to the database
6. If user provided email, they get notified when done

### Testing Locally

```bash
wrangler dev
```

Then POST to `http://localhost:8787`:
```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3000" \
  -d '{"issuer":"Chase","cardName":"Test Card","notes":"Testing"}'
```
