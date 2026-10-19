// LIB-13 (lib-13-card Do 2 a, Do 4, Do 6; acceptance A2, A3, A5, A9, A11; rulings D-LIB13-* and lib4-cards 12-24): the
// LB3 build-ahead plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb3/qa.mjs.
// Every test reads what is drawn (the items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB3 = ['pendlay_row', 't_bar_row', 'landmine_row', 'one_arm_dumbbell_row', 'dumbbell_romanian_deadlift', 'conventional_deadlift',
  'sumo_deadlift', 'back_extension'];
const IDS = LB3.map(i => `lib_${i}`);
const REUSED = ['barbell_row', 'romanian_deadlift', 'single_leg_romanian_deadlift', 'upright_row'];
const SHRUGS = ['dumbbell_shrug', 'cable_shrug', 'barbell_shrug'];
const ROWS = 'tools/plates/library/lb3/rows.json';
const RESEARCH_HEAD = '2dd60ae0349b06a4aac88a11347edac5536f8424';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

let reg: any;
beforeAll(async () => {
  reg = await import(/* @vite-ignore */ lib('registry.mjs'));
}, T);

/** The LB3 ids whose spec file exists (drawn), in LB3 order. */
const drawn = () => LB3.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));

describe('LIB-13 A5: lb3/rows.json holds exactly the drawn, non-held LB3 ids', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn id exactly once in the raw text, nothing else; no reused id or shrug in any LB3 file', () => {
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
    for (const f of readdirSync('tools/plates/library/lb3')) {
      const text = readFileSync(join('tools/plates/library/lb3', f), 'utf8');
      for (const id of [...REUSED, ...SHRUGS]) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id} as a row`).toBe(false);
    }
    for (const id of SHRUGS) expect(new RegExp(`\\b(lib_)?${id}\\b`).test(readFileSync(ROWS, 'utf8')), id).toBe(false);
  });
  it('mutations: a dropped row, a duplicated row, a reused id added and a held id added are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const j = { batch: 'LB3', rows: { lib_landmine_row: row, lib_conventional_deadlift: row } }, w = ['lib_landmine_row', 'lib_conventional_deadlift'];
    const text = JSON.stringify(j, null, 1);
    expect(a5(text, w)).toEqual([]);
    const drop = { ...j, rows: { lib_landmine_row: row } };
    expect(a5(JSON.stringify(drop, null, 1), w)).toEqual(['lib_conventional_deadlift x0']);
    const dup = text.replace('  "lib_landmine_row": {', `  "lib_landmine_row": ${JSON.stringify(row)},\n  "lib_landmine_row": {`);
    expect(a5(dup, w)).toEqual(['lib_landmine_row x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_barbell_row: row } }, null, 1), w)).toEqual(['extra lib_barbell_row']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_dumbbell_shrug: row } }, null, 1), w)).toEqual(['extra lib_dumbbell_shrug']);
  });
  it('every row points at its own spec file and carries the census view; batch LB3, censusRef 4a9fd86; all H (DESIGN.md section 1)', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB3', censusRef: '4a9fd86' });
    expect(existsSync('tools/plates/library/templates')).toBe(false);   // HROW and HINGE are not built (DESIGN.md 1)
  });
});

describe('LIB-13 A9: nothing ships (D-LIB13-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/landmine_row.mjs', slug: 'landmine-row', prefix: 'landmine-row', chromeId: 'landmine-row', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB3 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = { ...readJson(ROWS).rows, lib_landmine_row: someRow };
    expect(stageProblems({ ...rows, lib_landmine_row: { ...someRow, stage: 'shipped' } })).toEqual(['lib_landmine_row: shipped']);
    expect(stageProblems({ ...rows, lib_landmine_row: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_landmine_row: approved-plate']);
  });
  it('no LB3 drawn id or shrug is shipped, even with lb3/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => [...IDS, ...SHRUGS.map(s => `lib_${s}`)].includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text. */
  const tokenHits = (ids: string[], name: string, text: string) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  // Before pilot A is on main, the 4 reused ids are in no batches/ or golden file either; once it is, they sit in pilot
  // A's batch file only (B1 of LIB-10's critic, carried).
  const pilotAOnMain = () => readdirSync('tools/plates/library/batches').some(n => /pilot/i.test(n));
  const watched = () => [...LB3, ...SHRUGS, ...(pilotAOnMain() ? [] : REUSED)];
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => [
    ...(/lb3/i.test(f) ? [`${f}: an LB3 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB3"/.test(text) ? [`${f}: names batch LB3`] : []),
    ...tokenHits(watched(), f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB3 id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB3 id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB3 id, a page-only lb3.json, back-extension.layers.html and lib_upright_row in batches/ before pilot A are red', () => {
    const rowsText = JSON.stringify({ batch: 'LB3', rows: { lib_landmine_row: someRow } }, null, 1);
    expect(batchProblems([['zz.json', rowsText]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_conventional_deadlift"}']])).toEqual(['x.json: conventional_deadlift']);
    expect(batchProblems([['lb3.json', '{"entries":[{"kind":"page","batch":"LB3"}]}']]).length).toBe(2);
    expect(batchProblems([['back-extension.layers.html', '<div data-id="back-extension"></div>']])).toEqual(['back-extension.layers.html: back-extension']);
    if (!pilotAOnMain()) expect(batchProblems([['p.json', '{"rows":{"lib_upright_row":{}}}']])).toEqual(['p.json: upright_row']);
  });
  it('controls: a file naming only lib_romanian_deadlift and lib_single_leg_romanian_deadlift stays green against the 8 drawn ids', () => {
    const scan = (text: string) => tokenHits(LB3, 'p.json', text);
    expect(scan('{"rows":{"lib_romanian_deadlift":{},"lib_single_leg_romanian_deadlift":{}}}')).toEqual([]);
    expect(scan('{"rows":{"lib_dumbbell_romanian_deadlift":{}}}')).toEqual(['p.json: dumbbell_romanian_deadlift']);
  });
  it('over exercises.json, no real id other than lib_<id> contains any of the 8 drawn ids', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('once pilot A is on main, each reused id has exactly one registry row, in pilot A\'s batch file, and no lb3/ file names it', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    for (const id of REUSED) {
      const hits = rows.filter((r: any) => r.id === `lib_${id}`);
      if (pilotAOnMain()) { expect(hits.length, id).toBe(1); expect(hits[0].batchFile, id).toMatch(/pilot/i); } else expect(hits, id).toEqual([]);
    }
    for (const f of readdirSync('tools/plates/library/lb3').filter(n => n.endsWith('.json'))) for (const id of REUSED)
      expect(new RegExp(`"(lib_)?${id}"`).test(readFileSync(join('tools/plates/library/lb3', f), 'utf8')), `${f}: ${id}`).toBe(false);
  });
  it('no LB3 spec, composer, How-to or test imports anything under hands/', () => {
    const files = [...drawn().map(i => `tools/plates/library/specs/${i}.mjs`), ...['landmine', 'romanChair'].map(c => `tools/plates/library/eq/${c}.mjs`).filter(f => existsSync(f)),
      ...LB3.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb3/build.mjs', 'tools/plates/library/lb3/qa.mjs', 'tests/howto/lb3-plates.test.ts'];
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/from\s+['"][^'"]*\/hands\/|import\(\s*[^)]*\/hands\//);
  });
  it('generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const t0 = Date.now(), out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    console.log(`LIB-13 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb3\/|landmine\.mjs|romanChair/);
      for (const id of LB3) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});

describe('LIB-13 A11 (Do 6 a): the 8 cards and quotes are byte copies of the LB3 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb3/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 8 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB3);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB3);
    for (const id of LB3) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('landmine_row'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.landmine_row);
  });
  it('the How-to source of each LB3 id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB3) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});
