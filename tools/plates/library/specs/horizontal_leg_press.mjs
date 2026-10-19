// Horizontal leg press (seated, level sled, vertical foot plate), side view, figure faces the plate (screen right).
// LB1, mode H, tier C. Clone source: leg_press (golden A, bc0f378): legPress45 with the rail level (angle 0).
// View: side (card plate.view). Knee angle, the back on the pad and the knee lockout (the fault) are sagittal.
// Source: docs/research/howto/cards/horizontal_leg_press.json. Claims used: c1 (back and tailbone flat on the pad,
// feet flat, knees at about 90 degrees at the start), c2 (hands light on the handles), c4 (push until the knees are
// relaxed and nearly straight; never lock; hips stay on the pad), c5 (thighs clear of the ribs), c7 (heels pressed
// into the plate; never lock the knees), c12/c13 (tempo 2 s push, 1 s pause at the top, 2 s return).
// Drawn order: start = the card's start (the bottom, knees 90), end = the push finished with soft knees. Mistake
// (card plate.mistake, c7, c4, c8): the knees snap straight and lock; the sled runs further along the rail.
// Geometry decisions:
//  - Back pad 40 deg back from vertical (pelvis tilt -40): at the bottom the hip is flexed about 128 deg, the thigh
//    well clear of the ribs (c5). Hip-joint centre 0.55 m up.
//  - Bottom: knee 90, the shin 12 deg below horizontal, so a vertical plate needs 12 deg of ankle dorsiflexion and the
//    heels stay flat (c1, c7).
//  - Foot plate vertical (card equipment), its face 24 cm above the level rail; feet hip width, toes forward (c1).
//  - End: the sled is placed so the knee is 15 deg short of straight (soft: a small bend left, c4), the approved
//    leg_press top ("knees 15 deg short of lockout", vendor leg_press.mjs:13, :23; ruling Q-D5-3, lib4-cards 13.3).
//    Mistake: the sled runs on until the knee is straight (0.5 deg); hips and back stay on the pad (one fault only).
//  - Zoom (LIB-ZOOM, owner option A, D-LIB8-shrug): at 15 deg PQ-H3's Mistake deviation is 8.2 px at plate scale, under
//    the 11.39 px bar. The end pose stays card-true; the Mistake view carries a zoom circle on the knee at k 2, where the
//    lock moves 16.3 px. No angle in the circle (owner rule).
// Unsourced numbers: back pad 40 deg from vertical (pelvis tilt -40); hip-joint centre 0.55 m up; bottom shin 12 deg
//  below horizontal; plate face 24 cm above the rail, plate 62 cm tall, rail 1.25 m; mid-sole 10 cm above the face
//  reference; feet 11 cm either side of the midline (hip width); handle 25 cm out, 2 cm above and 12 cm ahead of the
//  hip; seat pan rising 12 deg; Mistake knee 0.5 deg (the engine cannot reach exactly 0); end knee 15 deg (the card
//  gives no end-knee number; taken from the anchor, vendor exercises/leg_press.mjs:13, :23; lib4-cards 13.4 must-fix 8).
import { legPressFace, landmarksOf } from '../engine.mjs';

const H = 1.75, R = Math.PI / 180;
const TILT = -40;                                        // back pad 40 deg back from vertical
const HIP = [0, 0.55, 0];
const OFF = 0.24;                                        // plate face reference 24 cm above the rail line
const SOLE_UP = 0.10;                                    // mid-sole 10 cm above the face reference
const FOOT_X = 0.11;                                     // feet about hip width (c1)
const SHIN = -12;                                        // bottom: knee -> ankle, deg from horizontal

// Bottom (start) leg from the angles; the rail is fitted through it.
const KNEE0 = 90, TH = (SHIN + 180 - KNEE0) * R, S = SHIN * R, LT = 0.245 * H, LS = 0.246 * H;
const kneeB = [0, HIP[1] + LT * Math.sin(TH), HIP[2] + LT * Math.cos(TH)];
const ankleB = [0, kneeB[1] + LS * Math.sin(S), kneeB[2] + LS * Math.cos(S)];
const N = [0, 0, -1], UP = [0, 1, 0];                    // vertical plate: face normal toward the lifter, up
const soleB = [0, ankleB[1] - N[1] * 0.039 * H + UP[1] * 0.044 * H, ankleB[2] - N[2] * 0.039 * H + UP[2] * 0.044 * H];
const faceB = [0, soleB[1] - SOLE_UP, soleB[2]];
const BACK_T = 0.55;                                     // rail line starts 55 cm behind the bottom sled spot
const FROM = [0, faceB[1] - OFF, faceB[2] - BACK_T];
const LP = { rail: { from: FROM, angle: 0, length: 1.25 }, offset: OFF, plate: { tilt: 0, h: 0.62 } };

const feetAt = tv => {
  const fc = legPressFace(LP, tv), c = [0, fc.at[1] + fc.up[1] * SOLE_UP, fc.at[2] + fc.up[2] * SOLE_UP];
  return { l: { at: [FOOT_X, c[1], c[2]], normal: fc.normal, toe: fc.up }, r: { at: [-FOOT_X, c[1], c[2]], normal: fc.normal, toe: fc.up } };
};
const travelOf = lm => {
  const s = lm['sole.r'], fc = legPressFace(LP, 0);
  return (s[2] - fc.at[2]);                              // level rail: travel is the plate's z shift
};
// footplate outline (world) at a sled travel, the same box as legPress45's plate
const plateOutline = tv => {
  const fc = legPressFace(LP, tv), t = 0.035, lo = -0.62 * 0.35, hi = 0.62 * 0.65;
  const P = (u, d) => [0, fc.at[1] + fc.up[1] * u - fc.normal[1] * d, fc.at[2] + fc.up[2] * u - fc.normal[2] * d];
  return [P(lo, 0), P(hi, 0), P(hi, t), P(lo, t), P(lo, 0)];
};
const HANDLE = [0.25, HIP[1] + 0.02, HIP[2] + 0.12];
const hands = { l: { at: HANDLE, pole: [1, 0.25, 0] }, r: { at: [-HANDLE[0], HANDLE[1], HANDLE[2]], pole: [-1, 0.25, 0] } };
const base = { root: { at: HIP, tilt: TILT }, trunk: 0, neck: 12, reach: hands };

// knee angle (deg from straight) of the right leg at a sled travel
const kneeAt = tv => {
  const lm = landmarksOf({ ...base, plant: feetAt(tv) }, H), h = lm['hip.r'], k = lm['knee.r'], a = lm['ankle.r'];
  const u = [k[1] - h[1], k[2] - h[2]], v = [a[1] - k[1], a[2] - k[2]];
  return Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) / R;
};
const travelFor = deg => {   // bisect the sled travel for a knee angle (the knee straightens as the sled runs out)
  let lo = BACK_T, hi = BACK_T + 0.45;
  if ((kneeAt(lo) - deg) * (kneeAt(hi) - deg) > 0) throw new Error(`horizontal_leg_press: no sled travel gives knee ${deg} deg`);
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if (kneeAt(m) > deg) lo = m; else hi = m; }
  return (lo + hi) / 2;
};
const T_START = BACK_T, T_END = travelFor(15), T_LOCK = travelFor(0.5);   // end: 15 deg (Q-D5-3)

const start = { ...base, plant: feetAt(T_START) };
const end = { ...base, plant: feetAt(T_END) };

// Pads: back pad tangent to the upper back and the sacrum (correct pose), seat pan under the pelvis.
const LM = landmarksOf(start, H);
const PAD_U = (() => { const d = [0, LM.backUpper[1] - LM.sacrum[1], LM.backUpper[2] - LM.sacrum[2]], l = Math.hypot(...d); return d.map(v => v / l); })();
const PAD_N = [0, -PAD_U[2], PAD_U[1]];
const SEAT_POST = [0, LM.buttock[1] - 0.075, LM.buttock[2] + 0.12];
const PAD_MID = [0, LM.sacrum[1] + PAD_U[1] * 0.25 - PAD_N[1] * 0.07, LM.sacrum[2] + PAD_U[2] * 0.25 - PAD_N[2] * 0.07];
const SEAT_RISE = 12;
const FACE_END = legPressFace(LP, T_END);

const mistakePose = { plant: feetAt(T_LOCK) };

export default {
  id: 'horizontal_leg_press', name: 'Horizontal Leg Press', view: 'side', facing: 'right',
  camera: { fit: { left: 10, right: 10, top: 40, bottom: 18 }, maxScale: 1 },
  poses: { start, end },
  equipment: [
    { type: 'floor', from: PAD_MID[2] - 0.45, to: FROM[2] + 1.35 },
    { type: 'box', at: [0, 0.02, (PAD_MID[2] - 0.12 + FROM[2]) / 2], w: FROM[2] - PAD_MID[2] + 0.12, h: 0.04 },   // frame rail on the floor
    { type: 'box', at: [0, PAD_MID[1] / 2 + 0.02, PAD_MID[2]], w: 0.05, h: PAD_MID[1] - 0.04 },                  // back-pad post
    { type: 'box', at: [0, SEAT_POST[1] / 2 + 0.02, SEAT_POST[2]], w: 0.05, h: SEAT_POST[1] - 0.04 },            // seat post
    { type: 'line', cls: 'eq', pts: [HANDLE, [0, HANDLE[1] - 0.10, HANDLE[2] - 0.02]], z: 'back' },            // handle arm
    { type: 'backPad', surface: [LM.backUpper, LM.sacrum], len: 0.80, below: 0.10, post: false },
    { type: 'backPad', at: [0, LM.buttock[1] - 0.004, LM.buttock[2]], angle: 90 + SEAT_RISE, len: 0.36, below: 0.30, post: false },
    (lm, ctx) => [
      { type: 'legPress45', ...LP, travel: travelOf(lm), part: 'sled' },
      // the start layer never draws moving equipment, so the bottom footplate is added to the end pose as an outline
      ...(ctx.pose === 'end' ? [{ type: 'line', cls: 'eq-thin', pts: plateOutline(T_START), z: 'back' }] : []),
    ],
    { type: 'pulley', at: HANDLE, r: 0.018, z: 'mid' },
  ],
  checks: [
    { landmark: 'sacrum', plane: { point: LM.sacrum, normal: PAD_N }, pose: 'start', tol: 1 },                // tailbone on the pad (c1)
    { landmark: 'sacrum', plane: { point: LM.sacrum, normal: PAD_N }, pose: 'end', tol: 1 },
    { landmark: 'backUpper', plane: { point: LM.backUpper, normal: PAD_N }, pose: 'all', tol: 1 },
    { landmark: 'heel.r', plane: { point: FACE_END.at, normal: FACE_END.normal }, pose: 'end', tol: 1 },     // heels on the plate (c7)
  ],
  ghosts: { count: 3, parts: ['leg.r'] },
  trace: { point: 'knee.r', trim: [6, 8] },
  // 'Back on pad' points at the upper back where it lies on the pad, so its leader crosses the pad edge: the contact
  // has no open side. The other leaders stay clear of the knee trace.
  callouts: [
    { key: 'back', text: 'Back<br>on pad', anchor: 'backUpper', box: { left: 8, top: 218 }, cue: 'Keep the back and tailbone flat on the pad, hips down.' },
    { key: 'ninety', text: 'Knees<br>about 90°', anchor: { at: 'knee.r', pose: 'start' }, box: { left: 98, top: 144 }, cue: 'Set the seat so the knees start at about 90 degrees, heels flat.' },
    { key: 'soft', text: 'Soft<br>knees', anchor: { at: 'knee.r', pose: 'end' }, box: { left: 200, top: 256 }, cue: 'End each push with a small bend left in the knees.' },
  ],
  tempo: [{ phase: 'Press', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    pose: mistakePose,
    parts: ['leg.r', 'sled'],
    guides: [],
    tells: [
      { key: 'lock', text: 'Knees<br>locked', anchor: { at: 'knee.r', pose: 'mistake' }, box: { left: 204, top: 256 }, cue: 'The knees snap straight and lock at the end of the push.' },
    ],
  },
  zoom: { view: 'mistake', k: 2 },
  alt: 'Horizontal leg press, side view. Seated with the back and tailbone on a reclined pad and the feet flat on a vertical plate, the lifter pushes the sled along a level rail from knees at about 90 degrees until the knees are relaxed and nearly straight, never locked.',
};
