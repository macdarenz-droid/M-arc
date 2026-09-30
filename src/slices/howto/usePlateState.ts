// The plate state (HT-3): a line-for-line port of the approved gallery's page script
// (tools/plates/vendor/artifact/build-page.mjs, JS) plus the zoom slot API that HT-6 and HT-7 call.

export type PlateMode = 'normal' | 'mistake';

/** What `snapshot()` saves and `restore()` puts back: the mode, the selected callout and the selected tell. */
export interface PlateSnapshot {
  readonly mode: PlateMode;
  readonly callout: string;
  readonly tell: string;
}

/**
 * The zoom slot API (card HT3-A6), fixed by the HT-3 design note.
 * - `setPlateHidden(true)` ends a running Trace, sets `hidden` and `inert` on the plate box (`.ht-plate-fit`) and
 *   shows `slot` in its place; `setPlateHidden(false)` does the reverse. The figures stay mounted.
 * - `clearMistake()` leaves the plate in normal mode with the default (first) callout selected.
 * - `snapshot()` / `restore(s)` save and put back the mode, callout and tell.
 * - `slot` is the empty `div.ht-zoom-slot` right after the plate box, hidden while the plate shows.
 */
export interface PlateApi {
  setPlateHidden(hidden: boolean): void;
  clearMistake(): void;
  snapshot(): PlateSnapshot;
  restore(s: PlateSnapshot): void;
  readonly slot: HTMLElement;
}
