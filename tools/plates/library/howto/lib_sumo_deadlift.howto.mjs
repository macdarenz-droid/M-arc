// LIB-SHIP W4: the How-to content of lib_sumo_deadlift (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/sumo_deadlift.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `sumo-grip` is a placement zoom (hands
// inside the knees), not a hand pose. Its Right is handling.gripLine; its Wrong ('Hands outside the knees as in a
// conventional pull.') is setup step 2 (c3, inherit[0]).
// Family (card parent conventional_deadlift, inherit[] grip.thumb, grip.handContact, grip.wrist, archetype.contact,
// plate.equipment; D-SHIP-FAMILY, INHERIT_MAP lib_sumo_deadlift): handling.thumb.mode, handling.pose.thumb,
// handling.contact, handling.wrist and contacts are the parent sheet's values leaf for leaf
// (lib_conventional_deadlift.howto.mjs), written out, never imported. The card's inherit[4] plate.equipment (bar on the
// floor with full-size plates, parent c23) has no INHERIT_MAP path, so the family check refuses this id for it
// (D-SHIP-W4-ROUTE, Q-W4-9; expected until F-W4-INHERIT drops it): this sheet's own claim for it is CL.inhPlate, and the
// plate spec draws the parent's 45 cm plates on the floor line.
// Card zooms sumo-start and sumo-liftoff are merged into one zoom (sumo-start): both crop the same Right (the spec's
// floor start) and the same Wrong (the plate's own Mistake, hips shooting up with the bar on the floor), in the same
// box, so two zooms would draw one picture twice. Every claim of both (c4, c11, c12, c13, c15) stays visible.
// Red flags: the card's redFlags (back): LIB-5's back box, linked by the pain row's redFlag: 'back'. Tier-A way out:
// the card records none (LIB-WAYOUT gap), so no way-out line is written.
import plateSpec from '../specs/sumo_deadlift.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-sumo': { cite: 'How to Do Sumo Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/sumo-deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'barbend-sumo': { cite: 'How to Do the Sumo Deadlift, According to a CPT (BarBend)', url: 'https://barbend.com/sumo-deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  escamilla2000: { cite: 'A three-dimensional biomechanical analysis of sumo and conventional style deadlifts.', url: 'https://pubmed.ncbi.nlm.nih.gov/10912892/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  'sl-deadlift': { cite: 'How to Deadlift: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/deadlift/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  cholewicki1991: { cite: 'Lumbar spine loads during the lifting of extremely heavy weights.', url: 'https://pubmed.ncbi.nlm.nih.gov/1758295/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  escamilla2002: { cite: 'An electromyographic analysis of sumo and conventional style deadlifts.', url: 'https://pubmed.ncbi.nlm.nih.gov/11932579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  hanen2025: { cite: 'Biomechanical analysis of conventional and sumo deadlift.', url: 'https://pubmed.ncbi.nlm.nih.gov/40497251/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_romanian_deadlift lists it: the card's redFlags
  // 'back'. The card's nhs-back-pain (same url) is cited under this id (c22), so no source name repeats the box name.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c21 (tempo, plate only); c20 (the back box carries the 999 and GP lines).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SLS = 'sl-sumo', BB = 'barbend-sumo';
const CL = {
  c3: C(['CONSENSUS', 'DATA'], ['sl-deadlift', 'escamilla2000'], 'c3'),
  c4: C(['DATA'], ['escamilla2000', 'sl-deadlift'], 'c4'),
  c10: C(['CONSENSUS'], [BB, SLS], 'c10'),
  c11: C(['CONSENSUS'], [BB], 'c11'),
  c12: C(['CONSENSUS'], [BB], 'c12'),
  c13: C(['CONSENSUS'], [BB], 'c13'),
  c14: C(['CONSENSUS'], [BB], 'c14'),
  c15: C(['CONSENSUS'], [SLS], 'c15'),
  c16: C(['CONSENSUS'], [SLS], 'c16'),
  c17: C(['CONSENSUS'], [BB], 'c17'),
  c18: C(['CONSENSUS'], [BB, 'acsm2009'], 'c18'),
  c19: C(['DATA', 'WEAK'], ['macdougall1985'], 'c19'),
  // card inherit[]: the field is conventional_deadlift's, true here by the card's own inherit reason
  inhThumb: C(['CONSENSUS', 'DATA'], ['sl-deadlift', 'escamilla2000'], 'c3; card inherit[0] grip.thumb (conventional_deadlift)'),
  inhWrist: C(['CONSENSUS'], [SLS], 'c15; card inherit[2] grip.wrist (conventional_deadlift). The ext range is the hold archetype\'s (GA 3.1), a convention, not a card number.'),
  inhPlate: C(['CONSENSUS'], [SLS], 'c1; card inherit[4] plate.equipment (conventional_deadlift c23): unmapped, D-SHIP-W4-ROUTE'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec end = the floor start, spec start = standing tall). 'hips' (card zooms
// sumo-start and sumo-liftoff Wrong, c12 "hips shoot up while the bar stays on the floor"): the spec's Mistake pose
// merged over the end pose, as the engine draws it (card plate.mistake). No drawing value is added.
const END = plateSpec.poses.end, HIPS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  hips: { pose: { ...END, ...HIPS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// sumo-start (merged with sumo-liftoff, header). sumo-grip is text (above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre is on the right pose for both halves; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'sumo-start', chip: 'Start', heading: 'Start position', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [20, 10] }, sizePx: 210 },
    right: 'end',
    wrong: { base: 'end', pose: HIPS, solid: true },
    callout: {
      right: { text: 'Chest up', anchor: 'sternum' },
      wrong: { text: 'Hips shoot up', anchor: 'buttock' },
    },
    caption: {
      right: 'Chest up, trunk upright, bar on shins, back flat.',
      wrong: 'Hips shoot up while the bar stays on the floor.',
    },
    alt: {
      right: 'Side view, bar on the floor. Chest up, trunk upright, back flat, bar against the shins.',
      wrong: 'Side view. The bar is still on the floor. The hips have risen and the chest drops.',
    },
    feelRow: 'low-back-early',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (front thighs off the floor, c11; glutes and inner thighs, c8) have no fix, so they are
// left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'glutes', plain: 'The glutes work hard, most low in the lift.' },
    { muscleId: 'quads', plain: 'The front thighs work more than in a conventional pull.' },
  ],
  secondary: [
    { muscleId: 'hamstrings', plain: 'The hamstrings help, less than in a conventional pull.' },
    { muscleId: 'adductors', plain: 'The inner thighs help, most low in the lift.' },
    { muscleId: 'lower_back', plain: 'The lower back helps.' },
    { muscleId: 'upper_traps', plain: 'The traps help.' },
    { muscleId: 'forearms', plain: 'The forearms help.' },
  ],
  watch: [],   // card watch lower_back (c12) is also secondary; the row 'low-back-early' carries c12
  feelLine: 'You should feel this in your glutes, inner and front thighs, most off the floor.',
  rows: [
    { key: 'low-back-early', where: 'Lower back takes over early', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: 'Stay patient and keep driving with the legs.',
      zoom: 'sumo-start', claim: CL.c12 },
    { key: 'low-back', where: 'Lower back pain while lifting', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c22 (card source nhs-back-pain, the same NHS page)') },
  ],
  libraryDiff: { add: ['upper_traps', 'forearms'], why: 'StrengthLog lists the trapezius and forearm flexors as secondary movers (card c9).' },
  claim: C(['CONSENSUS', 'DATA'], [SLS, BB, 'escamilla2002', 'hanen2025'], 'c7, c8, c9, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'hips', title: 'Hips shooting up first', zoom: 'sumo-start', claim: CL.c12,
    fix: 'Be patient and keep driving with the legs.' },
  { key: 'rush', title: 'Rushing the setup', claim: CL.c17,
    fix: 'Set feet, grip and brace before each pull.' },
  { key: 'drift', title: 'Bar drifting off the shins', claim: CL.c13,
    fix: 'Chest up and keep the bar against the shins.' },
];
const RISKS = [
  { key: 'back', text: 'Sumo loads the lower back a little less, but heavier weight can offset that.',
    claim: C(['DATA', 'CONSENSUS'], ['cholewicki1991', BB], 'c5, c6') },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c19 },
  { key: 'hips', text: 'Hips rising first shifts the lift onto the back.', claim: CL.c12 },
];

export default {
  schema: 1,
  id: 'lib_sumo_deadlift',
  rev: 1,
  plate: plateSpec,   // draws the inherited bar on the floor with full-size plates (CL.inhPlate)
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: sumo-grip is a placement zoom (hands inside the knees), not a hand pose; its Right and Wrong are text checkpoints.',
    orientation: 'pronated',   // card grip.type: overhand (c3)
    handle: 'bar-28',          // the spec's 28 mm shaft
    width: { text: 'Narrower than conventional: hands closer together, arms inside the knees.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: CL.inhThumb },   // === the parent's handling.thumb.mode
    contact: 'mid-palm',       // === the parent's handling.contact (card inherit[1]): a drawing convention, not printed
    // === the parent's handling.wrist, leaf for leaf; the claim (left out of the compare) is this card's.
    wrist: { ext: [-10, 10], limitText: 'Keep the wrist neutral, in line with the forearm.', claim: CL.inhWrist },
    pose: { thumb: 'wrapped' },   // === the parent's handling.pose.thumb; no hand pose is drawn (no hand zoom)
    faults: [],                   // sumo-grip's Wrong is a placement fault, written in setup step 2
    gripLine: 'Overhand, thumbs wrapped, hands inside the knees.',   // sumo-grip Right (c3, inherit[0])
    cue: 'Arms inside knees, chest up.',   // c3, c13
  },
  contacts: ['standing-feet'],   // === the parent's contacts (card inherit[3])
  setup: [
    { kind: 'position', text: 'Wide stance, toes out, bar over mid-foot, shins vertical from the front.',
      claim: C(['CONSENSUS', 'DATA'], [SLS, BB, 'escamilla2000'], 'c1, c2') },
    { kind: 'grip', text: 'Arms inside the knees, not outside as in a conventional pull.', claim: CL.c3 },
    // W4 D-TEXT-PRINTED: c13 (chest up, bar on the shins) stays printed in the plate cue, the sumo-start caption and the
    // bar-drift fix; this slot carries posture c14 (lockout together) and c16 (lower with control).
    { kind: 'position', text: 'Lock knees and hips out together. Lower the bar with control.', claim: C(['CONSENSUS'], [BB, SLS], 'c14, c16') },
    { kind: 'brace', text: 'Build tension, then take a full breath into the belly.', claim: CL.c10 },
    { kind: 'load', text: 'Practise with light weight. Add load in small steps.', claim: CL.c18 },
  ],
  posture: [
    { key: 'trunk', label: 'Upright trunk', detail: 'Trunk more upright than in a conventional deadlift.',
      anchor: { landmark: 'sternum', pose: 'end' }, zoom: 'sumo-start', claim: CL.c4 },
    { key: 'back', label: 'Straight back', detail: 'Back straight from floor to lockout.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'sumo-start', claim: CL.c15 },
    { key: 'legs', label: 'Legs first', detail: 'Legs start the lift. Hips do not rise first.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'sumo-start', claim: CL.c11 },
    { key: 'bar', label: 'Bar on shins', detail: 'Bar close, against the shins.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'sumo-start', claim: CL.c13 },
    { key: 'lockout', label: 'Joint lockout', detail: 'Knees and hips lock out together.',
      anchor: { landmark: 'hip.r', pose: 'start' }, claim: CL.c14 },
    { key: 'lower', label: 'Controlled lowering', detail: 'Lower the bar with control.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c16 },
  ],
  feel,
  zooms,
  chips: ['sumo-start', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Wide stance, toes out, bar over mid-foot. Arms inside the knees.',
    mistakeLine: 'Never let your hips shoot up first. Keep driving with the legs.',
    cueLine: 'Chest up, bar on shins.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/sumo_deadlift.json', rev: 1 },
};
