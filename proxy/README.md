# M/ARC coach proxy

A small Cloudflare Worker that holds the Anthropic API key and gives the app
three narrow, single-purpose ways to use Claude Sonnet 5. The app never
holds the key. Every route only ever sees the small, specific slice of data
that route needs — never raw sessions, names or body measurements.

| Route | What it does | What it never does |
|---|---|---|
| `POST /explain` | Turns the coach's findings and proposals into plain English. | Invent a number not in the report. |
| `POST /tag-exercise` | Given a name (and maybe an equipment word), suggests equipment, muscles, movement pattern and mode for a new custom exercise. | Return a muscle, pattern or mode outside the app's own closed lists — the schema itself rejects anything else, and it says plainly when it isn't sure. |
| `POST /notes` | Given a short training note, tags what kind of thing it is (pain mentioned, equipment issue, fatigue, and so on) so the app can act on it. | Diagnose, name a cause, judge severity, or give medical advice — it only tags that something was mentioned. |

Each route has its own fixed, cacheable system prompt (`src/prompt.ts`,
`src/promptTag.ts`, `src/promptNotes.ts`) and its own structured-output
schema, so a malformed reply is rejected before the app ever sees it.
`src/vocab.ts` holds the muscle and movement-pattern vocabularies the model
must pick from; `test/vocab.test.ts` fails if that copy ever drifts from the
app's real ones in `src/data/`.

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

Edit `MODEL` in `wrangler.toml` and deploy; every route reads the same
variable. Sonnet 5 (`claude-sonnet-5`) is the default for every route here:
each one is a real judgment call — which muscles are truly secondary, or
whether a note describes real pain versus ordinary soreness — not pure
pattern matching, and the closed-vocabulary schema only stops an invented
answer, not a wrong one. `claude-opus-5` is the next step up if a route
ever needs more. `claude-haiku-4-5` is faster and cheaper; nothing here
currently calls for trading judgment for either.

## What it costs

About $0.006 per explanation on Sonnet 5 before prompt caching (roughly
double Haiku 4.5, still under a cent), at the usage the app is designed
for (a handful of calls a week per user). `/tag-exercise` and `/notes` are
smaller requests and cost less each. The Worker itself runs inside
Cloudflare's free plan.

## Develop

```sh
npm ci
npm run check           # typecheck + tests, no network
npm run dry-run         # bundle with wrangler without deploying
npm run dev             # local server with a .dev.vars file holding ANTHROPIC_API_KEY
```
