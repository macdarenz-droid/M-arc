/**
 * The words layer, offline. Turns findings and proposals into the coach's
 * voice: what we noticed, what it means, what to do next. Every number comes
 * from the report; nothing is invented here. Where a template has variants,
 * the choice is deterministic and rotates weekly, so the same finding does
 * not read identically twice in a row but stays stable within a week.
 *
 * This is also where the app is honest about evidence: each insight and
 * suggestion carries the research cards it rests on, with their rating.
 */
import type { Exercise, Split } from '@/core/models';
import { WEEKDAYS, type Weekday } from '@/core/models';
import { muscleLabel, type MuscleGroup, type MuscleId } from '@/data/muscles';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';
import { formatLoad } from '@/core/units';
import { WEEKDAY_LABEL, formatDay, formatHours, weekStart } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import type { Confidence, Finding, FindingKind, FindingsReport, Proposal, ProposalKind, Severity } from './contract';
import { principlesFor, type PrincipleCard } from './principles';
import { CONFIDENCE_RANK } from './detectors/shared';
import { weekReviewCopy, type WeekReview } from './review';

export type Category = 'recovery' | 'progress' | 'readiness' | 'balance' | 'focus' | 'consistency' | 'data' | 'volume';

export const CATEGORY_LABEL: Record<Category, string> = {
  recovery: 'Recovery', progress: 'Progress', readiness: 'Readiness', balance: 'Training balance', focus: 'Focus muscle',
  consistency: 'Consistency', data: 'Training data', volume: 'Weekly volume',
};

const CATEGORY_OF: Record<FindingKind, Category> = {
  volume_drop: 'volume', volume_spike: 'volume', weekly_sets_out_of_band: 'volume', week_review: 'volume', uncovered_muscle: 'balance', focus_behind: 'focus',
  plateau: 'progress', decline: 'progress', progressing: 'progress', record: 'progress', near_miss: 'progress', session_execution: 'progress',
  under_recovered: 'recovery', low_sleep_readiness: 'recovery', low_readiness: 'readiness',
  effort_missing: 'data', effort_drift_harder: 'readiness', effort_drift_easier: 'readiness', effort_mismatch: 'readiness', rep_range_mismatch: 'readiness',
  redundant_exercises: 'balance', balance_imbalance: 'balance', chronic_skip: 'consistency',
  long_gap: 'consistency', habit_pattern: 'consistency', consistency_drift: 'consistency', first_sessions: 'consistency',
  note_flag: 'readiness',
};

export interface Insight {
  id: string;
  kind: FindingKind;
  category: Category;
  priority: number;
  title: string;
  noticed: string;
  means: string;
  action: string;
  exerciseId?: string;
  muscle?: MuscleId;
  confidence: Confidence;
  severity: Severity;
  evidence: PrincipleCard[];
  /** Legacy chronic-skip comparisons can only navigate to the current split for review. */
  reviewInTrain?: boolean;
}

export interface Suggestion {
  id: string;
  kind: ProposalKind;
  title: string;
  summary: string;
  /** What the coach noticed that led here, one line per finding. */
  why: string[];
  /** Exactly what accepting will change, one line each. */
  changes: string[];
  acceptLabel: string;
  evidence: PrincipleCard[];
  confidence: Confidence;
  dismissKey: string;
  proposal: Proposal;
}

export interface RenderContext {
  unit: 'kg' | 'lb';
  splits: Split[];
  custom: Exercise[];
  today: string;
  goal: GoalId;
}

const GROUP_LABEL: Record<MuscleGroup, string> = { chest: 'Chest', shoulders: 'Shoulder', arms: 'Arm', back: 'Back', core: 'Core', legs: 'Leg' };

function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h;
}

/** Deterministic weekly rotation among variants. */
function pick<T>(variants: T[], seed: string, today: string): T {
  return variants[fnv(`${seed}|${weekStart(today)}`) % variants.length]!;
}

const num = (v: unknown, d = 0): number => (typeof v === 'number' && Number.isFinite(v) ? v : d);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const lower = (s: string): string => s.charAt(0).toLowerCase() + s.slice(1);
const plural = (n: number, one: string, many = `${one}s`): string => `${n} ${n === 1 ? one : many}`;

export function clock(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

function exerciseName(f: { subject: { exerciseId?: string; exerciseName?: string } }, ctx: RenderContext): string {
  return f.subject.exerciseName ?? (f.subject.exerciseId ? findExercise(f.subject.exerciseId, ctx.custom)?.name ?? f.subject.exerciseId : 'this lift');
}

function load(kg: unknown, ctx: RenderContext): string {
  return formatLoad(num(kg), ctx.unit);
}

function splitName(id: string | undefined, ctx: RenderContext): string {
  return ctx.splits.find(s => s.id === id)?.name ?? 'your split';
}

function exName(id: string, ctx: RenderContext): string {
  return findExercise(id, ctx.custom)?.name ?? id;
}

interface Words { title: string; noticed: string; means: string; action: string }

function wordsFor(f: Finding, ctx: RenderContext): Words {
  const m = f.metrics;
  const ex = exerciseName(f, ctx);
  const muscle = f.subject.muscle ? muscleLabel(f.subject.muscle) : 'this muscle';
  const group = f.subject.muscleGroup ? GROUP_LABEL[f.subject.muscleGroup] : 'That';
  const goal = GOAL_BY_ID[ctx.goal];
  const strengthGoal = ctx.goal === 'strength' || ctx.goal === 'strength_muscle';
  switch (f.kind) {
    case 'volume_drop': {
      const pct = Math.abs(num(m.changePct));
      return pick<Words>([
        { title: `${group} work is down ${pct}%`,
          noticed: `Over the last three weeks you averaged ${num(m.currentSets)} ${lower(group)} sets a week, against your usual ${num(m.baselineSets)}.`,
          means: 'Muscles grow with the amount of hard work they get each week. Less than usual for a stretch is fine when it is on purpose. Drifting there by accident is how progress stalls quietly.',
          action: `If the drop was not planned, put one ${lower(group)} exercise back, or add a set or two to the ones you kept.` },
        { title: `Less ${lower(group)} work lately`,
          noticed: `${group} sets are down ${pct}% over three weeks: about ${num(m.currentSets)} a week where you usually do ${num(m.baselineSets)}.`,
          means: 'Weekly sets are the main dial for muscle growth. Turning it down for a while costs little; leaving it down costs progress.',
          action: `Decide whether this is a deliberate easier stretch. If not, bring ${lower(group)} back toward ${num(m.baselineSets)} sets.` },
      ], f.id, ctx.today);
    }
    case 'volume_spike':
      return { title: `${group} work jumped ${num(m.changePct)}%`,
        noticed: `About ${num(m.currentSets)} ${lower(group)} sets a week over the last three weeks, up from your usual ${num(m.baselineSets)}.`,
        means: 'A big jump in one go adds fatigue faster than it adds muscle. This is not an injury warning, just a pace check: more is better only up to the point you can recover from.',
        action: 'Hold this level for two weeks before adding more, and rate effort honestly so the coach can see how it lands.' };
    case 'weekly_sets_out_of_band':
      return { title: `${muscle}: ${num(m.weeklySets)} sets a week`,
        noticed: `For three weeks running, ${lower(muscle)} has had more than ${num(m.bandHigh)} effective sets a week.`,
        means: 'Past a point each extra set adds less and costs more recovery. Where that point sits is personal, and this is well past where most of the research looks.',
        action: `Try trimming ${lower(muscle)} by a few sets and watch whether your lifts hold. If they do, the sets were not needed.` };
    case 'uncovered_muscle':
      return { title: `${muscle} is not getting trained`,
        noticed: `Four weeks with under ${num(m.threshold, 2)} sets a week for ${lower(muscle)}, counting the half-credit from lifts where it helps.`,
        means: 'Muscles you never train directly fall behind the ones you do. Even a little direct work changes that.',
        action: `Add one ${lower(muscle)} exercise to a split. Two or three sets is plenty to start.` };
    case 'focus_behind': {
      const remaining = Math.max(0, Math.round((num(m.targetSets) - num(m.currentSets)) * 2) / 2);
      return { title: `${muscle} focus: ${num(m.currentSets)} of ${num(m.targetSets)} sets`,
        noticed: `You chose ${lower(muscle)} as a focus. Your usual week is about ${num(m.baselineSets)} sets; the target is a small bump to ${num(m.targetSets)}.`,
        means: 'A little more than your own baseline is what brings a lagging muscle up. Big jumps mostly add fatigue.',
        action: `${plural(num(m.daysLeft), 'day')} left this week: fit in about ${remaining} more ${lower(muscle)} sets.` };
    }
    case 'plateau': {
      const weighted = num(m.lastTopKg) > 0;
      const flat = num(m.flatSessions, num(m.sessions));
      return pick<Words>([
        { title: `${ex}: stalled`,
          noticed: weighted ? `${plural(flat, 'session')} at about ${load(m.lastTopKg, ctx)} for ${num(m.lastTopReps)} reps.` : `${plural(flat, 'session')} at about ${num(m.lastBestReps)} reps.`,
          means: 'The stimulus stopped changing, so your body stopped adapting. This is common, and it is fixable.',
          action: weighted ? 'Reps first: aim for one more clean rep at this load. If that stalls too, try a different rep range for two weeks, or swap in a sibling exercise.' : 'Add one clean rep to your best set. If that stalls, try a harder variation.' },
        { title: `${ex} has not moved`,
          noticed: weighted ? `Your last ${flat} sessions sit around ${load(m.lastTopKg, ctx)} × ${num(m.lastTopReps)}.` : `Your last ${flat} sessions sit around ${num(m.lastBestReps)} reps.`,
          means: 'Progress needs the work to get a little harder over time. Same load, same reps for weeks is maintenance, which is fine on purpose and frustrating by accident.',
          action: 'Change one thing: a rep, a small step of load, or the exercise itself. Not all three.' },
      ], f.id, ctx.today);
    }
    case 'decline':
      return { title: `${ex}: slipping`,
        noticed: num(m.lastTopKg) > 0 ? `From ${load(m.firstTopKg, ctx)} to ${load(m.lastTopKg, ctx)} over ${plural(num(m.sessions), 'session')}.` : `Your best sets have drifted down over ${plural(num(m.sessions), 'session')}.`,
        means: 'A downward trend across sessions usually means fatigue is running ahead of recovery, or something outside the gym changed. Pushing through rarely fixes it.',
        action: 'Keep the load, stop short of max effort for a week, then build back up.' };
    case 'progressing': {
      const projection = typeof m.trajectoryKgPerWeek === 'number' && typeof m.trajectoryNextKg === 'number'
        && typeof m.trajectoryPoints === 'number' && typeof m.trajectoryProjectedOn === 'string' && typeof m.trajectoryExpiresOn === 'string'
        ? `Logged top load is rising about ${load(m.trajectoryKgPerWeek, ctx)} per week across ${plural(num(m.trajectoryPoints), 'logged day')}. If that rate holds, ${load(m.trajectoryNextKg, ctx)} projects around ${formatDay(m.trajectoryProjectedOn)}. Reassess after ${formatDay(m.trajectoryExpiresOn)}. A past-load trend, not a scheduled target.`
        : 'Keep the same pattern. Small steps, most weeks.';
      return { title: `${ex}: moving up`,
        noticed: num(m.lastTopKg) > 0 ? `${load(m.firstTopKg, ctx)} to ${load(m.lastTopKg, ctx)} across ${plural(num(m.sessions), 'session')}.` : `${num(m.firstBestReps)} to ${num(m.lastBestReps)} reps across ${plural(num(m.sessions), 'session')}.`,
        means: 'That is progressive overload doing its job. Nothing to fix.',
        action: projection };
    }
    case 'record':
      return { title: `New record: ${ex}`,
        noticed: `${str(m.detail)}, up from ${num(m.previous)}.`,
        means: 'Records mark real progress: heavier, stronger, or more reps at a load. Total volume never counts as one.',
        action: 'Nice. Rate the effort so the coach knows how close to your limit that was.' };
    case 'near_miss': {
      const kind = str(m.recordKind);
      let noticed: string;
      if (kind === 'reps_at_load' && num(m.current) === num(m.standing)) noticed = `Matched your ${num(m.standing)}-rep best at ${load(m.loadKg, ctx)}. ${plural(num(m.gap), 'more rep')} would be a new rep record.`;
      else if (kind === 'reps_at_load') noticed = `${num(m.current)} reps at ${load(m.loadKg, ctx)}; previous best ${num(m.standing)}. ${num(m.required)} would beat it.`;
      else if (kind === 'best_reps') noticed = `${num(m.current)} reps; previous best ${num(m.standing)}. ${num(m.required)} would beat it.`;
      else if (kind === 'heaviest') noticed = `Logged ${load(m.current, ctx)}; heaviest previously ${load(m.standing, ctx)}. A load above ${load(m.standing, ctx)} would beat it; the next normal step is ${load(m.required, ctx)}.`;
      else noticed = `Strength estimate ${load(m.current, ctx)}; the next record threshold is ${load(m.required, ctx)}.`;
      return { title: `Close to a record: ${ex}`, noticed,
        means: 'This recognizes work you already logged. It does not change the next target.',
        action: 'A useful marker for another day; no extra set needed now.' };
    }
    case 'session_execution':
      return {
        title: `${f.subject.splitName ?? 'Session'}: plan and actual`,
        noticed: `${num(m.metSets)} of ${num(m.comparableSets)} history-backed set targets were met; ${num(m.belowSets)} were below at the captured load. ${num(m.loggedSets)} working sets were logged from ${num(m.plannedSets)} originally planned.`,
        means: 'This compares the saved plan with the work you logged. Starter suggestions, edited rows and different loads are left out of the comparison.',
        action: 'Use it as a record of the session, not a grade or an automatic change to your next target.',
      };
    case 'under_recovered': {
      const readiness = num(m.readinessFactor) > 1
        ? (m.readinessPersonalized === true ? 'Your check-in today read below your own normal, which widens it a little more.' : 'Your check-in today read low, which widens it a little more.') : '';
      const extra = [num(m.volumeFactor) > 1 ? 'That session was bigger than your usual, so the window is wider.' : '', readiness, num(m.fatigueFactor) > 1 ? 'You noted that session felt unusually tiring, which widens it too.' : '', m.personalized ? 'Your own history shows you perform worse when you go back too soon.' : ''].filter(Boolean).join(' ');
      return { title: `${muscle} still recovering`,
        noticed: `About ${num(m.pct)}% recovered with about ${formatHours(num(m.hoursLeft))} to go, after ${formatDay(str(m.lastDay) || ctx.today)}.${extra ? ` ${extra}` : ''}`,
        means: 'Training it again now mostly means a weaker session, not harm. Recovery windows are estimates, and they only widen when your own results say so.',
        action: 'Give it the rest of the window, or train something that is fresh today.' };
    }
    case 'low_sleep_readiness':
      return { title: 'Short night',
        noticed: `About ${num(m.sleepHours)} hours of sleep, under the ${num(m.thresholdMinutes) / 60}-hour mark most sleep studies use.`,
        means: 'Short sleep measurably lowers next-day strength, most on big compound lifts. It does not mean skip training.',
        action: 'Keep the loads you planned, do not chase records, and rate effort honestly so a tired session is not read as a decline.' };
    case 'low_readiness': {
      const personalized = m.personalized === true && typeof m.baselineAvg === 'number';
      return { title: personalized ? 'Below your own normal, more than once' : 'Feeling worn down lately',
        noticed: personalized
          ? `Your morning check-ins have read below your own normal more than once this week: today, sleep ${num(m.sleep)}/5, soreness ${num(m.soreness)}/5, stress ${num(m.stress)}/5 — an average of ${num(m.avg)} against your usual ${num(m.baselineAvg)}.`
          : `Your morning check-ins have read low more than once this week: today, sleep ${num(m.sleep)}/5, soreness ${num(m.soreness)}/5, stress ${num(m.stress)}/5.`,
        means: 'One rough morning says little by itself. A run of them tracked over time is the kind of pattern short daily wellness check-ins actually predict — this does not diagnose anything or say why.',
        action: 'An easier session, a longer warm-up, or a rest day are all reasonable calls today. Keep checking in either way; the pattern is what matters.' };
    }
    case 'week_review': {
      const review: WeekReview = {
        start: str(m.start), end: str(m.end), workouts: num(m.workouts), activeDays: [], activeDayCount: num(m.activeDayCount), sets: num(m.sets), volumeKg: num(m.volumeKg),
        baselineWeeks: num(m.baselineWeeks), baselineSets: m.hasBaseline ? num(m.baselineSets) : null, baselineVolumeKg: m.hasBaseline ? num(m.baselineVolumeKg) : null,
        setsDelta: m.hasBaseline ? num(m.setsDelta) : null, volumeDeltaKg: m.hasBaseline ? num(m.volumeDeltaKg) : null,
        direction: str(m.direction) as WeekReview['direction'], scheduledDays: num(m.scheduledDays), alignedDays: num(m.alignedDays), scheduleBasis: str(m.scheduleBasis) as WeekReview['scheduleBasis'],
        muscle: m.muscleId ? { id: str(m.muscleId) as MuscleId, sets: num(m.muscleSets), baselineSets: num(m.muscleBaselineSets), deltaSets: num(m.muscleDeltaSets) } : null,
      };
      const copy = weekReviewCopy(review, ctx.unit);
      return { title: copy.title, noticed: copy.summary, means: copy.detail, action: copy.schedule || 'This is a description of logged work, not a grade.' };
    }
    case 'effort_missing':
      return { title: 'Rate your sets',
        noticed: `Only ${num(m.ratedPct)}% of your last ${num(m.sets)} sets have an effort rating.`,
        means: 'Without effort the coach cannot tell a hard set from an easy one, so it stays cautious and progress suggestions stay small.',
        action: 'Tap Easy, Ideal or Max after each set. One tap is enough.' };
    case 'effort_drift_harder':
      return { title: `${ex}: feeling harder`,
        noticed: `Your effort ratings on ${ex} have climbed over the last ${plural(num(m.sessions), 'session')} at the same loads.`,
        means: 'The same work costing more effort is an early sign that recovery is behind. Sleep, food and stress all count.',
        action: 'Keep the load for now. If the next two sessions still feel hard, take an easier week.' };
    case 'effort_drift_easier':
      return { title: `${ex}: getting easier`,
        noticed: `Your effort ratings on ${ex} have eased over the last ${plural(num(m.sessions), 'session')}.`,
        means: 'The same work costing less effort is progress you can feel before it shows in the numbers.',
        action: 'You are probably ready to add a rep, or one small step of load.' };
    case 'effort_mismatch':
      if (str(m.direction) === 'harder_than_goal') {
        return { title: `${ex}: every set to the limit`,
          noticed: `${num(m.maxSharePct)}% of your recent ${ex} sets were max effort. Your ${goal.name.toLowerCase()} goal aims for ${num(m.goalRirLow)} to ${num(m.goalRirHigh)} reps left in the tank.`,
          means: 'Stopping a rep or two short gives nearly all the benefit for growth and all of it for strength, at a lower recovery cost. Going to the wall every set is not better, just more tiring.',
          action: 'Leave one or two reps in reserve on most sets. Save max effort for the last set, if at all.' };
      }
      return { title: `${ex}: too easy to count`,
        noticed: `${num(m.easySharePct)}% of your recent ${ex} sets felt easy.`,
        means: 'Sets need to be hard to do anything. Easy sets are warm-ups.',
        action: 'Add load or reps until most sets feel ideal: close to your limit, not at it.' };
    case 'rep_range_mismatch':
      if (str(m.direction) === 'above') {
        return { title: `${ex}: reps above your ${goal.name.toLowerCase()} range`,
          noticed: `Typically ${num(m.typicalReps)} reps; the range for this lift on your goal is ${num(m.rangeLow)} to ${num(m.rangeHigh)}.`,
          means: strengthGoal ? 'Maximal strength needs heavy loads. Muscle size is flexible about reps, strength is not.' : 'Size grows across a wide rep range as long as sets are hard, so this is information rather than a problem.',
          action: strengthGoal ? 'Add load until you land in the range, keeping the effort honest.' : 'Fine to keep, or add load if you want the sets shorter.' };
      }
      return { title: `${ex}: reps below your range`,
        noticed: `Typically ${num(m.typicalReps)} reps; the range for this lift on your goal is ${num(m.rangeLow)} to ${num(m.rangeHigh)}.`,
        means: 'Very low reps on this goal add fatigue without extra benefit.',
        action: `Lighten a little and aim for ${num(m.rangeLow)} to ${num(m.rangeHigh)} reps.` };
    case 'redundant_exercises': {
      const names = str(m.exerciseIds).split(',').filter(Boolean).map(id => exName(id, ctx));
      return { title: `${splitName(f.subject.splitId, ctx)}: two of a kind`,
        noticed: `${names.join(' and ')} both train ${lower(muscle)} through the same movement.`,
        means: 'Two near-identical lifts split your effort without adding a new stimulus. Not wrong, just not efficient.',
        action: 'Keep the one you progress on, and use the slot for something the split lacks.' };
    }
    case 'chronic_skip': {
      const sessions = num(m.sessions), missing = num(m.missingSessions);
      const split = f.subject.splitName ?? splitName(f.subject.splitId, ctx);
      const confirmed = str(m.basis) === 'saved_plan';
      return {
        title: `${ex}: often absent from ${split}`,
        noticed: confirmed
          ? `${ex} was in the saved plan but had no work logged in ${missing} of ${sessions} ${split} sessions.`
          : `${ex} is in your current ${split} split, but is absent from ${missing} of its last ${sessions} logs. Older plans were not saved.`,
        means: confirmed
          ? 'The saved plans show the exercise was expected; the log only shows that no working set was saved. It does not show why.'
          : 'This compares today’s split with older logs. It cannot prove the exercise was planned in those sessions.',
        action: confirmed ? 'Keep the work realistic for your current routine: replace the exercise, remove it, or leave the split as it is.' : 'Review the split and decide whether this exercise still belongs there.',
      };
    }
    case 'balance_imbalance':
      return { title: `${str(m.weak)} work is trailing`,
        noticed: `${str(m.strong)} work has been ${str(m.ratioLabel)} your ${lower(str(m.weak))} work over the last three weeks.`,
        means: 'Balanced pushing and pulling is standard coaching advice for healthy shoulders and even development. It is sensible, though not something trials have tested directly.',
        action: `Add one or two ${lower(str(m.weak))} exercises across your week.` };
    case 'long_gap':
      if (m.reentry) {
        return { title: 'Welcome back',
          noticed: `Your last session was ${plural(num(m.days), 'day')} ago.`,
          means: 'Strength comes back faster than it left; muscle remembers. The first session back should be easy.',
          action: 'Repeat your last loads once with no increases, and rate the effort.' };
      }
      return { title: `${plural(num(m.days), 'day')} since your last session`,
        noticed: 'A week without training.',
        means: 'Reduced training keeps most of your progress. Zero does not, for long.',
        action: 'One short session this week counts. Half your usual is fine.' };
    case 'habit_pattern': {
      const days = str(m.days).split(',').filter(Boolean) as Weekday[];
      const parts = days.map(d => `${WEEKDAY_LABEL[d]} around ${str(m[`${d}_start`])}`);
      const retired = str(m.retired).split(',').filter(Boolean) as Weekday[];
      const tail = retired.length ? ` ${retired.map(d => `${WEEKDAY_LABEL[d]}s`).join(' and ')} have gone quiet for a few weeks, so the coach stopped counting them.` : '';
      return { title: days.length ? `You train on ${days.map(d => WEEKDAY_LABEL[d]).join(', ')}` : 'Your training week has shifted',
        noticed: days.length ? `Over ${num(m.weeksObserved)} weeks you have trained most ${parts.join(', ')}.${tail}` : `Over ${num(m.weeksObserved)} weeks no day stands out yet.${tail}`,
        means: 'A routine you already keep is the strongest habit cue there is. Deciding in advance when you will train roughly doubles the odds of showing up.',
        action: days.length ? 'Let the coach set your schedule and reminders around those times, or keep it as you have.' : 'Pick the days you can most often make, and let the coach remind you around then.' };
    }
    case 'consistency_drift': {
      const day = str(m.weekday) as Weekday;
      const label = WEEKDAYS.includes(day) ? WEEKDAY_LABEL[day] : 'A training day';
      const destination = str(m.destinationWeekday) as Weekday;
      const dated = /^\d{4}-\d{2}-\d{2}$/.test(str(m.olderFrom)) && /^\d{4}-\d{2}-\d{2}$/.test(str(m.recentFrom));
      return { title: `${label} is less common in your logs`,
        noticed: `${label} appeared in ${num(m.olderCount)} of the older ${num(m.olderWeeks)} complete weeks and ${num(m.recentCount)} of the recent ${num(m.recentWeeks)}.`,
        means: `This describes logged sessions; your past schedule was not saved.${dated ? ` Older window: ${formatDay(str(m.olderFrom))} to ${formatDay(str(m.olderTo))}. Recent window: ${formatDay(str(m.recentFrom))} to ${formatDay(str(m.recentTo))}.` : ''}`,
        action: WEEKDAYS.includes(destination) ? `${WEEKDAY_LABEL[destination]} has enough recent logs to review as a schedule move.` : 'No schedule change suggested.' };
    }
    case 'first_sessions':
      return { title: 'Start with a few sessions',
        noticed: `${num(m.sessions)} of ${num(m.needed)} logged.`,
        means: 'The coach learns from what you log. The first sessions are your baseline, not a test.',
        action: 'Pick a split, log the sets you do, and rate the effort.' };
    case 'note_flag': {
      const daysAgo = num(m.daysAgo);
      const when = daysAgo <= 0 ? 'today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
      const hasMuscle = !!f.subject.muscle;
      switch (str(m.flagKind)) {
        case 'pain_or_discomfort':
          return { title: hasMuscle ? `You noted discomfort — ${lower(muscle)}` : 'You noted some discomfort',
            noticed: hasMuscle ? `In a session note ${when}, you mentioned ${lower(muscle)}.` : `In a session note ${when}, you mentioned discomfort.`,
            means: 'This is only what you wrote, recalled so it is not forgotten. The coach cannot tell you what it means or how serious it is, and does not try.',
            action: 'If it is more than passing soreness, ease off that area, or have it looked at by someone who can.' };
        case 'equipment_issue':
          return { title: 'You flagged an equipment issue',
            noticed: `In a session note ${when}, you mentioned a problem with equipment or the gym.`,
            means: 'Worth remembering next time you plan that session.',
            action: 'Swap the exercise or the slot if the issue is still there.' };
        case 'fatigue':
          return { title: 'You noted feeling unusually tired',
            noticed: `In a session note ${when}, you mentioned feeling more fatigued than usual.`,
            means: 'Fatigue that stands out from normal training soreness is worth watching, alongside sleep and stress outside the gym.',
            action: 'An easier session or an extra rest day is a reasonable call here.' };
        case 'schedule':
          return { title: 'You left a scheduling note',
            noticed: `In a session note ${when}, you mentioned timing or a missed session.`,
            means: 'Worth knowing when the coach looks at your consistency.',
            action: 'Nothing to do here unless you want to adjust your schedule.' };
        case 'form_check':
          return { title: 'You flagged a form check',
            noticed: `In a session note ${when}, you wanted to check technique on something.`,
            means: 'Good form matters more than the number on the bar.',
            action: 'Film a set next time, or have someone watch you lift.' };
        default:
          return { title: 'Good note from a recent session',
            noticed: `In a session note ${when}, you wrote something good.`,
            means: 'Worth remembering what a good session felt like.',
            action: 'Keep doing what you did that day.' };
      }
    }
  }
}

const KIND_WEIGHT: Partial<Record<FindingKind, number>> = { under_recovered: 9, decline: 8, long_gap: 7, plateau: 6, balance_imbalance: 5, focus_behind: 4, volume_drop: 4, low_readiness: 4, effort_drift_harder: 3, effort_mismatch: 3, low_sleep_readiness: 3, note_flag: 3, record: 2, session_execution: 1, habit_pattern: 1 };

export function renderFinding(f: Finding, ctx: RenderContext): Insight {
  const w = wordsFor(f, ctx);
  const insight: Insight = {
    id: f.id, kind: f.kind, category: CATEGORY_OF[f.kind],
    priority: f.severity * 100 + CONFIDENCE_RANK[f.confidence] * 10 + (KIND_WEIGHT[f.kind] ?? 0),
    ...w,
    confidence: f.confidence, severity: f.severity, evidence: principlesFor(f.principles),
  };
  if (f.subject.exerciseId) insight.exerciseId = f.subject.exerciseId;
  if (f.subject.muscle) insight.muscle = f.subject.muscle;
  if (f.kind === 'chronic_skip' && f.metrics.basis === 'current_template') insight.reviewInTrain = true;
  return insight;
}

/** All findings as insights, most important first. */
export function insightsFrom(report: FindingsReport, ctx: RenderContext): Insight[] {
  return report.findings.map(f => renderFinding(f, ctx)).sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
}

/** A shortlist for a screen: at most `perKind` of any one kind, `limit` in total. */
export function shortlist(insights: Insight[], limit = 6, perKind = 2): Insight[] {
  const count = new Map<FindingKind, number>();
  const out: Insight[] = [];
  for (const i of insights) {
    const n = count.get(i.kind) ?? 0;
    if (n >= perKind) continue;
    count.set(i.kind, n + 1);
    out.push(i);
    if (out.length >= limit) break;
  }
  return out;
}

export interface Spark { title: string; text: string; by: string }

/** Kinds worth celebrating on their own, with no other finding needed alongside them. */
const SPARK_KINDS: ReadonlySet<FindingKind> = new Set<FindingKind>(['record', 'progressing']);

/**
 * One true, specific line about this person's own training, reusing the
 * words already rendered for the findings screen — no separate template,
 * no remote call, so it costs nothing and never invents a number. Picks
 * deterministically by day among the real candidates, so a repeat visit
 * the same day shows the same line, and a different day usually shows a
 * different one. Null when there is nothing genuinely worth celebrating
 * yet, so the screen can fall back to the standing quote instead.
 */
export function dailySpark(insights: Insight[], today: string): Spark | null {
  const candidates = insights.filter(i => SPARK_KINDS.has(i.kind));
  if (!candidates.length) return null;
  const dayIndex = Math.floor(Date.parse(`${today}T00:00:00Z`) / 86_400_000);
  const chosen = candidates[((dayIndex % candidates.length) + candidates.length) % candidates.length]!;
  return { title: chosen.title, text: chosen.noticed, by: 'From your own log' };
}

function whyFor(p: Proposal, report: FindingsReport, ctx: RenderContext): string[] {
  const byId = new Map(report.findings.map(f => [f.id, f]));
  const out: string[] = [];
  for (const id of p.basedOn) {
    const f = byId.get(id);
    if (!f) continue;
    out.push(wordsFor(f, ctx).noticed);
    if (out.length >= 3) break;
  }
  return out;
}

export function renderProposal(p: Proposal, report: FindingsReport, ctx: RenderContext): Suggestion {
  const a = p.apply;
  const chronicSkip = p.basedOn.some(id => report.findings.some(f => f.id === id && f.kind === 'chronic_skip'));
  const consistencyDrift = p.basedOn.map(id => report.findings.find(f => f.id === id)).find(f => f?.kind === 'consistency_drift');
  const base = { id: p.id, kind: p.kind, why: whyFor(p, report, ctx), evidence: principlesFor(p.principles), confidence: p.confidence, dismissKey: p.dismissKey, proposal: p };
  switch (a.kind) {
    case 'schedule': {
      if (consistencyDrift) {
        const source = WEEKDAYS.find(day => a.days[day] === null)!;
        const destination = WEEKDAYS.find(day => !!a.days[day])!;
        const split = splitName(a.days[destination]?.splitId ?? undefined, ctx);
        return { ...base, title: `Move ${split} from ${WEEKDAY_LABEL[source]} to ${WEEKDAY_LABEL[destination]}?`,
          summary: `${WEEKDAY_LABEL[destination]} appeared in ${num(consistencyDrift.metrics.destinationCount)} recent weeks, including ${num(consistencyDrift.metrics.destinationSplitCount)} with ${split}.`,
          changes: [`${WEEKDAY_LABEL[source]}: cleared`, `${WEEKDAY_LABEL[destination]}: ${split} at the learned start time`], acceptLabel: 'Move the scheduled day' };
      }
      const set = WEEKDAYS.filter(d => a.days[d]).map(d => { const day = a.days[d]!; return `${WEEKDAY_LABEL[d]} around ${clock(day.startHour, day.startMinute)}${day.splitId ? ` (${splitName(day.splitId, ctx)})` : ''}`; });
      const cleared = WEEKDAYS.filter(d => a.days[d] === null).map(d => WEEKDAY_LABEL[d]);
      const changes = [...WEEKDAYS.filter(d => a.days[d]).map(d => `${WEEKDAY_LABEL[d]}: ${a.days[d]!.splitId ? splitName(a.days[d]!.splitId ?? undefined, ctx) : 'training day'}, reminder about an hour before ${clock(a.days[d]!.startHour, a.days[d]!.startMinute)}`), ...cleared.map(d => `${d}: cleared, you have not trained on ${d}s`)];
      return { ...base, title: set.length ? 'Set your schedule to how you already train' : 'Clear the days you never use',
        summary: set.length ? `You mostly train ${set.join(', ')}. Streaks and reminders can follow that instead of a fixed clock time.` : `${cleared.join(' and ')} have been on your schedule with no sessions.`,
        changes, acceptLabel: 'Use this schedule' };
    }
    case 'today_plan': {
      const likely = p.subject.splitId;
      const rec = a.recommendedSplitId;
      const recName = splitName(rec ?? undefined, ctx);
      const likelyName = splitName(likely, ctx);
      const likelyOpt = a.options.find(o => o.splitId === likely);
      const recovering = (likelyOpt?.recoveringMuscles ?? []).map(muscleLabel);
      const swaps = a.modifications.map(c => `${exName(c.removeExerciseId, ctx)} → ${c.replaceWithExerciseId ? exName(c.replaceWithExerciseId, ctx) : 'skip today'}`);
      if (rec && rec !== likely) {
        return { ...base, title: `${recName} today instead of ${likelyName}`,
          summary: recovering.length ? `${recovering.join(', ')} ${recovering.length > 1 ? 'are' : 'is'} still recovering from your last session. ${recName}'s muscles are ready.` : `${recName} scores higher today on recovery and this week's balance.`,
          changes: [`Today's session: ${recName}`, `${likelyName} stays scheduled for its usual day`], acceptLabel: `Switch to ${recName}` };
      }
      // Two different reasons produce a swap, and only one of them means the muscle actually reads low —
      // a muscle can be flagged sore in a note while its recovery numbers say 100%, so the copy must not
      // call every swap "still recovering" (that would misstate what the person's own numbers show).
      const painSwapCount = a.modifications.filter(c => c.reason === 'note_flag').length;
      const recoverySummary = recovering.length ? `${recovering.join(', ')} ${recovering.length > 1 ? 'are' : 'is'} still recovering, so the lifts that hit it are swapped for fresh ones just for today.` : '';
      const painSummary = painSwapCount ? `${painSwapCount > 1 ? 'A couple of lifts were' : 'One lift was'} swapped because you flagged it as sore recently — better to train around it for now.` : '';
      const todaySummary = [recoverySummary, painSummary].filter(Boolean).join(' ') || `${recName} fits today: its muscles are ready.`;
      return { ...base, title: swaps.length ? `${likelyName} with ${plural(swaps.length, 'swap')}` : `Today: ${recName}`,
        summary: todaySummary,
        changes: swaps.length ? swaps.map(s => `Today only: ${s}`) : [`Today's session: ${recName}`], acceptLabel: swaps.length ? 'Use these swaps' : `Go with ${recName}` };
    }
    case 'exercise_swap': {
      const from = exName(a.fromExerciseId, ctx), to = exName(a.toExerciseId, ctx);
      return { ...base, title: `Swap ${from} for ${to}`,
        summary: chronicSkip ? `Keep the work realistic for your current routine. ${to} trains the same area; choose the change or leave the split as it is.` : `${from} has stalled. ${to} works the same muscles through the same movement with a different feel: a fresh stimulus and a reset, not a magic fix.`,
        changes: [`${splitName(a.splitId, ctx)}: ${from} → ${to}, same sets`], acceptLabel: 'Swap it' };
    }
    case 'add_exercise': {
      const name = exName(a.exerciseId, ctx);
      return { ...base, title: `Add ${name} to ${splitName(a.splitId, ctx)}`,
        summary: `${muscleLabel(a.muscle)} is not getting direct work. ${plural(a.sets, 'set')} of ${name} covers it.`,
        changes: [`${splitName(a.splitId, ctx)}: add ${name}, ${plural(a.sets, 'set')}`], acceptLabel: 'Add it' };
    }
    case 'split_modify': {
      const removed = a.remove.map(id => exName(id, ctx));
      const added = a.add.map(e => `${exName(e.exerciseId, ctx)} (${plural(e.sets, 'set')})`);
      return { ...base, title: `Trim ${splitName(a.splitId, ctx)}`,
        summary: removed.length ? (chronicSkip ? `Keep the work realistic for your current routine. Remove ${removed.join(' and ')}, or leave the split as it is.` : `Remove ${removed.join(' and ')}: it duplicates another lift in this split.`) : `Adjust ${splitName(a.splitId, ctx)}.`,
        changes: [...removed.map(n => `Remove ${n}`), ...added.map(n => `Add ${n}`), ...a.setChanges.map(c => `${exName(c.exerciseId, ctx)}: ${plural(c.sets, 'set')}`)], acceptLabel: 'Trim it' };
    }
    case 'split_new': {
      const focus = [...new Set(a.splits.flatMap(s => s.focus))].map(muscleLabel);
      return { ...base, title: `A ${a.daysPerWeek}-day plan around your goal`,
        summary: `${a.splits.map(s => s.name).join(', ')}. Every major muscle covered inside a sensible weekly range${focus.length ? `, extra work for ${focus.join(' and ').toLowerCase()}` : ''}, built from equipment you already use.`,
        changes: a.splits.map(s => `${s.name} (${s.days.map(d => WEEKDAY_LABEL[d]).join(', ')}): ${s.exercises.map(e => `${exName(e.exerciseId, ctx)} ×${e.sets}`).join(', ')}`),
        acceptLabel: a.splits.length > 1 ? 'Add these splits' : 'Add this split' };
    }
    case 'load_next': {
      const name = exName(a.exerciseId, ctx);
      const target = a.kg != null ? `${formatLoad(a.kg, ctx.unit)}${a.reps ? ` · ${a.reps[0] === a.reps[1] ? a.reps[0] : `${a.reps[0]}–${a.reps[1]}`} reps` : ''}` : a.reps ? `${a.reps[0] === a.reps[1] ? a.reps[0] : `${a.reps[0]}–${a.reps[1]}`} reps` : 'as last time';
      return { ...base, title: `${name} next: ${target}`, summary: 'Your next-session target from your recent sessions and your goal.', changes: [], acceptLabel: 'OK' };
    }
    case 'rest_default':
      return { ...base, title: `Rest ${a.seconds} seconds between sets`,
        summary: 'For strength goals, two to three minutes between heavy sets beats one minute. Your rest default is shorter than that.',
        changes: [`Rest timer default: ${a.seconds}s`], acceptLabel: `Use ${a.seconds}s` };
    case 'deload_week':
      return { ...base, title: 'An easier week',
        summary: `Several lifts are slipping while effort climbs. Until ${formatDay(a.to)}, aim for about ${Math.round(a.loadFactor * 100)}% of your usual loads and stop at ${a.effortCap} effort. Not a calendar ritual: a response to what your sessions are showing.`,
        changes: [`Targets in Train show about ${Math.round(a.loadFactor * 100)}% of your usual loads until ${formatDay(a.to)}`, 'No max-effort sets this week'], acceptLabel: 'Start the easier week' };
  }
}

/** Proposals for the inbox: no next-session targets (Train shows those), nothing snoozed. */
export function suggestionsFrom(report: FindingsReport, coach: { snoozedUntil: Record<string, string> }, ctx: RenderContext): Suggestion[] {
  return report.proposals
    .filter(p => p.kind !== 'load_next')
    .filter(p => { const until = coach.snoozedUntil[p.dismissKey]; return !until || until < ctx.today; })
    .map(p => renderProposal(p, report, ctx));
}

/** Local notification body for a training-day nudge. */
export function nudgeBody(split: string, weekday?: Weekday, start?: { hour: number; minute: number }): string {
  if (weekday && start) return `Your usual ${WEEKDAY_LABEL[weekday]} session is around ${clock(start.hour, start.minute)}. ${split} is ready when you are.`;
  return `${split} is ready when you are.`;
}
