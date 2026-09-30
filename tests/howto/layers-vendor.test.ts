// HT-4 L0-B (HT4-A1): the vendored How-to layer mockup (golden B, tools/plates/layers/) is verbatim from the S-2
// pin (16a8edc) and rebuilds byte-identical.
import { createHash } from 'node:crypto';
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

  // Supervisor, PR #107 (the same condition HT-2 had, #105): the per-file check alone cannot catch a file and its
  // own MANIFEST entry being edited together and staying consistent with each other.
  it('the sorted path:sha256 list of MANIFEST.json, plus pageApproval, hashes to its pinned literal', () => {
    expect(m.sha256(m.manifestPinList())).toBe('505e5ae2a8f9341082459c3e5903a976c634766abbcde30074169ac82b773903');
  });

  it('fails when a vendored file and its own MANIFEST sha256 entry change together (consistently)', () => {
    const d = copyLayers();
    const manifest = m.readManifest(d);
    const file = join(d, 'engine/plate.mjs');
    const edited = Buffer.concat([readFileSync(file), Buffer.from('\n// edited\n')]);
    writeFileSync(file, edited);
    const gitBlob = createHash('sha1').update(`blob ${edited.length}\0`).update(edited).digest('hex');
    manifest.files['engine/plate.mjs'] = { ...manifest.files['engine/plate.mjs'], sha256: m.sha256(edited), gitBlob };
    writeFileSync(join(d, 'MANIFEST.json'), JSON.stringify(manifest));
    // the per-file check alone is fooled (both sides agree, source pin untouched)...
    expect(m.verifyLayers(d, manifest)).toEqual([]);
    // ...but the literal pin over the whole manifest is not
    expect(m.sha256(m.manifestPinList(manifest))).not.toBe('505e5ae2a8f9341082459c3e5903a976c634766abbcde30074169ac82b773903');
  });
});

describe('HT4-A1: the layer page approval and its committed fixture', () => {
  // Not a tests/howto/golden/GOLDEN.json entry: that file is a declared input of HT-2's generator
  // (tools/plates/gen/plates.mjs hashes it into every generated file's inputsSha256), so any edit to its `entries`
  // array - even a purely additive one - stales HT-2's already-committed generated output and breaks
  // `generate --check` (found by running the gate; see PR #107, supervisor comment 5907029772). The approval
  // instead lives in HT-4's own MANIFEST.json, which nothing outside tools/plates/layers.mjs reads.
  const FIXTURE = new URL('golden/howto-layers.html', import.meta.url);

  it('the fixture is committed and its sha256 matches pageApproval.current and PAGE_SHA256', async () => {
    if (!m) m = await import(/* @vite-ignore */ MOD_URL);
    const { current, history } = m.readManifest().pageApproval;
    expect(current, 'MANIFEST.json should hold a pageApproval.current').toBeDefined();
    expect(current.ref).toBe(m.GOLDEN_B_REF);
    expect(current.approvedBy).toBe('owner');
    expect(Array.isArray(history)).toBe(true);
    const fixture = readFileSync(FIXTURE);
    expect(m.sha256(fixture)).toBe(current.pageSha256);
    expect(m.sha256(fixture)).toBe(m.PAGE_SHA256);
    expect(fixture.length).toBe(current.bytes);
  });

  it('history is empty today (no golden-B update has landed yet), and historyPin catches an edited past entry', () => {
    const { history } = m.readManifest().pageApproval;
    expect(history).toEqual([]);
    // Simulates a later update: today's approval retired into history. A future update's own test pins
    // historyPin(history) as a literal, the same way this file pins manifestPinList() above; editing that entry
    // afterwards (rather than only ever appending a new one) changes the pin.
    const retired = { ref: 'aaaaaaa', approvedBy: 'owner', date: '2026-10-01', why: 'superseded by a later pin', pageSha256: 'x'.repeat(64), bytes: 1 };
    const pin = m.historyPin([retired]);
    expect(m.historyPin([{ ...retired, why: 'tampered after the fact' }])).not.toBe(pin);
    expect(m.historyPin([retired])).toBe(pin);
  });

  it('does not touch tests/howto/golden/GOLDEN.json (HT-2\'s generator input)', () => {
    const golden = JSON.parse(readFileSync(new URL('golden/GOLDEN.json', import.meta.url), 'utf8'));
    expect(golden.entries.some((e: { kind: string }) => e.kind === 'layers')).toBe(false);
  });
});

describe('HT4-A1 vendored layers stay outside src', () => {
  it('the layers folder is under tools/plates, not src', async () => {
    if (!m) m = await import(/* @vite-ignore */ MOD_URL);
    expect(m.LAYERS.endsWith(join('tools', 'plates', 'layers'))).toBe(true);
  });
});
