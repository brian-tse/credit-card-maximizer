const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');
function harness() {
  const values = new Map();
  const localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) };
  const listeners = {};
  const context = { localStorage, console, Event: class { constructor(type) { this.type = type; } }, CustomEvent: class { constructor(type, data) { this.type = type; this.detail = data?.detail; } }, setTimeout: () => 1, clearTimeout: () => {}, btoa: s => Buffer.from(s, 'binary').toString('base64'), atob: s => Buffer.from(s, 'base64').toString('binary'), document: { readyState: 'loading', addEventListener: (name, fn) => { listeners[name] = fn; }, getElementById: () => null } };
  context.window = context; context.addEventListener = () => {}; context.dispatchEvent = () => {};
  vm.createContext(context);
  const run = file => vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'js', file), 'utf8'), context);
  run('storage.js');
  return { context, values, localStorage, store: context.CardMaxStorage, run };
}
const plain = value => JSON.parse(JSON.stringify(value));

test('two devices merge independent edits and tombstones prevent stale resurrection', () => {
  const a = harness(), b = harness();
  a.localStorage.setItem('cardmax_user_cards', '["alpha","beta"]');
  const initial = a.store.captureChanges();
  b.store.applyState(initial);
  a.localStorage.setItem('cardmax_user_cards', '["alpha"]');
  const removed = a.store.captureChanges();
  b.localStorage.setItem('cardmax_tracked_benefits', '{"benefit-a":true}');
  const otherEdit = b.store.captureChanges();
  const merged = a.store.mergeState(removed, otherEdit);
  assert.deepEqual(plain(a.store.materialize(merged).cards), ['alpha']);
  assert.equal(a.store.materialize(merged).benefits['benefit-a'], true);
  assert.equal(merged.items.cards.beta.deleted, true);
  assert.deepEqual(plain(a.store.mergeState(merged, initial)), plain(merged));
});

test('account switches preserve local data without leaking it into another account', () => {
  const { store, localStorage } = harness();
  localStorage.setItem('cardmax_user_cards', '["guest"]');
  store.switchAccount('alice', true);
  localStorage.setItem('cardmax_user_cards', '["alice-private"]');
  store.captureChanges();
  store.switchAccount(null);
  assert.deepEqual(plain(store.readSnapshot().cards), ['guest']);
  store.switchAccount('bob', false);
  assert.deepEqual(plain(store.readSnapshot().cards), []);
  store.switchAccount('alice', false);
  assert.deepEqual(plain(store.readSnapshot().cards), ['alice-private']);
});

test('backup validates before writes, round-trips settings/history, saves rollback', () => {
  const h = harness(); h.run('save-code.js');
  h.localStorage.setItem('cardmax_user_cards', '["alpha"]');
  h.localStorage.setItem('cardmax_renewal_dates', '{"alpha":"2026-10-01"}');
  h.localStorage.setItem('cardmax_point_valuations', '{"chase":1.8}');
  const backup = h.context.CardMaxSave.generateBackupCode();
  h.localStorage.setItem('cardmax_user_cards', '["beta"]');
  const before = new Map(h.values);
  assert.throws(() => h.context.CardMaxSave.importUserData({ version: 2, cards: ['bad'], benefits: { fake: 'yes' } }), /benefit/);
  assert.deepEqual(h.values, before);
  assert.throws(() => h.context.CardMaxSave.importUserData({ version: 99, cards: [] }), /version/);
  h.context.CardMaxSave.restoreFromCode(backup);
  assert.deepEqual(plain(h.store.readSnapshot().cards), ['alpha']);
  assert.equal(h.store.readSnapshot().settings.pointValuations.chase, 1.8);
  assert.ok(h.localStorage.getItem('cardmax_last_rollback'));
});

test('failed multi-key restore rolls back active data', () => {
  const h = harness(); h.localStorage.setItem('cardmax_user_cards', '["alpha"]');
  h.store.captureChanges();
  const originalSet = h.localStorage.setItem;
  let fail = true;
  h.localStorage.setItem = (key, value) => { if (key === 'cardmax_signup_dates' && fail) { fail = false; throw new Error('Quota exceeded'); } originalSet(key, value); };
  assert.throws(() => h.store.restore({ cards: ['beta'] }), /Quota/);
  assert.deepEqual(plain(h.store.readSnapshot().cards), ['alpha']);
});

test('remembered authentication initializes sync and transactions preserve cloud + local edits', async () => {
  const h = harness();
  let callback, watch, remote = { selectedCards: ['cloud-card'], trackedBenefits: { older: true } }, writes = 0;
  const ref = { onSnapshot(fn) { watch = fn; return () => {}; } };
  h.context.auth = { onAuthStateChanged(fn) { callback = fn; }, signOut: async () => {}, signInWithPopup: async () => ({ user: { uid: 'alice' } }) };
  h.context.googleProvider = {};
  h.context.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'server-time' } } };
  h.context.db = { collection: () => ({ doc: () => ref }), runTransaction: async fn => fn({ get: async () => ({ exists: true, data: () => remote }), set: (_, data, options) => { assert.deepEqual(plain(options), { mergeFields: ['stateV3', 'schemaVersion', 'lastUpdated'] }); writes++; remote = { ...remote, ...data }; } }) };
  h.localStorage.setItem('cardmax_state_owner', 'alice');
  h.localStorage.setItem('cardmax_user_cards', '["local-card"]');
  h.localStorage.setItem('cardmax_signup_dates', '{"local-card":{"year":2020,"month":9}}');
  h.localStorage.setItem('cardmax_point_valuations', '{"chase":1.8}');
  h.run('auth.js'); h.context.CardMaxAuth.init(); h.context.CardMaxAuth.init();
  await callback({ uid: 'alice', displayName: 'Alice' });
  assert.equal(writes, 1);
  assert.deepEqual(new Set(h.store.readSnapshot().cards), new Set(['local-card', 'cloud-card']));
  h.localStorage.setItem('cardmax_tracked_benefits', '{"older":true,"new":true}');
  await h.context.CardMaxAuth.syncToCloud();
  assert.equal(h.store.materialize(remote.stateV3).benefits.new, true);
  h.localStorage.setItem('cardmax_signup_dates', '{"local-card":{"month":9}}');
  h.localStorage.setItem('cardmax_point_valuations', '{}');
  await h.context.CardMaxAuth.syncToCloud();
  assert.deepEqual(plain(h.store.materialize(remote.stateV3).signupDates['local-card']), { month: 9 });
  assert.deepEqual(plain(h.store.materialize(remote.stateV3).settings.pointValuations), {});
  const external = plain(remote.stateV3);
  external.items.benefits.another = { value: true, deleted: false, rev: [Date.now() + 10, 0, 'other-device'] };
  watch({ exists: true, data: () => ({ stateV3: external }), metadata: {} });
  assert.equal(h.store.readSnapshot().benefits.another, true);
});

test('prototype-named map entries are ordinary own items during merge and capture', () => {
  const h = harness();
  const left = h.store.fromSnapshot({ cards: [], benefits: { toString: true } });
  const merged = h.store.mergeState(left, h.store.empty());
  assert.equal(h.store.materialize(merged).benefits.toString, true);
  h.store.applyState(merged);
  h.localStorage.setItem('cardmax_tracked_benefits', '{"toString":false,"valueOf":true}');
  const captured = h.store.captureChanges();
  assert.equal(h.store.materialize(captured).benefits.toString, false);
  assert.equal(h.store.materialize(captured).benefits.valueOf, true);
});

test('owner-marker write failure rolls back both account snapshot and ownership', () => {
  const h = harness();
  h.localStorage.setItem('cardmax_state_owner', 'alice');
  h.localStorage.setItem('cardmax_user_cards', '["alice-private"]');
  h.store.captureChanges('alice');
  const originalSet = h.localStorage.setItem;
  let fail = true;
  h.localStorage.setItem = (key, value) => { if (key === 'cardmax_state_owner' && fail) { fail = false; throw new Error('Owner write failed'); } originalSet(key, value); };
  assert.throws(() => h.store.switchAccount('bob'), /Owner write failed/);
  assert.equal(h.store.owner(), 'alice');
  assert.deepEqual(plain(h.store.readSnapshot().cards), ['alice-private']);
  assert.deepEqual(plain(h.store.materialize(h.store.readState()).cards), ['alice-private']);
});

test('unowned upgrade data requires explicit recovery and never replaces account choices', () => {
  const h = harness();
  h.localStorage.setItem('cardmax_user_cards', '["old-browser-card"]');
  h.localStorage.setItem('cardmax_tracked_benefits', '{"saved-local-only":true,"conflict":true}');
  h.store.switchAccount('alice', true);
  assert.deepEqual(plain(h.store.readSnapshot().cards), []);
  assert.ok(h.store.legacyRecovery());
  h.localStorage.setItem('cardmax_tracked_benefits', '{"conflict":false}');
  h.store.importLegacy('alice');
  assert.deepEqual(plain(h.store.readSnapshot().cards), ['old-browser-card']);
  assert.equal(h.store.readSnapshot().benefits['saved-local-only'], true);
  assert.equal(h.store.readSnapshot().benefits.conflict, false);
  assert.equal(h.store.legacyRecovery().imported, true);
  h.store.switchAccount(null);
  h.store.switchAccount('bob', true);
  assert.deepEqual(plain(h.store.readSnapshot().cards), []);
});

test('stale-tab cloud listeners and sync do not read or alter the active other account', async () => {
  const h = harness();
  let callback, watcher, writes = 0;
  const remote = { selectedCards: ['alice-cloud'] };
  h.context.auth = { onAuthStateChanged(fn) { callback = fn; } };
  h.context.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'server-time' } } };
  h.context.db = { collection: () => ({ doc: () => ({ onSnapshot(fn) { watcher = fn; return () => {}; } }) }), runTransaction: async fn => fn({ get: async () => ({ exists: true, data: () => remote }), set: () => { writes++; } }) };
  h.localStorage.setItem('cardmax_state_owner', 'alice');
  h.run('auth.js'); h.context.CardMaxAuth.init();
  await callback({ uid: 'alice' });
  h.store.switchAccount('bob');
  h.localStorage.setItem('cardmax_user_cards', '["bob-private"]');
  h.store.captureChanges('bob');
  let captures = 0;
  const capture = h.store.captureChanges;
  h.store.captureChanges = (...args) => { captures++; return capture(...args); };
  const before = new Map(h.values);
  watcher({ exists: true, data: () => remote, metadata: {} });
  await h.context.CardMaxAuth.syncToCloud();
  h.context.CardMaxAuth.autoSync();
  assert.equal(captures, 0);
  assert.equal(writes, 1);
  assert.deepEqual(h.values, before);
});

test('auth does not claim the new user after account-switch storage failure', async () => {
  const h = harness();
  let callback;
  h.context.auth = { onAuthStateChanged(fn) { callback = fn; } };
  h.context.db = {};
  h.localStorage.setItem('cardmax_state_owner', 'alice');
  h.localStorage.setItem('cardmax_user_cards', '["alice-private"]');
  const originalSet = h.localStorage.setItem;
  h.localStorage.setItem = (key, value) => { if (key === 'cardmax_state_owner' && value === 'bob') throw new Error('Quota'); originalSet(key, value); };
  h.run('auth.js'); h.context.CardMaxAuth.init();
  await callback({ uid: 'bob' });
  assert.equal(h.context.CardMaxAuth.isSignedIn(), false);
  assert.equal(h.store.owner(), 'alice');
  assert.deepEqual(plain(h.store.readSnapshot().cards), ['alice-private']);
});

test('a transaction cannot write after an account changes while awaiting its read', async () => {
  const h = harness();
  let callback, deferRead = false, resolveRead, writes = 0;
  h.context.auth = { onAuthStateChanged(fn) { callback = fn; } };
  h.context.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'server-time' } } };
  const snapshot = { exists: true, data: () => ({ selectedCards: ['alice-card'] }) };
  h.context.db = { collection: () => ({ doc: () => ({ onSnapshot() { return () => {}; } }) }), runTransaction: async fn => fn({ get: async () => deferRead ? new Promise(resolve => { resolveRead = resolve; }) : snapshot, set: () => { writes++; } }) };
  h.localStorage.setItem('cardmax_state_owner', 'alice');
  h.run('auth.js'); h.context.CardMaxAuth.init(); await callback({ uid: 'alice' });
  deferRead = true;
  const pending = h.context.CardMaxAuth.syncToCloud();
  h.store.switchAccount('bob');
  const before = new Map(h.values);
  resolveRead(snapshot);
  assert.equal(await pending, false);
  assert.equal(writes, 1);
  assert.deepEqual(h.values, before);
});

test('unowned data recovery is visible and explicitly imports into the signed-in account', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="navbar-auth"></div><main class="container"></main>', { url: 'https://cardmax.test/', runScripts: 'outside-only' });
  const w = dom.window;
  let callback;
  w.localStorage.setItem('cardmax_user_cards', '["legacy-local-only"]');
  w.auth = { onAuthStateChanged(fn) { callback = fn; } };
  w.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'server-time' } } };
  w.db = { collection: () => ({ doc: () => ({ onSnapshot() { return () => {}; } }) }), runTransaction: async fn => fn({ get: async () => ({ exists: true, data: () => ({ selectedCards: ['cloud-card'] }) }), set() {} }) };
  w.eval(['storage.js', 'auth.js'].map(name => fs.readFileSync(path.join(__dirname, '..', 'js', name), 'utf8')).join('\n'));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  await callback({ uid: 'alice', displayName: 'Alice' });
  assert.deepEqual(Array.from(w.CardMaxStorage.readSnapshot().cards), ['cloud-card']);
  const panel = w.document.getElementById('cardmax-data-recovery');
  assert.match(panel.textContent, /saved without an account owner/);
  assert.match(panel.textContent, /Download saved browser data/);
  assert.match(panel.textContent, /Import saved data into this account/);
  w.CardMaxAuth.importLegacyBrowserData();
  assert.deepEqual(new Set(w.CardMaxStorage.readSnapshot().cards), new Set(['cloud-card', 'legacy-local-only']));
  assert.match(panel.textContent, /Saved data has been imported/);
  dom.window.close();
});

test('stale UI clicks, input changes and backup restore cannot overwrite another account', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="navbar-auth"></div><main class="container"><button id="save-stale">Save stale cards</button><input id="fee" value="99"></main>', { url: 'https://cardmax.test/', runScripts: 'outside-only' });
  const w = dom.window;
  let callback;
  w.localStorage.setItem('cardmax_state_owner', 'alice');
  w.auth = { onAuthStateChanged(fn) { callback = fn; } };
  w.firebase = { firestore: { FieldValue: { serverTimestamp: () => 'server-time' } } };
  w.db = { collection: () => ({ doc: () => ({ onSnapshot() { return () => {}; } }) }), runTransaction: async fn => fn({ get: async () => ({ exists: false }), set() {} }) };
  w.eval(['storage.js', 'auth.js', 'save-code.js'].map(name => fs.readFileSync(path.join(__dirname, '..', 'js', name), 'utf8')).join('\n'));
  await new Promise(resolve => w.document.addEventListener('DOMContentLoaded', resolve));
  await callback({ uid: 'alice' });
  w.document.getElementById('save-stale').addEventListener('click', () => w.localStorage.setItem('cardmax_user_cards', '["alice-stale"]'));
  w.document.getElementById('fee').addEventListener('input', () => w.localStorage.setItem('cardmax_annual_fees', '{"alice-stale":99}'));
  w.CardMaxStorage.switchAccount('bob');
  w.localStorage.setItem('cardmax_user_cards', '["bob-private"]');
  w.CardMaxStorage.captureChanges('bob');
  const before = w.localStorage.getItem('cardmax_state_v3');
  // The capture guard also works before the storage event has been delivered.
  w.document.getElementById('save-stale').click();
  w.document.getElementById('fee').dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(w.localStorage.getItem('cardmax_user_cards'), '["bob-private"]');
  assert.equal(w.localStorage.getItem('cardmax_annual_fees'), '{}');
  assert.equal(w.localStorage.getItem('cardmax_state_v3'), before);
  assert.match(w.document.getElementById('cardmax-account-changed').textContent, /Reload before editing/);
  assert.equal(w.document.querySelector('.container').inert, true);
  assert.throws(() => w.CardMaxSave.importUserData({ version: 2, cards: ['alice-restored'] }), /Account changed/);
  assert.equal(w.localStorage.getItem('cardmax_user_cards'), '["bob-private"]');
  dom.window.close();
});
