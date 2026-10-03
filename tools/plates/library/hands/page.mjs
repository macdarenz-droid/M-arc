// LIB-7: a standalone page for hand pairs (pilot sheet, gate block): golden B's own zoom-sheet CSS (LIB-6 zoomCss, which
// carries the font, tokens, the 5 themes and HAND_CSS), so a pair is styled exactly as an approved close-up is.
import { zoomCss } from '../render/closeup/zoom-css.mjs';
import { THEME_IDS } from '../../layers/engine/themes.mjs';
import { pairZoom } from './zoom.mjs';
import { INDEX, pairSpec } from './pairs.mjs';

export { THEME_IDS };
export const CSS = zoomCss({ thumb: 'plain' });
export const pageHtml = (body, theme, { width = 390, css = CSS } = {}) => `<!doctype html><html lang="en" data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=${width}">
<style>${css}
*,*::before,*::after{box-sizing:border-box} html,body{margin:0;background:var(--surface-2);color:var(--text);font-family:var(--font);-webkit-font-smoothing:antialiased}
body{width:${width}px;padding:16px}</style></head><body>${body}</body></html>`;

/** The zoom texts of a drawn id for sheets and the gate: the pair's own alt texts as captions (the LB card supplies the real ones). */
export function zoomTextsOf(id, index = INDEX) {
  const s = pairSpec(id, index);
  return { key: `${id}-hand`, heading: 'Hand', caption: Object.fromEntries(s.wrong.map(w => [w.key, { right: s.altRight, wrong: w.alt }])) };
}
/** Every page of every drawn id as zoom sections: [{ id, page, html }]. */
export function allZooms(index = INDEX) {
  const out = [];
  for (const id of index.drawn.keys()) {
    const z = pairZoom(id, zoomTextsOf(id, index), {}, { index });
    for (const w of pairSpec(id, index).wrong) out.push({ id, page: w.key, html: z.handZoom(w.key) });
  }
  return out;
}
