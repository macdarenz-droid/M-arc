# W2 rulings, final (LR-30 to LR-35)

Final judge, supervisor, 2026-10-18. Research head `claude/libht-verify-w2` @ `5036283d1e69f617cc45d5b49689e9281f3d61f3`. Each draft had two reviews (consistency, effect). Where they disagreed I re-checked the source myself (curl 2026-10-18, desktop UA, every page HTTP 200; main @ `b99a9e25` for copy-lint, c2.ts, golden-B modules and the approved plates' tells).

**Numbering.** No ruling is rejected, so LR-30 to LR-35 stay as the findings file, the triage JSON and every packet already use them: LR-30 = W2-49, LR-31 = W2-51, LR-32 = W2-50, LR-33 = W2-52, LR-34 = W2-53, LR-35 = W2-54. LR-31 is the general rule and LR-32 applies it to one card, so the rule comes first. The brief's "LR-30..LR-35 = W2-49..W2-54" is a range, not a one-to-one order. Renumbering would move the strings in rankNotes ("LR-31 step 2"), in card notes ("LR-32 (W2-50 ...)") and in lib-9a-card.md:188 for no gain.

**Rules for this judgement:** keep approved golden material and correctly sourced lines; take the strict reading on safety; no guessing; nothing loosened. No approved plate, How-to sheet, golden-B string or `plate.mistake.firstKey` changes under any ruling below.

---

## LR-30 (W2-49): dumbbell kick-up way outs. AMENDED

**Ruling (RULINGS.md row):**

| LR-30 | W2-49 (W2A open question 1), supervisor 2026-10-18 | Dumbbell kick-up way outs. No conflict: c6 (BarBend, 'Dropping the Dumbbells') is the normal set-down after a seated press; c5 (Fitness Volt, 'Safety when training alone') is a stuck rep lying on a bench. c5 is shown as the bench failed-rep step "Failed rep: drop the dumbbells out to your sides." (MECH, WEAK: one coach source, flat bench, incline by inference; never the normal set-down, which is c4). "Never over the face" (content.md 5.2) and GA 3.4's candidate "never dropped out to the sides" have no quote, so no line says either until LIB-WAYOUT finds one (LR-3). variants.seated gets three c6 finish steps. Shared step text is shown setup copy (content.md 2.1; D-LIB5-SPLIT), so every step keeps golden B's caps: 12 words a step (SETUP_STEP_MAX_WORDS) and 5 steps a variant (SETUP_MAX_STEPS); both variants end at 5. A spotter way out for seated presses is sourced on the exercise cards (dumbbell_shoulder_press c7, arnold_press c10; ACE). No read source gives a seated failed-rep way out without a spotter, so the shared card shows none, and the owner's tier-A gap list keeps that gap. Source words quoted in notes keep the source's characters. |

**Why:**
- Both reviews re-fetched both sources. c6 covers only the end of the set ("once you're finished"). c5 covers a rep you cannot finish on a bench. Different moments, so there is no conflict, and c5 is a sourced way out (LR-3, content.md 5.2).
- Packet item 65's first step, "After the set, bring your knees up one at a time to catch the dumbbells.", is 15 words by main's `copy-lint.mjs` `words()`. The cap is 12 (`SETUP_STEP_MAX_WORDS`, copy-lint.mjs:41). D-LIB5-SPLIT lints shared-card shown fields at their kind; its Why says content.md 3.2's "no user copy" covers per-exercise cards only. So W2-41's "caps don't apply to cards" does not reach this file. As drafted, research would create a SPLIT hit that LIB-5 must send back.
- I counted the replacement "After the set, bring each knee up in turn to catch them." with main's `words()`: 12 words, no BANNED hit. It keeps the quote's verb ("bring your knees up one at a time"), so it is the closer of the two reviewers' wordings. The other new steps are 9, 8 and 9 words.
- The draft's "No source gives a failed-rep way out for the seated press" is wrong on the head. dumbbell_shoulder_press c7 and arnold_press c10 quote ACE's spotter ("The spotter should stand behind you ... to support you as needed"), and arnold_press shows it in setup[4]. Only the no-spotter case is unsourced, and that narrower gap is what the owner's list should keep.
- The head's c6 quote has "There’s" (U+2019). Packet item 68's note had a straight apostrophe.

**Why nothing is loosened:** no step, cap or quote is removed. One shown step is shortened to fit the existing cap, from the same quote. The gap record is narrowed to the true gap. No unsourced "never over the face" line is added (LR-3). No card of the 8 refers to this shared card.

**Packet edits:**
- W2A #65 CHANGE: in the appended `variants.seated.steps`, the first entry's text becomes "After the set, bring each knee up in turn to catch them." (claim c6). The other two entries and the order stay. Its why gains: "each step ≤12 words (SETUP_STEP_MAX_WORDS; D-LIB5-SPLIT)".
- W2A #67 CHANGE: the new gaps[1] value becomes "Seated set-down is sourced by one coach source (c6, WEAK; applied to arnold_press by inference) and shown as the seated finish steps (LR-30). A spotter way out for seated presses is sourced on the exercise cards (dumbbell_shoulder_press c7, arnold_press c10; ACE). No read source gives a seated failed-rep way out without a spotter, so none is shown here (LR-3)."
- W2A #68 CHANGE: in the new notes[5] value, "There's" becomes "There’s" (U+2019, as in the source and quotes/shared-dumbbell-kickup.json).
- W2A #62, #63, #64, #66, #69, #70: unchanged.

**Supervisor edits:** the RULINGS.md LR-30 row takes the text above (w2-findings.md supervisor edit 1). In w2-findings.md: in the W2-49 rulings row, "no seated failed-rep way out is sourced, so none is shown" becomes "no seated failed-rep way out without a spotter is sourced, so none is shown (the spotter way out is on dumbbell_shoulder_press c7 and arnold_press c10)". Conflict 6: "(5 in all, within the limit)" becomes "(5 in all, within the 5-step limit; each step ≤12 words)". Open point e: "keep the seated failed-rep gap" becomes "keep the seated failed-rep gap for training without a spotter".

---

## LR-31 (W2-51): top fault when no source measures frequency. AMENDED

**Ruling (RULINGS.md row):**

| LR-31 | W2-51, supervisor 2026-10-18 | Top fault when no source measures how often faults happen (plate.mistake; handlingMistakes[0]). Candidates: a fault is a body or equipment position or movement during the set (CARD-V2:36). Setup and equipment choices (seat or pad setting, a worn or loose band, the load or assistance chosen) and muscle-activity findings are not candidates; a muscle-use finding stays a feel row (lat_pulldown c18). Step 1, frequency: a verbatim quote from any read source of the card says a candidate fault of this exercise, or an injury it names as caused by that fault, happens commonly, frequently, often or usually, or that most or many people (lifters, beginners) make it. These are not frequency words: a 'common mistakes' heading, or a list sentence, read onto one item; 'tend', 'tendency', 'traditionally', 'can', 'may', 'easy to', 'easily'; a statement about all training, another exercise, a muscle's activity, a load, a grip or a stance (barbell_back_squat c25, seated_cable_row c15, machine_chest_press c14). The owner's fetcher scans every read source of the card for these words, and the rankNote quotes each hit about a fault or injury with why it does or does not count. If several faults pass step 1, step 2's order decides among them. Step 2, stated harm: else a named fault (plate.mistake, handlingMistakes or a source's mistakes list) that a quote ties to harm (injury, pain, stress, discomfort or a study-linked injury sign), including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm (seated_cable_row c9). Ties go to the one on a common-mistakes list, then the one more sources tie to harm, then the one sourced directly (not MECH/WEAK), then the earlier on a list that names both, then step 3's count. Step 3, lists: else the first fault on a common-mistakes list (with several lists: one written for this exercise, then the anchor source's); with no list, the fault the most read sources tell the lifter to avoid; when no source names a fault, the break of the instruction the most read sources give, said so in why. Still tied: the owner records the tie in rankNote and the supervisor rules before the TOPFAULT pass; it is never guessed. drawable is true when the census view shows the top fault. A fault whose only sign is speed (dropping fast, rushing, letting the load snap back) is never drawable; a fault with a still sign (locked knees, a rounded back) is drawable even when speed causes it. Otherwise drawable is false, plate.mistake names the next fault by the same steps, and handlingMistakes[0] stays the top fault. Every plate.mistake carries rankNote: 'No source measures how often each fault happens.' plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. rankNote is never shown (LR-28). For the 8 this is research only: no approved plate, How-to copy or golden-B line changes (D-LIB5-CARDS8); on leg_press it replaces the8.md Fix round 0's list-order call. Rollout: the 8, single_arm_lat_pulldown (LR-32) and the other 13 LB1 cards in W2 fix round 1, before the merged head is named for LIB-9a's Do 6 re-copy; a changed pick or drawable re-runs the CARD FIELDS verifier for that card (13 Q1(b)). Every other card, including the 34 whose rankNote predates LR-31, before its batch's D-LIB9-CARDFIELDS fields are written (tracker LIB-TOPRANK); until then a card keeps its pick and is not failed for lacking rankNote. D-LIB5-TOPFAULT and lib4-cards 13 Q1 are unchanged; the TOPFAULT comment names a head with these edits. Expected: the lat_pulldown, barbell_back_squat and dumbbell_lateral_raise picks match none of their approved plates' Mistake tells, so the blind pass may stop them and F7 stays raised for them. |

**Why:**
- Both reviews found the same three faults in the draft. Step 1 never said which words count, while the 8's cards hold "often" (lat_pulldown c18, seated_cable_row c15) and "natural tendency" (pull_up c23). "Every plate.mistake carries rankNote" had no rollout, and 108 cards would fail it on the day it lands. The rule was never run on the LB1 cards whose topFault LIB-9a writes from the card.
- The reviews disagreed on two words. On "tendency" and "traditionally" I take the effect lens's closed list. I read both sources.
  - pull_up c23 (Catalyst, verbatim): "The natural tendency is to round the back as you near the bar, but it’s important to keep it extended instead to fully engage all of the back musculature." It names what the movement pulls a lifter toward, and its reason is muscle use. It gives no share of lifters and no rate.
  - ACE's lateral-raise sentence: "As this exercise traditionally positions the arms into internal rotation during the lift ...". It names how the exercise is usually taught, not a fault that lifters make.
  - A closed list makes step 1 checkable; counting these two words would turn step 1 on a reading of each word. This reading also keeps the approved pull_up plate's Mistake ('kick') in agreement with its card, which the brief says to prefer. The rule is not bent for the plates: the lat_pulldown, squat and lateral-raise picks still differ from their plates' tells (swing/shrug; hips/chest/drift; shrug/dip/thumbs on main's technical-plates.html).
- On harm, I take the consistency lens's avoidance clause. The draft already counted seated_cable_row c9 ("reduce unnecessary stresses into your low back by avoiding any backwards lean") as harm. The rule now says so, and the same reading then applies to dumbbell_lateral_raise c5 ("the slight external rotation ... may reduce potential impingement"), which the draft's rankNote missed. Counting more faults as harm-tied is the strict reading on safety. The tie chain now ends at the supervisor, not in an undefined "list order".
- I re-checked the effect lens's LB1 results by curl on bullbarfit.com. "How to Use an Assisted Pull-Up Machine Without Hurting Yourself", section 4, says: "Most people let the machine pull them back up too quickly." That is a step-1 hit ('most people') for a fault whose only sign is speed. The same page's "Common errors" list runs "Starting with bent arms ... Stopping halfway up ... Dropping too fast at the bottom (shoulder impingement risk)". The beginner page's list opens with "The Partial Rep". So assisted_pull_up's top fault is the fast lowering, drawable becomes false, and the plate keeps partial reps.
  - "I see lifters every week ... bouncing through partial reps" states how often the author sees it, not a share of lifters, so it is set aside.
  - "Most beginners set it too high" is a choice of assistance, not a fault.
  - underhand_lat_pulldown: only the past-end pull has a quote tying it to harm (c11 ACE, "places additiomnal stresses into the shoulder joint", MECH). Momentum (c7, "so that the correct muscles are engaged") and the fast return (c9) state none. So its plate.mistake becomes the past-end pull; the side view draws it, and drawable stays true.
- Speed: a Mistake is a still pose, so a fault seen only as speed cannot be drawn (CARD-V2:36's intent). On the head, horizontal_leg_press and leg_press_calf_raise draw locked knees and crunch draws a tipped pelvis, so the still-sign clause keeps their picks drawable.
- Leg press: both reviews accept the flip to drawable:true. Yessis c7 ("commonly cause low back injury because of the rounding") is a step-1 hit. NASM's list opens with "Using excessive weight", a load choice and now not a candidate.

**Why nothing is loosened:** F7, the blind TOPFAULT pass, 13 Q1's two checks and D-LIB5-TOPFAULT's stop rules are unchanged. The amendment only closes open wording, adds a source scan, adds a supervisor stop for ties, and adds a rollout that keeps any card from being judged by an unrun rule. No approved plate or copy changes. The assisted_pull_up reorder puts an impingement-risk fault first, which strengthens a safety line. A raised F7 on assisted_pull_up still needs the owner's yes (plan 3.3).

**Packet edits, THE8** (judgement steps on Opus; THE8 gets no plate, tell or firstKey text, and w2-findings open point g stays out of the packet; D-LIB5-CARDS8):
- NEW header step [LR-31 scan]: the fetcher scans every read source of each of the 8 for step 1's words and for harm quotes about a named fault. Each hit is quoted in that card's rankNote with why it counts or not. If the scan changes a pick or drawable, report it in FIXED; no plate or copy changes.
- #48 pull_up rankNote CHANGE to: "No source measures how often each fault happens. LR-31 step 3: no frequency word for a pull-up fault (Catalyst's \"natural tendency\" to round the back near the bar, c23, is not one under LR-31), and no quote ties one of NASM's listed faults to harm. Kipping and momentum come first in NASM's common-faults list (c10); NASM's \"Discourage the common faults\" is a list sentence, not a ranking."
- #70 lat_pulldown rankNote CHANGE to: "No source measures how often each fault happens. LR-31 step 1 has no candidate: Snyder's \"often rely on the elbow flexors\" (c18) is muscle use, which stays a feel row. LR-31 step 2: behind the neck is on the NSCA common-errors list and a study ties it to signs of front-shoulder instability (c9, c10). The past-end pull also has stated harm (c7) but is on no common-errors list."
- #80 seated_cable_row rankNote CHANGE to: "No source measures how often each fault happens. LR-31 step 2: no frequency word for a row fault (c15's \"often\" is upper-trapezius activity across resistance exercises). Two NSCA-listed errors have stated harm, one source each, both applied by reasoning: leaning back (c9, avoiding it reduces low-back stress) and bending forward on the return (c16). So the NSCA list order decides: jerking or leaning back is first (c6)."
- #57 hanging_leg_raise rankNote CHANGE: "LR-31 step 3: no frequency word," becomes "LR-31 step 3: no frequency word (Wikipedia's \"easiest to use bad form on\" and \"may use a swinging motion\", c7, say what can happen, not how often),". The rest is unchanged.
- #109 machine_chest_press rankNote CHANGE: append " Nance's \"many exercise disciplines\" (c14) is about wrist loading in other exercises."
- #115 dumbbell_lateral_raise rankNote CHANGE (expected text; THE8 confirms it by the scan): "No source measures how often each fault happens. LR-31 step 1: no frequency word for a lateral-raise fault (ACE's \"this exercise traditionally positions the arms into internal rotation\" says how the exercise is taught, not how often lifters err). LR-31 step 2: two named faults are tied to harm, raising above 90° (Kolber 2014, signs of shoulder impingement, association only, c13) and arms turned in (ACE: the slight external rotation \"may reduce potential impingement\", c5). Neither is on a common-mistakes list; one harm source each; both sourced directly; no list names both. Step 3's count decides: Kolber tells lifters to avoid going beyond 90° (c13)." If step 3's count ties, THE8 writes the tie and stops dumbbell_lateral_raise for a ruling. DROP the consistency lens's c5 quote replacement (it is not needed under this rule, and the card's quote is verbatim).
- #20 squat, #87, #88, #89, #90 leg_press: unchanged, unless the scan or the amended tie order changes them (then report in FIXED).
- #34 the8.md Fix round 1 CHANGE: "All picks are unchanged." becomes "Picks are unchanged under LR-31 as ruled, each re-run with a scan of every read source." The LR-31/LR-33 quote line changes as given under LR-33.

**Packet edits, W2A** (new items; judgement work on Opus; routed by name under LR-31):
- NEW assisted_pull_up `plate.mistake.drawable`: true becomes false.
- NEW assisted_pull_up `plate.mistake.why`: "Most people let the machine pull them back up too quickly, and dropping too fast at the bottom is named a shoulder impingement risk (c16). A fault seen only as speed cannot be drawn in a still plate, so the plate draws partial reps, first on the manufacturer's common-mistakes list (c8). Frequency is not measured."
- NEW assisted_pull_up `plate.mistake.rankNote`: "No source measures how often each fault happens. LR-31 step 1: \"Most people let the machine pull them back up too quickly\" (c16), a speed fault, so drawable is false. The drawn fault, by the same steps: partial reps, first on the beginner guide's common-mistakes list (c8). Set aside: \"I see lifters every week ... bouncing through partial reps\" says how often the author sees it, not how many lifters do it; \"Most beginners set it too high\" is the assistance chosen, not a fault." (The two set-aside phrases are on bullbar-assist-safety; the fetcher confirms them.)
- NEW assisted_pull_up `handlingMistakes`: reorder to [fast drop (c16), stopping short (c8, c5), swinging (c5)], text unchanged. `plate.mistake.what` and `.claim` are unchanged.
- NEW [LR-31 step] scan, pick, drawable and rankNote on shoulder_press, chin_up (expected: step 3, c6) and hanging_knee_raise (expected: step 3). Report any change.

**Packet edits, HELPER** (new items; judgement work on Opus; routed by name):
- NEW underhand_lat_pulldown `plate.mistake.what`: "Pulling the bar further down after it passes just below the chin, so the elbows start moving backwards." (words from c8, c6 and c11).
- NEW underhand_lat_pulldown `plate.mistake.claim`: ["c6", "c8", "c11"].
- NEW underhand_lat_pulldown `plate.mistake.why`: "The coach source says pulling the bar further down lets the forearms and deltoids take over (c8); ACE says pulling on once the elbows start moving back adds stress to the shoulder joint (c11, MECH: written for the overhand bar). Frequency is not measured."
- NEW underhand_lat_pulldown `plate.mistake.drawable`: true (unchanged value).
- NEW underhand_lat_pulldown `plate.mistake.rankNote`: "No source measures how often each fault happens. LR-31 step 1: no frequency word for an underhand-pulldown fault. LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c11, MECH); c8 names a muscle shift, not harm. Momentum (c7) and the fast return (c9) state no harm."
- NEW underhand_lat_pulldown `handlingMistakes`: reorder to [too far (c8, c6), rocking (c7), fast return (c9)], text unchanged.
- NEW [LR-31 step] scan, pick, drawable and rankNote on close_grip_pulldown, straight_arm_pulldown, chest_supported_row, incline_machine_press, horizontal_leg_press, leg_press_calf_raise, inverted_row and resistance_band_row (opened by name). Expected: picks unchanged. leg_press_calf_raise: its rankNote names c5's "there is a tendency to fully straighten the legs" as set aside; plate.mistake.what's "often from going too fast" has no frequency quote behind it (c5 says 'tendency'), so "often" is dropped, for example "Knees snap straight and lock while pushing the platform, which fast reps tend to cause."; the locked knees are tied to harm (c6) and are a still sign, so the pick and drawable:true stay. resistance_band_row's worn-band item is an equipment check, not a candidate. inverted_row takes step 3's last fallback. Report any change.

**Supervisor edits:**
- RULINGS.md LR-31 row: the text above.
- CARD-V2 :35: as drafted (`"rankNote": "the LR-31 step that picked the top fault, with claim ids",`).
- CARD-V2 rules bullet, new text: "- The top fault follows LR-31 on every card, on LR-31's rollout. `plate.mistake.rankNote` records the step, the claim ids and each frequency or harm quote set aside; `handlingMistakes[0]` is the top fault; a fault seen only as speed is never drawable. `rankNote` is research data, never shown (LR-28)."
- Relay TASKS.md, new item: "LIB-TOPRANK (research, later pass): apply LR-31 to every card outside the 8 and LB1, including the 34 whose rankNote predates LR-31 (alternating_dumbbell_curl and barbell_curl rank by the parent's drawn fault, against content.md:146). For each: scan the read sources, set the top fault, drawable and handlingMistakes[0], and write the rankNote, before the batch's D-LIB9-CARDFIELDS fields are written. A changed pick re-runs that batch's CARD FIELDS verifier."
- w2-findings.md: in the W2-51 row, "all picks unchanged" becomes "picks unchanged on the 8; LB1: assisted_pull_up drawable false (step 1, speed), underhand_lat_pulldown plate.mistake is the past-end pull (step 2)". Open point g adds dumbbell_lateral_raise.
- lib-9a-card.md:188 and plan 3.1:85 / 3.3:303: held. They are applied once, after the recheck, with LR-32 (see LR-32).
- To LIB-9a on #245, when the re-copy head is named: underhand_lat_pulldown's Mistake spec must draw the past-end pull (first tell key 'past'). assisted_pull_up's drawable:false topFault needs a key for the fast lowering in the ruled fault-to-key map (13 Q1(a)).

---

## LR-32 (W2-50): single_arm_lat_pulldown stays drawable. AMENDED (precision only)

**Ruling (RULINGS.md row):**

| LR-32 | lib4-cards 13 Q1(b), W2-50, supervisor 2026-10-18 | single_arm_lat_pulldown: no source measures how often each fault happens. LR-31 step 1 finds no frequency word for a fault: BarBend's 'perfectly common' is about one side being stronger, and its 'usually' and 'frequently' and PureGym's 'typically' are about muscles, athletes or the load. Step 2: the past-end pull (c10, c13) is the top fault, the only named fault a quote ties to harm. BarBend's 'Going Too Heavy' is a load choice and its 'Torso Twisting' (with c11's lean) states no harm; the twist line (c6) is a PureGym tip. If ACE's closing stress line is read onto the backward lean, the past-end pull still wins on harm sources (c10, c13). Step 3 gives the same fault (first in BarBend's common-mistakes list). The census view (side) shows it, so drawable stays true. handlingMistakes is reordered (past-end, twist, lean) and plate.mistake gets a rankNote. census.json's note ('defining fault is a sideways lean') and census.md 4.2 are the dated 2026-09-30 input, with no source for that fault. They are not edited, and this row wins for this id. Q1(c) follows once, after the W2 recheck, together with LR-31's LB1 result: LIB-9a Do 1's expected-flag line, plan 3.1:85 and plan 3.3:303 change as LR-31 and this row give. LIB-9a re-copies this card under Do 6 and A13 re-verifies it. No Do 7 evidence for single_arm counts before that. |

**Why:** the evidence holds. I re-fetched BarBend and PureGym by curl and scanned both for step 1's words: the only hits are the ones the row names. The draft's rankNote filed step 1's finding under "step 2". The draft row did not record step 1's result, or that step 3 picks the same fault. The pick does not depend on the harm test. The census input is recorded as superseded and is not edited. Q1(c)'s three edits must wait for LR-31's verified LB1 result, because that result probably adds F7 on assisted_pull_up. Applying them now would make lib-9a-card.md:188 wrong ("no F7").

**Why nothing is loosened:** F7 still compares the drawn fault with the card's top fault. The expected flag list changes only after verified research, as 13 Q1(c) foresees. No safety line, sourced line or approved artifact changes.

**Packet edits:**
- HELPER #6 CHANGE, rankNote new value: "No source measures how often each fault happens. LR-31 step 1: no frequency word for a fault (BarBend's \"perfectly common\" is about one side being stronger; \"usually\" and \"frequently\" there, and PureGym's \"typically\", are about muscles, athletes or the load). LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c10; ACE c13, two-arm pulldown, MECH), and it is first in BarBend's common-mistakes list. BarBend's Going Too Heavy (a load choice) and Torso Twisting with the lean (c11), and the PureGym twist tip (c6), state no harm; if ACE's closing stress line is read onto the backward lean, the past-end pull still wins on harm sources (c10, c13)."
- HELPER #1 to #5 and #7: unchanged.

**Supervisor edits:**
- RULINGS.md LR-32 row: the text above.
- Supervisor edits 3 and 4 (lib-9a-card.md:188; LIBRARY-HOWTO-ARCHITECTURE.md:85 and :303) are HELD. After the W2 recheck, apply them once, with LR-31's verified LB1 result. Old strings, checked today: lib-9a-card.md:188 on `claude/sup-lib4-cards` @ `d1ee2989` (it has moved since `279cf08f`; the string occurs once), and the plan on `claude/howto-options` @ `4a9fd865`.
  - If assisted_pull_up is verified drawable:false (expected):
    - :188 becomes "F7 on assisted_pull_up (drawable:false, LR-31: its top fault, the fast lowering, is a speed fault), no F7 on single_arm_lat_pulldown (LR-32), and any other flag with its reason;".
    - :85 old "(single-arm pulldown, one-arm row, renegade row, Pallof press, bird dog, single-leg RDL):" becomes "(assisted pull-up, one-arm row, renegade row, Pallof press, bird dog, single-leg RDL):".
    - :86 old "their top fault needs roll or yaw." becomes "their top fault needs roll or yaw, or is seen only as speed, which no still pose shows." (The old string occurs once.)
    - :303 keeps "6".
  - Otherwise, the drafted texts apply: :188 "no F7 (single_arm_lat_pulldown keeps drawable:true, LR-32), and any other flag with its reason;", :85 without single-arm pulldown, :303 "5".
- When naming LIB-9a's re-copy head on #245, the supervisor states that Q1(b) is answered by LR-32 (expected F7 for single_arm: none). LIB-9a updates its own DESIGN.md F7 lines (section 3 :74-78, section 9 item 1 :196) in that re-copy commit.

---

## LR-33 (W2-52): a pause with no seconds. AMENDED

**Ruling (RULINGS.md row):**

| LR-33 | W2-52, supervisor 2026-10-18 | A pause with no seconds. plate.tempo.pause is the pause right after the concentric (lifting) phase, where its quote places it (lib4-cards 13 Q3; D-LIB9-FACTPOSE). When a quote on the card asks for a momentary or brief pause there and no source on the card gives its seconds, pause is 1. A tempo claim tagged WEAK, holding that pause quote, names the 1 s as a drawing convention (as chin_up c8, lat_pulldown c16 and seated_cable_row c12 do; D-W2-TEMPO), and plate.tempo.claim cites it. If the pause quote's claim also backs a shown line, a separate tempo claim carries a copy of the verified quote, so the shown line keeps its tags. pause 0 means no quote on the card asks for a pause at that point; close_grip_pulldown and underhand_lat_pulldown keep 0. null is not used for such a pause on a card whose up and down are numbers. A card with no tempo seconds at all keeps null (jump_squat, front_squat). A pause at another point of the rep is never written in this field: tempo.text or notes name it, with its sourced seconds if any (leg_press bottom: optional 1 s, c15). Sourced seconds are never replaced by the convention (resisted_hip_flexion). Under D-LIB5-TEMPO8 point 2, a spec Hold takes this field as other phases take up and down. The 8's map, including leg_press's top 'Rest' and bottom 'Pause', stays the supervisor's call on #244, and a card value is never changed to match a spec. LIB-TEMPO takes the pause-1 cards whose claims do not yet name the 1 s as a convention, and overhead_cable_triceps_extension, whose pause 1 comes from a bottom-stretch quote (c13). LIB-TEMPO's edits to LB1 cards land before the LIB-9a re-copy head is named, or that re-copy re-runs the verifier for them. |

**Why:**
- Both reviews accept the value and the four cards. leg_press's 0 contradicted its own c24 (ACE Step 4, "Pause momentarily, then slowly return"), and Yessis says "pause momentarily in the end position" (re-fetched by both reviews). machine_chest_press's null left a sourced pause undrawn.
- The reviews split on where the convention is named. I take the claim-level reading.
  - 13 Q3 allows LB1's convention seconds because "the claims name [them] as such" (chin_up c8, hanging_knee_raise c9, inverted_row c6, assisted_pull_up c9).
  - D-LIB9-CARDFIELDS says every value names the claim whose verbatim quote states it, and the planted-error verifier checks values against claims.
  - On the head, the 8's own lat_pulldown c16 and seated_cable_row c12 already work this way.
  - tempo.text is not a claim, and CARD-V2 does not require it. So the effect lens's "tempo.text, notes or claim" would let two of the 8 carry a value that no claim names. That would also let unnamed cards skip LIB-TEMPO.
  - The pause claims c7 (machine_chest_press, backs posture[4]) and c24 (leg_press, backs posture[2]) must keep their CONSENSUS tags. So each card gets a new [CONSENSUS, WEAK] tempo claim that copies its verified ACE quote. 26 head cards already hold one source quote in two claims (for example seated_cable_row nsca-low-row in c5 and c12), so this is an existing pattern.
- I take the effect lens's bounds, checked on the head.
  - overhead_cable_triceps_extension's pause 1 cites c13, whose quote is "Pause briefly at the bottom to feel the stretch". That is the end of the lowering, so it goes to LIB-TEMPO.
  - close_grip_pulldown and underhand_lat_pulldown quote no pause and hold 0, and Q3 mutation (iv) targets close_grip's 0.
  - jump_squat and front_squat have all-null tempo.
  - resisted_hip_flexion's 2 s is sourced (c15).
- The LB1 scan of pause-1 cards found exactly one whose tempo claim does not name the convention: single_arm_lat_pulldown c14 ("with a brief pause at the bottom", BarBend "pause for a beat"). HELPER already edits that card this round, so it is fixed now. That avoids a verifier re-run after the LIB-9a copy.

**Why nothing is loosened:** H6's exact tempo equality and TEMPO8's stop rule are unchanged. All four of the 8's cards still stop at H6.tempo on the concentric phase (each spec gives 1 s against up 2). No spec, plate or exemption changes. No sourced line or tag is removed. The convention is named where the verifier reads it.

**Packet edits, THE8:**
- #81, #91, #110: unchanged.
- NEW machine_chest_press claims, append after c15: {"id":"c16","text":"Tempo: ACE asks for a momentary pause at full press and gives no seconds, so the 1 s pause on the plate is a drawing convention.","tags":["CONSENSUS","WEAK"],"sources":["ace-chest-press"],"quotes":[{"source":"ace-chest-press","text":"Pause momentarily then gently allow your elbows to flex (bend) in a slow, controlled manner while returning the bar back towards the starting position.","where":"Step 3"}]}
- NEW machine_chest_press `plate.tempo.claim`: ["c9","c7"] becomes ["c9","c16"]. c7 stays on posture[4] with its tags.
- #111 CHANGE, new text: "Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds; the 1 s pause is a drawing convention (c16; LR-33)."
- #112 CHANGE, new substring: "The 1 s pause is a drawing convention: ACE says \"pause momentarily\" with no seconds (c16; LR-33)."
- NEW [fetcher] quotes/machine_chest_press.json, after the c15 entries: {"claim":"c16","source":"ace-chest-press","quote":"Pause momentarily then gently allow your elbows to flex (bend) in a slow, controlled manner while returning the bar back towards the starting position.","status":"verbatim","closest":null}
- NEW leg_press claims, append after c24: {"id":"c25","text":"Tempo: ACE asks for a momentary pause at the top and gives no seconds, so the 1 s top pause on the plate is a drawing convention.","tags":["CONSENSUS","WEAK"],"sources":["ace-leg-press"],"quotes":[{"source":"ace-leg-press","text":"Pause momentarily, then slowly return to your starting position by flexing (bending) the hips and knees, and allowing the resistance plate to move towards you in a slow, controlled manner.","where":"Step 4"}]}
- #92 CHANGE: new value ["c15","c25"] (was ["c15","c24"]). c24 stays on posture[2] with its tags.
- #93 CHANGE, new text: "2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription. ACE asks for a momentary pause at the top and gives no seconds; the 1 s top pause is a drawing convention (c25; LR-33). An optional one-second pause at the bottom is allowed (c15)."
- #94 CHANGE, new substring: "the 1 s top pause is a drawing convention for ACE's \"pause momentarily\" (c25; LR-33), and the one-second bottom pause is optional (c15)."
- NEW [fetcher] quotes/leg_press.json, after the c24 entries: {"claim":"c25","source":"ace-leg-press","quote":"Pause momentarily, then slowly return to your starting position by flexing (bending) the hips and knees, and allowing the resistance plate to move towards you in a slow, controlled manner.","status":"verbatim","closest":null}
- #34 CHANGE:
  - Pause bullet: "(top pause, c24 added to tempo.claim)" becomes "(top pause); new tempo claims leg_press c25 and machine_chest_press c16 [CONSENSUS, WEAK] name the 1 s, each a copy of the verified ACE quote in c24 and c7".
  - "LR-31 and LR-33 added or changed no quote." becomes "LR-31 added or changed no quote; LR-33's c16 and c25 copy verified ACE quotes (c7, c24)."
  - Fetcher totals: leg_press 63, machine_chest_press 25.
- Packet header: expected totals become leg_press 63 and machine_chest_press 25 (were 62 and 24).

**Packet edits, HELPER:**
- NEW single_arm_lat_pulldown `claims[id=c14].text`: append " BarBend gives no seconds for the pause, so the 1 s on the plate is a drawing convention (LR-33)." The tags (WEAK) and quotes are unchanged.

**Supervisor edits:**
- RULINGS.md LR-33 row: the text above.
- w2-findings.md:
  - W2-52 rulings row: "A pause with no seconds after the concentric phase is 1 s, named a drawing convention in a WEAK tempo claim; 0 means no quote on the card asks for a pause there; null is never used for such a pause on a card with numeric up/down."
  - Conflict merge 8: "the claim list is the same in both" becomes "tempo.claim is [c15, c25], not W2-26's [c15, c24]".
  - Conflict merge 11 follows #34.
  - Recheck: THE8 [fetcher] items go from 38 to 40.
- Re-run the dry run (card-to-quotes match, no orphan source, all quotes 50 words or fewer).
- LIB-TEMPO tracker adds overhead_cable_triceps_extension (pause 1 from the c13 bottom-stretch quote).

---

## LR-34 (W2-53): the parent card governs inherited lines (amends LR-8). AMENDED

**Ruling (RULINGS.md row):**

| LR-34 | W2-53, supervisor 2026-10-18 (amends LR-8) | Once a parent has a card on `claude/libht-research`, a child's inherited lines are checked against that card, and against a shared card on the same head that has passed verification and whose `appliesTo` lists the child (LR-29; for example selector-pin, get-in-out, unrack-rerack), and against nothing else. Each check names the head sha and the claim ids it relies on. It counts once the parent card passes verification and re-runs when a claim or field it relies on changes; until then the child's inherited lines are pending. Golden-B sheets and grip-and-feel research cite sources in free text only, so they are a source map, never a citation (the8.md:7; CARD-V2). An inherit entry stays only where the parent's shipped How-to has a string for it whose every clause that card or shared card supports, so the D-LIB5-FAMILY comparator can map it `===`. D-LIB5-FAMILY item 6 is unchanged, and the map stays the supervisor's ruling on LIB-9's PR. Any other inherited line takes the first of these ways out that works. (1) The child's own claim: a verbatim quote fetched by curl from a source the map names, or from any other source, tagged MECH or WEAK when it is written for another exercise, and checked by the fetcher. (2) A drawing convention in notes, under LR-4 extended to hand contact and grip width, only for a pure drawing choice and never for a safety line. (3) The line leaves the card and is listed in gaps; a safety line removed from a tier-A card joins the owner's tier-A gap list (LR-3). Way (1) is tried first for every failed line that is shown or carries safety; a field that is never shown (LR-28) may go straight to (2) or (3). A feel row, redFlag, risk line or content.md 5.2 tier-A point never leaves a card under LR-34 without a supervisor ruling: if way (1) finds no quote, the line and the inherit entry it rests on stay as on the head, a note records the failed check, and the card stops for a ruling. No line is kept on golden-B alone. LR-34 never edits a parent card, plate or How-to sheet. The 8's locked sheets keep their lines, and a line an approved sheet shows that its own card does not source is listed in the8.md only. LR-8's golden clause now covers only golden exercises with no card. Before its plate is drawn, front_squat's tier-A unrack and walk-out lines are each checked against whichever of cards/barbell_back_squat.json and shared/unrack-rerack.json sources that step; where the two disagree, the line fails until the supervisor rules. |

**Why:**
- Both reviews accept the core: the parent card is the verbatim record, golden-B carries free-text citations only, and LR-8's golden clause existed only because the parents had no card. W2-4's refutation was right under LR-8 as it stood, and LR-34 changes that rule from now on.
- Shared cards: "that card only" would fail correctly sourced safety lines. close_grip_pulldown, single_arm_lat_pulldown and underhand_lat_pulldown all inherit "setup: weight set and pin pushed all the way in". cards/lat_pulldown.json has no pin claim, but shared/selector-pin.json c1 sources it and lists all three in `appliesTo` (checked on the head). get-in-out lists seven of these children. The draft's own front_squat sentence already checks against a shared card.
- Ways out in order, fetched quote first. I re-fetched bullbar-calluses, the source the approved pull_up sheet cites, by curl. It says, word for word:
  - "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm."
  - "For dead hangs or carries: shoulder-width, palms facing away (pronated grip)."
  - "Pull your shoulder blades down and back (think \"proud chest\")."
  - "Use chalk (magnesium carbonate) on your hands before every set."
  - Its "Keep a slight bend in your elbows—never lock out fully" conflicts with HKR c2 ("Hang with your arms fully extended").
  So the drafted removals skip the ruling's own first way out.
- Whole-string rule: I read main's hanging_leg_raise.howto.mjs. Its only get-in string is "Step up from a box, and check it's clear of your legs.", and the8.md:138 lists box clearance as unsourced. HKR's kept "jump, or step up on a low stool" entry has no whole parent string, so the comparator could never pass it. The child's own c1 (Yessis knee-raise page, verbatim) states the line, and setup[0] cites c1.
- Safety, strict reading: under the drafted fallback, HKR (tier A) would lose feel.rows[3] and the 'shoulder' redFlag, its only live warning link (the 'back' row waits on LR-28's box). content.md 5.2 requires that link. So a stop replaces removal.
- Corrections: the8.md:138 lists the width, straps and box clearance only. The parent's grip.handContact says "Not sourced on this card", and chalk and the active hang are not on the parent card. pull_up's card says nothing about chalk (its notes[2] covers hand contact and bar height). LR-8's "tier-A" and "before its plate is drawn" gates for front_squat are kept.
- Timing: THE8 changes parent claims in this same round (lat_pulldown c11; barbell_back_squat c14, c15, c23, c26; leg_press setup merge, W2-24). So checks record claim ids, not setup indexes, and the recheck re-confirms them on the head after THE8's FIXED push.

**Why nothing is loosened:** every check is fail-closed. A line stays only on a verified card's quote, the comparator's `===` rule is unchanged, and no safety line, feel row or tier-A point can leave without a ruling. Removing an unsourced line keeps LR-3. No approved sheet, plate or card of the 8 changes. New claims go in the child cards only.

**Packet edits, W2A:**
- #19 shoulder_press CHANGE: "on head 5036283d" is kept. Add: record holds or fails per inherit entry by parent claim id (or the shared card's id); try way (1) first for shown and safety lines; never route a safety line to (2); apply the stop rule to a feel row, redFlag, risk line or tier-A point; record per kept entry the parent's shipped-sheet path it restates, or "no whole string".
- #29 chin_up inherit CHANGE to [LR-34 step]: keep an entry only if the parent's shipped string for it holds whole on cards/pull_up.json. Expected array as drafted (thumb, hand-zoom rule). An entry with no whole string leaves, and its line is cited to chin_up's own claims (c1, c21 for the thumb).
- #30, #32 (chin_up hand contact), #44, #45, #46 (HKR width, hand contact, zoom) CHANGE to [LR-34 step][fetcher], way (1) first, from bullbar-calluses (https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses). If the fetcher confirms the quote, add it as a new claim on that card, tagged WEAK and MECH (a callus blog, written for a palms-away hang).
  - Hand contact: grip.handContact cites the new claim. chin_up zooms[0].right becomes "Palm facing the face, bar just below the base of the fingers, thumb wrapped around the bar, wrist straight in line with the forearm." HKR zooms[0].right becomes "Overhand, bar just below the base of the fingers, thumb wrapped, wrist not curled." Each adds the new claim to its claim list.
  - HKR grip.width: the same route with the "For dead hangs or carries: shoulder-width, palms facing away" quote.
  - If the fetcher does not confirm, the drafted text applies (LR-4 drawing convention).
- #33 chin_up notes[0] CHANGE: the "bar fixed and dry, chalk" and "bar height" entries leave (no whole parent string is supported). Chalk is sourced by bullbar-calluses (way 1): W2A shows it only if it fits within chin_up's 5-step setup cap; otherwise gaps reads "Chalk: sourced (bullbar-calluses), no setup slot." "Bar fixed" and bar height: way (1) on catalyst-pullup and bullbar (re-read 2026-10-18; neither says it). If no quote is found, gaps, and "bar fixed" joins the owner's tier-A gap list (chin_up is tier A). The substring text follows that outcome.
- #34 chin_up note CHANGE: "on this head" becomes "on 5036283d"; name the parent claim ids relied on; "hand contact ... fail" follows the way-(1) outcome. Add that the thumbless, hook and false-grip labels fail: baechle-earle gives only "Perform all grips with your thumbs around the bar."
- #41 HKR feel.rows[3] CHANGE: way (1) leads are bullbar-calluses' "Pull your shoulder blades down and back" (quote only those words; note that its "slight bend in your elbows" conflicts with c2) and nasm-chinup as quoted in cards/pull_up.json c8. Both apply to a knee-raise hang by inference (MECH, WEAK). The fallback (remove rows[3], drop 'shoulder') is DROPPED. New fallback: rows[3], 'shoulder' in redFlags and the active-hang inherit entry stay as on the head. Add the note "LR-34: the active hang fails on cards/hanging_leg_raise.json; rows[3].fix is unsourced; hanging_knee_raise is stopped for a supervisor ruling.", and report hanging_knee_raise as stopped in FIXED.
- #39 (inherit[5] sentence) and #40 (rows[3].means): apply only when #41 sources the fix.
- #43 HKR inherit CHANGE: drop the "setup: jump, or step up on a low stool, to reach the bar" entry (no shipped parent string; the line is cited to HKR's own c1). Keep the wrist and thumb entries only if the parent's shipped strings for them hold whole on the parent card; otherwise their lines are cited to HKR's own claims (c16; c3). The active-hang entry is removed only when #41 sources the fix.
- #47 HKR gaps[0]: unchanged text. The owner's tier-A gap list adds "hanging_knee_raise: no sourced box or stool-clearance line (LR-34)".
- #50 HKR notes CHANGE: "the jump or step-up (parent c1) hold" becomes "the jump or step-up holds (parent c1) and is cited to this card's own c1, not inherited". The parenthetical "(the8.md lists these as unsourced golden-B points)" becomes "(the8.md:138 lists the width, straps and box clearance as unsourced golden-B points; the parent's grip.handContact says Not sourced; chalk and the active hang are not on the parent card)". Write "on 5036283d" with parent claim ids, the shipped-sheet path (or "no whole string") per kept entry, and the way-(1) outcomes.

**Packet edits, HELPER:**
- #50 CHANGE: "against the parent's card on head 5036283d" becomes "against the parent's card, or a verified shared card whose appliesTo lists the child (for example shared/selector-pin.json c1 for the pin line), on head 5036283d". Add the rules:
  - record holds or fails by claim id, not by setup index (THE8's W2-24 merges leg_press setup[3] and [4]);
  - try way (1) first for shown and safety lines;
  - never route a safety line to (2);
  - a feel row, redFlag, risk line or tier-A point is never removed (stop and report);
  - a removed safety line on a tier-A card joins the owner's tier-A gap list;
  - give the shipped-sheet path, or "no whole string", per kept entry;
  - name any card whose inherit list becomes empty.
  The front_squat sentence becomes: "check each unrack and walk-out step, before its plate is drawn, against whichever of cards/barbell_back_squat.json and shared/unrack-rerack.json sources it; if they disagree, the line fails until the supervisor rules (see open point b)."
- #51 CHANGE: "If inherit[0] fails" becomes "If inherit[0] fails and way (1), through the golden-B lat_pulldown source map, finds no verbatim quote for the handle contact". The rest stands; hand contact on a cable handle is a pure drawing choice, so way (2) is allowed.

**Supervisor edits:**
- RULINGS.md LR-34 row: the text above.
- CARD-V2 :69 new text: `or an approved golden exercise. Once a golden parent has a verified card on the branch, that card, and any verified shared card whose appliesTo lists the child, governs the child's inherited lines; an inherit entry stays only where the parent's shipped How-to string for it holds whole there, and golden-B research is a source map only (LR-34). Parent picks follow`
- w2-findings.md:
  - W2-4 row: "W2A | low | rejected under LR-8 as in force (triage result.rejected); overturned by LR-34". W2-4 leaves open point d.
  - W2-53 rulings row adds "or a verified shared card (LR-29); ways out in order, fetched quote first; stop rule for feel rows, red flags, risks and tier-A points".
  - Open point e adds the HKR box/stool-clearance gap and, if way (1) fails, chin_up's "bar fixed".
  - Open point h: "HELPER's LR-34 step is expected to remove those words" becomes "removes those words unless way (1) finds a verbatim quote for the handle contact".
- D-LIB5-FAMILY item 6: note that its list of 9 cards shrinks for any child whose inherit list becomes empty.

---

## LR-35 (W2-54): muscle ids and critic coverage. AMENDED

**Ruling (RULINGS.md row):**

| LR-35 | W2-54, supervisor 2026-10-18 | Muscle ids in `feel` (C2, tests/howto/checks/c2.ts on main): `brachialis` and `rotator_cuff` are muscles.ts ids with no drawn region (text-only). They are allowed only in feel.secondary and feel.watch, never in feel.primary or a feel.rows[].at.muscles highlight. `core` has a misleading region and goes in none of feel.primary, feel.secondary and feel.watch. `libraryDiff` (lists compared with src/data/exercises.json) may use any muscles.ts id. W2-48's rotator_cuff in feel.secondary is allowed, and rear_delt_fly's libraryDiff.add rotator_cuff (c10) stays. The 10 cards with `core` in a feel role, and reverse_curl's libraryDiff strings 'biceps (primary)' and 'biceps (secondary)', go to tracker item LIB-MUSCLE. Critic findings valid-4#20, invalid-2#66 and invalid-3#91 are void: on 5036283d each of the 11 cards that valid-4#20 lists has a quotes file that matches the card one for one, all verbatim (chin_up 35, hanging_knee_raise 27, assisted_pull_up 37, underhand_lat_pulldown 24, cable_fly 23, low_to_high_cable_fly 25, smith_machine_bench_press 30, smith_machine_incline_press 31, smith_machine_shoulder_press 43, smith_machine_shrug 21, smith_machine_squat 37). The W2 recheck runs on the head after this fix round, and its scope is the one list in verify/w2.md 'Recheck scope (LR-35)'. |

**Why:**
- The muscle-id half is right. c2.ts on main has `NO_REGION = {brachialis, rotator_cuff}`, which fail only in feel.primary and in row highlights, and `MISLEADING_REGION = {core}`, which fails in every feel role.
- I read the critic's own finding (workflow output waktyh0gs). It names chin_up, hanging_knee_raise, assisted_pull_up, cable_fly, low_to_high_cable_fly, five smith_machine_* cards and underhand_lat_pulldown. git diff 9dbc7e0a..5036283d shows these 11 are exactly the cards this wave changed without changing their quotes file. My script matched all 11 files to their cards (the 7 W2B files use the key `text`, not `quote`). So the void stands, but on 11 files, not 4, and all 11 join the recheck.
- An unscoped "only in feel.secondary and feel.watch" would reach libraryDiff. main's exercises.json uses rotator_cuff (lib_face_pull, lib_cable_external_rotation) and brachialis (three curls), and rear_delt_fly's libraryDiff.add ['rotator_cuff'] rests on c10 (DATA). So the line is scoped to `feel`. It keeps the word "text-only", which c2.ts's D-HT4-C2 header cites from CARD-V2.
- The three recheck lists in the draft disagreed, so one union list replaces them.
- mountain_climbers and plank have core as their only feel.primary. Under content.md 8, a feel map with no drawn main muscle is a golden-B design update, so LIB-MUSCLE must stop there, not guess an id.
- content.md:408's "These are text-only under C2." is the same misreading for core.

**Why nothing is loosened:** C2 is unchanged, and the rule text now says exactly what C2 enforces. The recheck only grows. No card, plate or approved copy changes. No card of the 8 has core, brachialis or rotator_cuff in a feel role.

**Packet edits:** none. HELPER #52 stays "no change". W2A and THE8: no change.

**Supervisor edits:**
- RULINGS.md LR-35 row: the text above.
- CARD-V2 :62 new text: "- Muscle ids come from `src/data/muscles.ts` on main. In `feel` (C2; LR-35): `brachialis` and `rotator_cuff` have no drawn region (text-only), so use them only in `feel.secondary` and `feel.watch`, never in `feel.primary` or a row's `at.muscles`; `core` has a misleading region, so use it in none of `feel.primary`, `feel.secondary` and `feel.watch`. `libraryDiff` may use any muscles.ts id."
- verify/w2.md: keep the "Void: ..." sentence, now naming all 11 files with their counts, and the "Re-fetched verbatim 2026-10-18 (judge): ..." log. Replace the "Re-run ..." and "Add to the blind recheck ..." sentences with the single list below. Delete the findings' separate "Recheck scope after this round" paragraph, because this list is its union.

  "Recheck scope (LR-35), on the research head after the three FIXED pushes:
  (1) the 11 quotes files valid-4#20 could not read, as they stand after this round (underhand gains c19);
  (2) the muscle-id and C2 role check over every card, from git show origin/main:src/data/muscles.ts and origin/main:tests/howto/checks/c2.ts (re-runs invalid-1#43); the 10 LIB-MUSCLE cards are expected hits, reported as known and not edited in this round;
  (3) every quote this round adds, changes or newly shows:
  - shared-dumbbell-kickup c5 and c6 (all three), and the reworded seated step against c6;
  - every [fetcher] item: W2A 2 (shoulder_press c7, card and file), THE8 40 (with LR-33's c16 and c25), HELPER 2 (underhand c19, card and file);
  - every quote W2A or HELPER adds in an LR-34 step (bullbar-calluses hand contact, width, chalk, any HKR shoulder fix);
  (4) every [LR-31 step] item, the assisted_pull_up and underhand_lat_pulldown plate.mistake edits, and the rankNotes changed under LR-31 and LR-32, checked against their quotes and the scan;
  (5) single_arm c14's convention sentence (LR-33);
  (6) each LR-34 child check, re-confirmed by claim id against its parent at THE8's FIXED sha (known to change: lat_pulldown c11; barbell_back_squat c14, c15, c23, c26; leg_press setup[3]-[4]; confirmed unchanged by THE8: pull_up c3 and its 'hand' zoom; hanging_leg_raise c1, c17, c18)."
- Relay TASKS.md LIB-MUSCLE, new text: "LIB-MUSCLE (research, later pass; before any of these ids gets How-to content, since C2 fails them until then): replace `core` in feel roles on ab_wheel_rollout, mountain_climbers, plank (primary) and battle_ropes, cable_chest_press, high_knees, push_up, renegade_row, side_plank, sled_pull (secondary/watch) with a drawn id the sources support (abs, obliques), with the reason in libraryDiff (content.md 8, 'Feel map with nothing it can draw'), or name it in text only. If feel.primary would be left with no drawn id (mountain_climbers, plank), stop and report: that is a golden-B design update, never a guessed id. Write reverse_curl's libraryDiff entries as muscle ids, with the role stated."
- content.md:408 on `claude/howto-options` (the string occurs once): "These are text-only under C2." becomes "Under C2 (LR-35), `core` fails in every feel role, and `rotator_cuff` and `brachialis` are text-only (feel.secondary and feel.watch only)."

---

## Summary

| LR | W2 | verdict | packets changed |
|---|---|---|---|
| LR-30 | W2-49 | amended | W2A #65, #67, #68 |
| LR-31 | W2-51 | amended | THE8 #48, #57, #70, #80, #109, #115, #34 and a new scan step; W2A new assisted_pull_up items and LR-31 steps; HELPER new underhand_lat_pulldown items and LR-31 steps |
| LR-32 | W2-50 | amended (precision) | HELPER #6; supervisor edits 3-4 held |
| LR-33 | W2-52 | amended | THE8 #92, #93, #94, #111, #112, #34, header, and new c16/c25 claims and quotes; HELPER new single_arm c14 |
| LR-34 | W2-53 | amended | W2A #19, #29, #30, #32, #33, #34, #39, #40, #41, #43, #44, #45, #46, #47, #50; HELPER #50, #51 |
| LR-35 | W2-54 | amended | none (supervisor docs only) |

**Risks and mitigations:**
- LR-31 makes assisted_pull_up drawable:false, so a new F7 needs the owner's yes. LIB-9a needs a fault key for the fast lowering. Mitigation: the edits are held until the recheck verifies the result, and LIB-9a is told when the re-copy head is named.
- underhand_lat_pulldown's drawn Mistake changes in LIB-9a's unapproved spec. Mitigation: the re-copy and A13 re-verify come before any Do 7 evidence.
- HKR may stop for a ruling if no shoulder fix is sourced. Mitigation: bullbar-calluses and NASM leads are named. The stop keeps the warning link instead of removing it.
- The scan step adds fetch work to THE8, W2A and HELPER. Mitigation: it is a curl-and-grep step per source the cards already cite, and it is what makes "no frequency word" true.
- Up to three of the 8 (lat_pulldown, squat, lateral raise) may stay out of CARDS_8. Mitigation: D-LIB5-TOPFAULT's existing route. The topFault and F7 test rows use the lib5 fixture card if the lateral raise stops.
