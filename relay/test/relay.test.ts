import { test } from 'node:test'
import assert from 'node:assert/strict'
import { DatabaseSync } from 'node:sqlite'
import { handle } from '../src/app.ts'
import { nodeSql } from '../src/sql.ts'
import { Store } from '../src/store.ts'
import { renderMarkdown } from '../public/shared.js'

const KEY = 'test-owner-key-0123456789'
let ipN = 0

interface Call { body?: unknown; raw?: BodyInit; type?: string; headers?: Record<string, string>; auth?: boolean }

function setup() {
  const store = new Store(nodeSql(new DatabaseSync(':memory:')))
  const ip = `10.0.0.${++ipN}`
  const call = (method: string, path: string, o: Call = {}) => {
    const headers: Record<string, string> = { ...(o.auth === false ? {} : { authorization: `Bearer ${KEY}` }), ...o.headers }
    if (o.body !== undefined) headers['content-type'] = 'application/json'
    if (o.type) headers['content-type'] = o.type
    const body = o.raw ?? (o.body !== undefined ? JSON.stringify(o.body) : undefined)
    return handle(new Request('https://relay.test' + path, { method, headers, body }), { store, ownerKey: KEY, maxFileBytes: 1 << 20, ip })
  }
  const j = async (method: string, path: string, o: Call = {}) => {
    const res = await call(method, path, o)
    return { status: res.status, data: (await res.json()) as any }
  }
  return { store, call, j }
}

test('first run seeds M/ARC with the software folders and a welcome message', async () => {
  const { j } = setup()
  const { data } = await j('GET', '/api/projects')
  assert.equal(data.projects.length, 1)
  assert.equal(data.projects[0].slug, 'm-arc')
  const d = (await j('GET', '/api/projects/m-arc')).data
  const names = d.folders.map((f: any) => f.name).sort()
  for (const n of ['agents', 'claude', 'gpt', 'handoffs', 'docs', 'architecture', 'decisions', 'design', 'tasks', 'releases']) assert.ok(names.includes(n), n)
  const msgs = (await j('GET', `/api/folders/${d.project.root_id}/messages`)).data
  assert.equal(msgs.messages.length, 1)
})

test('owner auth: bearer, login cookie, x-relay header on cookie writes, rate limit', async () => {
  const { call, j } = setup()
  assert.equal((await call('GET', '/api/projects', { auth: false })).status, 401)
  assert.equal((await j('POST', '/api/login', { auth: false, body: { key: 'nope' } })).status, 401)
  const ok = await call('POST', '/api/login', { auth: false, body: { key: KEY } })
  assert.equal(ok.status, 200)
  const cookie = (ok.headers.get('set-cookie') ?? '').split(';')[0] ?? ''
  assert.match(ok.headers.get('set-cookie') ?? '', /HttpOnly; SameSite=Lax.*Secure/)
  assert.equal((await call('GET', '/api/projects', { auth: false, headers: { cookie } })).status, 200)
  assert.equal((await call('POST', '/api/projects', { auth: false, headers: { cookie }, body: { name: 'X' } })).status, 403)
  assert.equal((await call('POST', '/api/projects', { auth: false, headers: { cookie, 'x-relay': '1' }, body: { name: 'X' } })).status, 201)
  assert.equal((await call('GET', '/api/projects', { auth: false, headers: { cookie: cookie.replace(/.$/, 'x') } })).status, 401)
  for (let i = 0; i < 10; i++) await call('POST', '/api/login', { auth: false, body: { key: 'wrong' } })
  assert.equal((await call('POST', '/api/login', { auth: false, body: { key: KEY } })).status, 429)
})

test('folders: unique names, no moving into itself, recursive delete', async () => {
  const { j, store } = setup()
  const p = (await j('POST', '/api/projects', { body: { name: 'Side', template: 'empty' } })).data.project
  const a = (await j('POST', `/api/projects/${p.id}/folders`, { body: { name: 'a' } })).data.folder
  const b = (await j('POST', `/api/projects/${p.id}/folders`, { body: { name: 'b', parent_id: a.id } })).data.folder
  assert.equal((await j('POST', `/api/projects/${p.id}/folders`, { body: { name: 'A' } })).status, 409)
  assert.equal((await j('POST', `/api/projects/${p.id}/folders`, { body: { name: '..' } })).status, 400)
  assert.equal((await j('PATCH', `/api/folders/${a.id}`, { body: { parent_id: b.id } })).status, 400)
  await j('POST', `/api/folders/${b.id}/messages`, { body: { body: 'hi' } })
  await j('POST', `/api/folders/${b.id}/files?name=x.txt`, { raw: 'x', type: 'text/plain' })
  assert.equal((await j('DELETE', `/api/folders/${a.id}`)).status, 200)
  assert.equal(store.sql.get(`SELECT COUNT(*) AS n FROM messages WHERE folder_id = ?`, b.id)?.n, 0)
  assert.equal(store.sql.get(`SELECT COUNT(*) AS n FROM chunks`)?.n, 0)
})

test('messages carry attachments; files dedupe names and stream back exactly', async () => {
  const { j, call } = setup()
  const d = (await j('GET', '/api/projects/m-arc')).data
  const root = d.project.root_id
  const bytes = new Uint8Array(2_500_000 % (1 << 20)).map((_, i) => i % 251)
  const f1 = (await j('POST', `/api/folders/${root}/files?name=plan.md`, { raw: '# Plan', type: 'text/markdown' })).data.file
  const f2 = (await j('POST', `/api/folders/${root}/files?name=plan.md`, { raw: bytes, type: 'application/octet-stream' })).data.file
  assert.equal(f2.name, 'plan (2).md')
  const m = (await j('POST', `/api/folders/${root}/messages`, { body: { body: '', kind: 'gpt', author: 'GPT-5.6', file_ids: [f1.id] } })).data.message
  assert.equal(m.kind, 'gpt')
  assert.equal(m.files[0].id, f1.id)
  const back = new Uint8Array(await (await call('GET', `/api/files/${f2.id}/raw`)).arrayBuffer())
  assert.deepEqual(back, bytes)
  assert.equal((await j('POST', `/api/folders/${root}/messages`, { body: { body: '  ' } })).status, 400)
})

test('raw files never execute: html is text/plain, unknown types download, sandbox CSP', async () => {
  const { j, call } = setup()
  const root = (await j('GET', '/api/projects/m-arc')).data.project.root_id
  const html = (await j('POST', `/api/folders/${root}/files?name=x.html`, { raw: '<script>alert(1)</script>', type: 'text/html' })).data.file
  const bin = (await j('POST', `/api/folders/${root}/files?name=x.bin`, { raw: 'zz', type: 'application/x-evil' })).data.file
  const r1 = await call('GET', `/api/files/${html.id}/raw`)
  assert.equal(r1.headers.get('content-type'), 'text/plain; charset=utf-8')
  assert.match(r1.headers.get('content-security-policy') ?? '', /sandbox/)
  const r2 = await call('GET', `/api/files/${bin.id}/raw`)
  assert.equal(r2.headers.get('content-type'), 'application/octet-stream')
  assert.match(r2.headers.get('content-disposition') ?? '', /^attachment/)
  assert.equal(r2.headers.get('x-content-type-options'), 'nosniff')
  assert.equal(r2.headers.get('referrer-policy'), 'no-referrer')
})

test('read-only agent link: html, markdown, json, scope, no writes, revoke', async () => {
  const { j, call, store } = setup()
  const d = (await j('GET', '/api/projects/m-arc')).data
  const gpt = d.folders.find((f: any) => f.name === 'gpt')
  const docs = d.folders.find((f: any) => f.name === 'docs')
  await j('POST', `/api/folders/${gpt.id}/messages`, { body: { body: 'secret-in-gpt' } })
  await j('POST', `/api/folders/${docs.id}/messages`, { body: { body: 'secret-in-docs' } })
  const outside = (await j('POST', `/api/folders/${docs.id}/files?name=d.txt`, { raw: 'd', type: 'text/plain' })).data.file
  const link = (await j('POST', `/api/projects/${d.project.id}/links`, { body: { name: 'GPT-5.6', kind: 'gpt', folder_id: gpt.id } })).data.link
  assert.match(link.token, /^rl_[A-Za-z0-9]{32}$/)
  const s = `/s/${link.token}`
  const page = await call('GET', s, { auth: false, headers: { accept: 'text/html' } })
  const html = await page.text()
  assert.equal(page.status, 200)
  assert.match(page.headers.get('content-security-policy') ?? '', /script-src 'self'/)
  assert.ok(html.includes('secret-in-gpt') && !html.includes('secret-in-docs'))
  assert.ok(html.includes('read-only') && !html.includes('<form'))
  const md = await (await call('GET', s, { auth: false, headers: { accept: 'text/markdown' } })).text()
  assert.ok(md.includes('secret-in-gpt') && md.includes('read-only'))
  const tree = await (await call('GET', `${s}/tree.json`, { auth: false })).json() as any
  assert.deepEqual(tree.folders.map((f: any) => f.path), [''])
  assert.equal((await call('GET', `${s}/f/..%2Fdocs`, { auth: false })).status, 400)
  assert.equal((await call('GET', `${s}/context.md?folder=../docs`, { auth: false })).status, 400)
  assert.equal((await call('GET', `${s}/raw/${outside.id}/d.txt`, { auth: false })).status, 404)
  assert.equal((await call('POST', `${s}/messages`, { auth: false, body: { folder: '', body: 'x' } })).status, 403)
  assert.equal((await call('GET', '/api/projects', { auth: false, headers: { authorization: `Bearer ${link.token}` } })).status, 401)
  store.deleteLink(link.id)
  assert.equal((await call('GET', s, { auth: false })).status, 404)
})

test('write agent link: post JSON and form, put files by path, mkdir, context.md', async () => {
  const { j, call } = setup()
  const d = (await j('GET', '/api/projects/m-arc')).data
  const link = (await j('POST', `/api/projects/${d.project.id}/links`, { body: { name: 'Claude Code', kind: 'claude', can_write: true } })).data.link
  const s = `/s/${link.token}`
  const posted = await call('POST', `${s}/messages`, { auth: false, body: { folder: 'agents/claude', body: 'Phase 0 done', author: 'Claude · Opus' } })
  assert.equal(posted.status, 201)
  const pm = (await posted.json()) as any
  assert.equal(pm.message.author, 'Claude · Opus')
  assert.equal((await call('POST', `${s}/messages`, { auth: false, body: { folder: 'nope', body: 'x' } })).status, 404)
  const put1 = await call('PUT', `${s}/files/docs/PROJECT_STATE.md`, { auth: false, raw: '# State v1', type: 'text/markdown' })
  assert.equal(put1.status, 201)
  const put2 = await call('PUT', `${s}/files/docs/PROJECT_STATE.md`, { auth: false, raw: '# State v2', type: 'text/markdown' })
  assert.equal(put2.status, 200)
  const mk = await call('POST', `${s}/folders`, { auth: false, body: { path: 'agents/codex/notes' } })
  assert.equal(((await mk.json()) as any).folder.path, 'agents/codex/notes')
  const form = new FormData()
  form.set('folder', 'agents/codex')
  form.set('body', 'from a browser agent')
  form.append('file', new File(['hello'], 'hello.txt', { type: 'text/plain' }))
  const viaForm = await call('POST', `${s}/messages`, { auth: false, raw: form, headers: { accept: 'text/html' } })
  assert.equal(viaForm.status, 303)
  assert.match(viaForm.headers.get('location') ?? '', /\/f\/agents\/codex#m-/)
  const ctx = await (await call('GET', `${s}/context.md`, { auth: false })).text()
  assert.ok(ctx.includes('# State v2') && !ctx.includes('# State v1'))
  assert.ok(ctx.includes('Phase 0 done') && ctx.includes('from a browser agent') && ctx.includes('hello.txt'))
  const who = (await j('GET', `/api/projects/${d.project.id}`)).data.folders.find((f: any) => f.name === 'claude')
  const msgs = (await j('GET', `/api/folders/${who.id}/messages`)).data.messages
  assert.equal(msgs[0].via, link.id)
  assert.equal(msgs[0].kind, 'claude')
})

test('markdown is escaped except for the supported constructs', () => {
  const html = renderMarkdown('<script>alert(1)</script>\n\n[x](javascript:alert(1)) <img src=x onerror=alert(1)>\n\n**b** _i_ `c<d>` https://example.com/a?b=1.')
  assert.ok(!html.includes('<script') && !html.includes('<img'))
  assert.ok(html.includes('href="#"'))
  assert.ok(html.includes('<strong>b</strong>') && html.includes('<em>i</em>') && html.includes('<code>c&lt;d&gt;</code>'))
  assert.ok(html.includes('href="https://example.com/a?b=1"'))
  const t = renderMarkdown('| a | b |\n|---|--:|\n| 1 | 2 |\n\n- [x] done\n  - nested\n1. one\n\n```js\nconst a = "<b>"\n```')
  assert.ok(t.includes('<table>') && t.includes('class="al-r"'))
  assert.ok(t.includes('checked') && t.includes('<ul><li>nested</li></ul>'))
  assert.ok(t.includes('data-lang="js"') && t.includes('&lt;b&gt;'))
})
