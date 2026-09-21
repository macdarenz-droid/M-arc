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
import { state, update, flushSave } from '@/core/store';
import { askStats, report } from '@/app/selectors';
import { go } from '@/app/router';
import { showToast } from '@/app/toast';
import { Button, Sheet, Thinking } from '@/ui/primitives';
import { IconApple, IconBody, IconCigarette, IconDumbbell, IconGear, IconInfo } from '@/ui/icons';
import { ChatInputRow, COACH_NAME, renderChatBody } from '@/ui/chatRender';
import { buildAskPayload, requestAskAnswer, MAX_QUESTION_CHARS, type AskAction, type AskCategory, type AskConcern, type AskTurn, type SplitDraft, type WeekSchedule } from '@/ai/ask';
import { computeBmi } from '@/brain/coach/explainer';
import { WEEKDAYS, type AskThreadTurn } from '@/core/models';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';
import { WEEKDAY_LABEL } from '@/core/dates';
import { MAX_SPLITS, applyScheduleDraft, applySplitDraft } from '../workout/splits';
import { resyncReminders } from '../settings/reminders';
import { ensureDeviceId, remoteEnabled } from './remote';
import { appendAskTurn, clearAskThread, mergeStatedConstraints, updateAskTurn } from './askMemory';
import { askTurnFingerprint, pendingCoachItems, type PendingCoachItem } from '@/brain/coach/reopen';

/**
 * A turn as shown on screen — the same AskThreadTurn persisted in
 * CoachState.askThread, so the conversation survives closing the sheet or
 * the app itself (see core/models.ts and COACH_BRAIN.md's decision log for
 * the audit finding this closes). "scope" says whether a reply was
 * grounded in this person's report or is general knowledge, the same
 * honest label the app uses for evidence quality everywhere else;
 * "category" only picks which small icon marks its bullet points.
 * "drafts"/"applied" track any splits this reply proposed and whether each
 * has been applied yet; "scheduleDraft"/"scheduleApplied" do the same for a
 * proposed weekly-schedule rearrangement.
 */
type AskBubble = AskThreadTurn;

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

function pendingNow(item: PendingCoachItem): PendingCoachItem | null {
  const s = state.value;
  return pendingCoachItems(s.coach, s.splits, s.schedule, s.goal, MAX_SPLITS).find(candidate => candidate.key === item.key) ?? null;
}

const staleItem = () => showToast('This item changed. Review the current version.');

function SplitDraftAction({ draft, item, onApplied }: { draft: SplitDraft; item: PendingCoachItem; onApplied: () => void }) {
  const label = draft.action === 'create' ? `Create split: ${draft.name}` : `Update ${draft.name} with these changes`;
  if (!item.actionable) return <p class="hint" style={{ marginTop: 8 }}>This draft refers to something that has changed.</p>;
  return (
    <Button
      variant="primary"
      size="sm"
      style={{ marginTop: 8 }}
      onClick={() => {
        const current = pendingNow(item);
        if (!current?.actionable) { staleItem(); return; }
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

function ScheduleDraftAction({ draft, item, onApplied }: { draft: WeekSchedule; item: PendingCoachItem; onApplied: () => void }) {
  const changes = changedDays(draft);
  // Nothing actually differs from the live schedule (e.g. it already agreed the current arrangement is fine) — nothing to accept.
  if (!changes.length) return <p class="hint" style={{ marginTop: 8 }}>That matches your current schedule already.</p>;
  if (!item.actionable) return <p class="hint" style={{ marginTop: 8 }}>This draft refers to something that has changed.</p>;
  return (
    <div style={{ marginTop: 8 }}>
      <div class="stack-sm" style={{ marginBottom: 8 }}>
        {changes.map(c => <p key={c.day} class="hint">{c.label}</p>)}
      </div>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          const current = pendingNow(item);
          if (!current?.actionable) { staleItem(); return; }
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
 * The general typed-action envelope's first (and so far only) member — see
 * core/models.ts's AskThreadAction and the doc comment on AskActionSchema
 * in proxy/src/anthropic.ts for why this is one union member rather than
 * its own top-level field, and why splitDrafts/scheduleDraft above stay
 * separate for now. Shows a plain before/after diff, applies with one tap
 * (writing `state.goal` directly, the same as Coach.tsx's own goal picker),
 * and — since a goal is one of very few settings the app itself keeps no
 * history for — a one-step "Undo" restoring exactly the goal it replaced,
 * the same "prev" this component itself captured at the moment of applying.
 */
function GoalChangeAction({ action, item, turnIndex, turnFingerprint, prev, onApplied, onUndone }: { action: AskAction; item: PendingCoachItem | null; turnIndex: number; turnFingerprint: string; prev: GoalId | null; onApplied: (previous: GoalId) => void; onUndone: () => void }) {
  const target = GOAL_BY_ID[action.goal];
  if (prev != null) {
    const previous = GOAL_BY_ID[prev];
    return (
      <p class="hint" style={{ marginTop: 8 }}>
        Applied: goal set to {target.name}.{' '}
        <Button variant="quiet" size="sm" onClick={() => {
          const turn = state.value.coach.askThread[turnIndex];
          if (!turn || askTurnFingerprint(turn) !== turnFingerprint || state.value.goal !== action.goal) { staleItem(); return; }
          update(st => ({ ...st, goal: prev })); onUndone(); showToast(`Reverted to ${previous.name}`);
        }}>Undo</Button>
      </p>
    );
  }
  const current = GOAL_BY_ID[state.value.goal];
  if (current.id === action.goal) return <p class="hint" style={{ marginTop: 8 }}>That's already your training goal.</p>;
  if (!item?.actionable) return <p class="hint" style={{ marginTop: 8 }}>This draft refers to something that has changed.</p>;
  return (
    <div style={{ marginTop: 8 }}>
      <p class="hint">Currently: {current.name} → Propose: {target.name}</p>
      <Button
        variant="primary"
        size="sm"
        onClick={() => {
          const fresh = pendingNow(item);
          if (!fresh?.actionable) { staleItem(); return; }
          const previous = state.value.goal;
          update(st => ({ ...st, goal: action.goal }));
          onApplied(previous);
          showToast(`Goal set to ${target.name}`);
        }}
      >
        Change goal to {target.name}
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

export function AskSheet({ onClose, initialTurnKey, savedOnly = false }: { onClose: () => void; initialTurnKey?: string; savedOnly?: boolean }) {
  const history = state.value.coach.askThread;
  const pending = pendingCoachItems(state.value.coach, state.value.splits, state.value.schedule, state.value.goal, MAX_SPLITS);
  const pendingAt = (turnIndex: number, kind: PendingCoachItem['kind'], itemIndex: number) => pending.find(item => item.turnIndex === turnIndex && item.kind === kind && item.itemIndex === itemIndex) ?? null;
  const reviewItem = (initialTurnKey ? pending.find(item => item.key === initialTurnKey) : undefined) ?? (savedOnly ? pending[0] : undefined);
  const [question, setQuestion] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const reviewRef = useRef<HTMLDivElement>(null);

  useEffect(() => { threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: 'smooth' }); }, [history, sending]);
  useEffect(() => { if (savedOnly) reviewRef.current?.scrollIntoView({ block: 'center' }); }, [savedOnly, reviewItem?.key]);

  const patchExactTurn = (item: PendingCoachItem, patch: (turn: AskThreadTurn) => Partial<AskThreadTurn>): boolean => {
    let applied = false;
    update(st => {
      const turn = st.coach.askThread[item.turnIndex];
      if (!turn || askTurnFingerprint(turn) !== item.turnFingerprint) return st;
      applied = true;
      return { ...st, coach: updateAskTurn(st.coach, item.turnIndex, patch(turn)) };
    });
    if (applied) flushSave();
    return applied;
  };

  const send = async () => {
    const q = question.trim();
    if (savedOnly || !q || sending) return;
    // The composer is disabled whenever remoteEnabled is off (see render below), but that's a
    // UI-level guard the parent used to be the only enforcement for (docs/escobar-presence
    // §4: "the current AskSheet.send relies on Coach's remote-enabled mounting"). If the
    // person flips the setting off in Settings while this sheet is already open elsewhere, or
    // a stale click slips past a disabled-but-not-yet-re-rendered button, the handler itself
    // must still refuse — checked fresh here, not captured at mount.
    if (!remoteEnabled.value) { setError('Online coach is off. Turn it on in Settings to ask a question.'); return; }
    const s = state.value;
    const plainHistory: AskTurn[] = history.map(h => ({ role: h.role, text: h.text }));
    // Constraints first: they're rarer and more load-bearing (an injury to work around) than a
    // behavioral preference fact, so if the shared cap (LIMITS.preferences, buildAskPayload)
    // ever has to drop something, a stated constraint survives before a "usually accepts
    // schedule changes"-style fact does.
    const payload = buildAskPayload(report.value, plainHistory, q, {
      goal: s.goal, unit: s.preferences.weightUnit, preferenceFacts: [...s.coach.statedConstraints, ...s.coach.preferenceFacts],
      splits: s.splits, customExercises: s.customExercises, schedule: s.schedule, bmi: computeBmi(s.profile),
      stats: askStats.value,
    });
    update(st => ({ ...st, coach: appendAskTurn(st.coach, { role: 'user', text: q }) }));
    flushSave();
    setQuestion('');
    setError(null);
    setSending(true);
    try {
      const r = await requestAskAnswer(payload, s.customExercises, { url: s.coach.explainerUrl, deviceId: ensureDeviceId() });
      if (r.ok) {
        update(st => {
          const coach = appendAskTurn(st.coach, { role: 'assistant', text: r.answer, scope: r.scope, category: r.category, drafts: r.drafts, applied: r.drafts.map(() => false), scheduleDraft: r.scheduleDraft, scheduleApplied: false, concern: r.concern, trimmed: r.trimmed, actions: r.actions, actionPrev: r.actions.map(() => null) });
          return { ...st, coach: r.constraints.length ? mergeStatedConstraints(coach, r.constraints) : coach };
        });
        flushSave();
      } else setError(r.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet title={`Ask ${COACH_NAME}`} onClose={onClose}>
      <div class="ask-thread" ref={threadRef}>
        {!history.length && <p class="small muted">Ask anything — your own training, general questions about exercise, muscles or nutrition, describe a split to build or change, or ask about rearranging your weekly schedule. Personal answers, splits and schedule changes only use the findings, real exercises and real schedule below, nothing about your sessions or body; nothing changes until you tap an action.</p>}
        {history.length > 0 && !savedOnly && (
          <Button variant="quiet" size="sm" onClick={() => { update(st => ({ ...st, coach: clearAskThread(st.coach) })); flushSave(); }}>
            Clear conversation
          </Button>
        )}
        {history.map((turn, i) => (
          <div key={i} ref={i === reviewItem?.turnIndex ? reviewRef : undefined} class={`ask-bubble ${turn.role === 'user' ? 'ask-user' : 'ask-assistant'}`}>
            {turn.role === 'assistant' && <div class="ask-persona"><IconCigarette size={24} aria-hidden={true} />{COACH_NAME}</div>}
            {turn.role === 'assistant' ? renderAskBody(turn.text, turn.category ?? 'general') : turn.text}
            {turn.role === 'assistant' && !!turn.trimmed && <p class="hint" style={{ marginTop: 6 }}>{turn.trimmed} sentence{turn.trimmed === 1 ? '' : 's'} left out for using a number not in your data.</p>}
            {turn.role === 'assistant' && turn.drafts?.map((draft, di) => (
              <div key={di}>
                {turn.applied?.[di]
                  ? <p class="hint" style={{ marginTop: 8 }}>Applied: {draft.name}.</p>
                  : turn.draftDismissed?.[di]
                    ? <p class="hint" style={{ marginTop: 8 }}>Dismissed: {draft.name}.</p>
                    : (() => {
                      const item = pendingAt(i, 'split', di);
                      return item ? <SplitDraftAction draft={draft} item={item} onApplied={() => {
                        if (!patchExactTurn(item, current => { const flags = Array.from({ length: current.drafts?.length ?? di + 1 }, (_, index) => current.applied?.[index] ?? false); flags[di] = true; return { applied: flags }; })) staleItem();
                      }} /> : <p class="hint" style={{ marginTop: 8 }}>This item changed. Review the current version.</p>;
                    })()}
              </div>
            ))}
            {turn.role === 'assistant' && turn.scheduleDraft && (
              turn.scheduleApplied
                ? <p class="hint" style={{ marginTop: 8 }}>Schedule updated.</p>
                : turn.scheduleDismissed
                  ? <p class="hint" style={{ marginTop: 8 }}>Schedule draft dismissed.</p>
                  : (() => {
                    const item = pendingAt(i, 'schedule', 0);
                    return item ? <ScheduleDraftAction draft={turn.scheduleDraft!} item={item} onApplied={() => {
                      if (!patchExactTurn(item, () => ({ scheduleApplied: true }))) staleItem();
                    }} /> : <p class="hint" style={{ marginTop: 8 }}>That matches your current schedule already.</p>;
                  })()
            )}
            {turn.role === 'assistant' && turn.actions?.map((action, ai) => (
              turn.actionDismissed?.[ai] ? <p key={ai} class="hint" style={{ marginTop: 8 }}>Goal change dismissed.</p> : <GoalChangeAction
                key={ai}
                action={action}
                item={pendingAt(i, 'goal', ai)}
                turnIndex={i}
                turnFingerprint={askTurnFingerprint(turn)}
                prev={turn.actionPrev?.[ai] ?? null}
                onApplied={previous => {
                  const item = pendingAt(i, 'goal', ai);
                  if (!item || !patchExactTurn(item, current => { const prev = [...(current.actionPrev ?? current.actions?.map(() => null) ?? [])]; prev[ai] = previous; return { actionPrev: prev }; })) staleItem();
                }}
                onUndone={() => {
                  const identity = { turnIndex: i, turnFingerprint: askTurnFingerprint(turn) };
                  const current = state.value.coach.askThread[identity.turnIndex];
                  if (!current || askTurnFingerprint(current) !== identity.turnFingerprint) { staleItem(); return; }
                  const prev = [...(current.actionPrev ?? [])]; prev[ai] = null;
                  update(st => ({ ...st, coach: updateAskTurn(st.coach, identity.turnIndex, { actionPrev: prev }) })); flushSave();
                }}
              />
            ))}
            {turn.role === 'assistant' && turn.concern && <ConcernResource concern={turn.concern} />}
          </div>
        ))}
        {sending && <div class="ask-bubble ask-assistant"><Thinking /></div>}
      </div>
      {error && <p class="hint" style={{ color: 'var(--negative)', marginBottom: 8 }}>{error}</p>}
      {savedOnly
        ? <p class="small muted">Review saved drafts. Online questions are off.</p>
        : !remoteEnabled.value
          ? <p class="small muted">Online coach is off. Turn it on in Settings to ask a question — saved drafts above still work.</p>
          : <ChatInputRow value={question} setValue={setQuestion} sending={sending} onSubmit={e => { e.preventDefault(); void send(); }} placeholders={ASK_SUGGESTIONS} maxLength={MAX_QUESTION_CHARS} />}
    </Sheet>
  );
}
