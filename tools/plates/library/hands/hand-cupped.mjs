// LIB-12 key cupped (hands/DESIGN.md §1 module shape; drawing code in view-cupped.mjs). Plan 2.3; goblet cites only its
// own card (D-LIB12-4). Pilot A (D-LIB12-5).
import { viewPair } from './view-common.mjs';
import { GOBLET_DUMBBELL, cuppedHalf, cuppedProblems } from './view-cupped.mjs';

export const KEY = 'cupped', OWNER = 'LIB-12', VIEW = 'cupped';
export const HANDLE = { profile: 'goblet-dumbbell', diameterMm: GOBLET_DUMBBELL.handleDiameterMm, headMm: GOBLET_DUMBBELL.headDiameterMm };   // D-LIB12-2
export const INPUTS = ['tools/plates/library/hands/view-cupped.mjs', 'tools/plates/library/hands/view-common.mjs'];
export const VIEW_FILES = ['tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/geom.mjs'];
const G = 'cards/goblet_squat.json';
export const VARIANTS = {
  goblet: {
    archetype: 'hold', loadAxis: 'along-forearm', wristRange: null, contact: 'under-head',
    right: { chestGapMm: 0 }, rightNote: 'Against the chest',
    alt: 'Dumbbell upright against the chest, both palms cupping the underside of its top end, elbows under the hands.',
    drawn: { 'dumbbell upright at the chest': [`${G}#g1`], 'palms under the top head': [`${G}#g1`], 'weight against the chest': [`${G}#g1`, `${G}#g5`], 'elbows close in': [`${G}#g2`] },
    faults: {
      'weight-away': { label: 'Weight away', side: 'forward', pose: { chestGapMm: 60 }, markers: [], claims: [`${G}#g6`],
        alt: 'The weight has drifted forward, away from the chest.' },
    },
    claims: [`${G}#g1`, `${G}#g2`, `${G}#g5`, `${G}#g6`],
  },
};
export const IDS = { goblet_squat: { variant: 'goblet', orientation: 'under', faults: ['weight-away'], claims: [`${G}#g1`] } };
export const GAPS = {
  dumbbell_overhead_triceps_extension: 'no hand fault sourced for the cupped grip (shared/cupped-thumb.json gap 1); its own card zooms on the handle wrap',
};
/** Census scope: plan 2.3 "cupped (2)". */
export const CENSUS = { source: 'plan 2.3 cupped (2)', count: 2 };

export function render(spec) {
  const out = viewPair({ uid: spec.uid, camera: 'side', right: cuppedHalf(spec.right), wrong: cuppedHalf(spec.wrong, { role: 'wrong' }),
    rightNote: spec.rightNote, wrongNote: spec.wrongNote, alt: spec.alt, panelHeight: spec.panelHeight ?? 240 });
  const problems = cuppedProblems(out.report);
  return { svg: out.svg, report: { ...out.report, problems, ok: problems.length === 0 } };
}
