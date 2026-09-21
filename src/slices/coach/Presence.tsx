/**
 * One reusable launcher for the shared Escobar presence cue
 * (docs/escobar-presence). Purely presentational: the caller supplies the
 * already-selected moment (or null) and owns what "open" does, so this
 * component never recomputes the report and never mounts a second modal
 * host on top of a screen's own sheets.
 */
import type { ComponentChildren } from 'preact';
import { Button, Card } from '@/ui/primitives';
import { IconMafia, IconX } from '@/ui/icons';
import type { CoachingMoment } from '@/brain/coach/moments';

export function PresenceLauncher({ moment, label, onOpen, onDismiss }: {
  moment: CoachingMoment | null;
  label: string;
  onOpen: () => void;
  onDismiss?: (moment: CoachingMoment) => void;
}): ComponentChildren {
  if (!moment) {
    return (
      <Button variant="quiet" size="sm" onClick={onOpen} aria-label={`Ask ${label}`}>
        <IconMafia size={16} aria-hidden={true} /> {label}
      </Button>
    );
  }
  return (
    <Card class="card-press presence-cue" onClick={onOpen} aria-label={`${label}: ${moment.cue}`}>
      <div class="row-between">
        <span class="wrap small" style={{ alignItems: 'center', gap: 6 }}>
          <IconMafia size={14} aria-hidden={true} /> {moment.cue}
        </span>
        {onDismiss && (
          <button
            type="button"
            class="btn btn-quiet btn-sm"
            aria-label="Dismiss"
            onClick={e => { e.stopPropagation(); onDismiss(moment); }}
          >
            <IconX size={14} />
          </button>
        )}
      </div>
    </Card>
  );
}
