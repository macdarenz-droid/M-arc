// Gate A question 2: the watch side of the request and acknowledgement test. Plain ES5, no Huawei calls.
// The watch sends   {"t":"marc-a2","v":1,"k":"req","id":"<boot>-<seq>","p":"n<seq>"}
// and the phone app answers {"t":"marc-a2","v":1,"k":"ack","id":"<same id>","dup":<bool>}
// once its own code has read the request. A send result of 207 only proves transport.
// The GT 6 engine runs ES5 only and its String replace method throws, so this file uses no regular
// expressions and no ES2015 syntax. Tests: native/wear/test/a2.test.mjs.

var T = 'marc-a2';
var V = 1;
var MAX_BYTES = 1024; // Huawei's message limit
var MAX_ID = 32;
var LOST_MS = 10000;
var ROWS = 10; // 5 sends and their 5 acknowledgements fit on one screen
var ROW_CHARS = 30;
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

// Reads one received message. Returns {kind:'ack', id, ms, dup} for a pending id (and removes it),
// {kind:'dup', id} for an unknown or already answered id, or {kind:'bad', reason}. Never throws.
function readAck(text, pending, now) {
  if (typeof text !== 'string') return { kind: 'bad', reason: 'type' };
  if (text.length > MAX_BYTES || utf8Length(text) > MAX_BYTES) return { kind: 'bad', reason: 'size' };
  var m;
  try {
    m = JSON.parse(text);
  } catch (e) {
    return { kind: 'bad', reason: 'json' };
  }
  if (m === null || typeof m !== 'object') return { kind: 'bad', reason: 'json' };
  if (m.t !== T || m.v !== V || m.k !== 'ack') return { kind: 'bad', reason: 'shape' };
  if (typeof m.id !== 'string' || m.id.length === 0 || m.id.length > MAX_ID) return { kind: 'bad', reason: 'id' };
  if (!has(pending, m.id)) return { kind: 'dup', id: m.id };
  var ms = now - pending[m.id];
  delete pending[m.id];
  return { kind: 'ack', id: m.id, ms: ms, dup: m.dup === true };
}

// Removes and returns the pending ids sent more than limit ms (default 10 s) before now.
function lost(pending, now, limit) {
  var max = typeof limit === 'number' ? limit : LOST_MS;
  var gone = [];
  for (var id in pending) {
    if (has(pending, id) && now - pending[id] > max) gone.push(id);
  }
  for (var i = 0; i < gone.length; i++) delete pending[gone[i]];
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
  return 'sent ' + n.sent + ' ack ' + n.ack + ' lost ' + n.lost + ' bad ' + n.bad;
}

export {
  T, V, MAX_BYTES, LOST_MS, ROWS, PHONE_PKG, PHONE_FP,
  makeBoot, makeRequest, utf8Length, readAck, lost, addRow, headLine, tallyLine
};
