// GU-7a-2: the demo's player logic (anim-machine-chest-press/logic.js `Component` at DEMO_COMMIT
// f49c6c9, round 3: one shared bubble, spec 2.10, D-R11) as pure functions. No DOM: every transition
// returns the next state and the one playback effect the player applies through waapi.ts.
// App differences (R1-13 only): `rm` comes from reduced(); no autoplay or loop (3 reps, then
// hold); speed keeps the current phase (updatePlaybackRate) instead of restarting the rep.
import type { MuscleId } from '../../data/muscles';

export type Mode = 'anim' | 'pics';
/** One shared bubble: a zoom chip's tip (id 1..3, root class zoom-1..3 as the demo's Stage.css expects) or a
 * tapped muscle's info, never both (round 3 replaces the demo's old `zoom` field with this). */
export type Bubble = { kind: 'zoom'; id: number } | { kind: 'muscle'; id: MuscleId } | null;
export type PlayerState = { playing: boolean; started: boolean; ended: boolean; speed: 1 | 0.5; mode: Mode; rm: boolean; bubble: Bubble };
/** What the player must do to the animations after a transition. */
export type Fx = 'play' | 'pause' | 'replay' | 'reset' | 'rate' | null;
export type Step = { state: PlayerState; fx: Fx };

export function initial(rm: boolean): PlayerState {
  return { playing: false, started: false, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', rm, bubble: null };
}

export function togglePlay(s: PlayerState): Step {
  if (s.rm) return { state: s, fx: null };
  if (s.mode !== 'anim') return { state: { ...s, mode: 'anim', bubble: null, playing: true, started: true, ended: false }, fx: 'replay' };
  if (s.ended) return { state: { ...s, playing: true, started: true, ended: false }, fx: 'replay' };
  if (s.playing) return { state: { ...s, playing: false }, fx: 'pause' };
  return { state: { ...s, playing: true, started: true }, fx: 'play' };
}

export function setSpeed(s: PlayerState, v: 1 | 0.5): Step {
  if (v === s.speed) return { state: s, fx: null };
  return { state: { ...s, speed: v }, fx: 'rate' };
}

export function setMode(s: PlayerState, m: Mode): Step {
  if (m === s.mode || (s.rm && m === 'anim')) return { state: s, fx: null };
  return { state: { ...s, mode: m, bubble: null, playing: false, started: false, ended: false }, fx: 'reset' };
}

/** A zoom chip: tapping the active one again closes it; a zoom replaces a muscle bubble (spec 2.10). */
export function pickZoom(s: PlayerState, n: number): Step {
  const same = s.bubble?.kind === 'zoom' && s.bubble.id === n;
  return { state: { ...s, bubble: same ? null : { kind: 'zoom', id: n } }, fx: null };
}

/** The zoom chip open now (0 = none). */
export const zoomOf = (s: PlayerState): number => (s.bubble?.kind === 'zoom' ? s.bubble.id : 0);

/** A muscle hotspot: opens its bubble (closing any zoom); the same muscle again closes it. None in Pictures. */
export function tapMuscle(s: PlayerState, id: MuscleId): Step {
  if (s.mode !== 'anim') return { state: s, fx: null };
  const same = s.bubble?.kind === 'muscle' && s.bubble.id === id;
  return { state: { ...s, bubble: same ? null : { kind: 'muscle', id } }, fx: null };
}

/** The keys that open a focused muscle hotspot (the demo's keyMuscle: Enter, Space, old Edge's "Spacebar"). */
export const isActivateKey = (key: string): boolean => key === 'Enter' || key === ' ' || key === 'Spacebar';

/** A tap on the stage background closes a muscle bubble; a zoom stays (it closes from its chip). */
export function tapStage(s: PlayerState): Step {
  if (s.bubble?.kind !== 'muscle') return { state: s, fx: null };
  return { state: { ...s, bubble: null }, fx: null };
}

/** The 3 reps ran out: hold the start pose, the button becomes Replay. */
export function finish(s: PlayerState): Step {
  if (!s.playing) return { state: s, fx: null };
  return { state: { ...s, playing: false, ended: true }, fx: null };
}

/** Reduced motion switched on while open: Pictures only, nothing animates. Off: Animation is allowed again. */
export function setReduced(s: PlayerState, rm: boolean): Step {
  if (rm === s.rm) return { state: s, fx: null };
  if (!rm) return { state: { ...s, rm }, fx: null };
  return { state: { ...s, rm, mode: 'pics', bubble: null, playing: false, started: false, ended: false }, fx: 'reset' };
}

/** The demo's renderVals(): every class, label and hidden flag the chrome reads. */
export function renderVals(s: PlayerState) {
  const zoom = zoomOf(s);
  const anim = s.mode === 'anim', still = !anim && zoom > 0;
  return {
    zoom,
    rootClass: `player${zoom ? ` zoom-${zoom}` : ''}${anim ? '' : ' pictures'}`,
    showStage: anim || still,
    showPics: !anim && !still,
    showPills: anim && !zoom,
    showCamLabel: !zoom,
    showSlow: anim && s.speed === 0.5,
    showIdle: anim && !s.started && !s.ended,
    showEnded: anim && s.ended,
    showCaps: anim && s.started && !s.ended,
    showStill1: still && zoom !== 2, showStill3: still && zoom === 2,
    showPicsLine: !anim && !still,
    showTempo: anim,
    isPlay: !s.playing && !s.ended, isPause: s.playing, isReplay: s.ended,
    playLabel: s.ended ? 'Replay' : (s.playing ? 'Pause' : 'Play'),
    playDisabled: s.rm,
    zoomPressed: [zoom === 1, zoom === 2, zoom === 3],
    speed1: s.speed === 1, speedHalf: s.speed === 0.5,
    modeAnim: anim, modePics: !anim, animDisabled: s.rm,
    hintAnim: !s.rm && anim, hintPics: !s.rm && !anim, hintRm: s.rm,
    selMuscle: s.bubble?.kind === 'muscle' ? s.bubble.id : null,
  };
}

/** Rep pill and caption from the animation's own clock (ms), so they never drift from the figure. */
export function clock(ms: number, rep: number): { rep: 1 | 2 | 3; phase: 0 | 1 | 2 | 3; done: boolean } {
  const len = rep * 1000;
  const done = ms >= 3 * len;
  const t = done ? 0 : Math.max(0, ms);
  const f = (t % len) / len;
  const phase = f < 0.25 ? 0 : f < 0.375 ? 1 : f < 0.875 ? 2 : 3;
  return { rep: done ? 1 : (Math.min(2, Math.floor(t / len)) + 1) as 1 | 2 | 3, phase, done };
}
