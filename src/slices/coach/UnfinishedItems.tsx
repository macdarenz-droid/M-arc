import { state } from '@/core/store';
import { pendingCoachItems, type PendingCoachItem } from '@/brain/coach/reopen';
import { Button, Card, Section } from '@/ui/primitives';
import { MAX_SPLITS } from '../workout/splits';
import { dismissAskItem } from './askMemory';
import { showToast } from '@/app/toast';

export function currentPendingItems(): PendingCoachItem[] {
  const s = state.value;
  return pendingCoachItems(s.coach, s.splits, s.schedule, s.goal, MAX_SPLITS);
}

export function currentPendingItem(item: PendingCoachItem): PendingCoachItem | null {
  return currentPendingItems().find(candidate => candidate.key === item.key) ?? null;
}

export function UnfinishedItems({ onReview }: { onReview: (item?: PendingCoachItem) => void }) {
  const items = currentPendingItems();
  if (!items.length) return null;
  return (
    <Section title="Unfinished" aside={<span class="small muted">{items.length}</span>}>
      <div class="stack-sm">
        {items.slice(0, 3).map(item => (
          <Card key={item.key} class="card-quiet">
            <div class="row-between" style={{ gap: 12 }}>
              <div class="grow">
                <b class="small">{item.title}</b>
                {!item.actionable && <p class="hint" style={{ marginTop: 4 }}>This draft refers to something that has changed.</p>}
              </div>
              <div class="wrap" style={{ justifyContent: 'flex-end' }}>
                <Button size="sm" variant="primary" onClick={() => onReview(item)}>Review</Button>
                <Button size="sm" variant="quiet" onClick={() => {
                  if (dismissAskItem(item)) showToast('Saved item dismissed');
                  else showToast('This item changed. Review the current version.');
                }}>Dismiss</Button>
              </div>
            </div>
          </Card>
        ))}
        {items.length > 3 && <Button variant="quiet" size="sm" onClick={() => onReview()}>Review all</Button>}
      </div>
    </Section>
  );
}
