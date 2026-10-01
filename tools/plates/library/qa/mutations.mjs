// LIB-3 planted mutations (plan 3.2: "each check turns red on a planted mutation"). One list, used by the vitest
// block (node checks) and by selftest.mjs (all, browser ones included). Each mutation names the check or flag it
// must turn red and the problem key prefix it must raise; the clean run of the same target must not raise it.
//   spec:      prepare(E, spec) -> arg (computed on the clean spec), then fn(spec, arg) runs inside a mirror's
//              exercises/<id>.mjs (wrapSpec) and the gallery is rebuilt with the vendored build-page.
//   candidate: apply(c) -> a changed candidate (fragments, card, research, census or derivation).
//   page:      css and/or html edits of the built page (browser checks only).
import { pathLength, pathsOf } from './markup.mjs';
import { boxOf } from './labels.mjs';

const clone = c => ({ ...c, plate: { ...c.plate, normal: { ...c.plate.normal }, mistake: { ...c.plate.mistake } } });
const firstTag = (s, re, f) => { const m = s.match(re); if (!m) throw new Error(`mutation: ${re} not found`); return s.replace(m[0], f(m[0])); };

/** A label ("text" key) of a normal render moved toward the figure until the engine first reports it on the ink,
 *  proving the step before is clean: the planted label sits exactly 1 px further than the last clean position. */
function onePxOntoFigure(E, spec, key) {
  const c = spec.callouts.find(x => x.key === key), base = E.renderPlate(spec, { id: 'mut-n' });
  const box = c.box ?? boxOf(base, key, c.text, 'callout');
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) for (let d = 1; d <= 60; d++) {
    const at = b => ({ ...spec, callouts: spec.callouts.map(x => (x.key === key ? { ...x, box: b } : x)) });
    const r = E.renderPlate(at({ left: box.left + dx * d, top: box.top + dy * d }), { id: 'mut-n' });
    const hit = r.report.issues.filter(i => i.startsWith(`figure:${c.text}`));
    const others = r.report.issues.filter(i => !i.startsWith(`figure:${c.text}`));
    if (others.length) break;   // this direction hits the edge or another label first
    if (hit.length) return { key, box: { left: box.left + dx * d, top: box.top + dy * d }, cleanAt: { left: box.left + dx * (d - 1), top: box.top + dy * (d - 1) } };
  }
  throw new Error(`mutation: no direction moves ${key} onto the figure`);
}

const SHIFT = (s, a) => SPEC_MUTATIONS[1].fn(s, a);
export const SPEC_MUTATIONS = [
  { id: 'M1 label 1 px onto the figure', check: 'PQ-H1', key: 'H1.engine:normal:figure:', target: 'pull-up',
    prepare: (E, s) => onePxOntoFigure(E, s, 'chin'),
    fn: (s, a) => ({ ...s, callouts: s.callouts.map(x => (x.key === a.key ? { ...x, box: a.box } : x)) }) },
  { id: 'M2 contact 1 cm off', check: 'PQ-H1', key: 'H1.engine:normal:check:', target: 'leg-press',
    // the seat-pan clearance check (`above`, tol 0.5 cm) moved 1 cm up its normal: the buttock now sits 1 cm in the pad
    prepare: (E, s) => {
      const i = s.checks.findIndex(k => k.above && k.landmark === 'buttock');
      if (i < 0) throw new Error('mutation: no buttock clearance check');
      if (!E.renderPlate(SHIFT(s, { i }), { id: 'mut-n' }).report.issues.some(x => /^check:\w+:buttock:below by/.test(x))) throw new Error('mutation: a 1 cm shift does not open the contact');
      return { i };
    },
    fn: (s, a) => ({ ...s, checks: s.checks.map((k, j) => { if (j !== a.i) return k; const L = Math.hypot(...k.above.normal), n = k.above.normal.map(v => v / L); return { ...k, above: { ...k.above, point: k.above.point.map((v, q) => v + n[q] * 0.01) } }; }) }) },
  { id: 'M3 Trace below the minimum', check: 'PQ-H3', key: 'H3.trace', target: 'lat-pulldown',
    prepare: (E, s, env) => { for (let t = 12; t < 200; t += 2) { const r = E.renderPlate({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, t] } }, { id: 'mut-n' }); const L = pathsOf(r.svg, 'trace').reduce((a, d) => a + pathLength(d), 0); if (L > 0 && L < env.traceLenMin) return { t, L }; } throw new Error('mutation: no trim gives a short Trace'); },
    fn: (s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } }) },
  { id: 'M4 Mistake equal to the end pose', check: 'PQ-H3', key: 'H3.mistake-outline', target: 'pull-up',
    prepare: () => null, fn: s => ({ ...s, mistake: { ...s.mistake, pose: {} } }) },
  { id: 'M5 start equal to the end pose', check: 'PQ-H3', key: 'H3.start-is-end', target: 'seated-cable-row',
    prepare: () => null, fn: s => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] } }) },
  { id: 'M6 a moving line part', check: 'PQ-H9', key: 'H9.moving-line:', target: 'hanging-leg-raise',
    prepare: () => null, fn: s => ({ ...s, equipment: [...s.equipment, (lm, ctx) => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.3, ctx.pose === 'mistake' ? -0.6 : -0.7], [0, 0.4, -0.7]] })] }) },
  { id: 'M7 an unknown equipment type', check: 'PQ-H9', key: 'H9.type:', target: 'hanging-leg-raise', specOnly: true,
    prepare: () => null, fn: s => ({ ...s, equipment: [...s.equipment, { type: 'rope3d', at: [0, 0, 0] }] }) },
  { id: 'M8 two renders differ', check: 'PQ-H7', key: 'H7.determinism:', target: 'leg-press',
    prepare: () => null, fn: s => { let n = 0; return { ...s, equipment: [...s.equipment, () => ({ type: 'line', cls: 'eq-thin', pts: [[0, 0.02, -0.9 - (n++ % 7) * 0.01], [0, 0.02, -1]] })] }; } },
  { id: 'F1 scale outside the approved range', flag: 'F1', target: 'leg-press',
    prepare: () => null, fn: s => ({ ...s, camera: { pxPerM: 160, x0: 150, y0: 345 } }) },
  { id: 'F4 more hand-boxed labels than approved', flag: 'F4', target: 'barbell-back-squat',
    prepare: (E, s) => { const n = E.renderPlate(s, { id: 'mut-n' }), m = E.renderPlate(s, { id: 'mut-m', mistake: true });
      return { c: Object.fromEntries(s.callouts.map(x => [x.key, x.box ?? boxOf(n, x.key, x.text)])), t: Object.fromEntries(s.mistake.tells.map(x => [x.key, x.box ?? boxOf(m, x.key, x.text)])) }; },
    fn: (s, a) => ({ ...s, callouts: s.callouts.map(x => ({ ...x, box: a.c[x.key] })), mistake: { ...s.mistake, tells: s.mistake.tells.map(x => ({ ...x, box: a.t[x.key] })) } }) },
  { id: 'F2 figure coverage below the approved range', flag: 'F2', target: 'leg-press', browser: true,
    prepare: () => null, fn: s => ({ ...s, camera: { pxPerM: 70, x0: 179, y0: 300 } }) },
];

export const CANDIDATE_MUTATIONS = [
  { id: 'M9 a colour literal', check: 'PQ-H2', key: 'H2.colour:', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.svg = firstTag(d.plate.normal.svg, /<path class="trace"/, t => `${t} fill="#e11d48"`); return d; } },
  { id: 'M10 a class the 8 never use', check: 'PQ-H2', key: 'H2.vocab:classes:glow', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.svg = d.plate.normal.svg.replace('<path class="trace"', '<path class="trace glow"'); return d; } },
  { id: 'M11 a duplicate id', check: 'PQ-H2', key: 'H2.ids:dup:', target: 'pull-up',
    apply: c => { const d = clone(c); const id = d.plate.normal.svg.match(/<path id="([^"]+)"/)[1]; d.article = d.article.replace('<button type="button" class="howto-pill mistake" id="pull-up-mistake"', `<button type="button" class="howto-pill mistake" id="${id}"`); return d; } },
  { id: 'M12 no Mistake pill', check: 'PQ-H2', key: 'H2.chrome:mistake-pill', target: 'pull-up',
    apply: c => ({ ...c, article: c.article.replace(/<button type="button" class="howto-pill mistake"[^]*?<\/button>/, '') }) },
  { id: 'M13 alt over 51 words', check: 'PQ-H2', key: 'H2.alt:alt', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.alt = `${d.plate.alt} ${'and more '.repeat(12).trim()}`; return d; } },
  { id: 'M14 a fact not drawn (angle 3° off)', check: 'PQ-H6', key: 'H6.fact:0:angle', target: 'pull-up',
    apply: c => ({ ...c, research: { plateFacts: [{ kind: 'angle', measure: true, deg: c.spec.measure.expect + 3 }], tempo: c.spec.tempo, topFault: null } }) },
  { id: 'M15 tempo differs from the card', check: 'PQ-H6', key: 'H6.tempo', target: 'pull-up',
    apply: c => ({ ...c, research: { plateFacts: [], tempo: c.spec.tempo.map((p, i) => (i === 0 ? { ...p, s: p.s + 1 } : p)), topFault: null } }) },
  { id: 'M16 chunk over 150 KB', check: 'PQ-H7', key: 'H7.chunk-raw', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.svg = d.plate.normal.svg.replace('</defs>', `<path id="pull-up-n-pad" d="M${Array.from({ length: 16000 }, (_, i) => `${i % 358} ${(i * 7) % 358}`).join('L')}"/></defs>`); return d; } },
  { id: 'M17 S0 over 700 elements', check: 'PQ-H7', key: 'H7.s0', target: 'pull-up',
    apply: c => ({ ...c, article: c.article.replace('<p class="cue-line"', `${'<i></i>'.repeat(700)}<p class="cue-line"`) }) },
  { id: 'M18 a 4-word callout', check: 'PQ-H8', key: 'H8.words:normal.chin.label', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.overlay = d.plate.normal.overlay.replace('>Chin over bar</button>', '>Chin well over bar</button>'); return d; } },
  { id: 'M19 a medical claim', check: 'PQ-H8', key: 'H8.ban:normal.chin.cue:heal', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.overlay = d.plate.normal.overlay.replace('data-cue="From straight arms', 'data-cue="This heals the shoulder. From straight arms'); return d; } },
  { id: 'M20 a semicolon in a cue', check: 'PQ-H8', key: 'H8.ban:mistake.kick.cue:semicolon', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.mistake.overlay = d.plate.mistake.overlay.replace('The legs kick to swing the body up.', 'The legs kick; the body swings up.'); return d; } },
  { id: 'M21 a raw-spec override', check: 'PQ-H10', key: 'H10.raw:poses', target: 'pull-up',
    apply: c => ({ ...c, id: 'lib_chin_up', mode: 'D', derivation: derivation(c, { poses: {} }) }) },
  { id: 'M22 a key outside PARAMS', check: 'PQ-H10', key: 'H10.unknown:gripWidth', target: 'pull-up',
    apply: c => ({ ...c, id: 'lib_chin_up', mode: 'D', derivation: derivation(c, { gripWidth: 0.5 }) }) },
  { id: 'M23 parent not rebuilt byte for byte', check: 'PQ-H10', key: 'H10.byte:normalSvg', target: 'pull-up',
    apply: c => ({ ...c, id: 'lib_chin_up', mode: 'D', derivation: { ...derivation(c, {}), rebuildParent: async () => ({ ...fragments(c), normalSvg: 'x' }) } }) },
  { id: 'F3 a leader longer than approved', flag: 'F3', target: 'pull-up',
    apply: c => { const d = clone(c); d.plate.normal.svg = firstTag(d.plate.normal.svg, /<path class="leader" d="[^"]+"/, t => t.replace(/d="M([\d.]+) ([\d.]+)L[^"]+"/, (_, x, y) => `d="M${x} ${y}L${+x + 100} ${y}"`)); return d; } },
  { id: 'F6 view differs from the census', flag: 'F6', target: 'pull-up', apply: c => ({ ...c, census: { view: 'front' } }) },
  { id: 'F7 the Mistake is not the top fault', flag: 'F7', target: 'pull-up',   // control: the same card with the drawn fault on top
    control: c => ({ ...c, mistakeFault: 'kick', research: { plateFacts: [], tempo: c.spec?.tempo, topFault: 'kick' } }),
    apply: c => ({ ...c, mistakeFault: 'kick', research: { plateFacts: [], tempo: c.spec?.tempo, topFault: 'short' } }) },
];

/** The 9 GOLDEN fragments of an extracted plate, as LIB-2's derive proof compares them (golden.mjs fragmentsOf input). */
export const fragments = c => ({ normalSvg: c.plate.normal.svg, normalOverlay: c.plate.normal.overlay, mistakeSvg: c.plate.mistake.svg, mistakeOverlay: c.plate.mistake.overlay,
  tells: c.plate.tells, tempo: c.plate.tempo, cues: JSON.stringify({ n: c.plate.normal.cues, m: c.plate.mistake.cues }), alt: c.plate.alt, mistakeAlt: c.plate.mistakeAlt });
/** A test-double derivation: a D plate whose parent is `c` itself (LIB-2 supplies the real derive()). */
export const derivation = (c, params) => ({ params, schema: { grip: { enum: ['over', 'under'] }, lean: { type: 'number', min: 0, max: 20 } }, parentFragments: fragments(c), rebuildParent: async () => fragments(c) });

export const PAGE_MUTATIONS = [
  { id: 'B1 Inter not loaded', check: 'PQ-H1', key: 'H1.font', target: 'pull-up', html: h => h.replace(/<link[^>]+fonts\.googleapis\.com[^>]*>/g, '') },
  { id: 'B2 horizontal scroll', check: 'PQ-H1', key: 'H1.hscroll:', target: 'pull-up', css: 'body::after { content: ""; display: block; width: 700px; height: 1px; }' },
  { id: 'B3 a label text box on the figure', check: 'PQ-H1', key: 'H1.ink:normal:chin', target: 'pull-up',
    html: h => h.replace('id="pull-up-n-chin" data-key="chin" data-cue="From straight arms, pull until the chin clears the bar, chest toward it." class="plate-callout" style="left:45.81%;top:5.87%"', 'id="pull-up-n-chin" data-key="chin" data-cue="From straight arms, pull until the chin clears the bar, chest toward it." class="plate-callout" style="left:30%;top:22%"') },
  { id: 'B4 a callout hit box under 44 px', check: 'PQ-H4', key: 'H4.small:normal:', target: 'pull-up', css: '#card-pull-up .plate-callout { min-height: 30px; }' },
  { id: 'B5 two callout hit boxes overlap', check: 'PQ-H4', key: 'H4.overlap:normal:', target: 'pull-up',
    html: h => h.replace('class="plate-callout" style="left:54.75%;top:39.11%"', 'class="plate-callout" style="left:45.81%;top:10%"') },
  { id: 'B6 text leaves the plate', check: 'PQ-H4', key: 'H4.outside:', target: 'pull-up',
    html: h => h.replace('class="plate-callout" style="left:54.75%;top:39.11%"', 'class="plate-callout" style="left:88%;top:39.11%"') },
  { id: 'B7 tempo strip overflows', check: 'PQ-H4', key: 'H4.tempo:', target: 'pull-up', css: '#card-pull-up .tempo-label { min-width: 160px; }' },
  { id: 'B8 Trace contrast below the approved minimum', check: 'PQ-H5', key: 'H5.contrast:', target: 'pull-up', css: '#card-pull-up .plate .trace { stroke: var(--surface-2); }' },
  { id: 'F5 label text below 4.5:1', flag: 'F5', target: 'pull-up', css: '#card-pull-up .plate .plate-callout { color: var(--border-subtle); }' },
];
