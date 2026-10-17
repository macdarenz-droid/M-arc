# LIB-HT research: the 8's cards (D-LIB5-CARDS8)

Writer record, 2026-10-17. Branch `claude/libht-research-the8`, from `claude/libht-research` @ `9dbc7e0a`.
Ruling: docs/supervisor/verify/lib4-cards.md section 12 item 13 (on `claude/sup-lib4-cards`).

## How the cards were made
- **Writers:** four Opus writers, each doing two ids. They started from the sources each shipped sheet cites (`lib_<id>.json` and `sources.json` on main). The golden-B research on `claude/howto-options` (`docs/howto/grip-and-feel/research/`) was used only as a source map, never as a citation.
- **Never read:** no value was taken from the 8's specs, plates, How-to modules, generated files or golden pages.
- **Fetching:** all sources were fetched with curl. PubMed abstracts were read through NCBI E-utilities efetch, and PMC full text through efetch with db=pmc.
- **Fetchers:** one Sonnet fetcher per card, separate from the writer (R-W1-4). Each re-fetched every quote with curl on its own and fed the result into the card's sources (`access`, `checked`) and quotes file (`status`). The writers did not grade their own quotes.
- **Pre-push check, per card:**
  - the JSON parses;
  - every claim id that a line cites exists;
  - there are no orphan sources;
  - each quote is at most 50 words, counted like `words()` in `tests/howto/checks/c7.ts`;
  - every muscle id is in `src/data/muscles.ts`;
  - the quotes file matches the card.
- **Wording scan:** a scan of the shown lines found no source, study, organisation, emergency or referral wording (LR-23, LR-27). The only "lab" hits are "lab tests" and "small lab sample", which keep how sure the finding is (as LR-27 allows).

## Fetcher results (all checked 2026-10-17)

| id | tier | claims | sources | quotes checked | verbatim | access | unreachable |
|---|---|---|---|---|---|---|---|
| dumbbell_lateral_raise | C | 14 | 5 | 19 | 19 | full 2, abstract 3 | 0 |
| barbell_back_squat | A | 26 | 15 | 50 | 50 | full 6, abstract 9 | 0 |
| pull_up | A | 23 | 8 | 36 | 36 | full 3, abstract 5 | 0 |
| hanging_leg_raise | A | 18 | 11 | 36 | 36 | full 5, abstract 6 | 0 |
| lat_pulldown | C | 23 | 13 | 40 | 40 | full 3, abstract 10 | 0 |
| seated_cable_row | C | 18 | 9 | 33 | 33 | full 5, abstract 4 | 0 |
| leg_press | B | 24 | 13 | 57 | 57 | full 4, abstract 9 | 0 |
| machine_chest_press | C | 15 | 5 | 23 | 23 | full 3, abstract 2 | 0 |

- **Totals:** 294 quotes checked, 294 verbatim. For every PubMed source, the title, year and PMID match the card.
- **Fetch notes:**
  - doctoryessis.com refuses the short `Mozilla/5.0` user agent (406); a full Chrome user-agent string gets 200.
  - ACE returned 403 to one writer but 200 to the fetchers.
  - The muyor2023 PMC page served a reCAPTCHA stub at first; a retry got the full article.
  - wiki-leg-raise c8 at first failed only because the HTML stripper added a space before "." after a link. The raw HTML (`anterior pelvic tilt</a>.`) matches, so it is verbatim.
  - The Yessis leg-press page itself serves "80-90?" (a literal `?`), and the c5 quote keeps it as served.
- **New sources:** `acsm2009` (PMID 19204579) and `rep-fail` (REP Fitness). Neither id is in main's `sources.json`. Both ids are already used for the same URLs by verified cards on this branch.

## Per id: facts 1-3

Fact 1 is the plate's measured joint, fact 2 is the tempo and fact 3 is plate.mistake. "Gap" means no source states it. A gap is recorded, never filled.

### dumbbell_lateral_raise
- **Read:**
  - ace-lateral-raise (full page; the anchor);
  - coratella2020 (PMC full text);
  - abstracts: andersen2008, kolber2014, graichen1999;
  - read but not cited: sporrong1995, sporrong1996, kolber2010, jakobsen2012.
- **Fact 1, arm height at the top:** found.
  - c6: ACE puts the arms level with the shoulders, approximately parallel with the floor.
  - c8: Coratella abducts the arm "up to 90°".
- **Fact 1, elbow:** found in words.
  - c1: "extended or holding a slight bend".
  - c7 and c8: "almost fully extended".
  - c10: the side deltoid works harder with a straight elbow than a bent one.
  - No source gives an elbow angle in degrees.
- **Fact 2, tempo:** c9, tagged DATA and WEAK.
  - Coratella's lab pacing was 2 s up, 2 s down and 0.5 s holds, in 10 competitive bodybuilders doing the raise seated.
  - No source at novice level gives seconds.
- **Fact 3, mistake:** c13, raising above 90°.
  - Kolber 2014 links raises above 90° with signs of shoulder impingement and advises avoiding them.
  - It is named as risky, not as common; how often it happens is not measured.
- **Golden-B differences:** no source read supports these, so they are left out: the 10-20° elbow bend, 12-20 reps, the arms 20-30° forward, the 15° wrist limit and the handle across mid-palm.

### barbell_back_squat (tier A)
- **Read:**
  - full pages: ace-back-squat, hk-squat (the anchor), nsca-summary (a summary of the NSCA text), rep-fail, barbell-logic-squat-grip, baechle-earle;
  - abstracts: bloomquist2013, fry2003, hackett2013, caterisano2002, kubo2019, glassbrook2017, kerr2010, lander1992, acsm2009.
- **Fact 1, knee bend:** found.
  - c7: Bloomquist's deep squat ran from 0 to 120° of knee flexion (shallow: 0 to 60°).
  - c6: the hips go below the knees.
  - No source gives the knee angle at the moment the hips pass the knees.
- **Fact 2, tempo:** gap for novice seconds.
  - c26 is tagged WEAK, and the plate's 2/2 is a drawing convention under LR-15.
  - Lander measured one 8-RM rep at 3.34-3.56 s in total.
- **Fact 3, mistake:** c10 with c5, the back rounding at the bottom. The source says "rounding the back can cause injury".
- **Tier A, sourced:**
  - safeties just below the lowest depth (c13);
  - a spotter (c14);
  - the way out, `tierA.wayOut` (c15: push the bar back while moving forward onto the safeties, and practise light first);
  - load progression (c16);
  - breathing (c17, c18).
- **Tier A gaps:**
  - No source describes the rerack.
  - Bar clear of the neck is sourced only as where the bar sits (c1, c2) plus the backward bail, so the bar-on-back zoom has `wrong: null`.
- **Golden-B differences:**
  - Golden-B says the NSCA teaches a closed grip for the squat; the summary read never says so.
  - Golden-B's 0-15° wrist range has no source.
  - Golden-B gives the NSCA for the safety-pin height; the height actually comes from rep-fail.
  - Golden-B's "sit down and slide out" exit is not sourced, so the card uses rep-fail's bail.

### pull_up (tier A)
- **Read:**
  - full pages: catalyst-pullup (the anchor), nasm-chinup, baechle-earle;
  - abstracts: youdas2010, acsm2009, prinold2016, kolber2010, odriscoll1992;
  - read but not cited: catalyst-scap, dickie2017, snarr2017, urbanczyk2020, difonza2026.
- **Fact 1, elbow bend:** found.
  - c4: the elbows are completely extended in a full hang.
  - c5: the chin goes above the bar.
  - c6: Youdas measured a mean elbow range of 93.4 ± 14.6°.
  - No source gives the elbow angle at the top.
- **Fact 2, tempo:** gap for seconds.
  - c11 is tagged WEAK: NASM says "controlled tempo in both directions".
  - The plate's 2/2/0 is a drawing convention under LR-15.
- **Fact 3, mistake:** c10 with c9, kipping and momentum, which come first in NASM's "common faults".
- **Tier A gaps:**
  - No sourced way to get down from the bar (LR-3).
  - Safeties and the neck do not apply.
  - Load progression is sourced (c12-c14), but not how much load to add.
- **Golden-B differences:**
  - Golden-B's "1.5 times shoulder width" is Snarr's study setup, not advice. The card uses "just outside shoulder width" from Catalyst and NASM.
  - Golden-B's active hang conflicts with Catalyst's "open completely". The card uses c1 and c8 in that order.
  - No source supports golden-B's abs secondary muscle or its shrug, biceps, forearm and lower-back feel rows, so they are not on the card.

### hanging_leg_raise (tier A)
- **Read:**
  - full pages: yessis-hlr (the anchor), catalyst-hlr, strengthlog-hlr, wiki-leg-raise, baechle-earle;
  - abstracts: mcgill2015, andersson1997, workman2008, prinold2016, odriscoll1992, acsm2009;
  - read but not cited: escamilla2006 (a strap knee-up, a different exercise), axler1997, juker1998, ace-abs.
- **Fact 1, hip angle:** found in words; the only number is expert opinion.
  - c2: a full hang, with no start angle given.
  - c3: straight legs raised until the toes reach the bar, with the pelvis curled up.
  - c4, tagged MECH and WEAK: Yessis says hip flexion reaches its maximum at "approximately 30-45 degrees from the vertical". He doesn't say whether he means the thigh or the hip angle, so the words are kept and not converted.
- **Fact 2, tempo:** only the top hold is sourced.
  - c10: "approximately one-two seconds", and the plate draws 1 s.
  - Up and down are a drawing convention under LR-15 (WEAK).
- **Fact 3, mistake:** c7 with c6, swinging.
  - The Wikipedia page calls the hanging version "potentially the easiest to use bad form on".
  - Yessis and StrengthLog both say not to swing.
- **Tier A gaps:**
  - No sourced way to get down from the bar (LR-3).
  - The back row links the pending back box (LR-23, LR-26).
- **Golden-B differences:**
  - Golden-B ends at "thighs at or above horizontal"; the card follows the sources, toes to the bar.
  - These golden-B points are unsourced: the shoulder-width grip, straps and slings, the box-clearance setup, the 2-3 s lowering, and lats and forearms as secondary muscles.
- **Shipped list:** this card cites prinold2016, odriscoll1992, acsm2009 and baechle-earle, which the shipped sheet's list does not include. They are used because no hanging-leg-raise source states those facts, and each claim says it is inferred.

### lat_pulldown
- **Read:**
  - full pages: ace-lat-pulldown (the anchor), nsca-low-row (a study-flashcard copy of the NSCA text), baechle-earle;
  - abstracts: lusk2010, acsm2009, sperandei2009, kolber2013, signorile2002, padovan2024, snyder2009, andersen2014, odriscoll1992, buonsenso2025.
- **Fact 1, trunk lean:** found.
  - c2: ACE says "Lean back slightly (no more than a 30 degree angle)", and NSCA says "Slightly lean the torso backward".
  - c3: no extra backward lean during the pull.
- **Fact 2, tempo:** gap for novice seconds.
  - c16 is tagged WEAK: the 2-2 count is the Lusk 2010 protocol, and ACSM's 1-2 s is for advanced lifters (LR-15).
  - The 1 s pause is a drawing convention for ACE's "pause momentarily".
- **Fact 3, mistake:** pulling the bar behind the neck.
  - c9: the NSCA common-errors list names it, and Sperandei says it "should be avoided".
  - c10: Kolber 2013 links it to an unstable front shoulder, as an association only.
  - c11: less lat activity.
  - The list does not rank its errors.
- **Golden-B differences:**
  - Golden-B's grip of 1.5 times shoulder width is not in any source. The card says "wider than shoulder-width", plus Andersen's 1-2 times biacromial width.
  - Golden-B's "leaning way back and swinging" fault is replaced by the NSCA list, which names flexing the torso forward with the abs (c12).

### seated_cable_row
- **Read:**
  - full: unmc-cable-row (the anchor), nsca-low-row, ace-seated-row (a chest-pad machine row, so its claims are tagged MECH), baechle-earle, deabreu2023;
  - abstracts: acsm2009, lehman2004, dosanjos2024, callaghan2001;
  - not fetched: padovan2025grip.
- **Fact 1, shoulder angle:** found in words; no degrees.
  - c2: the torso is perpendicular to the floor with the arms about parallel to it. "About a right angle" is geometry, tagged MECH.
  - c3: the handle comes to the stomach (UNMC) or the "sternum or abdomen" (NSCA).
  - The elbows end close to the sides and past them; this comes from the machine row, tagged MECH.
- **Fact 2, tempo:** gap for seconds.
  - c12 is tagged WEAK: the sourced words are a brief pause and a slow return.
  - The plate's 2-1-2 is a drawing convention.
- **Fact 3, mistake:** c6, jerking the upper body or leaning back. It is first in the NSCA common-errors list.
  - c9: ACE's line on low-back stress, tagged MECH.
- **Golden-B differences:**
  - Golden-B's 0-20° wrist target has no source; the card uses ACE's "in line with your forearms" (MECH).
  - The card keeps the census muscles (mid_back primary, lats secondary).

### leg_press (tier B)
- **Read:**
  - full pages: yessis (the anchor, 45° sled), ace-leg-press, nasm-leg-press, bells-of-steel;
  - abstracts: larsen2025, barnds2019, macdougall1985, martinfuentes2020, martinfuentes2022, kinoshita2026, stien2021, dasilva2008, escamilla2001lp.
- **Fact 1, knee bend:** found.
  - c5, the bottom: Yessis gives "80-90" (as served), measured from the back of the shin to the back of the thigh. NASM gives 90° of knee flexion, and ACE about 90°. The card does not convert between them.
  - c4, the top: legs extended, knees not locked.
  - c6, measured ranges: 5-100° against 5-154°.
- **Fact 2, tempo:** c15, tagged DATA and WEAK.
  - Two inclined leg-press studies in trained adults used 2 s down and 2 s up.
  - The manufacturer allows an optional 1 s pause at the bottom.
  - No novice prescription in seconds exists.
- **Fact 3, mistake:** c7. Yessis writes that "Leg press machines commonly cause low back injury because of the rounding of the back when the knees are close to the chest."
- **Golden-B differences:**
  - Golden-B has the depth selector catching a failed rep; the source says only that it limits the footplate's travel.
  - These golden-B points are unsourced: the thumb on the handles, "feet higher to go deeper" and "hands pushing on knees".
  - Golden-B called ACE and Bells of Steel unreachable; both read fine here.

### machine_chest_press
- **Read:**
  - full: ace-chest-press (the anchor), muyor2023 (PMC full text), barbell-logic-grip (a bench-press source, tagged MECH);
  - abstracts: nance2017, snyder2012;
  - read but not cited: weiss1995, fees1998, calatayud2016.
- **Fact 1, elbow at full press:** found. c6: "fully extended, but not locked".
  - The start (c1, c5) has the handles at mid-chest with the elbows bent. No source gives a start angle.
- **Fact 2, tempo:** c9, tagged DATA and WEAK.
  - Muyor's lab pacing on this machine was 2 s and 2 s.
  - ACE says only "pause momentarily", so pause is null (c7).
- **Fact 3, mistake:** c8. ACE says people "very frequently" press until the shoulder blades round forward off the backrest.
- **Golden-B differences:**
  - Golden-B's "hard lockout stresses the elbow" is unsourced.
  - The Fees abstract states no depth limit.
  - Muyor's "hook grip" conflicts with ACE's full grip; the card follows ACE.
  - The 0-10° and 15-20° wrist limits are unsourced.

## Open questions for the supervisor
1. **Tempo:** no source at novice level gives seconds for any of the 8. Four cards (lateral raise, lat pulldown, leg press, chest press) use exercise-specific lab pacing, tagged WEAK. The other four mark their counts as a drawing convention.
   - Squat: the plate draws 4 s per rep, but the measured 8-RM rep took about 3.5 s. Keep 2/2, or use 2 down and 1-2 up?
2. **nsca-low-row:** the lat pulldown and seated row cards depend on a study-flashcard copy of the NSCA text, because the original is not free online. The same id covers both sections of that page. Should it get a clearer id?
3. **fenwick2009:** the registry has PMID 19197209, but the chest_supported_row card uses 19620925, and the two records look like duplicates. None of the 8 cites it.
4. **Hanging leg raise hip angle:** Yessis's "30-45 degrees from the vertical" is expert opinion and doesn't say which angle it means. Is that enough to remove the exemption, or is it a gap?
5. **Squat thumb:** the general textbook wraps the thumb and the low-bar coach does not. Nothing is sourced for the high-bar squat.
6. **Leg press:**
   - Breathing: Yessis holds the breath on the way down, while ACE says to breathe out while pushing. No breathing line is shown.
   - The way out (c22) rests on the manufacturer's blog alone.
