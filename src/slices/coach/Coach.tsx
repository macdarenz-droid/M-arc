import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentChildren, JSX } from 'preact';
import { state, update } from '@/core/store';
import { deload, insights, report, suggestions, today } from '@/app/selectors';
import { Button, Card, Chip, Row, Section, Sheet, Thinking } from '@/ui/primitives';
import { IconApple, IconBody, IconChevron, IconCigarette, IconDumbbell, IconGear, IconInfo, IconMafia, IconSend } from '@/ui/icons';
import { CATEGORY_LABEL, shortlist, type Category, type Insight, type Suggestion } from '@/brain/coach/words';
import { RATING_LABEL, type PrincipleCard } from '@/brain/coach/principles';
import { pickCue, type Cue } from '@/brain/coach/cues';
import { GOALS, type GoalId } from '@/data/goals';
import { WEEKDAYS, type Weekday } from '@/core/models';
import { WEEKDAY_LABEL, formatDay } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { suggestNext } from '@/brain/progression';
import { applyDeload } from '@/brain/coach/deload';
import { exerciseHistory } from '@/brain/history';
import { formatLoad } from '@/core/units';
import { showToast } from '@/app/toast';
import { buildAskPayload, requestAskAnswer, MAX_QUESTION_CHARS, type AskCategory, type AskTurn } from '@/ai/ask';
import { resyncReminders } from '../settings/reminders';
import { acceptProposal, dismissProposal, endDeload } from './apply';
import { ensureDeviceId, explainError, explaining, explanation, remoteEnabled, requestExplanation } from './remote';

export const INSIGHT_COLOR: Record<Category, string> = {
  recovery: 'var(--positive)', progress: 'var(--warning)', readiness: 'var(--info)', balance: 'var(--accent)', focus: 'var(--accent)',
  consistency: 'var(--warning)', data: 'var(--text-3)', volume: 'var(--info)',
};

const KIND_LABEL: Record<Suggestion['kind'], string> = {
  schedule: 'Schedule', today_plan: 'Today', exercise_swap: 'Swap', add_exercise: 'Add', split_modify: 'Trim', split_new: 'New plan',
  load_next: 'Next session', rest_default: 'Rest', deload_week: 'Easier week',
};

const CONFIDENCE_LABEL: Record<Insight['confidence'], string> = { low: 'Low confidence', medium: 'Fair confidence', high: 'High confidence' };

export function Coach() {
  const s = state.value;
  const list = useMemo(() => shortlist(insights.value, 6, 2), [insights.value]);
  const hidden = insights.value.length - list.length;
  const open = suggestions.value;
  const [openInsight, setOpenInsight] = useState<Insight | null>(null);
  const [openSuggestion, setOpenSuggestion] = useState<Suggestion | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const [askOpen, setAskOpen] = useState(false);
  const goal = GOALS.find(g => g.id === s.goal) ?? GOALS[0]!;
  const lastExercise = useMemo(() => { const last = s.sessions[s.sessions.length - 1]; return last?.exercises[0] ? findExercise(last.exercises[0].exerciseId, s.customExercises) : undefined; }, [s.sessions]);
  const [cueSeed, setCueSeed] = useState(0);
  const cue: Cue | null = lastExercise ? pickCue(lastExercise, cueSeed % 2 ? 'learn' : 'coach', `${today.value}|${cueSeed}`) : null;
  const dq = report.value.dataQuality;

  const accept = (sg: Suggestion) => { showToast(acceptProposal(sg.proposal, today.value)); setOpenSuggestion(null); };
  const dismiss = (sg: Suggestion) => { dismissProposal(sg.proposal, today.value); showToast('Not now. It can come back later.'); setOpenSuggestion(null); };

  return (
    <div class="view">
      <div class="topbar"><div><div class="eyebrow">Coach</div><h1>What to do next</h1></div></div>

      {deload.value && (
        <div class="banner row-between" role="status">
          <span>Easier week until {formatDay(deload.value.to)}. Targets in Train are about {Math.round(deload.value.loadFactor * 100)}% of your usual.</span>
          <Button variant="quiet" size="sm" onClick={() => { endDeload(); showToast('Back to normal targets'); }}>End</Button>
        </div>
      )}

      {remoteEnabled.value && (
        <Card class="card-accent">
          <div class="row-between"><div class="eyebrow row" style={{ gap: 6 }}><IconMafia size={14} aria-hidden={true} />{COACH_NAME}, online</div>{explanation.value && <span class="hint">{explanation.value.model.replace('claude-', '')}</span>}</div>
          {explanation.value?.summary
            ? <p class="small" style={{ marginTop: 6 }}>{explanation.value.summary}</p>
            : <p class="small muted" style={{ marginTop: 6 }}>{explanation.value ? 'The coach answered, but its summary used a number that is not in your data, so it was left out.' : 'A fuller read of this week, written from the findings below. One call, cached until your data changes.'}</p>}
          {explanation.value && explanation.value.rejected > 0 && <p class="hint" style={{ marginTop: 6 }}>{explanation.value.rejected} line{explanation.value.rejected === 1 ? '' : 's'} left out for using a number not in your data.</p>}
          <div class="wrap" style={{ marginTop: 10 }}>
            <Button variant="primary" onClick={() => setAskOpen(true)}>Ask {COACH_NAME} a question</Button>
            {!explanation.value && <Button variant="quiet" size="sm" disabled={explaining.value} onClick={async () => { const r = await requestExplanation(); if (!r && explainError.value) showToast(explainError.value); }}>{explaining.value ? <Thinking /> : 'More from the coach'}</Button>}
          </div>
        </Card>
      )}

      <Section title="Suggestions" aside={open.length ? <span class="small muted">{open.length}</span> : undefined}>
        <div class="stack-sm">
          {open.map(sg => (
            <Card key={sg.id} class="suggestion card-press" onClick={() => setOpenSuggestion(sg)} aria-label={`Open suggestion: ${sg.title}`}>
              <div class="row-between"><span class="insight-cat" style={{ '--insight': 'var(--accent)' }}>{KIND_LABEL[sg.kind]}</span><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div>
              <h3 style={{ margin: '4px 0 6px' }}>{sg.title}</h3>
              <p class="small muted">{sg.summary}</p>
              <div class="row" style={{ marginTop: 10 }}>
                <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); accept(sg); }}>{sg.acceptLabel}</Button>
                <Button size="sm" variant="quiet" onClick={e => { e.stopPropagation(); dismiss(sg); }}>Not now</Button>
              </div>
            </Card>
          ))}
          {!open.length && <Card class="card-quiet"><p class="small muted">{dq.insufficientData ? 'Log a few sessions and suggestions appear here. Nothing changes unless you accept it.' : 'Nothing to suggest right now. Your plan fits what your sessions show.'}</p></Card>}
        </div>
      </Section>

      <Section title="Insights" aside={hidden > 0 ? <span class="small muted">+{hidden} more</span> : undefined}>
        <div class="stack-sm">
          {list.map(i => (
            <Card key={i.id} class="insight card-press" style={{ '--insight': INSIGHT_COLOR[i.category] }} onClick={() => setOpenInsight(i)} aria-label={`Open insight: ${i.title}`}>
              <div class="row-between"><span class="insight-cat">{CATEGORY_LABEL[i.category]}</span><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div>
              <h3 style={{ margin: '4px 0 6px' }}>{i.title}</h3>
              <p class="small muted">{i.action}</p>
            </Card>
          ))}
          {!list.length && <Card class="card-quiet"><p class="small muted">No strong signals right now. Keep logging and rating effort.</p></Card>}
        </div>
      </Section>

      <Section title="Training goal" aside={<Button variant="quiet" size="sm" onClick={() => setGoalOpen(true)}>Change</Button>}>
        <Card class="card-press" onClick={() => setGoalOpen(true)} aria-label={`Change training goal, currently ${goal.name}`}>
          <b>{goal.name}</b><div class="hint">{goal.tagline} · {goal.reps[0]}–{goal.reps[1]} reps{goal.accessoryReps ? ` (accessories ${goal.accessoryReps[0]}–${goal.accessoryReps[1]})` : ''}</div>
        </Card>
      </Section>

      <Schedule />

      {cue && (
        <Section title={cue.kind === 'learn' ? 'Worth knowing' : 'Coach tip'} aside={<Button variant="quiet" size="sm" onClick={() => setCueSeed(n => n + 1)}>Another</Button>}>
          <Card class="card-quiet"><b class="small">{cue.title}</b><p class="small muted" style={{ marginTop: 4 }}>{cue.text}</p>{lastExercise && <span class="hint">About {lastExercise.name}</span>}</Card>
        </Section>
      )}

      <Section title="How the coach thinks">
        <Card class="card-quiet">
          <div class="stack-sm small muted">
            <p><IconInfo size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Everything here is worked out on your phone from what you log. Suggestions never apply themselves; you accept or dismiss each one. Dismiss one twice and it stays away.</p>
            <p>Reps first, then load. Add a rep until you reach the top of your range, hit it twice without max effort, then take one small step up. Two sessions under the range at max effort means one step down.</p>
            <p>Recovery windows are 24, 48 or 72 hours by effort, wider after an unusually big session, and they only ever widen when your own history shows you need it.</p>
            <p>Every insight names the research it rests on, with an honest rating. Where the evidence is thin or the advice is coaching convention, it says so.</p>
          </div>
        </Card>
      </Section>

      {openInsight && <InsightSheet insight={openInsight} onClose={() => setOpenInsight(null)} />}
      {openSuggestion && <SuggestionSheet suggestion={openSuggestion} onAccept={() => accept(openSuggestion)} onDismiss={() => dismiss(openSuggestion)} onClose={() => setOpenSuggestion(null)} />}
      {askOpen && <AskSheet onClose={() => setAskOpen(false)} />}
      {goalOpen && (
        <Sheet title="Training goal" onClose={() => setGoalOpen(false)}>
          <div class="stack-sm">
            <p class="small muted">Your goal changes rep targets and the effort window. It does not change the exercises.</p>
            {GOALS.map(g => <Card key={g.id} class="card-press" style={{ borderColor: g.id === s.goal ? 'var(--accent)' : undefined }} onClick={() => { update(x => ({ ...x, goal: g.id as GoalId })); setGoalOpen(false); }} aria-label={`Set training goal to ${g.name}`}><b>{g.name}</b><div class="hint">{g.tagline} · {g.reps[0]}–{g.reps[1]} reps · {g.bestFor}</div></Card>)}
          </div>
        </Sheet>
      )}
    </div>
  );
}

/** The remote explainer's line for one insight or suggestion, when it exists. */
function OnlineNote({ id }: { id: string }) {
  if (!remoteEnabled.value) return null;
  const text = explanation.value?.items[id];
  if (text) return <Card class="card-quiet"><div class="eyebrow">From the coach, online</div><p class="small" style={{ marginTop: 4 }}>{text}</p></Card>;
  if (explanation.value) return null;
  return <Button size="sm" disabled={explaining.value} onClick={async () => { const r = await requestExplanation(); if (!r && explainError.value) showToast(explainError.value); }}>{explaining.value ? <Thinking /> : 'More from the coach'}</Button>;
}

function Evidence({ cards }: { cards: PrincipleCard[] }) {
  if (!cards.length) return null;
  return (
    <div>
      <div class="eyebrow" style={{ marginBottom: 6 }}>Based on</div>
      <div class="stack-sm">
        {cards.map(c => (
          <Card key={c.id} class="card-quiet">
            <b class="small">{c.title}</b>
            <div class="row" style={{ marginTop: 6 }}><Chip tone={c.rating === 'strong' ? 'positive' : c.rating === 'moderate' ? 'info' : 'warning'}>{RATING_LABEL[c.rating]}</Chip></div>
            <p class="small muted" style={{ marginTop: 8 }}>{c.statement}</p>
            {c.rating !== 'strong' && <p class="hint" style={{ marginTop: 4 }}>Disputed: {c.disputed}</p>}
          </Card>
        ))}
      </div>
    </div>
  );
}

function InsightSheet({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const s = state.value;
  const ex = insight.exerciseId ? findExercise(insight.exerciseId, s.customExercises) : undefined;
  const next = ex ? applyDeload(suggestNext(s.sessions, ex.id, s.goal, today.value, 3, s.customExercises), deload.value, today.value) : null;
  const hist = ex ? exerciseHistory(s.sessions, ex.id, s.customExercises).slice(-5).reverse() : [];
  return (
    <Sheet title={insight.title} onClose={onClose}>
      <div class="stack">
        <div class="row"><Chip tone="accent">{CATEGORY_LABEL[insight.category]}</Chip><Chip>{CONFIDENCE_LABEL[insight.confidence]}</Chip></div>
        <div class="chain">
          <div><span>Noticed</span><span>{insight.noticed}</span></div>
          <div><span>Means</span><span>{insight.means}</span></div>
          <div><span>Do next</span><span>{insight.action}</span></div>
        </div>
        <OnlineNote id={insight.id} />
        {next && <Card class="card-quiet"><div class="eyebrow">Next session</div><b>{next.target}</b><p class="small muted" style={{ marginTop: 4 }}>{next.reason}</p></Card>}
        {hist.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>Recent sessions</div><div class="list">{hist.map(h => <Row key={h.sessionId} trailing={<span class="hint num">{h.topKg ? `${formatLoad(h.topKg, s.preferences.weightUnit)} × ${h.topReps}` : `${h.bestReps} reps`}</span>}><span class="small">{h.day}</span></Row>)}</div></div>}
        <Evidence cards={insight.evidence} />
      </div>
    </Sheet>
  );
}

function SuggestionSheet({ suggestion: sg, onAccept, onDismiss, onClose }: { suggestion: Suggestion; onAccept: () => void; onDismiss: () => void; onClose: () => void }) {
  return (
    <Sheet title={sg.title} onClose={onClose}>
      <div class="stack">
        <div class="row"><Chip tone="accent">{KIND_LABEL[sg.kind]}</Chip><Chip>{CONFIDENCE_LABEL[sg.confidence]}</Chip></div>
        <p class="small">{sg.summary}</p>
        <OnlineNote id={sg.id} />
        {sg.why.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>Why</div><div class="stack-sm">{sg.why.map((line, i) => <p key={i} class="small muted">{line}</p>)}</div></div>}
        {sg.changes.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>What changes</div><div class="list">{sg.changes.map((line, i) => <Row key={i}><span class="small">{line}</span></Row>)}</div></div>}
        <Evidence cards={sg.evidence} />
        <div class="grid-2"><Button variant="quiet" onClick={onDismiss}>Not now</Button><Button variant="primary" onClick={onAccept}>{sg.acceptLabel}</Button></div>
      </div>
    </Sheet>
  );
}

/**
 * A short, grounded conversation with the coach: the report and the
 * research cards behind it, nothing about sessions, name or body. History
 * lives only in this sheet's own state — closing it forgets the exchange.
 */
/** A turn as shown on screen. "scope" and "category" are local-only (never sent back to the Worker as part of history) — "scope" says whether a reply was grounded in this person's report or is general knowledge, the same honest label the app uses for evidence quality everywhere else; "category" only picks which small icon marks its bullet points. */
type AskBubble = AskTurn & { scope?: 'personal' | 'general'; category?: AskCategory };

const ASK_CATEGORY_ICON: Record<AskCategory, (p: { size?: number; class?: string; 'aria-hidden'?: boolean }) => JSX.Element> = {
  nutrition: IconApple, body: IconBody, training: IconDumbbell, app: IconGear, general: IconInfo,
};

/** A personal touch, not a feature: every assistant reply gets this name and mark instead of a bare bubble. Replaces the old per-answer "General knowledge, not from your data" disclaimer — the underlying scope check (validateText/allowedNumbers below) still runs exactly as before; only the visible label changed. */
const COACH_NAME = 'Escobar';

/** `**term**` becomes emphasis; everything else passes through untouched. Never touches a raw string with HTML — this builds real child nodes, so there is nothing to escape or inject. */
function renderAskInline(text: string): ComponentChildren {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(p => p.length > 0);
  return parts.map((part, i) => (part.startsWith('**') && part.endsWith('**') && part.length > 4) ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

/**
 * The prompt (promptAsk.ts rule 13) allows a blank-line paragraph break and
 * a "- "-prefixed line list for an answer that is genuinely a set of
 * distinct items. This turns that plain-text convention into real <p>/<ul>
 * structure with a small category icon per bullet, rather than relying on
 * `white-space: pre-wrap` to fake it with raw dashes.
 */
function renderAskBody(text: string, category: AskCategory): ComponentChildren {
  const Icon = ASK_CATEGORY_ICON[category] ?? IconInfo;
  // A trailing (or doubled) blank line in the answer would otherwise survive
  // as an empty block below, rendering a stray <p> whose CSS top-margin adds
  // visible dead space at the bottom of the bubble.
  return text.split(/\n{2,}/).map(b => b.trim()).filter(Boolean).map((block, bi) => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const isList = lines.length > 0 && lines.every(l => l.startsWith('- '));
    if (isList) return <ul class="ask-list" key={bi}>{lines.map((l, li) => <li key={li}><Icon size={14} class="ask-list-icon" aria-hidden={true} /><span>{renderAskInline(l.slice(2))}</span></li>)}</ul>;
    return <p key={bi}>{renderAskInline(block.trim())}</p>;
  });
}

/**
 * Someone who has been logging for months has no way to know the coach can
 * compare their stats over time, or answer a plain anatomy/nutrition
 * question — nothing on screen hints at it. These rotate through the empty
 * input as a typed-out placeholder so the range of what's askable is
 * discoverable without a tutorial. One from each real category: personal
 * long-horizon comparison, app navigation, general knowledge, and injury.
 */
const ASK_SUGGESTIONS = [
  'How have I improved over the last 3 months?',
  'Why does my chest feel behind on volume?',
  'How do I see my recovery per muscle?',
  'What is progressive overload?',
  'How much protein should I aim for?',
  'What should I do if my shoulder feels sore?',
];

/** Types a suggestion out, holds it, erases it, moves to the next — only while `active` (the input is empty and nothing is sending). Falls back to a plain swap with no per-character animation under prefers-reduced-motion, the same treatment `Thinking`'s spinner gets in styles.css. */
function useTypewriterPlaceholder(active: boolean): string {
  const [text, setText] = useState('');
  useEffect(() => {
    if (!active) { setText(''); return; }
    const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TYPE_MS = 38, ERASE_MS = 22, HOLD_FULL_MS = 1600, HOLD_EMPTY_MS = 400;
    let cancelled = false, phrase = 0;
    const after = (fn: () => void, ms: number) => setTimeout(() => { if (!cancelled) fn(); }, ms);
    const run = () => {
      const full = ASK_SUGGESTIONS[phrase % ASK_SUGGESTIONS.length]!;
      if (reduced) { setText(full); after(() => { phrase++; run(); }, HOLD_FULL_MS + TYPE_MS * full.length); return; }
      const typeStep = (i: number) => {
        setText(full.slice(0, i));
        if (i >= full.length) { after(() => eraseStep(full.length), HOLD_FULL_MS); return; }
        after(() => typeStep(i + 1), TYPE_MS);
      };
      const eraseStep = (j: number) => {
        setText(full.slice(0, j));
        if (j <= 0) { after(() => { phrase++; run(); }, HOLD_EMPTY_MS); return; }
        after(() => eraseStep(j - 1), ERASE_MS);
      };
      typeStep(0);
    };
    run();
    return () => { cancelled = true; };
  }, [active]);
  return text;
}

/** Its own component so the typewriter's per-character re-renders touch only the input row, not the whole thread of past messages above it. */
function AskInputRow({ question, setQuestion, sending, onSubmit }: { question: string; setQuestion: (v: string) => void; sending: boolean; onSubmit: (e: SubmitEvent) => void }) {
  const placeholder = useTypewriterPlaceholder(question.length === 0 && !sending);
  return (
    <form class="ask-input" onSubmit={onSubmit}>
      <input value={question} maxLength={MAX_QUESTION_CHARS} placeholder={placeholder} disabled={sending} onInput={e => setQuestion((e.target as HTMLInputElement).value)} />
      <Button variant="primary" size="sm" type="submit" class="btn-icon" disabled={sending || !question.trim()} aria-label="Send"><IconSend size={16} /></Button>
    </form>
  );
}

function AskSheet({ onClose }: { onClose: () => void }) {
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
    const payload = buildAskPayload(report.value, plainHistory, q, { goal: s.goal, unit: s.preferences.weightUnit, preferenceFacts: s.coach.preferenceFacts });
    const withQuestion: AskBubble[] = [...history, { role: 'user', text: q }];
    setHistory(withQuestion);
    setQuestion('');
    setError(null);
    setSending(true);
    try {
      const r = await requestAskAnswer(payload, { url: s.coach.explainerUrl, deviceId: ensureDeviceId() });
      if (r.ok) setHistory([...withQuestion, { role: 'assistant', text: r.answer, scope: r.scope, category: r.category }]);
      else setError(r.error);
    } finally {
      setSending(false);
    }
  };

  return (
    <Sheet title="Ask the coach" onClose={onClose}>
      <div class="ask-thread" ref={threadRef}>
        {!history.length && <p class="small muted">Ask anything — your own training, or general questions about exercise, muscles or nutrition. Personal answers only use the findings and research below, nothing about your sessions or body.</p>}
        {history.map((turn, i) => (
          <div key={i} class={`ask-bubble ${turn.role === 'user' ? 'ask-user' : 'ask-assistant'}`}>
            {turn.role === 'assistant' && <div class="ask-persona"><IconCigarette size={15} aria-hidden={true} />{COACH_NAME}</div>}
            {turn.role === 'assistant' ? renderAskBody(turn.text, turn.category ?? 'general') : turn.text}
          </div>
        ))}
        {sending && <div class="ask-bubble ask-assistant"><Thinking /></div>}
      </div>
      {error && <p class="hint" style={{ color: 'var(--negative)', marginBottom: 8 }}>{error}</p>}
      <AskInputRow question={question} setQuestion={setQuestion} sending={sending} onSubmit={e => { e.preventDefault(); void send(); }} />
    </Sheet>
  );
}

function Schedule() {
  const s = state.value;
  const [open, setOpen] = useState(false);
  const active = WEEKDAYS.filter(d => s.schedule[d]);
  const set = (d: Weekday, id: string | null) => { update(x => ({ ...x, schedule: { ...x.schedule, [d]: id } })); void resyncReminders(); };
  const autoArrange = (n: number) => {
    const slots: Record<number, Weekday[]> = { 1: ['mon'], 2: ['mon', 'thu'], 3: ['mon', 'wed', 'fri'], 4: ['mon', 'tue', 'thu', 'sat'], 5: ['mon', 'tue', 'wed', 'fri', 'sat'], 6: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], 7: [...WEEKDAYS] };
    const days = slots[n] ?? slots[3]!;
    const sched = Object.fromEntries(WEEKDAYS.map(d => [d, null])) as Record<Weekday, string | null>;
    days.forEach((d, i) => { sched[d] = s.splits[i % s.splits.length]?.id ?? null; });
    update(x => ({ ...x, schedule: sched })); void resyncReminders();
  };
  return (
    <Section title="Weekly schedule" aside={<Button variant="quiet" size="sm" onClick={() => setOpen(true)}>Edit</Button>}>
      <Card class="card-press" onClick={() => setOpen(true)} aria-label="Edit weekly schedule">
        <div class="row" style={{ justifyContent: 'space-between' }}>
          {WEEKDAYS.map(d => { const sp = s.splits.find(x => x.id === s.schedule[d]); return <div key={d} style={{ textAlign: 'center' }}><div class="hint">{WEEKDAY_LABEL[d][0]}</div><div style={{ width: 10, height: 10, borderRadius: 5, margin: '4px auto 0', background: sp?.color ?? 'var(--surface-3)' }} /></div>; })}
        </div>
        <p class="hint" style={{ marginTop: 8 }}>{active.length ? `${active.length} training days a week. Reminders and streaks follow this.${s.coach.smartReminders ? ' Reminders are timed from your usual start.' : ''}` : 'No schedule. The coach will suggest one from how you actually train, or set one here.'}</p>
      </Card>
      {open && (
        <Sheet title="Weekly schedule" onClose={() => setOpen(false)}>
          <div class="stack">
            {!s.splits.length && <p class="small muted">Create a split first, then assign it to days.</p>}
            {WEEKDAYS.map(d => (
              <div key={d} class="row"><span style={{ width: 44 }} class="small">{WEEKDAY_LABEL[d]}</span>
                <select class="grow" value={s.schedule[d] ?? ''} onChange={e => set(d, (e.target as HTMLSelectElement).value || null)}><option value="">Rest</option>{s.splits.map(sp => <option key={sp.id} value={sp.id}>{sp.name}</option>)}</select>
              </div>
            ))}
            {s.splits.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 6 }}>Quick arrange</div><div class="wrap">{[2, 3, 4, 5, 6].map(n => <Chip key={n} onClick={() => autoArrange(n)}>{n} days</Chip>)}</div></div>}
          </div>
        </Sheet>
      )}
    </Section>
  );
}
