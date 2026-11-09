// LIB-PLATEFIX-4 dumbbell_fly (fresh round 1, held under D-LIB13-PANEL2 #395 6655186998: "four stacked red outlines and a
// mis-scaled ghost read as a red blob around the dumbbell"; fix "one red hand-plus-hexagon piece at the hand's scale";
// #395 6653868933 "the hand-plus-hexagon piece rotated ... about the wrist ... Remove the extra red circle"; #385
// 6638551153 "The wrist bend still doesn't read"). Measured on what is drawn: the Mistake render's red dashed outlines
// (the masked Mistake outline `.m-pose use` and the `m-line` guides) and the solid end hand, fist and dumbbell at the
// render's camera, per hand region (22 px round the end grip), and in the Mistake zoom.
// Base spec (main de91dd21) on these measures: 6 red dashed outlines per hand region (the fist, the hand poly, the handle
// and two heads of the Mistake pose, and the dashed hand guide) and 6 in the zoom; no rigid turn of the solid hand-plus-
// dumbbell lays them on it (best fit 20.1 deg, residual 0.99 mean / 5.30 max px). Its union was at the solid's scale
// (diameter 1.000, hull area 1.016): the "mis-scaled ghost" of #395 6655186998 was the pitch-0 draft (2967c154), so the
// scale row is guarded by its mutation, not red on the base. After: one piece per hand and one in the zoom, the solid
// outline turned 23.0 deg about the wrist (the Mistake pose's own 30 deg bend, projected at pitch 45), residual 0.06 /
// 0.12 px, diameter and hull area 1.000, the zoom piece at k x the plate piece.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
let plate: any, body: any, equip: any, qe: any, Z: any, golden: any, build: any, S: any;
beforeAll(async () => {
  [plate, body, equip, qe, Z, golden, build] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs',
    'qa/engine.mjs', 'zoom/inline.mjs', '../golden.mjs', 'pilot-a3/build.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = (await import(/* @vite-ignore */ lib('specs/dumbbell_fly.mjs'))).default;
}, T);

type V = number[];
const RG = 22;   // the hand region: px round the end grip (the solid hand, fist and dumbbell lie within 16.0 px of it)
const dist = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
/** The points of an svg path: L/M/Q number pairs, and a circle drawn as two relative arcs sampled every 10 deg. */
const pathPts = (d: string): V[] => {
  const c = d.match(/^M(-?[\d.]+) (-?[\d.]+)a([\d.]+) [\d.]+ 0 1 0 [\d.]+ 0/);
  if (c) { const r = +c[3]!, cx = +c[1]! + r, cy = +c[2]!; return Array.from({ length: 37 }, (_, k) => [cx + r * Math.cos(k * Math.PI / 18), cy + r * Math.sin(k * Math.PI / 18)]); }
  const n = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(m => +m[0]), o: V[] = [];
  for (let k = 0; k + 1 < n.length; k += 2) o.push([n[k]!, n[k + 1]!]);
  return o;
};
const defsOf = (svg: string) => new Map([...svg.matchAll(/<path id="([^"]+)" d="([^"]+)"/g)].map(m => [m[1]!, m[2]!]));
const groupAt = (svg: string, open: string) => {   // the markup of the first `<g …>` that starts with `open`, to its close
  const i = svg.indexOf(open); if (i < 0) return '';
  const re = /<g\b[^>]*?(\/?)>|<\/g>/g; re.lastIndex = i; let depth = 0, m;
  while ((m = re.exec(svg))) { if (m[0] === '</g>') depth--; else if (!m[1]) depth++; if (!depth) return svg.slice(i, re.lastIndex); }
  return svg.slice(i);
};
/** Every red dashed outline drawn: the Mistake outline's uses and the dashed guides, as point lists. */
const redDashed = (svg: string): V[][] => {
  const D = defsOf(svg), mp = groupAt(svg, '<g class="m-pose"'), ml = groupAt(svg, '<g class="mistake-layer"');
  return [...[...mp.matchAll(/<use href="#([^"]+)"/g)].map(m => pathPts(D.get(m[1]!) ?? '')), ...[...ml.matchAll(/<path class="m-line" d="([^"]+)"/g)].map(m => pathPts(m[1]!))];
};
/** The solid end pose's outlines: the body uses of `.pose-end` and the solid equipment drawn after it (hand polys, dumbbell bars and heads). */
const solidEnd = (svg: string): V[][] => {
  const D = defsOf(svg), i = svg.indexOf('<g class="pose-end"'), j = svg.indexOf('<mask', i), after = svg.slice(i, j < 0 ? undefined : j);
  return [...[...groupAt(svg, '<g class="pose-end"').matchAll(/<use href="#([^"]+)"/g)].map(m => pathPts(D.get(m[1]!) ?? '')),
    ...[...after.matchAll(/<path class="(?:eq-solid|disc)" d="([^"]+)"/g)].map(m => pathPts(m[1]!))];
};
/** Points every `step` px along a closed or open polyline. */
const sample = (p: V[], step = 0.5): V[] => { const o: V[] = [];
  for (let i = 0; i + 1 < p.length; i++) { const a = p[i]!, b = p[i + 1]!, n = Math.max(1, Math.ceil(dist(a, b) / step)); for (let k = 0; k < n; k++) o.push([a[0]! + (b[0]! - a[0]!) * k / n, a[1]! + (b[1]! - a[1]!) * k / n]); }
  o.push(p.at(-1)!); return o; };
const closed = (p: V[]) => (dist(p[0]!, p.at(-1)!) < 1e-6 ? p : [...p, p[0]!]);
const diameter = (ps: V[]) => { let m = 0; for (const a of ps) for (const b of ps) m = Math.max(m, dist(a, b)); return m; };
const hullArea = (ps: V[]) => {   // the convex hull's area (monotone chain)
  const p = [...ps].sort((a, b) => a[0]! - b[0]! || a[1]! - b[1]!), cr = (o: V, a: V, b: V) => (a[0]! - o[0]!) * (b[1]! - o[1]!) - (a[1]! - o[1]!) * (b[0]! - o[0]!);
  const half = (q: V[]) => { const h: V[] = []; for (const x of q) { while (h.length >= 2 && cr(h.at(-2)!, h.at(-1)!, x) <= 0) h.pop(); h.push(x); } h.pop(); return h; };
  const h = [...half(p), ...half([...p].reverse())]; let a = 0; h.forEach((x, i) => { const y = h[(i + 1) % h.length]!; a += x[0]! * y[1]! - y[0]! * x[1]!; }); return Math.abs(a) / 2;
};
const turn = (p: V, c: V, deg: number): V => { const t = deg * Math.PI / 180, dx = p[0]! - c[0]!, dy = p[1]! - c[1]!; return [c[0]! + dx * Math.cos(t) - dy * Math.sin(t), c[1]! + dx * Math.sin(t) + dy * Math.cos(t)]; };
/** The rigid turn about the wrist that best lays the red outlines on the solid ones: the angle (deg, screen, y down) and its mean / max residual (px). */
const fitTurn = (red: V[], grey: V[], W: V) => {
  let best = { deg: 0, mean: Infinity, max: Infinity };
  for (let k = -450; k <= 450; k++) {
    const deg = k / 10; let sum = 0, mx = 0;
    for (const p of red) { const q = turn(p, W, -deg); let m = Infinity; for (const g of grey) { const d = (q[0]! - g[0]!) ** 2 + (q[1]! - g[1]!) ** 2; if (d < m) m = d; } m = Math.sqrt(m); sum += m; mx = Math.max(mx, m); }
    if (sum / red.length < best.mean) best = { deg, mean: sum / red.length, max: mx };
  }
  return best;
};

/** Everything the checks read: per hand, the red dashed outlines in its region, the solid outlines, the fit; the zoom's red outlines. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4', mistake: true }), cam = qe.cameraOf(spec, r.report);
  const L = qe.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: equip.PRIMITIVES, body }, spec);
  const red = redDashed(r.svg), solid = solidEnd(r.svg);
  const hands = ['l', 'r'].map(s => {
    const G = cam.P(L.lm.end[`grip.${s}`]) as V, W = cam.P(L.lm.end[`wrist.${s}`]) as V;
    const reds = red.filter(p => p.some(q => dist(q, G) <= RG)), greys = solid.filter(p => p.length && p.every(q => dist(q, G) <= RG));
    return { s, G, W, reds, greys };
  });
  const z = Z.zoomOf(spec, { prefix: 'pf4' }), zc = z.svg.match(/data-c="(-?[\d.]+) (-?[\d.]+)"/)!, C = [+zc[1]!, +zc[2]!];
  const zr = redDashed(z.svg).filter(p => p.some(q => dist(q, C) <= 52));
  return { hands, zoom: { k: z.k, reds: zr } };
};
/** The measures of one hand: count, the fit of the solid outline turned about the wrist, scale ratios, drop of the centre. */
const handMeasures = (h: any) => {
  const redPts = h.reds.flat(), greyPts = h.greys.flat();
  const fit = fitTurn(h.reds.flatMap((p: V[]) => sample(closed(p), 1)), h.greys.flatMap((p: V[]) => sample(closed(p), 0.25)), h.W);
  const cy = (ps: V[]) => ps.reduce((t, p) => t + p[1]!, 0) / ps.length;
  return { n: h.reds.length, fit, dRatio: diameter(redPts) / diameter(greyPts), aRatio: hullArea(redPts) / hullArea(greyPts), drop: cy(redPts) - cy(greyPts), diam: diameter(redPts) };
};
const problems = (m: any) => {
  const bad: string[] = [];
  for (const h of m.hands) {
    const x = handMeasures(h);
    if (x.n !== 1) bad.push(`${h.s}: ${x.n} red dashed outlines in the hand region`);
    if (!(x.fit.mean <= 0.6 && x.fit.max <= 1.6)) bad.push(`${h.s}: not the solid hand-plus-dumbbell turned about the wrist (residual ${x.fit.mean.toFixed(2)} / ${x.fit.max.toFixed(2)} px)`);
    if (!(Math.abs(x.fit.deg) >= 20 && Math.abs(x.fit.deg) <= 35)) bad.push(`${h.s}: turned ${x.fit.deg.toFixed(1)} deg about the wrist`);
    if (!(x.drop >= 2)) bad.push(`${h.s}: the turned piece not toward the floor (centre ${x.drop.toFixed(2)} px)`);
    if (!(Math.abs(x.dRatio - 1) <= 0.1 && Math.abs(x.aRatio - 1) <= 0.1)) bad.push(`${h.s}: scale ${x.dRatio.toFixed(3)} (diameter) / ${x.aRatio.toFixed(3)} (hull area)`);
  }
  if (m.zoom.reds.length !== 1) bad.push(`zoom: ${m.zoom.reds.length} red dashed outlines`);
  else {
    const zl = m.hands.find((h: any) => h.reds.length).reds, zd = diameter(m.zoom.reds[0]) / diameter(zl.flat());
    if (!(Math.abs(zd / m.zoom.k - 1) <= 0.1)) bad.push(`zoom: the piece at ${zd.toFixed(2)} x the plate piece, not k ${m.zoom.k}`);
  }
  return bad;
};

describe('PF4 dumbbell_fly: one red hand-plus-dumbbell piece at the hand\'s scale, turned about the wrist', { timeout: T }, () => {
  let m: any;
  beforeAll(() => {
    m = measure(S);
    for (const h of m.hands) { const x = handMeasures(h); console.log(`PF4 dumbbell_fly ${h.s}: ${x.n} red dashed, turn ${x.fit.deg} deg (residual ${x.fit.mean.toFixed(2)} / ${x.fit.max.toFixed(2)} px), drop ${x.drop.toFixed(2)} px, diameter ${x.dRatio.toFixed(3)}, hull area ${x.aRatio.toFixed(3)}`); }
    console.log(`PF4 dumbbell_fly zoom: ${m.zoom.reds.length} red dashed, k ${m.zoom.k}`);
  }, T);
  it('per hand ONE red dashed outline; in the zoom ONE', () => {
    expect(m.hands.map((h: any) => h.reds.length)).toEqual([1, 1]);
    expect(m.zoom.reds.length).toBe(1);
  });
  it('the piece is the solid hand, fist and dumbbell turned 23.0 deg about the wrist toward the floor (the wrist bend), residual <= 0.6 px', () => {
    for (const h of m.hands) { const x = handMeasures(h); expect(Math.abs(x.fit.deg)).toBeCloseTo(23.0, 0); expect(x.fit.mean).toBeLessThanOrEqual(0.6); expect(x.drop).toBeGreaterThanOrEqual(2); }
  });
  it('the piece is at the hand\'s scale: diameter and hull area within 10% of the solid\'s; the zoom piece at k x the plate piece', () => {
    expect(problems(m)).toEqual([]);
  });
  it('mutations: an extra outline (the red fist back), the piece unturned, turned 45 deg, scaled 1.15, and the zoom piece at 2 x, are red', () => {
    const one = (f: (x: any) => any) => problems(f(structuredClone(m)));
    const onHands = (f: (h: any) => void) => (x: any) => { x.hands.forEach(f); return x; };
    expect(one(onHands(h => h.reds.push(h.greys.find((p: V[]) => p.length === 37))))).toContain('l: 2 red dashed outlines in the hand region');
    expect(one(x => { x.zoom.reds.push(x.zoom.reds[0]); return x; })).toContain('zoom: 2 red dashed outlines');
    const unturned = one(onHands(h => { const d = handMeasures(h).fit.deg; h.reds = h.reds.map((p: V[]) => p.map(q => turn(q, h.W, -d))); }));
    expect(unturned.some(p => /^l: turned 0\.0 deg/.test(p))).toBe(true);
    const over = one(onHands(h => { const d = handMeasures(h).fit.deg; h.reds = h.reds.map((p: V[]) => p.map(q => turn(q, h.W, Math.sign(d) * 22))); }));
    expect(over.some(p => /^l: turned -?45\.0 deg/.test(p))).toBe(true);
    const big = one(onHands(h => { const c = h.reds[0].reduce((t: V, p: V) => [t[0]! + p[0]! / h.reds[0].length, t[1]! + p[1]! / h.reds[0].length], [0, 0]); h.reds = h.reds.map((p: V[]) => p.map(q => [c[0]! + (q[0]! - c[0]!) * 1.15, c[1]! + (q[1]! - c[1]!) * 1.15])); }));
    expect(big.some(p => /^l: scale 1\.1/.test(p))).toBe(true);
    const z2 = one(x => { const c = x.zoom.reds[0][0]; x.zoom.reds = [x.zoom.reds[0].map((q: V) => [c[0] + (q[0]! - c[0]) * 0.8, c[1] + (q[1]! - c[1]) * 0.8])]; return x; });
    expect(z2.some(p => /^zoom: the piece at 2\.0\d x/.test(p))).toBe(true);
  });
  it('mutation (the spec): the engine\'s red fists back in the Mistake outline is red (2 outlines per hand)', () => {
    const fists = { ...S, mistake: { ...S.mistake, parts: [...S.mistake.parts, 'fist.l', 'fist.r'] } };
    const p = problems(measure(fists));
    expect(p).toContain('l: 2 red dashed outlines in the hand region');
  });
});

// The other plate on PILOT-A3's plates page (reverse_lunge) and every dumbbell_fly fragment but the Mistake svg equal the
// base page's (de91dd21, `howto-rebuild --page tests/howto/golden/library/pilot-a3.json page`, sha 476bff3a…9000).
describe('PF4 dumbbell_fly: the rest of the pilot-a3 plates page is byte-equal to the base', { timeout: T }, () => {
  const BASE: Record<string, Record<string, string>> = {
    'reverse-lunge': {
      normalSvg: 'daef9d1853ad591429e164b58b585ded30d033815d2fdf325808142f098612be', normalOverlay: '6645b13ce61d9b41ff64f3783df4def786b61a1727ffe4259af0c34a6cc0b091',
      mistakeSvg: 'be28727b57b3de42087a2aa8e7136606adacbc87c11fd18347e46f11e7bd3903', mistakeOverlay: 'd01df0f98638836820224c93ad92449c069da07d4dcc05eb61011bb8dd918a54',
      tells: '3b8748e608100f4dcb452b89f729b28c4b5d63f8182c8696335fa9f931431afb', tempo: 'eb4dd9849731669ac1cb004437fd08e1f8ebe026741d9ab8e909cefe1963e5eb',
      cues: '1aafabb743a297bf7c4dbe6c5c9cb80f7a6686aa011524583e1cada148ea103d', alt: 'a1883259b099b3abe8c84d92f57e3a68286fef05761c15ceaca2b8e84d184f6c',
      mistakeAlt: '60290a011cf514287cd031deed5e9bd4b56cca18acd412b81c551576e06a70c0',
    },
    'dumbbell-fly': {
      normalSvg: 'c3a420c1295211b0acd2414742301abddd38a5be3968a247ff1798cdf1f71b14', normalOverlay: 'dadc494a76933872c833c0038c3dadde0ad6f6cc990a7cff7ce87e1dd2a85102',
      mistakeOverlay: 'eef0d8304521e5e051823d8e7586a93321134bf4f4313a01f97dcd285cb74012', tells: '303f982e855c2d57e3ae65dcaa5373bbcfa3602ebb32ab20afa0bad8ccd99057',
      tempo: '068b430b9f93540419c35cfda571eec309fa309590c663464f12ba0ef540d72c', cues: '48b33bc83e9836febc01b1ddd6d9cfc7a0d9438f1b71bd4e570101d8b1d5eb71',
      alt: 'e140bcf8c1c9df67088b08c8acb87e03b2204df337d5acc30da8b0b175bc508d', mistakeAlt: 'b0e6a27253bf73061f153fdf8da1749854812c9b028b90e4528060e048600fb1',
    },
  };
  const BASE_FLY_MISTAKE_SVG = 'b223436c741d459358b99059abdd70dc1eff3a2dcf267327f2250fbb1a662035';
  let html = '';
  beforeAll(async () => { html = (await build.buildPa3Page()).html.toString('utf8'); }, T);
  const fragProblems = (h: string) => {
    const ps = golden.extractPlates(h), bad: string[] = [];
    if (ps.map((p: any) => p.chromeId).join() !== 'reverse-lunge,dumbbell-fly') bad.push(`plates ${ps.map((p: any) => p.chromeId).join()}`);
    for (const [c, want] of Object.entries(BASE)) { const p = ps.find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
      for (const k of Object.keys(want)) if (got[k] !== want[k]) bad.push(`${c} ${k}`); }
    return bad;
  };
  it('reverse_lunge\'s 9 fragments and 8 of dumbbell_fly\'s equal the base; dumbbell_fly\'s Mistake svg is the one that moved', () => {
    expect(fragProblems(html)).toEqual([]);
    const fly = golden.fragmentsOf(golden.extractPlates(html).find((x: any) => x.chromeId === 'dumbbell-fly'));
    expect(fly.mistakeSvg).not.toBe(BASE_FLY_MISTAKE_SVG);
  });
  it('mutation: one byte changed in reverse_lunge\'s Mistake alt is red', () => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'reverse-lunge'), alt = p.mistakeAlt ?? '';
    expect(alt.length).toBeGreaterThan(0);
    expect(fragProblems(html.replace(alt, alt.slice(0, -1) + (alt.endsWith('.') ? '!' : '.')))).toContain('reverse-lunge mistakeAlt');
  });
});
