// MO: pose the shared figure by world-space rotation deltas, with two-bone IK, twist sharing and finger wraps.
// A delta D rotates a bone's rest geometry about its head, in figure space. Bones without a delta inherit their
// parent's, so each solve is a pure function of its inputs (renders repeat exactly).
import * as THREE from 'three';

const V = THREE.Vector3, Q = THREE.Quaternion;
const v = () => new V(), q = () => new Q();

/** Rotation that maps the orthonormal pair (a0, b0) onto (a1, b1). */
export function frameMap(a0, b0, a1, b1) {
  const m0 = basis(a0, b0), m1 = basis(a1, b1);
  return q().setFromRotationMatrix(m1.multiply(m0.transpose()));
}
function basis(a, b) {
  const x = a.clone().normalize();
  const y = b.clone().sub(x.clone().multiplyScalar(b.dot(x))).normalize();
  const z = v().crossVectors(x, y);
  return new THREE.Matrix4().makeBasis(x, y, z);
}

/** Split r into swing * twist, the twist being about unit axis a. */
export function swingTwist(r, a) {
  const p = a.clone().multiplyScalar(a.dot(new V(r.x, r.y, r.z)));
  const twist = new Q(p.x, p.y, p.z, r.w);
  if (twist.lengthSq() < 1e-12) twist.set(0, 0, 0, 1); else twist.normalize();
  const swing = r.clone().multiply(twist.clone().invert());
  return { swing, twist, angle: signedAngle(twist, a) };
}
export function signedAngle(rot, a) {
  const ang = 2 * Math.atan2(Math.hypot(rot.x, rot.y, rot.z), rot.w);
  const s = Math.sign(a.dot(new V(rot.x, rot.y, rot.z))) || 1;
  let x = s * ang;
  if (x > Math.PI) x -= 2 * Math.PI;
  if (x < -Math.PI) x += 2 * Math.PI;
  return x;
}
export const axisAngle = (a, ang) => q().setFromAxisAngle(a.clone().normalize(), ang);
export const powQ = (r, t) => q().slerp(r, t);

export class Rig {
  constructor(root, skinned, meta) {
    this.root = root; this.mesh = skinned; this.meta = meta;
    root.updateMatrixWorld(true);
    this.rootInv = root.matrixWorld.clone().invert();
    this.bones = {}; this.order = [];
    for (const b of skinned.skeleton.bones) this.bones[b.name] = b;
    const visit = (o) => { if (o.isBone) this.order.push(o.name); o.children.forEach(visit); };
    visit(this.bones.Hips);
    this.rest = {};
    for (const name of this.order) {
      const b = this.bones[name];
      const m = this.rootInv.clone().multiply(b.matrixWorld);
      const p = v(), Qw = q(), s = v(); m.decompose(p, Qw, s);
      this.rest[name] = { q: b.quaternion.clone(), p: b.position.clone(), Qw, pw: p, parent: b.parent.isBone ? b.parent.name : null };
    }
    this.rootParent = this.bones.Hips.parent;
    this.reset();
  }

  reset() { this.D = {}; this.hips = this.rest.Hips.pw.clone(); this.world = {}; this.report = {}; }
  set(name, D) { this.D[name] = D.clone(); }
  restDir(a, b) { return this.rest[b].pw.clone().sub(this.rest[a].pw).normalize(); }
  restLen(a, b) { return this.rest[b].pw.distanceTo(this.rest[a].pw); }

  /** Forward kinematics from the deltas: posed figure-space position and quaternion of every bone. */
  fk() {
    const W = {};
    for (const name of this.order) {
      const r = this.rest[name];
      const D = this.D[name] || (r.parent ? W[r.parent].D : q());
      let p;
      if (!r.parent) p = this.hips.clone();
      else { const pr = this.rest[r.parent]; p = r.pw.clone().sub(pr.pw).applyQuaternion(W[r.parent].D).add(W[r.parent].p); }
      W[name] = { D, p, Q: D.clone().multiply(r.Qw) };
    }
    this.world = W;
    return W;
  }

  /** Write the posed transforms into the bones. */
  apply() {
    const W = this.fk();
    const rootQ = q(), rootP = v(), s = v();
    this.root.matrixWorld.decompose(rootP, rootQ, s);
    const parentWorld = new THREE.Matrix4();
    for (const name of this.order) {
      const b = this.bones[name], r = this.rest[name];
      if (r.parent) {
        const pq = W[r.parent].Q;
        b.quaternion.copy(pq.clone().invert().multiply(W[name].Q));
        b.position.copy(r.p);
      } else {
        // Hips: its parent is the armature node (scaled); go through matrices.
        this.rootParent.updateMatrixWorld(true);
        parentWorld.copy(this.rootInv).multiply(this.rootParent.matrixWorld);
        const inv = parentWorld.clone().invert();
        const m = new THREE.Matrix4().compose(W[name].p, W[name].Q, new V(1, 1, 1)).premultiply(inv);
        const p = v(), qq = q(), sc = v(); m.decompose(p, qq, sc);
        b.position.copy(p); b.quaternion.copy(qq);
      }
    }
    this.root.updateMatrixWorld(true);
  }

  pos(name) { return this.world[name].p.clone(); }

  /**
   * Two-bone IK. upper/lower/end: bone names (e.g. LeftArm, LeftForeArm, LeftHand). target: end position.
   * pole: direction the middle joint should point. hinge0: rest hinge axis (flexion axis) of the middle joint.
   * endD: optional world delta for the end bone (hand or foot orientation). Twist bones share the twist.
   */
  limb(upper, lower, end, target, pole, hinge0, endD, opts = {}) {
    this.fk();
    const S = this.pos(upper);
    const l1 = this.restLen(upper, lower), l2 = this.restLen(lower, end);
    const toT = target.clone().sub(S);
    let d = toT.length();
    const reach = { wanted: d, max: l1 + l2 };
    d = Math.min(Math.max(d, Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
    const u = toT.normalize();
    const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
    const pp = pole.clone().sub(u.clone().multiplyScalar(pole.dot(u))).normalize();
    const E = S.clone().add(u.clone().multiplyScalar(a)).add(pp.clone().multiplyScalar(h));
    const T = S.clone().add(u.clone().multiplyScalar(d));
    const a0 = this.restDir(upper, lower), f0 = this.restDir(lower, end);
    const a1 = E.clone().sub(S).normalize(), f1 = T.clone().sub(E).normalize();
    let h1 = v().crossVectors(a1, f1);
    if (h1.length() < 0.05) h1 = v().crossVectors(a1, pp.clone().negate());
    h1.normalize();
    if (h1.dot(hinge0) * 0 !== 0) h1.negate();
    const parentD = this.world[this.rest[upper].parent].D;
    const h0p = hinge0.clone();
    const DA = frameMap(a0, h0p, a1, h1);
    const DF = frameMap(f0, h0p, f1, h1);
    this.set(upper, DA); this.set(lower, DF);
    const tw = this.meta.twist[upper];
    if (tw) {
      // upper segment: twist relative to the parent's carry, shared from 0 at the root to 1 at the joint
      const rel = parentD.clone().invert().multiply(DA);
      const a0p = a0.clone();
      const { swing, twist, angle } = swingTwist(rel, a0p);
      tw.bones.forEach((bn, i) => this.set(bn, parentD.clone().multiply(swing).multiply(powQ(twist, tw.fractions[i]))));
      this.report[upper + 'Twist'] = THREE.MathUtils.radToDeg(angle);
    }
    if (endD) {
      const rel = DF.clone().invert().multiply(endD);
      const { swing, twist, angle } = swingTwist(rel, f0);
      const twl = this.meta.twist[lower];
      if (twl) twl.bones.forEach((bn, i) => this.set(bn, DF.clone().multiply(powQ(twist, twl.fractions[i]))));
      const clampDeg = opts.endSwingMax;
      let sw = swing;
      const swingDeg = THREE.MathUtils.radToDeg(2 * Math.acos(Math.min(1, Math.abs(swing.w))));
      if (clampDeg != null && swingDeg > clampDeg) sw = powQ(swing, clampDeg / swingDeg);
      this.set(end, DF.clone().multiply(sw).multiply(twist));
      this.report[end + 'Twist'] = THREE.MathUtils.radToDeg(angle);
      this.report[end + 'Swing'] = swingDeg;
    } else {
      const twl = this.meta.twist[lower];
      if (twl) twl.bones.forEach((bn) => this.set(bn, DF));
      this.set(end, DF);
    }
    this.report[lower + 'Bend'] = THREE.MathUtils.radToDeg(Math.PI - a1.angleTo(f1) - 0) ;
    this.report[lower + 'Flex'] = THREE.MathUtils.radToDeg(a1.angleTo(f1));
    this.report[upper + 'Reach'] = reach;
    this.fk();
    return { elbow: E, wrist: T };
  }

  /** Curl one finger chain: angles (radians) per joint about each bone's flexion axis. */
  finger(side, name, angles, spread = 0) {
    const f = this.meta.fingers[side].fingers[name];
    const lat = new V(...this.meta.fingers[side].lateralGl), nrm = new V(...this.meta.fingers[side].palmGl);
    let parentD = this.world[`${side}Hand`] ? this.world[`${side}Hand`].D : q();
    const sideSign = side === 'Left' ? 1 : -1;
    f.bones.forEach((bn, i) => {
      const j0 = new V(...f.jointsGl[i]), j1 = new V(...f.jointsGl[i + 1]);
      const dir = j1.clone().sub(j0).normalize();
      let axis = name === 'Thumb' ? thumbAxis(i, dir, nrm, lat) : v().crossVectors(nrm, dir).normalize();
      axis.multiplyScalar(sideSign);
      let D = parentD.clone().multiply(axisAngle(axis, angles[i] || 0));
      if (i === 0 && spread) D = D.multiply(axisAngle(nrm, spread * sideSign));
      this.set(bn, D);
      parentD = D;
    });
  }
}

function thumbAxis(i, dir, nrm, lat) {
  // metacarpal swings across the palm (opposition); the two phalanges flex toward the palm
  if (i === 0) return dir.clone().cross(nrm).normalize().add(nrm.clone().multiplyScalar(0.0)).normalize();
  return v().crossVectors(nrm, dir).normalize();
}

/** Convert Blender-space vectors in the rig meta (Z-up) to glTF space (Y-up): (x, y, z) -> (x, z, -y). */
export function metaToGl(meta) {
  const c = (p) => [p[0], p[2], -p[1]];
  for (const side of Object.keys(meta.fingers)) {
    const s = meta.fingers[side];
    s.palmGl = c(s.palmNormal); s.lateralGl = c(s.lateral); s.axisGl = c(s.handAxis);
    for (const f of Object.values(s.fingers)) f.jointsGl = f.joints.map(c);
  }
  return meta;
}
