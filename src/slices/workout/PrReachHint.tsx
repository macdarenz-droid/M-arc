import type { PrReach } from '@/brain/prs';
import { formatLoad } from '@/core/units';

export function PrReachHint({ reach, unit }: { reach: PrReach; unit: 'kg' | 'lb' }) {
  const challenge = reach.kg == null
    ? `${reach.requiredReps} reps would beat your previous ${reach.standingReps}.`
    : `${reach.requiredReps} reps at ${formatLoad(reach.kg, unit)} would beat your previous ${reach.standingReps}.`;
  return <p class="hint" style={{ marginTop: 4 }}>{challenge} Only if it feels right today.</p>;
}
