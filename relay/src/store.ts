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

export class HttpError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

const CHUNK = 1 << 20
const SCHEMA = 1
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
export const segments = (path: unknown) =>
  String(path ?? '').split('/').map(s => s.trim()).filter(Boolean).map(s => cleanName(s, 'Folder name'))

export class Store {
  sql: Sql
  now: () => number

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
      s.script(`
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
      s.run(`INSERT OR REPLACE INTO meta (k, v) VALUES ('schema', ?)`, String(SCHEMA))
      s.run(`INSERT OR IGNORE INTO meta (k, v) VALUES ('seq', '0')`)
      if (v === 0 && !s.get(`SELECT 1 FROM projects`)) {
        const p = this.createProject({ name: 'M/ARC', description: 'Workout, recovery and coaching tracker (Android / PWA).', template: 'software' })
        const owner: Author = { author: 'Relay', kind: 'agent', via: 'owner' }
        this.createMessage(p.root_id, owner, {
          body:
            'Welcome to **M/ARC** on Relay.\n\n- Every folder has a **Thread** and **Files**. Drop files anywhere.\n' +
            '- **Share** creates a link for Claude, GPT or any agent: read-only, or read + write.\n' +
            '- Chat apps that cannot post: paste their reply with **as → GPT / Claude** in the composer.',
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
      for (const t of ['files', 'messages', 'links', 'folders']) this.sql.run(`DELETE FROM ${t} WHERE project_id = ?`, p.id)
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
    return this.sql
      .all<{ id: string }>(
        `WITH RECURSIVE t(id) AS (SELECT ? UNION ALL SELECT f.id FROM folders f JOIN t ON f.parent_id = t.id) SELECT id FROM t`,
        rootId,
      )
      .map(r => r.id)
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
    let f = this.folder(rootId)
    for (const seg of segments(path)) {
      const next = this.sql.get<Folder>(`SELECT * FROM folders WHERE parent_id = ? AND name = ? COLLATE NOCASE`, f.id, seg)
      f = next ?? this.createFolder(f.id, seg)
    }
    return f
  }

  createFolder(parentId: string, rawName: unknown): Folder {
    const parent = this.folder(parentId)
    const name = cleanName(rawName, 'Folder name', 80)
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
    const marks = ids.map(() => '?').join(',')
    this.sql.tx(() => {
      this.sql.run(`DELETE FROM chunks WHERE file_id IN (SELECT id FROM files WHERE folder_id IN (${marks}))`, ...ids)
      this.sql.run(`DELETE FROM files WHERE folder_id IN (${marks})`, ...ids)
      this.sql.run(`DELETE FROM messages WHERE folder_id IN (${marks})`, ...ids)
      this.sql.run(`DELETE FROM links WHERE folder_id IN (${marks})`, ...ids)
      this.sql.run(`DELETE FROM folders WHERE id IN (${marks})`, ...ids)
      this.bump()
    })
  }

  // ── messages ────────────────────────────────────────────────
  private withFiles(rows: Omit<Message, 'files'>[]): Message[] {
    if (!rows.length) return []
    const ids = rows.map(r => r.id)
    const files = this.sql.all<FileMeta>(
      `SELECT * FROM files WHERE message_id IN (${ids.map(() => '?').join(',')}) ORDER BY created_at`, ...ids)
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

  /** Latest messages across a set of folders, oldest first. */
  recent(folderIds: string[], limit = 30): Message[] {
    if (!folderIds.length) return []
    const rows = this.sql.all<Omit<Message, 'files'>>(
      `SELECT * FROM messages WHERE folder_id IN (${folderIds.map(() => '?').join(',')}) ORDER BY created_at DESC, id DESC LIMIT ?`,
      ...folderIds, limit,
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
    const body = cleanBody(input.body, fileIds.length > 0)
    return this.sql.tx(() => {
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
  files(folderIds: string | string[]): FileMeta[] {
    const ids = Array.isArray(folderIds) ? folderIds : [folderIds]
    if (!ids.length) return []
    return this.sql.all<FileMeta>(
      `SELECT * FROM files WHERE folder_id IN (${ids.map(() => '?').join(',')}) ORDER BY name COLLATE NOCASE`, ...ids)
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
    return this.sql.all<Link>(`SELECT * FROM links WHERE project_id = ? ORDER BY created_at DESC`, projectId)
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

  // ── search ──────────────────────────────────────────────────
  search(q: string) {
    const like = `%${q.replace(/[\\%_]/g, c => '\\' + c)}%`
    const messages = this.sql.all<Omit<Message, 'files'> & { slug: string }>(
      `SELECT m.*, p.slug FROM messages m JOIN projects p ON p.id = m.project_id
       WHERE m.body LIKE ? ESCAPE '\\' ORDER BY m.created_at DESC LIMIT 20`, like)
    const files = this.sql.all<FileMeta & { slug: string }>(
      `SELECT f.*, p.slug FROM files f JOIN projects p ON p.id = f.project_id
       WHERE f.name LIKE ? ESCAPE '\\' ORDER BY f.updated_at DESC LIMIT 20`, like)
    return { messages, files }
  }
}
