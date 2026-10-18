// LIB-5 (Do 5; content.md 4, plan 4.4): the add-only library copy lint. Pure functions over a How-to module namespace
// (golden B's shape) and red-flag boxes. Every limit and pattern is golden B's copy-lint.mjs export, imported unchanged;
// none is copied, and no red-flag box limit is defined here (S7). library-gate.mjs runs lintLibraryRow on every
// shipped library row; the vitest sweep runs it, and the variant-line tripwire, on every shipped row (D-LIB5-GATE,
// D-LIB5-VARIANT).
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BANNED, CAPTION_MAX_WORDS, CONTACT_RE, FIX_VERBS, MAX_SENTENCE_WORDS, OWN_RED_FLAG, RED_FLAG_BLOCKS, RED_FLAG_BOX_MAX_WORDS,
  SAFETY_LINE_RE, SOURCE_CS_RE, SOURCE_RE, VISIBLE_WORDS_MAX, copyFields, lintHowto, sentences, sourceNamePatterns, words,
} from '../../layers/artifact/copy-lint.mjs';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
const plain = s => String(s).replace(/<br\s*\/?>/gi, ' ').replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();

/** content.md 4: medical-claim bans in user copy. */
export const MEDICAL_RE = /\bcure[sd]?\b|\bheal(?:s|ed|ing)?\b|\btreats?\b|\brehab\w*|\bdiagnos\w*|\binjury-proof\b|\bprevents? injur\w*/i;
/** D-LIB5-VARIANT8: the two approved golden-B sheets whose equipment has '/', exempt from the variant-line rule only,
 *  matched by exact row id (or `lib_` + card id). */
export const VARIANT_LINE_EXEMPT = ['lib_lat_pulldown', 'lib_leg_press'];

const v = (out, path, rule, detail = '') => out.push({ path, rule, detail });

/** Medical-claim bans over every copy field but research-only source notes. */
export function medicalBans(M) {
  const out = [];
  for (const f of copyFields(M)) if (f.kind !== 'sourceNote' && MEDICAL_RE.test(plain(f.text))) v(out, f.path, 'medical claim (content.md 4)', `"${plain(f.text).match(MEDICAL_RE)[0]}"`);
  return out;
}

/** FIX_VERBS is closed: every feel-row fix starts with one of golden B's verbs (a new verb is a batch-PR edit). */
export function fixVerbs(M) {
  const H = M.default ?? M, out = [];
  for (const [i, r] of (H.feel?.rows ?? []).entries()) {
    const w0 = plain(r.fix ?? '').split(' ')[0].replace(/[^A-Za-z']/g, '').toLowerCase();
    if (!FIX_VERBS.has(w0)) v(out, `feel.rows[${i}](${r.key}).fix`, 'row fix must start with a verb in FIX_VERBS', `"${w0}"`);
  }
  return out;
}

/** D-LIB5-REACH: every rule c7 and C19 apply to a red-flag box, with golden B's exports. `path` names the box. */
export function boxReach(path, box, names = []) {
  const out = [];
  for (const f of ['name', 'now', 'doctor']) if (typeof box?.[f] !== 'string' || !box[f].trim()) v(out, `${path}.${f}`, 'box line missing');
  if (out.length) return out;
  const n = words([box.name, box.now, box.doctor].join(' '));
  if (n > RED_FLAG_BOX_MAX_WORDS) v(out, path, `red-flag box > ${RED_FLAG_BOX_MAX_WORDS} words`, `${n} words`);
  if (!/today/i.test(box.now)) v(out, `${path}.now`, 'the urgent line must say "today"');
  if (!/doctor/i.test(box.doctor)) v(out, `${path}.doctor`, 'the doctor line must say "doctor"');
  for (const f of ['name', 'now', 'doctor']) {
    const t = plain(box[f]);
    for (const [rule, re] of BANNED) if (re.test(t)) v(out, `${path}.${f}`, `banned: ${rule}`, `"${t.match(re)[0]}"`);
    for (const s of sentences(t)) if (words(s) > MAX_SENTENCE_WORDS) v(out, `${path}.${f}`, `sentence > ${MAX_SENTENCE_WORDS} words`, `${words(s)} words`);
    if (CONTACT_RE.test(t)) v(out, `${path}.${f}`, 'no contact or emergency wording (LR-23)', `"${t.match(CONTACT_RE)[0]}"`);
    for (const re of [SOURCE_RE, SOURCE_CS_RE]) if (re.test(t)) v(out, `${path}.${f}`, 'no source or evidence wording (LR-23)', `"${t.match(re)[0]}"`);
    if (SAFETY_LINE_RE.test(t)) v(out, `${path}.${f}`, 'no call, phone, GP, clinic or hospital in a red-flag box (LR-23)', `"${t.match(SAFETY_LINE_RE)[0]}"`);
    for (const [nm, re] of names) if (re.test(t)) v(out, `${path}.${f}`, 'names a registry source (LR-23)', `"${nm}"`);
  }
  return out;
}

/** The red-flag box a flag shows: golden B's shared block, or one of `extraBoxes` (flags RED_FLAG_BLOCKS lacks). */
const boxOf = (flag, shared, extraBoxes) => (RED_FLAG_BLOCKS[flag] ? shared[RED_FLAG_BLOCKS[flag].exp] : extraBoxes[flag]);

/** D-LIB5-WORDS: the visible total with every box the sheet shows. lintHowto drops a flag RED_FLAG_BLOCKS lacks
 *  (copy-lint.mjs:313), so each such box is added here; a flag with no box is a violation, never 0 words. */
export function sheetWords(M, shared, extraBoxes = {}) {
  const H = M.default ?? M, out = [];
  let total = lintHowto(M, shared).words.total;
  for (const f of H.riskFlags ?? ['wrist']) {
    if (RED_FLAG_BLOCKS[f]) continue;
    const B = extraBoxes[f];
    if (!B) { v(out, `riskFlags(${f})`, 'no red-flag box for this flag'); continue; }
    total += words([B.name, B.now, B.doctor].join(' '));
  }
  if (total > VISIBLE_WORDS_MAX) v(out, '(sheet)', `visible words > ${VISIBLE_WORDS_MAX}`, `${total}`);
  return { total, violations: out };
}

/** D-LIB5-VARIANT: the caption-class variant line. `line` comes from one accessor (undefined until the field card). */
export function variantLine({ id, equipment, line, names = [] }) {
  const out = [], slash = String(equipment ?? '').includes('/'), t = typeof line === 'string' ? plain(line) : '', n = t ? words(t) : 0;
  if (VARIANT_LINE_EXEMPT.includes(id)) return { violations: out, words: n };
  if (slash && n === 0) v(out, 'variantLine', 'variant line required: equipment names two kinds', String(equipment));
  if (!slash && n > 0) v(out, 'variantLine', 'variant line on a row whose equipment names one kind', String(equipment));
  if (n > CAPTION_MAX_WORDS) v(out, 'variantLine', `caption > ${CAPTION_MAX_WORDS} words`, `${n} words`);
  if (t) {
    for (const [rule, re] of BANNED) if (re.test(t)) v(out, 'variantLine', `banned: ${rule}`, `"${t.match(re)[0]}"`);
    if (OWN_RED_FLAG.test(t)) v(out, 'variantLine', 'own red-flag wording (link the shared box, C8)', `"${t.match(OWN_RED_FLAG)[0]}"`);
    if (CONTACT_RE.test(t)) v(out, 'variantLine', 'no contact or emergency wording (LR-23)', `"${t.match(CONTACT_RE)[0]}"`);
    for (const re of [SOURCE_RE, SOURCE_CS_RE]) if (re.test(t)) v(out, 'variantLine', 'no source or evidence wording (LR-23)', `"${t.match(re)[0]}"`);
    for (const [nm, re] of names) if (re.test(t)) v(out, 'variantLine', 'names a registry source (LR-23)', `"${nm}"`);
    if (MEDICAL_RE.test(t)) v(out, 'variantLine', 'medical claim (content.md 4)', `"${t.match(MEDICAL_RE)[0]}"`);
  }
  return { violations: out, words: n };
}
/** The one accessor for a row's variant line: no shown field exists yet (D-LIB5-VARIANT 4). */
export const variantLineOf = () => undefined;
/** The ids among `eightIds` whose exercises.json equipment contains '/' (D-LIB5-VARIANT8). */
export const eightWithSlash = (eightIds, exercises) => eightIds.filter(id => String(exercises.find(e => e.id === id)?.equipment ?? '').includes('/')).sort();

/** D-LIB5-FAMILY (2): a row that declares inheritance is refused until a ruled comparator exists. `readCard(path)` reads
 *  the card the How-to's research.card names (as candidate.mjs researchOf reads it), or returns null. */
export function familyRefusal(id, content, readCard) {
  if (content.extends !== undefined) return `${id}: family: extends: inherited-string map not ruled (D-LIB5-FAMILY)`;
  const card = typeof content.research?.card === 'string' ? readCard(content.research.card) : null;
  if (card && card.inherit !== undefined && !(Array.isArray(card.inherit) && card.inherit.length === 0)) return `${id}: family: ${content.research.card}#inherit: inherited-string map not ruled (D-LIB5-FAMILY)`;
  return null;
}
/** The card at a repo-relative path under `root`, or null when it is missing. */
export const cardReader = (root = ROOT) => p => { try { return JSON.parse(readFileSync(join(root, p), 'utf8')); } catch { return null; } };

/** Rule (a): one label per fault.key across `sources` = [{ src, faults: [{ key, label }] }]. */
export function familyLabels(sources) {
  const seen = new Map(), out = [];
  for (const { src, faults } of sources) for (const f of faults) {
    const at = seen.get(f.key);
    if (!at) seen.set(f.key, { label: f.label, src });
    else if (at.label !== f.label) v(out, `fault ${f.key}`, 'one label per fault key (content.md 4, family consistency)', `"${f.label}" (${src}) vs "${at.label}" (${at.src})`);
  }
  return out;
}

/** Every library rule for one shipped library row (golden B's own lint included), as [{ path, rule, detail }]. */
export function lintLibraryRow(M, shared, { extraBoxes = {} } = {}) {
  const H = M.default ?? M, names = sourceNamePatterns([M]), out = [];
  out.push(...lintHowto(M, shared, names).violations.map(x => ({ path: x.path, rule: x.rule, detail: x.detail })));
  out.push(...medicalBans(M), ...fixVerbs(M));
  for (const f of H.riskFlags ?? ['wrist']) { const B = boxOf(f, shared, extraBoxes); if (B) out.push(...boxReach(`redFlag(${f})`, B, names)); }
  out.push(...sheetWords(M, shared, extraBoxes).violations.filter(x => x.path !== '(sheet)' || !out.some(y => y.path === '(sheet)')));
  return out;
}
