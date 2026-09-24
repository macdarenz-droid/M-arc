import { render } from 'preact';
import { App } from './app/App';
import { installThemeEngine } from './theme/engine';
import { bootSource, flushSave, initStore, state } from './core/store';
import { setHapticsEnabled } from './native/haptics';
import { showToast } from './app/toast';
import { resyncReminders } from './slices/settings/reminders';
import { backgroundHealthSync } from './slices/settings/health';
import { isNative } from './native/capacitor';
import { installBackButton } from './native/back';
import { onNotificationTap, refreshExactAlarm, syncBackupReminder } from './native/notifications';
import { startWatchListeners } from './native/watch';
import { startHeartCapture } from './slices/workout/heart';
import { go, showPanel } from './app/router';
import { refreshClock } from './app/clock';
import { ErrorBoundary } from './app/ErrorBoundary';
import { pageIsCurrent } from './app/swUpdate';
import { reconcilePhoneWorkout } from './native/workoutOwnership';
import './ui/styles.css';

/** A throw anywhere in here used to leave a silent blank screen with no signal to diagnose from — see the crash handler in index.html, which this reports to explicitly rather than relying only on the window 'error' event. */
async function boot(): Promise<void> {
  installThemeEngine();
  initStore(localStorage, isNative());
  // Paint the shell before the optional bridge read (which can take up to 12 seconds).
  render(<ErrorBoundary><App /></ErrorBoundary>, document.getElementById('app')!);
  (globalThis as { __marcBooted?: boolean }).__marcBooted = true;
  if (isNative()) void reconcilePhoneWorkout().catch(err => console.error('workout ownership check', err));
  setHapticsEnabled(state.value.preferences.haptics);
  startWatchListeners();
  void installBackButton();
  startHeartCapture();

  // After boot, a stray error or rejected promise is reported once in a while, never a blank screen.
  let lastErrorToast = 0;
  const reportLate = (err: unknown) => {
    console.error(err);
    const now = Date.now();
    if (now - lastErrorToast < 10_000) return;
    lastErrorToast = now;
    showToast('Something went wrong. Your data is saved.');
  };
  window.addEventListener('error', e => reportLate(e.error ?? e.message));
  window.addEventListener('unhandledrejection', e => reportLate(e.reason));

  if (bootSource.value === 'legacy') {
    showToast(`Imported ${state.value.sessions.length} sessions from the previous version`);
  }

  // Keep unsaved work safe when the app goes to the background.
  // Coming back: re-read the clock (a night in the background, a new time zone), and repair
  // reminders Android may have dropped (ST-16).
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') { flushSave(); return; }
    refreshClock();
    void refreshExactAlarm();
    void resyncReminders();
    void backgroundHealthSync();
  });
  window.addEventListener('pagehide', flushSave);
  void refreshExactAlarm();
  void resyncReminders();
  void backgroundHealthSync();

  // Notification taps: rest done → Train, training day → Train.
  onNotificationTap(type => { if (type === 'backup') showPanel('settings', { section: 'data' }); else go('train'); });
  void syncBackupReminder(state.peek().preferences.backupReminder ?? isNative());

  // The web bundle defines window.Capacitor too (via @capacitor/core), so only isNative() tells the APK apart.
  if ('serviceWorker' in navigator && !isNative()) {
    window.addEventListener('load', () => { navigator.serviceWorker.register('./sw.js').catch(() => undefined); });
    // ST-25: a new build took over. Mid-session the reload waits; otherwise offer it.
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController || state.peek().active) return;
      void pageIsCurrent().then(current => { if (!current) showToast('App updated', 'Reload', () => location.reload()); });
    });
  }
}
void boot().catch(err => {
  (globalThis as { __marcCrash?: (e: unknown) => void }).__marcCrash?.(err);
  console.error(err);
});
