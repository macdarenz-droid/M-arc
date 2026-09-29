import { describe, it, expect } from 'vitest';
import { THEMES, THEME_IDS, allThemesCss, themeToCss } from '@/theme/themes';

describe('themes', () => {
  it('has five themes with a complete token contract', () => {
    expect(THEME_IDS).toHaveLength(5);
    const keys = Object.keys(THEMES['silent-black'].tokens).sort();
    for (const id of THEME_IDS) expect(Object.keys(THEMES[id].tokens).sort()).toEqual(keys);
  });
  it('emits css custom properties per theme', () => {
    const css = themeToCss(THEMES.paper);
    expect(css).toContain('[data-theme="paper"]');
    expect(css).toContain('--accent:#2383e2');
    expect(allThemesCss().split('\n')).toHaveLength(5);
  });
});

import { readFileSync } from 'node:fs';
import { isDarkBg } from '@/theme/engine';
describe('first paint (ST-25)', () => {
  const html = readFileSync('index.html', 'utf8');
  it.each(THEME_IDS)('index.html paints %s in its own bg and text before the bundle', id => {
    const rule = new RegExp(`html\\[data-theme="${id}"\\][^{]*\\{\\s*background:\\s*(#[0-9a-f]{6});\\s*color:\\s*(#[0-9a-f]{6})`, 'i').exec(html);
    expect(rule, id).not.toBeNull();
    expect(rule![1]!.toLowerCase()).toBe(THEMES[id].tokens.bg.toLowerCase());
    expect(rule![2]!.toLowerCase()).toBe(THEMES[id].tokens.text.toLowerCase());
  });
  it('the pre-paint script only accepts known ids and the page can zoom', () => {
    for (const id of THEME_IDS) expect(html).toContain(`'${id}'`);
    expect(html).not.toContain('maximum-scale');
  });
  it('system bar icons follow the background', () => {
    expect(isDarkBg(THEMES.paper.tokens.bg)).toBe(false);
    for (const id of THEME_IDS.filter(t => t !== 'paper')) expect(isDarkBg(THEMES[id].tokens.bg), id).toBe(true);
  });
});

describe('launch overlay theme map (O1)', () => {
  it('index.html THEME map matches src/theme/themes.ts bg/text/accent for every theme', () => {
    const script = /var THEME = \{([\s\S]*?)\};/.exec(readFileSync('index.html', 'utf8'));
    expect(script).not.toBeNull();
    // eslint-disable-next-line no-eval
    const THEME = new Function(`return {${script![1]}};`)() as Record<string, { bg: string; ink: string; accent: string }>;
    for (const id of THEME_IDS) {
      expect(THEME[id], id).toBeDefined();
      expect(THEME[id]!.bg.toLowerCase()).toBe(THEMES[id].tokens.bg.toLowerCase());
      expect(THEME[id]!.ink.toLowerCase()).toBe(THEMES[id].tokens.text.toLowerCase());
      expect(THEME[id]!.accent.toLowerCase()).toBe(THEMES[id].tokens.accent.toLowerCase());
    }
  });
});

describe('stylesheet custom properties (QA-R7-4)', () => {
  it('every var() the stylesheet reads is a theme token, defined in the sheet, or set inline by a component', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/ui/styles.css', 'utf8');
    const used = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]!));
    const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g), ...themeToCss(THEMES.paper).matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]!));
    // Set from a style attribute or by the platform.
    const inline = new Set(['--dot', '--insight', '--muscle-fill', '--pulse-beat', '--hold-ms', '--safe-area-inset-bottom', '--safe-area-inset-top', '--scrim-o']);
    expect([...used].filter(v => !defined.has(v) && !inline.has(v))).toEqual([]);
  });
});

// GU-7a (A7): the form guide paints with theme tokens only. Every file under src/formguide/**
// fails on a hex colour or an rgb()/hsl() call; `#rig-` ids and `url(#…)` refs do not match.
describe('GU-7a: form guide colours are theme tokens only (A7)', () => {
  const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/;
  const FN = /\b(rgba?|hsla?)\(/;
  it('no file under src/formguide/** holds a literal colour', async () => {
    const { readdirSync, readFileSync, statSync } = await import('node:fs');
    const walk = (dir: string): string[] => readdirSync(dir).flatMap(n => { const p = `${dir}/${n}`; return statSync(p).isDirectory() ? walk(p) : [p]; });
    const files = walk('src/formguide');
    expect(files.length).toBeGreaterThan(0);
    const offenders = files.flatMap(f => readFileSync(f, 'utf8').split('\n').map((l, i) => ({ f, i: i + 1, l })).filter(x => HEX.test(x.l) || FN.test(x.l)).map(x => `${x.f}:${x.i}: ${x.l.trim()}`));
    expect(offenders).toEqual([]);
  });
  it('the patterns catch a colour and pass an id', () => {
    expect(HEX.test('fill:#5e6ad2')).toBe(true);
    expect(FN.test('fill:rgba(0,0,0,.5)')).toBe(true);
    expect(HEX.test('<use href="#rig-cp"/>')).toBe(false);
    expect(HEX.test('clip-path="url(#cp-ten-clip0)"')).toBe(false);
  });
});

// FG-1: the form-guide figure paints from theme tokens only. No colour literal (hex, any CSS colour function, a named
// colour in a paint attribute; tests/formguide/colourLint.ts) anywhere in src/formguide/** (paint.ts mixes resolved
// tokens at run time), and every theme carries the figure tokens.
describe('form-guide colours come from tokens (FG-1)', () => {
  it('no colour literal in src/formguide/**', async () => {
    const { readdirSync, readFileSync: read } = await import('node:fs');
    const { colourLiterals } = await import('./formguide/colourLint');
    const files = (readdirSync('src/formguide', { recursive: true }) as string[]).filter(f => /\.(ts|tsx|css|json)$/.test(f));
    expect(files.length).toBeGreaterThan(0);
    const bad = files.flatMap(f => {
      const src = read(`src/formguide/${f}`, 'utf8');
      return colourLiterals(src).map(m => `${f}: ${m}`);
    });
    expect(bad).toEqual([]);
  });
  it('the lint catches every kind of colour literal and passes token references', async () => {
    const { colourLiterals } = await import('./formguide/colourLint');
    const planted = ['#fff', '#a1b2c3', '#a1b2c3d4', 'rgb(1 2 3)', 'rgba(1,2,3,.5)', 'hsl(1 2% 3%)', 'hsla(1,2%,3%,.5)', 'hwb(1 2% 3%)',
      'lab(50% 40 59)', 'lch(52% 72 50)', 'oklab(0.5 0.1 0.1)', 'oklch(0.5 0.1 20)', 'color(display-p3 1 0 0)',
      'color-mix(in srgb, red, blue)', 'fill="white"', "stroke='red'", 'stop-color="navy"', 'color: tomato', 'style="color:Red"', 'fill: rebeccapurple'];
    for (const p of planted) expect(colourLiterals(`<x ${p}/>`), p).not.toEqual([]);
    const clean = ['fill="none"', 'fill="url(#g)"', 'stroke="var(--ink)"', 'fill="currentColor"', 'stop-color="transparent"', 'fill="${c}"',
      'fill="var\\(--[\\w-]+\\)"', "mix(read, 'accent', 'white', 0.3)", 'const lab = screenFist(Q)', 'stroke-width="2"'];
    for (const c of clean) expect(colourLiterals(c), c).toEqual([]);
  });
  it('every theme emits the figure tokens', () => {
    const names = ['--mistake', '--target', '--help', '--quiet', '--pants', '--pants-hi', '--pants-sh', '--ink', '--iron', '--iron-hi', '--iron-sh', '--eye', '--floor', '--guide'];
    for (const id of THEME_IDS) for (const n of names) expect(themeToCss(THEMES[id]), `${id} ${n}`).toMatch(new RegExp(`${n}:[^;]+`));
  });
});

// FG-5: the free-weight parts paint from theme tokens only. Their markup carries no colour literal at all, and the one
// gradient they fill with resolves, in every theme, to exactly that theme's --iron-hi, --iron and --iron-sh.
describe('form-guide parts come from tokens (FG-5)', () => {
  it('every part drawing is literal-free and its gradient is the theme\'s iron', async () => {
    const { colourLiterals } = await import('./formguide/colourLint');
    const { FREE_WEIGHT_PARTS, VARIANTS, partDefs } = await import('@/formguide/parts');
    const { themeReader } = await import('@/formguide/rig/paint');
    for (const id of FREE_WEIGHT_PARTS) for (const p of VARIANTS[id]()) expect(colourLiterals(p.svg), id).toEqual([]);
    for (const t of THEME_IDS) {
      const tk = THEMES[t].tokens, stops = [...partDefs(themeReader(t)).matchAll(/stop-color="([^"]+)"/g)].map(m => m[1]!.toLowerCase());
      expect(new Set(stops), t).toEqual(new Set([tk.ironHi, tk.iron, tk.ironSh].map(c => String(c).toLowerCase())));
    }
  });
});

// FG-6: the side figure paints from theme tokens only, both facings and the mistake figure: no colour function or named
// colour in its markup, every var() it uses is a theme token or one of the figure's own root variables, and the body
// base follows each theme's --accent.
describe('form-guide side figure comes from tokens (FG-6)', () => {
  it('every theme, both facings, correct and mistake', async () => {
    const { colourLiterals } = await import('./formguide/colourLint');
    const { figureSide } = await import('@/formguide/rig/figureSide');
    const { themeReader, bodyPal } = await import('@/formguide/rig/paint');
    for (const t of THEME_IDS) {
      const defined = new Set([...themeToCss(THEMES[t]).matchAll(/(--[\w-]+):/g)].map(m => m[1]!).concat(['--l', '--d', '--oc', '--sp', '--rim', '--ph']));
      for (const mirror of [false, true]) for (const mistake of [false, true]) {
        const svg = figureSide(themeReader(t), { id: 'fs', mirror, mistake });
        expect(colourLiterals(svg, { hex: false }), t).toEqual([]);
        expect([...new Set([...svg.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]!))].filter(v => !defined.has(v)), t).toEqual([]);
      }
      expect(figureSide(themeReader(t), { id: 'fs' })).toContain(bodyPal(themeReader(t), false).base);
      expect(bodyPal(themeReader(t), false).base).toBe(String(THEMES[t].tokens.accent).toLowerCase());
    }
  });
});

// UI-1: the exercise-title sweep paints only var(--text) and the accent, never a dim tone (A4); it
// lives inside its keyframes, so at rest and under reduced motion the title is plain var(--text)
// (A3); only the open card's title runs it, finite on open (A1, A6); I3's static border stays and no
// box-shadow loop comes back (A5); and every theme's accent is a real colour, not a grey (A4).
describe('exercise-title sweep (UI-1)', () => {
  const css = readFileSync('src/ui/styles.css', 'utf8');
  const kfAt = css.indexOf('@keyframes exercise-shimmer');
  const keyframes = kfAt === -1 ? '' : css.slice(kfAt, css.indexOf('\n}', kfAt) + 2);
  const rules = css.split('\n').filter(l => /animation\s*:[^;]*exercise-/.test(l));
  it('the keyframes paint only var(--text), the accent and transparent', () => {
    expect(keyframes).not.toBe('');
    const vars = [...keyframes.matchAll(/var\((--[\w-]+)\)/g)].map(m => m[1]);
    expect(new Set(vars)).toEqual(new Set(['--text', '--accent']));
    expect(keyframes).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|\bgr[ae]y\b/i);
    expect(keyframes).toMatch(/background-clip:\s*text/);
  });
  it('nothing outside the keyframes clips or hides the title text (plain at rest and under reduce)', () => {
    const outside = css.replace(keyframes, '');
    expect(outside).not.toMatch(/\.exname[^{]*\{[^}]*(background|text-fill-color|color:\s*transparent)/);
  });
  it('only the open card title animates, never under reduce, finite on open', () => {
    expect(rules.length).toBe(2);
    for (const r of rules) {
      expect(r.startsWith('html:not([data-motion="reduce"]) .exercise.active')).toBe(true);
      expect(r).toMatch(/\.exname \{ animation: exercise-shimmer /);
    }
    const [open, logging] = rules;
    expect(open).toMatch(/exercise-shimmer [\d.]+s linear 2;/);
    expect(logging).toMatch(/:has\(\.set-grid input:focus\)/);
    expect(logging).toMatch(/\[data-hold\]:focus-within/);
    expect(logging).toMatch(/linear infinite;/);
  });
  it('keeps I3: static accent border, no breathe loop, no box-shadow in the sweep', () => {
    expect(css).toContain('.exercise.active { border-color: color-mix(in srgb, var(--accent) 45%, var(--border)); }');
    expect(css).not.toContain('exercise-breathe');
    expect(keyframes).not.toContain('box-shadow');
  });
  it('every theme accent is a saturated colour, distinct from its text', () => {
    const hsl = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];
      const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2;
      return { s: max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1)), l };
    };
    for (const id of THEME_IDS) {
      const { accent, text } = THEMES[id].tokens;
      expect(hsl(accent).s, `${id} accent ${accent}`).toBeGreaterThan(0.5);
      expect(accent.toLowerCase(), id).not.toBe(text.toLowerCase());
    }
  });
});

// V1-09: the machine layer and the frame-rate panel paint from theme tokens only: the V1-09 stylesheet block names no
// colour literal, and the stand-in machine's markup (the one machine drawn so far) resolves in every theme.
describe('machines in the player come from tokens (V1-09)', () => {
  it('the V1-09 style block and the stand-in are literal-free, and the stand-in resolves in every theme', async () => {
    const { readFileSync } = await import('node:fs');
    const { colourLiterals } = await import('./formguide/colourLint');
    const { STAND_IN } = await import('@/formguide/machines/stand_in');
    const { layerMarkup } = await import('@/formguide/player/machineView');
    const { resolveVars } = await import('@/formguide/snapshot');
    const { themeReader } = await import('@/formguide/rig/paint');
    const css = readFileSync('src/ui/styles.css', 'utf8'), block = /\/\* V1-09:[\s\S]*?(?=\n\n|\n\/\*|$)/.exec(css)?.[0] ?? '';
    expect(block).toContain('.fg9-panel');
    expect(colourLiterals(block)).toEqual([]);
    const svg = layerMarkup(STAND_IN, { kg: 20 });
    expect(colourLiterals(svg)).toEqual([]);
    for (const id of THEME_IDS) expect(resolveVars(svg, themeReader(id)), id).not.toContain('var(');
  });
});
