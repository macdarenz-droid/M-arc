// random storage contents at start + random phone ids/values, then taps; checks every write and escapes
NOLOG = true;
var seed = 12345; function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
function rstr(n) { var s = '', a = 'ab,-_0189 é\u0001{}"\\'; for (var i = 0; i < n; i++) s += rnd() < 0.85 ? 'abcdefghij0123456789_'.charAt(Math.floor(rnd() * 21)) : a.charAt(Math.floor(rnd() * a.length)); return s; }
function rval() { var r = rnd(); return r < 0.2 ? rstr(Math.floor(rnd() * 200)) : r < 0.4 ? Math.floor(rnd() * 1e6) / (rnd() < 0.5 ? 1 : 7) : r < 0.5 ? null : r < 0.6 ? '' : r < 0.7 ? -1 : rstr(8); }
var runs = 0, escs = 0, bads = 0, ex1 = '', bad1 = '', pend = 0;
for (var it = 0; it < 400; it++) {
  ST.map = {}; ST.bad = []; ESC = [];
  var keys = ['m2q', 'm2r', 'm2q0', 'm2q1', 'm2q3', 'm2q7'];
  for (var k = 0; k < keys.length; k++) if (rnd() < 0.7) ST.map[keys[k]] = rnd() < 0.5 ? rstr(Math.floor(rnd() * 130)) : (keys[k] === 'm2q' ? '0137013' : keys[k] === 'm2r' ? Math.floor(rnd() * 5) + ',' + (Date.now() - Math.floor(rnd() * 300000)) : 'c,abcdefgh-1,s_1,123,set_1,0,60,kg,8,,' + Math.floor(rnd() * 99991));
  PH = Phone(); PH.answer = rnd() < 0.5;
  PH.sid = rnd() < 0.7 ? 's_' + rstr(Math.floor(rnd() * 40)) : rval();
  var base = PH.snap; PH.snap = function (wt) { var s = JSON.parse(base(wt)); if (rnd() < 0.5) { s.set.id = 'set_' + rstr(Math.floor(rnd() * 60)); s.set.w = rval(); s.set.r = rnd() < 0.5 ? Math.floor(rnd() * 30) : rval(); s.set.e = rnd() < 0.5 ? ['easy', 'max', null, 'x,y'][Math.floor(rnd() * 4)] : rval(); s.set.rev = rnd() < 0.8 ? Math.floor(rnd() * 99) : rnd() * 1e22; } if (s.rest && rnd() < 0.5) s.rest.id = rstr(Math.floor(rnd() * 70)); if (rnd() < 0.2) s.pt = rnd() * 1e15; return JSON.stringify(s); };
  openApp(); advance(4000);
  for (var t = 0; t < 12; t++) { var r = rnd(); tap(r < 0.4 ? 'onComplete' : r < 0.6 ? 'onAdd' : r < 0.8 ? 'onSkip' : 'onEffort'); advance(Math.floor(rnd() * 3000)); }
  advance(40000); runs++;
  escs += ESC.length; bads += ST.bad.length; if (ESC.length && !ex1) ex1 = ESC[0]; if (ST.bad.length && !bad1) bad1 = ST.bad[0];
  closeApp(); advance(1000); EV = []; TIMERS = {};
}
print('runs', runs, 'escaped exceptions', escs, J(ex1), 'invalid storage writes', bads, J(bad1));
