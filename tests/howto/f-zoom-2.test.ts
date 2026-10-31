// F-ZOOM-2 (f-zoom-2-card; ruling D-LIB17-ZOOMPAIR on #332): the opt-in `zoom.pair: [flat, turned]` of a Mistake zoom
// entry, for a fault that turns about a fixed tell anchor (renegade_row: the hex turns 30° about its tell corner, so the
// tell anchor reads 0 px). faultOf measures the pair instead of the tell; the field rules, the pair row
// (H3.zoom:pair:mistake) and the not-needed line keep it honest. Node only. Items (b) F-ZOOM-TRIM and (c)
// cable_rear_delt_fly are decided as not built; A8 pins the trim numbers they were decided on.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const ID = 'renegade_row', LID = `lib_${ID}`;

let zoom: any, qz: any, qaIdx: any, qaEng: any, cand: any, bp: any, golden: any, lb7: any, reg: any;
let pins: any, E: any, mirror = '', all: any, rr: any, PAIR: any, TEMPO: any, c0: any, r0: any;
const specOf = async (id: string) => (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
beforeAll(async () => {
  [zoom, qz, qaIdx, qaEng, cand, bp, lb7, reg] = await Promise.all(['zoom/inline.mjs', 'qa/zoom.mjs', 'qa/index.mjs', 'qa/engine.mjs',
    'candidate.mjs', 'build-page.mjs', 'lb7/build.mjs', 'registry.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  rr = await import(/* @vite-ignore */ lib(`specs/${ID}.mjs`));
  // the far (flat) hex's drawn vertex 0, which is the tell's vertex M_HEX[0] before the 30° turn
  PAIR = [[rr.DB.l[0], rr.RR.apothem, rr.RR.gz + rr.RR.circum], rr.M_HEX[0]];
  // main's spec has no tempo (D-LIB17-SECS); the page needs a strip, so the fixture takes its untimed one from
  // strip/rows.json (LIB-STRIP's tempoOf: the same tempo #332 adds), in memory only
  const strip = JSON.parse(readFileSync(join(process.cwd(), 'tools/plates/library/strip/rows.json'), 'utf8'));
  TEMPO = (await import(/* @vite-ignore */ lib('strip/tempo-strip.mjs'))).tempoOf(strip.cards.find((x: any) => x.id === ID).rows);
  pins = qaIdx.loadPins();
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
  // renegade_row's registry row: lb7/rows.json since 'LIB-17 resume 2' (it left lb7/build.mjs HELD; D-LIB17-SPLIT)
  all = lb7.lb7All(process.cwd());
  c0 = await mutated(`(s, a) => ({ ...s, zoom: { view: 'mistake', k: 3, pair: a } })`, PAIR);
  r0 = await qa(c0);
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

const keys = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
const qa = (c: any) => qaIdx.runQa(c, { engine: E, pins });
// renegade_row changed the way the page builds it: a scratch module that imports the real spec and applies fn
async function mutated(fn: string, arg: any = null) {
  const dir = mkdtempSync(join(tmpdir(), 'fzoom2-')), file = join(dir, `${ID}.mjs`);
  writeFileSync(file, `import s from ${JSON.stringify(pathToFileURL(join(process.cwd(), `tools/plates/library/specs/${ID}.mjs`)).href)};\nconst fn = ${fn};\nexport default fn({ ...s, tempo: ${JSON.stringify(TEMPO)} }, ${JSON.stringify(arg)});\n`);
  try {
    const spec = (await import(/* @vite-ignore */ pathToFileURL(file).href)).default;
    const { html: h } = await bp.buildPlatesPage({ groups: [{ id: 'z', title: 'Z', ids: [ID] }], sources: { [ID]: ['mutation'] }, specs: { [ID]: file } });
    return { ...(await cand.candidateOf(LID, { all, platesHtml: h.toString('utf8'), engine: E, authoring: true })), spec };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
const withPair = (pair: any, extra: any = {}) => ({ ...rr.default, tempo: TEMPO, zoom: { view: 'mistake', k: 3, pair, ...extra } });
const pairOf = (spec: any) => qz.pairProblems(spec, E, E.renderPlate(spec, { id: 'x', mistake: false }).report);
const pairKeys = (spec: any) => pairOf(spec).map((p: any) => p.key);
const pairTexts = (spec: any) => pairOf(spec).map((p: any) => p.text);

describe('F-ZOOM-2 A1: the pair field', () => {
  const p = [1, 2, 3], q = [1, 2, 4];
  it('a valid pair on a Mistake entry has no problem; a list entry is checked the same way', () => {
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: [p, q] })).toEqual([]);
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 2 }, { view: 'mistake', k: 3, pair: [p, q] }])).toEqual([]);
  });
  it('red: equal points, a pair on a normal entry, a 2-number point, a third point, a non-finite number', () => {
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: [p, [...p]] })).toEqual(['zoom.pair: the two points are equal']);
    expect(zoom.zoomFieldProblems({ view: 'normal', k: 3, pair: [p, q] })).toEqual(['zoom.pair is for a Mistake entry, not the normal view']);
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 2, pair: [p, q] }])).toEqual(['zoom[0]: zoom.pair is for a Mistake entry, not the normal view']);
    const shape = ['zoom.pair must be two points [x, y, z] of finite numbers'];
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: [p, [1, 2]] })).toEqual(shape);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: [p, q, [5, 6, 7]] })).toEqual(shape);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: [p, [1, 2, NaN]] })).toEqual(shape);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, pair: p })).toEqual(shape);
  });
  it('zoomOf throws on a bad pair, and QA reports it as H3.zoom:field', () => {
    expect(() => zoom.zoomOf(withPair([PAIR[0], PAIR[0]]))).toThrow(/renegade_row: zoom.pair: the two points are equal/);
    const r = qz.zoomRows({ spec: withPair([PAIR[0], PAIR[0]]), plate: {} }, { envelope: pins.envelope }, null, {});
    expect(r.H3.map((x: any) => x.key)).toContain('H3.zoom:field');
  });
});

describe('F-ZOOM-2 A2-A4: renegade_row released at k 3', { timeout: T }, () => {
  it('A2: faultOf measures the pair (5.640 px at plate scale), key "pair", or zoom.tell\'s key when set', () => {
    const z = zoom.zoomOf(withPair(PAIR));
    expect(z.fault.key).toBe('pair');
    expect(z.fault.d).toBeCloseTo(5.640, 2);
    expect(Math.abs(z.fault.d - 5.640)).toBeLessThan(0.005);
    expect(zoom.zoomOf(withPair(PAIR, { tell: 'corner' })).fault.key).toBe('corner');
    expect(z.circle.c).toEqual([228, 152]);   // LIB-17 resume 2 panel R1 (D-FZOOM2-ROWSYNC form): the end arm moved, so the circle's free spot moved from [126, 188]
    expect(z.src.c[1] + z.src.r).toBeLessThan(358);   // D-LIB22-RINGFIT: the source ring closes inside the frame (346.0)
    // with no pair the tell anchor is the fault, and it does not move: why the pair exists
    const L = qaEng.poseLandmarks(E, rr.default), cam = qaEng.cameraOf(rr.default, E.renderPlate(rr.default, { id: 'x', mistake: false }).report);
    expect(zoom.faultOf({ ...rr.default, zoom: { view: 'mistake', k: 3 } }, cam, L).d).toBeLessThan(1e-6);
  });
  it('A2: with no pair, faultOf is main\'s: horizontal_leg_press and cable_chest_press pinned', async () => {
    const at = async (id: string) => { const s = await specOf(id), cam = qaEng.cameraOf(s, E.renderPlate(s, { id: 'x', mistake: false }).report); return zoom.faultOf(s, cam, qaEng.poseLandmarks(E, s)); };
    const round = (f: any) => ({ key: f.key, end: f.end.map((v: number) => +v.toFixed(4)), mistake: f.mistake.map((v: number) => +v.toFixed(4)), d: +f.d.toFixed(4) });
    expect(round(await at('horizontal_leg_press'))).toEqual(HLP_FAULT);
    expect(round(await at('cable_chest_press'))).toEqual(CCP_FAULT);
  });
  it('A3: at k 3 the deviation is 16.92 px, with no H3 key and no zoom key; A4: the source ring holds the pair', () => {
    expect(r0.metrics.zoom.mistake.deviation).toBeCloseTo(16.92, 1);
    expect(Math.abs(r0.metrics.zoom.mistake.deviation - 16.92)).toBeLessThan(0.01);
    expect(keys(r0).filter((k: string) => /^H\d\.zoom/.test(k))).toEqual([]);
    expect(r0.hard['PQ-H3'].problems).toEqual([]);
    expect(keys(r0).filter((k: string) => /^H[234]\./.test(k))).toEqual([]);
    // nothing stays red since 'LIB-17 resume 2' (D-FZOOM2-ROWSYNC): the card carries its tempo, the spec its zoom and tempo,
    // and the corner label has 2 words
    expect(keys(r0)).toEqual([]);
  });
  it('A3 red: k 2 (11.28 px) and k 1.5 (8.46 px) are under the 11.39 px bar', async () => {
    for (const k of [2, 1.5]) {
      const r = await qa(await mutated(`(s, a) => ({ ...s, zoom: { view: 'mistake', k: ${k}, pair: a } })`, PAIR));
      expect(keys(r)).toContain('H3.zoom:deviation');
      expect(r.metrics.zoom.mistake.deviation).toBeCloseTo(5.640 * k, 1);
    }
  });
  it('A4 red: the source ring moved 20 px left no longer holds the pair', async () => {
    const z = c0.plate.zoom.mistake.replace(/(<circle class="pz-src" cx=")([\d.]+)/, (_: string, a: string, x: string) => `${a}${+x - 20}`);
    expect(z).not.toBe(c0.plate.zoom.mistake);
    const r = await qa({ ...c0, plate: { ...c0.plate, zoom: { ...c0.plate.zoom, mistake: z } } });
    expect(keys(r)).toContain('H3.zoom:content:mistake');
    expect(keys(r0)).not.toContain('H3.zoom:content:mistake');
  });
});

describe('F-ZOOM-2 A5, A7: the pair row and the not-needed line', { timeout: T }, () => {
  it('A5: the fixture pair is two drawn vertices, turned the tell\'s anchor', () => {
    expect(pairKeys(withPair(PAIR))).toEqual([]);
    expect(pairKeys(withPair(PAIR, { tell: 'corner' }))).toEqual([]);
    expect(pairKeys(rr.default)).toEqual([]);   // no pair: no row
  });
  it('A5 red: flat at the hex centre, flat moved 1 mm, flat a Mistake-only vertex, turned a vertex that is not the anchor', () => {
    const [flat, turned] = PAIR, row = ['H3.zoom:pair:mistake'];
    const FLAT = ['zoom.pair flat is not a drawn vertex of the end pose'], ANCHOR = ['zoom.pair turned is not the Mistake anchor of a Mistake tell'];
    expect(pairKeys(withPair([rr.DB.l, turned]))).toEqual(row);
    expect(pairTexts(withPair([rr.DB.l, turned]))).toEqual(FLAT);
    expect(pairTexts(withPair([[flat[0], flat[1], flat[2] + 0.001], turned]))).toEqual(FLAT);
    expect(pairTexts(withPair([rr.M_HEX[3], turned]))).toEqual(FLAT);
    expect(pairTexts(withPair([flat, rr.M_HEX[1]]))).toEqual(ANCHOR);   // drawn in the Mistake pose, not the tell's anchor
    expect(pairTexts(withPair([flat, rr.M_HEX[1]], { tell: 'corner' }))).toEqual(['zoom.pair turned is not the Mistake anchor of the tell corner']);
    // turned on the tell's anchor, with that anchor moved 1 mm off the drawn hex: only the drawn-vertex rule catches it
    const off = [turned[0], turned[1], turned[2] + 0.001];
    const offTell = { ...withPair([flat, off]), mistake: { ...rr.default.mistake, tells: rr.default.mistake.tells.map((t: any) => ({ ...t, anchor: off })) } };
    expect(pairTexts(offTell)).toEqual(['zoom.pair turned is not a drawn vertex of the Mistake pose']);
    expect(qz.pairProblems(withPair(PAIR), E, null).map((p: any) => p.key)).toEqual(row);   // no render: red, never skipped
  });
  it('A5 red in the full QA: a pair point off a drawn vertex', async () => {
    const r = await qa({ ...c0, spec: withPair([[PAIR[0][0], PAIR[0][1], PAIR[0][2] + 0.001], PAIR[1]]) });
    expect(keys(r)).toContain('H3.zoom:pair:mistake');
    expect(keys(r0)).not.toContain('H3.zoom:pair:mistake');
  });
  it('A7 red: a pair that already moves the bar at plate scale (flat vertex 3 to the anchor, 17.15 px) is not needed', async () => {
    const big = [[rr.DB.l[0], rr.RR.apothem, rr.RR.gz - rr.RR.circum], rr.M_HEX[0]];
    expect(pairKeys(withPair(big))).toEqual([]);   // both drawn, turned the anchor: only the bar refuses it
    const r = await qa(await mutated(`(s, a) => ({ ...s, zoom: { view: 'mistake', k: 1.5, pair: a } })`, big));
    expect(r.metrics.zoom.mistake.fault.d).toBeCloseTo(17.15, 1);
    expect(keys(r)).toContain('H3.zoom:not-needed:mistake');
    expect(keys(r0)).not.toContain('H3.zoom:not-needed:mistake');
  });
});

describe('F-ZOOM-2 A8: the zoom trim is unchanged (item b, not built)', { timeout: T }, () => {
  const traceAt = async (id: string, k: number | null, f = (s: any) => s) => {
    const s = f({ ...(await specOf(id)) });
    if (k != null) s.zoom = { view: 'normal', k };
    const z = zoom.zoomOf(s, { view: 'normal', E });
    return qz.clippedTrace(z.svg, qz.circlesOf(z.svg).ring);
  };
  it('superman (low dropped) k 4: 16.33 px; jump_rope k 4: 21.30 px (< 22.11); cable_chest_press normal zoom: 63.04 px', async () => {
    expect(Math.abs(await traceAt('superman', 4, s => ({ ...s, callouts: s.callouts.filter((c: any) => c.key !== 'low') })) - 16.33)).toBeLessThan(0.05);
    const jr = await traceAt('jump_rope', 4);
    expect(Math.abs(jr - 21.30)).toBeLessThan(0.05);
    expect(jr).toBeLessThan(pins.envelope.traceLenMin);
    expect(Math.abs(await traceAt('cable_chest_press', null) - 63.04)).toBeLessThan(0.05);
  });
});

// faultOf at main c7bdad7a (before F-ZOOM-2), rounded to 1e-4 px (the full values were also equal to the last digit)
const HLP_FAULT = { key: 'lock', end: [191.9343, 227.2004], mistake: [195.5863, 234.5078], d: 8.1692 };
const CCP_FAULT = { key: 'lock', end: [223.9437, 154.7149], mistake: [225.4122, 152.1255], d: 2.9769 };
