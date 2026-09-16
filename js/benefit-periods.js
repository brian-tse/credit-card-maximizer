// Pure benefit-period logic shared by every tracker view and regression tests.
(function (root) {
  'use strict';
  // Pre-v3 displayed amounts, retained only to migrate undated historical checkboxes.
  // They are estimates, not current terms or proof of the amount actually redeemed.
  const LEGACY_VALUES = {
  "chase-sapphire-reserve|lyft-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "chase-sapphire-reserve|doordash-credits": {
    "amount": 300,
    "frequency": "annual",
    "monthlyAmount": 25
  },
  "amex-platinum|uber-credit": {
    "amount": 200,
    "frequency": "annual",
    "monthlyAmount": 15
  },
  "amex-platinum|digital-entertainment": {
    "amount": 300,
    "frequency": "annual",
    "monthlyAmount": 25
  },
  "amex-platinum|walmart-membership": {
    "amount": 155,
    "frequency": "annual"
  },
  "amex-platinum|equinox-credit": {
    "amount": 300,
    "frequency": "annual",
    "monthlyAmount": 25
  },
  "amex-platinum|clear-plus-credit": {
    "amount": 199,
    "frequency": "annual"
  },
  "amex-platinum|global-entry-tsa-precheck": {
    "amount": 100,
    "frequency": "every 4 years"
  },
  "capital-one-venture-x|global-entry-tsa-precheck": {
    "amount": 100,
    "frequency": "every 4 years"
  },
  "chase-sapphire-preferred|annual-hotel-credit": {
    "amount": 50,
    "frequency": "annual"
  },
  "chase-sapphire-preferred|global-entry-tsa-precheck": {
    "amount": 100,
    "frequency": "every 4 years"
  },
  "amex-gold|uber-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "amex-gold|dining-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "amex-gold|dunkin-credit": {
    "amount": 84,
    "frequency": "annual",
    "monthlyAmount": 7
  },
  "marriott-bonvoy-brilliant|brilliant-dining-credit": {
    "amount": 300,
    "frequency": "annual",
    "monthlyAmount": 25
  },
  "delta-skymiles-platinum|resy-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "delta-skymiles-platinum|rideshare-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "delta-skymiles-reserve|resy-credit": {
    "amount": 240,
    "frequency": "annual",
    "monthlyAmount": 20
  },
  "delta-skymiles-reserve|rideshare-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "united-explorer|instacart-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  },
  "united-club-infinite|rideshare-credit": {
    "amount": 150,
    "frequency": "annual",
    "monthlyAmount": 12
  },
  "united-club-infinite|instacart-credit": {
    "amount": 240,
    "frequency": "annual",
    "monthlyAmount": 20
  },
  "united-quest|instacart-credit": {
    "amount": 180,
    "frequency": "annual",
    "monthlyAmount": 15
  },
  "citi-strata-elite|blacklane-credit": {
    "amount": 200,
    "frequency": "annual"
  },
  "atmos-rewards-summit|global-companion-award-25k": {
    "amount": 25000,
    "frequency": "annual"
  },
  "bilt-obsidian|bilt-travel-hotel-credit": {
    "amount": 100,
    "frequency": "annual"
  },
  "bilt-palladium|bilt-travel-hotel-credit": {
    "amount": 400,
    "frequency": "annual"
  },
  "amex-business-platinum|dell-credit": {
    "amount": 200,
    "frequency": "semiannual",
    "semiannualAmount": 100
  },
  "amex-business-platinum|indeed-credit": {
    "amount": 360,
    "frequency": "annual"
  },
  "amex-business-platinum|adobe-creative-cloud-credit": {
    "amount": 150,
    "frequency": "annual"
  },
  "amex-business-platinum|global-entry-tsa-precheck": {
    "amount": 100,
    "frequency": "every 4 years"
  },
  "boa-atmos-ascent|inflight-purchase-credit": {
    "amount": "20%",
    "frequency": "per transaction"
  },
  "amex-blue-cash-preferred|disney-bundle-credit": {
    "amount": 120,
    "frequency": "annual",
    "monthlyAmount": 10
  }
};
  const finite = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
  const dateKey = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const parseDate = value => { if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null; const [y, m, d] = value.split('-').map(Number); const date = new Date(y, m - 1, d); return dateKey(date) === value ? date : null; };
  function addMonths(date, months) { const target = new Date(date.getFullYear(), date.getMonth() + months, 1); target.setDate(Math.min(date.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate())); return target; }
  const sanitize = name => name.replace(/[\s'"/\\]+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
  const creditId = credit => credit.id || sanitize(credit.name).toLowerCase();
  const frequency = credit => credit.monthlyAmount != null || credit.monthlyAmounts ? 'monthly' : credit.frequency || 'other';
  const years = credit => Number(String(credit.frequency).match(/every\s+([\d.]+)\s+years?/)?.[1] || 0);
  function unit(credit) { return credit.unit || (credit.type === 'points' ? 'points' : 'unknown'); }
  function periodAmount(credit, date) {
    if (!finite(credit.amount)) return 0;
    if (frequency(credit) === 'monthly') return finite(credit.monthlyAmounts?.[date.getMonth()]) ? credit.monthlyAmounts[date.getMonth()] : finite(credit.monthlyAmount) ? credit.monthlyAmount : credit.amount / 12;
    if (frequency(credit) === 'quarterly') return finite(credit.quarterlyAmount) ? credit.quarterlyAmount : credit.amount / 4;
    if (frequency(credit) === 'semiannual') return finite(credit.semiannualAmount) ? credit.semiannualAmount : credit.amount / 2;
    return credit.amount;
  }
  function anchorFor(cardId, snapshot) {
    const renewal = parseDate(snapshot.renewalDates?.[cardId]);
    if (renewal) return renewal;
    const signup = snapshot.signupDates?.[cardId];
    return signup?.year && signup?.month ? parseDate(`${signup.year}-${String(signup.month).padStart(2, '0')}-${String(signup.day || 1).padStart(2, '0')}`) : null;
  }
  function periodFor(card, credit, now = new Date(), snapshot = {}) {
    const freq = frequency(credit), y = now.getFullYear(), m = now.getMonth();
    let start, end, label, warning = '', dateUnknown = false, keyOverride;
    if (freq === 'monthly') { start = new Date(y, m, 1); end = new Date(y, m + 1, 1); label = start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }); }
    else if (freq === 'quarterly') { const q = Math.floor(m / 3); start = new Date(y, q * 3, 1); end = new Date(y, q * 3 + 3, 1); label = `Q${q + 1} ${y}`; }
    else if (freq === 'semiannual') { const h = m < 6 ? 0 : 6; start = new Date(y, h, 1); end = new Date(y, h + 6, 1); label = `${h === 0 ? 'Jan–Jun' : 'Jul–Dec'} ${y}`; }
    else if (freq === 'annual') {
      const anchor = anchorFor(card.id, snapshot);
      if (credit.resetPeriod === 'anniversary' && anchor) {
        const monthOffset = (y - anchor.getFullYear()) * 12;
        start = addMonths(anchor, monthOffset);
        if (start > now) start = addMonths(anchor, monthOffset - 12);
        end = addMonths(anchor, (start.getFullYear() - anchor.getFullYear() + 1) * 12);
        label = 'Cardmember year';
        if (!snapshot.renewalDates?.[card.id] && !snapshot.signupDates?.[card.id]?.day) warning = 'Signup day is unknown. This period uses the first of the signup month; confirm the exact reset with your issuer.';
      } else {
        start = new Date(y, 0, 1); end = new Date(y + 1, 0, 1); label = String(y);
        if (credit.resetPeriod === 'anniversary') warning = 'Add your signup or renewal date to track your cardmember year; January–December shown for now.';
        else if (credit.resetPeriod !== 'calendar') warning = 'Reset terms need verification. Calendar-year tracking is a placeholder; check your issuer account.';
      }
    } else if (years(credit)) {
      const interval = Math.round(years(credit) * 12), prefix = `benefit|${card.id}|${creditId(credit)}|`;
      const previous = Object.entries(snapshot.benefits || {}).filter(([key, value]) => key.startsWith(prefix) && value?.completed && parseDate(value.usedAt)).map(([, value]) => parseDate(value.usedAt)).sort((a, b) => b - a)[0];
      const undatedEntry = Object.entries(snapshot.benefits || {}).filter(([key, value]) => key.startsWith(prefix) && value?.completed && value.migrated && !parseDate(value.usedAt) && parseDate(value.periodStart)).sort(([a], [b]) => a.localeCompare(b))[0];
      const anchor = previous || anchorFor(card.id, snapshot);
      if (!previous && undatedEntry) {
        // A legacy checkmark has no redemption date. Keep its original identity
        // until the user supplies one, instead of inventing another use each year.
        const [existingKey, undated] = undatedEntry;
        keyOverride = existingKey;
        start = parseDate(undated.periodStart);
        end = parseDate(undated.periodEnd) || addMonths(start, interval);
        dateUnknown = true;
        warning = 'Imported use date is unknown. Enter the actual date below to determine when this benefit renews.';
      } else if (anchor) {
        const cycles = Math.max(0, Math.floor(((y - anchor.getFullYear()) * 12 + m - anchor.getMonth()) / interval));
        start = addMonths(anchor, cycles * interval);
        if (start > now && cycles > 0) start = addMonths(anchor, (cycles - 1) * interval);
        end = addMonths(start, interval);
        // Retain the key of a redemption until its rolling eligibility expires.
        if (previous && now < addMonths(previous, interval)) {
          const entry = Object.entries(snapshot.benefits).find(([key, value]) => key.startsWith(prefix) && value?.completed && value.usedAt === dateKey(previous));
          if (entry) { keyOverride = entry[0]; start = previous; end = addMonths(previous, interval); }
        }
      } else {
        start = new Date(y, 0, 1); end = addMonths(start, interval);
        warning = 'Eligibility date is unknown. Mark used with the actual redemption date; check issuer terms before claiming another reimbursement.';
      }
      label = `Every ${years(credit)} years`;
    } else { start = new Date(2000, 0, 1); end = new Date(2200, 0, 1); label = credit.frequency || 'Other benefit'; warning = 'Track each use with your issuer; this checklist does not imply a recurring allowance.'; }
    const key = keyOverride || `benefit|${card.id}|${creditId(credit)}|${dateKey(start)}`;
    return { key, start: dateKey(start), end: dateKey(end), label, warning, dateUnknown, amount: periodAmount(credit, start), cashValue: unit(credit) === 'USD' ? periodAmount(credit, start) : 0, frequency: freq };
  }
  function usedDateError(period, value, now = new Date()) {
    if (!parseDate(value)) return 'Enter a valid usage date.';
    if (value > dateKey(now)) return 'The usage date cannot be in the future.';
    if (['monthly', 'quarterly', 'semiannual', 'annual'].includes(period.frequency) && (value < period.start || value >= period.end)) return 'Choose a usage date within this benefit period.';
    return '';
  }
  function makeRecord(card, credit, period, completed, usedAt = dateKey(new Date())) {
    return { completed, usedAt: completed ? usedAt : null, cardId: card.id, creditId: creditId(credit), periodStart: period.start, periodEnd: period.end, cashValue: period.cashValue, unit: unit(credit) };
  }
  function migrateLegacy(cards, snapshot, now = new Date(), aliases = {}) {
    const benefits = { ...snapshot.benefits };
    const canonical = id => aliases[id] || id;
    for (const card of cards) for (const credit of [...(card.credits || []), ...(card.retiredBenefits || [])]) {
      // Correct a previously misclassified non-cash award without deleting its
      // usage date or original amount. Saved voucher history must not count as USD.
      if (['points', 'nights', 'certificates', 'visits', 'percent', 'Bilt Cash', 'voucher', 'crypto'].includes(unit(credit))) {
        for (const [key, record] of Object.entries(benefits)) {
          if (key.startsWith('benefit|') && record?.cardId === card.id && record.creditId === creditId(credit) && record.unit === 'USD') {
            benefits[key] = { ...record, originalUnit: record.unit, originalCashValue: record.cashValue, unit: unit(credit), cashValue: 0 };
          }
        }
      }
      const names = [credit.name, ...(credit.legacyNames || [])].map(sanitize);
      const ids = [card.id, ...Object.keys(aliases).filter(id => canonical(id) === card.id)];
      for (const [oldKey, value] of Object.entries(snapshot.benefits || {})) {
        if (typeof value !== 'boolean') continue;
        const migrationKey = `migration|${oldKey}`;
        if (Object.hasOwn(benefits, migrationKey)) continue;
        const matched = ids.some(id => names.some(name => oldKey.endsWith(`_${id}_${name}`)));
        if (!matched) continue;
        let date = now, legacyPeriod = oldKey.match(/^monthly_(\d{4})-(\d{2})_/) || oldKey.match(/^(?:semiannual|quarterly)_(\d{4})_[HQ]([1-4])_/) || oldKey.match(/^annual_(\d{4})_/);
        if (legacyPeriod) {
          const month = oldKey.startsWith('monthly_') ? Number(legacyPeriod[2]) - 1 : oldKey.startsWith('semiannual_') ? (Number(legacyPeriod[2]) - 1) * 6 : oldKey.startsWith('quarterly_') ? (Number(legacyPeriod[2]) - 1) * 3 : 0;
          date = new Date(Number(legacyPeriod[1]), month, 1);
        }
        // Old annual records were calendar-based; preserve that historical interpretation.
        const legacy = LEGACY_VALUES[card.id + '|' + creditId(credit)];
        const oldCredit = legacy ? { ...credit, monthlyAmount: undefined, quarterlyAmount: undefined, semiannualAmount: undefined, monthlyAmounts: undefined, ...legacy } : credit;
        const period = periodFor(card, oldKey.startsWith('annual_') ? { ...oldCredit, resetPeriod: 'calendar' } : oldCredit, date, snapshot);
        if (/^(onetime|multiyear)_/.test(oldKey) && !Object.hasOwn(snapshot.benefits || {}, period.key)) {
          // A source checkbox without a date has one deterministic identity even
          // when two offline devices first migrate it in different calendar years.
          period.key = `benefit|${card.id}|${creditId(credit)}|legacy-undated`;
        }
        if (frequency(oldCredit) !== frequency(credit)) period.key += '|legacy-' + frequency(oldCredit);
        if (oldKey.startsWith('annual_') && credit.resetPeriod === 'anniversary') period.warning = 'Imported record used calendar-year tracking; actual redemption date is unknown.';
        if (!Object.hasOwn(benefits, period.key)) benefits[period.key] = { ...makeRecord(card, credit, period, value, legacyPeriod ? dateKey(date) : null), migrated: true, dateEstimated: true };
        // Both old multi-year views map to one key; either checked view counts as used.
        else if (/^(onetime|multiyear)_/.test(oldKey) && value && benefits[period.key].migrated) benefits[period.key].completed = true;
        // Keep the original boolean for recovery, with a separate consumed marker.
        // This survives edits/deletion of the migrated record and syncs per item.
        benefits[migrationKey] = { completed: false, legacyKey: oldKey, targetKey: period.key };
      }
    }
    return benefits;
  }
  function capturedThisYear(benefits, now = new Date(), cardId) {
    let value = 0, estimated = false;
    for (const [key, record] of Object.entries(benefits)) {
      if (!key.startsWith('benefit|') || !record?.completed || (cardId && record.cardId !== cardId) || !record.usedAt || record.usedAt.slice(0, 4) !== String(now.getFullYear()) || record.usedAt > dateKey(now)) continue;
      if (record.unit === 'USD' && finite(record.cashValue)) { value += record.cashValue; estimated ||= !!record.dateEstimated; }
    }
    return { value, estimated };
  }
  root.CardMaxPeriods = { dateKey, parseDate, addMonths, frequency, creditId, periodAmount, periodFor, makeRecord, usedDateError, migrateLegacy, capturedThisYear, unit };
  if (typeof module !== 'undefined') module.exports = root.CardMaxPeriods;
})(typeof window !== 'undefined' ? window : globalThis);
