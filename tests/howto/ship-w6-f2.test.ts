// LIB-SHIP W6 D-SHIP-W6-F2 (#393 6703104795): F2 is a named exemption on cable_lateral_raise and face_pull (lb7/qa.mjs
// F2_IDS, their lb07.json plate pins). PQH's full runQa report (node and browser halves, as tools/plates/library/
// fidelity.mjs pqhJob builds it) is ok with the pin's exemptions and fails on F2 with F2 taken out of them.
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const R = new URL('../../tools/plates/library/', import.meta.url).href;
const ROOT = new URL('../../', import.meta.url).pathname;
let Q: any, html = '', mirror: any;
beforeAll(async () => {
  const [I, A, E, B, G, C, L] = await Promise.all(['qa/index.mjs', 'qa/approved.mjs', 'qa/engine.mjs', 'qa/browser.mjs', '../golden.mjs', 'candidate.mjs', 'lb7/build.mjs'].map(p => import(/* @vite-ignore */ R + p)));
  html = String((await L.buildLb7Page()).html);
  mirror = G.makeMirror();
  Q = { I, A, B, E, C, engine: await E.loadEngine(mirror), browser: await B.launch(), pins: I.loadPins() };
}, 600_000);
afterAll(async () => { await Q?.browser.close(); if (mirror) Q.E.dropMirror(mirror); });
const report = async (id: string, drop: string | null) => {
  const c = await Q.C.candidateOf(id, { root: ROOT, platesHtml: html, engine: Q.engine });
  if (drop) c.exemptions = c.exemptions.filter((f: string) => f !== drop);
  const browser = await Q.B.browserResults(Q.browser, html, [c], Q.engine, Q.pins.envelope);
  return Q.I.runQa(c, { engine: Q.engine, pins: Q.pins, approvedStrings: Q.A.approvedStrings(), browser });
};

describe('LIB-SHIP W6 D-SHIP-W6-F2: the F2 exemption on cable_lateral_raise and face_pull', () => {
  it('EXPECTED and the plate pins name F2 for exactly these two', async () => {
    const qa = await import(/* @vite-ignore */ R + 'lb7/qa.mjs');
    expect(qa.F2_IDS).toEqual(['lib_cable_lateral_raise', 'lib_face_pull']);
    for (const id of qa.F2_IDS) expect(qa.EXPECTED(id)).toEqual(['F2', 'F5']);
  });
  for (const id of ['lib_cable_lateral_raise', 'lib_face_pull']) {
    it(`${id}: PQH ok with the pin; red on F2 with F2 removed from the exemptions`, async () => {
      const ok = await report(id, null);
      expect([id, ok.ok, ok.flags.F2.raised, ok.flags.F2.blocks]).toEqual([id, true, true, false]);
      const red = await report(id, 'F2');
      expect([id, red.ok, red.flags.F2.blocks]).toEqual([id, false, true]);
    }, 600_000);
  }
});
