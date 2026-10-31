// LIB-ZOOM (lib-zoom-card, ruling LIB-ZOOM NOTE RULED on #279): the inline zoom circle. A view whose fault or motion
// is too small for PQ-H3 at plate scale may carry one circle: the same spec drawn again by the same engine at k x the
// plate's camera, centred on the fault (Mistake view: the tell anchor's end -> mistake move) or on the motion (normal
// view: the trace point's path), clipped to a circle placed in empty plate space. A dashed source ring marks the plate
// region the circle magnifies. The circle holds no text. Opt-in through the spec field `zoom: { view, k }`; a page
// with no zoom spec is returned as the same bytes (applyZooms). The engine is never edited: the zoom is a second
// renderPlate call with a camera override, the way golden B's posture crops reuse the plate camera.
import { pathToFileURL } from 'node:url';
import { renderPlate } from '../../vendor/engine/plate.mjs';
import * as body from '../../vendor/engine/body.mjs';
import { CAP_LH, arcBox, capWidth, inkBox, metaWidth } from '../../vendor/engine/layout.mjs';
import { anchorInPose, cameraOf, poseLandmarks, resolvePoint } from '../qa/engine.mjs';

/** The convention's fixed numbers: circle radius, plate margin, meta band, gap to ink and labels, k range. */
export const ZOOM = Object.freeze({ r: 52, margin: 8, top: 44, gap: 6, kMin: 1.5, kMax: 4, size: 358 });
export const VIEWS = ['normal', 'mistake'];
const ENGINE = { renderPlate, body };
const f = v => (Math.round(v * 100) / 100).toFixed(2).replace(/\.?0+$/, '');

/** The zoom entries of a spec's field as a list: [] (none), [z] (one { view, k }) or the list itself
 *  (D-LIB16-ZOOMVIEWS: at most one zoom per view). */
export const zoomList = z => (z == null ? [] : Array.isArray(z) ? z : [z]);
/** The spec's zoom entry for `view`, or null. */
export const zoomFor = (spec, view) => zoomList(spec?.zoom).find(z => z?.view === view) ?? null;

/** The zoom field's own errors (shape and k range), [] when valid. A single { view, k } is checked as before; a list
 *  (D-LIB16-ZOOMVIEWS) holds 1 or 2 such entries with different views, each checked the same way. */
export function zoomFieldProblems(z) {
  if (z == null) return [];
  if (!Array.isArray(z)) return entryProblems(z);
  if (z.length < 1 || z.length > 2) return [`zoom: a list holds 1 or 2 entries, not ${z.length}`];
  const out = z.flatMap((e, i) => entryProblems(e).map(t => `zoom[${i}]: ${t}`));
  for (const v of VIEWS) if (z.filter(e => e?.view === v).length > 1) out.push(`zoom: two entries for the ${v} view`);
  return out;
}
// F-ZOOM-2 (D-LIB17-ZOOMPAIR): a Mistake entry may carry `pair: [flat, turned]`, the same drawn vertex in world metres in
// the end pose and in the Mistake pose, for a fault that turns about a fixed tell anchor (the anchor itself never moves).
const isPoint = p => Array.isArray(p) && p.length === 3 && p.every(Number.isFinite);
function entryProblems(z) {
  const out = [];
  if (typeof z !== 'object' || z === null || Array.isArray(z)) return ['zoom must be { view, k }'];
  for (const k of Object.keys(z)) if (!['view', 'k', 'tell', 'pair'].includes(k)) out.push(`zoom: unknown key ${k}`);
  if (!VIEWS.includes(z.view)) out.push(`zoom.view ${JSON.stringify(z.view)} is not 'normal' or 'mistake'`);
  if (!(typeof z.k === 'number' && z.k >= ZOOM.kMin && z.k <= ZOOM.kMax)) out.push(`zoom.k ${JSON.stringify(z.k)} is outside ${ZOOM.kMin}-${ZOOM.kMax}`);
  if ('pair' in z) {
    const p = z.pair;
    if (z.view !== 'mistake') out.push(`zoom.pair is for a Mistake entry, not the ${z.view} view`);
    if (!(Array.isArray(p) && p.length === 2 && p.every(isPoint))) out.push('zoom.pair must be two points [x, y, z] of finite numbers');
    else if (p[0].every((v, i) => v === p[1][i])) out.push('zoom.pair: the two points are equal');
  }
  return out;
}

/** The fault the Mistake zoom shows: the tell (zoom.tell, else the one with the largest move) and its end and mistake
 *  points in plate px. The same measure as PQ-H3's deviation(). F-ZOOM-2: an entry with `pair` measures its two
 *  points instead (key zoom.tell, else 'pair') and reads no tell; with no pair the tell loop runs as before. */
export function faultOf(spec, cam, L) {
  const z = zoomFor(spec, 'mistake');
  if (z?.pair) {
    const a = cam.P(z.pair[0]), b = cam.P(z.pair[1]);
    return { key: z.tell ?? 'pair', end: a, mistake: b, d: Math.hypot(b[0] - a[0], b[1] - a[1]) };
  }
  let best = null;
  const tell = z?.tell;
  for (const t of spec.mistake?.tells ?? []) {
    if (tell && t.key !== tell) continue;
    const a = resolvePoint(anchorInPose(t.anchor, 'end'), 'end', L.lm, cam), b = resolvePoint(anchorInPose(t.anchor, 'mistake'), 'mistake', L.lm, cam);
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (!best || d > best.d) best = { key: t.key, end: a, mistake: b, d };
  }
  return best;
}

/** The trace point's path in plate px, sampled as the engine samples it (plate.mjs, spec.trace.samples). */
export function tracePath(spec, cam, E = ENGINE) {
  if (!spec.trace) return [];
  const { normPose, poseAt, fk, landmarks } = E.body, b = { height: spec.body?.height ?? 1.75 };
  const keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map(p => normPose(p, b)), n = spec.trace.samples ?? 48;
  return Array.from({ length: n + 1 }, (_, i) => cam.P(landmarks(fk(poseAt(keys, i / n, b).q, b))[spec.trace.point]));
}

const mid = ps => { const xs = ps.map(p => p[0]), ys = ps.map(p => p[1]); return [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2]; };
const segDist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };

/** The label boxes a view draws (its HTML overlay), in plate px: meta, callouts (with their 44 px hit box) and the arc
 *  label, from the engine's own layout metrics. */
export function labelBoxes(overlay) {
  const pc = s => +s * ZOOM.size / 100, out = [];
  for (const [, , attrs, inner] of overlay.matchAll(/<(span|button)\b([^>]*)>([\s\S]*?)<\/\1>/g)) {
    const cls = attrs.match(/\bclass="([^"]*)"/)?.[1] ?? '', pos = attrs.match(/\bstyle="left:([\d.]+)%;top:([\d.]+)%"/);
    if (!pos) continue;
    const left = pc(pos[1]), top = pc(pos[2]), kind = cls.split(/\s+/)[0];
    if (kind === 'plate-meta') out.push({ kind: 'meta', x0: left, y0: top, x1: left + metaWidth(inner), y1: top + 16 });
    else if (kind === 'plate-callout') { const b = inkBox(inner, left, top); out.push({ kind: 'callout', ...b, x0: left, x1: Math.max(left + 44, b.x1 + 6), y0: Math.min(top, b.y0), y1: Math.max(top + 44, b.y1) }); }
    else if (kind === 'plate-arc-label') { const [, title = '', value = ''] = inner.match(/<b>(.*?)<\/b><span>(.*)$/) ?? []; out.push({ kind: 'arc', ...arcBox(title, value, left, top) }); }
  }
  return out;
}
const rectHitsCircle = (b, c, r) => Math.hypot(Math.max(b.x0 - c[0], 0, c[0] - b.x1), Math.max(b.y0 - c[1], 0, c[1] - b.y1)) < r;

/** Leader polylines of a plate svg (M, L and a closing H, as LB1's leader test reads them). */
export function leadersOf(svg) {
  return [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => {
    const p = [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1], +m[2]]), h = /H(-?[\d.]+)$/.exec(d);
    if (h) p.push([+h[1], p[p.length - 1][1]]);
    return p;
  });
}
export const polyHitsCircle = (p, c, r) => p.slice(1).some((q, i) => segDist(c, p[i], q) < r);

/** Does the link (source ring edge to circle edge) pass within 2 px of label box b? */
export function linkHitsBox(F, C, rs, r, b) {
  const d = Math.hypot(C[0] - F[0], C[1] - F[1]), u = [(C[0] - F[0]) / d, (C[1] - F[1]) / d];
  for (let t = rs; t <= d - r; t += 1) { const x = F[0] + u[0] * t, y = F[1] + u[1] * t; if (x > b.x0 - 2 && x < b.x1 + 2 && y > b.y0 - 2 && y < b.y1 + 2) return true; }
  return false;
}

/** Is the disc (centre c, radius r) free of plate ink? Occupancy rows of 2 px across the disc. */
function discFree(occ, c, r) {
  for (let y = -r; y <= r; y += 2) { const w = Math.sqrt(Math.max(0, r * r - y * y)); if (occ.count(c[0] - w, c[1] + y - 1, c[0] + w, c[1] + y + 1) > 0) return false; }
  return true;
}

/**
 * The zoom of `spec` (its `zoom` field), placed and drawn. Returns { view, k, focus, circle: { c, r }, src: { c, r },
 * fault?, trace?, svg } or throws when no place passes the placement rules. `prefix`: the card's svg id prefix.
 */
export function zoomOf(spec, { prefix = 'p', E = ENGINE, view: which = null } = {}) {
  const bad = zoomFieldProblems(spec.zoom);
  if (bad.length) throw new Error(`${spec.id}: ${bad.join('; ')}`);
  const entry = which ? zoomFor(spec, which) : Array.isArray(spec.zoom) ? null : spec.zoom;
  if (!entry) throw new Error(`${spec.id}: no zoom entry${which ? ` for the ${which} view` : '; a zoom list needs a view'}`);
  const { view, k } = entry, m = view === 'mistake', vid = `${prefix}-${m ? 'm' : 'n'}`;
  const plate = E.renderPlate(spec, { id: vid, mistake: m }), c = plate.report.camera, cam = cameraOf(spec, plate.report);
  const fault = m ? faultOf(spec, cam, poseLandmarks(E, spec)) : null, trace = m ? null : tracePath(spec, cam, E);
  if (m && !fault) throw new Error(`${spec.id}: a Mistake zoom needs a tell`);
  if (!m && !trace.length) throw new Error(`${spec.id}: a normal zoom needs a trace`);
  const focus = m ? mid([fault.end, fault.mistake]) : mid(trace), { r, gap, margin, top, size } = ZOOM, rs = r / k;
  const labels = labelBoxes(plate.overlay), leaders = leadersOf(plate.svg);
  let C = null, best = Infinity;
  for (let cy = top + r; cy <= size - margin - r; cy += 2) for (let cx = margin + r; cx <= size - margin - r; cx += 2) {
    const d = Math.hypot(cx - focus[0], cy - focus[1]);
    if (d >= best || d < r + rs + gap) continue;
    const at = [cx, cy];
    if (!discFree(plate.occ, at, r + gap) || labels.some(b => rectHitsCircle(b, at, r + gap)) || leaders.some(p => polyHitsCircle(p, at, r + gap))) continue;
    if (labels.some(b => linkHitsBox(focus, at, rs, r, b))) continue;
    C = at; best = d;
  }
  if (!C) throw new Error(`${spec.id}: no place on the ${view} plate keeps the zoom clear of ink, labels and leaders`);
  // the magnified render: the same spec at k x the camera, the focus mapped to the circle centre; no labels, guides of
  // the plate's own layout (callouts, datum, measure) or checks; ghosts kept in the normal view (the motion)
  // (F-ZOOM-PITCH) the camera keeps the plate's pitch; its fit/maxScale stay out, since a fit would replace k x pxPerM
  const zs = { ...spec, camera: { ...(cam.pitch ? { pitch: cam.pitch } : {}), pxPerM: c.pxPerM * k, x0: C[0] - k * (focus[0] - c.x0), y0: C[1] - k * (focus[1] - c.y0) },
    callouts: [], datum: [], measure: undefined, checks: [], zoom: undefined,
    ...(m ? { ghosts: { count: 0 } } : {}), ...(spec.mistake ? { mistake: { ...spec.mistake, tells: [] } } : {}) };
  const inner = E.renderPlate(zs, { id: `${vid}-z`, mistake: m }).svg
    .replace(/^<svg class="plate-svg"[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect width="358" height="358" fill="url\(#[^)]*\)"\/>/, '');
  const clip = `${vid}-zclip`, u = [(C[0] - focus[0]) / best, (C[1] - focus[1]) / best];
  // one link along the centre line, source ring edge to circle edge: the two read as one pair
  const link = `M${f(focus[0] + u[0] * rs)} ${f(focus[1] + u[1] * rs)}L${f(C[0] - u[0] * r)} ${f(C[1] - u[1] * r)}`;
  const svg = `<g class="plate-zoom" data-view="${view}" data-k="${k}" data-c="${f(C[0])} ${f(C[1])}" data-src="${f(focus[0])} ${f(focus[1])}">`
    + `<defs><clipPath id="${clip}"><circle cx="${f(C[0])}" cy="${f(C[1])}" r="${r}"/></clipPath></defs>`
    + `<circle class="pz-src" cx="${f(focus[0])}" cy="${f(focus[1])}" r="${f(rs)}"/>`
    + `<path class="pz-link" d="${link}"/>`
    + `<circle class="pz-bg" cx="${f(C[0])}" cy="${f(C[1])}" r="${r}"/>`
    + `<g class="pz-in" clip-path="url(#${clip})">${inner}</g>`
    + `<circle class="pz-ring" cx="${f(C[0])}" cy="${f(C[1])}" r="${r}"/></g>`;
  return { view, k, focus, circle: { c: C, r }, src: { c: focus, r: rs }, link, fault, trace, svg };
}

/** The zoom classes, on the page's own theme tokens (the ring draws as ink: H5 holds it to the ink floor). */
export const ZOOM_CSS = '.plate .pz-bg { fill: var(--surface-2); }\n.plate .pz-ring { fill: none; stroke: var(--text-2); stroke-width: 1.25; }\n.plate .pz-src { fill: none; stroke: var(--text-2); stroke-width: 1; stroke-dasharray: 2 2; }\n.plate .pz-link { fill: none; stroke: var(--text-2); stroke-width: .75; stroke-dasharray: 2 2; }\n';

/**
 * A built plates page with each zoom spec's circle added to its view's svg, and the zoom CSS once. `specs`:
 * { cardId: absolute spec path } (build-page config.specs). No zoom spec: the same Buffer back, byte for byte.
 */
export async function applyZooms(html, specs = {}) {
  const zoomed = [];
  for (const [id, p] of Object.entries(specs)) {
    const spec = (await import(pathToFileURL(p).href)).default;
    if (spec?.zoom != null) zoomed.push([id.replace(/_/g, '-'), spec]);
  }
  if (!zoomed.length) return html;
  let s = html.toString('utf8');
  for (const [chrome, spec] of zoomed) for (const { view } of zoomList(spec.zoom)) {
    const z = zoomOf(spec, { prefix: chrome, view });
    const fit = s.indexOf(`<div class="plate-fit" id="${chrome}-plate">`);
    const fig = s.indexOf(`<figure class="plate" data-mode="${z.view}"`, fit), end = s.indexOf('</svg>', fig);
    if (fit < 0 || fig < 0 || end < 0) throw new Error(`zoom: ${chrome}: no ${z.view} plate on the page`);
    s = s.slice(0, end) + z.svg + s.slice(end);
  }
  const st = s.indexOf('<style>');
  if (st < 0 || s.indexOf('<style>', st + 1) >= 0) throw new Error('zoom: the page must have exactly one <style>');
  s = s.slice(0, st + 7) + ZOOM_CSS + s.slice(st + 7);
  return Buffer.from(s, 'utf8');
}

/** The zoom group of a plate svg, or null; and the svg without it (what the plate-scale checks read). */
export function splitZoom(svg) {
  const i = svg.indexOf('<g class="plate-zoom"');
  if (i < 0) return { svg, zoom: null };
  const j = svg.lastIndexOf('</svg>');
  return { svg: svg.slice(0, i) + svg.slice(j), zoom: svg.slice(i, j) };
}

/** An extractPlates() plate with each view's zoom group moved out of its svg into `zoom: { normal, mistake }` (null
 *  where a view has none), so the plate-scale checks read the engine plate alone. */
export function plateZooms(p) {
  const n = splitZoom(p.normal.svg), m = splitZoom(p.mistake.svg);
  return { ...p, normal: { ...p.normal, svg: n.svg }, mistake: { ...p.mistake, svg: m.svg }, zoom: { normal: n.zoom, mistake: m.zoom } };
}
