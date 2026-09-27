/**
 * 7.5: the app-side half of docs/ERROR-REPORTS.md. `reportError` is the one call every trigger
 * site makes; everything else here is wiring called once from main.tsx. A failure anywhere in
 * this module must never reach the app, so every public function swallows its own errors.
 */
import { APP_VERSION } from '@/core/version';
import { saveError, state } from '@/core/store';
import { openPanel, tab } from '@/app/router';
import { isNative } from '@/native/capacitor';
import { ESCOBAR_PROXY_URL } from '@/escobar/state';
import { buildReport } from './scrub';
import { getInstallId, resetInstallId } from './installId';
import { clearNextAttempt, clearQueue, enqueue } from './queue';
import { trySend } from './sender';
import type { ReportKind } from './types';

export type { ReportKind } from './types';
export { errorReportsAskTrigger, shouldAskErrorReports } from './ask';

function currentRoute(): string {
  try { return openPanel.value?.id ?? tab.value; } catch { return 'unknown'; }
}

function consentGiven(): boolean {
  try { return state.value.preferences.errorReports === true; } catch { return false; }
}

function describeError(err: unknown): { name: string; message: string; stack?: string } {
  if (err instanceof Error) return { name: err.name || 'Error', message: err.message ?? '', stack: err.stack };
  if (typeof err === 'string') return { name: 'Error', message: err };
  try { return { name: 'Error', message: JSON.stringify(err) ?? String(err) }; } catch { return { name: 'Error', message: String(err) }; }
}

/** Convenience for the boundary/onerror/unhandledrejection/store-save/boot/backup trigger sites:
 * an arbitrary caught value in, an allowlisted report out. */
export function reportCaught(kind: ReportKind, err: unknown): void {
  const { name, message, stack } = describeError(err);
  reportError(kind, name, message, stack);
}

/** Builds, queues and (best-effort) sends one report. A no-op while consent is off. */
export function reportError(kind: ReportKind, name: string, rawMessage: string, stack?: string): void {
  try {
    if (!consentGiven()) return;
    const report = buildReport({
      installId: getInstallId(),
      app: APP_VERSION,
      platform: isNative() ? 'android' : 'web',
      route: currentRoute(),
      kind,
      name,
      rawMessage,
      stack,
    });
    enqueue(report);
    void trySend({ workerBase: ESCOBAR_PROXY_URL });
  } catch { /* never throw into the app */ }
}

/** Settings switch turned off: no report is sent while off, and anything already queued goes. */
export function clearErrorReportQueue(): void {
  try { clearQueue(); } catch { /* storage unavailable */ }
}

/** "Delete everything": a fresh install id and an empty queue, same as a new install. */
export function resetErrorReporting(): void {
  try { resetInstallId(); clearQueue(); } catch { /* storage unavailable */ }
}

let poller: ReturnType<typeof setInterval> | null = null;
let onlineHandler: (() => void) | null = null;

/** Called once at boot: flushes anything left over from last session, then keeps trying every
 * 30s (trySend itself is a no-op outside its backoff window) and immediately on reconnect. */
export function initErrorReporting(): void {
  try {
    let lastSaveError: string | null = null;
    saveError.subscribe(v => {
      if (v && v !== lastSaveError) reportError('store-save', 'save-failed', v);
      lastSaveError = v;
    });

    void trySend({ workerBase: ESCOBAR_PROXY_URL });
    if (poller) clearInterval(poller);
    poller = setInterval(() => { void trySend({ workerBase: ESCOBAR_PROXY_URL }); }, 30_000);

    if (typeof window !== 'undefined') {
      if (onlineHandler) window.removeEventListener('online', onlineHandler);
      // Connectivity just changed, so any offline-caused backoff no longer applies.
      onlineHandler = () => { clearNextAttempt(); void trySend({ workerBase: ESCOBAR_PROXY_URL, now: Date.now() }); };
      window.addEventListener('online', onlineHandler);
    }
  } catch { /* never throw into the app */ }
}
