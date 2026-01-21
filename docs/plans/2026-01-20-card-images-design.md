# Card Images Feature Design

**Date:** 2026-01-20
**Status:** Approved

## Overview

Add high-fidelity credit card images to CardMax, replacing the current color-bar placeholders with actual card visuals.

## Requirements

- High-res PNG images (~400-600px wide), transparent backgrounds preferred
- Fallback to official marketing images, then cropped card-only images
- Store locally in repo and serve via GitHub Pages
- Fully automated scraping/download process

## Image Scraping Strategy

### Primary Source: NerdWallet
- Consistent, high-quality card images at predictable URLs
- Format: `https://www.nerdwallet.com/cdn-cgi/image/width=400,quality=85/...`
- Most major cards covered with clean product shots

### Fallback Sources (in order)
1. CardRatings / The Points Guy - Good coverage of premium cards
2. Official issuer sites - Chase, Amex, Capital One, etc.
3. Google Images - Last resort for obscure cards

### Script Logic
```
For each card in CARDS_DATABASE:
  1. Try NerdWallet URL pattern
  2. If 404 or low quality → try fallback sources
  3. Download to /images/cards/{card-id}.png
  4. Log success/failure for manual review
```

## Technical Implementation

### Script: Node.js with Puppeteer

Location: `/scripts/download-card-images.js`

**Components:**
- Card URL mappings (NerdWallet patterns + manual overrides)
- Download with retry logic (3 attempts, exponential backoff)
- Image validation (check dimensions, file size > 5KB)
- Progress logging with colored output
- Generate report of successes/failures

**Dependencies:**
- `puppeteer` - Browser automation
- `sharp` - Image processing (resize, convert to PNG, optimize)
- `fs-extra` - File operations

**Rate Limiting:**
- 2-second delay between requests
- Randomized delays (1.5-3s) to appear more human
- User-agent rotation

### Output Directory Structure
```
/images/cards/
├── chase-sapphire-reserve.png
├── amex-platinum.png
├── capital-one-venture-x.png
└── ... (55 total)
```

## Website Integration

### Card Database Updates
- Add `image` field to each card in `data/cards.js`
- Format: `image: "images/cards/chase-sapphire-reserve.png"`
- Fallback to current color-bar visual if image fails to load

### Card Visuals Updates
- Modify `js/card-visuals.js` to use actual images
- Display as card thumbnail (~60-80px width in lists, larger in detail views)
- CSS `object-fit: cover` with rounded corners

## GitHub Setup

```bash
# Add images and push
git add images/cards/
git commit -m "Add credit card images"
git push origin main

# Enable GitHub Pages (Settings → Pages → Deploy from main branch)
```

Image URLs after deployment:
```
https://USERNAME.github.io/credit-card-tracker/images/cards/chase-sapphire-reserve.png
```

## Execution Plan

1. **Setup** - Create scripts directory, install dependencies, create images directory
2. **Run Scraper** - Download all ~55 card images, review failures
3. **Update Codebase** - Add image fields to cards.js, update card-visuals.js
4. **Push to GitHub** - Commit, push, enable GitHub Pages, verify

## Estimated Impact

- ~55 images × ~50-100KB each = ~3-5MB total
- Well within GitHub's limits
