/**
 * The client agent loop (§13): one user turn = staged user message + brief, then model
 * steps until the answer. Tools run locally between steps; all results for a step go back
 * in one user message. History stays valid on every exit path: staged messages only enter
 * history with the first final, and orphaned tool_use blocks are closed with is_error
 * results. Pure over injected deps (transport, state, clock) so it runs under test.
 */
import type { AppState } from '@/core/models';
import { buildBrief } from './context/brief';
import type { EscobarMode } from './context/modes';
import { executeTool, genericLabel, statusLabel, type MemoryEffect, type ToolOutcome } from './tools/executor';
import { makeCtx, type ToolCtx } from './tools/context';
import { checkGrounding, parseDirectives, repairInstruction, safetySignals, type ParsedAnswer, type SafetySignal } from './verify';
import { findInApp, type PalaceEntry } from './palace/registry';
import type { StreamEvent, Transport, ErrorCode } from './transport';
import type { ContextRef, Conversation, Fact, ImageBlockRef, ProposalRecord, RenderedTurn, StoredMessage, UserBlock, Usage } from './types';

export const STEP_BUDGET: Record<EscobarMode, number> = { chat: 8, live: 8, plan: 12, brief: 3, moment: 1, summarize: 1 };
export const REPAIR_BUDGET = 3;
export const WALL_CLOCK_MS = 150_000;
export const RETRY_BACKOFF_MS = 2000;
export const HISTORY_TOKEN_LIMIT = 60_000;
export const HISTORY_ENTRY_LIMIT = 400;
export const REPAIR_TEXT = '[app] verification check';

export interface Activity { id: string; name: string; label: string; done: boolean; isError?: boolean }

/** What the UI shows while a turn runs, and after it. */
export interface LiveView {
  status: 'thinking' | 'streaming' | 'tools' | 'verifying' | 'idle';
  /** Visible streamed text for the current step (directives completed only). */
  text: string;
  preamble: string[];
  activity: Activity[];
  outcomes: ToolOutcome[];
}

export type TurnOutcome = 'done' | 'error' | 'refusal' | 'aborted' | 'step_limit' | 'cut_off' | 'stale' | 'offline' | 'timeout' | 'backgrounded';

export interface TurnResult {
  outcome: TurnOutcome;
  answer?: ParsedAnswer;
  unverified?: string[];
  revised?: boolean;
  error?: { code: ErrorCode; message: string; retryAfter?: number };
  refusal?: { category: string | null };
  outcomes: ToolOutcome[];
  signals: SafetySignal[];
  /** Offline: palace entries that answer a navigation-style question locally. */
  local?: { text: string; entries: PalaceEntry[] };
  /** The user message was not committed (error before the first reply): show it as "Not sent · Retry". */
  notSent?: boolean;
}

export interface SendInput {
  text: string;
  images?: ImageBlockRef[];
  contextRefs?: ContextRef[];
}

export interface LoopDeps {
  transport: Transport;
  getState(): AppState;
  now(): number;
  appVersion: string;
  manifest(): { hash: string; body: unknown };
  focus?(): ToolCtx['focus'];
  online?(): boolean;
  /** Base64 of a photo kept in IndexedDB or memory. */
  imageData?(id: string): { mediaType: string; data: string } | null;
  applyEffect?(e: MemoryEffect): void;
  recordUsage?(u: { turns: number; inputTokens: number; outputTokens: number; cacheReadTokens: number }): void;
  persist?(c: Conversation): void;
  onUpdate?(v: LiveView): void;
  onSafety?(s: SafetySignal): void;
  sleep?(ms: number): Promise<void>;
  wallClockMs?: number;
  heartSeries?: ToolCtx['heartSeries'];
  watch?: () => ToolCtx['watch'];
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const blocksOf = (m: StoredMessage): unknown[] => (Array.isArray(m.content) ? m.content : []);
const toolUses = (content: unknown[]) => content.filter((b): b is { type: 'tool_use'; id: string; name: string; input: unknown } => isObj(b) && b.type === 'tool_use');
const textOf = (content: unknown[]) => content.filter((b): b is { type: 'text'; text: string } => isObj(b) && b.type === 'text').map(b => b.text).join('');

/** The app-only parts (meta, image refs, sent flags) never reach the Worker (§12.2). */
export function toRequestMessages(messages: StoredMessage[], imageData?: LoopDeps['imageData']): unknown[] {
  return messages.map(m => {
    if (m.role === 'system') return { role: 'system', content: m.content };
    if (m.role === 'assistant') return { role: 'assistant', content: m.content };
    const content = m.content.map((b: UserBlock) => {
      if (b.type === 'text') return { type: 'text', text: b.text };
      if (b.type === 'tool_result') return { type: 'tool_result', tool_use_id: b.tool_use_id, content: b.content, ...(b.is_error ? { is_error: true } : {}) };
      const img = !b.sent && imageData ? imageData(b.id) : null;
      if (img) return { type: 'image', source: { type: 'base64', media_type: img.mediaType, data: img.data } };
      return { type: 'text', text: `[photo shared earlier${b.description ? `: ${b.description}` : ''}]` };
    });
    return { role: 'user', content };
  });
}

const isPlainUser = (m: StoredMessage | undefined): boolean => !!m && m.role === 'user' && !m.meta?.repair && !m.content.some(b => b.type === 'tool_result');

/**
 * The history window (§11.4): beyond ~60 k tokens or 400 entries, the oldest part is replaced
 * in the request (never in the store) by the rolling summary, or trimmed at a clean user turn.
 */
export function windowMessages(conv: Conversation, messages: StoredMessage[]): StoredMessage[] {
  const tokens = (ms: StoredMessage[]) => Math.ceil(JSON.stringify(ms).length / 4);
  if (tokens(messages) <= HISTORY_TOKEN_LIMIT && messages.length <= HISTORY_ENTRY_LIMIT) return messages;
  const summary = conv.rollingSummary;
  let cut = summary && summary.upTo < messages.length && isPlainUser(messages[summary.upTo]) ? summary.upTo : -1;
  if (cut < 0) {
    cut = Math.floor(messages.length / 2);
    while (cut < messages.length && !isPlainUser(messages[cut])) cut++;
    if (cut >= messages.length) return messages;
  }
  const head: StoredMessage = { role: 'user', content: [{ type: 'text', text: summary && cut === summary.upTo ? `[summary of earlier conversation] ${summary.text}` : '[earlier conversation trimmed]' }] };
  const rest = messages.slice(cut);
  // Two user messages in a row are merged by the API; keep the shape simple.
  return [head, ...rest];
}

/** Offline, answer "where is…/how do I…" from the palace (§13, §23 EV5). */
export function offlineReply(text: string): { text: string; entries: PalaceEntry[] } {
  const entries = findInApp(text, 3);
  if (!entries.length) return { text: 'Escobar is offline. Your notes below still update.', entries: [] };
  const top = entries[0]!;
  return { text: `Escobar is offline, but here's where to look: ${top.title} is at ${top.where}. ${top.what}`, entries };
}

let genCounter = 0;

export class EscobarLoop {
  conversation: Conversation;
  private deps: LoopDeps;
  private generation = 0;
  private controller: AbortController | null = null;
  private abortReason: TurnOutcome | null = null;
  view: LiveView = { status: 'idle', text: '', preamble: [], activity: [], outcomes: [] };

  constructor(conversation: Conversation, deps: LoopDeps) {
    this.conversation = conversation;
    this.deps = deps;
  }

  get busy(): boolean { return this.view.status !== 'idle'; }

  private update(patch: Partial<LiveView>): void {
    this.view = { ...this.view, ...patch };
    this.deps.onUpdate?.(this.view);
  }

  private commit(messages: StoredMessage[], extra: Partial<Conversation> = {}): void {
    const c = this.conversation;
    let title = c.title;
    if (!title) {
      const u = messages.find(m => m.role === 'user' && !m.meta?.repair && m.content.some(b => b.type === 'text'));
      const t = u && u.role === 'user' ? u.content.find(b => b.type === 'text') : undefined;
      if (t && t.type === 'text') title = t.text.replace(/^\[about:[^\]]*\]\s*/, '').replace(/\s+/g, ' ').trim().slice(0, 40);
    }
    this.conversation = { ...c, ...extra, title, messages: [...c.messages, ...messages], updatedAt: new Date(this.deps.now()).toISOString() };
  }

  private save(): void { this.deps.persist?.(this.conversation); }

  /** Adds is_error results for any tool_use left without a result (§13). */
  closeOrphans(reason: string): void {
    const msgs = this.conversation.messages;
    const last = msgs[msgs.length - 1];
    if (!last || last.role !== 'assistant') return;
    const uses = toolUses(blocksOf(last));
    if (!uses.length) return;
    this.commit([{ role: 'user', content: uses.map(u => ({ type: 'tool_result' as const, tool_use_id: u.id, content: `not run: ${reason}`, is_error: true })) }]);
    this.save();
  }

  /** The Stop button. */
  stop(): void { this.abort('aborted'); }
  /** The app went to the background mid-stream (§13). */
  background(): void { if (this.busy) this.abort('backgrounded'); }

  private abort(reason: TurnOutcome): void {
    this.abortReason = reason;
    this.generation = ++genCounter;
    this.controller?.abort();
  }

  private ctx(): ToolCtx {
    return makeCtx(this.deps.getState(), this.deps.now(), { focus: this.deps.focus?.() ?? null, heartSeries: this.deps.heartSeries, watch: this.deps.watch?.() });
  }

  private userMessage(input: SendInput): StoredMessage {
    const refs = input.contextRefs ?? [];
    const prefix = refs.map(r => `[about: ${r.kind} ${r.id} "${r.label.replace(/"/g, "'")}"]`).join(' ');
    const text = prefix ? `${prefix} ${input.text}` : input.text;
    const content: UserBlock[] = [...(input.images ?? []), { type: 'text', text }];
    return { role: 'user', content, ...(refs.length ? { meta: { contextRefs: refs } } : {}) };
  }

  private briefMessage(mode: EscobarMode, signals: SafetySignal[]): { msg: StoredMessage; facts: Fact[]; lines: Record<string, string> } {
    const c = this.conversation;
    const b = buildBrief({
      ctx: this.ctx(), mode, turnIndex: c.userTurns ?? 0, previous: c.briefLines ?? null, ledger: c.ledger,
      pending: (c.proposals ?? []).filter(p => p.status === 'awaiting').map(p => ({ id: p.id, title: p.title })),
      decisions: (c.pendingDecisions ?? []).map(d => ({ proposalId: d.proposalId, title: d.title, decision: d.decision })),
      signals,
    });
    return { msg: { role: 'system', content: b.text }, facts: b.facts, lines: b.lines };
  }

  /** Streams one step. Retries once for busy/timeout when nothing reached the screen yet. */
  private async step(messages: StoredMessage[], mode: EscobarMode, signal: AbortSignal, gen: number): Promise<{ final?: Extract<StreamEvent, { t: 'final' }>; error?: TurnResult['error']; refusal?: { category: string | null }; stale?: boolean }> {
    const s = this.deps.getState();
    const body = {
      protocol: 2, mode, appVersion: this.deps.appVersion, manifest: this.deps.manifest(),
      messages: toRequestMessages(windowMessages(this.conversation, messages), this.deps.imageData),
      unit: s.preferences.weightUnit, tone: s.escobar.tone,
    };
    for (let attempt = 0; ; attempt++) {
      let shown = false;
      let text = '';
      const activity: Activity[] = [...this.view.activity];
      const buffer = { raw: '' };
      try {
        for await (const ev of this.deps.transport.turn(body, signal)) {
          if (gen !== this.generation) return { stale: true };
          switch (ev.t) {
            case 'thinking': this.update({ status: 'thinking' }); break;
            case 'text': {
              shown = true;
              buffer.raw += ev.d;
              const open = buffer.raw.lastIndexOf('⟦'), close = buffer.raw.lastIndexOf('⟧');
              text = parseDirectives(open > close ? buffer.raw.slice(0, open) : buffer.raw).text;
              this.update({ status: 'streaming', text });
              break;
            }
            case 'tool':
              shown = true;
              activity.push({ id: ev.id, name: ev.name, label: genericLabel(ev.name), done: false });
              this.update({ status: 'tools', activity: [...activity] });
              break;
            case 'tool_input': {
              const a = activity.find(x => x.id === ev.id);
              if (a) a.label = statusLabel(a.name, ev.input, this.ctx());
              this.update({ activity: [...activity] });
              break;
            }
            case 'final': return { final: ev };
            case 'refusal': return { refusal: { category: ev.category } };
            case 'error': {
              if (!shown && attempt === 0 && (ev.code === 'upstream_busy' || ev.code === 'timeout')) throw Object.assign(new Error('retry'), { retryable: ev });
              return { error: { code: ev.code, message: ev.message, ...(ev.retryAfter ? { retryAfter: ev.retryAfter } : {}) } };
            }
            default: break;
          }
        }
        if (signal.aborted) return { stale: true };
        return { error: { code: 'network', message: 'The connection closed before the answer finished.' } };
      } catch (err) {
        const retryable = (err as { retryable?: StreamEvent }).retryable;
        if (retryable && attempt === 0) { await (this.deps.sleep ?? (ms => new Promise(r => setTimeout(r, ms))))(RETRY_BACKOFF_MS); continue; }
        if (signal.aborted) return { stale: true };
        return { error: { code: 'network', message: 'Could not reach the coach.' } };
      }
    }
  }

  async send(input: SendInput, mode: EscobarMode = 'chat'): Promise<TurnResult> {
    const signals = safetySignals(input.text);
    for (const s of signals) if (s === 'crisis' || s === 'medical') this.deps.onSafety?.(s);
    const outcomes: ToolOutcome[] = [];
    if (this.deps.online && !this.deps.online()) return { outcome: 'offline', local: offlineReply(input.text), outcomes, signals, notSent: true };

    const gen = this.generation = ++genCounter;
    this.abortReason = null;
    const controller = this.controller = new AbortController();
    const timer = setTimeout(() => this.abort('timeout'), this.deps.wallClockMs ?? WALL_CLOCK_MS);
    this.update({ status: 'thinking', text: '', preamble: [], activity: [], outcomes: [] });

    const brief = this.briefMessage(mode, signals);
    let staged: StoredMessage[] | null = [this.userMessage(input), brief.msg];
    let stagedExtra: Partial<Conversation> = { ledger: [...this.conversation.ledger, ...brief.facts], briefLines: brief.lines, userTurns: (this.conversation.userTurns ?? 0) + 1, pendingDecisions: [] };
    const usage = { inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 };
    let steps = 0;
    let budget = STEP_BUDGET[mode];
    let repaired = false;
    let firstAnswerIndex = -1;
    let result: TurnResult | null = null;

    const finish = (r: TurnResult): TurnResult => {
      clearTimeout(timer);
      if (usage.outputTokens || usage.inputTokens) this.deps.recordUsage?.({ turns: 1, ...usage });
      this.update({ status: 'idle' });
      if (!staged) this.markImagesSent(); else this.save();
      return r;
    };
    const exitAborted = (): TurnResult => {
      const reason = this.abortReason ?? 'stale';
      this.closeOrphans(reason === 'aborted' ? 'aborted' : reason === 'backgrounded' ? 'backgrounded' : reason === 'timeout' ? 'timeout' : 'stale');
      return finish({ outcome: reason, outcomes, signals, notSent: !!staged });
    };

    try {
      for (;;) {
        if (steps >= budget) {
          this.closeOrphans('step_limit');
          result = finish({ outcome: 'step_limit', outcomes, signals });
          break;
        }
        steps++;
        const pending = staged ? [...this.conversation.messages, ...staged] : this.conversation.messages;
        const r = await this.step(pending, mode, controller.signal, gen);
        if (r.stale || gen !== this.generation) { result = exitAborted(); break; }
        if (r.error) { result = finish({ outcome: 'error', error: r.error, outcomes, signals, notSent: !!staged }); break; }
        if (r.refusal) { this.update({ text: '' }); result = finish({ outcome: 'refusal', refusal: r.refusal, outcomes, signals, notSent: !!staged }); break; }
        const final = r.final!;
        const u = final.usage as Partial<Usage> & { iterations?: Array<Partial<Usage>> } | undefined;
        const its = u?.iterations?.length ? u.iterations : u ? [u] : [];
        for (const it of its) { usage.inputTokens += it.input_tokens ?? 0; usage.outputTokens += it.output_tokens ?? 0; usage.cacheReadTokens += it.cache_read_input_tokens ?? 0; }
        if (staged) { this.commit(staged, stagedExtra); staged = null; stagedExtra = {}; }
        const content = final.content;
        const uses = toolUses(content);
        const preamble = uses.length ? textOf(content).trim() : '';
        const rendered: RenderedTurn = { activity: this.view.activity.map(a => ({ id: a.id, name: a.name, label: a.label })), ...(preamble ? { preamble: [preamble] } : {}) };
        this.commit([{ role: 'assistant', content, meta: { rendered, ...(final.usage ? { usage: final.usage as unknown as Usage } : {}), ...(final.model ? { model: final.model } : {}) } }]);
        if (preamble) this.update({ preamble: [...this.view.preamble, preamble], text: '' });
        this.save();

        if (final.stop_reason === 'max_tokens' && uses.length) {
          this.closeOrphans('cut_off');
          result = finish({ outcome: 'cut_off', outcomes, signals });
          break;
        }
        if (!uses.length) {
          const raw = textOf(content);
          const parsed = parseDirectives(raw);
          const grounding = checkGrounding({ answer: raw, ledger: this.conversation.ledger, userTexts: this.userTexts() });
          const idx = this.conversation.messages.length - 1;
          if (firstAnswerIndex < 0) firstAnswerIndex = idx;
          if (!grounding.ok && !repaired) {
            repaired = true;
            budget = steps + REPAIR_BUDGET;
            this.update({ status: 'verifying' });
            staged = [{ role: 'user', content: [{ type: 'text', text: REPAIR_TEXT }], meta: { repair: true } }, { role: 'system', content: repairInstruction(grounding.ungrounded) }];
            continue;
          }
          const revised = firstAnswerIndex !== idx;
          this.setRendered(idx, { answer: parsed.text, chips: parsed.chips, ...(grounding.ok ? {} : { unverified: grounding.sentences }) });
          if (revised) this.setRendered(firstAnswerIndex, { revised: true });
          result = finish({ outcome: 'done', answer: parsed, ...(grounding.ok ? {} : { unverified: grounding.sentences }), revised, outcomes, signals });
          break;
        }

        // Run the tools locally, in block order (read tools are local and synchronous, so
        // "parallel" costs nothing and keeps fact ids deterministic).
        this.update({ status: 'tools' });
        const results: UserBlock[] = [];
        let ledger = this.conversation.ledger;
        let proposals = this.conversation.proposals ?? [];
        const assistantIndex = this.conversation.messages.length - 1;
        for (const use of uses) {
          if (gen !== this.generation) break;
          const o = executeTool(use, { ctx: this.ctx(), ledger, turn: this.conversation.userTurns ?? 0, proposalCount: proposals.length });
          ledger = [...ledger, ...o.facts];
          if (o.proposal) proposals = [...proposals, { ...o.proposal, status: 'awaiting', messageIndex: assistantIndex } as ProposalRecord];
          if (o.effect) this.deps.applyEffect?.(o.effect);
          outcomes.push(o);
          results.push({ type: 'tool_result', tool_use_id: use.id, content: o.content, ...(o.isError ? { is_error: true } : {}) });
          const a = this.view.activity.find(x => x.id === use.id);
          if (a) { a.label = o.label; a.done = true; a.isError = o.isError; }
        }
        if (gen !== this.generation) { result = exitAborted(); break; }
        this.commit([{ role: 'user', content: results }], { ledger, proposals });
        this.update({ outcomes: [...outcomes], activity: [...this.view.activity] });
        this.save();
      }
    } catch {
      if (gen !== this.generation) result = exitAborted();
      else { this.closeOrphans('error'); result = finish({ outcome: 'error', error: { code: 'network', message: 'Something went wrong.' }, outcomes, signals, notSent: !!staged }); }
    }
    this.controller = null;
    return result!;
  }

  private setRendered(index: number, patch: Partial<RenderedTurn>): void {
    const msgs = [...this.conversation.messages];
    const m = msgs[index];
    if (!m || m.role !== 'assistant') return;
    msgs[index] = { ...m, meta: { ...m.meta, rendered: { ...m.meta.rendered, ...patch } } };
    this.conversation = { ...this.conversation, messages: msgs };
  }

  private userTexts(): string[] {
    return this.conversation.messages.filter((m): m is Extract<StoredMessage, { role: 'user' }> => m.role === 'user' && !m.meta?.repair)
      .flatMap(m => m.content.filter(b => b.type === 'text').map(b => (b as { text: string }).text));
  }

  /** Marks every photo in finished turns as sent, so later requests carry a stub (§6.2). */
  markImagesSent(): void {
    const msgs = this.conversation.messages.map(m => (m.role === 'user' && m.content.some(b => b.type === 'image_ref' && !b.sent) ? { ...m, content: m.content.map(b => (b.type === 'image_ref' ? { ...b, sent: true } : b)) } : m));
    this.conversation = { ...this.conversation, messages: msgs };
    this.save();
  }
}
