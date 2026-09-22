import { update } from '@/core/store';
import { healthAvailable, syncHealth } from '@/native/health';

/** Reads today's Health Connect summary and folds it into healthDays. Safe to call often. */
export async function syncAndStoreHealth(): Promise<boolean> {
  if (!healthAvailable()) return false;
  const day = await syncHealth();
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
