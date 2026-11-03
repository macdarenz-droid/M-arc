// LIB-SHAPES (#377, PLAN RULED): the two library sheet shapes, `none` (NoHandling) and a handled sheet with no hand
// close-up (D-SHIP-C3), on the layers page (tools/plates/library/build-layers-page.mjs patches) and in the app's How-to
// sections (Hand.tsx, LookCloser.tsx). Fixtures: tests/howto/fixtures/lib-shapes/fixture.mjs (F-NONE, F-NOZOOM).
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { alsoRowHtml, chipKeys, chipRowHtml, noHandZoom, type ChipContent, type Registered } from '@/slices/howto/sections/LookCloser';
import { gripHtml, handContentOf } from '@/slices/howto/sections/Hand';
import legPress from '@/howto/generated/ht-leg-press';
import chestPress from '@/howto/generated/ht-machine-chest-press';
import type { BuiltHowTo } from '@/howto/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ALL: Registered = { kind: () => true, feel: true };
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
let F: any, blp: any, layers: any, hands: any, feel: any, zooms: any;
const tmps: string[] = [];
let page = '';

/** The fixture page: F-NONE (leg_press) and F-NOZOOM (machine_chest_press) on one layers page, built like a batch. */
function specOf(dir: string, opts: { noZoom?: string[]; shapes?: Record<string, string>; extra?: Record<string, object>; plain?: string[] } = {}) {
  const files = F.writeShapeFiles(dir, opts.shapes, opts.extra);
  const ids = [...Object.keys(opts.shapes ?? { [F.NONE_ID]: 1, [F.NOZOOM_ID]: 1 }), ...(opts.plain ?? [])];
  return {
    groups: [{ id: 'machines', title: 'Machines', ids }], jump: null, files,
    closeups: Object.fromEntries(ids.map(id => [id, blp.GOLDEN_B_CLOSEUPS[id]])), optionsUrl: blp.GOLDEN_B_OPTIONS_URL,
    noZoom: opts.noZoom ?? F.NOZOOM_LIST,
  };
}
const build = async (opts: Parameters<typeof specOf>[1] = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-shapes-')); tmps.push(dir);
  return (await blp.buildLayersPage(specOf(dir, opts))).toString('utf8') as string;
};
/** The card's element that starts with `open`, by balanced div tags (gen/hands.mjs divAt). */
const divOf = (html: string, open: string) => {
  const a = html.indexOf(open);
  if (a < 0 || html.indexOf(open, a + 1) >= 0) throw new Error(`not exactly one ${open}`);
  return hands.divAt(html, a) as string;
};
const ids = (html: string, pre: string) => [...html.matchAll(new RegExp(`id="${pre}-chip-([a-z-]+)"`, 'g'))].map(m => m[1]);

beforeAll(async () => {
  F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib-shapes/fixture.mjs'));
  blp = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
  layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
  hands = await import(/* @vite-ignore */ url('tools/plates/gen/hands.mjs'));
  feel = await import(/* @vite-ignore */ url('tools/plates/gen/feel.mjs'));
  zooms = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs'));
  page = await build();
}, 120_000);
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

const fNone = (): ChipContent => F.shapeOf(legPress, 'none');
const fNoZoom = (): ChipContent => F.shapeOf(chestPress, 'nozoom');

describe('LIB-SHAPES A1: the 8 unchanged', () => {
  it('golden B\'s page rebuilds byte for byte with the LIB-SHAPES patches applied (PAGE_SHA256)', async () => {
    expect(layers.sha256(await blp.buildLayersPage(blp.GOLDEN_B_SPEC))).toBe(layers.PAGE_SHA256);
  }, 120_000);

  it('GOLDEN.json, the golden-B page and the 8\'s ht-, hand-, posture- and feel- files equal main b9369130', () => {
    const list = ['tests/howto/golden/GOLDEN.json', 'tests/howto/golden/howto-layers.html',
      ...['ht', 'hand', 'posture', 'feel'].flatMap(k => Object.values(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8')) as { chromeId: string }[])
        .map(r => `src/howto/generated/${k}-${k === 'ht' ? (r.chromeId === 'lateral-raise' ? 'dumbbell-lateral-raise' : r.chromeId) : r.chromeId}.ts`))].sort();
    expect(list).toHaveLength(34);
    const h = createHash('sha256');
    for (const p of list) h.update(`${p}\0${sha(readFileSync(p))}\n`);
    expect(h.digest('hex')).toBe('a3b813e132eaff911bec84f8283ffe96bf3ebc8a2d1cfe29d66fa9f1d8585c07');
  });

  it('every patch anchor matches once, and a spec with no noZoom and no `none` row needs none of the new branches', () => {
    const hl = readFileSync('tools/plates/layers/artifact/howto-layers.mjs', 'utf8');
    const src = blp.patchHowtoLayers(hl, blp.planOf(blp.GOLDEN_B_SPEC));
    expect(src).toContain('const __NOZOOM = [];');
    expect(src).toContain("if (handFirst && keys[0] !== 'hand' && !__noZoom(howto)) throw");
  });
});

describe('LIB-SHAPES fixtures', () => {
  it('the fixture edit is the shape and nothing else of the sheet', () => {
    const n: any = fNone(), z: any = fNoZoom();
    expect(n.handling).toEqual({ archetype: 'none', why: F.NONE_WHY });
    expect(n.mistakes).toEqual([]);
    expect(z.handling).toEqual({ ...(chestPress as any).handling, why: F.NOZOOM_WHY });
    for (const [c, base] of [[n, legPress], [z, chestPress]] as const) {
      expect(c.zooms.some((q: any) => q.kind === 'hand')).toBe(false);
      expect(c.zooms).toEqual((base as any).zooms.filter((q: any) => q.kind !== 'hand'));
      expect(JSON.stringify(c)).not.toMatch(/"zoom":"hand"/);
      expect(c.setup.length).toBe((base as any).setup.length);
    }
    expect(z.mistakes.map((m: any) => m.key)).toEqual((chestPress as any).mistakes.map((m: any) => m.key));
  });
});

describe('LIB-SHAPES A2: the `none` sheet', () => {
  it('layers page: posture and Feel chips, posture close-ups and the feel section; no hand close-up, Grip or wrist row', () => {
    expect(ids(page, 'leg-press')).toEqual(['back-on-pad', 'foot', 'feel']);
    expect(zooms.posturePanels(page, 'leg-press').map((p: any) => p.key)).toEqual(['back-on-pad', 'foot']);
    expect(feel.feelSectionOf(page, 'leg-press')).toMatch(/^<section class="hw-sec feel" id="leg-press-feel"/);
    expect(() => hands.handPanel(page, 'leg-press')).toThrow(/no hand close-up/);
    expect(page).not.toContain('id="leg-press-grip"');
    expect(page).not.toContain('id="leg-press-also"');
  });

  it('app: Look closer keeps the posture and Feel chips (handContentOf), with no Hand chip, Grip or wrist row', () => {
    const c = handContentOf(fNone() as unknown as BuiltHowTo);
    expect(c).not.toBeNull();
    const keys = chipKeys(c!, ALL);
    expect(keys).toEqual(['back-on-pad', 'foot', 'feel']);
    // the app's chip row is the layers page's, byte for byte
    expect(chipRowHtml('leg-press', c!, keys)).toBe(divOf(page, '<div class="zx-chips-wrap"><span class="eyebrow" id="leg-press-look"'));
    expect(alsoRowHtml('leg-press', c!)).toBe('');
    expect(() => gripHtml('leg-press', c!)).toThrow(/no grip line/);   // the guard stays: HandSections never calls it
    expect(noHandZoom(c!)).toBe(false);
  });

  it('a `none` row with a grip line, or with handling mistakes, does not build (they would never be shown)', async () => {
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [], extra: { [F.NONE_ID]: { handling: { gripLine: 'Hold lightly.' } } } }))
      .rejects.toThrow(/lib_leg_press: archetype 'none' with a grip line or handling mistakes/);
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [], extra: { [F.NONE_ID]: { mistakes: (legPress as any).mistakes.slice(0, 1) } } }))
      .rejects.toThrow(/lib_leg_press: archetype 'none' with a grip line or handling mistakes/);
  }, 120_000);
});

describe('LIB-SHAPES A3: the handled sheet with no hand close-up', () => {
  it('layers page: grip words and the posture and Feel chips; no Hand chip, hand close-up or wrist row', () => {
    expect(ids(page, 'machine-chest-press')).toEqual(['seat-height', 'blades', 'feel']);
    expect(() => hands.handPanel(page, 'machine-chest-press')).toThrow(/no hand close-up/);
    expect(page).not.toContain('id="machine-chest-press-also"');
    const grip = (chestPress as any).handling;
    expect(page).toContain(`<p class="grip-lead">${grip.gripLine}</p>`);
  });

  it('app: the same chips and Grip section as the page; no Hand chip or wrist row', () => {
    const c = handContentOf(fNoZoom() as unknown as BuiltHowTo)!;
    expect(noHandZoom(c)).toBe(true);
    const keys = chipKeys(c, ALL);
    expect(keys).toEqual(['seat-height', 'blades', 'feel']);
    expect(chipRowHtml('machine-chest-press', c, keys)).toBe(divOf(page, '<div class="zx-chips-wrap"><span class="eyebrow" id="machine-chest-press-look"'));
    expect(alsoRowHtml('machine-chest-press', c)).toBe('');
    const a = page.indexOf('<section class="hw-sec grip" id="machine-chest-press-grip"');
    expect(gripHtml('machine-chest-press', c)).toBe(page.slice(a, page.indexOf('</section>', a) + '</section>'.length));
  });

  it('a row off the list (builder) or without `why` (app) throws exactly as today', async () => {
    await expect(build({ shapes: { [F.NOZOOM_ID]: 'nozoom' }, noZoom: [] }))
      .rejects.toThrow(/lib_machine_chest_press: load goes through the hands, Hand must be the first chip/);
    const bare = { ...fNoZoom(), handling: (chestPress as any).handling } as ChipContent;
    expect(noHandZoom(bare)).toBe(false);
    expect(() => chipKeys(bare, ALL)).toThrow('lib_machine_chest_press: load goes through the hands, Hand must be the first chip');
    expect(() => alsoRowHtml('machine-chest-press', bare)).toThrow('lib_machine_chest_press: push exercise without a hand close-up');
    const blank = { ...fNoZoom(), handling: { ...(chestPress as any).handling, why: ' ' } } as ChipContent;
    expect(() => chipKeys(blank, ALL)).toThrow(/Hand must be the first chip/);
  }, 120_000);

  it('the builder refuses a listed id that is off the page, has a hand close-up, is `none` or has no `why`', async () => {
    expect(() => blp.planOf({ ...blp.GOLDEN_B_SPEC, noZoom: ['nope'] })).toThrow('layers page: noZoom: nope is not on the page');
    expect(() => blp.planOf({ ...blp.GOLDEN_B_SPEC, noZoom: ['leg_press', 'leg_press'] })).toThrow(/distinct/);
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [F.NONE_ID] })).rejects.toThrow(/lib_leg_press: on the no-zoom list, but not a handled sheet/);
    await expect(build({ shapes: {}, plain: ['pull_up'], noZoom: ['pull_up'] })).rejects.toThrow(/lib_pull_up: on the no-zoom list, but it has a hand close-up/);
    await expect(build({ shapes: { [F.NOZOOM_ID]: 'nozoom' }, extra: { [F.NOZOOM_ID]: { handling: { why: '' } } } }))
      .rejects.toThrow(/lib_machine_chest_press: on the no-zoom list, but handling.why is empty/);
  }, 120_000);
});
