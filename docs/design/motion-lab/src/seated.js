// MO: seated machine poses (chest press family): torso on the pad, hips on the seat, feet on the floor, hands
// on the handles by IK with a researched elbow flare, fingers wrapped. Everything is solved from contacts.
import * as THREE from 'three';
import { axisAngle, frameMap } from './rig.js';
import { handFrame, handleInHand, handDeltaFor, powerGrip, applyGrip } from './grip.js';

const V = THREE.Vector3, Q = THREE.Quaternion;
const X = new V(1, 0, 0), Yv = new V(0, 1, 0), Z = new V(0, 0, 1);
const deg = THREE.MathUtils.degToRad, rad2deg = THREE.MathUtils.radToDeg;

/** Vertex ids by region (COLOR_0.r) for contact checks. */
export function regionVertices(skinned, ids, names) {
  const c = skinned.geometry.attributes.color, out = [];
  const want = new Set(names.map(n => ids[n]));
  for (let i = 0; i < c.count; i++) if (want.has(Math.round(c.getX(i) * 255)) && c.getY(i) > 0.3) out.push(i);
  return out;
}

const fwdOf = (c, sh) => c.clone().sub(sh).normalize();

/** Elbow position of a two-bone limb for a pole direction (same construction as Rig.limb). */
function elbowFor(S, T, l1, l2, pole) {
  const toT = T.clone().sub(S); let d = Math.min(Math.max(toT.length(), Math.abs(l1 - l2) + 1e-4), l1 + l2 - 1e-4);
  const u = toT.normalize(); const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d); const h = Math.sqrt(Math.max(0, l1 * l1 - a * a));
  const pp = pole.clone().sub(u.clone().multiplyScalar(pole.dot(u))).normalize();
  return S.clone().add(u.multiplyScalar(a)).add(pp.multiplyScalar(h));
}

/** Pole between torso-down and outward (with the elbow kept back) giving the wanted upper-arm-to-torso angle. */
export function poleForFlare(S, T, l1, l2, down, out, flare) {
  const back = new V(0, 0, -1);
  const poleAt = (k) => out.clone().multiplyScalar(Math.sin(k)).add(down.clone().multiplyScalar(Math.cos(k))).add(back.clone().multiplyScalar(0.25)).normalize();
  const flareAt = (k) => elbowFor(S, T, l1, l2, poleAt(k)).sub(S).angleTo(down);
  let lo = 0, hi = Math.PI / 2;
  if (flareAt(hi) < flare) return poleAt(hi);
  if (flareAt(lo) > flare) return poleAt(lo);
  for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (flareAt(m) < flare) lo = m; else hi = m; }
  return poleAt((lo + hi) / 2);
}

export class SeatedPress {
  /**
   * opts: { rig, skinned, regionIds, pad: {a, b, normal, recline}, seatTop, feet: {x, z}, flareDeg,
   *         retractDeg, depressDeg, handle: {at, oblique, radius}, wristExtDeg }
   */
  constructor(opts) {
    Object.assign(this, opts);
    const { rig } = this;
    this.backV = regionVertices(this.skinned, this.regionIds, ['mid_back', 'lower_back', 'rotator_cuff', 'lats']);
    this.lowBackV = regionVertices(this.skinned, this.regionIds, ['lower_back']);
    this.bladeV = regionVertices(this.skinned, this.regionIds, ['mid_back', 'rotator_cuff']);
    this.seatV = regionVertices(this.skinned, this.regionIds, ['glutes']);           // the buttocks carry the seat contact
    this.hf = { Left: handFrame(rig, 'Left'), Right: handFrame(rig, 'Right') };
    this.hinge = {};
    for (const s of ['Left', 'Right']) {
      this.hinge[s + 'Arm'] = new V().crossVectors(rig.restDir(s + 'Arm', s + 'ForeArm'), Z).normalize();
      this.hinge[s + 'UpLeg'] = new V().crossVectors(rig.restDir(s + 'UpLeg', s + 'Leg'), Z.clone().negate()).normalize();
    }
    this.hipsZ = null; this.hipsY = null;
    this.tmp = new V();
  }

  torso(state) {
    const { rig } = this;
    const recline = this.pad.recline + deg(state.extraLeanDeg || 0);
    const Dh = axisAngle(X, -recline);
    rig.set('Hips', Dh);
    // upper back peel (roll-off mistake): the trunk bends forward from the low back (Spine02), so the whole
    // upper back, blades included, leaves the pad while the pelvis stays on the seat
    if (state.upperFlexDeg) rig.set('Spine02', Dh.clone().multiply(axisAngle(X, deg(state.upperFlexDeg))));
    // shoulder blades: retracted and depressed (back and down), or protracted in the roll-off mistake
    for (const [s, sx] of [['Left', 1], ['Right', -1]]) {
      const parent = rig.D['Spine'] || Dh;
      const r = deg((state.retractDeg ?? this.retractDeg) + ((state.retractExtra || {})[s] || 0)), dpr = deg(state.depressDeg ?? this.depressDeg);
      const D = parent.clone().multiply(axisAngle(Yv, r * sx)).multiply(axisAngle(Z, -dpr * sx));
      rig.set(s + 'Shoulder', D);
    }
  }

  legs() {
    const { rig } = this;
    rig.fk();
    for (const [s, sx] of [['Left', 1], ['Right', -1]]) {
      const hip = rig.pos(s + 'UpLeg');
      const ankleY = rig.rest[s + 'Foot'].pw.y;
      // feet flat on the floor a fixed distance in front of the seat's front edge, shins about vertical
      const target = new V(sx * this.feet.x, ankleY, this.seatFoot.z1 + this.feet.ahead);
      const pole = new V(sx * 0.15, 0.3, 1).normalize();
      rig.limb(s + 'UpLeg', s + 'Leg', s + 'Foot', target, pole, this.hinge[s + 'UpLeg'], new Q());
    }
  }

  contacts() {
    const { rig, skinned } = this;
    rig.apply();
    skinned.skeleton.update();
    const v = this.tmp; const k = Math.sqrt(1 + this.pad.a * this.pad.a);
    let back = Infinity, seat = Infinity, blades = Infinity;
    for (const i of this.bladeV) { skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld); blades = Math.min(blades, (v.z - (this.pad.a * v.y + this.pad.b)) / k); }
    for (const i of (this.lowerOnly ? this.lowBackV : this.backV)) { skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld); back = Math.min(back, (v.z - (this.pad.a * v.y + this.pad.b)) / k); }
    for (const i of this.seatV) {
      skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld);
      const f = this.seatFoot; if (f && (Math.abs(v.x) > f.x || v.z < f.z0 || v.z > f.z1)) continue;   // only over the cushion
      seat = Math.min(seat, v.y - (this.seatTop + (this.seatDropNow || 0)));
    }
    return { back, seat, blades };
  }

  /** Place the hips so the back meets the pad and the hips meet the seat (both pressed in slightly). */
  placeHips(state) {
    const { rig } = this;
    // the contact solve skins a few thousand vertices; its answer only depends on the torso posture, so cache it
    const key = [state.seatDrop || 0, state.keepHips ? 1 : 0, (state.retractDeg ?? this.retractDeg).toFixed(1), JSON.stringify(state.retractExtra || {}), (state.upperFlexDeg || 0).toFixed(1), (state.extraLeanDeg || 0).toFixed(1)].join('|');
    this.cache = this.cache || new Map();
    const hit = this.cache.get(key);
    if (hit) { rig.hips.set(0, hit.y, hit.z); this.legs(); this.lastContacts = hit.c; return; }
    this._placeHips(state);
    this.cache.set(key, { y: rig.hips.y, z: rig.hips.z, c: this.lastContacts });
  }

  _placeHips(state) {
    const { rig } = this;
    const n = this.pad.normal;
    if (this.hipsZ == null) { this.hipsZ = this.pad.zAt(this.seatTop + 0.1) + 0.11; this.hipsY = this.seatTop + 0.09; }
    this.seatDropNow = state.seatDrop || 0;
    this.lowerOnly = !!state.lowerBackContact;
    if (state.keepHips && this.hipsY != null) {                    // roll-off: the pelvis stays where it sat
      rig.hips.set(0, this.hipsY, this.hipsZ); this.legs(); this.lastContacts = this.contacts(); return;
    }
    let hy = this.hipsY + this.seatDropNow, hz = this.hipsZ;
    for (let it = 0; it < 4; it++) {
      rig.hips.set(0, hy, hz);
      this.legs();
      const c = this.contacts();
      const ty = (-0.012 - c.seat);
      const target = -0.004;                                       // pad foam pressed in 4 mm
      const tz = (target - c.back - n.y * ty) / n.z;
      hy += ty; hz += tz;
      this.lastContacts = c;
      if (Math.abs(ty) < 5e-4 && Math.abs(tz) < 5e-4) break;
    }
    if (!this.seatDropNow && !this.lowerOnly && !state.upperFlexDeg) { this.hipsY = hy; this.hipsZ = hz; }   // warm start
    rig.hips.set(0, hy, hz);
    this.legs();
  }

  /** Measure the seated figure (rest of the arms) for setting the machine: nipple line and chest front. */
  measureChest(nippleIds) {
    const { skinned } = this; const v = this.tmp;
    let y = 0, zMax = -Infinity;
    for (const i of nippleIds) { skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld); y += v.y / nippleIds.length; zMax = Math.max(zMax, v.z); }
    return { nippleY: y, chestFrontZ: zMax };
  }

  /**
   * Hands on the handles. handles[side] = { centre, axis (toward the thumb), palmDown (true) }.
   * state.wristExtDeg bends the wrist back (mistake), state.gripAt moves the handle toward the fingers.
   */
  arms(handles, state) {
    const { rig } = this;
    const report = {};
    for (const [s, sx] of [['Left', 1], ['Right', -1]]) {
      const hf = this.hf[s], h = handles[s];
      const base = handleInHand(hf, { at: state.gripAt ?? this.handle.at, oblique: 0, radius: this.handle.radius });
      let inHand = base;
      rig.fk();
      const shoulder = rig.pos(s + 'Arm');
      const torsoDown = new V(0, -1, 0).applyQuaternion(rig.world['Spine'].D);
      const out = new V(sx, 0, 0);
      // elbow direction: swept from straight down (along the torso) toward straight out until the upper arm
      // makes `flare` with the torso, measured on the elbow the IK will produce (wrist ~ handle - hand offset)
      const flare = deg(state.flareDeg ?? this.flareDeg);
      const wristGuess = h.centre.clone().sub(fwdOf(h.centre, shoulder).multiplyScalar(0.085));
      const pole = poleForFlare(shoulder, wristGuess, rig.restLen(s + 'Arm', s + 'ForeArm'), rig.restLen(s + 'ForeArm', s + 'Hand'), torsoDown, out, flare);
      let fwd = h.centre.clone().sub(shoulder).normalize();
      let D, oblique = 0;
      const ext = deg(state.wristExtDeg ?? this.wristExtDeg);
      for (let it = 0; it < 6; it++) {
        // neutral wrist: the hand continues the forearm; the palm faces down, square to forearm and handle; the
        // handle then lies across the palm at whatever slant that leaves (no sideways wrist bend)
        let n = new V().crossVectors(h.axis, fwd).normalize();
        if (n.y > 0) n.negate();
        const D0 = frameMap(hf.d, hf.n, fwd, n);
        const aRest = h.axis.clone().applyQuaternion(D0.clone().invert());
        aRest.sub(hf.n.clone().multiplyScalar(aRest.dot(hf.n))).normalize();
        oblique = THREE.MathUtils.radToDeg(Math.atan2(aRest.dot(hf.d), aRest.dot(hf.r)));
        inHand = { centre: base.centre, axis: aRest, radius: base.radius };
        D = ext ? axisAngle(new V().crossVectors(n, fwd).normalize(), ext).multiply(D0) : D0;   // back of the hand up
        const wristT = h.centre.clone().sub(inHand.centre.clone().sub(hf.wrist).applyQuaternion(D));
        rig.limb(s + 'Arm', s + 'ForeArm', s + 'Hand', wristT, pole, this.hinge[s + 'Arm'], D);
        rig.fk();
        fwd = rig.pos(s + 'Hand').sub(rig.pos(s + 'ForeArm')).normalize();
      }
      // the fingers close on the real handle, carried into the hand's rest frame from where the hand ended up
      rig.fk();
      const Hw = rig.world[s + 'Hand'], Di = Hw.D.clone().invert();
      const real = { centre: h.centre.clone().sub(Hw.p).applyQuaternion(Di).add(hf.wrist), axis: h.axis.clone().applyQuaternion(Di).normalize(), radius: inHand.radius };
      const grip = powerGrip(rig, s, real, hf, { thumbOpp: state.thumbOpp ?? 45 });
      if (state.thumbLoose) grip.Thumb = { deltas: [axisAngle(hf.d, 0), axisAngle(hf.d, 0), axisAngle(hf.d, 0)] };
      applyGrip(rig, s, grip, 1);
      // measured on the posed bones against the real handle (not the solver's plan): fingertip to the handle
      // surface less the finger pad; thumb tip to its place over the fingers, carried by the hand
      rig.fk();
      const fm = rig.meta.fingers[s].fingers;
      const posed = (bone, restPt) => { const w = rig.world[bone]; return restPt.clone().sub(rig.rest[bone].pw).applyQuaternion(w.D).add(w.p); };
      const toAxis = (p) => { const w = p.clone().sub(h.centre); return w.sub(h.axis.clone().multiplyScalar(w.dot(h.axis))).length(); };
      const touch = {};
      for (const name of ['Index', 'Middle', 'Ring', 'Pinky']) {
        const tip = posed(fm[name].bones[2], new V(...fm[name].jointsGl[3]));
        touch[name] = +((toAxis(tip) - this.handle.radius - 0.0085) * 1000).toFixed(1);
      }
      if (grip.Thumb.target) {
        const tip = posed(fm.Thumb.bones[2], new V(...fm.Thumb.jointsGl[3]));
        touch.Thumb = +(tip.distanceTo(posed(s + 'Hand', grip.Thumb.target)) * 1000).toFixed(1);
      }
      // report: elbow flexion, upper-arm angle to the torso, wrist bend
      const E = rig.pos(s + 'ForeArm'), W = rig.pos(s + 'Hand');
      const ua = E.clone().sub(shoulder).normalize(), fa = W.clone().sub(E).normalize();
      report[s] = {
        elbowFlex: rad2deg(ua.angleTo(fa)), flare: rad2deg(ua.angleTo(torsoDown)),
        wristSwing: rig.report[s + 'HandSwing'], pronation: rig.report[s + 'HandTwist'], handleSlant: oblique,
        reach: rig.report[s + 'ArmReach'], elbowBehindChest: E.z,
        touch,
        gripGaps: Object.fromEntries(Object.entries(grip).map(([k, g]) => [k, +(g.tipGap * 1000).toFixed(1)])),
      };
    }
    return report;
  }
}
