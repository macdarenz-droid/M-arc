/**
 * The single source of truth for whether the shared "Ask Escobar" sheet is
 * open, and how (docs/escobar-presence P03, 01-ARCHITECTURE.md §4: "Replace
 * competing Coach mounts with the shared host"). Before this, Coach.tsx and
 * Train.tsx each mounted their own separate <AskSheet> behind their own
 * local boolean — closing the sheet on one screen and reopening it on the
 * other, or just switching tabs while it was open, unmounted the old
 * instance and lost its transient `question`/`sending`/`error` state.
 *
 * A signal here instead of per-screen state means whichever single place
 * mounts <AskSheet>, while the signals below own transient state across any
 * unmount/remount (ordinary close/reopen and Settings deferral included).
 */
import { signal } from '@preact/signals';
import { MAX_QUESTION_CHARS } from '@/ai/ask';

export interface AskOpenState {
  open: boolean;
  savedOnly: boolean;
  initialTurnKey?: string;
}

const CLOSED: AskOpenState = { open: false, savedOnly: false };

export const askOpenState = signal<AskOpenState>(CLOSED);
/** Transient composer/request UI belongs to the application controller so a close, tab change, or Settings deferral cannot discard it. */
export const askDraft = signal('');
export const askSending = signal(false);
export const askError = signal<string | null>(null);

/** Deliberate reset boundary used alongside request-generation invalidation. */
export function resetAskTransient(): void {
  askDraft.value = '';
  askSending.value = false;
  askError.value = null;
}

/** The ordinary "Ask a question" entry point — Coach's button, Train's Escobar button, a presence launcher's "Ask about this". */
export function openAsk(): void {
  askOpenState.value = { open: true, savedOnly: false };
}

/**
 * Contextual entry point (docs/escobar-presence §4's "context by IDs, visible
 * editable prefill", regression A06): seed the controller-owned composer
 * with a visible, editable question and never submit it automatically.
 */
export function openAskWithQuestion(question: string): void {
  askDraft.value = question.slice(0, MAX_QUESTION_CHARS);
  askError.value = null;
  askOpenState.value = { open: true, savedOnly: false };
}

/** Coach's saved-draft review entry point: opens straight to one saved item, composer replaced by the offline-safe review view (AskSheet's own `savedOnly`). */
export function openAskSavedReview(initialTurnKey?: string): void {
  askOpenState.value = { open: true, savedOnly: true, initialTurnKey };
}

export function closeAsk(): void {
  askOpenState.value = CLOSED;
}
