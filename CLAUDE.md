# CardMax Project Instructions

## New Card Workflow

### Trigger
User says: `New Card: "Card Name"`

### Phase 1: Research
Search multiple sources for card information:
- Official issuer website (chase.com, americanexpress.com, etc.)
- NerdWallet
- The Points Guy
- Doctor of Credit
- Recent blog posts for current offers/changes

### Phase 2: Present Findings
Display a structured summary for verification:

```
CARD: [Card Name]
══════════════════════════════════════
BASIC INFO
  Issuer:      [Issuer]
  Network:     [Visa/Mastercard/Amex]
  Annual Fee:  $[Amount]

SIGN-UP BONUS
  Amount:      [Points] [Currency]
  Spend:       $[Amount] in [Timeframe]

EARNING RATES
  • [Category]: [X]x - [Description]
  • Base: [X]x

TRANSFER PARTNERS
  Airlines: [List]
  Hotels: [List]

CREDITS
  • [Credit name] - $[Amount] [frequency]

PERKS
  • [Perk name] - [Description]

SOURCES CHECKED
  ✓ [source1]
  ✓ [source2]
  ✓ [source3]
══════════════════════════════════════
```

### Phase 3: Verification
Ask user: "Does this look accurate? Any corrections?"

### Phase 4: Add to Database
After approval, add the card to `data/cards.js` following the existing structure:
- Generate kebab-case id (e.g., "chase-sapphire-preferred")
- Include all fields: id, name, issuer, network, annualFee, signUpBonus, earning, transferPartners, credits, perks, color, lastUpdated
- Use appropriate brand color for the card
- Set lastUpdated to current date

### Phase 5: Download Card Image
Download the card image and save to `images/cards/`:
1. Search for card image from these sources (in order of preference):
   - Official issuer website product page
   - NerdWallet card page
   - The Points Guy card page
2. Download the image using curl:
   ```bash
   curl -o "images/cards/{card-id}.png" "{image-url}"
   ```
3. Image requirements:
   - Filename must match the card's kebab-case id (e.g., `citi-costco-anywhere.png`)
   - PNG format preferred
   - Should be a clear product shot of the card face
4. Verify the image downloaded correctly
5. **Add card ID to `CARDS_WITH_IMAGES` array in `js/card-visuals.js`** (required for image to display)

## Data Structure Reference

Cards in `data/cards.js` follow this structure:

```javascript
{
  id: "issuer-card-name",           // kebab-case unique identifier
  name: "Full Card Name",
  issuer: "Issuer Name",
  network: "Visa|Mastercard|American Express",
  annualFee: 0,                     // number, no $ sign
  signUpBonus: {
    amount: 60000,
    currency: "Points Currency Name",
    spendRequirement: 4000,
    timeframe: "3 months"
  },
  earning: {
    base: 1,                        // base points per dollar
    categories: [
      { category: "Category Name", multiplier: 3, description: "Details" }
    ]
  },
  transferPartners: [               // only for cards with transferable points
    { name: "Partner Name", ratio: "1:1", type: "airline|hotel" }
  ],
  credits: [
    {
      name: "Credit Name",
      amount: 100,                  // annual total
      frequency: "monthly|annual|semiannual|every 4 years",
      type: "travel|dining|entertainment|rideshare|etc",
      description: "Details",
      monthlyAmount: 10,            // optional, if monthly
      semiannualAmount: 50          // optional, if semiannual
    }
  ],
  perks: [
    { name: "Perk Name", description: "Details", type: "lounge|status|insurance|protection|service|subscription" }
  ],
  color: "#hexcolor",               // brand color for UI
  lastUpdated: "YYYY-MM-DD"
}
```

## Brand Colors Reference
- Chase: #004879
- American Express: #006FCF
- Capital One: #D03027
- Citi: #1B3668
- Bank of America: #E31837
- Wells Fargo: #B71C1C
- Discover: #FF6B00
- Bilt/Cardless: #1a1a1a
- US Bank: #0033A0
- Barclays: #00AEEF
