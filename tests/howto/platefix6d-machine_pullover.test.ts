// LIB-PLATEFIX-6d machine_pullover (W10 #434 T02; F-PULLOVER-MACHINE: L5 c1, c2, c3; L7 c2, c3; L4 c1, c3). Measured
// from the engine's render, landmarks, body shapes and equipment items at the render's camera, never from the spec's
// constants. Distances are in the W10 critics' px: their layers tile is the page at 390 CSS px, device scale 2 (780 px),
// where the plate is drawn 358 CSS px wide, 1:1 (layers/artifact/build-page.mjs:271-279), so 1 plate px = 2 tile px (TILE).
//  A13: the Mistake view clears an open wedge (an opaque fill drawn after the trunk, Mistake only) from the pad face to the
//       red low back: at least 15 px wide and 15 px tall (c3) on rows at least 3 px below the arm and the arm's machine
//       parts; the hip on the seat (1 px); the back of the red head at least 40 px off the pad (c2: "clearly off");
//       no start pose, ghost or start phantom in the Mistake view (c1); a filled cam disc on the pivot with the
//       shoulder's joint mark outside it (radius at least 1.2 cm, larger than the 0.8 cm axle), the pivot 0-5 cm above the shoulder (c1); the movement arm, elbow pad, strut
//       and bar drawn in front, at most 5 % covered by the figure (c2, c3); no ghost between start and end (c2: one
//       dashed start).
//  A14: the trap row marks upper_traps (lib_chin_up form); the Pivot close-up is a drawn posture zoom (Right: shoulder
//       0-5 cm below the pivot; Wrong: at least 8 cm below, the seat too low, c1) and text-zooms.json has no entry.
// Red on the base spec (ff75bf0e): no Mistake-only fill (wedge 0 px), head 28.0 px, the start layer, 2 ghosts and the
// phantom in the Mistake view, no cam disc, the tube and strut 44 % covered, the trap row on neck-left/right, no zoom.
// After: see the console line (wedge 37.9 x 36.0 px, head 40.6 px, disc 2.05 px, 0 % covered).
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any, MG: any, SH: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M, MG, SH] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs',
    'specs/machine_pullover.mjs', 'mistake-ghosts.mjs', 'howto/lib_machine_pullover.howto.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const TILE = 2, MARK_R = 2.25;   // plate.mjs joint marks: r 2.25
const BAR = { wedge: 15, tall: 15, armClear: 3, seat: 1, head: 40, covered: 0.05, pivotCm: 5, wrongCm: 8, discM: 0.012 };   // discM: a cam disc, not the 0.8 cm axle
const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
  if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
/** x where a polygon's edges cross row y. */
const xsAt = (poly: V[], y: number) => { const xs: number[] = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]!;
  if ((a[1]! - y) * (b[1]! - y) > 0 || a[1] === b[1]) return; xs.push(a[0]! + (b[0]! - a[0]!) * (y - a[1]!) / (b[1]! - a[1]!)); }); return xs; };

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf6' }), rm = plate.renderPlate(spec, { id: 'pf6', mistake: true }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec), B = { height: 1.75 };
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), cam, { hand: 'flat' }).filter((s: any) => s.poly);
  const items = (pose: string, mistake: boolean) => { const ctx = { pose, start: L.lm.start, body: L.body, mistake, q: L.q[pose] }, out: any[] = [];
    spec.equipment.forEach((e: any) => { for (const one of [].concat(typeof e === 'function' ? e(L.lm[pose], ctx) ?? [] : e) as any[]) if (one)
      for (const it of eq.PRIMITIVES[one.type](one, cam)) out.push({ ...it, z: one.z ?? it.z, part: one.part ?? null }); });
    return out; };
  const endN = items('end', false), endM = items('end', true), dN = new Set(endN.map(it => it.d));
  // the wedge: the end pose's polys drawn only in the Mistake view
  const gap = endM.filter(it => it.poly && !dN.has(it.d));
  const E = shapes('end'), near = E.filter((s: any) => s.group === 'near').map((s: any) => s.poly);
  const armPolys = [...near, ...endN.filter(it => it.part === 'arm' && it.poly).map(it => it.poly)];
  const pad = M.PM.pad, padA = cam.P(M.PM.padL), padB = cam.P(pad.point), padX = (y: number) => padA[0]! + (padB[0]! - padA[0]!) * (y - padA[1]!) / (padB[1]! - padA[1]!);
  const tM = shapes('mistake').find((s: any) => s.key === 'torso').poly;
  let wide = 0, widest = 0, edgeOff = 0;
  const outside = gap.length > 0 && gap.every(g => ['mid', 'front'].includes(g.z) && g.cls === 'eq');
  for (const g of gap) {
    const ys = g.poly.map((p: V) => p[1]!), y0 = Math.min(...ys), y1 = Math.max(...ys);
    for (let y = y0 + 0.25; y < y1; y += 0.5) {
      const xs = xsAt(g.poly, y); if (xs.length < 2) continue;
      const xl = Math.min(...xs), xr = Math.max(...xs);
      // the row is clear of the arm when every arm shape over [xl - 1.5, xr + 1.5] lies at least armClear tile px above it
      const clear = armPolys.every((P: V[]) => P.every(([x, py]) => x! < xl - 1.5 || x! > xr + 1.5 || py! <= y - BAR.armClear / TILE)
        && !P.some(([x, py]) => x! >= xl && x! <= xr && py! > y));
      // the fill runs from the pad face to the red low back (within 1 px each side)
      const back = xsAt(tM, y).filter(x => x > xl - 3 && x < xr + 3);
      if (back.length) edgeOff = Math.max(edgeOff, Math.abs(xl - padX(y)), Math.min(...back.map(x => Math.abs(x - xr))));
      const w = (xr - xl) * TILE;
      if (clear) { widest = Math.max(widest, w); if (w >= BAR.wedge) wide += 0.5 * TILE; }
    }
  }
  const off = (y: number, z: number) => ((y - pad.point[1]) * pad.normal[1] + (z - pad.point[2]) * pad.normal[2]) * cam.pxm * TILE;
  const probe = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: V) => [w[2]!, -w[1]!] };
  const headM = body.bodyShapes(body.fk(L.q.mistake, B), probe).find((s: any) => s.key === 'head').poly;
  const head = Math.min(...headM.map(([z, my]: V) => off(-my!, z!)));
  const seatPx = Math.abs(L.lm.mistake.seat[1] - L.lm.end.seat[1]) * cam.pxm * TILE;
  const mSvg = MG.mistakeSvg(spec, rm.svg);
  const startInMistake = /<g class="(pose-start|ghost)\b/.test(mSvg) || endM.some(it => /m-line/.test(it.cls ?? ''));
  const ghostsNormal = (r.svg.match(/<g class="ghost"/g) ?? []).length, phantomNormal = endN.some(it => /m-line/.test(it.cls ?? ''));
  // the cam disc: a filled front circle centred on the pivot
  const hub = cam.P(M.PM.pivot), sh = cam.P(L.lm.end['shoulder.r']);
  const disc = endN.filter(it => it.cls === 'eq-solid' && it.z === 'front' && it.poly && it.poly.length >= 12).map(it => {
    const ds = it.poly.map((p: V) => Math.hypot(p[0]! - hub[0]!, p[1]! - hub[1]!)); return { r: Math.max(...ds), round: Math.max(...ds) - Math.min(...ds) }; })
    .filter(d => d.round < 0.2).sort((a, b) => b.r - a.r)[0] ?? null;
  const markClear = disc ? Math.hypot(sh[0]! - hub[0]!, sh[1]! - hub[1]!) - disc.r - MARK_R : -Infinity;
  const pivotCm = (M.PM.pivot[1] - L.lm.end['shoulder.r'][1]) * 100;
  // the machine arm's parts: share of each covered by body shapes drawn after it (z 'mid': the near arm; 'front': none)
  const covered = endN.filter(it => it.part === 'arm' && it.poly).map(it => {
    const over = it.z === 'front' ? [] : it.z === 'mid' ? near : E.map((s: any) => s.poly); let n = 0, c = 0;
    const xs = it.poly.map((p: V) => p[0]!), ys = it.poly.map((p: V) => p[1]!);
    for (let x = Math.min(...xs); x <= Math.max(...xs); x += 0.25) for (let y = Math.min(...ys); y <= Math.max(...ys); y += 0.25)
      if (inPoly(it.poly, [x, y])) { n++; if (over.some((P: V[]) => inPoly(P, [x, y]))) c++; }
    return c / Math.max(n, 1); });
  return { r, rm, discM: disc ? disc.r / cam.pxm : 0, gap, outside, wide, widest, edgeOff, head, seatPx, startInMistake, ghostsNormal, phantomNormal, disc, markClear, pivotCm, covered };
};
const problems = (m: any) => {
  const out: string[] = [];
  if (!m.outside) out.push('no wedge outside the solid outline');
  if (!(m.widest >= BAR.wedge)) out.push(`wedge ${m.widest.toFixed(1)} px wide`);
  if (!(m.wide >= BAR.tall)) out.push(`wedge ${m.wide.toFixed(1)} px tall`);
  if (m.gap.length && !(m.edgeOff <= 1)) out.push(`wedge edge ${m.edgeOff.toFixed(1)} px off the pad or the red back`);
  if (!(m.seatPx <= BAR.seat)) out.push(`hip ${m.seatPx.toFixed(1)} px off the seat`);
  if (!(m.head >= BAR.head)) out.push(`head ${m.head.toFixed(1)} px off the pad`);
  if (m.startInMistake) out.push('start in the Mistake view');
  if (m.ghostsNormal !== 0 || !m.phantomNormal) out.push(`start ghosts ${m.ghostsNormal}, phantom ${m.phantomNormal}`);
  if (!(m.markClear >= 0)) out.push('no cam disc with the shoulder mark outside');
  if (!(m.discM >= BAR.discM)) out.push(`cam disc ${(m.discM * 100).toFixed(2)} cm`);
  if (!(m.pivotCm > 0 && m.pivotCm <= BAR.pivotCm)) out.push(`pivot ${m.pivotCm.toFixed(1)} cm above the shoulder`);
  if (!(m.covered.length === 4 && m.covered.every((c: number) => c <= BAR.covered))) out.push(`arm parts covered ${m.covered.map((c: number) => (c * 100).toFixed(0)).join('/')} %`);
  return out;
};
const sheet = () => SH.default;
const textZooms = () => JSON.parse(readFileSync(new URL('../../tools/plates/library/text-zooms.json', import.meta.url), 'utf8')).entries;
const sheetProblems = (h: any, tz: any) => {
  const out: string[] = [], row = h.feel.rows.find((x: any) => x.key === 'neck');
  if (JSON.stringify(row?.at) !== JSON.stringify({ muscles: ['upper_traps'] })) out.push(`trap row at ${JSON.stringify(row?.at)}`);
  const z = h.zooms.find((x: any) => x.key === 'pivot' && x.kind === 'posture');
  if (!z) out.push('no Pivot close-up');
  if ('lib_machine_pullover' in tz) out.push('text-zooms entry');
  if (z) {
    const pose = (ref: any) => (typeof ref === 'string' ? h.plate.poses[ref] : { ...h.plate.poses[ref.base], ...ref.pose });
    const below = (p: any) => (M.PM.pivot[1] - body.landmarksOf(p, 1.75)['shoulder.r'][1]) * 100, rt = below(pose(z.right)), wr = below(pose(z.wrong));
    if (!(rt > 0 && rt <= BAR.pivotCm)) out.push(`Right shoulder ${rt.toFixed(1)} cm below the pivot`);
    if (!(wr >= BAR.wrongCm)) out.push(`Wrong shoulder ${wr.toFixed(1)} cm below the pivot`);
    if (h.posture.find((p: any) => p.key === 'pivot')?.zoom !== 'pivot') out.push('pivot checkpoint opens no close-up');
  }
  return out;
};

describe('LIB-PLATEFIX-6d machine_pullover (W10 T02): the Mistake wedge and head, the machine parts, the trap row and the Pivot close-up', { timeout: 600_000 }, () => {
  let m: any;
  beforeAll(() => { m = measure(S);
    console.log(`PF6d machine_pullover: wedge ${m.widest.toFixed(1)} x ${m.wide.toFixed(1)} px (edge ${m.edgeOff.toFixed(2)}), hip ${m.seatPx.toFixed(2)} px, head ${m.head.toFixed(1)} px, disc ${m.disc ? (m.disc.r).toFixed(2) : '-'} px (mark clear ${m.markClear.toFixed(2)}), pivot ${m.pivotCm.toFixed(1)} cm, covered ${m.covered.map((c: number) => (c * 100).toFixed(0)).join('/')} %`); }, 600_000);
  it('A13: the wedge, the hip, the head, the Mistake view, the cam disc and the machine arm', () => {
    expect(problems(m)).toEqual([]);
  });
  it('A14: the trap row marks upper_traps; the Pivot close-up is drawn and text-zooms.json has no entry', () => {
    expect(sheetProblems(sheet(), textZooms())).toEqual([]);
  });
  it('m15: the wedge drawn inside the outline (its fill under the trunk) is red', () => {
    const bad = { ...S, equipment: S.equipment.map((e: any) => (typeof e !== 'function' ? e : (lm: any, ctx: any) => {
      const a = [].concat(e(lm, ctx) ?? []) as any[]; if (!ctx.mistake) return a;
      const n = new Set(([].concat(e(lm, { ...ctx, mistake: false }) ?? []) as any[]).map(x => JSON.stringify(x)));
      return a.map(x => (n.has(JSON.stringify(x)) ? x : { ...x, z: 'back' })); })) };
    expect(problems(measure(bad))).toContain('no wedge outside the solid outline');
  });
  it('m16: the trap row back on the throat (neck-left, neck-right) is red', () => {
    const h = sheet(), bad = { ...h, feel: { ...h.feel, rows: h.feel.rows.map((x: any) => (x.key === 'neck' ? { ...x, at: { parts: ['neck-left', 'neck-right'] } } : x)) } };
    expect(sheetProblems(bad, textZooms())).toEqual(['trap row at {"parts":["neck-left","neck-right"]}']);
  });
  it('mutations: the start in the Mistake view, a ghost back, the head at the end pose\'s neck and the pivot zoom\'s Wrong at the Right are red', () => {
    expect(problems(measure({ ...S, mistakeGhosts: undefined }))).toContain('start in the Mistake view');
    expect(problems(measure({ ...S, ghosts: { ...S.ghosts, count: 1 } }))).toContain('start ghosts 1, phantom true');
    expect(problems(measure({ ...S, mistake: { ...S.mistake, pose: { ...S.mistake.pose, neck: S.poses.end.neck } } })).some(p => p.startsWith('head '))).toBe(true);
    const h = sheet(), bad = { ...h, zooms: h.zooms.map((z: any) => (z.key === 'pivot' ? { ...z, wrong: { base: 'end', pose: {} } } : z)) };
    expect(sheetProblems(bad, textZooms()).some(p => p.startsWith('Wrong shoulder'))).toBe(true);
    expect(sheetProblems(sheet(), { ...textZooms(), lib_machine_pullover: {} })).toEqual(['text-zooms entry']);
  });
  it('mutations: the machine arm back at z mid is covered; the cam disc grown over the shoulder mark is red', () => {
    const mid = { ...S, equipment: S.equipment.map((e: any) => (typeof e !== 'function' ? e : (lm: any, ctx: any) => {
      const a = e(lm, ctx); return a && !Array.isArray(a) && a.part === 'arm' && a.z === 'front' && a.type !== 'poly' ? { ...a, z: 'mid' } : a; })) };
    expect(problems(measure(mid)).some(p => p.startsWith('arm parts covered'))).toBe(true);
    const big = { ...S, equipment: S.equipment.map((e: any) => (e && e.type === 'poly' && e.cls === 'eq-solid' && e.z === 'front' && e.pts.length >= 12
      ? { ...e, pts: e.pts.map((p: V) => [p[0], M.PM.pivot[1] + (p[1]! - M.PM.pivot[1]) * 2, M.PM.pivot[2] + (p[2]! - M.PM.pivot[2]) * 2]) } : e)) };
    expect(problems(measure(big))).toContain('no cam disc with the shoulder mark outside');
  });
});
