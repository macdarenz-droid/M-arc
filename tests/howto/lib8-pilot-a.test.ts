// LIB-8-FIX (review 6243689943, findings 1, 3-5 and gap 3): pilot A's tracked files, checked solvers, page-builder
// refusals and the OHP Mistake arm. The last two are ports of the node tests test/build-page.test.mjs (test 3; tests 1
// and 2 are library-core.test.ts L2-A2) and test/ohp-mistake.test.mjs.
// Run: npx vitest run tests/howto/lib8-pilot-a.test.ts   (OHP_SPEC=<spec copy> points the OHP tests at another spec)
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const LIB = new URL('../../tools/plates/library/', import.meta.url);
const imp = (p: string) => import(/* @vite-ignore */ new URL(p, LIB).href);

describe('LIB-8-FIX pilot A out/ (finding 1)', () => {
  it('tracks no file under pilot-a/out/', () => {
    expect(execFileSync('git', ['ls-files', '--', 'tools/plates/library/pilot-a/out'], { cwd: ROOT, encoding: 'utf8' })).toBe('');
  });
  it('ignores the page and a shot, on disk or not', () => {
    for (const p of ['tools/plates/library/pilot-a/out/pilot-a-plates.html', 'tools/plates/library/pilot-a/out/shots/x.png'])
      expect(spawnSync('git', ['check-ignore', '-q', p], { cwd: ROOT }).status).toBe(0);
  });
});

describe('LIB-8-FIX checked solvers (finding 3)', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bench: any, incline: any;
  beforeAll(async () => { [bench, incline] = await Promise.all([imp('specs/dumbbell_bench_press.mjs'), imp('specs/incline_dumbbell_press.mjs')]); });

  it('supine() throws when its trunk bracket holds no rising root', () => {
    expect(() => bench.supine(0.43, 0, { lift: 0.3 })).toThrow(/no solution in \[-40, 30\]/);
    expect(() => bench.supine(0.43, 0, { tilt: -60 })).toThrow(/no solution in \[-40, 30\]/);
  });
  it('supine() refuses a falling bracket that a same-sign check lets through', () => {
    expect(() => bench.supine(0.43, 0, { tilt: 90 })).toThrow(/no solution in \[-40, 30\]/);   // f(-40) = +0.119 > 0 > f(30) = -0.135
  });
  it('reclined() throws when its tilt bracket holds no root', () => {
    expect(() => incline.reclined({ back: 120, seatTop: 0.45 })).toThrow(/no solution in \[-100, 20\]/);
  });
  it('the specs\' own calls return the e6f39ff values', () => {
    expect(bench.supine(0.43, 0)).toEqual({ root: { at: [0, 0.5700000000000001, 0], tilt: -90 }, trunk: -3.555319157136963, neck: -1.926674441185313 });
    expect(incline.reclined({ back: 45, seatTilt: 12, seatTop: 0.45, trunk: 0 }).pose).toEqual(
      { root: { at: [0, 0.5440524517166693, -0.03673144192764042], tilt: -47.00955381302114 }, trunk: 0, neck: -5.212605903003716 });
  });
  it('every spec pilot-a/plates.json names still imports', async () => {
    const pj = JSON.parse(readFileSync(new URL('pilot-a/plates.json', LIB), 'utf8')) as { plates: { id: string; extras?: { spec?: string }[] }[] };
    const ids = pj.plates.flatMap(p => [p.id, ...(p.extras ?? []).flatMap(x => (x.spec ? [x.spec] : []))]);
    expect(ids).toHaveLength(21);
    for (const id of ids) expect((await imp(`specs/${id}.mjs`)).default).toBeTruthy();
  });
});

describe('LIB-8 page builder refusals (build-page.test.mjs test 3)', () => {
  it('a vendored builder of another shape is refused, never half-patched', async () => {
    const { patchedBuilder } = await imp('build-page.mjs');
    const src = readFileSync(new URL('../vendor/artifact/build-page.mjs', LIB), 'utf8');
    expect(() => patchedBuilder(src.replace('const GROUPS = [', 'const GROUPS2 = ['))).toThrow(/"const GROUPS = \[" must occur exactly once/);
    expect(() => patchedBuilder(src.replace('<h1>Option 2 · Technical Plate</h1>', '<h1>X</h1>'))).toThrow(/"<h1>Option 2 · Technical Plate<\/h1>" must occur exactly once/);
  });
});

describe('LIB-8 OHP Mistake arm on the drawn shoulder (ohp-mistake.test.mjs)', () => {
  const SPEC = process.env.OHP_SPEC ? pathToFileURL(process.env.OHP_SPEC).href : new URL('specs/barbell_overhead_press.mjs', LIB).href;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mod: any, lmEnd: any, lmMis: any;
  beforeAll(async () => {
    const { landmarksOf } = await imp('engine.mjs');
    mod = await import(/* @vite-ignore */ SPEC);
    const spec = mod.default;
    lmEnd = landmarksOf(spec.poses.end, mod.H);
    lmMis = landmarksOf({ ...spec.poses.end, ...spec.mistake.pose }, mod.H);
  });

  it('the Mistake arm starts on the drawn shoulder joint (within 5 mm)', () => {
    const d = Math.hypot(...lmMis['shoulder.r'].map((v: number, i: number) => v - lmEnd['shoulder.r'][i]));
    expect(d, `faulty shoulder is ${(d * 100).toFixed(1)} cm off the drawn shoulder joint`).toBeLessThanOrEqual(0.005);
  });

  it('the elbow is below and behind the bar; the forearm lies in front of the chest, above the safety arms', () => {
    const el = lmMis['elbow.r'], gr = lmMis['grip.r'];
    expect(el[1] < gr[1] && el[2] < gr[2], 'elbow below and behind the bar').toBe(true);
    expect(el[2], `elbow ${el[2].toFixed(3)} m not clear in front of the chest ${lmEnd.chest[2].toFixed(3)} m`).toBeGreaterThan(lmEnd.chest[2] + 0.06);
    expect(el[1] - 0.05, `elbow ${el[1].toFixed(3)} m too close to the safety arms ${mod.ARM_Y.toFixed(3)} m`).toBeGreaterThan(mod.ARM_Y);
    const tilt = Math.atan2(gr[2] - el[2], gr[1] - el[1]) * 180 / Math.PI;
    expect(tilt >= 25 && tilt <= 35, `forearm tilt ${tilt.toFixed(1)} deg`).toBe(true);
  });
});
