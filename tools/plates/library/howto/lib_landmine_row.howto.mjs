// LIB-SHIP W4: the How-to content of lib_landmine_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/landmine_row.json; its claim ids are named on each field's claim.
// Inheriting child of lib_barbell_row (card parent barbell_row; W4 INHERIT_MAP lib_landmine_row): handling.orientation,
// handling.thumb.mode, posture[key=back] (the whole entry) and risks[key=breath].text are the parent's leaves, copied
// verbatim; riskFlags too. Their claims are this card's own (c4, c17, c9, c14; the map excludes claim subtrees).
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `landmine-grip` (c17) has a thumb fault as
// its Wrong and no key draws one; the bar diameter where the hands sit is not on the card. Its Right (thumbs wrapped)
// is in the gripLine; its Wrong is handling.faults[thumbless].alt. No handle profile (no diameter on the card).
// GRIP: grip.handContact (base of the fingers) and the drawn palm direction are the card's drawing conventions (card
// notes), so `contact` is data only and never printed (D-SHIP-CONVCOPY). The wrist (c18) is the card's recorded
// convention (F-LB3-3); the ext range is the parent's pull convention (pairs.mjs CONVENTIONS ga:pull-base).
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// back-pain row's redFlag: 'back'. Tier-A way out: no read source says how to fail a stuck rep, so no way-out line.
// No variant line (equipment 'Landmine').
import plateSpec from '../specs/landmine_row.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'rep-landmine-row': { cite: 'How to do a Landmine Row: Technique, Variations, and Benefits (REP Fitness)', url: 'https://repfitness.com/blogs/training/how-to-do-a-landmine-row-technique-variations-and-benefits',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'cissik-landmine': { cite: 'Landmine Bent Over Rows (Improving Athletic Performance blog, John Cissik)', url: 'https://www.cissik.com/blog/?p=7015',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'ggr-t-bar': { cite: 'T-Bar Row: How To, Benefits, Muscles Worked (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/t-bar-row',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  // cite as docs/research/howto/sources.json already holds it (as lib_barbell_row)
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  fenwick2009: { cite: 'Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness.', url: 'https://pubmed.ncbi.nlm.nih.gov/19620925/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'WEAK' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  odriscoll1992: { cite: 'The relationship between wrist position, grasp size, and grip strength.', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'MECH' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'
  // (card source nhs-back-pain, c16, c19).
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (tempo, plate only); c20 and mh-uk-t-bar (the plate's end stop, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const REP = 'rep-landmine-row', CIS = 'cissik-landmine';
const CL = {
  c1: C(['CONSENSUS'], [REP], 'c1'),
  c2: C(['CONSENSUS'], [REP, CIS], 'c2'),
  c3: C(['CONSENSUS'], [REP, CIS], 'c3'),
  c4: C(['CONSENSUS'], [REP, CIS], 'c4'),
  c5: C(['CONSENSUS'], [REP], 'c5'),
  c6: C(['CONSENSUS'], [REP], 'c6'),
  c7: C(['CONSENSUS'], [REP], 'c7'),
  c8: C(['CONSENSUS'], [REP], 'c8'),
  c9: C(['CONSENSUS'], [REP], 'c9'),
  c13: C(['CONSENSUS'], ['acsm2009', REP], 'c13'),
  c14: C(['DATA'], ['macdougall1985'], 'c14'),
  c15: C(['MECH', 'WEAK'], ['fenwick2009'], 'c15 (inferred: measured on the standing bent-over row)'),
  c17: C(['CONSENSUS'], ['baechle-grip'], 'c17'),
  round: C(['CONSENSUS', 'WEAK'], ['ggr-t-bar', REP], 'c11, c5'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (bar end at the chest, back straight, torso level; c3, c6) and the spec's
// Mistake pose merged over the end pose, as the engine draws it (the lower back rounded over the bar; card
// plate.mistake, c9, c11). The card zoom landmine-back's Wrong is that drawn fault (M), so no new pose is made.
const ROUND = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  round: { pose: { ...plateSpec.poses.end, ...ROUND } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `landmine-grip` (D-SHIP-HANDW4, above). Zoom shell form
// (render/closeup/crop.mjs): the crop centre on the right pose's mid-back for both halves; the Wrong is the Mistake pose
// drawn alone (solid).
const zooms = [
  {
    key: 'landmine-back', chip: 'Back', heading: 'Back line', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Back straight', anchor: 'backMid' },
      wrong: { text: 'Lower back rounds', anchor: { at: 'lumbar', pose: 'mistake' } },   // c9, c11 (the spec's tell)
    },
    caption: {
      right: 'Back straight, torso level, braced.',          // c3, c9, c5
      wrong: 'Lower back rounded over the bar.',             // c9, c11
    },
    alt: {
      right: 'Side view, top of the row. Hinged with the torso level and the back straight. The bar end is at the chest.',
      wrong: 'Side view. The lower back rounds and the hips tuck under, the back curled over the bar.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first row (between and around the shoulder blades, c10) has no fix, so it is left off the rows
// (D-SHIP-Q16); the feel line says it.
const feel = {
  primary: [
    { muscleId: 'mid_back', plain: 'The traps and rhomboids do most of the work.' },
    { muscleId: 'lats', plain: 'The lats are main movers too.' },
  ],
  secondary: [
    { muscleId: 'rear_delts', plain: 'The rear delts help pull.' },
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back holds the bent-over position.' },   // c15 (inferred)
  ],
  feelLine: 'You should feel this between and around your shoulder blades.',
  rows: [
    { key: 'low-back', where: 'Lower back rounding or straining', at: { muscles: ['lower_back'] },
      means: 'Your lower back is rounding under the load.',
      fix: 'Brace first and use a lighter load.',
      zoom: 'landmine-back', claim: CL.round },
    { key: 'back-pain', where: 'Pain in your back while rowing', at: { muscles: ['lower_back'] },
      means: 'Is it getting worse?',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c19') },
  ],
  libraryDiff: { add: ['rear_delts'], why: 'The rear delts are named as a secondary muscle (card c10).' },
  claim: C(['CONSENSUS', 'MECH', 'WEAK'], [REP, 'fenwick2009'], 'c10, c15'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'round', title: 'Rounding the lower back', zoom: 'landmine-back', claim: CL.round,
    fix: 'Brace before each rep and use a lighter load.' },
  { key: 'jerk', title: 'Jerking it up', claim: CL.c7,
    fix: 'Pull with control, no momentum.' },
  { key: 'short', title: 'Stopping short at the bottom', claim: CL.c8,
    fix: 'Lower until the arms are straight.' },
];
const RISKS = [
  { key: 'round', text: 'A rounded back strains the lower back and raises the chance of injury.', claim: C(['CONSENSUS', 'WEAK'], ['ggr-t-bar'], 'c11') },
  { key: 'spine', text: 'Of the rows tested, the bent-over row loaded the lower spine most.', claim: CL.c15 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c14 },   // === parent
];

export default {
  schema: 1,
  id: 'lib_landmine_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: landmine-grip: the Wrong is a thumb fault and no key draws one; the bar diameter where the hands sit is not on the card. The grip copy carries c4 and c17.',
    orientation: 'pronated',   // === parent; card grip.type: overhand (c4)
    width: { text: 'Close: one hand above the other, just below the plates.', claim: CL.c4 },
    thumb: { mode: 'wrapped', claim: CL.c17 },   // mode === parent; card grip.thumb (c17)
    contact: 'finger-base',    // card grip.handContact: the pull archetype's drawing convention (card notes); data only, not printed
    // card grip.wrist: "not curled forward" (c18); the drawn wrist is the card's recorded convention (F-LB3-3). The range
    // is the pull archetype's recorded convention (pairs.mjs CONVENTIONS 'ga:pull-base': extension 0 to 25), as the
    // parent, not a card number.
    wrist: { ext: [0, 25], limitText: 'Keep the wrists from curling forward.',
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c18, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [
      // card zoom landmine-grip Wrong (c17). Not drawn (no hand zoom), so no pose or marker is set; one label per key.
      { key: 'thumbless', label: 'Thumb not wrapped', pose: {}, markers: [], alt: 'Thumbs alongside the bar, not wrapped.' },
    ],
    // c4 overhand, one hand above the other; c17 thumbs (card zoom landmine-grip Right).
    gripLine: 'Overhand, one hand above the other. Thumbs wrapped around the bar.',
    cue: 'Overhand, thumbs wrapped.',   // c4, c17
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'get-in', text: 'Anchor a barbell end in a landmine. Load the free end.', claim: CL.c1 },
    { kind: 'position', text: 'Straddle the loaded end, feet between hip and shoulder width.', claim: CL.c2 },
    { kind: 'position', text: 'Hinge until the torso is roughly level with the floor, back straight.', zoom: 'landmine-back', claim: CL.c3 },
    { kind: 'grip', text: 'Both hands overhand below the plates, one above the other.', claim: CL.c4 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    // === parent's whole entry (INHERIT_MAP posture[back neutral]); the claim is this card's c9.
    { key: 'back', label: 'Flat back', detail: 'Back neutral the whole set, not rounded or arched.',
      anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.c9 },
    { key: 'torso', label: 'Torso level', detail: 'Torso stays roughly parallel to the floor.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'landmine-back', claim: CL.c3 },
    // D-TEXT-GOLDEN: posture 'Brace before each pull' (c5) is the plate's Brace first cue and the round mistake's fix.
    { key: 'blades', label: 'Shoulder blades', detail: 'Shoulder blades squeeze together at the top.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['landmine-back', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Straddle the loaded end and hinge, back straight. Pull the bar end to your chest.',
    mistakeLine: "Don't round your lower back. Brace before each rep and use a lighter load.",
    cueLine: 'Elbows back, back straight.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // === parent; the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/landmine_row.json', rev: 1 },
};
