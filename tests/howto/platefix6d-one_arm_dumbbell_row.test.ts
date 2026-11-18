// LIB-PLATEFIX-6d one_arm_dumbbell_row (F-OADR-CALLOUT; card lib-platefix-6c row 10, A19, A20; D-HFG-OADRH4, D-W10-OADRHOLD).
// A19 (P1): the Flat back and Elbow-to-hip callouts get boxes (back { left 126, top 118 }, elbow { left 66, top 160 }) so
// their hit boxes no longer overlap. The overlap is a browser measurement (qa/browser.mjs PQ-H4 at 390/360/340 px; HT10 C10
// in the app sweep): it runs in the plate QA, not in this unit file (unit jobs have no browser; the platefix2-plates form).
// Here the boxes and the leaders' anchors are pinned. Plate QA, PQ-H1..H10 (scratchpad qa3.mjs, runQa with the browser half):
// red on base ff75bf0e `H4.overlap:normal:back|elbow 80.96 px² (at 340 px)`; after: all 10 pass, flags F5 3.57 and F7
// 'short' as on base. HT10 C10 (n-back/n-elbow 3.2 x 31.1 px on the W10 head) runs only once oadr ships, after #435.
// A20 (S1, W10 c1-c3 L5): the Top twist Wrong draws only the twisted trunk and working arm dashed (no stray dashed support
// limb), with one curved `turn` arrow; the working shoulder >= 12 px above the support shoulder; hips within 1 px of the
// Right's. Red on base: 5 dashed support-arm shapes (shcap/upper/elbowcap/fore/palm .l), no turn guide; shoulder rise
// 36.96 px and hip shift 0.00 px already green. After: 0 support shapes, 1 turn arrow, 36.96 px, 0.00 px (TWIST 30 kept).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
type V = number[];
let S: any, plate: any, vb: any, qa: any, cu: any, common: any, PAGES: any, howtoMod: any;
beforeAll(async () => {
  let s: any;
  [s, plate, vb, qa, cu, common, PAGES, howtoMod] = await Promise.all(['specs/one_arm_dumbbell_row.mjs', '../vendor/engine/plate.mjs', '../vendor/engine/body.mjs',
    'qa/engine.mjs', 'render/closeups.mjs', 'render/closeup/common.mjs', 'pages/lb03.closeups.mjs', 'howto/lib_one_arm_dumbbell_row.howto.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = s.default;
}, T);
const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);

describe('PF6d A19 one_arm_dumbbell_row: the back and elbow callouts boxed apart, leaders still on their anchors', { timeout: T }, () => {
  const a19 = (spec: any) => {
    const n = plate.renderPlate(spec, { id: 'o' }), cam = qa.cameraOf(spec, n.report), L = qa.poseLandmarks({ body: vb }, spec);
    const ends = [...n.svg.matchAll(/<path class="leader[^"]*"[^>]*d="M([\d.-]+) ([\d.-]+)L/g)].map(m => [+m[1]!, +m[2]!]);
    const near = (k: string) => Math.min(...ends.map(e => d2(e, cam.P(L.lm.end[k]))));
    const box = (k: string) => spec.callouts.find((c: any) => c.key === k);
    return [
      // pf6d.1-3 R4: the back anchor moved off backUpper onto the visible back line (pinned below, A19b)
      ...(JSON.stringify(box('back')) === JSON.stringify({ ...box('back'), anchor: { at: 'backUpper', off: [24, -1.2] }, box: { left: 126, top: 118 } }) ? [] : [`back callout ${JSON.stringify(box('back'))}`]),
      ...(JSON.stringify(box('elbow')) === JSON.stringify({ ...box('elbow'), anchor: 'elbow.r', box: { left: 66, top: 160 } }) ? [] : [`elbow callout ${JSON.stringify(box('elbow'))}`]),
      ...(near('elbow.r') <= 0.5 ? [] : [`leader ${near('elbow.r').toFixed(2)} px from elbow.r`]),
      ...n.report.issues.map((i: any) => `engine issue ${JSON.stringify(i)}`),
    ];
  };
  it('back at { 126, 118 } (anchor backUpper + [24, -1.2]), elbow at { 66, 160 } on elbow.r (leader within 0.5 px), no layout issue', () => {
    expect(a19(S)).toEqual([]);
  });
  it('m22: the boxes removed is red', () => {
    const m = { ...S, callouts: S.callouts.map((c: any) => { const { box: _b, ...rest } = c; return rest; }) };
    expect(a19(m).filter(p => /callout/.test(p))).toHaveLength(2);
  });
});

describe('PF6d A20 one_arm_dumbbell_row: the Top twist Wrong reads as a twist', { timeout: T }, () => {
  const measure = async (z: any) => {
    const h = howtoMod.default, sp = h.plate, cam = plate.renderPlate(sp, { id: 'b' }).report.camera, P = (w: V): V => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
    const poseOf = (r: any) => typeof r === 'string' ? sp.poses[r] : common.mergeDeep(sp.poses[r.base], r.pose);
    const R = poseOf(z.right), W = z.wrong.solid ? poseOf(z.wrong) : common.mergeDeep(R, poseOf(z.wrong)), lR = vb.landmarksOf(R, 1.75), lW = vb.landmarksOf(W, 1.75);
    const specFile = new URL(lib('specs/one_arm_dumbbell_row.mjs')).pathname, engine = await cu.engineOf(specFile);
    const html = cu.closeupApi({ ...howtoMod, default: { ...h, zooms: [z] } }, PAGES.CLOSEUP_OPTIONS.one_arm_dumbbell_row, { engine, specFile }).postureZoom(z);
    const Wh = html.split('<div class="plate z-wrap">')[2]!;
    return { rise: P(lW['shoulder.l'])[1]! - P(lW['shoulder.r'])[1]!, hips: Math.max(...['hip.l', 'hip.r', 'hips', 'sacrum'].map(k => d2(P(lR[k]), P(lW[k])))),
      support: [...new Set(Wh.match(/-wrong-m-[a-z]+\.l\b/g) ?? [])], turns: (Wh.match(/<g class="z-turn">/g) ?? []).length };
  };
  const a20Problems = (x: any) => [
    ...(x.rise >= 12 ? [] : [`working shoulder only ${x.rise.toFixed(1)} px above the support shoulder`]),
    ...(x.hips <= 1 ? [] : [`hips ${x.hips.toFixed(2)} px off the Right's`]),
    ...(x.support.length === 0 ? [] : [`dashed support limb drawn: ${x.support.join(' ')}`]),
    ...(x.turns === 1 ? [] : [`${x.turns} turn arrows`]),
  ];
  const zoom = () => howtoMod.default.zooms.find((z: any) => z.key === 'oadr-top');
  it('shoulder >= 12 px above the support shoulder, hips within 1 px, no dashed support limb, one turn arrow', async () => {
    const x = await measure(zoom());
    console.log(`PF6d A20: rise ${x.rise.toFixed(2)} px, hips ${x.hips.toFixed(3)} px, support shapes ${x.support.length}, turns ${x.turns}`);
    expect(a20Problems(x)).toEqual([]);
  });
  it('m23: the Wrong drawn with every part (the dashed support limb back) is red', async () => {
    const z = zoom(), { parts: _p, ...wrong } = z.wrong;
    expect((await a20Problems(await measure({ ...z, wrong }))).some(p => /support limb/.test(p))).toBe(true);
  });
  it('mutation: the turn guide removed is red', async () => {
    expect(a20Problems(await measure({ ...zoom(), guides: [] })).some(p => /turn arrows/.test(p))).toBe(true);
  });
});

// LIB-PLATEFIX-6d plates round 1 (pf6d.1-3 on #438, comment 6937799192; one fix round, D-PFC-ROUND1). Critic tiles are
// 2.0 PNG px per plate px; tile = 2 x plate + (32, 165) here (c3's pad 259-508 / top 720 = plate 113.4-238.8 / 277.6).
//  R2 (4/3/3, c2, c3; R7 c3): the pad is ~30 % short (249 PNG px; house bench ~345-350). Fix: the pad's back end at x about
//   163 in the tile (plate 65.5), the front end kept under the hand; the kneeling shin lies along the pad with the knee on
//   it under the hip, and the foot rests at the bench end (c1, c2): no point of the foot over the pad sinks into it.
//  R4 (3/3/3, c1-c3): the FLAT BACK leader ended at (431,513) tile = plate (199.8, 174.2), inside the working upper arm.
//   Fix: on the visible back outline between the arm and the neck, tile (475-480, 509) = plate (221.5-224, 172).
// Red on 11031b58: pad x 113.4-237.9 (124.5 px); foot 10.4 px into the pad level past its end; the leader 0.0 px inside
// upper.r, 2.6 px under the torso's top edge. After: pad 65.2-237.9 (172.7 px = 345 tile px); knee 0.00 px from under the
// hip, shank 0.0 px on the pad; foot 0.4 px above the pad top, toe 8.9 px past the end; leader end 0.10 px from the back
// outline, outside every other shape.
describe('PF6d oadr fix round: the bench pad at house length with the kneeling leg on it; FLAT BACK on the back line', { timeout: T }, () => {
  const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
    if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segDist = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
    return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
  const fix = (spec: any) => {
    const n = plate.renderPlate(spec, { id: 'o' }), cam = qa.cameraOf(spec, n.report), L = qa.poseLandmarks({ body: vb }, spec), lm = L.lm.end;
    const shapes = vb.bodyShapes(vb.fk(L.q.end, { height: 1.75 }), cam, { armsFront: spec.armsFront, hand: spec.hand, torso: spec.torso });
    const bench = spec.equipment.find((e: any) => e.type === 'bench');
    const x0 = cam.P([0, 0, bench.at[2] - bench.len / 2])[0]!, x1 = cam.P([0, 0, bench.at[2] + bench.len / 2])[0]!, top = cam.P([0, bench.at[1], 0])[1]!;
    const poly = (k: string): V[] => shapes.find((s: any) => s.key === k).poly;
    const shank = poly('shank.l'), foot = poly('foot.l'), knee = cam.P(lm['knee.l']), hip = cam.P(lm['hip.l']), ankle = cam.P(lm['ankle.l']), toe = cam.P(lm['toe.l']);
    const sink = Math.max(...foot.filter(q => q[0]! >= x0).map(q => q[1]! - top), -Infinity);
    const c = spec.callouts.find((q: any) => q.key === 'back'), at = qa.resolvePoint(c.anchor, 'end', L.lm, cam);
    const ends = [...n.svg.matchAll(/<path class="leader[^"]*"[^>]*d="M([\d.-]+) ([\d.-]+)L/g)].map(m => [+m[1]!, +m[2]!]);
    const end = ends.reduce((b, e) => (d2(e, at) < d2(b, at) ? e : b));
    const torso = poly('torso'), edge = Math.min(...torso.map((a, i) => segDist(end, a, torso[(i + 1) % torso.length]!)));
    const inside = shapes.filter((s: any) => s.key !== 'torso' && s.poly && inPoly(s.poly, end)).map((s: any) => s.key);
    return { x0, x1, len: x1 - x0, kneeUnder: Math.abs(knee[0]! - hip[0]!), kneeOn: knee[0]! >= x0 && knee[0]! <= x1, shankGap: Math.abs(Math.max(...shank.map(q => q[1]!)) - top),
      ankleOn: ankle[0]! >= x0, sink, toePast: x0 - toe[0]!, leaderAt: d2(end, at), edge, inside, issues: n.report.issues };
  };
  const fixProblems = (x: any) => [
    ...(Math.abs(x.x0 - 65.5) <= 2 ? [] : [`pad back end at x ${x.x0.toFixed(1)}, not about 65.5 (tile 163)`]),
    ...(Math.abs(x.x1 - 238.8) <= 0.5 ? [] : [`pad front end moved to x ${x.x1.toFixed(1)} (238.8, under the hand)`]),
    ...(x.len >= 170 ? [] : [`pad ${x.len.toFixed(1)} px (< 170, house ~172.5)`]),
    ...(x.kneeUnder <= 1 && x.kneeOn ? [] : [`knee ${x.kneeUnder.toFixed(2)} px off under the hip, on the pad ${x.kneeOn}`]),
    ...(x.shankGap <= 1 && x.ankleOn ? [] : [`shin ${x.shankGap.toFixed(2)} px off the pad top, ankle on the pad ${x.ankleOn}`]),
    ...(x.sink <= 0 ? [] : [`foot ${x.sink.toFixed(1)} px into the pad`]),
    ...(x.toePast >= 0 && x.toePast <= 12 ? [] : [`toe ${x.toePast.toFixed(1)} px past the pad end (0-12: the foot at the bench end)`]),
    ...(x.leaderAt <= 0.5 && x.edge <= 0.5 && x.inside.length === 0 ? [] : [`FLAT BACK leader end ${x.edge.toFixed(2)} px from the back outline, inside ${x.inside.join(',') || 'nothing'}`]),
    ...x.issues.map((i: any) => `engine issue ${JSON.stringify(i)}`),
  ];
  it('R2: pad back end at about 65.5 px (tile 163), front end kept, >= 170 px; knee on the pad under the hip (1 px), shin on the pad, foot at the end not into the pad', () => {
    const x = fix(S);
    console.log(`PF6d oadr fix: pad ${x.x0.toFixed(1)}-${x.x1.toFixed(1)} (${x.len.toFixed(1)} px), knee ${x.kneeUnder.toFixed(2)} px, shin ${x.shankGap.toFixed(2)} px, foot sink ${x.sink.toFixed(2)}, toe past ${x.toePast.toFixed(1)}; FLAT BACK end ${x.edge.toFixed(2)} px from the back outline, inside [${x.inside}]`);
    expect(fixProblems(x).filter(p => !/FLAT BACK/.test(p))).toEqual([]);
  });
  it('R4: the FLAT BACK leader ends on the drawn back outline (0.5 px), outside every other shape', () => {
    expect(fixProblems(fix(S)).filter(p => /FLAT BACK/.test(p))).toEqual([]);
  });
  it('mutations: the old pad (back end 0.25 m behind the knee) and the back anchor on backUpper are red', () => {
    const b = S.equipment.find((e: any) => e.type === 'bench'), z1 = b.at[2] + b.len / 2, z0 = -0.25;
    const pad = { ...S, equipment: S.equipment.map((e: any) => (e === b ? { ...e, at: [b.at[0], b.at[1], (z0 + z1) / 2], len: z1 - z0 } : e)) };
    expect(fixProblems(fix(pad)).some(p => /pad back end/.test(p))).toBe(true);
    const back = { ...S, callouts: S.callouts.map((c: any) => (c.key === 'back' ? { ...c, anchor: 'backUpper' } : c)) };
    expect(fixProblems(fix(back)).some(p => /FLAT BACK/.test(p))).toBe(true);
  });
});

// LIB-PLATEFIX-6d oadr fix round, S1 Top twist (the R4 fault in the close-up): the Right callout "Torso square" sat on
// backUpper, under the raised working arm (dot inside upper.r). Now on the visible back line, as the plate's FLAT BACK.
// Red on a4b28c5c: dot inside upper.r, 0.01 px from the torso outline. After: inside nothing, 0.09 px from it.
describe('PF6d oadr-top Right callout on the visible back line', { timeout: T }, () => {
  const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
    if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segDist = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
    return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
  const dotOf = async (z: any) => {
    const h = howtoMod.default, sp = h.plate, cam0 = plate.renderPlate(sp, { id: 'b' }).report.camera, P = (w: V): V => [cam0.x0 + w[2]! * cam0.pxPerM, cam0.y0 - w[1]! * cam0.pxPerM];
    const R = common.mergeDeep(sp.poses[z.right.base], z.right.pose), b = { height: 1.75 };
    const shapes = vb.bodyShapes(vb.fk(vb.resolve(vb.normPose(R, b), b).q, b), { view: 'side', facing: 'right', near: 'r', P, pxm: cam0.pxPerM }, { hand: sp.hand });
    const specFile = new URL(lib('specs/one_arm_dumbbell_row.mjs')).pathname, engine = await cu.engineOf(specFile);
    const Rh = cu.closeupApi({ ...howtoMod, default: { ...h, zooms: [z] } }, PAGES.CLOSEUP_OPTIONS.one_arm_dumbbell_row, { engine, specFile }).postureZoom(z).split('<div class="plate z-wrap">')[1]!;
    const [vx, vy, sz] = (/viewBox="([^"]*)" class="z-plate"/.exec(Rh)![1]!.match(/-?[\d.]+/g) ?? []).map(Number), k = 171 / sz!;
    const m = /<circle class="z-anchor ok" cx="([-\d.]+)" cy="([-\d.]+)"/.exec(Rh)!, dot: V = [+m[1]! / k + vx!, +m[2]! / k + vy!];
    const torso = shapes.find((s: any) => s.key === 'torso').poly as V[];
    return { inside: shapes.filter((s: any) => s.key !== 'torso' && s.poly && inPoly(s.poly, dot)).map((s: any) => s.key),
      edge: Math.min(...torso.map((a, i) => segDist(dot, a, torso[(i + 1) % torso.length]!))) };
  };
  const zoom = () => howtoMod.default.zooms.find((z: any) => z.key === 'oadr-top');
  it('the Right dot lies within 1 px of the back outline and inside no other shape; the Wrong callout is unchanged', async () => {
    const x = await dotOf(zoom());
    console.log(`PF6d oadr-top Right dot: ${x.edge.toFixed(2)} px from the back outline, inside [${x.inside}]`);
    expect([x.edge <= 1, x.inside]).toEqual([true, []]);
    expect(zoom().callout.wrong).toEqual({ text: 'Torso twists', anchor: { at: 'shoulder.r', pose: 'mistake' } });
  });
  it('mutation: the Right callout back on backUpper is red (inside the working arm)', async () => {
    const z = zoom(), x = await dotOf({ ...z, callout: { ...z.callout, right: { ...z.callout.right, anchor: 'backUpper' } } });
    expect(x.inside.length).toBeGreaterThan(0);
  });
});
