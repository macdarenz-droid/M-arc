// LIB-21 (lib-21-card Do 1, Do 6 a; acceptance A11, A19; rulings D-LIB21-*): the LB9 H build-ahead plates. Node only:
// the browser half of the plate QA runs in tools/plates/library/lb9/qa.mjs. Patterns copied from
// tests/howto/lb10-plates.test.ts (#305 @ a9c64e11). Every test reads what is drawn (the items a spec emits, the
// engine's landmarks, shapes and report), never a helper's own maths. Whole-page renders and generate run in an awaited
// child process (VITEST-RPC ruling A), and every loop over the specs yields one macrotask per spec (D-LIB21-TESTS).
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { afterAll, afterEach, describe, expect, it } from 'vitest';

// D-LIB21-TESTS (lessons #299 6351689010, 6352726951): one macrotask after every test lets the vitest worker answer
// its RPC; every per-spec loop yields once per spec, and whole-page renders run in a child process.
afterEach(() => new Promise<void>(r => setImmediate(r)));
// A19: the worker's longest event-loop block over the whole file, logged for each milestone post.
const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();
afterAll(() => { loopDelay.disable(); console.log(`LIB-21 A19 event-loop: max block ${(loopDelay.max / 1e6).toFixed(0)} ms, p99 ${(loopDelay.percentile(99) / 1e6).toFixed(0)} ms`); });

const LB9 = ['cable_crunch', 'ab_wheel_rollout', 'bird_dog', 'superman', 'pallof_press', 'side_plank', 'russian_twist', 'bicycle_crunch'];
// LB9's other rows: pilot A's plate (pA), pilot B's plate (pB) and the SUPCORE T children; never in an LB9 file.
const NOT_HERE = ['plank', 'crunch', 'reverse_crunch', 'dead_bug', 'v_up', 'flutter_kicks', 'hollow_body_hold'];
const RESEARCH_HEAD = 'f574bb4b761ded9010a61b59881b6eae125b58e0';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

describe('LIB-21 A11 (Do 6 a): the 8 cards and quotes are byte copies of the LB9 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb9/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 8 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB9);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB9);
    for (const id of LB9) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('bird_dog'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.bird_dog);
  });
  it('mutation: a quotes file from another research head (one byte changed) is red', () => {
    const q = readFileSync('docs/research/howto/quotes/cable_crunch.json', 'utf8');
    expect(sha(q.replace('"', ' "'))).not.toBe(cardsSha.quotes.cable_crunch);
  });
  it('plank, crunch and the 5 SUPCORE T ids are not copied here', () => {
    for (const id of NOT_HERE) expect(Object.keys(cardsSha.cards), id).not.toContain(id);
  });
  it('research/validate.mjs validateCardFile: no problem on the 8 copies (no machine keys yet)', async () => {
    const v = await import(/* @vite-ignore */ new URL('../../tools/plates/library/research/validate.mjs', import.meta.url).href);
    for (const id of LB9) expect(v.validateCardFile(`${id}.json`), id).toEqual([]);
  });
});

describe('LIB-21 A5 (first push): rows.json holds no row before a spec is drawn; tempo.json is the proposed map', () => {
  const rows = readJson('tools/plates/library/lb9/rows.json'), t = readJson('tools/plates/library/lb9/tempo.json');
  it('batch LB9, censusRef 4a9fd86; no plank, crunch, T or (b) id in any LB9 rows or tempo file', () => {
    expect(rows.batch).toBe('LB9');
    expect(rows.censusRef).toBe('4a9fd86');
    for (const id of [...NOT_HERE, 'side_plank', 'russian_twist', 'bicycle_crunch']) {
      expect(Object.keys(rows.rows), id).not.toContain(`lib_${id}`);
      expect(Object.keys(t.rows), id).not.toContain(id);
    }
  });
  it('A7: each (a) tempo row reads only from plate.tempo (no constants), with Hold only where pause > 0', () => {
    for (const [id, phases] of Object.entries<any[]>(t.rows)) {
      const pt = readJson(`docs/research/howto/cards/${id}.json`).plate.tempo;
      for (const p of phases) expect(['up', 'down', 'pause'], `${id} ${p.phase}`).toContain(p.from);
      expect(phases.some(p => p.from === 'pause'), id).toBe(pt.pause > 0);
    }
  });
});
