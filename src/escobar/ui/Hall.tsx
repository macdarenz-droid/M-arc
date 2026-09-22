/**
 * The Hall (§4.1): the top of the Escobar tab. The composer with three context chips,
 * today's brief (the brain's own words until EV8 adds Escobar's), plans and agreements,
 * and what Escobar knows. Coach.tsx renders this above its existing sections.
 */
import { state } from '@/core/store';
import { activeDeload, insights, today, todayReadiness } from '@/app/selectors';
import { showPanel } from '@/app/router';
import { Card, Row, Section } from '@/ui/primitives';
import { IconChevron, IconEscobar } from '@/ui/icons';
import { online } from '../state';
import { starterChips } from './prompts';
import { openAndSend, openEscobar } from './open';

function HallComposer() {
  const s = state.value;
  const on = s.escobar.enabled;
  const off = on && online.value === false;
  return (
    <Card class="esc-hall" data-palace="coach.hall">
      <div class="row" style={{ gap: 10 }}>
        <IconEscobar size={28} />
        <button type="button" class="esc-hall-input" onClick={() => openEscobar({ detent: 'full' })} disabled={off}>{on ? 'Ask Escobar…' : 'Turn on Escobar'}</button>
      </div>
      {off && <p class="small muted">Escobar is offline. Your notes below still update.</p>}
      {on && !off && <div class="esc-chips">{starterChips(s, todayReadiness.value).slice(0, 3).map(c => <button type="button" key={c} class="chip chip-btn" onClick={() => openAndSend(c)}>{c}</button>)}</div>}
      {!on && <p class="small muted">An AI coach that knows your training and this app. You choose what it sees.</p>}
    </Card>
  );
}

function TodaysBrief() {
  const b = state.value.escobar.brief;
  const fresh = b && b.day === today.value ? b : null;
  const top = insights.value[0];
  if (!fresh && !top) return null;
  return (
    <Section title="Today’s brief" palace="coach.brief">
      <Card class="card-quiet">
        {fresh ? <><b>{fresh.headline}</b>{fresh.priorities.map(p => <p key={p.insightId} class="small muted" style={{ marginTop: 4 }}>{p.line}</p>)}</>
          : <><b>{top!.title}</b><p class="small muted" style={{ marginTop: 4 }}>{top!.action}</p></>}
      </Card>
    </Section>
  );
}

function PlansAndAgreements() {
  const s = state.value;
  const d = activeDeload.value;
  const o = s.escobar.todayOverride?.day === today.value ? s.escobar.todayOverride : null;
  const agreements = s.escobar.memory.filter(m => m.kind === 'agreement');
  const pins = s.escobar.pins;
  const empty = !d && !o && !agreements.length && !pins.length;
  return (
    <Section title="Plans and agreements" palace="coach.plans">
      <Card class="card-quiet stack-sm">
        {d && <div class="small"><b>Lighter week</b> <span class="muted">until {d.endDay}</span></div>}
        {o && <div class="small"><b>Today adjusted</b> <span class="muted">{o.reason}</span></div>}
        {pins.map(p => <div key={p.id} class="small"><b>Pinned</b> <span class="muted">{p.title}</span></div>)}
        {agreements.map(a => <div key={a.id} class="small"><b>Agreed</b> <span class="muted">{a.text}</span></div>)}
        {empty && <p class="small muted">Nothing agreed yet. When you and Escobar settle on a change, it shows here.</p>}
      </Card>
    </Section>
  );
}

function WhatEscobarKnows() {
  const n = state.value.escobar.memory.length;
  return (
    <Row palace="coach.knows" onClick={() => showPanel('memory')} trailing={<IconChevron size={16} />}>
      <div><b class="small">What Escobar knows</b><div class="hint">{n ? `${n} thing${n === 1 ? '' : 's'} remembered` : 'Nothing remembered yet'}</div></div>
    </Row>
  );
}

export function Hall() {
  return (
    <>
      <HallComposer />
      <TodaysBrief />
      <PlansAndAgreements />
      <WhatEscobarKnows />
    </>
  );
}
