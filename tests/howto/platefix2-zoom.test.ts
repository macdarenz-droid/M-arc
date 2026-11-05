// LIB-PLATEFIX-2 part (a) (D-PF2-POSTZOOM, D-PF2-PLACE; PLATEFIX-2 PLAN RULED on #395): the chosen-focus posture zoom
// and the opt-in place 'outer', in zoom/inline.mjs and qa/zoom.mjs. Clean on the rear delt fly plate; every row red under
// its planted fault; every other zoom spec renders the bytes it rendered before (a).
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const ID = 'bent_over_dumbbell_rear_delt_fly', LID = `lib_${ID}`;
const OURS = /^(dumbbell_fly|bent_over_dumbbell_rear_delt_fly|pec_fly)(__alt)?\.mjs$/;
let zoom: any, qz: any, qaIdx: any, qaEng: any, cand: any, pa2: any, golden: any, E: any, mirror = '', c0: any, spec: any, pins: any;
beforeAll(async () => {
  [zoom, qz, qaIdx, qaEng, cand, pa2] = await Promise.all(['zoom/inline.mjs', 'qa/zoom.mjs', 'qa/index.mjs', 'qa/engine.mjs', 'candidate.mjs',
    'pilot-a2/build.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  spec = (await import(/* @vite-ignore */ lib(`specs/${ID}.mjs`))).default;
  pins = qaIdx.loadPins();
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
  const all = pa2.pa2All(), html = (await pa2.buildPa2Page({ all, ids: [LID] })).html.toString('utf8');
  c0 = await cand.candidateOf(LID, { all, platesHtml: html, engine: E, authoring: false });
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

const zoomKeys = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => /^H\d\.zoom/.test(k));
const qa = (c: any) => qaIdx.runQa(c, { engine: E, pins });
const withZoom = (view: string, z: string) => ({ ...c0, plate: { ...c0.plate, zoom: { ...c0.plate.zoom, [view]: z } } });
const moveRing = (z: string, x: number, y: number) => { const r = qz.circlesOf(z).ring.r;
  return z.replace(new RegExp(`(<circle (?:class="pz-(?:bg|ring)" )?)cx="[\\d.]+" cy="[\\d.]+" r="${r}"`, 'g'), `$1cx="${x}" cy="${y}" r="${r}"`); };

describe('PF2 (a): existing zooms are byte-equal', { timeout: T }, () => {
  it('the 36 zoom entries of every other spec render the svg, focus, circle, source and link they rendered before (a)', async () => {
    const dir = join(process.cwd(), 'tools/plates/library/specs'), h = createHash('sha256');
    let n = 0;
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith('.mjs') || OURS.test(f)) continue;
      const s = (await import(/* @vite-ignore */ pathToFileURL(join(dir, f)).href)).default;
      if (s?.zoom == null) continue;
      for (const z of zoom.zoomList(s.zoom)) { const o = zoom.zoomOf(s, { prefix: f, view: z.view }); h.update(f + o.svg + JSON.stringify([o.focus, o.circle, o.src, o.link])); n++; }
    }
    expect(n).toBe(36);
    // measured on origin/main 8bb433bd (before (a)) with the same loop
    expect(h.digest('hex')).toBe('f7df419a752d0604201a847818293addffd9bff073fe383df0ea1e7ceb9c972d');
  });
});

describe('PF2 (a): the field rows', () => {
  const N = { view: 'normal', k: 1, focus: { region: ['hip.r', 'shoulder.r'], pose: 'start' } };
  it('a valid posture entry, side projection and ref, and place outer on either kind, have no problem', () => {
    expect(zoom.zoomFieldProblems(N)).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'side', ref: [[0, 1, 0], [0, 1, 0.3]], place: 'outer' })).toEqual([]);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, place: 'outer' })).toEqual([]);
    // pf4 fix round: an own radius, and a posture entry on the Mistake view with its own guides
    expect(zoom.zoomFieldProblems({ ...N, r: 68 })).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, view: 'mistake', k: 2, guides: [{ kind: 'arrow', from: 'a', to: 'b' }] })).toEqual([]);
  });
  it('each bad field is named', () => {
    expect(zoom.zoomFieldProblems({ ...N, k: 0.9 })).toEqual(['zoom.k 0.9 is outside 1-4']);
    expect(zoom.zoomFieldProblems({ ...N, tell: 'x' })).toEqual(['zoom: unknown key tell']);
    expect(zoom.zoomFieldProblems({ ...N, r: 40 })).toEqual(['zoom.r 40 is outside 52-90']);
    expect(zoom.zoomFieldProblems({ ...N, r: 91 })).toEqual(['zoom.r 91 is outside 52-90']);
    expect(zoom.zoomFieldProblems({ ...N, guides: [] })).toEqual(['zoom.guides is a list, for a Mistake entry only']);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, r: 68 })).toEqual(['zoom: unknown key r']);   // the fault zoom keeps its radius
    expect(zoom.zoomFieldProblems({ ...N, ring: false })).toEqual(["zoom.ring is false or absent, and false only with project 'side' (an inset of another view)"]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'side', ring: true })).toEqual(["zoom.ring is false or absent, and false only with project 'side' (an inset of another view)"]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'side', ring: false })).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, focus: { region: [], pose: 'start' } })).toEqual(['zoom.focus.region must list 1-8 landmark names']);
    expect(zoom.zoomFieldProblems({ ...N, focus: { region: Array(9).fill('hip.r'), pose: 'start' } })).toEqual(['zoom.focus.region must list 1-8 landmark names']);
    expect(zoom.zoomFieldProblems({ ...N, focus: { region: ['hip.r'], pose: 'mistake' } })).toEqual(["zoom.focus.pose \"mistake\" is not 'start' or 'end'"]);
    expect(zoom.zoomFieldProblems({ ...N, focus: { region: ['hip.r'], pose: 'start', at: 1 } })).toEqual(['zoom.focus must be { region, pose }']);
    expect(zoom.zoomFieldProblems({ ...N, project: 'top' })).toEqual(["zoom.project \"top\" is not 'side'"]);
    expect(zoom.zoomFieldProblems({ ...N, ref: [[0, 1, 0], [0, 1, 0]] })).toEqual(['zoom.ref must be two different points [x, y, z] of finite numbers']);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 3, place: 'inner' })).toEqual(["zoom.place \"inner\" is not 'outer'"]);
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 1 })).toEqual(['zoom.k 1 is outside 1.5-4']);   // the fault zoom keeps its range
  });
  it('an unknown region landmark stops the build with its name', () => {
    expect(() => zoom.zoomOf({ ...spec, zoom: [{ ...N, focus: { region: ['nose.x'], pose: 'start' } }] }, { view: 'normal' })).toThrow(/no landmark nose\.x/);
  });
});

describe('PF2 (a): the rear delt fly plate, clean', { timeout: T }, () => {
  it('both zooms are drawn and no zoom row is red', async () => {
    // pf5: the side-view hinge is a plain inset (no source ring, no link); the Mistake zoom magnifies its ring in the plate's own view
    expect(c0.plate.zoom.normal).toMatch(/^<g class="plate-zoom" data-view="normal" data-k="1" data-c="[\d. ]+" data-src="[\d. ]+" data-focus="end" data-project="side" data-ring="none">/);
    expect(c0.plate.zoom.normal).not.toMatch(/pz-src|pz-link/);
    expect(c0.plate.zoom.mistake).toMatch(/^<g class="plate-zoom" data-view="mistake" data-k="3" data-c="[\d. ]+" data-src="[\d. ]+">/);
    expect(qz.circlesOf(c0.plate.zoom.normal)).toMatchObject({ ring: { r: 68 }, src: null });
    const r = await qa(c0);
    expect(zoomKeys(r)).toEqual([]);
    expect(r.metrics.traceLen).toBeGreaterThanOrEqual(pins.envelope.traceLenMin);
  });
  it('the posture zoom draws the end pose side-on with the ref line, and no trace or text', () => {
    const z = c0.plate.zoom.normal;
    expect(z).toMatch(/<path class="eq-line m-line" d="M[\d.]+ [\d.]+L[\d.]+ [\d.]+"\/>/);   // the ref: one straight dashed segment
    expect(z).not.toMatch(/class="trace/);
    expect(z).not.toMatch(/<text\b/);
  });
  it('the Mistake circle sits beyond its source ring from the body midline (place outer)', () => {
    const m = qz.circlesOf(c0.plate.zoom.mistake);
    expect(m.ring.c[0]).toBeLessThanOrEqual(m.src.c[0] - m.ring.r);
    expect(m.src.c[0]).toBeLessThan(195);
  });
});

describe('PF2 (a): each row turns red on its planted fault', { timeout: T }, () => {
  const posture = (over: any, view = 'normal') => zoom.zoomList(spec.zoom).map((z: any) => (z.view === view ? { ...z, ...over } : z));
  // a spec variant drawn through the real zoom code: its own markup in both views, so the rows read what the page would show
  const variant = (zs: any[], extra: any = {}) => { const s2 = { ...spec, ...extra, zoom: zs }, pre = 'bent-over-dumbbell-rear-delt-fly';
    return { ...c0, spec: s2, plate: { ...c0.plate, zoom: { normal: zoom.zoomOf(s2, { prefix: pre, view: 'normal' }).svg, mistake: zoom.zoomOf(s2, { prefix: pre, view: 'mistake' }).svg } } }; };
  const ringedOf = () => { const { ring: _ring, ...e } = zoom.zoomFor(spec, 'normal'); return e; };   // the same side posture entry with its source ring
  const PM = { view: 'mistake', k: 2, r: 56, focus: { region: ['shoulder.r', 'trap.r', 'ear', 'backUpper'], pose: 'start' }, project: 'side', place: 'outer' };
  it('the ringed and the Mistake posture variants are clean (the controls for the reds below)', async () => {
    expect(zoomKeys(await qa(variant([ringedOf(), zoom.zoomFor(spec, 'mistake')])))).toEqual([]);
    expect(zoomKeys(await qa(variant([zoom.zoomFor(spec, 'normal'), PM], { mistake: { ...spec.mistake, guides: [] } })))).toEqual([]);
  });
  it('shape: an inset that carries a source ring is red', async () => {
    const withSrc = variant([ringedOf(), zoom.zoomFor(spec, 'mistake')]).plate.zoom.normal;
    const r = await qa(withZoom('normal', withSrc));
    expect(zoomKeys(r)).toContain('H3.zoom:shape:normal');
  });
  it('hold: the region drawn at k 2 no longer fits the circle', async () => {
    const s2 = { ...spec, zoom: posture({ k: 2 }) }, z2 = zoom.zoomOf(s2, { prefix: 'bent-over-dumbbell-rear-delt-fly', view: 'normal' }).svg;
    const r = await qa({ ...withZoom('normal', z2), spec: s2 });
    expect(zoomKeys(r)).toContain('H3.zoom:posture:hold');
    expect(zoomKeys(r)).not.toContain('H3.zoom:k:normal');
  });
  it('source: the source ring shrunk to 5 px', async () => {
    const c = variant([ringedOf(), zoom.zoomFor(spec, 'mistake')]);
    const r = await qa({ ...c, plate: { ...c.plate, zoom: { ...c.plate.zoom, normal: c.plate.zoom.normal.replace(/(<circle class="pz-src" cx="[\d.]+" cy="[\d.]+" r=")[\d.]+"/, '$15"') } } });
    expect(zoomKeys(r)).toContain('H3.zoom:posture:source');
  });
  it('k: the drawn k is not the spec k', async () => {
    const r = await qa(withZoom('normal', c0.plate.zoom.normal.replace('data-k="1"', 'data-k="1.5"')));
    expect(zoomKeys(r)).toContain('H3.zoom:k:normal');
  });
  it('fill: a region squeezed to two near points spans under 0.6 of the circle', async () => {
    const r = await qa({ ...c0, spec: { ...spec, zoom: posture({ focus: { region: ['sacrum', 'backMid'], pose: 'start' } }) } });
    expect(zoomKeys(r)).toContain('H3.zoom:posture:fill');
  });
  it('ref: a reference line run 1 m past the back', async () => {
    const z = zoom.zoomFor(spec, 'normal'), [a, b] = z.ref;
    const r = await qa({ ...c0, spec: { ...spec, zoom: posture({ ref: [a, [b[0], b[1], b[2] + 1]] }) } });
    expect(zoomKeys(r)).toContain('H3.zoom:posture:ref');
  });
  it('trace: the plate trace under the bar is red although the normal view has a zoom', () => {
    const z = zoom.zoomFor(spec, 'normal'), m = qz.circlesOf(c0.plate.zoom.normal);
    const rep = { normal: { report: E.renderPlate(spec, { id: 'x' }).report } };
    const env = { engine: E, envelope: pins.envelope };
    expect(qz.postureProblems(spec, z, m, env, rep, { traceLen: pins.envelope.traceLenMin - 0.1 }).map((p: any) => p.key)).toContain('H3.zoom:posture:trace');
    expect(qz.postureProblems(spec, z, m, env, rep, { traceLen: pins.envelope.traceLenMin }).map((p: any) => p.key)).toEqual([]);
  });
  it('place: the Mistake circle moved to the body side of its source ring', async () => {
    const m = qz.circlesOf(c0.plate.zoom.mistake);
    const r = await qa(withZoom('mistake', moveRing(c0.plate.zoom.mistake, m.src.c[0] + 30, 100)));
    expect(zoomKeys(r)).toContain('H4.zoom:place:mistake');
  });
  it('place: the placement search honours outer (the circle without the key sits elsewhere)', () => {
    const { place, ...me } = zoom.zoomFor(spec, 'mistake');
    expect(place).toBe('outer');
    const free = zoom.zoomOf({ ...spec, zoom: [me] }, { view: 'mistake' }), outer = zoom.zoomOf(spec, { view: 'mistake' });
    expect(free.circle.c).not.toEqual(outer.circle.c);
    expect(zoom.outerOk(free.circle.c, free.focus, 195, free.circle.r)).toBe(false);
    expect(zoom.outerOk(outer.circle.c, outer.focus, 195, outer.circle.r)).toBe(true);
  });
  const pmCase = (mistake: any) => variant([zoom.zoomFor(spec, 'normal'), PM], { mistake: { ...spec.mistake, guides: [], ...mistake } });
  it('deviation: a Mistake posture zoom whose shrug is 1 cm moves the tell under the bar inside the zoom', async () => {
    expect(zoomKeys(await qa(pmCase({ pose: { scap: { elev: 1 } } })))).toContain('H3.zoom:posture:deviation');
    expect(zoomKeys(await qa(pmCase({})))).not.toContain('H3.zoom:posture:deviation');
  });
  it('deviation: a tell anchored off a landmark cannot be measured and is red', async () => {
    expect(zoomKeys(await qa(pmCase({ tells: [{ ...spec.mistake.tells[0], anchor: [0, 1, 0] }] })))).toContain('H3.zoom:posture:deviation');
  });
});
