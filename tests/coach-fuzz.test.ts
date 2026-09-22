/**
 * A senior-QA-style fuzz pass: 50 varied synthetic "users" run through the
 * whole deterministic brain (buildReport -> insightsFrom/suggestionsFrom),
 * the same pipeline the real Coach tab runs on every visit. Real detectors
 * and planners run behind `safe()` in report.ts, so a bad one can't crash
 * the report — but `adjustedRecovery`, `learnHabits` and `usageProfile` in
 * buildReport() run unguarded before that, so this is exactly where an
 * edge-case input (empty history, one-off huge session, a schedule with no
 * days, a clock that's behind the last logged session) could still take
 * the whole Coach tab down. Every persona also gets its report turned into
 * actual on-screen copy via `insightsFrom`/`suggestionsFrom`, and every
 * string field is checked for the tell-tale signs of a formatting bug
 * (a literal "NaN", "undefined", "null" or "[object Object]" leaking onto
 * the screen) rather than just "did it throw".
 */
import { describe, expect, it } from 'vitest';
import { buildReport } from '@/brain/coach/report';
import { insightsFrom, suggestionsFrom, shortlist, type Insight, type RenderContext, type Suggestion } from '@/brain/coach/words';
import { reportNumbers, type FindingsReport } from '@/brain/coach/contract';
import type { BrainContext } from '@/brain/coach/context';
import type { Effort, LoggedSet, NoteFlag, Session, Split } from '@/core/models';
import { WEEKDAYS, newId } from '@/core/models';
import { addDays } from '@/core/dates';
import type { GoalId } from '@/data/goals';

// mulberry32 — small, fast, seedable PRNG so a failing persona is reproducible.
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EXERCISE_IDS = [
  'lib_barbell_bench_press', 'lib_dumbbell_bench_press', 'lib_machine_chest_press', 'lib_barbell_back_squat',
  'lib_barbell_deadlift', 'lib_pull_up', 'lib_barbell_row', 'lib_overhead_press', 'lib_lat_pulldown',
  'lib_leg_press', 'lib_dumbbell_curl', 'lib_triceps_pushdown', 'lib_leg_curl', 'lib_leg_extension',
  'lib_calf_raise', 'lib_plank', 'lib_hip_thrust', 'lib_lateral_raise',
];

const GOALS: GoalId[] = ['lean', 'growth', 'strength_muscle', 'strength'];
const EFFORTS: Array<Effort | undefined> = ['easy', 'ideal', 'max', undefined];
const NOTE_FLAG_KINDS: NoteFlag['kind'][] = ['pain_or_discomfort', 'equipment_issue', 'fatigue', 'schedule', 'form_check', 'positive'];

interface PersonaSpec {
  label: string;
  days: number;
  sessionsPerWeek: number; // target, not guaranteed
  splitCount: number;
  exercisesPerSession: [number, number];
  setsPerExercise: [number, number];
  kgRange: [number, number];
  repRange: [number, number];
  effortCoverage: number; // 0..1 chance a set has an effort rating
  noteChance: number; // 0..1 chance a session has a note + flags
  readinessCoverage: number; // 0..1 chance a day has a readiness entry
  goal: GoalId;
  trend: 'flat' | 'up' | 'down' | 'volatile';
  scheduleGaps: boolean; // leave some weekdays unscheduled
  dismissEverything: boolean;
}

function makeSplits(rand: () => number, count: number): Split[] {
  const pool = [...EXERCISE_IDS];
  return Array.from({ length: count }, (_, i) => {
    const n = 3 + Math.floor(rand() * 5);
    const exercises = Array.from({ length: n }, () => ({ exerciseId: pool[Math.floor(rand() * pool.length)]!, sets: 2 + Math.floor(rand() * 4) }));
    return { id: `split_${i}`, name: `Split ${i}`, color: '#8888ff', exercises, focus: [], createdAt: '2026-01-01T00:00:00.000Z' } satisfies Split;
  });
}

function makeSession(day: string, splits: Split[], spec: PersonaSpec, rand: () => number, weekIndex: number): Session {
  const split = splits[Math.floor(rand() * splits.length)] ?? splits[0]!;
  const [minEx, maxEx] = spec.exercisesPerSession;
  const exCount = Math.max(0, minEx + Math.floor(rand() * (maxEx - minEx + 1)));
  const exercises = Array.from({ length: exCount }, () => {
    const id = EXERCISE_IDS[Math.floor(rand() * EXERCISE_IDS.length)]!;
    const [minSets, maxSets] = spec.setsPerExercise;
    const setCount = Math.max(0, minSets + Math.floor(rand() * (maxSets - minSets + 1)));
    const [kgLo, kgHi] = spec.kgRange;
    const [repLo, repHi] = spec.repRange;
    let base = kgLo + rand() * (kgHi - kgLo);
    const sets: LoggedSet[] = Array.from({ length: setCount }, () => {
      const drift = spec.trend === 'up' ? weekIndex * 0.15 : spec.trend === 'down' ? -weekIndex * 0.1 : spec.trend === 'volatile' ? (rand() - 0.5) * kgHi * 0.4 : 0;
      const kg = Math.max(0, Math.round((base + drift) * 2) / 2);
      const reps = Math.max(0, Math.round(repLo + rand() * (repHi - repLo)));
      const effort = rand() < spec.effortCoverage ? EFFORTS[Math.floor(rand() * (EFFORTS.length - 1))] : undefined;
      return effort ? { kg, reps, effort } : { kg, reps };
    });
    return { exerciseId: id, name: id, sets };
  });
  const hasNote = rand() < spec.noteChance;
  const noteFlags: NoteFlag[] | undefined = hasNote
    ? Array.from({ length: 1 + Math.floor(rand() * 2) }, () => ({ kind: NOTE_FLAG_KINDS[Math.floor(rand() * NOTE_FLAG_KINDS.length)]!, muscle: rand() < 0.5 ? null : 'chest' }))
    : undefined;
  return {
    id: newId('s'), splitId: split.id, splitName: split.name, day,
    startedAt: `${day}T${String(6 + Math.floor(rand() * 14)).padStart(2, '0')}:00:00.000Z`,
    endedAt: `${day}T${String(7 + Math.floor(rand() * 14)).padStart(2, '0')}:00:00.000Z`,
    durationSec: 900 + Math.floor(rand() * 5400),
    exercises,
    note: hasNote ? 'Felt something in the joint today 🏋️ — logged for the record. '.repeat(1 + Math.floor(rand() * 8)) : undefined,
    noteFlags,
  } satisfies Session;
}

function buildPersonaContext(spec: PersonaSpec, seed: number, today: string): BrainContext {
  const rand = rng(seed);
  const splits = spec.splitCount > 0 ? makeSplits(rand, spec.splitCount) : [];
  const sessions: Session[] = [];
  const start = addDays(today, -spec.days);
  for (let d = 0; d < spec.days; d++) {
    const day = addDays(start, d);
    const weekIndex = Math.floor(d / 7);
    const p = spec.sessionsPerWeek / 7;
    if (splits.length && rand() < p) sessions.push(makeSession(day, splits, spec, rand, weekIndex));
    // Occasionally plant a same-day double session (AM/PM), a real thing users do.
    if (splits.length && rand() < p * 0.05) sessions.push(makeSession(day, splits, spec, rand, weekIndex));
  }
  const schedule: Record<string, string | null> = {};
  for (const wd of WEEKDAYS) schedule[wd] = spec.scheduleGaps && rand() < 0.4 ? null : (splits[Math.floor(rand() * Math.max(1, splits.length))]?.id ?? null);
  const readiness = [];
  for (let d = 0; d < spec.days; d++) {
    const day = addDays(start, d);
    if (rand() < spec.readinessCoverage) {
      readiness.push({ day, sleep: (1 + Math.floor(rand() * 5)) as 1 | 2 | 3 | 4 | 5, soreness: (1 + Math.floor(rand() * 5)) as 1 | 2 | 3 | 4 | 5, stress: (1 + Math.floor(rand() * 5)) as 1 | 2 | 3 | 4 | 5 });
    }
  }
  const dismissed: Record<string, number> = {};
  const accepted: Record<string, string> = {};
  if (spec.dismissEverything) {
    for (const k of ['today_plan:*', 'schedule:*', 'deload_week:*', 'exercise_swap:chest', 'add_exercise:back', 'rest_default:*']) dismissed[k] = 2;
  }
  return {
    sessions, splits, schedule: schedule as BrainContext['schedule'], custom: [], goal: spec.goal, restDefaultSec: 90,
    health: { connected: rand() < 0.5, sleepMinutes: rand() < 0.7 ? Math.floor(rand() * 600) : undefined },
    readiness, deload: null, today, now: new Date(`${today}T12:00:00.000Z`).getTime(), dismissed, accepted,
  };
}

const BASE: PersonaSpec = {
  label: 'base', days: 90, sessionsPerWeek: 3, splitCount: 3, exercisesPerSession: [3, 6], setsPerExercise: [2, 4],
  kgRange: [20, 80], repRange: [5, 12], effortCoverage: 0.7, noteChance: 0.05, readinessCoverage: 0.3, goal: 'lean', trend: 'flat',
  scheduleGaps: false, dismissEverything: false,
};

function persona(overrides: Partial<PersonaSpec>): PersonaSpec {
  return { ...BASE, ...overrides };
}

const PERSONAS: PersonaSpec[] = [
  persona({ label: 'brand-new user, zero sessions', days: 30, sessionsPerWeek: 0, splitCount: 1 }),
  persona({ label: 'brand-new user, no splits at all', days: 10, sessionsPerWeek: 3, splitCount: 0 }),
  persona({ label: 'single session ever', days: 400, sessionsPerWeek: 0.02 }),
  persona({ label: 'exactly at first-sessions threshold', days: 14, sessionsPerWeek: 7, splitCount: 1 }),
  persona({ label: 'veteran, 3 years, steady', days: 365 * 3, sessionsPerWeek: 4, splitCount: 4 }),
  persona({ label: 'veteran, huge volume', days: 365, sessionsPerWeek: 6, exercisesPerSession: [8, 12], setsPerExercise: [4, 8] }),
  persona({ label: 'ultra-consistent daily lifter', days: 200, sessionsPerWeek: 7, splitCount: 2 }),
  persona({ label: 'erratic, long gaps', days: 300, sessionsPerWeek: 1.2 }),
  persona({ label: 'binge then vanish', days: 200, sessionsPerWeek: 5 }),
  persona({ label: 'never rates effort', days: 120, effortCoverage: 0 }),
  persona({ label: 'always rates effort', days: 120, effortCoverage: 1 }),
  persona({ label: 'never logs a note', days: 120, noteChance: 0 }),
  persona({ label: 'injury-prone, frequent pain notes', days: 150, noteChance: 0.6 }),
  persona({ label: 'never checks in readiness', days: 150, readinessCoverage: 0 }),
  persona({ label: 'daily readiness check-in', days: 150, readinessCoverage: 1 }),
  persona({ label: 'no schedule at all (rest days only)', days: 90, scheduleGaps: true }),
  persona({ label: 'zero-kg bodyweight-only lifter', days: 100, kgRange: [0, 0], repRange: [8, 25] }),
  persona({ label: 'extremely heavy lifter (data entry realism check)', days: 100, kgRange: [200, 400] }),
  persona({ label: 'ultra-high reps, conditioning style', days: 100, repRange: [20, 60] }),
  persona({ label: 'one rep max singles only', days: 100, repRange: [1, 1], kgRange: [100, 220] }),
  persona({ label: 'strong upward trend (constant PRs)', days: 150, trend: 'up' }),
  persona({ label: 'strong downward trend (declining)', days: 150, trend: 'down' }),
  persona({ label: 'volatile, no consistent trend', days: 150, trend: 'volatile' }),
  persona({ label: 'goal: growth', days: 120, goal: 'growth' }),
  persona({ label: 'goal: strength_muscle', days: 120, goal: 'strength_muscle' }),
  persona({ label: 'goal: strength', days: 120, goal: 'strength' }),
  persona({ label: 'max splits (7)', days: 150, splitCount: 7 }),
  persona({ label: 'single split only', days: 150, splitCount: 1 }),
  persona({ label: 'huge single-session exercise count', days: 60, exercisesPerSession: [15, 20], setsPerExercise: [1, 2] }),
  persona({ label: 'zero-set exercises logged (started, abandoned)', days: 60, setsPerExercise: [0, 0] }),
  persona({ label: 'everything already dismissed twice', days: 150, dismissEverything: true }),
  persona({ label: 'health connected, full data', days: 90 }),
  persona({ label: 'AM/PM double sessions common', days: 90, sessionsPerWeek: 5 }),
  persona({ label: 'sparse but very long history (2 sessions/month for 2 years)', days: 730, sessionsPerWeek: 0.5 }),
  persona({ label: 'unicode/emoji-heavy notes', days: 90, noteChance: 0.8 }),
  persona({ label: 'low effort coverage, high volume', days: 150, effortCoverage: 0.1, exercisesPerSession: [6, 10] }),
  persona({ label: 'lean goal, low volume minimalist', days: 150, exercisesPerSession: [1, 2], setsPerExercise: [1, 2] }),
  persona({ label: 'exactly two weeks of data (insufficient-data boundary)', days: 14, sessionsPerWeek: 3 }),
  persona({ label: 'exactly one day short of two weeks', days: 13, sessionsPerWeek: 7 }),
  persona({ label: 'schedule with every day the same split', days: 90, splitCount: 1, scheduleGaps: false }),
  persona({ label: 'huge history, high effort variety, mixed trend', days: 500, trend: 'volatile', exercisesPerSession: [5, 9] }),
];
// Pad up to 50 with randomized mid-range personas covering the same axes differently.
for (let i = PERSONAS.length; i < 50; i++) {
  PERSONAS.push(persona({
    label: `random mid-range #${i}`,
    days: 30 + (i * 37) % 500,
    sessionsPerWeek: 0.5 + ((i * 13) % 65) / 10,
    splitCount: 1 + (i % 7),
    exercisesPerSession: [1 + (i % 4), 4 + (i % 10)],
    setsPerExercise: [1 + (i % 3), 2 + (i % 6)],
    kgRange: [0, 20 + (i * 17) % 300],
    repRange: [1, 3 + (i % 30)],
    effortCoverage: ((i * 7) % 11) / 10,
    noteChance: ((i * 3) % 10) / 10,
    readinessCoverage: ((i * 5) % 10) / 10,
    goal: GOALS[i % GOALS.length]!,
    trend: (['flat', 'up', 'down', 'volatile'] as const)[i % 4],
    scheduleGaps: i % 3 === 0,
    dismissEverything: i % 9 === 0,
  }));
}

const RENDER_CTX_BASE: Omit<RenderContext, 'splits' | 'goal'> = { unit: 'kg', custom: [], today: '2026-09-20' };

const BAD_TOKENS = ['NaN', 'undefined', 'null', '[object Object]', 'Invalid Date'];

function assertClean(strings: string[], where: string): void {
  for (const s of strings) {
    for (const tok of BAD_TOKENS) {
      expect(s.includes(tok), `${where} produced a "${tok}" leak: ${JSON.stringify(s)}`).toBe(false);
    }
  }
}

describe('adversarial edge cases the persona generator above cannot reach on its own', () => {
  const today = '2026-09-20';

  it('a session logged with a future day (clock skew / bad import) does not crash or produce non-finite recovery numbers', () => {
    const splits = makeSplits(rng(1), 2);
    const future = addDays(today, 5);
    const sessions: Session[] = [
      { id: newId('s'), splitId: splits[0]!.id, splitName: splits[0]!.name, day: future, startedAt: `${future}T10:00:00.000Z`, endedAt: `${future}T11:00:00.000Z`, durationSec: 3600, exercises: [{ exerciseId: EXERCISE_IDS[0]!, name: 'x', sets: [{ kg: 60, reps: 8, effort: 'ideal' }] }] },
    ];
    const ctx: BrainContext = {
      sessions, splits, schedule: Object.fromEntries(WEEKDAYS.map(d => [d, splits[0]!.id])) as BrainContext['schedule'],
      custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], deload: null, today, now: new Date(`${today}T12:00:00.000Z`).getTime(), dismissed: {}, accepted: {},
    };
    let report;
    expect(() => { report = buildReport(ctx); }).not.toThrow();
    for (const n of reportNumbers(report!)) expect(Number.isFinite(n)).toBe(true);
  });

  it('many sessions piled on a single day does not crash or misreport dataQuality', () => {
    const splits = makeSplits(rng(2), 1);
    const sessions: Session[] = Array.from({ length: 12 }, () =>
      ({ id: newId('s'), splitId: splits[0]!.id, splitName: splits[0]!.name, day: today, startedAt: `${today}T10:00:00.000Z`, endedAt: `${today}T11:00:00.000Z`, durationSec: 1800, exercises: [{ exerciseId: EXERCISE_IDS[0]!, name: 'x', sets: [{ kg: 40, reps: 10, effort: 'ideal' }] }] }));
    const ctx: BrainContext = {
      sessions, splits, schedule: Object.fromEntries(WEEKDAYS.map(d => [d, splits[0]!.id])) as BrainContext['schedule'],
      custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], deload: null, today, now: new Date(`${today}T20:00:00.000Z`).getTime(), dismissed: {}, accepted: {},
    };
    let report;
    expect(() => { report = buildReport(ctx); }).not.toThrow();
    expect(report!.dataQuality.sessions).toBe(12);
  });

  it('sets with no kg/reps at all (duration/conditioning-style logging) do not crash the report or leak NaN', () => {
    const splits = makeSplits(rng(3), 1);
    const start = addDays(today, -60);
    const sessions: Session[] = Array.from({ length: 20 }, (_, i) => {
      const day = addDays(start, i * 3);
      return { id: newId('s'), splitId: splits[0]!.id, splitName: splits[0]!.name, day, startedAt: `${day}T10:00:00.000Z`, endedAt: `${day}T11:00:00.000Z`, durationSec: 1800, exercises: [{ exerciseId: 'lib_plank', name: 'Plank', sets: [{ durationSec: 60 + i }, { durationSec: 45 }] }] };
    });
    const ctx: BrainContext = {
      sessions, splits, schedule: Object.fromEntries(WEEKDAYS.map(d => [d, splits[0]!.id])) as BrainContext['schedule'],
      custom: [], goal: 'lean', restDefaultSec: 90, health: { connected: false }, readiness: [], deload: null, today, now: new Date(`${today}T20:00:00.000Z`).getTime(), dismissed: {}, accepted: {},
    };
    let report;
    expect(() => { report = buildReport(ctx); }).not.toThrow();
    for (const n of reportNumbers(report!)) expect(Number.isFinite(n)).toBe(true);
    const renderCtx: RenderContext = { ...RENDER_CTX_BASE, splits: ctx.splits, goal: ctx.goal, today };
    let insights;
    expect(() => { insights = insightsFrom(report!, renderCtx); }).not.toThrow();
    for (const ins of insights!) assertClean([ins.title, ins.noticed, ins.means, ins.action], 'duration-only persona');
  });
});

describe('50-persona fuzz simulation through the full coach pipeline', () => {
  const today = '2026-09-20';

  it.each(PERSONAS.map((spec, i) => ({ spec, i })))('persona $i: $spec.label', ({ spec, i }) => {
    const ctx = buildPersonaContext(spec, 1000 + i, today);

    let report!: FindingsReport;
    expect(() => { report = buildReport(ctx); }).not.toThrow();

    // Every number that ever reaches the words layer must be finite — a NaN
    // or Infinity here means it will render as literal text somewhere.
    for (const n of reportNumbers(report)) {
      expect(Number.isFinite(n), `${spec.label}: a non-finite number reached reportNumbers()`).toBe(true);
    }

    const renderCtx: RenderContext = { ...RENDER_CTX_BASE, splits: ctx.splits, goal: ctx.goal, today };

    let insights!: Insight[], suggestions!: Suggestion[];
    expect(() => { insights = insightsFrom(report, renderCtx); }).not.toThrow();
    expect(() => { suggestions = suggestionsFrom(report, { snoozedUntil: {} }, renderCtx); }).not.toThrow();

    for (const ins of insights) assertClean([ins.title, ins.noticed, ins.means, ins.action], `${spec.label} insight ${ins.id}`);
    for (const sg of suggestions) assertClean([sg.title, sg.summary, ...sg.why, ...sg.changes], `${spec.label} suggestion ${sg.id}`);

    // shortlist must never throw and must never exceed its own stated caps.
    let short!: Insight[];
    expect(() => { short = shortlist(insights); }).not.toThrow();
    expect(short.length).toBeLessThanOrEqual(6);

    // Proposals must only reference findings that actually exist in this report.
    const findingIds = new Set(report.findings.map(f => f.id));
    for (const p of report.proposals) {
      for (const basis of p.basedOn) {
        expect(findingIds.has(basis), `${spec.label}: proposal ${p.id} cites missing finding ${basis}`).toBe(true);
      }
    }

    // dataQuality must always be internally sane regardless of how strange the input was.
    expect(report.dataQuality.sessions).toBe(ctx.sessions.length);
    expect(report.dataQuality.weeksOfData).toBeGreaterThanOrEqual(0);
    expect(report.dataQuality.effortCoverage).toBeGreaterThanOrEqual(0);
    expect(report.dataQuality.effortCoverage).toBeLessThanOrEqual(1);
  });

  it('every persona builds its report in reasonable time (no accidental O(n^2)+ blowup)', () => {
    for (const [i, spec] of PERSONAS.entries()) {
      const ctx = buildPersonaContext(spec, 2000 + i, today);
      const start = performance.now();
      buildReport(ctx);
      const ms = performance.now() - start;
      expect(ms, `${spec.label} took ${ms.toFixed(0)}ms`).toBeLessThan(2000);
    }
  });
});
