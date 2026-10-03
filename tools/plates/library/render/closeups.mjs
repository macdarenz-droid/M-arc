// LIB-6 close-up renderer (plan 2.6): one data-driven renderer for the How-to close-ups, fed by an exercise's
// `*.howto.mjs` module and a close-up options record. It returns the API the vendored artifact/howto-layers.mjs reads
// from a golden-B close-up script (handZoom, postureZoom, zoomSection, chipRow, PAGES, CSS/ZCSS, howto), so the page's
// own cleanZoom/prefixIds/scopeCss run unchanged on its output. Two sheet shells exist, as in golden B:
//   'zoom' - the How-to zoom sheet (golden B's howto/render-*.mjs family), closeup/zoom.mjs;
//   'zbox' - the boxed sheet (golden B's exercises/*.howto-render.mjs family), closeup/zbox.mjs.
// The bespoke parts of the 8 are named options (closeups-8.mjs). Engine files are imported, never changed.
import { zoomApi } from './closeup/zoom.mjs';
import { zboxApi } from './closeup/zbox.mjs';

export const SHELLS = { zoom: zoomApi, zbox: zboxApi };

/** `mod`: the exercise's howto module namespace (default export plus named exports such as THUMB_PAGE, stills). */
export function closeupApi(mod, options) {
  if (!options) throw new Error(`close-ups: ${mod?.default?.id ?? '?'}: no close-up options`);
  const shell = SHELLS[options.shell];
  if (!shell) throw new Error(`close-ups: unknown shell ${options.shell}`);
  return shell(mod, options);
}
