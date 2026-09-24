// Cloudflare entry: static files from ASSETS (with the app's security headers); /api, /s and /health go to one
// SQLite-backed Durable Object so every write has a single, consistent owner. Its alarm drives the agent engine,
// and model API calls leave through UsEgress, a Durable Object pinned to eastern North America (some Cloudflare
// locations, such as Hong Kong, are refused by OpenAI and Anthropic).
import { DurableObject } from 'cloudflare:workers'
import { handle, isDynamic, secure } from './app.ts'
import { Engine, type Fetch } from './engine.ts'
import { durableSql } from './sql.ts'
import { Store } from './store.ts'

export interface Env {
  RELAY: DurableObjectNamespace<RelayStore>
  EGRESS?: DurableObjectNamespace<UsEgress>
  ASSETS: Fetcher
  OWNER_KEY?: string
  MAX_FILE_MB?: string
  OPENAI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  GEMINI_API_KEY?: string
  OPENAI_BASE_URL?: string
}

export class RelayStore extends DurableObject<Env> {
  store: Store
  engine: Engine
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env)
    this.store = new Store(durableSql(ctx.storage))
    const egress = env.EGRESS?.get(env.EGRESS.idFromName('us'), { locationHint: 'enam' })
    const viaUs: Fetch | undefined = egress ? (input, init) => egress.fetch(new Request(input, { ...init, signal: undefined })) : undefined
    this.engine = new Engine({
      store: this.store,
      keys: { openai: env.OPENAI_API_KEY, anthropic: env.ANTHROPIC_API_KEY, gemini: env.GEMINI_API_KEY, openaiBase: env.OPENAI_BASE_URL },
      fetch: viaUs,
    })
  }
  override async fetch(req: Request): Promise<Response> {
    const res = await handle(req, {
      store: this.store,
      ownerKey: this.env.OWNER_KEY,
      maxFileBytes: (Number(this.env.MAX_FILE_MB) || 25) * 1048576,
      ip: req.headers.get('cf-connecting-ip') ?? '',
      providers: this.engine.providers(),
    })
    await this.arm()
    return res
  }
  override async alarm(): Promise<void> {
    await this.engine.tick()
    await this.arm()
  }
  /** Keep one alarm set for the earliest queued run or check-in. */
  private async arm() {
    const next = this.engine.nextWake()
    if (next == null) return
    const current = await this.ctx.storage.getAlarm()
    if (current == null || next < current) await this.ctx.storage.setAlarm(Math.max(next, Date.now() + 50))
  }
}

/** Forwards model API calls from eastern North America. Reachable only through the binding, and only to model hosts. */
export class UsEgress extends DurableObject<Env> {
  override async fetch(req: Request): Promise<Response> {
    const allowed = ['api.openai.com', 'api.anthropic.com', 'generativelanguage.googleapis.com']
    if (this.env.OPENAI_BASE_URL) allowed.push(new URL(this.env.OPENAI_BASE_URL).host)
    if (!allowed.includes(new URL(req.url).host)) return new Response('Host not allowed', { status: 403 })
    return fetch(req)
  }
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (isDynamic(url.pathname)) return env.RELAY.get(env.RELAY.idFromName('main')).fetch(req)
    let res = await env.ASSETS.fetch(req)
    // Client-side routes (/p/…) get the app shell.
    if (res.status === 404 && (req.method === 'GET' || req.method === 'HEAD') && !/\.\w+$/.test(url.pathname))
      res = await env.ASSETS.fetch(new Request(new URL('/', url), req))
    return secure(res, url.protocol === 'https:')
  },
} satisfies ExportedHandler<Env>
