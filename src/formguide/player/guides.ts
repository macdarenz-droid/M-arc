// V1-19: the guides of docs/FORM-GUIDE-PRODUCTION.md §1: an angle arc at the working joint, one tag outside the face
// keep-out and the hand-path trace (the lab's guides(): arc radius 64, tag at the pivot + (76, 44), no tag on the face).
// Transform and dash-offset keyframes only, on the three reps chained like the figure's (guideView.chainedGroups), so
// they play, pause and seek with it and need no per-frame code. Pure, no DOM.
import type { Frame as Keyframe, GroupFrames } from '../rig/api';
import type { ChannelId, JointId } from '../rig/joints';
import type { Frame } from '../rig/pose';
import type { Pt } from '../rig/ik';
import { VIEWBOXES, type ExerciseGuide } from '../model';
import { sampleGuide, type Figure } from '../sample';
import type { Rig } from '../check/view';
import { REPS } from './guideView';
import { workingChannel } from './readouts';

/** Arc radius (units), the lab's R. */
export const ARC_R = 64;
const ARC_C = 2 * Math.PI * ARC_R;
/** The tag's offset from the working joint's pivot (the lab's pv + (76, 44)); x points away from the body's midline. */
export const TAG_AT: Pt = [76, 44];
/** The tag drawn at scale 1 (the lab's pill: "180°" at 6.2 units a character plus 22, 20 high), before the camera scale. */
export const TAG_W = 4 * 6.2 + 22, TAG_H = 20;
/** The face keep-out about the head pivot (figureFront head: x 172-228, y 27-99 about 200, 90), 4 units of margin. */
export const FACE: readonly [number, number, number, number] = [-32, -67, 32, 13];
const GAP = 4;

export type Box = { x0: number; y0: number; x1: number; y1: number };
export const overlaps = (a: Box, b: Box): boolean => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

/**
 * The tag and the arc are drawn at a fixed size on screen (the lab's pill: 11 px text; the arc ARC_PX across its
 * radius): their scale in a camera is units per px, 1 / (px per unit). The narrowest stage the player supports (a
 * 320 px phone: 286 × 220 px, the gate's V1-19 block measures it) gives the largest scale; the tag is placed for
 * that size, so on a wider stage it is smaller and stays clear of the face.
 */
export const STAGE_MIN: readonly [number, number] = [286, 220];
export const ARC_PX = 40;
export const pxPerUnit = (w: number, h: number, box: readonly number[]): number => Math.min(w / box[2]!, h / box[3]!);
export const kMax = (box: readonly number[]): number => 1 / pxPerUnit(STAGE_MIN[0], STAGE_MIN[1], box);

/** The joint whose pivot carries the arc and its distal neighbour (the limb whose direction the arc follows). */
const LIMB: Record<string, [string, string]> = {
  shoulder_abd: ['shoulder', 'elbow'], shoulder_flex: ['shoulder', 'elbow'], elbow_flex: ['elbow', 'wrist'], elbow_lead: ['elbow', 'wrist'],
  hip_flex: ['hip', 'knee'], hip_abd: ['hip', 'knee'], knee_flex: ['knee', 'ankle'],
};
export function limbOf(ch: ChannelId): [JointId, JointId] | null {
  const l = LIMB[ch.slice(0, -2)], s = ch.slice(-1);
  return l ? [`${l[0]}_${s}` as JointId, `${l[1]}_${s}` as JointId] : null;
}

/** The face keep-out in figure space for a frame (about the head's pivot). */
export function faceBox(rig: Rig, f: Frame): Box {
  const [x, y] = rig.pivot(f, 'head');
  return { x0: x + FACE[0], y0: y + FACE[1], x1: x + FACE[2], y1: y + FACE[3] };
}

/** The tag's box centred on a point, at camera scale k. */
export const tagBox = (c: Pt, k: number): Box => ({ x0: c[0] - (TAG_W * k) / 2, y0: c[1] - (TAG_H * k) / 2, x1: c[0] + (TAG_W * k) / 2, y1: c[1] + (TAG_H * k) / 2 });

/**
 * Where the tag goes: the pivot + TAG_AT (away from the midline), pushed out past the face keep-out, then kept inside
 * the zoom camera (the smaller frame, so it shows in both); if that brings it back onto the face it drops below it.
 */
export function placeTag(pivot: Pt, face: Box, side: 'l' | 'r', mid: number, zoom: readonly [number, number, number, number], k: number): Pt {
  const dir = side === 'r' ? 1 : -1, hw = (TAG_W * k) / 2, hh = (TAG_H * k) / 2;
  let x = pivot[0] + dir * TAG_AT[0], y = pivot[1] + TAG_AT[1];
  if (Math.sign(x - mid) !== dir) x = mid + dir * (hw + GAP);
  const clampIn = () => {
    x = Math.min(zoom[0] + zoom[2] - hw - GAP, Math.max(zoom[0] + hw + GAP, x));
    y = Math.min(zoom[1] + zoom[3] - hh - GAP, Math.max(zoom[1] + hh + GAP, y));
  };
  if (overlaps(tagBox([x, y], k), face)) x = dir > 0 ? face.x1 + hw + GAP : face.x0 - hw - GAP;
  clampIn();
  if (overlaps(tagBox([x, y], k), face)) { y = Math.max(y, face.y1 + hh + GAP); clampIn(); }
  return [x, y];
}

/** Every stop of the chained run: its offset in the run (0..1), the pose's frame, its rep and its rep fraction. */
export function chainedFrames(g: ExerciseGuide, rig: Rig, figure: Figure = 'correct'): { offset: number; f: Frame; pose: Record<ChannelId, number>; r: number; u: number }[] {
  const out: { offset: number; f: Frame; pose: Record<ChannelId, number>; r: number; u: number }[] = [];
  for (let r = 0; r < REPS; r++) {
    const s = sampleGuide(g, figure, figure === 'mistake' ? 0 : r);
    s.stops.forEach((u, i) => {
      if (r > 0 && i === 0) return;
      const pose = {} as Record<ChannelId, number>;
      for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
      out.push({ offset: r4((r + u) / REPS), f: rig.frame(pose), pose, r, u });
    });
  }
  return out;
}

const r4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };
const r2 = (v: number) => { const x = Math.round(v * 100) / 100; return x === 0 ? 0 : x; };
const wrap = (a: number) => ((a % 360) + 540) % 360 - 180;
const angle = (a: Pt, b: Pt) => (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI;

export type TagPlacer = (pivot: Pt, face: Box, k: number) => Pt;
export type GuidePlan = {
  channel: ChannelId;
  /** the arc group's transform and the arc's dash offset, the tag's position, at each stop of the chained run */
  groups: GroupFrames[];
  /** the tag's centre at each stop (figure space), with the face keep-out there */
  tags: { offset: number; at: Pt; face: Box }[];
  /** the hand path over the correct first rep, an SVG path */
  trace: string;
  /** the tag's largest scale (units per px) in the full and the zoom camera, the size it is placed for */
  k: { full: number; zoom: number };
};

/**
 * The guides of a guide file (the correct figure; the lab hides them in compare mode), or null when no channel moves
 * or its limb has no arc. `place` overrides the tag rule (the tests seed a tag on the face with it).
 */
export function guidePlan(g: ExerciseGuide, rig: Rig, place?: TagPlacer): GuidePlan | null {
  const ch = workingChannel(g), limb = ch && limbOf(ch);
  if (!ch || !limb) return null;
  const side = ch.slice(-1) as 'l' | 'r', full = VIEWBOXES[g.camera.full], zoom = VIEWBOXES[g.camera.zoom];
  const k = { full: kMax(full), zoom: kMax(zoom) }, K = Math.max(k.full, k.zoom);
  const arcG: Keyframe[] = [], arcC: Keyframe[] = [], tagG: Keyframe[] = [], tags: GuidePlan['tags'] = [];
  let prev: number | null = null;
  for (const { offset, f, pose } of chainedFrames(g, rig)) {
    const P = rig.pivot(f, limb[0]);
    let phi = angle(P, rig.pivot(f, limb[1]));
    if (prev !== null) phi += 360 * Math.round((prev - phi) / 360);
    prev = phi;
    // the zero line: where the limb would point at 0° of the channel, from how the limb turns per degree here (±1 for
    // a joint the view draws, measured by nudging the channel 1° on the same pose)
    const f1 = rig.frame({ ...pose, [ch]: pose[ch] + 1 }), turn = wrap(angle(rig.pivot(f1, limb[0]), rig.pivot(f1, limb[1])) - phi);
    const from = phi - turn * pose[ch];
    arcG.push({ offset, transform: `translate(${r2(P[0])}px, ${r2(P[1])}px) rotate(${r2(Math.min(from, phi))}deg)` });
    arcC.push({ offset, strokeDashoffset: r2(ARC_C - (Math.abs(phi - from) * Math.PI * ARC_R) / 180) });
    const face = faceBox(rig, f), at = place ? place(P, face, K) : placeTag(P, face, side, rig.pivot(f, 'chest')[0], zoom, K);
    tags.push({ offset, at, face });
    tagG.push({ offset, transform: `translate(${r2(at[0])}px, ${r2(at[1])}px)` });
  }
  const trim = (fs: Keyframe[]) => fs.filter((x, i) => i === 0 || i === fs.length - 1 || !(same(x, fs[i - 1]!) && same(x, fs[i + 1]!)));
  const hand = chainedFrames(g, rig).filter(s => s.r === 0).map(s => rig.point(s.f, `hand_${side}`));
  const trace = 'M' + hand.filter((_, i) => i % 4 === 0 || i === hand.length - 1).map(p => `${r2(p[0])} ${r2(p[1])}`).join(' L');
  return { channel: ch, groups: [{ className: 'fg19-arc', frames: trim(arcG) }, { className: 'fg19-arc-c', frames: trim(arcC) }, { className: 'fg19-tag', frames: trim(tagG) }], tags, trace, k };
}
const same = (a: Keyframe, b: Keyframe) => a.transform === b.transform && a.strokeDashoffset === b.strokeDashoffset;

/** The markup of the guide layer (arc, tag pill, trace); the player sets the tag's text and, per camera, the scale of
 * the tag and the arc (sizeHot), and clips the trace above an open bubble (clipTrace). */
export function guideMarkup(p: GuidePlan): string {
  return `<clipPath id="fg19-clip"><rect class="fg19-clip-r" x="-9999" y="-9999" width="99999" height="99999"/></clipPath>`
    + `<path class="fg19-trace" d="${p.trace}" clip-path="url(#fg19-clip)"/>`
    + `<g class="fg19-arc"><g class="fg19-arc-k"><path class="fg19-arc-c" d="M${ARC_R} 0 A${ARC_R} ${ARC_R} 0 1 1 ${-ARC_R} 0 A${ARC_R} ${ARC_R} 0 1 1 ${ARC_R} 0" stroke-dasharray="${r2(ARC_C)} ${r2(ARC_C)}"/></g></g>`
    + `<g class="fg19-tag"><g class="fg19-tag-k"><rect x="${-TAG_W / 2}" y="${-TAG_H / 2}" width="${TAG_W}" height="${TAG_H}" rx="${TAG_H / 2}"/><foreignObject x="${-TAG_W / 2}" y="${-TAG_H / 2}" width="${TAG_W}" height="${TAG_H}"><div class="fg19-tag-t">0°</div></foreignObject></g></g>`;
}

/** The scale of the tag and of the arc for a stage drawn at `px` per unit, capped at the size the tag was placed for. */
export function guideScales(px: number, kCap: number): { tag: number; arc: number } {
  const k = Math.min(kCap, 1 / Math.max(1e-6, px));
  return { tag: +k.toFixed(4), arc: +((k * ARC_PX) / ARC_R).toFixed(4) };
}

/** The stops where the tag, at its placed size, meets the face keep-out (none for a passing file). */
export const tagClashes = (p: GuidePlan): number[] => {
  const K = Math.max(p.k.full, p.k.zoom);
  return p.tags.filter(t => overlaps(tagBox(t.at, K), t.face)).map(t => t.offset);
};
