// LIB-3 mutation proofs, shared by the vitest block (node mutations) and selftest.mjs (all of them). A proof passes
// when the mutated target raises the named problem key (or flag) and the clean target does not.
import { makeMirror } from '../../golden.mjs';
import { approvedStrings, candidatesOf, goldenHtml } from './approved.mjs';
import { buildMirrorGallery, dropMirror, loadEngine, specIdOf, wrapSpec } from './engine.mjs';
import { HARD, loadPins, runQa } from './index.mjs';
import { CANDIDATE_MUTATIONS, PAGE_MUTATIONS, SPEC_MUTATIONS } from './mutations.mjs';

/** Problem keys (hard, unexempted) and raised flags of a report. */
export const raisedKeys = r => [...HARD.flatMap(h => r.hard[h].problems.map(p => p.key)), ...Object.entries(r.flags).filter(([, v]) => v.raised).map(([f]) => f)];
const hits = (r, m) => raisedKeys(r).filter(k => (m.flag ? k === m.flag : k.startsWith(m.key)));

/** The clean base: pins, an engine mirror, the 8 as candidates, and (with a browser) their browser results. */
export async function cleanBase({ browser = null } = {}) {
  const pins = loadPins(), mirror = makeMirror(), E = await loadEngine(mirror), html = goldenHtml();
  const cands = await candidatesOf(html, E), strings = approvedStrings(html);
  let bmap = null;
  if (browser) { const { browserResults } = await import('./browser.mjs'); bmap = await browserResults(browser, html, cands, E, pins.envelope); }
  const ctx = { engine: E, pins, approvedStrings: strings, browser: bmap };
  const reports = new Map();
  for (const c of cands) reports.set(c.chromeId, await runQa(c, ctx));
  return { pins, mirror, E, html, cands, ctx, reports, drop: () => dropMirror(mirror) };
}

async function specProof(m, base, browser) {
  const clean = base.cands.find(c => c.chromeId === m.target), sid = specIdOf(m.target);
  const arg = await m.prepare(base.E, clean.spec, base.pins.envelope);
  const src = `(s) => (${m.fn.toString()})(s, ${JSON.stringify(arg)})`;
  if (m.specOnly) {   // the spec only (the page builder would refuse it): swap the candidate's spec
    const g = makeMirror(); wrapSpec(g, sid, src);
    try { const E2 = await loadEngine(g), c = { ...clean, spec: await E2.spec(sid) }; return { arg, report: await runQa(c, { ...base.ctx, engine: E2 }) }; } finally { dropMirror(g); }
  }
  const g = await buildMirrorGallery(mir => wrapSpec(mir, sid, src));
  try {
    const E2 = await loadEngine(g.mirror), c = (await candidatesOf(g.html, E2)).find(x => x.chromeId === m.target);
    let bmap = base.ctx.browser;
    if (m.browser && browser) { const { browserResults } = await import('./browser.mjs'); bmap = await browserResults(browser, g.html, [c], E2, base.pins.envelope); }
    return { arg, report: await runQa(c, { ...base.ctx, engine: E2, browser: bmap }) };
  } finally { dropMirror(g.mirror); }
}

async function pageProof(m, base, browser) {
  const { browserResults } = await import('./browser.mjs');
  const html = m.html ? m.html(base.html) : base.html;
  if (m.html && html === base.html) throw new Error(`${m.id}: the html edit matched nothing`);
  const c = (await candidatesOf(html, base.E)).find(x => x.chromeId === m.target);
  const bmap = await browserResults(browser, html, [c], base.E, base.pins.envelope, { css: m.css ?? null, ...m.opts });
  return { report: await runQa(c, { ...base.ctx, browser: bmap }) };
}

/** Runs one mutation; returns { id, check, red, keys, cleanKeys, ok }. */
export async function prove(m, base, { browser = null } = {}) {
  const kind = SPEC_MUTATIONS.includes(m) ? 'spec' : CANDIDATE_MUTATIONS.includes(m) ? 'candidate' : 'page';
  const clean = base.cands.find(c => c.chromeId === m.target);
  let out;
  if (kind === 'spec') out = await specProof(m, base, browser);
  else if (kind === 'candidate') out = { report: await runQa(m.apply(clean), base.ctx) };
  else out = await pageProof(m, base, browser);
  const cleanReport = m.control ? await runQa(m.control(clean), base.ctx)
    : m.controlCss ? (await pageProof({ ...m, html: null, css: m.controlCss }, base, browser)).report : base.reports.get(m.target);
  const keys = hits(out.report, m), cleanKeys = hits(cleanReport, m);
  return { id: m.id, check: m.check ?? m.flag, kind, arg: out.arg ?? null, red: keys.length > 0, keys, cleanKeys, ok: keys.length > 0 && cleanKeys.length === 0 };
}

/** Mutations that need Chromium (run by selftest.mjs; LIB-4 wires it into CI). */
export const BROWSER_MUTATIONS = [...SPEC_MUTATIONS.filter(m => m.browser), ...PAGE_MUTATIONS];
export const NODE_MUTATIONS = [...SPEC_MUTATIONS.filter(m => !m.browser), ...CANDIDATE_MUTATIONS];
