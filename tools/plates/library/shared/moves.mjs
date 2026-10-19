// LIB-5 (Do 4; LIB-5-DESIGN.md g): the equipment-move modules, each its card projected under D-LIB5-SPLIT
// (card.mjs cardExport): steps as setup[] (kind setup), variants as { <v>: { appliesTo, setup } }, and the posture
// captions. A variant's steps follow the card's own steps on the sheets its ids name; the module never merges them.
import { cardExport, sharedCard } from './card.mjs';

export const GET_IN_OUT = cardExport(sharedCard('get-in-out'));
export const SELECTOR_PIN = cardExport(sharedCard('selector-pin'));
export const FOOT_BAR = cardExport(sharedCard('foot-bar'));
export const UNRACK_RERACK = cardExport(sharedCard('unrack-rerack'));
export const DUMBBELL_KICKUP = cardExport(sharedCard('dumbbell-kickup'));
