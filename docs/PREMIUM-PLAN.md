# M/ARC Premium: free vs paid, and Escobar Premium

Status: research recommendation, 2026-09-29 (workflow wf_4a08509c-7c2: 9 agents: inventory, Escobar deep-dive, market; 2 competing splits + Escobar design; 2 judges; synthesis). Awaiting owner decisions (section 8). Payment mechanics: docs/PAYMENTS-PLAN.md (PAY-1, PR #92).


I checked this on `origin/main` @ `9d02343` (2026-09-29). Nothing has changed there since the judges ran. This was research only. All AI costs are estimates for Opus 5.5 ($4 in / $20 out / $0.20 cache read per million tokens) and Sonnet 5.5 ($2 / $10 / $0.20). No cost has been measured yet.

## 1. The answer

Keep the whole training app free: logging, smart targets, recovery, readiness, lighter weeks, form guides, the weekly review, full history and export. It costs nothing to run. It is also why the app already feels premium, and it is what people show their gym mates.

Sell one tier, **M/ARC Premium**, with two big layers:
- **Escobar at full strength.** He designs or imports your programme, rebuilds today's session, turns any coach note into a one-tap fix, and remembers what worked.
- **Deeper app features that cost nothing to run.** A 7-day recovery forecast, a full plan check, "Short on time", "What M/ARC has learned about you", heart-rate rest and three extra themes.

Free users keep every warning and safety card, and get a one-time taste of Escobar.

Price: **A$14.99 a month or A$99.99 a year; ₱299 or ₱2,490 in the Philippines**, with 7-day trial codes. Every code carries a monthly AI budget, so no payer can cost more in AI than they pay.

## 2. Every current and in-flight feature

IF = in flight, P = planned.

| Feature | Tier | Why |
|---|---|---|
| Splits, templates, focus muscles; any number of routines, gyms and equipment profiles | FREE | Caps are the upsell users resent, and a gym cap would make targets wrong |
| Live logging (all set types, notes, skip/swap/remove, survives a restart), past sessions, check-in, time-based rest timer | FREE | The daily loop |
| Effort buttons, per-set targets and "Why this target", loads your gym can make (LT-1/2/4), ADAPT-3; LT-3 and LT-6 (IF) | FREE | One brain: free and paid users never see different numbers |
| Warm-up ramp, plate math, live "add load / step down", record badges, unlikely-set and kg/lb checks | FREE | Safety on the gym floor and clean data |
| Substitutes while a muscle recovers | FREE | The safe way out. The carried-over starting load only arrives with LT-6: `carryOverStart` has no caller on main (`substitute.ts:32`) |
| Rest that ends by heart rate | **PAID** | A convenience. It falls back to the timer, and the timer stays the minimum for main lifts (`Train.tsx:1250,1264-1266`). Rare in lifting apps |
| Rest learned from your own logs (ADAPT-6, P) | **PAID** | A convenience. The research minimum rests stay for everyone |
| Finish screen with the heart summary; share cards | FREE | The user's own session; every card advertises M/ARC |
| Form guides (2 live, 15 IF, 138 P) | FREE | Technique is a safety matter, and the guides are the showcase |
| Progression rules, readiness and recovery holds, red-day set cut, lighter week | FREE | Safety |
| Recovery map, ready times, self-calibration; readiness score, drivers and baselines; not-recovered warnings | FREE | These decide whether the weight goes up |
| Levels, weekly sets against range, body fat; ADAPT-5 (IF), ADAPT-7 (P) | FREE | Engagement, and correctness fixes can't be paid extras |
| Calendar, edit/delete, charts, records, streak, effort-bias tip, logging checks | FREE, full history | Locked history is the top complaint in the market |
| Per-lift chart | FREE; add an all-time range | It shows only the last 12 sessions today (`History.tsx:464`) |
| All coach notes (including the plateau "likely cause" note), cues, daily spark, "How the coach thinks", onboarding, the offline coach's daily brief | FREE | This is the free coach, already titled "Escobar" (`Coach.tsx:46,58`) |
| Weekly review, every item | FREE | Fatigue tips stay visible. Premium adds "Plan next week" |
| Heart-rate watch, live pill, Health Connect, calories; GT6 companion (IF) | FREE | They feed readiness. `native/wear/**` belongs to the watch agent |
| Backup, restore, CSV, daily safety copy, rescue file, import, reminders, units, haptics, error reports | FREE, always | The user owns their data |
| Themes | FREE WITH LIMIT | Silent Black and Paper are free. Ember, Emerald and Midnight are Premium; they recolour share cards and revert when Premium ends |
| Escobar chat: all read tools, charts, calculator, evidence cards, number checking, change proposals, memory, photos, the Ask buttons | FREE WITH LIMIT | 5 starter answers once, then Premium. It is the only feature that costs money per use |
| Programme designer (plan mode) | **PAID** | The most expensive mode and the most valuable thing the AI does |
| Memory screen, sharing switches, tone, usage readout, own-server URL | FREE, always | Privacy; your own server means your own bill |
| Safety cards: crisis, medical, pain, disordered eating | FREE, never counted | Only crisis and medical fire on the phone today (`loop.ts:437`). PREM-2 fixes this first |
| "Where is…" help | FREE | Today it is answered on the phone only when offline (`loop.ts:439`) |
| AI daily brief, moments, automatic summaries (the Worker modes exist; nothing calls them) | NOT AT LAUNCH | They pay every day for text the phone already writes, and they send data without a tap, which the privacy policy doesn't cover (`PRIVACY-POLICY.md:22`) |

## 3. M/ARC Premium: what a payer gets

This is copy for the website. The payments agent confirms what Google Play allows on the store listing.

**M/ARC Premium: your coach at full strength**
- **Escobar, unlocked.** Ask anything about your training. Every number he quotes is checked against your own data, and anything he can't back up is flagged.
- **A programme built for you, or bring your own.** It is designed around your goal, days, gym and recovery, checked against your own volume ranges, and applied in one tap. Snap your coach's sheet and it becomes your plan.
- **Fix it.** A stalled lift, low volume, too many max-effort sets: one tap turns the coach's note into a change.
- **Rebuild today.** Hotel gym, 40 minutes, no free bench, a movement to avoid: today's session, rebuilt.
- **Short on time?** Pick 30, 45 or 60 minutes. Your main lifts stay.
- **Your next 7 days of recovery**, shown against your planned week.
- **Full plan check**, muscle by muscle, with a fix for each problem.
- **What M/ARC has learned about you:** how fast each muscle recovers, your normal sleep and heart rate, and how you rate effort.
- **Rest that ends when your heart is ready** (Android, any Bluetooth heart-rate watch).
- **A coach notebook** that remembers what worked.
- **Three extra themes**, in the app and on your share cards.
- *Coming next:* training blocks with a planned lighter week, a monthly report, long-range trends.
- *Always free:* logging, smart targets, recovery, readiness, form guides, the weekly review, full history and export.

## 4. Escobar

**Free (the taste):**
- the offline coach;
- every safety card;
- "where is…" help;
- memory controls;
- a one-time **starter of 5 answers** (photos allowed) in the first 14 days after turning Escobar on.

Fix it and the programme designer are Premium from day one. Once the starter is used, the Ask buttons open a Premium preview instead, which costs no AI.

Why a one-time taste and not a monthly allowance:
- 3 free answers a month would add about $2.40 per payer every month (the judge's estimate).
- The app may not link to a shop (`PAYMENTS-PLAN.md:242`), so a taste inside the app, with no friction, has to do the selling.

**Premium, ranked by value for the cost.** AI cost is for a heavy user, per month, before the budget cap. All figures are estimates.

| # | Feature | What the user gets | Build | Heavy use | AI $/month |
|---|---|---|---|---|---|
| 1 | Programme designer + "Bring my programme" | A week designed for you, or a sheet, photo or text turned into your plan; checked by `evaluatePlan`; applied in one tap | S | 2 designs + 4 tweaks | 1.65–2.55 |
| 2 | Rebuild today | Today's session rebuilt around time, equipment or a movement to avoid; the red-flag card comes first; today only | S (after LT-6) | 6 | 0.65–1.00 |
| 3 | Fix it | A button on coach notes, Today's top note and the weekly review ("Plan next week") that returns one change card | S | 8 | 0.80–2.50 |
| 4 | Coach notebook | Tap "Save to notebook", confirm each fact, and Escobar keeps it for months | S–M | 20 | 1.00–1.80 |
| – | Premium chat | All tools, photos, Ask buttons, questions mid-session | – | 60 answers | 5.60–7.80 (the budget caps it) |
| Later 5 | Block Builder, compact (base programme plus dated weeks) | A 4–12-week plan with a planned lighter week and "Week 3 of 8" on Today | L | 1 block + 4 tweaks | 1.20–1.95 |
| Later 6 | Block report, on tap | A verdict at the end of a block, and the next plan | M | 1 | 0.25–0.31 |
| Later 7 | New read tools `diagnose_lift` and `get_form_guide` | Answers about stalls and form in fewer steps | S–M | – | lowers cost |
| Later 8 | Think deeper | One deeper answer on a hard question, without breaking the cache (per-message effort beta, which Opus 5.5 supports) | S | 10 | 0.50–1.50 |

Dropped for now:
- AI briefs and nudges ($1.00–2.20 a month); revisit only if people tap Fix it often enough to show demand;
- multi-week pain plans;
- photo checks of machine setup;
- meal photos;
- overnight batch reports;
- web search.

**Making Escobar smarter for everyone:**
- Make Opus 5.5 the default model.
- Build the eval suite before claiming he is smarter.
- Add a rep range to each exercise. Today neither the user nor Escobar can change one (`progression.ts:79-81`, `models.ts:181-184`). With it, stall fixes, imports and blocks can be followed exactly.
- Add the new read tools.
- Add `periodization` and `return_to_training` knowledge cards, with sources.

## 5. Price

| | Australia | Philippines | US$ reference |
|---|---|---|---|
| 30-day code | **A$14.99** | **₱299** | $9.99 |
| 365-day code (lead with this) | **A$99.99** (A$8.33 a month, saves 44%) | **₱2,490** (₱208 a month, saves 31%) | $69.99 |
| AI budget per 30 days | $4 (about 27–38 answers) | $2 (about 12–16) | $4 |
| Trial | 7-day code with a $2 AI budget (a design plus about 5 answers) | same | same |

Why these prices:
- **Competitor prices, checked on the App Store today:** Alpha Progression A$19.99 a month, A$119.99 a year and ₱4,490 a year; Hevy Pro ₱155–219 a month and ₱1,250 a year. Fitbod's own site lists $15.99 a month and $95.99 a year.
  - A$14.99 is 25% below Alpha's monthly price.
  - A$99.99 is 17% below Alpha's yearly price.
  - ₱2,490 is 45% below Alpha's yearly price, and per month it costs about what Hevy's workout logger costs.
- **₱299 rather than ₱249:** the AI is paid for in US dollars. Launching at a price you can keep is better than raising it later.
- **Lead with the yearly code:** codes don't renew by themselves (`PAYMENTS-PLAN.md:306`).
- **7-day trial:** fitness monthly plans convert best with trials of 5–9 days (RevenueCat).
- **No lifetime or weekly plan:** the AI cost repeats every month.

## 6. Unit economics

This covers AI costs only, before the payment provider's fee. That fee is not verified, but there is no Google fee on the code path (`PAYMENTS-PLAN.md:521`). Rates used: 1 USD = A$1.4237 = ₱62.488 (ECB, 2026-09-28).

| Per 30 days, in US$ | AU monthly | AU yearly | PH monthly | PH yearly |
|---|---|---|---|---|
| Price | 10.53 | 5.77 | 4.78 | 3.28 |
| Kept if the whole AI budget is used | 6.53 (62%) | 1.77 (31%) | 2.78 (58%) | 1.28 (39%) |
| Kept for a light user (about $1.50 of AI) | 9.03 | 4.27 | 3.28 | 1.78 |

A light user costs about $1.30–1.70 a month. An everyday user (30 answers plus each Premium flow) would cost about $5–6 without a cap, so they would use up the $4 budget after about 3 weeks.

**Safeguards:**
1. **A budget on each code** (PAY-1's `USD_PERIOD`), sized per country.
2. **Fix the daily budget (`USD_DAY`) before launch.**
   - PAY-1 sets aside each step's worst-case price before running it: the output limit at the output price, plus the input (`PAYMENTS-PLAN.md:214`).
   - A plan step has a 32k output limit (`anthropic.ts:45`), so it sets aside at least $0.64 on Opus 5.5. That is more than the $0.60 daily budget (`:524`).
   - So the programme designer could never start, and chat would stop after about 1–3 answers a day.
   - Set the daily budget to about $2.50, and count the starter in answers, not dollars.
3. **Separate money pools.** Payers draw from `PAID_USD_DAY` (`:286`). The starter gets its own daily cap, so free users can never lock payers out.
4. **Opus 5.5 as the default:** one chat exchange drops from about $0.136 to $0.093.
5. **Caching.** Caches are kept separately for each workspace and each model.
   - Keep one workspace.
   - Run each Premium flow in its own conversation, on one model.
   - Give the one-shot modes the shared 1-hour cache, and stop them writing a 5-minute cache that is never read (`anthropic.ts:137,141`).
6. **Measure, then tune.** Run 2 weeks of `PAYWALL=log` together with the Worker's per-step logs (`handler.ts:180`). If more than 1 payer in 10 uses up the budget, or AI averages more than 40% of the price, move chat to Sonnet 5.5 before changing prices. Only do that if the eval passes; it gives about 1.7× the answers per dollar.

## 7. Build cards

PAY-1 already provides the payment plumbing:
- **PAY-W1:** codes, the per-install record `EntitleDO`, a budget on each code, and the `PAYWALL=off|log|on` switch. If the check fails, it blocks.
- **PAY-A1:** code entry in the app, and `src/escobar/entitlement.ts`.
- **PAY-D1:** the privacy text.

Worker cards are separate PRs that you merge. Turn on `PAYWALL=on` only after PREM-2 and PREM-5 have merged.

| id | outcome | size | depends_on |
|---|---|---|---|
| PREM-1 | Set `MODEL = claude-opus-5-5`, then measure the cost of an answer in each mode for 2 weeks | S | owner merge |
| PREM-2 | Pain and eating cards fire on the phone before any network, budget or entitlement check; free users online get "where is…" answers from the phone | S | – |
| PREM-3 | Escobar eval suite: a design revised after a blocking issue, photo import, a time-limited rebuild, Fix it for each kind of note, pain escalation, zero unchecked numbers | M | – |
| PREM-4 | Premium Worker PR: starter (5 answers, 14 days, no plan mode, its own pool cap); a daily budget that fits a design; Sonnet 5.5 allowed and priced in `state.ts`; the one-shot caching fixes | M | PAY-W1, PREM-1 |
| PREM-5 | `isPremium` on the phone, built from PAY-A1, with a saved "active until" date and a 3-day offline grace. Checks live only in screens and Escobar's interface, never `brain/`; a guard test on what `brain/` imports; each check tested to prove free users still see the warnings | S | PAY-A1 |
| PREM-6 | Upgrade moments: previews using the user's own numbers, plus PAY-1's "Enter a code" line. Never during a live session, at most one a day, "Not now" hides it for 7 days, always lists what stays free. The "baselines ready" moment also fires after 8 logged sessions, because calibration can take about 5 weeks (`readiness.ts:298`) | S–M | PREM-5 |
| PREM-7 | Heart-rate rest and the 3 themes move to Premium, with fallbacks; the Watch-lab row is left alone | S | PREM-5 |
| PREM-8 | Plan check in the split editor: the list of issues is free; the full breakdown and "Fix with Escobar" are Premium | S | ADAPT-5, PREM-5 |
| PREM-9 | "What M/ARC has learned about you" | S | PREM-5 |
| PREM-10 | Recovery forecast: 7 days against the planned week, shown as ranges, with an offer to swap or go lighter | M | PREM-5 |
| PREM-11 | Short on time: trims today's session to 30/45/60 minutes through today's changes (`models.ts:415-428`) | S–M | PREM-5 |
| PREM-12 | Programme designer and "Bring my programme"; Escobar says when a rep scheme was simplified | S | PREM-3, PREM-4 |
| PREM-13 | Fix it | S | PREM-3, PREM-4 |
| PREM-14 | Rebuild today, with quick choices for time, equipment and movements to avoid | S | LT-6, PREM-3, PREM-4 |
| PREM-15 | Coach notebook: tap to save, Sonnet 5.5 summarises, the user confirms. Never saves after a safety signal | S–M | PREM-4 |
| PREM-16 | Free: an offline "avoid this movement today" swap, and an all-time range on the lift chart | S | LT-6 |

Later cards:
- **PREM-17:** monthly report, recalculated each time it opens and shareable (M).
- **PREM-18:** a rep range for each exercise (M; needs your approval of the saved data).
- **PREM-19:** Block Builder (L; needs PREM-18, a design doc and your approval of the saved data).
- **PREM-20:** the new read tools (S–M; after the 15 Version 1 form guides land).
- **PREM-21:** trends and heart trends (M; after the readiness history is made fast enough).
- **PREM-22:** Think deeper (S).

## 8. Owner decisions and risks

**Only you can decide:**
1. **Reopen PAY-1's "everything else stays free"** (`PAYMENTS-PLAN.md:7`). This moves heart-rate rest and the 3 themes into Premium and adds the new Premium features. Decide before the first public release (the store upload still waits for your phone test, `RELEASE-READINESS.md:68`), so nothing is ever taken away from existing users.
2. **The 5-answer starter.** It changes PAY-1's "no automatic trial" (`:310`). It also needs privacy text, because the Worker would keep a record for each install for longer than today's 3 days (`PRIVACY-POLICY.md:33`).
3. **Prices, budgets and the daily budget** (sections 5 and 6).
4. **Merge PREM-1 now**, and the Premium Worker PR later.
5. **Saved data.** Now: the phone's "active until" date (PAY-1 currently saves nothing on the phone, `:269`). Later: a rep range for each exercise and a compact block record.
6. **Keep AI briefs and nudges off.** `proactive.enabled` defaults to on (`models.ts:476`); switch that default off before any proactive feature ships.

| Risk | How to reduce it |
|---|---|
| AI costs are estimates | PREM-1 measurement, a budget on each code, the switch to Sonnet if needed |
| A paywall bug hides a warning | Checks only in the interface, a test per check, the `brain/` guard test |
| People reset the starter with new device ids (there is no login) | Only 5 answers, the starter's own pool cap, the per-IP limits |
| Premium feels thin at launch | Ship the 4 Escobar features and the 5 zero-cost features together; announce blocks as coming next |
| No signal in the gym | The saved "active until" date plus the grace period |
| Phone-side locks can be bypassed (public repo, web version) | Accept it: those features cost nothing, and Escobar is enforced on the Worker |
| Australians buy the cheaper Philippine codes | The AI loss is capped by the smaller budget; country checks are the payments agent's call |
| Pain help reads as medical advice | Today only, the red-flag card first, fixed app-written text |

## Open questions
- The cost per answer, the size of the fixed prompt and the Cloudflare costs have not been measured.
- The payment provider's fee is unknown.
- How many free users turn Escobar on, and how many then pay, is unknown. If 1 in 10 pays, the starter costs about $5–6.50 per payer, once (an assumption).
- Competitor prices come from the App Store. Google Play prices were not checked.
- Whether the Play listing may describe Premium, and how the starter fits PAY-1, is for the payments agent to confirm.
- Whether Sonnet 5.5 is good enough for chat needs the eval.
- Whether 90 days of readiness history runs fast enough on cheap phones is untested. This blocks Trends.
- The per-IP limits have not been checked for Philippine mobile networks, where many users can share one IP address.
- Whether a professional should review the pain wording is unknown.