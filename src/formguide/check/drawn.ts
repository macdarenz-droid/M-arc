// V1-07 `targetDrawn` (docs/FORM-GUIDE-PRODUCTION.md §10.5): every target muscle has its tint, `fg-t-<muscle>` (one per
// side, `fg-t-<muscle>_l` and `_r`), in the markup the view actually draws. targetVisible reads the overlay table
// (check/overlays.ts); this reads the drawing, so a muscle the table lists but the figure never paints fails here.

/** The target muscles the markup has no `fg-t-` tint for. */
export function undrawnTargets(markup: string, targets: readonly string[]): string[] {
  const drawn = new Set([...markup.matchAll(/class="[^"]*\bfg-t-([a-z_]+?)(?:_[lr])?(?=[\s"])/g)].map(m => m[1]!));
  return targets.filter(m => !drawn.has(m));
}

/** The muscles the markup draws a tint for, for the failing line. */
export function drawnTints(markup: string): string[] {
  return [...new Set([...markup.matchAll(/class="[^"]*\bfg-t-([a-z_]+?)(?:_[lr])?(?=[\s"])/g)].map(m => m[1]!))].sort();
}
