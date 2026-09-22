/** Escalation cards (§19): fixed app-owned copy, never model text. */
import { Button, Card } from '@/ui/primitives';
import { update } from '@/core/store';
import { addDays, todayKey } from '@/core/dates';
import { MAX_MEMORY_ITEMS } from '@/core/models';
import { showToast } from '@/app/toast';

export type EscalationKind = 'pain' | 'medical' | 'crisis' | 'disordered_eating' | 'pain_mentioned';

export const ESCALATION_COPY: Record<'pain' | 'medical' | 'crisis' | 'disordered_eating', string> = {
  pain: 'Pain that’s sharp, spreading, numb, or lasting more than two days is a medical question, not a programming one. Stop the movement that causes it and see a physio or doctor.',
  medical: 'Chest pain, fainting, or dizziness during exercise needs medical attention now. If it’s happening now, call emergency services.',
  crisis: 'If things feel like too much, you don’t have to carry it alone. findahelpline.com lists free, confidential support in your country.',
  disordered_eating: 'This is worth talking through with someone who can help properly — a doctor or an eating-disorder helpline. findahelpline.com lists options by country.',
};

function noteInjury(): void {
  const now = new Date().toISOString();
  const id = `mem_${Date.now().toString(36)}`;
  update(s => ({ ...s, escobar: { ...s.escobar, memory: [...s.escobar.memory, { id, kind: 'injury' as const, text: 'Reported pain; check before loading the area', source: 'user_said' as const, createdAt: now, updatedAt: now, expiresOn: addDays(todayKey(), 42) }].slice(-MAX_MEMORY_ITEMS) } }));
  showToast('Escobar will keep this in mind', 'Undo', () => update(s => ({ ...s, escobar: { ...s.escobar, memory: s.escobar.memory.filter(m => m.id !== id) } })));
}

export function Escalation({ kind }: { kind: EscalationKind }) {
  const k = kind === 'pain_mentioned' ? 'pain' : kind;
  const copy = ESCALATION_COPY[k];
  if (!copy) return null;
  const helpline = k === 'crisis' || k === 'disordered_eating';
  return (
    <Card class="esc-escalation" role="note" data-escalation={k}>
      <p class="small">{copy}</p>
      {helpline && <a class="btn btn-sm" href="https://findahelpline.com" target="_blank" rel="noopener noreferrer">Open findahelpline.com</a>}
      {k === 'pain' && <Button size="sm" variant="quiet" onClick={noteInjury}>Remember this injury</Button>}
    </Card>
  );
}
