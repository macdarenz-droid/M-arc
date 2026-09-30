# Library How-to: content and research pipeline for the other 145 exercises

Written 2026-09-30. Scope: the words, facts and sources under each plate, for every exercise in `src/data/exercises.json`
(153 on main `cae1725`; 8 done, 145 to go). This file doesn't cover plate drawing, engine work or app wiring. It
names app needs only where content drives them (section 8).

Read for this: GA (`grip/GRIP-AND-FEEL-ARCHITECTURE.md`) sections 3, 4, 6, 8 and appendix B; the research cards for leg
press, pull-up and lat pulldown (structure checked on all 8); `GENERAL.md`; golden B (`README.md`, all 8
`*.howto.mjs`, `howto/shared.mjs`, `artifact/copy-lint.mjs`); the HT plan (2.2, 2.7, 2.9, 4.1-4.2, 5, 6) and the HT-4 and
HT-5 cards; `exercises.json`, `ids.ts` and `models.ts`/`exercises.ts` on main. Numbers marked *measured* come from the
scripts in this folder (`stats.mjs`, `share.mjs`, `src.mjs`, `orph.mjs`, `platecopy.mjs`, `tiers.py`, `fam.py`), run
on golden B at `b3a90af` and on main.

---

## 0. In plain words

- **One research card per exercise, as for the 8.** It must be as accurate as the 8. We save work in two ways. The
  grip, contact and safety rules are written once per group and reused. Near-copies such as incline and flat bench
  inherit from a parent card and only research what differs: 94 full cards and 51 short "difference" cards.
- **No paid expert, so we check it another way.** Every claim carries the source's own words. A mechanical agent
  fetches every source and records what it could read. An independent critic
  checks that each source really says what the card claims. On risky exercises a separate safety checker runs its
  own list. The supervisor re-checks a random sample. Once per batch, the supervisor plants two known mistakes in a
  copy of a card to prove the critic catches them. CI then blocks any sheet whose exact content has no
  "verified" stamp.
- **Short copy from day one.** Cards hold facts only. The words are written straight into the sheet under the
  existing limits (450 visible words, 15-word sentences), and the build fails on any break. The 8 needed a rewrite
  from 851 lint errors down to 0; the new ones never start long.
- **50 of the 153 exercises are risky** (47 still to do: bar over the face, heavy back loading, overhead, hanging, jumping or explosive). They get
  the extra safety check, pinned warning rows, and a new shared **back pain** warning box from the NHS page.
- **No How-to means no button**, as today. Your own custom exercises never get one, because a guide written for
  a library exercise could be wrong for yours. Any library exercise we can't source properly goes on a named list
  for you before the Play Store build. It never ships thin.

---

## 1. Where we start (measured)

| Fact | Number | Source |
|---|---|---|
| Library exercises | 153; 8 with How-to (`HOWTO_IDS`), 145 without | main `exercises.json`, `src/howto/ids.ts` |
| Visible words per sheet (cap 450) | 442 to 450. Copy 348 to 400, safety boxes + owner line 42 to 101 | `lintHowto` on golden B |
| Lint violations | 0 on all 8 (was 851 before the compact rewrite) | golden B README |
| Sheet shape, all 8 | 1 hand zoom + 2 posture zooms, 4 feel rows, 5 setup steps, 3 handling mistakes, 2-3 risks, 6-7 posture checkpoints | `stats.mjs` |
| Sources | 137 entries, 110 unique URLs (about 17 per sheet); 83 are PubMed/PMC; kinds: 85 peer-reviewed, 30 guideline, 13 coach, 6 secondary, 3 manufacturer | `src.mjs` |
| Sources reused across sheets | 12 URLs (NHS wrist on all 8; O'Driscoll 1992, Baechle and Earle, Kolber 2010, NHS shoulder on 4) | `src.mjs` |
| Copy strings shared by 2+ sheets | 35 of 674 distinct strings (5 %), nearly all labels, headings and source notes | `share.mjs` |
| Feel specs that disagree with `exercises.json` | 8 of 8 carry a `libraryDiff` | `share.mjs` |
| Research card size | 19,167 to 28,734 bytes each | `wc` |
| Sources listed but cited by no claim | 10, spread over 5 sheets | `orph.mjs` |

**Gaps in the 8 that must not repeat at scale** (all measured):

1. **Unverified source fields.** The chest press lists 6 sources with `access: null` and 8 with `checked: null`. The squat
   has 19 of 21 without `checked`, the leg press 2. HT-5 acceptance HT5-A2 says "Every source carries `access` and
   `checked` (no nulls)", so HT-5 fails on golden B as pinned. **This needs a golden-B source-field update before
   HT-5, whatever the library plan.**
2. **Sources taken on trust.** The leg press card cites ACE with "Verifier got a 403 ... content taken on trust from the
   first research pass". It cites Bells of Steel with "Treat as unverified". At scale, a claim that rests only on
   something nobody could read is `unreachable`, and C8 blocks it.
3. **Two evidence-label formats.** Three sheets use `SOURCES[].use`, five use `EVIDENCE_LABELS`.
4. **Citations inside user text.** The cards' `whyItHurts` mixed citations and percentages into copy. GA 6.2 found 27
   lint hits in 7 cards.
5. **Known research errors that a second reader caught:**
   - the "lower the seat a notch" direction slip (brief and GENERAL.md);
   - O'Driscoll 1992 misquoted as "a third of grip strength";
   - chest-press seat height inferred from incline-press EMG;
   - Palmer and Werner's "80 %" figure, which isn't in the abstract.

   The golden-B compact rewrite had 15 accuracy findings and 17 reader findings across 8 sheets, about 2 of each per
   sheet. **Plan for about 2 real errors per first draft.** Verification isn't optional.
6. **Stale acceptance text.** The HT-5 card I read (HT5-A5) says `DISCLAIMER` is exactly "This is coaching guidance,
   not medical advice." The owner's line in golden B `shared.mjs` and `copy-lint.mjs` (`OWNER_DISCLAIMER`) is
   "General guidance, not medical advice. If something hurts, stop and get it checked." The generator reads golden
   B, so the card text is what's wrong. The supervisor should fix it before HT-5 starts.

`GENERAL.md` stays superseded (GA 6): no user copy comes from it.

---

## 2. What is shared and what is per exercise

The 5 % string-sharing figure answers the main question. Archetypes share **rules, drawings, claims and sources**, but
most of the **words** belong to one exercise. So a per-exercise card is needed for every exercise. Archetypes cut the
research, not the writing.

### 2.1 Shared: written, sourced and verified once, then reused

| Unit | Count | What it holds | Where it lives |
|---|---|---|---|
| Hand archetype | 10 (GA 3.1; appendix B assigns all 153) | contact point, thumb rule, wrist range, `faultMargin`, lever limits, right pose, standard faults (key, label, pose, markers, alt), default grip line and cue, thumb page (`hang`, `pull`), claims and sources (for example O'Driscoll 1992 and Baechle and Earle for `pull`/`hang`) | `src/howto/archetypes.ts` (GA 4.4), hand pairs shared by key (`hand-<key>.ts`; 3 keys today) |
| Contact archetype | 8 (GA 3.2) | default checkpoints (label, detail, claim), default crop kind, `prone: true` checkpoints | archetypes module |
| Equipment moves (GA 3.4) | 5: get in/out, selector pin, foot bar, unrack/rerack, dumbbell kick-up | shared setup-step text, the `unrack-rerack` and `dumbbell-kickup` posture archetypes | archetypes module |
| Red-flag boxes | 4 today (wrist, shoulder, knee, elbow; NHS, checked 2026-09-30); a new back box proposed (5.3) | name, urgent line, doctor line, NHS claim; triggers pinned by `RED_FLAG_BLOCKS` | golden B `howto/shared.mjs` |
| Owner safety line, `SHOW_EVIDENCE` | 1 each | verbatim line; labels on | `shared.mjs` |
| Shared risk lines (new) | proposed 3: bar over the face (thumb wrapped, safeties, collars; Kerr 2010, Jumbelic 2007 already in GA), breath-holding under heavy load (the squat's "breath" risk; MacDougall 1985 on the leg press card), jump landing (needs a source) | one text + claim, reused by id | archetypes module |
| Source registry entries | about 110 today, growing | cite, URL, kind, `access`, `checked`, PMID, quotes | `docs/research/howto/sources.json` (GA 4.4) |
| Fixed headings and chips | "Hand", "Hand: right and wrong", "Where to feel it" | page constants | sheet code |

An archetype's copy (grip line, fault labels, default checkpoints) is reused as-is only when the exercise card marks it
`inherit: true` with a one-line reason. The critic checks each such line against the exercise. That catches the
`loadAxis` trap from GA 3.1.1: the rope pushdown filed under `push`, where the heel-of-palm rule is false.

### 2.2 Per exercise: researched for each one

| Part | Why it can't be shared |
|---|---|
| Plate content: 3 callouts, mistake pose and 1-3 tells, tempo, alt | Each plate is its own golden (HT plan 2.8). The card supplies its facts: callouts come from the top posture checkpoints, the mistake from the most common handling mistake |
| Feel spec: primary, secondary, watch, feel line, 4 rows, `libraryDiff` | Muscle roles differ even inside a family (the chest press adds the upper chest). All 8 cards disagreed with `exercises.json` |
| Setup: 5 steps | Seat, pad and foot settings are per machine. Shared equipment-move steps are merged in |
| Handling mistakes (3) and risks (≤ 3) | Each exercise fails in its own way. Shared risk lines are merged in |
| Posture checkpoints (6-7) and 2 posture zooms | Crops of that exercise's own plate |
| Handling overrides | orientation, handle, width text, `handleChoice`, `overBody`, `loadAxis`, thumb options |
| Which red-flag boxes (`riskFlags`) and the rows that link them | Depends on which joint that exercise loads |
| Evidence labels | A tag rates a source *for this use* (GA 3). The same paper can be DATA on one sheet and WEAK on another |

### 2.3 Families: 94 full cards and 51 difference cards

GA 4.4 already has `extends` (inherit handling, setup and zooms from a parent). I grouped all 153 ids into 102 families.
The script check `fam.py` confirms every id is used once, none is missing and none is unknown:
- 8 families have a finished parent, which covers 12 children (for example `lat_pulldown` → `close_grip_pulldown`);
- 94 new parents need full cards;
- 51 children get **difference cards**.

A child must share its parent's hand archetype and primary contact. `fam.py` checks the hand archetype against GA
appendix B (0 mismatches). Primary contact can't be scripted, because GA lists contact counts, not a contact per id,
so the parent card confirms it. This rule split off the obvious cases:
- `assisted_pull_up`: a brace pad, not a hang;
- `sled_pull`: `pull`, not `push`;
- the cable and bent-over rear-delt flies: `hold`;
- `bodyweight_calf_raise`: `none`;
- `seated_calf_raise`: a pivot pad;
- the leg curls: `lying_leg_curl` (pivot pad, face down) now parents `standing_leg_curl`, and `seated_leg_curl` stands alone;
- `concentration_curl`: a brace pad;
- `incline_dumbbell_curl`: an incline bench;
- `overhead_cable_triceps_extension` and `smith_machine_shoulder_press`: different posture and tier.

The full list is in appendix A. It's provisional; each parent card confirms or splits its family.

A difference card holds:
- what it inherits, line by line, each with "true for this child because ...";
- what changes (feel, setup, mistakes, risks, grip width or handle), each with its own claim;
- its own plate facts.

A child never inherits the feel spec or the mistakes. Those are always re-researched, because they differ even
between flat and incline bench. The content hash already chains parent into child (GA 4.4), so changing a parent
flags its children for re-verification.

---

## 3. Research cards at scale with the same accuracy

### 3.1 How the 8 were made

| Step | Who | Evidence |
|---|---|---|
| Writer | one research agent per card | 8 cards, 19-28 KB |
| Source check | a second agent read each source: PubMed through NCBI E-utilities (the PubMed web pages were blocked), guidelines directly | GENERAL.md header; card notes such as "Verifier got a 403" |
| Critic | an independent review of GA and the cards | GA header: "revised after the critic's review"; the errors in section 1, gap 5 |
| Pin review | two fresh verifiers: fidelity and behaviour; design, copy and safety | golden B README, S-2 review |
| Compact rewrite | two verifiers: accuracy and safety (15 findings), reader's view at 390 px (17 findings), then a recheck | golden B README |

### 3.2 Card v2: what changes

One schema file, `docs/research/howto/card.schema.json`, and the cards move into the repo at
`docs/research/howto/<id>.json`, as GA 4.4 proposed. The scratchpad isn't durable (compare R1).

- **No user copy in the card.** The card holds facts and claims. The sheet's words are written in the spec, under the
  lint (section 4). This removes the 27 in-copy citation hits and the rewrite pass.
- **Claims are atoms.** Each is `{ id, text (plain fact), tags, sources[], quotes[] }`. A quote holds the source id, at
  most 50 verbatim words from the abstract or page, and where it was found.
- **Sources point to registry ids.** The writer never writes free-text citations. The verifier adds the registry
  entry with `access` (`full | abstract | summary | unreachable`), `checked` (ISO date) and a PMID where there is
  one.
- **Plate facts block:** the top 3 checkpoints for callouts, the plate mistake and tells, and tempo with its claim.
- **`inherit[]` block** (children only) and **`libraryDiff`** with a reason for each muscle.
- **Anchor source:** at least one exercise-specific technique source read in full (a guideline, a coach page or a
  technique paper). A child may reuse its parent's anchor only when the source covers the child.
- **No orphan sources.** Every listed source is cited by at least one claim. C8 gains this rule, add-only.

### 3.3 Roles per batch (models as the owner set them; nobody repeats another's check)

| Role | Model | Input | Output | Checks nobody else runs |
|---|---|---|---|---|
| Family writer | claude-opus-5-5 | GA archetype row, the plate engine's limits, PubMed searches, guideline pages | parent card and its difference cards | research and judgement |
| Source fetcher | claude-sonnet-5 | the cards' source lists | registry entries (`access`, `checked`, PMID, title, year) and the quote file: for each claim, the text that best matches it | title, author, year and PMID match; the quote is verbatim; dead links. Mechanical, using E-utilities and plain fetches |
| Critic (fresh context; never sees the writer's reasoning) | claude-opus-5-5 | card and quote file only | findings list; after fixes, one recheck | does the quote support the claim; is the tag right for this use; direction slips; numbers against the abstract; inference from another exercise; mechanics against the plate pose; `inherit` lines really hold |
| Safety checker (tier A only, section 5; fresh context) | claude-opus-5-5 | card and spec | checklist result | the tier-A list in 5.2. Accuracy is the critic's job, not repeated here |
| Sheet author (the batch builder on a `claude/*` branch) | claude-opus-5-5 | verified cards | `<id>.howto.mjs` in golden B's `exercises/` (a golden-B update, plan 2.8), clean under the lint | voice, concept-first leads, picking the zooms |
| PR reviewer (fresh; AGENTS.md) | claude-opus-5-5 | built sheets at 390 px in 5 themes, cards | review | reader's view and the GA 6.1 render review in one pass: pictures against cards, Right and Wrong not swapped, tone, TRIPLET flags |
| Supervisor | (itself) | reports | stamps | re-fetches a random 10 % of claims (chosen from the head commit hash) and compares them with the quote file; runs the planted-mistake test (3.5) |

A writer handles one family at a time; up to 4 writers run in parallel (the builder cap in the HT plan). One fetcher,
one critic and one safety checker run per batch, not per card. The critic and the fetcher are separate agents on
purpose: one reads sources, the other judges. Merging them would let one agent grade its own reading. Two rounds of
critic findings without new evidence go to the supervisor (AGENTS.md "two failed tries").

### 3.4 Can we reach the sources? (tested 2026-09-30 from this machine)

| Source | Result |
|---|---|
| NCBI E-utilities (PubMed search, summary and abstract) | works |
| ACE exercise library (leg press page) | HTTP 200 today; the leg press verifier got 403 on the same page in the first research pass, so it is intermittent |
| NHS condition pages (back pain, neck pain) | 200 and readable |
| ExRx.net | 403 (no ExRx citation, as for the 8) |
| nsca.com | 403 (NSCA content only through secondary sources, marked `kind: 'secondary'`) |

Raw PubMed hit counts for some thin topics are: battle rope 16, bear crawl 11, pendulum squat 9, bayesian curl 25,
sled push 33, kettlebell swing technique 34. These are raw search counts, not relevant papers; I didn't check
relevance.

The rule when a source can't be read: a claim stands only on `full`, `abstract` or `summary` sources (C8 already
forbids a claim resting only on `unreachable`). If a claim can't be sourced, it is cut from the sheet, never softened
into it. If an exercise can't reach the bar in 3.2 (no anchor source, or its core setup is unsourced), it becomes
`blocked:evidence` in `coverage.ts` and goes on the owner's list before the Play Store build.

**Early research on the likely-thin ids.** Research these in the first research wave, whatever batch they belong to,
so any blocker shows up weeks early: `battle_ropes`, `bear_crawl`, `high_knees`, `jumping_jacks`, `flutter_kicks`,
`sled_pull`, `pendulum_squat`, `bayesian_cable_curl`, `resisted_hip_flexion`, `renegade_row`. Picking these is my
judgement, not a measurement.

### 3.5 Proving the checks work (the owner's "tests fail before, pass after")

- **Planted-mistake test, once per batch.** The supervisor copies one card, plants 2 known mistakes (a flipped
  direction like the seat slip, and a wrong number from a real abstract like the O'Driscoll misquote) and gives that
  copy to the critic along with the batch. If the critic misses either one, its findings for the batch are rejected
  and a fresh critic reruns. The planted copy stays in the scratchpad and is never committed.
- **Verified stamps in CI.** `reviews.json` (HT-4 creates it as a stub; GA 4.4) holds the agent-verification stamp
  instead of a paid review. The owner decided no paid review, so C15 goes strict now, not "when reviews start (O1)".
  The supervisor writes a stamp only after checking the reports. A stamp is
  `{scope, hash, date, fetcher, critic, safety?, reviewer, findings, open: 0}`. A sheet whose content hash has no
  stamp fails CI. The same works per archetype, as GA 4.4 already allows. The 8 get stamps from their recorded S-2
  and compact-rewrite verifications.
- **Evidence labels** stay on (`SHOW_EVIDENCE = true`, and the lint enforces it). New sheets use one format, the
  `EVIDENCE_LABELS` form `{tag, text ≤ 12 words}` that 5 of the 8 use. The HT-5 generator maps both forms, so the 3
  older sheets need no golden-B change just for this.

---

## 4. Short copy from the start

The limits are golden B's exported constants (`copy-lint.mjs`). They apply unchanged and none is loosened:
- sentences ≤ 15 words; feel line ≤ 20 words and starts "You should feel this";
- row means ≤ 12 words; row fix ≤ 15 words and starts with a verb; lead lines ≤ 22 words;
- setup 5 steps × 12 words; mistakes 3; feel rows 4; risks 3 × 14 words;
- captions ≤ 10 words; cues ≤ 6 words; alt text ≤ 30 words; ≤ 450 visible words per sheet;
- plus all of the GA 6.2 bans.

**How it applies from the start:**

1. The card has no user copy (3.2), so there is nothing long to cut later.
2. **Word budget before writing.** The 450-word total counts the warning boxes and the owner line (13 words). One box
   costs about 29 words. The pull-up, with 3 boxes, spends 101 words on safety and keeps 348 for copy. So the author
   picks `riskFlags` first, then writes to what's left. **At most 3 boxes per sheet**, the approved maximum. A sheet
   that seems to need a fourth has too many rows.
3. **The lint runs twice.** The golden-B page build throws on any violation, as it does today. C7 (HT-4) runs again on
   the generated app content on every commit. A batch PR isn't opened with any violation, and every TRIPLET flag is
   answered in the PR.
4. **Concept first** (the owner: "Teach more on concept"). Each section opens with one line saying the idea and why it
   works, then short cues. The lint can't judge this; the PR reviewer does, against golden B as the model.

**Add-only lint extensions for the library** (supervisor OK; each as a new named block, none loosens a rule):

| Addition | Why | Rule |
|---|---|---|
| Plate copy lint for **new** plates | The lint skips golden-A plate strings because they're frozen. New plates are new copy. The approved plates have cues up to 16 words, 7 semicolons across 4 plates' cues and alt texts of 29-51 words (measured) | New plates: GA 6.2 bans, callouts 1-3 words, cue ≤ 15 words, no semicolons, plate alt ≤ 51 words (the approved maximum). The 8 golden-A plates are exempt by name |
| `RED_FLAG_ROWS` grows with each batch | Today it pins the 8. Every approved sheet's warning rows must be pinned the same way | Add an entry per id when its stamp is written |
| Medical-claim bans | 145 sheets widen the chance of "treats", "prevents injury" and similar | ban `cure`, `heal`, `treat(s)`, `rehab*`, `diagnos*`, `injury-proof`, `prevents? injur*` in user copy |
| Variant line | 23 ids list more than one kind of equipment (for example "Dumbbells / Barbell"), and the plate draws one | a caption-class line "Shown with a barbell. Dumbbells: same rules." (≤ 10 words) is required when `equipment` contains `/`. The card says whether each claim holds for both |
| `FIX_VERBS` additions | the list is closed | a new verb is added only in the batch PR, named in the PR body |
| Family consistency | the same rule must read the same across a family and archetype | a script check: an inherited string is `===` to the parent's; the same `fault.key` has the same label everywhere |

---

## 5. Safety-sensitive exercises

### 5.1 Tiers (by rule, checked by `tiers.py`; every id once)

| Tier | Rule | All | New | Done |
|---|---|---|---|---|
| **A** | free weight over the face, neck or chest (GA `overBody`); heavy spinal loading (barbell on the back or front, loaded hinge, bent-over barbell row, carry); loaded overhead; hanging; explosive or high-skill; weighted dip | 50 | 47 | squat, pull-up, hanging leg raise |
| **B** | machine-guided spinal load (leg press family, hack and pendulum, calf machines with shoulder pads, Smith shrug); loaded lunges and split squats; shoulder end range (bench dip, upright row, pullover machine, flyes); neck (crunches, shrugs); sled; jump rope; burpee | 28 | 27 | leg press |
| **C** | everything else | 75 | 71 | chest press, lateral raise, lat pulldown, seated row |

Tier A, new ids, by reason (an id can have more than one):
- **Over the face (12):** barbell, dumbbell, Smith, incline (3 kinds), decline and close-grip bench presses;
  skull crusher; dumbbell fly; dumbbell pullover; dumbbell overhead triceps extension.
- **Spinal loading (17):** front, Smith and goblet squats; conventional and sumo deadlifts; three kinds of RDL;
  barbell, Pendlay, T-bar and landmine rows; barbell shrug; farmer's carry; hip thrust; kettlebell swing; back
  extension.
- **Overhead (9):** machine, dumbbell, barbell and Smith shoulder presses; Arnold press; the two overhead triceps
  extensions; wall ball; pike push-up.
- **Hanging (3):** chin-up, assisted pull-up, hanging knee raise.
- **Explosive or high-skill (12):** kettlebell swing, box jump, jump squat, pistol squat, medicine ball slam, wall ball,
  Pendlay row, conventional and sumo deadlifts, front squat, ab wheel rollout, renegade row. Plus the weighted dip.

The full id lists are in appendix B.

### 5.2 Extra checks per tier

**Tier A** (the safety checker's list; every item needs a sourced claim or it is left out of the sheet):
- **A way out:** how to fail a rep safely where the equipment allows. Safeties or pins set, a spotter, dumping
  dumbbells to the sides on the floor (never over the face), Smith hooks, letting go of a kettlebell safely. This is
  GA 3.4 `unrack-rerack` and `dumbbell-kickup`, still unsourced.
- **Thumb and bar:** C4 wrapped thumb for `overBody` and `hang`; no thumbless option offered.
- **Load wording:** no fix tells anyone to push through pain or a fault. Where the load causes the fault, the fix
  says to go lighter or stop the set (the chest press pattern).
- **Warning links:** at least one feel row links the box of the joint most at risk, and it is pinned in
  `RED_FLAG_ROWS` at stamp time.
- **Risks:** at least 2 risk lines, one of them a shared risk line where it applies (bar over face, breath, landing).
- **Breathing:** heavy two-leg lifts carry the breath-holding line (the squat's approved "High blood pressure? Don't
  hold your breath long." pattern).
- **Jumps:** a landing checkpoint, with its source.
- **No personal advice** and no condition names (GA 8). Rows say "usually means".
- **Five-second test** (GA 6.3) for each **new hand-pair key** used by a tier-A sheet, not for each exercise. Pairs are
  shared by key, so there are only a few. This is a recorded check on a real phone.
- **First on the contact sheet:** tier-A pictures lead the owner's per-batch contact sheet.

**Tier B:** the critic's checklist gains machine depth catches and lockout, lower back on the pad, where the hands go
for crunches (no neck pulling), and upright-row height and width. No separate agent.

**Tier C:** the standard pipeline.

### 5.3 New shared warning boxes (golden-B shared-module updates, supervisor decision)

- **Back pain: needed.** It is linked from about 20 tier-A/B sheets: hinges, rows, back extension, crunches, the leg
  press family. The NHS page (https://www.nhs.uk/conditions/back-pain/) was read 2026-09-30 through a fetch summary, so
  `access: 'summary'`. The fetcher must read it in full before use. Its triggers:
  - **999:** pain, tingling, weakness or numbness in both legs; loss of feeling around the genitals or anus; bladder
    or bowel changes; chest pain; after a serious accident;
  - **111:** sudden severe pain or pain getting worse quickly; feeling hot, cold, shivery or unwell;
  - **GP:** no better after a few weeks; worse at night; lump, swelling or changed shape; unexplained weight loss.

  **Conflict with the current box pattern.** The current pattern is "<triggers>? Get it checked today." The 999
  triggers need "Call 999", and the lint (`/today/` on `now`) would reject that. This is an add-only lint rule for this
  box plus a wording decision (a safety message, so the supervisor decides and the owner sees it on the contact
  sheet). Fitting it in 30 words means choosing triggers. A draft for the critic, not approved: "Back pain. Numb or
  weak in both legs, numb around your genitals, or bladder changes? Call 999. No better in a few weeks? See a
  doctor." (26 words by the lint's count).
- **Neck: no box.** The NHS neck-pain page (read the same way) has no urgent or 999 triggers, only GP ones. It doesn't
  fit the two-line pattern, so neck rows link no box, as the chest press already does.
- **Ankle or hip:** added only if a jump or lunge row needs one, from that joint's NHS page, read in full, with its
  triggers pinned in `RED_FLAG_BLOCKS`.

---

## 6. Group research before the batches (GA says "no verified source yet")

These are shared cards, one per item, written and verified by the same pipeline before the batch that needs them
(19 small cards; the 5 implements and the 5 equipment moves get one each):
- `palm-flat` beyond Nance 2017;
- `curl`;
- `implement` (each of the 5);
- `floor-body` contact;
- the rope rule (`rope_triceps_pushdown`, `overhead_cable_triceps_extension`);
- the cupped thumb (`dumbbell_overhead_triceps_extension`);
- the front-rack exemption (`front_squat`);
- the `wrist_curl` exemption;
- the `prone` checkpoints;
- the 5 equipment moves;
- the back-pain box.

The `loadAxis` second pass (GA 3.1.1: `pec_fly`, `pallof_press`, rope, cupped) comes before any stub.

---

## 7. Batch order and flow

The owner's "I want it to be next" answers O4: the whole library comes next. Batches go by archetype, riskiest first,
and match HT-12's presses batch:

| # | Batch | New ids | Tier A in it |
|---|---|---|---|
| 1 | `push` (presses, dips, triceps, ab wheel, sled push) | 25 | 18 |
| 2 | `pull` + `hang` | 20 | 7 |
| 3 | legs and hinge: `on-body` + the `hold` hinges, carry and lunges | 17 | 10 |
| 4 | `hold`: raises, flyes, shrugs, pullovers, pallof | 16 | 3 |
| 5 | `balance` (machines) | 17 | 0 |
| 6 | `curl` | 13 | 0 |
| 7 | `palm-flat` + `implement` | 15 | 5 |
| 8 | `none` (bodyweight, floor core, jumps) | 22 | 4 |

The "Tier A" column is from appendix B; `batch.py` checks that the rows add up to 145 new ids and 47 tier-A ids.

**Flow for each id:**

research card → verification (fetcher, critic, safety) → plate spec and owner contact sheet → golden-A entry → layer
spec (the posture crops are cut from the approved plate) → lint, C1-C8, C15 stamp → PR review → merge.

Research runs one batch ahead of the plates. The card is the plate's input (callouts, mistake, tempo), so batch n+1's
research runs while batch n's plates are drawn. An id enters `HOWTO_IDS` only when its plate and layers are both
approved, never before (A5).

---

## 8. Exercises with no How-to

| Case | What the app does | Why |
|---|---|---|
| Library id not done yet | no button (`hasHowTo` false); `coverage.ts` row with archetype and `status: queued, researching, blocked:<reason> or left-out:<reason>` | O8: no How-to without an approved plate. No "coming soon" promise in the release |
| Library id left out | same, and **only with the owner's named OK** before the Play Store build. The release candidate check (new, add-only in C6) fails if `coverage.ts` holds any id without an owner-approved `left-out` reason | The owner wants the whole library before upload, so nothing is dropped silently. From the content side, the likely candidates are in 3.4 (thin evidence). Whether the engine can draw implements, ropes and whole-body moves is the plate lane's call |
| Custom exercise (`custom: true`, id `custom_<base36>`, `pattern: 'other'`, no library link in `Exercise`) | **never a How-to, no button** | Content is researched per library id. A name or alias match could put library advice on a different movement or machine. A "use the guide for library exercise X" link would need a stored link field, which is new saved data and needs the owner's OK. I don't recommend it for v1 |
| Last test exercise with no How-to | the gate's negative control switches from `lib_barbell_bench_press` (R17) to a **custom** exercise | At full coverage, a custom exercise is the only exercise with no button, so it's the only lasting negative control |
| Feel map with nothing it can draw | 5 ids have `core` as their **only** primary (`plank`, `mountain_climbers`, `medicine_ball_slam`, `bear_crawl`, `bird_dog`). `cable_external_rotation`'s only primary is `rotator_cuff`. `brachialis` is in 3 curls | These are text-only under C2. Each card must name drawn regions with a reason in `libraryDiff` (for example abs and obliques), or the sheet has nothing to shimmer. A feel section with **zero** drawn main muscles isn't a golden-B state yet, so it's a golden-B design update if any card ends there |
| `libraryDiff` on every sheet (8 of 8 so far) | the How-to shows its own researched feel. `exercises.json` changes are a separate supervisor batch decision | `exercises.json` drives the recovery and volume maths, so a silent change would move other features |
| `ids.ts` size (for the app lane) | 153 ids as a minified list = 3,468 B, over the 2,048 B `ids.ts` limit and the 3,072 B footprint limit (plan 2.9) | The list alone reaches 2,048 B at about 90 ids, so this needs a decision early. For example, at full coverage, `hasHowTo(id)` = starts with `lib_` and isn't in a short exclusion list. Not my lane; flagged with the numbers |

Custom and not-done exercises need no new stored or sent data. Content stays static and bundled (GA 4), with no new
paid service.

---

## 9. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Accuracy drops as volume grows (about 2 errors per first draft today) | quote-backed claims, an independent critic, a planted-mistake test per batch, the supervisor's 10 % re-fetch, C15 stamps tied to the content hash |
| Children inherit something wrong (the rope-pushdown `loadAxis` trap) | `inherit[]` lines each carry a reason and are checked by the critic; the hash chain re-flags children when a parent changes |
| A thin-evidence exercise ships weak | the anchor-source bar; `blocked:evidence`; the owner's named list; the likely-thin ids researched first |
| Warning wording drifts across 145 sheets | shared boxes only; C8 blocks own warning wording; `RED_FLAG_ROWS` pins each sheet's rows; at most 3 boxes |
| The back box's "Call 999" breaks the current pattern | add-only lint rule plus a supervisor decision, shown to the owner on the contact sheet |
| Copy drifts long or salesy | lint in the build; the medical-claim ban; one reviewer who judges voice against golden B |
| Sources go stale or are blocked (ACE 403 on and off, ExRx and NSCA 403) | a `checked` date on every source (no nulls); a yearly re-check; only readable sources carry a claim |
| Golden B fails HT5-A2 today (35 null source fields) | a golden-B source-field update before HT-5 (supervisor) |
| The HT-5 disclaimer text contradicts the owner's line | the supervisor corrects the HT-5 card; the lint pins the owner's line exactly |
| Token cost at 145 cards | families (94 full, 51 difference cards), a shared registry, one fetcher, critic and safety checker per batch (not per card), Sonnet for fetching, no duplicate reviewers |
| `exercises.json` disagrees with the How-to feel | `libraryDiff` with reasons; library changes decided separately |

---

## 10. Decisions

**Supervisor** (decide and log):
1. The card v2 schema and the repo folder `docs/research/howto/`.
2. C15 goes strict with agent-verification stamps.
3. The add-only lint extensions (section 4 table).
4. The back-pain box and its "Call 999" lint rule.
5. The two HT-5 fixes: null source fields, disclaimer text.
6. The release check in C6.
7. The `ids.ts` size decision.
8. The negative-control switch.

**Owner** (only he can):
1. Approve each batch's contact sheet (plates and, for tier A, the pictures first).
2. The named list of any library ids left out before the Play Store build.
3. The five-second tests on a real phone for new tier-A hand pairs.
4. Seeing the back-pain box wording.

Linking a custom exercise to a library guide isn't proposed. It would be new saved data.

---

## Appendix A: families (`fam.py`; parent: children)

Done parents (12 children): `machine_chest_press`: incline_machine_press · `lat_pulldown`: close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown · `seated_cable_row`: resistance_band_row · `pull_up`: chin_up · `hanging_leg_raise`: hanging_knee_raise · `dumbbell_lateral_raise`: cable_lateral_raise, dumbbell_front_raise · `barbell_back_squat`: smith_machine_squat · `leg_press`: horizontal_leg_press, leg_press_calf_raise.

New parents with children (26 parents, 39 children): `barbell_bench_press`: incline_barbell_bench_press, decline_bench_press, close_grip_bench_press, smith_machine_bench_press, smith_machine_incline_press · `dumbbell_bench_press`: incline_dumbbell_press · `dumbbell_shoulder_press`: arnold_press · `triceps_pushdown`: straight_bar_triceps_pushdown, single_arm_triceps_pushdown · `push_up`: incline_push_up, diamond_push_up · `mountain_climbers`: bear_crawl · `chest_supported_row`: t_bar_row · `barbell_row`: pendlay_row · `cable_fly`: low_to_high_cable_fly, high_to_low_cable_fly · `dumbbell_shrug`: barbell_shrug, smith_machine_shrug, cable_shrug · `romanian_deadlift`: dumbbell_romanian_deadlift, single_leg_romanian_deadlift · `conventional_deadlift`: sumo_deadlift · `walking_lunge`: reverse_lunge, forward_lunge · `dumbbell_biceps_curl`: alternating_dumbbell_curl · `hammer_curl`: cross_body_hammer_curl · `barbell_curl`: ez_bar_curl, reverse_curl · `cable_curl`: bayesian_cable_curl · `hack_squat`: pendulum_squat · `lying_leg_curl`: standing_leg_curl · `hip_abduction`: hip_adduction · `crunch`: reverse_crunch, bicycle_crunch · `plank`: side_plank · `hollow_body_hold`: v_up · `bodyweight_squat`: wall_sit · `jump_squat`: box_jump · `jumping_jacks`: high_knees.

New parents on their own (68): cable_chest_press, weighted_dip, barbell_overhead_press, smith_machine_shoulder_press, shoulder_press, rope_triceps_pushdown, overhead_cable_triceps_extension, dumbbell_overhead_triceps_extension, skull_crusher, ab_wheel_rollout, sled_push, sled_pull, pike_push_up, bench_dip, burpee, bird_dog, renegade_row, one_arm_dumbbell_row, landmine_row, face_pull, cable_external_rotation, upright_row, rear_delt_fly, cable_rear_delt_fly, bent_over_dumbbell_rear_delt_fly, resistance_band_pull_apart, inverted_row, assisted_pull_up, pec_fly, dumbbell_fly, dumbbell_pullover, straight_arm_pulldown, farmer_s_carry, bulgarian_split_squat, step_up, pallof_press, incline_dumbbell_curl, concentration_curl, preacher_curl, wrist_curl, front_squat, goblet_squat, hip_thrust, cable_crunch, russian_twist, leg_extension, seated_leg_curl, standing_calf_raise, seated_calf_raise, bodyweight_calf_raise, machine_crunch, machine_lateral_raise, machine_pullover, cable_kickback, resisted_hip_flexion, kettlebell_swing, battle_ropes, medicine_ball_slam, wall_ball, jump_rope, dead_bug, flutter_kicks, superman, back_extension, glute_bridge, bodyweight_lunge, bodyweight_split_squat, pistol_squat.

Totals: 102 families, 94 new parents, 51 children. A child whose card finds real differences becomes its own parent.
That costs one more full card and changes nothing else.

## Appendix B: tier lists (`tiers.py`)

**A, new (47):** ab_wheel_rollout arnold_press assisted_pull_up back_extension barbell_bench_press
barbell_overhead_press barbell_row barbell_shrug box_jump chin_up close_grip_bench_press conventional_deadlift
decline_bench_press dumbbell_bench_press dumbbell_fly dumbbell_overhead_triceps_extension dumbbell_pullover
dumbbell_romanian_deadlift dumbbell_shoulder_press farmer_s_carry front_squat goblet_squat hanging_knee_raise
hip_thrust incline_barbell_bench_press incline_dumbbell_press jump_squat kettlebell_swing landmine_row
medicine_ball_slam overhead_cable_triceps_extension pendlay_row pike_push_up pistol_squat renegade_row
romanian_deadlift shoulder_press single_leg_romanian_deadlift skull_crusher smith_machine_bench_press
smith_machine_incline_press smith_machine_shoulder_press smith_machine_squat sumo_deadlift t_bar_row wall_ball
weighted_dip.

**B, new (27):** bench_dip bicycle_crunch bulgarian_split_squat burpee cable_crunch cable_fly cable_shrug crunch
dumbbell_shrug forward_lunge hack_squat horizontal_leg_press jump_rope leg_press_calf_raise machine_crunch
machine_pullover pec_fly pendulum_squat reverse_lunge sled_pull sled_push smith_machine_shrug standing_calf_raise
step_up upright_row v_up walking_lunge.

**C, new (71):** all other new ids.

The tier rule is my judgement from the pattern, equipment and GA `overBody`. Each card can move its own id up a tier,
never down, without a supervisor note.
