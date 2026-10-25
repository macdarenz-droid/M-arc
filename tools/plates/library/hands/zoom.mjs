// LIB-7 hand zoom (hands/DESIGN.md §1): the hand close-up page of a library id, drawn through pairs.mjs renderPair, with
// LIB-6's page helpers (closeup/common.mjs). The same markup as LIB-6's 'paged' and 'single' layouts: one Right/Wrong
// page per fault, and a pager when there are two or more. LIB-6's closeup/hand.mjs is not used or edited (the 8 keep it).
//   z: { key, heading, caption: { <fault>: { right, wrong } }, feelPrompt? }   h: { gripLine?, limitText? }
import { captions, esc, feelLink, pagerOf, zoomTop } from '../render/closeup/common.mjs';
import { renderPair, pairSpec } from './pairs.mjs';

export function pairZoom(id, z, h = {}, o = {}) {
  const s = pairSpec(id, o.index);
  const PAGES = s.wrong.length > 1 ? s.wrong.map(w => ({ key: w.key, label: w.label })) : undefined;
  const pager = PAGES ? pagerOf(PAGES) : () => '';
  const tail = (h.gripLine ? `\n  <p class="grip-line">${esc(h.gripLine)}</p>` : '') + (h.limitText ? `\n  <p class="hint limit">${esc(h.limitText)}</p>` : '');
  const uid = o.uid ?? `${id.replace(/_/g, '-')}-hand`;
  return { PAGES, handZoom(page = s.wrong[0].key) {
    const F = s.wrong.find(w => w.key === page);
    if (!F) throw new Error(`hand zoom ${id}: no page ${page}`);
    const cap = z.caption?.[F.key];
    if (!cap) throw new Error(`hand zoom ${id}: no caption for ${F.key}`);
    const { svg } = renderPair(id, { uid: PAGES ? `${uid}-${F.key}` : uid, fault: F.key, panelHeight: o.panelHeight, index: o.index });
    return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}<div class="hand-plate">${svg}</div>${captions(cap)}${pager(page)}${feelLink(z)}</section>${tail}`;
  } };
}
