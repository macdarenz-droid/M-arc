// FG-1: rig/ik.ts. The solve3 test is ported unchanged from GU-7a (PR #40, tests/formguide/rig.test.ts); A5 solves the
// lab's arm to the lab's dumbbell path.
import { describe, expect, it } from 'vitest';
import { solve2, solve3 } from '@/formguide/rig/ik';
import { frontFrame, handAt, solveFrontArm } from '@/formguide/rig/pose';
import { T, labChannels, pose2d, screenFist } from './fixtures/labFront';

describe('two-bone solve (ported from GU-7a)', () => {
  it('solve3 keeps both bones full length in 3D and throws when the grip is out of reach', () => {
    const r = solve3([0, 0, 0], [30, 50, 10], 38, 40, [0, 1, 1]);
    const d = (a: number[], b: number[]) => Math.hypot(...a.map((x, i) => x - b[i]!));
    expect(d(r.E, [0, 0, 0])).toBeCloseTo(38, 9);
    expect(d(r.E, [30, 50, 10])).toBeCloseTo(40, 9);
    expect(() => solve3([0, 0, 0], [0, 90, 0], 38, 40, [0, 1, 0])).toThrow(/unreachable/);
  });
  it('solve2 keeps both bones full length in the plane, bends to the asked side and throws out of reach', () => {
    const S: [number, number] = [0, 0], G: [number, number] = [50, 20];
    for (const bend of [1, -1] as const) {
      const E = solve2(S, G, 38, 40, bend);
      expect(Math.hypot(E[0], E[1])).toBeCloseTo(38, 9);
      expect(Math.hypot(G[0] - E[0], G[1] - E[1])).toBeCloseTo(40, 9);
      const cross = G[0] * E[1] - G[1] * E[0];     // < 0: E left of S→G on screen (y down)
      expect(Math.sign(cross)).toBe(-bend);
    }
    expect(() => solve2(S, [0, 90], 38, 40, 1)).toThrow(/unreachable/);
    expect(() => solve2(S, [0, 1], 38, 40, 1)).toThrow(/unreachable/);
  });
});

describe('A5 the lab arm solved to the lab dumbbell path', () => {
  it('481 samples of the correct rep: the solved arm puts the hand within 0.5 units of the path', () => {
    let worst = 0;
    for (let i = 0; i <= 480; i++) {
      const Q = pose2d('correct', (i / 480) * T * 0.9999, 0), target = screenFist(Q), pose = labChannels(Q);
      const { shoulder_abd, elbow_lead } = solveFrontArm('standing', pose, 'r', target);
      const hand = handAt(frontFrame('standing', { ...pose, shoulder_abd_r: shoulder_abd, elbow_lead_r: elbow_lead }), 'r');
      worst = Math.max(worst, Math.hypot(hand[0] - target[0], hand[1] - target[1]));
      // the solve finds the lab's own arm (one bend direction, the lab's)
      expect(shoulder_abd).toBeCloseTo(Q.thDeg, 3);
      expect(elbow_lead).toBeCloseTo(Q.leadDeg, 3);
    }
    console.info(`[FG-1] A5 worst hand error over 481 samples: ${worst.toExponential(2)} units`);
    expect(worst).toBeLessThan(0.5);
  });
});
