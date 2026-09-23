/** "What Escobar knows" (§17.2, ES-27): every remembered item, with delete per item and "Forget everything". */
import { useState } from 'preact/hooks';
import { Button, Row, Sheet } from '@/ui/primitives';
import { IconTrash } from '@/ui/icons';
import { state, update } from '@/core/store';
import { formatDay } from '@/core/dates';
import type { MemoryKind } from '@/core/models';
import { usePalaceFocus } from '../palace/focus';

const KIND_LABEL: Partial<Record<MemoryKind, string>> = { injury: 'Injury', equipment: 'Equipment', agreement: 'Agreed' };

export function MemoryScreen({ onClose }: { onClose: () => void }) {
  usePalaceFocus('panel.memory');
  const [confirm, setConfirm] = useState(false);
  const items = state.value.escobar.memory;
  const setMemory = (fn: (m: typeof items) => typeof items) => update(s => ({ ...s, escobar: { ...s.escobar, memory: fn(s.escobar.memory) } }));
  return (
    <Sheet title="What Escobar knows" onClose={onClose} palace="panel.memory">
      <div class="stack-sm">
        {!items.length && <p class="small muted">Nothing yet. When you tell Escobar something worth keeping, like an injury or the equipment you have, it shows up here.</p>}
        {items.map(m => (
          <Row key={m.id} trailing={<button type="button" class="btn btn-quiet btn-sm" aria-label={`Forget: ${m.text}`} onClick={() => setMemory(list => list.filter(x => x.id !== m.id))}><IconTrash size={16} /></button>}>
            <span class="small">{m.text}</span>
            <div class="hint">{[KIND_LABEL[m.kind], `saved ${formatDay(m.createdAt.slice(0, 10))}`, m.expiresOn ? `until ${formatDay(m.expiresOn)}` : null].filter(Boolean).join(' · ')}</div>
          </Row>
        ))}
        {items.length > 0 && (!confirm
          ? <Button variant="danger" onClick={() => setConfirm(true)}>Forget everything</Button>
          : <div class="row"><Button variant="quiet" onClick={() => setConfirm(false)}>Keep</Button><Button variant="danger" class="grow" onClick={() => { setMemory(() => []); setConfirm(false); }}>Yes, forget all {items.length}</Button></div>)}
      </div>
    </Sheet>
  );
}
