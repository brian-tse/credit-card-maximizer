# Catalog review — September 16, 2026

The review addresses all 416 recorded findings across the original 76 cards and adds 17 researched products, for 93 total cards and 228 active credit/award records. Findings include corrections, missing conditions, unsupported claims and repeated shared-program updates; this is not a claim of 416 independent factual errors or complete verification of every account contract.

## Result

- Updated public fees, earning rates, caps, transfer ratios, benefit amounts, eligibility, application availability and effective dates using linked issuer/loyalty sources.
- Removed unsupported promises from active benefits. Preserved every published card, credit and perk ID, along with earlier benefit names for old checkbox migration.
- Kept personalized welcome offers unverified. Marked unknown fees and earning rates instead of treating them as zero or reliable comparison inputs.
- Distinguished USD cash caps from points, certificates, restricted Bilt Cash, vouchers and crypto rewards. Excluded conditional and unresolved credits from default totals; retained actual recorded conditional use in cash history.
- Included known required membership costs and retained wallet fee overrides for legacy accounts. Closed products remain available for existing holders.
- Rebuilt the Bilt billing-cycle calculator using the current mutually exclusive housing options; the old v2 URL forwards to the canonical calculator.
- Made reviewed JSON the catalog source of truth. Compilation rejects stale output and lost historical IDs. Weekly review reports now expose unresolved fields and upcoming date/cohort changes.

## Evidence and maintenance

The original findings are in `audit-findings-2026-09-16.json`. The four `audit-resolution-*.json` files record a sourced disposition for each finding, plus supplemental corrections and additions. `data/reviewed/*.json` contains the current terms, sources, field-level reviews, conditions and explicit unresolved details.

Edit the reviewed JSON and run `npm run catalog`, `npm run check`, and `npm test` before changing the generated browser catalog. Source-page changes trigger review; the weekly job never silently changes card facts.

## Validation

- 96 tests passed, including 416/416 finding coverage, 93 unique cards, published-ID preservation, benefit periods/history, conditional cash calculations, unknown fees, future earning changes, local-date expiry and Bilt tier boundaries.
- `npm ci`, dependency audit (zero vulnerabilities), catalog validation, static build and Wrangler Worker dry-run passed.
- Headless Chrome rendered all 93 cards across all five detail tabs without page errors or invalid numeric text. Desktop dashboard, rankings, transfers, tracker and comparison were checked; mobile pages were checked at 390px without horizontal overflow. Bilt inputs, tier boundaries, card selection and v2 redirect were checked separately.
- Production is released through the existing checked GitHub Actions workflow to Cloudflare Pages project `cardmax`; no host or DNS migration.

## Remaining issuer-dependent terms

All cards retain partial-review status. Full insurance exclusions, personalized offers and grandfathered account terms still require the issuer agreement. Conflicting or unavailable public terms are shown as unresolved and excluded from automatic calculations/tracking. Examples include Classic Green/Altitude Reserve account fees, the conflicting Qatar earning headline, certain transfer ratios and qualified travel credits. Amex airport-security reimbursements remain informational until the tracker can capture the choice between the four-year Global Entry and four-and-a-half-year TSA PreCheck intervals.
