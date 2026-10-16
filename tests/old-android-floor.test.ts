// OLD-ANDROID-1b G3 (D-OA1-FLOOR): the floor list, the index.html probes and update screen, and ES5 inline scripts.
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
// @ts-expect-error plain .mjs module without type declarations
import { FEATURES, FLOOR } from '../scripts/old-android-floor.mjs';

type Feature = { id: string; chrome: number; probe: string };
const features = FEATURES as Feature[];
const html = readFileSync('index.html', 'utf8');
const head = html.slice(0, html.indexOf('</head>'));
const headScripts = [...head.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1] ?? '').join('\n');
const inlineScripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1] ?? '');

describe('OLD-ANDROID-1b floor', () => {
  it('(a) FLOOR is the highest Chrome version among FEATURES, 111', () => {
    expect(features.map(f => f.id)).toEqual(['modules', 'at', 'animation', 'color-mix']);
    expect(FLOOR).toBe(Math.max(...features.map(f => f.chrome)));
    expect(FLOOR).toBe(111);
  });

  it.each(features.map(f => [f.id, f.probe]))('(b) the index.html head script runs the %s probe', (_id, probe) => {
    expect(headScripts).toContain(probe);
  });

  it('(b) the head script defines __marcUnsupportedShow and a DOMContentLoaded handler', () => {
    expect(headScripts).toMatch(/window\.__marcUnsupportedShow\s*=\s*function/);
    expect(headScripts).toMatch(/document\.addEventListener\('DOMContentLoaded',\s*function/);
  });

  it('(c) the update screen has no reset button and the exact copy', () => {
    const m = /window\.__marcUnsupportedShow = function \(\) \{([\s\S]*?)\n {4}\};/.exec(headScripts);
    expect(m).not.toBeNull();
    const body = m![1];
    expect(body).not.toContain('data-reset');
    expect(body).not.toContain('data-rescue');
    expect(body).toContain('>WebView update</h1>');
    expect(body).toContain('>M/ARC needs a newer Android System WebView.</p>');
    expect(body).toContain('href="market://details?id=com.google.android.webview"');
    expect(body).toContain('>Open Play Store</a>');
    expect(body).not.toMatch(/var\(|inset|dvh|color-mix\(/);
  });

  it('(d) every inline classic script in index.html is ES5', () => {
    expect(inlineScripts.length).toBeGreaterThanOrEqual(3);
    for (const code of inlineScripts) expect(() => transformSync(code, { target: 'es5' })).not.toThrow();
  });
});
