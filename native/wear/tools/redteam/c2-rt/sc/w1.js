// W1: a full workout on the compiled page: a plan-capable phone, 24 sets over 4 exercises, picks, swipes,
// effort, rests (+30 s and Skip), two phone drop-outs with a set queued, plans and snaps after each result.
// Runs on 1.1.2 too (it ignores plans; handlers it lacks are skipped).
NOLOG = true;
function Phone2() {
  var p = Phone(), snap0 = p.snap, got0 = p.got;
  p.cN = 1; p.rN = 3;
  p.rows = function () {
    return [
      { id: 'e_bench', ex: 'Bench press', d: p.setN - 1, n: 30, set: JSON.parse(snap0(null)).set, lt: { w: 60, u: 'kg', r: 8 } },
      { id: 'e_chest', ex: 'Chest press machine', d: p.cN - 1, n: 30, set: { id: 'set_mgx1k2ab_c' + (100000 + p.cN), rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: { w: 52, u: 'kg', r: 10 } },
      { id: 'e_row', ex: 'Seated cable row wide', d: p.rN - 1, n: 30, set: { id: 'set_mgx1k2ab_r' + (100000 + p.rN), rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
      { id: 'e_plank', ex: 'Plank', d: 0, n: 2, set: null, lt: null }
    ];
  };
  p.plan = function () { return JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: p.sid, srev: 3, sd: p.setN + p.cN + p.rN - 3, st: 92, rows: p.rows() }); };
  p.snap = function (wt) { var s = JSON.parse(snap0(wt)); s.eid = 'e_bench'; s.lt = { w: 60, u: 'kg', r: 8 }; return JSON.stringify(s); };
  p.got = function (text) {
    var m = JSON.parse(text);
    if (m.k === 'cmd' && /_c1/.test(m.setId)) { p.cN++; p.setN--; }
    if (m.k === 'cmd' && /_r1/.test(m.setId)) { p.rN++; p.setN--; }
    if (m.k === 'cmd' && m.kind === 'rest_skip') p.rest = false;
    got0(text);
    if (m.k === 'cmd' && m.kind === 'complete_set') p.rest = true;
    if (p.answer && (m.k === 'hello' || m.k === 'cmd')) deliver(p.plan(), p.lat + 10);
  };
  return p;
}
function has(n) { return O && typeof O[n] === 'function'; }
function t2(n) { if (has(n)) tap(n); }
function swipe(d) { if (has('onSwipe')) top(function () { O.onSwipe.call(PAGE, { direction: d }); }, 'onSwipe'); }
var m0 = mem(true).alloc;
PH = Phone2(); openApp(); advance(5000);
var m1 = mem(true).alloc, hi = m1, sets = 0;
for (var i = 0; i < 24; i++) {
  if (i % 3 === 1) { swipe('up'); t2('onR1'); }
  if (i % 3 === 2) { swipe('up'); t2('onR2'); }
  if (i % 5 === 0) swipe('left');
  t2(['onEasy', 'onIdeal', 'onMax'][i % 3]);
  if (i === 9 || i === 17) { PH.on = false; advance(32000); }
  tap('onComplete'); advance(3000);
  if (i === 9 || i === 17) { advance(20000); PH.on = true; advance(25000); }
  if (i % 4 === 0) t2('onAdd');
  advance(2000);
  tap('onSkip'); advance(4000);
  var a = mem(true).alloc; if (a > hi) hi = a;
}
advance(60000);
print('W1 phone applied', PH.applied, 'cmds', PH.cmds, '| alloc before open', m0, 'after open', m1, 'max held', hi, 'peak', mem(false).peak,
  '| sc', PAGE.sc, 'ESC', J(ESC), 'bad', ST.bad.length, 'maxIn', ST.maxIn);
closeApp(); advance(2000);
print('W1 closed, sends after', SENT_AFTER_DESTROY, 'RUN', J(ST.map.m2r));
