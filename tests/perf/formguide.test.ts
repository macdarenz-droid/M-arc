/**
 * Form-guide sampling budget (R1-3): opening a guide samples every channel at every stop at run time, so each movement's
 * sampleMove stays under 20 ms, and the stage render and the lat pulldown's tables stay small (scaled to the machine, tests/perf-budget.ts).
 */
import { describe, it } from 'vitest';
import { sampleMove } from '@/formguide/moves/sample';
import { machineChestPress } from '@/formguide/moves/machineChestPress';
import { dumbbellLateralRaise } from '@/formguide/moves/dumbbellLateralRaise';
import { latPulldown } from '@/formguide/moves/latPulldown';
import { makeLatPulldown } from '@/formguide/moves/latPulldown';
import { chestPressStage } from '@/formguide/scenes/chestPress';
import { lateralRaiseStage } from '@/formguide/scenes/lateralRaise';
import { latPulldownStage } from '@/formguide/scenes/latPulldown';
import { expectWithinBudget, timeIt } from '../perf-budget';

describe('form-guide sampling (R1-3)', () => {
  for (const [id, move] of [['machineChestPress', machineChestPress], ['dumbbellLateralRaise', dumbbellLateralRaise], ['latPulldown', latPulldown]] as const) {
    it(`sampleMove(${id}) under 20 ms`, () => {
      expectWithinBudget(`sampleMove(${id})`, timeIt(() => sampleMove(move)), 20);
    });
  }
});

describe('form-guide build cost when a guide opens', () => {
  it('the lat pulldown rig tables (2 x 2001 solved poses, built once per chunk load) under 60 ms', () => {
    expectWithinBudget('makeLatPulldown()', timeIt(() => { makeLatPulldown(); }), 60);
  });
  for (const [id, move, render] of [['machineChestPress', machineChestPress, chestPressStage], ['dumbbellLateralRaise', dumbbellLateralRaise, lateralRaiseStage], ['latPulldown', latPulldown, latPulldownStage]] as const) {
    it(`stage render of ${id} (markup and 4 posed tiles) under 30 ms`, () => {
      const s = sampleMove(move);
      expectWithinBudget(`render(${id})`, timeIt(() => { render(s); }), 30);
    });
  }
});
