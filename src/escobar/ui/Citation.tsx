/** Citation chips (§4.2, §14.2): a tiny superscript that opens the fact's source. */
import { useState } from 'preact/hooks';
import type { KnowledgeCard } from '../knowledge/cards';
import type { Fact } from '../types';

const SOURCE: Record<string, string> = {
  get_overview: 'Today', get_sessions: 'History', get_session: 'History · Session', get_exercise_history: 'History', get_next_target: 'Progression',
  get_recovery: 'Recovery', get_readiness: 'Readiness', get_volume: 'Weekly volume', get_records: 'Records', get_insights: 'Coach notes', get_plan: 'Plan',
  get_body: 'Body', get_health: 'Health', get_heart_session: 'Heart rate', get_live_session: 'Live session', get_exercise: 'Exercise', get_equipment: 'Equipment',
  calculate: 'Calculation', evaluate_plan: 'Plan check', show: 'Chart', lookup_knowledge: 'Evidence', explain_method: 'How the app works', brief: 'Today’s summary', user: 'You said',
};
export const sourceLabel = (f: Fact): string => SOURCE[f.source.tool] ?? f.source.tool.replace(/_/g, ' ');

export function Citation({ n, fact }: { n: number; fact?: Fact }) {
  const [open, setOpen] = useState(false);
  if (!fact) return null;
  return (
    <span class="esc-cite-wrap">
      <button type="button" class="esc-cite" aria-expanded={open} aria-label={`Source ${n}`} onClick={() => setOpen(o => !o)}>{n}</button>
      {open && <span class="esc-pop" role="note"><b>{sourceLabel(fact)}</b><span>{fact.label} = {fact.value}{fact.unit ? ` ${fact.unit}` : ''}</span></span>}
    </span>
  );
}

export function CardCitation({ id, card }: { id: string; card?: KnowledgeCard }) {
  const [open, setOpen] = useState(false);
  if (!card) return null;
  return (
    <span class="esc-cite-wrap">
      <button type="button" class="esc-cite esc-cite-card" aria-expanded={open} aria-label={`Evidence: ${card.title}`} onClick={() => setOpen(o => !o)}>ev</button>
      {open && <span class="esc-pop" role="note" data-card={id}><b>{card.title}</b><span>{card.statement}</span><span class="muted">Evidence: {card.rating}{card.sources[0] ? ` · ${card.sources[0].title} (${card.sources[0].year})` : ''}</span></span>}
    </span>
  );
}
