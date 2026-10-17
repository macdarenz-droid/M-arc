// ES5 harness: virtual monotonic clock, ACE-lite-like timers, storage/brightness/wearengine stubs.
var MONO = 0, WALL0 = Date.UTC(2026, 9, 17, 10, 0, 0), WOFF = 0;
var realDate = Date;
Date.now = function () { return WALL0 + MONO + WOFF; };
var console = { info: function () {}, log: function () {}, error: function () {}, warn: function () {} };
var EV = [], SEQ = 0, TID = 0, TIMERS = {}, ESC = [], DROP_TIMER = -1, NT = 0;
function sched(at, fn, kind) { EV.push({ at: at, seq: SEQ++, fn: fn, kind: kind }); }
function setTimeout(fn, ms) {
  var id = ++TID; NT++;
  if (NT === DROP_TIMER) return id; // models DispatchToLoop failure: timer deleted, callback never runs
  TIMERS[id] = 1;
  sched(MONO + (ms > 0 ? ms : 0), function () { if (TIMERS[id]) { delete TIMERS[id]; fn(); } }, 'timeout');
  return id;
}
function setInterval(fn, ms) {
  var id = ++TID; TIMERS[id] = 1;
  function f() { if (!TIMERS[id]) return; sched(MONO + ms, f, 'interval'); fn(); }
  sched(MONO + ms, f, 'interval'); return id;
}
function clearInterval(id) { delete TIMERS[id]; }
var clearTimeout = clearInterval;
function top(fn, name) { try { fn(); } catch (e) { ESC.push((name || '?') + ': ' + e); } }
function advance(ms) {
  var end = MONO + ms;
  for (;;) {
    var bi = -1;
    for (var i = 0; i < EV.length; i++) if (EV[i].at <= end && (bi < 0 || EV[i].at < EV[bi].at || (EV[i].at === EV[bi].at && EV[i].seq < EV[bi].seq))) bi = i;
    if (bi < 0) break;
    var e = EV.splice(bi, 1)[0];
    if (e.at > MONO) MONO = e.at;
    top(e.fn, e.kind);
  }
  MONO = end;
}
// storage
var ST = { map: {}, inflight: 0, maxIn: 0, n: 0, log: [], bad: [], lat: 5, mode: null, overlap: 0 };
function badValue(v) {
  if (typeof v !== 'string') return 'type ' + typeof v;
  if (v === '') return 'empty';
  if (v.length >= 128) return 'len ' + v.length;
  for (var i = 0; i < v.length; i++) { var c = v.charCodeAt(i); if (c < 32 || c > 126) return 'char ' + c; }
  return '';
}
function stOp(op, o) {
  ST.n++;
  if (ST.inflight > 0) ST.overlap++;
  if (!NOLOG) ST.log.push(op + ' ' + o.key + (op === 'set' ? '=' + o.value : ''));
  if (!/^[A-Za-z0-9_]{1,32}$/.test(o.key)) ST.bad.push('key ' + o.key);
  if (op === 'set' && badValue(o.value)) ST.bad.push(o.key + ': ' + badValue(o.value) + ' ' + JSON.stringify(o.value));
  if (op === 'get' && 'default' in o && o['default'] === '') ST.getEmptyDefault = (ST.getEmptyDefault || 0) + 1;
  ST.inflight++; if (ST.inflight > ST.maxIn) ST.maxIn = ST.inflight;
  var mode = ST.mode ? ST.mode(op, o.key, ST.n) : 'ok';
  if (mode === 'hang') return;
  var lat = typeof mode === 'number' ? mode : ST.lat;
  sched(MONO + lat, function () {
    ST.inflight--;
    if (mode === 'fail') return o.fail('fail', 300);
    if (op === 'set') { ST.map[o.key] = o.value; o.success(); }
    else o.success(Object.prototype.hasOwnProperty.call(ST.map, o.key) ? ST.map[o.key] : o['default']);
  }, 'storage-cb');
}
var STORAGE = { get: function (o) { stOp('get', o); }, set: function (o) { stOp('set', o); } };
var KEEP = [], DESTROYED = false;
var BRIGHT = { setKeepScreenOn: function (o) { KEEP.push((DESTROYED ? 'AFTER-DESTROY ' : '') + o.keepScreenOn); } };
// wearengine native + phone
var NOLOG = false, SENTN = 0, RECV = null, SENT = [], SENT_AFTER_DESTROY = 0, PH = null;
var WE = {
  getWearEngineVersion: function (o) { o.complete('5.0.401'); },
  setPackageName: function (o) {}, setFingerprint: function (o) {},
  subscribeMsg: function (o) { RECV = o.success; sched(MONO + 20, function () { if (RECV) RECV({ isRegister: true }); }, 'register'); },
  unsubscribeMsg: function () { RECV = null; },
  sendMsg: function (o) {
    if (!NOLOG) SENT.push(o.message); SENTN++; if (DESTROYED) SENT_AFTER_DESTROY++;
    var ok = PH && PH.on;
    sched(MONO + 30, function () { if (ok) o.success(); else o.fail('x', 206); }, 'send-cb');
    if (ok) PH.got(o.message);
  }
};
function deliver(text, d) { sched(MONO + (d || 40), function () { if (RECV) RECV({ message: text }); }, 'rx'); }
function requireNative(n) {
  if (n === 'system.storage') return STORAGE;
  if (n === 'system.brightness') return BRIGHT;
  if (n === 'system.wearengine') return WE;
  return {};
}
var FeatureAbility = {};
function ViewModel(opts) { for (var k in opts.data) this[k] = opts.data[k]; this.__o = opts; }
// phone model
function Phone() {
  var p = { on: true, answer: true, lat: 60, sid: 's_mgx1k2ab_q8z3pd', si: 1, rev: 0, setN: 1, rest: true, applied: 0, cmds: 0 };
  p.snap = function (wt) {
    return JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: Date.now(), wt: wt === undefined ? null : wt, srev: 3, sid: p.sid, ex: 'Bench press', si: p.si, sn: 3,
      set: { id: 'set_mgx1k2ab_' + (100000 + p.setN), rev: p.rev, w: 62.5, u: 'kg', r: 8, e: null, src: 't' },
      rest: p.rest ? { id: 'rest_mgx1k2ab_abcdef', left: 90000, p: false } : null, th: ['#08090a', '#f7f8f8', '#5e6ad2'] });
  };
  p.got = function (text) {
    var m = JSON.parse(text);
    if (m.k === 'hello') deliver(p.snap(m.wt), p.lat);
    if (m.k === 'cmd') {
      p.cmds++;
      if (!p.answer) return;
      if (m.kind === 'complete_set') p.setN++;
      p.applied++;
      deliver(JSON.stringify({ t: 'mw', v: 1, k: 'res', commandId: m.commandId, status: 'applied', sessionRev: 4, replayed: false }), p.lat);
      deliver(p.snap(null), p.lat + 5);
    }
  };
  return p;
}
var PAGE = null, O = null;
function openApp() { DESTROYED = false; PAGE = loadPage(); O = PAGE.__o; top(function () { O.onInit.call(PAGE); }, 'onInit'); top(function () { O.onShow.call(PAGE); }, 'onShow'); }
function tap(name) { top(function () { O[name].call(PAGE); }, name); }
function closeApp() { top(function () { O.onDestroy.call(PAGE); }, 'onDestroy'); DESTROYED = true; }
function J(x) { return JSON.stringify(x); }
