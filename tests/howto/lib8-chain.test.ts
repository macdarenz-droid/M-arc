// LIB-8M (pilot A review gap 2; D-LIB8M-CHAIN, implementing D-LIB-O5 6(b)-(c)): which approvals a golden chain holds.
// GOLDEN.json stays 'owner' only; a per-batch file may also hold first 'supervisor' plate/page entries and
// 'supervisor' layers-page entries, each with a decision and an approval "<comment url> @ <40-hex sha>".
// Run: npx vitest run tests/howto/lib8-chain.test.ts
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let g: any, golden: any[];
beforeAll(async () => {
  g = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  golden = JSON.parse(readFileSync(g.GOLDEN_JSON, 'utf8')).entries;
});

const APPROVAL = `https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-6254908274 @ ${'a'.repeat(40)}`;
const SUP = { approvedBy: 'supervisor', decision: 'D-LIB-PILOTA', approval: APPROVAL, date: '2026-10-18', why: 'test' };
const page = { kind: 'page', pageSha256: 'f'.repeat(64), bytes: 1, supersedes: null };
const plate = (id: string) => ({ kind: 'plate', id, fragments: {}, supersedes: null });
const layers = (supersedes: number | null) => ({ kind: 'layers-page', pageSha256: 'e'.repeat(64), supersedes });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chain = (...es: any[]) => es.reduce((acc, e) => g.appendEntry(acc, e), []);
const batch = (entries: unknown[]) => ({ base: { index: golden.length - 1, hash: g.prefixHash(golden, golden.length - 1) }, entries });
const problems = (...es: unknown[]) => g.verifyBatchChain(batch(chain(...es)), golden);

describe('LIB-8M verifyChain on GOLDEN.json (unchanged: owner only)', () => {
  it('GOLDEN.json itself passes', () => {
    expect(g.verifyChain(golden)).toEqual([]);
  });
  it("a 'supervisor' entry in GOLDEN.json is refused, even with a decision and an approval", () => {
    expect(g.verifyChain(g.appendEntry(golden, { ...plate('lib_x'), ...SUP }))).toEqual([`entry ${golden.length} (plate:lib_x): approvedBy is not owner`]);
  });
});

describe('LIB-8M verifyBatchChain (owner or supervisor, D-LIB8M-CHAIN)', () => {
  it("allows 'supervisor' on first page and plate entries, and on layers-page entries first or over a supervisor entry", () => {
    expect(problems({ ...page, ...SUP }, { ...plate('lib_a'), ...SUP }, { ...plate('lib_b'), ...SUP })).toEqual([]);
    expect(problems({ ...layers(null), ...SUP }, { ...layers(0), ...SUP })).toEqual([]);
  });
  it("still allows 'owner' entries as before", () => {
    expect(problems({ ...page, approvedBy: 'owner', date: '2026-10-18' })).toEqual([]);
  });
  it("refuses 'stamps (O5)' and any other approver", () => {
    expect(problems({ ...plate('lib_a'), ...SUP, approvedBy: 'stamps (O5)' })).toEqual(['entry 0 (plate:lib_a): approvedBy is not owner or supervisor']);
    expect(problems({ ...plate('lib_a'), ...SUP, approvedBy: undefined })).toEqual(['entry 0 (plate:lib_a): approvedBy is not owner or supervisor']);
  });
  it("refuses 'supervisor' on a superseding plate entry", () => {
    expect(problems({ ...plate('lib_a'), ...SUP }, { ...plate('lib_a'), ...SUP, supersedes: 0 })).toEqual([
      'entry 1 (plate:lib_a): approvedBy supervisor is allowed only on a first plate or page entry, or a layers-page entry that is first or supersedes a supervisor entry',
    ]);
  });
  it("refuses 'supervisor' superseding an 'owner' layers-page entry", () => {
    expect(problems({ ...layers(null), approvedBy: 'owner', date: '2026-10-18' }, { ...layers(0), ...SUP })).toEqual([
      'entry 1 (layers-page): approvedBy supervisor is allowed only on a first plate or page entry, or a layers-page entry that is first or supersedes a supervisor entry',
    ]);
  });
  it("refuses a 'supervisor' entry with no decision, or no approval", () => {
    expect(problems({ ...plate('lib_a'), ...SUP, decision: ' ' })).toEqual(['entry 0 (plate:lib_a): a supervisor entry needs a decision']);
    expect(problems({ ...plate('lib_a'), ...SUP, approval: undefined })).toEqual(['entry 0 (plate:lib_a): a supervisor entry needs an approval "<comment url> @ <40-hex sha>"']);
  });
  it('refuses a malformed approval', () => {
    for (const approval of [
      'https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-6254908274',
      `https://github.com/macdarenz-droid/M-arc/pull/109 @ ${'a'.repeat(40)}`,
      `https://github.com/other/M-arc/pull/109#issuecomment-1 @ ${'a'.repeat(40)}`,
      `https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-1 @ ${'a'.repeat(39)}`,
      `https://github.com/macdarenz-droid/M-arc/pull/109#issuecomment-1 @ ${'A'.repeat(40)}`,
    ]) expect(problems({ ...plate('lib_a'), ...SUP, approval })).toEqual(['entry 0 (plate:lib_a): a supervisor entry needs an approval "<comment url> @ <40-hex sha>"']);
  });
});
