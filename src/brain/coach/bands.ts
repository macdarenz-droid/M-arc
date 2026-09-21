/**
 * Thresholds the detectors and planners use. Each one is a band or a gate,
 * not a law; docs/RESEARCH.md says which card each rests on. Change them
 * here, and the tests that pin them.
 */
import type { Effort } from '@/core/models';
import type { MuscleId } from '@/data/muscles';

/** Weekly effective sets per muscle. Above this we say so (volume_dose_response). Deliberately wide. */
export const WEEKLY_SETS_HIGH = 25;
/** Below this for a muscle the user does train, the volume is thin. Informational only. */
export const WEEKLY_SETS_LOW = 4;
/** A major muscle averaging under this many effective sets a week for four weeks counts as untouched. Half-sets from secondary work count, so one compound's spill-over does not clear it. */
export const UNCOVERED_MAX_SETS = 2;

/** Volume trend: last 3 complete weeks against the median of the 8 before them. */
export const VOLUME_RECENT_WEEKS = 3;
export const VOLUME_BASELINE_WEEKS = 8;
export const VOLUME_DROP_RATIO = 0.75;
export const VOLUME_SPIKE_RATIO = 1.5;
/** Baseline median below this is too small to call a drop. */
export const VOLUME_MIN_BASELINE_SETS = 6;
/** Recent mean below this is too small to call a spike. */
export const VOLUME_MIN_SPIKE_SETS = 10;

/** Minimum history before trend and habit detectors speak. */
export const MIN_WEEKS_OF_DATA = 6;

/** A muscle below this percent recovered is worth mentioning (recovery_time_course). */
export const RECOVERY_FLAG_PCT = 75;
/** Below this, today's plan swaps exercises that target the muscle. */
export const RECOVERY_SWAP_PCT = 60;
/** Volume can widen a recovery window by at most this factor. It never shrinks it. */
export const RECOVERY_VOLUME_FACTOR_MAX = 1.5;

/** Habit learning (habit_formation_and_cues). */
export const HABIT_WINDOW_WEEKS = 12;
export const HABIT_HALF_LIFE_WEEKS = 6;
export const HABIT_MIN_PROBABILITY = 0.6;
export const HABIT_MIN_COUNT = 4;
/** A habitual day with no session for this many weeks is retired. */
export const HABIT_COLD_WEEKS = 3;
/** Nudge this many minutes before the learned start time. */
export const HABIT_NUDGE_LEAD_MINUTES = 60;

/** Short sleep, the cut most sleep-loss studies use (sleep_and_performance). */
export const SLEEP_SHORT_MINUTES = 360;

/**
 * Morning check-in (sleep, soreness, stress; subjective_readiness_monitoring),
 * each 1 (worst) to 5 (best). Average at or below this is a low-readiness day.
 */
export const READINESS_LOW_AVG = 2.5;
/** A low-readiness day widens today's recovery windows like extra volume does, up to this factor. Combined with the volume factor by taking whichever is larger, never multiplied, and still capped by RECOVERY_VOLUME_FACTOR_MAX. */
export const READINESS_RECOVERY_FACTOR_MAX = 1.3;
/** One low morning says little on its own (subjective_readiness_monitoring); the coach only speaks up once at least this many of the trailing check-ins, today included, were low. */
export const READINESS_PATTERN_MIN_LOW = 2;
export const READINESS_PATTERN_WINDOW_DAYS = 7;

/**
 * A session note tagged "fatigue" widens that session's own recovery
 * window, the same way a low morning check-in does (subjective_readiness_monitoring
 * applies just as well to a post-session reading as a pre-session one — one
 * reading alone is still a weak signal, so this stays the same size as
 * READINESS_RECOVERY_FACTOR_MAX rather than stacking on top of it). Combined
 * with the volume and readiness factors by taking whichever is largest,
 * never multiplied, and still capped by RECOVERY_VOLUME_FACTOR_MAX.
 */
export const FATIGUE_RECOVERY_FACTOR = READINESS_RECOVERY_FACTOR_MAX;

export const LONG_GAP_DAYS = 7;
export const REENTRY_GAP_DAYS = 28;
export const FIRST_SESSIONS_COUNT = 4;

/** The app's three effort levels as reps-in-reserve bands (effort_rir_scale). */
export const RIR_BAND: Record<Effort, [number, number]> = { easy: [4, 6], ideal: [1, 3], max: [0, 1] };

/** Rest default the app suggests for strength goals, in seconds (rest_intervals). */
export const REST_STRENGTH_SEC = 150;
export const REST_SHORT_SEC = 120;

/**
 * Live rest grading (rest_intervals). The person's own restDefaultSec is the
 * base and is never overridden — these only bend it, and only once they have
 * actually rated the set. Harder sets and compound lifts get longer rests;
 * an easy set gets a shorter one.
 */
export const REST_EFFORT_MULT: Record<Effort, number> = { easy: 0.8, ideal: 1, max: 1.25 };
/** A compound earns a longer rest than an isolation at the same effort. */
export const REST_COMPOUND_MULT = 1.2;
/** Graded rests round to this, keeping the multiplier more accurate than the 15-second UI step. */
export const REST_ROUND_SEC = 5;
/** Hard bounds on any rest timer, in seconds. */
export const REST_FLOOR_SEC = 15;
export const REST_CEIL_SEC = 600;
/** Remaining-time floor used by the later timer integration. */
export const REST_MIN_REMAINING_SEC = 5;

/** Maximum number of mid-session substitutes offered at once. */
export const MAX_SUBSTITUTES = 3;
/** Minimum adjusted muscle recovery required for a substitute. */
export const SUBSTITUTE_MIN_READY = 75;

/** Muscles a general programme is expected to cover. Used by uncovered_muscle. */
export const MAJOR_MUSCLES: MuscleId[] = [
  'chest', 'lats', 'mid_back', 'rear_delts', 'side_delts', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'calves', 'abs',
];

export const COMPOUND_PATTERN = /squat|hip_hinge|horizontal_push|vertical_push|vertical_pull|horizontal_pull|incline_push|lunge|single_leg_squat/;

/** Swap at most this many stalled lifts per report. When most lifts stall at once the problem is the programme, not the exercise. */
export const MAX_SWAPS_PER_REPORT = 2;

/** Deload signal: at least this many lifts declining together. */
export const DELOAD_MIN_DECLINES = 2;
export const DELOAD_MIN_RECENT_SESSIONS = 6;
export const DELOAD_LOAD_FACTOR = 0.85;
