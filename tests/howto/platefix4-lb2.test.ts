// LIB-PLATEFIX-4 item 19 (PF3 item 19, #391 6653791551; PF3 PLAN #405 6682819340: "The hips-lifted close-up needs a
// multi-joint close-up pose [G] ...: hips off the bench >= 8 px, everything else as the Right"; W4 panel L7 [3,3,3],
// #391 6653540190, critics' fix: a 'Hips' chip, Right buttocks on the bench, Wrong hips lifted, low back over-arched,
// with 'Show me' from the Hips lifting mistake). barbell_bench_press's sheet draws the card zoom `hips-on-bench` (c10).
// Red on main de91dd21: the sheet has no zoom (`zooms = []`, the zoom was a text checkpoint).
// LIB-PLATEFIX-4 item 21 (PF3 item 21, #391 6653791551; #405 6682819340; W4 panel L7 [4,3,3], #391 6653540190, critics c2,
// c3: "Feet: both feet locked under the pads vs loose"): decline_bench_press's sheet draws the card zoom `feet-hooked` (c1).
// Red on main de91dd21: no zoom. The rollers are the plate's (unchanged); the Wrong shin and foot clear them by >= 8 px.
// Every other card of the lb02 layers page and the page outside the cards stay byte-equal to main de91dd21's.
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let H: any, eng: any, plate: any, spec: any, crop: any, D: any, DS: any;
beforeAll(async () => {
  [H, eng, plate, crop, D, DS] = await Promise.all(['howto/lib_barbell_bench_press.howto.mjs', 'engine.mjs', '../vendor/engine/plate.mjs', 'render/closeup/crop.mjs',
    'howto/lib_decline_bench_press.howto.mjs', 'specs/decline_bench_press.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  spec = H.default.plate;
}, 600_000);

const HT = 1.75, TOP = 0.43;   // the spec's body height and BENCH_TOP
const zoomOf = () => H.default.zooms.find((z: any) => z.key === 'hips-on-bench');
const poseOf = (wrong: any) => ({ ...spec.poses.end, ...wrong });
/** The Wrong pose's measures against the Right (end) pose; lift in crop px at the plate's camera and the zoom's crop. */
const measure = (wrong: any) => {
  const z = zoomOf(), R = eng.landmarksOf(spec.poses.end, HT), W = eng.landmarksOf(poseOf(wrong), HT);
  const pxPerM = plate.renderPlate(spec, { id: 'pf4' }).report.camera.pxPerM, k = crop.PANEL / z.crop.sizePx;
  const d = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!) * 100;
  return {
    liftPx: (W.buttock[1] - TOP) * pxPerM * k,
    backUpperCm: Math.abs(W.backUpper[1] - TOP) * 100,
    soleCm: Math.max(Math.abs(W['sole.r'][1]) , Math.abs(W['sole.l'][1])) * 100,
    gripCm: Math.max(d(W['grip.r'], R['grip.r']), d(W['grip.l'], R['grip.l'])),
    footCm: Math.max(d(W['ankle.r'], R['ankle.r']), d(W['ankle.l'], R['ankle.l'])),
  };
};

describe('PF4 item 19: barbell_bench_press draws the hips-on-bench close-up', () => {
  it('the sheet has the posture zoom hips-on-bench (card c10 words), its chip first, and Show me links from the hips mistake and checkpoint', () => {
    const h = H.default, z = zoomOf();
    expect(z).toBeTruthy();
    expect(z.kind).toBe('posture');
    expect(z.right).toBe('end');
    expect(z.wrong.base).toBe('end');
    expect(z.wrong.solid).toBe(true);
    expect([z.chip, z.heading]).toEqual(['Hips', 'Hips on bench']);
    expect(z.caption).toEqual({ right: 'Buttocks on the bench, feet pressing the floor.', wrong: 'Hips lifted off the bench, low back over-arched.' });
    expect(h.chips).toEqual(['hips-on-bench', 'feel']);
    expect(h.mistakes.find((m: any) => m.key === 'hips').zoom).toBe('hips-on-bench');
    expect(h.posture.find((p: any) => p.key === 'hips').zoom).toBe('hips-on-bench');
    expect(z.guides.filter((g: any) => g.kind === 'drop')).toHaveLength(1);
  });
  it('the Wrong lifts the hips >= 8 px off the bench in the crop; upper back on the pad, soles on the floor, grips and ankles as the Right', () => {
    const m = measure(zoomOf().wrong.pose);
    console.log(`PF4 19: lift ${m.liftPx.toFixed(2)} px; backUpper ${m.backUpperCm.toFixed(2)} cm; sole ${m.soleCm.toFixed(2)} cm; grip ${m.gripCm.toFixed(2)} cm; ankle ${m.footCm.toFixed(2)} cm`);
    expect(m.liftPx).toBeGreaterThanOrEqual(8);
    expect(m.backUpperCm).toBeLessThanOrEqual(1);
    expect(m.soleCm).toBeLessThanOrEqual(0.5);
    expect(m.gripCm).toBeLessThanOrEqual(0.5);
    expect(m.footCm).toBeLessThanOrEqual(0.5);
  });
  it('multi-joint: root height, trunk and neck all change (the upper back and skull stay down while the pelvis rises)', () => {
    const w = zoomOf().wrong.pose, e = spec.poses.end;
    expect(w.root.at[1] - e.root.at[1]).toBeGreaterThan(0.03);
    expect(Math.abs(w.trunk - e.trunk)).toBeGreaterThan(5);
    expect(Math.abs(w.neck - e.neck)).toBeGreaterThan(5);
  });
  it('mutations: no lift (the Right\'s own root, trunk and neck) is under 8 px; a root-only lift takes the upper back off the pad', () => {
    const e = spec.poses.end, w = zoomOf().wrong.pose;
    expect(measure({ root: e.root, trunk: e.trunk, neck: e.neck }).liftPx).toBeLessThan(8);
    expect(measure({ root: w.root, trunk: e.trunk, neck: e.neck }).backUpperCm).toBeGreaterThan(1);
  });
  it('lb02 layers page: only barbell_bench_press\'s card changes; every other card and the page outside the cards = main de91dd21\'s bytes', async () => {
    const { layersSpecOf } = await import(/* @vite-ignore */ lib('layers-spec.mjs'));
    const { buildLayersPage } = await import(/* @vite-ignore */ lib('build-layers-page.mjs'));
    const stageDir = mkdtempSync(join(tmpdir(), 'pf4-lb02-'));
    let html: string;
    try { html = (await buildLayersPage(layersSpecOf('tools/plates/library/batches/lb02.json', { stageDir }))).toString('utf8'); } finally { rmSync(stageDir, { recursive: true, force: true }); }
    const sha = (s: string) => createHash('sha256').update(s).digest('hex');
    const got: Record<string, string> = {};
    let rest = html;
    for (const m of html.matchAll(/<article class="sheet-card" id="card-([^"]+)"/g)) {
      const t = /<article\b|<\/article>/g; t.lastIndex = m.index!; let d = 0, end = -1;
      for (let k; (k = t.exec(html));) { d += k[0] === '</article>' ? -1 : 1; if (!d) { end = k.index + 10; break; } }
      const a = html.slice(m.index, end); rest = rest.replace(a, ''); got[m[1]!] = sha(a);
    }
    got.OUTSIDE = sha(rest);
    expect(got).toEqual({
      'barbell-bench-press': expect.not.stringMatching(/^0fb194c367499b05037fd1bdedb48f4040c7b328299664dc623ad83faea3fbe7$/),
      'incline-barbell-bench-press': '07e934a7cb638cf91e9e2804367e227a459a893c13fcb760190dd925c3f19275',
      'incline-dumbbell-press': expect.not.stringMatching(/^6b0aaad5f2fcc0750b5e1ec36ad5eef44bcf71c4c8289b24d891ec0199a03539$/),
      'close-grip-bench-press': '1cd3bcd5a6a8df110adcd0858b8d3c894ecdaeab1bdae4ab3cb49844e86fb9f7',
      'decline-bench-press': expect.not.stringMatching(/^f238d19a2d61924550fc80bec2676e3a80b8c066444c2b6e46f791ffdb058ab3$/),
      'dumbbell-pullover': '94ba216267e5c7fc216546956484e0e2d997b273dd4a10a1812b50ef2650821e',
      OUTSIDE: '752d57aa05dd08fa82104eac3ad081ab7850628f973f3cb0d6cb7b4932e7ba25',
    });
    expect(html).toContain('id="barbell-bench-press-zoom-hips-on-bench"');
    expect(html).toContain('id="decline-bench-press-zoom-feet-hooked"');
  }, 600_000);
});

describe('PF4 item 21: decline_bench_press draws the feet-hooked close-up', () => {
  const dz = () => D.default.zooms.find((z: any) => z.key === 'feet-hooked');
  /** Clearance (crop px) from the plate's foot-roller surface to the shin and foot (knee-ankle and ankle-toe segments, less
   *  the engine's shin radius at the ankle). <= 0: the roller sits on the front of the ankle (hooked). */
  const gapPx = (wrong: any) => {
    const sp = D.default.plate, L = eng.landmarksOf({ ...sp.poses.end, ...wrong }, 1.75), hub = DS.info().hub;
    const segD = (p: number[], a: number[], b: number[]) => { const u = [b[1]! - a[1]!, b[2]! - a[2]!], l = u[0]! ** 2 + u[1]! ** 2,
      t = Math.max(0, Math.min(1, ((p[1]! - a[1]!) * u[0]! + (p[2]! - a[2]!) * u[1]!) / l)); return Math.hypot(p[1]! - a[1]! - t * u[0]!, p[2]! - a[2]! - t * u[1]!); };
    const ppm = plate.renderPlate(sp, { id: 'pf4d' }).report.camera.pxPerM, k = crop.PANEL / dz().crop.sizePx;
    const d = Math.min(segD(hub, L['knee.r'], L['ankle.r']), segD(hub, L['ankle.r'], L['toe.r']));
    return (d - 0.055 - eng.RADII.shank[2] * 1.75) * ppm * k;
  };
  it('the sheet has the posture zoom feet-hooked (card c1 words), its chip first, and Show me links from the feet checkpoint and the position step', () => {
    const z = dz(), h = D.default;
    expect(z).toBeTruthy();
    expect([z.kind, z.chip, z.heading, z.right, z.wrong.base, z.wrong.solid]).toEqual(['posture', 'Feet', 'Feet hooked', 'end', 'end', true]);
    expect(z.caption).toEqual({ right: 'Both feet locked under the pads.', wrong: 'Feet loose, not locked under the pads.' });
    expect(h.chips).toEqual(['feet-hooked', 'feel']);
    expect(h.posture.find((p: any) => p.key === 'feet').zoom).toBe('feet-hooked');
    expect(h.setup.find((p: any) => p.kind === 'position').zoom).toBe('feet-hooked');
  });
  it('Right: the roller on the front of the ankle (gap <= 0); Wrong: shin and foot clear the roller by >= 8 px, only the knee and ankle change', () => {
    const r = gapPx({}), w = gapPx(dz().wrong.pose);
    console.log(`PF4 21: roller gap Right ${r.toFixed(2)} px, Wrong ${w.toFixed(2)} px`);
    expect(r).toBeLessThanOrEqual(0);
    expect(w).toBeGreaterThanOrEqual(8);
    expect(Object.keys(dz().wrong.pose).sort()).toEqual(['ankle', 'knee']);
  });
  it('mutation: the loose knee alone at the hooked 100 deg (ankle neutral) does not clear the roller', () => {
    expect(gapPx({ knee: 100, ankle: dz().wrong.pose.ankle })).toBeLessThan(8);
  });
});

// LIB-PLATEFIX-4 item 20 (PF3 item 20, #391 6653791551; #405 6682819340; W4 panel L7 [4,3,3], #391 6653540190, critics c2,
// c3: "a bench-angle panel showing a 45-degree pad (Right) vs a near-upright pad (Wrong)"): incline_dumbbell_press's sheet
// draws the card zoom `incline-angle` (c1, c2). Red on main de91dd21: no zoom.
describe('PF4 item 20: incline_dumbbell_press draws the bench-angle close-up', () => {
  let I: any, IS: any, IB: any;
  beforeAll(async () => {
    [I, IS, IB] = await Promise.all(['howto/lib_incline_dumbbell_press.howto.mjs', 'specs/incline_dumbbell_press.mjs', 'eq/inclineBench.mjs']
      .map(f => import(/* @vite-ignore */ lib(f))));
  }, 600_000);
  const iz = () => I.default.zooms.find((z: any) => z.key === 'incline-angle');
  /** Recline of the buttock-backUpper line from vertical (deg), as the spec's reclined() measures it. */
  const recline = (L: any) => Math.atan2(-(L.backUpper[2] - L.buttock[2]), L.backUpper[1] - L.buttock[1]) * 180 / Math.PI;
  it('the sheet has the posture zoom incline-angle (card c2 words), its chip first, and Show me links from setup step 1 and the angle checkpoint', () => {
    const z = iz(), h = I.default;
    expect(z).toBeTruthy();
    expect([z.kind, z.chip, z.heading, z.right, z.wrong.base, z.wrong.solid]).toEqual(['posture', 'Bench', 'Bench angle', 'start', 'start', true]);
    expect(z.caption).toEqual({ right: 'Back pad at about 45 degrees.', wrong: 'Back pad near upright.' });
    expect(h.chips).toEqual(['incline-angle', 'feel']);
    expect(h.setup[0].zoom).toBe('incline-angle');
    expect(h.posture.find((p: any) => p.key === 'angle').zoom).toBe('incline-angle');
  });
  it('Right: back at 45 deg (+-1) on the plate\'s pad; Wrong: back at <= 20 deg from vertical, on the Wrong pad (upper back and occiput within 1 cm), arms as the Right\'s', () => {
    const sp = I.default.plate, LR = eng.landmarksOf(sp.poses.start, 1.75), W = { ...sp.poses.start, ...iz().wrong.pose }, LW = eng.landmarksOf(W, 1.75);
    const rr = recline(LR), rw = recline(LW);
    console.log(`PF4 20: recline Right ${rr.toFixed(2)} deg, Wrong ${rw.toFixed(2)} deg`);
    expect(Math.abs(rr - 45)).toBeLessThanOrEqual(1);
    expect(rw).toBeLessThanOrEqual(20);
    // the Wrong pad: the composer's back face at the Wrong angle, through the reclined() hinge
    const rec = IS.reclined({ back: 15, seatTilt: 12, seatTop: 0.45, trunk: 0 }), f = IB.inclineFaces({ hinge: rec.hinge, back: 15, seatTilt: 12 }).back;
    const off = (p: number[]) => ((p[1]! - f.point[1]) * f.normal[1] + (p[2]! - f.point[2]) * f.normal[2]) * 100;
    expect(Math.abs(off(LW.backUpper))).toBeLessThanOrEqual(1);
    // arms: each grip keeps the Right's offset from its shoulder (<= 0.5 cm)
    for (const s of ['l', 'r']) expect(Math.hypot(...[0, 1, 2].map(i => (LW[`grip.${s}`][i] - LW[`shoulder.${s}`][i]) - (LR[`grip.${s}`][i] - LR[`shoulder.${s}`][i]))) * 100, s).toBeLessThanOrEqual(0.5);
    // the Wrong crop's pad is the composer's at that angle (its back pad bar runs along the face's up direction)
    const n = IB.inclineBench({ hinge: rec.hinge, back: 15, seatTilt: 12, backLen: 0.84, beamZ: [-0.72, 0.36] }).length;
    expect(iz().wrong.equipmentList.slice(1, 1 + n)).toEqual(IB.inclineBench({ hinge: rec.hinge, back: 15, seatTilt: 12, backLen: 0.84, beamZ: [-0.72, 0.36] }));
  });
  it('the Wrong crop draws the upright pad (crop option equipmentList) and none of the 45 deg end-layer phantoms', () => {
    const probe = { points: [], specs: [] as any[] };
    const { CLOSEUP_OPTIONS } = { CLOSEUP_OPTIONS: { crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' } } };
    const cut = crop.engineCrop(I.default, CLOSEUP_OPTIONS.crop, { name: 'vendor', ...eng, renderPlate: plate.renderPlate }, probe);
    cut(iz(), 'right'); cut(iz(), 'wrong');
    const [r, w] = probe.specs;
    expect(w.spec.equipment).toBe(iz().wrong.equipmentList);
    expect(r.spec.equipment).not.toBe(iz().wrong.equipmentList);
    const items = (w.spec.equipment as any[]).flatMap(e => typeof e === 'function' ? [].concat(e(eng.landmarksOf(w.spec.poses.end, 1.75), { pose: 'end', mistake: true }) ?? []) : [e]);
    expect(items.filter((i: any) => i?.part === 'archgap' || String(i?.cls ?? '').includes('m-line'))).toEqual([]);
  });
  it('mutation: an equipmentList left off the Wrong crop falls back to the plate\'s 45 deg pad', () => {
    const probe = { points: [], specs: [] as any[] }, z = { ...iz(), wrong: { ...iz().wrong, equipmentList: undefined } };
    crop.engineCrop(I.default, { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' }, { name: 'vendor', ...eng, renderPlate: plate.renderPlate }, probe)(z, 'wrong');
    expect(probe.specs[0].spec.equipment).not.toBe(iz().wrong.equipmentList);
  });
});
