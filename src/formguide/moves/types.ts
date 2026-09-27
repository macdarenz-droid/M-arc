// A movement is a motion spec, not key poses (docs/GUIDE-UPGRADE-ARCHITECTURE.md 5.0 R1-2): the player text (the api
// MoveSpec), the stop spacing, and one channel per animated group whose value at progress p is the string the demo writes.
import type { MoveSpec } from '../rig/api';
import type { StopSpec } from '../rig/stops';

export type ChannelKind = 'rotate' | 'scaleY' | 'scaleX' | 'translateY' | 'opacity' | 'dashoffset' | 'composite';
export type Channel = {
  /** the demo's class (and keyframe name), e.g. 'cp-ua' */
  className: string;
  kind: ChannelKind;
  /** the value the demo writes at progress p: a transform string, or an opacity / stroke-dashoffset number as written */
  at: (p: number) => string;
  /** a second class animated with the same frames (lat pulldown: lp-fbh runs the lp-fhd keyframes) */
  alias?: string;
};
/** a named measurement and its allowed range (spec.md 3.x truth tables) */
export type Truth = { name: string; value: number; min: number; max: number };
export type Move = {
  spec: MoveSpec;
  stops: StopSpec;
  channels: Channel[];
  /** the glow channel (opacity, rises through the lift and falls on the return) */
  glow: string;
};
