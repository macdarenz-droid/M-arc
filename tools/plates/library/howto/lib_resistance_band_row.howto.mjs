// LIB-SHIP W3: the How-to content of lib_resistance_band_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/resistance_band_row.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom, so the sheet has none; the id is on
// tools/plates/library/hands/no-zoom.json (the band key, hands/hand-band.mjs:5, also lists it in GAPS). Its hand claims
// live in handling, setup step 3 and posture.
// Hand values (Q-W3-5, #383 6630932862): the band wrap has no HandleProfile, so `handle` is left out (HandlingSpec.handle
// is optional, src/howto/content-types.ts, no cast). Contact 'mid-palm' from c11 ("band flat in the palm"), thumb
// 'wrapped' from c11 ("grasps firmly"), wrist from c13. The card does not pick one of its two wraps (notes: c11 grip
// wrap, c12 palm wrap); the sheet teaches c11's grip wrap, the one the contact and thumb come from.
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// low-back row's redFlag: 'back'.
// Zooms: back line (M, the plate's drawn slump) and shoulder blades (DV). `band on feet` is a text checkpoint
// (D-SHIP-TEXTZOOM; seated_leg_curl's ankle-pad precedent): its Wrong moves the band on the foot, which is not a pose,
// and the crop engine draws only pose changes; posture checkpoint `band` and setup step 1 carry it.
// No variant line (equipment 'Resistance Band').
import plateSpec from '../specs/resistance_band_row.mjs';
import { landmarksOf } from '../engine.mjs';   // W3 LAYERS FIX: the blade outlines (the plate's own engine)
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sweat-bandrow': { cite: 'Seated Resistance Band Row (Sweat exercise library)', url: 'https://www.sweat.com/exercises/seated-resistance-band-row',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'physitrack-longsitrow': { cite: 'Resisted long-sit row (Physitrack home exercise library)', url: 'https://us.physitrack.com/home-exercise-video/resisted-long-sit-row',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  thomas2005: { cite: 'Quantification of tension in Thera-Band and Cando tubing at different strains and starting lengths', url: 'https://pubmed.ncbi.nlm.nih.gov/16355080/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  lehman2004: { cite: 'Variations in muscle activation levels during traditional latissimus dorsi weight training exercises: An experimental study', url: 'https://pubmed.ncbi.nlm.nih.gov/15228624/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  fischer2025: { cite: 'Impact of different ranges of motion in the prone barbell row on muscle excitation', url: 'https://pubmed.ncbi.nlm.nih.gov/40513198/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'theraband-manual': { cite: 'Instruction Manual, Resistance Bands and Tubing (The Hygenic Corporation)', url: 'https://www.theraband.com/static/version1771453261/frontend/Theraband/default/en_US/instructions/Resistance_Band-Tubing_Instruction_Manual(1).pdf',
    kind: 'manufacturer', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'sabf-bandrow': { cite: 'Seated Row With Band To Strengthen Upper Back - Sit and Be Fit', url: 'https://www.sitandbefit.org/seated-row-band-upper-body-strengthening/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'MECH' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_row lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: acsm2009 (c10, tempo, plate only); c12 (the palm wrap: the sheet teaches c11's grip wrap).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SW = 'sweat-bandrow', PT = 'physitrack-longsitrow', TB = 'theraband-manual';
const CL = {
  c1: C(['CONSENSUS'], [SW, PT], 'c1'),
  c2: C(['CONSENSUS'], [SW], 'c2'),
  c3: C(['CONSENSUS'], [SW, PT], 'c3'),
  c4: C(['CONSENSUS'], [SW, PT], 'c4'),
  c5: C(['CONSENSUS'], [SW, PT], 'c5'),
  c6: C(['DATA', 'MECH'], ['thomas2005'], 'c6'),
  c11: C(['CONSENSUS'], [TB], 'c11'),
  c13: C(['MECH'], ['sabf-bandrow'], 'c13'),
  wrap: C(['CONSENSUS'], [SW, PT, TB], 'c1, c11'),
  slump: C(['CONSENSUS', 'DATA', 'MECH'], [SW, PT, 'thomas2005'], 'c3, c6'),
  snap: C(['CONSENSUS'], [SW, PT, TB], 'c2, c14'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (elbows back, blades squeezed, trunk tall; c3, c4) and the spec's Mistake
// pose merged over it, as the engine draws it (the slump: pelvis rolls back, spine rounds, trunk tips forward; c3). The
// card zoom `back line` Wrong is that drawn fault, so no new pose is made.
// 'apart' (card zoom `shoulder blades` Wrong, c4: "Shoulder blades still apart at the end of the pull"): the end pose
// with the start pose's shoulder blades (scap pro +2 instead of -4), so only the blades change.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): the
// blade position is the plate's own start value; no card gives a size, no number appears in user copy; the layers panel
// judges it.
const MIS = plateSpec.mistake.pose, APART = { scap: plateSpec.poses.start.scap };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  slump: { pose: { ...plateSpec.poses.end, ...MIS } },
  apart: { pose: { ...plateSpec.poses.end, ...APART } },
};

// Shoulder blades seen from behind (W3 LAYERS FIX, L5; golden B's bladeOutlines form, pull_up.howto.mjs:172). The engine
// moves the shoulder joints forward for a protracted blade (scap pro) but not toward the spine, so each blade is drawn
// from the spine: DRAWING VALUES in cm, [out from the spine, up from the shoulder joint height], a blade about 10 cm
// wide and 15 cm tall with its inner edge about 5 cm from the spine when squeezed. A blade slides out by as much as
// the pose moves its shoulder joint forward from the squeezed end (the plate's own 6 cm, start pro +2 against end -4),
// so 'apart' shows the blades that far from the spine. No card gives a size; no number appears in user copy.
const BLADE = [[5, 1], [4.5, -6], [6, -14], [11, -8], [15, -2], [14, 3], [9, 3]];
const BLADE_SPINE = [[5, -1], [15, 2]];
const fwdOf = lm => lm['shoulder.l'][2] - lm.backUpper[2];
const FWD0 = fwdOf(landmarksOf(plateSpec.poses.end));
function bladeOutlines(lm) {
  const lines = [], points = {}, out = (fwdOf(lm) - FWD0) * 100;
  for (const sd of ['l', 'r']) {
    const Sj = lm[`shoulder.${sd}`], sg = Math.sign(Sj[0]);
    const w = ([m, up]) => [sg * (m + out) / 100, Sj[1] + up / 100, lm.backUpper[2] - 0.02];
    lines.push({ pts: [...BLADE, BLADE[0]].map(w), kind: 'outline' }, { pts: BLADE_SPINE.map(w), kind: 'ridge' });
    points[`bladeIn.${sd}`] = w(BLADE[1]);
  }
  return { lines, points };
}

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong is
// drawn alone (solid).
const zooms = [
  {
    key: 'back-line', chip: 'Back', heading: 'Back line', kind: 'posture',   // card zoom key: back line
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Sit tall', anchor: 'backMid' },
      wrong: { text: 'Back rounds', anchor: 'backMid' },
    },
    caption: {
      right: 'Sitting tall, back straight, holding the pull.',
      wrong: 'Lower back rounded, trunk tipped forward.',
    },
    alt: {   // c3 (card zooms[key=back line])
      right: 'Side view, end of the pull. Sitting tall on the floor, back straight. The elbows are drawn back.',
      wrong: 'Side view. The lower back rounds and the trunk tips forward over the legs.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'blades', chip: 'Shoulder blades', heading: 'Shoulder blades', kind: 'posture',   // card zoom key: shoulder blades
    // W3 LAYERS FIX (#384 6648454032, L5): from the side the blades cannot be seen, so both crops are drawn from behind,
    // golden B's "Seen from behind" form (view 'back', both solid), with the blades outlined (bladeOutlines below). c4.
    view: 'back', camLabel: 'Seen from behind',
    outlines: bladeOutlines,
    crop: { center: { at: 'backUpper', pose: 'right', off: [0, -4] }, sizePx: 118 },
    right: 'end',
    wrong: { base: 'end', pose: APART, solid: true },
    callout: {
      right: { text: 'Squeezed', anchor: 'backUpper' },
      wrong: { text: 'Still apart', anchor: 'backUpper' },
    },
    caption: {
      right: 'Shoulder blades squeezed together at the end.',
      wrong: 'Shoulder blades still apart at the end of the pull.',
    },
    alt: {   // c4 (card zooms[key=shoulder blades])
      right: 'Seen from behind, end of the pull. The shoulder blades are drawn back together.',
      wrong: 'Seen from behind, end of the pull. The shoulder blades stay apart, shoulders forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'mid_back', plain: 'The middle of your back, between the shoulder blades, does the work.' }],
  secondary: [
    { muscleId: 'lats', plain: 'The lats, at the sides of your back, help.' },
    { muscleId: 'rear_delts', plain: 'The backs of your shoulders help.' },
    { muscleId: 'biceps', plain: 'The biceps bend the elbows.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Your lower back should stay straight.' }],
  // D-TEXT-GOLDEN (#379 6637607604): posture 'breathe' (c5) moved from the feel line to a setup step (W3 PANEL FIX 2, #384 6649416891: no movement cues under the feel heading).
  feelLine: 'You should feel this as a small squeeze between your shoulder blades.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Watch for losing your tall, straight back.',
      fix: 'Sit tall. Hold the band further along so it stretches less.',
      zoom: 'back-line', redFlag: 'back', claim: CL.slump },
  ],
  libraryDiff: { add: ['biceps'], why: 'card libraryDiff: the elbows bend against the band (c4) and a prone row measured the biceps working (c9; MECH).' },
  claim: C(['CONSENSUS', 'DATA', 'MECH'], [SW, PT, 'lehman2004', 'fischer2025'], 'c4 (primary), c8, c9 (secondary), c3 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'snap', title: 'Letting the band snap back', claim: CL.c5,
    fix: 'Control the way back to the start.' },
  { key: 'slump', title: 'Slumping while holding the band', zoom: 'back-line', claim: CL.slump,
    fix: "Sit tall first. If you can't, hold the band further along." },
  { key: 'band', title: 'A worn or loose band', claim: CL.c2,
    fix: 'Check the band each session. Anchor it firmly round your soles.' },
];
const RISKS = [
  { key: 'band', text: 'A worn or loosely anchored band can snap back.', claim: CL.snap },
  { key: 'slump', text: 'Avoid holding the pull with your lower back rounded.', claim: CL.c3 },
];

export default {
  schema: 1,
  id: 'lib_resistance_band_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c11 and c13.',
    orientation: 'neutral',    // c3: palms facing in
    // no `handle` (Q-W3-5): no HandleProfile names a band wrap; the field is optional
    width: { text: 'Set by where the band leaves your feet.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c11 },   // c11: the hand grasps the wrapped band firmly
    contact: 'mid-palm',       // c11: band flat in the palm
    // c13: wrists straight, in line with the forearms. No tolerance given: straight itself.
    wrist: { ext: [0, 0], limitText: 'Keep your wrists straight, in line with your forearms.', claim: CL.c13 },
    faults: [],                // the card's band-hand fault (c14) has no wrist direction (card gaps): text only, in risks
    gripLine: 'Band flat in your palm, long end round the back of your hand. Grip it firmly.',
    cue: 'Sit tall, elbows back.',   // c3, c4
  },
  contacts: ['floor-body'],   // the card's archetype.contact
  setup: [
    { kind: 'safety', text: 'Check the band for wear. Breathe out as you pull.', claim: C(['CONSENSUS'], [SW, PT], 'c2, c5') },
    { kind: 'position', text: 'Sit on a mat, legs straight out, feet flexed.', claim: CL.c1 },
    { kind: 'grip', text: 'Loop the band round both soles. Wrap an end round each hand.', claim: CL.wrap },
    { kind: 'load', text: 'Hold the band shorter or longer to change how hard it is.', claim: CL.c6 },
    { kind: 'brace', text: 'Sit tall, shoulders down and back, arms straight in front.', claim: CL.c3 },
  ],
  posture: [
    { key: 'tall', label: 'Sit tall', detail: 'Back straight and neutral, sitting tall, all set.',
      anchor: { at: 'backMid', pose: 'start' }, zoom: 'back-line', claim: CL.c3 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulder blades drawn down and back from the start.',
      anchor: { at: 'shoulderTop.r', pose: 'start' }, claim: CL.c3 },
    { key: 'elbows', label: 'Elbows to sides', detail: 'Elbows pull straight back, close to your sides.', anchor: { at: 'elbow.r', pose: 'end' }, claim: CL.c4 },
    { key: 'squeeze', label: 'Small squeeze', detail: 'A small squeeze between your shoulder blades at the end.',
      anchor: { at: 'backUpper', pose: 'end' }, zoom: 'blades', claim: CL.c4 },
    { key: 'breathe', label: 'Breathe out', detail: 'Breathe out on the pull. Straighten your arms slowly on the way back.',
      anchor: { at: 'chest', pose: 'end' }, claim: CL.c5 },
    // D-SHIP-TEXTZOOM: the card zoom `band on feet` as a text checkpoint (its Wrong moves the band, not the body)
    { key: 'band', label: 'Band round soles', detail: 'Band flat across both soles, feet flexed. Never on the toes.',
      anchor: { at: 'ball.r', pose: 'start' }, claim: CL.c2 },
  ],
  feel,
  zooms,
  chips: ['back-line', 'blades', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Sit on a mat, legs straight. Loop the band round both soles.',
    mistakeLine: 'Sit tall all set. Never let the band snap your arms back.',
    cueLine: 'Sit tall, elbows back.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/resistance_band_row.json', rev: 1 },
};
