// Upright row (barbell), FRONT view. Census equipment "Cable / Barbell": the barbell is drawn.
// View: FRONT. What a coach judges is frontal: the elbows lead, out to the sides and higher than the hands, and they
// stop at about shoulder height (upper arms about level); the bar rises close to the body from the thighs to the
// chest; no shrug and no lean. The side view would hide the elbows' lead and the arm height against the shoulders.
// Form (textbook; the research card is not in yet, so every number is a named constant for the card):
//  NSCA, Exercise Technique Manual for Resistance Training (3rd ed., 2016), upright row: stand erect, feet shoulder
//   width, knees slightly flexed, pronated closed grip, bar resting on the thighs, elbows fully extended; pull the bar
//   up along the abdomen and chest, the elbows pointing out to the sides and staying higher than the wrists; no lean,
//   no rising on the toes. (Book, not re-read online for this plate.)
//  Schoenfeld, Kolber & Haimes 2011, "The upright row: implications for preventing subacromial impingement",
//   Strength Cond J 33(5):25-28: use a grip wider than shoulder width and stop when the upper arms are about parallel
//   to the floor (humeral elevation no more than ~90 deg). (Not re-read online for this plate.)
// Engine anchor: the first ENGINE-drawn front view with a body (front view was proven only by the hand-drawn lateral
//  raise, re-drawn by the engine as _test_front) and the first front-view `barbell`: 2.2 m bar, 28 mm shaft, 50 mm
//  sleeves, 45 cm plates edge-on (4.5 cm), at the reference scale it spans plate x 18..340.
// Geometry decisions (confirmed by the report `angles`, `contacts` and `checks`):
//  Standing as the reference front plate: feet about shoulder width (mid-soles 26 cm apart;
//   wider rolls the engine's foot off its contact, which does not model eversion), knees 5 deg soft (root height
//   solved from KNEE_SOFT), pelvis, trunk and neck 0 (no lean), scapulae neutral (no shrug).
//  Grip: hands 50 cm apart (GRIP_X = 0.25, just wider than the shoulder joints at +-0.227 m).
//  Start: arms straight (IK reach at full arm length less 0.1 mm, elbow 2 deg), bar in front of the thighs (z BAR_Z0).
//  End: bar at END_BAR_Y = 1.18 m (lower chest), 16 cm in front of the hip line (in front of the chest line, 0.123 m, plus the
//   shaft and 2 cm), the elbow IK pole out and up so the elbows lead: shoulder abduction and elbow height come from the
//   report (shoulder elevation 84 deg: upper arm just under level, elbow 3.5 cm under the shoulder joint and
//   ~15 cm above the hands).
//  Arms: `armsFront` so the fists and forearms are drawn over the bar (the hands wrap round it; the bar is 'mid').
//  Drawn: end solid; start arms dashed (engine start layer) and the start bar as dashed lines (START_BAR); 3 ghosts of the near-side (figure's right) arm; trace of the right elbow
//   (the elbows lead: its path rises out and up, the cue a coach gives); datum: horizontal line at shoulder height
//   (the elbows stop about there), as the lateral raise.
// CARD: end height (END_BAR_Y; elbows at shoulder height or lower), grip width (GRIP_X), stance (FOOT_X), knee bend.
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.13;                                   // mid-sole lateral offset: feet shoulder width
const KNEE_SOFT = 5;                                   // deg: knees slightly flexed
const GRIP_X = 0.25;                                   // hand centre lateral offset: wider than shoulder width
const BAR_Z0 = 0.10;                                   // start: bar just in front of the thighs (m forward of the hips)
const END_BAR_Y = 1.18;                                // end: bar height (m), lower chest: elbows 3.5 cm under the shoulders
const END_BAR_Z = 0.16;                                // end: bar close to the chest
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;   // straight arm, shoulder to grip centre

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const S0 = landmarksOf(base, H)['shoulder.l'];
const START_BAR_Y = S0[1] - Math.sqrt(ARM * ARM - (GRIP_X - S0[0]) ** 2 - (BAR_Z0 - S0[2]) ** 2);
const grips = (y, z, pole) => ({ l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } });
const start = { ...base, reach: grips(START_BAR_Y, BAR_Z0, s => [s * 0.6, 0, -1]) };
const end = { ...base, reach: grips(END_BAR_Y, END_BAR_Z, s => [s * 1, 0.5, -0.1]) };
const barAt = lm => [0, lm.grips[1], lm.grips[2]];
// Start bar, dashed (engine limit: the start layer compares the start equipment with itself, so moving equipment is
// never drawn there; barbell_back_squat adds its start bar dot to the end pose the same way). The barbell primitive's
// front-view outline at the start height as dashed lines: shaft centre line, sleeves and 45 cm plates as rectangles,
// in the start layer's tone (eq-thin: --border-strong), since it lies mostly outside the figure.
const BB = { barLen: 2.2, collar: 0.655, sleeveD: 0.05, plateD: 0.45, plateT: 0.045 };
const rect = (x0, x1, y, h, z) => [[x0, y - h / 2, z], [x1, y - h / 2, z], [x1, y + h / 2, z], [x0, y + h / 2, z], [x0, y - h / 2, z]];
function startBar(y, z) {
  const L = (pts, part = 'startbar') => ({ type: 'line', cls: 'eq-thin m-line', pts, z: 'mid', part });
  const out = [L([[-BB.collar, y, z], [BB.collar, y, z]])];
  for (const s of [-1, 1]) {
    const a = s * BB.collar, b = s * BB.barLen / 2, p0 = s * (BB.collar + 0.025), p1 = s * (BB.collar + 0.025 + BB.plateT);
    out.push(L(rect(Math.min(a, b), Math.max(a, b), y, BB.sleeveD, z)), L(rect(Math.min(p0, p1), Math.max(p0, p1), y, BB.plateD, z)));
  }
  return out;
}
const START_BAR = startBar(START_BAR_Y, BAR_Z0);

export default {
  id: 'upright_row', name: 'Upright Row', view: 'front',
  poses: { start, end },
  armsFront: true,
  equipment: [
    { type: 'floor', from: -0.51, to: 0.51 },
    (lm, ctx) => [{ type: 'barbell', at: barAt(lm), plates: [BB.plateT], part: 'bar', z: 'mid' }, ...(ctx.pose === 'end' ? START_BAR : [])],
  ],
  checks: [
    { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
    // elbows lead: at the top the elbows are higher than the hands
    { landmark: 'elbow.r', above: { point: [0, END_BAR_Y, 0], normal: [0, 1, 0] }, pose: 'end' },
    // and no higher than the shoulder joint (upper arm at or under level)
    { landmark: 'elbow.r', above: { point: [0, S0[1], 0], normal: [0, -1, 0] }, pose: 'end' },
  ],
  ghosts: { count: 3, parts: ['arm.r'] },
  trace: { point: 'elbow.r', trim: [10, 12] },
  datum: [{ y: 'shoulder.r', from: 12, to: 'shoulder.r' }],
  callouts: [],
  alt: 'Barbell upright row, front view. Standing tall with an overhand grip a little wider than the shoulders; the bar travels from the thighs up the body to the chest while the elbows lead out to the sides, finishing at about shoulder height, higher than the hands.',
};
