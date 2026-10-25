// ENGINE TEST (not a real exercise card): camera pitch and the volume trunk (LIB-20). Front view from a camera raised
// 15 deg, `torso: 'volume'`: a hip hinge (pelvis 75, spine 5, knees soft, feet planted) with the arms hanging, then
// raised out to the sides. The hinged trunk is nearer the camera than the knees, so it is drawn over the legs (group
// chest) and the head over it (headF). The Mistake rounds the back.
const H = 1.75;
const feet = { l: { at: [0.11, 0, 0] }, r: { at: [-0.11, 0, 0] } };
const hinge = { root: { at: [0, 0.86, -0.12], tilt: 75 }, trunk: 5, neck: -10, plant: feet };
const start = { ...hinge, shoulder: { flex: 75, abd: 8 }, elbow: 15 };
const end = { ...hinge, shoulder: { elev: 85, plane: 0 }, elbow: 15, scap: { pro: -3 } };
export default {
  id: '_test_pitch', name: 'Engine test · pitch', view: 'front', torso: 'volume',
  camera: { fit: true, pitch: 15 },
  poses: { start, end },
  equipment: [{ type: 'floor', from: [-0.55, 0, 0.1], to: [0.55, 0, 0.1] }],
  startParts: ['arm.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.l', 'arm.r'] },
  callouts: [
    { key: 'hinge', text: 'Flat back', anchor: 'backUpper', cue: 'Hinge at the hips with a flat back.' },
    { key: 'arms', text: 'Arms out', anchor: 'grip.r', cue: 'Raise the arms out to the sides.' },
  ],
  tempo: [{ phase: 'Raise', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: { trunk: 30, neck: 20 },
    tells: [{ key: 'round', text: 'Round back', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'The back rounds and the head drops.' }],
  },
  alt: 'Engine test. Front view from above, hinged at the hips, raising the arms out to the sides.',
};
