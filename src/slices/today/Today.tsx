import { useState } from 'preact/hooks';
import { state } from '@/core/store';
import { go } from '@/app/router';
import { deload, insights, recovery, scheduledSplit, sessionsToday, spark as personalSpark, streak, suggestions, today, todayChanges, todaySuggestion, week } from '@/app/selectors';
import { Button, Card, Chip, Section, Stat } from '@/ui/primitives';
import { IconChevron, IconFlame, IconGear, IconPlay } from '@/ui/icons';
import { settingsOpen } from '@/app/router';
import { formatDay, formatHours } from '@/core/dates';
import { muscleLabel } from '@/data/muscles';
import { SPARKS } from '@/data/sparks';
import { CATEGORY_LABEL } from '@/brain/coach/words';
import { acceptProposal } from '../coach/apply';
import { showToast } from '@/app/toast';
import { startSession } from '../workout/session';
import { INSIGHT_COLOR } from '../coach/Coach';
import { MuscleMap } from '@/ui/MuscleMap';
import { LogoMark } from '@/ui/Logo';

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
  const top = insights.value[0];
  const plan = todaySuggestion.value;
  const waiting = suggestions.value.filter(x => x.kind !== 'today_plan').length;
  const accept = () => { if (plan) showToast(acceptProposal(plan.proposal, today.value)); };
  const [dayIndex] = useState(() => Math.floor(new Date(today.value).getTime() / 86_400_000) % SPARKS.length);
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

      <Section title="This week" aside={<span class="small muted">{w.grade.title}</span>}>
        <Card>
          <div class="grid-3">
            <Stat value={w.workouts} label="workouts" />
            <Stat value={w.sets} label="sets" />
            <Stat value={w.records.length} label="records" tone={w.records.length ? 'positive' : undefined} />
          </div>
          <p class="small muted" style={{ marginTop: 10 }}>{w.grade.note}</p>
        </Card>
      </Section>

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

      {(top || waiting > 0) && (
        <Section title="Coach" aside={<button type="button" class="btn btn-quiet btn-sm" onClick={() => go('coach')}>All <IconChevron size={14} /></button>}>
          <div class="stack-sm">
            {top && (
              <Card class="insight" style={{ '--insight': INSIGHT_COLOR[top.category] }}>
                <div class="insight-cat">{CATEGORY_LABEL[top.category]}</div>
                <h3 style={{ margin: '4px 0 6px' }}>{top.title}</h3>
                <p class="small muted">{top.action}</p>
              </Card>
            )}
            {waiting > 0 && <Card class="card-quiet card-press" onClick={() => go('coach')}><div class="row-between"><span class="small">{waiting} suggestion{waiting === 1 ? '' : 's'} waiting for you</span><IconChevron size={16} style={{ color: 'var(--text-3)' }} /></div></Card>}
          </div>
        </Section>
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
