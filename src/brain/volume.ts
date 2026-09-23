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
  /** This week so far: for display only. */
  thisWeekSets: number;
  /** The last completed week: what the status is judged on (BR-07). */
  lastWeekSets: number;
  medianSets: number;
  band: [number, number];
}

/**
 * Volume per muscle vs. the level's band, judged on completed weeks (BR-07): 'under' only after
 * two completed weeks below the band, 'over' when this or last week is above it, 'unknown' with
 * no work in four weeks. A Monday no longer reads every muscle as under.
 */
export function muscleVolumeStatus(sessions: Session[], today: string, custom: Exercise[] = []): MuscleVolumeStatus[] {
  const weekly = weeklyMuscleSets(sessions, today, 4, custom);
  const levels = trainingLevels(sessions, custom);
  return MUSCLE_IDS.map(muscle => {
    const w = [0, 1, 2, 3].map(i => weekly[i]?.sets[muscle] ?? 0);
    const [thisWeekSets, lastWeekSets, twoWeeksAgo] = [w[0]!, w[1]!, w[2]!];
    const medianSets = median(w);
    const band = volumeBands(levels[muscle].levelIndex, muscle);
    const status: VolumeStatus = w.every(v => v === 0) ? 'unknown'
      : Math.max(thisWeekSets, lastWeekSets) > band[1] ? 'over'
      : lastWeekSets < band[0] && twoWeeksAgo < band[0] ? 'under' : 'in';
    const r1 = (x: number) => Math.round(x * 10) / 10;
    return { muscle, status, thisWeekSets: r1(thisWeekSets), lastWeekSets: r1(lastWeekSets), medianSets: r1(medianSets), band };
  });
}
