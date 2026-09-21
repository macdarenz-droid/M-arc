import { useMemo, useState } from 'preact/hooks';
import { state, update } from '@/core/store';
import { deload, insights, report, suggestions, today } from '@/app/selectors';
import { Button, Card, Chip, Row, Section, Sheet, Thinking } from '@/ui/primitives';
import { IconChevron, IconInfo, IconMafia } from '@/ui/icons';
import { COACH_NAME } from '@/ui/chatRender';
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
import { openAsk, openAskSavedReview } from './askController';
import { resyncReminders } from '../settings/reminders';
import { acceptProposal, dismissProposal, endDeload } from './apply';
import { explainError, explaining, explanation, remoteEnabled, requestExplanation } from './remote';
import { go } from '@/app/router';
import { UnfinishedItems } from './UnfinishedItems';

export const INSIGHT_COLOR: Record<Category, string> = {
  recovery: 'var(--positive)', progress: 'var(--warning)', readiness: 'var(--info)', balance: 'var(--accent)', focus: 'var(--accent)',
  consistency: 'var(--warning)', data: 'var(--text-3)', volume: 'var(--info)',
};

const KIND_LABEL: Record<Suggestion['kind'], string> = {
  schedule: 'Schedule', today_plan: 'Today', exercise_swap: 'Swap', add_exercise: 'Add', split_modify: 'Trim', split_new: 'New plan',
  load_next: 'Next session', rest_default: 'Rest', deload_week: 'Easier week',
};

const CONFIDENCE_LABEL: Record<Insight['confidence'], string> = { low: 'Low confidence', medium: 'Fair confidence', high: 'High confidence' };

/**
 * No shared PresenceLauncher here (docs/escobar-presence P02) — deliberately,
 * not an oversight. Its selector ranks the exact same `suggestions.value` /
 * `insights.value` arrays this screen already renders in full below, so its
 * top pick is structurally guaranteed to already be the first "Suggestions"
 * or "Insights" card here. A launcher would duplicate that card, not surface
 * a new one — the one thing every other presence surface is built to avoid.
 */
export function Coach() {
  const s = state.value;
  const list = useMemo(() => {
    const ranked = shortlist(insights.value, 6, 2);
    const reviews = insights.value.filter(item => item.reviewInTrain).slice(0, 2);
    if (!reviews.some(item => !ranked.some(candidate => candidate.id === item.id))) return ranked;
    const reviewIds = new Set(reviews.map(item => item.id));
    return [...ranked.filter(item => !reviewIds.has(item.id)).slice(0, 6 - reviews.length), ...reviews]
      .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  }, [insights.value]);
  const hidden = insights.value.length - list.length;
  const open = suggestions.value;
  const [openInsight, setOpenInsight] = useState<Insight | null>(null);
  const [openSuggestion, setOpenSuggestion] = useState<Suggestion | null>(null);
  const [openSkipGroup, setOpenSkipGroup] = useState<Suggestion[] | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const goal = GOALS.find(g => g.id === s.goal) ?? GOALS[0]!;
  const lastExercise = useMemo(() => { const last = s.sessions[s.sessions.length - 1]; return last?.exercises[0] ? findExercise(last.exercises[0].exerciseId, s.customExercises) : undefined; }, [s.sessions]);
  const [cueSeed, setCueSeed] = useState(0);
  const cue: Cue | null = lastExercise ? pickCue(lastExercise, cueSeed % 2 ? 'learn' : 'coach', `${today.value}|${cueSeed}`) : null;
  const dq = report.value.dataQuality;

  const accept = (sg: Suggestion) => { showToast(acceptProposal(sg.proposal, today.value)); setOpenSuggestion(null); };
  const dismiss = (sg: Suggestion) => { dismissProposal(sg.proposal, today.value, report.value); showToast('Not now. It can come back later.'); setOpenSuggestion(null); };
  const skipSource = (sg: Suggestion) => sg.proposal.basedOn.find(id => id.startsWith('chronic_skip:'));
  const visibleSuggestions = open.filter((sg, index) => {
    const source = skipSource(sg);
    return !source || open.findIndex(candidate => skipSource(candidate) === source) === index;
  });
  const alternativesFor = (sg: Suggestion) => {
    const source = skipSource(sg);
    return source ? open.filter(candidate => skipSource(candidate) === source) : [sg];
  };
  const dismissSkipGroup = (group: Suggestion[]) => {
    for (const sg of group) dismissProposal(sg.proposal, today.value, report.value);
    showToast('Not now. It can come back later.');
    setOpenSkipGroup(null);
  };

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
            <Button variant="primary" onClick={openAsk}>Ask {COACH_NAME} a question</Button>
            {!explanation.value && <Button variant="quiet" size="sm" disabled={explaining.value} onClick={async () => { const r = await requestExplanation(); if (!r && explainError.value) showToast(explainError.value); }}>{explaining.value ? <Thinking /> : 'More from the coach'}</Button>}
          </div>
        </Card>
      )}

      <UnfinishedItems onReview={item => openAskSavedReview(item?.key)} />

      <Section title="Suggestions" aside={visibleSuggestions.length ? <span class="small muted">{visibleSuggestions.length}</span> : undefined}>
        <div class="stack-sm">
          {visibleSuggestions.map(sg => {
            const alternatives = alternativesFor(sg);
            const skipChoice = !!skipSource(sg);
            return <Card key={sg.id} class="suggestion card-press" onClick={() => skipChoice ? setOpenSkipGroup(alternatives) : setOpenSuggestion(sg)} aria-label={`Open suggestion: ${sg.title}`}>
              <div class="row-between"><span class="insight-cat" style={{ '--insight': 'var(--accent)' }}>{KIND_LABEL[sg.kind]}</span><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div>
              <h3 style={{ margin: '4px 0 6px' }}>{sg.title}</h3>
              <p class="small muted">{sg.summary}</p>
              <ReopenedNote suggestion={sg} />
              <div class="wrap" style={{ marginTop: 10 }}>
                {skipChoice ? alternatives.map(option => <Button key={option.id} size="sm" variant="primary" onClick={e => { e.stopPropagation(); accept(option); }}>{skipAcceptLabel(option)}</Button>)
                  : <Button size="sm" variant="primary" onClick={e => { e.stopPropagation(); accept(sg); }}>{sg.acceptLabel}</Button>}
                <Button size="sm" variant="quiet" onClick={e => { e.stopPropagation(); skipChoice ? dismissSkipGroup(alternatives) : dismiss(sg); }}>Not now</Button>
              </div>
            </Card>;
          })}
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
            <p><IconInfo size={14} style={{ display: 'inline', verticalAlign: '-2px' }} /> Everything here is worked out on your phone from what you log. Suggestions never apply themselves; you accept or dismiss each one. Dismissed suggestions may return once if later logs provide stronger evidence.</p>
            <p>Reps first, then load. Add a rep until you reach the top of your range, hit it twice without max effort, then take one small step up. Two sessions under the range at max effort means one step down.</p>
            <p>Recovery windows are 24, 48 or 72 hours by effort, wider after an unusually big session, and they only ever widen when your own history shows you need it.</p>
            <p>Every insight names the research it rests on, with an honest rating. Where the evidence is thin or the advice is coaching convention, it says so.</p>
          </div>
        </Card>
      </Section>

      {openInsight && <InsightSheet insight={openInsight} onClose={() => setOpenInsight(null)} />}
      {openSuggestion && <SuggestionSheet suggestion={openSuggestion} onAccept={() => accept(openSuggestion)} onDismiss={() => dismiss(openSuggestion)} onClose={() => setOpenSuggestion(null)} />}
      {openSkipGroup && <ChronicSkipSheet suggestions={openSkipGroup} onAccept={sg => { accept(sg); setOpenSkipGroup(null); }} onDismiss={() => dismissSkipGroup(openSkipGroup)} onClose={() => setOpenSkipGroup(null)} />}
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

export function InsightSheet({ insight, onClose }: { insight: Insight; onClose: () => void }) {
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
        {insight.reviewInTrain && <Button variant="primary" onClick={() => { onClose(); go('train'); }}>Review in Train</Button>}
        <Evidence cards={insight.evidence} />
      </div>
    </Sheet>
  );
}

function skipAcceptLabel(sg: Suggestion): string {
  const apply = sg.proposal.apply;
  if (apply.kind === 'split_modify') return `Remove from ${state.value.splits.find(split => split.id === apply.splitId)?.name ?? 'split'}`;
  if (apply.kind === 'exercise_swap') return `Use ${findExercise(apply.toExerciseId, state.value.customExercises)?.name ?? 'replacement'}`;
  return sg.acceptLabel;
}

function ReopenedNote({ suggestion }: { suggestion: Suggestion }) {
  const reopened = suggestion.proposal.reopened;
  if (!reopened) return null;
  return <p class="hint" style={{ marginTop: 6 }}>New evidence since you dismissed this {reopened.elapsedDays} days ago: {reopened.newSessions} more sessions support it.</p>;
}

function ChronicSkipSheet({ suggestions: group, onAccept, onDismiss, onClose }: { suggestions: Suggestion[]; onAccept: (sg: Suggestion) => void; onDismiss: () => void; onClose: () => void }) {
  const first = group[0]!;
  return (
    <Sheet title="Choose a split change" onClose={onClose}>
      <div class="stack">
        <p class="small">Keep the work realistic for your current routine. Choose a change, or leave the split as it is.</p>
        {first.why.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>Why</div><p class="small muted">{first.why[0]}</p></div>}
        <div class="stack-sm">
          {group.map(sg => <Card key={sg.id} class="card-quiet"><div class="stack-sm"><b class="small">{sg.changes[0] ?? sg.title}</b><Button variant="primary" onClick={() => onAccept(sg)}>{skipAcceptLabel(sg)}</Button></div></Card>)}
        </div>
        <Evidence cards={first.evidence} />
        <Button variant="quiet" onClick={onDismiss}>Not now</Button>
      </div>
    </Sheet>
  );
}

export function SuggestionSheet({ suggestion: sg, onAccept, onDismiss, onClose }: { suggestion: Suggestion; onAccept: () => void; onDismiss: () => void; onClose: () => void }) {
  return (
    <Sheet title={sg.title} onClose={onClose}>
      <div class="stack">
        <div class="row"><Chip tone="accent">{KIND_LABEL[sg.kind]}</Chip><Chip>{CONFIDENCE_LABEL[sg.confidence]}</Chip></div>
        <p class="small">{sg.summary}</p>
        <ReopenedNote suggestion={sg} />
        <OnlineNote id={sg.id} />
        {sg.why.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>Why</div><div class="stack-sm">{sg.why.map((line, i) => <p key={i} class="small muted">{line}</p>)}</div></div>}
        {sg.changes.length > 0 && <div><div class="eyebrow" style={{ marginBottom: 4 }}>What changes</div><div class="list">{sg.changes.map((line, i) => <Row key={i}><span class="small">{line}</span></Row>)}</div></div>}
        <Evidence cards={sg.evidence} />
        <div class="grid-2"><Button variant="quiet" onClick={onDismiss}>Not now</Button><Button variant="primary" onClick={onAccept}>{sg.acceptLabel}</Button></div>
      </div>
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
