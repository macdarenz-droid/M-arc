/**
 * A3-5b (R11, D-A3-5b): Train's exercise card count and Escobar's live read share one rule,
 * `doneSets` (src/slices/workout/doneSets.ts). This pins the rule's behaviour (Train's count is the
 * one it showed before: `entry.sets.filter(isWorkingSet).length`) and that both sides import it.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import type { LoggedSet } from '@/core/models';
import { isWorkingSet } from '@/brain/exposure';
import { countsAsDone, doneSets } from '@/slices/workout/doneSets';

const src = (p: string) => readFileSync(new URL(`../../${p}`, import.meta.url), 'utf8');

describe('A3-5b: one done-count rule for Train and the coach', () => {
  it('is the rule Train\'s card used before: isWorkingSet', () => {
    expect(countsAsDone).toBe(isWorkingSet);
  });

  it('counts typed and saved working sets; never warm-ups or blank rows', () => {
    const rows = [
      { kind: 'warmup', kg: 40, reps: 10, at: '2026-09-22T10:01:00.000Z' },
      { kg: 60, reps: 8, at: '2026-09-22T10:03:00.000Z' },
      { kg: 62.5, reps: 7 },
      { durationSec: 30 },
      {},
      { reps: 0, at: '2026-09-22T10:05:00.000Z' },
    ] as LoggedSet[];
    expect(doneSets(rows)).toEqual([rows[1], rows[2], rows[3]]);
  });

  it('Train\'s card count and the live read both come from doneSets', () => {
    const train = src('src/slices/workout/Train.tsx');
    expect(train).toMatch(/import \{ doneSets \} from '\.\/doneSets';/);
    expect(train).toMatch(/const logged = doneSets\(entry\.sets\)\.length;/);
    const read = src('src/escobar/tools/read.ts');
    expect(read).toMatch(/const done = cur \? doneSets\(cur\.sets\) : \[\];/);
    expect(read).toMatch(/setsDone: done\.length,/);
    expect(read).toMatch(/sets: done\.map\(/);
  });
});
