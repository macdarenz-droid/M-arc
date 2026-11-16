// F-GENCHECK-SHARE: the five lane "generate --check is green" tests (lb4, lb7, lb8, lb9, lb10 A9) read the run's one
// render of the repo through tests/walk-cache.ts renderFileOf() instead of each rendering it again.
// - G2 pins: each A9 body is main 505ea13a's body with only the 'out =' line changed and the renderFileOf line added
//   (lb4, lb7, lb8 swap their two comment lines for one comment and that line); the describe line holding the timeout
//   is unchanged; lb7 keeps its line count (the worker-lag EXC lines pin lb7:62, :2014, :2024, :2038).
// - G3: renderFileOf's file is the stored render: it decodes equal to renderOf and to a fresh render() in a child (a
//   small tree), a changed tree gets its own render, and it throws outside a run or when the tree changed mid-render.
// - m3: each lane's script, built from its own source, runs on planted copies of the shared JSON and goes red.
import { execFile } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { afterAll, describe, expect, it } from 'vitest';
import { CACHE_ENV, renderFileOf, renderOf } from '../walk-cache';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 600_000;   // as the lane files: the first caller of the run's render may compute it
const ROOT = new URL('../../', import.meta.url).pathname;
const LANES = ['lb4', 'lb7', 'lb8', 'lb9', 'lb10'] as const;
type Lane = typeof LANES[number];
const run = promisify(execFile);
const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const tmp = (p: string) => { const d = mkdtempSync(join(tmpdir(), p)); tmps.push(d); return d; };

/** main 505ea13a's A9 describe line and body (from the it( line to its closing line), read once at PLAN with git show. */
const MAIN: Record<Lane, { describe: string; body: string[]; lines?: number }> = {
  lb4: {"describe": "describe('LIB-14 A9: nothing ships (D-LIB14-AHEAD)', { timeout: T }, () => {", "body": ["  it('generate --check is green, and no generated file is read from lb4/, the LB4 specs, the wall composer or How-to sources (awaited child process)', async () => {", "    // F-VITEST-RPC (#358 6552271304, the D-LIB13S-RPC form): generate's render runs in an awaited child process; the", "    // same two checks per output, reported as one problem list.", "    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});", "const ids = ${JSON.stringify(LB4)}, out = await gen.render(), bad = [];", "for (const [p, { text }] of out) { if (/library\\\\/lb4\\\\/|eq\\\\/wall\\\\.mjs/.test(text)) bad.push(p + ': lb4/ or eq/wall.mjs');", "  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\\\\\b').test(text)) bad.push(p + ': ' + id); }", "console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;", "    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });", "    const r = JSON.parse(stdout.trim().split('\\n').pop()!);", "    console.log(`LIB-14 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);", "    expect(r.n).toBeGreaterThan(0);", "    expect(r.diff).toEqual([]);", "    expect(r.bad).toEqual([]);", "  });"]},
  lb7: {"describe": "describe('LIB-17 A9: nothing ships (D-LIB17-AHEAD)', { timeout: T }, () => {", "body": ["  it('generate --check is green, and no generated file is read from lb7/, the LB7 specs, dipBars or How-to sources', async () => {", "    // In a child process, awaited (VITEST-RPC ruling A, #276): an in-process render blocks the worker past vitest's 60 s", "    // RPC limit on a loaded runner. The child prints the diff and, per output, whether it names an LB7 path.", "    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});", "const ids = ${JSON.stringify(LB7)}, out = await gen.render(), bad = [];", "for (const [p, { text }] of out) { if (/library\\\\/lb7\\\\/|eq\\\\/dipBars\\\\.mjs/.test(text)) bad.push(p + ': lb7/ or dipBars');", "  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\\\\\b').test(text)) bad.push(p + ': ' + id); }", "console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;", "    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });", "    const r = JSON.parse(stdout.trim().split('\\n').pop()!);", "    console.log(`LIB-17 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);", "    expect(r.n).toBeGreaterThan(0);", "    expect(r.diff).toEqual([]);", "    expect(r.bad).toEqual([]);", "  });"], "lines": 2356},
  lb8: {"describe": "describe('LIB-18 A9: nothing ships (D-LIB18-AHEAD)', { timeout: T }, () => {", "body": ["  it('generate --check is green, and no generated file is read from lb8/, the LB8 specs, composers or How-to sources', async () => {", "    // In a child process, awaited (VITEST-RPC ruling A, #276): an in-process render blocks the worker past vitest's 60 s", "    // RPC limit on a loaded runner. The child prints the diff and, per output, whether it names an LB8 path.", "    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});", "const ids = ${JSON.stringify(LB8)}, out = await gen.render(), bad = [];", "for (const [p, { text }] of out) { if (/library\\\\/lb8\\\\/|eq\\\\/(hackSled|pendulum|legExtMachine|calfMachine|ankleCuff)\\\\.mjs/.test(text)) bad.push(p + ': lb8/ or an LB8 composer');", "  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\\\\\b').test(text)) bad.push(p + ': ' + id); }", "console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;", "    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });", "    const r = JSON.parse(stdout.trim().split('\\n').pop()!);", "    console.log(`LIB-18 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);", "    expect(r.n).toBeGreaterThan(0);", "    expect(r.diff).toEqual([]);", "    expect(r.bad).toEqual([]);", "  });"]},
  lb9: {"describe": "describe('LIB-21 A9 (D-LIB21-AHEAD): the rows never ship; generate is unchanged', { timeout: T }, () => {", "body": ["  it('generate --check is green, and no generated file reads lb9/, the LB9 specs, composers or How-to sources (awaited child process)', async () => {", "    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});", "const ids = ${JSON.stringify(LB9)}, out = await gen.render(), bad = [];", "for (const [p, { text }] of out) { if (/library\\\\/lb9\\\\/|eq\\\\/(abWheel|medBallOptional)\\\\.mjs/.test(text)) bad.push(p + ': lb9/ or an LB9 composer');", "  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\\\\\b').test(text)) bad.push(p + ': ' + id); }", "console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;", "    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });", "    const r = JSON.parse(stdout.trim().split('\\n').pop()!);", "    console.log(`LIB-21 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);", "    expect(r.n).toBeGreaterThan(0);", "    expect(r.diff).toEqual([]);", "    expect(r.bad).toEqual([]);", "  });"]},
  lb10: {"describe": "describe('LIB-22 A9 (D-LIB22-AHEAD): the rows never ship; generate is unchanged', { timeout: T }, () => {", "body": ["  it('generate --check is green, and no generated file reads lb10/, the LB10 specs, composers or How-to sources (awaited child process)', async () => {", "    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});", "const ids = ${JSON.stringify(LB10)}, out = await gen.render(), bad = [];", "for (const [p, { text }] of out) { if (/library\\\\/lb10\\\\/|eq\\\\/(kettlebell|medBall|sled|jumpRope)\\\\.mjs/.test(text)) bad.push(p + ': lb10/ or an LB10 composer');", "  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\\\\\b').test(text)) bad.push(p + ': ' + id); }", "console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;", "    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });", "    const r = JSON.parse(stdout.trim().split('\\n').pop()!);", "    console.log(`LIB-22 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);", "    expect(r.n).toBeGreaterThan(0);", "    expect(r.diff).toEqual([]);", "    expect(r.bad).toEqual([]);", "  });"]},
};
const CMT = "    // F-GENCHECK-SHARE: the awaited child reads the run's one render of the repo (tests/walk-cache.ts) and checks it.";
const FILE = "    const file = await (await import('../walk-cache')).renderFileOf(new URL('../../', import.meta.url).pathname);";
const OLD_OUT = 'out = await gen.render()';
const NEW_OUT = "out = new Map(JSON.parse((await import('node:fs')).readFileSync(${JSON.stringify(file)}, 'utf8')))";

/** The body the lane must have: main's, with only the ruled lines changed (D-GCS-FORM). */
const expectedBody = (lane: Lane): string[] => {
  const [itLine, ...rest] = MAIN[lane].body;
  const tail = lane === 'lb9' || lane === 'lb10' ? [FILE, ...rest] : [CMT, FILE, ...rest.slice(2)];
  return [itLine!, ...tail.map(l => (l.includes(OLD_OUT) ? l.replace(OLD_OUT, NEW_OUT) : l))];
};
const bodyOf = (text: string, itLine: string): string[] | null => {
  const L = text.split('\n'), i = L.indexOf(itLine);
  if (i < 0) return null;
  const e = L.indexOf('  });', i);
  return e < 0 ? null : L.slice(i, e + 1);
};
/** G2's problems for one lane file's text (empty when it holds the ruled form). */
export function pinProblems(lane: Lane, text: string): string[] {
  const m = MAIN[lane], bad: string[] = [], body = bodyOf(text, m.body[0]!);
  if (!body) return [`${lane}: no A9 test named as on main`];
  const want = expectedBody(lane), joined = body.join('\n');
  if (joined !== want.join('\n')) bad.push(`${lane}: the A9 body is not main's with only the ruled lines changed`);
  if (joined.split('renderFileOf(').length !== 2) bad.push(`${lane}: the A9 body does not call renderFileOf( exactly once`);
  if (/gen\.render\(/.test(joined)) bad.push(`${lane}: the A9 script still calls gen.render()`);
  if (text.split('\n').filter(l => l === m.describe).length !== 1) bad.push(`${lane}: the A9 describe line (its timeout) changed`);
  if (m.lines !== undefined && text.split('\n').length - 1 !== m.lines) bad.push(`${lane}: ${text.split('\n').length - 1} lines, main has ${m.lines}`);
  return bad;
}
const laneText = (lane: Lane) => readFileSync(join(ROOT, `tests/howto/${lane}-plates.test.ts`), 'utf8');

describe('F-GENCHECK-SHARE G2: the five lane A9 tests read the shared render, every check byte-equal to main', () => {
  it.each(LANES)('%s: only the out line and the renderFileOf line changed', lane => {
    expect(pinProblems(lane, laneText(lane))).toEqual([]);
  });
  it('m4: a lane body put back to gen.render(), or any other A9 line changed, is red', () => {
    for (const lane of LANES) {
      const text = laneText(lane);
      expect(pinProblems(lane, text.replace(NEW_OUT, OLD_OUT)).join('\n'), lane).toMatch(/still calls gen\.render|exactly once|ruled lines/);
      expect(pinProblems(lane, text.replace('expect(r.diff).toEqual([]);', 'expect(r.diff).toBeDefined();')), lane).not.toEqual([]);
      expect(pinProblems(lane, text.replace(MAIN[lane].describe, MAIN[lane].describe.replace('{ timeout: T }', '{ timeout: 2 * T }'))), lane).not.toEqual([]);
    }
    expect(pinProblems('lb7', laneText('lb7').replace(CMT + '\n', ''))).toContain('lb7: ' + (MAIN.lb7.lines! - 1) + ' lines, main has ' + MAIN.lb7.lines);
  });
});

/** A small tree whose tools/plates/generate.mjs render() maps one output to input.txt's text; 'touch' makes it write
 *  into its own tree while it renders. */
const toyTree = (input: string) => {
  const d = tmp('gcs-tree-');
  mkdirSync(join(d, 'tools/plates'), { recursive: true });
  writeFileSync(join(d, 'input.txt'), input);
  writeFileSync(join(d, 'tools/plates/generate.mjs'), `import { readFileSync, writeFileSync } from 'node:fs';
export async function render() {
  const v = readFileSync(new URL('../../input.txt', import.meta.url), 'utf8');
  if (v === 'touch') writeFileSync(new URL('../../touched.txt', import.meta.url), String(process.pid));
  return new Map([['out/a.ts', { text: '// header\\n' + v, writers: ['tools/plates/gen/w.mjs'], hash: 'h-' + v }], ['out/b.ts', { text: 'b', writers: [], hash: '' }]]);
}`);
  return d;
};
const decode = (file: string) => new Map(JSON.parse(readFileSync(file, 'utf8')));
const freshRender = async (root: string) => {
  const { stdout } = await run(process.execPath, ['--input-type=module', '-e', "const { render } = await import('./tools/plates/generate.mjs'); console.log(JSON.stringify([...(await render())]));"], { cwd: root, encoding: 'utf8' });
  return new Map(JSON.parse(stdout.trim()));
};

describe('F-GENCHECK-SHARE G3: renderFileOf returns the stored render of the tree as it is now', () => {
  it('a small tree: the file decodes equal to a fresh render() in a child, and to renderOf', async () => {
    const d = toyTree('one'), file = await renderFileOf(d);
    expect(decode(file)).toEqual(await freshRender(d));
    expect(decode(file)).toEqual(await renderOf(d));
    expect(await renderFileOf(d)).toBe(file);   // the same tree: the same stored file, no second render
  });
  it('m1: a byte changed in the tree is a new render and a new file, never the old one', async () => {
    const d = toyTree('one'), first = await renderFileOf(d);
    writeFileSync(join(d, 'input.txt'), 'onf');
    const second = await renderFileOf(d);
    expect(second).not.toBe(first);
    expect((decode(second).get('out/a.ts') as any).text).toBe('// header\n' + 'onf');
    expect(decode(second)).toEqual(await freshRender(d));
  });
  it('a tree that changes while it renders has no stored render: it throws, naming the cause', async () => {
    await expect(renderFileOf(toyTree('touch'))).rejects.toThrow(/no stored render of .*the tree changed while or after it rendered/);
  });
  it('m2: outside a vitest run (no MARC_WALK_CACHE) it throws, naming the cause, and renders nothing', async () => {
    const d = toyTree('touch'), old = process.env[CACHE_ENV];
    delete process.env[CACHE_ENV];
    try { await expect(renderFileOf(d)).rejects.toThrow(/outside a vitest run: MARC_WALK_CACHE is not set/); } finally { process.env[CACHE_ENV] = old; }
    expect(() => readFileSync(join(d, 'touched.txt'))).toThrow();   // render() never ran
  });
  it('the repo: the shared file decodes equal to renderOf(ROOT), and holds every output', async () => {
    const file = await renderFileOf(ROOT), out = await renderOf(ROOT);
    expect(decode(file)).toEqual(out);
    expect(out.size).toBeGreaterThan(400);
  }, T);
});

/** The lane's child script exactly as its A9 test builds it: the template text from its source, evaluated with the
 *  lane's id list, its file URL and the given render file. */
const laneScript = (lane: Lane, file: string): string => {
  const text = laneText(lane), body = bodyOf(text, MAIN[lane].body[0]!)!.join('\n');
  const tpl = body.slice(body.indexOf('const script = `') + 'const script = `'.length, body.indexOf('`;\n'));
  const name = `LB${lane.slice(2)}`, a = text.indexOf(`const ${name} = [`);
  const ids = new Function(`return ${text.slice(a + `const ${name} = `.length, text.indexOf('];', a) + 1)}`)();
  const meta = new URL(`tests/howto/${lane}-plates.test.ts`, `file://${ROOT.endsWith('/') ? ROOT : ROOT + '/'}`).href;
  return new Function(name, 'file', '__meta', `return \`${tpl.replaceAll('import.meta.url', '__meta')}\`;`)(ids, file, meta);
};
const runLane = async (lane: Lane, file: string) => {
  const { stdout } = await run(process.execPath, ['--input-type=module', '-e', laneScript(lane, file)], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26 });
  return JSON.parse(stdout.trim().split('\n').pop()!) as { diff: { path: string; why: string }[]; bad: string[]; n: number };
};
const LANE_PATH: Record<Lane, string> = { lb4: 'tools/plates/library/lb4/x.mjs', lb7: 'tools/plates/library/lb7/x.mjs', lb8: 'tools/plates/library/lb8/x.mjs', lb9: 'tools/plates/library/lb9/x.mjs', lb10: 'tools/plates/library/lb10/x.mjs' };

describe('F-GENCHECK-SHARE m3: each lane\'s unchanged script goes red on a planted copy of the shared render', () => {
  it.each(LANES)('%s: green on the shared file; red on a lane path, a changed byte and a removed output', async lane => {
    const shared = await renderFileOf(ROOT), entries: [string, any][] = JSON.parse(readFileSync(shared, 'utf8'));
    const d = tmp('gcs-plant-'), plant = (name: string, e: [string, any][]) => { const f = join(d, name); writeFileSync(f, JSON.stringify(e)); return f; };
    const [p, v] = entries[0]!;
    const green = await runLane(lane, shared);
    expect(green).toEqual({ diff: [], bad: [], n: entries.length });
    const a = await runLane(lane, plant('a.json', [[p, { ...v, text: v.text + '\n// ' + LANE_PATH[lane] }], ...entries.slice(1)]));
    expect(a.bad.length, JSON.stringify(a.bad)).toBeGreaterThan(0);
    expect(a.bad.every(b => b.startsWith(p + ': '))).toBe(true);
    const b = await runLane(lane, plant('b.json', [[p, { ...v, text: v.text.slice(0, -1) + (v.text.endsWith('x') ? 'y' : 'x') }], ...entries.slice(1)]));
    expect(b).toEqual({ diff: [{ path: p, why: 'differs' }], bad: [], n: entries.length });
    const c = await runLane(lane, plant('c.json', entries.slice(1)));
    expect(c).toEqual({ diff: [{ path: p, why: 'stale: no plugin writes it' }], bad: [], n: entries.length - 1 });
  }, T);
});
