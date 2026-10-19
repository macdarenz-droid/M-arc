// LIB-ZOOM (lib-zoom-card; ruling LIB-ZOOM NOTE RULED on #279): the inline zoom circle and its QA rows. Node only; the
// browser half (label and hit boxes at 390/360/340 px, ring contrast) is judged here on synthetic measurements and run
// for real by tools/plates/library/lb1/qa.mjs.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const ID = 'horizontal_leg_press', LID = `lib_${ID}`;

let zoom: any, qz: any, qaIdx: any, qaEng: any, browser: any, build: any, cand: any, bp: any, golden: any;
let pins: any, E: any, mirror = '', html = '', all: any, c0: any, hlp: any;
beforeAll(async () => {
  [zoom, qz, qaIdx, qaEng, browser, build, cand, bp] = await Promise.all(['zoom/inline.mjs', 'qa/zoom.mjs', 'qa/index.mjs', 'qa/engine.mjs',
    'qa/browser.mjs', 'lb1/build.mjs', 'candidate.mjs', 'build-page.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  hlp = (await import(/* @vite-ignore */ lib(`specs/${ID}.mjs`))).default;
  pins = qaIdx.loadPins();
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
  all = build.lb1All();
  html = (await build.buildLb1Page({ all, ids: [LID] })).html.toString('utf8');
  c0 = await cand.candidateOf(LID, { all, platesHtml: html, engine: E, authoring: true });
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

const keys = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
const qa = (c: any) => qaIdx.runQa(c, { engine: E, pins });
const zoomKeys = (r: any) => keys(r).filter((k: string) => /^H\d\.zoom/.test(k));
// a spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn
const mutated = async (fn: string, arg: any = null) => {
  const dir = mkdtempSync(join(tmpdir(), 'zoom-mut-')), file = join(dir, `${ID}.mjs`);
  writeFileSync(file, `import s from ${JSON.stringify(pathToFileURL(join(process.cwd(), `tools/plates/library/specs/${ID}.mjs`)).href)};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
  try {
    const spec = (await import(/* @vite-ignore */ pathToFileURL(file).href)).default;
    const { html: h } = await bp.buildPlatesPage({ groups: [{ id: 'z', title: 'Z', ids: [ID] }], sources: { [ID]: ['mutation'] }, specs: { [ID]: file } });
    return { ...(await cand.candidateOf(LID, { all, platesHtml: h.toString('utf8'), engine: E, authoring: true })), spec };
  } finally { rmSync(dir, { recursive: true, force: true }); }
};
// the Mistake zoom markup with its ring, clip and bg circles moved to (x, y)
const moveCircle = (z: string, x: number, y: number) => z.replace(/(<circle (?:class="pz-(?:bg|ring)" )?)cx="[\d.]+" cy="[\d.]+" r="52"/g, `$1cx="${x}" cy="${y}" r="52"`);
const withZoom = (z: string) => ({ ...c0, plate: { ...c0.plate, zoom: { ...c0.plate.zoom, mistake: z } } });

describe('LIB-ZOOM clean: horizontal_leg_press with its Mistake zoom', { timeout: T }, () => {
  it('the node half has no problem; the deviation inside the zoom reaches the bar at k 2', async () => {
    const r = await qa(c0);
    expect(keys(r)).toEqual([]);
    const z = r.metrics.zoom.mistake, env = pins.envelope;
    expect(r.metrics.deviation).toBeLessThan(env.deviationMin);   // too small at plate scale: why the zoom exists
    expect(z.k).toBe(2);
    expect(z.deviation).toBeCloseTo(r.metrics.deviation * 2, 6);
    expect(z.deviation).toBeGreaterThanOrEqual(env.deviationMin);
    expect(z.ring.r).toBe(52);
    expect(z.src.r).toBeCloseTo(26, 2);
  });
  it('the zoom sits on the Mistake plate only, and the plate-scale svg the other checks read has no zoom', () => {
    expect(c0.plate.zoom.normal).toBeNull();
    expect(c0.plate.zoom.mistake).toMatch(/^<g class="plate-zoom" data-view="mistake" data-k="2"/);
    expect(c0.plate.mistake.svg).not.toContain('plate-zoom');
    expect(html.split('<g class="plate-zoom"').length - 1).toBe(1);
    expect(c0.plate.zoom.mistake).not.toMatch(/<text\b/);
    expect(qz.ANGLE.test(c0.plate.zoom.mistake)).toBe(false);
  });
  it('the zoom is drawn by the same engine at k x the plate camera (a magnified copy of the Mistake plate)', () => {
    const plain = E.renderPlate(hlp, { id: 'x', mistake: true }), z = zoom.zoomOf(hlp, { prefix: 'x', E });
    expect(z.svg).toContain('<g class="pz-in" clip-path="url(#x-m-zclip)">');
    expect(z.svg.match(/class="m-pose"/g)?.length).toBe(plain.svg.match(/class="m-pose"/g)?.length);
    expect(Math.hypot(z.circle.c[0] - z.focus[0], z.circle.c[1] - z.focus[1])).toBeGreaterThan(52 + 26 + 6);
  });
});

describe('LIB-ZOOM approved bytes (supervisor recheck panel @ 9fbdfb5)', { timeout: T }, () => {
  it('horizontal_leg_press renders the pinned plate fragments, zoom circle included', async () => {
    const pin = JSON.parse(readFileSync(join(process.cwd(), 'tools/plates/library/zoom/approved.json'), 'utf8'));
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === pin.chromeId);
    expect(golden.fragmentsOf(p)).toEqual(pin.fragments);
  });
});

describe('LIB-ZOOM panel fix (R5): the locked leg reads straight', { timeout: T }, () => {
  it('the Mistake knee lies on the hip -> ankle line (within 0.5 px), and the Mistake draws that line', () => {
    const r = E.renderPlate(hlp, { id: 'x' }), cam = qaEng.cameraOf(hlp, r.report), L = qaEng.poseLandmarks(E, hlp).lm.mistake;
    const [h, k, a] = ['hip.r', 'knee.r', 'ankle.r'].map(n => cam.P(L[n]));
    const off = Math.abs((a[0] - h[0]) * (h[1] - k[1]) - (h[0] - k[0]) * (a[1] - h[1])) / Math.hypot(a[0] - h[0], a[1] - h[1]);
    expect(off).toBeLessThan(0.5);
    expect(hlp.mistake.guides).toEqual([{ kind: 'line', pts: [{ at: 'hip.r', pose: 'mistake' }, { at: 'ankle.r', pose: 'mistake' }] }]);
    const m = E.renderPlate(hlp, { id: 'x', mistake: true }).svg.match(/<path class="m-arrow" d="M([\d.-]+),?\s*([\d.-]+)L([\d.-]+),?\s*([\d.-]+)"/);
    expect(m).not.toBeNull();
    expect(Math.hypot(+m![1]! - h[0]!, +m![2]! - h[1]!)).toBeLessThan(0.5);
    expect(Math.hypot(+m![3]! - a[0]!, +m![4]! - a[1]!)).toBeLessThan(0.5);
  });
});

describe('LIB-ZOOM mutations: each row turns red on its planted fault', { timeout: T }, () => {
  it('no zoom field: the plate-scale H3 deviation is red again (the bar is never lowered)', async () => {
    const r = await qa(await mutated('s => ({ ...s, zoom: undefined })'));
    expect(keys(r)).toEqual(['H3.deviation']);
  });
  it('the fault at k 2 under the bar: a lock only 40% of the way from the end pose', async () => {
    const fn = `(s, t) => { const L = (a, b) => a.map((v, i) => v + (b[i] - v) * t), e = s.poses.end.plant, m = s.mistake.pose.plant;
      const side = k => ({ ...m[k], at: L(e[k].at, m[k].at) });
      return { ...s, mistake: { ...s.mistake, pose: { plant: { l: side('l'), r: side('r') } } } }; }`;
    const r = await qa(await mutated(fn, 0.4));
    expect(zoomKeys(r)).toContain('H3.zoom:deviation');
  });
  it('k out of range: the page build refuses it, and the QA row is red on the field', async () => {
    await expect(mutated('s => ({ ...s, zoom: { ...s.zoom, k: 1.2 } })')).rejects.toThrow(/zoom\.k 1\.2 is outside 1\.5-4/);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 4.5 })).toEqual(['zoom.k 4.5 is outside 1.5-4']);
    expect(zoom.zoomFieldProblems({ view: 'side', k: 2 })).toEqual(["zoom.view \"side\" is not 'normal' or 'mistake'"]);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 2, r: 60 })).toEqual(['zoom: unknown key r']);
    const r = await qa({ ...c0, spec: { ...c0.spec, zoom: { view: 'mistake', k: 1.2 } } });
    expect(zoomKeys(r)).toEqual(expect.arrayContaining(['H3.zoom:field', 'H3.zoom:k:mistake']));
  });
  it('a zoom on a view that already passes at plate scale (the normal view: Trace 36.9 px) is red', async () => {
    const r = await qa(await mutated("s => ({ ...s, zoom: { view: 'normal', k: 2 } })"));
    expect(zoomKeys(r)).toContain('H3.zoom:not-needed:normal');
  });
  it('a zoom circle the spec does not ask for, and a missing one', async () => {
    expect(zoomKeys(await qa({ ...c0, spec: { ...c0.spec, zoom: undefined } }))).toEqual(['H3.zoom:unexpected:mistake']);
    expect(zoomKeys(await qa(withZoom(null as any)))).toEqual(['H3.zoom:missing:mistake']);
  });
  it('a planted "15°" (and "15 degrees") in the zoom is red: no text and no angle in a zoom view (owner rule)', async () => {
    const z = c0.plate.zoom.mistake, end = z.lastIndexOf('</g>');
    const text = z.slice(0, end) + '<text x="10" y="10">15°</text>' + z.slice(end);
    expect(zoomKeys(await qa(withZoom(text)))).toEqual(['H2.zoom:text', 'H2.zoom:angle']);
    const attr = z.replace('<g class="pz-in"', '<g aria-label="knee 15 degrees" class="pz-in"');
    expect(zoomKeys(await qa(withZoom(attr)))).toEqual(['H2.zoom:angle']);
    expect(['15°', '15 &deg;', '15&#176;', '15 deg', '15 degrees'].map(s => qz.ANGLE.test(s))).toEqual([true, true, true, true, true]);
    expect(['M15 20L30 40', 'degrade', 'pz-in'].map(s => qz.ANGLE.test(s))).toEqual([false, false, false]);
  });
  it('the circle on the figure: within 6 px of ink, and over its own source ring', async () => {
    const [x, y] = c0.plate.zoom.mistake.match(/data-src="([\d.]+) ([\d.]+)"/).slice(1).map(Number);
    expect(zoomKeys(await qa(withZoom(moveCircle(c0.plate.zoom.mistake, x, y))))).toEqual(expect.arrayContaining(['H4.zoom:ink:mistake', 'H4.zoom:source:mistake']));
  });
  it('the circle over the tell label and its leader', async () => {
    const b = c0.spec.mistake.tells[0].box;
    expect(zoomKeys(await qa(withZoom(moveCircle(c0.plate.zoom.mistake, b.left + 20, b.top + 10))))).toEqual(expect.arrayContaining(['H4.zoom:label:mistake', 'H4.zoom:leader:mistake']));
  });
  it('the circle outside the 8 px margin, and inside the meta band', async () => {
    expect(zoomKeys(await qa(withZoom(moveCircle(c0.plate.zoom.mistake, 56, 120))))).toContain('H4.zoom:margin:mistake');
    expect(zoomKeys(await qa(withZoom(moveCircle(c0.plate.zoom.mistake, 166, 90))))).toContain('H4.zoom:margin:mistake');
  });
  it('the source ring off the fault (moved 30 px) no longer holds the tell anchor; a ring of the wrong size breaks k', async () => {
    const z = c0.plate.zoom.mistake, moved = z.replace(/(<circle class="pz-src" cx=")([\d.]+)/, (_: string, a: string, v: string) => `${a}${+v - 30}`);
    expect(zoomKeys(await qa(withZoom(moved)))).toContain('H3.zoom:content:mistake');
    const small = z.replace(/(<circle class="pz-src" cx="[\d.]+" cy="[\d.]+" r=")([\d.]+)/, '$12');
    expect(zoomKeys(await qa(withZoom(small)))).toEqual(expect.arrayContaining(['H3.zoom:k:mistake', 'H3.zoom:content:mistake']));
  });
});

describe('LIB-ZOOM helpers and the browser rows', { timeout: T }, () => {
  it('the trace inside a zoom is clipped to the circle', () => {
    const g = (d: string) => `<g class="plate-zoom"><path class="trace" d="${d}"/></g>`;
    expect(qz.clippedTrace(g('M0 0L100 0'), { c: [0, 0], r: 50 })).toBeCloseTo(50, 0);
    expect(qz.clippedTrace(g('M0 0L30 0'), { c: [0, 0], r: 50 })).toBeCloseTo(30, 6);
    expect(qz.clippedTrace(g('M0 0C10 0 20 0 30 0'), { c: [100, 100], r: 50 })).toBe(0);
  });
  it('a page with no zoom spec comes back as the same bytes (the 8 and LB1 stay pinned)', async () => {
    const buf = Buffer.from('<style>x</style>');
    expect(await zoom.applyZooms(buf, {})).toBe(buf);
    const other = join(process.cwd(), 'tools/plates/library/specs/shoulder_press.mjs');
    expect(await zoom.applyZooms(buf, { shoulder_press: other })).toBe(buf);
  });
  it('browser: a label text box or a callout hit box over the zoom circle is red at that width; clear of it, nothing', () => {
    const lab = (x0: number) => ({ key: 'lock', callout: true, text: { x0: 200, y0: 250, x1: 260, y1: 280 }, css: { x0, y0: 150, x1: x0 + 60, y1: 180 }, hit: { x0, y0: 140, x1: x0 + 70, y1: 190, w: 70, h: 50 } });
    const cell = (x0: number) => ({ font: true, scroll: 0, ...Object.fromEntries(['normal', 'mistake'].map(m => [m, { labels: m === 'mistake' ? [lab(x0)] : [], cover: 0.2, contrast: {}, zc: m === 'mistake' ? { cx: 166, cy: 130, r: 52 } : null, zoom: 1, plate: { x0: 0, y0: 0, x1: 358, y1: 358 }, tempo: { scroll: 0, client: 1, out: 0 } }])) });
    const m = (x0: number) => Object.fromEntries(browser.THEMES.map((t: string) => [t, Object.fromEntries(browser.WIDTHS.map((w: number) => [w, cell(x0)]))]));
    const env = { ...pins.envelope, H4zoom: Object.fromEntries(browser.WIDTHS.map((w: number) => [w, 1])) };
    const zk = (x0: number) => browser.judge(c0, m(x0), env).H4.map((p: any) => p.key).filter((k: string) => k.startsWith('H4.zoom'));
    expect(zk(150)).toEqual(expect.arrayContaining(['H4.zoom:label:390:mistake:lock', 'H4.zoom:hit:340:mistake:lock']));
    expect(zk(230)).toEqual([]);
  });
});
