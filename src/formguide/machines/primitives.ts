// V1-09: the four machine primitives (docs/FORM-GUIDE-PRODUCTION.md §4 "Machine primitives"), as transforms only: a
// lever turns about its pivot, a carriage slides along its rail, a cable is a unit line scaled and turned from its
// pulley to the handle, and the stack rises by the handle's travel × gain with its plate count from the load. Each
// returns the rig's Op list (rig/pose.ts `css`), so the layer animates `transform` and nothing else. Pure, no DOM.
import { anchorAt, type Lever, type MachineDrawing, type Slide } from '../check/machines';
import type { Op } from '../rig/pose';
import type { Pt } from '../rig/ik';

/** The weight stack: plates `plateH` tall with a `gap` between, drawn from `top` down in a column `w` wide at x. The
 * top `plates(kg)` of them (the pinned ones) rise by the travel of drive part `part` × `gain` units. */
export type Stack = { part: string; x: number; top: number; w: number; plateH: number; gap: number; gain: number; plateKg: number; max: number };

/** A machine as the player draws it: the check-side drawing plus the moving parts' art. */
export type MachineArt = MachineDrawing & {
  /** Per drive part, its art drawn at travel 0 (lever arm, carriage, handle); the layer moves it. */
  moving?: Record<string, string>;
  /** Per cable part, the pulley its line runs from. */
  pulleys?: Record<string, Pt>;
  stack?: Stack;
};

const D = 180 / Math.PI;
const n4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };

/** Lever: rotate about the pivot from its travel-0 angle. anchorAt's angle runs counter-clockwise on screen (0° down,
 * 90° right), a CSS rotate clockwise, hence the sign. */
export function leverOps(p: Lever, s: number): Op[] {
  const turn = -(p.deg[1] - p.deg[0]) * s;
  return [['t', p.pivot[0], p.pivot[1]], ['r', n4(turn)], ['t', -p.pivot[0], -p.pivot[1]]];
}

/** Carriage: translate along the rail by the anchor's move from travel 0. */
export function carriageOps(p: Slide, s: number): Op[] {
  const a = anchorAt(p, 0), b = anchorAt(p, s);
  return [['t', n4(b[0] - a[0]), n4(b[1] - a[1])]];
}

/** Cable: the unit line (0,0)→(0,1) scaled to the pulley-to-end length and turned to point at the end. The scale is on
 * the line's own axis only, so its stroke width never changes. */
export function cableOps(pulley: Pt, end: Pt): Op[] {
  const dx = end[0] - pulley[0], dy = end[1] - pulley[1];
  return [['t', pulley[0], pulley[1]], ['r', n4(Math.atan2(-dx, dy) * D)], ['s', 1, n4(Math.max(1e-3, Math.hypot(dx, dy)))]];
}

/** Stack: the pinned plates rise by travel × gain (up is -y). */
export const stackOps = (st: Stack, s: number): Op[] => [['t', 0, n4(-Math.max(0, s) * st.gain)]];

/** Plates pinned for a load: 0 at 0 kg, one per started `plateKg`, at most the column. */
export const platesFor = (st: Stack, kg: number): number => (kg > 0 ? Math.min(st.max, Math.ceil(kg / st.plateKg - 1e-9)) : 0);

/** The column's plates as markup: the pinned ones in the moving group, the rest fixed below. */
export function stackMarkup(st: Stack, kg: number): { moving: string; fixed: string } {
  // paths, not rects: the budget (check/svg.ts countPaths) counts <path> only
  const plate = (i: number) => `<path d="M${st.x} ${n4(st.top + i * (st.plateH + st.gap))}h${st.w}v${st.plateH}h${-st.w}Z" fill="var(--iron)" stroke="var(--ink)" stroke-width="1.2"/>`;
  const k = platesFor(st, kg), all = Array.from({ length: st.max }, (_, i) => plate(i));
  return { moving: all.slice(0, k).join(''), fixed: all.slice(k).join('') };
}
