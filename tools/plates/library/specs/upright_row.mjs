// Upright row (barbell), FRONT view. Census equipment "Cable / Barbell": the barbell is drawn (card variantLine).
// View: FRONT (card plate.view). Grip width and elbow height against the shoulders are side-to-side and up-down
// positions (c5, c6) that only the front view shows; the census draws it front (no F6).
// Sources: research card upright_row (card v2, anchor lesmills-upright-row, verified at claude/libht-research e2a70bc):
//  c3  keep the bar close to the body and the elbows directly out to the sides (checkpoints "Elbows lead", "Bar close");
//  c6  bar only to the lower ribs, elbows at shoulder level (checkpoint "Shoulder height", end pose);
//  c5, c7  grip about shoulder width or wider, never hands close together (verified card grip.width);
//  c2  do not raise the upper arms above shoulder height (end pose);
//  c5  pulling the bar up under the chin / elbows above the shoulders raises impingement risk (the Mistake);
//  c7  wider grips (grip); c12 feet about shoulder width, upright (stance); c10 tempo 1-2 s up, 1-2 s down.
// Engine anchor: the engine-drawn front view of the approved lateral raise (_test_front) and the first front-view
//  `barbell`: 2.2 m bar, 28 mm shaft, 50 mm sleeves, 45 cm plates edge-on (4.5 cm).
// Geometry decisions (confirmed by the report `angles`, `contacts`, `checks` and `measure`):
//  Standing as the reference front plate: pelvis, trunk and neck 0 (upright, c12), scapulae neutral. Feet: mid-soles
//   26 cm apart (FOOT_X). The card says about shoulder width (c12); the engine's foot does not model eversion, and
//   wider stances roll the sole off its contact, so the stance is narrower than the 45 cm shoulder width (not CARD).
//   Knees 5 deg soft (KNEE_SOFT, root height solved from it): a natural stance, not from the card.
//  Grip (CARD c5, c7): hands 50 cm apart (GRIP_X = 0.25, wider than the shoulder joints at +-0.227 m).
//  Start: arms straight (IK reach at full arm length less 0.1 mm, elbow 2 deg), bar hanging in front of the thighs.
//  End (CARD c6): elbows level with the shoulders. END_BAR_Y is SOLVED so the elbow joint centre is at the shoulder
//   joint's height (check `elbow level`, measure expect 90 = upper arm horizontal in the front view); with the elbow
//   pole out and up (ELBOW_POLE) it lands at 1.17 m, between the chest landmark (1.30 m) and the navel (1.08 m):
//   the lower ribs (c6). Bar centre 15 cm in front of the hip line, just clear of the 12.3 cm chest line (c3).
//   Elbows above the hands (c3): check `elbows above hands`.
//  Mistake (card plate.mistake, c5): the bar pulled up under the chin (bar centre M_BAR_Y = 1.46 m, 6 cm under the
//   1.52 m chin landmark, 12 cm forward) with the elbows well above the shoulders (check). M_BAR_Y / M_BAR_Z are
//   illustrative: the card gives no number, only "under the chin". Elbow IK pole out, up and a little forward.
//   Guides: an arrow on the bar (lower ribs -> chin) and one on the elbow rising past the shoulder datum. The dashed
//   start bar is left off the Mistake plate (construction of the correct plate only; three bars read as clutter).
//  Arms: `armsFront` so the fists and forearms are drawn over the bar (the hands wrap round it; the bar is 'mid').
//  Drawn: end solid; start arms dashed (engine start layer) and the start bar as dashed lines (START_BAR); 3 ghosts of
//   the viewer's-left (figure's right) arm; trace of the right elbow (the elbows lead: its path rises out and up);
//   datum: horizontal line at shoulder height (the elbows stop there), as the lateral raise. Measure: the upper arm
//   against the hanging line at the figure's left shoulder, 90 deg = level (c6).
//  Framing: the reference camera, as the lateral raise. Coverage 0.258 is over the F2 range (0.100-0.246): the 2.2 m
//   bar and its plates span the plate width; zooming out would shrink the figure below the 8, so F2 is reported.
// CARD: GRIP_X (c5, c7), END_BAR_Y (solved: elbows level, c6), tempo (c10). Unsourced: FOOT_X (narrower than the
//  card's shoulder width, engine limit), KNEE_SOFT, BAR_Z0, END_BAR_Z (the front view does not show depth).
import { WINTER, REF, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const FOOT_X = 0.13;                                   // mid-sole lateral offset (see header: engine limit)
const KNEE_SOFT = 5;                                   // deg: knees soft (not from the card)
const GRIP_X = 0.25;                                   // hand centre lateral offset: wider than shoulder width (CARD)
const BAR_Z0 = 0.10;                                   // start: bar just in front of the thighs (m forward of the hips)
const END_BAR_Z = 0.15;                                // end: bar close to the body (c3)
const ELBOW_POLE = [1, 1, 0];                          // end: elbows out to the sides and up (c3)
const M_BAR_Y = 1.46, M_BAR_Z = 0.12;                  // mistake: bar under the chin (illustrative, card gives no number)
const ARM = (WINTER.upperArm + WINTER.forearm + REF.gripOff) * H - 0.0001;   // straight arm, shoulder to grip centre

const FOOT_Z = REF.mid * H;
const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * R; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, plant: feet };
const S0 = landmarksOf(base, H)['shoulder.l'];
const START_BAR_Y = S0[1] - Math.sqrt(ARM * ARM - (GRIP_X - S0[0]) ** 2 - (BAR_Z0 - S0[2]) ** 2);
const grips = (y, z, pole) => ({ l: { at: [GRIP_X, y, z], pole: pole(1) }, r: { at: [-GRIP_X, y, z], pole: pole(-1) } });
const upPole = s => [s * ELBOW_POLE[0], ELBOW_POLE[1], ELBOW_POLE[2]];
const start = { ...base, reach: grips(START_BAR_Y, BAR_Z0, s => [s * 0.6, 0, -1]) };
// End bar height: bisection so the elbow joint centre sits at the shoulder joint's height (c6).
// Wrists (critic run 2, R3): the hands curl under the bar at the top (wrist flexion WRIST_TOP), so in the front view
// the fist foreshortens onto the end of the forearm and the hand visibly wraps the bar instead of floating beside
// it. Not a card number: the engine's straight-wrist hand leaves a 2.5 cm gap between forearm and fist in this view.
const WRIST_TOP = 50;
const elbowRise = y => { const L = landmarksOf({ ...base, wrist: WRIST_TOP, reach: grips(y, END_BAR_Z, upPole) }, H); return L['elbow.r'][1] - L['shoulder.r'][1]; };
const END_BAR_Y = (() => { let a = 1.05, b = 1.30; for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (elbowRise(m) < 0) a = m; else b = m; } return (a + b) / 2; })();
const end = { ...base, wrist: WRIST_TOP, reach: grips(END_BAR_Y, END_BAR_Z, upPole) };
const mistakePose = { reach: grips(M_BAR_Y, M_BAR_Z, s => [s, 1, 0.3]) };   // elbows up, out and a little forward
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
const level = y => ({ point: [0, y, 0], normal: [0, 1, 0] });

export default {
  id: 'upright_row', name: 'Upright Row', view: 'front',
  poses: { start, end },
  armsFront: true,
  equipment: [
    { type: 'floor', from: -0.51, to: 0.51 },
    (lm, ctx) => [{ type: 'barbell', at: barAt(lm), plates: [BB.plateT], part: 'bar', z: 'mid' }, ...(ctx.pose === 'end' && !ctx.mistake ? START_BAR : [])],
  ],
  checks: [
    { landmark: 'heel.r', plane: level(0), pose: 'all', tol: 0.5 },
    { landmark: 'ball.r', plane: level(0), pose: 'all', tol: 0.5 },
    // elbows lead (c3): at the top the elbows are higher than the hands
    { landmark: 'elbow.r', above: level(END_BAR_Y), pose: 'end' },
    // elbow level (c6): the elbow joint centre at the shoulder joint's height, within 1 cm
    { landmark: 'elbow.r', plane: level(landmarksOf(end, H)['shoulder.r'][1]), pose: 'end', tol: 1 },
    // mistake (c5): elbows above the shoulders
    { landmark: 'elbow.r', above: level(landmarksOf(end, H)['shoulder.r'][1]), pose: 'mistake' },
  ],
  ghosts: { count: 3, parts: ['arm.r'] },
  trace: { point: 'elbow.r', trim: [10, 12] },
  datum: [{ y: 'shoulder.r', from: 12, to: 'shoulder.r' }],
  measure: { vertex: 'shoulder.l', from: 'down', to: 'elbow.l', title: 'Shoulder', value: 'level, 90°', expect: 90, box: { left: 262, top: 92 } },
  callouts: [
    // c3
    { key: 'elbows', text: 'Elbows lead', anchor: 'elbow.l', cue: 'Lead with your elbows out to the sides, above your hands.' },
    // c6
    { key: 'height', text: 'Shoulder<br>height', anchor: { at: 'shoulder.r', off: [-110, 0] }, prefer: 'above', cue: 'Stop when your elbows reach shoulder level.' },
    // c3
    { key: 'bar', text: 'Bar close', anchor: 'grip.r', cue: 'Pull the bar straight up, close to your body.' },
  ],
  tempo: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],   // c10
  mistake: {
    pose: mistakePose,
    guides: [
      // the bar keeps rising past the lower ribs up to the chin
      { kind: 'arrow', from: { at: 'grips', pose: 'end', off: [0, -6] }, to: { at: 'grips', pose: 'mistake', off: [0, 8] } },
      // the elbow climbs above the shoulder line (the datum)
      { kind: 'arrow', from: { at: 'elbow.l', pose: 'end', off: [10, 0] }, to: { at: 'elbow.l', pose: 'mistake', off: [10, 0] } },
    ],
    tells: [
      // c5
      { key: 'chin', text: 'Bar under<br>chin', anchor: { at: 'chin', pose: 'mistake' }, cue: 'The bar is pulled up under the chin.' },
      // c5
      { key: 'elbows', text: 'Elbows above<br>shoulders', anchor: { at: 'elbow.l', pose: 'mistake' }, cue: 'The elbows rise above the shoulders.' },
    ],
  },
  alt: 'Barbell upright row, front view. Standing upright, overhand grip wider than the shoulders, the lifter pulls the bar straight up close to the body from the thighs to the lower ribs, elbows leading out to the sides and stopping level with the shoulders, higher than the hands.',
};
