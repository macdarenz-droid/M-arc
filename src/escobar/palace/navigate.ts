/**
 * Taking the person somewhere in the app (§7.2): close any open sheet, switch tab,
 * open the panel, then spotlight the element once it has rendered.
 */
import { bodyView, go, historySeg, openPanel, validatePanelParams, type BodyView, type PanelId } from '@/app/router';
import { state } from '@/core/store';
import { PALACE_BY_ID, type PalaceTarget } from './registry';
import { signal } from '@preact/signals';

/** The aria-live announcement for the last spotlight. */
export const palaceAnnouncement = signal('');

const SPOTLIGHT_MS = 1600;

function closeOpenSheets(): void {
  if (typeof document === 'undefined') return;
  // A Sheet closes through its own onCancel (Escape), which runs its owner's onClose.
  document.querySelectorAll('dialog.sheet[open]').forEach(d => d.dispatchEvent(new Event('cancel', { cancelable: true })));
}

const frame = (): Promise<void> => new Promise(r => (typeof requestAnimationFrame === 'undefined' ? setTimeout(r, 16) : requestAnimationFrame(() => r())));

/** Fills panel params the target left out with the most useful default from the data. */
export function resolvePanelParams(panel: PanelId, params: Record<string, string> | undefined): Record<string, string> | undefined {
  const s = state.value;
  if (panel === 'session' && !params?.sessionId) {
    const last = s.sessions[s.sessions.length - 1];
    return last ? { ...params, sessionId: last.id } : params;
  }
  if (panel === 'exercise-stats' && !params?.exerciseId) {
    const last = s.sessions[s.sessions.length - 1]?.exercises[0];
    return last ? { ...params, exerciseId: last.exerciseId } : params;
  }
  if (panel === 'muscle' && !params?.muscle) return { ...params, muscle: 'chest' };
  return params;
}

export function spotlight(anchor: string, label?: string): boolean {
  if (typeof document === 'undefined') return false;
  const els = [...document.querySelectorAll<HTMLElement>(`[data-palace="${CSS.escape(anchor)}"]`)];
  // Prefer the one inside the top-most open dialog, else the last rendered.
  const el = els.reverse().find(x => x.closest('dialog[open]')) ?? els[0];
  if (!el) return false;
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
  el.classList.remove('palace-spotlight');
  void el.offsetWidth;
  el.classList.add('palace-spotlight');
  setTimeout(() => el.classList.remove('palace-spotlight'), SPOTLIGHT_MS);
  palaceAnnouncement.value = `Showing ${label ?? anchor}`;
  return true;
}

/** Goes to a palace entry id or an explicit target. Resolves true when the anchor was found. */
export async function goTo(target: string | PalaceTarget, extraParams?: Record<string, string>): Promise<boolean> {
  const entry = typeof target === 'string' ? PALACE_BY_ID[target] : undefined;
  const t: PalaceTarget | undefined = typeof target === 'string' ? entry?.target : target;
  if (!t) return false;
  const params = validatePanelParams(t.panel ?? 'settings', { ...(t.params ?? {}), ...(extraParams ?? {}) }) ?? {};
  closeOpenSheets();
  openPanel.value = null;
  await frame();
  go(t.tab);
  if (t.tab === 'body' && params.view) bodyView.value = params.view as BodyView;
  if (t.tab === 'history' && params.seg) historySeg.value = params.seg === 'stats' ? 'stats' : 'log';
  if (t.panel) {
    const p = resolvePanelParams(t.panel, Object.keys(params).length ? params : undefined);
    const need = t.panel === 'session' ? 'sessionId' : t.panel === 'exercise-stats' ? 'exerciseId' : t.panel === 'muscle' ? 'muscle' : null;
    if (!need || p?.[need]) openPanel.value = p ? { id: t.panel, params: p } : { id: t.panel };
  }
  await frame();
  await frame();
  return t.anchor ? spotlight(t.anchor, entry?.title) : true;
}
