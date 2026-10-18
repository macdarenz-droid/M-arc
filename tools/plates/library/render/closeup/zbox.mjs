// LIB-6 zbox shell (plan 2.6): the boxed close-up sheet of golden B's exercises/*.howto-render.mjs family, data-driven.
// One shared frame (chip row, zoom section, Right/Wrong crop pair, captions, hand box, feel link, CSS base); everything
// an exercise does differently is a named option (closeup/zbox-options.mjs) choosing entries from the registries in
// zbox-geometry.mjs (camera, still, guide kinds), zbox-hand.mjs (hand edit steps) and zbox-css.mjs (rule blocks).
// Returns the API the vendored artifact/howto-layers.mjs reads: { zoomSection, chipRow, ZCSS, howto, PAGES }.
import { renderPlate, landmarksOf } from '../../../layers/engine/index.mjs';
import { CAMERAS, STILLS, GUIDES, f } from './zbox-geometry.mjs';
import { handZoom } from './zbox-hand.mjs';
import { zboxCss } from './zbox-css.mjs';

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ---------------------------------------------------------------- icons (the sheet's check / x paths) ---------- */
const ic = (d, s, cls = '') => `<svg class="${cls}" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${f(1.5 * 24 / s)}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const I = {
  check: (s, c) => ic('<path d="M5 12l4 4L19 7"/>', s, c), x: (s, c) => ic('<path d="M6 6l12 12M18 6L6 18"/>', s, c),
  back: s => ic('<path d="M15 5l-7 7 7 7"/>', s), chev: (s, c) => ic('<path d="M9 5l7 7-7 7"/>', s, c),
};
const iconCheck = (x, y, sz, cls) => `<path class="${cls} ok" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M5 12l4 4L19 7"/>`;
const iconCross = (x, y, sz, cls) => `<path class="${cls} no" transform="translate(${f(x)} ${f(y)}) scale(${f(sz / 24)})" d="M6 6l12 12M18 6L6 18"/>`;

/** Text lines that can follow the grip line under a hand zoom (options.handLines), each skipped when empty. */
export const HAND_LINES = {
  'hand-note': (zoom, howto) => zoom.hand.note,                      // a one-line note in the zoom's hand spec
  'handle-choice': (zoom, howto) => howto.handling.handleChoice?.sore,   // the "sore wrist? use ..." handle choice
};

const pick = (reg, what, name) => { const v = reg[name]; if (!v) throw new Error(`zbox: unknown ${what} ${name}`); return v; };

export function zboxApi(mod, options) {
  const howto = mod.default, plateSpec = howto.plate, stills = mod.stills, H = options.bodyHeight;
  const REF = pick(CAMERAS, 'camera', options.camera.kind)(plateSpec, options.camera);
  const P = w => [REF.x0 + w[2] * REF.pxPerM, REF.y0 - w[1] * REF.pxPerM];
  const ctx = { mod, howto, plateSpec, stills, H, REF, P };
  ctx.stillSpec = pick(STILLS, 'still', options.still.kind)(ctx, options.still);
  ctx.lmOf = still => landmarksOf(ctx.stillSpec(still).poses.end, H);
  const stillOf = side => (side === 'start' || side === 'end') ? stills[side] : stills[side.still];
  const refPt = (ref, still) => { const [x, y] = P(ctx.lmOf(still)[ref.landmark]); return [x + (ref.dx ?? 0), y + (ref.dy ?? 0)]; };
  const guide = (name, still, role) => {
    const g = options.guides[name];
    if (!g) throw new Error(`zbox: ${howto.id}: no guide option for ${name}`);
    return pick(GUIDES, 'guide kind', g.kind)(ctx, still, role, g);
  };

  // One crop panel: the plate still in a nested svg (smaller viewBox = a real crop, strokes kept at plate weight), its
  // clear frame, and the one mark the callout points at. `over` (data): draw that still solid and this one over it as
  // the plate's dashed mistake pose. The right pose sets the window for both halves.
  function cropPanel(zoom, side, { x, y, S, uid }) {
    const still = stillOf(zoom[side]), over = zoom[side].over;
    const spec = over ? { ...ctx.stillSpec(stills[over]), mistake: { pose: still.pose, guides: [], tells: [] } } : ctx.stillSpec(still);
    const plate = renderPlate(spec, { id: `${uid}`, mistake: !!over });
    const inner = plate.svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect width="358" height="358" fill="url\([^)]*\)"\/>/, '');
    const crop = zoom.crop, c = refPt(crop.center, stills[zoom.right]);
    const s = crop.sizePx, vx = c[0] - s / 2, vy = c[1] - s / 2;
    const svg = guide(zoom.callouts[side].guide, still, side);
    const clip = `${uid}-clip`;
    return `<defs><clipPath id="${clip}"><rect x="${f(x)}" y="${f(y)}" width="${S}" height="${S}" rx="10"/></clipPath></defs>`
      + `<g clip-path="url(#${clip})"><rect class="hz-crop-bg" x="${f(x)}" y="${f(y)}" width="${S}" height="${S}"/>`
      + `<svg x="${f(x)}" y="${f(y)}" width="${S}" height="${S}" viewBox="${f(vx)} ${f(vy)} ${s} ${s}" overflow="hidden"><g class="plate hz-crop">${inner}${svg}</g></svg></g>`
      + `<rect class="hz-frame" x="${f(x)}" y="${f(y)}" width="${S}" height="${S}" rx="10"/>`;
  }
  // Right and Wrong, each with its callout printed under the word, then the two crops (each half its own image).
  function postureZoomSvg(zoom) {
    const W = 358, gap = 16, S = (W - gap) / 2, top = 70, Ht = top + S + 2;
    const head = (x, ok, note) => (ok ? iconCheck(x, 11, 18, 'h-icon') : iconCross(x, 11, 18, 'h-icon')) + `<text class="h-head" x="${f(x + 23)}" y="25">${ok ? 'Right' : 'Wrong'}</text>`
      + `<text class="h-note${ok ? ' ok' : ' m'}" x="${f(x + 23)}" y="42">${esc(note.toUpperCase())}</text>`;
    const aria = `${zoom.heading}. Right: ${zoom.alt.right} Wrong: ${zoom.alt.wrong}`;
    return `<svg class="hand-svg hz-svg" viewBox="0 0 ${W} ${Ht}" role="img" aria-label="${esc(aria)}" xmlns="http://www.w3.org/2000/svg">`
      + head(4, true, zoom.callouts.right.text) + head(S + gap + 4, false, zoom.callouts.wrong.text)
      + `<g class="zx-half right">${cropPanel(zoom, 'right', { x: 0, y: top - 14, S, uid: `${zoom.key}-r` })}</g>`
      + `<g class="zx-half wrong">${cropPanel(zoom, 'wrong', { x: S + gap, y: top - 14, S, uid: `${zoom.key}-w` })}</g>` + `</svg>`;
  }

  const chipRow = active => `<div class="hsec"><span class="eyebrow">Look closer</span><div class="chips" role="group" aria-label="Look closer">`
    + [...howto.zooms.map(z => [z.key, z.chip]), ['feel', 'Where to feel it']].map(([k, t]) => `<button class="chip" aria-pressed="${k === active}">${esc(t)}</button>`).join('') + `</div></div>`;
  const rowOf = k => howto.feel.rows.find(r => r.key === k);
  function zoomSection(zoom) {
    let box;
    if (zoom.kind === 'hand') { const h = handZoom(zoom, howto, options.hand, esc, I); box = `<div class="zbox hand">${h.main}${h.inset}</div>`; }
    else box = `<div class="zbox">${postureZoomSvg(zoom)}</div>`;
    const caps = `<div class="caps"><p class="ok">${I.check(16)}<span>${esc(zoom.caption.right)}</span></p><p class="no">${I.x(16)}<span>${esc(zoom.caption.wrong)}</span></p></div>`;
    const extra = zoom.kind === 'hand' ? `<p class="gripline">${esc(howto.handling.gripLine)}</p>`
      + (options.handLines ?? []).map(n => pick(HAND_LINES, 'hand line', n)(zoom, howto)).filter(Boolean).map(t => `<p class="sore">${esc(t)}</p>`).join('') : '';
    const row = zoom.feelRow ? rowOf(zoom.feelRow) : null;
    const link = row ? `<button class="feellink"><span class="grow"><span class="eyebrow">If you feel it in</span><b>${esc(row.where)}</b></span><span class="why">This is usually why</span>${I.chev(16, 'why')}</button>` : '';
    return `${chipRow(zoom.key)}<section class="hsec" role="region" aria-labelledby="zh-${zoom.key}"><div class="ztop"><button class="btn-back">${I.back(18)} Plate</button><h3 id="zh-${zoom.key}">${esc(zoom.heading)}</h3></div>${box}${caps}${extra}${link}</section>`;
  }

  return { zoomSection, chipRow, ZCSS: zboxCss(options.css), howto, PAGES: undefined };
}
