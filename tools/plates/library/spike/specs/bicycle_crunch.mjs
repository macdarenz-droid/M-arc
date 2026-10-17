// ENGINE SPIKE (do not merge): bicycle crunch, FRONT view from the feet with a raised camera (pitch) and E-R5
// trunk.yaw. Lying on the floor, shoulders curled up, hands at the head, elbows wide; the chest turns toward the knee
// drawn in while the other leg extends. Mistake: chest square, neck pulled forward.
import { landmarksOf } from '../../engine.mjs';
import { add, mul, axes } from './util.mjs';
const H = 1.75, CURL = 35, YAW = 30, PITCH = Number(process.env.SPIKE_PITCH ?? 80);
const legs = (inL, inR) => ({ hip: { l: inL ? 105 : 45, r: inR ? 105 : 45 }, knee: { l: inL ? 105 : 15, r: inR ? 105 : 15 } });
const raw = (yaw, inL, inR, neck = 15) => ({ root: { at: [0, 0, 0], tilt: -90 }, trunk: { flex: CURL, yaw }, neck, ...legs(inL, inR) });
const onFloor = p => { const lm = landmarksOf(p, H); return { ...p, root: { ...p.root, at: [0, -lm.buttock[1] + 0.0, 0] } }; };
const hands = lm => { const a = axes(lm), e = lm.ear; return { l: { at: add(add(e, mul(a.lat, 0.085)), mul(a.up, -0.02)), pole: add(mul(a.lat, 1), mul(a.up, -0.2)) }, r: { at: add(add(e, mul(a.lat, -0.085)), mul(a.up, -0.02)), pole: add(mul(a.lat, -1), mul(a.up, -0.2)) } }; };
const pose = (yaw, inL, inR, neck) => { const b = onFloor(raw(yaw, inL, inR, neck)); return { ...b, reach: hands(landmarksOf(b, H)) }; };
// right elbow toward the left knee: the chest turns left (yaw +)
const start = pose(YAW, true, false), end = pose(-YAW, false, true);
const midLegs = { ...onFloor({ ...raw(0, false, false), hip: { l: 75, r: 75 }, knee: { l: 60, r: 60 } }) };
const via = [{ ...midLegs, reach: hands(landmarksOf(midLegs, H)) }];
const m0 = pose(0, false, true, 45);
export default {
  id: 'bicycle_crunch', name: 'Bicycle Crunch', view: 'front', viewLabel: 'Top view', camera: { fit: true, pitch: PITCH }, torso: 'volume',
  poses: { start, via, end },
  equipment: [{ type: 'floor', from: [-0.8, 0, 0.6], to: [0.8, 0, 0.6] }],
  ghosts: { count: 1 },
  trace: { point: 'elbow.r', trim: [10, 10] },
  callouts: [
    { key: 'turn', text: 'Turn the chest', anchor: 'shoulder.l', cue: 'Turn the chest toward the knee.' },
    { key: 'leg', text: 'Long leg', anchor: 'ankle.l', cue: 'The other leg reaches long.' },
  ],
  mistake: { pose: { trunk: { flex: CURL, yaw: 0 }, neck: 45, reach: m0.reach }, tells: [{ key: 'neck', text: 'Neck pulled', anchor: { at: 'head', pose: 'mistake' }, cue: 'The hands pull the head forward.' }] },
  alt: 'Bicycle crunch, front view from the feet (engine spike).',
};
