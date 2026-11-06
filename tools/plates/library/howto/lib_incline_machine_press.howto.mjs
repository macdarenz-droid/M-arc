// LIB-SHIP W3: the How-to content of lib_incline_machine_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/incline_machine_press.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, INHERIT_MAP lib_incline_machine_press, D-LIB9a-MAP): the card's inherit[] delegates grip.type,
// grip.thumb, grip.handContact, grip.wrist, posture['Straight wrist, forearm behind the handle'], posture['Feet flat, hips
// back'] and zooms['hand'] to machine_chest_press. Those paths (handling.handle, handling.thumb.mode, handling.pose.thumb,
// handling.contact, handling.wrist, posture[key=wrist], posture[key=feet], zooms[key=hand]) are written leaf-equal to the
// parent's shipped content (family.mjs familyRefusal, `===`); each claim cites this card (c1, c4), not the parent.
// Hand zoom: the parent's (inherited); no pair key, no no-zoom entry. Hint: text A (machine_chest_press's shipped cue).
// Card zooms: 'shoulder blades' is the plate's own Mistake (blades off the pad, c5); 'start height' is a text checkpoint
// (D-SHIP-TEXTZOOM; precedent: machine_chest_press's "Start depth", text only).
// Red flags: the card's redFlags (shoulder, elbow, wrist), golden B's shared boxes.
import plateSpec from '../specs/incline_machine_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-incline-press': { cite: 'Seated Incline Cable Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/167/seated-incline-cable-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-chest-press': { cite: 'Seated Chest Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  rodriguezridao2020: { cite: 'Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/33049982/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The shared boxes' own sources (layers/howto/shared.mjs), as golden B lists them: the card's redFlags.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};
// Not cited: c8 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-incline-press';
const CL = {
  c1: C(['CONSENSUS', 'MECH'], [ACE], 'c1'),
  c2: C(['CONSENSUS', 'MECH'], [ACE], 'c2'),
  c3: C(['CONSENSUS', 'MECH'], [ACE], 'c3'),
  c4: C(['CONSENSUS', 'MECH'], [ACE], 'c4'),
  c5: C(['CONSENSUS', 'MECH'], [ACE, 'ace-chest-press'], 'c5'),
  c6: C(['DATA', 'MECH'], ['rodriguezridao2020'], 'c6'),
  c7: C(['DATA', 'MECH'], ['rodriguezridao2020'], 'c7'),
  c9: C(['CONSENSUS'], ['acsm2009'], 'c9'),
  // card inherit[]: the field is machine_chest_press's, true here by c1 (the card's own claim for each inherit entry)
  inh: C(['CONSENSUS', 'MECH'], [ACE], 'c1; inherited from machine_chest_press (card inherit[], INHERIT_MAP)'),
  inhFeet: C(['CONSENSUS', 'MECH'], [ACE], 'c1, c4; inherited from machine_chest_press (card inherit[], INHERIT_MAP)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// machine_chest_press's hand values (exercises/machine_chest_press.howto.mjs RIGHT_POSE, BENT_BACK), inherited leaf-equal
// through INHERIT_MAP (handling.pose.thumb, zooms[key=hand]); written out, never imported, so the family check compares
// two sources.
const RIGHT_POSE = {
  view: 'radial', forearm: 90, wrist: { ext: 8, dev: 0 }, contactAt: 0.3, fingers: { curl: 1 }, thumb: 'wrapped',
  squeeze: 'firm', handle: { profile: 'press-horizontal', axis: 'across', diameterMm: 32 }, load: { kind: 'push' },
};
const BENT_BACK = {
  key: 'fingers-bent-back', label: 'Wrist bent back',
  pose: { wrist: { ext: 35, dev: 0 }, contactAt: 1.05, fingers: { curl: 0.92 }, thumb: 'loose' },
  markers: ['lever-arc'],
  alt: 'Horizontal handle, side view. The handle has slid into the fingers, thumb loose. The wrist is bent far back. The push passes behind the wrist, bending it further.',
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses; 'blades-off' is the plate's own Mistake (c5: shoulder blades round forward off the pad).
const END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  'blades-off': { pose: { ...END, ...plateSpec.mistake.pose } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The hand zoom is machine_chest_press's, leaf-equal (zooms['hand'] inherited; heading byte-equal, D-SHIP-Q3). The posture
// zoom is in the zoom shell's shape (callout with an anchor at the landmark it names, no guide mark).
const zooms = [
  {
    key: 'hand', chip: 'Hand', chipCaption: 'Heel of palm', heading: 'Hand: right and wrong', kind: 'hand',
    hand: {
      right: RIGHT_POSE,
      wrong: [BENT_BACK],
      camera: 'side',
      panelHeight: 150,
      note: 'Vertical handles: the same rule.',
      notes: { right: 'Heel of palm', wrong: 'Wrist bent back' },
    },
    caption: {
      right: 'Heel of your palm, thumb wrapped, wrist straight.',
      wrong: 'Handle in your fingers, wrist bent back, thumb loose.',
    },
    alt: {
      right: 'Horizontal handle, side view. The handle sits on the heel of the hand, thumb wrapped. Wrist straight, knuckles in line with the forearm. The push runs straight down the forearm.',
      wrong: BENT_BACK.alt,
    },
    feelRow: 'wrist',
  },
  {
    key: 'blades', chip: 'Blades', heading: 'Shoulder blades', kind: 'posture',   // card zoom key: shoulder blades
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's upper back; the Wrong is the plate's own
    // Mistake dashed over the end pose, as `stills['blades-off']`.
    crop: { center: { at: 'backUpper', pose: 'right', off: [20, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: plateSpec.mistake.pose },
    callout: {
      right: { text: 'Blades on pad', anchor: 'backUpper' },
      wrong: { text: 'Blades off pad', anchor: { at: 'backUpper', pose: 'mistake' } },
    },
    caption: {
      right: 'Blades flat on the pad, hands at forehead height.',
      wrong: 'Upper back rounded forward off the pad.',
    },
    alt: {
      right: 'Side view, top of the press. Upper back and shoulder blades flat on the pad. Arms long, hands about forehead height.',
      wrong: 'Side view, top of the press. The upper back rounds forward off the pad and the shoulders roll forward.',
    },
    feelRow: 'front-shoulders',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'upper_chest', plain: 'The upper chest, just under the collarbone, works most.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders help press.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm straightens the elbows.' },
    { muscleId: 'chest', plain: 'The rest of the chest works too.' },
  ],
  watch: [
    { muscleId: 'front_delts', plain: 'Steeper presses shift work from the chest to the front of the shoulders.' },
  ],
  feelLine: 'You should feel this in your upper chest.',
  rows: [
    { key: 'front-shoulders', where: 'Front of the shoulders', at: { muscles: ['front_delts'] },
      means: 'Watch for your shoulder blades rolling off the pad at the top.',
      fix: 'Keep the blades on the pad and stop the press there.',
      zoom: 'blades', redFlag: 'shoulder', claim: CL.c5 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Watch for your lower back arching off the pad.',
      fix: 'Brace and keep only the natural low-back curve.',
      claim: CL.c4 },
    { key: 'elbows', where: 'Elbows', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Watch for locking your elbows at the top.',
      fix: 'Stop just short of lockout.',
      redFlag: 'elbow', claim: CL.c3 },
    { key: 'wrist', where: 'Wrist', at: { parts: HANDS },
      means: 'Watch for the wrist bending out of line with the forearm.',
      fix: 'Keep the wrist in line with the forearm.',
      zoom: 'hand', redFlag: true, claim: CL.c1 },
  ],
  claim: CL.c6,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'blades', title: 'Blades rolling off the pad', zoom: 'blades', claim: CL.c5,
    fix: 'Stop the press with the blades still on the pad.' },
  { key: 'arch', title: 'Arching the lower back', claim: CL.c4,
    fix: 'Brace and keep only the natural low-back curve.' },
  { key: 'lock', title: 'Snapping the elbows locked', claim: CL.c3,
    fix: 'Stop just before the elbows lock, pause, then lower slowly.' },
];
const RISKS = [
  { key: 'blades', text: 'Blades rolling off the pad leave the shoulder blades less stable.', claim: CL.c5 },
  { key: 'arch', text: 'Arching the lower back off the pad is a fault to avoid.', claim: CL.c4 },
];

export default {
  schema: 1,
  id: 'lib_incline_machine_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    handle: 'machine-grip',        // inherited (grip.type -> handling.handle)
    loadAxis: 'along-forearm',     // the card's inherit why for grip.handContact: the load runs along the forearm
    overBody: false,
    thumb: { mode: 'wrapped', claim: CL.inh },   // inherited (grip.thumb)
    contact: 'heel',               // inherited (grip.handContact)
    // Q-W3-7 (#383 6631278086): ext and dev inherited (grip.wrist); limitText restates the inherited grip.wrist only
    // (neutral, in line with the forearm), not the parent's 'go lighter' line (LR-34 gap on this card).
    wrist: { ext: [0, 10], dev: [-10, 10], limitText: 'Keep your wrist in line with your forearm.', claim: CL.inh },
    pose: RIGHT_POSE,              // inherited (handling.pose.thumb is in the map)
    faults: [BENT_BACK],
    gripLine: 'Push through the heel of your palm, wrist in line with your forearm. Thumbs wrapped round the handles.',
    cue: 'Heel of palm, wrist straight.',   // hint text A (machine_chest_press's shipped cue; grip inherited)
  },
  contacts: ['seat-back'],
  setup: [
    { kind: 'adjust', text: 'Set the seat so your hands start level with your upper chest.', claim: CL.c1 },
    { kind: 'position', text: 'Sit back against the pad, feet planted.', claim: CL.c1 },
    { kind: 'grip', text: 'Handle in the heel of your palm, wrist straight.', zoom: 'hand', claim: CL.inh },
    { kind: 'brace', text: 'Brace, keep the natural low-back curve, shoulders back and down.', zoom: 'blades', claim: CL.c4 },
    { kind: 'load', text: 'One or two reps over target? Add 2 to 10 percent.', claim: CL.c9 },
  ],
  posture: [
    // 'start height' card zoom: a text checkpoint (D-SHIP-TEXTZOOM; machine_chest_press "Start depth" precedent).
    { key: 'start', label: 'Upper-chest start', detail: 'Handles start level with your upper chest. Not at mid-chest or lower.',
      anchor: { at: 'grip.r', pose: 'start' }, claim: CL.c1 },
    { key: 'top', label: 'Forehead height', detail: 'Press up and forward until your hands are about level with your forehead.',
      anchor: { at: 'grip.r', pose: 'end' }, claim: CL.c2 },
    { key: 'blades', label: 'Blades on pad', detail: 'Back and shoulder blades stay on the pad all set.',
      anchor: { at: 'backUpper', pose: 'end' }, zoom: 'blades', claim: CL.c5 },
    { key: 'soft', label: 'Soft elbows', detail: 'Elbows straight but not locked at the top. Lower slowly to the upper chest.',
      anchor: { at: 'elbow.r', pose: 'end' }, claim: CL.c3 },
    { key: 'wrist', label: 'Straight wrist', detail: 'Knuckles, wrist and forearm form one straight line. The forearm points the way the handle moves. The handle sits in the heel of the palm.',
      anchor: { at: 'grip.r', pose: 'end' }, zoom: 'hand', claim: CL.inh },
    { key: 'feet', label: 'Sit right back', detail: 'Both feet flat on the floor. Hips pushed back into the seat and back pad, no bridging.',
      anchor: { at: 'ankle.r', pose: 'end' }, claim: CL.inhFeet },
  ],
  feel,
  zooms,
  chips: ['hand', 'blades', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hands start level with your upper chest. Back and shoulder blades on the pad, feet planted.',
    mistakeLine: 'Never roll your shoulder blades off the pad to finish the press. Stop with them on the pad.',
    cueLine: 'Blades on the pad.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'elbow', 'wrist'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/incline_machine_press.json', rev: 1 },
};
