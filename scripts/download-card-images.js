#!/usr/bin/env node

/**
 * Credit Card Image Downloader v2
 * Downloads high-quality card images by scraping NerdWallet card pages
 */

const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'images', 'cards'),
  minFileSize: 3000,
  targetWidth: 400,
  delayMin: 2000,
  delayMax: 4000,
  maxRetries: 2
};

// Card to NerdWallet page URL mappings
const NERDWALLET_PAGES = {
  'chase-sapphire-reserve': 'https://www.nerdwallet.com/reviews/credit-cards/chase-sapphire-reserve',
  'amex-platinum': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-platinum',
  'capital-one-venture-x': 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-venture-x',
  'chase-sapphire-preferred': 'https://www.nerdwallet.com/reviews/credit-cards/chase-sapphire-preferred',
  'amex-gold': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-gold-card',
  'citi-double-cash': 'https://www.nerdwallet.com/reviews/credit-cards/citi-double-cash',
  'chase-freedom-unlimited': 'https://www.nerdwallet.com/reviews/credit-cards/chase-freedom-unlimited',
  'chase-freedom-flex': 'https://www.nerdwallet.com/reviews/credit-cards/chase-freedom-flex',
  'discover-it-cash-back': 'https://www.nerdwallet.com/reviews/credit-cards/discover-it-cash-back',
  'amex-blue-cash-preferred': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-cash-preferred',
  'wells-fargo-active-cash': 'https://www.nerdwallet.com/reviews/credit-cards/wells-fargo-active-cash',
  'capital-one-venture': 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-venture-rewards',
  'wells-fargo-autograph-journey': 'https://www.nerdwallet.com/reviews/credit-cards/wells-fargo-autograph-journey',
  'world-of-hyatt': 'https://www.nerdwallet.com/reviews/credit-cards/world-of-hyatt-credit-card',
  'marriott-bonvoy-boundless': 'https://www.nerdwallet.com/reviews/credit-cards/marriott-bonvoy-boundless',
  'hilton-honors-surpass': 'https://www.nerdwallet.com/reviews/credit-cards/hilton-honors-american-express-surpass',
  'hilton-honors-aspire': 'https://www.nerdwallet.com/reviews/credit-cards/hilton-honors-american-express-aspire',
  'ihg-one-rewards-premier': 'https://www.nerdwallet.com/reviews/credit-cards/ihg-one-rewards-premier',
  'delta-skymiles-gold': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-gold-american-express',
  'delta-skymiles-platinum': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-platinum-american-express',
  'delta-skymiles-reserve': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-reserve-american-express',
  'united-explorer': 'https://www.nerdwallet.com/reviews/credit-cards/united-explorer',
  'united-club-infinite': 'https://www.nerdwallet.com/reviews/credit-cards/united-club-infinite',
  'united-quest': 'https://www.nerdwallet.com/reviews/credit-cards/united-quest',
  'southwest-priority': 'https://www.nerdwallet.com/reviews/credit-cards/southwest-rapid-rewards-priority',
  'citi-strata-premier': 'https://www.nerdwallet.com/reviews/credit-cards/citi-strata-premier',
  'amex-green': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-green',
  'chase-ink-business-unlimited': 'https://www.nerdwallet.com/reviews/credit-cards/chase-ink-business-unlimited',
  'chase-ink-business-preferred': 'https://www.nerdwallet.com/reviews/credit-cards/chase-ink-business-preferred',
  'chase-ink-business-cash': 'https://www.nerdwallet.com/reviews/credit-cards/chase-ink-business-cash',
  'amex-business-platinum': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-platinum',
  'amex-business-gold': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-gold',
  'amex-blue-business-plus': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-business-plus',
  'capital-one-spark-miles': 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-spark-miles-for-business',
  'capital-one-spark-cash-plus': 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-spark-cash-plus',
  // Additional cards
  'citi-strata-elite': 'https://www.nerdwallet.com/reviews/credit-cards/citi-strata-elite',
  'us-bank-altitude-reserve': 'https://www.nerdwallet.com/reviews/credit-cards/us-bank-altitude-reserve',
  'bilt-mastercard': 'https://www.nerdwallet.com/reviews/credit-cards/bilt-world-elite-mastercard',
  'amex-blue-business-cash': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-business-cash',
  'amex-business-green': 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-green',
  'capital-one-venture-x-business': 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-venture-x-business',
  'delta-skymiles-gold-business': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-gold-business-american-express',
  'delta-skymiles-platinum-business': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-platinum-business-american-express',
  'delta-skymiles-reserve-business': 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-reserve-business-american-express',
  'united-business-card': 'https://www.nerdwallet.com/reviews/credit-cards/united-business-card',
  'southwest-performance-business': 'https://www.nerdwallet.com/reviews/credit-cards/southwest-rapid-rewards-performance-business',
  'southwest-premier-business': 'https://www.nerdwallet.com/reviews/credit-cards/southwest-rapid-rewards-premier-business',
  'marriott-bonvoy-business': 'https://www.nerdwallet.com/reviews/credit-cards/marriott-bonvoy-business-american-express',
  'hilton-honors-business': 'https://www.nerdwallet.com/reviews/credit-cards/hilton-honors-american-express-business',
  'bofa-business-advantage-unlimited': 'https://www.nerdwallet.com/reviews/credit-cards/bank-of-america-business-advantage-unlimited-cash-rewards',
  'citi-costco-anywhere': 'https://www.nerdwallet.com/reviews/credit-cards/costco-anywhere-visa-card-by-citi'
};

// Fallback: Official issuer card pages
const ISSUER_PAGES = {
  'chase-sapphire-reserve': 'https://creditcards.chase.com/rewards-credit-cards/sapphire/reserve',
  'chase-sapphire-preferred': 'https://creditcards.chase.com/rewards-credit-cards/sapphire/preferred',
  'chase-freedom-unlimited': 'https://creditcards.chase.com/cash-back-credit-cards/freedom/unlimited',
  'chase-freedom-flex': 'https://creditcards.chase.com/cash-back-credit-cards/freedom/flex',
  'chase-ink-business-unlimited': 'https://creditcards.chase.com/business-credit-cards/ink/unlimited',
  'chase-ink-business-preferred': 'https://creditcards.chase.com/business-credit-cards/ink/business-preferred',
  'chase-ink-business-cash': 'https://creditcards.chase.com/business-credit-cards/ink/cash',
  'world-of-hyatt': 'https://creditcards.chase.com/travel-credit-cards/world-of-hyatt-credit-card',
  'marriott-bonvoy-boundless': 'https://creditcards.chase.com/travel-credit-cards/marriott-bonvoy/boundless',
  'united-explorer': 'https://creditcards.chase.com/travel-credit-cards/united/united-explorer',
  'united-club-infinite': 'https://creditcards.chase.com/travel-credit-cards/united/club-infinite',
  'united-quest': 'https://creditcards.chase.com/travel-credit-cards/united/quest',
  'southwest-priority': 'https://creditcards.chase.com/travel-credit-cards/southwest/priority',
  'southwest-performance-business': 'https://creditcards.chase.com/business-credit-cards/southwest/performance-business',
  'southwest-premier-business': 'https://creditcards.chase.com/business-credit-cards/southwest/premier-business',
  'united-business-card': 'https://creditcards.chase.com/business-credit-cards/united/business',
  'marriott-bonvoy-business': 'https://creditcards.chase.com/business-credit-cards/marriott-bonvoy/business',
  'amex-platinum': 'https://www.americanexpress.com/us/credit-cards/card/platinum/',
  'amex-gold': 'https://www.americanexpress.com/us/credit-cards/card/gold-card/',
  'amex-green': 'https://www.americanexpress.com/us/credit-cards/card/green/',
  'amex-blue-cash-preferred': 'https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/',
  'amex-business-platinum': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/',
  'amex-business-gold': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-gold-card-amex/',
  'amex-blue-business-plus': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/blue-business-plus-credit-card-amex/',
  'amex-blue-business-cash': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/blue-business-cash-card-amex/',
  'amex-business-green': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-green-card-amex/',
  'hilton-honors-surpass': 'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-surpass/',
  'hilton-honors-aspire': 'https://www.americanexpress.com/us/credit-cards/card/hilton-honors-aspire/',
  'hilton-honors-business': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/hilton-honors-business-card-amex/',
  'delta-skymiles-gold': 'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-gold-american-express-card/',
  'delta-skymiles-platinum': 'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-platinum-american-express-card/',
  'delta-skymiles-reserve': 'https://www.americanexpress.com/us/credit-cards/card/delta-skymiles-reserve-american-express-card/',
  'delta-skymiles-gold-business': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/delta-skymiles-gold-business-credit-card-amex/',
  'delta-skymiles-platinum-business': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/delta-skymiles-platinum-business-credit-card-amex/',
  'delta-skymiles-reserve-business': 'https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/delta-skymiles-reserve-business-credit-card-amex/',
  'capital-one-venture-x': 'https://www.capitalone.com/credit-cards/venture-x/',
  'capital-one-venture': 'https://www.capitalone.com/credit-cards/venture/',
  'capital-one-venture-x-business': 'https://www.capitalone.com/small-business/credit-cards/venture-x-business/',
  'capital-one-spark-miles': 'https://www.capitalone.com/small-business/credit-cards/spark-miles/',
  'capital-one-spark-cash-plus': 'https://www.capitalone.com/small-business/credit-cards/spark-cash-plus/',
  'citi-double-cash': 'https://www.citi.com/credit-cards/citi-double-cash-credit-card',
  'citi-strata-premier': 'https://www.citi.com/credit-cards/citi-strata-premier-credit-card',
  'citi-strata-elite': 'https://www.citi.com/credit-cards/citi-strata-elite-credit-card',
  'citi-costco-anywhere': 'https://www.citi.com/credit-cards/citi-costco-anywhere-visa-credit-card',
  'discover-it-cash-back': 'https://www.discover.com/credit-cards/cash-back/it-card.html',
  'us-bank-altitude-reserve': 'https://www.usbank.com/credit-cards/altitude-reserve-visa-infinite-credit-card.html',
  'ihg-one-rewards-premier': 'https://creditcards.chase.com/travel-credit-cards/ihg-one-rewards/premier',
  'bilt-mastercard': 'https://www.biltrewards.com/card',
  'bilt-blue': 'https://www.biltrewards.com/card',
  'bilt-obsidian': 'https://www.biltrewards.com/card',
  'bilt-palladium': 'https://www.biltrewards.com/card'
};

// User agents
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15'
];

// Utilities
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(CONFIG.delayMin + Math.random() * (CONFIG.delayMax - CONFIG.delayMin));
const randomUserAgent = () => USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

const log = {
  info: (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`),
  success: (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  error: (msg) => console.log(`\x1b[31m[ERROR]\x1b[0m ${msg}`),
  progress: (current, total, msg) => console.log(`\x1b[35m[${current}/${total}]\x1b[0m ${msg}`)
};

// Get card IDs from database
async function getCardIds() {
  const cardsPath = path.join(__dirname, '..', 'data', 'cards.js');
  const content = await fs.readFile(cardsPath, 'utf-8');
  const idMatches = content.match(/id:\s*["']([^"']+)["']/g);
  if (!idMatches) throw new Error('Could not parse card IDs');
  return [...new Set(idMatches.map(m => m.match(/["']([^"']+)["']/)[1]))];
}

// Extract card image from NerdWallet page
async function extractFromNerdWallet(page, cardId) {
  const url = NERDWALLET_PAGES[cardId];
  if (!url) return null;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(2000);

    // Look for card images - NerdWallet typically uses these patterns
    const imageUrl = await page.evaluate(() => {
      // Try to find the main card image
      const selectors = [
        'img[data-testid="card-art"]',
        'img[alt*="card" i]',
        'img[src*="credit_cards"]',
        'img[src*="card-art"]',
        '.card-art img',
        '[class*="cardImage"] img',
        '[class*="CardImage"] img',
        'picture img[src*="marketplace"]'
      ];

      for (const selector of selectors) {
        const img = document.querySelector(selector);
        if (img && img.src && (img.src.includes('credit_cards') || img.src.includes('card'))) {
          // Get highest resolution version
          let src = img.src;
          if (src.includes('width=')) {
            src = src.replace(/width=\d+/, 'width=800');
          }
          return src;
        }
      }

      // Fallback: find any card-like image
      const allImages = Array.from(document.querySelectorAll('img'));
      for (const img of allImages) {
        if (img.src &&
            (img.src.includes('credit_cards') ||
             img.src.includes('card-art') ||
             (img.alt && img.alt.toLowerCase().includes('card')))) {
          return img.src;
        }
      }

      return null;
    });

    return imageUrl;
  } catch (error) {
    return null;
  }
}

// Extract card image from issuer website
async function extractFromIssuer(page, cardId) {
  const url = ISSUER_PAGES[cardId];
  if (!url) return null;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await delay(3000);

    const imageUrl = await page.evaluate(() => {
      // Issuer-specific selectors
      const selectors = [
        // Chase
        'img[data-testid="card-image"]',
        '.card-image img',
        '.mds-card-image img',
        // Amex
        'img[data-qe-id="card-art"]',
        '.card-art-module img',
        // Capital One
        '.product-card-image img',
        // General
        'img[alt*="card" i][src*="card"]',
        'picture source[srcset*="card"]'
      ];

      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const src = element.src || element.srcset?.split(' ')[0];
          if (src) return src;
        }
      }

      // Find largest card-like image
      const images = Array.from(document.querySelectorAll('img'));
      let bestImage = null;
      let maxSize = 0;

      for (const img of images) {
        if (img.src &&
            img.naturalWidth > 100 &&
            (img.alt?.toLowerCase().includes('card') ||
             img.src.toLowerCase().includes('card'))) {
          const size = img.naturalWidth * img.naturalHeight;
          if (size > maxSize) {
            maxSize = size;
            bestImage = img.src;
          }
        }
      }

      return bestImage;
    });

    return imageUrl;
  } catch (error) {
    return null;
  }
}

// Download and process image
async function downloadAndProcessImage(page, imageUrl, outputPath) {
  try {
    const response = await page.goto(imageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    if (!response || !response.ok()) return false;

    const contentType = response.headers()['content-type'] || '';
    if (!contentType.includes('image')) return false;

    const buffer = await response.buffer();
    if (buffer.length < CONFIG.minFileSize) return false;

    // Process image
    await sharp(buffer)
      .resize(CONFIG.targetWidth, null, { withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(outputPath);

    return true;
  } catch (error) {
    return false;
  }
}

// Main download function for a single card
async function downloadCardImage(page, cardId, index, total) {
  const outputPath = path.join(CONFIG.outputDir, `${cardId}.png`);

  // Skip if exists
  if (await fs.pathExists(outputPath)) {
    const stats = await fs.stat(outputPath);
    if (stats.size > CONFIG.minFileSize) {
      log.progress(index, total, `${cardId} - exists, skipping`);
      return { cardId, status: 'skipped', source: 'existing' };
    }
  }

  log.progress(index, total, `${cardId} - downloading...`);
  await page.setUserAgent(randomUserAgent());

  // Try NerdWallet first
  let imageUrl = await extractFromNerdWallet(page, cardId);
  let source = 'nerdwallet';

  // Fallback to issuer
  if (!imageUrl) {
    imageUrl = await extractFromIssuer(page, cardId);
    source = 'issuer';
  }

  if (imageUrl) {
    await page.setUserAgent(randomUserAgent());
    const success = await downloadAndProcessImage(page, imageUrl, outputPath);
    if (success) {
      log.success(`${cardId} - downloaded from ${source}`);
      await randomDelay();
      return { cardId, status: 'success', source };
    }
  }

  log.warn(`${cardId} - failed, needs manual download`);
  await randomDelay();
  return { cardId, status: 'failed', source: null };
}

// Main
async function main() {
  console.log('\n========================================');
  console.log('   Credit Card Image Downloader v2');
  console.log('========================================\n');

  await fs.ensureDir(CONFIG.outputDir);

  const cardIds = await getCardIds();
  log.info(`Found ${cardIds.length} cards\n`);

  log.info('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Block unnecessary resources for speed
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const type = req.resourceType();
    if (['stylesheet', 'font', 'media'].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  const results = [];
  for (let i = 0; i < cardIds.length; i++) {
    const result = await downloadCardImage(page, cardIds[i], i + 1, cardIds.length);
    results.push(result);
  }

  await browser.close();

  // Report
  console.log('\n========================================');
  console.log('   Download Report');
  console.log('========================================\n');

  const successful = results.filter(r => r.status === 'success');
  const skipped = results.filter(r => r.status === 'skipped');
  const failed = results.filter(r => r.status === 'failed');

  log.success(`Downloaded: ${successful.length}`);
  log.info(`Skipped: ${skipped.length}`);
  log.error(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed (need manual download):');
    failed.forEach(r => console.log(`  - ${r.cardId}`));
  }

  // Save report
  const reportPath = path.join(CONFIG.outputDir, 'download-report.json');
  await fs.writeJson(reportPath, {
    timestamp: new Date().toISOString(),
    total: cardIds.length,
    successful: successful.length,
    skipped: skipped.length,
    failed: failed.length,
    results
  }, { spaces: 2 });

  log.info(`\nReport saved to: ${reportPath}`);
}

main().catch(error => {
  log.error(`Fatal: ${error.message}`);
  process.exit(1);
});
