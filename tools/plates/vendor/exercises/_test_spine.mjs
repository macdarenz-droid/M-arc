// ENGINE TEST (not a real exercise card): the spine fields (LIB-SPINE). Front view from a camera raised 80 deg (nearly
// overhead), `torso: 'volume'`, `depth: 'view'`: lying on the back, hands behind the head, the left knee drawn up
// toward the chest. The end curls the trunk over the four spine pivots (array flex), so the drawn-up thigh is nearer
// the camera than the hip and is drawn over the trunk (group legs). The Mistake arches the low back (trunk.bow).
const lying = { root: { at: [0, 0.11, 0], tilt: -90 }, neck: 10, hip: { l: 140, r: 0 }, knee: { l: 100, r: 0 }, ankle: { l: 0, r: -20 },
  shoulder: { l: { flex: 150, abd: 30 }, r: { flex: 150, abd: 30 } }, elbow: 130 };
const start = { ...lying, trunk: { flex: [0, 0, 0, 0] } };
const end = { ...lying, trunk: { flex: [10, 15, 25, 30] }, neck: 20 };
export default {
  id: '_test_spine', name: 'Engine test · spine', view: 'front', torso: 'volume', depth: 'view',
  camera: { fit: true, pitch: 80 },
  poses: { start, end },
  equipment: [{ type: 'floor', from: [-0.5, 0, 0.6], to: [0.5, 0, 0.6] }],
  ghosts: { count: 2 },
  callouts: [
    { key: 'curl', text: 'Curl up', anchor: 'backUpper', cue: 'Curl the upper back off the floor.' },
    { key: 'knee', text: 'Knee in', anchor: 'knee.l', cue: 'Draw the knee toward the chest.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    pose: { trunk: { flex: [10, 15, 25, 30], bow: 12 } },
    tells: [{ key: 'arch', text: 'Arched back', anchor: { at: 'navel', pose: 'mistake' }, cue: 'The low back arches off the floor.' }],
  },
  alt: 'Engine test. Front view from above, lying on the back, curling up with one knee drawn toward the chest.',
};
