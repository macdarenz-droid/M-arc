// Red team probes for WATCH-C2 @ 1c6b2d81 on the watch's own common/link.js (worktree copy) and, for comparison, 1.1.2's.
// Run: node --test rt.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const WT = '/home/user/M-arc/.claude/worktrees/wf_c9e8bfb9-540-2';
const LINK = pathToFileURL(WT + '/native/wear/app/entry/src/main/js/default/common/link.js').href;
const LINK112 = pathToFileURL('/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/link112.mjs').href;

const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);
const S1 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't' };
const ROWS = [
  { id: 'e_bench', ex: 'Bench press', d: 1, n: 3, set: S1, lt: null },
  { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c1', rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: null },
  { id: 'e_row', ex: 'Seated row', d: 2, n: 4, set: { id: 'set_r3', rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
];
const rest1 = { id: 'rest_1', left: 90000, tot: 90000, p: false };
const snap = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 3,
  set: S1, lt: null, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o });
const plan = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 8, st: 21, rows: ROWS, ...o });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });

const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
function store() {
  const map = new Map();
  return { map, set(o) { if (o.value === '' || String(o.value).length >= 128) return o.fail(); map.set(o.key, o.value); o.success(); },
    get(o) { o.success(map.has(o.key) ? map.get(o.key) : o.default); } };
}
async function rig(o = {}) {
  const { Link } = await import(o.url ?? LINK);
  let t = o.t0 ?? T0;
  const t0 = t;
  const r = { sent: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store() };
  const io = { store: r.store, now: () => (o.now ? o.now(t) : t), keep: () => {}, paint: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); },
    send: (text, done) => { r.sent.push(text); if (r.code !== null) done(r.code); } };
  const link = Link(io, 'abcd1234');
  let ticked = 0;
  r.link = {};
  for (const k of Object.keys(link)) r.link[k] = (...a) => { while (ticked < Math.floor((t - t0) / 1000)) { ticked++; link.tick(); drain(); } const out = link[k](...a); drain(); return out; };
  r.adv = (ms) => { t += ms; r.link.view(); };
  r.v = () => r.link.view();
  r.cmds = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.hellos = () => r.sent.filter((x) => JSON.parse(x).k === 'hello').length;
  r.link.start();
  return r;
}
const pick = (v, ks) => Object.fromEntries(ks.map((k) => [k, v[k]]));

// R1: page 0 is Rest for as long as the phone keeps a rest, which it does after the countdown (Train's OK/Skip, stopRest);
// the Complete pill exists only on the Set screen (index.hml sc==1), so no set can be completed during or after a rest
// without a Skip round trip, and offline not at all. 1.1.2 showed Complete with the rest row.
test('R1 an ended rest keeps the Set screen and its Complete away; offline the set cannot be queued', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap({ rest: rest1 }));
  r.link.rx(plan());
  r.adv(200000); // the countdown has long ended; the phone's snap still carries the rest (left 0)
  r.link.rx(snap({ pt: T0 + 200000, rest: { ...rest1, left: 0 } }));
  const v = r.v();
  console.log('R1 online, rest ended:', JSON.stringify(pick(v, ['sc', 'rc', 'add', 'set', 'can', 'cl'])));
  // every way off the Rest screen: Next/Change opens Up next, a pick returns to page 0 = Rest again
  r.link.next(); const up = r.v().sc; r.link.pick(1); const afterPick = r.v().sc; r.link.next('up'); r.link.next('down');
  console.log('R1 Next ->', up, '| pick ->', afterPick, '| swipes ->', r.v().sc);
  // offline: the phone goes away with the ended rest in the last snap
  r.adv(30000);
  console.log('R1 offline, nothing pending:', JSON.stringify(pick(r.v(), ['sc', 'off', 'can'])));
  r.link.rest('rest_skip');
  console.log('R1 offline after Skip:', JSON.stringify(pick(r.v(), ['sc', 'off', 'na', 'can'])), 'cmds', r.cmds().map((c) => c.kind).join(','));
  assert.equal(v.sc, 2, 'Rest, not Set, although the rest is over');
  // 1.1.2: same snaps
  const o = await rig({ url: LINK112, code: null });
  o.link.rx(snap({ rest: { ...rest1, left: 0 } }));
  console.log('R1 1.1.2, rest ended:', JSON.stringify(pick(o.v(), ['set', 'can', 'rs'])), '(Complete is drawn whenever set)');
});

// R2: a hello 2 ticks after each applied result; a phone that answers every hello with snap + plan. Does anything loop?
test('R2 hello after applied: count messages per set with a phone that answers each hello with a snap and a plan', async () => {
  const r = await rig({ code: 207 });
  r.link.rx(snap()); r.link.rx(plan());
  const before = r.sent.length;
  let set = 2;
  for (let i = 0; i < 10; i++) {
    r.link.complete();
    const c = r.cmds().at(-1);
    r.link.rx(res(c.commandId));
    set++;
    r.link.rx(snap({ set: { ...S1, id: 'set_b' + set } }));
    r.link.rx(plan({ rows: [{ ...ROWS[0], set: { ...S1, id: 'set_b' + set } }, ...ROWS.slice(1)] }));
    for (let k = 0; k < 4; k++) {
      r.adv(1000);
      const last = JSON.parse(r.sent.at(-1));
      if (last.k === 'hello' && !last.seen) { r.link.rx(snap({ wt: last.wt, set: { ...S1, id: 'set_b' + set } })); r.link.rx(plan({ rows: [{ ...ROWS[0], set: { ...S1, id: 'set_b' + set } }, ...ROWS.slice(1)] })); last.seen = 1; }
    }
  }
  const kinds = r.sent.slice(before).map((x) => JSON.parse(x).k);
  console.log('R2 watch sends for 10 sets:', JSON.stringify(kinds.reduce((a, k) => ({ ...a, [k]: (a[k] || 0) + 1 }), {})));
});

// R3: a rejected last result after offline pending: no Back in sync, though earlier ones were saved
test('R3 Back in sync after offline: 2 applied then 1 rejected', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(30000);
  r.link.complete(); r.link.pick(1); r.link.complete(); r.link.pick(2); r.link.complete();
  r.adv(2000);
  console.log('R3 offline', JSON.stringify(pick(r.v(), ['sc', 'na'])));
  const answer = (o) => { const c = r.cmds().at(-1); r.link.rx(res(c.commandId, o)); };
  answer(); answer(); answer({ status: 'rejected', reason: 'stale_revision' });
  console.log('R3 after 2 applied + 1 rejected', JSON.stringify(pick(r.v(), ['sc', 'na', 'sl'])), 'cmds', r.cmds().length);
  const b = await rig({ code: null });
  b.link.rx(snap()); b.link.rx(plan()); b.adv(30000);
  b.link.complete(); b.link.pick(1); b.link.complete(); b.adv(2000);
  const ans = (o) => { const c = b.cmds().at(-1); b.link.rx(res(c.commandId, o)); };
  ans(); ans();
  console.log('R3 control, 2 applied', JSON.stringify(pick(b.v(), ['sc', 'na', 'sl'])));
});

// R7: the restart guard (1.1.2 behaviour) on the 1.2.0 link: 2 unclean starts pause; a clean close does not count
test('R7 restart guard', async () => {
  const s = store();
  const seen = [];
  for (let i = 0; i < 3; i++) { const r = await rig({ store: s, code: null }); seen.push(r.v().l1 || '(live)'); }
  console.log('R7 three unclean starts:', JSON.stringify(seen), 'm2r', s.map.get('m2r'));
  const c = store(); const seen2 = [];
  for (let i = 0; i < 3; i++) { const r = await rig({ store: c, code: null }); seen2.push(r.v().l1 || '(live)'); r.link.die(); }
  console.log('R7 three clean closes:', JSON.stringify(seen2), 'm2r', c.map.get('m2r'));
});

// R4: clock header and Pending time with odd Date values and a watch clock off from the phone
test('R4 clock: NaN, epoch 0, far future; header vs Pending when the watch clock is 90 s behind', async () => {
  for (const bad of [NaN, 0, -1, 8.64e15 + 1, 1e300]) {
    const r = await rig({ code: null, now: () => bad });
    r.link.rx(snap());
    const v = r.v();
    console.log('R4 now', bad, '-> ck', JSON.stringify(v.ck), 'sc', v.sc);
  }
  const r = await rig({ code: null, t0: Date.UTC(2026, 9, 17, 10, 0, 50), now: (t) => t - 90000 });
  r.link.rx(JSON.stringify({ ...JSON.parse(snap()), pt: Date.UTC(2026, 9, 17, 10, 0, 50) }));
  r.link.complete();
  console.log('R4 header', r.v().ck, '| Complete pill', r.v().cl);
});

// R5: picked set edited on the phone between the plan and the tap; and committed on the phone
test('R5 a pick whose set the phone edits or commits', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap()); r.link.rx(plan());
  r.link.pick(1); r.link.effort(3);
  // phone edits Chest press set_c1 (rev 1, 60 kg): new plan
  const rows2 = [ROWS[0], { ...ROWS[1], set: { ...ROWS[1].set, rev: 1, w: 60 } }, ROWS[2]];
  r.link.rx(plan({ rows: rows2 }));
  console.log('R5 edited:', JSON.stringify(pick(r.v(), ['nm', 'l2', 'e3', 'can'])));
  // phone commits set_c1 itself: plan moves the row on to set_c2
  const rows3 = [ROWS[0], { ...ROWS[1], d: 1, set: { ...ROWS[1].set, id: 'set_c2', rev: 0 } }, ROWS[2]];
  r.link.rx(snap()); r.link.rx(plan({ sd: 9, rows: rows3 }));
  console.log('R5 committed on phone:', JSON.stringify(pick(r.v(), ['nm', 'sp', 'l2', 'e3', 'can'])));
  // Chest press done on phone: row leaves
  r.link.rx(plan({ sd: 11, rows: [ROWS[0], ROWS[2]] }));
  console.log('R5 row left:', JSON.stringify(pick(r.v(), ['nm', 'sp'])));
});

// R6: hostile plans: 60 rows within 2,048, duplicate ids, empty id, effort not in EFF, huge numbers, unicode names
test('R6 odd plans', async () => {
  const r = await rig({ code: 207 });
  r.link.rx(snap());
  const many = Array.from({ length: 30 }, (_, i) => ({ id: 'e' + i, ex: 'X', d: 0, n: 1, set: null, lt: null }));
  const t = plan({ rows: many });
  console.log('R6 60 rows, length', t.length);
  r.link.rx(t); r.link.next();
  console.log('R6 60 rows ->', JSON.stringify(pick(r.v(), ['sc', 'r0', 'r3', 'n3'])));
  r.link.rx(plan({ rows: [ROWS[0], { ...ROWS[1], id: '' }, { ...ROWS[1], ex: 'Bänk ‮', set: { ...ROWS[1].set, w: 1e21, r: 0.5, e: 'hard' } }] }));
  r.link.next(); r.link.pick(1);
  console.log('R6 empty id pick ->', JSON.stringify(pick(r.v(), ['sc', 'nm'])));
  r.link.next(); r.link.pick(2);
  const v = r.v();
  console.log('R6 odd row ->', JSON.stringify(pick(v, ['sc', 'nm', 'l2', 'e1', 'e2', 'e3', 'can'])));
  r.link.complete();
  console.log('R6 sent', JSON.stringify(r.cmds().at(-1) ?? null));
});

// R9: the watch clock 90 s behind the phone; the start hello's answer sets the offset
test('R9 header clock against the Pending time', async () => {
  const PH = Date.UTC(2026, 9, 17, 10, 0, 50);
  const r = await rig({ code: null, t0: PH, now: (t) => t - 90000 });
  const h = r.sent.map((x) => JSON.parse(x)).find((m) => m.k === 'hello');
  r.link.rx(JSON.stringify({ ...JSON.parse(snap()), wt: h.wt, pt: PH }));
  r.link.complete();
  console.log('R9 header', r.v().ck, '| Complete pill', r.v().cl, '| sent actionAt', new Date(r.cmds()[0].actionAt).toISOString().slice(11, 19));
});

// R8: offline, 2 pending; the first is rejected (edited on the phone, as D5), the second applied
test('R8 Back in sync after a rejection then an applied result', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(30000);
  r.link.complete(); r.link.pick(1); r.link.complete(); r.adv(2000);
  const answer = (o) => { const c = r.cmds().at(-1); r.link.rx(res(c.commandId, o)); };
  answer({ status: 'rejected', reason: 'stale_revision' });
  const mid = pick(r.v(), ['sc', 'sl']);
  answer();
  const shown = [];
  for (let i = 0; i < 5; i++) { const v = r.v(); shown.push(`${v.sc}:${v.na}:${v.sl}`); r.adv(1000); }
  console.log('R8 after the rejection', JSON.stringify(mid), '| then each second:', JSON.stringify(shown));
});
