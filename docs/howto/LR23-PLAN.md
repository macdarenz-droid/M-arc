CHANGE PLAN: owner decision LR-23 (2026-09-30), no contacts and no sources in the app UI

Heads I read: main 07c9892, howto-options 1f15570 (golden-b has not changed since a7a0b74, and the page is still f39137e1), libht-research 21868f6 (LR-23 is already at RULINGS.md:29), ht-3 e2d7868, ht-4 8bf6b44, ht-5 1d9ccc6, ht-6 e33fbd2, ht-7 1ce9b4b, ht-8 93a62ac, ht-9 311e9d4, doc-2 3d6d279. I re-checked every Play quote below word for word in the downloaded policy pages (scratchpad/pp). The privacy URL returns HTTP 200 today.

The rule in one line: the app shows no phone number, helpline, hotline, support website, emergency-service instruction, contact email, source list, source link, citation chip or evidence label. Sources and evidence tags stay in data and research files. The only things added or kept for Play are listed in section 2.

Shared ban patterns. There is one definition, in the new file `tests/guards/no-contacts.ts`, created by ESC-NC on main. Golden-B `copy-lint.mjs` holds a byte-identical copy, and an HT-4 parity test pins the two together:
- `CONTACT_RE = /(?<![\d.,])(?:999|111|911|112|000|988)(?![\d.,]*\d)|\b116 ?123\b|\+\d[\d ().-]{6,}\d|\b\d{3,5}[ .-]\d{3}[ .-]\d{3,4}\b|emergenc|ambulance|\bA&E\b|urgent (?:care|treatment)|hotline|helpline|crisis (?:line|text)|samaritans|\btel:|mailto:|[\w.+-]+@[\w-]+\.[a-z]{2,}|https?:\/\/|\bwww\./i`
- `SOURCE_RE = /\bsources?\b|\bcitations?\b|\bcited\b|\bet al\b|\bstud(?:y|ies)\b|\bmeta-analys[ie]s\b|\bpubmed\b|\bdoi\b|\bNHS\b|\bACSM\b|\bCoaching consensus\b|\bWeak for this use\b|\([A-Za-z][^()]* (?:19|20)\d{2}[a-z]?\)/i`
- `SAFETY_LINE_RE = /\b(?:call|phone|dial|ring|GP|clinic|hospital)\b/i`. This one applies only to red-flag boxes and the coach safety cards.

If a pattern hits real copy by mistake, reword the copy. Never add an exemption without the supervisor.

## 1. REMOVE from the UI

**A. Shipped coach on main. New card ESC-NC (one builder, small, base main).**
1. `src/escobar/ui/Escalation.tsx:13` (medical). New text: `'Chest pain, fainting, or dizziness during exercise needs medical attention now. Stop the session and get it checked straight away.'`
2. `Escalation.tsx:14` (crisis). New text: `'If things feel like too much, you don’t have to carry it alone. Talk to someone you trust, or to a doctor.'`
3. `Escalation.tsx:15` (disordered_eating). New text: `'This is worth talking through with someone who can help properly, like a doctor.'`
4. `Escalation.tsx:29` (`const helpline`) and `:34` (the `<a href="https://findahelpline.com">Open findahelpline.com</a>` button): delete both.
5. Citation chips:
   - `Message.tsx:80`: delete the CardCitation branch. The existing `:81 if (p.startsWith('⟦')) return null` already drops the marker.
   - `Message.tsx:85-86`: delete the `facts` line and the `Citation` push, plus the `cites` counter and the `:15` import.
   - Delete `src/escobar/ui/Citation.tsx`.
   - Delete `styles.css:584-587` and `:659` (the `.esc-cite*` rules) in one block marked ESC-NC. Grep `.esc-pop` first and delete it only if Citation is its sole user.
   - The ⟦f⟧ and ⟦k:⟧ markers stay in the model grammar. The number check (verify.ts) and "Unverified number" stay unchanged.
6. `src/escobar/knowledge/cards.ts:37-41` (`lookupKnowledge`): drop `sources` from the output. The type becomes `Omit<KnowledgeCard,'tags'|'sources'>`. This takes source titles out of what the model gets and out of the "Data sent to Escobar" drawer. `knowledge.json` keeps every source.
7. `src/data/knowledge.json`, card `progressive_overload`: change "ACSM suggests a 2–10% load increase…" to "A common guideline is a 2–10% load increase once you beat the target reps by 1–2." Keep "In a meta-analysis", "in a lab study" and "in one study". They name no source; they tell the model how sure a finding is, and cutting them would overstate certainty.
8. Gate EV5 block (`scripts/screenshot-gate.mjs:1968`, `:1984-1986`). Replace the presence checks with absence checks:
   - 0 `.esc-answer .esc-cite`, 0 `.esc-pop`;
   - no "⟦" in the answer text;
   - 0 `a[href^="http"]` inside the open Escobar sheet.
   - Drop `-escobar-citation.png`. Keep a citation marker in the mock conversation so the check bites.
   - This is a stricter spec change ordered by the owner, not a loosening. The PR says so, and the supervisor approves the edit to the EV5 block.
9. Docs:
   - `docs/ESCOBAR-ARCHITECTURE.md:180` (drop Citation.tsx);
   - `:630-631`: markers are stripped from display and used only by the number check;
   - `:731-733`: the new copy;
   - the rule-9 and rule-11 prompt mirror near `:656`, if the policy text is copied there;
   - `docs/qa/areas.json` Citation entries (`:2622`, `:3022-3025`, `:3497`, `:3526-3528`, `:3701`).
10. New test `tests/escobar/no-contacts.test.ts`. It fails today and must pass after:
    - (a) every `ESCALATION_COPY` value passes CONTACT_RE, SOURCE_RE and SAFETY_LINE_RE;
    - (b) the `Escalation.tsx` source has no `<a ` and no `href=`;
    - (c) `AnswerText({text:'You lifted 100 kg ⟦f1⟧. Protein helps ⟦k:protein_intake⟧.', ledger:[f1]})`, called as a plain function (the project runs tests without jsdom), returns a vnode tree with no `esc-cite` class, no Citation or CardCitation, and no "⟦";
    - (d) `lookupKnowledge` output has no `sources` key;
    - (e) no knowledge statement matches `/\b(?:ACSM|NSCA|ISSN|WHO|et al)\b|\([A-Za-z][^()]* (?:19|20)\d{2}\)/`.
    - Mutations: restore each old copy line, restore the `<a>`, re-add CardCitation, re-add `sources` to the output, restore "ACSM suggests". Each must turn the test red.

**B. Coach prompt. Separate escobar-worker PR, card ESC-NC-W; the owner merges it, which deploys it.**
11. `escobar-worker/src/prompt/policy.ts:23`. Replace "The app adds the support resources itself; don't recite hotline numbers." with "The app shows its own short safety card. Never give phone numbers, hotlines, helplines, websites or emergency-service instructions; point them to stopping and getting it checked, or to talking with someone they trust or a doctor."
12. `policy.ts:27` (rule 11). Replace "No headings, tables, code, emojis or links." with "No headings, tables, code, emojis, links or phone numbers. Don't name studies, authors or organisations, and don't quote evidence ratings; say how sure the evidence is in plain words."
13. New `escobar-worker/test/policy.test.ts`: `WORKER_POLICY` contains both new sentences and does not contain "adds the support resources". Mutation: revert either line.

**C. How-to (not shipped yet).** The details are in sections 7 and 8.
14. The Sources section: 8 per page, 136 outside links, 137 badges, and the key text. Golden-B `howto-layers.mjs:250-265`; on HT-9, `sections/Sources.tsx`.
15. `SHOW_EVIDENCE`: golden-B `shared.mjs:52-53`; HT-5 `archetypes.ts:59` and `tools/plates/gen/content.mjs:137`.
16. Mockup page chrome in `build-page.mjs`:
    - `:24-60` (`WINTER`, `SOURCES`) and `:190` (`sourcesList`), after a grep confirms `sourcesList` is their only user;
    - `:657` "…and follow the setup steps with their sources." becomes "…and follow the setup steps.";
    - `:671`: drop "(Winter 2009 body proportions); sources per exercise below";
    - `:673-676`: the `<details id="sources">` block.
    - Keep `:672` (the body-muscles licence credit), because it is a licence notice, not a research source.
17. The library's planned back-box "Get emergency help now." / "Call 999" line, and the library card lines listed in section 9.

**Not removed, and why:**
- The red-flag boxes and the 19 "When to get it checked" buttons. They hold no contact, and they are the owner's own "stop and get it checked" wording (LR-23).
- The disclaimer (see section 3).
- The coach "pain" card ("see a physio or doctor") and its "Remember this injury" button.
- The "What Escobar looked at" drawer and its label "Checked the evidence". That is a status, not a source, and renaming it would touch the worker's `tools.generated.json`.
- `rating` in the model payload. It is how the model knows how sure a card is. The drawer shows the data exactly as sent, so hiding fields there would make it untrue.
- Daily Spark author names. They are part of the quote; dropping them would present other people's words as the app's own.
- Licence notices.
- All internal source data: `substitutionRatios.ts`, `knowledge.json` sources, SOURCES / EVIDENCE_LABELS / claims, `docs/research/**`.

## 2. KEEP or ADD because Google Play requires it (in-app, minimal form)

**P1. A privacy policy link inside the app.**
- Policy: "All apps must post a privacy policy link in the designated field within Play Console, and a privacy policy link or text within the app itself." (https://support.google.com/googleplay/android-developer/answer/10144311; the same wording is in answer/16679511)
- Minimal form: one "Privacy policy" link in Settings, section "Your data" (`Settings.tsx:216-240`, not the Watch-lab row). It opens https://macdarenz-droid.github.io/M-arc/privacy/ in the system browser, using the same URL as the Play Console field (`PLAY-SUBMISSION.md:12`).
- This is not a contact. The privacy contact Play requires ("Developer information and a privacy point of contact or a mechanism to submit inquiries") lives on that web page.
- Card PLAY-1 (new). Main has no such link today.

**P2. The Health Connect privacy screen.**
- Policy: "Your Android manifest needs to have an Activity that displays your app's privacy policy" and "The activity must display the same privacy policy you provide for your app in the Google Play Console." (https://developer.android.com/health-and-fitness/guides/health-connect/develop/get-started)
- Minimal form: in `native/PermissionsRationaleActivity.java:31`, append "Privacy policy: <same URL>" and make it a link (Linkify, web URLs). `LinkMovementMethod` is already set at `:33`.
- Card PLAY-1, with a real-phone check.

**P3. A reminder to consult a healthcare professional.**
- Policy: "Apps must also remind users to consult a healthcare professional for medical advice, diagnosis, or treatment." (https://support.google.com/googleplay/android-developer/answer/16679511). M/ARC is in scope: "If your app is not primarily a health app, but has health-related features and accesses health data, it is still in scope of the Health App policy."
- Minimal form: one line in Settings above the version (`Settings.tsx:241`): "Not medical advice. For medical advice, diagnosis or treatment, see a healthcare professional." No number, no link. Card PLAY-1.
- Listing only: the line "M/ARC is not a medical device and does not diagnose, treat, cure, or prevent any medical condition." goes into the store description in `PLAY-SUBMISSION.md` (doc-2), never into the app. Policy: "Other health and medical apps must include a clear disclaimer in their app description indicating that the app is 'not a medical device and does not diagnose, treat, cure, or prevent any medical condition.'"

**P4. A way to report bad AI replies inside the app.**
- Policy: "Apps that generate content using AI must contain in-app user reporting or flagging features that allow users to report or flag offensive content to developers without needing to exit the app." (https://support.google.com/googleplay/android-developer/answer/13985936)
- Minimal form: a "Report" text button under each coach answer, next to "What Escobar looked at". The user picks one reason (Offensive / Harmful / Wrong), and the app sends only the flagged reply text, the reason and the app version to a new Worker endpoint, kept 90 days like error reports. No email or phone is shown, so it is not a contact.
- Card ESC-REPORT is **blocked on the owner's approval**, because it sends a new kind of user data. It also needs an escobar-worker PR (the owner merges it) and updates to the privacy policy and the Data safety form. Main has nothing like this today.

**P5. Keep unchanged:** the coach first-enable sheet and the "Share health data" switch. Policy: "User data may only be transferred to third parties with explicit user consent" (answer/17190352, Limited Use), and the ban on "Sharing health data with third parties without explicit, informed user consent" (answer/12991134).

**Store listing and website only, never in the app:**
- the contact email ("To publish on Google Play, you must provide an email address where users can reach you.", answer/113477), which goes in the Play Console;
- the privacy contact, on the website policy (`website/policy.mjs`, doc-3);
- the "not a medical device" description line.

Not required by Play, so not added: emergency numbers, helplines, emergency instructions, in-app contact details, sources, citations and evidence labels. I searched all 52 policy pages: helpline, crisis and emergency appear only in bans.

## 3. The owner-approved disclaimer

- Keep it word for word: "General guidance, not medical advice. If something hurts, stop and get it checked."
- It has no number, link, service or source, so the decision does not touch it. It is the owner's own line and is already pinned (`copy-lint.mjs:291`, HT5-A5, HT9-A3).
- Only its position changes. It used to be emitted with the Sources block (`howto-layers.mjs:264`). Now it is the node right after "Risks and when to stop", still exactly once per sheet.
- It does not name a healthcare professional, so on its own it does not meet Play's reminder. P3 covers that for the whole app, and each sheet's red-flag box already says "See a doctor".
- Do not reword it to fit Play. Only the owner changes this line.

## 4. Evidence labels: they go

Decision: remove every evidence label from the UI. On the How-to that means the Measured / Mechanics / Coaching consensus / Weak for this use badges, the key paragraph and `SHOW_EVIDENCE`. On the coach it means the "ev" chip and its "Evidence: <rating> · <title> (<year>)" line.

Reason: a label only describes a source. It sits on each source row, and its key explains sources. With the Sources list gone it has nothing to attach to, and the owner's reason ("Source just populates the info around ui and no users ever click on it") applies to it just as much. The reason for turning it on ("no paid expert review, so labels are shown") no longer holds. Nothing is lost in accuracy: the tags stay in the data, `copy-lint.mjs:278` (every source has a label) stays as a data rule, C8 stays, and the coach model still receives `rating`.

## 5. Red-flag boxes: new wording rules (they supersede LR-11's urgent line)

- **R1.** Three lines: `name` = "<Joint> pain"; `now` = "<triggers>? Get it checked today."; `doctor` = "<triggers>? See a doctor." The existing lint `/today/` (copy-lint `:299`) and `/doctor/` (`:300`) stay as they are.
- **R2.** No line may match CONTACT_RE, SOURCE_RE or SAFETY_LINE_RE. That rules out numbers (999, 111, 911, 112, 000, 988), phone formats, "emergency", "A&E", "ambulance", "urgent care", hotline/helpline, call/phone/dial, GP, clinic, hospital, URLs and emails.
- **R3.** At most 30 words per box (unchanged). Every NHS trigger stays (`RED_FLAG_BLOCKS`, unchanged).
- **R4.** The NHS source stays in `claim.sources` as data (`:301`, unchanged). It is never shown.
- **R5.** One shared block per joint. Rows link to it with `redFlag: '<joint>'` and never carry their own referral wording (C8, unchanged).
- **R6.** Back box (library):
  - name "Back pain";
  - now: "Numb or weak in both legs, numb around your genitals, or bladder changes? Get it checked today.";
  - doctor: "No better in a few weeks? See a doctor.";
  - the final triggers come from LR-11's full NHS read and the critic;
  - no lint exception, because `/today/` already fits.
- **R7.** Add RULINGS LR-27 (add-only), recording R1-R6 and the library line fixes in section 9. LR-23 already supersedes LR-11's "Get emergency help now". LR-11's fetch and critic steps stand.
- Risk: the NHS page says the back signs need emergency help at once, and "today" is the closest the owner's pattern allows. Every trigger stays in the box, and the owner sees the wording on pilot A.

## 6. The AI coach's crisis handling

**What exists (main):**
- Cards appear in two ways:
  - when the model calls `escalate` (`schema.ts:172`, `Message.tsx:218`);
  - when the app's own word check finds crisis or medical words (`verify.ts:147-165`, then `loop.ts:436-437`, `session.ts:210`, `EscobarSheet.tsx:130`).
  - The EATING word check only sends the model a signal (`brief.ts:133`).
- The cards show contacts today:
  - medical: "call emergency services";
  - crisis and disordered eating: findahelpline.com in the text, plus an "Open findahelpline.com" button, which is the only outside link in the shipped app.
- The prompt already forbids hotline numbers (`policy.ts:23`) and links (`:27`).

**What the decision changes:** items 1-4, 11 and 12. The following all stay:
- both triggers;
- the cards themselves;
- the warm, present response;
- no deficit targets;
- "Remember this injury".

**Risks, stated plainly:**
1. User safety (real). Someone in crisis loses a one-tap route to a helpline directory. Someone with chest pain no longer reads "call emergency services".
   - Mitigation: the cards still appear through both routes, and the new copy still says "needs medical attention now… straight away" and "talk to someone you trust, or to a doctor".
   - What remains is the owner's call, and he has made it. Tell him in one line. Undoing it later is one constant plus an exemption in the guard, which he would have to approve.
2. Play: no risk found. No Play page requires crisis resources. The AI help page counts "Content generated to encourage harmful behavior (for example, dangerous activities, self harm)" as a violation (answer/14094294); `escalate` and the prompt still handle that. The AI rule that does apply is P4.
3. Law outside Play (not verified). California SB 243 requires "companion chatbot" operators to refer users to crisis services. Whether a fitness coach counts is a legal question only the owner can settle. It does not block Play.
4. The model's own text is not filtered. The control is the prompt rule (items 11-12). Checking it needs live calls on the owner's AI key, so it goes on the owner's device-check list: send "I don't want to be here anymore" and "chest pain during my set", then confirm the card appears with no number, link or emergency line.

## 7. The golden-B update (supervisor, on `claude/howto-options`, one docs-only commit)

Commit title: "Golden B: owner decision LR-23, no sources, evidence labels or contacts in the UI (docs only)". A fresh reviewer signs it off.

**`howto/shared.mjs`**
- Delete `:52-53` (`SHOW_EVIDENCE`).
- In the `:48-49` comment, change "under the sources" to "last, right after Risks and when to stop".

**`artifact/howto-layers.mjs`**
- `:13`: drop `SHOW_EVIDENCE` from the import.
- `:250-265`: delete `TAG_WORD`, `tagBadges` and `sourcesSection`. Add `` const disclaimerNode = pre => `<p class="ht-disclaimer" id="${pre}-disclaimer">${esc(DISCLAIMER)}</p>`; ``.
- `:329-331`: the comment becomes "risks, then the disclaimer (once, last)", and the join becomes `risksSection(pre, howto), disclaimerNode(pre)`. Drop the `M` argument if it has no other user.
- `:2`: fix the header comment.
- Keep `:226` (the rf-link) and `:290` (the red-flag source cross-check).

**`artifact/build-page.mjs`**
- Delete `:324-338` (the `.srcs`, `.src-*` and `.ev*` rules).
- `:340`: remove `.srcs > summary svg` from the reduced-motion rule.
- `:284`: the comment becomes "last, after the risks".
- `:113` and `:240`: drop "sources" from the comments.
- Page chrome: item 16.

**`artifact/copy-lint.mjs`**
- `:20` and `:166-167` comments: Sources are not shown (LR-23); the notes are linted as research notes.
- `:210-215`: add both `sourceNote` fields with `shown=false`. `SOURCE_NOTE_MAX_WORDS` stays, so the C7 parity test is unchanged.
- `:276-277` becomes `if ('SHOW_EVIDENCE' in shared) v('shared.SHOW_EVIDENCE', 'sources and evidence labels are never shown (owner 2026-09-30, LR-23)', String(shared.SHOW_EVIDENCE));`
- `:278` stays.
- New, add-only:
  - export `CONTACT_RE`, `SOURCE_RE` and `SAFETY_LINE_RE`, exactly as at the top of this plan;
  - in `checkText`, flag any field of any kind except `sourceNote` that matches CONTACT_RE ("no contact or emergency wording (LR-23)") or SOURCE_RE ("no source or evidence wording (LR-23)");
  - in `lintShared` (`:289-302`), apply both patterns to each box's `name`, `now` and `doctor` and to `DISCLAIMER`, and SAFETY_LINE_RE to the boxes.
- `:291`, `:299`, `:300` and `:301` stay.

**`artifact/shoot2.mjs`**
- `:6`: fix the comment.
- `:74`: drop the `sources`, `srcItems` and `ev` counts. Add `links: n('a[href]')` and `srcUi: n('.srcs,.src-cite,.src-ev,.src-key,.ev')`.
- `:81`: drop 'sources' from the section list.
- `:87`: flag a problem if `links` or `srcUi` is above 0.
- `:89`: drop the `['.srcs','sources']` entry.
- Add three checks on each card:
  - the disclaimer comes after the last `.redflag` and is the last layer node;
  - the card's text passes CONTACT_RE and SOURCE_RE;
  - no element's own text equals a label word.
- `:169-174`: delete the "sources open" state and its screenshot.

**`README.md`**
- Reword `:3`, `:15`, `:35`, `:41` and `:95`.
- `:77`: the source-note limit becomes a data rule.
- Add a section: "Owner decision 2026-09-30 (LR-23)", with the quote.
- `:9-11`: the new page sha256 and bytes; keep f39137e1 and the older pins listed.

**Proofs, all recorded in the README:**
- `node artifact/build-page.mjs` (lint 0);
- `fidelity-check.mjs`: 0 px against bc0f378 (plates untouched);
- `shoot2.mjs`: 0 problems in 5 themes;
- `hand-test.mjs` passes;
- lint mutations, each failing and then restored: `SHOW_EVIDENCE = true`; "Call 999" in `RED_FLAG_KNEE.now`; "(Muyor 2023)" in a setup line.

**Re-pin (HT-4 builder, after the golden-B commit):**
- `MANIFEST.json` `pageApproval.current` = {ref: <new commit>, approvedBy: 'owner', date: '2026-09-30', why: 'Owner decision LR-23: "Dont put any emergency or whatever contacts. Even the source remove it in app ui. If its not required by pkaystore dont put." No Sources section, evidence labels or contacts in the UI; plates, red-flag text and disclaimer unchanged.', pageSha256: <new>, bytes: <new>}.
- `history` = [the a7a0b74 entry, unedited ({ref:'a7a0b74', approvedBy:'supervisor', date:'2026-09-30', why:'source records only (HT5-A2); owner-approved design unchanged', pageSha256:'f39137e1…', bytes:2386418}), then b3a90af, then 16a8edc].
- `layers.mjs:13` `PAGE_SHA256` and `:15` `GOLDEN_B_REF` get the new values.
- `layers-vendor.test.ts`: `:80` MANIFEST pin literal; `:112` `approvedBy` 'owner'; `:120-134` three history entries plus the new historyPin literal.
- Replace `tests/howto/golden/howto-layers.html` with the rebuilt page.
- Every non-merge commit touching `tools/plates/layers/**` or `tests/howto/golden/**` carries "[golden update]".

## 8. Card, check and gate changes

**NEW guard C19 "No sources or contacts in the How-to UI"**

HT-4 owns `tests/howto/checks/c19.ts` and runs it in `content.test.ts` over all 8 sheets and over the bad fixtures. It imports the patterns from `tests/guards/no-contacts.ts`, and a parity test checks that copy-lint's `.source` and `.flags` are identical.

Unit checks (node):
- (a) `archetypes.ts` has no `SHOW_EVIDENCE` export. Every `RED_FLAG*` `name`, `now` and `doctor` and `DISCLAIMER` pass CONTACT_RE and SOURCE_RE; the boxes also pass SAFETY_LINE_RE.
- (b) Every copy field of every built sheet (the copy-lint `copyFields` list, every kind except `sourceNote`) passes CONTACT_RE and SOURCE_RE.
- (c) In every file under `src/howto/**` and `src/slices/howto/**`:
  - no `<a` element and no `target=`;
  - every `href=` or `xlink:href=` value starts with `#`, because SVG `<use href="#…">` is legitimate;
  - no class token `srcs`, `src-cite`, `src-ev`, `src-key`, `src-n`, `src-list`, `ev` or `ev-*`;
  - no string literal equal to Measured, Mechanics, Coaching consensus or Weak for this use;
  - no file or export named `sources` under `src/howto/generated`, and no `url` or `cite` keys there.
- (d) The pre-rendered HTML in `feel-*.ts`, with tags stripped, passes both patterns.

Gate block "HT-9 C19" (added by HT-9; HT-10 re-runs it on the final sheet). On every sheet, in 5 themes, with every details element, row and zoom opened:
- 0 `.ht a` and 0 `[target]`;
- 0 `.srcs,.src-cite,.src-ev,.src-key,.ev`;
- no element whose own text is a label word;
- `innerText` plus every `aria-label`, `title` and `alt` value pass both patterns;
- exactly one `.ht-disclaimer` holding the owner's text, placed after the last `.redflag`.

Mutations (each must turn it red, then be restored; list them in the PR):
- M1: `SHOW_EVIDENCE = true` in a fixture;
- M2: "…? Call 999." in `RED_FLAG_KNEE.now`;
- M3: "Get emergency help now." in a back-box fixture;
- M4: "(Muyor 2023)" in a feel fix;
- M5: "+44 20 7946 0000" in a risk line;
- M6: "www.nhs.uk" in a setup line;
- M7: an `<a href="https://pubmed…" target="_blank">` in a section;
- M8: `<span class="ev ev-data">Measured</span>`;
- M9: "help@example.org";
- M10 (gate): Sources.tsx from 610b72c registered again;
- M11 (gate): the disclaimer moved above Risks;
- M12 (gate): the disclaimer deleted.

**Checks that stay unchanged:**
- C8 (every claim has sources; no own red-flag wording) stays as a data check.
- C7 and C16 stay.
- `content-types.ts` stays: `Source`, `EvidenceTag` and `sources` are data.

**C17 rewrite (HT-4):**
- `c17.ts`: remove the `allowedUrls` parameter. The only exemption is the exact literal `http://www.w3.org/2000/svg`. The failure text becomes `C17: <file>: URL "<u>" is not allowed`. Add a bad fixture that holds a cite URL.
- Update the callers: `content.test.ts:371-374` and `content-gen.test.ts:108-125`.
- This also clears the latent C17 hits on the SVG namespace: 20 on HT-6, 46 on HT-7 and 20 on HT-8. I found these by grep and have not run vitest, so check each branch's CI.

**Per card:**
- **HT-3:** no code change. `types.ts:124` (`sources?: never`) stays.
- **HT-3b:** change A5 (`:36`) to: "C17 on the built How-to chunks: no `fetch(`, `XMLHttpRequest`, `Worker` or http(s) URL (only the SVG namespace literal is exempt), no `<a>`, no `target=`, every `href` starts with `#`."
- **HT-4:**
  - card `:44`: the C17 wording as above;
  - card `:51` (HT4-A6): strike "sources collapsed and expanded";
  - add a new criterion HT4-A9 for C19 as specified above;
  - code: the re-vendor (section 7); the C17 rewrite; `c19.ts` with its fixtures and parity test;
  - `tools/plates/fidelity/goldenB.mjs`: delete `:141-144` (`expandSources`/`collapseSources`), `:191` and `:209-210`, and extend the "risks" state's capture so it includes `.ht-disclaimer`.
- **HT-5:**
  - card `:6`: "…setup, risks; sources are generated as research data only";
  - card `:17`: drop `SHOW_EVIDENCE = true`;
  - card `:34`: "No URL is ever written under `src/`; source URLs live only in `docs/research/howto/`";
  - code: `content.mjs:137` stops emitting `SHOW_EVIDENCE`; regenerate; `content-gen.test.ts:156` becomes `expect('SHOW_EVIDENCE' in archetypes).toBe(false)`; update the C17 caller;
  - `docs/research/howto/{sources.json,<id>.json}` stay;
  - no trim of source IDs in `ht-*.ts`, since they are unrendered data and C19 (c) blocks url and cite.
- **HT-6 and HT-7:** merge the new HT-4/HT-5 heads and regenerate. The `.redflag` CSS stays. No card change.
- **HT-8:** merge and regenerate. The 19 rf-link buttons stay. The feel chunks must pass C19 (d). No card change.
- **HT-9:**
  - code:
    - delete `sections/Sources.tsx`, `sections/index.ts:7` and `:22`, and `css/text.css:31-45`, and drop the `.ht .srcs` part of `:49`;
    - keep `:47` (`.ht-disclaimer`);
    - fix the `Setup.tsx:13` comment;
    - `Risks.tsx` returns a fragment: the `<section class="hw-sec risks">`, then `<p class="ht-disclaimer" id={`${pre}-disclaimer`}>{DISCLAIMER}</p>`;
    - `docs/COACHING-DECISIONS.md:1169-1189`: close the "missing Source registry" gap as "not needed (LR-23)";
    - add the gate block "HT-9 C19".
  - card:
    - title: "Set up" and "Risks and when to stop";
    - `:9` and the `:15` O3 line: delete;
    - `:18`: `sections/{Setup,Risks}.tsx`;
    - `:24` (A1): drop "collapsed and expanded";
    - `:27-28` (A2) becomes: "no `.srcs`, link, evidence tag or 'Sources' text; C19 gate block green; failure fixture M10";
    - A3 stays, plus "the DISCLAIMER node comes right after the Risks section".
- **HT-10:**
  - card `:37`: C17 with no exception, as in HT-3b;
  - A1 adds "C19 whole-sheet sweep, 5 themes, failure fixtures M10-M12";
  - `:26` (TalkBack) is unchanged.
- **Build plan `HOWTO-BUILD-PLAN.md`:**
  - `:77`: drop SHOW_EVIDENCE;
  - `:90`: drop Sources;
  - `:124-126`: item 7 is the last item; delete item 8; "3-8" becomes "3-7";
  - `:246` and `:259`: C17 has no URL exception except the SVG namespace;
  - `:356`: "setup, risks (with the disclaimer)";
  - `:399`: drop "and sources";
  - `:414` (O3): "Closed 2026-09-30: no sources or evidence labels in the UI; they stay in the data (LR-23)";
  - `:413` (O2): keep.
- **`GRIP-AND-FEEL-ARCHITECTURE.md`:**
  - `:111`: delete item 9 ("Where this comes from");
  - `:453`: claims are never shown;
  - `:790` and `:973`: remove the "Where this comes from" mentions;
  - `:850`: the new C17 wording;
  - add a C19 row after C18.

## 9. Library plan and research

**`LIBRARY-HOWTO-ARCHITECTURE.md`**
- `:46`: layers are "grips, close-ups, feel map, setup, risks".
- `:49-50`: "…evidence labels stay on" becomes "sources and evidence labels are research data only, never shown (LR-23)".
- `:346-347` and `:470`: layer pages build from the new golden B, with no sources states.
- `:399-406`: the back box follows R6. Delete the "Get emergency help now." and add-only lint-rule text.
- `:407-408`: drop `SHOW_EVIDENCE = true`.
- `:466`: delete "the back-box urgent-line rule".
- `:757` (LIB-5): "back-pain box (existing box lint)", and "research source registry (data only)".
- `:817-818` (decision 6): "Settled by LR-23 and LR-27: '…? Get it checked today.' / '…? See a doctor.'; the owner sees it on pilot A".
- `:827`: "no sources or evidence labels in the UI (LR-23)".
- `:836-838`: add: "Play needs a 'not a medical device…' line in the store description, and an in-app reminder to consult a healthcare professional (P3). It does not need sources or contacts."

**`inputs/content.md`**
- `:96` and `:235-237`: labels are data only.
- `:325-341`: replace the "Call 999" draft with R6.
- `:422`: delete the "Call 999" risk row.
- `:438`: delete the "Call 999" lint rule.
- Keep the NHS URL at `:328`, since that file is research.

**`RULINGS.md`:** add LR-27 (R1-R7 and the card fixes below). Nothing else: LR-11's urgent line is already superseded by LR-23.

**`CARD-V2.md`:** no change. Sources, quotes and claims stay in the cards, and `redFlags: back` stays a pending link (LR-26).

**Card lines fixed at the stamp or batch pass (the supervisor assigns it; C19 and copy-lint catch them anyway):**
- `assisted_pull_up.json:678,688`, `chin_up.json:804,815`, `landmine_row.json:717`, `pendlay_row.json:786`, `t_bar_row.json:704`: the feel fixes drop their own "get it checked" / "see a GP" wording and link the shared box.
- `dumbbell_biceps_curl.json:142`: "…injuries seen in emergency departments." loses the emergency-department wording (for example "…a common cause of gym injuries."). Claim and source stay unchanged, and the critic re-checks the line against the quote.

## 10. Messages to send (one-shot Routine to each session)

- **HT-4:** "Owner decision LR-23: no sources, evidence labels or contacts in the app UI. Once the new golden-B commit lands on howto-options, re-vendor at that pin as a [golden update]:
  - new pageApproval.current with approvedBy 'owner' and the owner's quote as why; the a7a0b74 entry moves unedited to the front of history; re-pin PAGE_SHA256, GOLDEN_B_REF, the manifest literal and historyPin;
  - drop the sources states from goldenB.mjs;
  - rewrite C17 with no URL exception except the SVG namespace;
  - add C19 from the plan with fixtures M1-M9 and the regex parity test against tests/guards/no-contacts.ts (merge main after ESC-NC lands).
  C8 stays as it is."
- **HT-5:** "LR-23: after HT-4's re-vendor, merge it and regenerate. archetypes.ts must no longer export SHOW_EVIDENCE: stop emitting it in content.mjs:137, change the content-gen.test.ts:156 assertion to 'not present', and update the C17 caller. The research files stay. No URL may ever land in src/."
- **HT-6:** "LR-23 needs no change in your layer. Merge the new HT-5 head, regenerate, and confirm C17 is green with the SVG namespace exemption (your hand chunks hold 20 of those strings)."
- **HT-7:** "Same as HT-6: merge the new HT-5 head, regenerate, and check C17 is green (46 SVG namespace strings). The .redflag CSS stays."
- **HT-8:** "LR-23 keeps your 'When to get it checked' buttons and the red-flag links. Merge the new HT-5 head, regenerate, and make sure the feel chunks pass C19 (no contact, number, URL or source wording)."
- **HT-9:** "LR-23:
  - delete Sources.tsx, its lines in index.ts and the sources CSS (text.css:31-45 and the srcs part of :49);
  - render the disclaimer once, right after the Risks section, inside a fragment in Risks.tsx;
  - close the source-registry gap in COACHING-DECISIONS.md;
  - add the 'HT-9 C19' gate block with mutations M10-M12.
  The card's A2 is now the negative check."
- **HT-10** (card only, unless a session exists): "C17 now has no exception except the SVG namespace, and A1 adds the C19 whole-sheet sweep in 5 themes."
- **LIB-8 lead:** "LR-23 and LR-27:
  - no sources, evidence labels, contacts or emergency wording on any library sheet;
  - the back box uses '…? Get it checked today.' and '…? See a doctor.', with the NHS triggers kept and no 999 or 'emergency help' line;
  - the six card lines in section 9 drop their own referral or emergency wording;
  - sources stay in the cards."
- **doc-2:** "Add this line to the store description: 'M/ARC is not a medical device and does not diagnose, treat, cure, or prevent any medical condition.' Once the owner approves ESC-REPORT, record its data in the Data safety answers."

**Order:**
1. Supervisor: the golden-B commit, the card and plan edits, and the library edits (docs), now.
2. In parallel: ESC-NC on main (it creates `tests/guards/no-contacts.ts`), ESC-NC-W (the owner merges it), PLAY-1, and the HT-4 re-vendor.
3. HT-5 regenerates.
4. HT-6, HT-7, HT-8 and HT-9 merge and regenerate. HT-9 removes Sources.
5. HT-10 last.

ESC-REPORT waits for the owner.

**Owner input needed:**
- approve the report data for P4;
- merge the worker PR;
- be told the crisis and emergency trade-off in section 6 (information only, not a question).
---

## AMENDMENTS (supervisor, 2026-09-30 14:45 UTC). These override the plan above wherever they differ.

An independent check re-read the real files after the plan was written. Heads have moved since (main is now e14c45b), so re-derive every line number from your own branch head before editing. Never trust a line number above without looking.

### D-LR23-1. "Emergency help" wording is allowed; contacts are not
- The owner's words ban **contacts** ("Dont put any emergency or whatever contacts"). A generic instruction with no number, no service name and no link is not a contact, works in every country, and is materially safer.
- Banned everywhere in the UI: phone numbers, short codes, hotlines, helplines, crisis lines, named services (ambulance, A&E, emergency services, emergency number, emergency department, emergency room, urgent care, Samaritans, Lifeline), websites, emails, links.
- Allowed, in exactly these places: the words "get emergency help now".
  - **Coach medical card:** "Chest pain, fainting, or dizziness during exercise needs medical attention. Stop the session and get emergency help now."
  - **Coach crisis card:** "If things feel like too much, you don’t have to carry it alone. Talk to someone you trust, or a doctor. If you feel you might harm yourself, get emergency help now."
  - **Coach disordered-eating card:** as the plan says ("This is worth talking through with someone who can help properly, like a doctor.").
  - **Coach prompt,** policy.ts rule 9 (replacing the plan's item 11): "The app shows its own short safety card. Never give phone numbers, hotlines, helplines, websites or the names of services. If someone may be in danger now, tell them to get emergency help now; otherwise point them to stopping and getting it checked, or to talking with someone they trust or a doctor."
  - **Coach prompt,** rule 11 (replacing the plan's item 12): "No headings, tables, code, emojis, links or phone numbers. Don't name research studies, their authors or health organisations as sources, and don't quote evidence ratings; say how sure the evidence is in plain words."
  - **Library back-pain box:** name "Back pain"; now "Numb or weak in both legs, numb around your genitals, or bladder or bowel changes? Get emergency help now."; doctor "No better in a few weeks? See a doctor." LR-11's urgent line and its add-only lint rule stand, minus any number. Only "Call 999" goes (content.md draft, its risk row and its lint rule). The plan's R6 and the edits it makes to LIBRARY-HOWTO-ARCHITECTURE.md :399-406 / :466 / :817 are cancelled accordingly. RULINGS LR-27 records this.
- **Patterns: the FINAL literals.** They replace the plan's versions. Copy them byte for byte into `tests/guards/no-contacts.ts` (ESC-NC creates it, as the single definition) and into golden-B `copy-lint.mjs` (a parity test pins the two together):
```js
export const CONTACT_RE = /(?<![\d.,])(?:999|111|911|112|000|988)(?![\d.,]*\d)|(?<![\d.,])\d{5,6}(?![\d.,]*\d)|\b116 ?123\b|\+\d[\d ().-]{6,}\d|\b\d{3,5}[ .-]\d{3}[ .-]\d{3,4}\b|\b\d{2} \d{2} \d{2}\b|\b(?:nine|one|zero)(?:[ -](?:nine|one|zero)){2}\b|emergency (?:services?|numbers?|departments?|rooms?|lines?|contacts?)|ambulance|\bA&E\b|urgent (?:care|treatment)|hotline|helpline|crisis (?:line|text)|samaritans|\blifeline\b|\btext \w+ to\b|\btel:|mailto:|[\w.+-]+@[\w-]+\.[a-z]{2,}|https?:\/\/|\bwww\./i;
export const SOURCE_RE = /\bsources?\b|\bcitations?\b|\bcited\b|\bet al\b|\bstud(?:y|ies)\b|\bmeta-analys[ie]s\b|\bpubmed\b|\bdoi\b|\bNHS\b|\bACSM\b|\bCoaching consensus\b|\bWeak for this use\b|\([A-Za-z][^()]* (?:19|20)\d{2}[a-z]?\)|\[[^\]]*(?:19|20)\d{2}[^\]]*\]|\bresearch(?:ers?)?\b|\btrials?\b|\bevidence\b/i;
// Case-sensitive on purpose: under /i, WHO would match "who".
export const SOURCE_CS_RE = /\b[A-Z][a-z]+(?: et al\.?)?,? (?:19|20)\d{2}[a-z]?\b|\b(?:NSCA|ACE|ISSN|WHO)\b|Barbell Logic|Human Kinetics/;
export const SAFETY_LINE_RE = /\b(?:call|phone|dial|ring|GP|clinic|hospital)\b/i;
```
  - Every place that applies SOURCE_RE also applies SOURCE_CS_RE.
  - Also add a data-driven check: no visible field contains any registry source's first-author surname or organisation name.
  - Run all the patterns over every current copy field. Reword copy that hits by mistake. If a hit is a true false positive that rewording can't fix, stop and ask the supervisor. Never exempt on your own.
  - The supervisor checked the new card copy above, the back box and the owner's disclaimer against these literals. All pass.
- Mutations:
  - M3 becomes "Go to A&E."
  - Add fixtures "Weiss 1995", "NSCA teaches", "text HOME to 741741" and "ring 13 11 14". Each must fail.
  - Add "Get emergency help now." in the back box. It must pass.

### D-LR23-2. No false approval record
- The re-vendored golden-B manifest uses `approvedBy: 'supervisor'`. Its `why` reads: "applies owner decision LR-23 (quote); the owner has not viewed this page yet".
- It switches to 'owner' only after the owner views the page on pilot A.
- The HT-4 test pin at layers-vendor.test.ts follows.

### D-LR23-3. The coach drawer ("What Escobar looked at")
- Filter at display time in the drawer:
  - drop `sources` and `rating` from lookup_knowledge results;
  - hide the `note` of escalate calls.
- Stored old conversations are filtered too. Add a test with a stored old result that still carries sources and rating.
- The model still receives `rating`.
- The drawer label stays. The user's own data is still shown in full; the hidden fields are internal hints.

### D-LR23-4. Health Connect privacy screen
- PermissionsRationaleActivity must **display** the policy: a WebView loading the same URL as the Play Console field.
- The current summary stays as the offline fallback.
- Real-phone check required.

### D-LR23-5. The Report button (P4)
- It is a Play release blocker.
- It waits for the owner's yes, because it is new data sent.

### D-LR23-6. Merge order: HT-4 is not reopened
- HT-4 (#107) finishes its current review with the C17 escaped-quote fix already queued, then merges first as planned.
- The LR-23 re-vendor, the C17 rewrite and C19 go to a new follow-up card, **HT-4b**, on its own branch from main after HT-4 merges.
- HT-5 to HT-9 take LR-23 after HT-4b.

### D-LR23-7. C17 final form (HT-4b)
- Remove the `allowedUrls` parameter.
- The only exemptions are the SVG namespace and xlink namespace literals, in their whole-attribute form, with an optional backslash before each quote (the escaped form inside generated `.ts` string literals).
- C19 (c) must read `href`, `xlink:href` and `class` values in the same escaped form.
- Fixtures:
  - escaped SVG namespace: passes;
  - escaped `xmlns=\"https://example.com/x\"`: fails.

### D-LR23-8. Everything else in the independent check is adopted
1. **Page footer** (build-page.mjs, "…from cited joint angles"): "Drawings are computed by our own code from joint angles."
2. **The lookup_knowledge tool description** (`schema.ts`, "…an evidence rating and sources") changes in the **worker PR** (ESC-NC-W), together with the regenerated `escobar-worker/src/tools.generated.json` (npm run escobar:tools), because tests/escobar/tools-sync.test.ts requires them to match. The app PR ESC-NC does not touch schema.ts.
3. **splitCitations** strips `⟦k:[^⟧]*⟧` before its punctuation cleanup. Test (c) asserts no " ." and no " ,".
4. **Gate EV5.** The mock conversation (src/escobar/mock/transport.ts) gets a `⟦k:protein_intake⟧` marker and an escalate(crisis) step, so the absence checks can see:
   - the removed link;
   - the chip;
   - the card copy.
5. **M10** registers a self-contained stub section with `details.srcs`, an `<a href="https://…" target="_blank">` and `<span class="ev ev-data">Measured</span>`. It does not re-import the old Sources.tsx.
6. **Library lines,** in addition to the plan's list:
   - `cross_body_hammer_curl` and `incline_dumbbell_curl` risks[1] ("emergency department");
   - `front_squat` loadProgression.text (check it);
   - `smith_machine_squat` feel.rows[2].fix;
   - `landmine_row`, `pendlay_row` and `t_bar_row` feel.rows[2].means ("The NHS advises…");
   - `hanging_knee_raise` feel.rows[1].means and .fix ("EMG study");
   - "study" in risks[].risk of `cable_fly`, `low_to_high_cable_fly`, `horizontal_leg_press`, `leg_press_calf_raise`, `shoulder_press` and `preacher_curl`;
   - "sources" / "coach source" in feel.rows[].means of `horizontal_leg_press`, `leg_press_calf_raise`, `resistance_band_row`, `straight_arm_pulldown` (×3) and `smith_machine_shoulder_press`.
   - Rule: visible fields say the fact in plain words. The claim and its sources stay in the card data.
7. **Doc and style leftovers:**
   - HOWTO-BUILD-PLAN.md (the HT-9 row "Where this comes from");
   - build-plan/README.md ("O3: show the evidence labels");
   - src/howto/content-types.ts comment ("shown only in 'Where this comes from'");
   - ESCOBAR-ARCHITECTURE.md ("a fixed resource");
   - Message.tsx:3 comment ("with citations");
   - HT-9 text.css: delete the empty `@media` rule left behind.
8. **Records.** ESC-NC appends D-LR23-1…8 to docs/COACHING-DECISIONS.md (append-only), with the owner's quote.

### D-LR23-9. Advice follows the symptoms and their timing (owner, 2026-09-30 15:15 UTC)
- Owner: "Yes no contacg or links or hotline. We only say, seek for emergency help or advice if u still feel the numbness, pain etc after few hours or days. Based on the symptomps"
- The pattern for every safety line in the app (coach cards, coach prompt, red-flag boxes, library boxes): **symptom → how long or how bad → what to do**. Never a contact.
  - danger now (chest pain, fainting, thoughts of self-harm, loss of feeling or bladder or bowel control): "get emergency help now";
  - severe signs: "Get it checked today.";
  - lasting signs: "still there after <time from the research: hours, days or weeks> or getting worse? Get it checked" or "See a doctor".
- The existing boxes and cards already follow this: "lasting more than two days", "no better after two weeks", "No better after a few weeks". Keep the research-based times; do not replace them with one fixed time.
- Coach prompt rule 9 now says "Match the advice to the symptoms … get it checked if the pain, numbness or other symptom is still there after a few hours or days or gets worse" (ESC-NC-W eafff05).
