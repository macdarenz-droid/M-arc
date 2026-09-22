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
    return mapHealthSummary(r, dayKey(new Date()), new Date().toISOString());
  } catch {
    return null;
  }
}
