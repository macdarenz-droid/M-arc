/**
 * F3.3: when the coach should offer a lighter week, reactive only. Any one of:
 *  (a) two or more main lifts plateaued or declining,
 *  (b) effort drifting harder on two or more lifts while weekly volume keeps rising,
 *  (c) a muscle's weekly sets have run above its band for two weeks straight, together with a
 *      plateaued or declining active main lift (D9),
 *  (d) readiness has read red on three or more of the last five days.
 * `readinessHistory` is the band for each of the last 5 days (index 0 = today), as scored by
 * derive() in coach/rules.ts — this module only counts them, it doesn't compute readiness itself.
 */
import type { Exercise, Session } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { exerciseHistory, isActive, modeOf } from './history';
import { effortDrift } from './effort';
import { plateauStatus } from './trend';
import { weeklyMuscleSets } from './exposure';
import { volumeBands } from './volume';
import { trainingLevels } from './exposure';
import { MUSCLE_IDS } from '@/data/muscles';
import type { ReadinessBand } from './readiness';

export interface DeloadSuggestion {
  suggest: boolean;
  reason: string;
}

function mainLiftIds(sessions: Session[], custom: Exercise[]): string[] {
  const ids = new Set<string>();
  for (const s of sessions) for (const e of s.exercises) ids.add(e.exerciseId);
  return [...ids].filter(id => findExercise(id, custom)?.role === 'main');
}

export function deloadTrigger(sessions: Session[], today: string, custom: Exercise[] = [], readinessHistory: Array<ReadinessBand | null> = []): DeloadSuggestion {
  const mainIds = mainLiftIds(sessions, custom);
  // Only lifts trained in the last six weeks count (BR-05).
  const lifts = mainIds.map(id => ({ id, h: exerciseHistory(sessions, id, custom) })).filter(x => isActive(x.h, today));
  const histories = lifts.map(x => x.h);

  const stalled = lifts.filter(({ id, h }) => {
    const status = plateauStatus(h, modeOf(id, custom)).status;
    return status === 'plateaued' || status === 'declining';
  });
  const plateauedOrDeclining = stalled.length;
  if (plateauedOrDeclining >= 2) {
    return { suggest: true, reason: 'Two or more main lifts have plateaued or slipped over recent sessions.' };
  }

  const totalsByWeek = weeklyMuscleSets(sessions, today, 3, custom).map(w => Object.values(w.sets).reduce((a, v) => a + (v ?? 0), 0));
  const volumeRising = totalsByWeek.length === 3 && totalsByWeek[0]! >= totalsByWeek[1]! && totalsByWeek[1]! >= totalsByWeek[2]! && totalsByWeek[0]! > totalsByWeek[2]!;
  const harderCount = histories.filter(h => effortDrift(h).status === 'harder').length;
  if (harderCount >= 2 && volumeRising) {
    return { suggest: true, reason: 'Effort has been drifting harder on two or more lifts while weekly volume keeps climbing.' };
  }

  const levels = trainingLevels(sessions, custom);
  const weekly = weeklyMuscleSets(sessions, today, 2, custom);
  const overBandTwoWeeks = MUSCLE_IDS.some(m => {
    const [, hi] = volumeBands(levels[m].levelIndex, m);
    return (weekly[0]?.sets[m] ?? 0) > hi && (weekly[1]?.sets[m] ?? 0) > hi;
  });
  // D9: volume above the band has diminishing returns but no harm threshold, so on its own it
  // is not a reason to back off; only together with a stalled active main lift.
  if (overBandTwoWeeks && plateauedOrDeclining >= 1) {
    return { suggest: true, reason: 'A muscle has run above its usual weekly range for two weeks while a main lift has stalled.' };
  }

  const redDays = readinessHistory.filter(b => b === 'red').length;
  if (redDays >= 3) {
    return { suggest: true, reason: 'Readiness has read red on three or more of the last five days.' };
  }

  return { suggest: false, reason: '' };
}
