import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createProbe } from './gt6-probe/probe.js';

const run = '00000000-0000-4000-8000-000000000001';
const id = '00000000-0000-4000-8000-000000000002';
function fixture() {
  let now = new Date(2026, 8, 23, 14).getTime(), subscription, unsubscribe = 0, writes = 0, timer;
  const sent = [], values = [], stored = {};
  const io = {
    now: () => now, setTimeout: fn => { timer = fn; return 1; }, clearTimeout: () => {}, setInterval: () => 2, clearInterval: () => {},
    status: () => {}, heart: bpm => values.push(bpm), send: text => sent.push(JSON.parse(text)),
    sensor: { subscribeHeartRate: options => { subscription = options; }, unsubscribeHeartRate: () => { unsubscribe++; } },
    storage: { set: o => { writes++; stored[o.key] = o.value; o.success(); }, get: o => o.success(stored[o.key] || '') },
    vibrator: { vibrate: o => o.success() }
  };
  const probe = createProbe(io);
  const send = (op, extra = {}) => probe.receive(JSON.stringify({ tag: 'marc-watch-lab', v: 1, run, id, op, ...extra }));
  return { probe, io, send, sent, values, sample: value => subscription.success({ heartRate: value }),
    fail: code => subscription.fail('', code), expire: () => timer(),
    advance: n => { now += n; }, writes: () => writes, unsubscribe: () => unsubscribe };
}
test('echo replies correlate with the actual phone request, not SDK send acceptance', () => {
  const f = fixture(); f.send('echo'); assert.equal(f.sent.length, 1);
  assert.deepEqual([f.sent[0].kind, f.sent[0].run, f.sent[0].id, f.sent[0].status], ['reply', run, id, 'ok']);
});
test('malformed and oversized input causes no side effects', () => {
  const f = fixture(); f.probe.receive('{'); f.probe.receive('x'.repeat(1025)); f.probe.receive('{}');
  assert.equal(f.sent.length, 0); assert.equal(f.writes(), 0);
});
test('a repeated storage command only writes once', () => {
  const f = fixture(); f.send('storage_write'); f.send('storage_write'); assert.equal(f.writes(), 1);
  f.send('storage_read', { id: '00000000-0000-4000-8000-000000000003' }); assert.equal(f.sent[1].value, id);
});
test('HR acknowledges subscription separately, rejects invalid samples and caps send frequency', () => {
  const f = fixture(); f.send('hr_start'); assert.equal(f.sent[0].status, 'subscription_requested');
  f.sample(0); f.sample(NaN); f.sample(301); f.sample(123); f.sample(124); f.advance(1000); f.sample(125);
  assert.deepEqual(f.values, [123, 125]); assert.deepEqual(f.sent.filter(x => x.kind === 'hr').map(x => x.seq), [1, 2]);
});
test('a sensor failure is sent to the phone, not fabricated as a sample', () => {
  const f = fixture(); f.send('hr_start'); f.fail(201);
  assert.equal(f.sent.at(-1).kind, 'sensor_error'); assert.equal(f.sent.at(-1).code, '201'); assert.equal(f.values.length, 0);
});
test('HR stops at deadline even if a background timer was suspended', () => {
  const f = fixture(); f.send('hr_start'); f.advance(300001); f.sample(120);
  assert.equal(f.values.length, 0); assert.ok(f.unsubscribe() > 0);
});
test('old sensor callbacks cannot contaminate a new run', () => {
  const f = fixture(); f.send('hr_start'); f.send('echo', { run: '00000000-0000-4000-8000-000000000004' }); f.sample(120);
  assert.equal(f.values.length, 0);
});
test('disposing cancels sensing and suppresses late callbacks', () => {
  const f = fixture(); f.send('hr_start'); f.probe.dispose(); f.sample(120); f.send('echo');
  assert.equal(f.sent.length, 1); assert.equal(f.values.length, 0);
});
test('absent HR API reports unsupported', () => {
  const f = fixture(); delete f.io.sensor.subscribeHeartRate; f.send('hr_start');
  assert.equal(f.sent[0].status, 'unsupported');
});

test('local watch HR can be tested before phone messaging is authorized', () => {
  const f = fixture(); f.probe.startLocal(); f.sample(112);
  assert.deepEqual(f.values, [112]); assert.equal(f.sent.length, 0);
  f.probe.stop(); f.sample(113);
  assert.deepEqual(f.values, [112]);
});
