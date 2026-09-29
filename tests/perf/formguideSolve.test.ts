// V1-04 A7: the contact solver's cost (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-04). Three correct reps (slowed as
// `movement.slowdown` slows them) plus the mistake of the front two-hand press fixture, solved from nothing, in 50 ms.
import { describe, it } from 'vitest';
import type { ExerciseGuide } from '@/formguide/model';
import { sampleGuide } from '@/formguide/sample';
import { inputFor } from '@/formguide/check/node';
import { rigFor, type Rig } from '@/formguide/check/view';
import { expectWithinBudget, timeIt } from '../perf-budget';
import { lib_smith_machine_shoulder_press as FX } from '../formguide/fixtures/solve/lib_smith_machine_shoulder_press';

describe('V1-04 A7: solve cost', () => {
  it('3 reps plus the mistake solve in 50 ms', () => {
    const m = inputFor('tests/formguide/fixtures/solve/lib_smith_machine_shoulder_press.ts', FX).machines!.fx_press!;
    let stops = 0;
    const ms = timeIt(() => {
      // a fresh guide and rig each run: the solve is cached per file and rig, so nothing carries over
      const g = { ...FX, movement: { ...FX.movement, slowdown: [1, 1.08, 1.18] } } as ExerciseGuide, rig: Rig = { ...(rigFor(g, 'front') as Rig), machine: m };
      stops = [0, 1, 2].reduce((n, r) => n + sampleGuide(g, 'correct', r, rig).stops.length, 0) + sampleGuide(g, 'mistake', 0, rig).stops.length;
    });
    console.info(`[V1-04 A7] ${stops} stops, ${ms.toFixed(1)} ms, ${((ms / stops) * 1000).toFixed(1)} µs per stop (2 contacts)`);
    expectWithinBudget('V1-04 solve, 3 reps + mistake', ms, 50);
  });
});
