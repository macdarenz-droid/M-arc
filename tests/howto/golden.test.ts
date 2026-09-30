// HT-1 golden (HT1-A2..A4): the vendored sources rebuild the approved gallery byte for byte, GOLDEN.json holds
// one hash-chained approved entry per exercise, and the reference fixtures cover every equipment primitive.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { GoldenEntry, GoldenFile, GoldenPlateEntry, LibId } from '../../src/howto/types';

const GOLDEN_URL = new URL('../../tools/plates/golden.mjs', import.meta.url).href;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let g: any, run: any, golden: GoldenFile;
const tmps: string[] = [];

beforeAll(async () => {
  g = await import(/* @vite-ignore */ GOLDEN_URL);
  golden = JSON.parse(readFileSync(g.GOLDEN_JSON, 'utf8'));
  run = await g.check();
}, 120_000);
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

const IDS: LibId[] = ['lib_dumbbell_lateral_raise', 'lib_barbell_back_squat', 'lib_pull_up', 'lib_hanging_leg_raise', 'lib_lat_pulldown', 'lib_seated_cable_row', 'lib_leg_press', 'lib_machine_chest_press'];
const plates = () => golden.entries.filter((e): e is GoldenPlateEntry => e.kind === 'plate');

describe('HT1-A2 golden rebuild (L1)', () => {
  it('the full check passes', () => {
    expect(run.problems).toEqual([]);
    expect(run.ok).toBe(true);
  });

  it('build-page.mjs in a temp mirror writes the approved gallery: e2bea90c…, 860,766 B, equal to the committed fixture', () => {
    const fixture = readFileSync(g.FIXTURE);
    expect(run.facts.pageSha256).toBe('e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48');
    expect(run.facts.bytes).toBe(860766);
    expect(g.sha256(fixture)).toBe(run.facts.pageSha256);
    expect(run.facts.firstDiff).toBe(-1);
    expect(Buffer.compare(run.built, fixture)).toBe(0);
  });

  it('a changed spec gives a different sha, fails, and prints the first differing byte offset', async () => {
    const d = mkdtempSync(join(tmpdir(), 'ht1-spec-'));
    tmps.push(d);
    cpSync(g.VENDOR, d, { recursive: true });
    const f = join(d, 'exercises/pull_up.mjs');
    const src = readFileSync(f, 'utf8');
    expect(src).toContain('neck: -14');
    writeFileSync(f, src.replace('neck: -14', 'neck: -13'));   // the end pose's head, 1 deg
    const bad = await g.check({ vendor: d });
    expect(bad.ok).toBe(false);
    const l1 = bad.problems.find((p: string) => p.startsWith('L1 rebuilt gallery'));
    expect(l1).toMatch(/first differing byte at offset \d+ \(node v\d+/);
    expect(bad.facts.firstDiff).toBeGreaterThan(0);
    expect(bad.problems.some((p: string) => p.startsWith('L0 exercises/pull_up.mjs: sha256'))).toBe(true);
  }, 120_000);

  it('firstDiff finds the first differing byte, a length difference, and equality', () => {
    expect(g.firstDiff(Buffer.from('abcd'), Buffer.from('abXd'))).toBe(2);
    expect(g.firstDiff(Buffer.from('abc'), Buffer.from('abcd'))).toBe(3);
    expect(g.firstDiff(Buffer.from('abc'), Buffer.from('abc'))).toBe(-1);
  });
});

describe('HT1-A3 per-exercise golden entries', () => {
  it('one page entry and one plate entry per exercise (8), approved by the owner on 2026-09-30 at bc0f378', () => {
    expect(golden.schema).toBe(1);
    expect(golden.entries[0]).toMatchObject({ kind: 'page', pageSha256: g.PINS.pageSha256, bytes: 860766 });
    expect(plates().map(e => e.id).sort()).toEqual([...IDS].sort());
    for (const e of golden.entries) expect(e).toMatchObject({ approvedBy: 'owner', date: '2026-09-30', ref: 'bc0f378', supersedes: null });
  });

  it('each entry hashes the 9 fragments extracted from the fixture', () => {
    const extracted = g.extractPlates(readFileSync(g.FIXTURE, 'utf8'));
    expect(extracted).toHaveLength(8);
    for (const p of extracted) {
      const e = plates().find(x => x.chromeId === p.chromeId)!;
      expect(Object.keys(e.fragments).sort()).toEqual(['alt', 'cues', 'mistakeAlt', 'mistakeOverlay', 'mistakeSvg', 'normalOverlay', 'normalSvg', 'tells', 'tempo']);
      expect(e.fragments).toEqual(g.fragmentsOf(p));
    }
  });

  it('the fragments are exact slices of the gallery card (plate top to tempo bottom), guides spliced into the normal svg', () => {
    const html = readFileSync(g.FIXTURE, 'utf8');
    for (const p of g.extractPlates(html)) {
      expect(html).toContain(`<figure class="plate" data-mode="normal">${p.normal.svg}${p.normal.overlay}<figcaption class="sr-only">`);
      expect(html).toContain(`<figure class="plate" data-mode="mistake" hidden>${p.mistake.svg}${p.mistake.overlay}<figcaption class="sr-only">`);
      expect(html).toContain(`${p.tells}\n  ${p.tempo}\n</article>`);
      expect(p.normal.cues.length).toBeGreaterThan(0);
      expect(p.mistake.cues.length).toBeGreaterThan(0);
    }
    const lr = g.extractPlates(html).find((p: { chromeId: string }) => p.chromeId === 'lateral-raise');
    expect(lr.normal.svg).toContain('<path data-guide="elbows" style="display:none" ');
  });

  it('records each exercise\'s spec source, svg prefix and chrome id, as the vendored source reproduces it', () => {
    const lr = plates().find(e => e.id === 'lib_dumbbell_lateral_raise')!;
    expect(lr).toMatchObject({ src: 'ref-src', prefix: 'lr', chromeId: 'lateral-raise', slug: 'dumbbell-lateral-raise' });
    for (const e of plates()) {
      expect(run.facts.sources[e.chromeId]).toBe(e.src);
      expect(e.slug).toBe(e.id.slice(4).replace(/_/g, '-'));
      if (e.id !== 'lib_dumbbell_lateral_raise') expect(e).toMatchObject({ src: `exercises/${e.id.slice(4)}.mjs`, prefix: e.slug, chromeId: e.slug });
    }
  });

  it('the hash chain holds', () => {
    expect(g.verifyChain(golden.entries)).toEqual([]);
  });

  it('editing an old entry breaks the chain', () => {
    const edited: GoldenEntry[] = structuredClone(golden.entries) as GoldenEntry[];
    (edited[2] as { fragments: Record<string, string> }).fragments.tempo = '0'.repeat(64);
    const bad: string[] = g.verifyChain(edited);
    expect(bad[0]).toMatch(/^entry 3 \(plate:lib_pull_up\): prev does not match/);
    expect(bad).toHaveLength(golden.entries.length - 3);
  });

  it('a superseding entry needs a decision, must supersede the latest entry, and a second entry must supersede', () => {
    const base = golden.entries;
    const next = { ...plates()[0]!, why: 'test', prev: undefined };
    const at = base.indexOf(plates()[0]!);
    expect(g.verifyChain(g.appendEntry(base, { ...next, supersedes: at }))).toEqual([expect.stringMatching(/needs a decision/)]);
    expect(g.verifyChain(g.appendEntry(base, { ...next, supersedes: at, decision: 'D-TEST' }))).toEqual([]);
    expect(g.verifyChain(g.appendEntry(base, { ...next, supersedes: null }))).toEqual([expect.stringMatching(/must supersede entry/)]);
    expect(g.verifyChain(g.appendEntry(base, { ...next, supersedes: 0, decision: 'D-TEST' }))).toEqual([expect.stringMatching(/the latest .* entry is/)]);
    const twice = g.appendEntry(g.appendEntry(base, { ...next, supersedes: at, decision: 'D-TEST' }), { ...next, why: 'again', supersedes: base.length, decision: 'D-TEST2' });
    expect(g.verifyChain(twice)).toEqual([]);
    expect(g.latestEntries(twice).get(next.id).why).toBe('again');
  });
});

describe('HT1-A4 reference fixtures', () => {
  it('_test_front, _test_side and every selected key of the 8 are committed, byte-equal to the vendored engine\'s render', () => {
    const committed = g.readCommittedFixtures();
    expect(Object.keys(committed).sort()).toEqual(Object.keys(run.probe.fixtures).sort());
    for (const t of ['_test_front.n', '_test_side.n']) expect(committed[t]).toBeDefined();
    for (const p of run.plates) {
      for (const c of p.normal.cues) expect(committed[`${p.chromeId}.n.${c.key}`]).toBeDefined();
      for (const c of p.mistake.cues) expect(committed[`${p.chromeId}.m.${c.key}`]).toBeDefined();
    }
    expect(g.fixtureProblems(run.probe, committed)).toEqual([]);
  });

  it('every PRIMITIVES key is drawn by at least one fixture', () => {
    expect(run.probe.primitives).toHaveLength(20);
    expect(g.uncoveredPrimitives(run.probe, g.readCommittedFixtures())).toEqual([]);
  });

  it('removing one fixture fails; removing the only fixtures that draw a primitive leaves it uncovered', () => {
    const committed = g.readCommittedFixtures();
    const { ['_test_front.n']: _n, ...less } = committed;
    expect(g.fixtureProblems(run.probe, less)).toContain('A4 ref-fixture _test_front.n.html missing');
    const { ['_test_front.m']: _m, ...none } = less;
    expect(g.uncoveredPrimitives(run.probe, none)).toEqual(['dumbbell']);
    expect(g.fixtureProblems(run.probe, none)).toContain('A4 PRIMITIVES covered by no fixture: dumbbell');
  });

  it('a changed fixture byte fails', () => {
    const committed = g.readCommittedFixtures();
    const k = 'pull-up.n.chin';
    expect(g.fixtureProblems(run.probe, { ...committed, [k]: committed[k].replace('<svg', '<svg ') })).toEqual([expect.stringMatching(/^A4 ref-fixture pull-up\.n\.chin\.html differs .* offset 5\)$/)]);
  });
});
