// Relay web app. No framework, no build: a small DOM helper, one state object, region renders.
import { KINDS, fmtBytes, isImage, isMarkdown, isText, renderMarkdown } from './shared.js'

// ── helpers ────────────────────────────────────────────────────
function h(tag, props, ...kids) {
  const [name, ...cls] = tag.split('.')
  const el = document.createElement(name || 'div')
  if (cls.length) el.className = cls.join(' ')
  for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k instanceof Node ? k : String(k))
  for (const [k, v] of Object.entries(props ?? {})) {
    if (v == null || v === false) continue
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v)
    else if (k === 'html') el.innerHTML = v
    else if (k === 'vars') for (const [n, x] of Object.entries(v)) el.style.setProperty(n, String(x))
    else if (k === 'value' || k === 'checked') el[k] = v
    else el.setAttribute(k, v === true ? '' : String(v))
  }
  return el
}

const P = 'fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"'
const ICONS = {
  folder: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z"/>',
  folderPlus: '<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H9l2 2h7.5A2.5 2.5 0 0 1 21 9.5v7a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z"/><path d="M12 10.5v5M9.5 13h5"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4-4"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  note: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  image: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle cx="9" cy="9" r="1.75"/><path d="m20.5 15-5-5L5 20.5"/>',
  clip: '<path d="m20 11.5-8 8a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L15 7"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/>',
  edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z"/>',
  download: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V9M7 14l5-5 5 5M5 4h14"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  logout: '<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  thread: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9a1.5 1.5 0 0 1-1.5 1.5H9l-5 4z"/>',
  box: '<path d="M4 8 12 4l8 4v8l-8 4-8-4z"/><path d="m4 8 8 4 8-4M12 12v8"/>',
  external: '<path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  eye: '<path d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"/><circle cx="12" cy="12" r="2.5"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4"/>',
}
const icon = (n, cls = '') => h('span.i' + cls, { html: `<svg viewBox="0 0 24 24" ${P} aria-hidden="true">${ICONS[n] ?? ''}</svg>` })
const stop = e => { e.preventDefault(); e.stopPropagation() }

const store = {
  get(k, d) { try { const v = localStorage.getItem('relay.' + k); return v == null ? d : JSON.parse(v) } catch { return d } },
  set(k, v) { try { localStorage.setItem('relay.' + k, JSON.stringify(v)) } catch {} },
}

const rel = t => {
  const s = (Date.now() - t) / 1000
  if (s < 45) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)}m`
  if (s < 86400) return `${Math.round(s / 3600)}h`
  if (s < 604800) return `${Math.round(s / 86400)}d`
  return new Date(t).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
const full = t => new Date(t).toLocaleString()
const clock = t => new Date(t).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
function dayLabel(t) {
  const d = new Date(t), now = new Date(), y = new Date(now)
  y.setDate(now.getDate() - 1)
  if (d.toDateString() === now.toDateString()) return 'Today'
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' })
}
const hue = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7)
const initials = s => s.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?'

// ── state ──────────────────────────────────────────────────────
const S = {
  owner: false, configured: true, projects: [], detail: null, folderId: null, tab: 'thread', fileId: null,
  msgs: [], more: false, files: [], seq: -1, drafts: {}, pending: [], editing: null, editText: null,
}
let seen = store.get('seen', {})
let root, side, bar, view, slot, layer, toasts, composer = null, stick = true
let drawer = { id: null, editing: false, source: false }
const textCache = new Map()

async function api(method, path, body, type) {
  const init = { method, headers: { 'x-relay': '1' } }
  if (body instanceof Blob) { init.body = body; init.headers['content-type'] = type || body.type || 'application/octet-stream' }
  else if (body !== undefined) { init.body = JSON.stringify(body); init.headers['content-type'] = 'application/json' }
  const res = await fetch(path, init)
  const data = (res.headers.get('content-type') ?? '').includes('json') ? await res.json() : null
  if (res.status === 401 && path !== '/api/login') { S.owner = false; render(); throw new Error('Signed out') }
  if (!res.ok) throw new Error(data?.error || `${res.status} ${res.statusText}`)
  return data
}

function toast(msg, ms = 3200) {
  const el = h('div.toast', {}, msg)
  toasts.append(el)
  if (ms) setTimeout(() => el.remove(), ms)
  return el
}

async function copy(text, msg = 'Copied') {
  try { await navigator.clipboard.writeText(text) } catch {
    const t = h('textarea', { value: text })
    document.body.append(t); t.select(); document.execCommand('copy'); t.remove()
  }
  toast(msg)
}

// ── folders ────────────────────────────────────────────────────
const fmap = () => new Map((S.detail?.folders ?? []).map(f => [f.id, f]))
function chain(id) {
  const m = fmap(), out = []
  for (let f = m.get(id); f; f = f.parent_id ? m.get(f.parent_id) : null) out.unshift(f)
  return out
}
const pathOf = id => chain(id).slice(1).map(f => f.name).join('/')
const where = (id = S.folderId) => (pathOf(id) ? '/' + pathOf(id) : S.detail?.project.name ?? '')
const cur = () => fmap().get(S.folderId)
const subtree = id => { const out = [id]; for (const f of S.detail.folders) if (chain(f.id).some(x => x.id === id) && f.id !== id) out.push(f.id); return out }

function urlFor({ folderId = S.folderId, tab = S.tab, file = null } = {}) {
  const p = S.detail.project
  const q = new URLSearchParams()
  if (tab === 'files') q.set('tab', 'files')
  if (file) q.set('file', file)
  return `/p/${encodeURIComponent(p.slug)}${folderId && folderId !== p.root_id ? `/f/${folderId}` : ''}${q.size ? '?' + q : ''}`
}

function markSeen(id) {
  const f = fmap().get(id)
  if (!f) return
  seen[id] = Math.max(Date.now(), f.last_at)
  store.set('seen', seen)
}
function knowAll() {
  let changed = false
  for (const f of S.detail?.folders ?? []) if (!(f.id in seen)) { seen[f.id] = f.last_at; changed = true }
  if (changed) store.set('seen', seen)
}
const unread = f => f.id !== S.folderId && f.last_at > (seen[f.id] ?? f.last_at)

// ── routing & data ─────────────────────────────────────────────
function go(url, replace = false) {
  history[replace ? 'replaceState' : 'pushState'](null, '', url)
  onRoute()
}
const nav = e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return
  e.preventDefault()
  go(e.currentTarget.getAttribute('href'))
}
window.addEventListener('popstate', () => onRoute())

async function onRoute() {
  if (!S.owner) return render()
  const parts = location.pathname.split('/').filter(Boolean).map(decodeURIComponent)
  const q = new URLSearchParams(location.search)
  const slug = parts[0] === 'p' ? parts[1] : null
  if (!slug) {
    if (S.projects[0]) return go(`/p/${S.projects[0].slug}`, true)
    S.detail = null
    return render()
  }
  if (S.detail?.project.slug !== slug) {
    try { S.detail = await api('GET', `/api/projects/${encodeURIComponent(slug)}`) } catch (e) {
      toast(e.message)
      S.detail = null
      return S.projects[0] && S.projects[0].slug !== slug ? go(`/p/${S.projects[0].slug}`, true) : render()
    }
    knowAll()
  }
  const folderId = parts[2] === 'f' && fmap().has(parts[3]) ? parts[3] : S.detail.project.root_id
  const moved = folderId !== S.folderId
  Object.assign(S, { folderId, tab: q.get('tab') === 'files' ? 'files' : 'thread', fileId: q.get('file') })
  if (moved) {
    Object.assign(S, { msgs: [], files: [], more: false, pending: [], editing: null })
    composer = null
    stick = true
    render()
    await loadFolder()
  }
  markSeen(folderId)
  document.body.classList.remove('nav-open')
  render()
  const target = location.hash.length > 1 && document.getElementById(location.hash.slice(1))
  if (target) { target.scrollIntoView({ block: 'center' }); target.classList.add('flash') }
}

/** Latest page of messages plus files. Older pages the user already loaded stay in place. */
async function loadFolder() {
  const id = S.folderId
  try {
    const [m, f] = await Promise.all([api('GET', `/api/folders/${id}/messages`), api('GET', `/api/folders/${id}/files`)])
    if (id !== S.folderId) return
    const first = m.messages[0]?.created_at ?? Infinity
    const older = m.more ? S.msgs.filter(x => x.created_at < first) : []
    Object.assign(S, { msgs: [...older, ...m.messages], more: older.length ? S.more : m.more, files: f.files })
  } catch (e) { toast(e.message) }
}

async function loadOlder() {
  const first = S.msgs[0]
  if (!first) return
  const r = await api('GET', `/api/folders/${S.folderId}/messages?before=${first.created_at}`)
  const top = view.scrollHeight - view.scrollTop
  S.msgs = [...r.messages, ...S.msgs]
  S.more = r.more
  renderView()
  view.scrollTop = view.scrollHeight - top
}

async function refresh() {
  const [pl, d] = await Promise.all([
    api('GET', '/api/projects'),
    S.detail ? api('GET', `/api/projects/${S.detail.project.id}`).catch(() => null) : null,
  ])
  S.projects = pl.projects
  if (S.detail) {
    if (!d) { S.detail = null; return go('/', true) }
    S.detail = d
    knowAll()
    if (!fmap().has(S.folderId)) return go(`/p/${d.project.slug}`, true)
    await loadFolder()
    markSeen(S.folderId)
  }
  render()
}

/** Read the change counter first, so anything written after it is caught by the next pulse. */
async function sync() {
  try {
    S.seq = (await api('GET', '/api/pulse')).seq
    await refresh()
  } catch (e) { toast(e.message) }
}
async function mutate(fn) {
  try {
    const r = await fn()
    await sync()
    return r
  } catch (e) { toast(e.message); return null }
}
async function pulse() {
  if (!S.owner || document.hidden) return
  try {
    const { seq } = await api('GET', '/api/pulse')
    if (seq !== S.seq) { const first = S.seq < 0; S.seq = seq; if (!first) await refresh() }
  } catch {}
}
setInterval(pulse, 4000)
document.addEventListener('visibilitychange', pulse)

async function upload(folderId, list) {
  const out = []
  for (const f of list) {
    const t = toast(`Uploading ${f.name}…`, 0)
    try { out.push((await api('POST', `/api/folders/${folderId}/files?name=${encodeURIComponent(f.name)}`, f, f.type)).file) }
    catch (e) { toast(`${f.name}: ${e.message}`) }
    finally { t.remove() }
  }
  return out
}
async function attach(list) {
  const up = await upload(S.folderId, list)
  S.pending.push(...up)
  composer?.drawChips()
}
function pickUpload() {
  const input = h('input', { type: 'file', multiple: true })
  input.addEventListener('change', async () => {
    const up = await upload(S.folderId, [...input.files])
    if (up.length) { toast(`Uploaded ${up.length} file${up.length > 1 ? 's' : ''} to ${where()}`); await sync() }
  })
  input.click()
}

// ── drag & drop ────────────────────────────────────────────────
const dragKind = e => { const t = [...(e.dataTransfer?.types ?? [])]; return t.includes('Files') ? 'files' : t.includes('application/x-relay') ? 'item' : null }
const dragItem = (e, type, id) => { e.dataTransfer.setData('application/x-relay', JSON.stringify({ type, id })); e.dataTransfer.effectAllowed = 'move' }
const dropTarget = id => ({
  ondragover: e => { if (!dragKind(e)) return; e.preventDefault(); e.stopPropagation(); e.currentTarget.classList.add('drop') },
  ondragleave: e => e.currentTarget.classList.remove('drop'),
  ondrop: async e => {
    stop(e)
    e.currentTarget.classList.remove('drop')
    hideDrop()
    const item = e.dataTransfer.getData('application/x-relay')
    if (item) {
      const { type, id: what } = JSON.parse(item)
      if (what === id) return
      const r = await mutate(() => api('PATCH', type === 'file' ? `/api/files/${what}` : `/api/folders/${what}`, type === 'file' ? { folder_id: id } : { parent_id: id }))
      if (r) toast(`Moved to ${where(id)}`)
    } else if (e.dataTransfer.files.length) {
      const up = await upload(id, [...e.dataTransfer.files])
      if (up.length) { toast(`Uploaded ${up.length} to ${where(id)}`); await sync() }
    }
  },
})
let dragDepth = 0
const hideDrop = () => { dragDepth = 0; layer.querySelector('.dropzone')?.remove() }
window.addEventListener('dragenter', e => {
  if (dragKind(e) !== 'files' || !S.detail) return
  if (dragDepth++ === 0) layer.append(h('div.dropzone', {}, h('div', {}, icon('upload', '.big'), S.tab === 'thread' ? `Attach to a message in ${where()}` : `Upload to ${where()}`)))
})
window.addEventListener('dragleave', e => { if (dragKind(e) === 'files' && --dragDepth <= 0) hideDrop() })
window.addEventListener('dragover', e => { if (dragKind(e) === 'files') e.preventDefault() })
window.addEventListener('drop', async e => {
  if (dragKind(e) !== 'files') return
  e.preventDefault()
  hideDrop()
  if (!S.detail) return
  if (S.tab === 'thread') return attach([...e.dataTransfer.files])
  const up = await upload(S.folderId, [...e.dataTransfer.files])
  if (up.length) await sync()
})

// ── overlays ───────────────────────────────────────────────────
function modal(title, body, { cls = '', onClose } = {}) {
  const close = () => { el.remove(); onClose?.() }
  const el = h('div.overlay', { onpointerdown: e => e.target === el && close() },
    h('div.modal' + (cls ? '.' + cls : ''), { role: 'dialog', 'aria-label': title ?? 'Dialog' },
      title ? h('div.mhead', {}, h('h3', {}, title), h('button.icon-btn', { title: 'Close', onclick: close }, icon('x'))) : null, body))
  el.close = close
  layer.append(el)
  return el
}
const field = (label, input, hint) => h('label.field', {}, h('span', {}, label), input, hint ? h('small', {}, hint) : null)
const actions = (...kids) => h('div.actions', {}, kids)

function ask(title, { value = '', placeholder = '', ok = 'Save', hint = '' } = {}) {
  return new Promise(resolve => {
    const input = h('input', { value, placeholder, maxlength: 200 })
    const done = v => { resolve(v); m.close() }
    const m = modal(title, h('form.form', { onsubmit: e => { e.preventDefault(); if (input.value.trim()) done(input.value.trim()) } },
      hint ? h('p.hint', {}, hint) : null, input,
      actions(h('button.btn', { type: 'button', onclick: () => done(null) }, 'Cancel'), h('button.btn.primary', { type: 'submit' }, ok))),
    { onClose: () => resolve(null) })
    setTimeout(() => { input.focus(); const dot = input.value.lastIndexOf('.'); input.setSelectionRange(0, dot > 0 ? dot : input.value.length) })
  })
}
function confirmBox(title, text, ok = 'Delete') {
  return new Promise(resolve => {
    const done = v => { resolve(v); m.close() }
    const yes = h('button.btn.danger', { onclick: () => done(true) }, ok)
    const m = modal(title, h('div.form', {}, h('p.hint', {}, text), actions(h('button.btn', { onclick: () => done(false) }, 'Cancel'), yes)), { onClose: () => resolve(false) })
    setTimeout(() => yes.focus())
  })
}

function menu(anchor, items) {
  closeMenu()
  const el = h('div.menu', { role: 'menu' }, items.filter(Boolean).map(it => it === '-' ? h('hr') :
    h('button' + (it.danger ? '.danger' : ''), { role: 'menuitem', onclick: e => { stop(e); closeMenu(); it.run() } }, icon(it.icon), it.label)))
  layer.append(el)
  const r = anchor.getBoundingClientRect()
  el.style.top = `${Math.min(r.bottom + 4, innerHeight - el.offsetHeight - 8)}px`
  el.style.left = `${Math.max(8, Math.min(r.left, innerWidth - el.offsetWidth - 8))}px`
  const outside = e => { if (!el.contains(e.target)) closeMenu() }
  el.outside = outside
  setTimeout(() => document.addEventListener('pointerdown', outside, true))
}
function closeMenu() {
  const el = layer?.querySelector('.menu')
  if (!el) return false
  document.removeEventListener('pointerdown', el.outside, true)
  el.remove()
  return true
}

// ── actions ────────────────────────────────────────────────────
function newProject() {
  const name = h('input', { placeholder: 'M/ARC', maxlength: 80 })
  const desc = h('input', { placeholder: 'One line about it (optional)', maxlength: 500 })
  const tpl = h('select', {}, h('option', { value: 'software' }, 'Software: agents, docs, design, tasks, releases'), h('option', { value: 'empty' }, 'Empty'))
  const m = modal('New project', h('form.form', {
    onsubmit: async e => {
      e.preventDefault()
      const r = await mutate(() => api('POST', '/api/projects', { name: name.value, description: desc.value, template: tpl.value }))
      if (r) { m.close(); go(`/p/${r.project.slug}`) }
    },
  }, field('Name', name), field('Description', desc), field('Start with', tpl),
  actions(h('button.btn', { type: 'button', onclick: () => m.close() }, 'Cancel'), h('button.btn.primary', { type: 'submit' }, 'Create project'))))
  setTimeout(() => name.focus())
}

async function editProject(p) {
  const name = h('input', { value: p.name, maxlength: 80 })
  const desc = h('input', { value: p.description, maxlength: 500 })
  const m = modal('Project', h('form.form', {
    onsubmit: async e => {
      e.preventDefault()
      if (await mutate(() => api('PATCH', `/api/projects/${p.id}`, { name: name.value, description: desc.value }))) m.close()
    },
  }, field('Name', name), field('Description', desc), actions(h('button.btn', { type: 'button', onclick: () => m.close() }, 'Cancel'), h('button.btn.primary', { type: 'submit' }, 'Save'))))
  setTimeout(() => name.focus())
}

async function deleteProject(p) {
  if (!(await confirmBox(`Delete ${p.name}?`, `Every folder, message, file and agent link in ${p.name} is deleted for good.`, 'Delete project'))) return
  if (await mutate(() => api('DELETE', `/api/projects/${p.id}`))) { S.detail = null; go('/', true) }
}

async function newFolder(parentId = S.folderId) {
  const name = await ask('New folder', { placeholder: 'e.g. research', ok: 'Create', hint: `Inside ${where(parentId)}` })
  if (!name) return
  const r = await mutate(() => api('POST', `/api/projects/${S.detail.project.id}/folders`, { name, parent_id: parentId }))
  if (r) { delete collapsed[parentId]; store.set('collapsed', collapsed); go(urlFor({ folderId: r.folder.id, tab: 'thread' })) }
}
async function renameFolder(f) {
  const name = await ask('Rename folder', { value: f.name })
  if (name && name !== f.name) await mutate(() => api('PATCH', `/api/folders/${f.id}`, { name }))
}
async function deleteFolder(f) {
  const ids = subtree(f.id)
  const all = S.detail.folders.filter(x => ids.includes(x.id))
  const n = all.reduce((a, x) => ({ m: a.m + x.messages, f: a.f + x.files }), { m: 0, f: 0 })
  if (!(await confirmBox(`Delete ${f.name}?`, `This deletes ${where(f.id)}${ids.length > 1 ? ` and ${ids.length - 1} subfolder${ids.length > 2 ? 's' : ''}` : ''}: ${n.m} messages and ${n.f} files.`))) return
  const parent = f.parent_id
  if (await mutate(() => api('DELETE', `/api/folders/${f.id}`)) && ids.includes(S.folderId)) go(urlFor({ folderId: parent }))
}

function openFile(id) { go(urlFor({ file: id })) }
function closeFile() { drawer = { id: null, editing: false, source: false }; go(urlFor({ file: null })) }

async function newNote() {
  const name = await ask('New note', { value: 'Untitled.md', ok: 'Create' })
  if (!name) return
  const r = await mutate(() => api('POST', `/api/folders/${S.folderId}/files?name=${encodeURIComponent(name)}`, new Blob([''], { type: 'text/markdown' })))
  if (r) { drawer = { id: r.file.id, editing: true, source: false }; openFile(r.file.id) }
}
async function renameFile(f) {
  const name = await ask('Rename file', { value: f.name })
  if (name && name !== f.name) await mutate(() => api('PATCH', `/api/files/${f.id}`, { name }))
}
async function deleteFile(f) {
  if (!(await confirmBox(`Delete ${f.name}?`, 'The file is removed from this folder and from any message it was attached to.'))) return
  if (await mutate(() => api('DELETE', `/api/files/${f.id}`)) && S.fileId === f.id) closeFile()
}

async function logout() {
  await api('POST', '/api/logout').catch(() => {})
  S.owner = false
  render()
}

const collapsed = store.get('collapsed', {})
function toggleFolder(id) {
  if (collapsed[id]) delete collapsed[id]; else collapsed[id] = 1
  store.set('collapsed', collapsed)
  renderSide()
}

const isDark = () => (document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')) === 'dark'
function applyTheme() {
  const t = store.get('theme', null)
  if (t) document.documentElement.dataset.theme = t
  else delete document.documentElement.dataset.theme
}
function toggleTheme() { store.set('theme', isDark() ? 'light' : 'dark'); applyTheme(); renderSide() }

const folderMenu = f => [
  { label: 'New subfolder', icon: 'folderPlus', run: () => newFolder(f.id) },
  f.parent_id && { label: 'Rename', icon: 'edit', run: () => renameFolder(f) },
  { label: 'Share…', icon: 'link', run: () => shareDialog(f.id) },
  f.parent_id && '-',
  f.parent_id && { label: 'Delete folder', icon: 'trash', danger: true, run: () => deleteFolder(f) },
]
const projectMenu = p => [
  { label: 'Edit project', icon: 'edit', run: () => editProject(p) },
  S.detail?.project.id === p.id && { label: 'Share…', icon: 'link', run: () => shareDialog(p.root_id) },
  '-',
  { label: 'Delete project', icon: 'trash', danger: true, run: () => deleteProject(p) },
]
const fileMenu = f => [
  { label: 'Open', icon: 'eye', run: () => openFile(f.id) },
  { label: 'Download', icon: 'download', run: () => { location.href = `/api/files/${f.id}/raw?download=1` } },
  { label: 'Rename', icon: 'edit', run: () => renameFile(f) },
  '-',
  { label: 'Delete', icon: 'trash', danger: true, run: () => deleteFile(f) },
]

// ── share ──────────────────────────────────────────────────────
function agentPrompt(l, url) {
  const p = S.detail.project.name
  return [
    `I'm working on "${p}" in Relay, a shared workspace for me and my AI agents.`,
    `Open this link first and read it: ${url}`,
    `It has the folders, recent messages and files${l.can_write ? ', and explains how to post back' : ''}.`,
    l.can_write
      ? 'When you finish a step, post your result there as the page explains. If you cannot send HTTP requests, give me the text and I will paste it.'
      : 'You have read-only access: answer here and I will post your reply.',
  ].join('\n')
}

const guessKind = s => (/claude|opus|sonnet|haiku|fable|anthropic/i.test(s) ? 'claude' : /gpt|codex|openai|o\d\b/i.test(s) ? 'gpt' : /gemini|google/i.test(s) ? 'gemini' : 'agent')

function shareDialog(folderId = S.folderId) {
  const d = S.detail
  const rootId = d.project.root_id
  const scopeName = id => (id === rootId ? 'Whole project' : '/' + pathOf(id))
  const kind = h('select', { onchange: () => { kind.picked = true } }, Object.entries(KINDS).filter(([k]) => k !== 'human').map(([k, v]) => h('option', { value: k }, v.label)))
  const name = h('input', { placeholder: 'e.g. GPT-5.6, Claude Code, Codex', maxlength: 60, oninput: () => { if (!kind.picked) kind.value = guessKind(name.value) } })
  const scope = h('select', {}, h('option', { value: rootId }, 'Whole project'), folderId !== rootId ? h('option', { value: folderId }, `Only ${where(folderId)}`) : null)
  const access = h('select', {}, h('option', { value: '1' }, 'Read + write'), h('option', { value: '0' }, 'Read only'))
  const list = h('div.links')
  const row = l => {
    const url = `${location.origin}/s/${l.token}`
    return h('div.link', {}, avatar(l.kind, l.name, '.sm'),
      h('div.linfo', {}, h('strong', {}, l.name), h('span', {}, `${scopeName(l.folder_id)} · ${l.can_write ? 'read + write' : 'read only'} · ${l.last_used_at ? 'opened ' + rel(l.last_used_at) : 'not opened yet'}`)),
      h('button.btn.sm', { title: 'Copy link', onclick: () => copy(url, 'Link copied') }, icon('link'), h('span.lbl', {}, 'Link')),
      h('button.btn.sm', { title: 'Copy a ready-made prompt for the agent', onclick: () => copy(agentPrompt(l, url), 'Prompt copied') }, icon('copy'), h('span.lbl', {}, 'Prompt')),
      h('a.icon-btn.sm', { href: url, target: '_blank', rel: 'noopener', title: 'Open as the agent sees it' }, icon('external')),
      h('button.icon-btn.sm.danger', {
        title: 'Revoke',
        onclick: async () => { if (await confirmBox(`Revoke ${l.name}?`, 'The link stops working immediately.', 'Revoke')) { await mutate(() => api('DELETE', `/api/links/${l.id}`)); draw() } },
      }, icon('trash')))
  }
  const draw = () => list.replaceChildren(...(S.detail.links.length ? S.detail.links.map(row) : [h('p.hint', {}, 'No links yet. Create one above.')]))
  const form = h('form.form.share-form', {
    onsubmit: async e => {
      e.preventDefault()
      const r = await mutate(() => api('POST', `/api/projects/${d.project.id}/links`, { name: name.value.trim() || KINDS[kind.value].label, kind: kind.value, folder_id: scope.value, can_write: access.value === '1' }))
      if (r) { name.value = ''; draw(); copy(`${location.origin}/s/${r.link.token}`, 'Link created and copied') }
    },
  }, h('div.grid2', {}, field('Agent name', name), field('Kind', kind), field('Scope', scope), field('Access', access)),
  actions(h('button.btn.primary', { type: 'submit' }, icon('link'), 'Create link')))
  modal(`Share ${d.project.name}`, h('div', {},
    h('p.hint', {}, 'A link opens the project (or one folder) for whoever has it: a readable page, a markdown version and a JSON index. Read + write links can also post and upload. Chat apps that cannot post: paste their reply with “as GPT / Claude” in the composer.'),
    form, h('div.section-label', {}, 'Links'), list), { cls: 'wide' })
  draw()
  setTimeout(() => name.focus())
}

// ── palette ────────────────────────────────────────────────────
const fuzzy = (s, q) => { let i = 0; for (const c of s) if (c === q[i]) i++; return i === q.length }
function snippet(body, q) {
  const flat = body.replace(/\s+/g, ' ')
  const i = flat.toLowerCase().indexOf(q.toLowerCase())
  return (i > 30 ? '…' : '') + flat.slice(Math.max(0, i - 30), i + 70)
}
function palette() {
  if (layer.querySelector('.palette')) return
  closeMenu()
  const input = h('input.pinput', { placeholder: 'Jump to a project, folder or file, or search messages…', autocomplete: 'off', spellcheck: 'false' })
  const list = h('div.plist')
  let items = [], sel = 0, remote = [], timer
  const d = S.detail
  const acts = [
    { label: 'New project', icon: 'plus', run: newProject },
    d && { label: 'New folder here', icon: 'folderPlus', run: () => newFolder() },
    d && { label: 'New note here', icon: 'note', run: newNote },
    d && { label: 'Upload files here', icon: 'upload', run: pickUpload },
    d && { label: 'Share this folder', icon: 'link', run: () => shareDialog() },
    { label: 'Toggle theme', icon: isDark() ? 'sun' : 'moon', run: toggleTheme },
    { label: 'Sign out', icon: 'logout', run: logout },
  ].filter(Boolean).map(a => ({ ...a, hint: 'Action' }))
  const base = [
    ...S.projects.map(p => ({ label: p.name, hint: 'Project', icon: 'box', run: () => go(`/p/${p.slug}`) })),
    ...(d ? d.folders.filter(f => f.parent_id).map(f => ({ label: pathOf(f.id), hint: d.project.name, icon: 'folder', run: () => go(urlFor({ folderId: f.id, tab: 'thread' })) })) : []),
    ...S.files.map(f => ({ label: f.name, hint: where(), icon: 'file', run: () => openFile(f.id) })),
    ...acts,
  ]
  const draw = () => {
    const q = input.value.trim().toLowerCase()
    const hit = base.filter(i => !q || i.label.toLowerCase().includes(q))
    const loose = q ? base.filter(i => !hit.includes(i) && fuzzy(i.label.toLowerCase(), q)) : []
    items = [...hit, ...loose, ...remote].slice(0, 80)
    sel = Math.min(sel, Math.max(0, items.length - 1))
    list.replaceChildren(...(items.length ? items.map((it, i) => h('button.pitem' + (i === sel ? '.on' : ''), {
      onclick: () => pick(i), onmousemove: () => { if (sel !== i) { sel = i; draw() } },
    }, icon(it.icon), h('span.plabel', {}, it.label), it.sub ? h('span.psub', {}, it.sub) : null, h('span.phint', {}, it.hint))) : [h('p.pnone', {}, 'Nothing found')]))
    list.querySelector('.on')?.scrollIntoView({ block: 'nearest' })
  }
  const pick = i => { const it = items[i]; if (it) { m.close(); it.run() } }
  input.addEventListener('input', () => {
    sel = 0; remote = []; draw(); clearTimeout(timer)
    const q = input.value.trim()
    if (q.length < 2) return
    timer = setTimeout(async () => {
      const r = await api('GET', `/api/search?q=${encodeURIComponent(q)}`).catch(() => null)
      if (!r || input.value.trim() !== q) return
      remote = [
        ...r.messages.map(x => ({ label: snippet(x.body, q), sub: x.author, hint: 'Message', icon: 'thread', run: () => go(`/p/${x.slug}/f/${x.folder_id}#m-${x.id}`) })),
        ...r.files.map(x => ({ label: x.name, hint: 'File', icon: 'file', run: () => go(`/p/${x.slug}/f/${x.folder_id}?file=${x.id}`) })),
      ]
      draw()
    }, 180)
  })
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); draw() }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); draw() }
    else if (e.key === 'Enter') { e.preventDefault(); pick(sel) }
  })
  const m = modal(null, h('div.palette', {}, h('div.pbar', {}, icon('search'), input, h('kbd', {}, 'esc')), list), { cls: 'pal' })
  draw()
  input.focus()
}

// ── render: shell ──────────────────────────────────────────────
function render() {
  if (!S.owner) {
    side = null; composer = null
    root.className = 'login'
    root.replaceChildren(loginView())
    layer.replaceChildren()
    return
  }
  if (!side) {
    root.className = 'shell'
    side = h('aside.side')
    bar = h('header.bar'); view = h('section.view'); slot = h('div.slot')
    root.replaceChildren(side, h('main.main', {}, bar, view, slot), h('div.scrim', { onclick: () => document.body.classList.remove('nav-open') }))
  }
  renderSide(); renderBar(); renderView(); renderSlot(); renderDrawer()
}

function loginView() {
  const key = h('input', { type: 'password', placeholder: 'Owner key', autocomplete: 'current-password', 'aria-label': 'Owner key' })
  const err = h('p.err')
  const btn = h('button.btn.primary.wide', { type: 'submit' }, 'Continue')
  setTimeout(() => key.focus())
  return h('form.login-card', {
    onsubmit: async e => {
      e.preventDefault(); btn.disabled = true; err.textContent = ''
      try {
        await api('POST', '/api/login', { key: key.value })
        S.owner = true
        await loadProjects()
        await onRoute()
      } catch (x) { err.textContent = x.message; btn.disabled = false }
    },
  }, h('div.brand.big', {}, h('span.logo'), 'Relay'), h('p.muted', {}, 'One workspace for you and your agents.'),
  S.configured ? [key, btn, err] : h('p.err', {}, 'Set the OWNER_KEY secret on the server, then reload.'))
}

function avatar(kind, author, cls = '') {
  const k = KINDS[kind] ? kind : 'agent'
  return h('span.av' + cls, { 'data-kind': k, title: `${author} · ${KINDS[k].label}` }, KINDS[k].glyph || initials(author))
}
const kindChip = k => (k && k !== 'human' ? h('span.kind', { 'data-kind': k }, KINDS[k]?.label ?? k) : null)
const fileIcon = f => icon(isImage(f.mime) ? 'image' : isText(f.name, f.mime) ? 'note' : 'file')

function renderSide() {
  const d = S.detail
  const kids = new Map()
  for (const f of d?.folders ?? []) if (f.parent_id) kids.set(f.parent_id, [...(kids.get(f.parent_id) ?? []), f])
  const tree = []
  const walk = (id, depth) => {
    for (const f of kids.get(id) ?? []) {
      const has = kids.has(f.id), shut = !!collapsed[f.id], on = f.id === S.folderId
      tree.push(h('a.row.folder' + (on ? '.on' : '') + (unread(f) ? '.unread' : ''), {
        href: urlFor({ folderId: f.id, tab: on ? S.tab : 'thread' }), onclick: nav, draggable: 'true',
        ondragstart: e => dragItem(e, 'folder', f.id), vars: { '--d': depth }, ...dropTarget(f.id),
      },
      h('span.twisty', { onclick: e => { stop(e); if (has) toggleFolder(f.id) } }, has ? icon('chevron', shut ? '' : '.open') : null),
      icon('folder'), h('span.name', {}, f.name),
      h('span.meta', {}, unread(f) ? h('i.dot') : f.messages + f.files || ''),
      h('button.icon-btn.sm.hover', { title: 'New subfolder', onclick: e => { stop(e); newFolder(f.id) } }, icon('plus')),
      h('button.icon-btn.sm.hover', { title: 'More', onclick: e => { stop(e); menu(e.currentTarget, folderMenu(f)) } }, icon('more'))))
      if (has && !shut) walk(f.id, depth + 1)
    }
  }
  if (d) walk(d.project.root_id, 1)
  side.replaceChildren(
    h('div.side-head', {}, h('div.brand', {}, h('span.logo'), 'Relay'), h('div.grow'),
      h('button.icon-btn', { title: isDark() ? 'Light theme' : 'Dark theme', onclick: toggleTheme }, icon(isDark() ? 'sun' : 'moon'))),
    h('button.search', { onclick: palette }, icon('search'), h('span.slabel', {}, 'Search or jump to…'), h('kbd', {}, '⌘K')),
    h('div.side-scroll', {},
      h('div.section-label', {}, h('span', {}, 'Projects'), h('button.icon-btn.sm', { title: 'New project', onclick: newProject }, icon('plus'))),
      S.projects.map(p => {
        const open = d?.project.id === p.id
        return [
          h('a.row.project' + (open && S.folderId === p.root_id ? '.on' : ''), { href: `/p/${p.slug}`, onclick: nav, ...dropTarget(p.root_id) },
            h('span.pav', { vars: { '--h': hue(p.name) } }, p.name.trim()[0]?.toUpperCase() ?? '?'),
            h('span.name', {}, p.name), h('span.meta', {}, p.messages + p.files || ''),
            h('button.icon-btn.sm.hover', { title: 'Project', onclick: e => { stop(e); menu(e.currentTarget, projectMenu(p)) } }, icon('more'))),
          open ? h('div.tree', {}, tree) : null,
        ]
      }),
      S.projects.length ? null : h('p.side-empty', {}, 'No projects yet.')),
    h('div.side-foot', {}, h('span.muted', {}, 'Drop files on any folder'), h('div.grow'),
      h('button.icon-btn', { title: 'Sign out', onclick: logout }, icon('logout'))))
}

function renderBar() {
  const d = S.detail
  const c = cur()
  const crumbs = d
    ? chain(S.folderId).map((f, i, a) => i === a.length - 1
      ? h('span.crumb.here', {}, f.name)
      : h('a.crumb', { href: urlFor({ folderId: f.id }), onclick: nav }, f.name))
    : [h('span.crumb.here', {}, 'Relay')]
  const tab = (t, label, n) => h('a.tab' + (S.tab === t ? '.on' : ''), { href: urlFor({ tab: t }), onclick: nav, role: 'tab' }, label, n ? h('span.count', {}, n) : null)
  bar.replaceChildren(
    h('button.icon-btn.menu-btn', { 'aria-label': 'Menu', onclick: () => document.body.classList.toggle('nav-open') }, icon('menu')),
    h('nav.crumbs', {}, crumbs.flatMap((x, i) => (i ? [h('span.sep', {}, '/'), x] : [x]))),
    d ? h('div.tabs', { role: 'tablist' }, tab('thread', 'Thread', c?.messages), tab('files', 'Files', c?.files)) : null,
    h('div.grow'),
    d ? h('button.btn.ghost.sm', { onclick: () => shareDialog(), title: 'Share with an agent' }, icon('link'), h('span.lbl', {}, 'Share')) : null,
    d ? h('button.icon-btn', { title: 'Upload files (U)', onclick: pickUpload }, icon('upload')) : null,
    d ? h('button.icon-btn', { title: 'New folder', onclick: () => newFolder() }, icon('folderPlus')) : null)
}

// ── render: thread ─────────────────────────────────────────────
function renderView() {
  const d = S.detail
  if (!d) { view.className = 'view'; view.replaceChildren(emptyProjects()); return }
  if (S.tab === 'files') { view.className = 'view files'; view.replaceChildren(filesView()); return }
  if (S.editing && view.contains(document.activeElement)) return
  const nearBottom = view.scrollHeight - view.scrollTop - view.clientHeight < 120
  const top = view.scrollTop
  view.className = 'view thread'
  view.replaceChildren(threadView())
  view.scrollTop = stick || nearBottom ? view.scrollHeight : top
  stick = false
}

function emptyProjects() {
  return h('div.empty', {}, h('span.logo.big'), h('h3', {}, 'No projects yet'),
    h('p', {}, 'A project is a tree of folders. Every folder has a thread and files, and can be shared with an agent.'),
    h('button.btn.primary', { onclick: newProject }, icon('plus'), 'New project'))
}

function threadView() {
  const wrap = h('div.msgs')
  if (S.more) wrap.append(h('button.btn.sm.older', { onclick: loadOlder }, 'Load earlier messages'))
  if (!S.msgs.length) {
    wrap.append(h('div.empty.small', {}, icon('thread', '.big'), h('h3', {}, `Nothing in ${where()} yet`),
      h('p', {}, 'Write below, drop files, or share this folder with Claude, GPT or any agent.'),
      h('button.btn.sm', { onclick: () => shareDialog() }, icon('link'), 'Share this folder')))
    return wrap
  }
  let prev = null, day = ''
  for (const m of S.msgs) {
    const label = dayLabel(m.created_at)
    if (label !== day) { wrap.append(h('div.day', {}, h('span', {}, label))); day = label; prev = null }
    wrap.append(msgEl(m, prev))
    prev = m
  }
  return wrap
}

function msgEl(m, prev) {
  const joined = prev && prev.author === m.author && prev.kind === m.kind && m.created_at - prev.created_at < 300_000
  const editing = S.editing === m.id
  return h('article.msg' + (joined ? '.joined' : ''), { id: 'm-' + m.id, 'data-kind': m.kind },
    joined ? h('time.gut', { title: full(m.created_at) }, clock(m.created_at)) : avatar(m.kind, m.author),
    h('div.mbody', {},
      joined ? null : h('header', {}, h('strong', {}, m.author), kindChip(m.kind), h('time', { title: full(m.created_at) }, clock(m.created_at)),
        m.edited_at ? h('span.edited', { title: full(m.edited_at) }, 'edited') : null),
      editing ? editBox(m) : m.body ? h('div.md', { html: renderMarkdown(m.body) }) : null,
      m.files.length ? h('div.atts', {}, m.files.map(attEl)) : null),
    editing ? null : h('div.macts', {},
      h('button.icon-btn.sm', { title: 'Copy markdown', onclick: () => copy(m.body) }, icon('copy')),
      h('button.icon-btn.sm', { title: 'Edit', onclick: () => { S.editing = m.id; S.editText = null; renderView() } }, icon('edit')),
      h('button.icon-btn.sm', {
        title: 'Delete',
        onclick: async () => { if (await confirmBox('Delete message?', 'Attachments stay in the folder’s files.')) await mutate(() => api('DELETE', `/api/messages/${m.id}`)) },
      }, icon('trash'))))
}

function attEl(f) {
  const open = e => { stop(e); openFile(f.id) }
  const raw = `/api/files/${f.id}/raw`
  return isImage(f.mime) && f.mime !== 'image/svg+xml'
    ? h('a.att-img', { href: raw, onclick: open, title: f.name }, h('img', { src: raw, alt: f.name, loading: 'lazy' }))
    : h('a.att', { href: raw, onclick: open }, fileIcon(f), h('span', {}, f.name), h('small', {}, fmtBytes(f.size)))
}

function editBox(m) {
  const ta = h('textarea.edit', { value: S.editText ?? m.body, oninput: e => { S.editText = e.target.value; grow() } })
  const grow = () => { ta.style.height = 'auto'; ta.style.height = ta.scrollHeight + 2 + 'px' }
  const cancel = () => { S.editing = null; S.editText = null; renderView() }
  const save = async () => {
    const r = await mutate(() => api('PATCH', `/api/messages/${m.id}`, { body: ta.value }))
    if (r) cancel()
  }
  ta.addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save() }
    if (e.key === 'Escape') { e.stopPropagation(); cancel() }
  })
  setTimeout(() => { grow(); ta.focus() })
  return h('div.editwrap', {}, ta, actions(h('button.btn.sm', { onclick: cancel }, 'Cancel'), h('button.btn.sm.primary', { onclick: save }, 'Save')))
}

// ── render: composer ───────────────────────────────────────────
const defName = k => (k === 'human' ? 'Your name' : KINDS[k].label)
function buildComposer() {
  const folderId = S.folderId
  const as = store.get('as', { kind: 'human', names: {} })
  const ta = h('textarea', { rows: 1, placeholder: `Message ${where()} · markdown works`, value: S.drafts[folderId] ?? '' })
  const name = h('input.as-name', { value: as.names[as.kind] ?? '', placeholder: defName(as.kind), maxlength: 60, 'aria-label': 'Display name',
    oninput: () => { as.names[kind.value] = name.value; store.set('as', as) } })
  const kind = h('select.as', {
    title: 'Post as', 'aria-label': 'Post as',
    onchange: () => { as.kind = kind.value; store.set('as', as); name.value = as.names[kind.value] ?? ''; name.placeholder = defName(kind.value) },
  }, h('option', { value: 'human' }, 'Me'), ['claude', 'gpt', 'gemini', 'agent'].map(k => h('option', { value: k }, KINDS[k].label)))
  kind.value = as.kind
  const chips = h('div.chips')
  const picker = h('input', { type: 'file', multiple: true, hidden: true, onchange: async () => { await attach([...picker.files]); picker.value = '' } })
  const send = h('button.btn.primary.sm.send', { type: 'submit', title: 'Send (⌘↵)' }, 'Send', h('kbd', {}, '⌘↵'))
  const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 320) + 'px' }
  async function submit() {
    const body = ta.value.trim()
    if (!body && !S.pending.length) return ta.focus()
    send.disabled = true
    const author = name.value.trim() || (kind.value === 'human' ? 'Owner' : KINDS[kind.value].label)
    const r = await mutate(() => api('POST', `/api/folders/${folderId}/messages`, { body, kind: kind.value, author, file_ids: S.pending.map(f => f.id) }))
    send.disabled = false
    if (!r) return
    ta.value = ''; S.drafts[folderId] = ''; S.pending = []; drawChips(); grow()
    stick = true
    renderView()
  }
  ta.addEventListener('input', () => { S.drafts[folderId] = ta.value; grow() })
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); submit() } })
  ta.addEventListener('paste', e => { const fs = [...(e.clipboardData?.files ?? [])]; if (fs.length) { e.preventDefault(); attach(fs) } })
  function drawChips() {
    chips.replaceChildren(...S.pending.map(f => h('span.chip', {}, fileIcon(f), h('span', {}, f.name), h('small', {}, fmtBytes(f.size)),
      h('button', {
        type: 'button', title: 'Remove',
        onclick: async () => { S.pending = S.pending.filter(x => x.id !== f.id); drawChips(); await api('DELETE', `/api/files/${f.id}`).catch(() => {}) },
      }, icon('x')))))
  }
  const el = h('div.cwrap', {}, h('form.composer', { onsubmit: e => { e.preventDefault(); submit() } }, chips, ta,
    h('div.cbar', {}, h('span.as-label', {}, 'as'), kind, name, h('div.grow'),
      h('button.icon-btn', { type: 'button', title: 'Attach files', onclick: () => picker.click() }, icon('clip')), send), picker))
  requestAnimationFrame(grow)
  return { el, ta, folderId, drawChips }
}

function renderSlot() {
  if (!S.detail || S.tab !== 'thread') return slot.replaceChildren()
  if (!composer || composer.folderId !== S.folderId) composer = buildComposer()
  if (slot.firstChild !== composer.el) slot.replaceChildren(composer.el)
}

// ── render: files ──────────────────────────────────────────────
function filesView() {
  const subs = S.detail.folders.filter(f => f.parent_id === S.folderId)
  const wrap = h('div.fwrap', {}, h('div.ftools', {},
    h('span.muted', {}, `${S.files.length} file${S.files.length === 1 ? '' : 's'}${subs.length ? ` · ${subs.length} folder${subs.length === 1 ? '' : 's'}` : ''}`), h('div.grow'),
    h('button.btn.sm', { onclick: newNote }, icon('note'), 'New note'),
    h('button.btn.sm', { onclick: pickUpload }, icon('upload'), 'Upload')))
  if (!S.files.length && !subs.length) {
    wrap.append(h('div.empty.small', {}, icon('upload', '.big'), h('h3', {}, 'Drop files here'),
      h('p', {}, 'Anything up to 25 MB. Agents with a write link can add files too.'), h('button.btn.sm', { onclick: pickUpload }, 'Choose files')))
    return wrap
  }
  wrap.append(h('div.ftable', { role: 'table' },
    h('div.frow.fhead', {}, h('span', {}, 'Name'), h('span', {}, 'Size'), h('span', {}, 'By'), h('span', {}, 'Updated'), h('span')),
    subs.map(f => h('a.frow.dir', { href: urlFor({ folderId: f.id, tab: 'files' }), onclick: nav, ...dropTarget(f.id), draggable: 'true', ondragstart: e => dragItem(e, 'folder', f.id) },
      h('span.fname', {}, icon('folder'), h('span', {}, f.name)), h('span.muted', {}, `${f.files} file${f.files === 1 ? '' : 's'}`), h('span'),
      h('span.muted', {}, f.last_at ? rel(f.last_at) : ''), h('span'))),
    S.files.map(f => h('div.frow' + (S.fileId === f.id ? '.on' : ''), { draggable: 'true', ondragstart: e => dragItem(e, 'file', f.id), onclick: () => openFile(f.id) },
      h('span.fname', {}, fileIcon(f), h('span', {}, f.name)),
      h('span.muted', {}, fmtBytes(f.size)),
      h('span.by', {}, avatar(f.kind, f.author, '.xs'), h('span', {}, f.author)),
      h('span.muted', { title: full(f.updated_at) }, rel(f.updated_at)),
      h('span.acts', {},
        h('a.icon-btn.sm', { href: `/api/files/${f.id}/raw?download=1`, title: 'Download', onclick: e => e.stopPropagation() }, icon('download')),
        h('button.icon-btn.sm', { title: 'More', onclick: e => { stop(e); menu(e.currentTarget, fileMenu(f)) } }, icon('more')))))))
  return wrap
}

async function loadText(f) {
  const key = `${f.id}:${f.updated_at}`
  if (!textCache.has(key)) textCache.set(key, fetch(`/api/files/${f.id}/raw`).then(r => r.text()))
  return textCache.get(key)
}

/** Background re-renders leave an open editor alone; user actions pass force. */
function renderDrawer(force = false) {
  let el = layer.querySelector('.drawer')
  const f = S.fileId && S.files.find(x => x.id === S.fileId)
  if (!f) { el?.remove(); return }
  if (!force && drawer.id === f.id && drawer.editing && el) return
  if (drawer.id !== f.id) drawer = { id: f.id, editing: false, source: false }
  const raw = `/api/files/${f.id}/raw`
  const text = isText(f.name, f.mime)
  const md = isMarkdown(f.name)
  const body = h('div.dbody')
  if (drawer.editing) {
    const ta = h('textarea.editor', { spellcheck: 'false', placeholder: 'Loading…' })
    const save = async () => {
      const r = await mutate(() => api('PUT', `/api/files/${f.id}/raw`, new Blob([ta.value], { type: 'text/plain' })))
      if (r) { drawer.editing = false; renderDrawer(true) }
    }
    ta.addEventListener('keydown', e => { if (e.key === 's' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save() } })
    loadText(f).then(t => { ta.value = t; ta.placeholder = md ? 'Markdown…' : ''; ta.focus() })
    body.append(ta, actions(h('button.btn.sm', { onclick: () => { drawer.editing = false; renderDrawer(true) } }, 'Cancel'), h('button.btn.sm.primary', { onclick: save }, 'Save', h('kbd', {}, '⌘S'))))
  } else if (isImage(f.mime)) body.append(h('div.imgwrap', {}, h('img', { src: raw, alt: f.name })))
  else if (/^video\//.test(f.mime)) body.append(h('video', { src: raw, controls: true }))
  else if (/^audio\//.test(f.mime)) body.append(h('audio', { src: raw, controls: true }))
  else if (f.mime === 'application/pdf') body.append(h('iframe.pdf', { src: raw, title: f.name }))
  else if (text) {
    const out = h('div.textprev', {}, h('p.muted', {}, 'Loading…'))
    body.append(out)
    loadText(f).then(t => {
      const cut = t.length > 400_000
      const shown = cut ? t.slice(0, 400_000) : t
      out.replaceChildren(md && !drawer.source && !cut ? h('div.md', { html: renderMarkdown(shown) }) : h('pre.code', {}, h('code', {}, shown)),
        cut ? h('p.muted', {}, 'Preview shows the first 400 KB. Download for the rest.') : null)
    })
  } else body.append(h('div.empty.small', {}, fileIcon(f), h('p', {}, 'No preview for this type.'), h('a.btn.sm', { href: raw + '?download=1' }, icon('download'), 'Download')))
  const next = h('aside.drawer', { 'aria-label': f.name },
    h('div.dhead', {}, fileIcon(f), h('div.dtitle', {}, h('strong', {}, f.name), h('span.muted', {}, `${fmtBytes(f.size)} · ${f.author} · ${rel(f.updated_at)}`)),
      h('div.grow'),
      md && !drawer.editing ? h('button.icon-btn', { title: drawer.source ? 'Preview' : 'Source', onclick: () => { drawer.source = !drawer.source; renderDrawer(true) } }, icon(drawer.source ? 'eye' : 'code')) : null,
      text && !drawer.editing ? h('button.icon-btn', { title: 'Edit', onclick: () => { drawer.editing = true; renderDrawer(true) } }, icon('edit')) : null,
      h('a.icon-btn', { href: raw + '?download=1', title: 'Download' }, icon('download')),
      h('button.icon-btn', { title: 'More', onclick: e => menu(e.currentTarget, fileMenu(f).slice(1)) }, icon('more')),
      h('button.icon-btn', { title: 'Close (Esc)', onclick: closeFile }, icon('x'))),
    body)
  if (el) el.replaceWith(next); else layer.append(next)
}

// ── keys & boot ────────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const a = document.activeElement
  const typing = a && (/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) || a.isContentEditable)
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && S.owner) { e.preventDefault(); palette(); return }
  if (e.key === 'Escape') {
    if (closeMenu()) return
    const top = [...layer.querySelectorAll('.overlay')].pop()
    if (top) return top.close()
    if (S.fileId && !drawer.editing) return closeFile()
    if (drawer.editing) { drawer.editing = false; return renderDrawer(true) }
    return
  }
  if (typing || e.metaKey || e.ctrlKey || e.altKey || !S.owner || !S.detail || layer.querySelector('.overlay')) return
  if (e.key === '/') { e.preventDefault(); palette() }
  else if (e.key === 'c') { e.preventDefault(); if (S.tab !== 'thread') go(urlFor({ tab: 'thread' })); setTimeout(() => composer?.ta.focus()) }
  else if (e.key === 'u') { e.preventDefault(); pickUpload() }
})

async function loadProjects() { S.projects = (await api('GET', '/api/projects')).projects }

async function boot() {
  applyTheme()
  root = document.getElementById('app')
  layer = h('div.layer'); toasts = h('div.toasts')
  document.body.append(layer, toasts)
  try {
    const me = await api('GET', '/api/me')
    S.owner = me.owner; S.configured = me.configured
    if (S.owner) await loadProjects()
  } catch (e) { toast(e.message) }
  await onRoute()
  pulse()
}
boot()
