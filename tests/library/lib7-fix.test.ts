// LIB-7-FIX (card lib-7-fix-card.md; hands/DESIGN.md §8): LIB-7's loader contract for main's gen/handpairs.mjs. F1 the
// contract, F2 key identity, F3 exercise-neutral panels with approved words, F4 the approvals carry (byte proof against
// the pinned render), F6 (a) the per-key budget, F7 L2-A21's covering proof. Each check has its mutation in the same test.
import { createHash } from 'node:crypto';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any, C: any, S: any, PN: any, hp: any, ids: any, reg: any, lint: any, hands: any;
const EXERCISES: { id: string; name: string }[] = JSON.parse(readFileSync('src/data/exercises.json', 'utf8'));
const EIGHT = Object.keys(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8')));
const WRAP = 'tests/library/fixtures/lib7fix/wrap-pairs.mjs';
// the 12 approved ids (D-PILOTA-R5, #193 5975538224)
const APPROVED = ['dumbbell_biceps_curl', 'alternating_dumbbell_curl', 'incline_dumbbell_curl', 'hammer_curl', 'cross_body_hammer_curl', 'barbell_curl',
  'cable_curl', 'preacher_curl', 'ez_bar_curl', 'reverse_curl', 'single_arm_lat_pulldown', 'rope_triceps_pushdown'];

beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
  S = await import(/* @vite-ignore */ url('tools/plates/library/hands/sheet.mjs'));
  PN = await import(/* @vite-ignore */ url('tools/plates/library/hands/panel.mjs'));
  hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
  ids = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
  reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
  lint = await import(/* @vite-ignore */ url('tools/plates/layers/artifact/copy-lint.mjs'));
  hands = await import(/* @vite-ignore */ url('tools/plates/gen/hands.mjs'));
}, 60_000);

// in-memory copies of the key modules (hand-pairs.test.ts's technique: files untouched)
const clone = () => P.MODULES.map((m: any) => ({ ...m, HANDLE: structuredClone(m.HANDLE), VARIANTS: structuredClone(m.VARIANTS ?? {}), IDS: structuredClone(m.IDS ?? {}), GAPS: { ...(m.GAPS ?? {}) } }));
const withMods = (f: (mods: any[]) => void) => { const mods = clone(); f(mods); return mods; };
const mod = (mods: any[], k: string) => mods.find((m: any) => m.KEY === k);
const keyIdx = (mods: any[]) => P.keyIndexOf(P.indexOf(mods));
const drawnIds = () => [...P.INDEX.drawn.keys()];
const lib7Drawn = () => [...P.INDEX.drawn].filter(([, e]: any) => e.mod.OWNER === 'LIB-7').map(([id]: any) => id);
const idsOfKey = (k: string) => Object.entries(P.HAND_OF_ID).filter(([, v]) => v === k).map(([lid]) => lid.slice(4));

/** F1: what HAND_OF_ID must never hold: one of the 8, a gap, a value outside keysOf() or the key pattern. */
function handOfIdProblems(map: Record<string, string>) {
  const bad: string[] = [], keys = new Set(P.keysOf());
  for (const [lid, k] of Object.entries(map)) {
    if (EIGHT.includes(lid)) bad.push(`${lid}: one of the 8`);
    if (P.INDEX.gaps.has(lid.slice(4))) bad.push(`${lid}: a gap`);
    if (!keys.has(k)) bad.push(`${lid}: ${k} is not a key`);
    if (!/^[a-z0-9-]+$/.test(k)) bad.push(`${lid}: ${k} is not [a-z0-9-]`);
  }
  return bad;
}

describe('LIB-7-FIX F1: the loader contract (gen/handpairs.mjs:3-4)', () => {
  it('HAND_OF_ID maps lib_ + every drawn id, of any owner; the LIB-7 subset is 12', () => {
    expect(Object.keys(P.HAND_OF_ID).sort()).toEqual(drawnIds().map(id => `lib_${id}`).sort());
    expect(C.sweep(lib7Drawn(), 12, 'LIB-7 drawn ids in HAND_OF_ID').every((id: string) => `lib_${id}` in P.HAND_OF_ID)).toBe(true);
    expect(handOfIdProblems(P.HAND_OF_ID)).toEqual([]);
  });
  it('mutations: one of the 8 or a gap mapped is red; the loader itself refuses one of the 8', () => {
    expect(handOfIdProblems({ ...P.HAND_OF_ID, lib_skull_crusher: 'ez-curl-over' })).toEqual(['lib_skull_crusher: a gap']);
    expect(handOfIdProblems({ ...P.HAND_OF_ID, lib_dumbbell_lateral_raise: 'curl-dumbbell-under' })).toEqual(['lib_dumbbell_lateral_raise: one of the 8']);
    expect(() => keyIdx(withMods(m => { mod(m, 'curl').IDS.dumbbell_lateral_raise = { ...mod(m, 'curl').IDS.dumbbell_biceps_curl }; })))
      .toThrow(/lib_dumbbell_lateral_raise is one of the 8/);
  });
  it('inputsFor(key) and inputsFor(id) are equal and non-empty for every id on a key, with the key\'s module file and no other', () => {
    for (const k of C.sweep(P.keysOf(), 8, 'pair keys')) {
      const byKey = P.inputsFor(k), file = P.INDEX.drawn.get(idsOfKey(k)[0]).mod.FILE;
      expect(byKey.length).toBeGreaterThan(0);
      expect(byKey).toContain(file);
      expect(byKey).toContain('tools/plates/library/hands/panel.mjs');
      expect(byKey).toContain('tools/plates/library/hands/panel-words.json');
      expect(byKey.filter((f: string) => /library\/hands\/hand-[a-z0-9-]+\.mjs$/.test(f))).toEqual([file]);
      for (const id of idsOfKey(k)) expect([k, id, P.inputsFor(id)]).toEqual([k, id, byKey]);
    }
  });
  it('pairPanel(key) is a zx panel; with main\'s registry no shipped row has a key; a fresh import does not throw', async () => {
    for (const k of P.keysOf()) expect((await P.pairPanel(k)).startsWith('<div class="zx"')).toBe(true);
    expect(hp.pairsOf(P, reg.shippedIds())).toEqual({ pairOf: {}, keys: [] });
    const fresh = await import(/* @vite-ignore */ `${url('tools/plates/library/hands/pairs.mjs')}?lib7fix=${Date.now()}`);
    expect(fresh.HAND_OF_ID).toEqual(P.HAND_OF_ID);
  }, 60_000);
  it('through a test-only loader keyed on a shipped id, main\'s plugin writes one handpair chunk of the real panel', async () => {
    const o = await hp.outputs({ pairsFile: WRAP });
    expect(o.map((x: any) => x.path)).toEqual(['src/howto/generated/handpair-curl-dumbbell-under.ts']);
    expect(o[0].text).toBe(hp.pairText('curl-dumbbell-under', await P.pairPanel('curl-dumbbell-under')));
    expect(o[0].inputs).toEqual([...reg.registryInputs(), ...P.inputsFor('curl-dumbbell-under')]);
  }, 60_000);
  it('mutations: HAND_OF_ID missing, inputsFor [] , a panel that is not zx, a key outside [a-z0-9-] are each refused', async () => {
    const { HAND_OF_ID: _h, ...noMap } = P;
    expect(() => hp.pairsOf(noMap, reg.shippedIds())).toThrow(TypeError);
    await expect(hp.outputs({ pairsFile: 'tests/library/fixtures/lib7fix/wrap-no-inputs.mjs' })).rejects.toThrow(/curl-dumbbell-under: inputsFor gave no inputs/);
    await expect(hp.outputs({ pairsFile: 'tests/library/fixtures/lib7fix/wrap-section.mjs' })).rejects.toThrow(/curl-dumbbell-under: pairPanel is not a zx panel/);
    expect(() => hp.pairsOf({ ...P, HAND_OF_ID: { lib_pull_up: 'Curl_x' } }, reg.shippedIds())).toThrow(/lib_pull_up: bad key Curl_x/);
    expect(handOfIdProblems({ lib_dumbbell_biceps_curl: 'Curl_x' })).toEqual(['lib_dumbbell_biceps_curl: Curl_x is not a key', 'lib_dumbbell_biceps_curl: Curl_x is not [a-z0-9-]']);
  }, 60_000);
});

describe('LIB-7-FIX F2: key identity (D-LIB7FIX-KEY)', () => {
  it('8 keys over the 12 LIB-7 ids, 7 distinct pictures; one ordered fault list per key; the panel is the same through each of its ids', async () => {
    const lib7Keys = new Set(lib7Drawn().map(id => P.HAND_OF_ID[`lib_${id}`]));
    C.sweep(lib7Keys, 8, 'LIB-7 pair keys');
    C.sweep(S.tiles(P.INDEX).filter((t: any) => t.spec.mod.OWNER === 'LIB-7'), 7, 'LIB-7 distinct pictures');
    for (const k of P.keysOf()) {
      const list = idsOfKey(k);
      const faults = new Set(list.map(id => P.pairSpec(id).wrong.map((w: any) => w.key).join(',')));
      expect([k, faults.size]).toEqual([k, 1]);
      const panel = await P.pairPanel(k);
      for (const id of list) {
        const via = PN.panelHtml(k, P.pairSpec(id).wrong.map((w: any) => ({ fault: w.key, svg: P.renderPair(id, { fault: w.key, uid: `hp-${k}-${w.key}` }).svg })));
        expect([k, id, via === panel]).toEqual([k, id, true]);
      }
    }
  }, 60_000);
  it('mutations: faults reordered on one id, a repeated key string, a dash-prefixed key, a key equal to a drawn id each throw naming both', () => {
    expect(() => keyIdx(withMods(m => { const h = mod(m, 'curl').IDS.hammer_curl; h.faults = [...h.faults].reverse(); })))   // a new array: the module shares BOTH between ids
      .toThrow(/key curl-dumbbell-neutral: hammer_curl has faults \[bent-back,curled\], cross_body_hammer_curl has \[curled,bent-back\]/);
    const dh = (m: any[]) => mod(m, 'd-handle');
    expect(() => keyIdx(withMods(m => {
      m.push({ ...dh(m), KEY: 'd', FILE: 'fixture', VARIANTS: { 'handle-pull': structuredClone(dh(m).VARIANTS.pull) }, GAPS: {},
        IDS: { dumbbell_bench_press: { variant: 'handle-pull', orientation: 'unstated', faults: ['curled'], claims: [] } } });
    }))).toThrow(/d-handle\/pull\/unstated and d\/handle-pull\/unstated both give key d-handle-pull-unstated/);
    expect(() => keyIdx(withMods(m => {
      const c = mod(m, 'curl'); c.VARIANTS['bar-under'] = structuredClone(c.VARIANTS.bar); c.IDS.cable_curl = { ...c.IDS.cable_curl, variant: 'bar-under', orientation: 'over' };
    }))).toThrow(/key curl-bar-under \+ '-' starts key curl-bar-under-over/);
    expect(() => keyIdx(withMods(m => { mod(m, 'rope').IDS['curl-dumbbell-under'] = { ...mod(m, 'rope').IDS.rope_triceps_pushdown }; })))
      .toThrow(/key curl-dumbbell-under \(dumbbell_biceps_curl,.*\) equals a drawn id/);
    expect(() => keyIdx(withMods(m => { mod(m, 'rope').IDS.not_an_exercise = { ...mod(m, 'rope').IDS.rope_triceps_pushdown }; })))
      .toThrow(/lib_not_an_exercise is not in src\/data\/exercises.json/);
  });
});

// shown or spoken words outside the drawings: heading, captions, pager labels and the aria-labels of the panel chrome
const svgFree = (h: string) => h.replace(/<svg class="hand-svg[\s\S]*?<\/svg>(?=<\/div>)/g, '');
function shownWords(h: string) {
  const t = svgFree(h).replace(/<svg[\s\S]*?<\/svg>/g, '');
  return [...t.split(/<[^>]+>/).map(s => s.trim()).filter(Boolean), ...[...t.matchAll(/aria-label="([^"]*)"/g)].map(m => m[1]!)];
}
function wordProblems(k: string, h: string, words = PN.WORDS) {
  const bad: string[] = [], W = words.keys[k], ch = words.chrome;
  if (!W) return [`${k}: no words`];
  const ok = new Set<string>([W.heading.text, ch.close.text, ch.right.text.trim(), ch.wrong.text.trim(), ch.pages.text]);
  const n = Object.keys(W.faults).length;
  Object.values<any>(W.faults).forEach((f, i) => {
    for (const s of ['right', 'wrong', 'pager']) { if (!f[s]?.source?.trim()) bad.push(`${k}: ${s} without a source`); ok.add(f[s].text); }
    ok.add(ch.pageOf.text.replace('<label>', f.pager.text).replace('<i>', String(i + 1)).replace('<n>', String(n)));
    for (const s of ['right', 'wrong']) {
      if (lint.words(f[s].text) > lint.CAPTION_MAX_WORDS) bad.push(`${k}: ${s} caption over ${lint.CAPTION_MAX_WORDS} words`);
      for (const [rule, re] of lint.BANNED) if (re.test(f[s].text)) bad.push(`${k}: ${s} caption banned: ${rule}`);
    }
  });
  if (W.heading.text !== 'Hand: right and wrong') bad.push(`${k}: heading ${W.heading.text}`);
  for (const w of shownWords(h)) if (!ok.has(w)) bad.push(`${k}: unapproved word "${w}"`);
  return bad;
}
const NAMES = EXERCISES.map(e => e.name);
const CARD_IDS = EXERCISES.map(e => e.id.slice(4));
// a token, not part of a longer word or id on its left; '-' may follow (a dashed card id in an id such as `hammer-curl-hand-curled`)
const tokenIn = (h: string, t: string) => new RegExp(`(?<![A-Za-z0-9_-])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_])`).test(h);
function neutralProblems(k: string, h: string) {
  const bad: string[] = [], chrome = reg.rows().map((r: any) => r.chromeId);
  for (const t of new Set([...CARD_IDS, ...CARD_IDS.map(c => c.replace(/_/g, '-')), ...EXERCISES.map(e => e.id), ...chrome])) if (tokenIn(h, t)) bad.push(`${k}: names ${t}`);
  for (const n of NAMES) if (new RegExp(`\\b${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(h)) bad.push(`${k}: names "${n}"`);
  const idList = [...h.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]!);
  for (const id of idList) if (!id.startsWith(`hp-${k}-`)) bad.push(`${k}: id ${id}`);
  if (new Set(idList).size !== idList.length) bad.push(`${k}: duplicate ids`);
  if (!h.startsWith(`<div class="zx" id="hp-${k}-zoom-hand" data-zoom="hand" `)) bad.push(`${k}: not a data-zoom="hand" zx panel`);
  if (!h.includes(`<div class="hx hx-hp-${k}">`)) bad.push(`${k}: hx scope not keyed`);
  return bad;
}

describe('LIB-7-FIX F3: exercise-neutral panels, approved words (D-LIB7FIX-WORDS)', () => {
  it('no exercise id, chromeId or name; every id starts hp-<key>- and is unique; every shown word approved, with its source', async () => {
    for (const k of P.keysOf()) {
      const h = await P.pairPanel(k);
      expect(neutralProblems(k, h)).toEqual([]);
      expect(wordProblems(k, h)).toEqual([]);
    }
    expect(Object.keys(PN.WORDS.keys).sort()).toEqual([...P.keysOf()].sort());   // no words for a key that is not drawn
  }, 60_000);
  it('mutations: a uid from an id, an 11-word caption, a caption with no source, a heading taken from a card are each red', async () => {
    const k = 'curl-dumbbell-neutral', id = 'hammer_curl', faults = P.pairSpec(id).wrong.map((w: any) => w.key);
    const byId = PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: P.renderPair(id, { fault: f, uid: `${id.replace(/_/g, '-')}-hand-${f}` }).svg })));
    expect(neutralProblems(k, byId).join('\n')).toMatch(/names hammer-curl/);
    const words = structuredClone(PN.WORDS), real = await P.pairPanel(k);
    words.keys[k].faults.curled.wrong.text = 'Wrist curled forward toward the forearm while you lift it up';
    expect(() => PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: '' })), words)).toThrow(/curled.wrong has 11 words \(max 10\)/);
    expect(wordProblems(k, real, words).join('\n')).toMatch(/wrong caption over 10 words/);
    const noSrc = structuredClone(PN.WORDS); noSrc.keys[k].faults['bent-back'].right.source = '';
    expect(() => PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: '' })), noSrc)).toThrow(/bent-back.right has no approved text and source/);
    expect(wordProblems(k, real, noSrc).join('\n')).toMatch(/right without a source/);
    const card = structuredClone(PN.WORDS); card.keys[k].heading.text = 'Hammer Curl: right and wrong';
    const h = PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: P.renderPair(id, { fault: f, uid: `hp-${k}-${f}` }).svg })), card);
    expect(wordProblems(k, h, card).join('\n')).toMatch(/heading Hammer Curl/);
    expect(neutralProblems(k, h).join('\n')).toMatch(/names "Hammer Curl"/i);
  }, 60_000);
});

// D-LIB7FIX-CARRY: bytes at 55e91e9 (#193) and, for zoom-css.mjs, at 9b8f76e (#181), the approved head
const FROZEN: Record<string, string> = {
  'tools/plates/library/hands/census-scope.json': 'ba6f8a067dfae3bb01234d944d7c29ccb692ffb28b7f3d01a4cdf90f3539fe73',
  'tools/plates/library/hands/checks.mjs': '014cc5359959bbfd9c6cb6c920db31c4176aa47c5a19d425a770e89809c1542d',
  'tools/plates/library/hands/claims-extract.mjs': '1f93945f73629180730e18bcc3b2631a79ae04ebf8c4bdf2ed501a8ac5517b96',
  'tools/plates/library/hands/claims.json': 'fcbfd42d9bf681e25e536791631569e138ada5c09001b93f704413577eb84a56',
  'tools/plates/library/hands/gate.mjs': 'ad8835ec22ffd57e1cb7c818d001d1bb7e099ea13bf525a4a8ea777aaaad67a8',
  'tools/plates/library/hands/hand-band.mjs': 'd40a03b1e5e986314678c3f1eb3161789fc804f5951df430fe5bfe40ec72493c',
  'tools/plates/library/hands/hand-curl.mjs': '8de6e310f4a1638a684bcf0a327f4ba319b4769c2e27bce15c6c1cd70674ae6c',
  'tools/plates/library/hands/hand-d-handle.mjs': '446de1278564aa1a635a124bf76bba74ee2409f0b898bd9befe3835941b8c191',
  'tools/plates/library/hands/hand-ez.mjs': '8ad9e1276f53bd81b8c715335f15f3e5b222b1b5b91bfcf8de2ff95ee7401539',
  'tools/plates/library/hands/hand-rope.mjs': '0b9f59608ac124520f1cbb7b51f59855da1bd8b4966e383df9e12ef867bd2edd',
  'tools/plates/library/hands/page.mjs': '87db8059bf1df8892e225fac2a821ed657799f99778ad8956bfc77375d8eb836',
  'tools/plates/library/hands/radial-rules.mjs': '3c4a3ea8fec614444b1254aec5ef7573b3d2e394685ac48331e1c46b66904142',
  'tools/plates/library/hands/sheet.mjs': '2949e66b68d3c4de9e8e6ce800af4cfa6a50094b9f2fdd869ecd273703f543e2',
  'tools/plates/library/render/closeup/zoom-css.mjs': '37836f22478605ef8162af3c05e515385d03034d090279b6c91f4248adce2fdf',
};
const panelSvgs = (h: string) => [...h.matchAll(/<div class="hand-plate">([\s\S]*?)<\/div><div class="zoom-caps">/g)].map(m => m[1]!);

describe('LIB-7-FIX F4: the 12 approvals carry (D-LIB7FIX-CARRY)', () => {
  it('the frozen files are byte-identical to the approved heads', () => {
    for (const [f, h] of Object.entries(FROZEN)) expect([f, sha(readFileSync(f))]).toEqual([f, h]);
  });
  it('for each approved id and fault, the panel\'s SVG === renderPair(id, { fault }).svg with hp-<id>-<fault> swapped for the panel uid (22 pages)', async () => {
    let n = 0;
    for (const id of C.sweep(APPROVED, 12, 'approved ids')) {
      const k = P.HAND_OF_ID[`lib_${id}`], svgs = panelSvgs(await P.pairPanel(k));
      P.pairSpec(id).wrong.forEach((w: any, i: number) => {
        const want = P.renderPair(id, { fault: w.key }).svg.split(`hp-${id.replace(/_/g, '-')}-${w.key}`).join(`hp-${k}-${w.key}`);
        expect([id, w.key, svgs[i] === want]).toEqual([id, w.key, true]);
        n++;
      });
    }
    expect(n).toBe(22);
  }, 60_000);
  it('mutation: a panel drawn with another orientation is red', () => {
    const id = 'preacher_curl', k = P.HAND_OF_ID[`lib_${id}`], idx = P.indexOf(withMods(m => { mod(m, 'ez').IDS.preacher_curl.orientation = 'over'; }));
    const w = P.pairSpec(id).wrong[0];
    const other = P.renderPair(id, { fault: w.key, uid: `hp-${k}-${w.key}`, index: idx }).svg;
    expect(other).not.toBe(P.renderPair(id, { fault: w.key }).svg.split(`hp-${id.replace(/_/g, '-')}-${w.key}`).join(`hp-${k}-${w.key}`));
  });
});

describe('LIB-7-FIX F6 (a): every pair chunk within the largest of the 8\'s hand ceilings (D-LIB7FIX-BUDGET)', () => {
  const over = (text: string, cap: { raw: number; gz: number }) => {
    const raw = Buffer.byteLength(text), gz = gzipSync(text).length;
    return raw > cap.raw || gz > cap.gz ? [`${raw}/${gz} over ${cap.raw}/${cap.gz}`] : [];
  };
  it('pairText(key, pairPanel(key)) <= handCeiling(\'pull-up\') raw and gz, for every key; a padded panel is red', async () => {
    const cap = hands.handCeiling('pull-up');
    expect(cap).toEqual({ raw: 92917, gz: 26286 });
    const sizes: string[] = [];
    for (const k of P.keysOf()) {
      const t = hp.pairText(k, await P.pairPanel(k));
      expect([k, over(t, cap)]).toEqual([k, []]);
      sizes.push(`${k} ${Buffer.byteLength(t)}/${gzipSync(t).length}`);
    }
    console.log(`LIB-7-FIX F6 (a) pair chunks raw/gz B (cap ${cap.raw}/${cap.gz}): ${sizes.join(', ')}`);
    const k = P.keysOf()[0], pad = (await P.pairPanel(k)) + ' '.repeat(cap.raw);
    expect(over(hp.pairText(k, pad), cap)).toHaveLength(1);
  }, 60_000);
});

describe('LIB-7-FIX F7: L2-A21\'s covering proof (D-LIB7FIX-A21)', () => {
  const row = [{ id: 'lib_x', chromeId: 'x', slug: 'x' }], has = (n: string) => n !== 'hand-x';
  it('a shipped row that needs a hand and has neither a hand chunk nor a pair is refused; with a pair it is not', () => {
    expect(() => ids.missingChunks(row, has, {}, { lib_x: 'curl' }, () => true)).toThrow(/lib_x: no .*hand pair/);
    expect(() => ids.missingChunks(row, has, { x: 'k' }, { lib_x: 'curl' }, () => true)).not.toThrow();
  });
  it('mutation: gen/ids.mjs without its hand clause (a temp copy outside tools/plates/) lets that row through', async () => {
    const src = readFileSync('tools/plates/gen/ids.mjs', 'utf8'), base = pathToFileURL(join(process.cwd(), 'tools/plates/gen/')).href;
    const clause = /\n {4}if \(archetypes\[r\.id\] !== 'none' && !has\(`hand-\$\{c\}`\) && !pairOf\[c\]\) throw [^\n]*/;
    expect(src).toMatch(clause);
    const copy = src.replace(clause, '').replace(/(from\s+)'(\.{1,2}\/[^']+)'/g, (_m, pre, spec) => `${pre}'${new URL(spec, base).href}'`);
    const file = join(tmpdir(), `lib7fix-ids-${process.pid}-${Date.now()}.mjs`);
    try {
      writeFileSync(file, copy);
      const mutated = await import(/* @vite-ignore */ pathToFileURL(file).href);
      expect(() => mutated.missingChunks(row, has, {}, { lib_x: 'curl' }, () => true)).not.toThrow();
    } finally { rmSync(file, { force: true }); }
  }, 60_000);
});
