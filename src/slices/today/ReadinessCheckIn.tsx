/**
 * The 10-second morning check-in: three taps, sleep, soreness and stress,
 * each 1 (worst) to 5 (best) — the trimmed Hooper-style scale the brain
 * reads in brain/coach/detectors/readiness.ts and detectors/recovery.ts.
 * Shown on Today until answered or skipped for the day; skipping is only
 * remembered for this visit, so it offers again next time the app opens.
 */
import { useState } from 'preact/hooks';
import { state, update, flushSave } from '@/core/store';
import type { ReadinessEntry } from '@/core/models';
import { Button, Card, Segmented } from '@/ui/primitives';

type Scale = ReadinessEntry['sleep'];
const SCALE_OPTIONS = (['1', '2', '3', '4', '5'] as const).map(v => ({ value: v, label: v }));

function ScaleRow({ label, hint, value, onChange }: { label: string; hint: string; value: Scale | null; onChange: (v: Scale) => void }) {
  return (
    <div class="stack-sm">
      <div class="row-between"><span class="small">{label}</span><span class="hint">{hint}</span></div>
      <Segmented value={value != null ? String(value) : ''} options={SCALE_OPTIONS} onChange={v => onChange(Number(v) as Scale)} />
    </div>
  );
}

export function ReadinessCheckIn({ day, onDone }: { day: string; onDone: () => void }) {
  const [sleep, setSleep] = useState<Scale | null>(null);
  const [soreness, setSoreness] = useState<Scale | null>(null);
  const [stress, setStress] = useState<Scale | null>(null);
  const ready = sleep != null && soreness != null && stress != null;

  const save = () => {
    if (!ready) return;
    const entry: ReadinessEntry = { day, sleep, soreness, stress };
    update(s => ({ ...s, readiness: [...s.readiness.filter(r => r.day !== day), entry] }));
    flushSave();
    onDone();
  };

  return (
    <Card class="card-quiet stack-sm">
      <div class="eyebrow">Morning check-in</div>
      <ScaleRow label="Sleep" hint="1 rough – 5 great" value={sleep} onChange={setSleep} />
      <ScaleRow label="Soreness" hint="1 very sore – 5 fresh" value={soreness} onChange={setSoreness} />
      <ScaleRow label="Stress" hint="1 high – 5 calm" value={stress} onChange={setStress} />
      <div class="row">
        <Button size="sm" disabled={!ready} onClick={save}>Save</Button>
        <Button size="sm" variant="quiet" onClick={onDone}>Skip today</Button>
      </div>
    </Card>
  );
}
