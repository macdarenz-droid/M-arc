// D-LIB-A16-REGISTRY (#326 6405804435): the shared registry of the build-ahead cards' eq/ composers
// (tests/howto/fixtures/eq-composers.json, read as data, never imported), read by every lane's A16 block in place of a hand-copied OTHER_CARDS list.
import { readFileSync } from 'node:fs';

export const EQ_COMPOSERS_PATH = 'tests/howto/fixtures/eq-composers.json';
export const CARDS = ['LIB-14', 'LIB-15', 'LIB-16', 'LIB-17', 'LIB-18', 'LIB-21', 'LIB-22'];

/** Shape problems of a registry: the card names exactly CARDS, each a list of names, each name under exactly one card. */
export function registryProblems(reg: any): string[] {
  const out: string[] = [], cards = reg?.cards;
  if (!cards || typeof cards !== 'object') return ['no cards'];
  const keys = Object.keys(cards);
  for (const k of keys) if (!CARDS.includes(k)) out.push(`unknown card ${k}`);
  for (const k of CARDS) if (!keys.includes(k)) out.push(`missing card ${k}`);
  const seen = new Map<string, string>();
  for (const [k, names] of Object.entries<any>(cards)) {
    if (!Array.isArray(names) || names.some(n => typeof n !== 'string' || !/^[A-Za-z][A-Za-z0-9]*$/.test(n))) { out.push(`${k}: not a list of names`); continue; }
    for (const n of names) { if (seen.has(n)) out.push(`${n} under ${seen.get(n)} and ${k}`); else seen.set(n, k); }
  }
  return out;
}

/** The registry, shape-checked (throws on a bad shape). */
export function eqRegistry(path = EQ_COMPOSERS_PATH): Record<string, string[]> {
  const reg = JSON.parse(readFileSync(path, 'utf8')), bad = registryProblems(reg);
  if (bad.length) throw new Error(`${path}: ${bad.join('; ')}`);
  return reg.cards;
}

/** OTHER_CARDS for an A16 block: every card's composers but `own`'s. */
export const otherCards = (own: string, cards = eqRegistry()): Record<string, string[]> => Object.fromEntries(Object.entries(cards).filter(([k]) => k !== own));
