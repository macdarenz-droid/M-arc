// LIB-12 key ball-contact (hands/DESIGN.md §1 module shape; drawing code in view-ball.mjs). Plan 2.3; research
// shared/implement-wall-ball.json. Front camera (the spec's camera is not used). Pilot B (D-LIB12-5).
import { viewPair } from './view-common.mjs';
import { WALL_BALL, ballHalf, ballProblems } from './view-ball.mjs';

export const KEY = 'ball-contact', OWNER = 'LIB-12', VIEW = 'ball';
export const HANDLE = { profile: 'wall-ball', diameterMm: WALL_BALL.diameterMm };   // D-LIB12-2
export const INPUTS = ['tools/plates/library/hands/view-ball.mjs', 'tools/plates/library/hands/view-common.mjs'];
export const VIEW_FILES = ['tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/geom.mjs'];
const B = 'shared/implement-wall-ball.json';
export const VARIANTS = {
  catch: {
    archetype: 'implement', loadAxis: 'across', wristRange: null, contact: 'underside',
    right: { contactDeg: 47, forearmDeg: 95 }, rightNote: 'Hands under',
    alt: 'Both hands under the ball, wrists about six inches apart, elbows in front and below.',
    drawn: { 'hands under the ball': [`${B}#c1`], 'wrists about 152 mm apart': [`${B}#c3`], 'elbows in front, not out': [`${B}#c2`] },
    faults: {
      'side-sandwich': { label: 'Hands on sides', side: 'sides', pose: { contactDeg: 0, forearmDeg: 25 }, markers: [], claims: [`${B}#c1`, `${B}#c2`, `${B}#c4`],
        alt: 'Hands on the sides of the ball with the elbows out; the ball can slip through.' },
    },
    claims: [`${B}#c1`, `${B}#c2`, `${B}#c3`, `${B}#c4`],
  },
};
export const IDS = { wall_ball: { variant: 'catch', orientation: 'under', faults: ['side-sandwich'], claims: [`${B}#c1`] } };
export const GAPS = { medicine_ball_slam: 'no hand placement, thumb, wrist or hand fault sourced (shared/implement-medicine-ball-slam.json gaps)' };
/** Census scope: plan 2.3 "ball-contact (2)". */
export const CENSUS = { source: 'plan 2.3 ball-contact (2)', count: 2 };

export function render(spec) {
  const out = viewPair({ uid: spec.uid, camera: 'front', right: ballHalf(spec.right), wrong: ballHalf(spec.wrong, { role: 'wrong' }),
    rightNote: spec.rightNote, wrongNote: spec.wrongNote, alt: spec.alt, panelHeight: spec.panelHeight ?? 200 });
  const problems = ballProblems(out.report);
  return { svg: out.svg, report: { ...out.report, problems, ok: problems.length === 0 } };
}
