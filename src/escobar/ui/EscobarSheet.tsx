/**
 * The chat sheet (§4.2): its own `<dialog>` opened with showModal() so it stacks above any
 * open Sheet, with half / full detents, a header with status and menu, the thread, and the
 * composer. Loaded lazily from App.tsx the first time Escobar opens.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import { state } from '@/core/store';
import { todayReadiness } from '@/app/selectors';
import { showPanel } from '@/app/router';
import { Button, Card, Row, Toggle } from '@/ui/primitives';
import { IconEscobar, IconMore, IconX, IconBack } from '@/ui/icons';
import { escobarUi, loopView, offlineReason, online, quotaResetAt } from '../state';
import * as S from '../session';
import { goTo } from '../palace/navigate';
import { Composer } from './Composer';
import { EscobarTurnView, UserBubble, AnswerText, turnsOf, type UserTurn } from './Message';
import { Escalation } from './Escalation';
import { starterChips } from './prompts';
import { ThinkingLine } from './Thinking';
import { PlanBoard, currentTurn, isPlanWork } from './PlanBoard';
import type { ImageBlockRef } from '../types';
import type { SendInput, TurnResult } from '../loop';

export const EMPTY_LINE = 'I know every rep you’ve logged and every corner of this app. Ask me anything.';

function statusText(): string {
  const v = loopView.value.status;
  if (v !== 'idle') return 'thinking…';
  if (quotaResetAt.value && quotaResetAt.value > Date.now()) return 'resting (daily limit reached)';
  if (online.value === false) return 'offline';
  return 'online';
}

export const REGION_LINE = "Escobar isn't available on this network right now. Try mobile data.";

function resultLine(r: TurnResult): string | null {
  switch (r.outcome) {
    case 'error':
      if (r.error?.code === 'quota') return 'Escobar is resting until tomorrow (daily limit reached).';
      if (r.error?.code === 'rate') return 'Too many messages at once. Try again in a minute.';
      // PL-20: the coach's provider refuses some network locations; this is not a setup problem.
      if (r.error?.code === 'upstream_region') return REGION_LINE;
      return r.error?.message || 'Escobar couldn’t answer. Try again.';
    case 'refusal': return 'Escobar can’t help with that one.';
    case 'step_limit': return 'That took too many steps. Try a narrower question.';
    case 'cut_off': return 'The answer was cut off. Ask again, a little narrower.';
    case 'aborted': return 'Stopped.';
    case 'timeout': return 'That took too long. Try again.';
    case 'backgrounded': return 'Paused when the app went to the background.';
    default: return null;
  }
}

/** First enable (§20): what is sent, where, what is not, and the two sharing toggles. */
export function Explainer({ onDone }: { onDone?: () => void }) {
  const cur = state.value.escobar.sharing;
  const [health, setHealth] = useState(cur.health);
  const [body, setBody] = useState(cur.body);
  return (
    <div class="esc-explainer stack">
      <p>Escobar is an AI coach. When you ask him something, this is what leaves your phone:</p>
      <ul class="small">
        <li>A short summary of today (readiness, recovery, this week).</li>
        <li>The parts of your history he asks for to answer, and your messages and photos.</li>
        <li>It goes through your M/ARC server to Anthropic, the model provider.</li>
      </ul>
      <p class="small muted">The rest of your history stays on the phone. Every answer shows what he looked at.</p>
      <div class="list">
        <Row trailing={<Toggle checked={health} onChange={setHealth} label="Share health data" />}><span class="small">Share health data</span><div class="hint">Sleep, resting heart rate, heart rate during sessions.</div></Row>
        <Row trailing={<Toggle checked={body} onChange={setBody} label="Share body data" />}><span class="small">Share body data</span><div class="hint">Weight and body measurements.</div></Row>
      </div>
      <p class="hint">You can change these any time in Settings → Escobar.</p>
      <Button variant="primary" block onClick={() => { S.setEscobarEnabled(true, { health, body }); onDone?.(); }}>Turn on Escobar</Button>
    </div>
  );
}

function PastConversations({ onBack }: { onBack: () => void }) {
  const list = [...S.storeSig.value.conversations].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  return (
    <div class="stack-sm">
      <button type="button" class="esc-link small" onClick={onBack}><IconBack size={14} /> Back</button>
      {!list.length && <p class="small muted">No conversations yet.</p>}
      {list.map(c => (
        <button type="button" key={c.id} class="esc-past" onClick={() => { S.selectConversation(c.id); onBack(); }}>
          <b class="small">{c.title || 'New conversation'}</b><span class="hint">{c.updatedAt.slice(0, 10)}</span>
        </button>
      ))}
    </div>
  );
}

const bubbleOf = (i: SendInput): UserTurn['msg'] => ({ role: 'user', content: [{ type: 'text', text: i.text }, ...(i.images ?? [])], ...(i.contextRefs?.length ? { meta: { contextRefs: i.contextRefs } } : {}) });

function Thread({ onChip }: { onChip: (t: string) => void }) {
  const conv = S.activeConversation.value;
  const view = loopView.value;
  const busy = view.status !== 'idle';
  const pending = S.pendingUser.value;
  const last = S.lastTurn.value;
  const turns = conv ? turnsOf(conv.messages) : [];
  const showPending = pending && (!conv || conv.messages.length <= pending.at);
  const r = todayReadiness.value;
  const lastEscobar = turns.length - 1;
  const planWork = busy && isPlanWork(currentTurn(conv?.messages ?? []).uses, view.activity);

  if (!turns.length && !showPending && !last) {
    return (
      <div class="esc-empty">
        <IconEscobar size={40} />
        <p>{EMPTY_LINE}</p>
        <div class="esc-chips">{starterChips(state.value, r).map(c => <button type="button" key={c} class="chip chip-btn" onClick={() => onChip(c)}>{c}</button>)}</div>
      </div>
    );
  }
  return (
    <div class="esc-thread-inner">
      {S.safetyCards.value.map(k => <Escalation key={k} kind={k} />)}
      {turns.map((t, i) => (t.kind === 'user'
        ? <UserBubble key={t.index} msg={t.msg} />
        : <EscobarTurnView key={t.indexes[0]} conv={conv!} indexes={t.indexes} live={busy && i === lastEscobar} last={i === lastEscobar} onChip={onChip} />))}
      {showPending && pending && <UserBubble msg={bubbleOf(pending.input)} />}
      {!busy && last?.notSent && <UserBubble msg={bubbleOf(last.input)} />}
      {busy && (
        <div class="esc-turn esc-live" aria-live="polite">
          {planWork ? <PlanBoard messages={conv?.messages ?? []} activity={view.activity} /> : (
            <>
              {view.activity.map(a => <div key={a.id} class={`esc-activity${a.done ? ' done' : ''}`}><span class="esc-spin" aria-hidden="true" />{a.label}</div>)}
              {view.status === 'thinking' && !view.text && <ThinkingLine />}
            </>
          )}
          {view.status === 'verifying' && <ThinkingLine label="Checking the numbers…" />}
          {view.text && <AnswerText text={view.text} ledger={conv?.ledger ?? []} streaming />}
        </div>
      )}
      {!busy && last?.notSent && last.outcome !== 'offline' && (
        <div class="esc-notsent small"><span class="muted">Not sent</span> · <button type="button" class="esc-link" onClick={() => void S.send(last.input)}>Retry</button></div>
      )}
      {!busy && last?.local && (
        <Card class="esc-local">
          <p class="small">{last.local.text}</p>
          {last.local.entries.map(e => <Button key={e.id} size="sm" variant="quiet" onClick={() => { S.escobarToHalf(); void goTo(e.target); }}>{e.title}</Button>)}
        </Card>
      )}
      {!busy && last && resultLine(last) && <div class="esc-result small muted" role="status">{resultLine(last)}</div>}
    </div>
  );
}

export function EscobarSheet() {
  const ui = escobarUi.value;
  const ref = useRef<HTMLDialogElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const [menu, setMenu] = useState(false);
  const [past, setPast] = useState(false);
  const drag = useRef<{ y: number } | null>(null);
  const enabled = state.value.escobar.enabled;
  const view = loopView.value;
  const busy = view.status !== 'idle';

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    S.prepare();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; if (d.open) d.close(); };
  }, []);

  // Follow the stream only if the person was already at the bottom (§4.2).
  useEffect(() => {
    const t = threadRef.current;
    if (t && atBottom.current) t.scrollTop = t.scrollHeight;
  });

  const send = (text: string, images: ImageBlockRef[] = []) => {
    if (!text && !images.length) return;
    const ref0 = escobarUi.value.contextRef;
    escobarUi.value = { ...escobarUi.value, contextRef: null, draft: '' };
    atBottom.current = true;
    void S.send({ text: text || 'What do you see in this photo?', ...(images.length ? { images } : {}), ...(ref0 ? { contextRefs: [ref0] } : {}) });
  };

  const onPointerDown = (e: PointerEvent) => { drag.current = { y: e.clientY }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); };
  const onPointerUp = (e: PointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dy = e.clientY - d.y;
    if (dy < -40) escobarUi.value = { ...escobarUi.value, detent: 'full' };
    else if (dy > 60) { if (escobarUi.value.detent === 'full') S.escobarToHalf(); else S.closeEscobar(); }
  };

  const notice = online.value === false ? `Escobar is offline.${offlineReason.value ? ` ${offlineReason.value}` : ''} He can still point you around the app.` : quotaResetAt.value && quotaResetAt.value > Date.now() ? 'Escobar is resting until tomorrow (daily limit reached).' : undefined;
  const mode = ui.mode === 'live' ? ' · live' : ui.mode === 'plan' ? ' · planning' : '';

  return (
    <dialog ref={ref} class={`esc-sheet esc-${ui.detent}`} aria-labelledby="esc-title" onCancel={e => { e.preventDefault(); S.closeEscobar(); }} onClick={e => { if (e.target === e.currentTarget) S.closeEscobar(); }}>
      <div class="esc-panel" data-palace="escobar.sheet">
        <div class="esc-grab-zone" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onDblClick={() => { escobarUi.value = { ...escobarUi.value, detent: ui.detent === 'full' ? 'half' : 'full' }; }}><div class="sheet-grab" /></div>
        <header class="esc-head">
          <IconEscobar size={26} thinking={busy} />
          <div class="esc-head-text"><h2 id="esc-title">Escobar</h2><span class="hint" role="status">{statusText()}{mode}</span></div>
          <button type="button" class="btn btn-quiet btn-icon" aria-label="Escobar menu" aria-expanded={menu} onClick={() => setMenu(m => !m)}><IconMore /></button>
          <button type="button" class="btn btn-quiet btn-icon" aria-label="Close" onClick={() => S.closeEscobar()}><IconX /></button>
          {menu && (
            <div class="esc-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { setMenu(false); setPast(false); S.startNewConversation(); }}>New conversation</button>
              <button type="button" role="menuitem" onClick={() => { setMenu(false); setPast(true); }}>Past conversations</button>
              <button type="button" role="menuitem" onClick={() => { setMenu(false); S.escobarToHalf(); showPanel('memory'); }}>What Escobar knows</button>
              <button type="button" role="menuitem" onClick={() => { setMenu(false); S.closeEscobar(); void goTo('settings.escobar'); }}>Coach settings</button>
            </div>
          )}
        </header>
        <div class="esc-thread" ref={threadRef} onScroll={e => { const t = e.currentTarget; atBottom.current = t.scrollHeight - t.scrollTop - t.clientHeight < 40; }}>
          {!enabled ? <Explainer /> : past ? <PastConversations onBack={() => setPast(false)} /> : <Thread onChip={t => send(t)} />}
        </div>
        {enabled && !past && (
          <Composer
            busy={busy}
            draft={ui.draft}
            contextRef={ui.contextRef}
            notice={notice}
            suggestions={ui.mode === 'live' ? [] : starterChips(state.value, todayReadiness.value)}
            placeholder={ui.mode === 'live' ? 'Quick question mid-session…' : 'Ask Escobar…'}
            onSend={send}
            onStop={() => S.stop()}
            onClearRef={() => { escobarUi.value = { ...escobarUi.value, contextRef: null }; }}
            onFocus={() => { if (escobarUi.value.detent !== 'full') escobarUi.value = { ...escobarUi.value, detent: 'full' }; }}
          />
        )}
      </div>
    </dialog>
  );
}

export default EscobarSheet;
