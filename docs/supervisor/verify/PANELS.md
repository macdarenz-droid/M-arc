# Calibrated critic panels and blind verifies: how the supervisor runs them

The supervisor runs these itself, through in-chat subagents (the Agent tool). They are never builder sessions. Each agent is a **fresh general-purpose agent on model `opus`**, run in the background. Everything is written to the supervisor's scratchpad (`<S>` below), and nothing is committed. Only the verdict is recorded: on the PR, and in `docs/supervisor/verify/lib4-cards.md`, as a new numbered section for each panel (sections 24-29 are the examples).

## 1. Calibrated plate panel (D-CRITIC-CAL3)

Used for every drawn batch (pilot A/B, LB1-LB10, LIB-ZOOM), after the builder posts '<X> PLATES READY @ <sha>' with the plates-page sha256.

1. **Build the blind set.** One private "panel builder" agent does this; it never runs critics. It must:
   - check out the head in a detached scratch worktree, run `npm ci`, rebuild the page with the batch's own build script, and confirm the posted sha256 (it stops if the sha differs);
   - cut every candidate plate into `<S>/critic-<SET>/set/T01..Tn/`, each with `dark.png`, `paper.png`, `mistake-dark.png` and `facts.json` (the card's verified facts and tier);
   - add **2 hidden golden-B anchors**, golden B's `pull_up` and `lat_pulldown` (D-LIB10-PANEL1), until pilot A is pinned;
   - add **2 plants**. Each plant is an extra, planted copy of one candidate; its original stays in the set. The two are on different candidates and each targets a named rubric item. Each must be a real error a careful critic scores ≤ 3, visible at a glance at 390 px in both themes but not cartoonish. Round 1 used a foot off the floor (R3) and a leader moved onto the wrong body part (R4). A recheck uses new kinds of plant: an error on the fixed items, plus one R1/R5/R6;
   - shuffle with a recorded salt (a recheck uses a new salt, so no T holds the same plate as before);
   - render the references fresh. A new account has no old scratchpad, so the builder makes them from main's approved pages: golden B's layers page and, once it is pinned, pilot A's plates page. The 10-19 set was seated_cable_row, machine_chest_press, lat_pulldown, mountain_climbers (floor) and dumbbell_bench_press (bench), each in dark, paper and mistake-dark, cropped at 780 px. Never use an anchor as a labelled reference;
   - run a leak check: no id, key, plant or anchor name in any file name, README, alt text or visible text;
   - write the private answer key to `<S>/critic-<SET>-private/KEY.md`, holding the T map, the plant definitions with the reason for each, the anchors and the sha256 of every file.

   Copy the panel builder's brief from an earlier one: its job, the head, the build command, the page sha, the candidates, the anchors, the plant rules, the paths, and "reply in ≤ 8 lines".
2. **Run 3 fresh critics in parallel**, each with the prompt in section 5 below. `<RUN>` is set1.1-3, and the result paths are `critic-1/2/3.json`.
3. **Score it.** A **finding** counts when 2 of the 3 critics score that item ≤ 3. The run is **VALID** only when:
   - both plants are caught (2 of 3 ≤ 3 on the target item);
   - each anchor's median is ≥ 4 on every item.

   The one exception is one item per anchor, and only if the supervisor confirms the defect on the PNG (crop the region and look) and records it as a golden-B follow-up. These are already recorded and confirmed:
   - **18:** dumbbell_lateral_raise, the Wrong handle floating in the fingers (hand panels);
   - **19:** lat_pulldown, the start ghost more upright than the end, so the lean grows;
   - **20:** pull_up, the head tipped back about 20° at the top;
   - **21:** lat_pulldown, the thigh roller with no mount.
   - **22:** pull_up, no floor line, so "feet clear the floor" is never shown (lib4-cards 30).
4. **Verdict.** A plate whose every median is ≥ 4 is **approved at that sha**. A failing plate gets **one fix round**: post the findings with pixel places and buildable fixes. After 'PANEL FIX @ <sha>', run a **focused recheck**: only the fixed plates, the same anchors, new plants and a new shuffle. A plate that still fails gets a second focused round (D-LIB13-PANEL2) or is **HELD** (D-LIB8M-CARDTRUE).
5. **Card truth wins.** A critic's fix that breaks a quoted card claim is never built. Rule it card-true (D-LIB13-ONEARM: the bent support arm on one_arm_dumbbell_row), tell the next critics in one prompt sentence, and give the owner a sheet line. If the sources might support the other form, open a research follow-up.

## 2. Hand close-up panel (R8, D-LIB12FIX-*)

This is the same method as section 1, with these changes:
- the sheet is `node tools/plates/library/hands/sheet.mjs <out> --critic --calibrate`;
- the anchors are the approved hand pairs `lat_pulldown/p2` and `dumbbell_lateral_raise`; pull_up/p1 is barred (follow-up 10);
- the references are owner-approved hand pairs, rendered fresh with the same sheet tool from main or the approved head: pull_up, lat_pulldown and seated_cable_row, in dark and paper, renamed ref1-ref3 so no file name carries an id;
- the plants are a Right/Wrong swap (C1) and a contact error (C3);
- the rubric is C1-C7 (section 6).

A hand key that still fails after its one fix round moves its ids to the module's **GAPS** by ruling (D-LIB12FIX-R8-GAPS).

## 3. CARD FIELDS blind verify (D-LIB9-CARDFIELDS, D-LIB13-FACTS2, D-LIB11-FACTS2)

Used when a builder posts '<X> CARD FIELDS READY @ <sha>'. That means each drawn card carries `plateFacts`, `tempo` and `topFault`.
1. **Build the copy.** In `<S>/cf<SET>/copy/`, put:
   - `cards/<id>.json` and `quotes/<id>.json`, taken from the head (`git show`);
   - `tempo.json`, the batch's phase map, with its ruling and research fields stripped;
   - `faultmap.md`, the ruled fault→key table from the batch's DESIGN.md;
   - `tells/<id>.txt`, the Mistake tells from each spec (key, label, cue, in random order);
   - `rules.md`, written from the template in section 7.

   Plant **exactly one** error by hand: a wrong pose under the pose map, a claim id swapped to a claim whose quote does not state the fact, or a wrong tempo second. Record it in `<S>/cf<SET>-plant.txt`.
2. Run **one** fresh Opus verifier with the prompt in section 7.
3. The run is VALID only if the plant is caught. Check every other finding against the quotes yourself. Then rule a fix round on the PR. After 'FIXED', diff-check that the facts match your ruling, and run a **focused re-verify** with a new plant. Small leftovers become "tightenings", diff-checked on the next push.

**Contact facts:**
- Shape: `{kind:'contact', landmark, pose, cardPose, claim}`.
- A contact along a segment is checked at both of its ends.
- A setup quote states the start pose only; contacts are never carried to another pose by inference.
- A back on a flat pad ends at `buttock`, not `sacrum` or `lumbar`, because of the body's lumbar hollow (D-LIB11-SACRUM).

## 4. Advisory scoring (E-R5 renders)

Engine-test renders are scored by **one** critic using the plate prompt, with one added sentence: "These are engine test renders of new views…; score R5 null where a candidate has no Mistake image". There are no plants and no anchors. The scores go on the owner's sheet beside each render; they are never an approval.

## 5. Plate critic prompt (R1-R11)

Set `<RUN>`, `<SET>` and `<N>`, and fix the candidate list (T01..Tn) and the image width (780 px for plates, 716 for spike renders). Any ruled sentence, such as D-LIB13-ONEARM's, goes after the candidate list.

```text
You are a fresh, independent visual critic (run <RUN>) for M/ARC's exercise How-to plates: technical drawings of a lifter doing an exercise, shown in a phone app at 390 px wide (the images are 780 px wide, 2x). The owner approved a reference set of plates; new plates must reach the same bar. Judge each candidate plate on its own merits against that bar. Look at every image yourself with the Read tool. Use no other agents or models, and never WebFetch or WebSearch.

Inputs (read only these paths; do not look anywhere else on disk):
- Reference (owner-approved plates, the quality bar and house style): <S>/critic-<SET>/reference/*.png (states: dark = Silent Black theme, paper = Paper theme, mistake-dark = the Mistake view in Silent Black). mountain_climbers is an approved floor-level plate, cropped from the app sheet, so its plate box is drawn a little smaller. This round the reference adds the approved dumbbell_bench_press as the bench reference. plank is not in the reference.
- Candidates: <S>/critic-<SET>/set/T01 .. <S>/critic-<SET>/set/T08, each with dark.png, paper.png, mistake-dark.png and facts.json (the verified research facts the drawing must match, and its safety tier). <S>/critic-<SET>/set/README.md lists them. Candidates: T01, T02, T03, T04, T05, T06, T07, T08.

Ignore the tempo strip's phase list and seconds when judging: they are not part of the rubric and say nothing about a plate's quality or origin.

Rubric, score 1-5 per item for every candidate (5 = as good as the approved reference; 4 = acceptable, at the approved bar; 3 or less = a real problem a careful designer or coach would fix):
- R1 pose truth (joint angles and body position match the facts and real technique);
- R2 equipment realism and scale;
- R3 contact plausibility (hands, feet, back actually on the handle, bar, bench, floor, pad);
- R4 label placement "as a designer would": each callout leader ends on the body part or equipment its label names;
- R5 the Mistake reads in 2 seconds (the fault shown is the labelled fault, clearly visible);
- R6 the Trace (motion path) means something;
- R7 consistent with the reference (line weight, density, framing, same equipment drawn the same way);
- R8 close-ups (Right and Wrong not swapped, thumb and handle placement): null if the plate has no close-up;
- R9 feel regions match the card: null if no feel region is shown;
- R10 tier A only: the "right" pose never shows an unsafe setup: null for other tiers;
- R11 the zoom circle (a magnified view of one region of the plate, drawn in a circle, with a dashed source ring on the region it magnifies) shows at a glance what it magnifies; its source ring and circle read as one pair: null if the plate has no zoom.

House conventions of the approved plates that are NOT defects: Mistake labels without leaders; loose leader ends that stop on an outline; angle labels that repeat a checkpoint; ghost (dashed) poses that overlap the body; a zoom circle with no text and no angle number (house rule). R4 counts only where a leader or arc clearly sits on a different body part than its label names. Missing tempo seconds where the facts give none is not a defect.

Pose fixes must be buildable: any pose fix you propose must keep the drawn body segment lengths (upper arm, forearm to grip, thigh, shank, trunk) as they appear in that plate. State the lengths you assume, in px, measured on the image. A finding whose own fix needs a longer or shorter segment does not count, so check your fix before you write it.

For every item scored 3 or less, give a finding: the item, the problem, where (pixel coordinates in the 780-px-wide image and which image), and a concrete fix. Be exact and honest; do not invent problems to look strict, and do not pass a real problem to look kind.

Output: write a JSON file <S>/critic-<SET>-results/critic-<N>.json of the form {"plates":[{"label":"T01","scores":{"R1":5,...,"R10":null,"R11":null},"findings":[{"item":"R4","problem":"...","where":"...","fix":"..."}]}, ...], "notes":"..."} with every candidate T01, T02, T03, T04, T05, T06, T07, T08 (label exactly the folder name), then reply with one line "written: <path>".
Use only <S>/critic-<SET>-work-<N>/ for any scratch files (crops and scripts).
```

## 6. Hand critic prompt (C1-C7)

```text
You are a fresh, independent visual critic (run <RUN>) for M/ARC's exercise How-to hand close-ups. Each is a technical drawing of the hands on gym equipment or the floor: a "Right" grip beside a "Wrong" one, shown in a phone app at 390 px wide (the images are 716 px wide, at 2x; give coordinates in the files' own pixels). The owner approved a reference set, and new pairs must reach the same bar. Judge each candidate on its own merits against that bar. Look at every image yourself with the Read tool. Use no other agents or models, and never WebFetch or WebSearch.

Inputs (read only these paths; look nowhere else on disk):
- Reference (owner-approved pairs: the quality bar and the house style): <S>/critic-<SET>/reference/*.png (dark = Silent Black theme, paper = Paper theme).
- Candidates: <S>/critic-<SET>/set/<label>/ with dark.png, paper.png and facts.json (the verified facts the drawing must match). <S>/critic-<SET>/set/README.md lists them. Candidates: T01, T02, T03, T04, T05, T06, T07, T08, T09, T10.

Rubric: score every candidate 1-5 on each item. 5 = as good as the approved reference. 4 = acceptable, at the approved bar. 3 or less = a real problem a careful designer or coach would fix.
- C1 Right and Wrong the correct way round: the Right drawing shows the grip the facts cue, and the Wrong shows the named fault, clearly. Palm direction matches the facts' grip (under, over or neutral).
- C2 thumb placement matches the facts (around, over or beside the equipment or surface the facts name, as stated).
- C3 contact: the equipment or surface the facts name sits where the facts say (palm, base of fingers, heel of the hand, as stated), the hand actually closes on it or rests on it as the facts say, and nothing floats or passes through.
- C4 wrist alignment: in Right, as the facts say (for example straight or in line); in Wrong, the fault is visible when it is a wrist fault.
- C5 the hand reads as a hand at 390 px: finger count, joints bending the right way, proportions, nothing fused or broken.
- C6 equipment truth: the handle or bar is drawn with a believable shape, thickness and attachment, and the same equipment is drawn the same way as in the reference.
- C7 consistent with the reference: line weight, colours, legibility in both themes, and labels and leaders on what they name.

For every item scored 3 or less, give a finding: the item, the problem, where (pixel coordinates in the image's own pixels, and which image), and a concrete fix. Be exact and honest: do not invent problems to look strict, and do not pass a real problem to look kind.

Output: write <S>/critic-<SET>-results/critic-<N>.json in the form {"pairs":[{"label":"T01","scores":{"C1":5,"C2":5,"C3":5,"C4":5,"C5":5,"C6":5,"C7":5},"findings":[{"item":"C3","problem":"...","where":"...","fix":"..."}]}, ...],"notes":"..."}. Include every candidate (T01, T02, T03, T04, T05, T06, T07, T08, T09, T10), and make each label exactly the folder name. Then reply with one line: "written: <path>".
Use only <S>/critic-<SET>-work-<N>/ for any scratch files (crops and scripts).
```

## 7. CARD FIELDS verifier prompt and rules.md template

Prompt (one verifier):

```text
You are a fresh, independent CARD FIELDS verifier for M/ARC's exercise How-to plates. Each card in the set carries three keys a builder wrote: plateFacts, tempo and topFault. Check every one of them, on every card, against the card's verified research (its claims, quotes, plate fields and handlingMistakes) and the rules. Be exact and honest: never invent a problem, and never pass a real one.

Read only these paths (no git, no network, no other files):
- <S>/cf<SET>/copy/rules.md (the rules; read it first and apply it exactly);
- <S>/cf<SET>/copy/cards/<id>.json and <S>/cf<SET>/copy/quotes/<id>.json;
- <S>/cf<SET>/copy/tempo.json (the phase map), <S>/cf<SET>/copy/faultmap.md (the ruled fault→key map), and <S>/cf<SET>/copy/tells/<id>.txt (the drawn plates' Mistake tells).

For each of the <K> cards:
1. plateFacts: every fact is stated by a verbatim quote of the claim it names, and every number or contact a quote gives for a drawn pose (through the pose map in rules.md) is a fact, with the right landmark, pose and cardPose. [] is right only when no such number or contact exists.
2. tempo: rebuild the phase array yourself from tempo.json and the card's plate.tempo, and compare it exactly.
3. topFault: check it against plate.mistake, handlingMistakes[0], drawable, faultmap.md and the tells, as rules.md says.

Output: write <S>/cf<SET>-results/verify.json as {"cards":[{"id":"...","plateFacts":"ok"|"wrong","tempo":"ok"|"wrong","topFault":"ok"|"wrong","findings":[{"key":"...","problem":"...","evidence":"...","fix":"..."}]}],"notes":"..."}, with all <K> ids. Then reply with one line: "written: <path>".
```

The rules.md template below is pilot B's copy (D-LIB11-FACTS2). For each batch, change the "Drawn status" list, the pose map table (which cards draw the card's start as the spec's `end`) and any ruled joint conventions:

```markdown
# Rules for the three card keys (pilot B, 4 cards)

Each card in cards/ carries three top-level keys: `plateFacts`, `tempo` and `topFault`. Everything else in a card is the verified research card and is the source you check against.

## Drawn status on this head
- This set holds 4 cards, all drawn: smith_machine_bench_press, seated_leg_curl, cable_fly, push_up. Each has tells/<id>.txt.
- tempo.json may name crunch, which is not in this set. Ignore it.

## Pose map
- A fact's `pose` names the spec's pose, not the card's. A fact with no pose is the spec's `end`.
- push_up draws the card's end as the spec's `start`:

| id | spec `start` = card | spec `end` = card |
|---|---|---|
| push_up | plate.end (bottom, chest at the floor) | plate.start (top, arms straight) |
| smith_machine_bench_press, seated_leg_curl, cable_fly | plate.start | plate.end |

- A fact's pose is checked through this map: take the card pose (plate.start or plate.end) that its quote states and map it to the spec pose. A fact whose pose is the card's own word for that pose, not its image under the map, is wrong.
- A setup quote (how to set up or get into position before the rep) states the card's start pose only (D-LIB9-FACTPOSE). A contact is never carried to another pose by inference.

## plateFacts (D-LIB9-CARDFIELDS, D-LIB8M-FACTS, D-LIB11-FACTS2)
- Shape: `[{kind: 'angle'|'contact'|'height', joint|landmark, pose?, cardPose?, deg|m, measure?, claim, note?}]`.
- Every value must be stated by a verbatim quote of the claim it names (the card's `claims[].quotes`, and quotes/<id>.json where present).
- A fact with `measure: true` is checked against the plate's measure callout and carries no `joint`. A joint fact uses the joint-angle convention (flexion in degrees). Ruled for this set: smith_machine_bench_press's `sh.r.elev` is the 3D angle between the upper arm and the trunk.
- D-LIB8M-FACTS: every number a quote gives for a pose the plate draws (start or end) must be a plate fact. A quoted range [a, b] is written as its midpoint with a note holding the quote and the range, only when b − a ≥ 4.
- `[]` is allowed only when no quote gives a number or a contact for a pose the plate draws.

### Contact facts (D-LIB11-FACTS2, the same rule as D-LIB13-FACTS2)
- Shape: `{kind: 'contact', landmark, pose, cardPose, claim}`. One contact fact per checked landmark, so one quoted contact can give two facts.
- `landmark`: a body landmark on the body part the quote says touches the equipment or support. A contact along a segment is checked at the landmarks at its two ends (the shin at knee and ankle, the thigh at hip and knee, the trunk's front at chest and navel; a hand at the wrist). `.r` and `.l` name the body's right and left side; where a quote names a side, the landmark takes that side.
- The body model's landmarks (no others exist): shoulder, shoulderTop, elbow, wrist, grip (the hand's grip point), hip, knee, ankle, heel, ball, toe, sole (mid-sole), thighTop (top of the thigh just above the knee), thighUnder (under the mid-thigh), trap (each with .l/.r); and hips, lumbar, neck, shoulders, grips (midpoint of the two hands' grip points), head, ear, chin, chest, sternum, navel, backUpper, backMid, sacrum, buttock, seat (under the pelvis, the sitting point).
- `cardPose`: the card pose (`start` = plate.start, `end` = plate.end) where the quoted contact holds.
- `pose`: the pose map's image of `cardPose`. Wrong if it is not.
- `claim`: the card claim whose verbatim quote states that contact (that body part touching, against, on or in the bar, the bench, the pad, the seat, the handles, or the floor or mat). A quote that places the item at the body part without saying it touches, or that states something else, does not support the fact.
- Every contact a quote states for a pose the plate draws must be a fact, unless the body model has no landmark on that body part (then the card must say so in a note or the fact is simply absent; report it as a finding only if a listed landmark lies on that body part).

## tempo (D-LIB9-CARDFIELDS, D-LIB8M-TEMPO, lib4-cards 14.7)
- The spec's phase array `[{phase, s, move?}]`, compared exactly.
- Built only from tempo.json (the phase map) and the card's verified `plate.tempo`: a row's `s` is plate.tempo[from]; the concentric phase takes `up`, the eccentric takes `down`, and a hold after the concentric takes `pause` only if pause > 0. Phase names, order and move flags are the card's rows in tempo.json; the order follows the drawn order (the pose map).
- Any other static phase may be a constant only when a quote states its seconds. No Rest phase.

## topFault (lib4-cards 13 Q1; the ruled fault→key map in faultmap.md)
- drawable:true card (plate.mistake.drawable): topFault is the ruled key of plate.mistake's fault. It is wrong if it names any other fault.
- Where tells/<id>.txt exists (the drawn plates) on a drawable:true card, the tell carrying the topFault key must name plate.mistake's fault.
- drawable:false card: topFault names the card's own top fault and must differ from the drawn Mistake's key (faultmap.md's first tell key).
```

## 8. Research verify (LR-29)

Research cards are verified before a batch's research head is named. Every round has:
- a history-free copy of the changed cards and quotes;
- 2 plants, one of them tier A and rated blocker;
- one blind Opus critic that re-fetches every source with `curl -sL` (never WebFetch or WebSearch), redoes LR-31 and LR-33, and checks every claim against its quotes;
- the supervisor's own 10 % re-fetch: every quote must be verbatim in the raw HTML; inline tags can hide a match, so check the raw text.

The examples are `lb3-research-verify.md` and `pb-research-verify.md` in this folder. Rulings are R-<BATCH>-n; follow-ups are F-<BATCH>-n.

## 9. Usage meter (owner rule: pause at 80 % of the weekly limit)

The plan meter is in any busy session's events: `list_events(session_id, kinds:["rate_limit_event"])` → `rate_limit_info.unifiedWindows.seven_day.utilization`, together with `resetsAt` (epoch seconds; the weekly reset is Sat 11:00 UTC).
- Check it every tick, and every 20 minutes from 0.75.
- At 0.79-0.80, tell every working session to finish its current step, push once, post WAITING and stop. Then disable the hourly routine and schedule a one-shot resume just after the reset.
- Finishing work costs about 2-3 % (the 10-19 pause began at 0.79 and ended at 0.82).
- A panel of 3 critics costs about 0.7 M tokens.
