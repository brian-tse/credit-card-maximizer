// Credit Card Database
// Last updated: January 2026

const CARDS_DATABASE = [
  {
    id: "chase-sapphire-reserve",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    network: "Visa",
    annualFee: 550,
    signUpBonus: {
      amount: 60000,
      currency: "Ultimate Rewards",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Travel", multiplier: 3, description: "After earning $300 travel credit" },
        { category: "Dining", multiplier: 3, description: "Including takeout and delivery" },
        { category: "Online Grocery", multiplier: 3, description: "Excludes Target, Walmart" },
        { category: "Streaming", multiplier: 10, description: "Select services via Pay Yourself Back" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Automatically applied to travel purchases" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" },
      { name: "DoorDash DashPass", amount: 0, frequency: "annual", type: "subscription", description: "Complimentary DashPass membership" },
      { name: "Lyft Pink", amount: 0, frequency: "annual", type: "subscription", description: "Complimentary Lyft Pink membership" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "Unlimited lounge visits + 2 guests", type: "lounge" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 6hr delay", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $10,000 per person", type: "insurance" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage worldwide", type: "insurance" },
      { name: "1.5x Point Value", description: "Points worth 1.5¢ in Chase Travel Portal", type: "redemption" }
    ],
    color: "#004879",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-platinum",
    name: "American Express Platinum",
    issuer: "American Express",
    network: "American Express",
    annualFee: 695,
    signUpBonus: {
      amount: 80000,
      currency: "Membership Rewards",
      spendRequirement: 8000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Flights (direct)", multiplier: 5, description: "Booked directly with airline or Amex Travel" },
        { category: "Hotels (Amex Travel)", multiplier: 5, description: "Prepaid through Amex Travel" },
        { category: "Restaurants", multiplier: 1, description: "Worldwide" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Airline Incidental Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline, covers fees" },
      { name: "Uber Credit", amount: 200, frequency: "annual", type: "rideshare", description: "$15/month + $20 December bonus", monthlyAmount: 15 },
      { name: "Saks Fifth Avenue", amount: 100, frequency: "annual", type: "shopping", description: "$50 Jan-Jun, $50 Jul-Dec", monthlyAmount: 50, periods: ["Jan-Jun", "Jul-Dec"] },
      { name: "Hotel Credit", amount: 200, frequency: "annual", type: "travel", description: "Fine Hotels + Resorts or Hotel Collection" },
      { name: "Digital Entertainment", amount: 240, frequency: "annual", type: "subscription", description: "$20/month for streaming services", monthlyAmount: 20 },
      { name: "Walmart+ Membership", amount: 155, frequency: "annual", type: "subscription", description: "Statement credit for membership" },
      { name: "Equinox Credit", amount: 300, frequency: "annual", type: "fitness", description: "$25/month at Equinox+ or clubs", monthlyAmount: 25 },
      { name: "CLEAR Plus Credit", amount: 199, frequency: "annual", type: "travel", description: "Statement credit for membership" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Centurion Lounges", description: "Access to Amex Centurion Lounges + 2 guests", type: "lounge" },
      { name: "Priority Pass Select", description: "Unlimited visits, no guests", type: "lounge" },
      { name: "Delta Sky Club", description: "Access when flying Delta", type: "lounge" },
      { name: "Hilton Gold Status", description: "Automatic Gold status", type: "status" },
      { name: "Marriott Gold Status", description: "Automatic Gold status", type: "status" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status" },
      { name: "Fine Hotels & Resorts", description: "Premium benefits at luxury hotels", type: "travel" }
    ],
    color: "#B0B7BC",
    lastUpdated: "2026-01-15"
  },
  {
    id: "capital-one-venture-x",
    name: "Capital One Venture X",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 395,
    signUpBonus: {
      amount: 75000,
      currency: "Venture Miles",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Hotels (Capital One Travel)", multiplier: 10, description: "Booked through Capital One Travel" },
        { category: "Rental Cars (Capital One Travel)", multiplier: 10, description: "Booked through Capital One Travel" },
        { category: "Flights (Capital One Travel)", multiplier: 5, description: "Booked through Capital One Travel" },
        { category: "Everything Else", multiplier: 2, description: "Unlimited 2x on all purchases" }
      ]
    },
    transferPartners: [
      { name: "Air Canada", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Red", ratio: "1:1", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" },
      { name: "Accor", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Capital One Travel bookings" },
      { name: "Anniversary Bonus", amount: 10000, frequency: "annual", type: "points", description: "10,000 bonus miles each anniversary" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Capital One Lounges", description: "Access to Capital One Lounges + 2 guests", type: "lounge" },
      { name: "Priority Pass", description: "Unlimited visits + 2 guests (no restaurants)", type: "lounge" },
      { name: "Plaza Premium Lounges", description: "Unlimited access + 2 guests", type: "lounge" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $2,000 per person", type: "insurance" },
      { name: "Cell Phone Protection", description: "Up to $800 per claim", type: "insurance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15"
  },
  {
    id: "chase-sapphire-preferred",
    name: "Chase Sapphire Preferred",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 60000,
      currency: "Ultimate Rewards",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Travel", multiplier: 2, description: "All travel purchases" },
        { category: "Dining", multiplier: 3, description: "Including takeout and delivery" },
        { category: "Online Grocery", multiplier: 3, description: "Excludes Target, Walmart" },
        { category: "Streaming", multiplier: 3, description: "Select streaming services" },
        { category: "Peloton", multiplier: 5, description: "Peloton equipment and membership" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Hotel Credit", amount: 50, frequency: "annual", type: "travel", description: "$50 hotel credit through Chase Travel" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "1.25x Point Value", description: "Points worth 1.25¢ in Chase Travel Portal", type: "redemption" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 12hr delay", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $5,000 per person", type: "insurance" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage worldwide", type: "insurance" },
      { name: "Anniversary Bonus", description: "10% points back on Chase Travel purchases annually", type: "points" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-gold",
    name: "American Express Gold",
    issuer: "American Express",
    network: "American Express",
    annualFee: 325,
    signUpBonus: {
      amount: 60000,
      currency: "Membership Rewards",
      spendRequirement: 6000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Restaurants", multiplier: 4, description: "Worldwide including takeout" },
        { category: "U.S. Supermarkets", multiplier: 4, description: "Up to $25,000/year, then 1x" },
        { category: "Flights (direct)", multiplier: 3, description: "Booked directly with airline or Amex Travel" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Uber Credit", amount: 120, frequency: "annual", type: "rideshare", description: "$10/month for Uber Eats or rides", monthlyAmount: 10 },
      { name: "Dining Credit", amount: 120, frequency: "annual", type: "dining", description: "$10/month at select restaurants", monthlyAmount: 10 },
      { name: "Dunkin' Credit", amount: 84, frequency: "annual", type: "dining", description: "$7/month at Dunkin'", monthlyAmount: 7 }
    ],
    perks: [
      { name: "No Foreign Transaction Fees", description: "Use worldwide with no extra fees", type: "travel" },
      { name: "Purchase Protection", description: "Up to $10,000 per occurrence", type: "insurance" },
      { name: "Return Protection", description: "90 days, up to $300 per item", type: "insurance" }
    ],
    color: "#B5985A",
    lastUpdated: "2026-01-15"
  },

  // ============ CASH BACK CARDS ============
  {
    id: "citi-double-cash",
    name: "Citi Double Cash",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Cash Back",
      spendRequirement: 1500,
      timeframe: "6 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "1% when you buy + 1% when you pay" },
        { category: "Citi Travel", multiplier: 5, description: "Hotels, car rentals, attractions" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 18 months on balance transfers", type: "apr" },
      { name: "Citi Entertainment", description: "Access to presale tickets and events", type: "entertainment" }
    ],
    color: "#003B70",
    lastUpdated: "2026-01-15"
  },
  {
    id: "chase-freedom-unlimited",
    name: "Chase Freedom Unlimited",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    signUpBonus: {
      amount: 300,
      currency: "Cash Back",
      spendRequirement: 500,
      timeframe: "3 months"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "All Purchases", multiplier: 1.5, description: "Unlimited 1.5% cash back" },
        { category: "Chase Travel", multiplier: 5, description: "Travel booked through Chase" },
        { category: "Dining", multiplier: 3, description: "Restaurants and takeout" },
        { category: "Drugstores", multiplier: 3, description: "Pharmacy purchases" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 15 months on purchases", type: "apr" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance" }
    ],
    color: "#117ACA",
    lastUpdated: "2026-01-15"
  },
  {
    id: "chase-freedom-flex",
    name: "Chase Freedom Flex",
    issuer: "Chase",
    network: "Mastercard",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Cash Back",
      spendRequirement: 500,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Rotating Categories", multiplier: 5, description: "Up to $1,500/quarter when activated" },
        { category: "Chase Travel", multiplier: 5, description: "Travel booked through Chase" },
        { category: "Dining", multiplier: 3, description: "Restaurants and takeout" },
        { category: "Drugstores", multiplier: 3, description: "Pharmacy purchases" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 15 months on purchases", type: "apr" },
      { name: "Cell Phone Protection", description: "Up to $800 per claim", type: "insurance" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance" }
    ],
    color: "#0D4228",
    lastUpdated: "2026-01-15"
  },
  {
    id: "discover-it-cash-back",
    name: "Discover it Cash Back",
    issuer: "Discover",
    network: "Discover",
    annualFee: 0,
    signUpBonus: {
      amount: 0,
      currency: "Cash Back Match",
      spendRequirement: 0,
      timeframe: "First year"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Rotating Categories", multiplier: 5, description: "Up to $1,500/quarter when activated" },
        { category: "All Other Purchases", multiplier: 1, description: "Unlimited 1% cash back" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Cashback Match", description: "Discover matches all cash back earned in first year", type: "bonus" },
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Free FICO Score", description: "See your FICO score on statements", type: "credit" }
    ],
    color: "#FF6000",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-blue-cash-preferred",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    network: "American Express",
    annualFee: 95,
    signUpBonus: {
      amount: 250,
      currency: "Statement Credit",
      spendRequirement: 3000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "U.S. Supermarkets", multiplier: 6, description: "Up to $6,000/year, then 1%" },
        { category: "U.S. Streaming", multiplier: 6, description: "Select streaming services" },
        { category: "U.S. Gas Stations", multiplier: 3, description: "At the pump" },
        { category: "Transit", multiplier: 3, description: "Taxis, rideshare, parking, tolls, trains, buses" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr" },
      { name: "Return Protection", description: "90 days, up to $300 per item", type: "insurance" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence", type: "insurance" },
      { name: "Car Rental Loss and Damage", description: "Secondary coverage", type: "insurance" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-15"
  },
  {
    id: "wells-fargo-active-cash",
    name: "Wells Fargo Active Cash",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Cash Rewards",
      spendRequirement: 500,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "Unlimited 2% cash rewards" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr" },
      { name: "Cell Phone Protection", description: "Up to $600 per claim", type: "insurance" },
      { name: "Roadside Dispatch", description: "24/7 roadside assistance", type: "travel" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-01-15"
  },

  // ============ MID-TIER TRAVEL CARDS ============
  {
    id: "capital-one-venture",
    name: "Capital One Venture Rewards",
    issuer: "Capital One",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 75000,
      currency: "Venture Miles",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "Unlimited 2x miles on everything" },
        { category: "Hotels/Rentals (Capital One Travel)", multiplier: 5, description: "Booked through Capital One Travel" }
      ]
    },
    transferPartners: [
      { name: "Air Canada", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Travel Accident Insurance", description: "Up to $250,000 coverage", type: "insurance" },
      { name: "24-Hour Travel Assistance", description: "Emergency travel services", type: "travel" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15"
  },
  {
    id: "wells-fargo-autograph-journey",
    name: "Wells Fargo Autograph Journey",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 60000,
      currency: "Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Hotels (direct)", multiplier: 5, description: "Booked directly with hotels" },
        { category: "Airlines (direct)", multiplier: 5, description: "Booked directly with airlines" },
        { category: "Car Rentals", multiplier: 3, description: "Rental car companies" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" }
      ]
    },
    transferPartners: [
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Cell Phone Protection", description: "Up to $600 per claim", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-01-15"
  },

  // ============ HOTEL CARDS ============
  {
    id: "world-of-hyatt",
    name: "World of Hyatt Credit Card",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 60000,
      currency: "Hyatt Points",
      spendRequirement: 6000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Hyatt Hotels", multiplier: 9, description: "4x card + 5x member base" },
        { category: "Airlines", multiplier: 2, description: "Flights booked direct" },
        { category: "Restaurants", multiplier: 2, description: "Dining purchases" },
        { category: "Fitness/Gym", multiplier: 2, description: "Gym memberships" },
        { category: "Transit", multiplier: 2, description: "Local transit and commuting" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "Category 1-4 Hyatt property" },
      { name: "Bonus Free Night", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 spend, Category 1-4" }
    ],
    perks: [
      { name: "Discoverist Status", description: "Automatic World of Hyatt Discoverist status", type: "status" },
      { name: "5 Elite Night Credits", description: "Toward next status tier annually", type: "status" },
      { name: "DoorDash DashPass", description: "12 months complimentary", type: "subscription" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance" }
    ],
    color: "#8B6914",
    lastUpdated: "2026-01-15"
  },
  {
    id: "marriott-bonvoy-boundless",
    name: "Marriott Bonvoy Boundless",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 85000,
      currency: "Marriott Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Marriott Hotels", multiplier: 17, description: "6x card + base member earnings" },
        { category: "Grocery", multiplier: 3, description: "Up to $6,000/year" },
        { category: "Gas", multiplier: 3, description: "Up to $6,000/year" },
        { category: "Dining", multiplier: 3, description: "Up to $6,000/year" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "3:1", type: "airline" },
      { name: "Delta Airlines", ratio: "3:1", type: "airline" },
      { name: "American Airlines", ratio: "3:1", type: "airline" }
    ],
    credits: [
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "Up to 35,000 points value" }
    ],
    perks: [
      { name: "Silver Elite Status", description: "Automatic Marriott Bonvoy Silver Elite", type: "status" },
      { name: "15 Elite Night Credits", description: "Toward next status tier annually", type: "status" },
      { name: "Gold Status Path", description: "Earn Gold after $35,000 annual spend", type: "status" }
    ],
    color: "#8B0029",
    lastUpdated: "2026-01-15"
  },
  {
    id: "hilton-honors-surpass",
    name: "Hilton Honors Surpass",
    issuer: "American Express",
    network: "American Express",
    annualFee: 150,
    signUpBonus: {
      amount: 155000,
      currency: "Hilton Points",
      spendRequirement: 3000,
      timeframe: "6 months"
    },
    earning: {
      base: 3,
      categories: [
        { category: "Hilton Hotels", multiplier: 12, description: "At Hilton portfolio properties" },
        { category: "Restaurants", multiplier: 6, description: "Worldwide" },
        { category: "U.S. Supermarkets", multiplier: 6, description: "Grocery stores" },
        { category: "U.S. Gas Stations", multiplier: 6, description: "At the pump" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Free Night Reward", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 calendar year spend" }
    ],
    perks: [
      { name: "Gold Status", description: "Automatic Hilton Honors Gold status", type: "status" },
      { name: "Priority Pass Select", description: "10 lounge visits per year", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15"
  },
  {
    id: "hilton-honors-aspire",
    name: "Hilton Honors Aspire",
    issuer: "American Express",
    network: "American Express",
    annualFee: 550,
    signUpBonus: {
      amount: 175000,
      currency: "Hilton Points",
      spendRequirement: 6000,
      timeframe: "6 months"
    },
    earning: {
      base: 3,
      categories: [
        { category: "Hilton Hotels", multiplier: 14, description: "At Hilton portfolio properties" },
        { category: "Flights", multiplier: 7, description: "Booked direct or via Amex Travel" },
        { category: "Car Rentals", multiplier: 7, description: "Select rental companies" },
        { category: "Restaurants", multiplier: 7, description: "U.S. restaurants" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Hilton Resort Credit", amount: 400, frequency: "annual", type: "hotel", description: "At Hilton Resorts" },
      { name: "Airline Fee Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline for incidentals" },
      { name: "Free Night Reward", amount: 1, frequency: "annual", type: "hotel", description: "Automatically on card anniversary" }
    ],
    perks: [
      { name: "Diamond Status", description: "Automatic Hilton Honors Diamond status", type: "status" },
      { name: "Priority Pass Select", description: "Unlimited lounge visits + 2 guests", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15"
  },
  {
    id: "ihg-one-rewards-premier",
    name: "IHG One Rewards Premier",
    issuer: "Chase",
    network: "Mastercard",
    annualFee: 99,
    signUpBonus: {
      amount: 140000,
      currency: "IHG Points",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 3,
      categories: [
        { category: "IHG Hotels", multiplier: 26, description: "At IHG portfolio properties" },
        { category: "Travel", multiplier: 5, description: "Airlines, hotels, car rentals" },
        { category: "Dining", multiplier: 5, description: "Restaurants" },
        { category: "Gas", multiplier: 5, description: "Gas stations" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "40,000 point cert with unlimited top-off" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Platinum Elite Status", description: "Automatic IHG One Rewards Platinum Elite", type: "status" },
      { name: "4th Night Free", description: "On award stays of 4+ nights", type: "hotel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#00857D",
    lastUpdated: "2026-01-15"
  },

  // ============ AIRLINE CARDS ============
  {
    id: "delta-skymiles-gold",
    name: "Delta SkyMiles Gold",
    issuer: "American Express",
    network: "American Express",
    annualFee: 150,
    signUpBonus: {
      amount: 50000,
      currency: "SkyMiles",
      spendRequirement: 2000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 2, description: "Flights, in-flight, gift cards" },
        { category: "Restaurants", multiplier: 2, description: "Worldwide" },
        { category: "U.S. Supermarkets", multiplier: 2, description: "Grocery stores" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Delta Stays Credit", amount: 100, frequency: "annual", type: "travel", description: "Hotels/rentals via Delta.com" },
      { name: "Flight Credit", amount: 200, frequency: "annual", type: "travel", description: "After $10,000 spend in calendar year" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel" },
      { name: "Priority Boarding", description: "Zone 5 priority boarding", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },
  {
    id: "delta-skymiles-platinum",
    name: "Delta SkyMiles Platinum",
    issuer: "American Express",
    network: "American Express",
    annualFee: 350,
    signUpBonus: {
      amount: 85000,
      currency: "SkyMiles",
      spendRequirement: 4000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" },
        { category: "Hotels (direct)", multiplier: 3, description: "Booked directly with hotels" },
        { category: "Restaurants", multiplier: 2, description: "Worldwide including takeout" },
        { category: "U.S. Supermarkets", multiplier: 2, description: "Grocery stores" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Resy Credit", amount: 120, frequency: "annual", type: "dining", description: "$10/month at Resy restaurants", monthlyAmount: 10 },
      { name: "Rideshare Credit", amount: 120, frequency: "annual", type: "rideshare", description: "$10/month on Uber and Lyft", monthlyAmount: 10 },
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip Main Cabin domestic/Caribbean" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel" },
      { name: "Priority Boarding", description: "Main Cabin 1 priority boarding", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },
  {
    id: "delta-skymiles-reserve",
    name: "Delta SkyMiles Reserve",
    issuer: "American Express",
    network: "American Express",
    annualFee: 650,
    signUpBonus: {
      amount: 90000,
      currency: "SkyMiles",
      spendRequirement: 5000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" },
        { category: "All Other", multiplier: 1, description: "Everything else" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Resy Credit", amount: 240, frequency: "annual", type: "dining", description: "$20/month at Resy restaurants", monthlyAmount: 20 },
      { name: "Rideshare Credit", amount: 120, frequency: "annual", type: "rideshare", description: "$10/month on Uber and Lyft", monthlyAmount: 10 },
      { name: "Delta Stays Credit", amount: 150, frequency: "annual", type: "travel", description: "Hotels/rentals via Delta.com" },
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip First Class domestic" }
    ],
    perks: [
      { name: "Delta Sky Club", description: "15 visits/year, unlimited after $75K spend", type: "lounge" },
      { name: "Centurion Lounge Access", description: "When flying Delta", type: "lounge" },
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel" },
      { name: "Priority Boarding", description: "Zone 1 priority boarding", type: "travel" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },
  {
    id: "united-explorer",
    name: "United Explorer Card",
    issuer: "Chase",
    network: "Visa",
    annualFee: 150,
    signUpBonus: {
      amount: 60000,
      currency: "MileagePlus Miles",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "United Purchases", multiplier: 7, description: "5x member + 2x card" },
        { category: "Dining", multiplier: 2, description: "Restaurants" },
        { category: "Hotels", multiplier: 2, description: "Hotel stays" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "United Travel Credit", amount: 100, frequency: "annual", type: "travel", description: "After $10,000 spend" },
      { name: "Instacart+ Credit", amount: 120, frequency: "annual", type: "grocery", description: "Up to $10/month", monthlyAmount: 10 },
      { name: "Avis/Budget Credit", amount: 50, frequency: "annual", type: "travel", description: "Rental car credit" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On United flights for you + companion", type: "travel" },
      { name: "Priority Boarding", description: "Group 2 boarding", type: "travel" },
      { name: "2 United Club Passes", description: "One-time lounge passes per year", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15"
  },
  {
    id: "united-club-infinite",
    name: "United Club Infinite Card",
    issuer: "Chase",
    network: "Visa",
    annualFee: 695,
    signUpBonus: {
      amount: 100000,
      currency: "MileagePlus Miles",
      spendRequirement: 5000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "United Purchases", multiplier: 4, description: "Flights, in-flight, etc." },
        { category: "Travel", multiplier: 2, description: "Hotels, car rentals" },
        { category: "Dining", multiplier: 2, description: "Restaurants" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Rideshare Credit", amount: 150, frequency: "annual", type: "rideshare", description: "$12/month + $18 December", monthlyAmount: 12 },
      { name: "Instacart+ Credit", amount: 240, frequency: "annual", type: "grocery", description: "$20/month + free membership", monthlyAmount: 20 },
      { name: "Renowned Hotels Credit", amount: 200, frequency: "annual", type: "travel", description: "On qualifying stays" }
    ],
    perks: [
      { name: "United Club Membership", description: "Full membership + 2 guests", type: "lounge" },
      { name: "Two Free Checked Bags", description: "For you and companion on same ticket", type: "travel" },
      { name: "Premier Access", description: "Priority check-in, boarding, and baggage", type: "travel" },
      { name: "25% Back on United", description: "Food, beverages, Wi-Fi, and premium drinks", type: "travel" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15"
  },
  {
    id: "southwest-priority",
    name: "Southwest Rapid Rewards Priority",
    issuer: "Chase",
    network: "Visa",
    annualFee: 229,
    signUpBonus: {
      amount: 50000,
      currency: "Rapid Rewards Points",
      spendRequirement: 1000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Southwest Purchases", multiplier: 4, description: "Flights, in-flight, gift cards" },
        { category: "Rapid Rewards Hotels/Rentals", multiplier: 3, description: "Booked through Southwest" },
        { category: "Dining", multiplier: 2, description: "Restaurants" },
        { category: "Gas", multiplier: 2, description: "Gas stations" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Southwest Travel Credit", amount: 75, frequency: "annual", type: "travel", description: "On Southwest purchases" },
      { name: "Anniversary Points", amount: 7500, frequency: "annual", type: "points", description: "Bonus points each year" },
      { name: "Upgraded Boardings", amount: 4, frequency: "annual", type: "travel", description: "Reimbursements for A1-A15 boarding" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Southwest flights", type: "travel" },
      { name: "Seat Selection", description: "Pre-flight seat selection", type: "travel" },
      { name: "In-Flight Perks", description: "25% back on drinks and WiFi", type: "travel" },
      { name: "DoorDash DashPass", description: "12 months complimentary", type: "subscription" },
      { name: "Instacart+", description: "3 months free + $10/month credit", type: "subscription" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-01-15"
  },

  // ============ NEW CARDS 2025-2026 ============
  {
    id: "citi-strata-premier",
    name: "Citi Strata Premier",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 95,
    signUpBonus: {
      amount: 75000,
      currency: "ThankYou Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Citi Travel Hotels/Cars/Attractions", multiplier: 10, description: "Booked on cititravel.com" },
        { category: "Air Travel", multiplier: 3, description: "Airlines" },
        { category: "Hotels", multiplier: 3, description: "Hotel stays" },
        { category: "Restaurants", multiplier: 3, description: "Worldwide dining" },
        { category: "Supermarkets", multiplier: 3, description: "Grocery stores" },
        { category: "Gas Stations", multiplier: 3, description: "At the pump" },
        { category: "EV Charging", multiplier: 3, description: "Electric vehicle charging" }
      ]
    },
    transferPartners: [
      { name: "American Airlines", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Eva Air", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Hotel Credit", amount: 100, frequency: "annual", type: "travel", description: "$100 off hotel stay of $500+ on cititravel.com" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance" },
      { name: "Trip Delay Insurance", description: "Up to $500 per trip after delay", type: "insurance" },
      { name: "Baggage Insurance", description: "Lost or damaged luggage coverage", type: "insurance" },
      { name: "Citi Entertainment", description: "Access to presale tickets and events", type: "entertainment" }
    ],
    color: "#003B70",
    lastUpdated: "2026-01-15"
  },
  {
    id: "citi-strata-elite",
    name: "Citi Strata Elite",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 595,
    signUpBonus: {
      amount: 100000,
      currency: "ThankYou Points",
      spendRequirement: 6000,
      timeframe: "3 months"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "Citi Travel Hotels/Cars/Attractions", multiplier: 12, description: "Booked on cititravel.com" },
        { category: "Citi Travel Flights", multiplier: 6, description: "Flights booked on cititravel.com" },
        { category: "Citi Nights Dining", multiplier: 6, description: "Friday & Saturday 6pm-6am ET" },
        { category: "Restaurants", multiplier: 3, description: "All other times" }
      ]
    },
    transferPartners: [
      { name: "American Airlines", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Eva Air", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Hotel Credit", amount: 300, frequency: "annual", type: "travel", description: "$300 off 2+ night hotel stay on cititravel.com" },
      { name: "Splurge Credit", amount: 200, frequency: "annual", type: "lifestyle", description: "Choose 2 brands: AA, Best Buy, ESPN+, Live Nation" },
      { name: "Blacklane Credit", amount: 200, frequency: "annual", type: "travel", description: "$100 Jan-Jun, $100 Jul-Dec for chauffeur service" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "Unlimited lounge visits worldwide", type: "lounge" },
      { name: "AA Admirals Club Passes", description: "4 passes per year", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Trip Cancellation Insurance", description: "Enhanced coverage for non-refundable expenses", type: "insurance" },
      { name: "Trip Delay Insurance", description: "Up to $500 per trip after delay", type: "insurance" }
    ],
    color: "#1A1F71",
    lastUpdated: "2026-01-15"
  },
  {
    id: "us-bank-altitude-reserve",
    name: "US Bank Altitude Reserve",
    issuer: "US Bank",
    network: "Visa",
    annualFee: 400,
    signUpBonus: {
      amount: 50000,
      currency: "Altitude Points",
      spendRequirement: 4500,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Mobile Wallet", multiplier: 3, description: "Apple Pay, Google Pay, Samsung Pay (capped $5k/month)" },
        { category: "Travel", multiplier: 3, description: "Airlines, hotels, car rentals" },
        { category: "Travel Center Hotels/Cars", multiplier: 10, description: "Prepaid through US Bank Travel Center" },
        { category: "Travel Center Flights", multiplier: 5, description: "Prepaid through US Bank Travel Center" }
      ]
    },
    transferPartners: [
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 325, frequency: "annual", type: "travel", description: "US Bank Travel Center bookings only" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "8 lounge visits per year + guests", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance" },
      { name: "Visa Infinite Benefits", description: "Premium Visa benefits package", type: "travel" }
    ],
    color: "#D32F2F",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-green",
    name: "American Express Green",
    issuer: "American Express",
    network: "American Express",
    annualFee: 150,
    signUpBonus: {
      amount: 40000,
      currency: "Membership Rewards",
      spendRequirement: 3000,
      timeframe: "6 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Travel", multiplier: 3, description: "Flights, hotels, cruises, car rentals, tours" },
        { category: "Transit", multiplier: 3, description: "Trains, taxis, rideshare, tolls, parking" },
        { category: "Restaurants", multiplier: 3, description: "Worldwide dining" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "CLEAR Plus Credit", amount: 209, frequency: "annual", type: "travel", description: "Statement credit for CLEAR Plus membership" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Trip Delay Insurance", description: "Up to $300 per trip after 12hr delay", type: "insurance" },
      { name: "Car Rental Insurance", description: "Secondary CDW coverage up to $50,000", type: "insurance" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence for 90 days", type: "insurance" },
      { name: "Extended Warranty", description: "Extra year on manufacturer warranties", type: "insurance" }
    ],
    color: "#006747",
    lastUpdated: "2026-01-15"
  },
  {
    id: "atmos-rewards-summit",
    name: "Atmos Rewards Summit",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 395,
    signUpBonus: {
      amount: 80000,
      currency: "Atmos Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Alaska/Hawaiian Airlines", multiplier: 3, description: "Flights and purchases" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Foreign Transactions", multiplier: 3, description: "Purchases made abroad" }
      ]
    },
    transferPartners: [
      { name: "Alaska Airlines", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Oneworld Partners", ratio: "varies", type: "airline" },
      { name: "Multiple Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Global Companion Award (25k)", amount: 25000, frequency: "annual", type: "points", description: "Up to 25,000 points off companion ticket" },
      { name: "Delay Voucher", amount: 50, frequency: "per occurrence", type: "travel", description: "Instant $50 voucher for 2hr+ delays" }
    ],
    perks: [
      { name: "Alaska Lounge Passes", description: "8 passes per year (2 per quarter)", type: "lounge" },
      { name: "Free Checked Bags", description: "First bag free for 7 guests on same reservation", type: "travel" },
      { name: "Priority Boarding", description: "Early group boarding on Alaska flights", type: "travel" },
      { name: "No Same-Day Change Fees", description: "Free same-day changes on Alaska flights", type: "travel" },
      { name: "Status Points Earning", description: "1 status point per $2 spent, 10,000 annually", type: "status" }
    ],
    color: "#00274C",
    lastUpdated: "2026-01-15"
  },
  {
    id: "bilt-blue",
    name: "Bilt Blue Card",
    issuer: "Cardless",
    network: "Mastercard",
    annualFee: 0,
    signUpBonus: {
      amount: 0,
      currency: "Bilt Points",
      spendRequirement: 0,
      timeframe: "N/A"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Rent/Mortgage", multiplier: 1, description: "No fee with Bilt Cash, or 3% fee for max points" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" }
      ]
    },
    transferPartners: [
      { name: "American Airlines", ratio: "1:1", type: "airline" },
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr" },
      { name: "Bilt Cash Earning", description: "4% Bilt Cash on everyday spending", type: "rewards" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards" }
    ],
    color: "#000000",
    lastUpdated: "2026-01-15"
  },
  {
    id: "bilt-obsidian",
    name: "Bilt Obsidian Card",
    issuer: "Cardless",
    network: "Mastercard",
    annualFee: 95,
    signUpBonus: {
      amount: 50000,
      currency: "Bilt Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Rent/Mortgage", multiplier: 1, description: "No fee with Bilt Cash, or 3% fee for max points" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" }
      ]
    },
    transferPartners: [
      { name: "American Airlines", ratio: "1:1", type: "airline" },
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Bilt Travel Hotel Credit", amount: 100, frequency: "annual", type: "travel", description: "$50 available every 6 months" }
    ],
    perks: [
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr" },
      { name: "Bilt Cash Earning", description: "4% Bilt Cash on everyday spending", type: "rewards" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards" },
      { name: "Lyft Credits", description: "Credits for Lyft rides", type: "rideshare" }
    ],
    color: "#1C1C1C",
    lastUpdated: "2026-01-15"
  },
  {
    id: "bilt-palladium",
    name: "Bilt Palladium Card",
    issuer: "Cardless",
    network: "Mastercard",
    annualFee: 495,
    signUpBonus: {
      amount: 50000,
      currency: "Bilt Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Rent/Mortgage", multiplier: 1, description: "No fee with Bilt Cash, or 3% fee for max points" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" }
      ]
    },
    transferPartners: [
      { name: "American Airlines", ratio: "1:1", type: "airline" },
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Bilt Travel Hotel Credit", amount: 400, frequency: "annual", type: "travel", description: "$200 available every 6 months" }
    ],
    perks: [
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr" },
      { name: "Bilt Gold Status", description: "Automatic Bilt Gold status", type: "status" },
      { name: "2x Everyday Points", description: "2 Bilt points per dollar on all purchases except rent", type: "rewards" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards" },
      { name: "Premium Lyft Credits", description: "Enhanced credits for Lyft rides", type: "rideshare" },
      { name: "Dining Credits", description: "Credits at select Bilt partner restaurants", type: "dining" }
    ],
    color: "#C0C0C0",
    lastUpdated: "2026-01-15"
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CARDS_DATABASE;
}
