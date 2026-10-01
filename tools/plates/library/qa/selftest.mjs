// LIB-3 self-test, browser included (vitest covers the node half; Chromium is not installed when CI runs
// `npm run check`, so LIB-4 wires this script into the gate job). It proves, on this exact checkout:
//   1. vocabulary.json and envelope.json equal a fresh measurement on the approved 8 (node and browser halves);
//   2. the clean run: each of the 8 is ok, every remaining problem is one of its named exemptions, none unused;
//   3. every planted mutation turns its check (or flag) red, and the clean target does not raise it.
// Run: MARC_CHROMIUM=/opt/pw-browsers/chromium node tools/plates/library/qa/selftest.mjs
import { fileURLToPath } from 'node:url';
import { launch, measureBrowserEnvelope } from './browser.mjs';
import { HARD, FLAGS, summary } from './index.mjs';
import { measureNodeEnvelope, measureVocabulary } from './pin.mjs';
import { BROWSER_MUTATIONS, NODE_MUTATIONS, cleanBase, prove } from './proof.mjs';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

export async function selftest({ log = console.log } = {}) {
  const t0 = Date.now(), bad = [], browser = await launch();
  console.error(`browser: ${browser.version()} (${process.env.MARC_CHROMIUM ?? 'default'})`);   // stderr: stdout holds only verdict lines
  try {
    const base = await cleanBase({ browser });
    try {
      // 1. pins
      const voc = measureVocabulary(base.cands), env = { ...measureNodeEnvelope(base.cands, base.E), ...(await measureBrowserEnvelope(browser, base.html, base.cands, base.E)) };
      if (!same(voc, base.pins.vocabulary)) bad.push('vocabulary.json differs from a fresh measurement on the 8');
      if (!same(env, base.pins.envelope)) bad.push(`envelope.json differs from a fresh measurement on the 8:\n  pinned ${JSON.stringify(base.pins.envelope)}\n  fresh  ${JSON.stringify(env)}`);
      log(`pins: vocabulary ${voc.elements.length} elements / ${voc.attributes.length} attributes / ${voc.classes.length} classes, envelope ${Object.keys(env).length} keys: ${bad.length ? 'DIFFER' : 'equal to a fresh measurement'}`);
      // 2. clean run
      for (const [, r] of base.reports) {
        log(`clean ${summary(r)}; exempted ${HARD.reduce((a, h) => a + r.hard[h].exempted.length, 0)}, exempt flags ${FLAGS.filter(f => r.flags[f].approved).join(',') || 'none'}`);
        if (!r.ok) bad.push(`clean ${r.id} is not ok: ${HARD.flatMap(h => r.hard[h].problems.map(p => `${h} ${p.key}`)).join('; ')} ${FLAGS.filter(f => r.flags[f].blocks).join(',')}`);
        if (r.unusedExemptions.length) bad.push(`clean ${r.id}: exemptions that match nothing: ${r.unusedExemptions.join(', ')}`);
      }
      // 3. mutations: every hard check and every flag has its own planted mutation (D-LIB3-flags ruling 2)
      const all = [...NODE_MUTATIONS, ...BROWSER_MUTATIONS], covered = new Set(all.map(m => m.check ?? m.flag));
      for (const id of [...HARD, ...FLAGS]) if (!covered.has(id)) bad.push(`${id} has no planted mutation`);
      log(`coverage: ${all.length} mutations over ${[...HARD, ...FLAGS].filter(id => covered.has(id)).length} of ${HARD.length + FLAGS.length} checks and flags`);
      for (const m of all) {
        const p = await prove(m, base, { browser });
        log(`${p.ok ? 'RED as planted' : 'FAILED       '}  ${p.check.padEnd(6)} ${p.id}  -> ${p.keys.slice(0, 3).join(', ')}${p.keys.length > 3 ? ` (+${p.keys.length - 3})` : ''}${p.cleanKeys.length ? `  CLEAN ALSO HAS ${p.cleanKeys.join(', ')}` : ''}`);
        if (!p.ok) bad.push(`${p.id}: ${p.red ? 'the clean target raises it too' : 'did not turn red'}`);
      }
    } finally { base.drop(); }
  } finally { await browser.close(); }
  log(`selftest ${bad.length ? 'FAIL' : 'PASS'}`);
  console.error(`selftest took ${((Date.now() - t0) / 1000).toFixed(1)} s`);   // timing on stderr: the verdict lines on stdout are deterministic
  return bad;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const bad = await selftest();
  if (bad.length) { console.error(`\n${bad.join('\n')}`); process.exit(1); }
}
