// LIB-22 (lib-22-card Do 1, Do 6 a; acceptance A9, A11, A19; rulings D-LIB22-*): the LB10 H build-ahead plates. Node
// only: the browser half of the plate QA runs in tools/plates/library/lb10/qa.mjs. Patterns copied from
// tests/howto/lb7-plates.test.ts (#299 @ 5a9f004c). Every test reads what is drawn (the items a spec emits, the engine's
// landmarks, shapes and report), never a helper's own maths. This first part holds the card copies, the nothing-ships
// checks and the test manners; the drawn-item tests come with the slice.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

// D-LIB22-TESTS (lessons #299 6351689010, 6352726951): vitest runs back-to-back synchronous tests without returning to
// the event loop, so the worker cannot answer its RPC ("Timeout calling onTaskUpdate"). One macrotask after every test
// lets the worker reply; every per-spec loop yields once per spec, and whole-page renders run in a child process.
afterEach(() => new Promise<void>(r => setImmediate(r)));

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const LB10 = ['sled_push', 'sled_pull', 'farmer_s_carry', 'burpee', 'jumping_jacks', 'high_knees', 'jump_rope', 'battle_ropes',
  'medicine_ball_slam', 'wall_ball', 'bear_crawl', 'kettlebell_swing'];
// LB10's thirteenth row: pilot A's plate (pA), never in an LB10 file.
const NOT_HERE = ['mountain_climbers'];
// D-LIB22-SECS: no tempo seconds on these six cards; drawn and tested, never on rows.json until the strip card.
const NOSECS = ['sled_push', 'sled_pull', 'farmer_s_carry', 'burpee', 'medicine_ball_slam', 'wall_ball'];
const RESEARCH_HEAD = '596dbe0748f11d13b431ee11d38d1742771925f1';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

describe('LIB-22 A11 (Do 6 a): the 12 cards and quotes are byte copies of the LB10 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb10/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 12 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB10);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB10);
    for (const id of LB10) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('kettlebell_swing'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.kettlebell_swing);
  });
  it('mountain_climbers (pilot A\'s plate) is not copied here', () => {
    expect(Object.keys(cardsSha.cards)).not.toContain('mountain_climbers');
  });
  it('research/validate.mjs validateCardFile: no problem on the 12 research copies before the card keys (Do 6 b)', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    for (const id of LB10) {
      const c = cardOf(id);
      if (!('plateFacts' in c)) expect(v.validateCardFile(`${id}.json`), id).toEqual([]);
    }
  });
  it('A11 mutation: a tempo key added to a NOSECS card without plateFacts is red in validateCardFile', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    const dir = mkdtempSync(join(tmpdir(), 'lb10-val-'));
    try {
      for (const d of ['cards', 'quotes']) cpSync(`docs/research/howto/${d}`, join(dir, 'docs/research/howto', d), { recursive: true });
      const p = join(dir, 'docs/research/howto/cards/sled_push.json'), c = JSON.parse(readFileSync(p, 'utf8'));
      c.tempo = [{ phase: 'Push', s: 1, move: true }]; writeFileSync(p, JSON.stringify(c, null, 2));
      expect(v.validateCardFile('sled_push.json', dir)).toContain('cards/sled_push.json: plateFacts and tempo go in together or not at all');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-22 A7 (proposed, D-LIB22-SECS, -TEMPO): lb10/tempo.json', () => {
  const t = readJson('tools/plates/library/lb10/tempo.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  /** Every quote of a claim (the card's claims and its quotes file). */
  const quotesOf = (id: string, claim: string) => [
    ...cardOf(id).claims.filter((c: any) => c.id === claim).flatMap((c: any) => c.quotes.map((q: any) => q.text)),
    ...readJson(`docs/research/howto/quotes/${id}.json`).quotes.filter((q: any) => q.claim === claim).map((q: any) => q.text),
  ];
  /** The phase array a tempo.json row gives with the card's plate.tempo: from up/down/pause, or a quoted constant. */
  const build = (id: string, rows = t.rows[id]) => rows.map((r: any) => ({ phase: r.phase, s: r.from ? cardOf(id).plate.tempo[r.from] : r.constant, ...(r.move ? { move: true } : {}) }));
  const problems = (tt: any) => Object.entries<any>(tt.rows).flatMap(([id, rows]) => rows.flatMap((r: any) => {
    const out: string[] = [];
    if (r.from && !(typeof cardOf(id).plate.tempo[r.from] === 'number' && cardOf(id).plate.tempo[r.from] > 0)) out.push(`${id} ${r.phase}: card ${r.from} is not a positive number`);
    if ('constant' in r) {
      if (!quotesOf(id, r.claim).includes(r.quote)) out.push(`${id} ${r.phase}: quote not verbatim on ${r.claim}`);
      const s = String(r.constant), n = s.split('–'), unit = r.phase === 'Rest' && /1 minute/.test(r.quote) ? ['60'] : [];
      if (!n.every(x => new RegExp(`\\b${x}\\b`).test(r.quote) || unit.includes(x))) out.push(`${id} ${r.phase}: ${s} not stated by the quote`);
    }
    return out;
  }));
  it('no row for a NOSECS id; kettlebell_swing is Drive (up) then Swing down (down), no Hold (pause 0), no Rest', () => {
    for (const id of NOSECS) expect(t.rows[id], id).toBeUndefined();
    expect(build('kettlebell_swing')).toEqual([{ phase: 'Drive', s: 1, move: true }, { phase: 'Swing down', s: 1, move: true }]);
    expect(cardOf('kettlebell_swing').plate.tempo.pause).toBe(0);
  });
  it('every constant is stated by its claim\'s verbatim quote, and every from-row reads a positive card number', () => {
    expect(problems(t)).toEqual([]);
  });
  it('mutations: a Hold added to kettlebell_swing, a Work constant changed, a constant added to farmer_s_carry are red', () => {
    const hold = structuredClone(t); hold.rows.kettlebell_swing.splice(1, 0, { phase: 'Hold', from: 'pause' });
    expect(problems(hold)).toEqual(['kettlebell_swing Hold: card pause is not a positive number']);
    const work = structuredClone(t); work.rows.high_knees[0].constant = 15;
    expect(problems(work)).toEqual(['high_knees Work: 15 not stated by the quote']);
    const farm = structuredClone(t); farm.rows.farmer_s_carry = [{ phase: 'Work', constant: 30, move: true, claim: 'c8', quote: 'Start walking in a straight line, taking short, deliberate steps.' }];
    expect(problems(farm)).toEqual(['farmer_s_carry Work: 30 not stated by the quote']);
  });
});

describe('LIB-22 A9 (D-LIB22-AHEAD): nothing ships', () => {
  const slug = (id: string) => id.replace(/_/g, '-');
  /** Whole-token matchers for an id: `\b(lib_)?<id>\b` and the hyphen slug bounded by non [a-z0-9-] characters. */
  const matchers = (id: string) => [new RegExp(`\\b(lib_)?${id}\\b`), new RegExp(`(^|[^a-z0-9-])${slug(id)}([^a-z0-9-]|$)`)];
  const names = (text: string) => LB10.filter(id => matchers(id).some(m => m.test(text)));
  const filesUnder = (d: string): string[] => (existsSync(d) ? readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? filesUnder(join(d, e.name)) : [join(d, e.name)])) : []);
  const offenders = (dir: string) => filesUnder(dir).flatMap(f => {
    const text = readFileSync(f, 'utf8');
    return [...names(text).map(id => `${f}: ${id}`), ...(/lb10/i.test(f.slice(dir.length)) ? [`${f}: file name`] : []), ...(/"batch":\s*"LB10"/.test(text) ? [`${f}: batch LB10`] : [])];
  });
  it('no LB10 H id, slug or batch is in any tools/plates/library/batches/ file or in tests/howto/golden/library/', () => {
    expect(offenders('tools/plates/library/batches')).toEqual([]);
    expect(offenders('tests/howto/golden/library')).toEqual([]);
  });
  it('the matcher is exact: over src/data/exercises.json no other real id contains one of the 12; it matches neither lib_kettlebell_swing_v2 nor single-arm-kettlebell-swing', () => {
    const ex = readJson('src/data/exercises.json') as any[];
    for (const e of ex) for (const id of LB10) if (e.id !== `lib_${id}`) expect(matchers(id).some(m => m.test(String(e.id))), `${e.id} ~ ${id}`).toBe(false);
    expect(names('lib_kettlebell_swing_v2')).toEqual([]);
    expect(names('single-arm-kettlebell-swing')).toEqual([]);
    expect(names('lib_kettlebell_swing')).toEqual(['kettlebell_swing']);
  });
  it('mutation: a plain substring matcher is red on the _v2 control', () => {
    const plain = (text: string) => LB10.filter(id => text.includes(id));
    expect(plain('lib_kettlebell_swing_v2')).not.toEqual([]);
  });
  it('control: a file naming only lib_mountain_climbers (LB10, not in this card) and lib_bird_dog (LB9) stays green', () => {
    expect(names('lib_mountain_climbers lib_bird_dog mountain-climbers bird-dog')).toEqual([]);
    expect(NOT_HERE.every(id => !LB10.includes(id))).toBe(true);
  });
  it('mutations: a golden file naming an LB10 H id, a page-only lb10.json and a kettlebell-swing.layers.html are red', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lb10-a9-'));
    try {
      writeFileSync(join(dir, 'g.json'), '{"id":"lib_jump_rope"}');
      writeFileSync(join(dir, 'lb10.json'), '{"entries":[{"kind":"page","batch":"LB10"}]}');
      writeFileSync(join(dir, 'kettlebell-swing.layers.html'), '<div data-id="kettlebell-swing"></div>');
      expect(offenders(dir).map(s => s.replace(`${dir}/`, '')).sort()).toEqual(['g.json: jump_rope', 'kettlebell-swing.layers.html: kettlebell_swing', 'lb10.json: batch LB10', 'lb10.json: file name'].sort());
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-22 A19 (D-LIB22-TESTS): test manners', () => {
  const src = readFileSync(new URL(import.meta.url), 'utf8');
  it('the file registers an afterEach that awaits one macrotask (setImmediate)', () => {
    expect(src).toMatch(/\nafterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/);
  });
  it('mutation: the source without the afterEach is red', () => {
    const cut = src.replace('\nafterEach(() => new Promise<void>(r => setImmediate(r)));', '');
    expect(/\nafterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/.test(cut)).toBe(false);
  });
});
