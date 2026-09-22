import { update } from '@/core/store';
import type { CheckIn } from '@/core/models';

/** F2.2: one merged row per day, newest last, capped at 180 (matches AppState.checkIns' own cap). */
export function saveCheckIn(day: string, patch: Partial<Omit<CheckIn, 'day'>>): void {
  update(s => {
    const existing = s.checkIns.find(c => c.day === day);
    const merged: CheckIn = { ...existing, ...patch, day };
    const checkIns = [...s.checkIns.filter(c => c.day !== day), merged].sort((a, b) => a.day.localeCompare(b.day)).slice(-180);
    return { ...s, checkIns };
  });
}
