// LIB-3: measures the vocabulary and the envelope on the approved 8 (golden fixture page, vendored engine) and, with
// --write, pins them to vocabulary.json and envelope.json. Nothing in either file is set by hand: the vitest block
// re-measures the node half and selftest.mjs the browser half, and both must equal the pinned files.
// Run: node tools/plates/library/qa/pin.mjs [--write]   (the browser half needs Chromium: MARC_CHROMIUM or /opt/pw-browsers)
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { makeMirror } from '../../golden.mjs';
import { approvedStrings, candidatesOf, goldenHtml } from './approved.mjs';
import { dropMirror, equipmentItems, loadEngine } from './engine.mjs';
import { vocabularyOf } from './markup.mjs';
import { movingLines, nodeMetrics, rendersOf } from './node.mjs';

// The exact measured doubles: no rounding, so no bound is ever wider than the 8 measured (review L-1).
const range = vs => [Math.min(...vs), Math.max(...vs)];

/** The pinned vocabulary: element, attribute and class names of the 8's svg and overlay fragments, sorted. */
export function measureVocabulary(cands) {
  const acc = { elements: new Set(), attributes: new Set(), classes: new Set() };
  for (const c of cands) for (const m of [c.plate.normal.svg, c.plate.normal.overlay, c.plate.mistake.svg, c.plate.mistake.overlay]) {
    const v = vocabularyOf(m);
    for (const k of Object.keys(acc)) for (const x of v[k]) acc[k].add(x);
  }
  return { measuredOn: cands.map(c => c.id), ...Object.fromEntries(Object.entries(acc).map(([k, s]) => [k, [...s].sort()])) };
}

/** The node half of the envelope. Engine-only values (F1, F4, deviation) come from the 7 engine plates. */
export function measureNodeEnvelope(cands, E) {
  const ms = cands.map(c => ({ c, m: nodeMetrics(c, { engine: E }, rendersOf(c, E)) })), eng = ms.filter(x => x.c.spec);
  return {
    measuredOn: cands.map(c => c.id),
    traceLenMin: Math.min(...ms.map(x => x.m.traceLen)),
    deviationMin: Math.min(...eng.map(x => x.m.deviation)),
    altWordsMax: Math.max(...ms.map(x => x.m.altWords)),
    F1: range(eng.map(x => x.m.pxPerM)),
    F3: range(ms.map(x => x.m.leaderMax)),
    F4: [Math.min(...eng.map(x => x.m.boxed)), Math.max(...eng.map(x => x.m.boxed))],
    // D-LIB3-H9: the equipment types the 8 move without a poly twin (the approved standard for H9)
    H9lineTypes: [...new Set(eng.flatMap(({ c }) => c.spec.mistake ? movingLines(equipmentItems(E, c.spec, rendersOf(c, E).normal.report)).map(m => m.type) : []))].sort(),
    perPlate: Object.fromEntries(ms.map(({ c, m }) => [c.id, Object.fromEntries(Object.entries(m).map(([k, v]) => [k, typeof v === 'number' ? +v.toFixed(3) : v]))])),
  };
}

export async function measureApproved({ browser = null } = {}) {
  const mirror = makeMirror();
  try {
    const E = await loadEngine(mirror), html = goldenHtml(), cands = await candidatesOf(html, E);
    const vocabulary = measureVocabulary(cands), envelope = measureNodeEnvelope(cands, E);
    if (browser) {
      const { measureBrowserEnvelope } = await import('./browser.mjs');
      Object.assign(envelope, await measureBrowserEnvelope(browser, html, cands, E));
    }
    return { vocabulary, envelope, cands, E, html, approvedStrings: approvedStrings(html) };
  } finally { dropMirror(mirror); }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { launch } = await import('./browser.mjs');
  const browser = await launch();
  try {
    const { vocabulary, envelope } = await measureApproved({ browser });
    const out = { vocabulary, envelope };
    for (const [k, v] of Object.entries(out)) {
      const text = JSON.stringify(v, null, 1) + '\n';
      if (process.argv.includes('--write')) writeFileSync(new URL(`${k}.json`, import.meta.url), text);
      else console.log(`${k}.json\n${text}`);
    }
  } finally { await browser.close(); }
}
