/**
 * Open sheets, top last (R5.3). The Android back button and the browser's back both close the
 * top one. On the web each sheet also owns a history entry, so Back closes it instead of
 * leaving the app; closing it from the UI takes that entry back off.
 */
import { computed, signal } from '@preact/signals';
import { isNative } from '@/native/capacitor';

interface Entry { id: string; close: () => void; pushed: boolean; popped: boolean }
export const sheetStack = signal<Entry[]>([]);
export const openSheetCount = computed(() => sheetStack.value.length);

const hasHistory = (): boolean => typeof history !== 'undefined' && typeof window !== 'undefined' && !isNative();
const stateSheet = (): string | undefined => { try { return (history.state as { sheet?: string } | null)?.sheet; } catch { return undefined; } };

/** popstate events we caused ourselves (history.back / go(-n)) and are not a user's Back. */
let ignorePops = 0;
let afterUnwind: (() => void) | null = null;

export function registerSheet(id: string, close: () => void): void {
  const e: Entry = { id, close, pushed: false, popped: false };
  if (hasHistory()) { try { history.pushState({ sheet: id }, ''); e.pushed = true; } catch { /* sandboxed */ } }
  sheetStack.value = [...sheetStack.value, e];
}

export function unregisterSheet(id: string): void {
  const e = sheetStack.value.find(x => x.id === id);
  if (!e) return;
  sheetStack.value = sheetStack.value.filter(x => x !== e);
  // Closed from the UI: take its history entry back off, but only if it is still on top.
  if (e.pushed && !e.popped && stateSheet() === id) { ignorePops++; try { history.back(); } catch { ignorePops--; } }
}

/** Closes the top sheet. True when there was one. */
export function closeTopSheet(fromPop = false): boolean {
  const top = sheetStack.value.at(-1);
  if (!top) return false;
  if (fromPop) top.popped = true;
  top.close();
  return true;
}

/** Closes every sheet and removes their history entries, then runs `then` (router `go`). */
export function closeAllSheets(then: () => void): void {
  const all = [...sheetStack.value].reverse();
  const pushed = all.filter(e => e.pushed && !e.popped).length;
  for (const e of all) { e.popped = true; e.close(); }
  if (pushed > 0 && hasHistory() && stateSheet()) { ignorePops += pushed; afterUnwind = then; try { history.go(-pushed); return; } catch { ignorePops -= pushed; afterUnwind = null; } }
  then();
}

if (typeof window !== 'undefined') {
  window.addEventListener('popstate', () => {
    if (ignorePops > 0) {
      ignorePops--;
      if (ignorePops === 0 && afterUnwind) { const f = afterUnwind; afterUnwind = null; f(); }
      return;
    }
    closeTopSheet(true);
  });
}
