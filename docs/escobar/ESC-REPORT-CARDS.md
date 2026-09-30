# ESC-REPORT cards: report a coach reply

**For builders:**
1. Three cards. ESC-REPORT-W adds `POST /reports` to the Worker; the owner merges it, and that merge deploys it. ESC-REPORT adds a Report button under every finished coach reply. DOC-REPORT updates the privacy policy and the Play Data safety answers.
2. A report is exactly `{v:1, reason, text, app}`. It always goes to the built-in server (`ESCOBAR_PROXY_URL` + `/reports`), even when a custom coach server is set. Nothing new is saved on the phone.
3. The server keeps each report 90 days in the D1 table `content_reports`. There is no owner page and no new secret: the owner reads reports in the Cloudflare D1 console with the two SQL queries in "Owner steps".
4. Merge order: ESC-REPORT-W (owner) → the curl check answers 400 → DOC-REPORT. ESC-REPORT merges only after that check and after ESC-NC (#122), with `origin/main` merged in.
5. Every acceptance criterion names the mutation that must break it. Every visible string passes the four LR-23 patterns. No existing test is loosened, and no npm dependency is added.

Checked against origin/main 6730bac. Between e14c45b and 6730bac only docs changed, so every code line cited below still holds. Also checked: ESC-NC 9235fcf, website branch 2373589, and LR23-PLAN e4bfb08. Live baseline on 2026-09-30: `POST /reports {}` answers 404 `{"t":"error","code":"invalid","message":"not found"}`, which means the endpoint is not deployed yet.

## Order of merges

1. **ESC-REPORT-W:** the owner merges it. deploy-worker.yml:7-11 deploys it.
2. **Supervisor check:**
   - Run `curl -sS -w '\n%{http_code}\n' -X POST -H 'content-type: application/json' --data '{}' https://marc-coach.mmarcdarenz.workers.dev/reports`.
   - It must print a `{"error":…}` body and `400`.
   - A 404 means the endpoint is not live.
   - OPTIONS proves nothing: handler.ts:96 answers 204 on every path.
3. **DOC-REPORT (a):** merges right after step 2. Part (b) rides on the website branch (#110). Before any Play release, the owner deploys the website, and the live /privacy/ page must show the new section.
4. **ESC-NC (#122):** merges on its own schedule.
5. **ESC-REPORT:** merges after steps 2 and 4. First merge `origin/main` in with a merge commit, then re-run every check on that head.
6. **Play release:** only after steps 3 and 5.

---

## Card ESC-REPORT-W

- **id:** ESC-REPORT-W
- **outcome:** The live Worker accepts content reports at `POST /reports` and rate-limits them without storing any IP. It keeps each reported reply 90 days in the D1 table `content_reports` (database `marc-errors`), then deletes it. `/errors` and `/errors/summary` behave exactly as today.
- **base:** origin/main (6730bac or later). New branch `claude/esc-report-w`.
- **depends_on:** none. This is a separate PR. Only the owner merges it, and the merge deploys it (deploy-worker.yml:7-11).
- **read_first:**
  - `escobar-worker/src/index.ts:8-23`
  - `errorsHandler.ts:17-34` (its own `readCapped`) and `:44-84`
  - `errorsStore.ts:16-100`
  - `errorsValidate.ts:11-28` and `:127` (`VERSION`)
  - `handler.ts:63-71` (`ipBucket`) and `:96` (OPTIONS answers 204 on every path)
  - `test/errors.test.ts:1-40, 239-262, 282-293` (`worker.scheduled` with fake time)
  - `test/d1-sqlite.ts`
- **write_scope:**
  - `escobar-worker/src/index.ts`
  - `escobar-worker/src/errorsHandler.ts`
  - `escobar-worker/src/errorsStore.ts`
  - `escobar-worker/src/errorsValidate.ts`
  - new `escobar-worker/test/reports.test.ts`
- **reserved_paths:**
  - everything outside `escobar-worker/**`;
  - `handler.ts`, which may only be imported from;
  - `anthropic.ts` (no new `Env` field);
  - `prompt/**`;
  - `wrangler.toml` (no new var, binding, secret or comment);
  - `test/errors.test.ts` and `test/d1-sqlite.ts`, which stay unchanged byte for byte.
- **design_reference:**
  - **Routing (index.ts:11):** `url.pathname === '/reports'` also goes to `handleErrors`. No other route is added.
  - **`POST /reports` in `handleErrors`, in this order:**
    1. Answer 503 `{error:'not configured'}` unless both `ERRORS_DB` and `ERRORS_SUMMARY_TOKEN` are set. The token is the HMAC key.
    2. Answer 413 if the declared content-length is over `MAX_REPORT_BODY_BYTES = 24_576`. Then answer 413 if `readCapped` (errorsHandler.ts:17) passes that cap.
    3. Answer 400 if the body is not JSON.
    4. Answer 400 `{error}` from `validateContentReport`.
    5. Call `ensureSchema`, then `countReport`. Over a limit, answer 429 `{error:'rate limited'}` with `retry-after` set to the whole seconds until the next UTC hour.
    6. Call `storeContentReport` and answer 204 with no body. Any throw in steps 5-6 answers 503 `{error:'storage unavailable'}`.
    - OPTIONS keeps the existing 204 (:49). Any other method on `/reports` falls through to the existing 404.
    - Nothing from a request is ever logged.
  - **`validateContentReport` (errorsValidate.ts):**
    - The body is a plain object with exactly the keys `v`, `reason`, `text` and `app`: `only()` (:27), and each key must be present.
    - `v === 1`.
    - `reason` is in `REPORT_REASONS = new Set(['offensive','harmful','wrong'])`.
    - `text`:
      - is a string;
      - is not empty after `.trim()`;
      - has `.length ≤ MAX_REPORT_TEXT = 4000` (UTF-16 units);
      - passes `!REPORT_CONTROL_RE.test(text)`, where `REPORT_CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/`. This is the same character class the app strips; `\t` and `\n` are allowed.
    - `app` passes `VERSION.test(app)` (:127).
    - The result is a new object built from the three named fields. `scrubMessage` is not applied, so digits are kept.
  - **Rate limits (errorsStore.ts):**
    - `ipKey(secret, hour, ip, domain = 'errors-ip')` hashes `${domain}|${hour}|${ip}`. Error-report keys stay byte-identical; WR5(d) pins one.
    - `countReport(db, secret, bucket, now)`, with `bucket = ipBucket(cf-connecting-ip ?? 'unknown')`:
      1. One batch: `DELETE FROM error_rate WHERE hour < ?1`, plus an upsert of `r:p:${ipKey(secret, hour, bucket, 'reports-ip')}` `RETURNING n`. If `n > REPORTS_PER_NETWORK = 10`, answer 429 and leave `r:all` untouched.
      2. Only after that: upsert `r:all:${hour}` `RETURNING n`. If `n > REPORTS_PER_HOUR = 200`, answer 429.
    - Use the same `error_rate` table and upsert shape as `countRequest` (:49-62).
  - **Storage (appended to `SCHEMA`, :20-26):**
    - `CREATE TABLE IF NOT EXISTS content_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, stored_at INTEGER NOT NULL, reason TEXT NOT NULL, app TEXT NOT NULL, text TEXT NOT NULL, text_sha TEXT NOT NULL, n INTEGER NOT NULL DEFAULT 1)`
    - `CREATE UNIQUE INDEX IF NOT EXISTS content_reports_text ON content_reports (text_sha, reason)`
    - `CREATE INDEX IF NOT EXISTS content_reports_stored_at ON content_reports (stored_at)`
    - `storeContentReport`:
      - `text_sha` is the SHA-256 hex of the UTF-8 text, computed on the Worker;
      - it runs `INSERT INTO content_reports (stored_at, reason, app, text, text_sha) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT (text_sha, reason) DO UPDATE SET n = n + 1`;
      - a duplicate keeps its first `stored_at` and `app`, and still answers 204.
  - **Retention:** `purge` (:71-76) adds `DELETE FROM content_reports WHERE stored_at < ?1`, bound to `now - RETENTION_MS`.
  - **Unchanged:** `summarize`, `/errors/summary`, `sameText`, `Env` and `wrangler.toml`.
  - **When the table appears:** at the first valid report or at the next daily cron (03:17 UTC, wrangler.toml:86), whichever comes first. The 400 check does not create it.
- **acceptance:**
  - **WR1 (valid report):**
    - it gets 204;
    - the stored row equals the input exactly, with digits kept;
    - `text_sha` is the SHA-256 hex of the text;
    - `n = 1`, and `stored_at` equals the injected `now`.
    - Mutation: apply `scrubMessage` to `text`.
  - **WR2 (validation):**
    - each of these gets 400:
      - an unknown key;
      - each missing key;
      - `v:2`;
      - reason `spam`;
      - a `text` that is not a string;
      - `text: '  \n'`;
      - a 4001-unit text;
      - a text containing `\u0007`, `\r` or `\u0085`;
      - `app: 'x y'`;
      - a non-JSON body;
    - a 4000-unit text containing `\t` and `\n` gets 204.
    - Mutations: drop `only()`; drop the `REPORT_REASONS` check; narrow the regex to `\u0000-\u001F`.
  - **WR3 (size):**
    - a declared size of 24,577 gets 413;
    - a streamed 24,577-byte body with a false content-length gets 413;
    - 4000 × `€` gets 204;
    - the same text sent as `\u20ac` JSON escapes (about 24,040 bytes) gets 204.
    - Mutation: an 8 KB cap.
  - **WR4 (de-duplication):**
    - the same text and reason sent twice gives one row with `n = 2` and the first `stored_at`;
    - the same text with a different reason gives a second row.
    - Mutation: drop the UNIQUE index.
  - **WR5 (rate limits):**
    - (a) the 11th report from one network in one hour gets 429. At 2026-09-30T12:34:56Z it carries `retry-after: 1504`.
    - (b) `2001:db8:1:2::a` and `2001:db8:1:2::b` share one counter.
    - (c) After 40 reports from one IP, `/errors` from that IP still gets 204. After `/errors` hits 30, `/reports` from the same IP still gets 204.
    - (d) `ipKey('test-secret-token', '2026-09-30T12', '203.0.113.7')` returns `de4c2abe5614874bc55c48c779e5ea14423552146db4854829f5805052a0dbbd`. This value was computed with main 6730bac's own `ipKey`, before this change.
    - (e) 200 reports from 20 networks, then one from a 21st network: the 201st gets 429.
    - (f) Network A sends 200 reports (10 get 204, 190 get 429). Then network B still gets 204, and `r:all:2026-09-30T12` holds `n = 11`.
    - (g) `ipKey('test-secret-token','2026-09-30T12','203.0.113.7','reports-ip')` returns `20685af34c208d8affa2f8c32071b274f5e7e28451f059ef1cb1264b2685d90b`. After one report from 203.0.113.7 at 2026-09-30T12:34:56Z, `error_rate` holds the key `r:p:20685af34c208d8affa2f8c32071b274f5e7e28451f059ef1cb1264b2685d90b`.
    - Mutations:
      - reports use `p:${ipKey(secret, hour, ip)}`, the /errors key (c);
      - the `p:` prefix for reports, or the `errors-ip` domain for reports, each fail (g);
      - a changed `ipKey` message format (d);
      - the raw IP instead of `ipBucket` (b);
      - both counters in one batch (f).
  - **WR6 (nothing identifying kept):**
    - a spy on `console.log/info/warn/error/debug` records nothing containing the text, the IP or the secret, on the 204, 400, 413, 429 and 503 paths;
    - `PRAGMA table_info(content_reports)` names exactly `id, stored_at, reason, app, text, text_sha, n`;
    - no cell in any table contains the raw IP;
    - only `error_rate` holds HMAC keys (`r:p:` followed by 64 hex characters).
    - Mutations: `console.log(body)`; add an `ip` column.
  - **WR7 (failure paths and routing):**
    - 503 when `ERRORS_DB` is missing, and 503 when `ERRORS_SUMMARY_TOKEN` is missing;
    - OPTIONS with `Origin: https://localhost` gets 204 with CORS headers;
    - a foreign Origin gets 403;
    - GET `/reports` gets 404;
    - a D1 that throws gives 503;
    - through `worker.fetch`, POST `/reports` `{}` gets 400 `{error}`.
    - Mutations: drop `/reports` from index.ts (the `worker.fetch` case then gets the coach's 404); drop the not-configured check.
  - **WR8 (retention):** through `worker.scheduled()` with fake system time, a report 90 days + 1 ms old is deleted and one 90 days − 1 ms old stays.
    - Mutation: drop the purge DELETE.
  - **WR9 (owner SQL):**
    - Set up: copy the two queries from "Owner steps" byte for byte into `reports.test.ts` as `OWNER_SQL_LATEST` and `OWNER_SQL_BY_REASON`. Store reports through `handleErrors`:
      - at `Date.now() − 1 day`: the same text and reason twice, plus one other reason;
      - at `Date.now() − 8 days`: one more report.
    - The first query returns every row, newest first. Its columns are `id, first_reported_utc, reason, times, app, text`, and `times = 2` on the duplicate.
    - The second query returns only the last 7 days' rows, grouped by reason, with `replies` and `reports`.
    - Mutations: rename column `n` to `count` in `SCHEMA`; change `7 * 86400` to `9 * 86400` in the test's copy.
- **connectivity:** Tests run fully offline (`sqliteD1`, injected `now`, fake timers). The live Worker is used only for the post-deploy curl check.
- **verification:**
  - Run `cd escobar-worker && npm run check`, then `npm run check` at the repo root.
  - `git diff --exit-code origin/main -- escobar-worker/test/errors.test.ts escobar-worker/test/d1-sqlite.ts` must print nothing.
  - Each mutation above must make its named WR fail. List the results in the PR.
  - After the owner's merge, the supervisor runs the curl check in "Order of merges".
- **risk_and_recovery:**
  - **Spam:** the 24 KB body cap, the 4000-unit text cap, 10 an hour per network, 200 an hour in total, and de-duplication. Many networks together can still fill the 200 for up to an hour; that is accepted.
  - **Forged text:** anyone can POST to the endpoint. The owner treats reports as unverified hints. The D1 console shows the text and never runs it.
  - **Health text kept 90 days:** no ids and no logs (WR6). DOC-REPORT lands before any Play release.
  - **Recovery:** the owner merges a revert, which redeploys. Leftover rows go at the next purge, or by hand in the D1 console with `DELETE FROM content_reports;`.
- **return:** PR link, head SHA, changed paths, evidence for each WR, the mutation results, and the curl output after deploy.

---

## Card ESC-REPORT

- **id:** ESC-REPORT
- **outcome:**
  - Every finished coach reply has a Report button.
  - Picking one of three reasons sends `{v:1, reason, text, app}` to the built-in server's `/reports`, even when a custom coach server is set.
  - The user always sees one of three results: sent, failed or limited.
  - Nothing new is saved on the phone.
- **base:** origin/main (6730bac or later). New branch `claude/esc-report`. Building starts now.
- **depends_on:**
  - **Merge gate 1:** ESC-REPORT-W is live, meaning the curl check answers 400.
  - **Merge gate 2:** ESC-NC (#122, `claude/esc-nc-no-contacts`, now 9235fcf) has merged. Then merge `origin/main` into this branch with a merge commit and re-run everything.
  - R6 imports ESC-NC's `tests/guards/no-contacts.ts`, and R7 reads ESC-REPORT-W's `escobar-worker/test/reports.test.ts`. Both tests are added in that merge-main step. Before it, check the copy by hand against the LR23-PLAN literals.
- **ESC-NC overlap:**
  - ESC-NC rewrites these parts of Message.tsx and styles.css:
    - Message.tsx: the imports, `AnswerText` and the Drawer body;
    - styles.css: the `.esc-cite*` rules.
  - It also changes the gate's EV5 block and `mock/transport.ts`.
  - This card adds only these:
    - in Message.tsx, one import, plus one line directly after `{!live && <Drawer uses={allUses} results={results} />}`. Anchor it by that content: it is line 229 on main and about 12 lines higher after ESC-NC (217 on 9235fcf).
    - one CSS block at the end of styles.css;
    - its own gate block after EV5.
  - No line is edited by both cards.
  - ESC-NC's walker never renders child components (no-contacts.test.ts:21-27), so the `ReportAnswer` child does not change its results.
  - G1 must not depend on the mock reply's exact text, because ESC-NC changes it.
- **read_first:**
  - `src/escobar/ui/Message.tsx:136-140` (the lazy `../session` import) and `:185-233`
  - `EscobarSheet.tsx`:
    - `:145` (the live answer);
    - `:303` (the dialog's `onCancel`);
    - `:321` (the thread shows only while the coach is on).
  - `session.ts:31` (`devMode`) and `:100-110` (dev mode keeps conversations in memory)
  - `state.ts:11,93`
  - `src/errors/index.ts:29-32`
  - `verify.ts:49-55` (chips: at most 3, 40 characters each)
  - `hash.ts:2`
  - `src/escobar/store.ts:55-64,142-148`
  - `src/core/version.ts`
  - `styles.css:396,589-590,614-615`
  - `scripts/screenshot-gate.mjs`:
    - `themes` (:110);
    - `checkContrast` (the function at `scripts/screenshot-gate.mjs:316-343`; its 4.5 threshold is at :342-347);
    - the `.esc-link` probe (:383-386);
    - the `.esc-drawer-toggle` `.last()` probe;
    - the EV5 block.
  - `vite.config.ts:24-29` (vitest runs in the `node` environment and picks up only `tests/**/*.test.ts`)
  - ESC-NC's `tests/escobar/no-contacts.test.ts:1-35` and `tests/guards/no-contacts.ts`
- **write_scope:**
  - new `src/escobar/report.ts`
  - new `src/escobar/ui/Report.tsx`
  - `Message.tsx`: one import and one line
  - `src/errors/index.ts`: add `export` to `automated`, nothing else
  - `src/ui/styles.css`: one `/* ESC-REPORT */` block at the end
  - new `tests/escobar/report.test.ts`
  - `scripts/screenshot-gate.mjs`: one add-only `ESC-REPORT` block
  - `docs/ERROR-REPORTS.md`: a new "Content reports" section
- **reserved_paths:**
  - `escobar-worker/**` (R7 only reads one file there);
  - the saved data shape: `src/core/models.ts`, `src/core/store.ts`, `src/escobar/store.ts`;
  - `Settings.tsx`, `SettingsSection.tsx` and every watch-agent file;
  - `src/escobar/transport.ts`, `mock/transport.ts`, `EscobarSheet.tsx`;
  - `package*.json`;
  - other tasks' blocks in the gate and theme tests;
  - every existing test.
- **design_reference:**
  - **Wiring:** `{!live && <ReportAnswer conv={conv} indexes={indexes} />}`, right after the Drawer line.
    - The live streaming answer (EscobarSheet.tsx:145) has no button.
    - Nothing checks the server setting.
  - **report.ts** (no hooks, no JSX, and no static import of `./session`):
    - `REASONS = ['offensive','harmful','wrong']`, labelled Offensive, Harmful and Wrong.
    - `CONTROL_RE = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g` is the Worker's `REPORT_CONTROL_RE` class. `MAX_TEXT = 4000`.
    - `reportText(conv, indexes)` builds the text from these parts, in this order:
      1. the final answer (`answerText`, Message.tsx:194);
      2. the preamble lines (:208);
      3. the captions of `show` uses with a non-error result (:212);
      4. the proposal titles (:115);
      5. the revised earlier drafts (:225-227);
      6. the suggestion chips `r.chips`, one per line. They are always included, even when not drawn because the turn is not the last one, so the text and the key never change.

      Each part goes through `parseDirectives(…).plain` and is trimmed. Empty parts are dropped, and the parts are joined with a blank line. Then `CONTROL_RE` characters are stripped, the text is cut to 4000 UTF-16 units, and a trailing lone high surrogate is dropped.
    - `reportKey(conv, text)` is `${conv.id}:${fnv(text)}`.
    - `reportLabelId(conv, indexes)` is `esc-report-q-${conv.id}-${indexes[0]}`.
    - `reported = signal<ReadonlySet<string>>(new Set())` lives in memory only. `initialState(key)` is `'sent'` when `reported` has the key, otherwise `'idle'`.
    - `reduce(state, event)`:
      - states: `idle`, `open`, `sending`, `sent`, `failed`, `limited`;
      - events: `open`, `cancel`, `pick`, `result(sent|failed|limited)`;
      - `failed` and `limited` keep the reasons;
      - `pick` is ignored while sending.
    - `postReport(body, {fetchImpl = fetch, timeoutMs = 15000})`:
      - POSTs to `${ESCOBAR_PROXY_URL}/reports`;
      - sends only the header `content-type: application/json`, with `credentials: 'omit'` and an AbortController timeout;
      - 204 means `sent` and 429 means `limited`. Anything else, a throw or the timeout means `failed`.
    - `submitReport(key, body, deps)`:
      - A per-key in-flight guard: a second call for the same key while one runs returns `'busy'` and does not fetch.
      - Then these checks, in order, each one injectable:
        1. offline (`navigator.onLine === false`) gives `failed`, with no fetch;
        2. `devMode()`, read through `(await import('./session')).devMode()`, gives `sent` after one tick, with no fetch;
        3. `automated()` gives `failed`, with no fetch;
        4. otherwise `postReport`.
      - A `sent` result adds the key to `reported`.
  - **Report.tsx:**
    - `ReportAnswer({conv, indexes})` has no hooks. It computes `reportText`, returns null when `text.trim()` is empty, and otherwise returns `<ReportControl key={reportKey(…)} …/>`.
    - `ReportControl` holds the hooks: its state starts from `initialState`, runs through the reducer, and uses refs for focus. It renders `ReportView`.
    - `ReportView({state, labelId, …handlers})` is presentational and has no hooks, so every state can be checked by calling it as a plain function.
    - **Idle:** `<button type="button" class="esc-report-btn small" aria-label="Report this reply" aria-expanded="false">Report</button>`.
    - **Open:**
      - The same button with `aria-expanded="true"`.
      - Then `<div role="group" aria-labelledby={labelId}>`, holding:
        - `<p id={labelId} class="small">Why report this reply?</p>`;
        - the buttons Offensive, Harmful and Wrong, class `chip chip-btn`, not inside `.esc-chips`;
        - a Cancel button;
        - `<p class="hint">Sends this reply, your reason and the app version to the app’s developer. Kept 90 days.</p>`.
      - Focus moves to Offensive, and Cancel returns focus to Report.
      - Escape inside the group calls `preventDefault()` and `stopPropagation()`, closes the group and returns focus to Report. The sheet stays open.
    - **Sending:** the reason buttons are disabled, and `<p class="hint" role="status">Sending…</p>` shows.
    - **Sent:** `<p class="hint" role="status" tabIndex={-1}>Reported. Thank you.</p>`, focused, with no buttons.
    - **Failed:** the reasons stay, so tapping one is the retry, and `<p class="hint" role="alert">Couldn’t send. Check your connection and try again.</p>` shows.
    - **Limited:** the reasons stay, and `<p class="hint" role="alert">Too many reports from this network. Try again in an hour.</p>` shows.
    - **Not used:** the error-report consent switch, any queue, an install id, a device header or a server flag.
  - **Copy:**
    - Every visible string is checked: Report, Report this reply, Why report this reply?, Offensive, Harmful, Wrong, Cancel, the disclosure line, Sending…, Reported. Thank you., and the two alerts.
    - Each passes `CONTACT_RE`, `SOURCE_RE`, `SOURCE_CS_RE` and `SAFETY_LINE_RE`. This was checked on 2026-09-30 against ESC-NC 9235fcf's guard, which holds the D-LR23-1 literals.
    - The strings contain no contact, link or source wording.
  - **CSS** (one `/* ESC-REPORT */` block at the end of styles.css):
    - `.esc-report{display:flex;flex-wrap:wrap;align-items:center;gap:8px}`
    - `.esc-report-btn{position:relative;display:inline-flex;align-items:center;min-height:32px;color:var(--text-2)}`
    - `.esc-report-btn::before{content:"";position:absolute;inset:-6px 0}`
    - Never use the `.esc-drawer-toggle` or `.esc-link` classes.
  - **docs/ERROR-REPORTS.md "Content reports":**
    - what is sent, where it goes, the limits and the retention;
    - the D1 console steps and the two SQL queries, byte for byte from "Owner steps";
    - a note that reports are unverified text.
- **acceptance:**
  - **R1 (report text):**
    - The body keys are exactly `{v, reason, text, app}`, with `v === 1`. `app === APP_VERSION` and matches `/^[0-9A-Za-z.+-]{1,40}$/`.
    - A fixture turn with all six parts gives them in the stated order.
    - There are no ⟦ markers.
    - `\u0007`, `\r` and `\u0085` are stripped, while `\n` and `\t` stay.
    - 5000 units are cut to 4000. A surrogate pair across the cut is dropped whole, giving length 3999.
    - No `c_` or `dev_` string appears in the JSON.
  - **R2 (transport):**
    - The URL is `https://marc-coach.mmarcdarenz.workers.dev/reports` and the method is POST.
    - The headers are exactly `{content-type: application/json}`, with `credentials: 'omit'`.
    - 204 counts as sent and 429 as limited.
    - 400, 404, 500, 503, a thrown error and the 15-second timeout (fake timers) count as failed.
    - With `state.value.escobar.proxyUrl` set to a custom URL, `submitReport` (online, no dev mode, not automated, fetch spy) still calls that same built-in URL.
  - **R3 (guards):**
    - offline, dev mode and `automated` each make zero fetch calls and give failed, sent and failed;
    - offline together with dev mode gives failed, because the offline check runs first;
    - a source check finds no static `import … from './session'` in report.ts.
  - **R4 (nothing saved):**
    - a full report makes zero `localStorage.setItem` calls;
    - `sanitizeStore` output for a stored conversation is deep-equal before and after a report;
    - `reportKey` is unchanged after `trimOldest`;
    - after a sent report, `initialState(key)` is `'sent'`, which is what a remount starts from;
    - another conversation's key starts `'idle'`.
  - **R5 (UI logic, run under node):**
    - Called as a plain function, `EscobarTurnView` yields exactly one `ReportAnswer` vnode for a finished turn and zero when `live`.
    - With a custom `proxyUrl`, `ReportAnswer` still returns a `ReportControl` vnode.
    - `ReportAnswer` returns null for an empty, whitespace-only or control-only text.
    - Every reducer transition is covered.
    - `ReportView` in each state has the exact labels, the aria attributes (`aria-label`, `aria-expanded`, `role="group"` with `aria-labelledby` pointing at the visible question's id, `role="status"`, `role="alert"`) and the disclosure line.
    - After failed or limited, the reasons are still there.
    - `reportLabelId` differs between two turns of one conversation.
    - Two `submitReport` calls for one key, without awaiting, make one fetch. A different key is not blocked.
  - **R6 (copy):**
    - every visible string in every `ReportView` state passes the four patterns, imported from `tests/guards/no-contacts.ts`;
    - ESC-NC's tests pass unchanged.
  - **R7 (the docs' SQL):** the two SQL blocks under "Content reports" in `docs/ERROR-REPORTS.md` appear byte for byte in `escobar-worker/test/reports.test.ts`, where WR9 runs them.
  - **G1 (gate block `ESC-REPORT`):** dev mode, mock transport, all 5 `themes`. A request watch counts URLs containing `/reports`.
    1. Send the mock prompt. The finished turn has exactly one `.esc-report-btn` labelled "Report", and `checkContrast` on it gives at least 4.5.
    2. Record the localStorage keys and values (call this A).
    3. Tap Report:
       - `aria-expanded` is true;
       - 3 reasons, Cancel and the disclosure line show;
       - focus is on Offensive;
       - the group's `aria-labelledby` matches exactly one element;
       - take a screenshot.
    4. Press Escape. `dialog.esc-sheet[open]` still exists, the group is gone, and focus is on Report.
    5. Open the group and tap Cancel. Focus is on Report.
    6. Go offline, open the group and tap Wrong. The "Couldn’t send…" alert shows, and the reasons are still there.
    7. Go back online and double-click Wrong. Exactly one "Reported. Thank you." status shows, focused, with no alert.
    8. The localStorage keys and values equal A.
    9. Open menu → Past conversations → Back. The turn still shows "Reported. Thank you." and no Report button.
    10. Reload and send the mock prompt again. The new turn shows "Report".
    11. `.esc-report` holds no `a[href]`, `tel:` or `mailto:`.
    12. The `.esc-drawer-toggle` `.last()` probe still opens the drawer.
    13. The request watch counted 0.
- **connectivity:**
  - Tests and the gate never reach the network.
  - One recorded check on a real phone, using the PR's CI APK after ESC-REPORT-W is live:
    - with the coach on, tap Report under a reply and pick Harmful;
    - see "Reported. Thank you.";
    - the owner runs query 1 in the D1 console and sees that reply with the reason `harmful`.
  - The test row stays until the 90-day purge.
- **verification:**
  - Merge `origin/main`, then run `npm run check`, `npm run test:tz` and `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`.
  - `git diff --stat origin/main -- tests/` must show only `tests/escobar/report.test.ts`.
  - Each mutation must make the named test fail:

  | Mutation | Test that must fail |
  |---|---|
  | drop `!live` | R5 |
  | hide the button when `proxyUrl` is custom | R5 |
  | add the device header or a server flag | R2 |
  | send to `proxyUrlOf(proxyUrl)` | R2 |
  | treat 500 as sent | R2 |
  | drop the 4000 cut or the surrogate fix | R1 |
  | drop the chips, or any other part, from `reportText` | R1 |
  | narrow `CONTROL_RE` to `\u0000-\u001F` | R1 |
  | drop the `automated` guard | R3 |
  | drop the dev-mode guard | R3 and G1 step 7 |
  | check dev mode before offline | R3 |
  | a static import of `./session` | R3 |
  | persist `reported` to localStorage | R4 and G1 step 8 |
  | key by message index | R4 |
  | drop the in-flight guard | R5 |
  | one label id for every turn | R5 |
  | drop `preventDefault`/`stopPropagation` on Escape | G1 step 4 |
  | colour `--text-3`, or use the `esc-drawer-toggle` class | G1 steps 1 and 12 |
  | add "call us" or a link to any Report string | R6 |
  | change a column name in the docs' SQL | R7 |

- **risk_and_recovery:**
  - **Merging before the Worker is live:** every send would fail, visibly. Merge gate 1 blocks this.
  - **Text from a custom coach server lands in the owner's database:** accepted (see decision 5).
  - **After an app restart,** the button shows Report again. The server de-duplicates.
  - **Android Back while the reasons are open** closes the sheet, as it does today. Nothing is sent.
  - **Recovery:** revert the one Message.tsx line. `report.ts` and `Report.tsx` are then unused.
- **return:** PR link, head SHA, changed paths, evidence for each criterion, the mutation results, G1 screenshots for each theme, the device-check note, and the DOC-REPORT policy lines this code makes true.

---

## Card DOC-REPORT

- **id:** DOC-REPORT
- **outcome:** Both copies of the privacy policy and the Play Data safety answers describe reply reports exactly as built, before any build with ESC-REPORT goes to Play.
- **base:**
  - **(a)** A new branch `claude/doc-report-policy` off origin/main (6730bac or later), for `docs/PRIVACY-POLICY.md` and `docs/PLAY-SUBMISSION.md`. DOC-2 has merged, so both files are on main.
  - **(b)** The website branch `claude/app-website-design-671lk8` (#110, now 2373589), for:
    - the same `docs/PRIVACY-POLICY.md` bytes;
    - the text-only edit of `website/privacy/index.html`.

    Add plain commits on top of its head, after merging its origin. Never rebase, amend or force-push. The supervisor tells that branch's session before the push.
- **depends_on:** the fields, caps and retention fixed in ESC-REPORT-W and ESC-REPORT (this document). The docs can be written in parallel. (a) merges right after ESC-REPORT-W is live.
- **read_first:**
  - main `docs/PRIVACY-POLICY.md:3,7,23-60`
  - main `docs/PLAY-SUBMISSION.md:26-66`
  - website branch:
    - `website/privacy/index.html:66-131`;
    - `website/policy.mjs:1-5,81-93` (`REQUIRED`, `checkPolicy`);
    - `docs/WEBSITE-DESIGN.md:611-613`.
- **write_scope:**
  - (a) `docs/PRIVACY-POLICY.md` and `docs/PLAY-SUBMISSION.md`.
  - (b) `docs/PRIVACY-POLICY.md`, plus text-only edits in `website/privacy/index.html`: the lead (:71) and one new `<li>` in the `#leaves` chain list (:99-106).
- **reserved_paths:**
  - all `website/**` code, including `policy.mjs`, `gate.mjs` and the CSS;
  - the footer, which every page shares (:141);
  - everything else.
- **design_reference:**
  - **Privacy policy (the same bytes in both copies):**
    - **New section before :48, "## How your data is protected":**

      > ## Reporting a coach reply
      > Under each finished coach reply there is a Report button. Nothing is sent unless you tap it and pick a reason. A report holds only three items: the text of that reply as shown (its answer, the short notes it writes while it works, chart captions, the titles of changes it proposes, earlier drafts and suggested follow-up questions; at most 4,000 characters), the reason you picked (Offensive, Harmful or Wrong), and the app version. It holds no device id, install id, name or account, and none of your own messages or the rest of the conversation. A reply can repeat things about you, such as your split names or numbers; those are then part of the report.
      >
      > Reports always go to the built-in Cloudflare server, even if you set your own coach server. The server stores them in Cloudflare's database for 90 days after the first report of that reply, then deletes them. If the same reply is reported again for the same reason, it keeps one copy and counts the reports. Reports are used only to review the coach's replies and make the coach safer; they are not sent to Anthropic, sold or used for ads. To stop abuse the server allows 10 reports an hour per internet (IP) address; your IP address is never stored, only a scrambled code of it, deleted within a day.
    - **:7:** append "With the coach on, you can also report one of its replies; nothing is sent unless you tap Report and pick a reason."
    - **:35:** "keeps no conversation." becomes "keeps no conversation, except a reply you report (see Reporting a coach reply)."
    - **:37:** "Error reports always go to the built-in Cloudflare server." becomes "Error reports and reply reports always go to the built-in Cloudflare server."
    - **:52:** before "To ask about them", add "Reported replies are not linked to you either, so they can't be found or deleted per person; they are deleted 90 days after the first report."
    - **:3:** "Last updated" becomes the day (a) merges, with the same date in both copies.
    - **:57 "Changes":** keep its sentence, because `checkPolicy` needs "new date". Add a paragraph: "<that date>: added "Reporting a coach reply"."
  - **Website (b), text only:**
    - **:71 lead:** after "…anonymous error reports." add "With the coach on, you can also report one of its replies."
    - **`#leaves` list:** add a new `<li><p>` after the own-server item (:105): "Tap Report under a coach reply and pick a reason, and the text of that reply, the reason and the app version go to the project's own server, even if you set your own coach server. They are kept 90 days, with no device id."
    - **:98 and the footer (:141) stay unchanged.** A report can be sent only while the coach is on (EscobarSheet.tsx:321 shows the explainer, not the thread, when the coach is off). So "Nothing, until you turn on Online coach (Escobar) or error reports" stays true.
  - **Play Data safety (docs/PLAY-SUBMISSION.md):**
    - **:26:** rewrite the blocker note to say what is sent, to where, and for how long. End it with "Release to Play only after ESC-REPORT-W is live (POST /reports {} answers 400) and ESC-REPORT has merged."
    - **Table (:32):** add the columns "Ephemeral?" and "Required or optional?" after "Encrypted in transit?".
      - Every existing row gets "No" for Ephemeral?. That is the safe answer: the Worker's counters are kept 3 days, error and reply reports 90 days, and Anthropic keeps API requests up to 30 days (policy :36).
      - Every existing row gets "Optional" for Required or optional? (:65-66).
    - **Row :39** becomes: `| Messages (Other in-app messages) | Yes: coach conversation text, and a coach reply the user reports | Coach text: sent whenever Escobar is on. A reported reply: only when the user taps Report and picks a reason | Coach Worker (conversation passed on to Anthropic; a reported reply is stored in Cloudflare D1 for 90 days and never sent to Anthropic) | Yes | No | Optional | App functionality; Fraud prevention, security, and compliance |`
    - **New row:** `| App activity (Other actions) | The reason picked when reporting a reply (Offensive, Harmful or Wrong) | Only when the user taps Report and picks a reason | Coach Worker, stored in Cloudflare D1 for 90 days | Yes | No | Optional | App functionality; Fraud prevention, security, and compliance |`
    - **New list under the table, "Play Console answers for reply reports":** for Messages → Other in-app messages and for App activity → Other actions, each gets these answers:
      - Collected: Yes;
      - Shared: No (Cloudflare processes it for the developer as a service provider);
      - Processed ephemerally: No;
      - Required or optional: Optional;
      - Purposes: App functionality, and Fraud prevention, security, and compliance.
    - **Code references:** add reply reports: `src/escobar/report.ts` (ESC-REPORT), and `escobar-worker/src/errorsStore.ts` `content_reports` with its 90-day purge (ESC-REPORT-W).
    - **:58-63 (the deletion answer):** add "reply reports are not linked to a person and are deleted 90 days after the first report".
    - **:65-66:** "All network sharing (Escobar, error reports, reply reports) is optional: Escobar and error reports are off by default, and a reply report is sent only when the user taps Report and picks a reason."
- **acceptance:**
  - **D1:** on (b)'s head:
    - `npm run site:build` and `npm run site:gate` pass (`checkPolicy`);
    - the built `/privacy/` page has an element with id `reporting-a-coach-reply`;
    - there is a 390 px screenshot.
    - Mutation: delete the section heading.
  - **D2:** a claim table in the PR maps every claim to the ESC-REPORT-W or ESC-REPORT line that makes it true. The claims are:
    - the three items and the six parts of the text;
    - 4,000;
    - the three reasons;
    - no device id or install id;
    - the built-in server even with your own server;
    - 90 days from the first report;
    - one copy with a count;
    - not sent to Anthropic;
    - 10 an hour per IP address;
    - the scrambled code deleted within a day.

    The reviewer checks it line by line. Mutation: write "30 days"; no code line then matches.
  - **D3:**
    - every table row has all 8 cells;
    - exactly one table row starts `| Messages (Other in-app messages) |`, and "App activity (in-app messages)" appears 0 times;
    - both report data types have the five Play answers.
    - Mutation: leave the old :39 row in place.
  - **D4:** the lines added to `docs/PRIVACY-POLICY.md` and `website/privacy/index.html` (`git diff -U0 --word-diff=porcelain … | grep '^+[^+]'`, so only the added words are checked, not the existing contact line they sit on) pass `CONTACT_RE` from `tests/guards/no-contacts.ts` (on ESC-NC's branch until #122 merges). All the new text above was checked and passes all four patterns. Mutation: add a URL.
  - **D5:** `git diff --exit-code origin/claude/doc-report-policy origin/claude/app-website-design-671lk8 -- docs/PRIVACY-POLICY.md` prints nothing. Mutation: edit one copy only.
  - **D6:** in PLAY-SUBMISSION.md, these three paragraphs each name reply reports:
    - the AI-generated content paragraph (main :26);
    - the paragraph starting "Do you provide a way for users to request that their data be deleted?" (main :58-63);
    - the paragraph starting "Is data collection required or optional?" (main :65-66).
    Mutation: leave the last one as it is.
- **connectivity:** none. The owner types the Data safety answers into Play Console himself, and deploys the website by hand (website.yml, workflow_dispatch).
- **verification:**
  - D1 and D4 on (b)'s head, and D4 to D6 on (a)'s head.
  - The reviewer checks D2 and D3 against the ESC-REPORT-W and ESC-REPORT PR heads.
  - After the website is deployed, the live `/privacy/` page shows `#reporting-a-coach-reply`.
- **risk_and_recovery:**
  - **The text drifts from the code:** D2 checks it, and the ESC-REPORT PR body lists the policy lines it relies on. Any mismatch is fixed before release.
  - **Pushing to a branch another session owns:** plain commits only, the supervisor warns that session first, and a conflict is resolved with a merge.
  - **The policy goes live before the build that has Report:** harmless. It describes a button that is not there yet, and nothing is sent.
  - **The app is released before the policy:** blocked by the merge order.
- **return:**
  - the PR link for (a) and the commit link on (b), with head SHAs;
  - the 390 px screenshot;
  - the D2 claim table;
  - the Data safety rows and the Play Console answers, written exactly as the owner will enter them.

---

## Owner steps: reading reports on a phone

1. In Chrome, open **https://dash.cloudflare.com/?to=/:account/workers/d1**. Sign in if asked.
2. Tap **marc-errors**. If the phone list does not draw the row, tap the empty box where it should be.
3. Tap **Console**.
4. Paste one of the two queries below.
5. Tap **Execute**.

**Latest 20 reported replies** (the most recently first-reported come first):
```sql
SELECT id, datetime(stored_at / 1000, 'unixepoch') AS first_reported_utc, reason, n AS times, app, text FROM content_reports ORDER BY stored_at DESC, id DESC LIMIT 20;
```

**Reports in the last 7 days, by reason:**
```sql
SELECT reason, COUNT(*) AS replies, SUM(n) AS reports FROM content_reports WHERE stored_at >= (CAST(strftime('%s', 'now') AS INTEGER) - 7 * 86400) * 1000 GROUP BY reason ORDER BY reports DESC;
```

- **times:** how often that same reply was reported for that reason. A reply reported again keeps its first date, so the 7-day query counts replies first reported in the last 7 days.
- **"no such table: content_reports":** no report has arrived since the deploy, and the nightly clean-up (03:17 UTC) has not run yet. Try again the next day.
- **An empty result** means there are no reports.
- **Reports are unchecked text:** anyone can send one, so read them as hints.
- **Once a week,** copy any bad reply and its reason to the supervisor, who will adjust the coach.
- **Tested:**
  - both queries ran on SQLite 3.51 against the table in ESC-REPORT-W on 2026-09-30 (query 1 breaks ties by id, so its order is fixed);
  - WR9 runs them on every Worker test run;
  - R7 keeps the copy in docs/ERROR-REPORTS.md identical.

---

## Decisions the owner did not explicitly approve

1. **The report text is the whole reply as shown:** the answer, preamble lines, chart captions, proposal titles, revised drafts and the suggestion chips. Without them, a flagged caption or chip would reach the developer as the wrong text.
2. **The text is capped at 4,000 UTF-16 units, with one control-character rule on both sides.** Normal replies fit.
3. **Reply text is stored exactly on the server for 90 days, with digits kept.** This is new server-side data that can hold health details or split names. P4 said "90 days like error reports". Keeping digits keeps "Wrong" reports about numbers useful.
4. **De-duplication:** the same text and reason become one row with a count, and the 90 days run from the first report.
5. **The button always shows, and a report always goes to the built-in server, even with a custom coach server** (supervisor ruling S2, from verdict M1).
   - Text written by another server can therefore land in the owner's database. That is accepted, because the public endpoint takes anyone's text anyway and Play wants every AI reply to be reportable.
   - No server flag is sent.
6. **Reports are not tied to the error-report switch; the tap is the consent.**
7. **"Reported" is kept in memory only** and resets on restart. No new saved data.
8. **No offline queue.** A failure is shown, and tapping a reason again retries.
9. **Rate limits:** 10 an hour per network, checked first, then 200 an hour in total. One network can no longer use up the total, but many networks together can still block reports for up to an hour.
10. **The owner reads reports only in the D1 console** (supervisor ruling S1).
    - The owner ran queries there from his phone on 2026-09-30.
    - There is no owner page and no new secret.
    - The "link" the owner asked for is the D1 dashboard URL.
    - Error reports stay on `/errors/summary` as today.
11. **A one-line disclosure in the app** saying what a report sends.
12. **Data safety:**
    - The coach-text row moves to Messages → Other in-app messages, and a new row, App activity → Other actions, covers the reason. Both are optional, with the purposes App functionality and Fraud prevention, security, and compliance. The Fraud prevention purpose is a judgement call.
    - The new Ephemeral? column says "No" on every row.
13. **No alert when a report arrives.** The owner checks weekly; Play sets no deadline.
14. **Accepted gaps, left for a later card:**
    - memory items (models.ts:402) and pinned-card titles (PinnedCards.tsx:14) have no Report button;
    - a reply that is still streaming gets one only when it finishes.
15. **DOC-REPORT adds plain commits to the website branch,** which it does not own (supervisor ruling S3).

**Not verified:**
- whether Google counts the coach as "central" to the app. The cards assume the rule applies.
- whether the Play Console content-rating form now asks about AI chatbots. The owner should look.
- how the D1 console on a phone shows a 4,000-character text cell.

---

## Changes from the adversarial check

- **H1 (owner page login):** moot. The owner page is dropped (S1).
- **M1:** applied (S2).
  - The button always shows and always sends to `ESCOBAR_PROXY_URL`.
  - The old decision 5 and every "button is hidden" sentence are gone.
  - The policy says reports go to the built-in server even with your own server.
  - R2 and R5 test this.
- **M2:** applied. The per-network counter is checked first, and `r:all` is untouched on its 429 (WR5 f).
- **M3:** applied. WR6 now checks the exact columns, that only `error_rate` holds HMAC keys, and that no raw IP is stored.
- **M4:** the owner-route parts are moot. Through `worker.fetch`, POST `/reports {}` answers 400, and the "drop `/reports` from index.ts" mutation proves the routing (WR7).
- **M5:** applied. The policy says "deleted within a day".
- **M6:** applied. Policy :7, the website lead :71 and the `#leaves` list now mention reports. The footer (:141) is left alone because it is shared by every page and stays true.
- **M7:** applied.
  - DOC-REPORT (a) is a new branch off main.
  - (b) makes the same policy edit, plus the #plain text, on the website branch.
  - D5 checks that the two policy copies are byte-identical.
- **M8:** applied. Escape calls `preventDefault` and `stopPropagation` (G1 step 4).
- **M9:** applied.
  - `report.ts` has a pure reducer and an in-flight guard, and `ReportView` is presentational.
  - Focus, Escape, Cancel and double tap are checked in G1.
- **M10:** applied. G1 compares localStorage values, then reloads and re-sends (steps 2, 8 and 10).
- **M11:** moot (no owner page).
- **M12:** applied. There are two new columns, a list of the Play answers, and updated :58-63 and :65-66.
- **L1:** applied. The chips are part 6 of the report text.
- **L2:** applied. The policy names drafts, proposed changes, and "split names or numbers".
- **L3:** applied. There is one regex on both sides, and the button is hidden for whitespace-only or control-only text.
- **L4:** applied. The fixed key `de4c…dbbd` was computed with main 6730bac's `ipKey`.
- **L5:** applied. The dev-mode mutation now fails R3 and G1 step 7.
- **L6:** applied. R2 sets a custom `proxyUrl` before calling `submitReport`.
- **L7:** applied. `devMode` is read through `await import('./session')`, and R3 checks the source.
- **L8:** applied. The drawer probe and the Message.tsx anchor are named by selector and content, not by line.
- **L9:** applied in ESC-REPORT, where the group lives: `reportLabelId` gives one id per turn (R5, G1 step 3).
- **L10:** moot (no new secret).

**Also corrected in this pass:**
- main is now 6730bac, and only docs changed since e14c45b. ESC-NC is now 9235fcf.
- ESC-REPORT builds on main now. R6 and R7 arrive in the merge-main step after ESC-NC and ESC-REPORT-W.
- ESC-REPORT-W no longer touches `anthropic.ts`, `wrangler.toml`, `summarize` or `sameText`; those changes existed only for the owner page. It uses errorsHandler.ts's own `readCapped`.
- The live baseline (404 on 2026-09-30) is recorded for the post-deploy check.
- The "no such table" case is explained in the owner steps.
- The owner SQL is tested (WR9) and kept in sync with the docs (R7).
- The `limited` state keeps the reasons visible, like `failed`.
- Query 1 breaks ties with `id DESC`, so its order is always the same.

## Recheck fixes (supervisor, 2026-09-30 15:55 UTC)
D3, D4, D6 and WR5 now test the right thing (D4 checks only the added words; D3 counts the table row; WR5 gains (g) with a pinned report key; D6 names paragraphs, not lines). Line references corrected: `countRequest` :49-62, the scheduled test :282-293, `checkContrast` :316-343, and the ESC-NC Drawer anchor (217 on 9235fcf). main is now 0be62e1; that merge changed no cited line.
