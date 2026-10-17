// The online / restart refusal: head, the fix without an unconditional reset (L0), and with it (L1).
// Run: node --test c.test.mjs
import { test } from 'node:test';
import { pathToFileURL } from 'node:url';

const D = '/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/c2-final/rt3/var/';
const LINKS = { head: '/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2/native/wear/app/entry/src/main/js/default/common/link.js', L0: D + 'L0/link.js', L1: D + 'L1/link.js' };
const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);
const S1 = { id: 'set_b2', rev: 1, w: 60, u: 'kg', r: 8, e: null, src: 't' };
const ROWS = [
  { id: 'e_bench', ex: 'Bench press', d: 1, n: 3, set: S1, lt: null },
  { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c1', rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: null },
  { id: 'e_row', ex: 'Seated row', d: 2, n: 4, set: { id: 'set_r3', rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
];
const snap = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: T0, wt: null, srev: 3, sid: 's_1', eid: 'e_bench', ex: 'Bench press', si: 2, sn: 3,
  set: S1, lt: null, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'], ...o });
const plan = (o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's_1', srev: 3, sd: 8, st: 21, rows: ROWS, ...o });
const res = (commandId, o = {}) => JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId, status: 'applied', sessionRev: 4, replayed: false, ...o });
const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
function store() { const map = new Map(); return { map, set(o) { map.set(o.key, o.value); o.success(); }, get(o) { o.success(map.has(o.key) ? map.get(o.key) : o.default); } }; }
async function rig(url, o = {}) {
  const { Link } = await import(pathToFileURL(url).href);
  let t = T0;
  const r = { sent: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store() };
  const io = { store: r.store, now: () => t, keep() {}, paint() {}, connect() {}, defer: (f) => tasks.push(f), send: (x, done) => { r.sent.push(x); if (r.code !== null) done(r.code); } };
  const link = Link(io, o.boot ?? 'abcd1234');
  let ticked = 0;
  r.link = {};
  for (const k of Object.keys(link)) r.link[k] = (...a) => { while (ticked < Math.floor((t - T0) / 1000)) { ticked++; link.tick(); drain(); } const out = link[k](...a); drain(); return out; };
  r.adv = (ms) => { t += ms; r.link.view(); };
  r.v = () => r.link.view();
  r.last = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd').at(-1).commandId;
  r.link.start();
  return r;
}
const show = (r) => { const v = r.v(); return `sc ${v.sc} st '${v.st}' sl '${v.sl}'`; };

for (const [name, url] of Object.entries(LINKS)) {
  test(`${name}: online, two queued, 1st refused, 2nd applied; then a later set`, async () => {
    const r = await rig(url);
    r.link.rx(snap()); r.link.rx(plan());
    r.link.complete(); r.link.pick(1); r.link.complete();
    r.link.rx(res(r.last(), { status: 'rejected', reason: 'stale_revision' }));
    r.link.rx(res(r.last()));
    const a = show(r);
    r.link.rx(snap({ set: { ...S1, id: 'set_b3' }, si: 3 })); r.link.rx(plan({ rows: [{ ...ROWS[0], d: 2, set: { ...S1, id: 'set_b3' } }, ...ROWS.slice(1)] }));
    r.link.pick(0); r.link.complete(); r.link.rx(res(r.last()));
    console.log(`${name} online: after the pair ${a} | a later set ${show(r)}`);
  });
  test(`${name}: restart with two restored, 1st refused, 2nd applied; then a later set`, async () => {
    const st = store();
    const a = await rig(url, { code: null, store: st });
    a.link.rx(snap()); a.link.rx(plan()); a.adv(30000);
    a.link.complete(); a.link.pick(1); a.link.complete(); a.adv(2000); a.link.die();
    const b = await rig(url, { store: st, boot: 'efgh5678' });
    b.link.rx(snap()); b.link.rx(plan()); b.adv(2000);
    b.link.rx(res(b.last(), { status: 'rejected', reason: 'stale_revision' }));
    b.link.rx(res(b.last()));
    const x = show(b);
    b.link.rx(snap({ set: { ...S1, id: 'set_b3' }, si: 3 })); b.link.rx(plan({ rows: [{ ...ROWS[0], d: 2, set: { ...S1, id: 'set_b3' } }, ...ROWS.slice(1)] }));
    b.link.complete(); b.link.rx(res(b.last()));
    console.log(`${name} restart: after the pair ${x} | a later set ${show(b)}`);
  });
}
