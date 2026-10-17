// LIB-4b (D-LIB4-OPEN, B3; D-LIB4b-TWINS, D-LIB4b-MAP): the twin drift tripwire. The per-id checks that live in gate
// blocks cannot be imported, so the runner re-implements them (fidelity/twins/*.mjs, fidelity/plate.mjs, fidelity.mjs).
// Every text they re-implement is pinned in twins/pins.json ({ key: { sha256, map } }): a gate group's text as parseGate
// gives it, or a function's source plus, in file order, every non-exported module-level binding it reaches. A card that
// edits a pinned text re-runs B2 and re-pins in the same PR; its write_scope gains the one path twins/pins.json.
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../../lib/inputs.mjs';

const sha = s => createHash('sha256').update(s).digest('hex');
export const PINS_FILE = 'tools/plates/library/fidelity/twins/pins.json';
export const GATE_FILE = 'scripts/screenshot-gate.mjs';

/** Each pinned text: where it lives and the twin that re-implements it. */
export const TWINS = [
  { key: 'gate:HT-2', twin: 'fidelity.mjs l2Job, sizeJob (T8: A9 chunk = GOLDEN fragments, chunk sizes)' },
  { key: 'gate:HT-3', twin: 'fidelity/plate.mjs, fidelity.mjs (T7: HT-3 thresholds, launch args)' },
  { key: 'gate:HT-6', twin: 'fidelity/twins/ht6.mjs (T2)' },
  { key: 'gate:HT-3b', twin: 'fidelity/twins/offline.mjs, fidelity.mjs sizeJob (T6: A4a, A2)' },
  { key: 'gate:HT-7', twin: 'fidelity/twins/ht7.mjs (T3)' },
  { key: 'gate:HT-4', twin: 'fidelity/twins/ht4.mjs (T1)' },
  { key: 'gate:HT-9', twin: 'fidelity/twins/ht9.mjs (T5)' },
  { key: 'gate:HT-8', twin: 'fidelity/twins/ht8.mjs (T4)' },
  { key: 'tools/plates/fidelity/harness.mjs:ht3Fidelity', twin: 'fidelity/plate.mjs' },
  { key: 'tools/plates/fidelity/harness.mjs:ht3Behaviour', twin: 'fidelity.mjs entryJob (A1, A3 S0 facts)' },
  { key: 'tools/plates/fidelity/ht10.mjs:runHt10', twin: 'fidelity.mjs ht10Job (a2 composition, thresholds)' },
  ...['classifyPose', 'classifyMistakePose', 'validateCalls', 'protectedFieldProblems', 'fragmentProblems'].map(n => ({ key: `tools/plates/fidelity/goldenB.mjs:${n}`, twin: 'fidelity/twins/ht4.mjs (T1, D-LIB4b-POSES)' })),
];

const parser = () => {
  const viteRequire = createRequire(createRequire(join(ROOT, 'package.json')).resolve('vite/package.json'));
  return viteRequire('rollup/parseAst').parseAst;
};

/** A function's pinned text: its declaration plus every non-exported top-level binding it reaches, in file order. */
export function functionText(src, name) {
  const decls = [];
  for (const n of parser()(src).body) {
    const exported = n.type === 'ExportNamedDeclaration', d = exported ? n.declaration : n;
    if (!d) continue;
    const names = d.type === 'FunctionDeclaration' || d.type === 'ClassDeclaration' ? [d.id.name] : d.type === 'VariableDeclaration' ? d.declarations.flatMap(x => (x.id.type === 'Identifier' ? [x.id.name] : [])) : [];
    if (names.length) decls.push({ names, exported, text: src.slice(d.start, d.end), start: d.start });
  }
  const root = decls.find(d => d.names.includes(name));
  if (!root) throw new Error(`twins: no top-level ${name}`);
  const keep = new Set([root]), queue = [root];
  while (queue.length) {
    const t = queue.pop().text;
    for (const d of decls) if (!d.exported && !keep.has(d) && d.names.some(n => new RegExp(`(?<![\\w$.])${n.replace(/\$/g, '\\$')}(?![\\w$])`).test(t))) { keep.add(d); queue.push(d); }
  }
  return [...keep].sort((a, b) => a.start - b.start).map(d => d.text).join('\n');
}

/** The current text of every pinned key; `over` maps a repo path to a replacement source (tests). */
export async function pinnedTexts(over = {}) {
  const read = f => over[f] ?? readFileSync(join(ROOT, f), 'utf8');
  const { parseGate } = await import(join(ROOT, 'scripts/gate-blocks.mjs'));
  const gate = read(GATE_FILE), { groups, problems } = parseGate(gate);
  if (problems.length) throw new Error(`twins: the gate does not parse: ${problems[0]}`);
  const out = {};
  for (const t of TWINS) {
    if (t.key.startsWith('gate:')) {
      const g = groups.find(x => x.key === t.key.slice(5));
      out[t.key] = g ? g.statements.map(s => gate.slice(s.start, s.end)).join('\n') : null;
    } else {
      const [file, name] = t.key.split(':');
      try { out[t.key] = functionText(read(file), name); } catch { out[t.key] = null; }
    }
  }
  return out;
}

export const readPins = () => JSON.parse(readFileSync(join(ROOT, PINS_FILE), 'utf8'));

/** B3: one problem per pinned text that changed (or a pin that is missing). */
export async function twinProblems(over = {}, pins = readPins()) {
  const texts = await pinnedTexts(over), out = [];
  for (const t of TWINS) {
    const now = texts[t.key] == null ? 'gone' : sha(texts[t.key]);
    if (now !== pins[t.key]?.sha256) out.push(`${t.key} changed (${now} != pinned ${pins[t.key]?.sha256}): re-check the library twin ${t.twin}, re-run B2, then re-pin`);
  }
  return out;
}

/** The sha256 of every pinned text now (for re-pinning). */
export const currentShas = async () => Object.fromEntries(Object.entries(await pinnedTexts()).map(([k, v]) => [k, v == null ? null : sha(v)]));
