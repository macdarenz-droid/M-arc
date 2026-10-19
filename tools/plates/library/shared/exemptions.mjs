// LIB-5 (Do 4; LIB-5-DESIGN.md g): the wrist-range exemption modules, each its card projected under D-LIB5-SPLIT
// (card.mjs cardExport). The exempts object is data (lib4-cards 14.5) and never exported.
import { cardExport, sharedCard } from './card.mjs';

export const FRONT_RACK = cardExport(sharedCard('front-rack-exemption'));
export const WRIST_CURL = cardExport(sharedCard('wrist-curl-exemption'));
