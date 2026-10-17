// LIB-4b: the per-id library runner's contract (tools/plates/library/fidelity/tuples.mjs, rows.mjs), its tuple counts
// on the 8 against what the HT blocks observe (B1), the twin drift tripwire (B3) and a missing page (B6). The browser
// runs (B2, B4, B5, B7, B8) are `node tools/plates/library/fidelity.mjs`, recorded on the PR.
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain .mjs build tool, no types
import { CHECKS, LIB_ONCE, PQH_STATES, libraryTuples, parseState, plateKeys, sourceFacts, statesOf } from '../../tools/plates/library/fidelity/tuples.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { recorder, rowProblems, stateOf } from '../../tools/plates/library/fidelity/rows.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { TWINS, mapProblems, pinnedTexts, readPins, twinProblems } from '../../tools/plates/library/fidelity/twins.mjs';
// @ts-expect-error plain .mjs build tool, no types
import { HT_PLATES, HT_THEMES, ht10AllTuples } from '../../tools/plates/fidelity/harness.mjs';

type Tuple = { id: string; theme: string; state: string };
const ROOT = join(__dirname, '..', '..');
const EIGHT: string[] = HT_PLATES.map((p: string[]) => p[1]);
const count = (ts: Tuple[], f: (t: Tuple & { check: string; sub: string; width: number | null }) => boolean) => ts.filter(t => f({ ...t, ...parseState(t.state) })).length;

describe('LIB-4b contract', () => {
  it('state = <check>/<sub>@<width or *>, parsed back exactly; stateOf refuses a mismatch', () => {
    expect(parseState('L3/N:chin@390')).toEqual({ check: 'L3', sub: 'N:chin', width: 390 });
    expect(parseState('PQH/PQ-H7@*')).toEqual({ check: 'PQH', sub: 'PQ-H7', width: null });
    expect(() => parseState('L3/N')).toThrow();
    expect(stateOf('HT7', 'foot:L3', 390)).toBe('HT7/foot:L3@390');
    expect(rowProblems({ id: 'x', theme: 't', state: 'L3/N@390', check: 'L2b', width: 390 })).toHaveLength(1);
    expect(rowProblems({ id: 'x', theme: 't', state: 'L3/N@390', check: 'L3', width: 360 })).toHaveLength(1);
    expect(rowProblems({ id: 'x', theme: 't', state: 'L3/N@390', check: 'L3', width: 390 })).toEqual([]);
  });
  it('LIB_ONCE is the fixed per-shard and per-run set', () => {
    expect(LIB_ONCE.shard(2)).toEqual([
      { id: 'shard-2', theme: 'silent-black', state: 'self/0px@390' },
      { id: 'shard-2', theme: 'silent-black', state: 'self/1px-control@390' },
    ]);
    expect(LIB_ONCE.run).toEqual(['qa-selftest/browser@*', 'guard/L-sections@390', 'guard/HT7-l3text@390', 'guard/HT9-A3-dup@390'].map(state => ({ id: '*', theme: 'silent-black', state })));
    expect(PQH_STATES).toEqual([...Array(10)].map((_, i) => `PQH/PQ-H${i + 1}@*`).concat('PQH/flags@*'));
  });
  it('every tuple of the 8 is unique per (id, theme), names a known check and encodes its width', async () => {
    const ts: Tuple[] = await libraryTuples(EIGHT);
    expect(new Set(ts.map(t => `${t.id}|${t.theme}|${t.state}`)).size).toBe(ts.length);
    for (const t of ts) {
      const p = parseState(t.state);
      expect(CHECKS).toContain(p.check);
      expect([null, 390, 360, 340]).toContain(p.width);
      expect(t.theme === '*').toBe(p.width === null);   // D-LIB4b-KEYS: theme-less exactly when width-less
    }
    expect(ts).toHaveLength(2947);
  });
});

describe('LIB-4b B1: tuples from source match what the HT blocks observe on the 8', () => {
  it('the source facts are the 8\'s (keys, pages, rows, Show buttons)', async () => {
    const f = await Promise.all(EIGHT.map(id => sourceFacts(id)));
    type F = { normal: string[]; tells: string[]; hand: { pages: number }; posture: string[]; rows: string[]; shows: number; grip: boolean; push: boolean; id: string };
    const sum = (g: (x: F) => number) => (f as F[]).reduce((n: number, x: F) => n + g(x), 0);
    expect(sum(x => x.normal.length)).toBe(24);
    expect(sum(x => x.tells.length)).toBe(20);
    expect(sum(x => x.hand.pages)).toBe(13);           // HT-6: "the 13 close-up pages"
    expect(sum(x => x.posture.length)).toBe(16);       // HT-7: 8 x 2 posture close-ups
    expect(sum(x => x.rows.length)).toBe(32);          // HT-8: feel rows
    expect(sum(x => x.shows)).toBe(17);                // HT-9 Show: golden B's 17 "Show me" buttons
    expect((f as F[]).every(x => x.grip)).toBe(true);           // HT-6: 8 grip sections
    expect((f as F[]).filter(x => x.push).map(x => x.id)).toEqual(['lib_machine_chest_press']);   // HT-6 A8: the one push hint
  });
  it('each family equals the count its block observes and prints, and meets every bound it asserts', async () => {
    const ts: Tuple[] = await libraryTuples(EIGHT);
    // HT-3: pixel pairs (pairs >= 300), L2b walks and F3 compares, Trace animation lists
    const l3 = count(ts, t => t.check === 'L3' && t.sub !== 'slot-api');
    expect(l3).toBe(344); expect(l3).toBeGreaterThanOrEqual(300);
    expect(count(ts, t => t.check === 'F3')).toBe(216);
    expect(count(ts, t => t.check === 'L2b' && t.sub !== 'title' && t.sub !== 'sections')).toBe(216);
    expect(count(ts, t => t.check === 'L4' && t.sub === 'anims')).toBe(40);
    expect(count(ts, t => t.check === 'L3' && t.sub === 'slot-api')).toBe(16);   // HT3-A6, every plate in HT_FULL
    // HT-6: close-up pages + grip sections in 5 themes (>= 105); A6 one row per (id, theme) in HT_FULL, >= 2 pairs each (>= 32)
    const ht6 = count(ts, t => t.check === 'HT6' && (t.sub === 'grip' || t.sub.startsWith('page-')));
    expect(ht6).toBe(105);
    expect(count(ts, t => t.check === 'HT6' && t.sub === 'A6') * 4).toBe(64);   // N, M, T@2400, R:end per row; HT-6 prints "A6 64 plate pairs"
    expect(count(ts, t => t.check === 'HT6' && t.sub === 'open-anim')).toBe(40);
    // HT-7: posture L3 pairs, 5 themes + the reduced-motion run (>= 80)
    const ht7 = count(ts, t => t.check === 'HT7' && !t.sub.startsWith('A2') && (t.sub.endsWith(':L3') || t.sub.endsWith(':reduced')));
    expect(ht7).toBe(96); expect(ht7).toBeGreaterThanOrEqual(80);
    expect(count(ts, t => t.check === 'HT7' && t.sub.endsWith(':control'))).toBe(8);
    // HT-8: pixel pairs S5/S4/S6 in 5 themes and the reduced rest in 2 (>= 200)
    const ht8 = count(ts, t => t.check === 'HT8' && /^(S5-end|S5-mid|S4|S6-.+|reduced)$/.test(t.sub));
    expect(ht8).toBe(272); expect(ht8).toBeGreaterThanOrEqual(200);
    expect(count(ts, t => t.check === 'HT8' && t.sub === 'L4')).toBe(40);
    // HT-9: A1 L3 120, A4 copy 120, A3 40; Show 17 buttons x 2 themes; C19 8 x 5; Order 8
    expect(count(ts, t => t.check === 'HT9' && t.sub.endsWith('-L3'))).toBe(120);
    expect(count(ts, t => t.check === 'HT9' && t.sub.endsWith('-copy'))).toBe(120);
    expect(count(ts, t => t.check === 'HT9' && t.sub === 'A3')).toBe(40);
    expect(count(ts, t => t.check === 'HT9' && t.sub.startsWith('show-'))).toBe(34);
    expect(count(ts, t => t.check === 'HT9' && t.sub === 'C19')).toBe(40);
    expect(count(ts, t => t.check === 'HT9' && t.sub === 'order')).toBe(8);
    expect(count(ts, t => t.check === 'HT9' && t.sub === 'A5') * 4).toBe(64);   // HT-9 prints "A5 64 plate pairs"
    // HT-4 A6: 8 x 5 passes; HT-10: exactly HT-10's own per-id tuples
    expect(count(ts, t => t.check === 'HT4' && t.sub === 'A6')).toBe(40);
    const ht10 = (await ht10AllTuples()).filter((t: Tuple) => t.id !== '*');
    expect(count(ts, t => t.check === 'HT10')).toBe(ht10.length);
    // one per id: entry, offline, L2 (page and chunk), PQH (10 hard checks + flags)
    expect(count(ts, t => t.check === 'entry')).toBe(8);
    expect(count(ts, t => t.check === 'offline')).toBe(8);
    expect(count(ts, t => t.check === 'L2')).toBe(24);   // page, chunk, chunk-size (D-LIB4b-SIZE)
    expect(count(ts, t => t.sub === 'A5-size' || (t.check === 'HT8' && t.sub === 'size'))).toBe(16);
    expect(count(ts, t => t.check === 'HT7' && (t.sub === 'A2' || t.sub === 'A2:reduced'))).toBe(48);   // D-LIB4b-COUNTS
    expect(count(ts, t => t.check === 'PQH')).toBe(88);
  });
  it('the narrow widths and the full matrix stay in HT_FULL only', async () => {
    const ts: Tuple[] = await libraryTuples(EIGHT);
    expect(new Set(ts.filter(t => parseState(t.state).width !== null && parseState(t.state).width !== 390).map(t => t.theme))).toEqual(new Set(['silent-black', 'paper']));
    expect(new Set(ts.filter(t => t.theme !== '*').map(t => t.theme))).toEqual(new Set(HT_THEMES));
  });
});

describe('LIB-4b B3: the twin drift tripwire', () => {
  it('every twinned gate group and function is at its pin', async () => {
    const keys = TWINS.map((t: { key: string }) => t.key);
    for (const g of ['HT-2', 'HT-3', 'HT-3b', 'HT-4', 'HT-6', 'HT-7', 'HT-8', 'HT-9']) expect(keys).toContain(`gate:${g}`);
    expect(Object.keys(readPins()).sort()).toEqual([...keys].sort());
    expect(await twinProblems()).toEqual([]);
  });
  it('one changed character in HT-7\'s or HT-4\'s block turns it red, naming the twin', async () => {
    const gate = readFileSync(join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8');
    for (const [key, marker] of [['HT-7', "const tag = 'HT-7';"], ['HT-4', "const tag = 'HT-4';"]] as const) {
      expect(gate.split(marker)).toHaveLength(2);
      const bad: string[] = await twinProblems({ 'scripts/screenshot-gate.mjs': gate.replace(marker, marker.replace("';", "' ;")) });
      expect(bad).toHaveLength(1);
      expect(bad[0]).toMatch(new RegExp(`^gate:${key} changed .*re-check the library twin`));
    }
  });
  it('a changed function a twin re-implements turns it red, a non-exported helper it reaches included', async () => {
    const f = 'tools/plates/fidelity/harness.mjs', h = readFileSync(join(ROOT, f), 'utf8');
    let bad: string[] = await twinProblems({ [f]: h.replace('if (d.ink < 0.05) P(`${id} ${label}: the capture is nearly blank', 'if (d.ink < 0.06) P(`${id} ${label}: the capture is nearly blank') });
    expect(bad).toHaveLength(1);
    expect(bad[0]).toMatch(/^tools\/plates\/fidelity\/harness\.mjs:ht3Fidelity changed .*re-check the library twin fidelity\/plate\.mjs/);
    bad = await twinProblems({ [f]: h.replace("const TEXT_PROPS = ['font-family',", "const TEXT_PROPS = ['font-family', 'font-kerning',") });
    expect(bad.some(m => m.startsWith('tools/plates/fidelity/harness.mjs:ht3Fidelity changed'))).toBe(true);
    const g = 'tools/plates/fidelity/goldenB.mjs', gb = readFileSync(join(ROOT, g), 'utf8');
    bad = await twinProblems({ [g]: gb.replace("if (refs.some(r => r !== undefined && deepEqual(pose, r))) return 'golden';", "if (refs.some(r => deepEqual(pose, r))) return 'golden';") });
    expect(bad).toEqual([expect.stringMatching(/^tools\/plates\/fidelity\/goldenB\.mjs:classifyPose changed/)]);
  });
});

describe('LIB-4b D-LIB4b-MAP: every assertion of a pinned text is mapped', () => {
  type Entry = { m: string; t: string; why?: string; gap?: boolean };
  type Pins = Record<string, { sha256: string; map: Entry[] }>;
  const mapOf = (pins: Pins, key: string): Entry[] => pins[key]?.map ?? [];
  it('each pinned text\'s assertions equal its map, in count and order, and every target resolves', async () => {
    const pins: Pins = readPins();
    expect(mapProblems(await pinnedTexts(), pins)).toEqual([]);
    for (const t of TWINS as { key: string }[]) expect(mapOf(pins, t.key).length).toBeGreaterThan(0);
  });
  it('deleting one map entry turns it red', async () => {
    const pins: Pins = readPins();
    mapOf(pins, 'gate:HT-4').splice(3, 1);
    const bad: string[] = mapProblems(await pinnedTexts(), pins);
    expect(bad).toContain('gate:HT-4: 14 assertion matches, 13 map entries');
  });
  it('a collect variable that reaches errors is red', async () => {
    const pins: Pins = readPins();
    const e = mapOf(pins, 'gate:HT-6').find(x => x.m === 'reqs.push(');
    expect(e).toBeDefined();
    if (e) e.t = 'collect:reqs';
    expect(mapProblems(await pinnedTexts(), pins)).toEqual([expect.stringMatching(/^gate:HT-6 #\d+: collect:reqs reaches errors\/problems/)]);
  });
  it('a new push or throw in a twinned gate block is red, together with B3', async () => {
    const gate = readFileSync(join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8'), marker = "const tag = 'HT-4';";
    expect(gate.split(marker)).toHaveLength(2);
    for (const add of [" bad.push('x');", " if (!tag) throw new Error('x');"]) {
      const over = { 'scripts/screenshot-gate.mjs': gate.replace(marker, marker + add) };
      expect(mapProblems(await pinnedTexts(over), readPins())).toEqual(expect.arrayContaining([expect.stringMatching(/^gate:HT-4: 15 assertion matches, 14 map entries/)]));
      expect(await twinProblems(over)).toEqual([expect.stringMatching(/^gate:HT-4 changed .*re-check the library twin/)]);
    }
  });
});

describe('LIB-4b D-LIB4b-KEYS: keys bound to the pin', () => {
  it('a module copy with one tell dropped makes libraryTuples throw "cues sha256 … != entry"', async () => {
    const root = mkdtempSync(join(tmpdir(), 'lib4b-keys-'));
    try {
      for (const d of ['src/howto/generated', 'tests/howto/golden']) mkdirSync(join(root, d), { recursive: true });
      writeFileSync(join(root, 'tests/howto/golden/GOLDEN.json'), readFileSync(join(ROOT, 'tests/howto/golden/GOLDEN.json')));
      const m = readFileSync(join(ROOT, 'src/howto/generated/ht-pull-up.ts'), 'utf8');
      writeFileSync(join(root, 'src/howto/generated/ht-pull-up.ts'), m);
      expect((await plateKeys('lib_pull_up', 'pull-up', root)).tells).toEqual(['kick', 'short']);
      const dropped = m.replace(/, \{ key: "short", cue: "[^"]*" \}\]/, ']');
      expect(dropped).not.toBe(m);
      writeFileSync(join(root, 'src/howto/generated/ht-pull-up.ts'), dropped);
      await expect(plateKeys('lib_pull_up', 'pull-up', root)).rejects.toThrow(/lib_pull_up: src\/howto\/generated\/ht-pull-up\.ts cues sha256 \w+ != entry/);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-4b B6: a missing page is red, never a skip', () => {
  it('an id without pages gets a fail row for every tuple of the families run', async () => {
    // @ts-expect-error plain .mjs build tool, no types
    const { libraryFidelity } = await import('../../tools/plates/library/fidelity.mjs');
    const out = await libraryFidelity(null, null, { ids: ['lib_pull_up'], pages: {}, families: ['L2', 'PQH'] });
    const want = (await libraryTuples(['lib_pull_up'])).filter((t: Tuple) => ['L2', 'PQH'].includes(parseState(t.state).check));
    expect(out.rows).toHaveLength(want.length);
    expect(out.rows.every((r: { result: string; why: string[] }) => r.result === 'fail' && r.why.some(w => w.includes('no pages for lib_pull_up')))).toBe(true);
  });
  it('the recorder turns an untouched tuple and an unexpected state into fail rows', () => {
    const R = recorder();
    R.ok('a', 't', 'L3/N@390');
    R.ok('a', 't', 'L3/X@390');
    const rows = R.finish([{ id: 'a', theme: 't', state: 'L3/N@390' }, { id: 'a', theme: 't', state: 'L3/M@390' }]);
    expect(rows.map((r: { state: string; result: string }) => `${r.state} ${r.result}`)).toEqual(['L3/N@390 pass', 'L3/M@390 fail', 'L3/X@390 fail']);
  });
  it('statesOf has no state twice for one id', async () => {
    const s: Tuple[] = statesOf(await sourceFacts('lib_dumbbell_lateral_raise'));
    expect(new Set(s.map(x => `${x.theme}|${x.state}`)).size).toBe(s.length);
  });
});
