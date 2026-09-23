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

describe('stylesheet custom properties (QA-R7-4)', () => {
  it('every var() the stylesheet reads is a theme token, defined in the sheet, or set inline by a component', async () => {
    const { readFileSync } = await import('node:fs');
    const css = readFileSync('src/ui/styles.css', 'utf8');
    const used = new Set([...css.matchAll(/var\((--[\w-]+)/g)].map(m => m[1]!));
    const defined = new Set([...css.matchAll(/(--[\w-]+)\s*:/g), ...themeToCss(THEMES.paper).matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]!));
    // Set from a style attribute or by the platform.
    const inline = new Set(['--dot', '--insight', '--muscle-fill', '--pulse-beat', '--safe-area-inset-bottom', '--safe-area-inset-top']);
    expect([...used].filter(v => !defined.has(v) && !inline.has(v))).toEqual([]);
  });
});
