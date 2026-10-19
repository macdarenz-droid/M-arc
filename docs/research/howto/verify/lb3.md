# LB3 research verify (lb3): record

Record of the LR-29 verify of the 10 LB3 non-pilot cards (#272) and its one fix round. Source: docs/supervisor/verify/lb3-research-verify.md @ 321e77d4 (claude/sup-lib4-cards).

## Run
- Verified head: #272 @ 14ca323b. The supervisor made a history-free copy of the 10 cards and their quotes and split it into two blind halves of 5 cards. Each half had one fresh Opus critic and 2 supervisor plants (one tier-A safety line each), with plantScope = every field. The critics re-fetched every source with curl (PubMed through NCBI efetch).
- h1 (pendlay_row, one_arm_dumbbell_row, t_bar_row, landmine_row, dumbbell_romanian_deadlift): VALID. Both plants were caught as blockers, the tier-A plant among them. 22 sources, 188/188 quotes verbatim.
- h2 (conventional_deadlift, sumo_deadlift, back_extension, dumbbell_shrug, cable_shrug): VALID. Both plants were caught as blockers, the tier-A plant among them. 29 sources, 171/171 quotes verbatim.
- Supervisor 10 % re-fetch: 36 of 359 quotes, 36/36 verbatim.
- LR-31 and LR-33: the critics agree with all 10 picks and all 10 tempos.
- Real findings, plants removed: 0 blocker, 0 high, 6 medium, 66 low.

## Rulings
- R-LB3-1: the 4 plant findings are not on the real head. No action.
- R-LB3-2: the judgement calls stand (DB RDL Sweat, conventional Cherni, back_extension FitnessVolt, pendlay BarBend, cable_shrug LR-36). The rankNotes gain the set-aside hits the critics named.
- R-LB3-3: the shared breath line becomes "Heavy reps with a held breath send blood pressure very high." It is applied on all 8 LB3 cards that carry it; the ruling said 7, the head has 8: pendlay, t_bar, landmine, DB RDL, conventional, sumo, both shrugs. F-LB3-1 (pilot A's barbell_row, barbell_shrug, romanian_deadlift) is applied when LB3 ships (LIB-13).
- R-LB3-4: the three shoulder rows keep "Stop the set. Don't train through the pain." Each now cites a claim holding two fetched NHS Shoulder pain quotes: "do not do things that seem to make it worse" and "do not make up your own strenuous exercises or use heavy gym equipment" (MECH, applied to training). The source is data only. means is "Is it getting worse?" (LR-28). F-LB3-2 (LB2's shoulder rows) is left to the next research pass.
- R-LB3-5: every card has a notes entry naming grip.handContact and the drawn palm direction as drawing conventions, with its wrist value recorded as this card's convention. F-LB3-3 (the hold wrist across cards) is for the hand lane.
- R-LB3-6: back_extension c17 (mayer1999) is cited on setup[2] (hands behind the head is harder). conventional_deadlift c16 (lee2018) is cited on feel.primary glutes.
- R-LB3-7: every other finding takes the critic's fix as written (table below). conventional_deadlift's tempo.text names the bottom dead start with no seconds; pause stays 0.
- R-LB3-8: one round only.
- R-LB3-9 (supervisor, during the fix round): back_extension's plate.variantLine was null while its library row says "Bodyweight / Machine" (D-LIB5-VARIANT). It now names the drawn 45-degree bench with body weight. A new claim, c22 (StrengthLog: "The back extension exercise can be performed on a mat or bench, or using a back extension machine.", re-fetched by curl, verbatim), says that bench is a back extension machine. Only c15 covers the seated back-extension machine, so its setup and technique are in gaps.

## Fix round checks
- Valid JSON: all 20 files.
- Dry run: 0 errors. Claims match the quotes files one for one, there is no orphan source, every cited claim resolves, every quote is at most 50 words and verbatim, and every phrase quoted in a rankNote or tempo.text is on its page.
- Copy lint (main's lintHowto) and C8 (checkC8): 0 hits on the 10 cards.
- New quotes: 13 new quote entries (pendlay c10; one_arm, dumbbell_shrug and cable_shrug NHS shoulder pair; DB RDL c10, c15, c24; conventional c11; sumo c17; back_extension c21) and 7 note phrases, re-fetched fresh by curl: 20/20 verbatim.
- New sources: nhs-shoulder-pain (3 shrug and row cards); baechle-grip on dumbbell_romanian_deadlift.

## Finding → fix
All fixes are in the fix-round commit named on #272 as "LB3 RESEARCH FIXED".

| finding | sev | fix |
|---|---|---|
| dumbbell_romanian_deadlift-1 | medium | rows[2]: c10 gains the "strength ... hamstrings and glutes" quote; means "Fault: using the back to stand up."; fix "Use your glutes and hamstrings to stand up." [c10, c5]; no rounding claim |
| dumbbell_romanian_deadlift-2 | low | tells[0] "Tension in the backs of thighs" |
| dumbbell_romanian_deadlift-3 | low | handlingMistakes[0] (arching) cites [c10, c5] |
| dumbbell_romanian_deadlift-4 | low | checkpoints[1] [c4, c3]; checkpoints[2] [c8, c10]; posture[2] [c9, c3]; plate.end names c8, c10 for the flat back |
| dumbbell_romanian_deadlift-5 | low | rankNote: the gaze ties a fault to harm but loses the step-2 tie to the listed rounded back |
| dumbbell_romanian_deadlift-6 | low | new c24 (baechle-grip, MECH); zooms[0] cites [c4, c1, c24] |
| dumbbell_romanian_deadlift-7 | low | c13 drops "usually"; c15 gains "Keep them straight and keep your hands close to your legs." |
| dumbbell_romanian_deadlift-8 | low | breath line (R-LB3-3) |
| dumbbell_romanian_deadlift-9 | low | notes: hand-contact convention (R-LB3-5) |
| landmine_row-1 | low | tells[0] "Bar end comes up toward your chest"; plate.end "bar end pulled toward the chest" |
| landmine_row-2 | low | plate.mistake [c9, c11]; handlingMistakes[0] and rows[1] [c11, c5] |
| landmine_row-3 | low | handlingMistakes[1].fix "Controlled, deliberate pulls." |
| landmine_row-4 | low | zooms[1] [c3, c9, c5, c11] |
| landmine_row-5 | low | risks[1] "Of the rows tested, the bent-over row loaded the lower spine most." |
| landmine_row-6 | low | breath line (R-LB3-3) |
| landmine_row-7 | low | notes: hand-contact convention (R-LB3-5) |
| one_arm_dumbbell_row-1 | medium | plate.mistake.what names the shoulder blade not pulled back at the top |
| one_arm_dumbbell_row-2 | medium | rows[3]: NHS shoulder claim c20 (R-LB3-4); "Pain in your shoulder" / "Is it getting worse?" / stop line |
| one_arm_dumbbell_row-3 | low | notes: ACE vs StrengthLog bottom position; the card keeps ACE |
| one_arm_dumbbell_row-4 | low | handlingMistakes[0] (momentum) [c10, c14, c8] |
| one_arm_dumbbell_row-5 | low | setup[4] [c3, c5]; checkpoints[2] [c9, c6] |
| one_arm_dumbbell_row-6 | low | zooms[0].wrong "Hand far forward of the shoulder." |
| one_arm_dumbbell_row-7 | low | notes: palm direction convention (R-LB3-5) |
| one_arm_dumbbell_row-8 | low | rear_delts moved to feel.primary; libraryDiff.why gives the reason |
| one_arm_dumbbell_row-9 | low | notes: hand-contact convention (R-LB3-5) |
| pendlay_row-1 | low | c10 gains "Proper Pendlay row form requires keeping both feet firmly planted on the floor from start to finish." |
| pendlay_row-2 | low | zooms[1] [c5, c2, c6] |
| pendlay_row-3 | low | plate.equipment drops "under the shoulders" |
| pendlay_row-4 | low | c6 text "probably means" |
| pendlay_row-5 | low | risks[1] "Of the rows tested, the bent-over row loaded the lower spine most." |
| pendlay_row-6 | low | breath line (R-LB3-3) |
| pendlay_row-7 | low | notes: hand-contact convention (R-LB3-5) |
| t_bar_row-1 | low | tells[0] "Handle comes up toward your lower chest"; plate.end "handle pulled toward the lower chest" |
| t_bar_row-2 | low | handlingMistakes[2].fix "Lower all the way each rep."; posture[4] [c9, c5] |
| t_bar_row-3 | low | notes: plate.start's arms-straight-down is a drawing convention |
| t_bar_row-4 | low | zooms[1] [c3, c2, c7] |
| t_bar_row-5 | low | variantLine: c6 moves to the free-standing list |
| t_bar_row-6 | low | breath line (R-LB3-3) |
| t_bar_row-7 | low | notes: hand-contact convention (R-LB3-5) |
| back_extension-1 | low | setup[1] "Feet about shoulder width and secured, knees slightly bent."; notes: FitnessVolt says hip width |
| back_extension-2 | low | handlingMistakes[1] [c9, c8] |
| back_extension-3 | low | tells[1] "Pump in the muscles, not deep ache" |
| back_extension-4 | low | new WEAK tempo claim c21 names up 1 and down 2 a drawing convention; plate.tempo.claim [c8, c21] |
| back_extension-5 | low | rankNote: NHS hits set aside (R-LB3-2) |
| back_extension-6 | low | notes: roll-up vs stiff spine; the card follows FitnessVolt (c6, c19) |
| back_extension-7 | low | c17 cited on setup[2] (R-LB3-6) |
| cable_shrug-1 | medium | rows[2]: NHS shoulder claim c17 (R-LB3-4) |
| cable_shrug-2 | low | setup[0] "Bar attachment on the low pulley."; notes: straight bar is a drawing convention |
| cable_shrug-3 | low | zooms[1] [c5, c3, c4] |
| cable_shrug-4 | low | breath line (R-LB3-3 wording) |
| cable_shrug-5 | low | notes: hand-contact convention (R-LB3-5) |
| conventional_deadlift-1 | low | rankNote: lowering speed, touch-and-go and NHS hits set aside (R-LB3-2) |
| conventional_deadlift-2 | low | tempo.text names the bottom dead start, no seconds; pause 0 |
| conventional_deadlift-3 | low | posture[5] "Push the hips back first. Bend the knees once the bar passes them."; c11 gains the knee-bend quote |
| conventional_deadlift-4 | low | posture[1] "Arms straight." |
| conventional_deadlift-5 | low | risks[0] "A rounded back loads the spine's discs and bones more." |
| conventional_deadlift-6 | low | dl-grip [c3, c21, c4]; dl-start wrong "Rounded lower back, bar away from the shins." [c1, c4, c7, c8] |
| conventional_deadlift-7 | low | breath line (R-LB3-3 wording); notes: conflict with the anchor's brace cue (c5) |
| conventional_deadlift-8 | low | c16 cited on feel.primary glutes (R-LB3-6) |
| conventional_deadlift-9 | low | notes: inherited hand contact and wrist recorded as conventions (R-LB3-5, F-LB3-3) |
| dumbbell_shrug-1 | medium | rows[2]: NHS shoulder claim c19 (R-LB3-4) |
| dumbbell_shrug-2 | low | c13 tagged [CONSENSUS, MECH], text names the barbell drill; setup[0] [c1, c13] |
| dumbbell_shrug-3 | low | checkpoints[0] [c3, c6] |
| dumbbell_shrug-4 | low | handlingMistakes[2] [c7, c8] |
| dumbbell_shrug-5 | low | breath line (R-LB3-3 wording) |
| dumbbell_shrug-6 | low | notes: palm direction and hand contact conventions (R-LB3-5) |
| sumo_deadlift-1 | medium | sumo-grip "Thumbs wrapped, hands inside the knees." [c3, inherit:0]; "Overhand" dropped; palm direction in notes as a convention |
| sumo_deadlift-2 | low | plate.mistake.what drops the chest clause; sumo-start wrong "Hips shot up, bar away from the shins." cites c12 |
| sumo_deadlift-3 | low | c17 gains the "Everything from your foot angle ... requires attention and practice." quote |
| sumo_deadlift-4 | low | inherit[4] points at plate.equipment |
| sumo_deadlift-5 | low | rankNote: StrengthLog deadlift and NHS hits set aside (R-LB3-2) |
| R-LB3-9 | ruling | back_extension variantLine written; c22 added; seated machine in gaps |
| sumo_deadlift-6 | low | breath line (R-LB3-3 wording); notes: conflict with c10's breath-hold cue |
