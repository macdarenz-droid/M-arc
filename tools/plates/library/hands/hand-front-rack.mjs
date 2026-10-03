// LIB-12 key front-rack (hands/DESIGN.md §1 module shape; drawing code in view-front-rack.mjs). Plan 2.3; research
// shared/front-rack-exemption.json and cards/front_squat.json. The on-body wrist range is replaced by the exemption, so
// no wrist number is drawn or checked. Pilot A (D-LIB12-5).
import { LIB12_CLAIMS, reportChecks, viewPair } from './view-common.mjs';
import { FRONT_RACK_BAR, frontRackHalf, frontRackProblems } from './view-front-rack.mjs';

export const KEY = 'front-rack', OWNER = 'LIB-12', VIEW = 'front-rack';
export const HANDLE = { profile: 'bar-28', diameterMm: FRONT_RACK_BAR.diameterMm };   // golden B's bar value, explicit (D-LIB12-2)
export const INPUTS = ['tools/plates/library/hands/view-front-rack.mjs', 'tools/plates/library/hands/view-common.mjs'];
export const VIEW_FILES = ['tools/plates/layers/engine/hand.mjs', 'tools/plates/layers/engine/geom.mjs'];
const X = 'shared/front-rack-exemption.json', F = 'cards/front_squat.json';
export const VARIANTS = {
  rack: {
    archetype: 'on-body', loadAxis: 'across', wristRange: null, contact: 'fingers',
    right: { barLiftMm: 0, barForwardMm: 0, upperArmDeg: 10, barInPalm: false }, rightNote: 'On the shoulders',
    alt: 'Bar resting on the front of the shoulders, fingers loosely round it, elbows high.',
    drawn: { 'bar on the shoulders': [`${X}#c1`, `${X}#c5`, `${F}#c3`], 'loose grip, fingers on the bar': [`${X}#c4`, `${X}#c5`, `${F}#c4`], 'elbows high': [`${X}#c5`, `${F}#c4`] },
    faults: {
      'bar-off-shoulders': { label: 'Bar on hands', side: 'lifted', pose: { barLiftMm: 20, barForwardMm: 40, upperArmDeg: -25, barInPalm: true }, markers: [],
        claims: [`${X}#c4`, `${F}#c7`], alt: 'Bar lifted off the shoulders and held up in the hands, elbows down.' },
    },
    claims: [`${X}#c1`, `${X}#c4`, `${X}#c5`, `${F}#c3`, `${F}#c4`, `${F}#c7`],
  },
};
export const IDS = { front_squat: { variant: 'rack', orientation: 'under', faults: ['bar-off-shoulders'], claims: [`${X}#c5`] } };
export const GAPS = {};
/** Census scope: plan 2.3 "front-rack (1)". */
export const CENSUS = { source: 'plan 2.3 front-rack (1)', count: 1 };

export function render(spec) {
  const out = viewPair({ uid: spec.uid, camera: 'side', right: frontRackHalf(spec.right), wrong: frontRackHalf(spec.wrong, { role: 'wrong' }),
    rightNote: spec.rightNote, wrongNote: spec.wrongNote, alt: spec.alt, panelHeight: spec.panelHeight ?? 220 });
  const problems = frontRackProblems(out.report);
  return { svg: out.svg, report: { ...out.report, problems, ok: problems.length === 0 } };
}

/** The sheet's check hook (LIB-7 checks.mjs problemsOf): this view's own geometry checks. */
export const checks = reportChecks;
/** Claim texts for the refs this key cites (a sheet resolves them here). */
export const CLAIMS_TEXT = LIB12_CLAIMS;
/** Sheet flags (D-LIB7-SHEET): this key's unsourced values. */
export const FLAGS = ['sizes and pose values: drawing values (D-LIB12-2, D-LIB12-9)'];
