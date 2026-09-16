// Credit Card Database
// Schema updated 2026-09-15. Per-field review metadata records the actual review scope.
// amount is the annual cap for recurring USD credits, or the stated quantity for its unit.
// monthlyAmount/quarterlyAmount/semiannualAmount are the per-period caps.
// verifiedAt stays null until a complete card review; reviewedAt + verifiedFields record spot checks.

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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Travel reimbursement each account year; resets after the first statement following your anniversary. Check your issuer for the exact date.", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "annual-travel-credit", unit: "USD" },
      { name: "Dining Credit (Exclusive Tables)", amount: 300, frequency: "semiannual", type: "dining", description: "$150 Jan-Jun, $150 Jul-Dec at select restaurants", semiannualAmount: 150, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "dining-credit-exclusive-tables", unit: "USD" },
      { name: "The Edit Hotel Credit", amount: 500, frequency: "annual", type: "travel", description: "Prepaid The Edit bookings of two or more nights; up to $250 per transaction, $500 per calendar year.", resetPeriod: "calendar", effectiveFrom: "2026-01-01", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "the-edit-hotel-credit", unit: "USD" },
      { name: "Select Hotels Credit (2026)", amount: 250, frequency: "annual", type: "travel", description: "Prepaid Chase Travel stays of at least two nights at specified hotel brands.", resetPeriod: "calendar", effectiveFrom: "2026-01-01", effectiveUntil: "2026-12-31", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "select-hotels-credit-2026", unit: "USD" },
      { name: "StubHub/viagogo Credit", amount: 300, frequency: "semiannual", type: "entertainment", description: "$150 Jan-Jun, $150 Jul-Dec through Dec 2027", semiannualAmount: 150, resetPeriod: "calendar", effectiveUntil: "2027-12-31", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "stubhub-viagogo-credit", unit: "USD" },
      { name: "Lyft Credit", amount: 120, frequency: "monthly", type: "rideshare", description: "$10/month through Sept 2027", monthlyAmount: 10, resetPeriod: "calendar", effectiveUntil: "2027-09-30", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "lyft-credit", unit: "USD" },
      { name: "DoorDash Credits", amount: 300, frequency: "monthly", type: "dining", description: "$25/mo: $5 restaurant + 2×$10 non-restaurant. Includes DashPass", monthlyAmount: 25, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "doordash-credits", unit: "USD" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", resetPeriod: "rolling", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "global-entry-tsa-precheck", unit: "USD" },
      { name: "Peloton Membership Credit", amount: 120, frequency: "monthly", type: "fitness", description: "Up to $10 monthly for qualifying Peloton memberships; activation required.", monthlyAmount: 10, resetPeriod: "calendar", effectiveUntil: "2027-12-31", verifiedAt: "2026-09-15", sourceUrl: "https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire", id: "peloton-membership-credit", unit: "USD" }
    ],
    perks: [
      { name: "Chase Sapphire Lounges", description: "Access to all Chase Sapphire Lounges + 2 guests", type: "lounge", id: "chase-sapphire-lounges" },
      { name: "Priority Pass Select", description: "1,300+ lounges worldwide + 2 guests", type: "lounge", id: "priority-pass-select" },
      { name: "Air Canada Lounge Access", description: "Maple Leaf Lounges in US, Canada, Europe", type: "lounge", id: "air-canada-lounge-access" },
      { name: "IHG Platinum Elite Status", description: "Through Dec 2027 + Hertz Gold Plus Five Star", type: "status", id: "ihg-platinum-elite-status" },
      { name: "Reserve Travel Designer", description: "Complimentary travel planning (up to $300 value)", type: "travel", id: "reserve-travel-designer" },
      { name: "Apple TV+ & Apple Music", description: "Complimentary through June 2027", type: "subscription", id: "apple-tv-apple-music" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 6hr delay", type: "insurance", id: "trip-delay-insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $10,000 per person, $20,000 per trip", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW up to $75,000", type: "insurance", id: "primary-car-rental-insurance" },
      { name: "Baggage Delay Insurance", description: "$100/day for 5 days after 6hr delay", type: "insurance", id: "baggage-delay-insurance" },
      { name: "Lost Luggage Reimbursement", description: "Up to $3,000 per passenger", type: "insurance", id: "lost-luggage-reimbursement" },
      { name: "Emergency Evacuation", description: "Up to $100,000 coverage", type: "insurance", id: "emergency-evacuation" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty by 1 year", type: "protection", id: "extended-warranty" },
      { name: "Purchase Protection", description: "Covers theft and accidental damage", type: "protection", id: "purchase-protection" },
      {
        name: "Points Boost",
        description: "Chase Travel: normally 1¢ per point; eligible Points Boost bookings up to 2¢. Applicants before June 23, 2025 retain at least 1.5¢ for points earned before October 26, 2025, through October 26, 2027.",
        type: "redemption",
        sourceUrl: "https://media.chase.com/news/the-most-rewarding-cards-are-here",
        verifiedAt: "2026-09-15",
        id: "points-boost",
        terms: [
          { centsPerPoint: 1, eligibility: "Bookings not eligible for Points Boost or legacy redemption" },
          { centsPerPoint: 1.5, applicationBefore: "2025-06-23", pointsEarnedBefore: "2025-10-26", effectiveUntil: "2027-10-26", eligibility: "Eligible legacy points receive the better of 1.5¢ or available Points Boost" }
        ]
      },
      { name: "Visa Infinite Concierge", description: "24/7 personal assistance", type: "service", id: "visa-infinite-concierge" }
    ],
    color: "#004879",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.chase.com/sapphire-cards/personal/reserve",
    sourceScope: "product",
    sourceUrls: ["https://www.chase.com/sapphire-cards/personal/reserve","https://www.chase.com/personal/credit-cards/offerdetails/chasesapphire","https://media.chase.com/news/the-most-rewarding-cards-are-here"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["credits","perks.redemption"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
  },
  {
    id: "amex-platinum",
    name: "American Express Platinum",
    issuer: "American Express",
    network: "American Express",
    annualFee: 895,
    signUpBonus: {
      amount: 80000,
      currency: "Membership Rewards",
      spendRequirement: 8000,
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "Airline Incidental Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline, covers fees", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "airline-incidental-credit", unit: "USD" },
      {
        name: "Uber Credit",
        amount: 200,
        frequency: "monthly",
        type: "rideshare",
        description: "U.S. Uber Cash: $15 monthly and $20 extra in December; add the card to Uber and select an Amex card for payment.",
        monthlyAmount: 15,
        monthlyAmounts: [15,15,15,15,15,15,15,15,15,15,15,35],
        resetPeriod: "calendar",
        verifiedAt: "2026-09-15",
        sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
        id: "uber-credit",
        unit: "USD"
      },
      { name: "Hotel Credit", amount: 600, frequency: "semiannual", type: "travel", description: "Prepaid Fine Hotels + Resorts or The Hotel Collection through Amex Travel; $300 per half-year. Hotel Collection requires at least two nights.", semiannualAmount: 300, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "hotel-credit", unit: "USD" },
      { name: "Digital Entertainment", amount: 300, frequency: "monthly", type: "subscription", description: "Up to $25 monthly at eligible streaming/news partners; enrollment required.", monthlyAmount: 25, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "digital-entertainment", unit: "USD" },
      { name: "Resy Credit", amount: 400, frequency: "quarterly", type: "dining", description: "Up to $100 each calendar quarter at eligible U.S. Resy restaurants; enrollment required.", quarterlyAmount: 100, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "resy-credit", unit: "USD" },
      { name: "Walmart+ Membership", amount: 155.4, frequency: "monthly", type: "subscription", description: "Monthly Walmart+ membership reimbursement up to $12.95 plus applicable tax; annual memberships excluded.", monthlyAmount: 12.95, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "walmart-membership", unit: "USD" },
      { name: "Equinox Credit", amount: 300, frequency: "annual", type: "fitness", description: "Up to $300 per calendar year for eligible Equinox club or Equinox+ memberships; enrollment required.", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "equinox-credit", unit: "USD" },
      { name: "CLEAR Plus Credit", amount: 219, frequency: "annual", type: "travel", description: "CLEAR+ membership reimbursement up to $219 per calendar year.", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "clear-plus-credit", unit: "USD" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Global Entry up to $120 every four years or TSA PreCheck up to $85 for a five-year membership; choose one.", resetPeriod: "rolling", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "global-entry-tsa-precheck", unit: "USD" },
      { name: "Uber One Credit", amount: 120, frequency: "annual", type: "subscription", description: "Up to $120 per calendar year for an auto-renewing Uber One membership paid with the card.", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "uber-one-credit", unit: "USD" },
      { name: "lululemon Credit", amount: 300, frequency: "quarterly", type: "shopping", description: "Up to $75 each calendar quarter at eligible U.S. stores or lululemon.com; enrollment required.", quarterlyAmount: 75, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "lululemon-credit", unit: "USD" },
      { name: "Oura Ring Credit", amount: 200, frequency: "annual", type: "shopping", description: "Up to $200 per calendar year for an Oura Ring at ouraring.com; enrollment required.", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", id: "oura-ring-credit", unit: "USD" }
    ],
    perks: [
      { name: "Centurion Lounges", description: "Cardmember access; guests generally cost extra. Two complimentary guests after $75,000 eligible annual spend; location rules apply.", type: "lounge", sourceUrl: "https://www.thecenturionlounge.com/info/access/", verifiedAt: "2026-09-15", id: "centurion-lounges" },
      { name: "Priority Pass Select", description: "Enrollment required; cardmember plus up to two guests where permitted. Lounge capacity and guest restrictions apply.", type: "lounge", sourceUrl: "https://www.americanexpress.com/en-us/benefits/membership/?searchresult=lounge+access", verifiedAt: "2026-09-15", id: "priority-pass-select" },
      { name: "Delta Sky Club", description: "10 visits when traveling on eligible Delta flights; eligibility and guest charges apply.", type: "lounge", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", verifiedAt: "2026-09-15", id: "delta-sky-club" },
      { name: "Hilton Gold Status", description: "Automatic Gold status", type: "status", id: "hilton-gold-status" },
      { name: "Marriott Gold Status", description: "Automatic Gold status", type: "status", id: "marriott-gold-status" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status", id: "hertz-president-s-circle" },
      { name: "Fine Hotels & Resorts", description: "Premium benefits at luxury hotels", type: "travel", id: "fine-hotels-resorts" }
    ],
    color: "#B0B7BC",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/",
    sourceScope: "product",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/card/platinum/","https://www.thecenturionlounge.com/info/access/","https://www.americanexpress.com/en-us/benefits/membership/?searchresult=lounge+access","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["annualFee","credits","perks.lounge-access","transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open",
    retiredBenefits: [
      { name: "Saks Fifth Avenue", amount: 100, frequency: "semiannual", type: "shopping", description: "$50 Jan-Jun, $50 Jul-Dec", semiannualAmount: 50, id: "saks-fifth-avenue", unit: "USD", resetPeriod: "calendar", status: "retired", reviewedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/platinum/", reviewNotes: "No longer listed in current consumer Platinum benefits. Kept for historical usage; do not include in current credits." }
    ]
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Hotels (Capital One Travel)", multiplier: 10, description: "Booked through Capital One Travel" },
        { category: "Rental Cars (Capital One Travel)", multiplier: 10, description: "Booked through Capital One Travel" },
        { category: "Flights (Capital One Travel)", multiplier: 5, description: "Flights and vacation rentals booked through Capital One Travel" },
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
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "$300 for Capital One Travel bookings each account year; check your account for the expiration date.", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://www.capitalone.com/learn-grow/more-than-money/all-about-venture-x/", id: "annual-travel-credit", unit: "USD" },
      { name: "Anniversary Bonus", amount: 10000, frequency: "annual", type: "points", description: "10,000 miles starting with the first account anniversary.", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://www.capitalone.com/learn-grow/more-than-money/all-about-venture-x/", id: "anniversary-bonus", unit: "points" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Up to $120 toward Global Entry or TSA PreCheck once every four years.", resetPeriod: "rolling", verifiedAt: "2026-09-15", sourceUrl: "https://www.capitalone.com/learn-grow/more-than-money/all-about-venture-x/", id: "global-entry-tsa-precheck", unit: "USD" }
    ],
    perks: [
      { name: "Capital One Lounges", description: "Primary cardholder access. Guests: $45 adults, $25 ages 2–17. $75,000 annual spend unlocks two Lounge guests or one Landing guest.", type: "lounge", effectiveFrom: "2026-02-01", verifiedAt: "2026-09-15", sourceUrl: "https://capitalonetravel.com/lounge-access-guide", id: "capital-one-lounges" },
      { name: "Priority Pass", description: "Enrollment required; guests cost $35 each per visit. Additional cardholders require a $125 annual lounge-access fee.", type: "lounge", effectiveFrom: "2026-02-01", verifiedAt: "2026-09-15", sourceUrl: "https://capitalonetravel.com/lounge-access-guide", id: "priority-pass" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status", id: "hertz-president-s-circle" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance", id: "primary-car-rental-insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $2,000 per person", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Cell Phone Protection", description: "Up to $800 per claim", type: "insurance", id: "cell-phone-protection" }
    ],
    color: "#D03027",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.capitalone.com/credit-cards/venture-x/",
    sourceScope: "product",
    sourceUrls: ["https://www.capitalone.com/credit-cards/venture-x/","https://www.capitalone.com/learn-grow/more-than-money/all-about-venture-x/","https://capitalonetravel.com/lounge-access-guide"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["annualFee","credits","perks.lounge-access","earning.categories"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Chase Travel", multiplier: 5, description: "Eligible purchases through Chase Travel" },
        { category: "Travel", multiplier: 2, description: "Other eligible travel purchases" },
        { category: "Dining", multiplier: 3, description: "Includes eligible takeout and delivery" },
        { category: "Online Grocery", multiplier: 3, description: "Excludes Target, Walmart and wholesale clubs" },
        { category: "Streaming", multiplier: 3, description: "Select streaming services" },
        { category: "Gas & EV Charging", multiplier: 3, description: "Eligible purchases; effective June 15, 2026", effectiveFrom: "2026-06-15" },
        { category: "Vacation Homes", multiplier: 3, description: "Eligible brands including Airbnb and Vrbo; effective June 15, 2026", effectiveFrom: "2026-06-15" },
        { category: "Lyft", multiplier: 5, description: "Eligible Lyft purchases through September 30, 2027", effectiveUntil: "2027-09-30" },
        { category: "Peloton", multiplier: 5, description: "Eligible equipment/accessory purchases over $150, up to $5,000 total; through December 31, 2027", effectiveUntil: "2027-12-31" }
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
      {
        name: "Hyatt",
        ratio: "4:3",
        type: "hotel",
        description: "4:3 for applications from June 15, 2026. Earlier applicants retain 1:1 until September 30, 2026; 4:3 from October 1.",
        sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred",
        verifiedAt: "2026-09-15",
        terms: [
          { ratio: "1:1", eligibility: "Application before 2026-06-15", effectiveUntil: "2026-09-30" },
          { ratio: "4:3", eligibility: "Application on or after 2026-06-15", effectiveFrom: "2026-06-15" },
          { ratio: "4:3", eligibility: "All cardmembers", effectiveFrom: "2026-10-01" }
        ]
      },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      {
        name: "Annual Hotel Credit",
        amount: 100,
        frequency: "annual",
        type: "travel",
        description: "$100 for hotels booked through Chase Travel each account anniversary year.",
        resetPeriod: "anniversary",
        effectiveFrom: "2026-06-15",
        legacyTerms: [
          { amount: 50, effectiveUntil: "2026-06-14" }
        ],
        verifiedAt: "2026-09-15",
        sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred",
        id: "annual-hotel-credit",
        unit: "USD"
      },
      {
        name: "Global Entry/TSA PreCheck/NEXUS",
        amount: 120,
        frequency: "every 4 years",
        type: "travel",
        description: "Application-fee credit up to $120 every four years.",
        resetPeriod: "rolling",
        effectiveFrom: "2026-06-15",
        verifiedAt: "2026-09-15",
        sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred",
        id: "global-entry-tsa-precheck",
        unit: "USD",
        legacyNames: ["Global Entry/TSA PreCheck"]
      },
      { name: "DoorDash Non-Restaurant Credit", amount: 120, frequency: "monthly", type: "dining", description: "Up to $10 off an eligible non-restaurant DoorDash order each month after DashPass activation.", monthlyAmount: 10, resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred", id: "doordash-non-restaurant-credit", unit: "USD" }
    ],
    perks: [
      { name: "Points Boost", description: "Enhanced value on selected Chase Travel bookings; check the quoted redemption value. Legacy points may have different redemption terms.", type: "redemption", sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred", verifiedAt: "2026-09-15", id: "points-boost" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 12hr delay", type: "insurance", id: "trip-delay-insurance" },
      { name: "Trip Cancellation Insurance", description: "Up to $5,000 per person", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage worldwide", type: "insurance", id: "primary-car-rental-insurance" },
      { name: "Anniversary Bonus", description: "Retiring: applicants before June 15, 2026 earn the 10% purchase-based bonus through October 1, 2026; paid by January 31, 2027. New applicants are ineligible.", type: "points", effectiveUntil: "2026-10-01", eligibility: "Applied before June 15, 2026", sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred", verifiedAt: "2026-09-15", id: "anniversary-bonus" },
      { name: "Apple TV", description: "One complimentary year; activate by December 31, 2026. Eligibility terms apply.", type: "subscription", effectiveUntil: "2026-12-31", verifiedAt: "2026-09-15", sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred", id: "apple-tv" },
      { name: "Emergency Evacuation and Transportation", description: "Up to $100,000 subject to coverage conditions.", type: "insurance", effectiveFrom: "2026-06-15", verifiedAt: "2026-09-15", sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred", id: "emergency-evacuation-and-transportation" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred",
    sourceScope: "product",
    sourceUrls: ["https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["annualFee","earning","credits","transferPartners.Hyatt","perks.redemption","perks.anniversary-bonus","perks.apple-tv","perks.emergency-evacuation"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open"
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "Uber Credit", amount: 120, frequency: "monthly", type: "rideshare", description: "$10/month for Uber Eats or rides", monthlyAmount: 10, id: "uber-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Dining Credit", amount: 120, frequency: "monthly", type: "dining", description: "$10/month at select restaurants", monthlyAmount: 10, id: "dining-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Dunkin' Credit", amount: 84, frequency: "monthly", type: "dining", description: "$7/month at Dunkin'", monthlyAmount: 7, id: "dunkin-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "No Foreign Transaction Fees", description: "Use worldwide with no extra fees", type: "travel", id: "no-foreign-transaction-fees" },
      { name: "Purchase Protection", description: "Up to $10,000 per occurrence", type: "insurance", id: "purchase-protection" },
      { name: "Return Protection", description: "90 days, up to $300 per item", type: "insurance", id: "return-protection" }
    ],
    color: "#B5985A",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
  },
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 18 months on balance transfers", type: "apr", id: "0-intro-apr" },
      { name: "Citi Entertainment", description: "Access to presale tickets and events", type: "entertainment", id: "citi-entertainment" }
    ],
    color: "#003B70",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 15 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance", id: "purchase-protection" }
    ],
    color: "#117ACA",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 15 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Cell Phone Protection", description: "Up to $800 per claim", type: "insurance", id: "cell-phone-protection" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance", id: "purchase-protection" }
    ],
    color: "#0D4228",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "Instant upon approval",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Daily Rewards Posting", description: "Rewards post as soon as next day", type: "rewards", id: "daily-rewards-posting" },
      { name: "Prime Bonus Offers", description: "10%+ back on rotating Amazon selections", type: "rewards", id: "prime-bonus-offers" },
      { name: "No Earning Caps", description: "Unlimited earning with no point expiration", type: "rewards", id: "no-earning-caps" },
      { name: "Extended Warranty Protection", description: "Extends warranties up to 1 additional year", type: "protection", id: "extended-warranty-protection" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days up to $500/item", type: "protection", id: "purchase-protection" },
      { name: "Auto Rental Coverage", description: "Collision damage waiver", type: "insurance", id: "auto-rental-coverage" },
      { name: "Baggage Delay Insurance", description: "$100/day, max 3 days", type: "insurance", id: "baggage-delay-insurance" },
      { name: "Travel Accident Insurance", description: "Up to $500,000", type: "insurance", id: "travel-accident-insurance" },
      { name: "Lost Luggage Reimbursement", description: "Up to $3,000", type: "insurance", id: "lost-luggage-reimbursement" },
      { name: "No Foreign Transaction Fees", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fees" }
    ],
    color: "#FF9900",
    lastUpdated: "2026-01-26",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "First year",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Cashback Match", description: "Discover matches all cash back earned in first year", type: "bonus", id: "cashback-match" },
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Free FICO Score", description: "See your FICO score on statements", type: "credit", id: "free-fico-score" }
    ],
    color: "#FF6000",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.discover.com/credit-cards/cash-back/it-card.html",
    sourceScope: "product",
    sourceUrls: ["https://www.discover.com/credit-cards/cash-back/it-card.html"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr", id: "0-intro-apr" },
      { name: "Cell Phone Protection", description: "Up to $600 per claim", type: "insurance", id: "cell-phone-protection" },
      { name: "Roadside Dispatch", description: "24/7 roadside assistance", type: "travel", id: "roadside-dispatch" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.wellsfargo.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.wellsfargo.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Real-Time Crypto Rewards", description: "Rewards credited instantly in 40+ cryptocurrencies", type: "service", id: "real-time-crypto-rewards" },
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel", id: "no-foreign-transaction-fees" },
      { name: "No Exchange Fees", description: "No fees on crypto reward deposits", type: "service", id: "no-exchange-fees" },
      { name: "Metal Card Design", description: "Black, silver, or rose gold options", type: "service", id: "metal-card-design" },
      { name: "Mastercard World Benefits", description: "Priceless Experiences, ID Theft Protection", type: "protection", id: "mastercard-world-benefits" },
      { name: "Security Design", description: "No card number on physical card", type: "protection", id: "security-design" }
    ],
    color: "#00DCFA",
    lastUpdated: "2026-01-21",
    sourceUrl: "https://www.gemini.com/credit-card",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.gemini.com/credit-card"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.capitalone.com/credit-cards/" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Travel Accident Insurance", description: "Up to $250,000 coverage", type: "insurance", id: "travel-accident-insurance" },
      { name: "24-Hour Travel Assistance", description: "Emergency travel services", type: "travel", id: "24-hour-travel-assistance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.capitalone.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.capitalone.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Hotels", multiplier: 5, description: "Eligible hotel merchant purchases" },
        { category: "Airlines", multiplier: 4, description: "Eligible airline merchant purchases" },
        { category: "Other Travel", multiplier: 3, description: "Eligible travel including car rentals" },
        { category: "Dining", multiplier: 3, description: "Eligible restaurant purchases" }
      ]
    },
    transferPartners: [
      { name: "Air France/KLM", ratio: "1:1", type: "airline" },
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Choice Hotels", ratio: "1:1", type: "hotel" }
    ],
    credits: [
      { name: "Annual Airline Credit", amount: 50, frequency: "annual", type: "travel", description: "First airline purchase of at least $50. After year one, the credit year starts on the first of the month after your annual fee is assessed.", resetPeriod: "anniversary", resetDateNotes: "Use the first day of the month after annual fee assessment as this benefit’s reset date.", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/", id: "annual-airline-credit", unit: "USD" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Cell Phone Protection", description: "Up to $1,000 per claim; $25 deductible, maximum two paid claims per 12 months. Pay the monthly phone bill with the card.", type: "insurance", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/", id: "cell-phone-protection" },
      { name: "Trip Cancellation Insurance", description: "Up to $15,000 for eligible prepaid travel expenses when canceled or interrupted for a covered reason.", type: "insurance", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/", id: "trip-cancellation-insurance" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/",
    sourceScope: "product",
    sourceUrls: ["https://creditcards.wellsfargo.com/autograph-journey-visa-credit-card/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["earning","credits","perks.cell-phone-protection","perks.trip-cancellation"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open",
    retiredBenefits: [
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", status: "unsupported", reviewedAt: "2026-09-15", reviewNotes: "Removed from current benefits: not present in the issuer product and benefits listing." }
    ]
  },
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "Category 1-4 Hyatt property", id: "free-night-award", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Bonus Free Night", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 spend, Category 1-4", id: "bonus-free-night", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "Discoverist Status", description: "Automatic World of Hyatt Discoverist status", type: "status", id: "discoverist-status" },
      { name: "5 Elite Night Credits", description: "Toward next status tier annually", type: "status", id: "5-elite-night-credits" },
      { name: "DoorDash DashPass", description: "12 months complimentary", type: "subscription", id: "doordash-dashpass" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance", id: "primary-car-rental-insurance" }
    ],
    color: "#8B6914",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "Up to 35,000 points value", id: "free-night-award", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "Silver Elite Status", description: "Automatic Marriott Bonvoy Silver Elite", type: "status", id: "silver-elite-status" },
      { name: "15 Elite Night Credits", description: "Toward next status tier annually", type: "status", id: "15-elite-night-credits" },
      { name: "Gold Status Path", description: "Earn Gold after $35,000 annual spend", type: "status", id: "gold-status-path" }
    ],
    color: "#8B0029",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "marriott-bonvoy-brilliant",
    name: "Marriott Bonvoy Brilliant",
    issuer: "American Express",
    network: "American Express",
    annualFee: 650,
    signUpBonus: {
      amount: 150000,
      currency: "Marriott Bonvoy Points",
      spendRequirement: 8000,
      timeframe: "6 months",
      additionalInfo: "Earn 100,000 points after $6,000 in purchases, plus 50,000 more after an additional $2,000",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 2,
      categories: [
        { category: "Marriott Hotels", multiplier: 6, description: "Eligible purchases at participating Marriott Bonvoy hotels" },
        { category: "Restaurants", multiplier: 3, description: "Restaurants worldwide" },
        { category: "Flights", multiplier: 3, description: "Booked directly with airlines" }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "3:1", type: "airline" },
      { name: "Delta Airlines", ratio: "3:1", type: "airline" },
      { name: "American Airlines", ratio: "3:1", type: "airline" }
    ],
    credits: [
      { name: "Brilliant Dining Credit", amount: 300, frequency: "monthly", type: "dining", description: "Up to $25 per month at restaurants worldwide", monthlyAmount: 25, id: "brilliant-dining-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "One award after renewal, redeemable for a night up to 85,000 points", id: "free-night-award", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Marriott Property Credit", amount: 100, frequency: "per stay", type: "hotel", description: "Qualifying charges on eligible 2+ night Ritz-Carlton or St. Regis stays booked at the special rate", id: "marriott-property-credit", unit: "USD", resetPeriod: "per-use", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Up to $120 for Global Entry or $85 for TSA PreCheck", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Marriott Platinum Elite Status", description: "Complimentary Marriott Bonvoy Platinum Elite status", type: "status", id: "marriott-platinum-elite-status" },
      { name: "25 Elite Night Credits", description: "Toward the next Marriott Bonvoy status tier each calendar year", type: "status", id: "25-elite-night-credits" },
      { name: "Priority Pass Select", description: "Enrollment provides unlimited visits to participating airport lounges", type: "lounge", id: "priority-pass-select" },
      { name: "Brilliant Earned Choice Award", description: "Choose an award after $60,000 in eligible calendar-year purchases", type: "hotel", id: "brilliant-earned-choice-award" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Cell Phone Protection", description: "Up to $800 per claim, 2 claims per 12 months, with a $50 deductible", type: "insurance", id: "cell-phone-protection" },
      { name: "Trip Cancellation Insurance", description: "Up to $10,000 per trip and $20,000 per eligible card per 12 months", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Trip Delay Insurance", description: "Up to $500 per trip after a covered delay of more than 6 hours", type: "insurance", id: "trip-delay-insurance" }
    ],
    color: "#252525",
    lastUpdated: "2026-07-19",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Night Reward", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 calendar year spend", id: "free-night-reward", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Gold Status", description: "Automatic Hilton Honors Gold status", type: "status", id: "gold-status" },
      { name: "Priority Pass Select", description: "10 lounge visits per year", type: "lounge", id: "priority-pass-select" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Hilton Resort Credit", amount: 400, frequency: "annual", type: "hotel", description: "At Hilton Resorts", id: "hilton-resort-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Airline Fee Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline for incidentals", id: "airline-fee-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Free Night Reward", amount: 1, frequency: "annual", type: "hotel", description: "Automatically on card anniversary", id: "free-night-reward", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Diamond Status", description: "Automatic Hilton Honors Diamond status", type: "status", id: "diamond-status" },
      { name: "Priority Pass Select", description: "Unlimited lounge visits + 2 guests", type: "lounge", id: "priority-pass-select" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "40,000 point cert with unlimited top-off", id: "free-night-award", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "Platinum Elite Status", description: "Automatic IHG One Rewards Platinum Elite", type: "status", id: "platinum-elite-status" },
      { name: "4th Night Free", description: "On award stays of 4+ nights", type: "hotel", id: "4th-night-free" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#00857D",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Silver Elite Status", description: "Complimentary IHG One Rewards Silver Elite", type: "status", id: "silver-elite-status" },
      { name: "4th Night Free", description: "On award stays of 4+ nights booked with points", type: "hotel", id: "4th-night-free" },
      { name: "20% Point Discount", description: "Save 20% on IHG point purchases", type: "service", id: "20-point-discount" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#00857D",
    lastUpdated: "2026-01-21",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Delta Stays Credit", amount: 100, frequency: "annual", type: "travel", description: "Hotels/rentals via Delta.com", id: "delta-stays-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Flight Credit", amount: 200, frequency: "annual", type: "travel", description: "After $10,000 spend in calendar year", id: "flight-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Zone 5 priority boarding", type: "travel", id: "priority-boarding" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Resy Credit", amount: 120, frequency: "monthly", type: "dining", description: "$10/month at Resy restaurants", monthlyAmount: 10, id: "resy-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Rideshare Credit", amount: 120, frequency: "monthly", type: "rideshare", description: "$10/month on Uber and Lyft", monthlyAmount: 10, id: "rideshare-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip Main Cabin domestic/Caribbean", id: "companion-certificate", unit: "certificates", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Main Cabin 1 priority boarding", type: "travel", id: "priority-boarding" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Resy Credit", amount: 240, frequency: "monthly", type: "dining", description: "$20/month at Resy restaurants", monthlyAmount: 20, id: "resy-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Rideshare Credit", amount: 120, frequency: "monthly", type: "rideshare", description: "$10/month on Uber and Lyft", monthlyAmount: 10, id: "rideshare-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Delta Stays Credit", amount: 150, frequency: "annual", type: "travel", description: "Hotels/rentals via Delta.com", id: "delta-stays-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip First Class domestic", id: "companion-certificate", unit: "certificates", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Delta Sky Club", description: "15 visits/year, unlimited after $75K spend", type: "lounge", id: "delta-sky-club" },
      { name: "Centurion Lounge Access", description: "When flying Delta", type: "lounge", id: "centurion-lounge-access" },
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Zone 1 priority boarding", type: "travel", id: "priority-boarding" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "United Travel Credit", amount: 100, frequency: "annual", type: "travel", description: "After $10,000 spend", id: "united-travel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Instacart+ Credit", amount: 120, frequency: "monthly", type: "grocery", description: "Up to $10/month", monthlyAmount: 10, id: "instacart-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Avis/Budget Credit", amount: 50, frequency: "annual", type: "travel", description: "Rental car credit", id: "avis-budget-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On United flights for you + companion", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Group 2 boarding", type: "travel", id: "priority-boarding" },
      { name: "2 United Club Passes", description: "One-time lounge passes per year", type: "lounge", id: "2-united-club-passes" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Rideshare Credit", amount: 150, frequency: "monthly", type: "rideshare", description: "$12/month + $18 December", monthlyAmount: 12, id: "rideshare-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Instacart+ Credit", amount: 240, frequency: "monthly", type: "grocery", description: "$20/month + free membership", monthlyAmount: 20, id: "instacart-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Renowned Hotels Credit", amount: 200, frequency: "annual", type: "travel", description: "On qualifying stays", id: "renowned-hotels-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "United Club Membership", description: "Full membership + 2 guests", type: "lounge", id: "united-club-membership" },
      { name: "Two Free Checked Bags", description: "For you and companion on same ticket", type: "travel", id: "two-free-checked-bags" },
      { name: "Premier Access", description: "Priority check-in, boarding, and baggage", type: "travel", id: "premier-access" },
      { name: "25% Back on United", description: "Food, beverages, Wi-Fi, and premium drinks", type: "travel", id: "25-back-on-united" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      additionalInfo: "Plus 1,000 Premier Qualifying Points",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "United TravelBank Credit", amount: 200, frequency: "annual", type: "travel", description: "Use on any United purchase", id: "united-travelbank-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Instacart+ Credit", amount: 180, frequency: "monthly", type: "grocery", description: "$15/month for groceries", monthlyAmount: 15, id: "instacart-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "JSX Credit", amount: 150, frequency: "annual", type: "travel", description: "Semi-private air travel", id: "jsx-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Renowned Hotels Credit", amount: 150, frequency: "annual", type: "travel", description: "On qualifying bookings", id: "renowned-hotels-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Rideshare Credit", amount: 100, frequency: "annual", type: "rideshare", description: "Uber, Lyft, etc.", id: "rideshare-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Car Rental Credit", amount: 80, frequency: "annual", type: "travel", description: "On car rentals", id: "car-rental-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "For you on United flights", type: "travel", id: "first-checked-bag-free" },
      { name: "Second Checked Bag Free", description: "For you on United flights", type: "travel", id: "second-checked-bag-free" },
      { name: "Priority Boarding", description: "Group 2 boarding on United", type: "travel", id: "priority-boarding" },
      { name: "Primary Rental Car Insurance", description: "Up to $60,000 coverage", type: "insurance", id: "primary-rental-car-insurance" },
      { name: "Trip Delay Insurance", description: "$500 per ticket after 12hr delay", type: "insurance", id: "trip-delay-insurance" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "25% Back on United", description: "Food, beverages, Wi-Fi purchases", type: "travel", id: "25-back-on-united" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-16",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Southwest Travel Credit", amount: 75, frequency: "annual", type: "travel", description: "On Southwest purchases", id: "southwest-travel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Anniversary Points", amount: 7500, frequency: "annual", type: "points", description: "Bonus points each year", id: "anniversary-points", unit: "points", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" },
      { name: "Upgraded Boardings", amount: 4, frequency: "annual", type: "travel", description: "Reimbursements for A1-A15 boarding", id: "upgraded-boardings", unit: "visits", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Southwest flights", type: "travel", id: "first-checked-bag-free" },
      { name: "Seat Selection", description: "Pre-flight seat selection", type: "travel", id: "seat-selection" },
      { name: "In-Flight Perks", description: "25% back on drinks and WiFi", type: "travel", id: "in-flight-perks" },
      { name: "DoorDash DashPass", description: "12 months complimentary", type: "subscription", id: "doordash-dashpass" },
      { name: "Instacart+", description: "3 months free + $10/month credit", type: "subscription", id: "instacart" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Annual Hotel Credit", amount: 100, frequency: "annual", type: "travel", description: "$100 off hotel stay of $500+ on cititravel.com", id: "annual-hotel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Trip Delay Insurance", description: "Up to $500 per trip after delay", type: "insurance", id: "trip-delay-insurance" },
      { name: "Baggage Insurance", description: "Lost or damaged luggage coverage", type: "insurance", id: "baggage-insurance" },
      { name: "Citi Entertainment", description: "Access to presale tickets and events", type: "entertainment", id: "citi-entertainment" }
    ],
    color: "#003B70",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Annual Hotel Credit", amount: 300, frequency: "annual", type: "travel", description: "$300 off 2+ night hotel stay on cititravel.com", id: "annual-hotel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" },
      { name: "Splurge Credit", amount: 200, frequency: "annual", type: "lifestyle", description: "Choose up to two eligible brands: 1stDibs, American Airlines, Best Buy, Future Personal Training or Live Nation; exclusions apply.", id: "splurge-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.citi.com/credit-cards/citi-strata-all-cards" },
      { name: "Blacklane Credit", amount: 200, frequency: "semiannual", type: "travel", description: "$100 Jan-Jun, $100 Jul-Dec for chauffeur service", id: "blacklane-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-elite-travel-benefits", semiannualAmount: 100 },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "Unlimited lounge visits worldwide", type: "lounge", id: "priority-pass-select" },
      { name: "AA Admirals Club Passes", description: "4 passes per year", type: "lounge", id: "aa-admirals-club-passes" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Trip Cancellation Insurance", description: "Enhanced coverage for non-refundable expenses", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Trip Delay Insurance", description: "Up to $500 per trip after delay", type: "insurance", id: "trip-delay-insurance" }
    ],
    color: "#1A1F71",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards","https://www.citi.com/credit-cards/credit-card-rewards/citi-strata-elite-travel-benefits","https://www.citi.com/credit-cards/citi-strata-all-cards"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["credits.blacklane-credit","credits.splurge-credit"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
  },
  {
    id: "us-bank-altitude-reserve",
    name: "US Bank Altitude Reserve",
    issuer: "US Bank",
    network: "Visa",
    annualFee: 400,
    signUpBonus: {
      amount: 0,
      currency: "Altitude Points",
      description: "Closed to new applications; no current welcome offer.",
      offerStatus: "not-available",
      verifiedAt: "2026-09-15"
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
      { name: "Annual Travel Credit", amount: 325, frequency: "annual", type: "travel", description: "US Bank Travel Center bookings only", id: "annual-travel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.usbank.com/credit-cards/benefits.html" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.usbank.com/credit-cards/benefits.html" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "8 lounge visits per year + guests", type: "lounge", id: "priority-pass-select" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Primary Car Rental Insurance", description: "Primary CDW coverage", type: "insurance", id: "primary-car-rental-insurance" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Visa Infinite Benefits", description: "Premium Visa benefits package", type: "travel", id: "visa-infinite-benefits" }
    ],
    color: "#D32F2F",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.usbank.com/credit-cards/benefits.html",
    sourceScope: "product",
    sourceUrls: ["https://www.usbank.com/credit-cards/benefits.html"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["applicationStatus"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "closed",
    applicationNotes: "No longer accepting new applications. Retained for existing cardholders; account-specific terms apply."
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "CLEAR Plus Credit", amount: 209, frequency: "annual", type: "travel", description: "Statement credit for CLEAR Plus membership", id: "clear-plus-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Trip Delay Insurance", description: "Up to $300 per trip after 12hr delay", type: "insurance", id: "trip-delay-insurance" },
      { name: "Car Rental Insurance", description: "Secondary CDW coverage up to $50,000", type: "insurance", id: "car-rental-insurance" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence for 90 days", type: "insurance", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extra year on manufacturer warranties", type: "insurance", id: "extended-warranty" }
    ],
    color: "#006747",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Global Companion Award (25k)", amount: 1, frequency: "annual", type: "travel", description: "Up to 25,000 points off companion ticket", id: "global-companion-award-25k", unit: "certificates", pointLimit: 25000, resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" },
      { name: "Delay Voucher", amount: 50, frequency: "per occurrence", type: "travel", description: "Instant $50 voucher for 2hr+ delays", id: "delay-voucher", unit: "USD", resetPeriod: "per-use", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" }
    ],
    perks: [
      { name: "Alaska Lounge Passes", description: "8 passes per year (2 per quarter)", type: "lounge", id: "alaska-lounge-passes" },
      { name: "Free Checked Bags", description: "First bag free for 7 guests on same reservation", type: "travel", id: "free-checked-bags" },
      { name: "Priority Boarding", description: "Early group boarding on Alaska flights", type: "travel", id: "priority-boarding" },
      { name: "No Same-Day Change Fees", description: "Free same-day changes on Alaska flights", type: "travel", id: "no-same-day-change-fees" },
      { name: "Status Points Earning", description: "1 status point per $2 spent, 10,000 annually", type: "status", id: "status-points-earning" }
    ],
    color: "#00274C",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "N/A",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr", id: "10-intro-apr" },
      { name: "Bilt Cash Earning", description: "4% Bilt Cash on everyday spending", type: "rewards", id: "bilt-cash-earning" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards", id: "rent-rewards" }
    ],
    color: "#000000",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.cardless.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.cardless.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Bilt Travel Hotel Credit", amount: 100, frequency: "semiannual", type: "travel", description: "Up to $50 January–June and $50 July–December for eligible Bilt Travel hotel stays of at least two nights.", id: "bilt-travel-hotel-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.biltrewards.com/terms/bilt-card-offer-terms", semiannualAmount: 50 }
    ],
    perks: [
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr", id: "10-intro-apr" },
      { name: "Bilt Cash Earning", description: "4% Bilt Cash on everyday spending", type: "rewards", id: "bilt-cash-earning" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards", id: "rent-rewards" },
      { name: "Lyft Credits", description: "Credits for Lyft rides", type: "rideshare", id: "lyft-credits" }
    ],
    color: "#1C1C1C",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.biltrewards.com/terms/bilt-card-offer-terms",
    sourceScope: "product",
    sourceUrls: ["https://www.cardless.com/","https://www.biltrewards.com/terms/bilt-card-offer-terms"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["credits.bilt-travel-hotel-credit"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Bilt Travel Hotel Credit", amount: 400, frequency: "semiannual", type: "travel", description: "Up to $200 January–June and $200 July–December for eligible Bilt Travel hotel stays of at least two nights.", id: "bilt-travel-hotel-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.biltrewards.com/terms/bilt-card-offer-terms", semiannualAmount: 200 }
    ],
    perks: [
      { name: "10% Intro APR", description: "10% APR for first 12 months on purchases", type: "apr", id: "10-intro-apr" },
      { name: "Bilt Gold Status", description: "Automatic Bilt Gold status", type: "status", id: "bilt-gold-status" },
      { name: "2x Everyday Points", description: "2 Bilt points per dollar on all purchases except rent", type: "rewards", id: "2x-everyday-points" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Rent Rewards", description: "Earn points on rent with no added fee using Bilt Cash", type: "rewards", id: "rent-rewards" },
      { name: "Premium Lyft Credits", description: "Enhanced credits for Lyft rides", type: "rideshare", id: "premium-lyft-credits" },
      { name: "Dining Credits", description: "Credits at select Bilt partner restaurants", type: "dining", id: "dining-credits" }
    ],
    color: "#C0C0C0",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.biltrewards.com/terms/bilt-card-offer-terms",
    sourceScope: "product",
    sourceUrls: ["https://www.cardless.com/","https://www.biltrewards.com/terms/bilt-card-offer-terms"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["credits.bilt-travel-hotel-credit"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance", id: "extended-warranty" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      {
        name: "Hyatt",
        ratio: "1:1",
        type: "hotel",
        description: "Changes to 4:3 on October 1, 2026 for new and existing cardmembers.",
        sourceUrl: "https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred",
        verifiedAt: "2026-09-15",
        terms: [
          { ratio: "1:1", effectiveUntil: "2026-09-30" },
          { ratio: "4:3", effectiveFrom: "2026-10-01" }
        ]
      },
      { name: "IHG", ratio: "1:1", type: "hotel" },
      { name: "Marriott", ratio: "1:1", type: "hotel" }
    ],
    credits: [],
    perks: [
      { name: "Cell Phone Protection", description: "Up to $1,000 per claim, 3 claims/year", type: "insurance", id: "cell-phone-protection" },
      { name: "Trip Cancellation Insurance", description: "Up to $5,000 per person", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance", id: "purchase-protection" },
      { name: "1.25x Point Value", description: "Points worth 1.25¢ in Chase Travel Portal", type: "redemption", id: "1-25x-point-value" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/","https://media.chase.com/news/Meet-the-New-Chase-Sapphire-Preferred"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Hyatt"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" },
      { name: "Purchase Protection", description: "Covers new purchases for 120 days", type: "insurance", id: "purchase-protection" }
    ],
    color: "#1A4480",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Flights & Prepaid Hotels (Amex Travel)", multiplier: 5, description: "Eligible bookings through Amex Travel; direct airline bookings do not receive this bonus." },
        { category: "Key Business Categories / $5,000+ Purchases", multiplier: 2, description: "Eligible categories or single purchases of $5,000+; up to $2 million combined per calendar year." }
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "Airline Incidental Credit", amount: 200, frequency: "annual", type: "travel", description: "Select one airline, covers fees", id: "airline-incidental-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/" },
      { name: "Dell Credit", amount: 150, frequency: "annual", type: "business", description: "Up to $150 yearly for eligible U.S. Dell purchases; enrollment required.", id: "dell-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://global.americanexpress.com/card-benefits/detail/shop-dell/business-platinum" },
      { name: "Indeed Credit", amount: 360, frequency: "quarterly", type: "business", description: "Up to $90 each calendar quarter on eligible U.S. Indeed purchases; enrollment required.", id: "indeed-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://global.americanexpress.com/card-benefits/detail/indeed-benefit/business-platinum", quarterlyAmount: 90 },
      { name: "Adobe Creative Cloud Credit", amount: 250, frequency: "annual", type: "business", description: "$250 after $600 in eligible U.S. Adobe purchases per calendar year; enrollment required.", id: "adobe-creative-cloud-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://global.americanexpress.com/card-benefits/detail/adobe-benefit/business-platinum", minimumSpend: 600 },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Global Entry up to $120 every four years or TSA PreCheck up to $85 for a five-year membership; choose one.", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/" },
      { name: "Dell Spend Bonus", id: "dell-spend-bonus", amount: 1000, frequency: "annual", type: "business", description: "Additional $1,000 after $5,000 eligible U.S. Dell spend in a calendar year; enrollment required.", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://global.americanexpress.com/card-benefits/detail/shop-dell/business-platinum", minimumSpend: 5000 },
      { name: "Hotel Credit", id: "hotel-credit", amount: 600, frequency: "semiannual", type: "travel", description: "Prepaid FHR or The Hotel Collection through Amex Travel; $300 per half-year. Hotel Collection requires two nights.", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/", semiannualAmount: 300 },
      { name: "Hilton Credit", id: "hilton-credit", amount: 200, frequency: "quarterly", type: "hotel", description: "Up to $50 quarterly at eligible Hilton properties; enrollment required.", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/content/dam/amex/en-us/company/press-kits/platinum-refresh/U-S-Business-Platinum-Card-Fact-Sheet.pdf", quarterlyAmount: 50 },
      { name: "Wireless Credit", id: "wireless-credit", amount: 120, frequency: "monthly", type: "business", description: "Up to $10 monthly for eligible U.S. wireless service bills; enrollment required.", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://global.americanexpress.com/card-benefits/view-all/business-platinum", monthlyAmount: 10 },
      { name: "CLEAR Plus Credit", id: "clear-plus-credit", amount: 219, frequency: "annual", type: "travel", description: "Up to $219 yearly for CLEAR+ membership; taxes and fees excluded.", unit: "USD", resetPeriod: "calendar", verifiedAt: "2026-09-15", sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/" }
    ],
    perks: [
      { name: "Centurion Lounges", description: "Cardmember access; guests generally cost extra. Two complimentary guests after $75,000 eligible annual spend; location rules apply.", type: "lounge", sourceUrl: "https://www.thecenturionlounge.com/info/access/", verifiedAt: "2026-09-15", id: "centurion-lounges" },
      { name: "Priority Pass Select", description: "Enrollment required; cardmember plus up to two guests where permitted. Lounge capacity and guest restrictions apply.", type: "lounge", sourceUrl: "https://www.americanexpress.com/en-us/benefits/membership/?searchresult=lounge+access", verifiedAt: "2026-09-15", id: "priority-pass-select" },
      { name: "Delta Sky Club", description: "Access when flying Delta", type: "lounge", id: "delta-sky-club" },
      { name: "Hilton Gold Status", description: "Automatic Gold status", type: "status", id: "hilton-gold-status" },
      { name: "Marriott Gold Status", description: "Automatic Gold status", type: "status", id: "marriott-gold-status" },
      { name: "35% Points Rebate", description: "35% rebate on eligible Pay with Points flights through Amex Travel with your selected airline; up to 1 million points back per calendar year.", type: "redemption", id: "35-points-rebate", sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/", verifiedAt: "2026-09-15" }
    ],
    color: "#B0B7BC",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/",
    sourceScope: "product",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/business/business-credit-cards/american-express-business-platinum-credit-card-amex/","https://www.thecenturionlounge.com/info/access/","https://www.americanexpress.com/en-us/benefits/membership/?searchresult=lounge+access","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://global.americanexpress.com/card-benefits/detail/shop-dell/business-platinum","https://global.americanexpress.com/card-benefits/detail/adobe-benefit/business-platinum","https://global.americanexpress.com/card-benefits/detail/indeed-benefit/business-platinum","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["perks.centurion-lounges","perks.priority-pass-select","transferPartners.Etihad-removed","credits.dell-credit","credits.adobe-creative-cloud-credit","credits.indeed-credit","credits.global-entry-tsa-precheck","credits","earning","perks.35-percent-rebate","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "Flexible Credit", amount: 155, frequency: "annual", type: "business", description: "Use for Grubhub, Boxed, or Office Depot", id: "flexible-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Purchase Protection", description: "Up to $10,000 per occurrence", type: "insurance", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance", id: "extended-warranty" },
      { name: "25% Points Rebate", description: "25% back on Pay with Points for flights", type: "redemption", id: "25-points-rebate" }
    ],
    color: "#B5985A",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Expanded Buying Power", description: "Spend beyond your credit limit with eligibility", type: "business", id: "expanded-buying-power" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 12 months on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Expanded Buying Power", description: "Spend beyond your credit limit with eligibility", type: "business", id: "expanded-buying-power" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence", type: "insurance", id: "purchase-protection" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Emirates", ratio: "5:4", type: "airline", effectiveFrom: "2025-09-16", sourceUrl: "https://www.emirates.com/us/english/skywards/partners/amex/", verifiedAt: "2026-09-15" },
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
      { name: "Annual Fee Waived First Year", description: "$95 fee waived first year", type: "fee", id: "annual-fee-waived-first-year" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Purchase Protection", description: "Up to $1,000 per occurrence", type: "insurance", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extra year on eligible items", type: "insurance", id: "extended-warranty" }
    ],
    color: "#006747",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/","https://www.americanexpress.com/content/dam/amex/us/rewards/membership-rewards/mr-updates-final-june-2026.pdf","https://www.emirates.com/us/english/skywards/partners/amex/"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["transferPartners.Etihad-removed","transferPartners.Hawaiian-removed","transferPartners.Emirates"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Annual Travel Credit", amount: 300, frequency: "annual", type: "travel", description: "Capital One Travel bookings", id: "annual-travel-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.capitalone.com/small-business/credit-cards/venture-x-business/" },
      { name: "Anniversary Bonus", amount: 10000, frequency: "annual", type: "points", description: "10,000 bonus points each anniversary", id: "anniversary-bonus", unit: "points", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.capitalone.com/small-business/credit-cards/venture-x-business/" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.capitalone.com/small-business/credit-cards/venture-x-business/" }
    ],
    perks: [
      { name: "Capital One Lounges", description: "Access to Capital One Lounges + 2 guests", type: "lounge", id: "capital-one-lounges" },
      { name: "Priority Pass", description: "Unlimited visits + 2 guests", type: "lounge", id: "priority-pass" },
      { name: "Plaza Premium Lounges", description: "Unlimited access + 2 guests", type: "lounge", id: "plaza-premium-lounges" },
      { name: "Hertz President's Circle", description: "Top-tier rental car status", type: "status", id: "hertz-president-s-circle" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.capitalone.com/small-business/credit-cards/venture-x-business/",
    sourceScope: "product",
    sourceUrls: ["https://www.capitalone.com/small-business/credit-cards/venture-x-business/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Annual Fee Waived First Year", description: "$95 fee waived first year", type: "fee", id: "annual-fee-waived-first-year" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Free Employee Cards", description: "Unlimited employee cards at no extra cost", type: "business", id: "free-employee-cards" },
      { name: "Travel Accident Insurance", description: "Up to $250,000 coverage", type: "insurance", id: "travel-accident-insurance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.capitalone.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.capitalone.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Preset Spending Limit", description: "Flexible spending based on credit profile", type: "business", id: "no-preset-spending-limit" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Free Employee Cards", description: "Unlimited employee cards at no extra cost", type: "business", id: "free-employee-cards" },
      { name: "Purchase Records Download", description: "Easy expense tracking and reporting", type: "business", id: "purchase-records-download" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.capitalone.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.capitalone.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Zone 5 priority boarding", type: "travel", id: "priority-boarding" },
      { name: "20% Back on Inflight", description: "20% back on drinks, food, and WiFi", type: "travel", id: "20-back-on-inflight" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip Main Cabin domestic", id: "companion-certificate", unit: "certificates", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Main Cabin 1 priority boarding", type: "travel", id: "priority-boarding" },
      { name: "20% Back on Inflight", description: "20% back on drinks, food, and WiFi", type: "travel", id: "20-back-on-inflight" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Status Boost", description: "Earn MQM with spending", type: "status", id: "status-boost" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Delta Purchases", multiplier: 3, description: "Flights, in-flight, gift cards" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Round trip First Class domestic", id: "companion-certificate", unit: "certificates", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Delta Sky Club", description: "Unlimited access when flying Delta + 2 guests", type: "lounge", id: "delta-sky-club" },
      { name: "Centurion Lounge Access", description: "When flying Delta same day", type: "lounge", id: "centurion-lounge-access" },
      { name: "First Checked Bag Free", description: "On Delta flights for you + companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Zone 1 priority boarding", type: "travel", id: "priority-boarding" },
      { name: "Status Boost", description: "Earn MQM faster with spending", type: "status", id: "status-boost" }
    ],
    color: "#003366",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "First Checked Bag Free", description: "On United flights for you + companion on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Priority Boarding", description: "Group 2 boarding", type: "travel", id: "priority-boarding" },
      { name: "2 United Club Passes", description: "One-time lounge passes per year", type: "lounge", id: "2-united-club-passes" },
      { name: "25% Back on United", description: "Food, beverages, and WiFi", type: "travel", id: "25-back-on-united" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#0033A0",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "southwest-performance-business",
    name: "Southwest Rapid Rewards Performance Business",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 299,
    signUpBonus: {
      amount: 80000,
      currency: "Rapid Rewards Points",
      spendRequirement: 5000,
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Southwest", multiplier: 4, description: "Eligible Southwest purchases" },
        { category: "Hotels (direct)", multiplier: 2, description: "Direct hotel purchases" },
        { category: "Gas & Dining", multiplier: 2, description: "Gas stations and restaurants" },
        { category: "Transit & Rideshare", multiplier: 2, description: "Local transit and commuting" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Anniversary Points", amount: 9000, frequency: "annual", type: "points", description: "9,000 bonus points each year", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "anniversary-points", unit: "points" },
      { name: "Global Entry/TSA PreCheck/NEXUS", amount: 120, frequency: "every 4 years", type: "travel", description: "Application-fee reimbursement up to $120 every four years.", resetPeriod: "rolling", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "global-entry-tsa-precheck-nexus", unit: "USD" }
    ],
    retiredBenefits: [
      { id: "upgraded-boardings", name: "Upgraded Boardings", amount: 4, frequency: "annual", type: "travel", unit: "visits", resetPeriod: "unknown", status: "retired", description: "Historical A1–A15 boarding reimbursements; retained only for previously recorded usage.", verifiedAt: null, reviewNotes: "Quantity imported from the previous catalog for history migration. This is not a current benefit." }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "no-foreign-transaction-fee" },
      { name: "Companion Pass Progress", description: "Points count toward Companion Pass", type: "status", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "companion-pass-progress" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "employee-cards" },
      { name: "First Checked Bag", description: "First bag free for the primary cardmember and up to eight passengers on the same eligible reservation.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "first-checked-bag" },
      { name: "Group 5 Boarding", description: "Primary cardmember and up to eight companions on the same reservation; assigned-seat flights.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "group-5-boarding" },
      { name: "Inflight Savings", description: "25% back on eligible inflight purchases.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "inflight-savings" },
      { name: "Preferred Seats and Extra Legroom", description: "Preferred seats at booking and Extra Legroom upgrades within 48 hours of departure when available.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business", id: "preferred-seats-and-extra-legroom" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/performance-business",
    sourceScope: "product",
    sourceUrls: ["https://creditcards.chase.com/business-credit-cards/southwest/performance-business"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["annualFee","earning","credits","perks"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open"
  },
  {
    id: "southwest-premier-business",
    name: "Southwest Rapid Rewards Premier Business",
    issuer: "Chase",
    network: "Visa",
    cardType: "business",
    annualFee: 149,
    signUpBonus: {
      amount: 60000,
      currency: "Rapid Rewards Points",
      spendRequirement: 3000,
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Southwest", multiplier: 3, description: "Eligible Southwest purchases" },
        { category: "Gas & Dining", multiplier: 2, description: "First $8,000 combined each anniversary year; then 1x" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Anniversary Points", amount: 6000, frequency: "annual", type: "points", description: "6,000 bonus points each year", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "anniversary-points", unit: "points" },
      { name: "Anniversary Flight Discount", amount: 15, frequency: "annual", type: "travel", description: "One 15% flight-discount code each anniversary; Basic fares excluded.", unit: "percent", resetPeriod: "anniversary", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "anniversary-flight-discount" }
    ],
    perks: [
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "no-foreign-transaction-fee" },
      { name: "Companion Pass Progress", description: "Points count toward Companion Pass", type: "status", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "companion-pass-progress" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "employee-cards" },
      { name: "First Checked Bag", description: "First bag free for the primary cardmember and up to eight passengers on the same eligible reservation.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "first-checked-bag" },
      { name: "Group 5 Boarding", description: "Primary cardmember and up to eight companions on the same reservation; assigned-seat flights.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "group-5-boarding" },
      { name: "Inflight Savings", description: "25% back on eligible inflight purchases.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "inflight-savings" },
      { name: "Preferred Seat Selection", description: "Standard or Preferred seats within 48 hours of departure when available.", type: "travel", verifiedAt: "2026-09-15", sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business", id: "preferred-seat-selection" }
    ],
    color: "#F9B612",
    lastUpdated: "2026-09-15",
    sourceUrl: "https://creditcards.chase.com/business-credit-cards/southwest/premier-business",
    sourceScope: "product",
    sourceUrls: ["https://creditcards.chase.com/business-credit-cards/southwest/premier-business"],
    verifiedAt: null,
    reviewedAt: "2026-09-15",
    verificationStatus: "partially-verified",
    verifiedFields: ["annualFee","earning","credits","perks"],
    reviewNotes: "Only the listed fields were checked against issuer sources on 2026-09-15. Remaining terms and personalized welcome offers still need review.",
    applicationStatus: "open"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Night Award", amount: 1, frequency: "annual", type: "hotel", description: "Up to 35,000 points value", id: "free-night-award", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Silver Elite Status", description: "Automatic Marriott Bonvoy Silver Elite", type: "status", id: "silver-elite-status" },
      { name: "15 Elite Night Credits", description: "Toward next status tier annually", type: "status", id: "15-elite-night-credits" },
      { name: "Gold Status Path", description: "Earn Gold after $35,000 annual spend", type: "status", id: "gold-status-path" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#8B0029",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Free Weekend Night", amount: 1, frequency: "annual", type: "hotel", description: "After $15,000 spend in calendar year", id: "free-weekend-night", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/" }
    ],
    perks: [
      { name: "Gold Status", description: "Automatic Hilton Honors Gold status", type: "status", id: "gold-status" },
      { name: "Diamond Status Path", description: "Earn Diamond after $40,000 annual spend", type: "status", id: "diamond-status-path" },
      { name: "Priority Pass Select", description: "10 lounge visits per year", type: "lounge", id: "priority-pass-select" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#104C97",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "60 days",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "0% Intro APR", description: "0% for 9 billing cycles on purchases", type: "apr", id: "0-intro-apr" },
      { name: "Preferred Rewards Bonus", description: "Earn up to 75% more with Preferred Rewards", type: "redemption", id: "preferred-rewards-bonus" },
      { name: "Employee Cards", description: "Free employee cards at no extra cost", type: "business", id: "employee-cards" },
      { name: "Cash Flow Management", description: "Tools to manage business cash flow", type: "business", id: "cash-flow-management" }
    ],
    color: "#012169",
    lastUpdated: "2026-01-15",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "0% Intro APR", description: "0% for 15 billing cycles on purchases and balance transfers (within first 60 days)", type: "apr", id: "0-intro-apr" },
      { name: "Quarterly Spending Cap", description: "$2,500 combined quarterly cap on 3%/2% categories, then 1%", type: "rewards", id: "quarterly-spending-cap" },
      { name: "Monthly Category Changes", description: "Change choice category up to once per calendar month", type: "rewards", id: "monthly-category-changes" },
      { name: "Preferred Rewards Boost", description: "Earn 25%-75% more with Preferred Rewards banking relationship", type: "rewards", id: "preferred-rewards-boost" },
      { name: "No Foreign Transaction Fees", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fees" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-26",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      additionalInfo: "Plus $99 Companion Fare",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Alaska Lounge+ Discount", amount: 100, frequency: "annual", type: "travel", description: "$100 off Alaska Lounge+ membership ($795/year)", id: "alaska-lounge-discount", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" },
      { name: "Inflight Purchase Credit", amount: 20, frequency: "per transaction", type: "travel", description: "20% back on Alaska/Hawaiian inflight purchases", id: "inflight-purchase-credit", unit: "percent", resetPeriod: "per-use", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" }
    ],
    perks: [
      { name: "Free Checked Bag", description: "1 free bag for you + up to 6 companions on same reservation", type: "travel", id: "free-checked-bag" },
      { name: "Preferred Boarding", description: "Priority boarding on Alaska and Hawaiian flights", type: "travel", id: "preferred-boarding" },
      { name: "$99 Companion Fare", description: "Annual benefit after $6k spend; $99 + taxes (~$122 total)", type: "travel", id: "99-companion-fare" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Status Points", description: "Earn 1 status point per $3 spent (no cap starting 2026)", type: "status", id: "status-points" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-16",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
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
      timeframe: "6 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "Disney Bundle Credit", amount: 120, frequency: "monthly", type: "subscription", description: "$10/month back on Disney+, Hulu, ESPN+", monthlyAmount: 10, id: "disney-bundle-credit", unit: "USD", resetPeriod: "calendar", verifiedAt: null, sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/" }
    ],
    perks: [
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr", id: "0-intro-apr" },
      { name: "Purchase Protection", description: "Coverage for eligible purchases against damage/theft", type: "protection", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty up to 1 year", type: "protection", id: "extended-warranty" },
      { name: "Return Protection", description: "Refund for eligible items merchant won't take back", type: "protection", id: "return-protection" },
      { name: "Car Rental Loss & Damage", description: "Secondary coverage when renting a car", type: "insurance", id: "car-rental-loss-damage" }
    ],
    color: "#006FCF",
    lastUpdated: "2026-01-16",
    sourceUrl: "https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/",
    sourceScope: "product",
    sourceUrls: ["https://www.americanexpress.com/us/credit-cards/card/blue-cash-preferred/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel", id: "no-foreign-transaction-fees" },
      { name: "Worldwide Car Rental Insurance", description: "Coverage when renting a car", type: "insurance", id: "worldwide-car-rental-insurance" },
      { name: "Travel & Emergency Assistance", description: "24/7 travel assistance services", type: "travel", id: "travel-emergency-assistance" },
      { name: "Roadside Assistance", description: "Emergency roadside services", type: "service", id: "roadside-assistance" },
      { name: "Purchase Protection", description: "Damage and theft protection within 120 days", type: "protection", id: "purchase-protection" },
      { name: "$0 Fraud Liability", description: "No liability for unauthorized charges", type: "protection", id: "0-fraud-liability" },
      { name: "Citi Quick Lock", description: "Instantly freeze/unfreeze your card", type: "service", id: "citi-quick-lock" },
      { name: "Citi Entertainment", description: "Early access to concert and event tickets", type: "service", id: "citi-entertainment" }
    ],
    color: "#1B3668",
    lastUpdated: "2026-01-21",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
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
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
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
      { name: "0% Intro APR", description: "0% for 12 months on purchases and balance transfers", type: "apr", id: "0-intro-apr" },
      { name: "No Foreign Transaction Fees", description: "No fees on international purchases", type: "travel", id: "no-foreign-transaction-fees" },
      { name: "Hertz Five Star Status", description: "Complimentary Hertz Five Star rental status", type: "status", id: "hertz-five-star-status" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty", type: "protection", id: "extended-warranty" },
      { name: "Travel Accident Insurance", description: "Coverage for travel accidents", type: "insurance", id: "travel-accident-insurance" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-26",
    sourceUrl: "https://www.capitalone.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.capitalone.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
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
      { name: "0% Intro APR on Purchases", description: "0% for 12 months, then 17.49%-28.24% variable", type: "apr", id: "0-intro-apr-on-purchases" },
      { name: "0% Intro APR on Balance Transfers", description: "0% for 21 months, then 17.49%-28.24% variable", type: "apr", id: "0-intro-apr-on-balance-transfers" },
      { name: "No Late Fees Ever", description: "You'll never pay a late fee", type: "feature", id: "no-late-fees-ever" },
      { name: "No Penalty APR", description: "Your rate won't increase even if you pay late", type: "feature", id: "no-penalty-apr" }
    ],
    color: "#003DA5",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      { name: "Annual Statement Credit", amount: 20, frequency: "annual", type: "statement", description: "Earn $20 for 11 consecutive months of purchases", id: "annual-statement-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.usbank.com/credit-cards.html" }
    ],
    perks: [
      { name: "0% Intro APR", description: "0% for 24 billing cycles on purchases and balance transfers", type: "apr", id: "0-intro-apr" },
      { name: "Purchase Protection", description: "Covers eligible purchases against damage or theft", type: "protection", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extends manufacturer warranty", type: "protection", id: "extended-warranty" },
      { name: "Cell Phone Protection", description: "Up to $600 per claim when you pay your phone bill with this card", type: "protection", id: "cell-phone-protection" }
    ],
    color: "#002855",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer",
    sourceUrl: "https://www.usbank.com/credit-cards.html",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.usbank.com/credit-cards.html"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      { name: "0% Intro APR on Purchases", description: "0% for 21 months, then 17.74%-29.74% variable", type: "apr", id: "0-intro-apr-on-purchases" },
      { name: "0% Intro APR on Balance Transfers", description: "0% for 21 months, then 17.74%-29.74% variable", type: "apr", id: "0-intro-apr-on-balance-transfers" },
      { name: "Cell Phone Protection", description: "Up to $600 when you pay your phone bill with this card", type: "protection", id: "cell-phone-protection" },
      { name: "Roadside Dispatch", description: "24/7 roadside assistance", type: "travel", id: "roadside-dispatch" }
    ],
    color: "#D71E28",
    lastUpdated: "2026-01-27",
    cardType: "balance-transfer",
    sourceUrl: "https://creditcards.wellsfargo.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.wellsfargo.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
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
      { name: "No Annual Fee", description: "No annual fee", type: "fee", id: "no-annual-fee" },
      { name: "No Foreign Transaction Fees", description: "Great for international purchases", type: "travel", id: "no-foreign-transaction-fees" },
      { name: "Credit Building", description: "Designed for students to build credit", type: "feature", id: "credit-building" }
    ],
    color: "#D03027",
    lastUpdated: "2026-01-27",
    cardType: "student",
    sourceUrl: "https://www.capitalone.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.capitalone.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown",
    rewardCurrency: "cashback"
  },
  {
    id: "cardless-qatar-infinite",
    name: "Qatar Airways Privilege Club Infinite",
    issuer: "Cardless",
    network: "Visa",
    annualFee: 499,
    signUpBonus: {
      amount: 85000,
      currency: "Avios",
      spendRequirement: 6000,
      timeframe: "90 days",
      additionalInfo: "25,000 Avios after first transaction + 60,000 Avios after spend requirement",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Qatar Airways", multiplier: 5, description: "Flights and purchases" },
        { category: "Restaurants", multiplier: 3, description: "Dining worldwide" }
      ]
    },
    transferPartners: [
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Finnair", ratio: "1:1", type: "airline" }
    ],
    credits: [],
    perks: [
      { name: "Privilege Club Gold Status", description: "First year automatic Gold status with lounge access", type: "status", id: "privilege-club-gold-status" },
      { name: "Oneworld Sapphire Status", description: "Business class lounges, priority boarding, extra bags", type: "status", id: "oneworld-sapphire-status" },
      { name: "Qpoints Earning", description: "2 Qpoints per 1,500 Avios earned", type: "status", id: "qpoints-earning" },
      { name: "Award Fee Waiver", description: "Waived award fees when meeting spend thresholds", type: "travel", id: "award-fee-waiver" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Points Never Expire", description: "Avios don't expire as long as you use your card", type: "rewards", id: "points-never-expire" },
      { name: "Visa Infinite Benefits", description: "Premium Visa benefits package", type: "travel", id: "visa-infinite-benefits" }
    ],
    color: "#5C0632",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.cardless.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.cardless.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "bofa-air-france-klm",
    name: "Air France KLM Visa Signature",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 89,
    signUpBonus: {
      amount: 70000,
      currency: "Flying Blue Miles",
      spendRequirement: 3000,
      timeframe: "90 days",
      additionalInfo: "Plus 100 XP (Experience Points) for Silver status",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "Air France/KLM/SkyTeam", multiplier: 3, description: "Bookings with Air France, KLM, and SkyTeam airlines" },
        { category: "Dining", multiplier: 3, description: "Restaurants worldwide" }
      ]
    },
    transferPartners: [],
    credits: [],
    perks: [
      { name: "Flying Blue Elite Status", description: "Earn up to 160 XP/year toward Silver, Gold, Platinum status", type: "status", id: "flying-blue-elite-status" },
      { name: "Anniversary Bonus", description: "5,000 bonus miles + 20 XP after $50 annual spend", type: "rewards", id: "anniversary-bonus" },
      { name: "Spend Bonuses", description: "80 XP at $15,000 spend + 60 XP at $25,000 spend annually", type: "status", id: "spend-bonuses" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Visa Signature Benefits", description: "Premium Visa benefits package", type: "travel", id: "visa-signature-benefits" }
    ],
    color: "#00205B",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "citi-aadvantage-platinum-select",
    name: "Citi AAdvantage Platinum Select",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 99,
    signUpBonus: {
      amount: 80000,
      currency: "AAdvantage Miles",
      spendRequirement: 3500,
      timeframe: "4 months",
      additionalInfo: "Annual fee waived first year",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "American Airlines", multiplier: 2, description: "Eligible AA purchases" },
        { category: "Restaurants", multiplier: 2, description: "Dining worldwide" },
        { category: "Gas Stations", multiplier: 2, description: "At the pump" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Flight Discount", amount: 125, frequency: "annual", type: "travel", description: "After $20,000 spend and card renewal", id: "flight-discount", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "For you + up to 4 companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Preferred Boarding", description: "Priority boarding on American Airlines flights", type: "travel", id: "preferred-boarding" },
      { name: "25% Savings Inflight", description: "Save 25% on inflight food and beverage purchases", type: "travel", id: "25-savings-inflight" },
      { name: "Loyalty Points", description: "1 Loyalty Point per mile earned from purchases", type: "status", id: "loyalty-points" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Turo Credit", description: "Up to $180/year in Turo statement credits", type: "travel", id: "turo-credit" }
    ],
    color: "#1B3668",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "citi-aadvantage-globe",
    name: "Citi AAdvantage Globe",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 350,
    signUpBonus: {
      amount: 90000,
      currency: "AAdvantage Miles",
      spendRequirement: 5000,
      timeframe: "4 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "American Airlines", multiplier: 2, description: "Eligible AA purchases" },
        { category: "Restaurants", multiplier: 2, description: "Dining worldwide" },
        { category: "Hotels", multiplier: 2, description: "Hotel stays" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Admirals Club Passes", amount: 4, frequency: "annual", type: "lounge", description: "4 Globe Passes per calendar year ($300+ value)", id: "admirals-club-passes", unit: "visits", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" },
      { name: "Annual Splurge Credit", amount: 100, frequency: "annual", type: "lifestyle", description: "Choose up to 2 brands: AAdvantage Hotels, 1stDibs, Live Nation, etc.", id: "annual-splurge-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" },
      { name: "Companion Certificate", amount: 1, frequency: "annual", type: "travel", description: "Starting year 2; $99 fee + taxes for domestic Main Cabin", id: "companion-certificate", unit: "certificates", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "For you + up to 8 companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Preferred Boarding", description: "Priority boarding on American Airlines flights", type: "travel", id: "preferred-boarding" },
      { name: "Flight Streak Bonus", description: "5,000 Loyalty Points per 4 AA flights (up to 15,000/year)", type: "status", id: "flight-streak-bonus" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Travel Protection", description: "Trip cancellation, delay, and luggage protection", type: "insurance", id: "travel-protection" }
    ],
    color: "#1B3668",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "citi-aadvantage-executive",
    name: "Citi AAdvantage Executive",
    issuer: "Citi",
    network: "Mastercard",
    annualFee: 595,
    signUpBonus: {
      amount: 70000,
      currency: "AAdvantage Miles",
      spendRequirement: 10000,
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "American Airlines", multiplier: 2, description: "Eligible AA purchases" },
        { category: "All Purchases", multiplier: 1, description: "Everything else" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.citi.com/credit-cards" }
    ],
    perks: [
      { name: "Admirals Club Membership", description: "Full membership ($700-850 value) at lounges worldwide", type: "lounge", id: "admirals-club-membership" },
      { name: "First Checked Bag Free", description: "For you + up to 8 companions on same reservation", type: "travel", id: "first-checked-bag-free" },
      { name: "Enhanced Airport Experience", description: "Priority check-in, screening, and boarding", type: "travel", id: "enhanced-airport-experience" },
      { name: "25% Savings Inflight", description: "Save 25% on inflight food and beverage purchases", type: "travel", id: "25-savings-inflight" },
      { name: "Loyalty Points Bonuses", description: "10,000 bonus at 50,000 LP + 10,000 at 90,000 LP", type: "status", id: "loyalty-points-bonuses" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Travel Protection", description: "Trip cancellation, delay, and luggage protection", type: "insurance", id: "travel-protection" }
    ],
    color: "#1B3668",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.citi.com/credit-cards",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.citi.com/credit-cards"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "bofa-premium-rewards",
    name: "Bank of America Premium Rewards",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 60000,
      currency: "Points",
      spendRequirement: 4000,
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" },
        { category: "Dining", multiplier: 2, description: "Restaurants worldwide" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Airline Incidental Credit", amount: 100, frequency: "annual", type: "travel", description: "Seat upgrades, baggage fees, lounge access", id: "airline-incidental-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" },
      { name: "Global Entry/TSA PreCheck", amount: 100, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" }
    ],
    perks: [
      { name: "Preferred Rewards Bonus", description: "Earn 25-75% more points with Preferred Rewards status", type: "rewards", id: "preferred-rewards-bonus" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Trip Delay Insurance", description: "Reimbursement for delays over 12 hours", type: "insurance", id: "trip-delay-insurance" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Baggage Insurance", description: "Lost or delayed luggage coverage", type: "insurance", id: "baggage-insurance" },
      { name: "Purchase Protection", description: "Repair or replacement for 90 days, up to $10,000", type: "protection", id: "purchase-protection" },
      { name: "Extended Warranty", description: "Extra year on manufacturer warranties", type: "protection", id: "extended-warranty" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "bofa-premium-rewards-elite",
    name: "Bank of America Premium Rewards Elite",
    issuer: "Bank of America",
    network: "Visa",
    annualFee: 550,
    signUpBonus: {
      amount: 75000,
      currency: "Points",
      spendRequirement: 5000,
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1.5,
      categories: [
        { category: "Travel", multiplier: 2, description: "Airlines, hotels, car rentals" },
        { category: "Dining", multiplier: 2, description: "Restaurants worldwide" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Airline Incidental Credit", amount: 300, frequency: "annual", type: "travel", description: "Seat upgrades, baggage fees, lounge fees", id: "airline-incidental-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" },
      { name: "Lifestyle Credit", amount: 150, frequency: "annual", type: "lifestyle", description: "Streaming, food delivery, fitness, rideshare", id: "lifestyle-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" },
      { name: "Global Entry/TSA PreCheck", amount: 120, frequency: "every 4 years", type: "travel", description: "Statement credit for application fee", id: "global-entry-tsa-precheck", unit: "USD", resetPeriod: "rolling", verifiedAt: null, sourceUrl: "https://www.bankofamerica.com/credit-cards/" }
    ],
    perks: [
      { name: "Priority Pass Select", description: "4 complimentary memberships with lounge access", type: "lounge", id: "priority-pass-select" },
      { name: "Preferred Rewards Bonus", description: "Earn 25-75% more points with Preferred Rewards status", type: "rewards", id: "preferred-rewards-bonus" },
      { name: "20% Airfare Savings", description: "20% off when paying with points through Travel Center", type: "travel", id: "20-airfare-savings" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Trip Delay Insurance", description: "Reimbursement for delays", type: "insurance", id: "trip-delay-insurance" },
      { name: "Trip Cancellation Insurance", description: "Coverage for non-refundable expenses", type: "insurance", id: "trip-cancellation-insurance" },
      { name: "Purchase Protection", description: "Repair or replacement for eligible items", type: "protection", id: "purchase-protection" }
    ],
    color: "#E31837",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.bankofamerica.com/credit-cards/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.bankofamerica.com/credit-cards/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "synchrony-virgin-red",
    name: "Virgin Red Rewards Mastercard",
    issuer: "Synchrony",
    network: "Mastercard",
    annualFee: 99,
    signUpBonus: {
      amount: 60000,
      currency: "Virgin Points",
      spendRequirement: 3000,
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Virgin Atlantic/Hotels/Voyages", multiplier: 3, description: "Virgin brand purchases" },
        { category: "Dining", multiplier: 2, description: "Restaurants" },
        { category: "Grocery Stores", multiplier: 2, description: "Supermarkets" },
        { category: "Streaming Services", multiplier: 2, description: "Entertainment subscriptions" },
        { category: "EV Charging", multiplier: 2, description: "Electric vehicle charging" }
      ]
    },
    transferPartners: [
      { name: "Virgin Atlantic", ratio: "1:1", type: "airline" }
    ],
    credits: [
      { name: "Anniversary Points", amount: 5000, frequency: "annual", type: "points", description: "5,000 Virgin Points upon card renewal", id: "anniversary-points", unit: "points", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.virgin.com/virgin-red/rewards-credit-card" },
      { name: "Third Night Free", amount: 1, frequency: "annual", type: "hotel", description: "Book 2 nights, get 3rd free at Virgin Hotels", id: "third-night-free", unit: "nights", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://www.virgin.com/virgin-red/rewards-credit-card" }
    ],
    perks: [
      { name: "Personal Perks", description: "Spend $15K for 1 perk, $30K for 2: companion seat, hotel night, or bar credit", type: "rewards", id: "personal-perks" },
      { name: "Flying Club Tier Points", description: "25 Tier Points per $2,500 monthly spend (max 50/month)", type: "status", id: "flying-club-tier-points" },
      { name: "Authorized User Bonus", description: "2,500 points per added user (up to 10,000)", type: "rewards", id: "authorized-user-bonus" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Points Never Expire", description: "Virgin Points don't expire while card is active", type: "rewards", id: "points-never-expire" },
      { name: "Mastercard World Elite Benefits", description: "Premium Mastercard benefits", type: "travel", id: "mastercard-world-elite-benefits" }
    ],
    color: "#E10A0A",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://www.virgin.com/virgin-red/rewards-credit-card",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://www.virgin.com/virgin-red/rewards-credit-card"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "chase-british-airways",
    name: "British Airways Visa Signature",
    issuer: "Chase",
    network: "Visa",
    annualFee: 95,
    signUpBonus: {
      amount: 75000,
      currency: "Avios",
      spendRequirement: 5000,
      timeframe: "3 months",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "British Airways/Aer Lingus/Iberia/LEVEL", multiplier: 3, description: "Flight purchases" },
        { category: "Hotels (direct)", multiplier: 2, description: "Booked directly with hotels" }
      ]
    },
    transferPartners: [
      { name: "British Airways", ratio: "1:1", type: "airline" },
      { name: "Aer Lingus", ratio: "1:1", type: "airline" },
      { name: "Iberia", ratio: "1:1", type: "airline" }
    ],
    credits: [
      { name: "Reward Flight Statement Credit", amount: 600, frequency: "annual", type: "travel", description: "$100-200 per booking (3x/year) toward taxes/fees on reward flights", id: "reward-flight-statement-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://creditcards.chase.com/" }
    ],
    perks: [
      { name: "Travel Together Ticket", description: "After $30,000 annual spend: companion flies free or 50% off Avios", type: "travel", id: "travel-together-ticket" },
      { name: "10% Discount on BA Flights", description: "10% off when booking US-London flights at ba.com", type: "travel", id: "10-discount-on-ba-flights" },
      { name: "Pay Taxes with Avios", description: "Use Avios to cover award ticket taxes and fees", type: "travel", id: "pay-taxes-with-avios" },
      { name: "DashPass", description: "12 months complimentary DoorDash DashPass", type: "subscription", id: "dashpass" },
      { name: "DoorDash Credit", description: "$10 off quarterly non-restaurant orders", type: "dining", id: "doordash-credit" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Oneworld Redemptions", description: "Redeem Avios on AA, Alaska, Qantas, Qatar, and more", type: "travel", id: "oneworld-redemptions" }
    ],
    color: "#075AAA",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "chase-marriott-bold",
    name: "Marriott Bonvoy Bold",
    issuer: "Chase",
    network: "Visa",
    annualFee: 0,
    signUpBonus: {
      amount: 2,
      currency: "Free Night Awards",
      spendRequirement: 1000,
      timeframe: "3 months",
      additionalInfo: "Each Free Night valid at properties up to 50,000 points",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "Marriott Hotels", multiplier: 14, description: "Up to 14x total: 3x card + base member earnings" },
        { category: "Grocery Stores", multiplier: 2, description: "Supermarkets" },
        { category: "Internet/Cable/Phone", multiplier: 2, description: "Monthly services" },
        { category: "Streaming Services", multiplier: 2, description: "Entertainment subscriptions" },
        { category: "Rideshare", multiplier: 2, description: "Uber, Lyft, taxis" },
        { category: "Food Delivery", multiplier: 2, description: "DoorDash, Uber Eats, Grubhub, etc." }
      ]
    },
    transferPartners: [
      { name: "United Airlines", ratio: "3:1", type: "airline" },
      { name: "Delta Airlines", ratio: "3:1", type: "airline" },
      { name: "American Airlines", ratio: "3:1", type: "airline" }
    ],
    credits: [],
    perks: [
      { name: "No Annual Fee", description: "No annual fee ever", type: "fee", id: "no-annual-fee" },
      { name: "Silver Elite Status", description: "Automatic Marriott Bonvoy Silver Elite status", type: "status", id: "silver-elite-status" },
      { name: "5 Elite Night Credits", description: "Toward next status tier annually", type: "status", id: "5-elite-night-credits" },
      { name: "DashPass", description: "12 months complimentary DoorDash DashPass", type: "subscription", id: "dashpass" },
      { name: "DoorDash Credit", description: "$10 off quarterly non-restaurant orders", type: "dining", id: "doordash-credit" },
      { name: "Pay Yourself Back", description: "Redeem points for statement credits on airlines and Marriott", type: "redemption", id: "pay-yourself-back" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" }
    ],
    color: "#8B0029",
    lastUpdated: "2026-01-27",
    sourceUrl: "https://creditcards.chase.com/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://creditcards.chase.com/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  },
  {
    id: "barclays-jetblue-plus",
    name: "JetBlue Plus Card",
    issuer: "Barclays",
    network: "Mastercard",
    annualFee: 99,
    signUpBonus: {
      amount: 70000,
      currency: "TrueBlue Points",
      spendRequirement: 1000,
      timeframe: "90 days",
      verifiedAt: null,
      offerStatus: "unverified"
    },
    earning: {
      base: 1,
      categories: [
        { category: "JetBlue and Paisly", multiplier: 6, description: "Eligible JetBlue, JetBlue Vacations, and Paisly purchases" },
        { category: "Restaurants", multiplier: 2, description: "Dining purchases" },
        { category: "Grocery Stores", multiplier: 2, description: "Eligible grocery purchases" }
      ]
    },
    transferPartners: [],
    credits: [
      { name: "Anniversary Points", amount: 5000, frequency: "annual", type: "points", description: "5,000 TrueBlue points after account anniversary", id: "anniversary-points", unit: "points", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://cards.barclaycardus.com/banking/cards/jetblue-plus-card/" },
      { name: "JetBlue Vacations Credit", amount: 100, frequency: "annual", type: "travel", description: "Statement credit after a qualifying JetBlue Vacations package purchase", id: "jetblue-vacations-credit", unit: "USD", resetPeriod: "unknown", verifiedAt: null, sourceUrl: "https://cards.barclaycardus.com/banking/cards/jetblue-plus-card/" }
    ],
    perks: [
      { name: "First Checked Bag Free", description: "First checked bag for cardmember and up to 3 companions on JetBlue-operated flights", type: "travel", id: "first-checked-bag-free" },
      { name: "10% Points Back", description: "10% of points back after redeeming for JetBlue-operated award flights", type: "redemption", id: "10-points-back" },
      { name: "50% In-Flight Savings", description: "Savings on eligible food and drink purchases aboard JetBlue-operated flights", type: "travel", id: "50-in-flight-savings" },
      { name: "No Foreign Transaction Fee", description: "Use abroad with no extra fees", type: "travel", id: "no-foreign-transaction-fee" },
      { name: "Points Payback", description: "Redeem points for statement credits on eligible purchases", type: "redemption", id: "points-payback" },
      { name: "Mosaic Status Path", description: "Earn tiles through eligible card spend toward TrueBlue perks and Mosaic status", type: "status", id: "mosaic-status-path" }
    ],
    color: "#003876",
    lastUpdated: "2026-06-05",
    sourceUrl: "https://cards.barclaycardus.com/banking/cards/jetblue-plus-card/",
    sourceScope: "issuer-directory",
    sourceUrls: ["https://cards.barclaycardus.com/banking/cards/jetblue-plus-card/"],
    verifiedAt: null,
    reviewedAt: null,
    verificationStatus: "needs-review",
    verifiedFields: [],
    reviewNotes: "Imported terms have not received a complete issuer review. Confirm current offers, eligibility and benefit terms with the issuer.",
    applicationStatus: "unknown"
  }
];
// Both removed duplicate records used these same IDs; saved wallets need no ID rewrite.
// Add a mapping here only when an actually published product ID changes.
const CARD_ID_ALIASES = Object.freeze({});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CARDS_DATABASE;
}
