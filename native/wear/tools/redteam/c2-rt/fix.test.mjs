// Red-making tests for the red team's R1 and R8, run against LINK (default: the worktree head; LINK=mirror for the patched copy).
// Run: node --test fix.test.mjs   |   LINK=mirror node --test fix.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const HEAD = '/home/user/M-arc/.claude/worktrees/wf_c9e8bfb9-540-2/native/wear/app/entry/src/main/js/default/common/link.js';
const MIRROR = '/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-rt/mirror/native/wear/app/entry/src/main/js/default/common/link.js';
const LINK = pathToFileURL(process.env.LINK === 'mirror' ? MIRROR : HEAD).href;
const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);
const S1 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't' };
const rest1 = { id: 'rest_1', left: 90000, tot: 90000, p: false };
const snap = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 3,
  set: S1, lt: null, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o });
const plan = () => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 8, st: 21, rows: [
  { id: 'e_bench', ex: 'Bench press', d: 1, n: 3, set: S1, lt: null },
  { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c1', rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: null }] });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });
const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
async function rig() {
  const { Link } = await import(LINK);
  let t = T0;
  const map = new Map(), sent = [];
  const io = { store: { set(o) { map.set(o.key, o.value); o.success(); }, get(o) { o.success(map.has(o.key) ? map.get(o.key) : o.default); } },
    now: () => t, keep() {}, paint() {}, connect() {}, defer: (fn) => tasks.push(fn), send: (text) => sent.push(text) };
  const link = Link(io, 'abcd1234');
  let ticked = 0;
  const r = { sent, link: {} };
  for (const k of Object.keys(link)) r.link[k] = (...a) => { while (ticked < Math.floor((t - T0) / 1000)) { ticked++; link.tick(); drain(); } const o = link[k](...a); drain(); return o; };
  r.adv = (ms) => { t += ms; r.link.view(); };
  r.v = () => r.link.view();
  r.cmds = () => sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.link.start();
  return r;
}

test('R1 page 0 is Set once the rest has run out, online and offline (card: Rest while the phone\'s rest runs)', async () => {
  const r = await rig();
  r.link.rx(snap({ rest: rest1 }));
  assert.equal(r.v().sc, 2, 'Rest while it runs');
  r.adv(91000);
  r.link.rx(snap({ pt: T0 + 91000, rest: { ...rest1, left: 0 } }));
  assert.equal(r.v().sc, 1, 'the phone keeps an ended rest (left 0): Set and its Complete');
  r.adv(30000);
  assert.deepEqual([r.v().sc, r.v().off], [1, 1], 'offline: Set stays usable');
  r.link.complete();
  assert.equal(r.cmds().at(-1)?.kind, 'complete_set', 'the set is queued offline');
  const p = await rig();
  p.link.rx(snap({ rest: { ...rest1, left: 0, p: true } }));
  assert.equal(p.v().sc, 1, 'a paused rest at 0 is over too');
  const q = await rig();
  q.link.rx(snap({ rest: { ...rest1, left: 40000, p: true } }));
  q.adv(60000);
  q.link.rx(snap({ pt: T0 + 60000, rest: { ...rest1, left: 40000, p: true } }));
  assert.equal(q.v().sc, 2, 'a paused rest with time left stays on Rest');
});

test('R8 after offline, a rejected set is not covered by Back in sync "Saved"', async () => {
  const r = await rig();
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(30000);
  r.link.complete(); r.link.pick(1); r.link.complete(); r.adv(2000);
  const answer = (o) => r.link.rx(res(r.cmds().at(-1).commandId, o));
  answer({ status: 'rejected', reason: 'stale_revision' });
  answer();
  const seen = [];
  for (let i = 0; i < 5; i++) { seen.push(r.v().sc === 5 ? 'Back in sync' : r.v().sl); r.adv(1000); }
  assert.ok(seen.includes('Changed on phone'), `the rejection stays visible: ${JSON.stringify(seen)}`);
});
