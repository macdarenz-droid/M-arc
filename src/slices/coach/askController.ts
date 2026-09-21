/**
 * The single source of truth for whether the shared "Ask Escobar" sheet is
 * open, and how (docs/escobar-presence P03, 01-ARCHITECTURE.md §4: "Replace
 * competing Coach mounts with the shared host"). Before this, Coach.tsx and
 * Train.tsx each mounted their own separate <AskSheet> behind their own
 * local boolean — closing the sheet on one screen and reopening it on the
 * other, or just switching tabs while it was open, unmounted the old
 * instance and lost AskSheet's own local `question`/`sending`/`error`
 * state, since each mount was a fresh component instance.
 *
 * A signal here instead of per-screen state means whichever single place
 * mounts <AskSheet> (App.tsx, alongside the tab content rather than inside
 * it) keeps the same component instance alive across tab switches — the
 * typed-but-unsent question, an in-flight send, and any error survive
 * navigating away and back, satisfying A03 ("Navigation/close/reopen cannot
 * double-send or silently discard draft") by construction rather than by
 * separately re-implementing draft preservation.
 */
import { signal } from '@preact/signals';

export interface AskOpenState {
  open: boolean;
  savedOnly: boolean;
  initialTurnKey?: string;
  initialQuestion?: string;
}

const CLOSED: AskOpenState = { open: false, savedOnly: false };

export const askOpenState = signal<AskOpenState>(CLOSED);

/** The ordinary "Ask a question" entry point — Coach's button, Train's Escobar button, a presence launcher's "Ask about this". */
export function openAsk(): void {
  askOpenState.value = { open: true, savedOnly: false };
}

/**
 * Contextual entry point (docs/escobar-presence §4's "context by IDs, visible
 * editable prefill", regression A06): InsightSheet/SuggestionSheet's "Ask
 * about this" seeds the composer with a starting question about the exact
 * finding the sheet was opened for, fully visible and editable — never sent
 * automatically. AskSheet only reads `initialQuestion` once, at mount
 * (matching `initialTurnKey`'s existing pattern above): reachable safely
 * because AskSheet is a native modal dialog, so a second sheet's own "Ask
 * about this" can't be tapped again while Ask is already open (see P03.4's
 * verified nested-modal reasoning in docs/escobar-presence/PROGRESS.md) —
 * there is no live scenario where this needs to update an already-open
 * instance.
 */
export function openAskWithQuestion(question: string): void {
  askOpenState.value = { open: true, savedOnly: false, initialQuestion: question };
}

/** Coach's saved-draft review entry point: opens straight to one saved item, composer replaced by the offline-safe review view (AskSheet's own `savedOnly`). */
export function openAskSavedReview(initialTurnKey?: string): void {
  askOpenState.value = { open: true, savedOnly: true, initialTurnKey };
}

export function closeAsk(): void {
  askOpenState.value = CLOSED;
}
