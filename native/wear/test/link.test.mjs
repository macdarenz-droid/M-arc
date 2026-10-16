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

const T0 = Date.UTC(2026, 9, 16, 10, 0, 0);
const TH = ['#08090a', '#f7f8f8', '#5e6ad2'];
const set1 = (o = {}) => ({ id: 'set_a1', rev: 0, w: 60, u: 'kg', r: 8, e: null, src: 't', ...o });
const snap = (o = {}) => JSON.stringify({
  t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', ex: 'Bench press', si: 1, sn: 3,
  set: set1(), rest: null, th: TH, ...o,
});
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });

/** @system.storage as the watch has it: get and set with success and fail callbacks. */
function fakeStore() {
  const s = {
    map: new Map(), calls: [], queue: [], defer: false, failSet: () => false, failGet: () => false, cut: 0,
    set(o) {
      s.calls.push(`set ${o.key}`);
      s.run(() => {
        if (s.failSet(o.key)) return o.fail('write failed', 300);
        s.map.set(o.key, s.cut ? o.value.slice(0, s.cut) : o.value);
        o.success();
      });
    },
    get(o) {
      s.calls.push(`get ${o.key}`);
      s.run(() => (s.failGet(o.key) ? o.fail('read failed', 300) : o.success(s.map.has(o.key) ? s.map.get(o.key) : o.default)));
    },
    run(fn) { if (s.defer) s.queue.push(fn); else fn(); },
    step() { s.queue.shift()(); },
  };
  return s;
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
    now: () => t,
    send: (text, done) => { sent.push(text); if (r.code !== null) done(r.code); },
    keep: (on) => keeps.push(on),
    paint: () => { r.paints++; },
  };
  r.link = Link(io, o.boot ?? 'abcd1234');
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
  // The longest ids the phone allows still fit.
  const big = await rig({ boot: 'zzzzzzzz' });
  const id64 = 'x'.repeat(64);
  big.link.rx(snap({ sid: id64, set: set1({ id: id64, rev: Number.MAX_SAFE_INTEGER, w: 999.75, u: 'kg', r: 100, e: 'ideal' }) }));
  big.link.complete();
  assert.ok(Buffer.byteLength(big.cmds()[0]) <= 400, `${Buffer.byteLength(big.cmds()[0])} B`);
  assert.match(big.cmds()[0], /^[\x20-\x7e]+$/);
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
    for (const c of r.store.map.keys()) if (c !== 'mc_q') ids.add(JSON.parse(r.store.map.get(c)).commandId);
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
  assert.deepEqual(steps, [['set mc_q0', '', 0], ['get mc_q0', '', 0], ['set mc_q', '', 0]]);
  assert.equal(r.link.view().st, `Pending ${new Date(T0).toTimeString().slice(0, 8)}`);
  assert.equal(r.cmds().length, 1);
  assert.equal(store.map.get('mc_q'), '0');
  assert.equal(store.map.get('mc_q0'), r.cmds()[0]);
});

test('W2 a failed write shows Not saved and sends nothing', async () => {
  for (const [name, setup] of [
    ['slot write', (s) => { s.failSet = (k) => k === 'mc_q0'; }],
    ['index write', (s) => { s.failSet = (k) => k === 'mc_q'; }],
    ['read-back', (s) => { s.failGet = (k) => k === 'mc_q0'; }],
    ['value cut short', (s) => { s.cut = 128; }],
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
    assert.equal(store.map.get('mc_q') ?? '', '', `${name}: the index lists nothing`);
  }
  // An index that cannot be read at start: nothing is added over what it may list.
  const store = fakeStore();
  store.failGet = (k) => k === 'mc_q';
  const r = await rig({ store });
  r.link.rx(snap());
  r.link.complete();
  assert.equal(r.link.view().st, 'Not saved');
  assert.equal(r.cmds().length, 0);
  assert.equal(store.calls.filter((c) => c.startsWith('set')).length, 0);
});

test('W2 a full outbox shows Queue full and drops nothing; a restart restores identical bytes', async () => {
  const store = fakeStore();
  const r = await rig({ store, code: null });
  r.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  for (let i = 0; i < 8; i++) r.link.rest('rest_add_30');
  assert.equal(store.map.get('mc_q'), '01234567');
  const before = new Map(store.map);
  r.link.rest('rest_skip');
  assert.equal(r.link.view().st, 'Queue full');
  assert.deepEqual(new Map(store.map), before, 'nothing written, nothing dropped');
  const texts = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => store.map.get(`mc_q${i}`));
  // Restart: the slots the index lists come back with the same bytes, oldest first.
  const again = await rig({ store, boot: 'qqqqqqqq', code: null });
  assert.equal(again.link.view().st, '8 pending');
  assert.equal(again.cmds().length, 1);
  assert.equal(again.cmds()[0], texts[0]);
  for (let i = 0; i < 8; i++) {
    again.link.rx(res(JSON.parse(texts[i]).commandId));
    assert.equal(again.cmds()[again.cmds().length - 1], i < 7 ? texts[i + 1] : texts[7]);
  }
  assert.equal(store.map.get('mc_q'), '');
  // A removed slot is reused; the index keeps the oldest first.
  const s2 = fakeStore();
  const x = await rig({ store: s2, code: null });
  x.link.rx(snap({ rest: { id: 'rest_1', left: 60000, tot: 90000, p: false } }));
  for (let i = 0; i < 3; i++) x.link.rest('rest_add_30');
  x.link.rx(res('abcd1234-1'));
  x.link.rest('rest_skip');
  assert.equal(s2.map.get('mc_q'), '120');
  const y = await rig({ store: s2, code: null });
  assert.equal(y.link.view().st, '3 pending');
  assert.equal(y.cmds()[0], s2.map.get('mc_q1'));
  // Slots the index does not list, or that no longer hold a command, are not loaded.
  const s3 = fakeStore();
  s3.map.set('mc_q', '3x3a5');
  s3.map.set('mc_q3', texts[2]);
  s3.map.set('mc_q5', '{"t":"mw"');
  s3.map.set('mc_q6', texts[3]);
  const z = await rig({ store: s3, code: null });
  assert.equal(z.link.view().st, '1 pending');
  assert.equal(s3.map.get('mc_q'), '3');
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
  r.adv(3999); r.link.tick();
  assert.equal(r.cmds().length, 8);
  r.adv(1); r.link.tick();
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
    assert.equal(r.store.map.get('mc_q'), left ? '0' : '', JSON.stringify(extra));
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
  assert.equal(r.store.map.get('mc_q'), '0');
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
  r.link.rx(snap({ wt: wt3, pt: wt3 + 1500 + 50000 })); // 3 s: worse, ignored
  r.link.rx(snap({ wt: T0 + 1, pt: T0 })); // not a hello this watch sent
  r.link.complete();
  assert.equal(JSON.parse(r.cmds()[0]).actionAt, r.now() + 7000);
});

test('W3 hello: at start, on show, after 20 s of silence and after failed sends (5 to 30 s); at most 120 B', async () => {
  const r = await rig({ code: 207 });
  assert.equal(r.hellos().length, 1);
  const h = JSON.parse(r.hellos()[0]);
  assert.deepEqual(Object.keys(h), ['t', 'v', 'k', 'app', 'boot', 'wt', 'q']);
  assert.deepEqual(h, { t: 'mw', v: 1, k: 'hello', app: '1.1.0', boot: 'abcd1234', wt: T0, q: 0 });
  r.link.show();
  assert.equal(r.hellos().length, 2);
  r.adv(19999); r.link.tick();
  assert.equal(r.hellos().length, 2);
  r.link.rx(snap());
  r.adv(19999); r.link.tick();
  assert.equal(r.hellos().length, 2, 'a phone message restarts the 20 s');
  r.adv(1); r.link.tick();
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
  assert.equal(r.store.map.get('mc_q'), '0', 'one entry');
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
  assert.equal(store.map.get('mc_q'), '0');
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
  r.adv(5001);
  assert.deepEqual([r.link.view().p1, r.link.view().p2], ['Phone not connected', 'Open M/ARC on your phone']);
  r.link.rx(snap({ sid: null, ex: null, si: 0, sn: 0, set: null }));
  let v = r.link.view();
  assert.deepEqual([v.l1, v.l2, v.p1, v.set], ['Start your workout', 'in M/ARC on your phone', '', false]);
  r.adv(25001);
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

test('W4 ES5, ASCII, wearengine.js unchanged, PHONE_FP, no permissions, page sources at most 32,000 B', async () => {
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
  assert.ok(total <= 32000, `page sources ${total} B`);
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
  assert.deepEqual(cfg.app.version, { code: 1001000, name: '1.1.0' });
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
  assert.deepEqual([...hml.matchAll(/value="([^"{]+)"/g)].map((m) => m[1]), ['+30 s', 'Skip', 'Complete']);
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
  const texts = [0, 1, 2].map((i) => store.map.get(`mc_q${i}`));
  let once = true;
  store.failGet = (k) => { if (k === 'mc_q1' && once) { once = false; return true; } return false; };
  const b = await rig({ store, boot: 'bbbbbbbb', code: null });
  assert.equal(store.map.get('mc_q'), '012', 'the unread slot stays listed');
  assert.equal(b.link.view().st, '2 pending');
  assert.equal(b.cmds()[0], texts[0]);
  b.link.rx(res(JSON.parse(texts[0]).commandId));
  assert.equal(b.cmds()[b.cmds().length - 1], texts[2]);
  b.link.rx(snap({ rest: rest1 }));
  b.link.rest('rest_skip');
  assert.equal(b.link.view().st, 'Not saved');
  assert.equal(store.map.get('mc_q'), '012', 'the index is left as it was read');
  const c = await rig({ store, boot: 'cccccccc', code: null });
  assert.equal(c.link.view().st, '3 pending');
  assert.equal(c.cmds()[0], texts[0]);
  assert.equal(store.map.get('mc_q1'), texts[1]);
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
  const kinds = [...store.map.entries()].filter(([k]) => k !== 'mc_q').map(([, v]) => JSON.parse(v).kind).sort();
  assert.deepEqual(kinds, ['complete_set', 'rest_skip']);
  assert.equal(r.link.view().can, false, 'still pending');
  // A Skip written first: its end does not free the Complete queued behind it.
  const s2 = fakeStore();
  const w = await rig({ store: s2, code: null });
  w.link.rx(snap({ rest: rest1 }));
  s2.defer = true;
  w.link.rest('rest_skip');
  w.link.complete();
  while (s2.queue.length && !s2.map.has('mc_q1')) s2.step();
  w.link.complete();
  while (s2.queue.length) s2.step();
  assert.equal(s2.map.get('mc_q'), '01');
  assert.equal([...s2.map.keys()].filter((k) => k !== 'mc_q').length, 2);
});

test('W4 every watch source written for Gate C transforms to ES5 with esbuild, and the page keeps only the onInit() { style', async () => {
  const { transformSync } = await import('esbuild');
  for (const rel of ['common/link.js', 'pages/index/index.js', 'app.js']) {
    let src = readFileSync(path.join(JS, rel), 'utf8');
    src = src.split('\n').filter((l) => !l.startsWith('import ') && !l.startsWith('export {')).join('\n').replace(/^export default \{/m, 'var page = {');
    // The page-method style hello/ ran on the GT 6, and nothing else: two spaces in, on<Name>() {.
    if (rel !== 'common/link.js') src = src.replace(/^ {2}(on[A-Z]\w*)\(\) \{/gm, '  $1: function () {');
    assert.doesNotMatch(src, /\.\.\./, `${rel}: spread or rest`);
    // esbuild refuses method shorthand, destructuring, default parameters, let, const and class at ES5.
    const out = transformSync(src, { target: 'es5', loader: 'js' }).code;
    assert.doesNotMatch(out, /\b__\w+/, `${rel}: needs an esbuild helper`);
  }
});
