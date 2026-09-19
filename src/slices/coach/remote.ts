/**
 * The remote explainer as the screens see it: one cached explanation for
 * the current report, fetched only when the user asks, never on a refresh.
 */
import { computed, signal } from '@preact/signals';
import { state, update, flushSave } from '@/core/store';
import { report } from '@/app/selectors';
import { buildPayload, explanationKey, fetchExplanation, getCached, newDeviceId, putCached, type ExplainPayload, type Explanation } from '@/brain/coach/explainer';

const storage = (): Storage | null => { try { return globalThis.localStorage ?? null; } catch { return null; } };

/** Bumped after every cache write so computed views re-read localStorage. */
const cacheVersion = signal(0);
export const explaining = signal(false);
export const explainError = signal<string | null>(null);

export const remoteEnabled = computed(() => state.value.coach.remoteExplainer && state.value.coach.explainerUrl.trim().length > 0);

export function currentPayload(explain?: string[]): ExplainPayload {
  const s = state.value;
  return buildPayload(report.value, { goal: s.goal, unit: s.preferences.weightUnit, ...(explain ? { explain } : {}) });
}

export const explanation = computed<Explanation | null>(() => {
  void cacheVersion.value;
  if (!remoteEnabled.value) return null;
  return getCached(explanationKey(currentPayload()), storage());
});

export function ensureDeviceId(): string {
  const existing = state.value.coach.deviceId;
  if (existing) return existing;
  const id = newDeviceId();
  update(s => ({ ...s, coach: { ...s.coach, deviceId: id } }));
  flushSave();
  return id;
}

/** Ask the proxy for the current report. Returns the explanation or a plain-words error. */
export async function requestExplanation(): Promise<Explanation | null> {
  if (!remoteEnabled.value || explaining.value) return explanation.value;
  const payload = currentPayload();
  const cached = getCached(explanationKey(payload), storage());
  if (cached) return cached;
  explaining.value = true;
  explainError.value = null;
  try {
    const result = await fetchExplanation(payload, { url: state.value.coach.explainerUrl, deviceId: ensureDeviceId() });
    if (!result.ok) { explainError.value = result.error; return null; }
    putCached(result.explanation, storage());
    cacheVersion.value++;
    return result.explanation;
  } finally {
    explaining.value = false;
  }
}
