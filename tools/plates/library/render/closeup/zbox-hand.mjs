// LIB-6 zbox shell: the hand zoom. The engine's Right/Wrong pair (renderHandPair), then named edit steps the engine
// can't express yet, picked by an exercise's options (hand.steps, in order). Each step reads its own trigger from the
// howto data where golden B did (loadLine, rightLoad, surface, inset). String edits are golden B's, verbatim.
import { renderHandPair, renderHand } from '../../../layers/engine/hand.mjs';
import { f } from './zbox-geometry.mjs';

// loadLine 'guide': drop the force arrow and the tick where it crosses the wrist; keep the dashed forearm line and the
// contact dot.
const asGuide = svg => svg.replace(/<path class="h-load" d="[^"]*"\/>/g, '').replace(/<path class="h-load-head" d="[^"]*"\/>/g, '').replace(/<path class="h-tick" d="[^"]*"\/>/g, '');
const WRONG = '<g class="h-panel wrong">';
const DEG_VAL = /<text class="h-val m" x="[\d.-]+" y="[\d.-]+" text-anchor="\w+">(\d+°)<\/text>/;

/** Pose merge: b over a, with the named sub-objects merged one level down (golden B's merge, generalised). */
export const mergePose = parts => (a, b) => ({ ...a, ...b, ...Object.fromEntries(parts.map(k => [k, { ...a[k], ...(b[k] ?? {}) }])) });

// Pull one panel group out of the pair SVG, edit it, put it back.
function editPanel(svg, which, fn) {
  const open = `<g class="h-panel ${which}">`, i = svg.indexOf(open);
  let depth = 0, j = i;
  for (const m of svg.slice(i).matchAll(/<g\b|<\/g>/g)) { depth += m[0] === '</g>' ? -1 : 1; if (depth === 0) { j = i + m.index + 4; break; } }
  return svg.slice(0, i) + fn(svg.slice(i, j)) + svg.slice(j);
}

// The knee the wrong hand presses on, where the engine drew a handle section: the thigh as one limb coming in from the
// wrist side and ending in a rounded knee (the engine's contact circle), a kneecap line and a KNEE label, clipped to
// the wrong panel.
function kneeFor(panel, clipRect, o) {
  const m = panel.match(/<circle class="h-eq" cx="([\d.-]+)" cy="([\d.-]+)" r="([\d.-]+)"\/>/);
  const [cx, cy, r] = m.slice(1).map(Number);
  const wx = +panel.match(/<circle class="h-joint wrist" cx="([\d.-]+)"/)[1];
  const sg = wx < cx ? -1 : 1;
  const edge = sg < 0 ? clipRect[0] - 2 : clipRect[0] + clipRect[2] + 2;
  const top = cy - r, bot = cy + r, sw = sg < 0 ? 1 : 0;
  const d = `M${f(edge)} ${f(top)}L${f(cx)} ${f(top)}A${f(r)} ${f(r)} 0 0 ${sw} ${f(cx)} ${f(bot)}L${f(edge)} ${f(bot)}`;
  const cap = `M${f(cx - sg * r * 0.15)} ${f(cy - r * 0.62)}A${f(r * 0.62)} ${f(r * 0.62)} 0 0 ${sw} ${f(cx - sg * r * 0.15)} ${f(cy + r * 0.62)}`;
  const ly = Math.min(bot + o.labelDrop, clipRect[1] + clipRect[3] - 8);
  const label = `<text class="h-note lp-knee-t" x="${f(cx)}" y="${f(ly)}" text-anchor="middle">${o.label}</text>`;
  return { svg: `<g clip-path="url(#lp-knee-clip)"><path class="lp-leg-fill" d="${d}Z"/><path class="lp-leg" d="${d}"/><path class="lp-leg thin" d="${cap}"/>${label}</g>`,
    clip: `<clipPath id="lp-knee-clip"><rect x="${clipRect[0]}" y="${clipRect[1]}" width="${clipRect[2]}" height="${clipRect[3]}"/></clipPath>`, knee: { cx: f(cx), cy: f(cy), r: f(r) } };
}

/** step name -> (state { main, inset }, ctx { zoom, howto, esc, I }, o) => void (edits state). */
export const HAND_STEPS = {
  // move the wrong panel's bend value off the thumb: under the wrist (o.dx, o.dy from the wrist joint), left-aligned
  'bend-label': (st, c, o) => {
    let svg = st.main;
    const i = svg.indexOf(WRONG);
    const wj = svg.slice(i).match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/);
    if (i >= 0 && wj) svg = svg.replace(DEG_VAL, (m0, v) => `<text class="h-val m" x="${f(+wj[1] + o.dx)}" y="${f(+wj[2] + o.dy)}" text-anchor="start">${v}</text>`);
    st.main = svg;
  },
  // zoom.hand.loadLine.right === 'guide': the Right half keeps the forearm line but loses the force arrow and tick
  'load-guide': (st, c) => {
    if ((c.zoom.hand.loadLine ?? {}).right !== 'guide') return;
    const [a, b] = st.main.split(WRONG);
    st.main = asGuide(a) + WRONG + b;
  },
  // zoom.hand.rightLoad === false: the Right hand only holds (no load line, arrowhead, contact dot or wrist tick)
  'hold-only': (st, c) => {
    if (c.zoom.hand.rightLoad !== false) return;
    st.main = editPanel(st.main, 'right', g => g.replace(/<path class="h-(load|load-head|tick)"[^>]*\/>|<circle class="h-contact"[^>]*\/>/g, ''));
  },
  // zoom.hand.surface === 'knee': the Wrong hand presses on a knee, not a handle; the two values move clear of it
  'knee-surface': (st, c, o) => {
    if (c.zoom.hand.surface !== 'knee') return;
    let svg = st.main, knee = null;
    svg = svg.replace(/<path id="hz-w-(ring|gap0|gap1|web)" d="[^"]*"\/>/g, (s, n) => `<path id="hz-w-${n}" d=""/>`);
    const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number), pw = (vb[0] - 16) / 2;
    svg = editPanel(svg, 'wrong', g => {
      knee = kneeFor(g, [f(pw + 16), o.clipTop, f(pw), f(vb[1] - o.clipTop)], o);
      return g.replace(/<circle class="h-eq"[^>]*\/>|<circle class="h-eq-core"[^>]*\/>|<path class="h-eq-core"[^>]*\/>/g, '')
        .replace(WRONG, `${WRONG}${knee.svg}`);
    });
    svg = svg.replace('<defs>', `<defs>${knee.clip}`);
    const wj = svg.split(WRONG)[1].match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/).slice(1).map(Number);
    svg = svg.replace(DEG_VAL, (m0, v) =>
      `<text class="h-val m" x="${f(wj[0] + o.bendDx)}" y="${f(knee.knee.cy - knee.knee.r + o.bendBelowKneeTop)}" text-anchor="start">${v}</text>`);
    const wrongG = svg.split(WRONG)[1];
    const ax = +wrongG.match(/<path class="h-load m" d="M([\d.-]+) /)[1];
    svg = svg.replace(/<text class="h-val m" x="[\d.-]+" y="[\d.-]+" text-anchor="\w+">([\d.]+ cm)<\/text>/, (m0, v) =>
      `<text class="h-val m" x="${f(ax + o.leverDx)}" y="${f(wj[1] - o.leverLift)}" text-anchor="start">${v}</text>`);
    st.main = svg;
  },
  // zoom.hand.inset: an option hand under the pair (same right pose, inset pose), rendered at o.size, cropped to
  // inset.crop (hand-frame mm) with the hidden bar edge redrawn dashed, plus its label and one line of text
  'option-inset': (st, c, o) => {
    const { zoom, howto, esc, I } = c, hs = howto.handling, ins = zoom.hand.inset, ll = zoom.hand.loadLine ?? {}, big = o.size;
    const r = renderHand(c.merge(zoom.hand.right, ins.drawPose ?? ins.pose), { width: big, height: big, uid: o.uid, role: 'right', loadAxis: hs.loadAxis,
      alt: `${ins.label}. ${o.alt}` });
    let isvg = ll.inset === 'guide' ? asGuide(r.svg) : r.svg;
    if (ins.crop) {
      const w = isvg.match(/<circle class="h-joint wrist" cx="([-\d.]+)" cy="([-\d.]+)"/), k = r.report.scalePxPerMm, wx = +w[1], wy = +w[2];
      const x0 = wx - ins.crop.v[1] * k, x1 = wx - ins.crop.v[0] * k, y0 = wy - ins.crop.u[1] * k, y1 = wy - ins.crop.u[0] * k;
      isvg = isvg.replace(/viewBox="0 0 \d+ \d+"/, `viewBox="${f(x0)} ${f(y0)} ${f(x1 - x0)} ${f(y1 - y0)}"`)
        .replace('class="hand-svg"', 'class="hand-svg inset-crop"');
      const bar = isvg.match(/<circle class="h-eq" cx="([-\d.]+)" cy="([-\d.]+)" r="([-\d.]+)"/);
      isvg = isvg.replace(/<\/svg>$/, `<circle class="h-eq-hidden" cx="${bar[1]}" cy="${bar[2]}" r="${bar[3]}"/></svg>`);
    }
    st.inset = `<div class="opt"><div class="opt-fig">${isvg}</div><div class="opt-txt"><span class="eyebrow">${esc(ins.label)}</span>`
      + `<p><span class="ok">${I.check(16)}</span><span>${esc(ins.when)}</span></p></div></div>`;
  },
};

/** The hand zoom box content: { main, inset } (inset '' when none). o = options.hand. */
export function handZoom(zoom, howto, o, esc, I) {
  const hs = howto.handling, merge = mergePose(o.mergeParts), fault = zoom.hand.wrong[0], wrongPose = merge(zoom.hand.right, fault.pose);
  const pair = renderHandPair({ camera: zoom.hand.camera, loadAxis: o.loadAxis ?? hs.loadAxis, markers: fault.markers, right: zoom.hand.right, wrong: wrongPose,
    rightNote: zoom.hand.notes.right, wrongNote: zoom.hand.notes.wrong, alt: zoom.alt, uid: 'hz', panelHeight: zoom.hand.panelHeight });
  const st = { main: pair.svg, inset: '' }, c = { zoom, howto, esc, I, merge };
  for (const [name, so] of o.steps) {
    const step = HAND_STEPS[name];
    if (!step) throw new Error(`zbox hand: unknown step ${name}`);
    step(st, c, so ?? {});
  }
  return st;
}
