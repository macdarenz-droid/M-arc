// LIB-5 (S2; LR-27, LR-29, CARD-V2): the research card validator. Shared cards (docs/research/howto/shared/<key>.json)
// are checked for their kind's keys, claim refs, orphan sources, quotes (verbatim, at most 50 words, present in
// quotes/shared-<key>.json) and the LR-23 patterns on every shown field. A card's `wordCap` and `words` are data,
// never a limit (Stops 3): nothing here reads them.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { boxCapOf } from '../lint/box-caps.mjs';
import { CONTACT_RE, RED_FLAG_BOX_MAX_WORDS, SAFETY_LINE_RE, SOURCE_CS_RE, SOURCE_RE, words } from '../../layers/artifact/copy-lint.mjs';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const HOWTO = 'docs/research/howto';
export const QUOTE_MAX_WORDS = 50;   // CARD-V2: "every claim has at least one source with a verbatim quote of at most 50 words"

const COMMON = ['key', 'kind', 'appliesTo', 'appliesToWhy', 'claims', 'sources', 'gaps', 'notes'];
/** LR-29 kinds: the keys each kind must carry and the further keys it may carry (content.md 2.1's unit fields). */
export const SHARED_KINDS = {
  hand: { required: ['gripLine', 'cue'], allowed: ['alternative', 'archetype', 'byRule', 'contactPoint', 'faults', 'fingers', 'grip', 'handContact', 'handle', 'loadAxis', 'rightPose', 'soreWrist', 'thumbMode', 'thumbRule', 'widthNote', 'wrist'] },
  contact: { required: ['defaultCheckpoints'], allowed: ['defaultCrop', 'prone'] },
  implement: { required: ['implement', 'gripLine', 'cue', 'rightPose', 'handRisks'], allowed: ['contactPoint', 'faults', 'thumbRule', 'wrist'] },
  'equipment-move': { required: ['move'], oneOf: ['steps', 'variants'], allowed: ['postureArchetype', 'steps', 'variants'] },
  exemption: { required: ['exempts', 'reason', 'replacementRule', 'faults'], allowed: [] },
  checkpoints: { required: ['checkpoints'], allowed: [] },
  'red-flag-box': { required: ['box', 'status'], allowed: [] },
};
/** Keys whose values are research data, never shown (LR-28; the note's SPLIT data list), or identifiers. */
export const DATA_KEYS = new Set(['key', 'kind', 'status', 'claims', 'sources', 'gaps', 'notes', 'appliesTo', 'appliesToWhy', 'claim',
  'move', 'archetype', 'loadAxis', 'thumbMode', 'handle', 'byRule', 'byInference', 'notFor', 'exempts', 'prone', 'implement', 'wordCap', 'words', 'boxClaim']);
const PATTERNS = [['CONTACT_RE', CONTACT_RE], ['SOURCE_RE', SOURCE_RE], ['SOURCE_CS_RE', SOURCE_CS_RE], ['SAFETY_LINE_RE', SAFETY_LINE_RE]];

/** Every `claim` value in the card outside `claims`, as [path, id]. A value is one id or a list of ids. */
export function claimRefs(card) {
  const out = [];
  const walk = (o, p) => {
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${p}[${i}]`));
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) {
      if (p === '' && (k === 'claims' || k === 'sources')) continue;
      const q = p ? `${p}.${k}` : k;
      if (k === 'claim') for (const id of [].concat(v)) out.push([q, id]);
      else walk(v, q);
    }
  };
  walk(card, '');
  return out;
}

/** Every shown string leaf (not under a data key), as [path, text]. */
export function shownStrings(card) {
  const out = [];
  const walk = (o, p) => {
    if (typeof o === 'string') return out.push([p, o]);
    if (Array.isArray(o)) return o.forEach((x, i) => walk(x, `${p}[${i}]`));
    if (!o || typeof o !== 'object') return;
    for (const [k, v] of Object.entries(o)) if (!DATA_KEYS.has(k)) walk(v, p ? `${p}.${k}` : k);
  };
  walk(card, '');
  return out;
}

/** Problems with one claim list against its sources and quotes file (shared by shared and per-exercise cards; a quotes
 *  entry holds its words in `text` (shared) or `quote` (per-exercise)). */
function claimProblems(card, quotes, tag) {
  const bad = [], ids = new Set(), srcIds = new Set((card.sources ?? []).map(s => s.id)), cited = new Set();
  if (!Array.isArray(card.claims) || !card.claims.length) return [`${tag}: no claims`];
  for (const s of card.sources ?? []) {
    if (!s.id || !s.url) bad.push(`${tag}: source ${s.id ?? '?'} has no id or url`);
    if (!['full', 'abstract', 'summary', 'unreachable'].includes(s.access)) bad.push(`${tag}: source ${s.id}: access ${JSON.stringify(s.access)}`);
    if (typeof s.checked !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s.checked)) bad.push(`${tag}: source ${s.id}: checked ${JSON.stringify(s.checked)}`);
  }
  const entries = quotes?.quotes ?? [];
  for (const c of card.claims) {
    if (ids.has(c.id)) bad.push(`${tag}: claim ${c.id} twice`);
    ids.add(c.id);
    if (!Array.isArray(c.sources) || !c.sources.length) bad.push(`${tag}: claim ${c.id} has no source`);
    for (const s of c.sources ?? []) { cited.add(s); if (!srcIds.has(s)) bad.push(`${tag}: claim ${c.id} cites unknown source ${s}`); }
    if (!Array.isArray(c.quotes) || !c.quotes.length) bad.push(`${tag}: claim ${c.id} has no quote`);
    for (const q of c.quotes ?? []) {
      const n = words(q.text ?? '');
      if (n > QUOTE_MAX_WORDS) bad.push(`${tag}: claim ${c.id} quote from ${q.source} has ${n} words, at most ${QUOTE_MAX_WORDS}`);
      if (!(c.sources ?? []).includes(q.source)) bad.push(`${tag}: claim ${c.id} quote from ${q.source}, which the claim does not cite`);
      const e = entries.filter(x => x.claim === c.id && x.source === q.source && (x.text ?? x.quote) === q.text);
      if (!e.length) bad.push(`${tag}: claim ${c.id} quote from ${q.source} is not in its quotes file`);
      else if (!e.some(x => x.status === 'verbatim')) bad.push(`${tag}: claim ${c.id} quote from ${q.source} is not marked verbatim`);
    }
  }
  for (const s of srcIds) if (!cited.has(s)) bad.push(`${tag}: orphan source ${s} (no claim cites it)`);
  for (const [p, id] of claimRefs(card)) if (!ids.has(id) && !/^inherit:\d+$/.test(id)) bad.push(`${tag}: ${p} names unknown claim ${id}`);
  return bad;
}

/** S2: every problem with one shared card and its quotes file. `file` is the card's file name (key.json). */
export function validateShared(card, quotes, { file } = {}) {
  const tag = `shared/${file ?? `${card?.key}.json`}`, bad = [], spec = SHARED_KINDS[card?.kind];
  if (!spec) return [`${tag}: unknown kind ${JSON.stringify(card?.kind)}`];
  if (file && file !== `${card.key}.json`) bad.push(`${tag}: key ${card.key} does not match the file name`);
  for (const k of [...COMMON, ...spec.required]) if (!(k in card)) bad.push(`${tag}: ${card.kind} card lacks ${k}`);
  if (spec.oneOf && !spec.oneOf.some(k => k in card)) bad.push(`${tag}: ${card.kind} card needs one of ${spec.oneOf.join(', ')}`);
  const known = new Set([...COMMON, ...spec.required, ...spec.allowed]);
  for (const k of Object.keys(card)) if (!known.has(k)) bad.push(`${tag}: ${card.kind} card has unknown key ${k}`);
  if (!Array.isArray(card.appliesTo)) bad.push(`${tag}: appliesTo is not a list`);
  if (quotes?.id !== `shared-${card.key}`) bad.push(`${tag}: quotes file id ${JSON.stringify(quotes?.id)}, want shared-${card.key}`);
  bad.push(...claimProblems(card, quotes, tag));
  for (const [p, t] of shownStrings(card)) for (const [name, re] of PATTERNS) if (re.test(t)) bad.push(`${tag}: ${p}: ${name} hit "${t.match(re)[0]}"`);
  // A settled box (status other than 'draft') is held to its key's cap (BOX-CAP: boxCapOf, golden B's imported cap for
  // every key but a named one); the card's own wordCap is data.
  // The draft waits for the owner (decision 6) and is kept out of the app by S4-P, so its count is not judged here.
  if (card.kind === 'red-flag-box' && card.status !== 'draft') {
    const n = words(['name', 'now', 'doctor'].map(f => card.box?.[f]?.text ?? '').join(' '));
    const cap = boxCapOf(card.key, RED_FLAG_BOX_MAX_WORDS);
    if (n > cap) bad.push(`${tag}: box has ${n} words, at most ${cap}`);
  }
  return bad;
}

/** Reads a shared card and its quotes file from `root` and validates them. */
export function validateSharedFile(file, root = ROOT) {
  const card = JSON.parse(readFileSync(join(root, HOWTO, 'shared', file), 'utf8'));
  const quotes = JSON.parse(readFileSync(join(root, HOWTO, 'quotes', `shared-${card.key}.json`), 'utf8'));
  return validateShared(card, quotes, { file });
}

/** S9 (C17, C19 keep URLs out of src): one source id means one URL across the registry and every card.
 *  `sets` = [{ where, sources: [{ id, url }] }]; a registry map { id: { url } } can be passed as one set. */
export function registryProblems(sets) {
  const seen = new Map(), bad = [];
  for (const { where, sources } of sets) for (const s of sources) {
    const at = seen.get(s.id);
    if (!at) seen.set(s.id, { url: s.url, where });
    else if (at.url !== s.url) bad.push(`source ${s.id}: ${where} has ${s.url}, ${at.where} has ${at.url}`);
  }
  return bad;
}

/** The sets registryProblems reads under `root`: sources.json (its GENERATED header stripped) and every shared card. */
export function registrySets(root = ROOT) {
  const reg = JSON.parse(readFileSync(join(root, HOWTO, 'sources.json'), 'utf8').replace(/^\/\/[^\n]*\n/, ''));
  const shared = readdirSync(join(root, HOWTO, 'shared')).sort().map(f => ({ where: `shared/${f}`, sources: JSON.parse(readFileSync(join(root, HOWTO, 'shared', f), 'utf8')).sources }));
  return [{ where: 'sources.json', sources: Object.entries(reg).map(([id, s]) => ({ id, url: s.url })) }, ...shared];
}

/* ------------------------------------------------- the 8's machine cards (Do 3 b; D-LIB9-CARDFIELDS, D-LIB5-TEMPO8) - */
/** The three top-level keys researchOf reads (candidate.mjs:44-48). */
export const MACHINE_KEYS = ['plateFacts', 'tempo', 'topFault'];

/** D-LIB5-TEMPO8 (lib4-cards 14.7 rows 1-8, research 9eaa248): the builder's copy of the ruled 8-row tempo map, keyed
 *  by lib id. Each spec phase in order: { phase, move?: true, from: 'up' | 'down' | 'pause' } takes that field of the
 *  card's verified plate.tempo; { phase, constant, claim } is a ruled constant with its verified claim; { phase,
 *  from: null } has no verified source, so the build throws and the id stops. null: no spec (H6:not-engine). */
export const TEMPO8 = {
  lib_dumbbell_lateral_raise: null,
  lib_barbell_back_squat: [{ phase: 'Lower', move: true, from: 'down' }, { phase: 'Drive up', move: true, from: 'up' }, { phase: 'Brace', from: 'pause' }],
  lib_pull_up: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Lower', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_hanging_leg_raise: [{ phase: 'Lift', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Lower', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_lat_pulldown: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_seated_cable_row: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_leg_press: [{ phase: 'Lower', move: true, from: 'down' }, { phase: 'Pause', constant: 1, claim: 'c15' }, { phase: 'Press', move: true, from: 'up' }, { phase: 'Rest', from: 'pause' }],
  lib_machine_chest_press: [{ phase: 'Press', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
};

/** The tempo array one map row builds from a card's plate.tempo, in H6's shape ({phase, s, move: true} or {phase, s};
 *  qa/node.mjs:174 compares by JSON.stringify). A moving phase takes up or down only; a pause-mapped phase is left
 *  out when pause is 0 (Q3); a { from: null } phase throws. null for a null row. */
export function buildTempo(id, row, plateTempo) {
  if (row === null) return null;
  if (!Array.isArray(row)) throw new Error(`${id}: tempo: no ruled map row`);
  const out = [];
  for (const e of row) {
    if (e.from === null) throw new Error(`${id}: tempo: ${e.phase} has no verified source`);
    if ('constant' in e) {
      if (e.move) throw new Error(`${id}: tempo: ${e.phase} moves, so it takes up or down, never a constant`);
      if (typeof e.constant !== 'number' || !e.claim) throw new Error(`${id}: tempo: ${e.phase}'s constant needs seconds and a claim`);
      out.push({ phase: e.phase, s: e.constant });
      continue;
    }
    if (!['up', 'down', 'pause'].includes(e.from)) throw new Error(`${id}: tempo: ${e.phase} maps to ${JSON.stringify(e.from)}`);
    if (e.move && e.from === 'pause') throw new Error(`${id}: tempo: ${e.phase} moves, so it takes up or down`);
    const s = plateTempo?.[e.from];
    if (typeof s !== 'number') throw new Error(`${id}: tempo: plate.tempo.${e.from} is not a number`);
    if (e.from === 'pause' && s === 0) continue;
    out.push(e.move ? { phase: e.phase, s, move: true } : { phase: e.phase, s });
  }
  return out;
}

/** D-LIB5-TEMPO8 14.7 item 15: one form per fact. An angle fact is `measure: true` or names a `joint`, never both. */
export function factFormProblems(facts) {
  const bad = [];
  for (const [i, f] of (facts ?? []).entries()) {
    if (f.kind !== 'angle') continue;
    if (f.measure === true && f.joint !== undefined) bad.push(`plateFacts[${i}]: both joint and measure (one form per fact)`);
    if (f.measure !== true && f.joint === undefined) bad.push(`plateFacts[${i}]: neither joint nor measure`);
    if (f.measure !== undefined && f.measure !== true) bad.push(`plateFacts[${i}]: measure is ${JSON.stringify(f.measure)}, only true`);
  }
  return bad;
}

/** S2 for one per-exercise card and its quotes file (CARD-V2): its claims, sources and quotes, and its machine fields
 *  when present (plateFacts non-empty, each fact naming a known claim, one form per fact; tempo entries in H6's shape
 *  with no claim key; topFault a key). `file` is the card's file name (<id>.json). */
export function validateCard(card, quotes, { file } = {}) {
  const tag = `cards/${file ?? `${card?.id}.json`}`, bad = [];
  if (file && file !== `${card.id}.json`) bad.push(`${tag}: id ${card.id} does not match the file name`);
  if (quotes?.id !== card.id) bad.push(`${tag}: quotes file id ${JSON.stringify(quotes?.id)}, want ${card.id}`);
  bad.push(...claimProblems(card, quotes, tag));
  const ids = new Set((card.claims ?? []).map(c => c.id));
  if ('plateFacts' in card) {
    // F-PLATEFACTS (D-PLATEFACTS-EMPTY): [] is a verified "no fact" (D-LIB8M-NOFACTS, #109 6257000888), as H6 reads it; a non-list stays red
    const facts = Array.isArray(card.plateFacts) ? card.plateFacts : [];
    if (!Array.isArray(card.plateFacts)) bad.push(`${tag}: plateFacts is not a list`);
    for (const [i, f] of facts.entries()) {
      const refs = [].concat(f.claim ?? []);
      if (!refs.length) bad.push(`${tag}: plateFacts[${i}] names no claim`);
      for (const r of refs) if (!ids.has(r)) bad.push(`${tag}: plateFacts[${i}] names unknown claim ${r}`);
    }
    bad.push(...factFormProblems(facts).map(x => `${tag}: ${x}`));
  }
  if ('plateFacts' in card !== 'tempo' in card) bad.push(`${tag}: plateFacts and tempo go in together or not at all`);
  if ('tempo' in card) {
    if (!Array.isArray(card.tempo) || !card.tempo.length) bad.push(`${tag}: tempo is empty or not a list`);
    for (const [i, t] of (card.tempo ?? []).entries()) {
      const keys = Object.keys(t).join();
      if (keys !== 'phase,s,move' && keys !== 'phase,s') bad.push(`${tag}: tempo[${i}] keys ${keys}, want phase,s[,move]`);
      if ('move' in t && t.move !== true) bad.push(`${tag}: tempo[${i}].move is ${JSON.stringify(t.move)}`);
    }
  }
  if ('topFault' in card && (typeof card.topFault !== 'string' || !card.topFault)) bad.push(`${tag}: topFault is not a key`);
  return bad;
}

/** Reads a per-exercise card and its quotes file from `root` and validates them. */
export function validateCardFile(file, root = ROOT) {
  const card = JSON.parse(readFileSync(join(root, HOWTO, 'cards', file), 'utf8'));
  const quotes = JSON.parse(readFileSync(join(root, HOWTO, 'quotes', file), 'utf8'));
  return validateCard(card, quotes, { file });
}
