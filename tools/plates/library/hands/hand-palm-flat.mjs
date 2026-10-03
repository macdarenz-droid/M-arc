// LIB-12 key palm-flat (hands/DESIGN.md §1 module shape; drawing code in view-palm-flat.mjs). Plan 2.3; research
// shared/palm-flat.json (claims below as <file>#<cid>, pinned in lib12-claims.json). Pilot B (D-LIB12-5).
import { LIB12_CLAIMS, reportChecks, viewPair } from './view-common.mjs';
import { palmFlatHalf, palmFlatProblems } from './view-palm-flat.mjs';

export const KEY = 'palm-flat', OWNER = 'LIB-12', VIEW = 'palm-flat';
// no HANDLE: the hand lies on the floor (pairs.mjs requires a diameter only for a radial grip or a named profile)
export const INPUTS = ['tools/plates/library/hands/view-palm-flat.mjs', 'tools/plates/library/hands/view-common.mjs'];
export const VIEW_FILES = ['tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/geom.mjs'];
const PF = 'shared/palm-flat.json';
export const VARIANTS = {
  floor: {
    archetype: 'palm-flat', loadAxis: 'along-forearm', wristRange: null, contact: 'whole-hand',
    right: { forearmTilt: 0, cup: 0 }, rightNote: 'Whole hand down',
    alt: 'Hand flat on the floor, palm and fingers down, forearm straight up over the wrist.',
    drawn: { 'palm and fingers on the floor': [`${PF}#c2`], 'forearm over the wrist': [`${PF}#c1`, `${PF}#c3`, `${PF}#c6`], 'little-finger edge toward the camera': [`${PF}#c5`] },
    faults: {
      'cupped-palm': { label: 'Palm cupped', side: 'lifted', pose: { cup: 10 }, markers: [], claims: [`${PF}#c2`],
        alt: 'Palm arched off the floor, only the heel and fingertips down; the heel takes the load.' },
      'hand-ahead': { label: 'Hand ahead', side: 'tilted', pose: { forearmTilt: 25 }, markers: [], claims: [`${PF}#c3`, 'cards/mountain_climbers.json#c6'],
        alt: 'Hand flat but ahead of the shoulder, forearm leaning back.' },
    },
    claims: [`${PF}#c1`, `${PF}#c2`, `${PF}#c3`, `${PF}#c5`, `${PF}#c6`],
  },
};
const ids = ['push_up', 'incline_push_up', 'diamond_push_up', 'pike_push_up', 'burpee', 'mountain_climbers', 'bear_crawl', 'bird_dog'];
export const IDS = Object.fromEntries(ids.map(id => [id, { variant: 'floor', orientation: 'over', faults: ['cupped-palm', 'hand-ahead'], claims: [`${PF}#c1`, `${PF}#c2`] }]));
export const GAPS = {
  bench_dip: 'palm-flat research leaves it out (shared/palm-flat.json appliesToWhy): hands on a bench edge, no source read',
  renegade_row: 'palm-flat research leaves it out (shared/palm-flat.json appliesToWhy): hands on dumbbell handles',
};
/** Census scope (census.json aggregates.byHandArchetype / handZoomsNeeded: palm-flat 10). */
export const CENSUS = { source: 'census.json aggregates handZoomsNeeded palm-flat', count: 10 };

export function render(spec) {
  const wrongPose = spec.wrong, fault = wrongPose.cup > 0 ? 'cupped-palm' : 'hand-ahead';
  const out = viewPair({ uid: spec.uid, camera: 'side', right: palmFlatHalf(spec.right), wrong: palmFlatHalf(wrongPose, { role: 'wrong' }),
    rightNote: spec.rightNote, wrongNote: spec.wrongNote, alt: spec.alt, panelHeight: spec.panelHeight ?? 130 });
  const problems = palmFlatProblems(out.report, fault);
  return { svg: out.svg, report: { ...out.report, fault, problems, ok: problems.length === 0 } };
}

/** The sheet's check hook (LIB-7 checks.mjs problemsOf): this view's own geometry checks. */
export const checks = reportChecks;
/** Claim texts for the refs this key cites (a sheet resolves them here). */
export const CLAIMS_TEXT = LIB12_CLAIMS;
