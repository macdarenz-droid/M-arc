/** "Ask about this" (§4.1): a quiet persona button that opens the sheet with a context chip. */
import { state } from '@/core/store';
import { IconEscobar } from '@/ui/icons';
import { askAbout } from './open';
import type { ContextRef } from '../types';

export function AskAbout({ refTo, class: cls = '' }: { refTo: ContextRef; class?: string }) {
  if (!state.value.escobar.enabled) return null;
  return (
    <button type="button" class={`btn btn-quiet btn-icon esc-ask ${cls}`} aria-label={`Ask Escobar about ${refTo.label}`} title="Ask Escobar about this" onClick={e => { e.stopPropagation(); askAbout(refTo); }}>
      <IconEscobar size={18} />
    </button>
  );
}
