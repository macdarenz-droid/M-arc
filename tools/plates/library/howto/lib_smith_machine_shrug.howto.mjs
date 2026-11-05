// LIB-SHIP W4: the How-to content of lib_smith_machine_shrug (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/smith_machine_shrug.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `shrug-grip`, inherited from barbell_shrug,
// has a thumb fault for its Wrong and no key draws one. Its Right lives in gripLine; its Wrong is
// handling.faults[thumbless].alt.
// Family (card parent barbell_shrug; D-SHIP-FAMILY, W4 INHERIT_MAP): handling.thumb.mode, handling.contact and
// handling.faults[thumbless] are the parent sheet's values leaf for leaf (lib_barbell_shrug.howto.mjs); each claim
// cites this card's own inherit reason. The contact is the parent's hold-default CONVENTION, never shown.
// Own, not mapped: the wrist (card grip.wrist "Not given by any shrug source read", so `exempt` with the parent's text),
// the width (slightly wider than the shoulders, c1) and the orientation (overhand, c1). No `handle` (Q-W4-6): no card
// gives the Smith bar.
// Posture zoom smith-shrug-top is DV: the plate's Mistake is the head pushed forward (topFault head), so the zoom's
// Wrong (elbows bent, c3) is drawn from one joint, the elbow (DRAWING VALUE below). The plate Mistake's head text stays
// visible (plate tells, mistakes 'head', posture 'head').
// Red flags: the card's redFlags (shoulder): the shared shoulder box, linked by the pain row's redFlag: 'shoulder'.
// No variant line (equipment 'Smith Machine'). Plate moves: the unrack-rerack shared card covers the hooks.
import plateSpec from '../specs/smith_machine_shrug.mjs';
import { WINTER, REF, landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'motra-smith-shrug': { cite: 'Smith Machine Shrug - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/smithMachineShrug',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'eos-smith': { cite: 'How to Use a Smith Machine: 8 Exercises & Form Tips (EoS Fitness)', url: 'https://www.eosfitness.com/blog/how-to-use-smith-machine',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'WEAK' },
  // the parent's thumb rule (parent c10), cited by the inherited thumb (card inherit grip.thumb)
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // golden B's `hold` archetype default (the parent's): a convention for the wrist the card leaves to the archetype.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: thumb wrapped, contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MO = 'motra-smith-shrug';
const CL = {
  c1: C(['CONSENSUS'], [MO], 'c1'),
  c3: C(['CONSENSUS'], [MO], 'c3'),
  c4: C(['CONSENSUS'], [MO], 'c4'),
  c9: C(['DATA'], ['kolber2010'], 'c9'),
  c10: C(['DATA', 'WEAK'], ['macdougall1985'], 'c10'),
  up: C(['CONSENSUS', 'WEAK'], [MO, 'acsm2009'], 'c2, c7, c11'),
  grip: C(['CONSENSUS'], [MO, 'baechle-grip'], 'c1, inherit:0 (parent c10)'),
  unrack: C(['CONSENSUS'], ['eos-smith', MO], 'c6, c1'),
  rock: C(['CONSENSUS'], [MO, 'eos-smith', 'acsm2009'], 'c3, c5, c8'),
  elbows: C(['CONSENSUS'], [MO], 'c3, c2'),
  pain: C(['CONSENSUS', 'DATA'], [MO, 'kolber2010'], 'c4, c9'),
  thumb: C(['CONSENSUS'], ['baechle-grip'], 'card inherit grip.thumb: the same overhand straight bar (c1; parent c10)'),
  wrist: C(['CONVENTION'], ['hold-default'], 'card grip.wrist: no shrug source read gives the wrist (hold archetype default); not a card claim, never shown'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (shoulders up, arms long; c2) and the zoom's Wrong, the end with both elbows
// bent (c3 "bending the elbows too much"): the hands at the shorter reach of a bent elbow, the bar kept on the rail line.
// DRAWING VALUE (D-SHIP-DRAWVAL; precedent D-LIB7-2 and lib_romanian_deadlift's plumb arm): M_ELBOW, the Wrong's elbow
// bend, is a Wrong-pose size no card gives (c3 says only "too much"; the plate's own bend is the spec's 12 deg "slight").
// No number from it appears in user copy; the layers panel judges it.
const H = 1.75, END = plateSpec.poses.end, LE = landmarksOf(END, H);
const M_ELBOW = 60;                                     // deg, elbow flexion in the Wrong (DRAWING VALUE)
const bentReach = s => {   // the hand target on the same rail line (x, z kept) at the bent arm's length
  const a = WINTER.upperArm * H, b = (WINTER.forearm + REF.gripOff) * H, L = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(M_ELBOW * Math.PI / 180));
  const S = LE[`shoulder.${s}`], G = END.reach[s].at, dx = G[0] - S[0], dz = G[2] - S[2];
  return { ...END.reach[s], at: [G[0], S[1] - Math.sqrt(L * L - dx * dx - dz * dz), G[2]] };
};
const BENT = { reach: { l: bentReach('l'), r: bentReach('r') } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  bent: { pose: { ...END, ...BENT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `shrug-grip` (D-SHIP-HANDW4, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose for both halves; the Wrong is the DV pose drawn alone (solid).
const zooms = [
  {
    key: 'smith-shrug-top', chip: 'Top', heading: 'Top position', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, -20] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: BENT, solid: true },
    callout: {
      right: { text: 'Arms long', anchor: 'elbow.r' },
      wrong: { text: 'Elbows bent', anchor: 'elbow.r' },
    },
    caption: {
      right: 'Shoulders up toward the ears, arms long, head level.',
      wrong: 'Elbows bent, pulling the bar up with the arms.',
    },
    alt: {
      right: 'Side view, top of the lift. The shoulders rise toward the ears. The arms hang long, the head level.',
      wrong: 'Side view. The elbows bend and the arms pull the bar up the rails.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (between neck and shoulders, c5) has no fix, so it is left off the rows (D-SHIP-Q16); the feel
// line says it.
const feel = {
  primary: [{ muscleId: 'upper_traps', plain: 'The upper traps do the lifting.' }],
  secondary: [],
  watch: [],
  feelLine: 'You should feel this between your neck and shoulders.',
  rows: [
    { key: 'shoulder', where: 'Any neck or shoulder pain', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.pain },
  ],
  claim: C(['CONSENSUS'], ['eos-smith', MO], 'c5'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'head', title: 'Pushing the head forward', claim: CL.c3,
    fix: 'Keep the head level as the shoulders rise.' },
  { key: 'rock', title: 'Rocking the body', claim: CL.rock,
    fix: 'Use slow, steady reps. Add weight in small steps.' },
  { key: 'elbows', title: 'Bending the elbows', zoom: 'smith-shrug-top', claim: CL.elbows,
    fix: 'Keep the arms long. Lift with the shoulders.' },
];
const RISKS = [
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c10 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in lifting. Poor technique adds risk.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_smith_machine_shrug',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: shrug-grip, inherited from barbell_shrug: the Wrong is a thumb fault and no key draws one.',
    orientation: 'pronated',   // card grip.type: overhand (c1)
    // No handle (Q-W4-6): no card gives the Smith bar.
    loadAxis: 'across',        // golden B's hold default (dumbbell_lateral_raise: no push lever check)
    overBody: false,
    width: { text: 'Slightly wider than your shoulders.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.thumb },   // === the parent's handling.thumb.mode
    contact: 'mid-palm',       // === the parent's; CONVENTION: hold default (source hold-default), never shown
    // Own (not mapped): card grip.wrist is the parent's "not given" text, so the parent's exempt text.
    wrist: { exempt: 'card grip.wrist: no shrug source read gives the wrist (hold archetype default).', claim: CL.wrist },
    faults: [
      // === the parent's faults[key=thumbless] (card zoom shrug-grip wrong, inherit:2). Not drawn (no hand zoom).
      { key: 'thumbless', label: 'Thumb not wrapped', pose: {}, markers: [], alt: 'Thumb not wrapped around the bar.' },
    ],
    gripLine: 'Overhand, hands slightly wider than your shoulders. Thumbs wrapped around the bar, never left unwrapped.',
    cue: 'Arms long, head level.',   // c1, c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the bar at mid-thigh height.', claim: CL.c1 },
    { kind: 'safety', text: 'Set the safety pins so the bar cannot drop.', claim: CL.c4 },
    { kind: 'position', text: 'Stand with feet shoulder-width apart.', claim: CL.c1 },
    { kind: 'grip', text: 'Grip overhand, slightly wider than the shoulders, thumbs wrapped.', claim: CL.grip },
    { kind: 'get-in', text: 'Rotate the bar off the hooks and let the arms hang long.', claim: CL.unrack },
  ],
  posture: [
    { key: 'arms', label: 'Arms long', detail: 'Arms long, only a slight elbow bend.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'smith-shrug-top', claim: CL.c1 },
    { key: 'up', label: 'Straight up', detail: 'Shoulders straight up and down, no roll. Lower slowly.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.up },
    { key: 'head', label: 'Head still', detail: 'Head level, not pushed forward.',
      anchor: { landmark: 'head', pose: 'end' }, claim: CL.c3 },
    { key: 'still', label: 'Body still', detail: 'Body still, no rocking.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['smith-shrug-top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Bar at mid-thigh, safety pins set. Feet shoulder-width apart.',
    mistakeLine: 'Keep your head level. Never push it forward as the shoulders rise.',
    cueLine: 'Shoulders up, arms long, head level.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/smith_machine_shrug.json', rev: 1 },
};
