// LIB-SHIP W4: the How-to content of lib_back_extension (45-degree Roman chair, bodyweight), golden B's HowToContent
// shape (tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the
// verified card docs/research/howto/cards/back_extension.json; its claim ids are named on each field's claim.
// Handling: none, D-SHIP-GRIP (b2) (lib_plank's form): the card's archetype.hand is none (arms crossed over the chest or
// hands behind the head, c4); its grip claim c4 is cited on the arms setup step.
// Q-W2-12 (#379 6628699724): the card's handlingMistake 'Swinging with momentum.' (c9, c8) is the posture checkpoint
// `slow`, its fix its detail; the other two stay mistakes (each with its zoom).
// Pose map: the spec's start is the top (one straight line) and its end the bottom, hinged over the pad
// (specs/back_extension.mjs header).
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// back-pain row's redFlag: 'back'. Tier-A way out: no read source says how to fail a stuck rep, so no way-out line.
// Variant line (equipment 'Bodyweight / Machine'): the card's plate.variantLine, the drawn 45-degree bench.
import plateSpec from '../specs/back_extension.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-back-extension': { cite: 'How to Do Back Extensions: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/back-extension/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'physitrack-back-extension': { cite: '45 degree back extension (Physitrack exercise library)', url: 'https://us.physitrack.com/home-exercise-video/45-degree-back-extension',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'fitnessvolt-back-extension': { cite: '45-Degree Hyperextension: Strengthen Your Back and Glutes (Fitness Volt)', url: 'https://fitnessvolt.com/45-degree-hyperextension/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  andersen2021: { cite: 'Comparison of Muscle Activity in Three Single-Joint, Hip Extension Exercises in Resistance-Trained Women.', url: 'https://pubmed.ncbi.nlm.nih.gov/33948095/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  lariviere2011: { cite: 'Specificity of a back muscle roman chair exercise in healthy and back pain subjects.', url: 'https://pubmed.ncbi.nlm.nih.gov/20508534/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  mayer1999: { cite: 'Electromyographic activity of the lumbar extensor muscles: effect of angle and hand position during Roman chair exercise.', url: 'https://pubmed.ncbi.nlm.nih.gov/10414757/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back' (card
  // source nhs-back-pain, c18, c20).
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c21 (tempo, plate only); c22 (mat, bench or machine: the variant line names the drawn bench).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-back-extension', PT = 'physitrack-back-extension', FV = 'fitnessvolt-back-extension';
const CL = {
  c1: C(['CONSENSUS'], [SL, PT], 'c1'),
  c3: C(['CONSENSUS'], [SL, PT], 'c3'),
  c5: C(['CONSENSUS'], [PT, SL], 'c5'),
  c6: C(['CONSENSUS'], [FV], 'c6'),
  c7: C(['CONSENSUS'], [FV], 'c7'),
  c9: C(['CONSENSUS'], [FV], 'c9'),
  c10: C(['CONSENSUS'], [SL], 'c10'),
  c11: C(['CONSENSUS'], [FV, SL], 'c11'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  c19: C(['CONSENSUS'], [FV], 'c19'),
  round: C(['CONSENSUS'], [FV, SL], 'c6, c19, c2'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// bext-pad (M): the spec's end (the bottom, hinged at the hips with a straight back; c6, c7) and the spec's Mistake pose
// merged over it, as the engine draws it (the back rounds over the pad instead of the hips hinging; card plate.mistake,
// c6, c19). The card zoom's Wrong (a pad set too high, the back curled over it, c2) is that drawn rounding.
// bext-top (DV): the card zoom's Wrong (c5: the lower back arched past straight) is not a plate pose. 'arch' is the
// spec's top (start) with the lumbar spine extended ARCH deg (trunk -ARCH: the upper body tips back past the leg line;
// the sign checked with landmarksOf, as lib_plank's sag), the legs and the pad unchanged, the crossed arms put back on
// the chest by the spec's own chestHands (copied: the spec does not export it).
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): ARCH
// 25 deg is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, ARCH = 25, TOP = plateSpec.poses.start, ROUND = plateSpec.mistake.pose;
const chestHands = lm => {   // specs/back_extension.mjs chestHands, copied
  const c = lm.chest, s = lm.sternum, n = (() => { const d = [0, s[1] - lm.backUpper[1], s[2] - lm.backUpper[2]], L = Math.hypot(...d); return d.map(v => v / L); })();
  const at = [0, (c[1] + s[1]) / 2 + n[1] * 0.06, (c[2] + s[2]) / 2 + n[2] * 0.06];
  return { l: { at: [0.06, at[1], at[2]], pole: [1, -0.5, 0] }, r: { at: [-0.06, at[1], at[2]], pole: [-1, -0.5, 0] } };
};
const ARCH_POSE = { trunk: -ARCH, reach: chestHands(landmarksOf({ ...TOP, trunk: -ARCH, reach: undefined }, H)) };
export const stills = {
  start: { pose: TOP },
  end: { pose: plateSpec.poses.end },
  round: { pose: { ...plateSpec.poses.end, ...ROUND } },
  arch: { pose: { ...TOP, ...ARCH_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom (no hand zoom: handling none). Zoom shell form (render/closeup/crop.mjs): the crop centre on the
// right pose's mid-back for both halves; bext-pad's Wrong is drawn dashed over the Right (W4 panel L5); bext-top's alone (solid).
const zooms = [
  {
    key: 'bext-pad', chip: 'Pad', heading: 'Pad height', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND },   // W4 panel L5: dashed Wrong over the Right pose (the plate's Mistake overlay)
    callout: {
      right: { text: 'Hips hinge', anchor: 'buttock' },
      wrong: { text: 'Back curls', anchor: { at: 'backMid', pose: 'mistake' } },   // c2, c6 (the spec's tell)
    },
    caption: {
      right: 'Pad on the upper thighs, below the hip bones.',   // c1, c2
      wrong: 'Pad too high, back curled over it.',             // c2
    },
    alt: {
      right: 'Side view, bottom of the rep. Thighs on the pad below the hip bones, hinged at the hips, back straight.',
      wrong: 'Side view, bottom of the rep. The hips barely hinge and the back curls over the pad.',
    },
  },
  {
    key: 'bext-top', chip: 'Top', heading: 'Top line', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'start',
    wrong: { base: 'start', pose: ARCH_POSE, solid: true },
    callout: {
      right: { text: 'Straight line', anchor: 'backUpper' },
      wrong: { text: 'Over-arched', anchor: 'lumbar' },   // c5 (W4 panel L8: two words, so the sub-label keeps its margin)
    },
    caption: {
      right: 'Shoulders, spine and hips in one line. Squeeze the glutes.',   // c5 (W4 D-TEXT-PRINTED: glutes moved here)
      wrong: 'Lower back arched past straight.',                   // c5
    },
    alt: {
      right: 'Side view, top of the rep. Shoulders, spine and hips form one straight line with the legs.',
      wrong: 'Side view, top of the rep. The lower back arches and the upper body tips back past the leg line.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (the muscles it works, c14; a pump or tiredness, c13) have no fix, so they are left off
// the rows (D-SHIP-Q16); the feel line says them. The card's watch muscle (lower_back, c13) is already a primary; the
// deep-ache row carries it.
const feel = {
  primary: [
    { muscleId: 'lower_back', plain: 'The lower back works.' },                 // c14
    { muscleId: 'glutes', plain: 'The glutes work and tire clearly.' },         // c14, c16
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings help.' },                  // c14, c15
  ],
  watch: [],
  feelLine: 'You should feel this in your glutes, hamstrings and lower back. A pump, not a deep ache.',
  rows: [
    { key: 'ache', where: 'Deep ache in the lower back', at: { muscles: ['lower_back'] },
      means: 'Doing too much too soon can hurt your back.',   // c12 ("If you do too much, too soon, they can")
      fix: 'Take a week or two off, then come back lighter and check your form.',   // c13
      claim: C(['CONSENSUS'], [SL], 'c13, c12') },
    { key: 'back-pain', where: 'Lower back pain while lifting', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c20') },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, 'andersen2021', 'lariviere2011'], 'c14, c15, c16, c13'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const RISKS = [
  { key: 'too-much', text: 'Doing too much too soon can hurt the back.', claim: CL.c12 },
  { key: 'swing', text: 'Swinging with momentum raises injury risk.', claim: CL.c9 },
  { key: 'load', text: 'Rounding the back is more dangerous with added weight.', claim: CL.c19 },
];

export default {
  schema: 1,
  id: 'lib_back_extension',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none (arms crossed over the chest); its grip claim c4 is on the arms setup step.' },
  contacts: ['brace-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Pad on the top of your thighs, just below the hip bones.', zoom: 'bext-pad', claim: CL.c1 },
    { kind: 'position', text: 'Feet about shoulder width and secured, knees slightly bent.', claim: CL.c3 },
    { kind: 'position', text: 'Cross your arms over your chest (hands behind the head is harder).',
      claim: C(['CONSENSUS', 'DATA'], [SL, 'mayer1999'], 'c4, c17') },
    // W4 D-TEXT-PRINTED: posture c7 (depth) moved into this step.
    { kind: 'brace', text: 'Lower to just below parallel. Breathe in, then out as you rise.', claim: C(['CONSENSUS'], [FV, SL], 'c7, c10') },
    { kind: 'load', text: 'Start with body weight. Add weight after 12 to 15 good reps.', claim: CL.c11 },
  ],
  posture: [
    { key: 'hinge', label: 'Hinge at hips', detail: 'Bend at the hips, back stiff and straight.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'bext-pad', claim: CL.c6 },
    { key: 'depth', label: 'Depth', detail: 'Lower to just below parallel.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c7 },
    // Q-W2-12: handlingMistake 'Rounding the back' (c6, c19, c2) as a checkpoint; its fix is this detail.
    { key: 'round', label: 'No rounding', detail: 'Hinge at the hips. Set the pad below your hip bones.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'bext-pad', claim: CL.round },
    // Q-W2-12: handlingMistake 'Arching past straight' (c5) merged here; its fix is this detail.
    { key: 'line', label: 'Straight line', detail: 'Rise to a straight line and squeeze the glutes. Do not arch the lower back past straight.',
      anchor: { landmark: 'backUpper', pose: 'start' }, zoom: 'bext-top', claim: CL.c5 },
    // Q-W2-12: handlingMistake 'Swinging with momentum.' (c9, c8) merged here; its fix is this detail.
    { key: 'slow', label: 'Slow reps', detail: 'No swinging. Hold the top a second, then lower slowly.',
      anchor: { landmark: 'lumbar', pose: 'start' }, claim: C(['CONSENSUS'], [FV, SL], 'c9, c8') },
  ],
  feel,
  zooms,
  chips: ['bext-pad', 'bext-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Pad below your hip bones, feet secured. Hinge at the hips and rise to a straight line.',
    mistakeLine: "Don't round your back over the pad. Hinge at the hips.",
    cueLine: 'Hinge at hips, straight line.',
    // D-LIB5-VARIANT: card plate.variantLine, the drawn 45-degree bench (c1, c4, c15).
    variantLine: 'Drawn on the 45-degree back-extension bench (Roman chair).',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/back_extension.json', rev: 1 },
};
