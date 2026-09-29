// V1-09: the stand-in machine for the first phone frame-rate reading (DC0, D-FG7 (k)): no real machine, just the
// §3 budget's worst case, exactly 80 paths, drawn front behind the lateral raise's right side. A cable tower: frame,
// pulley, a 14-plate stack that rises with the arm, and a cable from the pulley to the right hand. Token colours only.
import type { MachineArt } from './primitives';

const X0 = 440, X1 = 486, TOP = 18, BASE = 566;
const P = (d: string, fill = 'var(--iron)', w = 1.6) => `<path d="${d}" fill="${fill}" stroke="var(--ink)" stroke-width="${w}" stroke-linejoin="round"/>`;
const bolt = (x: number, y: number) => P(`M${x - 2.5} ${y}a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0Z`, 'var(--iron-hi)', 0.8);

/** The stack's plates (the column under the pulley). */
export const STAND_IN_PLATES = 14;
const fixed = [
  P(`M${X0 - 6} ${TOP}h6v${BASE - TOP}h-6Z`), P(`M${X1} ${TOP}h6v${BASE - TOP}h-6Z`),           // posts
  P(`M${X0 - 12} ${TOP - 8}h${X1 - X0 + 24}v10h${-(X1 - X0 + 24)}Z`),                              // top beam
  P(`M${X0 - 20} ${BASE - 6}h${X1 - X0 + 40}v8h${-(X1 - X0 + 40)}Z`, 'var(--iron-sh)'),            // base
  P(`M${X0 + 8} ${TOP + 2}v${BASE - TOP - 10}`, 'none', 1.2), P(`M${X1 - 8} ${TOP + 2}v${BASE - TOP - 10}`, 'none', 1.2), // guide rods
  P(`M${X0 + 23} 30m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0Z`, 'var(--iron-hi)'),                      // pulley wheel
  P(`M${X0 + 23} 30m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0Z`, 'var(--ink)', 0.6),                       // axle
];
/** Filler bolts up the posts so the drawing is exactly 80 paths with every plate and the cable drawn. */
const MOVING = 2;                                    // cable line, handle
const bolts = Array.from({ length: 80 - fixed.length - STAND_IN_PLATES - MOVING }, (_, i) => bolt(i % 2 ? X1 + 3 : X0 - 3, TOP + 20 + Math.floor(i / 2) * 18));

export const STAND_IN: MachineArt = {
  view: 'front',
  svg: fixed.join('') + bolts.join(''),
  parts: { cable: { kind: 'cable', path: [[292, 310], [445, 135]], attach: 'hand_r' } },
  pulleys: { cable: [X0 + 14, 30] },
  moving: { cable: P('M286 306h12v8h-12Z', 'var(--iron-hi)', 1.2) },
  stack: { part: 'cable', x: X0 + 6, top: 330, w: X1 - X0 - 12, plateH: 12, gap: 3, gain: 90, plateKg: 5, max: STAND_IN_PLATES },
};
