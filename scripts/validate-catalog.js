const assert = require('node:assert/strict');
const units = new Set(['USD', 'points', 'nights', 'certificates', 'visits', 'percent']);
const frequencies = new Set(['annual', 'monthly', 'quarterly', 'semiannual', 'per stay', 'per occurrence', 'per transaction']);
const resetPeriods = new Set(['calendar', 'anniversary', 'rolling', 'per-use', 'unknown']);
const verificationStates = new Set(['needs-review', 'partially-verified', 'verified']);
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const time = Date.parse(value + 'T00:00:00Z');
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value;
}
function validSource(value) {
  try { const url = new URL(value); return url.protocol === 'https:' && !!url.hostname && !url.username && !url.password; }
  catch { return false; }
}
function validateMetadata(item, scope) {
  if (!item || typeof item !== 'object') return;
  for (const key of ['effectiveFrom', 'effectiveUntil', 'verifiedAt', 'reviewedAt', 'lastUpdated']) {
    if (item[key] != null) assert(validDate(item[key]), `Invalid ${key}: ${scope}`);
  }
  if (item.effectiveFrom && item.effectiveUntil) assert(item.effectiveFrom <= item.effectiveUntil, `Reversed effective dates: ${scope}`);
  if (item.sourceUrl != null) assert(validSource(item.sourceUrl), `Invalid source URL: ${scope}`);
  if (item.sourceUrls != null) assert(Array.isArray(item.sourceUrls) && item.sourceUrls.every(validSource), `Invalid source URLs: ${scope}`);
  for (const [key, value] of Object.entries(item)) if (value && typeof value === 'object') validateMetadata(value, `${scope}/${key}`);
}
function validateCatalog(cards) {
  assert(Array.isArray(cards) && cards.length > 0, 'Catalog must contain cards');
  const ids = new Set(), names = new Set();
  let credits = 0;
  for (const card of cards) {
    assert(typeof card.id === 'string' && idPattern.test(card.id), 'Invalid card ID');
    assert(!ids.has(card.id), `Duplicate ID: ${card.id}`); ids.add(card.id);
    assert(typeof card.name === 'string' && card.name.trim() && typeof card.issuer === 'string' && card.issuer.trim(), `Missing card name/issuer: ${card.id}`);
    const name = `${card.issuer}:${card.name}`.toLowerCase().replace(/[^a-z0-9]/g, '');
    assert(!names.has(name), `Duplicate card: ${card.name}`); names.add(name);
    assert(Number.isFinite(card.annualFee) && card.annualFee >= 0, `Invalid fee: ${card.id}`);
    assert(validSource(card.sourceUrl), `Missing/invalid issuer source: ${card.id}`);
    assert(verificationStates.has(card.verificationStatus), `Invalid verification status: ${card.id}`);
    if (card.verificationStatus === 'verified') assert(validDate(card.verifiedAt), `Verified card needs verification date: ${card.id}`);
    assert(Array.isArray(card.credits) && Array.isArray(card.perks) && Array.isArray(card.transferPartners), `Missing benefit arrays: ${card.id}`);
    validateMetadata(card, card.id);
    const benefitIds = new Set();
    for (const credit of card.credits) {
      credits++;
      const scope = `${card.id}/${credit.name}`;
      assert(typeof credit.id === 'string' && idPattern.test(credit.id) && !benefitIds.has(credit.id), `Missing/duplicate benefit ID: ${scope}`);
      benefitIds.add(credit.id);
      assert(units.has(credit.unit), `Invalid unit: ${scope}`);
      assert(Number.isFinite(credit.amount) && credit.amount >= 0, `Invalid amount: ${scope}`);
      const multiYear = String(credit.frequency).match(/^every (\d+(?:\.\d+)?) years?$/);
      assert(frequencies.has(credit.frequency) || (multiYear && Number(multiYear[1]) > 0), `Unsupported frequency: ${scope}`);
      assert(resetPeriods.has(credit.resetPeriod), `Unsupported reset period: ${scope}`);
      if (multiYear) assert.equal(credit.resetPeriod, 'rolling', `Multi-year benefit must use a rolling period: ${scope}`);
      if (credit.frequency?.startsWith('per ')) assert.equal(credit.resetPeriod, 'per-use', `Per-use benefit must use a per-use period: ${scope}`);
      for (const field of ['monthlyAmount', 'quarterlyAmount', 'semiannualAmount']) {
        if (credit[field] != null) assert(Number.isFinite(credit[field]) && credit[field] >= 0 && credit[field] <= credit.amount, `Invalid ${field}: ${scope}`);
      }
      if (credit.monthlyAmounts != null) {
        assert(Array.isArray(credit.monthlyAmounts) && credit.monthlyAmounts.length === 12 && credit.monthlyAmounts.every(amount => Number.isFinite(amount) && amount >= 0), `Invalid monthly amounts: ${scope}`);
        assert(Math.abs(credit.monthlyAmounts.reduce((sum, amount) => sum + amount, 0) - credit.amount) < 0.01, `Monthly amounts must equal annual cap: ${scope}`);
      }
      if (credit.type === 'points') assert.notEqual(credit.unit, 'USD', `Points cannot be cash: ${scope}`);
      if (/free night|night free|certificate/i.test(credit.name)) assert.notEqual(credit.unit, 'USD', `Award cannot be cash: ${scope}`);
    }
    const perkIds = new Set();
    for (const perk of card.perks) {
      assert(typeof perk.id === 'string' && idPattern.test(perk.id) && !perkIds.has(perk.id), `Missing/duplicate perk ID: ${card.id}/${perk.name}`);
      perkIds.add(perk.id);
    }
  }
  return { cards: cards.length, credits };
}
module.exports = { validateCatalog, validDate };
if (require.main === module) {
  const result = validateCatalog(require('../data/cards.js'));
  console.log(`Validated ${result.cards} unique cards and ${result.credits} benefit records.`);
}
