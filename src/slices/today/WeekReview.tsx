import { useState } from 'preact/hooks';
import type { WeekReview as Review } from '@/brain/coach/review';
import { weekReviewCopy } from '@/brain/coach/review';
import { Button, Card } from '@/ui/primitives';

export function WeekReview({ review, unit }: { review: Review; unit: 'kg' | 'lb' }) {
  const [details, setDetails] = useState(false);
  const copy = weekReviewCopy(review, unit);
  return (
    <Card>
      <div class="row-between"><div><div class="eyebrow">{copy.title}</div><p class="small" style={{ marginTop: 6 }}>{copy.summary}</p></div><Button size="sm" variant="quiet" aria-expanded={details} onClick={() => setDetails(open => !open)}>Details</Button></div>
      {details && <div class="stack-sm" style={{ marginTop: 10 }}><p class="small muted">{copy.detail}</p>{copy.schedule && <p class="hint">{copy.schedule}</p>}</div>}
    </Card>
  );
}
