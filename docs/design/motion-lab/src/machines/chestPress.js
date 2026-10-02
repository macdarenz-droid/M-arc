// MO: the chest press's moving parts, built in code on the Meshy body (assets/chest-press.glb).
// Measured on the prepared body (tools/motion/machine_prep.py, metres, x right, y up, z = the user's front):
// pivot hubs at x = -0.215 / +0.225, y = 1.58, z = 0.285; seat top y = 0.48; back pad reclined ~11 deg.
import * as THREE from 'three';

const V = THREE.Vector3;

export const BODY = {
  hubs: { Left: new V(0.225, 1.581, 0.286), Right: new V(-0.215, 1.579, 0.284) },   // figure's left = +x
  seatTop: 0.483,
  // back pad front plane (fitted in setup(), see measurePad)
};

/** Find the back pad's front plane from the 'pad' material meshes above the seat. */
export function measurePad(meshes) {
  const pts = []; const v = new V();
  for (const m of meshes) {
    if (m.material.name !== 'pad') continue;
    m.updateMatrixWorld(true);
    const pos = m.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld); if (v.y > 0.62) pts.push(v.clone()); }
  }
  // front-most point per 2 cm height band near the middle of the pad, then a line z = a*y + b through them
  const bands = new Map();
  for (const p of pts) { if (Math.abs(p.x) > 0.12) continue; const k = Math.round(p.y * 50); if (!bands.has(k) || bands.get(k).z < p.z) bands.set(k, p); }
  const F = [...bands.values()].sort((a, b) => a.y - b.y).slice(2, -2);   // drop the rounded ends
  let sy = 0, sz = 0, syy = 0, syz = 0;
  for (const p of F) { sy += p.y; sz += p.z; syy += p.y * p.y; syz += p.y * p.z; }
  const nF = F.length, a = (nF * syz - sy * sz) / (nF * syy - sy * sy), b = (sz - a * sy) / nF;
  const normal = new V(0, -a, 1).normalize();                       // pointing forward, tilted up
  return { a, b, normal, recline: Math.atan(-a), yTop: F[F.length - 1].y, yLow: F[0].y, zAt: (y) => a * y + b, points: F.length };
}

/**
 * Lever arm for one side: a circle about an axis through the hub. Built from the start and end handle
 * centres (start: front of the chest at the nipple line; end: arms long, elbow soft), which fixes the axis.
 */
export function makeArm(hub, start, end) {
  const rs = start.clone().sub(hub), re = end.clone().sub(hub);
  const axis = new V().crossVectors(rs, re).normalize();
  const sweep = rs.angleTo(re);
  return {
    hub, axis, sweep, radius: rs.length(),
    at(u) { return rs.clone().applyAxisAngle(axis, sweep * u).add(hub); },
    /** handle direction (thumb side for the pronated grip) turns with the arm */
    handleAxis(u, base) { return base.clone().applyAxisAngle(axis, sweep * u).normalize(); },
  };
}

/** End handle centre on the sphere |p - hub| = r: forward by `reach`, at half-width `x`. */
export function endOnSphere(hub, start, x, z) {
  const r = start.distanceTo(hub);
  const dx = x - hub.x, dz = z - hub.z;
  const dy = -Math.sqrt(Math.max(0, r * r - dx * dx - dz * dz));
  return new V(x, hub.y + dy, z);
}

/**
 * One rigid lever per side, built once at the start position and turned about the pivot axis: a round tube
 * from the hub straight down, a smooth bend, then out to a bracket at the outer end of the grip; the rubber
 * grip runs inward from the bracket (the thumb end is open, like the Technogym and Life Fitness handles).
 */
export function buildLever(mats, hub, startCentre, thumbDir, gripLen = 0.13) {
  const outward = thumbDir.clone().negate().normalize();
  const outerEnd = startCentre.clone().add(outward.clone().multiplyScalar(gripLen / 2 + 0.018));
  const local = (p) => p.clone().sub(hub);
  const drop = new V(outerEnd.x, outerEnd.y + 0.11, outerEnd.z);
  const curve = new THREE.CurvePath();
  curve.add(new THREE.LineCurve3(local(hub), local(drop)));
  curve.add(new THREE.QuadraticBezierCurve3(local(drop), local(new V(outerEnd.x, outerEnd.y + 0.01, outerEnd.z)), local(outerEnd.clone().add(new V(0, 0, 0)))));
  const pts = curve.getSpacedPoints(48);
  const tubeGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 64, 0.021, 18, false);
  const group = new THREE.Group(); group.position.copy(hub);
  const tube = new THREE.Mesh(tubeGeo, mats.frame);
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.03, 24), mats.frame);
  cap.position.copy(local(outerEnd)); cap.quaternion.setFromUnitVectors(Y, outward);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, gripLen, 32), mats.grip);
  grip.position.copy(local(startCentre)); grip.quaternion.setFromUnitVectors(Y, thumbDir.clone().normalize());
  const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.0175, 0.0175, 0.008, 28), mats.metal);
  endCap.position.copy(local(startCentre.clone().add(thumbDir.clone().normalize().multiplyScalar(gripLen / 2 + 0.004)))); endCap.quaternion.copy(grip.quaternion);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.019, 0.019, 0.01, 28), mats.metal);
  collar.position.copy(local(startCentre.clone().add(outward.clone().multiplyScalar(gripLen / 2 + 0.005)))); collar.quaternion.copy(grip.quaternion);
  group.add(tube, cap, grip, endCap, collar);
  return { group, parts: { tube, cap, grip, endCap, collar } };
}

const Y = new V(0, 1, 0);

/** Turn a lever to path fraction u. */
export function setLever(lever, arm, u) {
  lever.group.quaternion.setFromAxisAngle(arm.axis, arm.sweep * u);
}
