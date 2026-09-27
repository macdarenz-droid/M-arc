// Rig paint, ported from the demo's shared rig (docs/design/form-guide-demo/rig-final/gen.mjs at DEMO_COMMIT) and the lat
// pulldown's superset of fillPart (anim-lat-pulldown/gen.mjs: far facets, the flare, the contracted lat part, tenOver).
// App changes, and only these (docs/COACHING-DECISIONS.md D-GU1): hotspots carry data-muscle="<MuscleId>" and an inline
// style (R1-15), role polygons carry data-muscle instead of the demo's harness binding data-class, and clipPath ids count
// per scene (resetClip) instead of per build.
import type { MuscleId } from '../../data/muscles';
import type { Scheme } from './api';
import { n2, pts, type Pt } from './math';
import type { Cloth, Part, Region } from './parts';

export const CLOTH: Record<Cloth, string> = { skin: 'b', tee: 't', shorts: 'p', shoe: 's', sole: 'so', hair: 'hr' };
export const FAR_CLOTH: Record<Cloth, string> = { skin: 'bf', tee: 'bf', shorts: 'pf', shoe: 'sf', sole: 'sf', hair: 'bf' };
export const toneCls = (cloth: Cloth, tone: Region['tone'] | null): string => CLOTH[cloth] + (tone === 'hi' ? 'h' : tone === 'lo' ? 'l' : '');

/** rig region name -> muscle id (R1-15) */
export const REGION_MUSCLE: Record<string, MuscleId> = {
  chest: 'chest', frontDelts: 'front_delts', triceps: 'triceps', sideDelts: 'side_delts',
  upperTraps: 'upper_traps', lats: 'lats', biceps: 'biceps', midBack: 'mid_back',
};

export type Role = 'main' | 'help';
export type MuscleRow = { region: string; id: string; common: string; anatomical: string; role: Role; line: string };
export type TapMuscle = MuscleRow & { index: number; Id: string; cls?: string };
export type Cores = Record<string, { help: string; main: string }>;
/** a flare region (lat pulldown): the outer edge it is outlined on and the origin it grows from */
export type FlareRegion = Region & { outer: Pt[]; origin: Pt };
export type ClipSeq = { n: number };
export type FillOpt = {
  far?: boolean; facets?: boolean; effort?: string; glow?: string; ten?: string; flare?: string; helpFade?: string; tenOver?: boolean;
  tap?: TapMuscle[]; cores?: Cores; coreKey?: string; clip?: ClipSeq;
};
export type Pass = 'ol' | 'rim' | 'fill';
/** clipPath ids for the glow, counted per scene: renderStage resets it first, so a render is deterministic */
const CLIP: ClipSeq = { n: 0 };
export const resetClip = (): void => { CLIP.n = 0; };

const hotStyle = (w: number) => `fill:transparent;stroke:transparent;stroke-width:${w}px;stroke-linejoin:round;pointer-events:all;vector-effect:non-scaling-stroke`;
const muscleOf = (m: TapMuscle): string => REGION_MUSCLE[m.region] ?? m.region;

export function fillPart(p: Part, roles: Record<string, Role> = {}, opt: FillOpt = {}): string {
  const cloth = p.cloth || 'skin';
  if (opt.far) return `<polygon class="${FAR_CLOTH[cloth]}" points="${pts(p.base)}"/>` + (p.regions || []).filter(r => r.far || (opt.facets && r.tone && !r.ten)).map(r => `<polygon class="${FAR_CLOTH[r.cloth || cloth]}${opt.facets && r.tone ? (r.tone === 'hi' ? 'h' : 'l') : ''}" points="${pts(r.poly)}"/>`).join('');
  let s = `<polygon class="${toneCls(cloth, null)}" points="${pts(p.base)}"/>`, glow = '', mus = '', flare = '', hotHelp = '', hotMain = '';
  const clip = opt.clip ?? CLIP;
  // one class string per muscle; the app marks the region with data-muscle (the player adds .sel to the tapped one)
  const hole = (m: TapMuscle | null, cls: string) => { if (!m) return `class="${cls}"`; if (m.cls && m.cls !== cls) throw new Error(`${m.region}: its polygons carry different classes (${m.cls} vs ${cls}); one class hole per muscle needs one class`); m.cls = cls; return `class="${cls}" data-muscle="${muscleOf(m)}"`; };
  const hot = (m: TapMuscle, poly: Pt[]) => {
    if (opt.cores) { const k = opt.coreKey || 'body'; const c = (opt.cores[k] = opt.cores[k] || { help: '', main: '' }); c[m.role] += `<polygon class="hot hot-core" data-muscle="${muscleOf(m)}" data-hot="${m.index}" points="${pts(poly)}" style="fill:transparent;stroke:none;pointer-events:all"/>`; }
    // the halo is 30 px, or wider for a thin region, so the hit box is at least 44 px on its short side at 1x
    const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]), thin = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), halo = Math.max(30, Math.ceil(44 - thin));
    return `<polygon class="hot" data-muscle="${muscleOf(m)}" data-hot="${m.index}" role="button" tabindex="0" aria-label="${m.common}, ${m.role === 'main' ? 'target muscle' : 'helps'}" points="${pts(poly)}" style="${hotStyle(halo)}"/>`;
  };
  const mainCls = `mm anim ${opt.effort || ''}`.trim();
  for (const r of p.regions || []) {
    const role = r.muscle ? roles[r.muscle] : undefined, m = opt.tap && role ? opt.tap.find(x => x.region === r.muscle) ?? null : null;
    const drawn = r.flare ? !!(opt.ten && opt.flare) : r.ten && role === 'main' ? !!opt.ten : true;   // a hotspot only where the muscle is painted
    if (m && drawn) { if (role === 'main') hotMain += hot(m, r.poly); else hotHelp += hot(m, r.poly); }
    if (role === 'main' && r.flare) {
      if (opt.ten && opt.flare) {
        const f = r as FlareRegion, d = 'M' + f.outer.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L'), id = `${opt.glow}-clip${clip.n++}`;
        flare += `<g class="j anim ${opt.ten}"><g class="j anim ${opt.flare}" style="transform-origin:${n2(f.origin[0])}px ${n2(f.origin[1])}px"><path class="olk" d="${d}"/><path class="rim" d="${d}"/><clipPath id="${id}"><polygon points="${pts(r.poly)}"/></clipPath><g clip-path="url(#${id})"><polygon class="gw" points="${pts(r.poly)}"/></g><polygon ${m ? hole(m, mainCls) : 'class="mm"'} points="${pts(r.poly)}"/></g></g>`;
      }
    } else if (role === 'main' && r.ten) {
      if (r.tone) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone)}" points="${pts(r.poly)}"/>`;
      if (opt.ten) { mus += `<g class="j anim ${opt.ten}"><polygon ${m ? hole(m, mainCls) : 'class="mm"'} points="${pts(r.poly)}"/></g>`; if (opt.glow) glow += `<polygon class="gw anim ${opt.glow}" points="${pts(r.poly)}"/>`; }
    } else if (role === 'main') { mus += `<polygon ${hole(m, mainCls)} points="${pts(r.poly)}"/>`; if (opt.glow) glow += `<polygon class="gw anim ${opt.glow}" points="${pts(r.poly)}"/>`; }
    else if (role === 'help') mus += `<polygon ${hole(m, `mh${opt.helpFade ? ` anim ${opt.helpFade}` : ''}`)} points="${pts(r.poly)}"/>`;
    else if (r.ten) { if (opt.ten) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone ?? null)} tn anim ${opt.ten}" points="${pts(r.poly)}"/>`; }
    else if (r.tone || r.cloth) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone ?? null)}" points="${pts(r.poly)}"/>`;
    else if (r.facet) s += `<polygon class="fc" points="${pts(r.poly)}"/>`;
  }
  // the glow halo is clipped to the part's own silhouette, so it never spills past the outline as a fringe
  if (glow) { const id = `${opt.glow}-clip${clip.n++}`; glow = `<clipPath id="${id}"><polygon points="${pts(p.base)}"/></clipPath><g clip-path="url(#${id})">${glow}</g>`; }
  // opt.tenOver draws the secondary-motion facets over the role muscles (lat pulldown: the shoulder blade over the mid back)
  if (opt.tenOver) { let ov = ''; s = s.replace(/<polygon class="[^"]* tn anim [^"]*" points="[^"]*"\/>/g, x => { ov += x; return ''; }); return s + flare + glow + mus + ov + hotHelp + hotMain; }
  return s + flare + glow + mus + hotHelp + hotMain;
}
export const olPart = (p: Part, far?: boolean): string => `<polygon class="${far ? 'olkf' : 'olk'}" points="${pts(p.base)}"/>`;
export const rimPart = (p: Part): string => `<polygon class="rim" points="${pts(p.base)}"/>`;
// Muscle info on tap (spec 2.10): the exercise's table of tappable muscles. Its roles must be exactly the rig's roles map,
// every line ends with a full stop, and the ids get their camel-case form.
export function muscleTable(list: MuscleRow[], roles: Record<string, Role>, label: string): TapMuscle[] {
  const want = JSON.stringify(Object.entries(roles).sort()), got = JSON.stringify(list.map(m => [m.region, m.role]).sort());
  if (want !== got) throw new Error(`${label}: muscle table roles ${got} differ from the rig's roles ${want}`);
  for (const m of list) { if (!m.common || !m.anatomical || !/\.$/.test(m.line)) throw new Error(`${label}: bad muscle line for ${m.region}`); }
  return list.map((m, index) => ({ ...m, index, Id: m.id.charAt(0).toUpperCase() + m.id.slice(1) }));
}
export const muscleText = (m: MuscleRow): string => `${m.common} (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line}`;
// the core copies collected for one chain, helpers first, the target last
export const cores = (c: Cores, k: string): string => (c[k] ? c[k].help + c[k].main : '');
// pass-aware helper: P(part) returns the outline, rim or fill markup for the current pass
export const passer = (pass: Pass, roles: Record<string, Role>, opt: FillOpt = {}) => (p: Part): string => (pass === 'ol' ? olPart(p, opt.far) : pass === 'rim' ? (opt.far ? '' : rimPart(p)) : fillPart(p, roles, opt));
// all three passes of one layer, in order
export const layer = (f: (pass: Pass) => string): string => f('ol') + f('rim') + f('fill');
// an arm is ONE layer: the lower arm's outline and rim are drawn inside the upper arm's passes
export const armLayer = (up: (pass: Pass) => string, lo: (pass: Pass) => string, wrap: (m: string, pass: Pass) => string): string => (['ol', 'rim', 'fill'] as const).map(pass => up(pass) + wrap(lo(pass), pass)).join('');
// Soft contact shadow: three stacked low-opacity ellipses (no SVG filter), centred on the contact.
export const shadow = (cx: number, cy: number, rx: number, ry: number): string => `<g class="shadow">${[1, 0.72, 0.44].map(k => `<ellipse class="shd" cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx * k)}" ry="${n2(ry * k)}"/>`).join('')}</g>`;

// The rig variables that depend on the scheme (light: stronger lines, because the lifted body fill is darker than the stage).
export function rigVars(scheme: Scheme): string {
  const light = scheme === 'light';
  return `--fg-line:color-mix(in srgb,var(--text) ${light ? 70 : 60}%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) ${light ? 56 : 38}%,var(--surface-1));--lit:var(${light ? '--bg' : '--text'});--shd:var(${light ? '--text' : '--bg'});--hi:${light ? 76 : 90}%;--lo:${light ? 84 : 78}%;--eq-hi:${light ? 40 : 82}%;--rim-k:${light ? 35 : 62}%`;
}

/** The demo's BASE_CSS `.player{}` token block (from --fg-line to --seam, plus --sw:1); the player's stylesheet declares the same. */
export const RIG_TOKENS = `--sw:1;
--fg-line:color-mix(in srgb,var(--text) 60%,var(--surface-1));
--fg-line-far:color-mix(in srgb,var(--text) 30%,var(--surface-1));
--fg-metal:color-mix(in srgb,var(--text) 72%,var(--surface-1));
--fg-cable:color-mix(in srgb,var(--text) 55%,var(--surface-1));
--body:color-mix(in srgb,var(--map-body) 88%,var(--text));
--body-facet:color-mix(in srgb,var(--map-body) 78%,var(--text));
--body-far:color-mix(in srgb,var(--map-body) 50%,var(--surface-1));
--muscle-main:var(--accent);
--muscle-help:color-mix(in srgb,var(--accent) 45%,var(--body));
--equip:var(--surface-3);
--skin:color-mix(in srgb,var(--body) 92%,var(--text));
--skin-hi:color-mix(in srgb,var(--skin) var(--hi),var(--lit));
--skin-lo:color-mix(in srgb,var(--skin) var(--lo),var(--shd));
--tee:var(--body);
--tee-hi:color-mix(in srgb,var(--tee) var(--hi),var(--lit));
--tee-lo:color-mix(in srgb,var(--tee) var(--lo),var(--shd));
--shorts:color-mix(in srgb,var(--body) 70%,var(--text));
--shorts-hi:color-mix(in srgb,var(--shorts) var(--hi),var(--lit));
--shorts-lo:color-mix(in srgb,var(--shorts) var(--lo),var(--shd));
--shorts-far:color-mix(in srgb,var(--shorts) 45%,var(--surface-1));
--shoe:color-mix(in srgb,var(--body) 50%,var(--shd));
--shoe-hi:color-mix(in srgb,var(--shoe) var(--hi),var(--lit));
--shoe-lo:color-mix(in srgb,var(--shoe) var(--lo),var(--shd));
--shoe-far:color-mix(in srgb,var(--shoe) 45%,var(--surface-1));
--sole:color-mix(in srgb,var(--body) 45%,var(--lit));
--hair:color-mix(in srgb,var(--body) 50%,var(--shd));
--hair-hi:color-mix(in srgb,var(--hair) 68%,var(--lit));
--rim:color-mix(in srgb,var(--body) var(--rim-k),var(--lit));
--equip-hi:color-mix(in srgb,var(--equip) var(--eq-hi),var(--lit));
--equip-lo:color-mix(in srgb,var(--equip) var(--lo),var(--shd));
--metal-lo:color-mix(in srgb,var(--fg-metal) 64%,var(--surface-1));
--seam:color-mix(in srgb,var(--fg-frame) 70%,var(--equip))`;

/**
 * The demo's figure, equipment and guide paint rules (BASE_CSS "figure paint" to ".j"), verbatim. Left out, and only
 * these: the player chrome and colour tokens (styles.css, R1-12), the CSS-animation classes (WAAPI replaces them), and the
 * player-state rules `.hot`, `.hot-core`, `.pics .hot`, `.mm.sel,.mh.sel` and `.ov` (the player's styles.css block, R1-12).
 */
export const RIG_CSS = `.b{fill:var(--skin)}.bh{fill:var(--skin-hi)}.bl{fill:var(--skin-lo)}
.t{fill:var(--tee)}.th{fill:var(--tee-hi)}.tl{fill:var(--tee-lo)}
.p{fill:var(--shorts)}.ph{fill:var(--shorts-hi)}.pl{fill:var(--shorts-lo)}
.s{fill:var(--shoe)}.sh{fill:var(--shoe-hi)}.sl{fill:var(--shoe-lo)}.so{fill:var(--sole)}
.hr{fill:var(--hair)}.hrh{fill:var(--hair-hi)}
.bf{fill:var(--body-far)}.pf{fill:var(--shorts-far)}.sf{fill:var(--shoe-far)}
.tn{fill-opacity:.75}
.rim{fill:none;stroke:var(--rim);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.gw{fill:none;stroke:var(--accent);stroke-width:calc(var(--sw) * 5px);stroke-opacity:.3;stroke-linejoin:round}
.shd{fill:var(--border);fill-opacity:.6}
.olk{fill:none;stroke:var(--fg-line);stroke-width:calc(var(--sw) * 3px);stroke-linejoin:round}
.olkf{fill:none;stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 2.4px);stroke-linejoin:round}
.fc{fill:var(--body-facet);stroke:var(--map-line);stroke-width:.6px;stroke-linejoin:round}
.mm{fill:var(--muscle-main);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
.mh{fill:var(--muscle-help);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
.eq{fill:var(--equip);stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.eqm{fill:var(--equip);stroke:var(--fg-metal);stroke-width:calc(var(--sw) * 1.2px);stroke-linejoin:round}
.eqf{fill:var(--body-far);stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.hd{fill:var(--fg-metal)}
.eqs{fill:var(--equip)}.eqh{fill:var(--equip-hi)}.eql{fill:var(--equip-lo)}
.knurl{fill:none;stroke:var(--metal-lo);stroke-width:calc(var(--sw) * .6px)}
.seam{fill:none;stroke:var(--seam);stroke-width:calc(var(--sw) * .7px);stroke-dasharray:1.6 1.2}
.prim{fill:none;stroke:var(--fg-metal);stroke-width:calc(var(--sw) * .7px)}
.hdf{fill:var(--fg-line-far)}
.pin{fill:var(--accent)}
.rod{fill:none;stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px)}
.cable{fill:none;stroke:var(--fg-cable);stroke-width:calc(var(--sw) * 1.25px);stroke-linecap:round}
.floor{stroke:var(--border);stroke-width:1px}
.b,.bf,.olk,.olkf,.rim,.fc,.mm,.mh,.hot,.eq,.eqm,.eqf,.rod,.cable,.floor,.knurl,.seam,.prim{vector-effect:non-scaling-stroke}
.guide{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3;opacity:.6}
.trail{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-dasharray:1 1}
.ovs{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow-head{fill:var(--accent)}
.arrow-lg{stroke-width:3}
.j{transform-box:view-box}
`;
