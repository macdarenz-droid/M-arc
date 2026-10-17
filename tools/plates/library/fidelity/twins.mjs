// LIB-4b (D-LIB4-OPEN, B3): the twin drift tripwire. The per-id checks that live in gate blocks cannot be imported, so
// the runner re-implements them (fidelity/twins/*.mjs, fidelity/plate.mjs). Each twin is pinned to the sha256 of the
// text parseGate gives for its gate group, and plate.mjs to the harness functions it re-implements. A card that edits
// a pinned group or function re-runs B2 and re-pins here in the same PR (the supervisor adds this file to its scope).
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../lib/inputs.mjs';

const sha = s => createHash('sha256').update(s).digest('hex');
export const HARNESS_FILE = 'tools/plates/fidelity/harness.mjs';

/** Gate group -> the twin that re-implements its per-id checks, and the sha256 of the group's text at the pin. */
export const TWINS = [
  { key: 'HT-3', twin: 'fidelity/plate.mjs (thresholds)', sha256: '5267014f25a11bc0fa4c54c304728976dde2d97374ffb20ae559e8104b5eb957' },
  { key: 'HT-6', twin: 'fidelity/twins/ht6.mjs', sha256: 'b3308c94ba5a24182981caf2de4bc45de0945e9be6be45401097cebbc5a21852' },
  { key: 'HT-3b', twin: 'fidelity/twins/offline.mjs (A4a)', sha256: 'f5c6f80cfca165ec9d9c2b979287c3c1a442fa178b3b29b57313e97c6e51da08' },
  { key: 'HT-7', twin: 'fidelity/twins/ht7.mjs', sha256: '134205430bfbb55f971ac0e561cbce107debc22e85cfa6f8440d2e4bfa94ecfb' },
  { key: 'HT-4', twin: 'fidelity/twins/ht4.mjs', sha256: 'd98dfb34a05ba8d27f77a962b2e1eda740e51c44dc565e4e524c31e838b918fe' },
  { key: 'HT-9', twin: 'fidelity/twins/ht9.mjs', sha256: '6bb3f58d03adf83925107a3738f4bc87a0465b6d665dbbf78ef014555a6a6923' },
  { key: 'HT-8', twin: 'fidelity/twins/ht8.mjs', sha256: 'fcdd4f7de1eaaf4e797113f4896ec7fcf5b89e432cb819f73a6a2e7d1a136da6' },
];
/** harness.mjs top-level declarations re-implemented by fidelity/plate.mjs and fidelity.mjs's entryJob. */
export const HARNESS_PINS = [
  { name: 'ht3Fidelity', twin: 'fidelity/plate.mjs', sha256: '3b64635a397596fb158b5c1fefa54d22293b0d1e804f96f541a475690b4c4bf6' },
  { name: 'animList', twin: 'fidelity/plate.mjs', sha256: 'd8108934b968d8ececb324f15f1d06819bbb7c12cf5e4a95b3fe647a44759fed' },
  { name: 'freezeAt', twin: 'fidelity/plate.mjs', sha256: '76a7a3f565fde5fa70a31292e6dbbd1161b74fb38cab1ae4b0b8c2d59ed1365d' },
  { name: 'unfreeze', twin: 'fidelity/plate.mjs', sha256: '95ad1c3bc31e3a2791b562a1f53e7c0c076563c056ad2d1975035212c23f8162' },
  { name: 'ht3Behaviour', twin: 'fidelity.mjs entryJob (A1)', sha256: '2ac69d5ecef772e706606d1250a76f03235b33139edaf239234e8918663e07bd' },
];

const parser = () => {
  const viteRequire = createRequire(createRequire(join(ROOT, 'package.json')).resolve('vite/package.json'));
  return viteRequire('rollup/parseAst').parseAst;
};

/** The current sha256 of every pinned gate group: { key: sha256 }, from parseGate over `src`. */
export async function groupShas(src = readFileSync(join(ROOT, 'scripts/screenshot-gate.mjs'), 'utf8')) {
  const { parseGate } = await import(join(ROOT, 'scripts/gate-blocks.mjs'));
  const { groups, problems } = parseGate(src);
  if (problems.length) throw new Error(`twins: the gate does not parse: ${problems[0]}`);
  return Object.fromEntries(groups.map(g => [g.key, sha(g.statements.map(s => src.slice(s.start, s.end)).join('\n'))]));
}

/** The current sha256 of each named top-level declaration of harness.mjs: { name: sha256 }. */
export function harnessShas(src = readFileSync(join(ROOT, HARNESS_FILE), 'utf8')) {
  const out = {};
  for (const n of parser()(src).body) {
    const d = n.type === 'ExportNamedDeclaration' ? n.declaration : n;
    if (!d) continue;
    const names = d.type === 'FunctionDeclaration' ? [d.id.name] : d.type === 'VariableDeclaration' ? d.declarations.map(x => x.id.name) : [];
    for (const name of names) out[name] = sha(src.slice(d.start, d.end));
  }
  return out;
}

/** B3: one problem per twin whose pinned text changed. */
export async function twinProblems({ gate, harness } = {}) {
  const g = await groupShas(gate), h = harnessShas(harness), out = [];
  for (const t of TWINS) if (g[t.key] !== t.sha256) out.push(`gate group ${t.key} changed (${g[t.key] ?? 'gone'} != pinned ${t.sha256}): re-check the library twin ${t.twin}, re-run B2, then re-pin`);
  for (const t of HARNESS_PINS) if (h[t.name] !== t.sha256) out.push(`harness ${t.name} changed (${h[t.name] ?? 'gone'} != pinned ${t.sha256}): re-check the library twin ${t.twin}, re-run B2, then re-pin`);
  return out;
}
