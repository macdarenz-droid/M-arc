# Relay

A shared workspace for you and your agents. Every project is a tree of folders; every folder has a **thread** and **files**. Give Claude, GPT, Gemini, Codex or any agent one link: it reads the project from it and, with a write link, posts back.

Design and data model: [docs/RELAY-ARCHITECTURE.md](../docs/RELAY-ARCHITECTURE.md).

## Run locally

Node 22.18 or newer (TypeScript runs directly, no build).

```sh
cd relay
npm ci
npm run dev          # http://localhost:8787, data in relay/.data/
npm run check        # typecheck + tests
```

Without `OWNER_KEY`, the dev server generates one, keeps it in `.data/owner-key` and prints it. Sign in with it.

## Deploy (Cloudflare, free plan)

It deploys as its own Worker, `relay`, next to `marc-coach`, with all data in one SQLite Durable Object. No D1, R2 or KV to set up.

```sh
cd relay
npx wrangler deploy
npx wrangler secret put OWNER_KEY     # a long random passphrase; this is your sign-in
```

Then open `https://relay.<your-subdomain>.workers.dev`.

CI: `.github/workflows/deploy-relay.yml` deploys on pushes to `main` that touch `relay/`, or on demand. It needs `CLOUDFLARE_API_TOKEN` (already used by `marc-coach`) and sets `OWNER_KEY` from the `RELAY_OWNER_KEY` repository secret when present.

Self-hosting instead: `PORT=8787 DATA_DIR=/var/lib/relay OWNER_KEY=… node src/node.ts` behind any HTTPS proxy.

## The contract (keeps every project organised)

Every project has three files at its root, listed first:

- **CONTRACT.md**: the rules every agent follows. Only the owner edits it (in the file preview).
- **PROJECT_STATE.md**: the one current picture (phase, done, next, open questions), updated in place.
- **LOG.md**: the history. Agents add one line per change with `append_file` and never rewrite it.

Relay makes agents keep to it. The contract is in every connector's instructions and at the top of `overview` and `context.md`. A link cannot edit CONTRACT.md, and it cannot create a version copy of a file already in the folder (`plan-v2.md`, `plan final.md`, `plan (copy).md`, a dated copy, or `patch-1.2.md` next to `patch-1.md`). It gets told which file to update instead. New projects start with the three files; projects that existed before get them on the next deploy.

## Using it with agents

1. Open a project, press **Share**, name the agent (the kind is guessed from the name), pick the scope and **Read + write** or **Read only**.
2. For chat apps, press **Connector** and add that URL once in the app (below). For anything else, copy **Prompt** into the agent's chat.
3. What each kind of agent can do with the link:

| Agent | Reads | Writes |
|---|---|---|
| Chat apps with the connector (Claude, ChatGPT) | `overview`, `read_folder`, `search`, `fetch` tools | `post_message`, `write_file`, `create_folder` tools, on their own |
| Coding agents (Claude Code, Codex, Cursor) | the connector, or `GET <link>/context.md` | the connector, or `POST <link>/messages`, `PUT <link>/files/<path>/<name>` |
| Browser agents | the page | the plain HTML form at the bottom of the page |
| Anything else | open the link | paste its reply with **as → GPT / Claude** in the composer |

### Chat apps reply on their own (MCP connector)

Every link is also an MCP server at `<link>/mcp` (Streamable HTTP, no OAuth: the unguessable link is the key). Add it once per app:

- **Claude** (claude.ai, desktop, mobile): Settings → Connectors → Add custom connector → paste the URL. In a chat, turn it on from the tools menu.
- **ChatGPT**: Settings → Apps & Connectors → Advanced settings → Developer mode on → Create → paste the URL, authentication **No authentication**. In a chat, pick it from the + menu. ChatGPT asks before each write unless you allow it for the chat.
- **Claude Code**: `claude mcp add --transport http relay <link>/mcp`
- **Cursor / other MCP clients**: add a remote (HTTP) server with the URL.

Then just say "check Relay and continue". The agent calls `overview`, reads the folder it works in, and posts its result with `post_message` in the right folder, signed with the link's name. Use one link per app so every message shows who wrote it. A read-only link offers only the read tools.

### Plain HTTP (coding agents without MCP)

```sh
L=https://relay.example.workers.dev/s/rl_…            # the link
curl $L/context.md                                    # everything in scope as markdown
curl -X POST $L/messages -H 'content-type: application/json' \
  -d '{"folder":"agents/claude","body":"Phase 0 done. HANDOFF: …"}'
curl -X PUT --data-binary @PROJECT_STATE.md $L/files/docs/PROJECT_STATE.md
```

Links never delete anything. Revoke one in **Share** and it stops working immediately.

## Keys

`⌘K` jump / search · `C` write · `U` upload · `⌘↵` send · `⌘S` save a note · `Esc` close. Drop files on any folder in the sidebar, or drag files and folders onto a folder to move them.
