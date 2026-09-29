// V1-09: the machine layer of the player (docs/FORM-GUIDE-PRODUCTION.md §4, §6). The machine sits behind the figure in
// its own <g>: the frame, seat and pads fixed, each drive part in a `fg-mp` group moved by transform only (lever
// rotate, carriage translate, cable scale-and-rotate from its pulley, stack translateY), keyframed on the same stops and
// offsets as the figure (guideView.ts chainedGroups), so the two play on one clock. Pure, no DOM.
import type { GroupFrames, Frame as Keyframe } from '../rig/api';
import { css, type Frame as SnapFrame, type Op } from '../rig/pose';
import type { TokenReader } from '../rig/paint';
import { snapshotSvg } from '../snapshot';
import type { Pt } from '../rig/ik';
import type { ExerciseGuide, Settings } from '../model';
import { sampleGuide, stateAt, stopsFor, tempoOf, type Figure } from '../sample';
import { anchorAt, setupMarkup } from '../check/machines';
import type { Rig } from '../check/view';
import type { ChannelId } from '../rig/joints';
import { machineFor } from '../machines';
import { STAND_IN } from '../machines/stand_in';
import { cableOps, carriageOps, leverOps, stackMarkup, stackOps, type MachineArt } from '../machines/primitives';

/** Per stop of one rep: each drive part's travel, and (optional) where a cable's end is when something other than its
 * own path puts it there (the stand-in's cable follows the hand). */
export type DriveAt = (rep: number, i: number, u: number) => { travel: Record<string, number>; ends?: Record<string, Pt> };

export const partClass = (part: string) => `fg-m-${part}`;
export const cableClass = (part: string) => `fg-mc-${part}`;
export const STACK_CLASS = 'fg-ms';

/** The layer's markup: the setup drawing (the right settings, or one `wrong`), the fixed plates, then the moving groups
 * at travel 0 (cable lines as the unit line their keyframes scale). */
export function layerMarkup(m: MachineArt, o: { kg: number; settings?: Settings; wrong?: { setting: keyof Settings; value: number } }): string {
  const base = setupMarkup(m, o.settings ?? {}, o.wrong);
  const out: string[] = [];
  const st = m.stack ? stackMarkup(m.stack, o.kg) : null;
  if (st) out.push(st.fixed, `<g class="fg-mp ${STACK_CLASS}">${st.moving}</g>`);
  for (const [part, p] of Object.entries(m.parts)) {
    const pulley = m.pulleys?.[part];
    if (p.kind === 'cable' && pulley) out.push(`<g class="fg-mp ${cableClass(part)}" style="transform:${css(cableOps(pulley, anchorAt(p, 0)))}"><path d="M0 0V1" fill="none" stroke="var(--ink)" stroke-width="1.6"/></g>`);
    const art = m.moving?.[part];
    if (art) out.push(`<g class="fg-mp ${partClass(part)}">${art}</g>`);
  }
  return base.replace(/<\/g>$/, `${out.join('')}</g>`);
}

/** Every moving group's transform at one stop. */
function opsAt(m: MachineArt, at: ReturnType<DriveAt>): [string, Op[]][] {
  const out: [string, Op[]][] = [];
  for (const [part, p] of Object.entries(m.parts)) {
    const s = at.travel[part] ?? 0, end = at.ends?.[part];
    if (p.kind === 'lever') out.push([partClass(part), leverOps(p, s)]);
    else {
      const a0 = anchorAt(p, 0), q = end ?? anchorAt(p, s);
      out.push([partClass(part), p.kind === 'carriage' && !end ? carriageOps(p, s) : [['t', q[0] - a0[0], q[1] - a0[1]]]]);
      const pulley = m.pulleys?.[part];
      if (p.kind === 'cable' && pulley) out.push([cableClass(part), cableOps(pulley, q)]);
    }
  }
  if (m.stack) out.push([STACK_CLASS, stackOps(m.stack, at.travel[m.stack.part] ?? 0)]);
  return out;
}

const r4 = (v: number) => { const x = Math.round(v * 1e4) / 1e4; return x === 0 ? 0 : x; };

/** The layer's WAAPI groups over `reps` reps chained (rep r's stop u at offset (r + u) / reps), flat runs trimmed to
 * their ends, as the figure's (guideView.ts chainedGroups). `stops(rep)` gives the figure's stops for that rep. */
export function layerGroups(m: MachineArt, stops: (rep: number) => number[], at: DriveAt, reps: number): GroupFrames[] {
  const by = new Map<string, Keyframe[]>();
  for (let r = 0; r < reps; r++) stops(r).forEach((u, i) => {
    if (r > 0 && i === 0) return;
    const offset = r4((r + u) / reps);
    for (const [cls, ops] of opsAt(m, at(r, i, u))) {
      let list = by.get(cls);
      if (!list) by.set(cls, (list = []));
      list.push({ offset, transform: css(ops) });
    }
  });
  return [...by].map(([className, fs]) => ({
    className,
    frames: fs.filter((f, i) => i === 0 || i === fs.length - 1 || !(f.transform === fs[i - 1]!.transform && f.transform === fs[i + 1]!.transform)),
  }));
}

/** A machine file's drive: each part's travel at each stop, as the sampler gives it (V1-04): a followed part's is its
 * body point, solved onto the part's path, projected there; a keyed part's is its curve; the mistake's `travel`
 * replaces either. The mistake plays its one rep every time, as its figure does. */
export function guideDrive(g: ExerciseGuide, rig: Rig, figure: Figure): DriveAt {
  const drives = g.machine?.drive ?? [], cache = new Map<number, ReturnType<typeof sampleGuide>>();
  return (rep, i, u) => {
    const r = figure === 'mistake' ? 0 : rep;
    let s = cache.get(r);
    if (!s) cache.set(r, (s = sampleGuide(g, figure, r, rig)));
    const travel: Record<string, number> = {};
    for (const t of s.travel ?? []) travel[t.part] = t.stops[i]![1];
    if (drives.some(d => travel[d.part] === undefined)) {
      const keyed = stateAt(g, u, figure, r, rig).travel;
      drives.forEach((d, k) => { travel[d.part] ??= keyed[k]!; });
    }
    return { travel };
  };
}

/** The figure's stops per rep, as chainedGroups plays them. */
export const guideStops = (g: ExerciseGuide, figure: Figure) => (rep: number) => stopsFor(tempoOf(g, figure, figure === 'mistake' ? 0 : rep), g.order, g.kind);

/** The stand-in's drive (V1-09, DC0): the stack follows the right arm's raise, the cable end the right hand. */
export function standInDrive(g: ExerciseGuide, rig: Rig, figure: Figure): DriveAt {
  const cache = new Map<number, ReturnType<typeof sampleGuide>>();
  return (rep, i) => {
    const r = figure === 'mistake' ? 0 : rep;
    let s = cache.get(r);
    if (!s) cache.set(r, (s = sampleGuide(g, figure, r, rig)));
    const pose = {} as Record<ChannelId, number>;
    for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
    const hand = rig.point(rig.frame(pose), 'hand_r');
    return { travel: { cable: Math.min(1, Math.max(0, (pose.shoulder_abd_r - 10) / 78)) }, ends: { cable: hand } };
  };
}

/** The machine layer the player mounts, or null: a machine file's drawing (a machine not drawn yet throws its reason),
 * else the stand-in only while Stress is on in compare mode. A free-weight file mounts no layer otherwise. */
export function layerFor(g: ExerciseGuide, o: { stress: boolean; compare: boolean }): { art: MachineArt; standIn: boolean } | null {
  if (g.machine) {
    const m = machineFor(g.machine.id);
    if (typeof m === 'string') throw new Error(`form guide ${g.id}: ${m}`);
    return { art: m, standIn: false };
  }
  return o.stress && o.compare ? { art: STAND_IN, standIn: true } : null;
}

/** The setup moment (§1): the machine at the file's settings and at the mistake's wrong one, the figure at its start
 * pose on top, as standalone SVGs (snapshot.ts). Right only when the mistake has no setup part. */
export function setupSvgs(g: ExerciseGuide, art: MachineArt, figure: { markup: string; frame: SnapFrame }, read: TokenReader, vb: readonly [number, number, number, number], kg: number): { svg: string; wrong: boolean }[] {
  const settings = g.machine?.settings ?? {}, su = g.mistake.setup;
  const pic = (wrong?: { setting: keyof Settings; value: number }) => snapshotSvg(layerMarkup(art, { kg, settings, wrong }) + figure.markup, figure.frame, read, vb);
  return [{ svg: pic(), wrong: false }, ...(su ? [{ svg: pic({ setting: su.setting, value: su.wrong }), wrong: true }] : [])];
}

/** The layer posed at one stop of a guide's rep (a static picture: renders, Pictures, the setup moment): each moving
 * group's transform written inline for the stop nearest u, as the keyframes would draw it there. */
export function posedLayer(g: ExerciseGuide, rig: Rig, art: MachineArt, figure: Figure, rep: number, u: number, kg: number): string {
  const stops = guideStops(g, figure)(rep), i = stops.reduce((b, v, k) => (Math.abs(v - u) < Math.abs(stops[b]! - u) ? k : b), 0);
  const xf = new Map(opsAt(art, guideDrive(g, rig, figure)(rep, i, stops[i]!)).map(([cls, ops]) => [cls, css(ops)]));
  return layerMarkup(art, { kg, settings: g.machine?.settings })
    .replace(/<g class="fg-mp ([\w-]+)"( style="[^"]*")?>/g, (all, cls: string) => (xf.has(cls) ? `<g class="fg-mp ${cls}" style="transform:${xf.get(cls)}">` : all));
}
