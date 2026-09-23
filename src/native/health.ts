/**
 * Android Health Connect, through the project's native plugin when the APK
 * includes it. On the web this is a no-op and the card says so.
 */
import type { DailyHealth } from '@/core/models';
import { isNative } from './capacitor';
import { dayKey } from '@/core/dates';

export interface HealthSummaryRaw {
  needsPermission: boolean;
  steps?: number;
  sleepMinutes?: number;
  restingHR?: number;
  workoutHR?: number;
  activeCalories?: number;
  heartRateTime?: string;
  stepsTime?: string;
  activeCaloriesTime?: string;
  sleepEndTime?: string;
  /** Read permissions not granted yet (e.g. READ_RESTING_HEART_RATE); the other types are still read. */
  missing?: string[];
  /** Types whose read failed even though allowed. */
  failed?: string[];
}

interface HealthPlugin {
  isAvailable?: () => Promise<{ available?: boolean; needsPermission?: boolean }>;
  openPermissions?: () => Promise<{ opened?: boolean }>;
  requestPermissions?: () => Promise<{ granted?: boolean }>;
  readSummary?: () => Promise<HealthSummaryRaw>;
}

function plugin(): HealthPlugin | null {
  const cap = (globalThis as { Capacitor?: { Plugins?: Record<string, HealthPlugin> } }).Capacitor;
  return cap?.Plugins?.HealthConnectNative ?? null;
}

export function healthAvailable(): boolean {
  return isNative() && !!plugin();
}

/**
 * VX-01: builds before the fix sent small calories (1000× kcal). No one burns 20 000 active kcal
 * in a day, so anything above that is small calories and is divided back.
 */
export const kcalGuard = (v: number | undefined): number | undefined => (v != null && v > 20_000 ? Math.round(v / 1000) : v);

/** The types the plugin reads; `missing` and `failed` name them by these. */
const HEALTH_TYPES = 5;

/** Pure: maps the plugin's raw summary to a day's health record. Zero readings read as absent, not zero. */
export function mapHealthSummary(r: HealthSummaryRaw, day: string, syncedAt: string): DailyHealth | null {
  if (r.needsPermission) return null;
  // Every granted type failed: nothing was read, which is not the same as a day of zeros.
  const granted = HEALTH_TYPES - (r.missing?.length ?? 0);
  if (granted > 0 && (r.failed?.length ?? 0) >= granted) return null;
  return {
    day,
    restingHr: r.restingHR || undefined,
    latestHr: r.workoutHR || undefined,
    latestHrAt: r.heartRateTime,
    sleepMinutes: r.sleepMinutes || undefined,
    sleepEndAt: r.sleepEndTime,
    steps: r.steps || undefined,
    activeCalories: kcalGuard(r.activeCalories) || undefined,
    source: 'health_connect',
    syncedAt,
  };
}

const ASKED_KEY = 'marc.health.asked';
function askedFor(): string { try { return localStorage.getItem(ASKED_KEY) ?? ''; } catch { return ''; } }
function rememberAsked(v: string): void { try { localStorage.setItem(ASKED_KEY, v); } catch { /* storage blocked */ } }

/** Why the last sync gave nothing (UI-16, RG-18): shown in Settings → Health diagnostic. Null after a good sync. */
export interface HealthError { needsPermission: boolean; missing: string[]; failed: string[]; message: string; raw?: HealthSummaryRaw }
export let lastHealthError: HealthError | null = null;

/**
 * Reads today's Health Connect summary. Only the Settings Connect/Sync buttons pass
 * `prompt: true`; background syncs (cold start, resume, session start) never show a dialog.
 * Null when unavailable, denied or every read failed; `lastHealthError` says which.
 */
export async function syncHealth({ prompt = false }: { prompt?: boolean } = {}): Promise<DailyHealth | null> {
  const p = plugin();
  if (!p?.readSummary) { lastHealthError = { needsPermission: false, missing: [], failed: [], message: 'Health Connect is not available in this build.' }; return null; }
  const startDay = dayKey(new Date());
  try {
    let r = await p.readSummary();
    if (r.needsPermission && prompt) {
      if (p.requestPermissions) await p.requestPermissions();
      else await p.openPermissions?.();
      r = await p.readSummary();
    }
    if (r.needsPermission) { lastHealthError = { needsPermission: true, missing: r.missing ?? [], failed: [], message: 'M/ARC has no Health Connect permission yet.', raw: r }; return null; }
    // A permission added in a newer build (resting heart rate) is asked for once, not on every sync.
    const missing = (r.missing ?? []).slice().sort().join(',');
    if (prompt && missing && askedFor() !== missing && p.requestPermissions) {
      rememberAsked(missing);
      await p.requestPermissions();
      r = await p.readSummary();
    }
    // QA-R5a-3: steps and calories are "since midnight" aggregates. If midnight passed during the
    // reads they may be the day that ended, so they are not stored under the new day.
    const endDay = dayKey(new Date());
    if (endDay !== startDay) r = { ...r, steps: undefined, activeCalories: undefined };
    const day = mapHealthSummary(r, endDay, new Date().toISOString());
    // QA-R5a-1: a partial failure is reported too (Settings shows Details), not only a total one.
    lastHealthError = !day ? { needsPermission: false, missing: r.missing ?? [], failed: r.failed ?? [], message: 'Health Connect answered, but every read failed.', raw: r }
      : r.failed?.length ? { needsPermission: false, missing: r.missing ?? [], failed: r.failed, message: 'Some health data could not be read. What was read is saved.', raw: r }
      : null;
    return day;
  } catch (e) {
    lastHealthError = { needsPermission: false, missing: [], failed: [], message: e instanceof Error ? e.message : 'Health Connect did not answer.' };
    return null;
  }
}

/** Opens Health Connect's permission screen for M/ARC. */
export async function openHealthPermissions(): Promise<void> {
  try { await plugin()?.openPermissions?.(); } catch { /* shown by the diagnostic */ }
}
