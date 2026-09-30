// How-to content for the dumbbell lateral raise (architecture grip/GRIP-AND-FEEL-ARCHITECTURE.md 4.1-4.4, appendix A2).
// Source of every user-visible line: the verified card grip/research/dumbbell_lateral_raise.json (verifier 2026-09-30).
// Edits against the card, each for a written rule:
//   - grip line: A2's replacement ("never lower" read two ways).
//   - setup step 2: the study reference is dropped (A2 "fix before spec"); "(ACE)" is dropped from steps 2 and 5
//     (sources are never shown in user copy, 4.1 Claim).
//   - row "sharp pinch": "means" cut to 30 words and 2 sentences (FeelRow limit); the fix's own "get it checked by a
//     physio" is dropped (C8: fixes never carry red-flag wording); the row links to the shared shoulder block instead
//     (redFlag: 'shoulder', NHS shoulder pain).
// Point references use the plate engine's form ({ at, pose, off }), SPEC.md 3, resolved on the approved plate below.
// The plate is the approved golden-A lateral raise, ref-src/plate.mjs (owner rule; plan S-2 condition 1), NOT the newer
// engine re-draw exercises/dumbbell_lateral_raise.mjs. The posture crops (howto/render-dumbbell_lateral_raise.mjs) are
// cut from this same approved drawing.
import { plate as refPlate } from '../ref-src/plate.mjs';
// RED_FLAG (and any other shared safety copy) comes from the one shared module (plan S-2 condition 4); re-exported
// for the render scripts. DISCLAIMER is shown once per sheet by the page, from the same module.
import { RED_FLAG } from '../howto/shared.mjs';
export { RED_FLAG };

const plate = { source: 'ref-src/plate.mjs', render: refPlate, id: 'dumbbell_lateral_raise', name: 'Dumbbell Lateral Raise', view: 'front' };

const CHECKED = '2026-09-30';
/** Source registry entries for this exercise (4.1 Source). `access` = what the card's verifier read. */
export const SOURCES = {
  'ace-lateral-raise': { id: 'ace-lateral-raise', cite: 'ACE Exercise Library, Lateral Raise', url: 'https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/', kind: 'guideline', access: 'full', checked: CHECKED },
  coratella2020: { id: 'coratella2020', cite: 'Coratella G et al. (2020) An Electromyographic Analysis of Lateral Raise Variations and Frontal Raise in Competitive Bodybuilders. Int J Environ Res Public Health 17(17):6015', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7503819/', kind: 'peer-reviewed', access: 'full', checked: CHECKED },
  graichen1999: { id: 'graichen1999', cite: 'Graichen H et al. (1999) Subacromial space width changes during abduction and rotation, a 3-D MR imaging study. Surg Radiol Anat 21(1):59-64', url: 'https://pubmed.ncbi.nlm.nih.gov/10370995/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  kolber2014: { id: 'kolber2014', cite: 'Kolber MJ et al. (2014) Characteristics of shoulder impingement in the recreational weight-training population. J Strength Cond Res 28(4):1081-9', url: 'https://pubmed.ncbi.nlm.nih.gov/24077379/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  kolber2010: { id: 'kolber2010', cite: 'Kolber MJ et al. (2010) Shoulder injuries attributed to resistance training: a brief review. J Strength Cond Res 24(6):1696-704', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  andersen2008: { id: 'andersen2008', cite: 'Andersen LL et al. (2008) Muscle activation during selected strength exercises in women with chronic neck muscle pain. Phys Ther 88(6):703-11', url: 'https://pubmed.ncbi.nlm.nih.gov/18339796/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  sporrong1995: { id: 'sporrong1995', cite: 'Sporrong H et al. (1995) Influences of handgrip on shoulder muscle activity. Eur J Appl Physiol 71(6):485-92', url: 'https://pubmed.ncbi.nlm.nih.gov/8983914/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  sporrong1996: { id: 'sporrong1996', cite: 'Sporrong H et al. (1996) Hand grip increases shoulder muscle activity. Acta Orthop Scand 67(5):485-90', url: 'https://pubmed.ncbi.nlm.nih.gov/8948256/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  weiss1995: { id: 'weiss1995', cite: 'Weiss ND et al. (1995) Position of the wrist associated with the lowest carpal-tunnel pressure. J Bone Joint Surg Am 77(11):1695-9', url: 'https://pubmed.ncbi.nlm.nih.gov/7593079/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  jakobsen2012: { id: 'jakobsen2012', cite: 'Jakobsen MD et al. (2012) Evaluation of muscle activity during a standardized shoulder resistance training bout in novice individuals. J Strength Cond Res 26(9):2515-22', url: 'https://pubmed.ncbi.nlm.nih.gov/22067242/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  'nhs-wrist-pain': { id: 'nhs-wrist-pain', cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/', kind: 'guideline', access: 'full', checked: CHECKED },   // RED_FLAG source (architecture 4.2)
  'nhs-shoulder-pain': { id: 'nhs-shoulder-pain', cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/', kind: 'guideline', access: 'full', checked: CHECKED },   // RED_FLAG_SHOULDER source
};
/** "Where this comes from": one plain evidence label per source, from the card's evidence notes (shown with the cite). */
export const EVIDENCE_LABELS = {
  'ace-lateral-raise': { tag: 'CONSENSUS', text: 'Coaching guide. Grip, elbows lead, shoulders down, stop at shoulder height.' },
  coratella2020: { tag: 'DATA', text: 'Muscle activity study, 10 competitive bodybuilders, seated. Thumbs forward works the side shoulder at least as well as any version; thumbs down adds upper trap work.' },
  graichen1999: { tag: 'MECH', text: 'MRI of 12 healthy shoulders. Shows the space under the shoulder roof shrinking as the arm goes higher. Anatomy, not injuries.' },
  kolber2014: { tag: 'DATA', text: '77 lifters. Raises above shoulder height went with signs of impingement. An association, not proof of cause.' },
  kolber2010: { tag: 'CONSENSUS', text: 'Review of shoulder injuries from weight training.' },
  andersen2008: { tag: 'DATA', text: 'Muscle activity in 12 women with neck pain. Lateral raises work the upper traps hard, so some trap work is normal.' },
  sporrong1995: { tag: 'WEAK', text: 'Grip gauge study, not dumbbells. A hard squeeze made the rotator cuff work harder with the arm raised.' },
  sporrong1996: { tag: 'WEAK', text: 'Grip gauge study, not dumbbells. Same finding as the 1995 study.' },
  weiss1995: { tag: 'MECH', text: 'Nerve pressure in the wrist is lowest near a straight wrist. Not a lifting study.' },
  jakobsen2012: { tag: 'WEAK', text: '12 novice women. Light loads for 15 reps were still hard work for the shoulder muscles.' },
  'nhs-wrist-pain': { tag: 'CONSENSUS', text: 'When wrist pain needs a check.' },
  'nhs-shoulder-pain': { tag: 'CONSENSUS', text: 'When shoulder pain needs a check.' },
};


const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });

// ---- hand (architecture 3.1 `hold`, 4.2) ----
// The hand is drawn where the `fingertip-hang` fault happens: at the top of the raise, the lifter's left arm at shoulder
// height, seen from the front. Palm down and thumb forward, so the thumb side faces the camera and the wrist's
// up-and-down bend lies flat on the screen (5.1 'radial' view); the handle runs front to back, so it is seen end-on
// with the dumbbell head as a dashed circle behind it. forearm 90 = pointing screen right, back of the hand up.
// Physics: the weight hangs straight down from the handle, which sits out past the wrist, so it turns the hand down
// toward the palm (wrist flexion, ext < 0). Mid-palm the forearm holds that easily and the wrist stays straight; out
// in the fingers the lever is longer and the hand droops. The load acts across the forearm here (loadAxis 'across'),
// so no along-forearm force line is drawn (5.1: force line only for 'along-forearm'); the render script removes it.
const RIGHT_POSE = { view: 'radial', forearm: 90, wrist: { ext: 0, dev: 0 }, contactAt: 0.6, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm',
  handle: { profile: 'dumbbell', axis: 'across' }, load: { kind: 'gravity' } };
const FAULT_FINGERTIP = {
  key: 'fingertip-hang', label: 'In the fingers',
  // handle out past the finger bends (contactAt 1.45 of 1.6 = tips), fingers peeling open, thumb off the handle, and
  // the hand drooping 28 deg toward the palm (flexion): past the card's 15 deg limit (drawing check, not an injury
  // threshold, 3.1.1). The droop is the `hold` row's fingertip-hang (3.1), not the `cocked` (bent back) fault.
  pose: { wrist: { ext: -28, dev: 0 }, contactAt: 1.45, fingers: { curl: 1, open: 0.35 }, thumb: 'loose' },
  markers: ['lever-arc', 'slip-arrow'],
  alt: 'Same view. The handle hangs out in the fingertips, fingers opening, thumb off the handle. The weight sits far out past the wrist and pulls the hand down, so it droops about 28 degrees below the line of the forearm.',
};
// Top of the rep, end-on inset (the card's "thumb vs little finger"): drawn by howto/end-on-inset.mjs until hand.mjs has an
// 'end-on' view. rollDeg = how far the little-finger end sits above the thumb end (+ = little finger higher).
const FAULT_LITTLE_FINGER_UP = {
  key: 'little-finger-up', label: 'Little finger up',
  pose: { view: 'end-on', handle: { profile: 'dumbbell', axis: 'along' }, rollDeg: 22 },
  markers: ['lever-arc'],
  alt: 'At the top, the little-finger end of the dumbbell is clearly higher than the thumb end, like pouring a jug. The upper arm turns in.',
};

/* ---------------------------------------------------------------- handling mistakes, risks (plan 2.4 items 4, 7) --
 * From the verified card's handlingMistakes (grip/research/dumbbell_lateral_raise.json): the mistake, its fix and what it can hurt,
 * cut to the copy limits (title <= 10 words; fix and risk <= 30 words and 2 sentences; no citations in user copy, C7;
 * no red-flag wording, C8: the shared RED_FLAG and DISCLAIMER come from howto/shared.mjs). `zoom` = "Show me" target. */
const MISTAKES = [
  { key: 'tip', title: 'Little finger higher than the thumb at the top', zoom: 'hand', claim: C(['CONSENSUS', 'DATA'], ['ace-lateral-raise', 'coratella2020']),
    fix: 'At the top keep your palms facing the floor, with the thumb end of the dumbbell level with the little-finger end.' },
  { key: 'swing', title: 'Going too heavy, then swinging and shrugging', zoom: 'shoulders', claim: C(['CONSENSUS', 'DATA'], ['ace-lateral-raise', 'andersen2008']),
    fix: 'Drop to a weight you can raise 12 to 20 times with your body still and your shoulders down. Sit on a bench if you keep swinging.' },
  { key: 'high', title: 'Raising above shoulder height', zoom: 'top-height', claim: C(['CONSENSUS', 'DATA'], ['ace-lateral-raise', 'kolber2014']),
    fix: 'Stop when your upper arms are level with your shoulders, then lower under control.' },
  { key: 'fingers', title: 'Handle in the fingers, wrist bent', zoom: 'hand', claim: C(['CONSENSUS', 'WEAK'], ['ace-lateral-raise', 'sporrong1995']),
    fix: 'Reset the handle across the middle of your palm, wrap your thumb, keep your knuckles in line with your forearm and let the elbows lead.' },
];
const RISKS = [
  { key: 'pinch', text: 'Going above shoulder height, or tipping your little finger up, narrows the space under the shoulder roof and can pinch the tendon there.',
    claim: C(['MECH', 'DATA'], ['graichen1999', 'kolber2014'], 'Graichen 1999: anatomy in healthy volunteers. Kolber 2014: association, not cause.') },
  { key: 'neck', text: 'Shrugging and swinging put the work on your neck and low back instead of the side of your shoulders.',
    claim: C(['DATA', 'CONSENSUS'], ['andersen2008', 'ace-lateral-raise'], 'The injury link is coaching consensus.') },
  { key: 'grip', text: 'With the handle in your fingers the weight bends your wrist, and the harder squeeze adds work for your forearm and shoulder.',
    claim: C(['WEAK', 'CONSENSUS'], ['sporrong1995', 'sporrong1996'], 'Grip-gauge studies, not dumbbells.') },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_lateral_raise',
  rev: 1,
  plate,
  handling: {
    archetype: 'hold',
    orientation: 'neutral',            // palms face the thighs at the start and turn to face the floor as the arms rise
    handle: 'dumbbell',
    loadAxis: 'across',                // archetype default for `hold`: no push lever check (3.1.1)
    overBody: false,
    width: { text: 'One dumbbell per hand, beside the outside of each thigh, hands about hip width apart. Hold the middle of the handle so the dumbbell hangs level.', claim: C(['CONSENSUS'], ['ace-lateral-raise']) },
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS', 'WEAK'], ['ace-lateral-raise', 'sporrong1995', 'sporrong1996'], 'ACE: closed grip, thumbs round the handles. Sporrong: grip-gauge studies, not dumbbells; a reason to avoid a death grip, not proof of harm. No data for the thumbless grip.') },
    contact: 'mid-palm',
    wrist: { ext: [-10, 10], dev: [-10, 10], limitText: 'If your hand tips more than about 15 degrees up or down from your forearm, the dumbbell is too heavy or you are lifting with your hands.',
      claim: C(['CONSENSUS', 'MECH'], ['ace-lateral-raise', 'coratella2020', 'weiss1995'], 'Straight wrist: ACE and the Coratella 2020 protocol. The 15 degree limit is coaching consensus, not a measured injury threshold. Weiss 1995 is nerve pressure, MECH/WEAK for this use.') },
    pose: RIGHT_POSE,
    faults: [FAULT_FINGERTIP, FAULT_LITTLE_FINGER_UP],
    gripLine: 'Hold the handle across the middle of your palm with your thumb wrapped and your wrist straight. At the top, your thumb stays level with your little finger or a touch higher.',
    cue: 'Keep your wrist in line with your forearm.',   // `hold` archetype default cue (3.1)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick light dumbbells: a weight you can raise 12 to 20 times with no swing and no shrug. If you have to lean back or jerk the first rep, go down a size.',
      claim: C(['CONSENSUS', 'WEAK'], ['ace-lateral-raise', 'jakobsen2012'], '12 to 20 reps is consensus; Jakobsen 2012 only shows 15RM loads are still hard work in novices.') },
    { kind: 'position', text: 'Stand with feet about hip width apart or a little wider, or in a short split stance for balance. Knees soft. If you tend to swing, sit on a bench instead.',
      claim: C(['CONSENSUS'], ['ace-lateral-raise', 'coratella2020'], 'Split stance: ACE. Seated: the Coratella 2020 protocol (reference dropped from user copy, A2).') },
    { kind: 'grip', text: 'Grip: handle across the middle of the palm, thumb wrapped, wrist straight, dumbbells beside the outside of your thighs, palms facing in.', zoom: 'hand',
      claim: C(['CONSENSUS'], ['ace-lateral-raise']) },
    { kind: 'position', text: 'Unlock the elbows into a small bend, about 10 to 20 degrees, and keep that bend for the whole set.', zoom: 'top-height',
      claim: C(['CONSENSUS'], ['ace-lateral-raise'], 'The 10 to 20 degree range is consensus.') },
    { kind: 'brace', text: 'Set your shoulders down away from your ears and slightly back before the first rep, so your neck looks long.', zoom: 'shoulders',
      claim: C(['CONSENSUS'], ['ace-lateral-raise']) },
    { kind: 'position', text: 'Bring your arms a little forward of your sides, so the dumbbells travel slightly in front of your body instead of straight out to the sides or behind you. Do not roll the arms inward to do this; the thumbs stay level with the little fingers.',
      claim: C(['CONSENSUS'], ['ace-lateral-raise'], '20 to 30 degrees in front of the body (scapular plane) is consensus; no top-down drawing yet (5.2).') },
  ],
  posture: [
    { key: 'tall', label: 'Stand tall', detail: 'Ear, shoulder, hip and ankle roughly stacked, knees soft, low back in its normal small curve. The torso does not rock back to start the dumbbells moving.',
      anchor: { at: 'sternum' }, claim: C(['CONSENSUS'], ['ace-lateral-raise']) },   // side view: text only (the plate is a front view)
    { key: 'shoulders', label: 'Shoulders down', detail: 'Clear space between the tops of the shoulders and the ears, at the bottom and at the top of the rep. The shoulders do not ride up toward the ears as the dumbbells rise.',
      anchor: { at: 'trap.l' }, zoom: 'shoulders', claim: C(['CONSENSUS', 'DATA'], ['ace-lateral-raise', 'andersen2008']) },
    { key: 'elbows', label: 'Elbows lead', detail: 'The elbows rise first and stay level with or slightly above the hands. Fixed small bend in the elbow, about 10 to 20 degrees.',
      anchor: { at: 'elbow.l', off: [0, -5.4] }, claim: C(['CONSENSUS'], ['ace-lateral-raise']) },
    { key: 'stop', label: 'Shoulder height', detail: 'At the top the upper arms are level with the shoulders, about 90 degrees from the body and parallel to the floor, and no higher.',
      anchor: { at: 'elbow.r' }, zoom: 'top-height', claim: C(['CONSENSUS', 'DATA', 'MECH'], ['ace-lateral-raise', 'kolber2014', 'graichen1999']) },
    { key: 'forward', label: 'Slightly forward', detail: 'Seen from above, the arms sit about 20 to 30 degrees in front of the line of the shoulders, not straight out to the side or behind the body.',
      anchor: { at: 'grip.l' }, claim: C(['CONSENSUS'], ['ace-lateral-raise'], 'Top-down view: text checkpoint until the engine has a top view (5.2).') },
    { key: 'wrist-top', label: 'Thumb level', detail: 'At the top: palm facing the floor, knuckles in line with the forearm, the thumb end of the dumbbell level with the little-finger end or a touch higher.',
      anchor: { at: 'grip.r' }, zoom: 'hand', claim: C(['CONSENSUS', 'DATA'], ['ace-lateral-raise', 'coratella2020']) },
  ],
  feel: {
    primary: [{ muscleId: 'side_delts', plain: 'The round cap on the outside of each shoulder, the part that makes the shoulders look wide.' }],
    secondary: [
      { muscleId: 'upper_traps', plain: 'A little work at the top of the shoulders near the neck, mostly in the last part of the raise. Some of this is normal.' },
      { muscleId: 'front_delts', plain: 'A light share at the front of the shoulder, more if your arms drift forward.' },
    ],
    // "Should not take over": dashed outline ONLY while a row naming the muscle is open (S6). upper_traps and
    // front_delts are also helpers on purpose (some work is normal, taking over is the fault); they show as helpers
    // at rest (5.3).
    watch: [
      { muscleId: 'upper_traps', plain: 'If the burn is mostly in your neck and the top of your shoulders, the traps are doing the lifting.' },
      { muscleId: 'front_delts', plain: 'If the front of the shoulder does most of the work, the move has turned into a front raise.' },
      { muscleId: 'forearms', plain: 'Your forearms should only be holding the dumbbell, not getting pumped.' },
      { muscleId: 'lower_back', plain: 'Your low back should not be working at all. If it is, you are swinging.' },
    ],
    feelLine: 'You should feel this on the outside of your shoulders, the round cap. If your neck and the top of your shoulders are doing most of the work, go lighter and keep your shoulders down.',
    rows: [
      { key: 'traps', where: 'Neck and the top of the shoulders', at: { muscles: ['upper_traps'] },
        means: 'You are shrugging, the weight is too heavy, or you are going above shoulder height. Some trap work is normal in this exercise.',
        fix: 'Go lighter, set your shoulders down before each rep, and stop when your arms are level with your shoulders.',
        zoom: 'shoulders', claim: C(['DATA', 'CONSENSUS'], ['andersen2008', 'coratella2020', 'ace-lateral-raise']) },
      { key: 'front', where: 'Front of the shoulders', at: { muscles: ['front_delts'] },
        means: 'Your arms are drifting forward into a front raise, or your hands are rising ahead of your elbows.',
        fix: 'Open the arms out so they are only a little in front of your body, and let the elbows lead.',
        claim: C(['CONSENSUS'], ['ace-lateral-raise']) },
      { key: 'pinch', where: 'A sharp pinch at the top or front of the shoulder', at: {},   // rotator_cuff has no drawn region: no map mark
        means: 'You are tipping your little finger up or going too high, which can squeeze the space under the shoulder roof. A pinch is a warning, not the feeling you want.',
        fix: 'Keep your thumb level with your little finger, stop at shoulder height, and go lighter. If it still pinches, stop the exercise.',
        zoom: 'top-height', redFlag: 'shoulder', claim: C(['MECH', 'DATA', 'CONSENSUS'], ['graichen1999', 'kolber2014', 'coratella2020', 'nhs-shoulder-pain'], 'Graichen: anatomy, not injuries. Kolber 2014: association, not cause. The referral is the shared shoulder red flag (NHS), not the fix text (C8).') },
      { key: 'forearms', where: 'Forearms or wrists', at: { muscles: ['forearms'] },   // dashed outline only (watch); no solid hand mark (2.6)
        means: 'You are squeezing too hard, the handle has slipped into your fingers, or your wrist is bent.',
        fix: 'Put the handle across the middle of your palm, wrap your thumb, hold firmly but relaxed, and keep your knuckles in line with your forearm.',
        zoom: 'hand', redFlag: true, claim: C(['CONSENSUS', 'WEAK'], ['ace-lateral-raise', 'sporrong1995', 'sporrong1996', 'nhs-wrist-pain']) },
      { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
        means: 'You are leaning back to swing the weight up.',
        fix: 'Go lighter and keep your body still, or do the set seated or in a split stance.',
        claim: C(['CONSENSUS'], ['ace-lateral-raise'], 'Swinging and low-back strain: coaching consensus, no direct data.') },
    ],
    libraryDiff: { add: ['front_delts'], why: 'The card adds the front shoulders as a light helper (Coratella 2020 EMG; more if the arms drift forward). exercises.json lists side_delts primary and upper_traps secondary only.' },
    claim: C(['DATA', 'CONSENSUS'], ['coratella2020', 'andersen2008'], 'Coratella 2020: 10 male competitive bodybuilders, seated, 8RM; may not transfer exactly to beginners.'),
  },
  zooms: [
    {
      key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',
      hand: {
        right: RIGHT_POSE,
        wrong: [FAULT_FINGERTIP],
        camera: 'front',                 // hand.mjs prints only "above" or "side": the render script prints cameraLabel (engine gap)
        cameraLabel: 'Front view, arm at shoulder height',   // fits the 358 px row with margin at 390 px
        inset: { label: 'Thumb vs little finger, at the top', camera: 'side', cameraLabel: 'Seen from the side', pose: FAULT_LITTLE_FINGER_UP.pose,
          right: { rollDeg: 0, note: 'Level' }, wrong: { rollDeg: 22, note: 'Little finger up' } },
      },
      caption: { right: 'Handle across the middle of the palm, thumb wrapped, wrist straight.',
        wrong: 'Handle in the fingers, thumb loose, the weight pulls the hand down.' },
      alt: {
        right: 'Arm at shoulder height, seen from the front, palm facing the floor. Handle across the middle of the palm, fingers and thumb wrapped round it, knuckles in line with the forearm.',
        wrong: FAULT_FINGERTIP.alt,
        insetRight: 'At the top, seen from the side: the thumb end and the little-finger end of the dumbbell are level.',
        insetWrong: FAULT_LITTLE_FINGER_UP.alt,
      },
      feelRow: 'forearms',
      feelPrompt: 'Forearms doing the work? This is usually why.',   // link to the row (2.7 S3 wireframe)
    },
    {
      key: 'top-height', chip: 'Top height', heading: 'Top height: right and wrong', kind: 'posture',
      crop: { center: { along: ['shoulder.r', 'grip.r'], t: 0.42, off: [0, -14] }, sizePx: 152 },
      right: 'end',
      // the approved plate's own arm (ref-src arm(), elbow 14, elbows-lead 8) raised to 118 deg, dashed over the right
      // position. hideInside: the dashed arm is not drawn inside the right arm's own outline, so it reads as one arm
      // rising from the shoulder above the level line (render script, mask)
      wrong: { abd: 118, hideInside: ['shcap.r', 'upper.r'] },
      // zoom-only overlay: a level line at shoulder height across the whole crop (accent in Right, quiet in Wrong)
      guides: [{ kind: 'level', at: 'shoulder.r' }],
      callout: {
        right: { text: 'Shoulder height', anchor: { at: 'elbow.r', off: [0, -6] } },
        wrong: { text: 'Too high', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, -6] } },
      },
      caption: { right: 'Upper arm level with the shoulder, elbow level with or just above the hand.',
        wrong: 'Arm raised well above shoulder height.' },
      alt: {
        right: 'Front view of the right arm at the top: the upper arm is level with the shoulder line, the elbow slightly bent and level with or just above the hand.',
        wrong: 'The same arm raised well above the shoulder line, drawn dashed over the right position.',
      },
      feelRow: 'pinch',
      feelPrompt: 'A sharp pinch at the top of the shoulder? This is usually why.',
    },
    {
      key: 'shoulders', chip: 'Shoulders', heading: 'Shoulders: right and wrong', kind: 'posture',
      crop: { center: { at: 'neck', off: [0, 2] }, sizePx: 118 },
      right: 'end',
      // the approved plate's own Mistake drawing (ref-src plate, mistake: true): the raised trap lines and the shrug arrow
      wrong: 'mistake',
      callout: {
        right: { text: 'Neck<br>long', anchor: { at: 'trap.l', off: [3, -1] } },
        wrong: { text: 'Shrug', anchor: { at: 'trap.l', pose: 'mistake', off: [6, -19] } },
      },
      caption: { right: 'Shoulders down, clear space between shoulders and ears.',
        wrong: 'Shoulders hunched up toward the ears.' },
      alt: {
        right: 'Front view of the neck and shoulders at the top of the raise: shoulders down, a clear gap between the shoulders and the ears.',
        wrong: 'The shoulders shrugged up toward the ears: the raised shoulder line and an up arrow, drawn in the mistake colour over the right position.',
      },
      feelRow: 'traps',
      feelPrompt: 'Feel it mostly in your neck? This is usually why.',
    },
  ],
  // Chip row = the zooms in order, then "Where to feel it" (always last, 2.1). 4 chips.
  chips: ['hand', 'top-height', 'shoulders', 'feel'],
  copy: {
    setupLine: 'Pick a weight you can raise 12 to 20 times without swinging. Stand tall, shoulders down, elbows a little bent, arms slightly in front of you.',
    mistakeLine: 'Stop when your arms are level with your shoulders. Going higher, or tipping your little finger up, can pinch the top of your shoulder.',
  },
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['wrist', 'shoulder'],
  sources: ['ace-lateral-raise', 'coratella2020', 'graichen1999', 'kolber2014', 'kolber2010', 'andersen2008', 'sporrong1995', 'sporrong1996', 'weiss1995', 'jakobsen2012', 'nhs-wrist-pain', 'nhs-shoulder-pain'],
  research: { card: 'grip/research/dumbbell_lateral_raise.json', rev: 1 },
};

// KNOWN GAPS (for the supervisor):
// - No "Wrist sore before you start" row: that row is for presses (A1); this is a `hold` exercise.
// - The shared RED_FLAG is about wrists (NHS wrist pain). It shows under the "Forearms or wrists" row. The shoulder
//   pinch row links to the shared RED_FLAG_SHOULDER (NHS shoulder pain) in place of the card's "get it checked by a
//   physio" (dropped under C8). Closed 2026-09-30 (golden-B review).
// - "Arms slightly in front of the body" and "Stand tall" (side view) stay text: no top view or side plate yet.
