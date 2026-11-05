// F-SCRATCH-SYNTH (card docs/supervisor/verify/f-scratch-synth-card.md; #394 Q-W7-8, D-SHIP-W7-SCRATCH): the LIB-4b and
// LIB-4c scratch sets name synthetic ids (D-LIB8M-SCRATCH7B form), so no scratch or fixture target is a batches/ row.
// Baseline: on main no target of the three sets (lib7b, LIB-4b, LIB-4c) is a batches/ row yet.
import { cpSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(__dirname, '../..');
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let FX: any, C: any, S7: any;
beforeAll(async () => {
  FX = await import(/* @vite-ignore */ url('tools/plates/library/fidelity/fixture.mjs'));
  C = await import(/* @vite-ignore */ url('tools/plates/library/ci/scratch.mjs'));
  S7 = await import(/* @vite-ignore */ url('tests/library/fixtures/lib7b/fixture.mjs'));
});
const batchIds = () => {
  const dir = join(ROOT, 'tools/plates/library/batches');
  return new Set(readdirSync(dir).filter(n => n.endsWith('.json')).flatMap(n => Object.keys(JSON.parse(readFileSync(join(dir, n), 'utf8')).rows ?? {})));
};

describe('F-SCRATCH-SYNTH baseline', () => {
  it('no target of the lib7b, LIB-4b or LIB-4c set is a batches/ row on this head (old real-id entries included)', () => {
    const rows = batchIds(), all = [...S7.SCRATCH_7B, ...FX.SCRATCH, ...C.SCRATCH_4C].map((s: any) => s.id);
    expect(all.filter(id => rows.has(id))).toEqual([]);
  });
});

// a scratch root holding the real exercises.json, coverage data and one batches/ file with lib_hip_thrust as a row
const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const rootWith = (rows: Record<string, unknown> = { lib_hip_thrust: {} }) => {
  const r = mkdtempSync(join(tmpdir(), 'scratch-synth-')); tmps.push(r);
  for (const p of ['src/data/exercises.json', 'tools/plates/library/coverage-archetypes.json']) { mkdirSync(join(r, p, '..'), { recursive: true }); cpSync(join(ROOT, p), join(r, p)); }
  mkdirSync(join(r, 'tools/plates/library/batches'), { recursive: true });
  writeFileSync(join(r, 'tools/plates/library/batches/zz-move.json'), JSON.stringify({ rows }));
  return r;
};
const sets = () => ({ lib7b: S7.SCRATCH_7B, lib4b: FX.SCRATCH, lib4c: C.SCRATCH_4C }) as Record<string, any[]>;

describe('F-SCRATCH-SYNTH: the three sets name synthetic ids', () => {
  it('every lib7b, LIB-4b and LIB-4c target is synthetic (copyOf), outside the real exercises.json, its copyOf inside; all three are clean', () => {
    const ex = new Set(JSON.parse(readFileSync(join(ROOT, 'src/data/exercises.json'), 'utf8')).map((e: any) => e.id));
    for (const [name, set] of Object.entries(sets())) {
      for (const s of set) expect([name, s.id, !!s.copyOf, ex.has(s.id), ex.has(s.copyOf ?? '')]).toEqual([name, s.id, true, false, true]);
      expect([name, FX.scratchTargetProblems(set, ROOT)]).toEqual([name, []]);
    }
    expect(C.setProblems(C.SCRATCH_4C)).toEqual([]);
    for (const s of [...FX.SCRATCH, ...S7.SCRATCH_7B]) expect(C.TAKEN).toContain(s.id);
  });
  it('red 1: a target that is a batches/ row, in any of the three sets (mutation: lib_hip_thrust as a target)', () => {
    const r = rootWith();
    for (const [name, set] of Object.entries(sets())) {
      const bad = set.map((s, i) => (i === 0 ? { id: 'lib_hip_thrust', from: s.from, key: s.key } : s));
      expect([name, FX.scratchTargetProblems(bad, r)]).toEqual([name, ['lib_hip_thrust is a row of batches/zz-move.json']]);
      expect(() => FX.stage(mkdtempSync(join(tmpdir(), 'scratch-synth-st-')), { scratch: bad, real: r })).toThrow(/lib_hip_thrust is a row of batches\/zz-move.json/);
    }
    expect(C.setProblems(C.SCRATCH_4C.map((s: any, i: number) => (i === 0 ? { id: 'lib_hip_thrust', from: s.from, key: s.key } : s)), r)).toEqual(['lib_hip_thrust is a row of batches/zz-move.json']);
    // a synthetic id that a later wave moved into a batch is red too
    expect(FX.scratchTargetProblems(FX.SCRATCH, rootWith({ lib_scratch_fourb_b: {} }))).toEqual(['lib_scratch_fourb_b is a row of batches/zz-move.json']);
  });
  it('red 2: a copyOf id that is in the real exercises.json; a copyOf that is not', () => {
    const real = FX.SCRATCH.map((s: any, i: number) => (i === 1 ? { ...s, id: 'lib_lat_pulldown' } : s));
    expect(FX.scratchTargetProblems(real, ROOT)).toEqual(['lib_lat_pulldown is in src/data/exercises.json (a copyOf id is synthetic)']);
    const gone = C.SCRATCH_4C.map((s: any, i: number) => (i === 2 ? { ...s, copyOf: 'lib_no_such_lift' } : s));
    expect(C.setProblems(gone)).toEqual(['lib_scratch_fourc_c: copyOf lib_no_such_lift is not in src/data/exercises.json']);
  });
  it('D-SCRATCH-SYNTH-COPYOF: transformSources reads a synthetic id\'s copyOf entry; a missing copyOf, and a real id unknown, are refused (the second word for word as before)', () => {
    const s = FX.SCRATCH[0], t = FX.transformSources(s, ROOT), name = JSON.parse(readFileSync(join(ROOT, 'src/data/exercises.json'), 'utf8')).find((e: any) => e.id === s.copyOf).name;
    expect(t.spec).toContain(`id: 'scratch_fourb_a', name: '${name.replace(/'/g, "\\'")}'`);
    expect(t.howto).toContain("id: 'lib_scratch_fourb_a'");
    expect(() => FX.transformSources({ ...s, copyOf: 'lib_no_such_lift' }, ROOT)).toThrow('fixture: lib_scratch_fourb_a: copyOf lib_no_such_lift is not in src/data/exercises.json');
    expect(() => FX.transformSources({ id: 'lib_no_such_lift', from: s.from, key: s.key }, ROOT)).toThrow(/^fixture: lib_no_such_lift is not in src\/data\/exercises.json$/);
  });
  it('addSynthetic: the tree\'s exercises.json gains { ...copyOf entry, id }, its coverage data the archetype; a second run changes nothing', () => {
    const r = rootWith({}), read = (p: string) => readFileSync(join(r, p), 'utf8');
    FX.addSynthetic(r, C.SCRATCH_4C);
    const ex = JSON.parse(read('src/data/exercises.json')), cv = JSON.parse(read('tools/plates/library/coverage-archetypes.json'));
    for (const s of C.SCRATCH_4C) {
      expect(ex.find((e: any) => e.id === s.id)).toEqual({ ...ex.find((e: any) => e.id === s.copyOf), id: s.id });
      expect(cv.archetypes[s.id]).toBe(s.archetype);
    }
    const before = read('src/data/exercises.json') + read('tools/plates/library/coverage-archetypes.json');
    FX.addSynthetic(r, C.SCRATCH_4C);
    expect(read('src/data/exercises.json') + read('tools/plates/library/coverage-archetypes.json')).toBe(before);
  });
});
