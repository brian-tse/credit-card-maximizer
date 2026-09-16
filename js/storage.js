// Versioned local state. Every item carries its own revision; removals remain as tombstones.
(function (root) {
  'use strict';
  const VERSION = 3;
  const STATE_KEY = 'cardmax_state_v3';
  const OWNER_KEY = 'cardmax_state_owner';
  const LEGACY_KEY = 'cardmax_legacy_unowned_v3';
  const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const owner = () => localStorage.getItem(OWNER_KEY) || 'anonymous';
  const sessionOwner = () => typeof root.CardMaxAuth?.getCurrentUser === 'function' ? root.CardMaxAuth.getCurrentUser()?.uid || 'anonymous' : owner();
  function assertOwner(expected) { if (expected !== undefined && owner() !== expected) throw new Error('Account changed in another tab; refresh before editing.'); }
  const GROUPS = ['cards', 'signupDates', 'renewalDates', 'annualFees', 'benefits', 'settings'];
  const KEYS = { cards: 'cardmax_user_cards', signupDates: 'cardmax_signup_dates', renewalDates: 'cardmax_renewal_dates', benefits: 'cardmax_tracked_benefits', annualFees: 'cardmax_annual_fees' };
  const safeKey = key => typeof key === 'string' && key.length < 600 && !['__proto__', 'constructor', 'prototype'].includes(key);
  const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const empty = () => ({ version: VERSION, items: Object.fromEntries(GROUPS.map(group => [group, {}])) });
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  function parse(key, fallback) { const raw = localStorage.getItem(key); return raw === null ? fallback : JSON.parse(raw); }
  const normalizeCards = ids => root.CardMaxModel ? root.CardMaxModel.normalizeCardIds(ids) : (Array.isArray(ids) ? ids : []).filter(id => typeof id === 'string' && /^[a-z0-9-]+$/.test(id));
  function readSnapshot() {
    return { cards: normalizeCards(parse(KEYS.cards, [])), signupDates: parse(KEYS.signupDates, {}), renewalDates: parse(KEYS.renewalDates, {}), annualFees: parse(KEYS.annualFees, {}), benefits: parse(KEYS.benefits, {}), settings: { sortPreference: localStorage.getItem('cardmax_sort_option') || 'issuer', pointValuations: parse('cardmax_point_valuations', {}) } };
  }
  function validateSnapshot(input) {
    if (!object(input) || !Array.isArray(input.cards) || input.cards.length > 500 || input.cards.some(id => !safeKey(id) || !/^[a-z0-9-]+$/.test(id))) throw new Error('Invalid card list');
    const result = { cards: [...new Set(input.cards)] };
    for (const group of ['signupDates', 'renewalDates', 'annualFees', 'benefits', 'settings']) {
      const value = input[group] || {};
      if (!object(value) || Object.keys(value).length > 50000 || Object.keys(value).some(key => !safeKey(key))) throw new Error('Invalid ' + group);
      result[group] = JSON.parse(JSON.stringify(value));
    }
    const validDate = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
    for (const date of Object.values(result.signupDates)) {
      if (!object(date) || (date.year != null && (!Number.isInteger(date.year) || date.year < 1900 || date.year > 2200)) || (date.month != null && (!Number.isInteger(date.month) || date.month < 1 || date.month > 12)) || (date.day != null && (!Number.isInteger(date.day) || date.day < 1 || date.day > 31))) throw new Error('Invalid signup date');
      if (date.year && date.month && date.day && !validDate(`${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`)) throw new Error('Invalid signup date');
    }
    if (Object.values(result.renewalDates).some(date => !validDate(date))) throw new Error('Invalid renewal date');
    if (Object.values(result.annualFees).some(value => typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 10000)) throw new Error('Invalid annual fee');
    for (const benefit of Object.values(result.benefits)) {
      if (typeof benefit === 'boolean') continue;
      if (!object(benefit) || typeof benefit.completed !== 'boolean' || (benefit.usedAt != null && !validDate(benefit.usedAt)) || (benefit.cashValue != null && (typeof benefit.cashValue !== 'number' || !Number.isFinite(benefit.cashValue) || benefit.cashValue < 0))) throw new Error('Invalid benefit record');
    }
    const settings = result.settings;
    if (settings.sortPreference !== undefined && (typeof settings.sortPreference !== 'string' || settings.sortPreference.length > 50)) throw new Error('Invalid sort preference');
    if (settings.pointValuations !== undefined && (!object(settings.pointValuations) || Object.values(settings.pointValuations).some(v => typeof v !== 'number' || !Number.isFinite(v) || v < 0 || v > 1000))) throw new Error('Invalid point valuations');
    return result;
  }
  function snapshotItems(snapshot) { return { ...snapshot, cards: Object.fromEntries(snapshot.cards.map(id => [id, true])) }; }
  function materialize(state) {
    const snapshot = {};
    for (const group of GROUPS) snapshot[group] = Object.fromEntries(Object.entries(state.items[group]).filter(([, record]) => !record.deleted).map(([key, record]) => [key, record.value]));
    snapshot.cards = Object.keys(snapshot.cards);
    return snapshot;
  }
  function validateState(state) {
    if (!object(state) || state.version !== VERSION || !object(state.items)) throw new Error('Unsupported state schema');
    for (const group of GROUPS) {
      if (!object(state.items[group]) || Object.keys(state.items[group]).length > 50000) throw new Error('Invalid state group');
      for (const [key, record] of Object.entries(state.items[group])) {
        if (!safeKey(key) || !object(record) || !Array.isArray(record.rev) || record.rev.length !== 3 || !Number.isSafeInteger(record.rev[0]) || record.rev[0] < 0 || !Number.isSafeInteger(record.rev[1]) || record.rev[1] < 0 || typeof record.rev[2] !== 'string' || record.rev[2].length > 100 || typeof record.deleted !== 'boolean') throw new Error('Invalid revision');
      }
    }
    validateSnapshot(materialize(state));
    return state;
  }
  function revisionCompare(a, b) { return a[0] - b[0] || a[1] - b[1] || a[2].localeCompare(b[2]); }
  function mergeState(a, b) {
    validateState(a); validateState(b);
    const merged = empty();
    for (const group of GROUPS) {
      for (const key of new Set([...Object.keys(a.items[group]), ...Object.keys(b.items[group])])) {
        const left = own(a.items[group], key) ? a.items[group][key] : undefined, right = own(b.items[group], key) ? b.items[group][key] : undefined;
        merged.items[group][key] = !left ? right : !right ? left : revisionCompare(left.rev, right.rev) >= 0 ? left : right;
      }
    }
    return merged;
  }
  function fromSnapshot(snapshot, rev = [0, 0, 'legacy']) {
    const state = empty(), values = snapshotItems(validateSnapshot(snapshot));
    for (const group of GROUPS) for (const [key, value] of Object.entries(values[group])) state.items[group][key] = { value, deleted: false, rev };
    return state;
  }
  function readState() { const state = parse(STATE_KEY, null); return state ? validateState(state) : fromSnapshot(readSnapshot()); }
  function nextRevision(state) {
    let device = localStorage.getItem('cardmax_device_id');
    if (!device) { device = root.crypto?.randomUUID?.() || Math.random().toString(36).slice(2); localStorage.setItem('cardmax_device_id', device); }
    let time = Date.now(), count = 0;
    for (const group of GROUPS) for (const record of Object.values(state.items[group])) if (record.rev[0] >= time) { count = record.rev[0] === time ? Math.max(count, record.rev[1] + 1) : record.rev[1] + 1; time = record.rev[0]; }
    return [time, count, device];
  }
  function captureChanges(expectedOwner = sessionOwner()) {
    assertOwner(expectedOwner);
    const state = readState(), values = snapshotItems(validateSnapshot(readSnapshot())), rev = nextRevision(state);
    for (const group of GROUPS) for (const key of new Set([...Object.keys(values[group]), ...Object.keys(state.items[group])])) {
      const old = own(state.items[group], key) ? state.items[group][key] : undefined, exists = own(values[group], key);
      if (exists && (!old || old.deleted || !equal(old.value, values[group][key]))) state.items[group][key] = { value: values[group][key], deleted: false, rev };
      else if (!exists && old && !old.deleted) state.items[group][key] = { deleted: true, rev };
    }
    assertOwner(expectedOwner);
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return state;
  }
  // Snapshot rollback is persisted BEFORE any active keys are changed.
  function atomicWrite(entries, expectedOwner) {
    assertOwner(expectedOwner);
    const before = Object.fromEntries(Object.keys(entries).map(key => [key, localStorage.getItem(key)]));
    localStorage.setItem('cardmax_last_rollback', JSON.stringify({ createdAt: new Date().toISOString(), entries: before }));
    try { for (const [key, value] of Object.entries(entries)) value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value); }
    catch (error) { for (const [key, value] of Object.entries(before)) { try { value === null ? localStorage.removeItem(key) : localStorage.setItem(key, value); } catch (_) { /* persisted rollback remains available */ } } throw error; }
  }
  function applyState(state, notify = true, options = {}) {
    assertOwner(options.expectedOwner);
    validateState(state);
    const snapshot = materialize(state), entries = { [STATE_KEY]: JSON.stringify(state), cardmax_sort_option: snapshot.settings.sortPreference || 'issuer', cardmax_point_valuations: JSON.stringify(snapshot.settings.pointValuations || {}) };
    for (const [group, key] of Object.entries(KEYS)) entries[key] = JSON.stringify(snapshot[group]);
    Object.assign(entries, options.extraEntries || {});
    atomicWrite(entries, options.expectedOwner);
    if (notify && root.dispatchEvent) root.dispatchEvent(new Event('cardmax-data-changed'));
    return state;
  }
  function restore(snapshot, expectedOwner = sessionOwner()) {
    assertOwner(expectedOwner);
    const validated = validateSnapshot(snapshot), old = captureChanges(expectedOwner), values = snapshotItems(validated), rev = nextRevision(old);
    for (const group of GROUPS) for (const key of new Set([...Object.keys(old.items[group]), ...Object.keys(values[group])])) old.items[group][key] = Object.hasOwn(values[group], key) ? { value: values[group][key], deleted: false, rev } : { deleted: true, rev };
    return applyState(old, true, { expectedOwner });
  }
  function cloudState(data) {
    if (data?.stateV3) return validateState(data.stateV3);
    return fromSnapshot({ cards: normalizeCards(data?.selectedCards || []), signupDates: data?.cardSignupDates || {}, renewalDates: data?.renewalDates || {}, annualFees: data?.annualFees || {}, benefits: data?.trackedBenefits || {}, settings: { sortPreference: data?.sortPreference || 'issuer', pointValuations: data?.pointValuations || {} } });
  }
  function substantiveData(state) {
    const snapshot = materialize(state);
    return snapshot.cards.length || Object.keys(snapshot.benefits).length || Object.keys(snapshot.signupDates).length || Object.keys(snapshot.renewalDates).length || Object.keys(snapshot.annualFees).length || Object.keys(snapshot.settings.pointValuations || {}).length;
  }
  function legacyRecovery() {
    const state = parse(LEGACY_KEY, null);
    if (!state) return null;
    validateState(state);
    return { state, imported: localStorage.getItem('cardmax_legacy_recovered') === 'true' };
  }
  function importLegacy(uid) {
    if (!uid || uid === 'anonymous') throw new Error('Sign in before importing saved browser data.');
    assertOwner(uid);
    const recovery = legacyRecovery();
    if (!recovery) return false;
    const local = captureChanges(uid);
    // Existing account entries win conflicts; recovery fills missing items only.
    const imported = empty();
    for (const group of GROUPS) for (const [key, record] of Object.entries(recovery.state.items[group])) {
      if (!own(local.items[group], key)) imported.items[group][key] = record;
    }
    applyState(mergeState(local, imported), true, { expectedOwner: uid, extraEntries: { cardmax_legacy_recovered: 'true' } });
    return true;
  }
  // Unowned pre-upgrade data is escrowed for explicit review/import. Signing in
  // alone never assigns data that may belong to a previous account on this device.
  function switchAccount(uid, importAnonymous = false) {
    const next = uid || 'anonymous', previousOwner = owner();
    const ownedBefore = localStorage.getItem(OWNER_KEY) !== null;
    if (next === previousOwner && ownedBefore) return captureChanges(previousOwner);
    const previous = captureChanges(previousOwner);
    const extraEntries = { ['cardmax_account_' + previousOwner]: JSON.stringify(previous) };
    const hasUnownedData = !ownedBefore && substantiveData(previous);
    if (hasUnownedData && !localStorage.getItem(LEGACY_KEY)) extraEntries[LEGACY_KEY] = JSON.stringify(previous);
    let state = next === previousOwner ? previous : parse('cardmax_account_' + next, null) || empty();
    const unownedLegacyExists = hasUnownedData || !!legacyRecovery();
    if (previousOwner === 'anonymous' && uid && importAnonymous && !unownedLegacyExists) state = mergeState(state, previous);
    // Owner and all active data participate in the same rollback-protected write.
    // The owner marker is written last, before the UI receives any notification.
    extraEntries[OWNER_KEY] = next;
    applyState(state, false, { expectedOwner: previousOwner, extraEntries });
    if (root.dispatchEvent) root.dispatchEvent(new Event('cardmax-data-changed'));
    return state;
  }
  root.CardMaxStorage = { VERSION, empty, readSnapshot, validateSnapshot, validateState, fromSnapshot, materialize, mergeState, readState, captureChanges, applyState, restore, cloudState, switchAccount, atomicWrite, owner, assertOwner, legacyRecovery, importLegacy };
  if (typeof module !== 'undefined') module.exports = root.CardMaxStorage;
})(typeof window !== 'undefined' ? window : globalThis);
