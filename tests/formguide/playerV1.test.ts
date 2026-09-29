// V1-19: the player standard of docs/FORM-GUIDE-PRODUCTION.md §1 (readouts, guides, hotspots) and GU-7a parity.
// Node only: readouts.ts, guides.ts and hotspots.ts are pure; the DOM side is the gate's V1-19 block.
import { describe, expect, it } from 'vitest';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { poseAt, repSeconds } from '@/formguide/sample';
import { effortOf } from '@/formguide/check/effort';
import { REPS, guideRig } from '@/formguide/player/guideView';
import { fmtDeg, fmtPct, readoutAt, workingChannel } from '@/formguide/player/readouts';

const rig = guideRig(LR, 'shoulder_abduction');
const LEN = repSeconds(LR.tempo) * 1000;

describe('V1-19 A1: readouts match poseAt within 1° and effort within 2%, at 10 sampled times', () => {
  const times = Array.from({ length: 10 }, (_, i) => Math.round(((i + 0.37) / 10) * REPS * LEN));

  it('the working joint of the lateral raise is the right shoulder abduction', () => {
    expect(workingChannel(LR)).toBe('shoulder_abd_r');
  });

  for (const figure of ['correct', 'mistake'] as const) it(`${figure}: angle and effort at each time`, () => {
    for (const ms of times) {
      // the chained timeline: rep r of the correct figure is its own slowed rep; the mistake repeats its one rep
      const r = Math.min(REPS - 1, Math.floor(ms / LEN)), u = (ms - r * LEN) / LEN, rep = figure === 'mistake' ? 0 : r;
      const want = poseAt(LR, u, figure, rep).shoulder_abd_r;
      const got = readoutAt(LR, rig, figure, ms);
      expect(got.rep).toBe(r + 1);
      expect(got.angle!.channel).toBe('shoulder_abd_r');
      expect(Math.abs(got.angle!.deg - want)).toBeLessThanOrEqual(1);
      expect(Math.abs(parseFloat(fmtDeg(got.angle!.deg)) - want)).toBeLessThanOrEqual(1);
      const eff = effortOf(LR, figure, rep, rig);
      if (typeof eff === 'string') throw new Error(eff);
      const e = eff(u);
      expect(got.effort.map(x => x.id).sort()).toEqual(['front_delts', 'side_delts', 'upper_traps']);
      for (const x of got.effort) {
        expect(Math.abs(x.v - e[x.id]!)).toBeLessThanOrEqual(0.02);
        expect(Math.abs(parseFloat(fmtPct(x.v)) - 100 * e[x.id]!)).toBeLessThanOrEqual(2);
      }
    }
  });
});
