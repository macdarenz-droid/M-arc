// FG-3: the shape the checks read from a machine drawing (docs/FORM-GUIDE-PRODUCTION.md §4 "Machine primitives").
// Provisional until FG-7 builds `machines/index.ts`: FG-7 may extend this type but must keep the fields the checks read
// (handsOnHandle, bodyOnPad, machinePivot, setupDiffers, pathBudget, noFilters, themes). Pure data, no DOM.
import type { AttachmentId, Settings } from '../model';
import type { JointId, View } from '../rig/joints';
import type { Pt } from '../rig/ik';

/** Pivoting lever: `travel` 0..1 of a drive turns it from deg[0] to deg[1] about the pivot (0° = pointing down on
 * screen, + counter-clockwise as the rig's shoulder_abd). `attach` (optional) is the body point on its handle or pad,
 * `radius` units out from the pivot. `bound` is the joint the pivot sits on (within 0.05 units, §4). */
export type Lever = { kind: 'lever'; pivot: Pt; bound: JointId; radius: number; deg: [number, number]; attach?: AttachmentId };
/** Sliding carriage (along a rail) or a cable end (along the handle's line): `travel` 0..1 runs from path[0] to path[1]. */
export type Slide = { kind: 'carriage' | 'cable'; path: [Pt, Pt]; attach?: AttachmentId };
export type MachinePart = Lever | Slide;

export type MachineDrawing = {
  view: View;
  /** Frame, seat and pads: static markup in the view's units, token colours only. */
  svg: string;
  /** Adjustable parts for the setup moment: the group's markup moves by value × shift units per setting unit. */
  settings?: Partial<Record<keyof Settings, { svg: string; shift: Pt }>>;
  /** Moving parts, by the name a file's `machine.drive[].part` uses. */
  parts: Record<string, MachinePart>;
  /** Fixed pads the body meets (§3 "Attachment points"). */
  pads?: { attach: AttachmentId; at: Pt }[];
};

/** The machines library. Empty until FG-7; a file naming a machine that is not here fails the machine checks. */
export const MACHINES: Record<string, MachineDrawing> = {};

const D = Math.PI / 180;
/** Where a part's anchor (handle, pad, cable end) is at drive travel s (0..1; outside that range it leaves the path). */
export function anchorAt(p: MachinePart, s: number): Pt {
  if (p.kind === 'lever') {
    const a = (p.deg[0] + (p.deg[1] - p.deg[0]) * s) * D;
    return [p.pivot[0] + p.radius * Math.sin(a), p.pivot[1] + p.radius * Math.cos(a)];
  }
  const [a, b] = p.path;
  return [a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s];
}

/** Distance from a point to a part's path: the lever's arc (its circle between the end angles) or the slide's segment. */
export function offPath(p: MachinePart, q: Pt): number {
  if (p.kind === 'lever') {
    const r = Math.hypot(q[0] - p.pivot[0], q[1] - p.pivot[1]);
    const a = Math.atan2(q[0] - p.pivot[0], q[1] - p.pivot[1]) / D, lo = Math.min(...p.deg), hi = Math.max(...p.deg);
    if (a >= lo - 1e-9 && a <= hi + 1e-9) return Math.abs(r - p.radius);
    return Math.min(...p.deg.map(d => { const e = anchorAt({ ...p, deg: [d, d] }, 0); return Math.hypot(q[0] - e[0], q[1] - e[1]); }));
  }
  const [a, b] = p.path, dx = b[0] - a[0], dy = b[1] - a[1], L2 = dx * dx + dy * dy;
  const t = L2 ? Math.min(1, Math.max(0, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / L2)) : 0;
  return Math.hypot(q[0] - a[0] - dx * t, q[1] - a[1] - dy * t);
}

/** The setup moment: the static drawing plus each adjustable part moved to its setting (right, or `wrong` for one). */
export function setupMarkup(m: MachineDrawing, settings: Settings, wrong?: { setting: keyof Settings; value: number }): string {
  const adj = Object.entries(m.settings ?? {}).map(([k, a]) => {
    const raw = wrong?.setting === k ? wrong.value : settings[k as keyof Settings];
    const v = typeof raw === 'number' ? raw : 0;
    return `<g class="fg-set-${k}" transform="translate(${+(v * a!.shift[0]).toFixed(4)} ${+(v * a!.shift[1]).toFixed(4)})">${a!.svg}</g>`;
  });
  return `<g class="fg-machine">${m.svg}${adj.join('')}</g>`;
}
