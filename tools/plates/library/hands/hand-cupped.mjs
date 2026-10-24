// LIB-12 key cupped (hands/DESIGN.md §1 module shape; drawing code in view-cupped.mjs). Plan 2.3; goblet cites only its
// own card (D-LIB12-4). Pilot A (D-LIB12-5).
import { LIB12_CLAIMS, reportChecks } from './view-common.mjs';
import { handPair } from './lib12-hand.mjs';
import { GOBLET_DUMBBELL, cuppedHalf, cuppedProblems } from './view-cupped.mjs';

export const KEY = 'cupped', OWNER = 'LIB-12', VIEW = 'cupped';
export const HANDLE = { profile: 'goblet-dumbbell', diameterMm: GOBLET_DUMBBELL.handleDiameterMm, headMm: GOBLET_DUMBBELL.headDiameterMm };   // D-LIB12-2
export const INPUTS = ['tools/plates/library/hands/view-cupped.mjs', 'tools/plates/library/hands/lib12-hand.mjs', 'tools/plates/library/hands/view-common.mjs'];
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
// D-LIB12FIX-R8-GAPS (#191 6274835211): goblet_squat moved to GAPS after the one R8 fix round; its variant, words file and view
// code stay for follow-up F-LIB12-R8B.
export const IDS = {};
export const GAPS = {
  goblet_squat: 'R8 panel 2026-10-19: below the hand bar (lib4-cards 27)',
  dumbbell_overhead_triceps_extension: 'no hand fault sourced for the cupped grip (shared/cupped-thumb.json gap 1); its own card zooms on the handle wrap',
};
/** Census scope: plan 2.3 "cupped (2)". */
export const CENSUS = { source: 'plan 2.3 cupped (2)', count: 2 };

export function render(spec) {
  const out = handPair({ uid: spec.uid, camera: 'side', right: cuppedHalf(spec.right), wrong: cuppedHalf(spec.wrong, { role: 'wrong' }),
    rightNote: spec.rightNote, wrongNote: spec.wrongNote, alt: spec.alt, panelHeight: spec.panelHeight ?? 240 });
  const problems = cuppedProblems(out.report);
  return { svg: out.svg, report: { ...out.report, problems, ok: problems.length === 0 } };
}

/** The sheet's check hook (LIB-7 checks.mjs problemsOf): this view's own geometry checks. */
export const checks = reportChecks;
/** Claim texts for the refs this key cites (a sheet resolves them here). */
export const CLAIMS_TEXT = LIB12_CLAIMS;
/** Sheet flags (D-LIB7-SHEET): this key's unsourced values. */
export const FLAGS = ['sizes and pose values: drawing values (D-LIB12-2, D-LIB12-9)'];
