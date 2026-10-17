/**
 * Gate A question 2 (watch lane): the bridge to the WearEngine plugin
 * (native/wear/android/WearEnginePlugin.java, debug APK only) and the phone side of the request and
 * acknowledgement test. The watch sends {"t":"marc-a2","v":1,"k":"req","id":"<boot>-<seq>"} with an
 * optional ASCII padding "p", or the heart-rate report {"t":"marc-a2","v":1,"k":"hr","id":...,"bpm":<int>};
 * this code answers {"t":"marc-a2","v":1,"k":"ack","id":"<same id>","dup":<bool>,"n":<bytes received>,"by":"js"}
 * only after it has parsed and checked the message, so an ACK on the watch proves the phone app read
 * it (a send result of 207 alone proves only transport).
 *
 * GATE-A-PROBE-2 (Gate A question 4): the plugin stamps each native receipt (rxAt), and the rx row
 * shows "js +<ms>ms", the time from that receipt to this code handling it. With Native ack on, the
 * plugin answers by itself ("by":"native") before JS runs; the event then carries by and dup, this
 * code sends nothing, and the plugin's result arrives as an "ack" log row. A background phone app
 * that still acks natively but shows a large js + time means the WebView paused, not Huawei.
 * Both the log and the Native ack state live in memory only. Tests: tests/watch-lab-a2.test.ts.
 *
 * WATCH-C (Gate C): a workout message ("t":"mw") goes to the route src/native/watchLink.ts sets, never
 * to the lab's own parse and acknowledgement; post and note let that link send and log through here.
 */
import { signal, type Signal } from '@preact/signals';
import { Capacitor, registerPlugin, type PluginListenerHandle } from '@capacitor/core';

/** The watch app's bundle name: native/wear/hello/entry/src/main/config.json app.bundleName. */
export const WATCH_BUNDLE = 'com.mrcdrnzz.dailytracker.watch';
/**
 * The watch app's fingerprint as the phone's setPeerFingerPrint takes it: bundle, '_', Base64 of
 * the 65-byte uncompressed EC public key of the last certificate in the watch debug chain
 * (marc_watch_debug.cer, kept out of the repo). Recomputed on 2026-10-15.
 */
export const WATCH_FP = `${WATCH_BUNDLE}_BKQglurr52VpkbjRx9a27HY84jUkzAHk1RWkopsvMvChQdBIyWaCKSyuSaA3Xg+OiuTEsoDejkZ73XttwZoFLAw=`;
const TAG = 'marc-a2';
const VERSION = 1;
/** Huawei's message limit, both directions. */
export const MAX_BYTES = 1024;
/** How many request ids the dup flag looks back over. */
export const ACK_MEMORY = 32;
/** Log rows kept, newest first. */
export const LOG_ROWS = 200;
/** Huawei's send result for a message handed to the watch. */
export const SEND_OK = 207;
/** The heart-rate range a report may carry, in beats per minute. */
export const BPM_MIN = 20;
export const BPM_MAX = 250;
/**
 * The bridge gives up on a plugin call after this long. WearEnginePlugin.java resolves ping, send
 * and stop itself after 15 s, so this is longer: the plugin's own result is the one shown, and this
 * only covers a call that never settles.
 */
export const BRIDGE_TIMEOUT_MS = 20_000;
const ID = /^[A-Za-z0-9-]{3,32}$/;
const utf8Bytes = (s: string) => new TextEncoder().encode(s).length;

export interface A2Ask { t: typeof TAG; v: typeof VERSION; k: 'req'; id: string; p?: string }
export interface A2Heart { t: typeof TAG; v: typeof VERSION; k: 'hr'; id: string; bpm: number }
/** A request or a heart-rate report: the two messages the phone acknowledges. */
export type A2Request = A2Ask | A2Heart;
export type RejectReason = 'type' | 'size' | 'json' | 'shape' | 'id' | 'bpm';
export type ParseResult = { ok: true; req: A2Request } | { ok: false; reason: RejectReason };
/** Who built the acknowledgement: this code, or WearEnginePlugin.java with Native ack on. */
export type AckBy = 'js' | 'native';

/** WATCH-C: a workout-link message ("t":"mw"), which the lab hands to its route. */
export function isWorkout(text: string): boolean {
  try {
    const m: unknown = JSON.parse(text);
    return !!m && typeof m === 'object' && (m as { t?: unknown }).t === 'mw';
  } catch {
    return false;
  }
}

/** Reads one message from the watch. Never throws. WearEnginePlugin.java's Wire.requestId follows the same rules. */
export function parseRequest(text: unknown): ParseResult {
  if (typeof text !== 'string') return { ok: false, reason: 'type' };
  if (utf8Bytes(text) > MAX_BYTES) return { ok: false, reason: 'size' };
  let m: unknown;
  try { m = JSON.parse(text); } catch { return { ok: false, reason: 'json' }; }
  if (m === null || typeof m !== 'object' || Array.isArray(m)) return { ok: false, reason: 'json' };
  const o = m as Record<string, unknown>;
  if (o.t !== TAG || o.v !== VERSION || (o.k !== 'req' && o.k !== 'hr')) return { ok: false, reason: 'shape' };
  if (typeof o.id !== 'string' || !ID.test(o.id)) return { ok: false, reason: 'id' };
  if (o.k === 'hr') {
    const bpm = o.bpm;
    if (typeof bpm !== 'number' || !Number.isInteger(bpm) || bpm < BPM_MIN || bpm > BPM_MAX) return { ok: false, reason: 'bpm' };
    return { ok: true, req: { t: TAG, v: VERSION, k: 'hr', id: o.id, bpm } };
  }
  return { ok: true, req: { t: TAG, v: VERSION, k: 'req', id: o.id, ...(typeof o.p === 'string' ? { p: o.p } : {}) } };
}

/**
 * The acknowledgement for req. dup is true when the same id came in among the last ACK_MEMORY ids;
 * n is the UTF-8 byte count of the text received; by says who built it. seen is updated in place,
 * oldest first. WearEnginePlugin.java's Wire.ack builds the same text.
 */
export function buildAck(req: { id: string }, seen: string[], n: number, by: AckBy): { text: string; dup: boolean } {
  const at = seen.indexOf(req.id);
  const dup = at >= 0;
  if (dup) seen.splice(at, 1);
  seen.push(req.id);
  if (seen.length > ACK_MEMORY) seen.splice(0, seen.length - ACK_MEMORY);
  return { text: JSON.stringify({ t: TAG, v: VERSION, k: 'ack', id: req.id, dup, n, by }), dup };
}

export interface SendResult { code: number; timeout?: boolean; error?: number }
/** WearEnginePlugin.java's bridge methods and events. */
export interface WearEnginePlugin {
  connect(options: { peerPkg: string; peerFp: string }): Promise<{ started: boolean }>;
  ping(): Promise<SendResult>;
  send(options: { text: string }): Promise<SendResult>;
  stop(): Promise<{ ok: boolean; error?: number; timeout?: boolean }>;
  /** Turns the plugin's own acknowledgement on or off (in memory, off at start); resolves the new state. */
  setNativeAck(options: { on: boolean }): Promise<{ on: boolean }>;
  addListener(eventName: 'message' | 'log', listenerFunc: (data: unknown) => void): Promise<PluginListenerHandle>;
}

/** Only the debug APK (MARC_WEAR_LAB=1) carries the plugin; the web and release builds do not. */
export function wearAvailable(): boolean {
  try { return Capacitor.isPluginAvailable('WearEngine'); } catch { return false; }
}

type Settled<T> = { ok: true; value: T } | { ok: false; error: string };

/** Runs one plugin call. Never rejects: an unhandled rejection shows the crash screen (RG-01). */
function settle<T>(run: (() => Promise<T>) | null, timeoutMs: number): Promise<Settled<T>> {
  if (!run) return Promise.resolve({ ok: false, error: 'unavailable' });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const failed = (e: unknown): Settled<T> => ({ ok: false, error: e instanceof Error ? e.message : String(e) });
  const call = Promise.resolve().then(run).then((value): Settled<T> => ({ ok: true, value }), failed);
  const late = new Promise<Settled<T>>(resolve => { timer = setTimeout(() => resolve({ ok: false, error: 'timeout' }), timeoutMs); });
  return Promise.race([call, late]).then(r => { clearTimeout(timer); return r; });
}

function sendText(r: Settled<SendResult>): string {
  if (!r.ok) return r.error;
  const v = r.value;
  return [String(v?.code ?? '?'), v?.timeout ? 'timeout' : '', v?.error != null ? `e${v.error}` : ''].filter(Boolean).join(' ');
}

export interface LabCounts { rx: number; hr: number; ack: number; dup: number; bad: number }
export interface Lab {
  rows: Signal<string[]>;
  counts: Signal<LabCounts>;
  /** Whether the plugin answers by itself, as the plugin last reported it. */
  nativeAck: Signal<boolean>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  stop(): Promise<void>;
  setNativeAck(on: boolean): Promise<void>;
  /** Handles one 'message' event from the plugin. */
  receive(event: unknown): Promise<void>;
  /** WATCH-C: where workout messages go, with the native receipt time (or now). */
  route(fn: ((text: string, rxAt: number) => Promise<void>) | null): void;
  /** WATCH-C: sends text to the watch; resolves the send result code, or why the call failed. */
  post(text: string): Promise<number | string>;
  /** WATCH-C: adds a log row. */
  note(text: string): void;
}

/** The lab session over plugin (null off-device). Every action resolves; results land in rows. */
export function createLab(plugin: WearEnginePlugin | null, now: () => number = Date.now, timeoutMs = BRIDGE_TIMEOUT_MS): Lab {
  const rows = signal<string[]>([]);
  const counts = signal<LabCounts>({ rx: 0, hr: 0, ack: 0, dup: 0, bad: 0 });
  const nativeAck = signal(false);
  const seen: string[] = [];
  const listening = { message: false, log: false };
  let workout: ((text: string, rxAt: number) => Promise<void>) | null = null;
  const row = (text: string) => { rows.value = [text, ...rows.value].slice(0, LOG_ROWS); };
  const bump = (key: keyof LabCounts) => { counts.value = { ...counts.value, [key]: counts.value[key] + 1 }; };
  const call = <T>(run: (p: WearEnginePlugin) => Promise<T>) => settle(plugin && (() => run(plugin)), timeoutMs);
  /** The plugin logs its own steps and results; the lab adds a row only when the bridge call itself failed. */
  const act = async (name: string, run: (p: WearEnginePlugin) => Promise<unknown>) => {
    const r = await call(run);
    if (!r.ok) row(`${name} ${r.error}`);
  };

  async function receive(event: unknown): Promise<void> {
    const at = now();
    const isEvent = !!event && typeof event === 'object';
    const e = (isEvent ? event : {}) as Record<string, unknown>;
    const data = typeof e.data === 'string' ? e.data : '';
    const desc = typeof e.desc === 'string' ? e.desc : '';
    // Time from the plugin's native receipt to this code handling the event (Gate A question 4).
    const js = typeof e.rxAt === 'number' && Number.isFinite(e.rxAt) ? ` js +${at - e.rxAt}ms` : '';
    const where = `type ${typeof e.type === 'number' ? e.type : '?'} data ${Number(e.dataLen) || 0} desc ${Number(e.descLen) || 0}${js}`;
    // The 2026-10-16 device run found the lite watch's text in data; desc stays as the fallback.
    const text = data || desc;
    // WATCH-C: a workout message goes to the link, whatever "by" says.
    if (workout && isEvent && isWorkout(text)) return workout(text, typeof e.rxAt === 'number' && Number.isFinite(e.rxAt) ? e.rxAt : at);
    const parsed = parseRequest(isEvent ? text : undefined);
    if (!parsed.ok) { bump('bad'); row(`bad ${parsed.reason} ${where}`); return; }
    const id = parsed.req.id;
    bump('rx');
    if (parsed.req.k === 'hr') bump('hr');
    row(`rx ${id}${parsed.req.k === 'hr' ? ` bpm ${parsed.req.bpm}` : ''} ${where}`);
    // The plugin already answered (Native ack on); its send result comes as an "ack" log row.
    if (e.by === 'native') { if (e.dup === true) bump('dup'); return; }
    const ack = buildAck(parsed.req, seen, utf8Bytes(text), 'js');
    if (ack.dup) bump('dup');
    const r = await call(p => p.send({ text: ack.text }));
    if (r.ok && r.value?.code === SEND_OK) bump('ack');
    row(`ack ${id} ${sendText(r)} ${now() - at}ms`);
  }

  async function listen(): Promise<boolean> {
    for (const name of ['message', 'log'] as const) {
      if (listening[name]) continue;
      const cb = name === 'message'
        ? (d: unknown) => { void receive(d); }
        : (d: unknown) => {
          const l = (d ?? {}) as { step?: unknown; ok?: unknown; text?: unknown };
          // The plugin's own acknowledgement result (Native ack on) counts like a JS one that got SEND_OK.
          if (l.step === 'ack' && l.ok === true) bump('ack');
          row(typeof l.text === 'string' ? l.text : 'log ?');
        };
      const r = await call(p => p.addListener(name, cb));
      if (!r.ok) { row(`listen ${r.error}`); return false; }
      listening[name] = true;
    }
    return true;
  }

  return {
    rows,
    counts,
    nativeAck,
    receive,
    route(fn) { workout = fn; },
    async post(text: string) {
      const r = await call(p => p.send({ text }));
      return r.ok ? r.value?.code ?? '?' : r.error;
    },
    note: row,
    async connect() {
      // Listen first: the plugin drops events nobody listens to, and its first steps log at once.
      if (plugin && !(await listen())) return;
      await act('connect', p => p.connect({ peerPkg: WATCH_BUNDLE, peerFp: WATCH_FP }));
    },
    ping: () => act('ping', p => p.ping()),
    stop: () => act('stop', p => p.stop()),
    async setNativeAck(on: boolean) {
      // The plugin logs the change itself; the state shown is the one it reports back.
      const r = await call(p => p.setNativeAck({ on }));
      if (!r.ok) { row(`native ${r.error}`); return; }
      nativeAck.value = r.value?.on === true;
    },
  };
}

let lab: Lab | null = null;
/** The app's one lab session, kept while the app runs so closing the sheet keeps the log. */
export function watchLab(): Lab {
  lab ??= createLab(wearAvailable() ? registerPlugin<WearEnginePlugin>('WearEngine') : null);
  return lab;
}
