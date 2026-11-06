// F-PAIR-FAULTS (card docs/supervisor/verify/f-pair-faults-card.md): a row draws only the pair-key faults its card
// supports. A1/A2 baseline: with no row naming `pairFaults`, every pair key's panel stays byte-equal to main cb9a6dae.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any, B: any, hp: any, ids: any;
const tmps: string[] = [];

beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  B = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
  hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
  ids = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
});
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

// sha256 of pairPanel(key) for every pair key on main cb9a6dae, before F-PAIR-FAULTS
const PANEL_MAIN: Record<string, string> = {
  'bar-hang-under': '203b7a6dcded4b39f95ad5692c868b0fb3f68766f47303b074778ff46b8d6c2a',
  'bar-hang-over': 'aa37b9b1148fe952194a16d06b0bdc1460e196234bee8954d2bd9df47b5e815a',
  'bar-row-over': '25a00e12d83269be574fc859c42d7a3f1c2f2f5ac2e8947c4130d8a73a82c82c',
  'bar-pulldown-under': 'aba559e2f12c8b92aef841dfade6c789271b699b98f5d469fe5ecb494309e4ba',
  'battle-rope-rope-neutral': '0d33228ab6b78b07b8a27bab7a004e020502fdb50aaa0907574f84715f8c46ec',
  'curl-dumbbell-under': 'dadfb69230f57ddbbe47d0f74ee4df9fea13c145a56bf5e7ed171e49587406f9',
  'curl-dumbbell-neutral': '4f101e1434d1e4607c1fb2f56de0ff8f6c2bda0cd9f92f152e8ec9f23cc509d9',
  'curl-bar-under': 'bcb90ca4ee701f9a704160011a32aae23742272c499def66a8ad3be9a9a17791',
  'd-handle-pull-unstated': '7a4c228ee554b1e99b32363a8ebfecb7865531a109e60790a8b71d4592da8dfe',
  'ez-curl-angled': '1b6894005190b4065b210c4c2024ac7f8ff842d6564736c7927e67bc6bf1f032',
  'ez-curl-under': '113c98b5f9f10ab9d6e3ed78bd08e8f231586f390528329f0f209d43c14ba0e4',
  'ez-curl-over': '1d790be9181fbdb03670c84a784c330230415cd6891c7f114707088d1273d89b',
  'palm-flat-floor-over': '938dc3fc139f2bad1fa0fc6f97a1f809dbda7d8cc49c3684d0d86c4be1be10ca',
  'rope-push-neutral': 'bfb1fe4603c15fbc0a3f1eec96825d041530f6aa068a998fe29eb988cfa07946',
  'v-handle-pull-neutral-overhead': 'c73a6c0815d189f9c09d5f17ecae4db1d2439d36b57a434f7c3cb879fae58f13',
};

describe('F-PAIR-FAULTS A1/A2: a pair key with no row filter draws what it draws on main', () => {
  it('pairPanel(key) is byte-equal to main for every pair key', async () => {
    expect([...P.keysOf()].sort()).toEqual(Object.keys(PANEL_MAIN).sort());
    for (const [k, want] of Object.entries(PANEL_MAIN)) expect([k, sha(await P.pairPanel(k))]).toEqual([k, want]);
  }, 60_000);
});

// A4: mountain_climbers names pairFaults ['hand-ahead'] in a scratch config only (its sheet flips in a later LIB-SHIP wave)
const BASE = 'palm-flat-floor-over', SUB = 'palm-flat-floor-only-hand-ahead-over', CARD = 'cards/mountain_climbers.json';
const MC = { optionsKey: 'mountain_climbers', pair: BASE, pairFaults: ['hand-ahead'] };
const MCW = { ...MC, pairWords: { 'hand-ahead': { wrong: { text: 'Hands ahead of the shoulders', source: `${CARD} zooms[hand-under-shoulder].wrong, c2/c6/c19` } } } };
const pagesIn = (h: string) => h.split('<div class="zx-page" data-page=').length - 1;
const subsOf = (rows: Record<string, unknown>) => P.subKeysOf([{ file: 'scratch.layers.json', closeups: rows }]).subs;
const panelWith = (subs: unknown) => (k: string) => P.pairPanel(k, P.INDEX, subs);
// a host page around the hand block, as withPairPanels needs it: the card's hand zx block, a reference, and HOWTO_CSS
// after the close-up CSS (build-page.mjs)
const HOWTO = (() => { const src = readFileSync(join(__dirname, '../../tools/plates/layers/artifact/build-page.mjs'), 'utf8'), a = src.indexOf('const HOWTO_CSS = `');
  return src.slice(a + 'const HOWTO_CSS = `'.length, src.indexOf('\n`;', a) + 1); })();
const host = (pre: string) => `<style>\n${HOWTO}</style><article class="sheet-card" id="card-${pre}"><button data-zoom="hand" aria-expanded="false" aria-controls="${pre}-zoom-hand">Hand</button>`
  + `<div class="zx" id="${pre}-zoom-hand" data-zoom="hand" hidden><h4 id="${pre}-zoom-hand-h">x</h4></div></article>`;

describe('F-PAIR-FAULTS A1/A4: a row with pairFaults draws only those faults (layers page and app chunk)', () => {
  it('rowFilterOf / rowKeyOf: the sub-key, its faults; a row with neither field keeps its pair', () => {
    expect(P.rowFilterOf('lib_mountain_climbers', MC)).toMatchObject({ sub: SUB, base: BASE, faults: ['hand-ahead'], id: 'mountain_climbers' });
    expect(P.rowKeyOf('mountain_climbers', MC)).toBe(SUB);
    expect(P.rowKeyOf('mountain_climbers', { pair: BASE })).toBe(BASE);
    expect(P.rowKeyOf('mountain_climbers', undefined)).toBeUndefined();
    expect(P.rowFilterOf('mountain_climbers', { pair: BASE })).toBeNull();
  });
  it('pairPanel(sub-key): one page, the hand-ahead drawing under hp-<sub>- ids; pairWords replace only their slot', async () => {
    const h = await P.pairPanel(SUB, P.INDEX, subsOf({ lib_mountain_climbers: MC })), full = await P.pairPanel(BASE);
    expect([pagesIn(h), pagesIn(full)]).toEqual([1, 2]);
    expect(h.startsWith(`<div class="zx" id="hp-${SUB}-zoom-hand" data-zoom="hand"`)).toBe(true);
    expect([...h.matchAll(/\sid="([^"]+)"/g)].every(m => m[1]!.startsWith(`hp-${SUB}-`))).toBe(true);
    expect(h).toContain(`id="hp-${SUB}-hand-ahead-`);
    expect(h).not.toContain('cupped-palm');
    expect(h).not.toContain('Palm cupped');
    // the drawing is hand-ahead's, byte for byte, apart from its uid
    const svg = (x: string) => x.match(/<div class="hand-plate">([\s\S]*?)<\/div>/)![1]!;
    const baseAhead = P.renderPair('mountain_climbers', { fault: 'hand-ahead', uid: `hp-${BASE}-hand-ahead` }).svg, subAhead = P.renderPair('mountain_climbers', { fault: 'hand-ahead', uid: `hp-${SUB}-hand-ahead` }).svg;
    expect(subAhead.split(`hp-${SUB}-hand-ahead`).join(`hp-${BASE}-hand-ahead`)).toBe(baseAhead);
    // and the panel's one page is that drawing, as the base panel's hand-ahead page is the base one (ids aside)
    const fullAhead = full.slice(full.indexOf('<div class="zx-page" data-page="1"'));
    expect(svg(h).split(`hp-${SUB}-`).join(`hp-${BASE}-`)).toBe(svg(fullAhead));
    const w = await P.pairPanel(SUB, P.INDEX, subsOf({ lib_mountain_climbers: MCW }));
    expect(w).toContain('Hands ahead of the shoulders');
    expect(w.replace('Hands ahead of the shoulders', 'Hand ahead')).toBe(h);
  });
  it('withPairPanels: the row\'s block is the sub-key panel (one page), pairPanelProblems is clean; red when the filter is dropped', async () => {
    const subs = subsOf({ lib_mountain_climbers: MC }), panelOf = panelWith(subs);
    const spec = { closeups: { mountain_climbers: MC } }, page = await B.withPairPanels(host('mountain-climbers'), spec, panelOf);
    expect(page).toContain(`<div class="hx hx-hp-${SUB}">`);
    expect(page).toContain(`aria-controls="hp-${SUB}-zoom-hand"`);
    expect(pagesIn(page)).toBe(1);
    expect(page).toContain(`/* close-ups: ${B.PAIR_LABEL} hp-${SUB} */\n${B.pairCss(SUB)}`);
    expect(await B.pairPanelProblems(page, panelOf)).toEqual([]);
    // red 4: the filter removed (the row's pairFaults ignored) draws the base key's two pages
    const dropped = await B.withPairPanels(host('mountain-climbers'), spec, panelOf, (_: string, r: any) => r.pair);
    expect(pagesIn(dropped)).toBe(2);
    expect(dropped).not.toContain(`hx-hp-${SUB}`);
    // a byte changed in the sub-key block is red in pairPanelProblems
    expect((await B.pairPanelProblems(page.replace('Hand: right and wrong', 'Hand: right and wronG'), panelOf)).join('\n')).toMatch(new RegExp(`first copy on ${SUB}: not pairPanel`));
  });
  it('A1: a row with no pairFaults gets pairPanel(pair) byte for byte, as on main', async () => {
    const page = await B.withPairPanels(host('mountain-climbers'), { closeups: { mountain_climbers: { optionsKey: 'mountain_climbers', pair: BASE } } });
    expect(B.divAt(page, page.indexOf('<div class="zx"'))).toBe(await P.pairPanel(BASE));
    expect(sha(await P.pairPanel(BASE))).toBe(PANEL_MAIN[BASE]);
  });
  it('the app: configPairOf gives the sub-key, the ids map points at handpair-<sub>, the chunk holds one page', async () => {
    const root = mkdtempSync(join(tmpdir(), 'fpf-')); tmps.push(root);
    writeFileSync(join(root, 'x.layers.json'), JSON.stringify({ closeups: { lib_mountain_climbers: MC } }));
    writeFileSync(join(root, 'y.layers.json'), JSON.stringify({ closeups: { lib_mountain_climbers: { optionsKey: 'mountain_climbers', pair: BASE } } }));
    const row = (f: string) => ({ id: 'lib_mountain_climbers', chromeId: 'mountain-climbers', pages: { layersConfig: f } });
    await hp.loadPairs();
    expect(hp.configPairOf(row('x.layers.json'), root)).toBe(SUB);
    expect(hp.configPairOf(row('y.layers.json'), root)).toBe(BASE);
    const pairs = { HAND_OF_ID: { lib_mountain_climbers: SUB } }, all = [row('x.layers.json')];
    const { pairOf, keys } = hp.pairsOf(pairs, ['lib_mountain_climbers'], all);
    expect([pairOf, keys]).toEqual([{ 'mountain-climbers': SUB }, [SUB]]);
    expect(ids.chunkMaps(all, () => false, pairOf).hand).toEqual([['mountain-climbers', `handpair-${SUB}`]]);
    expect(() => hp.pairRowCheck(row('x.layers.json'), SUB, SUB, 'palm-flat', '')).not.toThrow();
    const text = hp.pairText(SUB, await P.pairPanel(SUB, P.INDEX, subsOf({ lib_mountain_climbers: MC })));
    expect(pagesIn(JSON.parse(text.match(/export const panel = (.*);\n$/)![1]!))).toBe(1);
  });
  it('subKeysOf: the sub-key and the id map from a config; the same id on two sub-keys is red; main names none', () => {
    const { subs, ofId } = P.subKeysOf([{ file: 'x.layers.json', closeups: { lib_mountain_climbers: MC, lib_push_up: { pair: BASE } } }]);
    expect([[...subs.keys()], [...ofId]]).toEqual([[SUB], [['mountain_climbers', SUB]]]);
    expect(subs.get(SUB).config).toBe('x.layers.json');
    expect(() => P.subKeysOf([{ file: 'x', closeups: { lib_mountain_climbers: MC } }, { file: 'y', closeups: { lib_mountain_climbers: { ...MC, pairFaults: ['hand-ahead', 'hand-ahead'] } } }])).toThrow(/repeats/);
    expect(Object.values(P.HAND_OF_ID).filter((k: any) => k.includes('-only-'))).toEqual([]);
    expect([...P.keysOf()].sort()).toEqual(Object.keys(PANEL_MAIN).sort());
  });
});

describe('F-PAIR-FAULTS A3: the reds', () => {
  const red = (row: Record<string, unknown>, re: RegExp) => expect(() => P.rowFilterOf('lib_mountain_climbers', row)).toThrow(re);
  it('1: an entry that is not a fault of the key', () => red({ ...MC, pairFaults: ['hand-ahead', 'wrist-bent'] }, /wrist-bent not a fault of palm-flat-floor-over/));
  it('2: an entry the card does not support (cupped-palm cites only shared/palm-flat.json)', () => {
    red({ ...MC, pairFaults: ['cupped-palm'] }, /cupped-palm not supported by docs\/research\/howto\/cards\/mountain_climbers.json/);
    // the rule itself: a card that holds neither c6 as a claim nor in its hand zoom does not support hand-ahead
    const ahead = P.pairSpec('mountain_climbers').wrong.find((w: any) => w.key === 'hand-ahead');
    expect(P.cardSupports(ahead, 'mountain_climbers', { claims: [{ id: 'c6' }], zooms: [] })).toBe(true);
    expect(P.cardSupports(ahead, 'mountain_climbers', { claims: [], zooms: [{ kind: 'hand', claim: ['c6'] }] })).toBe(true);
    expect(P.cardSupports(ahead, 'mountain_climbers', { claims: [{ id: 'c2' }], zooms: [{ kind: 'posture', claim: ['c6'] }] })).toBe(false);
    expect(P.cardSupports(ahead, 'push_up', { claims: [{ id: 'c6' }], zooms: [] })).toBe(false);
  });
  it('3: an empty list; also a non-list, a non-string, a repeat, pairFaults without pair, pairWords without pairFaults', () => {
    red({ ...MC, pairFaults: [] }, /pairFaults is empty/);
    red({ ...MC, pairFaults: 'hand-ahead' }, /not a list/);
    red({ ...MC, pairFaults: [1] }, /non-string/);
    red({ ...MC, pairFaults: ['hand-ahead', 'hand-ahead'] }, /repeats/);
    red({ optionsKey: 'mountain_climbers', pairFaults: ['hand-ahead'] }, /without pair/);
    red({ pair: BASE, pairWords: {} }, /pairWords without pairFaults/);
    expect(() => B.pairRowsOf({ closeups: { mountain_climbers: { pairFaults: ['hand-ahead'] } } })).toThrow(/mountain_climbers: pairFaults or pairWords without pair/);
    red({ ...MC, pair: 'curl-dumbbell-under' }, /mountain_climbers is not drawn on curl-dumbbell-under/);
  });
  it('4: the filter removed draws two pages (also in the withPairPanels block above)', async () => {
    const subs = subsOf({ lib_mountain_climbers: MC }), t = subs.get(SUB);
    const unfiltered = new Map([[SUB, { ...t, faults: ['cupped-palm', 'hand-ahead'] }]]);
    expect(pagesIn(await P.pairPanel(SUB, P.INDEX, unfiltered))).toBe(2);
    expect(pagesIn(await P.pairPanel(SUB, P.INDEX, subs))).toBe(1);
  });
  it('5: a pairWords slot for a fault not drawn, a source not citing the card, an unknown slot', () => {
    red({ ...MC, pairWords: { 'cupped-palm': { wrong: { text: 'x', source: CARD } } } }, /pairWords for cupped-palm, which pairFaults does not draw/);
    red({ ...MC, pairWords: { 'hand-ahead': { wrong: { text: 'x', source: 'shared/palm-flat.json#c3' } } } }, /source does not cite cards\/mountain_climbers.json/);
    red({ ...MC, pairWords: { 'hand-ahead': { caption: { text: 'x', source: CARD } } } }, /caption is not one of/);
  });
});

// A2: tools/plates/library/MANIFEST.json moves only the keys of the files this card changes (manifestOf, D-CROP-PIN form)
const MOVED = ['tools/plates/library/build-layers-page.mjs', 'tools/plates/library/hands/pairs.mjs'];
// sha256 of main cb9a6dae's MANIFEST.json (JSON.stringify of the parsed file) with MOVED's values blanked in every row
const MANIFEST_BLANKED_MAIN = 'd7f80b6f1768f11a08abfcb1ecaa28bad6c429f2a276cfe0619106dae8d728c0';
const blanked = (m: any, keys = MOVED) => { const c = structuredClone(m); for (const r of Object.values<any>(c.rows)) for (const k of keys) if (k in r.files) r.files[k] = ''; return sha(JSON.stringify(c)); };
// LIB-SHIP W2 (#379, merge of main cf28ab23, both sides kept): W2 also re-pins these keys (the D-CROP-PIN / D-SHAPES-PIN
// lessW2 list in crop-projection.test.ts and lib-shapes.test.ts), adds these keys to these rows and adds PILOT-B2's lib_crunch
// row. Each W2 key pins its file's current sha; with W2's changes taken out as well, the manifest is main cb9a6dae's with
// MOVED and W2_MOVED blanked (49909603): every other entry still equals main.
const W2_MOVED = ['tools/plates/library/batches/pilot-a.json', 'tools/plates/library/batches/pilot-b.json',
  ...['barbell_overhead_press', 'barbell_row', 'bent_over_dumbbell_rear_delt_fly', 'box_jump', 'cable_fly', 'dumbbell_bench_press', 'dumbbell_fly',
    'dumbbell_shoulder_press', 'mountain_climbers', 'pec_fly', 'plank', 'push_up', 'reverse_lunge', 'romanian_deadlift', 'rope_triceps_pushdown',
    'seated_leg_curl', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'upright_row'].map(id => `tools/plates/library/howto/lib_${id}.howto.mjs`),
  'tools/plates/library/pages/pilot-a.closeups.mjs', 'tools/plates/library/pages/pilot-a.layers.json'];
const W2_ADDED: Record<string, string[]> = {
  'docs/research/howto/shared/back-pain-box.json': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
  'tools/plates/library/shared/back-box.mjs': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
  'tools/plates/library/pages/pilot-b.closeups.mjs': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
  'tools/plates/library/pages/pilot-b.layers.json': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
};
// RESEARCH-ROUTES-1 (#398, D-RR-HEAD): back-pain-box.json's key is also blanked; it is re-pinned there and pinned exactly by
// research-routes.test.ts (was 49909603… without it; re-measured on main e623d3ef).
const RR_BOX = 'docs/research/howto/shared/back-pain-box.json';
const MANIFEST_BLANKED_MAIN_W2 = '5a51002ef2a7fb2a551601cc78f1b9d338d45f87c6f5be63b23d4853eebf0532';
describe('F-PAIR-FAULTS A2: the MANIFEST blanked-keys test', () => {
  const read = (p: string) => readFileSync(join(__dirname, '../..', p));
  /** The manifest less W2's changes (red if a W2 key does not pin its current file, or an added key is missing). */
  const lessW2 = (m: any) => {
    expect(Object.keys(m.rows)).toContain('lib_crunch');
    delete m.rows.lib_crunch;
    for (const [id, r] of Object.entries<any>(m.rows)) {
      for (const k of W2_MOVED) if (k in r.files) { expect([id, k, r.files[k]]).toEqual([id, k, sha(read(k))]); r.files[k] = ''; }
      for (const [k, ids] of Object.entries(W2_ADDED)) if (ids.includes(id)) { expect([id, k, r.files[k]]).toEqual([id, k, sha(read(k))]); delete r.files[k]; }
    }
    return m;
  };
  const current = () => JSON.parse(read('tools/plates/library/MANIFEST.json').toString());
  it('with the moved keys blanked, MANIFEST.json is main\'s; each moved key is its file\'s sha256', () => {
    const m = current();
    // was: blanked(m) === MANIFEST_BLANKED_MAIN (d7f80b6f, main cb9a6dae with MOVED blanked); LIB-SHIP W2: the same with W2 taken out
    // F-BODYMAP-FRONTDELT (#404, D-BODYMAP-LIB): its region-fix.mjs key is re-pinned there and pinned exactly by
    // tests/library/bodymap-frontdelt.test.ts; each must pin its current file, then it is put back to main 5023f5c6's value.
    for (const r of Object.values<any>(m.rows)) if ('tools/plates/library/render/region-fix.mjs' in r.files) { expect(r.files['tools/plates/library/render/region-fix.mjs']).toBe(sha(read('tools/plates/library/render/region-fix.mjs'))); r.files['tools/plates/library/render/region-fix.mjs'] = '3ffbd27de5e812d60a4542de4d483113640aa4b0b427089317e2cedb39e7f3a8'; }
    expect(blanked(lessW2(m), [...MOVED, RR_BOX])).toBe(MANIFEST_BLANKED_MAIN_W2);
    for (const k of MOVED) for (const r of Object.values<any>(current().rows)) if (k in r.files) expect([k, r.files[k]]).toEqual([k, sha(read(k))]);
  });
  it('mutations: one other key moved, or a moved key left out of the blank list, is red', () => {
    const m = lessW2(current()), row: any = Object.values(m.rows)[0], other = Object.keys(row.files).find(k => !MOVED.includes(k) && !W2_MOVED.includes(k) && k !== RR_BOX)!;
    row.files[other] = '0'.repeat(64);
    expect(blanked(m, [...MOVED, RR_BOX])).not.toBe(MANIFEST_BLANKED_MAIN_W2);
    expect(blanked(lessW2(current()), [MOVED[0]!, RR_BOX])).not.toBe(MANIFEST_BLANKED_MAIN_W2);
    // LIB-SHIP W2: a W2 key that does not pin its file, or a crunch row missing, is red
    const bad = current(); (Object.values<any>(bad.rows).find(r => W2_MOVED[0]! in r.files)).files[W2_MOVED[0]!] = '0'.repeat(64);
    expect(() => lessW2(bad)).toThrow();
    const noCrunch = current(); delete noCrunch.rows.lib_crunch;
    expect(() => lessW2(noCrunch)).toThrow();
  });
});
