// FG-6: the side figure's stills for the tests and the screenshot gate (scripts/screenshot-gate.mjs, block FG-6): the bench
// press (supine on the FG-5 bench, bar locked out and on the chest) and the back squat (bar on the traps, top and
// bottom), plus the rest poses both facings and prone. Each still is framed by the standing camera (VIEWBOXES
// standingFront) and painted from one theme's tokens. Test and gate only; nothing here ships.
import { THEMES, themeToCss, type ThemeId } from '@/theme/themes';
import { VIEWBOXES } from '@/formguide/model';
import type { Pose } from '@/formguide/rig/joints';
import { FLOOR } from '@/formguide/rig/figureFront';
import { figureSide } from '@/formguide/rig/figureSide';
import { themeReader } from '@/formguide/rig/paint';
import { sideFrame, sideHandAt, sidePoint, solveSideArm, css, type Frame, type SideFrameOptions, type SidePoseId } from '@/formguide/rig/pose';
import { barbell, bench, partDefs, place, PART_GRAD } from '@/formguide/parts';
import { mm } from '@/formguide/parts/kit';

export type Still = { name: string; id: SidePoseId; pose: Pose; o: SideFrameOptions; frame: Frame; parts: string[]; /** where the hands were solved to */ aim?: [number, number] };

const both = (b: string, v: number): Pose => ({ [`${b}_l`]: v, [`${b}_r`]: v }) as Pose;
const BENCH_TOP = FLOOR - mm(440);

/** Knee bend (and the ankle that keeps the sole flat) that puts a supine figure's near foot on the floor. */
function feetDown(pose: Pose, o: SideFrameOptions): Pose {
  let lo = 0, hi = 100;
  const at = (k: number) => { const hf = pose.hip_flex_r ?? 0, p = { ...pose, ...both('knee_flex', k), ...both('ankle_flex', -90 - hf + k) }; return { p, y: sidePoint(sideFrame('lying_supine', p, o), o.mirror ? 'foot_l' : 'foot_r', o.mirror)[1] }; };
  for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (at(m).y < FLOOR) lo = m; else hi = m; }
  return at(hi).p;
}

function benchStill(name: string, lockout: boolean, mirror = false): Still {
  const o = { mirror, surface: BENCH_TOP }, near = mirror ? 'l' : 'r';
  let pose: Pose = feetDown({ breath: 0.5, ...both('hip_flex', -20) }, o);
  // the bar over the shoulder joint at lockout, touching the lower chest at the bottom
  const f0 = sideFrame('lying_supine', pose, o), chest = sidePoint(f0, near === 'r' ? 'shoulder_r' : 'shoulder_l', mirror);
  const sh = sideHandAt(sideFrame('lying_supine', { ...pose, ...both('shoulder_flex', 90) }, o), near, mirror);
  const bar: [number, number] = lockout ? [sh[0], sh[1]] : [chest[0] + (mirror ? -1 : 1) * 38, BENCH_TOP - 88];
  const arm = solveSideArm('lying_supine', pose, near, bar, o);
  pose = { ...pose, ...both('shoulder_flex', arm.shoulder_flex), ...both('elbow_flex', arm.elbow_flex) };
  const f = sideFrame('lying_supine', pose, o), hand = sideHandAt(f, near, mirror), back = sidePoint(f, 'back', mirror);
  const b = bench({ g: PART_GRAD }), hinge = back[0] + (mirror ? -1 : 1) * mm(450);
  const benchSvg = mirror ? `<g transform="matrix(-1 0 0 1 ${2 * hinge} 0)">${place(b, [hinge, FLOOR]).svg}</g>` : place(b, [hinge, FLOOR]).svg;
  return { name, id: 'lying_supine', pose, o, frame: f, aim: bar, parts: [benchSvg, place(barbell({ g: PART_GRAD, kg: 60, view: 'side' }), hand).svg] };
}

/** The middle of the foot (the shoe runs from x 184 to 264 at rest): a balanced squat keeps the bar over it. */
export const MID_FOOT = 224;
/** Bisection of a channel so the bar on the traps sits over the mid-foot. */
function overMidFoot(pose: Pose, set: (v: number) => Pose, lo: number, hi: number): Pose {
  const x = (v: number) => sidePoint(sideFrame('standing', { ...pose, ...set(v) }), 'shoulder_r')[0];
  const up = x(hi) > x(lo);
  for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; if ((x(m) < MID_FOOT) === up) lo = m; else hi = m; }
  return { ...pose, ...set((lo + hi) / 2) };
}

function squatStill(name: string, bottom: boolean): Still {
  const o = {};
  // the top leans the whole body forward at the ankle, the bottom leans the trunk, until the bar is over the mid-foot
  let pose: Pose = bottom
    ? overMidFoot({ breath: 0.5, ...both('hip_flex', 120), ...both('knee_flex', 120), ...both('ankle_flex', 38) }, v => ({ torso_lean: v }), -70, 0)
    : overMidFoot({ breath: 0.5 }, v => both('ankle_flex', v), 0, 15);
  const bar = sidePoint(sideFrame('standing', pose, o), 'shoulder_r');
  const arm = solveSideArm('standing', pose, 'r', bar, { ...o, turnedOut: true });
  pose = { ...pose, ...both('shoulder_flex', arm.shoulder_flex), ...both('elbow_flex', arm.elbow_flex) };
  const f = sideFrame('standing', pose, o);
  return { name, id: 'standing', pose, o, frame: f, aim: bar, parts: [place(barbell({ g: PART_GRAD, kg: 100, view: 'side' }), sidePoint(f, 'shoulder_r')).svg] };
}

const rest = (name: string, id: SidePoseId, o: SideFrameOptions = {}): Still => ({ name, id, pose: {}, o, frame: sideFrame(id, {}, o), parts: [] });

export const STILLS: (() => Still)[] = [
  () => benchStill('bench press, lockout', true),
  () => benchStill('bench press, bar on the chest', false),
  () => squatStill('back squat, top', false),
  () => squatStill('back squat, bottom', true),
  () => rest('standing, facing right', 'standing'),
  () => rest('standing, facing left (mirror)', 'standing', { mirror: true }),
  () => benchStill('bench press, facing left (mirror)', false, true),
  () => rest('prone', 'lying_prone'),
];

/** The figure in a still: its markup with the frame written as the player writes it (inline style transforms). */
export function posed(svg: string, f: Frame): string {
  return svg.replace(/<g class="(fg-[jp]) ([\w-]+)" style="([^"]*)"/g, (m, kind: string, cls: string, style: string) => {
    const key = kind === 'fg-j' ? cls.replace(/^j-/, '') : cls.replace(/^fg-/, ''), xf = f[key];
    return xf?.ops ? `<g class="${kind} ${cls}" style="${style};transform:${css(xf.ops)}"` : m;
  });
}

export function stillMarkup(theme: ThemeId, s: Still, id = 'fs'): string {
  return posed(figureSide(themeReader(theme), { id, mirror: s.o.mirror }), s.frame);
}

export function sideGalleryHtml(theme: ThemeId): string {
  const vb = VIEWBOXES.standingFront.join(' '), defs = partDefs(themeReader(theme));
  const cards = STILLS.map((make, i) => {
    const s = make();
    return `<figure class="card" data-still="${s.name}"><svg viewBox="${vb}" role="img" aria-label="${s.name}">${defs}${s.parts[0] ?? ''}${stillMarkup(theme, s, `fs${i}`)}${s.parts.slice(1).join('')}</svg><figcaption>${s.name}</figcaption></figure>`;
  });
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${themeToCss(THEMES[theme])}body{margin:0;padding:16px;background:var(--bg);color:var(--text);font:13px Inter,system-ui,sans-serif}
.grid{display:grid;grid-template-columns:minmax(0,1fr);gap:10px}.card{margin:0;padding:8px;border:1px solid var(--border);border-radius:10px;background:var(--surface-1)}
.card svg{display:block;width:100%;aspect-ratio:${VIEWBOXES.standingFront[2]}/${VIEWBOXES.standingFront[3]};overflow:hidden}figcaption{margin-top:4px;color:var(--text-2);font-size:11px}</style></head>
<body><h1 style="font-size:16px;margin:0 0 10px">FG-6 side figure, ${theme}</h1><div class="grid">${cards.join('')}</div></body></html>`;
}
