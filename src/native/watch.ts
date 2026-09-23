/**
 * WatchBridge plugin wrapper (6.2, 6.3). Web fallback: isSupported() is
 * always false and the UI hides the connect controls, the same pattern
 * as haptics and health.
 */
import { signal } from '@preact/signals';
import { isNative } from './capacitor';

export type WatchState = 'unsupported' | 'permission' | 'idle' | 'scanning' | 'connecting' | 'connected' | 'reconnecting' | 'stopped';
export type Freshness = 'LIVE' | 'DELAYED' | 'STALE' | 'WAITING' | 'CHECK_FIT' | 'DISCONNECTED';
export interface WatchDevice { address: string; name: string; advertisesHeartRate: boolean; paired: boolean; rssi: number }
export interface WatchStatus { state: WatchState; freshness: Freshness; deviceName?: string; battery?: number; message: string }
export interface WatchMeasurement { bpm: number; contact: boolean | null; rrMs: number[]; energyKj: number | null; receivedAtEpochMs: number; receivedAtElapsedMs: number }

const UNSUPPORTED: WatchStatus = { state: 'unsupported', freshness: 'DISCONNECTED', message: 'Live heart rate needs the Android app' };

export const watchSupported = signal(false);
export const watchStatus = signal<WatchStatus>(UNSUPPORTED);
export const latestMeasurement = signal<WatchMeasurement | null>(null);
export const scannedDevices = signal<WatchDevice[]>([]);

interface ListenerHandle { remove: () => void }
interface WatchPlugin {
  isSupported(): Promise<{ supported: boolean }>;
  permissionState(): Promise<{ granted: boolean; needsLocation: boolean }>;
  requestPermissions(): Promise<{ granted: boolean }>;
  startScan(opts: { timeoutMs: number }): Promise<void>;
  stopScan(): Promise<void>;
  connect(opts: { address: string }): Promise<void>;
  disconnect(): Promise<void>;
  status(): Promise<WatchStatus>;
  // The legacy Capacitor.Plugins proxy returns a bare handle on some builds, a Promise on others.
  addListener(eventName: string, cb: (data: unknown) => void): Promise<ListenerHandle> | ListenerHandle;
}

function plugin(): WatchPlugin | null {
  const cap = (globalThis as { Capacitor?: { Plugins?: Record<string, WatchPlugin> } }).Capacitor;
  return cap?.Plugins?.WatchBridge ?? null;
}

let started = false;

/** Attach a listener without assuming addListener returns a Promise; never throws. */
function listen(p: WatchPlugin, eventName: string, cb: (data: unknown) => void): void {
  try {
    Promise.resolve(p.addListener(eventName, cb)).catch(() => undefined);
  } catch { /* plugin missing the method: live HR stays off, the app still boots */ }
}

/** Call once, from main.tsx. No-ops on the web or when the plugin isn't in this build. */
export function startWatchListeners(): void {
  if (started) return;
  started = true;
  const p = plugin();
  if (!isNative() || !p) return;
  Promise.resolve().then(() => p.isSupported()).then(r => {
    watchSupported.value = r.supported;
    if (!r.supported) { watchStatus.value = UNSUPPORTED; return; }
    return Promise.resolve(p.status()).then(s => { watchStatus.value = s; });
  }).catch(() => undefined);
  listen(p, 'watchStatus', data => { watchStatus.value = data as WatchStatus; });
  listen(p, 'watchMeasurement', data => { latestMeasurement.value = data as WatchMeasurement; });
  listen(p, 'watchDevice', data => {
    const d = data as WatchDevice;
    scannedDevices.value = [...scannedDevices.value.filter(x => x.address !== d.address), d];
  });
}

export async function watchPermissionState(): Promise<{ granted: boolean; needsLocation: boolean } | null> {
  const p = plugin();
  if (!p) return null;
  try { return await p.permissionState(); } catch { return null; }
}

export async function requestWatchPermissions(): Promise<boolean> {
  const p = plugin();
  if (!p) return false;
  try { return (await p.requestPermissions()).granted; } catch { return false; }
}

export async function scanForWatch(timeoutMs = 20_000): Promise<void> {
  const p = plugin();
  if (!p) return;
  scannedDevices.value = [];
  try { await p.startScan({ timeoutMs }); } catch { /* surfaced via watchStatus */ }
}

export async function stopWatchScan(): Promise<void> {
  const p = plugin();
  if (!p) return;
  try { await p.stopScan(); } catch { /* ignore */ }
}

export async function connectWatch(address: string): Promise<void> {
  const p = plugin();
  if (!p) return;
  try { await p.connect({ address }); } catch { /* surfaced via watchStatus */ }
}

export async function disconnectWatch(): Promise<void> {
  const p = plugin();
  if (!p) return;
  try { await p.disconnect(); } catch { /* ignore */ }
}
