// Machine Chest Press stage: the markup of rig-final/gen.mjs chestPress() with the anim-machine-chest-press/build.mjs
// patches (seat overlay path, stack-top, Path caption), at DEMO_COMMIT. Stage.css keeps the exercise's static rules in the
// player's root-class form (build.mjs step 1): origins, zoom cameras and overlay visibility.
import type { Sample, Stage } from '../rig/api';
import { n2, pts, rad } from '../rig/math';
import { SIDE } from '../rig/parts';
import { armLayer, cores, layer, muscleTable, passer, resetClip, shadow, type Cores, type Pass, type Role } from '../rig/paint';
import { chestPress, CP_SPEC } from '../moves/machineChestPress';
import { buildStage, originRule } from './common';

export const CP_MUSCLES = [
  { region: 'chest', id: 'chest', common: 'Chest', anatomical: 'pectoralis major', role: 'main' as Role, line: 'Pushes the handles away; hardest as the arms straighten.' },
  { region: 'frontDelts', id: 'frontDelts', common: 'Front delts', anatomical: 'anterior deltoid', role: 'help' as Role, line: 'Lifts the upper arms forward with the chest.' },
  { region: 'triceps', id: 'triceps', common: 'Triceps', anatomical: 'triceps brachii', role: 'help' as Role, line: 'Straightens the elbows at the end of the press.' },
];

export function chestPressStage(sample: Sample): Stage {
  resetClip();
  const { o, pose, a0, a1 } = chestPress;
  const { H, P, R, HALF } = o;
  const roles: Record<string, Role> = { chest: 'main', frontDelts: 'help', triceps: 'help' };
  const muscles = muscleTable(CP_MUSCLES, roles, 'chest press');
  const FAR = [5, -3];
  const leg = (pass: Pass, far?: boolean) => {
    const Pp = passer(pass, roles, { far });
    return `<g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)">${Pp(SIDE.hipCap)}${Pp(SIDE.thigh)}<g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)">${Pp(SIDE.kneeCap)}${Pp(SIDE.shin)}${Pp(SIDE.foot)}</g></g>`;
  };
  const CORES: Cores = {};   // stroke-less hotspot cores per joint chain, painted after every halo (see fillPart)
  const bodyLayer = (pass: Pass) => { const Pp = passer(pass, roles, { effort: 'cp-eff', glow: 'cp-ten', ten: 'cp-ten', tap: muscles, cores: CORES, coreKey: 'body' }); return `${Pp(SIDE.neck)}${Pp(SIDE.torso)}${Pp(SIDE.head)}${leg(pass)}`; };
  const upper = (pass: Pass) => `<g class="j anim cp-ul">${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ul' })(SIDE.upperArm)}</g>${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ua' })(SIDE.deltoid)}`;
  const lower = (pass: Pass) => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim cp-fl">${Pp(SIDE.forearm)}</g><g class="j anim cp-hd">${Pp(SIDE.fist)}${pass === 'fill' ? `<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const armBody = armLayer(upper, lower, m => `<g class="j anim cp-fa">${m}</g>`);
  const arm = `<g class="j anim cp-ua arm-near">${armBody}</g>`;
  // hotspot cores in drawing order, after every halo: the torso's, then the arm's in a repeated arm chain (same keyframes)
  const armCores = `<g class="j anim cp-ua"><g class="j anim cp-ul">${cores(CORES, 'ul')}</g>${cores(CORES, 'ua')}</g>`;
  const leverG = (far: boolean) => `<g class="j anim cp-lever${far ? ' far-lever' : ' lever-near'}"><polygon class="${far ? 'eqf' : 'eqm'}" points="${pts([[P[0] - 2.6, P[1]], [P[0] + 2.6, P[1]], [P[0] + 2.6, P[1] + R - HALF + 1], [P[0] - 2.6, P[1] + R - HALF + 1]])}"/><rect class="${far ? 'hdf' : 'hd'}" x="${n2(P[0] - 3.2)}" y="${n2(P[1] + R - HALF)}" width="6.4" height="${far ? HALF + 8 : 2 * HALF}" rx="3"/>${far ? '' : `<path class="knurl" d="${[-11, -9.6, -8.2, 8.2, 9.6, 11].map(d => `M${n2(P[0] - 3.2)} ${n2(P[1] + R + d)}h6.4`).join('')}"/>`}</g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="26" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 6) moving += r; else still += r;
  }
  const bevel = (i0: number, i1: number) => `<path class="eqh" d="${Array.from({ length: i1 - i0 }, (_, k) => `M27.2 ${n2(113.6 + (i0 + k) * 13.5)}h45.6v1.2h-45.6z`).join('')}"/>`;
  moving += bevel(0, 6); still += bevel(6, 10);
  moving += `<rect class="pin" x="73" y="${n2(112.5 + 5 * 13.5 + 4)}" width="9" height="4" rx="2"/><circle class="pin" cx="82.6" cy="${n2(112.5 + 5 * 13.5 + 6)}" r="2.6"/>`;   // selector pin in plate 6 (accent), with its knob
  moving += `<rect class="eqm stack-top" x="45" y="106" width="10" height="6.5" rx="1"/>`;                     // top bracket the cable pulls
  const RT = R + HALF;                                                  // trail radius: the handle's bottom tip
  const tip = (al: number): [number, number] => [P[0] - RT * Math.sin(rad(al)), P[1] + RT * Math.cos(rad(al))];
  const trailPts = Array.from({ length: 33 }, (_, i) => tip(a0 + (a1 - a0) * i / 32));
  const trailD = 'M' + trailPts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const bodyMarkup = layer(bodyLayer);   // built first (with `arm` below): the layers collect the hotspot cores
  if (muscles.some(m => !m.cls)) throw new Error('cp: a muscle in the table has no drawn region with a role');
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(208, 258, 17, 2.6)}
<g class="machine-back"><rect class="eq" x="20" y="250" width="162" height="8" rx="1.5"/><line class="rod" x1="32" y1="56" x2="32" y2="250"/><line class="rod" x1="68" y1="56" x2="68" y2="250"/>${still}<g class="j anim cp-stack">${moving}</g><rect class="eq" x="88" y="52" width="12" height="198" rx="1.5"/><rect class="eq" x="22" y="44" width="192" height="10" rx="2"/><line class="cable j anim cp-cable stack-top" x1="50" y1="61" x2="50" y2="106"/><circle class="eqm" cx="55" cy="61" r="5.2"/><circle class="prim" cx="55" cy="61" r="3.2"/><circle class="hd" cx="55" cy="61" r="1.2"/><line class="cable" x1="55" y1="55.8" x2="${n2(P[0] - 6)}" y2="55.8"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})">${leverG(true)}<g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
<g class="machine-front"><rect class="eq" x="150" y="222" width="9" height="28"/><rect class="eq" x="100" y="168" width="26" height="8"/><rect class="eq" x="124.5" y="108" width="13" height="104" rx="4"/><rect class="eq" x="118" y="214" width="82" height="10" rx="4"/><rect class="seam" x="126.6" y="110.2" width="8.8" height="99.6" rx="2.6"/><rect class="seam" x="120.2" y="216.2" width="77.6" height="5.6" rx="2.2"/></g>
${shadow(166, 214.4, 34, 2.2)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">${bodyMarkup}</g>
${leverG(false)}<circle class="eqm" cx="${P[0]}" cy="${P[1]}" r="7"/><circle class="prim" cx="${P[0]}" cy="${P[1]}" r="4.6"/><circle class="rod" cx="${P[0]}" cy="${P[1]}" r="2"/>
<path class="guide" d="${trailD}"/><path class="trail j anim cp-trail" d="${trailD}" pathLength="1"/>
<g class="figure-arm" transform="translate(${H[0]} ${H[1]})">${arm}</g>
<g class="figure-hot" transform="translate(${H[0]} ${H[1]})">${cores(CORES, 'body')}${armCores}</g>
<path class="ov ov-seat ovs" d="M191 212H121A5 5 0 0 0 116 217V221A5 5 0 0 0 121 226H191"/>`;
  const mid = pose(0.5);
  const tipMid = tip(mid.alpha);
  const css = [
    originRule('cp-ua', 0, -62), originRule('cp-ul', 0, -62), originRule('cp-fa', 0, -24), originRule('cp-fl', 0, -24),
    originRule('cp-lever', P[0], P[1]), originRule('cp-cable', 50, 61),
    '.zoom-1 .cam{transform:translate(179px,138px) scale(2) translate(-206px,-157px)}',
    '.zoom-2 .cam{transform:translate(179px,138px) scale(1.6) translate(-204px,-160px)}',
    '.zoom-3 .cam{transform:translate(179px,138px) scale(1.7) translate(-150px,-190px)}',
    '.zoom-1 .ov-grip,.zoom-3 .ov-seat{opacity:1}',
    '.zoom-1 .far-lever{opacity:0}',
  ].join('\n') + '\n';
  return buildStage({
    id: CP_SPEC.id, scene, css, tileBox: [96, 104, 160, 158], pics: CP_SPEC.pics, picsAt: CP_SPEC.picsAt,
    arrows: [null, { from: [tipMid[0] - 12, tipMid[1] + 9], to: [tipMid[0] + 14, tipMid[1] + 9] }, null, { from: [tipMid[0] + 14, tipMid[1] + 9], to: [tipMid[0] - 12, tipMid[1] + 9] }],
  }, sample);
}
