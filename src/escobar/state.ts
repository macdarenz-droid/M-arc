/**
 * Escobar's UI signals (§5): the sheet, the loop's live view, online/quota status, and the
 * built-in proxy URL. The persisted parts live in AppState.escobar and the conversation store.
 */
import { signal } from '@preact/signals';
import type { ContextRef } from './types';
import type { EscobarMode } from './context/modes';
import type { LiveView } from './loop';

/** The owner's marc-coach Worker (§12.9). A Settings edit stores an override in escobar.proxyUrl. */
export const ESCOBAR_PROXY_URL = 'https://marc-coach.mmarcdarenz.workers.dev';

export interface EscobarUi {
  open: boolean;
  detent: 'half' | 'full';
  mode: EscobarMode;
  /** A pending "Ask about this" reference for the next message. */
  contextRef: ContextRef | null;
  /** Prefilled composer text (from a chip or a dock prompt). */
  draft: string;
}
export const escobarUi = signal<EscobarUi>({ open: false, detent: 'half', mode: 'chat', contextRef: null, draft: '' });

export const loopView = signal<LiveView>({ status: 'idle', text: '', preamble: [], activity: [], outcomes: [] });
/** null = not checked yet. False for 60 s after a transport failure (§13). */
export const online = signal<boolean | null>(null);
export const quotaResetAt = signal<number | null>(null);

/** Per-model prices, $ per million tokens, for the rough cost estimate in Settings (§21). */
export const PRICES: Record<string, { input: number; output: number; cacheRead: number }> = {
  'claude-opus-5': { input: 5, output: 25, cacheRead: 0.5 },
  'claude-opus-5-5': { input: 4, output: 20, cacheRead: 0.2 },
  'claude-opus-4-8': { input: 5, output: 25, cacheRead: 0.5 },
  'claude-sonnet-5': { input: 2, output: 10, cacheRead: 0.2 },
  'claude-fable-5-1': { input: 10, output: 50, cacheRead: 0.25 },
};

export function estimateCost(u: { inputTokens: number; outputTokens: number; cacheReadTokens: number }, model = 'claude-opus-5'): number {
  const p = PRICES[model] ?? PRICES['claude-opus-5']!;
  return (u.inputTokens * p.input + u.outputTokens * p.output + u.cacheReadTokens * p.cacheRead) / 1_000_000;
}

export function proxyUrlOf(proxyUrl: string | null): string { return proxyUrl || ESCOBAR_PROXY_URL; }
