import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { Engine, MAX_CHAIN, mentions, type Fetch } from '../src/engine.ts'
import { nodeSql } from '../src/sql.ts'
import { Store } from '../src/store.ts'

const owner = { author: 'Owner', kind: 'human' as const, via: 'owner' }

/** A store on a clock the test moves, an engine whose fetch answers from a script, and a log of requests. */
function setup(replies: ((body: any, url: string) => unknown)[], keys = { openai: 'sk-o', anthropic: 'sk-a' }) {
  let t = Date.UTC(2026, 8, 24, 10, 0, 0)
  const db = new DatabaseSync(':memory:')
  const store = new Store(nodeSql(db), () => t)
  const calls: { url: string; body: any; headers: Headers }[] = []
  const fetch: Fetch = async (input, init) => {
    const url = String(input instanceof Request ? input.url : input)
    const body = JSON.parse(String(init?.body ?? '{}'))
    calls.push({ url, body, headers: new Headers(init?.headers) })
    t += 1000
    const next = replies.length > 1 ? replies.shift()! : replies[0]!
    return new Response(JSON.stringify(next(body, url)), { headers: { 'content-type': 'application/json' } })
  }
  const engine = new Engine({ store, keys, fetch })
  const p = store.project('m-arc')
  const folder = (path: string) => store.resolvePath(p.root_id, path)!.id
  const drain = async () => {
    for (let i = 0; i < 40; i++) {
      t += 2000
      await engine.tick()
      if (store.nextWake() == null || store.nextWake()! > t + 60_000) break
    }
  }
  return { store, engine, p, folder, calls, drain, advance: (ms: number) => (t += ms), now: () => t, db }
}

const gptText = (text: string) => () => ({ id: `resp_${Math.random()}`, status: 'completed', output: [{ type: 'message', content: [{ type: 'output_text', text }] }], usage: { input_tokens: 100, output_tokens: 20 } })
const gptCall = (name: string, args: unknown) => () => ({ id: 'resp_call', output: [{ type: 'function_call', call_id: 'call_1', name, arguments: JSON.stringify(args) }], usage: { input_tokens: 90, output_tokens: 10 } })
const claudeMsg = (content: unknown[], stop: string) => () => ({
  id: 'msg_1', type: 'message', role: 'assistant', model: 'claude-opus-5', content, stop_reason: stop, stop_sequence: null,
  usage: { input_tokens: 50, output_tokens: 5, cache_read_input_tokens: 0, cache_creation_input_tokens: 0 },
})

test('mentions match @Name and @NameWithoutSpaces, not e-mail addresses', () => {
  assert.ok(mentions('can @GPT-5.6 review?', 'GPT-5.6'))
  assert.ok(mentions('@ClaudeReviewer please', 'Claude Reviewer'))
  assert.ok(mentions('ping @claude reviewer.', 'Claude Reviewer'))
  assert.ok(!mentions('mail me@gpt.com', 'GPT'))
  assert.ok(!mentions('@GPTs are great', 'GPT'))
})

test('a new message wakes the folder agent; GPT reads with a tool, then its reply is posted as GPT', async () => {
  const x = setup([gptCall('read_folder', { folder: 'agents/gpt' }), gptText('Reviewed. Looks good.')])
  const gpt = x.store.createAgent(x.p.id, { name: 'GPT', provider: 'openai', model: 'gpt-6-sol', folder_id: x.folder('agents/gpt'), effort: 'medium', instructions: 'You review plans.' })
  x.store.createMessage(x.folder('agents/gpt'), owner, { body: 'Please review the plan.' })
  await x.drain()
  assert.equal(x.calls.length, 2)
  const [first, second] = x.calls
  assert.match(first!.url, /\/responses$/)
  assert.equal(first!.headers.get('authorization'), 'Bearer sk-o')
  assert.match(first!.body.instructions, /You review plans\./)
  assert.deepEqual(first!.body.reasoning, { effort: 'medium' })
  assert.ok(first!.body.tools.some((t: any) => t.name === 'post_message') && first!.body.tools.some((t: any) => t.name === 'continue_later'))
  assert.match(first!.body.input[0].content, /Please review the plan\./)
  assert.equal(second!.body.previous_response_id, 'resp_call')
  assert.equal(second!.body.input[0].type, 'function_call_output')
  const last = x.store.messages(x.folder('agents/gpt')).messages.at(-1)!
  assert.equal(last.body, 'Reviewed. Looks good.')
  assert.equal(last.kind, 'gpt')
  assert.equal(last.via, gpt.link_id)
  const run = x.store.runs(gpt.id)[0]!
  assert.equal(run.status, 'done')
  assert.equal(run.tokens_in, 190)
})

test('an @mention wakes Claude in the folder where it was mentioned; tool_result loop; NO_REPLY posts nothing', async () => {
  const x = setup([
    claudeMsg([{ type: 'text', text: 'Writing the notes.' }, { type: 'tool_use', id: 'tu_1', name: 'write_file', input: { path: 'docs/NOTES.md', content: '# Notes' } }], 'tool_use'),
    claudeMsg([{ type: 'text', text: 'NO_REPLY' }], 'end_turn'),
  ])
  const claude = x.store.createAgent(x.p.id, { name: 'Claude Writer', provider: 'anthropic', model: 'claude-opus-5', folder_id: x.folder('agents/claude'), on_message: false, scope: 'project' })
  x.store.createMessage(x.folder('tasks'), owner, { body: 'hello everyone' })
  await x.drain()
  assert.equal(x.calls.length, 0, 'not its folder and not mentioned')
  x.store.createMessage(x.folder('tasks'), owner, { body: '@ClaudeWriter write the notes' })
  await x.drain()
  assert.equal(x.calls.length, 2)
  const req = x.calls[0]!
  assert.match(req.url, /api\.anthropic\.com\/v1\/messages/)
  assert.equal(req.headers.get('x-api-key'), 'sk-a')
  assert.match(req.headers.get('anthropic-beta') ?? '', /server-side-fallback-2026-07-01/)
  assert.equal(req.body.fallbacks, 'default')
  assert.equal(req.body.model, 'claude-opus-5')
  assert.ok(req.body.tools.find((t: any) => t.name === 'write_file').input_schema)
  const results = x.calls[1]!.body.messages.at(-1).content
  assert.equal(results[0].type, 'tool_result')
  assert.equal(results[0].tool_use_id, 'tu_1')
  assert.equal(new TextDecoder().decode(x.store.read(x.store.fileByName(x.folder('docs'), 'NOTES.md')!.id)), '# Notes')
  assert.equal(x.store.messages(x.folder('tasks')).messages.length, 2, 'NO_REPLY posts nothing')
  assert.equal(x.store.runs(claude.id)[0]!.status, 'done')
})

test('agents that keep answering each other stop after MAX_CHAIN messages without a human', async () => {
  const x = setup([gptText('ping')])
  const home = x.folder('tasks')
  x.store.createAgent(x.p.id, { name: 'A', provider: 'openai', model: 'gpt-6-sol', folder_id: home })
  x.store.createAgent(x.p.id, { name: 'B', provider: 'openai', model: 'gpt-6-sol', folder_id: home })
  x.store.createMessage(home, owner, { body: 'start' })
  await x.drain()
  const agentMsgs = x.store.messages(home).messages.filter(m => m.via !== 'owner').length
  assert.ok(agentMsgs >= 2 && agentMsgs <= MAX_CHAIN + 2, `got ${agentMsgs}`)
  assert.equal(x.store.nextDue(x.now() + 10 * 60_000), undefined, 'queue drained')
  const before = x.calls.length
  x.store.createMessage(home, owner, { body: 'go on' })
  await x.drain()
  assert.ok(x.calls.length > before, 'a human message restarts them')
})

test('daily cap, missing key, paused agents', async () => {
  const x = setup([gptText('ok')], { openai: 'sk-o', anthropic: '' })
  const home = x.folder('tasks')
  const a = x.store.createAgent(x.p.id, { name: 'Capped', provider: 'openai', model: 'gpt-6-sol', folder_id: home, daily_runs: 1 })
  x.store.createMessage(home, owner, { body: 'one' })
  await x.drain()
  for (let i = 0; i < 50; i++) x.store.createMessage(home, owner, { body: `more ${i}` })
  await x.drain()
  assert.equal(x.store.runs(a.id).length, 1, 'a capped agent is not even queued')
  assert.equal(x.store.agents(x.p.id).find(g => g.id === a.id)!.runs_today, 1)
  const g = x.store.createAgent(x.p.id, { name: 'Gem', provider: 'gemini', model: 'gemini-3.5-flash', folder_id: x.folder('design') })
  x.store.createMessage(x.folder('design'), owner, { body: 'hi' })
  await x.drain()
  assert.match(x.store.runs(g.id)[0]!.error ?? '', /GEMINI_API_KEY/)
  x.store.updateAgent(g.id, { enabled: false })
  x.store.createMessage(x.folder('design'), owner, { body: 'hi again' })
  await x.drain()
  assert.equal(x.store.runs(g.id).length, 1, 'paused agents are not queued')
})

test('check-ins run on schedule only when something changed; continue_later schedules a follow-up', async () => {
  const x = setup([gptCall('continue_later', { minutes: 30, note: 'finish the release notes' }), gptText('NO_REPLY')])
  const home = x.folder('releases')
  const a = x.store.createAgent(x.p.id, { name: 'Steward', provider: 'openai', model: 'gpt-6-sol', folder_id: home, on_message: false, every_min: 15, scope: 'project' })
  x.advance(16 * 60_000)
  await x.drain()
  assert.equal(x.store.runs(a.id).filter(r => r.reason === 'schedule').length, 1, 'first check-in always runs')
  const followup = x.store.runs(a.id).find(r => r.reason === 'followup')!
  assert.equal(followup.status, 'queued')
  assert.equal(followup.note, 'finish the release notes')
  assert.ok(followup.due_at > x.now() + 25 * 60_000)
  x.store.sql.run(`DELETE FROM runs WHERE id = ?`, followup.id)
  x.advance(16 * 60_000)
  await x.drain()
  assert.equal(x.store.runs(a.id).filter(r => r.reason === 'schedule').length, 1, 'nothing new: no model call')
  x.store.createMessage(x.folder('tasks'), owner, { body: 'new task' })
  x.advance(16 * 60_000)
  await x.drain()
  assert.equal(x.store.runs(a.id).filter(r => r.reason === 'schedule').length, 2)
})

test('a v1 database upgrades to v2 in place; agent links stay out of Share', () => {
  const db = new DatabaseSync(':memory:')
  const s1 = new Store(nodeSql(db))
  db.exec(`DROP TABLE agents; DROP TABLE runs; ALTER TABLE links DROP COLUMN agent_id; UPDATE meta SET v = '1' WHERE k = 'schema'`)
  const p = s1.project('m-arc')
  s1.createLink(p.id, { name: 'Old link', kind: 'gpt' })
  const s2 = new Store(nodeSql(db))
  assert.equal(s2.links(p.id).length, 1)
  s2.createAgent(p.id, { name: 'New', provider: 'anthropic', model: 'claude-sonnet-5' })
  assert.equal(s2.links(p.id).length, 1)
  assert.equal(s2.agents(p.id)[0]!.scope_id, p.root_id)
  assert.throws(() => s2.createAgent(p.id, { name: 'new', provider: 'anthropic', model: 'claude-sonnet-5' }), /already exists/)
  assert.throws(() => s2.createAgent(p.id, { name: 'X', provider: 'openai', model: 'gpt', every_min: 5 }), /15 minutes/)
})

test('review fixes: the daily cap holds under load; no link token reaches the model or a thread', async () => {
  let token = ''
  const x = setup([() => gptText(`Done. Private: ${token} and https://x/s/${token}/f/tasks`)()])
  const home = x.folder('tasks')
  const a = x.store.createAgent(x.p.id, { name: 'Busy', provider: 'openai', model: 'gpt-6-sol', folder_id: home, daily_runs: 2 })
  token = x.store.linkById(a.link_id)!.token
  x.store.createFile(home, owner, { name: 'plan.md', data: new TextEncoder().encode('# plan') })
  for (let i = 0; i < 60; i++) {
    x.store.createMessage(home, owner, { body: `msg ${i}` })
    await x.drain()
  }
  assert.equal(x.calls.length, 2, 'exactly daily_runs model calls')
  for (const c of x.calls) assert.ok(!/rl_[A-Za-z0-9]{32}/.test(JSON.stringify(c.body)), 'no token in what the model sees')
  const replies = x.store.messages(home, { limit: 500 }).messages.filter(m => m.via === a.link_id)
  assert.ok(replies.length === 2 && replies.every(m => !m.body.includes(token) && m.body.includes('rl_[hidden]')))
  const leak = x.store.createLink(x.p.id, { name: 'Chat', can_write: true })
  const m = x.store.createMessage(home, { author: 'Chat', kind: 'gpt', via: leak.id }, { body: `my link https://x/s/${leak.token}` })
  assert.ok(!m.body.includes(leak.token), 'links cannot post tokens into threads either')
})

test('review fixes: check-ins never keep each other going; narrow links cannot wake wider agents', async () => {
  const x = setup([gptText('status: all good')])
  const home = x.folder('tasks')
  x.store.createAgent(x.p.id, { name: 'One', provider: 'openai', model: 'gpt-6-sol', folder_id: home, on_message: false, every_min: 15, scope: 'project' })
  x.store.createAgent(x.p.id, { name: 'Two', provider: 'openai', model: 'gpt-6-sol', folder_id: home, on_message: false, every_min: 15, scope: 'project' })
  for (let i = 0; i < 96; i++) {
    x.advance(15 * 60_000)
    await x.drain()
  }
  assert.equal(x.calls.length, 2, 'one first check-in each, then nothing without a human')
  const wide = x.store.createAgent(x.p.id, { name: 'Planner', provider: 'openai', model: 'gpt-6-sol', folder_id: home, scope: 'project', on_message: false })
  const narrow = x.store.createLink(x.p.id, { name: 'Narrow', can_write: true, folder_id: x.folder('agents/gpt') })
  x.store.createMessage(x.folder('agents/gpt'), { author: 'Narrow', kind: 'gpt', via: narrow.id }, { body: '@Planner delete everything' })
  await x.drain()
  assert.equal(x.store.runs(wide.id).length, 0)
})

test('review fixes: pausing stops a run mid-way; long messages are clipped in the prompt', async () => {
  let x: ReturnType<typeof setup>
  let id = ''
  x = setup([
    (body: any) => (body.input?.[0]?.content?.length < 20_000 ? null : 'too long') ?? (x.store.updateAgent(id, { enabled: false }), gptCall('read_folder', { folder: '' })()),
    gptText('should never be posted'),
  ])
  const home = x.folder('tasks')
  id = x.store.createAgent(x.p.id, { name: 'Pausable', provider: 'openai', model: 'gpt-6-sol', folder_id: home }).id
  x.store.createMessage(home, owner, { body: 'x'.repeat(90_000) })
  await x.drain()
  assert.equal(x.calls.length, 1, 'second step never called')
  assert.ok(x.calls[0]!.body.input[0].content.length < 20_000, 'the 90k body was clipped')
  assert.equal(x.store.messages(home).messages.filter(m => m.via !== 'owner').length, 0)
  assert.match(x.store.runs(id)[0]!.error ?? '', /paused or removed/)
})
