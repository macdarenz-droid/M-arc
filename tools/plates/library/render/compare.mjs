// LIB-6: the API-level proof. Every string the vendored howto-layers.mjs reads from a close-up source (each hand page,
// each posture zoom or zoom section, each chip row, the CSS) is drawn by the library renderer and by the frozen golden-B
// script, and compared with ===. Returns one line per difference ([] = identical).
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { cleanupMirror, LAYERS, makeMirror } from '../../layers.mjs';
import { loadLegacyCloseups } from './legacy.mjs';
import { closeupApi } from './closeups.mjs';

/** Every (name, thunk) a close-up API is read through by howto-layers.mjs zoomPanels/rendererCss/cleanZoom. */
export function apiCalls(api, howto) {
  const calls = [['CSS', () => api.ZCSS ?? api.CSS ?? '']];
  for (const z of howto.zooms) {
    if (api.chipRow) calls.push([`chipRow(${z.key})`, () => api.chipRow(z.key)]);
    if (api.zoomSection) calls.push([`zoomSection(${z.key})`, () => api.zoomSection(z)]);
    else if (z.kind === 'hand') for (const p of api.PAGES ?? [{ key: undefined }]) calls.push([`handZoom(${p.key ?? ''})`, () => api.handZoom(p.key)]);
    else calls.push([`postureZoom(${z.key})`, () => api.postureZoom(z)]);
  }
  return calls;
}

const firstDiff = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };

/** Compare the renderer with the frozen script for each id (howto ids). */
export async function compareCloseups(ids, options) {
  const mirror = makeMirror(), gen = mkdtempSync(join(tmpdir(), 'lib6-legacy-')), out = [];
  try {
    for (const id of ids) {
      const legacy = await loadLegacyCloseups(id, mirror, gen);
      const mod = await import(pathToFileURL(join(LAYERS, 'exercises', `${id}.howto.mjs`)).href);
      let api;
      try { api = closeupApi(mod, options[id]); } catch (e) { out.push(`${id}: renderer threw: ${e.message}`); continue; }
      const want = apiCalls(legacy, legacy.howto), got = new Map(apiCalls(api, legacy.howto));
      if (!!legacy.zoomSection !== !!api.zoomSection) out.push(`${id}: zoomSection presence differs`);
      if (JSON.stringify(legacy.PAGES) !== JSON.stringify(api.PAGES)) out.push(`${id}: PAGES differ`);
      for (const [name, f] of want) {
        const a = got.get(name);
        if (!a) { out.push(`${id}.${name}: missing`); continue; }
        let s, w;
        try { w = f(); s = a(); } catch (e) { out.push(`${id}.${name}: threw: ${e.message}`); continue; }
        if (s !== w) { const i = firstDiff(s, w); out.push(`${id}.${name}: differs at ${i}: got ${JSON.stringify(s.slice(Math.max(0, i - 40), i + 60))} want ${JSON.stringify(w.slice(Math.max(0, i - 40), i + 60))}`); }
      }
    }
  } finally { cleanupMirror(mirror); rmSync(gen, { recursive: true, force: true }); }
  return out;
}
