import type { Sql, Val } from './sql.ts'
import { KINDS, mimeFor } from '../public/shared.js'

export type Kind = 'human' | 'claude' | 'gpt' | 'gemini' | 'agent'

export interface Project { id: string; slug: string; name: string; description: string; root_id: string; created_at: number; updated_at: number }
export interface ProjectStat extends Project { messages: number; files: number; last_at: number }
export interface Folder { id: string; project_id: string; parent_id: string | null; name: string; created_at: number }
export interface FolderStat extends Folder { messages: number; files: number; last_at: number }
export interface FileMeta {
  id: string; project_id: string; folder_id: string; message_id: string | null; name: string; mime: string; size: number
  author: string; kind: Kind; via: string; created_at: number; updated_at: number
}
export interface Message {
  id: string; project_id: string; folder_id: string; author: string; kind: Kind; body: string; via: string
  created_at: number; edited_at: number | null; files: FileMeta[]
}
export interface Link {
  id: string; token: string; project_id: string; folder_id: string; name: string; kind: Kind; can_write: number
  created_at: number; last_used_at: number | null
}
export interface Author { author: string; kind: Kind; via: string }
export interface Agent {
  id: string; project_id: string; link_id: string; name: string; kind: Kind; provider: string; model: string; effort: string
  instructions: string; folder_id: string; on_message: number; on_mention: number; every_min: number; daily_runs: number
  enabled: number; next_at: number | null; created_at: number; updated_at: number; day_start: number; day_runs: number
}
export interface AgentStat extends Agent { scope_id: string; runs_today: number; last_status: string | null; last_error: string | null; last_at: number | null }
export interface Run {
  id: string; agent_id: string; project_id: string; folder_id: string; reason: string; trigger_id: string | null; note: string
  status: string; due_at: number; started_at: number | null; finished_at: number | null; tokens_in: number; tokens_out: number; error: string | null
}
/** Model providers Relay can run agents on, and the author kind their messages carry. */
export const PROVIDERS: Record<string, Kind> = { openai: 'gpt', anthropic: 'claude', gemini: 'gemini' }

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const CHUNK = 1 << 20
const SCHEMA = 2
// Durable Object SQLite allows 100 bound parameters per statement and 50-byte LIKE patterns.
const BATCH = 90
export const MAX_DEPTH = 24
export const MAX_FOLDERS = 2000
const SUBTREE = `WITH RECURSIVE t(id) AS (SELECT ? UNION ALL SELECT f.id FROM folders f JOIN t ON f.parent_id = t.id)`

function batched<T>(ids: string[], fn: (part: string[], marks: string) => T[]): T[] {
  const out: T[] = []
  for (let i = 0; i < ids.length; i += BATCH) {
    const part = ids.slice(i, i + BATCH)
    out.push(...fn(part, part.map(() => '?').join(',')))
  }
  return out
}
export const TEMPLATES: Record<string, string[]> = {
  software: ['agents', 'agents/claude', 'agents/gpt', 'agents/handoffs', 'docs', 'docs/architecture', 'docs/decisions', 'design', 'tasks', 'releases'],
  empty: [],
}

const ALPHA = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
export function randomId(n = 12, alphabet = ALPHA.slice(0, 36)): string {
  const bytes = crypto.getRandomValues(new Uint8Array(n))
  let s = ''
  for (const b of bytes) s += alphabet[b % alphabet.length]
  return s
}
export const newToken = () => 'rl_' + randomId(32, ALPHA.slice(0, 62))

export const asKind = (k: unknown): Kind => (typeof k === 'string' && k in KINDS ? (k as Kind) : 'agent')

/** Names never contain control characters; folder and file names also never contain slashes (they are path segments). */
export function cleanName(v: unknown, what = 'Name', max = 120, slashes = false): string {
  const s = String(v ?? '').replace(slashes ? /[\u0000-\u001f\u007f]/g : /[\u0000-\u001f\u007f/\\]/g, '').replace(/\s+/g, ' ').trim()
  if (!s || s === '.' || s === '..') throw new HttpError(400, `${what} is empty or invalid`)
  if (s.length > max) throw new HttpError(400, `${what} is longer than ${max} characters`)
  return s
}

export function cleanBody(v: unknown, allowEmpty = false): string {
  const s = String(v ?? '').replace(/\r\n?/g, '\n').replace(/\s+$/, '')
  if (!s.trim() && !allowEmpty) throw new HttpError(400, 'Message is empty')
  if (s.length > 100_000) throw new HttpError(413, 'Message is longer than 100,000 characters')
  return s
}

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'project'

/** Split a user path like "agents/claude/" into clean segments. */
export function segments(path: unknown): string[] {
  const parts = String(path ?? '').split('/').map(s => s.trim()).filter(Boolean)
  if (parts.length > 16) throw new HttpError(400, 'Paths are limited to 16 folders deep')
  return parts.map(s => cleanName(s, 'Folder name'))
}

export class Store {
  sql: Sql
  now: () => number
  /** Called after every new message (the agent engine listens here). */
  onMessage?: (m: Message) => void
  private origin_?: string

  constructor(sql: Sql, now: () => number = Date.now) {
    this.sql = sql
    this.now = now
    this.migrate()
  }

  private migrate() {
    const s = this.sql
    s.script(`CREATE TABLE IF NOT EXISTS meta (k TEXT PRIMARY KEY, v TEXT NOT NULL)`)
    const v = Number(s.get<{ v: string }>(`SELECT v FROM meta WHERE k='schema'`)?.v ?? 0)
    if (v >= SCHEMA) return
    s.tx(() => {
      if (v < 1) s.script(`
        CREATE TABLE IF NOT EXISTS projects (id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '', root_id TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS folders (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, parent_id TEXT, name TEXT NOT NULL,
          created_at INTEGER NOT NULL);
        CREATE INDEX IF NOT EXISTS folders_project ON folders(project_id);
        CREATE UNIQUE INDEX IF NOT EXISTS folders_name ON folders(parent_id, name COLLATE NOCASE);
        CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, folder_id TEXT NOT NULL,
          author TEXT NOT NULL, kind TEXT NOT NULL, body TEXT NOT NULL, via TEXT NOT NULL, created_at INTEGER NOT NULL, edited_at INTEGER);
        CREATE INDEX IF NOT EXISTS messages_folder ON messages(folder_id, created_at);
        CREATE INDEX IF NOT EXISTS messages_project ON messages(project_id, created_at);
        CREATE TABLE IF NOT EXISTS files (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, folder_id TEXT NOT NULL, message_id TEXT,
          name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, author TEXT NOT NULL, kind TEXT NOT NULL, via TEXT NOT NULL,
          created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
        CREATE UNIQUE INDEX IF NOT EXISTS files_name ON files(folder_id, name COLLATE NOCASE);
        CREATE INDEX IF NOT EXISTS files_message ON files(message_id);
        CREATE INDEX IF NOT EXISTS files_project ON files(project_id);
        CREATE TABLE IF NOT EXISTS chunks (file_id TEXT NOT NULL, idx INTEGER NOT NULL, data BLOB NOT NULL, PRIMARY KEY (file_id, idx));
        CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, token TEXT NOT NULL UNIQUE, project_id TEXT NOT NULL, folder_id TEXT NOT NULL,
          name TEXT NOT NULL, kind TEXT NOT NULL, can_write INTEGER NOT NULL, created_at INTEGER NOT NULL, last_used_at INTEGER);
      `)
      if (v < 2) {
        s.script(`
          CREATE TABLE IF NOT EXISTS agents (id TEXT PRIMARY KEY, project_id TEXT NOT NULL, link_id TEXT NOT NULL, name TEXT NOT NULL,
            kind TEXT NOT NULL, provider TEXT NOT NULL, model TEXT NOT NULL, effort TEXT NOT NULL DEFAULT '', instructions TEXT NOT NULL DEFAULT '',
            folder_id TEXT NOT NULL, on_message INTEGER NOT NULL DEFAULT 1, on_mention INTEGER NOT NULL DEFAULT 1, every_min INTEGER NOT NULL DEFAULT 0,
            daily_runs INTEGER NOT NULL DEFAULT 30, enabled INTEGER NOT NULL DEFAULT 1, next_at INTEGER, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL,
            day_start INTEGER NOT NULL DEFAULT 0, day_runs INTEGER NOT NULL DEFAULT 0);
          CREATE INDEX IF NOT EXISTS agents_project ON agents(project_id);
          CREATE TABLE IF NOT EXISTS runs (id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, project_id TEXT NOT NULL, folder_id TEXT NOT NULL,
            reason TEXT NOT NULL, trigger_id TEXT, note TEXT NOT NULL DEFAULT '', status TEXT NOT NULL, due_at INTEGER NOT NULL,
            started_at INTEGER, finished_at INTEGER, tokens_in INTEGER NOT NULL DEFAULT 0, tokens_out INTEGER NOT NULL DEFAULT 0, error TEXT);
          CREATE INDEX IF NOT EXISTS runs_queue ON runs(status, due_at);
          CREATE INDEX IF NOT EXISTS runs_agent ON runs(agent_id, due_at);
          ALTER TABLE links ADD COLUMN agent_id TEXT;
        `)
      }
      s.run(`INSERT OR REPLACE INTO meta (k, v) VALUES ('schema', ?)`, String(SCHEMA))
      s.run(`INSERT OR IGNORE INTO meta (k, v) VALUES ('seq', '0')`)
      if (v === 0 && !s.get(`SELECT 1 FROM projects`)) {
        const p = this.createProject({ name: 'M/ARC', description: 'Workout, recovery and coaching tracker (Android / PWA).', template: 'software' })
        const owner: Author = { author: 'Relay', kind: 'agent', via: 'owner' }
        this.createMessage(p.root_id, owner, {
          body:
            'Welcome to **M/ARC** on Relay.\n\n- Every folder has a **Thread** and **Files**. Drop files anywhere.\n' +
            '- **Share** creates a link for Claude, GPT or any agent: read-only, or read + write.\n' +
            '- Chat apps reply on their own once connected: **Share → Connector**.\n' +
            '- **Agents** (GPT, Claude, Gemini) can be assigned to a folder: Relay runs them when there is work.',
        })
      }
    })
  }

  // ── change counter ───────────────────────────────────────────
  seq(): number {
    return Number(this.sql.get<{ v: string }>(`SELECT v FROM meta WHERE k='seq'`)?.v ?? 0)
  }
  private bump() {
    this.sql.run(`UPDATE meta SET v = CAST(CAST(v AS INTEGER) + 1 AS TEXT) WHERE k='seq'`)
  }

  // ── projects ────────────────────────────────────────────────
  projects(): ProjectStat[] {
    return this.sql.all<ProjectStat>(`
      SELECT p.*,
        (SELECT COUNT(*) FROM messages m WHERE m.project_id = p.id) AS messages,
        (SELECT COUNT(*) FROM files f WHERE f.project_id = p.id) AS files,
        MAX(p.updated_at, IFNULL((SELECT MAX(created_at) FROM messages m WHERE m.project_id = p.id), 0),
            IFNULL((SELECT MAX(updated_at) FROM files f WHERE f.project_id = p.id), 0)) AS last_at
      FROM projects p ORDER BY p.name COLLATE NOCASE`)
  }

  project(idOrSlug: string): Project {
    const p = this.sql.get<Project>(`SELECT * FROM projects WHERE id = ? OR slug = ?`, idOrSlug, idOrSlug)
    if (!p) throw new HttpError(404, 'Project not found')
    return p
  }

  createProject(input: { name?: unknown; description?: unknown; template?: unknown }): Project {
    const name = cleanName(input.name, 'Project name', 80, true)
    const description = String(input.description ?? '').trim().slice(0, 500)
    const paths = TEMPLATES[String(input.template ?? 'software')] ?? []
    return this.sql.tx(() => {
      const base = slugify(name)
      let slug = base
      for (let n = 2; this.sql.get(`SELECT 1 FROM projects WHERE slug = ?`, slug); n++) slug = `${base}-${n}`
      const t = this.now()
      const id = randomId()
      const root_id = randomId()
      this.sql.run(`INSERT INTO folders (id, project_id, parent_id, name, created_at) VALUES (?, ?, NULL, ?, ?)`, root_id, id, name, t)
      this.sql.run(
        `INSERT INTO projects (id, slug, name, description, root_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        id, slug, name, description, root_id, t, t,
      )
      for (const p of paths) this.ensurePath(root_id, p)
      this.bump()
      return this.project(id)
    })
  }

  updateProject(id: string, input: { name?: unknown; description?: unknown }): Project {
    const p = this.project(id)
    const name = input.name === undefined ? p.name : cleanName(input.name, 'Project name', 80, true)
    const description = input.description === undefined ? p.description : String(input.description).trim().slice(0, 500)
    this.sql.tx(() => {
      this.sql.run(`UPDATE projects SET name = ?, description = ?, updated_at = ? WHERE id = ?`, name, description, this.now(), p.id)
      this.sql.run(`UPDATE folders SET name = ? WHERE id = ?`, name, p.root_id)
      this.bump()
    })
    return this.project(p.id)
  }

  deleteProject(id: string) {
    const p = this.project(id)
    this.sql.tx(() => {
      this.sql.run(`DELETE FROM chunks WHERE file_id IN (SELECT id FROM files WHERE project_id = ?)`, p.id)
      for (const t of ['files', 'messages', 'links', 'folders', 'agents', 'runs']) this.sql.run(`DELETE FROM ${t} WHERE project_id = ?`, p.id)
      this.sql.run(`DELETE FROM projects WHERE id = ?`, p.id)
      this.bump()
    })
  }

  // ── folders ─────────────────────────────────────────────────
  folders(projectId: string): FolderStat[] {
    return this.sql.all<FolderStat>(`
      SELECT f.*,
        (SELECT COUNT(*) FROM messages m WHERE m.folder_id = f.id) AS messages,
        (SELECT COUNT(*) FROM files x WHERE x.folder_id = f.id) AS files,
        MAX(IFNULL((SELECT MAX(created_at) FROM messages m WHERE m.folder_id = f.id), 0),
            IFNULL((SELECT MAX(updated_at) FROM files x WHERE x.folder_id = f.id), 0)) AS last_at
      FROM folders f WHERE f.project_id = ? ORDER BY f.name COLLATE NOCASE`, projectId)
  }

  folder(id: string): Folder {
    const f = this.sql.get<Folder>(`SELECT * FROM folders WHERE id = ?`, id)
    if (!f) throw new HttpError(404, 'Folder not found')
    return f
  }

  /** The folder and every folder below it. */
  subtree(rootId: string): string[] {
    return this.sql.all<{ id: string }>(`${SUBTREE} SELECT id FROM t`, rootId).map(r => r.id)
  }

  /** Levels above a folder (the project root is 0). */
  depth(id: string): number {
    let n = 0
    for (let f = this.folder(id); f.parent_id; f = this.folder(f.parent_id)) n++
    return n
  }

  /** Levels below a folder (a leaf is 0). */
  height(id: string): number {
    return Number(this.sql.get<{ h: number }>(
      `WITH RECURSIVE t(id, d) AS (SELECT ?, 0 UNION ALL SELECT f.id, t.d + 1 FROM folders f JOIN t ON f.parent_id = t.id) SELECT MAX(d) AS h FROM t`, id)?.h ?? 0)
  }

  /** "a/b" below rootId → path segments relative to rootId; '' for the root itself. */
  pathOf(folderId: string, rootId: string): string {
    const parts: string[] = []
    let f = this.folder(folderId)
    while (f.id !== rootId) {
      parts.unshift(f.name)
      if (!f.parent_id) throw new HttpError(403, 'Outside this link')
      f = this.folder(f.parent_id)
    }
    return parts.join('/')
  }

  resolvePath(rootId: string, path: unknown): Folder | undefined {
    let f: Folder | undefined = this.folder(rootId)
    for (const seg of segments(path)) {
      f = this.sql.get<Folder>(`SELECT * FROM folders WHERE parent_id = ? AND name = ? COLLATE NOCASE`, f.id, seg)
      if (!f) return undefined
    }
    return f
  }

  ensurePath(rootId: string, path: unknown): Folder {
    const segs = segments(path)
    return this.sql.tx(() => {
      let f = this.folder(rootId)
      for (const seg of segs) {
        const next = this.sql.get<Folder>(`SELECT * FROM folders WHERE parent_id = ? AND name = ? COLLATE NOCASE`, f.id, seg)
        f = next ?? this.createFolder(f.id, seg)
      }
      return f
    })
  }

  createFolder(parentId: string, rawName: unknown): Folder {
    const parent = this.folder(parentId)
    const name = cleanName(rawName, 'Folder name', 80)
    if (this.depth(parent.id) + 1 > MAX_DEPTH) throw new HttpError(400, `Folders nest at most ${MAX_DEPTH} levels`)
    const count = Number(this.sql.get<{ n: number }>(`SELECT COUNT(*) AS n FROM folders WHERE project_id = ?`, parent.project_id)?.n ?? 0)
    if (count >= MAX_FOLDERS) throw new HttpError(400, `A project holds at most ${MAX_FOLDERS} folders`)
    return this.sql.tx(() => {
      if (this.sql.get(`SELECT 1 FROM folders WHERE parent_id = ? AND name = ? COLLATE NOCASE`, parent.id, name))
        throw new HttpError(409, `“${name}” already exists here`)
      const id = randomId()
      this.sql.run(`INSERT INTO folders (id, project_id, parent_id, name, created_at) VALUES (?, ?, ?, ?, ?)`, id, parent.project_id, parent.id, name, this.now())
      this.bump()
      return this.folder(id)
    })
  }

  updateFolder(id: string, input: { name?: unknown; parent_id?: unknown }): Folder {
    const f = this.folder(id)
    if (!f.parent_id) throw new HttpError(400, 'Rename the project to rename its root folder')
    const name = input.name === undefined ? f.name : cleanName(input.name, 'Folder name', 80)
    const parentId = input.parent_id === undefined ? f.parent_id : String(input.parent_id)
    const parent = this.folder(parentId)
    if (parent.project_id !== f.project_id) throw new HttpError(400, 'Folders cannot move between projects')
    if (this.subtree(f.id).includes(parent.id)) throw new HttpError(400, 'A folder cannot move inside itself')
    if (this.depth(parent.id) + 1 + this.height(f.id) > MAX_DEPTH) throw new HttpError(400, `Folders nest at most ${MAX_DEPTH} levels`)
    return this.sql.tx(() => {
      if (this.sql.get(`SELECT 1 FROM folders WHERE parent_id = ? AND name = ? COLLATE NOCASE AND id != ?`, parent.id, name, f.id))
        throw new HttpError(409, `“${name}” already exists there`)
      this.sql.run(`UPDATE folders SET name = ?, parent_id = ? WHERE id = ?`, name, parent.id, f.id)
      this.bump()
      return this.folder(f.id)
    })
  }

  deleteFolder(id: string) {
    const f = this.folder(id)
    if (!f.parent_id) throw new HttpError(400, 'Delete the project to delete its root folder')
    const ids = this.subtree(f.id)
    this.sql.tx(() => {
      for (const id of ids) {
        for (const a of this.sql.all<{ id: string }>(
          `SELECT a.id FROM agents a LEFT JOIN links l ON l.id = a.link_id WHERE a.folder_id = ? OR l.folder_id = ?`, id, id))
          this.dropAgent(a.id)
        this.sql.run(`DELETE FROM chunks WHERE file_id IN (SELECT id FROM files WHERE folder_id = ?)`, id)
        for (const t of ['files', 'messages', 'links']) this.sql.run(`DELETE FROM ${t} WHERE folder_id = ?`, id)
        this.sql.run(`DELETE FROM folders WHERE id = ?`, id)
      }
      this.bump()
    })
  }

  // ── messages ────────────────────────────────────────────────
  private withFiles(rows: Omit<Message, 'files'>[]): Message[] {
    if (!rows.length) return []
    const files = batched(rows.map(r => r.id), (part, marks) =>
      this.sql.all<FileMeta>(`SELECT * FROM files WHERE message_id IN (${marks}) ORDER BY created_at`, ...part))
    return rows.map(r => ({ ...r, files: files.filter(f => f.message_id === r.id) }))
  }

  /** Oldest first. `before` pages backwards. */
  messages(folderId: string, opts: { before?: number; limit?: number } = {}): { messages: Message[]; more: boolean } {
    const limit = Math.min(Math.max(opts.limit ?? 100, 1), 500)
    const rows = this.sql.all<Omit<Message, 'files'>>(
      `SELECT * FROM messages WHERE folder_id = ? AND created_at < ? ORDER BY created_at DESC, id DESC LIMIT ?`,
      folderId, opts.before ?? Number.MAX_SAFE_INTEGER, limit + 1,
    )
    const more = rows.length > limit
    return { messages: this.withFiles(rows.slice(0, limit).reverse()), more }
  }

  /** Latest messages in a folder and everything below it (optionally leaving one folder out), oldest first. */
  recent(rootId: string, limit = 30, except = ''): Message[] {
    const rows = this.sql.all<Omit<Message, 'files'>>(
      `${SUBTREE} SELECT m.* FROM messages m WHERE m.folder_id IN (SELECT id FROM t) AND m.folder_id != ?
       ORDER BY m.created_at DESC, m.id DESC LIMIT ?`,
      rootId, except, limit,
    )
    return this.withFiles(rows.reverse())
  }

  message(id: string): Message {
    const m = this.sql.get<Omit<Message, 'files'>>(`SELECT * FROM messages WHERE id = ?`, id)
    if (!m) throw new HttpError(404, 'Message not found')
    return this.withFiles([m])[0] as Message
  }

  createMessage(folderId: string, who: Author, input: { body?: unknown; file_ids?: unknown }): Message {
    const folder = this.folder(folderId)
    const fileIds = Array.isArray(input.file_ids) ? input.file_ids.map(String).slice(0, 50) : []
    // A link's messages never carry a link token (a write key) into a thread others read.
    const body = who.via === 'owner' ? cleanBody(input.body, fileIds.length > 0) : cleanBody(input.body, fileIds.length > 0).replace(/rl_[A-Za-z0-9]{32}/g, 'rl_[hidden]')
    const m = this.sql.tx(() => {
      const id = randomId()
      const t = this.now()
      this.sql.run(
        `INSERT INTO messages (id, project_id, folder_id, author, kind, body, via, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id, folder.project_id, folder.id, who.author, who.kind, body, who.via, t,
      )
      for (const fid of fileIds) {
        const f = this.file(fid)
        if (f.project_id !== folder.project_id || f.message_id) throw new HttpError(400, 'Attachment belongs elsewhere')
        if (f.folder_id !== folder.id) this.moveFile(f, folder.id)
        this.sql.run(`UPDATE files SET message_id = ? WHERE id = ?`, id, f.id)
      }
      this.bump()
      return this.message(id)
    })
    try {
      this.onMessage?.(m)
    } catch (e) {
      console.error('message hook failed', e)
    }
    return m
  }

  updateMessage(id: string, body: unknown): Message {
    const m = this.message(id)
    this.sql.tx(() => {
      this.sql.run(`UPDATE messages SET body = ?, edited_at = ? WHERE id = ?`, cleanBody(body, m.files.length > 0), this.now(), m.id)
      this.bump()
    })
    return this.message(m.id)
  }

  /** Attachments stay in the folder's files. */
  deleteMessage(id: string) {
    const m = this.message(id)
    this.sql.tx(() => {
      this.sql.run(`UPDATE files SET message_id = NULL WHERE message_id = ?`, m.id)
      this.sql.run(`DELETE FROM messages WHERE id = ?`, m.id)
      this.bump()
    })
  }

  // ── files ───────────────────────────────────────────────────
  files(folderId: string): FileMeta[] {
    return this.sql.all<FileMeta>(`SELECT * FROM files WHERE folder_id = ? ORDER BY name COLLATE NOCASE`, folderId)
  }

  /** Files in a folder and everything below it. */
  filesUnder(rootId: string): FileMeta[] {
    return this.sql.all<FileMeta>(`${SUBTREE} SELECT x.* FROM files x WHERE x.folder_id IN (SELECT id FROM t) ORDER BY x.name COLLATE NOCASE`, rootId)
  }

  file(id: string): FileMeta {
    const f = this.sql.get<FileMeta>(`SELECT * FROM files WHERE id = ?`, id)
    if (!f) throw new HttpError(404, 'File not found')
    return f
  }

  fileByName(folderId: string, name: string): FileMeta | undefined {
    return this.sql.get<FileMeta>(`SELECT * FROM files WHERE folder_id = ? AND name = ? COLLATE NOCASE`, folderId, name)
  }

  read(id: string): Uint8Array {
    const parts = this.sql.all<{ data: Uint8Array }>(`SELECT data FROM chunks WHERE file_id = ? ORDER BY idx`, id).map(r => r.data)
    const out = new Uint8Array(parts.reduce((n, p) => n + p.byteLength, 0))
    let o = 0
    for (const p of parts) {
      out.set(p, o)
      o += p.byteLength
    }
    return out
  }

  private writeChunks(id: string, data: Uint8Array) {
    this.sql.run(`DELETE FROM chunks WHERE file_id = ?`, id)
    for (let i = 0, idx = 0; i < data.byteLength || idx === 0; i += CHUNK, idx++)
      this.sql.run(`INSERT INTO chunks (file_id, idx, data) VALUES (?, ?, ?)`, id, idx, data.subarray(i, i + CHUNK) as Val)
  }

  /** A free name in the folder: "notes.md" → "notes (2).md". */
  private freeName(folderId: string, name: string, except = ''): string {
    const dot = name.lastIndexOf('.')
    const [stem, ext] = dot > 0 ? [name.slice(0, dot), name.slice(dot)] : [name, '']
    let candidate = name
    for (let n = 2; this.sql.get(`SELECT 1 FROM files WHERE folder_id = ? AND name = ? COLLATE NOCASE AND id != ?`, folderId, candidate, except); n++)
      candidate = `${stem} (${n})${ext}`
    return candidate
  }

  createFile(folderId: string, who: Author, input: { name: unknown; mime?: string; data: Uint8Array }): FileMeta {
    const folder = this.folder(folderId)
    const clean = cleanName(input.name, 'File name', 200)
    const mime = input.mime && /^[\w.+-]+\/[\w.+-]+$/.test(input.mime) ? input.mime : mimeFor(clean)
    return this.sql.tx(() => {
      const id = randomId()
      const t = this.now()
      const name = this.freeName(folder.id, clean)
      this.sql.run(
        `INSERT INTO files (id, project_id, folder_id, message_id, name, mime, size, author, kind, via, created_at, updated_at)
         VALUES (?, ?, ?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, folder.project_id, folder.id, name, mime, input.data.byteLength, who.author, who.kind, who.via, t, t,
      )
      this.writeChunks(id, input.data)
      this.bump()
      return this.file(id)
    })
  }

  writeFile(id: string, data: Uint8Array, who?: Author): FileMeta {
    const f = this.file(id)
    this.sql.tx(() => {
      this.writeChunks(f.id, data)
      this.sql.run(`UPDATE files SET size = ?, updated_at = ? WHERE id = ?`, data.byteLength, this.now(), f.id)
      if (who) this.sql.run(`UPDATE files SET author = ?, kind = ?, via = ? WHERE id = ?`, who.author, who.kind, who.via, f.id)
      this.bump()
    })
    return this.file(f.id)
  }

  /** Create or replace by name in a folder (agents keeping a doc current). */
  putFile(folderId: string, who: Author, input: { name: unknown; mime?: string; data: Uint8Array }): { file: FileMeta; created: boolean } {
    const existing = this.fileByName(folderId, cleanName(input.name, 'File name', 200))
    return existing ? { file: this.writeFile(existing.id, input.data, who), created: false } : { file: this.createFile(folderId, who, input), created: true }
  }

  private moveFile(f: FileMeta, folderId: string) {
    const name = this.freeName(folderId, f.name, f.id)
    this.sql.run(`UPDATE files SET folder_id = ?, name = ?, updated_at = ? WHERE id = ?`, folderId, name, this.now(), f.id)
  }

  updateFile(id: string, input: { name?: unknown; folder_id?: unknown }): FileMeta {
    const f = this.file(id)
    return this.sql.tx(() => {
      if (input.folder_id !== undefined && input.folder_id !== f.folder_id) {
        const target = this.folder(String(input.folder_id))
        if (target.project_id !== f.project_id) throw new HttpError(400, 'Files cannot move between projects')
        this.moveFile(f, target.id)
        this.sql.run(`UPDATE files SET message_id = NULL WHERE id = ?`, f.id)
      }
      if (input.name !== undefined) {
        const name = cleanName(input.name, 'File name', 200)
        const cur = this.file(f.id)
        if (this.sql.get(`SELECT 1 FROM files WHERE folder_id = ? AND name = ? COLLATE NOCASE AND id != ?`, cur.folder_id, name, f.id))
          throw new HttpError(409, `“${name}” already exists in this folder`)
        this.sql.run(`UPDATE files SET name = ?, mime = ?, updated_at = ? WHERE id = ?`, name, mimeFor(name) === 'application/octet-stream' ? cur.mime : mimeFor(name), this.now(), f.id)
      }
      this.bump()
      return this.file(f.id)
    })
  }

  deleteFile(id: string) {
    const f = this.file(id)
    this.sql.tx(() => {
      this.sql.run(`DELETE FROM chunks WHERE file_id = ?`, f.id)
      this.sql.run(`DELETE FROM files WHERE id = ?`, f.id)
      this.bump()
    })
  }

  // ── links ───────────────────────────────────────────────────
  links(projectId: string): Link[] {
    return this.sql.all<Link>(`SELECT * FROM links WHERE project_id = ? AND agent_id IS NULL ORDER BY created_at DESC`, projectId)
  }

  createLink(projectId: string, input: { name?: unknown; kind?: unknown; folder_id?: unknown; can_write?: unknown }): Link {
    const p = this.project(projectId)
    const folder = this.folder(input.folder_id ? String(input.folder_id) : p.root_id)
    if (folder.project_id !== p.id) throw new HttpError(400, 'Folder is not in this project')
    const id = randomId()
    this.sql.tx(() => {
      this.sql.run(
        `INSERT INTO links (id, token, project_id, folder_id, name, kind, can_write, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        id, newToken(), p.id, folder.id, cleanName(input.name, 'Link name', 60), asKind(input.kind), input.can_write ? 1 : 0, this.now(),
      )
      this.bump()
    })
    return this.sql.get<Link>(`SELECT * FROM links WHERE id = ?`, id) as Link
  }

  deleteLink(id: string) {
    this.sql.tx(() => {
      this.sql.run(`DELETE FROM links WHERE id = ?`, id)
      this.bump()
    })
  }

  linkByToken(token: string): Link | undefined {
    if (!/^rl_[A-Za-z0-9]{32}$/.test(token)) return undefined
    const l = this.sql.get<Link>(`SELECT * FROM links WHERE token = ?`, token)
    if (l && (!l.last_used_at || this.now() - l.last_used_at > 60_000)) this.sql.run(`UPDATE links SET last_used_at = ? WHERE id = ?`, this.now(), l.id)
    return l
  }

  // ── agents ──────────────────────────────────────────────────
  /** Agents with today's run count and their latest outcome. */
  agents(projectId: string): AgentStat[] {
    const day = this.now() - (this.now() % 86_400_000)
    return this.sql.all<AgentStat>(`
      SELECT a.*, l.folder_id AS scope_id,
        CASE WHEN a.day_start = ? THEN a.day_runs ELSE 0 END AS runs_today,
        (SELECT r.status FROM runs r WHERE r.agent_id = a.id AND r.finished_at IS NOT NULL ORDER BY r.finished_at DESC LIMIT 1) AS last_status,
        (SELECT r.error FROM runs r WHERE r.agent_id = a.id AND r.finished_at IS NOT NULL ORDER BY r.finished_at DESC LIMIT 1) AS last_error,
        (SELECT MAX(r.finished_at) FROM runs r WHERE r.agent_id = a.id) AS last_at
      FROM agents a JOIN links l ON l.id = a.link_id WHERE a.project_id = ? ORDER BY a.name COLLATE NOCASE`, day, projectId)
  }

  agent(id: string): Agent {
    const a = this.sql.get<Agent>(`SELECT * FROM agents WHERE id = ?`, id)
    if (!a) throw new HttpError(404, 'Agent not found')
    return a
  }

  linkById(id: string): Link | undefined {
    return this.sql.get<Link>(`SELECT * FROM links WHERE id = ?`, id)
  }

  private agentFields(p: Project, input: Record<string, unknown>, cur?: Agent) {
    const pick = <T>(k: string, d: T): unknown => (input[k] === undefined ? d : input[k])
    const name = cleanName(pick('name', cur?.name), 'Agent name', 40)
    if (this.sql.get(`SELECT 1 FROM agents WHERE project_id = ? AND name = ? COLLATE NOCASE AND id != ?`, p.id, name, cur?.id ?? ''))
      throw new HttpError(409, `An agent named “${name}” already exists`)
    const provider = String(pick('provider', cur?.provider ?? ''))
    if (!(provider in PROVIDERS)) throw new HttpError(400, 'Provider must be openai, anthropic or gemini')
    const model = String(pick('model', cur?.model ?? '')).trim()
    if (!/^[\w.:/-]{1,80}$/.test(model)) throw new HttpError(400, 'Model id is missing or invalid')
    const effort = String(pick('effort', cur?.effort ?? '') ?? '')
    if (!['', 'low', 'medium', 'high'].includes(effort)) throw new HttpError(400, 'Effort must be low, medium or high')
    const folder = this.folder(String(pick('folder_id', cur?.folder_id ?? p.root_id)))
    if (folder.project_id !== p.id) throw new HttpError(400, 'Folder is not in this project')
    const every = Math.round(Number(pick('every_min', cur?.every_min ?? 0)) || 0)
    if (every !== 0 && (every < 15 || every > 10_080)) throw new HttpError(400, 'Check-ins run between every 15 minutes and once a week')
    const flag = (k: string, d: number) => (input[k] === undefined ? d : input[k] ? 1 : 0)
    return {
      name, provider, kind: PROVIDERS[provider] as Kind, model, effort, folder_id: folder.id, every_min: every,
      instructions: String(pick('instructions', cur?.instructions ?? '') ?? '').slice(0, 8000),
      daily_runs: Math.min(Math.max(Math.round(Number(pick('daily_runs', cur?.daily_runs ?? 30)) || 30), 1), 500),
      on_message: flag('on_message', cur?.on_message ?? 1), on_mention: flag('on_mention', cur?.on_mention ?? 1), enabled: flag('enabled', cur?.enabled ?? 1),
      scope: pick('scope', undefined) === undefined ? undefined : pick('scope', undefined) === 'folder' ? folder.id : p.root_id,
    }
  }

  /** An agent gets its own write link: identity, scope and permissions work exactly as for any link. */
  createAgent(projectId: string, input: Record<string, unknown>): Agent {
    const p = this.project(projectId)
    const f = this.agentFields(p, input)
    const t = this.now()
    const id = randomId()
    return this.sql.tx(() => {
      const link = this.createLink(p.id, { name: f.name, kind: f.kind, folder_id: f.scope ?? f.folder_id, can_write: true })
      this.sql.run(`UPDATE links SET agent_id = ? WHERE id = ?`, id, link.id)
      this.sql.run(
        `INSERT INTO agents (id, project_id, link_id, name, kind, provider, model, effort, instructions, folder_id, on_message, on_mention,
           every_min, daily_runs, enabled, next_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        id, p.id, link.id, f.name, f.kind, f.provider, f.model, f.effort, f.instructions, f.folder_id, f.on_message, f.on_mention,
        f.every_min, f.daily_runs, f.enabled, f.every_min ? t + f.every_min * 60_000 : null, t, t,
      )
      this.bump()
      return this.agent(id)
    })
  }

  updateAgent(id: string, input: Record<string, unknown>): Agent {
    const cur = this.agent(id)
    const f = this.agentFields(this.project(cur.project_id), input, cur)
    const t = this.now()
    return this.sql.tx(() => {
      this.sql.run(
        `UPDATE agents SET name = ?, kind = ?, provider = ?, model = ?, effort = ?, instructions = ?, folder_id = ?, on_message = ?, on_mention = ?,
           every_min = ?, daily_runs = ?, enabled = ?, next_at = ?, updated_at = ? WHERE id = ?`,
        f.name, f.kind, f.provider, f.model, f.effort, f.instructions, f.folder_id, f.on_message, f.on_mention, f.every_min, f.daily_runs,
        f.enabled, f.every_min ? (cur.every_min === f.every_min && cur.next_at ? cur.next_at : t + f.every_min * 60_000) : null, t, cur.id,
      )
      this.sql.run(`UPDATE links SET name = ?, kind = ? WHERE id = ?`, f.name, f.kind, cur.link_id)
      if (f.scope !== undefined) this.sql.run(`UPDATE links SET folder_id = ? WHERE id = ?`, f.scope, cur.link_id)
      if (!f.enabled) this.sql.run(`DELETE FROM runs WHERE agent_id = ? AND status = 'queued'`, cur.id)
      this.bump()
      return this.agent(cur.id)
    })
  }

  private dropAgent(id: string) {
    const a = this.sql.get<Agent>(`SELECT * FROM agents WHERE id = ?`, id)
    if (!a) return
    this.sql.run(`DELETE FROM runs WHERE agent_id = ?`, a.id)
    this.sql.run(`DELETE FROM links WHERE id = ?`, a.link_id)
    this.sql.run(`DELETE FROM agents WHERE id = ?`, a.id)
  }

  deleteAgent(id: string) {
    this.agent(id)
    this.sql.tx(() => {
      this.dropAgent(id)
      this.bump()
    })
  }

  // ── runs (the agent work queue) ─────────────────────────────
  /** One queued run per agent and folder: a newer trigger joins the waiting run instead of adding another. */
  enqueue(o: { agent: Agent; folderId: string; reason: string; due: number; triggerId?: string; note?: string }) {
    const q = this.sql.get<Run>(`SELECT * FROM runs WHERE agent_id = ? AND folder_id = ? AND status = 'queued'`, o.agent.id, o.folderId)
    if (q) {
      const note = [q.note, o.note].filter(Boolean).join('\n').slice(0, 4000)
      const reason = q.reason === 'mention' || o.reason === 'schedule' ? q.reason : o.reason
      this.sql.run(`UPDATE runs SET due_at = MIN(due_at, ?), trigger_id = COALESCE(?, trigger_id), reason = ?, note = ? WHERE id = ?`,
        o.due, o.triggerId ?? null, reason, note, q.id)
      return
    }
    this.sql.run(
      `INSERT INTO runs (id, agent_id, project_id, folder_id, reason, trigger_id, note, status, due_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'queued', ?)`,
      randomId(), o.agent.id, o.agent.project_id, o.folderId, o.reason, o.triggerId ?? null, (o.note ?? '').slice(0, 4000), o.due,
    )
  }

  nextDue(now: number): Run | undefined {
    return this.sql.get<Run>(`SELECT * FROM runs WHERE status = 'queued' AND due_at <= ? ORDER BY due_at LIMIT 1`, now)
  }

  /** Starting a run is what counts against the daily cap; the counter lives on the agent, so pruning runs never resets it. */
  startRun(run: Run) {
    const day = this.now() - (this.now() % 86_400_000)
    this.sql.run(`UPDATE runs SET status = 'running', started_at = ? WHERE id = ?`, this.now(), run.id)
    this.sql.run(`UPDATE agents SET day_runs = CASE WHEN day_start = ? THEN day_runs + 1 ELSE 1 END, day_start = ? WHERE id = ?`, day, day, run.agent_id)
    this.bump()
  }

  finishRun(id: string, status: 'done' | 'error' | 'skipped', o: { tokens_in?: number; tokens_out?: number; error?: string | null } = {}) {
    const r = this.sql.get<Run>(`SELECT * FROM runs WHERE id = ?`, id)
    if (!r) return
    this.sql.run(`UPDATE runs SET status = ?, finished_at = ?, tokens_in = ?, tokens_out = ?, error = ? WHERE id = ?`,
      status, this.now(), o.tokens_in ?? 0, o.tokens_out ?? 0, o.error ?? null, id)
    this.sql.run(`DELETE FROM runs WHERE agent_id = ? AND status != 'queued' AND id NOT IN
      (SELECT id FROM runs WHERE agent_id = ? ORDER BY status = 'skipped', due_at DESC LIMIT 200)`, r.agent_id, r.agent_id)
    this.bump()
  }

  runs(agentId: string, limit = 20): Run[] {
    return this.sql.all<Run>(`SELECT * FROM runs WHERE agent_id = ? ORDER BY due_at DESC LIMIT ?`, agentId, limit)
  }

  running(projectId: string): { agent_id: string; folder_id: string }[] {
    return this.sql.all(`SELECT agent_id, folder_id FROM runs WHERE project_id = ? AND status = 'running'`, projectId)
  }

  runsToday(a: Agent): number {
    const day = this.now() - (this.now() % 86_400_000)
    const row = this.sql.get<{ day_start: number; day_runs: number }>(`SELECT day_start, day_runs FROM agents WHERE id = ?`, a.id)
    return row && row.day_start === day ? row.day_runs : 0
  }

  lastRunAt(agentId: string): number {
    return Number(this.sql.get<{ t: number }>(`SELECT MAX(started_at) AS t FROM runs WHERE agent_id = ?`, agentId)?.t ?? 0)
  }

  /** Agents whose scheduled check-in is due; the caller moves next_at forward. */
  checkinsDue(now: number): Agent[] {
    return this.sql.all<Agent>(`SELECT * FROM agents WHERE enabled = 1 AND every_min > 0 AND next_at <= ?`, now)
  }

  setNextAt(id: string, t: number) {
    this.sql.run(`UPDATE agents SET next_at = ? WHERE id = ?`, t, id)
  }

  /** Anything new below rootId since t from the owner or a non-agent link. Agents never keep each other's check-ins going. */
  activitySince(rootId: string, t: number): boolean {
    return !!this.sql.get(
      `${SUBTREE} SELECT 1 FROM messages m WHERE m.folder_id IN (SELECT id FROM t) AND m.created_at > ? AND m.via NOT IN (SELECT link_id FROM agents)
       UNION ALL SELECT 1 FROM files f WHERE f.folder_id IN (SELECT id FROM t) AND f.updated_at > ? AND f.via NOT IN (SELECT link_id FROM agents) LIMIT 1`,
      rootId, t, t)
  }

  /** Stale runs (their worker was cut off) become errors instead of "working" forever. */
  expireRuns(olderThan: number) {
    this.sql.run(`UPDATE runs SET status = 'error', error = 'Timed out', finished_at = ? WHERE status = 'running' AND started_at < ?`, this.now(), olderThan)
  }

  /** Messages in a folder since the last one the owner wrote: how long agents have been talking among themselves. */
  chainLength(folderId: string): number {
    return Number(this.sql.get<{ n: number }>(
      `SELECT COUNT(*) AS n FROM messages WHERE folder_id = ? AND created_at >
         IFNULL((SELECT MAX(created_at) FROM messages WHERE folder_id = ? AND via = 'owner'), 0)`, folderId, folderId)?.n ?? 0)
  }

  /** When the engine should wake next: the earliest queued run or scheduled check-in. */
  nextWake(): number | null {
    const r = this.sql.get<{ t: number | null }>(`SELECT MIN(t) AS t FROM (
      SELECT MIN(due_at) AS t FROM runs WHERE status = 'queued'
      UNION ALL SELECT MIN(next_at) AS t FROM agents WHERE enabled = 1 AND every_min > 0)`)
    return r?.t ?? null
  }

  /** The public origin, remembered from owner requests, for links inside agent context. */
  origin(): string {
    return this.origin_ ?? (this.origin_ = this.sql.get<{ v: string }>(`SELECT v FROM meta WHERE k = 'origin'`)?.v ?? 'http://localhost')
  }
  rememberOrigin(origin: string) {
    if (this.origin() === origin) return
    this.origin_ = origin
    this.sql.run(`INSERT OR REPLACE INTO meta (k, v) VALUES ('origin', ?)`, origin)
  }

  // ── search ──────────────────────────────────────────────────
  /** Message text and file names matching q, everywhere or below one folder. */
  search(q: string, rootId?: string) {
    // Durable Object SQLite refuses LIKE patterns over 50 bytes.
    let like = ''
    for (let n = q.length; n > 0; n--) {
      like = `%${q.slice(0, n).replace(/[\\%_]/g, c => '\\' + c)}%`
      if (new TextEncoder().encode(like).byteLength <= 50) break
    }
    const cte = rootId ? `${SUBTREE} ` : ''
    const args = rootId ? [rootId, like] : [like]
    const messages = this.sql.all<Omit<Message, 'files'> & { slug: string }>(
      `${cte}SELECT m.*, p.slug FROM messages m JOIN projects p ON p.id = m.project_id
       WHERE m.body LIKE ? ESCAPE '\\'${rootId ? ' AND m.folder_id IN (SELECT id FROM t)' : ''} ORDER BY m.created_at DESC LIMIT 20`, ...args)
    const files = this.sql.all<FileMeta & { slug: string }>(
      `${cte}SELECT f.*, p.slug FROM files f JOIN projects p ON p.id = f.project_id
       WHERE f.name LIKE ? ESCAPE '\\'${rootId ? ' AND f.folder_id IN (SELECT id FROM t)' : ''} ORDER BY f.updated_at DESC LIMIT 20`, ...args)
    return { messages, files }
  }
}
