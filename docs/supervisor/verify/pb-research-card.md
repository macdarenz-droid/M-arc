Research brief R-PB: pilot B top fault (LR-31) and tempo (LR-33) (2026-10-19)

Who: one research session, model claude-opus-5-5, mode auto. It holds no LIB lane slot. Plain fetches go to a helper that names sonnet and uses curl only. Never Haiku.

- Branch claude/libht-research-pb from claude/libht-research @ `892d6516`. Draft PR into claude/libht-research: 'research: pilot B top fault (LR-31) and tempo (LR-33)'.
- Ids (7): smith_machine_bench_press, cable_fly, push_up, seated_leg_curl, crunch (the plates); side_plank and russian_twist (the E-R5 renders, so the owner rules on the cards' real top faults).
- Rules as lb3-research-card.md: curl with a desktop user agent, never WebFetch or WebSearch; write only those 7 cards and quotes files; quotes verbatim, at most 50 words; merge commits only; never plant; never write to the owner.
- (a) LR-31 on each card: the fetcher's scan for step-1 frequency words and harm ties; candidates exclude setup and equipment choices (seated_leg_curl's pad setting); rankNote; handlingMistakes[0] = the top fault; drawable by the census view; if false, plate.mistake names the next drawable fault. R-LB2-20's notes are inputs: smith (flare first?), cable_fly (c7 needs a ruling). 'PICK CHANGED: <id>' and 'STOP <id>' lines; LR-36 for ties.
- (b) LR-33 on each card: crunch's pause 1 needs a WEAK tempo claim that names the 1 s as a convention; cable_fly's c5 1 s stays sourced; check every quote for a pause, hold or squeeze and where it sits.
- No other field changes. Readiness (copy lint and C8 on shown lines) and LR-34 run before each batch ships, not here.
- Verify per LR-29 (focused, open point 1): a history-free copy of the 7 changed cards with 2 plants inside the changed fields (one on tier-A smith), a fresh blind Opus critic that redoes LR-31 and LR-33, the supervisor's 10 % re-fetch; one fix round; merge; 'PILOT B research head <sha>'.

Before READY: valid JSON; the dry run (claims match quotes one for one, no orphan source, quotes at most 50 words and verbatim). Copy lint and C8 report 0 hits on the changed lines. Post 'PB RESEARCH READY @ <sha>' with a table: id, LR-31 step, pick (unchanged or changed), drawable, rankNote added, tempo change, new claims and quotes, fetch counts. Add each 'PICK CHANGED' and 'STOP' line. The supervisor then runs the focused verify.
