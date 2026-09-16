# Production and rollback

Production is **https://cardmax.cc**, Cloudflare Pages project **cardmax**. The suggestion endpoint is **https://cardmax-suggestions.briantse.workers.dev**. Keep the existing domains and services; do not create or change DNS to release a code fix. The previous Netlify/Vercel and `cards.briantse.com` instructions were obsolete.

## Release

1. Use Node 24, run `npm ci`, `npm run check`, `npm test`, `npm audit --audit-level=high`, `npx wrangler deploy --dry-run --config workers/wrangler.jsonc`, and `npm run build`.
2. Check mobile/desktop UI, card addition, consistent comparison totals, quarterly and anniversary benefit periods, backup restore, and two-session sync.
3. Merge a checked pull request into `main`. GitHub Actions deploys the suggestion Worker before the Pages assets, then verifies `/version.json` against the commit and checks `/health` on the Worker.
4. Keep the previous deployment available for rollback. Do not purge stored user history when changing the catalog.

GitHub Actions uses the existing `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` secrets. The token needs access to Pages and the suggestion Worker; never print or export it. The Worker retains its existing server-side `GITHUB_TOKEN` secret. For manual maintenance use `npx wrangler login` and local authentication; never write credentials into project files.

A manual workflow dispatch on a feature branch deploys a Pages preview only. The Worker must be separately dry-run tested before its production deployment. Running `node scripts/verify-production.mjs` checks HTTPS, the deployed commit when `GITHUB_SHA` is supplied, required scripts, non-email suggestion UI, and Worker health without submitting a real issue.

## Rollback

Revert the faulty commit on `main` and let the checked workflow redeploy, or select the previous successful deployment in Cloudflare Pages. For an urgent Worker rollback, inspect `npx wrangler deployments list --config workers/wrangler.jsonc` and use `npx wrangler rollback <version-id> --config workers/wrangler.jsonc`. Do not roll back to an email-publishing Worker version. The static build excludes repository configuration, tests, tooling and secrets.

## Firebase

Account sync uses `users/{uid}` with per-item state stored in the owner's document. The required security contract is authenticated access only when `request.auth.uid == uid`; unauthenticated access and access to another user's document must be denied. The active server rules are managed outside this repository and must be inspected and emulator-tested before changing them. Public Firebase web configuration is not a server authorization mechanism.

The application initializes authentication on each supported page and merges changes in Firestore transactions. Real account smoke testing should use designated test accounts, never overwrite user data. Local regressions cover merge conflicts, deletions, account isolation and backup rollback; they do not certify deployed Firestore rules.

## Scheduled maintenance

`data-review.yml` checks issuer sources weekly and retains reports for 90 days. It creates a review queue, not automatic fact changes. A first-run baseline, a source change, an unavailable source and an actual verified benefit change are different states. Review the job summary/artifact and apply source-backed edits through a checked PR. No external “Clawd” scheduler is assumed.
