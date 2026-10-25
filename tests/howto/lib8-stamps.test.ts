// LIB-8M (LIB-5 review Low 2; D-LIB8M-O5GATE): the C15 gate refuses a real stamp that is not the supervisor's, has
// no decision or approval, or has open != 0 (D-LIB-O5 14.8 points 2, 3 and 7). Scratch entries behave as before.
// Run: npx vitest run tests/howto/lib8-stamps.test.ts
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

const ID = 'lib_dumbbell_lateral_raise';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let S: any, real: any;
beforeAll(async () => {
  S = await import(/* @vite-ignore */ new URL('../../tools/plates/library/research/stamps.mjs', import.meta.url).href);
  const { scope, hash } = await S.stampOf(ID);
  real = JSON.parse(readFileSync(`${S.ROOT}/${S.REVIEWS}`, 'utf8')).entries.find((e: { scope: string; hash: string }) => e.scope === scope && e.hash === hash);
});
const check = (entry: object) => S.stampProblems([ID], { reviews: { schema: 1, entries: [entry] } });

describe('LIB-8M stampProblems: real stamps are the supervisor\'s, complete and closed', () => {
  it("passes the committed 'supervisor' stamp", async () => {
    expect(real).toMatchObject({ approvedBy: 'supervisor', open: 0 });
    expect(await check(real)).toEqual([]);
  });
  it("refuses 'owner', 'stamps (O5)' and a missing approvedBy", async () => {
    expect(await check({ ...real, approvedBy: 'owner' })).toEqual([`LIB-5 stamp: ${ID}: approvedBy "owner" is not supervisor`]);
    expect(await check({ ...real, approvedBy: 'stamps (O5)' })).toEqual([`LIB-5 stamp: ${ID}: approvedBy "stamps (O5)" is not supervisor`]);
    expect(await check({ ...real, approvedBy: undefined })).toEqual([`LIB-5 stamp: ${ID}: approvedBy undefined is not supervisor`]);
  });
  it('refuses an empty decision or a missing approval', async () => {
    expect(await check({ ...real, decision: ' ' })).toEqual([`LIB-5 stamp: ${ID}: the entry needs a decision and an approval`]);
    expect(await check({ ...real, approval: undefined })).toEqual([`LIB-5 stamp: ${ID}: the entry needs a decision and an approval`]);
  });
  it('refuses open other than 0', async () => {
    expect(await check({ ...real, open: 1 })).toEqual([`LIB-5 stamp: ${ID}: open 1 is not 0`]);
    expect(await check({ ...real, open: undefined })).toEqual([`LIB-5 stamp: ${ID}: open undefined is not 0`]);
  });
  it('a bare real entry (scope, hash and date only) gets exactly its three problems', async () => {
    expect(await check({ scope: real.scope, hash: real.hash, date: real.date })).toEqual([
      `LIB-5 stamp: ${ID}: approvedBy undefined is not supervisor`,
      `LIB-5 stamp: ${ID}: the entry needs a decision and an approval`,
      `LIB-5 stamp: ${ID}: open undefined is not 0`,
    ]);
  });
  it('a scratch entry outside a marked root still counts as no entry', async () => {
    const { approvedBy, decision, approval, open, ...bare } = real;
    expect([approvedBy, decision, approval, open].every(v => v !== undefined)).toBe(true);
    expect(await check({ ...bare, scratch: true })).toEqual([expect.stringMatching(new RegExp(`^LIB-5 stamp: ${ID}: no reviews.json entry for scope ${ID} hash `))]);
  });
});
