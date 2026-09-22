/**
 * The light entry points (§4.1) that the always-loaded app uses: they only flip the
 * `escobarUi` signal. The sheet and the loop load on first open (lazy chunk).
 */
import { escobarUi } from '../state';
import type { ContextRef } from '../types';
import type { EscobarMode } from '../context/modes';

export function openEscobar(opts: { mode?: EscobarMode; contextRef?: ContextRef | null; draft?: string; detent?: 'half' | 'full' } = {}): void {
  escobarUi.value = { ...escobarUi.value, open: true, mode: opts.mode ?? 'chat', contextRef: opts.contextRef ?? null, draft: opts.draft ?? '', detent: opts.detent ?? 'half' };
}

export const askAbout = (ref: ContextRef): void => openEscobar({ contextRef: ref });

/** Open the sheet and send straight away (the Hall composer and chips). */
export function openAndSend(text: string, contextRef?: ContextRef | null): void {
  openEscobar({ detent: 'full' });
  void import('../session').then(s => s.send({ text, ...(contextRef ? { contextRefs: [contextRef] } : {}) }));
}
