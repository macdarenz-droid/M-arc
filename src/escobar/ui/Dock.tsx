/**
 * The dock (§4.1): a pill above the nav with a screen-aware prompt. Hidden while any sheet
 * is open, and on Train during a live session (the topbar button takes over there).
 */
import { state } from '@/core/store';
import { tab } from '@/app/router';
import { todayReadiness } from '@/app/selectors';
import { openSheets } from '@/ui/primitives';
import { IconEscobar } from '@/ui/icons';
import { escobarUi, online } from '../state';
import { currentFocus } from '../palace/focus';
import { contextRefFor, dockPromptFor } from './prompts';
import { askAbout, openEscobar } from './open';
import { finishShowing } from '@/slices/workout/Train';

export function Dock() {
  const s = state.value;
  if (openSheets.value > 0 || escobarUi.value.open) return null;
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
    <button type="button" class={`esc-dock${on ? '' : ' esc-dock-off'}`} data-palace="escobar.dock" aria-label={`Escobar: ${prompt}`} onClick={open}>
      <IconEscobar size={20} /><span>{prompt}</span>
    </button>
  );
}
