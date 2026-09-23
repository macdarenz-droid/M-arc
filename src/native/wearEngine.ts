import { registerPlugin } from '@capacitor/core';
import { isNative } from './capacitor';

export const WATCH_LAB_FLAG = 'marc.dev.watchlab';
export interface LabEvent { n: number; at: number; elapsed: number; kind: string; data: Record<string, unknown>; foreground: boolean; interactive: boolean }
export interface LabDevice { token: string; model: string; firmware: string; connected: boolean }
export interface LabReport {
  schema: 1; run: string; active: boolean; authorized: boolean; receiverReady: boolean;
  devices: LabDevice[]; events: LabEvent[]; dropped: number; persisted: boolean;
  environment: Record<string, unknown>;
}
export type LabAction = 'snapshot' | 'begin' | 'authorize' | 'devices' | 'connect' | 'ping' | 'probe' | 'mark' | 'stop';
interface WearEnginePlugin { execute(options: { action: LabAction; [key: string]: unknown }): Promise<LabReport> }
const plugin = registerPlugin<WearEnginePlugin>('WearEngine');
export type LabResult = { ok: true; report: LabReport } | { ok: false; error: string };

/** Never rejects: RG-01 currently makes an unhandled rejection a destructive crash UI. */
export function wearLab(action: LabAction, args: Record<string, unknown> = {}): Promise<LabResult> {
  if (!isNative()) return Promise.resolve({ ok: false, error: 'Watch lab requires the Android M/ARC app.' });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const failed = (error: unknown): LabResult => ({ ok: false, error: error instanceof Error ? error.message : String(error) });
  const request = Promise.resolve().then(() => plugin.execute({ ...args, action }))
    .then((report): LabResult => ({ ok: true, report })).catch(failed);
  const timeout = new Promise<LabResult>(resolve => {
    timer = setTimeout(() => resolve({ ok: false, error: 'Native lab timed out. Refresh the report before retrying.' }), 12000);
  });
  return Promise.race([request, timeout]).then(result => { clearTimeout(timer); return result; }).catch(failed);
}
