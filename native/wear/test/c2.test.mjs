// WATCH-C2 acceptance V1 to V4: the C2 screens, paging, the pick, Back in sync and the plan message, on the
// watch's own common/link.js. The phone's plan is faked from the card's shape. Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const PAGE = path.join(ROOT, 'native/wear/app/entry/src/main/js/default/pages/index');
const LINK = pathToFileURL(path.join(ROOT, 'native/wear/app/entry/src/main/js/default/common/link.js')).href;

const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);
const AC = '#5e6ad2', PL = '#232428', BG = '#08090a';
const two = (n) => String(n).padStart(2, '0');
const hm = (ms) => `${two(new Date(ms).getHours())}:${two(new Date(ms).getMinutes())}`;
const hms = (ms) => `${hm(ms)}:${two(new Date(ms).getSeconds())}`;

const S1 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't' };
const ROWS = [
  { id: 'e_bench', ex: 'Bench press', d: 1, n: 3, set: S1, lt: { w: 57.5, u: 'kg', r: 8 } },
  { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c1', rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: { w: 52, u: 'kg', r: 10 } },
  { id: 'e_row', ex: 'Seated row', d: 2, n: 4, set: { id: 'set_r3', rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
  { id: 'e_plank', ex: 'Plank', d: 0, n: 2, set: null, lt: null },
];
const rest1 = { id: 'rest_1', left: 90000, tot: 90000, p: false };
const snap = (o = {}) => JSON.stringify({
  t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 3,
  set: S1, lt: { w: 57.5, u: 'kg', r: 8 }, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o,
});
const plan = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 8, st: 21, rows: ROWS, ...o });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });

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
/** A link with a fake clock, storage and radio; one tick runs per second the clock moves, before each call. */
async function rig(o = {}) {
  const { Link } = await import(LINK);
  let t = T0;
  const r = { sent: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store() };
  const io = {
    store: r.store, now: () => t, keep: () => {}, paint: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); },
    send: (text, done) => { r.sent.push(text); if (r.code !== null) done(r.code); },
  };
  const link = Link(io, 'abcd1234');
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
  r.tick = () => { t += 1000; r.link.tick(); };
  r.v = () => r.link.view();
  r.cmds = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.hellos = () => r.sent.filter((x) => JSON.parse(x).k === 'hello').length;
  r.link.start();
  return r;
}
const only = (v, keys) => Object.fromEntries(keys.map((k) => [k, v[k]]));
const SET = ['sc', 'off', 'ck', 'nm', 'sp', 'l2', 'la', 'set', 'e1', 'e2', 'e3', 'cb', 'cl', 'sl'];

test('V1 Set: the header clock, name, SET n OF m, target, last time, effort pills, Complete pill and status line', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  assert.deepEqual(only(r.v(), SET), { sc: 1, off: 0, ck: hm(T0), nm: 'Bench press', sp: 'SET 2 OF 3', l2: '60 kg x 8', la: 'Last time 57.5 kg x 8',
    set: true, e1: PL, e2: PL, e3: PL, cb: AC, cl: 'Complete set', sl: '' });
  r.adv(65000);
  assert.equal(r.v().ck, hm(T0 + 65000), 'the watch clock, hh:mm');
  r.link.rx(snap({ pt: T0 + 65000, set: { ...S1, e: 'ideal' }, lt: { w: null, u: 'kg', r: 12 } }));
  assert.deepEqual(only(r.v(), ['e1', 'e2', 'e3', 'la']), { e1: PL, e2: AC, e3: PL, la: 'Last time 12 reps' });
  r.link.effort(3);
  assert.deepEqual(only(r.v(), ['e1', 'e2', 'e3']), { e1: PL, e2: PL, e3: AC });
  r.link.effort(3);
  assert.deepEqual(only(r.v(), ['e1', 'e2', 'e3']), { e1: PL, e2: PL, e3: PL }, 'a second tap clears it');
  r.link.complete();
  assert.equal(r.cmds()[0].effort, undefined, 'cleared: no effort sent');
  assert.deepEqual(only(r.v(), ['sc', 'cb', 'cl', 'sl', 'st']), { sc: 1, cb: PL, cl: `Pending ${hms(T0 + 65000)}`, sl: '', st: `Pending ${hms(T0 + 65000)}` });
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  assert.deepEqual(only(r.v(), ['cb', 'cl', 'sl']), { cb: AC, cl: 'Complete set', sl: 'Changed on phone' });
  r.link.rx(res('abcd1234-0', { status: 'rejected', reason: 'session_closed' }));
  // Log on phone: no pills and no Complete.
  r.link.rx(snap({ ex: 'Plank', set: null, lt: null }));
  assert.deepEqual(only(r.v(), ['sc', 'nm', 'l2', 'la', 'set']), { sc: 1, nm: 'Plank', l2: 'Log on phone', la: '', set: false });
  // "N pending" after a restart, with each pending set's own time on its Complete pill.
  const s = store();
  const a = await rig({ store: s, code: null });
  a.link.rx(snap());
  a.link.complete();
  a.adv(3000);
  a.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  a.link.complete();
  const b = await rig({ store: s, code: null });
  b.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  assert.deepEqual(only(b.v(), ['sc', 'cb', 'cl', 'sl']), { sc: 1, cb: PL, cl: `Pending ${hms(T0 + 3000)}`, sl: '2 pending' });
});

test('V1 offline: the header warns while Set and Rest stay usable; with something pending, the Phone not connected screen', async () => {
  const r = await rig({ code: null });
  assert.deepEqual(only(r.v(), ['sc', 'off', 'l1', 'l2']), { sc: 0, off: 0, l1: '', l2: '' }, 'no warning in the first 5 s');
  r.adv(6000);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'na']), { sc: 4, off: 1, na: '' }, 'no phone yet: Open M/ARC on your phone, nothing pending');
  r.link.rx(snap({ rest: rest1 }));
  r.adv(26000);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'add']), { sc: 2, off: 1, add: true }, 'Rest stays usable');
  r.link.rx(snap());
  r.adv(26000);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'can']), { sc: 1, off: 1, can: true }, 'Set stays usable');
  r.link.complete();
  assert.deepEqual(only(r.v(), ['sc', 'na', 'rest']), { sc: 4, na: '1 action', rest: '' });
  r.link.rx(snap({ rest: { ...rest1, left: 61000 } }));
  r.link.rest('rest_add_30');
  r.adv(26000);
  assert.deepEqual(only(r.v(), ['sc', 'na', 'rest']), { sc: 4, na: '2 actions', rest: 'Rest 0:35' });
  // A failed send shows it at once.
  const f = await rig({ code: 206 });
  f.link.rx(snap());
  assert.equal(f.v().sc, 1);
  f.link.complete();
  assert.deepEqual(only(f.v(), ['sc', 'off', 'na']), { sc: 4, off: 1, na: '1 action' });
});

test('V1 Rest: REST, the countdown, its line, Next and its set, +30 s until the rest ends', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  assert.deepEqual(only(r.v(), ['sc', 'rc', 'sl', 'nx', 'ns', 'add']), { sc: 2, rc: '1:30', sl: '', nx: 'Next: Bench press', ns: 'Set 2 of 3, 60 kg x 8', add: true });
  r.link.rest('rest_add_30');
  assert.equal(r.v().sl, `Pending ${hms(T0)}`, 'the status shows on the line');
  r.link.rx(res('abcd1234-1'));
  assert.equal(r.v().sl, '', 'Saved: no set of the watch saved on this rest');
  r.adv(91000);
  assert.deepEqual(only(r.v(), ['sc', 'rc', 'add']), { sc: 2, rc: '0:00', add: false });
  r.link.rx(snap({ ex: 'Plank', set: null, lt: null, rest: rest1 }));
  assert.deepEqual(only(r.v(), ['nx', 'ns']), { nx: 'Next: Plank', ns: 'Set 2 of 3' });
  r.link.rx(snap({ eid: null, ex: null, si: 0, sn: 0, set: null, lt: null, rest: rest1 }));
  assert.deepEqual(only(r.v(), ['sc', 'nx', 'ns']), { sc: 2, nx: '', ns: '' }, 'all sets done: the rest still shows');
});

test('V1 Up next and the message screens', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.next();
  const v = r.v();
  assert.deepEqual(only(v, ['sc', 'dn', 'r0', 'r1', 'r2', 'r3', 'n0', 'n1', 'n2', 'n3', 'b0', 'b1', 'b2', 'b3']), {
    sc: 3, dn: '8 of 21 sets done', r0: 'Bench press', r1: 'Chest press', r2: 'Seated row', r3: 'Plank', n0: '1/3', n1: '0/3', n2: '2/4', n3: '0/2',
    b0: AC, b1: PL, b2: PL, b3: PL });
  r.link.rx(plan({ sd: 9, rows: ROWS.slice(1, 3) }));
  assert.deepEqual(only(r.v(), ['dn', 'r0', 'r1', 'r2', 'r3', 'n2', 'b0', 'b1', 'b2', 'b3']), {
    dn: '9 of 21 sets done', r0: 'Chest press', r1: 'Seated row', r2: '', r3: '', n2: '', b0: PL, b1: PL, b2: BG, b3: BG }, 'empty rows are blank');
  // Messages: no workout, all sets done, update needed.
  r.link.rx(snap({ sid: null, eid: null, ex: null, si: 0, sn: 0, set: null, lt: null }));
  assert.deepEqual(only(r.v(), ['sc', 'l1', 'l2']), { sc: 0, l1: 'Start your workout', l2: 'in M/ARC on your phone' });
  r.link.rx(snap({ eid: null, ex: null, si: 0, sn: 0, set: null, lt: null }));
  assert.deepEqual(only(r.v(), ['sc', 'l1', 'l2']), { sc: 0, l1: 'All sets done', l2: '' });
  r.link.rx(JSON.stringify({ t: 'mw', v: 2, k: 'snap' }));
  assert.deepEqual(only(r.v(), ['sc', 'off', 'l1', 'l2']), { sc: 0, off: 0, l1: 'Update needed', l2: '' });
});

test('V1 markup: every binding is page data, every text has a size, a height and a colour, and only lite-safe styles', () => {
  const hml = readFileSync(path.join(PAGE, 'index.hml'), 'utf8');
  const css = readFileSync(path.join(PAGE, 'index.css'), 'utf8');
  const page = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  const data = page.slice(page.indexOf('data: {'), page.indexOf('},', page.indexOf('data: {')));
  const names = [...hml.matchAll(/\{\{([^}]*)\}\}/g)].flatMap((m) => m[1].match(/[A-Za-z_]\w*/g));
  assert.ok(names.includes('sc') && names.includes('nm'));
  for (const n of names) assert.match(data, new RegExp(`\\b${n}: `), `data.${n}`);
  const rules = Object.fromEntries([...css.matchAll(/\.([\w-]+)\{([^}]*)\}/g)].map((m) => [m[1], m[2]]));
  const texts = [...hml.matchAll(/<text[^>]*class="([^"]*)"/g)].map((m) => m[1]);
  assert.ok(texts.length > 40);
  for (const cls of texts) {
    const all = cls.split(' ').map((c) => rules[c] ?? assert.fail(`no .${c}`)).join(';');
    for (const p of ['width:', 'height:', 'font-size:', 'color:']) assert.ok(all.split(';').some((d) => d.startsWith(p)), `${cls}: ${p}`);
  }
  // pills: a div whose border-radius is half its height
  for (const [c, d] of Object.entries(rules)) {
    const br = /border-radius:(\d+)px/.exec(d);
    if (br) assert.equal(2 * br[1], +/height:(\d+)px/.exec(d)[1], `.${c}`);
  }
  assert.doesNotMatch(css, /font-weight|line-height|position|align-self|flex-grow/);
  assert.doesNotMatch(hml, /class="[^"]*\{\{|<swiper|<input|indicator/);
  assert.match(hml, /^[\x0a\x20-\x7e]*$/);
});

test('V2 paging: a swipe up or down turns the page, only with a plan for this session; a tap on the exercise opens Up next', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.next('up');
  r.link.next();
  assert.equal(r.v().sc, 1, 'no plan: no Up next');
  r.link.rx(plan({ sid: 's_0' }));
  r.link.next();
  assert.equal(r.v().sc, 1, 'a plan of another session');
  r.link.rx(plan());
  r.link.next('up');
  assert.equal(r.v().sc, 3);
  r.link.next('down');
  assert.equal(r.v().sc, 1);
  r.link.next('down');
  assert.equal(r.v().sc, 3);
  r.link.next('left');
  r.link.next('right');
  assert.equal(r.v().sc, 3, 'left and right do nothing');
  r.link.rx(snap({ rest: rest1 }));
  r.link.next('up');
  assert.equal(r.v().sc, 2, 'page 0 is Rest while the phone rests');
  r.link.next();
  assert.equal(r.v().sc, 3, 'the tap on Next opens Up next');
  r.link.rx(snap({ sid: 's_2' }));
  r.link.rx(plan({ sid: 's_2' }));
  assert.equal(r.v().sc, 1, 'a new session starts on page 0');
});

test('V2 pick: a row tap makes it the watch exercise and returns to page 0; Complete sends that set with its id, rev, values and effort', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.next();
  r.link.pick(1);
  assert.deepEqual(only(r.v(), ['sc', 'nm', 'sp', 'l2', 'la', 'set', 'cb', 'l1']), {
    sc: 1, nm: 'Chest press', sp: 'SET 1 OF 3', l2: '54 kg x 10', la: 'Last time 52 kg x 10', set: true, cb: AC, l1: 'Chest press 1/3' });
  r.link.next();
  assert.deepEqual(only(r.v(), ['b0', 'b1']), { b0: PL, b1: AC }, 'Up next shows the pick');
  r.link.pick(1);
  r.link.effort(2);
  r.adv(2000);
  r.link.complete();
  assert.deepEqual(r.cmds()[0], { t: 'mw', v: 1, k: 'cmd', commandId: 'abcd1234-1', sessionId: 's_1', actionAt: T0 + 2000, kind: 'complete_set',
    setId: 'set_c1', expectedRev: 0, load: { value: 54, unit: 'kg' }, reps: 10, effort: 'ideal' });
  assert.deepEqual(only(r.v(), ['cb', 'cl']), { cb: PL, cl: `Pending ${hms(T0 + 2000)}` });
  r.link.rx(res('abcd1234-1'));
  r.link.pick(2);
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'l2', 'la', 'e1', 'cb']), { nm: 'Seated row', sp: 'SET 3 OF 4', l2: '135 lb x 6', la: '', e1: AC, cb: AC }, 'its own draft effort');
  r.link.complete();
  assert.deepEqual(only(r.cmds()[1], ['setId', 'expectedRev', 'load', 'reps', 'effort']), { setId: 'set_r3', expectedRev: 2, load: { value: 135, unit: 'lb' }, reps: 6, effort: 'easy' });
  r.link.rx(res('abcd1234-2'));
  r.link.pick(3);
  assert.deepEqual(only(r.v(), ['nm', 'l2', 'set', 'can']), { nm: 'Plank', l2: 'Log on phone', set: false, can: false });
  r.link.complete();
  r.link.pick(0);
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'l2']), { nm: 'Bench press', sp: 'SET 2 OF 3', l2: '60 kg x 8' }, 'the phone exercise again, numbered by the snap');
  r.link.complete();
  assert.deepEqual(r.cmds().map((c) => c.setId), ['set_c1', 'set_r3', 'set_b2']);
  r.link.pick(7);
  assert.equal(r.v().nm, 'Bench press', 'no row: nothing changes');
});

test('V2 the pick holds across a snap with the same eid; it clears on a new eid, a new sid, or when its row leaves the plan', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.pick(1);
  r.adv(5000);
  r.link.rx(snap({ pt: T0 + 5000, srev: 4 }));
  r.link.rx(plan({ srev: 4 }));
  assert.equal(r.v().nm, 'Chest press', 'same eid: the pick holds');
  // Its set is saved: the next plan carries its next set, and the pick stays on it.
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snap({ srev: 5 }));
  assert.equal(r.v().can, false, 'saved: locked until the plan moves on');
  const next = { ...ROWS[1], d: 1, set: { ...ROWS[1].set, id: 'set_c2' } };
  r.link.rx(plan({ srev: 5, rows: [ROWS[0], next, ROWS[2]] }));
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'can']), { nm: 'Chest press', sp: 'SET 2 OF 3', can: true });
  r.link.rx(snap({ eid: 'e_row', ex: 'Seated row', si: 3, sn: 4, set: ROWS[2].set, lt: null }));
  assert.equal(r.v().nm, 'Seated row', 'a new eid clears it');
  r.link.rx(snap());
  assert.equal(r.v().nm, 'Bench press', 'and it stays cleared');
  r.link.pick(2);
  r.link.rx(plan({ rows: [ROWS[0], ROWS[1], ROWS[3]] }));
  assert.equal(r.v().nm, 'Bench press', 'its row left the plan');
  r.link.rx(plan());
  assert.equal(r.v().nm, 'Bench press', 'and it stays cleared');
  r.link.pick(1);
  r.link.rx(snap({ sid: 's_2' }));
  r.link.rx(plan({ sid: 's_2' }));
  assert.equal(r.v().nm, 'Bench press', 'a new sid clears it');
});

test('V3 Back in sync shows for 3 ticks once the outbox empties after being offline with something pending, and only then', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  for (let i = 0; i < 26; i++) r.tick();
  assert.equal(r.v().sc, 4);
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  r.link.rx(res('abcd1234-1'));
  const seen = [];
  for (let i = 0; i < 4; i++) { seen.push(r.v().sc); r.tick(); }
  assert.deepEqual(seen, [5, 5, 5, 1]);
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  r.link.complete();
  r.tick(); r.tick();
  r.link.rx(res('abcd1234-2'));
  assert.equal(r.v().sc, 1, 'pending 2 s but online all along: no Back in sync');
  // Counts what was saved; two actions, and the rest it is in.
  const b = await rig({ code: null });
  b.link.rx(snap({ rest: rest1 }));
  b.link.complete();
  b.link.rest('rest_skip');
  for (let i = 0; i < 26; i++) b.tick();
  b.link.rx(snap({ rest: rest1 }));
  b.link.rx(res('abcd1234-1'));
  assert.deepEqual(only(b.v(), ['sc', 'sl']), { sc: 2, sl: '1 pending' }, 'online again, one still pending');
  b.link.rx(res('abcd1234-2'));
  assert.deepEqual(only(b.v(), ['sc', 'na', 'rest']), { sc: 5, na: '2 actions', rest: `Rest ${b.v().rc}` });
  // An outbox that empties with a refusal shows the reason instead.
  const c = await rig({ code: null });
  c.link.rx(snap());
  c.link.complete();
  for (let i = 0; i < 26; i++) c.tick();
  c.link.rx(snap());
  c.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'already_committed' }));
  assert.deepEqual(only(c.v(), ['sc', 'sl']), { sc: 1, sl: 'Changed on phone' });
});

test('V3 Rest comes only from a snap rest; "Set N saved" only on the rest that the watch save started', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  assert.equal(r.v().sc, 1, 'sent: Set with Pending');
  r.link.rx(res('abcd1234-1'));
  assert.equal(r.v().sc, 1, 'saved, but no rest from the phone yet');
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: rest1 }));
  assert.deepEqual(only(r.v(), ['sc', 'sl', 'ns']), { sc: 2, sl: 'Set 2 saved', ns: 'Set 3 of 3, 60 kg x 8' });
  r.link.rest('rest_add_30');
  r.link.rx(res('abcd1234-2'));
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: { ...rest1, left: 120000 } }));
  assert.equal(r.v().sl, 'Set 2 saved', 'the same rest');
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: { ...rest1, id: 'rest_2' } }));
  assert.equal(r.v().sl, '', 'a rest the phone started');
  // A save with no rest after it: a later rest is not that save's.
  const b = await rig({ code: null });
  b.link.rx(snap());
  b.link.complete();
  b.link.rx(res('abcd1234-1'));
  b.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  b.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: rest1 }));
  assert.deepEqual(only(b.v(), ['sc', 'sl']), { sc: 2, sl: '' });
  // A picked set's number.
  const c = await rig({ code: null });
  c.link.rx(snap());
  c.link.rx(plan());
  c.link.pick(2);
  c.link.complete();
  c.link.rx(res('abcd1234-1'));
  c.link.rx(snap({ rest: rest1 }));
  assert.equal(c.v().sl, 'Set 3 saved');
});

test('V3 a hello goes 2 ticks after each applied result, and not after other results', async () => {
  const r = await rig({ code: 207 });
  r.link.rx(snap({ rest: rest1 }));
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  const h = r.hellos();
  r.tick();
  assert.equal(r.hellos(), h);
  r.tick();
  assert.equal(r.hellos(), h + 1);
  for (let i = 0; i < 5; i++) r.tick();
  assert.equal(r.hellos(), h + 1, 'once');
  r.link.rest('rest_skip');
  r.link.rx(res('abcd1234-2', { status: 'rejected', reason: 'stale_rest' }));
  r.link.rest('rest_add_30');
  r.link.rx(res('abcd1234-3', { status: 'not_saved' }));
  for (let i = 0; i < 5; i++) r.tick();
  assert.equal(r.hellos(), h + 1, 'not after a refusal or not_saved');
  r.link.rx(res('abcd1234-3'));
  r.tick(); r.tick();
  assert.equal(r.hellos(), h + 2);
  assert.equal(JSON.parse(r.sent.filter((x) => JSON.parse(x).k === 'hello').pop()).app, '1.2.0');
});

test('V4 a bad plan changes nothing: wrong types, toString tricks, over 2,048 characters, not JSON', async () => {
  const obj = { toString: 1, valueOf: 1 };
  const bad = [
    { sid: 5 }, { sid: null }, { sid: obj }, { srev: '3' }, { sd: '8' }, { st: obj }, { sd: null }, { rows: 'x' }, { rows: { 0: ROWS[0], length: 1 } }, { rows: null },
    { rows: [null] }, { rows: ['e_bench'] }, { rows: [{ ...ROWS[1], id: 7 }] }, { rows: [{ ...ROWS[1], ex: obj }] }, { rows: [{ ...ROWS[1], d: '0' }] },
    { rows: [{ ...ROWS[1], n: obj }] }, { rows: [{ ...ROWS[1], set: { ...ROWS[1].set, rev: obj } }] }, { rows: [{ ...ROWS[1], set: { ...ROWS[1].set, u: 'st' } }] },
    { rows: [{ ...ROWS[1], set: { ...ROWS[1].set, w: '54' } }] }, { rows: [{ ...ROWS[1], set: { ...ROWS[1].set, e: obj } }] }, { rows: [{ ...ROWS[1], set: 'set_c1' }] },
    { rows: [{ ...ROWS[1], lt: 'x' }] }, { rows: [{ ...ROWS[1], lt: { w: obj, u: 'kg', r: 8 } }] }, { rows: [{ ...ROWS[1], lt: { w: 52, u: 'x', r: 10 } }] },
    { rows: [ROWS[0], ROWS[1], { ...ROWS[2], d: obj }] }, { pad: 'x'.repeat(2048) },
  ];
  const texts = [...bad.map((o) => plan(o)), plan().slice(0, -1), 'plan', JSON.stringify({ t: 'mw', v: 1, k: 'plan' })];
  const r = await rig({ code: null });
  r.link.rx(snap());
  const before = r.v();
  for (const t of texts) {
    assert.doesNotThrow(() => { r.link.rx(t); r.link.next(); r.link.pick(1); r.tick(); }, t);
    assert.deepEqual(r.v(), { ...before, ck: r.v().ck }, t);
  }
  // A bad plan after a good one leaves the good one.
  r.link.rx(plan());
  r.link.next();
  const up = r.v();
  assert.equal(up.sc, 3);
  for (const t of texts) {
    r.link.rx(t);
    assert.deepEqual(r.v(), { ...up, ck: r.v().ck }, t);
  }
  // A snap with a bad eid or lt is refused as a whole, as any bad snap is.
  for (const o of [{ eid: 5 }, { eid: obj }, { lt: 'x' }, { lt: { w: obj, u: 'kg', r: 8 } }, { lt: { w: 5, u: 'stone', r: 8 } }, { ex: 'Row', lt: { w: 5, u: 'kg', r: '8' } }]) {
    r.link.rx(snap({ ex: 'Row', ...o }));
    assert.equal(r.v().r0, 'Bench press', JSON.stringify(o));
  }
  r.link.next('down');
  assert.equal(r.v().nm, 'Bench press');
});
