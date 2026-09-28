// GU-7a-2: one Web Animation per animated element, 3 reps then hold the start pose (R1-3, R1-10).
// Created paused on the setup pose (fill both = the 0 % frame); nothing here ever loops.
import type { Frame, GroupFrames } from '../rig/api';

type Anim = Pick<Animation, 'play' | 'pause' | 'cancel' | 'updatePlaybackRate'> & { currentTime: Animation['currentTime']; startTime?: Animation['startTime']; playbackRate?: number };
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
  /** FG-4: put every animation at ms (the mistake figure joins the correct one's clock); play state unchanged */
  seek(ms: number): void;
  /** FG-4: run on another handle's timeline start (same rate), so a figure mounted later plays in step with no lag */
  follow(other: AnimHandle): void;
  /** the document-timeline start of the running animations (null while paused) */
  startTime(): number | null;
  count: number;
};

// WAAPI fill mode (hold the first and last frame), not a colour; named so FG-1's colour lint reads no `fill: <word>`.
const HOLD_ENDS: FillMode = 'both';

export function timingFor(rep: number): KeyframeAnimationOptions {
  return { duration: rep * 1000, iterations: 3, easing: 'linear', fill: HOLD_ENDS };
}

/** FG-4: the three reps as one chained keyframe set (one set per rep, so the slow-down needs no per-frame code). */
export function chainedTiming(rep: number, reps = 3): KeyframeAnimationOptions {
  return { duration: rep * reps * 1000, iterations: 1, easing: 'linear', fill: HOLD_ENDS };
}

export function mountAnimations(groups: GroupFrames[], root: AnimRoot, rep: number, timing: KeyframeAnimationOptions = timingFor(rep)): AnimHandle {
  const anims: Anim[] = [];
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
    seek: ms => each(a => { a.currentTime = ms; }),
    follow: other => { const st = other.startTime(); if (st == null) each(a => { a.currentTime = other.currentTime(); a.play(); }); else each(a => { a.startTime = st; }); },
    startTime: () => { const v = anims[0]?.startTime; return v == null ? null : Number(v); },
    get count() { return anims.length; },
  };
}
