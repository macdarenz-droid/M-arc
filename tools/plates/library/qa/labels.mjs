// LIB-3 label-search helper (plan 3.2 "label-search helper", design-hybrid 3.1): runs the engine's own placeLabels
// through renderPlate with `prefer` and anchor-offset variants, scores each layout by the PQ metrics (engine report
// issues first, then the longest and the total leader length, F3), and proposes `box` values. It never writes a spec:
// the author accepts or edits the proposal, so every hand-placed box stays visible in the spec.
import { pathLength, pathsOf } from './markup.mjs';

export const PREFERS = [undefined, 'left', 'right', 'above', 'below'];
export const OFFSETS = [[0, 0], [-4, 0], [4, 0], [0, -4], [0, 4]];
const CAP_LH = 14;   // layout.mjs CAP_LH (callout line height)

const listOf = (spec, mode) => (mode === 'mistake' ? spec.mistake?.tells : spec.callouts) ?? [];
const withList = (spec, mode, list) => (mode === 'mistake' ? { ...spec, mistake: { ...spec.mistake, tells: list } } : { ...spec, callouts: list });
const offset = (anchor, [dx, dy]) => {
  if (!dx && !dy) return anchor;
  if (anchor && typeof anchor === 'object' && !Array.isArray(anchor) && anchor.at) { const o = anchor.off ?? [0, 0]; return { ...anchor, off: [o[0] + dx, o[1] + dy] }; }
  return { at: anchor, off: [dx, dy] };
};

/** Score of one render: engine issues, then the longest leader, then the total (lower is better). */
export function score(r) {
  const L = pathsOf(r.svg, 'leader').map(pathLength);
  return { issues: r.report.issues.length, list: r.report.issues, leaderMax: +Math.max(0, ...L).toFixed(2), leaderSum: +L.reduce((a, b) => a + b, 0).toFixed(2) };
}
const better = (a, b) => a.issues - b.issues || a.leaderMax - b.leaderMax || a.leaderSum - b.leaderSum;

/** The `box` the engine chose for a label, read back from its report ink box (layout.mjs inkBox / arcBox). */
export function boxOf(r, key, text, kind) {
  const l = r.report.labels.find(x => x.key === key);
  if (!l) return null;
  if (kind === 'arc') return { left: l.ink.x0, top: l.ink.y0 };
  const h = String(text).split(/<br\s*\/?>|\n/).length * CAP_LH;
  return { left: +(l.ink.x0 - 6).toFixed(1), top: +(l.ink.y0 - 22 + h / 2).toFixed(1) };
}

/**
 * Greedy search, one label at a time in spec order: for each label, every prefer x offset variant with its box
 * removed (the engine places it), keeping the best-scoring layout. Returns the proposal and a verification render
 * with the proposed boxes applied.
 */
export function searchLabels(E, spec, { mode = 'normal', keys = null, prefers = PREFERS, offsets = OFFSETS, id = 'ls' } = {}) {
  const opts = { id: `${id}-${mode === 'mistake' ? 'm' : 'n'}`, mistake: mode === 'mistake' };
  let cur = spec;
  const proposals = [];
  for (const item of listOf(spec, mode)) {
    if (keys && !keys.includes(item.key)) continue;
    let best = null;
    for (const prefer of prefers) for (const off of offsets) {
      const list = listOf(cur, mode).map(x => (x.key === item.key ? (({ box, prefer: _p, ...rest }) => ({ ...rest, ...(prefer ? { prefer } : {}), anchor: offset(item.anchor, off) }))(x) : x));
      const s = withList(cur, mode, list), r = E.renderPlate(s, opts), sc = score(r);
      if (!best || better(sc, best.sc) < 0) best = { sc, s, prefer, off, r };
    }
    const box = boxOf(best.r, item.key, item.text, 'callout');
    proposals.push({ key: item.key, box, prefer: best.prefer ?? null, off: best.off, score: best.sc });
    cur = withList(best.s, mode, listOf(best.s, mode).map(x => (x.key === item.key ? { ...x, box } : x)));
  }
  if (mode === 'normal' && spec.measure && (!keys || keys.includes('_arc'))) {   // the measure label: prefer variants only (its anchor is the arc)
    let best = null;
    for (const prefer of prefers) {
      const { box, prefer: _p, ...rest } = cur.measure, s = { ...cur, measure: { ...rest, ...(prefer ? { prefer } : {}) } }, r = E.renderPlate(s, opts), sc = score(r);
      if (!best || better(sc, best.sc) < 0) best = { sc, s, prefer, r };
    }
    const box = boxOf(best.r, '_arc', null, 'arc');
    proposals.push({ key: '_arc', box, prefer: best.prefer ?? null, off: [0, 0], score: best.sc });
    cur = { ...best.s, measure: { ...best.s.measure, box } };
  }
  const verify = E.renderPlate(cur, opts);
  return { proposals, spec: cur, verify: score(verify) };
}
