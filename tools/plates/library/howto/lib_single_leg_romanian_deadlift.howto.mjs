// LIB-SHIP W2: the How-to content of lib_single_leg_romanian_deadlift (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/single_leg_romanian_deadlift.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, no-zoom.json card-no-zoom): the card has none. Its hand claims (one dumbbell in the hand
// opposite the standing leg, gripped hard; c1, c3, c18) live in handling and setup step 1.
// Family (card parent romanian_deadlift, inherit[] grip.thumb and grip.wrist; D-SHIP-FAMILY, D-LIB9a-MAP form):
// handling.thumb.mode, handling.pose.thumb and handling.wrist are the parent sheet's values leaf for leaf
// (lib_romanian_deadlift.howto.mjs); each claim cites this card's own inherit reason. No `extends` (refused, D-LIB5-FAMILY).
// Red flags: the card's redFlags (back): LIB-5's back box, linked by the pain row's redFlag: 'back'. Tier-A way out:
// the card records a gap (LIB-WAYOUT), so no way-out line is written (Q-W2-3).
// Variant line (D-LIB5-VARIANT): equipment 'Dumbbell / Bodyweight'; the card's plate.variantLine says every
// body-position claim holds for the bodyweight version and the grip and load claims apply to the dumbbell only.
import plateSpec from '../specs/single_leg_romanian_deadlift.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-sl-rdl': { cite: 'ACE Exercise Library: Single-arm, Single-leg Romanian Dead Lift', url: 'https://www.acefitness.org/resources/everyone/exercise-library/127/single-arm-single-leg-romanian-dead-lift/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'sl-sl-rdl': { cite: 'How to Do Single Leg Romanian Deadlift: Muscles Worked & Proper form (StrengthLog)', url: 'https://www.strengthlog.com/single-leg-romanian-deadlift/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'gentilcore-slrdl': { cite: 'Perfecting the 1-Legged RDL (Tony Gentilcore)', url: 'https://tonygentilcore.com/2011/06/perfecting-the-1legged-rdl/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  mo2023: { cite: 'Effects of loading positions on the activation of trunk and hip muscles during flywheel and dumbbell single-leg Romanian deadlift exercises.', url: 'https://pubmed.ncbi.nlm.nih.gov/38093908/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c16 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-sl-rdl', SL = 'sl-sl-rdl', TG = 'gentilcore-slrdl';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [TG], 'c7'),
  c8: C(['CONSENSUS'], [TG], 'c8'),
  c9: C(['CONSENSUS'], [TG], 'c9'),
  c10: C(['CONSENSUS'], [TG], 'c10'),
  c11: C(['CONSENSUS'], [TG], 'c11'),
  c12: C(['CONSENSUS'], [TG], 'c12'),
  c17: C(['CONSENSUS'], ['acsm2009'], 'c17'),
  c19: C(['CONSENSUS'], [SL], 'c19'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'round' (card zoom slrdl-line Wrong, c7 "rounded back and shoulders"): the spec's
// Mistake pose merged over the end pose, as the engine draws it (card plate.mistake). The card's "head craned up" is
// not drawn, so no caption names it. 'locked' (card zoom slrdl-knee Wrong, c10 "standing knee locked straight"): the
// correct bottom with the root raised until the standing knee is straight; the whole upper body and free leg move up
// with it (both hand targets rise by the same amount, so the arms stay straight). The card gives no angle.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// locked knee's 1 deg (straight; 0 deg is the solver's edge) is a Wrong-pose size no card gives; no number from it
// appears in user copy; the layers panel judges it.
const H = 1.75, R = Math.PI / 180, END = plateSpec.poses.end, LOCK = 1;
const kneeL = lm => {
  const a = [0, 1, 2].map(i => lm['hip.l'][i] - lm['knee.l'][i]), b = [0, 1, 2].map(i => lm['ankle.l'][i] - lm['knee.l'][i]);
  return 180 - Math.acos((a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / Math.hypot(...a) / Math.hypot(...b)) / R;
};
const up = (p, dy) => [p[0], p[1] + dy, p[2]];
const raised = dy => ({ ...END, root: { ...END.root, at: up(END.root.at, dy) },
  reach: { l: { ...END.reach.l, at: up(END.reach.l.at, dy) }, r: { ...END.reach.r, at: up(END.reach.r.at, dy) } } });
const LOCK_DY = (() => {   // halving search: the knee straightens as the root rises
  let a = 0, b = 0.2;
  for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (kneeL(landmarksOf(raised(m), H)) > LOCK) a = m; else b = m; }
  return (a + b) / 2;
})();
const ROUND = plateSpec.mistake.pose, LOCKED = (({ root, reach }) => ({ root, reach }))(raised(LOCK_DY));
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  round: { pose: { ...END, ...ROUND } },
  locked: { pose: { ...END, ...LOCKED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom. Zoom shell form (render/closeup/crop.mjs): each crop centre is on the right pose for both halves;
// the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'slrdl-line', chip: 'Line', heading: 'Body line', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Straight line', anchor: 'buttock' },
      wrong: { text: 'Back rounded', anchor: 'backUpper' },
    },
    caption: {
      right: 'Head, back and free leg in one straight line.',
      wrong: 'Back and shoulders rounded.',
    },
    // alt (W2 fix round, #385 6648438434): Right c8 (one straight line), c9 (mid-shin); Wrong c7.
    // `cite`: the card claim ids of each half's callout, caption and alt (lint/index.mjs zoomCites; #385 6649353130).
    cite: { right: ['c8', 'c9'], wrong: ['c7'] },
    alt: {
      right: 'Side view, bottom of the lift. Head, back and free leg form one straight line. The dumbbell is at mid-shin.',
      wrong: 'Side view. The back and shoulders round as the dumbbell is reached down to the floor.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'slrdl-knee', chip: 'Knee', heading: 'Standing knee', kind: 'posture',
    crop: { center: { at: 'knee.l', pose: 'right', off: [0, 0] }, sizePx: 130 },
    right: 'end',
    wrong: { base: 'end', pose: LOCKED, solid: true },
    callout: {
      right: { text: 'Soft knee', anchor: 'knee.l' },
      wrong: { text: 'Knee locked', anchor: 'knee.l' },
    },
    caption: {
      right: 'Standing knee soft, about 15-20 degrees.',
      wrong: 'Standing knee locked straight.',
    },
    alt: {
      right: 'Side view, bottom of the lift. The standing knee is softly bent, about 15 to 20 degrees.',
      wrong: 'Side view. The standing knee is locked straight.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (back of the standing thigh, c9; buttock of the standing leg, c14) have no fix, so they
// are left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings work very hard in this lift.' },
    { muscleId: 'glutes', plain: 'The glutes work very hard too.' },
  ],
  secondary: [
    { muscleId: 'lower_back', plain: 'The lower back works to hold the trunk.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the back of your standing thigh and buttock.',
  rows: [
    { key: 'low-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      // D-FEEL-MEANS-CAUSAL, D-FEEL-NOMEANS (#385 6648438434): the card ties no fault to harm (plate.mistake rankNote),
      // so no cause is written and no label prints.
      means: '',
      fix: "Stop the set. Don't train through the pain.",
      zoom: 'slrdl-line', redFlag: 'back', claim: CL.c7 },
  ],
  libraryDiff: { add: ['lower_back'], why: 'Lower-back activity was measured in this lift; glutes move to primary (card c14, c15).' },
  claim: C(['CONSENSUS', 'DATA'], [TG, 'mo2023'], 'c9, c14'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'reach', title: 'Reaching to the floor, rounding', zoom: 'slrdl-line', claim: C(['CONSENSUS'], [TG], 'c7, c9'),
    fix: 'Stop around mid-shin with a flat back.' },
  { key: 'hip', title: 'Opening the lifted-leg hip', claim: C(['CONSENSUS'], [SL, TG], 'c5, c12'),
    fix: 'Keep both hips pointing at the floor. Shorten the range if needed.' },
  { key: 'toes', title: 'Weight drifting onto the toes', claim: CL.c11,
    fix: 'Push the hips back and sit into the standing heel.' },
];
const RISKS = [
  { key: 'balance', text: "Losing balance on one leg: keep the free leg's toes on the floor.",
    claim: C(['CONSENSUS'], [SL, TG], 'c6, c13') },
  { key: 'round', text: 'Rounding the back while reaching low.', claim: CL.c7 },
];

// The parent's thumb and wrist (lib_romanian_deadlift.howto.mjs), by the card's inherit[] reasons (MECH).
const INHERIT_THUMB = C(['MECH'], [], 'card inherit grip.thumb: the parent\'s wrapped thumb carries over to a dumbbell handle by reasoning (MECH).');
const INHERIT_WRIST = C(['MECH'], [], 'card inherit grip.wrist: same hold archetype and hanging load as the parent, so its neutral range applies (MECH).');

export default {
  schema: 1,
  id: 'lib_single_leg_romanian_deadlift',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: the card has no hand zoom (card-no-zoom); the grip copy carries c1, c3 and c18.',
    // No orientation: card grip.type names none (one dumbbell in the hand opposite the standing leg).
    handle: 'dumbbell',
    width: { text: 'One hand. The dumbbell lowers in front of the standing leg.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: INHERIT_THUMB },   // === the parent's handling.thumb.mode
    contact: 'mid-palm',       // card grip.handContact: handle across the middle of the palm, gripped hard (c18)
    // === the parent's handling.wrist, leaf for leaf (D-LIB9a-MAP); the claim (left out of the compare) is this card's.
    wrist: { ext: [-10, 10], limitText: 'Keep the wrist neutral, in line with the forearm.', claim: INHERIT_WRIST },
    pose: { thumb: 'wrapped' },   // === the parent's handling.pose.thumb; no hand pose is drawn (no hand zoom)
    faults: [],                   // the card has no hand zoom and no handling mistake is a hand fault
    gripLine: 'One dumbbell in the hand opposite your standing leg. Grip it hard, thumb wrapped.',   // thumb: inherit
    gripCite: ['c1', 'c18'],   // the gripLine's card claim ids (lint/index.mjs zoomCites; #385 6649353130)
    cue: 'Grip hard, arm straight.',   // c18, c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Hold one dumbbell in the hand opposite your standing leg.', claim: CL.c1 },
    { kind: 'position', text: 'Stand on that leg with the knee soft, about 15-20 degrees.', zoom: 'slrdl-knee', claim: CL.c10 },
    { kind: 'safety', text: "Balance shaky? Keep the free leg's toes touching the floor.", claim: CL.c6 },
    { kind: 'position', text: 'Do all reps on one leg, then switch.', claim: CL.c19 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c17 },
  ],
  posture: [
    { key: 'hips', label: 'Hips back', detail: "Hips back. Don't reach the dumbbell down.",
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c9 },
    { key: 'line', label: 'Straight line', detail: 'Head to heel in one straight line, neck neutral.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'slrdl-line', claim: CL.c8 },
    { key: 'knee', label: 'Soft knee', detail: 'Standing knee bent about 15-20 degrees, not locked.',
      anchor: { landmark: 'knee.l', pose: 'end' }, zoom: 'slrdl-knee', claim: CL.c10 },
    { key: 'level', label: 'Hips level', detail: 'Hips level. The lifted side does not turn up.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'heel', label: 'Heel weighted', detail: 'Weight back in the standing heel.',
      anchor: { landmark: 'heel.l', pose: 'end' }, claim: CL.c11 },
    { key: 'range', label: 'Shorter range', detail: 'A shorter range is fine while control builds.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c12 },
  ],
  feel,
  zooms,
  chips: ['slrdl-line', 'slrdl-knee', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Dumbbell in the hand opposite your standing leg. Standing knee soft, about 15-20 degrees.',
    mistakeLine: "Don't reach the dumbbell to the floor. Stop around mid-shin with a flat back.",
    cueLine: 'Hips back, one straight line.',
    // card plate.variantLine: the body-position claims (c2, c5, c6, c8, c10, c11, c12) hold for the bodyweight
    // version; the grip and load claims (c3, c14, c18) apply to the dumbbell only.
    variantLine: 'Bodyweight version: same body position, no dumbbell to hold.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/single_leg_romanian_deadlift.json', rev: 1 },
};
