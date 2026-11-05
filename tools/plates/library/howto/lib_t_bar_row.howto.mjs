// LIB-SHIP W4: the How-to content of lib_t_bar_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/t_bar_row.json; its claim ids are named on each field's claim.
// Inheriting child of lib_barbell_row (card parent barbell_row; W4 INHERIT_MAP lib_t_bar_row): posture[key=trunk]'s
// label, detail and anchor, handling.thumb.mode and risks[key=breath].text are the parent's leaves, copied verbatim;
// riskFlags too. Their claims are this card's own (c3, c19, c16; the map excludes claim subtrees). The trunk
// checkpoint links no zoom: this sheet's only zoom (tbar-back) shows a rounded back (c7), not a trunk-angle change.
// Its own grip (c6): neutral, palms facing on a V-handle. No handle profile: the V-handle's diameter is not on the card.
// No hand zoom (D-SHIP-HANDW4, no-zoom.json gap-ruled): the card's hand zoom `tbar-grip` (c19) has a thumb fault as its
// Wrong and no key draws one; the V-handle diameter is not on this card. Its Right (thumbs wrapped around the V-handle)
// is in the gripLine; its Wrong is handling.faults[thumbless].alt.
// GRIP: grip.handContact (base of the fingers) and the drawn palm direction are the card's drawing conventions (card
// notes), so `contact` is data only and never printed (D-SHIP-CONVCOPY). The wrist (c21) is the card's recorded
// convention (F-LB3-3); the ext range is the parent's pull convention (pairs.mjs CONVENTIONS ga:pull-base).
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// back-pain row's redFlag: 'back'. Tier-A way out: no read source says how to fail a stuck rep, so no way-out line.
// Variant line (equipment 'T-Bar / Machine'): the card's plate.variantLine, the chest-supported machine (c12).
import plateSpec from '../specs/t_bar_row.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ggr-t-bar': { cite: 'T-Bar Row: How To, Benefits, Muscles Worked (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/t-bar-row',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  'barbend-t-bar': { cite: 'How to Do the T-Bar Row (BarBend)', url: 'https://barbend.com/t-bar-row/',
    kind: 'coach', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults.', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'CONSENSUS' },
  // cite as docs/research/howto/sources.json already holds it (as lib_barbell_row)
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'DATA' },
  'baechle-grip': { cite: 'Grip selection and location. Excerpt from Baechle and Earle, Weight Training, 5th edition (Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-10-19', use: 'CONSENSUS' },
  odriscoll1992: { cite: 'The relationship between wrist position, grasp size, and grip strength.', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-19', use: 'MECH' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'
  // (card source nhs-back-pain, c18, c22).
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c15 (tempo, plate only); c17 and fenwick2009 (no slot left: the card's three risks are shown); c23, c24 and
// mh-uk-t-bar (the plate's end stop and straddle, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const GGR = 'ggr-t-bar', BB = 'barbend-t-bar';
const CL = {
  c1: C(['CONSENSUS'], [GGR], 'c1'),
  c2: C(['CONSENSUS'], [GGR], 'c2'),
  c3: C(['CONSENSUS'], [GGR], 'c3'),
  c4: C(['CONSENSUS'], [GGR], 'c4'),
  c7: C(['CONSENSUS'], [GGR], 'c7'),
  c8: C(['CONSENSUS'], [GGR], 'c8'),
  c9: C(['CONSENSUS'], [GGR], 'c9'),
  c10: C(['CONSENSUS'], [GGR], 'c10'),
  c11: C(['CONSENSUS'], [BB], 'c11'),
  c13: C(['CONSENSUS'], [GGR, 'acsm2009'], 'c13'),
  c16: C(['DATA'], ['macdougall1985'], 'c16'),
  c19: C(['CONSENSUS'], ['baechle-grip'], 'c19'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (handle at the lower chest, back straight, chest level; c3, c4) and the
// spec's Mistake pose merged over the end pose, as the engine draws it (the back rounds over the bar; card
// plate.mistake, c7). The card zoom tbar-back's Wrong is that drawn fault (M), so no new pose is made.
const ROUND = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  round: { pose: { ...plateSpec.poses.end, ...ROUND } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `tbar-grip` (D-SHIP-HANDW4, above). Zoom shell form (render/closeup/crop.mjs):
// the crop centre on the right pose's mid-back for both halves; the Wrong is the Mistake pose drawn alone (solid).
const zooms = [
  {
    key: 'tbar-back', chip: 'Back', heading: 'Back line', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: ROUND, solid: true },
    callout: {
      right: { text: 'Back straight', anchor: 'backMid' },
      wrong: { text: 'Back rounds', anchor: { at: 'lumbar', pose: 'mistake' } },   // c7 (the spec's tell)
    },
    caption: {
      right: 'Back straight, chest level with the floor, soft knees.',   // c3, c2
      wrong: 'Back rounded over the bar.',                                 // c7
    },
    alt: {
      right: 'Side view, top of the row. Hinged, knees soft, the back straight and the chest level with the floor.',
      wrong: 'Side view. The back rounds forward over the bar and the hips tuck under.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's first two rows (middle and sides of the back, c10; the lower back working hard, c11) have no fix, so
// they are left off the rows (D-SHIP-Q16); the feel line says them.
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats are main movers.' },
    { muscleId: 'mid_back', plain: 'The rhomboids do most of the work with them.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
    { muscleId: 'rear_delts', plain: 'The rear delts help pull.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'Without a chest pad, the lower back works hard.' },
  ],
  feelLine: 'You should feel this in the middle and sides of your back. Your lower back works hard too.',
  rows: [
    { key: 'low-back', where: 'Pain in your back while rowing', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-MEANS-CAUSAL: the card's row gives no cause at its strength; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      zoom: 'tbar-back', redFlag: 'back', claim: C(['CONSENSUS', 'MECH'], ['nhs-back'], 'c22') },
  ],
  libraryDiff: { add: ['lower_back'], why: 'The erector spinae is named a main mover (card c10); the lower back works much harder without a chest pad (c11).' },
  claim: C(['CONSENSUS'], [GGR, BB], 'c10, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'round', title: 'Rounding the back', zoom: 'tbar-back', claim: CL.c7,
    fix: 'Brace and use a lighter load.' },
  { key: 'swing', title: 'Swinging the weight up', claim: CL.c8,
    fix: 'Hold the squeeze at the top of each rep.' },
  { key: 'short', title: 'Stopping halfway down', claim: CL.c9,
    fix: 'Lower all the way each rep.' },
];
const RISKS = [
  { key: 'round', text: 'A rounded back strains the lower back and raises the chance of injury.', claim: CL.c7 },
  { key: 'pad', text: 'Without a chest pad the lower back works much harder.', claim: CL.c11 },
  { key: 'breath', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c16 },   // === parent
];

export default {
  schema: 1,
  id: 'lib_t_bar_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: tbar-grip: the Wrong is a thumb fault and no key draws one; the V-handle diameter is not on this card. The grip copy carries c6, c19 and c20.',
    orientation: 'neutral',    // card grip.type: palms facing each other on a V-handle (c6)
    width: { text: 'Close: set by the V-handle.', claim: C(['CONSENSUS'], [GGR], 'c1, c6') },
    thumb: { mode: 'wrapped', claim: CL.c19 },   // mode === parent; card grip.thumb (c19)
    contact: 'finger-base',    // card grip.handContact: the pull archetype's drawing convention (card notes); data only, not printed
    // card grip.wrist: "not curled forward" (c21); the drawn wrist is the card's recorded convention (F-LB3-3). The range
    // is the pull archetype's recorded convention (pairs.mjs CONVENTIONS 'ga:pull-base': extension 0 to 25), as the
    // parent, not a card number.
    wrist: { ext: [0, 25], limitText: 'Keep the wrists from curling forward.',
      claim: C(['DATA', 'MECH'], ['odriscoll1992'], 'c21, card grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [
      // card zoom tbar-grip Wrong (c19). Not drawn (no hand zoom), so no pose or marker is set; one label per key.
      { key: 'thumbless', label: 'Thumb not wrapped', pose: {}, markers: [], alt: 'Thumbs alongside the handle, not wrapped.' },
    ],
    // c6 palms facing, c19 thumbs (card zoom tbar-grip Right), c20 straps.
    gripLine: 'Palms facing, thumbs wrapped around the V-handle. Straps are fine on heavy sets.',
    cue: 'Palms facing, thumbs wrapped.',   // c6, c19
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'get-in', text: 'Barbell in a landmine, plates on the free end.', claim: CL.c1 },
    { kind: 'adjust', text: 'Hook a V-handle under the bar about 8-10 inches from the plates.', claim: CL.c1 },
    { kind: 'position', text: 'Stand over the bar, feet about shoulder width, knees slightly bent.', claim: CL.c2 },
    { kind: 'grip', text: 'Hinge, chest level with the floor. Grab the handle, palms facing.', zoom: 'tbar-back',
      claim: C(['CONSENSUS'], [GGR], 'c3, c6') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    { key: 'back', label: 'Chest parallel', detail: 'Brace. Back straight, chest parallel to the floor.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'tbar-back', claim: CL.c3 },
    // label, detail and anchor === parent (INHERIT_MAP posture[trunk angle stays the same]); claim this card's c3.
    { key: 'trunk', label: 'Trunk still', detail: 'Trunk angle stays the same while the bar moves.',
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.c3 },
    { key: 'blades', label: 'Shoulder blades', detail: 'Shoulder blades pull back as the elbows drive back.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c4 },
    { key: 'lower', label: 'Full range', detail: 'Lower all the way, slowly.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: C(['CONSENSUS'], [GGR], 'c9, c5') },
    // D-TEXT-GOLDEN: posture 'Knees slightly bent' (c2) is setup step 3 and the plate's Soft knees cue; 'Hold the
    // squeeze at the top. No swinging.' (c8) is the swing mistake's title and fix.
  ],
  feel,
  zooms,
  chips: ['tbar-back', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hinge with the chest level and knees soft. Pull the handle to your lower chest.',
    mistakeLine: "Don't round your back. Brace and use a lighter load.",
    cueLine: 'Elbows back, chest level.',
    // D-LIB5-VARIANT: card plate.variantLine, the chest-supported T-bar machine (c12).
    variantLine: "On the chest-supported machine, sternum at the pad's end.",
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // === parent; the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/t_bar_row.json', rev: 1 },
};
