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
  const r = { sent: [], dones: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store() };
  const io = {
    store: r.store, now: () => (o.now ? o.now(t) : t), keep: () => {}, paint: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); },
    send: (text, done) => { r.sent.push(text); r.dones.push(done); if (r.code !== null) done(r.code); },
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
  // WATCH-C2 fix round (red team R1): an ended rest leaves page 0 to Set (was: Rest at 0:00)
  assert.deepEqual(only(r.v(), ['sc', 'rc', 'add']), { sc: 1, rc: '0:00', add: false });
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

// WATCH-C2 fix round: the review and red team of 1c6b2d81 (R1, R8, the pick lock, numbering, surviving mutations,
// page data, the header clock, remount churn).

/** index.js run with a fake link: its page data object, each key paint() writes in order, and paint(view). */
function pageRig() {
  let src = readFileSync(path.join(PAGE, 'index.js'), 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let cur, io;
  const link = { start() {}, tick() {}, show() {}, view: () => cur };
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, '', '', (x) => { io = x; return link; }, () => 'b', () => 0);
  const order = [], log = [], page = {};
  for (const k of Object.keys(def.data)) {
    let x = def.data[k];
    Object.defineProperty(page, k, { enumerable: true, configurable: true, get: () => x, set: (y) => { order.push(k); log.push([k, y]); x = y; } });
  }
  def.onInit.call(page);
  return { def, page, order, log, paint(v) { cur = v; order.length = 0; log.length = 0; io.paint(); } };
}
/** index.hml as the watch draws it: the header and the shown screen, from the page data paint() leaves. */
const HML = readFileSync(path.join(PAGE, 'index.hml'), 'utf8');
const PG = pageRig();
/** The screen for a view: draw() of the page after paint(v), and the keys that paint wrote. */
function screen(v) {
  PG.paint(v);
  return { ...draw(PG.page), written: [...PG.order] };
}
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
/** Lines (texts in order) and colours (bound backgrounds in order) on the screen for page data d, and the keys it reads. */
function draw(d) {
  const keys = new Set(), get = (k) => (k in d ? (keys.add(k), d[k]) : assert.fail(`not page data: ${k}`));
  const holds = (c) => { const m = /^\{\{(!?)(\w+)(?:==(\d+))?\}\}$/.exec(c) ?? assert.fail(`condition ${c}`); const x = m[3] === undefined ? !!get(m[2]) : get(m[2]) == +m[3]; return m[1] ? !x : x; };
  const lines = [], colours = [];
  const walk = (node) => {
    let last = true;
    for (const n of node.kids) {
      if (n.text !== undefined) { lines.push(n.text.replace(/\{\{(\w+)\}\}/g, (_, k) => get(k))); continue; }
      const on = 'if' in n.attrs ? holds(n.attrs.if) : 'else' in n.attrs ? !last : true;
      if ('if' in n.attrs) last = on;
      if (!on) continue;
      const bg = /background-color:\{\{(\w+)\}\}/.exec(n.attrs.style ?? '');
      if (bg) colours.push(get(bg[1]));
      walk(n);
    }
  };
  walk(tree(HML));
  return { lines, colours, keys: [...keys] };
}

test('fix R1: page 0 is Set once the rest has run out, online and offline; a paused rest with time left stays on Rest', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  assert.equal(r.v().sc, 2, 'Rest while it runs');
  r.adv(91000);
  r.link.rx(snap({ pt: T0 + 91000, rest: { ...rest1, left: 0 } }));
  assert.equal(r.v().sc, 1, 'the phone keeps an ended rest (left 0): Set and its Complete');
  assert.deepEqual(screen(r.v()).lines, ['M/ARC', hm(T0 + 91000), 'Bench press', '>', 'SET 2 OF 3', 'Target', '60 kg x 8', 'Last time 57.5 kg x 8',
    'Easy', 'Ideal', 'Max', 'Complete set', '']);
  r.adv(30000);
  assert.deepEqual(only(r.v(), ['sc', 'off']), { sc: 1, off: 1 }, 'offline: Set stays usable');
  r.link.complete();
  assert.equal(r.cmds().at(-1).kind, 'complete_set', 'the set is queued offline');
  const p = await rig({ code: null });
  p.link.rx(snap({ rest: { ...rest1, left: 0, p: true } }));
  assert.equal(p.v().sc, 1, 'a paused rest at 0 is over too');
  const q = await rig({ code: null });
  q.link.rx(snap({ rest: { ...rest1, left: 40000, p: true } }));
  q.adv(60000);
  q.link.rx(snap({ pt: T0 + 60000, rest: { ...rest1, left: 40000, p: true } }));
  assert.equal(q.v().sc, 2, 'a paused rest with time left stays on Rest');
  // The status line has the same rule: "Set N saved" and the rest's Pending show only while the rest runs.
  const s = await rig({ code: null });
  s.link.rx(snap());
  s.link.complete();
  s.link.rx(res('abcd1234-1'));
  s.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: { ...rest1, left: 20000 } }));
  s.link.rest('rest_add_30');
  assert.deepEqual(only(s.v(), ['sc', 'sl']), { sc: 2, sl: `Pending ${hms(T0)}` });
  s.link.rx(res('abcd1234-2'));
  assert.deepEqual(only(s.v(), ['sc', 'sl']), { sc: 2, sl: 'Set 2 saved' });
  s.adv(21000);
  assert.deepEqual(only(s.v(), ['sc', 'sl']), { sc: 1, sl: '' }, 'the rest ran out: Set, and no "Set 2 saved" under its Complete');
  s.link.complete();
  assert.deepEqual(only(s.v(), ['sc', 'cl', 'sl']), { sc: 1, cl: `Pending ${hms(T0 + 21000)}`, sl: '' }, 'its Pending is on the Complete pill only');
});

test('fix R8: after offline, a refusal is not covered by a later Saved, and its batch shows no Back in sync', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.adv(30000);
  r.link.complete();
  r.link.pick(1);
  r.link.complete();
  r.adv(2000);
  const answer = (o) => r.link.rx(res(r.cmds().at(-1).commandId, o));
  answer({ status: 'rejected', reason: 'stale_revision' });
  answer();
  const seen = [];
  for (let i = 0; i < 5; i++) { const v = r.v(); seen.push(`${v.sc} ${v.st}`); r.adv(1000); }
  assert.deepEqual(seen, Array(5).fill('1 Changed on phone'));
  assert.equal(r.v().sl, 'Changed on phone');
  // The batch is over: the next set online shows Saved again.
  r.link.pick(0);
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  r.link.complete();
  r.link.rx(res('abcd1234-3'));
  assert.equal(r.v().st, 'Saved');
  // A batch with a refusal last shows its reason too.
  const b = await rig({ code: null });
  b.link.rx(snap());
  b.link.rx(plan());
  b.adv(30000);
  b.link.complete();
  b.link.pick(1);
  b.link.complete();
  b.adv(2000);
  b.link.rx(res('abcd1234-1'));
  b.link.rx(res('abcd1234-2', { status: 'rejected', reason: 'session_closed' }));
  assert.deepEqual(only(b.v(), ['sc', 'st']), { sc: 1, st: 'Workout ended' });
});

test('fix: picking another row and back keeps a just-saved set locked until the phone moves on', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.pick(1);
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  assert.equal(r.v().can, false, 'saved: locked');
  r.link.pick(2);
  assert.deepEqual(only(r.v(), ['nm', 'can']), { nm: 'Seated row', can: true }, 'another exercise is free');
  r.link.pick(1);
  assert.deepEqual(only(r.v(), ['nm', 'can', 'cb']), { nm: 'Chest press', can: false, cb: PL }, 'back on the saved set: still locked');
  r.link.complete();
  assert.equal(r.cmds().length, 1, 'no second command for it');
  r.link.rx(plan({ srev: 4, rows: [ROWS[0], { ...ROWS[1], d: 1, set: { ...ROWS[1].set, id: 'set_c2' } }, ROWS[2], ROWS[3]] }));
  assert.deepEqual(only(r.v(), ['nm', 'sp', 'can']), { nm: 'Chest press', sp: 'SET 2 OF 3', can: true }, 'the plan moved on');
  // The same for the phone's own exercise: saved, a pick away and back, locked until the snap moves on.
  const s = await rig({ code: null });
  s.link.rx(snap());
  s.link.rx(plan());
  s.link.complete();
  s.link.rx(res('abcd1234-1'));
  s.link.pick(1);
  s.link.pick(0);
  assert.deepEqual(only(s.v(), ['nm', 'can']), { nm: 'Bench press', can: false });
  s.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  assert.equal(s.v().can, true);
});

// Seated row: 4 sets, set 1 committed, set 2 skipped, set 3 open. The snap counts every set (SET 3 OF 4); the plan
// counts the sets not skipped (d 1 of n 3: SET 2 OF 3).
const SK = { ...ROWS[2], d: 1, n: 3 };
const snapSK = (o = {}) => snap({ eid: 'e_row', ex: 'Seated row', si: 3, sn: 4, set: SK.set, lt: null, ...o });

test('fix: one numbering rule, from the plan row, for the shown exercise as for a picked one (a skipped set makes them differ)', async () => {
  const r = await rig({ code: null });
  r.link.rx(snapSK());
  assert.deepEqual(only(r.v(), ['sp', 'l1']), { sp: 'SET 3 OF 4', l1: 'Seated row 3/4' }, 'no plan yet: the snap');
  r.link.rx(plan({ rows: [SK, ROWS[0], ROWS[1]] }));
  assert.deepEqual(only(r.v(), ['sc', 'sp', 'l1']), { sc: 1, sp: 'SET 2 OF 3', l1: 'Seated row 3/4' }, 'row 0 with a skipped set; l1 stays as in 1.1.2');
  assert.equal(screen(r.v()).lines[4], 'SET 2 OF 3');
  r.link.complete();
  r.link.rx(res('abcd1234-1'));
  r.link.rx(snapSK({ rest: rest1, si: 4, set: { ...SK.set, id: 'set_r4' } }));
  assert.deepEqual(only(r.v(), ['sc', 'sl']), { sc: 2, sl: 'Set 2 saved' });
  r.link.rx(plan({ rows: [{ ...SK, d: 2, set: { ...SK.set, id: 'set_r4' } }, ROWS[0], ROWS[1]] }));
  assert.deepEqual(screen(r.v()).lines.slice(4, 7), ['Set 2 saved', 'Next: Seated row', 'Set 3 of 3, 135 lb x 6']);
  // A plan that has not caught up with the snap's set yet: the snap's numbers until it does.
  r.link.rx(snapSK({ si: 4, set: { ...SK.set, id: 'set_r5' } }));
  assert.equal(r.v().sp, 'SET 4 OF 4');
  // A picked row is numbered by its row; the shown exercise again by its own row.
  r.link.rx(snapSK({ si: 4, set: { ...SK.set, id: 'set_r4' } }));
  r.link.pick(1);
  assert.deepEqual(only(r.v(), ['nm', 'sp']), { nm: 'Bench press', sp: 'SET 2 OF 3' });
  r.link.pick(0);
  assert.deepEqual(only(r.v(), ['nm', 'sp']), { nm: 'Seated row', sp: 'SET 3 OF 3' });
});

test('fix: surviving mutations: one left or right swipe each keeps the page; a picked effort resets with its next set; a pending +30 s keeps Complete set', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.rx(plan());
  for (const d of ['left', 'right']) {
    r.link.next(d);
    assert.equal(r.v().sc, 1, `${d} on page 0`);
    r.link.next('up');
    r.link.next(d);
    assert.equal(r.v().sc, 3, `${d} on page 1`);
    r.link.next('down');
  }
  // An effort chosen on a picked set is a draft for that set only.
  r.link.pick(1);
  r.link.effort(3);
  assert.deepEqual(only(r.v(), ['e1', 'e2', 'e3']), { e1: PL, e2: PL, e3: AC });
  r.link.rx(plan({ srev: 4 }));
  assert.equal(r.v().e3, AC, 'the same set: it stays');
  r.link.rx(plan({ srev: 5, rows: [ROWS[0], { ...ROWS[1], d: 1, set: { ...ROWS[1].set, id: 'set_c2' } }, ROWS[2], ROWS[3]] }));
  assert.deepEqual(only(r.v(), ['nm', 'e1', 'e2', 'e3']), { nm: 'Chest press', e1: PL, e2: PL, e3: PL }, 'the plan moved to its next set');
  // A rest command waiting for its result is not the set's: Complete stays free.
  const s = await rig({ code: null });
  s.link.rx(snap({ rest: { ...rest1, left: 5000 } }));
  s.link.rest('rest_add_30');
  s.adv(6000);
  assert.deepEqual(only(s.v(), ['sc', 'cl', 'can', 'cb']), { sc: 1, cl: 'Complete set', can: true, cb: AC });
});

test('fix: paint() writes only the page data, the screen, then its inner if-parts last; every key the shown screen reads is written by each paint', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  const v = r.v(), P = pageRig();
  P.paint(v);
  assert.deepEqual(Object.keys(P.page), Object.keys(P.def.data), 'no other keys on the page (view has eff, st, p1 and more)');
  assert.ok(Object.keys(v).some((k) => !(k in P.def.data)));
  for (const k of ['nm', 'cl', 'set', 'off', 'ck', 'sc']) assert.equal(P.page[k], v[k], k);
  // final check of 611b09c8: a new screen is built with set and t1 off, and gets them after, so no build runs inside another
  assert.deepEqual(P.order.slice(-3), ['sc', 'set', 't1']);
  assert.equal(P.order.filter((k) => k === 'sc').length, 1);
  assert.deepEqual(P.log.slice(0, 2), [['set', false], ['t1', '']], 'the inner parts go off before the screen changes');
  P.paint(v);
  assert.ok(!P.log.some(([k, y]) => k === 'set' && y === false), 'no screen change, no off and on');
  // Every screen: each key its lines, colours and conditions read is written by the paint, so none keeps an old value.
  const seen = new Set();
  const look = (a) => { const v1 = a.v(), d = screen(v1); seen.add(v1.sc); for (const k of d.keys) assert.ok(d.written.includes(k), `${k} on screen ${v1.sc}`); };
  for (const s of [snap(), snap({ rest: rest1 }), snap({ sid: null, eid: null, ex: null, si: 0, sn: 0, set: null, lt: null })]) {
    const a = await rig({ code: null });
    a.link.rx(s);
    look(a);
    a.link.rx(plan());
    a.link.next();
    look(a);
    a.link.complete();
    a.adv(30000);
    look(a);
  }
  const b = await rig({ code: null });
  b.link.rx(snap());
  b.link.complete();
  for (let i = 0; i < 26; i++) b.tick();
  b.link.rx(res('abcd1234-1'));
  look(b);
  assert.deepEqual([...seen].sort(), [0, 1, 2, 3, 4, 5]);
});

test('fix: each screen shows its card lines from the shared slots, and a bound colour is always a colour', async () => {
  const r = await rig({ code: null });
  const colours = Object.keys(PG.def.data).filter((k) => /^c\d$/.test(k));
  assert.equal(colours.length, 4);
  const at = (want, bg = []) => {
    const v = r.v(), d = screen(v);
    assert.deepEqual(d.lines, v.off ? ['Phone not connected', ...want] : ['M/ARC', v.ck, ...want], `screen ${v.sc}`);
    assert.deepEqual(d.colours, bg, `screen ${v.sc} colours`);
    // also while the screen they are for is closed (paint() writes the screen last, so the closing one gets them first)
    for (const k of colours) assert.match(PG.page[k], /^#[0-9a-f]{6}$/, `${k} on screen ${v.sc}`);
  };
  at(['', ''], []); // the first 5 s, before the phone answers
  r.link.rx(snap({ sid: null, eid: null, ex: null, si: 0, sn: 0, set: null, lt: null }));
  at(['Start your workout', 'in M/ARC on your phone']);
  r.link.rx(snap());
  r.link.rx(plan());
  at(['Bench press', '>', 'SET 2 OF 3', 'Target', '60 kg x 8', 'Last time 57.5 kg x 8', 'Easy', 'Ideal', 'Max', 'Complete set', ''], [PL, PL, PL, AC]);
  r.link.next();
  at(['UP NEXT', '8 of 21 sets done', 'Bench press', '1/3', 'Chest press', '0/3', 'Seated row', '2/4', 'Plank', '0/2'], [AC, PL, PL, PL]);
  r.link.pick(2);
  at(['Seated row', '>', 'SET 3 OF 4', 'Target', '135 lb x 6', '', 'Easy', 'Ideal', 'Max', 'Complete set', ''], [AC, PL, PL, AC]);
  r.link.rx(snap({ rest: rest1 }));
  at(['REST', '1:30', '', 'Next: Seated row', 'Set 3 of 4, 135 lb x 6', 'Change', '+30 s', 'Skip']);
  r.link.rx(snap());
  r.link.complete();
  r.adv(30000);
  at(['1 action', 'Pending', '', 'Open M/ARC', 'on your phone']);
  r.link.rx(snap({ rest: rest1 }));
  r.link.rx(res('abcd1234-1'));
  at(['Phone connected', 'Saved', '1 action', 'Rest 1:30']);
  r.link.rx(JSON.stringify({ t: 'mw', v: 2, k: 'snap' }));
  at(['Update needed', '']);
});

test('fix: the header clock is the phone-corrected time, as the Pending time is', async () => {
  const r = await rig({ code: null, now: (t) => t - 90000 }); // the watch clock 90 s behind the phone
  const h = r.sent.map((x) => JSON.parse(x)).find((m) => m.k === 'hello');
  assert.notEqual(hm(h.wt), hm(T0), 'the minutes differ');
  r.link.rx(snap({ wt: h.wt, pt: T0 }));
  assert.equal(r.v().ck, hm(T0));
  r.link.complete();
  assert.deepEqual(only(r.v(), ['ck', 'cl']), { ck: hm(T0), cl: `Pending ${hms(T0)}` });
});

test('fix: a phone whose messages arrive while every send fails keeps Phone not connected, with no flip on each snap (red team s8)', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap());
  r.link.complete();
  r.dones.at(-1)(206);
  assert.deepEqual(only(r.v(), ['sc', 'off']), { sc: 4, off: 1 });
  const seen = [];
  for (let i = 0; i < 5; i++) {
    r.adv(3000);
    r.link.rx(snap()); // the phone's message arrives; the watch sends the set again
    seen.push(`${r.v().sc}${r.v().off}`);
    r.dones.at(-1)(206); // and that send fails
    seen.push(`${r.v().sc}${r.v().off}`);
  }
  assert.deepEqual(seen, Array(10).fill('41'));
  r.adv(3000);
  r.link.rx(snap());
  r.dones.at(-1)(207);
  assert.deepEqual(only(r.v(), ['sc', 'off', 'cl']), { sc: 1, off: 0, cl: `Pending ${hms(T0)}` }, 'a send that goes through ends it');
  // Offline only by its failing sends, the outbox still ends in Back in sync.
  const b = await rig({ code: null });
  b.link.rx(snap());
  b.link.complete();
  b.dones.at(-1)(206);
  b.link.rx(snap()); // the failure is cleared by the message, the send again is under way
  b.tick();
  assert.deepEqual(only(b.v(), ['sc', 'off']), { sc: 4, off: 1 });
  b.dones.at(-1)(207);
  b.link.rx(res('abcd1234-1'));
  assert.deepEqual(only(b.v(), ['sc', 'na']), { sc: 5, na: '1 action' });
  // With nothing pending, a phone message clears the warning at once (1.1.2), and an old failure does not come back
  // with the next Complete while its send is under way.
  const e = await rig({ code: null });
  e.link.rx(snap());
  e.link.show();
  e.dones.at(-1)(206);
  assert.equal(e.v().off, 1);
  e.link.rx(snap());
  assert.deepEqual(only(e.v(), ['sc', 'off']), { sc: 1, off: 0 });
  e.link.complete();
  assert.deepEqual(only(e.v(), ['sc', 'off', 'cl']), { sc: 1, off: 0, cl: `Pending ${hms(T0)}` });
});

// Final check of 611b09c8 (review and red team).
test('final check: a refusal with another command queued keeps its reason online and after a restart; the next saved set shows Saved', async () => {
  const r = await rig();
  r.link.rx(snap());
  r.link.rx(plan());
  r.link.complete();
  r.link.pick(1);
  r.link.complete();
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  r.link.rx(res('abcd1234-2'));
  assert.deepEqual(only(r.v(), ['sc', 'st']), { sc: 1, st: 'Changed on phone' });
  r.link.pick(0);
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  r.link.complete();
  r.link.rx(res('abcd1234-3'));
  assert.equal(r.v().st, 'Saved');
  // Two queued offline, then the app restarts next to the phone: the restored pair keeps the refusal too.
  const a = await rig({ code: null });
  a.link.rx(snap());
  a.link.rx(plan());
  a.link.complete();
  a.link.pick(1);
  a.link.complete();
  const b = await rig({ store: a.store });
  b.link.rx(snap());
  b.link.rx(plan());
  b.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  b.link.rx(res('abcd1234-2'));
  assert.equal(b.v().st, 'Changed on phone');
  b.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' } }));
  b.link.complete();
  b.link.rx(res(b.cmds().at(-1).commandId));
  assert.equal(b.v().st, 'Saved');
});

test('final check: Phone not connected shows the rest only while it has time left', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  r.link.complete();
  r.adv(30000);
  const v = r.v();
  assert.equal(v.sc, 4);
  assert.ok(!screen(v).lines.some((x) => /^Rest /.test(x)), screen(v).lines.join('|'));
  const t = await rig({ code: null });
  t.link.rx(snap({ rest: rest1 }));
  t.link.complete();
  t.adv(30000);
  assert.ok(screen(t.v()).lines.includes('Rest 1:00'), screen(t.v()).lines.join('|'));
});

test('final check: after a refusal, a set tapped and saved later shows Saved; a refusal kept when the link drops before the queued result', async () => {
  const r = await rig();
  r.link.rx(snap({ rest: rest1 }));
  r.link.rx(plan());
  r.link.complete();
  r.link.pick(1);
  r.link.complete();
  r.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
  r.link.pick(0);
  r.link.rx(snap({ si: 3, set: { ...S1, id: 'set_b3' }, rest: rest1 }));
  r.link.complete();
  r.link.rx(res('abcd1234-2'));
  r.link.rx(res(r.cmds().at(-1).commandId));
  assert.equal(r.v().st, 'Saved');
  for (const how of ['silence', 'failed send']) {
    const b = await rig();
    b.link.rx(snap());
    b.link.rx(plan());
    b.link.complete();
    b.link.pick(1);
    b.link.complete();
    if (how !== 'silence') b.code = 206;
    b.link.rx(res('abcd1234-1', { status: 'rejected', reason: 'stale_revision' }));
    b.adv(how === 'silence' ? 30000 : 2000);
    b.tick();
    b.code = 207;
    b.link.rx(res('abcd1234-2'));
    assert.deepEqual(only(b.v(), ['sc', 'st']), { sc: 1, st: 'Changed on phone' }, how);
  }
});
