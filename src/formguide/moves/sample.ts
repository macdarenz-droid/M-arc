// sampleMove (R1-3): every channel at every stop, as Web Animations keyframes with the demo's written values.
import type { Frame, Sample } from '../rig/api';
import { progress } from '../rig/math';
import { stopsFor } from '../rig/stops';
import type { Channel, Move } from './types';

const frameOf = (c: Channel, offset: number, v: string): Frame =>
  c.kind === 'opacity' ? { offset, opacity: +v } : c.kind === 'dashoffset' ? { offset, strokeDashoffset: +v } : { offset, transform: v };

export function sampleMove(move: Pick<Move, 'stops' | 'channels'>): Sample {
  const stops = stopsFor(move.stops);
  const ps = stops.map(pc => progress(pc / 100));
  // stop by stop, every channel at one stop before the next (a move may share one solve per stop across its channels)
  const frames: Frame[][] = move.channels.map(() => []);
  stops.forEach((pc, i) => { const off = +(pc / 100).toFixed(6); move.channels.forEach((c, k) => frames[k]!.push(frameOf(c, off, c.at(ps[i]!)))); });
  const groups = move.channels.flatMap((c, k) => {
    const f = frames[k]!;
    return c.alias ? [{ className: c.className, frames: f }, { className: c.alias, frames: f }] : [{ className: c.className, frames: f }];
  });
  return { stops, groups };
}
/** the written value of a frame as a string (the fixture's form) */
export const frameValue = (f: Frame): string => f.transform ?? String(f.opacity ?? f.strokeDashoffset);
