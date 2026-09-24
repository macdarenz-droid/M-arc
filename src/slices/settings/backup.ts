/**
 * Backup files (R1.3): build one, and read any file a person may hand back — this version's
 * backup, a bare saved state, or the previous app's data. Restored states go through the same
 * deep repair as saved ones (`repairState`), and the repair count is reported.
 */
import { dayKey, daysBetween } from '@/core/dates';
import { repairState } from '@/core/store';
import type { AppState } from '@/core/models';
import { asLegacyRoot, convertLegacy } from '@/core/migrate';
import { exportHeart, type HeartSeriesStore } from '@/core/heartStore';
import { exportAllEscobar } from '@/escobar/store';
import { APP_VERSION } from '@/core/version';
import { state } from '@/core/store';

export const BACKUP_SCHEMA = 2;
const ACTIVE_MAX_AGE_MS = 12 * 3_600_000;

export function buildBackup(now = new Date()) {
  return { app: 'M/ARC', version: APP_VERSION, schema: BACKUP_SCHEMA, exportedAt: now.toISOString(), state: state.value, escobar: exportAllEscobar(), heart: exportHeart() };
}

export type ParsedBackup =
  | { kind: 'v37'; state: AppState; escobar?: unknown; heart?: HeartSeriesStore; exportedAt?: string; dropped: number }
  | { kind: 'legacy'; state: AppState }
  | { error: string };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const looksLikeState = (v: unknown): v is AppState => isObj(v) && v.version === 1 && Array.isArray(v.sessions);

export function parseBackup(text: string, now = Date.now()): ParsedBackup {
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { return { error: 'That file is not an M/ARC backup' }; }
  const legacy = asLegacyRoot(parsed);
  if (legacy) return { kind: 'legacy', state: convertLegacy(legacy, new Date(now)) };
  const wrapped = isObj(parsed) && 'state' in parsed;
  const candidate = wrapped ? (parsed as { state: unknown }).state : parsed;
  if (!looksLikeState(candidate)) return { error: 'That file is not an M/ARC backup' };
  const { state: repaired, dropped } = repairState(candidate);
  const started = repaired.active ? Date.parse(repaired.active.startedAt) : NaN;
  const active = repaired.active && Number.isFinite(started) && now - started <= ACTIVE_MAX_AGE_MS ? repaired.active : null;
  const w = wrapped ? (parsed as Record<string, unknown>) : {};
  return {
    kind: 'v37',
    state: { ...repaired, active },
    ...('escobar' in w ? { escobar: w.escobar } : {}),
    ...(isObj(w.heart) ? { heart: w.heart as HeartSeriesStore } : {}),
    ...(typeof w.exportedAt === 'string' ? { exportedAt: w.exportedAt } : {}),
    dropped,
  };
}

/** QA-R6-1/7: whole local days since the last backup (the stamp is UTC; the day it fell on is local). */
export function backupAgeDays(lastBackupAt: string | undefined, today: string): number | null {
  if (!lastBackupAt || !Number.isFinite(Date.parse(lastBackupAt))) return null;
  return Math.max(0, daysBetween(dayKey(new Date(lastBackupAt)), today));
}
