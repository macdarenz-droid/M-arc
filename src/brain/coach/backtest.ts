/**
 * Backtesting: replay the brain day by day over a history and check when
 * each finding and proposal fired. Two inputs: a real backup (no ground
 * truth, so it reports timing, noise and the recovery check) or a synthetic
 * history with planted events (ground truth, so it reports hits, misses and
 * false fires). This is calibration, not proof: one history is one person.
 */
import type { AppState, Effort, LoggedSet, Session, Split, Weekday } from '@/core/models';
import { WEEKDAYS, emptySchedule, newId } from '@/core/models';
import type { GoalId } from '@/data/goals';
import type { MuscleId } from '@/data/muscles';
import { addDays, daysBetween, parseDay, weekStart, weekdayOf } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { exerciseHistory } from '../history';
import type { BrainContext } from './context';
import type { Finding, FindingsReport, Proposal } from './contract';
import { buildReport } from './report';
import { adjustedRecovery } from './detectors/recovery';
import { RECOVERY_FLAG_PCT } from './bands';

// ---------------------------------------------------------------- synthetic

export interface PlantedEvent {
  label: string;
  /** Day range, inclusive, in which the first fire is expected. */
  from: string;
  to: string;
  /** True when this day's report shows the event. */
  test: (report: FindingsReport) => boolean;
}

export interface SyntheticHistory {
  sessions: Session[];
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  goal: GoalId;
  today: string;
  events: PlantedEvent[];
  /** Finding ids that would be false fires if they appear. */
  mustNotFire: Array<{ label: string; test: (f: Finding) => boolean }>;
}

const PUSH = ['lib_barbell_bench_press', 'lib_incline_dumbbell_press', 'lib_dumbbell_shoulder_press', 'lib_dumbbell_lateral_raise', 'lib_cable_fly', 'lib_triceps_pushdown'];
const PULL = ['lib_lat_pulldown', 'lib_seated_cable_row', 'lib_face_pull', 'lib_dumbbell_biceps_curl'];
const LEGS = ['lib_leg_press', 'lib_romanian_deadlift', 'lib_leg_extension', 'lib_seated_leg_curl', 'lib_standing_calf_raise'];

function mk(id: string, name: string, ids: string[]): Split {
  return { id, name, color: '#000', exercises: ids.map(e => ({ exerciseId: e, sets: 3 })), focus: [], createdAt: '2026-01-01T00:00:00.000Z' };
}

function timed(day: string, hour: number, minute: number, splitId: string, splitName: string, exercises: Array<{ id: string; sets: LoggedSet[] }>): Session {
  const d = parseDay(day);
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hour, minute, 0, 0);
  const end = new Date(start.getTime() + 55 * 60_000);
  return { id: newId('s'), splitId, splitName, day, startedAt: start.toISOString(), endedAt: end.toISOString(), durationSec: 3300, exercises: exercises.map(e => ({ exerciseId: e.id, name: findExercise(e.id)?.name ?? e.id, sets: e.sets })) };
}

const setsOf = (kg: number, reps: number, effort: Effort, n = 3): LoggedSet[] => Array.from({ length: n }, () => ({ kg, reps, effort }));

/** Steady double progression: a rep a week inside 8–11, then a load step. Never plateaus. */
function steady(week: number, baseKg: number, step: number): { kg: number; reps: number } {
  return { kg: baseKg + step * Math.floor((week - 1) / 4), reps: 8 + ((week - 1) % 4) };
}

/**
 * Thirty weeks of push/pull/legs with five planted stories:
 *  1. Bench: +2.5 kg every 3 weeks to week 13, flat weeks 14–23 (plateau),
 *     then slipping 1 kg a session at max effort weeks 24–28 (decline).
 *  2. Leg press: same shape, so two lifts decline together (deload signal).
 *  3. Chest volume: incline press and fly dropped in weeks 20–22.
 *  4. Habit: Mon/Wed/Fri 18:00 for weeks 1–20, then Tue/Thu/Sat 07:00.
 *  5. Everything else progresses steadily and must never plateau.
 */
export function synthesizeHistory(today = '2026-09-19', weeks = 30): SyntheticHistory {
  const currentMonday = weekStart(today);
  const mondayOf = (w: number) => addDays(currentMonday, -7 * (weeks - w));
  const dayOf = (w: number, wd: Weekday) => addDays(mondayOf(w), (WEEKDAYS.indexOf(wd) + 6) % 7);
  const splits = [mk('split_push', 'Push', PUSH), mk('split_pull', 'Pull', PULL), mk('split_legs', 'Legs', LEGS)];
  const sessions: Session[] = [];

  const bench = (w: number): { kg: number; effort: Effort } => {
    if (w <= 13) return { kg: 60 + 2.5 * Math.floor((w - 1) / 3), effort: 'ideal' };
    if (w <= 23) return { kg: 70, effort: 'ideal' };
    if (w <= 28) return { kg: 70 - (w - 23), effort: 'max' };
    return { kg: 65, effort: 'max' };
  };
  const legPress = (w: number): { kg: number; effort: Effort } => {
    if (w <= 13) return { kg: 100 + 5 * Math.floor((w - 1) / 3), effort: 'ideal' };
    if (w <= 23) return { kg: 120, effort: 'ideal' };
    if (w <= 28) return { kg: 120 - 2 * (w - 23), effort: 'max' };
    return { kg: 110, effort: 'max' };
  };

  for (let w = 1; w <= weeks; w++) {
    const morning = w >= 21;
    const days: Array<[Weekday, string]> = morning ? [['tue', 'split_push'], ['thu', 'split_pull'], ['sat', 'split_legs']] : [['mon', 'split_push'], ['wed', 'split_pull'], ['fri', 'split_legs']];
    const hour = morning ? 7 : 18;
    for (const [wd, splitId] of days) {
      const day = dayOf(w, wd);
      if (day > today) continue;
      let exercises: Array<{ id: string; sets: LoggedSet[] }> = [];
      if (splitId === 'split_push') {
        const b = bench(w);
        const s1 = steady(w, 20, 2), s2 = steady(w, 8, 1), s3 = steady(w, 15, 2.5), s4 = steady(w, 25, 2.5), fly = steady(w, 12, 2);
        exercises = [
          { id: 'lib_barbell_bench_press', sets: setsOf(b.kg, 8, b.effort) },
          ...(w >= 20 && w <= 22 ? [] : [{ id: 'lib_incline_dumbbell_press', sets: setsOf(s1.kg, s1.reps, 'ideal') }]),
          { id: 'lib_dumbbell_shoulder_press', sets: setsOf(s3.kg, s3.reps, 'ideal') },
          { id: 'lib_dumbbell_lateral_raise', sets: setsOf(s2.kg, s2.reps, 'ideal') },
          ...(w >= 20 && w <= 22 ? [] : [{ id: 'lib_cable_fly', sets: setsOf(fly.kg, fly.reps, 'ideal') }]),
          { id: 'lib_triceps_pushdown', sets: setsOf(s4.kg, s4.reps, 'ideal') },
        ];
      } else if (splitId === 'split_pull') {
        const a = steady(w, 50, 5), b2 = steady(w, 45, 5), c = steady(w, 15, 2.5), d = steady(w, 10, 1);
        exercises = [
          { id: 'lib_lat_pulldown', sets: setsOf(a.kg, a.reps, 'ideal') },
          { id: 'lib_seated_cable_row', sets: setsOf(b2.kg, b2.reps, 'ideal') },
          { id: 'lib_face_pull', sets: setsOf(c.kg, c.reps, 'ideal') },
          { id: 'lib_dumbbell_biceps_curl', sets: setsOf(d.kg, d.reps, 'ideal') },
        ];
      } else {
        const lp = legPress(w);
        const r = steady(w, 60, 5), e = steady(w, 40, 5), cu = steady(w, 35, 5), ca = steady(w, 40, 5);
        exercises = [
          { id: 'lib_leg_press', sets: setsOf(lp.kg, 8, lp.effort) },
          { id: 'lib_romanian_deadlift', sets: setsOf(r.kg, r.reps, 'ideal') },
          { id: 'lib_leg_extension', sets: setsOf(e.kg, e.reps, 'ideal') },
          { id: 'lib_seated_leg_curl', sets: setsOf(cu.kg, cu.reps, 'ideal') },
          { id: 'lib_standing_calf_raise', sets: setsOf(ca.kg, ca.reps, 'ideal') },
        ];
      }
      sessions.push(timed(day, hour, 0, splitId, splits.find(s => s.id === splitId)!.name, exercises));
    }
  }
  sessions.sort((a, b) => a.startedAt.localeCompare(b.startedAt));

  const range = (fromW: number, toW: number) => ({ from: mondayOf(fromW), to: addDays(mondayOf(toW), 6) });
  const has = (kind: string, id: string) => (r: FindingsReport) => r.findings.some(f => f.kind === kind && f.id === id);
  const events: PlantedEvent[] = [
    // Steps every 3 weeks → a stall needs 5 flat sessions (1.5×), so weeks 17–20.
    { label: 'Bench plateau (flat from week 13, usual step every 3)', ...range(17, 20), test: has('plateau', 'plateau:lib_barbell_bench_press') },
    { label: 'Leg press plateau (flat from week 13, usual step every 3)', ...range(17, 20), test: has('plateau', 'plateau:lib_leg_press') },
    // Two reduced weeks already cut the 3-week mean by 40%, so week 22 is fair.
    { label: 'Chest volume drop (weeks 20–22)', ...range(22, 24), test: has('volume_drop', 'volume_drop:chest') },
    // Two max-effort sessions out of the last three is a drift.
    { label: 'Bench effort climbing (max from week 24)', ...range(25, 27), test: has('effort_drift_harder', 'effort_drift_harder:lib_barbell_bench_press') },
    { label: 'Bench decline (slipping weeks 24–28)', ...range(27, 30), test: has('decline', 'decline:lib_barbell_bench_press') },
    { label: 'Leg press decline (slipping weeks 24–28)', ...range(27, 30), test: has('decline', 'decline:lib_leg_press') },
    { label: 'Easier week proposed (two declines + effort up)', ...range(27, 30), test: r => r.proposals.some(p => p.kind === 'deload_week') },
    { label: 'Habit learned as Mon/Wed/Fri', ...range(6, 9), test: r => r.findings.some(f => f.kind === 'habit_pattern' && f.metrics.days === 'mon,wed,fri') },
    { label: 'Old days retired after the shift to mornings', ...range(24, 27), test: r => r.findings.some(f => f.kind === 'habit_pattern' && String(f.metrics.retired).includes('mon')) },
    { label: 'Habit relearned as Tue/Thu/Sat', ...range(26, 30), test: r => r.findings.some(f => f.kind === 'habit_pattern' && f.metrics.days === 'tue,thu,sat') },
  ];
  const planted = new Set(['lib_barbell_bench_press', 'lib_leg_press']);
  const mustNotFire = [
    { label: 'Plateau on a lift that progresses steadily', test: (f: Finding) => f.kind === 'plateau' && !planted.has(f.subject.exerciseId ?? '') },
    { label: 'Decline on a lift that progresses steadily', test: (f: Finding) => f.kind === 'decline' && !planted.has(f.subject.exerciseId ?? '') },
    { label: 'Volume drop outside chest', test: (f: Finding) => f.kind === 'volume_drop' && f.subject.muscleGroup !== 'chest' },
    { label: 'Long gap (there is none)', test: (f: Finding) => f.kind === 'long_gap' },
  ];
  return { sessions, splits, schedule: emptySchedule(), goal: 'lean', today, events, mustNotFire };
}

// ------------------------------------------------------------------ replay

export interface HistoryInput {
  sessions: Session[];
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  custom?: AppState['customExercises'];
  goal: GoalId;
  restDefaultSec?: number;
  today: string;
}

export interface DaySnapshot { day: string; findings: Finding[]; proposals: Proposal[] }

export interface Replay {
  days: DaySnapshot[];
  firstFire: Map<string, { first: string; last: string; days: number; kind: string }>;
  firstProposal: Map<string, { first: string; last: string; days: number; kind: string }>;
}

function ctxFor(input: HistoryInput, day: string, now: number): BrainContext {
  return {
    sessions: input.sessions.filter(s => new Date(s.endedAt || s.startedAt).getTime() <= now),
    splits: input.splits, schedule: input.schedule, custom: input.custom ?? [], goal: input.goal, restDefaultSec: input.restDefaultSec ?? 90,
    health: { connected: false }, readiness: [], deload: null, today: day, now, dismissed: {}, accepted: {},
  };
}

/** Replay the report at the end of each day from `startDay` to today, every `step` days. */
export function replay(input: HistoryInput, opts: { step?: number; startDay?: string } = {}): Replay {
  const step = Math.max(1, opts.step ?? 1);
  const first = input.sessions[0]?.day ?? input.today;
  const start = opts.startDay ?? addDays(first, 14);
  const days: DaySnapshot[] = [];
  const firstFire = new Map<string, { first: string; last: string; days: number; kind: string }>();
  const firstProposal = new Map<string, { first: string; last: string; days: number; kind: string }>();
  for (let day = start; day <= input.today; day = addDays(day, step)) {
    const d = parseDay(day);
    const now = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 30, 0, 0).getTime();
    const r = buildReport(ctxFor(input, day, now));
    days.push({ day, findings: r.findings, proposals: r.proposals });
    for (const f of r.findings) {
      const e = firstFire.get(f.id);
      if (e) { e.last = day; e.days++; } else firstFire.set(f.id, { first: day, last: day, days: 1, kind: f.kind });
    }
    for (const p of r.proposals) {
      const e = firstProposal.get(p.id);
      if (e) { e.last = day; e.days++; } else firstProposal.set(p.id, { first: day, last: day, days: 1, kind: p.kind });
    }
  }
  return { days, firstFire, firstProposal };
}

// ---------------------------------------------------------------- analysis

export type Verdict = 'hit' | 'early' | 'late' | 'miss';

export interface EventResult { label: string; from: string; to: string; firstSeen: string | null; verdict: Verdict }

export function checkEvents(rep: Replay, events: PlantedEvent[]): EventResult[] {
  return events.map(ev => {
    const firstSeen = rep.days.find(d => ev.test({ version: 1, generatedAt: '', today: d.day, dataQuality: { sessions: 0, weeksOfData: 0, effortCoverage: 0, insufficientData: false }, findings: d.findings, proposals: d.proposals }))?.day ?? null;
    const verdict: Verdict = firstSeen == null ? 'miss' : firstSeen < ev.from ? 'early' : firstSeen > ev.to ? 'late' : 'hit';
    return { label: ev.label, from: ev.from, to: ev.to, firstSeen, verdict };
  });
}

export interface FalseFire { label: string; ids: string[]; days: number }

export function checkFalseFires(rep: Replay, rules: SyntheticHistory['mustNotFire']): FalseFire[] {
  return rules.map(rule => {
    const ids = new Set<string>();
    let days = 0;
    for (const d of rep.days) { const hits = d.findings.filter(rule.test); if (hits.length) { days++; hits.forEach(f => ids.add(f.id)); } }
    return { label: rule.label, ids: [...ids].sort(), days };
  });
}

export interface Noise {
  replayDays: number;
  findingsPerDay: number;
  proposalsPerDay: number;
  maxProposals: number;
  byFindingKind: Record<string, number>;
  byProposalKind: Record<string, number>;
  /** Proposals that disappeared and came back: id → number of returns. */
  flapping: Array<{ id: string; returns: number }>;
}

export function noise(rep: Replay): Noise {
  const byF: Record<string, number> = {}, byP: Record<string, number> = {};
  let f = 0, p = 0, maxP = 0;
  const seen = new Map<string, { present: boolean; returns: number }>();
  const daily = new Set(['today_plan', 'load_next']); // expire every day by design
  for (const d of rep.days) {
    f += d.findings.length; p += d.proposals.length; maxP = Math.max(maxP, d.proposals.length);
    for (const x of d.findings) byF[x.kind] = (byF[x.kind] ?? 0) + 1;
    const today = new Set(d.proposals.map(x => x.id));
    for (const x of d.proposals) {
      byP[x.kind] = (byP[x.kind] ?? 0) + 1;
      if (daily.has(x.kind)) continue;
      const s = seen.get(x.id);
      if (!s) seen.set(x.id, { present: true, returns: 0 });
      else if (!s.present) { s.present = true; s.returns++; }
    }
    for (const [id, s] of seen) if (!today.has(id)) s.present = false;
  }
  const n = Math.max(1, rep.days.length);
  return {
    replayDays: rep.days.length, findingsPerDay: Math.round((f / n) * 10) / 10, proposalsPerDay: Math.round((p / n) * 10) / 10, maxProposals: maxP,
    byFindingKind: byF, byProposalKind: byP,
    flapping: [...seen].filter(([, s]) => s.returns > 0).map(([id, s]) => ({ id, returns: s.returns })).sort((a, b) => b.returns - a.returns).slice(0, 10),
  };
}

export interface RecoveryCheck {
  /** Sessions where a trained muscle was under the flag threshold at the start. */
  underRecovered: { sessions: number; weaker: number };
  recovered: { sessions: number; weaker: number };
}

/**
 * Did sessions started on an under-recovered muscle come out weaker? A
 * session is "weaker" when the volume on the exercises that train that
 * muscle is under 95% of the median of the previous three sessions of the
 * same exercises. Needs a real history; synthetic ones have no response.
 */
export function recoveryCheck(input: HistoryInput): RecoveryCheck {
  const out: RecoveryCheck = { underRecovered: { sessions: 0, weaker: 0 }, recovered: { sessions: 0, weaker: 0 } };
  const custom = input.custom ?? [];
  for (const s of input.sessions) {
    const startMs = new Date(s.startedAt).getTime();
    const before = input.sessions.filter(x => new Date(x.endedAt || x.startedAt).getTime() < startMs);
    if (before.length < 4) continue;
    const rec = adjustedRecovery({ ...ctxFor({ ...input, sessions: before }, s.day, startMs), sessions: before });
    const pct = new Map<MuscleId, number>(rec.map(r => [r.muscle, r.adjustedPct]));
    let tired = false, ratioSum = 0, n = 0;
    for (const e of s.exercises) {
      const meta = findExercise(e.exerciseId, custom);
      const main = meta?.primary[0];
      if (!main) continue;
      const hist = exerciseHistory(before, e.exerciseId, custom).slice(-3);
      if (hist.length < 3) continue;
      const vol = e.sets.reduce((a, x) => a + ((x.kg ?? 0) > 0 ? (x.kg ?? 0) * (x.reps ?? 0) : (x.reps ?? 0)), 0);
      const med = [...hist.map(h => h.volume)].sort((a, b) => a - b)[1]!;
      if (med <= 0) continue;
      ratioSum += vol / med; n++;
      if ((pct.get(main) ?? 100) < RECOVERY_FLAG_PCT) tired = true;
    }
    if (!n) continue;
    const weaker = ratioSum / n < 0.95;
    const bucket = tired ? out.underRecovered : out.recovered;
    bucket.sessions++;
    if (weaker) bucket.weaker++;
  }
  return out;
}

export interface HabitCheck { learnedDays: string; scheduleDays: string; precision: number | null; recall: number | null }

/** Over the last eight weeks: how many learned days were trained, and how many training days were learned days. */
export function habitCheck(input: HistoryInput, finalReport: FindingsReport): HabitCheck {
  const habit = finalReport.findings.find(f => f.kind === 'habit_pattern');
  const learned = String(habit?.metrics.days ?? '').split(',').filter(Boolean) as Weekday[];
  const scheduled = WEEKDAYS.filter(d => input.schedule[d]);
  if (!learned.length) return { learnedDays: '', scheduleDays: scheduled.join(','), precision: null, recall: null };
  const from = addDays(weekStart(input.today), -7 * 8);
  const to = addDays(weekStart(input.today), -1);
  const trained = new Set(input.sessions.filter(s => s.day >= from && s.day <= to).map(s => s.day));
  let learnedSlots = 0, learnedTrained = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) {
    if (!learned.includes(weekdayOf(d))) continue;
    learnedSlots++;
    if (trained.has(d)) learnedTrained++;
  }
  const trainedOnLearned = [...trained].filter(d => learned.includes(weekdayOf(d))).length;
  return {
    learnedDays: learned.join(','), scheduleDays: scheduled.join(','),
    precision: learnedSlots ? Math.round((learnedTrained / learnedSlots) * 100) / 100 : null,
    recall: trained.size ? Math.round((trainedOnLearned / trained.size) * 100) / 100 : null,
  };
}

// ----------------------------------------------------------------- report

export interface BacktestReport {
  source: string;
  sessions: number;
  firstDay: string;
  lastDay: string;
  weeks: number;
  replay: Replay;
  events: EventResult[];
  falseFires: FalseFire[];
  noise: Noise;
  recovery: RecoveryCheck;
  habit: HabitCheck;
  finalReport: FindingsReport;
}

export function runBacktest(input: HistoryInput, opts: { source: string; step?: number; events?: PlantedEvent[]; mustNotFire?: SyntheticHistory['mustNotFire'] }): BacktestReport {
  const rep = replay(input, { step: opts.step ?? 1 });
  const last = input.sessions[input.sessions.length - 1]?.day ?? input.today;
  const first = input.sessions[0]?.day ?? input.today;
  const d = parseDay(input.today);
  const finalReport = buildReport(ctxFor(input, input.today, new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 30).getTime()));
  return {
    source: opts.source, sessions: input.sessions.length, firstDay: first, lastDay: last, weeks: Math.ceil((daysBetween(first, input.today) + 1) / 7),
    replay: rep, events: opts.events ? checkEvents(rep, opts.events) : [], falseFires: opts.mustNotFire ? checkFalseFires(rep, opts.mustNotFire) : [],
    noise: noise(rep), recovery: recoveryCheck(input), habit: habitCheck(input, finalReport), finalReport,
  };
}

export function renderMarkdown(r: BacktestReport): string {
  const lines: string[] = [];
  lines.push(`# Backtest: ${r.source}`, '', '_Generated by `npm run backtest`. Regenerate rather than edit._', '');
  lines.push(`${r.sessions} sessions from ${r.firstDay} to ${r.lastDay} (${r.weeks} weeks), replayed on ${r.noise.replayDays} days. This is calibration on one history, not proof.`, '');
  if (r.events.length) {
    lines.push('## Planted events', '', '| Event | Expected window | First seen | Verdict |', '|---|---|---|---|');
    for (const e of r.events) lines.push(`| ${e.label} | ${e.from} → ${e.to} | ${e.firstSeen ?? 'never'} | **${e.verdict.toUpperCase()}** |`);
    const hits = r.events.filter(e => e.verdict === 'hit').length;
    lines.push('', `${hits} of ${r.events.length} planted events fired inside their window.`, '');
  }
  if (r.falseFires.length) {
    lines.push('## Findings that must not fire', '', '| Rule | Days it fired | Ids |', '|---|---|---|');
    for (const f of r.falseFires) lines.push(`| ${f.label} | ${f.days} | ${f.ids.join(', ') || 'none'} |`);
    lines.push('');
  }
  lines.push('## Noise', '', `Average ${r.noise.findingsPerDay} findings and ${r.noise.proposalsPerDay} proposals per replayed day; at most ${r.noise.maxProposals} proposals on one day.`, '');
  lines.push('| Finding kind | Days present |', '|---|---|');
  for (const [k, v] of Object.entries(r.noise.byFindingKind).sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${v} |`);
  lines.push('', '| Proposal kind | Days present |', '|---|---|');
  for (const [k, v] of Object.entries(r.noise.byProposalKind).sort((a, b) => b[1] - a[1])) lines.push(`| ${k} | ${v} |`);
  lines.push('');
  if (r.noise.flapping.length) {
    lines.push('Proposals that disappeared and came back:', '');
    for (const f of r.noise.flapping) lines.push(`- ${f.id}: ${f.returns} return${f.returns === 1 ? '' : 's'}`);
    lines.push('');
  } else lines.push('No proposal flapped on and off.', '');
  lines.push('## Recovery check', '');
  const u = r.recovery.underRecovered, ok = r.recovery.recovered;
  if (u.sessions === 0) lines.push('No session started on an under-recovered muscle, so there is nothing to compare. (Synthetic histories have no performance response to recovery.)', '');
  else lines.push(`Sessions started with a trained muscle under ${RECOVERY_FLAG_PCT}% recovered: ${u.sessions}, of which ${u.weaker} came out weaker (${Math.round((u.weaker / u.sessions) * 100)}%). Sessions on recovered muscles: ${ok.sessions}, of which ${ok.weaker} weaker (${ok.sessions ? Math.round((ok.weaker / ok.sessions) * 100) : 0}%).`, '');
  lines.push('## Habit check (last eight weeks)', '');
  if (!r.habit.learnedDays) lines.push('No habit learned yet.', '');
  else lines.push(`Learned days: ${r.habit.learnedDays}${r.habit.scheduleDays ? ` (schedule: ${r.habit.scheduleDays})` : ''}. Of the learned day-slots, ${Math.round((r.habit.precision ?? 0) * 100)}% were trained; of the days trained, ${Math.round((r.habit.recall ?? 0) * 100)}% fell on learned days.`, '');
  lines.push('## First fire per finding', '', '| Finding | First | Last | Days |', '|---|---|---|---|');
  for (const [id, e] of [...r.replay.firstFire].sort((a, b) => a[1].first.localeCompare(b[1].first))) lines.push(`| ${id} | ${e.first} | ${e.last} | ${e.days} |`);
  lines.push('');
  return lines.join('\n');
}
