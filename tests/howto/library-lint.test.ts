// LIB-5 S7 (Do 5; content.md 4, plan 4.4): the add-only library copy lint (tools/plates/library/lint/index.mjs), its
// generator call (tools/plates/gen/library-gate.mjs, D-LIB5-GATE) and the sweep over every shipped row. Golden B's
// constants are imported unchanged; the pure rules take injected rows or fixture modules (D-LIB5-FIXTURE 6), and the
// generator cases run in per-case copies of E1's tree.
import { spawn } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mapLimit } from './limit';
import exercises from '../../src/data/exercises.json';
import { LIMITS, checkC7 } from './checks/c7';
import { checkC15 } from './checks/c15';
import { RULE_CONTACT, RULE_NAME, RULE_SAFETY, RULE_SOURCE, checkC19Shared } from './checks/c19';
import { SHIPPED } from './shipped-rows';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ROOT = new URL('../../', import.meta.url).pathname;
let L: any, CL: any, shared: any, content: any;
const EIGHT = Object.keys(JSON.parse(readFileSync(join(ROOT, 'tools/plates/plates.json'), 'utf8')));
const temps: string[] = [];
beforeAll(async () => {
  [L, CL, shared, content] = await Promise.all(['tools/plates/library/lint/index.mjs', 'tools/plates/layers/artifact/copy-lint.mjs',
    'tools/plates/layers/howto/shared.mjs', 'tools/plates/gen/content.mjs'].map(p => import(/* @vite-ignore */ url(p))));
});
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });
const howto = (id: string) => import(/* @vite-ignore */ url(`tools/plates/layers/exercises/${id.slice(4)}.howto.mjs`));

describe('LIB-5 S7: golden B\'s limits are imported, and lint/** defines no box limit of its own', () => {
  /** Problems with the box limits under a lint folder: a number assigned to a box-named constant, or a missing import. */
  const boxLimitProblems = (dir: string) => readdirSync(dir).filter(f => f.endsWith('.mjs')).flatMap(f => {
    const t = readFileSync(join(dir, f), 'utf8'), bad = [...t.matchAll(/\b(\w*(?:BOX|Box|box)\w*)\s*[=:]\s*(\d+)/g)].map(m => `${f}: ${m[1]} = ${m[2]}`);
    if (f === 'index.mjs' && !/import \{[^}]*\bRED_FLAG_BOX_MAX_WORDS\b[^}]*\} from '\.\.\/\.\.\/layers\/artifact\/copy-lint\.mjs'/.test(t)) bad.push(`${f}: RED_FLAG_BOX_MAX_WORDS is not imported from copy-lint.mjs`);
    // BOX-CAP (D-BOXCAP-WIRE): a quoted key holding a number is a limit too ('x': 50). box-caps.mjs is the one named
    // exception (D-BOXCAP-1), its table pinned below to { 'back-pain-box': 50 }.
    if (f !== 'box-caps.mjs') bad.push(...[...t.matchAll(/(['"`])([^'"`\n]*)\1\s*:\s*(\d+)/g)].map(m => `${f}: '${m[2]}' = ${m[3]}`));
    return bad;
  });
  it('c7\'s LIMITS.redFlagBoxWords and golden B\'s RED_FLAG_BOX_MAX_WORDS are both 30', () => {
    expect([LIMITS.redFlagBoxWords, CL.RED_FLAG_BOX_MAX_WORDS]).toEqual([30, 30]);
    expect(LIMITS.visibleWordsMax).toBe(CL.VISIBLE_WORDS_MAX);
  });
  it('every red-flag box limit under tools/plates/library/lint/** is the imported 30; a second limit of 50 is red', () => {
    const dir = join(ROOT, 'tools/plates/library/lint');
    expect(boxLimitProblems(dir)).toEqual([]);
    const t = mkdtempSync(join(tmpdir(), 'lib5-lint-')); temps.push(t);
    cpSync(dir, t, { recursive: true });
    writeFileSync(join(t, 'index.mjs'), `${readFileSync(join(t, 'index.mjs'), 'utf8')}\nexport const BACK_BOX_MAX_WORDS = 50;\n`);
    expect(boxLimitProblems(t)).toEqual(['index.mjs: BACK_BOX_MAX_WORDS = 50']);
  });
  it('BOX-CAP (D-BOXCAP-1): box-caps.mjs is the one named exception, pinned; a quoted \'x\': 50 anywhere else is red', async () => {
    const C = await import(/* @vite-ignore */ url('tools/plates/library/lint/box-caps.mjs'));
    expect(C.NAMED_BOX_CAPS).toEqual({ 'back-pain-box': 50 });
    const dir = join(ROOT, 'tools/plates/library/lint'), t = mkdtempSync(join(tmpdir(), 'boxcap-s7-')); temps.push(t);
    cpSync(dir, t, { recursive: true });
    writeFileSync(join(t, 'index.mjs'), `${readFileSync(join(t, 'index.mjs'), 'utf8')}\nexport const CAPS = { 'x': 50 };\n`);
    expect(boxLimitProblems(t)).toEqual(["index.mjs: 'x' = 50"]);
  });
});

describe('LIB-5 S7: the 8 pass every library rule (sweep)', () => {
  it('lintLibraryRow on each of the 8 returns [] (golden B\'s own lint, medical bans, FIX_VERBS, box reach, the visible total)', async () => {
    for (const id of EIGHT) expect([id, L.lintLibraryRow(await howto(id), shared)]).toEqual([id, []]);
  });
  it('mutations: \'treats\' in a copy line, a fix that starts with no verb, each red', async () => {
    const M = await howto('lib_pull_up');
    const treats = { ...M, default: { ...M.default, copy: { ...M.default.copy, setupLine: `${M.default.copy.setupLine} It treats sore elbows.` } } };
    expect(L.medicalBans(treats)).toEqual([{ path: 'copy.setupLine', rule: 'medical claim (content.md 4)', detail: '"treats"' }]);
    const rows = M.default.feel.rows.map((r: any, i: number) => (i ? r : { ...r, fix: `Gently ${r.fix}` }));
    expect(L.fixVerbs({ ...M, default: { ...M.default, feel: { ...M.default.feel, rows } } })).toEqual([expect.objectContaining({ rule: 'row fix must start with a verb in FIX_VERBS', detail: '"gently"' })]);
  });
});

describe('LIB-5 D-LIB5-WORDS: the visible total counts every box', () => {
  const box = (now: string) => ({ name: 'Spine pain', now, doctor: 'See a doctor.', claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } });
  it('(a) with no extra box, the total equals golden B\'s lintHowto on each module namespace', async () => {
    const want: Record<string, number> = { lib_dumbbell_lateral_raise: 444, lib_barbell_back_squat: 450, lib_pull_up: 449, lib_hanging_leg_raise: 442, lib_lat_pulldown: 449, lib_seated_cable_row: 449, lib_leg_press: 449, lib_machine_chest_press: 444 };
    for (const id of EIGHT) {
      const M = await howto(id);
      expect([id, L.sheetWords(M, shared, {}).total]).toEqual([id, want[id]]);
      expect(L.sheetWords(M, shared, {}).total).toBe(CL.lintHowto(M, shared).words.total);
    }
  });
  it('(b) a back-flagged fixture sheet with an 8-word box is green at 450 and red at 451', async () => {
    const M = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/back-sheet.mjs'));
    expect(M.default.riskFlags).toEqual(['wrist', 'back']);
    expect(CL.lintHowto(M, shared).words.total).toBe(442);
    expect(L.sheetWords(M, shared, { back: box('Alpha bravo today.') })).toEqual({ total: 450, violations: [] });
    expect(L.sheetWords(M, shared, { back: box('Alpha bravo charlie today.') })).toEqual({ total: 451, violations: [{ path: '(sheet)', rule: 'visible words > 450', detail: '451' }] });
    expect(L.sheetWords(M, shared, {}).violations).toEqual([{ path: 'riskFlags(back)', rule: 'no red-flag box for this flag', detail: '' }]);
  });
  it('mutation: the namespace replaced by { default } loses THUMB_PAGE (pull-up 423, not 449)', async () => {
    const M = await howto('lib_pull_up');
    expect(L.sheetWords({ default: M.default }, shared, {}).total).toBe(423);
  });
});

describe('LIB-5 D-LIB5-REACH: the lint names exactly what c7 and C19 name on a box', () => {
  /** The rule tokens a lint result names, and the ones checkC7 (redFlag lines) plus checkC19Shared name. */
  const lintTokens = (bad: any[]) => [...new Set(bad.map(b => /words$/.test(b.rule) && /^red-flag box/.test(b.rule) ? 'count' : /today/.test(b.rule) ? 'today' : /doctor/.test(b.rule) ? 'doctor'
    : /contact/.test(b.rule) ? 'contact' : /source or evidence/.test(b.rule) ? 'source' : /call, phone/.test(b.rule) ? 'safety' : /registry source/.test(b.rule) ? 'name' : `other: ${b.rule}`))].sort();
  const refTokens = (c7: string[], c19: string[]) => [...new Set([
    ...c7.filter(l => l.startsWith('C7: redFlag')).map(l => /^C7: redFlag: \d+ words/.test(l) ? 'count' : /"today"/.test(l) ? 'today' : /"doctor"/.test(l) ? 'doctor' : `c7-other: ${l}`),
    ...c19.map(l => l.includes(RULE_CONTACT) ? 'contact' : l.includes(RULE_SOURCE) ? 'source' : l.includes(RULE_SAFETY) ? 'safety' : l.includes(RULE_NAME) ? 'name' : `c19-other: ${l}`),
  ])].sort();
  const NOW = 'Alpha bravo charlie delta echo foxtrot golf hotel india juliet kilo lima? Get it checked today.';
  const DOC = 'Mike november oscar papa quebec romeo sierra tango uniform? See a doctor.';
  const fixtures: [string, any, string[]][] = [
    ['30 words, clean', { name: 'Spine pain', now: NOW, doctor: DOC }, []],
    ['31 words', { name: 'Spine pain', now: NOW, doctor: 'Mike november oscar papa quebec romeo sierra tango uniform zulu? See a doctor.' }, ['count']],
    ['no "today"', { name: 'Spine pain', now: NOW.replace('today', 'soon'), doctor: DOC }, ['today']],
    ['no "doctor"', { name: 'Spine pain', now: NOW, doctor: DOC.replace('See a doctor.', 'See a nurse.') }, ['doctor']],
    ['"Call 999"', { name: 'Spine pain', now: NOW.replace('Get it checked today.', 'Call 999 today.'), doctor: DOC }, ['contact', 'safety']],
  ];
  it('the five neutral fixtures: lint tokens === c7 + C19 tokens === the expected set', async () => {
    const back = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/shared/back-pain-box.json'), 'utf8')).box;
    const { content: c } = await content.loadContent('lib_pull_up');
    for (const [name, box, want] of fixtures) {
      for (const f of ['name', 'now', 'doctor']) expect(box[f]).not.toBe(back[f].text);
      for (const s of [box.now, box.doctor]) for (const x of CL.sentences(s)) expect(CL.words(x)).toBeLessThanOrEqual(15);
      const B = { ...box, claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } };
      const got = lintTokens(L.boxReach('redFlag(back)', B)), ref = refTokens(checkC7({ ...c, redFlag: B }), checkC19Shared({ RED_FLAG_BACK: B, DISCLAIMER: shared.DISCLAIMER }, 'back'));
      expect([name, got]).toEqual([name, want]);
      expect([name, ref]).toEqual([name, want]);
    }
  });
  it('S4 (Do 9): the answered back box under its key: lint === c7 (boxKey) + C19 === []; at the named limit + 1, both name the count', async () => {
    const back = (await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs'))).backBox();
    const { content: c } = await content.loadContent('lib_pull_up'), KEY = 'back-pain-box';
    const both = (B: any) => [lintTokens(L.boxReach('redFlag(back)', B, [], KEY)), refTokens(checkC7({ ...c, redFlag: B }, { boxKey: KEY }), checkC19Shared({ RED_FLAG_BACK: B, DISCLAIMER: shared.DISCLAIMER }, 'back'))];
    expect(CL.words([back.name, back.now, back.doctor].join(' '))).toBe(50);
    expect(both(back)).toEqual([[], []]);
    expect(L.backBoxRules('RED_FLAG_BACK', back)).toEqual([]);
    expect(both({ ...back, doctor: 'No better in a few weeks? See a doctor soon.' })).toEqual([['count'], ['count']]);
    // 'Call 999' and 'today' removed on the answered box itself (S4; review 121df94)
    expect(both({ ...back, now: back.now.replace('Get emergency help now.', 'Call 999 now.') })).toEqual([['contact', 'safety'], ['contact', 'safety']]);
    expect(both({ ...back, now: back.now.replace('See a doctor today.', 'See a doctor.') })).toEqual([['today'], ['today']]);
    // with no key the box is held to 30, in both the lint and c7: BOX-CAP names this one key only
    expect([lintTokens(L.boxReach('redFlag(back)', back)), refTokens(checkC7({ ...c, redFlag: back }), [])]).toEqual([['count'], ['count']]);
    expect((back.now.match(/Get emergency help now\./g) ?? []).length).toBe(1);
    // each kept trigger dropped, and nhs-back removed, is red
    for (const t of L.BACK_BOX_TRIGGERS) expect(L.backBoxRules('RED_FLAG_BACK', { ...back, now: back.now.replace(t, '') }).map((x: any) => x.rule)).toEqual(['kept back-box trigger missing (D-LIB5-BOX)']);
    expect(L.backBoxRules('RED_FLAG_BACK', { ...back, claim: { tags: ['CONSENSUS'], sources: [] } }).map((x: any) => x.rule)).toEqual(['the back box must cite nhs-back (S4)']);
    expect(L.BACK_BOX_TRIGGERS).toHaveLength(7);
  });
  it('the same comparison on every shipped row\'s red-flag boxes', async () => {
    for (const r of SHIPPED) {
      const M = await import(/* @vite-ignore */ url((await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'))).sourceOf(r.id)));
      const { content: c } = await content.loadContent(r.id);
      for (const f of M.default.riskFlags ?? ['wrist']) {
        const B = shared[CL.RED_FLAG_BLOCKS[f].exp];
        expect([r.id, f, lintTokens(L.boxReach(`redFlag(${f})`, B))]).toEqual([r.id, f, refTokens(checkC7({ ...c, redFlag: B }), checkC19Shared({ RED_FLAG: B, DISCLAIMER: shared.DISCLAIMER }, f))]);
      }
    }
  });
});

describe('LIB-5 D-LIB5-VARIANT / VARIANT8: the variant-line rule', () => {
  const SLASH = ['lib_lat_pulldown', 'lib_leg_press'];
  it('the 23 exercises.json ids whose equipment has "/" are pinned, and the exemption is exactly the 8\'s two', () => {
    const slash = (exercises as any[]).filter(e => String(e.equipment).includes('/')).map(e => e.id).sort();
    expect(slash.length).toBe(23);
    expect(EIGHT.length).toBe(8);
    expect([...L.VARIANT_LINE_EXEMPT].sort()).toEqual(SLASH);
    expect(L.eightWithSlash(EIGHT, exercises)).toEqual(SLASH);
  });
  it('cases: missing on a "/" row, a line with no "/", 11 words, a ban, each red; clean and exempt rows green', () => {
    const f = (o: any) => L.variantLine({ id: 'lib_x', ...o }).violations.map((x: any) => x.rule);
    expect(f({ equipment: 'Cable / Machine' })).toEqual(['variant line required: equipment names two kinds']);
    expect(f({ equipment: 'Cable', line: 'Shown with a cable.' })).toEqual(['variant line on a row whose equipment names one kind']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable machine here. Machine: the same rules hold.' })).toEqual(['caption > 10 words']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable; machine: same rules.' })).toEqual(['banned: semicolon']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable. It treats pain.' })).toEqual(['medical claim (content.md 4)']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable. Call 999.' })).toEqual(['no contact or emergency wording (LR-23)']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable. Numb hands? Stop.' })).toEqual(['own red-flag wording (link the shared box, C8)']);
    expect(f({ equipment: 'Cable / Machine', line: 'Shown with a cable. Machine: same rules.' })).toEqual([]);
    expect(f({ equipment: 'Cable' })).toEqual([]);
    expect(L.variantLine({ id: 'lib_lat_pulldown', equipment: 'Cable / Machine' }).violations).toEqual([]);
    expect(L.variantLine({ id: 'lib_underhand_lat_pulldown', equipment: 'Cable / Machine' }).violations).toHaveLength(1);
    expect(L.variantLine({ id: 'lib_x', equipment: 'Cable / Machine', line: 'Shown with a cable. Machine: same rules.' }).words).toBe(7);
  });
  /** The tripwire: every shipped row with "/" and no line is red, except the exemption (exact ids). LIB-5v: the line is
   *  read from each row's content (`c`, loadContent's for a shipped row; injected rows bring their own or none). */
  const tripwire = (rows: { id: string; c?: any }[], ex: any[]) => rows.flatMap(r => L.variantLine({ id: r.id, equipment: ex.find(e => e.id === r.id)?.equipment, line: L.variantLineOf(r.c) }).violations.map((v: any) => `${r.id}: ${v.rule}`));
  it('tripwire over every shipped row is green on main; injected rows and data are red', async () => {
    const ROWS = await Promise.all(SHIPPED.map(async r => ({ ...r, c: (await content.loadContent(r.id)).content })));
    expect(tripwire(ROWS as any, exercises as any[])).toEqual([]);
    expect(tripwire([...ROWS, { id: 'lib_underhand_lat_pulldown' }] as any, exercises as any[])).toEqual(['lib_underhand_lat_pulldown: variant line required: equipment names two kinds']);
    const moved = (exercises as any[]).map(e => (e.id === 'lib_pull_up' ? { ...e, equipment: 'Bar / Rings' } : e));
    expect(tripwire(ROWS as any, moved)).toEqual(['lib_pull_up: variant line required: equipment names two kinds']);
    // LIB-5v V6: injected underhand content with its line is green; lib_pull_up's content given a line is red (one kind)
    expect(tripwire([...ROWS, { id: 'lib_underhand_lat_pulldown', c: { copy: { setupLine: '', mistakeLine: '', variantLine: 'Machine.' } } }] as any, exercises as any[])).toEqual([]);
    const lined = ROWS.map(r => (r.id === 'lib_pull_up' ? { ...r, c: { ...r.c, copy: { ...r.c.copy, variantLine: 'Machine.' } } } : r));
    expect(tripwire(lined as any, exercises as any[])).toEqual(['lib_pull_up: variant line on a row whose equipment names one kind']);
    expect(L.eightWithSlash(EIGHT, moved)).not.toEqual([...L.VARIANT_LINE_EXEMPT].sort());
    const lost = (exercises as any[]).map(e => (e.id === 'lib_leg_press' ? { ...e, equipment: 'Machine' } : e));
    expect(L.eightWithSlash(EIGHT, lost)).not.toEqual([...L.VARIANT_LINE_EXEMPT].sort());
  });
});

describe('LIB-5 D-LIB5-FAMILY: one label per fault key, and no row that declares inheritance', () => {
  it('familyLabels: one key with two labels is red; the 8\'s faults alone are clean', async () => {
    const eight = [];
    for (const id of EIGHT) eight.push({ src: id, faults: ((await howto(id)).default.handling?.faults ?? []).filter((f: any) => typeof f === 'object') });
    expect(eight.reduce((a, s) => a + s.faults.length, 0)).toBeGreaterThan(0);
    expect(L.familyLabels(eight)).toEqual([]);
    expect(L.familyLabels([...eight, { src: 'fixture', faults: [{ key: 'hand-ahead', label: 'Hand ahead' }] }, { src: 'card', faults: [{ key: 'hand-ahead', label: 'Hands too far forward' }] }]))
      .toEqual([{ path: 'fault hand-ahead', rule: 'one label per fault key (content.md 4, family consistency)', detail: '"Hands too far forward" (card) vs "Hand ahead" (fixture)' }]);
  });
  it('familyRefusal: extends, an inherit entry or inherit true refuse; inherit [] and no card pass', () => {
    const read = (o: any) => () => o;
    expect(L.familyRefusal('lib_x', { extends: 'lib_y' }, read(null))).toBe('lib_x: family: extends: inherited-string map not ruled (D-LIB5-FAMILY)');
    expect(L.familyRefusal('lib_x', { research: { card: 'c.json' } }, read({ inherit: [{ field: 'grip.thumb' }] }))).toBe('lib_x: family: c.json#inherit: inherited-string map not ruled (D-LIB5-FAMILY)');
    expect(L.familyRefusal('lib_x', { research: { card: 'c.json' } }, read({ inherit: true }))).toMatch(/#inherit/);
    expect(L.familyRefusal('lib_x', { research: { card: 'c.json' } }, read({ inherit: [] }))).toBeNull();
    expect(L.familyRefusal('lib_x', { research: { card: 'c.json' } }, read(null))).toBeNull();
  });
});

/** Runs `node <args>` in `cwd`; resolves { code, out } (stdout + stderr), as library-rows.test.ts does. */
const node = (cwd: string, args: string[]) => new Promise<{ code: number; out: string }>(resolve => {
  const c = spawn(process.execPath, args, { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', code => resolve({ code: code ?? 1, out }));
});

describe('LIB-5 S7 generator cases: E1\'s row in per-case copies of E1\'s tree (D-LIB5-FIXTURE)', () => {
  const T = 900_000;
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(tree);
  }, T);
  /** A copy of E1's tree with one exact-once replacement in `file` (the How-to, or the scratch card for the family cases). */
  const copyWith = (file: string, from: string, to: string) => {
    const r = mkdtempSync(join(tmpdir(), 'lib5-lint-e1-')); temps.push(r);
    cpSync(tree, r, { recursive: true, verbatimSymlinks: true });
    const p = join(r, file), s = readFileSync(p, 'utf8');
    if (s.split(from).length !== 2) throw new Error(`lib5 fixture: ${from} is not in ${file} exactly once`);
    writeFileSync(p, s.replace(from, to));
    return r;
  };
  /** A copy of E1's tree with the fixture hand module (LIB-7's shape) added under tools/plates/library/hands/. */
  const withHand = (from = '', to = '') => {
    const r = mkdtempSync(join(tmpdir(), 'lib5-lint-e1-')); temps.push(r);
    cpSync(tree, r, { recursive: true, verbatimSymlinks: true });
    const t = readFileSync(join(ROOT, 'tests/howto/fixtures/lib5/hands/hand-fixture.mjs'), 'utf8');
    if (from && t.split(from).length !== 2) throw new Error(`lib5 fixture: ${from} is not in hand-fixture.mjs exactly once`);
    mkdirSync(join(r, 'tools/plates/library/hands'), { recursive: true });
    writeFileSync(join(r, 'tools/plates/library/hands/hand-fixture.mjs'), from ? t.replace(from, to) : t);
    return r;
  };
  const SETUP = "setupLine: 'Hang still on straight arms, legs together. Pull your shoulders down, then start.',";
  it('cases, each refused with its exact message; the control (inherit []) and the unedited tree generate', async () => {
    const cases: [string, () => string, string | null][] = [
      ['\'treats\' in copy.setupLine', () => copyWith(F.HOWTO, SETUP, SETUP.replace('then start.', 'then start, as this treats sore elbows.')),
        'lib_cable_lateral_raise: library lint:\n  copy.setupLine: medical claim (content.md 4) ("treats")'],
      ['M1: extends on the How-to', () => copyWith(F.HOWTO, "id: 'lib_cable_lateral_raise',", "id: 'lib_cable_lateral_raise', extends: 'lib_pull_up',"),
        'lib_cable_lateral_raise: family: extends: inherited-string map not ruled (D-LIB5-FAMILY)'],
      ['M2: one inherit entry on the scratch card', () => copyWith(F.CARD_FILE, '"topFault":', '"inherit": [{ "field": "grip.thumb", "why": "fixture" }],\n  "topFault":'),
        `lib_cable_lateral_raise: family: ${F.CARD_FILE}#inherit: inherited-string map not ruled (D-LIB5-FAMILY)`],
      ['M3: inherit true on the scratch card', () => copyWith(F.CARD_FILE, '"topFault":', '"inherit": true,\n  "topFault":'),
        `lib_cable_lateral_raise: family: ${F.CARD_FILE}#inherit: inherited-string map not ruled (D-LIB5-FAMILY)`],
      ['D-LIB5-FAULTKEYS 4: a hand module labels hand-ahead \'Hands forward\'', () => withHand("'hand-ahead': { label: 'Hand ahead'", "'hand-ahead': { label: 'Hands forward'"),
        'library family (rows 13, shared 14, hands 3):\n  fault hand-ahead: one label per fault key (content.md 4, family consistency) ("Hands forward" (hand-fixture.mjs) vs "Hand ahead" (hands.mjs#PALM_FLAT))'],
      ['control: the fixture hand module as it is', () => withHand(), null],
      ['control: inherit [] on the scratch card', () => copyWith(F.CARD_FILE, '"topFault":', '"inherit": [],\n  "topFault":'), null],
      ['control: the unedited tree', () => tree, null],
    ];
    const results = await mapLimit(cases, 2, async ([name, make, want]) => ({ name, want, ...(await node(make(), ['tools/plates/generate.mjs'])) }));
    for (const x of results) {
      if (x.want === null) expect([x.name, x.code, x.out.slice(-300)]).toEqual([x.name, 0, expect.stringContaining('generate: wrote')]);
      else { expect([x.name, x.code]).not.toEqual([x.name, 0]); expect(x.out, x.name).toContain(`Error: ${x.want}`); }
    }
  }, T);
});

describe('LIB-5 D-LIB5-FAULTKEYS 4: the family reader over the 8, the shared modules and hand-*.mjs (fixture hand module)', () => {
  const FX = join(ROOT, 'tests/howto/fixtures/lib5/hands');
  let FM: any;
  beforeAll(async () => { FM = await import(/* @vite-ignore */ url('tools/plates/library/lint/family.mjs')); });
  const eightSrc = async () => FM.eightSources(await Promise.all(EIGHT.map(async id => ({ src: id, M: await howto(id) }))));
  /** A shared module namespace in the shape LIB-5's hand modules export (PALM_FLAT after D-LIB5-FAULTKEYS). */
  const SHARED_FX = [{ src: 'fixture-shared.mjs', M: { PALM_FLAT: { faults: [{ key: 'hand-ahead', label: 'Hand ahead', what: 'x' }] }, NOTE: 'no faults' } }];
  /** A temp copy of the fixture folder with one exact-once replacement in hand-fixture.mjs. */
  const fixtureWith = (from: string, to: string) => {
    const d = mkdtempSync(join(tmpdir(), 'lib5-hands-')); temps.push(d);
    cpSync(FX, d, { recursive: true });
    const p = join(d, 'hand-fixture.mjs'), t = readFileSync(p, 'utf8');
    if (t.split(from).length !== 2) throw new Error(`lib5 fixture: ${from} is not in hand-fixture.mjs exactly once`);
    writeFileSync(p, t.replace(from, to));
    return d;
  };
  it('reads the fixture: 3 hand faults, equal to what VARIANTS exports; counts printed; no label conflict', async () => {
    const mods = await FM.handModules(FX), eight = await eightSrc();
    expect(mods.map((m: any) => m.src)).toEqual(['hand-fixture.mjs']);
    const hands = FM.handSources(mods);
    expect(hands).toEqual([{ src: 'hand-fixture.mjs', faults: [{ key: 'hand-ahead', label: 'Hand ahead' }, { key: 'cupped-palm', label: 'Palm cupped' }, { key: 'curled', label: 'Wrist curled' }] }]);
    expect(FM.exportedHandFaults(mods)).toBe(3);
    const shared = FM.sharedSources(SHARED_FX);
    expect(shared).toEqual([{ src: 'fixture-shared.mjs#PALM_FLAT', faults: [{ key: 'hand-ahead', label: 'Hand ahead' }] }]);
    const r = FM.familyCheck({ eight, shared, hands, handMods: mods });
    console.log(`family reader (fixture): 8 ${r.counts.eight}, shared ${r.counts.shared}, hands ${r.counts.hands}`);
    expect(r.counts.eight).toBeGreaterThan(0);
    expect([r.counts.shared, r.counts.hands]).toEqual([1, 3]);
    expect(r.problems).toEqual([]);
  });
  it('mutation: the fixture\'s hand-ahead labelled \'Hands forward\' is red', async () => {
    const mods = await FM.handModules(fixtureWith("'hand-ahead': { label: 'Hand ahead'", "'hand-ahead': { label: 'Hands forward'"));
    const r = FM.familyCheck({ eight: await eightSrc(), shared: FM.sharedSources(SHARED_FX), hands: FM.handSources(mods), handMods: mods });
    expect(r.problems).toEqual([{ path: 'fault hand-ahead', rule: 'one label per fault key (content.md 4, family consistency)', detail: '"Hands forward" (hand-fixture.mjs) vs "Hand ahead" (fixture-shared.mjs#PALM_FLAT)' }]);
  });
  it('mutations: the reader returning 0 faults, or dropping one, on the fixture is red; 0 from the 8 or the shared modules is red', async () => {
    const mods = await FM.handModules(FX), eight = await eightSrc(), shared = FM.sharedSources(SHARED_FX), hands = FM.handSources(mods);
    const rules = (x: any) => FM.familyCheck({ eight, shared, hands, handMods: mods, ...x }).problems.map((p: any) => `${p.rule}${p.detail ? ` (${p.detail})` : ''}`);
    expect(rules({ hands: [] })).toEqual(['hand faults read differ from the faults the hand modules export (0 read, 3 exported)', 'the hand modules export faults but none were read']);
    expect(rules({ hands: [{ ...hands[0], faults: hands[0].faults.slice(1) }] })).toEqual(['hand faults read differ from the faults the hand modules export (2 read, 3 exported)']);
    expect(rules({ eight: [] })).toEqual(['the 8\'s fault count is 0']);
    expect(rules({ shared: [] })).toEqual(['the shared modules\' fault count is 0']);
  });
  it('the sweep: rule (a) over every shipped row, the shared modules and hand-*.mjs on this head: counts above 0, no conflict', async () => {
    const R = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const rows = await Promise.all(SHIPPED.map(async r => ({ src: r.id, M: await import(/* @vite-ignore */ url(R.sourceOf(r.id))) })));
    const r = await FM.treeFamily(rows);
    console.log(`family reader (this head): rows ${r.counts.eight}, shared ${r.counts.shared}, hands ${r.counts.hands}`);
    expect([r.counts.eight > 0, r.counts.shared > 0, r.counts.hands]).toEqual([true, true, 0]);
    expect(r.problems).toEqual([]);
  });
  it('on this head: no hand-*.mjs (LIB-7/12 merge after LIB-5, D-LIB5-ORDER), so the hands count is 0 and equals what is exported', async () => {
    const mods = await FM.handModules();
    expect(mods).toEqual([]);
    expect([FM.handSources(mods), FM.exportedHandFaults(mods)]).toEqual([[], 0]);
  });
});

describe('LIB-5 Do 5 sweep: every shipped row passes C1-C4, C7, C8, C15, C16 and C19, with every red-flag box it shows', () => {
  it(`${SHIPPED.length} shipped rows, no finding`, async () => {
    const [{ checkC1 }, { checkC2 }, { checkC3 }, { checkC4 }, { checkC8 }, { checkC16 }, C19] = await Promise.all([
      import('./checks/c1'), import('./checks/c2'), import('./checks/c3'), import('./checks/c4'), import('./checks/c8'), import('./checks/c16'), import('./checks/c19')]);
    const S = await import(/* @vite-ignore */ url('tools/plates/library/research/stamps.mjs'));
    const R = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const SOURCES = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/sources.json'), 'utf8').replace(/^\/\/[^\n]*\n/, ''));
    const reviews = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/reviews.json'), 'utf8'));
    const known = new Set((exercises as any[]).map(e => e.id));
    expect(SHIPPED.length).toBeGreaterThanOrEqual(8);
    for (const r of SHIPPED) {
      const { content: c } = await content.loadContent(r.id), M = await import(/* @vite-ignore */ url(R.sourceOf(r.id)));
      const names = CL.sourceNamePatterns([M]), plate = await S.plateFragmentsOf(r.id);
      expect(Object.keys(plate)).toHaveLength(9);
      const boxes = Object.fromEntries((c.riskFlags ?? ['wrist']).map((f: string) => [`RED_FLAG_${f.toUpperCase()}`, shared[CL.RED_FLAG_BLOCKS[f].exp]]));
      const bad = [
        ...checkC1(c, known), ...checkC2(c), ...checkC3(c, (exercises as any[]).find(e => e.id === r.id)?.equipment ?? ''), ...checkC4(c), ...checkC7(c),
        ...checkC8(c, SOURCES), ...checkC15(c, plate, reviews), ...checkC16(c),
        ...C19.checkC19Copy(L.shownCopyFields(c), r.id, names), ...checkC19Shared({ ...boxes, DISCLAIMER: shared.DISCLAIMER }, r.id, names),
        ...L.lintLibraryRow(M, shared).map((x: any) => `lint: ${x.path}: ${x.rule}`),
      ];
      expect([r.id, bad]).toEqual([r.id, []]);
    }
  });
});
