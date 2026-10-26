// LIB-22 (lib-22-card Do 1, Do 6 a; acceptance A9, A11, A19; rulings D-LIB22-*): the LB10 H build-ahead plates. Node
// only: the browser half of the plate QA runs in tools/plates/library/lb10/qa.mjs. Patterns copied from
// tests/howto/lb7-plates.test.ts (#299 @ 5a9f004c). Every test reads what is drawn (the items a spec emits, the engine's
// landmarks, shapes and report), never a helper's own maths. Whole-page renders and generate run in an awaited child
// process (VITEST-RPC ruling A), and every loop over the specs yields one macrotask per spec (D-LIB22-TESTS).
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

// D-LIB22-TESTS (lessons #299 6351689010, 6352726951): vitest runs back-to-back synchronous tests without returning to
// the event loop, so the worker cannot answer its RPC ("Timeout calling onTaskUpdate"). One macrotask after every test
// lets the worker reply; every per-spec loop yields once per spec, and whole-page renders run in a child process.
afterEach(() => new Promise<void>(r => setImmediate(r)));
// A19: the worker's longest event-loop block over the whole file, logged for the bulk post (#305 6356763967 item 12).
const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();
afterAll(() => { loopDelay.disable(); console.log(`LIB-22 A19 event-loop: max block ${(loopDelay.max / 1e6).toFixed(0)} ms, p99 ${(loopDelay.percentile(99) / 1e6).toFixed(0)} ms`); });

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const LB10 = ['sled_push', 'sled_pull', 'farmer_s_carry', 'burpee', 'jumping_jacks', 'high_knees', 'jump_rope', 'battle_ropes',
  'medicine_ball_slam', 'wall_ball', 'bear_crawl', 'kettlebell_swing'];
// LB10's thirteenth row: pilot A's plate (pA), never in an LB10 file.
const NOT_HERE = ['mountain_climbers'];
// D-LIB22-SECS: no tempo seconds on six cards. 'LIB-22 resume' lifts the three with a strip/rows.json card row (STRIP;
// D-STRIP-NOTSCOPE, F-STRIP-2) and the two released to its fallbackA, every phase blank (AFALL; D-LIB22-AFALL,
// D-LIB22-STRIPROWS); wall_ball (strip leftOut, S3) stays NOSECS: drawn and tested, never on rows.json.
const STRIP = ['sled_pull', 'farmer_s_carry', 'burpee'];
const AFALL = ['sled_push', 'medicine_ball_slam'];
const NOSECS = ['wall_ball'];
/** A tempo.json row as its card and spec phase: timed from the card's plate.tempo (`from`) or a quoted constant; an
 *  untimed row (D-STRIP-B, -ROWS) as strip tempoOf builds it, { phase, move?, word? }. */
const phaseOf = (plateTempo: any, r: any) => ('from' in r || 'constant' in r
  ? { phase: r.phase, s: r.from ? plateTempo[r.from] : r.constant, ...(r.move ? { move: true } : {}) }
  : { phase: r.phase, ...(r.move ? { move: true } : {}), ...('word' in r ? { word: r.word } : {}) });
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
  /** A11 after Do 6 b: no problem for a card with plateFacts and tempo (or with no keys: wall_ball, D-LIB22-WALL);
   *  exactly the :216 problem for a card with one of the two (the NOSECS cards; jumping_jacks, which has no fact). */
  const PAIR = 'plateFacts and tempo go in together or not at all';
  const valProblems = (v: any, id: string, dir?: string) => {
    const got = v.validateCardFile(`${id}.json`, dir), c = dir ? JSON.parse(readFileSync(join(dir, `docs/research/howto/cards/${id}.json`), 'utf8')) : cardOf(id);
    const want = ('plateFacts' in c) === ('tempo' in c) ? [] : [`cards/${id}.json: ${PAIR}`];
    return JSON.stringify(got) === JSON.stringify(want) ? [] : [`${id}: ${JSON.stringify(got)}`];
  };
  it('research/validate.mjs validateCardFile: no problem with both keys or none; exactly the pair problem for a NOSECS card and jumping_jacks', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    for (const id of LB10) expect(valProblems(v, id), id).toEqual([]);
    for (const id of [...NOSECS.filter(i => i !== 'wall_ball'), 'jumping_jacks']) expect(v.validateCardFile(`${id}.json`), id).toEqual([`cards/${id}.json: ${PAIR}`]);
  });
  it('A11 mutations: plateFacts removed from kettlebell_swing, a bad fact claim on sled_push, and a fact added to jumping_jacks (D-LIB22-JJ) change validateCardFile', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    const dir = mkdtempSync(join(tmpdir(), 'lb10-val-'));
    try {
      for (const d of ['cards', 'quotes']) cpSync(`docs/research/howto/${d}`, join(dir, 'docs/research/howto', d), { recursive: true });
      const edit = (id: string, f: (c: any) => void) => { const p = join(dir, `docs/research/howto/cards/${id}.json`), c = JSON.parse(readFileSync(p, 'utf8')); f(c); writeFileSync(p, JSON.stringify(c, null, 2)); };
      edit('kettlebell_swing', c => { delete c.plateFacts; });
      expect(v.validateCardFile('kettlebell_swing.json', dir)).toContain(`cards/kettlebell_swing.json: ${PAIR}`);
      edit('sled_push', c => { c.plateFacts[0].claim = 'c99'; });
      expect(v.validateCardFile('sled_push.json', dir).join()).toContain('unknown claim c99');
      // D-LIB22-JJ (#305): jumping_jacks is held at the pair problem; a fact written onto it clears that problem (red here)
      edit('jumping_jacks', c => { c.plateFacts = [{ kind: 'contact', landmark: 'ball.l', pose: 'end', cardPose: 'end', claim: 'c2' }]; });
      expect(v.validateCardFile('jumping_jacks.json', dir)).not.toContain(`cards/jumping_jacks.json: ${PAIR}`);
      expect(valProblems(v, 'jumping_jacks', dir)).toEqual([]);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-22 Do 6 b: card keys (plateFacts, tempo, topFault) from the ruled maps (#305 6355155831)', () => {
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const t = readJson('tools/plates/library/lb10/tempo.json');
  // The ruled facts plan (DESIGN.md section 10; Q4): [landmark, spec pose, card pose, claim]. burpee through the pose map.
  const F = (lm: string, pose: string, claim: string, cardPose = pose) => [lm, pose, cardPose, claim];
  const both = (p: string, pose: string, claim: string, cardPose = pose) => [F(`${p}.l`, pose, claim, cardPose), F(`${p}.r`, pose, claim, cardPose)];
  const FACTS: Record<string, any[] | null> = {
    kettlebell_swing: [...both('wrist', 'start', 'c2'), F('wrist.r', 'end', 'c24')],
    medicine_ball_slam: [...both('wrist', 'start', 'c15'), ...both('toe', 'start', 'c2')],
    sled_push: [...both('wrist', 'start', 'c1'), ...both('ball', 'start', 'c8'), ...both('ball', 'end', 'c8'), ...both('wrist', 'end', 'c9')],
    jump_rope: [...both('wrist', 'start', 'c2'), ...both('ball', 'start', 'c10')],
    sled_pull: [...both('wrist', 'start', 'c1'), ...both('sole', 'start', 'c2'), F('sole.r', 'end', 'c3'), ...both('wrist', 'end', 'c4')],
    farmer_s_carry: both('wrist', 'start', 'c3'),
    burpee: both('wrist', 'start', 'c2', 'end'),
    high_knees: [...both('ball', 'start', 'c4'), F('ball.l', 'end', 'c4')],
    battle_ropes: [...both('wrist', 'start', 'c1'), ...both('sole', 'end', 'c13')],
    bear_crawl: both('wrist', 'start', 'c3'),
    jumping_jacks: null,
  };
  // The ruled fault→key map (DESIGN.md section 8; Q3): drawable-false ids carry the F7 key, never the drawn one.
  const TOP: Record<string, [string, string]> = {
    kettlebell_swing: ['lean', 'lean'], medicine_ball_slam: ['soft', 'arms'], sled_push: ['round', 'round'], jump_rope: ['high', 'high'],
    sled_pull: ['lean', 'lean'], farmer_s_carry: ['rush', 'long'], burpee: ['rush', 'landing'], high_knees: ['arch', 'arch'],
    battle_ropes: ['shrug', 'shrug'], bear_crawl: ['hips', 'hips'], jumping_jacks: ['jerky', 'toes'],
  };
  const tempoOf = (id: string) => (t.rows[id] ? t.rows[id].map((r: any) => phaseOf(cardOf(id).plate.tempo, r)) : undefined);
  const keyProblems = (id: string, c: any) => {
    const out: string[] = [], facts = FACTS[id];
    const want = facts ? facts.map(([landmark, pose, cardPose, claim]) => ({ kind: 'contact', landmark, pose, cardPose, claim })) : undefined;
    if (JSON.stringify(c.plateFacts) !== JSON.stringify(want)) out.push(`${id}: plateFacts ${JSON.stringify(c.plateFacts)}`);
    if (JSON.stringify(c.tempo) !== JSON.stringify(tempoOf(id))) out.push(`${id}: tempo ${JSON.stringify(c.tempo)}`);
    if (c.topFault !== TOP[id]![0]) out.push(`${id}: topFault ${c.topFault}`);
    if (NOSECS.includes(id) && 'tempo' in c) out.push(`${id}: NOSECS with tempo`);
    const known = new Set(c.claims.map((x: any) => x.id));
    for (const f of c.plateFacts ?? []) if (!known.has(f.claim)) out.push(`${id}: fact claim ${f.claim} unknown`);
    return out;
  };
  it('the 11 cards carry the ruled facts, tempo and topFault; wall_ball carries none (D-LIB22-WALL)', () => {
    for (const id of Object.keys(TOP)) expect(keyProblems(id, cardOf(id)), id).toEqual([]);
    const w = cardOf('wall_ball'); for (const k of ['plateFacts', 'tempo', 'topFault']) expect(k in w, k).toBe(false);
  });
  it('each fact\'s pose is the pose map\'s image of its card pose: identity for 10, burpee start ↔ plate.end', () => {
    for (const id of Object.keys(TOP)) for (const f of cardOf(id).plateFacts ?? []) {
      const mapped = t.poseMap[id] ? (t.poseMap[id][f.pose] === `plate.${f.cardPose}`) : f.pose === f.cardPose;
      expect(mapped, `${id} ${f.landmark}`).toBe(true);
    }
  });
  it('drawable-true: topFault is the drawn spec\'s first tell key; drawable-false: it differs from it (F7 stays raised)', () => {
    for (const id of specsDrawn()) {
      const [top, drawn] = TOP[id]!, first = S[id].mistake.tells[0].key;
      expect(first, id).toBe(drawn);
      expect(top === first, id).toBe(top === drawn);
    }
  });
  it('every fact on a drawn spec has a rendered check in its pose within qa/node.mjs LIMITS.cm (H6\'s own rule)', async () => {
    for (const id of specsDrawn()) {
      const rep = plate.renderPlate(S[id], { id: 'x' }).report;
      for (const f of cardOf(id).plateFacts ?? []) {
        const hits = rep.checks.filter((k: any) => k.landmark === f.landmark && k.pose === f.pose && k.cm != null);
        expect(hits.length > 0 && hits.every((k: any) => k.cm <= qaNode.LIMITS.cm), `${id} ${f.landmark} ${f.pose}: ${JSON.stringify(hits)}`).toBe(true);
      }
      await yieldNow();
    }
  });
  it('mutations: a topFault set to the drawn key on medicine_ball_slam, a fact moved to the end, a tempo second changed, a Rest added to jumping_jacks are red', () => {
    const m = cardOf('medicine_ball_slam');
    expect(keyProblems('medicine_ball_slam', { ...m, topFault: 'arms' }).length).toBe(1);
    expect(keyProblems('medicine_ball_slam', { ...m, plateFacts: m.plateFacts.map((f: any, i: number) => (i ? f : { ...f, pose: 'end', cardPose: 'end' })) }).length).toBe(1);
    const k = cardOf('kettlebell_swing');
    expect(keyProblems('kettlebell_swing', { ...k, tempo: [{ ...k.tempo[0], s: 2 }, k.tempo[1]] }).length).toBe(1);
    const j = cardOf('jumping_jacks');
    expect(keyProblems('jumping_jacks', { ...j, tempo: [...j.tempo, { phase: 'Rest', s: 30 }] }).length).toBe(1);
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
  const build = (id: string, rows = t.rows[id]) => rows.map((r: any) => phaseOf(cardOf(id).plate.tempo, r));
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
  /** D-STRIP-B, -ROWS, F-STRIP-2: a lifted id's rows are strip/rows.json's card rows byte for byte (word or blank, claim,
   *  says, quote), its card's plate.tempo.text is the strip card's text, and strip's own wordProblems finds nothing. */
  const stripRows = readJson('tools/plates/library/strip/rows.json');
  const stripProblems = async (tt: any, strip = stripRows) => {
    const ts = await import(/* @vite-ignore */ lib('strip/tempo-strip.mjs'));
    return [...STRIP, ...AFALL].flatMap(id => {
      const fa = AFALL.includes(id), sc = (fa ? strip.fallbackA : strip.cards).find((c: any) => c.id === id), rows = tt.rows[id], text = cardOf(id).plate.tempo.text, out: string[] = [];
      if (!sc) return [`${id}: no strip ${fa ? 'fallbackA' : 'card'} entry`];
      if (JSON.stringify(rows) !== JSON.stringify(sc.rows)) out.push(`${id}: rows differ from strip/rows.json`);
      if (text !== sc.text) out.push(`${id}: card text differs from strip/rows.json`);
      if (!rows || rows.some((r: any) => 'from' in r || 'constant' in r)) out.push(`${id}: no rows or a timed row`);
      const w = rows ? ts.wordProblems(ts.tempoOf(rows), text, { allBlank: fa }) : [];
      if (w.length) out.push(`${id}: words ${w.join(',')}`);
      return out;
    });
  };
  it('the lifted ids (sled_pull, farmer_s_carry, burpee) carry strip/rows.json\'s rows byte for byte, each word in the card text', async () => {
    expect(await stripProblems(t)).toEqual([]);
    expect(build('sled_pull')).toEqual([{ phase: 'Walk', move: true, word: 'Quick' }]);
    expect(build('burpee')).toEqual([{ phase: 'Squat down', move: true, word: 'Controlled' }, { phase: 'Kick back', move: true }, { phase: 'Jump in', move: true }, { phase: 'Jump up', move: true }]);
  });
  it('mutations: a word changed (Quick to Slow), a says edited, a row dropped, a constant on a lifted id are red', async () => {
    const word = structuredClone(t); word.rows.sled_pull[0].word = 'Slow';
    expect(await stripProblems(word)).toEqual(['sled_pull: rows differ from strip/rows.json', 'sled_pull: words word:0']);
    const says = structuredClone(t); says.rows.farmer_s_carry[0].says = 'with more control';
    expect(await stripProblems(says)).toEqual(['farmer_s_carry: rows differ from strip/rows.json']);
    const drop = structuredClone(t); drop.rows.burpee.pop();
    expect(await stripProblems(drop)).toEqual(['burpee: rows differ from strip/rows.json']);
    const timed = structuredClone(t); timed.rows.farmer_s_carry = [{ phase: 'Walk', constant: 30, move: true, claim: 'c8', quote: 'x' }];
    expect(await stripProblems(timed)).toEqual(['farmer_s_carry: rows differ from strip/rows.json', 'farmer_s_carry: no rows or a timed row', 'farmer_s_carry: words noword']);
  });
  it('D-LIB22-AFALL: sled_push and medicine_ball_slam carry their strip fallbackA rows byte for byte, every phase blank', async () => {
    expect(build('sled_push')).toEqual([{ phase: 'Walk', move: true }]);
    expect(build('medicine_ball_slam')).toEqual([{ phase: 'Slam', move: true }]);
    for (const id of AFALL) expect(t.rows[id].every((r: any) => r.blank === true && !('word' in r)), id).toBe(true);
  });
  it('mutations (D-LIB22-STRIPROWS): a word added to a blank row, and either id moved back to strip leftOut, are red', async () => {
    const word = structuredClone(t); word.rows.sled_push[0] = { phase: 'Walk', move: true, word: 'Quick', claim: 'c10' };
    expect(await stripProblems(word)).toEqual(['sled_push: rows differ from strip/rows.json', 'sled_push: words word:0:fallback']);
    for (const id of AFALL) {
      const back = structuredClone(stripRows), e = back.fallbackA.find((c: any) => c.id === id);
      back.fallbackA = back.fallbackA.filter((c: any) => c.id !== id); back.leftOut.push({ id, lane: e.lane, why: 'moved back' });
      expect(await stripProblems(t, back), id).toEqual([`${id}: no strip fallbackA entry`]);
    }
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
  /** generate and every whole-page render run in an awaited child process: no in-worker gen.render() or page build. */
  const inWorker = (text: string) => /\n\s*(const|let)[^\n]*= await (gen|generate)\.render\(\)|await build\.buildLb10Page\(\)/.test(text.replace(/const script = `[\s\S]*?`;/g, ''));
  it('generate and the page builds run in an awaited child process; per-spec loops yield', () => {
    expect(inWorker(src)).toBe(false);
    expect(src).toMatch(/promisify\(execFile\)\(process\.execPath/);
    expect((src.match(/await yieldNow\(\)/g) ?? []).length).toBeGreaterThanOrEqual(6);
  });
  it('mutation: `generate.render()` called in the worker is red', () => {
    expect(inWorker(`${src}\n  const out = await gen.render();\n`)).toBe(true);
  });
  it('mutation: the source without the afterEach is red', () => {
    const cut = src.replace('\nafterEach(() => new Promise<void>(r => setImmediate(r)));', '');
    expect(/\nafterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/.test(cut)).toBe(false);
  });
});

// ---------------------------------------------------------------- the drawn specs (Do 2, Do 4, Do 5) ----
const T = 600_000;
const SPECS_DIR = 'tools/plates/library/specs';
const ROWS = 'tools/plates/library/lb10/rows.json';
const FRONT = ['jumping_jacks', 'jump_rope'];
// DESIGN.md section 15: the held ids (D-LIB22-SECS's NOSECS ids; farmer_s_carry's open M_STRIDE basis; jump_rope's
// Trace, short of the bar at kMax; jumping_jacks under D-LIB22-JJ until F-H6-TEMPO).
const HELD = [...NOSECS, 'farmer_s_carry', 'jump_rope', 'jumping_jacks'];   // wall_ball: no spec yet
// The ids drawn on this branch: the slice, then the bulk as each plate is integrated (BULK GO, #305 6356763967).
const DRAWN = ['kettlebell_swing', 'medicine_ball_slam', 'sled_push', 'jump_rope', 'sled_pull', 'farmer_s_carry', 'burpee', 'bear_crawl', 'high_knees', 'jumping_jacks', 'battle_ropes'];
const COMPOSERS = ['kettlebell', 'medBall', 'sled', 'jumpRope', 'battleRope'];
const yieldNow = () => new Promise<void>(r => setImmediate(r));
let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, markup: any;
const M: Record<string, any> = {}, S: Record<string, any> = {}, EQ: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, markup] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'qa/markup.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of LB10.filter(i => existsSync(`${SPECS_DIR}/${i}.mjs`))) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
  for (const c of COMPOSERS) EQ[c] = await import(/* @vite-ignore */ lib(`eq/${c}.mjs`));
}, T);
const specsDrawn = () => LB10.filter(i => existsSync(`${SPECS_DIR}/${i}.mjs`));
const drawn = () => specsDrawn().filter(id => !HELD.includes(id));
const pins = () => qaIdx.loadPins();
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
  const ctx = { pose, start: L.lm.start, mistake, body: L.body };
  const out: any[] = [];
  spec.equipment.forEach((e: any, i: number) => {
    for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
  });
  return { items: out, lm };
};
const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
/** D-LIB22-STANCE amended (#305 6357040314): each stance is the widest the engine's rigid-foot plant holds within its
 *  0.5 cm contact limit. `widen` moves every planted foot dx further out, in every pose (via and Mistake included). */
const footErr = (spec: any) => { const c = plate.renderPlate(spec, { id: 'x' }).report.contacts; return Math.max(...Object.values(c).flat().filter((x: any) => x.kind === 'foot').map((x: any) => x.errCm)); };
const widen = (spec: any, dx: number) => {
  const w = (p: any) => (p?.plant ? { ...p, plant: Object.fromEntries(Object.entries(p.plant).map(([sd, f]: any) => [sd, { ...f, at: [f.at[0] + Math.sign(f.at[0]) * dx, f.at[1], f.at[2]] }])) } : p);
  return { ...spec, poses: { start: w(spec.poses.start), via: (spec.poses.via ?? []).map(w), end: w(spec.poses.end) }, mistake: { ...spec.mistake, pose: w(spec.mistake.pose) } };
};

/** 3D solids for body-vs-body and implement-vs-body checks (#305 6356763967 items 2, 3): segments as capsules of
 *  radius RADII × H (vendor/engine/body.mjs:28), the foot a heel–toe capsule of half-width WINTER.footW·H/2. */
const H3D = 1.75;
const segDist = (a: number[], b: number[], c: number[], d: number[]) => {
  let best = Infinity;
  for (let i = 0; i <= 40; i++) {
    const p = a.map((v, k) => v + (b[k]! - v) * i / 40), cd = d.map((v, k) => v - c[k]!), cp = p.map((v, k) => v - c[k]!);
    const t = Math.max(0, Math.min(1, cd.reduce((x, v, k) => x + v * cp[k]!, 0) / cd.reduce((x, v) => x + v * v, 0)));
    best = Math.min(best, Math.hypot(...cp.map((v, k) => v - cd[k]! * t)));
  }
  return best;
};

const lmP = (pose: any) => eng.landmarksOf(pose, 1.75);
const rep = (spec: any) => plate.renderPlate(spec, { id: 'x' }).report;
const h9 = (spec: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins().envelope }, R).map((p: any) => p.key);
};
const camOf = (spec: any) => {
  const c = rep(spec).camera, side = spec.view === 'side';
  return { view: side ? 'side' : 'front', near: side ? 'r' : null, facing: 'right', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
};
const mergeDeep = (a: any, b: any): any => {
  if (b === undefined) return a;
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) { const o = { ...a }; for (const k of Object.keys(b)) o[k] = mergeDeep(a[k], b[k]); return o; }
  return b;
};
const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? mergeDeep(spec.poses.end, spec.mistake.pose) : spec.poses[pose]);
const shapesIn = (spec: any, pose: string) => {
  const b = { height: 1.75 };
  return body.bodyShapes(body.fk(body.resolve(body.normPose(fullPose(spec, pose), b), b).q, b), camOf(spec), { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
};
const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
const listOf = (spec: any, mistake: boolean) => (mistake ? spec.mistake.tells : [...(spec.measure ? [{ key: '_arc' }] : []), ...spec.callouts]);
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const d3 = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);
const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
const comOf = (lm: any) => {
  const mid = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  let m = 0; const c = [0, 0, 0];
  const seg = (w: number, p: number[]) => { m += w; for (let i = 0; i < 3; i++) c[i] = c[i]! + w * p[i]!; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
};
/** The world points of a drawn item (a `poly`'s pts, a `line`'s pts), or null for other primitives. */
const ptsOf = (it: any) => it.pts ?? null;

describe('LIB-22 A2 / Do 4: the composers and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const c of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${c}.mjs`, 'utf8');
      expect(src, c).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, c).not.toMatch(/layers\//);
    }
  });
  it('the drawn set: the slice (kettlebell_swing, medicine_ball_slam, sled_push, jump_rope) and the bulk drawn so far', () => {
    expect(specsDrawn()).toEqual(LB10.filter(i => DRAWN.includes(i)));
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', async () => {
    for (const id of specsDrawn()) {
      for (const pose of posesOf(S[id])) for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
      await yieldNow();
    }
  });
  it('the drawn specs pass PQ-H9', async () => {
    for (const id of specsDrawn()) { expect(h9(S[id]), id).toEqual([]); await yieldNow(); }
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.kettlebell_swing;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within its tolerance', async () => {
    for (const id of specsDrawn()) {
      for (const mistake of [false, true]) expect(plate.renderPlate(S[id], { id: 'x', mistake }).report.issues ?? [], `${id} ${mistake}`).toEqual([]);
      const r = rep(S[id]);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
      await yieldNow();
    }
  });
});

/** Every part that moves between the end pose and the Mistake must be a `poly`, so the Mistake view draws it: the
 *  Mistake svg's masked outline group lists one `m-eq` path per changed `poly` item (plate.mjs:209-213). */
const mistakeEqCount = (spec: any) => (plate.renderPlate(spec, { id: 'x', mistake: true }).svg.match(/<path id="x-m-eq\d+"/g) ?? []).length;
/** Static parts: the items of `part` sit at one place (±1 px) in start, end and Mistake. */
const staticProblems = (spec: any, part: string) => {
  const cam = camOf(spec), pts = (pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === part).flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).flatMap((p: any) => p.poly ?? p.line ?? []));
  const ref = pts('end'), out: string[] = [];
  for (const pose of ['start', 'mistake']) { const q = pts(pose); if (q.length !== ref.length) out.push(`${pose}: ${q.length} vs ${ref.length} points`); else if (q.some((p: number[], i: number) => Math.hypot(p[0]! - ref[i]![0]!, p[1]! - ref[i]![1]!) > 1)) out.push(`${pose}: moved`); }
  return out;
};

describe('LIB-22 A2 / A18: kettlebell_swing and `kettlebell` (tier A; the slice)', { timeout: T }, () => {
  const s = () => S.kettlebell_swing, K = () => M.kettlebell_swing;
  /** D-LIB22-HIKE3D (#305 6356835486 3a): the forearms press into the thighs at the hike (c5 "high into the groin,
   *  keeping forearms close to thighs"); the rigid thigh capsules meet near the groin, so body against body may
   *  overlap up to the measured 11.1 cm + 0.5 cm, and only forearm/upper arm against thigh. Thigh radius: ¾ proximal
   *  + ¼ distal RADII. Returns the worst overlap (m, negative = into the thigh). */
  const armThigh = (l: any) => {
    const R = body.RADII, thighR = R.thigh[1] * H3D * 0.75 + R.thigh[2] * H3D * 0.25; let worst = Infinity;
    for (const a of ['l', 'r']) for (const t of ['l', 'r']) {
      worst = Math.min(worst, segDist(l[`elbow.${a}`], l[`wrist.${a}`], l[`hip.${t}`], l[`knee.${t}`]) - R.fore[1] * H3D - thighR);
      worst = Math.min(worst, segDist(l[`shoulder.${a}`], l[`elbow.${a}`], l[`hip.${t}`], l[`knee.${t}`]) - R.upper[1] * H3D - thighR);
    }
    return worst;
  };
  it('D-LIB22-STANCE: FOOT_X 0.18 keeps every foot plant contact within 0.5 cm; mutation: 1 cm wider is red', () => {
    expect(M.kettlebell_swing.SIZES.FOOT_X).toBe(0.18);
    expect(footErr(s())).toBeLessThanOrEqual(0.5);
    expect(footErr(widen(s(), 0.01))).toBeGreaterThan(0.5);
  });
  const HIKE_CAP = -(0.111 + 0.005);
  it('D-LIB22-HIKE3D: the arm/thigh overlap stays within 11.1 + 0.5 cm in the start and both vias (body against body only)', () => {
    const vals = [lmOf(s(), 'start'), ...s().poses.via.map((v: any) => eng.landmarksOf(v, H3D))].map(armThigh);
    console.log(`LIB-22 D-LIB22-HIKE3D arm/thigh: ${vals.map(v => (v * 100).toFixed(1)).join(' / ')} cm (cap ${(HIKE_CAP * 100).toFixed(1)})`);
    for (const v of vals) expect(v).toBeGreaterThanOrEqual(HIKE_CAP);
  });
  it('mutation: the left forearm laid along the left thigh\'s axis at the start (fully inside it) is past the cap: red', () => {
    const l = lmOf(s(), 'start'), bad = { ...l };
    // the left forearm laid along the left thigh's axis (its axes meet: the whole forearm inside the thigh)
    const on = (f: number) => l['hip.l'].map((v: number, i: number) => v + (l['knee.l'][i] - v) * f);
    bad['elbow.l'] = on(0.3); bad['wrist.l'] = on(0.6);
    expect(armThigh(bad)).toBeLessThan(HIKE_CAP);
  });
  const bellPts = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === 'bell').flatMap((i: any) => i.pts);
  it('the bell moves (start, end, Mistake) and both its parts are `poly`, so the Mistake view outlines them', () => {
    const items = itemsIn(s(), 'mistake').items.filter((i: any) => i.part === 'bell');
    expect(items.map((i: any) => i.type)).toEqual(['poly', 'poly']);
    expect(mistakeEqCount(s())).toBe(2);
  });
  it('mutation: the bell drawn with `line` instead of `poly` is missing from the Mistake view (red); H9 alone passes it', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && [].concat(r).map((it: any) => (it?.part === 'bell' ? { ...it, type: 'line' } : it)); } : e)) };
    expect(mistakeEqCount(bad)).toBe(0);
    expect(h9(bad).filter((k: string) => k.startsWith('H9.type'))).toEqual([]);
  });
  it('c2: both hands on the handle side by side in every pose (the grips 9 cm apart, on the handle\'s line ±1 cm)', () => {
    for (const pose of posesOf(s())) {
      const l = lmOf(s(), pose), g = l.grips;
      expect(Math.abs(l['grip.l'][0] - l['grip.r'][0]) - 2 * K().SIZES.GRIP_X, pose).toBeLessThanOrEqual(0.01);
      expect(Math.hypot(l['grip.l'][1] - l['grip.r'][1], l['grip.l'][2] - l['grip.r'][2]), pose).toBeLessThanOrEqual(0.01);
      // the horns' top (the handle) is at the grips
      const horns = itemsIn(s(), pose).items.filter((i: any) => i.part === 'bell')[0].pts;
      expect(Math.min(...horns.map((p: number[]) => Math.hypot(p[1]! - g[1], p[2]! - g[2]))), pose).toBeLessThanOrEqual(0.02);
    }
  });
  it('mutation: one hand 2 cm off the handle at the end is red', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, shoulder: { ...e.shoulder, l: { ...e.shoulder.l, elev: e.shoulder.l.elev + 2 } } } } };
    const l = lmOf(bad, 'end');
    expect(Math.hypot(l['grip.l'][1] - l['grip.r'][1], l['grip.l'][2] - l['grip.r'][2])).toBeGreaterThan(0.01);
  });
  it('NOTE RULED 7: the drawn bell\'s mass comes from its drawn size (bellMass), about c25\'s 16 kg', () => {
    expect(K().BELL_KG).toBe(EQ.kettlebell.bellMass());
    expect(Math.abs(K().BELL_KG - 16)).toBeLessThan(0.5);
  });
  /** The body and the drawn bell's mass at its centre, inside the heel-toe base of the planted feet (c1, c17). */
  const balance = (spec: any, pose: string, bellKg = K().BELL_KG) => {
    const l = pose.startsWith('via') ? lmP(spec.poses.via[+pose.slice(3)]) : lmOf(spec, pose), c = comOf(l), b = K().bellOf(l);
    const z = (c[2]! * K().SIZES.BODY_KG + b[2] * bellKg) / (K().SIZES.BODY_KG + bellKg);
    const heel = Math.min(l['heel.l'][2], l['heel.r'][2]), toe = Math.max(l['toe.l'][2], l['toe.r'][2]);
    return { z, body: c[2], heel, toe, inside: z >= heel && z <= toe };
  };
  it('A18 balance: the body plus the drawn bell over the heel-toe base in start, both via poses, end and Mistake; numbers logged', () => {
    for (const pose of ['start', 'via0', 'via1', 'end', 'mistake']) {
      const b = balance(s(), pose);
      console.log(`LIB-22 balance kettlebell_swing ${pose}: with bell ${b.z.toFixed(3)} m, body alone ${b.body!.toFixed(3)} m (heel ${b.heel.toFixed(3)}, toe ${b.toe.toFixed(3)})`);
      expect(b.inside, pose).toBe(true);
    }
  });
  it('A18 balance mutation: the hike with the hips 25 cm further back leaves the base (red)', () => {
    const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [0, st.root.at[1], st.root.at[2] - 0.25] } } } };
    expect(balance(bad, 'start').inside).toBe(false);
  });
  /** D-LIB22-FRAME: the bell's outline points lie between the thighs in depth: each point (on the mid-plane) outside both
   *  thigh capsules (the drawn limb radius), and above the floor. */
  const thighR = (t: number) => { const [a, m, b, mm] = eng.RADII.thigh; return 1.75 * (t < mm ? a + (m - a) * Math.sin((t / mm) * Math.PI / 2) : m + (b - m) * (1 - Math.cos(((t - mm) / (1 - mm)) * Math.PI / 2))); };
  const capsule = (p: number[], a: number[], b: number[]) => { const d = b.map((v, i) => v - a[i]!), L2 = d.reduce((x, v) => x + v * v, 0), t = Math.max(0, Math.min(1, p.reduce((x, v, i) => x + (v - a[i]!) * d[i]!, 0) / L2)); return { dist: d3(p, a.map((v, i) => v + d[i]! * t)), t }; };
  const bellProblems = (pts: number[][], l: any) => pts.flatMap(p => [...['l', 'r'].flatMap(sd => { const c = capsule(p, l[`hip.${sd}`], l[`knee.${sd}`]); return c.dist < thighR(c.t) - 0.01 ? [`inside thigh.${sd} by ${((thighR(c.t) - c.dist) * 100).toFixed(1)} cm`] : []; }), ...(p[1]! < 0 ? ['below the floor'] : [])]);
  it('A18: the start bell lies between the thighs, never inside one, and clear of the floor; it is drawn z mid (between the far and the near leg)', () => {
    const l = lmOf(s(), 'start');
    expect(bellProblems(bellPts(s(), 'start'), l)).toEqual([]);
    expect(itemsIn(s(), 'start').items.filter((i: any) => i.part === 'bell').map((i: any) => i.z)).toEqual(['mid', 'mid']);
  });
  it('A18 mutation: the start bell moved 2 cm inside a thigh is red', () => {
    const l = lmOf(s(), 'start'), k = l['knee.r'], h = l['hip.r'], q = h.map((v: number, i: number) => v + (k[i] - v) * 0.5), r0 = thighR(0.5);
    // the bell's nearest point placed on the near thigh's mid axis, 2 cm inside its surface
    const pts = bellPts(s(), 'start'), near = pts.reduce((a: number[], p: number[]) => (d3(p, q) < d3(a, q) ? p : a)), shift = q.map((v: number, i: number) => v - near[i]!);
    const n = Math.hypot(...shift), moved = pts.map((p: number[]) => p.map((v, i) => v + shift[i]! * (1 - (r0 - 0.02) / n)));
    expect(bellProblems(moved, l).some(p => p.startsWith('inside thigh'))).toBe(true);
  });
  const flatProblems = (spec: any) => [['start', spec.poses.start], ...spec.poses.via.map((v: any, i: number) => [`via${i}`, v]), ['end', spec.poses.end]]
    .flatMap(([n, p]: any) => { const q = body.normPose(p, { height: 1.75 }); return q.trunk || q.neck ? [`${n}: trunk ${q.trunk}, neck ${q.neck}`] : []; });
  it('R10: the back flat (trunk 0) and the head in line (neck 0) in every right pose; the feet planted; the hiked bell high (above the knees)', () => {
    expect(flatProblems(s())).toEqual([]);
    for (const c of rep(s()).checks.filter((c: any) => /^(heel|ball)\./.test(c.landmark))) expect(c.cm, `${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
    const l = lmOf(s(), 'start');
    expect(K().bellOf(l)[1]).toBeGreaterThan(l['knee.r'][1]);
  });
  it('R10 mutation: the hike drawn with a rounded back (trunk 20) is red', () => {
    expect(flatProblems({ ...s(), poses: { ...s().poses, start: { ...s().poses.start, trunk: 20 } } })).toEqual(['start: trunk 20, neck 0']);
  });
  it('c8: at the top, ankle, knee, hip and shoulder in one plumb line (±2 cm); c9: the bell centre at the chest\'s height (±1 cm)', () => {
    const l = lmOf(s(), 'end'), z = ['ankle.r', 'knee.r', 'hip.r', 'shoulder.r'].map(k => l[k][2]);
    expect(Math.max(...z) - Math.min(...z)).toBeLessThanOrEqual(0.02);
    expect(Math.abs(K().bellOf(l)[1] - l.chest[1])).toBeLessThanOrEqual(0.01);
  });
  it('c6: the hike\'s shoulder-hip line parallel to the floor (±2 deg); knees KNEE (±1 deg), drawn bent: the knee off the hip-ankle line by 90 % of the bend\'s offset', () => {
    const l = lmOf(s(), 'start'), a = Math.atan2(Math.abs(l.shoulders[1] - l.hips[1]), Math.abs(l.shoulders[2] - l.hips[2])) * 180 / Math.PI;
    expect(a).toBeLessThanOrEqual(2);
    expect(Math.abs(180 - angle3(l['hip.r'], l['knee.r'], l['ankle.r']) - K().SIZES.KNEE)).toBeLessThanOrEqual(1);
  });
});

describe('LIB-22 A2 / A18: medicine_ball_slam and `medBall` (tier A; NOSECS; the slice)', { timeout: T }, () => {
  const s = () => S.medicine_ball_slam, B = () => EQ.medBall.MED_BALL;
  const ballOf = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === 'ball');
  const centre = (pts: number[][]) => [0, 1, 2].map(i => pts.reduce((a, p) => a + p[i]!, 0) / pts.length);

  /** D-LIB22-STANCE amended (#305 6357040314 (c)): the ball on the floor at the end and in the Mistake clears each foot and shank
   *  in 3D (D-LIB22-FRAME allows 1 cm). Returns the clearances (cm) below that limit. */
  const ballClear = (spec: any) => {
    const R = body.RADII, W = body.WINTER.footW * H3D / 2, out: string[] = [];
    for (const pose of ['end', 'mistake']) {
      const l = lmOf(spec, pose), pts = itemsIn(spec, pose).items.filter((i: any) => i.part === 'ball')[0].pts, c = [0, 1, 2].map(i => pts.reduce((a: number, p: number[]) => a + p[i]!, 0) / pts.length), r = EQ.medBall.MED_BALL.d / 2;
      for (const sd of ['l', 'r']) {
        const foot = segDist(c, c, l[`heel.${sd}`], l[`toe.${sd}`]) - W - r, shank = segDist(c, c, l[`knee.${sd}`], l[`ankle.${sd}`]) - R.shank[2] * H3D - r;
        for (const [k, v] of [['foot', foot], ['shank', shank]] as const) if (v < -0.01) out.push(`${pose} ${k}.${sd} ${(v * 100).toFixed(1)} cm`);
      }
    }
    return out;
  };
  it('3D: the ball (BALL_DZ 7 cm in front of mid-foot) clears both feet and shanks at the end and in the Mistake', () => {
    expect(ballClear(s())).toEqual([]);
  });
  it('mutation: the ball centred on mid-foot (BALL_DZ 0) sits inside the shanks: red', () => {
    const back = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && (ctx.pose === 'end' || ctx.pose === 'mistake') ? [].concat(r).map((it: any) => (it?.part === 'ball' ? { ...it, pts: it.pts.map((p: number[]) => [p[0]!, p[1]!, p[2]! - 0.07]) } : it)) : r; } : e)) };
    expect(ballClear(back).length).toBeGreaterThan(0);
  });
  it('D-LIB22-STANCE: FOOT_X 0.13 keeps every foot plant contact within 0.5 cm; mutation: 1 cm wider is red', () => {
    expect(M.medicine_ball_slam.SIZES.FOOT_X).toBe(0.13);
    expect(footErr(s())).toBeLessThanOrEqual(0.5);
    expect(footErr(widen(s(), 0.01))).toBeGreaterThan(0.5);
  });
  const ballTypeProblems = (spec: any) => ['start', 'end', 'mistake'].flatMap(pose => { const t = ballOf(spec, pose).map((i: any) => i.type); return JSON.stringify(t) === '["poly","poly"]' ? [] : [`${pose}: ${t.join(',')}`]; });
  it('the ball is a `poly` circle, never the vendor `pulley`; it moves (overhead → floor) and the Mistake view keeps it', () => {
    expect(ballTypeProblems(s())).toEqual([]);
  });
  it('mutation: the ball drawn with `pulley` while it moves is red (no `poly`: the Mistake view would drop it)', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && [].concat(r).map((it: any) => (it?.part === 'ball' ? { type: 'pulley', at: centre(it.pts), r: B().d / 2, part: 'ball' } : it)); } : e)) };
    expect(ballTypeProblems(bad).length).toBeGreaterThan(0);
  });
  const gripOnBall = (spec: any) => { const l = lmOf(spec, 'start'), c = centre(ballOf(spec, 'start')[0].pts); return ['l', 'r'].flatMap(sd => { const d = Math.abs(Math.hypot(l[`grip.${sd}`][1] - c[1]!, l[`grip.${sd}`][2] - c[2]!, l[`grip.${sd}`][0] - c[0]!) - B().d / 2); return d > 0.01 ? [`grip.${sd} ${(d * 100).toFixed(1)} cm off the ball`] : []; }); };
  it('c15: at the start both hands on the ball\'s sides (each grip on the ball\'s outline ±1 cm), the ball overhead plumb over the shoulders (±2 cm)', () => {
    const l = lmOf(s(), 'start'), c = centre(ballOf(s(), 'start')[0].pts);
    expect(gripOnBall(s())).toEqual([]);
    expect(Math.abs(c[2]! - l.shoulders[2])).toBeLessThanOrEqual(0.02);
    expect(c[1]!).toBeGreaterThan(l.head[1]);
  });
  it('mutation: one hand 2 cm off the ball at the start is red', () => {
    const st = s().poses.start, reach = { ...st.reach, l: { ...st.reach.l, at: st.reach.l.at.map((v: number, i: number) => v + (i === 0 ? 0.02 : 0)) } };
    expect(gripOnBall({ ...s(), poses: { ...s().poses, start: { ...st, reach } } }).length).toBe(1);
  });
  /** A18: the ball on (not in) the floor at the end, between the feet in depth, clear of the toes (c10) by 1 cm in 3D. */
  const endBallProblems = (pts: number[][], l: any) => {
    const low = Math.min(...pts.map(p => p[1]!)), c = centre(pts), out: string[] = [];
    if (low < -0.002) out.push(`ball ${(-low * 100).toFixed(1)} cm under the floor`);
    if (low > 0.002) out.push(`ball ${(low * 100).toFixed(1)} cm over the floor`);
    if (!(c[2]! >= Math.min(l['heel.l'][2], l['heel.r'][2]) && c[2]! <= Math.max(l['toe.l'][2], l['toe.r'][2]))) out.push('ball not between the feet');
    for (const t of ['toe.l', 'toe.r', 'ball.l', 'ball.r']) if (d3(c, l[t]) - B().d / 2 < 0.01) out.push(`ball on ${t}`);
    return out;
  };
  it('c3, c10, A18: at the end the ball rests on the floor between the feet, clear of the toes; feet flat (c5 ACE)', () => {
    expect(endBallProblems(ballOf(s(), 'end')[0].pts, lmOf(s(), 'end'))).toEqual([]);
  });
  it('A18 mutation: the ball 1 cm below the floor at the end is red', () => {
    expect(endBallProblems(ballOf(s(), 'end')[0].pts.map((p: number[]) => [p[0]!, p[1]! - 0.01, p[2]!]), lmOf(s(), 'end'))).toEqual(['ball 1.0 cm under the floor']);
  });
  it('c2: on the toes at the start (each toe on the floor ±0.5 cm, the heels up); c5 ACE: the trunk parallel to the shin at the end (±1 deg)', () => {
    const l = lmOf(s(), 'start');
    for (const sd of ['l', 'r']) { expect(Math.abs(l[`toe.${sd}`][1])).toBeLessThanOrEqual(0.005); expect(l[`heel.${sd}`][1]).toBeGreaterThan(0.1); }
    const e = lmOf(s(), 'end'), tr = Math.atan2(e.shoulders[2] - e.hips[2], e.shoulders[1] - e.hips[1]) * 180 / Math.PI, sh = Math.atan2(e['knee.r'][2] - e['ankle.r'][2], e['knee.r'][1] - e['ankle.r'][1]) * 180 / Math.PI;
    expect(Math.abs(tr - sh)).toBeLessThanOrEqual(1);
  });
  /** Balance: the body over the feet in start (the ball overhead in the hands, at the hands) and end (the ball on the floor). */
  const BALL_KG = 4.5;
  const bal = (spec: any, pose: string) => {
    const l = lmOf(spec, pose), c = comOf(l), b = centre(ballOf(spec, pose)[0].pts), carried = pose === 'start';
    const z = carried ? (c[2]! * 75 + b[2]! * BALL_KG) / (75 + BALL_KG) : c[2]!;
    // on the toes (start) the support is the forefoot (ball to toe); flat feet stand heel to toe
    return { z, heel: carried ? Math.min(l['ball.l'][2], l['ball.r'][2]) : Math.min(l['heel.l'][2], l['heel.r'][2]), toe: Math.max(l['toe.l'][2], l['toe.r'][2]) };
  };
  it('A18 balance: the body (with the ball overhead at the start) over the heel-toe base in start, end and Mistake; numbers logged', () => {
    for (const pose of ['start', 'end', 'mistake']) {
      const b = bal(s(), pose);
      console.log(`LIB-22 balance medicine_ball_slam ${pose}: ${b.z.toFixed(3)} m (heel ${b.heel.toFixed(3)}, toe ${b.toe.toFixed(3)})`);
      expect(b.z >= b.heel && b.z <= b.toe, pose).toBe(true);
    }
  });
  it('A18 balance mutation: the start with the hips back over the ankles (the previous 4 cm) leaves the forefoot (red)', () => {
    const st = s().poses.start, z0 = st.root.at[2], bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [0, st.root.at[1], z0 - M.medicine_ball_slam.START_Z + 0.04] } } } };
    const b = bal(bad, 'start');
    expect(b.z >= b.heel && b.z <= b.toe).toBe(false);
  });
  it('R10: no lean back overhead (c2: the shoulders not behind the hips at the start); the back flat at the end (trunk 0); a soft ball (no bounce marks: two parts only)', () => {
    const l = lmOf(s(), 'start');
    expect(l.shoulders[2] - l.hips[2]).toBeGreaterThanOrEqual(-0.01);
    expect(body.normPose(s().poses.end, { height: 1.75 }).trunk).toBe(0);
    expect(ballOf(s(), 'end').length).toBe(2);
  });
  it('R10 mutation: the start leaning back 10 deg is red', () => {
    const st = s().poses.start, l = lmP({ ...st, root: { ...st.root, tilt: -10 } });
    expect(l.shoulders[2] - l.hips[2]).toBeLessThan(-0.01);
  });
  it('c4 Mistake: the knees straight and the hips near upright (hips and knees not bent), the ball on the floor as at the end', () => {
    const q = body.resolve(body.normPose(fullPose(s(), 'mistake'), { height: 1.75 }), { height: 1.75 }).q;
    expect(q.knee.r).toBeLessThanOrEqual(2);
    expect(staticProblems(s(), 'ball').filter(p => p.startsWith('mistake'))).toEqual([]);
  });
  it('the spec carries D-LIB22-AFALL\'s blank Slam phase, no word, no seconds (released from D-LIB22-SECS)', () => { expect(s().tempo).toEqual([{ phase: 'Slam', move: true }]); });
});

describe('LIB-22 A2 / A18: sled_push and `sled` (NOSECS; the slice)', { timeout: T }, () => {
  const s = () => S.sled_push, K = () => M.sled_push;
  const sledIdx = () => s().equipment.findIndex((e: any) => typeof e === 'function' && ([] as any[]).concat(e(lmOf(s(), 'end'), { pose: 'end' }) ?? [])[0]?.part === 'sled');
  it('the sled sits at one place (±1 px) in start, end and Mistake', () => { expect(staticProblems(s(), 'sled')).toEqual([]); });
  it('mutation: the sled\'s base moved 2 cm in the Mistake is red', () => {
    const k = sledIdx(), bad = withEq(s(), k, e => (lm: any, ctx: any) => { const r = e(lm, ctx); return ctx.pose === 'mistake' && r ? (Array.isArray(r) ? r : [r]).map((it: any) => ({ ...it, ...(it.surface ? { surface: it.surface.map((p: number[]) => [p[0], p[1], p[2]! + 0.02]) } : {}), ...(it.pts ? { pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! + 0.02]) } : {}) }))[0] : r; });
    expect(staticProblems(bad, 'sled').length).toBeGreaterThan(0);
  });
  const postGrip = (pose: string) => { const l = lmOf(s(), pose), y = K().info?.GRIP_Y; return ['l', 'r'].map(sd => l[`grip.${sd}`]); };
  /** c1: each hand on its post at the post's middle (±1 cm); the posts joined to the body by their brackets. */
  const handProblems = (grips: number[][]) => {
    const sp = { rearZ: K().info.REAR_Z, postX: K().SIZES.POST_X }, out: string[] = [];
    grips.forEach((g, i) => { const p = EQ.sled.postPoint(sp, K().info.GRIP_Y, i ? 'r' : 'l'); if (d3(g, p) > 0.01) out.push(`hand ${i ? 'r' : 'l'} ${(d3(g, p) * 100).toFixed(1)} cm off its post`); });
    const mid = (EQ.sled.SLED.bodyY + EQ.sled.SLED.bodyT / 2 + K().info.POST_TOP) / 2;
    if (Math.abs(K().info.GRIP_Y - mid) > 0.01) out.push('grip not at the posts\' middle');
    return out;
  };
  it('c1: both hands on the posts at their middle in every pose (±1 cm)', () => {
    for (const pose of posesOf(s())) expect(handProblems(postGrip(pose)), pose).toEqual([]);
  });
  it('mutation: one hand 2 cm off the post at the end is red', () => {
    const g = postGrip('end'); g[1] = g[1]!.map((v: number, i: number) => v + (i === 1 ? 0.02 : 0));
    expect(handProblems(g)).toEqual(['hand r 2.0 cm off its post']);
  });
  /** D-LIB22-FRAME on the drawn items: runners on the floor; two brackets on the body's top, each under a post whose
   *  foot meets the bracket's corner (±1 mm). Posts are the upright sideBars (eq/parts.mjs: surface [top, foot], each
   *  offset t/2 along +z) beside the horn's x 0. */
  const frameProblems = (spec: any) => {
    const items = itemsIn(spec, 'end').items.filter((i: any) => i.part === 'sled'), cam = camOf(spec), fy = cam.P([0, 0, 0])[1], out: string[] = [];
    const lows = items.flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).flatMap((p: any) => (p.poly ?? []).map((q: number[]) => q[1])));
    if (Math.abs(Math.max(...lows) - fy) > 1) out.push('runners off the floor');
    const top = EQ.sled.SLED.bodyY + EQ.sled.SLED.bodyT / 2, brackets = items.filter((i: any) => i.type === 'poly' && i.pts.length === 3);
    const posts = items.filter((i: any) => i.type === 'backPad' && i.surface[0][0] !== 0 && Math.abs(i.surface[0][1] - i.surface[1][1]) > 0.5);
    if (brackets.length !== 2) out.push(`${brackets.length} brackets`);
    if (posts.length !== 2) out.push(`${posts.length} posts`);
    for (const p of posts) {
      const lo = p.surface[0][1] < p.surface[1][1] ? p.surface[0] : p.surface[1], foot = [lo[0], lo[1], lo[2] - p.t / 2];
      const b = brackets.find((q: any) => Math.abs(q.pts[0][0] - foot[0]!) < 1e-6);
      if (!b) { out.push(`post x ${foot[0]}: no bracket`); continue; }
      if (Math.hypot(b.pts[0][1] - foot[1]!, b.pts[0][2] - foot[2]!) > 0.001 || Math.abs(foot[1]! - top) > 0.001) out.push(`post x ${foot[0]}: foot off its bracket`);
    }
    return out;
  };
  /** #305 6356763967 item 9: the floor line runs under the whole sled; the struts are square blocks, not round-ended bars. */
  const floorProblems = (spec: any) => {
    const items = itemsIn(spec, 'end').items, fl = items.find((i: any) => i.type === 'floor'), zs = items.filter((i: any) => i.part === 'sled').flatMap((i: any) => (i.pts ?? i.surface).map((p: number[]) => p[2]!));
    const out: string[] = [];
    if (!fl || fl.to < Math.max(...zs) || fl.from > Math.min(...zs)) out.push(`floor ${fl?.from}..${fl?.to} m, sled ${Math.min(...zs).toFixed(2)}..${Math.max(...zs).toFixed(2)} m`);
    const short = items.filter((i: any) => i.part === 'sled' && i.type === 'backPad' && i.len < 0.1);
    if (short.length) out.push(`${short.length} short round-ended bars`);
    return out;
  };
  it('the floor runs under the whole sled, and no strut is a short round-ended bar', () => { expect(floorProblems(s())).toEqual([]); });
  it('mutation: the floor ending at 1.6 m (short of the sled\'s front) is red', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any) => (e?.type === 'floor' ? { ...e, to: 1.6 } : e)) };
    expect(floorProblems(bad).length).toBe(1);
  });
  it('D-LIB22-FRAME: each post stands on its bracket on the body, and the runners sit on the floor', () => {
    expect(frameProblems(s())).toEqual([]);
  });
  it('mutations: the near bracket dropped, and the near post lifted 2 cm off its bracket, are red', () => {
    const drop = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && [].concat(r).filter((it: any) => !(it?.part === 'sled' && it.type === 'poly' && it.pts?.length === 3 && it.z === 'mid')); } : e)) };
    expect(frameProblems(drop).length).toBeGreaterThan(0);
    const lift = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && [].concat(r).map((it: any) => (it?.part === 'sled' && it.type === 'backPad' && it.z === 'mid' ? { ...it, surface: [it.surface[0], [it.surface[1][0], it.surface[1][1] + 0.02, it.surface[1][2]]] } : it)); } : e)) };
    expect(frameProblems(lift)).toEqual(['post x -0.25: foot off its bracket']);
  });
  it('c8: the balls of the feet down (±1 cm) and the heels up (over 3 cm) in every pose; no toe under the floor', () => {
    for (const pose of posesOf(s())) {
      const l = lmOf(s(), pose);
      for (const sd of ['l', 'r']) {
        expect(l[`ball.${sd}`][1], `${pose} ball.${sd}`).toBeLessThanOrEqual(0.01);
        expect(l[`heel.${sd}`][1], `${pose} heel.${sd}`).toBeGreaterThan(0.03);
      }
    }
  });
  /** A18: no drawn foot outline below the floor line (0.5 px) in every pose. */
  const footProblems = (spec: any) => posesOf(spec).flatMap(pose => { const fy = camOf(spec).P([0, 0, 0])[1]; return shapesIn(spec, pose).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => { const low = Math.max(...x.poly.map((p: number[]) => p[1]!)); return low - fy > 0.5 ? [`${pose}: ${x.key} ${(low - fy).toFixed(1)} px under the floor`] : []; }); });
  it('A18: no foot below the floor line in any pose', () => { expect(footProblems(s())).toEqual([]); });
  it('A18 mutation: the driving foot\'s toe 1 cm below the floor (the rigid foot tilted on its ball without the lift) is red', () => {
    const st = s().poses.start, r = st.plant.r, bad = { ...s(), poses: { ...s().poses, start: { ...st, plant: { ...st.plant, r: { ...r, at: [r.at[0], r.at[1] - 0.01 - 0.0094 + 0.0094, r.at[2]] } } } } };
    expect(footProblems(bad).some(p => p.startsWith('start: foot.r'))).toBe(true);
  });
  it('A18 balance: the centre of mass between the stance foot\'s ball and the hands on the posts, in every pose', () => {
    for (const pose of posesOf(s())) { const l = lmOf(s(), pose), z = comOf(l)[2]!; expect(z > l['ball.l'][2] && z < l.grips[2], pose).toBe(true); }
  });
  it('c3: the trunk parallel to the floor (±2 deg) and the shoulders level with the hands (±1 cm) in start and end; c9: the same trunk angle in both', () => {
    for (const pose of ['start', 'end']) {
      const l = lmOf(s(), pose), a = Math.atan2(Math.abs(l.shoulders[1] - l.hips[1]), Math.abs(l.shoulders[2] - l.hips[2])) * 180 / Math.PI;
      expect(a, pose).toBeLessThanOrEqual(2);
      expect(Math.abs(l['shoulder.r'][1] - l['grip.r'][1]), pose).toBeLessThanOrEqual(0.01);
    }
  });
  it('the spec carries D-LIB22-AFALL\'s blank Walk phase, no word, no seconds (released from D-LIB22-SECS)', () => { expect(s().tempo).toEqual([{ phase: 'Walk', move: true }]); });
});

describe('LIB-22 A2 / A18: burpee (NOSECS; held; bulk)', { timeout: T }, () => {
  const s = () => S.burpee;
  /** D-LIB22-BURPEE3D (#305 6359365488 item 4), on the engine's skinned body: each thigh (a capsule of RADII.thigh's
   *  side radius, tapering hip to knee) against the skinned torso profile (bodyShapes' torso, sk.skin), counted past 40 %
   *  of the thigh (the smallest share at which the standing and plank figures show 0 cm: the thigh's root sits inside
   *  the pelvis by design). Returns the deepest penetration (m). */
  const trunkThigh = (pose: any) => {
    const B = { height: H3D }, pxm = 100, cam = { view: 'side', near: 'r', facing: 'right', pxm, P: (w: number[]) => [w[2]! * pxm, -w[1]! * pxm] };
    const sk = body.fk(body.resolve(body.normPose(pose, B), B).q, B), sh = body.bodyShapes(sk, cam, {}), T = sh.find((x: any) => x.key === 'torso').poly, L = body.landmarks(sk);
    let worst = 0;
    for (const sd of ['l', 'r']) {
      const h = cam.P(L[`hip.${sd}`]), k = cam.P(L[`knee.${sd}`]);
      for (let i = 21; i <= 50; i++) {
        const t = i / 50, p = [h[0]! + (k[0]! - h[0]!) * t, h[1]! + (k[1]! - h[1]!) * t], r = (body.RADII.thigh[0] + (body.RADII.thigh[2] - body.RADII.thigh[0]) * t) * H3D * pxm;
        worst = Math.max(worst, (r - outside([T], p)) / pxm);
      }
    }
    return worst;
  };
  const BURPEE_CAP = 0.118 + 0.005;
  it('D-LIB22-BURPEE3D: the squat ghost\'s trunk-thigh penetration stays within 11.8 + 0.5 cm; the start and end show none', () => {
    const v = trunkThigh(s().poses.via[0]);
    console.log(`LIB-22 D-LIB22-BURPEE3D trunk/thigh: ${(v * 100).toFixed(1)} cm (cap ${(BURPEE_CAP * 100).toFixed(1)})`);
    expect(v).toBeLessThanOrEqual(BURPEE_CAP);
    expect(trunkThigh(s().poses.start)).toBeLessThanOrEqual(0.001);
    expect(trunkThigh(s().poses.end)).toBeLessThanOrEqual(0.001);
  });
  it('mutation: the ghost\'s trunk tipped 5 deg further into the thighs is past the cap: red', () => {
    const v = s().poses.via[0];
    expect(trunkThigh({ ...v, root: { ...v.root, tilt: v.root.tilt + 5 } })).toBeGreaterThan(BURPEE_CAP);
  });
});

describe('LIB-22 A2 / A18: farmer_s_carry (NOSECS; bulk)', { timeout: T }, () => {
  const s = () => S.farmer_s_carry, K = () => M.farmer_s_carry;
  /** #305 6359365488 item 5: the drawn dumbbell's cast-iron mass equals the balance's DB_KG (one sizes.json row drives both). */
  const massProblems = (drawnHead: number, drawnLen: number) => {
    const kg = 7200 * (2 * (3 * Math.sqrt(3) / 2) * (drawnHead / 2) ** 2 * drawnLen + Math.PI * 0.008 ** 2 * 0.14);
    return Math.abs(kg - K().DB_KG) <= 0.1 ? [] : [`drawn ${kg.toFixed(2)} kg != balance ${K().DB_KG} kg`];
  };
  it('the drawn dumbbells weigh the balance\'s DB_KG (±0.1 kg)', () => {
    const db = itemsIn(s(), 'end').items.filter((i: any) => i.type === 'dumbbell');
    expect(db).toHaveLength(2);
    for (const d of db) expect(massProblems(d.head, d.headLen)).toEqual([]);
  });
  it('mutation: the engine\'s default dumbbell (11.9 cm heads, 7 cm long) is red', () => {
    expect(massProblems(0.119, 0.07).length).toBe(1);
  });
  /** 3D: each dumbbell head (a cylinder of the hex's half-flats) clears each thigh and shank (tapered capsules, RADII x H). */
  const headClear = (spec: any) => {
    const R = body.RADII, out: string[] = [];
    const taper = (p: number[], c: number[], d: number[], r0: number, r1: number) => { const cd = d.map((v, k) => v - c[k]!), cp = p.map((v, k) => v - c[k]!), t = Math.max(0, Math.min(1, cd.reduce((x, v, k) => x + v * cp[k]!, 0) / cd.reduce((x, v) => x + v * v, 0))); return Math.hypot(...cp.map((v, k) => v - cd[k]! * t)) - (r0 + (r1 - r0) * t); };
    for (const pose of ['start', 'end', 'mistake']) {
      const l = lmOf(spec, pose);
      for (const d of itemsIn(spec, pose).items.filter((i: any) => i.type === 'dumbbell')) {
        const hh = d.head * 0.866 / 2;
        for (const sg of [-1, 1]) for (let i = 0; i <= 10; i++) {
          const p = [d.at[0], d.at[1], d.at[2] + sg * (0.065 + d.headLen * i / 10)];
          for (const t of ['l', 'r']) {
            const th = taper(p, l[`hip.${t}`], l[`knee.${t}`], R.thigh[1] * H3D, R.thigh[2] * H3D) - hh, sh = taper(p, l[`knee.${t}`], l[`ankle.${t}`], R.shank[1] * H3D, R.shank[2] * H3D) - hh;
            if (th < 0) out.push(`${pose} head in thigh.${t} ${(th * 100).toFixed(1)} cm`);
            if (sh < 0) out.push(`${pose} head in shank.${t} ${(sh * 100).toFixed(1)} cm`);
          }
        }
      }
    }
    return [...new Set(out)];
  };
  it('3D: the dumbbell heads clear both thighs and shanks in start, end and Mistake', () => {
    expect(headClear(s())).toEqual([]);
  });
  it('mutation: dumbbells 6 cm toward the midline (into the thighs) are red', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && r.type === 'dumbbell' ? { ...r, at: [r.at[0] - Math.sign(r.at[0]) * 0.06, r.at[1], r.at[2]] } : r; } : e)) };
    expect(headClear(bad).length).toBeGreaterThan(0);
  });
});

describe('LIB-22 A2 / A18: sled_pull, a drag (NOSECS; bulk; ruling Q9, #305 6355155831)', { timeout: T }, () => {
  const s = () => S.sled_pull, K = () => M.sled_pull;
  const sledRear = (spec: any, pose: string) => Math.min(...itemsIn(spec, pose).items.filter((i: any) => i.part === 'sled').flatMap((i: any) => (i.pts ?? i.surface).map((p: number[]) => p[2]!)));
  /** Q9: the sled moves by the hips' shift (±1 cm) and the hitch-to-upper-fist run keeps its length (±1 cm). */
  const dragProblems = (spec: any, rearOf: (pose: string) => number) => {
    const out: string[] = [], a = lmOf(spec, 'start'), b = lmOf(spec, 'end');
    const hip = b.hips[2] - a.hips[2], sled = rearOf('end') - rearOf('start');
    if (Math.abs(hip - sled) > 0.01) out.push(`sled shift ${(sled * 100).toFixed(1)} cm vs hips ${(hip * 100).toFixed(1)} cm`);
    const r0 = K().runOf(a, rearOf('start')), r1 = K().runOf(b, rearOf('end'));
    if (Math.abs(r1 - r0) > 0.01) out.push(`rope run ${(r0 * 100).toFixed(1)} -> ${(r1 * 100).toFixed(1)} cm`);
    return out;
  };
  it('the sled follows the hips and the rope keeps its length, start to end', () => {
    expect(dragProblems(s(), pose => sledRear(s(), pose))).toEqual([]);
  });
  it('mutation: a static sled (left at its start place) lengthens the rope: red', () => {
    expect(dragProblems(s(), () => sledRear(s(), 'start')).length).toBe(2);
  });
  it('the start sled and the start rope are drawn dashed in the end pose', () => {
    const parts = itemsIn(s(), 'end').items.filter((i: any) => /^start(sled|rope)$/.test(i.part ?? '')).map((i: any) => i.part);
    expect(new Set(parts)).toEqual(new Set(['startsled', 'startrope']));
  });
});

describe('LIB-22 A2 / A18: jump_rope and `jumpRope` (front view; held: D-LIB8-shrug)', { timeout: T }, () => {
  const s = () => S.jump_rope, K = () => M.jump_rope;
  const rope = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === 'rope');
  /** The rope strand runs unbroken from one handle's rope tip to the other's (its two ends within 1 cm of the tips). */
  const ropeProblems = (spec: any, pose: string, strand = rope(spec, pose)[2].pts) => {
    const l = lmOf(spec, pose), h = EQ.jumpRope.JUMP_ROPE.handleLen / 2, tips = ['r', 'l'].map(sd => [l[`grip.${sd}`][0], l[`grip.${sd}`][1] - h, l[`grip.${sd}`][2]]);
    const n = strand.length / 2, ends = [strand[0], strand[n - 1]], out: string[] = [];
    tips.forEach((t, i) => { if (Math.min(...ends.map((e: number[]) => d3(e, t))) > 0.01) out.push(`${pose}: the rope does not reach handle ${i ? 'l' : 'r'}`); });
    return out;
  };
  it('the rope and both handles are `poly` in every pose; the rope runs unbroken from handle to handle in start, end and Mistake', () => {
    for (const pose of posesOf(s())) { expect(rope(s(), pose).map((i: any) => i.type), pose).toEqual(['poly', 'poly', 'poly']); expect(ropeProblems(s(), pose)).toEqual([]); }
  });
  it('mutation: the rope cut to half its length (one end short of its handle) is red', () => {
    const st = rope(s(), 'end')[2].pts, q = Math.floor(st.length / 4), cut = [...st.slice(0, q), ...st.slice(st.length - q)];
    expect(ropeProblems(s(), 'end', cut).length).toBeGreaterThan(0);
  });
  /** c9, A18: in the hop the rope's lowest point on or above the floor and below every sole; the soles HOP up. */
  const hopProblems = (strand: number[][], l: any) => {
    const low = Math.min(...strand.map(p => p[1]!)), soles = Math.min(...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(k => l[k][1])), out: string[] = [];
    if (low < 0) out.push(`rope ${(-low * 100).toFixed(1)} cm under the floor`);
    if (low >= soles) out.push('rope not under the soles');
    return out;
  };
  it('c9: in the hop the soles are HOP up (±0.5 cm) and the rope passes under them, on or above the floor', () => {
    const l = lmOf(s(), 'end');
    expect(Math.abs(Math.min(...['heel.l', 'heel.r', 'ball.l', 'ball.r'].map(k => l[k][1])) - K().SIZES.HOP)).toBeLessThanOrEqual(0.005);
    expect(hopProblems(rope(s(), 'end')[2].pts, l)).toEqual([]);
  });
  it('A18 mutation: the rope\'s lowest point 1 cm below the floor in the hop is red', () => {
    expect(hopProblems(rope(s(), 'end')[2].pts.map((p: number[]) => [p[0]!, p[1]! - 0.01, p[2]!]), lmOf(s(), 'end'))).toEqual([expect.stringMatching(/^rope 0\.\d cm under the floor$/)]);
  });
  it('c1: the overhead arc is the rope\'s length (ROPE_LEN, ±1 cm); a projection is never longer than the rope (under the feet)', () => {
    const line = (pose: string) => { const st = rope(s(), pose)[2].pts, n = st.length / 2; return st.slice(0, n).map((p: number[], i: number) => p.map((v, j) => (v + st[st.length - 1 - i]![j]!) / 2)); };
    expect(Math.abs(EQ.jumpRope.lineLength(line('start')) - K().ROPE_LEN)).toBeLessThanOrEqual(0.01);
    expect(EQ.jumpRope.lineLength(line('end'))).toBeLessThanOrEqual(K().ROPE_LEN);
  });
  it('c5, c8: the hands at hip height (±2 cm), just outside and in front of the hips; the elbows by the ribs (within 8 cm of the trunk\'s side)', () => {
    for (const pose of ['start', 'end']) {
      const l = lmOf(s(), pose);
      for (const sd of ['l', 'r']) { expect(Math.abs(l[`grip.${sd}`][1] - l[`hip.${sd}`][1]), pose).toBeLessThanOrEqual(0.02); expect(l[`grip.${sd}`][2] - l[`hip.${sd}`][2]).toBeGreaterThan(0); }
      expect(Math.abs(l['elbow.l'][0] - l['shoulder.l'][0])).toBeLessThanOrEqual(0.08);
    }
  });
  it('held (D-LIB8-shrug, D-LIB22-SIZE, S2): the card-true hop\'s Trace at the ruled point is under traceLenMin; the Mistake deviation passes', () => {
    const env = pins().envelope, R = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), R), tr = markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
    console.log(`LIB-22 H3 jump_rope: deviation ${dev.toFixed(1)} px, Trace ${tr.toFixed(1)} px (held)`);
    expect(tr).toBeLessThan(env.traceLenMin);
    expect(dev).toBeGreaterThanOrEqual(env.deviationMin);
  });
  it('the tempo strip is the ruled jump_rope row (Work 30, Rest 60)', () => {
    expect(s().tempo).toEqual([{ phase: 'Work', s: 30, move: true }, { phase: 'Rest', s: 60 }]);
  });
});

describe('LIB-22 A5: lb10/rows.json holds exactly the drawn, non-held LB10 H ids with a tempo strip, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id with a strip exactly once in the raw text, nothing else, every mode H (D-LIB22-B1)', () => {
    expect(want()).toEqual(['lib_sled_push', 'lib_sled_pull', 'lib_burpee', 'lib_high_knees', 'lib_battle_ropes', 'lib_medicine_ball_slam', 'lib_bear_crawl', 'lib_kettlebell_swing']);
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('mountain_climbers (pA) and wall_ball (no spec before its resume) are in no lb10/ file as a row', () => {
    for (const f of readdirSync('tools/plates/library/lb10').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb10', f), 'utf8');
      for (const id of ['mountain_climbers', 'wall_ball']) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id}`).toBe(false);
    }
    expect(existsSync(`${SPECS_DIR}/wall_ball.mjs`)).toBe(false);
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file; the NOSECS ids are held', () => {
    const design = readFileSync('tools/plates/library/lb10/DESIGN.md', 'utf8'), head = '## 15. Held ids and NOSECS rows';
    expect(design).toContain(head);
    const table = design.split(head)[1]!.split('\n## ')[0]!;
    for (const id of NOSECS) expect(HELD, id).toContain(id);
    for (const id of HELD) {
      expect(table.split('\n').some(l => l.startsWith('| ') && l.split('|')[1]!.includes(id) && /D-LIB22-SECS|D-LIB8-shrug|D-LIB22-WALL|D-LIB22-JJ|6360164495/.test(l)), id).toBe(true);
      for (const f of reg.batchFiles()) expect(readFileSync(f, 'utf8').includes(`lib_${id}`), `${f}: ${id}`).toBe(false);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
  });
  it('mutations: a dropped row, a duplicated row, a held id, a NOSECS id (farmer_s_carry), mountain_climbers, wall_ball and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const w = want(), j = { batch: 'LB10', rows: Object.fromEntries(w.map(id => [id, row])) };
    const text = JSON.stringify(j, null, 1), add = (id: string) => JSON.stringify({ ...j, rows: { ...j.rows, [id]: row } }, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: {} }, null, 1), w)).toEqual(w.map(x => `${x} x0`));
    expect(a5(text.replace(`  "${w[0]}": {`, `  "${w[0]}": ${JSON.stringify(row)},\n  "${w[0]}": {`), w)).toEqual([`${w[0]} x2`]);
    expect(a5(add('lib_jump_rope'), w), 'a held id').toEqual(['extra lib_jump_rope']);
    expect(a5(add('lib_farmer_s_carry'), w)).toEqual(['extra lib_farmer_s_carry']);
    expect(a5(add('lib_mountain_climbers'), w)).toEqual(['extra lib_mountain_climbers']);
    expect(a5(add('lib_wall_ball'), w)).toEqual(['extra lib_wall_ball']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, [w[0]!]: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB10, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view, id).toBe(FRONT.includes(id.slice(4)) ? 'front' : 'side');
      expect(readJson(`docs/research/howto/cards/${id.slice(4)}.json`).plate.view, id).toBe(r.view);
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB10', censusRef: '4a9fd86' });
  });
  it('the build\'s held list covers this test\'s held ids, each with its census view', async () => {
    const build = await import(/* @vite-ignore */ lib('lb10/build.mjs'));
    for (const id of HELD) expect(build.HELD[id], id).toBe(FRONT.includes(id) ? 'front' : 'side');
  });
});

describe('LIB-22 A9 (D-LIB22-AHEAD): the rows never ship; generate is unchanged', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  it('every LB10 row is at stage drawing or review; mutations: shipped and approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems(rows)).toEqual([]);
    expect(stageProblems({ ...rows, lib_kettlebell_swing: { ...rows.lib_kettlebell_swing, stage: 'shipped' } })).toEqual(['lib_kettlebell_swing: shipped']);
    expect(stageProblems({ ...rows, lib_kettlebell_swing: { ...rows.lib_kettlebell_swing, stage: 'approved-plate' } })).toEqual(['lib_kettlebell_swing: approved-plate']);
  });
  it('none of the 12 is shipped, even with lb10/rows.json read as a batch file', () => {
    const IDS = LB10.map(i => `lib_${i}`);
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
    expect(reg.shippedIds().filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  it('mutation: rows.json copied into batches/ (read as a batch) would name batch LB10 and an LB10 id', () => {
    const text = readFileSync(ROWS, 'utf8');
    expect(/"batch":\s*"LB10"/.test(text) && /lib_kettlebell_swing/.test(text)).toBe(true);
  });
  it('no LB10 spec, composer, How-to, script or test imports anything under hands/, fidelity/, ci/ or tests/howto/fixtures/', () => {
    const files = [...specsDrawn().map(i => `${SPECS_DIR}/${i}.mjs`), ...COMPOSERS.map(c => `tools/plates/library/eq/${c}.mjs`),
      ...specsDrawn().map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb10/build.mjs', 'tools/plates/library/lb10/qa.mjs', 'tests/howto/lb10-plates.test.ts'];
    const bad = (f: string) => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map(m => join(f, '..', m[1]!)).filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\/|^tests\/howto\/fixtures\//.test(p));
    for (const f of files) expect(bad(f), f).toEqual([]);
  });
  it('generate --check is green, and no generated file reads lb10/, the LB10 specs, composers or How-to sources (awaited child process)', async () => {
    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});
const ids = ${JSON.stringify(LB10)}, out = await gen.render(), bad = [];
for (const [p, { text }] of out) { if (/library\\/lb10\\/|eq\\/(kettlebell|medBall|sled|jumpRope)\\.mjs/.test(text)) bad.push(p + ': lb10/ or an LB10 composer');
  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\b').test(text)) bad.push(p + ': ' + id); }
console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;
    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    console.log(`LIB-22 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);
    expect(r.n).toBeGreaterThan(0);
    expect(r.diff).toEqual([]);
    expect(r.bad).toEqual([]);
  });
});

describe('LIB-22 A10: the LB10 plates page is deterministic (PQ-H7; built in an awaited child process)', { timeout: T }, () => {
  const twoBuilds = async (specOverride = '') => {
    const script = `const b = await import(${JSON.stringify(lib('lb10/build.mjs'))}), { createHash } = await import('node:crypto');
const sha = x => createHash('sha256').update(x).digest('hex');
const a = await b.buildLb10Page(), c = await b.buildLb10Page();
console.log(JSON.stringify({ ids: b.drawnIds(), a: sha(a.html), c: sha(c.html) }));`;
    const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26, env: { ...process.env, ...(specOverride ? { LB10_MUT: specOverride } : {}) } });
    return JSON.parse(stdout.trim().split('\n').pop()!);
  };
  it('two builds of the LB10 rows are byte-identical', async () => {
    const r = await twoBuilds();
    expect([...r.ids].sort()).toEqual(drawn().map(i => `lib_${i}`).sort());
    expect(r.a).toBe(r.c);
    console.log(`LIB-22 A10: plates page sha256 ${r.a}`);
  });
});

describe('LIB-22 A7 (spec half): each spec\'s tempo follows lb10/tempo.json and its card; NOSECS specs carry none', () => {
  const t = readJson('tools/plates/library/lb10/tempo.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const build = (id: string) => (t.rows[id] ? t.rows[id].map((r: any) => phaseOf(cardOf(id).plate.tempo, r)) : undefined);
  const tempoProblems = (id: string, spec: any) => (JSON.stringify(spec.tempo) === JSON.stringify(build(id)) ? [] : [`${id}: ${JSON.stringify(spec.tempo)} != ${JSON.stringify(build(id))}`]);
  it('every drawn spec\'s tempo is its ruled row built from the card (or none, NOSECS)', () => {
    for (const id of specsDrawn()) expect(tempoProblems(id, S[id])).toEqual([]);
  });
  it('mutations: a Hold added to kettlebell_swing, its drive set to 2 s, a Rest added, a timed tempo on sled_push\'s blank row are red', () => {
    const k = S.kettlebell_swing;
    expect(tempoProblems('kettlebell_swing', { ...k, tempo: [k.tempo[0], { phase: 'Hold', s: 1 }, k.tempo[1]] }).length).toBe(1);
    expect(tempoProblems('kettlebell_swing', { ...k, tempo: [{ ...k.tempo[0], s: 2 }, k.tempo[1]] }).length).toBe(1);
    expect(tempoProblems('kettlebell_swing', { ...k, tempo: [...k.tempo, { phase: 'Rest', s: 30 }] }).length).toBe(1);
    expect(tempoProblems('sled_push', { ...S.sled_push, tempo: [{ phase: 'Push', s: 1, move: true }] }).length).toBe(1);
  });
});

describe('LIB-22 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `${SPECS_DIR}/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p)),
    ...c.filter(p => p.startsWith('tests/howto/fixtures/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn LB10 spec passes', async () => {
    expect(files().length).toBe(DRAWN.length);
    for (const f of files()) { expect(problems(f, closure.closureOf([f])), f).toEqual([]); await yieldNow(); }
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb10-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = `${SPECS_DIR}/kettlebell_swing.mjs`;
  it('mutation: readFileSync added to the kettlebell composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/kettlebell.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/vendor/exercises/barbell_back_squat.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../vendor/exercises/barbell_back_squat.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root))).toContain('tools/plates/vendor/exercises/barbell_back_squat.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-22 A16: no other card\'s composer is copied, forked or imported (D-LIB22-COMPOSERS, -ROPE, -WALL)', () => {
  // D-LIB-A16-COMPOSE (lib4-cards section 39): main's eq/ at 40f9ea93, this card's five composers, and the composers other build-ahead cards own by exact name.
  const MAIN_EQ = ['assistMachine', 'band', 'chestRowMachine', 'dHandle', 'declineBench', 'inclineBench', 'landmine', 'legCurlMachine', 'parts', 'pecDeck', 'polybar', 'romanChair', 'rope', 'safetyArms', 'smith'].map(n => `${n}.mjs`);
  const OURS = ['kettlebell.mjs', 'medBall.mjs', 'sled.mjs', 'jumpRope.mjs', 'battleRope.mjs'];
  const OTHER_CARDS: Record<string, string[]> = { 'LIB-14': ['wall'], 'LIB-15': ['preacherPad'], 'LIB-16': ['crunchMachine', 'pulloverMachine'], 'LIB-17': ['dipBars'],
    'LIB-18': ['ankleCuff', 'calfMachine', 'hackSled', 'legExtMachine', 'pendulum'], 'LIB-21': ['abWheel'] };
  const OTHER = Object.values(OTHER_CARDS).flat().map(n => `${n}.mjs`);
  const EQ = 'tools/plates/library/eq';
  const eqFiles = () => readdirSync(EQ).map(name => ({ name, bytes: readFileSync(join(EQ, name), 'utf8') }));
  const eqProblems = (files: { name: string; bytes: string }[]) => {
    const names = files.map(f => f.name), ours = files.filter(f => OURS.includes(f.name));
    return [...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n) && !OTHER.includes(n)).map(n => `extra ${n}`),
      ...[...MAIN_EQ, ...OURS].filter(n => !names.includes(n)).map(n => `missing ${n}`),
      ...files.filter(f => !OURS.includes(f.name)).flatMap(f => ours.filter(o => o.bytes === f.bytes).map(o => `${f.name} copies ${o.name}`))];
  };
  it('tools/plates/library/eq/ holds main\'s files, the LB10 composers and only other cards\' named composers', () => {
    expect(eqProblems(eqFiles())).toEqual([]);
  });
  it('mutation: a copy of #289\'s eq/wall.mjs added under eq/ under another name is red', () => {
    expect(eqProblems([...eqFiles(), { name: 'ballWall.mjs', bytes: 'export const wall = () => [];' }])).toEqual(['extra ballWall.mjs']);
  });
  it('mutation: a file named as another card\'s composer holding a byte copy of one of ours is red', () => {
    const sled = eqFiles().find(f => f.name === 'sled.mjs')!;
    expect(eqProblems([...eqFiles().filter(f => f.name !== 'hackSled.mjs'), { name: 'hackSled.mjs', bytes: sled.bytes }])).toEqual(['hackSled.mjs copies sled.mjs']);
  });
  it('mutation: a main file or an own composer missing is red; this card\'s own names are not in OTHER_CARDS', () => {
    expect(eqProblems(eqFiles().filter(f => f.name !== 'smith.mjs' && f.name !== 'kettlebell.mjs'))).toEqual(['missing smith.mjs', 'missing kettlebell.mjs']);
    expect(OTHER.filter(n => OURS.includes(n))).toEqual([]);
  });
});

describe('LIB-22 A15: Mistakes, tells, cues, callouts, leaders and soft bends (DESIGN.md sections 8-12)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { sled_push: 'round', sled_pull: 'lean', farmer_s_carry: 'long', burpee: 'landing', jumping_jacks: 'toes', high_knees: 'arch',
    jump_rope: 'high', battle_ropes: 'shrug', medicine_ball_slam: 'arms', wall_ball: 'far', bear_crawl: 'hips', kettlebell_swing: 'lean' };
  const ONE_TELL = ['jump_rope', 'burpee', 'jumping_jacks'];
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells (or one, with its record), the first carrying the ruled key', () => {
    for (const id of specsDrawn()) {
      expect(keyProblems(S[id])).toEqual([]);
      const n = S[id].mistake.tells.length;
      expect(ONE_TELL.includes(id) ? n === 1 : n >= 2 && n <= 3, `${id} ${n}`).toBe(true);
    }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.kettlebell_swing;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['kettlebell_swing: first tell arch']);
  });
  /** D-LIB10-SKULL1: a one-tell plate has its record in DESIGN.md (the fault, the claim ids read, "no second ... sign"). */
  const recordProblems = (id: string, design = readFileSync('tools/plates/library/lb10/DESIGN.md', 'utf8')) => {
    const sec = design.split('**One-tell records')[1]?.split('\n## ')[0] ?? '';
    return sec.split('\n').some(l => l.startsWith(`- ${id}:`) && /claim ids read/.test(l)) && /no second visible sign stated|no second sign stated/.test(sec) ? [] : [`${id}: no one-tell record`];
  };
  it('every one-tell plate has its D-LIB10-SKULL1 record; mutation: a spec with one tell and no record is red', () => {
    for (const id of specsDrawn().filter(i => S[i].mistake.tells.length === 1)) expect(recordProblems(id)).toEqual([]);
    expect(recordProblems('kettlebell_swing')).toEqual(['kettlebell_swing: no one-tell record']);
  });
  const guideProblems = (spec: any) => (spec.mistake.guides ?? []).filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.sled_push;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: s.mistake.guides[0].pts }] } })).toEqual(['sled_push: line']);
  });
  /** Q-D5-6 cue table: one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('the cue table: every cue is one sentence of 15 words or fewer (logged); mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) {
      for (const c of [...S[id].callouts, ...S[id].mistake.tells]) console.log(`LIB-22 cue ${id} ${c.key}: "${c.cue}" (${c.cue.split(/\s+/).length} words)`);
      expect(cueProblems(S[id]), id).toEqual([]);
    }
    const s = S.kettlebell_swing;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Push your hips well back and keep both of your knees only very slightly bent at all times.' }, ...s.callouts.slice(1)] })).toEqual(['hinge: 18 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specsDrawn()) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  const drawnPolys = (spec: any, pose: string) => { const cam = camOf(spec), out: number[][][] = []; for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam)) if (p.poly) out.push(p.poly); return out; };
  /** Each callout's and tell's anchor sits on an item drawn in its pose: within 3 px of the figure in that pose, an
   *  equipment outline, a Mistake guide or arrow, or the datum. */
  const anchorProblems = (spec: any) => {
    const r = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    const lms = qaEng.poseLandmarks(Eng(), spec).lm, out: string[] = [];
    for (const [mode, list] of [['normal', spec.callouts], ['mistake', spec.mistake.tells]] as const) for (const c of list) {
      const named = typeof c.anchor === 'string' && c.anchor.includes(':') ? c.anchor.split(':')[0] : c.anchor?.pose;
      const pose = named ?? (mode === 'mistake' ? 'mistake' : 'end');
      const at = qaEng.resolvePoint(c.anchor, pose, lms, qaEng.cameraOf(spec, r.normal.report));
      const polys = [...shapesIn(spec, pose).map((x: any) => x.poly), ...drawnPolys(spec, pose)];
      // a guide arrow (m-arrow) shows a motion, never the part a label names (#305 6356763967 item 1)
      const lines = [...r[mode].svg.matchAll(/<path class="(?:eq-cable|datum|m-line)[^"]*" d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      const dLine = Math.min(Infinity, ...lines.map(([p, q]) => segD(at, p!, q!)));
      if (!(outside(polys, at) <= 3 || dLine <= 3)) out.push(`${spec.id} ${c.key}: anchor ${Math.min(Math.abs(outside(polys, at)), dLine).toFixed(1)} px from any drawn item`);
    }
    return out;
  };
  it('every callout and tell anchor sits on an item drawn in its pose (within 3 px)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...anchorProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: a tell anchored on its own guide arrow, away from the figure and the equipment, is red', () => {
    const s = S.kettlebell_swing, g = s.mistake.guides.find((x: any) => x.kind === 'arrow');
    const tells = [{ ...s.mistake.tells[0], anchor: g.from }, ...s.mistake.tells.slice(1)];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells } }).length).toBe(1);
  });
  it('mutation: one tell\'s anchor moved to a point with no drawn item is red', () => {
    const s = S.kettlebell_swing, tells = [{ ...s.mistake.tells[0], anchor: [0, 0.4, 0.9] }, ...s.mistake.tells.slice(1)];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells } }).length).toBe(1);
  });
  /** 13.1, 13.4 must-fix 1: every solid red arrow clears the solid end figure by 6 px. */
  const clearance = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      const pts = xy(m[1]!), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('every drawn plate: no solid red arrow comes within 6 px of the solid end figure', async () => {
    for (const id of specsDrawn()) { expect(clearance(S[id]), id).toEqual([]); await yieldNow(); }
  });
  it('mutation: an arrow from the end hip to the Mistake hip on sled_push (inside the 6 px clearance) is red', () => {
    const s = S.sled_push, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'hips', pose: 'end' }, to: { at: 'hips', pose: 'mistake' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  /** Lines a leader keeps 6 px from (away from its first 8 px): the Trace and the equipment (rope, sled, ball, bell, floor).
   *  `rope` holds the jump rope's strand outline apart, for the named nit below. */
  const avoidOf = (spec: any, mistake: boolean, svg: string) => {
    const cam = camOf(spec), out: number[][][] = [], rope: number[][][] = [];
    for (const m of svg.matchAll(/<path class="(?:trace|eq-cable|floorline)[^"]*"[^>]*? d="([^"]+)"/g)) out.push(...segs(xy(m[1]!.replace(/H(-?[\d.]+)/, (_, x) => `L${x} ${xy(m[1]!)[0]![1]}`))));
    for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) if (['poly', 'backPad', 'line'].includes(it.type) && it.part !== 'startbell' && it.part !== 'startball' && it.part !== 'startrope')
      for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) (it.part === 'rope' && it.z === 'back' ? rope : out).push(...segs([...pts, pts[0]])); }
    return { out, rope };
  };
  /** D-LIB22-HOPNIT (#305 6355887979): jump_rope's `hop` leader, end view only, may cross the rope strand, once and
   *  steeply; it keeps 6 px from everything else. */
  const HOPNIT = [{ id: 'jump_rope', key: 'hop', mistake: false, part: 'rope' }, { id: 'jump_rope', key: 'elbows', mistake: false, part: 'startrope' }, { id: 'jump_rope', key: 'hands', mistake: false, part: 'startrope' }, { id: 'jump_rope', key: 'high', mistake: true, part: 'rope' }];
  const HOP_STEEP = 45;
  const isNit = (nits: any[], id: string, key: string, mistake: boolean) => nits.some(n => n.id === id && n.key === key && n.mistake === mistake && n.part === 'rope');
  /** A nit leader's rope crossing: the runs of its samples within 6 px of the strand, and its angle to the strand (deg). */
  const ropeCrossing = (lead: number[][], rope: number[][][]) => {
    let runs = 0, inRun = false, angle = 90;
    for (const [a, b] of segs(lead)) for (let k = 0; k <= 200; k++) {
      const q = [a![0]! + (b![0]! - a![0]!) * k / 200, a![1]! + (b![1]! - a![1]!) * k / 200];
      if (Math.hypot(q[0]! - lead[0]![0]!, q[1]! - lead[0]![1]!) < 8) continue;
      let best = Infinity, g: number[][] = [];
      for (const r of rope) { const d = segD(q, r[0]!, r[1]!); if (d < best) { best = d; g = r; } }
      const near = best < 6;
      if (near && !inRun) {
        runs++;
        const u = [b![0]! - a![0]!, b![1]! - a![1]!], v = [g[1]![0]! - g[0]![0]!, g[1]![1]! - g[0]![1]!];
        angle = Math.min(angle, Math.acos(Math.abs(u[0]! * v[0]! + u[1]! * v[1]!) / (Math.hypot(u[0]!, u[1]!) * Math.hypot(v[0]!, v[1]!))) * 180 / Math.PI);
      }
      inRun = near;
    }
    return { runs, angle };
  };
  const minGap = (spec: any, nits: any[] = HOPNIT) => {
    let min = Infinity, at = '';
    const crossings: string[] = [];
    for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = listOf(spec, mistake), { out, rope } = avoidOf(spec, mistake, svg);
      leadersOf(svg).forEach((p, i) => {
        const nit = isNit(nits, spec.id, list[i]?.key, mistake), avoid = nit ? out : [...out, ...rope];
        if (nit) { const c = ropeCrossing(p, rope); crossings.push(`${spec.id} ${list[i]?.key}: ${c.runs} crossing(s) at ${c.angle.toFixed(1)} deg`); if (c.runs !== 1 || c.angle < HOP_STEEP) { min = -1; at = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: ${c.runs} rope crossing(s) at ${c.angle.toFixed(1)} deg`; } }
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) { const d = segD(q, g[0]!, g[1]!); if (d < min) { min = d; at = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`; } }
        }
      });
    }
    return { min, at, crossings };
  };
  it('no leader comes within 6 px of the Trace, the floor line or any equipment outline (away from its first 8 px)', async () => {
    for (const id of specsDrawn()) { const g = minGap(S[id]); expect(g.min, `${id} ${g.at}`).toBeGreaterThanOrEqual(6); await yieldNow(); }
  });
  it('D-LIB22-HOPNIT: jump_rope\'s "Low hop" leader crosses the rope strand exactly once, steeply; mutations: the exception given to another key or id is red', () => {
    const g = minGap(S.jump_rope);
    console.log(`LIB-22 D-LIB22-HOPNIT ${g.crossings.join('; ')}`);
    expect(g.crossings.map(x => x.split(':')[0])).toEqual(['jump_rope hop', 'jump_rope high']);
    expect(minGap(S.jump_rope, [{ id: 'jump_rope', key: 'hands', mistake: false, part: 'rope' }]).min).toBeLessThan(6);
    expect(minGap(S.jump_rope, [{ id: 'sled_push', key: 'hop', mistake: false, part: 'rope' }]).min).toBeLessThan(6);
    expect(minGap(S.jump_rope, [{ id: 'jump_rope', key: 'hop', mistake: true, part: 'rope' }]).min).toBeLessThan(6);
  });
  it('mutation: medicine_ball_slam\'s "Hips and knees" box moved under the ball (its leader along the floor line) is red', () => {
    const s = S.medicine_ball_slam, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'hips' ? { ...x, box: { left: 200, top: 318 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  /** No leader crosses a figure: normal leaders stay outside the solid end figure; Mistake leaders stay outside both the
   *  solid end figure and the Mistake figure (6348852288 item 1), away from their first 8 px. */
  /** Front entries to the back (D-LIB18-LIFT, widened as D-LIB18-BACKPAD; #305 6360287922 ruling): a named leader may
   *  enter each figure once, from the front (its box end ahead of the anchor), crossing no equipment, at most 81.9 px. */
  // D-LIB22-FRONTNIT was withdrawn by the panel (#305 6361383239): no front entry is named in LB10.
  const FRONTNIT: any[] = [];
  const frontEntry = (p: number[][], figs: number[][][][], cam: any, spec: any, mistake: boolean) => {
    const len = segs(p).reduce((t, [a, b]) => t + Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!), 0), an = p[0]!, end = p[p.length - 1]!;
    const pts: number[][] = []; for (const [a, b] of segs([...p].reverse())) for (let k = 0; k < 40; k++) pts.push([a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40]);
    const use = pts.filter(q => Math.hypot(q[0]! - an[0]!, q[1]! - an[1]!) >= 8);
    const entries = figs.map(F => { let n = 0, was = false; for (const q of use) { const v = outside(F, q) < 0; if (v && !was) n++; was = v; } return n; });
    const eq = itemsIn(spec, mistake ? 'mistake' : 'end').items.filter((i: any) => i.type !== 'floor').flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).map((x: any) => x.poly).filter(Boolean));
    const eqHit = eq.length > 0 && use.some(q => outside(eq, q) < 0);
    return { len, entries, front: end[0]! > an[0]!, eqHit };
  };
  const crossProblems = (spec: any, nits: any[] = FRONTNIT) => {
    const out: string[] = [], cam = camOf(spec);
    for (const mistake of [false, true]) {
      const list = listOf(spec, mistake), figs = [shapesIn(spec, 'end').map((x: any) => x.poly), ...(mistake ? [shapesIn(spec, 'mistake').map((x: any) => x.poly)] : [])];
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        if (nits.some(n => n.id === spec.id && n.key === list[i]?.key && n.mistake === mistake)) {
          const f = frontEntry(p, figs, cam, spec, mistake);
          if (f.len > 81.9 || f.entries.some(n => n > 1) || !f.front || f.eqHit) out.push(`${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: front entry outside D-LIB18-LIFT (len ${f.len.toFixed(1)}, entries ${f.entries}, front ${f.front}, equipment ${f.eqHit})`);
          else console.log(`LIB-22 front entry ${spec.id} ${list[i]?.key}: ${f.len.toFixed(1)} px, entries ${f.entries}`);
          return;
        }
        figs.forEach((polys, f) => {
          let inside = 0;
          for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
            const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
            if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8 && outside(polys, q) < 0) inside++;
          }
          if (inside) out.push(`${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: crosses the ${f ? 'Mistake' : 'end'} figure`);
        });
      });
    }
    return out;
  };
  /** No leader crosses another leader, or another label's text (its ink box, 2 px margin), in either view (#305
   *  6356763967 items 4 and 6). A leader's own label is left out: the leader ends on it. */
  const labelProblems = (spec: any) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const r = plate.renderPlate(spec, { id: 'x', mistake }), leads = leadersOf(r.svg), list = listOf(spec, mistake), v = mistake ? 'mistake' : 'normal';
      const inks = r.report.labels.filter((l: any) => l.key !== 'meta');
      const X = (a: number[], b: number[], c: number[], d: number[]) => { const r1 = [b[0]! - a[0]!, b[1]! - a[1]!], q = [d[0]! - c[0]!, d[1]! - c[1]!], den = r1[0]! * q[1]! - r1[1]! * q[0]!; if (Math.abs(den) < 1e-9) return false; const t = ((c[0]! - a[0]!) * q[1]! - (c[1]! - a[1]!) * q[0]!) / den, u = ((c[0]! - a[0]!) * r1[1]! - (c[1]! - a[1]!) * r1[0]!) / den; return t > 0 && t < 1 && u > 0 && u < 1; };
      leads.forEach((p, i) => {
        for (let j = i + 1; j < leads.length; j++) if (segs(p).some(([a, b]) => segs(leads[j]!).some(([c, d]) => X(a!, b!, c!, d!)))) out.push(`${spec.id} ${v}: leaders ${list[i]?.key} and ${list[j]?.key} cross`);
        for (const l of inks) {
          if (l.key === list[i]?.key) continue;
          const { x0, y0, x1, y1 } = l.ink, m = 2;
          const hit = segs(p).some(([a, b]) => { for (let k = 0; k <= 50; k++) { const x = a![0]! + (b![0]! - a![0]!) * k / 50, y = a![1]! + (b![1]! - a![1]!) * k / 50; if (x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m) return true; } return false; });
          if (hit) out.push(`${spec.id} ${v}: leader ${list[i]?.key} through the text of ${l.key}`);
        }
      });
    }
    return out;
  };
  /** DRAWING-GUIDE §2 (a datum only when it proves a checkpoint; #305 6356763967 item 8): each datum line shows at
   *  least 24 px outside the solid end figure, the start layer's figure and the drawn equipment, so it reads. */
  const datumHidden = (spec: any) => {
    const svg = plate.renderPlate(spec, { id: 'x' }).svg, out: string[] = [];
    const polys = [...shapesIn(spec, 'end').map((x: any) => x.poly), ...shapesIn(spec, 'start').map((x: any) => x.poly), ...drawnPolys(spec, 'end')];
    for (const [, d] of svg.matchAll(/<path class="datum[^"]*" d="([^"]+)"/g)) {
      let vis = 0;
      for (const [a, b] of segs(xy(d!))) { const n = Math.ceil(Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!)); for (let k = 0; k < n; k++) { const q = [a![0]! + (b![0]! - a![0]!) * (k + 0.5) / n, a![1]! + (b![1]! - a![1]!) * (k + 0.5) / n]; if (outside(polys, q) > 1) vis++; } }
      if (vis < 24) out.push(`${spec.id}: datum shows ${vis} px`);
    }
    return out;
  };
  it('every datum line shows at least 24 px outside the figures and the equipment', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...datumHidden(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: kettlebell_swing\'s former stack line (plumb from the ankle to the head, inside the figure) is red', () => {
    const s = S.kettlebell_swing;
    expect(datumHidden({ ...s, datum: [{ x: 'ankle.r', from: 'ankle.r', to: { at: 'head', off: [0, -6] } }] }).length).toBe(1);
  });
  /** D-LIB22-DRAW: each implement item that moves between start and end by 6 px or more is redrawn dashed (class
   *  m-line, part `start<part>`) in the end pose, one closed outline on the start item's points. Under 6 px the dashed
   *  copy would lie on the solid one (jump_rope's handles ride the 3.8 cm hop: 5.6 px). */
  const phantomMissing = (spec: any) => {
    const out: string[] = [], st = itemsIn(spec, 'start').items, en = itemsIn(spec, 'end').items, pxm = camOf(spec).pxm;
    for (const part of ['bell', 'ball', 'rope', 'sled']) {
      const a0 = st.filter((i: any) => i.part === part && i.pts), b = en.filter((i: any) => i.part === part && i.pts);
      const moved = (i: any, k: number) => !b[k] || b[k].pts.length !== i.pts.length || Math.max(...i.pts.map((p: number[], j: number) => Math.hypot(...p.map((v, n) => v - b[k].pts[j][n])))) * pxm >= 6;
      const a = a0.filter(moved);
      if (!a.length) continue;
      const ph = en.filter((i: any) => i.part === `start${part}`);
      const match = a.filter((i: any) => ph.some((q: any) => q.type === 'line' && /\bm-line\b/.test(q.cls) && JSON.stringify(q.pts) === JSON.stringify([...i.pts, i.pts[0]])));
      if (match.length !== a.length) out.push(`${spec.id}: ${part} moves; ${match.length} of ${a.length} start outlines drawn dashed`);
    }
    return out;
  };
  it('every moving implement has its dashed start phantom in the end pose (kettlebell_swing, medicine_ball_slam, jump_rope)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...phantomMissing(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
    expect(['kettlebell_swing', 'medicine_ball_slam', 'jump_rope'].every(id => itemsIn(S[id], 'end').items.some((i: any) => /^start/.test(i.part ?? '')))).toBe(true);
  });
  it('mutation: kettlebell_swing\'s start-bell phantom removed is red', () => {
    const s = S.kettlebell_swing, bad = { ...s, equipment: s.equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && [].concat(r).filter((it: any) => it?.part !== 'startbell'); } : e)) };
    expect(phantomMissing(bad).length).toBe(1);
  });
  /** report.mjs's engine half: renderPlate reports no issue (a label on the figure, a joint under a label) in either
   *  view. The browser half ran per plate in the slice post (ok:true); this keeps the engine half in CI. */
  const engineIssues = (spec: any) => [false, true].flatMap(mistake => plate.renderPlate(spec, { id: 'x', mistake }).report.issues.map((i: string) => `${spec.id}${mistake ? ' mistake' : ''}: ${i}`));
  it('renderPlate reports no issue on any drawn plate, normal and Mistake', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...engineIssues(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: sled_push\'s "Balls of feet" box moved onto the figure is red (report.mjs would give ok:false)', () => {
    const s = S.sled_push, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'balls' ? { ...x, box: { left: 16, top: 262 } } : x)) };
    expect(engineIssues(bad).length).toBeGreaterThan(0);
  });
  it('no leader crosses another leader or another label\'s text', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...labelProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutations: medicine_ball_slam\'s "Flat back" box back at {40, 212} (its leader crosses "Hips and knees"), and a box whose leader runs through another label\'s text, are red', () => {
    const s = S.medicine_ball_slam, at = (key: string, box: any) => ({ ...s, callouts: s.callouts.map((x: any) => (x.key === key ? { ...x, box } : x)) });
    expect(labelProblems(at('flat', { left: 40, top: 212 }))).toContain('medicine_ball_slam normal: leaders hips and flat cross');
    expect(labelProblems(at('flat', { left: 40, top: 186 })).some(x => x.includes('through the text of hips'))).toBe(true);
  });
  it('no leader crosses the solid figure, and no Mistake leader crosses the Mistake figure', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...crossProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  /** Card line 243: no leader crosses the start phantom (the dashed start implement, drawn in the end view). Each crossing
   *  of a phantom segment counts once (proper intersection), away from the leader's first 8 px. A named nit (HOPNIT,
   *  item 'startrope') allows exactly one crossing of its phantom at HOP_STEEP degrees or more. */
  const phantomOf = (spec: any) => {
    const cam = camOf(spec), out: Record<string, number[][][]> = {};
    for (const it of itemsIn(spec, 'end').items) if (/^start/.test(it.part ?? '')) for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) (out[it.part] ??= []).push(...segs(pts)); }
    return out;
  };
  const crossAt = (a: number[], b: number[], c: number[], d: number[]) => {
    const r = [b[0]! - a[0]!, b[1]! - a[1]!], q = [d[0]! - c[0]!, d[1]! - c[1]!], den = r[0]! * q[1]! - r[1]! * q[0]!;
    if (Math.abs(den) < 1e-9) return null;
    const t = ((c[0]! - a[0]!) * q[1]! - (c[1]! - a[1]!) * q[0]!) / den, u = ((c[0]! - a[0]!) * r[1]! - (c[1]! - a[1]!) * r[0]!) / den;
    if (t < 0 || t > 1 || u < 0 || u > 1) return null;
    return { at: [a[0]! + r[0]! * t, a[1]! + r[1]! * t], angle: Math.acos(Math.abs(r[0]! * q[0]! + r[1]! * q[1]!) / (Math.hypot(r[0]!, r[1]!) * Math.hypot(q[0]!, q[1]!))) * 180 / Math.PI };
  };
  const phantomProblems = (spec: any, nits: any[] = HOPNIT) => {
    const out: string[] = [], ph = phantomOf(spec), list = listOf(spec, false);
    leadersOf(plate.renderPlate(spec, { id: 'x' }).svg).forEach((p, i) => {
      const key = list[i]?.key;
      for (const [part, S] of Object.entries(ph)) {
        // the phantom is a thin closed outline, so one crossing meets both of its edges: hits within 3 px count once
        const pts: number[][] = [], hits: number[] = [];
        for (const [a, b] of segs(p)) for (const [c, d] of S) { const x = crossAt(a!, b!, c!, d!); if (x && Math.hypot(x.at[0]! - p[0]![0]!, x.at[1]! - p[0]![1]!) >= 8 && !pts.some(q => Math.hypot(q[0]! - x.at[0]!, q[1]! - x.at[1]!) < 3)) { pts.push(x.at); hits.push(x.angle); } }
        const nit = nits.some(n => n.id === spec.id && n.key === key && n.mistake === false && n.part === part);
        if (nit ? hits.length !== 1 || hits[0]! < HOP_STEEP : hits.length) out.push(`${spec.id} ${key}: crosses ${part} ${hits.length}x (${hits.map(h => h.toFixed(1)).join(', ')} deg)`);
        else if (nit) console.log(`LIB-22 D-LIB22-HOPNIT ${spec.id} ${key}: 1 crossing of ${part} at ${hits[0]!.toFixed(1)} deg`);
      }
    });
    return out;
  };
  it('no leader crosses the start phantom (named nits: one steep crossing)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...phantomProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  /** D-LIB22-HOPNIT (#305 6355887979, widened 6356244552): exactly four jump_rope exceptions, each tied to its line,
   *  and each needed (without it, its plate is red). */
  const nitProblems = (nits: any[]) => {
    const out: string[] = [];
    if (nits.length !== 4 || nits.some(n => n.id !== 'jump_rope')) out.push(`${nits.length} exceptions: ${nits.map(n => `${n.id}/${n.key}`).join(', ')}`);
    for (const n of nits) {
      const rest = nits.filter(m => m !== n), spec = S[n.id];
      const needed = !spec ? false : n.part === 'rope' ? minGap(spec, rest).min < 6 : phantomProblems(spec, rest).length > 0;
      if (!needed) out.push(`${n.id}/${n.key} (${n.part}): not needed`);
    }
    return out;
  };
  /** A second copy of a line (the rope strand or the start phantom), moved sideways by dx m, in the end view. */
  const withSecondLine = (spec: any, part: string, dx: number, pose = 'end') => ({ ...spec, equipment: [...spec.equipment, (lm: any, ctx: any) => (ctx.pose !== pose ? null
    : spec.equipment.flatMap((e: any) => ([] as any[]).concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)).filter((it: any) => it && it.part === part && it.z === 'back')
      .map((it: any) => ({ ...it, pts: it.pts.map((q: number[]) => [q[0]! + dx, q[1]!, q[2]!]) })))] });
  it('D-LIB22-HOPNIT lists exactly the four ruled jump_rope exceptions (hop, high: the rope; elbows, hands: startrope), each needed', () => {
    expect(HOPNIT.map(n => `${n.id}/${n.key}/${n.mistake ? 'mistake' : 'normal'}/${n.part}`)).toEqual(['jump_rope/hop/normal/rope', 'jump_rope/elbows/normal/startrope', 'jump_rope/hands/normal/startrope', 'jump_rope/high/mistake/rope']);
    expect(nitProblems(HOPNIT)).toEqual([]);
  });
  it('mutations: a fifth exception, an exception for another id, and a second crossing on each of the four are red', () => {
    expect(nitProblems([...HOPNIT, { id: 'jump_rope', key: 'elbows', mistake: true, part: 'rope' }]).length).toBeGreaterThan(0);
    expect(nitProblems(HOPNIT.map(n => (n.key === 'hands' ? { ...n, id: 'medicine_ball_slam' } : n))).length).toBeGreaterThan(0);
    const jr = S.jump_rope;
    // hop: its box moved left, so the leader runs on past the rope (one crossing, green), then a second strand beyond it (red)
    const far = { ...jr, callouts: jr.callouts.map((x: any) => (x.key === 'hop' ? { ...x, box: { left: 24, top: 304 } } : x)) };
    expect(minGap(far).min, 'hop, box moved left: one crossing').toBeGreaterThanOrEqual(6);
    expect(minGap(withSecondLine(far, 'rope', -0.2)).min, 'hop: a second rope crossing').toBeLessThan(6);
    // high (Mistake view): its box moved right, so the leader runs on past the rope (green), then a second strand (red)
    const farHigh = { ...jr, mistake: { ...jr.mistake, tells: jr.mistake.tells.map((x: any) => (x.key === 'high' ? { ...x, box: { left: 248, top: 304 } } : x)) } };
    expect(minGap(farHigh).min, 'high, box moved right: one crossing').toBeGreaterThanOrEqual(6);
    expect(minGap(withSecondLine(farHigh, 'rope', 0.2, 'mistake')).min, 'high: a second rope crossing').toBeLessThan(6);
    for (const [key, dx] of [['elbows', -0.07], ['hands', 0.07]] as const) {
      const bad = phantomProblems(withSecondLine(jr, 'startrope', dx));
      expect(bad.filter(x => x.startsWith(`jump_rope ${key}:`)), `${key}: a second phantom crossing`).toHaveLength(1);
    }
  });
  it('mutations: medicine_ball_slam\'s "Ball overhead" anchored at the phantom ball\'s centre (its leader crosses the phantom) is red; a phantom nit given to another key is red', () => {
    const s = S.medicine_ball_slam, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'overhead' ? { ...x, anchor: 'start:grip.r' } : x)) };
    expect(phantomProblems(bad).length).toBe(1);
    expect(phantomProblems(S.jump_rope, HOPNIT.map(n => (n.key === 'elbows' ? { ...n, key: 'hop' } : n))).length).toBeGreaterThan(0);
  });
  it('mutation: kettlebell_swing\'s "Leaning back" box placed right of the figure, so its leader crosses the Mistake figure, is red', () => {
    const s = S.kettlebell_swing, bad = { ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((x: any) => (x.key === 'lean' ? { ...x, box: { left: 200, top: 60 } } : x)) } };
    expect(crossProblems(bad).some(p => p.startsWith('kettlebell_swing mistake lean'))).toBe(true);
  });
  /** D-LIB22-DRAW, D-LIB16-LOCK: a "slightly bent" knee in a side-view plate bends in the view's plane: the knee sits
   *  off the hip-ankle line by at least 90 % of its sized bend's offset. (The front-view knees follow D-LIB22-FRONT.) */
  const SOFT: Record<string, [string, string, number][]> = { kettlebell_swing: [['start', 'r', 15], ['start', 'l', 15]],
    farmer_s_carry: [['start', 'r', 15], ['start', 'l', 15], ['end', 'l', 15]], burpee: [['end', 'r', 15], ['end', 'l', 15]], sled_pull: [['end', 'r', 15]],
    high_knees: [['start', 'l', 15], ['start', 'r', 15], ['end', 'l', 15]], battle_ropes: [['start', 'l', 15], ['start', 'r', 15], ['end', 'l', 15], ['end', 'r', 15]] };
  const offsetFor = (deg: number) => { const a = 0.245 * 1.75, b = 0.246 * 1.75, c = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(deg * Math.PI / 180)); return (a * b * Math.sin(deg * Math.PI / 180)) / c; };
  const softProblems = (spec: any) => (SOFT[spec.id] ?? []).flatMap(([pose, s, deg]) => {
    const l = lmOf(spec, pose), h = l[`hip.${s}`], k = l[`knee.${s}`], an = l[`ankle.${s}`];
    const off = segD([k[2], k[1]], [h[2], h[1]], [an[2], an[1]]);   // the side view's plane (z, y)
    return off >= 0.9 * offsetFor(deg) ? [] : [`${pose} knee.${s} ${(off * 100).toFixed(1)} cm off the line < 90 % of ${(offsetFor(deg) * 100).toFixed(1)}`];
  });
  it('every sized soft knee in a side view shows its bend in the view\'s plane; mutation: the hike\'s knees drawn at 0 deg are red', () => {
    for (const id of specsDrawn()) expect(softProblems(S[id]), id).toEqual([]);
    const s = S.kettlebell_swing, st = s.poses.start, bad = { ...s, poses: { ...s.poses, start: { ...st, plant: undefined, hip: 90, knee: 0, ankle: 0 } } };
    expect(softProblems(bad).length).toBe(2);
  });
});

describe('LIB-22 A17: sizes and trace points are fixed in lb10/sizes.json and never set by PQ-H3 (D-LIB22-SIZE, -TRACE)', () => {
  const sizes = readJson('tools/plates/library/lb10/sizes.json');
  const rowProblems = (table: Record<string, any>) => Object.entries(table).flatMap(([k, r]: [string, any]) => [
    ...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
    ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : []),
  ]);
  /** Both ways: every SIZES number is a row with the same value; every row is a SIZES number, a solved export (value
   *  'solved') or the spec's trace point (`trace`). */
  const sizeProblems = (mod: any, table: Record<string, any>) => {
    const spec = mod.SIZES ?? {}, out: string[] = [];
    for (const k of Object.keys(spec)) if (!(k in table)) out.push(`${k}: not in sizes.json`); else if (table[k].value !== spec[k]) out.push(`${k}: spec ${spec[k]} != sizes.json ${table[k].value}`);
    for (const [k, r] of Object.entries<any>(table)) {
      if (k === 'trace') { if (mod.default?.trace?.point !== r.value) out.push(`trace: spec ${mod.default?.trace?.point} != sizes.json ${r.value}`); continue; }
      if (r.value === 'solved') { if (typeof mod[k] !== 'number') out.push(`${k}: no solved export`); continue; }
      if (!(k in spec)) out.push(`${k}: not in the spec`);
    }
    return [...out, ...rowProblems(table)];
  };
  const CONST: Record<string, string> = { kettlebell: 'KETTLEBELL', medBall: 'MED_BALL', sled: 'SLED', jumpRope: 'JUMP_ROPE', battleRope: 'BATTLE_ROPE' };
  it('each drawn spec\'s SIZES and trace point equal its sizes.json row; each composer\'s constants equal theirs; every basis is not PQ-H3', () => {
    for (const id of specsDrawn()) expect(sizeProblems(M[id], sizes.ids[id]), id).toEqual([]);
    for (const [c, k] of Object.entries(CONST)) expect(sizeProblems({ SIZES: { ...EQ[c][k] } }, sizes.ids[c]), c).toEqual([]);
  });
  it('mutations: a Mistake size changed in its spec only, an empty basis, a basis naming PQ-H3 or deviationMin, a spec number missing from sizes.json and a trace point changed in the spec only are red', () => {
    const m = M.kettlebell_swing, t = sizes.ids.kettlebell_swing;
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, M_ARCH: -20 } }, t)).toEqual(['M_ARCH: spec -20 != sizes.json -12']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: '' } })).toEqual(['M_ARCH: empty basis']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'set to clear PQ-H3' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'above deviationMin' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, NEW_ANGLE: 5 } }, t)).toEqual(['NEW_ANGLE: not in sizes.json']);
    expect(sizeProblems({ ...m, default: { ...m.default, trace: { ...m.default.trace, point: 'knee.r' } } }, t)).toEqual(['trace: spec knee.r != sizes.json grip.r']);
  });
});

describe('LIB-22 resume: the zoom circles (D-LIBZOOM-EXTEND, lib4-cards §41; DESIGN.md section 21)', { timeout: T }, () => {
  // Each held S2 row the zoom lifts: its view, k, and the measure at the zoom's own scale (QA's: clippedTrace on the
  // drawn circle; the tell deviation x k). k rule (section 21): the smallest k in steps of 0.5 from 1.5 whose
  // zoom-scale value clears its bar by at least 10 %.
  const ZOOMS: Record<string, { view: string; k: number }> = {
    sled_pull: { view: 'normal', k: 1.5 }, burpee: { view: 'mistake', k: 2 }, bear_crawl: { view: 'normal', k: 4 },
  };
  let zi: any, qz: any, env: any;
  beforeAll(async () => {
    [zi, qz] = await Promise.all(['zoom/inline.mjs', 'qa/zoom.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    env = pins().envelope;
  });
  /** { value, bar, holds }: the zoom-scale measure of `spec` at its zoom, its bar, and whether the source ring holds
   *  the whole trace (normal) or the tell anchor in both poses (Mistake), as qa/zoom.mjs H3.zoom:content asks. */
  const measure = (spec: any) => {
    const z = zi.zoomOf(spec), ring = { c: z.circle.c, r: z.circle.r }, src = z.src;
    const inSrc = (p: number[]) => Math.hypot(p[0]! - src.c[0], p[1]! - src.c[1]) <= src.r - 1;
    return z.view === 'normal'
      ? { value: qz.clippedTrace(z.svg, ring), bar: env.traceLenMin, holds: z.trace.every(inSrc) }
      : { value: z.fault.d * z.k, bar: env.deviationMin, holds: [z.fault.end, z.fault.mistake].every(inSrc) };
  };
  const ruleProblems = (id: string, spec: any) => {
    const out: string[] = [], m = measure(spec);
    if (JSON.stringify(spec.zoom) !== JSON.stringify(ZOOMS[id])) out.push(`${id}: zoom ${JSON.stringify(spec.zoom)}`);
    if (!(m.value >= 1.1 * m.bar)) out.push(`${id}: ${m.value.toFixed(1)} px under the bar + 10 %`);
    if (!m.holds) out.push(`${id}: the source ring does not hold the motion`);
    if (spec.zoom.k > zi.ZOOM.kMin) { const lower = measure({ ...spec, zoom: { ...spec.zoom, k: spec.zoom.k - 0.5 } }); if (lower.value >= 1.1 * lower.bar) out.push(`${id}: k ${spec.zoom.k - 0.5} already clears`); }
    return out;
  };
  it('each lifted row carries its ruled zoom, clears its bar by 10 % at the smallest such k, and holds its motion in the source ring', async () => {
    for (const id of Object.keys(ZOOMS)) {
      expect(zi.zoomFieldProblems(S[id].zoom), id).toEqual([]);
      expect(ruleProblems(id, S[id]), id).toEqual([]);
      console.log(`LIB-22 zoom ${id}: ${S[id].zoom.view} k ${S[id].zoom.k}, ${measure(S[id]).value.toFixed(1)} px`);
      await yieldNow();
    }
    for (const id of specsDrawn().filter(i => !(i in ZOOMS))) expect(S[id].zoom, id).toBeUndefined();
  });
  it('at plate scale each lifted row still fails its bar (the zoom is allowed only there; never enlarged)', async () => {
    for (const id of Object.keys(ZOOMS)) {
      const R = { normal: plate.renderPlate(S[id], { id: 'x' }), mistake: plate.renderPlate(S[id], { id: 'x', mistake: true }) };
      const v = S[id].zoom.view === 'normal' ? markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0) : qaNode.deviation({ spec: S[id] }, Eng(), R);
      expect(v, id).toBeLessThan(S[id].zoom.view === 'normal' ? env.traceLenMin : env.deviationMin);
      await yieldNow();
    }
  });
  it('jump_rope stays held: a normal zoom at kMax 4 is under traceLenMin', () => {
    const m = measure({ ...S.jump_rope, zoom: { view: 'normal', k: zi.ZOOM.kMax } });
    expect(m.value).toBeLessThan(env.traceLenMin);
  });
  it('mutations: bear_crawl at k 3.5 (under the margin), sled_pull at k 1 (field), burpee at k 2.5 (not the smallest), a zoom on the wrong view are red', async () => {
    expect(ruleProblems('bear_crawl', { ...S.bear_crawl, zoom: { view: 'normal', k: 3.5 } })).toEqual(['bear_crawl: zoom {"view":"normal","k":3.5}', 'bear_crawl: 24.1 px under the bar + 10 %']);
    expect(zi.zoomFieldProblems({ view: 'normal', k: 1 })).toEqual(['zoom.k 1 is outside 1.5-4']);
    expect(ruleProblems('burpee', { ...S.burpee, zoom: { view: 'mistake', k: 2.5 } })).toEqual(['burpee: zoom {"view":"mistake","k":2.5}', 'burpee: k 2 already clears']);
    await yieldNow();
    expect(ruleProblems('sled_pull', { ...S.sled_pull, zoom: { view: 'mistake', k: 1.5 } })[0]).toBe('sled_pull: zoom {"view":"mistake","k":1.5}');
  });
});
