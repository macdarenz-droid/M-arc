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

describe('LIB-5 S6: the built shared modules equal their cards (D-LIB5-SPLIT; foot-bar and selector-pin)', () => {
  const BUILT: Record<string, string> = { 'selector-pin': 'SELECTOR_PIN', 'foot-bar': 'FOOT_BAR' };
  let C: any, MV: any, SL: any, shared: any;
  beforeAll(async () => {
    [C, MV, SL, shared] = await Promise.all(['tools/plates/library/shared/card.mjs', 'tools/plates/library/shared/moves.mjs',
      'tools/plates/library/lint/shared-cards.mjs', 'tools/plates/layers/howto/shared.mjs'].map(p => import(/* @vite-ignore */ url(p))));
  });
  const card = (k: string) => JSON.parse(readFileSync(join(ROOT, `docs/research/howto/shared/${k}.json`), 'utf8'));
  /** The export as read straight from the card JSON, independent of moves.mjs. */
  const expected = (c: any) => {
    const steps = (l: any[]) => l.map(s => ({ kind: s.kind, text: s.text, claim: s.claim }));
    return { card: `shared/${c.key}.json`, appliesTo: c.appliesTo, ...(c.steps ? { setup: steps(c.steps) } : {}),
      ...(c.variants ? { variants: Object.fromEntries(Object.entries(c.variants).map(([v, va]: [string, any]) => [v, { appliesTo: va.appliesTo, setup: steps(va.steps) }])) } : {}) };
  };
  /** Every export key path of a move export (steps by position collapsed), for the pinned list. */
  const keyPaths = (e: any): string[] => [...new Set(Object.entries(e).flatMap(([k, x]: [string, any]) =>
    k === 'setup' ? [k, ...x.flatMap((s: any) => Object.keys(s).map(f => `${k}[].${f}`))]
      : k === 'variants' ? Object.entries(x).flatMap(([v, va]) => keyPaths(va).map(p => `${k}.${v}.${p}`)) : [k]))].sort();
  /** Data fields (card.mjs DATA) among an export's own key paths (a step's keys are pinned above). */
  const dataKeys = (e: any) => keyPaths(e).filter(p => !p.includes('[]') && C.DATA.includes(p.split('.').pop()!.replace('[]', '')));
  /** Step refs that do not resolve to a claim whose sources are all in the card's registry. */
  const refProblems = (c: any, e: any) => [e.setup ?? [], ...Object.values(e.variants ?? {}).map((va: any) => va.setup)].flat()
    .filter((s: any) => { const cl = SL.claimOf(c, s.claim); return !cl || !cl.sources.length || cl.sources.some((x: string) => !c.sources.some((y: any) => y.id === x)); })
    .map((s: any) => s.text);

  it('module === card: each export equals its card\'s fields; a drifted string is red', () => {
    for (const [k, name] of Object.entries(BUILT)) expect([k, MV[name]]).toEqual([k, expected(card(k))]);
    const drift = structuredClone(MV.FOOT_BAR);
    drift.variants.pullover.setup[0].text += ' ';
    expect(drift).not.toEqual(expected(card('foot-bar')));
  });
  it('pinned export keys hold no data field; a data key added to an export is red', () => {
    expect(keyPaths(MV.SELECTOR_PIN)).toEqual(['appliesTo', 'card', 'setup', 'setup[].claim', 'setup[].kind', 'setup[].text']);
    expect(keyPaths(MV.FOOT_BAR)).toEqual(['appliesTo', 'card', ...['chest-press', 'pullover'].flatMap(v =>
      ['appliesTo', 'setup', 'setup[].claim', 'setup[].kind', 'setup[].text'].map(p => `variants.${v}.${p}`))].sort());
    for (const name of Object.values(BUILT)) expect([name, dataKeys(MV[name])]).toEqual([name, []]);
    expect(dataKeys({ ...MV.SELECTOR_PIN, notes: card('selector-pin').notes })).toEqual(['notes']);
    expect(dataKeys({ ...MV.FOOT_BAR, variants: { ...MV.FOOT_BAR.variants, pullover: { ...MV.FOOT_BAR.variants.pullover, gaps: [] } } })).toEqual(['variants.pullover.gaps']);
  });
  it('every claim ref resolves, with its sources in the card\'s registry; a broken ref is red', () => {
    for (const [k, name] of Object.entries(BUILT)) expect([k, refProblems(card(k), MV[name])]).toEqual([k, []]);
    const broken = structuredClone(MV.SELECTOR_PIN);
    broken.setup[2].claim = 'c9';
    expect(refProblems(card('selector-pin'), broken)).toEqual([broken.setup[2].text]);
  });
  it('every shown field passes golden B\'s lint at setup[] (kind setup, SETUP_MAX_STEPS per sheet); each rule bites', () => {
    for (const [k, name] of Object.entries(BUILT)) expect([k, SL.sharedShownLint(card(k), MV[name], shared)]).toEqual([k, []]);
    const c = card('selector-pin'), bad = structuredClone(MV.SELECTOR_PIN), rules = (e: any) => SL.sharedShownLint(c, e, shared).map((x: any) => `${x.path}: ${x.rule}`);
    bad.setup[0].text = 'Push the pin in; it treats the stack.';
    expect(rules(bad)).toEqual(['selector-pin: setup[0]: banned: semicolon', 'selector-pin: setup[0]: medical claim (content.md 4)']);
    const six = { ...MV.SELECTOR_PIN, setup: [...MV.SELECTOR_PIN.setup, { kind: 'safety', text: 'Check the pin again.', claim: 'c1' }] };
    expect(rules(six)).toEqual(['selector-pin: setup: more than 5 setup steps']);
    const long = structuredClone(MV.FOOT_BAR);
    long.variants.pullover.setup[1].text = 'This stops you over-reaching for the start of every single long hard rep.';
    expect(SL.sharedShownLint(card('foot-bar'), long, shared).map((x: any) => `${x.path}: ${x.rule}`)).toEqual(['foot-bar.variants.pullover: setup[1]: setup > 12 words']);
  });
  it('the split throw: one card with two fields on one path throws, naming them (fixture card, D-LIB5-SPLIT 4)', () => {
    const fx = JSON.parse(readFileSync(join(ROOT, 'tests/howto/fixtures/lib5/split-card.json'), 'utf8'));
    expect(() => C.splitOf(fx)).toThrow(/^fixture-split: split: handling\.gripLine has gripLine, replacementRule$/);
    const { replacementRule: _r, ...one } = fx;
    expect(C.splitOf(one).map((x: any) => x.path)).toEqual(['handling.gripLine']);
    expect(() => C.splitOf({ ...one, wrist: fx.gripLine, reason: fx.gripLine })).toThrow(/^fixture-split: split: handling\.wrist\.limitText has wrist, reason$/);
    expect(() => C.splitOf({ ...one, newField: 'x' })).toThrow(/^fixture-split: split: newField is not a ruled field$/);
    // variants with disjoint ids are separate sheets; a list path holds one entry per field
    expect(C.splitOf(card('foot-bar')).map((x: any) => `${x.field} ${x.path}`)).toEqual(['variants.chest-press.steps setup[]', 'variants.pullover.steps setup[]']);
  });

  /** Each whole free-text data value of a card: appliesToWhy, every notes and gaps entry, every data field's .text/.basis. */
  const dataValues = (c: any, skip: string[] = []) => [
    ...(c.appliesToWhy ? [['appliesToWhy', c.appliesToWhy]] : []),
    ...['notes', 'gaps'].flatMap(k => (c[k] ?? []).map((t: string, i: number) => [`${k}[${i}]`, t])),
    ...C.DATA.flatMap((k: string) => ['text', 'basis'].filter(t => typeof c[k]?.[t] === 'string' && !skip.includes(`${k}.${t}`)).map(t => [`${k}.${t}`, c[k][t]])),
  ] as [string, string][];
  const leaks = (vals: [string, string][], files: [string, string][]) => files.flatMap(([p, t]) => vals.filter(([, x]) => t.includes(x)).map(([n]) => `${p}: ${n}`));
  it('no data value reaches src/** or a generator output (0 hits on 5592280, recorded on #244); a notes string in a generated file is red', async () => {
    const src = walkFiles(join(ROOT, 'src')).map(f => [f.slice(ROOT.length), readFileSync(f, 'utf8')] as [string, string]);
    const out = [...(await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render())].map(([p, o]: [string, any]) => [p, o.text] as [string, string]);
    expect(src.length).toBeGreaterThan(100);
    expect(out.length).toBeGreaterThan(50);
    for (const k of Object.keys(BUILT)) {
      const vals = dataValues(card(k));
      expect(vals.length).toBeGreaterThan(4);
      expect([k, leaks(vals, [...src, ...out])]).toEqual([k, []]);
    }
    // The cards whose modules wait (D-LIB5-SPLIT 5): checked early; implement.text is an exercise id (question on #244)
    const waiting = readdirSync(join(ROOT, 'docs/research/howto/shared')).map(f => f.slice(0, -5)).filter(k => k !== 'back-pain-box' && !BUILT[k]);
    expect(waiting).toHaveLength(16);
    for (const k of waiting) expect([k, leaks(dataValues(card(k), ['implement.text']), [...src, ...out])]).toEqual([k, []]);
    const note = card('selector-pin').notes[0], planted = out.map(([p, t], i) => [p, i === 0 ? `${t}\n// ${note}\n` : t] as [string, string]);
    expect(leaks(dataValues(card('selector-pin')), planted)).toEqual([`${out[0]![0]}: notes[0]`]);
  }, 300_000);
});
