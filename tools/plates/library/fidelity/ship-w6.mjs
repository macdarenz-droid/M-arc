// LIB-SHIP W6 (#393): the two browser checks of D-SHIP-W6-RISKS (6703065396) and D-SHIP-W6-F2 (6703104795), run by the
// gate block LIB-SHIP-W6-RISKS-F2 and tests/gate/ship-w6.mjs (the unit jobs have no browser).
//  - risksRows: harness.mjs ht10DomProbe's C19 on minimal sheets: exactly riskFlags.length .redflag blocks, all inside
//    Risks, and no closing disclaimer line (F-SHEET-COPY R1); `true` keeps golden B's "at least one". The ruled reds, each
//    must be red; the greens green.
//  - f2Rows: PQH's full runQa report (node and browser halves, as fidelity.mjs pqhJob builds it) for cable_lateral_raise
//    and face_pull is ok with the lb07 plate pin's exemptions, and not ok (F2 blocks) with F2 taken out.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { riskCountOf } from '../fidelity.mjs';

const DISC = 'Disclaimer text.';
const block = f => `<div class="redflag" role="note" id="x-redflag-${f}" tabindex="-1"><div><p class="rf-name">${f}</p></div></div>`;
const sheet = (blocks, { disc = false, outside = [] } = {}) => {
  const risks = `<section class="hw-sec risks"><ul class="rk-list"><li>r</li></ul>${blocks.join('')}</section>`;
  return `<!doctype html><dialog class="sheet ht" open><div class="sheet-panel">${risks}${outside.join('')}${disc ? `<p class="ht-disclaimer" id="x-disclaimer">${DISC}</p>` : ''}</div></dialog>`;
};

/** D-SHIP-W6-RISKS rows: [name, page, expectRisks, the C19 problems it must give]. Returns { rows, problems }. */
export async function risksRows(browser, H, { root = ROOT } = {}) {
  const mlr = await riskCountOf(root, 'lib_machine_lateral_raise');
  const CASES = [
    ['green: one flag, one block', sheet([block('shoulder')]), 1, []],
    ['green: no flag, no block', sheet([]), 0, []],
    ["green: golden B's true with a block", sheet([block('wrist')]), true, []],
    ['red 1: a flagged row with its block removed', sheet([]), 1, ['C19: 0 .redflag block(s), expected 1 (riskFlags)']],
    ['red 2: a no-flag row with a stray block', sheet([block('shoulder')]), 0, ['C19: 1 .redflag block(s), expected 0 (riskFlags)']],
    ['red 3 (F-SHEET-COPY MB3): a closing disclaimer line put back', sheet([block('shoulder')], { disc: true }), 1, ['C19: 1 .ht-disclaimer element(s), expected 0']],
    ["red 4: the old rule (true) on machine_lateral_raise's no-flag sheet", sheet([]), true, ['C19: no .redflag block in Risks']],
    ['red 5 (F-SHEET-COPY MB2): "not medical advice" in a red-flag box', sheet([block('shoulder').replace('</p>', ' Not medical advice.</p>')]), 1, ['C19: "medical advice" wording in the sheet']],
    ['red 6 (F-SHEET-COPY): a red-flag box outside Risks', sheet([], { outside: [block('shoulder')] }), 1, ['C19: a .redflag sits outside the Risks section']],
    ["machine_lateral_raise's own count passes its no-flag sheet", sheet([]), mlr, []],
  ];
  const rows = [], problems = [];
  if (mlr !== 0) problems.push(`machine_lateral_raise riskFlags.length is ${mlr}, expected 0`);
  for (const [name, html, expectRisks, want] of CASES) {
    const page = await browser.newPage();
    try {
      await page.setContent(html);
      const d = await page.evaluate(H.ht10DomProbe, [[], [], [], DISC, expectRisks, false, 0]);
      const got = d.problems.filter(p => p.startsWith('C19'));
      rows.push({ name, got, want });
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`${name}: C19 ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    } finally { await page.close(); }
  }
  return { rows, problems };
}

/** D-SHIP-W6-F2 rows: per F2 id, PQH ok with the pin, red (F2 blocks) with F2 removed. Returns { rows, problems }. */
export async function f2Rows({ root = ROOT } = {}) {
  const L = join(root, 'tools/plates/library/');
  const imp = p => import(pathToFileURL(join(L, p)).href);
  const [I, A, E, B, G, C, Lb, Q] = await Promise.all(['qa/index.mjs', 'qa/approved.mjs', 'qa/engine.mjs', 'qa/browser.mjs', '../golden.mjs', 'candidate.mjs', 'lb7/build.mjs', 'lb7/qa.mjs'].map(imp));
  const html = String((await Lb.buildLb7Page()).html), mirror = G.makeMirror(), engine = await E.loadEngine(mirror), browser = await B.launch(), pins = I.loadPins();
  const rows = [], problems = [];
  try {
    if (JSON.stringify(Q.F2_IDS) !== JSON.stringify(['lib_cable_lateral_raise', 'lib_face_pull'])) problems.push(`F2_IDS ${JSON.stringify(Q.F2_IDS)}`);
    for (const id of Q.F2_IDS) for (const drop of [null, 'F2']) {
      const c = await C.candidateOf(id, { root, platesHtml: html, engine });
      if (drop) c.exemptions = c.exemptions.filter(f => f !== drop);
      const bmap = await B.browserResults(browser, html, [c], engine, pins.envelope);
      const r = await I.runQa(c, { engine, pins, approvedStrings: A.approvedStrings(), browser: bmap });
      const got = { ok: r.ok, F2raised: r.flags.F2.raised, F2blocks: r.flags.F2.blocks }, want = drop ? { ok: false, F2raised: true, F2blocks: true } : { ok: true, F2raised: true, F2blocks: false };
      rows.push({ id, drop, got });
      if (JSON.stringify(got) !== JSON.stringify(want)) problems.push(`${id} ${drop ? 'without F2' : 'with the pin'}: ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
  } finally { await browser.close(); E.dropMirror(mirror); }
  return { rows, problems };
}
