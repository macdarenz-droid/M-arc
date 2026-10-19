// LIB-5 (Do 4; LIB-5-DESIGN.md g): the implement modules, each its card projected under D-LIB5-SPLIT (card.mjs
// cardExport). implement.text is data and never exported.
import { cardExport, sharedCard } from './card.mjs';

export const BATTLE_ROPES = cardExport(sharedCard('implement-battle-ropes'));
export const JUMP_ROPE = cardExport(sharedCard('implement-jump-rope'));
export const KETTLEBELL_SWING = cardExport(sharedCard('implement-kettlebell-swing'));
export const MEDICINE_BALL_SLAM = cardExport(sharedCard('implement-medicine-ball-slam'));
export const WALL_BALL = cardExport(sharedCard('implement-wall-ball'));
