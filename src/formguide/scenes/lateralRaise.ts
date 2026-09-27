// Dumbbell Lateral Raise stage: the markup of rig-final/gen.mjs lateralRaise() at DEMO_COMMIT. Stage.css keeps the
// exercise's static rules in the player's root-class form (anim-dumbbell-lateral-raise/build.mjs step 1).
import type { Sample, Stage } from '../rig/api';
import { hexv, mir, n2, norm, origin, pts, sub, type Pt } from '../rig/math';
import { FR, mirPart, type Part } from '../rig/parts';
import { armLayer, cores, layer, muscleTable, passer, resetClip, shadow, type Cores, type Pass, type Role } from '../rig/paint';
import { lateralRaise, LR_SPEC } from '../moves/dumbbellLateralRaise';
import { arrowSvg, buildStage, originRule } from './common';

export const LR_MUSCLES = [
  { region: 'sideDelts', id: 'sideDelts', common: 'Side delts', anatomical: 'lateral deltoid', role: 'main' as Role, line: 'Lifts the arms out to the sides; hardest near shoulder height.' },
  { region: 'upperTraps', id: 'upperTraps', common: 'Upper traps', anatomical: 'upper trapezius', role: 'help' as Role, line: 'Steadies the shoulder blades; keep them down, no shrug.' },
];

export function lateralRaiseStage(sample: Sample): Stage {
  resetClip();
  const { o, grip } = lateralRaise;
  const { H, BEND, DROP } = o;
  const roles: Record<string, Role> = { sideDelts: 'main', upperTraps: 'help' };
  const muscles = muscleTable(LR_MUSCLES, roles, 'lateral raise');
  // Hex dumbbell seen end-on from the front and a little above, counter-rotated to stay level; centred on x = the grip.
  const dumbbell = (gx: number, gy: number) => {
    const c = [gx, gy + 12.5] as const, r = 6.6, sy = 0.92, h = 2.2, v = hexv(c[0], c[1], r, sy), up = (q: Pt): Pt => [q[0], q[1] - h];
    const band = [v[3]!, v[4]!, v[5]!, v[0]!, up(v[0]!), up(v[5]!), up(v[4]!), up(v[3]!)];
    const face = (a: Pt, b: Pt, cls: string) => `<polygon class="${cls}" points="${pts([a, b, up(b), up(a)])}"/>`;
    const handle = `<rect class="hd" x="${n2(gx - 1.8)}" y="${n2(gy + 1.6)}" width="3.6" height="3.6"/>`;
    const ring = `<polygon class="bh" points="${pts([[gx - 3.4, gy + 1.2], [gx + 3.4, gy + 1.2], [gx + 3.9, gy + 2.5], [gx + 3.3, gy + 4], [gx - 3.3, gy + 4], [gx - 3.9, gy + 2.5]])}"/><polygon class="bl" points="${pts([[gx - 3.3, gy + 4], [gx + 3.3, gy + 4], [gx + 3, gy + 4.8], [gx - 3, gy + 4.8]])}"/>`;
    return `${handle}${ring}<polygon class="eqm" points="${pts(band)}"/>${face(v[3]!, v[4]!, 'eqs')}${face(v[4]!, v[5]!, 'eqh')}${face(v[5]!, v[0]!, 'eql')}<polygon class="eqm" points="${pts(v)}"/><polygon class="prim" points="${pts(hexv(c[0], c[1], 3.8, sy))}"/>`;
  };
  const CORES: Cores = {};   // stroke-less hotspot cores per joint chain, painted after every halo (see fillPart)
  const side = (s: 'r' | 'l') => {
    const M = s === 'r' ? ((p: Part) => p) : mirPart, g = s === 'r' ? 22 : -22;
    const up = (pass: Pass) => { const Pp = passer(pass, roles, { effort: 'lr-eff', glow: 'lr-ten', tap: muscles, cores: CORES, coreKey: 'ua-' + s }); return `${Pp(M(FR.upperArmR))}${Pp(M(FR.deltoidR))}`; };
    const lo = (pass: Pass) => { const Pp = passer(pass, roles); return `${Pp(M(FR.elbowCapR))}${Pp(M(FR.forearmR))}${Pp(M(FR.fistR))}`; };
    return `<g class="j anim lr-ua-${s} arm-${s}">${armLayer(up, lo, (m, pass) => `<g class="j lr-fa-${s}">${m}${pass === 'fill' ? `<circle class="ov ov-elbows ovs" cx="${g}" cy="-24" r="8"/><g class="j anim lr-db-${s}">${dumbbell(g, 16)}</g>` : ''}</g>`)}</g>`;
  };
  const legs = (pass: Pass) => { const Pp = passer(pass, roles); return (['r', 'l'] as const).map(s => { const M = s === 'r' ? ((p: Part) => p) : mirPart; return `${Pp(M(FR.thighR))}${Pp(M(FR.kneeCapR))}${Pp(M(FR.shinR))}${Pp(M(FR.footR))}`; }).join(''); };
  // the upper-trap helper tint eases off (1 -> 0.7) as the delts take over: the traps stay down, no shrug
  const bodyLayer = (pass: Pass) => { const Pp = passer(pass, roles, { ten: 'lr-ten', helpFade: 'lr-hlp', tap: muscles, cores: CORES, coreKey: 'body' }); return `${legs(pass)}${Pp(FR.neck)}${Pp(FR.torso)}${Pp(FR.head)}`; };
  const trailR = Array.from({ length: 33 }, (_, i): Pt => { const g = grip(i / 32, 1); return [g[0], g[1] + DROP]; });
  const trailL = trailR.map(([x, y]): Pt => [-x, y]);
  const dR = 'M' + trailR.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L'), dL = 'M' + trailL.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const trapR: Pt[] = [[7, -75], [17.5, -72], [24, -67.5]];                 // 4 to 5 units above the trap slope
  const downR = { from: [H[0] + 30, H[1] - 90], to: [H[0] + 30, H[1] - 75] }, downL = { from: [H[0] - 30, H[1] - 90], to: [H[0] - 30, H[1] - 75] };
  const bodyMarkup = layer(bodyLayer), sideL = side('l'), sideR = side('r');   // built first: they collect the hotspot cores
  if (muscles.some(m => !m.cls)) throw new Error('lr: a muscle in the table has no drawn region with a role');
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(H[0], 258, 30, 3)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">
${bodyMarkup}
<path class="guide" d="${dR}"/><path class="guide" d="${dL}"/><path class="trail j anim lr-trail" d="${dR}" pathLength="1"/><path class="trail j anim lr-trail" d="${dL}" pathLength="1"/>
${sideL}
${sideR}
<polyline class="ov ov-shoulders ovs" points="${pts(trapR)}"/><polyline class="ov ov-shoulders ovs" points="${pts(mir(trapR))}"/>
${cores(CORES, 'body')}${(['l', 'r'] as const).map(s => `<g class="j anim lr-ua-${s}">${cores(CORES, 'ua-' + s)}</g>`).join('')}
</g>`;
  const staticOverlays = `<g class="ov ov-shoulders">${arrowSvg(downR)}${arrowSvg(downL)}</g>`;
  // arrows for tiles 2 and 4: outside the right trail at p = 0.5, along the tangent
  const tA = (p: number) => { const g = grip(p, 1); return [g[0] + H[0], g[1] + DROP + H[1]]; };
  const pa = tA(0.36), pb = tA(0.64), mid = tA(0.5);
  const sh = [201, 94], nrm = norm(sub(mid, sh)), off = 10;
  const up = { from: [pa[0]! + nrm[0]! * off, pa[1]! + nrm[1]! * off], to: [pb[0]! + nrm[0]! * off, pb[1]! + nrm[1]! * off] };
  const css = [
    originRule('lr-ua-r', 22, -62), originRule('lr-ua-l', -22, -62),
    `.lr-fa-r{${origin(22, -24)};transform:rotate(${BEND}deg)}`,
    `.lr-fa-l{${origin(-22, -24)};transform:rotate(-${BEND}deg)}`,
    originRule('lr-db-r', 22, 16), originRule('lr-db-l', -22, 16),
    '.zoom-1 .cam{transform:translate(179px,138px) scale(2.2) translate(-179px,-90px)}',
    '.zoom-2 .cam{transform:translate(179px,138px) scale(1.2) translate(-179px,-135px)}',
    '.zoom-3 .cam{transform:translate(179px,138px) scale(2.2) translate(-179px,-113px)}',
    '.zoom-1 .ov-shoulders,.zoom-3 .ov-elbows{opacity:1}',
  ].join('\n') + '\n';
  return buildStage({
    id: LR_SPEC.id, scene, staticOverlays, css, tileBox: [66, 51, 226, 213], pics: LR_SPEC.pics, picsAt: LR_SPEC.picsAt,
    arrows: [null, up, null, { from: up.to, to: up.from }],
  }, sample);
}
