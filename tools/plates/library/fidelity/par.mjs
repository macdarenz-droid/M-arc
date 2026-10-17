// LIB-4b B7 (D-LIB4-PAR): the P decision. Two runs of the same ids on the same head, at P = 1 and at P = n (the --json
// files of fidelity.mjs). P = n is adopted only when both runs give identical rows (id, theme, state, result) and
// identical px per pixel tuple; any difference keeps P = 1. Build time only.
// CLI: node tools/plates/library/fidelity/par.mjs <p1.json> <pn.json> <n> [nproc]
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const key = r => `${r.id}|${r.theme}|${r.state}|${r.result}`;
const wall = o => Object.values(o.seconds?.id ?? {}).reduce((s, v) => s + v, 0);

/** -> { P, diffs: [..], rows, pxTuples } for runs `a` (P = 1) and `b` (P = n). */
export function parVerdict(a, b, n) {
  const diffs = [], ka = new Set(a.rows.map(key)), kb = new Set(b.rows.map(key));
  if (a.rows.length !== b.rows.length) diffs.push(`row count ${a.rows.length} != ${b.rows.length}`);
  for (const k of ka) if (!kb.has(k)) diffs.push(`only at P=1: ${k}`);
  for (const k of kb) if (!ka.has(k)) diffs.push(`only at P=${n}: ${k}`);
  for (const t of new Set([...Object.keys(a.px), ...Object.keys(b.px)])) if (a.px[t] !== b.px[t]) diffs.push(`px ${t}: ${a.px[t]} != ${b.px[t]}`);
  if (!a.rows.length) diffs.push('no rows');
  return { P: diffs.length ? 1 : n, diffs, rows: a.rows.length, pxTuples: Object.keys(a.px).length };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [fa, fb, n, nproc = '?'] = process.argv.slice(2), a = JSON.parse(readFileSync(fa, 'utf8')), b = JSON.parse(readFileSync(fb, 'utf8'));
  const v = parVerdict(a, b, +n);
  console.log(`rows ${v.rows}, px tuples ${v.pxTuples}; job seconds P=1 ${wall(a).toFixed(0)}, P=${n} ${wall(b).toFixed(0)}; nproc ${nproc}`);
  console.log(v.diffs.length ? `P = 1 (${v.diffs.length} differences):\n${v.diffs.slice(0, 20).join('\n')}` : `P = ${n}: identical rows and px`);
  process.exit(v.diffs.length ? 1 : 0);
}
