/** Citation chips (§4.2, §14.2): a tiny superscript that opens the fact's source. */
import { useEffect, useState } from 'preact/hooks';

/** Open state for a popover that closes on the next tap anywhere. */
function usePopover(): [boolean, () => void] {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const t = setTimeout(() => document.addEventListener('pointerdown', close, { once: true }), 0);
    return () => { clearTimeout(t); document.removeEventListener('pointerdown', close); };
  }, [open]);
  return [open, () => setOpen(o => !o)];
}
import type { KnowledgeCard } from '../knowledge/cards';
import type { Fact } from '../types';

const SOURCE: Record<string, string> = {
  get_overview: 'Today', get_sessions: 'History', get_session: 'History · Session', get_exercise_history: 'History', get_next_target: 'Progression',
  get_recovery: 'Recovery', get_readiness: 'Readiness', get_volume: 'Weekly volume', get_records: 'Records', get_insights: 'Coach notes', get_plan: 'Plan',
  get_body: 'Body', get_health: 'Health', get_heart_session: 'Heart rate', get_live_session: 'Live session', get_exercise: 'Exercise', get_equipment: 'Equipment',
  calculate: 'Calculation', evaluate_plan: 'Plan check', show: 'Chart', lookup_knowledge: 'Evidence', explain_method: 'How the app works', brief: 'Today’s summary', user: 'You said',
};
export const sourceLabel = (f: Fact): string => SOURCE[f.source.tool] ?? f.source.tool.replace(/_/g, ' ');

/** One quiet marker per sentence; its popover lists every fact the sentence used. */
export function Citation({ n, facts }: { n: number; facts: Fact[] }) {
  const [open, toggle] = usePopover();
  if (!facts.length) return null;
  return (
    <span class="esc-cite-wrap">
      <button type="button" class="esc-cite" aria-expanded={open} aria-label={`Sources for this sentence (${facts.length})`} onClick={toggle}>{n}</button>
      {open && (
        <span class="esc-pop" role="note">
          {facts.map(f => <span key={f.id} class="esc-pop-row"><b>{sourceLabel(f)}</b><span>{f.label} = {f.value}{f.unit ? ` ${f.unit}` : ''}</span></span>)}
        </span>
      )}
    </span>
  );
}

export function CardCitation({ id, card }: { id: string; card?: KnowledgeCard }) {
  const [open, toggle] = usePopover();
  if (!card) return null;
  return (
    <span class="esc-cite-wrap">
      <button type="button" class="esc-cite esc-cite-card" aria-expanded={open} aria-label={`Evidence: ${card.title}`} onClick={toggle}>ev</button>
      {open && <span class="esc-pop" role="note" data-card={id}><b>{card.title}</b><span>{card.statement}</span><span class="muted">Evidence: {card.rating}{card.sources[0] ? ` · ${card.sources[0].title} (${card.sources[0].year})` : ''}</span></span>}
    </span>
  );
}
