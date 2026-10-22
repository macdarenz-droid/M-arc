// LIB-12-FIX (card docs/supervisor/verify/lib-12-fix-card.md; rulings D-LIB12FIX-*): X1 the words of LIB-12's 2 pair keys
// (D-LIB12FIX-WORDS), X3 LIB-12's pictures carry (D-LIB12FIX-CARRY: the 17 renders and the LIB-12 files pinned, re-based by
// D-LIB12FIX-R8 for the fix round; each panel page equal to its first id's render) and R8-* the critic findings' fixes
// (D-LIB12FIX-R8: copied engine values pinned to golden B, palm-flat, front-rack, cupped and ball geometry). Each check
// has its mutation in the same describe.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any, C: any, PN: any, L: any, VC: any, PF: any, FR: any, CU: any, BA: any, hand: any;
beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
  PN = await import(/* @vite-ignore */ url('tools/plates/library/hands/panel.mjs'));
  L = await import(/* @vite-ignore */ url('tools/plates/library/hands/lib12-hand.mjs'));
  VC = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-common.mjs'));
  PF = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-palm-flat.mjs'));
  FR = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-front-rack.mjs'));
  CU = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-cupped.mjs'));
  BA = await import(/* @vite-ignore */ url('tools/plates/library/hands/view-ball.mjs'));
  hand = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand.mjs'));
}, 60_000);

// `renderPair(id, { fault }).svg` sha256, re-based by D-LIB12FIX-R8 (#191 6273389908) on the fix round; battle_ropes keeps
// its 0d268a71 value (6905ad26…), asserted below. 0d268a71's combined value was 0bc3ba3d…5fee0. front_squat, goblet_squat
// and wall_ball left with D-LIB12FIX-R8-GAPS (#191 6274835211): 17 pins, and their hand modules re-pinned.
const RENDERS: Record<string, string> = {
  'battle_ropes death-grip': '6905ad26ee6b33f71572948bf11adc0cd12e1f2e962a338a9e596390b634dac9',
  'bear_crawl cupped-palm': 'fac0517c29b438060d9cfdea8c605c55f43f9ff64b05a28aa8d9eaf573429055',
  'bear_crawl hand-ahead': 'c345f8a28a9eccacf014ffde028645e621c0cb0fefb068c08b24a960a0a6fc79',
  'bird_dog cupped-palm': '5756407c3d03c1859357543cceca2cb4778417ca8c7da0710c510af7460f170e',
  'bird_dog hand-ahead': 'efb650c677445997a98d22e5c75895ce0365bcb45f36eb18e58ffbba9b462ed7',
  'burpee cupped-palm': 'a5f846b23bbf68a8291c964e0b3780e637d0f07feba762f994b9cd80181c2203',
  'burpee hand-ahead': '529e1a6c1b225730391caf4a7b2646dcf85d27c8a99da602a746967d34af8433',
  'diamond_push_up cupped-palm': 'c0e3f1ad7ae04106a7550872a8b9ecab2b99b8627f30f1d87d0bcb962d0aeae3',
  'diamond_push_up hand-ahead': 'ee3bec5379878a81aeaa585e7f6740e69f2addc32a98b098123e934b0e4df7ae',
  'incline_push_up cupped-palm': 'a18df8d32d879e281e0a93a3723e05d167c5c446a3515755159cbac9c3375ef2',
  'incline_push_up hand-ahead': 'ca7866806e1ba96405e15e6019fd706bba1edc1d3e8af267ecd9733c0f83d1b3',
  'mountain_climbers cupped-palm': 'f3ee0373c153f3257e91a878ee87beb70b61630130f12358d4ae6009f8b983af',
  'mountain_climbers hand-ahead': 'b3c334b86f5eac9db64e6a4993396403982b0cffa47ce1ffb2abc3b65fd15453',
  'pike_push_up cupped-palm': '6aaca4f1b12ef8c87ab4bcfcaabe4b1c9c099e5d6043d31edfcf7f325f092223',
  'pike_push_up hand-ahead': '40378349c5b9d53bb94ff86ec4343a33e4b101b9391134d4080336fb42c3f4fd',
  'push_up cupped-palm': 'f0c348b8721d1f47867076b5e7a3f309e05e7ec58887ca96a7efa4bc0f9d628d',
  'push_up hand-ahead': '616b67507ad9f282b89b06659a5559c339d0269c4880a39f80add80afe8a593f',
};
const COMBINED = '6513d372ad014a5815a6ee5f5bbc189e94c212c163ccbf9f8cfe24a770b619e7';
const BATTLE_ROPES_0D268A71 = '6905ad26ee6b33f71572948bf11adc0cd12e1f2e962a338a9e596390b634dac9';
// D-LIB12FIX-CARRY's 15 files plus lib12-hand.mjs, sha256 re-based by D-LIB12FIX-R8: the 4 failing keys' hand and view
// files and the new lib12-hand.mjs changed; hand-ab-wheel, hand-dip-bar, hand-implement, hand-battle-rope, view-common,
// lib12-claims.json and gate-lib12.mjs keep their 0d268a71 bytes
const FILES: Record<string, string> = {
  'tools/plates/library/hands/hand-ab-wheel.mjs': 'baedc7b1fef16979d7299419bc62a74901bd0c6460ba7cbf614a6938f3550bfd',
  'tools/plates/library/hands/hand-ball-contact.mjs': '163cffaad9f2d36fb7109284269753a5e218ba8a4b15c5d2a322e14d8ede9ad9',
  'tools/plates/library/hands/hand-battle-rope.mjs': '7fbc952477412fff7f8dfd58cc93259b8d103375c512fd59931f4156b7de355c',
  'tools/plates/library/hands/hand-cupped.mjs': 'e22adb5586210ef115a38f4b5f0ac7d707b5426385d3670b929c317c0600138e',
  'tools/plates/library/hands/hand-dip-bar.mjs': 'd203314d315ab7086d381cd97e85d4f8a1b67acab271a72fee87f1a0ff8bd33c',
  'tools/plates/library/hands/hand-front-rack.mjs': 'cffc8eddb1f20390c6e7fb7a04106940a8263a5df0346b83db6026c2d8920580',
  'tools/plates/library/hands/hand-implement.mjs': 'a3ebf113cce043057efc3762f6a46a80bedf516c2ce0771240cdd00a6ed5e9ad',
  'tools/plates/library/hands/hand-palm-flat.mjs': '3049d21f99571f74d1da503377c28c4baa3ca8cfc0ce90a2c519b533119f262d',
  'tools/plates/library/hands/view-ball.mjs': '0a456eb6aa99b6d8e21f9530ebf1e143ca50dd67c36f0d20b4274f8365ffd80c',
  'tools/plates/library/hands/view-common.mjs': '5b558ccc78eb46bbe1e5b49d47ab6d87062748316ce0f5c11e5c254a029840eb',
  'tools/plates/library/hands/view-cupped.mjs': '5734f4ebdc29b4d899e66dc9c38cfe0ea0005339848f2739c3805110ec8d3b90',
  'tools/plates/library/hands/view-front-rack.mjs': '333a98d75f6b8f49e7137b53e39f311c41699d3f2e442e5f9029902920ad5b93',
  'tools/plates/library/hands/view-palm-flat.mjs': 'af896f09360fe69524ce39dc0ee143e2aa87c84e2e2ad61e74d186ed163cc285',
  'tools/plates/library/hands/lib12-claims.json': '8d38035cd870440d093cd071caa055ec51e015716abbf3400a282682e32669bc',
  'tools/plates/library/hands/gate-lib12.mjs': '025c1e3ba9a086ffcf652ff947ecfe9edec40180f921c32945cf16f22bb81ee4',
  'tools/plates/library/hands/lib12-hand.mjs': '8f28d24a003597b5962c69b016731c53ca2e9ed3f74c70597031ddf8ce1f37c2',
};
// the research shared cards that carry a LIB-12 fault key (main f125edab): [file, fault key, label]
// wall_ball's and front_squat's pairs left with their ids (D-LIB12FIX-R8-GAPS, #191 6274835211)
const RESEARCH = [
  ['implement-battle-ropes', 'death-grip', 'Too tight'],
  ['palm-flat', 'cupped-palm', 'Palm cupped'],
  ['palm-flat', 'hand-ahead', 'Hand ahead'],
];
const HEADING = 'Hand: right and wrong';

// in-memory copies of the key modules (hand-pairs.test.ts's technique: files untouched)
const clone = () => P.MODULES.map((m: any) => ({ ...m, HANDLE: structuredClone(m.HANDLE), VARIANTS: structuredClone(m.VARIANTS ?? {}), IDS: structuredClone(m.IDS ?? {}), GAPS: { ...(m.GAPS ?? {}) } }));
const lib12 = () => P.MODULES.filter((m: any) => m.OWNER === 'LIB-12');
/** LIB-12's pair keys: key -> { mod, variant, ids } in first-drawn order. */
function lib12Keys(index = P.INDEX) {
  const out = new Map<string, any>();
  for (const [id, { mod: m, cfg }] of index.drawn) {
    if (m.OWNER !== 'LIB-12') continue;
    const k = P.keyOfCfg(m, cfg);
    if (!out.has(k)) out.set(k, { mod: m, variant: cfg.variant, ids: [] });
    out.get(k).ids.push(id);
  }
  return out;
}
/** X1: each LIB-12 key's words against its module's rightNote and drawn fault labels. */
function wordsProblems(all = PN.allWords(), index = P.INDEX) {
  const bad: string[] = [];
  for (const [k, { mod, variant }] of lib12Keys(index)) {
    const W = all.keys[k], V = mod.VARIANTS[variant];
    if (!W) { bad.push(`${k}: no words`); continue; }
    if (W.heading?.text !== HEADING || !W.heading?.source?.trim()) bad.push(`${k}: heading`);
    if (Object.keys(W.faults).join() !== Object.keys(V.faults).join()) bad.push(`${k}: faults [${Object.keys(W.faults)}], drawn [${Object.keys(V.faults)}]`);
    for (const [f, F] of Object.entries<any>(V.faults)) {
      const w = W.faults[f];
      if (w?.right?.text !== V.rightNote) bad.push(`${k} ${f}: right "${w?.right?.text}", drawn "${V.rightNote}"`);
      for (const s of ['wrong', 'pager']) if (w?.[s]?.text !== F.label) bad.push(`${k} ${f}: ${s} "${w?.[s]?.text}", drawn "${F.label}"`);
      for (const s of ['right', 'wrong', 'pager']) if (!w?.[s]?.source?.trim()) bad.push(`${k} ${f}: ${s} without a source`);
    }
  }
  return bad;
}
/** X1: each research pair's label equals the shared card's and the LIB-12 words for that fault. */
function researchProblems(read = (f: string) => readFileSync(`docs/research/howto/shared/${f}.json`, 'utf8'), all = PN.allWords()) {
  const bad: string[] = [];
  for (const [file, key, label] of C.sweep(RESEARCH, 3, 'research pairs')) {
    const card = JSON.parse(read(file!)).faults?.find((x: any) => x.key === key);
    if (card?.label !== label) bad.push(`${file} ${key}: research label "${card?.label}", expected "${label}"`);
    const used = [...lib12Keys()].filter(([k]) => all.keys[k]?.faults?.[key!]);
    if (!used.length) bad.push(`${file} ${key}: no LIB-12 key draws it`);
    for (const [k] of used) if (all.keys[k].faults[key!].wrong.text !== card?.label) bad.push(`${k} ${key}: wrong "${all.keys[k].faults[key!].wrong.text}", research "${card?.label}"`);
  }
  return bad;
}
/** X3: the 17 renders against RENDERS, swept at 17. */
function renderProblems(index = P.INDEX) {
  const bad: string[] = [], rows: string[][] = [];
  for (const m of lib12()) for (const id of Object.keys(m.IDS)) for (const w of P.pairSpec(id, index).wrong) rows.push([id, w.key, sha(P.renderPair(id, { fault: w.key, index }).svg)]);
  C.sweep(rows, 17, 'LIB-12 pair renders');   // D-LIB12FIX-R8-GAPS, #191 6274835211
  for (const [id, f, h] of rows) if (RENDERS[`${id} ${f}`] !== h) bad.push(`${id} ${f}: render ${h}`);
  return bad;
}
const fileProblems = (read = (f: string) => readFileSync(f)) => C.sweep(Object.keys(FILES), 16, 'LIB-12 files').filter((f: string) => sha(read(f)) !== FILES[f]);

describe('LIB-12-FIX X1: words per LIB-12 key (D-LIB12FIX-WORDS)', () => {
  it('the 2 LIB-12 keys have words files; right = rightNote, wrong = pager = the drawn label, each with a source; heading golden B\'s', async () => {
    const keys = C.sweep(lib12Keys().keys(), 2, 'LIB-12 pair keys');   // D-LIB12FIX-R8-GAPS, #191 6274835211
    expect(keys.sort()).toEqual(['battle-rope-rope-neutral', 'palm-flat-floor-over']);
    expect(Object.keys(PN.allWords().keys).filter(k => keys.includes(k)).sort()).toEqual(keys);
    expect(wordsProblems()).toEqual([]);
    for (const k of keys) expect((await P.pairPanel(k)).includes(HEADING)).toBe(true);
  }, 60_000);
  it('the 3 research pairs equal their shared cards\' labels and the words', () => {
    expect(researchProblems()).toEqual([]);
  });
  it('mutations: a missing words file, a count one short, an 11-word caption, an empty source, a wrong text off the drawing, a research label changed are each red', async () => {
    const k = 'palm-flat-floor-over', all = PN.allWords(), faults = ['cupped-palm', 'hand-ahead'], pages = faults.map(f => ({ fault: f, svg: '' }));
    const none = { chrome: all.chrome, keys: {} };
    expect(() => PN.panelHtml(k, pages, none)).toThrow(`hand panel ${k}: no words in tools/plates/library/hands/words/${k}.json`);
    expect(wordsProblems({ ...all, keys: Object.fromEntries(Object.entries(all.keys).filter(([x]) => x !== k)) })).toEqual([`${k}: no words`]);
    expect(() => C.sweep(P.keysOf(), 8 + 1, 'pair keys')).toThrow('pair keys: 10, expected 9');   // D-LIB12FIX-R8-GAPS: 8 + 2
    const long = structuredClone(all); long.keys[k].faults['hand-ahead'].wrong.text = 'Hand ahead of the shoulder line with weight on the fingers';
    expect(() => PN.panelHtml(k, pages, { chrome: long.chrome, keys: { [k]: long.keys[k] } })).toThrow(/hand-ahead.wrong has 11 words \(max 10\)/);
    const noSrc = structuredClone(all); noSrc.keys[k].faults['cupped-palm'].right.source = '';
    expect(() => PN.panelHtml(k, pages, { chrome: noSrc.chrome, keys: { [k]: noSrc.keys[k] } })).toThrow(/cupped-palm.right has no approved text and source/);
    expect(wordsProblems(noSrc)).toEqual([`${k} cupped-palm: right without a source`]);
    const off = structuredClone(all); off.keys[k].faults['hand-ahead'].wrong.text = 'Hands forward';
    expect(wordsProblems(off)).toEqual([`${k} hand-ahead: wrong "Hands forward", drawn "Hand ahead"`]);
    expect(researchProblems(undefined, off)).toEqual([`${k} hand-ahead: wrong "Hands forward", research "Hand ahead"`]);
    const read = (f: string) => readFileSync(`docs/research/howto/shared/${f}.json`, 'utf8').replace('"label": "Palm cupped"', '"label": "Palm curled"');
    expect(researchProblems(read)).toEqual(['palm-flat cupped-palm: research label "Palm curled", expected "Palm cupped"',
      'palm-flat-floor-over cupped-palm: wrong "Palm cupped", research "Palm curled"']);
  }, 60_000);
});

describe('LIB-12-FIX X3: LIB-12\'s pictures carry (D-LIB12FIX-CARRY)', () => {
  it('the 17 renders equal their pins (battle_ropes 0d268a71\'s), combined by M1\'s method; the 16 files are byte-identical', () => {
    expect(renderProblems()).toEqual([]);
    const rows = Object.entries(RENDERS).map(([k, h]) => [...k.split(' '), h]).sort((a, b) => a[0]! < b[0]! ? -1 : a[0]! > b[0]! ? 1 : a[1]! < b[1]! ? -1 : a[1]! > b[1]! ? 1 : 0);
    expect(sha(rows.map(r => r[2]).join('\n'))).toBe(COMBINED);
    expect(fileProblems()).toEqual([]);
    expect(RENDERS['battle_ropes death-grip']).toBe(BATTLE_ROPES_0D268A71);
  }, 60_000);
  it('each LIB-12 panel page === renderPair(first id, { fault }).svg with hp-<id>-<fault> swapped for hp-<key>-<fault> (6 pages)', async () => {
    let n = 0;
    for (const [k, { ids }] of lib12Keys()) {
      const svgs = [...(await P.pairPanel(k)).matchAll(/<div class="hand-plate">([\s\S]*?)<\/div><div class="zoom-caps">/g)].map(m => m[1]!), id = ids[0];
      P.pairSpec(id).wrong.forEach((w: any, i: number) => {
        const want = P.renderPair(id, { fault: w.key }).svg.split(`hp-${id.replace(/_/g, '-')}-${w.key}`).join(`hp-${k}-${w.key}`);
        expect([k, w.key, svgs[i] === want]).toEqual([k, w.key, true]);
        n++;
      });
      expect([k, svgs.length]).toEqual([k, P.pairSpec(id).wrong.length]);
    }
    expect(n).toBe(3);   // D-LIB12FIX-R8-GAPS, #191 6274835211
  }, 60_000);
  it('mutations: palm-flat cupped Wrong at 12 deg, palm-flat at orientation under, one view file\'s bytes changed are each red', () => {
    const lift = clone(), pf0 = lift.find((m: any) => m.KEY === 'palm-flat');   // front-rack's mutation moved with its id to GAPS (D-LIB12FIX-R8-GAPS, #191 6274835211)
    for (const V of Object.values<any>(pf0.VARIANTS)) V.faults['cupped-palm'].pose.cup = 12;
    expect(renderProblems(P.indexOf(lift)).filter((p: string) => / cupped-palm: render /.test(p)).length).toBe(8);
    const under = clone(), pf = under.find((m: any) => m.KEY === 'palm-flat');
    for (const c of Object.values<any>(pf.IDS)) c.orientation = 'under';
    // the palm-flat view draws no orientation (hand-views.test.ts D-LIB7-PIN2 catches the same hand drawn twice), so
    // the renders stay equal; the move is caught by the key: palm-flat-floor-under has no reviewed words
    expect(renderProblems(P.indexOf(under))).toEqual([]);
    expect(wordsProblems(undefined, P.indexOf(under))).toEqual(['palm-flat-floor-under: no words']);
    const dir = mkdtempSync(join(tmpdir(), 'lib12fix-')), f = 'tools/plates/library/hands/view-cupped.mjs';
    try {
      writeFileSync(join(dir, 'view-cupped.mjs'), readFileSync(f, 'utf8') + ' ');
      expect(fileProblems(p => p === f ? readFileSync(join(dir, 'view-cupped.mjs')) : readFileSync(p))).toEqual([f]);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  }, 60_000);
});

// ---------- D-LIB12FIX-R8: the fix round ----------
const ENGINE_SRC = readFileSync('tools/plates/layers/engine/hand.mjs', 'utf8');
/** Numbers of a source text, in order, signed ('- 2' read as -2); the source text itself is matched verbatim. */
const numsOf = (t: string) => (t.replace(/- (\d)/g, '-$1').match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
/** Each copied value's position among its source's numbers, one per value in order (Low 3 of 6278825702, ruled 6278835457). */
const AT: Record<string, number[]> = {
  fingerT: [0, 1, 2], fingerScale: [0, 1], thumbT: [0, 1, 2], dorsal: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  knuckle: [1, 2, 4, 5, 7, 8], palmEnds: [0, 1, 3, 4, 5, 6], foreTip: [0, 1, 2, 3, 4, 5], foreCut: [0, 1, 2, 3, 4, 5, 6, 7],
  knucklePad: [0, 2, 4], indexTaper: [4, 9, 14], farTaper: [2, 3], thumbTaper: [4, 9], compression: [0], ring: [0], crease: [1, 2],
  nail: [1, 2, 4, 5, 7, 8], nailT: [3], wristCrease: [0, 1, 2, 3, 6, 8, 10, 11, 14], bones: [0, 4, 5, 6, 7, 8, 9], barMark: [0, 5], resample: [0],
};
/** Value positions copied as the size of a term the source subtracts ('19 - 5.5' is read as -5.5, copied as 5.5). */
const SUBTRACTED: Record<string, number[]> = { wristCrease: [7] };
const copyBad = (k: string, want: number[], have: number[], at = AT[k] ?? []) => want.length !== at.length
  || at.some((p, j) => j > 0 && p <= at[j - 1]!)
  || want.some((x, j) => x !== (SUBTRACTED[k]?.includes(j) ? -1 : 1) * have[at[j]!]!);
const drift = (src = ENGINE_SRC, copied = L.ENGINE_COPIED) => Object.entries<any>(copied)
  .filter(([k, v]) => !v.src.every((t: string) => src.includes(t)) || copyBad(k, v.value.flat(), v.src.flatMap(numsOf))).map(([k]) => k);

describe('LIB-12-FIX R8-DRIFT: values copied from golden-B hand.mjs and the pair chrome stay golden B\'s (D-LIB12FIX-R8)', () => {
  it('every ENGINE_COPIED value equals, signed and in order, its source text\'s number in hand.mjs, one per value; view-common\'s FINGER_T is the copied one', () => {
    C.sweep(Object.keys(L.ENGINE_COPIED), 21, 'copied engine values');
    expect(Object.keys(AT)).toEqual(Object.keys(L.ENGINE_COPIED));
    expect(drift()).toEqual([]);
    expect(L.ENGINE_COPIED.fingerT.value).toBe(VC.FINGER_T);
  });
  it('mutations: an engine value changed in hand.mjs, a copied value changed, a source line gone, a copied sign flipped, wristCrease cut short are each red', () => {
    expect(drift(ENGINE_SRC.replace('const tPP = 9.8 * s', 'const tPP = 9.9 * s'))).toEqual(['fingerT']);
    const c2 = structuredClone(L.ENGINE_COPIED); c2.dorsal.value[2][1] = 18.5;
    expect(drift(ENGINE_SRC, c2)).toEqual(['dorsal']);
    expect(drift(ENGINE_SRC.replace('det += bone(-13, -8, -8) + bone(9, 7, -12);', ''))).toEqual(['bones']);
    const c4 = structuredClone(L.ENGINE_COPIED); c4.bones.value[1] = 13;
    expect(drift(ENGINE_SRC, c4)).toEqual(['bones']);
    const c5 = structuredClone(L.ENGINE_COPIED); c5.wristCrease.value = c5.wristCrease.value.slice(0, 5);
    expect(drift(ENGINE_SRC, c5)).toEqual(['wristCrease']);
  });
  const ring = [[0, 0], [40, 0], [40, 30], [0, 30]];
  const spec = { uid: 'dr', camera: 'side', rightNote: 'A', wrongNote: 'B', alt: { right: 'r', wrong: 'w' } };
  const viaCommon = (r: number[][]) => VC.viewPair({ ...spec, right: { parts: [{ kind: 'skin', ring: r }, { kind: 'joint', at: [10, 10] }], anchor: [0, 0], report: {} },
    wrong: { parts: [{ kind: 'skin', ring }, { kind: 'contact', at: [20, 5] }], anchor: [0, 0], report: {} } }).svg;
  const viaHand = (r: number[][]) => L.handPair({ ...spec, right: { layers: [{ union: 'h-skin', rings: [{ ring: r, smooth: true }] }, { joint: true, at: [10, 10] }], anchor: [0, 0], report: {} },
    wrong: { layers: [{ union: 'h-skin', rings: [{ ring, smooth: true }] }, { contact: true, at: [20, 5] }], anchor: [0, 0], report: {} } }).svg;
  it('handPair draws the same parts byte-identically to view-common viewPair (chrome, fit, unions, joint, contact)', () => {
    expect(viaHand(ring)).toBe(viaCommon(ring));
  });
  it('mutation: a different outline on one side is red', () => {
    expect(viaHand(ring.map(p => [p[0]!, p[1]! + 1]))).not.toBe(viaCommon(ring));
  });
});

const lib12Renders = () => C.sweep(P.MODULES.filter((m: any) => m.OWNER === 'LIB-12').flatMap((m: any) => Object.entries<any>(m.IDS).flatMap(([id, c]) => c.faults.map((f: string) => ({ m, id, f, r: P.renderPair(id, { fault: f }) })))), 17, 'LIB-12 renders');   // D-LIB12FIX-R8-GAPS
const belowFloor = (rep: any) => ['right', 'wrong'].filter(h => Math.max(...rep[h].outline.map((p: number[]) => p[1])) > 1e-6);
const thumbProblems = (rep: any) => ['right', 'wrong'].filter(h => !(rep[h].thumbOfHL >= 0.3 && rep[h].thumbOfHL <= 0.42)).map(h => `${h}: thumb ${rep[h].thumbOfHL} of HL`);

describe('LIB-12-FIX R8-PF: palm-flat is a hand on the floor (critic C5 boot/mitten, thumb length; cupped-palm C3)', () => {
  it('on all 16 pages: no outline point below the floor; the visible thumb is 0.30-0.42 of the hand length (golden-B HAND_PROP)', () => {
    const pages = lib12Renders().filter((x: any) => x.m.KEY === 'palm-flat');
    C.sweep(pages, 16, 'palm-flat pages');
    for (const { id, f, r } of pages) { expect([id, f, belowFloor(r.report)]).toEqual([id, f, []]); expect([id, f, thumbProblems(r.report)]).toEqual([id, f, []]); }
  }, 60_000);
  it('cupped-palm Wrong: heel and tip pads only, the finger off the floor along its length; hand-ahead Wrong keeps it flat', () => {
    const cup = P.renderPair('push_up', { fault: 'cupped-palm' }).report.wrong, ahead = P.renderPair('push_up', { fault: 'hand-ahead' }).report.wrong;
    expect([cup.floorBetweenHeelAndKnuckle, cup.fingerFloorRun <= 0.15, ahead.fingerFloorRun > 0.5]).toEqual([0, true, true]);
  });
  it('mutations: an outline point 4 mm under the floor, the old 0.82 thumb, a flat cupped Wrong are each red', () => {
    const rep = P.renderPair('push_up', { fault: 'cupped-palm' }).report;
    expect(belowFloor({ ...rep, right: { ...rep.right, outline: [...rep.right.outline, [30, 4]] } })).toEqual(['right']);
    expect(thumbProblems({ ...rep, wrong: { ...rep.wrong, thumbOfHL: 0.82 } })).toEqual(['wrong: thumb 0.82 of HL']);
    const flat = { right: PF.palmFlatHalf({}).report, wrong: PF.palmFlatHalf({ cup: 0 }, { role: 'wrong' }).report };
    expect(PF.palmFlatProblems(flat, 'cupped-palm').join('\n')).toMatch(/the finger lies on the floor along 0\.\d+ of its length/);
  });
});

/** A GAPS key's own render (its view code stays for F-LIB12-R8B, D-LIB12FIX-R8-GAPS, #191 6274835211): the variant's Right and first fault. */
const gapRender = (key: string) => {
  const m = P.MODULES.find((q: any) => q.KEY === key), V: any = Object.values<any>(m.VARIANTS)[0], [, F] = Object.entries<any>(V.faults)[0]!;
  return m.render({ uid: `g-${key}`, camera: 'side', loadAxis: V.loadAxis, markers: F.markers, right: V.right, wrong: { ...V.right, ...F.pose }, rightNote: V.rightNote, wrongNote: F.label, alt: { right: V.alt, wrong: F.alt } });
};
describe('LIB-12-FIX R8-FR: front-rack is golden B\'s hand under the bar at reference scale (critic C1, C4, C5, C7; a GAPS key since round 2, its view kept)', () => {
  it('palm up or back to the shoulder, wrist bent back, bar on the fingers, the bar\'s + mark, scale within 20 % of golden B\'s pull pair', async () => {
    const r = gapRender('front-rack'), rr = r.report.right;
    expect([rr.palmUpOrBack, rr.wristExtDeg >= 60, rr.barAlongPalm > 1, rr.fingersTouch]).toEqual([true, true, true, true]);
    expect((r.svg.match(/class="h-eq-core" d="M[^"]+L[^"]+M[^"]+L[^"]+"/g) ?? []).length).toBe(2);   // one + per half
    const pairs = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand-pairs.mjs'));
    const kRef = hand.renderHandPair(pairs.PAIRS.pull).report.scalePxPerMm;
    expect(Math.abs(r.report.scalePxPerMm / kRef - 1)).toBeLessThanOrEqual(0.2);
  });
  it('mutations: a palm facing down over the bar, the old body-diagram scale are each red', async () => {
    const r = gapRender('front-rack').report;
    expect(FR.frontRackProblems({ ...r, right: { ...r.right, palmUpOrBack: false } })).toEqual(['right: the palm faces down and forward, over the bar']);
    const pairs = await import(/* @vite-ignore */ url('tools/plates/layers/engine/hand-pairs.mjs'));
    expect(Math.abs(0.463 / hand.renderHandPair(pairs.PAIRS.pull).report.scalePxPerMm - 1)).toBeGreaterThan(0.2);   // front_squat's scale at 0d268a71 (measured)
  });
});

describe('LIB-12-FIX R8-CU: goblet is a cupped hand under the head and one dumbbell (critic C5, C6; a GAPS key since round 2, its view kept)', () => {
  it('thumb along the handle, fingers up the head\'s edge, the handle drawn through the forearm as a dashed hidden line', () => {
    const r = gapRender('cupped');
    for (const h of ['right', 'wrong']) expect([h, r.report[h].thumbAlongHandle, r.report[h].fingersClearOfHead]).toEqual([h, true, true]);
    expect((r.svg.match(/<path class="h-datum" d="M[^"]+Z"\/>/g) ?? []).length).toBe(2);   // the hidden handle, one per half
  });
  it('mutations: the thumb off the handle, the fingers in the head are each red', () => {
    const r = gapRender('cupped').report;
    expect(CU.cuppedProblems({ ...r, right: { ...r.right, thumbAlongHandle: false } })).toEqual(['right: the thumb is not along the handle']);
    expect(CU.cuppedProblems({ ...r, wrong: { ...r.wrong, fingersClearOfHead: false } })).toEqual(['wrong: the fingers cut into the head']);
  });
});

describe('LIB-12-FIX R8-BA: wall-ball hands are front-view hands with five digits (critic C5; a GAPS key since round 2, its view kept)', () => {
  const digits = (rep: any) => ['right', 'wrong'].filter(h => rep[h].digitsPerHand.join() !== '5,5');
  it('two hands of five digits each, in both halves', () => {
    const r = gapRender('ball-contact');
    expect(digits(r.report)).toEqual([]);
    expect((r.svg.match(/class="h-thumb"/g) ?? []).length).toBe(2);
  });
  it('mutation: a hand with a digit missing is red', () => {
    const r = gapRender('ball-contact').report;
    expect(digits({ ...r, wrong: { ...r.wrong, digitsPerHand: [5, 4] } })).toEqual(['wrong']);
  });
});
