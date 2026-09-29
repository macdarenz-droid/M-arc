// V1-07 `balance` (docs/FORM-GUIDE-PRODUCTION.md §10.5): a standing figure keeps its centre of mass over its foot base.
// Segment masses and centre-of-mass positions are de Leva 1996 (P. de Leva, "Adjustments to Zatsiorsky-Seluyanov's
// segment inertia parameters", J. Biomech. 29(9):1223-1230), male, as tabled by Visual3D ("Adjusted
// Zatsiorsky-Seluyanov's segment inertia parameters", wiki.has-motion.com): mass as a share of the body, CM as a share
// of the segment from its proximal end. The rig has no cervicale or hand length, so the head's CM is the centre of its drawn
// skull (de Leva's head CM sits at 50.02 % of vertex to cervicale, the skull's middle), the trunk neck pivot to hip centre, and the hand's CM is its
// grip (the rig's hand point is the wrist; 0.61 % of the body). A held load is not added: the rig does not know its
// mass. The foot base is the floor span of both feet as drawn (the ankle groups' shapes within FOOT_Y of the floor).
import type { JointId } from '../rig/joints';
import type { Pt } from '../rig/ik';
import type { Frame } from '../rig/pose';
import { bbox, type Compiled } from './svg';
import type { Rig } from './view';

/** de Leva 1996, male: segment mass (share of body mass) and CM from the proximal end (share of segment length). */
export const DE_LEVA = {
  head: { mass: 0.0694, cm: 0.5002 }, trunk: { mass: 0.4346, cm: 0.5138 }, upperArm: { mass: 0.0271, cm: 0.5772 },
  forearm: { mass: 0.0162, cm: 0.4574 }, hand: { mass: 0.0061, cm: 0.79 }, thigh: { mass: 0.1416, cm: 0.4095 },
  shank: { mass: 0.0433, cm: 0.4395 }, foot: { mass: 0.0137, cm: 0.4415 },
} as const;
/** Shapes of the ankle groups whose lowest point is this close to the floor draw the foot (units). */
export const FOOT_Y = 12;

const lerp = (a: Pt, b: Pt, t: number): Pt => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

/** The body's centre of mass in figure space; `head` is the head group's drawing (groupOf). */
export function centreOfMass(rig: Rig, f: Frame, head: Compiled): Pt {
  const P = (j: JointId) => rig.pivot(f, j), L = DE_LEVA;
  const hipMid = lerp(P('hip_l'), P('hip_r'), 0.5);
  const seg: [number, Pt][] = [
    [L.head.mass, (() => { const b = bbox(head, f); return [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2] as Pt; })()],
    [L.trunk.mass, lerp(P('neck'), hipMid, L.trunk.cm)],
  ];
  for (const s of ['l', 'r'] as const) {
    seg.push(
      [L.upperArm.mass, lerp(P(`shoulder_${s}`), P(`elbow_${s}`), L.upperArm.cm)],
      [L.forearm.mass, lerp(P(`elbow_${s}`), P(`wrist_${s}`), L.forearm.cm)],
      [L.hand.mass, rig.point(f, `hand_${s}`)],
      [L.thigh.mass, lerp(P(`hip_${s}`), P(`knee_${s}`), L.thigh.cm)],
      [L.shank.mass, lerp(P(`knee_${s}`), P(`ankle_${s}`), L.shank.cm)],
      [L.foot.mass, lerp(P(`ankle_${s}`), rig.point(f, `foot_${s}`), L.foot.cm)],
    );
  }
  const m = seg.reduce((a, [w]) => a + w, 0);
  return seg.reduce<Pt>((a, [w, p]) => [a[0] + (w * p[0]) / m, a[1] + (w * p[1]) / m], [0, 0]);
}

/** The shapes drawn inside the joint groups whose key matches `key` (the group and everything nested in it). */
export function groupOf(c: Compiled, key: RegExp): Compiled {
  const under = (n: number): boolean => { for (let i = n; i >= 0; i = c.nodes[i]!.parent) if (key.test(c.nodes[i]!.key ?? '')) return true; return false; };
  return { nodes: c.nodes, shapes: c.shapes.filter(s => under(s.node)) };
}
/** The shapes that draw the feet: in an ankle group, reaching within FOOT_Y of the floor at rest. */
export function feetOf(c: Compiled, floor: number): Compiled {
  const a = groupOf(c, /^ankle_[lr]$/);
  return { nodes: c.nodes, shapes: a.shapes.filter(s => bbox({ nodes: c.nodes, shapes: [s] }, {}).y1 >= floor - FOOT_Y) };
}
