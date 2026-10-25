// LIB-6-PM PM-A2 (D-LIB9-ENGINE, D-LIB6PM-PLATE): a library plate's crops and its layers-page plate block come from the
// engine its spec imports. Fixture: LIB-2b's staged tree with the scratch row's spec rewritten to the vendor engine, a
// `poly` part and a flat palm (tests/library/fixtures/engine/vendor-spec.mjs). Golden B's 8 stay on the layers engine:
// their close-up tests (closeups.test.ts) are unedited, and the 8's page is checked at PAGE_SHA256 here.
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let F: any, V: any, cu: any, opts: any, blp: any, layers: any, root = '', specFile = '';
const tmps: string[] = [];

describe('LIB-6-PM engine per plate', { timeout: 300_000 }, () => {
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    V = await import(/* @vite-ignore */ url('tests/library/fixtures/engine/vendor-spec.mjs'));
    cu = await import(/* @vite-ignore */ url('tools/plates/library/render/closeups.mjs'));
    opts = (await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'))).CLOSEUP_OPTIONS;
    blp = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
    layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
    root = F.stageTree(); tmps.push(root);
    specFile = V.toVendor(root, F.SPEC);
  }, 300_000);
  afterAll(() => { for (const t of tmps) rmSync(t, { recursive: true, force: true }); });

  const vendorMod = async () => import(/* @vite-ignore */ F.url(root, F.HOWTO));
  const pullUp = () => import(/* @vite-ignore */ url('tools/plates/layers/exercises/pull_up.howto.mjs'));
  const PULL_UP_SPEC = join(new URL('../../', import.meta.url).pathname, 'tools/plates/layers/exercises/pull_up.mjs');
  const crops = (api: any, howto: any) => howto.zooms.filter((z: any) => z.crop).map((z: any) => api.postureZoom(z)).join('');

  it('a spec importing tools/plates/library/engine.mjs is a vendor spec; golden B\'s pull-up is a layers spec', () => {
    expect(cu.engineNameOf(specFile)).toBe('vendor');
    expect(cu.engineNameOf(PULL_UP_SPEC)).toBe('layers');
  });

  it('the library fixture\'s crops (poly part, flat palm) render through the vendor engine', async () => {
    const mod = await vendorMod(), engine = await cu.engineOf(specFile);
    expect(engine.name).toBe('vendor');
    const html = crops(cu.closeupApi(mod, opts.pull_up, { engine, specFile }), mod.default);
    expect(html).toMatch(/-palm\.r"/);   // vendor body.mjs flatPalm: only the vendor engine draws a palm
    // the same crop through the layers engine: the check refuses it, and the engine itself cannot draw the poly part
    expect(() => cu.closeupApi(mod, opts.pull_up, { engine: cu.LAYERS_ENGINE, specFile }))
      .toThrow('close-ups: lib_cable_lateral_raise: crop engine layers, but its spec imports the vendor engine');
    expect(() => crops(cu.closeupApi(mod, opts.pull_up), mod.default)).toThrow('unknown equipment type: poly');
  });

  it('the engine check throws, naming the id, when a layers spec is cropped through the vendor engine or no spec is named', async () => {
    const mod = await pullUp(), vendor = await cu.engineOf(specFile);
    expect(() => cu.closeupApi(mod, opts.pull_up, { engine: vendor, specFile: PULL_UP_SPEC }))
      .toThrow('close-ups: lib_pull_up: crop engine vendor, but its spec imports the layers engine');
    expect(() => cu.closeupApi(mod, opts.pull_up, { engine: vendor }))
      .toThrow('close-ups: lib_pull_up: crop engine vendor, but its spec imports the layers engine');
    expect(() => cu.closeupApi(mod, opts.pull_up, { specFile: PULL_UP_SPEC })).not.toThrow();
    await expect(cu.plateEngine('pull_up', PULL_UP_SPEC)).resolves.toBe(cu.LAYERS_ENGINE.renderPlate);
  });

  it('a page built for the fixture draws its plate block and crops with the vendor engine', async () => {
    const { layersSpecOf } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/layers-spec.mjs'));
    const stage = mkdtempSync(join(tmpdir(), 'lib6pm-engine-')); tmps.push(stage);
    const page = (await blp.buildLayersPage(layersSpecOf(F.BATCH, { stageDir: stage, root }))).toString('utf8');
    // the plate block (build-page.mjs specExercise, ids `${pre}-n`/`${pre}-m`) carries the vendor flat palm
    expect(page).toContain(`id="${F.CHROME}-n-e-palm.r"`);
    expect(page).toMatch(/id="[^"]*-right-[^"]*palm\.r"|id="[^"]*-wrong-[^"]*palm\.r"/);   // a posture crop's plate too
  });

  it('the 8\'s page is still golden B (PAGE_SHA256), with every new patch applied', async () => {
    expect(layers.sha256(await blp.buildLayersPage(blp.GOLDEN_B_SPEC))).toBe(layers.PAGE_SHA256);
  });
});
