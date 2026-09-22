/** Derived, memoised views over the store that several screens share. */
import { computed, signal } from '@preact/signals';
import { state } from '@/core/store';
import { todayKey, weekdayOf, daysBetween } from '@/core/dates';
import { recoveryStatus } from '@/brain/recovery';
import { readiness } from '@/brain/readiness';
import { coachInsights, deloadOffer, type CoachContext } from '@/brain/coach/rules';
import { trainingStreak, weekSummary } from '@/brain/weekly';
import { shouldShowOnboarding } from '@/brain/onboarding';
import { WEEKDAYS } from '@/core/models';
import { watchStatus } from '@/native/watch';

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

export const unit = computed(() => state.value.preferences.weightUnit);
export const splitById = (id: string) => state.value.splits.find(s => s.id === id);
export const scheduledSplitId = computed(() => state.value.schedule[weekdayOf(today.value)]);
export const scheduledSplit = computed(() => { const id = scheduledSplitId.value; return id ? splitById(id) : undefined; });
export const plannedPerWeek = computed(() => WEEKDAYS.filter(d => state.value.schedule[d]).length);

const quantizedNow = () => nowMs.value - (nowMs.value % 60_000);
export const recovery = computed(() => recoveryStatus({ sessions: state.value.sessions, custom: state.value.customExercises, now: quantizedNow(), profile: state.value.profile, healthDays: state.value.healthDays, checkIns: state.value.checkIns, freshMarks: state.value.freshMarks, recoveryModel: state.value.recoveryModel }));
export const todayCheckIn = computed(() => state.value.checkIns.find(c => c.day === today.value));
export const todayReadiness = computed(() => readiness({
  today: today.value,
  healthDays: state.value.healthDays,
  checkIn: todayCheckIn.value,
  checkInHistory: state.value.checkIns.filter(c => c.day !== today.value && daysBetween(c.day, today.value) <= 30),
  recovery: recovery.value,
  scheduledSplit: scheduledSplit.value,
  custom: state.value.customExercises,
  sessions: state.value.sessions,
}));
export const week = computed(() => weekSummary(state.value.sessions, today.value, state.value.customExercises, plannedPerWeek.value || 3));
export const streak = computed(() => trainingStreak(state.value.sessions, state.value.schedule, today.value));
export const coachContext = computed((): CoachContext => ({
  sessions: state.value.sessions, splits: state.value.splits, schedule: state.value.schedule, custom: state.value.customExercises,
  today: today.value, now: quantizedNow(), profileHistory: state.value.profileHistory, profile: state.value.profile,
  healthDays: state.value.healthDays, checkIns: state.value.checkIns, freshMarks: state.value.freshMarks,
  recoveryModel: state.value.recoveryModel, deload: state.value.deload, feedback: state.value.insightFeedback,
}));
export const insights = computed(() => coachInsights(coachContext.value, 3));
/** null once its endDay passes — F3.3 "closes itself" is read-time gating, no mutation needed. */
export const activeDeload = computed(() => { const d = state.value.deload; return d && d.endDay >= today.value ? d : null; });
export const deloadSuggestion = computed(() => deloadOffer(coachContext.value));
export const sessionsToday = computed(() => state.value.sessions.filter(s => s.day === today.value));
export const onboardingTrigger = computed(() => {
  const justConnectedWatch = watchStatus.value.state === 'connected' && !state.value.onboarding.watchPromptedAt;
  return shouldShowOnboarding(state.value.profile, state.value.onboarding, today.value, justConnectedWatch);
});
