// LIB-6: posture close-ups (S3) of a zoom sheet: two crops of the plate at the plate's own camera, Right and Wrong,
// from golden B's howto/render-*.mjs cropHalf()/postureZoom(). What a crop shows is the zoom's data (`*.howto.mjs`):
// crop window (center, centerWrong, sizePx), wrong.solid / wrongAlone / trim / equipment shifts, view 'back' with
// camLabel, and zoom-only guides: level (own, tone), drop, cap, path, spine, outlines (e.g. the shoulder blades),
// pelvisGuide. The per-sheet differences are named options (`crop`):
//   landmarks 'zoom' - point refs resolve on the zoom's right and wrong poses whatever the crop shows (pull-up);
//             'spec' - on the poses the crop draws, plus 'right' (the zoom's right pose) (the other sheets);
//   solidPose 'merged' - a solid Wrong crop draws the right pose merged with the wrong one (pull-up); 'own' - the wrong pose;
//   equipment 'plate' - the zoom's own or the plate's non-function equipment; 'noRays' - the plate's equipment minus its
//             construction rays, with the wrong crop's equipment shifts (lat pulldown, seated cable row);
//   backView  - honour view 'back' (pull-up, leg raise); datumZooms - zoom keys whose crops keep the plate's first datum.
// The ref-src crop (lateral raise, from the approved ref-src plate drawing) is refSrcCrop below.
import { renderPlate } from '../../../layers/engine/plate.mjs';
import { landmarksOf } from '../../../layers/engine/body.mjs';
import { arm as refArm } from '../../../layers/ref-src/plate.mjs';
import { esc, f, mergeDeep } from './common.mjs';

export const PANEL = 171, PH = 171;
const ZONLY = ['level', 'drop', 'cap'];

/** The crop svg frame every posture crop shares. */
const frame = (z, role, vx, vy, s, inner, overlay, label) => `<svg class="z-crop" viewBox="0 0 ${PANEL} ${PH}" role="img" aria-label="${esc(role === 'right' ? 'Right: ' + z.alt.right : 'Wrong: ' + z.alt.wrong)}" xmlns="http://www.w3.org/2000/svg">
    <rect class="z-bg" width="${PANEL}" height="${PH}" fill="url(#zdots)"/>
    <defs><clipPath id="zc-${z.key}-${role}"><rect width="${PANEL}" height="${PH}" rx="10"/></clipPath></defs>
    <g clip-path="url(#zc-${z.key}-${role})"><svg x="0" y="0" width="${PANEL}" height="${PH}" aria-hidden="true" viewBox="${f(vx)} ${f(vy)} ${s} ${s}" class="z-plate">${inner}</svg></g>
    <rect class="z-frame" x=".5" y=".5" width="${PANEL - 1}" height="${PH - 1}" rx="10"/>${overlay}${label}</svg>`;
const unwrap = svg => svg.replace(/<svg class="plate-svg"[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<rect width="358" height="358" fill="url\(#[^)]*\)"\/>/, '');

/** cropHalf(z, role) for engine-spec plates. */
export function engineCrop(howto, o) {
  const base = renderPlate(howto.plate, { id: 'base' });
  const CAM = base.report.camera;                    // the fitted camera of the plate on screen; every crop reuses it
  const H = howto.plate.body?.height ?? 1.75;
  const poseOf = ref => typeof ref === 'string' ? howto.plate.poses[ref] : mergeDeep(howto.plate.poses[ref.base], ref.pose);
  const back = z => o.backView && z.view === 'back';
  const camOf = z => back(z) ? { pxPerM: CAM.pxPerM, x0: 179, y0: CAM.y0 } : { pxPerM: CAM.pxPerM, x0: CAM.x0, y0: CAM.y0 };
  const projOf = z => { const c = camOf(z); return back(z) ? (w => [c.x0 + w[0] * c.pxPerM, c.y0 - w[1] * c.pxPerM]) : (w => [c.x0 + w[2] * c.pxPerM, c.y0 - w[1] * c.pxPerM]); };
  const wrongPose = z => mergeDeep(poseOf(z.right), poseOf(z.wrong));
  // equipment 'noRays': the lean construction rays (a function returning only 'line' items on the correct end pose)
  // belong to the plate's measured arc, which a crop does not carry
  let EQ = null;
  if (o.equipment === 'noRays') {
    const LM_END = landmarksOf(howto.plate.poses.end, howto.plate.body?.height ?? 1.75);
    const isRays = e => { const r = [].concat(e(LM_END, { pose: 'end', mistake: false, start: LM_END, q: null }) ?? []); return r.length > 0 && r.every(it => it.type === 'line'); };
    EQ = howto.plate.equipment.filter(e => typeof e !== 'function' || !isRays(e));
  }
  const shiftEq = (eq, ov) => !ov ? eq : eq.map(e => (typeof e !== 'function' && ov[e.type]) ? { ...e, at: [e.at[0], e.at[1] + (ov[e.type].dy ?? 0), e.at[2]] } : e);
  const solidOf = (z, role) => role === 'wrong' && (z.wrongAlone || z.wrong.solid);

  function cropSpec(z, role) {
    const p = howto.plate, right = poseOf(z.right), solid = solidOf(z, role);
    const shown = solid ? (o.solidPose === 'merged' ? wrongPose(z) : poseOf(z.wrong)) : right;
    const spec = { ...p, camera: camOf(z), poses: { start: shown, end: shown },
      equipment: o.equipment === 'noRays' ? shiftEq(EQ, role === 'wrong' ? z.wrong.equipment : null) : z.equipment ?? p.equipment.filter(e => typeof e !== 'function'),
      callouts: [], ghosts: { count: 0 }, trace: undefined, measure: undefined, checks: [],
      datum: (o.datumZooms ?? []).includes(z.key) ? [p.datum[0]] : [], mistake: undefined,
      ...(back(z) ? { view: 'front', viewLabel: 'Back view', marks: [] } : {}) };
    if (role === 'wrong' && !solid) spec.mistake = { pose: poseOf(z.wrong), parts: z.wrong.parts, guides: (z.guides ?? []).filter(g => !ZONLY.includes(g.kind)), tells: [] };
    return spec;
  }
  function landmarks(z, spec) {
    let lms;
    if (o.landmarks === 'zoom') lms = { end: landmarksOf(poseOf(z.right), H), start: landmarksOf(poseOf(z.right), H), mistake: landmarksOf(wrongPose(z), H) };
    else {
      lms = { end: landmarksOf(spec.poses.end, H), start: landmarksOf(spec.poses.start, H), right: landmarksOf(poseOf(z.right), H) };
      if (spec.mistake?.pose) lms.mistake = landmarksOf(mergeDeep(spec.poses.end, spec.mistake.pose), H);
    }
    if (z.outlines) for (const k of Object.keys(lms)) Object.assign(lms[k], z.outlines(lms[k]).points);
    return lms;
  }
  function resolveRefs(z, spec, refs) {
    const lms = landmarks(z, spec), P = projOf(z);
    const res = (ref, pose = 'end') => {
      if (Array.isArray(ref)) return ref.length === 3 ? P(ref) : ref;
      if (typeof ref === 'string') return P(lms[pose][ref]);
      const pp = ref.pose === 'mistake' && !lms.mistake ? 'end' : (ref.pose ?? pose);   // solid wrong crop: its pose is 'end'
      const p = res(ref.at, pp), o2 = ref.off ?? [0, 0]; return [p[0] + o2[0], p[1] + o2[1]];
    };
    return refs.map(r => res(r));
  }
  // Pelvis guide: the pelvis drawn as a bowl and a dashed vertical reference line, tipped by the pose's own pelvis tilt.
  // Centre: between the hip joint and the sacrum, where the pelvis sits in this side view.
  function pelvisOverlay(spec, role, toPanel, k, P) {
    const pose = spec.mistake ? mergeDeep(spec.poses.end, spec.mistake.pose) : spec.poses.end;
    const lm = landmarksOf(pose, H), t = (pose.root?.tilt ?? 0) * Math.PI / 180;
    const hip = lm['hip.r'], sac = lm.sacrum;
    const c = [0, hip[1] + (sac[1] - hip[1]) * 0.45 + 0.01, hip[2] + (sac[2] - hip[2]) * 0.45];
    const up = [0, Math.cos(t), Math.sin(t)], fw = [0, -Math.sin(t), Math.cos(t)];     // world (y, z): pelvis up, pelvis forward
    const W = (a, b) => [0, c[1] + up[1] * a + fw[1] * b, c[2] + up[2] * a + fw[2] * b];   // a along up, b along forward (m)
    const px = w => toPanel(P(w));
    // bowl: rim 16 cm, round bottom 6.5 cm deep (about the body's depth at the waist)
    const bowl = Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [0.04 - 0.065 * Math.sin(a), -0.065 * Math.cos(a)]; }).map(([a, b]) => px(W(a, b)));
    const rim = [px(W(0.04, -0.08)), px(W(0.04, 0.08))];
    const cs = px(c), vx = cs[0];
    const cls = role === 'right' ? 'ok' : 'm';
    const d = 'M' + bowl.map(q => q.map(f).join(' ')).join('L');
    const v0 = cs[1] - 0.2 * CAM.pxPerM * k, v1 = cs[1] + 0.1 * CAM.pxPerM * k;
    return `<g class="z-pelvis ${cls}"><path class="z-vert" d="M${f(vx)} ${f(v0)}V${f(v1)}"/>`
      + `<path class="z-bowl" d="${d}"/><path class="z-rim" d="M${rim.map(q => q.map(f).join(' ')).join('L')}"/></g>`;
  }

  return function cropHalf(z, role) {
    const spec = cropSpec(z, role);
    const p = renderPlate(spec, { id: `${z.key}-${role}`, mistake: role === 'wrong' });
    const guides = z.guides ?? [];
    const levels = guides.filter(g => g.kind === 'level'), drops = role === 'wrong' ? guides.filter(g => g.kind === 'drop') : [];
    const caps = role === 'wrong' ? guides.filter(g => g.kind === 'cap') : [];
    const anchors = resolveRefs(z, spec, [(role === 'wrong' && z.crop.centerWrong) || z.crop.center, z.callout[role].anchor,
      ...levels.map(g => g.own ? { at: g.at, pose: role === 'wrong' ? 'mistake' : 'end' } : g.at), ...drops.flatMap(g => [g.from, g.to]),
      ...caps.flatMap(g => [{ at: g.at, pose: 'mistake' }, { at: g.top, pose: 'mistake' }])]);
    const [cx, cy] = anchors[0], s = z.crop.sizePx, vx = cx - s / 2, vy = cy - s / 2, k = PANEL / s;
    // trim: small black discs added to the plate's mistake mask (wrong crop), e.g. a hook the mask left at a dive
    const trims = role === 'wrong' ? (z.wrong.trim ?? []) : [], trimAt = resolveRefs(z, spec, trims);
    const cut = trims.map((t, i) => `<circle cx="${f(trimAt[i][0])}" cy="${f(trimAt[i][1])}" r="${t.r}" fill="#000"/>`).join('');
    const inner = unwrap(cut ? p.svg.replace(/(<mask id="[^"]*-mmask"[\s\S]*?)(<\/mask>)/, `$1${cut}$2`) : p.svg);
    const toPanel = ([x, y]) => [(x - vx) * k, (y - vy) * k], P = projOf(z);
    const A = toPanel(anchors[1]), cls = role === 'right' ? 'ok' : 'm';
    // spine: a dashed line along the back, offset 3 px off the body, optionally extended past its ends
    const spines = guides.filter(g => g.kind === 'spine'), spineAt = resolveRefs(z, spec, spines.flatMap(g => [g.from, g.to]));
    const sp = spines.map((g, i) => { const a = toPanel(spineAt[2 * i]), b = toPanel(spineAt[2 * i + 1]), d = [b[0] - a[0], b[1] - a[1]], [e0, e1] = g.extend ?? [0, 0];
      const L = Math.hypot(...d), n = [d[1] / L * 3, -d[0] / L * 3];
      return [[a[0] - d[0] * e0 + n[0], a[1] - d[1] * e0 + n[1]], [b[0] + d[0] * e1 + n[0], b[1] + d[1] * e1 + n[1]]]; })
      .map(([a, b]) => `<path class="z-spine ${cls}" d="M${f(a[0])} ${f(a[1])}L${f(b[0])} ${f(b[1])}"/>`).join('');
    // path: a dashed bar path in world points, with an arrow head at its end; only the guide whose role matches
    const paths = guides.filter(g => g.kind === 'path' && g.role === role).map(g => {
      const ps = g.pts.map(w => toPanel(P(w))), n = ps.length, a = ps[n - 2], b = ps[n - 1], L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, t = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], q = [-t[1], t[0]];
      const d = 'M' + ps.map(([x, y]) => `${f(x)} ${f(y)}`).join('L');
      const head = `M${f(b[0] - t[0] * 6 + q[0] * 4)} ${f(b[1] - t[1] * 6 + q[1] * 4)}L${f(b[0])} ${f(b[1])}L${f(b[0] - t[0] * 6 - q[0] * 4)} ${f(b[1] - t[1] * 6 - q[1] * 4)}`;
      return `<path class="z-path ${cls}" d="${d}"/><path class="z-path-head ${cls}" d="${head}"/>`; }).join('');
    const lv = sp + paths + levels.map((g, i) => `<path class="z-level ${g.tone === 'neutral' ? 'n' : cls}" d="M4 ${f(toPanel(anchors[2 + i])[1])}H${PANEL - 4}"/>`).join('');
    // drop: drawn vertically at the start point's x; the head points the way the point moves (up or down)
    const dr = drops.map((g, i) => { const a = toPanel(anchors[2 + levels.length + 2 * i]), b = toPanel(anchors[3 + levels.length + 2 * i]);
      const x = a[0], sg = Math.sign(b[1] - a[1]) || 1;
      return `<path class="z-drop" d="M${f(x)} ${f(a[1])}V${f(b[1] - sg)}"/><path class="z-drop-head" d="M${f(x - 4)} ${f(b[1] - 6 * sg)}L${f(x)} ${f(b[1])}L${f(x + 4)} ${f(b[1] - 6 * sg)}Z"/>`; }).join('');
    // cap: the dashed outline of a joint cap in the wrong pose (the plate's mistake layer outlines only the union)
    const i0 = 2 + levels.length + 2 * drops.length;
    const cp = caps.map((g, i) => { const c = toPanel(anchors[i0 + 2 * i]), t = toPanel(anchors[i0 + 2 * i + 1]);
      return `<circle class="z-cap" cx="${f(c[0])}" cy="${f(c[1])}" r="${f(Math.hypot(t[0] - c[0], t[1] - c[1]))}"/>`; }).join('');
    // outlines of the pose this crop shows: accent in Right, --mistake in Wrong
    const olLms = !z.outlines ? null : o.landmarks === 'zoom' ? landmarks(z, spec)[role === 'wrong' ? 'mistake' : 'end'] : landmarksOf(spec.poses.end, H);
    const ol = z.outlines ? z.outlines(olLms).lines.map(q =>
      `<path class="z-ol ${q.kind} ${cls}" d="M${q.pts.map(w => toPanel(P(w)).map(f).join(' ')).join('L')}"/>`).join('') : '';
    const overlay = z.pelvisGuide ? pelvisOverlay(spec, role, toPanel, k, P) : '';
    const label = lv + dr + cp + ol + `<circle class="z-anchor ${cls}" cx="${f(A[0])}" cy="${f(A[1])}" r="2.5"/>`;   // the words are the subtag under Right / Wrong
    return `<div class="plate z-wrap">${frame(z, role, vx, vy, s, inner, overlay, label)}</div>`;
  };
}

/* ---------- ref-src crops: the approved ref-src plate drawing, re-framed (lateral raise, S-2 condition 2) ---------- */
/** Remove every element <tag class="cls..."> with its balanced subtree. */
function dropEl(svg, tag, cls) {
  const re = new RegExp(`<${tag} class="${cls}[^"]*"[^>]*?(/?)>`, 'g');
  let out = '', i = 0, m;
  while ((m = re.exec(svg))) {
    out += svg.slice(i, m.index);
    if (m[1] === '/') { i = re.lastIndex; continue; }
    let depth = 1, j = re.lastIndex;
    const tagRe = new RegExp(`<${tag}\\b[^>]*?(/?)>|</${tag}>`, 'g'); tagRe.lastIndex = j;
    let t;
    while (depth && (t = tagRe.exec(svg))) { if (t[0].startsWith('</')) depth--; else if (t[1] !== '/') depth++; j = tagRe.lastIndex; }
    i = j; re.lastIndex = j;
  }
  return out + svg.slice(i);
}
const REF_LEAD = 8;   // ref-src leadAt(88): the elbows-lead angle at the top
const REF = { cx: 179, floor: 339, hpx: 256 };
const refP = ([x, y]) => [REF.cx + x * REF.hpx, REF.floor - y * REF.hpx];
/** Point references on the approved plate: engine names mapped to ref-src geometry. `.r` is the figure's right = the
 *  viewer's left (ref-src side -1). 'mistake' = the wrong still of this zoom. */
function refLandmarks(pose, z) {
  const abdR = pose === 'mistake' && z.wrong?.abd ? z.wrong.abd : 88;
  const R = refArm(abdR, REF_LEAD, -1), L = refArm(88, REF_LEAD, 1);
  const trapL = refP([0.078, 0.8335]);
  return { 'shoulder.r': R.S, 'elbow.r': R.E, 'wrist.r': R.W, 'grip.r': R.G, 'shoulder.l': L.S, 'elbow.l': L.E, 'wrist.l': L.W, 'grip.l': L.G,
    'trap.l': trapL, 'trap.r': [2 * REF.cx - trapL[0], trapL[1]], neck: refP([0, 0.854]) };
}
function refResolve(z, refs) {
  const res = (ref, pose = 'end') => {
    if (Array.isArray(ref)) return ref;
    if (typeof ref === 'string') { const [a, b] = ref.includes(':') ? ref.split(':') : [pose, ref]; const lm = refLandmarks(a, z)[b]; if (!lm) throw new Error(`ref-src landmark ${b}`); return lm; }
    if (ref.along) { const a = res(ref.along[0], ref.pose ?? pose), b = res(ref.along[1], ref.pose ?? pose), t = ref.t ?? 1, o = ref.off ?? [0, 0]; return [a[0] + (b[0] - a[0]) * t + o[0], a[1] + (b[1] - a[1]) * t + o[1]]; }
    const p = res(ref.at, ref.pose ?? pose), o = ref.off ?? [0, 0]; return [p[0] + o[0], p[1] + o[1]];
  };
  return refs.map(r => res(r));
}
export function refSrcCrop(howto) {
  return function cropHalf(z, role) {
    const render = howto.plate.render;
    if (typeof render !== 'function') throw new Error('ref-src crop: howto.plate.render (ref-src/plate.mjs) missing');
    const pid = `${z.key}-${role}`, fromMistake = role === 'wrong' && z.wrong === 'mistake';
    let inner = render({ id: pid, mistake: fromMistake }).svg;
    // re-frame: drop the svg wrapper and its dot grid (the panel has its own at 1x) and the teaching layers
    inner = unwrap(inner);
    for (const [tag, cls] of [['g', 'pose-start'], ['g', 'ghost'], ['g', 'accent-layer'], ['path', 'arc measure'], ['path', 'leader'], ['circle', 'anchor']]) inner = dropEl(inner, tag, cls);
    if (/class="(ghost|pose-start|accent-layer|leader|anchor|trace)/.test(inner)) throw new Error(`${pid}: teaching layer left in the crop`);
    if (role === 'wrong' && !fromMistake) {
      // the wrong still: the approved arm() at z.wrong.abd, dashed in the mistake colour over the right position. Mask as
      // the engine's: the union's outline only, not where it runs on the correct outline, and not inside hideInside.
      const W = refArm(z.wrong.abd, REF_LEAD, -1), shapes = [...W.shapes, W.disc];
      const defs = shapes.map((d, i) => `<path id="${pid}-w${i}" d="${d}"/>`).join('');
      const endIds = [...inner.matchAll(/<use href="#([^"]+)" class=""\/>/g)].map(m => m[1]).filter((k, i, a) => a.indexOf(k) === i && /-(head|torso|leg\d|e-?1\d)$/.test(k));
      const hideMap = { 'shcap.r': `${pid}-e-10`, 'upper.r': `${pid}-e-11` };
      const hide = (z.wrong.hideInside ?? []).map(k => { const id = hideMap[k]; if (!id || !inner.includes(`id="${id}"`)) throw new Error(`hideInside: no shape ${k}`); return id; });
      const mask = `<mask id="${pid}-mmask" maskUnits="userSpaceOnUse" x="0" y="0" width="358" height="358"><rect width="358" height="358" fill="#fff"/>`
        + shapes.map((d, i) => `<use href="#${pid}-w${i}" fill="#000"/>`).join('') + hide.map(k => `<use href="#${k}" fill="#000"/>`).join('')
        + endIds.map(k => `<use href="#${k}" fill="none" stroke="#000" stroke-width="3.5"/>`).join('') + `</mask>`;
      inner = inner.replace('</defs>', `${defs}${mask}</defs>`) + `<g class="m-pose" mask="url(#${pid}-mmask)"><g class="u-stroke">${shapes.map((d, i) => `<use href="#${pid}-w${i}"/>`).join('')}</g></g>`;
    }
    const levels = (z.guides ?? []).filter(g => g.kind === 'level');
    const anchors = refResolve(z, [z.crop.center, z.callout[role].anchor, ...levels.map(g => g.at)]);
    const [cx, cy] = anchors[0], s = z.crop.sizePx, vx = cx - s / 2, vy = cy - s / 2, k = PANEL / s;
    const toPanel = ([x, y]) => [(x - vx) * k, (y - vy) * k];
    const A = toPanel(anchors[1]), cls = role === 'right' ? 'ok' : 'm';
    const levelEls = levels.map((g, i) => { const y = toPanel(anchors[2 + i])[1]; return `<path class="z-level ${cls}" d="M4 ${f(y)}H${PANEL - 4}"/>`; }).join('');
    const label = levelEls + `<circle class="z-anchor ${cls}" cx="${f(A[0])}" cy="${f(A[1])}" r="2.5"/>`;
    return `<div class="plate z-wrap">${frame(z, role, vx, vy, s, inner, '', label)}</div>`;
  };
}
