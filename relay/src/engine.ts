// Assigned agents. Relay itself runs GPT, Claude or Gemini through their APIs whenever there is work for an agent:
// a new message in its folder, an @mention, its scheduled check-in, a follow-up it asked for, or the owner's "Run now".
// No chat window has to stay open. Every agent acts through its own write link, so it has exactly the scope,
// identity and tools an MCP client of that link would have (see mcp.ts), plus continue_later.
//
// Guards: one queued run per agent and folder (bursts coalesce), a daily run cap per agent, at most MAX_STEPS tool
// rounds per run, agents stop triggering each other after MAX_CHAIN messages without a human, and check-ins are
// skipped (no model call) when nothing changed since the agent last ran.
import Anthropic from '@anthropic-ai/sdk'
import { HttpError, PROVIDERS, type Agent, type Message, type Run, type Store } from './store.ts'
import { fileLine, msgMd, treeMd, view, when, type View } from './agent.ts'
import { TOOLS, callTool, instructions } from './mcp.ts'

export interface Keys { openai?: string; anthropic?: string; gemini?: string; openaiBase?: string }
export type Fetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

export const MAX_CHAIN = 6
const MAX_STEPS = 8
const RUN_TOKEN_BUDGET = 400_000
const CALL_TIMEOUT_MS = 300_000
const TICK_BUDGET_MS = 5 * 60_000
const LEASE_MS = 20 * 60_000
const TOKEN = /rl_[A-Za-z0-9]{32}/g
/** Link tokens are write keys: never let an agent repeat one into a thread or file. */
export const redact = (text: string) => text.replace(TOKEN, 'rl_[hidden]')
const clip = (text: string, max: number, hint: string) => (text.length > max ? `${text.slice(0, max)}\n…(cut at ${max} characters; ${hint})` : text)
const DEBOUNCE_MS = 1500
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai'
export const KEY_NAMES: Record<string, string> = { openai: 'OPENAI_API_KEY', anthropic: 'ANTHROPIC_API_KEY', gemini: 'GEMINI_API_KEY' }

interface ToolDef { name: string; description: string; inputSchema: Record<string, unknown> }
type Exec = (name: string, args: Record<string, unknown>) => Promise<{ text: string; isError?: boolean }>
interface Outcome { text: string; tokensIn: number; tokensOut: number; note?: string }
interface Turn { system: string; prompt: string; tools: ToolDef[]; exec: Exec; alive: () => boolean }
const STOPPED = 'Stopped: the agent was paused or removed'
const OVER = `Stopped at the per-run budget of ${RUN_TOKEN_BUDGET} input tokens`

const CONTINUE: ToolDef = {
  name: 'continue_later',
  description: 'Be woken again later to carry on a longer task by yourself. Use it when work remains that needs no input from anyone; say what you will do next.',
  inputSchema: {
    type: 'object',
    properties: { minutes: { type: 'integer', minimum: 1, maximum: 1440, description: 'Minutes from now' }, note: { type: 'string', description: 'What you will do next' } },
    required: ['minutes', 'note'],
  },
}

/** "@GPT-5.6" or "@ClaudeReviewer" for an agent named "Claude Reviewer". */
export const handle = (name: string) => name.replace(/\s+/g, '')
export function mentions(body: string, name: string): boolean {
  const forms = [...new Set([name, handle(name)])].map(f => f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  return new RegExp(`(^|[^\\w@])@(${forms})(?![\\w-])`, 'i').test(body)
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

export class Engine {
  store: Store
  keys: Keys
  fetch: Fetch
  private busyUntil = 0
  private again = false

  constructor(o: { store: Store; keys: Keys; fetch?: Fetch }) {
    this.store = o.store
    this.keys = o.keys
    this.fetch = o.fetch ?? ((input, init) => fetch(input, init))
    this.store.onMessage = m => this.onMessage(m)
    // Nothing runs across a restart; runs cut off by one are reported, not left "working" forever.
    this.store.sql.run(`UPDATE runs SET status = 'error', error = 'Interrupted by a restart', finished_at = ? WHERE status = 'running'`, this.store.now())
  }

  providers(): Record<string, boolean> {
    return { openai: !!this.keys.openai, anthropic: !!this.keys.anthropic, gemini: !!this.keys.gemini }
  }

  nextWake(): number | null {
    return this.store.nextWake()
  }

  /** A lease rather than a flag: if a tick is ever cut off, the engine frees itself after LEASE_MS. */
  isBusy(): boolean {
    return Date.now() < this.busyUntil
  }

  /** New message → queue the agents it concerns. Their own messages never wake themselves. */
  onMessage(m: Message) {
    const s = this.store
    for (const a of s.agents(m.project_id)) {
      if (!a.enabled || m.via === a.link_id || s.runsToday(a) >= a.daily_runs) continue
      // A link (or another agent) may only wake agents that see no more than it does.
      if (m.via !== 'owner') {
        const from = s.linkById(m.via)
        if (!from || !s.subtree(from.folder_id).includes(a.scope_id)) continue
      }
      const mentioned = !!a.on_mention && mentions(m.body, a.name)
      const home = !!a.on_message && m.folder_id === a.folder_id
      if (!mentioned && !home) continue
      if (!s.subtree(a.scope_id).includes(m.folder_id)) continue
      if (m.via !== 'owner' && s.chainLength(m.folder_id) > MAX_CHAIN) continue
      s.enqueue({ agent: a, folderId: m.folder_id, reason: mentioned ? 'mention' : 'message', due: s.now() + DEBOUNCE_MS, triggerId: m.id })
    }
  }

  /** Runs whatever is due, one run at a time. Adapters call it from a Durable Object alarm or a timer. */
  async tick(): Promise<void> {
    if (this.isBusy()) {
      this.again = true
      return
    }
    this.busyUntil = Date.now() + LEASE_MS
    const started = Date.now()
    const inBudget = () => Date.now() - started < TICK_BUDGET_MS
    try {
      this.store.expireRuns(this.store.now() - LEASE_MS)
      do {
        this.again = false
        this.checkins()
        for (let n = 0; n < 12 && inBudget(); n++) {
          const run = this.store.nextDue(this.store.now())
          if (!run) break
          await this.execute(run)
        }
      } while (this.again && inBudget())
    } finally {
      this.busyUntil = 0
    }
  }

  private checkins() {
    const s = this.store
    const now = s.now()
    for (const a of s.checkinsDue(now)) {
      s.setNextAt(a.id, now + a.every_min * 60_000)
      const link = s.linkById(a.link_id)
      const last = s.lastRunAt(a.id)
      if (!link || s.runsToday(a) >= a.daily_runs || (last && !s.activitySince(link.folder_id, last))) continue
      s.enqueue({ agent: a, folderId: a.folder_id, reason: 'schedule', due: now })
    }
  }

  private async execute(run: Run) {
    const s = this.store
    const done = (status: 'done' | 'error' | 'skipped', o: { tokens_in?: number; tokens_out?: number; error?: string | null } = {}) => s.finishRun(run.id, status, o)
    let a: Agent
    try {
      a = s.agent(run.agent_id)
    } catch {
      return done('skipped', { error: 'Agent was deleted' })
    }
    if (!a.enabled) return done('skipped', { error: 'Agent is paused' })
    if (s.runsToday(a) >= a.daily_runs) return done('skipped', { error: `Daily limit of ${a.daily_runs} runs reached` })
    const key = this.keys[a.provider as keyof Keys]
    if (!key) return done('error', { error: `No API key for ${a.provider}: set the ${KEY_NAMES[a.provider]} secret` })
    const link = s.linkById(a.link_id)
    if (!link) return done('error', { error: 'The agent lost its link' })
    s.startRun(run)
    const alive = () => {
      if (!s.linkById(link.id)) return false
      try {
        return !!s.agent(a.id).enabled
      } catch {
        return false
      }
    }
    try {
      // The agent's own token never appears in its context: links it sees are relay:/… placeholders.
      const v: View = { ...view(s, s.origin(), link.token), base: 'relay:' }
      const at = v.tree.find(t => t.f.id === run.folder_id)
      if (!at) throw new Error('That folder is outside this agent')
      const exec: Exec = async (name, args) => {
        if (!alive()) return { text: STOPPED, isError: true }
        for (const k of ['body', 'content']) if (typeof args[k] === 'string') args[k] = redact(args[k] as string)
        if (name === 'continue_later') {
          const minutes = Math.min(Math.max(Math.round(Number(args.minutes)) || 30, 1), 1440)
          s.enqueue({ agent: a, folderId: at.f.id, reason: 'followup', due: s.now() + minutes * 60_000, note: String(args.note ?? '') })
          return { text: `You will be woken in ${minutes} minutes.` }
        }
        try {
          const r = await callTool(v, name, args)
          if (!r) return { text: `Unknown tool: ${name}`, isError: true }
          return { text: clip(r.content[0]?.text ?? '', 40_000, 'ask for less, e.g. fetch one item'), isError: 'isError' in r ? !!r.isError : false }
        } catch (e) {
          if (e instanceof HttpError) return { text: e.message, isError: true }
          throw e
        }
      }
      const turn: Turn = {
        system: systemPrompt(v, a),
        prompt: userPrompt(v, run, at),
        tools: [...TOOLS.filter(t => !('write' in t) || v.link.can_write), CONTINUE],
        exec,
        alive,
      }
      const out =
        a.provider === 'anthropic' ? await this.anthropic(a, key, turn)
        : a.provider === 'openai' ? await this.openai(a, key, turn)
        : await this.chat(GEMINI_BASE, a, key, turn)
      const reply = redact(out.text.trim())
      if (reply && alive() && !/^NO_REPLY\b/i.test(reply)) s.createMessage(at.f.id, { author: a.name, kind: a.kind, via: link.id }, { body: reply.slice(0, 100_000) })
      done('done', { tokens_in: out.tokensIn, tokens_out: out.tokensOut, error: out.note ?? null })
    } catch (e) {
      console.error('agent run failed', a.name, e)
      done('error', { error: (e instanceof Error ? e.message : String(e)).slice(0, 500) })
    }
  }

  // ── Claude: Messages API through the official SDK, manual tool loop ─────────
  private async anthropic(a: Agent, key: string, t: Turn): Promise<Outcome> {
    const client = new Anthropic({ apiKey: key, fetch: this.fetch, maxRetries: 2, timeout: CALL_TIMEOUT_MS })
    // Server-side refusal fallbacks on the models that support them.
    const fallback = /^claude-(opus-5|fable-5-1)$/.test(a.model)
    const tools: Anthropic.Beta.BetaTool[] = t.tools.map(d => ({ name: d.name, description: d.description, input_schema: d.inputSchema as Anthropic.Beta.BetaTool.InputSchema }))
    const messages: Anthropic.Beta.BetaMessageParam[] = [{ role: 'user', content: t.prompt }]
    let tokensIn = 0
    let tokensOut = 0
    for (let step = 0; step < MAX_STEPS; step++) {
      if (!t.alive()) return { text: '', tokensIn, tokensOut, note: STOPPED }
      if (tokensIn > RUN_TOKEN_BUDGET) return { text: '', tokensIn, tokensOut, note: OVER }
      const res = await client.beta.messages.create({
        model: a.model,
        max_tokens: 16000,
        system: t.system,
        tools,
        messages,
        cache_control: { type: 'ephemeral' },
        ...(a.effort && !/haiku/.test(a.model) ? { output_config: { effort: a.effort as 'low' | 'medium' | 'high' } } : {}),
        ...(fallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const } : {}),
      })
      const u = res.usage
      tokensIn += u.input_tokens + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0)
      tokensOut += u.output_tokens
      if (res.stop_reason === 'refusal') return { text: '', tokensIn, tokensOut, note: 'The model declined this request' }
      messages.push({ role: 'assistant', content: res.content })
      if (res.stop_reason === 'pause_turn') continue
      const uses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use')
      const text = res.content.flatMap(b => (b.type === 'text' ? [b.text] : [])).join('\n\n')
      if (res.stop_reason !== 'tool_use' || !uses.length)
        return { text, tokensIn, tokensOut, note: res.stop_reason === 'max_tokens' ? 'The reply hit the token limit' : undefined }
      const results: Anthropic.Beta.BetaToolResultBlockParam[] = []
      for (const b of uses) {
        const r = await t.exec(b.name, (b.input ?? {}) as Record<string, unknown>)
        results.push({ type: 'tool_result', tool_use_id: b.id, content: r.text, ...(r.isError ? { is_error: true } : {}) })
      }
      messages.push({ role: 'user', content: results })
    }
    return { text: '', tokensIn, tokensOut, note: `Stopped after ${MAX_STEPS} tool rounds` }
  }

  // ── GPT: Responses API (function calling on current models), chained by previous_response_id ─────
  private async openai(a: Agent, key: string, t: Turn): Promise<Outcome> {
    const base = (this.keys.openaiBase || 'https://api.openai.com/v1').replace(/\/+$/, '')
    const tools = t.tools.map(d => ({ type: 'function', name: d.name, description: d.description, parameters: d.inputSchema, strict: false }))
    let input: unknown[] = [{ role: 'user', content: t.prompt }]
    let previous: string | undefined
    let tokensIn = 0
    let tokensOut = 0
    for (let step = 0; step < MAX_STEPS; step++) {
      if (!t.alive()) return { text: '', tokensIn, tokensOut, note: STOPPED }
      if (tokensIn > RUN_TOKEN_BUDGET) return { text: '', tokensIn, tokensOut, note: OVER }
      const data = (await this.post(`${base}/responses`, key, {
        model: a.model,
        instructions: t.system,
        input,
        tools,
        max_output_tokens: 16000,
        ...(previous ? { previous_response_id: previous } : {}),
        ...(a.effort ? { reasoning: { effort: a.effort } } : {}),
      })) as {
        id: string; status?: string; incomplete_details?: { reason?: string }; usage?: { input_tokens?: number; output_tokens?: number }
        output?: { type: string; call_id?: string; name?: string; arguments?: string; content?: { type: string; text?: string; refusal?: string }[] }[]
      }
      tokensIn += data.usage?.input_tokens ?? 0
      tokensOut += data.usage?.output_tokens ?? 0
      previous = data.id
      const output = data.output ?? []
      const parts = output.filter(o => o.type === 'message').flatMap(o => o.content ?? [])
      if (parts.some(c => c.type === 'refusal')) return { text: '', tokensIn, tokensOut, note: 'The model declined this request' }
      const text = parts.flatMap(c => (c.type === 'output_text' && c.text ? [c.text] : [])).join('\n\n')
      const calls = output.filter(o => o.type === 'function_call')
      if (!calls.length)
        return { text, tokensIn, tokensOut, note: data.status === 'incomplete' ? `Incomplete: ${data.incomplete_details?.reason ?? 'unknown'}` : undefined }
      input = []
      for (const c of calls) input.push({ type: 'function_call_output', call_id: c.call_id, output: (await this.callJson(t, c.name, c.arguments)).text })
    }
    return { text: '', tokensIn, tokensOut, note: `Stopped after ${MAX_STEPS} tool rounds` }
  }

  // ── Gemini: OpenAI-compatible Chat Completions ─────────────────────────────
  private async chat(base: string, a: Agent, key: string, t: Turn): Promise<Outcome> {
    const tools = t.tools.map(d => ({ type: 'function', function: { name: d.name, description: d.description, parameters: d.inputSchema } }))
    const messages: unknown[] = [{ role: 'system', content: t.system }, { role: 'user', content: t.prompt }]
    let tokensIn = 0
    let tokensOut = 0
    for (let step = 0; step < MAX_STEPS; step++) {
      if (!t.alive()) return { text: '', tokensIn, tokensOut, note: STOPPED }
      if (tokensIn > RUN_TOKEN_BUDGET) return { text: '', tokensIn, tokensOut, note: OVER }
      const data = (await this.post(`${base}/chat/completions`, key, { model: a.model, messages, tools, ...(a.effort ? { reasoning_effort: a.effort } : {}) })) as {
        choices?: { message?: { content?: string | null; tool_calls?: { id: string; function: { name: string; arguments?: string } }[] }; finish_reason?: string }[]
        usage?: { prompt_tokens?: number; completion_tokens?: number }
      }
      tokensIn += data.usage?.prompt_tokens ?? 0
      tokensOut += data.usage?.completion_tokens ?? 0
      const msg = data.choices?.[0]?.message
      if (!msg) throw new Error('The model returned no message')
      messages.push(msg)
      const calls = msg.tool_calls ?? []
      if (!calls.length) return { text: msg.content ?? '', tokensIn, tokensOut }
      for (const c of calls) messages.push({ role: 'tool', tool_call_id: c.id, content: (await this.callJson(t, c.function.name, c.function.arguments)).text })
    }
    return { text: '', tokensIn, tokensOut, note: `Stopped after ${MAX_STEPS} tool rounds` }
  }

  private async callJson(t: Turn, name: string | undefined, raw: string | undefined) {
    let args: Record<string, unknown>
    try {
      args = JSON.parse(raw || '{}')
    } catch {
      return { text: 'The arguments were not valid JSON', isError: true }
    }
    return t.exec(String(name), args && typeof args === 'object' ? args : {})
  }

  /** JSON POST with two retries on 429 and 5xx. */
  private async post(url: string, key: string, body: unknown): Promise<unknown> {
    for (let attempt = 0; ; attempt++) {
      const res = await this.fetch(url, {
        method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify(body),
        signal: AbortSignal.timeout(CALL_TIMEOUT_MS),
      })
      if (res.ok) return res.json()
      const detail = (await res.text().catch(() => '')).slice(0, 300)
      if (attempt < 2 && (res.status === 429 || res.status >= 500)) {
        await sleep(1000 * 3 ** attempt)
        continue
      }
      throw new Error(`${new URL(url).host} answered ${res.status}: ${detail}`)
    }
  }
}

// ── prompts ─────────────────────────────────────────────────────
function systemPrompt(v: View, a: Agent): string {
  const others = v.store.agents(v.project.id).filter(x => x.id !== a.id && x.enabled)
  return [
    instructions(v),
    `Your role, set by the owner:\n${a.instructions.trim() || 'Help the project move forward. Be concise and concrete.'}`,
    'How your turn works:',
    `- Your final reply is posted automatically to the thread you were woken in, signed "${a.name}". Write it for the people and agents who read that thread. Markdown works.`,
    '- If you have nothing useful to add, reply with exactly NO_REPLY and nothing is posted.',
    '- Use the tools to read more, to post in other folders, or to keep files current. Do not also post your reply with post_message.',
    `- To get another agent to act, mention it with @, only when you need it: agents that keep answering each other are stopped after ${MAX_CHAIN} messages without a human.` +
      (others.length ? ` Agents here: ${others.map(x => `@${handle(x.name)} (${PROVIDERS[x.provider] ?? 'agent'})`).join(', ')}.` : ''),
    '- For work that takes several turns, do one step now and call continue_later to be woken again.',
  ].join('\n')
}

const WHY: Record<string, string> = {
  message: 'A new message arrived in your folder.',
  mention: 'Someone mentioned you.',
  schedule: 'Scheduled check-in. Look for work that is yours, questions nobody answered, or documents that are out of date. If there is nothing, reply NO_REPLY.',
  followup: 'You asked to be woken to continue your work.',
  manual: 'The owner started you by hand.',
}

function userPrompt(v: View, run: Run, at: View['tree'][number]): string {
  const messages = v.store.messages(at.f.id, { limit: 30 }).messages
    .map(m => ({ ...m, body: clip(m.body, 4000, `fetch "message:${m.id}" for the rest`) }))
  const files = v.store.files(at.f.id)
  return [
    `${WHY[run.reason] ?? WHY.manual}${run.trigger_id ? ` The message that woke you is message:${run.trigger_id}.` : ''}${run.note ? `\nNotes: ${run.note}` : ''}`,
    `It is ${when(v.store.now())}. You are in /${at.path}.`,
    `## Thread /${at.path} (latest ${messages.length}, oldest first)\n\n${messages.map(m => `<!-- message:${m.id} -->\n${msgMd(v, m, false)}`).join('\n') || '_Empty._'}`,
    `## Files in /${at.path}\n${files.map(f => `${fileLine(v, f)} · file:${f.id}`).join('\n') || '_None._'}`,
    `## All folders\n${treeMd(v)}`,
  ].join('\n\n')
}
