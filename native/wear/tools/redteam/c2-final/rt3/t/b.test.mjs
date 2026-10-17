// Slot mapping fuzz: on random link states, index.hml at 611b09c8 drawn from paint()'s slots must show the same lines and
// colours as index.hml at 9c23f560 drawn from the view's named keys (old paint: every view key, nothing reset).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const WT = '/home/user/M-arc/.claude/worktrees/wf_4890b0c8-eba-2';
const PAGE = process.env.PAGE ?? WT + '/native/wear/app/entry/src/main/js/default/pages/index';
const LINK = pathToFileURL(WT + '/native/wear/app/entry/src/main/js/default/common/link.js').href;
const OLD = readFileSync(new URL('./old.hml', import.meta.url), 'utf8');
const NEW = readFileSync(PAGE + '/index.hml', 'utf8');
const T0 = Date.UTC(2026, 9, 17, 10, 0, 0);

function pageRig() {
  let src = readFileSync(PAGE + '/index.js', 'utf8');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  let cur, io;
  const link = { start() {}, tick() {}, show() {}, view: () => cur };
  const def = new Function('P2pClient', 'Message', 'Builder', 'storage', 'brightness', 'PHONE_PKG', 'PHONE_FP', 'Link', 'makeBoot', 'setInterval', src)(
    function () {}, function () {}, function () {}, {}, { setKeepScreenOn() {} }, '', '', (x) => { io = x; return link; }, () => 'b', () => 0);
  const order = [], page = {};
  for (const k of Object.keys(def.data)) {
    let x = def.data[k];
    Object.defineProperty(page, k, { enumerable: true, configurable: true, get: () => x, set: (y) => { order.push(k); x = y; } });
  }
  def.onInit.call(page);
  return { page, order, paint(v) { cur = v; order.length = 0; io.paint(); } };
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
function draw(hml, d) {
  const get = (k) => (k in d ? d[k] : `<<${k}?>>`);
  const holds = (c) => { const m = /^\{\{(!?)(\w+)(?:==(\d+))?\}\}$/.exec(c); const x = m[3] === undefined ? !!get(m[2]) : get(m[2]) == +m[3]; return m[1] ? !x : x; };
  const lines = [], colours = [], clicks = [];
  const walk = (node) => {
    let last = true;
    for (const n of node.kids) {
      if (n.text !== undefined) { lines.push(n.text.replace(/\{\{(\w+)\}\}/g, (_, k) => get(k))); continue; }
      const on = 'if' in n.attrs ? holds(n.attrs.if) : 'else' in n.attrs ? !last : true;
      if ('if' in n.attrs) last = on;
      if (!on) continue;
      const bg = /background-color:\{\{(\w+)\}\}/.exec(n.attrs.style ?? '');
      if (bg) colours.push(get(bg[1]));
      if (n.attrs.onclick) clicks.push(n.attrs.onclick);
      walk(n);
    }
  };
  walk(tree(hml));
  return { lines, colours, clicks };
}
const OLDDATA = { l2: '', rest: '', set: 0, add: 0, cb: '', off: 0, ck: '', sc: 0, nm: '', sp: '', la: '', sl: '', cl: '', e1: '', e2: '', e3: '', rc: '', nx: '', ns: '', dn: '',
  r0: '', r1: '', r2: '', r3: '', n0: '', n1: '', n2: '', n3: '', b0: '', b1: '', b2: '', b3: '', na: '', l1: '' };

const tasks = [];
const drain = () => { while (tasks.length) tasks.shift()(); };
function store() { const map = new Map(); return { set(o) { map.set(o.key, o.value); o.success(); }, get(o) { o.success(map.has(o.key) ? map.get(o.key) : o.default); } }; }
function rnd(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

test('slot fuzz: 20 seeds x 400 steps, new markup + slots == old markup + named keys', async () => {
  const { Link } = await import(LINK);
  let bad = 0, n = 0, first = null;
  const scs = new Map();
  for (let seed = 1; seed <= 20; seed++) {
    const R = rnd(seed);
    let t = T0, code = 207;
    const sent = [];
    const io = { store: store(), now: () => t, keep() {}, paint() {}, connect() {}, defer: (f) => tasks.push(f), send: (x, done) => { sent.push(x); if (code !== null) done(code); } };
    const L = Link(io, 'abcd1234');
    L.start(); drain();
    const PG = pageRig();
    let old = { ...OLDDATA };
    const ex = ['Bench press', 'Chest press', 'Seated row', 'A very long exercise name that runs off'];
    const rows = () => ex.slice(0, 1 + Math.floor(R() * 4)).map((e, i) => ({ id: 'e' + i, ex: e, d: Math.floor(R() * 3), n: 3,
      set: R() < 0.8 ? { id: 's' + i + Math.floor(R() * 3), rev: 1, w: R() < 0.2 ? null : 60, u: 'kg', r: R() < 0.1 ? 0 : 8, e: R() < 0.3 ? 'max' : null } : null, lt: R() < 0.5 ? { w: 50, u: 'kg', r: 5 } : null }));
    for (let step = 0; step < 400; step++) {
      const a = R();
      try {
        if (a < 0.15) { const i = Math.floor(R() * 4); L.rx(JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: t, wt: null, srev: 3, sid: R() < 0.05 ? null : 's1', eid: 'e' + i, ex: R() < 0.1 ? null : ex[i], si: 1 + Math.floor(R() * 3), sn: 3,
          set: R() < 0.8 ? { id: 's' + i + Math.floor(R() * 3), rev: 1, w: 60, u: 'kg', r: 8, e: null } : null, lt: null,
          rest: R() < 0.4 ? { id: 'r' + Math.floor(R() * 3), left: Math.floor(R() * 4) * 30000, tot: 90000, p: R() < 0.2 } : null, th: ['#000000', '#ffffff', '#ff0000'] })); }
        else if (a < 0.25) L.rx(JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: 's1', srev: 3, sd: 5, st: 20, rows: rows() }));
        else if (a < 0.35) { const c = sent.map((x) => JSON.parse(x)).filter((m) => m.k === 'cmd').at(-1); if (c) L.rx(JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId: c.commandId, status: R() < 0.7 ? 'applied' : 'rejected', reason: 'stale_revision' })); }
        else if (a < 0.45) L.complete();
        else if (a < 0.52) L.pick(Math.floor(R() * 4));
        else if (a < 0.58) L.next(R() < 0.5 ? undefined : 'up');
        else if (a < 0.63) L.effort(Math.floor(R() * 4));
        else if (a < 0.68) L.rest(R() < 0.5 ? 'rest_add_30' : 'rest_skip');
        else if (a < 0.72) code = R() < 0.5 ? 206 : R() < 0.5 ? null : 207;
        else { const k = 1 + Math.floor(R() * (R() < 0.1 ? 40 : 4)); for (let j = 0; j < k; j++) { t += 1000; L.tick(); drain(); } }
      } catch (e) { bad++; if (!first) first = 'throw ' + e; }
      drain();
      const v = L.view();
      old = { ...old, ...v };
      PG.paint(v);
      const A = draw(OLD, old), B = draw(NEW, PG.page);
      n++;
      scs.set(v.sc, (scs.get(v.sc) ?? 0) + 1);
      try { assert.deepEqual(B, A); } catch (e) { bad++; if (!first) first = JSON.stringify({ seed, step, sc: v.sc, old: A, now: B }); }
    }
  }
  console.log('fuzz states', n, 'by screen', JSON.stringify([...scs].sort()), 'mismatches', bad, first ?? '');
});
