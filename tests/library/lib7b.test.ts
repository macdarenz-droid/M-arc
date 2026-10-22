// LIB-7b (card lib-7b-card.md; hands/DESIGN.md §9): library hand blocks from the pair key. 7b-A1 the page hook
// (D-LIB9-HANDPAGE, D-LIB7b-PAGEDUP (B) check (3)), the re-stated scoper pinned against golden B, D-LIB7b-HALVES
// attribute-only, 7b-A2's pair-row checks and D-LIB7b-ZOOMS on a scratch tree. Each check has its mutation here.
import { createHash } from 'node:crypto';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let B: any, P: any, H: any, hp: any, F: any, node: any;
const tmps: string[] = [];
let page = '', raw = '', tree = '';

beforeAll(async () => {
  B = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  H = await import(/* @vite-ignore */ url('tools/plates/layers/artifact/howto-layers.mjs'));
  hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
  F = await import(/* @vite-ignore */ url('tests/library/fixtures/lib7b/fixture.mjs'));
  ({ node } = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs')));
  const [a, b] = await Promise.all([F.pairTree(), F.pairTree({ pair: false })]);
  tmps.push(a, b); tree = a;
  page = F.pageOf(a); raw = F.pageOf(b);
}, 300_000);
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

const idsIn = (h: string) => [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!);
/** 7b-A1's problems on a built page, for the fixture's rows: each pair row's card holds exactly one hand zx block, the
 *  key's pair panel (namespaced for a repeated key), every reference names it, and the pair CSS is there once per key. */
async function a1Problems(html: string): Promise<string[]> {
  const bad: string[] = [...await B.pairPanelProblems(html)], seen = new Set<string>();
  for (const s of F.SCRATCH_7B) {
    const card = hp.cardOf(html, s.pre), zid = `${seen.has(s.key) ? `${s.pre}-` : ''}hp-${s.key}-zoom-hand`;
    seen.add(s.key);
    const hands = [...card.matchAll(/<div class="zx" id="([^"]+)" data-zoom="hand"/g)].map(m => m[1]);
    if (JSON.stringify(hands) !== JSON.stringify([zid])) bad.push(`${s.id}: hand blocks ${JSON.stringify(hands)}, want [${zid}]`);
    const refs = [...card.matchAll(/data-zoom="hand" aria-[a-z]+="false" aria-controls="([^"]+)"|class="ht-also-btn"[^>]*aria-controls="([^"]+)"/g)].map(m => m[1] ?? m[2]);
    if (!refs.length || refs.some(r => r !== zid)) bad.push(`${s.id}: references ${JSON.stringify(refs)}, want ${zid}`);
    if (html.includes(`${s.pre}-zoom-hand`)) bad.push(`${s.id}: ${s.pre}-zoom-hand left on the page`);
  }
  for (const k of new Set(F.SCRATCH_7B.map((s: any) => s.key))) {
    const n = html.split(`/* close-ups: ${B.PAIR_LABEL} hp-${k} */\n${B.pairCss(k)}`).length - 1;
    if (n !== 1) bad.push(`${k}: pair CSS ${n} times`);
  }
  return bad;
}

describe('7b-A1: a pair row\'s hand block is its pair panel (D-LIB9-HANDPAGE, D-LIB7b-PAGEDUP (B))', () => {
  it('the fixture page: one block per pair row, === pairPanel(key) (the repeat under its namespace), refs moved, CSS once per key', async () => {
    expect(await a1Problems(page)).toEqual([]);
    // the push row's ht-also button moved with the chip
    expect(hp.cardOf(page, 'smith-machine-shoulder-press')).toContain('class="ht-also-btn" id="smith-machine-shoulder-press-also-hand" data-zoom="hand" aria-controls="hp-rope-push-neutral-zoom-hand"');
  });
  it('a config with no pair field (= the hook off): every block is the renderer\'s, and 7b-A1 is red', async () => {
    for (const s of F.SCRATCH_7B) expect(raw).toContain(`<div class="zx" id="${s.pre}-zoom-hand" data-zoom="hand"`);
    expect(raw).not.toMatch(/hp-[a-z-]+-zoom-hand/);
    expect((await a1Problems(raw)).length).toBeGreaterThanOrEqual(F.SCRATCH_7B.length);
  });
  it('mutations: an aria-controls left at <chromeId>-zoom-hand; the panel inserted twice; each red', async () => {
    const left = page.replace('aria-controls="hp-curl-dumbbell-under-zoom-hand"', 'aria-controls="barbell-row-zoom-hand"');
    expect((await a1Problems(left)).join('\n')).toMatch(/lib_barbell_row: references|barbell-row-zoom-hand left/);
    const panel = await P.pairPanel('rope-push-neutral'), twice = page.replace(panel, () => panel + panel);
    expect((await a1Problems(twice)).join('\n')).toMatch(/repeated ids|hand blocks/);
  });
  it('PAGEDUP check (3) mutations: an un-prefixed id in copy 2; an idref prefixed that the reverse does not restore; a byte changed in copy 2', async () => {
    const at = page.indexOf('<div class="zx" id="t-bar-row-hp-curl-dumbbell-under-zoom-hand"'), copy2 = B.divAt(page, at);
    const put = (c: string) => page.slice(0, at) + c + page.slice(at + copy2.length);
    expect(await B.pairPanelProblems(put(copy2))).toEqual([]);
    const unPrefixed = copy2.replace('id="t-bar-row-hp-curl-dumbbell-under-zoom-hand-h"', 'id="hp-curl-dumbbell-under-zoom-hand-h"');
    expect((await B.pairPanelProblems(put(unPrefixed))).join('\n')).toMatch(/repeated ids/);
    const m = copy2.match(/url\(#t-bar-row-(hp-curl-dumbbell-under-[a-z0-9-]+)\)/)!;
    const badRef = copy2.replace(m[0], `url(#zz-t-bar-row-${m[1]})`);
    expect((await B.pairPanelProblems(put(badRef))).join('\n')).toMatch(/t-bar-row on curl-dumbbell-under: not pairPanel/);
    const byte = copy2.replace('Hand: right and wrong', 'Hand: right and wronG');
    expect((await B.pairPanelProblems(put(byte))).join('\n')).toMatch(/t-bar-row on curl-dumbbell-under: not pairPanel/);
  });
  it('a bad pair value in a layers config is refused by layersSpecOf, naming the id', () => {
    expect(() => node(tree, `
      import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'; import { tmpdir } from 'node:os'; import { join } from 'node:path';
      import { layersSpecOf } from './tools/plates/library/layers-spec.mjs'; import { BATCH, PAGES } from './tools/plates/library/fidelity/fixture.mjs';
      const c = JSON.parse(readFileSync(PAGES.layersConfig, 'utf8')); c.closeups.lib_barbell_row.pair = 'Curl Dumbbell'; writeFileSync(PAGES.layersConfig, JSON.stringify(c));
      try { layersSpecOf(BATCH, { stageDir: mkdtempSync(join(tmpdir(), 'x-')) }); } finally { c.closeups.lib_barbell_row.pair = 'curl-dumbbell-under'; writeFileSync(PAGES.layersConfig, JSON.stringify(c, null, 2) + '\\n'); }
    `)).toThrow(/lib_barbell_row: pair "Curl Dumbbell" is not a pair key/);
  });
});

describe('D-LIB7b-SCOPE look: the hook\'s re-stated golden-B scoper is golden B\'s', () => {
  it('applied to each of the 8\'s sheets it reproduces all 8 /* close-ups */ blocks of the approved page byte for byte; a changed scoper is red', async () => {
    const { zoomCss } = await import(/* @vite-ignore */ url('tools/plates/library/render/closeup/zoom-css.mjs'));
    const { zboxCss } = await import(/* @vite-ignore */ url('tools/plates/library/render/closeup/zbox-css.mjs'));
    const { CLOSEUP_OPTIONS } = await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'));
    const golden = readFileSync('tests/howto/golden/howto-layers.html', 'utf8');
    const ZBOX = ['machine_chest_press', 'barbell_back_squat', 'leg_press'];
    const blockOf = (id: string, f = B.scopedSheetCss) => {
      const pre = (id === 'dumbbell_lateral_raise' ? 'lateral_raise' : id).replace(/_/g, '-'), o = CLOSEUP_OPTIONS[id];
      return `/* close-ups: ${B.GOLDEN_B_CLOSEUPS[id].label} */\n${f((ZBOX.includes(id) ? zboxCss : zoomCss)(o.css), `.hx-${pre}`)}`;
    };
    const ids = Object.keys(B.GOLDEN_B_CLOSEUPS);
    expect(ids).toHaveLength(8);
    for (const id of ids) expect([id, golden.includes(blockOf(id))]).toEqual([id, true]);
    const changed = (css: string, scope: string) => B.scopedSheetCss(css, scope).replace(/\n/g, ' \n');
    expect(golden.includes(blockOf('pull_up', changed))).toBe(false);
  });
  it('the pair sheet CSS is hands/page.mjs CSS (the sheet the pairs were approved in)', async () => {
    expect(B.PAIR_SHEET_CSS).toBe((await import(/* @vite-ignore */ url('tools/plates/library/hands/page.mjs'))).CSS);
  });
});

// sha256 of pairPanel(key) for LIB-7's 8 keys on main 5158609c, before D-LIB7b-HALVES
const PANEL_BEFORE: Record<string, string> = {
  'curl-dumbbell-under': '54c5a7a5e8cf5a2aa2b0741ac371c61f403742bbbe1a10fc022acf42b1082eaf',
  'curl-dumbbell-neutral': '9dc04fa3ac999c11e8f81977511a4092a0e84b2c1f4dd284729d344a184dd2c5',
  'curl-bar-under': 'fd204c2d784a5473c9ccfc34b0c854ca81bfecdb97bc4e299b8644c12b40fd14',
  'd-handle-pull-unstated': 'd268c2bd835625d7da8d091767cb15b3a6005f04e35912cf047240a71831a8ac',
  'ez-curl-angled': 'aef3853b2c5e8350642c4e68b59b48619b88723af0f24d0402aff74084a27a07',
  'ez-curl-under': 'fafca8dbfd97be08e40fe4c42be5b76856e27b1115abead3b1bb195039ff128f',
  'ez-curl-over': 'ee43d4670a19ff17e3d70159beb0c8987feb4eff59849b5a4a33fdc67df42023',
  'rope-push-neutral': '81b33744d928d84fc84609f9f9b4593d5f476c181970a5cae0c21bfa748ca4a9',
};
/** The attributes splitHalves adds, removed (and the root's role and label restored from the halves' labels). */
function unsplit(h: string): string {
  return h.replace(/<svg class="hand-svg[^>]*>[\s\S]*?<\/svg>/g, svg => {
    const halves = [...svg.matchAll(/<g class="(?:h-panel|zx-half) (right|wrong)" role="img" aria-label="(Right|Wrong): ([^"]*)">/g)];
    if (!halves.length) return svg;
    const r = halves.find(x => x[1] === 'right')![3], w = halves.find(x => x[1] === 'wrong')![3];
    return svg.replace(/^(<svg class="hand-svg[^>]*?) role="group" aria-label="([^"]*)"/, (m, a, cam) => `${a} role="img" aria-label="${cam}. Right: ${r} Wrong: ${w}"`)
      .replace(/<text aria-hidden="true" /g, '<text ')
      .replace(/<g class="((?:h-panel|zx-half) (?:right|wrong))" role="img" aria-label="[^"]*">/g, '<g class="$1">');
  });
}
describe('D-LIB7b-HALVES: the pair panel gets golden B\'s TalkBack halves, attribute-only', () => {
  it('for LIB-7\'s 8 keys, removing exactly what splitHalves adds gives the panel\'s bytes before it (main 5158609c); halves are labelled', async () => {
    expect(Object.keys(PANEL_BEFORE).every(k => P.keysOf().includes(k))).toBe(true);
    for (const [k, want] of Object.entries(PANEL_BEFORE)) {
      const h = await P.pairPanel(k);
      expect([k, sha(unsplit(h))]).toEqual([k, want]);
      expect(h).toMatch(/role="img" aria-label="Right: /);
      expect(h).toMatch(/role="img" aria-label="Wrong: /);
      expect(H.splitHalves(unsplit(h), k)).toBe(h);
    }
  }, 60_000);
  it('mutation: one SVG byte changed inside a half is red', async () => {
    const k = 'curl-dumbbell-under', h = await P.pairPanel(k);
    const a = h.indexOf('<g class="h-panel right" role="img"'), cut = h.indexOf('<path d="M', a);
    const m = h.slice(0, cut + 10) + (h[cut + 10] === '1' ? '2' : '1') + h.slice(cut + 11);
    expect(sha(unsplit(m))).not.toBe(PANEL_BEFORE[k]);
  });
});

describe('7b-A2: handpairs.mjs pair-row checks', () => {
  const row = { id: 'lib_barbell_row', chromeId: 'barbell-row', pages: { layers: 'x.layers.html', layersConfig: 'x.layers.json' } };
  it('a config pair K with HAND_OF_ID[id] !== K throws; a \'none\' row naming a pair throws; a \'none\' row whose card holds a pair panel throws', () => {
    expect(() => hp.pairRowCheck(row, 'curl-dumbbell-under', 'curl-dumbbell-under', 'pull', page)).not.toThrow();
    expect(() => hp.pairRowCheck(row, 'curl-dumbbell-under', 'ez-curl-over', 'pull', page)).toThrow(/lib_barbell_row: x.layers.json names pair curl-dumbbell-under, but HAND_OF_ID gives ez-curl-over/);
    expect(() => hp.pairRowCheck(row, 'curl-dumbbell-under', undefined, 'pull', page)).toThrow(/HAND_OF_ID gives undefined/);
    expect(() => hp.pairRowCheck(row, 'curl-dumbbell-under', 'curl-dumbbell-under', 'none', page)).toThrow(/archetype 'none', but x.layers.json names pair/);
    expect(() => hp.pairRowCheck(row, undefined, undefined, 'none', page)).toThrow(/archetype 'none', but its card on x.layers.html holds a pair panel/);
    expect(() => hp.pairRowCheck(row, undefined, undefined, 'none', raw)).not.toThrow();
    expect(() => hp.pairRowCheck({ ...row, id: 'lib_t_bar_row', chromeId: 't-bar-row' }, undefined, undefined, 'none', page)).toThrow(/holds a pair panel/);   // the namespaced copy
  });
  it('D-LIB7b-ZOOMS: styleWithout drops exactly the named keys\' pairCss lines; an extra, a foreign or a changed .hx-hp- line is red', () => {
    const run = (mut: string) => node(tree, `
      import { readFileSync } from 'node:fs';
      import { styleWithout } from './tools/plates/gen/zooms.mjs'; import { galleryCss } from './tools/plates/css.mjs';
      import { rows, goldenRows } from './tools/plates/library/registry.mjs'; import { BATCH } from './tools/plates/library/fidelity/fixture.mjs';
      let style = galleryCss(readFileSync('tests/howto/golden/library/zz-lib4b.layers.html', 'utf8'));
      const golden = galleryCss(readFileSync('tests/howto/golden/howto-layers.html', 'utf8'));
      ${mut}
      console.log(styleWithout(style, rows().filter(r => r.batchFile === BATCH)) === styleWithout(golden, goldenRows()) ? 'EQUAL' : 'DIFFERENT');
    `).trim();
    expect(run('')).toBe('EQUAL');
    expect(() => run("style = style.replace('.hx-hp-curl-dumbbell-under .zoom', '.hx-hp-curl-dumbbell-under .zoom{}\\n.hx-hp-curl-dumbbell-under .zoom');")).toThrow(/zooms: lib_barbell_row, lib_t_bar_row: the page's .hx-hp-curl-dumbbell-under rules are not pairCss\(curl-dumbbell-under\) exactly/);
    expect(run("style = style + '\\n.hx-hp-zz-none .zoom{color:red}';")).toBe('DIFFERENT');
    expect(() => run("style = style.replace(/(\\.hx-hp-rope-push-neutral [^{]*\\{[^}]*?)(\\d)/, (m, a, d) => a + (d === '1' ? '2' : '1'));")).toThrow(/lib_smith_machine_shoulder_press: the page's .hx-hp-rope-push-neutral rules are not pairCss/);
  }, 120_000);
});

describe('7b-A2 on a scratch tree: the real pipeline with the scratch rows shipped on real LIB-7 keys', () => {
  it('generate: each pair row\'s zoom-<chromeId>.css (hands.mjs + handpairs.mjs) holds its pair scope\'s rules before HX_TAIL; the handpair files are written', async () => {
    await F.keyTree(tree);
    const out = JSON.parse(node(tree, `
      import { render } from './tools/plates/generate.mjs';
      const out = await render(), o = {};
      for (const [p, v] of out) if (/zoom-(barbell-row|t-bar-row|smith-machine-shoulder-press)\\.css$|handpair-/.test(p)) o[p] = { writers: v.writers, text: v.text };
      console.log(JSON.stringify(o));
    `).trim().split('\n').pop());
    expect(Object.keys(out).filter(p => p.includes('handpair-')).sort()).toEqual(['src/howto/generated/handpair-curl-dumbbell-under.ts', 'src/howto/generated/handpair-rope-push-neutral.ts']);
    for (const s of F.SCRATCH_7B) {
      const o = out[`src/slices/howto/css/zoom-${s.pre}.css`];
      expect(o.writers).toEqual(['tools/plates/gen/handpairs.mjs', 'tools/plates/gen/hands.mjs']);
      const a = o.text.indexOf(`.hx-hp-${s.key} `), b = o.text.lastIndexOf(`.hx-hp-${s.key} `), t = o.text.indexOf('.hx > .zx-page > .hsec:first-child');
      expect([s.id, a > o.text.indexOf(`.hx-${s.pre} `), b < t, o.text.split(/\n/).filter((l: string) => l.includes(`.hx-hp-${s.key} `)).length]).toEqual([s.id, true, true, B.pairCss(s.key).split('\n').filter((l: string) => l.trim()).length]);
    }
  }, 600_000);
});
