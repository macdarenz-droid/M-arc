/**
 * One-time, read-only import of the previous single-file app's data
 * (localStorage key "dailyTrackerPremium"). The old key is never written
 * or removed, so the old build keeps working if it is ever reinstalled.
 */
import { freshState, newId, type AppState, type Effort, type Exercise, type LoggedExercise, type LoggedSet, type Session, type Split, type Weekday } from './models';
import { WEEKDAYS } from './models';
import { findExercise, makeCustomExercise } from './exercises';
import { dayKey } from './dates';
import { isGoalId } from '@/data/goals';
import { isMuscleId, type MuscleId } from '@/data/muscles';

export const LEGACY_KEY = 'dailyTrackerPremium';

interface LegacySet { kg?: unknown; reps?: unknown; effort?: unknown; durationSec?: unknown; distanceM?: unknown }
interface LegacyCompleted { id?: string; day?: string; dayKey?: string; exerciseKey?: string; name?: string; type?: string; muscle?: string; sets?: LegacySet[]; finalizedAt?: string; splitName?: string }
interface LegacySession { day?: string; date?: string; splitName?: string; workoutName?: string; snapshot?: Array<{ exerciseKey?: string; name?: string; type?: string; muscle?: string; sets?: LegacySet[] }> }
interface LegacyTimed { day?: string; dayKey?: string; startedAt?: string; endedAt?: string; durationMs?: number }
interface LegacyCustomExercise { id?: string; name?: string; type?: string; muscle?: string; sets?: number; libraryId?: string; primaryMuscles?: string[]; secondaryMuscles?: string[]; source?: string }
interface LegacySplit { key?: string; name?: string; color?: string; createdAt?: string; focusMuscles?: string[] }

interface LegacyRoot {
  workouts?: {
    sessions?: LegacySession[];
    completedExercises?: LegacyCompleted[];
    timedSessions?: LegacyTimed[];
    customSplits?: LegacySplit[];
    custom?: Record<string, LegacyCustomExercise[]>;
    dayNames?: Record<string, string>;
    hiddenBaseSplits?: string[];
    trainingProgram?: string;
    restDefaultSec?: number;
    autoRest?: boolean;
  };
  trainingSchedule?: { days?: Record<string, string | null> };
  notifications?: { trainingEnabled?: boolean; trainingTime?: string; trainingStyle?: string };
  preferences?: { units?: { weight?: string } };
  user?: { profile?: { displayName?: string; bodyWeightKg?: number; heightCm?: number; sex?: string } };
  bodyComp?: { sex?: string; height?: number; neck?: number; waist?: number; hip?: number; unit?: string };
}

const BASE_SPLITS: Record<string, { name: string; color: string }> = {
  push: { name: 'Push', color: '#4d9dff' },
  pull: { name: 'Pull', color: '#7fc44b' },
  legs: { name: 'Legs', color: '#ffc845' },
};

const num = (v: unknown): number | undefined => {
  const n = typeof v === 'string' ? parseFloat(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};
const effort = (v: unknown): Effort | undefined => (v === 'easy' || v === 'ideal' || v === 'max' ? v : undefined);

function toSet(s: LegacySet): LoggedSet | null {
  const out: LoggedSet = {};
  const kg = num(s.kg), reps = num(s.reps), dur = num(s.durationSec), dist = num(s.distanceM);
  if (kg != null) out.kg = kg;
  if (reps != null && reps > 0) out.reps = reps;
  if (dur != null && dur > 0) out.durationSec = dur;
  if (dist != null && dist > 0) out.distanceM = dist;
  const e = effort(s.effort);
  if (e) out.effort = e;
  return out.reps || out.durationSec || out.distanceM ? out : null;
}

export function readLegacy(storage: Pick<Storage, 'getItem'> = localStorage): LegacyRoot | null {
  try {
    const raw = storage.getItem(LEGACY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === 'object' ? (parsed as LegacyRoot) : null;
  } catch {
    return null;
  }
}

/** Convert a legacy root into a fresh AppState. Pure; safe to unit test. */
export function convertLegacy(legacy: LegacyRoot, now = new Date()): AppState {
  const state = freshState(now);
  const w = legacy.workouts ?? {};
  const customExercises: Exercise[] = [];
  const customByName = new Map<string, Exercise>();

  const resolveExercise = (name: string | undefined, type?: string, muscle?: string): { id: string; name: string } => {
    const label = (name ?? '').trim() || 'Exercise';
    const found = findExercise(label, customExercises);
    if (found) return { id: found.id, name: found.name };
    const key = label.toLowerCase();
    let custom = customByName.get(key);
    if (!custom) {
      custom = makeCustomExercise({ id: `custom_${customExercises.length + 1}_${key.replace(/[^a-z0-9]+/g, '_').slice(0, 24)}`, name: label, equipment: type ?? 'Other', primary: muscle ? [muscle] : [] });
      customByName.set(key, custom);
      customExercises.push(custom);
    }
    return { id: custom.id, name: custom.name };
  };

  // Splits: base three (unless hidden) plus custom ones.
  const hidden = new Set(w.hiddenBaseSplits ?? []);
  const splitIdByKey = new Map<string, string>();
  const splits: Split[] = [];
  for (const key of Object.keys(BASE_SPLITS)) {
    if (hidden.has(key)) continue;
    const base = BASE_SPLITS[key]!;
    const id = `split_${key}`;
    splitIdByKey.set(key, id);
    splits.push({ id, name: w.dayNames?.[key]?.trim() || base.name, color: base.color, exercises: [], focus: [], createdAt: state.createdAt });
  }
  for (const cs of w.customSplits ?? []) {
    if (!cs.key) continue;
    const id = `split_${cs.key}`;
    splitIdByKey.set(cs.key, id);
    const focus = (cs.focusMuscles ?? []).filter(isMuscleId).slice(0, 2) as MuscleId[];
    splits.push({ id, name: (w.dayNames?.[cs.key] ?? cs.name ?? 'Custom').trim() || 'Custom', color: cs.color ?? '#a061ff', exercises: [], focus, createdAt: cs.createdAt ?? state.createdAt });
  }
  const splitNameFor = (key: string): string => splits.find(s => s.id === splitIdByKey.get(key))?.name ?? BASE_SPLITS[key]?.name ?? key;

  // Sessions: prefer the per-exercise completed records, fall back to whole-session snapshots.
  const buckets = new Map<string, { day: string; splitKey: string; exercises: LoggedExercise[]; times: number[] }>();
  const bucketFor = (day: string, splitKey: string) => {
    const k = `${day}|${splitKey}`;
    let b = buckets.get(k);
    if (!b) { b = { day, splitKey, exercises: [], times: [] }; buckets.set(k, b); }
    return b;
  };
  for (const rec of w.completedExercises ?? []) {
    if (!rec.dayKey || (rec.id ?? '').startsWith('demo|')) continue;
    const sets = (rec.sets ?? []).map(toSet).filter((s): s is LoggedSet => s != null);
    if (!sets.length) continue;
    const b = bucketFor(rec.dayKey, rec.day ?? 'push');
    const ex = resolveExercise(rec.name, rec.type, rec.muscle);
    b.exercises.push({ exerciseId: ex.id, name: ex.name, sets });
    if (rec.finalizedAt) b.times.push(new Date(rec.finalizedAt).getTime());
  }
  for (const s of w.sessions ?? []) {
    if (!s.date) continue;
    const day = dayKey(s.date);
    const splitKey = s.day ?? 'push';
    if (buckets.has(`${day}|${splitKey}`)) continue;
    const exercises: LoggedExercise[] = [];
    for (const snap of s.snapshot ?? []) {
      const sets = (snap.sets ?? []).map(toSet).filter((x): x is LoggedSet => x != null);
      if (!sets.length) continue;
      const ex = resolveExercise(snap.name, snap.type, snap.muscle);
      exercises.push({ exerciseId: ex.id, name: ex.name, sets });
    }
    if (!exercises.length) continue;
    const b = bucketFor(day, splitKey);
    b.exercises.push(...exercises);
    b.times.push(new Date(s.date).getTime());
  }
  const timed = w.timedSessions ?? [];
  const sessions: Session[] = [];
  for (const b of buckets.values()) {
    const t = timed.find(x => x.dayKey === b.day && x.day === b.splitKey);
    const end = b.times.length ? Math.max(...b.times) : new Date(`${b.day}T12:00:00`).getTime();
    const durationSec = t?.durationMs ? Math.round(t.durationMs / 1000) : 0;
    const start = t?.startedAt ? new Date(t.startedAt).getTime() : end - durationSec * 1000;
    sessions.push({
      id: newId('s'),
      splitId: splitIdByKey.get(b.splitKey) ?? `split_${b.splitKey}`,
      splitName: splitNameFor(b.splitKey),
      day: b.day,
      startedAt: new Date(start).toISOString(),
      endedAt: new Date(end).toISOString(),
      durationSec,
      exercises: b.exercises,
    });
  }
  sessions.sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  // Split exercise lists: user-added items plus the latest session for that split.
  for (const split of splits) {
    const key = [...splitIdByKey.entries()].find(([, id]) => id === split.id)?.[0] ?? '';
    const seen = new Set<string>();
    const push = (id: string, sets: number) => { if (!seen.has(id)) { seen.add(id); split.exercises.push({ exerciseId: id, sets: Math.max(1, Math.min(10, sets)) }); } };
    const latest = [...sessions].reverse().find(s => s.splitId === split.id);
    for (const ex of latest?.exercises ?? []) push(ex.exerciseId, ex.sets.length || 3);
    for (const c of w.custom?.[key] ?? []) {
      const ex = resolveExercise(c.name, c.type, c.muscle);
      push(ex.id, c.sets ?? 3);
    }
  }

  // Schedule, goal, preferences, profile.
  for (const d of WEEKDAYS) {
    const v = legacy.trainingSchedule?.days?.[d];
    state.schedule[d as Weekday] = v && splitIdByKey.has(v) ? splitIdByKey.get(v)! : null;
  }
  if (isGoalId(w.trainingProgram)) state.goal = w.trainingProgram;
  if (legacy.preferences?.units?.weight === 'lb') state.preferences.weightUnit = 'lb';
  if (typeof w.restDefaultSec === 'number' && w.restDefaultSec >= 15) state.preferences.restDefaultSec = w.restDefaultSec;
  if (typeof w.autoRest === 'boolean') state.preferences.autoRest = w.autoRest;
  const n = legacy.notifications;
  if (n) {
    state.preferences.reminders = {
      enabled: !!n.trainingEnabled,
      time: /^\d{2}:\d{2}$/.test(n.trainingTime ?? '') ? n.trainingTime! : '17:30',
      style: n.trainingStyle === 'vibrate' || n.trainingStyle === 'alert' ? n.trainingStyle : 'silent',
    };
  }
  const p = legacy.user?.profile;
  if (p) {
    state.profile.name = (p.displayName ?? '').trim();
    if (typeof p.bodyWeightKg === 'number' && p.bodyWeightKg > 0) state.profile.bodyWeightKg = p.bodyWeightKg;
    if (typeof p.heightCm === 'number' && p.heightCm > 0) state.profile.heightCm = p.heightCm;
    if (p.sex === 'male' || p.sex === 'female') state.profile.sex = p.sex;
  }
  if (legacy.bodyComp?.sex === 'male' || legacy.bodyComp?.sex === 'female') state.profile.sex = legacy.bodyComp.sex;

  state.splits = splits;
  state.sessions = sessions;
  state.customExercises = customExercises;
  state.legacyImportedAt = now.toISOString();
  return state;
}
