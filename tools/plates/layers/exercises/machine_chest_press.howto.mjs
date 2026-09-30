// How-to content for the machine chest press (lib_machine_chest_press): grip, posture close-ups, where to feel it.
// Shape: grip/GRIP-AND-FEEL-ARCHITECTURE.md 4.1-4.4 (HowTo, HandlingSpec, ZoomSpec, FeelSpec, SetupStep,
// PostureCheckpoint). Content: the verified card grip/research/machine_chest_press.json, with the corrections the
// architecture made in appendix A1 (feel line, rows 1-3, red-flag wording). GENERAL.md wording is not used.
// Render check: node exercises/machine_chest_press.howto-render.mjs  ->  out/machine_chest_press-howto-*.png
//
// Additions to the architecture's types, used by the mockup only (marked "mockup" below):
//   ZoomSpec.callouts   one callout per crop ({ right, wrong }: text + the mark it names). The text is printed under
//                       "Right" / "Wrong" as on the hand zoom; the mark (guide) is drawn in the crop
//   ZoomSpec.crop.pose  the posture crops are built from still poses of the plate spec (see `stills`)
//   HandPose.thumb      'loose' (a thumb resting beside the handle, not round it): the hand renderer has it,
//                       the architecture's ThumbMode list does not yet
import plateSpec from './machine_chest_press.mjs';
// RED_FLAG (and any other shared safety copy) comes from the one shared module (plan S-2 condition 4); re-exported
// for the render scripts. DISCLAIMER is shown once per sheet by the page, from the same module.
import { RED_FLAG } from '../howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (registry entries this sheet cites) --
 * `use` is the evidence label FOR THIS USE (architecture 3: a tag rates the source for this claim, not the paper).
 * `access` is what the card's verifier says it read; null = the card does not say, to be filled by the verifier. */
export const SOURCES = {
  'ace-chest-press': { cite: 'ACE Exercise Library, Seated Chest Press', url: 'https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/',
    kind: 'guideline', access: 'full', checked: null, use: 'CONSENSUS' },
  muyor2023: { cite: 'Muyor JM, Rodriguez-Ridao D, Oliva-Lozano JM. Muscle activity, horizontal bench press vs seated chest press, several grips. J Hum Kinet 2023;87:23-34', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10203828/',
    kind: 'peer-reviewed', access: 'full', checked: null, use: 'DATA' },
  weiss1995: { cite: 'Weiss ND et al. Position of the wrist associated with the lowest carpal-tunnel pressure. J Bone Joint Surg Am 1995;77(11):1695-9', url: 'https://pubmed.ncbi.nlm.nih.gov/7593079/',
    kind: 'peer-reviewed', access: null, checked: null, use: 'MECH/WEAK', note: 'Nerve-pressure study, not lifting.' },
  nance2017: { cite: 'Nance EM et al. Dorsal wrist pain in the extended wrist-loading position: an MRI study. J Wrist Surg 2017;6(4):276-279', url: 'https://pubmed.ncbi.nlm.nih.gov/29085728/',
    kind: 'peer-reviewed', access: null, checked: null, use: 'WEAK', note: 'Push-ups, planks and yoga; association in patients, not cause; no pressing handles.' },
  fees1998: { cite: 'Fees M, Decker T, Snyder-Mackler L, Axe MJ. Upper extremity weight-training modifications for the injured athlete. Am J Sports Med 1998;26(5):732-42', url: 'https://pubmed.ncbi.nlm.nih.gov/9784824/',
    kind: 'peer-reviewed', access: null, checked: null, use: 'CONSENSUS', note: 'Clinical perspective article, not a trial.' },
  snyder2012: { cite: 'Snyder BJ, Fry WR. Effect of verbal instruction on muscle activity during the bench press. J Strength Cond Res 2012;26(9):2394-400', url: 'https://pubmed.ncbi.nlm.nih.gov/22076100/',
    kind: 'peer-reviewed', access: null, checked: null, use: 'WEAK', note: 'Bench press, not the machine: supports the chest-focus cue on lighter sets only.' },
  calatayud2016: { cite: 'Calatayud J et al. Importance of mind-muscle connection during progressive resistance training. Eur J Appl Physiol 2016;116(3):527-33', url: 'https://pubmed.ncbi.nlm.nih.gov/26700744/',
    kind: 'peer-reviewed', access: null, checked: null, use: 'WEAK', note: 'Bench press; the focus effect held with light to moderate weights, not heavy ones.' },
  'barbell-logic-grip': { cite: 'Barbell Logic, Bench Press Grip Tips', url: 'https://barbell-logic.com/bench-press-grip-tips/',
    kind: 'coach', access: null, checked: null, use: 'CONSENSUS', note: 'Written for the barbell bench; heel-of-palm placement.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',   // RED_FLAG_ELBOW source
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
};
// Left out on purpose (card evidence notes): Palmer and Werner 1984 (the "80 % through the radius" figure is not in
// its abstract), Mayo Clinic dorsal wrist impingement (403 to the verifier).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  ace: C(['CONSENSUS'], ['ace-chest-press']),
  wrist: C(['CONSENSUS', 'MECH', 'WEAK'], ['ace-chest-press', 'barbell-logic-grip', 'weiss1995', 'nance2017'],
    'Heel of palm and straight wrist: ACE plus coaching consensus. 0-10 deg target leans on Weiss 1995 (nerve pressure, not lifting). The 15-20 deg limit is coaching consensus. Nance 2017 is association only.'),
  thumb: C(['CONSENSUS'], ['ace-chest-press'], 'ACE: full grip, thumbs around the handles. The "stops the handle rolling into the fingers" mechanism is consensus.'),
  handles: C(['DATA', 'CONSENSUS'], ['muyor2023'], 'No chest difference between handle types (Muyor 2023); choosing vertical for a sore wrist is consensus.'),
  seat: C(['CONSENSUS'], ['ace-chest-press'], 'No study measures seat height on this machine; ACE setup plus consensus.'),
  depth: C(['CONSENSUS'], ['ace-chest-press', 'fees1998']),
  feel: C(['DATA', 'CONSENSUS'], ['muyor2023', 'ace-chest-press'], 'The feel target is coaching, not EMG: front delts are about as active as the chest in Muyor 2023.'),
  cue: C(['WEAK'], ['snyder2012', 'calatayud2016'], 'Bench-press studies; framed for lighter sets.'),
  consensus: C(['CONSENSUS'], [], 'Coaching consensus (card).'),
  nhs: C(['CONSENSUS'], ['nhs-wrist-pain']),
};


/* ------------------------------------------------------------------------------------------------ hand ---------- */
// Right: the owner's photo 2 (wrist straight, knuckles in line with the forearm, handle in the heel of the palm).
// Wrong: the owner's photo 1 (wrist bent back ~35 deg, crease on the back of the wrist, handle in the finger bends,
// thumb loose). Owner decision 2026-09-30: his chest press used the HORIZONTAL handles (palms down), so the main
// close-up is the horizontal handle seen from the side (forearm pointing forward, as on the plate), where the wrist's
// back-and-forward bend lies flat on the screen. The vertical handle is a one-line note only.
const RIGHT_POSE = {
  view: 'radial', forearm: 90, wrist: { ext: 8, dev: 0 }, contactAt: 0.3, fingers: { curl: 1 }, thumb: 'wrapped',
  squeeze: 'firm', handle: { profile: 'press-horizontal', axis: 'across', diameterMm: 32 }, load: { kind: 'push' },
};
const BENT_BACK = {
  key: 'fingers-bent-back', label: 'Wrist bent back',
  pose: { wrist: { ext: 35, dev: 0 }, contactAt: 1.05, fingers: { curl: 0.92 }, thumb: 'loose' },
  markers: ['lever-arc'],
  alt: 'Horizontal handle, seen from the side: the handle has slid into the fingers, the wrist is bent far back and the thumb is loose. The push passes on the back-of-hand side of the wrist and bends it further back.',
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// Still poses for the posture crops, built from the plate spec's own poses (no new geometry). `seatDrop` lowers the
// seat, the back pad and the body together; the lever, the handles and the feet stay where they are.
const elbowUp = (reach, pole) => ({ r: { ...reach.r, pole }, l: { ...reach.l, pole: [-pole[0], pole[1], pole[2]] } });
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  // Seat too low (card mistake 2): 12 cm lower. The handles then start at shoulder-joint height, up at the collarbones
  // (render report: handle 12 cm above mid-chest). The card's wrong picture has "the elbow up near shoulder height":
  // the elbow pole turns out and up so the elbow sits 3 cm under the handle and the forearm runs almost level to it
  // (8 deg up in side view, render report). The plate's start pole would hang the elbow low with the forearm climbing
  // at about 40 deg, which reads as pushing upward, a different fault.
  'seat-low': { pose: { ...plateSpec.poses.start, reach: elbowUp(plateSpec.poses.start.reach, [-0.9, -0.1, -0.3]) }, seatDrop: 0.12 },
  // "Round and lock" (card mistake 3, the plate's own mistake pose): drawn solid in the Blades wrong crop.
  'round-lock': { pose: { ...plateSpec.poses.end, ...plateSpec.mistake.pose } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'hand', chip: 'Hand', chipCaption: 'Heel of palm', heading: 'Hand: right and wrong', kind: 'hand',
    hand: {
      right: RIGHT_POSE,
      wrong: [BENT_BACK],
      // Owner decision 2026-09-30 (he used the horizontal handles): the horizontal handle, seen from the side, is the
      // main pair; the vertical handle is only the one-line note below. One page (push).
      camera: 'side',
      panelHeight: 150,
      note: 'Vertical handles: the same rule. Handle in the heel of your palm, wrist straight.',
      notes: { right: 'Heel of palm', wrong: 'Wrist bent back' },   // mockup: the 1-3 word notes over each half
    },
    caption: {
      right: 'Handle in the heel of your palm, thumb wrapped, wrist straight.',
      wrong: 'Handle in your fingers, wrist bent back, thumb loose.',
    },
    alt: {
      right: 'Horizontal handle, seen from the side: the handle sits low in the palm on the heel of the hand, thumb wrapped round it, wrist straight, knuckles in line with the forearm. The push runs straight down the forearm.',
      wrong: BENT_BACK.alt,
    },
    feelRow: 'wrist',
  },
  {
    key: 'seat-height', chip: 'Seat height', heading: 'Seat height: right and wrong', kind: 'posture',
    crop: { center: { landmark: 'shoulder.r', pose: 'start', dx: 14, dy: 0 }, sizePx: 108 },
    right: 'start',
    wrong: { still: 'seat-low' },
    callouts: {   // mockup: one label per crop
      right: { text: 'Mid-chest', guide: 'handle-to-chest' },
      wrong: { text: 'Seat too low', guide: 'handle-to-chest' },   // names the fault, as the caption and card mistake 2 do
    },
    caption: {
      right: 'Handles meet the middle of your chest.',
      wrong: 'Seat too low: the handles sit up near your shoulders.',
    },
    alt: {
      right: 'Side view, start of the press. The handle is level with the middle of the chest, the elbow below the shoulder.',
      wrong: 'Side view, seat too low. The handle is level with the top of the chest, up near the shoulder, and the elbow is raised almost to handle height; the middle of the chest is well below it.',
    },
    feelRow: 'front-shoulders',
  },
  {
    key: 'blades', chip: 'Blades', heading: 'Shoulder blades: right and wrong', kind: 'posture',
    // wide enough for the pad, the shoulder, the elbow and the handle, so the locked elbow shows too
    // (dx 34 / size 150 cut the Wrong crop's dashed lever arm at the right edge: widened so it leaves at the top, as the
    // right crop's lever does)
    crop: { center: { landmark: 'shoulder.r', pose: 'end', dx: 44, dy: 6 }, sizePx: 168 },
    right: 'end',
    wrong: { still: 'round-lock', over: 'end' },   // mockup: the mistake pose dashed over the right pose
    callouts: {
      right: { text: 'On the pad', guide: 'pad-contact' },
      wrong: { text: 'Off the pad', guide: 'pad-gap' },
    },
    caption: {
      right: 'Shoulder blades stay on the pad, elbows still slightly bent.',
      wrong: 'Shoulders roll off the pad and the elbows lock straight.',
    },
    alt: {
      right: 'Side view, end of the press. Upper back and shoulder blades flat on the pad, arms long with a small bend at the elbow.',
      wrong: 'Side view, end of the press. The upper back rounds forward with a gap of about 4 cm to the pad, and the elbows are locked straight.',
    },
    feelRow: 'elbows',
  },
];
// The fourth chip, "Where to feel it", is added by the sheet for every exercise with a FeelSpec (2.1), so at most 3
// ZoomSpecs here. "Start depth" is a top-down view the engine cannot draw yet: it stays a text checkpoint.

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'];
const feel = {
  primary: [{ muscleId: 'chest', plain: 'Across the middle and lower chest, the big fan of muscle from the breastbone out to the armpit.' }],
  secondary: [
    { muscleId: 'upper_chest', plain: 'The top of the chest, just under the collarbone, works too.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm, mostly near the end of the push.' },
    { muscleId: 'front_delts', plain: 'The front of your shoulders help push, but they should not be where you feel it most.' },
  ],
  watch: [
    { muscleId: 'front_delts', plain: 'If the front of your shoulders burn more than your chest, your setup is usually off.' },
    { muscleId: 'upper_traps', plain: 'The tops of the shoulders and the neck should stay quiet. Shrugging means you have lost your shoulder position.' },
    { muscleId: 'forearms', plain: 'You will feel your grip working, but your wrist and forearm should never ache. An aching wrist usually means it is bending back.' },
  ],
  feelLine: 'You should feel this across the middle and lower chest. If the front of your shoulders is doing most of the work, set the seat so the handles line up with the middle of your chest.',
  rows: [
    // Known map limit (C2, misleading region): bodyMuscles.ts draws front_delts as a thin strip along the collarbone,
    // not on the shoulder cap, so this row's dashed outline sits on the collarbone. Fix belongs in the shared map path
    // (engine/bodymap-parts.mjs shoulder-front-left/right, from wt-arch src/svg/bodyMuscles.ts); no per-exercise workaround.
    { key: 'front-shoulders', where: 'Front of the shoulders', at: { muscles: ['front_delts'] },
      means: 'The handles are probably too high for your chest, or your shoulders are rolling off the pad.',
      fix: 'Set the seat so the handles line up with the middle of your chest. On most machines that means raising it.',
      zoom: 'seat-height', claim: CL.seat },
    { key: 'wrist', where: 'Wrist (top or back of the wrist)', at: { parts: HANDS },
      means: 'Your wrist is bending back and the handle has slid into your fingers. Often the weight is too heavy.',
      fix: 'Move the handle into the heel of your palm and wrap your thumb. Go lighter until your wrist stays straight.',
      zoom: 'hand', redFlag: true, claim: CL.wrist },
    { key: 'wrist-sore', where: 'Wrist sore before you start', at: { parts: HANDS },
      means: 'Pressing heavy on a sore wrist can make it worse.',
      fix: 'Use the vertical handles and go lighter. Stop the set if it hurts.',
      zoom: 'hand', redFlag: true,
      claim: C(['CONSENSUS'], ['nhs-wrist-pain'], 'NHS self-care: do not lift heavy things with wrist pain. Handle choice is consensus (card).') },
    // behind "More"
    { key: 'neck', where: 'Top of the shoulders or neck', at: { muscles: ['upper_traps'] },
      means: 'You are shrugging your shoulders up toward your ears as you push.',
      fix: 'Set your shoulders down and back into the pad before the first rep and keep them there.',
      claim: CL.ace },
    { key: 'triceps', where: 'Mostly the triceps, little chest', at: { muscles: ['triceps'] },
      means: 'You are cutting the reps short near lockout, so the arms do most of the work.',
      fix: 'Bring the handles all the way back to chest level on every rep, and think about pushing with your chest. That cue helps most on lighter sets.',
      claim: CL.cue },
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Your hips are sliding forward or you are arching hard off the pad to finish reps.',
      fix: 'Sit back with your hips against the pad, feet flat, and keep only your normal small arch. Lower the weight if you have to arch to finish.',
      claim: CL.ace },
    { key: 'elbows', where: 'Elbows', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'You are snapping into a hard lockout at the end of each rep.',
      fix: 'Stop just before the elbows lock and control the way back.',
      zoom: 'blades', redFlag: 'elbow', claim: C(['CONSENSUS'], ['ace-chest-press', 'nhs-elbow-pain'], 'ACE: extended but not locked. "Hard lockout loads the elbow" is consensus. The referral is the shared elbow red flag (NHS), not the fix text (C8).') },
  ],
  libraryDiff: { add: ['upper_chest'], why: 'Muyor 2023: with neutral handles the upper (clavicular) chest works about as hard as the rest of the chest (about 30 % MVIC).' },
  claim: CL.feel,
};

/* ------------------------------------------------------------------------------------------------ plate ---------- */
// The approved golden-A plate, unchanged (owner rule; plan 2.4 and S-2 condition 1): "Elbows 45°" and the approved
// callouts stay, and Mistake keeps the approved body mistake ("round and lock"). The grip ("Heel of palm") is the Hand
// chip's caption and the hand close-up, outside the plate block.
const plate = plateSpec;

/* ------------------------------------------------------------------------------------------------ the HowTo ------ */
/* ---------------------------------------------------------------- handling mistakes, risks (plan 2.4 items 4, 7) --
 * From the verified card's handlingMistakes (grip/research/machine_chest_press.json): the mistake, its fix and what it can hurt,
 * cut to the copy limits (title <= 10 words; fix and risk <= 30 words and 2 sentences; no citations in user copy, C7;
 * no red-flag wording, C8: the shared RED_FLAG and DISCLAIMER come from howto/shared.mjs). `zoom` = "Show me" target. */
const MISTAKES = [
  { key: 'wrist', title: 'Wrist bent back, handle in the fingers', zoom: 'hand', claim: CL.wrist,
    fix: 'Reset the handle low in your palm, on the heel of your hand, and wrap your thumb. If your wrist still folds on hard reps, lower the weight.' },
  { key: 'seat-low', title: 'Seat too low, handles up at your shoulders', zoom: 'seat-height', claim: CL.seat,
    fix: 'Raise the seat until the handles meet the middle of your chest.' },
  { key: 'round-lock', title: 'Shoulders off the pad, elbows snapping locked', zoom: 'blades', claim: CL.ace,
    fix: 'Stop just before your elbows lock, with your shoulder blades still on the pad. If you can only finish by rolling forward, the weight is too heavy.' },
  { key: 'deep', title: 'Handles starting behind your chest', claim: CL.depth,
    fix: 'Set the back pad or range lever so the handles start level with the front of your chest, and stop each rep there.' },
];
const RISKS = [
  { key: 'wrist', text: 'A wrist bent back under load squeezes the small structures on the back of the wrist.',
    claim: C(['MECH', 'WEAK'], ['nance2017'], 'Nance 2017: an MRI study of people with this pain; association, not cause.') },
  { key: 'shoulder', text: 'Handles behind your chest with the elbows flared stretch the front of the shoulder under load.', claim: CL.depth },
  { key: 'elbow', text: 'A hard lockout under a heavy weight puts the stress on your elbow joints instead of your muscles.', claim: C(['CONSENSUS'], ['ace-chest-press']) },
];

export default {
  schema: 1,
  id: 'lib_machine_chest_press',
  rev: 1,
  plate,
  handling: {
    archetype: 'push',
    orientation: 'pronated',   // owner 2026-09-30: horizontal handles, palms down (A1 main pair and inset swapped)
    handle: 'machine-grip',
    loadAxis: 'along-forearm',
    handleChoice: { sore: 'Sore wrist? Use the vertical handles.', claim: CL.handles },
    overBody: false,
    width: { text: 'Pick the handle pair that puts your hands just outside your shoulders at the start, with each forearm lined up directly behind its handle.', claim: C(['DATA', 'CONSENSUS'], ['muyor2023']) },
    thumb: { mode: 'wrapped', claim: CL.thumb },
    contact: 'heel',
    wrist: { ext: [0, 10], dev: [-10, 10], limitText: 'If the back of your hand folds toward your forearm by more than about 15 to 20 degrees, stop, lower the weight and reset.', claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: [BENT_BACK],
    gripLine: 'Put the handle low in your palm, right on the heel of your hand, and wrap your thumb around it. Your knuckles should line up with your forearm. If your wrist starts bending back, the weight is too heavy.',
    cue: 'Push with the heel of your hand.',   // the workout hint line (2.1, outside the sheet)
  },
  contacts: ['seat-back', 'standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Choose the handles: vertical (neutral) if the machine has both, especially if your wrist or shoulder is sore.', zoom: 'hand', claim: CL.handles },
    { kind: 'adjust', text: 'Set the seat height: sit down and adjust until the handles line up with the middle of your chest.', zoom: 'seat-height', claim: CL.seat },
    { kind: 'adjust', text: 'Set the start depth (back pad or range lever, if the machine has one) so the handles start level with the front of your chest or just in front of it, never behind it.', claim: CL.depth },
    { kind: 'load', text: 'Pick the weight. Start lighter than you think; if you have to bend your wrist back to hold it, it is too heavy.', claim: CL.consensus },
    { kind: 'position', text: 'Sit all the way back: hips against the back pad, feet flat on the floor about hip width apart.', claim: CL.ace },
    { kind: 'grip', text: 'Grip: handle in the heel of your palm, thumb wrapped, wrist straight, forearm right behind the handle.', zoom: 'hand', claim: CL.wrist },
    { kind: 'brace', text: 'Before the first rep, set your shoulders down and back so both shoulder blades press into the pad.', zoom: 'blades', claim: CL.ace },
    { kind: 'safety', text: 'If the machine has a foot bar, use it to bring the handles out to the start and to take them back at the end, instead of pulling a heavy handle in with bent wrists.', claim: C(['CONSENSUS'], [], 'Card setup step; source to confirm (architecture 3.4).') },
  ],
  // Not written yet, because no verified source: "get in", "push the pin all the way in", "get out" (3.4, C8).
  posture: [
    { key: 'height', label: 'Handles mid-chest', detail: 'At the start the handles are level with the middle of the chest and level with or just in front of it, not behind it.',
      anchor: { landmark: 'grip.r', pose: 'start' }, zoom: 'seat-height', claim: CL.seat },
    { key: 'blades', label: 'Blades on pad', detail: 'Upper back and both shoulder blades stay in contact with the pad on every rep, including the last few centimetres of the push. Normal small arch in the low back.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'blades', claim: CL.ace },
    { key: 'wrist', label: 'Straight wrist', detail: 'Knuckles, wrist and forearm form one straight line, and the forearm points straight along the direction the handle moves. The handle sits in the heel of the palm.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'hand', claim: CL.wrist },
    { key: 'elbows', label: 'Elbows behind handles', detail: 'Each elbow sits at about handle height, directly behind its handle, below shoulder height, so the forearm points straight along the push. Seen from above, with horizontal handles the elbows sit roughly 45 to 60 degrees out from the sides; with vertical handles they sit closer to the body. They never flare straight out level with the shoulders.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: C(['CONSENSUS'], ['ace-chest-press', 'fees1998']) },
    { key: 'feet', label: 'Feet flat, hips back', detail: 'Both feet flat on the floor, hips pushed back into the seat and back pad, no bridging off the seat.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.ace },
    { key: 'soft', label: 'Soft elbows', detail: 'At the end of the push the arms are long with a small bend left in the elbows, and the shoulder blades are still on the pad.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'blades', claim: CL.ace },
    // "Start depth" (handles no deeper than the chest, seen from above): text only until the engine has a top view.
  ],
  feel,
  zooms,
  copy: {
    setupLine: 'Set the seat so the handles sit level with the middle of your chest. Sit all the way back with your feet flat and your shoulder blades on the pad.',
    mistakeLine: 'Never let your wrist fold back to finish a heavy rep. Drop the weight and push through the heel of your hand.',
    cueLine: 'Handles at mid-chest.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist', 'elbow'],
  sources: Object.keys(SOURCES),
  research: { card: 'grip/research/machine_chest_press.json', rev: 1 },
};
