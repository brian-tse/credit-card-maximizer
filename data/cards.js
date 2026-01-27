// Credit Card Database
// Last updated: January 2026

const CARDS_DATABASE = [
  {
    id: "chase-sapphire-reserve",
    name: "Chase Sapphire Reserve",
    issuer: "Chase",
    network: "Visa",
    annualFee: 795,
    signUpBonus: {
      amount: 125000,
      currency: "Ultimate Rewards",
      spendRequirement: 6000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Chase Travel", multiplier: 8, description: "Including The Edit hotels" },
        { category: "Flights & Hotels (direct)", multiplier: 4, description: "Booked directly with airline or hotel" },
        { category: "Dining", multiplier: 3, description: "Worldwide, including takeout and delivery" },
        { category: "Lyft", multiplier: 5, description: "Through Sept 2027" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Automatic on travel purchases" },
      { name: "Dining Credit (Exclusive Tables)", amount: 300, frequency: "semiannual", type: "dining", description: "$150 Jan-Jun, $150 Jul-Dec at select restaurants", semiannualAmount: 150 },
      { name: "The Edit Hotel Credit", amount: 500, frequency: "annual", type: "travel", description: "Luxury boutique hotels, max $250/booking" },
      { name: "Select Hotels Credit (2026)", amount: 250, frequency: "annual", type: "travel", description: "IHG, Montage, Pendry, Omni, Virgin Hotels via Chase Travel" },
      { name: "StubHub/viagogo Credit", amount: 300, frequency: "semiannual", type: "entertainment", description: "$150 Jan-Jun, $150 Jul-Dec through Dec 2027", semiannualAmount: 150 },
      { name: "Lyft Credit", amount: 120, frequency: "annual", type: "rideshare", description: "$10/month through Sept 2027", monthlyAmount: 10 },
      { name: "DoorDash Credits", amount: 300, frequency: "annual", type: "dining", description: "$25/mo: $5 restaurant + 2×$10 non-restaurant. Includes DashPass", monthlyAmount: 25 },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Chase Sapphire Lounges", description: "Access to all Chase Sapphire Lounges + 2 guests", type: "lounge" },
      { name: "Priority Pass Select", description: "1,300+ lounges worldwide + 2 guests", type: "lounge" },
      { name: "Air Canada Lounge Access", description: "Maple Leaf Lounges in US, Canada, Europe", type: "lounge" },
      { name: "IHG Platinum Elite Status", description: "Through Dec 2027 + Hertz Gold Plus Five Star", type: "status" },
      { name: "Reserve Travel Designer", description: "Complimentary travel planning (up to $300 value)", type: "travel" },
      { name: "Apple TV+ & Apple Music", description: "Complimentary through June 2027", type: "subscription" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 6hr delay", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $10,000 per person, $20,000 per trip", type: "insurance" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW up to $75,000", type: "insurance" },
      { name: "Baggage Delay Insurance", description: "$100/day for 5 days after 6hr delay", type: "insurance" },
      { name: "Lost Luggage Reimbursement", description: "Up to $3,000 per passenger", type: "insurance" },
      { name: "Emergency Evacuation", description: "Up to $100,000 coverage", type: "insurance" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty by 1 year", type: "protection" },
      { name: "Purchase Protection", description: "Covers theft and accidental damage", type: "protection" },
      { name: "1.5x Point Value", description: "Points worth 1.5¢ in Chase Travel Portal", type: "redemption" },
      { name: "Visa Infinite Concierge", description: "24/7 personal assistance", type: "service" }
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
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Airline Incidental Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline, covers fees" },
      { name: "Uber Credit", amount: 200, frequency: "annual", type: "rideshare", description: "$15/month + $20 December bonus", monthlyAmount: 15 },
      { name: "Saks Fifth Avenue", amount: 100, frequency: "semiannual", type: "shopping", description: "$50 Jan-Jun, $50 Jul-Dec", semiannualAmount: 50 },
      { name: "Hotel Credit", amount: 600, frequency: "semiannual", type: "travel", description: "$300 Jan-Jun, $300 Jul-Dec for FHR or Hotel Collection", semiannualAmount: 300 },
      { name: "Digital Entertainment", amount: 300, frequency: "annual", type: "subscription", description: "$25/month for streaming services", monthlyAmount: 25 },
      { name: "Resy Credit", amount: 400, frequency: "quarterly", type: "dining", description: "$100/quarter at Resy restaurants", quarterlyAmount: 100 },
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
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Red", ratio: "1:1", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "EVA Air", ratio: "2:1.5", type: "airline" },
      { name: "Finnair", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" },
      { name: "Accor", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Capital One Travel bookings" },
      { name: "Anniversary Bonus", amount: 10000, frequency: "annual", type: "points", description: "10,000 bonus points each anniversary" },
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
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
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
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
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
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
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
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
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
    id: "amazon-prime-visa",
    name: "Amazon Prime Visa",
    issuer: "Chase",
    network: "Visa",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: {
      amount: 150,
      currency: "Amazon Gift Card",
      spendRequirement: 0,
      timeframe: "Instant upon approval"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Amazon/Whole Foods/Amazon Fresh + Chase Travel", multiplier: 5, description: "Requires Prime membership" },
        { category: "Gas Stations", multiplier: 2, description: "At the pump" },
        { category: "Restaurants", multiplier: 2, description: "Dining and takeout" },
        { category: "Transit & Commuting", multiplier: 2, description: "Local transit and rideshare" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Daily Rewards Posting", description: "Rewards post as soon as next day", type: "rewards" },
      { name: "Prime Bonus Offers", description: "10%+ back on rotating Amazon selections", type: "rewards" },
      { name: "No Earning Caps", description: "Unlimited earning with no point expiration", type: "rewards" },
      { name: "Extended Warranty Protection", description: "Extends warranties up to 1 additional year", type: "protection" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days up to $500/item", type: "protection" },
      { name: "Auto Rental Coverage", description: "Collision damage waiver", type: "insurance" },
      { name: "Baggage Delay Insurance", description: "$100/day, max 3 days", type: "insurance" },
      { name: "Travel Accident Insurance", description: "Up to $500,000", type: "insurance" },
      { name: "Lost Luggage Reimbursement", description: "Up to $3,000", type: "insurance" },
      { name: "No Foreign Transaction Fees", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#FF9900",
    lastUpdated: "2026-01-26"
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
  {
    id: "gemini-credit-card",
    name: "Gemini Credit Card",
    issuer: "WebBank",
    network: "Mastercard",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Crypto (USD value)",
      spendRequirement: 3000,
      timeframe: "90 days"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Gas & EV Charging", multiplier: 4, description: "First $300/month, then 1%" },
        { category: "Transit & Rideshare", multiplier: 4, description: "First $300/month combined with gas" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Groceries", multiplier: 2, description: "Supermarkets" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Real-Time Crypto Rewards", description: "Rewards credited instantly in 40+ cryptocurrencies", type: "service" },
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel" },
      { name: "No Exchange Fees", description: "No fees on crypto reward deposits", type: "service" },
      { name: "Metal Card Design", description: "Black, silver, or rose gold options", type: "service" },
      { name: "Mastercard World Benefits", description: "Priceless Experiences, ID Theft Protection", type: "protection" },
      { name: "Security Design", description: "No card number on physical card", type: "protection" }
    ],
    color: "#00DCFA",
    lastUpdated: "2026-01-21"
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
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Red", ratio: "1:1", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "EVA Air", ratio: "2:1.5", type: "airline" },
      { name: "Finnair", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" },
      { name: "Accor", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
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
  {
    id: "ihg-one-rewards-traveler",
    name: "IHG One Rewards Traveler",
    issuer: "Chase",
    network: "Visa",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: {
      amount: 80000,
      currency: "IHG Points",
      spendRequirement: 2000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "IHG Hotels", multiplier: 5, description: "At IHG portfolio properties (up to 17x with elite bonuses)" },
        { category: "Gas", multiplier: 3, description: "Gas stations" },
        { category: "Dining", multiplier: 3, description: "Restaurants" },
        { category: "Utilities", multiplier: 3, description: "Monthly bills" },
        { category: "Streaming", multiplier: 3, description: "Streaming services" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Silver Elite Status", description: "Complimentary IHG One Rewards Silver Elite", type: "status" },
      { name: "4th Night Free", description: "On award stays of 4+ nights booked with points", type: "hotel" },
      { name: "20% Point Discount", description: "Save 20% on IHG point purchases", type: "service" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#00857D",
    lastUpdated: "2026-01-21"
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
    id: "united-quest",
    name: "United Quest Card",
    issuer: "Chase",
    network: "Visa",
    cardType: "personal",
    annualFee: 350,
    signUpBonus: {
      amount: 70000,
      currency: "MileagePlus Miles",
      spendRequirement: 4000,
      timeframe: "3 months",
      additionalInfo: "Plus 1,000 Premier Qualifying Points"
    },
    earning: {
      base: 1,
      categories: [
        { category: "United Flights", multiplier: 8, description: "Flights booked directly with United" },
        { category: "Renowned Hotels", multiplier: 5, description: "Via MileagePlus portal" },
        { category: "United Purchases", multiplier: 3, description: "In-flight, United TravelBank, etc." },
        { category: "Dining", multiplier: 2, description: "Restaurants worldwide" },
        { category: "Streaming", multiplier: 2, description: "Select streaming services" },
        { category: "Travel", multiplier: 2, description: "Hotels, car rentals, other travel" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "United TravelBank Credit", amount: 200, frequency: "annual", type: "travel", description: "Use on any United purchase" },
      { name: "Instacart+ Credit", amount: 180, frequency: "annual", type: "grocery", description: "$15/month for groceries", monthlyAmount: 15 },
      { name: "JSX Credit", amount: 150, frequency: "annual", type: "travel", description: "Semi-private air travel" },
      { name: "Renowned Hotels Credit", amount: 150, frequency: "annual", type: "travel", description: "On qualifying bookings" },
      { name: "Rideshare Credit", amount: 100, frequency: "annual", type: "rideshare", description: "Uber, Lyft, etc." },
      { name: "Car Rental Credit", amount: 80, frequency: "annual", type: "travel", description: "On car rentals" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "For you on United flights", type: "travel" },
      { name: "Second Checked Bag Free", description: "For you on United flights", type: "travel" },
      { name: "Priority Boarding", description: "Group 2 boarding on United", type: "travel" },
      { name: "Primary Rental Car Insurance", description: "Up to $60,000 coverage", type: "insurance" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 12hr delay", type: "insurance" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "25% Back on United", description: "Food, beverages, Wi-Fi purchases", type: "travel" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-16"
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
      { name: "EVA Air", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Thai Airways", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" }
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
      { name: "EVA Air", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Thai Airways", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" }
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
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
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
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "Alaska Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Spirit Airlines", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Accor", ratio: "3:2", type: "hotel" }
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
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "Alaska Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Spirit Airlines", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Accor", ratio: "3:2", type: "hotel" }
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
        { category: "Dining", multiplier: 2, description: "Restaurants worldwide" },
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "Alaska Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Spirit Airlines", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Accor", ratio: "3:2", type: "hotel" }
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
  },

  // ============ BUSINESS CREDIT CARDS ============

  // --- Chase Ink Business Cards ---
  {
    id: "chase-ink-business-unlimited",
    name: "Chase Ink Business Unlimited",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 0,
    signUpBonus: {
      amount: 75000,
      currency: "Ultimate Rewards",
      spendRequirement: 6000,
      timeframe: "3 months"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "All Purchases", multiplier: 1.5, description: "Unlimited 1.5% cash back or 1.5x UR points" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15"
  },
  {
    id: "chase-ink-business-preferred",
    name: "Chase Ink Business Preferred",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 95,
    signUpBonus: {
      amount: 100000,
      currency: "Ultimate Rewards",
      spendRequirement: 8000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Travel", multiplier: 3, description: "Airfare, hotels, car rentals, trains" },
        { category: "Shipping", multiplier: 3, description: "UPS, FedEx, USPS, etc." },
        { category: "Internet/Cable/Phone", multiplier: 3, description: "Business services" },
        { category: "Advertising (Social Media/Search)", multiplier: 3, description: "Facebook, Google, LinkedIn ads" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "Cell Phone Protection", description: "Up to $1,000 per claim, 3 claims/year", type: "insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $5,000 per person", type: "insurance" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance" },
      { name: "1.25x Point Value", description: "Points worth 1.25¢ in Chase Travel Portal", type: "redemption" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15"
  },
  {
    id: "chase-ink-business-cash",
    name: "Chase Ink Business Cash",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 0,
    signUpBonus: {
      amount: 75000,
      currency: "Ultimate Rewards",
      spendRequirement: 6000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Office Supply Stores", multiplier: 5, description: "Up to $25,000/year combined" },
        { category: "Internet/Cable/Phone", multiplier: 5, description: "Up to $25,000/year combined" },
        { category: "Gas Stations", multiplier: 2, description: "Up to $25,000/year combined" },
        { category: "Restaurants", multiplier: 2, description: "Up to $25,000/year combined" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "1:1", type: "airline" },
      { name: "Southwest Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Hyatt", ratio: "1:1", type: "hotel" },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15"
  },

  // --- American Express Business Cards ---
  {
    id: "amex-business-platinum",
    name: "American Express Business Platinum",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 895,
    signUpBonus: {
      amount: 150000,
      currency: "Membership Rewards",
      spendRequirement: 20000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Flights (direct/Amex Travel)", multiplier: 5, description: "Booked directly or via Amex Travel" },
        { category: "Hotels (Amex Travel)", multiplier: 5, description: "Prepaid through Amex Travel" },
        { category: "Purchases $5,000+", multiplier: 1.5, description: "On single purchases of $5K+ (up to 1M MR/year)" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Airline Incidental Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline, covers fees" },
      { name: "Dell Credit", amount: 200, frequency: "semiannual", type: "business", description: "$100 Jan-Jun, $100 Jul-Dec for Dell purchases", semiannualAmount: 100 },
      { name: "Indeed Credit", amount: 360, frequency: "annual", type: "business", description: "$90/quarter for job posting" },
      { name: "Adobe Creative Cloud Credit", amount: 150, frequency: "annual", type: "business", description: "Statement credit for Adobe subscription" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Centurion Lounges", description: "Access to Amex Centurion Lounges + 2 guests", type: "lounge" },
      { name: "Priority Pass Select", description: "Unlimited visits, no guests", type: "lounge" },
      { name: "Delta Sky Club", description: "Access when flying Delta", type: "lounge" },
      { name: "Hilton Gold Status", description: "Automatic Gold status", type: "status" },
      { name: "Marriott Gold Status", description: "Automatic Gold status", type: "status" },
      { name: "35% Points Rebate", description: "35% back on Pay with Points for flights", type: "redemption" }
    ],
    color: "#B0B7BC",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-business-gold",
    name: "American Express Business Gold",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 375,
    signUpBonus: {
      amount: 100000,
      currency: "Membership Rewards",
      spendRequirement: 15000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Top 2 Categories", multiplier: 4, description: "Auto-selected from: Airfare, Advertising, Gas, Shipping, Computer hardware/software/cloud, Restaurants (up to $150K/year)" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Flexible Credit", amount: 155, frequency: "annual", type: "business", description: "Use for Grubhub, Boxed, or Office Depot" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Purchase Protection", description: "Up to $10,000 per occurrence", type: "insurance" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance" },
      { name: "25% Points Rebate", description: "25% back on Pay with Points for flights", type: "redemption" }
    ],
    color: "#B5985A",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-blue-business-plus",
    name: "American Express Blue Business Plus",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 0,
    signUpBonus: {
      amount: 15000,
      currency: "Membership Rewards",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "2x MR on first $50,000/year, then 1x" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr" },
      { name: "Expanded Buying Power", description: "Spend beyond your credit limit with eligibility", type: "business" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-blue-business-cash",
    name: "American Express Blue Business Cash",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 0,
    signUpBonus: {
      amount: 250,
      currency: "Statement Credit",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "2% cash back on first $50,000/year, then 1%" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr" },
      { name: "Expanded Buying Power", description: "Spend beyond your credit limit with eligibility", type: "business" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence", type: "insurance" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-15"
  },
  {
    id: "amex-business-green",
    name: "American Express Business Green Rewards",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 95,
    signUpBonus: {
      amount: 25000,
      currency: "Membership Rewards",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Travel", multiplier: 2, description: "Flights, hotels, trains, cruises" },
        { category: "U.S. Restaurants", multiplier: 2, description: "Dining at U.S. restaurants" },
        { category: "Transit", multiplier: 2, description: "Trains, taxis, rideshare, tolls" },
        { category: "Shipping", multiplier: 2, description: "U.S. shipping purchases" }
      ]
    },
    transferPartners: [
      { name: "Delta Airlines", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "ANA", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" },
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "El Al", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "Hawaiian Airlines", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "JetBlue", ratio: "5:4", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Qatar Airways", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Hilton", ratio: "1:2", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "Annual Fee Waived First Year", description: "$95 fee waived first year", type: "fee" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence", type: "insurance" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance" }
    ],
    color: "#006747",
    lastUpdated: "2026-01-15"
  },

  // --- Capital One Business Cards ---
  {
    id: "capital-one-venture-x-business",
    name: "Capital One Venture X Business",
    issuer: "Capital One",
    network: "Visa",
    cardType: "business",
    annualFee: 395,
    signUpBonus: {
      amount: 150000,
      currency: "Venture Miles",
      spendRequirement: 30000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Hotels/Cars (Capital One Travel)", multiplier: 10, description: "Booked through Capital One Travel" },
        { category: "Flights (Capital One Travel)", multiplier: 5, description: "Booked through Capital One Travel" },
        { category: "Everything Else", multiplier: 2, description: "Unlimited 2x on all purchases" }
      ]
    },
    transferPartners: [
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Red", ratio: "1:1", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "EVA Air", ratio: "2:1.5", type: "airline" },
      { name: "Finnair", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" },
      { name: "Accor", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Capital One Travel bookings" },
      { name: "Anniversary Bonus", amount: 10000, frequency: "annual", type: "points", description: "10,000 bonus points each anniversary" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Capital One Lounges", description: "Access to Capital One Lounges + 2 guests", type: "lounge" },
      { name: "Priority Pass", description: "Unlimited visits + 2 guests", type: "lounge" },
      { name: "Plaza Premium Lounges", description: "Unlimited access + 2 guests", type: "lounge" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15"
  },
  {
    id: "capital-one-spark-miles",
    name: "Capital One Spark Miles for Business",
    issuer: "Capital One",
    network: "Visa",
    cardType: "business",
    annualFee: 95,
    signUpBonus: {
      amount: 50000,
      currency: "Venture Miles",
      spendRequirement: 4500,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "Unlimited 2x miles on everything" },
        { category: "Hotels (Capital One Travel)", multiplier: 5, description: "Booked through Capital One Travel" }
      ]
    },
    transferPartners: [
      { name: "Air Canada Aeroplan", ratio: "1:1", type: "airline" },
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Emirates", ratio: "1:1", type: "airline" },
      { name: "Turkish Airlines", ratio: "1:1", type: "airline" },
      { name: "Virgin Red", ratio: "1:1", type: "airline" },
      { name: "Qantas", ratio: "1:1", type: "airline" },
      { name: "Aeromexico", ratio: "1:1", type: "airline" },
      { name: "Avianca LifeMiles", ratio: "1:1", type: "airline" },
      { name: "Cathay Pacific", ratio: "1:1", type: "airline" },
      { name: "Etihad", ratio: "1:1", type: "airline" },
      { name: "EVA Air", ratio: "2:1.5", type: "airline" },
      { name: "Finnair", ratio: "1:1", type: "airline" },
      { name: "Japan Airlines", ratio: "1:1", type: "airline" },
      { name: "Singapore Airlines", ratio: "1:1", type: "airline" },
      { name: "TAP Portugal", ratio: "1:1", type: "airline" },
      { name: "Wyndham", ratio: "1:1", type: "hotel" },
      { name: "Accor", ratio: "1:1", type: "hotel" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "Annual Fee Waived First Year", description: "$95 fee waived first year", type: "fee" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Free Employee Cards", description: "Unlimited employee cards at no extra cost", type: "business" },
      { name: "Travel Accident Insurance", description: "Up to $250,000 coverage", type: "insurance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15"
  },
  {
    id: "capital-one-spark-cash-plus",
    name: "Capital One Spark Cash Plus",
    issuer: "Capital One",
    network: "Visa",
    cardType: "business",
    annualFee: 150,
    signUpBonus: {
      amount: 1200,
      currency: "Cash Back",
      spendRequirement: 30000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "All Purchases", multiplier: 2, description: "Unlimited 2% cash back on everything" },
        { category: "Hotels/Cars (Capital One Travel)", multiplier: 5, description: "5% back through Capital One Travel" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Preset Spending Limit", description: "Flexible spending based on credit profile", type: "business" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Free Employee Cards", description: "Unlimited employee cards at no extra cost", type: "business" },
      { name: "Purchase Records Download", description: "Easy expense tracking and reporting", type: "business" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15"
  },

  // --- Delta Business Cards ---
  {
    id: "delta-skymiles-gold-business",
    name: "Delta SkyMiles Gold Business",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 150,
    signUpBonus: {
      amount: 50000,
      currency: "SkyMiles",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 2, description: "Flights, in-flight, gift cards" },
        { category: "Restaurants", multiplier: 2, description: "Worldwide" },
        { category: "U.S. Shipping", multiplier: 2, description: "Shipping services" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel" },
      { name: "Priority Boarding", description: "Zone 5 priority boarding", type: "travel" },
      { name: "20% Back on Inflight", description: "20% back on drinks, food, and WiFi", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },
  {
    id: "delta-skymiles-platinum-business",
    name: "Delta SkyMiles Platinum Business",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 350,
    signUpBonus: {
      amount: 90000,
      currency: "SkyMiles",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "Delta Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" },
        { category: "Hotels", multiplier: 2, description: "Worldwide hotel stays" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip Main Cabin domestic" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel" },
      { name: "Priority Boarding", description: "Main Cabin 1 priority boarding", type: "travel" },
      { name: "20% Back on Inflight", description: "20% back on drinks, food, and WiFi", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Status Boost", description: "Earn MQM with spending", type: "status" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },
  {
    id: "delta-skymiles-reserve-business",
    name: "Delta SkyMiles Reserve Business",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 650,
    signUpBonus: {
      amount: 110000,
      currency: "SkyMiles",
      spendRequirement: 6000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip First Class domestic" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee" }
    ],
    perks: [
      { name: "Delta Sky Club", description: "Unlimited access when flying Delta + 2 guests", type: "lounge" },
      { name: "Centurion Lounge Access", description: "When flying Delta same day", type: "lounge" },
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel" },
      { name: "Priority Boarding", description: "Zone 1 priority boarding", type: "travel" },
      { name: "Status Boost", description: "Earn MQM faster with spending", type: "status" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15"
  },

  // --- United Business Card ---
  {
    id: "united-business-card",
    name: "United Business Card",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 150,
    signUpBonus: {
      amount: 75000,
      currency: "MileagePlus Miles",
      spendRequirement: 5000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "United Purchases", multiplier: 2, description: "Flights, in-flight, United TravelBank" },
        { category: "Dining", multiplier: 2, description: "Restaurants" },
        { category: "Gas Stations", multiplier: 2, description: "At the pump" },
        { category: "Office Supply Stores", multiplier: 2, description: "Business supplies" },
        { category: "Local Transit", multiplier: 2, description: "Trains, subways, rideshare" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "First Checked Bag Free", description: "On United flights for you + companion on same reservation", type: "travel" },
      { name: "Priority Boarding", description: "Group 2 boarding", type: "travel" },
      { name: "2 United Club Passes", description: "One-time lounge passes per year", type: "lounge" },
      { name: "25% Back on United", description: "Food, beverages, and WiFi", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15"
  },

  // --- Southwest Business Cards ---
  {
    id: "southwest-performance-business",
    name: "Southwest Rapid Rewards Performance Business",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 199,
    signUpBonus: {
      amount: 80000,
      currency: "Rapid Rewards Points",
      spendRequirement: 5000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Southwest Purchases", multiplier: 4, description: "Flights, in-flight, gift cards" },
        { category: "Hotels/Rentals via Rapid Rewards", multiplier: 3, description: "Booked through Southwest" },
        { category: "Rideshare", multiplier: 2, description: "Uber, Lyft, etc." },
        { category: "Social Media/Search Ads", multiplier: 2, description: "Advertising purchases" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Anniversary Points", amount: 9000, frequency: "annual", type: "points", description: "9,000 bonus points each year" },
      { name: "Upgraded Boardings", amount: 4, frequency: "annual", type: "travel", description: "4 reimbursements for A1-A15 boarding" }
    ],
    perks: [
      { name: "In-Flight WiFi Credits", description: "365 credits per year for WiFi", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Companion Pass Progress", description: "Points count toward Companion Pass", type: "status" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-01-15"
  },
  {
    id: "southwest-premier-business",
    name: "Southwest Rapid Rewards Premier Business",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 99,
    signUpBonus: {
      amount: 60000,
      currency: "Rapid Rewards Points",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Southwest Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" },
        { category: "Hotels via Rapid Rewards", multiplier: 2, description: "Booked through Southwest" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Anniversary Points", amount: 6000, frequency: "annual", type: "points", description: "6,000 bonus points each year" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Companion Pass Progress", description: "Points count toward Companion Pass", type: "status" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-01-15"
  },

  // --- Marriott Business Card ---
  {
    id: "marriott-bonvoy-business",
    name: "Marriott Bonvoy Business",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 125,
    signUpBonus: {
      amount: 90000,
      currency: "Marriott Points",
      spendRequirement: 4000,
      timeframe: "3 months"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Marriott Hotels", multiplier: 6, description: "At Marriott portfolio properties" },
        { category: "U.S. Restaurants", multiplier: 4, description: "Dining at U.S. restaurants" },
        { category: "U.S. Gas Stations", multiplier: 4, description: "At the pump" },
        { category: "Wireless/Phone", multiplier: 4, description: "Wireless telephone services from U.S. providers" },
        { category: "U.S. Shipping", multiplier: 4, description: "Shipping purchases" }
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
      { name: "Gold Status Path", description: "Earn Gold after $35,000 annual spend", type: "status" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#8B0029",
    lastUpdated: "2026-01-15"
  },

  // --- Hilton Business Card ---
  {
    id: "hilton-honors-business",
    name: "Hilton Honors Business",
    issuer: "American Express",
    network: "American Express",
    cardType: "business",
    annualFee: 195,
    signUpBonus: {
      amount: 155000,
      currency: "Hilton Points",
      spendRequirement: 3000,
      timeframe: "3 months"
    },
    earning: {
      base: 3,
      categories: [
        { category: "Hilton Hotels", multiplier: 12, description: "At Hilton portfolio properties" },
        { category: "U.S. Gas Stations", multiplier: 6, description: "At the pump" },
        { category: "U.S. Restaurants", multiplier: 6, description: "Dining at U.S. restaurants" },
        { category: "U.S. Shipping", multiplier: 6, description: "Shipping purchases" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Free Weekend Night", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 spend in calendar year" }
    ],
    perks: [
      { name: "Gold Status", description: "Automatic Hilton Honors Gold status", type: "status" },
      { name: "Diamond Status Path", description: "Earn Diamond after $40,000 annual spend", type: "status" },
      { name: "Priority Pass Select", description: "10 lounge visits per year", type: "lounge" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15"
  },

  // --- Bank of America Business Card ---
  {
    id: "bofa-business-advantage-unlimited",
    name: "Bank of America Business Advantage Unlimited Cash Rewards",
    issuer: "Bank of America",
    network: "Visa",
    cardType: "business",
    annualFee: 0,
    signUpBonus: {
      amount: 300,
      currency: "Cash Back",
      spendRequirement: 3000,
      timeframe: "60 days"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "All Purchases", multiplier: 1.5, description: "Unlimited 1.5% cash back (up to 2.62% with Preferred Rewards)" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "0% Intro APR", description: "0% for 9 billing cycles on purchases", type: "apr" },
      { name: "Preferred Rewards Bonus", description: "Earn up to 75% more with Preferred Rewards", type: "redemption" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business" },
      { name: "Cash Flow Management", description: "Tools to manage business cash flow", type: "business" }
    ],
    color: "#012169",
    lastUpdated: "2026-01-15"
  },

  // --- Bank of America Customized Cash Rewards ---
  {
    id: "bank-of-america-customized-cash-rewards",
    name: "Bank of America Customized Cash Rewards",
    issuer: "Bank of America",
    network: "Visa",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Cash Back",
      spendRequirement: 1000,
      timeframe: "90 days"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Choice Category (Year 1)", multiplier: 6, description: "Gas/EV charging, online shopping, dining, travel, drugstores, or home improvement" },
        { category: "Choice Category (After Year 1)", multiplier: 3, description: "Gas/EV charging, online shopping, dining, travel, drugstores, or home improvement" },
        { category: "Grocery & Wholesale", multiplier: 2, description: "Grocery stores and wholesale clubs" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "0% Intro APR", description: "0% for 15 billing cycles on purchases and balance transfers (within first 60 days)", type: "apr" },
      { name: "Quarterly Spending Cap", description: "$2,500 combined quarterly cap on 3%/2% categories, then 1%", type: "rewards" },
      { name: "Monthly Category Changes", description: "Change choice category up to once per calendar month", type: "rewards" },
      { name: "Preferred Rewards Boost", description: "Earn 25%-75% more with Preferred Rewards banking relationship", type: "rewards" },
      { name: "No Foreign Transaction Fees", description: "Use abroad with no extra fees", type: "travel" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-26"
  },

  // --- Bank of America Atmos Rewards Ascent ---
  {
    id: "boa-atmos-ascent",
    name: "Atmos Rewards Ascent",
    issuer: "Bank of America",
    network: "Visa",
    cardType: "personal",
    annualFee: 95,
    signUpBonus: {
      amount: 80000,
      currency: "Atmos Rewards Points",
      spendRequirement: 4000,
      timeframe: "120 days",
      additionalInfo: "Plus $99 Companion Fare"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Alaska Airlines", multiplier: 3, description: "Alaska Airlines purchases" },
        { category: "Hawaiian Airlines", multiplier: 3, description: "Hawaiian Airlines purchases" },
        { category: "Gas Stations", multiplier: 2, description: "At the pump" },
        { category: "EV Charging", multiplier: 2, description: "Electric vehicle charging stations" },
        { category: "Transit & Rideshare", multiplier: 2, description: "Local transit, Uber, Lyft" },
        { category: "Cable & Streaming", multiplier: 2, description: "Cable and select streaming services" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Alaska Lounge+ Discount", amount: 100, frequency: "annual", type: "travel", description: "$100 off Alaska Lounge+ membership ($795/year)" },
      { name: "Inflight Purchase Credit", amount: "20%", frequency: "per transaction", type: "travel", description: "20% back on Alaska/Hawaiian inflight purchases" }
    ],
    perks: [
      { name: "Free Checked Bag", description: "1 free bag for you + up to 6 companions on same reservation", type: "travel" },
      { name: "Preferred Boarding", description: "Priority boarding on Alaska and Hawaiian flights", type: "travel" },
      { name: "$99 Companion Fare", description: "Annual benefit after $6k spend; $99 + taxes (~$122 total)", type: "travel" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel" },
      { name: "Status Points", description: "Earn 1 status point per $3 spent (no cap starting 2026)", type: "status" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-16"
  },

  // --- Amex Blue Cash Preferred ---
  {
    id: "amex-blue-cash-preferred",
    name: "Blue Cash Preferred",
    issuer: "American Express",
    network: "American Express",
    cardType: "personal",
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
        { category: "Streaming Services", multiplier: 6, description: "Netflix, Hulu, Spotify, Disney+, etc." },
        { category: "Gas Stations", multiplier: 3, description: "U.S. gas stations" },
        { category: "Transit", multiplier: 3, description: "Trains, taxis, rideshare, tolls, parking" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Disney Bundle Credit", amount: 120, frequency: "annual", type: "subscription", description: "$10/month back on Disney+, Hulu, ESPN+", monthlyAmount: 10 }
    ],
    perks: [
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr" },
      { name: "Purchase Protection", description: "Coverage for eligible purchases against damage/theft", type: "protection" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty up to 1 year", type: "protection" },
      { name: "Return Protection", description: "Refund for eligible items merchant won't take back", type: "protection" },
      { name: "Car Rental Loss & Damage", description: "Secondary coverage when renting a car", type: "insurance" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-16"
  },

  // --- Citi Costco Anywhere ---
  {
    id: "citi-costco-anywhere",
    name: "Costco Anywhere Visa",
    issuer: "Citi",
    network: "Visa",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: null,
    earning: {
      base: 1,
      categories: [
        { category: "Gas (Costco)", multiplier: 5, description: "At Costco gas stations, up to $7,000/yr combined with other gas" },
        { category: "Gas & EV Charging", multiplier: 4, description: "Other gas stations and EV charging, up to $7,000/yr combined" },
        { category: "Restaurants", multiplier: 3, description: "Worldwide dining" },
        { category: "Travel", multiplier: 3, description: "Flights, hotels, car rentals, Costco Travel" },
        { category: "Costco", multiplier: 2, description: "Costco warehouse and Costco.com" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel" },
      { name: "Worldwide Car Rental Insurance", description: "Coverage when renting a car", type: "insurance" },
      { name: "Travel & Emergency Assistance", description: "24/7 travel assistance services", type: "travel" },
      { name: "Roadside Assistance", description: "Emergency roadside services", type: "service" },
      { name: "Purchase Protection", description: "Damage and theft protection within 120 days", type: "protection" },
      { name: "$0 Fraud Liability", description: "No liability for unauthorized charges", type: "protection" },
      { name: "Citi Quick Lock", description: "Instantly freeze/unfreeze your card", type: "service" },
      { name: "Citi Entertainment", description: "Early access to concert and event tickets", type: "service" }
    ],
    color: "#1B3668",
    lastUpdated: "2026-01-21"
  },

  // --- Capital One Savor ---
  {
    id: "capital-one-savor",
    name: "Capital One Savor Cash Rewards",
    issuer: "Capital One",
    network: "Mastercard",
    cardType: "personal",
    annualFee: 0,
    signUpBonus: {
      amount: 200,
      currency: "Cash Bonus",
      spendRequirement: 500,
      timeframe: "3 months"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Capital One Entertainment", multiplier: 8, description: "Purchases through Capital One Entertainment" },
        { category: "Hotels & Rental Cars", multiplier: 5, description: "Booked through Capital One Travel" },
        { category: "Dining", multiplier: 3, description: "Restaurants, bars, cafes, fast food" },
        { category: "Entertainment", multiplier: 3, description: "Movies, concerts, sporting events, amusement parks" },
        { category: "Grocery Stores", multiplier: 3, description: "Excludes superstores like Walmart and Target" },
        { category: "Streaming", multiplier: 3, description: "Popular streaming services" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr" },
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel" },
      { name: "Hertz Five Star Status", description: "Complimentary Hertz Five Star rental status", type: "status" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty", type: "protection" },
      { name: "Travel Accident Insurance", description: "Coverage for travel accidents", type: "insurance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-26"
  },
  {
    id: "citi-simplicity",
    name: "Citi Simplicity",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 0,
    signUpBonus: null,
    earning: {
      base: 0,
      categories: []
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "0% Intro APR on Purchases", description: "0% for 12 months, then 17.49%-28.24% variable", type: "apr" },
      { name: "0% Intro APR on Balance Transfers", description: "0% for 21 months, then 17.49%-28.24% variable", type: "apr" },
      { name: "No Late Fees Ever", description: "You'll never pay a late fee", type: "feature" },
      { name: "No Penalty APR", description: "Your rate won't increase even if you pay late", type: "feature" }
    ],
    color: "#003DA5",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer"
  },
  {
    id: "discover-it-cash-back",
    name: "Discover It Cash Back",
    issuer: "Discover",
    network: "Discover",
    annualFee: 0,
    signUpBonus: {
      amount: null,
      currency: "Cashback Match",
      description: "Discover matches all cash back earned in first year"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Rotating Categories", multiplier: 5, description: "Up to $1,500/quarter when activated. Q1 2026: Grocery, Wholesale Clubs, Streaming" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Cashback Match", description: "All cash back earned in first year is matched", type: "bonus" },
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee" },
      { name: "Free FICO Score", description: "Access your FICO score monthly", type: "feature" },
      { name: "Freeze It", description: "Freeze your account instantly if card is lost", type: "security" }
    ],
    color: "#FF6600",
    lastUpdated: "2026-01-27"
  },
  {
    id: "us-bank-shield-visa",
    name: "U.S. Bank Shield Visa",
    issuer: "U.S. Bank",
    network: "Visa",
    annualFee: 0,
    signUpBonus: null,
    earning: {
      base: 1,
      categories: [
        { category: "Travel (U.S. Bank Portal)", multiplier: 4, description: "Booked through U.S. Bank travel portal" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Annual Statement Credit", amount: 20, frequency: "annual", type: "statement", description: "Earn $20 for 11 consecutive months of purchases" }
    ],
    perks: [
      { name: "0% Intro APR", description: "0% for 24 billing cycles on purchases and balance transfers", type: "apr" },
      { name: "Purchase Protection", description: "Covers eligible purchases against damage or theft", type: "protection" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty", type: "protection" },
      { name: "Cell Phone Protection", description: "Up to $600 per claim when you pay your phone bill with this card", type: "protection" }
    ],
    color: "#002855",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer"
  },
  {
    id: "wells-fargo-reflect",
    name: "Wells Fargo Reflect",
    issuer: "Wells Fargo",
    network: "Visa",
    annualFee: 0,
    signUpBonus: null,
    earning: {
      base: 0,
      categories: []
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "0% Intro APR on Purchases", description: "0% for 21 months, then 17.74%-29.74% variable", type: "apr" },
      { name: "0% Intro APR on Balance Transfers", description: "0% for 21 months, then 17.74%-29.74% variable", type: "apr" },
      { name: "Cell Phone Protection", description: "Up to $600 when you pay your phone bill with this card", type: "protection" },
      { name: "Roadside Dispatch", description: "24/7 roadside assistance", type: "travel" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer"
  },
  {
    id: "capital-one-savor-student",
    name: "Capital One Savor Student Cash Rewards",
    issuer: "Capital One",
    network: "Mastercard",
    annualFee: 0,
    signUpBonus: null,
    earning: {
      base: 1,
      categories: [
        { category: "Dining", multiplier: 3, description: "Restaurants and bars" },
        { category: "Entertainment", multiplier: 3, description: "Movies, concerts, events" },
        { category: "Streaming", multiplier: 3, description: "Popular streaming services" },
        { category: "Grocery Stores", multiplier: 3, description: "Excludes superstores like Walmart" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee", type: "fee" },
      { name: "No Foreign Transaction Fees", description: "Great for international purchases", type: "travel" },
      { name: "Credit Building", description: "Designed for students to build credit", type: "feature" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-27",
    cardType: "student"
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CARDS_DATABASE;
}
