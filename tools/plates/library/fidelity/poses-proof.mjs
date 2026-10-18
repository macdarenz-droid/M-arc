// LIB-4b D-LIB4b-POSES (7): the derived pose rule applied to LIB-6's build of the 8. Runs on a scratch tree with LIB-6
// (#181) merged; build time only, never bundled. On the same captured renderPlate calls it runs every HT-4 A5 assertion
// (options, protected fields, the untouched base call, fragments, poses with the enumerated tables) and libraryA5 (the
// rule a library id gets). Pass: HT-4 reports nothing, and libraryA5 reports exactly the two Right-side pins
// (pull_up|shoulders-right, hanging_leg_raise|shoulders-right) plus its (5) line for each of the 8's spec ids. The
// lateral raise draws its crops through ref-src, never renderPlate: HT-4 checks it with validateLateralRaiseCrops, and
// a library spec is an engine spec, so it is listed and left out of the derived rule.
// CLI: node tools/plates/library/fidelity/poses-proof.mjs [--json out]
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROOT } from '../../lib/inputs.mjs';
import { captureLayersBuild, libraryA5 } from './twins/ht4.mjs';

export const RIGHT_PINS = ['pull_up|shoulders-right', 'hanging_leg_raise|shoulders-right'];
const strip = v => JSON.parse(JSON.stringify(v, (k, x) => (typeof x === 'function' ? undefined : x)));

/** -> { ht4: [problems], derived: { specId: { protected, fragments, poses } }, calls, skipped } */
export async function posesProof(root = ROOT) {
  const gb = await import('../../fidelity/goldenB.mjs');
  const cap = await captureLayersBuild(root, (T, b) => b.GOLDEN_B_SPEC);
  const specs = await gb.loadGoldenASpecs(), plates = JSON.parse(readFileSync(join(root, 'tests/howto/golden/GOLDEN.json'), 'utf8')).entries.filter(e => e.kind === 'plate');
  const { CLOSEUP_OPTIONS } = await import(pathToFileURL(join(root, 'tools/plates/library/render/closeups-8.mjs')).href);
  const { CAMERAS, STILLS } = await import(pathToFileURL(join(root, 'tools/plates/library/render/closeup/zbox-geometry.mjs')).href);
  const latest = new Map(plates.map(e => [e.slug, e]));
  // HT-4 A5 on LIB-6's calls, exactly as the HT-4 block runs it on golden B's
  const ht4 = [...gb.fragmentProblems(cap.html, [...latest.values()])];
  for (const [specId, goldenA] of Object.entries(specs)) {
    const calls = cap.calls.filter(c => c.spec.id === specId);
    if (!calls.length) ht4.push(`captured 0 renderPlate calls for ${specId}`);
    for (const c of calls) for (const k of Object.keys(c.opts ?? {})) if (!['id', 'mistake', 'selected'].includes(k)) ht4.push(`call ${JSON.stringify(c.opts)} uses an option outside {id, mistake, selected}`);
    for (const c of calls) ht4.push(...gb.protectedFieldProblems(specId, c, goldenA));
    if (!calls.some(c => JSON.stringify(c.spec) === JSON.stringify(goldenA))) ht4.push(`no untouched base-plate call found for ${specId}`);
  }
  ht4.push(...gb.validateCalls(cap.calls.filter(c => specs[c.spec.id]), specs));
  // the derived rule, per engine plate of the 8
  const derived = {};
  for (const [specId, ref] of Object.entries(specs)) {
    const options = CLOSEUP_OPTIONS[specId], mod = await import(pathToFileURL(join(root, `tools/plates/layers/exercises/${specId}.howto.mjs`)).href), howto = mod.default;
    let stillPose = null;
    if (options.shell === 'zbox') {
      const REF = CAMERAS[options.camera.kind](howto.plate, options.camera);
      const stillSpec = STILLS[options.still.kind]({ mod, howto, plateSpec: howto.plate, stills: mod.stills, H: options.bodyHeight, REF }, options.still);
      stillPose = s => strip(stillSpec(s).poses.end);
    }
    const prefix = specId.replace(/_/g, '-');
    derived[specId] = libraryA5(cap, { specId, ref, howto: strip(howto), prefix, family: options.shell, stills: mod.stills ? strip(mod.stills) : null, stillPose, entry: latest.get(prefix) }, gb);
  }
  return { ht4, derived, calls: cap.calls.length, skipped: ['lateral_raise (ref-src crops; HT-4 validateLateralRaiseCrops)'] };
}

/** The verdict: [] when HT-4 accepts everything and the derived rule rejects exactly the two Right pins (and (5)). */
export function verdict({ ht4, derived }) {
  const bad = ht4.map(p => `HT-4: ${p}`), pins = new Set();
  for (const [specId, r] of Object.entries(derived)) {
    for (const p of [...r.protected, ...r.fragments]) bad.push(`derived ${specId}: ${p}`);
    if (!r.poses.includes(`library spec.id ${specId} is one of the 8's (D-LIB4b-POSES (5))`)) bad.push(`derived ${specId}: (5) did not fire on one of the 8's spec ids`);
    for (const p of r.poses) {
      if (p.startsWith('library spec.id ')) continue;
      const key = p.split(':')[0];
      if (RIGHT_PINS.includes(key)) pins.add(key); else bad.push(`derived ${specId}: ${p}`);
    }
  }
  for (const k of RIGHT_PINS) if (!pins.has(k)) bad.push(`derived: the Right pin ${k} was not reported`);
  return bad;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const t0 = Date.now(), out = await posesProof(), bad = verdict(out);
  console.log(`calls ${out.calls}; HT-4 problems ${out.ht4.length}; derived poses ${JSON.stringify(Object.fromEntries(Object.entries(out.derived).map(([k, r]) => [k, r.poses])), null, 1)}`);
  console.log(`skipped: ${out.skipped.join('; ')}`);
  console.log(bad.length ? `FAIL\n${bad.join('\n')}` : 'PASS: HT-4 accepts every call; the derived rule rejects only pull_up|shoulders-right and hanging_leg_raise|shoulders-right');
  console.log(`${((Date.now() - t0) / 1000).toFixed(1)} s`);
  const i = process.argv.indexOf('--json');
  if (i > 0) writeFileSync(process.argv[i + 1], JSON.stringify(out, null, 1));
  process.exit(bad.length ? 1 : 0);
}
