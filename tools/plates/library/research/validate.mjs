// LIB-5 (S2; LR-27, LR-29, CARD-V2): the research card validator. Shared cards (docs/research/howto/shared/<key>.json)
// are checked for their kind's keys, claim refs, orphan sources, quotes (verbatim, at most 50 words, present in
// quotes/shared-<key>.json) and the LR-23 patterns on every shown field. A card's `wordCap` and `words` are data,
// never a limit (Stops 3): nothing here reads them.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
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

/** Problems with one claim list against its sources and quotes file (shared by shared and per-exercise cards). */
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
      const e = entries.filter(x => x.claim === c.id && x.source === q.source && x.text === q.text);
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
  // A settled box (status other than 'draft') is held to golden B's box cap, imported; the card's own wordCap is data.
  // The draft waits for the owner (decision 6) and is kept out of the app by S4-P, so its count is not judged here.
  if (card.kind === 'red-flag-box' && card.status !== 'draft') {
    const n = words(['name', 'now', 'doctor'].map(f => card.box?.[f]?.text ?? '').join(' '));
    if (n > RED_FLAG_BOX_MAX_WORDS) bad.push(`${tag}: box has ${n} words, at most ${RED_FLAG_BOX_MAX_WORDS}`);
  }
  return bad;
}

/** Reads a shared card and its quotes file from `root` and validates them. */
export function validateSharedFile(file, root = ROOT) {
  const card = JSON.parse(readFileSync(join(root, HOWTO, 'shared', file), 'utf8'));
  const quotes = JSON.parse(readFileSync(join(root, HOWTO, 'quotes', `shared-${card.key}.json`), 'utf8'));
  return validateShared(card, quotes, { file });
}
