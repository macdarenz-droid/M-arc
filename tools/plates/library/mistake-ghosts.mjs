// D-HELD6-MGHOST (#368 6569943739; panel mx25 R5): an opt-in spec field `mistakeGhosts: false` leaves the motion's
// start pose and its ghosts out of the Mistake view, so nothing of the bottom pose crosses the red fault strokes or the
// zoom's source ring. The vendor engine draws `pose-start` and the `ghost` groups in every view and its ghost fields are
// global, so this is a library post-step on the Mistake svg (the crop.mjs dropEl form), never an engine edit. One
// function, three callers: the page build (build-page.mjs, before applyZooms), the node QA render of the Mistake view
// (qa/node.mjs rendersOf) and the zoom renders (zoom/inline.mjs zoomOf), so every reader sees the same svg. Ghost
// equipment and phantoms go through the spec's own `ctx.mistake` (ruled). A spec without the field, and every normal
// view, keep their bytes.

import { pathToFileURL } from 'node:url';

/** True when the spec asks for a Mistake view without the start pose and ghosts. */
export const mistakeGhostsOff = spec => spec?.mistakeGhosts === false;

/** `svg` without every `<tag class="cls…">` element (nested elements of the same tag counted). */
function dropEl(svg, tag, cls) {
  const re = new RegExp(`<${tag} class="${cls}[^"]*"[^>]*?(/?)>`, 'g');
  let out = '', i = 0, m;
  while ((m = re.exec(svg))) {
    out += svg.slice(i, m.index);
    if (m[1] === '/') { i = re.lastIndex; continue; }
    let depth = 1, j = re.lastIndex;
    const tagRe = new RegExp(`<${tag}\\b[^>]*?(/?)>|</${tag}>`, 'g'); tagRe.lastIndex = j;
    let t;
    while (depth && (t = tagRe.exec(svg))) { if (t[0].startsWith('</')) depth--; else if (t[1] !== '/') depth++; j = tagRe.lastIndex; }
    if (depth) throw new Error(`mistakeGhosts: unclosed <${tag} class="${cls}">`);
    i = j; re.lastIndex = j;
  }
  return out + svg.slice(i);
}

/** A Mistake view's svg with the start pose and the ghosts removed; the svg as is when the spec has no field. */
export function mistakeSvg(spec, svg) {
  if (!mistakeGhostsOff(spec)) return svg;
  const out = dropEl(dropEl(svg, 'g', 'pose-start'), 'g', 'ghost');
  if (/<g class="(pose-start|ghost)\b/.test(out)) throw new Error(`${spec.id}: a start or ghost group left in the Mistake view`);
  return out;
}

/** A renderPlate result of the Mistake view with mistakeSvg applied (report, overlay and occupancy kept). */
export const mistakePlate = (spec, plate) => (mistakeGhostsOff(spec) ? { ...plate, svg: mistakeSvg(spec, plate.svg) } : plate);

/**
 * A built plates page with each opted-in spec's Mistake svg passed through mistakeSvg. `specs`: { cardId: absolute
 * spec path } (build-page config.specs). Runs before applyZooms, so a zoom's own render is handled by zoomOf. No
 * opted-in spec: the same Buffer back, byte for byte.
 */
export async function applyMistakeGhosts(html, specs = {}, load = async p => (await import(pathToFileURL(p).href)).default) {
  const on = [];
  for (const [id, p] of Object.entries(specs)) { const spec = await load(p); if (mistakeGhostsOff(spec)) on.push([id.replace(/_/g, '-'), spec]); }
  if (!on.length) return html;
  let s = html.toString('utf8');
  for (const [chrome, spec] of on) {
    const fit = s.indexOf(`<div class="plate-fit" id="${chrome}-plate">`);
    const fig = s.indexOf('<figure class="plate" data-mode="mistake"', fit), st = s.indexOf('<svg', fig), end = s.indexOf('</svg>', st);
    if (fit < 0 || fig < 0 || st < 0 || end < 0) throw new Error(`mistakeGhosts: ${chrome}: no Mistake plate on the page`);
    s = s.slice(0, st) + mistakeSvg(spec, s.slice(st, end)) + s.slice(end);
  }
  return Buffer.from(s, 'utf8');
}
