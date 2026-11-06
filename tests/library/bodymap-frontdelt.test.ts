// F-BODYMAP-FRONTDELT (D-BODYMAP-LIB, #404 6682755661): library layers pages draw front_delts on the front of the
// shoulder cap, not on golden B's neck-to-shoulder strip (which reads as the upper traps), and add an inner-elbow pain
// part (dumbbell_pullover, W4 L4). The fix is library-side (render/region-fix.mjs applyBodymapFix); golden B's
// vendored bodymap-parts.mjs and its own page stay byte-locked.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
type Part = { id: string; muscle: string | null; d: string };
type Pt = [number, number];
let RF: any, VENDORED: Part[], BACK: Part[];
beforeAll(async () => {
  RF = await import(/* @vite-ignore */ url('tools/plates/library/render/region-fix.mjs'));
  const B = await import(/* @vite-ignore */ url('tools/plates/layers/engine/bodymap-parts.mjs'));
  VENDORED = B.FRONT_PARTS; BACK = B.BACK_PARTS;
});
const fixed = (): Part[] => { const P = structuredClone(VENDORED); RF.applyBodymapFix(P); return P; };
const AXIS = 15.83629;   // the map's mirror axis (every left/right pair: x_left + x_right = 31.67258)

/* ---- geometry: subpaths as polygons (m/l/h/v/c/z; a curve contributes its end point) ---- */
function polys(d: string): Pt[][] {
  const tok = d.match(/[a-zA-Z]|-?\d*\.?\d+(?:e-?\d+)?/g)!;
  const A: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, z: 0 };
  const out: Pt[][] = []; let i = 0, cmd = 'M', x = 0, y = 0, sx = 0, sy = 0, cur: Pt[] = [];
  while (i < tok.length) {
    if (/[a-zA-Z]/.test(tok[i])) cmd = tok[i++];
    const lc = cmd.toLowerCase(), rel = cmd !== cmd.toUpperCase();
    if (lc === 'z') { x = sx; y = sy; continue; }
    const a = Array.from({ length: A[lc] }, () => +tok[i++]), ox = rel ? x : 0, oy = rel ? y : 0;
    if (lc === 'm') { x = ox + a[0]; y = oy + a[1]; sx = x; sy = y; cur = [[x, y]]; out.push(cur); cmd = rel ? 'l' : 'L'; continue; }
    if (lc === 'h') x = ox + a[0]; else if (lc === 'v') y = oy + a[0];
    else if (lc === 'c') { x = ox + a[4]; y = oy + a[5]; } else { x = ox + a[0]; y = oy + a[1]; }
    cur.push([x, y]);
  }
  return out;
}
const inside = (p: Pt, poly: Pt[]) => {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [a, b] = poly[i], [e, f] = poly[j];
    if ((b > p[1]) !== (f > p[1]) && p[0] < ((e - a) * (p[1] - b)) / (f - b) + a) c = !c;
  }
  return c;
};
const edges = (P: Pt[][]) => P.flatMap(poly => poly.map((a, k) => [a, poly[(k + 1) % poly.length]] as [Pt, Pt]));
const samples = (P: Pt[][]) => edges(P).flatMap(([a, b]) => Array.from({ length: 51 }, (_, k) => [a[0] + (k / 50) * (b[0] - a[0]), a[1] + (k / 50) * (b[1] - a[1])] as Pt));
const overlaps = (d1: string, d2: string) => {
  const A = polys(d1), B = polys(d2);
  return samples(A).some(p => B.some(q => inside(p, q))) || samples(B).some(p => A.some(q => inside(p, q)));
};
const verts = (d: string) => polys(d).flat();
/** signed side of p against the line a→b (>0 left of the direction in screen coordinates' sense) */
const side = (p: Pt, a: Pt, b: Pt) => (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]);
const mirrored = (dl: string, dr: string, tol: number) => {
  const L = verts(dl), R = verts(dr);
  return L.length === R.length && L.every(([x, y]) => R.some(([u, v]) => Math.hypot(2 * AXIS - x - u, y - v) <= tol));
};
const part = (P: Part[], id: string) => { const p = P.find(x => x.id === id); if (!p) throw new Error(`no part ${id}`); return p; };

/* the deltoid area on the front view, from the vendored neighbours (left side; the right side is the mirror):
   right of upper_chest's outer edge, left of side_delts' inner edge, below the neck-to-shoulder strip, above the biceps */
const deltoidArea = (P: Part[], s: 'left' | 'right') => {
  const m = (q: Pt): Pt => (s === 'left' ? q : [2 * AXIS - q[0], q[1]]);
  const uc = polys(part(P, `chest-upper-${s}`).d)[0], sd = polys(part(P, `shoulder-side-${s}`).d)[1];
  // upper_chest outer edge: its first two vertices (the apex and the outer corner); side_delts inner piece: its
  // vertices 0 → 5 (its top edge) and 5 → 4 (its inner edge), as drawn by the vendored path
  return { ucA: uc[0], ucB: uc[1], sdTop: [sd[0], sd[5]] as [Pt, Pt], sdIn: [sd[5], sd[4]] as [Pt, Pt], strip: 15.2, biceps: 21.1, m };
};
const inDeltoidArea = (P: Part[], d: string, s: 'left' | 'right') => {
  const D = deltoidArea(P, s), flip = s === 'left' ? 1 : -1;
  // outside the side_delts piece at its convex top-inner corner: left of its inner edge or above its top edge
  return verts(d).every(p => flip * side(p, D.ucA, D.ucB) <= 0
    && (flip * side(p, ...D.sdIn) >= 0 || flip * side(p, ...D.sdTop) >= 0) && p[1] >= D.strip && p[1] <= D.biceps);
};

describe('F-BODYMAP-FRONTDELT front_delts', () => {
  for (const s of ['left', 'right'] as const) {
    it(`${s}: no overlap with any other part (the front view has no upper_traps; the back view draws no front_delts)`, () => {
      const P = fixed(), me = part(P, `shoulder-front-${s}`);
      for (const q of P) if (q !== me) expect(overlaps(me.d, q.d), q.id).toBe(false);
      expect(BACK.some(q => q.muscle === 'front_delts')).toBe(false);
    });
    it(`${s}: lies below the neck-to-shoulder strip (y >= 15.2), where the vendored path sits and reads as upper traps`, () => {
      expect(Math.min(...verts(part(fixed(), `shoulder-front-${s}`).d).map(p => p[1]))).toBeGreaterThanOrEqual(15.2);
    });
    it(`${s}: inside the front-view deltoid area, between side_delts and upper_chest, above the biceps`, () => {
      const P = fixed();
      expect(inDeltoidArea(P, part(P, `shoulder-front-${s}`).d, s)).toBe(true);
    });
  }
  it('left and right are mirror images within 0.05 units', () => {
    const P = fixed();
    expect(mirrored(part(P, 'shoulder-front-left').d, part(P, 'shoulder-front-right').d, 0.05)).toBe(true);
  });
  it('mutations: the vendored path fails all three placement checks; a shifted side fails the mirror check', () => {
    for (const s of ['left', 'right'] as const) {
      const old = part(VENDORED, `shoulder-front-${s}`).d;
      expect(Math.min(...verts(old).map(p => p[1]))).toBeLessThan(15.2);
      expect(inDeltoidArea(VENDORED, old, s)).toBe(false);
      // the vendored strip touches the cap: it overlaps the trap strip zone above y 15.2 between the neck and side_delts
      expect(verts(old).some(p => p[1] < 15.2)).toBe(true);
    }
    const P = fixed(), r = part(P, 'shoulder-front-right');
    const shifted = r.d.replace(/(\d+\.\d+),/g, (_, x) => `${(+x + 0.1).toFixed(3)},`);
    expect(mirrored(part(P, 'shoulder-front-left').d, shifted, 0.05)).toBe(false);
  });
});

describe('F-BODYMAP-FRONTDELT inner elbow', () => {
  it('red before: the vendored map has no inner-elbow part', () => {
    expect(VENDORED.some(p => /^elbow-inner-/.test(p.id))).toBe(false);
  });
  for (const s of ['left', 'right'] as const) {
    it(`${s}: a pain part (muscle null) in the crease between the biceps and the forearm, overlapping nothing`, () => {
      const P = fixed(), me = part(P, `elbow-inner-${s}`);
      expect(me.muscle).toBeNull();
      for (const q of P) if (q !== me) expect(overlaps(me.d, q.d), q.id).toBe(false);
      // the crease: right of the biceps' lower piece's inner edge and left of the forearm's top edge (left arm; mirrored)
      const bi = polys(part(P, `biceps-${s}`).d)[0], fa = polys(part(P, `forearm-${s}`).d)[0], flip = s === 'left' ? 1 : -1;
      for (const p of verts(me.d)) {
        expect(flip * side(p, bi[2], bi[1])).toBeGreaterThan(0);
        expect(flip * side(p, fa[4], fa[0])).toBeLessThan(0);
      }
    });
  }
  it('left and right are mirror images within 0.05 units; the pain label is "elbows" (/^elbow-/)', () => {
    const P = fixed();
    expect(mirrored(part(P, 'elbow-inner-left').d, part(P, 'elbow-inner-right').d, 0.05)).toBe(true);
    const src = readFileSync(join(ROOT, 'tools/plates/layers/artifact/howto-layers.mjs'), 'utf8');
    expect(src).toContain("[/^elbow-/, 'elbows']");
  });
});

describe('F-BODYMAP-FRONTDELT applyBodymapFix', () => {
  it('idempotent, after or before the stomach fix; throws on a missing part or the wrong muscle', () => {
    const P = structuredClone(VENDORED);
    expect(RF.applyRegionFix(P)).toBe(true);
    expect(RF.applyBodymapFix(P)).toBe(true);
    const once = JSON.stringify(P);
    expect(RF.applyBodymapFix(P)).toBe(false);
    expect(JSON.stringify(P)).toBe(once);
    expect(P.filter(p => /^elbow-inner-/.test(p.id))).toHaveLength(2);
    const gone = structuredClone(VENDORED).filter(p => p.id !== 'shoulder-front-left');
    expect(() => RF.applyBodymapFix(gone)).toThrow(/shoulder-front-left not front_delts/);
    const wrong = structuredClone(VENDORED); part(wrong, 'shoulder-front-right').muscle = 'side_delts';
    expect(() => RF.applyBodymapFix(wrong)).toThrow(/shoulder-front-right not front_delts/);
  });
  it('the build applies it to batch pages only: golden B\'s spec never sets bodymapFix, layersSpecOf always does', () => {
    const blp = readFileSync(join(ROOT, 'tools/plates/library/build-layers-page.mjs'), 'utf8');
    expect(blp).toContain('bodymapFix: spec.bodymapFix === true');
    expect(blp).toMatch(/plan\.bodymapFix \? `[^`]*applyBodymapFix\(/);
    expect(readFileSync(join(ROOT, 'tools/plates/library/layers-spec.mjs'), 'utf8')).toContain('bodymapFix: true');
  });
});

/* every committed page that draws the front map: library pages carry the fix, golden B's pages keep the vendored map */
const LIBRARY_PAGES = ['tests/howto/golden/library/pilot-a.layers.html', 'tests/howto/golden/library/pilot-b.layers.html',
  'tests/howto/golden/library/pilot-b2.layers.html'];
const GOLDEN_B_PAGES = ['tests/howto/golden/howto-layers.html', 'tools/plates/layers/artifact/technical-plates.html'];
describe('F-BODYMAP-FRONTDELT pages', () => {
  for (const f of LIBRARY_PAGES) {
    it(`${f}: every front map draws the fixed front_delts and the inner elbows, none the vendored strip`, () => {
      const page = readFileSync(join(ROOT, f), 'utf8');
      const maps = page.split('class="feel-view"').length - 1;
      expect(maps).toBeGreaterThan(0);
      const count = (s: string) => page.split(s).length - 1;
      expect(count(part(VENDORED, 'shoulder-front-left').d)).toBe(0);
      const fronts = count(part(VENDORED, 'face').d);   // one face per front view
      expect(fronts).toBeGreaterThan(0);
      for (const id of ['shoulder-front-left', 'shoulder-front-right']) expect(count(RF.BODYMAP_FIX.replace[id].d)).toBeGreaterThanOrEqual(fronts);
      for (const p of RF.BODYMAP_FIX.add) expect(count(p.d)).toBeGreaterThanOrEqual(fronts);
    });
  }
  for (const f of GOLDEN_B_PAGES) {
    it(`${f}: golden B keeps the vendored map (byte-locked)`, () => {
      const page = readFileSync(join(ROOT, f), 'utf8');
      expect(page).toContain(part(VENDORED, 'shoulder-front-left').d);
      expect(page).not.toContain(RF.BODYMAP_FIX.replace['shoulder-front-left'].d);
    });
  }
});
