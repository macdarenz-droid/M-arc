/**
 * A render error inside the app shows this card instead of a blank screen (ST-02, RG-01).
 * The data stays on the device; the card offers a reload and a rescue copy. QA-R1-8: a state that
 * crashes on every render would make Reload loop, so the card also offers the start-up screen's
 * reset (after a confirm), the only other way out.
 */
import { Component, type ComponentChildren } from 'preact';
import { buildRescueJson, saveRescueFile } from '@/core/rescue';
import { exportText } from '@/native/share';
import { stopSaving } from '@/core/store';
import { assertPhoneWorkoutWriter, workoutOwnership } from '@/core/workoutOwnership';

export async function saveRescueCopy(): Promise<void> {
  const text = buildRescueJson();
  try { await exportText('marc-rescue.json', text); } catch { await saveRescueFile(text); }
}

/**
 * The same wipe as the start-up crash screen in index.html: every stored key and the photo database.
 * Saving stops first, so the save on unload cannot write the crashing state back (QA2-FB-1).
 */
export function resetAppData(storage: Pick<Storage, 'clear'> = localStorage, idb: Pick<IDBFactory, 'databases' | 'deleteDatabase'> | undefined = globalThis.indexedDB): void {
  assertPhoneWorkoutWriter();
  stopSaving();
  try { storage.clear(); } catch { /* storage unavailable */ }
  try { void idb?.databases?.().then(dbs => dbs.forEach(d => { if (d.name) idb.deleteDatabase(d.name); })).catch(() => {}); } catch { /* no IndexedDB */ }
}

function confirmReset(): void {
  if (!confirm('This deletes every workout on this device. Save a copy first if unsure. Continue?')) return;
  resetAppData();
  location.reload();
}

export class ErrorBoundary extends Component<{ children?: ComponentChildren }, { error: unknown }> {
  override state = { error: null as unknown };

  override componentDidCatch(error: unknown): void {
    console.error('render failed', error);
    this.setState({ error });
  }

  render() {
    if (this.state.error == null) return this.props.children;
    return (
      <div class="app">
        <div class="card stack-sm" role="alert" style={{ margin: 16 }}>
          <b>Something went wrong on this screen</b>
          <p class="small">Your data is still on this device. Reload to carry on, or save a copy of your data first. If reloading brings this back, save a copy, then reset.</p>
          <div class="grid-2">
            <button type="button" class="btn btn-primary" onClick={() => location.reload()}>Reload</button>
            <button type="button" class="btn" onClick={() => void saveRescueCopy()}>Save a copy of my data</button>
          </div>
          {workoutOwnership.value === 'web' && <button type="button" class="btn btn-danger" onClick={confirmReset}>Reset app data</button>}
        </div>
      </div>
    );
  }
}
