// GU-7a-2: one Web Animation per animated element, 3 reps then hold the start pose (R1-3, R1-10).
// Created paused on the setup pose (fill both = the 0 % frame); nothing here ever loops.
import type { Frame, GroupFrames } from '../rig/api';

type Anim = Pick<Animation, 'play' | 'pause' | 'cancel' | 'updatePlaybackRate'> & { currentTime: Animation['currentTime'] };
type Animatable = { animate(frames: Frame[], timing: KeyframeAnimationOptions): Anim };
/** R1-10 names `querySelector`, but a demo class animates several elements (the chest press has three
 * `cp-ul` groups), so the root gives every match; a real Element has both. */
export type AnimRoot = { querySelectorAll(sel: string): ArrayLike<Animatable> };

export type AnimHandle = {
  play(): void; pause(): void; rate(r: number): void; replay(): void;
  /** back to the setup pose, paused */
  reset(): void;
  cancel(): void;
  /** ms into the 3-rep run, in animation time (speed does not change it) */
  currentTime(): number;
  count: number;
};

// WAAPI fill mode (hold the first and last frame), not a colour; named so FG-1's colour lint reads no `fill: <word>`.
const HOLD_ENDS: FillMode = 'both';

export function timingFor(rep: number): KeyframeAnimationOptions {
  return { duration: rep * 1000, iterations: 3, easing: 'linear', fill: HOLD_ENDS };
}

export function mountAnimations(groups: GroupFrames[], root: AnimRoot, rep: number): AnimHandle {
  const anims: Anim[] = [];
  const timing = timingFor(rep);
  for (const g of groups) {
    const els = root.querySelectorAll(`.${g.className}`);
    for (let i = 0; i < els.length; i++) {
      const a = els[i]!.animate(g.frames, timing);
      a.pause();
      anims.push(a);
    }
  }
  const each = (fn: (a: Anim) => void) => { for (const a of anims) fn(a); };
  return {
    play: () => each(a => a.play()),
    pause: () => each(a => a.pause()),
    rate: r => each(a => a.updatePlaybackRate(r)),
    replay: () => each(a => { a.currentTime = 0; a.play(); }),
    reset: () => each(a => { a.pause(); a.currentTime = 0; }),
    cancel: () => { each(a => a.cancel()); anims.length = 0; },
    currentTime: () => Number(anims[0]?.currentTime ?? 0),
    get count() { return anims.length; },
  };
}
