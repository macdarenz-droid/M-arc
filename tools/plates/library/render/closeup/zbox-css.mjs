// LIB-6 zbox shell: the sheet CSS (golden B's ZCSS), built from one shared base plus named rule blocks. An exercise's
// options pick blocks for five slots (see zboxCss); the result is === the frozen script's ZCSS string.

const HEAD = `
.hz-svg .hz-crop-bg { fill: var(--surface-2); }
.hz-svg .hz-frame { fill: none; stroke: var(--border-strong); stroke-width: 1; }
.hz-svg .h-note.ok { fill: var(--accent-text); }
.hz-crop path, .hz-crop use, .hz-crop circle, .hz-crop rect, .hz-crop line { vector-effect: non-scaling-stroke; }
.hz-crop .hz-g { fill: none; stroke-width: 1.5; stroke-linecap: round; }
.hz-crop .hz-g.dash { stroke-dasharray: 4 3; }
`;
const MARK_COLOURS = `.hz-crop .hz-g.ok { stroke: var(--accent); } .hz-crop .hz-g.no { stroke: var(--mistake); }
`;
const SHEET = `.hsec { margin-top: var(--sp-4); }
.chips { display: flex; gap: 6px; margin-top: 8px; }
.chip { flex: none; display: inline-flex; align-items: center; min-height: 44px; padding: 0 11px; border-radius: var(--radius-pill); border: 1px solid var(--border); color: var(--text-2); font-size: var(--fs-small); font-weight: var(--fw-medium); white-space: nowrap; }
.chip[aria-pressed="true"] { background: var(--accent-soft); border-color: transparent; color: var(--accent-text); }
.ztop { display: flex; align-items: center; gap: 4px; margin: 0 0 8px -12px; }
.ztop h3 { font-size: var(--fs-body); font-weight: var(--fw-semibold); margin: 0; }
.zbox { border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); background: var(--surface-2); overflow: hidden; padding: 10px 10px 8px; }
.zbox .hand-svg { display: block; width: 100%; height: auto; }
.zbox.hand { padding: 0; }`;
const CAPS = `.caps { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 10px; }
.caps p { margin: 0; display: flex; gap: 6px; font-size: var(--fs-meta); line-height: var(--lh-meta); color: var(--text-2); }
.caps svg { flex: none; margin-top: 1px; } .caps .ok { color: var(--accent-text); } .caps .no { color: var(--mistake); }
.gripline { margin: 12px 0 0; font-size: var(--fs-body); line-height: var(--lh-body); color: var(--text); }
`;
const FEEL = `.feellink { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px; margin-top: 10px; padding: 6px 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); text-align: left; }
.feellink .grow { display: grid; } .feellink .eyebrow { font-size: var(--fs-cap); } .feellink b { font-weight: var(--fw-medium); font-size: var(--fs-small); color: var(--text); }
.feellink .why { font-size: var(--fs-meta); color: var(--accent-text); white-space: nowrap; }
.feel-sec h3 { margin: 0 0 10px; }
.feelline { margin: 12px 0 0; font-size: var(--fs-body); line-height: var(--lh-body); }
`;
const TAIL = `.feel-legend { margin-top: 10px; }
.rows { margin-top: 14px; border-top: 1px solid var(--border-subtle); }
.row { border-bottom: 1px solid var(--border-subtle); }
.row > button { display: flex; align-items: center; gap: 8px; width: 100%; min-height: 44px; text-align: left; font-size: var(--fs-body); }
.row > button svg { color: var(--text-3); flex: none; }
.row .body { padding: 0 0 12px 28px; display: grid; gap: 8px; font-size: var(--fs-small); line-height: var(--lh-small); color: var(--text-2); }
.row .body b { color: var(--text); font-weight: var(--fw-semibold); }
.row .showme { justify-self: start; min-height: 44px; padding: 0 14px; border-radius: var(--radius-pill); border: 1px solid var(--border); color: var(--text); font-size: var(--fs-small); font-weight: var(--fw-medium); display: inline-flex; align-items: center; gap: 6px; }
.redflag { display: grid; gap: 6px; padding: 10px 12px; border-radius: var(--radius-md); background: color-mix(in srgb, var(--mistake) 10%, transparent); color: var(--text); }
.redflag p { margin: 0; display: flex; gap: 8px; } .redflag svg { flex: none; color: var(--mistake); margin-top: 1px; }
.more { min-height: 44px; margin-top: 4px; color: var(--accent-text); font-size: var(--fs-small); font-weight: var(--fw-medium); }
`;

/** Named rule blocks. Each is one or more whole lines (string, or a function of the css options). */
export const CSS_BLOCKS = {
  // crop marks
  wide: `.hz-crop .hz-g.wide { stroke-width: 2.5; }\n`,
  'gap-shade': `.hz-crop .hz-gap { fill: color-mix(in srgb, var(--mistake) 22%, transparent); stroke: none; }\n`,
  'gap-fill': `.hz-crop .hz-g.gapfill { fill: color-mix(in srgb, var(--mistake) 28%, transparent); stroke: none; }\n`,
  ref: `.hz-crop .hz-g.ref { stroke: var(--text-2); } .hz-crop circle.hz-g.ref { fill: var(--text-2); stroke: none; }\n`,
  dot: `.hz-crop .hz-g.dot { stroke: none; } .hz-crop .hz-g.dot.ok { fill: var(--accent); } .hz-crop .hz-g.dot.no { fill: var(--mistake); }\n`,
  target: `.hz-crop .hz-g.tgt { stroke: var(--text-2); } .hz-crop .hz-g.dot.tgt { fill: var(--text-2); stroke: none; }\n`,
  tick: `.hz-crop .hz-tick { stroke: var(--text-2); stroke-width: 1.5; stroke-linecap: round; }\n`,
  leader: `.hz-svg .hz-leader { fill: none; stroke-width: .75; } .hz-svg .hz-leader.ok { stroke: var(--accent); } .hz-svg .hz-leader.no { stroke: var(--mistake); }\n`,
  anchor: `.hz-svg .hz-anchor.ok { fill: var(--accent); } .hz-svg .hz-anchor.no { fill: var(--mistake); }\n`,
  thin: `.hz-crop .hz-g.thin { stroke-width: 1; }\n`,
  'bony-bump': `.hz-crop .hz-c7-t { fill: var(--text-2); font-weight: var(--fw-medium); paint-order: stroke; stroke: var(--surface-2); stroke-width: 1.2px; stroke-linejoin: round; }
.hz-crop circle.hz-c7 { fill: var(--text-2); stroke: var(--surface-2); stroke-width: 1.5; }\n`,
  'sheet-comment': `/* sheet parts */\n`,
  // hand zoom
  knee: `.hand-svg .lp-leg { fill: none; stroke: var(--text-3); stroke-width: 1.5; stroke-linejoin: round; stroke-linecap: round; }
.hand-svg .lp-leg.thin { stroke-width: 1; }
.hand-svg .lp-leg-fill { fill: var(--surface-2); stroke: none; }
.hand-svg .lp-knee-t { fill: var(--text-3); }\n`,
  'value-halo': `.hand-svg .h-val { paint-order: stroke; stroke: var(--surface-2); stroke-width: 3px; stroke-linejoin: round; }\n`,
  'right-thumb-ink': `.hand-svg .h-panel.right .h-thumb .u-stroke use { stroke: var(--text); }\n`,
  inset: ` .zbox .inset { border-top: 1px solid var(--border-subtle); padding: 8px 0 4px; }`,   // same line as .zbox.hand
  opt: `.opt { display: flex; gap: 12px; align-items: center; border-top: 1px solid var(--border-subtle); padding: 8px 12px 8px 8px; }\n`,
  'opt-fig': c => `.opt-fig { flex: none; width: ${c.optFigWidth}px; } .opt-fig .hand-svg { display: block; width: ${c.optFigWidth}px; height: auto; }\n`,
  'opt-hidden-edge': `.opt-fig .h-eq-hidden { fill: none; stroke: var(--text-2); stroke-width: 1.25; stroke-dasharray: 3 2.5; }\n`,
  'opt-txt': `.opt-txt { display: grid; gap: 6px; } .opt-txt p { margin: 0; display: flex; gap: 6px; font-size: var(--fs-small); line-height: var(--lh-small); color: var(--text-2); }
.opt-txt .ok { color: var(--accent-text); flex: none; margin-top: 2px; }\n`,
  // text under the zoom / feel section
  sore: `.sore { margin: 6px 0 0; font-size: var(--fs-small); line-height: var(--lh-small); color: var(--text-2); }\n`,
  textonly: `.textonly { margin: 6px 0 0; font-size: var(--fs-small); line-height: var(--lh-small); color: var(--text-2); }\n`,
};

/** css: { crop, marks, handLine, hand, caps, feel } (block-name lists, in order) plus block parameters (optFigWidth). */
export function zboxCss(css) {
  const put = names => (names ?? []).map(n => {
    const b = CSS_BLOCKS[n];
    if (b == null) throw new Error(`zbox css: unknown block ${n}`);
    return typeof b === 'function' ? b(css) : b;
  }).join('');
  return HEAD + put(css.crop) + MARK_COLOURS + put(css.marks) + SHEET + put(css.handLine) + '\n' + put(css.hand)
    + CAPS + put(css.caps) + FEEL + put(css.feel) + TAIL;
}
