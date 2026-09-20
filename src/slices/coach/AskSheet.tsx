/**
 * Ask the coach — one shared chat, opened from two entry points (the Coach
 * tab's "Ask a question" and Train's "Escobar" button) that both get the
 * exact same capability: grounded personal answers, general knowledge, and
 * designing or adjusting a real split by conversation. Used to be two
 * separate sheets talking to two separate proxy routes — merged into one
 * (see src/ai/ask.ts and COACH_BRAIN.md's decision log) so the conversation
 * itself never has to change depending on which button opened it.
 *
 * Nothing here writes to a real split or the schedule until the person taps
 * the action button under a proposal — the conversation itself never
 * changes anything, the same "you accept or dismiss" posture as every
 * other coach suggestion in the app. Applying a split or a new schedule
 * always sends you to where the result lives (Train, or Coach's own
 * Weekly schedule) even if you were already there.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { state } from '@/core/store';
import { askStats, report } from '@/app/selectors';
import { go } from '@/app/router';
import { showToast } from '@/app/toast';
import { Button, Sheet, Thinking } from '@/ui/primitives';
import { IconApple, IconBody, IconCigarette, IconDumbbell, IconGear, IconInfo } from '@/ui/icons';
import { ChatInputRow, COACH_NAME, renderChatBody } from '@/ui/chatRender';
import { buildAskPayload, requestAskAnswer, MAX_QUESTION_CHARS, type AskCategory, type AskConcern, type AskTurn, type SplitDraft, type WeekSchedule } from '@/ai/ask';
import { computeBmi } from '@/brain/coach/explainer';
import { WEEKDAYS } from '@/core/models';
import { WEEKDAY_LABEL } from '@/core/dates';
import { applyScheduleDraft, applySplitDraft } from '../workout/splits';
import { resyncReminders } from '../settings/reminders';
import { ensureDeviceId } from './remote';

/** A turn as shown on screen. "scope" and "category" are local-only (never sent back to the Worker as part of history) — "scope" says whether a reply was grounded in this person's report or is general knowledge, the same honest label the app uses for evidence quality everywhere else; "category" only picks which small icon marks its bullet points. "drafts"/"applied" track any splits this reply proposed and whether each has been applied yet; "scheduleDraft"/"scheduleApplied" do the same for a proposed weekly-schedule rearrangement. */
type AskBubble = AskTurn & { scope?: 'personal' | 'general'; category?: AskCategory; drafts?: SplitDraft[]; applied?: boolean[]; scheduleDraft?: WeekSchedule | null; scheduleApplied?: boolean; concern?: AskConcern };

const ASK_CATEGORY_ICON: Record<AskCategory, (p: { size?: number; class?: string; 'aria-hidden'?: boolean }) => JSX.Element> = {
  nutrition: IconApple, body: IconBody, training: IconDumbbell, app: IconGear, general: IconInfo,
};

/** The prompt (promptAsk.ts rule 13) allows a blank-line paragraph break and a "- "-prefixed line list for an answer that is genuinely a set of distinct items; picks the bullet icon from the answer's category. */
function renderAskBody(text: string, category: AskCategory): ComponentChildren {
  return renderChatBody(text, ASK_CATEGORY_ICON[category] ?? IconInfo);
}

/**
 * Someone who has been logging for months has no way to know the coach can
 * compare their stats over time, answer a plain anatomy/nutrition question,
 * design a whole split from a description, or rearrange the week — nothing
 * on screen hints at it. These rotate through the empty input as a
 * typed-out placeholder so the range of what's askable is discoverable
 * without a tutorial: personal long-horizon comparison, app navigation,
 * general knowledge, injury, several real split-building scenarios, and
 * schedule rearrangement.
 */
const ASK_SUGGESTIONS = [
  'How have I improved over the last 3 months?',
  'Why does my chest feel behind on volume?',
  'How do I see my recovery per muscle?',
  'What is progressive overload?',
  'How much protein should I aim for?',
  'What should I do if my shoulder feels sore?',
  'Build me a push day focused on chest and shoulders',
  'Add a hamstring exercise to Legs',
  'Make Pull less arm-heavy, more back',
  'I want a 3-day split for muscle growth',
  'Could you switch my Push split to Wednesday?',
  'What do you think is best for my schedule this week?',
];

function SplitDraftAction({ draft, onApplied }: { draft: SplitDraft; onApplied: () => void }) {
  const label = draft.action === 'create' ? `Create split: ${draft.name}` : `Update ${draft.name} with these changes`;
  return (
    <Button
      variant="primary"
      size="sm"
      style={{ marginTop: 8 }}
      onClick={() => {
        const result = applySplitDraft(draft.splitId, { name: draft.name, focus: draft.focus, exercises: draft.exercises });
        if (result) {
          showToast(draft.action === 'create' ? `Created ${result.name}` : `Updated ${result.name}`);
          go('train');
          onApplied();
        } else showToast('Could not apply that — it may have changed since. Ask again.');
      }}
    >
      {label}
    </Button>
  );
}

/** Only the days this draft actually changes from the live schedule right now — shown so the person can see what they're accepting without having to compare all 7 days themselves. */
function changedDays(draft: WeekSchedule): Array<{ day: string; label: string }> {
  const current = state.value.schedule;
  const splits = state.value.splits;
  const nameOf = (id: string | null) => (id ? splits.find(sp => sp.id === id)?.name ?? id : 'Rest');
  return WEEKDAYS.filter(d => draft[d] !== current[d]).map(d => ({ day: d, label: `${WEEKDAY_LABEL[d]}: ${nameOf(draft[d])}` }));
}

function ScheduleDraftAction({ draft, onApplied }: { draft: WeekSchedule; onApplied: () => void }) {
  const changes = changedDays(draft);
  // Nothing actually differs from the live schedule (e.g. it already agreed the current arrangement is fine) — nothing to accept.
  if (!changes.length) return <p class="hint" style={{ marginTop: 8 }}>That matches your current schedule already.</p>;
  return (
    <div style={{ marginTop: 8 }}>
      <div class="stack-sm" style={{ marginBottom: 8 }}>
        {changes.map(c => <p key={c.day} class="hint">{c.label}</p>)}
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          const ok = applyScheduleDraft(draft);
          if (ok) {
            showToast('Schedule updated');
            void resyncReminders();
            go('coach');
            onApplied();
          } else showToast('Could not apply that — a split may have changed since. Ask again.');
        }}
      >
        Apply new schedule
      </Button>
    </div>
  );
}

/**
 * Fixed, pre-written support copy — never generated by the model. The
 * coach flags "concern" (promptAsk.ts rule 17) when a question carries a
 * crisis or disordered-eating signal; this is the app's own deterministic
 * response to that flag, shown every time regardless of whether the
 * model's own prose happens to mention support. findahelpline.com is an
 * international directory (not a single country's hotline), since this
 * app has no idea what country someone is in.
 */
const ASK_CONCERN_RESOURCE: Record<Exclude<AskConcern, null>, string> = {
  crisis: 'If things feel like too much right now, you don\'t have to carry it alone — findahelpline.com lists free, confidential support by country, and in the US you can call or text 988 any time.',
  disordered_eating: 'This is worth talking through with a real person, not just a chat — a doctor or a helpline focused on eating and body-image concerns can help more than I can; findahelpline.com lists options by country.',
};

function ConcernResource({ concern }: { concern: Exclude<AskConcern, null> }) {
  return <p class="hint" style={{ marginTop: 8 }}>{ASK_CONCERN_RESOURCE[concern]}</p>;
}

export function AskSheet({ onClose }: { onClose: () => void }) {
  const [history, setHistory] = useState<AskBubble[]>([]);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, [history, sending]);

  const send = async () => {
    const q = question.trim();
    if (!q || sending) return;
    const s = state.value;
    const plainHistory: AskTurn[] = history.map(h => ({ role: h.role, text: h.text }));
    const payload = buildAskPayload(report.value, plainHistory, q, {
      goal: s.goal, unit: s.preferences.weightUnit, preferenceFacts: s.coach.preferenceFacts,
      splits: s.splits, customExercises: s.customExercises, schedule: s.schedule, bmi: computeBmi(s.profile),
      stats: askStats.value,
    });
    const withQuestion: AskBubble[] = [...history, { role: 'user', text: q }];
    setHistory(withQuestion);
    setQuestion('');
    setError(null);
    setSending(true);
    try {
      const r = await requestAskAnswer(payload, s.customExercises, { url: s.coach.explainerUrl, deviceId: ensureDeviceId() });
      if (r.ok) setHistory([...withQuestion, { role: 'assistant', text: r.answer, scope: r.scope, category: r.category, drafts: r.drafts, applied: r.drafts.map(() => false), scheduleDraft: r.scheduleDraft, scheduleApplied: false, concern: r.concern }]);
      else setError(r.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet title={`Ask ${COACH_NAME}`} onClose={onClose}>
      <div class="ask-thread" ref={threadRef}>
        {!history.length && <p class="small muted">Ask anything — your own training, general questions about exercise, muscles or nutrition, describe a split to build or change, or ask about rearranging your weekly schedule. Personal answers, splits and schedule changes only use the findings, real exercises and real schedule below, nothing about your sessions or body; nothing changes until you tap an action.</p>}
        {history.map((turn, i) => (
          <div key={i} class={`ask-bubble ${turn.role === 'user' ? 'ask-user' : 'ask-assistant'}`}>
            {turn.role === 'assistant' && <div class="ask-persona"><IconCigarette size={24} aria-hidden={true} />{COACH_NAME}</div>}
            {turn.role === 'assistant' ? renderAskBody(turn.text, turn.category ?? 'general') : turn.text}
            {turn.role === 'assistant' && turn.drafts?.map((draft, di) => (
              <div key={di}>
                {turn.applied?.[di]
                  ? <p class="hint" style={{ marginTop: 8 }}>Applied: {draft.name}.</p>
                  : <SplitDraftAction draft={draft} onApplied={() => setHistory(h => h.map((t, ti) => (ti === i ? { ...t, applied: (t.applied ?? []).map((a, ai) => (ai === di ? true : a)) } : t)))} />}
              </div>
            ))}
            {turn.role === 'assistant' && turn.scheduleDraft && (
              turn.scheduleApplied
                ? <p class="hint" style={{ marginTop: 8 }}>Schedule updated.</p>
                : <ScheduleDraftAction draft={turn.scheduleDraft} onApplied={() => setHistory(h => h.map((t, ti) => (ti === i ? { ...t, scheduleApplied: true } : t)))} />
            )}
            {turn.role === 'assistant' && turn.concern && <ConcernResource concern={turn.concern} />}
          </div>
        ))}
        {sending && <div class="ask-bubble ask-assistant"><Thinking /></div>}
      </div>
      {error && <p class="hint" style={{ color: 'var(--negative)', marginBottom: 8 }}>{error}</p>}
      <ChatInputRow value={question} setValue={setQuestion} sending={sending} onSubmit={e => { e.preventDefault(); void send(); }} placeholders={ASK_SUGGESTIONS} maxLength={MAX_QUESTION_CHARS} />
    </Sheet>
  );
}
