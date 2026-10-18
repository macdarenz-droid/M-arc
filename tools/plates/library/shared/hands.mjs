// LIB-5 (Do 4; LIB-5-DESIGN.md g): the hand-rule modules, each its card projected under D-LIB5-SPLIT (card.mjs
// cardExport). Fault keys are D-LIB5-FAULTKEYS's (research 9eaa248). ROPE is not exported: rope-rule maps grip and
// handContact to handling.width.text, so its split throws (D-LIB5-SPLIT 4) until the supervisor rules the card.
import { cardExport, sharedCard } from './card.mjs';

export const PALM_FLAT = cardExport(sharedCard('palm-flat'));
export const CURL = cardExport(sharedCard('curl'));
export const CUPPED_THUMB = cardExport(sharedCard('cupped-thumb'));
