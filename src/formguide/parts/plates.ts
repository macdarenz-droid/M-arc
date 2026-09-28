// FG-5: plates on a bar and the loose plate. The count comes from the app's own Plate Sense (`plateBreakdown`,
// src/brain/units.ts: the gym's plate set in its unit, the fewest plates at or under the load), so the picture shows
// what the lifter would load. Drawn sizes (D-FG5): full-size plates at IWF's 450 mm, smaller plates stepped down so
// each size reads apart at phone width; widths grow with the plate. Not measured plates: a drawing rule.
import type { LoadUnit } from '@/core/models';
import { KG_PER_LB } from '@/core/units';
import { plateBreakdown, type PlateBreakdown } from '@/brain/units';
import { arc, body, disc, edge, mm, n2, rect, wrap, INK, type Part } from './kit';

/** A bar's plate set (EquipmentProfile's fields): the unit the plates speak, the bar's kg, the denominations. */
export type BarProfile = { unit: LoadUnit; barKg?: number; plates?: number[] };
export type PlateSpec = { value: number; unit: LoadUnit; dia: number; w: number };

/** Drawn diameter and width (mm) of one plate by its weight in kg. */
export function plateSize(value: number, unit: LoadUnit): { diaMm: number; wMm: number } {
  const kg = unit === 'lb' ? value * KG_PER_LB : value;
  const diaMm = kg >= 19 ? 450 : kg >= 14 ? 400 : kg >= 9 ? 330 : kg >= 4.5 ? 230 : kg >= 2 ? 190 : 160;
  return { diaMm, wMm: Math.min(50, 15 + 1.25 * kg) };
}
const spec = (value: number, unit: LoadUnit): PlateSpec => { const s = plateSize(value, unit); return { value, unit, dia: mm(s.diaMm), w: mm(s.wMm) }; };

/** §3 budget: at most this many plates are drawn per side (the rest are counted in `hidden`). */
export const MAX_DRAWN = 9;
export type Loaded = {
  breakdown: PlateBreakdown;
  /** One side, inner (next to the collar) to outer: the plates drawn. */
  drawn: PlateSpec[];
  /** Plates per side that do not fit the sleeve or the budget (drawn: none). */
  hidden: number;
};
/** The plates per side for a total load on a bar with `sleeveMm` of loadable sleeve. */
export function loadBar(totalKg: number, profile: BarProfile, sleeveMm: number): Loaded {
  const b = plateBreakdown(Math.max(0, totalKg || 0), { ...profile, source: 'default', updatedAt: '' });
  const all = b.perSide.flatMap(p => Array.from({ length: p.count }, () => spec(p.value, p.unit)));
  const drawn: PlateSpec[] = [];
  let used = 0;
  for (const p of all) { if (drawn.length >= MAX_DRAWN || used + p.w > mm(sleeveMm) + 1e-6) break; drawn.push(p); used += p.w; }
  return { breakdown: b, drawn, hidden: all.length - drawn.length };
}

const plateCls = (side: 'l' | 'r') => `fg-plate fg-plate-${side}`;
/** Front view: the plates on one side as upright slabs from x0 outward (dir ±1), centred on the bar axis. */
export function slabs(l: Loaded, x0: number, dir: 1 | -1, g: string, side: 'l' | 'r'): string {
  let x = x0;
  return l.drawn.map(p => { const a = dir > 0 ? x : x - p.w; x += dir * p.w; return body(rect(a, -p.dia / 2, p.w, p.dia), g, 1.6, plateCls(side)); }).join('');
}
/** Side view (the bar end-on): the near side's plates face-on, inner first; each steps 1.6 units down-right toward
 * you so equal plates still show one rim each (D-FG5). The bar end sits on the outer plate. */
export function faces(l: Loaded, g: string): string {
  const n = l.drawn.length, step = 1.6;
  const off = (i: number) => n2((i - (n - 1)) * step);
  return l.drawn.map((p, i) => body(disc(off(i), off(i), p.dia / 2, mm(25)), g, 1.6, plateCls('r'))).join('')
    + (n ? edge(arc(0, 0, n2((l.drawn[n - 1]!.dia / 2) * 0.88), 205, 250), 2) : '');
}

export type LoosePlateOptions = { g: string; value: number; unit: LoadUnit; view?: 'front' | 'side' };
/** A plate held on its own (plate front raise, plate-loaded carries): face-on in front view, edge-on in side view.
 * Hands at 3 and 9 o'clock on the rim, 85 % out. */
export function loosePlate(o: LoosePlateOptions): Part {
  const p = spec(o.value, o.unit), r = n2(p.dia / 2), view = o.view ?? 'front';
  if (view === 'side') {
    const svg = body(rect(-p.w / 2, -r, p.w, 2 * r), o.g, 1.8) + edge(`M${n2(-p.w / 2 + 1.5)} ${n2(-r + 3)}V${n2(r - 3)}`);
    return { id: 'plate', view, svg: wrap('plate', svg), anchors: { hand_l: [0, 0], hand_r: [0, 0] } };
  }
  const svg = `<path d="${disc(0, 0, r, mm(25))}" fill="url(#${o.g})" fill-rule="evenodd" stroke="${INK}" stroke-width="2"/>`
    + `<path d="${disc(0, 0, n2(r * 0.8))}" fill="none" stroke="var(--iron-sh)" stroke-width="1.6"/>`
    + edge(arc(0, 0, n2(r * 0.92), 205, 250), 2)
    + `<text x="0" y="${n2(-r * 0.4)}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="10" fill="${INK}" opacity=".75">${o.value} ${o.unit.toUpperCase()}</text>`;
  return { id: 'plate', view, svg: wrap('plate', svg), anchors: { hand_l: [n2(-r * 0.85), 0], hand_r: [n2(r * 0.85), 0] } };
}
