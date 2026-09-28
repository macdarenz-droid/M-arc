// FG-4: key-moment snapshots (docs/FORM-GUIDE-PRODUCTION.md §6). A moment is a static image, never a live figure: the
// figure markup posed with inline transforms, every var() resolved to the colour it has now (an SVG inside <img> cannot
// read the page's custom properties), as a data URI. The player resolves with cssReader (getComputedStyle at capture
// time) and caches per theme; a `data-theme` change is a new cache key, so the pictures are regenerated. Pure strings.
import { css, type Frame } from './rig/pose';
import { FIGURE_TOKENS, type Token, type TokenReader } from './rig/paint';

const n = (v: number) => { const s = (Math.round(v * 10000) / 10000).toString(); return s === '-0' ? '0' : s; };

/** The figure markup with a frame written in: each joint's and part's transform in its style, each tint's opacity. */
export function posedMarkup(markup: string, frame: Frame): string {
  return markup.replace(/<(g|path) class="(fg-j j-|fg-p fg-)([\w-]+)"([^>]*?)(\/?)>/g, (all, tag: string, pre: string, key: string, attrs: string, close: string) => {
    const xf = frame[key];
    if (!xf) return all;
    if (xf.ops) {
      const t = `transform:${css(xf.ops)}`;
      attrs = / style="/.test(attrs) ? attrs.replace(/ style="([^"]*)"/, (_, st: string) => ` style="${st};${t}"`) : `${attrs} style="${t}"`;
    } else {
      const o = n(Math.min(1, Math.max(0, xf.opacity)));
      attrs = / opacity="[^"]*"/.test(attrs) ? attrs.replace(/ opacity="[^"]*"/, ` opacity="${o}"`) : `${attrs} opacity="${o}"`;
    }
    return `<${tag} class="${pre}${key}"${attrs}${close}>`;
  });
}

/** Every var(--x) replaced by its value: the figure root's own variables first (--l, --d, ...), then the theme tokens. */
export function resolveVars(svg: string, read: TokenReader): string {
  const own = new Map<string, string>();
  const root = /class="fg-fig" style="([^"]*)"/.exec(svg);
  for (const m of (root?.[1] ?? '').matchAll(/--([\w-]+):([^;"]+)/g)) own.set(m[1]!, m[2]!.trim());
  return svg.replace(/var\(--([\w-]+)\)/g, (_, name: string) => {
    const v = own.get(name) ?? (name in FIGURE_TOKENS ? read(name as Token).trim() : '');
    if (!v || v.includes('var(')) throw new Error(`form-guide snapshot: --${name} has no resolved colour`);
    return v;
  });
}

/** One moment as a standalone SVG document. */
export function snapshotSvg(markup: string, frame: Frame, read: TokenReader, viewBox: readonly [number, number, number, number]): string {
  const body = resolveVars(posedMarkup(markup, frame), read);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox.join(' ')}" width="${viewBox[2]}" height="${viewBox[3]}"><style>.fg-j,.fg-p{transform-box:view-box}</style>${body}</svg>`;
}

export const toDataUri = (svg: string): string => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

/** Snapshots per theme: `make` runs once per key (theme, figure, camera); a new theme is a new key. */
export class SnapshotCache {
  private m = new Map<string, string[]>();
  get(key: string, make: () => string[]): string[] {
    let v = this.m.get(key);
    if (!v) { v = make(); this.m.set(key, v); }
    return v;
  }
  get size() { return this.m.size; }
}
