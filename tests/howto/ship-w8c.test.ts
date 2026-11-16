// LIB-SHIP W8c (#429; W8c LAYERS APPROVED 6895226756, rulings 6895200917): the wave's own checks. A5: each re-pinned page's
// W8c layers-page entry whole, with its reds (lesson 2). D-W8C-TEXTZOOM-LOOPS: the exact text-zoom set, with its 3 reds.
// D-W8C-MCHOLD / D-W8C-UNDERHAND / S4: each held id is approved-plate and has no generated file (F-GEN-HELD-CLEAN).
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { pathToFileURL } from 'node:url';
import { SHIPPED } from './shipped-rows';
import { TEXT_ZOOM_SHIPPED, W8C_HELD, W8C_IDS, W8C_LAYERS, W8C_LAYERS_APPROVAL, textZoomSetProblems, w8cLayersProblems, preW8cConfig } from './checks/ship-w8c';

/* eslint-disable @typescript-eslint/no-explicit-any */
const json = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const golden = (b: string) => json(`tests/howto/golden/library/${b}.json`);
const page = (b: string) => readFileSync(`tests/howto/golden/library/${b}.layers.html`);
const copy = (f: any) => structuredClone(f);
const last = (f: any) => f.entries[f.entries.length - 1];

describe('LIB-SHIP W8c A5: the W8c layers-page entry on pilot-b, lb01 and lb03, whole', () => {
  it.each(Object.keys(W8C_LAYERS))('%s: the entry is exact', b => {
    expect(w8cLayersProblems(golden(b), b, page(b))).toEqual([]);
  });
  it.each(Object.keys(W8C_LAYERS))('%s reds: another sha, another comment, a moved page pin, other ids, a moved superseded pin, the committed page moved', b => {
    const red = (mut: (f: any) => void, re: RegExp, pg = page(b)) => { const f = copy(golden(b)); mut(f); expect(w8cLayersProblems(f, b, pg).join('\n')).toMatch(re); };
    red(f => { last(f).approval = W8C_LAYERS_APPROVAL.replace(/@ [0-9a-f]{40}$/, `@ ${'0'.repeat(40)}`); }, /W8c: entry/);
    red(f => { last(f).approval = W8C_LAYERS_APPROVAL.replace('6895226756', '6895200917'); }, /W8c: entry/);
    red(f => { last(f).pageSha256 = `${'f'.repeat(63)}0`; }, /W8c: page pin/);
    red(f => { last(f).ids = [...last(f).ids].reverse(); }, /W8c: ids/);
    red(f => { f.entries[W8C_LAYERS[b]!.supersedes].pageSha256 = `${'e'.repeat(63)}0`; }, /W8c: superseded pin/);
    red(() => {}, /W8c: committed page/, Buffer.concat([page(b), Buffer.from(' ')]));
    red(f => { last(f).decision = 'D-SHIP-W8B-LAYERS'; }, /W8c: entry/);
    red(f => { last(f).supersedes -= 1; }, /W8c: supersedes/);
  });
});

describe('LIB-SHIP W8c D-W8C-TEXTZOOM-LOOPS: the exact set of shipped text-zoom rows', () => {
  const listed = Object.keys(json('tools/plates/library/text-zooms.json').entries);
  const files = readdirSync('src/howto/generated').filter(f => f.startsWith('posture-'));
  const loaders = readFileSync('src/howto/generated/loaders.ts', 'utf8');
  it('the set equals the shipped rows of text-zooms.json; none has a posture chunk or a POSTURE loader line', () => {
    expect(TEXT_ZOOM_SHIPPED).toEqual(['seated_leg_curl']);
    expect(textZoomSetProblems(TEXT_ZOOM_SHIPPED, SHIPPED, listed, files, loaders)).toEqual([]);
    for (const r of SHIPPED.filter(x => TEXT_ZOOM_SHIPPED.includes(x.id.slice(4)))) {
      expect(existsSync(`src/howto/generated/posture-${r.chromeId}.ts`)).toBe(false);
      expect(loaders).not.toContain(`import('./posture-${r.chromeId}')`);
    }
  });
  it('reds: a set entry with a posture chunk; a shipped text-zoom row missing from the set; a non-text-zoom row in the set', () => {
    expect(textZoomSetProblems(TEXT_ZOOM_SHIPPED, SHIPPED, listed, [...files, 'posture-seated-leg-curl.ts'], loaders)).toEqual(['lib_seated_leg_curl: has a posture chunk']);
    expect(textZoomSetProblems(TEXT_ZOOM_SHIPPED, SHIPPED, listed, files, `${loaders}\n  "seated-leg-curl": () => import('./posture-seated-leg-curl'),`)).toEqual(['lib_seated_leg_curl: has a POSTURE loader line']);
    expect(textZoomSetProblems([], SHIPPED, listed, files, loaders)).toEqual(['seated_leg_curl: a shipped text-zoom row missing from the set']);
    expect(textZoomSetProblems([...TEXT_ZOOM_SHIPPED, 'cable_fly'], SHIPPED, listed, files, loaders)).toEqual(['cable_fly: in the set, but not a shipped text-zoom row', 'lib_cable_fly: has a posture chunk', 'lib_cable_fly: has a POSTURE loader line']);
  });
});

describe('LIB-SHIP W8c holds (D-W8C-UNDERHAND, D-W8C-MCHOLD, S4): approved-plate, no generated file', () => {
  const B = Object.fromEntries(['lb01', 'pilot-a', 'lb04'].map(b => [b, json(`tools/plates/library/batches/${b}.json`)]));
  const stage = (id: string) => Object.values(B).map((b: any) => b.rows[id]?.stage).find(Boolean);
  const chrome = (id: string) => id.slice(4).replace(/_/g, '-');
  const stray = (id: string, extra: string[] = []) => [
    ...[...readdirSync('src/howto/generated'), ...extra].filter(f => new RegExp(`^(ht|feel|posture|hand)-${chrome(id)}\\.ts$`).test(f)),
    ...[`docs/research/howto/${id}.json`, `src/slices/howto/css/zoom-${chrome(id)}.css`].filter(existsSync)];
  it('each held id is approved-plate and none is shipped; the shipped W8c ids are not held', () => {
    for (const id of W8C_HELD) expect([id, stage(id)]).toEqual([id, 'approved-plate']);
    expect(SHIPPED.filter(r => W8C_HELD.includes(r.id))).toEqual([]);
    expect(W8C_IDS.filter(id => W8C_HELD.includes(id))).toEqual([]);
  });
  it('no generated file exists for a held id (F-GEN-HELD-CLEAN), nor its palm-flat sub-key chunk; red: a stray file', () => {
    for (const id of W8C_HELD) expect([id, stray(id)]).toEqual([id, []]);
    expect(existsSync('src/howto/generated/handpair-palm-flat-floor-only-hand-ahead-over.ts')).toBe(false);
    expect(stray('lib_mountain_climbers', ['ht-mountain-climbers.ts'])).toEqual(['ht-mountain-climbers.ts']);
  });
});

describe('LIB-SHIP W8c A4: seated_leg_curl is a ruled text-zoom row (HT10 floor = its E 14)', () => {
  const url = (p: string) => pathToFileURL(`${process.cwd()}/${p}`).href;
  it('ht10Ruled is true; its entry passes textZoomRow; reds: the entry removed (floor back to max(15, E)), a checkpoint the sheet lacks', async () => {
    const F = await import(/* @vite-ignore */ url('tools/plates/library/fidelity.mjs')), Z = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs'));
    const sheet = (await import(/* @vite-ignore */ url('tools/plates/library/howto/lib_seated_leg_curl.howto.mjs'))).default;
    const card = json('docs/research/howto/cards/seated_leg_curl.json'), list = Z.readTextZooms();
    expect(await F.ht10Ruled(process.cwd(), 'lib_seated_leg_curl')).toBe(true);
    expect(Z.textZoomRow('lib_seated_leg_curl', sheet, card, list)).toEqual({ ruling: 'D-SHIP-TEXTZOOM', checkpoints: { 'knee-pivot': 'pivot', 'ankle-pad': 'ankle-pad' } });
    expect(F.ht10Floor(14, true)).toBe(14);
    const { lib_seated_leg_curl: _gone, ...less } = list;
    expect(() => Z.textZoomRow('lib_seated_leg_curl', sheet, card, less)).toThrow(/no posture zoom, and no .* entry/);
    expect(F.ht10Floor(14, false)).toBe(15);
    const bad = { ...list, lib_seated_leg_curl: { ...list.lib_seated_leg_curl, checkpoints: { 'knee-pivot': 'pivot', 'ankle-pad': 'ankle' } } };
    expect(() => Z.textZoomRow('lib_seated_leg_curl', sheet, card, bad)).toThrow(/maps to checkpoint ankle, which the sheet's posture does not hold/);
  });
});

describe('LIB-SHIP W8c Q-W8c-4: main 8f112a6d\'s pre-W8c layers configs for the other cards\' scratch stages', () => {
  it.each(['lb01', 'lb03', 'pilot-b'])('%s: the committed config less W8c\'s lines is main\'s (sha-pinned); reds: drift, a W8c line gone', p => {
    const t = readFileSync(`tools/plates/library/pages/${p}.layers.json`, 'utf8');
    expect(() => preW8cConfig(p, t)).not.toThrow();
    expect(() => preW8cConfig(p, t.replace('"optionsModule"', ' "optionsModule"'))).toThrow(/drift/);
    expect(() => preW8cConfig(p, preW8cConfig(p, t))).toThrow(/exactly once/);
  });
});
