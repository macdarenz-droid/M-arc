/** Whether the online coach is on, and the anonymous per-device id the proxy uses for its daily quota. */
import { computed } from '@preact/signals';
import { state, update, flushSave } from '@/core/store';
import { newDeviceId } from '@/ai/client';

export const remoteEnabled = computed(() => state.value.coach.remoteExplainer && state.value.coach.explainerUrl.trim().length > 0);

export function ensureDeviceId(): string {
  const existing = state.value.coach.deviceId;
  if (existing) return existing;
  const id = newDeviceId();
  update(s => ({ ...s, coach: { ...s.coach, deviceId: id } }));
  flushSave();
  return id;
}

/** GET /health on the proxy, for the Settings check button. */
export async function checkProxy(url: string, fetchImpl: typeof fetch = globalThis.fetch): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetchImpl(`${url.trim().replace(/\/+$/, '')}/health`);
    const body = (await res.json()) as { ok?: boolean; model?: string };
    if (res.ok && body.ok) return { ok: true, message: `Online coach is reachable (${body.model ?? 'unknown model'}).` };
    return { ok: false, message: `The proxy answered ${res.status}.` };
  } catch {
    return { ok: false, message: 'Could not reach the proxy. Check the address and your connection.' };
  }
}
