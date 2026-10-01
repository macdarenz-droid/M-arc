// LIB-6 (plan 2.6): the library close-up renderer draws golden B's 8 close-ups byte for byte. API level: every string
// the vendored artifact/howto-layers.mjs reads from a close-up source (hand pages, posture zooms or zoom sections, chip
// rows, CSS) === the frozen golden-B script's. Page-level proofs (renderer page = e7b81413, fragments, fallback) build
// real pages and run under `node --test tools/plates/library/test/*.test.mjs`.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let cmp: any, opts: any, fr: any, layers: any;

// sha256 of each card's close-up fragments (panels, css) in golden B, LR-23 page e7b81413 (identical in b3a90af's 5aab1aca).
const GOLDEN_FRAGMENTS: Record<string, [string, string]> = {
  'lateral-raise': ['de63fa90f5d618f4828393de3c60887ece8a6fd1c91e0aee1df8cdff6f3fc771', '2d57af6d954b158ff3426aac3bd612f71019bb7a442df7ef992ca611dbee4889'],
  'barbell-back-squat': ['55f9e3c1753b5098832f18309fe520a8c3801f59cb2b9364f9728b1decec6349', '0f393beaecbb273083e04d78e52f571795d2b5f39326c7d1d13e922e1574c1e0'],
  'pull-up': ['abf585127d008fbce8cc9c9c251d43e0c12d3131d8709746a3ac9f48f82e34d0', 'd6909af67e1d87e88e3cd6fbbb50afae68d7e5a812a8054f69af5fb25a8b16be'],
  'hanging-leg-raise': ['fd4c99b156e8dcb4632979a6de9e009a86909047a59993f43e278bb0313ccde0', '77f4b875725f69c14a3db639d93f3be3a8d09914a88dbf291bfa6b435cf73b9b'],
  'lat-pulldown': ['5cfcb21ef03fc1845401a3d7c5b3a3d4081b2abbd5cbde0187345f387e09ba49', '03993e7c13ca6556e635e56b3cef659c066efda22b3d51d91180c11d3624e552'],
  'seated-cable-row': ['78d75f7f55286c9c65ec760a21cf52c660ba1c91633b6c7d27290a10a3fa3d0d', '0469024c37e0cbe20064a5ec62faf12423e4f2b0e09bc91747e3d30ec6ec1aa1'],
  'leg-press': ['a285dbc12b0e43497eee4976716f5aca065c2abd168264378192d769377b8566', 'ef4b5b2b8e46cc99f304ac89ab6655bbf0f631128bae363bc282f1fa56f5c141'],
  'machine-chest-press': ['6db34110ac8fa2944ab1404e00146251dc5d172f64e6c396a97b8baddfc95a83', '9bdea8748631bbaf09d1f58915498607262ae2056f2d8ec55b07a5a7fb020403'],
};

describe('LIB-6 close-up renderer, API level', () => {
  beforeAll(async () => {
    cmp = await import(/* @vite-ignore */ url('tools/plates/library/render/compare.mjs'));
    opts = (await import(/* @vite-ignore */ url('tools/plates/library/render/closeups-8.mjs'))).CLOSEUP_OPTIONS;
    fr = await import(/* @vite-ignore */ url('tools/plates/library/render/fragments.mjs'));
    layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
  });

  it('golden B (the committed approved page) holds the 8 pinned close-up fragments', () => {
    const page = readFileSync(new URL('../howto/golden/howto-layers.html', import.meta.url));
    expect(layers.sha256(page)).toBe(layers.PAGE_SHA256);
    const got = fr.closeupFragments(page.toString('utf8'), Object.keys(GOLDEN_FRAGMENTS));
    for (const [c, [p, s]] of Object.entries(GOLDEN_FRAGMENTS)) expect([c, layers.sha256(got[c].panels), layers.sha256(got[c].css)]).toEqual([c, p, s]);
  });

  it('has options for exactly the 8, none on the frozen fallback', () => {
    expect(Object.keys(opts).sort()).toEqual(['barbell_back_squat', 'dumbbell_lateral_raise', 'hanging_leg_raise', 'lat_pulldown', 'leg_press',
      'machine_chest_press', 'pull_up', 'seated_cable_row']);
    for (const o of Object.values(opts) as any[]) expect(['zoom', 'zbox']).toContain(o.shell);
  });

  it('every close-up string of all 8 === the frozen golden-B script\'s', async () => {
    expect(await cmp.compareCloseups(Object.keys(opts), opts)).toEqual([]);
  }, 120_000);

  it('a changed option is caught (the comparison bites)', async () => {
    const m = structuredClone(opts);
    m.pull_up.hand.stripLoad = false;
    m.dumbbell_lateral_raise.hand.bendLabel.dy = -16;
    m.seated_cable_row.css.spine = false;
    m.machine_chest_press.hand.steps[0][1].dy = 31;
    const diff: string[] = await cmp.compareCloseups(['pull_up', 'dumbbell_lateral_raise', 'seated_cable_row', 'machine_chest_press'], m);
    expect(diff.map(d => d.split(':')[0])).toEqual(['pull_up.handZoom(p1)', 'pull_up.handZoom(p2)', 'dumbbell_lateral_raise.handZoom()',
      'seated_cable_row.CSS', 'machine_chest_press.zoomSection(hand)']);
  }, 120_000);
});
