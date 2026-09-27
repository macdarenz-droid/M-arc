/**
 * The dock (§4.1): a pill above the nav with a screen-aware prompt. Hidden while any sheet
 * is open, and on Train during a live session (the topbar button takes over there).
 */
import { useEffect, useState } from 'preact/hooks';
import { state } from '@/core/store';
import { tab } from '@/app/router';
import { todayReadiness } from '@/app/selectors';
import { openSheets } from '@/ui/primitives';
import { IconEscobar } from '@/ui/icons';
import { showAfter } from '@/ui/pending';
import { escobarUi, escobarLoading, online } from '../state';
import { currentFocus } from '../palace/focus';
import { contextRefFor, dockPromptFor } from './prompts';
import { askAbout, openEscobar } from './open';
import { finishShowing } from '@/slices/workout/Train';

export function Dock() {
  const s = state.value;
  const loading = escobarLoading.value;
  const [busy, setBusy] = useState(false);
  // I19: while the sheet's lazy chunk is still loading, the dock stays up (busy) instead of
  // vanishing into a blank gap; a spinner appears only if the load takes longer than a moment.
  useEffect(() => {
    if (!loading) { setBusy(false); return; }
    let live = true;
    const done = new Promise<void>(resolve => {
      // `subscribe` calls back synchronously with the current value — if loading has already
      // flipped false by the time this runs (a cached chunk resolves within the same tick),
      // that first call fires before `unwatch` is assigned. Declaring it ahead keeps the
      // reference defined (undefined, safely no-op'd) instead of in its temporal dead zone.
      let unwatch: (() => void) | undefined;
      unwatch = escobarLoading.subscribe(v => { if (!v) { resolve(); unwatch?.(); } });
    });
    void showAfter(done, { delay: 200, min: 400 }, v => { if (live) setBusy(v); });
    return () => { live = false; };
  }, [loading]);
  if (openSheets.value > 0 || (escobarUi.value.open && !loading)) return null;
  if (tab.value === 'train' && (s.active || finishShowing.value)) return null;
  const focus = currentFocus.value;
  const on = s.escobar.enabled && online.value !== false;
  const prompt = on ? dockPromptFor(focus, s, todayReadiness.value) : 'Ask Escobar';
  const open = () => {
    const ref = on ? contextRefFor(focus, s) : null;
    if (ref) askAbout(ref); else openEscobar();
    if (on) escobarUi.value = { ...escobarUi.value, draft: prompt };
  };
  return (
    <button type="button" class={`esc-dock${on ? '' : ' esc-dock-off'}`} data-palace="escobar.dock" aria-label={`Escobar: ${prompt}`} aria-busy={busy || undefined} onClick={open}>
      {busy ? <span class="esc-spin" /> : <IconEscobar size={20} />}<span>{prompt}</span>
    </button>
  );
}
