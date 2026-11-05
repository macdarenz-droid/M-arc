// D-FEEL-NOMEANS (supervisor, W2 panel fix 3): a feel row with an empty or missing `means` prints no "Usually means"
// label in the app (gen/feel.mjs dropEmptyMeans); a row with means, and the 8 plus the shipped curl, stay byte-identical.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const LAYERS_SRC = readFileSync(join(ROOT, 'tools/plates/layers/artifact/howto-layers.mjs'), 'utf8');
// the vendored row template's own esc and body line, so the cases below are the bytes golden B prints
const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const body = (r: { means?: string; fix: string }) => `<div class="fr-body" id="x-row-k-body" hidden><p><b>Usually means</b>${esc(r.means)}</p><p><b>Fix</b>${esc(r.fix)}</p></div>`;
// the 8 (golden B) and the shipped library curl
const FILES = ['barbell-back-squat', 'hanging-leg-raise', 'lat-pulldown', 'lateral-raise', 'leg-press', 'machine-chest-press', 'pull-up', 'seated-cable-row', 'dumbbell-biceps-curl']
  .map(c => `src/howto/generated/feel-${c}.ts`);

let gen: any;
beforeAll(async () => { gen = await import(/* @vite-ignore */ url('tools/plates/gen/feel.mjs')); });

describe('D-FEEL-NOMEANS: the feel generator prints no "Usually means" label for a row with no means', () => {
  it('the vendored template is the one the rule strips (esc is String(s); the body line prints esc(r.means))', () => {
    expect(LAYERS_SRC).toContain("const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');");
    expect(LAYERS_SRC).toContain('<p><b>Usually means</b>${esc(r.means)}</p><p><b>Fix</b>${esc(r.fix)}</p>');
  });

  it('an empty means prints no label', () => {
    const out = gen.dropEmptyMeans(body({ means: '', fix: 'Stop the exercise.' }));
    expect(out).not.toContain('Usually means');
    expect(out).toBe('<div class="fr-body" id="x-row-k-body" hidden><p><b>Fix</b>Stop the exercise.</p></div>');
  });

  it('a missing means prints no label (and no "undefined")', () => {
    const out = gen.dropEmptyMeans(body({ fix: 'Stop the exercise.' }));
    expect(out).not.toContain('Usually means');
    expect(out).not.toContain('undefined');
    expect(out).toBe('<div class="fr-body" id="x-row-k-body" hidden><p><b>Fix</b>Stop the exercise.</p></div>');
  });

  it('a row with means is unchanged, byte for byte, beside an empty one', () => {
    const withMeans = body({ means: 'Your elbows drift forward.', fix: 'Pin the elbows.' });
    expect(gen.dropEmptyMeans(withMeans)).toBe(withMeans);
    expect(gen.dropEmptyMeans(withMeans + body({ means: '', fix: 'Stop.' }))).toBe(`${withMeans}<div class="fr-body" id="x-row-k-body" hidden><p><b>Fix</b>Stop.</p></div>`);
  });

  it("golden B's 8 and the shipped curl: every committed feel section has means on every row, so the rule leaves it byte-equal", async () => {
    for (const f of FILES) {
      const m = (await import(/* @vite-ignore */ url(f))).default as { section: string };
      const n = (m.section.match(/<div class="fr-body"/g) ?? []).length;
      expect(n, f).toBeGreaterThan(0);
      expect((m.section.match(/<p><b>Usually means<\/b>[^<]/g) ?? []).length, f).toBe(n);
      expect(gen.dropEmptyMeans(m.section), f).toBe(m.section);
    }
  });
});
