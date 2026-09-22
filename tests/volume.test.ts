import { describe, expect, it } from 'vitest';
import { volumeBands, muscleVolumeStatus } from '@/brain/volume';
import { session, sets } from './helpers';

describe('volumeBands (F3.2)', () => {
  it('gives the New-level band with no offset', () => {
    expect(volumeBands(0, 'chest')).toEqual([4, 8]);
  });
  it('shifts the band up for side delts', () => {
    expect(volumeBands(0, 'side_delts')).toEqual([6, 10]);
  });
  it('shifts the band down for lower back', () => {
    expect(volumeBands(0, 'lower_back')).toEqual([2, 6]);
  });
  it('reuses the Advanced band past levelIndex 4', () => {
    expect(volumeBands(6, 'chest')).toEqual(volumeBands(4, 'chest'));
  });
});

describe('muscleVolumeStatus (F3.2)', () => {
  const today = '2026-09-18';
  it('is unknown for a muscle with no history at all', () => {
    const rows = muscleVolumeStatus([], today);
    expect(rows.find(r => r.muscle === 'chest')!.status).toBe('unknown');
  });
  it('is under band with too few sets this week for a new lifter', () => {
    const s = [session(today, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, 'ideal', 2) }])];
    const row = muscleVolumeStatus(s, today).find(r => r.muscle === 'chest')!;
    expect(row.status).toBe('under');
    expect(row.thisWeekSets).toBe(2);
  });
  it('is over band with many sets this week for a new lifter', () => {
    const s = [session(today, [{ id: 'lib_barbell_bench_press', sets: sets(60, 8, 'ideal', 12) }])];
    const row = muscleVolumeStatus(s, today).find(r => r.muscle === 'chest')!;
    expect(row.status).toBe('over');
  });
});
