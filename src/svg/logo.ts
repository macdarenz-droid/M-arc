/**
 * The M/ARC mark: a geometric M with the slash cut through it in the accent
 * colour. Pure SVG strings so the app, the icon renderer and the splash can
 * all share one drawing. Colours are CSS values, so theme tokens work.
 */
export interface LogoColors { ink: string; accent: string; bg: string }

/** Left leg and left diagonal, then the right leg. The right diagonal is the slash. */
const M_INK = 'M12 50 V14 L32 34 M52 14 V50';
/** The slash runs along the M's right diagonal and pokes out at both ends. */
const SLASH = 'M22 44 L58 8';

/** The monogram alone in a 64×64 box. `rounded` adds the icon background. */
export function markSvg(c: LogoColors, opts: { rounded?: boolean; size?: number; padding?: number } = {}): string {
  const size = opts.size ?? 64;
  const pad = opts.padding ?? 0;
  const inner = 64 - pad * 2;
  const bg = opts.rounded ? `<rect width="64" height="64" rx="14" fill="${c.bg}"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="M/ARC">
${bg}
<g transform="translate(${pad} ${pad}) scale(${inner / 64})">
  <path d="${M_INK}" fill="none" stroke="${c.ink}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
  <path d="${SLASH}" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/>
</g>
</svg>`;
}

/** Mark plus wordmark, for headers and splash. Height 40, width auto. */
export function lockupSvg(c: LogoColors, height = 40): string {
  const w = 222, h = 64;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" height="${height}" width="${Math.round((height * w) / h)}" role="img" aria-label="M/ARC">
<path d="${M_INK}" fill="none" stroke="${c.ink}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
<path d="${SLASH}" stroke="${c.accent}" stroke-width="8" stroke-linecap="round"/>
<text x="74" y="47" font-family="Inter, 'SF Pro Display', system-ui, sans-serif" font-size="38" font-weight="700" letter-spacing="-1.5" fill="${c.ink}">M<tspan fill="${c.accent}">/</tspan>ARC</text>
</svg>`;
}
