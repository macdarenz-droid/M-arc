// ENGINE TEST (not a real exercise card): the E-R5 pose fields (LIB-20). Front view, standing, a light plate held in
// both hands and pressed out from the chest to arm's length. The normal plate sets no E-R5 field and no camera pitch,
// so it pins the default path of every one of them (a changed default moves its bytes). The Mistake sets all four:
// the hips turn (root.yaw), the chest twists further (trunk.yaw), the trunk bends sideways (trunk.lat) and the whole
// body tips (root.roll), feet planted.
const H = 1.75, ROOT = [0, 0.530 * H - 0.02, 0];   // knees soft, so the planted feet hold under every Mistake field
const feet = { l: { at: [0.07 * H, 0, 0.044 * H] }, r: { at: [-0.07 * H, 0, 0.044 * H] } };
const hands = z => ({ l: { at: [0.03, 1.28, z], pole: [1, -0.6, -0.3] }, r: { at: [-0.03, 1.28, z], pole: [-1, -0.6, -0.3] } });
const start = { root: { at: ROOT }, plant: feet, reach: hands(0.12) };
const end = { root: { at: ROOT }, plant: feet, reach: hands(0.50) };
export default {
  id: '_test_er5', name: 'Engine test · E-R5', view: 'front',
  poses: { start, end },
  equipment: [
    { type: 'floor', from: -0.51, to: 0.51 },
  ],
  ghosts: { count: 2, parts: ['arm.l', 'arm.r'] },
  callouts: [
    { key: 'square', text: 'Hips square', anchor: 'hip.l', cue: 'The hips and chest stay square to the front.' },
    { key: 'press', text: 'Press out', anchor: 'grip.r', cue: 'Press the hands straight out from the chest.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 1, move: true }],
  mistake: {
    pose: { root: { roll: 6, yaw: 20 }, trunk: { yaw: 25, lat: 10 } },
    tells: [
      { key: 'turn', text: 'Hips turn', anchor: { at: 'hip.l', pose: 'mistake' }, cue: 'The hips and chest turn away.' },
      { key: 'lean', text: 'Leans', anchor: { at: 'shoulder.r', pose: 'mistake' }, cue: 'The trunk leans and bends to one side.' },
    ],
  },
  alt: 'Engine test. Front view, standing, pressing a plate out from the chest with both hands.',
};
