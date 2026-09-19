/**
 * The research cards the coach may cite, loaded from principles.json.
 * The words layer receives only the cards a report's kinds may cite, so
 * the model sees the evidence for what it is explaining and nothing else.
 */
import raw from '@/data/principles.json';

export type Rating = 'strong' | 'moderate' | 'contested' | 'coaching_consensus';

export interface Citation {
  key: string;
  authors: string;
  year: number;
  title: string;
  journal: string;
  where?: string;
  pmid?: string;
  doi?: string;
  verified: 'search-index' | 'full-text' | 'unverified';
}

export interface PrincipleCard {
  id: string;
  title: string;
  rating: Rating;
  statement: string;
  disputed: string;
  appUse: string;
  findingKinds: string[];
  proposalKinds: string[];
  citations: Citation[];
}

interface PrinciplesFile {
  version: number;
  verifiedOn: string;
  verificationMethod: string;
  ratings: Rating[];
  cards: PrincipleCard[];
}

const file = raw as PrinciplesFile;

export const PRINCIPLES_VERSION = file.version;
export const PRINCIPLES: PrincipleCard[] = file.cards;
export const PRINCIPLE_BY_ID: ReadonlyMap<string, PrincipleCard> = new Map(PRINCIPLES.map(c => [c.id, c]));

export const RATING_LABEL: Record<Rating, string> = {
  strong: 'Well established',
  moderate: 'Good evidence, details uncertain',
  contested: 'Evidence is mixed',
  coaching_consensus: 'Coaching consensus, not research-tested',
};

/** Cards for a list of ids, in the order given, skipping unknown ids. */
export function principlesFor(ids: readonly string[]): PrincipleCard[] {
  const seen = new Set<string>();
  const out: PrincipleCard[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const card = PRINCIPLE_BY_ID.get(id);
    if (card) { seen.add(id); out.push(card); }
  }
  return out;
}
