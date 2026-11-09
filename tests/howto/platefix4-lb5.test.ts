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

describe('PF4 cable_curl: the inline zoom ring on the elbow, ~3.4x (pf8 T10 R11 [3,3,2]; #405 6688665575)', { timeout: T }, () => {
  /** The zoom's source ring and circle, and both elbows, at the render camera. */
  const ring = (spec: any) => {
    const z = Z.zoomOf(spec), cam = camOf(spec), L = qa.poseLandmarks(E(), spec).lm;
    const el = cam.P(L.end['elbow.r']), elM = cam.P(L.mistake['elbow.r']);
    return { z, el, elM, off: dist(z.src.c, el), inE: dist(z.src.c, el) <= z.src.r, inM: dist(z.src.c, elM) <= z.src.r };
  };
  let m: any;
  beforeAll(() => {
    m = ring(S.cable_curl.default);
    console.log(`PF4 cable_curl: k ${m.z.k}; ring c ${m.z.src.c.map((v: number) => v.toFixed(1))} r ${m.z.src.r.toFixed(2)}; circle c ${m.z.circle.c} r ${m.z.circle.r}; elbow ${m.el.map((v: number) => v.toFixed(1))} (off ${m.off.toFixed(2)}), Mistake elbow ${m.elM.map((v: number) => v.toFixed(1))} (off ${dist(m.z.src.c, m.elM).toFixed(2)})`);
  }, T);
  it('the ring is centred within 5 px of the elbow (main: no zoom; PF3 k 1.5 centred at the two elbows\' midpoint too)', () => {
    expect(m.off).toBeLessThanOrEqual(5);
  });
  it('the ring radius is 14-18 px (the critics\' r 28-36 at 2x; PF3: 34.67), magnification >= 3 (PF3: 1.5), the circle kept at r 52 (~103 at 2x)', () => {
    expect(m.z.src.r).toBeGreaterThanOrEqual(14);
    expect(m.z.src.r).toBeLessThanOrEqual(18);
    expect(m.z.k).toBeGreaterThanOrEqual(3);
    expect(m.z.circle.r).toBe(52);
  });
  it('both the solid elbow and the red dashed (Mistake) elbow lie inside the ring', () => {
    expect(m.inE).toBe(true);
    expect(m.inM).toBe(true);
  });
  it('mutations: PF3\'s k 1.5 ring is too big and too weak; k 4 is under the radius band; a ring moved to the grip misses the centre and both elbows', () => {
    const s = S.cable_curl.default, v = ring({ ...s, zoom: { ...s.zoom, k: 1.5 } });
    expect(v.z.src.r).toBeGreaterThan(18);
    expect(v.z.k).toBeLessThan(3);
    expect(ring({ ...s, zoom: { ...s.zoom, k: 4 } }).z.src.r).toBeLessThan(14);
    const L = qa.poseLandmarks(E(), s).lm, g = ring({ ...s, zoom: { ...s.zoom, pair: [L.end['grip.r'], L.mistake['grip.r']] } });
    expect(g.off).toBeGreaterThan(5);
    expect(g.inE).toBe(false);
    expect(g.inM).toBe(false);
  });
  // The drawing the critics scored (PF3 round 2 at d8cd3ac7, held to main's after pf8; c2, c3: "do not change" the poses):
  // its PF3 item 10 checks come back with it (platefix3-lb5.test.ts at d8cd3ac7).
  it('PF3 poses kept: the Right bottom elbow 20 deg; the Wrong fully straight, its bar at the end bar\'s z (<= 0.5 px)', () => {
    const s = S.cable_curl.default, cam = camOf(s), L = qa.poseLandmarks(E(), s);
    expect(L.q.end.elbow.r).toBeCloseTo(20, 6);
    expect(L.q.mistake.elbow.r).toBe(0);
    expect(Math.abs(cam.P(L.lm.end['grip.r'])[0]! - cam.P(L.lm.mistake['grip.r'])[0]!)).toBeLessThanOrEqual(0.5);
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
