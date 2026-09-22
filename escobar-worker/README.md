# marc-coach: Escobar v2 Worker

A stateless, single-step relay between the M/ARC app and the Claude API (spec: `docs/ESCOBAR-ARCHITECTURE.md` §12). The app runs every tool locally; each `POST /v2/turn` is one streamed model step. The Worker owns the policy prompt, the tool definitions, model and effort, quotas and the API key.

## Deploy

It deploys under the existing Worker name `marc-coach`, so the stored `ANTHROPIC_API_KEY` secret and bindings carry over:

```sh
cd escobar-worker
npm ci
npx wrangler@4 deploy
```

The app treats Escobar as online only when `GET /health` answers `protocol: 2`.

## Routes

- `GET /health` → `{ok, protocol: 2, model, modes, quotas}`
- `POST /v2/turn` (header `x-escobar-device: dev_<24 hex>`) → `text/event-stream` of `data: {t: …}` events: `start`, `text`, `thinking`, `tool`, `tool_input`, `final`, `refusal`, `error`; `: ping` every 10 s. Validation, quota and rate failures are plain 400/429 JSON before the stream.

## Configure (wrangler.toml `[vars]`)

- `MODEL` (default `claude-opus-5`), `EFFORT_CHAT|PLAN|LIVE|BRIEF|MOMENT|SUMMARIZE`
- `MAX_TURNS_PER_DEVICE` 80, `MAX_STEPS_PER_DEVICE` 400, `MAX_OUTPUT_PER_DEVICE` 400000, `MAX_STEPS_TOTAL` 20000 (need the optional `QUOTA` KV namespace: `npx wrangler@4 kv namespace create QUOTA`, then paste its id)
- `ALLOWED_ORIGINS` for the PWA; the Android app is always allowed
- `RATE` rate-limit binding: 30 steps a minute per device

Workers Paid is recommended for real use: KV writes and streaming CPU time outgrow the free tier quickly. Quota counters are written once per user turn to stay inside KV write limits.

## Tools

`src/tools.generated.json` is generated from the app (`src/escobar/tools/schema.ts`, `src/escobar/context/modes.ts`): run `npm run escobar:tools` at the repo root after changing a tool, then redeploy. A test in the app fails when they drift.

## Test

`npm run check` (typecheck + vitest against a scripted SDK stream; no network).
