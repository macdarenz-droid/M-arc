// FG-6 fixture, not a shipped exercise (FG-8 authors the real file from research): a prone side-view file that runs
// every §5 check through the side rig. Numbers are illustrative, inside the fixture's research ranges and AAOS.
import type { ExerciseGuide } from '@/formguide/model';

export const lib_superman: ExerciseGuide = {
  id: 'lib_superman', kind: 'rep', order: 'lift_first',
  camera: { full: 'standingFront', zoom: 'upperFront', subject: 'hip_r' }, pose: 'lying_prone',
  equipment: { kind: 'none', attach: [] , loadFrom: 'bodyweight' },
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { shoulder_flex: 0, hip_flex: [0, -15], torso_lean: [0, 15] },
  movement: { breathe: 'out on lower', leanDeg: 0.3 },
  muscles: { target: ['lower_back'], helps: ['glutes', 'hamstrings'], keepQuiet: ['upper_traps'],
    effort: { lower_back: [0.2, 0.9], glutes: [0.1, 0.5], hamstrings: [0.1, 0.4], upper_traps: 0.1 } },
  cues: ['Lift chest and legs together.', 'Neck long, eyes to the floor.', 'Hold, then lower slowly.'],
  mistake: { name: 'Yank up and over-arch', tempo: { lift: 0.5, hold: 0.3, lower: 1, rest: 2.2 },
    joints: { hip_flex: [0, -8], torso_lean: [0, 9] },
    muscles: { upper_traps: [0.1, 0.5] },
    tells: [{ text: 'The legs kick up past the hips.', joint: 'hip_flex' }, { text: 'The chest jerks up, over-arching.', joint: 'torso_lean' }] },
  sources: ['FG-6 fixture'],
};
