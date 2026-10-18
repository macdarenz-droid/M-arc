// LIB-5 (Do 4; LIB-5-DESIGN.md g): the posture-checkpoint modules, each its card projected under D-LIB5-SPLIT
// (card.mjs cardExport). FLOOR_BODY is not exported: floor-body's `prone` field (a pointer to prone-checkpoints.json)
// has no ruled path or data entry, so its split throws until the supervisor rules it.
import { cardExport, sharedCard } from './card.mjs';

export const PRONE = cardExport(sharedCard('prone-checkpoints'));
