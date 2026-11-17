// LIB-PLATEFIX-6d straight_bar_triceps_pushdown (F-PUSHDOWN-DRIFT; card lib-platefix-6c rows 8, A16, A17; rulings
// D-PF6D-ENDTILT, D-PF6C-AMEND (e), D-SHIP-DRAWVAL). W10 L1/L5 (c1, c2, c3): the end pose stands upright and HIP LEAN
// ONLY points at a hip that does not lean; the Elbows Wrong keeps the upper arm about 13-15 deg from plumb.
// Measured from the engine's landmarks at the render's camera (plate px; the W10 close-up tiles are 2.443 PNG px per
// plate px: 2x the 171/140 panel scale, checked on c1's shoulder, elbow and Right-bar points).
//  A16: the end trunk (hip.r -> shoulder.r) leans at least 5 deg more than the start and at most 25 deg from plumb; the
//   bar's edge >= 3 px in front of the drawn thigh outline at the bar's height; a leader ends within 0.5 px of hip.r;
//   make(parentParams, parentFacts) still draws specs/triceps_pushdown.mjs byte for byte (the facts key endTilt, default 8).
//  A17: the Elbows Wrong upper arm 40-45 deg forward of plumb (c1 35-45, c2 30-45, c3 40-60); the elbow >= 15 px in front
//   of the shoulder's vertical and of the hip-shoulder line; the bar at or above the chest landmark; the Wrong panel draws
//   one dashed vertical through the shoulder (`width`) and one `turn` arrow on the elbow path; the Right draws neither.
// Red on base ff75bf0e: end lean - start 0.0 deg; Wrong upper arm 14.0 deg, elbow 10.5 px in front of the shoulder
// vertical, bar 27.9 px below the chest; no width or turn guide. (Bar 5.79 px in front of the thigh, hip leader 0.05 px:
// already green.) After (endTilt 14; EF_FLEX 53, EF_ELBOW 100): lean +6.0 deg (16.0 from plumb), bar 12.03 px in front,
// hip leader 0.05 px; upper arm 42.0 deg, elbow 29.1 / 34.3 px, bar 18.9 px above the chest.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
type V = number[];
let TPL: any, parent: any, child: any, plate: any, vb: any, qa: any, cu: any, common: any, PAGES: any, howtoMod: any;
beforeAll(async () => {
  [TPL, parent, child, plate, vb, qa, cu, common, PAGES, howtoMod] = await Promise.all(['templates/PUSHDOWN.mjs', 'specs/triceps_pushdown.mjs',
    'specs/straight_bar_triceps_pushdown.mjs', '../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', 'qa/engine.mjs', 'render/closeups.mjs',
    'render/closeup/common.mjs', 'pages/lb05.closeups.mjs', 'howto/lib_straight_bar_triceps_pushdown.howto.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
}, T);

const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const lean = (lm: any) => Math.atan2(lm['shoulder.r'][2] - lm['hip.r'][2], lm['shoulder.r'][1] - lm['hip.r'][1]) * 180 / Math.PI;   // + = forward

/** A16's numbers for one plate spec. */
const endOf = (spec: any) => {
  const n = plate.renderPlate(spec, { id: 'sb' }), cam = qa.cameraOf(spec, n.report), L = qa.poseLandmarks({ body: vb }, spec);
  const sk = vb.fk(L.q.end, { height: 1.75 }), shapes = vb.bodyShapes(sk, cam, { armsFront: spec.armsFront, hand: spec.hand, torso: spec.torso });
  const bar = cam.P(L.lm.end.grips), br = 0.028 / 2 * cam.pxPerM;   // the latBar end-on circle (d 28 mm)
  const frontAt = (poly: V[], y: number) => { let mx = -Infinity; for (let i = 0; i < poly.length; i++) { const a = poly[i]!, b = poly[(i + 1) % poly.length]!;
    if ((a[1]! - y) * (b[1]! - y) <= 0 && a[1] !== b[1]) mx = Math.max(mx, a[0]! + (y - a[1]!) / (b[1]! - a[1]!) * (b[0]! - a[0]!)); } return mx; };
  const front = Math.max(...['thigh.r', 'thigh.l'].flatMap(k => { const p = shapes.find((s: any) => s.key === k).poly; return [bar[1]! - br, bar[1]!, bar[1]! + br].map(y => frontAt(p, y)); }));
  const ends = [...n.svg.matchAll(/<path class="leader[^"]*"[^>]*d="M([\d.-]+) ([\d.-]+)L/g)].map(m => [+m[1]!, +m[2]!]);
  const hip = cam.P(L.lm.end['hip.r']);
  return { leanGain: lean(L.lm.end) - lean(L.lm.start), leanEnd: lean(L.lm.end), gap: bar[0]! - br - front, hipLeader: Math.min(...ends.map(e => d2(e, hip))), issues: n.report.issues };
};
const a16Problems = (x: any) => [
  ...(x.leanGain >= 5 ? [] : [`end lean only ${x.leanGain.toFixed(1)} deg more than the start (< 5)`]),
  ...(x.leanEnd <= 25 ? [] : [`end lean ${x.leanEnd.toFixed(1)} deg from plumb (> 25)`]),
  ...(x.gap >= 3 ? [] : [`bar ${x.gap.toFixed(2)} px in front of the thigh outline (< 3)`]),
  ...(x.hipLeader <= 0.5 ? [] : [`hip leader ${x.hipLeader.toFixed(2)} px from the hip`]),
];

describe('PF6d A16 pushdown: the end trunk leans from the hips, the bar ends in front of the thighs', { timeout: T }, () => {
  it('end lean >= 5 deg over the start and <= 25 deg, bar >= 3 px in front of the thigh, hip leader <= 0.5 px, no engine issue', () => {
    const x = endOf(child.default);
    console.log(`PF6d A16: lean +${x.leanGain.toFixed(2)} deg (${x.leanEnd.toFixed(2)} from plumb), bar ${x.gap.toFixed(2)} px in front of the thigh, hip leader ${x.hipLeader.toFixed(3)} px`);
    expect(a16Problems(x)).toEqual([]);
    expect(x.issues).toEqual([]);
  });
  it('the parent proof: make(parentParams, parentFacts) draws the parent plate byte for byte; the child sets endTilt 14', () => {
    const r = (s: any, m: boolean) => plate.renderPlate(s, { id: 'pd', mistake: m }).svg, t = TPL.make(TPL.parentParams, TPL.parentFacts);
    expect(r(t, false)).toBe(r(parent.default, false));
    expect(r(t, true)).toBe(r(parent.default, true));
    expect(child.facts.endTilt).toBe(14);
    expect(TPL.FACTS).toContain('endTilt');
  });
  it('m18: a default end tilt of 10 (the parent facts drawn at 10) no longer rebuilds the parent', () => {
    const r = (s: any) => plate.renderPlate(s, { id: 'pd' }).svg;
    expect(r(TPL.make(TPL.parentParams, { ...TPL.parentFacts, endTilt: 10 }))).not.toBe(r(parent.default));
  });
  it('m19: the child with its end tilt back to 8 is red on the lean', () => {
    const s = TPL.make({ 'bar.kind': 'straight' }, { ...child.facts, endTilt: 8 });
    expect(a16Problems(endOf(s)).some(p => /end lean only/.test(p))).toBe(true);
  });
});

describe('PF6d A17 pushdown: the Elbows Wrong swings the upper arm forward, with a shoulder vertical and an elbow-path arrow', { timeout: T }, () => {
  const howto = () => howtoMod.default, zoom = () => howto().zooms.find((z: any) => z.key === 'pushdown-elbow');
  const measure = async (z: any) => {
    const sp = howto().plate, cam = plate.renderPlate(sp, { id: 'b' }).report.camera, P = (w: V): V => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
    const S = sp.poses.start, W = common.mergeDeep(S, z.wrong.pose), lR = vb.landmarksOf(S, 1.75), lW = vb.landmarksOf(W, 1.75);
    const sh = P(lW['shoulder.r']), el = P(lW['elbow.r']), hp = P(lW['hip.r']), d = [sh[0]! - hp[0]!, sh[1]! - hp[1]!], L = Math.hypot(d[0]!, d[1]!);
    const upper = Math.atan2(lW['elbow.r'][2] - lW['shoulder.r'][2], lW['shoulder.r'][1] - lW['elbow.r'][1]) * 180 / Math.PI;
    const specFile = new URL(lib('specs/straight_bar_triceps_pushdown.mjs')).pathname, engine = await cu.engineOf(specFile);
    const html = cu.closeupApi({ ...howtoMod, default: { ...howto(), zooms: [z] } }, PAGES.CLOSEUP_OPTIONS.straight_bar_triceps_pushdown, { engine, specFile }).postureZoom(z);
    const [Rh, Wh] = html.split('<div class="plate z-wrap">').slice(1) as string[];
    const [vx, vy, sz] = (/viewBox="([^"]*)" class="z-plate"/.exec(Wh)![1]!.match(/-?[\d.]+/g) ?? []).map(Number), k = 171 / sz!;
    const toW = (q: V): V => [(q[0]! - vx!) * k, (q[1]! - vy!) * k];
    const widths = [...Wh.matchAll(/<path class="z-width z-level m" d="M([-\d.]+) /g)].map(m => +m[1]!);
    const turns = [...Wh.matchAll(/<g class="z-turn"><path class="z-drop" d="M([-\d.]+) ([-\d.]+)A[^"]*"\/><path class="z-drop-head" d="M[-\d.]+ [-\d.]+L([-\d.]+) ([-\d.]+)L/g)]
      .map(m => ({ from: [+m[1]!, +m[2]!], tip: [+m[3]!, +m[4]!] }));
    return { upper, dxShoulder: el[0]! - sh[0]!, dxTrunk: (-(el[0]! - hp[0]!) * d[1]! + (el[1]! - hp[1]!) * d[0]!) / L,
      barAboveChest: P(lW.chest)[1]! - P(lW.grips)[1]!, widths, shoulderX: toW(sh)[0]!, turns, elR: toW(P(lR['elbow.r'])), elW: toW(el),
      rightGuides: /z-width|z-turn/.test(Rh!) };
  };
  const a17Problems = (x: any) => [
    ...(x.upper >= 40 && x.upper <= 45 ? [] : [`upper arm ${x.upper.toFixed(1)} deg from plumb, not 40-45`]),
    ...(Math.min(x.dxShoulder, x.dxTrunk) >= 15 ? [] : [`elbow ${x.dxShoulder.toFixed(1)} / ${x.dxTrunk.toFixed(1)} px in front of the shoulder vertical / trunk line (< 15)`]),
    ...(x.barAboveChest >= 0 ? [] : [`bar ${(-x.barAboveChest).toFixed(1)} px below the chest landmark`]),
    ...(x.widths.length === 1 && Math.abs(x.widths[0] - x.shoulderX) <= 0.5 ? [] : [`dashed shoulder verticals ${JSON.stringify(x.widths)} (shoulder x ${x.shoulderX.toFixed(2)})`]),
    ...(x.turns.length === 1 && d2(x.turns[0].from, x.elR) <= 3 && d2(x.turns[0].tip, x.elW) <= 8 ? [] : [`turn arrows ${JSON.stringify(x.turns)} not one from the Right elbow to the Wrong elbow`]),
    ...(x.rightGuides ? ['the Right panel draws a guide'] : []),
  ];
  it('upper arm 40-45 deg, elbow >= 15 px forward, bar at or above the chest, one shoulder vertical and one elbow-path turn arrow (Wrong only)', async () => {
    const x = await measure(zoom());
    console.log(`PF6d A17: upper arm ${x.upper.toFixed(2)} deg, elbow ${x.dxShoulder.toFixed(2)} / ${x.dxTrunk.toFixed(2)} px, bar ${x.barAboveChest.toFixed(2)} px above the chest, turn ${JSON.stringify(x.turns)}, elbows R ${x.elR.map(v => v.toFixed(1))} W ${x.elW.map(v => v.toFixed(1))}`);
    expect(a17Problems(x)).toEqual([]);
  });
  it('m20: the Wrong back to the spec Mistake\'s shoulder flex and elbow (25, 75) is red on the angle, the elbow and the bar', async () => {
    const MIS = howto().plate.mistake.pose, z = zoom();
    const p = a17Problems(await measure({ ...z, wrong: { ...z.wrong, pose: { ...z.wrong.pose, shoulder: { flex: MIS.shoulder.flex }, elbow: MIS.elbow } } }));
    for (const re of [/upper arm/, /elbow .* in front/, /below the chest/]) expect(p.some(q => re.test(q)), String(re)).toBe(true);
  });
  it('mutation: the guides removed is red on the shoulder vertical and the turn arrow', async () => {
    const p = a17Problems(await measure({ ...zoom(), guides: [] }));
    expect(p.some(q => /shoulder verticals/.test(q)) && p.some(q => /turn arrows/.test(q))).toBe(true);
  });
});
