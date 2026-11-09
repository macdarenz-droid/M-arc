// LIB-PLATEFIX-4 (card verify/lib-platefix-4-card.md, group 4), lb5 ids. Each block measures what the engine draws at the
// render camera (plate px, the 358 px plate) and is red on main's spec (de91dd21). The pf8 critics measured on tiles at
// about 2x the plate (their zoom circle r 103-104 is the engine's ZOOM.r 52; their ring r ~70 is main-era k 1.5's
// 34.7 px), so their px numbers are halved here.
import { beforeAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const vendor = (f: string) => new URL(`../../tools/plates/vendor/engine/${f}`, import.meta.url).href;
const T = 300_000;

let plate: any, body: any, eq: any, qa: any, Z: any, golden: any, rebuild: any;
const S: Record<string, any> = {};
beforeAll(async () => {
  [plate, body, eq, qa, Z, golden, rebuild] = await Promise.all([vendor('plate.mjs'), vendor('body.mjs'), vendor('equipment.mjs'), lib('qa/engine.mjs'), lib('zoom/inline.mjs'),
    new URL('../../tools/plates/golden.mjs', import.meta.url).href, new URL('../../scripts/howto-rebuild.mjs', import.meta.url).href].map(f => import(/* @vite-ignore */ f)));
  for (const id of ['cable_curl', 'concentration_curl']) S[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, T);

type V = number[];
const E = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const render = (spec: any, mistake = false) => plate.renderPlate(spec, { id: 't', mistake });
const camOf = (spec: any) => qa.cameraOf(spec, render(spec).report);
const dist = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const itemsIn = (spec: any, pose: string) => {
  const L = qa.poseLandmarks(E(), spec), lm = L.lm[pose], ctx = { pose, start: L.lm.start, mistake: pose === 'mistake', body: L.body };
  return spec.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)).filter(Boolean);
};

// Fix round (pf12 panel, #410 6751563503; cable_curl R5 [4,3,3], R11 [3,3,3]). The critics' tiles are 704 px for the
// 358 px plate (1.97 tile px per plate px: their 16 px elbow gap is the base's 8.38 plate px, and their elbow ~(318,532)
// is the two elbows' midpoint, plate (142.7,183.1) on the base). R5: the Right bottom bend is 30 deg (was 20; c13
// "slightly bent"), so the red straight arm's elbow sits >= 12 plate px (~24 tile px) from the solid elbow. R11: the
// ring on that midpoint (<= 3 px), r 21-25 plate px (~45 tile px, mid upper arm to mid forearm), k 2.1-2.5 (~2.3x).
describe('PF4 cable_curl fix round: elbows apart, ring on the elbow at ~2.3x (pf12 R5 [4,3,3], R11 [3,3,3]; #410 6751563503)', { timeout: T }, () => {
  /** The critics' named elbow point in plate px: the base (d8cd3ac7 poses, 20 deg) end/Mistake elbow midpoint. */
  const CRIT: V = [142.7, 183.1];
  /** The zoom's source ring and circle, both elbows and their gap, at the render camera. */
  const ring = (spec: any) => {
    const z = Z.zoomOf(spec), cam = camOf(spec), L = qa.poseLandmarks(E(), spec).lm;
    const el = cam.P(L.end['elbow.r']), elM = cam.P(L.mistake['elbow.r']), mid = [(el[0]! + elM[0]!) / 2, (el[1]! + elM[1]!) / 2];
    return { z, el, elM, sep: dist(el, elM), offMid: dist(z.src.c, mid), offCrit: dist(z.src.c, CRIT), inE: dist(z.src.c, el) <= z.src.r, inM: dist(z.src.c, elM) <= z.src.r };
  };
  /** The spec with the Right bottom elbow at `deg` (the Mistake re-solved as the spec does: its bar at the end bar's z). */
  const withBottom = async (deg: number) => {
    const [{ readFileSync, writeFileSync, mkdtempSync, rmSync }, { tmpdir }, { join }, { pathToFileURL }] = await Promise.all([import('node:fs'), import('node:os'), import('node:path'), import('node:url')]);
    const txt = readFileSync(new URL('../../tools/plates/library/specs/cable_curl.mjs', import.meta.url), 'utf8');
    const out = txt.replace(/ELBOW_BOTTOM = \d+;/, `ELBOW_BOTTOM = ${deg};`).replace("from '../engine.mjs'", `from '${lib('engine.mjs')}'`);
    expect(out).toContain(`ELBOW_BOTTOM = ${deg};`);
    expect(out).not.toContain("'../engine.mjs'");
    const dir = mkdtempSync(join(tmpdir(), 'pf4cc-')), f = join(dir, `cable_curl_${deg}.mjs`);
    writeFileSync(f, out);
    try { return (await import(/* @vite-ignore */ pathToFileURL(f).href)).default; } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  let m: any;
  beforeAll(() => {
    m = ring(S.cable_curl.default);
    console.log(`PF4 cable_curl fix: k ${m.z.k}; ring c ${m.z.src.c.map((v: number) => v.toFixed(1))} r ${m.z.src.r.toFixed(2)} (off mid ${m.offMid.toFixed(2)}, off critics' ${m.offCrit.toFixed(2)}); circle c ${m.z.circle.c} r ${m.z.circle.r}; elbow ${m.el.map((v: number) => v.toFixed(1))}, Mistake elbow ${m.elM.map((v: number) => v.toFixed(1))}, gap ${m.sep.toFixed(2)}`);
  }, T);
  it('R5: the red straight elbow is >= 12 plate px (~24 tile px) from the solid elbow (base: 8.38, the critics\' ~16 tile px)', () => {
    expect(m.sep).toBeGreaterThanOrEqual(12);
  });
  it('R5: the Right bottom stays slightly bent (c13): 30 deg, interior 150; the Wrong fully straight (0), its bar at the end bar\'s z (<= 0.5 px)', () => {
    const s = S.cable_curl.default, cam = camOf(s), L = qa.poseLandmarks(E(), s);
    expect(L.q.end.elbow.r).toBeCloseTo(30, 6);
    expect(L.q.mistake.elbow.r).toBe(0);
    expect(Math.abs(cam.P(L.lm.end['grip.r'])[0]! - cam.P(L.lm.mistake['grip.r'])[0]!)).toBeLessThanOrEqual(0.5);
  });
  it('R11: the ring centre is within 3 px of the elbows\' midpoint and of the critics\' named point', () => {
    expect(m.offMid).toBeLessThanOrEqual(3);
    expect(m.offCrit).toBeLessThanOrEqual(3);
  });
  it('R11: the ring radius is 21-25 px (~45 tile px), k 2.1-2.5, the circle kept at r 52; both elbows inside the ring', () => {
    expect(m.z.src.r).toBeGreaterThanOrEqual(21);
    expect(m.z.src.r).toBeLessThanOrEqual(25);
    expect(m.z.k).toBeGreaterThanOrEqual(2.1);
    expect(m.z.k).toBeLessThanOrEqual(2.5);
    expect(m.z.circle.r).toBe(52);
    expect(m.inE).toBe(true);
    expect(m.inM).toBe(true);
  });
  it('mutations: the base 20 deg bottom is too close; k 3.5 (base) and k 2 miss the radius and k bands; a ring on the grips misses the centre', async () => {
    const s = S.cable_curl.default;
    expect(ring(await withBottom(20)).sep).toBeLessThan(12);
    const v35 = ring({ ...s, zoom: { ...s.zoom, k: 3.5 } }), v2 = ring({ ...s, zoom: { ...s.zoom, k: 2 } });
    expect(v35.z.src.r).toBeLessThan(21);
    expect(v35.z.k).toBeGreaterThan(2.5);
    expect(v2.z.src.r).toBeGreaterThan(25);
    expect(v2.z.k).toBeLessThan(2.1);
    const L = qa.poseLandmarks(E(), s).lm, g = ring({ ...s, zoom: { ...s.zoom, pair: [L.end['grip.r'], L.mistake['grip.r']] } });
    expect(g.offMid).toBeGreaterThan(3);
    expect(g.offCrit).toBeGreaterThan(3);
    expect(g.inE).toBe(false);
  });
  it('mutation: a 45 deg bottom moves the ring centre past 3 px of the critics\' point', async () => {
    expect(ring(await withBottom(45)).offCrit).toBeGreaterThan(3);
  });
  it('PF3 overlay kept: 4 dashed arm outlines and a straight dashed guide through shoulder, elbow and grip (<= 5 mm); the tell on the elbow; no cable twin', () => {
    const s = S.cable_curl.default, L = qa.poseLandmarks(E(), s).lm.mistake, g = s.mistake.guides.filter((x: any) => x.kind === 'dashed');
    expect(g.length).toBe(5);
    const line = g.at(-1).pts, u = [0, 1, 2].map(i => L['grip.r'][i] - L['shoulder.r'][i]);
    for (const k of ['shoulder.r', 'elbow.r', 'grip.r']) {
      const w = [0, 1, 2].map(i => L[k][i] - line[0][i]), c = [w[1]! * u[2]! - w[2]! * u[1]!, w[2]! * u[0]! - w[0]! * u[2]!, w[0]! * u[1]! - w[1]! * u[0]!];
      expect(Math.hypot(...c) / Math.hypot(...u), k).toBeLessThanOrEqual(0.005);
    }
    expect(s.mistake.tells[0].anchor).toEqual({ at: 'elbow.r', pose: 'mistake' });
    expect(itemsIn(s, 'mistake').some((it: any) => it.type === 'poly' && it.cls === 'eq')).toBe(false);
  });
});

describe('PF4 lb05 plates page: every other plate is byte-equal to main\'s (de91dd21, page 7a2d5311)', { timeout: T }, () => {
  // sha256 of JSON.stringify(golden.fragmentsOf(plate)) per plate on main's lb05 plates page (this card's ids left out).
  const BASE: Record<string, string> = {
    'preacher-curl': '5d1ae9b54ff05425565e9790b2421c070252de43ffa5745f57942aabafd9e77f',
    'bayesian-cable-curl': '31a391ea59632a9f9c12367948e73285e71560eeb76ffa9d467c0ab85b6e5d5c',
    'concentration-curl': 'eda06ea4496050cf6b2ac2e450e8583c4633e61da5b54b680578ae0e76641fca',
    'dumbbell-overhead-triceps-extension': 'c90c7dd9ac1ad2ee3d6cb9d6e1d61d4690323c1ad6330911cbe36d7015427707',
    'cross-body-hammer-curl': '27fb9f40ddb6f6f15b85f9e001eeb9eeeaad148192bd056c3f102f2591d192ea',
    'wrist-curl': 'a7b7d2a879f9aafc298762e3fb2c500cac21b0950e2d964bfadd6fbb9a8a9f05',
    'hammer-curl': 'e71fc1ccbf837abbad8892e59f1db1a35bc389f7235a1026ce658aaf18fe6c39',
    'alternating-dumbbell-curl': '7bd06dbb017b8ee364bad7824fd0a59a17f927b655ea50e365baaedd0c810dd9',
    'single-arm-triceps-pushdown': 'b0f7bd7ab21be5f2b651104006056c9b4c7cc89c7e580fed67098bc1c2376323',
    'incline-dumbbell-curl': '868f4c652e7ecf9c56441307471ad8b8e6f7c57cbbd8646f5a79bd2190a859af',
    'barbell-curl': 'ff95d0403a81e902cb5f413d9138a35aef8de7e3a64fd67260ac589702a02129',
    'ez-bar-curl': '854ed905f13e9216de90b4d5efee041f5ee1438d25721610de51528b5fc3d083',
    'reverse-curl': '1b9f2d838197a3ceb7e4b6ed8400fd264ddbd234b6ff28d18557b0fcd115d548',
  };
  // straight-bar-triceps-pushdown is PF4's own too (the PUSHDOWN re-clone, D-PF2-PUSHDOWN-T; its change is proven in
  // platefix4-pushdown.test.ts); main's value was d7e1b1afe3b26b65ad08f3e59cb932a4ec8860aa615008417c1eeae4b72f0a5f.
  const OWN = ['cable-curl', 'straight-bar-triceps-pushdown'];
  const shaOf = (p: any) => createHash('sha256').update(JSON.stringify(golden.fragmentsOf(p))).digest('hex');
  const problems = (html: string) => {
    const ps = golden.extractPlates(html), got = new Map(ps.map((p: any) => [p.chromeId, shaOf(p)]));
    const extra = ps.map((p: any) => p.chromeId).filter((c: string) => !(c in BASE) && !OWN.includes(c)).map((c: string) => `${c} not pinned`);
    return [...extra, ...Object.entries(BASE).filter(([c, h]) => got.get(c) !== h).map(([c]) => `${c} changed`)];
  };
  let html = '';
  beforeAll(async () => { html = Buffer.from(await rebuild.buildPage('tests/howto/golden/library/lb05.json', 'page')).toString('utf8'); }, T);
  it('every plate but this card\'s own is byte-equal to main\'s', () => {
    expect(problems(html)).toEqual([]);
  });
  it('mutation: one byte changed in another plate\'s Mistake svg is red', () => {
    const i = html.indexOf('id="wrist-curl-plate"'), j = html.indexOf('<path', i);
    expect(problems(html.slice(0, j) + '<path ' + html.slice(j + 5))).toEqual(['wrist-curl changed']);
  });
});
