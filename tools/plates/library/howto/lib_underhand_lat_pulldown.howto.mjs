// LIB-SHIP W3: the How-to content of lib_underhand_lat_pulldown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/underhand_lat_pulldown.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand` is drawn by the approved `bar` key
// (tools/plates/library/hands/hand-bar.mjs:39 IDS.underhand_lat_pulldown: variant 'pulldown', orientation 'under',
// faults ['curled']; the variant is radial-rules.mjs:45-56 pullVariant with the 28 mm pulldown bar, hand-bar.mjs:10, :30).
// The key module is not imported (MANIFEST closure, W2 form): its record is copied below as literals. The card's
// grip.handContact is an LR-4 drawing convention, so the contact is the key's 'ga:pull-base' (hands/pairs.mjs
// CONVENTIONS), cited CONVENTION (source hand-key-bar), never DATA.
// Inherited (D-LIB9a-MAP as amended by Q-W3-2, #383 6630932862): posture[key=path] label, detail and anchor equal
// lat_pulldown's (lat_pulldown.howto.mjs:204-205), with no zoom link (this card has no path zoom); zooms[key=pad] is
// lat_pulldown's pad zoom leaf for leaf (:273-293), world points copied as numbers; Q-W3-3: cropped on this row's own
// plate, anchor px offsets measured at the layers page.
// Red flags: the card's redFlags (shoulder): golden B's shared shoulder block, linked by the shoulder feel row.
// Variant line (D-LIB5-VARIANT): equipment 'Cable / Machine'; the card's plate.variantLine draws the pulldown station.
import plateSpec from '../specs/underhand_lat_pulldown.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-lat-pulldown': { cite: 'Seated Lat Pulldown (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'MECH' },
  'barbend-reverse-grip-lat-pulldown': { cite: 'How to Do the Reverse-Grip Lat Pulldown for Stronger Back and Biceps (BarBend)', url: 'https://barbend.com/reverse-grip-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'buonsenso-2025': { cite: 'Electromyographic Analysis of Back Muscle Activation During Lat Pulldown Exercise: Effects of Grip Variations and Forearm Orientation (Buonsenso et al., J Funct Morphol Kinesiol)', url: 'https://pubmed.ncbi.nlm.nih.gov/40981044/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'lusk-2010': { cite: 'Grip width and forearm orientation effects on muscle activity during the lat pull-down (Lusk, Hale, Russell, J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/20543740/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'odriscoll-1992': { cite: 'The relationship between wrist position, grasp size, and grip strength (O\'Driscoll et al., J Hand Surg Am)', url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'puregym-reverse-grip-lat-pulldown': { cite: 'Reverse Grip Lat Pulldown (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/back/lat-exercises/reverse-grip-lat-pulldown/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // The bar key's own source for the hand contact (the card's grip.handContact is a drawing convention).
  'hand-key-bar': { cite: 'LIB-7c hand pair key bar (pulldown), CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/hand-bar.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // lat_pulldown's front-bar-path sources, for the inherited checkpoint 'Bar in front' (card inherit[0]; the parent's
  // claim, lat_pulldown.howto.mjs:205). Cites as golden B's lat_pulldown holds them.
  sperandei2009: { cite: 'Sperandei S et al. (2009) Electromyographic analysis of three different types of lat pull-down. J Strength Cond Res 23(7):2033-8', url: 'https://pubmed.ncbi.nlm.nih.gov/19855327/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  padovan2024: { cite: 'Padovan R et al. (2024) High-density electromyography excitation in front vs. back lat pull-down prime movers. J Hum Kinet 91:47-60', url: 'https://pubmed.ncbi.nlm.nih.gov/38689585/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2013: { cite: 'Kolber MJ, Corrao M, Hanney WJ (2013) Characteristics of anterior shoulder instability and hyperlaxity in the weight-training population. J Strength Cond Res 27(5):1333-9', url: 'https://pubmed.ncbi.nlm.nih.gov/22836608/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  // this card's own source (c14); also one of the parent's front-path sources
  'signorile-2002': { cite: 'A comparative electromyographical investigation of muscle utilization patterns using various hand positions during the lat pull-down (Signorile, Zink, Szwed, J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/12423182/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 (tempo, plate only), c14, c19 (no field restates them; signorile-2002 is cited for the inherited path).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const PG = 'puregym-reverse-grip-lat-pulldown', BB = 'barbend-reverse-grip-lat-pulldown', ACE = 'ace-lat-pulldown', KEYSRC = 'hand-key-bar';
const CL = {
  c1: C(['CONSENSUS'], [PG], 'c1'),
  c2: C(['CONSENSUS'], [BB], 'c2'),
  c4: C(['CONSENSUS'], [PG], 'c4'),
  c5: C(['MECH'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [PG], 'c6'),
  c7: C(['CONSENSUS'], [PG], 'c7'),
  c9: C(['CONSENSUS'], [PG, BB], 'c9'),
  c10: C(['MECH'], [ACE], 'c10'),
  c11: C(['MECH'], [ACE], 'c11'),
  c18: C(['MECH'], ['odriscoll-1992'], 'c18'),
  far: C(['CONSENSUS'], [PG], 'c8, c6'),
  pathC6: C(['CONSENSUS', 'DATA', 'WEAK'], [PG, 'sperandei2009', 'signorile-2002', 'padovan2024', 'kolber2013'], 'c6 (stop just below the chin); card inherit[0]: in front of the face, never behind the head'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied as literals (hand-bar.mjs:39, radial-rules.mjs:45-56).
const KEYED = { variant: 'pulldown', orientation: 'under', faults: ['curled'] };   // IDS.underhand_lat_pulldown
const V = {                                                                         // VARIANTS.pulldown
  contact: 'base', rightNote: 'Base of fingers', wristRange: [0, 25],
  right: { view: 'radial', forearm: 180, wrist: { ext: 5, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
  alt: 'Handle across the base of the fingers, thumb wrapped, back of the hand in line with the forearm.',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only; dev is the right pose's own value (0), for the type.
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'base' (ga:pull-base) is the HandContact 'finger-base'.
const CONTACT = { base: 'finger-base' }[V.contact];

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. The card zoom `torso` Wrong ("torso thrown back well past 30 degrees") is not the
// plate's drawn fault (the plate's Mistake is the past-the-chin pull, c8), so its pose is a drawing value:
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// end pose with the root tipped back to tilt -40 (the plate's own end lean is -8); the card says only "well past 30
// degrees", so the size is a drawing value, never a number in user copy; the layers panel judges it.
const END = plateSpec.poses.end;
const THROWN = { root: { at: END.root.at, tilt: -40 } };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  thrown: { pose: { ...END, ...THROWN } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand position', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // the key's camera for 'under' (hands/pairs.mjs ORIENTATIONS)
      // CONVENTION (D-SHIP-GRIP (a)): 'Base of fingers' is the key's rightNote (words/bar-pulldown-under.json)
      notes: { right: V.rightNote, wrong: FAULTS[0].label },
    },
    caption: {
      right: 'Palms facing you, wrists not curled.',
      wrong: 'Wrists curled forward.',
    },
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the key's ga:pull-base, source hand-key-bar.
    alt: { right: 'Bar across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'torso', chip: 'Torso', heading: 'Torso lean', kind: 'posture',   // card zoom key: torso
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: THROWN },
    callout: {
      right: { text: 'Slight lean', anchor: 'backMid' },
      wrong: { text: 'Thrown back', anchor: { at: 'backUpper', pose: 'mistake' } },
    },
    caption: {
      right: 'Slight fixed lean, bar just below the chin.',
      wrong: 'Torso thrown far back to drive the bar down.',
    },
    alt: {
      right: 'Side view, seated. The torso leans back slightly and holds still. The bar is just below the chin.',
      wrong: 'Side view. The torso is thrown far back to drive the bar down. Drawn dashed over the right position.',
    },
  },
  // D-LIB9a-MAP inherit: lat_pulldown's pad zoom, leaf for leaf (lat_pulldown.howto.mjs:273-293). The two world points
  // are lat_pulldown's own numbers (its HIPS_UP root and PAD_GAP), written out so the family check sees equal leaves.
  {
    key: 'pad', chip: 'Knee pad', heading: 'Knee pad: right and wrong', kind: 'posture',
    crop: { center: { at: 'thighTop.r', off: [-8, 12] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: { root: { at: [0, 0.5772146132970393, 0.027283355026593428] } }, parts: ['trunk', 'leg.r', 'leg.l'], equipment: { kneePad: { dy: 0.06 } } },
    guides: [{ kind: 'drop', from: { at: 'seat', off: [14, 0] }, to: { at: 'seat', pose: 'mistake', off: [14, 0] } }],
    callout: {
      right: { text: 'Pad<br>on thighs', anchor: { at: 'thighTop.r', off: [0, -1] } },
      wrong: { text: 'Pad<br>too high', anchor: { at: [0, 0.5647817206547646, 0.38121249356203657], off: [0, 1] }, prefer: 'right' },
    },
    caption: { right: 'Pad firm on the thighs, hips down.',
      wrong: 'Pad too high, hips lifting.' },
    alt: {
      right: 'Side view of the thighs, knee pad and seat. The pad presses on the tops of the thighs, just above the knees. Feet flat, hips down on the seat.',
      wrong: 'The pad set too high, with a gap above the thighs. The hips lift off the seat as the bar comes down. Drawn dashed over the right position.',
    },
    // Q-W3-8 (#383 6631278086): feelRow and feelPrompt are not compared; this card dropped the low-back row, so no feel link.
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
// The card's 'Front of the upper arms' row has fix "Nothing to fix." (no fix verb): left off the rows (D-SHIP-Q16);
// its claim (c13, c16) is kept in the feel line.
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats do most of the work.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
    { muscleId: 'mid_back', plain: 'The middle-back muscles help pull.' },
    { muscleId: 'rear_delts', plain: 'The rear delts help a little.' },
  ],
  watch: [
    { muscleId: 'forearms', plain: 'The forearms take over if you pull too far.' },
  ],
  feelLine: 'You should feel this in your lats. Lab tests found no extra biceps work from this grip.',
  rows: [
    { key: 'forearms', where: 'Forearms more than your back', at: { muscles: ['forearms'] },
      means: 'Usually means you are pulling the bar too low.',
      fix: 'Stop just below the chin.',
      claim: CL.far },
    { key: 'shoulder', where: 'Shoulders', at: { muscles: ['front_delts'] },
      means: 'Usually means the grip is too wide, or you pull too far.',
      fix: 'Bring the hands in to shoulder width. Stop when the elbows stop moving down.',
      redFlag: 'shoulder', claim: C(['CONSENSUS', 'WEAK', 'MECH'], [BB, ACE, PG], 'c3, c11, c1') },
  ],
  libraryDiff: { add: ['rear_delts'], why: 'Listed by the coach source (card c17); the EMG is only relative (c14).' },
  claim: C(['DATA', 'CONSENSUS', 'WEAK'], ['buonsenso-2025', 'lusk-2010', PG, BB], 'c15, c13, c16, c17'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'far', title: 'Pulling too far', claim: CL.far,
    fix: 'Stop when the bar passes just below your chin.' },
  { key: 'rock', title: 'Rocking the torso', zoom: 'torso', claim: CL.c7,
    fix: 'Keep the torso still.' },
  { key: 'fly', title: 'Bar flying back up', claim: CL.c9,
    fix: "Control it all the way up. Can't? Go lighter." },
];
const RISKS = [
  { key: 'shoulder', text: 'Pulling past where the elbows stop moving down stresses the shoulder.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_underhand_lat_pulldown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    orientation: 'supinated',  // c1: palms facing you
    handle: 'bar-28',          // the key's 28 mm pulldown bar
    loadAxis: 'across',        // the key's pull variant
    width: { text: 'About shoulder width, or a little closer.', claim: C(['CONSENSUS', 'WEAK'], [PG, BB], 'c1, c2, c3') },
    thumb: { mode: 'wrapped', claim: CL.c2 },
    contact: CONTACT,          // CONVENTION (D-SHIP-GRIP (a)): the key's ga:pull-base, source hand-key-bar
    // card grip.wrist "Not curled forward" (c18). The range is the key's pull-variant range (wristRange [0, 25],
    // ga:pull-base), a convention, not a card number.
    wrist: { ext: V.wristRange, limitText: 'Keep the wrists from curling forward.',
      claim: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c18; the ext range is the key\'s ga:pull-base convention, not a card number') },
    faults: FAULTS,
    gripLine: 'Underhand, palms facing you. Thumbs wrapped or thumbless, either is fine.',   // c1, c2
    cue: 'Palms facing you, wrists straight.',   // c1, c18
  },
  contacts: ['seat-back', 'brace-pad'],
  setup: [
    { kind: 'adjust', text: 'Sit and set the pads tight against your thighs.', zoom: 'pad', claim: CL.c4 },
    { kind: 'grip', text: 'Stand, take the bar underhand about shoulder width, then sit.', zoom: 'hand', claim: CL.c1 },
    { kind: 'position', text: 'Lean back slightly, no more than about 30 degrees.', zoom: 'torso', claim: CL.c5 },
    { kind: 'brace', text: 'Draw your shoulder blades down to start the pull.', claim: CL.c10 },
    { kind: 'load', text: "Can't control the bar on the way up? Go lighter.", claim: CL.c9 },
  ],
  posture: [
    { key: 'thighs', label: 'Thighs pinned', detail: 'Thighs pinned under the pads all set.',
      anchor: { landmark: 'thighTop.r', pose: 'end' }, zoom: 'pad', claim: CL.c4 },
    { key: 'lean', label: 'Torso still', detail: 'Torso stable. The lean does not change.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'torso', claim: CL.c7 },
    // D-LIB9a-MAP inherit (Q-W3-2): label, detail and anchor equal lat_pulldown's; no zoom link.
    // Q-W3-9 (#383 6631278086): label and anchor inherited; the detail is this card's c6 (stop just below the chin)
    // plus the inherited 'never behind the head' (card inherit[0]).
    { key: 'path', label: 'Bar in front', detail: 'The bar comes down in front of your face and stops just below your chin. Never behind the head.',
      anchor: { at: 'chin' }, claim: CL.pathC6 },
    { key: 'elbows', label: 'Elbows down', detail: 'Elbows down and back toward the glutes.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c6 },
    { key: 'stop', label: 'Stop point', detail: 'Stop just below the chin, when the elbows stop moving down.',
      anchor: { landmark: 'chin', pose: 'end' }, claim: CL.c11 },
  ],
  feel,
  zooms,
  chips: ['hand', 'torso', 'pad', 'feel'],
  copy: {
    setupLine: 'Pin your thighs under the pads. Lean back slightly and keep that lean.',
    mistakeLine: "Don't pull the bar past your chin. Stop when your elbows stop moving down.",
    cueLine: 'Palms facing you, bar to chin.',
    // card plate.variantLine: drawn on the pulldown station; no line is claimed for a cable machine with a bar (c19)
    variantLine: 'Drawn on a lat pulldown machine with a long bar.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/underhand_lat_pulldown.json', rev: 1 },
};
