// LIB-SHIP W3: the How-to content of lib_shoulder_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/shoulder_press.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, INHERIT_MAP lib_shoulder_press, D-LIB9a-MAP): the card's inherit[] delegates grip.thumb,
// grip.handContact, grip.wrist and zooms['hand'] to machine_chest_press. Those paths (handling.thumb.mode,
// handling.pose.thumb, handling.contact, handling.wrist, zooms[key=hand]) are written leaf-equal to the parent's shipped
// content (family.mjs familyRefusal, `===`); each claim cites this card (c2), not the parent. The handle is this card's
// own (c2, c7). Hand zoom: the parent's (inherited); no pair key, no no-zoom entry. Hint: text A (shipped).
// Card zooms: 'low back' is the plate's own Mistake (low back arched off the pad, c4, c5); 'seat height' is a text
// checkpoint (D-SHIP-TEXTZOOM; precedent: machine_chest_press's "Start depth", text only).
// Tier A: the card's way-out gap (no sourced way to fail a rep safely) is left out, not invented; SHIP W3 PLAN RULED
// sends it to the safety checker (Q-W2-3 form). Palm direction is not sourced, so no orientation is set.
// Red flags: the card's redFlags (shoulder, back, elbow): golden B's shoulder and elbow boxes, the back box.
import plateSpec from '../specs/shoulder_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-shoulder-press': { cite: 'Seated Shoulder Press, ACE Exercise Library (machine)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/186/seated-shoulder-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-close-shoulder-press': { cite: 'Seated Machine Close-Grip Shoulder Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/187/seated-machine-close-grip-shoulder-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  paoli2010: { cite: 'Influence of different ranges of motion on selective recruitment of shoulder muscles in the sitting military press: an electromyographic study', url: 'https://pubmed.ncbi.nlm.nih.gov/20508462/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kim2026: { cite: 'Effects of Mind-Muscle Connection on Muscle Activity During Machine-Based Shoulder Press in Untrained Individuals', url: 'https://pubmed.ncbi.nlm.nih.gov/42194886/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  bull2010: { cite: 'Electromyographic validation of the muscles deltoid (anterior portion) and pectoralis major (clavicular portion) in military press exercises with open grip', url: 'https://pubmed.ncbi.nlm.nih.gov/20718330/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The shared boxes' own sources (layers/howto/shared.mjs, shared/back-box.mjs), as golden B and W2 list them.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c12 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-shoulder-press';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], ['ace-close-shoulder-press'], 'c7'),
  c8: C(['DATA', 'MECH'], ['paoli2010'], 'c8'),
  c9: C(['DATA'], ['kim2026'], 'c9'),
  c10: C(['DATA', 'WEAK'], ['bull2010'], 'c10'),
  c11: C(['DATA', 'MECH'], ['macdougall1985'], 'c11'),
  c13: C(['CONSENSUS'], ['acsm2009'], 'c13'),
  back: C(['CONSENSUS'], [ACE], 'c4, c5'),
  breath: C(['CONSENSUS', 'DATA'], [ACE, 'macdougall1985'], 'c5, c11'),
  // card inherit[]: the field is machine_chest_press's, true here by c2 (full grip, thumbs wrapped, wrists in line)
  inh: C(['CONSENSUS'], [ACE], 'c2; inherited from machine_chest_press (card inherit[], INHERIT_MAP)'),
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
// From the plate spec's own poses; 'arch' is the plate's own Mistake (c4, c5: the low back arches off the pad).
const END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: { ...END, ...plateSpec.mistake.pose } },
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
    // W3 layers fix (#384 6648454032, content K1 c2): no wrist feel row (the card has none), so no feelRow link.
  },
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',   // card zoom key: low back
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's low back; the Wrong is the plate's own
    // Mistake dashed over the end pose, as `stills.arch`.
    crop: { center: { at: 'lumbar', pose: 'right', off: [10, -10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: plateSpec.mistake.pose },
    callout: {
      right: { text: 'Back on pad', anchor: 'lumbar' },
      wrong: { text: 'Low back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Natural low-back curve on the pad, elbows soft.',
      wrong: 'Low back arched away from the pad.',
    },
    alt: {
      right: 'Side view, top of the press. The low back keeps its natural curve against the pad, arms overhead.',
      wrong: 'Side view, top of the press. The low back arches away from the pad to push the handles up.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders work most.' },
    { muscleId: 'side_delts', plain: 'The side of the shoulders work too.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps press.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back should stay quiet. An ache there means it is arching.' },
  ],
  // D-TEXT-GOLDEN (#379 6637607604): posture 'breath' (c5, c11) moved from the feel line to a setup step (W3 PANEL FIX 2, #384 6649416891: no movement cues under the feel heading).
  feelLine: 'You should feel this in the fronts and sides of your shoulders.',
  rows: [
    { key: 'shoulder', where: 'Sharp shoulder pinch', at: { muscles: ['front_delts'] },
      means: 'Watch for letting the handles drop on the way down.',
      fix: 'Stop the set.',
      redFlag: 'shoulder', claim: CL.c6 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Watch for the low back arching off the pad.',
      fix: 'Brace, keep the natural curve, and lower the weight.',
      zoom: 'low-back', redFlag: 'back', claim: CL.back },
    { key: 'elbows', where: 'Elbows', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Your elbows lock at the top.',
      fix: 'Stop just short of lockout.',
      redFlag: 'elbow', claim: CL.c6 },
  ],
  claim: C(['DATA', 'WEAK'], ['bull2010', 'paoli2010', 'kim2026'], 'c10, c8, c9'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'drop', title: 'Letting the handles drop', claim: CL.c6,
    fix: 'Draw them down slowly with your back muscles.' },
  { key: 'arch', title: 'Arching the low back', zoom: 'low-back', claim: CL.back,
    fix: "Brace, keep the natural curve. Can't press without arching? Lower the weight." },
  { key: 'lock', title: 'Snapping the elbows locked', claim: CL.c6,
    fix: 'Stop just before the elbows lock, pause, then lower.' },
];
const RISKS = [
  { key: 'overhead', text: 'The shoulder is less stable overhead. Never let the handles drop.', claim: CL.c6 },
  { key: 'arch', text: 'Arching the low back off the pad to finish reps.', claim: CL.back },
  { key: 'pressure', text: 'Very heavy lifts with breath holding sent blood pressure very high.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_shoulder_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    handle: 'machine-grip',        // c2: full grip on the machine's handles (c7: the close handles are drawn)
    loadAxis: 'along-forearm',     // the push archetype's load line, as the inherited heel-of-palm contact
    overBody: true,                // the handles are pressed overhead (card plate.end, c6)
    width: { text: 'Elbows slightly in front of your body, not straight out to the sides.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: CL.inh },   // inherited (grip.thumb)
    contact: 'heel',               // inherited (grip.handContact)
    // Q-W3-7 (#383 6631278086): ext and dev inherited (grip.wrist); limitText from this card's c2, not the parent's (LR-34 gap).
    wrist: { ext: [0, 10], dev: [-10, 10], limitText: 'Keep your wrists in line with your forearms.', claim: CL.c2 },
    pose: RIGHT_POSE,              // inherited (handling.pose.thumb is in the map)
    faults: [BENT_BACK],
    gripLine: 'Full grip on the handles, thumbs wrapped, wrists in line with your forearms.',
    cue: 'Heel of palm, wrist straight.',   // hint text A (machine_chest_press's shipped cue; grip inherited)
  },
  contacts: ['seat-back'],
  setup: [
    { kind: 'adjust', text: 'Set the seat: handles at or just above shoulder height.', claim: CL.c1 },
    { kind: 'position', text: 'Sit back against the pad, feet planted. Breathe out as you press.', claim: C(['CONSENSUS', 'DATA'], [ACE, 'macdougall1985'], 'c4, c5, c11') },
    { kind: 'grip', text: 'Full grip, thumbs round, wrists straight.', zoom: 'hand', claim: CL.c2 },
    { kind: 'brace', text: 'Brace, keep the natural low-back curve, shoulders back and down.', zoom: 'low-back', claim: CL.c4 },
    { kind: 'load', text: 'One or two reps over target? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    // 'seat height' card zoom: a text checkpoint (D-SHIP-TEXTZOOM; machine_chest_press "Start depth" precedent).
    { key: 'height', label: 'Handles at shoulders', detail: 'At the start the handles sit level with or just above your shoulders. Never below.',
      anchor: { at: 'grip.r', pose: 'start' }, claim: CL.c1 },
    { key: 'back', label: 'No back arch', detail: 'Keep the natural low-back curve against the pad as you press.',
      anchor: { at: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.back },
    { key: 'elbows', label: 'Elbows forward', detail: 'Elbows slightly in front of the body, not straight out to the sides.',
      anchor: { at: 'elbow.r', pose: 'start' }, claim: CL.c3 },
    { key: 'breath', label: 'Breathe out', detail: "Breathe out as you press. Don't hold your breath through the set.",
      anchor: { at: 'chest', pose: 'end' }, claim: CL.breath },
    { key: 'head', label: 'Head in line', detail: 'Head in line with the spine.',
      anchor: { at: 'head', pose: 'end' }, claim: CL.c5 },
    { key: 'soft', label: 'Soft elbows', detail: 'Elbows straight but not locked at the top. Draw the handles down slowly.',
      anchor: { at: 'elbow.r', pose: 'end' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['hand', 'low-back', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    // D-TEXT-GOLDEN (#379 6637607604): posture 'elbows' (c3) and 'head' (c5) are shown here; feet planted and brace stay in setup steps 2 and 4.
    setupLine: 'Handles at or just above shoulder height, elbows slightly in front. Back on the pad, head in line.',
    mistakeLine: 'Never let the handles drop on the way down. Draw them down slowly with your back muscles.',
    cueLine: 'Back on the pad.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'back', 'elbow'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/shoulder_press.json', rev: 1 },
};
