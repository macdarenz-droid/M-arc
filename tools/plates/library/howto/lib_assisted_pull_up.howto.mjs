// LIB-SHIP W3: the How-to content of lib_assisted_pull_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/assisted_pull_up.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand` is drawn by the approved `bar` pair key, variant 'hang',
// orientation 'over' (tools/plates/library/hands/hand-bar.mjs:36 IDS.assisted_pull_up; hangVariant, hand-bar.mjs:13-27).
// The card leaves grip.handContact to the shared hang archetype ("not re-sourced on this card"): the contact is the key's
// convention 'ga:hang-base' (hand-bar.mjs:7), cited CONVENTION, never DATA. The key module is not imported
// (D-LIB7FIX-PERKEY closure, W2 form): its record is copied here and pinned against the live key by
// tests/howto/lib-ship.test.ts. The Right/Wrong notes are the pair panel's words (hands/words/bar-hang-over.json).
// Pose map (spec header, ruling D-LIB9a-NOTE Q2): the spec's `start` is the card's top (chin over the bar) and its `end`
// the straight-arm hang; the Mistake (a half rep, arms bent at the bottom) is drawn over the end.
// Red flags: the card's redFlags (shoulder, elbow): golden B's shared blocks, linked by the rows' redFlag.
// Tier-A way out: the card records a gap (no sourced way to get off the pad or leave the machine), so no way-out line is
// written; the W3 safety checker rules on it (Q-W2-3 form).
import plateSpec from '../specs/assisted_pull_up.mjs';
import { landmarksOf } from '../engine.mjs';   // W3 LAYERS FIX: the blade outlines' rib level (the plate's own engine)
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bullbar-assist-beginner': { cite: "How to Use a Pull-Up Assist Machine Correctly (Beginner's Guide) (Bullbar Fit, manufacturer blog)", url: 'https://bullbarfit.com/blogs/q-as/how-to-use-a-pull-up-assist-machine-correctly-for-beginners-at-the-gym',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'bullbar-assist-safety': { cite: 'How to Use an Assisted Pull-Up Machine Without Hurting Yourself (Bullbar Fit, manufacturer blog)', url: 'https://bullbarfit.com/blogs/q-as/how-do-i-correctly-use-an-assisted-pull-up-machine-at-the-gym-to-avoid-injury',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-assisted-pull-up': { cite: 'How to Do Assisted Pull-Ups: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/assisted-pull-up/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nasm-chin-pull': { cite: "Chin-Ups vs. Pull-Ups: A Trainer's Guide to Programming Both (NASM blog)", url: 'https://www.nasm.org/resource-center/blog/training/chin-ups-vs-pull-ups-the-difference-the-benefits-muscles-worked',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'odriscoll-1992': { cite: "The relationship between wrist position, grasp size, and grip strength (O'Driscoll et al., J Hand Surg Am)", url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'prinold-2016': { cite: 'Scapula kinematics of pull-up techniques: Avoiding impingement risk with training changes (Prinold and Bull, J Sci Med Sport)', url: 'https://pubmed.ncbi.nlm.nih.gov/26383875/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'youdas-2010': { cite: 'Surface electromyographic activation patterns and elbow joint motion during a pull-up, chin-up, or perfect-pullup rotational exercise (Youdas et al., J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/21068680/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  // The bar key's own source for the hand contact (the card leaves it to the hang archetype): a drawing convention.
  'hand-key-bar': { cite: 'LIB-7c hand pair key bar (hang), CONVENTIONS ga:hang-base: top of the palm where the fingers start; extension 0 to 35', url: 'tools/plates/library/hands/hand-bar.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's and RED_FLAG_ELBOW's own sources (layers/howto/shared.mjs), as golden B's pull_up lists them.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c9 (tempo, plate only); no field here restates it.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bullbar-assist-beginner', BS = 'bullbar-assist-safety', SL = 'strengthlog-assisted-pull-up', NASM = 'nasm-chin-pull', KEYSRC = 'hand-key-bar';
const CL = {
  c1: C(['CONSENSUS', 'WEAK'], [BB, SL], 'c1'),
  c2: C(['CONSENSUS', 'WEAK'], [BB, SL], 'c2'),
  c3: C(['CONSENSUS'], [SL, BB], 'c3'),
  c5: C(['CONSENSUS', 'WEAK'], [BS], 'c5'),
  c6: C(['CONSENSUS'], [NASM, BB], 'c6'),
  c7: C(['CONSENSUS'], [BB, NASM], 'c7'),
  c8: C(['CONSENSUS', 'WEAK'], [BB, NASM], 'c8'),
  c10: C(['MECH'], ['prinold-2016'], 'c10'),
  c13: C(['CONSENSUS'], [NASM], 'c13'),
  c16: C(['CONSENSUS', 'WEAK'], [BS], 'c16'),
  c17: C(['CONSENSUS', 'WEAK'], [BS], 'c17'),
  thumb: C(['CONSENSUS', 'WEAK'], ['hk-baechle-grip'], 'c12'),
  assist: C(['CONSENSUS', 'WEAK'], [BB, BS], 'c4, c5'),
  grip: C(['CONSENSUS', 'WEAK'], [BB, SL, 'hk-baechle-grip'], 'c1, c12'),
  half: C(['CONSENSUS', 'WEAK'], [BB, NASM, BS], 'c8, c5'),
  shrug: C(['CONSENSUS', 'WEAK'], [BB, NASM], 'c8, c7'),
  conv: C(['CONVENTION'], [KEYSRC], 'the bar key\'s ga:hang-base (the card leaves grip.handContact to the hang archetype)'),
  wrist: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c14. The ext range is the bar key\'s hang wristRange (ga:hang-base), a convention, not a card number.'),
  shoulderRow: C(['MECH', 'CONSENSUS'], ['prinold-2016', NASM, 'nhs-shoulder-pain'], 'c10, c13. The referral is the shared shoulder red flag (NHS).'),
  elbowRow: C(['CONSENSUS', 'WEAK'], [NASM, BS, 'nhs-elbow-pain'], 'c13, c15. The referral is the shared elbow red flag (NHS).'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The bar key's record for this id and its variant, copied (hand-bar.mjs:36 IDS.assisted_pull_up; hangVariant,
// hand-bar.mjs:13-27).
const KEYED = { variant: 'hang', orientation: 'over', faults: ['curled'] };   // IDS.assisted_pull_up
const V = {                                                                // VARIANTS.hang
  archetype: 'hang', loadAxis: 'across', wristRange: [0, 35], contact: 'base',
  right: { view: 'radial', forearm: 180, wrist: { ext: 10, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'gravity' } },
  rightNote: 'Base of fingers',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'base' (ga:hang-base) is HandContact 'finger-base'; an unmapped key
// word throws.
const CONTACT = { base: 'finger-base' }[V.contact];
if (!CONTACT) throw new Error('lib_assisted_pull_up: the bar key no longer records this sheet\'s contact');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: `start` (chin over the bar, c3), `end` (the straight-arm hang, c1) and the spec's
// Mistake merged over the end (arms still bent at the bottom, the pad up; card plate.mistake, c8), which is the card
// zoom knee pad's Wrong.
// DRAWING VALUES (D-SHIP-DRAWVAL; precedent golden B pull_up.howto.mjs:162 SHRUG_HANG): the shrug for the card zoom
// `shoulders` (c8) is golden B's own shrug offsets (scap elev 8, pro 1, neck 10, the body 7 cm lower on straight arms)
// over this plate's hang. No card gives a size; no number appears in user copy; the layers panel judges it.
const HANG = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const SHRUG = { root: { at: [HANG.root.at[0], HANG.root.at[1] - 0.07, HANG.root.at[2]], tilt: HANG.root.tilt }, scap: { elev: 8, pro: 1 }, neck: 10 };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: HANG },
  half: { pose: { ...HANG, ...MIS } },
  shrug: { pose: { ...HANG, ...SHRUG } },
};

// Shoulder blades seen from behind (W3 LAYERS FIX, L5): golden B's bladeOutlines (layers/exercises/pull_up.howto.mjs:172)
// and its drawing values, in cm from each shoulder joint centre: [toward the spine, up]. The blades ride on the shoulder
// joints, so in the shrug the ribcage and head sink under them. ribLevel: a fixed level on the ribcage, at the right
// hang's lower blade corners.
const BLADE = [[13, 2], [5, 3.2], [0.5, 4], [1, -1], [3, -6], [7.5, -13.5], [11.5, -8], [13.8, -2.5]];
const BLADE_SPINE = [[13.6, -1.5], [1, 3.6]];
const RIB_D = (() => { const lm = landmarksOf(HANG); return lm['shoulder.l'][1] + BLADE[5][1] / 100 - lm.backMid[1]; })();
function bladeOutlines(lm) {
  const lines = [], points = {};
  for (const sd of ['l', 'r']) {
    const Sj = lm[`shoulder.${sd}`], sg = Math.sign(Sj[0]);
    const w = ([m, up]) => [Sj[0] - sg * m / 100, Sj[1] + up / 100, Sj[2] - 0.08];
    lines.push({ pts: [...BLADE, BLADE[0]].map(w), kind: 'outline' }, { pts: BLADE_SPINE.map(w), kind: 'ridge' });
    points[`bladeLow.${sd}`] = w(BLADE[5]);
    points[`bladeTop.${sd}`] = w(BLADE[0]);
  }
  points.ribLevel = [0, lm.backMid[1] + RIB_D, lm.backMid[2]];
  return { lines, points };
}

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' and its heading the shared pair heading (D-SHIP-Q3,
// hands/words/bar-hang-over.json). The posture zooms are in the zoom shell's shape (render/closeup/crop.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // pairs.mjs ORIENTATIONS.over
      // CONVENTION (D-SHIP-GRIP (a)): 'Base of fingers' is the bar key's ga:hang-base note, source hand-key-bar.
      notes: { right: V.rightNote, wrong: FAULTS[0].label },   // words/bar-hang-over.json
    },
    caption: {
      right: 'Overhand, thumb wrapped, wrist not curled.',
      wrong: 'Wrist curled forward.',
    },
    // the key's alt (hangVariant), split in two sentences for the 15-word sentence cap
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the bar key's ga:hang-base, source hand-key-bar.
    alt: { right: 'Bar across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'knee-pad', chip: 'Bottom', heading: 'Bottom position', kind: 'posture',   // card zoom key: knee pad
    // zoom shell: crop centre on the right pose's elbow; the Wrong is the spec's Mistake dashed over the end pose, as
    // `stills.half`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 20] }, sizePx: 200 },
    right: 'end',
    // W3 PANEL FIX 2 (#384 6649416891, L5; c8): the bent-arm half hang drawn solid as the main stroke, over the
    // straight-arm hang faded (crop wrong.under)
    wrong: { base: 'end', pose: MIS, solid: true, under: true },
    callout: {
      right: { text: 'Arms straight', anchor: 'elbow.r' },
      wrong: { text: 'Arms bent', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Both knees on the pad, arms fully straight.',
      wrong: 'Arms still bent at the bottom: a half rep.',
    },
    alt: {
      right: 'Side view, bottom of the rep. Both knees on the pad, arms fully straight overhead.',
      wrong: 'Side view. The arms stay bent at the bottom and the pad stays up.',
    },
  },
  {
    key: 'shoulders', chip: 'Shoulders', heading: 'Shoulder set', kind: 'posture',   // card zoom key: shoulders
    // W3 LAYERS FIX (#384 6648454032, L5): from the side the near arm hides the shrug, so both crops are drawn from
    // behind, golden B's hanging_leg_raise/pull_up "Seen from behind" form (view 'back', both solid, blades outlined, a
    // level at the right hang's head and an arrow down to the sunk head). c8.
    view: 'back', camLabel: 'Seen from behind',
    outlines: bladeOutlines,
    crop: { center: { at: 'shoulderTop.r', pose: 'right', off: [0, 8] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: SHRUG, solid: true },
    guides: [{ kind: 'level', at: { at: 'head', pose: 'right' } }, { kind: 'level', at: 'ribLevel', tone: 'neutral' },
      { kind: 'drop', from: { at: 'head', pose: 'right' }, to: { at: 'head' } }],
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shrugged', anchor: 'shoulderTop.r' },
    },
    caption: {
      right: 'Shoulder blades down and back at the start.',
      wrong: 'Shoulders shrugged up to the ears.',
    },
    alt: {
      right: 'Seen from behind, straight-arm hang on the pad. Shoulders drawn down, a clear gap to the ears.',
      wrong: 'Seen from behind, the same hang shrugged. Shoulders up at the ears, the head sunk between the arms.',
    },
    feelRow: 'traps',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats, down the sides of your back, work hardest.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps help bend the elbows.' },
    { muscleId: 'mid_back', plain: 'The lower trapezius, between the shoulder blades, helps.' },
  ],
  watch: [
    { muscleId: 'upper_traps', plain: 'The tops of the shoulders should not take over.' },
  ],
  feelLine: 'You should feel this in the sides of your back and your arms.',
  rows: [
    { key: 'traps', where: 'Tops of the shoulders and neck', at: { muscles: ['upper_traps'] },
      means: 'You start the pull with your shoulders up by your ears.',
      fix: 'Draw your shoulders down and back first, then bend your arms.',
      zoom: 'shoulders', claim: CL.shrug },
    { key: 'shoulder', where: 'Shoulder', at: {},   // pain, not a muscle taking over: no map mark (golden B pull_up)
      means: 'Arms high overhead narrow the space under the shoulder roof.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.shoulderRow },
    { key: 'elbow', where: 'Inside or outside of the elbow', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Too much pulling volume, too soon.',
      fix: "Add sets slowly. Don't train through the pain.",
      redFlag: 'elbow', claim: CL.elbowRow },
  ],
  claim: C(['MECH'], ['youdas-2010'], 'c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'drop', title: 'Dropping fast when lowering', claim: CL.c16,
    fix: 'Take three to four seconds to lower to straight arms.' },
  { key: 'half', title: 'Stopping short', zoom: 'knee-pad', claim: CL.half,
    fix: "Full hang to chin over the bar. Can't? Add a little assistance." },
  { key: 'swing', title: 'Swinging or leg drive', claim: CL.c5,
    fix: 'Add assistance until every rep is controlled.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Arms overhead narrow the space under the shoulder roof.', claim: CL.c10 },
  { key: 'elbow', text: 'Elbows can get overused when pulling volume rises too fast.', claim: CL.c13 },
  { key: 'neck', text: 'Resting your chin or neck on the pad loads the neck.', claim: CL.c17 },
];

export default {
  schema: 1,
  id: 'lib_assisted_pull_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'hang'
    orientation: 'pronated',         // c1: overhand; the key's orientation 'over'
    handle: 'bar-32',                // the key's BAR32; the spec's bar is 32 mm (spec header)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'About shoulder width, or a little wider.', claim: CL.c1 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (c12; the key's right pose)
    contact: CONTACT,                // 'finger-base', CONVENTION: the key's ga:hang-base (source hand-key-bar); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep your wrist from curling forward.', claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: FAULTS,
    // CONVENTION (D-SHIP-GRIP (a)): 'across the base of your fingers' is the bar key's ga:hang-base, source hand-key-bar;
    // overhand c1, thumbs c12.
    gripLine: 'Overhand, thumbs wrapped around the bar.',
    cue: 'Overhand, thumbs wrapped.',   // c1, c12
  },
  contacts: ['brace-pad'],
  setup: [
    { kind: 'load', text: 'More stack weight, more help. Use the least for full reps.', claim: CL.assist },
    { kind: 'grip', text: 'Overhand, about shoulder width or a little wider, thumbs wrapped.', zoom: 'hand', claim: CL.grip },
    { kind: 'position', text: 'Knees securely on the pad. Let it sink until your arms straighten.', zoom: 'knee-pad', claim: CL.c1 },
    // D-TEXT-GOLDEN (#379 6637607604): posture 'elbows' (c7) and 'chest' (c2) carried into this visible step.
    { kind: 'brace', text: 'Blades down and back, then pull elbows to ribs, chest up.', zoom: 'shoulders', claim: C(['CONSENSUS', 'WEAK'], [BB, NASM, SL], 'c7, c2') },
    { kind: 'load', text: 'Over the weeks, add reps first, then take assistance away.', claim: CL.c6 },
  ],
  posture: [
    { key: 'straight', label: 'Straight arms', detail: 'Arms fully straight at the bottom of every rep.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'knee-pad', claim: CL.c3 },
    { key: 'blades', label: 'Shoulders set', detail: 'Shoulder blades down and back before the arms bend.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, zoom: 'shoulders', claim: CL.c7 },
    { key: 'elbows', label: 'Elbows down', detail: 'Elbows drive down toward the ribs.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c7 },
    { key: 'chest', label: 'Chest up', detail: 'Chest up at the top, shoulders not hunched.',
      anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c2 },
    { key: 'chin', label: 'Chin over bar', detail: 'Chin over the bar at the top.',
      anchor: { landmark: 'chin', pose: 'start' }, claim: CL.c3 },
    { key: 'still', label: 'No swing', detail: 'No swing or leg drive.',
      anchor: { landmark: 'hip.r', pose: 'end' }, claim: CL.c8 },
  ],
  feel,
  zooms,
  chips: ['hand', 'knee-pad', 'shoulders', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Knees on the pad, overhand grip. Hang with straight arms, shoulders down and back.',
    mistakeLine: 'Straighten your arms fully at the bottom. Lower slowly, never drop.',
    cueLine: 'Shoulders down, then pull.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'elbow'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/assisted_pull_up.json', rev: 1 },
};
