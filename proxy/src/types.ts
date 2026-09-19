/**
 * What the app sends. Mirrors src/brain/coach/explainer.ts in the app; the
 * Worker validates shape and size and trusts nothing else.
 */
export interface PayloadFinding {
  id: string;
  kind: string;
  subject: Record<string, string | undefined>;
  metrics: Record<string, number | string | boolean>;
  window: { from: string; to: string; weeks?: number; sessions?: number };
  confidence: 'low' | 'medium' | 'high';
  severity: number;
}

export interface PayloadProposal {
  id: string;
  kind: string;
  subject: Record<string, string | undefined>;
  apply: unknown;
  basedOn: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface PayloadCard {
  id: string;
  title: string;
  rating: 'strong' | 'moderate' | 'contested' | 'coaching_consensus';
  statement: string;
  disputed: string;
}

export interface ExplainPayload {
  version: 1;
  kind: 'explain';
  goal: string;
  unit: 'kg' | 'lb';
  today: string;
  dataQuality: { sessions: number; weeksOfData: number; effortCoverage: number; insufficientData: boolean };
  findings: PayloadFinding[];
  proposals: PayloadProposal[];
  cards: PayloadCard[];
  /** Ids (findings and proposals) the app wants an explanation for. */
  explain: string[];
}

export interface Explanation {
  summary: string;
  items: Array<{ id: string; text: string }>;
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallModel = (payload: ExplainPayload, env: WorkerEnv) => Promise<Explanation>;

export interface WorkerEnv {
  ANTHROPIC_API_KEY?: string;
  MODEL?: string;
  MAX_DAILY_PER_DEVICE?: string;
  MAX_DAILY_TOTAL?: string;
  ALLOWED_ORIGINS?: string;
  RATE?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
  QUOTA?: KVNamespace;
}
