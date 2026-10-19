// LIB-12-FIX (card docs/supervisor/verify/lib-12-fix-card.md; rulings D-LIB12FIX-*): X1 the words of LIB-12's five pair keys
// (D-LIB12FIX-WORDS) and X3 LIB-12's reviewed pictures carry (D-LIB12FIX-CARRY: the 20 renders and 15 files pinned at
// #191 0d268a71, and each panel page equal to its first id's render). Each check has its mutation in the same describe.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
let P: any, C: any, PN: any;
beforeAll(async () => {
  P = await import(/* @vite-ignore */ url('tools/plates/library/hands/pairs.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/hands/checks.mjs'));
  PN = await import(/* @vite-ignore */ url('tools/plates/library/hands/panel.mjs'));
}, 60_000);

// `renderPair(id, { fault }).svg` sha256 at #191 0d268a71 (Do 2; combined by the card's M1 method: 0bc3ba3d…5fee0)
const RENDERS: Record<string, string> = {
  'battle_ropes death-grip': '6905ad26ee6b33f71572948bf11adc0cd12e1f2e962a338a9e596390b634dac9',
  'bear_crawl cupped-palm': '1b492929f207aab1c0112739662a855e6bbb07fc8252c12f3cbc86d03fc4f794',
  'bear_crawl hand-ahead': '996ce08df2f0c165d77c37dd544464da6b6b37b5cbe3506ae6fe7b4bbedd5968',
  'bird_dog cupped-palm': 'fbdfd75e9a01e379f9faf9fa8e4115805654209e56930075674df7cff2db151b',
  'bird_dog hand-ahead': '53afdd644e3005a8440cf979aff83fd5177cf81ce4596401fdd66d11901cf0bd',
  'burpee cupped-palm': '740bb7787b7bcc4c8dd8ddbba257cba8cf47bd1e25db53c74274ac5cbfef173f',
  'burpee hand-ahead': '51ecd56142c776f4b008aa84cad40589ed4ca6c14e0599d84523aef46868c284',
  'diamond_push_up cupped-palm': 'd3eca4bef59016749a26181756ff9c1f489eca6bbff5babb7e08faaf140701e7',
  'diamond_push_up hand-ahead': '0503f7488e9879885da228e81d8fb091cf12933b764c8bf21f4455ced4b4183a',
  'front_squat bar-off-shoulders': '79bc170b0424040234688c84df62c8150a7f75ac2e00516015ca80df01e0d5f3',
  'goblet_squat weight-away': 'a82af960be855eb53b3a3cf1de511a370686013398ec887711eeb60860e81ef4',
  'incline_push_up cupped-palm': '9a980cbe86b95517560257cd898b47dc7ef4701956a3c6d4ca66b7c89a60bddd',
  'incline_push_up hand-ahead': '773c0aa0594d959f6302643f5a5f537d41b09688d5cf71cd1da757f5545418c8',
  'mountain_climbers cupped-palm': '16a6cb54366d3a37e21a78fa3c92152447f5c310b06ff42f29d04c2a52bf878c',
  'mountain_climbers hand-ahead': 'c28de9f6d6e2a6d9c09eb7ae5fc5bd3443c7f2639292160e20b33494739681b9',
  'pike_push_up cupped-palm': 'e5e15410934739c4e6cf2e5e30688b762649746801d62f1ccedd9e79f5baa42d',
  'pike_push_up hand-ahead': '2fafa1e40f0df5f79efb40816419e2cefeabb58d8d7f9d4703f11de2bb3829ef',
  'push_up cupped-palm': 'd077e3b9f944227a792a0d40b46715d537e21bdd5e012a750802beea9b6b5e62',
  'push_up hand-ahead': '5fdcbfc24bfca8e31f731feeeae843ebadda8e20947a86aeb92dba6ccb077e4b',
  'wall_ball side-sandwich': '78eadb1bee166e4338abcd580f59d3b5698b5148892e6572c7ed387233f39678',
};
const COMBINED = '0bc3ba3d2ef53820b72812a848fb9a8688b432025189e789295ed2cfd0e5fee0';
// D-LIB12FIX-CARRY's 15 files, sha256 at #191 0d268a71
const FILES: Record<string, string> = {
  'tools/plates/library/hands/hand-ab-wheel.mjs': 'baedc7b1fef16979d7299419bc62a74901bd0c6460ba7cbf614a6938f3550bfd',
  'tools/plates/library/hands/hand-ball-contact.mjs': 'd857e20378f41e0d19d544de4d05783ddb1dcd0e4d631a33a3b70294f6b7412c',
  'tools/plates/library/hands/hand-battle-rope.mjs': '7fbc952477412fff7f8dfd58cc93259b8d103375c512fd59931f4156b7de355c',
  'tools/plates/library/hands/hand-cupped.mjs': '590e6b4c5037552e00a9cda04aba092d46a117ace9cbb641b2adae67c3123884',
  'tools/plates/library/hands/hand-dip-bar.mjs': 'd203314d315ab7086d381cd97e85d4f8a1b67acab271a72fee87f1a0ff8bd33c',
  'tools/plates/library/hands/hand-front-rack.mjs': '7c4c5dd7a8e3f5fa48417f92061ec798899fa5e184041c3f4912c2d596200b34',
  'tools/plates/library/hands/hand-implement.mjs': 'a3ebf113cce043057efc3762f6a46a80bedf516c2ce0771240cdd00a6ed5e9ad',
  'tools/plates/library/hands/hand-palm-flat.mjs': 'bd271af03f15830d28e2df139137c7b30eff27e53b7bf5f7bdb3df8f91da6017',
  'tools/plates/library/hands/view-ball.mjs': '9834ee832ed60162d175a3f7bfc20c7ffa4f722deaf7eddceee246ded7f9b434',
  'tools/plates/library/hands/view-common.mjs': '5b558ccc78eb46bbe1e5b49d47ab6d87062748316ce0f5c11e5c254a029840eb',
  'tools/plates/library/hands/view-cupped.mjs': '24bc2f199c280758908a6ee35eea3f1a09f33a20fa8aedee87b5176711cfe19c',
  'tools/plates/library/hands/view-front-rack.mjs': '3dab86f0c90302cbeefc3d569274b21a38477fd5fbea351518ba7fce744156ee',
  'tools/plates/library/hands/view-palm-flat.mjs': '1a27dfe5c974bcb96c6b8f60652415abe393eb9ccd79b691fee74d0aebb46610',
  'tools/plates/library/hands/lib12-claims.json': '8d38035cd870440d093cd071caa055ec51e015716abbf3400a282682e32669bc',
  'tools/plates/library/hands/gate-lib12.mjs': '025c1e3ba9a086ffcf652ff947ecfe9edec40180f921c32945cf16f22bb81ee4',
};
// the research shared cards that carry a LIB-12 fault key (main f125edab): [file, fault key, label]
const RESEARCH = [
  ['implement-wall-ball', 'side-sandwich', 'Hands on sides'],
  ['implement-battle-ropes', 'death-grip', 'Too tight'],
  ['front-rack-exemption', 'bar-off-shoulders', 'Bar on hands'],
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
  for (const [file, key, label] of C.sweep(RESEARCH, 5, 'research pairs')) {
    const card = JSON.parse(read(file!)).faults?.find((x: any) => x.key === key);
    if (card?.label !== label) bad.push(`${file} ${key}: research label "${card?.label}", expected "${label}"`);
    const used = [...lib12Keys()].filter(([k]) => all.keys[k]?.faults?.[key!]);
    if (!used.length) bad.push(`${file} ${key}: no LIB-12 key draws it`);
    for (const [k] of used) if (all.keys[k].faults[key!].wrong.text !== card?.label) bad.push(`${k} ${key}: wrong "${all.keys[k].faults[key!].wrong.text}", research "${card?.label}"`);
  }
  return bad;
}
/** X3: the 20 renders against RENDERS, swept at 20. */
function renderProblems(index = P.INDEX) {
  const bad: string[] = [], rows: string[][] = [];
  for (const m of lib12()) for (const id of Object.keys(m.IDS)) for (const w of P.pairSpec(id, index).wrong) rows.push([id, w.key, sha(P.renderPair(id, { fault: w.key, index }).svg)]);
  C.sweep(rows, 20, 'LIB-12 pair renders');
  for (const [id, f, h] of rows) if (RENDERS[`${id} ${f}`] !== h) bad.push(`${id} ${f}: render ${h}`);
  return bad;
}
const fileProblems = (read = (f: string) => readFileSync(f)) => C.sweep(Object.keys(FILES), 15, 'LIB-12 files').filter(f => sha(read(f)) !== FILES[f]);

describe('LIB-12-FIX X1: words per LIB-12 key (D-LIB12FIX-WORDS)', () => {
  it('the five LIB-12 keys have words files; right = rightNote, wrong = pager = the drawn label, each with a source; heading golden B\'s', async () => {
    const keys = C.sweep(lib12Keys().keys(), 5, 'LIB-12 pair keys');
    expect(keys.sort()).toEqual(['ball-contact-catch-under', 'battle-rope-rope-neutral', 'cupped-goblet-under', 'front-rack-rack-under', 'palm-flat-floor-over']);
    expect(Object.keys(PN.allWords().keys).filter(k => keys.includes(k)).sort()).toEqual(keys);
    expect(wordsProblems()).toEqual([]);
    for (const k of keys) expect((await P.pairPanel(k)).includes(HEADING)).toBe(true);
  }, 60_000);
  it('the five research pairs equal their shared cards\' labels and the words', () => {
    expect(researchProblems()).toEqual([]);
  });
  it('mutations: a missing words file, a count one short, an 11-word caption, an empty source, a wrong text off the drawing, a research label changed are each red', async () => {
    const k = 'palm-flat-floor-over', all = PN.allWords(), faults = ['cupped-palm', 'hand-ahead'], pages = faults.map(f => ({ fault: f, svg: '' }));
    const none = { chrome: all.chrome, keys: {} };
    expect(() => PN.panelHtml(k, pages, none)).toThrow(`hand panel ${k}: no words in tools/plates/library/hands/words/${k}.json`);
    expect(wordsProblems({ ...all, keys: Object.fromEntries(Object.entries(all.keys).filter(([x]) => x !== k)) })).toEqual([`${k}: no words`]);
    expect(() => C.sweep(P.keysOf(), 8 + 4, 'pair keys')).toThrow('pair keys: 13, expected 12');
    const long = structuredClone(all); long.keys[k].faults['hand-ahead'].wrong.text = 'Hand ahead of the shoulder line with weight on the fingers';
    expect(() => PN.panelHtml(k, pages, { chrome: long.chrome, keys: { [k]: long.keys[k] } })).toThrow(/hand-ahead.wrong has 11 words \(max 10\)/);
    const noSrc = structuredClone(all); noSrc.keys[k].faults['cupped-palm'].right.source = '';
    expect(() => PN.panelHtml(k, pages, { chrome: noSrc.chrome, keys: { [k]: noSrc.keys[k] } })).toThrow(/cupped-palm.right has no approved text and source/);
    expect(wordsProblems(noSrc)).toEqual([`${k} cupped-palm: right without a source`]);
    const off = structuredClone(all); off.keys[k].faults['hand-ahead'].wrong.text = 'Hands forward';
    expect(wordsProblems(off)).toEqual([`${k} hand-ahead: wrong "Hands forward", drawn "Hand ahead"`]);
    expect(researchProblems(undefined, off)).toEqual([`${k} hand-ahead: wrong "Hands forward", research "Hand ahead"`]);
    const read = (f: string) => readFileSync(`docs/research/howto/shared/${f}.json`, 'utf8').replace('"label": "Bar on hands"', '"label": "Bar in hands"');
    expect(researchProblems(read)).toEqual(['front-rack-exemption bar-off-shoulders: research label "Bar in hands", expected "Bar on hands"',
      'front-rack-rack-under bar-off-shoulders: wrong "Bar on hands", research "Bar in hands"']);
  }, 60_000);
});

describe('LIB-12-FIX X3: LIB-12\'s pictures carry (D-LIB12FIX-CARRY)', () => {
  it('the 20 renders equal 0d268a71\'s, combined by M1\'s method; the 15 files are byte-identical', () => {
    expect(renderProblems()).toEqual([]);
    const rows = Object.entries(RENDERS).map(([k, h]) => [...k.split(' '), h]).sort((a, b) => a[0]! < b[0]! ? -1 : a[0]! > b[0]! ? 1 : a[1]! < b[1]! ? -1 : a[1]! > b[1]! ? 1 : 0);
    expect(sha(rows.map(r => r[2]).join('\n'))).toBe(COMBINED);
    expect(fileProblems()).toEqual([]);
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
    expect(n).toBe(6);
  }, 60_000);
  it('mutations: front-rack Right barLiftMm + 15, palm-flat at orientation under, one view file\'s bytes changed are each red', () => {
    const lift = clone(), fr = lift.find((m: any) => m.KEY === 'front-rack');
    for (const V of Object.values<any>(fr.VARIANTS)) V.right.barLiftMm += 15;
    expect(renderProblems(P.indexOf(lift))).toEqual(['front_squat bar-off-shoulders: render ' + sha(P.renderPair('front_squat', { fault: 'bar-off-shoulders', index: P.indexOf(lift) }).svg)]);
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
