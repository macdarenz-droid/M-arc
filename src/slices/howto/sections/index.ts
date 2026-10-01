// The How-to sheet's sections below the tempo (plan 2.4, items 3-8), in sheet order. HT-3 ships it empty;
// each layer card adds one line here (keep both sides when merging). Golden B's order (supervisor ruling on
// #113, 2026-10-01): Look closer chips + Grip (HT-6) -> Feel (HT-8, not merged yet) -> Setup (HT-9) -> Risks
// (HT-9). Setup used to sit first; that pushed HT-6's "Look closer" chip row down by Setup's own height and
// broke HT-6's pinned "open from Mistake" transform-origin check (docs/COACHING-DECISIONS.md).
import type { FunctionComponent } from 'preact';
import type { BuiltHowTo } from '@/howto/types';
import { Setup } from './Setup';
import { HandSections } from './Hand';
import { Risks } from './Risks';

export interface SectionProps {
  readonly howTo: BuiltHowTo;
}

export interface SectionDef {
  /** Stable id, also the section element's `data-section`. */
  readonly id: string;
  readonly Component: FunctionComponent<SectionProps>;
}

export const SECTIONS: readonly SectionDef[] = [
  { id: 'hand', Component: HandSections },   // HT-6: Look closer, Grip, Common handling mistakes
  // HT-8's 'feel' section slots in here, before Setup (golden B's order).
  { id: 'setup', Component: Setup },
  { id: 'risks', Component: Risks },
];
