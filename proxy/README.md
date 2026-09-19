# M/ARC coach proxy

A small Cloudflare Worker that holds the Anthropic API key and turns the
coach's report into plain-English explanations with Claude Haiku 4.5. The
app never holds the key. The Worker never sees raw sessions, names or body
measurements: only the findings, proposals and research cards the app
chose to send.

## Deploy, about five minutes

You need a free Cloudflare account and an Anthropic API key.

```sh
cd proxy
npx wrangler@4 login                            # opens a browser once
npx wrangler@4 deploy                           # prints the Worker URL
npx wrangler@4 secret put ANTHROPIC_API_KEY     # prompts; paste the key privately
```

Copy the printed URL (it looks like `https://marc-coach.<your-subdomain>.workers.dev`)
into the app: Settings → Coach online → Proxy address. Turn on
"Richer explanations". The first tap on "More from the coach" makes the
first call.

Check it is alive: open `<url>/health` in a browser.

## Deploying from a Claude Code cloud session

Cloud sessions can deploy this Worker when the environment allows
`api.cloudflare.com` and defines `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID`. One catch: Claude Code reserves the variable name
`ANTHROPIC_API_KEY` for its own login and never passes it into sessions, so
store the key under another name, `MARC_ANTHROPIC_KEY`, and set the secret
from it without ever printing the value:

```sh
cd proxy
npx wrangler@4 deploy
printenv MARC_ANTHROPIC_KEY | npx wrangler@4 secret put ANTHROPIC_API_KEY
MARC_ANTHROPIC_KEY="$MARC_ANTHROPIC_KEY" npm test        # runs the live test
curl -sS https://marc-coach.<subdomain>.workers.dev/health
```

Environment variables reach a session only when it starts, so edit the
environment first, then start the session.

## Optional: daily quotas

Per-device bursts are limited to six requests a minute out of the box.
Daily caps need a KV namespace:

```sh
npx wrangler@4 kv namespace create QUOTA
```

Paste the printed id into `wrangler.toml` under the commented
`[[kv_namespaces]]` block, uncomment it, and deploy again. Then
`MAX_DAILY_PER_DEVICE` and `MAX_DAILY_TOTAL` apply.

## Change the model

Edit `MODEL` in `wrangler.toml` and deploy. `claude-sonnet-5` is the
documented step up if the wording ever falls short.

## What it costs

About $0.003 per explanation on Haiku 4.5 before prompt caching, at the
usage the app is designed for (a handful of calls a week per user). The
Worker itself runs inside Cloudflare's free plan.

## Develop

```sh
npm ci
npm run check           # typecheck + tests, no network
npm run dry-run         # bundle with wrangler without deploying
npm run dev             # local server with a .dev.vars file holding ANTHROPIC_API_KEY
```
