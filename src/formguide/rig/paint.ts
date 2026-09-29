// FG-1: the form-guide painter (docs/FORM-GUIDE-PRODUCTION.md §3 "Colour"), ported from the Lateral Raise Lab's
// bodyPal, cel, band, lg, sl and packSl. It reads only theme tokens and holds no colour literal.
//
// Mixing (A6): the app's floor is Capacitor 8's default minimum WebView, 60 (Bridge.DEFAULT_ANDROID_WEBVIEW_VERSION;
// capacitor.config.json sets no android.minWebViewVersion), below CSS color-mix's Chromium 111. So mixes are not
// written as color-mix: `mix` below is the one whitelisted mixer. It takes token names and white or black with a
// number, resolves the tokens through a TokenReader, and returns a resolved colour string. The mistake tint and the
// band colours are derived here and nowhere else. The resolved strings also let a key-moment snapshot live in an <img>.
import { THEMES, type ThemeId, type ThemeTokens } from '@/theme/themes';

/** The theme tokens the figure reads (CSS names without the leading --). */
export const FIGURE_TOKENS = {
  accent: 'accent', mistake: 'mistake', target: 'target', help: 'help', quiet: 'quiet',
  pants: 'pants', 'pants-hi': 'pantsHi', 'pants-sh': 'pantsSh', ink: 'ink',
  iron: 'iron', 'iron-hi': 'ironHi', 'iron-sh': 'ironSh', eye: 'eye', floor: 'floor', guide: 'guide',
  // V1-07 (D-V1-07b): the pages the figure is drawn on (the stage and the Pictures tile), read only to reach contrast
  'surface-1': 'surface1', 'surface-2': 'surface2',
} as const satisfies Record<string, keyof ThemeTokens>;
export type Token = keyof typeof FIGURE_TOKENS;

/** Resolves a token name to the theme's colour. */
export type TokenReader = (t: Token) => string;
/** From the theme catalogue (tests, snapshots for a named theme). */
export const themeReader = (id: ThemeId): TokenReader => t => THEMES[id].tokens[FIGURE_TOKENS[t]] as string;
/** From the live page (the app): the custom properties themes.ts writes. */
export const cssReader = (el: Element): TokenReader => { const s = getComputedStyle(el); return t => s.getPropertyValue('--' + t).trim(); };

type Rgb = [number, number, number];
const HASH = '#';
function rgbOf(read: TokenReader, t: Token): Rgb {
  const v = read(t);
  let h = v.startsWith(HASH) ? v.slice(1) : '';
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  if (!/^[0-9a-fA-F]{6}$/.test(h)) throw new Error(`form-guide: token --${t} must be a 3 or 6 digit hex colour to mix, got "${v}"`);
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)) as Rgb;
}
const PURE: Record<'white' | 'black', Rgb> = { white: [255, 255, 255], black: [0, 0, 0] };
const out = (c: Rgb): string => HASH + c.map(v => v.toString(16).padStart(2, '0')).join('');
const blend = (a: Rgb, b: Rgb, t: number): Rgb => a.map((v, i) => Math.round(v + (b[i]! - v) * t)) as Rgb;

/** What a mix starts from: a token, or a token already mixed toward another token (the mistake body base). */
export type Tone = Token | { from: Token; toward: Token; t: number };
const toneRgb = (read: TokenReader, a: Tone): Rgb => (typeof a === 'string' ? rgbOf(read, a) : blend(rgbOf(read, a.from), rgbOf(read, a.toward), a.t));

/** The whitelisted mixer: tone a moved toward white, black or another token by t (0..1), as the lab's mixHex. */
export function mix(read: TokenReader, a: Tone, toward: 'white' | 'black' | Token, t: number): string {
  if (!(t >= 0 && t <= 1)) throw new Error(`form-guide: mix amount ${t} outside 0..1`);
  const b = toward === 'white' || toward === 'black' ? PURE[toward] : rgbOf(read, toward);
  return out(blend(toneRgb(read, a), b, t));
}

/** The mistake figure is tinted toward --mistake (the lab's 0.62 toward its negative red; D-FG1). */
export const MISTAKE_TINT = 0.62;
/** V1-07 (D-V1-07b, WCAG 2.2 1.4.11): what the figure's parts reach, with 0.1 kept over the 3:1 for rounding. */
export const REACH = 3.1;
const lum = (c: Rgb) => { const f = (v: number) => { const x = v / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
/** WCAG contrast ratio of two colours. */
export const contrastOf = (a: Rgb, b: Rgb) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** The least mix of `c` toward white or black (0.05 steps, the smaller of the two) that reaches REACH against every
 * colour in `against`; the best one when none does. */
function reach(c: Rgb, against: Rgb[]): Rgb {
  let best: { t: number; r: number; v: Rgb } | null = null;
  for (const dir of ['white', 'black'] as const) for (let i = 0; i <= 20; i++) {
    const v = blend(c, PURE[dir], i / 20), r = Math.min(...against.map(a => contrastOf(v, a)));
    if (r >= REACH) { if (!best || best.r < REACH || i / 20 < best.t) best = { t: i / 20, r, v }; break; }
    if (!best || (best.r < REACH && r > best.r)) best = { t: i / 20, r, v };
  }
  return best!.v;
}
/** The body tones; V1-07 adds `cloth`, the clothes' outline, reaching 3:1 against both pages (--ink where it already
 * does). All flat strings, so every colour the figure paints is one of these values (the themes check reads them so). */
/** Where a muscle tint lies (V1-07, D-V1-07c): on the deltoid's lit gradient (hi..mid), on the skin (lit..sh) or on
 * the clothes (pants-hi..pants-sh). */
export type Ground = 'D' | 'K' | 'C';
export type Role = 'target' | 'help' | 'quiet';
type RingKey = `ring${Ground}${'Target' | 'Help' | 'Quiet'}${'O' | 'I'}`;
export type BodyPal = Record<'hi' | 'lit' | 'base' | 'mid' | 'sh' | 'sh2' | 'dk' | 'occ' | 'line' | 'def' | 'spec' | 'rim' | 'cloth' | RingKey, string>;
/** The tint's fill opacity at full effort (D-FG4's 0.6, now the fill's own; the tint's group carries the effort). */
export const TINT_FILL = 0.6;
/** Stroke widths of a tint's boundary: the outer line shows OUTER_W/2 - INNER_W/2 units each side of the inner one. */
export const RING_W = { outer: 4.4, inner: 1.8 } as const;
/**
 * A muscle tint (V1-07, D-V1-07c): one group keyed `fg-t-<key>`, hidden at rest, whose opacity the player sets from the
 * effort (guideView tintOf), holding the tint fill (`fg-tf-`) at TINT_FILL and its two-tone boundary, the outer line
 * (`fg-tro-`) under the inner one (`fg-tri-`), so the boundary follows the effort with the tint.
 */
export const tintMark = (key: string, d: string, tone: string, [outer, inner]: [string, string], attrs = ''): string =>
  `<g class="fg-p fg-t-${key}" opacity="0"${attrs}><path class="fg-tf-${key}" d="${d}" fill="${tone}" fill-opacity="${TINT_FILL}"/>`
  + `<path class="fg-tro-${key}" d="${d}" fill="none" stroke="${outer}" stroke-width="${RING_W.outer}" stroke-linejoin="round"/>`
  + `<path class="fg-tri-${key}" d="${d}" fill="none" stroke="${inner}" stroke-width="${RING_W.inner}" stroke-linejoin="round"/></g>`;
/** A tint's two-tone boundary colours (outer, inner) on its ground. */
export const ringOf = (b: BodyPal, g: Ground, role: Role): [string, string] => {
  const r = role[0]!.toUpperCase() + role.slice(1) as 'Target';
  return [b[`ring${g}${r}O`], b[`ring${g}${r}I`]];
};
/**
 * The lab's bodyPal: the body tones, all from --accent (or --accent toward --mistake for the mistake). V1-07 (D-V1-07b):
 * where the base does not reach 3.1:1 on both pages (Midnight), the body's outline (`line`, the figure's --l) is the base
 * lifted toward white or black just far enough to, instead of the base darkened; everywhere else nothing changes. The
 * clothes' outline is --ink, or where --ink does not reach 3.1:1 on both pages, --pants mixed toward white or black just
 * far enough to.
 */
export function bodyPal(read: TokenReader, mistake: boolean): BodyPal {
  const tone: Tone = mistake ? { from: 'accent', toward: 'mistake', t: MISTAKE_TINT } : 'accent';
  const pages = (['surface-1', 'surface-2'] as const).map(t => rgbOf(read, t)), b0 = toneRgb(read, tone);
  const edge = pages.every(pg => contrastOf(b0, pg) >= REACH) ? null : out(reach(b0, pages));
  const m = (c: 'white' | 'black', t: number) => out(blend(b0, PURE[c], t));
  const pal = { hi: m('white', 0.3), lit: m('white', 0.14), base: m('white', 0), mid: m('black', 0.14), sh: m('black', 0.3), sh2: m('black', 0.22),
    dk: m('black', 0.42), occ: m('black', 0.5), line: edge ?? m('black', 0.8), def: m('black', 0.55), spec: m('white', 0.78), rim: m('white', 0.6) };
  const ink = rgbOf(read, 'ink');
  // V1-07 (D-V1-07c): each tint's two-tone boundary. The outer line reaches REACH against every tone of the ground it
  // lies on; the inner line against the tint (its token at TINT_FILL over each of those tones). Both start from the
  // tint's own token, so they keep its hue as far as the contrast allows.
  const sh = blend(b0, PURE.black, 0.3), T = (t: number) => blend(b0, PURE[t < 0 ? 'black' : 'white'], Math.abs(t));
  const ground: Record<Ground, Rgb[]> = {
    D: [0.3, 0.14, 0, -0.14].map(T),
    // the skin gradients, and the trap's 30 % shadow over them
    K: [0.14, 0, -0.14, -0.3].map(T).flatMap(c => [c, blend(c, sh, 0.3)]),
    C: (['pants-hi', 'pants', 'pants-sh'] as const).map(t => rgbOf(read, t)),
  };
  const rings = {} as Record<RingKey, string>, quiet: Token = mistake ? 'mistake' : 'quiet';
  for (const g of ['D', 'K', 'C'] as const) for (const [r, tok] of [['Target', 'target'], ['Help', 'help'], ['Quiet', quiet]] as const) {
    const c = rgbOf(read, tok), under = ground[g], tinted = under.map(u => blend(u, c, TINT_FILL));
    rings[`ring${g}${r}O`] = out(reach(c, under));
    rings[`ring${g}${r}I`] = out(reach(c, tinted));
  }
  return { ...pal, ...rings, cloth: out(pages.every(pg => contrastOf(ink, pg) >= REACH) ? ink : reach(rgbOf(read, 'pants'), pages)) };
}

/** Cel gradient: three hard bands (lab `cel`). */
export function cel(id: string, hi: string, base: string, sh: string, ang = 1): string {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="0.85" y2="${ang}"><stop offset="0" stop-color="${hi}"/><stop offset=".16" stop-color="${hi}"/><stop offset=".16" stop-color="${base}"/><stop offset=".66" stop-color="${base}"/><stop offset=".66" stop-color="${sh}"/><stop offset="1" stop-color="${sh}"/></linearGradient>`;
}
/** Shimmer band gradient along the fibres (lab `band`); the bright core is white mixed from the band's own token. */
export function band(read: TokenReader, id: string, c: Token, dir: 'x' | 'y'): string {
  const [x2, y2] = dir === 'x' ? [1, 0] : [0, 1], col = mix(read, c, 'white', 0), core = mix(read, c, 'white', 1);
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".3" stop-color="${col}" stop-opacity="0"/><stop offset=".4" stop-color="${core}" stop-opacity=".95"/><stop offset=".5" stop-color="${col}" stop-opacity="0"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient>`;
}
/** Soft gradient from [offset, colour, opacity] stops (lab `lg`); user = gradientUnits userSpaceOnUse. */
export function lg(id: string, x1: number, y1: number, x2: number, y2: number, st: [number, string, number?][], user = false): string {
  return `<linearGradient id="${id}"${user ? ' gradientUnits="userSpaceOnUse"' : ''} x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${st.map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}"${a < 1 ? ` stop-opacity="${a}"` : ''}/>`).join('')}</linearGradient>`;
}

/** Figure-scoped colour variables the brush lines use; set on the figure's root from the palette. */
export const D_ = 'var(--d)', L_ = 'var(--l)', SP = 'var(--sp)', OC = 'var(--oc)';
/**
 * A brush line (lab `sl`): a thin filled sliver along a quadratic or cubic (4, 6 or 8 numbers), widest (w) at a (0..1)
 * of its length and running to a point at both ends. c is a var() reference.
 */
export function sl(d: number[], w: number, c = D_, a = 0.5, o = 1): string {
  if (d.length === 4) d = [d[0]!, d[1]!, d[0]! + (d[2]! - d[0]!) / 3, d[1]! + (d[3]! - d[1]!) / 3, d[2]! - (d[2]! - d[0]!) / 3, d[3]! - (d[3]! - d[1]!) / 3, d[2]!, d[3]!];
  else if (d.length === 6) d = [d[0]!, d[1]!, d[0]! + (2 / 3) * (d[2]! - d[0]!), d[1]! + (2 / 3) * (d[3]! - d[1]!), d[4]! + (2 / 3) * (d[2]! - d[4]!), d[5]! + (2 / 3) * (d[3]! - d[5]!), d[4]!, d[5]!];
  const P = (t: number) => { const u = 1 - t; return [0, 1].map(i => u * u * u * d[i]! + 3 * u * u * t * d[2 + i]! + 3 * u * t * t * d[4 + i]! + t * t * t * d[6 + i]!) as [number, number]; };
  const A: string[] = [], B: string[] = [], f = (v: number) => v.toFixed(1);
  for (let k = 0; k <= 5; k++) {
    const t = k / 5, p = P(t), q = P(Math.min(1, t + 0.02)), r = P(Math.max(0, t - 0.02)), dx = q[0] - r[0], dy = q[1] - r[1], n = Math.hypot(dx, dy) || 1,
      h = (w / 2) * Math.pow(Math.sin(Math.PI * (t < a ? (0.5 * t) / a : 0.5 + (0.5 * (t - a)) / (1 - a))), 0.7);
    A.push(f(p[0] - (dy / n) * h) + ' ' + f(p[1] + (dx / n) * h)); B.unshift(f(p[0] + (dy / n) * h) + ' ' + f(p[1] - (dx / n) * h));
  }
  return `<path d="M${A.join('L')}L${B.join('L')}Z" fill="${c}"${o < 1 ? ` opacity="${o}"` : ''}/>`;
}
/** Lab `packSl`: a run of neighbouring brush lines is regrouped so each colour and opacity is one path (same picture:
 * lines in one run do not overlap and all wind the same way, so the nonzero fill keeps any overlap). */
export const packSl = (h: string): string => h.replace(/(?:<path d="M[-\d. L]+Z" fill="var\(--[\w-]+\)"(?: opacity="[\d.]+")?\/>\s*){2,}/g, run => {
  const acc: { k: string; d: string; f: string; o: string }[] = [];
  for (const m of run.matchAll(/<path d="([^"]+)" fill="([^"]+)"((?: opacity="[\d.]+")?)\/>/g)) {
    const k = m[2]! + m[3]!, c = acc.find(o => o.k === k);
    if (c) c.d += m[1]!; else acc.push({ k, d: m[1]!, f: m[2]!, o: m[3]! });
  }
  return acc.map(c => `<path d="${c.d}" fill="${c.f}"${c.o}/>`).join('');
});
