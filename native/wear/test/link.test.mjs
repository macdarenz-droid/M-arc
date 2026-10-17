// WATCH-C (Gate C), acceptance W1 to W4: the watch end of the workout link in native/wear/app, its
// outbox and its screen text (common/link.js), and the source rules for the GT 6 engine.
// Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const MAIN = path.join(ROOT, 'native/wear/app/entry/src/main');
const JS = path.join(MAIN, 'js/default');
const LINK = path.join(JS, 'common/link.js');
const load = () => import(pathToFileURL(LINK).href);
const { wire, sum } = await load();

const T0 = Date.UTC(2026, 9, 16, 10, 0, 0);
const TH = ['#08090a', '#f7f8f8', '#5e6ad2'];
const set1 = (o = {}) => ({ id: 'set_a1', rev: 0, w: 60, u: 'kg', r: 8, e: null, src: 't', ...o });
const snap = (o = {}) => JSON.stringify({
  t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', ex: 'Bench press', si: 1, sn: 3,
  set: set1(), rest: null, th: TH, ...o,
});
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });

/**
 * @system.storage as the watch has it: get and set with success and fail callbacks. WATCH-C D1: it
 * refuses a value of 128 bytes or more ("The length must be less than 128 bytes") and keys over 32
 * characters or outside letters, digits and underscore; the fake before D1 took any length.
 */
const KEY_OK = /^[A-Za-z0-9_]{1,32}$/;
/**
 * 1.1.2: the link starts every storage call and delivers every callback through io.defer (setTimeout 0 on
 * the watch). The rig's defer queues the task and runs the queue after each call into the link, and
 * after each step of a deferred store, so a store that answers at once is never entered from inside
 * one of its own callbacks: depth and maxDepth count that. An empty value is refused and recorded.
 */
const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
let calling = false; // a call into the link is running (the store must not be entered from it)
function fakeStore() {
  const s = {
    map: new Map(), calls: [], queue: [], defer: false, failSet: () => false, failGet: () => false, cut: 0,
    depth: 0, maxDepth: 0, empty: [], direct: 0, inside: 0,
    enter(fn) { if (calling) s.direct++; s.depth++; s.maxDepth = Math.max(s.maxDepth, s.depth); try { fn(); } finally { s.depth--; } },
    answering: false,
    answer(fn) { s.answering = true; try { fn(); } finally { s.answering = false; } },
    set(o) {
      s.calls.push(`set ${o.key}`);
      if (o.value === '') s.empty.push(o.key);
      s.enter(() => s.run(() => s.answer(() => {
        if (s.failSet(o.key) || !KEY_OK.test(o.key) || o.value === '' || Buffer.byteLength(String(o.value)) >= 128) return o.fail('write failed', 300);
        s.map.set(o.key, s.cut ? o.value.slice(0, s.cut) : o.value);
        o.success();
      })));
    },
    get(o) {
      s.calls.push(`get ${o.key}`);
      s.enter(() => s.run(() => s.answer(() => (s.failGet(o.key) || !KEY_OK.test(o.key) ? o.fail('read failed', 300) : o.success(s.map.has(o.key) ? s.map.get(o.key) : o.default)))));
    },
    run(fn) { if (s.defer) s.queue.push(fn); else fn(); },
    step() { s.enter(s.queue.shift()); drain(); },
  };
  return s;
}

/** The wire text slot i holds: its fields and sum (1.1.2), rebuilt as the watch does. */
function slotText(store, i) {
  const v = store.map.get(`m2q${i}`);
  if (v === undefined) return undefined;
  const j = v.lastIndexOf(',');
  return String(sum(v.slice(0, j)) % 99991) === v.slice(j + 1) ? wire(v.slice(0, j).split(',')) : null;
}
const CODE = { complete_set: 'c', rest_add_30: 'a', rest_skip: 's' };
/** Writes a wire command (or, when it is not one, the raw text) into slot i the way the watch does. */
async function putSlot(store, i, text) {
  let m = null;
  try { m = JSON.parse(text); } catch { /* raw */ }
  const f = m && m.k === 'cmd' ? [CODE[m.kind], m.commandId, m.sessionId, m.actionAt, m.setId ?? m.restId,
    ...(m.kind === 'complete_set' ? [m.expectedRev, m.load ? m.load.value : '', m.load ? m.load.unit : '', m.reps, m.effort ?? ''] : [])] : null;
  store.map.set(`m2q${i}`, f ? `${f.join(',')},${sum(f.join(',')) % 99991}` : text);
}

/** A link with a fake clock, storage, radio and screen. code: the send result, or null for none yet. */
async function rig(o = {}) {
  const { Link } = await load();
  let t = o.t ?? T0;
  const sent = [];
  const keeps = [];
  const store = o.store ?? fakeStore();
  const r = { sent, keeps, store, code: o.code === undefined ? 207 : o.code, paints: 0 };
  const io = {
    store,
    now: () => { if (store.depth > 0) store.inside++; return t + (r.wall ?? 0); },
    send: (text, done) => { if (r.throwSend) { r.throwSend = false; throw new Error('send'); } sent.push(text); if (r.code !== null) done(r.code); },
    keep: (on) => keeps.push(on),
    paint: () => { r.paints++; if (r.onPaint) r.onPaint(); },
    connect: () => { r.connects = (r.connects ?? 0) + 1; },
    // dropAnswer: lose the deferred delivery of the next storage answer (ACE lite drops a timer it cannot dispatch)
    // dropNext: lose the next deferred task, whatever it is
    defer: (fn) => { if (r.dropNext || (r.dropAnswer && store.answering)) { r.dropNext = r.dropAnswer = false; return; } tasks.push(fn); },
  };
  // A start long after the last one, unless the test is about the restart guard.
  if (!o.keepRun) store.map.delete('m2r');
  const link = Link(io, o.boot ?? 'abcd1234');
  // 1.1.2: the link's clock is the page's 1 s interval. The rig runs one tick per second the test moves
  // the clock on, before each call into the link; a call to tick() only runs those.
  const t00 = t;
  let ticked = 0;
  const into = (fn) => { calling = true; let out; try { out = fn(); } finally { calling = false; } drain(); return out; };
  r.link = {};
  for (const k of Object.keys(link)) {
    r.link[k] = (...a) => {
      while (ticked < Math.floor((t - t00) / 1000)) { ticked++; into(() => link.tick()); }
      return k === 'tick' ? undefined : into(() => link[k](...a));
    };
  }
  r.adv = (ms) => { t += ms; };
  r.now = () => t;
  r.cmds = () => sent.filter((x) => JSON.parse(x).k === 'cmd');
  r.hellos = () => sent.filter((x) => JSON.parse(x).k === 'hello');
  if (o.start !== false) r.link.start();
  return r;
}

const COMMAND_ID = /^[A-Za-z0-9_-]{8,64}$/; // src/slices/workout/commands.ts COMMAND_ID

test('W1 a complete_set command: fixed keys and bytes, at most 400 B, with the load and effort shown', async () => {
  const r = await rig();
  r.link.rx(snap());
  r.link.complete();
  assert.equal(r.cmds().length, 1);
  const c = JSON.parse(r.cmds()[0]);
  assert.deepEqual(Object.keys(c), ['t', 'v', 'k', 'commandId', 'sessionId', 'actionAt', 'kind', 'setId', 'expectedRev', 'load', 'reps']);
  assert.deepEqual(c, { t: 'mw', v: 1, k: 'cmd', commandId: 'abcd1234-1', sessionId: 's_1', actionAt: T0, kind: 'complete_set', setId: 'set_a1', expectedRev: 0, load: { value: 60, unit: 'kg' }, reps: 8 });
  // The effort the watch shows is sent; none shown, none sent.
  const e = await rig();
  e.link.rx(snap({ set: set1({ id: 'set_b', rev: 2, w: 135, u: 'lb', r: 5, e: 'ideal' }) }));
  assert.equal(e.link.view().eff, 'Ideal');
  e.link.effort();
  assert.equal(e.link.view().eff, 'Max');
  e.link.complete();
  const ce = JSON.parse(e.cmds()[0]);
  assert.deepEqual(Object.keys(ce).slice(7), ['setId', 'expectedRev', 'load', 'reps', 'effort']);
  assert.deepEqual([ce.load, ce.reps, ce.effort, ce.expectedRev], [{ value: 135, unit: 'lb' }, 5, 'max', 2]);
  const n = await rig();
  n.link.rx(snap({ set: set1({ w: null, e: 'easy' }) }));
  n.link.effort(); n.link.effort(); n.link.effort(); // easy, ideal, max, none
  assert.equal(n.link.view().eff, 'Effort');
  n.link.complete();
  assert.deepEqual(Object.keys(JSON.parse(n.cmds()[0])).slice(7), ['setId', 'expectedRev', 'reps'], 'no load and no effort shown, none sent');
  // The longest ids the phone allows still make a wire command of at most 400 B (1.1.2: too long to store,
  // so the watch shows Not saved and sends nothing; the phone's own ids fit, tests/watch-contract.test.ts).
  const id64 = 'x'.repeat(64);
  const text = wire(['c', 'zzzzzzzz-99999', id64, 8.64e15, id64, Number.MAX_SAFE_INTEGER, 999.75, 'kg', 100, 'ideal']);
  assert.ok(Buffer.byteLength(text) <= 400, `${Buffer.byteLength(text)} B`);
  assert.match(text, /^[\x20-\x7e]+$/);
  const big = await rig({ boot: 'zzzzzzzz' });
  big.link.rx(snap({ sid: id64, set: set1({ id: id64, rev: Number.MAX_SAFE_INTEGER, w: 999.75, u: 'kg', r: 100, e: 'ideal' }) }));
  big.link.complete();
  assert.equal(big.link.view().st, 'Not saved');
  assert.equal(big.cmds().length, 0);
});

test('W1 ids are valid for the phone and unique across boots; actionAt is fixed at the tap', async () => {
  const { makeBoot } = await load();
  const boots = new Set();
  for (let i = 0; i < 2000; i++) {
    const b = makeBoot();
    assert.match(b, /^[0-9a-z]{8}$/);
    boots.add(b);
  }
  assert.equal(boots.size, 2000);
  assert.equal(makeBoot(() => 0), '00000000');
  assert.equal(makeBoot(() => 0.9999999), 'zzzzzzzz');
  assert.equal(makeBoot(() => NaN), '00000000');
  const ids = new Set();
  for (const boot of ['abcd1234', 'abcd1235']) {
    const r = await rig({ boot });
    r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
    for (let i = 0; i < 3; i++) r.link.rest('rest_add_30');
    for (const i of r.store.map.get('m2q')) ids.add(JSON.parse(slotText(r.store, i)).commandId);
  }
  assert.deepEqual([...ids].sort(), ['abcd1234-1', 'abcd1234-2', 'abcd1234-3', 'abcd1235-1', 'abcd1235-2', 'abcd1235-3']);
  for (const id of ids) assert.match(id, COMMAND_ID);
  // The offset is fixed into actionAt at the tap; every resend is the same bytes.
  const r = await rig({ code: null });
  r.adv(1000);
  r.link.rx(snap({ pt: T0 + 1000 + 5000, wt: T0 }));
  r.adv(2000);
  r.link.complete();
  const first = r.cmds()[0];
  assert.equal(JSON.parse(first).actionAt, T0 + 3000 + 5500, 'watch time + offset (pt - (wt + arrival) / 2)');
  for (let i = 0; i < 12; i++) { r.adv(31000); r.link.tick(); }
  r.link.rx(snap({ pt: T0 + 999999, wt: null }));
  assert.ok(r.cmds().length > 5);
  for (const c of r.cmds()) assert.equal(c, first);
});

test('W2 Pending shows only after the slot and the index are written', async () => {
  const store = fakeStore();
  const r = await rig({ store });
  r.link.rx(snap());
  store.defer = true;
  store.calls.length = 0;
  r.link.complete();
  const steps = [];
  while (store.queue.length) {
    steps.push([store.calls[store.calls.length - 1], r.link.view().st, r.cmds().length]);
    store.step();
  }
  // 1.1.2: the slot, its read-back, the index; nothing shows or goes before the last
  assert.deepEqual(steps, ['set m2q0', 'get m2q0', 'set m2q'].map((c) => [c, '', 0]));
  assert.equal(r.link.view().st, `Pending ${new Date(T0).toTimeString().slice(0, 8)}`);
  assert.equal(r.cmds().length, 1);
  assert.equal(store.map.get('m2q'), '0');
  assert.equal(slotText(store, 0), r.cmds()[0]);
});

test('W2 a failed write shows Not saved and sends nothing', async () => {
  for (const [name, setup] of [
    ['slot write', (s) => { s.failSet = (k) => k === 'm2q0'; }],
    ['index write', (s) => { s.failSet = (k) => k === 'm2q'; }],
    ['read-back', (s) => { s.failGet = (k) => k === 'm2q0'; }],
    ['value cut short', (s) => { s.cut = 40; }],
  ]) {
    const store = fakeStore();
    const r = await rig({ store });
    r.link.rx(snap());
    setup(store);
    r.link.complete();
    assert.equal(r.link.view().st, 'Not saved', name);
    assert.equal(r.cmds().length, 0, name);
    for (let i = 0; i < 5; i++) { r.adv(31000); r.link.tick(); }
    r.link.rx(snap());
    assert.equal(r.cmds().length, 0, `${name}: nothing later either`);
    assert.equal(store.map.get('m2q') ?? '', '', `${name}: the index lists nothing`);
  }
  // An index that cannot be read at start: nothing is added over what it may list.
  const store = fakeStore();
  store.failGet = (k) => k === 'm2q';
  const r = await rig({ store });
  r.link.rx(snap());
  r.link.complete();
  assert.equal(r.link.view().st, 'Not saved');
  assert.equal(r.cmds().length, 0);
  assert.equal(store.calls.filter((c) => c.startsWith('set') && c !== 'set m2r').length, 0);
});

test('W2 a full outbox shows Queue full and drops nothing; a restart restores identical bytes', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  for (let i = 0; i < 8; i++) r.link.rest('rest_add_30');
  assert.equal(store.map.get('m2q'), '01234567');
  const before = new Map(store.map);
  r.link.rest('rest_skip');
  assert.equal(r.link.view().st, 'Queue full');
  assert.deepEqual(new Map(store.map), before, 'nothing written, nothing dropped');
  const texts = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => slotText(store, i));
  // Restart: the slots the index lists come back with the same bytes, oldest first.
  const again = await rig({ store, boot: 'qqqqqqqq', code: null });
  assert.equal(again.link.view().st, '8 pending');
  assert.equal(again.cmds().length, 1);
  assert.equal(again.cmds()[0], texts[0]);
  for (let i = 0; i < 8; i++) {
    again.link.rx(res(JSON.parse(texts[i]).commandId));
    assert.equal(again.cmds()[again.cmds().length - 1], i < 7 ? texts[i + 1] : texts[7]);
  }
  assert.equal(store.map.get('m2q'), '-', 'the empty index (1.1.2)');
  // A removed slot is reused; the index keeps the oldest first.
  const s2 = fakeStore();
  const x = await rig({ store: s2, code: null });
  x.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  for (let i = 0; i < 3; i++) x.link.rest('rest_add_30');
  x.link.rx(res('abcd1234-1'));
  x.link.rest('rest_skip');
  assert.equal(s2.map.get('m2q'), '120');
  const y = await rig({ store: s2, code: null });
  assert.equal(y.link.view().st, '3 pending');
  assert.equal(y.cmds()[0], slotText(s2, 1));
  // Slots the index does not list, or that no longer hold a command, are not loaded.
  const s3 = fakeStore();
  s3.map.set('m2q', '3x3a5');
  await putSlot(s3, 3, texts[2]);
  await putSlot(s3, 5, '{"t":"mw"');
  await putSlot(s3, 6, texts[3]);
  const z = await rig({ store: s3, code: null });
  assert.equal(z.link.view().st, '1 pending');
  assert.equal(s3.map.get('m2q'), '3');
});

test('W3 one command in flight, oldest first; resends at 4, 8 and 16 s, then every 30 s, and on each snap', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  r.link.complete();
  r.link.rest('rest_skip');
  assert.equal(r.cmds().length, 1, 'only the oldest is sent');
  const at = [];
  for (let s = 1; s <= 120; s++) {
    r.adv(1000);
    const n = r.cmds().length;
    r.link.tick();
    if (r.cmds().length > n) at.push(s);
  }
  assert.deepEqual(at, [4, 12, 28, 58, 88, 118]);
  assert.ok(r.cmds().every((c) => JSON.parse(c).kind === 'complete_set'));
  r.adv(500);
  r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  assert.equal(r.cmds().length, 8, 'a snap sends it again at once');
  r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  assert.equal(r.cmds().length, 8, 'not twice within a second');
  r.adv(3000); r.link.tick(); // the clock is the 1 s tick (1.1.2)
  assert.equal(r.cmds().length, 8);
  r.adv(1000); r.link.tick();
  assert.equal(r.cmds().length, 9, 'after a snap the gaps start again at 4 s');
  // The result sends the next one at once.
  r.link.rx(res('abcd1234-1'));
  assert.equal(JSON.parse(r.cmds()[r.cmds().length - 1]).kind, 'rest_skip');
});

test('W3 results: applied and replayed show Saved, rejected shows its reason, not_saved is retried, a snap never shows Saved', async () => {
  const cases = [
    [{}, 'Saved', 0],
    [{ replayed: true }, 'Saved', 0],
    [{ status: 'rejected', reason: 'stale_revision', replayed: true }, 'Changed on phone', 0],
    [{ status: 'rejected', reason: 'already_committed', replayed: false }, 'Changed on phone', 0],
    [{ status: 'rejected', reason: 'target_missing', replayed: false }, 'Changed on phone', 0],
    [{ status: 'rejected', reason: 'session_closed', replayed: false }, 'Workout ended', 0],
    [{ status: 'rejected', reason: 'no_session', replayed: false }, 'Workout ended', 0],
    [{ status: 'rejected', reason: 'toString', replayed: false }, 'Not saved', 0],
    [{ status: 'not_saved', reason: 'storage_failed' }, null, 1],
    [{ status: 'odd' }, null, 1],
  ];
  for (const [extra, word, left] of cases) {
    const r = await rig({ code: null });
    r.link.rx(snap());
    r.link.complete();
    const pending = r.link.view().st;
    assert.match(pending, /^Pending \d\d:\d\d:\d\d$/);
    r.link.rx(res('abcd1234-999'));
    r.link.rx(res('abcd1234-1', extra));
    assert.equal(r.link.view().st, word ?? pending, JSON.stringify(extra));
    assert.equal(r.store.map.get('m2q'), left ? '0' : '-', JSON.stringify(extra));
    if (left) {
      r.adv(4000); r.link.tick();
      assert.equal(r.cmds().length, 2, 'retried');
    }
  }
  // A snap that already shows the set committed is not a receipt.
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.link.rx(snap({ si: 2, set: set1({ id: 'set_a2' }) }));
  assert.match(r.link.view().st, /^Pending /);
  assert.equal(r.store.map.get('m2q'), '0');
});

test('W3 the clock offset comes from the hello and snap pair with the lowest round trip', async () => {
  const r = await rig({ code: null });
  const hello0 = JSON.parse(r.hellos()[0]);
  assert.equal(hello0.wt, T0);
  r.adv(800);
  r.link.rx(snap({ wt: T0, pt: T0 + 10400 })); // round trip 800 ms: offset 10000
  r.adv(20000); r.link.tick(); // 20 s of silence: hello
  const wt2 = JSON.parse(r.hellos()[1]).wt;
  r.adv(200);
  r.link.rx(snap({ wt: wt2, pt: wt2 + 100 + 7000 })); // 200 ms: offset 7000, the better pair
  r.adv(20000); r.link.tick();
  const wt3 = JSON.parse(r.hellos()[2]).wt;
  r.adv(3000);
  r.link.rx(snap({ wt: wt3, pt: wt3 + 1500 + 9000 })); // 3 s, and 2 s off: within its round trip, ignored
  r.link.rx(snap({ wt: T0 + 1, pt: T0 })); // not a hello this watch sent
  r.link.complete();
  assert.equal(JSON.parse(r.cmds()[0]).actionAt, r.now() + 7000);
});

test('W3 hello: at start, on show, after 20 s of silence and after failed sends (5 to 30 s); at most 120 B', async () => {
  const r = await rig({ code: 207 });
  assert.equal(r.hellos().length, 1);
  const h = JSON.parse(r.hellos()[0]);
  assert.deepEqual(Object.keys(h), ['t', 'v', 'k', 'app', 'boot', 'wt', 'q']);
  assert.deepEqual(h, { t: 'mw', v: 1, k: 'hello', app: '1.2.0', boot: 'abcd1234', wt: T0, q: 0 }); // WATCH-C2: the version pin
  r.link.show();
  assert.equal(r.hellos().length, 2);
  r.adv(19000); r.link.tick(); // the clock is the 1 s tick (1.1.2)
  assert.equal(r.hellos().length, 2);
  r.link.rx(snap());
  r.adv(19000); r.link.tick();
  assert.equal(r.hellos().length, 2, 'a phone message restarts the 20 s');
  r.adv(1000); r.link.tick();
  assert.equal(r.hellos().length, 3);
  r.code = 206;
  const gaps = [];
  let last = r.now();
  r.link.show();
  for (let s = 0; s < 150; s++) {
    r.adv(1000);
    const n = r.hellos().length;
    r.link.tick();
    if (r.hellos().length > n) { gaps.push((r.now() - last) / 1000); last = r.now(); }
  }
  assert.deepEqual(gaps.slice(0, 6), [5, 10, 20, 30, 30, 30]);
  const full = await rig({ boot: 'zzzzzzzz', code: null });
  full.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  for (let i = 0; i < 8; i++) full.link.rest('rest_add_30');
  full.link.show();
  const big = full.hellos()[full.hellos().length - 1];
  assert.equal(JSON.parse(big).q, 8);
  assert.ok(Buffer.byteLength(big) <= 120);
});

test('W3 another version shows Update needed and stops sending; unknown kinds and fields are ignored', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ extra: 1, set: set1({ more: true }) }));
  r.link.rx(JSON.stringify({ t: 'mw', v: 1, k: 'later', x: 1 }));
  r.link.rx('{"t":"mw"');
  r.link.rx('null');
  assert.equal(r.link.view().l1, 'Bench press 1/3');
  r.link.complete();
  const n = r.sent.length;
  r.link.rx(JSON.stringify({ t: 'mw', v: 2, k: 'snap' }));
  assert.equal(r.link.view().l1, 'Update needed');
  r.link.complete();
  r.link.show();
  for (let i = 0; i < 5; i++) { r.adv(31000); r.link.tick(); }
  r.link.rx(snap());
  assert.equal(r.sent.length, n, 'nothing more is sent');
  assert.equal(r.link.view().l1, 'Update needed');
});

test('W3 the rest counts down on the watch while no snap arrives; a paused rest holds', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { id: 'rest_1', left: 90000, tot: 90000, p: false } }));
  assert.equal(r.link.view().rest, 'Rest 1:30');
  assert.equal(r.link.view().add, true);
  r.adv(61500);
  assert.equal(r.link.view().rest, 'Rest 0:29');
  assert.equal(r.link.view().p1, 'Phone not connected');
  r.adv(40000);
  assert.equal(r.link.view().rest, 'Rest 0:00');
  assert.equal(r.link.view().add, false, 'no +30 s on an ended rest');
  assert.equal(r.link.view().rs, true, 'Skip stays');
  r.link.rx(snap({ rest: { id: 'rest_1', left: 42000, tot: 90000, p: true } }));
  r.adv(30000);
  assert.equal(r.link.view().rest, 'Rest 0:42');
  r.link.rx(snap({ rest: null }));
  assert.equal(r.link.view().rs, false);
});

test('W3 Complete is locked while that set is pending, and after Saved until a snap moves on', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  assert.equal(r.link.view().can, true);
  r.link.complete();
  assert.equal(r.link.view().can, false);
  r.link.complete();
  r.link.rx(snap());
  r.link.complete();
  assert.equal(r.store.map.get('m2q'), '0', 'one entry');
  r.link.rx(res('abcd1234-1'));
  assert.equal(r.link.view().st, 'Saved');
  r.link.rx(snap());
  assert.equal(r.link.view().can, false, 'the same set, saved');
  r.link.complete();
  r.link.rx(snap({ si: 2, set: set1({ id: 'set_a2' }) }));
  assert.equal(r.link.view().can, true);
  r.link.complete();
  assert.equal(JSON.parse(r.cmds()[r.cmds().length - 1]).setId, 'set_a2');
  assert.equal(new Set(r.cmds().map((c) => JSON.parse(c).commandId)).size, 2);
  // While the write is still going on, a second tap adds nothing.
  const store = fakeStore();
  const w = await rig({ store, code: null });
  w.link.rx(snap());
  store.defer = true;
  w.link.complete();
  w.link.complete();
  while (store.queue.length) store.step();
  assert.equal(store.map.get('m2q'), '0');
  // No reps to send: locked.
  const z = await rig();
  z.link.rx(snap({ set: set1({ r: null }) }));
  assert.equal(z.link.view().can, false);
  assert.equal(z.link.view().l2, '60 kg x -');
});

test('W3 keep-on is held while a session or a pending entry exists, and asked again on show', async () => {
  const r = await rig({ code: null });
  assert.deepEqual(r.keeps, []);
  r.link.rx(snap({ sid: null, ex: null, set: null }));
  assert.deepEqual(r.keeps, []);
  r.link.rx(snap());
  assert.deepEqual(r.keeps, [true]);
  r.link.complete();
  r.link.rx(snap({ sid: null, ex: null, set: null, rest: null }));
  r.link.tick();
  assert.deepEqual(r.keeps, [true], 'the pending entry keeps it');
  r.link.show();
  assert.deepEqual(r.keeps, [true, true]);
  r.link.rx(res('abcd1234-1'));
  assert.deepEqual(r.keeps, [true, true, false]);
  r.link.show();
  assert.deepEqual(r.keeps, [true, true, false]);
});

test('W3 screen wording: no workout, no phone, and the set', async () => {
  const r = await rig({ code: null });
  assert.deepEqual([r.link.view().p1, r.link.view().p2], ['', ''], 'no warning in the first 5 s');
  r.adv(6000); // the 6th tick (1.1.2)
  assert.deepEqual([r.link.view().p1, r.link.view().p2], ['Phone not connected', 'Open M/ARC on your phone']);
  r.link.rx(snap({ sid: null, ex: null, si: 0, sn: 0, set: null }));
  let v = r.link.view();
  assert.deepEqual([v.l1, v.l2, v.p1, v.set], ['Start your workout', 'in M/ARC on your phone', '', false]);
  r.adv(26000);
  assert.equal(r.link.view().p1, 'Phone not connected');
  r.link.rx(snap());
  v = r.link.view();
  assert.deepEqual([v.l1, v.l2, v.eff, v.set, v.can, v.p1, v.rs], ['Bench press 1/3', '60 kg x 8', 'Effort', true, true, '', false]);
  r.link.rx(snap({ set: set1({ w: null, r: 12 }) }));
  assert.equal(r.link.view().l2, '12 reps');
  r.link.rx(snap({ ex: 'Plank', set: null }));
  assert.deepEqual([r.link.view().l1, r.link.view().l2, r.link.view().set], ['Plank 1/3', 'Log on phone', false]);
  r.link.rx(snap({ ex: null, si: 0, sn: 0, set: null }));
  assert.equal(r.link.view().l1, 'All sets done');
  // A failed send shows the phone lines at once; a phone message clears them.
  r.code = 206;
  r.link.show();
  assert.equal(r.link.view().p1, 'Phone not connected');
  r.link.rx(snap());
  assert.equal(r.link.view().p1, '');
  // The phone's theme, when it is three #rrggbb colours.
  r.link.rx(snap({ th: ['#ffffff', '#37352f', '#2383e2'] }));
  assert.deepEqual([r.link.view().bg, r.link.view().fg, r.link.view().ac], ['#ffffff', '#37352f', '#2383e2']);
  r.link.rx(snap({ th: ['#ffffff', '#000000'] }));
  assert.deepEqual([r.link.view().bg, r.link.view().fg, r.link.view().ac], TH);
  r.link.rx(snap({ th: ['#ffffff', '#000000', 5] }));
  assert.deepEqual([r.link.view().bg, r.link.view().fg, r.link.view().ac], TH);
});

// W4: the GT 6 runs ES5 only, its String replace throws, and the old toolchain is unreliable with
// non-ASCII source (native/wear/test/a2.test.mjs). Huawei's wearengine.js is checked by its hash.
const JS_RULES = [
  ['RegExp', /\bRegExp\b/],
  ['regular expression literal', /(^|[=(,:[!&|?{};])\s*\/(?![/*])/m],
  ['.replace(', /\.replace\(/],
  ['let', /\blet\b/],
  ['const', /\bconst\b/],
  ['=>', /=>/],
  ['class', /\bclass\b/],
  ['template string', /`/],
  ['typeof x === "object" (babel adds its _typeof helper)', /typeof [\w.]+ === 'object'/],
];
const walk = (dir) => readdirSync(dir).flatMap((n) => (statSync(path.join(dir, n)).isDirectory() ? walk(path.join(dir, n)).map((f) => `${n}/${f}`) : [n]));

test('W4 ES5, ASCII, wearengine.js unchanged, PHONE_FP, no permissions, page sources at most 40,000 B', async () => {
  const files = walk(JS).sort();
  assert.deepEqual(files, ['app.js', 'common/link.js', 'pages/index/index.css', 'pages/index/index.hml', 'pages/index/index.js', 'pages/wearengine.js']);
  let total = 0;
  for (const rel of files) {
    const buf = readFileSync(path.join(JS, rel));
    total += buf.length;
    if (rel === 'pages/wearengine.js') continue;
    const at = buf.findIndex((b) => b > 0x7f);
    assert.equal(at, -1, `${rel}: non-ASCII byte at offset ${at}`);
    if (!rel.endsWith('.js')) continue;
    const src = buf.toString('utf8');
    for (const [name, rule] of JS_RULES) assert.doesNotMatch(src, rule, `${rel} uses ${name}`);
  }
  // 34,000 since the 1.1.2 red team (docs/watch-cards/WATCH-C.md W4); 40,000 since WATCH-C2's screens (its W4)
  assert.ok(total <= 40000, `page sources ${total} B`);
  assert.equal(createHash('sha256').update(readFileSync(path.join(JS, 'pages/wearengine.js'))).digest('hex'),
    '8c7f1100c840abdb237991b0d436ef9ab49a215269c5fecdb3dd59fe63a71471');
  assert.doesNotMatch(readFileSync(LINK, 'utf8'), /\bimport\b|\brequire\b/, 'link.js makes no Huawei or module calls');
  const page = readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8');
  assert.match(page, /^import \{ P2pClient, Message, Builder \} from '\.\.\/wearengine\.js';$/m);
  assert.deepEqual([...page.matchAll(/^import (\w+) from '@system\.(\w+)';$/gm)].map((m) => m[2]), ['storage', 'brightness']);
  const { PHONE_FP, PHONE_PKG } = await load();
  const yml = readFileSync(path.join(ROOT, '.github/workflows/build-apk.yml'), 'utf8');
  const pins = [...yml.matchAll(/EXPECTED_SHA256: '([0-9A-F:]+)'/g)].map((m) => m[1]);
  assert.equal(pins.length, 1);
  assert.equal(PHONE_FP, pins[0].split(':').join(''));
  assert.equal(PHONE_PKG, JSON.parse(readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8')).appId);
  const cfg = JSON.parse(readFileSync(path.join(MAIN, 'config.json'), 'utf8'));
  const hello = JSON.parse(readFileSync(path.join(ROOT, 'native/wear/hello/entry/src/main/config.json'), 'utf8'));
  assert.deepEqual(cfg.app.version, { code: 1002000, name: '1.2.0' });
  assert.equal(cfg.app.bundleName, hello.app.bundleName);
  assert.equal(cfg.module.reqPermissions, undefined, 'no permissions');
  assert.deepEqual(cfg.module.abilities, hello.module.abilities);
  assert.deepEqual(cfg.module.js, hello.module.js);
  assert.equal(cfg.app.apiVersion.compatible, 6);
});

test('W4 page markup matches the page data and handlers', () => {
  const hml = readFileSync(path.join(JS, 'pages/index/index.hml'), 'utf8');
  const page = readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8');
  const bound = [...new Set([...hml.matchAll(/\{\{ ?(\w+) ?\}\}/g)].map((m) => m[1]))];
  const data = page.slice(page.indexOf('data: {'), page.indexOf('},', page.indexOf('data: {')));
  for (const key of bound) assert.match(data, new RegExp(`\\b${key}: `), `data.${key}`);
  for (const h of [...hml.matchAll(/onclick="(\w+)"/g)].map((m) => m[1])) assert.match(page, new RegExp(`^  ${h}\\(\\) \\{`, 'm'), `${h} is defined`);
  // WATCH-C2: each tap target's handler and the label it shows (was: the button labels)
  assert.deepEqual([...hml.matchAll(/onclick="(\w+)">(?:<text[^>]*>)?([^<]*)/g)].map((m) => `${m[1]} ${m[2]}`), [
    'onNext {{nm}}', 'onEasy Easy', 'onIdeal Ideal', 'onMax Max', 'onComplete {{cl}}', 'onNext {{nx}}', 'onNext {{ns}}', 'onAdd +30 s', 'onSkip Skip',
    'onR0 {{r0}}', 'onR1 {{r1}}', 'onR2 {{r2}}', 'onR3 {{r3}}']);
  assert.equal([...hml.matchAll(/onswipe="(\w+)"/g)].map((m) => m[1]).join(), 'onSwipe');
  assert.match(page, /^  onSwipe: function \(e\) \{ tap\('next', e && e\.direction\); \},$/m);
  assert.match(page, /^function tap\(f, a\) \{ try \{ link\[f\]\(a\); \} catch \(e\) \{\} \}$/m, 'the new handlers catch what they throw');
  assert.match(page, /setInterval\(/);
  assert.match(page, /clearInterval\(/);
  assert.match(page, /onDestroy\(\) \{[\s\S]*keep\(false\)/, 'onDestroy lets the screen go dark again');
});

// WATCH-C review fixes (2026-10-16).
const rest1 = { id: 'rest_1', left: 60000, tot: 90000, p: false };

test('W2 a listed slot that cannot be read at start stays listed; nothing rewrites the index or adds to it until the next start', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  for (let i = 0; i < 3; i++) r.link.rest('rest_add_30');
  const texts = [0, 1, 2].map((i) => slotText(store, i));
  let once = true;
  store.failGet = (k) => { if (k === 'm2q1' && once) { once = false; return true; } return false; };
  const b = await rig({ store, boot: 'bbbbbbbb', code: null });
  assert.equal(store.map.get('m2q'), '012', 'the unread slot stays listed');
  assert.equal(b.link.view().st, '2 pending');
  assert.equal(b.cmds()[0], texts[0]);
  b.link.rx(res(JSON.parse(texts[0]).commandId));
  assert.equal(b.cmds()[b.cmds().length - 1], texts[2]);
  b.link.rx(snap({ rest: rest1 }));
  b.link.rest('rest_skip');
  assert.equal(b.link.view().st, 'Not saved');
  assert.equal(store.map.get('m2q'), '012', 'the index is left as it was read');
  const c = await rig({ store, boot: 'cccccccc', code: null });
  assert.equal(c.link.view().st, '3 pending');
  assert.equal(c.cmds()[0], texts[0]);
  assert.equal(slotText(store, 1), texts[1]);
});

test('W3 Saved shows only once the outbox is empty; until then it counts what is still pending', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.complete();
  r.link.rest('rest_skip');
  r.link.rx(res('abcd1234-1'));
  assert.equal(r.link.view().st, '1 pending');
  r.adv(600000);
  r.link.tick();
  assert.equal(r.link.view().st, '1 pending');
  r.link.rx(res('abcd1234-2'));
  assert.equal(r.link.view().st, 'Saved');
});

test('W3 only a Complete holds the lock while it is written; a Skip tap meanwhile does not free it', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  store.defer = true;
  r.link.complete();
  r.link.rest('rest_skip');
  assert.equal(r.link.view().can, false);
  r.link.complete();
  while (store.queue.length) store.step();
  const kinds = [...store.map.get('m2q')].map((i) => JSON.parse(slotText(store, i)).kind).sort();
  assert.deepEqual(kinds, ['complete_set', 'rest_skip']);
  assert.equal(r.link.view().can, false, 'still pending');
  // A Skip written first: its end does not free the Complete queued behind it.
  const s2 = fakeStore();
  const w = await rig({ store: s2, code: null });
  w.link.rx(snap({ rest: rest1 }));
  s2.defer = true;
  w.link.rest('rest_skip');
  w.link.complete();
  while (s2.queue.length && !s2.map.has('m2q1')) s2.step();
  w.link.complete();
  while (s2.queue.length) s2.step();
  assert.equal(s2.map.get('m2q'), '01');
  assert.deepEqual([...s2.map.get('m2q')].map((i) => JSON.parse(slotText(s2, i)).kind), ['rest_skip', 'complete_set']);
});

test('W4 every watch source written for Gate C transforms to ES5 with esbuild, and the page keeps only the onInit() { style', async () => {
  const { transformSync } = await import('esbuild');
  for (const rel of ['common/link.js', 'pages/index/index.js', 'app.js']) {
    let src = readFileSync(path.join(JS, rel), 'utf8');
    src = src.split('\n').filter((l) => !l.startsWith('import ') && !l.startsWith('export {')).join('\n').replace(/^export default \{/m, 'var page = {');
    // The page-method style hello/ ran on the GT 6, and nothing else: two spaces in, on<Name>() {.
    if (rel !== 'common/link.js') src = src.replace(/^ {2}(on[A-Z]\w*)\(\) \{/gm, '  $1: function () {');
    assert.doesNotMatch(src, /\.\.\./, `${rel}: spread or rest`);
    // Annex B string methods are not core ES5; substring and charAt ran on the GT 6 (hello/ a2.js).
    assert.doesNotMatch(src, /\.(substr|anchor|big|blink|bold|fixed|fontcolor|fontsize|italics|link|small|strike|sub|sup)\(|\b(un)?escape\(/, `${rel}: an Annex B method`);
    // esbuild refuses method shorthand, destructuring, default parameters, let, const and class at ES5.
    const out = transformSync(src, { target: 'es5', loader: 'js' }).code;
    assert.doesNotMatch(out, /\b__\w+/, `${rel}: needs an esbuild helper`);
  }
});

// WATCH-C red team fixes (2026-10-16).
test('W2 a result during start-up writes no index once a later slot read fails', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap());
  r.link.complete();
  r.link.rx(snap({ si: 2, set: set1({ id: 'set_a2' }) }));
  r.link.complete();
  assert.equal(store.map.get('m2q'), '01');
  const texts = [0, 1].map((i) => slotText(store, i));
  let once = true;
  store.failGet = (k) => { if (k === 'm2q1' && once) { once = false; return true; } return false; };
  store.defer = true;
  const b = await rig({ store, boot: 'bbbbbbbb', code: null });
  store.step(); // the index
  store.step(); store.step(); store.step(); // slot 0: its header and two chunks
  b.link.rx(snap({ si: 3, set: set1({ id: 'set_a3' }) }));
  assert.equal(b.cmds()[0], texts[0]);
  b.link.rx(res(JSON.parse(texts[0]).commandId));
  while (store.queue.length) store.step(); // slot 1 fails, then the removal's turn
  assert.equal(store.map.get('m2q'), '01');
  store.defer = false;
  const c = await rig({ store, boot: 'cccccccc', code: null });
  assert.equal(c.link.view().st, '2 pending');
  assert.equal(c.cmds()[0], texts[0]);
});

test('W3 a second Skip for a rest is not queued while one is being written or pending', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  store.defer = true;
  r.link.rest('rest_skip');
  r.link.rest('rest_skip');
  while (store.queue.length) store.step();
  store.defer = false;
  r.link.rest('rest_skip');
  r.link.rest('rest_add_30');
  const kinds = () => store.map.get('m2q').split('').map((i) => JSON.parse(slotText(store, i)).kind);
  assert.deepEqual(kinds(), ['rest_skip', 'rest_add_30']);
  // Once it is answered, the next rest can be skipped.
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snap({ rest: { ...rest1, id: 'rest_2' } }));
  r.link.rest('rest_skip');
  assert.deepEqual(kinds(), ['rest_add_30', 'rest_skip']);
});

test('W3 Complete and the rest buttons wait until the outbox has loaded', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.complete();
  r.link.rest('rest_skip');
  store.defer = true;
  const b = await rig({ store, boot: 'bbbbbbbb', code: null });
  b.link.rx(snap({ rest: rest1 }));
  assert.equal(b.link.view().can, false);
  b.link.complete();
  b.link.rest('rest_skip');
  while (store.queue.length) store.step();
  assert.equal(store.map.get('m2q'), '01');
  assert.equal(b.link.view().st, '2 pending');
  assert.equal(b.link.view().can, false, 'the restored set is pending');
});

test('W3 a later pair replaces the offset when it differs by more than its own round trip', async () => {
  const r = await rig({ code: null });
  let h = JSON.parse(r.hellos()[0]).wt;
  r.adv(40);
  r.link.rx(snap({ wt: h, pt: h + 20 })); // offset 0, round trip 40 ms
  r.adv(5000);
  r.link.show();
  h = JSON.parse(r.hellos()[r.hellos().length - 1]).wt;
  r.adv(50);
  r.link.rx(snap({ wt: h, pt: h + 25 - 60000 })); // the watch clock moved 60 s ahead: offset -60 s, round trip 50 ms
  r.adv(1000);
  r.link.show();
  h = JSON.parse(r.hellos()[r.hellos().length - 1]).wt;
  r.adv(4000);
  r.link.rx(snap({ wt: h, pt: h + 2000 - 60000 + 3000 })); // 3 s off, but within its 4 s round trip: ignored
  r.link.complete();
  assert.equal(JSON.parse(r.cmds()[0]).actionAt, r.now() - 60000);
});

// WATCH-C device run D1 (2026-10-17): @system.storage refuses values of 128 bytes or more.
test('W2 every value stored is under 128 bytes: a slot is one value of under 120 plain characters that rebuilds the same bytes', async () => {
  const store = fakeStore();
  const r = await rig({ store, boot: 'zzzzzzzz', code: null });
  // ids at the lengths the phone's newId gives (tests/watch-contract.test.ts), and a long load
  r.link.rx(snap({ sid: 's_mgv4k2xq_a1b2c3', set: set1({ id: 'set_mgv4k2xq_d4e5f6', rev: 9999, w: 123.456, r: 100, e: 'ideal' }) }));
  r.link.complete();
  assert.match(r.link.view().st, /^Pending /);
  const text = r.cmds()[0];
  for (const [k, v] of store.map) {
    assert.ok(Buffer.byteLength(v) < 120, `${k}: ${Buffer.byteLength(v)} B`);
    assert.match(k, KEY_OK);
  }
  assert.deepEqual([...store.map.keys()].sort(), ['m2q', 'm2q0', 'm2r']);
  assert.equal(slotText(store, 0), text);
  const again = await rig({ store, boot: 'yyyyyyyy', code: null });
  assert.equal(again.link.view().st, '1 pending');
  assert.equal(again.cmds()[0], text);
  // A command whose stored form would reach 120 characters, or holds a character that is not plain, is not stored.
  // the stored form for sid 's_1' sets the length a sid needs to make it exactly 120 characters
  const base = await rig({ store: fakeStore(), code: null });
  base.link.rx(snap({ sid: 's_1', set: set1({ id: 'set_mgv4k2xq_d4e5f6' }) }));
  base.link.complete();
  const at120 = 's_' + 'x'.repeat(120 - base.store.map.get('m2q0').length + 1);
  for (const sid of [at120, 's_' + 'x'.repeat(60), 's_a b', 's_\u00e9t\u00e9', 's_a,b']) {
    const s2 = fakeStore();
    const b = await rig({ store: s2, code: null });
    b.link.rx(snap({ sid, set: set1({ id: 'set_mgv4k2xq_d4e5f6' }) }));
    b.link.complete();
    assert.equal(b.link.view().st, 'Not saved', sid);
    assert.equal(b.cmds().length, 0);
    assert.deepEqual(s2.calls.filter((c) => c.startsWith('set') && c !== 'set m2r'), []);
  }
});

test('W2 a slot that no longer matches its sum is not loaded, and leaves the index', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.rest('rest_add_30');
  r.link.rest('rest_skip');
  const keep = slotText(store, 1);
  for (const bad of [(s) => s.map.set('m2q0', s.map.get('m2q0').replace('abcd1234-1', 'abcd1234-9')), (s) => s.map.set('m2q0', 'x'), (s) => s.map.set('m2q0', s.map.get('m2q0') + '0')]) {
    const s2 = fakeStore();
    for (const [k, v] of store.map) s2.map.set(k, v);
    bad(s2);
    const b = await rig({ store: s2, boot: 'bbbbbbbb', code: null });
    assert.equal(b.link.view().st, '1 pending');
    assert.equal(b.cmds()[0], keep);
    assert.equal(s2.map.get('m2q'), '1');
  }
});

test('W2 a slot value that cannot be read at start keeps its slot listed; new commands show Not saved; the next start loads it', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.rest('rest_add_30');
  r.link.rest('rest_skip');
  const texts = [0, 1].map((i) => slotText(store, i));
  let once = true;
  store.failGet = (k) => { if (k === 'm2q1' && once) { once = false; return true; } return false; };
  const b = await rig({ store, boot: 'bbbbbbbb', code: null });
  assert.equal(store.map.get('m2q'), '01', 'still listed');
  assert.equal(b.link.view().st, '1 pending');
  b.link.rx(snap({ rest: { ...rest1, id: 'rest_2' } }));
  b.link.rest('rest_add_30');
  assert.equal(b.link.view().st, 'Not saved');
  assert.equal(store.map.get('m2q'), '01');
  assert.equal(slotText(store, 1), texts[1]);
  const c = await rig({ store, boot: 'cccccccc', code: null });
  assert.equal(c.link.view().st, '2 pending');
  assert.equal(c.cmds()[0], texts[0]);
});

// WATCH-C red team of 1.1.1: a storage call that never calls back must not block the outbox.
test('W2 a storage call that never calls back ends in Not saved after 5 s, a late callback does nothing, and the next tap works', async () => {
  for (let k = 0; k < 3; k++) { // the Complete's calls (1.1.2): the slot, its read-back, the index
    const store = fakeStore();
    const r = await rig({ store, code: null });
    r.link.rx(snap());
    const held = [];
    let n = 0;
    store.run = (fn) => { if (n++ === k) held.push(fn); else fn(); };
    r.link.complete();
    assert.equal(held.length, 1, `call ${k}`);
    assert.equal(r.link.view().can, false);
    r.adv(5000); r.link.tick();
    assert.equal(r.link.view().st, '', `call ${k}: still waiting at 5 s`);
    r.adv(1000); r.link.tick(); // the 6th tick (1.1.2)
    assert.equal(r.link.view().st, 'Not saved', `call ${k}`);
    assert.equal(r.cmds().length, 0, `call ${k}: nothing sent`);
    store.run = (fn) => fn();
    held[0]();
    drain();
    assert.equal(r.link.view().st, 'Not saved', `call ${k}: the late callback changes nothing`);
    assert.equal(r.cmds().length, 0);
    // 1.1.2: after a timeout storage stays off for the run, so the next tap is Not saved too, with no storage call
    const calls = store.calls.length;
    r.link.complete();
    assert.equal(r.link.view().st, 'Not saved', `call ${k}: storage stays off`);
    assert.equal(r.cmds().length, 0);
    assert.equal(store.calls.length, calls);
  }
  // At start-up a stuck index read takes the unreadable-index path: ready, hello, and Not saved.
  const store = fakeStore();
  let late = null;
  store.run = (fn) => { if (!late && store.calls[store.calls.length - 1] === 'get m2q') late = fn; else fn(); };
  const b = await rig({ store, code: null });
  b.link.rx(snap());
  assert.equal(b.hellos().length, 0);
  b.adv(6000); b.link.tick(); // the 6th tick (1.1.2)
  assert.equal(b.hellos().length, 1);
  b.link.complete();
  assert.equal(b.link.view().st, 'Not saved');
  late();
  drain();
  assert.equal(b.hellos().length, 1);
});

// WATCH-C 1.1.2 (2026-10-17): the GT 6 crashed after each applied command and then reset. Safeguards, each
// failing on 1.1.1.
const eight = async (store) => { // 8 pending rest commands from an earlier run
  const r = await rig({ store, boot: 'eeeeeeee', code: null });
  r.link.rx(snap({ rest: rest1 }));
  for (let i = 0; i < 8; i++) r.link.rest('rest_add_30');
  assert.equal(store.map.get('m2q'), '01234567');
  return r;
};

test('1.1.2 S1 nothing writes an empty value: the empty index is "-", read like a missing one', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.complete();
  r.link.rest('rest_skip');
  r.link.rx(res('abcd1234-1'));
  r.link.rx(res('abcd1234-2'));
  assert.equal(r.link.view().st, 'Saved');
  assert.equal(store.map.get('m2q'), '-');
  // An index whose slots are all gone is rewritten as "-", never ""; "-" and a missing index read as empty, with no write.
  const s2 = fakeStore();
  s2.map.set('m2q', '35');
  await rig({ store: s2, code: null });
  assert.equal(s2.map.get('m2q'), '-');
  for (const idx of ['-', undefined]) {
    const s3 = fakeStore();
    if (idx) s3.map.set('m2q', idx);
    const c = await rig({ store: s3, code: null });
    assert.equal(c.link.view().st, '');
    assert.deepEqual(s3.calls.filter((x) => x.startsWith('set')), ['set m2r']);
  }
  assert.deepEqual([...store.empty, ...s2.empty], []);
});

test('1.1.2 S2 storage calls: a Complete is 3 (slot, read-back, index), a result is 1 (index)', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap());
  store.calls.length = 0;
  r.link.complete();
  assert.deepEqual(store.calls, ['set m2q0', 'get m2q0', 'set m2q']);
  store.calls.length = 0;
  r.link.rx(res('abcd1234-1'));
  assert.deepEqual(store.calls, ['set m2q']);
  // Start-up: the restart count, then the index and each listed slot once.
  const s2 = fakeStore();
  await eight(s2);
  s2.calls.length = 0;
  await rig({ store: s2, boot: 'ffffffff', code: null });
  assert.deepEqual(s2.calls, ['get m2r', 'set m2r', 'get m2q', ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `get m2q${i}`)]);
});

test('1.1.2 S3 every storage call starts on a fresh stack: a store that answers at once is never re-entered', async () => {
  const store = fakeStore();
  await eight(store); // eight Completes' worth of writes
  const r = await rig({ store, boot: 'gggggggg', code: null }); // start-up load of 8 slots
  r.link.rx(snap({ rest: rest1 }));
  for (let i = 1; i <= 8; i++) r.link.rx(res(`eeeeeeee-${i}`)); // results
  r.link.rx(snap());
  r.link.complete(); // a Complete
  assert.match(r.link.view().st, /^Pending /);
  assert.equal(store.maxDepth, 1);
  assert.equal(store.direct, 0, 'no storage call on the stack of a call into the link');
  assert.equal(store.inside, 0, 'no link code on the stack of a storage call');
});

test('1.1.2 S4 two unclean starts in a row pause the third; a clean exit never counts; the pause runs 600 ticks', async () => {
  const store = fakeStore();
  const a = await rig({ store, keepRun: true, code: null }); // no die(): it crashed
  a.link.rx(snap());
  a.link.complete();
  assert.equal(a.connects, 1);
  const b = await rig({ store, t: T0 + 60000, keepRun: true, boot: 'bbbbbbbb', code: null });
  assert.equal(b.connects, 1, 'the second start runs, and resends once');
  assert.equal(b.cmds().length, 1);
  assert.equal(store.map.get('m2r'), '1,r');
  store.calls.length = 0;
  const c = await rig({ store, t: T0 + 120000, keepRun: true, boot: 'cccccccc', code: null });
  assert.equal(c.connects, undefined, 'no receiver');
  assert.deepEqual(c.sent, [], 'no hello, no resend');
  assert.deepEqual(store.calls, ['get m2r', 'set m2r'], 'no outbox, no other writes');
  assert.equal(store.map.get('m2r'), `2,${T0 + 120000}`);
  c.link.show();
  c.link.rx(snap());
  c.link.complete();
  c.adv(31000); c.link.tick();
  assert.deepEqual(c.sent, []);
  assert.deepEqual([c.link.view().l1, c.link.view().l2, c.link.view().set], ['Paused after restarts', 'Try again in 10 min', false]);
  c.link.die();
  assert.equal(store.map.get('m2r'), `2,${T0 + 120000}`, 'a paused run leaves the pause in place');
  // Reopened within the 10 min it stays paused for the rest of them, then resumes by itself.
  store.calls.length = 0;
  const d = await rig({ store, t: T0 + 420000, keepRun: true, boot: 'dddddddd', code: null });
  assert.equal(d.link.view().l1, 'Paused after restarts');
  assert.deepEqual(store.calls, ['get m2r'], 'no write');
  d.adv(299000); d.link.tick();
  assert.equal(d.connects, undefined);
  d.adv(1000); d.link.tick();
  assert.equal(d.connects, 1);
  assert.equal(d.cmds().length, 1);
  // A start after the pause runs; a crash right after counts once more.
  const e = await rig({ store, t: T0 + 800000, keepRun: true, boot: 'eeeeeeee', code: null });
  assert.equal(e.connects, 1);
  assert.equal(store.map.get('m2r'), '1,r');
  // Clean exits never count, however quick.
  const s2 = fakeStore();
  for (let i = 0; i < 5; i++) {
    const x = await rig({ store: s2, t: T0 + i * 20000, keepRun: true, code: null });
    assert.equal(x.connects, 1, `open ${i + 1}`);
    x.link.die();
    assert.equal(s2.map.get('m2r'), '0,c');
  }
  // A clock set back during a pause ends it rather than stretching it.
  const s3 = fakeStore();
  s3.map.set('m2r', `2,${T0 + 3600000}`);
  const y = await rig({ store: s3, keepRun: true, code: null });
  assert.equal(y.connects, 1);
  // The pause is 600 ticks of the page interval, whatever the wall clock does.
  const s4 = fakeStore();
  s4.map.set('m2r', '1,r');
  const z = await rig({ store: s4, keepRun: true, code: null });
  z.wall = -3600000;
  z.adv(599000); z.link.tick();
  assert.equal(z.connects, undefined, 'still paused after 599 ticks');
  z.adv(1000); z.link.tick();
  assert.equal(z.connects, 1);
});

test('1.1.2 S5 a callback that throws is caught on its own stack, and the outbox carries on', async () => {
  const store = fakeStore();
  const { Link } = await load();
  const sent = [];
  let throwing = true;
  // the page's repaint throws inside every storage callback
  const io = { store, now: () => T0, send: (x) => { sent.push(x); }, keep: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); }, paint: () => { if (throwing) throw new Error('paint'); } };
  const l = Link(io, 'tttttttt');
  l.start();
  assert.doesNotThrow(drain);
  throwing = false;
  l.rx(snap());
  throwing = true;
  l.complete();
  assert.doesNotThrow(drain);
  throwing = false;
  assert.match(l.view().st, /^Pending /);
  assert.equal(sent.filter((x) => JSON.parse(x).k === 'cmd').length, 1);
});

// Review of 1.1.2 (49025d7f).
test('1.1.2 S6 the restart marker fails closed: an unreadable or silent marker pauses without a write; a corrupt count counts as 0', async () => {
  for (const [name, setup] of [['fails', (s) => { s.failGet = (k) => k === 'm2r'; }], ['never answers', (s) => { const run = s.run; s.run = (fn) => { if (s.calls[s.calls.length - 1] !== 'get m2r') run(fn); }; }]]) {
    const store = fakeStore();
    setup(store);
    const r = await rig({ store, keepRun: true, code: null });
    r.adv(6000); r.link.tick();
    assert.equal(r.link.view().l1, 'Paused after restarts', name);
    assert.equal(r.connects, undefined, name);
    assert.deepEqual(store.calls.filter((c) => c.startsWith('set')), [], `${name}: no write`);
    r.adv(600000); r.link.tick();
    assert.equal(r.connects, 1, `${name}: 600 ticks later it resumes`);
  }
  for (const [bad, after] of [['-1000,r', '1,r'], ['1e9,r', '1,r'], ['0.5,r', '1,r'], ['99,r', '1,r'], ['abc', '0,r'], [',', '0,r'], ['-', '0,r'], ['5,c', '0,r'], ['5', '0,r']]) {
    const store = fakeStore();
    store.map.set('m2r', bad);
    const r = await rig({ store, keepRun: true, code: null });
    assert.equal(r.connects, 1, bad);
    assert.equal(store.map.get('m2r'), after, bad);
  }
  const store = fakeStore();
  store.map.set('m2r', '1,r');
  const r = await rig({ store, keepRun: true, code: null });
  assert.equal(r.link.view().l1, 'Paused after restarts', 'the second unclean start in a row');
});

test('1.1.2 S7 a run that stays live for 30 s resets the count, so only quick restarts pause', async () => {
  const store = fakeStore();
  for (let i = 0; i < 4; i++) { // each run crashes after a minute (no die)
    const r = await rig({ store, t: T0 + i * 100000, keepRun: true, code: null });
    assert.equal(r.connects, 1, `open ${i + 1}`);
    r.adv(31000); r.link.tick();
    assert.equal(store.map.get('m2r'), '0,r');
    r.adv(29000); r.link.tick();
  }
  assert.deepEqual(store.calls.filter((c) => c === 'set m2r').length, 8, 'one reset per run');
  assert.deepEqual(store.empty, []);
});

test('1.1.2 S8 after onDestroy (die) nothing deferred runs: no connect, no storage call, no send', async () => {
  const store = fakeStore();
  const { Link } = await load();
  let connects = 0;
  const sent = [];
  const l = Link({ store, now: () => T0, send: (x) => { sent.push(x); }, keep: () => {}, connect: () => { connects++; }, paint: () => {}, defer: (fn) => { tasks.push(fn); } }, 'dddddddd');
  l.start();
  l.die();
  drain();
  assert.deepEqual([connects, sent.length, store.calls.length], [0, 0, 0]);
});

test('1.1.2 S9 1.1.1 keys are never read; a stored slot needs a whole sum, a known kind and its exact field count', async () => {
  const store = fakeStore();
  store.map.set('mc_q', '');
  store.map.set('mc_q0', '2,230,12345');
  store.map.set('mc_q0_0', '{"t":"mw"');
  store.map.set('mc_run', '5,' + T0);
  const r = await rig({ store, code: null });
  assert.equal(r.connects, 1);
  assert.deepEqual(store.calls.filter((c) => c.includes('mc_')), []);
  const good = ['a', 'abcd1234-1', 's_1', T0, 'rest_1'];
  for (const [f, loads] of [
    [good, true],
    [['x', ...good.slice(1)], false],
    [[...good, 0, 60, 'kg', 8, ''], false],
    [['c', ...good.slice(1)], false],
    [['a', 'abcd1234-1', 's 1', T0, 'rest_1'], false],
  ]) {
    const s2 = fakeStore();
    const b = f.join(',');
    s2.map.set('m2q', '0');
    s2.map.set('m2q0', `${b},${String(sum(b) % 99991)}`);
    const x = await rig({ store: s2, code: null });
    assert.equal(x.link.view().st, loads ? '1 pending' : '', b);
  }
  // Each call carries only its documented fields: a get key and default, a set key and value.
  const s3 = fakeStore();
  const seen = [];
  const { set, get } = s3;
  s3.set = (o) => { seen.push(['set', ...Object.keys(o).sort()]); set(o); };
  s3.get = (o) => { seen.push(['get', ...Object.keys(o).sort()]); get(o); };
  const y = await rig({ store: s3, code: null });
  y.link.rx(snap());
  y.link.complete();
  assert.deepEqual([...new Set(seen.map((x) => x.join(' ')))].sort(), ['get default fail key success', 'set fail key success value']);
});

// Red team of 128a56db on JerryScript (scratchpad rt-e).
test('1.1.2 S10 queued jobs start on a fresh stack: 100 "Queue full" taps behind a slow write do not nest', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  for (let i = 0; i < 7; i++) r.link.rest('rest_add_30');
  store.defer = true;
  r.link.rest('rest_add_30'); // the 8th, its write held
  for (let i = 0; i < 100; i++) r.link.rest('rest_add_30');
  const limit = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  let deepest = 0;
  const paint = r.paints;
  try {
    const depth = () => { deepest = Math.max(deepest, new Error().stack.split('\n').length); };
    const { run } = store;
    store.run = (fn) => { depth(); run(fn); };
    r.onPaint = depth; // each "Queue full" job ends with a repaint and makes no storage call
    while (store.queue.length) store.step();
    drain();
  } finally { Error.stackTraceLimit = limit; }
  assert.equal(r.link.view().st, 'Queue full');
  assert.ok(deepest < 40, `stack ${deepest}`);
  assert.equal(store.map.get('m2q'), '01234567');
  assert.ok(r.paints > paint);
});

test('1.1.2 S11 a lost storage answer fails after 5 ticks, and storage then stays off for the run', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.dropAnswer = true;
  r.link.complete();
  r.adv(5000); r.link.tick();
  assert.equal(r.link.view().st, '');
  r.adv(1000); r.link.tick();
  assert.equal(r.link.view().st, 'Not saved');
  const calls = store.calls.length;
  for (let i = 0; i < 30; i++) { r.adv(2000); r.link.rest('rest_add_30'); }
  assert.equal(r.link.view().st, 'Not saved');
  assert.equal(store.calls.length, calls, 'no storage call after the timeout');
  assert.equal(r.cmds().length, 0);
  // With the outbox full, a tap once storage is off says Not saved, not Queue full.
  const s2 = fakeStore();
  const f = await rig({ store: s2, code: null });
  f.link.rx(snap({ rest: rest1 }));
  for (let i = 0; i < 9; i++) f.link.rest('rest_add_30');
  assert.equal(f.link.view().st, 'Queue full');
  f.dropAnswer = true; // the 30 s restart-marker write is never answered
  f.adv(40000); f.link.tick();
  assert.equal(s2.calls.at(-1), 'set m2r');
  const c2 = s2.calls.length;
  f.link.rest('rest_add_30');
  assert.equal(f.link.view().st, 'Not saved');
  assert.equal(s2.calls.length, c2);
});

test('1.1.2 S16 a job whose start is lost starts on the 6th tick; one that never finishes is given up on the 11th, and storage stays off', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  const calls = r.store.calls.length;
  r.dropNext = true; // the deferred start of the Complete's job is lost
  r.link.complete();
  r.adv(5000); r.link.tick();
  assert.equal(r.store.calls.length, calls, 'not started after 5 ticks');
  r.adv(1000); r.link.tick();
  assert.match(r.link.view().st, /^Pending /);
  assert.equal(r.cmds().length, 1);
  // A job that throws before it finishes holds the queue for 10 ticks, then is given up.
  const s = await rig({ code: null });
  s.link.rx(snap({ rest: rest1 }));
  s.throwSend = true; // the Complete's first send throws inside its job
  s.link.complete();
  s.link.rest('rest_add_30'); // queued behind it
  const c = s.store.calls.length;
  s.adv(10000); s.link.tick();
  assert.match(s.link.view().st, /^Pending /);
  assert.equal(s.cmds().length, 1, 'the Complete is resent at 4 s');
  s.adv(1000); s.link.tick();
  assert.equal(s.link.view().st, 'Not saved');
  assert.equal(s.store.calls.length, c, 'no storage call once the job was given up');
});

test('1.1.2 S17 an exit while a storage call is in flight writes no clean marker, so it counts as unclean', async () => {
  const store = fakeStore();
  const r = await rig({ store, keepRun: true, code: null });
  r.link.rx(snap());
  store.defer = true;
  r.link.complete(); // its slot write is in flight
  assert.equal(store.calls.at(-1), 'set m2q0');
  const calls = store.calls.length;
  r.link.die();
  assert.equal(store.calls.length, calls, 'no second call while one is in flight');
  store.defer = false;
  while (store.queue.length) store.step();
  assert.equal(store.map.get('m2r'), '0,r');
  const s = await rig({ store, t: T0 + 60000, keepRun: true, boot: 'bbbbbbbb', code: null });
  assert.equal(store.map.get('m2r'), '1,r', 'that exit counted');
  s.link.die(); // nothing in flight
  assert.equal(store.map.get('m2r'), '0,c');
});

test('1.1.2 S18 a snap whose wt is not a number is ignored, and nothing throws', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  assert.doesNotThrow(() => r.link.rx(snap({ ex: 'Row', wt: { valueOf: 1, toString: 1 } })));
  assert.equal(r.link.view().l1, 'Bench press 1/3');
  r.link.rx(snap({ ex: 'Row', wt: null }));
  assert.equal(r.link.view().l1, 'Row 1/3');
});

test('1.1.2 S12 phone values that are not what they claim are ignored, and nothing throws', async () => {
  const obj = { toString: 1 };
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  for (const m of [snap({ ex: obj }), snap({ si: obj }), snap({ set: set1({ id: 'set_b', r: obj }) }), snap({ set: set1({ id: 'set_b', w: obj }) }), snap({ set: set1({ id: 'set_b', e: obj }) }),
    res('abcd1234-1', { status: 'rejected', reason: obj })]) {
    assert.doesNotThrow(() => { r.link.rx(m); r.adv(1000); r.link.tick(); r.link.complete(); r.link.view(); }, m);
  }
  assert.equal(r.link.view().l1, 'Bench press 1/3', 'the last good snap stays');
  // Every page entry point catches what it throws.
  const page = readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8');
  for (const h of ['onShow', 'onComplete', 'onEffort', 'onAdd', 'onSkip']) assert.match(page, new RegExp(`^  ${h}\\(\\) \\{ try \\{ .*\\} catch \\(e\\) \\{\\} \\},$`, 'm'), h);
  assert.match(page, /onInit\(\) \{\n\t\ttry \{/);
  // onDestroy writes the clean marker last, so a hung write cannot block the rest (final check of 345137b8)
  assert.match(page, /onDestroy\(\) \{\n\t\tclearInterval\(timer\);\n\t\tkeep\(false\);\n\t\tpage = null;\n\t\ttry \{ client\.unregisterReceiver\(\{ onSuccess: no \}\); \} catch \(e\) \{\}\n\t\ttry \{ link\.die\(\); \} catch \(e\) \{\}\n\t\}/);
  assert.match(page, /setInterval\(function \(\) \{ try \{ link\.tick\(\); \} catch \(e\) \{\} \}, 1000\)/);
  assert.match(page, /onReceiveMessage: function \(msg\) \{ try \{ link\.rx\(msg\); \} catch \(e\) \{\} \}/);
  assert.match(page, /onSuccess: function \(\) \{ try \{ link\.show\(\); \} catch \(e\) \{\} \}/);
});

test('1.1.2 S13 a message over 2 KB is refused before it is parsed', async () => {
  const r = await rig({ code: null });
  const big = snap({ ex: 'Row', pad: 'x'.repeat(2100) });
  const parse = JSON.parse;
  let parsed = 0;
  JSON.parse = (...a) => { parsed++; return parse(...a); };
  try { r.link.rx(big); r.link.rx('['.repeat(40000) + ']'.repeat(40000)); } finally { JSON.parse = parse; }
  assert.equal(parsed, 0);
  assert.equal(r.link.view().l1, '');
  r.link.rx(snap({ ex: 'Row', pad: 'x'.repeat(1700) }));
  assert.equal(r.link.view().l1, 'Row 1/3');
});

test('1.1.2 S14 resends, hello and the phone lines run on the 1 s tick, not the wall clock', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.wall = -3600000; // the watch clock set back an hour
  for (let i = 0; i < 60; i++) { r.adv(1000); r.link.tick(); }
  assert.equal(r.cmds().length, 5, 'resent at 4, 12, 28 and 58 s');
  assert.ok(r.hellos().length >= 3);
  assert.equal(r.link.view().p1, 'Phone not connected');
});

test('1.1.2 S15 after onDestroy rx and show do nothing', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  const keeps = r.keeps.length, sent = r.sent.length, paints = r.paints;
  r.link.die();
  r.link.rx(snap({ sid: 's_2' }));
  r.link.show();
  r.adv(60000); r.link.tick();
  assert.deepEqual([r.keeps.length, r.sent.length, r.paints], [keeps, sent, paints]);
});
