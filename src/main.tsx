import { render } from 'preact';
import { App } from './app/App';
import { installThemeEngine } from './theme/engine';
import { bootSource, flushSave, initStore, state } from './core/store';
import { setHapticsEnabled } from './native/haptics';
import { showToast } from './app/toast';
import { resyncReminders } from './slices/settings/reminders';
import { refreshPreferenceFactsIfStale } from './slices/coach/preferences';
import { onNotificationTap } from './native/notifications';
import { go } from './app/router';
import { beginHeartRateSession, initializeHeartRate, refreshHeartRateSummaries } from './heart-rate/store';
import './ui/styles.css';

installThemeEngine();
initStore();
// Bind the recorder, reattach a workout that was already running, then recover
// any summaries the native store holds but this device's state has lost. All of
// it is optional: a failure here must never stop the app from loading.
void initializeHeartRate().then(async () => {
  const activeId = state.value.active?.id;
  if (activeId) await beginHeartRateSession(activeId, state.value.active!.startedAt);
  await refreshHeartRateSummaries();
}).catch(() => undefined);
setHapticsEnabled(state.value.preferences.haptics);

render(<App />, document.getElementById('app')!);

if (bootSource.value === 'legacy') {
  showToast(`Imported ${state.value.sessions.length} sessions from the previous version`);
}

// Keep unsaved work safe when the app goes to the background.
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(); });
window.addEventListener('pagehide', flushSave);
// Android may drop scheduled reminders; check and repair when we come back.
window.addEventListener('pageshow', () => { void resyncReminders(); void refreshHeartRateSummaries(); });
void resyncReminders();
refreshPreferenceFactsIfStale();

// Notification taps: rest done → Train, training day → Train.
onNotificationTap(() => go('train'));

if ('serviceWorker' in navigator && !(globalThis as { Capacitor?: unknown }).Capacitor) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
}
