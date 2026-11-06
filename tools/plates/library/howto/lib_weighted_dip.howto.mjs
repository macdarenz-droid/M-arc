// LIB-SHIP W6: the How-to content of lib_weighted_dip (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/weighted_dip.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json. The card's hand claims (bars about shoulder-width, hands even and gripping
// hard, drive through the palms; c1, c2, c5) live in handling (gripLine, limitText, cue) and setup steps 1 and 3.
// GRIP (c) (Q-W6-5, #393 6647923934): the card leaves grip.thumb and grip.wrist blank with no delegation ("No dip source
// gives the thumb or wrist position"). The thumb is golden B's push default (machine_chest_press handling.thumb
// 'wrapped', machine_chest_press.howto.mjs:252) and the wrist range is the push key's convention range (pairs.mjs:24
// CONVENTIONS['ga:push-heel'] 'extension 0 to 15'), both cited CONVENTION, data only, never printed (D-SHIP-CONVCOPY).
// Contact (D-SHIP-W6-PALMS): the card's "drive through the palms" (c5) names no palm zone, so the `heel` zone is
// ga:push-heel's (D-LIB7-19), as data; the copy keeps the card's own words. No HandleProfile fits parallel dip bars, so
// handling.handle is left out (Q-W3-5 form); no palm direction is sourced, so handling.orientation is left out.
// Zooms (D-SHIP-DRAWVAL): shoulders (DV, the shrug) and depth (DV, sunk far below parallel). The card's depth Wrong
// ("shoulders sunk far below the elbows", c4) is the opposite fault of the plate's own Mistake (the half rep, c14), so
// it is a drawing value, not the Mistake. The card zoom `plate` (a swinging plate is motion, not a pose) is a text
// checkpoint (D-SHIP-TEXTZOOM), shown in setup step 2, mistakes[2] and risks[2].
// Way out (tier A): the card's gap (the loaded mount and dismount, a failed rep) stays a gap; no way-out line is shown
// (ruling extra 3: the safety checker adds its item later).
// Not cited: c9 and c15 (tempo, WEAK), c13 (load progression, D-TEXT-PROGRESSION).
// No variant line (equipment 'Bodyweight').
import plateSpec, { WD, bisect, loadedCom } from '../specs/weighted_dip.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-dip': { cite: 'How to Do Bar Dips: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/bar-dip/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-dips': { cite: 'How to Do Dips: Proper Form & Variations (BarBend)', url: 'https://barbend.com/dips/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-dipcorrect': { cite: "Dip Correctly or Don't Dip at All (BarBend)", url: 'https://barbend.com/news/dip-correctly-or-dont-dip-at-all/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mckenzie-2022': { cite: 'Bench, Bar, and Ring Dips: Do Kinematics and Muscle Activity Differ?', url: 'https://pubmed.ncbi.nlm.nih.gov/36293792/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // Golden B's push default for the thumb (the card's grip.thumb is blank): a convention, never shown.
  'push-default': { cite: 'Golden B push default: machine_chest_press handling.thumb wrapped', url: 'tools/plates/layers/exercises/machine_chest_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The push key's convention for the contact zone and the wrist range (the card names no zone and no wrist): never shown.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-dip', BB = 'bb-dips', BBC = 'bb-dipcorrect';
const CL = {
  c1: C(['CONSENSUS'], [SL, BB], 'c1'),
  c2: C(['MECH'], [BB, SL], 'c2'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL, BB], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c8: C(['CONSENSUS'], [BB, BBC], 'c8'),
  c10: C(['CONSENSUS'], [SL, BB], 'c10'),
  shoulders: C(['CONSENSUS'], [SL], 'c3, c6'),
  short: C(['CONSENSUS'], [SL, BBC, BB], 'c7, c14, c4'),
  shrug: C(['CONSENSUS'], [SL, BB], 'c6, c4'),
  swing: C(['CONSENSUS'], [SL, BB, BBC], 'c7, c8, c4'),
  grip: C(['MECH', 'CONSENSUS'], [BB, SL], 'c2, c1'),
  shoulderRow: C(['CONSENSUS'], [SL, BB], 'c11, c6, c5, c4, c10'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the convention fields DERIVED at import from copied source values, so they cannot drift unseen; a value
// that does not map throws. tests/howto/lib-ship.test.ts pins each copy to its live source.
//   thumb   <- machine_chest_press.howto.mjs:252 handling.thumb { mode: 'wrapped' } (golden B's push default)
//   contact, wrist ext <- pairs.mjs:24 CONVENTIONS['ga:push-heel']
// HandContact names the palm zone 'heel of the palm' as 'heel' (src/howto/content-types.ts HandContact).
const PUSH_THUMBS = { machine_chest_press: 'wrapped' };   // machine_chest_press.howto.mjs:252
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // pairs.mjs:24 CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const THUMB = new Set(Object.values(PUSH_THUMBS)).size === 1 ? Object.values(PUSH_THUMBS)[0] : undefined;
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!THUMB || !CONTACT || !EXT) throw new Error(`lib_weighted_dip: no push thumb default, or ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);
const CONV_THUMB = C(['CONVENTION'], ['push-default'], 'card grip.thumb is blank (no dip source): golden B\'s push default, machine_chest_press.howto.mjs:252, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec start = card plate.start, the top; spec end = card plate.end, the bottom on the
// parallel line):
//   shrug (card zoom shoulders Wrong, c6 "shoulders shrugged up toward the ears"): the bottom with the shoulder blades
//         raised SHRUG cm instead of the spec's SCAP_ELEV down; the shoulder joint kept on its spot (the body sinks
//         below it, the hands stay on the bars through the spec's reach).
//   deep  (card zoom depth Wrong, c4 "shoulders sunk far below the elbows"): the bottom's body (the spec's poseFor at
//         depth 1: the same lean and legs) with the shoulder DEEP below the parallel line, its z solved for balance with
//         the spec's own loadedCom and bisect (D-LIB17-DIPBAL), the hands on the bars.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): SHRUG 7 cm
// is a Wrong-pose size no card gives (c6 names the shrug, no size): W6 panel L5 found incline_push_up's M_SHRUG 4 cm did
// not read; at 7 the ear-to-shoulder-top gap closes by about 10 cm (landmarksOf). DEEP 0.15 m is the deepest 5 cm
// step (the spec's BAR_Y step) that keeps the hanging plate above the floor (0.20 m puts it 3 cm under); it puts the
// upper arm about 12 deg past level against the Right's 14 deg above (landmarksOf). No card gives them, no number from
// them appears in user copy; the layers panel judges them.
const H = 1.75, SHRUG = 7, DEEP = 0.15;
const END = plateSpec.poses.end, SH = landmarksOf(END, H)['shoulder.r'];
const shrugBase = { ...END, scap: { elev: SHRUG, pro: END.scap.pro } };
const SH1 = landmarksOf(shrugBase, H)['shoulder.r'];
const SHRUG_POSE = { ...shrugBase, root: { ...END.root, at: END.root.at.map((v, i) => v - (SH1[i] - SH[i])) } };
const DEEP_Y = WD.endY - DEEP;
const DEEP_POSE = WD.poseFor(1, DEEP_Y, bisect(z => loadedCom(landmarksOf(WD.poseFor(1, DEEP_Y, z), H))[2], -0.3, 0.6, 'balanced deep shoulder'));
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  shrug: { pose: SHRUG_POSE },
  deep: { pose: DEEP_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per drawable card zoom, same keys and kinds (`plate` is a text checkpoint, see the header). Zoom shell shape
// (callout with an anchor at the landmark it names; pilot-a.closeups.mjs); each Wrong is its still drawn alone
// (solid), with the guides each zoom names.
const zooms = [
  {
    key: 'shoulders', chip: 'Shoulders', heading: 'Shoulders down', kind: 'posture',
    // W6 panel L5: both windows sit at the same place under the ear (the right pose's in Right, the shrug's in Wrong),
    // so the head stays put and the Wrong shoulder is seen rising toward the ear, with a red up arrow on the shoulder
    // top (`off`, plate px: drawing values that place the window and the arrow).
    crop: { center: { at: 'ear', pose: 'right', off: [0, 30] }, centerWrong: { at: 'ear', pose: 'mistake', off: [0, 30] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: SHRUG_POSE, solid: true },
    guides: [{ kind: 'drop', from: { at: 'shoulderTop.r', pose: 'mistake', off: [0, 16] }, to: { at: 'shoulderTop.r', pose: 'mistake', off: [0, -3] } }],
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shrugged', anchor: 'shoulderTop.r' },   // c6
    },
    caption: {
      right: 'Shoulders down and back at the bottom.',
      wrong: 'Shoulders shrugged up toward the ears.',
    },
    alt: {
      right: 'Side view, bottom of the dip. Shoulders down and back, away from the ears, hands on the bars.',
      wrong: 'Side view, bottom of the dip. The shoulders shrug up toward the ears.',
    },
  },
  {
    key: 'depth', chip: 'Depth', heading: 'Depth', kind: 'posture',
    // W6 panel L1/L5: a dashed level line at each panel's own elbow height (the parallel reference, c4) and, in the
    // Wrong, a red drop arrow from where the Right's shoulder sits down to the sunk shoulder (offsets: drawing values).
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: DEEP_POSE, solid: true },
    guides: [
      { kind: 'level', at: 'elbow.r', own: true },
      { kind: 'drop', from: { at: 'shoulder.r', pose: 'right' }, to: { at: 'shoulder.r', pose: 'mistake', off: [0, -4] } },
    ],
    callout: {
      right: { text: 'Upper arm level', anchor: 'elbow.r' },
      wrong: { text: 'Too deep', anchor: 'shoulder.r' },   // c4
    },
    caption: {
      right: 'Upper arm about level with the floor.',
      wrong: 'Shoulders sunk far below the elbows.',
    },
    alt: {
      right: 'Side view, bottom of the dip. The upper arm is about level with the floor, elbows pointing back.',
      wrong: 'Side view, bottom of the dip. The shoulders sink far below the elbows.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'chest', plain: 'The chest does the pressing.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm presses too.' },
  ],
  secondary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders helps press.' }],
  watch: [],
  feelLine: 'You should feel this in your chest, front shoulders and the back of your arms.',
  rows: [
    // The card's first row (chest and back of the arms: the pressing muscles are working) has no fix, so it is left
    // out: the feel line says it (D-SHIP-Q16).
    { key: 'breastbone', where: 'Breastbone, new to dips', at: { muscles: ['chest'] },
      means: 'Dips can feel stressful here at first.',
      fix: 'Add sets gradually.', claim: CL.c10 },   // c10 (the row's claim)
    { key: 'shoulder', where: 'Front of the shoulder', at: { muscles: ['front_delts'] },
      means: 'Your form may be off: shrug, lean or depth.',
      fix: 'Keep shoulders down, torso upright, depth at parallel. If it still hurts, swap to pushdowns.',   // c10 names close-grip bench press too
      redFlag: 'shoulder', claim: CL.shoulderRow },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, BB, 'mckenzie-2022'], 'c11, c12'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'short', title: 'Cutting reps short', claim: CL.short,
    fix: 'Lower to about parallel on every rep.' },
  { key: 'shrug', title: 'Shoulders shrugging toward your ears', zoom: 'shoulders', claim: CL.shrug,
    fix: 'Shoulders down and back through the whole rep.' },
  // D-TEXT-GOLDEN: the card zoom `plate` (c8) and posture 'plate hangs still' are shown here and in setup step 2.
  { key: 'swing', title: 'Swinging plate or flared elbows', claim: CL.swing,
    fix: 'Control the plate. Keep your elbows back.' },
];
const RISKS = [
  { key: 'shrug', text: 'Shrugged shoulders add stress on the shoulder joint.', claim: CL.c6 },
  { key: 'deep', text: 'Dipping far below parallel can stress the shoulders.', claim: CL.c4 },
  { key: 'plate', text: 'A swinging plate can make you unsteady.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_weighted_dip',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c1, c2 and c5.',
    loadAxis: 'along-forearm',  // the push archetype: the load runs down the straight forearm into the bars
    overBody: false,
    width: { text: 'Bars about shoulder-width apart, or up to about 5 cm wider.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION (Q-W6-5): golden B's push default, derived above
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (D-SHIP-W6-PALMS, data only)
    // The card has no grip.wrist. EXT is the push key's convention range, read above (data only); the shown line is c5.
    wrist: { ext: EXT, limitText: 'Drive through your palms back to the top.',
      claim: C(['CONSENSUS', 'CONVENTION'], [BB, 'ga-push-heel'], 'card c5. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number; the card has no grip.wrist.') },
    faults: [],                // the card names no hand fault
    gripLine: 'Hands even on the bars, about shoulder-width. Grip the bars hard.',   // c1, c2
    cue: 'Drive through the palms.',   // hint J (c5)
  },
  contacts: ['hang-support'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Pick bars about shoulder-width apart.', claim: CL.c1 },
    // D-TEXT-GOLDEN: the card zoom `plate` (c8, a text checkpoint) and posture 'plate hangs still' are shown here.
    { kind: 'load', text: 'Belt on, plate hanging low near your shins.', claim: CL.c8 },
    { kind: 'grip', text: 'Hands even on the bars. Grip them hard.', claim: CL.c2 },
    { kind: 'get-in', text: 'Climb up to straight arms.', claim: CL.c2 },
    { kind: 'brace', text: 'Brace, shoulders down and back, ankles crossed.', zoom: 'shoulders', claim: CL.c3 },
  ],
  posture: [
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down. No shrug.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, zoom: 'shoulders', claim: CL.shoulders },
    { key: 'elbows', label: 'Elbows back', detail: 'Elbows go back, not out.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
    // D-TEXT-GOLDEN: shown in the shoulder feel row's fix ('torso upright').
    { key: 'torso', label: 'Torso upright', detail: 'Torso nearly upright, slight lean at most.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c5 },
    { key: 'depth', label: 'Depth to parallel', detail: 'Lower under control to about parallel.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'depth', claim: CL.c4 },
    // D-SHIP-TEXTZOOM: the card zoom `plate` as a text checkpoint (Right, then Wrong in the detail).
    { key: 'plate', label: 'Plate still', detail: 'The plate hangs low and still. No swinging.', anchor: { landmark: 'navel', pose: 'start' }, claim: CL.c8 },
    // D-TEXT-GOLDEN: shown in the Grip limit line and the hint.
    { key: 'palms', label: 'Drive through palms', detail: 'Drive through your palms to the top.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['shoulders', 'depth', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Bars about shoulder-width, plate hanging low and still. Shoulders down and back.',
    mistakeLine: 'Never cut your reps short. Lower to about parallel on every rep.',
    cueLine: 'Shoulders down, elbows back.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/weighted_dip.json', rev: 1 },
};
