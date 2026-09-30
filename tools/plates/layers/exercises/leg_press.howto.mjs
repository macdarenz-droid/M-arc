// How-to content for the 45 degree leg press (lib_leg_press): grip, posture close-ups, where to feel it.
// Shape: grip/GRIP-AND-FEEL-ARCHITECTURE.md 4.1-4.4 (HowTo, HandlingSpec, ZoomSpec, FeelSpec, SetupStep,
// PostureCheckpoint). Content: the verified card grip/research/leg_press.json (verifier pass 2026-09-30) and
// appendix A8. Card copy lines (grip, feel, setup, mistake) are kept word for word. Card fields that mixed copy and
// evidence are split: the copy stays here, the evidence goes to the Claim. Posture `detail` fields were written for the
// artist ("The drawing shows...") and are rewritten here as user copy with the same content. GENERAL.md wording is not used.
// Render check: node exercises/leg_press.howto-render.mjs  ->  out/leg_press-howto-*.png
//
// Additions to the architecture's types, used by the mockup only (marked "mockup"), as in the squat and chest press files:
//   ZoomSpec.callouts        one callout per crop ({ right, wrong }: text + the guide it names)
//   ZoomSpec.hand.notes      the 1-3 word notes over each hand half
//   ZoomSpec.hand.surface    what the wrong hand presses on when it is not a handle ('knee'; see the render script)
//   ZoomSpec.hand.rightLoad  false: the right half draws no load line (the hands hold, they don't push)
//   stills                   poses for posture crops that the plate spec does not name
//   openItems                what the sheet still owes the card (see OPEN_ITEMS); the render report prints them
import plateSpec from './leg_press.mjs';
import { landmarksOf, legPressFace } from '../engine/index.mjs';
// RED_FLAG (and any other shared safety copy) comes from the one shared module (plan S-2 condition 4); re-exported
// for the render scripts. DISCLAIMER is shown once per sheet by the page, from the same module.
import { RED_FLAG } from '../howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (registry entries this sheet cites) --
 * `use` is the evidence label FOR THIS USE (architecture 3). `access` is what the card's verifier read. */
export const SOURCES = {
  'ace-leg-press': { cite: 'ACE Exercise Library, Seated Leg Press', url: 'https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/',
    kind: 'guideline', access: 'unreachable', checked: null, use: 'CONSENSUS',
    note: 'The card verifier got a 403. Content taken from the first research pass (the plate spec quotes it). Never the only source of a claim (C8).' },
  'nasm-leg-press': { cite: 'NASM Exercise Library, Leg Press', url: 'https://www.nasm.org/resource-center/exercise-library/leg-press',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS',
    note: 'Back and head on the pad, hip-width feet, hands on the handles to release the safety bars, no lockout, about 90 degrees; faults: knees caving, locking out, going far past 90, hips shifting. Lists the hip adductors as secondary.' },
  'bells-of-steel': { cite: 'Bells of Steel (manufacturer), How to use the leg press machine', url: 'https://bellsofsteel.us/blogs/content/how-to-use-the-leg-press-machine',
    kind: 'manufacturer', access: 'unreachable', checked: null, use: 'CONSENSUS',
    note: 'Bot check; unverified until someone opens it in a browser. Machines differ, so the copy says "on most machines".' },
  yessis: { cite: 'Yessis M. The Leg Press', url: 'https://doctoryessis.com/?p=2700',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS',
    note: 'Knees close to the chest round the lower back; 80-90 degrees at the knee; higher feet more glutes and hamstrings, lower feet more quads.' },
  escamilla2001lp: { cite: 'Escamilla RF et al. Effects of technique variations on knee biomechanics during the squat and leg press. Med Sci Sports Exerc 2001;33(9):1552-66', url: 'https://pubmed.ncbi.nlm.nih.gov/11528346/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA',
    note: 'Knee forces rise with knee bend; no difference high vs low feet; toes straight vs out no difference; more hamstring with wide, high feet.' },
  dasilva2008: { cite: 'Da Silva EM et al. Analysis of muscle activation during different leg press exercises at submaximum effort levels. J Strength Cond Res 2008;22(4):1059-65', url: 'https://pubmed.ncbi.nlm.nih.gov/18545207/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'n=14 women. High feet: more glute max; low feet: more quads and calves.' },
  martinfuentes2022: { cite: 'Martin-Fuentes I, Oliva-Lozano JM, Muyor JM. Influence of feet position and execution velocity on muscle activation and kinematic parameters during the inclined leg press exercise. Sports Health 2022;14(3):317-327', url: 'https://pubmed.ncbi.nlm.nih.gov/34085847/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'Small sample. Stance width and toe angle made no EMG difference.' },
  martinfuentes2020: { cite: 'Martin-Fuentes I, Oliva-Lozano JM, Muyor JM. Muscle activation and kinematic analysis during the inclined leg press exercise in young females. Int J Environ Res Public Health 2020;17(22):8698', url: 'https://pubmed.ncbi.nlm.nih.gov/33238589/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'Small sample. Quads highest, then glute med.' },
  marchetti2023: { cite: 'Marchetti PH et al. Backseat inclination affects the myoelectric activation during the inclined leg press exercise in recreationally trained men. J Strength Cond Res 2023;37(10):e541-e545', url: 'https://pubmed.ncbi.nlm.nih.gov/37184975/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'More reclined back: more vastus lateralis, less biceps femoris, glutes the same.' },
  kinoshita2026: { cite: 'Kinoshita M et al. Hypertrophic effects of single- versus multi-joint exercise: a direct comparison between knee extension and leg press. Med Sci Sports Exerc 2026;58(7):1566-1580', url: 'https://pubmed.ncbi.nlm.nih.gov/41630124/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'MRI, 12 weeks: vasti, glute max and adductor magnus grew, rectus femoris did not.' },
  stien2021: { cite: 'Stien N, Saeterbakken AH, Andersen V. Electromyographic comparison of five lower-limb muscles between single- and multi-joint exercises among trained men. J Sports Sci Med 2021;20(1):56-61', url: 'https://pubmed.ncbi.nlm.nih.gov/33707987/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'Only modest hamstring EMG on the leg press.' },
  larsen2025: { cite: 'Larsen S et al. Knee flexion range of motion does not influence muscle hypertrophy of the quadriceps femoris during leg press training in resistance-trained individuals. J Sports Sci 2025;43(10):986-994', url: 'https://pubmed.ncbi.nlm.nih.gov/40113586/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'Deep and moderate range grew the quads alike, so stopping where the tailbone stays down costs little.' },
  castonguay2022: { cite: 'Castonguay-Siu V, Taylor WR. Optimizing backrest geometry to minimize interfacial pressure concentrations in the mid-to-lumbar region during leg press resistance training. J Biomech Eng 2022;144(3):035001', url: 'https://pubmed.ncbi.nlm.nih.gov/34864904/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH', note: 'The lower-back pad takes real pressure; spinal bending was not measured.' },
  barnds2019: { cite: 'Barnds B et al. Simultaneous bilateral knee dislocation during weight training: a case report and review of the literature. JBJS Case Connect 2019;9(1):e5', url: 'https://pubmed.ncbi.nlm.nih.gov/30676343/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK', note: 'One case report ("during weight training", not said to be a leg press); advises no locking or hyperextension on any leg press.' },
  macdougall1985: { cite: 'MacDougall JD et al. Arterial blood pressure response to heavy resistance exercise. J Appl Physiol 1985;58(3):785-90', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA', note: 'n=5. Double-leg press gave the highest blood pressures near failure, partly from breath holding.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',   // RED_FLAG_KNEE source
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
};
// Not cited: GENERAL.md (superseded project notes; the card's wrist mechanics come from it and are tagged WEAK here),
// ExRx and physio-pedia (could not be reached by the card's researcher).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  grip: C(['CONSENSUS', 'WEAK'], ['ace-leg-press', 'nasm-leg-press'],
    'Nothing measures grip, thumb or wrist on the leg press handles. "Lightly grasp" and "avoid moving the upper body" (ACE), hands on the handles (NASM).'),
  thumb: C(['CONSENSUS'], ['ace-leg-press', 'nasm-leg-press'],
    'Wrapped thumb: coaching consensus (you turn the catch levers with it). No study compares thumb positions here.'),
  wrist: C(['WEAK', 'MECH'], ['ace-leg-press', 'nasm-leg-press'],
    'Level wrist, 0-20 deg: drawing check, not an injury threshold. Pushing on the knees folds the wrist back under part of the sled load: mechanics plus coaching observation; not counted in any study.'),
  width: C(['CONSENSUS'], ['nasm-leg-press', 'ace-leg-press'], 'Set by the machine.'),
  safety: C(['CONSENSUS'], ['nasm-leg-press', 'bells-of-steel'], 'Catch steps from NASM and a manufacturer guide; machines differ, so "on most machines" and the machine sticker.'),
  back: C(['CONSENSUS', 'MECH'], ['ace-leg-press', 'nasm-leg-press', 'yessis', 'castonguay2022'],
    'No study measured lumbar bending at the bottom of a leg press. Consensus plus mechanics; the pad takes real pressure (Castonguay-Siu 2022).'),
  depth: C(['CONSENSUS', 'DATA'], ['ace-leg-press', 'nasm-leg-press', 'yessis', 'larsen2025'],
    '90 deg stop: consensus. Larsen 2025: moderate range grows the quads as well as deep range.'),
  pad: C(['DATA'], ['marchetti2023'], 'More reclined: more vastus lateralis, less biceps femoris, glutes the same.'),
  feet: C(['CONSENSUS', 'DATA'], ['ace-leg-press', 'nasm-leg-press', 'escamilla2001lp', 'martinfuentes2022'],
    'Heels flat, knees over toes: consensus. Width and toe angle barely change the muscles (Martin-Fuentes 2022, Escamilla 2001).'),
  heels: C(['DATA', 'MECH', 'CONSENSUS'], ['escamilla2001lp', 'ace-leg-press', 'nasm-leg-press'],
    'Knee forces rise with knee bend (Escamilla 2001). High vs low feet did not change knee forces, so the fault drawn is the heel lift, not the foot height alone.'),
  lockout: C(['WEAK', 'CONSENSUS'], ['barnds2019', 'nasm-leg-press', 'ace-leg-press'], 'One case report plus consensus.'),
  kneesIn: C(['CONSENSUS'], ['nasm-leg-press'], 'Knee valgus as a leg-press injury cause is NASM consensus, not leg-press data.'),
  breath: C(['DATA', 'CONSENSUS'], ['macdougall1985', 'ace-leg-press'], 'MacDougall 1985, n=5, mean peak 320/250 mmHg near failure.'),
  load: C(['CONSENSUS'], ['nasm-leg-press', 'bells-of-steel']),
  feel: C(['DATA', 'CONSENSUS'], ['martinfuentes2020', 'martinfuentes2022', 'dasilva2008', 'kinoshita2026', 'stien2021', 'nasm-leg-press'],
    'Area level only: EMG amplitude is not what a person feels. Quads main (Martin-Fuentes), glutes more with high feet (Da Silva 2008), inner thighs grow (Kinoshita 2026), hamstrings modest (Stien 2021).'),
};


/* ------------------------------------------------------------------------------------------------ hand ---------- */
// Seen from the side, the plate's own camera (the lifter faces screen right). The side handle is drawn end-on, as the
// plate draws it (a small round knob beside the hip).
// Both halves are drawn with the forearm pointing straight down the screen (forearm 0), so the two wrists compare
// directly, as in the owner's two photos. In the plate the forearm points down and forward (about 60 deg: elbow
// [-0.42, 0.68, -0.16] to wrist [-0.29, 0.57, 0.04]); at 60 deg, and with the wrong hand at its true 113 deg, the pair
// drew at 0.67 px/mm instead of 0.88 and the thumb and handle were too small to read. The close-up is rolled, not
// re-cameraed: it is still the side view, so "Seen from the side" stays true.
// Right (archetype `balance`): the card's handContact, "across the fingers and the upper palm, the way you'd hold a
// shopping bag", so contactAt 0.9 (finger base); thumb wrapped round (card: full grip, held lightly); wrist level with
// the forearm, 8 deg (inside the card's 0-20). No load line: the hands hold, they don't push (the render script strips
// it; the engine has no `load: none`).
// Wrong (`push-on-knees`, A8): the palm pressed on the thigh just behind the kneecap, fingers cupped over the knee,
// pushing to finish a hard rep. The push runs along the forearm and is square to the thigh, as in the plate (thigh
// pointing up, forearm reaching in from the shoulder at about 113 deg); rolled with the rest of the close-up, the thigh
// lies across the screen under the hand. The hand folds back 80 deg (card: "toward 90 degrees"). The push runs along the forearm into the knee; its line passes
// on the back-of-hand side of the wrist and is printed in cm. Thumb beside the fingers: the card names no thumb for
// this fault, and a thumb pressed flat is how a hand pushes on a knee. The knee is drawn by the render script where the
// engine would draw a handle (engine gap: no flat or body-surface contact).
const RIGHT_POSE = {
  view: 'radial', forearm: 0, wrist: { ext: 8, dev: 0 }, contactAt: 0.9, fingers: { curl: 1 }, thumb: 'wrapped',
  squeeze: 'light', handle: { profile: 'pad-handle', axis: 'across', strut: [-0.35, 1] }, load: { kind: 'pull' },
};
const KNEE_MM = 104;   // thigh depth just above the knee, drawing value (a 175 cm man's thigh ~ 100-110 mm deep there)
const PUSH_ON_KNEES = {
  key: 'push-on-knees', label: 'Pushing on knee',
  pose: { forearm: 0, wrist: { ext: 80, dev: 0 }, contactAt: 0.45, fingers: { curl: 1 }, thumb: 'beside', squeeze: 'firm',
    handle: { profile: 'machine-grip', axis: 'across', diameterMm: KNEE_MM }, load: { kind: 'push' } },
  markers: ['lever-arc'],
  alt: 'Palm pressed on the front of the knee to push a hard rep up. The wrist is folded back about 80 degrees, and the push from the knee runs on the back-of-hand side of the wrist, bending it further back.',
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// Built from the plate spec. The sled geometry (rail, plate tilt, offset) is read back from the spec's own sled item,
// so nothing here duplicates the plate's numbers except the foot placement constants, copied from leg_press.mjs.
const H = 1.75, RAD = Math.PI / 180;
const sledFn = plateSpec.equipment.find(e => typeof e === 'function');
const LM_END = landmarksOf(plateSpec.poses.end, H);
const SLED_END = sledFn(LM_END, { pose: 'x' }).find(e => e.type === 'legPress45');   // { rail, offset, plate, travel }
const FOOT_X = 0.17, TOE_OUT = 15, SOLE_UP = 0.10;   // leg_press.mjs
const toeOf = (up, sx) => [sx * Math.sin(TOE_OUT * RAD), up[1] * Math.cos(TOE_OUT * RAD), up[2] * Math.cos(TOE_OUT * RAD)];
// Feet low with the heels up (card zoom "foot on platform", wrong): the feet 12 cm lower on the plate than the plate's
// mid-plate spot, same sled depth, heels peeled off 16 deg about the ball (the plate mistake uses 12 deg at mid-plate).
const LOW = { soleUp: SOLE_UP - 0.12, heelDeg: 16 };
function feetLowHeelsUp(travel) {
  const fc = legPressFace(SLED_END, travel), a = LOW.heelDeg * RAD, n = fc.normal, t = fc.up;
  const ball = [0, fc.at[1] + t[1] * (LOW.soleUp + 0.036 * H), fc.at[2] + t[2] * (LOW.soleUp + 0.036 * H)];
  const t2 = t.map((v, i) => v * Math.cos(a) - n[i] * Math.sin(a)), n2 = n.map((v, i) => v * Math.cos(a) + t[i] * Math.sin(a));
  return { l: { at: [FOOT_X, ball[1], ball[2]], normal: n2, toe: toeOf(t2, 1), ref: 'ball' },
    r: { at: [-FOOT_X, ball[1], ball[2]], normal: n2, toe: toeOf(t2, -1), ref: 'ball' } };
}
export const SLED = SLED_END;
export const stills = {
  end: { pose: plateSpec.poses.end, travel: SLED_END.travel },
  start: { pose: plateSpec.poses.start, travel: null },            // travel read from the pose by the plate's own sled item
  mistake: { pose: { ...plateSpec.poses.end, ...plateSpec.mistake.pose }, travel: SLED_END.travel },   // the plate's Mistake pose (butt wink + heels up)
  'feet-low': { pose: { ...plateSpec.poses.end, plant: feetLowHeelsUp(SLED_END.travel) }, travel: SLED_END.travel },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// Chip order. The hand archetype is `balance`: the load goes through the feet, so "Hand" is not first (2.1 puts Hand
// first only for push, pull, hang, hold, curl and on-body). Order follows A8 and the card's risk order: Back on pad,
// Foot on platform, Hand; the sheet adds "Where to feel it" last, so at most 3 here.
// Not chips (text only): "Safety catch" (A8 lists it 4th; the 4-chip limit counts "Where to feel it", and the plate
// draws no catch under the sled, so a crop can't show it; the setup steps carry it), "Knee at the top" (the plate's
// "Soft knees" callout), "Knee tracking" (front view of the sled; the engine has none, 5.2).
const zooms = [
  {
    // chip: not "Lower back": that is the feel row's name (pain), this chip opens the posture crop
    key: 'back-on-pad', chip: 'Back pad', heading: 'Back on pad: right and wrong', kind: 'posture',
    crop: { center: { landmark: 'sacrum', pose: 'end', dx: 8, dy: -6 }, sizePx: 92 },
    right: 'end',
    wrong: { still: 'mistake' },
    callouts: {   // mockup: one label per crop
      right: { text: 'Tailbone on pad', guide: 'pad-contact' },
      wrong: { text: 'Gap at lower back', guide: 'pad-gap' },
    },
    caption: {
      right: 'Tailbone and lower back flat on the pad, knees at about 90 degrees.',
      wrong: 'Too deep: your pelvis rolls up and a gap opens behind your lower back.',
    },
    alt: {
      right: 'Side view of the hips at the bottom of the rep. The tailbone and lower back lie flat on the back pad and the hips sit in the corner of the seat.',
      wrong: 'Side view of the hips at the bottom of a rep that goes too deep. The knees come toward the chest, the pelvis rolls up off the seat and a gap opens between the lower back and the pad.',
    },
    feelRow: 'lower-back',
  },
  {
    key: 'foot', chip: 'Feet', heading: 'Foot on platform: right and wrong', kind: 'posture',
    crop: { center: { landmark: 'ankle.r', pose: 'end', dx: 5, dy: -7 }, sizePx: 72 },   // holds both feet: mid-plate (right) and 12 cm lower (wrong)
    right: 'end',
    wrong: { still: 'feet-low' },
    callouts: {
      right: { text: 'Heel down', guide: 'sole-line' },
      wrong: { text: 'Heel lifts', guide: 'heel-gap' },
    },
    caption: {
      right: 'Whole foot flat in the middle of the plate, heel down.',
      wrong: 'Feet low on the plate, heel lifted, all the push on the ball.',
    },
    alt: {
      right: 'Side view of the foot on the platform at the bottom of the rep. The whole foot is flat in the middle of the plate and the push runs from the heel to the ball of the foot.',
      wrong: 'Side view of the foot placed low on the platform. The heel has lifted off the plate, leaving a gap, and all the pressure is on the ball of the foot.',
    },
    feelRow: 'calves',
  },
  {
    key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',
    hand: {
      right: RIGHT_POSE,
      wrong: [PUSH_ON_KNEES],
      camera: 'side',
      surface: 'knee',      // mockup: the wrong hand presses on the knee, drawn by the render script
      rightLoad: false,     // mockup
      notes: { right: 'Light full grip', wrong: 'Pushing on knee' },   // mockup
    },
    caption: {
      right: 'Handle across your fingers and upper palm, thumb wrapped, wrist level.',
      wrong: 'Pushing on your knees folds your wrists far back under the load.',
    },
    alt: {
      right: 'Hand wrapped lightly round the side handle, the handle across the fingers and the top of the palm, thumb wrapped round it, wrist level with the forearm. No push through the hand.',
      wrong: PUSH_ON_KNEES.alt,
    },
    feelRow: 'wrists',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const WRIST_PARTS = ['hand-back-left', 'hand-back-right'];   // back of the hands (back view): where a bent-back wrist hurts
const KNEE_PARTS = ['knee-left', 'knee-right'];               // front view: front of the knee
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'Front of your thighs, all the way down to just above the knee. This is the main muscle on the leg press.' },
    { muscleId: 'glutes', plain: 'Your glutes, more when your feet sit higher on the platform.' },
  ],
  secondary: [
    { muscleId: 'adductors', plain: "Inner thighs, mostly near the bottom of the rep. That's normal. The big muscle there helps straighten your hips." },
    { muscleId: 'hamstrings', plain: "A little in the back of the thighs, a bit more with your feet high and wide. Don't expect much there." },
    { muscleId: 'calves', plain: 'A little in the calves, more with your feet low on the plate. They only help hold the foot steady.' },
  ],
  // "Should not take over": dashed outline, only while a row naming the muscle is open (S6). Never drawn at rest.
  watch: [
    { muscleId: 'lower_back', plain: "Your lower back should stay quiet and flat on the pad. If you feel it working, you're going too deep." },
    { muscleId: 'forearms', plain: 'Your forearms and hands should barely work. A light hold on the handles is enough.' },
  ],
  feelLine: "You should feel this in the front of your thighs and your glutes. If your lower back is working, you're going too deep, so stop a little higher and keep your tailbone on the pad.",
  // First 3 shown: the most common serious fault (lower back), the knee, and the wrist (the owner's injury, red flag).
  rows: [
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: "You're going too deep and your tailbone is lifting off the pad, or the back pad is set too upright for you.",
      fix: 'Stop higher, set the depth catch there, and try your feet a little higher on the plate. Recline the pad a notch if it adjusts.',
      zoom: 'back-on-pad', claim: C(['CONSENSUS', 'DATA'], ['yessis', 'ace-leg-press', 'nasm-leg-press', 'marchetti2023'], 'Depth and tailbone: consensus. Pad angle: Marchetti 2023.') },
    // Card fix: "Feet higher and flat, knees over your toes, stop just short of straight. If it still hurts with good
    // form, drop the weight and get the knee checked." Starts with a verb now (6.2). "Get the knee checked" is NOT in
    // the row: rows may not carry their own red-flag wording (C8). The referral comes back through the shared knee block
    // (RED_FLAG_KNEE, NHS knee pain): the row carries redFlag: 'knee' (open item `knee-red-flag` closed 2026-09-30).
    { key: 'knee', where: 'Front of the knee or under the kneecap', at: { parts: KNEE_PARTS },
      means: 'Feet too low with heels lifting, knees falling in, or knees snapping locked at the top.',
      fix: 'Put your feet higher and flat, keep your knees over your toes, and stop just short of straight. If it still hurts with good form, drop the weight.',
      zoom: 'foot', redFlag: 'knee', claim: C(['DATA', 'CONSENSUS', 'WEAK'], ['escamilla2001lp', 'nasm-leg-press', 'barnds2019', 'nhs-knee-pain']) },
    { key: 'wrists', where: 'Wrists or forearms', at: { muscles: ['forearms'], parts: WRIST_PARTS },
      means: "You're squeezing the handles hard, or pushing on your knees with your hands to get a rep up.",
      fix: 'Hold the handles lightly and keep your hands there. If a rep needs your hands, take a plate off.',   // card: "Light grip, hands stay on the handles." (fix starts with a verb, 6.2)
      zoom: 'hand', redFlag: true, claim: CL.wrist },
    // behind "More"
    { key: 'calves', where: 'Calves or arches, cramping', at: { muscles: ['calves'], parts: ['foot-left', 'foot-right'] },
      means: "You're pushing through your toes and the heels are coming up.",
      fix: 'Keep your heels down, push through the whole foot, and stop a bit higher if the heels still lift at the bottom.',
      zoom: 'foot', claim: CL.heels },
    { key: 'thighs-only', where: 'Only the front of the thighs, no glutes at all', at: {},
      means: 'Feet low on the plate and a short range.',
      fix: 'Move your feet up a little and use the full depth you can reach with your tailbone still down.',
      zoom: 'foot', claim: C(['DATA'], ['dasilva2008', 'yessis', 'larsen2025']) },
    { key: 'groin', where: 'Groin or inner thigh, sharp pull at the bottom', at: { muscles: ['adductors'] },
      means: 'A very wide stance taken deep. Some inner-thigh work is normal, and a sharp pull is your cue to change something.',   // card: 3 sentences, joined to fit the 2-sentence lint
      fix: 'Bring your feet in a bit and stop slightly higher.',
      claim: C(['MECH', 'CONSENSUS'], ['kinoshita2026', 'nasm-leg-press'], 'Inner-thigh work near the bottom: mechanics (adductor magnus extends the hip). The sharp-pull advice is consensus.') },
    { key: 'head', where: 'Head, a pounding or dizzy feeling', at: { parts: ['head', 'head-back'] },
      means: 'Holding your breath hard through heavy reps. Blood pressure on the double-leg press gets very high.',
      fix: 'Breathe out as you push. Lighter weight, and stop if you feel dizzy.',
      claim: CL.breath },
    // Architecture: presses carry this row. The leg press has no handle choice, so the fix is the card's grip rule.
    { key: 'wrist-sore', where: 'Wrist sore before you start', at: { parts: WRIST_PARTS },
      means: 'Any weight on a sore wrist can make it worse. Here your hands only hold you in the seat.',
      fix: 'Hold the handles lightly with your wrists level, and never push on your knees. Stop the set if it hurts.',
      zoom: 'hand', redFlag: true,
      claim: C(['CONSENSUS'], ['ace-leg-press', 'nasm-leg-press', 'nhs-wrist-pain'], 'Light grip: card (ACE "lightly grasp", NASM). NHS self-care: do not lift heavy things with wrist pain.') },
  ],
  libraryDiff: { add: ['adductors'], why: 'Library: primary quads and glutes, secondary hamstrings and calves. Card adds the inner thighs as a helper: the leg press grew the adductor magnus on MRI (Kinoshita 2026), and NASM lists the hip adductors as secondary.' },
  claim: CL.feel,
};

/* ------------------------------------------------------------------------------------------------ open items ----- */
// mockup: what this sheet still owes the verified card, for the supervisor and owner. Not user copy.
// knee-red-flag: closed 2026-09-30. The knee row links to the shared RED_FLAG_KNEE (howto/shared.mjs, NHS knee pain).
export const OPEN_ITEMS = [];

/* ------------------------------------------------------------------------------------------------ the HowTo ------ */
// Callouts unchanged: `balance` is not `push`, so no callout has to be the grip (2.1). The build adds the hand hotspot on
// the `grip` landmark and one hotspot per checkpoint with a zoom. The plate's Mistake stays the butt wink.
// The plate is the approved golden-A spec, unchanged (owner rule, plan S-2 condition 1). "Knees cave" is a front-view
// fault a side plate cannot show well; the approved plate still draws its tell, and the posture text keeps knee tracking.
const plate = plateSpec;

/* ---------------------------------------------------------------- handling mistakes, risks (plan 2.4 items 4, 7) --
 * From the verified card's handlingMistakes (grip/research/leg_press.json): the mistake, its fix and what it can hurt,
 * cut to the copy limits (title <= 10 words; fix and risk <= 30 words and 2 sentences; no citations in user copy, C7;
 * no red-flag wording, C8: the shared RED_FLAG and DISCLAIMER come from howto/shared.mjs). `zoom` = "Show me" target. */
const MISTAKES = [
  { key: 'deep', title: 'Going so deep your tailbone lifts', zoom: 'back-on-pad', claim: C(['CONSENSUS'], ['ace-leg-press']),
    fix: 'Stop just before your tailbone lifts, around 90 degrees at the knee for most people, and set the depth catch there.' },
  { key: 'lock', title: 'Snapping your knees straight at the top', claim: C(['CONSENSUS', 'WEAK'], ['ace-leg-press', 'barnds2019']),
    fix: 'Push until your legs are almost straight, keep a small bend, then start the next rep.' },
  { key: 'heels', title: 'Feet too low, heels lifting', zoom: 'foot', claim: C(['CONSENSUS', 'DATA'], ['ace-leg-press', 'escamilla2001lp']),
    fix: 'Move your feet up so the whole foot sits flat in the middle of the plate, and push through your whole foot, heels included.' },
  { key: 'knees', title: 'Knees falling in, or hands pushing on your knees', zoom: 'hand', claim: C(['CONSENSUS'], ['ace-leg-press']),
    fix: 'Keep your knees over your toes and your hands on the side handles. If you cannot finish a rep without your hands, take a plate off.' },
];
const RISKS = [
  { key: 'back', text: 'Going too deep rolls your pelvis off the seat, so your lower back bends under the whole weight of the sled.', claim: C(['CONSENSUS'], ['ace-leg-press']) },
  { key: 'lock', text: 'A knee snapped straight under a heavy load can bend the wrong way. It is rare, but doctors have reported it.',
    claim: C(['WEAK'], ['barnds2019'], 'One case report (A8 open item).') },
  { key: 'knees', text: 'Knees caving in twist the knee under load, and pushing on your knees bends your wrists back under part of the sled.', claim: C(['CONSENSUS'], ['ace-leg-press']) },
];

export default {
  schema: 1,
  id: 'lib_leg_press',
  rev: 1,
  plate,
  handling: {
    archetype: 'balance',
    // orientation left unset: the card says "take whatever shape the machine has", palms in or down.
    handle: 'pad-handle',
    loadAxis: 'across',     // archetype default; the lever check runs only for the push-on-knees fault drawing
    width: { text: 'Set by the machine: one handle beside each hip. Arms hang relaxed with a soft bend at the elbow, shoulders down and back on the pad.', claim: CL.width },
    thumb: { mode: 'wrapped', claim: CL.thumb },
    contact: 'finger-base',
    wrist: { ext: [0, 20], dev: [-10, 10], limitText: "Keep it level with your forearm. Don't let it curl forward, and never bend it far back under load.", claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: [PUSH_ON_KNEES],
    gripLine: 'Hold the side handles lightly with your thumbs wrapped round. They keep you in the seat, so leave your hands there and never push on your knees.',
    cue: 'Hold the handles lightly. Your hands stay there.',   // archetype cue (3.1)
  },
  contacts: ['foot-platform', 'seat-back'],
  setup: [
    { kind: 'load', text: 'Load the plates the same on both sides of the sled, with the catches locked and the sled resting on them.', claim: CL.load },
    { kind: 'adjust', text: 'If the back pad tilts, set it so you can sit deep and keep your lower back flat at the bottom. A more reclined pad changes the mix a little: more front of the thigh, less hamstring, and the glutes stay about the same.', zoom: 'back-on-pad', claim: C(['CONSENSUS', 'DATA'], ['ace-leg-press', 'marchetti2023']) },
    { kind: 'safety', text: 'If the machine has a depth selector (a pin or knob for the catch height), set it just below your lowest point. A failed rep then lands on the catch instead of your chest.', claim: CL.safety },
    { kind: 'get-in', text: 'Sit all the way back: hips into the corner of the seat, tailbone and lower back flat on the pad, head resting on the pad.', zoom: 'back-on-pad', claim: CL.back },
    { kind: 'position', text: 'Put your feet in the middle of the platform, about hip to shoulder width. Whole foot flat, heels down, toes straight ahead or turned out a little. Pick the width that feels best. It changes very little about which muscles work.', zoom: 'foot', claim: CL.feet },
    { kind: 'grip', text: 'Take the side handles lightly, thumbs wrapped round.', zoom: 'hand', claim: CL.grip },
    { kind: 'safety', text: 'Press the sled up a few centimetres and turn the release handles out to free it (on most machines). Check your knees still have a small bend.', claim: CL.safety },
    { kind: 'position', text: 'Lower under control until your knees are at about 90 degrees, or stop earlier if your tailbone starts to lift. Breathe out as you push back up.', zoom: 'back-on-pad', claim: C(['CONSENSUS', 'DATA'], ['ace-leg-press', 'nasm-leg-press', 'macdougall1985']) },
    { kind: 'finish', text: 'After the last rep, pause at the top and turn the handles back in. Let the sled settle on the catches before you take your feet off or let go.', claim: CL.safety },
  ],
  posture: [
    { key: 'back', label: 'Tailbone on pad', detail: 'Your lower back stays against the pad with no gap, from the first rep to the last and at the bottom. Your hips sit in the corner of the seat.',
      anchor: { landmark: 'sacrum', pose: 'end' }, zoom: 'back-on-pad', claim: CL.back },
    { key: 'feet', label: 'Whole foot flat', detail: 'Heels down, the middle of your foot roughly in the middle of the plate, toes straight or turned out a little. Push from your heel through the ball of your foot.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'foot', claim: CL.feet },
    { key: 'knees', label: 'Knees over toes', detail: 'Seen from the front, each knee stays over your second or third toe on the way down and up. It never falls inward.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.kneesIn },   // text only: needs a front view of the sled (5.2)
    { key: 'depth', label: 'About 90 degrees', detail: 'At the bottom your knees bend to about 90 degrees, your thighs stay clear of your ribs and your tailbone stays on the pad. This is the stop point for most people.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'back-on-pad', claim: CL.depth },
    { key: 'soft', label: 'Soft knees', detail: 'At the top your legs are almost straight, with a small bend you can see at the knee, so your muscles keep holding the weight.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.lockout },   // the plate's own "Soft knees" callout
    { key: 'hands', label: 'Hands light', detail: 'Arms relaxed beside your body, shoulders and head back on the pad, hands wrapped lightly round the side handles.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'hand', claim: CL.grip },
  ],
  feel,
  zooms,
  copy: {
    setupLine: 'Sit right back so your tailbone touches the pad. Feet in the middle of the platform, about hip width or a little wider, whole foot flat with heels down.',
    mistakeLine: 'Keep a small bend in your knees at the top, and on the way down stop before your tailbone lifts.',
    gripLine: 'Hold the side handles lightly with your thumbs wrapped round. They keep you in the seat, so leave your hands there and never push on your knees.',
  },
  redFlag: RED_FLAG,
  openItems: OPEN_ITEMS,   // mockup
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist', 'knee'],
  sources: Object.keys(SOURCES),
  research: { card: 'grip/research/leg_press.json', rev: 1 },
};
