/** Weekly volume vs. the user's own recent history and a level-based landmark band (F3.2). */
import type { Exercise, Session } from '@/core/models';
import { MUSCLE_IDS, type MuscleId } from '@/data/muscles';
import { VOLUME_BANDS, VOLUME_OFFSET } from '@/data/volume';
import { weeklyMuscleSets, trainingLevels } from './exposure';

export function volumeBands(levelIndex: number, muscle: MuscleId): [number, number] {
  const [lo, hi] = VOLUME_BANDS[Math.max(0, Math.min(levelIndex, VOLUME_BANDS.length - 1))]!;
  const off = (VOLUME_OFFSET as Partial<Record<MuscleId, number>>)[muscle] ?? 0;
  return [Math.max(0, lo + off), hi + off];
}

function median(xs: number[]): number {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)]!;
}

export type VolumeStatus = 'under' | 'in' | 'over' | 'unknown';

export interface MuscleVolumeStatus {
  muscle: MuscleId;
  status: VolumeStatus;
  thisWeekSets: number;
  medianSets: number;
  band: [number, number];
}

/** This week's effective sets per muscle vs. the 4-week median and the level's band. 'unknown' when there's no work at all to judge. */
export function muscleVolumeStatus(sessions: Session[], today: string, custom: Exercise[] = []): MuscleVolumeStatus[] {
  const weekly = weeklyMuscleSets(sessions, today, 4, custom);
  const levels = trainingLevels(sessions, custom);
  return MUSCLE_IDS.map(muscle => {
    const thisWeekSets = weekly[0]?.sets[muscle] ?? 0;
    const medianSets = median(weekly.map(w => w.sets[muscle] ?? 0));
    const band = volumeBands(levels[muscle].levelIndex, muscle);
    const status: VolumeStatus = !thisWeekSets && !medianSets ? 'unknown' : thisWeekSets < band[0] ? 'under' : thisWeekSets > band[1] ? 'over' : 'in';
    return { muscle, status, thisWeekSets: Math.round(thisWeekSets * 10) / 10, medianSets: Math.round(medianSets * 10) / 10, band };
  });
}
