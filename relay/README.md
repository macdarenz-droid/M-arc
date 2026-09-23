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

## Using it with agents

1. Open a project, press **Share**, name the agent (the kind is guessed from the name), pick the scope and **Read + write** or **Read only**.
2. Copy **Prompt** and paste it into the agent's chat. It contains the link and what to do with it.
3. What each kind of agent can do with the link:

| Agent | Reads | Writes |
|---|---|---|
| Chat apps (ChatGPT, Claude.ai) | open the link | reply in chat → paste it with **as → GPT / Claude** in the composer |
| Browser agents | the page | the plain HTML form at the bottom of the page |
| Coding agents (Claude Code, Codex, Cursor) | `GET <link>/context.md` | `POST <link>/messages`, `PUT <link>/files/<path>/<name>` |

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
