import { state, update } from '@/core/store';
import { healthAvailable, syncHealth } from '@/native/health';

/** Reads today's Health Connect summary and folds it into healthDays. `prompt` only from the Settings buttons. */
let lastBackground = 0;
/** Cold start, resume and session start (PL-04): only once connected, never a dialog, at most every 10 min. */
export function backgroundHealthSync(now = Date.now()): Promise<boolean> {
  if (!state.peek().health.connected || now - lastBackground < 10 * 60_000) return Promise.resolve(false);
  lastBackground = now;
  return syncAndStoreHealth({ prompt: false });
}

export async function syncAndStoreHealth({ prompt = false }: { prompt?: boolean } = {}): Promise<boolean> {
  if (!healthAvailable()) return false;
  const day = await syncHealth({ prompt });
  if (!day) return false;
  update(s => {
    const healthDays = [...s.healthDays.filter(d => d.day !== day.day), day].sort((a, b) => a.day.localeCompare(b.day)).slice(-180);
    return {
      ...s,
      healthDays,
      health: { connected: true, lastSync: day.syncedAt, sleepMinutes: day.sleepMinutes, restingHr: day.restingHr, steps: day.steps, activeCalories: day.activeCalories },
    };
  });
  return true;
}
