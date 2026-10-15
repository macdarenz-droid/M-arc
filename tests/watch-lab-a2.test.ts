// Gate A question 2 (watch lane), acceptance A2-2 and A2-6: the phone side of the request and
// acknowledgement test in src/native/wearEngine.ts, and the hidden Watch lab in
// src/slices/settings/WatchLab.tsx. The watch side is native/wear/test/a2.test.mjs (A2-1).
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Capacitor } from '@capacitor/core';
import {
  ACK_MEMORY, BRIDGE_TIMEOUT_MS, LOG_ROWS, MAX_BYTES, SEND_OK, WATCH_BUNDLE, WATCH_FP,
  buildAck, createLab, parseRequest, wearAvailable, type WearEnginePlugin,
} from '@/native/wearEngine';
import { WatchLabEntry } from '@/slices/settings/WatchLab';

const file = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const read = (p: string) => readFileSync(file(p), 'utf8');
const utf8 = (s: string) => new TextEncoder().encode(s).length;
const req = (id: unknown, extra: Record<string, unknown> = {}) => JSON.stringify({ t: 'marc-a2', v: 1, k: 'req', id, p: 'n1', ...extra });
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
    for (const over of [{ t: 'marc-a1' }, { t: undefined }, { v: 2 }, { v: '1' }, { k: 'ack' }, { k: 'REQ' }]) {
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

describe('A2-2 buildAck', () => {
  it('returns the same id in the agreed message, at most 120 bytes', () => {
    const seen: string[] = [];
    expect(buildAck({ id: 'k3x9qa-1' }, seen)).toEqual({ text: '{"t":"marc-a2","v":1,"k":"ack","id":"k3x9qa-1","dup":false}', dup: false });
    const long = 'Z'.repeat(32);
    expect(utf8(buildAck({ id: long }, seen).text)).toBeLessThanOrEqual(120);
    expect(utf8(buildAck({ id: long }, seen).text)).toBeLessThanOrEqual(120); // the dup:true form
  });
  it('sets dup:true on a second request with the same id', () => {
    const seen: string[] = [];
    expect(buildAck({ id: 'k3x9qa-1' }, seen).dup).toBe(false);
    expect(buildAck({ id: 'k3x9qa-2' }, seen).dup).toBe(false);
    const again = buildAck({ id: 'k3x9qa-1' }, seen);
    expect(again.dup).toBe(true);
    expect(JSON.parse(again.text)).toEqual({ t: 'marc-a2', v: 1, k: 'ack', id: 'k3x9qa-1', dup: true });
  });
  it('remembers only the last 32 ids', () => {
    expect(ACK_MEMORY).toBe(32);
    const seen: string[] = [];
    for (let i = 1; i <= 33; i++) buildAck({ id: `id-${i}` }, seen);
    expect(seen).toHaveLength(32);
    expect(buildAck({ id: 'id-33' }, seen).dup).toBe(true);
    expect(buildAck({ id: 'id-2' }, seen).dup).toBe(true);
    expect(buildAck({ id: 'id-1' }, seen).dup).toBe(false); // the 33rd id back pushed it out
    expect(seen).toHaveLength(32);
  });
  it("is read as an acknowledgement by the watch's own a2.js", async () => {
    const watch = await import(/* @vite-ignore */ pathToFileURL(file(WATCH_A2)).href) as {
      readAck: (text: unknown, pending: Record<string, number>, now: number) => { kind: string; id?: string; ms?: number; dup?: boolean };
    };
    const pending: Record<string, number> = { 'k3x9qa-1': 1000 };
    expect(watch.readAck(buildAck({ id: 'k3x9qa-1' }, []).text, pending, 1250)).toEqual({ kind: 'ack', id: 'k3x9qa-1', ms: 250, dup: false });
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
    expect(f.plugin.send).toHaveBeenCalledWith({ text: '{"t":"marc-a2","v":1,"k":"ack","id":"k3x9qa-1","dup":false}' });
    expect(lab.rows.value).toEqual(['ack k3x9qa-1 207 35ms', `rx k3x9qa-1 type 1 data ${utf8(text)} desc 0`]);
    expect(lab.counts.value).toEqual({ rx: 1, ack: 1, dup: 0, bad: 0 });
  });
  it('uses the description when data is empty', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    await lab.receive(msg('', req('k3x9qa-2')));
    expect(f.sent.map(s => JSON.parse(s) as { id: string })).toEqual([expect.objectContaining({ id: 'k3x9qa-2', k: 'ack' })]);
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
    expect(lab.counts.value).toEqual({ rx: 0, ack: 0, dup: 0, bad: 3 });
  });
  it('a repeated id is acknowledged again with dup:true and counted as dup', async () => {
    const f = fakePlugin();
    const lab = createLab(f.plugin, () => 0);
    await lab.receive(msg(req('k3x9qa-1')));
    await lab.receive(msg(req('k3x9qa-1')));
    expect(f.sent.map(s => (JSON.parse(s) as { dup: boolean }).dup)).toEqual([false, true]);
    expect(lab.counts.value).toEqual({ rx: 2, ack: 2, dup: 1, bad: 0 });
  });
  it('an ack send that fails shows its code or error and is not counted as ack', async () => {
    const results = [{ code: 206 }, { code: -1, timeout: true }, { code: -1, error: 9 }];
    const f = fakePlugin({ send: vi.fn(async () => results.shift() ?? Promise.reject(new Error('Connect first'))) });
    const lab = createLab(f.plugin, () => 0);
    for (const id of ['id-1', 'id-2', 'id-3', 'id-4']) await lab.receive(msg(req(id)));
    expect(lab.rows.value.filter(r => r.startsWith('ack '))).toEqual(['ack id-4 Connect first 0ms', 'ack id-3 -1 e9 0ms', 'ack id-2 -1 timeout 0ms', 'ack id-1 206 0ms']);
    expect(lab.counts.value).toEqual({ rx: 4, ack: 0, dup: 0, bad: 0 });
    expect(SEND_OK).toBe(207);
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
  it("the lab's labels are 'Watch lab', the button names and the counter names", () => {
    const src = read('src/slices/settings/WatchLab.tsx');
    expect([...src.matchAll(/<Sheet\b[^>]*\btitle="([^"]*)"/g)].map(m => m[1])).toEqual(['Watch lab']);
    expect([...src.matchAll(/>([^<>]*)<\/Button>/g)].map(m => m[1])).toEqual(['Connect', 'Ping', 'Stop']);
    expect(src.match(/<Button\b/g)).toHaveLength(3);
    const words = [...src.matchAll(/>([^<>{}]*[A-Za-z][^<>{}]*)</g)].map(m => m[1]!.trim());
    expect(words.filter(w => !['Connect', 'Ping', 'Stop', 'rx', 'ack', 'dup', 'bad'].includes(w))).toEqual([]);
  });
  it('the lab keeps its log in memory only', () => {
    for (const p of ['src/native/wearEngine.ts', 'src/slices/settings/WatchLab.tsx']) {
      const src = read(p);
      for (const s of ['localStorage', 'sessionStorage', 'indexedDB', '@/core/store', 'Filesystem', 'fetch(']) expect(src, `${p}: ${s}`).not.toContain(s);
    }
  });
});
