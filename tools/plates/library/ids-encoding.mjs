// LIB-2 (library plan 5.2; rulings D-LIB2-hints, D-LIB2-hints-2): ids.ts's encoding, shared by gen/ids.mjs (which
// writes ids.ts and its Node twin) and gen/content.mjs (ids.ts's second writer, which renders the push hints).
import { header } from '../lib/inputs.mjs';
import { EXERCISES_JSON } from './registry.mjs';

export const LABEL = 'How to do it';
/** The ids.ts limit (plan 2.9), raw bytes of the file as written, its GENERATED header included. */
export const IDS_MAX = 2048;
/** ids.ts's writers (content.mjs writes it last, with the hints), as the core's header names them. */
export const IDS_WRITERS = ['tools/plates/gen/content.mjs', 'tools/plates/gen/ids.mjs'];

/** The decoder, as source text, one template for both twins (`ts` adds the TypeScript annotations; D-LIB2-hints):
 *  FNV-1a 32-bit over UTF-16 code units, xor-folded to 24 bits, 4 characters of 6 bits each (char code 48 + bits;
 *  plan 5.2's 4-character fallback). `at` is the id's index in S, -1 when it does not ship; the hinted ids come first
 *  in S, and O holds one character per hinted id: 'A' + the index of its text in H, the texts deduplicated. */
const decoderSrc = ts => `function at(s${ts ? ': string' : ''})${ts ? ': number' : ''} {
  if (!s.startsWith('lib_')) return -1;
  let x = 0x811c9dc5, t = '';
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  for (x = (x ^ (x >>> 24)) & 0xffffff; t.length < 4; x >>= 6) t = String.fromCharCode(48 + (x & 63)) + t;
  for (let i = 0; i < S.length; i += 4) if (S.startsWith(t, i)) return i / 4;
  return -1;
}
export function hasHowTo(id${ts ? ': string' : ''})${ts ? ': id is HowToId' : ''} { return at(id) >= 0; }
export function howToHint(id${ts ? ': string' : ''})${ts ? ': string | undefined' : ''} { return H[O.charCodeAt(at(id)) - 65]; }`;

/** The 4-character hash of an id (the same function both twins carry). */
export function idHash(s) {
  let x = 0x811c9dc5, t = '';
  for (let i = 0; i < s.length; i++) x = Math.imul(x ^ s.charCodeAt(i), 0x01000193) >>> 0;
  for (x = (x ^ (x >>> 24)) & 0xffffff; t.length < 4; x >>= 6) t = String.fromCharCode(48 + (x & 63)) + t;
  return t;
}

/** The S literal for `shipped` (in that order), refusing a collision between a shipped id and any other
 *  exercises.json id. */
export function setOf(shipped, allIds) {
  if (shipped.length === 0) throw new Error('ids: no shipped ids');
  const byHash = new Map();
  for (const id of allIds) {
    const t = idHash(id);
    if (byHash.has(t)) {
      const other = byHash.get(t);
      if (shipped.includes(id) || shipped.includes(other)) throw new Error(`ids: hash collision ${t} between ${other} and ${id}; salt or widen the hash (plan 5.2)`);
    }
    byHash.set(t, id);
  }
  for (const id of shipped) if (!allIds.includes(id)) throw new Error(`ids: shipped id ${id} is not in ${EXERCISES_JSON}`);
  return shipped.map(idHash).join('');
}

/** The literals both twins carry: S (the hinted shipped ids first, then the rest, each group in shipped order), H (the
 *  distinct hint texts, first use first) and O (one index character per hinted id). `hints`: shipped id -> text. */
export function literals(shipped, allIds, hints = {}) {
  const unknown = Object.keys(hints).filter(id => !shipped.includes(id));
  if (unknown.length) throw new Error(`ids: hints for ids that do not ship: ${unknown.join(', ')}`);
  const hinted = shipped.filter(id => typeof hints[id] === 'string' && hints[id]);
  const order = [...hinted, ...shipped.filter(id => !hinted.includes(id))];
  const texts = [...new Set(hinted.map(id => hints[id]))];
  if (texts.length > 26) throw new Error(`ids: ${texts.length} distinct hint texts, over the 26 one index letter holds; share hint text per archetype`);
  return { S: setOf(order, allIds), H: texts, O: hinted.map(id => String.fromCharCode(65 + texts.indexOf(hints[id]))).join('') };
}

export const idsText = ({ S, H, O }) => `// Main-bundle How-to module (plan 2.9, 5.2): 4-char hashes of the shipped ids, hinted ids first.
export type HowToId = string & { readonly __howTo: true };
export const HOWTO_LABEL = ${JSON.stringify(LABEL)};
const S = ${JSON.stringify(S)};
const H = ${JSON.stringify(H)};
const O = ${JSON.stringify(O)};
${decoderSrc(true)}
`;

export const idsNodeText = ({ S, H, O }) => `// Node twin of src/howto/ids.ts (tests and the gate's harness): the same literals and decoder template, emitted
// together by tools/plates/gen/ids.mjs (D-LIB2-hints).
const S = ${JSON.stringify(S)};
const H = ${JSON.stringify(H)};
const O = ${JSON.stringify(O)};
${decoderSrc(false)}
`;

/** ids.ts and its Node twin with the hints, refusing an ids.ts over IDS_MAX raw (ruling D-LIB2-hints-2). */
export function hintsOutputs(hints, shipped, allIds) {
  const lit = literals(shipped, allIds, hints);
  return { ids: idsBudget(idsText(lit), header('src/howto/ids.ts', IDS_WRITERS, '0'.repeat(64)), lit.H.length), node: idsNodeText(lit) };
}

/** ids.ts as written (header included) must fit IDS_MAX raw bytes; refuses it otherwise (ruling D-LIB2-hints-2).
 *  `head` is the core's header line for ids.ts (its length does not depend on the hash). Returns `text`. */
export function idsBudget(text, head, distinct) {
  const size = Buffer.byteLength(head + text);
  if (size > IDS_MAX) throw new Error(`ids: src/howto/ids.ts would be ${size} B raw, over its ${IDS_MAX} B limit (plan 2.9), with ${distinct} distinct hint text(s); share the hint text per archetype, or shorten it (D-LIB2-hints)`);
  return text;
}
