// LIB-ZOOM QA rows (lib-zoom-card; ruling LIB-ZOOM NOTE RULED, conditions 1-2). A view that fails PQ-H3 at plate
// scale may carry one zoom circle (zoom/inline.mjs); its bar is then met inside the circle at the zoom's own scale,
// with the bars unchanged (envelope traceLenMin, deviationMin). The rows re-read the circle from the page markup
// (c.plate.zoom), never from the renderer's own numbers:
//   H2.zoom:text / H2.zoom:angle   no text in a zoom, and no angle (owner rule, 2026-10-18)
//   H3.zoom:*                      field shape and k range; present where the spec asks, nowhere else; allowed only on
//                                  a view that fails at plate scale; the bar at k; the source ring holds the fault/trace;
//                                  F-ZOOM-2: a pair's points are drawn vertices, turned the tell's own anchor (pairProblems)
//   H4.zoom:*                      node placement: 8 px margin and the meta band; 6 px gap to the figure and equipment;
//                                  no leader or label crossing; the source ring apart from the circle
// The browser half (label and hit boxes at 390/360/340 px, ring contrast) is browser.mjs.
import { tags } from './markup.mjs';
import { anchorInPose, cameraOf, equipmentItems, poseLandmarks, resolvePoint } from './engine.mjs';
import { ZOOM, faultOf, labelBoxes, leadersOf, polyHitsCircle, tracePath, zoomFieldProblems, zoomFor } from '../zoom/inline.mjs';

const P = (key, text) => ({ key, text });
export const ANGLE = /°|&deg;|&#176;|&#x[bB]0;|\bdeg(?:rees?)?\b/;

/** The circles of a zoom group: ring { c, r }, source { c, r }, the view and k it declares. */
export function circlesOf(zoom) {
  const t = tags(zoom), g = t.find(x => x.name === 'g' && x.attrs.get('class') === 'plate-zoom');
  const circ = cls => { const e = t.find(x => x.name === 'circle' && x.attrs.get('class') === cls); return e ? { c: [+e.attrs.get('cx'), +e.attrs.get('cy')], r: +e.attrs.get('r') } : null; };
  return { view: g?.attrs.get('data-view'), k: +(g?.attrs.get('data-k') ?? NaN), ring: circ('pz-ring'), src: circ('pz-src') };
}

/** Points of an absolute path (M, L, H, V, C, Z), cubics at 64 steps, lines split to 1 px. */
export function pathPoints(d) {
  const tok = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e[-+]?\d+)?/g) ?? [], out = [];
  let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0;
  const num = () => +tok[i++];
  const lineTo = (nx, ny) => { const n = Math.max(1, Math.ceil(Math.hypot(nx - x, ny - y))); for (let j = 1; j <= n; j++) out.push([x + (nx - x) * j / n, y + (ny - y) * j / n]); x = nx; y = ny; };
  while (i < tok.length) {
    if (/[A-Za-z]/.test(tok[i])) cmd = tok[i++];
    if (cmd === 'M') { x = sx = num(); y = sy = num(); out.push(null, [x, y]); cmd = 'L'; }
    else if (cmd === 'L') lineTo(num(), num());
    else if (cmd === 'H') lineTo(num(), y);
    else if (cmd === 'V') lineTo(x, num());
    else if (cmd === 'Z') { lineTo(sx, sy); }
    else if (cmd === 'C') { const [a, b, c2, e, g, h] = [num(), num(), num(), num(), num(), num()], x0 = x, y0 = y;
      for (let j = 1; j <= 64; j++) { const t = j / 64, u = 1 - t; out.push([u * u * u * x0 + 3 * u * u * t * a + 3 * u * t * t * c2 + t * t * t * g, u * u * u * y0 + 3 * u * u * t * b + 3 * u * t * t * e + t * t * t * h]); }
      x = g; y = h; }
    else throw new Error(`pathPoints: unsupported command ${cmd}`);
  }
  return out;
}

/** Length of the zoom's trace paths inside its circle (what the user sees). */
export function clippedTrace(zoom, ring) {
  let L = 0;
  for (const t of tags(zoom).filter(x => x.name === 'path' && (x.attrs.get('class') ?? '').split(/\s+/).includes('trace'))) {
    const ps = pathPoints(t.attrs.get('d') ?? '');
    for (let j = 1; j < ps.length; j++) { const a = ps[j - 1], b = ps[j];
      if (a && b && Math.hypot(a[0] - ring.c[0], a[1] - ring.c[1]) <= ring.r && Math.hypot(b[0] - ring.c[0], b[1] - ring.c[1]) <= ring.r) L += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  }
  return L;
}

/** Zoom metrics of a candidate: per view { k, ring, src, deviation?, trace? } at the zoom's own scale. */
export function zoomMetrics(c, ctx, R) {
  const out = {};
  for (const view of ['normal', 'mistake']) {
    const z = c.plate.zoom?.[view];
    if (!z) continue;
    const ci = circlesOf(z), m = { k: ci.k, ring: ci.ring, src: ci.src };
    if (view === 'mistake' && R && c.spec) { const f = faultOf(c.spec, cameraOf(c.spec, R.normal.report), poseLandmarks(ctx.engine, c.spec)); m.fault = f; m.deviation = f ? f.d * ci.k : 0; }
    if (view === 'normal' && ci.ring) m.trace = clippedTrace(z, ci.ring);
    out[view] = m;
  }
  return out;
}

/**
 * F-ZOOM-2 (D-LIB17-ZOOMPAIR, D-LIB18-RINGKEEP): the Mistake entry's `pair: [flat, turned]` checked against the drawn
 * plate, in plate px on the normal render's camera. Red (H3.zoom:pair:mistake) when flat is more than 0.01 px from every
 * poly vertex of an end-pose equipment item, when turned is from every poly vertex of a Mistake-pose item, or when
 * turned is not the Mistake-pose anchor of the spec's tell (zoom.tell's, when set), resolved as faultOf resolves it.
 * [] for a spec with no pair.
 */
export function pairProblems(spec, E, report) {
  const z = zoomFor(spec, 'mistake'), out = [], TOL = 0.01;
  if (!z?.pair) return out;
  const bad = text => out.push(P('H3.zoom:pair:mistake', text));
  if (!report) { bad('no normal render to check the pair against'); return out; }
  const cam = cameraOf(spec, report), items = equipmentItems(E, spec, report, ['end', 'mistake']), L = poseLandmarks(E, spec);
  const [flat, turned] = z.pair.map(w => cam.P(w));
  const near = (q, ps) => ps.some(v => Math.hypot(v[0] - q[0], v[1] - q[1]) <= TOL);
  const verts = pose => [...(items[pose]?.values() ?? [])].flatMap(it => it.poly ?? []);
  if (!near(flat, verts('end'))) bad('zoom.pair flat is not a drawn vertex of the end pose');
  if (!near(turned, verts('mistake'))) bad('zoom.pair turned is not a drawn vertex of the Mistake pose');
  const tells = (spec.mistake?.tells ?? []).filter(t => !z.tell || t.key === z.tell);
  if (!near(turned, tells.map(t => resolvePoint(anchorInPose(t.anchor, 'mistake'), 'mistake', L.lm, cam))))
    bad(`zoom.pair turned is not the Mistake anchor of ${z.tell ? `the tell ${z.tell}` : 'a Mistake tell'}`);
  return out;
}

const ink = (occ, c, r) => { let n = 0; for (let y = -r; y <= r; y += 2) { const w = Math.sqrt(Math.max(0, r * r - y * y)); n += occ.count(c[0] - w, c[1] + y - 1, c[0] + w, c[1] + y + 1); } return n; };
const rectHits = (b, c, r) => Math.hypot(Math.max(b.x0 - c[0], 0, c[0] - b.x1), Math.max(b.y0 - c[1], 0, c[1] - b.y1)) < r;

/** The node zoom rows: { H2, H3, H4 } problem lists. `M`: nodeMetrics (plate scale) with M.zoom. */
export function zoomRows(c, ctx, R, M) {
  const H2 = [], H3 = [], H4 = [], env = ctx.envelope, spec = c.spec, Z = M.zoom ?? {};
  for (const t of zoomFieldProblems(spec?.zoom ?? null)) H3.push(P('H3.zoom:field', t));
  for (const view of ['normal', 'mistake']) {
    // D-LIB16-ZOOMVIEWS: each view against its own entry (a single { view, k } is the one entry)
    const want = zoomFor(spec, view), z = c.plate.zoom?.[view], asked = !!want;
    if (!z && !asked) continue;
    if (z && !asked) { H3.push(P(`H3.zoom:unexpected:${view}`, `a zoom circle on the ${view} plate that the spec does not ask for`)); continue; }
    if (!z) { H3.push(P(`H3.zoom:missing:${view}`, `the spec asks for a ${view} zoom; the page has none`)); continue; }
    // content: no text, no angle
    if (/<(text|foreignObject|tspan)\b/.test(z)) H2.push(P('H2.zoom:text', `the ${view} zoom holds text`));
    if (ANGLE.test(z)) H2.push(P('H2.zoom:angle', `the ${view} zoom holds an angle (owner rule: no angle in a zoom view)`));
    const m = Z[view];
    if (!m?.ring || !m?.src) { H3.push(P(`H3.zoom:shape:${view}`, 'the zoom has no ring or no source ring')); continue; }
    if (m.k !== want.k || Math.abs(m.ring.r / m.src.r - want.k) > 0.01) H3.push(P(`H3.zoom:k:${view}`, `the drawn zoom (k ${m.k}, ring ${m.ring.r}/${m.src.r}) is not the spec's k ${want.k}`));
    // allowed only on a view that fails at plate scale; the bar at the zoom's own scale
    if (view === 'normal') {
      if (M.traceLen >= env.traceLenMin) H3.push(P('H3.zoom:not-needed:normal', `the Trace already reaches ${env.traceLenMin.toFixed(1)} px at plate scale (${M.traceLen.toFixed(1)} px)`));
      if (!(m.trace >= env.traceLenMin)) H3.push(P('H3.zoom:trace', `Trace inside the zoom ${(m.trace ?? 0).toFixed(1)} px < the shortest approved ${env.traceLenMin.toFixed(1)} px`));
      const tp = R && spec ? tracePath(spec, cameraOf(spec, R.normal.report), ctx.engine) : [];
      if (!tp.length || tp.some(p => Math.hypot(p[0] - m.src.c[0], p[1] - m.src.c[1]) > m.src.r - 1)) H3.push(P('H3.zoom:content:normal', 'the source ring does not hold the whole trace'));
    } else {
      if (M.deviation >= env.deviationMin) H3.push(P('H3.zoom:not-needed:mistake', `the Mistake already moves ${M.deviation.toFixed(1)} px at plate scale`));
      else if (want.pair && m.fault?.d >= env.deviationMin) H3.push(P('H3.zoom:not-needed:mistake', `the pair already moves ${m.fault.d.toFixed(1)} px at plate scale`));
      if (want.pair) H3.push(...pairProblems(spec, ctx.engine, R?.normal?.report));
      if (!(m.deviation >= env.deviationMin)) H3.push(P('H3.zoom:deviation', `tell-anchor deviation inside the zoom ${(m.deviation ?? 0).toFixed(1)} px < the smallest approved ${env.deviationMin.toFixed(1)} px`));
      if (!m.fault || [m.fault.end, m.fault.mistake].some(p => Math.hypot(p[0] - m.src.c[0], p[1] - m.src.c[1]) > m.src.r - 1)) H3.push(P('H3.zoom:content:mistake', 'the source ring does not hold the tell anchor in both poses'));
    }
    // node placement
    const { c: C, r } = m.ring, pv = c.plate[view];
    if (C[0] - r < ZOOM.margin || C[0] + r > ZOOM.size - ZOOM.margin || C[1] + r > ZOOM.size - ZOOM.margin || C[1] - r < ZOOM.top) H4.push(P(`H4.zoom:margin:${view}`, `the ${view} zoom is not inside the plate's 8 px margin, below the ${ZOOM.top} px meta band`));
    if (R?.[view]?.occ && ink(R[view].occ, C, r + ZOOM.gap) > 0) H4.push(P(`H4.zoom:ink:${view}`, `the ${view} zoom comes within ${ZOOM.gap} px of the figure or equipment`));
    if (leadersOf(pv.svg).some(p => polyHitsCircle(p, C, r + ZOOM.gap))) H4.push(P(`H4.zoom:leader:${view}`, `a leader crosses the ${view} zoom`));
    if (labelBoxes(pv.overlay).some(b => rectHits(b, C, r + ZOOM.gap))) H4.push(P(`H4.zoom:label:${view}`, `a label box overlaps the ${view} zoom`));
    if (Math.hypot(C[0] - m.src.c[0], C[1] - m.src.c[1]) < r + m.src.r + ZOOM.gap) H4.push(P(`H4.zoom:source:${view}`, `the ${view} zoom overlaps its source ring`));
  }
  return { H2, H3, H4 };
}
