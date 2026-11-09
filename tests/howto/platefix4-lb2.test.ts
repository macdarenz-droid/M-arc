// LIB-PLATEFIX-4 item 19 (PF3 item 19, #391 6653791551; PF3 PLAN #405 6682819340: "The hips-lifted close-up needs a
// multi-joint close-up pose [G] ...: hips off the bench >= 8 px, everything else as the Right"; W4 panel L7 [3,3,3],
// #391 6653540190, critics' fix: a 'Hips' chip, Right buttocks on the bench, Wrong hips lifted, low back over-arched,
// with 'Show me' from the Hips lifting mistake). barbell_bench_press's sheet draws the card zoom `hips-on-bench` (c10).
// Red on main de91dd21: the sheet has no zoom (`zooms = []`, the zoom was a text checkpoint).
// Every other card of the lb02 layers page and the page outside the cards stay byte-equal to main de91dd21's.
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let H: any, eng: any, plate: any, spec: any, crop: any;
beforeAll(async () => {
  [H, eng, plate, crop] = await Promise.all(['howto/lib_barbell_bench_press.howto.mjs', 'engine.mjs', '../vendor/engine/plate.mjs', 'render/closeup/crop.mjs']
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
      'incline-dumbbell-press': '6b0aaad5f2fcc0750b5e1ec36ad5eef44bcf71c4c8289b24d891ec0199a03539',
      'close-grip-bench-press': '1cd3bcd5a6a8df110adcd0858b8d3c894ecdaeab1bdae4ab3cb49844e86fb9f7',
      'decline-bench-press': 'f238d19a2d61924550fc80bec2676e3a80b8c066444c2b6e46f791ffdb058ab3',
      'dumbbell-pullover': '94ba216267e5c7fc216546956484e0e2d997b273dd4a10a1812b50ef2650821e',
      OUTSIDE: '752d57aa05dd08fa82104eac3ad081ab7850628f973f3cb0d6cb7b4932e7ba25',
    });
    expect(html).toContain('id="barbell-bench-press-zoom-hips-on-bench"');
  }, 600_000);
});
