// LIB-SHIP W5: the How-to content of lib_front_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/barbell_back_squat.howto.mjs, its card parent). Every shown string restates a claim of the
// verified card docs/research/howto/cards/front_squat.json; its claim ids are named on each field's claim.
// GRIP full (the card fills grip.type, width, thumb, handContact and wrist; claims c3-c6). The wrist is the front-rack
// exemption (card grip.wrist; docs/research/howto/shared/front-rack-exemption.json): the on-body 0-15 deg range is
// replaced, no wrist number is drawn or checked.
// No hand zoom (D-SHIP-C3, gap-key): the card's two hand zooms `front-rack` (c3, c4) and `cross-arm` (c6, c7) belong to
// the front-rack key, which lists front_squat in GAPS (tools/plates/library/hands/hand-front-rack.mjs:29, R8 panel: below
// the hand bar); the id is on tools/plates/library/hands/no-zoom.json. Their claims (bar on the shoulders, loose grip,
// elbows high; the crossed-arm option with elbows high) live in the grip line, the width text and setup step 3.
// Parent barbell_back_squat (golden). INHERIT_MAP (lint/family.mjs) compares posture[key=feet].label only:
// D-SHIP-W5-GOLDENFEET, label exactly the golden's "Knees follow toes", detail from this card's own P3 (c10), never the
// golden detail. The card's inherit setup[2] (plates loaded evenly, collars on) has no valid map entry and goes to
// research (Q-W5-5); no step here restates it.
// Tier A way out (card tierA.wayOut, c14, c25; Q-W5-4): setup step 1 and mistakes[safeties].fix (both printed);
// copy.setupLine (app only) repeats it.
// No variant line (equipment 'Barbell').
// Red flags: the card's redFlags (wrist, back, knee), in its order. Wrist: golden B's shared RED_FLAG (the wrists row,
// redFlag: true); back: LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the lower-back row; knee:
// golden B's shared knee block, linked by the knee row.
import plateSpec from '../specs/front_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'cat-frontsquat': { cite: 'Catalyst Athletics, Front Squat (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/78/Front-Squat/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'cat-rack': { cite: 'Catalyst Athletics, Clean Rack Position', url: 'https://www.catalystathletics.com/video/1402/Clean-Rack-Position/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-frontsquat': { cite: 'Learn this foundational exercise: front squat (excerpt from Powerlifting, 2nd ed., Austin and Mann)', url: 'https://us.humankinetics.com/blogs/excerpt/learn-this-foundational-exercise-front-squat',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'rep-fail': { cite: 'How to Safely Fail a Heavy Squat in the Gym (REP Fitness)', url: 'https://repfitness.com/blogs/training/how-to-safely-fail-a-heavy-squat-in-the-gym',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'yavuz-2015': { cite: 'Kinematic and EMG activities during front and back squat variations in maximum loads', url: 'https://pubmed.ncbi.nlm.nih.gov/25630691/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'hackett-2013': { cite: 'The Valsalva maneuver: its effect on intra-abdominal pressure and safety issues during resistance exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/23222073/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'stronglifts-squat': { cite: 'How to Squat with Proper Form: The Definitive Guide (StrongLifts)', url: 'https://stronglifts.com/squat/',
    kind: 'coach', access: 'full', checked: '2026-10-18', use: 'CONSENSUS' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as golden B's barbell_back_squat lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources), the card's
  // c22 source: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's barbell_back_squat lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: gullett-2009 (c16), c13 (breathing), c15 (load progression), c21 (paused training, a programming option).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CAT = 'cat-frontsquat', RACK = 'cat-rack', HK = 'hk-frontsquat', REP = 'rep-fail';
const CL = {
  c2: C(['CONSENSUS'], [CAT, RACK], 'c2'),
  c3: C(['CONSENSUS'], [RACK, HK], 'c3'),
  c4: C(['CONSENSUS'], [CAT], 'c4'),
  c7: C(['CONSENSUS'], [HK], 'c7'),
  c8: C(['CONSENSUS'], [CAT], 'c8'),
  c10: C(['CONSENSUS'], [CAT], 'c10'),
  c11: C(['CONSENSUS'], [CAT, HK], 'c11'),
  c12: C(['CONSENSUS'], [CAT], 'c12'),
  c14: C(['CONSENSUS', 'MECH'], [REP], 'c14'),
  c19: C(['MECH'], ['hackett-2013'], 'c19'),
  c23: C(['CONSENSUS'], ['nhs-knee'], 'c23'),
  c24: C(['MECH'], ['yavuz-2015', HK], 'c24'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. The card zoom upright-torso Wrong (c7: "Chest falling forward, elbows dropping") is
// the plate's drawn fault, the spec's Mistake pose (elbows dropped, chest fallen forward with the hips where they were;
// fsInfo.mIncl SOLVED), merged over the end pose, as the engine draws it. No drawing value is added here.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'chest-falls': { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the two hand zooms `front-rack` and `cross-arm` (D-SHIP-C3 gap-key, above). The posture zoom
// in the zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs); the Wrong is drawn
// alone (solid). The crop is centred on the chest so the elbows and the chest both sit in it.
const zooms = [
  {
    key: 'upright-torso', chip: 'Torso', heading: 'Torso angle', kind: 'posture',
    crop: { center: { at: 'chest', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Chest tall', anchor: 'chest' },
      wrong: { text: 'Chest falls', anchor: { at: 'chest', pose: 'mistake' } },
    },
    caption: {
      right: 'Chest tall, elbows high at the bottom.',
      wrong: 'Chest falling forward, elbows dropping.',
    },
    alt: {
      right: 'Side view, bottom of the squat. The torso is upright and the elbows are high, the bar on the shoulders.',
      wrong: 'Side view, out of the bottom. The elbows have dropped and the chest falls forward.',
    },
    feelRow: 'lower-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The front of the thighs do most of the work.' }],
  secondary: [{ muscleId: 'glutes', plain: 'The glutes help.' }],
  watch: [{ muscleId: 'lower_back', plain: 'If the torso tips forward, the lower back works more.' }],
  // D-TEXT-GOLDEN: posture point depth (c11) in the second sentence
  feelLine: 'You should feel this in your front thighs. Go as deep as balance and a neutral spine allow.',
  rows: [
    { key: 'wrists', where: 'Wrists or fingers', at: { parts: HANDS },
      means: 'The hands are holding the bar up.',
      fix: 'Push your shoulders forward and up. Try a fingertip rack.',
      redFlag: true, claim: { ...CL.c3, sources: [...CL.c3.sources, 'nhs-wrist-pain'] } },
    { key: 'lower-back', where: 'Lower back more than thighs', at: { muscles: ['lower_back'] },
      means: 'The torso is tipping forward.',
      fix: 'Keep the elbows high and the chest tall.',
      zoom: 'upright-torso', redFlag: 'back', claim: { ...CL.c24, sources: [...CL.c24.sources, 'nhs-back'] } },
    { key: 'throat', where: 'Pressure on the throat', at: { parts: ['neck-left', 'neck-right'] },
      means: 'The bar is too far back or the shoulders are not up.',
      fix: 'Raise your shoulders slightly so the bar only touches lightly.',
      claim: C(['CONSENSUS'], [CAT, RACK, HK], 'c2, c3') },
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop the set.',
      redFlag: 'knee', claim: CL.c23 },
  ],
  claim: C(['CONSENSUS', 'DATA'], [CAT, 'yavuz-2015', HK], 'c1, c17, c18, c11'),
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
// The card's three handlingMistakes. Each fix is the card's, reworded so no sentence prints twice on the page (the
// matching feel row carries the card's full fix).
const MISTAKES = [
  { key: 'chest', title: 'Chest falling, elbows dropping', zoom: 'upright-torso', claim: CL.c7,
    fix: 'Elbows up, chest tall.' },
  { key: 'hands', title: 'Hands holding the bar up', claim: CL.c3,
    fix: 'Let your shoulders carry the bar. Try a fingertip rack.' },
  // Tier A way out (card tierA.wayOut, c14, c25): setup step 1 sets the safeties or a spotter, this fix is the bail
  // sequence, and risks[no-safeties] carries 'practise bailing light' (c25)
  { key: 'safeties', title: 'Bailing with no safeties set', claim: C(['CONSENSUS', 'MECH'], [REP], 'c14, c25'),
    fix: 'Set the safeties. Let go, drop it forward onto them, step back.' },   // c14, c25 (#392 6681869167; fix cap 12 words)
];
const RISKS = [
  { key: 'no-safeties', text: 'A failed rep with no safeties set. Practise bailing light.', claim: C(['CONSENSUS', 'MECH'], [REP], 'c14, c25') },
  { key: 'breath', text: 'Holding your breath under heavy load raises blood pressure.', claim: CL.c19 },
  { key: 'throat', text: 'Bar pressing on the throat.', claim: CL.c2 },
];

export default {
  schema: 1,
  id: 'lib_front_squat',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'on-body',
    why: 'D-SHIP-C3 no-zoom list, gap-key: the front-rack key lists front_squat in GAPS (hand-front-rack.mjs:29, below the hand bar); the grip copy carries c3, c4, c6 and c7.',
    handle: 'bar-28',          // data only: the front-rack key's HANDLE (hand-front-rack.mjs: golden B's bar value)
    // card grip.width (c5)
    width: { text: 'No fixed width. Try other widths until a full grip fits.',
      claim: C(['CONSENSUS'], [RACK], 'card grip.width, c5') },
    // card grip.thumb (c4, c5): wrapped as far as the rack allows; the fingertip rack is in mistakes[hands] and the wrists row
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS'], [CAT, RACK], 'card grip.thumb, c4, c5') },
    // card grip.handContact (c3): the bar rests on the shoulders, the hands only add security; the hand zone is the
    // fingertip rack the card allows (c3, c5) and the plate draws (specs/front_squat.mjs rackHands). Data only.
    contact: 'fingertips',
    // card grip.wrist: the front-rack exemption (shared/front-rack-exemption.json c1, c4; card c3, c5); never shown
    wrist: { exempt: 'Front-rack exemption (shared/front-rack-exemption.json): the shoulders carry the bar and the hands only add security; a fingertip rack is fine (c3, c5). No source gives a wrist angle.',
      claim: C(['CONSENSUS'], [RACK, CAT], 'card grip.wrist, c3, c5; shared/front-rack-exemption.json c1, c4') },
    faults: [
      // card zoom front-rack wrong (c3, c4) and cross-arm wrong (c6, c7). Not drawn (no hand zoom), so no pose or marker.
      { key: 'bar-off-shoulders', label: 'Bar on hands', pose: {}, markers: [], alt: 'Bar held in the hands, off the shoulders.' },
      { key: 'cross-arm-elbows', label: 'Elbows dropped', pose: {}, markers: [], alt: 'Crossed arms with the elbows dropped.' },
    ],
    // the two card hand zooms' Right lines (c3, c4; c6, c7)
    gripLine: 'Your shoulders hold the bar, hands loose round it, elbows high. Or cross your arms over it, elbows high.',
    cue: 'Shoulders hold the bar, elbows high.',   // c3, c7; 6-word cue cap
  },
  contacts: ['standing-feet'],
  setup: [
    // Tier A way out, first half (card tierA.wayOut, c14, c25)
    { kind: 'safety', text: 'Set safeties just below your lowest depth. Heavy? Use a spotter.',
      claim: C(['CONSENSUS', 'MECH'], [REP], 'c14, c25 (card tierA.wayOut)') },
    { kind: 'position', text: 'Bar between throat and shoulders. Shoulders pushed forward and slightly up.',
      claim: C(['CONSENSUS'], [CAT, RACK, HK], 'c2, c3') },
    // D-TEXT-GOLDEN: posture point 'Knees and hips bend together, straight down' (c10)
    { kind: 'grip', text: 'Loose full grip, elbows high. Sit straight down, knees and hips together.', zoom: 'upright-torso',
      claim: C(['CONSENSUS'], [CAT], 'c4, c10') },
    { kind: 'position', text: 'Heels hip width or a little wider, toes out 15-30 degrees.', claim: CL.c8 },
    { kind: 'brace', text: 'Walk out one step back on each leg. Brace hard each rep.',
      claim: C(['CONSENSUS', 'MECH'], ['stronglifts-squat', CAT], 'c26, c9') },
  ],
  posture: [
    { key: 'bar', label: 'Bar in channel', detail: 'Bar in the channel, no pressure on the throat.',
      anchor: { landmark: 'shoulderTop.r', pose: 'start' }, claim: CL.c2 },
    { key: 'elbows', label: 'Elbows high', detail: 'Elbows high throughout.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'upright-torso', claim: CL.c7 },
    { key: 'bend', label: 'Straight down', detail: 'Knees and hips bend together, straight down.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c10 },
    // D-SHIP-W5-GOLDENFEET (Q-W5-5): the golden label exactly; the detail is this card's P3 (c10), not the golden's
    { key: 'feet', label: 'Knees follow toes', detail: 'Whole-foot balance, knees in line with the feet.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c10 },
    { key: 'depth', label: 'Depth', detail: 'Depth as far as a neutral spine and whole-foot balance allow.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c11 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright on the way up.',
      anchor: { landmark: 'chest', pose: 'end' }, zoom: 'upright-torso', claim: CL.c12 },
  ],
  feel,
  zooms,
  chips: ['upright-torso', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    // app-only lead line (not printed on the layers page): the way out again, card-true and cut to the 22-word cap
    setupLine: 'Safeties below your lowest depth, or a spotter when heavy. Practise bailing light: let go, drop it forward onto them, step back.',
    mistakeLine: 'Keep your elbows high, or the bar may slip. Go only as deep as balance and a neutral spine allow.',
    cueLine: 'Hips and knees together, straight down.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist', 'back', 'knee'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/front_squat.json', rev: 1 },
};
