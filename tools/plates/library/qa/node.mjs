// LIB-3 node checks (plan 3.2, 3.3): PQ-H1 (engine report), H2, H3, H6, H7, H8, H9, H10 and flags F1, F3, F4, F6,
// F7. The browser half (H1 boxes, H4, H5, F2, F5) is browser.mjs. Every check returns { id, problems } where each
// problem is { key, text }; `key` is what a named exemption of one of the 8 must equal (exemptions.json).
import { gzipSync } from 'node:zlib';
import { BANNED } from '../../layers/artifact/copy-lint.mjs';
import { moduleText, viewOf } from '../../gen/plates.mjs';
import { pathLength, pathsOf, tags, unesc, vocabularyOf, words } from './markup.mjs';
import { REF_CHROME, equipmentItems, poseLandmarks, cameraOf, resolvePoint } from './engine.mjs';

/** Medical-claim bans for new plate copy (content.md 4, "Medical-claim bans"). */
export const MEDICAL = [
  ['cure', /\bcur(e|es|ed|ing)\b/i], ['heal', /\bheal(s|ed|ing)?\b/i], ['treat', /\btreat(s|ed|ing)?\b/i],
  ['rehab', /\brehab\w*/i], ['diagnose', /\bdiagnos\w*/i], ['injury-proof', /\binjury[- ]proof\b/i], ['prevents injury', /\bprevents? injur\w*/i],
];
/** Spec keys a D/T derivation may never set through PARAMS (the raw-spec escape hatch, plan 3.1). */
export const RAW_SPEC_KEYS = ['spec', 'raw', 'override', 'poses', 'equipment', 'callouts', 'mistake', 'camera', 'trace', 'measure', 'checks', 'datum', 'ghosts', 'tempo', 'alt', 'view'];
export const LIMITS = { labelWords: [1, 3], cueWords: 15, chunkRaw: 150 * 1024, chunkGz: 36 * 1024, s0: 700, angleDeg: 2, cm: 1, tells: [1, 3], callouts: [1, 3] };

const P = (key, text) => ({ key, text });
const isEngine = c => !!c.spec;

/** All renders the plate ships: normal, mistake, and the normal render with each guided callout selected. */
export function rendersOf(c, E) {
  if (!isEngine(c)) return null;
  const pre = c.plate.prefix, r = { normal: E.renderPlate(c.spec, { id: `${pre}-n` }) };
  if (c.spec.mistake) r.mistake = E.renderPlate(c.spec, { id: `${pre}-m`, mistake: true });
  for (const k of (c.spec.callouts ?? []).filter(x => x.guide).map(x => x.key)) r[`selected:${k}`] = E.renderPlate(c.spec, { id: `${pre}-n`, selected: k });
  return r;
}

// ---------------------------------------------------------------- PQ-H1 (engine half) ----
export function h1Engine(c, R, renderError = null) {
  if (renderError) return [P('H1.engine:render-threw', `the engine refused to render: ${renderError}`)];
  if (!R) return [P('H1.engine:not-engine', 'no engine report: the plate is not drawn by the engine')];
  const out = [];
  for (const [name, r] of Object.entries(R)) for (const i of r.report.issues) out.push(P(`H1.engine:${name}:${i}`, `${name}: ${i}`));
  return out;
}

// ---------------------------------------------------------------- PQ-H2 ----
const COLOUR_ATTRS = ['fill', 'stroke', 'stop-color', 'color', 'flood-color', 'lighting-color'];
const COLOUR_OK = /^(none|currentColor|url\(#[\w-]+\))$/;
const HEX = /#[0-9a-fA-F]{3,8}(?![\w-])/g;
const FN_COLOUR = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i;
const STYLE_COLOUR = /(^|;)\s*(fill|stroke|color|background|background-color|stop-color|border-color|outline-color)\s*:/i;
const MASK = /(<mask\b[^>]*>)([\s\S]*?)<\/mask>/g;   // [1] the mask tag (scanned with the rest), [2] its content

// Colour literals in one stretch of markup; `ok` is the literals allowed there (the mask's #fff/#000, nothing elsewhere).
function colourScan(markup, where, ok, inMask) {
  const out = [], at = inMask ? ' in the mask (only #fff/#000)' : '';
  for (const h of markup.match(HEX) ?? []) if (!ok.includes(h)) out.push(P(`H2.colour:${where}:${h}`, `${where}: colour literal ${h}${at}`));
  if (FN_COLOUR.test(markup)) out.push(P(`H2.colour:${where}:fn`, `${where}: a colour function${at}`));
  for (const t of tags(markup)) {
    for (const a of COLOUR_ATTRS) if (t.attrs.has(a) && !COLOUR_OK.test(t.attrs.get(a)) && !ok.includes(t.attrs.get(a))) out.push(P(`H2.colour:${where}:${a}=${t.attrs.get(a)}`, `${where}: <${t.name} ${a}="${t.attrs.get(a)}">${at}`));
    if (STYLE_COLOUR.test(t.attrs.get('style') ?? '')) out.push(P(`H2.colour:${where}:style`, `${where}: a colour in style="${t.attrs.get('style')}"${at}`));
  }
  return out;
}

export function colourProblems(markup, where) {
  const out = [];
  for (const [, , inner] of markup.matchAll(MASK)) out.push(...colourScan(inner, where, ['#fff', '#000'], true));
  out.push(...colourScan(markup.replace(MASK, '$1</mask>'), where, [], false));
  if (/var\(/.test(markup)) out.push(P(`H2.var:${where}`, `${where}: var( in plate markup`));
  return out;
}

export function h2(c, ctx) {
  const p = c.plate, out = [], V = ctx.vocabulary;
  for (const [where, m] of [['normalSvg', p.normal.svg], ['normalOverlay', p.normal.overlay], ['mistakeSvg', p.mistake.svg], ['mistakeOverlay', p.mistake.overlay]]) {
    let v;
    try { v = vocabularyOf(m); } catch (e) { out.push(P(`H2.markup:${where}`, `${where}: ${e.message}`)); continue; }
    for (const [k, set] of [['elements', v.elements], ['attributes', v.attributes], ['classes', v.classes]])
      for (const x of set) if (!V[k].includes(x)) out.push(P(`H2.vocab:${k}:${x}`, `${where}: ${k.slice(0, -1)} "${x}" is not used by the 8`));
    out.push(...colourProblems(m, where));
  }
  // ids: prefixed by the slug, under -n- / -m-, unique across the card
  if (p.prefix !== c.chromeId) out.push(P(`H2.ids:prefix:${p.prefix}`, `svg id prefix ${p.prefix} is not the slug ${c.chromeId}`));
  const seen = new Map();
  for (const t of tags(c.article)) { const id = t.attrs.get('id'); if (id != null) seen.set(id, (seen.get(id) ?? 0) + 1); }
  for (const [id, n] of seen) if (n > 1) out.push(P(`H2.ids:dup:${id}`, `id ${id} used ${n} times`));
  for (const [svg, m] of [[p.normal.svg, 'n'], [p.mistake.svg, 'm']]) for (const t of tags(svg)) {
    const id = t.attrs.get('id'); if (id != null && !id.startsWith(`${p.prefix}-${m}-`)) out.push(P(`H2.ids:scope:${id}`, `svg id ${id} is not under ${p.prefix}-${m}-`));
  }
  // chrome shape
  const nC = p.normal.cues.length, nT = p.mistake.cues.length;
  if (nC < LIMITS.callouts[0] || nC > LIMITS.callouts[1]) out.push(P('H2.chrome:callouts', `${nC} callouts (1-3)`));
  if (nT < LIMITS.tells[0] || nT > LIMITS.tells[1]) out.push(P('H2.chrome:tells', `${nT} tells (1-3)`));
  const tellItems = (p.tells.match(/<li>/g) ?? []).length;
  if (tellItems !== nT) out.push(P('H2.chrome:tell-list', `${tellItems} tell rows for ${nT} tells`));
  if (!/^<div class="tempo" role="img" aria-label="Tempo: [^"]+">/.test(p.tempo)) out.push(P('H2.chrome:tempo', 'no tempo strip'));
  const id = c.chromeId;
  if (!c.article.includes(`<button type="button" class="howto-pill" id="${id}-trace" aria-pressed="false"`)) out.push(P('H2.chrome:trace-pill', 'no Trace pill'));
  if (!c.article.includes(`<button type="button" class="howto-pill mistake" id="${id}-mistake" aria-pressed="false">Mistake</button>`)) out.push(P('H2.chrome:mistake-pill', 'no Mistake pill'));
  for (const [k, s] of [['alt', p.alt], ['mistakeAlt', p.mistakeAlt]]) if (words(s) > ctx.envelope.altWordsMax) out.push(P(`H2.alt:${k}`, `${k} has ${words(s)} words (max ${ctx.envelope.altWordsMax})`));
  return out;
}

// ---------------------------------------------------------------- PQ-H3 ----
export function nodeMetrics(c, ctx, R) {
  const p = c.plate, m = {};
  m.traceLen = pathsOf(p.normal.svg, 'trace').reduce((a, d) => a + pathLength(d), 0);
  m.leaderMax = Math.max(0, ...[p.normal.svg, p.mistake.svg].flatMap(s => pathsOf(s, 'leader').map(pathLength)));
  m.altWords = Math.max(words(p.alt), words(p.mistakeAlt));
  if (R) {
    m.pxPerM = R.normal.report.camera.pxPerM;
    m.boxed = [...(c.spec.callouts ?? []), ...(c.spec.mistake?.tells ?? []), ...(c.spec.measure ? [c.spec.measure] : [])].filter(x => x.box).length;
    m.deviation = deviation(c, ctx.engine, R);
  }
  return m;
}

/** Largest move (px) of a tell anchor from the end pose to the mistake pose. */
export function deviation(c, E, R) {
  if (!c.spec.mistake?.pose) return 0;
  const L = poseLandmarks(E, c.spec), cam = cameraOf(c.spec, R.normal.report);
  let best = 0;
  for (const t of c.spec.mistake.tells ?? []) {
    const a = resolvePoint(t.anchor, 'mistake', L.lm, cam), b = resolvePoint(t.anchor, 'end', L.lm, cam);
    best = Math.max(best, Math.hypot(a[0] - b[0], a[1] - b[1]));
  }
  return best;
}

export function h3(c, ctx, R, M) {
  const out = [], p = c.plate, env = ctx.envelope;
  if (!(M.traceLen >= env.traceLenMin)) out.push(P('H3.trace', `Trace ${M.traceLen.toFixed(1)} px < the shortest approved ${env.traceLenMin.toFixed(1)} px`));
  if (!/<g class="pose-start"><g/.test(p.normal.svg)) out.push(P('H3.start-is-end', 'start = end: nothing moves (empty pose-start layer)'));
  if (!/<g class="m-pose" mask="url\(#[\w-]+\)"><g class="u-stroke"><use /.test(p.mistake.svg)) out.push(P('H3.mistake-outline', 'Mistake outline is empty'));
  if (!R) out.push(P('H3.deviation:not-engine', 'no tell-anchor deviation: the plate is not drawn by the engine'));
  else if (!(M.deviation >= env.deviationMin)) out.push(P('H3.deviation', `largest tell-anchor deviation ${M.deviation.toFixed(1)} px < the smallest approved ${env.deviationMin.toFixed(1)} px`));
  return out;
}

// ---------------------------------------------------------------- PQ-H6 ----
const angleOf = (angles, pose, joint) => {   // 'knee.r' -> number; 'hip.r.flex' -> the flex part of 'flex 80 abd 0'
  const parts = joint.split('.'), base = parts.slice(0, 2).join('.'), v = angles?.[pose]?.[base] ?? angles?.[pose]?.[parts[0]];
  if (typeof v === 'number') return v;
  if (typeof v === 'string' && parts[2]) { const m = v.match(new RegExp(`\\b${parts[2]} (-?[\\d.]+)`)); return m ? +m[1] : null; }
  return null;
};
export function h6(c, ctx, R) {
  if (!R) return [P('H6:not-engine', 'no engine report to match research facts against')];
  const r = c.research;
  if (!r || !Array.isArray(r.plateFacts)) return [P('H6:no-card', 'no verified card plate facts')];
  const out = [], rep = R.normal.report, L = poseLandmarks(ctx.engine, c.spec);
  for (const [i, f] of r.plateFacts.entries()) {
    const tag = `H6.fact:${i}:${f.kind}:${f.joint ?? f.landmark ?? ''}`;
    if (f.kind === 'angle') {
      const viaAngles = f.joint ? angleOf(rep.angles, f.pose ?? 'end', f.joint) : null;
      const okAngles = viaAngles != null && Math.abs(viaAngles - f.deg) <= LIMITS.angleDeg;
      const okMeasure = f.measure === true && c.spec.measure?.expect != null && Math.abs(c.spec.measure.expect - f.deg) <= LIMITS.angleDeg && Math.abs(rep.measure.drawnDeg - f.deg) <= LIMITS.angleDeg;
      if (!okAngles && !okMeasure) out.push(P(tag, `angle fact ${f.joint ?? 'measure'} ${f.deg}° has no matching measure.expect or angles value within ±${LIMITS.angleDeg}° (drawn ${viaAngles ?? rep.measure?.drawnDeg})`));
    } else if (f.kind === 'contact') {
      const hits = rep.checks.filter(k => k.landmark === f.landmark && (!f.pose || k.pose === f.pose) && k.cm != null);
      if (!hits.length || hits.some(k => k.cm > LIMITS.cm)) out.push(P(tag, `contact fact ${f.landmark} has no checks entry within ±${LIMITS.cm} cm (${hits.map(k => `${k.pose} ${k.cm} cm`).join(', ') || 'none'})`));
    } else if (f.kind === 'height') {
      const w = L.lm[f.pose ?? 'end']?.[f.landmark];
      const dCm = w ? Math.abs(w[1] - f.m) * 100 : Infinity;
      if (!(dCm <= LIMITS.cm)) out.push(P(tag, `height fact ${f.landmark} ${f.m} m is drawn ${w ? w[1].toFixed(3) : '?'} m (±${LIMITS.cm} cm)`));
    } else out.push(P(tag, `unknown plate fact kind ${f.kind}`));
  }
  if (JSON.stringify(r.tempo) !== JSON.stringify(c.spec.tempo)) out.push(P('H6.tempo', `tempo ${JSON.stringify(c.spec.tempo)} != the card's ${JSON.stringify(r.tempo)}`));
  return out;
}

// ---------------------------------------------------------------- PQ-H7 ----
export function s0Elements(article) {
  const fig = article.match(/<figure class="plate" data-mode="mistake" hidden>[\s\S]*?<\/figure>/);
  return tags(article).length - (fig ? tags(fig[0]).length : 0);
}
export function chunkBytes(c) {
  const p = c.plate, text = moduleText(c.id, p, { fragments: {} }, '0'.repeat(64));
  return { raw: Buffer.byteLength(text), gz: gzipSync(text, { level: 9 }).length };
}
export function h7(c, ctx, R) {
  const out = [];
  if (R) {
    const again = rendersOf(c, ctx.engine);
    for (const k of Object.keys(R)) for (const f of ['svg', 'overlay']) if (R[k][f] !== again[k]?.[f]) out.push(P(`H7.determinism:${k}.${f}`, `two renders of ${k} differ in ${f}`));
  }
  const b = chunkBytes(c);
  if (b.raw > LIMITS.chunkRaw) out.push(P('H7.chunk-raw', `chunk ${b.raw} B raw > ${LIMITS.chunkRaw}`));
  if (b.gz > LIMITS.chunkGz) out.push(P('H7.chunk-gz', `chunk ${b.gz} B gz > ${LIMITS.chunkGz}`));
  const s0 = s0Elements(c.article);
  if (s0 > LIMITS.s0) out.push(P('H7.s0', `S0 ${s0} elements > ${LIMITS.s0}`));
  return out;
}
/** Two page builds byte-identical (LIB-2's builder, or the HT-1 gallery build for the 8). */
export async function h7Builds(c, rebuild) {
  const a = await rebuild(), b = await rebuild();
  return a === b ? [] : [P('H7.determinism:build', 'two builds of the card differ')];
}

// ---------------------------------------------------------------- PQ-H8 ----
const buttonText = overlay => [...overlay.matchAll(/<button [^>]*data-key="([^"]+)" data-cue="([^"]*)"[^>]*>([\s\S]*?)<\/button>/g)].map(m => ({ key: m[1], cue: unesc(m[2]), text: unesc(m[3]) }));
/** Every user-facing string of a plate: [{ where, text, label?, cue? }]. */
export function plateStrings(p) {
  const out = [];
  for (const [mode, f] of [['normal', p.normal], ['mistake', p.mistake]]) for (const b of buttonText(f.overlay)) {
    out.push({ where: `${mode}.${b.key}.label`, text: b.text, label: true });
    out.push({ where: `${mode}.${b.key}.cue`, text: b.cue, cue: true });
  }
  const arc = p.normal.overlay.match(/<span class="plate-arc-label"[^>]*><b>([^<]*)<\/b><span>([^<]*)<\/span><\/span>/);
  if (arc) { out.push({ where: 'arc.title', text: unesc(arc[1]) }); out.push({ where: 'arc.value', text: unesc(arc[2]) }); }
  for (const m of p.tempo.matchAll(/<div class="tempo-label"><b>([^<]*)<\/b>/g)) out.push({ where: `tempo.${m[1]}`, text: unesc(m[1]) });
  out.push({ where: 'alt', text: p.alt }, { where: 'mistakeAlt', text: p.mistakeAlt });
  return out;
}
export function h8(c, ctx) {
  const out = [], exempt = ctx.approvedStrings?.get(c.id) ?? new Set(), approved = c.mode === 'approved';
  for (const s of plateStrings(c.plate)) {
    if (approved && exempt.has(s.text)) continue;
    const plain = s.text.replace(/<br\s*\/?>/g, ' ');
    if (s.label) { const n = words(plain); if (n < LIMITS.labelWords[0] || n > LIMITS.labelWords[1]) out.push(P(`H8.words:${s.where}`, `${s.where} "${plain}" has ${n} words (1-3)`)); }
    if (s.cue && words(plain) > LIMITS.cueWords) out.push(P(`H8.words:${s.where}`, `${s.where} has ${words(plain)} words (max ${LIMITS.cueWords})`));
    for (const [rule, re] of [...BANNED, ...MEDICAL]) if (re.test(plain)) out.push(P(`H8.ban:${s.where}:${rule}`, `${s.where} "${plain}": ${rule}`));
  }
  return out;
}

// ---------------------------------------------------------------- PQ-H9 ----
export function h9(c, ctx, R) {
  if (!c.spec) return [P('H9:not-engine', 'no engine spec: equipment rules cannot be checked')];
  const out = [];
  for (const [i, e] of (c.spec.equipment ?? []).entries()) if (typeof e !== 'function') for (const one of [].concat(e)) if (!ctx.engine.PRIMITIVES[one?.type]) out.push(P(`H9.type:eq${i}:${one?.type}`, `equipment ${i}: type ${one?.type} is not a PRIMITIVES type`));
  if (!R || !c.spec.mistake) return out;   // no render (H1 reports why) or no Mistake pose
  const it = equipmentItems(ctx.engine, c.spec, R.normal.report);
  for (const pose of ['end', 'mistake']) for (const [k, v] of it[pose] ?? []) if (v.unknown) out.push(P(`H9.type:${k}`, `${pose}: ${k} is not a PRIMITIVES type`));
  const keys = new Set([...(it.end?.keys() ?? []), ...(it.mistake?.keys() ?? [])]);
  for (const k of keys) {
    const a = it.end?.get(k), b = it.mistake?.get(k), any = a ?? b;
    if (any.unknown || any.z === 'floor') continue;
    if (a?.d === b?.d) continue;
    if ((a && !a.poly) || (b && !b.poly)) out.push(P(`H9.moving-line:${k}`, `${k} (${any.type}, class ${any.cls}) moves between end and Mistake but has no poly`));
  }
  return out;
}

// ---------------------------------------------------------------- PQ-H10 ----
const FRAG_KEYS = ['normalSvg', 'normalOverlay', 'mistakeSvg', 'mistakeOverlay', 'tells', 'tempo', 'cues', 'alt', 'mistakeAlt'];
export function validateParams(params, schema) {
  const out = [];
  for (const [k, v] of Object.entries(params ?? {})) {
    if (RAW_SPEC_KEYS.includes(k)) { out.push(P(`H10.raw:${k}`, `PARAMS key ${k} is a raw-spec override`)); continue; }
    const s = schema?.[k];
    if (!s) { out.push(P(`H10.unknown:${k}`, `PARAMS key ${k} is not in the template's PARAMS`)); continue; }
    if (s.enum && !s.enum.includes(v)) out.push(P(`H10.value:${k}`, `${k}=${JSON.stringify(v)} is not one of ${JSON.stringify(s.enum)}`));
    if (s.type === 'number' && (typeof v !== 'number' || !Number.isFinite(v) || (s.min != null && v < s.min) || (s.max != null && v > s.max))) out.push(P(`H10.value:${k}`, `${k}=${JSON.stringify(v)} is not a number in [${s.min}, ${s.max}]`));
    if (s.type === 'boolean' && typeof v !== 'boolean') out.push(P(`H10.value:${k}`, `${k}=${JSON.stringify(v)} is not a boolean`));
  }
  return out;
}
export async function h10(c) {
  if (c.mode !== 'D' && c.mode !== 'T') return [];
  const d = c.derivation;
  if (!d || typeof d.rebuildParent !== 'function' || !d.parentFragments) return [P('H10:missing', `${c.mode} plate without a derivation proof`)];
  const out = validateParams(d.params, d.schema);
  const got = await d.rebuildParent();
  for (const k of FRAG_KEYS) if (got?.[k] !== d.parentFragments[k]) out.push(P(`H10.byte:${k}`, `parent rebuilt with its own PARAMS: ${k} differs from its GOLDEN fragment`));
  return out;
}

// ---------------------------------------------------------------- flags (node half) ----
const inRange = (v, r) => v >= r[0] && v <= r[1];
export function nodeFlags(c, ctx, M) {
  const env = ctx.envelope, f = {};
  f.F1 = M.pxPerM == null ? { value: null, na: 'not engine' } : { value: M.pxPerM, range: env.F1, raised: !inRange(M.pxPerM, env.F1) };
  f.F3 = { value: M.leaderMax, range: env.F3, raised: !inRange(M.leaderMax, env.F3) };
  f.F4 = M.boxed == null ? { value: null, na: 'not engine' } : { value: M.boxed, range: env.F4, raised: !inRange(M.boxed, env.F4) };
  const view = viewOf(c.plate.normal.overlay);
  f.F6 = c.census?.view ? { value: view, expect: c.census.view, raised: view !== c.census.view } : { value: view, expect: null, raised: true, why: 'no census view' };
  f.F7 = c.research?.topFault ? { value: c.mistakeFault ?? null, expect: c.research.topFault, raised: c.mistakeFault !== c.research.topFault } : { value: c.mistakeFault ?? null, expect: null, raised: true, why: 'no card top fault' };
  return f;
}
export { FRAG_KEYS, REF_CHROME };
