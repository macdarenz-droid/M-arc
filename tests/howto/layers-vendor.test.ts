// HT-4 L0-B (HT4-A1): the vendored How-to layer mockup (golden B, tools/plates/layers/) is verbatim from the S-2
// pin (16a8edc) and rebuilds byte-identical.
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const MOD_URL = new URL('../../tools/plates/layers.mjs', import.meta.url).href;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let m: any;
const tmps: string[] = [];
const copyLayers = () => { const d = m.makeMirror(); tmps.push(d); return d; };
const flipByte = (file: string, at = 100) => {
  const b = readFileSync(file);
  b[at] = b[at] === 0x20 ? 0x21 : 0x20;
  writeFileSync(file, b);
};

describe('HT4-A1 layer vendor lock (L0-B)', () => {
  beforeAll(async () => { m = await import(/* @vite-ignore */ MOD_URL); });
  afterAll(() => { for (const d of tmps) m.cleanupMirror(d); });

  it('every vendored file matches its MANIFEST sha256 and git blob against the 16a8edc pin', () => {
    expect(m.verifyLayers()).toEqual([]);
  });

  it('the MANIFEST lists exactly the golden-B read closure: README, artifact, engine, exercises, howto, ref-src', () => {
    const paths = Object.keys(m.readManifest().files).sort();
    expect(paths).toContain('README.md');
    expect(paths).toContain('artifact/build-page.mjs');
    expect(paths).toContain('engine/plate.mjs');
    expect(paths).toContain('exercises/machine_chest_press.howto.mjs');
    expect(paths).toContain('howto/shared.mjs');
    expect(paths).toContain('ref-src/plate.mjs');
    expect(paths.length).toBe(48);
    // No engine re-draw for the lateral raise: golden B takes its plate from ref-src (S-2 condition 1).
    expect(paths).not.toContain('exercises/dumbbell_lateral_raise.mjs');
  });

  it('rebuilding the vendored layer page gives the pinned pageSha256 (472030…149c4a)', async () => {
    const mirror = copyLayers();
    const html = await m.buildLayerPage(mirror);
    expect(m.sha256(html)).toBe(m.PAGE_SHA256);
  }, 20000);

  it('fails and names the file on a 1-byte change to engine/plate.mjs', () => {
    const d = copyLayers();
    flipByte(join(d, 'engine/plate.mjs'));
    const bad: string[] = m.verifyLayers(d);
    expect(bad.some((p: string) => p.startsWith('engine/plate.mjs: sha256'))).toBe(true);
    expect(bad.every((p: string) => p.startsWith('engine/plate.mjs'))).toBe(true);
  });

  it('fails and names the file on a 1-byte change to a howto.mjs content file', () => {
    const d = copyLayers();
    flipByte(join(d, 'exercises/machine_chest_press.howto.mjs'), 200);
    const bad: string[] = m.verifyLayers(d);
    expect(bad.some((p: string) => p.startsWith('exercises/machine_chest_press.howto.mjs: sha256'))).toBe(true);
  });

  it('fails on a missing or an extra vendored file', () => {
    const d = copyLayers();
    rmSync(join(d, 'howto/shared.mjs'));
    writeFileSync(join(d, 'howto/extra.mjs'), 'export default {};\n');
    expect(m.verifyLayers(d)).toEqual(['howto/shared.mjs: missing', 'howto/extra.mjs: not in MANIFEST']);
  });

  it('fails on a MANIFEST entry pointing at a different commit than the S-2 pin', () => {
    const d = copyLayers();
    const manifest = m.readManifest(d);
    manifest.files['engine/plate.mjs'].source = 'bc0f378:docs/howto/golden-b/engine/plate.mjs';
    writeFileSync(join(d, 'MANIFEST.json'), JSON.stringify(manifest));
    expect(m.verifyLayers(d, manifest).some((p: string) => p.includes('is not the 16a8edc pin'))).toBe(true);
  });
});

describe('HT4-A1 vendored layers stay outside src', () => {
  it('the layers folder is under tools/plates, not src', async () => {
    if (!m) m = await import(/* @vite-ignore */ MOD_URL);
    expect(m.LAYERS.endsWith(join('tools', 'plates', 'layers'))).toBe(true);
  });
});
