// CardMax - Card Visual Generator
// Creates CSS-based credit card visuals with issuer branding

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

// Generate card visual HTML
function generateCardVisual(card) {
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
  getIssuerClass,
  isPremiumCard,
  getIssuerLogoText
};
