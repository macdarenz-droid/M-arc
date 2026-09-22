import { useEffect, useMemo, useState } from 'preact/hooks';
import { Card, Stat } from '@/ui/primitives';
import type { Session } from '@/core/models';
import { state } from '@/core/store';
import { heartRateContext, heartRateSessionEvidence } from '@/brain/heart-rate';
import { contextAdvice, contextObservation, evidenceReason } from './words';
import { getHeartRateTrace } from './store';
import type { HeartRateTrace } from './types';
import { TraceChart } from './TraceChart';

export function SessionHeartRate({ session, showAdvice = true }: { session: Session; showAdvice?: boolean }) {
  const [trace, setTrace] = useState<HeartRateTrace | null>(null);
  useEffect(() => {
    let live = true;
    setTrace(null);
    void getHeartRateTrace(session.id).then(value => { if (live) setTrace(value); }).catch(() => undefined);
    return () => { live = false; };
  }, [session.id, session.heartRate]);

  // The stored summary is authoritative. The native recorder computed it with
  // knowledge the trace alone does not carry (disconnection gaps with no
  // packets at all), so recomputing here would quietly disagree with History.
  const summary = session.heartRate;
  const evidence = useMemo(() => heartRateSessionEvidence(session, Date.parse(session.endedAt) + 1), [session]);
  const context = useMemo(() => heartRateContext(
    state.value.sessions.filter(s => Date.parse(s.endedAt) <= Date.parse(session.endedAt)),
    Date.parse(session.endedAt) + 1,
  ), [session, state.value.sessions]);
  const observation = contextObservation(context);

  if (!summary?.sampleCount && !trace?.samples.length) return null;
  return (
    <Card class="card-quiet hr-session-summary">
      <div class="eyebrow">Recorded heart rate · {evidence.quality === 'eligible' ? 'usable for comparison' : 'limited context'}</div>
      <div class="grid-3" style={{ marginTop: 8 }}>
        <Stat value={evidence.averageBpm ?? '—'} label="average bpm" />
        <Stat value={evidence.peakBpm ?? '—'} label="recorded peak" />
        <Stat value={evidence.coveragePct != null ? `${evidence.coveragePct}%` : '—'} label="capture coverage" />
      </div>
      {evidence.coveragePct != null && <div class="watch-capture" aria-label={`${evidence.coveragePct}% of elapsed workout time captured`}><i style={{ width: `${evidence.coveragePct}%` }} /></div>}
      <p class="hint">{evidenceReason(evidence)}</p>
      {!!summary?.gapCount && <p class="hint" style={{ marginTop: 8 }}>{summary.gapCount} signal gap{summary.gapCount === 1 ? '' : 's'} over 15 seconds.</p>}
      {!!trace?.samples.length && <TraceChart samples={trace.samples} session={session} />}
      {showAdvice && observation && context.latest?.id === session.id && <p class="small" style={{ marginTop: 12 }}>{observation}</p>}
      {showAdvice && context.state === 'ready' && context.latest?.id === session.id && <p class="hint" style={{ marginTop: 6 }}>{contextAdvice(context)}</p>}
    </Card>
  );
}
