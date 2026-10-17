// WATCH-C3 acceptance L1 to L5 on the watch's own common/link.js and page: logging ahead from the phone's nx while the
// phone is away, the local rest, Rest done, Adjust (kg and reps), the heart-rate line and no `if` on a text. The
// phone's nx, rs and st are faked from the card's shapes. Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const PAGE = path.join(ROOT, 'native/wear/app/entry/src/main/js/default/pages/index');
const LINK = pathToFileURL(path.join(ROOT, 'native/wear/app/entry/src/main/js/default/common/link.js')).href;

const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);
const AC = '#5e6ad2', PL = '#232428';
const two = (n) => String(n).padStart(2, '0');
const hms = (ms) => `${two(new Date(ms).getHours())}:${two(new Date(ms).getMinutes())}:${two(new Date(ms).getSeconds())}`;

// Bench press, 5 sets: set 2 open, then 3, 4 and 5 (nx, [id, rev, w, r] in set.u); the phone's rest is 90 s (rs).
const S2 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't', st: 2.5 };
const NX = [['set_b3', 0, 62.5, 8], ['set_b4', 2, 62.5, 6], ['set_b5', 0, 65, 5]];
const snap = (o = {}) => JSON.stringify({
  t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 5,
  set: S2, nx: NX, rs: 90, lt: { w: 57.5, u: 'kg', r: 8 }, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o,
});
const ROWS = [
  { id: 'e_bench', ex: 'Bench press', d: 1, n: 5, set: S2, lt: null },
  { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c1', rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l', st: 5 }, lt: null },
  { id: 'e_curl', ex: 'Curl', d: 0, n: 3, set: { id: 'set_u1', rev: 0, w: 25, u: 'lb', r: 12, e: null, src: 't' }, lt: null },
];
const plan = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 4, st: 11, rows: ROWS, ...o });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });
const rest1 = { id: 'rest_1', left: 5000, tot: 90000, p: false };

/** @system.storage as in link.test.mjs: values under 128 bytes, plain keys; every call and callback deferred. */
const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
function store() {
  const map = new Map();
  return {
    map,
    set(o) { if (!/^[A-Za-z0-9_]{1,32}$/.test(o.key) || o.value === '' || Buffer.byteLength(String(o.value)) >= 128) return o.fail(); map.set(o.key, o.value); o.success(); },
    get(o) { o.success(map.has(o.key) ? map.get(o.key) : o.default); },
  };
}
/** A link with a fake clock, storage, radio and vibrator; one tick runs per second the clock moves, before each call. */
async function rig(o = {}) {
  const { Link } = await import(LINK);
  let t = T0;
  const r = { sent: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store(), buzz: 0, keeps: [], depths: [] };
  const io = {
    store: r.store, now: () => t, keep: (on) => r.keeps.push(on), connect: () => {}, defer: (fn) => { tasks.push(fn); },
    paint: () => { r.depths.push(new Error().stack.split('\n').length); },
    send: (text, done) => { r.sent.push(text); if (r.code !== null) done(r.code); }, buzz: () => { r.buzz++; },
  };
  const link = Link(io, o.boot ?? 'abcd1234');
  let ticked = 0;
  r.link = {};
  for (const k of Object.keys(link)) {
    r.link[k] = (...a) => {
      while (ticked < Math.floor((t - T0) / 1000)) { ticked++; link.tick(); drain(); }
      const out = k === 'tick' ? undefined : link[k](...a);
      drain();
      return out;
    };
  }
  r.adv = (ms) => { t += ms; };
  r.now = () => t;
  r.tick = () => { t += 1000; r.link.tick(); };
  r.v = () => r.link.view();
  r.cmds = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.link.start();
  return r;
}
const only = (v, keys) => Object.fromEntries(keys.map((k) => [k, v[k]]));
const offline = (r) => { r.adv(26000); r.link.tick(); };

/** index.hml as the GT 6 draws it (1.2.0 device run): a text with `if` is never drawn; divs with `if` and `else` are. */
const HML = readFileSync(path.join(PAGE, 'index.hml'), 'utf8');
function tree(src) {
  const root = { kids: [] }, stack = [root];
  for (const m of src.matchAll(/<(\/?)(\w+)([^>]*)>|([^<]+)/g)) {
    if (m[4] !== undefined) { if (m[4].trim()) stack.at(-1).kids.push({ text: m[4] }); continue; }
    if (m[1]) { stack.pop(); continue; }
    const node = { tag: m[2], attrs: Object.fromEntries([...m[3].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((a) => [a[1], a[2] ?? ''])), kids: [] };
    stack.at(-1).kids.push(node);
    stack.push(node);
  }
  return root;
}
/** The page data paint() leaves for a view, from the real index.js with a fake link. */
function pageData(v) {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let io;
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, {}, {}, '', '', (x) => { io = x; return { start() {}, tick() {}, show() {}, view: () => v }; }, () => 'b', () => 0);
  const page = { ...def.data };
  def.onInit.call(page);
  io.paint();
  return page;
}
function lines(v) {
  const d = pageData(v), out = [];
  const b = (k) => (typeof d[k] === 'boolean' ? d[k] : assert.fail(`if {{${k}}} is ${JSON.stringify(d[k])}, not a boolean: C4 review`)); const cond = (c) => { const m = /^\{\{(!?)(\w+)(?:==(\d+))?\}\}$/.exec(c); const x = m[3] !== undefined ? d[m[2]] == +m[3] : m[1] ? !!d[m[2]] : b(m[2]); return m[1] ? !x : x; };
  const walk = (node) => {
    let last = true;
    for (const n of node.kids) {
      if (n.text !== undefined) { out.push(n.text.replace(/\{\{(\w+)\}\}/g, (_, k) => d[k])); continue; }
      if (n.tag === 'text' && ('if' in n.attrs || 'elif' in n.attrs || 'else' in n.attrs)) { last = false; continue; }
      const on = 'if' in n.attrs ? cond(n.attrs.if) : 'else' in n.attrs ? !last : true;
      if ('if' in n.attrs) last = on;
      if (on) walk(n);
    }
  };
  walk(tree(HML));
  return out;
}

test('L1 offline, Complete moves to the next set of set and nx at once, with its own id, rev and values; Phone not connected only with nothing left', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  offline(r);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'sp', 'l2', 'la', 'can']), { sc: 1, off: 1, sp: 'SET 2 OF 5', l2: '60 kg x 8', la: 'Last time 57.5 kg x 8', can: true });
  const taps = [];
  for (const want of [['SET 3 OF 5', '62.5 kg x 8'], ['SET 4 OF 5', '62.5 kg x 6'], ['SET 5 OF 5', '65 kg x 5']]) {
    r.link.effort(3);
    taps.push(r.now());
    r.link.complete();
    assert.deepEqual(only(r.v(), ['sc', 'off', 'sp', 'l2', 'la', 'can', 'cl', 'e3']), { sc: 1, off: 1, sp: want[0], l2: want[1], la: '', can: true, cl: 'Complete set', e3: '#232428' },
      'the next set, ready at once, with no effort carried over');
    assert.ok(lines(r.v()).includes('Phone not connected'), 'the offline header is drawn');
    r.tick(); r.tick();
    assert.deepEqual(only(r.v(), ['sc', 'rc', 'ns']), { sc: 2, rc: '1:28', ns: `Set ${want[0].slice(4, 5)} of 5, ${want[1]}` }, 'its local rest');
    r.adv(88000);
    assert.equal(r.v().sc, 6, 'Rest done');
    r.link.ok();
  }
  taps.push(r.now());
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'na', 'cl']), { sc: 4, na: '4 actions', cl: `Pending ${hms(r.now())}` }, 'nothing left: Phone not connected');
  assert.deepEqual(r.store.map.get('m2q'), '0123');
  assert.ok(r.cmds().every((c) => c.commandId === 'abcd1234-1'), 'one command in flight, oldest first');
  // The phone comes back: each result frees the next, and every set goes in its order with its tap time.
  r.link.rx(snap());
  for (let i = 1; i <= 4; i++) r.link.rx(res(`abcd1234-${i}`));
  const firsts = [...new Map(r.cmds().map((c) => [c.commandId, c])).values()];
  assert.deepEqual(firsts.map((c) => [c.setId, c.expectedRev, c.load.value, c.reps, c.actionAt]), [
    ['set_b2', 1, 60, 8, taps[0]], ['set_b3', 0, 62.5, 8, taps[1]], ['set_b4', 2, 62.5, 6, taps[2]], ['set_b5', 0, 65, 5, taps[3]]]);
  assert.equal(r.store.map.get('m2q'), '-');
  // Two results before the phone's next snap: the rest after them names the second set.
  const b = await rig({ code: null });
  b.link.rx(snap());
  offline(b);
  b.link.complete();
  b.link.complete();
  b.link.rx(snap());
  b.link.rx(res('abcd1234-1'));
  b.link.rx(res('abcd1234-2'));
  b.link.rx(snap({ si: 4, set: { ...S2, id: 'set_b4', rev: 2 }, nx: NX.slice(2), rest: { id: 'rest_9', left: 80000, tot: 90000, p: false } }));
  assert.deepEqual(only(b.v(), ['sc', 'sl']), { sc: 2, sl: 'Set 3 saved' });
});

test('L1 online, the next set is ready before the result; the result and the phone moving on keep it; a saved set stays locked', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'off', 'sp', 'l2', 'can']), { sc: 1, off: 0, sp: 'SET 3 OF 5', l2: '62.5 kg x 8', can: true });
  r.link.rx(res('abcd1234-1'));
  assert.deepEqual(only(r.v(), ['sp', 'l2', 'can', 'st']), { sp: 'SET 3 OF 5', l2: '62.5 kg x 8', can: true, st: 'Saved' });
  r.link.rx(snap({ si: 3, set: { ...S2, id: 'set_b3', rev: 0, w: 62.5 }, nx: NX.slice(1) }));
  assert.deepEqual(only(r.v(), ['sp', 'l2', 'can']), { sp: 'SET 3 OF 5', l2: '62.5 kg x 8', can: true }, 'the phone confirms it');
  // A stale snap that still lists the saved set does not unlock it.
  r.link.rx(snap());
  assert.deepEqual(only(r.v(), ['sp', 'l2', 'can']), { sp: 'SET 3 OF 5', l2: '62.5 kg x 8', can: true });
  // A refusal frees its set again, with its own effort, not the draft of the set after it.
  const f = await rig({ code: null });
  f.link.rx(snap());
  f.link.effort(3);
  f.link.complete();
  f.link.effort(1);
  assert.equal(f.v().e1, AC);
  f.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  assert.deepEqual(only(f.v(), ['sp', 'e1', 'e3', 'st']), { sp: 'SET 2 OF 5', e1: PL, e3: PL, st: 'Changed on phone' });
  // Without nx (an older phone) it stays as in 1.2.0: the sent set with its Pending until the phone moves on.
  const o = await rig({ code: null });
  o.link.rx(snap({ nx: undefined }));
  o.link.complete();
  assert.deepEqual(only(o.v(), ['sp', 'can', 'cl']), { sp: 'SET 2 OF 5', can: false, cl: `Pending ${hms(T0)}` });
  o.link.rx(res('abcd1234-1'));
  o.link.rx(snap({ nx: undefined }));
  assert.equal(o.v().can, false, 'saved, locked until the phone moves on');
});

test('L1 up to 8 queued: rest taps and sets fill the outbox, the 9th action shows Queue full, drops nothing and stays on its set', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 90000 } }));
  offline(r);
  for (let i = 0; i < 4; i++) r.link.rest('rest_add_30');
  r.link.rest('rest_skip');
  assert.equal(r.v().sc, 1, 'the skipped rest leaves Rest at once, offline too');
  for (let i = 0; i < 3; i++) r.link.complete();
  assert.equal(r.store.map.get('m2q'), '01234567');
  assert.deepEqual(only(r.v(), ['sc', 'sp', 'can']), { sc: 1, sp: 'SET 5 OF 5', can: true });
  const before = [...r.store.map.entries()];
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'sp', 'can', 'st']), { sc: 1, sp: 'SET 5 OF 5', can: true, st: 'Queue full' });
  assert.deepEqual([...r.store.map.entries()], before);
});

test('L1 a pick advances only through its row: its set, then locked until the plan moves on; the shown exercise through nx; offline, Phone not connected', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.pick(1);
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'nm', 'sp', 'can', 'cl']), { sc: 1, nm: 'Chest press', sp: 'SET 1 OF 3', can: false, cl: `Pending ${hms(T0)}` }, 'not the bench sets');
  r.link.pick(0);
  r.link.complete();
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'can']), { nm: 'Bench press', sp: 'SET 3 OF 5', can: true }, 'the bench advances through its nx');
  r.link.pick(1);
  r.link.rx(res('abcd1234-1'));
  r.link.rx(plan({ rows: [ROWS[0], { ...ROWS[1], d: 1, set: { ...ROWS[1].set, id: 'set_c2' } }, ROWS[2]] }));
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'can']), { nm: 'Chest press', sp: 'SET 2 OF 3', can: true });
  offline(r);
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'na']), { sc: 4, na: '2 actions' });
  assert.deepEqual([...r.store.map.get('m2q')].map((i) => r.store.map.get(`m2q${i}`).split(',')[4]), ['set_b2', 'set_c2']);
});

test('L1 a bad nx, rs or st refuses the snap as a whole, as any bad snap is', async () => {
  const obj = { toString: 1, valueOf: 1 };
  const r = await rig({ code: null });
  r.link.rx(snap({ nx: [NX[0]] }));
  const before = r.v();
  for (const o of [{ nx: 'x' }, { nx: { 0: NX[0], length: 1 } }, { nx: [NX[0], 'set_b4'] }, { nx: [[5, 0, 60, 8]] }, { nx: [['set_b3', '0', 60, 8]] },
    { nx: [['set_b3', 0, obj, 8]] }, { nx: [['set_b3', 0, 60, '8']] }, { nx: [null] }, { rs: '90' }, { rs: obj }, { set: { ...S2, st: '2.5' } }, { set: { ...S2, st: obj } }]) {
    assert.doesNotThrow(() => r.link.rx(snap({ ex: 'Row', ...o })), JSON.stringify(o));
    assert.deepEqual(r.v(), before, JSON.stringify(o));
  }
  // and nothing throws on the taps after one
  assert.doesNotThrow(() => { r.link.adj(); r.link.next('up'); r.link.adj(0); r.link.complete(); r.link.complete(); r.tick(); });
  assert.equal(r.store.map.get('m2q'), '01', 'the snap\'s set, then its nx');
  assert.deepEqual(r.cmds().map((c) => c.setId), ['set_b2']);
});

test('L2 a local rest of rs seconds after a Complete when no phone rest comes within 2 ticks; its +30 s and Skip send nothing; a phone rest replaces it', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.tick();
  assert.equal(r.v().sc, 1, 'one tick: not yet');
  r.tick();
  assert.deepEqual(only(r.v(), ['sc', 'rc', 'nx', 'ns']), { sc: 2, rc: '1:28', nx: 'Next: Bench press', ns: 'Set 3 of 5, 62.5 kg x 8' }, 'counted from the tap');
  const n = r.cmds().length;
  r.link.rest('rest_add_30');
  assert.equal(r.v().rc, '1:58');
  r.link.rest('rest_skip');
  assert.equal(r.v().sc, 1);
  assert.equal(r.cmds().length, n, 'nothing sent');
  // The phone's rest, after the 2 ticks, replaces it; its old ended rest does not.
  const p = await rig({ code: null });
  p.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  p.link.complete();
  p.tick(); p.tick();
  p.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  assert.deepEqual(only(p.v(), ['sc', 'rc']), { sc: 2, rc: '1:28' });
  p.link.rx(snap({ rest: { id: 'rest_2', left: 80000, tot: 90000, p: false } }));
  assert.deepEqual(only(p.v(), ['sc', 'rc']), { sc: 2, rc: '1:20' });
  p.link.rest('rest_skip');
  assert.match(p.store.map.get('m2q1'), /^s,abcd1234-2,s_1,\d+,rest_2,/, 'the phone rest is the phone\'s: Skip is queued');
  // A +30 s on the phone's old rest within the 2 ticks keeps the local rest coming; a new session ends it.
  const a = await rig({ code: null });
  a.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  a.link.complete();
  a.link.rest('rest_add_30');
  a.tick(); a.tick();
  assert.deepEqual(only(a.v(), ['sc', 'rc']), { sc: 2, rc: '1:28' });
  a.link.rx(snap({ sid: 's_2', rest: null }));
  assert.deepEqual(only(a.v(), ['sc', 'rc']), { sc: 1, rc: undefined });
  // A phone rest within 2 ticks: no local rest at all; rs 0 (auto rest off): none.
  for (const [o, rest] of [[{}, { id: 'rest_3', left: 89000, tot: 90000, p: false }], [{ rs: 0 }, null]]) {
    const q = await rig({ code: null });
    q.link.rx(snap(o));
    q.link.complete();
    q.tick();
    q.link.rx(snap({ ...o, rest }));
    q.tick(); q.tick();
    assert.deepEqual(only(q.v(), ['sc', 'rc']), rest ? { sc: 2, rc: '1:27' } : { sc: 1, rc: undefined }, JSON.stringify(o));
  }
});

test('L2 Rest done at 0: one long vibration per rest, OK goes back to Set and sends nothing; Skip during the countdown still sends rest_skip', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  for (let i = 0; i < 4; i++) r.tick();
  assert.deepEqual(only(r.v(), ['sc', 'rc']), { sc: 2, rc: '0:01' });
  assert.equal(r.buzz, 0);
  r.tick();
  assert.deepEqual(only(r.v(), ['sc', 'nx', 'ns']), { sc: 6, nx: 'Next: Bench press', ns: 'Set 2 of 5, 60 kg x 8' });
  assert.deepEqual(lines(r.v()).slice(2), ['Rest done', 'Next: Bench press', 'Set 2 of 5, 60 kg x 8', 'OK']);
  for (let i = 0; i < 5; i++) r.tick();
  r.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  assert.deepEqual([r.v().sc, r.buzz], [6, 1], 'once');
  const sent = r.sent.length;
  r.link.ok();
  assert.equal(r.v().sc, 1);
  r.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  assert.equal(r.v().sc, 1, 'OK is remembered');
  assert.equal(r.sent.filter((x) => JSON.parse(x).k === 'cmd').length, 0);
  assert.ok(r.sent.length === sent || r.sent.slice(sent).every((x) => JSON.parse(x).k === 'hello'), 'OK sends nothing');
  // the next rest rings once too; a local rest as well
  r.link.rx(snap({ rest: { ...rest1, id: 'rest_2' } }));
  for (let i = 0; i < 6; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [6, 2]);
  r.link.ok();
  r.link.complete();
  for (let i = 0; i < 92; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [6, 3]);
  // A Skip's write changes the screen (Rest to Set): that paint runs on a fresh stack, no deeper than a paint from a
  // message (the model's C3 workout overflowed a 14 KB stack 18 times without it).
  const d = await rig({ code: null });
  d.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  d.depths.length = 0;
  d.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  const fromRx = Math.max(...d.depths);
  d.depths.length = 0;
  d.link.rest('rest_skip');
  assert.equal(d.v().sc, 1);
  assert.ok(Math.max(...d.depths) <= fromRx + 1, `${d.depths} against ${fromRx}`);
  // An ended rest never seen counting: no Rest done, no vibration.
  const e = await rig({ code: null });
  e.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  e.tick();
  assert.deepEqual([e.v().sc, e.buzz], [1, 0]);
  // Skip during the countdown: rest_skip is sent, the rest leaves at once, and it never rings, though a later snap shows it at 0.
  const s = await rig({ code: null });
  s.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  offline(s);
  s.link.rest('rest_skip');
  assert.deepEqual(only(s.cmds()[0], ['kind', 'restId']), { kind: 'rest_skip', restId: 'rest_1' });
  assert.equal(s.v().sc, 1);
  s.adv(60000);
  s.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  s.tick();
  assert.deepEqual([s.v().sc, s.buzz], [1, 0]);
});

// WATCH-C4 spec change: Adjust steps the load by 1 (not st, 2.5 kg or 5 lb) and left is the previous of three fields, so the
// values below are the C4 ones; c4.test.mjs L6 covers the decimals field.
test('L3 Adjust: a tap on the value; steps by 1 (C4), and reps by 1; clamps; 2 decimals; swipes step and switch the field, never page', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ set: { ...S2, st: 1.25 } }));
  r.link.rx(plan());
  r.link.adj();
  assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'KG', av: '60' });
  assert.deepEqual(lines(r.v()).slice(2), ['KG', '60', '-', '+', 'Done']);
  r.link.adj(1);
  r.link.next('up');
  assert.equal(r.v().av, '62', 'by 1, st 1.25 unused (C4)');
  r.link.next('down');
  r.link.adj(-1);
  r.link.adj(-1);
  assert.deepEqual(only(r.v(), ['sc', 'av']), { sc: 7, av: '59' }, 'no page turn');
  r.link.next('left');
  assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'REPS', av: '8' });
  for (const d of [undefined, '', 'x', null, 0, { toString: 1 }]) {
    r.link.next(d);
    assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'REPS', av: '8' }, `${JSON.stringify(d)}: other directions do nothing`);
  }
  for (let i = 0; i < 120; i++) r.link.next('up');
  assert.equal(r.v().av, '100');
  for (let i = 0; i < 120; i++) r.link.adj(-1);
  assert.equal(r.v().av, '1');
  r.link.adj(1);
  r.link.next('right');
  assert.equal(r.v().ak, 'KG');
  r.link.adj(0);
  assert.deepEqual(only(r.v(), ['sc', 'l2', 'sp']), { sc: 1, l2: '59 kg x 2', sp: 'SET 2 OF 5' });
  r.link.next('up');
  assert.equal(r.v().sc, 3, 'Done: swipes page again');
  // Not on a set that is pending: a refusal that frees it later does not open Adjust.
  const p = await rig({ code: null });
  p.link.rx(snap({ nx: [] }));
  p.link.complete();
  p.link.adj();
  assert.equal(p.v().sc, 1);
  p.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  assert.deepEqual(only(p.v(), ['sc', 'can']), { sc: 1, can: true });
  // C4: by 1 kg or 1 lb; the load stays above 0 and at most 1000; 2 decimals (0.14 + 1 would leave 1.1400000000000001).
  for (const [set, steps, want] of [[{ st: undefined }, 1, '61'], [{ u: 'lb', w: 135, st: undefined }, -1, '134'], [{ w: 2.5, st: undefined }, -1, '1.5'],
    [{ w: 1, st: 2.5 }, -3, '1'], [{ w: 997.5, st: undefined }, 3, '1000'], [{ w: 0.14, st: 0.1 }, 1, '1.14'], [{ w: 996.75, st: 0.1 }, 3, '999.75'],
    [{ w: null, st: undefined }, 1, '1'], [{ w: null, st: undefined }, -1, '-']]) {
    const a = await rig({ code: null });
    a.link.rx(snap({ set: { ...S2, ...set } }));
    a.link.adj();
    a.link.next(set.w === null ? 'right' : 'up'); // C4: right is REPS to KG (left is now DECIMALS)
    a.link.next('down');
    for (let i = 0; i < Math.abs(steps); i++) a.link.adj(Math.sign(steps));
    assert.deepEqual(only(a.v(), ['ak', 'av']), { ak: set.u === 'lb' ? 'LB' : 'KG', av: want }, JSON.stringify(set));
  }
});

test('L3 the draft lives in memory, tied to its set id and rev; Complete sends it; the outbox slot stays under 120 characters', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.adj();
  r.link.adj(1);
  r.link.next('left');
  r.link.adj(1);
  r.link.adj(0);
  assert.equal(r.v().l2, '61 kg x 9'); // C4: by 1 (was 62.5 by st)
  r.link.rx(snap({ srev: 4 }));
  assert.equal(r.v().l2, '61 kg x 9', 'the same set id and rev: kept');
  r.link.rx(snap({ srev: 4, si: 3, set: { ...S2, id: 'set_b3' }, nx: NX.slice(1) }));
  assert.equal(r.v().l2, '60 kg x 8', 'another set with the same rev: not its draft');
  r.link.rx(snap({ srev: 4 }));
  r.link.adj();
  r.link.rx(snap({ srev: 5, set: { ...S2, rev: 2 } }));
  assert.deepEqual(only(r.v(), ['sc', 'l2']), { sc: 1, l2: '60 kg x 8' }, 'a new rev: the phone\'s values, and Adjust closes');
  r.link.adj();
  r.link.next('up');
  r.link.rx(snap({ srev: 6, si: 3, set: { ...S2, id: 'set_b3', rev: 0 }, nx: NX.slice(1) }));
  assert.equal(r.v().sc, 1, 'the phone moved on: Adjust closes');
  r.link.rx(snap({ srev: 5, set: { ...S2, rev: 2 } }));
  assert.deepEqual(only(r.v(), ['sc', 'l2']), { sc: 1, l2: '61 kg x 8' }, 'a stale snap brings back the draft value, not Adjust');
  r.link.complete();
  assert.deepEqual(only(r.cmds()[0], ['setId', 'expectedRev', 'load', 'reps']), { setId: 'set_b2', expectedRev: 2, load: { value: 61, unit: 'kg' }, reps: 8 });
  assert.deepEqual([...r.store.map.keys()].filter((k) => !/^m2[qr]\d?$/.test(k)), [], 'nothing else stored');
  // The longest values at the phone's id lengths (tests/watch-contract.test.ts): rev 99999, 102.5 or 999.75 reached by 1 steps (C4), 100 reps.
  const sid = `s_${'z'.repeat(8)}_${'z'.repeat(6)}`, id = `set_${'z'.repeat(8)}_${'z'.repeat(6)}`;
  for (const w of [99.5, 996.75]) {
    const a = await rig({ code: null, boot: 'zzzzzzzz' });
    a.link.rx(snap({ sid, set: { ...S2, id, rev: 99999, w, r: 99, e: 'ideal', st: 0.1 } }));
    a.link.adj();
    for (let i = 0; i < 3; i++) a.link.adj(1);
    a.link.next('left');
    a.link.adj(1);
    a.link.adj(0);
    a.link.complete();
    assert.match(a.v().st, /^Pending /, String(w));
    const value = a.store.map.get('m2q0');
    assert.ok(value.length + 4 < 120, `${value.length} characters, and 4 more for a sequence of 99999`);
    assert.deepEqual(only(a.cmds()[0], ['load', 'reps']), { load: { value: Math.round((w + 3) * 100) / 100, unit: 'kg' }, reps: 100 });
  }
});

// WATCH-C4 spec change: the bpm moves from the Set and Rest lines to the header (hm), and Rest has -15 s and +15 s.
test('L4 heart rate: "128 bpm" in the header (C4), "Allow Body sensors" on 602, blank after 15 s without a sample; never in a message or in storage', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.beat(127.6);
  assert.deepEqual(only(r.v(), ['hm', 'hr']), { hm: '128 bpm', hr: '' });
  assert.deepEqual([lines(r.v())[0], lines(r.v()).at(-1)], ['128 bpm', ''], 'Set: the header; the status line is free');
  r.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  assert.deepEqual([lines(r.v())[0], ...lines(r.v()).slice(-5)], ['128 bpm', 'Change', '-15 s', '+15 s', 'Skip', '']);
  for (let i = 0; i < 15; i++) r.tick();
  assert.equal(r.v().hm, '128 bpm');
  r.tick();
  assert.deepEqual(only(r.v(), ['hm', 'hr']), { hm: 'M/ARC', hr: '' }, 'no sample for 16 s');
  r.link.beat(-602);
  for (let i = 0; i < 30; i++) r.tick();
  assert.equal(r.v().hr, 'Allow Body sensors');
  r.link.beat(-5);
  assert.equal(r.v().hr, '');
  r.link.beat(72);
  r.link.complete();
  r.link.rest('rest_add_30');
  r.link.show();
  r.link.rx(res('abcd1234-1'));
  for (const x of [...r.sent, ...r.store.map.values()]) assert.doesNotMatch(x, /bpm|72|heart/i, x);
});

test('L4 page hooks: the heart rate is subscribed with keep-on, its samples and 602 go to the link, unsubscribed on destroy; the buzz is one long vibration', () => {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  const calls = [], beats = [];
  let io, sub;
  const sensor = { subscribeHeartRate: (o) => { calls.push('sub'); sub = o; }, unsubscribeHeartRate: (...a) => { calls.push(`unsub ${a.length}`); } };
  const vibrator = { vibrate: (o) => { calls.push(`vibrate ${o.mode}`); } };
  const link = { start() {}, tick() {}, show() {}, die() {}, view: () => ({ sc: 0 }), beat: (x) => beats.push(x) };
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', 'clearInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, vibrator, sensor, '', '', (x) => { io = x; return link; }, () => 'b', () => 0, () => {});
  const page = { ...def.data };
  def.onInit.call(page);
  io.keep(true);
  assert.deepEqual(calls, ['unsub 0', 'sub'], 'red team R9: unsubscribe first');
  sub.success({ heartRate: 128 });
  sub.fail('Permission not declared', 602);
  sub.success(undefined);
  assert.deepEqual(beats, [128, -602, undefined]);
  io.buzz();
  def.onDestroy.call(page);
  assert.deepEqual(calls, ['unsub 0', 'sub', 'vibrate long', 'unsub 0']);
  // A sensor or vibrator that throws is caught.
  const bad = { subscribeHeartRate() { throw new Error('x'); }, unsubscribeHeartRate() { throw new Error('x'); }, vibrate() { throw new Error('x'); } };
  const def2 = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', 'clearInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, bad, bad, '', '', (x) => { io = x; return link; }, () => 'b', () => 0, () => {});
  def2.onInit.call({ ...def2.data });
  assert.doesNotThrow(() => { io.keep(true); io.buzz(); io.keep(false); });
});

test('L5 no if, elif or else on a text; the Phone not connected title and Pending are in the drawn lines', async () => {
  const texts = [...HML.matchAll(/<text\b[^>]*>/g)].map((m) => m[0]);
  assert.ok(texts.length > 40);
  for (const t of texts) assert.doesNotMatch(t, /\s(if|elif|else)\b/, t);
  const r = await rig({ code: null });
  r.link.rx(snap({ nx: [] }));
  r.link.complete();
  offline(r);
  assert.equal(r.v().sc, 4);
  assert.deepEqual(lines(r.v()), ['Phone not connected', '1 action', 'Pending', 'Rest 1:04', 'Open M/ARC', 'on your phone'], 'with its local rest');
  r.link.rx(snap({ nx: [] }));
  assert.deepEqual(lines(r.v()).slice(0, 2), ['M/ARC', r.v().ck], 'online: the header row');
});

// C3 review (2026-10-17): a double tap on Complete, a set the phone reopens, the phone's answer and the local rest,
// the cap of the saved-set lock list.
test('R1 a second Complete tap within 1 s is a double tap and is ignored; from 1 s on it logs the next set', () => {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let n = 0, t = Date.UTC(2026, 9, 17, 10, 0, 0);
  const link = { start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }), complete: () => { n++; } };
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', 'Date', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, {}, {}, '', '', () => link, () => 'b', () => 0, { now: () => t });
  const page = { ...def.data };
  def.onInit.call(page);
  const t0 = t;
  const got = [0, 150, 999, 1000, 1400, 2400, 500].map((d) => { t = t0 + d; def.onComplete.call(page); return n; });
  assert.deepEqual(got, [1, 1, 1, 2, 2, 3, 4], 'taps 150 ms and 999 ms after a logged one are ignored; a clock set back logs');
});

test('R2 a saved set stays locked at the rev it was sent with; the phone reopening it (a higher rev) frees it', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snap());
  assert.equal(r.v().sp, 'SET 3 OF 5', 'a stale snap: still locked');
  r.link.rx(snap({ set: { ...S2, rev: 3 } }));
  assert.deepEqual(only(r.v(), ['sp', 'l2', 'can']), { sp: 'SET 2 OF 5', l2: '60 kg x 8', can: true });
  r.tick(); r.tick();
  r.link.complete();
  assert.deepEqual(only(r.cmds().at(-1), ['setId', 'expectedRev']), { setId: 'set_b2', expectedRev: 3 });
});

test("R3 online, the phone's answer decides the rest: its result, then a snap with no new rest, end the local rest; the phone's old rest stays", async () => {
  const b3 = { si: 3, set: { ...S2, id: 'set_b3', rev: 0, w: 62.5 }, nx: NX.slice(1) };
  // a warm-up or a late set: the phone starts no rest
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snap(b3));
  for (let i = 0; i < 95; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [1, 0], 'no rest, no Rest done');
  // the phone's earlier rest, still running, is what the watch shows
  const o = await rig({ code: null });
  o.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  o.link.complete();
  o.link.rx(res('abcd1234-1'));
  o.link.rx(snap({ ...b3, rest: { ...rest1, left: 59000 } }));
  o.tick(); o.tick(); o.tick();
  assert.deepEqual(only(o.v(), ['sc', 'rc']), { sc: 2, rc: '0:56' });
  // the result without its snap (lost): the local rest still runs
  const l = await rig({ code: null });
  l.link.rx(snap());
  l.link.complete();
  l.link.rx(res('abcd1234-1'));
  l.tick(); l.tick();
  assert.deepEqual(only(l.v(), ['sc', 'rc']), { sc: 2, rc: '1:28' });
});

test('R4 the lock list keeps the 16 newest saved sets: two saved, a stale snap listing both leaves both locked', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.tick(); r.tick();
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(res('abcd1234-2'));
  r.link.rx(snap());
  assert.deepEqual(only(r.v(), ['sp', 'l2']), { sp: 'SET 4 OF 5', l2: '62.5 kg x 6' });
});

// C3 red team (2026-10-17): +30 s on the phone's rest shows at once and a refused rest command is silent; a draft keeps
// its unit; a phone rest after a rung local rest rings no more; nx numbers; one heart-rate subscription.
test('R5 a queued +30 s shows on the phone rest at once; a rest command refused later (its rest ended) is silent and the batch ends Saved', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  offline(r);
  assert.equal(r.v().rc, '0:34');
  r.link.rest('rest_add_30');
  assert.equal(r.v().rc, '1:04');
  r.link.rest('rest_add_30');
  assert.equal(r.v().rc, '1:34');
  r.link.rest('rest_skip');
  r.link.ok();
  r.link.complete();
  r.link.rx(snap());
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_rest' }));
  r.link.rx(res('abcd1234-2', { status: 'rejected', reason: 'stale_rest' }));
  r.link.rx(res('abcd1234-3', { status: 'rejected', reason: 'stale_rest' }));
  r.link.rx(res('abcd1234-4'));
  assert.equal(r.v().st, 'Saved');
});

test('R6 an Adjust draft is tied to the unit too: the phone showing the same set in lb drops it, and Complete sends the lb values', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.adj(); r.link.adj(1); r.link.adj(1); r.link.adj(0);
  assert.equal(r.v().l2, '62 kg x 8'); // C4: by 1 (was 65 by st)
  r.link.rx(snap({ set: { ...S2, w: 135, u: 'lb', st: 5 }, nx: [] }));
  assert.equal(r.v().l2, '135 lb x 8');
  r.link.complete();
  assert.deepEqual(r.cmds().at(-1).load, { value: 135, unit: 'lb' });
});

test('R7 a local rest that rang and was OKed: the phone rest that replaces it rings no more and shows no second Rest done', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  offline(r);
  r.link.complete();
  for (let i = 0; i < 92; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [6, 1]);
  r.link.ok();
  // the phone applies the queued Complete: its result, then the snap with that set's rest (last red team: the result first)
  r.link.rx(snap());
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snap({ si: 3, set: { ...S2, id: 'set_b3', rev: 0, w: 62.5 }, nx: NX.slice(1), rest: { id: 'rest_7', left: 3000, tot: 90000, p: false } }));
  for (let i = 0; i < 5; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [1, 1]);
  // not rung yet (no OK either): the phone rest takes over and rings once
  const n = await rig({ code: null });
  n.link.rx(snap());
  offline(n);
  n.link.complete();
  n.tick(); n.tick();
  n.link.rx(snap({ rest: { id: 'rest_8', left: 3000, tot: 90000, p: false } }));
  for (let i = 0; i < 4; i++) n.tick();
  assert.deepEqual([n.v().sc, n.buzz], [6, 1]);
});

test('R8 a next set carries its set number (5th of nx), so a set done on the phone in between keeps the numbering; a bad one refuses the snap', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ nx: [['set_b3', 0, 62.5, 8, 3], ['set_b5', 0, 65, 5, 5]] }));
  r.link.complete();
  assert.equal(r.v().sp, 'SET 3 OF 5');
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sp', 'l2']), { sp: 'SET 5 OF 5', l2: '65 kg x 5' });
  const b = await rig({ code: null });
  b.link.rx(snap());
  const before = b.v();
  for (const x of ['4', { toString: 1, valueOf: 1 }, 2.5, 0]) {
    assert.doesNotThrow(() => b.link.rx(snap({ ex: 'Row', nx: [['set_b4', 0, 60, 8, x]] })));
    assert.deepEqual(b.v(), before, JSON.stringify(x));
  }
});

test('R9 the heart rate has one subscription: each keep-on unsubscribes before it subscribes', () => {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let io, live = 0, most = 0;
  const sensor = { subscribeHeartRate: () => { most = Math.max(most, ++live); }, unsubscribeHeartRate: () => { live = 0; } };
  const link = { start() {}, tick() {}, show() {}, die() {}, view: () => ({ sc: 0 }) };
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', 'clearInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, {}, sensor, '', '', (x) => { io = x; return link; }, () => 'b', () => 0, () => {});
  def.onInit.call({ ...def.data });
  for (let i = 0; i < 4; i++) io.keep(true);
  assert.deepEqual([live, most], [1, 1]);
  def.onDestroy.call({});
  assert.equal(live, 0);
});

// C3 last red team (2026-10-17): the tap guard covers every tap that changes the screen; Set N saved by set number; a
// later phone rest still rings; a +30 s counted once online; Back in sync after a silent refusal; only stale_rest is
// silent; nx numbers within the exercise.
function pageWith(link, clock) {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'vibrator', 'sensor', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', 'Date', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, {}, {}, '', '', () => link, () => 'b', () => 0, { now: () => clock.t });
  const page = { ...def.data };
  def.onInit.call(page);
  return { def, page };
}
test('R10 a tap within 1 s of a tap that changed the screen (Complete, Done, OK, Skip) is the same finger: no Complete, +30 s or Skip from it', () => {
  const calls = [];
  const link = { start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }), complete: () => calls.push('c'), rest: (k) => calls.push(k), adj: (d) => calls.push(`adj ${d}`), ok: () => calls.push('ok') };
  const clock = { t: Date.UTC(2026, 9, 17, 10, 0, 0) };
  const { def, page } = pageWith(link, clock);
  const tap = (h, d = 0) => { clock.t += d; def[h].call(page); };
  tap('onDone'); tap('onComplete', 200);
  tap('onOk', 1000); tap('onComplete', 200);
  tap('onSkip', 1000); tap('onComplete', 200);
  tap('onComplete', 1000); tap('onAdd', 200); tap('onSkip', 100);
  assert.deepEqual(calls, ['adj 0', 'ok', 'rest_skip', 'c']);
  tap('onAdd', 1000); tap('onAdd', 200); tap('onComplete', 300);
  assert.deepEqual(calls.slice(4), ['rest_add_15', 'rest_add_15', 'c'], 'two +15 s in a row both count; +15 s does not change the screen'); // WATCH-C4: +15 s (was +30 s)
});

test('R11 Set N saved names the set number of a next set after a gap, when its result comes before the next snap', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ si: 3, set: { ...S2, id: 'set_b3', rev: 0 }, nx: [['set_b5', 0, 65, 5, 5]] }));
  r.link.complete();
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(res('abcd1234-2'));
  r.link.rx(snap({ si: 1, eid: 'e_row', ex: 'Row', set: { ...S2, id: 'set_r1', rev: 0 }, nx: [], rest: { id: 'rest_9', left: 90000, tot: 90000, p: false } }));
  assert.equal(r.v().sl, 'Set 5 saved');
});

test("R12 a rung, OKed local rest: a phone rest for a later set (logged on the phone) still rings once and shows Rest done", async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  offline(r);
  r.link.complete();
  for (let i = 0; i < 92; i++) r.tick();
  r.link.ok();
  r.link.rx(snap({ si: 4, set: { ...S2, id: 'set_b4', rev: 2 }, nx: NX.slice(2), rest: { id: 'rest_x', left: 5000, tot: 90000, p: false } }));
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'already_committed' }));
  for (let i = 0; i < 8; i++) r.tick();
  assert.deepEqual([r.v().sc, r.buzz], [6, 2]);
});

test('R13 online, a +30 s waits for the phone: the snap with it applied shows it once, though its result is lost', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  r.link.rest('rest_add_30');
  r.link.rx(snap({ rest: { ...rest1, left: 90000 } }));
  assert.equal(r.v().rc, '1:30');
});

test('R14 a batch whose last result is a refused (stale) rest command ends on Back in sync, as an all-applied batch does', async () => {
  const mk = async (last) => {
    const r = await rig({ code: null });
    r.link.rx(snap({ rs: 0, rest: { ...rest1, left: 200000 } }));
    offline(r);
    r.link.complete();
    r.link.rest('rest_add_30');
    r.tick(); r.tick();
    r.link.rx(snap({ rs: 0, rest: null }));
    r.link.rx(res('abcd1234-1'));
    r.link.rx(res('abcd1234-2', last));
    return only(r.v(), ['sc', 'st', 'na']);
  };
  assert.deepEqual(await mk({ status: 'rejected', reason: 'stale_rest' }), await mk({}));
});

test('R15 only a stale rest command is silent: a rest command refused as unsupported still says Update needed', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 60000 } }));
  r.link.rest('rest_add_30');
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'unsupported' }));
  assert.equal(r.v().st, 'Update needed');
});

test('R16 a next set number must be a whole number after si and at most sn: null or above sn refuses the snap', async () => {
  const b = await rig({ code: null });
  b.link.rx(snap());
  const before = b.v();
  for (const x of [null, 6, 1e300]) {
    b.link.rx(snap({ ex: 'Row', nx: [['set_b4', 0, 60, 8, x]] }));
    assert.deepEqual(b.v(), before, JSON.stringify(x));
  }
  b.link.rx(snap({ ex: 'Row', nx: [['set_b5', 0, 60, 8, 5]] }));
  assert.equal(b.v().nm, 'Row', 'n = sn is fine');
});
