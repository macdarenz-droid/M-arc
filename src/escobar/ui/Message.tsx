/**
 * Rendering a conversation (§4.2): user bubbles, and Escobar's turns with the preamble,
 * components, proposal / navigate / escalation cards, the verified answer with citations,
 * and the "What Escobar looked at" drawer. Everything redraws from the stored messages.
 */
import { useState } from 'preact/hooks';
import { Button, Card } from '@/ui/primitives';
import { IconChevronDown } from '@/ui/icons';
import { goTo } from '../palace/navigate';
import { PALACE_BY_ID } from '../palace/registry';
import { CARD_BY_ID } from '../knowledge/cards';
import { parseDirectives } from '../verify';
import { onProposal, canApply } from '../apply';
import { ShowComponent } from './components';
import { Citation, CardCitation } from './Citation';
import { Escalation } from './Escalation';
import { imageData } from '../images';
import { state } from '@/core/store';
import { makeCtx } from '../tools/context';
import { statusLabel } from '../tools/executor';
import { pastTense, splitCitations } from './present';
import type { Conversation, Fact, ProposalRecord, RenderedTurn, StoredMessage, UserBlock } from '../types';

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
type ToolUse = { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> };
const toolUsesOf = (content: unknown[]): ToolUse[] => content.filter((b): b is ToolUse => isObj(b) && b.type === 'tool_use').map(b => ({ ...b, input: isObj(b.input) ? b.input : {} }));
const textOf = (content: unknown[]) => content.filter((b): b is { type: 'text'; text: string } => isObj(b) && b.type === 'text').map(b => b.text).join('');

export interface UserTurn { kind: 'user'; index: number; msg: Extract<StoredMessage, { role: 'user' }> }
export interface EscobarTurn { kind: 'escobar'; indexes: number[] }
export type Turn = UserTurn | EscobarTurn;

const isToolResults = (m: StoredMessage): boolean => m.role === 'user' && m.content.some(b => b.type === 'tool_result');

/** Groups stored messages into what the screen shows: a user bubble, then Escobar's whole reply. */
export function turnsOf(messages: StoredMessage[]): Turn[] {
  const out: Turn[] = [];
  messages.forEach((m, index) => {
    if (m.role === 'system') return;
    if (m.role === 'user' && !m.meta?.repair && !isToolResults(m)) { out.push({ kind: 'user', index, msg: m }); return; }
    const last = out[out.length - 1];
    if (last?.kind === 'escobar') last.indexes.push(index);
    else out.push({ kind: 'escobar', indexes: [index] });
  });
  return out;
}

function toolResults(messages: StoredMessage[], indexes: number[]): Map<string, { content: string; isError: boolean }> {
  const map = new Map<string, { content: string; isError: boolean }>();
  for (const i of indexes) {
    const m = messages[i];
    if (m?.role !== 'user') continue;
    for (const b of m.content) if (b.type === 'tool_result') map.set(b.tool_use_id, { content: b.content, isError: !!b.is_error });
  }
  return map;
}

export function UserBubble({ msg }: { msg: UserTurn['msg'] }) {
  const refs = msg.meta?.contextRefs ?? [];
  const text = msg.content.filter((b): b is Extract<UserBlock, { type: 'text' }> => b.type === 'text').map(b => b.text).join('\n').replace(/^(\[about: [^\]]*\]\s*)+/, '');
  const imgs = msg.content.filter((b): b is Extract<UserBlock, { type: 'image_ref' }> => b.type === 'image_ref');
  return (
    <div class="esc-user">
      {refs.map(r => <span key={r.id} class="chip chip-accent esc-ref">About: {r.label}</span>)}
      {imgs.length > 0 && <div class="esc-thumbs">{imgs.map(i => { const d = imageData(i.id); return d ? <img key={i.id} src={`data:${d.mediaType};base64,${d.data}`} alt={i.description ?? 'Attached photo'} /> : <span key={i.id} class="esc-thumb-missing small muted">Photo</span>; })}</div>}
      {text && <div class="esc-bubble">{text}</div>}
    </div>
  );
}

/** Answer text → paragraphs, bullets, sentences, citations; unverified sentences muted (§14.3). */
export function AnswerText({ text, ledger, unverified, streaming }: { text: string; ledger: Fact[]; unverified?: string[]; streaming?: boolean }) {
  const bad = new Set((unverified ?? []).map(s => s.trim()));
  const paras = text.split(/\n{2,}/);
  let cites = 0;
  const sentence = (raw: string, key: number) => {
    const { text: stripped, ids } = splitCitations(raw);
    const parts = stripped.split(/(⟦[^⟧]*⟧|\*\*[^*]+\*\*)/g).filter(Boolean);
    const body = parts.map((p, i) => {
      if (p.startsWith('⟦k:')) { const id = p.slice(3, -1); return <CardCitation key={i} id={id} card={CARD_BY_ID[id]} />; }
      if (p.startsWith('⟦')) return null;
      if (p.startsWith('**')) return <b key={i}>{p.slice(2, -2)}</b>;
      return p;
    });
    const facts = ids.map(id => ledger.find(f => f.id === id)).filter((f): f is Fact => !!f);
    if (facts.length) body.push(<Citation key="cite" n={++cites} facts={facts} />);
    const plain = parseDirectives(raw).plain.trim();
    return bad.has(plain) ? <span key={key} class="esc-unverified" title="Unverified number">{body}<span class="esc-unverified-hint"> Unverified number</span> </span> : <span key={key}>{body} </span>;
  };
  return (
    <div class="esc-answer">
      {paras.map((para, pi) => {
        const lines = para.split('\n');
        if (lines.every(l => /^\s*[-•]\s+/.test(l))) return <ul key={pi}>{lines.map((l, li) => <li key={li}>{l.replace(/^\s*[-•]\s+/, '').split(/(?<=[.!?])\s+/).map(sentence)}</li>)}</ul>;
        return <p key={pi}>{lines.map((l, li) => <>{li > 0 && <br />}{l.split(/(?<=[.!?])\s+/).map(sentence)}</>)}{streaming && pi === paras.length - 1 && <span class="esc-caret" aria-hidden="true" />}</p>;
      })}
    </div>
  );
}

export function ProposalCard({ p }: { p: ProposalRecord }) {
  const [busy, setBusy] = useState(false);
  const act = async (choice: 'apply' | 'dismiss' | 'undo') => { setBusy(true); try { await onProposal(p.id, choice); } finally { setBusy(false); } };
  return (
    <Card class="esc-proposal" data-proposal={p.status}>
      <b>{p.title}</b>
      <table class="esc-diff small"><tbody>{p.preview.map((r, i) => <tr key={i}><th scope="row">{r.label}</th><td class="muted">{r.before ?? '—'}</td><td aria-hidden="true">→</td><td>{r.after}</td></tr>)}</tbody></table>
      {p.status === 'awaiting' && (
        <div class="row" style={{ gap: 8 }}>
          <Button variant="primary" size="sm" disabled={busy || !canApply(p.kind)} onClick={() => act('apply')}>Apply</Button>
          <Button variant="quiet" size="sm" disabled={busy} onClick={() => act('dismiss')}>Not now</Button>
        </div>
      )}
      {p.status === 'applied' && <div class="small row" style={{ gap: 8 }}><span class="muted">Applied</span><button type="button" class="esc-link" onClick={() => act('undo')}>Undo</button></div>}
      {p.status === 'dismissed' && <div class="small muted">Dismissed</div>}
      {p.status === 'undone' && <div class="small muted">Undone</div>}
      {p.status === 'stale' && <div class="small muted">Out of date. Ask again for a fresh one.</div>}
      {p.status === 'failed' && <div class="small muted">Couldn’t apply this.</div>}
    </Card>
  );
}

function NavigateCard({ target, params }: { target: string; params?: Record<string, string> }) {
  const e = PALACE_BY_ID[target];
  if (!e) return null;
  return (
    <Card class="esc-nav">
      <div><b class="small">{e.title}</b><div class="hint">{e.where}</div></div>
      <Button size="sm" onClick={() => { void import('../session').then(s => s.escobarToHalf()); void goTo(e.target, params); }}>Take me there</Button>
    </Card>
  );
}

function prettyOutput(content: string): string {
  try {
    const j = JSON.parse(content) as { data?: unknown };
    return JSON.stringify(j && typeof j === 'object' && 'data' in j ? j.data : j, null, 1).slice(0, 4000);
  } catch { return content.slice(0, 4000); }
}

function Drawer({ uses, results }: { uses: ToolUse[]; results: Map<string, { content: string; isError: boolean }> }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState<string | null>(null);
  if (!uses.length) return null;
  const ctx = makeCtx(state.value);
  return (
    <div class="esc-drawer">
      <button type="button" class="esc-drawer-toggle small" aria-expanded={open} onClick={() => setOpen(o => !o)}>What Escobar looked at ({uses.length}) <IconChevronDown size={14} /></button>
      {open && (
        <ul class="esc-drawer-list small">
          {uses.map(u => {
            const r = results.get(u.id);
            const inputs = Object.entries(u.input).filter(([, v]) => v != null && typeof v !== 'object');
            return (
              <li key={u.id}>
                <button type="button" class="esc-drawer-item" aria-expanded={shown === u.id} onClick={() => setShown(s => (s === u.id ? null : u.id))}>
                  {pastTense(statusLabel(u.name, u.input, ctx))}{r?.isError && <span class="esc-err"> · didn’t work</span>}
                </button>
                {shown === u.id && (
                  <div class="esc-drawer-detail">
                    {inputs.length > 0 && <div class="hint">Asked for: {inputs.map(([k, v]) => `${k.replace(/([A-Z])/g, ' $1').toLowerCase()} ${String(v).replace(/^lib_/, '').replace(/_/g, ' ')}`).join(', ')}</div>}
                    <div class="hint">Data sent to Escobar:</div>
                    <pre class="esc-drawer-out">{r ? prettyOutput(r.content) : 'No result'}</pre>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/** One Escobar turn. `live` hides the drawer and chips while the loop still runs. */
export function EscobarTurnView({ conv, indexes, live, last, onChip }: { conv: Conversation; indexes: number[]; live?: boolean; last?: boolean; onChip?: (c: string) => void }) {
  const msgs = conv.messages;
  const results = toolResults(msgs, indexes);
  const assistant = indexes.map(i => ({ i, m: msgs[i]! })).filter((x): x is { i: number; m: Extract<StoredMessage, { role: 'assistant' }> } => x.m.role === 'assistant');
  const allUses = assistant.flatMap(a => toolUsesOf(a.m.content));
  const answers = assistant.filter(a => !toolUsesOf(a.m.content).length);
  const final = answers[answers.length - 1];
  const earlier = answers.slice(0, -1);
  const r: RenderedTurn | undefined = final?.m.meta.rendered;
  const answerText = r?.answer ?? (final ? parseDirectives(textOf(final.m.content)).text : '');
  const proposals = (conv.proposals ?? []).filter(p => p.messageIndex != null && indexes.includes(p.messageIndex));
  const visibleUse = (u: ToolUse) => { const r = results.get(u.id); return !!r && !r.isError && (u.name === 'show' || u.name === 'navigate' || u.name === 'escalate'); };
  const hasPreamble = assistant.some(a => (a.m.meta.rendered.preamble ?? []).some(p => parseDirectives(p).plain.trim()));
  // While a turn is still running its tool steps show in the live area; draw nothing here until there is something to see.
  if (live && !answerText && !proposals.length && !hasPreamble && !allUses.some(visibleUse)) return null;
  return (
    <div class="esc-turn">
      {assistant.map(({ i, m }) => {
        const uses = toolUsesOf(m.content);
        if (!uses.length) return null;
        const pre = m.meta.rendered.preamble ?? [];
        return (
          <div key={i} class="stack-sm">
            {pre.map((p, k) => <p key={k} class="esc-preamble">{parseDirectives(p).plain}</p>)}
            {uses.map(u => {
              const res = results.get(u.id);
              if (!res || res.isError) return null;
              if (u.name === 'show' && typeof u.input.component === 'string') return <ShowComponent key={u.id} component={u.input.component} params={isObj(u.input.params) ? u.input.params : {}} caption={typeof u.input.caption === 'string' ? u.input.caption : undefined} />;
              if (u.name === 'navigate') {
                const params: Record<string, string> = {};
                if (Array.isArray(u.input.params)) for (const p of u.input.params) if (isObj(p) && typeof p.key === 'string' && typeof p.value === 'string') params[p.key] = p.value;
                return <NavigateCard key={u.id} target={String(u.input.target)} params={params} />;
              }
              if (u.name === 'escalate') return <Escalation key={u.id} kind={u.input.kind as 'pain'} />;
              return null;
            })}
          </div>
        );
      })}
      {proposals.map(p => <ProposalCard key={p.id} p={p} />)}
      {earlier.filter(a => a.m.meta.rendered.revised).map(a => (
        <details key={a.i} class="esc-revised small"><summary>Earlier draft (revised)</summary><p class="muted">{parseDirectives(textOf(a.m.content)).plain}</p></details>
      ))}
      {answerText && <AnswerText text={answerText} ledger={conv.ledger} unverified={r?.unverified} />}
      {!live && <Drawer uses={allUses} results={results} />}
      {!live && last && !!r?.chips?.length && <div class="esc-chips">{r.chips.map(c => <button type="button" key={c} class="chip chip-btn" onClick={() => onChip?.(c)}>{c}</button>)}</div>}
    </div>
  );
}
