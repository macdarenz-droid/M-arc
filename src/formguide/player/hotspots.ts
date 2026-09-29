// V1-19: muscle hotspots on the figure (docs/FORM-GUIDE-PRODUCTION.md §1; GU-7a's one-bubble rule in controller.ts:
// a tapped muscle opens its bubble and closes any zoom tip). One hotspot per named muscle, spliced into the figure
// markup right after that muscle's tint path, so it rides the same joint transforms as the muscle; its radius is set
// from the drawn scale so the target is at least 44 px across. Pure, except sizeHotspots (a DOM root it is given).
import { MUSCLE_BY_ID, type MuscleId } from '@/data/muscles';
import type { ExerciseGuide } from '../model';
import { MUSCLE_NOTES } from '../muscleNotes';
import { effortRows } from './readouts';

/** The smallest hit target, px (§1 "44 px controls"), and the diameter drawn: 4 px over, for the joints' scale ops. */
export const HOT_MIN_PX = 44;
export const HOT_PX = 48;

export type Hotspot = { m: MuscleId; role: 'target' | 'helps' | 'keepQuiet'; side: 'l' | 'r'; cx: number; cy: number };

/** The bounding-box centre of an SVG path of absolute M/L/C/Q/Z commands (the figure's tint paths). */
export function pathCentre(d: string): [number, number] | null {
  const n = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/g) ?? []).map(Number);
  if (n.length < 2) return null;
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (let i = 0; i + 1 < n.length; i += 2) { x0 = Math.min(x0, n[i]!); x1 = Math.max(x1, n[i]!); y0 = Math.min(y0, n[i + 1]!); y1 = Math.max(y1, n[i + 1]!); }
  return [(x0 + x1) / 2, (y0 + y1) / 2];
}

/**
 * One hotspot per target and helper the figure draws a tint for, targets first (GU-7a's set: the muscles that do the
 * work; keep-quiet muscles show in the effort bars and the mistake, and a third circle on the shoulders would not
 * keep 44 px at 360 px). Sides alternate from the right (the working side), so the two land on opposite shoulders;
 * a muscle drawn on one side only uses that side.
 */
export function hotspotsFor(g: ExerciseGuide, markup: string): Hotspot[] {
  const out: Hotspot[] = [];
  let next: 'l' | 'r' = 'r';
  for (const { id, role } of effortRows(g)) {
    if (role === 'keepQuiet') continue;
    const at = (s: 'l' | 'r') => { const x = new RegExp(`class="fg-p fg-t-${id}_${s}" d="([^"]+)"`).exec(markup); return x ? pathCentre(x[1]!) : null; };
    const want: 'l' | 'r' = at(next) ? next : next === 'r' ? 'l' : 'r', c = at(want);
    if (!c) continue;
    out.push({ m: id, role, side: want, cx: +c[0].toFixed(2), cy: +c[1].toFixed(2) });
    next = want === 'r' ? 'l' : 'r';
  }
  return out;
}

/**
 * The figure markup with each hotspot (a transparent circle, radius set later) and its selection outline (the tint
 * path's outline, shown while its bubble is open) right after the muscle's tint path.
 */
export function withHotspots(markup: string, hs: Hotspot[]): string {
  let out = markup;
  for (const h of hs) {
    const re = new RegExp(`<path class="fg-p fg-t-${h.m}_${h.side}" d="([^"]+)"[^>]*/>`);
    out = out.replace(re, tint => `${tint}<path class="fg19-out" data-muscle="${h.m}" d="${re.exec(tint)![1]}"/><circle class="fg19-hot" data-muscle="${h.m}" cx="${h.cx}" cy="${h.cy}" r="1" tabindex="0" role="button" aria-label="${nameOf(h.m)}"/>`);
  }
  return out;
}

/** The hotspot radius in viewBox units for a scene drawn at `pxPerUnit`: HOT_PX across (tenths, rounded up). */
export const hotRadius = (pxPerUnit: number): number => Math.ceil(((HOT_PX / 2) / Math.max(1e-6, pxPerUnit)) * 10) / 10;

/** Sets every hotspot's radius under a root (on mount, on a camera change and on a resize). */
export function sizeHotspots(root: ParentNode, r: number): void {
  root.querySelectorAll('.fg19-hot').forEach(c => c.setAttribute('r', String(r)));
}

const ROLE = { target: 'target', helps: 'helper', keepQuiet: 'keep quiet' } as const;
const DOT = { target: 'var(--target)', helps: 'var(--help)', keepQuiet: 'var(--quiet)' } as const;
const nameOf = (m: MuscleId) => MUSCLE_BY_ID[m]?.common ?? m;

/** A tapped muscle's bubble, GU-7a's shape: "<b>Common</b> (anatomical), role. Line", the dot in its tint colour. */
export function muscleBubble(g: ExerciseGuide, m: MuscleId): { name: string; rest: string; dot: string } | null {
  const row = effortRows(g).find(x => x.id === m), info = MUSCLE_BY_ID[m];
  if (!row || !info) return null;
  const line = MUSCLE_NOTES[g.id]?.[m] ?? info.action;
  return { name: info.common, rest: `(${info.anatomical}), ${ROLE[row.role]}. ${line}`, dot: DOT[row.role] };
}
