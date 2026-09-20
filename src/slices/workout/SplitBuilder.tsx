/**
 * Build or adjust a split by conversation — a small, separate chat from
 * "Ask the coach", opened from its own entry point on Train. This is the
 * one deliberate place the coach is allowed to propose real exercises and
 * set counts; see src/ai/splitBuilder.ts and
 * proxy/src/promptSplitBuilder.ts for why the general Ask sheet stays
 * declining to build plans in chat while this one doesn't.
 *
 * Nothing here writes to a real split until the person taps the action
 * button under a proposal — the conversation itself never changes
 * anything, the same "you accept or dismiss" posture as every other coach
 * suggestion in the app.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { state } from '@/core/store';
import { showToast } from '@/app/toast';
import { Button, Sheet, Thinking } from '@/ui/primitives';
import { IconCigarette, IconDumbbell } from '@/ui/icons';
import { ChatInputRow, COACH_NAME, renderChatBody } from '@/ui/chatRender';
import { buildSplitPayload, requestSplitBuilderAnswer, MAX_SPLIT_MESSAGE_CHARS, type SplitBuilderTurn, type SplitDraft } from '@/ai/splitBuilder';
import { ensureDeviceId } from '../coach/remote';
import { applySplitDraft } from './splits';

const SPLIT_BUILDER_SUGGESTIONS = [
  'Build me a push day focused on chest and shoulders',
  'Add a hamstring exercise to Legs',
  'Make Pull less arm-heavy, more back',
  'I want a 3-day split for muscle growth',
];

type SplitBubble = SplitBuilderTurn & { draft?: SplitDraft | null; applied?: boolean };

function SplitDraftAction({ draft, onApplied }: { draft: SplitDraft; onApplied: () => void }) {
  const label = draft.action === 'create' ? `Create split: ${draft.name}` : `Update ${draft.name} with these changes`;
  return (
    <Button
      variant="primary"
      size="sm"
      style={{ marginTop: 8 }}
      onClick={() => {
        const result = applySplitDraft(draft.splitId, { name: draft.name, focus: draft.focus, exercises: draft.exercises });
        if (result) { showToast(draft.action === 'create' ? `Created ${result.name}` : `Updated ${result.name}`); onApplied(); }
        else showToast('Could not apply that — it may have changed since. Ask again.');
      }}
    >
      {label}
    </Button>
  );
}

export function SplitBuilderSheet({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<SplitBubble[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, [history, sending]);

  const send = async () => {
    const m = message.trim();
    if (!m || sending) return;
    const s = state.value;
    const plainHistory: SplitBuilderTurn[] = history.map(h => ({ role: h.role, text: h.text }));
    const payload = buildSplitPayload(s.splits, s.customExercises, plainHistory, m, { goal: s.goal, unit: s.preferences.weightUnit });
    const withMessage: SplitBubble[] = [...history, { role: 'user', text: m }];
    setHistory(withMessage);
    setMessage('');
    setError(null);
    setSending(true);
    try {
      const r = await requestSplitBuilderAnswer(payload, s.customExercises, { url: s.coach.explainerUrl, deviceId: ensureDeviceId() });
      if (r.ok) setHistory([...withMessage, { role: 'assistant', text: r.answer, draft: r.draft }]);
      else setError(r.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet title={`Build a split with ${COACH_NAME}`} onClose={onClose}>
      <div class="ask-thread" ref={threadRef}>
        {!history.length && <p class="small muted">Describe what you want — which muscles, or adding to or changing an existing split — and {COACH_NAME} will put one together from your real exercise list. Nothing changes until you tap the button on a proposal.</p>}
        {history.map((turn, i) => (
          <div key={i} class={`ask-bubble ${turn.role === 'user' ? 'ask-user' : 'ask-assistant'}`}>
            {turn.role === 'assistant' && <div class="ask-persona"><IconCigarette size={24} aria-hidden={true} />{COACH_NAME}</div>}
            {turn.role === 'assistant' ? renderChatBody(turn.text, IconDumbbell) : turn.text}
            {turn.role === 'assistant' && turn.draft && (turn.applied
              ? <p class="hint" style={{ marginTop: 8 }}>Applied.</p>
              : <SplitDraftAction draft={turn.draft} onApplied={() => setHistory(h => h.map((t, ti) => (ti === i ? { ...t, applied: true } : t)))} />)}
          </div>
        ))}
        {sending && <div class="ask-bubble ask-assistant"><Thinking /></div>}
      </div>
      {error && <p class="hint" style={{ color: 'var(--negative)', marginBottom: 8 }}>{error}</p>}
      <ChatInputRow value={message} setValue={setMessage} sending={sending} onSubmit={e => { e.preventDefault(); void send(); }} placeholders={SPLIT_BUILDER_SUGGESTIONS} maxLength={MAX_SPLIT_MESSAGE_CHARS} />
    </Sheet>
  );
}
