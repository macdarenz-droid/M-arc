// MO: hand placement and finger wrap around a cylindrical handle, in the hand's rest frame.
// The handle sits across the palm (heel to mid-palm), the fingers close around it until each phalanx touches,
// and the thumb closes over from the other side. Everything is computed from the figure's own finger joints.
import * as THREE from 'three';
import { axisAngle, frameMap, powQ } from './rig.js';

const V = THREE.Vector3;

/** Rest-frame description of one hand: wrist, hand axis d, palm normal n, radial direction r (toward the thumb). */
export function handFrame(rig, side) {
  const m = rig.meta.fingers[side];
  const wrist = rig.rest[`${side}Hand`].pw.clone();
  const d = new V(...m.axisGl).normalize(), n = new V(...m.palmGl).normalize();
  const thumb0 = new V(...m.fingers.Thumb.jointsGl[1]);
  let r = new V().crossVectors(d, n).normalize();
  if (thumb0.clone().sub(wrist).dot(r) < 0) r.negate();
  const len = m.handLength;
  // palm surface: the hand's centre plane plus half its thickness toward the palm
  return { wrist, d, n, r, len, thick: 0.026 };
}

/**
 * Where the handle sits in the hand (rest frame): `at` = fraction of hand length from the wrist,
 * `oblique` = degrees the handle turns across the palm (toward the little finger at the heel), radius in m.
 */
export function handleInHand(hf, { at = 0.40, oblique = 8, radius = 0.016 }) {
  // across the palm, turned so the thumb end sits nearer the fingers and the little-finger end nearer the heel
  const o = THREE.MathUtils.degToRad(oblique);
  const axis = hf.r.clone().multiplyScalar(Math.cos(o)).add(hf.d.clone().multiplyScalar(Math.sin(o))).normalize();
  const centre = hf.wrist.clone().add(hf.d.clone().multiplyScalar(at * hf.len)).add(hf.n.clone().multiplyScalar(hf.thick / 2 + radius));
  return { centre, axis, radius };
}

/** Rotation (figure space) for the hand so that its handle frame matches a handle in the world. */
export function handDeltaFor(hf, inHand, worldAxis, worldPalm) {
  // map (handle axis, palm normal) in rest to (world handle axis, wanted palm normal); palm normal must be
  // perpendicular to the handle axis, so take its component that is.
  const pa = worldPalm.clone().sub(worldAxis.clone().multiplyScalar(worldPalm.dot(worldAxis))).normalize();
  return frameMap(inHand.axis, hf.n, worldAxis, pa);
}

const distToLine = (p, c, a) => { const w = p.clone().sub(c); return w.sub(a.clone().multiplyScalar(w.dot(a))).length(); };

/**
 * Wrap a joint chain around the handle in the chain's flexion plane (2D): each segment turns toward the palm
 * side until it is tangent to the handle circle, or until its end touches it if it is too short to reach the
 * tangent point. joints: rest positions J0..Jk; side: unit vector toward the palm side of the first segment.
 * Returns joint angles (radians, positive = flexion) and the flexion axis.
 */
export function wrapPlanar(joints, inHand, side, limits, pad) {
  const e1 = joints[1].clone().sub(joints[0]).normalize();
  const e2 = side.clone().sub(e1.clone().multiplyScalar(side.dot(e1))).normalize();
  const axis = new V().crossVectors(e1, e2).normalize();
  const to2 = (p) => { const w = p.clone().sub(joints[0]); return [w.dot(e1), w.dot(e2)]; };
  // handle axis meets the flexion plane at c (the handle runs across the fingers, close to the plane normal)
  const a = inHand.axis, c3 = inHand.centre;
  const t = axis.dot(a) !== 0 ? joints[0].clone().sub(c3).dot(axis) / axis.dot(a) : 0;
  const [cx, cy] = to2(c3.clone().add(a.clone().multiplyScalar(t)));
  const R = inHand.radius + pad;
  const lens = []; for (let k = 0; k < joints.length - 1; k++) lens.push(joints[k + 1].distanceTo(joints[k]));
  // rest angles of each segment in the plane (fingers are not perfectly straight at rest)
  const restAng = []; for (let k = 0; k < joints.length - 1; k++) { const [x0, y0] = to2(joints[k]), [x1, y1] = to2(joints[k + 1]); restAng.push(Math.atan2(y1 - y0, x1 - x0)); }
  let px = 0, py = 0, acc = 0, contact = false;
  const angles = [];
  for (let k = 0; k < lens.length; k++) {
    const base = restAng[k] + acc;                 // this segment's direction if its joint stays straight
    const dx = cx - px, dy = cy - py, dist = Math.hypot(dx, dy);
    let th = 0;
    if (dist > R + 1e-4) {
      const toC = Math.atan2(dy, dx), tl = Math.sqrt(dist * dist - R * R);
      const spread = lens[k] >= tl
        ? Math.asin(R / dist)                                                         // tangent to the circle
        : Math.acos(Math.max(-1, Math.min(1, (lens[k] ** 2 + dist ** 2 - R * R) / (2 * lens[k] * dist)))); // end touches
      // already touching: the segment, kept straight, passes within R of the centre
      const ux = Math.cos(base), uy = Math.sin(base);
      const along = Math.max(0, Math.min(lens[k], dx * ux + dy * uy));
      const penetrates = Math.hypot(px + ux * along - cx, py + uy * along - cy) < R;
      // turning toward the palm (positive), the first contact is the candidate with the smallest positive turn
      const turns = [toC + spread, toC - spread].map(x => posMod(x - base)).filter(d => d <= Math.PI);
      th = penetrates || !turns.length ? 0 : Math.min(...turns);
      if (lens[k] >= tl) contact = true;
    }
    th = Math.max(0, Math.min(limits[k], th));
    angles.push(th);
    acc += th;
    const h = restAng[k] + acc;
    px += lens[k] * Math.cos(h); py += lens[k] * Math.sin(h);
  }
  const tipDist = Math.hypot(cx - px, cy - py) - R;
  return { angles, axis, tipGap: tipDist, contact };
}
const posMod = (x) => ((x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

export const FINGER_LIMITS = [THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(105), THREE.MathUtils.degToRad(85)];
export const THUMB_LIMITS = [THREE.MathUtils.degToRad(55), THREE.MathUtils.degToRad(60), THREE.MathUtils.degToRad(80)];

/** Power grip on a cylinder: per finger, the joint angles and the axis of each joint in its rest frame. */
export function powerGrip(rig, side, inHand, hf, { thumbOpp = 45 } = {}) {
  const m = rig.meta.fingers[side].fingers;
  const out = {};
  for (const name of ['Index', 'Middle', 'Ring', 'Pinky']) {
    const joints = m[name].jointsGl.map(j => new V(...j));
    // the little finger is the shortest and bends furthest at its two end joints (PIP ~110, DIP ~90 deg)
    const lim = name === 'Pinky' ? [FINGER_LIMITS[0], THREE.MathUtils.degToRad(110), THREE.MathUtils.degToRad(90)] : FINGER_LIMITS;
    const res = wrapPlanar(joints, inHand, hf.n, lim, 0.0085);
    out[name] = { angles: res.angles, axes: res.angles.map(() => res.axis.clone()), tipGap: res.tipGap };
  }
  // thumb (closed grip, thumb over the fingers): the metacarpal turns in front of the palm, then the two
  // phalanges reach, by two-bone IK, the back of the index finger's middle phalanx, knuckle pointing away
  // from the handle.
  const tj = m.Thumb.jointsGl.map(j => new V(...j));
  let oppAxis = hf.d.clone();
  if (new V().crossVectors(oppAxis, tj[3].clone().sub(tj[0])).dot(hf.n) < 0) oppAxis.negate();
  const ij = m.Index.jointsGl.map(j => new V(...j));
  const pos = chainPositions(ij, out.Index.angles, out.Index.axes[0]);
  const mid = pos[1].clone().add(pos[2]).multiplyScalar(0.5);
  const outward = (() => { const w = mid.clone().sub(inHand.centre); return w.sub(inHand.axis.clone().multiplyScalar(w.dot(inHand.axis))).normalize(); })();
  const onFinger = mid.clone().add(outward.clone().multiplyScalar(0.016));
  // where the thumb cannot reach the index finger (handle slanted far across the palm) it closes on the handle
  // itself, on the side away from the palm
  const across = hf.n.clone().negate();
  const thumbBase = tj[1].clone();
  const w0 = thumbBase.clone().sub(inHand.centre); const along = inHand.axis.clone().multiplyScalar(w0.dot(inHand.axis));
  const onHandle = inHand.centre.clone().add(along).add(across.sub(inHand.axis.clone().multiplyScalar(across.dot(inHand.axis))).normalize().multiplyScalar(inHand.radius + 0.009));
  const l1 = tj[2].distanceTo(tj[1]), l2 = tj[3].distanceTo(tj[2]);
  const r12 = tj[2].clone().sub(tj[1]).normalize(), r23 = tj[3].clone().sub(tj[2]).normalize();
  let rn = new V().crossVectors(r12, r23); if (rn.length() < 1e-3) rn = new V().crossVectors(r12, hf.n); rn.normalize();
  // the metacarpal turns until the thumb can reach its place (a handle slanted across the palm needs more turn)
  let best = null;
  for (const target of [onFinger, onHandle]) for (let deg = thumbOpp - 10; deg <= thumbOpp + 35; deg += 2.5) {
    if (target === onHandle && best && best.gap < 0.006) break;     // the finger target is reachable: keep it
    const opp = THREE.MathUtils.degToRad(deg);
    const qo = axisAngle(oppAxis, opp);
    const J1 = tj[1].clone().sub(tj[0]).applyQuaternion(qo).add(tj[0]);
    const toT = target.clone().sub(J1); const full = toT.length();
    const dd = Math.min(full, l1 + l2 - 1e-4); const u = toT.normalize();
    const gap = full - dd;
    if (best && gap >= best.gap - 1e-4) continue;
    const a = (l1 * l1 - l2 * l2 + dd * dd) / (2 * dd), h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const away = (() => { const w = J1.clone().sub(inHand.centre); w.sub(inHand.axis.clone().multiplyScalar(w.dot(inHand.axis))); return w.sub(u.clone().multiplyScalar(w.dot(u))).normalize(); })();
    const J2 = J1.clone().add(u.clone().multiplyScalar(a)).add(away.clone().multiplyScalar(h));
    const J3 = J1.clone().add(u.clone().multiplyScalar(dd));
    const p12 = J2.clone().sub(J1).normalize(), p23 = J3.clone().sub(J2).normalize();
    const pn = new V().crossVectors(p12, p23).normalize();
    const rnTurned = rn.clone().applyQuaternion(qo);
    const pn2 = pn.dot(rnTurned) < 0 ? pn.clone().negate() : pn;
    best = { gap, deltas: [qo, frameMap(r12, rn, p12, pn2), frameMap(r23, rn, p23, pn2)], opp: deg, target };
  }
  out.Thumb = { deltas: best.deltas, target: best.target, tipGap: best.gap, opp: best.opp };
  return out;
}

/** Replay a planar wrap: joint positions after the rotations (rest frame). */
export function chainPositions(joints, angles, axis) {
  const J = joints.map(j => j.clone());
  for (let k = 0; k < angles.length; k++) {
    const qk = axisAngle(axis, angles[k]);
    for (let j = k + 1; j < J.length; j++) J[j] = J[j].clone().sub(J[k]).applyQuaternion(qk).add(J[k]);
  }
  return J;
}

/** Apply a grip (from powerGrip or a preset) to the rig; hand delta must already be set. */
export function applyGrip(rig, side, grip, amount = 1) {
  const m = rig.meta.fingers[side].fingers;
  rig.fk();
  const handD = rig.world[`${side}Hand`].D;
  for (const [name, g] of Object.entries(grip)) {
    if (g.deltas) {
      m[name].bones.forEach((bn, k) => rig.set(bn, handD.clone().multiply(powQ(g.deltas[k], amount))));
      continue;
    }
    let parentD = handD.clone();
    m[name].bones.forEach((bn, k) => {
      const D = parentD.clone().multiply(axisAngle(g.axes[k], g.angles[k] * amount));
      rig.set(bn, D); parentD = D;
    });
  }
}
