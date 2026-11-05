// LIB-SHIP W6: the How-to content of lib_cable_chest_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_chest_press.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, gap-key): the card's hand zoom `cable-press-handle` (c3) belongs to the `d-handle` key, which
// lists cable_chest_press in GAPS (tools/plates/library/hands/hand-d-handle.mjs:23: c3 names no bend direction and the
// radial view shows only flexion and extension); the id is on tools/plates/library/hands/no-zoom.json. Its hand claims
// (single handles, a neutral grip, just outside shoulder width, wrists lined up with the elbows, push through the palms;
// c3, c7) live in handling (gripLine, limitText) and setup step 4.
// GRIP (c) (D-SHIP-GRIP; D-SHIP-W6-PALMS, #393 6647923934): the card's grip.handContact is "Push through the palms (c3)",
// which names no zone. The contact zone `heel` and the wrist range are read at import from the push key's convention,
// tools/plates/library/hands/pairs.mjs CONVENTIONS['ga:push-heel'] (D-LIB7-19), as data only; the copy keeps the card's
// words. The card's grip.thumb is "Not given by any cable press source read (push archetype default)": the thumb is
// golden B's push default (machine_chest_press handling), DERIVED below. Both cited CONVENTION, never shown
// (D-SHIP-CONVCOPY).
// Red flags: the card's redFlags (shoulder, back), in card order (D-SHIP-W6-BACKREACH). The shoulder box is golden B's
// shared block; the back box is LIB-5's (tools/plates/library/shared/back-box.mjs), linked by the lower-back row's
// redFlag: 'back'.
// No variant line (equipment 'Cable').
import plateSpec from '../specs/cable_chest_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bos-cable-press': { cite: 'Cable Chest Press: What Is It, How To Do It & Mistakes To Avoid (Bells of Steel)', url: 'https://bellsofsteel.us/blogs/content/cable-chest-press',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-cable-press': { cite: 'Cable Standing Chest Press - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/cableStandingChestPress',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'nfpt-cable-press': { cite: 'How to do Standing Cable Presses (NFPT)', url: 'https://nfpt.com/standing-cable-presses/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-cable-press': { cite: 'How to Do Cable Chest Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-chest-press/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  santana2007: { cite: 'A kinetic and electromyographic comparison of the standing cable press and bench press', url: 'https://pubmed.ncbi.nlm.nih.gov/18076235/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  calatayud2014: { cite: 'Muscle activity levels in upper-body push exercises with different loads and stability conditions', url: 'https://pubmed.ncbi.nlm.nih.gov/25419894/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  schutz2022: { cite: 'Chest Exercises: Movement and Loading of Shoulder, Elbow and Wrist Joints', url: 'https://pubmed.ncbi.nlm.nih.gov/35202059/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'MECH' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The push key's own source for the contact zone and wrist range (the card's "the palms" names no zone): a convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // golden B's push archetype default for the thumb the card leaves unsourced: a convention.
  'push-default': { cite: 'Golden B push archetype default (machine_chest_press handling: thumb wrapped)', url: 'tools/plates/layers/exercises/machine_chest_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs): the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources): the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (schutz2022, MECH WEAK by inference), c15, c16 (tempo, plate drawing data).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BOS = 'bos-cable-press', MO = 'motra-cable-press', NF = 'nfpt-cable-press';
const CL = {
  c1: C(['CONSENSUS'], [BOS, MO], 'c1'),
  c2: C(['CONSENSUS'], [NF, BOS], 'c2'),
  c3: C(['CONSENSUS'], [NF], 'c3'),
  c4: C(['CONSENSUS'], [NF], 'c4'),
  c5: C(['CONSENSUS'], [NF], 'c5'),
  c6: C(['CONSENSUS'], [NF, BOS], 'c6'),
  lock: C(['CONSENSUS'], [MO, NF], 'c17, c5'),
  jerk: C(['CONSENSUS'], [NF, BOS], 'c7, c8'),
  brace: C(['CONSENSUS'], [NF, BOS], 'c6, c7'),
  stance: C(['CONSENSUS'], [BOS, MO, NF], 'c2, c4, c6'),
  flare: C(['CONSENSUS', 'DATA'], [NF, BOS, 'kolber2010'], 'c7, c13'),
  heavy: C(['CONSENSUS'], [NF, BOS, 'acsm2009'], 'c7, c14'),
  trunk: C(['DATA'], ['santana2007', 'calatayud2014'], 'c10, c11'),
  width: C(['CONSENSUS'], [NF, BOS], 'c3, c7'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact zone and the wrist range DERIVED at import from the push key's convention text, so they cannot
// drift from it. pairs.mjs CONVENTIONS['ga:push-heel'] (tools/plates/library/hands/pairs.mjs:24) reads 'GA 3.1 push: heel
// of the palm, low, over the forearm; extension 0 to 15'. HandContact names the zone 'heel of the palm' as 'heel'
// (src/howto/content-types.ts HandContact); a convention that names no mapped zone throws. pairs.mjs is not imported
// (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text is copied here and pinned
// against the live convention by the supervisor's test (lib_triceps_pushdown's form).
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
// The thumb DERIVED from golden B's push row (machine_chest_press.howto.mjs:252: thumb.mode 'wrapped'), copied and
// pinned against the live file by the supervisor's test; a value that is not a ThumbMode throws.
const PUSH_THUMB = 'wrapped';   // machine_chest_press.howto.mjs:252
const THUMB = ['wrapped', 'thumbless', 'hook'].includes(PUSH_THUMB) ? PUSH_THUMB : undefined;
if (!CONTACT || !EXT || !THUMB) throw new Error(`lib_cable_chest_press: no mapped push contact, range or thumb: ${PUSH_HEEL} / ${PUSH_THUMB}`);
const CONV_THUMB = C(['CONVENTION'], ['push-default'], 'card grip.thumb: "Not given by any cable press source read (push archetype default)"; golden B\'s push default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (staggered stance, handles at the nipple line; c2, c3, c4), the end (arms
// almost straight; c3, c5) and the spec's Mistake merged over the end, as the engine draws it (card plate.mistake c17,
// c5: the elbows locked straight).
// 'arch' (card zoom cable-press-stance Wrong, c6: "Lower back arched"): the start pose with the lumbar spine extended
// ARCH (trunk -ARCH; the hands held at the start handles by reach IK, the feet planted), so only the back changes. The
// card Wrong's second half ("handles up at the collarbone", c4) is not drawn; it is shown in the plate callout
// `height`'s cue ("not the collarbone").
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent golden B's hanging_leg_raise PELVIS_WRONG trunk -10 to
// -15 and lib_plank's SAG): ARCH 15 deg sizes the arch; no card gives it, no number appears in user copy; the layers
// panel judges it.
const ARCH = 15;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const ARCHED = { trunk: -ARCH };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  lock: { pose: { ...END, ...MIS } },
  arch: { pose: { ...START, ...ARCHED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `cable-press-handle` (D-SHIP-C3 gap-key, above). The posture zoom is in the
// zoom shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'cable-press-stance', chip: 'Back', heading: 'Back position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's low back for both halves; the Wrong is the
    // arch still drawn alone (solid), as `stills.arch`.
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -10] }, sizePx: 190 },
    right: 'start',
    wrong: { base: 'start', pose: ARCHED, solid: true },
    callout: {
      right: { text: 'Spine neutral', anchor: 'lumbar' },
      wrong: { text: 'Low back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Staggered stance, spine neutral, handles at nipple height.',   // c2, c6, c4
      wrong: 'Lower back arched.',                                          // c6
    },
    alt: {
      right: 'Side view, start of the press. Staggered stance, the back neutral, handles at the nipple line.',
      wrong: 'Side view, start of the press. The lower back arches, so the chest tips back over the hips.',
    },
    feelRow: 'lower-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest is the main mover.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps.' },
    { muscleId: 'triceps', plain: 'The backs of the arms help.' },
  ],
  textOnly: [   // named in the text, never painted (C2: the map draws core on the serratus); D-SHIP-Q7, as lib_push_up
    { muscleId: 'core', plain: 'Standing presses load the trunk to keep you stable.', claim: CL.trunk },
  ],
  watch: [],   // the card's watch is core (c10, c11), shown text-only above
  feelLine: 'You should feel this in your chest, front shoulders and the backs of your arms.',
  rows: [
    // The card's first two rows (the target muscles; the trunk working) have no fix, so they are left out: the feel
    // line and feel.textOnly say them (D-SHIP-Q16).
    { key: 'lower-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      means: 'You are arching your back.',
      fix: 'Keep your spine neutral and brace your abs.',
      zoom: 'cable-press-stance', redFlag: 'back', claim: CL.c6 },
    { key: 'shoulder', where: 'Shoulder pain', at: { muscles: ['front_delts'] },
      means: 'You grip much wider than shoulder width, or flare your elbows.',
      fix: 'Keep your elbows at a 45-degree angle.',
      redFlag: 'shoulder', claim: CL.flare },
  ],
  claim: C(['CONSENSUS', 'DATA'], ['sl-cable-press', 'santana2007', 'calatayud2014'], 'c9, c10, c11'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lock', title: 'Locking the elbows', claim: CL.lock,
    fix: 'Extend your arms without locking the elbows.' },
  { key: 'arch', title: 'Arching the lower back', zoom: 'cable-press-stance', claim: CL.c6,
    fix: 'Keep your spine neutral and brace your abs.' },
  { key: 'jerk', title: 'Jerking the body, too heavy', claim: CL.jerk,
    fix: 'Choose a weight you can press with the body still.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Wide grips and flared elbows stress the shoulder, a common injury site in lifting.', claim: CL.flare },
  { key: 'heavy', text: 'Too much weight costs form and raises injury risk. Add weight in small steps.', claim: CL.heavy },
];

export default {
  schema: 1,
  id: 'lib_cable_chest_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3: the d-handle key lists cable_chest_press in GAPS (c3 names no bend direction); the grip copy carries c3 and c7.',
    orientation: 'neutral',    // c3: a neutral (hammer) grip is suggested
    handle: 'd-handle',        // c1: single handles (the spec's single handle)
    loadAxis: 'along-forearm', // golden B's push default (machine_chest_press handling)
    overBody: false,
    width: { text: 'Handles just outside shoulder width, not much wider.', claim: CL.width },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION: push default, DERIVED above; the card gives no thumb
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (D-SHIP-W6-PALMS), data only
    // c3 gives no degrees ("wrists lined up with the elbows"). EXT is the push key's convention range, read above.
    wrist: { ext: EXT, limitText: 'Keep your wrists lined up with your elbows.',
      claim: C(['CONSENSUS', 'CONVENTION'], [NF, 'ga-push-heel'], 'card c3. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom cable-press-handle wrong (c3). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'wrist-bent', label: 'Wrist bent', pose: {}, markers: [], alt: 'Wrist bent out of line with the elbow.' },
    ],
    gripLine: 'Single handles, neutral grip, just outside shoulder width. Press straight ahead, pushing through the palms.',
    cue: 'Push through the palms.',   // c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set both pulleys at chest height with single handles.', claim: CL.c1 },
    { kind: 'position', text: 'Stand a foot or two from the cables, a handle per hand.', claim: CL.c1 },
    { kind: 'position', text: 'Step into a staggered stance, feet planted.', zoom: 'cable-press-stance', claim: CL.c2 },
    { kind: 'grip', text: 'Handles just outside shoulders, elbows just below 90 degrees, wrists over elbows.', claim: CL.c3 },
    // D-TEXT-GOLDEN: card posture c7 (shoulders down, not shrugged) is shown here with c6's step.
    { kind: 'brace', text: 'Brace your abs and glutes, spine neutral, shoulders down.', zoom: 'cable-press-stance', claim: CL.brace },
  ],
  posture: [
    { key: 'stance', label: 'Staggered stance', detail: 'Staggered stance, feet planted.', anchor: { landmark: 'toe.r', pose: 'start' }, claim: CL.c2 },
    { key: 'spine', label: 'Spine neutral', detail: 'Spine neutral, abs and glutes braced.',
      anchor: { landmark: 'lumbar', pose: 'start' }, zoom: 'cable-press-stance', claim: CL.c6 },
    { key: 'height', label: 'Handles at nipples', detail: 'Handles back to about nipple height.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c4 },
    { key: 'wrists', label: 'Wrists over elbows', detail: 'Wrists in line with the elbows.', anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c3 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down, not shrugged.', anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: C(['CONSENSUS'], [NF, BOS], 'c7') },
    { key: 'lockout', label: 'No lockout', detail: 'Elbows almost straight at the front, not locked.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['cable-press-stance', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Pulleys at chest height, single handles. Staggered stance, a foot or two in front.',
    mistakeLine: "Keep your spine neutral. Press out without locking the elbows.",
    cueLine: 'Push through the palms.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'back'],   // the card's redFlags, in its order (D-SHIP-W6-BACKREACH)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_chest_press.json', rev: 1 },
};
