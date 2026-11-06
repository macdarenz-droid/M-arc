// LIB-SHIP W7: the How-to content of lib_standing_leg_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/standing_leg_curl.json; its claim ids are named on each field's claim (card cN).
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the hands hold on for balance), so there is no hand claim to draw: NoHandling, and no hand zoom (the card
// has none). The card's grip.type and grip.width (c2, the handles for balance) are setup step 2.
// Zooms (section 17): knee-steady DV (the end pose with the working thigh swung back, so the knee leaves its place);
// top DV (the end pose with the knee bent short, the foot below the knee). pad-heel T (D-SHIP-TEXTZOOM: its wrong is
// null, LR-25): posture checkpoint `pad`, setup step 1.
// Red flags: the card's redFlags (knee, back): golden B's knee block and LIB-5's back box (shared/back-box.mjs).
// No variant line (equipment 'Machine').
//
// D-TEXT-GOLDEN (claim -> slot):
//   card posture 'Keep your upper body still' (c3)              -> setup 3, plate cue 'still'
//   card posture 'Keep your knee steady as you curl and lower' (c6) -> zoom knee-steady Right, plate cue 'knee'
//   card posture 'Curl until your foot is higher than your knee' (c4) -> setup 4, zoom top Right, plate cue 'foot'
//   card posture 'Hold the top for a second' (c16)              -> setup 4
//   card posture 'Lower slowly and straighten the leg fully' (c5, c4) -> setup 5
//   card posture 'Control the weight. Don't swing your leg' (c9) -> copy.cueLine, risk 'load'
//   T pad-heel Right 'Pad just above the heel' (c1)             -> setup 1, posture 'pad'
//   handlingMistake 'Dropping the weight down' (c7, c5)         -> setup 5 (D-TEXT-PRINTED), copy.mistakeLine, posture 'drop'
//   handlingMistake 'Arching your lower back' (c13)             -> feel row 'low-back', risk 'arch', posture 'arch'
//   handlingMistake 'Cutting the range short' (c8)              -> zoom top Wrong, posture 'top'
//   card setup 'Start with a lighter weight' (c1), c11 (one leg, then switch) -> copy.setupLine, setup 5
import plateSpec from '../specs/standing_leg_curl.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'hevy-stlc': { cite: 'Standing Leg Curls: How-to, Tips, Alternatives & More (Hevy)', url: 'https://www.hevyapp.com/exercises/how-to-standing-leg-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-stlc': { cite: 'How to Do Standing Leg Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/standing-leg-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-hc': { cite: '5 Types of Hamstring Curls for Stronger Thighs (Healthline)', url: 'https://www.healthline.com/health/hamstring-curls',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c10 (balance and machine design; fv-llc is only its third source, so it is not listed), c15 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const HV = 'hevy-stlc', SL = 'sl-stlc';
const CL = {
  c1: C(['CONSENSUS'], [SL, HV], 'card c1'),
  c2: C(['CONSENSUS'], [HV, SL], 'card c2'),
  c3: C(['CONSENSUS'], [HV, SL], 'card c3'),
  still: C(['CONSENSUS'], [HV, SL], 'card c3, c2'),
  c6: C(['CONSENSUS'], [HV], 'card c6'),
  c9: C(['CONSENSUS'], [HV, SL], 'card c9'),
  c13: C(['CONSENSUS', 'WEAK'], ['hl-hc'], 'card c13'),
  c14: C(['CONSENSUS', 'WEAK'], ['hl-hc'], 'card c14'),
  curl: C(['CONSENSUS'], [HV, SL], 'card c4, c16'),
  lower: C(['CONSENSUS'], [HV, SL], 'card c7, c5, c4, c11'),
  top: C(['CONSENSUS'], [HV], 'card c4, c8'),
  drop: C(['CONSENSUS'], [HV, SL], 'card c7, c5'),
  light: C(['CONSENSUS'], [SL, HV], 'card c1'),
  ham: C(['CONSENSUS'], [HV], 'card c12, c4'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (working leg straight) and end (the foot above the knee, c4; the knee in the
// same place, c6). Two one-joint Wrongs, each on the end pose:
//   drift (card zoom knee-steady Wrong, c6 "letting it travel forward as the leg extends and back as it flexes"): the
//         working hip extended KNEE_DRIFT, so the thigh swings back off the support pad and the knee leaves its place
//         at the axis (the bent-knee half of c6's travel; the knee bend, the standing leg and the trunk unchanged).
//   short (card zoom top Wrong, c8 "Range cut short"): the working knee bent only KNEE_SHORT, so the foot stays below
//         the knee (the spec's end bends it END_KNEE, the foot above the knee).
// DRAWING VALUES (D-SHIP-DRAWVAL): KNEE_DRIFT 30 deg and KNEE_SHORT 70 deg are Wrong-pose sizes no card gives; no number
// from them appears in user copy.
const KNEE_DRIFT = 30, KNEE_SHORT = 70;
const END = plateSpec.poses.end;
const DRIFT = { hip: { ...END.hip, r: END.hip.r - KNEE_DRIFT } };
const SHORT = { knee: { ...END.knee, r: KNEE_SHORT } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  drift: { pose: { ...END, ...DRIFT } },
  short: { pose: { ...END, ...SHORT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name; each Wrong drawn alone (solid).
const zooms = [
  {
    key: 'knee-steady', chip: 'Knee', heading: 'Knee steady', kind: 'posture',
    // claims: Right (callout, caption, alt) card c6, c2; Wrong card c6
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: DRIFT, solid: true },
    callout: {
      right: { text: 'Knee in place', anchor: 'knee.r' },
      wrong: { text: 'Knee moves', anchor: 'knee.r' },
    },
    caption: {
      right: 'Knee stays in place as the leg curls.',
      wrong: 'Knee travelling forward and back each rep.',
    },
    alt: {
      right: 'Side view, top of the curl. The working knee stays in the same place, the thigh on the pad.',
      wrong: 'Side view, top of the curl. The working thigh swings back, so the knee leaves its place.',
    },
  },
  {
    key: 'top', chip: 'Range', heading: 'Full curl', kind: 'posture',
    // claims: Right (callout, caption, alt) card c4; Wrong card c8
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: SHORT, solid: true },
    callout: {
      right: { text: 'Foot above knee', anchor: { at: 'heel.r', pose: 'right' } },
      wrong: { text: 'Cut short', anchor: { at: 'heel.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Foot higher than the knee at the top.',
      wrong: 'Range cut short.',
    },
    alt: {
      right: 'Side view, top of the curl. The working foot is higher than the knee.',
      wrong: 'Side view. The curl stops early, with the working foot still below the knee.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'hamstrings', plain: 'The backs of your thighs do the work.' }],
  secondary: [{ muscleId: 'calves', plain: 'Your calf helps bend the knee.' }],
  watch: [],
  // The card's first row (back of the thigh) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
  feelLine: 'You should feel this in the back of your thigh, strongest at the top.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Arching the lower back can cause back pain and discomfort.',
      fix: 'Avoid arching: contract your abs.',
      redFlag: 'back', claim: CL.c13 },
    { key: 'knee', where: 'Knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Pain here is a reason to stop.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c14 },
  ],
  claim: CL.ham,
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'arch', text: 'Arching your lower back can cause back pain and discomfort.', claim: CL.c13 },
  { key: 'jerk', text: 'Sudden, jerking movements can lead to injury.', claim: CL.c14 },
  { key: 'load', text: 'Too much weight makes you use momentum and body swinging.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_standing_leg_curl',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type and width (c2) are setup step 2.' },
  contacts: ['pivot-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the pad just above the heel of your working leg.', claim: CL.c1 },
    { kind: 'grip', text: 'Thighs against the support pad. Hold the handles for balance.', claim: CL.c2 },
    { kind: 'position', text: 'Plant your other foot firmly. Keep your upper body still.', claim: CL.c3 },
    { kind: 'position', text: 'Curl until your foot is higher than your knee. Hold a second.', claim: CL.curl },
    { kind: 'finish', text: "Don't drop it: lower slowly, straighten fully. Finish one leg, then switch.", claim: CL.lower },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom pad-heel as a text checkpoint (its wrong is null, LR-25)
    { key: 'pad', label: 'Pad above heel', detail: 'Pad just above the heel.', anchor: { landmark: 'heel.r', pose: 'start' }, claim: CL.c1 },
    { key: 'still', label: 'Upper body still', detail: 'Thighs on the pad, upper body still.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.still },
    { key: 'knee', label: 'Knee steady', detail: 'Keep your knee steady as you curl and lower.', anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'knee-steady', claim: CL.c6 },
    // Q-W2-12: handlingMistakes 'Cutting the range short' (c8), 'Dropping the weight down' (c7, c5) and 'Arching your
    // lower back' (c13) merged here, their fixes as the detail
    { key: 'top', label: 'Full range', detail: 'Curl until your ankle is higher than your knee, then straighten fully.', anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'top', claim: CL.top },
    { key: 'drop', label: 'Dropping the weight', detail: 'Lower it slowly, with control.', anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.drop },
    { key: 'arch', label: 'Low back', detail: 'Contract your abs.', anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.c13 },
    { key: 'swing', label: 'No swinging', detail: "Control the weight. Don't swing your leg.", anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c9 },
  ],
  feel,
  zooms,
  chips: ['knee-steady', 'top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Start with a lighter weight. Pad just above your heel.',   // card c1
    mistakeLine: "Don't drop the weight. Lower it slowly, with control.",   // card c7, c5
    cueLine: 'Control the weight, no swinging.',   // card c9
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): NoHandling; the card's handlingMistakes are posture checkpoints
  risks: RISKS,
  riskFlags: ['knee', 'back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/standing_leg_curl.json', rev: 1 },
};
