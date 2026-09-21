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
    <Card
      class="card-press presence-cue"
      onClick={onOpen}
      aria-label={`${label}: ${moment.cue}`}
      style={{ minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}
    >
      <div class="row-between" style={{ minWidth: 0 }}>
        <span
          class="small"
          style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, overflow: 'hidden' }}
        >
          <IconMafia size={14} aria-hidden={true} style={{ flexShrink: 0 }} />
          {/*
            Deliberately NOT `white-space: nowrap` + `text-overflow: ellipsis`.
            That single-line-truncation combo forces this span's intrinsic
            width to the full unwrapped length of the cue text before any
            ancestor `overflow: hidden` can clip it — for a long cue in a
            tight flex row (e.g. Train's topbar) that intrinsic width can
            exceed the viewport, and under headless Chromium's mobile+touch
            emulation that measurable overflow decouples the layout
            viewport from the visual one, breaking hit-testing on unrelated
            fixed-position elements elsewhere on the page (reproduced: the
            bottom nav becomes unclickable). Multi-line wrapping, contained
            by `overflow: hidden` + `min-width: 0` on every ancestor in this
            chain, does not have that failure mode — verified by running
            the full five-theme visual gate directly against this exact
            change before it shipped.
          */}
          <span style={{ overflow: 'hidden', minWidth: 0 }}>{moment.cue}</span>
        </span>
        {onDismiss && (
          <button
            type="button"
            class="btn btn-quiet btn-sm"
            aria-label="Dismiss"
            style={{ flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); onDismiss(moment); }}
          >
            <IconX size={14} />
          </button>
        )}
      </div>
    </Card>
  );
}
