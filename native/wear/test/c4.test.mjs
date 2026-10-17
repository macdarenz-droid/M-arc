// WATCH-C4 acceptance L6 to L10 on the watch's own common/link.js and index page: Adjust by 1 with a decimals field,
// Rest -15 s and +15 s, the header heart, the idle screen and the Done trigger to pages/hl/hl. The phone's fin is faked
// from the card's shape. Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const JS = path.join(ROOT, 'native/wear/app/entry/src/main/js/default');
const PAGE = path.join(JS, 'pages/index');
const LINK = pathToFileURL(path.join(JS, 'common/link.js')).href;

const T0 = Date.UTC(2026, 9, 18, 10, 0, 0);
const G = '#3a3a40';
const two = (n) => String(n).padStart(2, '0');
const hm = (ms) => `${two(new Date(ms).getHours())}:${two(new Date(ms).getMinutes())}`;

const S2 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't', st: 2.5 };
const NX = [['set_b3', 0, 62.5, 8], ['set_b4', 2, 62.5, 6], ['set_b5', 0, 65, 5]];
const snap = (o = {}) => JSON.stringify({
  t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 5,
  set: S2, nx: NX, rs: 90, lt: { w: 57.5, u: 'kg', r: 8 }, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o,
});
const LINES = ['Best: Bench 65 kg x 5', '52 min, 18 sets', '6120 kg lifted', '5 exercises'];
const done = (o = {}) => snap({ sid: null, eid: null, ex: null, si: 0, sn: 0, set: null, nx: [], lt: null, fin: ['s_1', LINES], ...o });
const plan = () => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 4, st: 11,
  rows: [{ id: 'e_bench', ex: 'Bench press', d: 1, n: 5, set: S2, lt: null }, { id: 'e_curl', ex: 'Curl', d: 0, n: 3, set: null, lt: null }] });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });
const rest1 = { id: 'rest_1', left: 60000, tot: 90000, p: false };

/** @system.storage as in link.test.mjs: values under 128 bytes, plain keys; `hold` keeps every answer until released. */
const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
function store() {
  const map = new Map(), held = [];
  const s = {
    map, held, hold: false,
    set(o) { const go = () => { if (!/^[A-Za-z0-9_]{1,32}$/.test(o.key) || o.value === '' || Buffer.byteLength(String(o.value)) >= 128) return o.fail(); map.set(o.key, o.value); o.success(); }; s.hold ? held.push(go) : go(); },
    get(o) { const go = () => o.success(map.has(o.key) ? map.get(o.key) : o.default); s.hold ? held.push(go) : go(); },
  };
  return s;
}
/** A link with a fake clock, storage and radio; one tick runs per second the clock moves, before each call. */
async function rig(o = {}) {
  const { Link } = await import(LINK);
  let t = T0;
  const r = { sent: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store(), hls: [], buzz: 0 };
  const io = {
    store: r.store, now: () => t, keep: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); }, paint: () => {},
    send: (text, done) => { r.sent.push(text); if (r.code !== null) done(r.code); }, buzz: () => { r.buzz++; }, hl: (p) => { r.hls.push(p); },
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
  r.ticks = (n) => { for (let i = 0; i < n; i++) r.tick(); };
  r.v = () => r.link.view();
  r.cmds = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.link.start();
  return r;
}
const only = (v, keys) => Object.fromEntries(keys.map((k) => [k, v[k]]));
const offline = (r) => { r.adv(26000); r.link.tick(); };

/** index.js with fakes for its imports; `link` is the link its onInit gets. */
function loadPage(link, o = {}) {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let io;
  const env = {
    P2pClient: function () {}, Message: function () {}, Builder: function () {}, storage: {}, brightness: { setKeepScreenOn() {} },
    vibrator: {}, sensor: { subscribeHeartRate() {}, unsubscribeHeartRate() {} }, router: {}, PHONE_PKG: '', PHONE_FP: '',
    Link: (x) => { io = x; return link; }, makeBoot: () => 'b', setInterval: () => 0, clearInterval: () => {}, Date, ...o,
  };
  const names = Object.keys(env);
  const def = new Function(...names, src)(...names.map((n) => env[n]));
  const page = { ...def.data };
  def.onInit.call(page);
  return { def, page, io: () => io };
}

/** index.hml as the GT 6 draws it: a text with `if` is never drawn; divs with `if` and `else` are. */
const HML = readFileSync(path.join(PAGE, 'index.hml'), 'utf8');
const CSS = readFileSync(path.join(PAGE, 'index.css'), 'utf8');
function tree(src) {
  const root = { kids: [] }, stack = [root];
  for (const m of src.matchAll(/<(\/?)(\w+)([^>]*)>|([^<]+)/g)) {
    if (m[4] !== undefined) { if (m[4].trim()) stack.at(-1).kids.push({ text: m[4] }); continue; }
    if (m[1]) { stack.pop(); continue; }
    const node = { tag: m[2], attrs: Object.fromEntries([...m[3].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((a) => [a[1], a[2] ?? ''])), kids: [], up: stack.at(-1) };
    stack.at(-1).kids.push(node);
    stack.push(node);
  }
  return root;
}
const TREE = tree(HML);
/** The page data paint() leaves for a view, from the real index.js with a fake link. */
function pageData(v) {
  const p = loadPage({ start() {}, tick() {}, show() {}, view: () => v });
  p.io().paint();
  return p.page;
}
/** What the page draws for a view: its lines in order and the images with their src and bound animation-duration. */
function drawn(v) {
  const d = pageData(v), lines = [], images = [];
  const sub = (s) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => (k in d ? d[k] : assert.fail(`not page data: ${k}`)));
  // C4 review: the engine shows an if only for the boolean true (jerry_get_boolean_value), so a plain binding must be a boolean
  const b = (k) => (typeof d[k] === 'boolean' ? d[k] : assert.fail(`if {{${k}}} is ${JSON.stringify(d[k])}, not a boolean: the GT 6 draws only true`)); const cond = (c) => { const m = /^\{\{(!?)(\w+)(?:==(\d+))?\}\}$/.exec(c) ?? assert.fail(c); const x = m[3] !== undefined ? d[m[2]] == +m[3] : m[1] ? !!d[m[2]] : b(m[2]); return m[1] ? !x : x; };
  const walk = (node) => {
    let last = true;
    for (const n of node.kids) {
      if (n.text !== undefined) { lines.push(sub(n.text)); continue; }
      if (n.tag === 'text' && ('if' in n.attrs || 'elif' in n.attrs || 'else' in n.attrs)) { last = false; continue; }
      const on = 'if' in n.attrs ? cond(n.attrs.if) : 'else' in n.attrs ? !last : true;
      if ('if' in n.attrs) last = on;
      if (!on) continue;
      if (n.tag === 'image') images.push({ src: sub(n.attrs.src), style: sub(n.attrs.style ?? '') });
      walk(n);
    }
  };
  walk(TREE);
  return { lines, images, d };
}
const find = (node, f) => { for (const n of node.kids ?? []) { if (n.tag && f(n)) return n; const x = n.tag && find(n, f); if (x) return x; } };
const rules = Object.fromEntries([...CSS.matchAll(/\.([\w-]+)\{([^}]*)\}/g)].map((m) => [m[1], m[2]]));
const colourOf = (cls) => cls.split(' ').map((c) => /(?:^|;)color:(#[0-9a-f]{6})/.exec(rules[c] ?? '')).filter(Boolean).map((m) => m[1]);

// ---------------------------------------------------------------------------------------------------------------
// L6 Adjust

test('L6 Adjust KG: by 1 from any start (59, 60, 61, ...), keeping the decimals; st is not used; above 0 and at most 1000; lb', async () => {
  const at = async (set) => { const a = await rig({ code: null }); a.link.rx(snap({ set: { ...S2, ...set } })); a.link.adj(); return a; };
  const r = await at({ w: 59 });
  assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'KG', av: '59' });
  const seen = [];
  for (let i = 0; i < 3; i++) { r.link.adj(1); seen.push(r.v().av); }
  r.link.next('up'); seen.push(r.v().av);
  r.link.next('down'); seen.push(r.v().av);
  r.link.adj(-1); seen.push(r.v().av);
  assert.deepEqual(seen, ['60', '61', '62', '63', '62', '61'], 'the pills and the swipes step by 1');
  for (const [set, steps, want] of [[{ w: 61.24 }, 1, '62.24'], [{ w: 61.24, st: 0.1 }, -2, '59.24'], [{ w: 102.5, st: 2.5 }, 1, '103.5'],
    [{ w: 1.5 }, -1, '0.5'], [{ w: 1.5 }, -2, '0.5'], [{ w: 0.25 }, -1, '0.25'], [{ w: 999.5 }, 1, '1000'], [{ w: 999.75 }, 1, '1000'], [{ w: 1000 }, 3, '1000'],
    [{ u: 'lb', w: 135, st: 5 }, 1, '136'], [{ w: null }, 0, '-']]) {
    const a = await at(set);
    if (set.w === null) a.link.next('right');
    for (let i = 0; i < Math.abs(steps); i++) a.link.adj(Math.sign(steps));
    assert.deepEqual(only(a.v(), ['ak', 'av']), { ak: set.u === 'lb' ? 'LB' : 'KG', av: want }, JSON.stringify(set));
  }
  const n = await at({ w: null });
  assert.deepEqual(only(n.v(), ['ak', 'av']), { ak: 'REPS', av: '8' }, 'no load: Adjust opens on reps');
  n.link.next('right');
  n.link.adj(-1);
  assert.equal(n.v().av, '-', 'no load stays none on -');
  n.link.adj(1);
  assert.equal(n.v().av, '1');
});

test('L6 Adjust DECIMALS: .00, .25, .50, .75 wrap without changing the whole number; 61.24 goes to 61.25 up and 61.00 down; 0 is refused', async () => {
  const at = async (w) => { const a = await rig({ code: null }); a.link.rx(snap({ set: { ...S2, w } })); a.link.adj(); a.link.next('right'); return a; };
  const r = await at(60);
  assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'DECIMALS', av: '60.00' });
  const up = [], down = [];
  for (let i = 0; i < 5; i++) { r.link.adj(1); up.push(r.v().av); }
  for (let i = 0; i < 5; i++) { r.link.next('down'); down.push(r.v().av); }
  assert.deepEqual(up, ['60.25', '60.50', '60.75', '60.00', '60.25']);
  assert.deepEqual(down, ['60.00', '60.75', '60.50', '60.25', '60.00']);
  for (const [w, d, want] of [[61.24, 1, '61.25'], [61.24, -1, '61.00'], [61.26, 1, '61.50'], [61.26, -1, '61.25'], [61.99, 1, '61.00'], [102.2, 1, '102.25'],
    [0.25, -1, '0.25'], [0.75, 1, '0.75'], [0.5, -1, '0.25'], [1000, 1, '1000.00'], [999.75, 1, '999.00']]) {
    const a = await at(w);
    a.link.adj(d);
    assert.equal(a.v().av, want, `${w} ${d}`);
  }
  // the whole and decimals fields together: 60, +1, .25 up, +1 gives 62.25
  const b = await at(60);
  b.link.next('left');
  b.link.adj(1);
  b.link.next('right');
  b.link.adj(1);
  b.link.next('left');
  b.link.adj(1);
  assert.deepEqual(only(b.v(), ['ak', 'av']), { ak: 'KG', av: '62.25' });
});

test('L6 Adjust fields: swipe right is the next field and left the previous, wrapping both ways; reps 1 to 100 by 1; other directions do nothing', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.adj();
  const go = (d) => { r.link.next(d); return r.v().ak; };
  assert.deepEqual(['right', 'right', 'right', 'right'].map(go), ['DECIMALS', 'REPS', 'KG', 'DECIMALS']);
  assert.deepEqual(['left', 'left', 'left', 'left'].map(go), ['KG', 'REPS', 'DECIMALS', 'KG']);
  assert.deepEqual(lines(r.v()).slice(2), ['KG', '60', '-', '+', 'Done']);
  go('left');
  for (const d of [undefined, '', 'x', null, 0, { toString: 1 }]) {
    r.link.next(d);
    assert.deepEqual(only(r.v(), ['sc', 'ak', 'av']), { sc: 7, ak: 'REPS', av: '8' }, `${JSON.stringify(d)}: nothing`);
  }
  for (let i = 0; i < 120; i++) r.link.next('up');
  assert.equal(r.v().av, '100');
  for (let i = 0; i < 120; i++) r.link.adj(-1);
  assert.deepEqual(only(r.v(), ['sc', 'av']), { sc: 7, av: '1' }, 'no page turn in Adjust');
  r.link.adj(0);
  assert.deepEqual(only(r.v(), ['sc', 'l2']), { sc: 1, l2: '60 kg x 1' });
});

test('L6 the draft is tied to its set id, rev and unit; Complete sends it; the outbox slot stays under 120 characters at 999.75', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.adj();
  r.link.adj(1);
  r.link.next('right');
  r.link.adj(1);
  r.link.next('right');
  r.link.adj(1);
  r.link.adj(0);
  assert.equal(r.v().l2, '61.25 kg x 9');
  r.link.rx(snap({ srev: 4 }));
  assert.equal(r.v().l2, '61.25 kg x 9', 'the same id, rev and unit: kept');
  for (const set of [{ rev: 2 }, { id: 'set_bx' }, { u: 'lb' }]) {
    r.link.rx(snap({ set: { ...S2, ...set } }));
    assert.equal(r.v().l2, `60 ${set.u ?? 'kg'} x 8`, JSON.stringify(set));
  }
  r.link.rx(snap());
  r.link.complete();
  assert.deepEqual(only(r.cmds()[0], ['setId', 'expectedRev', 'load', 'reps']), { setId: 'set_b2', expectedRev: 1, load: { value: 61.25, unit: 'kg' }, reps: 9 });
  const sid = `s_${'z'.repeat(8)}_${'z'.repeat(6)}`, id = `set_${'z'.repeat(8)}_${'z'.repeat(6)}`;
  const a = await rig({ code: null, boot: 'zzzzzzzz' });
  a.link.rx(snap({ sid, set: { ...S2, id, rev: 99999, w: 998.5, r: 99, e: 'ideal' } }));
  a.link.adj();
  a.link.adj(1);
  a.link.next('right');
  a.link.adj(1);
  a.link.next('right');
  a.link.adj(1);
  a.link.adj(0);
  a.link.complete();
  const value = a.store.map.get('m2q0');
  assert.ok(value.length + 4 < 120, `${value.length} characters, and 4 more for a sequence of 99999`);
  assert.deepEqual(only(a.cmds()[0], ['load', 'reps']), { load: { value: 999.75, unit: 'kg' }, reps: 100 });
});

// ---------------------------------------------------------------------------------------------------------------
// L7 Rest

test('L7 Rest: -15 s, +15 s and Skip; rest_sub_15 and rest_add_15 on the wire and in storage (codes m and p, 5 fields); a restart sends the same bytes', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  assert.deepEqual(lines(r.v()).slice(2), ['REST', '1:00', '', 'Next: Bench press', 'Set 2 of 5, 60 kg x 8', 'Change', '-15 s', '+15 s', 'Skip', '']);
  assert.deepEqual([...HML.matchAll(/onclick="(\w+)"><text[^>]*>([^<]*)/g)].map((m) => `${m[1]} ${m[2]}`).filter((x) => / s$|Skip$/.test(x)), ['onSub -15 s', 'onAdd +15 s', 'onSkip Skip']);
  r.link.rest('rest_sub_15');
  r.link.rest('rest_add_15');
  assert.equal(r.v().rc, '1:00', 'online, a step waits for the phone');
  const base = { t: 'mw', v: 1, k: 'cmd', sessionId: 's_1', actionAt: T0, restId: 'rest_1' };
  assert.deepEqual(r.cmds().slice(0, 1), [{ ...base, commandId: 'abcd1234-1', kind: 'rest_sub_15' }]);
  assert.equal(r.sent.find((x) => x.includes('rest_sub_15')), JSON.stringify({ t: 'mw', v: 1, k: 'cmd', commandId: 'abcd1234-1', sessionId: 's_1', actionAt: T0, kind: 'rest_sub_15', restId: 'rest_1' }));
  r.link.rx(res('abcd1234-1'));
  assert.deepEqual(r.cmds().at(-1), { ...base, commandId: 'abcd1234-2', kind: 'rest_add_15' });
  const { sum } = await import(LINK);
  const b = `p,abcd1234-2,s_1,${T0},rest_1`;
  assert.equal(r.store.map.get('m2q1'), `${b},${sum(b) % 99991}`);
  const s = store();
  const a = await rig({ store: s, code: null });
  a.link.rx(snap({ rest: rest1 }));
  a.link.rest('rest_sub_15');
  const m = `m,abcd1234-1,s_1,${T0},rest_1`;
  assert.equal(s.map.get('m2q0'), `${m},${sum(m) % 99991}`);
  const c = await rig({ store: s, boot: 'cccccccc', code: null });
  assert.equal(c.sent.find((x) => x.includes('"cmd"')), a.sent.find((x) => x.includes('"cmd"')));
});

test('L7 page: the -15 s and +15 s pills send their kinds; a tap within 1 s of a screen change is ignored, two steps in a row both count', () => {
  const calls = [];
  const clock = { t: T0 };
  const link = { start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }), complete: () => calls.push('c'), rest: (k) => calls.push(k) };
  const p = loadPage(link, { Date: { now: () => clock.t } });
  const tap = (h, d = 0) => { clock.t += d; p.def[h].call(p.page); };
  tap('onComplete', 5000); tap('onSub', 200); tap('onAdd', 300);
  tap('onSub', 1000); tap('onSub', 100); tap('onAdd', 100); tap('onSkip', 100);
  assert.deepEqual(calls, ['c', 'rest_sub_15', 'rest_sub_15', 'rest_add_15', 'rest_skip']);
});

test('L7 a local rest: +15 s and -15 s change it on the watch and send nothing; -15 s never leaves less than 5 s', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.ticks(2);
  const ids = () => [...new Set(r.cmds().map((c) => c.commandId))];
  const n = ids();
  const step = (k) => { r.link.rest(k); return r.v().rc; };
  assert.equal(r.v().rc, '1:28');
  assert.deepEqual(['rest_add_15', 'rest_sub_15', 'rest_sub_15'].map(step), ['1:43', '1:28', '1:13']);
  r.adv(61000);
  assert.equal(r.v().rc, '0:12');
  assert.deepEqual(['rest_sub_15', 'rest_sub_15'].map(step), ['0:05', '0:05']);
  r.ticks(2);
  assert.deepEqual(['rest_sub_15', 'rest_add_15'].map(step), ['0:03', '0:18']);
  assert.deepEqual(ids(), n, 'nothing sent');
});

test('L7 offline, queued steps show on the phone rest at once, in order by the phone rule: 60 s, -15 x4 gives 0:05, +15 gives 0:20, then it counts down', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 86000 } }));
  offline(r);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'rc']), { sc: 2, off: 1, rc: '1:00' });
  const seen = [];
  for (const k of ['rest_sub_15', 'rest_sub_15', 'rest_sub_15', 'rest_sub_15', 'rest_add_15']) { r.link.rest(k); seen.push(r.v().rc); }
  assert.deepEqual(seen, ['0:45', '0:30', '0:15', '0:05', '0:20']);
  r.tick();
  assert.equal(r.v().rc, '0:19');
  r.adv(5000);
  assert.equal(r.v().rc, '0:14', 'each step counted from its tap: the countdown runs on');
  assert.deepEqual([...new Set(r.cmds().map((c) => `${c.commandId} ${c.kind}`))], ['abcd1234-1 rest_sub_15'], 'one in flight, the rest queued');
  assert.equal(r.store.map.get('m2q'), '01234');
  r.link.rx(snap({ rest: { ...rest1, left: 30000 } }));
  assert.equal(r.v().rc, '0:30', 'online again: the phone rest as the phone sends it');
});

test('L7 an outbox from 1.3.0 then 1.4.0: an a entry (rest_add_30) still loads and sends, before an m entry; both show offline', async () => {
  const { sum } = await import(LINK);
  const a = `a,old12345-3,s_1,${T0},rest_1`, m = `m,abcd1234-1,s_1,${T0 + 1000},rest_1`;
  const s = store();
  s.map.set('m2q', '01');
  s.map.set('m2q0', `${a},${sum(a) % 99991}`);
  s.map.set('m2q1', `${m},${sum(m) % 99991}`);
  const r = await rig({ store: s, code: null, boot: 'bbbbbbbb' });
  assert.deepEqual([r.v().st, s.map.get('m2q')], ['2 pending', '01']);
  assert.deepEqual(r.cmds(), [{ t: 'mw', v: 1, k: 'cmd', commandId: 'old12345-3', sessionId: 's_1', actionAt: T0, kind: 'rest_add_30', restId: 'rest_1' }]);
  r.link.rx(snap({ rest: { ...rest1, left: 86000 } }));
  offline(r);
  assert.equal(r.v().rc, '1:15', '60 s left, +30 s, then -15 s');
  r.link.rx(res('old12345-3'));
  assert.deepEqual(r.cmds().at(-1), { t: 'mw', v: 1, k: 'cmd', commandId: 'abcd1234-1', sessionId: 's_1', actionAt: T0 + 1000, kind: 'rest_sub_15', restId: 'rest_1' });
  assert.equal(s.map.get('m2q'), '1');
});

// ---------------------------------------------------------------------------------------------------------------
// L8 Heart

test('L8 the header: a heart and the bpm with a fresh sample, M/ARC without; the pulse duration in 5-bpm steps; 602 stays on the Set and Rest line', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  let d = drawn(r.v());
  assert.deepEqual([d.lines.slice(0, 2), d.images], [['M/ARC', hm(T0)], []]);
  r.link.beat(127.6);
  d = drawn(r.v());
  assert.deepEqual(d.lines.slice(0, 2), ['128 bpm', hm(T0)]);
  assert.deepEqual(d.images, [{ src: '/common/h.png', style: 'animation-duration:462ms' }]);
  assert.equal(d.lines.filter((x) => /bpm/.test(x)).length, 1, 'the bpm is in the header only');
  assert.equal(d.lines.at(-1), '', 'the Set status line is free');
  for (const [x, want] of [[60, '1000ms'], [128, '462ms'], [182, '333ms'], [62.4, '1000ms'], [63, '923ms'], [1, '12000ms']]) {
    r.link.beat(x);
    assert.equal(r.v().hd, want, String(x));
  }
  r.link.beat(150);
  r.ticks(15);
  assert.equal(r.v().hm, '150 bpm', 'fresh for 15 s');
  r.tick();
  d = drawn(r.v());
  assert.deepEqual([d.lines[0], d.images, r.v().hd], ['M/ARC', [], ''], 'no sample for 16 s');
  r.link.beat(-602);
  r.link.rx(snap({ rest: rest1 }));
  r.link.touch();
  d = drawn(r.v());
  assert.deepEqual([d.lines[0], d.lines.at(-1)], ['M/ARC', 'Allow Body sensors'], 'Rest: the 602 line');
  r.link.rx(snap());
  assert.equal(drawn(r.v()).lines.at(-1), 'Allow Body sensors', 'Set: the 602 line');
  r.link.beat(90);
  assert.deepEqual(only(r.v(), ['hm', 'hr']), { hm: '90 bpm', hr: '' });
  r.link.beat(-5);
  assert.deepEqual(only(r.v(), ['hm', 'hr', 'hd']), { hm: 'M/ARC', hr: '', hd: '' }, 'an error is no sample');
  // offline the warning takes the label's place: the heart stays, and the bpm stays on the Set and Rest line as in 1.3.0
  const o = await rig({ code: null });
  o.link.rx(snap());
  offline(o);
  o.link.touch();
  o.link.beat(131);
  d = drawn(o.v());
  assert.deepEqual([d.lines[0], d.lines.at(-1), d.images, o.v().hm], ['Phone not connected', '131 bpm', [{ src: '/common/h.png', style: 'animation-duration:462ms' }], '131 bpm']);
  o.link.beat(-602);
  assert.equal(drawn(o.v()).lines.at(-1), 'Allow Body sensors');
});

test('L8 the heart is mounted once: outside every screen branch and the offline header, it stays drawn across Set, Up next, Adjust, Rest, Rest done, idle and offline', async () => {
  const img = find(TREE, (n) => n.tag === 'image');
  const conds = [];
  for (let n = img; n.up; n = n.up) for (const a of ['if', 'elif', 'else']) if (a in n.attrs) conds.push(`${a}=${n.attrs[a]}`);
  assert.deepEqual(conds, ['if={{hv}}'], 'only its own div if (a nested if mount overflowed the 14 KB stack model on rx)');
  assert.equal([...HML.matchAll(/<image\b/g)].length, 1);
  assert.deepEqual(img.attrs, { class: 'hi', src: '{{im}}', style: 'animation-duration:{{hd}}' });
  assert.match(rules.hi, /animation-name:hb;/);
  assert.match(rules.hi, /animation-iteration-count:infinite;/);
  assert.match(rules.hi, /animation-timing-function:ease-out/);
  assert.match(CSS, /@keyframes hb\{from\{opacity:1\}to\{opacity:0\.3\}\}/);
  const r = await rig({ code: null });
  const seen = [];
  const look = () => { const v = r.v(), d = drawn(v); seen.push(v.dm ? 8 : v.sc); assert.equal(d.images.length, 1, `screen ${v.sc}`); };
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.beat(120);
  look();
  r.link.next('up');
  look();
  r.link.next('down');
  r.link.adj();
  look();
  r.link.adj(0);
  r.link.rx(snap({ rest: { ...rest1, left: 30000 } }));
  for (let i = 0; i < 31; i++) { r.link.rx(snap({ rest: { ...rest1, left: 30000 - i * 1000 } })); r.link.beat(120 + i); look(); r.tick(); }
  r.link.ok();
  look();
  for (let i = 0; i < 30; i++) { r.link.beat(130); r.tick(); look(); }
  assert.equal(r.v().off, 1, 'offline');
  r.link.rx(snap());
  look();
  r.link.touch();
  look();
  assert.deepEqual([...new Set(seen)], [1, 3, 7, 2, 8, 6]);
  assert.equal(seen.at(-1), 1);
});

test('L8 the heart-rate peak and average stay in memory: reset on a new session, never in a message or in storage', async () => {
  const r = await rig({ code: null });
  r.link.beat(190);
  r.link.rx(snap());
  for (const x of [100, 150, 120.4, -602, 0]) r.link.beat(x);
  r.link.complete();
  r.link.rest('rest_add_15');
  r.link.show();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(done());
  r.link.beat(200);
  r.tick();
  assert.equal(r.hls.length, 1);
  assert.equal(r.hls[0].h5, 'Peak 150 bpm, avg 123', 'samples of s_1 only, before the finish');
  r.link.rx(snap({ sid: 's_2' }));
  r.link.beat(90);
  r.link.beat(95);
  r.link.rx(done({ fin: ['s_2', LINES.slice(1)] }));
  r.tick();
  assert.deepEqual(r.hls[1], { h1: LINES[1], h2: LINES[2], h3: LINES[3], h4: 'Peak 95 bpm, avg 93', h5: '' }, 'reset on s_2');
  for (const x of [...r.sent, ...r.store.map.values()]) assert.doesNotMatch(x, /bpm|Peak|avg|heart/i, x);
  assert.deepEqual([...r.store.map.keys()].filter((k) => !/^m2[qr]\d?$/.test(k)), []);
});

// ---------------------------------------------------------------------------------------------------------------
// L9 Idle

test('L9 idle after 15 s without a tap on Set and on Rest, and only there', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.ticks(14);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 1, dm: 0 });
  r.tick();
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 1, dm: 1 }, 'Set, 15 s');
  r.link.touch();
  r.link.rx(snap({ rest: rest1 }));
  r.ticks(14);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 2, dm: 0 });
  r.tick();
  assert.deepEqual(only(r.v(), ['sc', 'dm', 'rc']), { sc: 2, dm: 1, rc: '0:45' }, 'Rest, 15 s');
  // never on Up next, Adjust, Rest done, the Phone not connected screen or with no workout
  const u = await rig({ code: null });
  u.link.rx(snap());
  u.link.rx(plan());
  u.link.next('up');
  u.ticks(30);
  assert.deepEqual(only(u.v(), ['sc', 'dm']), { sc: 3, dm: 0 });
  const a = await rig({ code: null });
  a.link.rx(snap());
  a.link.adj();
  a.ticks(30);
  assert.deepEqual(only(a.v(), ['sc', 'dm']), { sc: 7, dm: 0 });
  const d = await rig({ code: null });
  d.link.rx(snap({ rest: { ...rest1, left: 2000 } }));
  d.ticks(40);
  assert.deepEqual(only(d.v(), ['sc', 'dm']), { sc: 6, dm: 0 });
  const o = await rig({ code: null });
  o.link.rx(snap({ nx: [], rs: 0 }));
  o.link.complete();
  offline(o);
  assert.deepEqual(only(o.v(), ['sc', 'dm']), { sc: 4, dm: 0 });
  const n = await rig({ code: null });
  n.link.rx(snap({ sid: null, eid: null, ex: null, si: 0, sn: 0, set: null, nx: [], lt: null }));
  n.ticks(30);
  assert.deepEqual(only(n.v(), ['sc', 'dm']), { sc: 0, dm: 0 });
});

test('L9 every wake source: a tap anywhere (root onclick), a swipe, onShow, a rest at 10 s or less, Rest done, Adjust, a new set from the phone', async () => {
  const idle = async () => { const r = await rig({ code: null }); r.link.rx(snap()); r.link.rx(plan()); r.ticks(15); assert.equal(r.v().dm, 1); return r; };
  let r = await idle();
  r.link.touch();
  assert.equal(r.v().dm, 0, 'touch');
  r.ticks(15);
  assert.equal(r.v().dm, 1, 'idle again 15 s later');
  r = await idle();
  r.link.next('left');
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 1, dm: 0 }, 'a swipe');
  r = await idle();
  r.link.show();
  assert.equal(r.v().dm, 0, 'onShow');
  r = await idle();
  r.link.adj();
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 7, dm: 0 }, 'Adjust');
  r.link.adj(0);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 1, dm: 0 });
  r = await idle();
  r.link.rx(snap({ srev: 4 }));
  assert.equal(r.v().dm, 1, 'the same set again does not wake');
  r.link.rx(snap({ si: 3, set: { ...S2, id: 'set_b3', rev: 0 }, nx: NX.slice(1) }));
  assert.equal(r.v().dm, 0, 'a new set from the phone');
  r = await idle();
  r.link.rx(snap({ rest: { ...rest1, left: 40000 } }));
  r.ticks(15);
  assert.deepEqual(only(r.v(), ['sc', 'dm', 'rc']), { sc: 2, dm: 1, rc: '0:25' });
  r.ticks(15);
  assert.deepEqual(only(r.v(), ['sc', 'dm', 'rc']), { sc: 2, dm: 0, rc: '0:10' }, '10 s left');
  r.ticks(10);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 6, dm: 0 }, 'Rest done');
  r.link.ok();
  r.ticks(14);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 1, dm: 0 }, 'Set after Rest done: 15 s from the last wake');
  // page: the root takes every tap (taps bubble) and calls touch
  assert.match(HML, /^<div class="rt co" onclick="onTouch" onswipe="onSwipe">\n/);
  const calls = [];
  const p = loadPage({ start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }), touch: () => calls.push('touch') });
  p.def.onTouch.call(p.page);
  assert.deepEqual(calls, ['touch']);
  const q = loadPage({ start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }), touch: () => { throw new Error('x'); } });
  assert.doesNotThrow(() => q.def.onTouch.call(q.page));
});

test('L9 the idle screen: only the countdown or the set target and the header in #3a3a40 on black, the dark heart by its src; no brightness value call', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.beat(120);
  r.ticks(15);
  r.link.beat(121);
  let d = drawn(r.v());
  assert.deepEqual(d.lines, ['121 bpm', hm(T0 + 15000), '0:45']);
  assert.deepEqual(d.images, [{ src: '/common/hd.png', style: 'animation-duration:500ms' }]);
  assert.deepEqual(only(d.d, ['sc', 'hc', 'kc', 'im']), { sc: 8, hc: G, kc: G, im: '/common/hd.png' });
  r.link.touch();
  d = drawn(r.v());
  assert.deepEqual(only(d.d, ['sc', 'hc', 'kc', 'im']), { sc: 2, hc: '#a9aef0', kc: '#f7f8f8', im: '/common/h.png' });
  assert.equal(d.lines.length, 12);
  const s = await rig({ code: null });
  s.link.rx(snap());
  s.ticks(15);
  d = drawn(s.v());
  assert.deepEqual(d.lines, ['M/ARC', hm(T0 + 15000), '60 kg x 8']);
  assert.deepEqual(only(d.d, ['hc', 'kc']), { hc: G, kc: G });
  s.link.touch();
  assert.deepEqual(only(drawn(s.v()).d, ['sc', 'hc', 'kc']), { sc: 1, hc: '#a9aef0', kc: '#f7f8f8' }, 'M/ARC as in 1.3.0');
  const o = await rig({ code: null });
  o.link.rx(snap({ rest: { ...rest1, left: 90000 } }));
  offline(o);
  d = drawn(o.v());
  assert.deepEqual([d.lines, d.d.hc], [['Phone not connected', '1:04'], G], 'offline: the warning in grey too');
  o.link.touch();
  assert.deepEqual(only(drawn(o.v()).d, ['sc', 'hc']), { sc: 2, hc: '#f2b56b' });
  // markup: the idle texts and the header texts take #3a3a40 or their bound colour
  const box = find(TREE, (n) => n.attrs.if === '{{sc==8}}');
  const texts = box.kids.filter((n) => n.tag === 'text');
  assert.deepEqual(texts.map((n) => [n.kids[0].text, colourOf(n.attrs.class)]), [['{{t1}}', [G]]]);
  assert.deepEqual(box.kids.filter((n) => n.tag !== 'text'), [], 'nothing to tap on the idle screen');
  assert.deepEqual([...HML.matchAll(/<text [^>]*style="color:\{\{(\w+)\}\}">([^<]*)/g)].map((m) => `${m[1]} ${m[2]}`), ['hc Phone not connected', 'hc {{hm}}', 'kc {{ck}}']);
  assert.match(rules.rt, /background-color:#08090a/);
  // no brightness value call: only setKeepScreenOn, whatever runs
  const calls = [];
  const brightness = new Proxy({}, { get: (_, k) => (...a) => { calls.push(k); const o2 = a[0]; if (o2 && o2.success) o2.success({ value: 1 }); } });
  const p = loadPage(Object.assign(Object.create(null), { start() {}, tick() {}, show() {}, die() {}, touch() {}, view: () => ({ sc: 2, dm: 1 }) }), { brightness });
  const io = p.io();
  io.keep(true);
  p.io().paint();
  p.def.onShow.call(p.page);
  p.def.onTouch.call(p.page);
  io.keep(false);
  p.def.onDestroy.call(p.page);
  assert.deepEqual([...new Set(calls)], ['setKeepScreenOn']);
  for (const f of ['pages/index/index.js', 'common/link.js']) assert.doesNotMatch(readFileSync(path.join(JS, f), 'utf8'), /brightness\.(?!setKeepScreenOn\b)\w+|setValue|getValue|setMode/, f);
});

test('L9 the heart PNGs: 24 x 24 RGBA, h.png in #eb5757 and hd.png in #3a3a40, with the same alpha mask', () => {
  const read = (f) => {
    const b = readFileSync(path.join(JS, 'common', f));
    assert.equal(b.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', f);
    let at = 8, ihdr, idat = [];
    while (at < b.length) {
      const n = b.readUInt32BE(at), type = b.subarray(at + 4, at + 8).toString('latin1'), data = b.subarray(at + 8, at + 8 + n);
      if (type === 'IHDR') ihdr = data;
      if (type === 'IDAT') idat.push(data);
      at += 12 + n;
    }
    assert.deepEqual([ihdr.readUInt32BE(0), ihdr.readUInt32BE(4), ihdr[8], ihdr[9], ihdr[12]], [24, 24, 8, 6, 0], `${f}: 24 x 24, 8-bit RGBA, not interlaced`);
    const raw = inflateSync(Buffer.concat(idat)), px = [];
    for (let y = 0; y < 24; y++) {
      assert.equal(raw[y * 97], 0, `${f}: row ${y} unfiltered`);
      for (let x = 0; x < 24; x++) px.push([...raw.subarray(y * 97 + 1 + x * 4, y * 97 + 5 + x * 4)]);
    }
    return px;
  };
  const h = read('h.png'), d = read('hd.png');
  assert.deepEqual(h.map((p) => p[3]), d.map((p) => p[3]), 'the same mask: the src swap moves no pixel');
  const solid = h.filter((p) => p[3] === 255).length;
  assert.ok(solid > 200 && solid < 450, `${solid} solid pixels`);
  assert.deepEqual([h[0][3], h[23][3], h[552][3], h[575][3]], [0, 0, 0, 0], 'transparent corners');
  for (const [px, rgb] of [[h, [0xeb, 0x57, 0x57]], [d, [0x3a, 0x3a, 0x40]]]) for (const p of px) if (p[3]) assert.deepEqual(p.slice(0, 3), rgb);
});

// ---------------------------------------------------------------------------------------------------------------
// L10 Done

test('L10 Done: a snap with no session whose fin is the last session id replaces the page with pages/hl/hl and h1 to h5, once the outbox is empty', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.beat(120);
  r.link.beat(140);
  r.link.complete();
  r.link.rx(done());
  r.ticks(3);
  assert.deepEqual([r.hls, only(r.v(), ['sc', 'l1'])], [[], { sc: 0, l1: 'Start your workout' }], 'not while a set is pending');
  r.store.hold = true;
  r.link.rx(res('abcd1234-1'));
  r.ticks(2);
  assert.deepEqual(r.hls, [], 'not while the outbox index is being written');
  r.store.hold = false;
  while (r.store.held.length) r.store.held.shift()();
  drain();
  assert.deepEqual(r.hls, []);
  r.tick();
  assert.deepEqual(r.hls, [{ h1: LINES[0], h2: LINES[1], h3: LINES[2], h4: LINES[3], h5: 'Peak 140 bpm, avg 130' }]);
  r.link.rx(done());
  r.ticks(3);
  assert.equal(r.hls.length, 1, 'once per session id');
  // with nothing pending: on the next tick; the phone's 2 lines then the heart, the rest blank; no samples, no heart line
  const a = await rig({ code: null });
  a.link.rx(snap());
  a.link.beat(100);
  a.link.rx(done({ fin: ['s_1', LINES.slice(1, 3)] }));
  assert.deepEqual(a.hls, []);
  a.tick();
  assert.deepEqual(a.hls, [{ h1: LINES[1], h2: LINES[2], h3: 'Peak 100 bpm, avg 100', h4: '', h5: '' }]);
  const b = await rig({ code: null });
  b.link.rx(snap());
  b.link.rx(done({ fin: ['s_1', []] }));
  b.tick();
  assert.deepEqual(b.hls, [{ h1: '', h2: '', h3: '', h4: '', h5: '' }]);
});

test('L10 no Done for a discard, an unknown id, a fin before any session (the index page back from pages/hl), or a new session before the outbox empties', async () => {
  for (const [name, steps] of [
    ['discard', (r) => { r.link.rx(snap()); r.link.rx(done({ fin: undefined })); }],
    ['unknown id', (r) => { r.link.rx(snap()); r.link.rx(done({ fin: ['s_9', LINES] })); }],
    ['no session seen', (r) => { r.link.rx(done()); }],
    ['a new session first', (r) => { r.link.rx(snap()); r.link.complete(); r.link.rx(done()); r.link.rx(snap({ sid: 's_2' })); r.link.rx(res('abcd1234-1')); }],
  ]) {
    const r = await rig({ code: null });
    steps(r);
    r.ticks(5);
    assert.deepEqual(r.hls, [], name);
  }
  const c = await rig({ code: null });
  c.link.rx(snap());
  c.link.rx(done());
  c.ticks(5);
  assert.equal(c.hls.length, 1, 'the control: the same rig sees a Done');
  // the index page back from the highlights page is a fresh link with the same storage: the phone's snap still carries fin
  const back = await rig({ code: null, store: c.store, boot: 'bbbbbbbb' });
  back.link.rx(done());
  back.ticks(5);
  assert.deepEqual([back.hls, only(back.v(), ['sc', 'l1', 'l2'])], [[], { sc: 0, l1: 'Start your workout', l2: 'in M/ARC on your phone' }], 'No workout, no loop');
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(done({ fin: undefined }));
  assert.deepEqual(only(r.v(), ['sc', 'l1', 'l2']), { sc: 0, l1: 'Start your workout', l2: 'in M/ARC on your phone' }, 'No workout, as in 1.3.0');
});

test('L10 a bad fin refuses the snap as a whole, as a bad nx does; 4 lines of 24 characters pass', async () => {
  const b = await rig({ code: null });
  b.link.rx(snap());
  const before = b.v();
  for (const fin of ['s_1', 1, ['s_1'], [1, []], ['s_1', 'x'], ['s_1', [1]], ['s_1', [null]], ['s_1', ['x'.repeat(25)]], ['s_1', ['a', 'b', 'c', 'd', 'e']], { 0: 's_1', 1: [] }, ['s_1', { length: 1, 0: 'a' }]]) {
    b.link.rx(done({ fin }));
    b.tick();
    assert.deepEqual(only(b.v(), ['sc', 'l1', 'sp']), only(before, ['sc', 'l1', 'sp']), JSON.stringify(fin));
  }
  assert.deepEqual(b.hls, []);
  const fin = ['s_1', ['x'.repeat(24), 'y'.repeat(24), 'z'.repeat(24), 'w'.repeat(24)]];
  b.link.rx(done({ fin }));
  b.tick();
  assert.deepEqual(b.hls, [{ h1: fin[1][0], h2: fin[1][1], h3: fin[1][2], h4: fin[1][3], h5: '' }]);
});

test('L10 page: the hook replaces the page with pages/hl/hl and the params; a router that throws is caught; nothing else calls the router', () => {
  const calls = [];
  const p = loadPage({ start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }) }, { router: { replace: (o) => calls.push(o) } });
  const params = { h1: 'a', h2: 'b', h3: '', h4: '', h5: '' };
  p.io().hl(params);
  assert.deepEqual(calls, [{ uri: 'pages/hl/hl', params }]);
  const q = loadPage({ start() {}, tick() {}, show() {}, view: () => ({ sc: 0 }) }, { router: { replace: () => { throw new Error('x'); } } });
  assert.doesNotThrow(() => q.io().hl(params));
  const src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  assert.equal([...src.matchAll(/\brouter\./g)].length, 1);
  assert.match(src, /^import router from '@system\.router';$/m);
  assert.doesNotMatch(readFileSync(path.join(JS, 'common/link.js'), 'utf8'), /router|pages\/hl/);
  const cfg = JSON.parse(readFileSync(path.join(ROOT, 'native/wear/app/entry/src/main/config.json'), 'utf8'));
  assert.deepEqual(cfg.module.js[0].pages, ['pages/index/index', 'pages/hl/hl']);
});

/** The drawn lines of a view (texts only). */
function lines(v) { return drawn(v).lines; }

// C4 review (2026-10-18): every if value is a boolean in every state; a paused rest at 10 s or less still dims.
test('R17 every if in index.hml is the boolean true or false in every state: online, offline with a pending action, heart on and off, each screen', async () => {
  const conds = [...HML.matchAll(/\b(?:if|elif)="(\{\{[^"]*\}\})"/g)].map((m) => m[1]);
  assert.ok(conds.length >= 10, `${conds.length} ifs`);
  const seen = new Set();
  const check = (r, why) => {
    const d = pageData(r.v());
    for (const c of conds) {
      const m = /^\{\{(!?)(\w+)(?:(==)(\d+))?\}\}$/.exec(c) ?? assert.fail(`unexpected if form ${c}`);
      const x = m[3] ? d[m[2]] == +m[4] : m[1] ? !d[m[2]] : d[m[2]];
      assert.equal(typeof x, 'boolean', `${why}: ${c} is ${JSON.stringify(d[m[2]])}`);
      if (x) seen.add(c);
    }
  };
  const r = await rig({ code: null });
  check(r, 'start');
  r.link.rx(snap());
  check(r, 'set');
  r.link.beat(128);
  check(r, 'set with a heart rate');
  r.link.adj();
  check(r, 'adjust');
  r.link.adj(0);
  r.link.rx(snap({ rest: rest1 }));
  check(r, 'rest');
  offline(r);
  r.link.complete();
  check(r, 'offline, pending');
  assert.ok(seen.has('{{off==1}}') || seen.has('{{off}}'), 'the offline header was drawn');
  assert.ok([...seen].some((c) => /hv|hd/.test(c)), 'the heart was drawn');
});

test('R18 a paused phone rest at 10 s or less wakes the screen once, then dims after 15 s like any rest', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 8000, p: true } }));
  r.ticks(16);
  assert.deepEqual(only(r.v(), ['sc', 'dm']), { sc: 2, dm: 1 }, 'paused at 8 s: dims');
  const s = await rig({ code: null });
  s.link.rx(snap({ rest: { ...rest1, left: 30000 } }));
  s.ticks(15);
  assert.equal(s.v().dm, 1, 'idle at 15 s');
  s.ticks(5);
  assert.equal(s.v().dm, 0, 'a running rest at 10 s wakes');
  s.ticks(10);
  assert.equal(s.v().sc, 6, 'Rest done at 0');
});
