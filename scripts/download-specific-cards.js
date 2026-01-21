#!/usr/bin/env node

/**
 * Download specific card images with more careful extraction
 */

const puppeteer = require('puppeteer');
const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');

const CONFIG = {
  outputDir: path.join(__dirname, '..', 'images', 'cards'),
  targetWidth: 400
};

// Cards to download with their NerdWallet page URLs
const CARDS_TO_DOWNLOAD = [
  // Amex Personal
  { id: 'amex-platinum', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-platinum', name: 'Platinum Card' },
  { id: 'amex-gold', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-premier-rewards-gold', name: 'Gold Card' },
  { id: 'amex-green', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-green', name: 'Green Card' },
  { id: 'amex-blue-cash-preferred', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-cash-preferred', name: 'Blue Cash Preferred' },
  // Amex Business
  { id: 'amex-business-platinum', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-platinum', name: 'Business Platinum' },
  { id: 'amex-business-gold', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-gold', name: 'Business Gold' },
  { id: 'amex-business-green', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-business-green', name: 'Business Green' },
  { id: 'amex-blue-business-plus', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-business-plus', name: 'Blue Business Plus' },
  { id: 'amex-blue-business-cash', url: 'https://www.nerdwallet.com/reviews/credit-cards/american-express-blue-business-cash', name: 'Blue Business Cash' },
  // Missing cards
  { id: 'world-of-hyatt', url: 'https://www.nerdwallet.com/reviews/credit-cards/world-of-hyatt-credit-card', name: 'World of Hyatt' },
  { id: 'ihg-one-rewards-premier', url: 'https://www.nerdwallet.com/reviews/credit-cards/ihg-one-rewards-premier', name: 'IHG Premier' },
  { id: 'united-club-infinite', url: 'https://www.nerdwallet.com/reviews/credit-cards/united-club-infinite', name: 'United Club Infinite' },
  { id: 'chase-ink-business-preferred', url: 'https://www.nerdwallet.com/reviews/credit-cards/chase-ink-business-preferred', name: 'Ink Business Preferred' },
  { id: 'chase-ink-business-cash', url: 'https://www.nerdwallet.com/reviews/credit-cards/chase-ink-business-cash', name: 'Ink Business Cash' },
  { id: 'capital-one-venture-x-business', url: 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-venture-x-business', name: 'Venture X Business' },
  { id: 'capital-one-spark-miles', url: 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-spark-miles-for-business', name: 'Spark Miles' },
  { id: 'capital-one-spark-cash-plus', url: 'https://www.nerdwallet.com/reviews/credit-cards/capital-one-spark-cash-plus', name: 'Spark Cash Plus' },
  { id: 'marriott-bonvoy-business', url: 'https://www.nerdwallet.com/reviews/credit-cards/marriott-bonvoy-business-american-express', name: 'Marriott Business' },
  { id: 'united-business-card', url: 'https://www.nerdwallet.com/reviews/credit-cards/united-business-card', name: 'United Business' },
  // Delta Business
  { id: 'delta-skymiles-gold-business', url: 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-gold-business-american-express', name: 'Delta Gold Business' },
  { id: 'delta-skymiles-platinum-business', url: 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-platinum-business-american-express', name: 'Delta Platinum Business' },
  { id: 'delta-skymiles-reserve-business', url: 'https://www.nerdwallet.com/reviews/credit-cards/delta-skymiles-reserve-business-american-express', name: 'Delta Reserve Business' }
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function downloadCard(page, card) {
  console.log(`\n[${card.id}] Navigating to ${card.url}...`);

  try {
    await page.goto(card.url, { waitUntil: 'networkidle2', timeout: 45000 });
    await delay(3000);

    // Extract the first card image - look for specific patterns
    const imageUrl = await page.evaluate((cardName) => {
      // Strategy 1: Find img with alt containing the card name
      const imgs = Array.from(document.querySelectorAll('img'));

      // First, look for images in the CDN with credit_cards
      for (const img of imgs) {
        const src = img.src || '';
        if (src.includes('/cdn/images/marketplace/credit_cards/') ||
            src.includes('cdn-cgi/image') && src.includes('credit_cards')) {
          console.log('Found CDN image:', src);
          // Upgrade to high resolution
          let highRes = src;
          if (src.includes('width=')) {
            highRes = src.replace(/width=\d+/, 'width=800');
          }
          return highRes;
        }
      }

      // Strategy 2: Look for picture elements with srcset
      const pictures = document.querySelectorAll('picture');
      for (const pic of pictures) {
        const sources = pic.querySelectorAll('source');
        for (const source of sources) {
          const srcset = source.srcset || '';
          if (srcset.includes('credit_cards')) {
            const urls = srcset.split(',').map(s => s.trim().split(' ')[0]);
            if (urls.length > 0) {
              let url = urls[urls.length - 1]; // Get largest
              if (url.includes('width=')) {
                url = url.replace(/width=\d+/, 'width=800');
              }
              return url;
            }
          }
        }
      }

      // Strategy 3: Look for any image that might be a card
      for (const img of imgs) {
        const src = img.src || '';
        const alt = (img.alt || '').toLowerCase();
        const width = img.naturalWidth || img.width || 0;
        const height = img.naturalHeight || img.height || 0;

        // Card images are usually wider than they are tall, or roughly square
        // and contain "card" in alt text
        if (width > 100 && height > 50 &&
            (alt.includes('card') || alt.includes('credit') || alt.includes('amex') || alt.includes('american express'))) {
          console.log('Found card image by alt:', src, alt);
          return src;
        }
      }

      return null;
    }, card.name);

    if (!imageUrl) {
      console.log(`[${card.id}] No image found on page`);
      return false;
    }

    console.log(`[${card.id}] Found image: ${imageUrl.substring(0, 100)}...`);

    // Download the image
    const response = await page.goto(imageUrl, { waitUntil: 'networkidle0', timeout: 30000 });

    if (!response || !response.ok()) {
      console.log(`[${card.id}] Failed to download image`);
      return false;
    }

    const buffer = await response.buffer();

    if (buffer.length < 3000) {
      console.log(`[${card.id}] Image too small (${buffer.length} bytes)`);
      return false;
    }

    // Process and save
    const outputPath = path.join(CONFIG.outputDir, `${card.id}.png`);
    await sharp(buffer)
      .resize(CONFIG.targetWidth, null, { withoutEnlargement: true })
      .png({ quality: 90 })
      .toFile(outputPath);

    console.log(`[${card.id}] Saved successfully (${buffer.length} bytes)`);
    return true;

  } catch (error) {
    console.log(`[${card.id}] Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('Starting targeted card image download...\n');

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36');

  const results = { success: [], failed: [] };

  for (const card of CARDS_TO_DOWNLOAD) {
    const success = await downloadCard(page, card);
    if (success) {
      results.success.push(card.id);
    } else {
      results.failed.push(card.id);
    }
    await delay(2000);
  }

  await browser.close();

  console.log('\n========================================');
  console.log('Download Complete');
  console.log('========================================');
  console.log(`Success: ${results.success.length}`);
  console.log(`Failed: ${results.failed.length}`);

  if (results.failed.length > 0) {
    console.log('\nFailed cards:');
    results.failed.forEach(id => console.log(`  - ${id}`));
  }
}

main().catch(console.error);
