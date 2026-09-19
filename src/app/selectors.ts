/** Derived, memoised views over the store that several screens share. */
import { computed, signal } from '@preact/signals';
import { state } from '@/core/store';
import { todayKey, weekdayOf } from '@/core/dates';
import { WEEKDAYS } from '@/core/models';
import type { MuscleRecovery } from '@/brain/recovery';
import { trainingStreak, weekSummary } from '@/brain/weekly';
import { buildReport } from '@/brain/coach/report';
import { contextFromState } from '@/brain/coach/context';
import { adjustedRecovery } from '@/brain/coach/detectors';
import { dailySpark, insightsFrom, suggestionsFrom, type RenderContext } from '@/brain/coach/words';
import { deloadActive } from '@/brain/coach/deload';

/** The current day key. Re-evaluated every minute so midnight rolls over. */
export const today = signal(todayKey());
setInterval(() => { const k = todayKey(); if (k !== today.value) today.value = k; }, 60_000);

/** A clock that ticks every second while something needs it (session, rest). */
export const nowMs = signal(Date.now());
let ticker: ReturnType<typeof setInterval> | null = null;
export function setTicking(on: boolean): void {
  if (on && !ticker) ticker = setInterval(() => { nowMs.value = Date.now(); }, 1000);
  if (!on && ticker) { clearInterval(ticker); ticker = null; }
}
/** The clock rounded to the minute, so the brain re-runs at most once a minute. */
export const nowMinute = computed(() => nowMs.value - (nowMs.value % 60_000));

export const unit = computed(() => state.value.preferences.weightUnit);
export const splitById = (id: string) => state.value.splits.find(s => s.id === id);
export const plannedPerWeek = computed(() => WEEKDAYS.filter(d => state.value.schedule[d]).length);

/** An accepted plan for today, if any. It overrides the schedule for today only. */
export const todayPlan = computed(() => { const p = state.value.coach.todayPlan; return p && p.day === today.value ? p : null; });
export const scheduledSplitId = computed(() => todayPlan.value?.splitId ?? state.value.schedule[weekdayOf(today.value)]);
export const scheduledSplit = computed(() => { const id = scheduledSplitId.value; return id ? splitById(id) : undefined; });
export const todayChanges = computed(() => todayPlan.value?.changes ?? []);

const brainContext = computed(() => contextFromState(state.value, today.value, nowMinute.value));

/** Recovery with the session's volume taken into account, the same numbers the coach uses. */
export const recovery = computed<MuscleRecovery[]>(() => adjustedRecovery(brainContext.value).map(r => ({
  muscle: r.muscle, pct: r.adjustedPct, hoursLeft: r.adjustedHoursLeft, windowHours: r.adjustedWindowHours,
  lastTrainedAt: r.lastTrainedAt, lastDay: r.lastDay, personalized: r.personalized, recovering: r.adjustedPct < 100,
})));
export const week = computed(() => weekSummary(state.value.sessions, today.value, state.value.customExercises, plannedPerWeek.value || 3));
export const streak = computed(() => trainingStreak(state.value.sessions, state.value.schedule, today.value));

/** The brain's report: facts and suggestions, recomputed when state or the minute changes. */
export const report = computed(() => buildReport(brainContext.value));
const renderContext = computed<RenderContext>(() => ({ unit: state.value.preferences.weightUnit, splits: state.value.splits, custom: state.value.customExercises, today: today.value, goal: state.value.goal }));
export const insights = computed(() => insightsFrom(report.value, renderContext.value));
/** One true line about this person's own training, free and instant. Null falls back to the standing quote. */
export const spark = computed(() => dailySpark(insights.value, today.value));
export const suggestions = computed(() => suggestionsFrom(report.value, state.value.coach, renderContext.value));
export const todaySuggestion = computed(() => suggestions.value.find(s => s.kind === 'today_plan'));
export const deload = computed(() => (deloadActive(state.value.coach.deload, today.value) ? state.value.coach.deload : null));

export const sessionsToday = computed(() => state.value.sessions.filter(s => s.day === today.value));
