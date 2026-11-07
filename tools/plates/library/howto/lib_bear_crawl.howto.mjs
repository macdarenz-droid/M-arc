// LIB-SHIP W7: the How-to content of lib_bear_crawl (golden B's HowToContent shape, as lib_push_up). Every shown string
// restates a claim of the verified card docs/research/howto/cards/bear_crawl.json (cited in its field's claim, cN = card
// claim id).
// Hand (D-SHIP-GRIP case (a), push_up's form): archetype 'palm-flat', the values copied from the approved palm-flat key
// (tools/plates/library/hands/hand-palm-flat.mjs IDS.bear_crawl: variant 'floor', orientation 'over') with each value's
// key line, cited CONVENTION (source hand-key-palm-flat), never printed. The card's own claims are the cited fields:
// width c1, c3 and the wrist c11 (bent back under body weight), over the key's null wrist range.
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-HANDW7, gap-ruled; tools/plates/library/hands/no-zoom.json): the key's
// faults (cupped-palm, hand-ahead) cite no claim of this card and the card's hand zoom `hand-under-shoulder` has no Wrong
// (LR-25), so handling.faults is empty (as lib_mountain_climbers keeps only the card's faults) and the zoom's Right is in
// gripLine.
// Feel (D-SHIP-Q7, as lib_plank): the card's primaries abs and obliques (c9) are drawn; `core` is text only.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c3 hands under shoulders, knees under hips -> posture 'hands', setup 1
//   posture c8 knees hover                             -> posture 'knees' (c3, c8, the plate label), setup 2 (c3)
//   posture c4, c7 back flat, not arched               -> posture 'back', mistakes[1]
//   posture c2 hips at shoulder height                 -> posture 'hips', zoom hip-line, setup 4
//   handlingMistake hips rise (c5)                     -> mistakes[0] (zoom hip-line, the plate's Mistake)
//   handlingMistake back arches (c7)                   -> mistakes[1]
//   handlingMistake hips sway (c6)                     -> mistakes[2]
//   hand zoom hand-under-shoulder Right (c3)           -> handling.gripLine; Wrong null (LR-25), nothing to show
//   T checkpoints                                      -> none on this card
// D-TEXT-PROGRESSION: c10 (build up from 15 to 30 seconds) is a progression, not on the sheet.
import plateSpec from '../specs/bear_crawl.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-bearcrawl': { cite: 'Bear Crawl (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/150/bear-crawl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ace-bc-shape': { cite: 'How to Do the Bear Crawl Exercise to Boost Strength and Coordination (SHAPE, reprinted by ACE)', url: 'https://www.acefitness.org/about-ace/press-room/in-the-news/8226/how-to-do-the-bear-crawl-exercise-to-boost-strength-and-coordination-shape/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-bc': { cite: 'Build an Unstoppable Core and Upper Body with the Bear Crawl (BarBend)', url: 'https://barbend.com/bear-crawl/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nance-2017': { cite: 'Dorsal Wrist Pain in the Extended Wrist-Loading Position: An MRI Study (2017)', url: 'https://pubmed.ncbi.nlm.nih.gov/29085728/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'MECH' },
  // The palm-flat key's own source for the thumb and the hand contact (the card has neither): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-bearcrawl', SH = 'ace-bc-shape', BB = 'bb-bc';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'card c1'),
  c2: C(['CONSENSUS'], [ACE], 'card c2'),
  c3: C(['CONSENSUS'], [SH], 'card c3'),
  c5: C(['CONSENSUS'], [BB], 'card c5'),
  c6: C(['CONSENSUS'], [BB], 'card c6'),
  c7: C(['CONSENSUS'], [BB], 'card c7'),
  c8: C(['CONSENSUS'], [BB], 'card c8'),
  c9: C(['CONSENSUS'], [BB, SH], 'card c9'),
  c11: C(['MECH', 'WEAK'], [SH, 'nance-2017'], 'card c11'),
  c12: C(['CONSENSUS'], [SH], 'card c12'),
  step: C(['CONSENSUS'], [ACE, SH], 'card c2, c4'),
  back: C(['CONSENSUS'], [SH, BB], 'card c4, c7'),
  width: C(['CONSENSUS'], [ACE, SH], 'card c1, c3'),
  knees: C(['CONSENSUS'], [SH, BB], 'card c3, c8'),   // the plate checkpoint 'Knees hover' (c3 about 2 inches, c8 never touching)
  mArch: C(['CONSENSUS'], [BB], 'card c7: the fault and its fix (tighten the core)'),
  mSway: C(['CONSENSUS'], [BB], 'card c6: the fault and its fix (shorten the steps)'),
  wristRow: C(['MECH', 'WEAK'], [SH, 'nance-2017'], 'card c11 (the means); the fix only points to the wrist box (card fixNote), no claim'),
  conv: C(['CONVENTION'], ['hand-key-palm-flat'], 'the palm-flat key\'s drawing (the card has no grip.thumb or grip.handContact)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs IDS.bear_crawl, VARIANTS.floor; not
// importable: view-common.mjs reads files at run time, refused by the library closure, as lib_push_up explains).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm', contact: 'whole-hand' };   // VARIANTS.floor.archetype, .loadAxis, .contact
const THUMB = 'beside';   // CONVENTION: the key's drawn thumb on the floor beside the index (view-palm-flat.mjs:52), source hand-key-palm-flat
const CONTACT_OF_KEY = { 'whole-hand': 'palm-flat' };   // the key's contact word as the HandContact enum (lib_mountain_climbers)
const CONTACT = CONTACT_OF_KEY[V.contact];
if (!CONTACT) throw new Error(`lib_bear_crawl: unmapped key contact ${V.contact}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (one hand and the opposite foot a small step forward, hips level, c2, c4)
// and the spec's Mistake merged over it, as the engine draws it (card plate.mistake c5, c2, c8: the hips rise above
// the line of the back). The card zoom hip-line Wrong is the plate's drawn fault. No drawing value is added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  hips: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    // zoom shell: crop centre on the right pose's hip for both halves, shoulders to knees; the Wrong is the spec's
    // Mistake drawn alone (solid).
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Hips level', anchor: 'hip.r' },
      wrong: { text: 'Hips raised', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Hips level with the shoulders, back flat.',   // card zoom right (c2)
      wrong: 'Hips raised above the back.',                 // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, bear crawl. Knees hover, back flat, hips level with the shoulders.',
      wrong: 'Side view, bear crawl. The hips rise above the line of the back, higher than the shoulders.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'abs', plain: 'The front of the belly holds the body steady.', claim: CL.c9 },
    { muscleId: 'obliques', plain: 'The sides of the belly hold the body steady.', claim: CL.c9 },
  ],
  secondary: [
    { muscleId: 'front_delts', plain: 'The shoulders hold up your upper body.', claim: CL.c9 },
    { muscleId: 'quads', plain: 'The front of the thighs keeps the knees lifted.', claim: CL.c9 },
  ],
  textOnly: [   // named in the text, never painted (C2: the map draws core on the serratus); D-SHIP-Q7, as lib_plank
    { muscleId: 'core', plain: 'The core holds the whole body steady.', claim: CL.c9 },
  ],
  watch: [],
  // The card's four feel rows have empty fixes, so they are left out (D-FEEL-NOMEANS); the feel line keeps their
  // claim (c9) and the wrist row's claim (c11) is the first risk.
  feelLine: 'You should feel this in your belly and sides, shoulders and front thighs.',
  rows: [
    // D-SHIP-W7-WRISTPTR (#394 6648497703): the card's c11 row, kept so the wrist box has its linked row
    // (howto-layers.mjs:275); its fix points to the box, as the card's fixNote says, and gives no stop line of its own.
    // D-FEEL-MEANS-CAUSAL (#385): the means keeps the card's own strength ("often").
    { key: 'wrist', where: 'Back-of-wrist pain', at: { parts: ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'] },   // hanging_leg_raise's wrist parts
      means: 'With this pain under load, scans often find a wrist problem.',   // card feel row 4 (c11), shortened to 11 words at its strength
      fix: 'Check the wrist box below.',   // card fixNote: the shared wrist box carries what to do
      redFlag: true, claim: CL.wristRow },
  ],
  libraryDiff: { add: ['abs', 'obliques'], why: 'BarBend names the rectus abdominis and the obliques as the core muscles worked (card c9).' },
  claim: CL.c9,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'hips-rise', title: 'Hips rise as you crawl', zoom: 'hip-line', claim: CL.c5,
    fix: 'Keep hips in line with the back. Bear plank until you can.' },
  { key: 'arch', title: 'Back arches', claim: CL.mArch, fix: 'Tighten your trunk.' },
  { key: 'sway', title: 'Hips sway side to side', claim: CL.mSway, fix: 'Take shorter steps.' },
];
const RISKS = [
  { key: 'wrist', text: 'Pain on the back of the wrist in the loaded, bent-back position.', claim: CL.c11 },
  { key: 'arch', text: 'An arched back can be painful.', claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_bear_crawl',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: gap-ruled, the palm-flat key\'s faults cite no claim of this card and its hand zoom has no Wrong; the grip copy carries c1, c3 and c11.',
    orientation: 'pronated',         // the key's orientation 'over': palms down on the floor (c3)
    handle: 'floor',                 // the key has no HANDLE: the hand lies on the floor
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands shoulder-width apart, under the shoulders.', claim: CL.width },   // card grip.width (c1, c3)
    thumb: { mode: THUMB, claim: CL.conv },   // CONVENTION: the key's drawn thumb; the card gives none
    contact: CONTACT,                // 'palm-flat', CONVENTION: the key's contact 'whole-hand'; the card gives none
    // The key records no wrist range (VARIANTS.floor.wristRange null); the card's own wrist (c11) is the cited field.
    wrist: { exempt: 'Palm flat on the floor: the wrist is bent back under body weight, as in a plank.', claim: CL.c11 },
    faults: [],                      // gap-ruled (header): the key's faults cite no claim of this card
    gripLine: 'Palm pressed into the floor, hand under the shoulder.',   // card zoom hand-under-shoulder right (c3)
    cue: 'Press your palms into the floor.',   // c3
  },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Get on hands and knees: hands under shoulders, knees under hips.', claim: CL.c3 },
    { kind: 'brace', text: 'Press palms into the floor, brace, lift knees about 2 inches.', claim: CL.c3 },
    { kind: 'position', text: 'Move one hand and the opposite foot forward, then switch.', claim: CL.step },
    { kind: 'position', text: 'Keep your back straight and your hips level with your shoulders.', zoom: 'hip-line', claim: CL.c2 },
    { kind: 'finish', text: 'One drill is 4 steps forward, then 4 steps back.', claim: CL.c12 },
  ],
  posture: [
    { key: 'hands', label: 'Hands under shoulders', detail: 'Hands under shoulders, knees under hips.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c3 },
    { key: 'knees', label: 'Knees hover', detail: 'Knees hover just off the floor, never touching it.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.knees },
    { key: 'back', label: 'Back flat', detail: 'Back flat, not arched.', anchor: { landmark: 'backMid', pose: 'end' }, claim: CL.back },
    { key: 'hips', label: 'Hips level', detail: 'Hips at shoulder height.', anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'hip-line', claim: CL.c2 },
  ],
  feel,
  zooms,
  chips: ['hip-line', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hands under shoulders, knees under hips. Lift your knees and take small steps.',
    mistakeLine: 'Keep your hips level with your shoulders: never let them rise.',
    cueLine: 'Hips level, knees hover.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bear_crawl.json', rev: 1 },
};
