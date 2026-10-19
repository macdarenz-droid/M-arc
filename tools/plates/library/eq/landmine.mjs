// Composer `landmine` (census gap `landmine`, claude/howto-options 4a9fd86; LIB-13 Do 4; anchor landmine_row, ruling
// D-LIB13-LANDMINE): a barbell pinned at a floor pivot, seen from the side, as landmine_row's and t_bar_row's cards
// place it (landmine_row c1, c2, c4; t_bar_row c1). Parts:
//  - the pivot: a base plate on the floor and the hinge at the bar's end (static: the same item in every pose);
//  - the bar: the 28 mm shaft from the pivot to the inner collar, then the 50 mm sleeve to the free end, laid along
//    the line from the pivot through the point the hands hold (`to`), so the bar turns about the pivot and its pivot
//    end never moves;
//  - the load: the near plate(s) on the sleeve against the inner collar. The bar's axis lies in the side-view plane,
//    so each plate is seen edge on: a rectangle `plateD` long across the bar, `plateT` thick along it.
// The bar and the plates move with the hands, so each is a `poly` in every pose (PQ-H9; plan 2.1:126-128;
// plate.mjs:213): they stay drawn in the Mistake view. Built only from existing primitives (poly, box, pulley). Reads
// no file. Returns several items of the same type, so a spec takes it through eq/parts.mjs perItem(fn, LANDMINE_ITEMS).
// Assumed sizes (a 2.2 m Olympic bar as the vendored barbell, IWF; a typical landmine base; no card claim gives them,
// and every spec that uses it lists them under "Unsourced numbers"): bar 2.2 m, shaft 28 mm, sleeve 50 mm, inner
// collar 0.445 m from the free end (collars 1.31 m apart, as the vendor barbell), plates 45 cm × 5 cm, hinge 7 cm
// above the floor, base 30 cm × 2 cm.
import { add, mul, norm, sub } from './parts.mjs';

export const LANDMINE = Object.freeze({ barLen: 2.2, shaftD: 0.028, sleeveD: 0.05, collarFromEnd: 0.445, plateD: 0.45, plateT: 0.05,
  hingeH: 0.07, baseW: 0.30, baseH: 0.02 });
export const LANDMINE_ITEMS = 5;   // with the default one plate per side: 4 + plates.length

/** The hinge point (bar end) for a base centred at world z on the floor. */
export const hingeAt = (z, x = 0) => [x, LANDMINE.hingeH, z];

/**
 * The bar as laid from `pivot` (the hinge point) through `to` (a world point on the bar's axis, e.g. the grip):
 * { u (unit along the bar, pivot to free end), n (unit across it, in the side plane, pointing up), end, collar }.
 */
export function barFrame(pivot, to, barLen = LANDMINE.barLen) {
  const u = norm(sub(to, pivot)), n0 = [0, u[2], -u[1]], n = n0[1] < 0 ? mul(n0, -1) : n0;
  return { u, n, end: add(pivot, mul(u, barLen)), collar: add(pivot, mul(u, barLen - LANDMINE.collarFromEnd)) };
}
/** The point on the bar's axis `s` metres from the pivot. */
export const alongBar = (pivot, to, s) => add(pivot, mul(barFrame(pivot, to).u, s));

const rect = (a, b, n, w) => { const o = mul(n, w / 2); return [add(a, o), add(b, o), sub(b, o), sub(a, o)]; };

/**
 * p.pivot: the hinge point (hingeAt). p.to: a world point on the bar's axis (the grip). p.plates: plate thicknesses
 * per side from the inner collar outward (default one 5 cm plate). p.z: the draw layer of the bar and plates
 * (default 'center': the bar runs between the feet, behind the near leg).
 */
export function landmine({ pivot, to, plates = [LANDMINE.plateT], z = 'center' } = {}) {
  const { u, n, end, collar } = barFrame(pivot, to);
  const out = [
    { type: 'box', at: [pivot[0], LANDMINE.baseH / 2, pivot[2]], w: LANDMINE.baseW, h: LANDMINE.baseH, z: 'back' },
    { type: 'pulley', at: pivot, r: 0.03, z: 'back' },
    { type: 'poly', pts: rect(pivot, collar, n, LANDMINE.shaftD), z },
    { type: 'poly', pts: rect(collar, end, n, LANDMINE.sleeveD), z },
  ];
  let s = 0;
  for (const t of plates) {
    const a = add(collar, mul(u, s + 0.01)), b = add(collar, mul(u, s + 0.01 + t));
    out.push({ type: 'poly', pts: rect(a, b, n, LANDMINE.plateD), cls: 'eq-solid', z });
    s += t;
  }
  return out;
}
