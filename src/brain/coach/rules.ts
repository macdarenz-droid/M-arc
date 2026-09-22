/**
 * The coach's rules, as data. Each rule looks at the same context and either
 * returns an insight or nothing. Priority decides what is shown first.
 * Copy is plain words: what we noticed, what it means, what to do.
 *
 * To add a rule: append one object. To change the words: edit the strings.
 */
import type { CheckIn, DailyHealth, Exercise, FreshMark, Profile, ProfileChange, RecoveryModel, Session, Split, Weekday } from '@/core/models';
import { muscleLabel, type MuscleId } from '@/data/muscles';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';
import { formatHours, weekdayOf } from '@/core/dates';
import { recoveryStatus, type MuscleRecovery } from '../recovery';
import { exerciseHistory } from '../history';
import { plateauStatus } from '../trend';
import { effortDrift } from '../effort';
import { trainingBalance } from '../balance';
import { weekSummary, daysSinceLastSession } from '../weekly';
import { weeklyMuscleSets } from '../exposure';
import { findExercise } from '@/core/exercises';
import { e1rmTrend, failureShare, hardSetsThisWeek, isStale } from './weeklyReview';
import { effortBiasByLabel, rirObservations } from '../effortBias';

export type Category = 'recovery' | 'progress' | 'readiness' | 'balance' | 'focus' | 'consistency' | 'data';

export interface Insight {
  id: string;
  category: Category;
  priority: number;
  title: string;
  noticed: string;
  means: string;
  action: string;
  /** Optional link to an exercise or muscle for the UI. */
  exerciseId?: string;
  muscle?: MuscleId;
  /** 6.12.4: drives colour and where an insight may appear. Rules built before this stayed 'tip'/'now' implicitly; only new rules populate it. */
  kind?: 'alert' | 'progress' | 'plan' | 'praise' | 'tip' | 'data';
  cadence?: 'now' | 'pre' | 'live' | 'post' | 'weekly';
  evidence?: { n: number; window: string; confidence: 'low' | 'medium' | 'high' };
  numbers?: Array<{ label: string; value: string }>;
  drivers?: string[];
  unlocks?: string;
  validUntil?: string;
}

export interface CoachContext {
  sessions: Session[];
  splits: Split[];
  schedule: Record<Weekday, string | null>;
  custom: Exercise[];
  today: string;
  now: number;
  profileHistory: ProfileChange[];
  profile: Profile;
  healthDays: DailyHealth[];
  checkIns: CheckIn[];
  freshMarks: FreshMark[];
  recoveryModel: RecoveryModel;
}

interface Derived {
  recovery: MuscleRecovery[];
  exerciseIds: Array<{ id: string; name: string }>;
}

function derive(ctx: CoachContext): Derived {
  const names = new Map<string, string>();
  for (const s of [...ctx.sessions].reverse()) for (const e of s.exercises) if (!names.has(e.exerciseId)) names.set(e.exerciseId, e.name);
  return {
    recovery: recoveryStatus({ sessions: ctx.sessions, custom: ctx.custom, now: ctx.now, profile: ctx.profile, healthDays: ctx.healthDays, checkIns: ctx.checkIns, freshMarks: ctx.freshMarks, recoveryModel: ctx.recoveryModel }),
    exerciseIds: [...names].map(([id, name]) => ({ id, name })),
  };
}

export const CATEGORY_LABEL: Record<Category, string> = {
  recovery: 'Recovery',
  progress: 'Progress',
  readiness: 'Readiness',
  balance: 'Training balance',
  focus: 'Focus muscle',
  consistency: 'Consistency',
  data: 'Training data',
};

type Rule = { id: string; run: (ctx: CoachContext, d: Derived) => Insight[] };

export const RULES: Rule[] = [
  {
    id: 'recovery.still-recovering',
    run: (ctx, d) => {
      return d.recovery
        .filter(r => r.recovering && r.pct < 60 && r.personalized)
        .slice(0, 1)
        .map(r => ({
          id: `recovery:${r.muscle}`,
          category: 'recovery',
          priority: 400,
          title: `${muscleLabel(r.muscle)} still recovering`,
          noticed: `Your ${muscleLabel(r.muscle).toLowerCase()} is about ${r.pct}% recovered, about ${formatHours(r.hoursLeft)} to go.`,
          means: 'Your own history shows you perform worse when you train this muscle again too soon.',
          action: 'Give it more time, or train something that is fully recovered today.',
          muscle: r.muscle,
        }));
    },
  },
  {
    id: 'recovery.scheduled-conflict',
    run: (ctx, d) => {
      const split = ctx.splits.find(s => s.id === ctx.schedule[weekdayOf(ctx.today)]);
      if (!split) return [];
      const primaryMuscles = new Set<MuscleId>();
      for (const se of split.exercises) findExercise(se.exerciseId, ctx.custom)?.primary.forEach(m => primaryMuscles.add(m));
      const worst = d.recovery.filter(r => primaryMuscles.has(r.muscle) && !r.ready).sort((a, b) => a.pct - b.pct)[0];
      if (!worst) return [];
      const firm = worst.pct < 60;
      return [{
        id: `scheduled-conflict:${split.id}:${worst.muscle}`,
        category: 'recovery', priority: firm ? 380 : 340,
        title: `${split.name} today, but ${muscleLabel(worst.muscle).toLowerCase()} is only ${worst.pct}% recovered`,
        noticed: `${split.name} is scheduled today and works ${muscleLabel(worst.muscle).toLowerCase()} directly. It is about ${worst.pct}% recovered.`,
        means: firm ? 'Training this hard right now works against the muscle you are trying to build.' : 'You can still train productively at this level; the hardest sets just will not be at their best.',
        action: firm ? `Swap to another split today, or keep ${split.name} light and put the hard sets elsewhere.` : `Reorder ${split.name} so this muscle comes later, or go a little lighter on it today.`,
        muscle: worst.muscle,
      }];
    },
  },
  {
    id: 'progress.declining',
    run: (ctx, d) =>
      d.exerciseIds.flatMap(({ id, name }) => {
        const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
        const p = plateauStatus(hist);
        if (p.status !== 'declining' || p.confidence === 'low') return [];
        return [{
          id: `decline:${id}`, category: 'progress' as const, priority: 320,
          title: `${name}: progress has slipped`,
          noticed: `Your recent ${name} sessions trend downward.`,
          means: 'A short easier stretch usually helps more than pushing through.',
          action: 'Keep the load, stop short of max effort for a week, then build back up.',
          exerciseId: id,
        }];
      }),
  },
  {
    id: 'progress.plateau',
    run: (ctx, d) =>
      d.exerciseIds.flatMap(({ id, name }) => {
        const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
        const p = plateauStatus(hist);
        if (p.status !== 'plateaued' || p.confidence === 'low') return [];
        return [{
          id: `plateau:${id}`, category: 'progress' as const, priority: 300,
          title: `${name}: progress has stalled`,
          noticed: `${name} has not moved over your last eight sessions.`,
          means: 'The same load and reps for weeks means the stimulus stopped changing.',
          action: 'Try a different rep range for two weeks, or one lighter week, then return.',
          exerciseId: id,
        }];
      }),
  },
  {
    id: 'balance.imbalance',
    run: ctx => {
      const focus = ctx.splits.flatMap(s => s.focus);
      const b = trainingBalance(ctx.sessions, ctx.today, ctx.custom, focus);
      if (!b) return [];
      return [{
        id: `balance:${b.pair}`, category: 'balance', priority: 200 + Math.min(20, b.severity * 3),
        title: `${b.weak} work is trailing`,
        noticed: `${b.strong} work has been ${b.ratioLabel} your ${b.weak.toLowerCase()} work over the last three weeks.`,
        means: 'Lopsided weeks add up. Balanced work keeps joints happy and progress even.',
        action: `Add one or two ${b.weak.toLowerCase()} exercises to your next sessions.`,
      }];
    },
  },
  {
    id: 'readiness.effort-drift',
    run: (ctx, d) =>
      d.exerciseIds.flatMap(({ id, name }) => {
        const drift = effortDrift(exerciseHistory(ctx.sessions, id, ctx.custom));
        if (drift.confidence !== 'high' || drift.status === 'stable' || drift.status === 'unknown') return [];
        return drift.status === 'harder'
          ? [{ id: `effort:${id}`, category: 'readiness' as const, priority: 100, title: `${name}: you have been pushing harder`, noticed: `Your effort ratings on ${name} have climbed recently.`, means: 'Harder sets at the same load can be a sign you need more recovery.', action: 'Keep the load, watch sleep and rest, and rate honestly.', exerciseId: id }]
          : [{ id: `effort:${id}`, category: 'readiness' as const, priority: 105, title: `${name}: effort is trending lower`, noticed: `Your effort ratings on ${name} have eased recently.`, means: 'The same work is getting easier. That is progress.', action: 'You may be ready to add a rep or a small step of load.', exerciseId: id }];
      }),
  },
  {
    id: 'focus.specialization',
    run: ctx => {
      const weeks = weeklyMuscleSets(ctx.sessions, ctx.today, 5, ctx.custom);
      const out: Insight[] = [];
      for (const split of ctx.splits) for (const m of split.focus) {
        const prior = weeks.slice(1).map(w => w.sets[m] ?? 0).filter(v => v > 0);
        if (prior.length < 3) continue;
        const baseline = [...prior].sort((a, b) => a - b)[Math.floor(prior.length / 2)]!;
        const step = Math.min(3, Math.max(1, baseline * 0.15));
        const target = Math.round(Math.min(baseline * 1.2, baseline + step) * 2) / 2;
        const current = weeks[0]?.sets[m] ?? 0;
        if (current >= target) continue;
        out.push({
          id: `focus:${m}`, category: 'focus', priority: 150,
          title: `${muscleLabel(m)} focus: ${current} of ${target} sets this week`,
          noticed: `You chose ${muscleLabel(m).toLowerCase()} as a focus. Your usual week is about ${baseline} effective sets.`,
          means: 'A small bump over your own baseline is enough. Big jumps do not help.',
          action: `Aim for about ${target} effective sets this week.`,
          muscle: m,
        });
      }
      return out;
    },
  },
  {
    id: 'consistency.gap',
    run: ctx => {
      const gap = daysSinceLastSession(ctx.sessions, ctx.today);
      if (gap == null || gap < 7) return [];
      return [{
        id: 'gap', category: 'consistency', priority: 250,
        title: gap >= 28 ? 'Welcome back' : `${gap} days since your last session`,
        noticed: gap >= 28 ? `Your last session was ${gap} days ago.` : 'A week without training.',
        means: gap >= 28 ? 'Strength comes back fast, but the first session should be easy.' : 'Reduced training still keeps most of your progress. Zero does not.',
        action: gap >= 28 ? 'Repeat your last loads once, no increases, then build.' : 'Do one short session this week, even half your usual.',
      }];
    },
  },
  {
    id: 'data.effort-missing',
    run: ctx => {
      const recent = ctx.sessions.slice(-3);
      const sets = recent.flatMap(s => s.exercises.flatMap(e => e.sets)).filter(s => (s.reps ?? 0) > 0);
      if (sets.length < 8) return [];
      const rated = sets.filter(s => s.effort).length / sets.length;
      if (rated >= 0.5) return [];
      return [{
        id: 'effort-missing', category: 'data', priority: 90,
        title: 'Rate your sets',
        noticed: `Only ${Math.round(rated * 100)}% of your recent sets have an effort rating.`,
        means: 'Without effort the coach cannot tell a hard set from an easy one, so it stays cautious.',
        action: 'Tap Easy, Ideal or Max after each set. One tap is enough.',
      }];
    },
  },
  {
    id: 'profile.changed',
    run: ctx => {
      const cutoff = ctx.now - 7 * 86_400_000;
      const recent = ctx.profileHistory.filter(c => (c.field === 'bodyWeightKg' || c.field === 'goal') && new Date(c.at).getTime() >= cutoff);
      const latest = new Map<ProfileChange['field'], ProfileChange>();
      for (const c of recent) latest.set(c.field, c); // profileHistory is chronological; later entries win
      return [...latest.values()].map((c): Insight => {
        if (c.field === 'goal') {
          const g = GOAL_BY_ID[c.to as GoalId];
          return {
            id: `profile-changed:goal:${c.at}`, category: 'data', priority: 260,
            title: `Goal changed to ${g.name}`,
            noticed: `You changed your training goal to ${g.name}.`,
            means: `Main lifts now target ${g.mainReps[0]}–${g.mainReps[1]} reps, accessories ${g.accessoryReps[0]}–${g.accessoryReps[1]}. Your splits keep their exercises.`,
            action: `Suggested rest for this goal is ${g.restDefaultSec}s. Apply it from the goal sheet if you'd like.`,
          };
        }
        const to = c.to as number;
        const from = typeof c.from === 'number' ? c.from : null;
        const delta = from != null ? Math.round((to - from) * 10) / 10 : null;
        return {
          id: `profile-changed:weight:${c.at}`, category: 'data', priority: 260,
          title: `Weight updated to ${to} kg`,
          noticed: delta != null && delta !== 0 ? `You updated your weight to ${to} kg, ${delta < 0 ? 'down' : 'up'} ${Math.abs(delta)} kg since your last entry.` : `You updated your weight to ${to} kg.`,
          means: 'Saved to your weight log.',
          action: 'Nothing to do here. Keep weighing in for a trend, not just a jump.',
        };
      });
    },
  },
  {
    id: 'consistency.week-grade',
    run: ctx => {
      const week = weekSummary(ctx.sessions, ctx.today, ctx.custom);
      if (week.workouts === 0 && ctx.sessions.length === 0) {
        return [{ id: 'first-session', category: 'consistency', priority: 50, title: 'Start with one session', noticed: 'Nothing logged yet.', means: 'The coach learns from what you log. The first sessions are the baseline.', action: 'Pick a split, log a few sets, and rate the effort.' }];
      }
      return [];
    },
  },
  {
    id: 'progress.plateau-lever',
    run: (ctx, d) =>
      d.exerciseIds.flatMap(({ id, name }) => {
        const meta = findExercise(id, ctx.custom);
        if (meta?.role !== 'main') return [];
        const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
        if (hist.length < 6) return [];
        const t = e1rmTrend(hist.slice(-12));
        if (t.direction === 'unknown' || t.confidence === 'low' || Math.abs(t.slopePerWeek) >= 0.015) return [];
        const recentSessions = ctx.sessions.filter(s => s.exercises.some(e => e.exerciseId === id)).slice(-6);
        if (recentSessions.length < 6) return [];

        const primaryMuscle = meta.primary[0];
        const weekSets = primaryMuscle ? (hardSetsThisWeek(ctx.sessions, ctx.today, ctx.custom)[primaryMuscle] ?? 0) : 0;
        const fShare = failureShare(recentSessions);
        const stale = isStale(hist);

        let lever: { means: string; action: string } | null = null;
        if (weekSets < 10) lever = { means: `Weekly volume for ${muscleLabel(primaryMuscle!).toLowerCase()} is on the low side (about ${Math.round(weekSets)} hard sets).`, action: 'Add 3 to 4 sets at ideal effort across two sessions.' };
        else if (fShare > 0.5 && recentSessions.length >= 6) lever = { means: 'Effort has been mostly max for a while, which adds fatigue without much extra progress.', action: 'Pull most sets back to ideal effort and save max for the last set.' };
        else if (stale) lever = { means: 'The load and rep range have not changed in a while, so the stimulus has nowhere to come from.', action: 'Change the rep range for two weeks, or swap in a similar exercise for a block.' };
        if (!lever) return [];

        return [{
          id: `plateau-lever:${id}`, category: 'progress', priority: 230, cadence: 'now', kind: 'plan', exerciseId: id,
          title: `${name}: flat for a while, most likely lever`,
          noticed: `${name} has not moved over recent sessions.`,
          means: lever.means,
          action: lever.action,
          evidence: { n: hist.length, window: `${hist.length} sessions`, confidence: t.confidence },
        }];
      }),
  },
  {
    id: 'readiness.effort-calibration',
    run: (ctx, d) =>
      d.exerciseIds.flatMap(({ id, name }) => {
        const hist = exerciseHistory(ctx.sessions, id, ctx.custom);
        if (hist.length < 2) return [];
        const obs = rirObservations(hist);
        const biases = effortBiasByLabel(obs).filter(b => b.bias >= 2);
        if (!biases.length) return [];
        const b = biases[0]!;
        const sample = obs.find(o => o.otherEffort === b.effort);
        return [{
          id: `effort-calibration:${id}`, category: 'readiness', priority: 95, cadence: 'now', kind: 'data', exerciseId: id,
          title: `${name}: you had more in reserve than rated`,
          noticed: sample ? `You rated ${b.effort} at ${sample.kg} kg, then a later max set at the same load beat it by ${sample.impliedRir} reps.` : `Your ${b.effort} sets on ${name} usually have more reps in reserve than the label assumes.`,
          means: 'That is normal, especially early on. Lifters usually underestimate how many reps they have left.',
          action: `The coach will treat your ${b.effort} sets on ${name} as a little easier when estimating your max.`,
          evidence: { n: b.n, window: `${b.n} matched pairs`, confidence: b.n >= 5 ? 'medium' : 'low' },
        }];
      }),
  },
];

/** Run every rule, drop duplicates per target, keep the most important. */
export function coachInsights(ctx: CoachContext, limit = 3): Insight[] {
  const d = derive(ctx);
  const all = RULES.flatMap(r => {
    try { return r.run(ctx, d); } catch { return []; }
  });
  // A recovery insight about a muscle explains plateau/readiness on lifts that target it.
  const recovering = new Set(all.filter(i => i.category === 'recovery').map(i => i.muscle));
  const filtered = all.filter(i => {
    if (!i.exerciseId || recovering.size === 0) return true;
    const meta = findExercise(i.exerciseId, ctx.custom);
    return !meta?.primary.some(m => recovering.has(m));
  });
  const seen = new Set<string>();
  return filtered
    .sort((a, b) => b.priority - a.priority)
    .filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; })
    .slice(0, limit);
}
