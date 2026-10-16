// Gate A question 2 (watch lane), acceptance A2-2 and A2-6: the phone side of the request and
// acknowledgement test in src/native/wearEngine.ts, and the hidden Watch lab in
// src/slices/settings/WatchLab.tsx. The watch side is native/wear/test/a2.test.mjs (A2-1).
// GATE-A-PROBE-2 adds heart-rate reports, the n and by ack fields, the native receipt time and the
// Native ack toggle (Gate A questions 3, 4 and 6).
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import {
  ACK_MEMORY, BPM_MAX, BPM_MIN, BRIDGE_TIMEOUT_MS, LOG_ROWS, MAX_BYTES, SEND_OK, WATCH_BUNDLE, WATCH_FP,
  buildAck, createLab, parseRequest, wearAvailable, type WearEnginePlugin,
} from '@/native/wearEngine';
import { WatchLabEntry } from '@/slices/settings/WatchLab';

const file = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p: string) => readFileSync(file(p), 'utf8');
const utf8 = (s: string) => new TextEncoder().encode(s).length;
const req = (id: unknown, extra: Record<string, unknown> = {}) => JSON.stringify({ t: 'marc-a2', v: 1, k: 'req', id, p: 'n1', ...extra });
const hr = (id: unknown, bpm: unknown, extra: Record<string, unknown> = {}) => JSON.stringify({ t: 'marc-a2', v: 1, k: 'hr', id, bpm, ...extra });
const PLUGIN_JAVA = 'native/wear/android/WearEnginePlugin.java';
const WATCH_A2 = 'native/wear/hello/entry/src/main/js/default/common/a2.js';

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); });

describe('A2-2 parseRequest', () => {
  it('accepts a valid request and returns its id', () => {
    expect(parseRequest(req('k3x9qa-1'))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'req', id: 'k3x9qa-1', p: 'n1' } });
    expect(parseRequest(JSON.stringify({ t: 'marc-a2', v: 1, k: 'req', id: 'abc' }))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'req', id: 'abc' } });
  });
  it('rejects more than 1,024 UTF-8 bytes, counting bytes and not characters', () => {
    const pad = (n: number, ch = 'x') => req('k3x9qa-1', { q: ch.repeat(n) });
    const base = utf8(pad(0));
    expect(utf8(pad(MAX_BYTES - base))).toBe(1024);
    expect(parseRequest(pad(MAX_BYTES - base)).ok).toBe(true);
    expect(parseRequest(pad(MAX_BYTES - base + 1))).toEqual({ ok: false, reason: 'size' });
    const wide = pad(600, 'é'); // 600 characters, 1,200 bytes
    expect(wide.length).toBeLessThan(1024);
    expect(parseRequest(wide)).toEqual({ ok: false, reason: 'size' });
  });
  it('rejects bad JSON and JSON that is not an object', () => {
    for (const text of ['', '{', 'req', 'null', '[]', '"x"', '42', 'true']) expect(parseRequest(text), text).toEqual({ ok: false, reason: 'json' });
  });
  it('rejects a wrong t, v or k', () => {
    for (const over of [{ t: 'marc-a1' }, { t: undefined }, { v: 2 }, { v: '1' }, { k: 'ack' }, { k: 'REQ' }, { k: 'HR' }, { k: 'heart' }, { k: undefined }]) {
      expect(parseRequest(req('k3x9qa-1', over)), JSON.stringify(over)).toEqual({ ok: false, reason: 'shape' });
    }
  });
  it('rejects an id that is missing or outside 3 to 32 characters of [A-Za-z0-9-]', () => {
    for (const id of [undefined, null, 7, '', 'ab', 'a'.repeat(33), 'ab_cd', 'ab cd', 'abé', 'ab.c', 'ab\n']) {
      expect(parseRequest(req(id)), String(id)).toEqual({ ok: false, reason: 'id' });
    }
    expect(parseRequest(req('a-1')).ok).toBe(true);
    expect(parseRequest(req('A'.repeat(31) + '9')).ok).toBe(true);
  });
  it('accepts a request padded with p to exactly 100, 200, 400, 800, 1,000 and 1,024 bytes, and keeps p', () => {
    const base = utf8(req('k3x9qa-1', { p: '' }));
    for (const size of [100, 200, 400, 800, 1000, MAX_BYTES]) {
      const p = 'x'.repeat(size - base);
      expect(utf8(req('k3x9qa-1', { p })), String(size)).toBe(size);
      expect(parseRequest(req('k3x9qa-1', { p }))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'req', id: 'k3x9qa-1', p } });
    }
    expect(parseRequest(req('k3x9qa-1', { p: 'x'.repeat(MAX_BYTES - base + 1) }))).toEqual({ ok: false, reason: 'size' });
  });
  it('accepts a heart-rate report with an integer bpm from 20 to 250', () => {
    expect([BPM_MIN, BPM_MAX]).toEqual([20, 250]);
    for (const bpm of [20, 21, 72, 249, 250]) {
      expect(parseRequest(hr('k3x9qa-7', bpm)), String(bpm)).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'hr', id: 'k3x9qa-7', bpm } });
    }
    expect(parseRequest('{"t":"marc-a2","v":1,"k":"hr","id":"k3x9qa-7","bpm":72.0}')).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'hr', id: 'k3x9qa-7', bpm: 72 } });
    // p is not part of a heart-rate report: it is ignored like any other extra field
    expect(parseRequest(hr('k3x9qa-7', 72, { p: 'n7' }))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'hr', id: 'k3x9qa-7', bpm: 72 } });
  });
  it('rejects a heart-rate report whose bpm is missing, outside 20 to 250 or not an integer', () => {
    for (const bpm of [undefined, null, 19, 251, 0, -72, 72.5, 19.999, 250.5, '72', true, [72], { v: 72 }]) {
      expect(parseRequest(hr('k3x9qa-7', bpm)), JSON.stringify(bpm)).toEqual({ ok: false, reason: 'bpm' });
    }
    expect(parseRequest('{"t":"marc-a2","v":1,"k":"hr","id":"k3x9qa-7","bpm":1e3}')).toEqual({ ok: false, reason: 'bpm' });
    // the id is checked first, as for a request
    expect(parseRequest(hr('ab', 72))).toEqual({ ok: false, reason: 'id' });
    expect(parseRequest(hr(undefined, 19))).toEqual({ ok: false, reason: 'id' });
    // bpm on a request is ignored, as before
    expect(parseRequest(req('k3x9qa-1', { bpm: 999 }))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'req', id: 'k3x9qa-1', p: 'n1' } });
  });
  it('gives type for a non-string and never throws', () => {
    for (const v of [undefined, null, 5, {}, ['{}']]) expect(parseRequest(v)).toEqual({ ok: false, reason: 'type' });
  });
  it("accepts every request the watch's own a2.js builds", async () => {
    const watch = await import(/* @vite-ignore */ pathToFileURL(file(WATCH_A2)).href) as {
      MAX_BYTES: number; makeBoot: () => string; makeRequest: (boot: string, seq: number) => unknown;
    };
    expect(watch.MAX_BYTES).toBe(MAX_BYTES);
    const boot = watch.makeBoot();
    for (const seq of [1, 2, 99, 1_000_000]) {
      const r = parseRequest(JSON.stringify(watch.makeRequest(boot, seq)));
      expect(r).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'req', id: `${boot}-${seq}`, p: `n${seq}` } });
    }
  });
});

describe('GATE-A-PROBE-2 the watch side builds what the phone accepts', () => {
  type WatchA2 = {
    SIZES: number[]; HR_MIN: number; HR_MAX: number; makeBoot: () => string;
    padRequest: (boot: string, seq: number, size: number) => unknown; makeHr: (boot: string, seq: number, bpm: number) => unknown;
  };
  const watchA2 = async () => await import(/* @vite-ignore */ pathToFileURL(file(WATCH_A2)).href) as WatchA2;
  it("every SIZE request from the watch's a2.js is accepted, and the JS ack's n echoes its exact size", async () => {
    const watch = await watchA2();
    expect(watch.SIZES).toEqual([100, 200, 400, 800, 1000]);
    const boot = watch.makeBoot();
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    for (const [i, size] of watch.SIZES.entries()) {
      const text = JSON.stringify(watch.padRequest(boot, i + 1, size));
      expect(utf8(text), String(size)).toBe(size);
      expect(parseRequest(text)).toMatchObject({ ok: true, req: { k: 'req', id: `${boot}-${i + 1}` } });
      await lab.receive(msg(text));
    }
    expect(f.sent.map(t => (JSON.parse(t) as { n: number }).n)).toEqual(watch.SIZES);
  });
  it("every heart-rate report the watch's a2.js builds is accepted, over the same bpm range", async () => {
    const watch = await watchA2();
    expect([watch.HR_MIN, watch.HR_MAX]).toEqual([BPM_MIN, BPM_MAX]);
    const boot = watch.makeBoot();
    for (const bpm of [BPM_MIN, 72, BPM_MAX]) {
      expect(parseRequest(JSON.stringify(watch.makeHr(boot, 7, bpm)))).toEqual({ ok: true, req: { t: 'marc-a2', v: 1, k: 'hr', id: `${boot}-7`, bpm } });
    }
    for (const bpm of [BPM_MIN - 1, BPM_MAX + 1, 72.5]) expect(watch.makeHr(boot, 7, bpm), String(bpm)).toBeNull();
  });
});

describe('A2-2 buildAck', () => {
  it('returns the same id, dup, the received byte count n and by in the agreed message, at most 120 bytes', () => {
    const seen: string[] = [];
    expect(buildAck({ id: 'k3x9qa-1' }, seen, 56, 'js')).toEqual({ text: '{"t":"marc-a2","v":1,"k":"ack","id":"k3x9qa-1","dup":false,"n":56,"by":"js"}', dup: false });
    expect(buildAck({ id: 'k3x9qa-2' }, seen, 1000, 'native')).toEqual({ text: '{"t":"marc-a2","v":1,"k":"ack","id":"k3x9qa-2","dup":false,"n":1000,"by":"native"}', dup: false });
    const long = 'Z'.repeat(32);
    expect(utf8(buildAck({ id: long }, seen, MAX_BYTES, 'native').text)).toBeLessThanOrEqual(120);
    expect(utf8(buildAck({ id: long }, seen, MAX_BYTES, 'native').text)).toBeLessThanOrEqual(120); // the dup:true form
  });
  it('sets dup:true on a second request with the same id', () => {
    const seen: string[] = [];
    expect(buildAck({ id: 'k3x9qa-1' }, seen, 56, 'js').dup).toBe(false);
    expect(buildAck({ id: 'k3x9qa-2' }, seen, 56, 'js').dup).toBe(false);
    const again = buildAck({ id: 'k3x9qa-1' }, seen, 57, 'js');
    expect(again.dup).toBe(true);
    expect(JSON.parse(again.text)).toEqual({ t: 'marc-a2', v: 1, k: 'ack', id: 'k3x9qa-1', dup: true, n: 57, by: 'js' });
  });
  it('remembers only the last 32 ids', () => {
    expect(ACK_MEMORY).toBe(32);
    const seen: string[] = [];
    for (let i = 1; i <= 33; i++) buildAck({ id: `id-${i}` }, seen, 56, 'js');
    expect(seen).toHaveLength(32);
    expect(buildAck({ id: 'id-33' }, seen, 56, 'js').dup).toBe(true);
    expect(buildAck({ id: 'id-2' }, seen, 56, 'js').dup).toBe(true);
    expect(buildAck({ id: 'id-1' }, seen, 56, 'js').dup).toBe(false); // the 33rd id back pushed it out
    expect(seen).toHaveLength(32);
  });
  it("is read as an acknowledgement by the watch's own a2.js", async () => {
    const watch = await import(/* @vite-ignore */ pathToFileURL(file(WATCH_A2)).href) as {
      readAck: (text: unknown, pending: Record<string, number>, now: number) => { kind: string; id?: string; ms?: number; dup?: boolean };
    };
    const pending: Record<string, number> = { 'k3x9qa-1': 1000, 'k3x9qa-2': 1000 };
    expect(watch.readAck(buildAck({ id: 'k3x9qa-1' }, [], 56, 'js').text, pending, 1250)).toEqual({ kind: 'ack', id: 'k3x9qa-1', ms: 250, dup: false, n: 56, by: 'js' });
    expect(watch.readAck(buildAck({ id: 'k3x9qa-2' }, ['k3x9qa-2'], 1000, 'native').text, pending, 1300)).toEqual({ kind: 'ack', id: 'k3x9qa-2', ms: 300, dup: true, n: 1000, by: 'native' });
  });
  it('WearEnginePlugin.java builds the native ack text exactly as buildAck does', () => {
    const java = read(PLUGIN_JAVA);
    const expr = java.match(/static String ack\(String id, boolean dup, int n, String by\) \{\s*return ([^;]+);/)?.[1];
    const tag = java.match(/static final String TAG = "([^"]+)";/)?.[1];
    expect(expr).toBeDefined();
    expect(tag).toBe('marc-a2');
    // Java string literals with \" and + concatenation of a boolean and an int read the same in JS.
    const javaAck = new Function('TAG', 'id', 'dup', 'n', 'by', `return ${expr ?? ''};`) as (tag: unknown, id: string, dup: boolean, n: number, by: string) => string;
    for (const [id, dup, n] of [['k3x9qa-1', false, 56], ['Z'.repeat(32), true, MAX_BYTES], ['a-1', false, 0]] as const) {
      expect(javaAck(tag, id, dup, n, 'native')).toBe(buildAck({ id }, dup ? [id] : [], n, 'native').text);
    }
  });
  it('the native ack in WearEnginePlugin.java uses the same limits and id rule as this file', () => {
    const java = read(PLUGIN_JAVA);
    const num = (name: string) => Number(java.match(new RegExp(`\\b${name} = (\\d+);`))?.[1]);
    expect(num('MAX_BYTES')).toBe(MAX_BYTES);
    expect(num('ACK_MEMORY')).toBe(ACK_MEMORY);
    expect(num('SEND_OK')).toBe(SEND_OK);
    expect(num('BPM_MIN')).toBe(BPM_MIN);
    expect(num('BPM_MAX')).toBe(BPM_MAX);
    expect(java).toContain('Pattern.compile("[A-Za-z0-9-]{3,32}")');
    expect(read('src/native/wearEngine.ts')).toContain('const ID = /^[A-Za-z0-9-]{3,32}$/;');
  });
  it('WearEnginePlugin.java rejects text after the JSON object, as JSON.parse does', () => {
    const java = read(PLUGIN_JAVA);
    expect(java).toContain('new JSONTokener(text)');
    expect(java).toContain('tk.nextClean() != 0');
    expect(java).not.toContain('o = new JSONObject(text)');
    expect(parseRequest('{"t":"marc-a2","v":1,"k":"req","id":"k3x9qa-1"} x').ok).toBe(false);
  });
  it('WearEnginePlugin.java runs a liveness ticker while connected, by uptime and by real time', () => {
    const java = read(PLUGIN_JAVA);
    const num = (name: string) => Number(java.match(new RegExp(`\\b${name} = (\\d+);`))?.[1]);
    expect(num('TICK_MS')).toBe(1000);
    expect(num('GAP_MS')).toBe(2000);
    expect(java).toContain('SystemClock.uptimeMillis()');
    expect(java).toContain('SystemClock.elapsedRealtime()');
    expect(java).toContain('"! native gap up "');
    // started on connect, stopped on stop and when the app goes away
    expect(java.match(/startTicker\(g\);/g)?.length).toBe(1);
    expect(java.match(/stopTicker\(\);/g)?.length).toBeGreaterThanOrEqual(3);
  });
});

describe('A2-2 watch identity', () => {
  it('WATCH_BUNDLE equals the watch config.json app.bundleName', () => {
    const config = JSON.parse(read('native/wear/hello/entry/src/main/config.json')) as { app: { bundleName: string } };
    expect(WATCH_BUNDLE).toBe(config.app.bundleName);
  });
  it('WATCH_FP is the bundle, "_" and Base64 of a 65-byte uncompressed EC point, at most 127 characters', () => {
    expect(WATCH_FP.startsWith(`${WATCH_BUNDLE}_`)).toBe(true);
    expect(WATCH_FP.length).toBeLessThanOrEqual(127);
    const b64 = WATCH_FP.slice(WATCH_BUNDLE.length + 1);
    const point = Buffer.from(b64, 'base64');
    expect(point.toString('base64')).toBe(b64); // canonical Base64, nothing dropped by the decoder
    expect(point.length).toBe(65);
    expect(point[0]).toBe(0x04);
  });
  it('WATCH_FP is the value computed from the last certificate of the watch debug chain (2026-10-15)', () => {
    expect(WATCH_FP).toBe('com.mrcdrnzz.dailytracker.watch_BKQglurr52VpkbjRx9a27HY84jUkzAHk1RWkopsvMvChQdBIyWaCKSyuSaA3Xg+OiuTEsoDejkZ73XttwZoFLAw=');
    expect(WATCH_FP).toHaveLength(120);
  });
});

/** A stand-in for the native WearEngine plugin that records calls in order. */
function fakePlugin(over: Partial<WearEnginePlugin> = {}) {
  const calls: string[] = [];
  const sent: string[] = [];
  const listeners = new Map<string, Array<(data: unknown) => void>>();
  const plugin: WearEnginePlugin = {
    connect: vi.fn(async (o: { peerPkg: string; peerFp: string }) => { calls.push(`connect ${o.peerPkg} ${o.peerFp}`); return { started: true }; }),
    ping: vi.fn(async () => { calls.push('ping'); return { code: 202 }; }),
    send: vi.fn(async (o: { text: string }) => { calls.push('send'); sent.push(o.text); return { code: 207 }; }),
    stop: vi.fn(async () => { calls.push('stop'); return { ok: true }; }),
    setNativeAck: vi.fn(async (o: { on: boolean }) => { calls.push(`native ${o.on}`); return { on: o.on }; }),
    addListener: vi.fn(async (event: 'message' | 'log', cb: (data: unknown) => void) => {
      calls.push(`listen ${event}`);
      listeners.set(event, [...(listeners.get(event) ?? []), cb]);
      return { remove: async () => undefined };
    }),
    ...over,
  };
  const emit = (event: string, data: unknown) => { for (const cb of listeners.get(event) ?? []) cb(data); };
  return { plugin, calls, sent, listeners, emit };
}
const msg = (data: string, desc = '', type = 1) => ({ type, data, desc, dataLen: utf8(data), descLen: utf8(desc) });
const ackOf = (id: string, n: number, dup = false) => `{"t":"marc-a2","v":1,"k":"ack","id":"${id}","dup":${dup},"n":${n},"by":"js"}`;

describe('A2-2 the acknowledgement path', () => {
  it('Connect attaches both listeners first, then connects to the watch bundle and fingerprint, once', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin);
    await lab.connect();
    await lab.connect();
    expect(f.calls).toEqual(['listen message', 'listen log', `connect ${WATCH_BUNDLE} ${WATCH_FP}`, `connect ${WATCH_BUNDLE} ${WATCH_FP}`]);
  });
  it('a request in data is parsed, then acknowledged with the same id, and both rows are logged newest first', async () => {
    let t = 1000;
    const f = fakePlugin({ send: vi.fn(async () => { t += 35; return { code: 207 }; }) });
    const lab = createLab(f.plugin, () => t);
    await lab.connect();
    const text = req('k3x9qa-1');
    f.emit('message', msg(text));
    await vi.waitFor(() => expect(lab.rows.value).toHaveLength(2));
    expect(f.plugin.send).toHaveBeenCalledWith({ text: ackOf('k3x9qa-1', utf8(text)) });
    expect(lab.rows.value).toEqual(['ack k3x9qa-1 207 35ms', `rx k3x9qa-1 type 1 data ${utf8(text)} desc 0`]);
    expect(lab.counts.value).toEqual({ rx: 1, hr: 0, ack: 1, dup: 0, bad: 0 });
  });
  it('uses the description when data is empty', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    await lab.receive(msg('', req('k3x9qa-2')));
    expect(f.sent).toEqual([ackOf('k3x9qa-2', utf8(req('k3x9qa-2')))]);
    expect(lab.rows.value[1]).toBe(`rx k3x9qa-2 type 1 data 0 desc ${utf8(req('k3x9qa-2'))}`);
  });
  it('a bad message is counted and never acknowledged', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    const ack = JSON.stringify({ t: 'marc-a2', v: 1, k: 'ack', id: 'k3x9qa-1', dup: false });
    await lab.receive(msg('{x'));
    await lab.receive(msg(ack));
    await lab.receive(null);
    expect(f.plugin.send).not.toHaveBeenCalled();
    expect(lab.rows.value).toEqual(['bad type type ? data 0 desc 0', `bad shape type 1 data ${utf8(ack)} desc 0`, 'bad json type 1 data 2 desc 0']);
    expect(lab.counts.value).toEqual({ rx: 0, hr: 0, ack: 0, dup: 0, bad: 3 });
  });
  it('a repeated id is acknowledged again with dup:true and counted as dup', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    await lab.receive(msg(req('k3x9qa-1')));
    await lab.receive(msg(req('k3x9qa-1')));
    expect(f.sent.map(s => (JSON.parse(s) as { dup: boolean }).dup)).toEqual([false, true]);
    expect(lab.counts.value).toEqual({ rx: 2, hr: 0, ack: 2, dup: 1, bad: 0 });
  });
  it('an ack send that fails shows its code or error and is not counted as ack', async () => {
    const results = [{ code: 206 }, { code: -1, timeout: true }, { code: -1, error: 9 }];
    const f = fakePlugin({ send: vi.fn(async () => results.shift() ?? Promise.reject(new Error('Connect first'))) });
    const lab = createLab(f.plugin, () => 0);
    for (const id of ['id-1', 'id-2', 'id-3', 'id-4']) await lab.receive(msg(req(id)));
    expect(lab.rows.value.filter(r => r.startsWith('ack '))).toEqual(['ack id-4 Connect first 0ms', 'ack id-3 -1 e9 0ms', 'ack id-2 -1 timeout 0ms', 'ack id-1 206 0ms']);
    expect(lab.counts.value).toEqual({ rx: 4, hr: 0, ack: 0, dup: 0, bad: 0 });
    expect(SEND_OK).toBe(207);
  });
  it('the rx and bad rows show how long after the native receipt (rxAt) the JS handled the message', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 5000);
    await lab.receive({ ...msg(req('k3x9qa-1')), rxAt: 4880 });
    expect(lab.rows.value[1]).toBe(`rx k3x9qa-1 type 1 data ${utf8(req('k3x9qa-1'))} desc 0 js +120ms`);
    await lab.receive({ ...msg('{x'), rxAt: 5000 });
    expect(lab.rows.value[0]).toBe('bad json type 1 data 2 desc 0 js +0ms');
    for (const rxAt of ['4880', null, Number.NaN, Number.POSITIVE_INFINITY]) {
      await lab.receive({ ...msg(req('k3x9qa-2')), rxAt });
      expect(lab.rows.value[1], String(rxAt)).toBe(`rx k3x9qa-2 type 1 data ${utf8(req('k3x9qa-2'))} desc 0`);
    }
  });
  it('the JS ack carries n, the UTF-8 bytes of the text received, and by "js"', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    const base = utf8(req('k3x9qa-3', { p: '' }));
    const text = req('k3x9qa-3', { p: 'x'.repeat(1000 - base) });
    await lab.receive(msg(text));
    await lab.receive(msg('', req('k3x9qa-4', { p: 'é' })));
    expect(f.sent).toEqual([ackOf('k3x9qa-3', 1000), ackOf('k3x9qa-4', utf8(req('k3x9qa-4', { p: 'é' })))]);
    expect(utf8(req('k3x9qa-4', { p: 'é' }))).toBe(req('k3x9qa-4', { p: 'é' }).length + 1);
  });
  it('a heart-rate report is logged with its bpm, counted as rx and hr, and acknowledged', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    await lab.receive({ ...msg(hr('k3x9qa-5', 72)), rxAt: 0 });
    await lab.receive(msg(hr('k3x9qa-6', 19)));
    expect(f.sent).toEqual([ackOf('k3x9qa-5', utf8(hr('k3x9qa-5', 72)))]);
    expect(lab.rows.value).toEqual([
      `bad bpm type 1 data ${utf8(hr('k3x9qa-6', 19))} desc 0`,
      'ack k3x9qa-5 207 0ms',
      `rx k3x9qa-5 bpm 72 type 1 data ${utf8(hr('k3x9qa-5', 72))} desc 0 js +0ms`,
    ]);
    expect(lab.counts.value).toEqual({ rx: 1, hr: 1, ack: 1, dup: 0, bad: 1 });
  });
  it('a message the plugin already answered (by "native") is logged and counted, and the lab sends nothing', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 1000);
    await lab.receive({ ...msg(req('k3x9qa-1')), rxAt: 990, by: 'native', dup: false });
    await lab.receive({ ...msg(req('k3x9qa-1')), rxAt: 995, by: 'native', dup: true });
    await lab.receive({ ...msg(hr('k3x9qa-2', 80)), by: 'native', dup: false });
    expect(f.plugin.send).not.toHaveBeenCalled();
    expect(lab.rows.value).toEqual([
      `rx k3x9qa-2 bpm 80 type 1 data ${utf8(hr('k3x9qa-2', 80))} desc 0`,
      `rx k3x9qa-1 type 1 data ${utf8(req('k3x9qa-1'))} desc 0 js +5ms`,
      `rx k3x9qa-1 type 1 data ${utf8(req('k3x9qa-1'))} desc 0 js +10ms`,
    ]);
    expect(lab.counts.value).toEqual({ rx: 3, hr: 1, ack: 0, dup: 1, bad: 0 });
    // any other by value leaves the answer to the lab
    await lab.receive({ ...msg(req('k3x9qa-3')), by: 'js' });
    expect(f.sent).toEqual([ackOf('k3x9qa-3', utf8(req('k3x9qa-3')))]);
  });
  it("the plugin's native ack result arrives as an 'ack' log row, and only an ok one counts as ack", async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin);
    await lab.connect();
    f.emit('log', { step: 'ack', ok: true, text: 'ack k3x9qa-1 207 native 12ms' });
    f.emit('log', { step: 'ack', ok: false, text: 'ack k3x9qa-2 206 native 9ms' });
    f.emit('log', { step: 'send', ok: true, text: 'send x' });
    f.emit('log', { step: 'ack', ok: 'true', text: 'ack k3x9qa-3 207 native 1ms' });
    expect(lab.rows.value).toEqual(['ack k3x9qa-3 207 native 1ms', 'send x', 'ack k3x9qa-2 206 native 9ms', 'ack k3x9qa-1 207 native 12ms']);
    expect(lab.counts.value).toEqual({ rx: 0, hr: 0, ack: 1, dup: 0, bad: 0 });
  });
  it('Native ack is off at start; the toggle sets it in the plugin and the plugin logs the change', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin);
    expect(lab.nativeAck.value).toBe(false);
    await lab.setNativeAck(true);
    expect(lab.nativeAck.value).toBe(true);
    await lab.setNativeAck(false);
    expect(lab.nativeAck.value).toBe(false);
    expect(f.calls).toEqual(['native true', 'native false']);
    expect(lab.rows.value).toEqual([]);
  });
  it('a toggle call that fails keeps the last state and logs why', async () => {
    const f = fakePlugin({ setNativeAck: vi.fn(async () => Promise.reject(new Error('not implemented'))) });
    const lab = createLab(f.plugin);
    await lab.setNativeAck(true);
    expect(lab.nativeAck.value).toBe(false);
    expect(lab.rows.value).toEqual(['native not implemented']);
    const off = createLab(null);
    await off.setNativeAck(true);
    expect(off.nativeAck.value).toBe(false);
    expect(off.rows.value).toEqual(['native unavailable']);
    // the state shown is the one the plugin reports back
    const odd = createLab(fakePlugin({ setNativeAck: vi.fn(async () => ({ on: false })) }).plugin);
    await odd.setNativeAck(true);
    expect(odd.nativeAck.value).toBe(false);
  });
  it('log events become rows, newest first, at most 200', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin);
    await lab.connect();
    f.emit('log', { step: 'auth', ok: true, text: 'auth ok' });
    f.emit('log', { step: 'ping', ok: true, text: 'ping 202' });
    expect(lab.rows.value).toEqual(['ping 202', 'auth ok']);
    for (let i = 0; i < 250; i++) f.emit('log', { step: 'x', ok: true, text: `row ${i}` });
    expect(LOG_ROWS).toBe(200);
    expect(lab.rows.value).toHaveLength(200);
    expect(lab.rows.value[0]).toBe('row 249');
  });
  it('Ping and Stop call the plugin and log only what the plugin does not log itself', async () => {
    const f = fakePlugin({ stop: vi.fn(async () => Promise.reject(new Error('boom'))) });
    const lab = createLab(f.plugin);
    await lab.ping();
    await lab.stop();
    expect(f.plugin.ping).toHaveBeenCalledTimes(1);
    expect(lab.rows.value).toEqual(['stop boom']);
  });
  it('without the plugin every action resolves, logs unavailable and calls nothing', async () => {
    const lab = createLab(null);
    await expect(lab.connect()).resolves.toBeUndefined();
    await expect(lab.ping()).resolves.toBeUndefined();
    await expect(lab.stop()).resolves.toBeUndefined();
    expect(lab.rows.value).toEqual(['stop unavailable', 'ping unavailable', 'connect unavailable']);
  });
  it('a plugin call that never settles resolves after BRIDGE_TIMEOUT_MS', async () => {
    vi.useFakeTimers();
    const f = fakePlugin({ ping: vi.fn(() => new Promise<{ code: number }>(() => undefined)) });
    const lab = createLab(f.plugin);
    let done = false;
    void lab.ping().then(() => { done = true; });
    await vi.advanceTimersByTimeAsync(BRIDGE_TIMEOUT_MS - 1);
    expect(done).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    expect(done).toBe(true);
    expect(lab.rows.value).toEqual(['ping timeout']);
  });
  it("BRIDGE_TIMEOUT_MS is longer than the plugin's own timeout, so the plugin's result is the one shown", () => {
    const native = Number(read(PLUGIN_JAVA).match(/\bTIMEOUT_MS = (\d+);/)?.[1]);
    expect(native).toBeGreaterThan(0);
    expect(BRIDGE_TIMEOUT_MS).toBeGreaterThan(native);
  });
  it('the plugin, method, argument and event names match WearEnginePlugin.java', () => {
    const java = read(PLUGIN_JAVA);
    for (const s of [
      '@CapacitorPlugin(name = "WearEngine")', 'public void connect(PluginCall call)', 'public void ping(PluginCall call)',
      'public void send(PluginCall call)', 'public void stop(PluginCall call)', 'call.getString("peerPkg"', 'call.getString("peerFp"',
      'call.getString("text"', 'notifyListeners("message"', 'notifyListeners("log"', '.put("type"', '.put("data"', '.put("desc"',
      '.put("dataLen"', '.put("descLen"', '.put("text", text)', '.put("code", code)',
      'public void setNativeAck(PluginCall call)', 'call.getBoolean("on")', '.put("on", on)', '.put("rxAt", rxAt)',
      '.put("by", "native")', '.put("dup", dup)', 'log("ack", ', '" native "',
    ]) expect(java, s).toContain(s);
  });
});

describe('A2-6 nothing changes for users without the plugin', () => {
  it('on the web the plugin is absent, so WatchLabEntry renders nothing and attaches no handler', () => {
    expect(wearAvailable()).toBe(false);
    expect(WatchLabEntry()).toBeNull();
  });
  it('with the WearEngine plugin present, WatchLabEntry renders the tap listener', () => {
    const spy = vi.spyOn(Capacitor, 'isPluginAvailable').mockImplementation(name => name === 'WearEngine');
    expect(wearAvailable()).toBe(true);
    expect(WatchLabEntry()).not.toBeNull();
    expect(spy).toHaveBeenCalledWith('WearEngine');
  });
  it('the Settings Version span stays as it was, with WatchLabEntry after it in the footer', () => {
    const src = read('src/slices/settings/Settings.tsx');
    expect(src).toContain('data-palace="settings.rights">{RIGHTS_LINE}</p><span class="hint" data-palace="settings.version">Version {APP_VERSION}</span><WatchLabEntry /></div>');
    expect(src.match(/WatchLabEntry/g)).toHaveLength(2);
    expect(src).toContain("import { WatchLabEntry } from './WatchLab';\n");
  });
  it("the lab's labels are 'Watch lab', the button names, 'Native ack' and the counter names", () => {
    const src = read('src/slices/settings/WatchLab.tsx');
    expect([...src.matchAll(/<Sheet\b[^>]*\btitle="([^"]*)"/g)].map(m => m[1])).toEqual(['Watch lab']);
    expect([...src.matchAll(/>([^<>]*)<\/Button>/g)].map(m => m[1])).toEqual(['Connect', 'Ping', 'Stop']);
    expect(src.match(/<Button\b/g)).toHaveLength(3);
    expect([...src.matchAll(/<Toggle\b.*?\blabel="([^"]*)"/g)].map(m => m[1])).toEqual(['Native ack']);
    expect(src.match(/<Toggle\b/g)).toHaveLength(1);
    expect(src).toContain('<Toggle checked={lab.nativeAck.value} onChange={on => void lab.setNativeAck(on)}');
    const words = [...src.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)].map(m => m[1]!.trim());
    expect(words.filter(w => !['Connect', 'Ping', 'Stop', 'Native ack', 'rx', 'hr', 'ack', 'dup', 'bad'].includes(w))).toEqual([]);
    expect(src).toContain('rx {c.rx} hr {c.hr} ack {c.ack} dup {c.dup} bad {c.bad}');
  });
  it('the lab keeps its log and the Native ack state in memory only, and the plugin stores and fetches nothing', () => {
    for (const p of ['src/native/wearEngine.ts', 'src/slices/settings/WatchLab.tsx']) {
      const src = read(p);
      for (const s of ['localStorage', 'sessionStorage', 'indexedDB', '@/core/store', 'Filesystem', 'fetch(']) expect(src, `${p}: ${s}`).not.toContain(s);
    }
    const java = read(PLUGIN_JAVA);
    for (const s of ['SharedPreferences', 'getPreferences', 'openFileOutput', 'java.io.File', 'java.net.', 'okhttp', 'SQLite']) expect(java, s).not.toContain(s);
    expect(java).toContain('private boolean nativeAck;');
  });
});
