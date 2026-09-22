import { Sheet } from '@/ui/primitives';
import { state } from '@/core/store';
import { usePalaceFocus } from '../palace/focus';

/** "What Escobar knows" (§17.2). The full screen lands with memory (EV7); until then it lists what is stored. */
export function MemoryPlaceholder({ onClose }: { onClose: () => void }) {
  usePalaceFocus('panel.memory');
  const items = state.value.escobar.memory;
  return (
    <Sheet title="What Escobar knows" onClose={onClose} palace="panel.memory">
      <div class="stack-sm">
        {!items.length && <p class="small muted">Nothing yet. When you tell Escobar something worth keeping, like an injury or the equipment you have, it shows up here.</p>}
        {items.map(m => <p key={m.id} class="small">{m.text}</p>)}
      </div>
    </Sheet>
  );
}
