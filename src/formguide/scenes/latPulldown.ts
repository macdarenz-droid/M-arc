// Lat Pulldown stage: the markup of anim-lat-pulldown/gen.mjs latPulldown() and gripInset() at DEMO_COMMIT, on the one
// rig (its exercise-local lats shape goes on a copy of SIDE.torso; the rig's parts are never changed). Stage.css keeps
// every rule of the exercise css except the animation-name rules and the @keyframes (R1-10).
import type { Sample, Stage } from '../rig/api';
import { deg, dot, n2, n3, pts, sub, tr } from '../rig/math';
import { FR, SIDE, mirPart, type Part, type Region } from '../rig/parts';
import { armLayer, cores, fillPart, layer, muscleTable, olPart, passer, resetClip, shadow, type Cores, type FlareRegion, type Pass, type Role } from '../rig/paint';
import { BAR_BEND, BAR_DROP, BAR_HALF, BAR_MID, BAR_PTS, FAR_GRIP, HAND_HALF, LP_SPEC, NEAR_Z, SHOULDER_OUT, SHOULDER_OUTSIDE, barPt, latPulldownRig } from '../moves/latPulldown';
import { arrowSvg, buildStage, originRule } from './common';

export const LP_MUSCLES = [
  { region: 'lats', id: 'lats', common: 'Lats', anatomical: 'latissimus dorsi', role: 'main' as Role, line: 'Pulls the elbows down and back; hardest at the bottom.' },
  { region: 'biceps', id: 'biceps', common: 'Biceps', anatomical: 'biceps brachii', role: 'help' as Role, line: 'Bends the elbows as the bar comes down.' },
  { region: 'midBack', id: 'midBack', common: 'Mid back', anatomical: 'rhomboids and middle trapezius', role: 'help' as Role, line: 'Squeezes the shoulder blades together.' },
];

// Exercise-local side-view lats (D-L9): the core, the contracted lower lat (ten) and the flare, in place of the rig's region.
const LP_TORSO: Part = {
  ...SIDE.torso,
  regions: [
    ...(SIDE.torso.regions || []).filter(r => r.muscle !== 'lats'),
    { poly: [[-12.3, -52], [-5.4, -54.6], [-2.6, -42], [-3.1, -40], [-11.9, -40]], tone: 'lo', muscle: 'lats' },
    { poly: [[-11.9, -40], [-3.1, -40], [-4.4, -30], [-3.6, -22], [-4.4, -12], [-5, -9.2], [-11.77, -9.2], [-10.8, -15], [-10, -26]], tone: 'lo', muscle: 'lats', ten: true },
    { flare: true, outer: [[-12.3, -52], [-16, -48], [-18.4, -42], [-19, -36], [-17.6, -29], [-14.6, -21], [-10.8, -15]], poly: [[-12.3, -52], [-16, -48], [-18.4, -42], [-19, -36], [-17.6, -29], [-14.6, -21], [-10.8, -15], [-6, -16], [-6, -51]], origin: [-6, -33], muscle: 'lats' } as FlareRegion as Region,
  ],
};
// the rig's side hand mirrored: thumb and index finger on the inside of the grip (toward the far hand)
const LP_FIST = mirPart(SIDE.fist);

/** the Grip chip's front-view inset (QA r2 issue 3): both hands on the bar at the top of the rep */
export function gripInset() {
  const LP = latPulldownRig.L;
  const a = LP.pose(0), up = (v: number[]) => -dot(v, LP.TD);
  const eU = sub(a.E, a.S), gU = sub(a.G, a.S);
  const elbow = [SHOULDER_OUT + eU[2]!, -62 - up(eU)], grip = [SHOULDER_OUT + gU[2]!, -62 - up(gU)];
  const uaA = deg(Math.atan2(elbow[0]! - SHOULDER_OUT, -(elbow[1]! + 62)));
  const faA = deg(Math.atan2(grip[0]! - elbow[0]!, -(grip[1]! - elbow[1]!)));
  const L = Math.hypot(elbow[0]! - SHOULDER_OUT, elbow[1]! + 62), F = Math.hypot(grip[0]! - elbow[0]!, grip[1]! - elbow[1]!);
  const fu = L / 38, ff = F / 40;
  const ang = -(180 - uaA), rel = faA - uaA;
  const gy = grip[1]!, gxR = grip[0]!;
  const barY = gy, bar = [[-BAR_HALF, barY + BAR_DROP], [-BAR_BEND, barY], [BAR_BEND, barY], [BAR_HALF, barY + BAR_DROP]];
  const P = (pass: Pass) => passer(pass, {});
  const arm = (pass: Pass, side: 'R' | 'L') => {
    const s = side === 'R' ? 1 : -1, pp = P(pass);
    const part = (k: 'upperArm' | 'deltoid' | 'elbowCap' | 'forearm' | 'fist') => (side === 'R' ? FR[`${k}R`] : mirPart(FR[`${k}R`]));
    const thumb = pass === 'fill' ? `<polygon class="lp-thumb" points="${pts([[s * 23.5, 12], [s * 27.6, 12.5], [s * 28, 17], [s * 26.2, 21.5], [s * 23.5, 20.5]])}"/>` : '';
    return `<g class="j" style="transform-origin:${s * 22}px -62px;transform:rotate(${n2(s * ang)}deg)"><g class="j" style="transform-origin:${s * 22}px -62px;transform:scaleY(${n3(fu)})">${pp(part('upperArm'))}</g>${pp(part('deltoid'))}<g class="j" style="transform-origin:${s * 22}px -24px;transform:translateY(${n2(-(1 - fu) * 38)}px) rotate(${n2(s * rel)}deg)">${pp(part('elbowCap'))}<g class="j" style="transform-origin:${s * 22}px -24px;transform:scaleY(${n3(ff)})">${pp(part('forearm'))}</g><g style="transform:translateY(${n2(-(1 - ff) * 40)}px)">${pp(part('fist'))}${thumb}</g></g></g>`;
  };
  const body = (pass: Pass) => { const pp = P(pass); return `${pp(FR.neck)}${pp(FR.torso)}${pp(FR.head)}`; };
  const vb = [-80, gy - 11, 160, -52 - (gy - 11)];
  const svg = `<svg class="inset-fig" viewBox="${vb.map(n2).join(' ')}" aria-hidden="true">${layer(body)}<path class="lp-barline" d="M${bar.map(p => `${n2(p[0]!)} ${n2(p[1]!)}`).join('L')}"/>${[-1, 1].map(sg => `<path class="lp-grip" d="M${[50, 56, 62, 68, 73].map(x => `${n2(sg * x)} ${n2(barY + BAR_DROP * (x - BAR_BEND) / (BAR_HALF - BAR_BEND))}`).join('L')}"/>`).join('')}${layer(q => arm(q, 'L'))}${layer(q => arm(q, 'R'))}</svg>`;
  return { svg, grip: [gxR, gy], elbow, uaA, faA, fu, ff, handsApart: 2 * gxR, shouldersOutside: 2 * SHOULDER_OUTSIDE, vb };
}

/** the inset markup the player shows in the Grip close-up (a div over the stage, outside the stage svg) */
export const lpInsetHtml = (): string => `<div class="inset"><span class="inset-label">Front view</span>${gripInset().svg}</div>`;

export function latPulldownStage(sample: Sample): Stage {
  resetClip();
  const R = latPulldownRig, LP = R.L;
  const { H, LEAN, Y1, PF, FS0, BEAM, REAR_TOP } = { ...R, Y1: LP.Y1 };
  const FAR_SPLIT = -(NEAR_Z - HAND_HALF + 1);
  const barLocalD = `M${[BAR_PTS[0]!, BAR_PTS[1]!, barPt(FAR_SPLIT)].map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const nearEndD = `M${[barPt(NEAR_Z + HAND_HALF), BAR_PTS[1]!, BAR_PTS[0]!].map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const roles: Record<string, Role> = { lats: 'main', biceps: 'help', midBack: 'help' };
  const muscles = muscleTable(LP_MUSCLES, roles, 'lat pulldown');
  const FAR = [5, -3];
  const Z1 = { cx: 163, cy: 119, s: 1.55 }, Z2 = { cx: 150, cy: 112, s: 1.4 }, Z3 = { cx: 197, cy: 227, s: 1.9 };
  const camT = (z: { cx: number; cy: number; s: number }) => `transform:translate(179px,138px) scale(${z.s}) translate(${n2(-z.cx)}px,${n2(-z.cy)}px)`;
  const inset = gripInset();
  const css = `
/* ---- Lat Pulldown (lp): joints, machine, bar, far hand, cable, "still to go" line, effort ---- */
.lp-torso{transform-origin:0px 0px;transform:rotate(-${LEAN}deg)}
${[originRule('lp-ua', 0, -62), originRule('lp-ul', 0, -62), originRule('lp-fa', 0, -24), originRule('lp-fl', 0, -24), originRule('lp-bar', 0, 16),
    originRule('lp-fua', FS0[0]!, FS0[1]!), originRule('lp-ful', FS0[0]!, FS0[1]!), originRule('lp-ffa', FS0[0]!, FS0[1]! + 38), originRule('lp-ffl', FS0[0]!, FS0[1]! + 38),
    originRule('lp-cable-f', PF.x, PF.y + PF.r), originRule('lp-cable-r', 40, REAR_TOP), originRule('lp-fbar', FS0[0]!, FS0[1]! + 78)].join('\n')}
.lp-barline{fill:none;stroke:var(--fg-metal);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.lp-grip{fill:none;stroke:var(--metal-lo);stroke-width:4;stroke-dasharray:.8 1.1;pointer-events:none}
.lp-barfar{fill:none;stroke:var(--fg-metal);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.far-arm{--body-far-hi:color-mix(in srgb,var(--body-far) var(--hi),var(--lit));--body-far-lo:color-mix(in srgb,var(--body-far) var(--lo),var(--shd))}
.bfh{fill:var(--body-far-hi)}.bfl{fill:var(--body-far-lo)}
.far-arm .olkf{stroke:color-mix(in srgb,var(--fg-line-far) 75%,var(--surface-1))}
.lp-togo-over{opacity:.35}
.zoom-1 .lp-togo-over,.zoom-2 .lp-togo-over{opacity:0}
.lp-hook{fill:var(--fg-metal)}
.lp-target{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round}
.inset{position:absolute;top:10px;right:10px;width:128px;box-sizing:border-box;display:none;flex-direction:column;gap:2px;padding:6px 7px 5px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md)}
.inset-label{font-size:11px;line-height:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2)}
.inset-fig{display:block;width:112px;height:${n2(112 * inset.vb[3]! / inset.vb[2]!)}px;--sw:.8}
.lp-thumb{fill:var(--accent)}
.zoom-1 .inset{display:flex}
.guide,.trail,.lp-target{transition:opacity 150ms linear}
.zoom-1 .guide,.zoom-1 .trail,.zoom-1 .lp-target{opacity:0}
.lp-over{opacity:0}
.zoom-2 .lp-over{opacity:1}
.zoom-1 .cam{${camT(Z1)}}
.zoom-2 .cam{${camT(Z2)}}
.zoom-3 .cam{${camT(Z3)}}
.zoom-1 .ov-grip,.zoom-3 .ov-pad{opacity:1}
.lp-stackset{transition:opacity 150ms linear}
.zoom-1 .lp-stackset,.zoom-2 .lp-stackset{opacity:0}
.pill-accent{background:linear-gradient(var(--accent-soft),var(--accent-soft)),var(--surface-2)}
.zoom-1 .pill-row,.zoom-2 .pill-row,.zoom-3 .pill-row,.zoom-1 .cam-label,.zoom-2 .cam-label,.zoom-3 .cam-label,.pictures .pill-row,.pictures .cam-label{display:none}
@media (prefers-reduced-motion: reduce){.lp-stackset{transition:none!important}}
`;
  // --- markup (two passes per body layer, rig section 5) ---
  const leg = (pass: Pass, far?: boolean) => {
    const Pp = passer(pass, roles, { far });
    return `<g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)">${Pp(SIDE.hipCap)}${Pp(SIDE.thigh)}<g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)">${Pp(SIDE.kneeCap)}${Pp(SIDE.shin)}${Pp(SIDE.foot)}</g></g>`;
  };
  const CORES: Cores = {};   // stroke-less hotspot cores per joint chain, painted after every halo (see fillPart)
  const bodyLayer = (pass: Pass) => { const Pp = passer(pass, roles, { effort: 'lp-eff', glow: 'lp-ten', ten: 'lp-ten', flare: 'lp-flare', tenOver: true, tap: muscles, cores: CORES, coreKey: 'body' }); return `<g class="j lp-torso">${Pp(SIDE.neck)}${Pp(LP_TORSO)}<g class="lp-head">${Pp(SIDE.head)}</g></g>${leg(pass)}`; };
  const upper = (pass: Pass) => `<g class="j anim lp-ul">${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ul' })(SIDE.upperArm)}</g>${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ua' })(SIDE.deltoid)}`;
  // the lat bar is held equipment, so it lives INSIDE the near hand group and counter-rotates (lp-bar)
  const gripD = (sgn: number) => `M${[50, 56, 62, 68, 73].map(z => barPt(sgn * z)).map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const barGroup = `<g class="j anim lp-bar"><path class="lp-barline" d="${barLocalD}"/><circle class="lp-hook" cx="${n2(BAR_MID[0])}" cy="${n2(16 + BAR_MID[1])}" r="2.4"/></g>`;
  const barNear = `<g class="j anim lp-bar lp-bar-near"><path class="lp-barline" d="${nearEndD}"/><path class="lp-grip" d="${gripD(1)}"/></g>`;
  const lower = (pass: Pass) => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim lp-fl">${Pp(SIDE.forearm)}</g><g class="j anim lp-hd">${pass === 'fill' ? barGroup : ''}${Pp(LP_FIST)}${pass === 'fill' ? `${barNear}<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const arm = `<g class="j lp-torso"><g class="j anim lp-ua arm-near">${armLayer(upper, lower, m => `<g class="j anim lp-fa">${m}</g>`)}</g></g>`;
  // far arm: the same arm seen on the far side, placed with the rig's depth view, in the far tones
  const fpart = (part: Part): Part => ({ ...part, base: tr(part.base, FS0[0]!, FS0[1]! + 62), regions: (part.regions || []).map(r => ({ ...r, poly: tr(r.poly, FS0[0]!, FS0[1]! + 62) })) });
  const FP = (pass: Pass) => (part: Part) => (pass === 'ol' ? olPart(fpart(part), true) : pass === 'rim' ? '' : fillPart(fpart(part), {}, { far: true, facets: true }));
  const farUpper = (pass: Pass) => `<g class="j anim lp-ful">${FP(pass)(SIDE.upperArm)}</g>${FP(pass)(SIDE.deltoid)}`;
  const FG = [FS0[0]! + 0, FS0[1]! + 78], rel = (z: number) => { const q = barPt(z); return `${n2(FG[0]! + q[0] - FAR_GRIP[0])} ${n2(FG[1]! + q[1] - FAR_GRIP[1])}`; };
  const farBarD = 'M' + [FAR_SPLIT + 2, -BAR_BEND, -BAR_HALF].map(rel).join('L'), farGripD = 'M' + [50, 56, 62, 68, 73].map(z => rel(-z)).join('L');
  const farBar = `<g class="j anim lp-fbh"><g class="j anim lp-fbar"><path class="lp-barfar" d="${farBarD}"/><path class="lp-grip" d="${farGripD}"/></g></g>`;
  const farLower = (pass: Pass) => `${pass === 'fill' ? farBar : ''}${FP(pass)(SIDE.elbowCap)}<g class="j anim lp-ffl">${FP(pass)(SIDE.forearm)}</g><g class="j anim lp-fhd">${FP(pass)(SIDE.fist)}</g>`;
  const farArm = `<g class="far-arm"><g class="j anim lp-fua">${armLayer(farUpper, farLower, m => (m ? `<g class="j anim lp-ffa">${m}</g>` : ''))}</g></g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="16" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 7) moving += r; else still += r;
  }
  const bevel = (i0: number, i1: number) => `<path class="eqh" d="${Array.from({ length: i1 - i0 }, (_, k) => `M17.2 ${n2(113.6 + (i0 + k) * 13.5)}h45.6v1.2h-45.6z`).join('')}"/>`;
  moving += bevel(0, 7); still += bevel(7, 10);
  moving += `<rect class="pin lp-pin" x="63" y="${n2(112.5 + 6 * 13.5 + 4)}" width="9" height="4" rx="2"/><circle class="pin" cx="69.8" cy="${n2(112.5 + 6 * 13.5 + 6)}" r="2.4"/>`;   // pin in plate 7 (spec)
  moving += `<rect class="eqm" x="35" y="106" width="10" height="6.5" rx="1"/>`;                        // top bracket the cable pulls
  const pathD = `M${LP.pathPts.map(p => `${n2(p[0]!)} ${n2(p[1]!)}`).join('L')}`;
  const bodyMarkup = layer(bodyLayer);   // built before the scene (with `arm` above): the layers collect the hotspot cores
  if (muscles.some(m => !m.cls)) throw new Error('lat pulldown: a muscle in the table has no drawn region with a role');
  const figureHot = `<g class="figure-hot" transform="translate(${H[0]} ${H[1]})"><g class="j lp-torso">${cores(CORES, 'body')}<g class="j anim lp-ua"><g class="j anim lp-ul">${cores(CORES, 'ul')}</g>${cores(CORES, 'ua')}</g></g></g>`;
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(208, 258, 17, 2.6)}
<g class="machine-back"><rect class="eq" x="16" y="250" width="246" height="8" rx="1.5"/><g class="lp-stackset"><line class="rod" x1="22" y1="${BEAM + 8}" x2="22" y2="250"/><line class="rod" x1="58" y1="${BEAM + 8}" x2="58" y2="250"/>${still}<g class="j anim lp-stack">${moving}</g><line class="cable j anim lp-cable-r" x1="40" y1="${REAR_TOP}" x2="40" y2="106"/></g><rect class="eq" x="72" y="${BEAM}" width="12" height="${250 - BEAM}" rx="1.5"/><rect class="eq" x="16" y="${BEAM}" width="162" height="8" rx="2"/><g class="lp-stackset"><circle class="eqm" cx="47" cy="${REAR_TOP}" r="7"/><circle class="prim" cx="47" cy="${REAR_TOP}" r="4.6"/><circle class="hd" cx="47" cy="${REAR_TOP}" r="1.4"/></g><circle class="eqm" cx="${PF.x}" cy="${PF.y}" r="${PF.r}"/><circle class="prim" cx="${PF.x}" cy="${PF.y}" r="3.2"/><circle class="hd" cx="${PF.x}" cy="${PF.y}" r="1.2"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})"><g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
${farArm}
<g class="machine-front"><rect class="eq" x="150" y="224" width="9" height="26"/><rect class="eq" x="188" y="191" width="8" height="59"/><rect class="eq" x="118" y="214" width="68" height="10" rx="4"/><rect class="seam" x="120.1" y="216.1" width="63.8" height="5.8" rx="2.2"/></g>
${shadow(160, 214.4, 26, 2.2)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">${bodyMarkup}</g>
<rect class="eq" x="180" y="184" width="24" height="14" rx="7"/><rect class="seam" x="182.1" y="186.1" width="19.8" height="9.8" rx="4.9"/><rect class="ov ov-pad ovs" x="178" y="182" width="28" height="18" rx="9"/>
<path class="guide" d="${pathD}"/><path class="trail j anim lp-togo" d="${pathD}" pathLength="1"/><line class="lp-target" x1="${n2(LP.X1 - 5)}" y1="${Y1}" x2="${n2(LP.X1 + 5)}" y2="${Y1}"/>
<g class="j anim lp-cable-f"><line class="cable" x1="${PF.x}" y1="${PF.y + PF.r}" x2="${PF.x}" y2="${PF.y + PF.r + 1}"/></g>
<g class="figure-arm" transform="translate(${H[0]} ${H[1]})">${arm}</g>
<g class="lp-togo-over"><path class="trail j anim lp-togo" d="${pathD}" pathLength="1"/></g>
<g class="lp-over"><path class="guide" d="${pathD}"/><path class="trail j anim lp-togo" d="${pathD}" pathLength="1"/><line class="lp-target" x1="${n2(LP.X1 - 5)}" y1="${Y1}" x2="${n2(LP.X1 + 5)}" y2="${Y1}"/></g>
${figureHot}`;
  const staticOverlays = `<g class="ov ov-pad">${arrowSvg({ from: [192, 162], to: [192, 179] })}</g>`;
  const down = { from: [210, 96], to: [210, 128] };
  return buildStage({
    id: LP_SPEC.id, scene, staticOverlays, css, tileBox: [58, 32, 204, 230], pics: LP_SPEC.pics, picsAt: LP_SPEC.picsAt,
    arrows: [null, down, null, { from: down.to, to: down.from }],
  }, sample);
}
