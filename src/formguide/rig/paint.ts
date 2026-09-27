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
  accent: 'accent', negative: 'negative', target: 'target', help: 'help', quiet: 'quiet',
  pants: 'pants', 'pants-hi': 'pantsHi', 'pants-sh': 'pantsSh', ink: 'ink',
  iron: 'iron', 'iron-hi': 'ironHi', 'iron-sh': 'ironSh', eye: 'eye', floor: 'floor', guide: 'guide',
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

/** The mistake figure is tinted toward --negative (the lab's 0.62). */
export const MISTAKE_TINT = 0.62;
export type BodyPal = Record<'hi' | 'lit' | 'base' | 'mid' | 'sh' | 'sh2' | 'dk' | 'occ' | 'line' | 'def' | 'spec' | 'rim', string>;
/** The lab's bodyPal: the body tones, all from --accent (or --accent toward --negative for the mistake). */
export function bodyPal(read: TokenReader, mistake: boolean): BodyPal {
  const base: Tone = mistake ? { from: 'accent', toward: 'negative', t: MISTAKE_TINT } : 'accent';
  const m = (c: 'white' | 'black', t: number) => mix(read, base, c, t);
  return { hi: m('white', 0.3), lit: m('white', 0.14), base: m('white', 0), mid: m('black', 0.14), sh: m('black', 0.3), sh2: m('black', 0.22),
    dk: m('black', 0.42), occ: m('black', 0.5), line: m('black', 0.8), def: m('black', 0.55), spec: m('white', 0.78), rim: m('white', 0.6) };
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
