// LIB-5 (Do 4; LIB-5-DESIGN.md g): the hand-rule modules, each its card projected under D-LIB5-SPLIT (card.mjs
// cardExport). Fault keys are D-LIB5-FAULTKEYS's (research 9eaa248). ROPE's handContact and grip are the one ruled
// width.text join (D-LIB5-SPLIT-2 1).
import { cardExport, sharedCard } from './card.mjs';

export const PALM_FLAT = cardExport(sharedCard('palm-flat'));
export const CURL = cardExport(sharedCard('curl'));
export const CUPPED_THUMB = cardExport(sharedCard('cupped-thumb'));
export const ROPE = cardExport(sharedCard('rope-rule'));
