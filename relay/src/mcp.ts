// MCP server per agent link: POST /s/<token>/mcp (Streamable HTTP, stateless, JSON responses).
// Chat apps that cannot send HTTP themselves (Claude.ai, ChatGPT) add this URL once as a connector, then read and
// post through tools. Scope, identity and permissions are the link's; read-only links only list the read tools.
import { HttpError, cleanName, type Author } from './store.ts'
import { json, limited, readBody, type Ctx } from './app.ts'
import { fileLine, folderAt, folderMd, folderUrl, header, msgMd, pathOf, rawUrl, treeMd, view, when, type View } from './agent.ts'
import { KINDS, isText } from '../public/shared.js'

const VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05']
const READ = { readOnlyHint: true, openWorldHint: false }
const str = (description: string) => ({ type: 'string', description })

export const TOOLS = [
  {
    name: 'overview', title: 'Project overview', annotations: READ,
    description: 'Start here. Who you are in this Relay project, what you may do, the folder tree with counts, the latest messages and the file list.',
    inputSchema: { type: 'object', properties: { messages: { type: 'integer', minimum: 1, maximum: 100, description: 'How many recent messages (default 20)' } } },
  },
  {
    name: 'read_folder', title: 'Read a folder', annotations: READ,
    description: 'Messages (oldest first), files and subfolders of one folder. Paths are relative to your link: "agents/claude"; "" is the top.',
    inputSchema: { type: 'object', properties: { folder: str('Folder path, "" for the top'), limit: { type: 'integer', minimum: 1, maximum: 200 } }, required: ['folder'] },
  },
  {
    name: 'search', title: 'Search', annotations: READ,
    description: 'Search message text and file names. Returns ids to pass to fetch.',
    inputSchema: { type: 'object', properties: { query: str('Words to look for') }, required: ['query'] },
  },
  {
    name: 'fetch', title: 'Fetch', annotations: READ,
    description: 'Full content by id: "file:<id>" (text files in full), "message:<id>", "folder:<path>", or a plain path such as "docs/PROJECT_STATE.md".',
    inputSchema: { type: 'object', properties: { id: str('An id from search or overview, or a path') }, required: ['id'] },
  },
  {
    name: 'post_message', title: 'Post a message', write: true,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
    description: 'Post a markdown message to a folder\'s thread: results, hand-offs, questions, answers. It is signed with your link\'s name.',
    inputSchema: {
      type: 'object',
      properties: { folder: str('Folder path, "" for the top'), body: str('Markdown'), author: str('Optional display name, e.g. "Claude · Opus"') },
      required: ['folder', 'body'],
    },
  },
  {
    name: 'write_file', title: 'Create or replace a text file', write: true,
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
    description: 'Create or replace a text file by path, e.g. "docs/PROJECT_STATE.md". Missing folders are created. Replacing overwrites the old content.',
    inputSchema: { type: 'object', properties: { path: str('Folder path and file name'), content: str('Full new content') }, required: ['path', 'content'] },
  },
  {
    name: 'create_folder', title: 'Create a folder', write: true,
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
    description: 'Create a folder (and any missing parents), e.g. "agents/gpt/notes".',
    inputSchema: { type: 'object', properties: { path: str('Folder path') }, required: ['path'] },
  },
]

export const instructions = (v: View) =>
  `Relay is a shared workspace for the project "${v.project.name}". The person and several AI agents work in its folders; each folder has a thread of messages and files. ` +
  `You are "${v.link.name}" (${KINDS[v.link.kind]?.label ?? 'Agent'}) with ${v.link.can_write ? 'read and write' : 'read-only'} access. ` +
  'Call overview first. Read the folder you are working in before you act. ' +
  (v.link.can_write
    ? 'When you finish a step, post the result with post_message to the folder it belongs to, and keep shared documents current with write_file. Never post secrets.'
    : 'You cannot post; answer in the chat.')

const text = (t: string, isError = false) => ({ content: [{ type: 'text', text: t }], ...(isError ? { isError: true } : {}) })
const snippet = (s: string) => s.replace(/\s+/g, ' ').trim().slice(0, 140)

function overview(v: View, n: number): string {
  const messages = v.store.recent(v.scope.id, n)
  const files = v.store.filesUnder(v.scope.id)
  return [
    header(v, `${v.project.name} — overview`),
    `You are **${v.link.name}** (${KINDS[v.link.kind]?.label ?? 'Agent'}), ${v.link.can_write ? 'read + write: post_message, write_file, create_folder' : 'read only'}. Paths are relative to your link.`,
    `## Folders\n${treeMd(v)}`,
    `## Latest ${messages.length} messages (oldest first)\n\n${messages.map(m => `<!-- message:${m.id} -->\n${msgMd(v, m, true)}`).join('\n') || '_No messages yet._'}`,
    `## Files (fetch "file:<id>" or the path)\n${files.map(f => `${fileLine(v, f)} · file:${f.id}`).join('\n') || '_No files._'}`,
  ].join('\n\n')
}

function fetchItem(v: View, id: string) {
  const inScope = (folderId: string) => v.tree.some(t => t.f.id === folderId)
  const fileDoc = (fid: string) => {
    const f = v.store.file(fid)
    if (!inScope(f.folder_id)) throw new HttpError(404, 'Not found in this link')
    const path = pathOf(v, f.folder_id)
    const body = isText(f.name, f.mime)
      ? f.size > 512 * 1024 ? `(${f.size} bytes; too large to show in full. Download: ${rawUrl(v, f)})` : new TextDecoder().decode(v.store.read(f.id))
      : `(binary ${f.mime}, ${f.size} bytes. Download: ${rawUrl(v, f)})`
    return { id: `file:${f.id}`, title: `${path ? path + '/' : ''}${f.name}`, text: body, url: rawUrl(v, f), metadata: { author: f.author, updated: when(f.updated_at), size: f.size } }
  }
  if (id.startsWith('file:')) return fileDoc(id.slice(5))
  if (id.startsWith('message:')) {
    const m = v.store.message(id.slice(8))
    if (!inScope(m.folder_id)) throw new HttpError(404, 'Not found in this link')
    const path = pathOf(v, m.folder_id)
    return { id, title: `${m.author} in /${path}`, text: msgMd(v, m, true), url: `${folderUrl(v, path)}#m-${m.id}`, metadata: { author: m.author, kind: m.kind, at: when(m.created_at) } }
  }
  const path = id.startsWith('folder:') ? id.slice(7) : id
  if (!id.startsWith('folder:')) {
    const parts = path.split('/').filter(Boolean)
    const name = parts.pop()
    const folder = name ? v.store.resolvePath(v.scope.id, parts.join('/')) : undefined
    const f = folder && name ? v.store.fileByName(folder.id, name) : undefined
    if (f) return fileDoc(f.id)
  }
  const at = folderAt(v, path)
  return { id: `folder:${at.path}`, title: `/${at.path}`, text: folderMd(v, at, false), url: folderUrl(v, at.path), metadata: {} }
}

/** Runs one tool for a link. Shared by MCP clients and the agent engine. */
export async function callTool(v: View, name: string, a: Record<string, unknown>) {
  const tool = TOOLS.find(t => t.name === name)
  if (!tool) return null
  if (tool.write) {
    if (!v.link.can_write) return text('This link is read-only. Answer in the chat instead.', true)
    if (limited(`link:${v.link.id}`, 120, 60_000)) return text('Too many writes. Wait a minute.', true)
  }
  const who = (): Author => ({ author: a.author ? cleanName(a.author, 'Author', 60) : v.link.name, kind: v.link.kind, via: v.link.id })
  switch (name) {
    case 'overview':
      return text(overview(v, Math.min(Math.max(Number(a.messages) || 20, 1), 100)))
    case 'read_folder': {
      const at = folderAt(v, a.folder ?? '')
      return text(folderMd(v, at, false))
    }
    case 'search': {
      const q = String(a.query ?? '').trim().slice(0, 100)
      if (q.length < 2) return text(JSON.stringify({ results: [] }))
      const r = v.store.search(q, v.scope.id)
      const results = [
        ...r.messages.map(m => ({ id: `message:${m.id}`, title: `${m.author} in /${pathOf(v, m.folder_id)}: ${snippet(m.body)}`, url: `${folderUrl(v, pathOf(v, m.folder_id))}#m-${m.id}` })),
        ...r.files.map(f => ({ id: `file:${f.id}`, title: `${pathOf(v, f.folder_id) ? pathOf(v, f.folder_id) + '/' : ''}${f.name}`, url: rawUrl(v, f) })),
      ]
      return text(JSON.stringify({ results }))
    }
    case 'fetch':
      return text(JSON.stringify(fetchItem(v, String(a.id ?? ''))))
    case 'post_message': {
      const at = folderAt(v, a.folder ?? '')
      const m = v.store.createMessage(at.f.id, who(), { body: a.body })
      return text(`Posted to /${at.path} as ${m.author} (message:${m.id}). ${folderUrl(v, at.path)}#m-${m.id}`)
    }
    case 'write_file': {
      const parts = String(a.path ?? '').split('/').filter(Boolean)
      const fname = cleanName(parts.pop(), 'File name', 200)
      const content = String(a.content ?? '')
      if (content.length > 2_000_000) return text('Content is larger than 2 MB. Split it into smaller files.', true)
      const folder = v.store.ensurePath(v.scope.id, parts.join('/'))
      const { file, created } = v.store.putFile(folder.id, who(), { name: fname, data: new TextEncoder().encode(content) })
      return text(`${created ? 'Created' : 'Replaced'} ${parts.length ? parts.join('/') + '/' : ''}${file.name} (${file.size} bytes, file:${file.id}).`)
    }
    case 'create_folder': {
      const f = v.store.ensurePath(v.scope.id, a.path)
      return text(`Folder /${v.store.pathOf(f.id, v.scope.id)} is ready.`)
    }
  }
  return null
}

type Rpc = { jsonrpc?: string; id?: string | number | null; method?: string; params?: Record<string, unknown> }
const reply = (id: Rpc['id'], result: unknown) => ({ jsonrpc: '2.0', id, result })
const fail = (id: Rpc['id'], code: number, message: string) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } })

async function dispatch(v: View, m: Rpc) {
  const isNote = m.id === undefined
  if (m.jsonrpc !== '2.0' || typeof m.method !== 'string') return isNote ? null : fail(m.id, -32600, 'Invalid request')
  const p = m.params ?? {}
  switch (m.method) {
    case 'initialize': {
      const asked = String(p.protocolVersion ?? '')
      return reply(m.id, {
        protocolVersion: VERSIONS.includes(asked) ? asked : VERSIONS[1],
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'relay', title: `Relay · ${v.project.name}`, version: '1.1.0' },
        instructions: instructions(v),
      })
    }
    case 'ping':
      return isNote ? null : reply(m.id, {})
    case 'tools/list':
      return reply(m.id, { tools: TOOLS.filter(t => !t.write || v.link.can_write).map(({ write: _w, ...t }) => t) })
    case 'tools/call': {
      const name = String(p.name ?? '')
      const args = (p.arguments && typeof p.arguments === 'object' ? p.arguments : {}) as Record<string, unknown>
      try {
        const out = await callTool(v, name, args)
        return out ? reply(m.id, out) : fail(m.id, -32602, `Unknown tool: ${name}`)
      } catch (e) {
        if (e instanceof HttpError) return reply(m.id, text(e.message, true))
        throw e
      }
    }
    default:
      if (isNote) return null
      return fail(m.id, -32601, `Method not found: ${m.method}`)
  }
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type, accept, authorization, mcp-protocol-version, mcp-session-id, last-event-id',
  'Access-Control-Expose-Headers': 'mcp-session-id',
}
const withCors = (res: Response) => {
  for (const [k, val] of Object.entries(CORS)) res.headers.set(k, val)
  return res
}

export async function mcpRoute(c: Ctx): Promise<Response> {
  if (c.req.method === 'OPTIONS') return withCors(new Response(null, { status: 204 }))
  const token = c.url.pathname.split('/')[2] ?? ''
  const v = view(c.store, c.url.origin, token)
  if (c.req.method !== 'POST')
    return withCors(new Response('Relay MCP endpoint: send JSON-RPC with POST (Streamable HTTP).\n', { status: 405, headers: { Allow: 'POST, OPTIONS', 'Content-Type': 'text/plain' } }))
  let msg: unknown
  try {
    msg = JSON.parse(new TextDecoder().decode(await readBody(c.req, 4 * 1048576)))
  } catch (e) {
    if (e instanceof HttpError) throw e
    return withCors(json(fail(null, -32700, 'Parse error'), 400))
  }
  const batch = (Array.isArray(msg) ? msg : [msg]).slice(0, 50) as Rpc[]
  const out = []
  for (const m of batch) {
    const r = await dispatch(v, m && typeof m === 'object' ? m : {})
    if (r) out.push(r)
  }
  if (!out.length) return withCors(new Response(null, { status: 202 }))
  return withCors(json(Array.isArray(msg) ? out : out[0]))
}
