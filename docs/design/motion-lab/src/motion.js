// MO: the motion view controller: loads the shared figure and a machine, solves each frame from time t,
// and renders it in the current theme. renderAt(t) is pure (same t, same frame), for review and tests.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { Rig, metaToGl } from './rig.js';
import { SeatedPress } from './seated.js';
import * as S from './scene.js';
import * as CP from './machines/chestPress.js';

const V = THREE.Vector3;
const ease = (x) => { const t = Math.min(1, Math.max(0, x)); return t * t * t * (10 - 15 * t + 6 * t * t); };   // minimum jerk

async function loadGlb(src) {
  const loader = new GLTFLoader();
  if (src instanceof ArrayBuffer) return new Promise((res, rej) => loader.parse(src, '', res, rej));
  return loader.loadAsync(src);
}

export async function createMotion({ canvas, assets, themes, exercise, width, height, pixelRatio = 1, preserve = false }) {
  const renderer = S.createRenderer(canvas, { width, height, pixelRatio, preserve });
  if (!renderer) return null;
  const { scene, shadow } = S.createScene(renderer);
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.02, 30);

  const [figG, machG] = await Promise.all([loadGlb(assets.figure), loadGlb(assets.machine)]);
  const meta = metaToGl(structuredClone(assets.meta));
  const regions = assets.regions;

  // figure
  const figRoot = figG.scene; scene.add(figRoot);
  let skinned; figRoot.traverse(o => { if (o.isSkinnedMesh) skinned = o; });
  skinned.frustumCulled = false;
  const clothTex = skinned.material.map || null; if (clothTex) clothTex.colorSpace = THREE.NoColorSpace;
  const figMat = S.figureMaterial(clothTex); skinned.material = figMat;
  const rig = new Rig(figRoot, skinned, meta);

  // machine: Meshy body + coded arms
  const machRoot = machG.scene; scene.add(machRoot);
  const meshes = []; machRoot.traverse(o => { if (o.isMesh) meshes.push(o); });
  const seatNode = machRoot.getObjectByName('seat');
  const seatBaseY = seatNode ? seatNode.position.y : 0;
  machRoot.updateMatrixWorld(true);
  const seatMeshes = new Set(); if (seatNode) seatNode.traverse(o => { if (o.isMesh) seatMeshes.add(o); });
  const pad = CP.measurePad(meshes.filter(m => !seatMeshes.has(m)));
  let mats = S.machineMaterials(S.palette(themes[0]));

  const setup = exercise.setup;
  const press = new SeatedPress({
    rig, skinned, regionIds: regions.ids, pad, seatTop: CP.BODY.seatTop, feet: setup.feet, flareDeg: setup.flareDeg,
    retractDeg: setup.retractDeg, depressDeg: setup.depressDeg, handle: setup.handle, wristExtDeg: setup.wristExtDeg,
  });

  // seat the figure with arms at rest to measure the chest, then build the handle paths from it
  const nippleIds = nearestVertices(skinned, regions.landmarks.nipples);
  rig.reset(); press.torso({}); press.placeHips({}); rig.apply();
  const chest = press.measureChest(nippleIds);
  rig.fk();
  const paths = {};
  for (const [side, sx] of [['Left', 1], ['Right', -1]]) {
    const hub = CP.BODY.hubs[side];
    const start = new V(sx * setup.startHalfWidth, chest.nippleY, chest.chestFrontZ);
    const shoulder = rig.pos(side + 'Arm');
    const l1 = rig.restLen(side + 'Arm', side + 'ForeArm'), l2 = rig.restLen(side + 'ForeArm', side + 'Hand');
    const reachFor = (flexDeg) => { const f = THREE.MathUtils.degToRad(flexDeg); return Math.sqrt(l1 * l1 + l2 * l2 + 2 * l1 * l2 * Math.cos(f)) + 0.085; };
    const endAt = (flexDeg) => {
      const want = reachFor(flexDeg);
      let lo = start.z, hi = start.z + 0.8;
      for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; const e = CP.endOnSphere(hub, start, sx * setup.endHalfWidth, m); if (e.distanceTo(shoulder) < want) lo = m; else hi = m; }
      return CP.endOnSphere(hub, start, sx * setup.endHalfWidth, (lo + hi) / 2);
    };
    const end = endAt(setup.endElbowFlexDeg);
    const arm = CP.makeArm(hub, start, end);
    // lock-out (mistake): further along the same arc, until the elbow would be straight
    let lo = 1, hi = 1.8; const want0 = reachFor(0);
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (arm.at(m).distanceTo(shoulder) < want0) lo = m; else hi = m; }
    paths[side] = { arm, uLock: (lo + hi) / 2, start, end, thumb0: new V(-sx, 0, 0) };
  }
  const levers = {};
  for (const side of ['Left', 'Right']) {
    levers[side] = CP.buildLever(mats, paths[side].arm.hub, paths[side].start, paths[side].thumb0);
    scene.add(levers[side].group);
  }

  const state = { theme: themes[0], mode: 'right', view: 'three', reduced: false, tiersOn: true };
  const cycle = exercise.tempo.reduce((a, p) => a + p.s, 0);

  function phaseAt(t) {
    let x = ((t % cycle) + cycle) % cycle;
    for (const p of exercise.tempo) { if (x < p.s) return { key: p.key, label: p.label, f: x / p.s }; x -= p.s; }
    return { key: 'rest', label: 'Rest', f: 1 };
  }
  function progress(ph) {
    if (ph.key === 'press') return ease(ph.f);
    if (ph.key === 'hold') return 1;
    if (ph.key === 'return') return 1 - ease(ph.f);
    return 0;
  }

  let last = { report: null, anchors: {}, phase: null };
  /** Pose the figure with both handles at arc position uu (0 = start) under mode state st. */
  function poseAt(uu, st) {
    rig.reset();
    press.torso(st);
    press.placeHips(st);
    if (seatNode) seatNode.position.y = seatBaseY + (st.seatDrop || 0);
    const handles = {};
    for (const side of ['Left', 'Right']) {
      const P = paths[side];
      handles[side] = { centre: P.arm.at(uu), axis: P.arm.handleAxis(uu, P.thumb0) };
      CP.setLever(levers[side], P.arm, uu);
    }
    const report = press.arms(handles, st);
    rig.apply();
    return { report, handles };
  }
  // the arc's u = 1 is wherever the elbow is the chosen few degrees short of straight, found on the real pose
  // (the hand's size makes any shortcut too rough near a straight arm); the lock-out mistake goes on until
  // the elbow is straight under that mistake's own posture
  const elbowAt = (uu, st) => { const r = poseAt(uu, st).report; return (r.Left.elbowFlex + r.Right.elbowFlex) / 2; };
  const findU = (target, st, lo = 0.5, hi = 1.6) => { for (let i = 0; i < 22; i++) { const m = (lo + hi) / 2; if (elbowAt(m, st) > target) lo = m; else hi = m; } return (lo + hi) / 2; };
  const uEnd = findU(setup.endElbowFlexDeg, {});
  const lockMode = Object.values(exercise.modes).find(md => md.state && md.state(1).endElbowFlexDeg === 0);
  // lock-out: the straightest elbow reachable along the arc under the mistake's posture (sampled; the arc
  // turns back toward the body past its far point, so the elbow angle is not monotonic in u)
  let uLock = uEnd;
  if (lockMode) { let best = Infinity; for (let k = 0; k <= 24; k++) { const uu = uEnd * 0.85 + (0.3 + uEnd * 0.15) * k / 24; const e = elbowAt(uu, lockMode.state(1)); if (e < best) { best = e; uLock = uu; } } }

  function solve(t) {
    const ph = phaseAt(t); const u = progress(ph);
    const mode = exercise.modes[state.mode] || exercise.modes.right;
    const st = mode.state ? mode.state(u) : {};
    const uu = u * (st.endElbowFlexDeg === 0 ? uLock : uEnd);
    const { report, handles } = poseAt(uu, st);
    report.contacts = press.lastContacts; report.phase = ph.key; report.u = u;
    report.handleY = handles.Left.centre.y; report.nippleY = chest.nippleY;
    // callout anchors (figure space)
    const anchors = {
      handle: handles.Left.centre.clone(),
      elbow: rig.pos('LeftForeArm'),
      blades: rig.pos('Spine').add(new V(0.06, -0.02, -0.12)),
    };
    last = { report, anchors, phase: ph, u };
    return last;
  }

  function applyTheme(theme) {
    state.theme = theme;
    const pal = S.palette(theme);
    S.applyFigurePalette(figMat, pal);
    const nm = S.machineMaterials(pal);
    for (const m of meshes) {
      const list = Array.isArray(m.material) ? m.material : [m.material];
      const next = list.map(x => nm[x.name] || nm.frame);
      m.material = Array.isArray(m.material) ? next : next[0];
    }
    for (const lv of Object.values(levers)) {
      lv.parts.tube.material = nm.frame; lv.parts.cap.material = nm.frame;
      lv.parts.grip.material = nm.grip; lv.parts.endCap.material = nm.metal; lv.parts.collar.material = nm.metal;
    }
    shadow.material.opacity = pal.dark ? 0.9 : 0.55;
    return pal;
  }

  function applyTiers() {
    const mode = exercise.modes[state.mode] || {};
    const tiers = { ...exercise.tiers, ...(mode.tiers || {}) };
    S.setTiers(figMat, regions.ids, state.tiersOn ? tiers : {});
  }

  function placeCamera() {
    if (state.customCam) { camera.position.set(...state.customCam.pos); camera.lookAt(new V(...state.customCam.target)); camera.updateMatrixWorld(); return; }
    const v = exercise.views[state.view] || exercise.views.three;
    const target = v.target === 'handle' ? last.anchors.handle.clone().add(new V(-0.02, -0.01, 0)) : new V(...v.target);
    const yaw = THREE.MathUtils.degToRad(v.yaw), pitch = THREE.MathUtils.degToRad(v.pitch);
    camera.position.set(target.x + v.dist * Math.sin(yaw) * Math.cos(pitch), target.y + v.dist * Math.sin(pitch), target.z + v.dist * Math.cos(yaw) * Math.cos(pitch));
    camera.lookAt(target);
    camera.updateMatrixWorld();
  }

  function renderAt(t, { pulse = true } = {}) {
    solve(t);
    applyTiers();
    figMat.userData.uniforms.uPulse.value = pulse && !state.reduced ? 0.5 + 0.5 * Math.sin((t / 1.4) * Math.PI * 2) : 0.6;
    placeCamera();
    renderer.render(scene, camera);
    return last;
  }

  function screenOf(p) {
    const v = p.clone().project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, visible: v.z < 1 };
  }

  applyTheme(themes[0]); applyTiers();
  return {
    renderer, scene, camera, rig, press, paths, chest, cycle, uEnd, uLock,
    setTheme: (id) => applyTheme(themes.find(t => t.id === id) || themes[0]),
    setMode: (m) => { state.mode = m; },
    setView: (v) => { state.view = v; },
    setTiers: (on) => { state.tiersOn = on; },
    setReduced: (r) => { state.reduced = r; },
    resize: (w, h) => { width = w; height = h; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); },
    phaseAt, renderAt, screenOf, get last() { return last; }, state, pad,
  };
}

function nearestVertices(skinned, points) {
  const v = new V(), out = [];
  skinned.updateMatrixWorld(true);
  for (const p of points) {
    const target = new V(...p); let best = -1, bd = Infinity;
    for (let i = 0; i < skinned.geometry.attributes.position.count; i++) {
      skinned.getVertexPosition(i, v); v.applyMatrix4(skinned.matrixWorld);
      const d = v.distanceToSquared(target); if (d < bd) { bd = d; best = i; }
    }
    out.push(best);
  }
  return out;
}
