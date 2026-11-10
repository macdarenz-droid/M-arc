// LIB-SHIP W6 D-SHIP-W6-RISKS (#393 6703065396): ht10DomProbe's C19 expects exactly the row's riskFlags.length red-flag
// blocks (tools/plates/library/fidelity.mjs riskCountOf). The browser half (the four ruled reds on the real probe) runs in
// the gate block LIB-SHIP-W6-RISKS-F2 (tools/plates/library/fidelity/ship-w6.mjs); the unit jobs have no browser.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;
const riskCountOf = async (id: string): Promise<number> =>
  (await import(/* @vite-ignore */ new URL('../../tools/plates/library/fidelity.mjs', import.meta.url).href)).riskCountOf(ROOT, id);

describe('LIB-SHIP W6 D-SHIP-W6-RISKS', () => {
  it('riskCountOf is each shipped W6 sheet\'s riskFlags.length: machine_lateral_raise 0, pike_push_up 2, the other 5 one', async () => {
    const ids = ['machine_crunch', 'machine_lateral_raise', 'cable_lateral_raise', 'dumbbell_front_raise', 'face_pull', 'incline_push_up', 'pike_push_up'];
    expect(await Promise.all(ids.map(i => riskCountOf(`lib_${i}`)))).toEqual([1, 0, 1, 1, 1, 1, 2]);
  });
  it('the library sweep passes the row\'s count, and the probe keeps `true` for golden B and checks a 0', () => {
    const fid = readFileSync(`${ROOT}tools/plates/library/fidelity.mjs`, 'utf8'), h = readFileSync(`${ROOT}tools/plates/fidelity/harness.mjs`, 'utf8');
    expect(fid).toContain("const expectRisks = existsSync(join(ctx.root, 'src/slices/howto/sections/Risks.tsx')) && await riskCountOf(ctx.root, lib);");
    expect(h).toContain("if (expectRisks === true || typeof expectRisks === 'number') {");
    expect(h).toContain("if (typeof expectRisks === 'number' && rf.length !== expectRisks) problems.push(`C19: ${rf.length} .redflag block(s), expected ${expectRisks} (riskFlags)`);");
    expect(h).toContain("else if (expectRisks === true && !rf.length) problems.push('C19: no .redflag block before the disclaimer');");
  });
  it('the gate block runs the browser rows', () => {
    const g = readFileSync(`${ROOT}scripts/screenshot-gate.mjs`, 'utf8');
    expect(g).toContain("if (gate.runs('LIB-SHIP-W6-RISKS-F2'))");
    expect(g).toContain("const r = await risksRows(browser, await import('../tools/plates/fidelity/harness.mjs'));");
  });
});
