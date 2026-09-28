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
