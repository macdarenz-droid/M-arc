/**
 * Front and back body map. Every muscle region is an SVG path whose fill is
 * a CSS variable computed from theme tokens, so the map re-skins with the
 * theme. `values` is 0–100 per muscle; `mode` chooses the colour scale.
 */
import { BACK_REGIONS, BODY_VIEWBOX, FRONT_REGIONS, HEAD, SILHOUETTE } from '@/svg/bodyPaths';
import { MUSCLE_BY_ID, type MuscleId } from '@/data/muscles';

export type MapMode = 'recovery' | 'emphasis' | 'roles';

export interface MuscleMapProps {
  values: Partial<Record<MuscleId, number>>;
  mode: MapMode;
  selected?: MuscleId | null;
  onSelect?: (m: MuscleId) => void;
  /** For role mode: which muscles are primary / secondary. */
  roles?: Partial<Record<MuscleId, 'primary' | 'secondary' | 'stabilizer'>>;
  compact?: boolean;
}

/** Fill colour for a value, using theme tokens through color-mix. */
export function fillFor(mode: MapMode, value: number | undefined, role?: 'primary' | 'secondary' | 'stabilizer'): string {
  if (mode === 'roles') {
    if (role === 'primary') return 'var(--accent)';
    if (role === 'secondary') return 'color-mix(in srgb, var(--accent) 45%, transparent)';
    if (role === 'stabilizer') return 'color-mix(in srgb, var(--accent) 20%, transparent)';
    return 'transparent';
  }
  if (value == null) return 'transparent';
  if (mode === 'recovery') {
    // 100 = ready (positive), 50 = warning, 0 = negative.
    if (value >= 100) return 'color-mix(in srgb, var(--positive) 55%, transparent)';
    if (value >= 50) {
      const t = Math.round(((value - 50) / 50) * 100);
      return `color-mix(in srgb, var(--positive) ${t}%, var(--warning))`;
    }
    const t = Math.round((value / 50) * 100);
    return `color-mix(in srgb, var(--warning) ${t}%, var(--negative))`;
  }
  // emphasis: accent opacity by share.
  const pct = Math.max(12, Math.min(100, Math.round(value)));
  return `color-mix(in srgb, var(--accent) ${pct}%, transparent)`;
}

function Body({ view, props }: { view: 'front' | 'back'; props: MuscleMapProps }) {
  const regions = view === 'front' ? FRONT_REGIONS : BACK_REGIONS;
  return (
    <svg viewBox={BODY_VIEWBOX} role="img" aria-label={`${view} view`}>
      <ellipse class="body-head" cx={HEAD.cx} cy={HEAD.cy} rx={HEAD.rx} ry={HEAD.ry} />
      <path class="body-silhouette" d={SILHOUETTE} />
      {(Object.entries(regions) as Array<[MuscleId, string]>).map(([id, d]) => {
        const v = props.values[id];
        const fill = fillFor(props.mode, v, props.roles?.[id]);
        return (
          <path
            key={id}
            class={`muscle ${props.selected === id ? 'selected' : ''}`}
            d={d}
            style={{ '--muscle-fill': fill }}
            onClick={() => props.onSelect?.(id)}
          >
            <title>{MUSCLE_BY_ID[id].label}{v != null ? ` · ${Math.round(v)}%` : ''}</title>
          </path>
        );
      })}
    </svg>
  );
}

export function MuscleMap(props: MuscleMapProps) {
  return (
    <div class="map-wrap">
      <div><Body view="front" props={props} /><div class="map-label">Front</div></div>
      <div><Body view="back" props={props} /><div class="map-label">Back</div></div>
    </div>
  );
}

export function MapLegend({ mode }: { mode: MapMode }) {
  if (mode === 'recovery') {
    return <div class="legend"><span><i style={{ background: fillFor('recovery', 100) }} />Ready</span><span><i style={{ background: fillFor('recovery', 70) }} />Nearly</span><span><i style={{ background: fillFor('recovery', 20) }} />Recovering</span></div>;
  }
  if (mode === 'roles') {
    return <div class="legend"><span><i style={{ background: fillFor('roles', 0, 'primary') }} />Main</span><span><i style={{ background: fillFor('roles', 0, 'secondary') }} />Helps</span><span><i style={{ background: fillFor('roles', 0, 'stabilizer') }} />Stabilises</span></div>;
  }
  return <div class="legend"><span><i style={{ background: fillFor('emphasis', 100) }} />Most worked</span><span><i style={{ background: fillFor('emphasis', 30) }} />Some</span><span><i style={{ background: 'var(--map-body)', border: '1px solid var(--map-line)' }} />None</span></div>;
}
