// FG-6 fixture, not a shipped exercise (FG-8 authors the real file from research): a supine side-view file that runs
// every §5 check through the side rig. Numbers are illustrative, inside the fixture's research ranges and AAOS.
import type { ExerciseGuide } from '@/formguide/model';

export const lib_barbell_bench_press: ExerciseGuide = {
  id: 'lib_barbell_bench_press', kind: 'rep', order: 'lower_first',
  camera: { full: 'lyingSide', zoom: 'upperFront', subject: 'shoulder_r' }, pose: 'lying_supine',
  equipment: { kind: 'barbell', grip: 'overhand, just outside the shoulders', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet' },
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { shoulder_flex: [90, 20], elbow_flex: [2, 85], hip_flex: -20, knee_flex: 80, ankle_flex: 10 },
  movement: { breathe: 'out on lift', leanDeg: 0.3, bladeRhythm: 'blades pinned back and down on the bench' },
  muscles: { target: ['chest'], helps: ['front_delts', 'triceps'], keepQuiet: ['lower_back'], effort: { model: 'torque', chain: ['shoulder_r'] } },
  cues: ['Lower the bar to the lower chest.', 'Feet planted, hips on the bench.', 'Press up and slightly back.'],
  mistake: { name: 'Bounce with the hips up', tempo: { lift: 0.8, hold: 0.1, lower: 0.8, rest: 2.3 },
    joints: { hip_flex: { keys: [[0.4, 0], [0.55, -8], [0.8, 0]] }, torso_lean: { keys: [[0.4, 0], [0.55, 9], [0.8, 0]] } },
    muscles: { lower_back: [0.1, 0.5] },
    tells: [{ text: 'The hips lift off the bench.', joint: 'hip_flex' }, { text: 'The lower back over-arches.', joint: 'torso_lean' }] },
  sources: ['FG-6 fixture'],
};
