// LIB-SHIP W6 D-SHIP-W6-F2 (#393 6703104795): F2 is a named exemption on cable_lateral_raise and face_pull (lb7/qa.mjs
// F2_IDS in EXPECTED, their lb07.json plate pins). PQH's browser half (ok with the pin, red on F2 without it) runs in the
// gate block LIB-SHIP-W6-RISKS-F2 (tools/plates/library/fidelity/ship-w6.mjs f2Rows); the unit jobs have no browser.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;

describe('LIB-SHIP W6 D-SHIP-W6-F2', () => {
  it('EXPECTED names F2 for exactly the two, and every other lb7 id keeps its set', async () => {
    const qa = await import(/* @vite-ignore */ new URL('../../tools/plates/library/lb7/qa.mjs', import.meta.url).href);
    expect(qa.F2_IDS).toEqual(['lib_cable_lateral_raise', 'lib_face_pull']);
    for (const id of qa.F2_IDS) expect(qa.EXPECTED(id)).toEqual(['F2', 'F5']);
    expect(qa.EXPECTED('lib_pike_push_up')).toEqual(['F5', 'F7']);
    expect(qa.EXPECTED('lib_dumbbell_front_raise')).toEqual(['F5']);
  });
  it('each lb07 plate pin carries exactly EXPECTED, and only the two name F2', async () => {
    const qa = await import(/* @vite-ignore */ new URL('../../tools/plates/library/lb7/qa.mjs', import.meta.url).href);
    const chain = JSON.parse(readFileSync(`${ROOT}tests/howto/golden/library/lb07.json`, 'utf8'));
    const plates = chain.entries.filter((e: any) => e.kind === 'plate');
    for (const e of plates) expect([e.id, e.exemptions]).toEqual([e.id, qa.EXPECTED(e.id)]);
    expect(plates.filter((e: any) => e.exemptions.includes('F2')).map((e: any) => e.id)).toEqual(qa.F2_IDS);
  });
  it('the gate block runs the PQH rows', () => {
    const g = readFileSync(`${ROOT}scripts/screenshot-gate.mjs`, 'utf8');
    expect(g).toContain('const f = await f2Rows();');
  });
});
