// How-to content for the hanging leg raise (architecture grip/GRIP-AND-FEEL-ARCHITECTURE.md 4.1-4.4, appendix A5).
// Source of every user-visible line: the verified card grip/research/hanging_leg_raise.json (corrected card; GENERAL.md
// wording is superseded and not used). Edits against the card, each for a written rule:
//   - feelLine: the card's line has 46 words (C7 cap 40). Appendix A5's approved 39-word rewrite is used.
//   - row "low-back" fix: 33 words -> 30 (FeelRow cap 30): "with your back on the pad" -> "back on the pad", "Start
//     from a still hang" -> "Start each rep still" (the card's own handling fix: "Start every rep from a still hang"),
//     "lower slower" -> "lower slowly", "If it still aches" -> "If it keeps aching". "At the top" is kept: the timing of
//     the curl is the point of the cue. (The reviewer's suggested wording counted 32 words, over the cap.)
//   - row "forearms" fix: started "Bar at the base..." (C7: a fix starts with a verb) -> "Put the bar at the base...".
//   - row "wrist" fix: kept; the shared RED_FLAG block shows under it (redFlag: true), no own red-flag wording (C8).
//   - setup step 2 (box): "make sure the box is well clear" -> "check the box is well clear" (C7 bans "make sure"),
//     "on the way down" -> "coming down" (C7: a sentence has at most 25 words).
//   - setup step 4 (grip): the colon became a full stop (C7: the card's sentence has 26 words).
//   - posture details: the card's camera prefixes ("Front or back view:", "Side view ...:") and the drawing notes
//     ("Draw the pelvis tilted back ... against a dashed vertical") and citations ("(Yessis, expert opinion)") are
//     not user copy. Each detail is the card's own "what right looks like" in plain words.
//   - posture label "Legs past hip height" (4 words, cap 3) -> "Legs past hips". Its detail keeps the card's (Yessis)
//     meaning without a number: early in the lift it is mostly the hips, the pelvis curls as the legs rise higher. It
//     does not move the card's 30-45 degree point to hip height.
//   - cue: the card's "Hook with the fingers, wrap the thumb." (7 words). The `hang` archetype default "Hook it with
//     your fingers, then wrap your thumb." has 9 words, over the 8-word cue cap.
// Point references use the plate engine's form ({ at, pose, off }), SPEC.md 3.
import plate from './hanging_leg_raise.mjs';
import { landmarksOf } from '../engine/index.mjs';
import { bladeOutlines } from './pull_up.howto.mjs';   // the shoulder blades from behind, shared with the pull-up
// RED_FLAG (and any other shared safety copy) comes from the one shared module (plan S-2 condition 4); re-exported
// for the render scripts. DISCLAIMER is shown once per sheet by the page, from the same module.
import { RED_FLAG } from '../howto/shared.mjs';
export { RED_FLAG };

const CHECKED = '2026-09-30';
// `access`: the card's verifier pass (evidenceNotes, 2026-09-30) re-read the PubMed abstracts of the peer-reviewed
// papers and opened the coach, ACE and textbook pages. So papers are 'abstract', web pages 'full'.
export const SOURCES = {
  mcgill2015: { id: 'mcgill2015', cite: 'McGill S, Andersen J, Cannon J (2015) Muscle activity and spine load during anterior chain whole body linkage exercises: the body saw, hanging leg raise and walkout from a push-up. J Sports Sci 33(4):419-26', url: 'https://pubmed.ncbi.nlm.nih.gov/25111163/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  escamilla2006: { id: 'escamilla2006', cite: 'Escamilla RF et al. (2006) Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training. Phys Ther 86(5):656-71', url: 'https://pubmed.ncbi.nlm.nih.gov/16649890/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  axler1997: { id: 'axler1997', cite: 'Axler CT, McGill SM (1997) Low back loads over a variety of abdominal exercises: searching for the safest abdominal challenge. Med Sci Sports Exerc 29(6):804-11', url: 'https://pubmed.ncbi.nlm.nih.gov/9219209/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  workman2008: { id: 'workman2008', cite: 'Workman JC, Docherty D, Parfrey KC, Behm DG (2008) Influence of pelvis position on the activation of abdominal and hip flexor muscles. J Strength Cond Res 22(5):1563-9', url: 'https://pubmed.ncbi.nlm.nih.gov/18714231/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  andersson1997: { id: 'andersson1997', cite: 'Andersson EA, Nilsson J, Ma Z, Thorstensson A (1997) Abdominal and hip flexor muscle activation during various training exercises. Eur J Appl Physiol 75(2):115-23', url: 'https://pubmed.ncbi.nlm.nih.gov/9118976/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  juker1998: { id: 'juker1998', cite: 'Juker D, McGill S, Kropf P, Steffen T (1998) Quantitative intramuscular myoelectric activity of lumbar portions of psoas and the abdominal wall during a wide variety of tasks. Med Sci Sports Exerc 30(2):301-10', url: 'https://pubmed.ncbi.nlm.nih.gov/9502361/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  jukic2021: { id: 'jukic2021', cite: 'Jukic I et al. (2021) Ergogenic effects of lifting straps on movement velocity, grip strength, perceived exertion and grip security during the deadlift exercise. Physiol Behav 229:113283', url: 'https://pubmed.ncbi.nlm.nih.gov/33306977/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  valerio2021: { id: 'valerio2021', cite: 'Valerio DF et al. (2021) The effects of lifting straps in maximum strength, number of repetitions and muscle activation during lat pull-down. Sports Biomech 20(7):858-65', url: 'https://pubmed.ncbi.nlm.nih.gov/31198105/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  martins2026: { id: 'martins2026', cite: 'Martins R et al. (2026) Are lifting straps a game changer for resistance training or an overrated tool? Int J Sports Physiol Perform 21(3):342-9', url: 'https://pubmed.ncbi.nlm.nih.gov/41569827/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  odriscoll1992: { id: 'odriscoll1992', cite: "O'Driscoll SW et al. (1992) The relationship between wrist position, grasp size, and grip strength. J Hand Surg Am 17(1):169-77", url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  prinold2016: { id: 'prinold2016', cite: 'Prinold JA, Bull AM (2016) Scapula kinematics of pull-up techniques: avoiding impingement risk with training changes. J Sci Med Sport 19(8):629-35', url: 'https://pubmed.ncbi.nlm.nih.gov/26383875/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  kolber2010: { id: 'kolber2010', cite: 'Kolber MJ et al. (2010) Shoulder injuries attributed to resistance training: a brief review. J Strength Cond Res 24(6):1696-704', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/', kind: 'peer-reviewed', access: 'abstract', checked: CHECKED },
  'ace-abs': { id: 'ace-abs', cite: 'ACE-sponsored study (Francis, San Diego State University): best and worst abdominal exercises (press release)', url: 'https://www.acefitness.org/about-ace/press-room/press-releases/246/american-council-on-exercise-ace-sponsored-study-reveals-best-and-worst-abdominal-exercises/', kind: 'guideline', access: 'full', checked: CHECKED },
  'catalyst-hlr': { id: 'catalyst-hlr', cite: 'Catalyst Athletics, Hanging Leg Raise', url: 'https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/', kind: 'coach', access: 'full', checked: CHECKED },
  'catalyst-scap': { id: 'catalyst-scap', cite: 'Catalyst Athletics, Scap Pull-Up', url: 'https://catalystathletics.com/exercise/918/Scap-Pull-Up/', kind: 'coach', access: 'full', checked: CHECKED },
  'yessis-hlr': { id: 'yessis-hlr', cite: 'Yessis M, Hanging Leg Raise', url: 'https://doctoryessis.com/2013/01/01/hanging-leg-raise/', kind: 'coach', access: 'full', checked: CHECKED },
  'strengthlog-hlr': { id: 'strengthlog-hlr', cite: 'StrengthLog, Hanging Leg Raise', url: 'https://www.strengthlog.com/hanging-leg-raise/', kind: 'coach', access: 'full', checked: CHECKED },
  'baechle-earle': { id: 'baechle-earle', cite: 'Baechle TR, Earle RW, Weight Training: Steps to Success (NSCA editors), grip selection and location', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location', kind: 'guideline', access: 'full', checked: CHECKED },
  'wiki-leg-raise': { id: 'wiki-leg-raise', cite: 'Leg raise, Wikipedia', url: 'https://en.wikipedia.org/wiki/Leg_raise', kind: 'secondary', access: 'full', checked: CHECKED },
  'nhs-wrist-pain': { id: 'nhs-wrist-pain', cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/', kind: 'guideline', access: 'full', checked: CHECKED },   // RED_FLAG source (architecture 4.2)
};
// The card's last source ("Project research: GENERAL.md and pull_up.json") is internal, not a citation, so it is not in
// the registry. It is kept as `research.related`.

/** "Where this comes from": one plain evidence label per source, from the card's evidence notes (shown with the cite). */
export const EVIDENCE_LABELS = {
  mcgill2015: { tag: 'DATA', text: 'Muscle activity study, 14 men. One of the hardest stomach exercises tested, and it loads the spine a fair amount.' },
  escamilla2006: { tag: 'DATA', text: 'Muscle activity study. The hanging knee raise with arm slings was among the top exercises for every part of the stomach.' },
  axler1997: { tag: 'DATA', text: 'Spine load study of 12 stomach exercises. None was both the hardest for the stomach and the lightest on the back.' },
  workman2008: { tag: 'MECH', text: 'Lying leg lift, not on a bar. Tilting the pelvis back made the stomach work harder.' },
  andersson1997: { tag: 'DATA', text: 'Muscle activity study, lying leg lifts. Lifting both legs works the hip muscles hard.' },
  juker1998: { tag: 'DATA', text: 'Muscle activity study. The deep hip muscle works most when you lift the thigh.' },
  jukic2021: { tag: 'DATA', text: 'Deadlift study. Lifting straps cut grip fatigue. Not studied on a bar hang.' },
  valerio2021: { tag: 'DATA', text: 'Pulldown study. Straps changed nothing for reps or back muscles.' },
  martins2026: { tag: 'WEAK', text: 'Review. Straps help grip and top strength, with no steady effect on pulling exercises.' },
  odriscoll1992: { tag: 'DATA', text: 'Grip strength study on a hand gauge. Grip is strongest with the wrist tipped back. Curling it weakens the grip.' },
  prinold2016: { tag: 'MECH', text: '11 people doing pull-ups. With the arms high, the space in the shoulder gets smaller. The hang itself was not studied.' },
  kolber2010: { tag: 'CONSENSUS', text: 'Review of weight-training injuries. The shoulder is one of the most common places to get hurt.' },
  'ace-abs': { tag: 'WEAK', text: 'Press release, not peer reviewed. The captain\'s chair ranked near the top for the stomach.' },
  'catalyst-hlr': { tag: 'CONSENSUS', text: 'Coaching guide. No swinging, curl the pelvis up, bend the knees to make it easier.' },
  'catalyst-scap': { tag: 'CONSENSUS', text: 'Coaching guide. Pulling the shoulder blades down from a hang.' },
  'yessis-hlr': { tag: 'WEAK', text: 'Expert opinion. The hips lift first, and the stomach starts to shorten once the thighs are well up.' },
  'strengthlog-hlr': { tag: 'CONSENSUS', text: 'Coaching guide. No swinging, lower slowly, bent-knee version for beginners.' },
  'baechle-earle': { tag: 'CONSENSUS', text: 'Textbook. Thumbs around the bar for every grip.' },
  'wiki-leg-raise': { tag: 'WEAK', text: 'Encyclopedia page. The pelvis tilts back when the stomach does the lifting.' },
  'nhs-wrist-pain': { tag: 'CONSENSUS', text: 'When wrist pain needs a check.' },
};


const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });

// ---- hand (architecture 3.1 `hang`, 4.2, 5.1) ----
// Overhand on a bar across the body, seen from the side (the plate's camera): the bar is end-on and the thumb side of
// the hand faces the camera ('radial' view). The load is body weight hanging from the hand, down the forearm.
// Right: bar across the base of the fingers (contactAt 1.0 = finger base), fingers closed over the top, thumb wrapped
// under, wrist 10 degrees back. The card: "straight in line with the forearm, or tipped back a little, knuckles
// pointing at the ceiling"; 10 is inside the card's target and the `hang` range 0 to 35 (O'Driscoll 1992).
const RIGHT_POSE = { view: 'radial', forearm: 180, wrist: { ext: 10, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm',
  handle: { profile: 'bar-32', axis: 'across' }, load: { kind: 'gravity' } };
// Main wrong hand (card zoom "hand" wrong, handlingMistakes #4): the grip failing. Bar rolled out toward the fingertips
// (contactAt 1.4 of 1.6), fingers peeling open, thumb loose on top, and the wrist CURLED FORWARD (flexion). -30 is
// 30 degrees outside the right range (faultMargin): it reads as clearly curled. A drawing value, not a threshold (3.1.1).
const FAULT_CURL_SLIP = {
  key: 'curl-slip', label: 'Slipping out',
  pose: { wrist: { ext: -30, dev: 0 }, contactAt: 1.4, fingers: { curl: 1, open: 0.4 }, thumb: 'over' },
  markers: ['slip-arrow', 'lever-arc'],
  alt: 'The bar has rolled out toward the fingertips, the wrist curls forward, the thumb rests loose on top and the fingers are peeling open. The grip is about to fail.',
};
// Thumb page (5.1, `hang`): the card's two options. Full grip is the default and the only one offered (C4); thumbless is
// information. Only the thumb differs between the two drawings, so they compare directly; the card's "opening late in
// the set on a sweaty bar" is in the alt text and the main wrong hand (fingers peeling), not drawn here, because a
// half-open hand at this size read as a broken drawing.
export const THUMB_PAGE = [
  { mode: 'wrapped', title: 'Full grip', note: 'Every set', default: true,
    pose: RIGHT_POSE, alt: 'Full grip: the thumb wraps under the bar to meet the index finger. Use it every set.' },
  { mode: 'over', title: 'Thumbless', note: 'Nothing to gain here',
    pose: { ...RIGHT_POSE, thumb: 'over' },
    alt: 'Thumbless: the thumb lies on top beside the fingers. Late in a long set on a sweaty bar the hand can open. Nothing to gain here.' },
];

// ---- posture zoom poses ----
// The plate solves every hang with the whole-body centre of mass under the bar (a still hang). The plate module keeps
// its `hang()` solver private, so the same solver is repeated here (same bar, grip, arm length and Winter 2009 segment
// masses as exercises/hanging_leg_raise.mjs) to build balanced full poses for the zoom-only positions.
const H = 1.75, BAR = [0, 2.25, 0], GRIP_X = 0.24, ARM = (0.186 + 0.146 + 0.46 * 0.108) * H;
const hands = { l: { at: [GRIP_X, BAR[1], BAR[2]], pole: [0.5, 0, -1] }, r: { at: [-GRIP_X, BAR[1], BAR[2]], pole: [-0.5, 0, -1] } };
const mid = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
function comZ(lm) {
  let m = 0, z = 0;
  const seg = (w, p) => { m += w; z += w * p[2]; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430));
    seg(0.006, lm[`grip.${s}`]); seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433));
    seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return z / m;
}
function hang(angles, off = 0) {
  let root = [0, BAR[1] - 1.14, -0.02];
  for (let i = 0; i < 40; i++) {
    const lm = landmarksOf({ ...angles, root: { at: root, tilt: angles.tilt }, reach: hands }, H);
    const dz = BAR[2] + off - comZ(lm), sh = lm['shoulder.r'], lat = GRIP_X - Math.abs(sh[0]);
    const need = Math.sqrt((ARM * 0.998) ** 2 - lat ** 2), sz = sh[2] + dz, dy = Math.sqrt(Math.max(0, need ** 2 - (BAR[2] - sz) ** 2));
    root = [0, root[1] + (BAR[1] - dy - sh[1]), root[2] + dz];
  }
  const { tilt, ...rest } = angles;
  return { ...rest, root: { at: root.map(v => +v.toFixed(4)), tilt }, reach: hands };
}
// Pelvis curl, wrong: thighs at hip height (thigh 90 deg from vertical = hip flex - tilt), pelvis still tipped
// forward 12 deg, lower back arched 10 deg (trunk -10), knees soft as in the right top. Balanced under the bar.
// The arch is split between lumbar and pelvis: at trunk -15 / tilt 15 the back outline met the buttock in a sharp V.
// Right top = the plate's end pose (tilt -25, lumbar curled 15, thighs 105 deg: just above hip height).
export const PELVIS_WRONG = hang({ tilt: 12, trunk: -10, neck: 5, hip: 102, knee: 5, ankle: -25 });
// Shoulders: dead hang (the plate's start angles) with the shoulder girdle set down, or shrugged up (cm, SPEC.md 3).
// With straight arms the shoulders hang a fixed arm length under the bar, so a shrug shows as the trunk and head
// sinking between the arms; setting the shoulders down lifts them.
const A0 = { tilt: 0, trunk: 0, neck: 0, hip: 0, knee: 0, ankle: -25 };
export const ACTIVE_HANG = hang({ ...A0, scap: { elev: -3, pro: -1 } });
export const SHRUG_HANG = hang({ ...A0, scap: { elev: 8, pro: 1 }, neck: 10 });

/* ---------------------------------------------------------------- handling mistakes, risks (plan 2.4 items 4, 7) --
 * From the verified card's handlingMistakes (grip/research/hanging_leg_raise.json): the mistake, its fix and what it can hurt,
 * cut to the copy limits (title <= 10 words; fix and risk <= 30 words and 2 sentences; no citations in user copy, C7;
 * no red-flag wording, C8: the shared RED_FLAG and DISCLAIMER come from howto/shared.mjs). `zoom` = "Show me" target. */
const MISTAKES = [
  { key: 'swing', title: 'Swinging or kicking your legs up', claim: C(['CONSENSUS'], ['catalyst-hlr', 'yessis-hlr', 'strengthlog-hlr']),
    fix: 'Start every rep from a still hang, lift at a speed you could stop at any point, and lower slower than you lift. Bend your knees if you need to.' },
  { key: 'legs-only', title: 'Lifting only your legs, no hip curl', zoom: 'pelvis', claim: C(['CONSENSUS', 'WEAK'], ['catalyst-hlr', 'workman2008']),
    fix: 'As your thighs pass hip height, roll your hips up toward your chest so your lower back rounds a little.' },
  { key: 'sunk', title: 'Hanging loose, shoulders up at your ears', zoom: 'shoulders', claim: C(['MECH', 'CONSENSUS'], ['prinold2016', 'catalyst-scap']),
    fix: 'Step up from a box, then pull your shoulders a little down from your ears before the first rep and keep them there.' },
  { key: 'grip', title: 'Grip slipping, wrist curling', zoom: 'hand', claim: C(['DATA', 'CONSENSUS'], ['odriscoll1992']),
    fix: 'Bar at the base of your fingers, thumb wrapped, wrist level, chalk. If your grip still goes first, use straps or ab slings.' },
];
const RISKS = [
  { key: 'swing', text: 'Swinging jerks your whole body weight through your hands and shoulders, and arches your lower back on the backswing.',
    claim: C(['CONSENSUS'], ['catalyst-hlr', 'yessis-hlr'], 'The injury link is consensus, not measured.') },
  { key: 'spine', text: 'Lifting straight legs without the hip curl pulls on your lower spine. Worth knowing if you have back pain.',
    claim: C(['DATA'], ['mcgill2015'], 'McGill 2015: about 3000 N of spine compression in the straight-leg hanging raise.') },
  { key: 'shoulder', text: 'Dropping into a slack hang loads the shoulder through its passive tissues, where the space under the shoulder roof is small.',
    claim: C(['MECH', 'CONSENSUS'], ['prinold2016', 'kolber2010']) },
];

export default {
  schema: 1,
  id: 'lib_hanging_leg_raise',
  rev: 1,
  plate,
  handling: {
    archetype: 'hang',
    orientation: 'pronated',
    handle: 'bar-32',                  // A5; the plate draws the same 32 mm bar
    loadAxis: 'across',                // `hang` default (3.1.1): no push lever check
    overBody: false,
    width: { text: 'About shoulder width, hands straight above your shoulders so your arms hang straight down.',
      claim: C(['CONSENSUS'], ['catalyst-hlr', 'strengthlog-hlr'], 'Consensus only. No study compares grip widths for leg raises.') },
    thumb: { mode: 'wrapped', claim: C(['CONSENSUS'], ['baechle-earle'], 'No study has measured thumb position on this exercise. Thumbless is shown on the thumb page as information only (C4).') },
    contact: 'finger-base',
    wrist: { ext: [0, 35], dev: [-10, 10], limitText: 'Level or tipped back a little is fine. If your wrist starts curling forward and the bar rolls toward your fingertips, your grip is failing, so end the set or put straps on.',
      claim: C(['DATA', 'CONSENSUS'], ['odriscoll1992'], "O'Driscoll 1992 (hand gauge, not a bar): grip strongest near 35 degrees back, curling the wrist cuts grip. The target and the limit in a hang are consensus.") },
    pose: RIGHT_POSE,
    faults: [FAULT_CURL_SLIP],
    gripLine: 'Hands about shoulder width, palms facing away. Lay the bar across the base of your fingers, close your hand and wrap your thumb under. If your grip quits before your stomach does, use straps.',
    cue: 'Hook with the fingers, wrap the thumb.',
    // Grip-free options (card grip.type): lifting straps, ab slings, captain's chair. Text only in v1 (setup step 1,
    // rows "forearms" and "wrist"); the straps zoom needs a strap drawing the hand renderer does not have (A5 open).
    alternatives: ['lifting-straps', 'ab-slings', 'captains-chair'],
  },
  contacts: ['hang-support'],
  setup: [
    { kind: 'adjust', text: "Pick a bar high enough that your feet clear the floor with your legs straight. If your grip or wrist is the problem, use ab slings on the bar or a captain's chair instead.",
      claim: C(['CONSENSUS', 'DATA'], ['catalyst-hlr', 'escamilla2006', 'ace-abs'], 'Ab slings appear in Escamilla 2006 as used, not compared. The captain\'s chair ranking is a press release.') },
    { kind: 'get-in', text: "Use a box or step to reach the bar without jumping. Once you're hanging, check the box is well clear of your legs, or have someone move it, so you don't clip it coming down.",
      claim: C(['CONSENSUS', 'MECH'], ['yessis-hlr', 'prinold2016'], 'Stepping up instead of jumping into the hang is consensus.') },
    { kind: 'grip', text: 'Dry your hands or chalk them. If your grip usually quits first, put lifting straps on now.',
      claim: C(['DATA', 'CONSENSUS'], ['jukic2021', 'valerio2021', 'martins2026'], 'Straps cut grip fatigue in deadlifts, no effect in pulldowns. Not studied on this exercise.') },
    { kind: 'grip', text: 'Stand on the step and take the bar at shoulder width, palms facing away. Bar across the base of your fingers, fingers closed, thumb wrapped under.', zoom: 'hand',
      claim: C(['CONSENSUS'], ['baechle-earle']) },
    { kind: 'position', text: 'Step off and hang with straight arms. Pull your shoulders a little down from your ears without bending your elbows.', zoom: 'shoulders',
      claim: C(['CONSENSUS', 'MECH'], ['catalyst-scap', 'prinold2016']) },
    { kind: 'brace', text: 'Legs together, a little in front of you. Wait until your body stops swinging before the first rep.',
      claim: C(['CONSENSUS'], ['catalyst-hlr', 'yessis-hlr', 'strengthlog-hlr']) },
    { kind: 'load', text: 'New to this? Start with bent knees (hanging knee raise) and move to straight legs once you can curl your hips up without swinging.',
      claim: C(['CONSENSUS'], ['catalyst-hlr', 'strengthlog-hlr']) },
  ],
  posture: [
    { key: 'hang', label: 'Active hang', detail: 'Arms straight, hands above your shoulders, shoulder blades pulled slightly down, a clear gap between your ears and the tops of your shoulders.',
      anchor: { at: 'shoulderTop.r', pose: 'start' }, zoom: 'shoulders', claim: C(['CONSENSUS', 'MECH'], ['catalyst-scap', 'prinold2016']) },
    { key: 'still', label: 'Still body', detail: 'At the start your shoulders, hips and feet hang in a quiet line under the bar, legs together and a touch in front, ribs down.',
      anchor: { at: 'hip.r', pose: 'start' }, claim: C(['CONSENSUS'], ['catalyst-hlr', 'yessis-hlr', 'strengthlog-hlr'], 'Shown by the plate Mistake layer (swing), not a zoom.') },
    { key: 'curl', label: 'Pelvis curls up', detail: 'At the top your lower back rounds gently and your tailbone tips forward and up, so your belt line rises toward your ribs.',
      anchor: { at: 'sacrum' }, zoom: 'pelvis', claim: C(['MECH', 'CONSENSUS'], ['workman2008', 'catalyst-hlr', 'wiki-leg-raise'], 'Workman 2008 is a lying leg lift, not a bar, so the support is indirect.') },
    { key: 'height', label: 'Legs past hips', detail: 'Your thighs reach hip height or higher (knees to chest on the bent-knee version). Early in the lift it is mostly the front of your hips. Your pelvis curls as the legs rise higher.',
      anchor: { at: 'knee.r' }, claim: C(['WEAK'], ['yessis-hlr'], 'The 30 to 45 degree point is one biomechanist\'s expert opinion, not data.') },
    { key: 'chest', label: 'Chest stays quiet', detail: 'Your upper body stays under the bar while your legs rise. You do not lean far back to counter the legs, and your arms stay straight.',
      anchor: { at: 'backUpper' }, claim: C(['CONSENSUS'], ['catalyst-hlr', 'yessis-hlr']) },
    { key: 'lower', label: 'Slow way down', detail: 'Your legs come down under control and stop just in front of your body. They do not swing behind you.',
      anchor: { at: 'ankle.r', pose: 'start' }, claim: C(['CONSENSUS'], ['strengthlog-hlr', 'catalyst-hlr']) },
  ],
  feel: {
    primary: [{ muscleId: 'abs', plain: 'Down the front of your stomach, from the ribs to below your belly button, tightening hard as your hips curl up at the top. Most people feel it most below the belly button.' }],
    secondary: [
      { muscleId: 'obliques', plain: 'The sides of your waist, working to keep you from twisting and to help the curl.' },
      { muscleId: 'hip_flexors', plain: 'The front of your hips, where the legs meet the body. They lift your legs, so some work here is normal.' },
      { muscleId: 'lats', plain: 'Some tension down the sides of your back, holding your upper body still under the bar.' },
      { muscleId: 'forearms', plain: 'Your grip, holding your whole body up. Some burn is normal on long sets.' },
    ],
    // "Should not take over": dashed outline ONLY while a row naming the muscle is open (S6), never at rest (5.3).
    // hip_flexors and forearms are helpers AND watch on purpose (card): some work is normal, taking over is the fault.
    watch: [
      { muscleId: 'hip_flexors', plain: 'If the front of your hips is all you feel, you are lifting your legs without curling your pelvis.' },
      { muscleId: 'lower_back', plain: 'Your lower back should not ache or pinch. If it does, it is arching instead of rounding.' },
      { muscleId: 'forearms', plain: 'If your grip gives out before your stomach is tired, the set ends too early. Use straps or ab slings.' },
      { muscleId: 'upper_traps', plain: "The tops of your shoulders and your neck shouldn't ache or feel pulled. If they do, you're hanging loose with your shoulders sunk up by your ears." },
    ],
    feelLine: "You should feel this down the front of your stomach, most of all below your belly button. If it's mostly the front of your hips, bend your knees and roll your hips up toward your ribs at the top.",
    rows: [
      { key: 'hips', where: 'Front of the hips only', at: { muscles: ['hip_flexors'] },
        means: 'Your legs go up but your pelvis stays put, so the hip flexors lift and the abs only hold.',
        fix: 'Bend your knees and bring them to your chest, then roll your hips up toward your ribs at the top. Go higher and slower before you go straighter.',
        zoom: 'pelvis', claim: C(['DATA', 'MECH', 'CONSENSUS'], ['andersson1997', 'juker1998', 'workman2008', 'catalyst-hlr']) },
      { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
        means: "You're swinging, or your back arches while the legs lift and lower.",
        fix: "Start each rep still, curl your hips at the top and lower slowly. If it keeps aching, use a captain's chair, back on the pad, and stop if it hurts.",
        zoom: 'pelvis', claim: C(['DATA', 'CONSENSUS'], ['mcgill2015', 'axler1997', 'catalyst-hlr', 'strengthlog-hlr'], 'Spine load is measured (McGill 2015). The link from swinging to back pain is consensus.') },
      { key: 'forearms', where: 'Forearms give out first', at: { muscles: ['forearms'] },
        means: 'Your grip is the weak link, or the bar has rolled toward your fingertips.',
        fix: 'Put the bar at the base of your fingers, wrap your thumb and chalk up. If it still goes first, use lifting straps or ab slings.',
        zoom: 'hand', claim: C(['DATA', 'CONSENSUS'], ['odriscoll1992', 'jukic2021', 'baechle-earle'], 'Straps on this exercise: consensus. Jukic 2021 is a deadlift study.') },
      { key: 'thighs', where: 'Front of the thighs cramping', at: {},   // card: no quads mark (no data on the thigh muscle in this exercise)
        means: 'The straight-leg version is too long a lever for you right now, so the thigh muscle that also lifts the hip is overworking.',
        fix: 'Do it with bent knees for now and add the straight legs back one rep at a time.',
        claim: C(['CONSENSUS'], ['catalyst-hlr', 'strengthlog-hlr']) },
      { key: 'traps', where: 'Tops of the shoulders and neck', at: { muscles: ['upper_traps'] },
        means: "You're hanging loose, so your shoulders have sunk up toward your ears.",
        fix: 'Pull your shoulders a little down before the first rep and keep them there.',
        zoom: 'shoulders', claim: C(['CONSENSUS', 'MECH'], ['catalyst-scap', 'prinold2016']) },
      { key: 'wrist', where: 'The wrist', at: { parts: ['hand-left', 'hand-right', 'hand-back-left', 'hand-back-right'] },
        means: 'The wrist is curling as the grip fails, or an old wrist injury is being stretched.',
        fix: "Keep the wrist level with the bar at the base of the fingers. With a sore wrist, use ab slings or a captain's chair and stop if it hurts.",
        zoom: 'hand', redFlag: true, claim: C(['DATA', 'CONSENSUS'], ['odriscoll1992', 'nhs-wrist-pain']) },
      { key: 'nothing', where: 'Nothing much in the stomach', at: {},
        means: 'The reps are too fast or too swingy for the abs to do the lifting.',
        fix: 'Pause for a second at the top with your hips curled, then take two or three seconds to lower.',
        zoom: 'pelvis', claim: C(['CONSENSUS'], ['catalyst-hlr', 'strengthlog-hlr', 'yessis-hlr']) },
    ],
    libraryDiff: { add: ['obliques', 'lats', 'forearms'], why: 'The card adds the obliques (88 percent of max in McGill 2015, high in Escamilla 2006), the lats (Escamilla 2006) and the forearms (the grip holds the whole body) as helpers. exercises.json lists abs primary and hip_flexors secondary.' },
    claim: C(['DATA', 'CONSENSUS'], ['mcgill2015', 'escamilla2006', 'andersson1997', 'juker1998'], '"Below the belly button" is a common feel cue, not a measured lower-ab bias: EMG shows the whole rectus abdominis working hard. Muscle readings do not map one to one onto what a person feels.'),
  },
  zooms: [
    {
      key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',
      hand: {
        right: RIGHT_POSE,
        wrong: [FAULT_CURL_SLIP],
        camera: 'side',
        thumbPage: THUMB_PAGE.map(t => t.mode),
      },
      caption: { right: 'Bar at the base of the fingers, thumb wrapped under, wrist level.',
        wrong: 'Bar rolled to the fingertips, wrist curling forward, thumb loose on top.' },
      alt: {
        right: 'Seen from the side, hanging. The bar lies across the base of the fingers, the fingers close over the top, the thumb wraps under to meet the index finger, and the wrist is level with the forearm. The body weight runs straight down the forearm.',
        wrong: FAULT_CURL_SLIP.alt,
      },
      feelRow: 'forearms',
      feelPrompt: 'Forearms give out first? This is usually why.',
    },
    {
      key: 'pelvis', chip: 'Pelvis curl', heading: 'Pelvis curl: right and wrong', kind: 'posture',
      // crop of the plate at the top of the rep: trunk, pelvis and thighs (plate px, same camera as the plate)
      crop: { center: { at: 'hip.r', off: [-6, 20] }, sizePx: 130 },   // trunk, pelvis bowl and thigh; the arm stub out of frame
      right: 'end',
      wrong: { base: 'end', pose: PELVIS_WRONG },
      wrongAlone: true,                // the wrong crop draws the wrong pose alone and solid (see the render script)
      // zoom-only overlay (5.2): a dashed vertical through the hip joint and a "bowl" line along the pelvis, tipped
      // by the pose's pelvis tilt, so right (tipped back) and wrong (tipped forward) read against the same vertical
      pelvisGuide: true,
      callout: {
        right: { text: 'Pelvis<br>curls up', anchor: { at: 'sacrum', off: [-1, 1] } },
        wrong: { text: 'Back<br>arches', anchor: { at: 'lumbar', off: [-2, 0] } },
      },
      caption: { right: 'Pelvis tips back and up, lower back gently rounded, thighs above hip height.',
        wrong: 'Legs at hip height, pelvis still tipped forward, lower back arched.' },
      alt: {
        right: 'Side view of the trunk and hips at the top: the pelvis tips back and up, the lower back rounds gently and the thighs rise just above hip height.',
        wrong: 'The same top position with the legs only at hip height, the pelvis still tipped forward and the lower back arched.',
      },
      feelRow: 'hips',
      feelPrompt: 'Feel it only in the front of your hips? This is usually why.',
    },
    {
      key: 'shoulders', chip: 'Shoulders', heading: 'Shoulders: right and wrong', kind: 'posture',
      // Back view, the pull-up's "Seen from behind" drawing (exercises/pull_up.howto.mjs, same technique and wording):
      // from the side the near arm hides the head, ears and shoulder tops, so a side crop cannot show the shrug. This
      // is the plate's own hang drawn from behind with the engine's front-view outline (symmetric, no face), same
      // scale as the plate, printed "Seen from behind" (C16). Both crops solid: Right the active hang, Wrong the
      // shrug; the blades outlined on both (bladeOutlines, shared with the pull-up).
      view: 'back', camLabel: 'Seen from behind',
      equipment: [{ type: 'pullupBar', at: [0, 2.25, 0], mount: 'ceiling', stub: 0.08 }],
      outlines: bladeOutlines,
      crop: { center: { at: 'shoulders', pose: 'right', off: [0, 18] }, sizePx: 148 },
      right: { base: 'start', pose: ACTIVE_HANG },
      wrong: { base: 'start', pose: SHRUG_HANG, solid: true },
      // a level at the top of the head in the right hang (both crops), an arrow down to the sunk head, and a neutral
      // level on the ribcage at each crop's own lower blade corners
      guides: [{ kind: 'level', at: { at: 'head', pose: 'right' } }, { kind: 'level', at: 'ribLevel', tone: 'neutral' },
        { kind: 'drop', from: { at: 'head', pose: 'right' }, to: { at: 'head' } }],
      callout: {
        right: { text: 'Blades<br>down', anchor: { at: 'bladeLow.l' } },
        wrong: { text: 'Blades<br>high', anchor: { at: 'bladeLow.l' } },
      },
      caption: { right: 'Arms straight, shoulders pulled down, clear gap to the ears.',
        wrong: 'Shoulders shrugged up to the ears, head sunk between the arms.' },
      alt: {
        right: 'Seen from behind, hanging with straight arms: shoulder blades pulled down the back, a clear gap between the ears and the tops of the shoulders.',
        wrong: 'Seen from behind, the same hang shrugged: shoulders up at the ears, the head sunk between the arms, the shoulder blades riding high on the back.',
      },
      feelRow: 'traps',
      feelPrompt: 'Feel it in the tops of your shoulders? This is usually why.',
    },
  ],
  // Chip row = the zooms in order, then "Where to feel it" (always last, 2.1): 4 chips. A5 names four zooms plus
  // Feel; the 4-chip cap (2.1) drops one. Straps is the one dropped: it needs a strap drawing the hand renderer does
  // not have (A5 open item), and its content is fully in text (setup step 3, rows "forearms" and "wrist").
  // "Body line" (swinging) is the plate's own Mistake layer; "thumb" is page 2 of the Hand zoom (5.1).
  chips: ['hand', 'pelvis', 'shoulders', 'feel'],
  copy: {
    setupLine: 'Step up to the bar instead of jumping. Hang with straight arms, pull your shoulders a little down from your ears, and wait until your legs stop swinging.',
    mistakeLine: "Don't swing your legs up. If you need a kick to get them there, bend your knees and lift slowly until you can do it still.",
  },
  mistakes: MISTAKES,
  risks: RISKS,
  sources: Object.keys(SOURCES),
  research: { card: 'grip/research/hanging_leg_raise.json', rev: 1, related: ['grip/research/GENERAL.md (G9)', 'grip/research/pull_up.json'] },
};

// KNOWN GAPS (for the supervisor):
// - No "Wrist sore before you start" row: that row is for presses (A1); this is a `hang` exercise. The card's own
//   wrist row covers a sore wrist (ab slings or a captain's chair) and carries the shared RED_FLAG.
// - Straps zoom not drawn (4-chip cap, and no strap / sling / captain's chair drawing in the engine).
// - The Shoulders zoom is a side crop; the card asks for a back view with the shoulder blades outlined (the gap between
//   the ears and the shoulders). The plate is a side view and posture zooms are crops of it (5.2), and from the side
//   the near arm hides the neck and ears, so the zoom compares the head height against a level line instead.
// - Body map regions: the app's src/svg/bodyMuscles.ts (body-muscles by Ivan Vulovic, Apache-2.0) mislabels the stomach:
//   `abs-upper-left/right` sit on the flanks and two of the three `obliques-*` blocks sit on the upper six-pack. The
//   render script howto/render-hanging_leg_raise.mjs applies a documented correction in its own process (REGION_FIX:
//   the central obliques blocks paint as abs, the side block and abs-upper-* as obliques), so Main is the central column
//   from the ribs to below the navel and Also working is the flanks. Engine files are unchanged. FOLLOW-UPS: move the
//   correction into engine/bodymap-parts.mjs (shared, supervisor's OK) and fix the labels in the app's bodyMuscles.ts.
// - The wrist row marks the whole hands (the map has hand-* parts, no wrist part). The render adds a "Where it hurts"
//   legend entry and a TalkBack sentence ("the wrist, marked on the hands"); the engine legend has no pain entry yet.
// - The Pelvis curl and Shoulders wrong crops draw the wrong pose alone and solid (`wrongAlone`), a departure from the
//   dashed-over convention: dashed over the right pose, the two figures crossed each other and read as noise. The
//   Shoulders crops share one frame (centred on the right pose) so the head drop reads against the level line.
// - The card's zoom "pelvis curl" asks the hip flexors to shimmer on the wrong crop. Crops carry no map; the feel link
//   under the zoom opens the "Front of the hips only" row instead.
