import { useMemo, useState } from 'preact/hooks';
import { AskAbout } from '@/escobar/ui/AskAbout';
import { state, update } from '@/core/store';
import { recovery, today, unit } from '@/app/selectors';
import { Button, Card, Chip, Field, Row, Section, Segmented, Sheet, Stat } from '@/ui/primitives';
import { MapLegend, MuscleMap, type MapMode } from '@/ui/MuscleMap';
import { MUSCLES, MUSCLE_BY_ID, muscleLabel, type MuscleId } from '@/data/muscles';
import { formatDay, formatHours } from '@/core/dates';
import { trainingLevels, weeklyMuscleSets, LEVELS } from '@/brain/exposure';
import { muscleVolumeStatus } from '@/brain/volume';
import { navyBodyFat } from '@/core/bodyfat';
import { LIBRARY } from '@/core/exercises';
import { exerciseHistory } from '@/brain/history';
import { modeLoadText } from '@/brain/bodyweight';
import { FULL_PCT, READY_PCT } from '@/data/recovery';
import { bodyView, openPanel, showPanel } from '@/app/router';
import { usePalaceFocus } from '@/escobar/palace/focus';

type View = 'recovery' | 'levels' | 'week';

export function Body() {
  const s = state.value;
  const view = bodyView.value;
  const setView = (v: View) => { bodyView.value = v; };
  const setSelected = (m: MuscleId) => showPanel('muscle', { muscle: m });
  const selected = openPanel.value?.id === 'muscle' ? (openPanel.value.params?.muscle as MuscleId | undefined) ?? null : null;
  usePalaceFocus('body.map', { view });
  const rec = recovery.value;
  const levels = useMemo(() => trainingLevels(s.sessions, s.customExercises), [s.sessions]);
  const weekSets = useMemo(() => weeklyMuscleSets(s.sessions, today.value, 1, s.customExercises)[0]?.sets ?? {}, [s.sessions, today.value]);
  const maxWeek = Math.max(1, ...Object.values(weekSets).map(v => v ?? 0));
  /** F3.2: this week's effective sets vs. the level-based band, faint-range on each bar. */
  const volumeStatus = useMemo(() => muscleVolumeStatus(s.sessions, today.value, s.customExercises).filter(r => r.status !== 'unknown').sort((a, b) => b.thisWeekSets - a.thisWeekSets), [s.sessions, today.value, s.customExercises]);

  const values: Partial<Record<MuscleId, number>> = view === 'recovery'
    ? Object.fromEntries(rec.filter(r => r.lastTrainedAt).map(r => [r.muscle, r.pct]))
    : view === 'levels'
      ? Object.fromEntries(MUSCLES.map(m => [m.id, levels[m.id].levelIndex ? (levels[m.id].levelIndex / (LEVELS.length - 1)) * 100 : undefined]))
      : Object.fromEntries((Object.entries(weekSets) as Array<[MuscleId, number]>).map(([m, v]) => [m, (v / maxWeek) * 100]));
  const mode: MapMode = view === 'recovery' ? 'recovery' : 'emphasis';
  const recovering = rec.filter(r => r.recovering).sort((a, b) => a.pct - b.pct);
  const readyOnly = rec.filter(r => r.ready && r.pct < FULL_PCT && r.lastTrainedAt);
  const fullyRecovered = rec.filter(r => r.pct >= FULL_PCT && r.lastTrainedAt);
  const wholeBody = rec.find(r => r.systemicFactor > 1);

  return (
    <div class="view">
      <div class="topbar"><div><div class="eyebrow">Body</div><h1>Muscle map</h1></div></div>
      <Segmented value={view} onChange={setView} options={[{ value: 'recovery', label: 'Recovery' }, { value: 'week', label: 'This week' }, { value: 'levels', label: 'Levels' }]} />
      <Card style={{ marginTop: 14 }} data-palace="body.map">
        <MuscleMap values={values} mode={mode} selected={selected} onSelect={m => setSelected(m)} />
        <div style={{ marginTop: 10 }}><MapLegend mode={mode} /></div>
        <p class="hint" style={{ marginTop: 8 }}>Tap a muscle for details. {view === 'recovery' ? `Ready for hard work at ${READY_PCT}%, fully recovered at ${FULL_PCT}%. Recovery time depends on sets, load and effort, and adjusts to your own history in both directions, within limits.` : view === 'week' ? 'Shading follows effective sets this week.' : 'Levels are a relative measure of how much you have trained each muscle. Not a medical measurement.'}</p>
        {view === 'recovery' && wholeBody && <p class="hint" style={{ marginTop: 4 }}>Whole body: recovering about {Math.round((wholeBody.systemicFactor - 1) * 100)}% slower than usual this week.</p>}
      </Card>

      {view === 'recovery' && (
        <>
          <Section title="Recovering" palace="body.recovering" aside={<span class="small muted">{recovering.length}</span>}>
            <Card>
              {!recovering.length && <p class="small muted">{readyOnly.length || fullyRecovered.length ? 'Everything you have trained is ready for hard work.' : 'Nothing logged yet.'}</p>}
              <div class="list">{recovering.map(r => (
                <Row key={r.muscle} onClick={() => setSelected(r.muscle)} trailing={<span class="hint num">{r.readyInHours ? `ready in ${formatHours(r.readyInHours[0])}–${formatHours(r.readyInHours[1])}` : r.soreToday && !r.hoursLeft ? 'sore today' : `${formatHours(r.hoursLeft)} left`}</span>}>
                  <div class="row-between small"><span>{muscleLabel(r.muscle)}</span><span class="muted">{r.pct}% · {r.confidence}</span></div>
                  <div class="bar" style={{ marginTop: 4 }}><i style={{ width: `${r.pct}%`, background: r.pct >= 75 ? 'var(--positive)' : r.pct >= 40 ? 'var(--warning)' : 'var(--negative)' }} /></div>
                </Row>
              ))}</div>
            </Card>
          </Section>
          <Section title="Ready for hard work" palace="body.ready" aside={<span class="small muted">{readyOnly.length}</span>}>
            <Card><div class="wrap">{readyOnly.map(r => <Chip key={r.muscle} onClick={() => setSelected(r.muscle)}>{muscleLabel(r.muscle)} · {r.pct}%</Chip>)}{!readyOnly.length && <span class="small muted">Muscles between ready and fully recovered show here.</span>}</div></Card>
          </Section>
          <Section title="Fully recovered" palace="body.full" aside={<span class="small muted">{fullyRecovered.length}</span>}>
            <Card><div class="wrap">{fullyRecovered.map(r => <Chip key={r.muscle} tone="positive" onClick={() => setSelected(r.muscle)}>{muscleLabel(r.muscle)}</Chip>)}{!fullyRecovered.length && <span class="small muted">Trained muscles show here once fully recovered.</span>}</div></Card>
          </Section>
        </>
      )}

      {view === 'levels' && (
        <Section title="Training levels" palace="body.levels">
          <Card><div class="list">{MUSCLES.map(m => levels[m.id]).map((l, i) => ({ l, m: MUSCLES[i]! })).sort((a, b) => b.l.score - a.l.score).map(({ l, m }) => <Row key={m.id} onClick={() => setSelected(m.id)} trailing={<Chip tone={l.levelIndex >= 4 ? 'accent' : undefined}>{l.level}</Chip>}><span class="small">{m.label}</span></Row>)}</div></Card>
        </Section>
      )}

      {view === 'week' && (
        <Section title="Effective sets this week" palace="body.week-volume">
          <Card><div class="list">
            {volumeStatus.map(r => {
              const scaleMax = Math.max(r.thisWeekSets, r.band[1]) * 1.15 || 1;
              return (
                <Row key={r.muscle} onClick={() => setSelected(r.muscle)} trailing={<span class="num small">{r.thisWeekSets}</span>}>
                  <span class="small">{muscleLabel(r.muscle)}</span>
                  <div class="bar" style={{ marginTop: 4 }}>
                    <span class="range" style={{ left: `${(r.band[0] / scaleMax) * 100}%`, width: `${((r.band[1] - r.band[0]) / scaleMax) * 100}%` }} />
                    <i style={{ width: `${(r.thisWeekSets / scaleMax) * 100}%`, background: r.thisWeekSets > r.band[1] ? 'var(--warning)' : 'var(--positive)' }} />
                  </div>
                </Row>
              );
            })}
            {!volumeStatus.length && <p class="small muted">No sets logged this week yet.</p>}
          </div></Card>
        </Section>
      )}

      <BodyFat />
    </div>
  );
}

/** One muscle, opened as the `muscle` panel (from the map, a list row, or Escobar). */
export function MuscleDetail({ muscle, onClose }: { muscle: MuscleId; onClose: () => void }) {
  const s = state.value;
  usePalaceFocus('body.muscle', { muscle });
  const u = unit.value;
  const r = recovery.value.find(x => x.muscle === muscle);
  const info = MUSCLE_BY_ID[muscle];
  if (!info || !r) { queueMicrotask(onClose); return null; }
  const levels = trainingLevels(s.sessions, s.customExercises)[muscle];
  const direct = [...s.customExercises, ...LIBRARY].filter(e => e.primary.includes(muscle));
  const logged = direct.map(e => ({ e, h: exerciseHistory(s.sessions, e.id, s.customExercises) })).filter(x => x.h.length).sort((a, b) => b.h[b.h.length - 1]!.day.localeCompare(a.h[a.h.length - 1]!.day));
  const markFresh = () => { update(x => ({ ...x, freshMarks: [...x.freshMarks, { muscle, at: new Date().toISOString() }].slice(-100) })); onClose(); };
  return (
    <Sheet title={info.label} onClose={onClose} palace="body.muscle">
      <div class="stack">
        <div class="row-between"><span class="hint">{info.label} at a glance</span><AskAbout refTo={{ kind: 'muscle', id: muscle, label: info.label }} /></div>
        <div class="grid-3">
          <Stat value={r.lastTrainedAt ? `${r.pct}%` : '—'} label="recovered" tone={r.recovering ? (r.pct < 40 ? 'negative' : 'warning') : 'positive'} />
          <Stat value={r.lastDay ? formatDay(r.lastDay) : 'never'} label="last trained" />
          <Stat value={levels.level} label="level" />
        </div>
        {r.recovering && (
          <p class="small muted">
            {r.readyInHours ? `Ready for hard work in about ${formatHours(r.readyInHours[0])} to ${formatHours(r.readyInHours[1])}` : r.soreToday && !r.hoursLeft ? 'Held back by today\'s soreness rating; ready for hard work once it eases' : `About ${formatHours(r.hoursLeft)} until ready for hard work`}
            {r.fullInHours != null && `, fully recovered in about ${formatHours(r.fullInHours)}`}. {r.confidence} confidence{r.personalized ? ' · adjusted to your own history' : ''}.
          </p>
        )}
        {r.drivers.length > 0 && <p class="hint">{r.drivers.map(d => d.text).join(' · ')}</p>}
        {r.recovering && <Button variant="quiet" size="sm" onClick={markFresh}>Mark as fresh</Button>}
        <div>
          <div class="eyebrow" style={{ marginBottom: 6 }}>Your exercises for this muscle</div>
          {!logged.length && <p class="small muted">Nothing logged for this muscle yet.</p>}
          <div class="list">{logged.slice(0, 6).map(({ e, h }) => { const last = h[h.length - 1]!; return <Row key={e.id} trailing={<span class="hint">{formatDay(last.day)}</span>}><div class="small">{e.name}</div><div class="hint">{last.topKg ? `${modeLoadText({ kg: last.topKg }, e.mode, u)} × ${last.topReps}` : `${last.bestReps || last.bestDurationSec} ${last.bestDurationSec ? 's' : 'reps'}`} · {h.length} sessions</div></Row>; })}</div>
        </div>
        <div>
          <div class="eyebrow" style={{ marginBottom: 6 }}>Exercises that target it directly</div>
          <div class="wrap">{direct.slice(0, 10).map(e => <Chip key={e.id}>{e.name}</Chip>)}</div>
        </div>
      </div>
    </Sheet>
  );
}

function BodyFat() {
  const s = state.value;
  const [open, setOpen] = useState(false);
  const [sex, setSex] = useState<'male' | 'female'>(s.profile.sex ?? 'male');
  // RG-09: tape measurements in cm or inches (inches by default for lb users); stored in cm.
  const [len, setLen] = useState<'cm' | 'in'>(s.preferences.weightUnit === 'lb' ? 'in' : 'cm');
  const toShown = (cm: number | undefined) => (cm == null ? '' : String(len === 'in' ? Math.round((cm / 2.54) * 10) / 10 : cm));
  const [height, setHeight] = useState(toShown(s.profile.heightCm));
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const cm = (v: string) => { const n = parseFloat(v.replace(',', '.')); return Number.isFinite(n) ? (len === 'in' ? n * 2.54 : n) : NaN; };
  const switchLen = (next: 'cm' | 'in') => {
    if (next === len) return;
    const conv = (v: string) => { const n = parseFloat(v.replace(',', '.')); return Number.isFinite(n) ? String(Math.round((next === 'in' ? n / 2.54 : n * 2.54) * 10) / 10) : v; };
    setHeight(conv(height)); setNeck(conv(neck)); setWaist(conv(waist)); setHip(conv(hip)); setLen(next);
  };
  const last = s.body[s.body.length - 1];
  const result = navyBodyFat({ sex, heightCm: cm(height), neckCm: cm(neck), waistCm: cm(waist), hipCm: cm(hip) || undefined });
  const save = () => {
    if (result == null) return;
    const r1 = (v: number) => Math.round(v * 10) / 10;
    update(x => ({ ...x, profile: { ...x.profile, sex, heightCm: Number.isFinite(cm(height)) ? r1(cm(height)) : x.profile.heightCm }, body: [...x.body, { day: today.value, neckCm: r1(cm(neck)), waistCm: r1(cm(waist)), hipCm: Number.isFinite(cm(hip)) ? r1(cm(hip)) : undefined, bodyFatPct: result, formula: 'navy-cm' }] }));
    setOpen(false);
  };
  return (
    <Section title="Body fat estimate" palace="body.bodyfat" aside={<Button variant="quiet" size="sm" onClick={() => setOpen(true)}>{last ? 'New reading' : 'Measure'}</Button>}>
      <Card>
        {last ? <div class="row-between"><Stat value={`${last.bodyFatPct}%`} label={`on ${formatDay(last.day)}`} />{s.body.length > 1 && <span class="small muted">{s.body.length} readings · first {s.body[0]!.bodyFatPct}%</span>}</div> : <p class="small muted">Tape-measure estimate using the US Navy method. Track the trend, not one reading.</p>}
      </Card>
      {open && (
        <Sheet title="Body fat estimate" onClose={() => setOpen(false)}>
          <div class="stack">
            <Segmented value={sex} onChange={setSex} options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }]} />
            <Segmented value={len} onChange={switchLen} options={[{ value: 'cm', label: 'cm' }, { value: 'in', label: 'in' }]} />
            <div class="grid-2">
              <Field label={`Height (${len})`}><input type="text" inputMode="decimal" value={height} onInput={e => setHeight((e.target as HTMLInputElement).value)} /></Field>
              <Field label={`Neck (${len})`}><input type="text" inputMode="decimal" value={neck} onInput={e => setNeck((e.target as HTMLInputElement).value)} /></Field>
              <Field label={`Waist (${len})`}><input type="text" inputMode="decimal" value={waist} onInput={e => setWaist((e.target as HTMLInputElement).value)} /></Field>
              {sex === 'female' && <Field label={`Hip (${len})`}><input type="text" inputMode="decimal" value={hip} onInput={e => setHip((e.target as HTMLInputElement).value)} /></Field>}
            </div>
            <Card class="card-quiet"><Stat value={result != null ? `${result}%` : '—'} label="estimated body fat" /></Card>
            <p class="hint">Typically within 3 to 4 points of lab methods. Not a medical measurement.</p>
            <Button variant="primary" disabled={result == null} onClick={save}>Save reading</Button>
          </div>
        </Sheet>
      )}
    </Section>
  );
}
