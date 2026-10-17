// C2 plan scenarios on the compiled page: a phone that sends snap (eid, lt) and plan; picks, swipes, Completes;
// then malformed, oversized, wrong-typed and toString plans and snaps; then a burst of plans and snaps.
function Phone2() {
  var p = Phone(), snap0 = p.snap, got0 = p.got, picked = [];
  p.rows = function () {
    return [
      { id: 'e_bench', ex: 'Bench press', d: p.setN - 1, n: 3, set: JSON.parse(snap0(null)).set, lt: { w: 60, u: 'kg', r: 8 } },
      { id: 'e_chest', ex: 'Chest press', d: 0, n: 3, set: { id: 'set_c' + p.cN, rev: 0, w: 54, u: 'kg', r: 10, e: null, src: 'l' }, lt: { w: 52, u: 'kg', r: 10 } },
      { id: 'e_row', ex: 'Seated row', d: 2, n: 4, set: { id: 'set_r3', rev: 2, w: 135, u: 'lb', r: 6, e: 'easy', src: 'd' }, lt: null },
      { id: 'e_plank', ex: 'Plank', d: 0, n: 2, set: null, lt: null }
    ];
  };
  p.cN = 1;
  p.plan = function () { return JSON.stringify({ t: 'mw', v: 1, k: 'plan', sid: p.sid, srev: 3, sd: p.setN - 1, st: 12, rows: p.rows() }); };
  p.snap = function (wt) { var s = JSON.parse(snap0(wt)); s.eid = 'e_bench'; s.lt = { w: 60, u: 'kg', r: 8 }; return JSON.stringify(s); };
  p.got = function (text) {
    var m = JSON.parse(text);
    if (m.k === 'cmd' && m.kind === 'complete_set') picked.push(m.setId);
    if (m.k === 'cmd' && /^set_c/.test(m.setId)) { p.cN++; p.setN--; }
    got0(text);
    if (m.k === 'hello' || m.k === 'cmd') deliver(p.plan(), p.lat + 10);
  };
  p.picked = picked;
  return p;
}
function swipe(d) { top(function () { O.onSwipe.call(PAGE, d); }, 'onSwipe'); }
PH = Phone2(); var KINDS = [], g00 = PH.got; PH.got = function (t) { var m = JSON.parse(t); if (m.k === "cmd") KINDS.push(m.kind.charAt(5) + (m.restId || m.setId || "").slice(-2)); g00(t); }; openApp(); advance(5000);
print('a open: sc', PAGE.sc, 'nm', J(PAGE.nm), 'sp', J(PAGE.sp), 'la', J(PAGE.la), 'ck', J(PAGE.ck));
swipe({ direction: 'up' }); print('b swipe up: sc', PAGE.sc, 'dn', J(PAGE.dn), 'rows', J([PAGE.r0, PAGE.r1, PAGE.r2, PAGE.r3]), J([PAGE.b0, PAGE.b1]));
tap('onR1'); print('c pick 1: sc', PAGE.sc, 'nm', J(PAGE.nm), 'l2', J(PAGE.l2));
function hellos() { return SENT.filter(function (x) { return x.indexOf('"k":"hello"') > 0; }).length; }
var h0 = hellos();
tap('onIdeal'); tap('onComplete'); advance(1500); var h1 = hellos(); advance(1500); var h2 = hellos();
print('d complete pick: phone got', J(PH.picked), 'effort', J(JSON.parse(SENT.filter(function (x) { return x.indexOf('complete_set') > 0; }).pop()).effort), 'nm', J(PAGE.nm), 'sc', PAGE.sc, 'sl', J(PAGE.sl));
print('e hellos 1.5 s after the tap', h1 - h0, '| 3 s after', h2 - h0);
swipe(undefined); swipe({}); swipe({ direction: { toString: 1 } }); swipe({ direction: 'left' }); swipe(null);
print('f odd swipes: sc', PAGE.sc, 'ESC', J(ESC));
// malformed, oversized and wrong-typed plans and snaps
var obj = '{"toString":1,"valueOf":1}', nest = new Array(900).join('[') + new Array(900).join(']');
var good = JSON.parse(PH.plan()), bads = [
  'plan', '{', nest, '{"t":"mw","v":1,"k":"plan","rows":' + nest + '}', PH.plan().slice(0, -1), PH.plan() + new Array(2100).join(' '),
  '{"t":"mw","v":1,"k":"plan"}', '{"t":"mw","v":1,"k":"plan","sid":' + obj + ',"srev":1,"sd":1,"st":1,"rows":[]}'
];
var muts = [['sid', 5], ['srev', '3'], ['sd', null], ['st', JSON.parse(obj)], ['rows', 'x'], ['rows', { 0: 1, length: 1 }]];
for (var i = 0; i < muts.length; i++) { var g = JSON.parse(PH.plan()); g[muts[i][0]] = muts[i][1]; bads.push(JSON.stringify(g)); }
var rmuts = [['id', 7], ['ex', JSON.parse(obj)], ['d', '0'], ['n', null], ['set', 'x'], ['lt', 'x'], ['lt', { w: JSON.parse(obj), u: 'kg', r: 1 }]];
for (i = 0; i < rmuts.length; i++) { g = JSON.parse(PH.plan()); g.rows[1][rmuts[i][0]] = rmuts[i][1]; bads.push(JSON.stringify(g)); }
g = JSON.parse(PH.plan()); g.rows[1].set.rev = JSON.parse(obj); bads.push(JSON.stringify(g));
g = JSON.parse(PH.snap(null)); g.eid = JSON.parse(obj); bads.push(JSON.stringify(g));
g = JSON.parse(PH.snap(null)); g.lt = { w: 1, u: JSON.parse(obj), r: 1 }; bads.push(JSON.stringify(g));
swipe({ direction: 'up' });
var before = J([PAGE.sc, PAGE.dn, PAGE.r0, PAGE.r1, PAGE.r2, PAGE.r3, PAGE.n0, PAGE.n1, PAGE.b0, PAGE.b1]);
PH.on = false;
for (i = 0; i < bads.length; i++) { top(function () { RECV({ message: bads[i] }); }, 'bad ' + i); tap('onR1'); swipe({ direction: 'up' }); swipe({ direction: 'up' }); }
advance(2000);
var after = J([PAGE.sc, PAGE.dn, PAGE.r0, PAGE.r1, PAGE.r2, PAGE.r3, PAGE.n0, PAGE.n1, PAGE.b0, PAGE.b1]);
print('g', bads.length, 'bad messages: page unchanged', before === after, 'ESC', J(ESC));
// a burst: 300 plans and 300 snaps in 3 s, with taps in between
PH.on = true; swipe({ direction: 'down' });
for (i = 0; i < 300; i++) { deliver(PH.plan(), 1 + i * 10); deliver(PH.snap(null), 5 + i * 10); }
for (i = 0; i < 30; i++) { advance(100); tap(['onR0', 'onR1', 'onR2', 'onR3', 'onComplete', 'onEasy', 'onMax', 'onNext', 'onSkip', 'onAdd'][i % 10]); swipe({ direction: i % 2 ? 'up' : 'down' }); }
advance(60000);
print('h burst: ESC', J(ESC), 'bad', J(ST.bad), 'maxIn', ST.maxIn, 'overlap', ST.overlap, 'sc', PAGE.sc, 'phone cmds', PH.cmds, 'applied', PH.applied, 'sets', J(PH.picked));
closeApp(); advance(2000);
print('i closed: sends after', SENT_AFTER_DESTROY, 'keep', J(KEEP.slice(-1)), 'ESC', J(ESC));
print("KINDS", J(KINDS));
