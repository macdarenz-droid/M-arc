import { signal } from '@preact/signals';

export type Tab = 'today' | 'train' | 'history' | 'body' | 'coach';
export const TABS: Array<{ id: Tab; label: string }> = [
  { id: 'today', label: 'Today' },
  { id: 'train', label: 'Train' },
  { id: 'history', label: 'History' },
  { id: 'body', label: 'Body' },
  { id: 'coach', label: 'Coach' },
];

function initial(): Tab {
  const h = typeof location === 'undefined' ? '' : location.hash.replace('#', '');
  return TABS.some(t => t.id === h) ? (h as Tab) : 'today';
}

export const tab = signal<Tab>(initial());

/**
 * Sheets that Escobar (and anything else) can open by id (§7.2). Local sheet state was
 * lifted here so a palace target can open, e.g., the muscle sheet for quads.
 */
export type PanelId =
  | 'settings' | 'profile' | 'watch' | 'goal' | 'schedule' | 'checkin' | 'muscle'
  | 'exercise-stats' | 'session' | 'weekly-review' | 'memory';
export const PANEL_IDS: PanelId[] = ['settings', 'profile', 'watch', 'goal', 'schedule', 'checkin', 'muscle', 'exercise-stats', 'session', 'weekly-review', 'memory'];
export interface OpenPanel { id: PanelId; params?: Record<string, string> }
export const openPanel = signal<OpenPanel | null>(null);

export function showPanel(id: PanelId, params?: Record<string, string>): void {
  openPanel.value = params ? { id, params } : { id };
}
export function closePanel(id?: PanelId): void {
  if (!id || openPanel.value?.id === id) openPanel.value = null;
}

/** A read/write alias onto `openPanel`, so older callers keep `settingsOpen.value = true`. */
function panelFlag(id: PanelId) {
  return {
    get value(): boolean { return openPanel.value?.id === id; },
    set value(v: boolean) { if (v) showPanel(id); else closePanel(id); },
  };
}
export const settingsOpen = panelFlag('settings');
export const profileOpen = panelFlag('profile');

/** Per-tab view choices a palace target can set (Body's map view, History's segment). */
export type BodyView = 'recovery' | 'levels' | 'week';
export const bodyView = signal<BodyView>('recovery');
export const historySeg = signal<'log' | 'stats'>('log');

export function go(t: Tab): void {
  if (tab.value !== t) openPanel.value = null;
  tab.value = t;
  try { history.replaceState(null, '', `#${t}`); } catch { /* ignore */ }
  try { window.scrollTo({ top: 0 }); } catch { /* ignore */ }
}
