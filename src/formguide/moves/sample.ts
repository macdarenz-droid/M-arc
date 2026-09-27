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
  const groups = move.channels.flatMap(c => {
    const frames = stops.map((pc, i) => frameOf(c, +(pc / 100).toFixed(6), c.at(ps[i]!)));
    return c.alias ? [{ className: c.className, frames }, { className: c.alias, frames }] : [{ className: c.className, frames }];
  });
  return { stops, groups };
}
/** the written value of a frame as a string (the fixture's form) */
export const frameValue = (f: Frame): string => f.transform ?? String(f.opacity ?? f.strokeDashoffset);
