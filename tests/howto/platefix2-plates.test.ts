// LIB-PLATEFIX-2 plates (PLATEFIX-2 PLAN RULED on #395): pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD, approved at pf4). dumbbell_fly
// and the rear delt fly are held after their last round (D-LIB13-PANEL2, #395 6655186998); their drawings stay at main's,
// and the fix work is in this PR's history (2967c154) for the later card. The H4 overlap itself is the gate's
// LIB-PLATEFIX-2 block (a browser measurement).
import { beforeAll, describe, expect, it } from 'vitest';

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let pec: any;
beforeAll(async () => { pec = (await import(/* @vite-ignore */ lib('specs/pec_fly.mjs'))).default; });

describe('PF2 pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD)', () => {
  // the hit-box overlap is a browser measurement (qa/browser.mjs at 390/360/340 px): it runs in the plate QA, not in this
  // unit file (unit jobs have no browser); here the moved box and its leader's anchor are pinned
  it('the height box sits at top 260 and its leader still ends on the start grip', () => {
    expect(pec.callouts.find((x: any) => x.key === 'height')).toMatchObject({ anchor: { at: 'grip.r', pose: 'start' }, box: { left: 20, top: 260 } });
  });
});
