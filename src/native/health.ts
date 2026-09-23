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

/** Pure: maps the plugin's raw summary to a day's health record. Zero readings read as absent, not zero. */
export function mapHealthSummary(r: HealthSummaryRaw, day: string, syncedAt: string): DailyHealth | null {
  if (r.needsPermission) return null;
  return {
    day,
    restingHr: r.restingHR || undefined,
    latestHr: r.workoutHR || undefined,
    latestHrAt: r.heartRateTime,
    sleepMinutes: r.sleepMinutes || undefined,
    sleepEndAt: r.sleepEndTime,
    steps: r.steps || undefined,
    activeCalories: r.activeCalories || undefined,
    source: 'health_connect',
    syncedAt,
  };
}

const ASKED_KEY = 'marc.health.asked';
function askedFor(): string { try { return localStorage.getItem(ASKED_KEY) ?? ''; } catch { return ''; } }
function rememberAsked(v: string): void { try { localStorage.setItem(ASKED_KEY, v); } catch { /* storage blocked */ } }

/** Reads today's Health Connect summary, prompting for permission once if needed. Null when unavailable or denied. */
export async function syncHealth(): Promise<DailyHealth | null> {
  const p = plugin();
  if (!p?.readSummary) return null;
  try {
    let r = await p.readSummary();
    if (r.needsPermission) {
      if (p.requestPermissions) await p.requestPermissions();
      else await p.openPermissions?.();
      r = await p.readSummary();
    }
    if (r.needsPermission) return null;
    // A permission added in a newer build (resting heart rate) is asked for once, not on every sync.
    const missing = (r.missing ?? []).slice().sort().join(',');
    if (missing && askedFor() !== missing && p.requestPermissions) {
      rememberAsked(missing);
      await p.requestPermissions();
      r = await p.readSummary();
    }
    return mapHealthSummary(r, dayKey(new Date()), new Date().toISOString());
  } catch {
    return null;
  }
}
