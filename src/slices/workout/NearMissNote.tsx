import type { NearMiss } from '@/brain/coach/detectors/nearmiss';
import { formatLoad } from '@/core/units';
import { Card } from '@/ui/primitives';
import { IconTrophy } from '@/ui/icons';

export function nearMissText(miss: NearMiss, unit: 'kg' | 'lb'): string {
  if (miss.kind === 'reps_at_load' && miss.value === miss.standing) return `Matched your ${miss.standing}-rep best at ${formatLoad(miss.kg!, unit)}. ${miss.gap} more rep would be a new rep record.`;
  if (miss.kind === 'reps_at_load') return `${miss.value} reps at ${formatLoad(miss.kg!, unit)}; previous best ${miss.standing}. ${miss.required} would beat it.`;
  if (miss.kind === 'best_reps') return `${miss.value} reps; previous best ${miss.standing}. ${miss.required} would beat it.`;
  if (miss.kind === 'heaviest') return `Logged ${formatLoad(miss.value, unit)}; heaviest previously ${formatLoad(miss.standing, unit)}. A load above ${formatLoad(miss.standing, unit)} would beat it; the next normal step is ${formatLoad(miss.required, unit)}.`;
  return `Strength estimate ${formatLoad(miss.value, unit)}; the next record threshold is ${formatLoad(miss.required, unit)}.`;
}

export function NearMissNote({ miss, unit }: { miss: NearMiss; unit: 'kg' | 'lb' }) {
  return (
    <Card class="card-quiet" aria-label={`Close to a record: ${miss.exerciseName}`}>
      <div class="row"><span class="pr-badge"><IconTrophy size={12} /> Close to a record</span></div>
      <b class="small">{miss.exerciseName}</b>
      <p class="small" style={{ marginTop: 4 }}>{nearMissText(miss, unit)}</p>
      <p class="hint" style={{ marginTop: 4 }}>A useful marker for another day; no extra set needed now.</p>
    </Card>
  );
}
