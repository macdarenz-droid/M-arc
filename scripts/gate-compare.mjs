// GATE-SPLIT (docs/qa/GATE-SPLIT-DESIGN.md 4.3 E8, E9): compares the gate proofs of the serial arrangement (A: one job
// per time zone, MARC_GATE_JOB=1/1) with the split arrangement (B: K jobs per time zone) on one sha.
//   node scripts/gate-compare.mjs <dirA> <dirB>                 E8: identical results, exit 1 on the first difference
//   node scripts/gate-compare.mjs --seeded <key> <dirA> <dirB>  E9: the seeded group fails in A and only in its own job in B
import { fileURLToPath } from 'node:url';
import { collect, GATE_TZS } from './ci-verdict.mjs';

const byTz = (ms, tz) => ms.filter(m => m.meta?.tz === tz);
const results = (ms) => new Map(ms.flatMap(m => m.rows.filter(r => r.check === 'gate').map(r => [r.id, r.result])));
const themes = (ms) => new Set(ms.flatMap(m => m.rows.filter(r => r.check === 'gate-theme').map(r => `${r.id}|${r.theme}`)));
const errs = (ms) => ms.flatMap(m => m.meta?.errors ?? []).sort();
const files = (ms) => new Set(ms.flatMap(m => Object.entries(m.meta?.files ?? {}).flatMap(([id, fs]) => fs.map(f => `${id}|${f}`))));
const diff = (a, b) => [...a].filter(x => !b.has(x));

/** E8: problems between arrangement A (serial) and B (split); empty means identical. */
export function compareRuns(A, B) {
  const out = [];
  for (const tz of GATE_TZS) {
    const a = byTz(A, tz), b = byTz(B, tz);
    if (a.length !== 1) out.push(`${tz}: arrangement A needs exactly one (serial) proof, got ${a.length}`);
    if (b.length < 1) out.push(`${tz}: arrangement B has no proofs`);
    const ra = results(a), rb = results(b);
    for (const [id, r] of ra) if (rb.get(id) !== r) out.push(`${tz} ${id}: ${r} in A, ${rb.get(id) ?? 'missing'} in B`);
    for (const id of rb.keys()) if (!ra.has(id)) out.push(`${tz} ${id}: in B, missing in A`);
    const ta = themes(a), tb = themes(b);
    for (const x of diff(ta, tb)) out.push(`${tz} theme ${x}: in A, missing in B`);
    for (const x of diff(tb, ta)) out.push(`${tz} theme ${x}: in B, missing in A`);
    const ea = errs(a), eb = errs(b);
    if (ea.join('\n') !== eb.join('\n')) out.push(`${tz}: error lists differ (A ${ea.length}, B ${eb.length}): ${[...diff(new Set(ea), new Set(eb)), ...diff(new Set(eb), new Set(ea))].slice(0, 3).join(' | ')}`);
    const fa = files(a), fb = files(b);
    for (const x of diff(fa, fb)) out.push(`${tz} screenshot ${x}: in A, missing in B`);
    for (const x of diff(fb, fa)) out.push(`${tz} screenshot ${x}: in B, missing in A`);
  }
  return out;
}

/** E9: the seeded group fails in A; in B only the job whose plan holds it fails, only on it; same error strings. */
export function compareSeeded(A, B, seeded) {
  const out = [];
  for (const tz of GATE_TZS) {
    const a = byTz(A, tz), b = byTz(B, tz);
    const ra = results(a);
    if (ra.get(seeded) !== 'fail') { out.push(`${tz}: seed did not bite: ${seeded} is ${ra.get(seeded) ?? 'missing'} in A`); continue; }
    for (const [id, r] of ra) if (id !== seeded && r !== 'pass') out.push(`${tz} A: ${id} also ${r}; the seed must break only ${seeded}`);
    const holder = b.filter(m => m.rows.some(r => r.check === 'gate' && r.id === seeded));
    if (holder.length !== 1) { out.push(`${tz} B: ${seeded} proven in ${holder.length} jobs`); continue; }
    for (const m of b) for (const r of m.rows.filter(x => x.check === 'gate')) {
      const want = r.id === seeded ? 'fail' : 'pass';
      if (r.result !== want) out.push(`${tz} B job ${m.meta?.job?.k}: ${r.id} is ${r.result}, expected ${want}`);
    }
    if (errs(a).join('\n') !== errs(b).join('\n')) out.push(`${tz}: the seeded failure's error strings differ between A and B`);
  }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = process.argv.slice(2);
  const seeded = args[0] === '--seeded' ? args[1] : null;
  const [dirA, dirB] = seeded ? args.slice(2) : args;
  if (!dirA || !dirB) { console.error('usage: node scripts/gate-compare.mjs [--seeded <key>] <dirA> <dirB>'); process.exit(2); }
  const A = collect(dirA).gate, B = collect(dirB).gate;
  const p = seeded ? compareSeeded(A, B, seeded) : compareRuns(A, B);
  if (p.length) { console.error(`gate-compare FAIL (${p.length}):\n${p.join('\n')}`); process.exit(1); }
  console.log(seeded ? `gate-compare --seeded ${seeded} PASS: red in both arrangements, only in its own job in B` : `gate-compare PASS: identical rows, themes, errors and screenshots in ${GATE_TZS.join(' and ')}`);
}
