/** F8's data: weekly volume, oldest week first so the right-hand bar is this week (QA-R6-2). */
import type { Exercise, LoadUnit, Session } from '@/core/models';
import { kgToDisplay } from '@/core/units';
import { weeklyVolumeHistory } from '@/brain/weekly';

export function volumeChartWeeks(sessions: Session[], today: string, custom: Exercise[], unit: LoadUnit, weeks = 12): Array<{ week: string; value: number }> {
  // weeklyVolumeHistory lists this week first.
  return weeklyVolumeHistory(sessions, today, weeks, custom).map(w => ({ week: w.week, value: kgToDisplay(w.volumeKg, unit) })).reverse();
}
