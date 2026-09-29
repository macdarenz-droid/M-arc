// V1-04: the solver core (docs/FORM-GUIDE-PRODUCTION.md §10.5 V1-04, D-FG7 (b)).
import { describe, expect, it } from 'vitest';
import { frontFrame, handAt, solveFrontArm } from '@/formguide/rig/pose';
import { residual, solveFrontChain } from '@/formguide/solve/frontChain';

describe('V1-04 A10: the front chain is solved to a fixed point', () => {
  // a raised arm (the target is where 120° of abduction and 60° of lead put the hand); the pose starts at the stored 10°
  const target = handAt(frontFrame('seated', { shoulder_abd_r: 120, elbow_lead_r: 60 }), 'r');
  it('one pass of solveFrontArm leaves the hand more than 1e-6 off (the rise of the old abduction)', () => {
    const one = solveFrontArm('seated', {}, 'r', target);
    const r = residual('seated', { shoulder_abd_r: one.shoulder_abd, elbow_lead_r: one.elbow_lead }, 'r', target);
    console.info(`[V1-04 A10] one pass: ${r.toExponential(2)} units`);
    expect(r).toBeGreaterThan(1e-6);
  });
  it('the fixed point puts it within 1e-6, on both sides', () => {
    for (const s of ['r', 'l'] as const) {
      const t = handAt(frontFrame('seated', { [`shoulder_abd_${s}`]: 120, [`elbow_lead_${s}`]: 60 }), s);
      const x = solveFrontChain('seated', {}, s, t), r = residual('seated', { [`shoulder_abd_${s}`]: x.shoulder_abd, [`elbow_lead_${s}`]: x.elbow_lead }, s, t);
      console.info(`[V1-04 A10] fixed point ${s}: ${r.toExponential(2)} units`);
      expect(r).toBeLessThanOrEqual(1e-6);
      expect(x.shoulder_abd).toBeCloseTo(120, 6);
    }
  });
});
