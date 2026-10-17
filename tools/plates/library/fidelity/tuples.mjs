// LIB-4b (card LIB-4b, contract fixed for LIB-4c; D-LIB4-SCOPE): every (id, theme, state) a library id must prove,
// derived from source only (never the DOM): the id's generated plate module (callout and tell keys, the same bytes
// `generate --check` holds to the pinned golden entry), its How-to source (sourceOf: zoom keys, hand pages, feel rows,
// Show buttons), HT_THEMES, HT_FULL and the widths. The runner enumerates the same keys from the DOM, so a key missing
// on either side is a missing row or an extra row, never a silent pass.
// `state` = `<check>/<sub-state>@<width or *>`, unique per (id, theme), because coverProblems keys on id|theme|state.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { HT_FULL, HT_THEMES } from '../../fidelity/harness.mjs';
import { ROOT } from '../../lib/inputs.mjs';
import { rows as registryRows, sourceOf } from '../registry.mjs';

/** The check families (card LIB-4b "Check names"); a row's `check` is one of these. */
export const CHECKS = ['entry', 'L2', 'L2b', 'F3', 'L3', 'L4', 'HT4', 'HT6', 'HT7', 'HT8', 'HT9', 'HT10', 'PQH', 'offline'];
/** HT-3's widths: 390 in every theme, 360 and 340 in HT_FULL (HT-3 card L3). */
export const WIDTH = 390;
export const NARROW = [360, 340];
/** Theme of a row that has no theme (node checks: L2, PQH, HT-4 A5). */
export const NO_THEME = '*';
/** PQ-H rows: one per hard check plus the flags (D-LIB4 correction 1); each passes only when report.ok holds. */
export const PQH_STATES = [...Array(10)].map((_, i) => `PQH/PQ-H${i + 1}@*`).concat('PQH/flags@*');
/** Trace frames (HT-3 L4): 0.6 / 1.2 / 1.8 s in HT_FULL, 2.4 s in every theme. */
export const TRACE_FULL = [600, 1200, 1800];

/** Once-states (fixed contract): per shard the golden self-check rows, once per run LIB-3's browser self-test. */
export const LIB_ONCE = {
  shard: k => [
    { id: `shard-${k}`, theme: 'silent-black', state: 'self/0px@390' },
    { id: `shard-${k}`, theme: 'silent-black', state: 'self/1px-control@390' },
  ],
  run: [{ id: '*', theme: 'silent-black', state: 'qa-selftest/browser@*' }],
};

/** A state's check family and width, parsed back (the runner asserts every row against this). */
export function parseState(state) {
  const m = /^([A-Za-z0-9]+)\/(.+)@(\d+|\*)$/.exec(state);
  if (!m) throw new Error(`tuples: state "${state}" is not <check>/<sub-state>@<width or *>`);
  return { check: m[1], sub: m[2], width: m[3] === '*' ? null : +m[3] };
}

const cueKeys = (text, figure) => {
  const m = new RegExp(`${figure}: \\{[\\s\\S]*?cues: \\[(.*?)\\],\\n`).exec(text);
  if (!m) throw new Error(`tuples: no ${figure} cues in the plate module`);
  return [...m[1].matchAll(/key: "([^"]+)"/g)].map(x => x[1]);
};

/**
 * The source facts of one id: { id, chromeId, normal, tells, hand: { pages } | null, posture: [key], rows: [key],
 * shows, grip, push }. `root`: the repo (a scratch checkout in tests).
 */
export async function sourceFacts(id, { root = ROOT, all = registryRows(root) } = {}) {
  const row = all.find(r => r.id === id);
  if (!row) throw new Error(`tuples: ${id} is not a registry row`);
  const plate = readFileSync(join(root, `src/howto/generated/ht-${row.slug}.ts`), 'utf8');
  const src = (await import(pathToFileURL(join(root, sourceOf(id, root))).href)).default;
  if (src.id !== id) throw new Error(`tuples: ${sourceOf(id, root)} holds ${src.id}, not ${id}`);
  const zooms = src.zooms ?? [];
  const hand = zooms.find(z => z.kind === 'hand');
  const chips = new Map(zooms.map(z => [z.key, z.chip]));
  return {
    id, chromeId: row.chromeId,
    normal: cueKeys(plate, 'normal'), tells: cueKeys(plate, 'mistake'),
    // a hand close-up's pages: one per wrong grip, plus the thumb page (golden B's hand renderer)
    hand: hand ? { pages: hand.hand.wrong.length + (hand.hand.thumbPage ? 1 : 0) } : null,
    posture: zooms.filter(z => z.kind === 'posture').map(z => z.key),
    rows: (src.feel?.rows ?? []).map(r => r.key),
    shows: (src.setup ?? []).filter(s => s.zoom && chips.get(s.zoom)).length,
    grip: !!src.handling,
    push: src.handling?.archetype === 'push' && !!src.handling.cue,
  };
}

/** The states of one id from its source facts, as [{ theme, state }] (no id). */
export function statesOf(f) {
  const out = [], add = (theme, check, sub, w = WIDTH) => out.push({ theme, state: `${check}/${sub}@${w ?? '*'}` });
  add('paper', 'entry', 'open');
  add(NO_THEME, 'L2', 'page', null); add(NO_THEME, 'L2', 'chunk', null);
  for (const s of PQH_STATES) out.push({ theme: NO_THEME, state: s });
  for (const s of ['protected', 'fragments', 'poses']) add(NO_THEME, 'HT4', `A5-${s}`, null);
  add('silent-black', 'offline', 'open');
  for (const t of HT_THEMES) {
    const full = HT_FULL.includes(t);
    // HT-3 (ht3Fidelity): the plate block
    add(t, 'L2b', 'title');
    for (const v of ['N', 'M']) { add(t, 'L2b', v); add(t, 'F3', v); add(t, 'L3', v); }
    add(t, 'L2b', 'sections');
    add(t, 'L4', 'anims'); add(t, 'L3', 'T2400'); add(t, 'L3', 'R-end');
    if (full) {
      for (const [v, keys] of [['N', f.normal], ['M', f.tells]]) for (const k of keys.slice(1)) { add(t, 'L2b', `${v}:${k}`); add(t, 'F3', `${v}:${k}`); add(t, 'L3', `${v}:${k}`); }
      add(t, 'L3', 'slot-api'); add(t, 'L2b', 'M:restore'); add(t, 'F3', 'M:restore'); add(t, 'L3', 'M:restore');
      for (const ms of TRACE_FULL) add(t, 'L3', `T${ms}`);
      add(t, 'L4', 'ends'); add(t, 'L4', 'motion');
      for (const w of NARROW) { for (const v of ['N', 'M']) { add(t, 'L2b', v, w); add(t, 'F3', v, w); add(t, 'L3', v, w); } add(t, 'L2b', 'sections', w); }
    }
    // HT-4 A6: golden-B state driver self-check on the id's layers page
    add(t, 'HT4', 'A6');
    // HT-6: the hand close-up
    if (f.hand) {
      if (f.grip) add(t, 'HT6', 'grip');
      for (let i = 1; i <= f.hand.pages; i++) add(t, 'HT6', `page-${i}`);
      for (const s of ['open-anim', 'close-anim', 'A4', 'chip', 'reduced']) add(t, 'HT6', s);
      if (full) for (const s of ['A4-mistake', 'origin', 'A6']) add(t, 'HT6', s);
      if (t === 'silent-black') { add(t, 'HT6', 'A7-lazy'); add(t, 'HT6', 'back'); }
    }
    if (full) add(t, 'HT6', 'A8-hint');
    // HT-7: each posture close-up
    for (const [i, k] of f.posture.entries()) {
      for (const s of ['L3', 'L4', 'A4', 'restore', 'A5', 'chip']) add(t, 'HT7', `${k}:${s}`);
      if (t === 'paper') add(t, 'HT7', `${k}:reduced`);
      if (t === 'silent-black' && i === 0) add(t, 'HT7', `${k}:control`);
    }
    // HT-8: the feel section
    if (f.rows.length) {
      add(t, 'HT8', 'L4'); add(t, 'HT8', 'S5-end'); add(t, 'HT8', 'S4');
      if (full) { add(t, 'HT8', 'S5-mid'); add(t, 'HT8', 'reduced'); }
      for (const r of f.rows) add(t, 'HT8', `S6-${r}`);
      if (t === 'silent-black') { add(t, 'HT8', 'lazy'); add(t, 'HT8', 'C12'); }
    }
    // HT-9: C19, Setup / Risks / disclaimer (L3 and copy), A3; Show and A5 in HT_FULL; Order once
    add(t, 'HT9', 'C19');
    for (const p of ['setup', 'risks', 'disclaimer']) { add(t, 'HT9', `${p}-L3`); add(t, 'HT9', `${p}-copy`); }
    add(t, 'HT9', 'A3');
    if (full) { for (let n = 1; n <= f.shows; n++) add(t, 'HT9', `show-${n}`); add(t, 'HT9', 'A5'); }
    if (t === 'silent-black') add(t, 'HT9', 'order');
    // HT-10 (HT10_PER_ID)
    for (const s of ['sweep', 'reduced', 'a2']) add(t, 'HT10', s);
  }
  return out;
}

/** Every (id, theme, state) tuple of `ids` (fixed contract). Sorted per id in the order statesOf gives. */
export async function libraryTuples(ids, { root = ROOT } = {}) {
  const all = registryRows(root), out = [];
  for (const id of ids) for (const s of statesOf(await sourceFacts(id, { root, all }))) out.push({ id, ...s });
  const seen = new Set();
  for (const t of out) {
    const k = `${t.id}|${t.theme}|${t.state}`;
    if (seen.has(k)) throw new Error(`libraryTuples: duplicate tuple ${k}`);
    seen.add(k);
  }
  return out;
}
