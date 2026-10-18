// LIB-5 (Do 4; LIB-5-DESIGN.md g): the equipment-move modules. Each export is its card's steps, projected under
// D-LIB5-SPLIT (setup[], kind setup) with the card's own claim refs: { card, appliesTo, setup } for one step list, or
// { card, appliesTo, variants: { <v>: { appliesTo, setup } } }. GET_IN_OUT, UNRACK_RERACK and DUMBBELL_KICKUP wait for
// the research head the supervisor names (D-LIB5-SPLIT 5, lib4-cards.md 14.3).
import { sharedCard, splitOf, stepOf } from './card.mjs';

/** One move card as its module exports it. */
export function moveOf(card) {
  splitOf(card);
  const ref = `shared/${card.key}.json`, out = { card: ref, appliesTo: [...card.appliesTo] };
  if (card.steps) out.setup = card.steps.map((s, i) => stepOf(card, s, `steps[${i}]`));
  if (card.variants) out.variants = Object.fromEntries(Object.entries(card.variants).map(([v, va]) =>
    [v, { appliesTo: [...va.appliesTo], setup: va.steps.map((s, i) => stepOf(card, s, `variants.${v}.steps[${i}]`)) }]));
  if (card.postureArchetype) throw new Error(`${card.key}: moveOf: postureArchetype is not projected yet (it waits for the named research head)`);
  return out;
}

export const SELECTOR_PIN = moveOf(sharedCard('selector-pin'));
export const FOOT_BAR = moveOf(sharedCard('foot-bar'));
