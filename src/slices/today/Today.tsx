import { useState } from 'preact/hooks';
import { state } from '@/core/store';
import { go } from '@/app/router';
import { closedWeekReview, deload, insights, objectiveReview, presenceMoment, recovery, report, scheduledSplit, sessionFeedback, sessionsToday, spark as personalSpark, streak, suggestions, today, todayChanges, todaySuggestion, unit, verdictCard, week } from '@/app/selectors';
import { Button, Card, Chip, Section, Stat } from '@/ui/primitives';
import { IconChevron, IconFlame, IconGear, IconPlay } from '@/ui/icons';
import { settingsOpen } from '@/app/router';
import { formatDay, formatHours } from '@/core/dates';
import { muscleLabel } from '@/data/muscles';
import { SPARKS } from '@/data/sparks';
import { COACH_NAME } from '@/ui/chatRender';
import { acceptProposal, dismissProposal } from '../coach/apply';
import { showToast } from '@/app/toast';
import { startSession } from '../workout/session';
import { InsightSheet, SuggestionSheet } from '../coach/Coach';
import { PresenceLauncher } from '../coach/Presence';
import { dismissPresenceLauncher } from '../coach/presenceState';
import { openAsk } from '../coach/askController';
import { MuscleMap } from '@/ui/MuscleMap';
import { HeartRateCard } from '@/heart-rate/HeartRateCard';
import { WatchInsights } from '@/heart-rate/WatchInsights';
import { LogoMark } from '@/ui/Logo';
import { ReadinessCheckIn } from './ReadinessCheckIn';
import { ReadinessVerdict } from './ReadinessVerdict';
import { WeekReview } from './WeekReview';

function greeting(): string {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

export function Today() {
  const s = state.value;
  const split = scheduledSplit.value;
  const done = sessionsToday.value;
  const live = s.active;
  const rec = recovery.value;
  const recovering = rec.filter(r => r.recovering).sort((a, b) => a.pct - b.pct);
  const ready = rec.filter(r => !r.recovering && r.lastTrainedAt).length;
  const w = week.value;
  const moment = presenceMoment.value;
  const feedback = sessionFeedback.value;
  const [momentOpen, setMomentOpen] = useState(false);
  const openInsight = moment?.kind === 'insight' ? insights.value.find(i => `insight:${i.id}` === moment.id) : undefined;
  const openSuggestion = moment?.kind === 'suggestion' ? suggestions.value.find(sg => `suggestion:${sg.dismissKey}` === moment.id) : undefined;
  const plan = todaySuggestion.value;
  const waiting = suggestions.value.filter(x => x.kind !== 'today_plan').length;
  const dueReview = !moment && waiting === 0 && objectiveReview.value?.due ? objectiveReview.value : null;
  const accept = () => { if (plan) showToast(acceptProposal(plan.proposal, today.value)); };
  const [dayIndex] = useState(() => Math.floor(new Date(today.value).getTime() / 86_400_000) % SPARKS.length);
  const [checkInSkipped, setCheckInSkipped] = useState(false);
  const checkedInToday = s.readiness.some(r => r.day === today.value);
  // A true line from this person's own log, when there's one worth showing; the standing quote otherwise.
  const ps = personalSpark.value;
  const spark = ps ? { topic: ps.title, text: ps.text, by: ps.by } : SPARKS[dayIndex]!;
  const values = Object.fromEntries(rec.filter(r => r.lastTrainedAt).map(r => [r.muscle, r.pct]));

  const status = live ? 'live' : done.length ? 'done' : split ? 'ready' : 'rest';

  return (
    <div class="view">
      <div class="topbar">
        <div>
          <div class="row" style={{ gap: 8, marginBottom: 6 }}><LogoMark size={22} /><span class="eyebrow">{formatDay(today.value, { weekday: 'long', day: 'numeric', month: 'long' })}</span></div>
          <h1>{greeting()}{s.profile.name ? `, ${s.profile.name}` : ''}</h1>
        </div>
        <div class="row">
          {streak.value > 0 && <Chip tone="warning"><IconFlame size={14} /> {streak.value}</Chip>}
          <Button variant="quiet" class="btn-icon" aria-label="Settings" onClick={() => { settingsOpen.value = true; }}><IconGear /></Button>
        </div>
      </div>

      {!checkedInToday && !checkInSkipped && <ReadinessCheckIn day={today.value} onDone={() => setCheckInSkipped(true)} />}
      {checkedInToday && verdictCard.value && <ReadinessVerdict card={verdictCard.value} acceptLabel={plan?.acceptLabel ?? null} onAccept={accept} onWhy={() => go('coach')} />}

      <Card class="card-accent">
        {status === 'live' && (
          <div class="stack-sm">
            <div class="eyebrow">Session in progress</div>
            <h2>{s.splits.find(x => x.id === live!.splitId)?.name ?? 'Workout'}</h2>
            <p class="muted small">{live!.entries.filter(e => e.done).length} of {live!.entries.length} exercises done.</p>
            <Button variant="primary" onClick={() => go('train')}><IconPlay /> Continue session</Button>
          </div>
        )}
        {status === 'done' && (
          <div class="stack-sm">
            <div class="eyebrow">Today</div>
            <h2>{done.map(d => d.splitName).join(' + ')} done</h2>
            <p class="muted small">{done.reduce((a, d) => a + d.exercises.reduce((x, e) => x + e.sets.length, 0), 0)} sets logged. Recovery has started.</p>
            {feedback && <p class="small"><b>{feedback.copy.headline}.</b> {feedback.copy.summary}{feedback.achievements.length ? ` ${feedback.achievements.length} new ${feedback.achievements.length === 1 ? 'best' : 'bests'} recorded.` : ''}</p>}
            <div class="row"><Button onClick={() => go('body')}>View recovery</Button><Button variant="quiet" onClick={() => go('history')}>History</Button></div>
          </div>
        )}
        {status === 'ready' && split && (
          <div class="stack-sm">
            <div class="eyebrow">Scheduled today</div>
            <h2>{split.name}</h2>
            <p class="muted small">{split.exercises.length} exercises planned{todayChanges.value.length ? `, ${todayChanges.value.length} swapped for today` : ''}.</p>
            <Button variant="primary" onClick={() => { startSession(split, todayChanges.value); go('train'); }}><IconPlay /> Start {split.name}</Button>
            {plan && (
              <div class="stack-sm" style={{ marginTop: 6 }}>
                <p class="small">{plan.summary}</p>
                <div class="row"><Button size="sm" onClick={accept}>{plan.acceptLabel}</Button><Button variant="quiet" size="sm" onClick={() => go('coach')}>Why</Button></div>
              </div>
            )}
          </div>
        )}
        {status === 'rest' && (
          <div class="stack-sm">
            <div class="eyebrow">Rest day</div>
            <h2>{s.splits.length ? 'Nothing scheduled' : 'Set up your first workout'}</h2>
            <p class="muted small">{plan ? plan.summary : s.splits.length ? 'Train anyway, or let today be recovery.' : 'Add a split with a few exercises. The coach learns from what you log.'}</p>
            <div class="row">
              {plan && <Button variant="primary" onClick={accept}>{plan.acceptLabel}</Button>}
              <Button variant={plan ? 'quiet' : 'default'} onClick={() => go('train')}>{s.splits.length ? 'Choose a workout' : 'Open Train'}</Button>
            </div>
          </div>
        )}
      </Card>

      {deload.value && <div class="banner" role="status">Easier week until {formatDay(deload.value.to)}. Targets in Train are about {Math.round(deload.value.loadFactor * 100)}% of your usual.</div>}

      <HeartRateCard compact />
      <WatchInsights compact />

      <Section title="This week" aside={<span class="small muted">Week in progress</span>}>
        <Card>
          <div class="grid-3">
            <Stat value={w.workouts} label="workouts" />
            <Stat value={w.sets} label="sets" />
            <Stat value={w.records.length} label="records" tone={w.records.length ? 'positive' : undefined} />
          </div>
          <p class="small muted" style={{ marginTop: 10 }}>Your logged work so far.</p>
        </Card>
      </Section>

      {closedWeekReview.value && <Section title="Week in review"><WeekReview review={closedWeekReview.value} unit={unit.value} /></Section>}

      <Section title="Recovery" aside={<button type="button" class="btn btn-quiet btn-sm" onClick={() => go('body')}>Body <IconChevron size={14} /></button>}>
        <Card>
          <div class="row" style={{ alignItems: 'flex-start' }}>
            <div style={{ width: 120, flex: 'none' }}><MuscleMap values={values} mode="recovery" compact /></div>
            <div class="grow stack-sm">
              {recovering.length === 0 && <p class="small">{ready ? 'Every muscle you have trained is fully recovered.' : 'Log a session and recovery shows up here.'}</p>}
              {recovering.slice(0, 4).map(r => (
                <div key={r.muscle} class="row-between small">
                  <span>{muscleLabel(r.muscle)}</span>
                  <span class="muted num">{r.pct}% · {formatHours(r.hoursLeft)}</span>
                </div>
              ))}
              {recovering.length > 4 && <span class="hint">+{recovering.length - 4} more recovering</span>}
            </div>
          </div>
        </Card>
      </Section>

      <Section title="Coach" aside={<button type="button" class="btn btn-quiet btn-sm" onClick={() => go('coach')}>All <IconChevron size={14} /></button>}>
          <div class="stack-sm">
            <PresenceLauncher
              moment={moment}
              label={COACH_NAME}
              onOpen={() => moment ? setMomentOpen(true) : openAsk()}
              onDismiss={m => { dismissPresenceLauncher(m); }}
            />
            {waiting > 0 && <Card class="card-quiet card-press" onClick={() => go('coach')} aria-label={`${waiting} suggestion${waiting === 1 ? '' : 's'} waiting — open Coach`}><div class="row-between"><span class="small">{waiting} suggestion{waiting === 1 ? '' : 's'} waiting for you</span><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div></Card>}
            {dueReview && <Card class="card-quiet card-press" onClick={() => go('coach')} aria-label="Direction review due — open Coach"><div class="row-between"><div><b class="small">Your direction is ready to review</b><p class="hint" style={{ marginTop: 4 }}>{dueReview.measures.length} selected evidence measure{dueReview.measures.length === 1 ? '' : 's'}, using the records available now.</p></div><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div></Card>}
          </div>
      </Section>
      {momentOpen && openInsight && <InsightSheet insight={openInsight} onClose={() => setMomentOpen(false)} />}
      {momentOpen && openSuggestion && (
        <SuggestionSheet
          suggestion={openSuggestion}
          onAccept={() => { showToast(acceptProposal(openSuggestion.proposal, today.value)); setMomentOpen(false); }}
          onDismiss={() => { dismissProposal(openSuggestion.proposal, today.value, report.value); setMomentOpen(false); }}
          onClose={() => setMomentOpen(false)}
        />
      )}

      {s.preferences.showSpark && (
        <Section title="Daily spark">
          <Card class="card-quiet">
            <div class="eyebrow">{spark.topic}</div>
            <p style={{ margin: '8px 0 6px', fontSize: 16 }}>{spark.text}</p>
            <span class="hint">{spark.by}</span>
          </Card>
        </Section>
      )}
    </div>
  );
}
