// LIB-5 S6 (D-LIB5-SPLIT 1): every shown field of a shared module, linted at its ruled sheet path and kind with golden
// B's own lintHowto (imported unchanged) plus the library's medical bans. Each sheet scope a module writes (the card's
// ids, or one variant's) becomes one How-to-shaped object holding only those fields, so the kind caps, the list caps
// (SETUP_MAX_STEPS per shown list), BANNED, the LR-23 patterns and claim wiring all apply as on a real sheet.
import { lintHowto, sourceNamePatterns } from '../../layers/artifact/copy-lint.mjs';
import { medicalBans } from './index.mjs';

/** A card claim ref ('c1' or ['c4', 'c5']) as lintHowto's claim: the union of the claims' tags and sources. Null when a
 *  ref does not resolve. */
export function claimOf(card, ref) {
  const cs = (Array.isArray(ref) ? ref : [ref]).map(id => card.claims?.find(c => c.id === id));
  if (!cs.length || cs.some(c => !c)) return null;
  return { tags: [...new Set(cs.flatMap(c => c.tags ?? []))], sources: [...new Set(cs.flatMap(c => c.sources ?? []))] };
}

/** The sheet scopes of a move module: [{ scope, H }] where H holds the shown fields at their paths. */
function moveScopes(card, exp) {
  const H = (scope, setup) => ({ scope, H: { id: `${card.key}${scope ? `/${scope}` : ''}`, riskFlags: [],
    setup: setup.map(s => ({ text: s.text, claim: claimOf(card, s.claim) ?? undefined })) } });
  const out = [];
  if (exp.setup) out.push(H('', exp.setup));
  for (const [v, va] of Object.entries(exp.variants ?? {})) out.push(H(v, va.setup));
  return out;
}

/** Every lint finding on a shared module export, as [{ path, rule, detail }], each path prefixed with its scope. */
export function sharedShownLint(card, exp, shared) {
  const SOURCES = Object.fromEntries((card.sources ?? []).map(s => [s.id, { cite: s.title }])), out = [];
  for (const { scope, H } of moveScopes(card, exp)) {
    const M = { default: H, SOURCES }, at = p => `${card.key}${scope ? `.variants.${scope}` : ''}: ${p}`;
    out.push(...lintHowto(M, shared, sourceNamePatterns([M])).violations.map(x => ({ path: at(x.path), rule: x.rule, detail: x.detail })));
    out.push(...medicalBans(M).map(x => ({ ...x, path: at(x.path) })));
  }
  return out;
}
