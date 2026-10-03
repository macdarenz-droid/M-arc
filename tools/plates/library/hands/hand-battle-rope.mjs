// LIB-12 key battle-rope (hands/DESIGN.md §1 module shape): radial view, golden-B renderHandPair unchanged. Research
// shared/implement-battle-ropes.json. Pilot B (D-LIB12-5).
//
// The neutral grip (c1) is seen from above, but golden B's "above" row reads YOU / MACHINE, which names a machine that
// is not there. So render() draws the pair with the plain side label and renames it to "Seen from above" (D-LIB12-7).
import { renderHandPair } from '../../layers/engine/hand.mjs';
import { LIB12_CLAIMS, reportChecks } from './view-common.mjs';
export const KEY = 'battle-rope', OWNER = 'LIB-12', VIEW = 'radial';
export const HANDLE = { profile: 'battle-rope', diameterMm: 38 };   // drawing value, flagged (D-LIB12-2)
const BR = 'shared/implement-battle-ropes.json';
export const VARIANTS = {
  rope: {
    archetype: 'implement', loadAxis: 'across', wristRange: null, contact: 'palm',
    // wrist drawn straight: the sources conflict on the wrist (c5) and the card sets no wrist field (gap 1), so the wrist
    // is a drawing default, flagged on the sheet; contactAt .6 = in the palm (c3)
    right: { forearm: 180, wrist: { ext: 0 }, contactAt: 0.6, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
    rightNote: 'Palms facing', alt: 'Rope end in the palm, fingers wrapped round it, thumb closed over the fingers.',
    drawn: { 'rope in the palm, fingers wrapped': [`${BR}#c3`], 'thumb over the fingers': [`${BR}#c3`], 'palms facing each other': [`${BR}#c1`] },
    flags: ['wrist drawn straight: no settled source (implement-battle-ropes gap 1)', 'rope diameter 38 mm: drawing value (D-LIB12-2)'],
    faults: {
      'death-grip': { label: 'Too tight', side: 'squeezed', pose: { squeeze: 'max' }, markers: ['tendon'], claims: [`${BR}#c4`],
        alt: 'Fist squeezed hard round the rope; the forearm tendons stand out.' },
    },
    claims: [`${BR}#c1`, `${BR}#c3`, `${BR}#c4`],
  },
};
export const IDS = { battle_ropes: { variant: 'rope', orientation: 'neutral', faults: ['death-grip'], claims: [`${BR}#c1`] } };
export const GAPS = {};
/** Census scope: one of the implement 5 (census.json aggregates handZoomsNeeded implement). */
export const CENSUS = { source: 'census.json aggregates handZoomsNeeded implement (battle_ropes)', count: 1 };

/** Golden-B renderHandPair with the plain camera label "Seen from above" (no YOU / MACHINE row, D-LIB12-7). */
export function render(spec) {
  const out = renderHandPair({ ...spec, camera: 'side' });
  const swap = (svg, a, b) => { if (svg.split(a).length !== 2) throw new Error(`battle-rope: label anchor ${a} not found once`); return svg.replace(a, b); };
  const svg = swap(swap(out.svg, '>SEEN FROM THE SIDE<', '>SEEN FROM ABOVE<'), 'aria-label="Seen from the side. ', 'aria-label="Seen from above. ');
  const problems = battleRopeProblems(svg, out.report, spec);
  return { svg, report: { ...out.report, camera: 'above', problems, ok: problems.length === 0 } };
}
/** Geometry checks (C5-style): rope in the palm, thumb over the fingers, the squeeze marked on Wrong only. */
export function battleRopeProblems(svg, report, spec) {
  const bad = [], r = report.right, panel = role => svg.slice(svg.indexOf(`<g class="h-panel ${role}">`), role === 'right' ? svg.indexOf('<g class="h-panel wrong">') : undefined);
  if (spec.right.squeeze === 'max') bad.push('right: squeezed hard (c4: firm but relaxed)');
  if (spec.wrong.squeeze !== 'max') bad.push('wrong: not squeezed (c4 death grip)');
  if (r.thumb !== 'wrapped') bad.push(`right: thumb ${r.thumb} (c3: closed over the fingers)`);
  if (!(r.contactAt >= 0.4 && r.contactAt <= 0.8)) bad.push(`right: rope at ${r.contactAt} of the palm (c3: in the palm, .4-.8)`);
  if (r.handleDiameterMm !== HANDLE.diameterMm) bad.push(`right: rope ${r.handleDiameterMm} mm (expected ${HANDLE.diameterMm})`);
  if (panel('right').includes('h-mark thin')) bad.push('right: carries the squeeze (tendon) marker');
  if (!panel('wrong').includes('h-mark thin')) bad.push('wrong: no squeeze (tendon) marker (c4)');
  return bad;
}

/** The sheet's check hook (LIB-7 checks.mjs problemsOf): this key's own checks. */
export const checks = reportChecks;
/** Claim texts for the refs this key cites (a sheet resolves them here). */
export const CLAIMS_TEXT = LIB12_CLAIMS;
/** Sheet flags (D-LIB7-SHEET): this key's unsourced values. */
export const FLAGS = ['sizes and pose values: drawing values (D-LIB12-2, D-LIB12-9)'];
