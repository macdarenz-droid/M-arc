// LIB-5v (D-LIB5-VARIANT 4, D-LIB5v-FIELD): the shown variant line `copy.variantLine`. V1 the type, V2 the pure rules,
// V3/V4 the generator over per-case copies of E1's tree (D-LIB5-FIXTURE 6), V4/V5 the 450 visible words in the lint and
// C7, V6 C19's reach, V7 the sheet, V9 the B5 fixture line. Fixture lines live here only; no shipped row carries one.
import { spawn } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { HowToContent } from '../../src/howto/content-types';
import type { BuiltHowTo } from '../../src/howto/types';
import { VariantLine } from '../../src/slices/howto/VariantLine';
import { mapLimit } from './limit';
import { checkC7 } from './checks/c7';
import { RULE_CONTACT, checkC19Copy } from './checks/c19';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ROOT = new URL('../../', import.meta.url).pathname;
let L: any, CL: any, shared: any, content: any;
const temps: string[] = [];
beforeAll(async () => {
  [L, CL, shared, content] = await Promise.all(['tools/plates/library/lint/index.mjs', 'tools/plates/layers/artifact/copy-lint.mjs',
    'tools/plates/layers/howto/shared.mjs', 'tools/plates/gen/content.mjs'].map(p => import(/* @vite-ignore */ url(p))));
});
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });
const howto = (id: string) => import(/* @vite-ignore */ url(`tools/plates/layers/exercises/${id.slice(4)}.howto.mjs`));
/** A module namespace (or content) with `copy.variantLine` set. */
const withLine = (M: any, line: string) => (M.default
  ? { ...M, default: { ...M.default, copy: { ...M.default.copy, variantLine: line } } }
  : { ...M, copy: { ...M.copy, variantLine: line } });
/** n neutral words, one sentence. */
const neutral = (n: number) => `${Array.from({ length: n }, () => 'Same').join(' ')}.`;

// V1: the type holds a string line only.
const ok: HowToContent['copy'] = { setupLine: '', mistakeLine: '', variantLine: 'x' };
// @ts-expect-error variantLine is a string
const notString: HowToContent['copy'] = { setupLine: '', mistakeLine: '', variantLine: 3 };

describe('LIB-5v V1: copy.variantLine is an optional string', () => {
  it('the typed literals exist (npm run typecheck is the proof)', () => {
    expect([ok.variantLine, notString.variantLine]).toEqual(['x', 3]);
  });
});

describe('LIB-5v V2: the pure rules read copy.variantLine', () => {
  it('variantLineOf reads a namespace and content, and gives undefined without a line', async () => {
    const M = await howto('lib_pull_up'), { content: c } = await content.loadContent('lib_pull_up');
    expect(L.variantLineOf(withLine(M, 'Machine.'))).toBe('Machine.');
    expect(L.variantLineOf(withLine(c, 'Machine.'))).toBe('Machine.');
    expect([L.variantLineOf(M), L.variantLineOf(c), L.variantLineOf(undefined), L.variantLineOf({})]).toEqual([undefined, undefined, undefined, undefined]);
  });
  it('an exempt id with a line is red; with no line it is green', () => {
    const f = (o: any) => L.variantLine(o).violations.map((x: any) => x.rule);
    for (const id of L.VARIANT_LINE_EXEMPT) {
      expect([id, f({ id, equipment: 'Cable / Machine', line: 'Machine.' })]).toEqual([id, ['variant line on an exempt golden-B id (D-LIB5-VARIANT8)']]);
      expect([id, f({ id, equipment: 'Cable / Machine' })]).toEqual([id, []]);
      expect([id, f({ id, equipment: 'Cable / Machine', line: '' })]).toEqual([id, []]);
    }
    expect(L.VARIANT_LINE_EXEMPT).toEqual(['lib_lat_pulldown', 'lib_leg_press']);
  });
  it('shownCopyFields adds exactly one caption field with a line, none without', async () => {
    for (const M of [await howto('lib_pull_up'), (await content.loadContent('lib_pull_up')).content]) {
      const base = CL.copyFields(M);
      expect(base.length).toBeGreaterThan(0);
      expect(L.shownCopyFields(M)).toEqual(base);
      expect(L.shownCopyFields(withLine(M, 'Shown on a cable.'))).toEqual([...base, { path: 'copy.variantLine', text: 'Shown on a cable.', kind: 'caption' }]);
      expect(L.shownCopyFields(withLine(M, ''))).toEqual(base);
    }
  });
});

describe('LIB-5v V4: the line counts toward the 450 visible words (sheetWords)', () => {
  it('pull-up (449): a 1-word line is 450 and green, a 2-word line is 451 and red', async () => {
    const M = await howto('lib_pull_up');
    expect(L.sheetWords(M, shared, {})).toEqual({ total: 449, violations: [] });
    expect(L.sheetWords(withLine(M, 'Machine.'), shared, {})).toEqual({ total: 450, violations: [] });
    expect(L.sheetWords(withLine(M, 'Machine: same.'), shared, {})).toEqual({ total: 451, violations: [{ path: '(sheet)', rule: 'visible words > 450', detail: '451' }] });
  });
});

describe('LIB-5v V5: C7 scans, caps and counts copy.variantLine', () => {
  it('a semicolon and 11 words are red; the first n with a visible finding gives exactly 451', async () => {
    const { content: c } = await content.loadContent('lib_pull_up');
    expect(checkC7(c)).toEqual([]);
    expect(checkC7(withLine(c, 'Semicolon; here.'))).toEqual(['C7: copy.variantLine: contains semicolon']);
    expect(checkC7(withLine(c, neutral(11)))).toEqual(['C7: copy.variantLine: 11 words, at most 10']);
    const visible = (n: number) => checkC7(withLine(c, neutral(n))).filter(x => x.startsWith('C7: visible words'));
    // D-LIB5v-C7RANGE: C7 counts pull-up at 346, not the lint's 449, so the first red n is above the card's 60; n runs to 450
    const first = Array.from({ length: 450 }, (_, i) => i + 1).find(n => visible(n).length > 0);
    expect(first).toBeDefined();
    expect(visible(first!)).toEqual(['C7: visible words 451, at most 450']);
    console.log(`LIB-5v V5: C7 visible words on lib_pull_up without a line: ${451 - first!} (first red line: ${first} words)`);
  });
});

describe('LIB-5v V6: C19 reaches the line through shownCopyFields', () => {
  it('\'Call 999.\' gives C19\'s contact finding on copy.variantLine, and nothing else changes', async () => {
    const { content: c } = await content.loadContent('lib_pull_up'), M = await howto('lib_pull_up'), names = CL.sourceNamePatterns([M]);
    const base = checkC19Copy(L.shownCopyFields(c), 'lib_pull_up', names);
    expect(base).toEqual([]);
    const hits = checkC19Copy(L.shownCopyFields(withLine(c, 'Call 999.')), 'lib_pull_up', names);
    expect(hits).toHaveLength(1);
    expect(hits[0]).toMatch(new RegExp(`^C19: lib_pull_up: copy\\.variantLine: ${RULE_CONTACT.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  });
});

describe('LIB-5v V7: the sheet shows the line above the plate', () => {
  const built = (copy: any) => ({ copy }) as unknown as BuiltHowTo;
  it('VariantLine returns a p.ht-variant with the raw text, or null', () => {
    const t = 'Shown on a cable. Machine: <same> & "form".';
    const v: any = VariantLine({ howTo: built({ setupLine: '', mistakeLine: '', variantLine: t }) });
    expect([v?.type, v?.props?.class, v?.props?.children]).toEqual(['p', 'ht-variant', t]);
    expect(VariantLine({ howTo: built({ setupLine: '', mistakeLine: '' }) })).toBeNull();
    expect(VariantLine({ howTo: built({ setupLine: '', mistakeLine: '', variantLine: '' }) })).toBeNull();
    expect(VariantLine({ howTo: built(undefined) })).toBeNull();
  });
  it('HowToSheet.tsx renders <VariantLine directly before <PlateView', () => {
    const lines = readFileSync(join(ROOT, 'src/slices/howto/HowToSheet.tsx'), 'utf8').split('\n');
    const i = lines.findIndex(l => l.trim().startsWith('<PlateView '));
    expect(i).toBeGreaterThan(0);
    expect(lines[i - 1]!.trim()).toBe('<VariantLine howTo={howTo.built} />');
    expect(lines.filter(l => l.includes('<VariantLine'))).toHaveLength(1);
  });
});

describe('LIB-5v V9: the B5 fixture inserts one one-word line on a "/" target only', () => {
  let FX: any, C: any;
  beforeAll(async () => {
    FX = await import(/* @vite-ignore */ url('tools/plates/library/fidelity/fixture.mjs'));
    C = await import(/* @vite-ignore */ url('tools/plates/library/ci/scratch.mjs'));
  });
  it('lib_underhand_lat_pulldown and lib_t_bar_row get \'Machine.\' once, after the clone\'s copy line; the rest get none', () => {
    const all = [...FX.SCRATCH, ...C.SCRATCH_4C];
    const got = Object.fromEntries(all.map((s: any) => [s.id, FX.transformSources(s, ROOT).howto.match(/^ {4}variantLine: .*$/gm) ?? []]));
    expect(got).toEqual({ ...Object.fromEntries(all.map((s: any) => [s.id, []])), lib_underhand_lat_pulldown: ["    variantLine: 'Machine.',"], lib_t_bar_row: ["    variantLine: 'Machine.',"] });
    for (const id of ['lib_underhand_lat_pulldown', 'lib_t_bar_row']) {
      const h = FX.transformSources(all.find((s: any) => s.id === id), ROOT).howto;
      expect(h).toContain("\n  copy: {\n    variantLine: 'Machine.',\n");
      expect(CL.words('Machine.')).toBe(1);
    }
  });
  it('LIB-4c C16 (copyProblems, D-LIB5v-FIXLINE) passes the 6 clones with lib_t_bar_row\'s line', () => {
    expect(C.copyProblems(ROOT)).toEqual([]);
  });
});

/** Runs `node <args>` in `cwd`; resolves { code, out } (stdout + stderr), as library-lint.test.ts does. */
const node = (cwd: string, args: string[]) => new Promise<{ code: number; out: string }>(resolve => {
  const c = spawn(process.execPath, args, { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', code => resolve({ code: code ?? 1, out }));
});

describe('LIB-5v V3/V4: the generator refuses a bad line on any shipped row (E1\'s tree)', () => {
  const T = 900_000, ID = 'lib_cable_lateral_raise';
  let F: any, tree: string, room: number;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(tree);
    const back = (await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs'))).backBox();
    const E1 = await import(/* @vite-ignore */ new URL(`file://${join(tree, F.HOWTO)}`).href);
    room = 450 - L.sheetWords(E1, shared, { back }).total;
  }, T);
  /** A copy of E1's tree with exact-once replacements, each [file, from, to]. */
  const copyWith = (...edits: [string, string, string][]) => {
    const r = mkdtempSync(join(tmpdir(), 'lib5v-e1-')); temps.push(r);
    cpSync(tree, r, { recursive: true, verbatimSymlinks: true });
    for (const [file, from, to] of edits) {
      const p = join(r, file), s = readFileSync(p, 'utf8');
      if (s.split(from).length !== 2) throw new Error(`lib5v fixture: ${from} is not in ${file} exactly once`);
      writeFileSync(p, s.replace(from, to));
    }
    return r;
  };
  const SLASH: [string, string, string] = ['src/data/exercises.json', `"id": "${ID}",\n  "name": "Cable Lateral Raise",\n  "equipment": "Cable",`, `"id": "${ID}",\n  "name": "Cable Lateral Raise",\n  "equipment": "Cable / Machine",`];
  const line = (file: string, text: string): [string, string, string] => [file, '\n  copy: {\n', `\n  copy: {\n    variantLine: '${text}',\n`];
  it('cases (1)-(4) and the 450 case, each with its exact message; a clean line generates and ships', async () => {
    console.log(`LIB-5v V3: E1 room = ${room} words`);
    expect(room).toBeGreaterThanOrEqual(1);
    expect(room + 1).toBeLessThanOrEqual(10);
    const clean = room === 1 ? 'Machine.' : neutral(room);
    const cases: [string, string, string | null, string[]?][] = [
      ['(1) "/" and no line', copyWith(SLASH), `${ID}: copy.variantLine: variant line required: equipment names two kinds (Cable / Machine)`],
      // a line changes the row's content hash, so (2) and (3) re-stamp that row in their copy (C15, D-LIB5-STAMPS) before
      // generating; library-gate.mjs's stamp gate would refuse first otherwise
      ['(2) "/" and a clean line within the room', copyWith(SLASH, line(F.HOWTO, clean)), null, [ID]],
      ['(3) a line on lib_pull_up (one of the 8, no "/")', copyWith(line('tools/plates/layers/exercises/pull_up.howto.mjs', 'Machine.')), 'lib_pull_up: copy.variantLine: variant line on a row whose equipment names one kind (Bodyweight)', ['lib_pull_up']],
      // D-LIB5v-ORDER: library-gate.mjs runs before variant-gate.mjs, so generate stops first on the 450 total; the cap is
      // shown below on variant-gate.mjs's own outputs() in the same copy
      ['(4) an 11-word line on the "/" row', copyWith(SLASH, line(F.HOWTO, neutral(11))), `${ID}: library lint:\n  (sheet): visible words > 450 (${450 - room + 11})`],
      ['V4: room + 1 words on the "/" row', copyWith(SLASH, line(F.HOWTO, neutral(room + 1))), `${ID}: library lint:\n  (sheet): visible words > 450 (451)`],
    ];
    const STAMP = (ids: string[]) => `import { writeScratchStamps } from './tools/plates/library/research/stamps.mjs'; writeScratchStamps(process.cwd(), ${JSON.stringify(ids)});`;
    const results = await mapLimit(cases, 2, async ([name, r, want, restamp]) => {
      const s = restamp ? await node(r, ['--input-type=module', '-e', STAMP(restamp)]) : { code: 0, out: '' };
      if (s.code !== 0) return { name, r, want, ...s };
      return { name, r, want, ...(await node(r, ['tools/plates/generate.mjs'])) };
    });
    for (const x of results) {
      if (x.want === null) expect([x.name, x.code, x.out.slice(-300)]).toEqual([x.name, 0, expect.stringContaining('generate: wrote')]);
      else { expect([x.name, x.code]).not.toEqual([x.name, 0]); expect(x.out, x.name).toContain(`Error: ${x.want}`); }
    }
    const gate = (r: string) => node(r, ['--input-type=module', '-e', "await (await import('./tools/plates/gen/variant-gate.mjs')).outputs(); console.log('variant-gate: pass');"]);
    const [cap, ok, plain] = await Promise.all([gate(results[3]!.r), gate(results[1]!.r), gate(tree)]);
    expect([cap.code, cap.out]).toEqual([1, expect.stringContaining(`Error: ${ID}: copy.variantLine: caption > 10 words (11 words)`)]);
    expect([ok.code, ok.out, plain.code, plain.out]).toEqual([0, expect.stringContaining('variant-gate: pass'), 0, expect.stringContaining('variant-gate: pass')]);
    const built = readFileSync(join(results[1]!.r, `src/howto/generated/ht-${F.CHROME}.ts`), 'utf8');
    expect(built).toContain(`"variantLine": ${JSON.stringify(clean)}`);
  }, T);
});
