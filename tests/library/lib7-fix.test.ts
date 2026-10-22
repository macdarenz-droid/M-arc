// LIB-7-FIX (card lib-7-fix-card.md; hands/DESIGN.md §8): LIB-7's loader contract for main's gen/handpairs.mjs. F1 the
// contract, F2 key identity, F3 exercise-neutral panels with approved words, F4 the approvals carry (byte proof against
// the pinned render), F6 (a) the per-key budget, F7 L2-A21's covering proof. Each check has its mutation in the same test.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
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
      expect(byKey.filter((f: string) => f === PN.WORDS_DIR || f.startsWith(`${PN.WORDS_DIR}/`))).toEqual([PN.CHROME_WORDS, PN.wordsFileOf(k)].sort());   // PK2: its own words file only (inputsFor sorts: D-LIB12FIX-ORDER)
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
function wordProblems(k: string, h: string, words = PN.allWords()) {
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
    expect(Object.keys(PN.allWords().keys).sort()).toEqual([...P.keysOf()].sort());   // the key files under hands/words/ equal keysOf(): no words for a key that is not drawn
  }, 60_000);
  it('mutations: a uid from an id, an 11-word caption, a caption with no source, a heading taken from a card are each red', async () => {
    const k = 'curl-dumbbell-neutral', id = 'hammer_curl', faults = P.pairSpec(id).wrong.map((w: any) => w.key);
    const byId = PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: P.renderPair(id, { fault: f, uid: `${id.replace(/_/g, '-')}-hand-${f}` }).svg })));
    expect(neutralProblems(k, byId).join('\n')).toMatch(/names hammer-curl/);
    const words = structuredClone(PN.allWords()), real = await P.pairPanel(k);
    words.keys[k].faults.curled.wrong.text = 'Wrist curled forward toward the forearm while you lift it up';
    expect(() => PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: '' })), words)).toThrow(/curled.wrong has 11 words \(max 10\)/);
    expect(wordProblems(k, real, words).join('\n')).toMatch(/wrong caption over 10 words/);
    const noSrc = structuredClone(PN.allWords()); noSrc.keys[k].faults['bent-back'].right.source = '';
    expect(() => PN.panelHtml(k, faults.map((f: string) => ({ fault: f, svg: '' })), noSrc)).toThrow(/bent-back.right has no approved text and source/);
    expect(wordProblems(k, real, noSrc).join('\n')).toMatch(/right without a source/);
    const card = structuredClone(PN.allWords()); card.keys[k].heading.text = 'Hammer Curl: right and wrong';
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

// ---- D-LIB7FIX-PERKEY (lib4-cards section 19): adding a key never edits a file that a pinned row lists ----
const WORDS_FIXTURE = JSON.parse(readFileSync('tests/library/fixtures/lib7fix/panel-words-da65b13a.json', 'utf8'));   // panel-words.json at da65b13a, parsed
const fixtureWords = (k: string) => ({ chrome: WORDS_FIXTURE.chrome, keys: { [k]: WORDS_FIXTURE.keys[k] } });
const pagesOf = (k: string, index = P.INDEX) => { const id = P.keyIndexOf(index).keys.get(k).ids[0]; return P.pairSpec(id, index).wrong.map((w: any) => ({ fault: w.key, svg: P.renderPair(id, { fault: w.key, uid: `hp-${k}-${w.key}`, index }).svg })); };
const wordsSplit = (all: any) => ({ about: all.about, chrome: all.chrome, keys: all.keys });
/** PK2: the inputs at or under hands/words/ are exactly chrome.json and the key's own file, and every input is a file. */
const wordsInputProblems = (k: string, list: string[], files = true) => {
  const bad: string[] = [], under = list.filter(f => f === PN.WORDS_DIR || f.startsWith(`${PN.WORDS_DIR}/`));
  if (JSON.stringify(under) !== JSON.stringify([PN.CHROME_WORDS, PN.wordsFileOf(k)].sort())) bad.push(`${k}: words inputs ${under}`);   // exact, order included (inputsFor sorts; D-LIB12FIX-ORDER)
  if (files) for (const f of list) if (!existsSync(f) || !statSync(f).isFile()) bad.push(`${k}: ${f} is not a file`);
  return bad;
};
// a key module with its own declarations (literals; THUMB_SIDE's words written out), drawing one id outside LB1/LB2, in no
// module and not a pinned row (D-LIB-SCRATCHIDS)
const fixtureModule = (KEY: string, decl: any = { CONVENTIONS: { 'ga:zz': 'fixture convention: base of the fingers' }, ORIENTATIONS: { zz: 'side' }, CAMERA_TEXT: { zz: 'Seen from the thumb side' } }) => {
  const dh = P.MODULES.find((m: any) => m.KEY === 'd-handle'), pull = structuredClone(dh.VARIANTS.pull);
  pull.claims.contact = ['ga:zz'];
  return { ...dh, KEY, OWNER: 'LIB-7-FIX-FIXTURE', FILE: `fixture/${KEY}`, ...decl, VARIANTS: { pull }, GAPS: {}, IDS: { box_jump: { variant: 'pull', orientation: 'zz', faults: ['curled'], claims: [] } } };
};
const KINDS = ['CONVENTIONS', 'ORIENTATIONS', 'CAMERA_TEXT'];
/** Apply declarationsOf(mods) onto pairs.mjs's exported objects for `f`, then remove what it added (hand-pairs.test.ts:94-97). */
async function withDeclared<T>(mods: any[], f: () => Promise<T> | T): Promise<T> {
  const d = P.declarationsOf(mods), added: [string, string][] = [];
  for (const K of KINDS) for (const n of Object.keys(d[K])) if (!(n in P[K])) { P[K][n] = d[K][n]; added.push([K, n]); }
  try { return await f(); } finally { for (const [K, n] of added) delete P[K][n]; }
}

describe('LIB-7-FIX PK1: words split per key, panels unchanged', () => {
  it('the 8 panels === panelHtml with da65b13a\'s words; chrome.json + words/<key>.json deep-equal panel-words.json; key files = keysOf()', async () => {
    // LIB-7's 8 keys, the ones da65b13a's file held; a later card's keys add their own files (D-LIB7FIX-PERKEY)
    const lib7 = C.sweep(Object.keys(WORDS_FIXTURE.keys), 8, 'LIB-7 pair keys in da65b13a\'s words');
    for (const k of lib7) expect([k, (await P.pairPanel(k)) === PN.panelHtml(k, pagesOf(k), fixtureWords(k))]).toEqual([k, true]);
    const all = PN.allWords();
    expect({ ...wordsSplit(all), keys: Object.fromEntries(lib7.map((k: string) => [k, all.keys[k]])) }).toEqual(WORDS_FIXTURE);
    expect(Object.keys(PN.allWords().keys)).toEqual([...P.keysOf()].sort());
  }, 60_000);
  it('no tool, script or test file names panel-words.json, apart from this reader', () => {
    const hits: string[] = [], walk = (d: string) => { for (const n of readdirSync(d)) { const p = `${d}/${n}`; if (n === 'node_modules' || n === '.gen') continue; if (statSync(p).isDirectory()) walk(p); else if (/\.(mjs|js|ts|json)$/.test(n) && readFileSync(p, 'utf8').includes('panel-words.json')) hits.push(p); } };
    for (const d of ['tools', 'scripts', 'tests', 'src']) walk(d);
    expect(hits).toEqual(['tests/library/lib7-fix.test.ts']);
  });
  it('mutations (in memory): one word changed, an extra key, a missing key file are each red', async () => {
    const k = 'curl-dumbbell-neutral', changed = structuredClone(PN.allWords());
    changed.keys[k].faults.curled.wrong.text = 'Wrist bent';
    expect({ ...wordsSplit(changed), keys: Object.fromEntries(Object.keys(WORDS_FIXTURE.keys).map(x => [x, changed.keys[x]])) }).not.toEqual(WORDS_FIXTURE);
    expect(PN.panelHtml(k, pagesOf(k), { chrome: changed.chrome, keys: { [k]: changed.keys[k] } })).not.toBe(await P.pairPanel(k));
    const extra = { ...PN.allWords().keys, 'zz-extra': PN.allWords().keys[k] };
    expect(Object.keys(extra).sort()).not.toEqual([...P.keysOf()].sort());
    expect(() => PN.readWords('zz-missing')).toThrow('hand panel zz-missing: no words in tools/plates/library/hands/words/zz-missing.json');
  }, 60_000);
});

describe('LIB-7-FIX PK2: inputs per key', () => {
  it('each key lists chrome.json and its own words file only under hands/words/, and only files', () => {
    for (const k of P.keysOf()) expect(wordsInputProblems(k, P.inputsFor(k))).toEqual([]);
  });
  it('mutations: inputsFor listing every words file, or WORDS_DIR, is red', () => {
    const k = 'rope-push-neutral', base = P.inputsFor(k);
    const every = [...new Set([...base, ...P.keysOf().map((x: string) => PN.wordsFileOf(x))])].sort();
    expect(wordsInputProblems(k, every).join('\n')).toMatch(/rope-push-neutral: words inputs/);
    expect(wordsInputProblems(k, [...base, PN.WORDS_DIR].sort()).join('\n')).toMatch(/words inputs.*\n.*tools\/plates\/library\/hands\/words is not a file/);
  });
  it('D-LIB12FIX-ORDER: a key that sorts before chrome passes the sorted pair and fails the fixed order; a missing chrome file is red', async () => {
    const fx = { ...fixtureModule('aa-fix'), FILE: P.MODULES.find((m: any) => m.KEY === 'd-handle').FILE };   // a real file for importClosure
    await withDeclared([...P.MODULES, fx], () => {
      const idx2 = P.indexOf([...P.MODULES, fx]), k = 'aa-fix-pull-zz', list = P.inputsFor(k, idx2);
      const under = list.filter((f: string) => f.startsWith(`${PN.WORDS_DIR}/`));
      expect(under).toEqual([PN.CHROME_WORDS, PN.wordsFileOf(k)].sort());   // F1's row, new check
      expect(under).not.toEqual([PN.CHROME_WORDS, PN.wordsFileOf(k)]);      // F1's row, the old fixed order: red
      expect(wordsInputProblems(k, list, false)).toEqual([]);                // PK2's row (its words file exists only in memory)
      expect(JSON.stringify(under) !== JSON.stringify([PN.CHROME_WORDS, PN.wordsFileOf(k)])).toBe(true);   // PK2's old comparison: red
    });
    const k = 'rope-push-neutral';
    expect(wordsInputProblems(k, P.inputsFor(k).filter((f: string) => f !== PN.CHROME_WORDS)).join('\n')).toMatch(/rope-push-neutral: words inputs/);
  }, 60_000);
});

describe('LIB-7-FIX PK3: declarations per module', () => {
  it('LIB-7 declares nothing; every name has one owner; the exports are the merge; pairs.mjs :21-34 unchanged', () => {
    const lib7 = P.declarationsOf(P.MODULES.filter((m: any) => m.OWNER === 'LIB-7'));
    for (const K of KINDS) expect([K, lib7[K]]).toEqual([K, P.BASE[K]]);
    const all = P.declarationsOf(P.MODULES);
    for (const K of KINDS) {
      expect([K, { ...P[K] }]).toEqual([K, all[K]]);
      expect(Object.keys(all[K]).sort()).toEqual(Object.keys(all.ownerOf).filter((n: string) => n.startsWith(`${K}.`)).map((n: string) => n.slice(K.length + 1)).sort());
    }
    const text = readFileSync('tools/plates/library/hands/pairs.mjs', 'utf8').split('\n').slice(20, 34).join('\n') + '\n';
    expect(sha(text)).toBe('ab4c0c17658f00c928a3d230626d1dc6f1c0d2978d1326db2ae944408e1afba1');   // lines 21-34 at da65b13a
    expect(readFileSync('tools/plates/library/hands/pairs.mjs', 'utf8').match(/THUMB_SIDE = '([^']+)'/)![1]).toBe('Seen from the thumb side');   // the fixture's literal
  });
  it('a fixture module\'s own convention, orientation and camera words are read by indexOf, pairSpec, the sheet and G8', async () => {
    const fx = fixtureModule('zz-fix');
    await withDeclared([...P.MODULES, fx], async () => {
      const idx = P.indexOf([...P.MODULES, fx]), s = P.pairSpec('box_jump', idx);
      expect([s.orientation, s.camera, s.extras.cameraText]).toEqual(['zz', 'side', 'Seen from the thumb side']);
      expect((await S.buildSheet({ mods: [fx] })).body).toContain('ga:zz (convention: fixture convention: base of the fingers)');
      const { spec, pages } = C.renderedPages('box_jump', idx);
      expect(C.problemsOf(spec, pages).filter((p: string) => /G8 camera/.test(p))).toEqual([]);
      const keep = P.CAMERA_TEXT.zz;
      try { P.CAMERA_TEXT.zz = 'Seen from elsewhere'; expect(C.problemsOf(spec, pages).join('\n')).toMatch(/G8 camera "Seen from the thumb side", want "Seen from elsewhere"/); } finally { P.CAMERA_TEXT.zz = keep; }
    });
    expect('zz' in P.ORIENTATIONS || 'ga:zz' in P.CONVENTIONS || 'zz' in P.CAMERA_TEXT).toBe(false);
  }, 60_000);
  it('mutations: a redefined name, one name from two modules, a foreign name used, camera words for no orientation each throw naming it', () => {
    expect(() => P.declarationsOf([...P.MODULES, fixtureModule('zz-a', { CONVENTIONS: { 'ga:pull-base': 'x' } })])).toThrow('hand pairs: zz-a declares CONVENTIONS.ga:pull-base, already defined by pairs.mjs');
    expect(() => P.declarationsOf([fixtureModule('zz-a'), fixtureModule('zz-b')])).toThrow('hand pairs: zz-b declares CONVENTIONS.ga:zz, already defined by zz-a');
    expect(() => P.declarationsOf([fixtureModule('zz-a'), fixtureModule('zz-b', {})])).toThrow('hand pairs: zz-b uses ORIENTATIONS.zz, declared by zz-a');
    const convUser = { ...fixtureModule('zz-b', { ORIENTATIONS: { yy: 'side' } }) }; convUser.IDS = { box_jump: { ...convUser.IDS.box_jump, orientation: 'yy' } };
    expect(() => P.declarationsOf([fixtureModule('zz-a'), convUser])).toThrow('hand pairs: zz-b uses CONVENTIONS.ga:zz, declared by zz-a');
    expect(() => P.declarationsOf([fixtureModule('zz-a', { CONVENTIONS: { 'ga:zz': 'x' }, ORIENTATIONS: { zz: 'side' }, CAMERA_TEXT: { qq: 'Seen from q' } })])).toThrow('hand pairs: zz-a declares CAMERA_TEXT.qq for an orientation no module or pairs.mjs holds');
  });
});

// PK4 (b): the esbuild import closure, as tools/plates/library/ci/manifest.mjs importClosure computes it (the BUILDERS term)
async function esbuildClosure(entries: string[], root: string) {
  const { build } = await import('esbuild');
  const r = await build({ entryPoints: entries, bundle: true, write: false, metafile: true, format: 'esm', platform: 'node', packages: 'external', logLevel: 'silent', absWorkingDir: root, outdir: 'l0-out' });
  return Object.keys(r.metafile.inputs).map(p => p.split('\\').join('/')).sort();
}
const DUMMY_MODULE = `// LIB-7-FIX PK4 scratch key module (a scratch worktree only; never in the repo tree)
import { pullVariant, RULES_FILE } from './radial-rules.mjs';
export const KEY = 'zz-dummy', OWNER = 'LIB-7-FIX-FIXTURE', VIEW = 'radial', INPUTS = [RULES_FILE];
export const HANDLE = { profile: 'd-handle', diameterMm: 30 };
export const ORIENTATIONS = { zz: 'side' };
export const CAMERA_TEXT = { zz: 'Seen from the thumb side' };
export const VARIANTS = { pull: pullVariant({ thumbClaims: [], wristClaims: [], curledClaims: [] }) };
export const IDS = { box_jump: { variant: 'pull', orientation: 'zz', faults: ['curled'], claims: [] } };
export const GAPS = {};
`;

describe('LIB-7-FIX PK4: adding a key moves no existing key\'s files', () => {
  it('(a) in memory: with a declaring fixture key added, every existing key\'s inputsFor and panel are equal', async () => {
    const fx = fixtureModule('zz-fix');
    await withDeclared([...P.MODULES, fx], async () => {
      const idx2 = P.indexOf([...P.MODULES, fx]);
      expect(P.keysOf(idx2)).toContain('zz-fix-pull-zz');
      for (const k of P.keysOf()) {
        expect([k, P.inputsFor(k, idx2)]).toEqual([k, P.inputsFor(k)]);
        expect([k, (await P.pairPanel(k, idx2)) === (await P.pairPanel(k))]).toEqual([k, true]);
      }
    });
  }, 60_000);
  it('(b) files: a scratch worktree of HEAD with a new key module and words file lists the same files, bytes and closure', async () => {
    const { execFileSync } = await import('node:child_process');
    const wt = join(tmpdir(), `lib7fix-pk4-${process.pid}-${Date.now()}`), git = (...a: string[]) => execFileSync('git', a, { stdio: 'pipe' }).toString();
    try {
      git('worktree', 'add', '--detach', '--no-checkout', wt, 'HEAD');
      git('-C', wt, 'checkout', 'HEAD', '--', 'tools/plates', 'src/data');
      writeFileSync(join(wt, 'tools/plates/library/hands/hand-zz-dummy.mjs'), DUMMY_MODULE);
      writeFileSync(join(wt, 'tools/plates/library/hands/words/zz-dummy-pull-zz.json'), JSON.stringify(PN.allWords().keys['d-handle-pull-unstated'], null, 1));
      const W = await import(/* @vite-ignore */ pathToFileURL(join(wt, 'tools/plates/library/hands/pairs.mjs')).href);
      expect(W.HAND_OF_ID.lib_box_jump).toBe('zz-dummy-pull-zz');
      expect(W.keysOf().filter((k: string) => k !== 'zz-dummy-pull-zz')).toEqual(P.keysOf());
      for (const k of P.keysOf()) {
        expect([k, W.inputsFor(k)]).toEqual([k, P.inputsFor(k)]);
        for (const f of P.inputsFor(k)) expect([k, f, sha(readFileSync(join(wt, f)))]).toEqual([k, f, sha(readFileSync(f))]);
      }
      const PAIRS = 'tools/plates/library/hands/pairs.mjs', here = await esbuildClosure([PAIRS], process.cwd());
      expect(await esbuildClosure([PAIRS], wt)).toEqual(here);
      expect(here.filter(f => /library\/hands\/(hand-[a-z0-9-]+\.mjs|words\/)/.test(f))).toEqual([]);
      // mutations (scratch worktree only): a static key-file import in pairs.mjs grows the closure; inputsFor listing every module FILE moves
      const src = readFileSync(join(wt, PAIRS), 'utf8');
      writeFileSync(join(wt, PAIRS), `import './hand-curl.mjs';\n${src}`);
      expect((await esbuildClosure([PAIRS], wt)).filter(f => /hand-curl\.mjs$/.test(f))).toEqual(['tools/plates/library/hands/hand-curl.mjs']);
      writeFileSync(join(wt, PAIRS), src);
      const everyFile = (X: any, k: string) => [...X.inputsFor(k), ...X.MODULES.map((m: any) => m.FILE)].sort();
      expect(everyFile(W, 'rope-push-neutral')).not.toEqual(everyFile(P, 'rope-push-neutral'));
      // (c) once LIB-4c is on this head: its own importClosure(BUILDERS term) and each keyed id's inputsFor(HAND_OF_ID[id])
      if (existsSync('tools/plates/library/ci/manifest.mjs')) {
        const M = await import(/* @vite-ignore */ url('tools/plates/library/ci/manifest.mjs'));
        expect(await M.importClosure([PAIRS], wt)).toEqual(await M.importClosure([PAIRS]));
        for (const [lid, k] of Object.entries<string>(P.HAND_OF_ID)) expect([lid, W.inputsFor(W.HAND_OF_ID[lid])]).toEqual([lid, P.inputsFor(k)]);
      }
    } finally {
      try { git('worktree', 'remove', '--force', wt); } catch { rmSync(wt, { recursive: true, force: true }); git('worktree', 'prune'); }
    }
  }, 60_000);
});
