# COACH-FEEDBACK-FIX: Helpful / Not now on Escobar's notes (task COACH-FB)

Base: `main` @ `d2c0ba445a2ec0e26f7642258f779b55bd5e00bb`. Owner report 2026-09-27 (real phone, Escobar tab).
Status: spec. A prototype of exactly this spec was built and checked in a scratch worktree at the base commit. Results are in section 9.

## 1. What the owner gets (plain words)

- Tap **Helpful** or **Not now** on a note and the note leaves at once. A short message confirms it: "Marked helpful" or "Snoozed for 7 days", with **Undo**. The chat does exactly the same thing when Escobar marks a note.
- Helpful hides the note until tomorrow. Not now hides it for 7 days, the same as today.
- A quick double tap hides only one note. It no longer hides the next note that slides into the same spot.
- Tapping again never adds another record. The app saves one record per note per day.
- The "Earlier this month" list is gone. When notes are hidden, one quiet line reads "2 notes hidden · Show". It opens to the notes' real titles, each with **Show again**.

## 2. Root cause (checked; details in the REPRO and CODE ROOT CAUSE reports)

1. **Helpful was built to do nothing visible.** `coach.ts:6` says "Helpful just records interest". The only filter, `rules.ts:531`, reads `'snoozed'` only.
2. **Not now does hide at once.** But the board is capped at 3, so the next note fills the freed slot straight away. In the owner's data the notes look almost the same ("X: progress has slipped", with the same body text). The card path had no toast, so a tap looked like it did nothing, and a second tap in the same spot hid the next note.
3. **Repeated taps made duplicates.** `saveInsightFeedback` (`coach.ts:8`) appends every time, and Helpful left the button on screen.
4. **The log showed raw labels.** `labelForInsight` (`Coach.tsx:281`) prints the id prefix before `:`, which gives "Decline", "Recovery.done today" and "Readiness today" with no subject.
5. **Reactivity is fine.** `insights` recomputes in the same tick as the tap: `selectors.ts:55-62` reads `state.value.insightFeedback`, and nothing caches it per session. The reload did not fix anything. So there is no reactivity fix to make. CFB-9 now pins this behaviour with a test.

## 3. Decisions (made, with reasons)

- **D1: Both verdicts hide the note at once. Helpful hides it for the rest of that day** (`f.day === today`); Not now keeps its 7 days. Why not "until the note's content changes"? Spotting a content change needs a stored copy or hash of the note's text, and that is a new kind of saved data (owner approval, `models.ts`/`store.ts`). The day rule needs only the existing `{id, day, verdict}`. A note that is still true comes back tomorrow, which fits "Helpful = keep telling me".
- **D2: One definition of "hidden", in `rules.ts`, applied inside `coachInsights` before the top-3 cut.** Filtering in `Coach.tsx` would leave the board with 2 cards and let the Hall's brief fallback (`insights.value[0]`) keep showing the hidden note. (review) The Today tab's top card (`src/slices/today/Today.tsx:35`, `insights.value[0]`) also reads this selector, so a note hidden on the Escobar tab leaves the Today tab too, for the same time. That is intended and needs no change in `Today.tsx`; say it in the PR. Because Escobar's `top_insights` and `get_insights` also call `coachInsights`, a note marked helpful today leaves Escobar's view too. That is intended: the app and Escobar agree on what is on the board, and `get_insights({includeSnoozed:true})` still returns everything.
- **D3: One helper, `giveInsightFeedback`, for the tab and the chat.** It uses the same words as `session.ts:171` today. Undo puts back only that note's record for that day, instead of `session.ts`'s whole-array snapshot. With a snapshot, a Show again done while the toast is up would be undone too. For a single tap the result is the same, and both paths now behave identically. `session.ts` calls the helper, so there is one code path.
- **D4: `saveInsightFeedback` keeps one record per (id, day).** A second tap removes the old record and appends the new one, so the new verdict wins. The same write also drops older (id, day) duplicates that earlier builds saved. On read, `hiddenInsightIds` collapses duplicates into a `Map`, and the raw log that displayed them is deleted, so old duplicates never show. `store.ts` and `models.ts` are untouched.
- **D5: The log is replaced by a hidden-notes row.** It follows the owner's words "wastes screen space". The row does not render when nothing is hidden, and when something is it is a single line inside the notes section with no extra section title. It lists only the hidden notes that Show again would put back in the top 3, using their live titles. So raw ids never show, a note whose rule stopped firing is not listed, and Show again always makes a card appear.
- **D6: The rules run once.** They are split as `runInsightRules` (rules plus the recovery filter) and `rankInsights` (hide, sort, one per id, one progress note per lift, cut to the limit). `coachInsights` = `rankInsights(runInsightRules(ctx), hiddenInsightIds(...), limit)`, with the same output as before except the Helpful-today hide. The selectors rank the board and the hidden list from one shared rules run, so the cost matches today's.
- **D7: A 500 ms double-tap guard on the card buttons only (`feedbackTap`).** It stops the slide-into-place double hide the owner hit. The chat path has no guard.
- **D8: No CSS change.** The row uses the existing `Row`, `Button` (quiet, sm), `.list`, `.small`, `.muted` and `.hint`. `src/ui/styles.css` is not touched.

## 4. Task card

- **id**: COACH-FB
- **outcome**: section 1.
- **base**: `origin/main` (spec checked at `d2c0ba4`). Branch `claude/coach-fb-<suffix>`.
- **depends_on**: none.
- **read_first**: this file; `src/slices/coach/coach.ts`; `src/slices/coach/Coach.tsx` L32-73 and L277-310; `src/brain/coach/rules.ts` L520-551; `src/app/selectors.ts` L55-63; `src/escobar/session.ts` L150-173; `src/app/clock.ts` L17-48 (review: `refreshClock`, R6); `tests/coach.test.ts` L129-141; `scripts/screenshot-gate.mjs` L85-108 and its last 40 lines.
- **write_scope**: `src/brain/coach/rules.ts`, `src/slices/coach/coach.ts`, `src/slices/coach/Coach.tsx`, `src/app/selectors.ts`, `src/escobar/session.ts`, `src/escobar/palace/registry.ts` (the one `coach.insights` entry), `tests/coach-feedback.test.ts` (new), `scripts/screenshot-gate.mjs` (add-only COACH-FB block), `docs/COACHING-DECISIONS.md`, `docs/COACHING-PLAN.md`, `docs/ESCOBAR-ARCHITECTURE.md`.
- **reserved_paths**: section 8.
- **acceptance**: CFB-1 … CFB-10 and CFB-G1 … CFB-G7 (section 7). (review: CFB-10 added)
- **design_reference**: the toast and Undo in `src/escobar/session.ts:171`, and the screenshot `screenshots/silent-black-coach-fb-hidden.png` that the gate block writes.
- **connectivity**: none. No network, no Escobar worker call, no AI key.
- **verification**: `npm run check`, `npm run test:tz`, `MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate`, plus the real-phone list (section 6).
- **risk_and_recovery**: section 5. Rollback means reverting the PR. The saved shape is unchanged, so an older build reads the same records.
- **return**: the PR URL, the head SHA, and evidence per criterion ID.

## 5. Risks and mitigations

| # | Risk | Mitigation |
|---|---|---|
| R1 | Escobar's `top_insights`/`get_insights` no longer see a note marked helpful today (D2). The `get_insights` `includeSnoozed` description ("Include insights the person snoozed.") is now slightly narrow. | Intended. `includeSnoozed:true` still returns all. **Do not** edit `schema.ts`: that forces a regenerated `escobar-worker/src/tools.generated.json`, which the owner deploys. Make it a follow-up only if the owner asks. |
| R2 | A fresh AI brief in the Hall ("Today's brief", `Hall.tsx:43`) still prints lines for notes that are now hidden. This was already true before (root-cause item 5). | Out of scope, and left unchanged to keep the fix small. Note it in the PR as a follow-up candidate. The non-AI fallback (`insights.value[0]`) is fixed by D2. |
| R3 | Ids that embed changing data (`scheduled-conflict:<split>:<muscle>`, `recovery.done-today:<split>`) can bring a note back under a new id. This was already true before. | Out of scope, because a new id means new content. Do not change ids: AskAbout refs and `brief.priorities[].insightId` depend on them. |
| R4 | The 500 ms guard could swallow a deliberate tap. | 500 ms is shorter than moving a finger to another card on purpose. Undo and Show again recover a note. The real-phone check covers it. |
| R5 | The chat Undo semantics change (snapshot → only that record). | Strictly safer: no other taps are lost. Pinned by CFB-6. |
| R6 | (review) Just after midnight, the `today` signal can lag `todayKey()` by up to 60 s (`clock.ts:38-48`, an unaligned 60 s interval). Without a fix, a Helpful tap in that window saves `day = D+1` while the board filters with `D`, so the note stays on screen under a "Marked helpful" toast. | (review) `saveInsightFeedback` and `restoreInsight` call `refreshClock()` first (10.2), so the record and the board use the same day at tap time. Pinned by CFB-10. What remains is harmless: yesterday's Helpful hides can last up to 60 s past midnight until the minute timer or resume (`main.tsx:53-55`) refreshes the clock. |
| R7 | Merge conflicts with other lanes in `Coach.tsx`, `selectors.ts`, `rules.ts` and the gate. | Merge `origin/main` with a merge commit before review. The gate block is appended just above `await browser.close();`, and both sides are kept. |
| R8 | The write path now drops exact (id, day) duplicates from saved data. | This changes content, not shape. Nothing reads duplicates (D4), so owner approval is not needed. Say so in the PR. |

## 6. Needs a real phone (owner's Android build)

1. Tap Helpful on a note. It leaves at once, and "Marked helpful · Undo" shows at the bottom. Tap Undo and it returns.
2. Tap Not now. The note leaves and "Snoozed for 7 days" shows. Double-tap Not now fast: only one note leaves.
3. Tap Helpful on one note, then within about 1 s tap Not now on the next one. Both taps work, so the guard does not swallow normal-speed taps.
4. The "N notes hidden" line appears. Show lists the real titles. Show again brings the note back and the line goes away when nothing is hidden.
5. Leave the app and come back (and also kill and reopen it). Hidden notes stay hidden and nothing reappears early.
6. The toast does not block tapping the notes' buttons. It can be swiped away, as elsewhere.

## 7. Acceptance criteria and evidence

Every test below was run on unmodified `d2c0ba4` (it fails) and on the prototype of this spec (it passes). See section 9. (review) Precisely: CFB-1 and CFB-4 fail on base on behaviour (Helpful did not hide; taps appended duplicates). CFB-2, 3, 5 to 10 fail on base because the functions they call do not exist yet. CFB-9 is a reactivity pin: for Not now, the same-tick hide already worked on base (REPRO). CFB-10 also fails on the spec's first prototype (without `refreshClock()`), which is the fail-before for the R6 fix.

| ID | Criterion (including failure paths) | Evidence |
|---|---|---|
| CFB-1 | A note marked helpful today is not shown today and is shown again tomorrow. | unit `CFB-1` |
| CFB-2 | Hide rules: a snooze hides for 7 days (unchanged); helpful hides the same day only; a snooze outranks a helpful; duplicate records collapse. | unit `CFB-2`; the existing `tests/coach.test.ts` snooze tests still pass |
| CFB-3 | The hidden list holds only notes that Show again would put back in the top 3, and never a note whose rule stopped firing. The shared rules list is never reordered. | unit `CFB-3` |
| CFB-4 | One record per (id, day); a changed verdict wins; older duplicates are compacted on the next write. | unit `CFB-4`; gate `CFB-G4` |
| CFB-5 | The card path shows "Snoozed for 7 days" / "Marked helpful" with Undo. Undo restores only that (id, day) record and keeps records written after it. | unit `CFB-5`; gate `CFB-G1`, `CFB-G2` |
| CFB-6 | The chat `snooze_insight` effect uses the same helper (same words, the same targeted Undo). | unit `CFB-6` |
| CFB-7 | A second card tap within 500 ms is ignored; a tap after that works. | unit `CFB-7`; gate `CFB-G3` |
| CFB-8 | Show again removes only the records hiding that note today, and keeps expired ones and other notes. | unit `CFB-8`; gate `CFB-G7` |
| CFB-9 | `insights` and `hiddenInsights` update in the same tick as the tap, and Show again brings the note back (the reactivity guard). | unit `CFB-9` |
| CFB-10 | (review) A Helpful tap just after midnight, before the minute timer has run, saves the new day and hides the note at once (the record and the board use the same day). | unit `CFB-10` |
| CFB-G1 | Real touch on Helpful: the note leaves the DOM and the "Marked helpful" toast shows. | gate block |
| CFB-G2 | Undo on the toast restores the exact three notes. | gate block |
| CFB-G3 | Not now hides the note; a second touch 100 ms later on the note that slid into place is ignored; the "Snoozed for 7 days" toast shows. | gate block |
| CFB-G4 | After Helpful → Undo → Not now on one note, saved data has no duplicate (id, day). | gate block |
| CFB-G5 | No "Earlier this month" text anywhere. | gate block |
| CFB-G6 | The "1 note hidden" row shows, and Show lists the note's live title. A screenshot is saved. | gate block |
| CFB-G7 | After a reload the note is still hidden and listed; Show again brings it back; the row disappears. | gate block |

Also required: the existing gate still passes, including L237 (the first `.insight` opens the sheet), L461 (`.insight h3` "Goal changed") and the palace pass. Keep the `.insight` class and the `h3` title. The new row's class `notes-hidden` does not match `.insight`.

## 8. Do NOT touch

- `src/core/store.ts`, `src/core/models.ts`, and any migration (saved shape, owner-approved).
- `escobar-worker/**`, and `src/escobar/tools/schema.ts` (R1: it would force a worker JSON regeneration).
- `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, and the Watch-lab row in `Settings.tsx` (watch agent).
- `.github/**`, `scripts/prepare-android.sh`, `native/patch_manifest.py`, and signing, keystore or `EXPECTED_SHA256` anything.
- `package.json`, `package-lock.json` (no new dependency).
- `src/ui/styles.css` (D8), `src/app/App.tsx`, `src/main.tsx`, `src/app/toast.ts`, `src/ui/primitives.tsx`.
- `tests/theme.test.ts`; other tasks' blocks in `scripts/screenshot-gate.mjs` and its final PASS line; existing tests in `tests/coach.test.ts`.
- Insight ids in `rules.ts` rule bodies, and `src/escobar/ui/Hall.tsx` (R2, R3).

## 9. Prototype evidence (scratch worktree at `d2c0ba4`, removed afterwards)

- `tests/coach-feedback.test.ts` on unmodified main: **9 of 9 failed**. On the prototype: **9 of 9 passed**, including under `TZ=America/New_York` and `TZ=Asia/Manila`.
- The COACH-FB gate block on a main build **failed with 13 errors**. Among them: "still shown after Helpful", "a quick second tap also hid …", duplicate saved records, and "the raw 'Earlier this month' log is still shown". On the prototype build it **passed**.
- Prototype: `npm run typecheck` was clean; the full vitest run gave 97 files and 1176 tests passed; `coachInsights(600)` perf was 45.9 ms against a 150 ms budget.
- Full gate on the prototype: `npm run gate` (all existing blocks plus COACH-FB) **PASS**, exit 0. That build did not yet include the text-only registry and docs edits in 10.6; `tests/escobar/palace*.test.ts` and the full vitest run (97 files, 1176 tests) pass with them. The builder re-runs everything on the final head anyway.
- Reference patch of the whole prototype (for convenience only; if it does not apply cleanly, use the exact code below): `/tmp/claude-0/-home-user-M-arc/06790388-49f8-576d-a2f2-765dd355dff8/scratchpad/COACH-FEEDBACK-FIX.patch`. (review) Regenerated to include the `refreshClock()` lines and CFB-10; it applies cleanly on `d2c0ba4`, and every code block in section 10 matches it verbatim.
- (review) Independent re-run by the adversarial review in a fresh worktree at `d2c0ba4`. The spec's own test file failed 9 of 9 on base; CFB-1 and CFB-4 failed on behaviour, the rest on missing functions. On the spec's first prototype, it passed 9 of 9, the full vitest run passed (97 files, 1176 tests), `test:tz` for the new file passed, `build` passed, and the full gate PASSED (exit 0). A new midnight test (CFB-10) failed on that prototype; the Helpful note stayed on the board. With the two `refreshClock()` lines it passed, under UTC, America/New_York, Asia/Manila and Pacific/Kiritimati. The final code gave: typecheck clean, full vitest 97 files and 1177 tests passed, `MARC_PERF=1` `coachInsights(600)` at 65.6 ms against a 150 ms budget. Final-code `build` passed, the full gate PASSED (exit 0), and `test:tz` passed 1177 of 1177 tests in both time zones.

## 10. Exact changes

### 10.1 `src/brain/coach/rules.ts`

Replace the whole `coachInsights` function (L523-551 at base) with the block below. `daysBetween`, `findExercise`, `derive`, `RULES` and `InsightFeedback` are already imported or defined in this file. Rule bodies do not change.

```ts
/** COACH-FB: why a note is hidden today. */
export interface InsightHide { verdict: InsightFeedback['verdict']; day: string }

/** COACH-FB: "Not now" hides a note for 7 days from its day (the F3.6 rule, unchanged); "Helpful" hides it for the rest of that day. */
export function feedbackHides(f: InsightFeedback, today: string): boolean {
  return f.verdict === 'snoozed' ? daysBetween(f.day, today) < 7 : f.day === today;
}

/** COACH-FB: every note id hidden today and why. A snooze outranks a helpful; among snoozes the latest day wins. Duplicate records collapse. */
export function hiddenInsightIds(feedback: InsightFeedback[], today: string): Map<string, InsightHide> {
  const out = new Map<string, InsightHide>();
  for (const f of feedback) {
    if (!feedbackHides(f, today)) continue;
    const cur = out.get(f.id);
    if (!cur || (f.verdict === 'snoozed' && (cur.verdict === 'helpful' || f.day > cur.day))) out.set(f.id, { verdict: f.verdict, day: f.day });
  }
  return out;
}

/** COACH-FB: every rule's insights, minus lift insights a recovering muscle already explains. Feedback is not applied here. */
export function runInsightRules(ctx: CoachContext): Insight[] {
  const d = derive(ctx);
  const all = RULES.flatMap(r => {
    try { return r.run(ctx, d); } catch { return []; }
  });
  // A recovery insight about a muscle explains plateau/readiness on lifts that target it.
  const recovering = new Set(all.filter(i => i.category === 'recovery').map(i => i.muscle));
  return all.filter(i => {
    if (!i.exerciseId || recovering.size === 0) return true;
    const meta = findExercise(i.exerciseId, ctx.custom);
    return !meta?.primary.some(m => recovering.has(m));
  });
}

/** Run every rule, drop duplicates per target, keep the most important. */
export function coachInsights(ctx: CoachContext, limit = 3): Insight[] {
  return rankInsights(runInsightRules(ctx), hiddenInsightIds(ctx.feedback, ctx.today), limit);
}

/** COACH-FB: hidden notes that would be back in the top `limit` if shown again (each checked on its own), highest priority first. */
export function hiddenBackOnBoard(list: Insight[], hidden: ReadonlyMap<string, InsightHide>, limit = 3): Array<{ insight: Insight } & InsightHide> {
  const out: Array<{ insight: Insight } & InsightHide> = [];
  for (const [id, why] of hidden) {
    const others = new Map(hidden);
    others.delete(id);
    const back = rankInsights(list, others, limit).find(i => i.id === id);
    if (back) out.push({ insight: back, ...why });
  }
  return out.sort((a, b) => b.insight.priority - a.insight.priority);
}

/** COACH-FB: drop hidden ids, then rank. Never sorts `list` in place (selectors share it). */
export function rankInsights(list: Insight[], hidden: ReadonlyMap<string, unknown>, limit = 3): Insight[] {
  const seen = new Set<string>();
  // BR-27: one progress insight per lift, the highest-priority one.
  const progressFor = new Set<string>();
  return list
    .filter(i => !hidden.has(i.id))
    .sort((a, b) => b.priority - a.priority)
    .filter(i => { if (seen.has(i.id)) return false; seen.add(i.id); return true; })
    .filter(i => {
      if (i.category !== 'progress' || !i.exerciseId) return true;
      if (progressFor.has(i.exerciseId)) return false;
      progressFor.add(i.exerciseId);
      return true;
    })
    .slice(0, limit);
}
```

### 10.2 `src/slices/coach/coach.ts`

Replace the file's first 9 lines (the imports through the end of `saveInsightFeedback`) with the block below. `acceptDeload` stays as it is.

(review) `saveInsightFeedback` and `restoreInsight` call `refreshClock()` (from `src/app/clock.ts`, read-only here) before they read `todayKey()`. Without it, a tap in the first minute after midnight saved `day = D+1` while the board still filtered with the stale `today` signal `D` (`clock.ts:38-48` is a 60 s interval that is not aligned to the minute), so Helpful did not hide the note although the toast said "Marked helpful". Proven by CFB-10 (fails without these two lines, passes with them).

```ts
import { state, update } from '@/core/store';
import { todayKey, addDays } from '@/core/dates';
import type { InsightFeedback } from '@/core/models';
import { showToast } from '@/app/toast';
import { feedbackHides } from '@/brain/coach/rules';
import { refreshClock } from '@/app/clock';
import { DELOAD_DAYS, DELOAD_LOAD_FACTOR, DELOAD_SET_FACTOR } from '@/data/deload';

/** COACH-FB: keep the last record per (id, day), in their original order. Clears duplicates older builds saved. */
function oncePerDay(list: InsightFeedback[]): InsightFeedback[] {
  const last = new Map<string, number>();
  list.forEach((f, i) => last.set(`${f.id}|${f.day}`, i));
  return list.filter((f, i) => last.get(`${f.id}|${f.day}`) === i);
}

/** F3.6 + COACH-FB: one record per (insight id, day); a second tap replaces the first (the new verdict wins) and moves it to the end. "Helpful" hides the note for the rest of today, "snoozed" for 7 days (coachInsights filters both). Newest last, capped at 200 (matches AppState.insightFeedback's own cap). */
export function saveInsightFeedback(id: string, verdict: InsightFeedback['verdict']): void {
  refreshClock(); // (review) the board filters on the `today` signal, which can lag todayKey() by up to 60 s after midnight
  const day = todayKey();
  update(s => ({ ...s, insightFeedback: [...oncePerDay(s.insightFeedback).filter(f => !(f.id === id && f.day === day)), { id, day, verdict }].slice(-200) }));
}

/** COACH-FB: the one path for Helpful / Not now, from the Escobar tab and from chat (snooze_insight). Saves, then toasts with an Undo that puts back only this (id, day) record as it was, so later taps survive. */
export function giveInsightFeedback(id: string, verdict: InsightFeedback['verdict']): void {
  const day = todayKey();
  const prev = [...state.value.insightFeedback].reverse().find(f => f.id === id && f.day === day) ?? null;
  saveInsightFeedback(id, verdict);
  showToast(verdict === 'snoozed' ? 'Snoozed for 7 days' : 'Marked helpful', 'Undo', () => update(s => ({
    ...s, insightFeedback: [...s.insightFeedback.filter(f => !(f.id === id && f.day === day)), ...(prev ? [prev] : [])],
  })));
}

/** COACH-FB: a second card tap within this window is ignored, so a quick double tap cannot hide the next card that slides into the same spot. */
export const FEEDBACK_TAP_GAP_MS = 500;
let lastTapAt = -Infinity;
/** COACH-FB: a card button tap. Returns false when ignored as a double tap. */
export function feedbackTap(id: string, verdict: InsightFeedback['verdict'], now = Date.now()): boolean {
  if (now - lastTapAt < FEEDBACK_TAP_GAP_MS) return false;
  lastTapAt = now;
  giveInsightFeedback(id, verdict);
  return true;
}

/** COACH-FB: "Show again" on a hidden note: remove only the records that hide it today. */
export function restoreInsight(id: string): void {
  refreshClock();
  const day = todayKey();
  update(s => ({ ...s, insightFeedback: s.insightFeedback.filter(f => !(f.id === id && feedbackHides(f, day))) }));
}
```

### 10.3 `src/app/selectors.ts`

In the rules import, replace `coachInsights, deloadOffer, type CoachContext` with `deloadOffer, hiddenBackOnBoard, hiddenInsightIds, rankInsights, runInsightRules, type CoachContext`. Then replace the single line `export const insights = computed(() => coachInsights(coachContext.value, 3));` with:

```ts
/** COACH-FB: the rules run once; the board and the hidden-notes list both rank from this one list. */
const rawInsights = computed(() => runInsightRules(coachContext.value));
const hiddenById = computed(() => hiddenInsightIds(state.value.insightFeedback, today.value));
export const insights = computed(() => rankInsights(rawInsights.value, hiddenById.value, 3));
/** COACH-FB: hidden notes that "Show again" would put back on the board, with why each is hidden. */
export const hiddenInsights = computed(() => (hiddenById.value.size ? hiddenBackOnBoard(rawInsights.value, hiddenById.value, 3) : []));
```

### 10.4 `src/escobar/session.ts`

- Import: `import { saveInsightFeedback } from '@/slices/coach/coach';` → `import { giveInsightFeedback } from '@/slices/coach/coach';`
- `function applyEffect(e: MemoryEffect): void {` → `/** Exported for tests (COACH-FB). */` followed by `export function applyEffect(e: MemoryEffect): void {`. It stays in the object passed to `EscobarLoop`.
- Replace the `snooze` branch with:

```ts
  } else if (e.type === 'snooze') {
    // COACH-FB: the same helper as the Escobar tab's Helpful / Not now buttons (same toast, same Undo).
    giveInsightFeedback(e.insightId, e.verdict);
  }
```

`state`, `update` and `showToast` are still used by the other branches, so keep their imports.

### 10.5 `src/slices/coach/Coach.tsx`

- Imports: add `hiddenInsights` to the `@/app/selectors` import; remove `addDays` from the `@/core/dates` import (its only use was the deleted log); change `import { acceptDeload, saveInsightFeedback } from './coach';` to `import { acceptDeload, feedbackTap, restoreInsight } from './coach';`.
- Card buttons (L65-66): change `saveInsightFeedback(i.id, 'helpful')` to `feedbackTap(i.id, 'helpful')`, and `saveInsightFeedback(i.id, 'snoozed')` to `feedbackTap(i.id, 'snoozed')`. The labels stay "Helpful" and "Not now".
- Inside the notes `Section`'s `<div class="stack-sm">`, add `<HiddenNotes />` right after the `{!list.length && …}` empty card. Delete the `<InsightFeedbackLog />` line after the `Section`.
- Delete `labelForInsight` and `InsightFeedbackLog` (L280-306 at base) and put these in their place:

```tsx
/** COACH-FB: one quiet row when notes are hidden; it opens to their current titles, each with Show again. Replaces the F3.6 "Earlier this month" log. */
function HiddenNotes() {
  const hidden = hiddenInsights.value;
  const [open, setOpen] = useState(false);
  if (!hidden.length) return null;
  return (
    <div class="list notes-hidden">
      <Row trailing={<Button variant="quiet" size="sm" aria-expanded={open} onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'}</Button>}>
        <span class="small muted">{hidden.length} note{hidden.length === 1 ? '' : 's'} hidden</span>
      </Row>
      {open && hidden.map(h => (
        <Row key={h.insight.id} trailing={<Button variant="quiet" size="sm" onClick={() => restoreInsight(h.insight.id)}>Show again</Button>}>
          <span class="small">{h.insight.title}</span>
          <div class="hint">{h.verdict === 'helpful' ? 'Helpful · back tomorrow' : backIn(h.day)}</div>
        </Row>
      ))}
    </div>
  );
}

/** COACH-FB: "Not now · back in N days" for a snooze made on `day` (it lasts 7 days). */
function backIn(day: string): string {
  const n = Math.min(7, Math.max(1, 7 - daysBetween(day, today.value)));
  return `Not now · back in ${n} day${n === 1 ? '' : 's'}`;
}
```

### 10.6 `src/escobar/palace/registry.ts`, `docs/*`

Apply exactly these hunks. In the palace, only the `coach.insights` entry's `what` text and keywords change; the id and target stay. The docs are updated in place, following the one-doc-per-topic rule.

```diff
diff --git a/docs/COACHING-DECISIONS.md b/docs/COACHING-DECISIONS.md
index cde652e..e6fc76a 100644
--- a/docs/COACHING-DECISIONS.md
+++ b/docs/COACHING-DECISIONS.md
@@ -244,9 +244,9 @@ One entry per decision not already made explicit by section 8 of `docs/COACHING-
   **Why**: without that filter, an untrained muscle with a stale, tiny 4-week median could read as "under" purely from wording, which is noise rather than the "far under or over its band" the F3.2 bullet describes for a muscle the user is actually training. Scoping to the user's own program keeps the insight's premise ("your usual range") literally true.
   **Source**: plan section 4 (F3.2 bullet: "when a trained muscle is far under or over its band").
 
-- **Decided**: F3.6's "Not now"/snooze and "Helpful" feedback is per-insight-`id`, and the "Earlier this month" log renders a label derived from the id's stable prefix (e.g. `volume:chest` → "Volume", `decline:lib_barbell_bench_press` → "Decline") rather than the insight's own title/means/action text at the time it fired.
-  **Why**: `InsightFeedback` only ever needed `{id, day, verdict}` for the actual behavioural requirement (snoozed hides for 7 days, tested in `coach.test.ts`); storing each insight's full rendered text at feedback time would be a second, parallel copy of data the rules pipeline already owns and can re-derive differently tomorrow (e.g. a decline insight's exact numbers change every day). The log is a receipt of "what you tapped," not a replay of what it said.
-  **Source**: F3.6 bullet ("a small insight log in Coach"), read against "don't design for hypothetical future requirements" — a full-text cache is unrequested scope.
+- **Decided (COACH-FB, 2026-09-27; replaces the F3.6 "Earlier this month" log decision)**: "Helpful" hides a note for the rest of that day and "Not now" hides it for 7 days. Both show the chat path's toast ("Marked helpful" / "Snoozed for 7 days") with an Undo that puts back only that note's record for that day. Feedback keeps one record per (id, day); a second tap replaces the first. The "Earlier this month" log is gone: one "N notes hidden" row under Escobar's notes opens to the hidden notes' live titles, each with Show again, and lists only notes that Show again would put back in the top three.
+  **Why**: the owner tapped Helpful and Not now and saw the card stay (Helpful never hid; after Not now a near-identical card slid into the same spot) while the log filled with identical rows of raw id prefixes ("Decline", "Recovery.done today"). Feedback still stores only `{id, day, verdict}`, so there is no new kind of saved data. Titles come from the live rules, so raw ids are never shown. Helpful lasts one day rather than "until the note's content changes" because spotting a content change would need a stored copy of the note's text, which is a new kind of saved data.
+  **Source**: owner report 2026-09-27; `COACH-FEEDBACK-FIX.md`.
 
 - **Decided**: F3.4's warm-up rows and F3.5's in-session cue both key off the *live* entry's most recent prior e1RM/exercise metadata computed fresh in `EntryCard`, not off the pre-session brief's own `warmupRamp()`/`pickCue()` calls from `preSessionInsights()` — the two are independent computations of the same underlying data (`warmupSets()` is shared; the cue is not tracked/cached between the two call sites).
   **Why**: the pre-session sheet and the live session are different mounts (a sheet dismissed, then hours or days later the entry card renders); trying to thread one computation's result through as state to the other would need new plumbing for a purely cosmetic consistency guarantee (both computations are deterministic given the same inputs, so they already agree in practice — same e1RM in, same ramp out).
diff --git a/docs/COACHING-PLAN.md b/docs/COACHING-PLAN.md
index ffcadc1..81901c1 100644
--- a/docs/COACHING-PLAN.md
+++ b/docs/COACHING-PLAN.md
@@ -196,7 +196,7 @@ Priority: **P0** unblock, **P1** highest coaching value per effort, **P2** stron
 - **F3.3 Deload state**: trigger when (a) two or more main lifts plateaued or declining, or (b) effort drift harder on 2+ lifts with rising weekly volume for 3 weeks, or (c) readiness red for 3 of the last 5 days. Coach offers "Take a lighter week"; accepting sets `deload = {startDay, endDay, reason}`; progression then targets minus 30 to 40% sets and minus 10% load with `mode: 'deload'`; a week later the coach closes it and returns to normal targets.
 - **F3.4 Warm-up sets** for weighted main lifts from the next target: 50% × 8, 70% × 5, 85% × 2 (rounded to the load step), shown collapsed above the working sets.
 - **F3.5 Cues in the live session**: `pickCue(exercise, 'coach')` for the open exercise (one line under the target), `learn` cue on the finish screen. Track shown cues per exercise to rotate.
-- **F3.6 Insight feedback**: "Helpful / Not now" on each insight card; snoozed insights are hidden for 7 days; a small insight log in Coach ("Earlier this month").
+- **F3.6 Insight feedback**: "Helpful / Not now" on each insight card. Helpful hides the card for the rest of the day, Not now for 7 days, each with an Undo toast; hidden notes sit behind one "N notes hidden" row with Show again (COACH-FB replaced the "Earlier this month" log).
 - **F3.7 Exercise substitution** when a muscle is recovering or an insight suggests balance work: pick from `LIBRARY` by pattern and equipment group with the same primary muscle.
 - **F3.8 Morning coach notification** (optional, off by default): readiness summary at the reminder time on training days.
 
diff --git a/docs/ESCOBAR-ARCHITECTURE.md b/docs/ESCOBAR-ARCHITECTURE.md
index 2ab99c6..26845ef 100644
--- a/docs/ESCOBAR-ARCHITECTURE.md
+++ b/docs/ESCOBAR-ARCHITECTURE.md
@@ -379,7 +379,7 @@ Each returns immediately with `{proposalId, status: 'awaiting_user', preview}` a
 | `propose_custom_exercise` | `{name, equipment, primary[1–2], secondary[], mode, role}` | `makeCustomExercise` plus `saveCustomExercise` |
 | `propose_reminder` | `{enabled, time?: 'HH:MM', style?, readinessSummary?}` | preferences update plus `resyncReminders()` |
 | `propose_setting` | `anyOf` per key: `rest.mode` (`'time'\|'heart'`, the real field is `preferences.rest.mode`), `autoRest`, `restDefaultSec`, `weightUnit`, `showSpark`, `haptics` | `update()` on preferences (`setHapticsEnabled` too for haptics) |
-| `snooze_insight` | `{insightId, verdict: 'snoozed'\|'helpful'}` | `saveInsightFeedback` (applied immediately; low risk; Undo shown) |
+| `snooze_insight` | `{insightId, verdict: 'snoozed'\|'helpful'}` | `giveInsightFeedback`, the same helper as the Escobar tab's buttons (applied immediately; one record per note and day; Undo puts back only that record) |
 | `propose_equipment_profile` | `{scope: 'exercise'\|'equipment', exerciseId?, equipmentGroup?, gymId, profile}` | `units.byExercise` / `units.byEquipment` (validated per §25.6), Undo |
 | `propose_gym` | `{name, defaultUnit}` | Adds the gym to `units.gyms` and sets it active |
 | `escalate` | `{kind: 'pain'\|'medical'\|'crisis'\|'disordered_eating', note?}` | Renders the fixed card (§19); no state write |
diff --git a/src/escobar/palace/registry.ts b/src/escobar/palace/registry.ts
index 761acd6..2d5aeb4 100644
--- a/src/escobar/palace/registry.ts
+++ b/src/escobar/palace/registry.ts
@@ -85,7 +85,7 @@ export const PALACE: PalaceEntry[] = [
   // Coach
   e('coach.header', 'Escobar', 'Escobar tab', 'Escobar’s hall: ask a question, today’s brief, notes, plans, goal and schedule.', ['coach', 'escobar', 'advice', 'what next'], { tab: 'coach' }),
   e('coach.week-line', 'This week in one line', 'Escobar tab → top card', 'This week’s workouts, sets and records in one sentence.', ['week', 'summary', 'one line'], { tab: 'coach' }),
-  e('coach.insights', 'Escobar’s notes', 'Escobar tab → Escobar’s notes', 'Every current coach insight: recovery, progress, readiness, balance, focus. Helpful or Not now on each. A lighter week offer appears above when it’s due.', ['insights', 'notes', 'deload', 'lighter week', 'snooze', 'not now', 'helpful', 'balance'], { tab: 'coach' }, { methods: ['deload_trigger', 'balance', 'plateau'] }),
+  e('coach.insights', 'Escobar’s notes', 'Escobar tab → Escobar’s notes', 'Every current coach insight: recovery, progress, readiness, balance, focus. Helpful hides a note until tomorrow, Not now for 7 days, each with Undo. Hidden notes sit behind one row under the list, with Show again. A lighter week offer appears above when it’s due.', ['insights', 'notes', 'deload', 'lighter week', 'snooze', 'not now', 'helpful', 'balance', 'hidden notes', 'show again'], { tab: 'coach' }, { methods: ['deload_trigger', 'balance', 'plateau'] }),
   e('coach.goal', 'Training goal', 'Escobar tab → Training goal', 'Your goal and its rep ranges.', ['goal', 'strength', 'hypertrophy', 'lean', 'muscle', 'fat loss', 'rep range'], { tab: 'coach' }, { methods: ['progression'] }),
   e('panel.goal', 'Change training goal', 'Escobar tab → Training goal → Change', 'Pick a goal; it offers the goal’s rest time and templates.', ['change goal', 'switch goal', 'new goal'], { tab: 'coach', panel: 'goal' }),
   e('coach.schedule', 'Weekly schedule', 'Escobar tab → Weekly schedule', 'Which split on which weekday. Reminders and streaks follow it.', ['schedule', 'weekly', 'days', 'plan', 'rest days'], { tab: 'coach' }),
```

### 10.7 `tests/coach-feedback.test.ts` (new file, exact content)

```ts
// COACH-FB: Helpful / Not now hide a note at once, one record per (id, day), a toast with a
// targeted Undo on both the card and the chat path, and a hidden-notes list instead of the raw log.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as rules from '@/brain/coach/rules';
import { coachInsights, type Insight } from '@/brain/coach/rules';
import { emptySchedule, type InsightFeedback } from '@/core/models';
import { baseCoachExtras } from './helpers';

const baseCtx = { sessions: [], splits: [], schedule: emptySchedule(), custom: [], today: '2026-09-18', now: new Date('2026-09-18T12:00:00Z').getTime(), ...baseCoachExtras };
const profileHistory = [{ at: '2026-09-17T08:00:00Z', field: 'bodyWeightKg' as const, from: 80, to: 78, source: 'user' as const }];
const note = (id: string, priority: number, extra: Partial<Insight> = {}): Insight => ({ id, category: 'focus', priority, title: `T ${id}`, noticed: '', means: '', action: '', ...extra });

describe('COACH-FB: Helpful hides a note for the rest of the day (pure rules)', () => {
  it('CFB-1 an insight marked helpful today is hidden today and back tomorrow', () => {
    const insight = coachInsights({ ...baseCtx, profileHistory })[0]!;
    const fb: InsightFeedback[] = [{ id: insight.id, day: '2026-09-18', verdict: 'helpful' }];
    expect(coachInsights({ ...baseCtx, profileHistory, feedback: fb }).some(i => i.id === insight.id)).toBe(false);
    const tomorrow = { ...baseCtx, today: '2026-09-19', now: new Date('2026-09-19T12:00:00Z').getTime() };
    expect(coachInsights({ ...tomorrow, profileHistory }).some(i => i.id === insight.id)).toBe(true);
    expect(coachInsights({ ...tomorrow, profileHistory, feedback: fb }).some(i => i.id === insight.id)).toBe(true);
  });

  it('CFB-2 hiddenInsightIds: snooze 7 days, helpful same day only, snooze outranks helpful, duplicates collapse', () => {
    const fb: InsightFeedback[] = [
      { id: 'a', day: '2026-09-18', verdict: 'helpful' },
      { id: 'a', day: '2026-09-18', verdict: 'helpful' },
      { id: 'b', day: '2026-09-17', verdict: 'helpful' },
      { id: 'c', day: '2026-09-12', verdict: 'snoozed' },
      { id: 'd', day: '2026-09-11', verdict: 'snoozed' },
      { id: 'e', day: '2026-09-15', verdict: 'snoozed' },
      { id: 'e', day: '2026-09-18', verdict: 'helpful' },
    ];
    const m = rules.hiddenInsightIds(fb, '2026-09-18');
    expect([...m.keys()].sort()).toEqual(['a', 'c', 'e']);
    expect(m.get('a')).toEqual({ verdict: 'helpful', day: '2026-09-18' });
    expect(m.get('c')).toEqual({ verdict: 'snoozed', day: '2026-09-12' });
    expect(m.get('e')).toEqual({ verdict: 'snoozed', day: '2026-09-15' });
  });

  it('CFB-3 hiddenBackOnBoard lists only hidden notes that would be back in the top 3 (not ones that stopped firing), and never mutates the shared list', () => {
    const list = [note('n10', 10), note('n50', 50), note('n40', 40), note('n30', 30), note('n20', 20)];
    const order = list.map(i => i.id);
    const hidden = new Map([['n50', { verdict: 'snoozed' as const, day: '2026-09-18' }], ['n10', { verdict: 'helpful' as const, day: '2026-09-18' }], ['gone', { verdict: 'snoozed' as const, day: '2026-09-18' }]]);
    expect(rules.rankInsights(list, hidden, 3).map(i => i.id)).toEqual(['n40', 'n30', 'n20']);
    expect(rules.hiddenBackOnBoard(list, hidden, 3).map(h => [h.insight.id, h.verdict])).toEqual([['n50', 'snoozed']]);
    expect(list.map(i => i.id)).toEqual(order);
  });
});

describe('COACH-FB: store paths', () => {
  const local = (y: number, m: number, d: number, h: number, mi: number): Date => new Date(y, m - 1, d, h, mi);
  beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(local(2026, 9, 18, 12, 0)); vi.resetModules(); });
  afterEach(() => { vi.useRealTimers(); });

  async function boot(insightFeedback: InsightFeedback[] = []) {
    const store = await import('@/core/store');
    const { freshState } = await import('@/core/models');
    store.replaceState({ ...freshState(), profileHistory, insightFeedback });
    return { store, coach: await import('@/slices/coach/coach'), toast: await import('@/app/toast'), sel: await import('@/app/selectors') };
  }

  it('CFB-4 saveInsightFeedback keeps one record per (id, day); a changed verdict wins; old duplicates are compacted', async () => {
    const { store, coach } = await boot([
      { id: 'old', day: '2026-09-10', verdict: 'helpful' },
      { id: 'old', day: '2026-09-10', verdict: 'helpful' },
      { id: 'old', day: '2026-09-10', verdict: 'helpful' },
    ]);
    coach.saveInsightFeedback('x', 'helpful');
    coach.saveInsightFeedback('x', 'helpful');
    coach.saveInsightFeedback('x', 'snoozed');
    coach.saveInsightFeedback('y', 'helpful');
    expect(store.state.value.insightFeedback).toEqual([
      { id: 'old', day: '2026-09-10', verdict: 'helpful' },
      { id: 'x', day: '2026-09-18', verdict: 'snoozed' },
      { id: 'y', day: '2026-09-18', verdict: 'helpful' },
    ]);
  });

  it('CFB-5 giveInsightFeedback toasts like the chat path and its Undo puts back only what that tap changed', async () => {
    const { store, coach, toast } = await boot([{ id: 'a', day: '2026-09-18', verdict: 'helpful' }]);
    coach.giveInsightFeedback('a', 'snoozed');
    expect(toast.toast.value?.message).toBe('Snoozed for 7 days');
    expect(toast.toast.value?.action).toBe('Undo');
    const undo = toast.toast.value!.onAction!;
    coach.saveInsightFeedback('b', 'helpful');
    undo();
    expect(store.state.value.insightFeedback).toEqual([
      { id: 'b', day: '2026-09-18', verdict: 'helpful' },
      { id: 'a', day: '2026-09-18', verdict: 'helpful' },
    ]);
    coach.giveInsightFeedback('c', 'helpful');
    expect(toast.toast.value?.message).toBe('Marked helpful');
    toast.toast.value!.onAction!();
    expect(store.state.value.insightFeedback.some(f => f.id === 'c')).toBe(false);
  });

  it('CFB-6 the chat snooze_insight effect uses the same helper (targeted Undo)', async () => {
    const { store, coach, toast } = await boot();
    const session = await import('@/escobar/session');
    session.applyEffect({ type: 'snooze', insightId: 'a', verdict: 'snoozed' });
    expect(toast.toast.value?.message).toBe('Snoozed for 7 days');
    const undo = toast.toast.value!.onAction!;
    coach.saveInsightFeedback('b', 'snoozed');
    undo();
    expect(store.state.value.insightFeedback).toEqual([{ id: 'b', day: '2026-09-18', verdict: 'snoozed' }]);
  });

  it('CFB-7 feedbackTap ignores a second tap within 500 ms, then accepts again', async () => {
    const { store, coach } = await boot();
    const t0 = Date.now();
    expect(coach.feedbackTap('a', 'snoozed', t0)).toBe(true);
    expect(coach.feedbackTap('b', 'snoozed', t0 + 150)).toBe(false);
    expect(coach.feedbackTap('b', 'snoozed', t0 + 600)).toBe(true);
    expect(store.state.value.insightFeedback.map(f => f.id)).toEqual(['a', 'b']);
  });

  it('CFB-8 restoreInsight removes only the records hiding that note today', async () => {
    const { store, coach } = await boot([
      { id: 'a', day: '2026-09-01', verdict: 'snoozed' },
      { id: 'a', day: '2026-09-15', verdict: 'snoozed' },
      { id: 'b', day: '2026-09-18', verdict: 'helpful' },
    ]);
    coach.restoreInsight('a');
    expect(store.state.value.insightFeedback).toEqual([
      { id: 'a', day: '2026-09-01', verdict: 'snoozed' },
      { id: 'b', day: '2026-09-18', verdict: 'helpful' },
    ]);
  });

  it('CFB-9 insights and hiddenInsights update in the same tick as the tap, and Show again brings the note back', async () => {
    const { coach, sel } = await boot();
    const first = sel.insights.value[0]!;
    coach.giveInsightFeedback(first.id, 'helpful');
    expect(sel.insights.value.some(i => i.id === first.id)).toBe(false);
    expect(sel.hiddenInsights.value.map(h => [h.insight.title, h.verdict])).toEqual([[first.title, 'helpful']]);
    coach.restoreInsight(first.id);
    expect(sel.insights.value.some(i => i.id === first.id)).toBe(true);
    expect(sel.hiddenInsights.value).toEqual([]);
  });

  it('CFB-10 a tap just after midnight, before the minute timer runs, still hides the note (the board and the record use the same day)', async () => {
    vi.setSystemTime(local(2026, 9, 18, 23, 59));
    const { store, coach, sel } = await boot();
    const first = sel.insights.value[0]!;
    vi.setSystemTime(local(2026, 9, 19, 0, 0));
    coach.giveInsightFeedback(first.id, 'helpful');
    expect(store.state.value.insightFeedback).toEqual([{ id: first.id, day: '2026-09-19', verdict: 'helpful' }]);
    expect(sel.insights.value.some(i => i.id === first.id)).toBe(false);
    expect(sel.hiddenInsights.value.map(h => h.insight.id)).toEqual([first.id]);
  });
});
```

### 10.8 `scripts/screenshot-gate.mjs`: append this block just above `await browser.close();` (add-only; do not edit the final PASS line)

```js
// COACH-FB: on Escobar's notes, Helpful and Not now hide the tapped note at once, with the chat
// path's toast and a working Undo; a quick second tap cannot hide the note that slides into the
// same spot; saved feedback keeps one record per (note, day); the raw "Earlier this month" log is
// gone; hidden notes sit behind one quiet row that opens to their titles, each with Show again;
// a hidden note stays hidden after a reload.
{
  const tag = 'COACH-FB';
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push(`${tag}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error') errors.push(`${tag} console: ${m.text()}`); });
  await page.addInitScript(([legacyJson]) => { if (!localStorage.getItem('marc.state.v1')) localStorage.setItem('dailyTrackerPremium', legacyJson); localStorage.setItem('marc.theme', 'silent-black'); }, [JSON.stringify(legacy)]);
  const openNotes = async () => {
    await page.waitForSelector('.nav'); await launchGone(page);
    await page.getByRole('button', { name: 'Later' }).click({ timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(200);
    await page.locator('nav.nav button', { hasText: 'Escobar' }).click(); await page.waitForTimeout(300);
    await page.locator('[data-palace="coach.insights"]').evaluate(e => e.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(100);
  };
  const titles = () => page.locator('.insight h3').allTextContents();
  const firstBtn = (name) => page.locator('.insight').first().getByRole('button', { name, exact: true });
  const toastText = async () => (await page.locator('.toast span').first().textContent({ timeout: 1000 }).catch(() => '')) ?? '';
  const centre = async (loc) => { const b = await loc.boundingBox(); return b ? [b.x + b.width / 2, b.y + b.height / 2] : null; };
  await page.goto(`http://localhost:${PORT}/`);
  await openNotes();
  const t0 = await titles();
  if (t0.length !== 3) errors.push(`${tag}: expected 3 notes on the legacy fixture, got ${t0.length}`);
  // CFB-G1: Helpful hides the note at once, with the same toast as the chat path.
  await firstBtn('Helpful').tap(); await page.waitForTimeout(200);
  if ((await titles()).includes(t0[0])) errors.push(`${tag}: "${t0[0]}" still shown after Helpful`);
  if (!(await toastText()).includes('Marked helpful')) errors.push(`${tag}: expected the "Marked helpful" toast`);
  // CFB-G2: Undo on that toast brings it back.
  await page.locator('.toast').getByRole('button', { name: 'Undo', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Undo on the toast`));
  await page.waitForTimeout(200);
  if (JSON.stringify(await titles()) !== JSON.stringify(t0)) errors.push(`${tag}: Undo did not restore the notes, got: ${(await titles()).join(' | ')}`);
  // CFB-G3: Not now hides the note; a second tap 100 ms later, on the note that slid into its place, is ignored.
  await page.waitForTimeout(600);
  const p1 = await centre(firstBtn('Not now'));
  if (p1) await page.touchscreen.tap(p1[0], p1[1]);
  await page.waitForTimeout(100);
  const p2 = await centre(firstBtn('Not now'));
  if (p2) await page.touchscreen.tap(p2[0], p2[1]);
  await page.waitForTimeout(300);
  const t3 = await titles();
  if (t3.includes(t0[0])) errors.push(`${tag}: "${t0[0]}" still shown after Not now`);
  if (!t3.includes(t0[1])) errors.push(`${tag}: a quick second tap also hid "${t0[1]}"`);
  if (!(await toastText()).includes('Snoozed for 7 days')) errors.push(`${tag}: expected the "Snoozed for 7 days" toast`);
  // CFB-G4: saved data holds one record per (note, day) after Helpful, Undo, Not now on the same note.
  await page.waitForTimeout(400);
  const fb = await page.evaluate(() => JSON.parse(localStorage.getItem('marc.state.v1') || '{}').insightFeedback || []);
  const keys = fb.map(f => `${f.id}|${f.day}`);
  if (new Set(keys).size !== keys.length) errors.push(`${tag}: duplicate saved feedback records: ${JSON.stringify(fb)}`);
  // CFB-G5: the raw log is gone.
  if (await page.getByText('Earlier this month').count()) errors.push(`${tag}: the raw "Earlier this month" log is still shown`);
  // CFB-G6: one quiet row that opens to the hidden note's title.
  const row = page.locator('.notes-hidden');
  if (!(await visible(row.getByText('1 note hidden', { exact: true }), 1500))) errors.push(`${tag}: expected a "1 note hidden" row`);
  await row.getByRole('button', { name: 'Show', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Show on the hidden row`));
  await page.waitForTimeout(200);
  if (!(await visible(row.getByText(t0[0], { exact: true }), 1500))) errors.push(`${tag}: the hidden list does not name "${t0[0]}"`);
  await settle(page); await page.screenshot({ path: `${OUT}/silent-black-coach-fb-hidden.png` });
  // CFB-G7: after a reload the note is still hidden and still listed; Show again brings it back and the row goes.
  await page.reload();
  await openNotes();
  if ((await titles()).includes(t0[0])) errors.push(`${tag}: "${t0[0]}" came back after a reload`);
  await row.getByRole('button', { name: 'Show', exact: true }).tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no hidden row after a reload`));
  await page.waitForTimeout(200);
  await row.getByRole('button', { name: 'Show again', exact: true }).first().tap({ timeout: 1500 }).catch(() => errors.push(`${tag}: no Show again`));
  await page.waitForTimeout(200);
  if (!(await titles()).includes(t0[0])) errors.push(`${tag}: Show again did not bring back "${t0[0]}"`);
  if (await row.count()) errors.push(`${tag}: the hidden row is still shown with nothing hidden`);
  await ctx.close();
}
```

## 11. PR body must list

Head SHA; changed paths (the section 4 write_scope only); the evidence per ID in section 7, with the fail-on-base run noted; the full `npm run check`, `npm run test:tz` and `npm run gate` results on the head that contains the latest `main`; the real-phone list in section 6 as "needs owner"; R1, R2, R3 and R8 as open notes; and a statement that the saved shape is unchanged (`models.ts` and `store.ts` untouched).
