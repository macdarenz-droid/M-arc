// LIB-5 (Do 4; LIB-5-DESIGN.md g): the posture-checkpoint modules, each its card projected under D-LIB5-SPLIT
// (card.mjs cardExport). floor-body's `prone` pointer is data (D-LIB5-SPLIT-2 2).
import { cardExport, sharedCard } from './card.mjs';

export const PRONE = cardExport(sharedCard('prone-checkpoints'));
export const FLOOR_BODY = cardExport(sharedCard('floor-body'));
