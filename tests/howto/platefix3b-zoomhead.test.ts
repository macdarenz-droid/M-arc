// LIB-PLATEFIX-3b items 22/15, engine piece (ruled on #405 6682844211, #408 PLAN): the PLATEFIX-2 posture zoom
// (zoom/inline.mjs, qa/zoom.mjs) takes `project: 'head'`, the focus pose seen square to the back with the head at the top
// (for a lifter on a bench: from above the chest, looking along the body from the head end). Proof in #395's form: every
// existing zoom draws the bytes it drew before; 'head' is accepted, any other projection is still refused.
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const OURS = /^(smith_machine_bench_press)\.mjs$/;   // PF3b's own new head entries (incline_barbell held, D-PF3B-HOLD15)
let zoom: any, alt: any;
beforeAll(async () => {
  zoom = await import(/* @vite-ignore */ lib('zoom/inline.mjs'));
  alt = (await import(/* @vite-ignore */ lib('specs/bent_over_dumbbell_rear_delt_fly__alt.mjs'))).default;
}, T);

describe('PF3b head projection: existing zooms are byte-equal', { timeout: T }, () => {
  it('every other spec\'s zoom entries render the svg, focus, circle, source, link and posture they rendered before', async () => {
    const dir = join(process.cwd(), 'tools/plates/library/specs'), h = createHash('sha256');
    let n = 0;
    for (const f of readdirSync(dir).sort()) {
      if (!f.endsWith('.mjs') || OURS.test(f)) continue;
      const s = (await import(/* @vite-ignore */ pathToFileURL(join(dir, f)).href)).default;
      if (s?.zoom == null) continue;
      for (const z of zoom.zoomList(s.zoom)) {
        const o = zoom.zoomOf(s, { prefix: f, view: z.view });
        h.update(f + o.svg + JSON.stringify([o.focus, o.circle, o.src, o.link, o.posture ?? null])); n++;
      }
    }
    expect(n).toBe(39);
    // the same loop with this branch's base zoom/inline.mjs (claude/lib-platefix-3b 2884b5a9, before the head projection)
    // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was 007c6b34…, now 539f6f9c… (incline_barbell is back to main's spec, D-PF3B-HOLD15,
    // so its entries join the loop; main 6227bd8e's zoom/inline.mjs gives this same hash over this set)
    // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was 539f6f9c…, now 4a1305c9… (sled_pull's rope redrawn, D-PF3B-ROPE: its zoom
    // shows the rope; main 6227bd8e's zoom/inline.mjs gives this same hash over this set)
    // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was 4a1305c9…, now 0d43adaa… (D-PF3B-ROPEGHOST: sled_pull's start copy drops its
    // lay-mark ghosts; main 6227bd8e's zoom/inline.mjs gives this same hash over this set)
    expect(h.digest('hex')).toBe('0d43adaa312c32eeba5c9eac27b060d6fa2561aba9352f2b0d5d4016f0425c29');
  });
  it('the side and plate-projection posture zooms (no main spec has one: PF2\'s rear delt fixture) render as before', () => {
    const fx = { ...alt, id: 'bent_over_dumbbell_rear_delt_fly', mistake: { ...alt.mistake, pose: { scap: { elev: 10 } }, guides: [] } };
    const SETS = [
      [{ view: 'normal', k: 1, r: 68, focus: { region: ['head', 'backUpper', 'sacrum', 'buttock', 'hip.r', 'shoulder.r'], pose: 'end' }, project: 'side', ring: false },
        { view: 'mistake', k: 2, r: 56, focus: { region: ['shoulder.r', 'trap.r', 'ear', 'backUpper'], pose: 'start' }, project: 'side', place: 'outer' }],
      [{ view: 'mistake', k: 1.5, focus: { region: ['shoulder.r', 'trap.r'], pose: 'start' } }],
    ];
    const h = createHash('sha256');
    let n = 0;
    for (const zs of SETS) for (const z of zs) {
      const o = zoom.zoomOf({ ...fx, zoom: zs }, { prefix: 'fx', view: z.view });
      h.update(o.svg + JSON.stringify([o.focus, o.circle, o.src, o.link, o.posture])); n++;
    }
    expect(n).toBe(3);
    // the same entries with the base zoom/inline.mjs (2884b5a9)
    expect(h.digest('hex')).toBe('ff94db5614f0f33c2e0c4cfe7c0430c92d9470decba3ba1c627e824377c85ef6');
  });
});

describe('PF3b head projection: the field', () => {
  const N = { view: 'normal', k: 1, focus: { region: ['shoulder.r', 'elbow.r'], pose: 'end' } };
  it("'head' is accepted, with or without its source ring, on either view", () => {
    expect(zoom.PROJECTS).toEqual(['side', 'head']);
    expect(zoom.zoomFieldProblems({ ...N, project: 'head' })).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'head', ring: false, r: 68 })).toEqual([]);
    expect(zoom.zoomFieldProblems({ ...N, view: 'mistake', project: 'head', ring: false, guides: [] })).toEqual([]);
  });
  it('any other projection is still refused, and ring true is still refused', () => {
    for (const p of ['top', 'front', 'Head', '', null, 1, ['head']])
      expect(zoom.zoomFieldProblems({ ...N, project: p })).toEqual([`zoom.project ${JSON.stringify(p)} is not 'side' or 'head'`]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'head', ring: true })).toEqual(["zoom.ring is false or absent, and false only with project 'side' or 'head' (an inset of another view)"]);
    expect(zoom.zoomFieldProblems({ ...N, project: 'front', ring: false })).toEqual([
      "zoom.ring is false or absent, and false only with project 'side' or 'head' (an inset of another view)", "zoom.project \"front\" is not 'side' or 'head'"]);
  });
  it('a head projection maps the focus pose\'s sacrum -> upper back line to screen up, and the lifter\'s left to screen right', async () => {
    const smith = (await import(/* @vite-ignore */ lib('specs/smith_machine_bench_press.mjs'))).default;
    const e = { ...N, project: 'head' }, lm = zoom.focusLandmarks(smith, e), uv = zoom.postureUV(e, null, smith);
    const a = uv(lm.sacrum), b = uv(lm.backUpper), l = uv(lm['shoulder.l']), r = uv(lm['shoulder.r']);
    expect(Math.abs(b[0] - a[0])).toBeLessThan(1e-9);
    expect(b[1] - a[1]).toBeCloseTo(Math.hypot(...[0, 1, 2].map(i => lm.backUpper[i] - lm.sacrum[i])), 9);   // the whole back line, unforeshortened
    expect(l[0]).toBeGreaterThan(r[0]);
  });
});
