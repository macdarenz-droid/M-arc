// GATE-A-PROBE-2: the watch side of the second Gate A probe (questions 3, 4 and 6 of
// docs/WATCH-ARCHITECTURE.md section 10). Covers the new pure functions in common/a2.js: modes, padded
// requests, heart-rate reports, acknowledgements with n and by, late acknowledgements and the screen lines.
// Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const MAIN = path.join(ROOT, 'native/wear/hello/entry/src/main');
const JS = path.join(MAIN, 'js/default');
const load = () => import(pathToFileURL(path.join(JS, 'common/a2.js')).href);

const ack = (id, extra) => JSON.stringify(Object.assign({ t: 'marc-a2', v: 1, k: 'ack', id, dup: false }, extra));

test('GATE-A-PROBE-2 modes cycle MSG, AUTO, SIZE, HR, KIT', async () => {
  const { MODES, nextMode } = await load();
  assert.deepEqual(MODES, ['MSG', 'AUTO', 'SIZE', 'HR', 'KIT']);
  assert.equal(nextMode('MSG'), 'AUTO');
  assert.equal(nextMode('AUTO'), 'SIZE');
  assert.equal(nextMode('SIZE'), 'HR');
  assert.equal(nextMode('HR'), 'KIT');
  assert.equal(nextMode('KIT'), 'MSG');
  for (const odd of [undefined, '', 'msg', 'toString', 7]) assert.equal(nextMode(odd), 'MSG', String(odd));
});

test('GATE-A-PROBE-2 padded requests are exactly 100, 200, 400, 800 and 1000 B', async () => {
  const { SIZES, padRequest } = await load();
  assert.deepEqual(SIZES, [100, 200, 400, 800, 1000]);
  for (const boot of ['000000', 'q1tyot', 'zzzzzz']) {
    for (const seq of [1, 9, 10, 99999, 2147483647]) {
      for (const size of SIZES) {
        const req = padRequest(boot, seq, size);
        const text = JSON.stringify(req);
        assert.equal(Buffer.byteLength(text, 'utf8'), size, `${boot}-${seq} ${size}`);
        assert.deepEqual(Object.keys(req), ['t', 'v', 'k', 'id', 'p']);
        assert.deepEqual([req.t, req.v, req.k, req.id], ['marc-a2', 1, 'req', `${boot}-${seq}`]);
        assert.match(req.p, /^[0-9]+$/, 'ASCII padding that JSON never escapes');
        assert.match(req.id, /^[A-Za-z0-9-]{3,32}$/);
      }
    }
  }
  assert.equal(padRequest('q1tyot', 1, 1024).p.length > 0, true, 'the 1,024 B cap itself is allowed');
  assert.equal(padRequest('q1tyot', 1, 1025), null, 'over the 1,024 B cap');
  assert.equal(padRequest('q1tyot', 1, 40), null, 'too small to hold the request');
  const tight = JSON.stringify({ t: 'marc-a2', v: 1, k: 'req', id: 'q1tyot-1', p: '' }).length;
  assert.equal(padRequest('q1tyot', 1, tight).p, '', 'the smallest size gives empty padding');
  assert.equal(padRequest('q1tyot', 1, tight - 1), null);
});

test('GATE-A-PROBE-2 heart-rate reports carry an integer bpm from 20 to 250', async () => {
  const { makeHr, HR_MIN, HR_MAX } = await load();
  assert.deepEqual([HR_MIN, HR_MAX], [20, 250]);
  assert.equal(JSON.stringify(makeHr('q1tyot', 5, 72)), '{"t":"marc-a2","v":1,"k":"hr","id":"q1tyot-5","bpm":72}');
  assert.equal(makeHr('q1tyot', 6, 20).bpm, 20);
  assert.equal(makeHr('q1tyot', 7, 250).bpm, 250);
  // 255 is the lite wearable's invalid reading (@system.sensor.d.ts HeartRateResponse).
  for (const bad of [19, 251, 255, 72.5, '72', NaN, Infinity, null, undefined, -72]) {
    assert.equal(makeHr('q1tyot', 8, bad), null, String(bad));
  }
});

test('GATE-A-PROBE-2 readAck returns n and by from the phone', async () => {
  const { readAck } = await load();
  let pending = { 'a-1': 1000 };
  assert.deepEqual(readAck(ack('a-1', { n: 56, by: 'native' }), pending, 1061),
    { kind: 'ack', id: 'a-1', ms: 61, dup: false, n: 56, by: 'native' });
  pending = { 'a-1': 1000 };
  assert.deepEqual(readAck(ack('a-1', { dup: true, n: 1000, by: 'js' }), pending, 1300),
    { kind: 'ack', id: 'a-1', ms: 300, dup: true, n: 1000, by: 'js' });
  // An acknowledgement without them (the 1.0.2 lab) still counts; the fields read as unknown.
  pending = { 'a-1': 1000 };
  assert.deepEqual(readAck(ack('a-1'), pending, 1100), { kind: 'ack', id: 'a-1', ms: 100, dup: false, n: null, by: null });
  for (const n of [-1, 1.5, '56', 1025, null, true, NaN]) {
    pending = { 'a-1': 1000 };
    assert.equal(readAck(ack('a-1', { n, by: 'js' }), pending, 1100).n, null, `n ${String(n)}`);
  }
  pending = { 'a-1': 1000 };
  assert.equal(readAck(ack('a-1', { n: 0 }), pending, 1100).n, 0);
  for (const by of ['JS', 'Native', 'x', 5, null, '']) {
    pending = { 'a-1': 1000 };
    assert.equal(readAck(ack('a-1', { n: 56, by }), pending, 1100).by, null, `by ${String(by)}`);
  }
});

test('GATE-A-PROBE-2 an acknowledgement after the 10 s limit is late, not dup', async () => {
  const { readAck, lost } = await load();
  const pending = { 'a-1': 1000, 'a-2': 9000 };
  const late = {};
  assert.deepEqual(lost(pending, 12000, 10000, late), ['a-1']);
  assert.deepEqual(pending, { 'a-2': 9000 });
  assert.deepEqual(late, { 'a-1': 1000 }, 'the send time is kept');
  assert.deepEqual(readAck(ack('a-1', { n: 56, by: 'js' }), pending, 46000, late),
    { kind: 'late', id: 'a-1', ms: 45000, dup: false, n: 56, by: 'js' });
  assert.deepEqual(late, {});
  assert.deepEqual(readAck(ack('a-1'), pending, 47000, late), { kind: 'dup', id: 'a-1' });
  assert.deepEqual(readAck(ack('toString'), pending, 47000, late), { kind: 'dup', id: 'toString' });
  // Without a late map readAck behaves as before.
  assert.deepEqual(readAck(ack('a-9'), pending, 47000), { kind: 'dup', id: 'a-9' });
  // Late entries are dropped after LATE_MS.
  const { LATE_MS } = await load();
  assert.equal(LATE_MS, 600000);
  const old = { 'b-1': 0, 'b-2': 500000 };
  assert.deepEqual(lost(old, 600001, LATE_MS), ['b-1']);
  assert.deepEqual(old, { 'b-2': 500000 });
});

test('GATE-A-PROBE-2 screen rows fit 30 characters', async () => {
  const { ackRow, sizeRow, ROW_CHARS } = await load();
  assert.equal(ROW_CHARS, 30);
  assert.equal(ackRow({ kind: 'ack', id: 'q1tyot-1', ms: 159, dup: false, n: 56, by: 'js' }), '< q1tyot-1 159ms 56B js');
  assert.equal(ackRow({ kind: 'ack', id: 'q1tyot-2', ms: 61, dup: true, n: 56, by: 'native' }), '< q1tyot-2* 61ms 56B nat');
  assert.equal(ackRow({ kind: 'late', id: 'q1tyot-3', ms: 45200, dup: false, n: 56, by: 'native' }), 'late q1tyot-3 45s 56B nat');
  assert.equal(ackRow({ kind: 'ack', id: 'q1tyot-4', ms: 9999, dup: false, n: null, by: null }), '< q1tyot-4 9999ms ?B ?');
  assert.equal(ackRow({ kind: 'ack', id: 'q1tyot-5', ms: 10000, dup: false, n: 0, by: 'js' }), '< q1tyot-5 10s 0B js');
  // Longest rows for seq < 1000: MSG, AUTO and HR messages are under 100 B; SIZE uses sizeRow.
  assert.equal(ackRow({ kind: 'late', id: 'zzzzzz-999', ms: 599999, dup: true, n: 99, by: 'native' }).length, 29);
  assert.equal(ackRow({ kind: 'ack', id: 'zzzzzz-999', ms: 9999, dup: true, n: 1000, by: 'native' }).length, ROW_CHARS);

  assert.equal(sizeRow({ size: 400, id: 'q-1', code: '', ack: null, lost: false }), '400B ? wait');
  assert.equal(sizeRow({ size: 400, id: 'q-1', code: 207, ack: null, lost: false }), '400B 207 wait');
  assert.equal(sizeRow({ size: 800, id: 'q-1', code: 206, ack: null, lost: true }), '800B 206 lost');
  assert.equal(sizeRow({ size: 400, code: 207, ack: { kind: 'ack', ms: 80, n: 400, by: 'js' } }), '400B 207 n400 js 80ms');
  assert.equal(sizeRow({ size: 400, code: 207, ack: { kind: 'ack', ms: 80, n: 398, by: 'js' } }), '400B 207 n398! js 80ms');
  assert.equal(sizeRow({ size: 1000, code: 207, ack: { kind: 'late', ms: 45200, n: 1000, by: 'native' } }), '1000B 207 n1000 nat 45s');
  assert.equal(sizeRow({ size: 100, code: 207, ack: { kind: 'ack', ms: 80, n: null, by: null } }), '100B 207 n?! ? 80ms');
  assert.ok(sizeRow({ size: 1000, code: 207, ack: { kind: 'ack', ms: 9999, n: 1024, by: 'native' } }).length <= ROW_CHARS);
});

test('GATE-A-PROBE-2 status lines', async () => {
  const { tallyLine, autoLine, hrLine, actLabel } = await load();
  assert.equal(tallyLine({ sent: 5, ack: 4, lost: 1, bad: 0, late: 0 }), 'sent 5 ack 4 lost 1 bad 0');
  assert.equal(tallyLine({ sent: 12, ack: 9, lost: 3, bad: 0, late: 2 }), 'sent 12 ack 9 lost 3 bad 0 late 2');

  assert.equal(autoLine(false, 5000, 0, 0), 'off age - gap 0s');
  assert.equal(autoLine(true, 63500, 60000, 5020), 'on age 3s gap 5s');
  assert.equal(autoLine(true, 200000, 60000, 63000), 'on age 140s gap 63s');

  assert.equal(hrLine({ on: true, bpm: '', count: 0, at: 0, fail: '' }, 9000), 'hr ? n0 -');
  assert.equal(hrLine({ on: true, bpm: 72, count: 15, at: 7000, fail: '' }, 9500), 'hr 72 n15 2s');
  assert.equal(hrLine({ on: false, bpm: 255, count: 3, at: 1000, fail: '' }, 41000), 'hr off 255 n3 40s');
  assert.equal(hrLine({ on: false, bpm: '', count: 0, at: 0, fail: '201' }, 41000), 'hr fail 201');

  assert.equal(actLabel('MSG', false, 'short'), 'Send');
  assert.equal(actLabel('SIZE', true, 'short'), 'Send');
  assert.equal(actLabel('AUTO', false, 'short'), 'Start');
  assert.equal(actLabel('AUTO', true, 'short'), 'Stop');
  assert.equal(actLabel('HR', false, 'long'), 'Start');
  assert.equal(actLabel('HR', true, 'long'), 'Stop');
  assert.equal(actLabel('KIT', false, 'short'), 'Short');
  assert.equal(actLabel('KIT', false, 'long'), 'Long');
});

test('GATE-A-PROBE-2 launch counter, swipe rows and timer gaps', async () => {
  const { nextCount, swipeRow, slowTick, GAP_MS, EVERY_MS } = await load();
  assert.equal(nextCount('0'), 1);
  assert.equal(nextCount('41'), 42);
  assert.equal(nextCount(41), 42);
  for (const odd of ['', undefined, null, 'x', '-3', '1.5', '12a', ' 7', '1234567890']) assert.equal(nextCount(odd), 1, String(odd));
  assert.equal(nextCount('999999999'), 1000000000);

  assert.equal(swipeRow({ direction: 'left', distance: 120.4 }), 'swipe left 120');
  assert.equal(swipeRow({ direction: 'up' }), 'swipe up');
  assert.equal(swipeRow({}), 'swipe ?');
  assert.equal(swipeRow(undefined), 'swipe ?');

  assert.equal(EVERY_MS, 5000);
  assert.equal(GAP_MS, 7500);
  assert.equal(slowTick(0, 50000), 0, 'the first tick has no gap');
  assert.equal(slowTick(10000, 15000), 0);
  assert.equal(slowTick(10000, 17500), 0);
  assert.equal(slowTick(10000, 17501), 7501);
  assert.equal(slowTick(10000, 73000), 63000);
});

test('GATE-A-PROBE-2 page markup matches the page data', async () => {
  const { ROWS } = await load();
  assert.equal(ROWS, 9, 'nine log rows leave room for the status line and three buttons on the 466 px circle');
  const hml = readFileSync(path.join(JS, 'pages/index/index.hml'), 'utf8');
  const page = readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8');
  const bound = [...hml.matchAll(/\{\{ ?(\w+) ?\}\}/g)].map((m) => m[1]);
  const rows = Array.from({ length: ROWS }, (_, i) => `r${i}`);
  assert.deepEqual(bound, ['head', ...rows, 'tally', 'sub', 'act']);
  for (const key of bound) assert.match(page, new RegExp(`^    ${key}: '',?$`, 'm'), `data.${key}`);
  for (const handler of ['onSend', 'onSetup', 'onMode', 'onSwipe']) {
    assert.match(hml, new RegExp(`="${handler}"`), `${handler} is bound`);
    assert.match(page, new RegExp(`^  ${handler}\\(`, 'm'), `${handler} is defined`);
  }
  // Only system modules whose typings the 3.2 SDK ships (js/api/@system.*.d.ts), and each subscription is undone.
  const sys = [...page.matchAll(/^import (\w+) from '@system\.(\w+)';$/gm)].map((m) => m[2]);
  assert.deepEqual(sys, ['sensor', 'storage', 'vibrator', 'brightness']);
  assert.match(page, /sensor\.subscribeHeartRate\(/);
  assert.match(page, /sensor\.unsubscribeHeartRate\(\)/);
  assert.match(page, /clearInterval\(/);
});

test('GATE-A-PROBE-2 config: version 1.0.4 and the two permissions the lite installer can parse', () => {
  const cfg = JSON.parse(readFileSync(path.join(MAIN, 'config.json'), 'utf8'));
  assert.deepEqual(cfg.app.version, { code: 1000004, name: '1.0.4' });
  assert.equal(cfg.app.bundleName, 'com.mrcdrnzz.dailytracker.watch');
  const perms = cfg.module.reqPermissions;
  assert.deepEqual(perms.map((p) => p.name), ['ohos.permission.READ_HEALTH_DATA', 'ohos.permission.VIBRATE']);
  for (const p of perms) {
    // gt_bundle_parser.cpp SetReqPermission: name and reason are required, usedScene.when is inuse or always,
    // and reason is copied into a fixed buffer, so it stays short ASCII.
    assert.deepEqual(Object.keys(p), ['name', 'reason', 'usedScene']);
    assert.match(p.reason, /^[ -~]{1,64}$/);
    assert.deepEqual(p.usedScene, { ability: ['default'], when: 'inuse' });
  }
  assert.equal(cfg.module.abilities[0].name, 'default');
});

// GATE-A-PROBE-2 screen-off follow-up: the GT 6 closed the app about 25 s after its screen went dark (device run J),
// so 1.0.4 asks to keep the screen on while AUTO or HR runs and lets it go dark again on every stop.
test('GATE-A-PROBE-2 keepWanted is true only for a running AUTO or HR', async () => {
  const { keepWanted, MODES } = await load();
  for (const m of MODES) {
    assert.equal(keepWanted(m, true), m === 'AUTO' || m === 'HR', m);
    assert.equal(keepWanted(m, false), false, m);
  }
  for (const odd of [undefined, '', 'auto', 'hr', 7]) assert.equal(keepWanted(odd, true), false, String(odd));
  for (const odd of [undefined, 1, 'true', {}]) assert.equal(keepWanted('AUTO', odd), false, String(odd));
});

test('GATE-A-PROBE-2 page keeps the screen on when AUTO or HR starts and releases it on every stop', () => {
  const page = readFileSync(path.join(JS, 'pages/index/index.js'), 'utf8');
  assert.match(page, /^import brightness from '@system\.brightness';$/m);
  assert.match(page, /brightness\.setKeepScreenOn\(\{\s*keepScreenOn: on,/);
  const stop = page.slice(page.indexOf('function stop(vm, quiet) {'), page.indexOf('function setKeep('));
  assert.match(stop, /setKeep\(vm, false, quiet\);\n\}/, 'stop always lets the screen go dark again');
  // only once a timer runs: a heart-rate start that throws starts none and must not hold the screen on
  assert.match(page, /else startTimer\(vm\);\n\s*setKeep\(vm, keepWanted\(mode, timer !== null\), false\);/);
  assert.match(page, /onShow\(\) \{\n(\s*\/\/.*\n)?\s*if \(keep\) \{\n\s*keep = false;\n\s*setKeep\(this, true, false\);/,
    'the request is repeated when the page comes back on screen');
  assert.match(page, /onDestroy\(\) \{\n\s*stop\(this, true\);/, 'onDestroy releases it without touching the page');
  assert.match(page, /onMode\(\) \{\n\s*stop\(this\);/, 'a mode change stops and releases it');
});
