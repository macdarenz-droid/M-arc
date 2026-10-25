// LIB-6: the zoom sheet's CSS (golden B's howto/render-*.mjs `CSS`), one stylesheet with named rule groups, so the
// text equals each golden-B script's byte for byte. The page builder strips the shared engine blocks and the page-level
// rules, and scopes the rest to the card (artifact/howto-layers.mjs rendererCss). Rule groups (`css` options):
//   e1          - the first sheet's edition (lateral raise): its comments, `p` rule and split feel-section rule;
//   endOnInset, inset - the end-on inset styles; thumb 'subgrid' | 'plain' - the pager and thumb-page rules;
//   thumbMark   - the thumb leader label, orientation row and value halo; levelNeutral - the neutral level line;
//   outlines    - outline and camera-label rules; cap, path, spine, pelvis - the zoom-only guide kinds;
//   swPain 'showme' | 'redFlag' - the pain swatch, after the show-me or after the red-flag rules.
import { readFileSync } from 'node:fs';
import { allThemesCss } from '../../../layers/engine/themes.mjs';
import { PLATE_CSS } from '../../../layers/engine/plate.mjs';
import { HAND_CSS } from '../../../layers/engine/hand.mjs';
import { FEEL_CSS } from '../../../layers/engine/feelmap.mjs';
import { END_ON_CSS } from '../../../layers/howto/end-on-inset.mjs';
import { PANEL, PH } from './crop.mjs';

const ENGINE = new URL('../../../layers/engine/', import.meta.url);
const FONT = `data:font/woff2;base64,${readFileSync(new URL('inter-latin-wght-normal.woff2', ENGINE)).toString('base64')}`;
const TOKENS = readFileSync(new URL('tokens.css', ENGINE), 'utf8');

export const zoomCss = o => `
@font-face { font-family: 'Inter Variable'; src: url('${FONT}') format('woff2-variations'); font-weight: 100 900; font-display: block; }
${TOKENS}
${allThemesCss()}
${PLATE_CSS}
${HAND_CSS}
${o.endOnInset ? `${END_ON_CSS}
` : ''}${FEEL_CSS}
*,*::before,*::after { box-sizing: border-box; }
html, body { margin: 0; background: var(--surface-2); color: var(--text); font-family: var(--font); -webkit-font-smoothing: antialiased; }
body { width: 390px; padding: 16px; }
button { font: inherit; color: inherit; background: none; border: 0; padding: 0; cursor: pointer; }
${!o.e1 ? `p, figure { margin: 0; }
` : ''}${o.e1 ? `p { margin: 0; }
` : ''}.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.eyebrow { font-size: var(--fs-cap); line-height: var(--lh-cap); letter-spacing: var(--ls-cap); text-transform: uppercase; font-weight: var(--fw-semibold); color: var(--text-2); margin: 0; }
.hint { font-size: var(--fs-meta); line-height: var(--lh-meta); color: var(--text-2); }
${o.e1 ? `/* chips: 44 px targets */
` : ''}.zoom-chips-head { margin-bottom: var(--sp-2); }
.zoom-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: var(--sp-3); }
.zoom-chip { min-height: 44px; padding: 0 14px; border-radius: var(--radius-pill); border: 1px solid var(--border); color: var(--text-2); font-size: var(--fs-small); font-weight: var(--fw-medium); }
.zoom-chip[aria-pressed="true"] { background: var(--accent-soft); border-color: transparent; color: var(--accent-text); }
${o.e1 ? `/* the plate box in zoom state */
` : ''}.zoom { border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); background: var(--surface-2); overflow: hidden; }
.zoom .hand-plate { border: 0; border-radius: 0; }
${o.inset ? `.zoom .hand-plate.inset { border-top: 1px solid var(--border-subtle); }
` : ''}.zoom-top { display: flex; align-items: center; gap: 4px; padding: 0 12px 0 4px; border-bottom: 1px solid var(--border-subtle); }
.zoom-back { display: inline-flex; align-items: center; gap: 2px; min-height: 44px; min-width: 44px; padding: 0 8px 0 4px; color: var(--accent-text); font-size: var(--fs-small); font-weight: var(--fw-medium); }
.zoom-heading { margin: 0; font-size: var(--fs-small); font-weight: var(--fw-semibold); color: var(--text); }
.zoom-caps { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 0 10px 12px; font-size: var(--fs-meta); line-height: var(--lh-meta); color: var(--text-2); }
${o.thumb ? `.pager { display: flex; gap: 6px; padding: 0 10px 10px; }
` : ''}${o.thumb ? `.pager-btn { flex: 1; min-height: 44px; border-radius: var(--radius-pill); border: 1px solid var(--border-subtle); color: var(--text-2); font-size: var(--fs-meta); font-weight: var(--fw-medium); }
` : ''}${o.thumb ? `.pager-btn[aria-selected="true"] { border-color: var(--border); color: var(--text); background: var(--surface-3); }
` : ''}${o.thumb ? `.th-cam { text-align: center; padding: 14px 0 4px; }
` : ''}${o.thumb ? `.th-grid { display: grid; grid-template-columns: ${171}px ${171}px; gap: 12px 14px; justify-content: center; padding: 6px 0 10px; }
` : ''}${o.thumb === 'subgrid' ? `.th-cell { display: grid; gap: 0; grid-row: span 2; grid-template-rows: subgrid; }   /* captions of one row share a height */
` : ''}${o.thumb === 'subgrid' ? `.th-cell figcaption { display: grid; gap: 1px; align-content: start; min-height: 36px; padding: 0 4px; }
` : ''}${o.thumb === 'plain' ? `.th-cell { display: grid; gap: 0; }
` : ''}${o.thumb === 'plain' ? `.th-cell figcaption { display: grid; gap: 1px; min-height: 36px; padding: 0 4px; }
` : ''}${o.thumb ? `.th-title { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-small); font-weight: var(--fw-semibold); color: var(--text); }
` : ''}${o.thumb ? `.th-title svg { color: var(--accent); flex: none; }
` : ''}${o.thumb ? `.th-note { font-size: var(--fs-meta); line-height: var(--lh-meta); color: var(--text-2); }
` : ''}${o.thumb ? `.th-cell.def .th-note { color: var(--accent-text); }
` : ''}${o.thumb === 'subgrid' ? `.th-cell.risk .th-note { color: var(--mistake); }
` : ''}${o.thumb === 'subgrid' ? `/* thumb page: the page is about the thumb, so the thumb gets the heaviest line (5.1) */
` : ''}${o.thumb === 'subgrid' ? `.th-cell .hand-svg .h-thumb .u-stroke use { stroke: var(--text); stroke-width: 2.5; }
` : ''}${o.thumb === 'subgrid' ? `.hand-svg .h-base { fill: none; stroke: var(--text-3); stroke-width: 1; stroke-dasharray: 2 2.5; stroke-linecap: round; }
` : ''}${o.thumb === 'subgrid' ? `.hand-svg .h-base-t { font-size: 9px; font-weight: var(--fw-semibold); letter-spacing: var(--ls-cap); fill: var(--text-3); }
` : ''}${o.thumb ? `.th-cell .hand-svg { border-radius: 10px; border: 1px solid var(--border-subtle); }
` : ''}${o.thumbMark ? `/* lat_pulldown fixer: the thumb reads first (--text outline on every hand here), a small leader label on the thumb page,
` : ''}${o.thumbMark ? `   the orientation row under the camera label, a surface halo under angle values */
` : ''}${o.thumbMark ? `.hand-svg .h-thumb .u-stroke use { stroke: var(--text); }
` : ''}${o.thumbMark ? `.th-mark path { fill: none; stroke: var(--text-3); stroke-width: .75; }
` : ''}${o.thumbMark ? `.th-mark circle { fill: var(--text); }
` : ''}${o.thumbMark ? `.th-mark text, .hand-svg .h-orient text { font-family: var(--font); font-size: var(--fs-cap); letter-spacing: var(--ls-cap); font-weight: var(--fw-semibold); fill: var(--text-3); }
` : ''}${o.thumbMark ? `.th-mark text { fill: var(--text-2); }
` : ''}${o.thumbMark ? `.hand-svg .h-orient path { fill: none; stroke: var(--text-3); stroke-width: 1; stroke-linecap: round; stroke-linejoin: round; }
` : ''}${o.thumbMark ? `.hand-svg .h-val { paint-order: stroke; stroke: var(--surface-2); stroke-width: 3px; stroke-linejoin: round; }
` : ''}.z-pair { display: grid; grid-template-columns: ${PANEL}px ${PANEL}px; gap: 14px; justify-content: center; padding: 12px 0 10px; }
.z-head { display: flex; align-items: center; gap: 5px; height: 26px; font-size: var(--fs-small); }
.z-head b { font-weight: var(--fw-semibold); color: var(--text); }
.z-sub { margin: -4px 0 6px 23px; font-size: var(--fs-cap); line-height: var(--lh-cap); letter-spacing: var(--ls-cap); font-weight: var(--fw-semibold); white-space: nowrap; } .z-sub.ok { color: var(--accent-text); } .z-sub.m { color: var(--mistake); }
.z-head.ok svg { color: var(--accent); } .z-head.m svg { color: var(--mistake); }
.plate.z-wrap { width: ${PANEL}px; height: ${PH}px; aspect-ratio: auto; border: 0; border-radius: 0; background: none; overflow: visible; }
.z-crop { display: block; width: ${PANEL}px; height: ${PH}px; }
.z-crop .z-frame { fill: none; stroke: var(--border); stroke-width: 1; }
.z-crop .z-plate path, .z-crop .z-plate use, .z-crop .z-plate circle, .z-crop .z-plate rect { vector-effect: non-scaling-stroke; }
.z-crop defs path { vector-effect: non-scaling-stroke; }
${o.levelNeutral ? `.z-level { fill: none; stroke-width: 1; stroke-dasharray: 3 3; } .z-level.ok { stroke: var(--accent); } .z-level.m { stroke: var(--text-3); } .z-level.n { stroke: var(--text-3); stroke-dasharray: 1 3; }
` : ''}${!o.levelNeutral ? `.z-level { fill: none; stroke-width: 1; stroke-dasharray: 3 3; } .z-level.ok { stroke: var(--accent); } .z-level.m { stroke: var(--text-3); }
` : ''}${o.outlines ? `.z-ol { fill: none; stroke-width: 1.25; stroke-linejoin: round; stroke-linecap: round; } .z-ol.ridge { stroke-width: .9; }
` : ''}${o.outlines ? `.z-ol.ok { stroke: var(--accent); } .z-ol.m { stroke: var(--mistake); stroke-dasharray: 3 2; }
` : ''}${o.outlines ? `.z-cam { padding: 12px 0 0; } .z-pair.has-cam { padding-top: 6px; }
` : ''}${o.cap ? `.z-cap { fill: none; stroke: var(--mistake); stroke-width: 1.25; stroke-dasharray: 3 2.5; }
` : ''}${o.path ? `.z-path { fill: none; stroke-width: 1.5; stroke-dasharray: 4 3; stroke-linecap: round; } .z-path.ok { stroke: var(--accent); } .z-path.m { stroke: var(--mistake); }
` : ''}${o.path ? `.z-path-head { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; } .z-path-head.ok { stroke: var(--accent); } .z-path-head.m { stroke: var(--mistake); }
` : ''}${o.spine ? `.z-spine { fill: none; stroke-width: 1.25; stroke-dasharray: 4 3; stroke-linecap: round; } .z-spine.ok { stroke: var(--accent); } .z-spine.m { stroke: var(--text-3); }
` : ''}${!o.e1 ? `.z-drop { fill: none; stroke: var(--mistake); stroke-width: 1.5; stroke-linecap: round; } .z-drop-head { fill: var(--mistake); }
` : ''}.z-leader { fill: none; stroke-width: .75; } .z-leader.ok { stroke: var(--accent); } .z-leader.m { stroke: var(--mistake); }
.z-anchor.ok { fill: var(--accent); } .z-anchor.m { fill: var(--mistake); }
.z-callout { font-family: var(--font); font-size: var(--fs-cap); letter-spacing: var(--ls-cap); font-weight: var(--fw-semibold); }
.z-callout.ok { fill: var(--accent-text); } .z-callout.m { fill: var(--mistake); }
${o.pelvis ? `.z-pelvis .z-vert { stroke: var(--text-2); stroke-width: 1; stroke-dasharray: 3 3; fill: none; }
` : ''}${o.pelvis ? `.z-pelvis .z-bowl, .z-pelvis .z-rim { fill: none; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
` : ''}${o.pelvis ? `.z-pelvis.ok .z-bowl, .z-pelvis.ok .z-rim { stroke: var(--accent); } .z-pelvis.m .z-bowl, .z-pelvis.m .z-rim { stroke: var(--mistake); }
` : ''}.z-feelrow { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 44px; padding: 0 12px; border-top: 1px solid var(--border-subtle); text-align: left; font-size: var(--fs-meta); color: var(--accent-text); }
.grip-line { margin-top: var(--sp-3); font-size: var(--fs-body); line-height: var(--lh-body); color: var(--text); }
.limit { margin-top: var(--sp-2); }
${o.e1 ? `/* feel section */
` : ''}${!o.e1 ? `.feel-section { display: grid; gap: var(--sp-3); --feel-map-h: 250px; }
` : ''}${o.e1 ? `.feel-section { display: grid; gap: var(--sp-3); }
` : ''}${o.e1 ? `.feel-section { --feel-map-h: 250px; }
` : ''}.feel-line { font-size: var(--fs-body); line-height: var(--lh-body); color: var(--text); }
.eyebrow.sub { margin-top: var(--sp-1); }
.feel-rows { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--border-subtle); }
.feel-row { border-bottom: 1px solid var(--border-subtle); }
.feel-row-btn { display: flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%; min-height: 48px; text-align: left; font-size: var(--fs-body); color: var(--text); }
.feel-row-btn svg { color: var(--text-3); flex: none; }
.feel-row-body { display: grid; gap: var(--sp-2); padding: 0 0 var(--sp-3); font-size: var(--fs-small); line-height: var(--lh-body); color: var(--text); }
.feel-row-body b { display: block; font-size: var(--fs-cap); line-height: var(--lh-cap); letter-spacing: var(--ls-cap); text-transform: uppercase; font-weight: var(--fw-semibold); color: var(--text-2); margin-bottom: 2px; }
.feel-showme { display: inline-flex; align-items: center; gap: 2px; min-height: 44px; color: var(--accent-text); font-size: var(--fs-small); font-weight: var(--fw-medium); justify-self: start; }
${o.swPain === 'showme' ? `.feel-sw.sw-pain rect { fill: color-mix(in srgb, var(--mistake) 20%, transparent); stroke: var(--mistake); stroke-width: 1.2; }
` : ''}.red-flag { display: flex; gap: 8px; padding: 10px 12px; border-radius: var(--radius-md, 10px); border: 1px solid var(--border); color: var(--text-2); font-size: var(--fs-meta); line-height: var(--lh-meta); }
.red-flag svg { color: var(--text-2); flex: none; margin-top: 2px; }
.red-flag div { display: grid; gap: 4px; }
${o.swPain === 'redFlag' ? `.feel-sw.sw-pain rect { fill: color-mix(in srgb, var(--mistake) 20%, transparent); stroke: var(--mistake); stroke-width: 1.2; }
` : ''}.feel-more { min-height: 44px; padding: 0 16px; border-radius: var(--radius-pill); border: 1px solid var(--border); color: var(--text-2); font-size: var(--fs-small); font-weight: var(--fw-medium); justify-self: start; }
`;
