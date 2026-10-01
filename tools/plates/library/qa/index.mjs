// LIB-3 plate QA gate (plan 3.2 PQ-H1..H10, 3.3 flags F1-F7). One call per plate: runQa(candidate, ctx) -> report;
// the generator calls gatePlate(report) before it emits anything and refuses a report that is not ok.
//
// candidate (LIB-2 supplies one per library id; approved.mjs builds the 8):
//   id, chromeId, mode: 'approved' | 'D' | 'T' | 'H', spec (engine spec; null only for the reference plate),
//   plate (golden.mjs extractPlates of the card), article (the card's <article> markup),
//   research { plateFacts: [{ kind: 'angle', joint?, pose?, deg, measure? } | { kind: 'contact', landmark, pose? }
//              | { kind: 'height', landmark, pose?, m }], tempo, topFault },
//   census { view }, mistakeFault, derivation { params, schema, rebuildParent(), parentFragments } (D and T),
//   exemptions: owner-approved flag names from the plate's golden entry (e.g. ['F1']).
// ctx: { engine (engine.mjs loadEngine), vocabulary, envelope, approvedStrings (approved.mjs), browser?: Map(id ->
//   browser.mjs result) }. A report without its browser half is never ok.
import { readFileSync } from 'node:fs';
import { APPROVED_IDS } from './approved.mjs';
import { h1Engine, h2, h3, h6, h7, h8, h9, h10, nodeFlags, nodeMetrics, rendersOf } from './node.mjs';

const here = new URL('.', import.meta.url);
export const readJson = name => JSON.parse(readFileSync(new URL(name, here), 'utf8'));
export const loadPins = () => ({ vocabulary: readJson('vocabulary.json'), envelope: readJson('envelope.json'), exemptions: readJson('exemptions.json') });

export const HARD = ['PQ-H1', 'PQ-H2', 'PQ-H3', 'PQ-H4', 'PQ-H5', 'PQ-H6', 'PQ-H7', 'PQ-H8', 'PQ-H9', 'PQ-H10'];
export const FLAGS = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'];

/** The named exemptions a candidate may use: only the 8, only in mode 'approved'. New plates inherit none. */
export function exemptionsFor(c, pins) {
  if (c.mode !== 'approved') return {};
  return pins.exemptions.plates[c.id] ?? {};
}

export async function runQa(c, ctx) {
  const pins = ctx.pins ?? loadPins();
  const env = { ...ctx, vocabulary: ctx.vocabulary ?? pins.vocabulary, envelope: ctx.envelope ?? pins.envelope };
  let R = null, renderError = null;
  try { R = rendersOf(c, env.engine); } catch (e) { renderError = e.message; }
  const M = nodeMetrics(c, env, R);
  const raw = {
    'PQ-H1': h1Engine(c, R, renderError), 'PQ-H2': h2(c, env), 'PQ-H3': h3(c, env, R, M), 'PQ-H4': [], 'PQ-H5': [],
    'PQ-H6': h6(c, env, R), 'PQ-H7': h7(c, env, R), 'PQ-H8': h8(c, env), 'PQ-H9': h9(c, env, R), 'PQ-H10': await h10(c),
  };
  if (c.mode === 'approved' && !APPROVED_IDS.includes(c.id)) raw['PQ-H2'].push({ key: 'mode', text: `${c.id} is not one of the 8 and cannot be 'approved'` });
  const flags = nodeFlags(c, env, M);
  const b = env.browser?.get(c.id);
  if (b) {
    raw['PQ-H1'].push(...b.H1); raw['PQ-H4'].push(...b.H4); raw['PQ-H5'].push(...b.H5);
    Object.assign(flags, b.flags);
    Object.assign(M, b.metrics);
  } else for (const id of ['PQ-H1', 'PQ-H4', 'PQ-H5']) raw[id].push({ key: 'browser:not-run', text: 'browser checks not run' });
  if (!b) for (const f of ['F2', 'F5']) flags[f] = { value: null, raised: true, why: 'browser checks not run' };
  const ex = exemptionsFor(c, pins), hard = {}, usedEx = new Set();
  for (const id of HARD) {
    const problems = [], exempted = [];
    for (const p of raw[id]) (ex[p.key] ? (exempted.push({ ...p, why: ex[p.key] }), usedEx.add(p.key)) : problems.push(p));
    hard[id] = { pass: problems.length === 0, problems, exempted };
  }
  const ownerOk = new Set([...(c.exemptions ?? []), ...Object.keys(ex).filter(k => FLAGS.includes(k))]);
  for (const f of FLAGS) {
    const v = flags[f] ?? { raised: true, why: 'not measured' };
    flags[f] = { ...v, approved: !!v.raised && ownerOk.has(f), blocks: !!v.raised && !ownerOk.has(f) };
    if (v.raised && ownerOk.has(f)) usedEx.add(f);
  }
  const ok = HARD.every(id => hard[id].pass) && FLAGS.every(f => !flags[f].blocks);
  return { id: c.id, mode: c.mode, ok, hard, flags, metrics: M, unusedExemptions: Object.keys(ex).filter(k => !usedEx.has(k)) };
}

export class QaRefused extends Error {
  constructor(report) {
    const hard = HARD.flatMap(id => report.hard[id].problems.map(p => `${id} ${p.text}`));
    const flags = FLAGS.filter(f => report.flags[f]?.blocks).map(f => `${f} raised without an owner exemption (${JSON.stringify(report.flags[f].value)})`);
    super(`plate QA refused ${report.id}:\n  ${[...hard, ...flags].join('\n  ')}`);
    this.report = report;
  }
}

/** The one call the generator makes before it emits a library plate (LIB-2). Throws unless the report is ok. */
export function gatePlate(report) {
  if (!report || report.ok !== true) throw new QaRefused(report ?? { id: '?', hard: Object.fromEntries(HARD.map(h => [h, { problems: [{ text: 'no report' }] }])), flags: {} });
  return report;
}

/** One-line summary per report. */
export const summary = r => `${r.id}: ${r.ok ? 'ok' : 'REFUSED'} | ${HARD.map(h => `${h.slice(3)}${r.hard[h].pass ? '' : '!'}`).join(' ')} | flags ${FLAGS.filter(f => r.flags[f].raised).map(f => f + (r.flags[f].approved ? '(owner)' : '!')).join(' ') || 'none'}`;
