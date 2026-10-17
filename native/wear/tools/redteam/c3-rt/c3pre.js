// c3pre.js (after rt-e/prelude.js, before the scenario): the WATCH-C3 phone (snap nx, rs, st; a new rest id per set,
// started from the set's action time) and the watch's @system.vibrator and @system.sensor.
var VIB = [], HR = { sub: 0, unsub: 0, cb: null, n: 0 }, DEVBAD = false;
var VIBM = { vibrate: function (o) { if (DEVBAD) throw new Error('vib'); VIB.push(o.mode); } };
var SENS = {
  subscribeHeartRate: function (o) { if (DEVBAD) throw new Error('hr'); HR.sub++; HR.cb = o; },
  unsubscribeHeartRate: function () { if (DEVBAD) throw new Error('hr'); HR.unsub++; HR.cb = null; }
};
var rn0 = requireNative;
requireNative = function (n) { return n === 'system.vibrator' ? VIBM : n === 'system.sensor' ? SENS : rn0(n); };
function beat(v) { if (HR.cb) { HR.n++; var cb = HR.cb; top(function () { cb.success({ heartRate: v }); }, 'hr'); } }
function hrFail(code) { if (HR.cb) { var cb = HR.cb; top(function () { cb.fail('Permission not declared', code); }, 'hrfail'); } }
function swipe(d) { top(function () { O.onSwipe.call(PAGE, { direction: d }); }, 'onSwipe'); }
// sets 1 to N of one exercise; the snap carries the open set and up to 3 more (nx), rs 90 and st 2.5
function Phone3(N) {
  var p = Phone(), got0 = p.got;
  N = N || 6;
  p.rest = false; p.restN = 0; p.restEnd = 0; p.done = [];
  p.snap = function (wt) {
    var n = p.setN, nx = [], i;
    for (i = 1; i <= 3 && n + i <= N; i++) nx.push(['set_mgx1k2ab_' + (100000 + n + i), 0, 62.5, 8]);
    return JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: Date.now(), wt: wt === undefined ? null : wt, srev: 3, sid: p.sid, eid: 'e_bench', ex: 'Bench press',
      si: n, sn: N, set: n <= N ? { id: 'set_mgx1k2ab_' + (100000 + n), rev: p.rev, w: 62.5, u: 'kg', r: 8, e: null, src: 't', st: 2.5 } : null, nx: nx, rs: 90, lt: null,
      rest: p.rest ? { id: 'rest_mgx1k2ab_' + p.restN, left: Math.max(0, p.restEnd - Date.now()), tot: 90000, p: false } : null, th: ['#08090a', '#f7f8f8', '#5e6ad2'] });
  };
  p.got = function (text) {
    var m = JSON.parse(text);
    if (m.k === 'cmd' && p.answer && m.kind === 'complete_set') { p.done.push([m.setId.slice(-2), m.actionAt, m.load ? m.load.value : null, m.reps]); p.rest = true; p.restN++; p.restEnd = m.actionAt + 90000; }
    if (m.k === 'cmd' && p.answer && m.kind === 'rest_skip') p.rest = false;
    got0(text);
  };
  return p;
}
