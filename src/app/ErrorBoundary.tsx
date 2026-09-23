/**
 * A render error inside the app shows this card instead of a blank screen (ST-02, RG-01).
 * The data stays on the device; the card offers a reload and a rescue copy.
 */
import { Component, type ComponentChildren } from 'preact';
import { buildRescueJson, saveRescueFile } from '@/core/rescue';
import { exportText } from '@/native/share';

export async function saveRescueCopy(): Promise<void> {
  const text = buildRescueJson();
  try { await exportText('marc-rescue.json', text); } catch { await saveRescueFile(text); }
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
          <p class="small">Your data is still on this device. Reload to carry on, or save a copy of your data first.</p>
          <div class="grid-2">
            <button type="button" class="btn btn-primary" onClick={() => location.reload()}>Reload</button>
            <button type="button" class="btn" onClick={() => void saveRescueCopy()}>Save a copy of my data</button>
          </div>
        </div>
      </div>
    );
  }
}
