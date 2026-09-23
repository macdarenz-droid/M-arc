import { describe, it, expect } from 'vitest';
import { CUES, lane, mindsetForDay, pickReasonCue, reasonKeyFor } from '@/brain/coach/cues';
import { LIBRARY, makeCustomExercise } from '@/core/exercises';

describe('every coaching cue can be shown (ST-17)', () => {
  const reasonKeys = new Set(
    ['start', 'confirm_effort', 'confirm', 'hold', 'increase', 'reduce', 'plateau', 'reentry', 'reps', 'duration', 'deload']
      .flatMap(m => ['low', 'medium', 'high'].flatMap(c => ['weighted', 'conditioning'].map(x => reasonKeyFor(m, c, x)))),
  );
  it('each cue is reachable by an exercise, a reason, or the mindset slot', () => {
    const mindset = new Set(Array.from({ length: 40 }, (_, d) => mindsetForDay(d)?.id).filter(Boolean));
    const unreachable = CUES.filter(c => {
      if (c.kind === 'mindset') return !mindset.has(c.id);
      // A custom exercise with unlisted equipment ('Other') is how the 'General' cues are reached.
      const pool = [...LIBRARY, makeCustomExercise({ id: 'custom_x', name: 'Odd thing', equipment: 'Other', primary: [] })];
      if (pool.some(ex => lane(c, ex) >= 0)) return false;
      return !(c.reasons ?? []).some(r => reasonKeys.has(r));
    }).map(c => c.id);
    expect(unreachable).toEqual([]);
  });
  it('the reason cue follows the suggestion', () => {
    expect(pickReasonCue(reasonKeyFor('increase', 'high'), 'x')!.reasons).toContain('increase');
    expect(pickReasonCue(reasonKeyFor('deload', 'high'), 'x')).toBeNull();
    expect(mindsetForDay(2)).toBeNull();
    expect(mindsetForDay(3)?.kind).toBe('mindset');
  });
});
