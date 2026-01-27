// CardMax - Card Visual Generator
// Creates credit card visuals with actual images or CSS fallback

// Cards with downloaded images (55 cards - all cards now have images)
const CARDS_WITH_IMAGES = [
  // Amex Personal
  'amex-platinum', 'amex-gold', 'amex-green', 'amex-blue-cash-preferred',
  // Amex Business
  'amex-business-platinum', 'amex-business-gold', 'amex-business-green', 'amex-blue-business-plus', 'amex-blue-business-cash',
  // Bilt
  'bilt-blue', 'bilt-obsidian', 'bilt-palladium',
  // Capital One
  'capital-one-venture', 'capital-one-venture-x', 'capital-one-venture-x-business', 'capital-one-spark-miles', 'capital-one-spark-cash-plus', 'capital-one-savor',
  // Chase Personal
  'chase-sapphire-reserve', 'chase-sapphire-preferred', 'chase-freedom-unlimited', 'chase-freedom-flex', 'amazon-prime-visa',
  // Chase Business
  'chase-ink-business-unlimited', 'chase-ink-business-preferred', 'chase-ink-business-cash',
  // Citi
  'citi-double-cash', 'citi-strata-premier', 'citi-strata-elite', 'citi-costco-anywhere',
  // Delta Personal
  'delta-skymiles-gold', 'delta-skymiles-platinum', 'delta-skymiles-reserve',
  // Delta Business
  'delta-skymiles-gold-business', 'delta-skymiles-platinum-business', 'delta-skymiles-reserve-business',
  // Hilton
  'hilton-honors-aspire', 'hilton-honors-surpass', 'hilton-honors-business',
  // Hotels
  'marriott-bonvoy-boundless', 'marriott-bonvoy-business', 'world-of-hyatt', 'ihg-one-rewards-premier', 'ihg-one-rewards-traveler',
  // Southwest
  'southwest-priority', 'southwest-performance-business', 'southwest-premier-business',
  // United
  'united-explorer', 'united-quest', 'united-club-infinite', 'united-business-card',
  // Bank of America
  'bofa-business-advantage-unlimited', 'bank-of-america-customized-cash-rewards', 'boa-atmos-ascent', 'atmos-rewards-summit',
  // Other
  'discover-it-cash-back', 'us-bank-altitude-reserve',
  'wells-fargo-active-cash', 'wells-fargo-autograph-journey',
  'gemini-credit-card'
];

// Get issuer class name for styling
function getIssuerClass(issuer) {
  const classMap = {
    'Chase': 'chase',
    'American Express': 'amex',
    'Capital One': 'capital-one',
    'Citi': 'citi',
    'Cardless': 'bilt',
    'Bilt': 'bilt',
    'Discover': 'discover',
    'Wells Fargo': 'wells-fargo',
    'US Bank': 'us-bank',
    'Bank of America': 'bofa',
    'Barclays': 'barclays'
  };
  return classMap[issuer] || '';
}

// Check if card is premium (metal)
function isPremiumCard(card) {
  return card.annualFee >= 400;
}

// Get short issuer name for logo text
function getIssuerLogoText(issuer) {
  const logoText = {
    'Chase': 'CHASE',
    'American Express': 'AMEX',
    'Capital One': 'CAPITAL ONE',
    'Citi': 'CITI',
    'Cardless': 'BILT',
    'Bilt': 'BILT',
    'Discover': 'DISCOVER',
    'Wells Fargo': 'WELLS FARGO',
    'US Bank': 'US BANK',
    'Bank of America': 'BANK OF AMERICA',
    'Barclays': 'BARCLAYS'
  };
  return logoText[issuer] || issuer.toUpperCase();
}

// Check if card has an image
function hasCardImage(cardId) {
  return CARDS_WITH_IMAGES.includes(cardId);
}

// Get card image path (works from any directory)
function getCardImagePath(cardId) {
  // Determine if we're in a subdirectory (like /pages/)
  const path = window.location.pathname;
  const isInSubdir = path.includes('/pages/');
  const basePath = isInSubdir ? '../' : '';
  return `${basePath}images/cards/${cardId}.png`;
}

// Generate card visual HTML
function generateCardVisual(card) {
  // If card has an actual image, use it
  if (hasCardImage(card.id)) {
    return `
      <div class="card-visual card-visual-image">
        <img src="${getCardImagePath(card.id)}" alt="${card.name}" class="card-image" onerror="this.parentElement.innerHTML = CardVisuals.generateFallback(window.CARDS_DATABASE?.find(c => c.id === '${card.id}') || {color: '${card.color}', issuer: '${card.issuer}', network: '${card.network}'})">
      </div>
    `;
  }

  // Fallback to CSS-based visual
  return generateFallbackVisual(card);
}

// Generate CSS-based fallback visual
function generateFallbackVisual(card) {
  const issuerClass = getIssuerClass(card.issuer);
  const metalClass = isPremiumCard(card) ? 'metal' : '';
  const logoText = getIssuerLogoText(card.issuer);

  // Use card's specific color if available, otherwise use issuer default
  const customStyle = card.color ? `background: linear-gradient(135deg, ${card.color} 0%, ${adjustColor(card.color, -30)} 100%);` : '';

  return `
    <div class="card-visual ${issuerClass} ${metalClass}" ${customStyle ? `style="${customStyle}"` : ''}>
      <div class="card-logo">${logoText}</div>
      <div class="card-chip"></div>
      <div class="card-network">${card.network || 'VISA'}</div>
    </div>
  `;
}

// Adjust color brightness (for gradient effect)
function adjustColor(color, percent) {
  // Handle hex colors
  if (color.startsWith('#')) {
    const num = parseInt(color.slice(1), 16);
    const r = Math.max(0, Math.min(255, ((num >> 16) + percent)));
    const g = Math.max(0, Math.min(255, (((num >> 8) & 0x00FF) + percent)));
    const b = Math.max(0, Math.min(255, ((num & 0x0000FF) + percent)));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
  return color;
}

// Export for use in other files
window.CardVisuals = {
  generate: generateCardVisual,
  generateFallback: generateFallbackVisual,
  getIssuerClass,
  isPremiumCard,
  getIssuerLogoText,
  hasImage: hasCardImage,
  getImagePath: getCardImagePath
};
