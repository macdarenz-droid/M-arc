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
      ...(JSON.stringify(box('back')) === JSON.stringify({ ...box('back'), anchor: 'backUpper', box: { left: 126, top: 118 } }) ? [] : [`back callout ${JSON.stringify(box('back'))}`]),
      ...(JSON.stringify(box('elbow')) === JSON.stringify({ ...box('elbow'), anchor: 'elbow.r', box: { left: 66, top: 160 } }) ? [] : [`elbow callout ${JSON.stringify(box('elbow'))}`]),
      ...(['backUpper', 'elbow.r'].every(k => near(k) <= 0.5) ? [] : [`leaders ${near('backUpper').toFixed(2)} / ${near('elbow.r').toFixed(2)} px from backUpper / elbow.r`]),
      ...n.report.issues.map((i: any) => `engine issue ${JSON.stringify(i)}`),
    ];
  };
  it('back at { 126, 118 } on backUpper, elbow at { 66, 160 } on elbow.r, leaders within 0.5 px, no layout issue', () => {
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
