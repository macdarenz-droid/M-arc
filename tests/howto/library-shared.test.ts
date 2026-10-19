// LIB-5: the shared layer modules (D-LIB5-*; docs/howto/library/LIB-5-DESIGN.md). S4 (Do 9): the owner-approved back
// box (decision 6, option 1) is exact, within BOX-CAP's named 50-word limit for this box only, written by
// library-gate.mjs as src/howto/red-flag-back.ts and present whole in the built app (check-bundle.mjs's Do 9 rule, on
// temp folders written at run time from the copied card); E1's back-flagged row is linted with it (D-LIB5-FIXTURE).
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

describe('LIB-5 S4: check-bundle.mjs, the Do 9 rule (D-LIB5-BUNDLE)', () => {
  /** A folder holding every answered value in its HowToSheet chunk, less `drop`. */
  const withValues = (drop: string[] = [], extra: Record<string, string> = {}) => {
    const v = B.boxValues(), keep = Object.entries(v).filter(([f]) => !drop.includes(f)).map(([, t]) => t);
    return folder({ extra: { 'assets/HowToSheet-AbCd1234.js': `export const b = ${JSON.stringify(keep)};`, ...extra } });
  };
  it('reads the three whole box values from the copied, owner-approved card', () => {
    const v = B.boxValues();
    expect(Object.keys(v)).toEqual(['name', 'now', 'doctor']);
    for (const t of Object.values(v)) expect(typeof t === 'string' && (t as string).length > 0).toBe(true);
  });
  it('all three answered values present -> exit 0', () => {
    const r = run(withValues());
    expect([r.status, r.stderr]).toEqual([0, '']);
    expect(r.stdout).toContain('every answered back-box value present');
  });
  for (const f of ['name', 'now', 'doctor']) {
    it(`mutation: box.${f}.text missing -> exit 1, naming that field`, () => {
      const r = run(withValues([f]));
      expect(r.status).toBe(1);
      expect(r.stderr.match(/no file holds box\.\w+\.text/g)).toEqual([`no file holds box.${f}.text`]);
    });
  }
  it('the 9dbc7e0 draft now is the answered now (option 1 kept it), so its presence is allowed; were it not the answer, it is red', () => {
    expect(B.draftNow()).toBe(B.boxValues().now);
    const v = { ...B.boxValues(), now: 'Another answered now line? Get help today.' };
    const d = folder({ extra: { 'assets/HowToSheet-AbCd1234.js': JSON.stringify(Object.values(v)), 'assets/index-Zz9.js': JSON.stringify(B.draftNow()) } });
    expect(B.bundleProblems(d, v)).toEqual(['assets/index-Zz9.js: holds the 9dbc7e0 draft box.now.text']);
  });
  it('mutation: no HowToSheet chunk -> exit 1', () => {
    const r = run(folder({ chunk: false, extra: { 'assets/index-Zz9.js': JSON.stringify(Object.values(B.boxValues())) } }));
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('no assets/HowToSheet-*.js chunk');
  });
  it('a value in any file under the folder counts (index.html, sw.js, nested)', () => {
    const v = B.boxValues();
    const d = folder({ extra: { 'index.html': v.doctor, 'nested/deep/m.json': v.now, 'sw.js': v.name } });
    expect(B.bundleProblems(d, v)).toEqual([]);
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

describe('LIB-5 S4: the back box is exact and inside its reach (D-LIB5-BOX, D-BOXCAP-WIRE)', () => {
  const MOD = join(ROOT, 'tools/plates/library/shared/back-box.mjs');
  const OUT = join(ROOT, 'src/howto/red-flag-back.ts');
  let M: any;
  beforeAll(async () => { M = await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs')); });
  it('1. back-box.mjs holds no box text; backBox() is the owner-approved card\'s box, byte for byte, with its boxClaim', () => {
    const src = readFileSync(MOD, 'utf8');
    for (const [f, v] of Object.entries(VALUES)) expect([f, src.includes(v)]).toEqual([f, false]);
    expect(BOX.status).toBe('owner-approved');
    expect(M.backBox()).toEqual({ name: VALUES.name, now: VALUES.now, doctor: VALUES.doctor, claim: BOX.box.boxClaim });
    expect(M.backBox().claim.sources).toContain('nhs-back');
  });
  it('2. src/howto/red-flag-back.ts exports RED_FLAG_BACK = backBox(); the values appear under src/ in that file only', async () => {
    const { RED_FLAG_BACK } = await import('../../src/howto/red-flag-back');
    expect(RED_FLAG_BACK).toEqual(M.backBox());
    const files = walkFiles(join(ROOT, 'src'));
    expect(files.length).toBeGreaterThan(100);
    const hits = files.flatMap(f => { const t = readFileSync(f, 'utf8'); return Object.entries(VALUES).filter(([, v]) => t.includes(v)).map(([k]) => `${f.slice(ROOT.length)}: box.${k}.text`); });
    expect(hits).toEqual(['src/howto/red-flag-back.ts: box.name.text', 'src/howto/red-flag-back.ts: box.now.text', 'src/howto/red-flag-back.ts: box.doctor.text']);
    expect(readFileSync(OUT, 'utf8')).toMatch(/^\/\/ GENERATED, do not edit\. Written by tools\/plates\/generate\.mjs \(tools\/plates\/gen\/library-gate\.mjs\)\./);
  });
  it('3. RiskJoint holds back, and Risks.tsx\'s FLAG maps it to RED_FLAG_BACK', () => {
    const back: RiskJoint = 'back';
    expect(back).toBe('back');
    expect(readFileSync(join(ROOT, 'src/howto/content-types.ts'), 'utf8')).toMatch(/export type RiskJoint = 'wrist' \| 'shoulder' \| 'knee' \| 'elbow' \| 'back';/);
    expect(readFileSync(join(ROOT, 'src/slices/howto/sections/Risks.tsx'), 'utf8')).toMatch(/\n  back: RED_FLAG_BACK,\n\};/);
  });
  it('4. backBox() refuses a draft card, another key and a missing line', () => {
    const t = mkdtempSync(join(tmpdir(), 'lib5-box-')); temps.push(t);
    const put = (c: any) => { mkdirSync(join(t, 'docs/research/howto/shared'), { recursive: true }); writeFileSync(join(t, M.BACK_CARD), JSON.stringify(c)); };
    put({ ...BOX, status: 'draft' }); expect(() => M.backBox(t)).toThrow('is still a draft');
    put({ ...BOX, key: 'spine-pain-box' }); expect(() => M.backBox(t)).toThrow('has key "spine-pain-box"');
    put({ ...BOX, box: { ...BOX.box, doctor: { text: '' } } }); expect(() => M.backBox(t)).toThrow('has no box.doctor.text');
  });
  it('5. guard: box text in the app needs D-LIB5-BACKBOX and a settled card whose box it equals', async () => {
    const block = M.backBox();
    expect(readFileSync(join(ROOT, 'docs/COACHING-DECISIONS.md'), 'utf8')).toContain('D-LIB5-BACKBOX');
    expect(BOX.status).not.toBe('draft');
    expect([block.name, block.now, block.doctor]).toEqual([VALUES.name, VALUES.now, VALUES.doctor]);
  });
});

describe('LIB-5 S4: E1\'s row with back in its riskFlags is linted with the answered box (D-LIB5-FIXTURE, D-LIB5-WORDS)', () => {
  const T = 900_000;
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(tree);
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
  it('riskFlags gains back -> the library lint counts the 50-word box: pull-up\'s 449 + 50 is over 450, naming the row', async () => {
    const r = copyWith("riskFlags: ['wrist', 'shoulder', 'elbow']", "riskFlags: ['wrist', 'shoulder', 'elbow', 'back']");
    const g = await node(r, ['tools/plates/generate.mjs']);
    expect(g.code).not.toBe(0);
    expect(g.out).toContain('Error: lib_cable_lateral_raise: library lint:');
    expect(g.out).toMatch(/\(sheet\): visible words > 450 \(\d+\)/);
    expect(g.out).not.toContain('red-flag box >');
  }, T);
  it('control: the unedited tree generates and writes red-flag-back.ts; with the card removed QA refuses first (PQ-H6)', async () => {
    const ok = await node(tree, ['tools/plates/generate.mjs']);
    expect([ok.code, ok.out.slice(-400)]).toEqual([0, expect.stringContaining('generate: wrote')]);
    expect(readFileSync(join(tree, 'src/howto/red-flag-back.ts'), 'utf8')).toBe(readFileSync(join(ROOT, 'src/howto/red-flag-back.ts'), 'utf8'));
    const r = copyWith("riskFlags: ['wrist', 'shoulder', 'elbow']", "riskFlags: ['wrist', 'shoulder', 'elbow', 'back']");
    rmSync(join(r, F.CARD_FILE));
    const g = await node(r, ['tools/plates/generate.mjs']);
    expect(g.code).not.toBe(0);
    expect(g.out).toMatch(/plate QA refused lib_cable_lateral_raise:[\s\S]*PQ-H6/);
  }, T);
  it('mutations through the generator, each red: a box over its named 50; a kept trigger dropped; nhs-back removed from boxClaim', async () => {
    const card = (edit: (c: any) => void) => { const r = mkdtempSync(join(tmpdir(), 'lib5-e1-')); temps.push(r); cpSync(tree, r, { recursive: true, verbatimSymlinks: true });
      const p = join(r, 'docs/research/howto/shared/back-pain-box.json'), c = JSON.parse(readFileSync(p, 'utf8')); edit(c); writeFileSync(p, JSON.stringify(c, null, 2)); return r; };
    // one generator at a time (c15-stamps.test.ts: three at once beside the other suites overload the runner)
    const over = await node(card(c => { c.box.doctor.text = 'No better in a few weeks? See a doctor soon.'; }), ['tools/plates/generate.mjs']);
    const trigger = await node(card(c => { c.box.now.text = c.box.now.text.replace(' Chest pain?', ''); }), ['tools/plates/generate.mjs']);
    const nhs = await node(card(c => { c.box.boxClaim.sources = []; }), ['tools/plates/generate.mjs']);
    expect(over.code).not.toBe(0);
    expect(over.out).toContain('Error: back box: library lint:\n  RED_FLAG_BACK: red-flag box > 50 words (51 words)');
    expect(trigger.code).not.toBe(0);
    expect(trigger.out).toContain('RED_FLAG_BACK.now: kept back-box trigger missing (D-LIB5-BOX) ("Chest pain?")');
    expect(nhs.code).not.toBe(0);
    expect(nhs.out).toContain('RED_FLAG_BACK.claim: the back box must cite nhs-back (S4)');
  }, T);
});

describe('LIB-5 D-LIB5-GATE: library-gate.mjs writes only red-flag-back.ts and stays inside C17', () => {
  const GATE = 'tools/plates/gen/library-gate.mjs', SHARED_DIR = join(ROOT, 'tools/plates/library/shared');
  /** Paths render() attributes to the gate, and other files whose header names it. */
  const gatePaths = (out: Map<string, any>) => [...out].filter(([, o]) => o.writers.includes(GATE)).map(([p]) => p).sort();
  it('render(): the paths attributed to library-gate.mjs are exactly [src/howto/red-flag-back.ts], and no other header names it', async () => {
    const out = await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render();
    expect(gatePaths(out)).toEqual(['src/howto/red-flag-back.ts']);
    expect([...out].filter(([, o]) => o.text.slice(0, 600).includes('library-gate')).map(([p]) => p)).toEqual(['src/howto/red-flag-back.ts']);
  }, 300_000);
  it('inputsFor(red-flag-back.ts) is back-box.mjs, its static imports (node:* only) and the back-box card', async () => {
    const G = await import(/* @vite-ignore */ url(GATE));
    const imports = [...readFileSync(join(SHARED_DIR, 'back-box.mjs'), 'utf8').matchAll(/^import .* from '([^']+)';$/gm)].map(m => m[1]);
    expect(imports.every(m => m!.startsWith('node:'))).toBe(true);
    expect(imports.length).toBeGreaterThan(0);
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

describe('LIB-5 S6: the shared modules equal their cards (D-LIB5-SPLIT; research 9eaa248, lib4-cards 14.5)', () => {
  /** module.EXPORT -> its pinned top-level keys. */
  const PINNED: Record<string, string> = {
    'moves.DUMBBELL_KICKUP': 'card appliesTo postureArchetype variants',
    'moves.FOOT_BAR': 'card appliesTo variants',
    'moves.GET_IN_OUT': 'card appliesTo setup variants',
    'moves.SELECTOR_PIN': 'card appliesTo setup',
    'moves.UNRACK_RERACK': 'card appliesTo postureArchetype variants',
    'hands.CUPPED_THUMB': 'card appliesTo handContact thumbRule wrist alternative gripLine cue',
    'hands.CURL': 'card appliesTo thumbRule wrist rightPose faults widthNote gripLine cue',
    'hands.PALM_FLAT': 'card appliesTo contactPoint fingers wrist rightPose faults soreWrist gripLine cue',
    'hands.ROPE': 'card appliesTo width thumbRule wrist faults gripLine cue',
    'implements.BATTLE_ROPES': 'card appliesTo contactPoint thumbRule rightPose faults gripLine cue handRisks',
    'implements.JUMP_ROPE': 'card appliesTo contactPoint thumbRule wrist rightPose faults gripLine cue handRisks',
    'implements.KETTLEBELL_SWING': 'card appliesTo contactPoint thumbRule rightPose faults gripLine cue handRisks',
    'implements.MEDICINE_BALL_SLAM': 'card appliesTo rightPose gripLine cue handRisks',
    'implements.WALL_BALL': 'card appliesTo contactPoint rightPose faults gripLine cue handRisks',
    'exemptions.FRONT_RACK': 'card appliesTo reason replacementRule faults',
    'exemptions.WRIST_CURL': 'card appliesTo reason replacementRule faults',
    'checkpoints.PRONE': 'card appliesTo checkpoints',
    'checkpoints.FLOOR_BODY': 'card appliesTo defaultCheckpoints defaultCrop',
  };
  /** D-LIB5-SPLIT-2 1: rope-rule's width.text, pinned whole (handContact, one space, grip). */
  const ROPE_WIDTH = 'One hand on each end of the rope, up against the knob. Neutral grip, palms facing each other. A full grip, thumbs wrapped round the rope.';
  let C: any, SL: any, shared: any;
  const MODS: Record<string, any> = {};
  beforeAll(async () => {
    [C, SL, shared] = await Promise.all(['tools/plates/library/shared/card.mjs', 'tools/plates/library/lint/shared-cards.mjs',
      'tools/plates/layers/howto/shared.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    for (const m of ['moves', 'hands', 'implements', 'exemptions', 'checkpoints']) MODS[m] = await import(/* @vite-ignore */ url(`tools/plates/library/shared/${m}.mjs`));
  });
  const card = (k: string) => JSON.parse(readFileSync(join(ROOT, `docs/research/howto/shared/${k}.json`), 'utf8'));
  const exp = (at: string) => { const [m, n] = at.split('.'); return MODS[m!][n!]; };
  const keyOf = (e: any) => e.card.slice('shared/'.length, -'.json'.length);
  const pick = (o: any, ks: string[]) => Object.fromEntries(ks.filter(k => k in o).map(k => [k, o[k]]));
  /** The export as read straight from the card JSON, independent of card.mjs. */
  const expected = (c: any) => {
    const out: any = { card: `shared/${c.key}.json`, appliesTo: c.appliesTo };
    const steps = (l: any[]) => l.map(s => pick(s, ['kind', 'text', 'claim']));
    for (const [f, v] of Object.entries(c) as [string, any][]) {
      if (c.key === 'rope-rule' && f === 'handContact') out.width = { text: ROPE_WIDTH, claim: ['c1', 'c2', 'c3'] };
      if (c.key === 'rope-rule' && (f === 'handContact' || f === 'grip')) continue;
      if (['gripLine', 'cue', 'wrist', 'soreWrist', 'thumbRule', 'alternative', 'widthNote', 'fingers', 'handContact', 'grip', 'rightPose', 'contactPoint', 'reason', 'replacementRule', 'defaultCrop'].includes(f)) out[f] = pick(v, ['text', 'claim', 'appliesTo']);
      if (f === 'faults') out.faults = v.map((x: any) => pick(x, ['key', 'label', 'what', 'claim']));
      if (f === 'handRisks') out.handRisks = v.map((x: any) => pick(x, ['text', 'claim']));
      if (f === 'steps') out.setup = steps(v);
      if (f === 'variants') out.variants = Object.fromEntries(Object.entries(v).map(([n, va]: [string, any]) => [n, { appliesTo: va.appliesTo, setup: steps(va.steps) }]));
      if (f === 'postureArchetype') out.postureArchetype = { right: pick(v.right, ['text', 'claim']), wrong: v.wrong && pick(v.wrong, ['text', 'claim']) };
      if (f === 'checkpoints' || f === 'defaultCheckpoints') out[f] = v.map((x: any) => pick(x, ['key', 'label', 'detail', 'claim', 'appliesTo']));
    }
    return out;
  };
  /** Every key path of an export (list items collapsed to []). */
  const keyPaths = (o: any, at = ''): string[] => [...new Set(Object.entries(o ?? {}).flatMap(([k, x]: [string, any]) => {
    const p = at ? `${at}.${k}` : k;
    if (Array.isArray(x)) return [p, ...x.flatMap(y => (y && typeof y === 'object' ? keyPaths(y, `${p}[]`) : []))];
    return x && typeof x === 'object' ? [p, ...keyPaths(x, p)] : [p];
  }))].sort();
  /** Data fields (card.mjs DATA) among an export's own keys and its variants' (a list item's keys are pinned by shape). */
  const dataKeys = (e: any) => keyPaths(e).filter(p => !p.includes('[]') && C.DATA.includes(p.split('.').pop()!));
  /** Claim refs that do not resolve to a claim whose sources are all in the card's registry, as their paths. */
  const refProblems = (c: any, e: any) => keyPaths(e).filter(p => p.endsWith('claim')).length === 0 ? ['no claim refs'] : (function walk(o: any, at: string): string[] {
    if (Array.isArray(o)) return o.flatMap((y, i) => walk(y, `${at}[${i}]`));
    if (!o || typeof o !== 'object') return [];
    const own = 'claim' in o && (() => { const cl = SL.claimOf(c, o.claim); return !cl || !cl.sources.length || cl.sources.some((x: string) => !c.sources.some((y: any) => y.id === x)); })() ? [`${at}.claim`] : [];
    return [...own, ...Object.entries(o).filter(([k]) => k !== 'claim').flatMap(([k, y]) => walk(y, at ? `${at}.${k}` : k))];
  })(e, '');

  it('the module files export exactly the pinned exports, and each top-level key list is pinned', () => {
    expect(Object.entries(MODS).flatMap(([m, M]) => Object.keys(M).map(n => `${m}.${n}`)).sort()).toEqual(Object.keys(PINNED).sort());
    for (const [at, keys] of Object.entries(PINNED)) expect([at, Object.keys(exp(at)).join(' ')]).toEqual([at, keys]);
  });
  it('module === card: each export equals its card\'s fields; a drifted string is red', () => {
    for (const at of Object.keys(PINNED)) expect([at, exp(at)]).toEqual([at, expected(card(keyOf(exp(at))))]);
    const drift = structuredClone(exp('hands.PALM_FLAT'));
    drift.faults[0].label += 's';
    expect(drift).not.toEqual(expected(card('palm-flat')));
  });
  it('no data field is exported; a data key added to an export is red', () => {
    for (const at of Object.keys(PINNED)) expect([at, dataKeys(exp(at))]).toEqual([at, []]);
    expect(dataKeys({ ...exp('moves.SELECTOR_PIN'), notes: card('selector-pin').notes })).toEqual(['notes']);
    expect(dataKeys({ ...exp('exemptions.WRIST_CURL'), exempts: card('wrist-curl-exemption').exempts })).toEqual(['exempts', 'exempts.archetype']);
    const fb = exp('moves.FOOT_BAR');
    expect(dataKeys({ ...fb, variants: { ...fb.variants, pullover: { ...fb.variants.pullover, gaps: [] } } })).toEqual(['variants.pullover.gaps']);
  });
  it('every claim ref resolves, with its sources in the card\'s registry; a broken ref is red', () => {
    for (const at of Object.keys(PINNED)) expect([at, refProblems(card(keyOf(exp(at))), exp(at))]).toEqual([at, []]);
    const broken = structuredClone(exp('implements.JUMP_ROPE'));
    broken.handRisks[0].claim = 'c99';
    expect(refProblems(card('implement-jump-rope'), broken)).toEqual(['handRisks[0].claim']);
  });
  it('every shown field passes golden B\'s lint at its ruled path and kind (one sheet per scope); each kind bites', () => {
    for (const at of Object.keys(PINNED)) expect([at, SL.sharedShownLint(card(keyOf(exp(at))), exp(at), shared)]).toEqual([at, []]);
    const rules = (at: string, edit: (e: any) => void) => {
      const e = structuredClone(exp(at)); edit(e);
      return SL.sharedShownLint(card(keyOf(e)), e, shared).map((x: any) => `${x.path}: ${x.rule}`);
    };
    expect(rules('moves.SELECTOR_PIN', e => { e.setup[0].text = 'Push the pin in; it treats the stack.'; }))
      .toEqual(['selector-pin: setup[0]: banned: semicolon', 'selector-pin: setup[0]: medical claim (content.md 4)']);
    expect(rules('moves.SELECTOR_PIN', e => { e.setup.push({ kind: 'safety', text: 'Check the pin again.', claim: 'c1' }); })).toEqual(['selector-pin: setup: more than 5 setup steps']);
    expect(rules('moves.FOOT_BAR', e => { e.variants.pullover.setup[1].text = 'This stops you over-reaching for the start of every single long hard rep.'; }))
      .toEqual(['foot-bar.variants.pullover: setup[1]: setup > 12 words']);
    expect(rules('moves.GET_IN_OUT', e => { e.variants['thigh-pad'].setup.push(e.variants['thigh-pad'].setup[0]); })).toEqual(['get-in-out.variants.thigh-pad: setup: more than 5 setup steps']);
    expect(rules('hands.PALM_FLAT', e => { e.faults[0].label = 'Hands too far forward'; })).toEqual(['palm-flat: handling.faults[0](hand-ahead).label: label > 3 words']);
    expect(rules('hands.PALM_FLAT', e => { e.contactPoint.text = 'Heel of the hand'; })).toEqual(['palm-flat: zooms[0](hand).rightNote: label > 3 words']);
    expect(rules('hands.CURL', e => { e.rightPose.text = 'Handle across the middle of the palm with the thumb wrapped.'; })).toEqual(['curl: zooms[0](hand).hand.note: caption > 10 words']);
    expect(rules('hands.CURL', e => { e.cue.text = 'Keep the wrist straight all the way.'; })).toEqual(['curl: handling.cue: cue > 6 words']);
    expect(rules('hands.CUPPED_THUMB', e => { e.gripLine.text = 'Thumbs wrap the handle and the fingers sit on the head of the dumbbell, so it stays put.'; }))
      .toEqual(['cupped-thumb: handling.gripLine: sentence > 15 words']);
    expect(rules('implements.JUMP_ROPE', e => { e.handRisks[0].text = 'Hold the handles loosely so the forearms do not get tired too fast in a set.'; }))
      .toEqual(['jump-rope: risks[0](handRisks0): sentence > 15 words', 'jump-rope: risks[0](handRisks0): risk > 14 words'].map(x => x.replace('jump-rope', 'implement-jump-rope')));
    expect(rules('exemptions.WRIST_CURL', e => { e.reason.text = 'The wrist moves here; that is the exercise.'; })).toEqual(['wrist-curl-exemption: handling.wrist.limitText: banned: semicolon']);
    expect(rules('moves.UNRACK_RERACK', e => { e.postureArchetype.wrong.text = 'Bar lowered or pressed straight from the hooks with bent arms.'; }))
      .toEqual(['unrack-rerack: zooms[0](posture).caption.wrong: caption > 10 words']);
    expect(rules('checkpoints.PRONE', e => { e.checkpoints[0].label = 'Hips on the pad'; })).toEqual([`prone-checkpoints: posture[0](${exp('checkpoints.PRONE').checkpoints[0].key}).label: label > 3 words`]);
    expect(rules('implements.WALL_BALL', e => { e.gripLine.text = 'Hold it as at www.example.com.'; })).toEqual(['implement-wall-ball: handling.gripLine: no contact or emergency wording (LR-23)']);
  });
  it('the split throw: one card with two fields on one path throws, naming them (fixture card, D-LIB5-SPLIT 4)', () => {
    const fx = JSON.parse(readFileSync(join(ROOT, 'tests/howto/fixtures/lib5/split-card.json'), 'utf8'));
    expect(() => C.splitOf(fx)).toThrow(/^fixture-split: split: handling\.gripLine has gripLine, replacementRule$/);
    expect(() => C.cardExport(fx)).toThrow(/^fixture-split: split: handling\.gripLine has gripLine, replacementRule$/);
    const { replacementRule: _r, ...one } = fx;
    expect(C.cardExport(one)).toEqual({ card: 'shared/fixture-split.json', appliesTo: ['fixture_exercise'], gripLine: fx.gripLine });
    expect(() => C.splitOf({ ...one, wrist: fx.gripLine, reason: fx.gripLine })).toThrow(/^fixture-split: split: handling\.wrist\.limitText has wrist, reason$/);
    expect(() => C.splitOf({ ...one, newField: 'x' })).toThrow(/^fixture-split: split: newField is not a ruled field$/);
    expect(() => C.cardExport({ ...one, cue: { text: 'x', claim: 'c1', extra: 1 } })).toThrow(/^fixture-split: cue: unruled shape \(\+extra\)$/);
    // variants with disjoint ids are separate sheets; a list path holds one entry per field
    expect(C.splitOf(card('foot-bar')).map((x: any) => `${x.field} ${x.path}`)).toEqual(['variants.chest-press.steps setup[]', 'variants.pullover.steps setup[]']);
  });
  it('the one ruled join (D-LIB5-SPLIT-2 1): rope-rule width.text = handContact + \' \' + grip; order swapped or a second card is red', () => {
    const c = card('rope-rule');
    expect(C.RULED_JOINS).toEqual({ 'rope-rule': { 'handling.width.text': ['handContact', 'grip'] } });
    expect(`${c.handContact.text} ${c.grip.text}`).toBe(ROPE_WIDTH);
    expect(exp('hands.ROPE').width).toEqual({ text: ROPE_WIDTH, claim: ['c1', 'c2', 'c3'] });
    const keep = C.RULED_JOINS['rope-rule']['handling.width.text'];
    try {
      C.RULED_JOINS['rope-rule']['handling.width.text'] = ['grip', 'handContact'];
      expect(() => C.cardExport(c)).toThrow(/^rope-rule: split: handling\.width\.text has handContact, grip$/);
    } finally { C.RULED_JOINS['rope-rule']['handling.width.text'] = keep; }
    expect(Object.keys({ ...C.RULED_JOINS, curl: { 'handling.width.text': ['widthNote'] } })).not.toEqual(['rope-rule']);
    // the throw stays for every other card
    expect(() => C.cardExport({ ...c, key: 'rope-copy' })).toThrow(/^rope-copy: split: handling\.width\.text has handContact, grip$/);
  });

  /** Each whole free-text data value of a card: appliesToWhy, every notes and gaps entry, every data field's .text/.basis,
   *  every string in exempts (lib4-cards 14.5) but its typed archetype enum (14.3 point 2), and prone's (14.6). */
  const dataValues = (c: any, skip: string[] = []) => [
    ...(c.appliesToWhy ? [['appliesToWhy', c.appliesToWhy]] : []),
    ...['notes', 'gaps'].flatMap(k => (c[k] ?? []).map((t: string, i: number) => [`${k}[${i}]`, t])),
    ...C.DATA.flatMap((k: string) => ['text', 'basis'].filter(t => typeof c[k]?.[t] === 'string' && !skip.includes(`${k}.${t}`)).map(t => [`${k}.${t}`, c[k][t]])),
    ...Object.entries(c.exempts ?? {}).filter(([k, v]) => k !== 'archetype' && typeof v === 'string').map(([k, v]) => [`exempts.${k}`, v]),
    ...Object.entries(c.prone ?? {}).filter(([, v]) => typeof v === 'string').map(([k, v]) => [`prone.${k}`, v]),
  ] as [string, string][];
  const leaks = (vals: [string, string][], files: [string, string][]) => files.flatMap(([p, t]) => vals.filter(([, x]) => t.includes(x)).map(([n]) => `${p}: ${n}`));
  it('implement.text is a typed id: each names an exercises.json row (lib_ + id); a misspelt id is red', () => {
    const ids = new Set(JSON.parse(readFileSync(join(ROOT, 'src/data/exercises.json'), 'utf8')).map((e: any) => e.id));
    const bad = (cs: any[]) => cs.filter(c => c.implement && !ids.has(`lib_${c.implement.text}`)).map(c => c.key);
    const imps = readdirSync(join(ROOT, 'docs/research/howto/shared')).filter(f => f.startsWith('implement-')).map(f => card(f.slice(0, -5)));
    expect(imps).toHaveLength(5);
    expect(bad(imps)).toEqual([]);
    expect(bad([...imps, { ...imps[0], key: 'misspelt', implement: { ...imps[0].implement, text: 'battle_rope' } }])).toEqual(['misspelt']);
  });
  it('no data value reaches src/** or a generator output (0 hits before these modules, recorded on #244); a notes string in a generated file is red', async () => {
    const src = walkFiles(join(ROOT, 'src')).map(f => [f.slice(ROOT.length), readFileSync(f, 'utf8')] as [string, string]);
    const out = [...(await (await import(/* @vite-ignore */ url('tools/plates/generate.mjs'))).render())].map(([p, o]: [string, any]) => [p, o.text] as [string, string]);
    expect(src.length).toBeGreaterThan(100);
    expect(out.length).toBeGreaterThan(50);
    const keys = readdirSync(join(ROOT, 'docs/research/howto/shared')).map(f => f.slice(0, -5)).filter(k => k !== 'back-pain-box');
    expect(keys).toHaveLength(18);
    let n = 0;
    // implement.text is a typed exercise id (D-LIB5-SPLIT-2 3): the only skip, and it must name an exercises.json row
    for (const k of keys) { const vals = dataValues(card(k), ['implement.text']); n += vals.length; expect([k, leaks(vals, [...src, ...out])]).toEqual([k, []]); }
    expect(n).toBeGreaterThan(100);
    expect(dataValues(card('wrist-curl-exemption')).map(([p]) => p)).toContain('exempts.rule');
    expect(dataValues(card('floor-body')).map(([p]) => p)).toContain('prone.see');
    const note = card('selector-pin').notes[0], planted = out.map(([p, t], i) => [p, i === 0 ? `${t}\n// ${note}\n` : t] as [string, string]);
    expect(leaks(dataValues(card('selector-pin')), planted)).toEqual([`${out[0]![0]}: notes[0]`]);
  }, 300_000);
});

describe('LIB-5 S5 (Do 9): the app renders the back box', () => {
  type VN = { type?: unknown; props?: Record<string, any> };
  const elements = (n: unknown): VN[] => {
    if (n == null || typeof n === 'boolean' || typeof n === 'string' || typeof n === 'number') return [];
    if (Array.isArray(n)) return n.flatMap(elements);
    const v = n as VN;
    return v.type ? [v, ...elements(v.props?.children)] : elements(v.props?.children);
  };
  const text = (n: unknown): string => (typeof n === 'string' ? n : Array.isArray(n) ? n.map(text).join('') : (n as VN)?.props ? text((n as VN).props!.children) : '');
  it('renderRisks emits <pre>-redflag-back holding RED_FLAG_BACK for a back-flagged fixture row; the wrong block is red', async () => {
    const [{ renderRisks }, { chromeIdOf }, { RED_FLAG_BACK }, { readHowTo }] = await Promise.all([
      import('../../src/slices/howto/sections/Risks'), import('../../src/slices/howto/PlateView'), import('../../src/howto/red-flag-back'), import('./generated-module')]);
    const row = { ...readHowTo('pull-up', ROOT), riskFlags: ['wrist', 'back'] as RiskJoint[] }, pre = chromeIdOf(row);
    const flags = elements(renderRisks(row)).filter(v => typeof v.props?.class === 'string' && v.props.class.split(' ').includes('redflag'));
    expect(flags.map(v => v.props!.id)).toEqual([`${pre}-redflag-wrist`, `${pre}-redflag-back`]);
    const back = flags[1]!, lines = elements(back).filter(v => v.type === 'p').map(v => text(v.props!.children));
    expect(lines).toEqual([RED_FLAG_BACK.name, RED_FLAG_BACK.now, RED_FLAG_BACK.doctor]);
    const wrist = elements(flags[0]).filter(v => v.type === 'p').map(v => text(v.props!.children));
    expect(wrist).not.toEqual(lines);
  });
});

describe('LIB-5 D-LIB5-TWIN (Do 9): the HT-9 twin knows the back box', () => {
  const TWIN = join(ROOT, 'tools/plates/library/fidelity/twins/ht9.mjs');
  /** The twin's FLAG keys, and whether its esbuild entry re-exports red-flag-back.ts, read from its text. */
  const twinOf = (t: string) => ({
    keys: [...(t.match(/const FLAG = \{([^}]*)\};/)?.[1] ?? '').matchAll(/(\w+): C\.RED_FLAG\w*/g)].map(m => m[1]).sort(),
    reexport: /export \* from \$\{JSON\.stringify\(join\(root, 'src\/howto\/red-flag-back\.ts'\)\)\}/.test(t),
  });
  const riskJoints = () => [...readFileSync(join(ROOT, 'src/howto/content-types.ts'), 'utf8').match(/export type RiskJoint = ([^;]+);/)![1]!.matchAll(/'(\w+)'/g)].map(m => m[1]).sort();
  const risksKeys = () => [...readFileSync(join(ROOT, 'src/slices/howto/sections/Risks.tsx'), 'utf8').match(/const FLAG[^=]*= \{([^}]*)\};/)![1]!.matchAll(/(\w+): RED_FLAG\w*/g)].map(m => m[1]).sort();
  it('FLAG keys === RiskJoint === Risks.tsx FLAG keys, and the entry re-exports red-flag-back.ts', () => {
    const t = twinOf(readFileSync(TWIN, 'utf8'));
    expect(riskJoints()).toEqual(['back', 'elbow', 'knee', 'shoulder', 'wrist']);
    expect([t.keys, risksKeys()]).toEqual([riskJoints(), riskJoints()]);
    expect(t.reexport).toBe(true);
  });
  it('mutations, each red: back dropped from FLAG; the re-export dropped', () => {
    const src = readFileSync(TWIN, 'utf8');
    expect(twinOf(src.replace(', back: C.RED_FLAG_BACK', '')).keys).not.toEqual(riskJoints());
    expect(twinOf(src.replace("export * from ${JSON.stringify(join(root, 'src/howto/red-flag-back.ts'))};\\n", '')).reexport).toBe(false);
  });
});
