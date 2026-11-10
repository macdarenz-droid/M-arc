// LIB-PLATEFIX-4 (card verify/lib-platefix-4-card.md, group 4), lb05 plates page. cable_curl's fix round was held at
// pf14 (#410 6756215536, R11 [3,3,3]; follow-up F-CURL-ELBOWZOOM) and its spec is back to main's bytes, so cable-curl is
// pinned here to main's value with the other plates; only straight-bar-triceps-pushdown is PF4's own.
import { beforeAll, describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;

let golden: any, rebuild: any;
beforeAll(async () => {
  [golden, rebuild] = await Promise.all([new URL('../../tools/plates/golden.mjs', import.meta.url).href,
    new URL('../../scripts/howto-rebuild.mjs', import.meta.url).href].map(f => import(/* @vite-ignore */ f)));
}, T);

describe('PF4 lb05 plates page: every other plate is byte-equal to main\'s (de91dd21, page 7a2d5311)', { timeout: T }, () => {
  // sha256 of JSON.stringify(golden.fragmentsOf(plate)) per plate on main's lb05 plates page (this card's ids left out).
  const BASE: Record<string, string> = {
    'preacher-curl': '5d1ae9b54ff05425565e9790b2421c070252de43ffa5745f57942aabafd9e77f',
    'bayesian-cable-curl': '31a391ea59632a9f9c12367948e73285e71560eeb76ffa9d467c0ab85b6e5d5c',
    'concentration-curl': 'eda06ea4496050cf6b2ac2e450e8583c4633e61da5b54b680578ae0e76641fca',
    'dumbbell-overhead-triceps-extension': 'c90c7dd9ac1ad2ee3d6cb9d6e1d61d4690323c1ad6330911cbe36d7015427707',
    'cross-body-hammer-curl': '27fb9f40ddb6f6f15b85f9e001eeb9eeeaad148192bd056c3f102f2591d192ea',
    'wrist-curl': 'a7b7d2a879f9aafc298762e3fb2c500cac21b0950e2d964bfadd6fbb9a8a9f05',
    'hammer-curl': 'e71fc1ccbf837abbad8892e59f1db1a35bc389f7235a1026ce658aaf18fe6c39',
    'alternating-dumbbell-curl': '7bd06dbb017b8ee364bad7824fd0a59a17f927b655ea50e365baaedd0c810dd9',
    'single-arm-triceps-pushdown': 'b0f7bd7ab21be5f2b651104006056c9b4c7cc89c7e580fed67098bc1c2376323',
    'incline-dumbbell-curl': '868f4c652e7ecf9c56441307471ad8b8e6f7c57cbbd8646f5a79bd2190a859af',
    'barbell-curl': 'ff95d0403a81e902cb5f413d9138a35aef8de7e3a64fd67260ac589702a02129',
    'ez-bar-curl': '854ed905f13e9216de90b4d5efee041f5ee1438d25721610de51528b5fc3d083',
    'cable-curl': '05a6e85af4ff0d2bbcfc92d35bfb7305824073c8fb231399466e666e0b4e506c',
    'reverse-curl': '1b9f2d838197a3ceb7e4b6ed8400fd264ddbd234b6ff28d18557b0fcd115d548',
  };
  // straight-bar-triceps-pushdown is PF4's own too (the PUSHDOWN re-clone, D-PF2-PUSHDOWN-T; its change is proven in
  // platefix4-pushdown.test.ts); main's value was d7e1b1afe3b26b65ad08f3e59cb932a4ec8860aa615008417c1eeae4b72f0a5f.
  const OWN = ['straight-bar-triceps-pushdown'];
  const shaOf = (p: any) => createHash('sha256').update(JSON.stringify(golden.fragmentsOf(p))).digest('hex');
  const problems = (html: string) => {
    const ps = golden.extractPlates(html), got = new Map(ps.map((p: any) => [p.chromeId, shaOf(p)]));
    const extra = ps.map((p: any) => p.chromeId).filter((c: string) => !(c in BASE) && !OWN.includes(c)).map((c: string) => `${c} not pinned`);
    return [...extra, ...Object.entries(BASE).filter(([c, h]) => got.get(c) !== h).map(([c]) => `${c} changed`)];
  };
  let html = '';
  beforeAll(async () => { html = Buffer.from(await rebuild.buildPage('tests/howto/golden/library/lb05.json', 'page')).toString('utf8'); }, T);
  it('every plate but this card\'s own is byte-equal to main\'s', () => {
    expect(problems(html)).toEqual([]);
  });
  it('mutation: one byte changed in another plate\'s Mistake svg is red', () => {
    const i = html.indexOf('id="wrist-curl-plate"'), j = html.indexOf('<path', i);
    expect(problems(html.slice(0, j) + '<path ' + html.slice(j + 5))).toEqual(['wrist-curl changed']);
  });
});
