// LIB-6: the pieces every How-to zoom sheet shares (golden B's howto/render-*.mjs, identical in all 5 scripts):
// icons, the close-up head, captions, the feel link, the hand pager, the pose merges and the chip row.
export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const f = v => +v.toFixed(2);

export const icon = (d, s = 18) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
export const I = { back: s => icon('<path d="M15 18l-6-6 6-6"/>', s), chev: s => icon('<path d="M9 6l6 6-6 6"/>', s), down: s => icon('<path d="M6 9l6 6 6-6"/>', s),
  check: s => icon('<path d="M5 12l4 4L19 7"/>', s), x: s => icon('<path d="M6 6l12 12M18 6L6 18"/>', s), alert: s => icon('<path d="M12 8v5M12 16.5v.5"/><path d="M10.3 3.9 2.4 17.5a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/>', s) };

export const CHIP_ARIA = { feel: 'Where to feel it' };
/** Chip row. `chipText`: fixed chip words by key (the rest come from the zoom's own `chip`). */
export const chipRowOf = (howto, chipText) => active => `<div class="zoom-chips-head eyebrow">Look closer</div><div class="zoom-chips" role="group" aria-label="Look closer">${howto.chips.map(k =>
  `<button class="zoom-chip" aria-pressed="${k === active}"${CHIP_ARIA[k] ? ` aria-label="${CHIP_ARIA[k]}"` : ''}>${chipText[k] ?? howto.zooms.find(z => z.key === k).chip}</button>`).join('')}</div>`;
export const zoomTop = z => `<div class="zoom-top"><button class="zoom-back" aria-label="Back to the plate">${I.back(18)}<span>Plate</span></button><h3 class="zoom-heading" id="zh-${z.key}" tabindex="-1">${esc(z.heading)}</h3></div>`;
export const captions = c => `<div class="zoom-caps"><p><span class="sr-only">Right: </span>${esc(c.right)}</p><p><span class="sr-only">Wrong: </span>${esc(c.wrong)}</p></div>`;
export const feelLink = z => z.feelPrompt ? `<button class="z-feelrow">${esc(z.feelPrompt)}${I.chev(16)}</button>` : '';
export const pagerOf = PAGES => active => `<div class="pager" role="tablist" aria-label="Hand pages">${PAGES.map((p, i) =>
  `<button class="pager-btn" role="tab" aria-selected="${p.key === active}" aria-label="${esc(`${p.label}, page ${i + 1} of ${PAGES.length}`)}">${esc(p.label)}</button>`).join('')}</div>`;

export const mergePose = (a, b) => ({ ...a, ...b, wrist: { ...a.wrist, ...(b.wrist ?? {}) }, fingers: { ...a.fingers, ...(b.fingers ?? {}) }, handle: { ...a.handle, ...(b.handle ?? {}) }, load: { ...a.load, ...(b.load ?? {}) } });
/** The first sheet's merge (lateral raise): wrist and fingers merged, everything else from the fault. */
export const mergeWristFingers = (a, b) => ({ ...a, ...b, wrist: { ...a.wrist, ...b.wrist }, fingers: { ...a.fingers, ...b.fingers } });
export const mergeDeep = (a, b) => { if (b === undefined) return a; if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) { const o = { ...a }; for (const q of Object.keys(b)) o[q] = mergeDeep(a[q], b[q]); return o; } return b; };
export const nums = s => s.match(/-?[\d.]+/g).map(Number);
