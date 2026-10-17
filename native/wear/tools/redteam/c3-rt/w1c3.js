// W1-C3: the red team's W1 workout (24 sets over 4 exercises, picks, swipes, effort, +30 s, Skip, plans, two drop-outs)
// on a C3 phone (nx, rs, st, a new rest id per set from its action time), with a heart-rate sample every 5 s, Adjust on
// every 4th set, every 3rd rest left to run out (Rest done, OK), and two more sets logged ahead in each drop-out.
NOLOG = true;
function Phone4() {
  var p = Phone3(30), snap0 = p.snap, got0 = p.got;
  p.cN = 1; p.rN = 3;
  p.rows = function () {
    return [
      { id: 'e_bench', ex: 'Bench press', d: p.setN - 1, n: 30, set: JSON.parse(snap0(null)).set, lt: { w: 60, u: 'kg', r: 8 } },
      { id: 'e_chest', ex: 'Chest press machine', d: p.cN - 1, n: 30, set: { id: 'set_mgx1k2ab_c' + (100000 + p.cN), rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l', st: 5 }, lt: { w: 52, u: 'kg', r: 10 } },
      { id: 'e_row', ex: 'Seated cable row wide', d: p.rN - 1, n: 30, set: { id: 'set_mgx1k2ab_r' + (100000 + p.rN), rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
      { id: 'e_plank', ex: 'Plank', d: 0, n: 2, set: null, lt: null }
    ];
  };
  p.plan = function () { return JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: p.sid, srev: 3, sd: p.setN + p.cN + p.rN - 3, st: 92, rows: p.rows() }); };
  p.snap = function (wt) { var s = JSON.parse(snap0(wt)); s.lt = { w: 60, u: 'kg', r: 8 }; return JSON.stringify(s); };
  p.got = function (text) {
    var m = JSON.parse(text);
    if (m.k === 'cmd' && /_c1/.test(m.setId)) { p.cN++; p.setN--; }
    if (m.k === 'cmd' && /_r1/.test(m.setId)) { p.rN++; p.setN--; }
    got0(text);
    if (p.answer && (m.k === 'hello' || m.k === 'cmd')) deliver(p.plan(), p.lat + 10);
  };
  return p;
}
function t2(n) { if (O && typeof O[n] === 'function') tap(n); }
var k = 0;
function run(ms) { for (var e = 0; e < ms; e += 5000) { beat(110 + (k++ % 40)); advance(Math.min(5000, ms - e)); } }
var m0 = mem(true).alloc;
PH = Phone4(); openApp(); advance(5000);
var m1 = mem(true).alloc, hi = m1;
for (var i = 0; i < 24; i++) {
  if (i % 3 === 1) { swipe('up'); t2('onR1'); }
  if (i % 3 === 2) { swipe('up'); t2('onR2'); }
  if (i % 5 === 0) swipe('left');
  t2(['onEasy', 'onIdeal', 'onMax'][i % 3]);
  if (i % 4 === 3) { t2('onAdj'); swipe('up'); swipe('left'); swipe('up'); t2('onMore'); t2('onDone'); }
  if (i === 9 || i === 17) { PH.on = false; run(32000); }
  tap('onComplete'); run(3000);
  if (i === 9 || i === 17) { tap('onSkip'); tap('onComplete'); run(3000); tap('onSkip'); tap('onComplete'); run(20000); PH.on = true; run(25000); }
  if (i % 4 === 0) t2('onAdd');
  run(2000);
  if (i % 3 === 0) { run(90000); t2('onOk'); } else tap('onSkip');
  run(4000);
  var a = mem(true).alloc; if (a > hi) hi = a;
}
run(60000);
print('W1C3 phone applied', PH.applied, 'cmds', PH.cmds, 'sets', PH.done.length, '| alloc before open', m0, 'after open', m1, 'max held', hi, 'peak', mem(false).peak,
  '| sc', PAGE.sc, 'ESC', J(ESC), 'bad', ST.bad.length, 'maxIn', ST.maxIn, 'vib', VIB.length, 'hr', HR.n);
closeApp(); advance(2000);
print('W1C3 closed, sends after', SENT_AFTER_DESTROY, 'RUN', J(ST.map.m2r), 'unsub', HR.unsub);
