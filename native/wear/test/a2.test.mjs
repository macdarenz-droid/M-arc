// Gate A question 2, acceptance A2-1: the watch side of the request and acknowledgement test.
// Covers the message logic in common/a2.js, the phone identity it pins, the source rules the GT 6 engine
// needs, and Huawei's wearengine.js copied in unchanged. Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const JS = path.join(ROOT, 'native/wear/hello/entry/src/main/js/default');
const A2 = path.join(JS, 'common/a2.js');
const load = () => import(pathToFileURL(A2).href);

const ack = (id, extra) => JSON.stringify(Object.assign({ t: 'marc-a2', v: 1, k: 'ack', id, dup: false }, extra));

test('requests are well formed and at most 120 B', async () => {
  const { makeBoot, makeRequest } = await load();
  const boot = makeBoot();
  assert.match(boot, /^[0-9a-z]{6}$/);
  assert.equal(makeBoot(() => 0), '000000');
  assert.equal(makeBoot(() => 0.99999999), 'zzzzzz');
  for (const seq of [1, 2, 42, 99999, 2147483647]) {
    const req = makeRequest(boot, seq);
    const text = JSON.stringify(req);
    assert.equal(text, `{"t":"marc-a2","v":1,"k":"req","id":"${boot}-${seq}","p":"n${seq}"}`);
    assert.ok(Buffer.byteLength(text, 'utf8') <= 120, `${Buffer.byteLength(text)} B`);
    // The phone accepts ids of 3 to 32 characters from [A-Za-z0-9-] (A2-2).
    assert.match(req.id, /^[A-Za-z0-9-]{3,32}$/);
  }
});

test('1,000 generated ids are unique within one boot', async () => {
  const { makeBoot, makeRequest } = await load();
  const boot = makeBoot();
  const ids = new Set();
  for (let seq = 1; seq <= 1000; seq++) ids.add(makeRequest(boot, seq).id);
  assert.equal(ids.size, 1000);
});

test('readAck returns ack with the elapsed ms when the id matches', async () => {
  const { readAck } = await load();
  const pending = { 'abc123-1': 1000, 'abc123-2': 1200 };
  assert.deepEqual(readAck(ack('abc123-1'), pending, 1450), { kind: 'ack', id: 'abc123-1', ms: 450, dup: false, n: null, by: null });
  assert.deepEqual(Object.keys(pending), ['abc123-2']);
  assert.deepEqual(readAck(ack('abc123-2', { dup: true }), pending, 1300), { kind: 'ack', id: 'abc123-2', ms: 100, dup: true, n: null, by: null });
  assert.deepEqual(pending, {});
});

test('an unknown id, or one already answered, gives dup', async () => {
  const { readAck } = await load();
  const pending = { 'abc123-1': 1000 };
  assert.equal(readAck(ack('abc123-1'), pending, 1100).kind, 'ack');
  assert.deepEqual(readAck(ack('abc123-1'), pending, 1200), { kind: 'dup', id: 'abc123-1' });
  assert.deepEqual(readAck(ack('zzz999-7'), pending, 1200), { kind: 'dup', id: 'zzz999-7' });
  // Names on Object.prototype are not pending ids.
  assert.deepEqual(readAck(ack('hasOwnProperty'), pending, 1200), { kind: 'dup', id: 'hasOwnProperty' });
  assert.deepEqual(readAck(ack('__proto__'), pending, 1200), { kind: 'dup', id: '__proto__' });
});

test('bad input gives bad without throwing', async () => {
  const { readAck } = await load();
  const cases = [
    ['type', undefined], ['type', null], ['type', 42], ['type', { isFileType: true, name: 'x' }],
    ['json', ''], ['json', 'not json'], ['json', '{"t":"marc-a2"'], ['json', 'null'], ['json', '"text"'], ['json', '7'],
    ['shape', '[]'], ['shape', ack('a-1', { t: 'marc-a1' })], ['shape', ack('a-1', { v: 2 })], ['shape', ack('a-1', { v: '1' })],
    ['shape', ack('a-1', { k: 'req' })], ['shape', '{"v":1,"k":"ack","id":"a-1"}'],
    ['id', '{"t":"marc-a2","v":1,"k":"ack"}'], ['id', ack(5)], ['id', ack('')], ['id', ack('a'.repeat(33))],
    ['size', 'x'.repeat(1025)],
    // 544 code units but 1,025 bytes: the limit counts UTF-8 bytes.
    ['size', ack('a-1', { pad: '\u00e9'.repeat(481) })],
  ];
  for (const [reason, input] of cases) {
    const pending = { 'a-1': 1000 };
    let out;
    assert.doesNotThrow(() => { out = readAck(input, pending, 2000); }, `input ${String(input).slice(0, 40)}`);
    assert.deepEqual(out, { kind: 'bad', reason }, `input ${String(input).slice(0, 40)}`);
    assert.deepEqual(pending, { 'a-1': 1000 }, 'a bad message leaves pending ids alone');
  }
  const big = ack('a-1', { pad: '\u00e9'.repeat(480) + 'x' });
  assert.equal(Buffer.byteLength(big), 1024);
  assert.equal(readAck(big, { 'a-1': 1000 }, 2000).kind, 'ack', 'exactly 1,024 B is allowed');
});

test('utf8Length counts bytes the way the phone does', async () => {
  const { utf8Length } = await load();
  for (const s of ['', 'abc', '\u00e9', '\u20ac', '\ud83d\ude00', 'a\u00e9\u20ac\ud83d\ude00z']) {
    assert.equal(utf8Length(s), Buffer.byteLength(s, 'utf8'), JSON.stringify(s));
  }
});

test('lost() removes pending ids older than 10 s', async () => {
  const { lost, LOST_MS } = await load();
  assert.equal(LOST_MS, 10000);
  const pending = { 'b-1': 0, 'b-2': 5000, 'b-3': 9000 };
  assert.deepEqual(lost(pending, 15000, 10000), ['b-1']);
  assert.deepEqual(pending, { 'b-2': 5000, 'b-3': 9000 }, 'exactly 10 s old is not lost yet');
  assert.deepEqual(lost(pending, 15001), ['b-2'], 'the limit defaults to 10 s');
  assert.deepEqual(lost(pending, 15001), []);
  assert.deepEqual(pending, { 'b-3': 9000 });
});

test('screen lines', async () => {
  const { addRow, headLine, tallyLine, ROWS } = await load();
  assert.equal(ROWS, 9, 'room for the status line and three buttons (GATE-A-PROBE-2)');
  const rows = [];
  for (let i = 1; i <= 12; i++) addRow(rows, `row ${i}`);
  assert.deepEqual(rows, ['row 4', 'row 5', 'row 6', 'row 7', 'row 8', 'row 9', 'row 10', 'row 11', 'row 12']);
  addRow(rows, 'x'.repeat(40));
  assert.equal(rows[ROWS - 1], 'x'.repeat(30));
  assert.equal(headLine('306', 'ok', 'ok', 205), 'v306 fpok rxok png205');
  assert.equal(headLine(undefined, 208, 'fail', ''), 'v? fp208 rxfail png?');
  assert.equal(tallyLine({ sent: 5, ack: 4, lost: 1, bad: 0 }), 'sent 5 ack 4 lost 1 bad 0');
});

test('PHONE_FP and PHONE_PKG match the phone app', async () => {
  const { PHONE_FP, PHONE_PKG } = await load();
  const yml = readFileSync(path.join(ROOT, '.github/workflows/build-apk.yml'), 'utf8');
  const pins = [...yml.matchAll(/EXPECTED_SHA256: '([0-9A-F:]+)'/g)].map((m) => m[1]);
  assert.equal(pins.length, 1, 'one EXPECTED_SHA256 in build-apk.yml');
  assert.equal(PHONE_FP, pins[0].split(':').join(''));
  assert.match(PHONE_FP, /^[0-9A-F]{64}$/);
  assert.equal(PHONE_PKG, 'com.mrcdrnzz.dailytracker');
  assert.equal(PHONE_PKG, JSON.parse(readFileSync(path.join(ROOT, 'capacitor.config.json'), 'utf8')).appId);
});

// The GT 6 runs ES5 only, its String replace throws, and the old toolchain is unreliable with non-ASCII
// source (community GT 6 notes). Huawei's wearengine.js is checked by its hash instead.
const SOURCES = ['common/a2.js', 'app.js', 'pages/index/index.js', 'pages/index/index.hml', 'pages/index/index.css'];
const JS_RULES = [
  ['RegExp', /\bRegExp\b/],
  ['regular expression literal', /(^|[=(,:[!&|?{};])\s*\/(?![/*])/m],
  ['.replace(', /\.replace\(/],
  ['let', /\blet\b/],
  ['const', /\bconst\b/],
  ['=>', /=>/],
  ['class', /\bclass\b/],
  ['template string', /`/],
];

test('watch sources use only what the GT 6 engine runs', () => {
  for (const rel of SOURCES) {
    const buf = readFileSync(path.join(JS, rel));
    const at = buf.findIndex((b) => b > 0x7f);
    assert.equal(at, -1, `${rel}: non-ASCII byte at offset ${at}`);
    if (!rel.endsWith('.js')) continue;
    const src = buf.toString('utf8');
    for (const [name, rule] of JS_RULES) assert.doesNotMatch(src, rule, `${rel} uses ${name}`);
  }
  assert.doesNotMatch(readFileSync(A2, 'utf8'), /\bimport\b|\brequire\b/, 'a2.js makes no Huawei or module calls');
  assert.match(readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8'),
    /^import \{ P2pClient, Message, Builder \} from '\.\.\/wearengine\.js';$/m, "the page imports the SDK as Huawei's guide does");
});

test("wearengine.js is Huawei's 5.0.2.306 file, unchanged", () => {
  const buf = readFileSync(path.join(JS, 'pages/wearengine.js'));
  assert.equal(createHash('sha256').update(buf).digest('hex'), '8c7f1100c840abdb237991b0d436ef9ab49a215269c5fecdb3dd59fe63a71471');
});
