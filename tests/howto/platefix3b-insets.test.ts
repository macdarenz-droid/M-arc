// LIB-PLATEFIX-3b item 22 (#405 6682844211, #408 PLAN; item 15 held, D-PF3B-HOLD15): the elbow flare a side view cannot show, in head-end
// insets (zoom/inline.mjs project 'head'). Measured on main's side plates: smith_machine_bench_press's flared upper arm
// 1.4 px side-on (the Right's 38.2 px). Every value here is read
// from the engine's landmarks and the zoom's own projection and drawing (its joint markers and guide path), never from a
// spec constant. Main's specs have no zoom, so every block below is red there.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, zoom: any;
const S: Record<string, any> = {};
const IDS = ['smith_machine_bench_press'];   // item 15 (incline_barbell) held, D-PF3B-HOLD15: its spec is main's
beforeAll(async () => {
  [plate, body, eq, qaEng, zoom] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs', 'zoom/inline.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of IDS) S[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const deg = (v: number) => v * 180 / Math.PI;
const sub = (a: number[], b: number[]) => [a[0]! - b[0]!, a[1]! - b[1]!];
const len = (v: number[]) => Math.hypot(v[0]!, v[1]!);
const angle = (a: number[], b: number[]) => deg(Math.acos((a[0]! * b[0]! + a[1]! * b[1]!) / (len(a) * len(b))));

/** The inset of `view`: its entry, drawn svg and circle, and a map of world points into the circle (zoom px), built from
 *  the zoom's own projection (postureUV), the plate camera's scale x k, and the region centre, as the zoom places it. */
function inset(id: string, view: 'normal' | 'mistake') {
  const spec = S[id].default, entry = zoom.zoomFor(spec, view);
  expect(entry, `${id}: a ${view} zoom entry`).toBeTruthy();
  const o = zoom.zoomOf(spec, { prefix: 't', view }), cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 't-n' }).report);
  const uv = zoom.postureUV(entry, cam, spec), s = cam.pxPerM * entry.k, R = zoom.focusPoints(spec, entry).map(uv);
  const xs = R.map((q: number[]) => q[0]), ys = R.map((q: number[]) => q[1]), mc = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  const Z = (w: number[]) => { const q = uv(w); return [o.circle.c[0] + s * (q[0] - mc[0]!), o.circle.c[1] - s * (q[1] - mc[1]!)]; };
  const L = qaEng.poseLandmarks(Eng(), zoom.postureSpec(spec, entry)).lm, lm = L[view === 'mistake' ? 'mistake' : 'end'];
  return { spec, entry, o, Z, L, lm, arm: sub(Z(lm['elbow.r']), Z(lm['shoulder.r'])), torso: sub(Z(lm.hips), Z(lm.shoulders)) };
}
/** Plate px length of the right upper arm in the side plate, per pose (what main shows). */
const sideArm = (id: string, pose: string) => { const spec = S[id].default, cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 'q' }).report), L = qaEng.poseLandmarks(Eng(), spec).lm[pose];
  return len(sub(cam.P(L['elbow.r']), cam.P(L['shoulder.r']))); };
const joints = (svg: string) => [...svg.matchAll(/<circle class="joint" cx="([\d.-]+)" cy="([\d.-]+)"/g)].map(m => [+m[1]!, +m[2]!]);

describe.each(IDS)('PF3b %s: the head insets', id => {
  // D-PF3B-INSETRING (was: no source ring, data-ring="none", src null): the inset now marks its plate region
  it('both views carry a head-projection inset with its source ring, inside the plate', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(id, view);
      expect(o.svg).toMatch(new RegExp(`^<g class="plate-zoom" data-view="${view}" data-k="1" data-c="[\\d. ]+" data-src="[\\d. ]+" data-focus="end" data-project="head">`));
      expect(o.src).not.toBeNull();
      expect(o.posture).toEqual({ pose: 'end', project: 'head' });
    }
  });
  it('the measures are the drawing: the inset draws the end pose\'s shoulder and elbow joints where the projection puts them', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o, Z, L } = inset(id, view), J = joints(o.svg);
      for (const k of ['shoulder.r', 'elbow.r']) {
        const p = Z(L.end[k]);
        expect(Math.min(...J.map(j => Math.hypot(j[0]! - p[0]!, j[1]! - p[1]!))), `${view} ${k}`).toBeLessThanOrEqual(0.01);
      }
    }
  });
  it('each upper arm is at least 20 px in the inset and inside its circle; the side plate cannot show the flared one', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o, Z, lm, arm } = inset(id, view);
      expect(len(arm), `${view} upper arm px`).toBeGreaterThanOrEqual(20);
      for (const k of ['shoulder.r', 'elbow.r']) expect(len(sub(Z(lm[k]), o.circle.c)), `${view} ${k}`).toBeLessThanOrEqual(o.circle.r - 4);
    }
    expect(sideArm(id, 'mistake')).toBeLessThan(20);   // main: smith 1.4 px
  });
});

describe('PF3b item 22 smith_machine_bench_press: about 45 deg vs level with the shoulders (c3, c7)', { timeout: 60_000 }, () => {   // the W3 WALKTIME form (#384 6690918663): imports and renders several specs' zooms; timed out at the 5 s default on 05a2ebe7's source-gate; no assertion change
  it('Right: the upper arm 45 +-10 deg from the torso in the inset; Wrong: 90 +-10 deg', () => {
    const n = inset('smith_machine_bench_press', 'normal'), m = inset('smith_machine_bench_press', 'mistake');
    expect(Math.abs(angle(n.arm, n.torso) - 45), `Right ${angle(n.arm, n.torso).toFixed(1)}`).toBeLessThanOrEqual(10);
    expect(Math.abs(angle(m.arm, m.torso) - 90), `Wrong ${angle(m.arm, m.torso).toFixed(1)}`).toBeLessThanOrEqual(10);
  });
});

// LIB-PLATEFIX-3b ruling D-PF3B-INSETRING (item 22): the head inset marks its plate region on the side view, a dashed
// source ring over the shoulder-elbow region in the house zoom form, and the inset arm has no stray bump.
const tag = (svg: string, cls: string) => { const m = svg.match(new RegExp(`<(circle|path) class="${cls}"([^>]*)/>`));
  return m ? { name: m[1]!, attrs: Object.fromEntries([...m[2]!.matchAll(/ ([\w-]+)="([^"]*)"/g)].map(a => [a[1]!, a[2]!])) } : null; };
const form = (t: ReturnType<typeof tag>) => t && { name: t.name, keys: Object.keys(t.attrs).sort() };
describe('PF3b item 22 smith_machine_bench_press: the inset\'s source ring (D-PF3B-INSETRING)', { timeout: 60_000 }, () => {   // the W3 WALKTIME form (#384 6690918663): imports and renders several specs' zooms; timed out at the 5 s default on 05a2ebe7's source-gate; no assertion change
  const ID = 'smith_machine_bench_press';
  /** House zoom rings as other specs draw them: plate-projection zooms (barbell_shrug normal, bodyweight_squat Mistake)
   *  and PF2's ringed side-projection posture zoom (the rear delt fixture, as platefix3b-zoomhead renders it). */
  async function house() {
    const sh = (await import(/* @vite-ignore */ lib('specs/barbell_shrug.mjs'))).default, sq = (await import(/* @vite-ignore */ lib('specs/bodyweight_squat.mjs'))).default;
    const alt = (await import(/* @vite-ignore */ lib('specs/bent_over_dumbbell_rear_delt_fly__alt.mjs'))).default;
    const z = { view: 'mistake', k: 2, r: 56, focus: { region: ['shoulder.r', 'trap.r', 'ear', 'backUpper'], pose: 'start' }, project: 'side', place: 'outer' };
    const fx = { ...alt, id: 'bent_over_dumbbell_rear_delt_fly', mistake: { ...alt.mistake, pose: { scap: { elev: 10 } }, guides: [] }, zoom: [z] };
    return [zoom.zoomOf(sh, { prefix: 'h1', view: 'normal' }).svg, zoom.zoomOf(sq, { prefix: 'h2', view: 'mistake' }).svg, zoom.zoomOf(fx, { prefix: 'h3', view: 'mistake' }).svg];
  }
  it('both views draw the source ring in the house form (the element, class and attributes of other specs\' zoom rings)', async () => {
    const H = await house(), want = H.map(svg => form(tag(svg, 'pz-src')));
    expect(want[0], 'house pz-src').toBeTruthy();
    for (const w of want) expect(w).toEqual(want[0]);
    for (const view of ['normal', 'mistake'] as const) expect(form(tag(inset(ID, view).o.svg, 'pz-src')), `${view} pz-src`).toEqual(want[0]);
    // the dash, stroke and colour are the page's one .pz-src rule; no element carries its own
    expect(zoom.ZOOM_CSS).toContain('.plate .pz-src { fill: none; stroke: var(--text-2); stroke-width: 1; stroke-dasharray: 2 2; }');
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(ID, view), src = tag(o.svg, 'pz-src')!;
      expect([+src.attrs.cx!, +src.attrs.cy!, +src.attrs.r!]).toEqual(o.src.c.concat(o.src.r).map((v: number) => Math.round(v * 100) / 100));
      expect(o.svg).not.toMatch(/class="pz-src"[^>]*(style|stroke)=/);
    }
  });
  it('the house link (ring edge to circle edge on the centre line) would cross a callout box on both views, so none is drawn', () => {
    const spec = S[ID].default;
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(ID, view), pl = plate.renderPlate(spec, { id: 'q', mistake: view === 'mistake' });
      expect(zoom.labelBoxes(pl.overlay).some((b: any) => zoom.linkHitsBox(o.src.c, o.circle.c, o.src.r, o.circle.r, b)), view).toBe(true);
      expect(o.link, view).toBeNull();
      expect(o.svg, view).not.toContain('class="pz-link"');
    }
  });
  it('the ring holds the side plate\'s shoulder and elbow dots (end pose; on the Mistake view its pose too), not the neck or hips', () => {
    const spec = S[ID].default, cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 'q' }).report), L = qaEng.poseLandmarks(Eng(), spec).lm;
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(ID, view), m = view === 'mistake', pl = plate.renderPlate(spec, { id: 'q', mistake: m });
      const jr = +(pl.svg.match(/<circle class="joint" cx="[\d.-]+" cy="[\d.-]+" r="([\d.]+)"/)?.[1] ?? NaN);
      expect(jr).toBeGreaterThan(0);
      const src = tag(o.svg, 'pz-src')!.attrs, C = [+src.cx!, +src.cy!], r = +src.r!;
      for (const k of ['shoulder.r', 'elbow.r']) {   // the dots the plate draws
        const p = cam.P(L.end[k]);
        expect(Math.min(...joints(pl.svg).map(j => Math.hypot(j[0]! - p[0]!, j[1]! - p[1]!))), `${view} dot ${k}`).toBeLessThanOrEqual(0.01);
      }
      for (const pose of m ? ['end', 'mistake'] : ['end']) for (const k of ['shoulder.r', 'elbow.r']) {
        const p = cam.P(L[pose][k]);
        expect(Math.hypot(p[0] - C[0]!, p[1] - C[1]!) + jr, `${view} ${pose} ${k}`).toBeLessThanOrEqual(r);
      }
      for (const k of ['neck', 'hips']) { const p = cam.P(L.end[k]); expect(Math.hypot(p[0] - C[0]!, p[1] - C[1]!), `${view} ${k} outside`).toBeGreaterThan(r); }
      expect(Math.hypot(o.circle.c[0] - C[0]!, o.circle.c[1] - C[1]!), `${view} ring apart from the circle`).toBeGreaterThanOrEqual(o.circle.r + r + zoom.ZOOM.gap);
    }
  });
  it('the src field: 1-8 landmark names on a side or head entry with its ring; refused otherwise', () => {
    const N = { view: 'normal', k: 1, focus: { region: ['shoulder.r', 'elbow.r'], pose: 'end' } }, why = 'zoom.src lists 1-8 landmark names, for a side or head entry with its source ring';
    expect(zoom.zoomFieldProblems({ ...N, project: 'head', src: ['shoulder.r'] })).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'side', src: ['shoulder.r', 'elbow.r'] })).toEqual([]);
    for (const bad of [{ project: 'head', src: ['elbow.r'], ring: false }, { src: ['elbow.r'] }, { project: 'head', src: [] }, { project: 'head', src: 'elbow.r' },
      { project: 'head', src: Array(9).fill('elbow.r') }, { project: 'head', src: [''] }]) expect(zoom.zoomFieldProblems({ ...N, ...bad }), JSON.stringify(bad)).toEqual([why]);
    expect(zoom.zoomFieldProblems({ view: 'normal', k: 2, src: ['elbow.r'] })).toEqual(['zoom: unknown key src']);
  });
  it('the ring does not move the inset: the circle is where the plain inset (ring false) puts it', () => {
    const spec = S[ID].default;
    const plain = { ...spec, zoom: zoom.zoomList(spec.zoom).map((z: any) => { const { src: _s, ...e } = z; return { ...e, ring: false }; }) };
    for (const view of ['normal', 'mistake'] as const) expect(inset(ID, view).o.circle).toEqual(zoom.zoomOf(plain, { prefix: 't', view }).circle);
  });
  it('no stray bump: the inset arm is the upper arm and its caps, without the end pose\'s forearm and fist (they point at the viewer, to the bar the inset does not draw)', () => {
    for (const view of ['normal', 'mistake'] as const) {
      const { o } = inset(ID, view);
      expect(o.svg, view).toContain('-z-e-upper.r"');
      expect(o.svg, view).not.toMatch(/-z-e-(fore|fist)\.[lr]"/);
    }
  });
});
