// F-ZOOM-NONE (card docs/supervisor/verify/f-zoom-none-card.md): a library sheet with no drawn posture close-up.
// A3 baseline: the body (after the GENERATED header line, whose inputsSha256 moves with the generators) of every
// posture chunk and of loaders.ts stays byte-equal to main e623d3ef for every row that has posture zooms.
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { child, IN_CHILD } from '../child-test';

const GEN = join(__dirname, '../../src/howto/generated');
const sha = (s: string) => createHash('sha256').update(s).digest('hex');
const body = (n: string) => { const t = readFileSync(join(GEN, n), 'utf8'); return t.slice(t.indexOf('\n') + 1); };

// sha256 of each body on main e623d3ef (train 68, LIB-SHIP W2; re-pinned from cb9a6dae as ruled on #388)
const BODY_MAIN: Record<string, string> = {
  // LIB-SHIP W3 (D-SHIP-A9 guard replacement): loaders.ts gains W3's 9 ids (was a168345b… on main e623d3ef); the 16 main
  // posture bodies below are unchanged, and W3's 9 posture chunks are pinned at the W3 flip
  'loaders.ts': 'e7bc1d4076c810044e534195d8cc2f6af4a8fe7d1e36372b5a7aae364561029b',
  'posture-chest-supported-row.ts': '9057b9c71faeb9b00d35e9762d832bde66d9c00d3792241a4b0d724ea1ede167',
  'posture-chin-up.ts': '90335f3138f0ffb5cc86075cdf845aae859cb45910234bbc56e3733c71a45d8f',
  'posture-close-grip-pulldown.ts': 'e1d097991fedb4e2fdbfec6b36ea15df0608ce732da6d1e41f4c35487e30442f',
  'posture-hanging-knee-raise.ts': 'c07a0edc3af8d980c1a322f6d36c180bfb5d72bfbcc168d04c7cff70cd20b77a',
  'posture-horizontal-leg-press.ts': 'a0192b1cfcbb3250bf732f9d7120e62c663dafc59878a5cd5f16f3f0990422cf',
  'posture-inverted-row.ts': '09ee0c7337d380f4316230ba8dae440d4244688570f45c4f0937f1000663f15a',
  'posture-resistance-band-row.ts': '0410b9130c5dd3d4f5b9a50af51d6fbed7b263b59a468eb97163770048ea5191',
  'posture-single-arm-lat-pulldown.ts': 'a536a4027af2f9dae65f38620c408f2435a51c3101e86d7886d67dd6a3c27241',
  'posture-straight-arm-pulldown.ts': '0a612d407a40d7c9f763530caa4f9b46ec3fedb5f12a21b31cfa5ed536b7c240',
  'posture-barbell-back-squat.ts': '8bdf3354ed3ce298e8bad7bb350da8b43d95518b760d9d5ffc70861ce94f49ff',
  'posture-barbell-row.ts': 'e850b0b614f48bba162455e1aa4184170c1bf1f055f8c9d27b7924ea49915076',
  'posture-cable-fly.ts': 'bc032278ce45e8254202c82398bdc26a4ba2cefde36f32b175d64b83cd6aba84',
  'posture-dumbbell-bench-press.ts': 'c11d62efa46549ca0b69b42c48a67da9e0566cbdcda9739a5b580b1bb0d77693',
  'posture-dumbbell-biceps-curl.ts': 'af709c0ebf1007fc9be41bc7d103f1a63a3155d27dbc4d242274605f57f80dfb',
  'posture-dumbbell-shoulder-press.ts': '203f9b3c5bbc7a3be33a8b8a88a9526afd9272b0b8fd2b543f51bdc7214c4d1e',
  'posture-hanging-leg-raise.ts': '3e110802371f1eb33bdc0d9f0d81351d14f06989988061a3546c5c2ee9490770',
  'posture-lat-pulldown.ts': 'e18443a93706e3b113f7fa396fab4280be8463751bd99d2df1dae0f6cdfe9b7a',
  'posture-lateral-raise.ts': 'bc056d612aa8708123f998b212080a210fe685faa217ebe477890d8705d238fe',
  'posture-leg-press.ts': '0a3042da1d567d8dc235efddc6403927a9df8cfc15785959446112452e640ead',
  'posture-machine-chest-press.ts': '3eea3f10928dd4746134bcdf4649cbcc24307ae2510a9f127634df01a6bcb396',
  'posture-plank.ts': '35d303d9a497c0668e0d8c9c6af19530e5a7252f34be3fc7108b4aa666cd18dd',
  'posture-pull-up.ts': 'fe028fcb5a6e5a15442fc550e00943d9e9532685b02497b4f4a02a9394e40989',
  'posture-push-up.ts': '14f6f8bc21c14f1c815a7e5c12efc17f75b2a7832f7ad481a12e58b872aae8ad',
  'posture-rope-triceps-pushdown.ts': '11ab224a6c1e0398f113da086e80f63f48a708d015ec8f388986c99017299df7',
  'posture-seated-cable-row.ts': '2007a1077ddab305d1c64494196cac0e6a388766834eb077a5207e7f6fe93d3a',
  'posture-upright-row.ts': '4ea58d5ad84139b2e9226623f9bd27235b79963c3945fc2f226636d522d5dcfd',
};

describe('F-ZOOM-NONE A3: rows with posture zooms generate what they generate on main', () => {
  it('every posture chunk and loaders.ts body is byte-equal to main', () => {
    const now = readdirSync(GEN).filter(n => /^posture-.*\.ts$|^loaders\.ts$/.test(n)).sort();
    expect(now).toEqual(Object.keys(BODY_MAIN).sort());
    for (const [n, want] of Object.entries(BODY_MAIN)) expect([n, sha(body(n))]).toEqual([n, want]);
  });
});

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let Z: any, I: any, F: any, L: any;
const SHEET = { zooms: [{ key: 'hand', kind: 'hand' }], posture: [{ key: 'pivot' }, { key: 'pad' }], setup: [{ zoom: 'hand' }], mistakes: [], feel: { rows: [] } };
const CARD = { zooms: [{ key: 'knee-pivot', kind: 'posture' }, { key: 'ankle-pad', kind: 'posture' }, { key: 'grip', kind: 'hand' }] };
const ENTRY = { ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'knee-pivot': 'pivot', 'ankle-pad': 'pad' } };
const ok = (list: any = { lib_x: ENTRY }, sheet: any = SHEET, card: any = CARD) => Z.textZoomRow('lib_x', sheet, card, list);

beforeAll(async () => {
  Z = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs'));
  I = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
  F = await import(/* @vite-ignore */ url('tests/howto/fixtures/zoom-none/fixture.mjs'));
  L = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
});

describe('F-ZOOM-NONE A2: textZoomRow, the zero-zoom guard', () => {
  it('a ruled zero-zoom row gives its entry; a row with posture zooms and no entry gives null; the real list is empty on main', () => {
    expect(ok()).toEqual(ENTRY);
    expect(Z.textZoomRow('lib_y', { ...SHEET, zooms: [{ key: 'back', kind: 'posture' }] }, CARD, {})).toBeNull();
    expect(Z.readTextZooms()).toEqual({});
    expect(I.TEXT_ZOOMS).toBe(Z.TEXT_ZOOMS);
    expect([...Z.TEXT_ZOOM_RULINGS]).toEqual(['D-SHIP-TEXTZOOM']);
  });
  it('red 1: a card posture zoom not mapped, or mapped to a checkpoint the sheet lacks (the card zoom is drawable)', () => {
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { 'knee-pivot': 'pivot' } } })).toThrow(/card zoom ankle-pad is drawable/);
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { ...ENTRY.checkpoints, 'ankle-pad': 'calves' } } })).toThrow(/maps to checkpoint calves, which the sheet's posture does not hold/);
  });
  it('red 2: no entry, no ruling, a ruling outside the set', () => {
    expect(() => ok({})).toThrow(/no posture zoom, and no tools\/plates\/library\/text-zooms.json entry/);
    expect(() => ok({ lib_x: { checkpoints: ENTRY.checkpoints } })).toThrow(/ruling undefined is not one of D-SHIP-TEXTZOOM/);
    expect(() => ok({ lib_x: { ...ENTRY, ruling: 'D-SHIP-C3' } })).toThrow(/ruling "D-SHIP-C3" is not one of/);
  });
  it('red 4: an entry for a row with posture zooms, a zoom the card lacks, a dangling link, a ruled page holding a posture close-up', () => {
    expect(() => ok(undefined, { ...SHEET, zooms: [...SHEET.zooms, { key: 'pivot', kind: 'posture' }] })).toThrow(/has posture zooms \[pivot\], but tools\/plates\/library\/text-zooms.json names it/);
    expect(() => ok({ lib_x: { ...ENTRY, checkpoints: { ...ENTRY.checkpoints, seat: 'pivot' } } })).toThrow(/names card zoom seat, which the card's posture zooms do not hold/);
    expect(() => ok(undefined, { ...SHEET, posture: [{ key: 'pivot', zoom: 'knee-pivot' }, { key: 'pad' }] })).toThrow(/links to close-ups the sheet does not have: knee-pivot/);
    expect(() => ok(undefined, { ...SHEET, feel: { rows: [{ zoom: 'pad-zoom' }] } })).toThrow(/does not have: pad-zoom/);
    const page = '<div class="zx" id="x-zoom-hand" data-zoom="hand"></div><div class="zx" id="x-zoom-pivot" data-zoom="pivot"></div>';
    expect(() => Z.textZoomPageCheck('lib_x', page, 'x', 'p.html')).toThrow(/ruled in .*, but p.html holds posture close-ups \[pivot\]/);
    const card = (inner: string) => `<article class="sheet-card" id="card-x">${inner}<div class="zx" id="x-zoom-hand" data-zoom="hand"></div></article>`;
    expect(() => Z.textZoomPageCheck('lib_x', card('<button class="zx-chip" data-zoom="hand"></button>'), 'x', 'p.html', ['hand'])).not.toThrow();
    expect(() => Z.textZoomPageCheck('lib_x', card('<button class="fr-show" data-zoom="pivot"></button>'), 'x', 'p.html', ['hand'])).toThrow(/its card on p.html opens close-ups it does not have \[pivot\]/);
  });
  it('the zero-zoom path only (#388 review, Low): a drawn-zoom row with no entry never reads its card', () => {
    const none = () => { throw new Error('card read'); };
    expect(Z.textZoomOfSheet('lib_y', { ...SHEET, zooms: [{ key: 'back', kind: 'posture' }] }, {}, none)).toBeNull();
    expect(() => Z.textZoomOfSheet('lib_x', SHEET, { lib_x: ENTRY }, none)).toThrow(/card read/);
    expect(Z.textZoomOfSheet('lib_x', SHEET, { lib_x: ENTRY }, () => CARD)).toEqual({ entry: ENTRY, own: ['hand'] });
  });
  it('ids.mjs missingChunks: a ruled row needs no posture chunk; without the ruling (the guard removed) it throws as today', () => {
    const row = { id: 'lib_x', slug: 'x', chromeId: 'x' }, has = (n: string) => n !== 'posture-x';
    expect(() => I.missingChunks([row], has, { x: 'k' }, {}, () => true, {}, new Set(['lib_x']))).not.toThrow();
    expect(() => I.missingChunks([row], has, { x: 'k' }, {}, () => true)).toThrow(/ids: lib_x: no src\/howto\/generated\/posture-x.ts/);
    expect(() => I.missingChunks([row], () => true, { x: 'k' }, {}, () => true, {}, new Set(['lib_x']))).not.toThrow();
  });
});

// A1 (amended, D-TEXT-GOLDEN): LIB-2b's scratch row made zero-zoom in a temp tree (tests/howto/fixtures/zoom-none)
// generate runs in an awaited child process, so no long synchronous block holds this worker's RPC (F-VITEST-RPC)
type Gen = { status: number; stderr: string };
const gen = (root: string) => new Promise<Gen>(res => execFile(process.execPath, ['tools/plates/generate.mjs'], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 },
  (e, _out, stderr) => res({ status: e ? ((e as { code?: number }).code ?? 1) : 0, stderr: String(stderr) })));
let tree = '', first: Gen, guardless: Gen, keptPanel: Gen, keptButton: Gen;
const extra: string[] = [];
describe('F-ZOOM-NONE A1: a ruled zero-zoom row generates no posture chunk; with the guard removed it throws', () => {
  beforeAll(async () => {
    if (!IN_CHILD) return;   // the tree is built in the child process (F-VITEST-RPC)
    tree = F.zeroZoomTree();
    first = await gen(tree);
    F.guardOff(tree);
    guardless = await gen(tree);
    // the page-check reds through generate (#388 review, Medium): the ruled row's page keeps one posture close-up, or
    // one control that opens it
    for (const keep of ['panel', 'button']) {
      const t = F.zeroZoomTree({ keep });
      extra.push(t);
      const r = await gen(t);
      if (keep === 'panel') keptPanel = r; else keptButton = r;
    }
  }, 900_000);
  afterAll(() => { if (tree) L.drop(tree); for (const t of extra) L.drop(t); });
  child.it('generate passes, writes the row\'s ht- and feel- chunks and no posture chunk; loaders.ts has no POSTURE line for it', () => {
    expect([first.status, first.stderr.split('\n').filter((l: string) => /Error/.test(l)).slice(0, 3)]).toEqual([0, []]);
    const g = join(tree, 'src/howto/generated');
    expect(existsSync(join(g, `ht-${L.CHROME}.ts`))).toBe(true);
    expect(existsSync(join(g, `feel-${L.CHROME}.ts`))).toBe(true);
    expect(existsSync(join(g, `posture-${L.CHROME}.ts`))).toBe(false);
    const loaders = readFileSync(join(g, 'loaders.ts'), 'utf8'), posture = loaders.slice(loaders.indexOf('export const POSTURE'), loaders.indexOf('export const FEEL'));
    expect(posture.length).toBeGreaterThan(0);
    expect(posture).not.toContain(`"${L.CHROME}"`);
    expect(loaders).toContain(`lib_cable_lateral_raise: () => import('./ht-${L.CHROME}')`);
  }, 600_000);
  child.it('red 3: the same tree with the guard removed (today\'s code) throws "no posture close-up"', () => {
    expect(guardless.status).not.toBe(0);
    expect(guardless.stderr).toContain(`zooms: ${L.CHROME}: no posture close-up in the golden-B page`);
  }, 600_000);
  child.it('red 4 through generate: a ruled row whose page keeps a posture close-up, or a control that opens one, is refused', () => {
    expect(keptPanel.status).not.toBe(0);
    expect(keptPanel.stderr).toContain(`zooms: ${L.ID}: ruled in tools/plates/library/text-zooms.json, but tests/howto/golden/library/zz-lib2b.layers.html holds posture close-ups [top]`);
    expect(keptButton.status).not.toBe(0);
    expect(keptButton.stderr).toContain(`zooms: ${L.ID}: ruled in tools/plates/library/text-zooms.json, but its card on tests/howto/golden/library/zz-lib2b.layers.html opens close-ups it does not have [top]`);
  }, 900_000);
});
