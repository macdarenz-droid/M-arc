// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 4.3): E1 the block list is generated from the gate file and every
// top-level statement is guarded; E2 no group couples to another through module scope (R1-R5); E3 every job
// selection is a partition of the groups; E4 each job reaches exactly its plan; E7 stripping the GATE-SPLIT lines
// gives a file with no guard left. Each rule has its mutation here, shown red.
import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

type Group = { key: string; statements: unknown[]; line: number };
let B: {
  GATE_FILE: string; ALWAYS: Set<string>; REPLAYED: { group: string; path: string }[];
  parseGate: (src: string) => { groups: Group[]; problems: string[] };
  couplingProblems: (src: string) => string[];
  stripGate: (src: string) => string;
};
let G: {
  gateSplit: (o: { errors: string[]; OUT: string; browser: null; file: string; env: Record<string, string | undefined> }) => { runs: (k: string) => boolean; done: () => Promise<void> };
  planFor: (keys: string[], times: unknown, K: number, tz: string) => string[][];
};
let S: {
  packShards: (items: { id: string; seconds: number }[], K: number, offsets?: number[]) => string[][];
  jobFromEnv: (name: string, env: Record<string, string | undefined>) => { k?: number; N?: number };
  shardFromEnv: (env: Record<string, string | undefined>) => { k?: number; N?: number };
};
let SRC = '';
let TIMES: { K: number; offsets: Record<string, number>; default: number; seconds: Record<string, number> };
beforeAll(async () => {
  B = await import(/* @vite-ignore */ new URL('../scripts/gate-blocks.mjs', import.meta.url).href);
  G = await import(/* @vite-ignore */ new URL('../scripts/gate-split.mjs', import.meta.url).href);
  S = await import(/* @vite-ignore */ new URL('../tools/plates/fidelity/shard.mjs', import.meta.url).href);
  SRC = readFileSync(B.GATE_FILE, 'utf8');
  TIMES = JSON.parse(readFileSync(new URL('../scripts/gate-times.json', import.meta.url), 'utf8'));
});

/** Inserts `code` as the first line inside group `key`'s first statement (which opens with `{` at its line end). */
const inject = (src: string, key: string, code: string) => {
  const at = src.indexOf(`if (gate.runs('${key}'))\n`);
  if (at < 0) throw new Error(`no group ${key}`);
  const eol = src.indexOf('\n', src.indexOf('\n', at) + 1);
  if (src[eol - 1] !== '{') throw new Error(`group ${key} does not open with {`);
  return `${src.slice(0, eol + 1)}${code}\n${src.slice(eol + 1)}`;
};
const keysOf = (src: string) => B.parseGate(src).groups.map(g => g.key);

describe('E1: generated block list', () => {
  it('every top-level statement of the gate is guarded, keys unique and contiguous, and the count is asserted', () => {
    const { groups, problems } = B.parseGate(SRC);
    expect(problems).toEqual([]);
    const guards = SRC.split('\n').filter(l => /^if \(gate\.runs\('[^']+'\)\)$/.test(l)).length;
    expect(groups.reduce((a, g) => a + g.statements.length, 0)).toBe(guards);   // the syntax tree and the text agree
    expect(new Set(groups.map(g => g.key)).size).toBe(groups.length);
    expect(groups.length).toBe(99);   // the generated count today; adding a block raises it with its own guard
    for (const a of B.ALWAYS) expect(groups.some(g => g.key === a)).toBe(true);
  });
  it('mutation: a block without its guard line is red', () => {
    const src = SRC.replace("if (gate.runs('BUG-12'))\n", '');
    expect(B.parseGate(src).problems.join()).toMatch(/without a guard/);
  });
  it('mutation: a key used again after another group is red', () => {
    const src = SRC.replace("if (gate.runs('BUG-10'))\n", "if (gate.runs('I14'))\n");
    expect(B.parseGate(src).problems.join()).toMatch(/used again/);
  });
  it('mutation: an ALWAYS group that references errors is red', () => {
    const src = inject(SRC, 'HT-10.clock', '  errors.length;');
    expect(B.couplingProblems(src).join()).toMatch(/ALWAYS group HT-10\.clock references `errors`/);
  });
  it('mutation: a guard sharing its line with the statement, or a missing harness line, is red', () => {
    expect(B.parseGate(SRC.replace("if (gate.runs('R2'))\n{", "if (gate.runs('R2')) {")).problems.join()).toMatch(/alone on its own line/);
    expect(B.parseGate(SRC.replace('await gate.done();\n', '')).problems.join()).toMatch(/gate\.done/);
  });
});

describe('E2: module-scope coupling (R1-R5)', () => {
  it('the gate as it is has no coupling problem', () => {
    expect(B.couplingProblems(SRC)).toEqual([]);
  });
  const red: [string, string, string, RegExp][] = [
    ['R1 assignment to a binding declared before errors', 'BUG-12', '  legacy.preferences = {};', /R1: .*BUG-12 assigns to module-scope `legacy.preferences`/],
    ['R2 a mutating call on themes', 'BUG-12', "  themes.push('x');", /R2: .*`themes.push\(\)`/],
    ['R2 a mutating call on completed', 'I14', '  completed.sort();', /R2: .*`completed.sort\(\)`/],
    ['R2 errors.splice outside BASE', 'BUG-12', '  errors.splice(0);', /R2: .*`errors.splice\(\)`/],
    ['R2 Object.assign on a module binding', 'BUG-12', '  Object.assign(legacy, {});', /R2: .*Object\.assign on module-scope `legacy`/],
    ['R3 a second group using the mutated bug22Runs', 'BUG-12', '  bug22Runs.length;', /R3: `bug22Runs` is mutated/],
    ['R5 a process.env write', 'BUG-12', "  process.env.TZ = 'UTC';", /R5: .*writes the global `process.env.TZ`/],
    ['R5 console.log written outside HT-10.clock', 'BUG-12', '  console.log = () => {};', /R5: .*writes the global `console.log`/],
    ['R5 process.chdir', 'BUG-12', "  process.chdir('/');", /R5: .*process\.chdir/],
  ];
  for (const [name, key, code, re] of red) it(`mutation: ${name} is red`, () => {
    expect(B.couplingProblems(inject(SRC, key, code)).join('\n')).toMatch(re);
  });
  it('mutation: R4 unguarded declarations that use errors or await are red', () => {
    const at = SRC.indexOf('const bug22Runs = [];');
    expect(B.couplingProblems(`${SRC.slice(0, at)}const n = errors.length;\n${SRC.slice(at)}`).join()).toMatch(/R4: .*uses `errors`/);
    expect(B.couplingProblems(`${SRC.slice(0, at)}const v = await browser.version();\n${SRC.slice(at)}`).join()).toMatch(/R4: .*uses await/);
  });
  it('mutation: R5 a top-level let after errors is red', () => {
    const at = SRC.indexOf('const bug22Runs = [];');
    expect(B.couplingProblems(`${SRC.slice(0, at)}let x = 0;\n${SRC.slice(at)}`).join()).toMatch(/R5: .*top-level `let`/);
  });
  it('a local binding that shadows a module name is not module scope', () => {
    expect(B.couplingProblems(inject(SRC, 'BUG-12', '  { const themes = []; themes.push(1); let i = 0; i++; }'))).toEqual([]);
  });
  it('REPLAYED lists exactly the global writes the gate makes, and dropping one is red', () => {
    const saved = B.REPLAYED.splice(0);
    try {
      const p = B.couplingProblems(SRC);
      expect(p.length).toBe(saved.length);
      for (const r of saved) expect(p.join()).toContain(`group ${r.group} writes the global \`${r.path}\``);
    } finally { B.REPLAYED.push(...saved); }
  });
});

describe('E3: job selection is a partition', () => {
  it('packShards: for K = 1..16, with and without an offset, every group lands in exactly one job', () => {
    const items = keysOf(SRC).filter(k => !B.ALWAYS.has(k)).map(id => ({ id, seconds: TIMES.seconds[id] ?? TIMES.default }));
    for (let K = 1; K <= 16; K++) for (const off of [[], [200]]) {
      const jobs = S.packShards(items, K, off);
      expect(jobs.length).toBe(K);
      expect(jobs.flat().sort()).toEqual(items.map(i => i.id).sort());
      expect(new Set(jobs.flat()).size).toBe(items.length);
    }
    expect(() => S.packShards([{ id: 'a', seconds: 1 }, { id: 'a', seconds: 2 }], 2)).toThrow(/duplicate/);
  });
  it('jobFromEnv: unset and empty run everything, 1-based k/N, malformed throws; shardFromEnv is the same parser', () => {
    expect(S.jobFromEnv('MARC_GATE_JOB', {})).toEqual({});
    expect(S.jobFromEnv('MARC_GATE_JOB', { MARC_GATE_JOB: '' })).toEqual({});
    expect(S.jobFromEnv('MARC_GATE_JOB', { MARC_GATE_JOB: '1/1' })).toEqual({ k: 0, N: 1 });
    expect(S.jobFromEnv('MARC_GATE_JOB', { MARC_GATE_JOB: '3/3' })).toEqual({ k: 2, N: 3 });
    for (const bad of ['0/3', '4/3', '1/0', '2', 'a/b']) expect(() => S.jobFromEnv('MARC_GATE_JOB', { MARC_GATE_JOB: bad })).toThrow(/k\/N/);
    for (const v of ['1/2', '2/2', '']) expect(S.jobFromEnv('MARC_HT_SHARD', { MARC_HT_SHARD: v })).toEqual(S.shardFromEnv({ MARC_HT_SHARD: v }));
  });

  let dirs: string[] = [];
  afterEach(() => { for (const d of dirs) rmSync(d, { recursive: true, force: true }); dirs = []; delete process.env.HT3_DUMP; });
  /** Drives gateSplit through every guard in file order, as the gate does; returns the groups it ran and the proof name. */
  const drive = async (env: Record<string, string | undefined>, skip: string[] = []) => {
    const OUT = mkdtempSync(join(tmpdir(), 'gate-split-')); dirs.push(OUT);
    const errors: string[] = [];
    const gate = G.gateSplit({ errors, OUT, browser: null, file: B.GATE_FILE, env: { GITHUB_SHA: 'a'.repeat(40), ...env } });
    const ran: string[] = [];
    for (const k of keysOf(SRC)) if (!skip.includes(k) && gate.runs(k)) ran.push(k);
    await gate.done();
    return { ran, errors, proof: readdirSync(OUT).filter(f => f.startsWith('gate-proof-')), OUT };
  };
  it('unset, empty and 1/1 each run every group and write -1of1; K = 3 jobs are disjoint and cover every group', async () => {
    const all = keysOf(SRC);
    for (const v of [undefined, '', '1/1']) {
      const r = await drive({ MARC_GATE_JOB: v, TZ: 'UTC' });
      expect(r.ran).toEqual(all);
      expect(r.proof).toEqual(['gate-proof-utc-1of1.json']);
      expect(r.errors).toEqual([]);
    }
    for (const tz of ['UTC', 'Pacific/Auckland']) {
      const runs = [];
      for (let k = 1; k <= 3; k++) runs.push(await drive({ MARC_GATE_JOB: `${k}/3`, TZ: tz }));
      const checked = runs.flatMap(r => r.ran.filter(x => !B.ALWAYS.has(x)));
      expect(checked.sort()).toEqual(all.filter(x => !B.ALWAYS.has(x)).sort());
      expect(new Set(checked).size).toBe(checked.length);
      for (const r of runs) for (const a of B.ALWAYS) expect(r.ran).toContain(a);
      expect(runs.map(r => r.proof[0])).toEqual([1, 2, 3].map(k => `gate-proof-${tz === 'UTC' ? 'utc' : 'auckland'}-${k}of3.json`));
    }
  });
  it('E4: a planned group never reached is red in its own job (mutation: one guard skipped)', async () => {
    const r = await drive({ MARC_GATE_JOB: '1/1', TZ: 'UTC' }, ['F8']);
    expect(r.errors.join()).toMatch(/E4: job 1\/1 \(UTC\) never reached planned groups F8/);
  });
  it('the proof holds one gate row per group run, in writeProof format, with the plan and job in meta', async () => {
    const r = await drive({ MARC_GATE_JOB: '2/3', TZ: 'Pacific/Auckland' });
    const m = JSON.parse(readFileSync(join(r.OUT, r.proof[0]!), 'utf8'));
    expect(m.sha).toBe('a'.repeat(40));
    expect(m.shard).toEqual({ k: 1, N: 3 });
    expect(m.meta.job).toEqual({ k: 2, K: 3 });
    expect(m.rows.filter((x: { check: string }) => x.check === 'gate').map((x: { id: string }) => x.id).sort()).toEqual([...r.ran].sort());
    const plan = G.planFor(keysOf(SRC), TIMES, 3, 'Pacific/Auckland')[1];
    expect(r.ran.filter(x => !B.ALWAYS.has(x))).toEqual(plan);
  });
  it('a REPLAYED write is replayed for later groups when its group runs in another job, never when it runs here', async () => {
    const plans = G.planFor(keysOf(SRC), TIMES, 3, 'UTC');
    const holder = plans.findIndex(p => p.includes('HT-3'));
    const other = (holder + 1) % 3;
    const r1 = await drive({ MARC_GATE_JOB: `${other + 1}/3`, TZ: 'UTC' });
    expect(process.env.HT3_DUMP).toBe(join(r1.OUT, 'ht3-diffs'));
    delete process.env.HT3_DUMP;
    await drive({ MARC_GATE_JOB: `${holder + 1}/3`, TZ: 'UTC' });
    expect(process.env.HT3_DUMP).toBeUndefined();   // the block itself sets it when it runs; driving it here runs no body
  });
});

describe('E7: strip', () => {
  it('stripping removes every guard and both harness lines and nothing else', () => {
    const out = B.stripGate(SRC);
    expect(out).not.toMatch(/gate\.runs|gate\.done|gateSplit/);
    expect(SRC.split('\n').length - out.split('\n').length).toBe(B.parseGate(SRC).groups.reduce((a, g) => a + g.statements.length, 0) + 2);
  });
});
