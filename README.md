# CardMax

[cardmax.cc](https://cardmax.cc) helps people track card benefits and compare annual cash credit caps. Source: [brian-tse/credit-card-maximizer](https://github.com/brian-tse/credit-card-maximizer). Production uses Cloudflare Pages project `cardmax`; suggestions use the separate `cardmax-suggestions` Worker. Firebase Authentication and Firestore provide optional account sync.

## Develop and check

Use Node 24 (`nvm use`).

```sh
PUPPETEER_SKIP_DOWNLOAD=true npm ci
npm run check
npm test
npm run build
python3 -m http.server 3000 --directory dist
```

Only files copied into `dist/` are deployed. The application is static HTML/CSS/JavaScript and needs no framework build. Image-download dependencies are development tools; browser binaries are not needed for tests or deployment. To use the optional image scripts, install Puppeteer's browser separately with `npx puppeteer browsers install chrome`.

## Data maintenance

Edit the issuer JSON files in `data/reviewed/`, then run `npm run catalog`. The generated `data/cards.js` is the only catalog sent to browsers; CI rejects stale output. The September 16, 2026 review covers 76 existing cards and adds 17 researched products. Original findings and their dispositions are in `docs/audit-findings-2026-09-16.json` and `docs/audit-resolution-*.json`.

A credit's `amount` is its total annual cap for monthly, quarterly, semiannual and annual benefits. Per-period amounts are explicit. Every credit has a stable `id`, explicit `unit`, source/review metadata and reset rules. Never rename an existing benefit ID when changing its display name; archive removed records in `retiredBenefits` or `retiredPerks`. Compilation checks all previously published IDs. `USD` is distinct from points, nights, certificates, visits, percentages, vouchers and Bilt Cash. Multi-year USD reimbursements are annualized; conditional, unverified, noncash and per-use benefits are excluded from annual cash totals.

Use `trackingEnabled: false` when the reset or eligibility cannot safely be modeled, and `valuationEnabled: false` or `annualValueExcluded: true` when the number must not enter annual cash totals. Spend-gated benefits use `conditional: true` plus explicit eligibility. Airport-security alternatives with different reimbursement intervals remain informational until the user can choose the applicable program. Known required membership fees are separate from the card fee and included in annual cost. An unverified annual fee does not become zero; a holder can enter their actual billed fee.

Use official issuer sources. Record exactly which fields were checked in `verifiedFields`. A partial review uses `reviewedAt`, `verificationStatus: 'partially-verified'`, and `verifiedAt: null`; do not represent it as a complete card verification. Preserve effective dates and customer-cohort conditions. Welcome offers vary and should be checked at the issuer; unverified historical offers are not presented as current. Valuations in `data/valuations.js` are estimates, not issuer facts.

```sh
npm run review-data
npm run review-data -- --fetch
```

The first command produces a review queue; the second also checks issuer pages with bounded requests and compares content fingerprints with the previous run. Reports are in `reports/`. A page change or fetch failure requires human review and never edits the database or stamps verification dates automatically.

GitHub's **Weekly issuer review** runs Mondays at 16:00 UTC. It stores a review report as an Actions artifact and job summary. First run establishes the source baseline. Monthly Dependabot PRs cover development packages and Actions. Review popular cards and overdue records monthly; verify rotating categories, transfer partners, lounge conditions, backups and sync quarterly.

## User data

Data stays in browser storage for guests. Signed-in accounts have isolated namespaces, per-item revisions and tombstones; Firestore transactions merge concurrent changes instead of replacing an entire stale snapshot. Never log or commit user backups. Backup version 3 includes cards, benefit usage, dates and settings; imports are validated before writes and retain a local recovery snapshot. New benefit period IDs preserve history. Previously deleted history cannot be reconstructed.

Firebase client config is public project metadata; access security must be enforced with Firestore rules. Do not deploy rules without testing against the active project. See `DEPLOYMENT.md` for the owner-only rules contract and server-verification limitations.

## Suggestions and privacy

Suggestion text is published to public GitHub issues. The form discloses that destination, does not collect email, and does not promise email updates. The Worker ignores legacy email fields, redacts email addresses pasted into text, limits request size and frequency, and avoids logging submission bodies. Never place notification addresses or tokens into issue bodies, HTML comments, repository files or logs.

`node scripts/redact-suggestion-emails.mjs` is a dry run; `--apply` redacts legacy generated issue bodies using existing `gh` authentication without logging addresses. GitHub edit-history revisions need a separate purge through GitHub's controls; editing a body alone does not erase its history.

## Deployment

Pull requests run data validation, regressions, dependency audit, Worker bundle validation and the static build. Pushes to `main` repeat those checks before deploying the Worker and Pages, then verify production. A manual deployment of a non-main branch creates a Pages preview and does not deploy the production Worker. See [DEPLOYMENT.md](DEPLOYMENT.md) for setup and rollback.
