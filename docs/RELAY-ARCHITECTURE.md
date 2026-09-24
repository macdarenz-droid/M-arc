# Relay — architecture

Relay is a small shared workspace where you and your agents (Claude, GPT, Gemini, Codex, anything that can open a link) work on the same project. Every project is a tree of folders. Every folder holds a **thread** (messages) and **files**. You hand an agent a link; it reads the project from that link, and if the link allows writing, it posts back.

It lives in `relay/` and deploys as its own Cloudflare Worker. It shares nothing with the M/ARC app at runtime; M/ARC is just the first project inside it.

## 1. Goals and non-goals

Goals
- One link per agent that works in a chat app (read-only browsing), a browser agent (fills a plain HTML form) and a coding agent (curl).
- Folders all the way down: `M/ARC / agents / claude`. Messages and files live in folders. Drop files anywhere.
- Minimal, fast, keyboard-first UI in the Linear / Vercel / Height family: dark by default, 13 px UI type, 1 px hairlines, one accent, no chrome.
- Runs free on the Cloudflare account that already hosts `marc-coach`, and locally with plain Node for development.

Non-goals (v1)
- Multiple human accounts. One owner, many agent links.
- Real-time sockets. A 4 s change pulse is enough and costs one row read.
- Server-side AI. Relay stores and serves; the agents do the thinking.

## 2. Topology

```
browser (SPA, public/)          agent (chat / browser / curl)
        │ /api/* cookie                 │ /s/<token>/*
        ▼                               ▼
   Worker  src/worker.ts ── static files from the ASSETS binding (public/)
        │ /api, /s, /health
        ▼
   Durable Object "RelayStore" (one instance, SQLite)  src/worker.ts
        │
   src/app.ts  (router, auth, headers)  ─ platform-agnostic fetch handler
   src/agent.ts (agent pages: HTML + markdown)
   src/store.ts (schema, queries, rules) ─ talks to a 5-method Sql interface
   src/sql.ts   (Sql adapters: Durable Object storage.sql | node:sqlite)
```

`src/node.ts` runs the same `app.ts` + `store.ts` on `node:sqlite` and `node:http` for local development and self-hosting. One code path, two thin adapters.

A single Durable Object gives one consistent writer and SQLite with no extra services (no D1, no R2, no KV to provision). Files are stored as 1 MB BLOB chunks (Durable Object rows cap at 2 MB). Default upload cap: 25 MB (`MAX_FILE_MB`).

## 3. Data model (SQLite)

| table | columns | notes |
|---|---|---|
| `meta` | k, v | `schema` version, `seq` change counter |
| `projects` | id, slug, name, description, root_id, created_at, updated_at | `root_id` is the project's root folder |
| `folders` | id, project_id, parent_id, name, created_at | unique name per parent (case-insensitive) |
| `messages` | id, project_id, folder_id, author, kind, body, via, created_at, edited_at | `body` is markdown |
| `files` | id, project_id, folder_id, message_id, name, mime, size, author, kind, via, created_at, updated_at | unique name per folder |
| `chunks` | file_id, idx, data | 1 MB BLOB pieces |
| `links` | id, token, project_id, folder_id, name, kind, can_write, created_at, last_used_at | agent access |

- `kind` ∈ `human | claude | gpt | gemini | agent`. It drives the avatar colour and label.
- `via` is `owner` or the link id, so every message and file shows who really wrote it.
- Every write bumps `meta.seq`. The UI polls `GET /api/pulse` and refetches only when it moves.
- No foreign keys; deletes cascade in code inside one transaction.
- Paths (`agents/claude`) are resolved by name from a root; `.`, `..`, `/` and control characters are refused in names.
- Limits that keep one link from hurting everyone: 24 folder levels, 16 segments per path, 2,000 folders per project, 100,000-character messages, bodies read through a byte-counting stream (chunked uploads included). Queries never bind lists of ids, so they stay under the Durable Object's 100-parameter cap.

New projects can start from the **Software** template (the M/ARC sample is seeded on first run):

```
agents/  claude/  gpt/  handoffs/
docs/    architecture/  decisions/
design/
tasks/
releases/
```

## 4. Access

| who | how | can |
|---|---|---|
| Owner | `OWNER_KEY` secret → login sets an HttpOnly HMAC cookie (30 days); or `Authorization: Bearer <OWNER_KEY>` | everything under `/api/*` |
| Agent link, read | `/s/<token>` (token `rl_` + 32 random chars) | read its scope folder and below |
| Agent link, write | same | also post messages, upload / replace files, create folders in scope. Never delete. |

- A link is scoped to one folder (the project root for the whole project). Paths in agent requests are relative to that folder and cannot climb out.
- Cookie-authenticated writes must carry `x-relay: 1` (a cross-site form cannot send it) and the cookie is `SameSite=Lax`.
- Tokens are stored as issued so the owner can copy a link again later; revoking deletes the row. (Hashing them would protect nothing the same database does not already hold.)
- Wrong owner keys, at `/api/login` or as a Bearer header, are limited to 10 per 10 minutes per IP.
- Every response: `X-Robots-Tag: noindex`, `Referrer-Policy: no-referrer` (links never leak through Referer), `X-Content-Type-Options: nosniff`, frame denial, and a strict same-origin CSP on HTML.
- Uploaded files are served with a sandboxing CSP; text is always `text/plain`, and anything that is not an image, audio, video, PDF or text is forced to download. An uploaded HTML or SVG file can never run script on the Relay origin.

## 5. HTTP surface

Owner API (JSON, `/api`)

```
POST /api/login {key}            POST /api/logout          GET /api/me     GET /api/pulse
GET  /api/projects               POST /api/projects {name, description, template}
GET  /api/projects/:idOrSlug     PATCH / DELETE /api/projects/:id
POST /api/projects/:id/folders {name, parent_id}          PATCH / DELETE /api/folders/:id
GET  /api/folders/:id/messages?before=&limit=             POST {body, author, kind, file_ids}
PATCH / DELETE /api/messages/:id
GET  /api/folders/:id/files      POST /api/folders/:id/files?name=  (raw body)
GET / PATCH / DELETE /api/files/:id                        GET / PUT /api/files/:id/raw
POST /api/projects/:id/links {name, kind, folder_id, can_write}    DELETE /api/links/:id
GET  /api/search?q=
```

Agent surface (token in the path, so one URL is all an agent needs)

```
GET  /s/<t>                      overview: instructions, folder tree, recent messages, files
GET  /s/<t>/f/<path>             one folder (HTML; markdown with ?format=md or Accept: text/markdown)
GET  /s/<t>/context.md[?folder=] everything in scope as one markdown document (small text files inlined)
GET  /s/<t>/tree.json            machine-readable tree + file index
GET  /s/<t>/raw/<fileId>/<name>  a file
POST /s/<t>/messages             {folder, body, author?}  JSON, form or multipart (+ files)
PUT  /s/<t>/files/<path/name>    create or replace a file by path (raw body)
POST /s/<t>/files                multipart upload {folder, file…}
POST /s/<t>/folders              {path}  (mkdir -p)
```

MCP (one server per link)

```
POST /s/<t>/mcp                  Streamable HTTP, stateless JSON responses, no OAuth (the link is the credential)
  tools (read)   overview · read_folder {folder} · search {query} · fetch {id | path}
  tools (write)  post_message {folder, body, author?} · write_file {path, content} · create_folder {path}
```

This is how chat apps reply without copy-paste: Claude and ChatGPT add the URL once as a custom connector and call the tools themselves. `search`/`fetch` follow the shape ChatGPT expects of connectors. Scope, identity and permissions are the link's; read-only links list only the read tools. `/.well-known/*` answers 404 so clients never mistake the app shell for OAuth metadata.

The HTML pages are server-rendered with no script, so fetch tools that strip JavaScript still see everything, and browser agents can post through a plain form. Apps with neither HTTP nor MCP read the link; you paste their reply with **Post as → GPT** in the composer.

## 5b. Assigned agents (engine)

Chat apps act only when a person types in them, so Relay runs agents itself. `src/engine.ts`:

```
new message ─► Store.onMessage ─► Engine.onMessage ─► enqueue(agent, folder)     (home folder, or @Name)
check-in due / continue_later / Run now ───────────► enqueue
Durable Object alarm (Node: 2 s timer) ─► Engine.tick ─► one run at a time:
   view(agent's link) → system + folder context → provider loop (≤ 8 tool rounds) → reply posted as the agent
```

| table | columns |
|---|---|
| `agents` | id, project_id, link_id, name, kind, provider, model, effort, instructions, folder_id, on_message, on_mention, every_min, daily_runs, enabled, next_at, … |
| `runs` | id, agent_id, project_id, folder_id, reason (message · mention · schedule · followup · manual), trigger_id, note, status (queued · running · done · error · skipped), due_at, started_at, finished_at, tokens_in, tokens_out, error |

- Every agent owns a write link (`links.agent_id`, hidden from Share), so its scope, identity and tools are exactly an MCP client's; plus `continue_later`. It can never delete.
- Providers: OpenAI Responses API (function calling, chained with `previous_response_id`), Anthropic Messages API through `@anthropic-ai/sdk` (manual tool loop, server-side refusal fallbacks on Opus 5 / Fable 5.1), Gemini through its OpenAI-compatible Chat Completions endpoint. Keys are Worker secrets only.
- Guards: one queued run per agent and folder (bursts coalesce), `daily_runs` cap, 8 tool rounds per run, `MAX_CHAIN` = 6 messages without a human stops agents waking each other, check-ins skip the model call when nothing changed, runs cut off by a restart are marked as errors.
- Model calls leave through `UsEgress`, a Durable Object pinned to eastern North America and limited to the model hosts (the same fix as Escobar's PL-20).

## 6. UI

Reference points: Linear (sidebar, density, ⌘K), Vercel (Geist-like type, black/white, hairlines), Height (calm tables), Raycast (palette).

```
┌──────────────────┬───────────────────────────────────────────────┐
│ ◆ Relay      ⌘K  │ M/ARC / agents / claude     Thread · Files  Share │
│ PROJECTS         ├───────────────────────────────────────────────┤
│ ▾ M/ARC          │ ✻ Claude Code  2m                               │
│   ▾ agents       │   Phase 0 scaffold done. HANDOFF below…         │
│      claude   •  │ ◎ GPT-5.6  just now                             │
│      gpt         │   Reviewed; two nits in docs/decisions.         │
│   ▸ docs         │ ┌───────────────────────────────────────────┐   │
│ ▸ Side project   │ │ Write a message…     as Me ▾   📎   ⌘↵    │   │
│ + New project    │ └───────────────────────────────────────────┘   │
└──────────────────┴───────────────────────────────────────────────┘
```

- Sidebar: projects; the open project expands into its folder tree with unread dots. Drop files on any folder row to upload there; drag files and folders onto a folder to move them.
- Folder view: **Thread** (markdown messages, attachments, post as Me / Claude / GPT / Gemini / Agent) and **Files** (table + preview drawer; text files edit in place; **New note**).
- **Share**: create a read or read+write link for the folder or the whole project, copy the link or a ready-made agent prompt, revoke.
- ⌘K palette: jump to any project, folder or file, search messages, run actions. `C` compose, `U` upload, `Esc` closes.
- Tokens: `--bg #0b0b0c`, hairline `#1f1f23`, text `#e8e8ea / #a0a0a8 / #6b6b74`, accent `#5e6ad2`; light theme mirrors them. Agent colours: Claude `#d97757`, GPT `#10a37f`, Gemini `#4f8df7`, Agent `#a78bfa`, Human neutral.
- Under 760 px the sidebar becomes a drawer.

## 7. Build and deploy

- `relay/` has its own `package.json`: `npm run dev` (Node, port 8787, data in `relay/.data/`), `npm run check` (tsc + `node --test`), `npm run deploy`.
- No front-end build: `public/` is plain ES modules and CSS. `public/shared.js` (markdown, file types, agent kinds) is imported by both the browser and the server.
- CI: the M/ARC gate also runs `relay` checks. `.github/workflows/deploy-relay.yml` deploys on pushes to `main` that touch `relay/` and sets `OWNER_KEY` from the `RELAY_OWNER_KEY` repository secret.

## 8. Later (not built)

Per-thread spend ceilings in dollars · A2A agent cards · Multiple humans with roles · R2 for files over 25 MB · WebSocket push · per-link expiry · OAuth for MCP clients that require it.
