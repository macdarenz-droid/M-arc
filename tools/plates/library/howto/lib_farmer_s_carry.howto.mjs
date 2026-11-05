// LIB-SHIP W7: the How-to content of lib_farmer_s_carry (golden B's HowToContent shape, as lib_cable_fly). Every shown
// string restates a claim of the verified card docs/research/howto/cards/farmer_s_carry.json (cited in its field's
// claim, cN = card claim id).
// Hand (farmer form, LIB-SHIP-DESIGN section 17 as ruled on #394): archetype 'hold'. The thumb (wrapped) and the contact
// (the bottom of the palm pushed into the handle: 'heel') are the card's own (c13). The card's grip.wrist is empty, so
// the wrist is golden B's hold default exactly as lib_cable_fly takes it (source hold-default, CONVENTION, never shown).
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-HANDW7, gap-ruled; tools/plates/library/hands/no-zoom.json): no pair key
// draws a carry handle. The card hand zoom `grip` Right (c13) is the gripLine; its Wrong "Held in the fingers only."
// shows as a mistake in copy.mistakeLine and as handling.faults[0] (never as an instruction).
// Way out (tier A, card tierA.wayOut c15, c16): feel row `hands` (a slipping handle: end the carry, lower the weights
// beside you, feet clear).
// Variant line (D-LIB5-VARIANT): equipment 'Dumbbells / Trap Bar'; the card's plate.variantLine (c23, c1).
// Feel: the card's primaries forearms (c19) and upper_traps (c20), secondaries glutes and obliques (c21).
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c4 torso upright, gaze ahead       -> posture 'torso', zoom torso (Right)
//   posture c4 arms long at your sides         -> posture 'arms'
//   posture c5 shoulders back and down         -> posture 'shoulders', zoom shoulders (Right)
//   posture c8 short, deliberate steps         -> posture 'steps', mistakes[1] fix
//   posture c9 weights even                    -> posture 'even'
//   posture c17 slow down, turn with small steps -> posture 'turn'
//   handlingMistake rushing the walk (c7)      -> mistakes[0]
//   handlingMistake steps too long (c25, c8)   -> mistakes[1]
//   handlingMistake shrugging (c5)             -> mistakes[2] (zoom shoulders, DV)
//   hand zoom `grip` Right (c13)               -> handling.gripLine; Wrong (c13) -> copy.mistakeLine, handling.faults
//   T checkpoints                              -> none (both posture zooms drawn)
// D-TEXT-PROGRESSION: c18 (load progression) is not a form checkpoint, not on the sheet.
import plateSpec from '../specs/farmer_s_carry.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-farmers': { cite: 'How to Do the Farmer’s Carry: Benefits and Expert Tips (BarBend)', url: 'https://barbend.com/farmers-carry/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'ggr-farmers': { cite: 'How to Do the Farmer\'s Carry: Expert Tips (Garage Gym Reviews)', url: 'https://www.garagegymreviews.com/farmers-carry',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-farmers': { cite: 'Farmer\'s Walk Guide: How-To, Muscles Worked, Variations, and Benefits (Fitness Volt)', url: 'https://fitnessvolt.com/farmers-walk/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-farmers': { cite: 'How to Do Farmers Walk: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/farmers-walk/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-fwbreak': { cite: 'A Step by Step Breakdown of the Farmer’s Walk (BarBend)', url: 'https://barbend.com/farmers-walk-breakdown/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  // golden B's `hold` archetype default for the wrist the card leaves empty: a convention (as lib_cable_fly).
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-farmers', GG = 'ggr-farmers', FV = 'fv-farmers', SL = 'sl-farmers';
const CL = {
  c2: C(['CONSENSUS'], [FV], 'card c2'),
  c3: C(['CONSENSUS'], [FV, BB, GG], 'card c3'),
  c4: C(['CONSENSUS'], [GG, FV], 'card c4'),
  c5: C(['CONSENSUS'], [BB, FV], 'card c5'),
  c7: C(['CONSENSUS'], [GG, FV], 'card c7'),
  c8: C(['CONSENSUS'], [GG, BB, SL], 'card c8'),
  c9: C(['CONSENSUS'], [BB, SL, FV], 'card c9'),
  c10: C(['CONSENSUS'], [GG], 'card c10'),
  c13: C(['CONSENSUS'], [GG], 'card c13'),
  c14: C(['CONSENSUS'], [GG], 'card c14'),
  c17: C(['CONSENSUS'], [FV], 'card c17'),
  c19: C(['CONSENSUS'], [SL, FV], 'card c19'),
  c20: C(['CONSENSUS'], [SL, BB], 'card c20'),
  c21: C(['CONSENSUS'], [SL, BB], 'card c21'),
  stand: C(['CONSENSUS', 'WEAK'], [GG, FV, 'bb-fwbreak'], 'card c4, c24'),
  pick: C(['CONSENSUS'], [FV, BB, GG], 'card c3, c13'),
  lift: C(['CONSENSUS'], [FV, BB, GG, SL], 'card c3, c11'),
  long: C(['CONSENSUS'], [BB, GG, SL], 'card c25, c8'),
  torso: C(['CONSENSUS'], [GG, FV, BB, SL], 'card c4, c9'),
  out: C(['CONSENSUS'], [FV, SL], 'card c15, c16'),
  back: C(['CONSENSUS'], [GG, SL, FV], 'card c10, c11, c15'),
  trap: C(['CONSENSUS'], [BB, GG, FV], 'card c23, c1'),
  hold: C(['CONVENTION'], ['hold-default'], 'card grip.wrist is empty (no source gives a wrist position): golden B\'s hold default, as lib_cable_fly; not a card claim, never shown'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own start (feet side by side, torso upright, arms long, shoulders set down and back; c3-c5):
//   shrug (card zoom shoulders Wrong, c5 "shoulders shrugged high"): the start with the scapulae elevated SHRUG cm (the
//         spec's scap.pro kept); the arms and dumbbells hang from the raised shoulders.
//   lean  (card zoom torso Wrong, c9 "leaning forward"): the start with the lumbar spine flexed LEAN deg forward; the
//         shoulder flexes the same LEAN so the arms still hang plumb with the dumbbells (c4 arms long); root and feet stay.
// DRAWING VALUES (D-SHIP-DRAWVAL): SHRUG 6 cm (twice battle_ropes' spec M_ELEV 3 cm, which did not read at panel size
// with the long arms and dumbbells) and LEAN 20 deg are Wrong-pose sizes no card gives. No number from either appears in user copy; the layers panel judges them.
const SHRUG = 6, LEAN = 20;
const START = plateSpec.poses.start;
const SHRUG_POSE = { ...START, scap: { ...START.scap, elev: SHRUG } };
const LEAN_POSE = { ...START, trunk: LEAN, shoulder: { flex: LEAN } };
export const stills = {
  start: { pose: START },
  end: { pose: plateSpec.poses.end },
  shrug: { pose: SHRUG_POSE },
  lean: { pose: LEAN_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'shoulders', chip: 'Shoulders', heading: 'Shoulders down', kind: 'posture',
    // zoom shell: crop centre on the right pose's near shoulder; the Wrong is the shrug still drawn alone (solid).
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [0, -12] }, sizePx: 100 },
    right: 'start',
    wrong: { base: 'start', pose: SHRUG_POSE, solid: true },
    callout: {
      right: { text: 'Back and down', anchor: 'shoulder.r' },
      wrong: { text: 'Shrugged high', anchor: { at: 'shoulder.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Shoulders back and down.',   // card zoom right (c5)
      wrong: 'Shoulders shrugged high.',   // card zoom wrong (c5)
    },
    alt: {
      right: 'Side view, standing with a dumbbell in each hand. The shoulders sit back and down.',
      wrong: 'Side view, standing with a dumbbell in each hand. The shoulders shrug up toward the ears.',
    },
  },
  {
    key: 'torso', chip: 'Torso', heading: 'Tall torso', kind: 'posture',
    // zoom shell: crop centre on the right pose's mid back, head to hips; the Wrong is the lean still drawn alone (solid).
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 200 },
    right: 'start',
    wrong: { base: 'start', pose: LEAN_POSE, solid: true },
    callout: {
      right: { text: 'Tall', anchor: 'backMid' },
      wrong: { text: 'Leaning forward', anchor: { at: 'backUpper', pose: 'mistake' } },
    },
    caption: {
      right: 'Tall and upright, arms long.',   // card zoom right (c4, c9)
      wrong: 'Leaning forward.',               // card zoom wrong (c9)
    },
    alt: {
      right: 'Side view, standing with a dumbbell in each hand. Torso tall and upright, arms long at the sides.',
      wrong: 'Side view, standing with a dumbbell in each hand. The upper body leans forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'forearms', plain: 'The forearms work to hold the handles.', claim: CL.c19 },
    { muscleId: 'upper_traps', plain: 'The traps hold your shoulder blades steady.', claim: CL.c20 },
  ],
  secondary: [
    { muscleId: 'glutes', plain: 'The glutes steady the pelvis.', claim: CL.c21 },
    { muscleId: 'obliques', plain: 'The sides of the belly steady the torso.', claim: CL.c21 },
  ],
  watch: [],
  feelLine: 'You should feel this in your forearms and traps.',
  rows: [
    // The card's first two rows (forearms, traps) have no fix, so they are left out: the feel line says them.
    // Tier-A way out (card tierA.wayOut c15, c16).
    { key: 'hands', where: 'Hands', at: { muscles: ['forearms'] },
      means: 'A handle starts slipping.',
      fix: 'End the carry. Lower the weights beside you, feet clear.',
      claim: CL.out },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Not bracing your trunk.',   // card row means ("Fault: not bracing your core.")
      fix: 'Brace before you lift. Stop if you feel pain.',
      redFlag: 'back', claim: CL.back },
  ],
  claim: C(['CONSENSUS'], [SL, FV, BB], 'card c19, c20, c21'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'rush', title: 'Rushing the walk', claim: CL.c7, fix: "Slow down. Don't speed up for more distance." },
  { key: 'long', title: 'Steps too long', claim: CL.long, fix: 'Take short, deliberate steps.' },
  { key: 'shrug', title: 'Shrugging as you tire', zoom: 'shoulders', claim: CL.c5, fix: 'Keep your shoulders back and down.' },
];
const RISKS = [
  { key: 'rush', text: 'Rushing: one misstep could pull a calf, roll an ankle or twist a knee.', claim: CL.c7 },
  { key: 'brace', text: 'Not bracing can wreak havoc on your lower back.', claim: CL.c10 },
  { key: 'grip', text: 'Without a good grip, the weights may slip and land on your toe.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_farmer_s_carry',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: gap-ruled, no pair key draws a carry handle; the grip copy carries c3, c4 and c13.',
    orientation: 'neutral',    // c3: a secure neutral grip
    handle: 'dumbbell',        // the plate's dumbbells
    loadAxis: 'across',        // golden B's hold default (as lib_cable_fly)
    overBody: false,
    width: { text: 'Hands at the sides of your body.', claim: CL.c4 },   // card grip.width (c4)
    thumb: { mode: 'wrapped', claim: CL.c13 },   // card grip.thumb (c13)
    contact: 'heel',           // card grip.handContact (c13): the bottom of the palm pushed into the handle
    wrist: { exempt: 'Hold default: no source gives a wrist position; the plate draws a straight wrist.', claim: CL.hold },
    faults: [
      // card zoom grip wrong (c13). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'fingers-only', label: 'Fingers only', pose: {}, markers: [], alt: 'Handle held in the fingers only, not pushed into the palm.' },
    ],
    gripLine: 'Palm pushed into the handle, thumb wrapped. Curl your fingers around it.',   // card zoom grip right (c13)
    cue: 'Squeeze the handles hard.',   // c13
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'Clear a level, dry route, with room to set down.', claim: CL.c2 },
    { kind: 'position', text: 'Stand between the weights, feet about hip-width apart.', claim: CL.c3 },
    { kind: 'grip', text: 'Bend at your hips and knees and grip, thumbs wrapped.', claim: CL.pick },
    { kind: 'brace', text: 'Breathe in, brace, and stand up without jerking the weights.', claim: CL.lift },
    { kind: 'position', text: 'Stand fully tall, arms long at your sides, before your first step.', claim: CL.stand },
  ],
  posture: [
    { key: 'torso', label: 'Tall torso', detail: 'Torso upright, gaze ahead.', anchor: { landmark: 'head', pose: 'start' }, zoom: 'torso', claim: CL.c4 },
    { key: 'arms', label: 'Arms long', detail: 'Arms long at your sides.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c4 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders back and down, not shrugged.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, zoom: 'shoulders', claim: CL.c5 },
    { key: 'steps', label: 'Short steps', detail: 'Short, deliberate steps.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c8 },
    { key: 'even', label: 'Weights even', detail: 'Weights even, not shifting to one side.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c9 },
    { key: 'turn', label: 'Slow turns', detail: 'Slow down and turn with small steps.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c17 },
  ],
  feel,
  zooms,
  chips: ['shoulders', 'torso', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Grip each weight, thumbs wrapped. Stand fully tall, arms long, then walk.',
    mistakeLine: 'Never hold the handles in the fingers only: push your palm in.',   // card zoom grip wrong (c13)
    cueLine: 'Tall torso, shoulders down, short steps.',
    // D-LIB5-VARIANT: the card's plate.variantLine (c23, c1): the trap bar is deadlifted from inside the frame.
    variantLine: 'Trap bar: step inside, deadlift it up, arms fully extended.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/farmer_s_carry.json', rev: 1 },
};
