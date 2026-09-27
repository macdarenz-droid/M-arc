// Shared scene helpers: the demo's arrowSvg, and the Stage assembly of R1-9 (the stage markup the demo writes inside
// <g class="cam">, and the four Pictures tiles as posed copies of the rig markup: no <use>, no --delay).
import type { Frame, Sample, Stage } from '../rig/api';
import { n2, origin, pts, type Pt } from '../rig/math';

export type Arrow = { from: Pt | number[]; to: Pt | number[] };
export function arrowSvg(a: Arrow, k = 1): string { // a = { from:[x,y], to:[x,y] } in scene units; k = 1.5 for the larger tile arrows
  const x0 = a.from[0]!, y0 = a.from[1]!, x1 = a.to[0]!, y1 = a.to[1]!, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const hx = x1 - ux * 6 * k, hy = y1 - uy * 6 * k, nx = -uy * 4 * k, ny = ux * 4 * k;
  return `<path class="arrow${k !== 1 ? ' arrow-lg' : ''}" d="M${n2(x0)} ${n2(y0)}L${n2(hx)} ${n2(hy)}"/><polygon class="arrow-head" points="${pts([[x1, y1], [hx + nx, hy + ny], [hx - nx, hy - ny]])}"/>`;
}
/** the transform-origin rule the demo's animRule writes for an animated class */
export const originRule = (cls: string, x: number, y: number): string => `.${cls}{${origin(x, y)}}`;

const styleOf = (f: Frame): string =>
  f.transform !== undefined ? `transform:${f.transform}` : f.opacity !== undefined ? `opacity:${f.opacity}` : `stroke-dashoffset:${f.strokeDashoffset}`;

/**
 * The rig markup posed at rep fraction u (R1-9): every animated group gets the sampled value at the stop nearest u written
 * inline; .stack-top elements get opacity 0; muscle hotspots are left out (a tile is a picture, not a control); ids get a
 * per-tile suffix so the page never holds two equal ids.
 */
export function posedCopy(markup: string, sample: Sample, u: number, suffix: string): string {
  const pcs = sample.stops.map(pc => pc / 100);
  let at = 0; pcs.forEach((s, i) => { if (Math.abs(s - u) < Math.abs(pcs[at]! - u)) at = i; });
  const byClass = new Map(sample.groups.map(g => [g.className, g.frames[at]!]));
  return markup
    .replace(/<polygon class="hot[ "][^>]*\/>/g, '')
    .replace(/<(\w+)([^>]*?) class="([^"]*)"([^>]*?)(\/?)>/g, (tag, name: string, pre: string, cls: string, post: string, end: string) => {
      const toks = cls.split(' ');
      const add: string[] = [];
      for (const t of toks) { const f = byClass.get(t); if (f) add.push(styleOf(f)); }
      if (toks.includes('stack-top')) add.push('opacity:0');
      if (!add.length) return tag;
      const attrs = `${pre} class="${cls}"${post}`;
      const merged = / style="[^"]*"/.test(attrs) ? attrs.replace(/ style="([^"]*)"/, (_, s: string) => ` style="${s};${add.join(';')}"`) : `${attrs} style="${add.join(';')}"`;
      return `<${name}${merged}${end}>`;
    })
    .replace(/ id="([^"]+)"/g, (_, id: string) => ` id="${id}${suffix}"`)
    .replace(/url\(#([^)]+)\)/g, (_, id: string) => `url(#${id}${suffix})`);
}

export type SceneParts = {
  id: string; scene: string; staticOverlays?: string; css: string;
  tileBox: number[]; pics: readonly string[]; picsAt: readonly number[]; arrows: (Arrow | null)[];
};
export function buildStage(p: SceneParts, sample: Sample): Stage {
  const svg = `<g class="cam"><g id="rig-${p.id}">\n${p.scene}\n</g>${p.staticOverlays || ''}</g>`;
  const tiles = p.pics.map((cap, i) => `<div class="tile"><svg viewBox="${p.tileBox.join(' ')}" aria-hidden="true" style="--sw:.75"><g class="rig-still">${posedCopy(p.scene, sample, p.picsAt[i]!, `-t${i + 1}`)}</g>${p.arrows[i] ? arrowSvg(p.arrows[i]!, 1.5) : ''}</svg><span class="badge">${i + 1}</span><p>${cap}</p></div>`).join('');
  return { svg, tiles, css: p.css };
}
