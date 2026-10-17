// Red team probes for the WATCH-C2 fix round (611b09c8): bad flag, R8 batch, slots, numbering, paint order.
// Run: node --test a.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const WT = process.env.WT ?? '/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2';
const LINK = pathToFileURL(WT + '/native/wear/app/entry/src/main/js/default/common/link.js').href;
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
// code: a number, null (no send result), or a function (text) -> number | null
async function rig(o = {}) {
  const { Link } = await import(LINK);
  let t = o.t0 ?? T0;
  const t0 = t;
  const r = { sent: [], dones: [], code: o.code === undefined ? 207 : o.code, store: o.store ?? store() };
  const io = { store: r.store, now: () => t, keep: () => {}, paint: () => {}, connect: () => {}, defer: (fn) => { tasks.push(fn); },
    send: (text, done) => { r.sent.push(text); r.dones.push(done); const c = typeof r.code === 'function' ? r.code(text) : r.code; if (c !== null) done(c); } };
  const link = Link(io, o.boot ?? 'abcd1234');
  let ticked = 0;
  r.link = {};
  for (const k of Object.keys(link)) r.link[k] = (...a) => { while (ticked < Math.floor((t - t0) / 1000)) { ticked++; link.tick(); drain(); } const out = link[k](...a); drain(); return out; };
  r.adv = (ms) => { t += ms; r.link.view(); };
  r.v = () => r.link.view();
  r.cmds = () => r.sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd');
  r.link.start();
  return r;
}
const pk = (v, ks) => Object.fromEntries(ks.map((k) => [k, v[k]]));
const isCmd = (t) => JSON.parse(t).k === 'cmd';
const trace = (r, n, ks = ['sc', 'off', 'na', 'sl', 'cl']) => { const out = []; for (let i = 0; i < n; i++) { const v = r.v(); out.push(ks.map((k) => v[k]).join('|')); r.adv(1000); } return out; };

test('A1 phone answers (snaps every 5 s) while command sends fail and hellos succeed', async () => {
  const r = await rig({ code: (t) => (isCmd(t) ? 206 : 207) });
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(2000);
  r.link.complete();
  const seen = [];
  for (let i = 0; i < 60; i++) { if (i % 5 === 0) r.link.rx(snap({ pt: T0 + 2000 + i * 1000 })); const v = r.v(); seen.push(v.sc + (v.off ? 'off' : 'on')); r.adv(1000); }
  const flips = seen.filter((x, i) => i && x !== seen[i - 1]).length;
  console.log('A1 60 s, screen per second:', seen.join(' '), '| flips', flips);
  r.code = 207;
  r.link.rx(snap({ pt: T0 + 70000 }));
  const c = r.cmds().at(-1);
  r.link.rx(res(c.commandId));
  console.log('A1 after recovery and applied:', JSON.stringify(trace(r, 5)));
});

test('A2 phone messages arrive, every send fails (one-way link), then recovers', async () => {
  const r = await rig({ code: 206 });
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(2000);
  r.link.complete();
  const seen = [];
  for (let i = 0; i < 40; i++) { if (i % 5 === 0) r.link.rx(snap({ pt: T0 + 2000 + i * 1000 })); const v = r.v(); seen.push(v.sc + (v.off ? 'off' : 'on')); r.adv(1000); }
  console.log('A2 40 s:', seen.join(' '));
  r.code = 207;
  r.link.rx(snap({ pt: T0 + 50000 }));
  r.link.rx(res(r.cmds().at(-1).commandId));
  console.log('A2 recovered:', JSON.stringify(trace(r, 5)));
});

test('A3 a failed hello with an empty queue, then Complete whose send result never comes', async () => {
  const r = await rig({ code: 207 });
  r.link.rx(snap()); r.link.rx(plan());
  r.code = 206; r.adv(21000); // the 20 s hello fails: bad = 1, fail = 1
  console.log('A3 after failed hello', JSON.stringify(pk(r.v(), ['sc', 'off'])));
  r.link.rx(snap({ pt: T0 + 22000 })); // phone answers; q empty: bad = 0
  console.log('A3 after snap', JSON.stringify(pk(r.v(), ['sc', 'off'])));
  r.code = (t) => (isCmd(t) ? null : 206); // the cmd send never reports; the next hello fails
  r.link.complete();
  console.log('A3 after Complete (no send result)', JSON.stringify(pk(r.v(), ['sc', 'off', 'cl'])));
  r.adv(25000);
  console.log('A3 +25 s', JSON.stringify(pk(r.v(), ['sc', 'off', 'na'])));
  r.link.rx(snap({ pt: T0 + 50000 }));
  console.log('A3 phone snap while queued and last hello failed', JSON.stringify(pk(r.v(), ['sc', 'off', 'na'])));
});

test('A4 R8 across a restart: 2 sets queued offline, app restarts next to the phone, 1st rejected, 2nd applied', async () => {
  const st = store();
  const a = await rig({ code: null, store: st });
  a.link.rx(snap()); a.link.rx(plan());
  a.adv(30000);
  a.link.complete(); a.link.pick(1); a.link.complete();
  a.adv(2000);
  a.link.die();
  const b = await rig({ code: 207, store: st, boot: 'efgh5678' });
  b.link.rx(snap()); b.link.rx(plan());
  b.adv(2000);
  const cm = b.cmds();
  console.log('A4 restored', JSON.stringify(pk(b.v(), ['sc', 'na', 'sl', 'st'])), 'cmds', cm.length);
  b.link.rx(res(cm[0].commandId, { status: 'rejected', reason: 'stale_revision' }));
  const mid = pk(b.v(), ['sc', 'st']);
  b.link.rx(res(b.cmds().at(-1).commandId));
  console.log('A4 after reject', JSON.stringify(mid), 'then applied', JSON.stringify(pk(b.v(), ['sc', 'st', 'sl'])));
});

test('A5 interleaved: offline A queued, phone back, B completed online before A answers; A rejected, B applied', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap()); r.link.rx(plan());
  r.adv(30000);
  r.link.complete(); r.adv(2000);
  r.link.rx(snap({ pt: T0 + 32000 })); r.link.pick(1); r.link.complete();
  const last = (x) => x.cmds().at(-1).commandId;
  r.link.rx(res(last(r), { status: 'rejected', reason: 'stale_revision' }));
  r.link.rx(res(last(r)));
  console.log('A5', JSON.stringify(trace(r, 4, ['sc', 'st', 'sl', 'na'])));
  const s = await rig({ code: null });
  s.link.rx(snap()); s.link.rx(plan()); s.adv(30000);
  s.link.complete(); s.adv(2000);
  s.link.rx(snap({ pt: T0 + 32000 })); s.link.pick(1); s.link.complete();
  s.link.rx(res(last(s))); s.link.rx(res(last(s), { status: 'rejected', reason: 'stale_revision' }));
  console.log('A5b A applied, B rejected', JSON.stringify(trace(s, 4, ['sc', 'st', 'sl', 'na'])));
});

test('A6 a batch that saw a refusal goes offline again; later sets keep the old reason', async () => {
  const r = await rig({ code: null });
  r.link.rx(snap()); r.link.rx(plan()); r.adv(30000);
  r.link.complete(); r.link.pick(1); r.link.complete(); r.adv(2000);
  const last = (x) => x.cmds().at(-1).commandId;
  r.link.rx(res(last(r), { status: 'rejected', reason: 'stale_revision' }));
  r.adv(30000); // phone away again with 1 queued
  r.link.pick(2); r.link.complete(); r.adv(2000);
  r.link.rx(snap({ pt: T0 + 64000 })); r.link.rx(res(last(r))); r.link.rx(res(last(r)));
  console.log('A6 after both applied', JSON.stringify(trace(r, 4, ['sc', 'st', 'sl', 'na'])));
});

test('A7 the bad flag after an online result when the send of a later item fails', async () => {
  const r = await rig({ code: 207 });
  r.link.rx(snap()); r.link.rx(plan());
  r.link.complete(); r.link.pick(1);
  r.code = (t) => (isCmd(t) ? 206 : 207);
  r.link.complete();
  const ids = [...new Set(r.cmds().map((c) => c.commandId))];
  r.link.rx(res(ids[0])); // q still has B whose send failed: bad stays 1
  console.log('A7 1st applied, 2nd send failed', JSON.stringify(trace(r, 6, ['sc', 'off', 'st', 'na'])));
});
