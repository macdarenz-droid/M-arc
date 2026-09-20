# M/ARC coach proxy

A small Cloudflare Worker that holds the Anthropic API key and gives the app
seven narrow, single-purpose ways to use Claude Sonnet 5. The app never
holds the key. Every route only ever sees the small, specific slice of data
that route needs — never raw sessions, names or body measurements.

| Route | What it does | What it never does |
|---|---|---|
| `POST /explain` | Turns the coach's findings and proposals into plain English. | Invent a number not in the report. |
| `POST /tag-exercise` | Given a name (and maybe an equipment word), suggests equipment, muscles, movement pattern and mode for a new custom exercise. | Return a muscle, pattern or mode outside the app's own closed lists — the schema itself rejects anything else, and it says plainly when it isn't sure. |
| `POST /notes` | Given a short training note, tags what kind of thing it is (pain mentioned, equipment issue, fatigue, and so on) so the app can act on it. | Diagnose, name a cause, judge severity, or give medical advice — it only tags that something was mentioned. |
| `POST /ask` | Answers a question the person typed, grounded only in their report and the research cards; carries a short conversation across follow-up questions. | Invent a number not in the report; answer a diet, supplement or medical question (says plainly that's outside what it does); guess when the report genuinely doesn't cover the question; build a plan in chat (see `/build-split`). |
| `POST /identify-exercise` | Given one downscaled photo (and maybe an equipment word), identifies the exercise or equipment shown and suggests the same fields as `/tag-exercise`. | Guess when the photo doesn't clearly show a real exercise or equipment — it returns `visible: false` instead; describe a person's body, face or appearance if one is in frame. |
| `POST /import-programme` | Given one photo of a written workout plan, extracts up to 7 days of up to 12 exercises each, every exercise classified the same way as `/identify-exercise`. | Guess when the photo doesn't show a legible plan — it returns `readable: false` instead; report a weight or load, only sets; invent a day or exercise the page doesn't show. |
| `POST /build-split` | The one deliberate exception to `/ask`'s "no plans in chat" rule: designs or adjusts one split by conversation, from the person's goal and the splits they already have. | Use an exercise id outside the app's real catalog — the schema itself rejects anything else; propose a full split from a vague request instead of asking a clarifying question first; see or use the person's report, findings or logged history at all (it doesn't get sent any of that). |

`/explain` and `/ask` share the same grounding shape (findings, proposals,
cards, goal, unit, today) — `GroundingPayload` in `src/types.ts`,
`validateGrounding` in `src/handler.ts` — so the same shape and size checks
apply to both without being written twice. The Worker holds no state
between calls: `/ask` gets the whole conversation resent on every turn
(`history`, capped at 12 turns) and reconstructs it as real alternating
messages, the report given once as a genuine first turn.
`/identify-exercise` and `/import-programme` share a `validateImage` check
(shape, media type, base64 well-formedness) the same way.

Each route has its own fixed, cacheable system prompt (`src/prompt.ts`,
`src/promptTag.ts`, `src/promptNotes.ts`, `src/promptAsk.ts`,
`src/promptIdentify.ts`, `src/promptImport.ts`, `src/promptSplitBuilder.ts`)
and its own structured-output schema, so a malformed reply is rejected
before the app ever sees it. `src/vocab.ts` holds the muscle, movement-
pattern and (for `/build-split` only) full exercise-catalog vocabularies
the model must pick from; `test/vocab.test.ts` fails if any of those copies
ever drift from the app's real ones in `src/data/`.

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

Edit `MODEL` in `wrangler.toml` and deploy to change every route at once.
Sonnet 5 (`claude-sonnet-5`) is the default for every route here: each one
is a real judgment call — which muscles are truly secondary, or whether a
note describes real pain versus ordinary soreness — not pure pattern
matching, and the closed-vocabulary schema only stops an invented answer,
not a wrong one. `claude-opus-5` is the next step up if a route ever needs
more. `claude-haiku-4-5-20251001` is faster and cheaper; nothing here
currently calls for trading judgment for either.

To try a different model on just one route without touching the others,
set that route's own `MODEL_*` variable in `wrangler.toml` (see the
commented examples there) and deploy — it overrides `MODEL` for that route
only. Useful for comparing a cheaper model against real traffic before
deciding whether to move a route's default.

## What it costs

About $0.006 per explanation on Sonnet 5 before prompt caching (roughly
double Haiku 4.5, still under a cent), at the usage the app is designed
for (a handful of calls a week per user). `/tag-exercise` and `/notes` are
smaller requests and cost less each. `/identify-exercise` and
`/import-programme` cost noticeably more than the others — a photo's
image tokens dwarf a short text payload, and `/import-programme` also
asks for a larger structured reply (up to 7 days of exercises) — but both
are one-off, deliberate actions (saving one exercise, importing one
plan), not something called on every screen. `/ask` also has a web search
tool (Claude Sonnet 5, `web_search_20260209`), capped at 3 searches per
question and used only when the prompt judges the question needs a
current or specific fact checked rather than recited from memory: $10 per
1,000 searches (about a cent each), on top of the normal per-call cost,
plus token cost for whatever it reads. Search results are restricted to a
fixed list of research and public-health domains (`ASK_WEB_SEARCH_ALLOWED_DOMAINS`
in `src/anthropic.ts` — nih.gov, cdc.gov, health.gov, who.int, mayoclinic.org,
examine.com, acsm.org, nsca.com, and two sports-medicine journals), matching
the evidence bar the rest of this app already holds itself to. The Worker
itself runs inside Cloudflare's free plan.

## Develop

```sh
npm ci
npm run check           # typecheck + tests, no network
npm run dry-run         # bundle with wrangler without deploying
npm run dev             # local server with a .dev.vars file holding ANTHROPIC_API_KEY
```
