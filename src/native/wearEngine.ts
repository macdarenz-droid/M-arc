/**
 * Gate A question 2 (watch lane): the bridge to the WearEngine plugin
 * (native/wear/android/WearEnginePlugin.java, debug APK only) and the phone side of the request and
 * acknowledgement test. The watch sends {"t":"marc-a2","v":1,"k":"req","id":"<boot>-<seq>","p":"n<seq>"};
 * this code answers {"t":"marc-a2","v":1,"k":"ack","id":"<same id>","dup":<bool>} only after it has
 * parsed and checked the request, so an ACK on the watch proves the phone app read it (a send
 * result of 207 alone proves only transport). The log lives in memory only. Tests:
 * tests/watch-lab-a2.test.ts.
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
/**
 * The bridge gives up on a plugin call after this long. WearEnginePlugin.java resolves ping, send
 * and stop itself after 15 s, so this is longer: the plugin's own result is the one shown, and this
 * only covers a call that never settles.
 */
export const BRIDGE_TIMEOUT_MS = 20_000;
const ID = /^[A-Za-z0-9-]{3,32}$/;

export interface A2Request { t: typeof TAG; v: typeof VERSION; k: 'req'; id: string; p?: string }
export type RejectReason = 'type' | 'size' | 'json' | 'shape' | 'id';
export type ParseResult = { ok: true; req: A2Request } | { ok: false; reason: RejectReason };

/** Reads one message from the watch. Never throws. */
export function parseRequest(text: unknown): ParseResult {
  if (typeof text !== 'string') return { ok: false, reason: 'type' };
  if (new TextEncoder().encode(text).length > MAX_BYTES) return { ok: false, reason: 'size' };
  let m: unknown;
  try { m = JSON.parse(text); } catch { return { ok: false, reason: 'json' }; }
  if (m === null || typeof m !== 'object' || Array.isArray(m)) return { ok: false, reason: 'json' };
  const o = m as Record<string, unknown>;
  if (o.t !== TAG || o.v !== VERSION || o.k !== 'req') return { ok: false, reason: 'shape' };
  if (typeof o.id !== 'string' || !ID.test(o.id)) return { ok: false, reason: 'id' };
  return { ok: true, req: { t: TAG, v: VERSION, k: 'req', id: o.id, ...(typeof o.p === 'string' ? { p: o.p } : {}) } };
}

/**
 * The acknowledgement for req. dup is true when the same id came in among the last ACK_MEMORY ids.
 * seen is updated in place, oldest first.
 */
export function buildAck(req: { id: string }, seen: string[]): { text: string; dup: boolean } {
  const at = seen.indexOf(req.id);
  const dup = at >= 0;
  if (dup) seen.splice(at, 1);
  seen.push(req.id);
  if (seen.length > ACK_MEMORY) seen.splice(0, seen.length - ACK_MEMORY);
  return { text: JSON.stringify({ t: TAG, v: VERSION, k: 'ack', id: req.id, dup }), dup };
}

export interface SendResult { code: number; timeout?: boolean; error?: number }
/** WearEnginePlugin.java's bridge methods and events. */
export interface WearEnginePlugin {
  connect(options: { peerPkg: string; peerFp: string }): Promise<{ started: boolean }>;
  ping(): Promise<SendResult>;
  send(options: { text: string }): Promise<SendResult>;
  stop(): Promise<{ ok: boolean; error?: number; timeout?: boolean }>;
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

export interface LabCounts { rx: number; ack: number; dup: number; bad: number }
export interface Lab {
  rows: Signal<string[]>;
  counts: Signal<LabCounts>;
  connect(): Promise<void>;
  ping(): Promise<void>;
  stop(): Promise<void>;
  /** Handles one 'message' event from the plugin. */
  receive(event: unknown): Promise<void>;
}

/** The lab session over plugin (null off-device). Every action resolves; results land in rows. */
export function createLab(plugin: WearEnginePlugin | null, now: () => number = Date.now, timeoutMs = BRIDGE_TIMEOUT_MS): Lab {
  const rows = signal<string[]>([]);
  const counts = signal<LabCounts>({ rx: 0, ack: 0, dup: 0, bad: 0 });
  const seen: string[] = [];
  const listening = { message: false, log: false };
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
    const where = `type ${typeof e.type === 'number' ? e.type : '?'} data ${Number(e.dataLen) || 0} desc ${Number(e.descLen) || 0}`;
    // Which field carries the lite watch's setDescription text is what the device run settles.
    const parsed = parseRequest(isEvent ? data || desc : undefined);
    if (!parsed.ok) { bump('bad'); row(`bad ${parsed.reason} ${where}`); return; }
    const id = parsed.req.id;
    bump('rx');
    row(`rx ${id} ${where}`);
    const ack = buildAck(parsed.req, seen);
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
        : (d: unknown) => { const t = (d as { text?: unknown } | null)?.text; row(typeof t === 'string' ? t : 'log ?'); };
      const r = await call(p => p.addListener(name, cb));
      if (!r.ok) { row(`listen ${r.error}`); return false; }
      listening[name] = true;
    }
    return true;
  }

  return {
    rows,
    counts,
    receive,
    async connect() {
      // Listen first: the plugin drops events nobody listens to, and its first steps log at once.
      if (plugin && !(await listen())) return;
      await act('connect', p => p.connect({ peerPkg: WATCH_BUNDLE, peerFp: WATCH_FP }));
    },
    ping: () => act('ping', p => p.ping()),
    stop: () => act('stop', p => p.stop()),
  };
}

let lab: Lab | null = null;
/** The app's one lab session, kept while the app runs so closing the sheet keeps the log. */
export function watchLab(): Lab {
  lab ??= createLab(wearAvailable() ? registerPlugin<WearEnginePlugin>('WearEngine') : null);
  return lab;
}
