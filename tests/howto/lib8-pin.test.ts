// LIB-8M (pilot A merge): the 14 copied cards are research's bytes (A6), the registry rebuilds the pilot A page (A10),
// and the rows, pages and held ids are as ruled (A11; D-LIB8M-PAGES, -PAGESET, -NOSTRIP).
// Run: npx vitest run tests/howto/lib8-pin.test.ts
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (p: string) => readFileSync(ROOT + p, 'utf8');
const url = (p: string) => new URL('../../' + p, import.meta.url).href;

// git blob ids at claude/libht-research f57e7944ebb366a71f812146287ff0c4a6d2edef (<RESEARCH_HEAD>): [card, quotes];
// barbell_row's and romanian_deadlift's cards at 2dd60ae0 (F-LB3-1, R-LB3-11: one risks[breath] line each)
const BLOBS: Record<string, [string, string]> = {
  dumbbell_bench_press: ['0909c439a381bd3e4f811c73e5ca2b86a4f3a3d6', '10e7af71570695df876660d7ae5c1a9939e87999'],
  incline_dumbbell_press: ['8a98fb1a4cf12e1ac629565fe13632e5aa9f09d6', 'dcfab01e746a8742569e4b6f17a79482b5600f83'],
  dumbbell_shoulder_press: ['a147b41c3b1a94308d0f30f63b5121778a4ddcf7', '34902cba78c352df7fb58b180cb4a153e394a9e8'],
  barbell_overhead_press: ['58bae6ec014446e79f09e8aa3840c669c1224788', 'f5a6a8578119f24165fc636c09b7e2e4e7cd9af0'],
  barbell_row: ['dc61ba764ea04eb61be857317a6e49b5fd6d658e', '39b3664967f02e85e60a43603fc67ee12d99003a'],
  romanian_deadlift: ['15184699e9ff3b3e6f4cfedbc8d77b5ada25bfb8', '6e4aa71f63047f761ca38f52c66dd9420c3c2f94'],
  single_leg_romanian_deadlift: ['9874cb3beb8dfa75f139289a97082d4d14ed286e', '3882c497e30a3ff07de49e0783d07b012148c782'],
  dumbbell_biceps_curl: ['bbd133c23072327b8785b403ab4b9615bd3dfc1b', '09285b1e34edf488db2b179d28a7439a08f8c64d'],
  upright_row: ['706dee0d1df5cfcecb6bcd8d6e47528a4c826149', '58a0afecd8f77548e7507c373de37e8d9f18c822'],
  triceps_pushdown: ['af1ae69e480bdf93dbda01ba79bf834543381077', 'fe1b1fb826f7c9fe50bf67b9f5a86c2611008caf'],
  rope_triceps_pushdown: ['dbdf966aebcc76d914c195c2dbf83a5199c63fad', '6ab0c376511bcabd58f2bfefab98e61dbc7f149c'],
  pec_fly: ['28f6c1b5e44870a53da965862a95c8c45b801da8', '6a05573d57ba3c9d1e5956b88c17fe4487d95fc1'],
  // plank and mountain_climbers at f574bb4b (D-LIB8M-ROUTED, -PLANKREDRAW: the routed lines, #109 6381942908)
  plank: ['374a9bc2e187cd3252496f2fddb4ae90ac7e6f5b', '357caedd59542babe3468a58c79cadb95e9ab5c2'],
  mountain_climbers: ['18e56b6267184f27b81d9dcbabdb679c7d3d769d', 'f39f0312406a171f15e0d85e5190717e5727e8b7'],
};
// incline_dumbbell_press is held after its last critic run (D-LIB8M-CARDTRUE, lib4-cards 21.6): its card copy and keys stay as verified
const CARDS = Object.keys(BLOBS);
const PINNED = CARDS.filter(id => id !== 'incline_dumbbell_press');
const HELD = ['barbell_shrug', 'dumbbell_fly', 'bent_over_dumbbell_rear_delt_fly', 'box_jump', 'reverse_lunge', 'incline_dumbbell_press'];
// census views (claude/howto-options 4a9fd86, docs/howto/library/inputs/census.json blob 70553d5d)
const VIEW: Record<string, string> = Object.fromEntries(PINNED.map(id => [id, id === 'upright_row' || id === 'pec_fly' ? 'front' : 'side']));
// the pilot A page the registry builds (build.mjs's page at the Do 6 head); the pin's page entry must equal it
const PAGE = { sha256: '43a264e5a4a9f5d9bb1069684c65a7dda51ceaddc4023daed6114d24156f26c6', bytes: 1325713 };
const blobId = (buf: Buffer) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
// Do 7 inserts the three card keys as one block before the final brace; A6 takes it out again
const withoutKeys = (text: string) => { const i = text.lastIndexOf(',\n  "plateFacts": '); return i < 0 ? text : `${text.slice(0, i)}\n}${text.slice(text.lastIndexOf('\n}') + 2)}`; };

describe('LIB-8M A6: the 14 copied cards and quotes are the research bytes', () => {
  it.each(CARDS)('%s', id => {
    expect(blobId(Buffer.from(withoutKeys(read(`docs/research/howto/cards/${id}.json`))))).toBe(BLOBS[id]![0]);
    expect(blobId(readFileSync(`${ROOT}docs/research/howto/quotes/${id}.json`))).toBe(BLOBS[id]![1]);
  });
  it("barbell_overhead_press's first handling mistake is the elbows-back fault (c5)", () => {
    expect(JSON.parse(read('docs/research/howto/cards/barbell_overhead_press.json')).handlingMistakes[0].claim).toBe('c5');
  });
});

// the ruled topFault per id (PILOT A TOPFAULT #109 6258287101, ruled 6258289883, D-LIB8M-TF1)
const TOPFAULT: Record<string, string> = {
  incline_dumbbell_press: 'arch', dumbbell_shoulder_press: 'behind', barbell_overhead_press: 'elbows', barbell_row: 'swing',
  romanian_deadlift: 'round', single_leg_romanian_deadlift: 'round', mountain_climbers: 'hike', dumbbell_bench_press: 'arch',
  dumbbell_biceps_curl: 'wrist-bend',   // drawable false: the bent wrist (c6), not the drawn 'elbows' (D-LIB8M-TF1 4)
  triceps_pushdown: 'lean', rope_triceps_pushdown: 'lean', upright_row: 'chin', pec_fly: 'short', plank: 'hike',   // 6259314475; plank 'hike' (D-LIB8M-PLANKREDRAW)
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const builtTempo = (rows: any[], t: any) => rows.filter(r => !(r.from === 'pause' && !(t.pause > 0)))
  .map(r => { const s = 'constant' in r ? r.constant : t[r.from]; return r.move ? { phase: r.phase, s, move: true } : { phase: r.phase, s }; });

describe('LIB-8M A7: card keys and the tempo map', () => {
  it('every copied card has a ruled topFault', () => { expect(Object.keys(TOPFAULT).sort()).toEqual([...CARDS].sort()); });
  const map = JSON.parse(read('tools/plates/library/pilot-a/tempo.json')).rows;
  it('tempo.json has one row list per copied card; every constant has a claim and a verbatim quote of that claim', () => {
    expect(Object.keys(map).sort()).toEqual([...CARDS].sort());
    for (const id of CARDS) for (const r of map[id]) {
      expect('from' in r !== 'constant' in r, `${id} ${r.phase}: exactly one of from/constant`).toBe(true);
      if ('from' in r) expect(['up', 'down', 'pause']).toContain(r.from);
      else {
        const claim = JSON.parse(read(`docs/research/howto/cards/${id}.json`)).claims.find((c: any) => c.id === r.claim);
        expect(claim?.quotes.some((q: any) => q.text === r.quote), `${id} ${r.phase}: quote of ${r.claim}`).toBe(true);
      }
    }
  });
  it.each(Object.keys(TOPFAULT))('%s: exactly the three keys, its tempo from the map, its ruled topFault', async id => {
    const text = read(`docs/research/howto/cards/${id}.json`), card = JSON.parse(text);
    expect(Object.keys(card).slice(-3)).toEqual(['plateFacts', 'tempo', 'topFault']);
    expect(Object.keys(JSON.parse(withoutKeys(text)))).toEqual(Object.keys(card).slice(0, -3));
    expect(card.tempo).toEqual(builtTempo(map[id], card.plate.tempo));
    const spec = (await import(/* @vite-ignore */ url(`tools/plates/library/specs/${id}.mjs`))).default;
    expect(JSON.stringify(card.tempo)).toBe(JSON.stringify(spec.tempo));
    expect(card.topFault).toBe(TOPFAULT[id]);
    expect(Array.isArray(card.plateFacts)).toBe(true);
    for (const f of card.plateFacts) {
      expect(f.kind).toBe('angle');
      expect('joint' in f && f.measure === true, `${id}: one form per fact`).toBe(false);
      expect(card.claims.some((c: any) => c.id === f.claim)).toBe(true);
    }
  });
});

describe('LIB-8M A11: rows, pages and held ids', () => {
  const raw = read('tools/plates/library/batches/pilot-a.json'), batch = JSON.parse(raw);
  it('batches/pilot-a.json holds exactly the 13 pinned ids, each once, mode H, census view, one stage', () => {
    for (const id of PINNED) expect(raw.split(`"lib_${id}"`).length - 1).toBe(1);
    expect(Object.keys(batch.rows).sort()).toEqual(PINNED.map(id => `lib_${id}`).sort());
    const stages = new Set(Object.values(batch.rows).map((r: any) => r.stage));
    expect(stages.size).toBe(1);
    expect(['review', 'approved-plate']).toContain([...stages][0]);
    for (const id of PINNED) expect(batch.rows[`lib_${id}`]).toMatchObject({ src: `library/specs/${id}.mjs`, chromeId: id.replace(/_/g, '-'), mode: 'H', view: VIEW[id] });
    expect(batch.censusRef).toBe('4a9fd86');
  });
  it('its pages object is the ruled three paths, and neither layers file exists', () => {
    expect(batch.pages).toEqual({ plates: 'tools/plates/library/pages/pilot-a.json', layers: 'tests/howto/golden/library/pilot-a.layers.html', layersConfig: 'tools/plates/library/pages/pilot-a.layers.json' });
    expect(existsSync(ROOT + batch.pages.layers)).toBe(false);
    expect(existsSync(ROOT + batch.pages.layersConfig)).toBe(false);
    const chain = ROOT + 'tests/howto/golden/library/pilot-a.json';
    if (existsSync(chain)) expect(JSON.parse(readFileSync(chain, 'utf8')).entries.some((e: any) => e.kind === 'layers-page')).toBe(false);
  });
  it('the six held ids appear in no batch or library golden file', () => {
    const files = [...readdirSync(ROOT + 'tools/plates/library/batches').filter(f => f.endsWith('.json')).map(f => `tools/plates/library/batches/${f}`),
      ...(existsSync(ROOT + 'tests/howto/golden/library') ? readdirSync(ROOT + 'tests/howto/golden/library').map(f => `tests/howto/golden/library/${f}`) : [])];
    for (const f of files) for (const id of HELD) expect(new RegExp(`\\b${id}\\b`).test(read(f)), `${id} in ${f}`).toBe(false);
  });
  it('the page config lists the 13 ids once each, as registry ids', () => {
    const ids = JSON.parse(read('tools/plates/library/pages/pilot-a.json')).groups.flatMap((g: any) => g.ids);
    expect([...ids].sort()).toEqual(PINNED.map(id => `lib_${id}`).sort());
  });
});

describe('LIB-8M A10: the pilot A page through the registry', () => {
  // two builds in two tests, so no single test blocks its worker for both (CI: a vitest worker RPC timeout at 013f84e)
  const build = async () => {
    const pp = await import(/* @vite-ignore */ url('tools/plates/library/plates-page.mjs'));
    const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const html = (await bp.buildPlatesPage(await pp.pageConfig('tools/plates/library/pages/pilot-a.json'))).html;
    return { sha256: g.sha256(html), bytes: html.length };
  };
  let first: { sha256: string; bytes: number } | null = null;
  it('pageConfig(pages/pilot-a.json) builds the pilot A page (and the pinned page entry, once pinned)', async () => {
    first = await build();
    expect(first).toEqual(PAGE);
    const chain = ROOT + 'tests/howto/golden/library/pilot-a.json';
    if (existsSync(chain)) {
      const page = JSON.parse(readFileSync(chain, 'utf8')).entries.filter((e: any) => e.kind === 'page').at(-1);
      expect({ sha256: page.pageSha256, bytes: page.bytes }).toEqual(PAGE);
    }
  }, 120_000);
  it('a second build gives the same bytes', async () => {
    expect(first).not.toBeNull();
    expect(await build()).toEqual(first);
  }, 120_000);
});
