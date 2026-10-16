// Gate A watch message logic. Watch: req {t,v,k:'req',id,p?} and hr {t,v,k:'hr',id,bpm}; phone: ack
// {t,v,k:'ack',id,dup,n,by:'js'|'native'}; t 'marc-a2', v 1. A send result of 207 only proves transport.
// Plain ES5: the GT 6 engine has no ES2015 and its String replace throws. Tests: native/wear/test/*.test.mjs.

var T = 'marc-a2';
var V = 1;
var MAX_BYTES = 1024; // Huawei's message limit
var MAX_ID = 32;
var LOST_MS = 10000;
var LATE_MS = 600000;
var EVERY_MS = 5000;
var GAP_MS = 7500; // a longer tick gap: the watch paused the timer
var ROWS = 9;
var ROW_CHARS = 30;
var MODES = ['MSG', 'AUTO', 'SIZE', 'HR', 'KIT'];
var SIZES = [100, 200, 400, 800, 1000];
var HR_MIN = 20;
var HR_MAX = 250;
var PHONE_PKG = 'com.mrcdrnzz.dailytracker';
// SHA-256 of the phone app's signing certificate, colons removed (build-apk.yml EXPECTED_SHA256).
var PHONE_FP = '05669AD2721C6ABAF9FDD4B9B84E2FB7944844B1DEF359845F015F2B67CAF1F5';
var BASE36 = '0123456789abcdefghijklmnopqrstuvwxyz';

function has(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// 6 base-36 characters that tell this app start apart from earlier ones.
function makeBoot(rand) {
  var r = rand || Math.random;
  var s = '';
  for (var i = 0; i < 6; i++) {
    var k = Math.floor(r() * 36);
    if (!(k >= 0 && k <= 35)) k = 0;
    s += BASE36.charAt(k);
  }
  return s;
}

function makeRequest(boot, seq) {
  return { t: T, v: V, k: 'req', id: boot + '-' + seq, p: 'n' + seq };
}

// A request of exactly size UTF-8 bytes, or null.
function padRequest(boot, seq, size) {
  var m = { t: T, v: V, k: 'req', id: boot + '-' + seq, p: '' };
  var need = size - utf8Length(JSON.stringify(m));
  if (need < 0 || size > MAX_BYTES) return null;
  var p = '';
  while (p.length < need) p += String(p.length % 10);
  m.p = p;
  return m;
}

// null unless bpm is an integer from HR_MIN to HR_MAX (the watch reports 255 when invalid).
function makeHr(boot, seq, bpm) {
  if (typeof bpm !== 'number' || Math.floor(bpm) !== bpm || bpm < HR_MIN || bpm > HR_MAX) return null;
  return { t: T, v: V, k: 'hr', id: boot + '-' + seq, bpm: bpm };
}

function nextMode(m) {
  for (var i = 0; i < MODES.length; i++) {
    if (MODES[i] === m) return MODES[(i + 1) % MODES.length];
  }
  return MODES[0];
}

// UTF-8 length of a string, without TextEncoder (not on the watch).
function utf8Length(s) {
  var n = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charCodeAt(i);
    if (c < 0x80) n += 1;
    else if (c < 0x800) n += 2;
    else if (c >= 0xd800 && c <= 0xdfff) n += 2; // each half of a surrogate pair, 4 bytes for the pair
    else n += 3;
  }
  return n;
}

// Returns {kind:'ack'|'late', id, ms, dup, n, by} for an id in pending or late (and removes it),
// {kind:'dup', id} for any other id, or {kind:'bad', reason}. Never throws.
function readAck(text, pending, now, late) {
  if (typeof text !== 'string') return { kind: 'bad', reason: 'type' };
  if (text.length > MAX_BYTES || utf8Length(text) > MAX_BYTES) return { kind: 'bad', reason: 'size' };
  var m;
  try {
    m = JSON.parse(text);
  } catch (e) {
    return { kind: 'bad', reason: 'json' };
  }
  // null and non-objects; typeof m === 'object' would add babel's 450 B _typeof helper
  if (Object(m) !== m) return { kind: 'bad', reason: 'json' };
  if (m.t !== T || m.v !== V || m.k !== 'ack') return { kind: 'bad', reason: 'shape' };
  if (typeof m.id !== 'string' || m.id.length === 0 || m.id.length > MAX_ID) return { kind: 'bad', reason: 'id' };
  var kind = 'ack';
  var from = pending;
  if (!has(pending, m.id)) {
    if (!late || !has(late, m.id)) return { kind: 'dup', id: m.id };
    kind = 'late';
    from = late;
  }
  var ms = now - from[m.id];
  delete from[m.id];
  var n = typeof m.n === 'number' && Math.floor(m.n) === m.n && m.n >= 0 && m.n <= MAX_BYTES ? m.n : null;
  var by = m.by === 'js' || m.by === 'native' ? m.by : null;
  return { kind: kind, id: m.id, ms: ms, dup: m.dup === true, n: n, by: by };
}

// Removes and returns the ids older than limit (default 10 s), copying their send times into into.
function lost(pending, now, limit, into) {
  var max = typeof limit === 'number' ? limit : LOST_MS;
  var gone = [];
  for (var id in pending) {
    if (has(pending, id) && now - pending[id] > max) gone.push(id);
  }
  for (var i = 0; i < gone.length; i++) {
    if (into) into[gone[i]] = pending[gone[i]];
    delete pending[gone[i]];
  }
  return gone;
}

// Adds a screen row, keeping the last ROWS rows of at most ROW_CHARS characters.
function addRow(rows, text) {
  var s = String(text);
  if (s.length > ROW_CHARS) s = s.substring(0, ROW_CHARS);
  rows.push(s);
  while (rows.length > ROWS) rows.shift();
  return rows;
}

function part(x) {
  return x === undefined || x === null || x === '' ? '?' : String(x);
}

// First screen line: Wear Engine service version, setPeerFingerPrint result, receiver result, ping code.
function headLine(ver, fp, rx, png) {
  return 'v' + part(ver) + ' fp' + part(fp) + ' rx' + part(rx) + ' png' + part(png);
}

function tallyLine(n) {
  return 'sent ' + n.sent + ' ack ' + n.ack + ' lost ' + n.lost + ' bad ' + n.bad + (n.late ? ' late ' + n.late : '');
}

function secs(ms) {
  return Math.floor(ms / 1000) + 's';
}

function dur(ms) {
  return ms < 10000 ? ms + 'ms' : Math.round(ms / 1000) + 's';
}

function byText(by) {
  return by === 'native' ? 'nat' : by === 'js' ? 'js' : '?';
}

// id (* = phone dup), round trip, bytes the phone got, who answered
function ackRow(r) {
  return (r.kind === 'late' ? 'late ' : '< ') + r.id + (r.dup ? '*' : '') + ' ' + dur(r.ms) + ' ' +
    part(r.n) + 'B ' + byText(r.by);
}

// size, send result, bytes the phone got (! = differ)
function sizeRow(s) {
  var t = s.size + 'B ' + part(s.code) + ' ';
  var a = s.ack;
  if (a) return t + 'n' + part(a.n) + (a.n === s.size ? ' ' : '! ') + byText(a.by) + ' ' + dur(a.ms);
  return t + (s.lost ? 'lost' : 'wait');
}

function autoLine(on, now, lastAck, gap) {
  return (on ? 'on' : 'off') + ' age ' + (lastAck ? secs(now - lastAck) : '-') + ' gap ' + Math.round(gap / 1000) + 's';
}

function hrLine(h, now) {
  if (h.fail) return 'hr fail ' + h.fail;
  return (h.on ? 'hr ' : 'hr off ') + part(h.bpm) + ' n' + h.count + ' ' + (h.at ? secs(now - h.at) : '-');
}

function actLabel(mode, on, vib) {
  if (mode === 'AUTO' || mode === 'HR') return on ? 'Stop' : 'Start';
  if (mode === 'KIT') return vib === 'long' ? 'Long' : 'Short';
  return 'Send';
}

// anything but 1 to 9 digits counts as 0
function nextCount(v) {
  var s = String(v);
  if (s.length < 1 || s.length > 9) return 1;
  for (var i = 0; i < s.length; i++) {
    if (s.charAt(i) < '0' || s.charAt(i) > '9') return 1;
  }
  return Number(s) + 1;
}

function swipeRow(e) {
  var d = e && typeof e.direction === 'string' ? e.direction : '?';
  return 'swipe ' + d + (e && typeof e.distance === 'number' ? ' ' + Math.round(e.distance) : '');
}

function slowTick(prev, now) {
  return prev > 0 && now - prev > GAP_MS ? now - prev : 0;
}

export {
  T, V, MAX_BYTES, LOST_MS, LATE_MS, EVERY_MS, GAP_MS, ROWS, ROW_CHARS, MODES, SIZES, HR_MIN, HR_MAX, PHONE_PKG, PHONE_FP,
  makeBoot, makeRequest, padRequest, makeHr, nextMode, utf8Length, readAck, lost, addRow, headLine, tallyLine,
  ackRow, sizeRow, autoLine, hrLine, actLabel, nextCount, swipeRow, slowTick
};
