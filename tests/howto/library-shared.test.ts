// LIB-5: the shared layer modules (D-LIB5-*; docs/howto/library/LIB-5-DESIGN.md). S4-P: the back box fails closed
// until the owner answers decision 6 (back-box.mjs, library-gate.mjs, check-bundle.mjs on temp folders written at run
// time from the copied card, and E1's row in a per-case copy of E1's tree, D-LIB5-FIXTURE).
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';
import type { RiskJoint } from '../../src/howto/content-types';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const SCRIPT = new URL('../../tools/plates/library/shared/check-bundle.mjs', import.meta.url).pathname;
/* eslint-disable @typescript-eslint/no-explicit-any */
let B: any;
const temps: string[] = [];
beforeAll(async () => { B = await import(/* @vite-ignore */ url('tools/plates/library/shared/check-bundle.mjs')); });
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

/** A built-like folder: index.html, sw.js and an assets/ HowToSheet chunk, plus `extra` file -> text. */
function folder({ chunk = true, extra = {} as Record<string, string> } = {}) {
  const d = mkdtempSync(join(tmpdir(), 'lib5-bundle-'));
  temps.push(d);
  mkdirSync(join(d, 'assets'));
  writeFileSync(join(d, 'index.html'), '<!doctype html><title>M/ARC</title>');
  writeFileSync(join(d, 'sw.js'), 'self.addEventListener("fetch", () => {});');
  if (chunk) writeFileSync(join(d, 'assets', 'HowToSheet-AbCd1234.js'), 'export const x = "Wrist pain";');
  for (const [p, t] of Object.entries(extra)) { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), t); }
  return d;
}
const run = (dir: string) => spawnSync(process.execPath, [SCRIPT, dir], { encoding: 'utf8' });

describe('LIB-5 S4-P: check-bundle.mjs (D-LIB5-BUNDLE)', () => {
  it('reads the three whole box values from the copied card', () => {
    const v = B.boxValues();
    expect(Object.keys(v)).toEqual(['name', 'now', 'doctor']);
    for (const t of Object.values(v)) expect(typeof t === 'string' && (t as string).length > 0).toBe(true);
  });
  it('a clean folder passes (exit 0)', () => {
    const r = run(folder());
    expect([r.status, r.stderr]).toEqual([0, '']);
  });
  for (const f of ['name', 'now', 'doctor']) {
    it(`mutation: box.${f}.text planted in a shipped file -> exit 1, naming that field`, () => {
      const r = run(folder({ extra: { 'assets/index-Zz9.js': `const a = ${JSON.stringify(B.boxValues()[f])};` } }));
      expect(r.status).toBe(1);
      expect(r.stderr).toContain(`assets/index-Zz9.js: holds box.${f}.text`);
      expect(r.stderr.match(/holds box\./g)).toHaveLength(1);
    });
  }
  it('mutation: no HowToSheet chunk -> exit 1', () => {
    const r = run(folder({ chunk: false }));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('no assets/HowToSheet-*.js chunk');
  });
  it('a value in any file under the folder counts (index.html, sw.js, nested)', () => {
    const v = B.boxValues();
    expect(B.bundleProblems(folder({ extra: { 'index.html': v.doctor, 'nested/deep/m.json': v.now } }), v).sort())
      .toEqual(['index.html: holds box.doctor.text', 'nested/deep/m.json: holds box.now.text']);
  });
});

const ROOT = new URL('../../', import.meta.url).pathname;
const BOX = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/shared/back-pain-box.json'), 'utf8'));
const VALUES: Record<string, string> = { name: BOX.box.name.text, now: BOX.box.now.text, doctor: BOX.box.doctor.text };
const walkFiles = (d: string): string[] => readdirSync(d).flatMap(n => { const p = join(d, n); return statSync(p).isDirectory() ? walkFiles(p) : [p]; });

/** Runs `node <args>` in `cwd`; resolves { code, out } (stdout + stderr), as library-rows.test.ts does. */
const node = (cwd: string, args: string[]) => new Promise<{ code: number; out: string }>(resolve => {
  const c = spawn(process.execPath, args, { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', code => resolve({ code: code ?? 1, out }));
});

describe('LIB-5 S4-P: the back box fails closed (D-LIB5-BOX)', () => {
  const MOD = join(ROOT, 'tools/plates/library/shared/back-box.mjs');
  it('1. back-box.mjs holds no box text and backBox() throws the exact message', async () => {
    const src = readFileSync(MOD, 'utf8');
    for (const [f, v] of Object.entries(VALUES)) expect([f, src.includes(v)]).toEqual([f, false]);
    expect(src).not.toMatch(/back-pain-box\.json|readFileSync|\bnow\s*:|\bdoctor\s*:/);
    const M = await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs'));
    expect(M.BACK_BOX_WAITS).toBe('LIB-5: back box waits for owner decision 6 (plan 8 item 6)');
    expect(() => M.backBox()).toThrow(/^LIB-5: back box waits for owner decision 6 \(plan 8 item 6\)$/);
    expect(() => M.refuseBack('lib_x', ['wrist', 'back'])).toThrow('lib_x: LIB-5: back box waits for owner decision 6 (plan 8 item 6)');
    expect(() => M.refuseBack('lib_x', ['wrist', 'shoulder'])).not.toThrow();
  });
  it('2. none of the three whole box values appears in any file under src/ (0 hits on main 49a2853, recorded on #244)', () => {
    const files = walkFiles(join(ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const hits = files.flatMap(f => { const t = readFileSync(f, 'utf8'); return Object.entries(VALUES).filter(([, v]) => t.includes(v)).map(([k]) => `${f.slice(ROOT.length)}: box.${k}.text`); });
    expect(hits).toEqual([]);
  });
  it('4. RiskJoint has no back yet', () => {
    // @ts-expect-error RiskJoint gains 'back' only in Do 9, with the answered box (S4-P)
    const back: RiskJoint = 'back';
    expect(back).toBe('back');
    expect(readFileSync(join(ROOT, 'src/howto/content-types.ts'), 'utf8')).toMatch(/export type RiskJoint = 'wrist' \| 'shoulder' \| 'knee' \| 'elbow';/);
  });
  it('5. guard: box text in back-box.mjs needs D-LIB5-BACKBOX and a settled card whose box it equals', async () => {
    const M = await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs'));
    let block: any = null;
    try { block = M.backBox(); } catch { /* the placeholder */ }
    if (block === null) return;
    expect(readFileSync(join(ROOT, 'docs/COACHING-DECISIONS.md'), 'utf8')).toContain('D-LIB5-BACKBOX');
    expect(BOX.status).not.toBe('draft');
    expect([block.name, block.now, block.doctor]).toEqual([VALUES.name, VALUES.now, VALUES.doctor]);
  });
});

describe('LIB-5 S4-P 3: E1\'s row with back in its riskFlags makes the generator throw (D-LIB5-FIXTURE)', () => {
  const T = 900_000;
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = F.fixtureTree(); temps.push(tree);
  }, T);
  /** A per-case copy of E1's tree with one exact-once replacement in its How-to. */
  const copyWith = (from: string, to: string) => {
    const r = mkdtempSync(join(tmpdir(), 'lib5-e1-')); temps.push(r);
    cpSync(tree, r, { recursive: true, verbatimSymlinks: true });
    const p = join(r, F.HOWTO), s = readFileSync(p, 'utf8');
    if (s.split(from).length !== 2) throw new Error(`lib5 fixture: ${from} is not in ${F.HOWTO} exactly once`);
    writeFileSync(p, s.replace(from, to));
    return r;
  };
  it('riskFlags gains back -> exactly the placeholder message, naming lib_cable_lateral_raise', async () => {
    const r = copyWith("riskFlags: ['wrist', 'shoulder', 'elbow']", "riskFlags: ['wrist', 'shoulder', 'elbow', 'back']");
    const g = await node(r, ['tools/plates/generate.mjs']);
    expect(g.code).not.toBe(0);
    expect(g.out).toContain('Error: lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)');
  }, T);
  it('control: the unedited tree generates, and with its card removed QA refuses first (PQ-H6)', async () => {
    const ok = await node(tree, ['tools/plates/generate.mjs']);
    expect([ok.code, ok.out.slice(-400)]).toEqual([0, expect.stringContaining('generate: wrote')]);
    const r = copyWith("riskFlags: ['wrist', 'shoulder', 'elbow']", "riskFlags: ['wrist', 'shoulder', 'elbow', 'back']");
    rmSync(join(r, F.CARD_FILE));
    const g = await node(r, ['tools/plates/generate.mjs']);
    expect(g.code).not.toBe(0);
    expect(g.out).toMatch(/plate QA refused lib_cable_lateral_raise:[\s\S]*PQ-H6/);
    expect(existsSync(join(r, 'src/howto/red-flag-back.ts'))).toBe(false);
  }, T);
});

describe('LIB-5 D-LIB5-GATE: library-gate.mjs writes nothing before Do 9 and stays inside C17', () => {
  const GATE = 'tools/plates/gen/library-gate.mjs', SHARED_DIR = join(ROOT, 'tools/plates/library/shared');
  /** Paths render() attributes to the gate, and other files whose header names it. */
  const gatePaths = (out: Map<string, any>) => [...out].filter(([, o]) => o.writers.includes(GATE)).map(([p]) => p).sort();
  it('render(): the paths attributed to library-gate.mjs are exactly [] while back-box.mjs holds no box text', async () => {
    const out = await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render();
    expect(gatePaths(out)).toEqual([]);
    expect([...out].filter(([, o]) => o.text.slice(0, 600).includes('library-gate')).map(([p]) => p)).toEqual([]);
  }, 300_000);
  it('inputsFor(red-flag-back.ts) is back-box.mjs, its static imports and the back-box card', async () => {
    const G = await import(/* @vite-ignore */ url(GATE));
    const imports = [...readFileSync(join(SHARED_DIR, 'back-box.mjs'), 'utf8').matchAll(/^import .* from '([^']+)';$/gm)].map(m => m[1]);
    expect(imports).toEqual([]);
    expect(G.inputsFor('src/howto/red-flag-back.ts')).toEqual(['tools/plates/library/shared/back-box.mjs', 'docs/research/howto/shared/back-pain-box.json']);
    expect(G.inputsFor('src/howto/ids.ts')).toBeUndefined();
    expect(G.after).toEqual(['tools/plates/gen/content.mjs']);
    for (const f of [GATE, 'tools/plates/library/shared/back-box.mjs']) expect(G.inputs()).toContain(f);
  });
  /** Two directories for checkC17 (it takes directories and skips a path it cannot read): the shared modules, and a
   *  temp copy of library-gate.mjs. */
  const c17Dirs = (plant?: 'gate' | 'shared') => {
    const g = mkdtempSync(join(tmpdir(), 'lib5-c17-gate-')), s = mkdtempSync(join(tmpdir(), 'lib5-c17-shared-'));
    temps.push(g, s);
    cpSync(join(ROOT, GATE), join(g, 'library-gate.mjs'));
    cpSync(SHARED_DIR, s, { recursive: true });
    if (plant === 'gate') writeFileSync(join(g, 'library-gate.mjs'), readFileSync(join(g, 'library-gate.mjs'), 'utf8') + '\nfetch("x");\n');
    if (plant === 'shared') writeFileSync(join(s, 'back-box.mjs'), readFileSync(join(s, 'back-box.mjs'), 'utf8') + '\nfetch("x");\n');
    return [g, s] as [string, string];
  };
  it('checkC17 on the shared modules and the gate: [] and each folder holds its file; a planted fetch( is red in either', async () => {
    const { checkC17 } = await import('./checks/c17');
    expect(checkC17([SHARED_DIR])).toEqual([]);
    const [g, s] = c17Dirs();
    expect(readdirSync(g)).toEqual(['library-gate.mjs']);
    expect(readdirSync(s)).toEqual(expect.arrayContaining(['back-box.mjs', 'check-bundle.mjs']));
    expect(checkC17([g, s])).toEqual([]);
    expect(checkC17(c17Dirs('gate'))).toEqual([expect.stringMatching(/library-gate\.mjs: matches/)]);
    expect(checkC17(c17Dirs('shared'))).toEqual([expect.stringMatching(/back-box\.mjs: matches/)]);
  });
});
