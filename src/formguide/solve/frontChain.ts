// V1-04: the front arm's chain solve (D-FG7 (b), A10). pose.ts solveFrontArm places the shoulder by the rise of the
// pose's OLD shoulder_abd (pose.ts riseOf), so one pass leaves the hand off its target whenever the answer changes the
// rise (above 30° of abduction). This wraps it, without editing pose.ts, in a fixed-point loop: solve, re-place the
// shoulder by the new abduction, solve again, until the abduction stops moving. Pure, no DOM.
import type { ChannelId, Pose } from '../rig/joints';
import type { Pt } from '../rig/ik';
import { frontFrame, handAt, solveFrontArm, type PoseId } from '../rig/pose';

/** Iterations before the loop gives up; the rise's slope is at most 10/3 · π/180 per degree, so it converges fast. */
const MAX_IT = 50;

/** shoulder_abd and elbow_lead that put the wrist pivot on `hand`, the shoulder's rise consistent with the answer. */
export function solveFrontChain(id: PoseId, pose: Pose, s: 'l' | 'r', hand: Pt, tol = 1e-10): { shoulder_abd: number; elbow_lead: number } {
  const abd = `shoulder_abd_${s}` as ChannelId, lead = `elbow_lead_${s}` as ChannelId;
  let p: Pose = { ...pose }, out = solveFrontArm(id, p, s, hand);
  for (let it = 0; it < MAX_IT; it++) {
    const prev = p[abd];
    p = { ...p, [abd]: out.shoulder_abd, [lead]: out.elbow_lead };
    if (prev !== undefined && Math.abs(out.shoulder_abd - prev) < tol) return out;
    out = solveFrontArm(id, p, s, hand);
  }
  const r = residual(id, { ...p, [abd]: out.shoulder_abd, [lead]: out.elbow_lead }, s, hand);
  throw new Error(`front chain ${s}: no fixed point after ${MAX_IT} passes (hand ${r.toFixed(6)} units off)`);
}

/** Distance of the drawn wrist pivot from the target. */
export const residual = (id: PoseId, pose: Pose, s: 'l' | 'r', hand: Pt): number => {
  const h = handAt(frontFrame(id, pose), s);
  return Math.hypot(h[0] - hand[0], h[1] - hand[1]);
};
