// LIB-15R2 (D-LIB10-TEMPLATES, -CHILDPROOF, -FACTS; D-LIB15R2-MODES, -EZ; lb5/DESIGN.md 17.5): the CURL template.
// Parent: lib_dumbbell_biceps_curl (H, batches/pilot-a.json:160; pinned entry tests/howto/golden/library/pilot-a.json:261).
// Its code is copied from specs/dumbbell_biceps_curl.mjs (D-LIB9-CLONE), never imported, so that make(parentParams,
// parentFacts) rebuilds the pinned plate byte for byte (the parent proof). Only these change, each read from params or
// facts:
//  - `stance.width` (m, mid-sole to mid-sole): FOOT_X = width / 2 (the parent's 0.28 m, shoulder width);
//  - `load.primitive`: 'dumbbell' (the parent's end-on hex and dashed start hex) or 'barbell' (the vendor barbell end-on
//    at the grip, PLATE_D 0.23 m and one 3 cm plate, preacher_curl's drawn EZ plate; D-LIB15R2-EZ; its dashed start
//    plate circle replaces the hex);
//  - facts (closed schema FACTS): id, name, callouts, tempo, mistake (a builder from BUILDERS with its tells), alt,
//    mistakeAlt, pilot. Unknown params or facts keys throw (D-LIB10-FACTS).
// Unsourced numbers: the parent's (its header), PLATE_D and the plate width (drawn), every builder magnitude (drawn,
//  never enlarged to pass a check, Q-D5-3).
import { WINTER, REF, bodyShapes, fk, resolve, normPose } from '../engine.mjs';

export const PARAMS_READ = Object.freeze({ 'load.primitive': ['dumbbell', 'barbell'], 'stance.width': 'number' });
export const PLATE_D = 0.23;
/** Fault builders (D-LIB10-FACTS 7): each with its named, bounded magnitudes. */
export const BUILDERS = Object.freeze({
  // the elbows drift off the sides near the top of the curl: the parent's builder (forward, c4) and its mirror (back)
  elbows: Object.freeze({ forward: Object.freeze({ flex: 45, elbow: 120 }), back: Object.freeze({ flex: -30, elbow: 120 }) }),
});
export const FACTS = Object.freeze(['id', 'name', 'callouts', 'tempo', 'mistake', 'alt', 'mistakeAlt', 'pilot']);
const MISTAKE_KEYS = ['builder', 'dir', 'tells'];

export const parentParams = Object.freeze({ 'load.primitive': 'dumbbell', 'stance.width': 0.28 });
export const parentFacts = Object.freeze({
  id: 'dumbbell_biceps_curl', name: 'Dumbbell Biceps Curl',
  callouts: [
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', cue: 'Keep the upper arms by your sides, never back, at most slightly forward on top.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep the hand in line with the forearm, not bent up or down.' },
    { key: 'still', text: 'Still<br>body', anchor: 'backUpper', box: { left: 96, top: 108 }, cue: 'Keep the torso and knees still, so only the forearms travel.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    builder: 'elbows', dir: 'forward',
    tells: [
      { key: 'elbows', text: 'Elbows<br>forward', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows drift forward off your sides.' },
      { key: 'shoulder', text: 'Shoulder<br>takes over', anchor: { at: 'shoulder.r', pose: 'mistake', off: [8, -2] }, cue: 'The front of your shoulder takes over the lift.' },
    ],
  },
  alt: 'Dumbbell biceps curl, side view. Standing tall with a dumbbell in each hand, palms forward. The elbows stay at the sides while the forearms curl the dumbbells from the thighs up to the front of the shoulders.',
});

const bad = why => { throw new Error(`CURL: ${why}`); };
/** The spec for `params` (PARAMS paths; a missing one takes the parent's value) and `facts` (the closed schema). */
export function make(params, facts) {
  for (const k of Object.keys(params ?? {})) if (!Object.hasOwn(PARAMS_READ, k)) bad(`param ${k} is not read by this template`);
  for (const k of Object.keys(facts ?? {})) if (!FACTS.includes(k)) bad(`facts key ${k} is not in the facts schema`);
  for (const k of ['id', 'name', 'callouts', 'tempo', 'mistake', 'alt']) if (!(k in facts)) bad(`facts.${k} is missing`);
  for (const k of Object.keys(facts.mistake)) if (!MISTAKE_KEYS.includes(k)) bad(`facts.mistake.${k} is not in the schema`);
  const p = { ...parentParams, ...params };
  if (!PARAMS_READ['load.primitive'].includes(p['load.primitive'])) bad(`load.primitive ${JSON.stringify(p['load.primitive'])}`);
  const width = p['stance.width'];
  if (typeof width !== 'number' || !Number.isFinite(width)) bad(`stance.width ${JSON.stringify(width)}`);
  const bar = p['load.primitive'] === 'barbell';
  const drift = BUILDERS[facts.mistake.builder]?.[facts.mistake.dir] ?? bad(`builder ${facts.mistake.builder} ${facts.mistake.dir}`);
  const back = facts.mistake.dir === 'back';

  const H = 1.75;
  const KNEE_SOFT = 6;                             // knees slightly bent (c2)
  const FOOT_X = width / 2;                        // mid-sole lateral offset: half the stance width (the parent's 0.28 m: shoulder width, c2)
  // HJC height that gives KNEE_SOFT with the ankle under the foot: hip-ankle distance of the bent leg, less the
  // sideways part (HJC 8.75 cm off the mid-plane, ankle at FOOT_X), plus the ankle height.
  const LEG = (() => { const a = WINTER.thigh * H, b = WINTER.shank * H, k = KNEE_SOFT * Math.PI / 180; return Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k)); })();
  const ROOT_Y = Math.sqrt(LEG * LEG - (FOOT_X - REF.hjcX * H) ** 2) + WINTER.ankleH * H;
  const FOOT_Z = REF.mid * H;                      // mid-sole in front of the ankle: legs vertical under the hips
  const ELBOW_START = 0;                           // arms fully extended at the bottom
  const ELBOW_END = 140;                           // fully curled: forearm 40 deg past vertical
  const SHOULDER_FLEX_START = 0, SHOULDER_FLEX_END = 0;   // elbows pinned at the sides: upper arm vertical (c3)
  const SCAP = { elev: -1, pro: -1 };              // cm: shoulders set down and slightly back (c8)
  const HEX_R = 0.119 / 2;
  // Mistake (card plate.mistake, c4): "Elbows drifting forward or back during the curl instead of staying at the sides."
  // The card gives no angle, so the drift is drawn only large enough to read at 390 px, well past c13's "slightly forward".
  const MIS_FLEX = drift.flex;                     // deg shoulder flexion: the upper arm swings off the side (forward 45, back -30)
  const MIS_MARGIN = 0.10;                         // m: the drifted elbow is at least this far past the shoulder plane
  const MIS_ELBOW = drift.elbow;                          // deg: near the top of the curl, the forearm a little past vertical
  const MIS_SIDE = SCAP.pro / 100;                 // z of the shoulder joint (the side line), scapulae 1 cm back

  const feet = { l: { at: [FOOT_X, 0, FOOT_Z] }, r: { at: [-FOOT_X, 0, FOOT_Z] } };
  const base = { root: { at: [0, ROOT_Y, 0], tilt: 0 }, trunk: 0, neck: 0, scap: SCAP, wrist: 0, plant: feet };
  const start = { ...base, shoulder: { flex: SHOULDER_FLEX_START, rot: 0 }, elbow: ELBOW_START };
  const end = { ...base, shoulder: { flex: SHOULDER_FLEX_END, rot: 0 }, elbow: ELBOW_END };
  const mistakePose = { shoulder: { flex: MIS_FLEX, rot: 0 }, elbow: MIS_ELBOW };   // merged over the end pose: only the arms change
  // Dashed start dumbbell (hex face, the primitive's orientation: a corner points screen-right = +z).
  const startHexOf = g => Array.from({ length: 7 }, (_, k) => [g[0], g[1] - HEX_R * Math.sin(k * Math.PI / 3), g[2] + HEX_R * Math.cos(k * Math.PI / 3)]);
  // (template) the barbell's dashed start plate: the end-on plate circle, 24 sides, closed (D-LIB15R2-EZ: PLATE_D)
  const startPlate = g => Array.from({ length: 25 }, (_, k) => [g[0], g[1] - PLATE_D / 2 * Math.sin(k * Math.PI / 12), g[2] + PLATE_D / 2 * Math.cos(k * Math.PI / 12)]);
  const startLoad = bar ? startPlate : startHexOf;
  // Start forearm as hidden lines (the approved pull_up method): engine body shapes on a 1000 px/m probe camera,
  // sampled on the same Catmull-Rom spline the engine draws, kept only where the end figure covers them and outside
  // the start upper arm and the start hex, mapped back to world metres for 'line'.
  const cr = (ps, k = 8) => {
    const n = ps.length, g = i => ps[(i + n) % n], out = [];
    for (let i = 0; i < n; i++) {
      const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t;
        out.push([0, 1].map(d => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d])); }
    }
    return out;
  };
  const inside = (p, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < (xj - xi) * (p[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
  function hiddenForearm() {
    const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
    const skS = fk(resolve(normPose(start, bd), bd).q, bd), skE = fk(resolve(normPose(end, bd), bd).q, bd);
    const shapes = sk => bodyShapes(sk, probe).map(s => ({ key: s.key, pts: s.key.includes('cap') ? s.poly : cr(s.poly) }));
    const S = shapes(skS), fore = S.find(s => s.key === 'fore.r');
    const hex = startLoad(skS.G.r).slice(0, -1).map(w => probe.P(w));
    const others = [S.find(s => s.key === 'upper.r').pts, hex], cover = shapes(skE).map(s => s.pts), items = [];
    const vis = fore.pts.map(p => !others.some(o => inside(p, o)) && cover.some(c => inside(p, c)));
    const n = fore.pts.length, i0 = vis.indexOf(false);
    let run = [];
    for (let k = 1; k <= n; k++) { const i = (i0 + k) % n;
      if (vis[i]) run.push(fore.pts[i]); else { if (run.length > 2) items.push(run); run = []; } }
    if (run.length > 2) items.push(run);
    return items.map(r => ({ type: 'line', pts: r.map(([x, y]) => [0, -y / 1000, x / 1000]), cls: 'eq-cable m-line', z: 'front', part: 'startarm' }));
  }
  const START_FORE = hiddenForearm();
  // The faulty arm (Mistake only): the engine masks its outline inside the faulty body, so it is redrawn as Mistake
  // guides (dashed outline polylines, not masked), as barbell_overhead_press does: engine body shapes on the probe
  // camera, on the engine's spline, mapped back to world metres.
  function misArm() {
    const bd = { height: H }, probe = { view: 'side', near: 'r', pxm: 1000, P: w => [w[2] * 1000, -w[1] * 1000] };
    const keys = ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'];
    return bodyShapes(fk(resolve(normPose({ ...end, ...mistakePose }, bd), bd).q, bd), probe).filter(sh => keys.includes(sh.key))
      .map(sh => (sh.key.includes('cap') ? sh.poly : cr(sh.poly, sh.key.startsWith('fist') ? 4 : 8)).map(([x, y]) => [0, -y / 1000, x / 1000]));
  }
  const MIS_ARM = misArm();

  return {
    id: facts.id, name: facts.name, view: 'side', facing: 'right',
    camera: { x0: 168, y0: 339 },                  // reference scale; figure + curl arc centred on the plate
    poses: { start, end },
    equipment: [
      { type: 'floor', from: -0.5, to: 0.62 },
      // near load, end-on: moves with the near arm, so it ghosts and dashes with it
      bar ? lm => ({ type: 'barbell', at: lm['grip.r'], plateD: PLATE_D, plates: [0.03], part: 'arm.r' }) : lm => ({ type: 'dumbbell', at: lm['grip.r'], part: 'arm.r' }),
      (lm, ctx) => (ctx.pose === 'end' ? [...START_FORE, { type: 'line', cls: 'eq-cable m-line', pts: startLoad(ctx.start['grip.r']), z: 'front', part: 'startdb' }] : null),
    ],
    checks: [
      { landmark: 'heel.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },   // feet flat
      { landmark: 'ball.r', plane: { point: [0, 0, 0], normal: [0, 1, 0] }, pose: 'all', tol: 0.5 },
      // the elbow stays pinned: on the vertical plane through the shoulder joint (set 1 cm back), start and end
      ...['start', 'end'].map(pose => ({ landmark: 'elbow.r', plane: { point: [0, 0, SCAP.pro / 100], normal: [0, 0, 1] }, pose, tol: 0.5 })),
      // top: the load centre stays in front of the sternum (hex radius 6 cm + chest line), never inside the chest
      { landmark: 'grip.r', above: { point: [0, 0, 0.072 * H + 0.06], normal: [0, 0, 1] }, pose: 'end' },
      // fault: the elbow drifts at least MIS_MARGIN past the shoulder plane (+z = figure forward; back: -z)
      back ? { landmark: 'elbow.r', above: { point: [0, 0, MIS_SIDE - MIS_MARGIN], normal: [0, 0, -1] }, pose: 'mistake' }
        : { landmark: 'elbow.r', above: { point: [0, 0, MIS_SIDE + MIS_MARGIN], normal: [0, 0, 1] }, pose: 'mistake' },
    ],
    startParts: ['arm.r'],
    ghosts: { count: 3, parts: ['arm.r'] },
    trace: { point: 'grip.r', trim: [12, 14] },
    measure: { vertex: 'elbow.r', from: { at: 'grip.r', pose: 'start' }, to: 'grip.r', radius: 20, title: 'Elbow', value: 'full range' },
    callouts: facts.callouts,
    tempo: facts.tempo,
    mistake: {
      pose: mistakePose,
      parts: ['arm.r'],
      guides: [
        ...MIS_ARM.map(pts => ({ kind: 'dashed', pts: [...pts, pts[0]] })),   // the faulty arm, swung off the side
        { kind: 'dashed', pts: [[0, 1.42, MIS_SIDE], [0, 0.98, MIS_SIDE]] },   // the side line through the shoulder joint
        back ? { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-3, 0] }, to: { at: 'elbow.r', pose: 'mistake', off: [6, 2] } }
          : { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [3, 0] }, to: { at: 'elbow.r', pose: 'mistake', off: [-6, 2] } },
      ],
      tells: facts.mistake.tells,
    },
    ...(facts.mistakeAlt ? { mistakeAlt: facts.mistakeAlt } : {}),
    ...(facts.pilot ? { pilot: facts.pilot } : {}),
    alt: facts.alt,
  };
}
