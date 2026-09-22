import { goTo, spotlight } from './navigate';
import { PALACE } from './registry';
import { currentFocus } from './focus';

/** Test hooks for the gate, only when `localStorage['marc.dev'] === '1'` (§23 EV1). */
export function installPalaceDevHooks(): void {
  try {
    if (typeof window === 'undefined' || localStorage.getItem('marc.dev') !== '1') return;
    (window as unknown as { __palace: unknown }).__palace = {
      goTo, spotlight, ids: PALACE.map(p => p.id), anchors: Object.fromEntries(PALACE.map(p => [p.id, p.target.anchor ?? p.id])),
      focus: () => currentFocus.value,
    };
  } catch { /* storage blocked: no hooks */ }
}
