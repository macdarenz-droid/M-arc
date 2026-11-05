// LIB-PLATEFIX-2 plates (PLATEFIX-2 PLAN RULED on #395; pf4 fix round): dumbbell_fly R5/R7, bent_over_dumbbell_rear_delt_fly R1/R5/R7/R11
// (D-PF2-SHRUG10, D-PF2-PLACE, D-PF2-POSTZOOM), pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD). The drawing facts each fix promises,
// measured on the engine's own output.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 900_000;
let zoom: any, qz: any, qaIdx: any, qaEng: any, golden: any, E: any, mirror = '', fly: any, flyMod: any, rd: any, rdMod: any, pec: any;
beforeAll(async () => {
  [zoom, qz, qaIdx, qaEng] = await Promise.all(['zoom/inline.mjs', 'qa/zoom.mjs', 'qa/index.mjs', 'qa/engine.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  flyMod = await import(/* @vite-ignore */ lib('specs/dumbbell_fly.mjs')); fly = flyMod.default;
  rdMod = await import(/* @vite-ignore */ lib('specs/bent_over_dumbbell_rear_delt_fly.mjs')); rd = rdMod.default;
  pec = (await import(/* @vite-ignore */ lib('specs/pec_fly.mjs'))).default;
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

const d = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
// the equipment entries a spec returns for one pose (the engine's own call shape: plate.mjs drawPose)
const entries = (spec: any, pose: string, mistake: boolean) => {
  const L = qaEng.poseLandmarks(E, spec), ctx = { pose, start: L.lm.start, body: L.body, mistake, q: L.q[pose] };
  return (spec.equipment ?? []).flatMap((e: any) => [].concat((typeof e === 'function' ? e(L.lm[pose], ctx) : e) ?? []));
};
const ofType = (es: any[], t: string) => es.filter(x => x.type === t);

describe('PF2 dumbbell_fly', { timeout: T }, () => {
  it('R7: the Mistake view draws the solid end dumbbells end-on at the neutral grip, as the normal view does', () => {
    const n = E.renderPlate(fly, { id: 'f' }), m = E.renderPlate(fly, { id: 'f', mistake: true });
    const hexes = (svg: string) => [...svg.matchAll(/<path class="eq-solid[^"]*"[^>]*d="([^"]+)"/g)].length;
    expect(hexes(m.svg)).toBe(hexes(n.svg));
    for (const mistake of [false, true]) expect(ofType(entries(fly, 'end', mistake), 'dumbbell').map((x: any) => x.axis)).toEqual([[0, 0, 1], [0, 0, 1]]);
    expect(ofType(entries(fly, 'mistake', true), 'dumbbell')).toEqual([]);   // the Mistake pose draws no dumbbell
  });
  it('R5: the red hand block and hexagon turn 30-35 deg toward the floor about the wrist, at the drawn hand length', () => {
    const cam = qaEng.cameraOf(fly, E.renderPlate(fly, { id: 'f' }).report), L = qaEng.poseLandmarks(E, fly).lm;
    expect(flyMod.FLY_TURN.l).toBeGreaterThanOrEqual(30); expect(flyMod.FLY_TURN.l).toBeLessThanOrEqual(35);
    expect(flyMod.FLY_TURN.r).toBe(-flyMod.FLY_TURN.l);
    for (const s of ['l', 'r']) {
      const W = cam.P(L.mistake[`wrist.${s}`]), G = cam.P(L.mistake[`grip.${s}`]), We = cam.P(L.end[`wrist.${s}`]), Ge = cam.P(L.end[`grip.${s}`]);
      expect(d(W, We)).toBeLessThan(0.1);                         // about the wrist joint: the forearm stays on its line
      expect(Math.abs(d(W, G) - d(We, Ge))).toBeLessThan(0.1);   // the hand keeps its drawn length
      expect(G[1]).toBeGreaterThan(Ge[1]);                          // toward the floor (screen y down)
    }
    const g = fly.mistake.guides, kinds = g.map((x: any) => x.kind);
    expect(kinds).toEqual(['dashed', 'dashed', 'line', 'dashed', 'dashed', 'line']);   // pf4 R5: no core ring; pf5 R5: a plain arc, no arrowhead
    // the red hexagon is centred on the faulty grip (the tell anchor), 6 sides, the primitive's size
    const hex = g[1].pts.slice(0, 6).map((p: number[]) => cam.P(p)), Gl = cam.P(L.mistake['grip.l']);
    const c = [hex.reduce((a: number, p: number[]) => a + p[0]!, 0) / 6, hex.reduce((a: number, p: number[]) => a + p[1]!, 0) / 6];
    expect(d(c, Gl)).toBeLessThan(0.1);   // the spec builds lmMis as the engine merges the pose; 0.05 px apart
    for (const p of hex) expect(d(p, c)).toBeCloseTo(0.0595 * cam.pxPerM, 2);
    // pf4 R5: hand block and hexagon turn as one rigid piece: the block's axis and the hexagon's first corner both turn TURN
    // from the grey neutral hand (wrist -> neutral grip, the same length)
    const ang = (a: number[], b: number[]) => Math.atan2(b[1]! - a[1]!, b[0]! - a[0]!) * 180 / Math.PI;
    const blk = g[0].pts.map((p: number[]) => cam.P(p)), mid = (a: number[], b: number[]) => [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2];
    const Wl = cam.P(L.end['wrist.l']), Ge = cam.P(L.end['grip.l']), b0 = mid(blk[0], blk[3]), b1 = mid(blk[1], blk[2]);
    expect(ang(b0, b1) - ang(Wl, Ge)).toBeCloseTo(flyMod.FLY_TURN.l, 1);
    expect(ang(c, hex[0]) - 0).toBeCloseTo(flyMod.FLY_TURN.l, 1);   // the neutral hexagon's first corner points along +x
    expect(d(b0, b1)).toBeCloseTo(d(Wl, Ge), 2);
  });
  it('the grey forearm axis and the red angle arc at the wrist are kept; the zoom stays at k 2.5', () => {
    const lines = ofType(entries(fly, 'end', true), 'line');
    expect(lines).toHaveLength(6);   // 4 dashed start phantoms (hex and core per side) + the 2 grey forearm axes
    // pf4 R5: each axis runs straight through the wrist and 2 hand lengths past it, through the neutral hand and hexagon
    const cam = qaEng.cameraOf(fly, E.renderPlate(fly, { id: 'f' }).report), L = qaEng.poseLandmarks(E, fly).lm.end;
    for (const s of ['l', 'r']) {
      const ax = lines.find((x: any) => x.part === `axis.${s}`), W = cam.P(L[`wrist.${s}`]), G = cam.P(L[`grip.${s}`]);
      const [a, b] = ax.pts.map((p: number[]) => cam.P(p)) as [[number, number], [number, number]];
      const off = (q: number[]) => Math.abs((b[0] - a[0]) * (a[1] - q[1]!) - (a[0] - q[0]!) * (b[1] - a[1])) / d(a, b);
      expect(off(W)).toBeLessThan(0.1); expect(off(G)).toBeLessThan(0.1);
      expect(d(W, b)).toBeCloseTo(2 * d(W, G), 1);
    }
    // pf5 R5: a short plain red arc at the wrist, 0.6 hand lengths out, from the grey axis (0) to the turned hand (TURN)
    const arcs = fly.mistake.guides.filter((x: any) => x.kind === 'line');
    expect(arcs).toHaveLength(2);
    const Lm = qaEng.poseLandmarks(E, fly).lm.mistake;
    for (const [g, s] of [[arcs[0], 'l'], [arcs[1], 'r']] as const) {
      const ps = g.pts.map((p: number[]) => cam.P(p)), W = cam.P(Lm[`wrist.${s}`]), G = cam.P(L[`grip.${s}`]), hl = d(W, G);
      for (const p of ps) expect(d(p, W)).toBeCloseTo(0.6 * hl, 1);
      const a0 = Math.atan2(ps[0][1] - W[1]!, ps[0][0] - W[0]!) * 180 / Math.PI, a1 = Math.atan2(ps[8][1] - W[1]!, ps[8][0] - W[0]!) * 180 / Math.PI;
      expect(((a1 - a0 + 540) % 360) - 180).toBeCloseTo(flyMod.FLY_TURN[s], 0);
    }
    expect(zoom.zoomFor(fly, 'mistake').k).toBe(2.5);
  });
});

describe('PF2 bent_over_dumbbell_rear_delt_fly', { timeout: T }, () => {
  it('pf5 R5: on the main figure, red dashed caps and trap lines raised 10 px toward the head along the trunk axis, with arrows, drawn on top', () => {
    const cam = qaEng.cameraOf(rd, E.renderPlate(rd, { id: 'r' }).report), L = qaEng.poseLandmarks(E, rd).lm.end;
    expect(rdMod.R11.up).toEqual([0, 10]);   // the trunk axis on screen points straight at the head
    const caps = rd.mistake.guides.filter((g: any) => g.kind === 'dashed' && g.pts.length === 25);
    expect(caps).toHaveLength(2);
    for (const [cap, s] of [[caps[0], 'r'], [caps[1], 'l']] as const) {
      const ps = cap.pts.slice(0, 24).map((p: number[]) => cam.P(p)), c = [ps.reduce((a: number, p: number[]) => a + p[0]!, 0) / 24, ps.reduce((a: number, p: number[]) => a + p[1]!, 0) / 24];
      const S = cam.P(L[`shoulder.${s}`]);
      expect(c[0]! - S[0]!).toBeCloseTo(0, 1); expect(c[1]! - S[1]!).toBeCloseTo(10, 1);
    }
    expect(rd.mistake.guides.filter((g: any) => g.kind === 'arrow')).toHaveLength(2);
    const m = E.renderPlate(rd, { id: 'r', mistake: true }).svg;
    expect(m.indexOf('class="mistake-layer"')).toBeGreaterThan(m.indexOf('class="m-pose"'));   // the guides draw after (over) the faulty outline and fill
    expect(rdMod.SIZES.M_SHRUG).toBe(10);
  });
  it('pf5 R11: the Mistake zoom magnifies its ringed region at k 3 in the plate\'s own view and raised-arm pose, holding the joint marker, cap top and head side', () => {
    const me = zoom.zoomFor(rd, 'mistake'), z = zoom.zoomOf(rd, { view: 'mistake' }), r11 = rdMod.R11;
    expect(me).toEqual({ view: 'mistake', k: 3, place: 'outer' });
    for (const p of [r11.joint, r11.capTop, r11.headSide]) expect(d(p, z.src.c)).toBeLessThanOrEqual(z.src.r - 1);
    expect(z.src.r).toBeCloseTo(52 / 3, 2);
    expect(zoom.outerOk(z.circle.c, z.focus, 195, z.circle.r)).toBe(true);
  });
  it('R7 note: the start dumbbells are dashed end-on hexagons, and the Trace is one circular arc within 1 px', () => {
    const r = E.renderPlate(rd, { id: 'r' });
    const lines = ofType(entries(rd, 'end', false), 'line');
    expect(lines).toHaveLength(4);   // per side a dashed end-on hexagon (7 points, closed) and its core ring (17)
    expect(lines.map((x: any) => x.pts.length).sort()).toEqual([17, 17, 7, 7]);
    const pts = zoom.tracePath(rd, qaEng.cameraOf(rd, r.report));
    const n = pts.length, mx = pts.reduce((a: number, p: number[]) => a + p[0]!, 0) / n, my = pts.reduce((a: number, p: number[]) => a + p[1]!, 0) / n;
    let suu = 0, svv = 0, suv = 0, suuu = 0, svvv = 0, suvv = 0, svuu = 0;
    for (const [x, y] of pts) { const u = x - mx, v = y - my; suu += u * u; svv += v * v; suv += u * v; suuu += u ** 3; svvv += v ** 3; suvv += u * v * v; svuu += v * u * u; }
    const a = (suuu + suvv) / 2, b = (svvv + svuu) / 2, det = suu * svv - suv * suv, uc = (a * svv - b * suv) / det, vc = (b * suu - a * suv) / det;
    const c = [uc + mx, vc + my], rad = Math.sqrt(uc * uc + vc * vc + (suu + svv) / n);
    expect(Math.max(...pts.map((p: number[]) => Math.abs(d(p, c) - rad)))).toBeLessThanOrEqual(1);
  });
  it('R1, pf4 R11: the posture zoom shows the whole bent-over body side-on at the main view\'s moment (end), r 68 at k 1, with the straight ref line; FLAT BACK stays on backUpper', () => {
    const z = zoom.zoomFor(rd, 'normal'), o = zoom.zoomOf(rd, { view: 'normal' });
    expect(z).toMatchObject({ k: 1, r: 68, project: 'side', focus: { pose: 'end' }, ring: false });   // pf5 R11: a plain inset, no ring
    expect(o.src).toBeNull(); expect(o.svg).not.toMatch(/pz-src|pz-link/);
    expect(z.focus.region).toEqual(expect.arrayContaining(['head', 'backUpper', 'sacrum', 'buttock', 'hip.r', 'shoulder.r']));
    expect(o.circle.r).toBe(68);
    expect(rd.callouts.find((c: any) => c.key === 'back').anchor).toBe('backUpper');
  });
});

describe('PF2 pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD)', () => {
  // the hit-box overlap is a browser measurement (qa/browser.mjs at 390/360/340 px): it runs in the plate QA, not in this
  // unit file (unit jobs have no browser); here the moved box and its leader's anchor are pinned
  it('the height box sits at top 260 and its leader still ends on the start grip', () => {
    expect(pec.callouts.find((x: any) => x.key === 'height')).toMatchObject({ anchor: { at: 'grip.r', pose: 'start' }, box: { left: 20, top: 260 } });
  });
});
