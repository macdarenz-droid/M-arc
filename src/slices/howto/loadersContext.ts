// LIB-2 (library plan 5.2: "The HowToSheet budget ... stay[s] unchanged"; D-LIB2-sheet-maps): the lazy loaders module
// HowToSheet awaits on tap, passed down so a section finds its per-chromeId chunk synchronously. The per-id maps live
// in that chunk (generated/loaders.ts), never in the sheet chunk.
import { createContext } from 'preact';

export type HowToLoaders = typeof import('@/howto/generated/loaders');
export const LoadersContext = createContext<HowToLoaders | null>(null);
