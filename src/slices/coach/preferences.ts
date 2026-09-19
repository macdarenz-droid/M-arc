/**
 * Recomputes and persists preferenceFacts when they are stale (at most
 * weekly). The computation itself is pure (brain/coach/preferences.ts);
 * this is the one place it touches the store, called on app open and after
 * a session finishes — never from a computed signal, so it never runs on
 * every render.
 */
import { state, update, flushSave } from '@/core/store';
import { today } from '@/app/selectors';
import { computePreferenceFacts, shouldRefreshPreferences } from '@/brain/coach/preferences';

export function refreshPreferenceFactsIfStale(): void {
  const coach = state.value.coach;
  if (!shouldRefreshPreferences(coach, today.value)) return;
  const preferenceFacts = computePreferenceFacts(coach);
  update(s => ({ ...s, coach: { ...s.coach, preferenceFacts, preferencesUpdatedAt: new Date().toISOString() } }));
  flushSave();
}
