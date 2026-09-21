import { Button, Card } from '@/ui/primitives';
import type { ReadinessCard, ReadinessTone } from '@/brain/coach/verdict';

const TONE_CLASS: Record<ReadinessTone, string> = { positive: 'positive-text', warning: 'warning-text', danger: 'danger-text', muted: 'muted' };

export function ReadinessVerdict({ card, acceptLabel, onAccept, onWhy }: {
  card: ReadinessCard;
  acceptLabel: string | null;
  onAccept: () => void;
  onWhy: () => void;
}) {
  return (
    <Card class="card-quiet stack-sm">
      <div class="eyebrow">Morning check-in</div>
      <p class={TONE_CLASS[card.tone]} style={{ margin: 0, fontWeight: 600 }}>{card.headline}</p>
      <p class="small muted" style={{ margin: 0 }}>{card.detail}</p>
      {card.consequence && <p class="small" style={{ margin: 0 }}>{card.consequence}</p>}
      {card.showPlanAction && acceptLabel && (
        <div class="row wrap">
          <Button size="sm" onClick={onAccept}>{acceptLabel}</Button>
          <Button size="sm" variant="quiet" onClick={onWhy}>Why</Button>
        </div>
      )}
    </Card>
  );
}
