import { signal, batch } from '@preact/signals';
import { freshState, newId, type AppState, type Session, type Split, type Weekday } from './models';
import { convertLegacy, readLegacy } from './migrate';
import { legacySessionLogging } from '@/brain/fidelity';
import { normalizeEscobar, normalizeUnits } from './escobarState';
import { backfillLegacyLbEntries, backfillLegacyLbSets } from './units';
import { dayKey } from './dates';
import { DEFAULT_GOAL, isGoalId } from '@/data/goals';
import { showToast } from '@/app/toast';

/** A session saved before `logging` existed gets a legacy backfill so every reader can rely on it being present. */
function withLogging(s: Session): Session {
  return s.logging ? s : { ...s, logging: legacySessionLogging(s.startedAt, s.endedAt) };
}

export const STATE_KEY = 'marc.state.v1';
export const BACKUP_KEY = 'marc.state.v1.backup';
/** The day (local YYYY-MM-DD) the backup restore point was last written (ST-10). */
export const BACKUP_DAY_KEY = 'marc.state.v1.backupDay';
/** Unreadable saved data kept aside at boot (ST-01). Only the user deletes these. */
export const CORRUPT_KEY = 'marc.state.v1.corrupt';
export const CORRUPT_BACKUP_KEY = 'marc.state.v1.backup.corrupt';

type Storagelike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function isState(v: unknown): v is AppState {
  return !!v && typeof v === 'object' && (v as AppState).version === 1 && Array.isArray((v as AppState).sessions) && Array.isArray((v as AppState).splits);
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Keeps only the object elements of a list; counts what it drops. */
function objects<T>(list: unknown, counter: { dropped: number }): T[] {
  if (!Array.isArray(list)) return [];
  const out = list.filter(isObj) as T[];
  counter.dropped += list.length - out.length;
  return out;
}

/**
 * Deep repair of a saved or restored state (ST-11): drops non-object list elements, gives
 * sessions an id and lists, drops splits without an id, clears schedule days that point at no
 * split, and sorts sessions by start. Repairs instead of rejecting, and reports what it dropped.
 */
export function repairState(raw: AppState): { state: AppState; dropped: number } {
  const c = { dropped: 0 };
  const splitsIn = objects<Split>(raw.splits, c);
  const splits = splitsIn.filter(sp => typeof sp.id === 'string');
  c.dropped += splitsIn.length - splits.length;
  const splitIds = new Set(splits.map(sp => sp.id));
  const sessions = objects<Session>(raw.sessions, c).map(ses => ({
    ...ses,
    id: typeof ses.id === 'string' ? ses.id : newId('s'),
    exercises: objects<Session['exercises'][number]>(ses.exercises, c).map(e => ({ ...e, sets: objects<Session['exercises'][number]['sets'][number]>(e.sets, c) })),
  }));
  sessions.sort((a, b) => (a.startedAt ?? '') < (b.startedAt ?? '') ? -1 : (a.startedAt ?? '') > (b.startedAt ?? '') ? 1 : 0);
  const schedule = { ...(isObj(raw.schedule) ? raw.schedule : {}) } as Record<Weekday, string | null>;
  for (const d of Object.keys(schedule) as Weekday[]) { const v = schedule[d]; schedule[d] = typeof v === 'string' && splitIds.has(v) ? v : null; }
  const lists = {
    body: objects<AppState['body'][number]>(raw.body, c),
    healthDays: objects<AppState['healthDays'][number]>(raw.healthDays, c),
    weightLog: objects<AppState['weightLog'][number]>(raw.weightLog, c),
    checkIns: objects<AppState['checkIns'][number]>(raw.checkIns, c),
    freshMarks: objects<AppState['freshMarks'][number]>(raw.freshMarks, c),
    customExercises: objects<AppState['customExercises'][number]>(raw.customExercises, c),
  };
  const repaired: AppState = {
    ...raw,
    goal: isGoalId(raw.goal) ? raw.goal : DEFAULT_GOAL,
    splits: splits.map(sp => ({ ...sp, name: typeof sp.name === 'string' ? sp.name : 'Workout', exercises: objects<Split['exercises'][number]>(sp.exercises, c) })),
    sessions,
    schedule,
    ...lists,
  };
  return { state: fill(repaired), dropped: c.dropped };
}

/** Fill in fields added after a state was first saved, after a deep repair. */
function normalize(s: AppState): AppState {
  let out = repairState(s).state;
  // RG-02: an lb user's history from before per-set units displays exactly as typed.
  const savedBeforeUnits = !Object.prototype.hasOwnProperty.call(s, 'units');
  if (savedBeforeUnits && s.preferences?.weightUnit === 'lb') {
    out = { ...out, sessions: backfillLegacyLbEntries(out.sessions), active: out.active && Array.isArray(out.active.entries) ? { ...out.active, entries: out.active.entries.map(e => ({ ...e, sets: backfillLegacyLbSets(e.sets ?? []) })) } : out.active };
  }
  return out;
}

/** R2.8: a loaded live session gets ids where it has none. Times are never invented. */
function withActiveIds(a: AppState['active']): AppState['active'] {
  if (!a || !Array.isArray(a.entries)) return a ?? null;
  return {
    ...a,
    id: a.id ?? newId('s'),
    entries: a.entries.map(e => ({ ...e, id: e.id ?? newId('e'), sets: (Array.isArray(e.sets) ? e.sets : []).map(set => (set.id ? set : { ...set, id: newId('set') })) })),
  };
}

export const MAX_DAYS_OFF = 400;
export const MAX_EXERCISE_NOTE = 200;
function cleanNotes(v: unknown): Record<string, string> {
  if (!isObj(v)) return {};
  const out: Record<string, string> = {};
  for (const [k, n] of Object.entries(v)) if (typeof n === 'string' && n.trim()) out[k] = n.trim().slice(0, MAX_EXERCISE_NOTE);
  return out;
}

function fill(s: AppState): AppState {
  const fresh = freshState();
  const weightUnit = s.preferences?.weightUnit === 'lb' ? 'lb' : 'kg';
  return {
    ...fresh,
    ...s,
    profile: { ...fresh.profile, ...s.profile },
    preferences: { ...fresh.preferences, ...s.preferences, weightUnit, reminders: { ...fresh.preferences.reminders, ...s.preferences?.reminders }, watch: { ...fresh.preferences.watch, ...s.preferences?.watch }, rest: { ...fresh.preferences.rest, ...s.preferences?.rest } },
    schedule: { ...fresh.schedule, ...s.schedule },
    health: { ...fresh.health, ...s.health, ...(s.health?.activeCalories != null && s.health.activeCalories > 20_000 ? { activeCalories: Math.round(s.health.activeCalories / 1000) } : {}) },
    splits: (s.splits ?? []).map(sp => ({ ...sp, focus: sp.focus ?? [], exercises: sp.exercises ?? [] })),
    body: s.body ?? [],
    customExercises: s.customExercises ?? [],
    // VX-01: heal activeCalories stored as small calories by builds before the fix.
    healthDays: (s.healthDays ?? []).map(d => (d.activeCalories != null && d.activeCalories > 20_000 ? { ...d, activeCalories: Math.round(d.activeCalories / 1000) } : d)),
    weightLog: s.weightLog ?? [],
    profileHistory: s.profileHistory ?? [],
    onboarding: { ...fresh.onboarding, ...s.onboarding, dismissedAt: s.onboarding?.dismissedAt ?? [] },
    checkIns: s.checkIns ?? [],
    recoveryModel: { tauScale: s.recoveryModel?.tauScale ?? {}, observations: s.recoveryModel?.observations ?? {} },
    freshMarks: s.freshMarks ?? [],
    deload: s.deload ?? null,
    insightFeedback: s.insightFeedback ?? [],
    sessions: (s.sessions ?? []).map(withLogging),
    escobar: normalizeEscobar(s.escobar),
    units: normalizeUnits(s.units, weightUnit),
    active: withActiveIds(s.active),
    daysOff: Array.isArray(s.daysOff) ? [...new Set(s.daysOff.filter((d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort().slice(-MAX_DAYS_OFF) : [],
    exerciseNotes: cleanNotes(s.exerciseNotes),
  };
}

export type BootSource = 'saved' | 'backup' | 'legacy' | 'fresh';

export function loadState(storage: Storagelike = localStorage): { state: AppState; source: BootSource; raw: string | null } {
  const tryKey = (key: string): AppState | null => {
    try {
      const raw = storage.getItem(key);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return isState(parsed) ? normalize(parsed) : null;
    } catch {
      return null;
    }
  };
  const raw = (key: string): string | null => { try { return storage.getItem(key); } catch { return null; } };
  const saved = tryKey(STATE_KEY);
  if (saved) return { state: saved, source: 'saved', raw: raw(STATE_KEY) };
  const backup = tryKey(BACKUP_KEY);
  if (backup) return { state: backup, source: 'backup', raw: raw(BACKUP_KEY) };
  const legacy = readLegacy(storage);
  if (legacy?.workouts) return { state: convertLegacy(legacy), source: 'legacy', raw: null };
  return { state: freshState(), source: 'fresh', raw: null };
}

export const state = signal<AppState>(freshState());
export const bootSource = signal<BootSource>('fresh');
export const saveError = signal<string | null>(null);
/** True when boot could not read the latest saved data and kept a copy aside (ST-01). */
export const bootRecovered = signal<boolean>(false);

let storageRef: Storagelike | null = null;
let saveTimer: ReturnType<typeof setTimeout> | null = null;
/** The raw JSON last loaded or written successfully: tomorrow's restore point (ST-10). */
let lastGoodRaw: string | null = null;
let storageListener: ((e: StorageEvent) => void) | null = null;

/** Keeps an unreadable raw aside once; never overwrites an identical copy. */
function quarantine(storage: Storagelike, key: string, raw: string): boolean {
  try {
    if (storage.getItem(key) !== raw) storage.setItem(key, raw);
    return true;
  } catch (err) {
    console.warn('could not keep a copy of unreadable data', err);
    return false;
  }
}

export function initStore(storage: Storagelike = localStorage): void {
  storageRef = storage;
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  const loaded = loadState(storage);
  let recovered = false;
  if (loaded.source !== 'saved') {
    let mainRaw: string | null = null;
    let backupRaw: string | null = null;
    try { mainRaw = storage.getItem(STATE_KEY); backupRaw = storage.getItem(BACKUP_KEY); } catch { /* unreadable storage */ }
    if (mainRaw != null && quarantine(storage, CORRUPT_KEY, mainRaw)) recovered = true;
    if (backupRaw != null && (loaded.source === 'fresh' || loaded.source === 'legacy') && quarantine(storage, CORRUPT_BACKUP_KEY, backupRaw)) recovered = true;
  }
  lastGoodRaw = loaded.raw;
  batch(() => {
    state.value = loaded.state;
    bootSource.value = loaded.source;
    bootRecovered.value = recovered;
  });
  if (loaded.source !== 'saved') persistNow();
  listenToOtherTabs();
}

/** ST-19: another tab saved; take its state instead of overwriting it later. */
function listenToOtherTabs(): void {
  if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
  if (storageListener) window.removeEventListener('storage', storageListener);
  storageListener = (e: StorageEvent) => {
    if (e.key !== STATE_KEY || !e.newValue) return;
    let parsed: unknown;
    try { parsed = JSON.parse(e.newValue); } catch { return; }
    if (!isState(parsed)) return;
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    const localActive = state.value.active;
    const incoming = normalize(parsed);
    state.value = incoming;
    lastGoodRaw = e.newValue;
    if (localActive && localActive.startedAt !== incoming.active?.startedAt) showToast('Updated from another tab');
  };
  window.addEventListener('storage', storageListener);
}

const isQuotaError = (err: unknown): boolean => {
  const e = err as { name?: string; code?: number } | null;
  return !!e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014);
};

/**
 * Main write first. On a full storage, the app's own backup copy goes first and the write is
 * retried once. The backup is a daily restore point: the state as it was before the first save
 * of each local day. It is best-effort and never reports an error.
 */
export function persistNow(): boolean {
  if (!storageRef) return false;
  const storage = storageRef;
  let raw: string;
  try { raw = JSON.stringify(state.value); } catch (err) { saveError.value = 'Could not save. Free some storage space and try again.'; console.warn('save failed', err); return false; }
  const before = lastGoodRaw;
  let freedSpace = false;
  try {
    storage.setItem(STATE_KEY, raw);
  } catch (err) {
    if (isQuotaError(err)) {
      try { storage.removeItem(BACKUP_KEY); storage.removeItem(BACKUP_DAY_KEY); storage.setItem(STATE_KEY, raw); freedSpace = true; } catch (retryErr) { console.warn('save failed', retryErr); }
    } else console.warn('save failed', err);
    if (!freedSpace) { saveError.value = 'Could not save. Free some storage space and try again.'; return false; }
  }
  lastGoodRaw = raw;
  saveError.value = null;
  try {
    const today = dayKey();
    // Right after the backup was dropped for space, don't fill that space again on this save.
    if (!freedSpace && before && before !== raw && storage.getItem(BACKUP_DAY_KEY) !== today) {
      storage.setItem(BACKUP_KEY, before);
      storage.setItem(BACKUP_DAY_KEY, today);
    }
  } catch (err) { console.warn('backup write skipped', err); }
  return true;
}

/** The kept-aside unreadable data, for the rescue file (ST-01). */
export function rescueRaw(storage: Storagelike = storageRef ?? localStorage): string | null {
  try { return storage.getItem(CORRUPT_KEY) ?? storage.getItem(CORRUPT_BACKUP_KEY); } catch { return null; }
}

export function deleteRescueCopy(storage: Storagelike = storageRef ?? localStorage): void {
  try { storage.removeItem(CORRUPT_KEY); storage.removeItem(CORRUPT_BACKUP_KEY); } catch { /* nothing to delete */ }
  bootRecovered.value = false;
}

function persistSoon(): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => { saveTimer = null; persistNow(); }, 250);
}

/** Apply a change to the state. The updater must return a new object (spread). */
export function update(fn: (s: AppState) => AppState): void {
  state.value = fn(state.value);
  persistSoon();
}

export function replaceState(next: AppState): void {
  state.value = normalize(next);
  persistNow();
}

export function flushSave(): void {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  persistNow();
}

