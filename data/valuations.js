// Point/Mile Valuations Database
// Values are in cents per point
// Last updated: January 2026

const DEFAULT_VALUATIONS = {
  // Transferable Bank Points
  'amex-mr': { name: 'Amex Membership Rewards', category: 'Transferable Bank Points', value: 1.85 },
  'chase-ur': { name: 'Chase Ultimate Rewards', category: 'Transferable Bank Points', value: 1.88 },
  'capital-one': { name: 'Capital One Miles', category: 'Transferable Bank Points', value: 1.77 },
  'citi-typ': { name: 'Citi ThankYou Points', category: 'Transferable Bank Points', value: 1.80 },
  'bilt': { name: 'Bilt Rewards', category: 'Transferable Bank Points', value: 1.95 },
  'wells-fargo': { name: 'Wells Fargo Rewards', category: 'Transferable Bank Points', value: 1.65 },

  // Airline Miles
  'alaska': { name: 'Alaska Airlines Mileage Plan', category: 'Airline Miles', value: 1.48 },
  'american': { name: 'American Airlines AAdvantage', category: 'Airline Miles', value: 1.52 },
  'delta': { name: 'Delta SkyMiles', category: 'Airline Miles', value: 1.18 },
  'united': { name: 'United MileagePlus', category: 'Airline Miles', value: 1.20 },
  'southwest': { name: 'Southwest Rapid Rewards', category: 'Airline Miles', value: 1.27 },
  'jetblue': { name: 'JetBlue TrueBlue', category: 'Airline Miles', value: 1.38 },
  'aeroplan': { name: 'Air Canada Aeroplan', category: 'Airline Miles', value: 1.45 },
  'avios': { name: 'British Airways Avios', category: 'Airline Miles', value: 1.35 },
  'flying-blue': { name: 'Air France KLM Flying Blue', category: 'Airline Miles', value: 1.30 },
  'ana': { name: 'ANA Mileage Club', category: 'Airline Miles', value: 1.40 },
  'krisflyer': { name: 'Singapore KrisFlyer', category: 'Airline Miles', value: 1.35 },
  'virgin-atlantic': { name: 'Virgin Atlantic Flying Club', category: 'Airline Miles', value: 1.20 },
  'lifemiles': { name: 'Avianca LifeMiles', category: 'Airline Miles', value: 1.35 },
  'emirates': { name: 'Emirates Skywards', category: 'Airline Miles', value: 1.20 },
  'etihad': { name: 'Etihad Guest', category: 'Airline Miles', value: 1.15 },
  'turkish': { name: 'Turkish Miles and Smiles', category: 'Airline Miles', value: 1.20 },
  'asia-miles': { name: 'Cathay Pacific Asia Miles', category: 'Airline Miles', value: 1.25 },

  // Hotel Points
  'hyatt': { name: 'World of Hyatt', category: 'Hotel Points', value: 1.60 },
  'marriott': { name: 'Marriott Bonvoy', category: 'Hotel Points', value: 0.70 },
  'hilton': { name: 'Hilton Honors', category: 'Hotel Points', value: 0.50 },
  'ihg': { name: 'IHG One Rewards', category: 'Hotel Points', value: 0.50 },
  'choice': { name: 'Choice Privileges', category: 'Hotel Points', value: 0.60 },
  'wyndham': { name: 'Wyndham Rewards', category: 'Hotel Points', value: 0.90 },
  'accor': { name: 'Accor Live Limitless', category: 'Hotel Points', value: 2.00 },
  'best-western': { name: 'Best Western Rewards', category: 'Hotel Points', value: 0.55 },

  // Cash Back (always 1 cent per point)
  'cashback': { name: 'Cash Back', category: 'Cash Back', value: 1.00 }
};

// Map card earning currencies to valuation keys
const CURRENCY_TO_VALUATION = {
  // Chase
  'Ultimate Rewards': 'chase-ur',
  'Chase Ultimate Rewards': 'chase-ur',

  // Amex
  'Membership Rewards': 'amex-mr',
  'Amex Membership Rewards': 'amex-mr',

  // Capital One
  'Venture Miles': 'capital-one',
  'Capital One Miles': 'capital-one',

  // Citi
  'ThankYou Points': 'citi-typ',
  'Citi ThankYou Points': 'citi-typ',

  // Bilt
  'Bilt Rewards': 'bilt',
  'Bilt Points': 'bilt',

  // Wells Fargo
  'Wells Fargo Rewards': 'wells-fargo',

  // Airlines
  'Alaska Miles': 'alaska',
  'AAdvantage Miles': 'american',
  'SkyMiles': 'delta',
  'Delta SkyMiles': 'delta',
  'MileagePlus': 'united',
  'United MileagePlus': 'united',
  'Rapid Rewards': 'southwest',
  'Southwest Rapid Rewards': 'southwest',
  'TrueBlue Points': 'jetblue',
  'Aeroplan Points': 'aeroplan',
  'Avios': 'avios',
  'Flying Blue Miles': 'flying-blue',

  // Hotels
  'World of Hyatt Points': 'hyatt',
  'Hyatt Points': 'hyatt',
  'Bonvoy Points': 'marriott',
  'Marriott Bonvoy Points': 'marriott',
  'Hilton Honors Points': 'hilton',
  'IHG Points': 'ihg',
  'IHG One Rewards Points': 'ihg',
  'Choice Privileges Points': 'choice',
  'Wyndham Points': 'wyndham',

  // Cash Back
  'Cash Back': 'cashback',
  'Cashback': 'cashback',
  'cash back': 'cashback'
};

// Determine valuation key for a card based on its properties
function getCardValuationKey(card) {
  // First check if signUpBonus currency is mapped
  if (card.signUpBonus && card.signUpBonus.currency) {
    const mappedKey = CURRENCY_TO_VALUATION[card.signUpBonus.currency];
    if (mappedKey) return mappedKey;
  }

  // Check by card ID for cobranded cards
  const cardId = card.id.toLowerCase();

  // Hotel cobranded cards
  if (cardId.includes('ihg')) return 'ihg';
  if (cardId.includes('hyatt')) return 'hyatt';
  if (cardId.includes('marriott') || cardId.includes('bonvoy')) return 'marriott';
  if (cardId.includes('hilton')) return 'hilton';

  // Airline cobranded cards
  if (cardId.includes('delta')) return 'delta';
  if (cardId.includes('united')) return 'united';
  if (cardId.includes('southwest')) return 'southwest';
  if (cardId.includes('alaska')) return 'alaska';
  if (cardId.includes('american') && cardId.includes('airline')) return 'american';
  if (cardId.includes('jetblue')) return 'jetblue';

  // Issuer-based for non-cobranded
  if (cardId.includes('chase') || card.issuer === 'Chase') return 'chase-ur';
  if (cardId.includes('amex') || card.issuer === 'American Express') return 'amex-mr';
  if (cardId.includes('capital-one') || card.issuer === 'Capital One') return 'capital-one';
  if (cardId.includes('citi') || card.issuer === 'Citi') return 'citi-typ';
  if (cardId.includes('bilt') || card.issuer === 'Cardless') return 'bilt';
  if (cardId.includes('wells-fargo') || card.issuer === 'Wells Fargo') return 'wells-fargo';

  // Default to cash back
  return 'cashback';
}

// Get user's custom valuations or defaults
function getValuations() {
  const customValuations = localStorage.getItem('cardmax_point_valuations');
  if (customValuations) {
    const custom = JSON.parse(customValuations);
    // Merge custom with defaults (custom overrides default values)
    const merged = {};
    Object.keys(DEFAULT_VALUATIONS).forEach(key => {
      merged[key] = {
        ...DEFAULT_VALUATIONS[key],
        value: custom[key] !== undefined ? custom[key] : DEFAULT_VALUATIONS[key].value
      };
    });
    return merged;
  }
  return DEFAULT_VALUATIONS;
}

// Save user's custom valuation
function saveValuation(key, value) {
  const customValuations = JSON.parse(localStorage.getItem('cardmax_point_valuations') || '{}');
  customValuations[key] = value;
  localStorage.setItem('cardmax_point_valuations', JSON.stringify(customValuations));
}

// Reset a valuation to default
function resetValuation(key) {
  const customValuations = JSON.parse(localStorage.getItem('cardmax_point_valuations') || '{}');
  delete customValuations[key];
  localStorage.setItem('cardmax_point_valuations', JSON.stringify(customValuations));
}

// Reset all valuations to defaults
function resetAllValuations() {
  localStorage.removeItem('cardmax_point_valuations');
}

// Get the point value for a specific card in cents per point
function getCardPointValue(card) {
  const valuationKey = getCardValuationKey(card);
  const valuations = getValuations();
  return valuations[valuationKey]?.value || 1.0;
}

// Get the currency name for display
function getCardCurrencyName(card) {
  const valuationKey = getCardValuationKey(card);
  const valuations = getValuations();
  return valuations[valuationKey]?.name || 'Points';
}

// Calculate effective return rate (as percentage)
// multiplier * cents_per_point / 100 = return rate
function calculateEffectiveReturn(multiplier, card) {
  const pointValue = getCardPointValue(card);
  return (multiplier * pointValue / 100) * 100; // Returns as percentage
}

// Export for use
const Valuations = {
  DEFAULT: DEFAULT_VALUATIONS,
  CURRENCY_MAP: CURRENCY_TO_VALUATION,
  getValuations,
  saveValuation,
  resetValuation,
  resetAllValuations,
  getCardValuationKey,
  getCardPointValue,
  getCardCurrencyName,
  calculateEffectiveReturn
};
