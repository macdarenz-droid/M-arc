# W2A edits (merged). Loaded by check.py via exec; defines E (list).
E = []
def ed(**k): E.append(k)

SP = "cards/shoulder_press.json"
SPQ = "quotes/shoulder_press.json"
CU = "cards/chin_up.json"
HK = "cards/hanging_knee_raise.json"
AP = "cards/assisted_pull_up.json"
DK = "shared/dumbbell-kickup.json"
DKQ = "quotes/shared-dumbbell-kickup.json"

# ---------------- shoulder_press ----------------
ed(id="W2-1", sev="high", file=SP, path=["feel","rows",0,"means"], field="feel.rows[0].means", mode="eq",
   old="The shoulder is relatively unstable in the overhead position.",
   new="The shoulder fault to watch here is letting the handles drop on the way down.",
   why="LR-6: place + the source's fault (c6); the bare instability fact read as the pinch's cause.")
ed(id="W2-1", sev="high", file=SP, path=["feel","rows",0,"fix"], field="feel.rows[0].fix", mode="eq",
   old="Stop the set. Next session, you can try the close handles with the elbows pointing forward.",
   new="Stop the set.",
   why="c7 backs the close handles only for 'some discomfort', not a sharp pinch; stricter, content.md 5.2 load wording.")
ed(id="W2-1", sev="high", file=SP, path=["feel","rows",0,"claim"], field="feel.rows[0].claim", mode="eq",
   old=["c6","c7"], new="c6", why="The row no longer uses c7's words.")
ed(id="W2-1", sev="high", file=SP, path=["tierA","loadWording"], field="tierA.loadWording", mode="eq",
   old="Where the load causes the fault, the fix says to lower the weight (content.md 5.2 load wording); the sharp or pinching shoulder row says to stop the set (c6), with the close handles only as a next-session option (c7). No fix says to push through pain.",
   new="Where the load causes the fault, the fix says to lower the weight, and the sharp or pinching shoulder row says to stop the set (content.md 5.2 load wording for both; no source on this card says when to stop). No fix says to push through pain. The close handles (c7) are offered only in setup, for discomfort in the standard press, not after a sharp pinch.",
   why="c6's quotes do not say 'stop the set'; credit moved to content.md 5.2.")
ed(id="W2-1", sev="high", file=SP, path=["gaps",3], field="gaps[3]", mode="eq",
   old="No source on this card says what to do if a sharp shoulder pinch keeps coming back; the row fix does not add one. The shared shoulder red-flag box and the owner disclaimer carry the stop-and-check line.",
   new="No source on this card says what to do after a sharp shoulder pinch, at the next session or if it keeps coming back; the row fix stops at 'Stop the set.' The close handles (c7) are sourced only for some discomfort in the standard press, so they stay in setup[3] and are not offered after a sharp pinch. The shared shoulder red-flag box and the owner disclaimer carry the stop-and-check line.",
   why="Kept accurate after the row edit.")
ed(id="W2-1", sev="high", file=SP, path=["notes"], field="notes (append)", mode="append", expect_len=2,
   new="W2-1 2026-10-18: feel.rows[0] cut to 'Stop the set.' (content.md 5.2 load wording). The next-session close-handle option is dropped: the ACE close-grip page (re-read 2026-10-18) backs the close handles (c7) only for 'some discomfort when performing traditional shoulder presses', not for sharp or pinching pain. Under LR-6, means is rewritten as place + the source's fault (letting the handles drop, c6), replacing the instability fact that read as the pinch's cause. tierA.loadWording no longer credits 'stop the set' to c6; neither ACE page says when to stop. warningLink kept: it cites the row's claim c6.",
   why="Record of the change.")
ed(id="W2-10", sev="medium", file=SP, path=["plate","variantLine"], field="plate.variantLine", mode="eq",
   old="The plate draws the standard handles with the elbows slightly in front of the trunk (c3). The sources do not say which way the palms face on either handle pair; the engine's pivot-arm primitive draws a neutral grip, so a wide-handle option is an equipment gap for the supervisor. The close-handle option (c7) keeps every other rule: same seat, grip, brace, press, lockout and lowering (c1, c2, c4, c5, c6).",
   new="The plate draws the close handles with the elbows pointing forward (c7), as LR-2 rules until a wide-handle option exists. The standard handles with the elbows at 4 and 8 o'clock (c3) are text only. Both handle pairs keep every other rule: same seat, grip, brace, press, lockout and lowering (c1, c2, c4, c5, c6). The sources do not say which way the palms face on either handle pair; the plate shows the pivot-arm primitive's natural grip as a drawing convention (LR-4, see notes).",
   why="LR-2: draw the close handles (c7) until a wide-handle option exists.")
ed(id="W2-10", sev="medium", file=SP, path=["grip","type"], field="grip.type", mode="eq",
   old="Full grip on the machine's handles (c2). The standard handles with the elbows at 4 and 8 o'clock are drawn (c3); the close handles with the elbows pointing forward are the shoulder-friendlier option (c7). Palm direction is not given by the sources.",
   new="Full grip on the machine's handles (c2). The close handles with the elbows pointing forward are drawn; they are the shoulder-friendlier option (c7). The standard handles with the elbows at 4 and 8 o'clock (c3) are text only. Palm direction is not given by the sources.",
   why="Same LR-2 point.")
ed(id="W2-10", sev="medium", file=SP, path=["plate","start"], field="plate.start", mode="eq",
   old="Seated upright, back on the pad with the natural low-back curve (c1, c4); feet planted (c4); handles level with or just above the shoulders (c1); elbows bent under the hands and slightly in front of the trunk (c3); wrists straight (c2).",
   new="Seated upright, back on the pad with the natural low-back curve (c1, c4); feet planted (c4); close handles (c7) level with or just above the shoulders (c1); elbows bent under the hands and pointing forward (c7); wrists straight (c2).",
   why="Drawn start pose is the close-handle pose its quote states (D-LIB9-FACTPOSE).")
_c7q = [{"source":"ace-close-shoulder-press","text":"This position shifts more of the load into the triceps and away from the shoulders.","where":"step 1, starting position"},{"source":"ace-close-shoulder-press","text":"This position is more comfortable and less stressful on the shoulders and more appropriate for individuals who experience some discomfort when performing traditional shoulder presses as it shifts more load into the triceps.","where":"note"}]
_c7new = [{"source":"ace-close-shoulder-press","text":"Grasp the handles closest to your body firmly with a full grip (thumbs clasped around the handles) and maintain a neutral position with your wrists (i.e., wrists in line with your forearms).","where":"step 1, starting position"},{"source":"ace-close-shoulder-press","text":"Position your elbows pointing towards the front of your body (i.e., not in the traditional 3 and 9 o'clock positions where the elbows are aligned with the midline of your trunk).","where":"step 1, starting position"}] + _c7q
ed(id="W2-10", sev="medium", file=SP, path=["claims",("id","c7"),"quotes"], field="claims[id=c7].quotes (two new step-1 quotes in front)", mode="eq",
   old=_c7q, new=_c7new, newquote=True,
   why="The close-handle pose needs its own verbatim quotes (D-LIB9-FACTPOSE).")
_c7f = lambda q: {"claim":"c7","source":"ace-close-shoulder-press","quote":q,"status":"verbatim","closest":q}
ed(id="W2-10", sev="medium", file=SPQ, path=["quotes"], field="quotes: insert the two new c7 entries right before the existing c7 entries (head quotes[10])", mode="insert_before_claim", claim="c7",
   old=[_c7f(_c7q[0]["text"]), _c7f(_c7q[1]["text"])], new=[_c7f(_c7new[0]["text"]), _c7f(_c7new[1]["text"])], newquote=True,
   why="Quotes file matches the card, in card order.")
ed(id="W2-10", sev="medium", file=SP, path=["notes"], field="notes (append)", mode="append",
   new="W2-10 2026-10-18: Per LR-2 the plate draws the close handles with the elbows pointing forward (c7) until a wide-handle option exists. The standard 4-and-8 o'clock handles (c3) stay as text (posture, setup). Per LR-4 the palm direction is a drawing convention, not a claim: no source names it, so the plate shows the pivot-arm primitive's natural grip (neutral, per verify/g1.md 4.1b). ACE 187 (seated-machine-close-grip-shoulder-press) re-read by curl on 2026-10-18 (200). Two step-1 sentences added to c7 as verbatim quotes: 'Grasp the handles closest to your body ...' and 'Position your elbows pointing towards the front of your body ...'. This makes the drawn close-handle start pose the pose its quote states (D-LIB9-FACTPOSE).",
   why="Record of the change.")
ed(id="W2-12", sev="low", file=SP, path=["feel","rows",2,"means"], field="feel.rows[2].means", mode="eq",
   old="The elbow rule here is to stop short of locking.",
   new="Fault: the elbows lock at the top.",
   why="LR-6: name the source's fault (c6, ACE 186 step 3), not repeat the fix.")
_tempo = "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
_load = "Load goes up by 2-10% once the target reps are beaten by one or two."
_q1 = {"source":"acsm2009","text":"For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training","where":"abstract"}
_q2 = {"source":"acsm2009","text":"with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)","where":"abstract"}
_q3 = {"source":"acsm2009","text":"When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.","where":"abstract"}
ed(id="W2-14", sev="low", file=SP, path=["claims",("id","c12"),"text"], field="claims[id=c12].text", mode="eq",
   old=_tempo + " " + _load, new=_tempo, why="Claims are atoms (content.md 3.2); tempo stays WEAK (LR-15).")
ed(id="W2-14", sev="low", file=SP, path=["claims",("id","c12"),"quotes"], field="claims[id=c12].quotes (drop the load quote)", mode="eq",
   old=[_q1,_q2,_q3], new=[_q1,_q2], why="The load quote moves to c13.")
ed(id="W2-14", sev="low", file=SP, path=["claims"], field="claims (append new c13)", mode="append", expect_len=12,
   new={"id":"c13","text":_load,"tags":["CONSENSUS"],"sources":["acsm2009"],"quotes":[_q3]},
   why="The load rule is not limited to intermediate/advanced lifters, so CONSENSUS only.")
ed(id="W2-14", sev="low", file=SP, path=["setup",4,"claim"], field="setup[4].claim", mode="eq", old="c12", new="c13", why="Load line cites the load claim.")
ed(id="W2-14", sev="low", file=SP, path=["tierA","loadProgression"], field="tierA.loadProgression", mode="eq",
   old="Setup step: add 2-10% only when you beat your target reps by one or two (c12).",
   new="Setup step: add 2-10% only when you beat your target reps by one or two (c13).", why="Same.")
ed(id="W2-14", sev="low", file=SPQ, path=["quotes",24,"claim"], field="the c12 entry whose quote starts 'When training at a specific RM load' (head quotes[24]; quotes[26] after W2-10's two inserts): claim", mode="eq",
   old="c12", new="c13", why="Quotes file follows the split.")
ed(id="W2-14", sev="low", file=SP, path=["notes"], field="notes (append)", mode="append",
   new="W2-14 2026-10-18: the old c12 is split into atoms (content.md 3.2). c12 keeps the ACSM tempo, which is for intermediate to advanced lifters (LR-15), tagged CONSENSUS and WEAK, and cited by plate.tempo. The new c13 holds the ACSM 2-10% load rule, a separate sentence of the abstract that is not limited by training level (re-read by efetch, PMID 19204579), tagged CONSENSUS. setup[4] and tierA.loadProgression now cite c13.",
   why="Record of the change.")
ed(id="W2-53", sev="ruling", file=SP, path=["inherit"], field="inherit[0..4] LR-34 re-check + notes (append the result)", mode="task",
   new="Re-run the LR-8 check of all 5 inherit entries against cards/machine_chest_press.json on head 5036283d (the parent card, LR-34; golden-B is a source map only). Append one notes entry that records holds or fails for each of inherit[0]-[4] with the parent field or claim id that supports it. Apply LR-34 to any that fail: the child's own fetched, quoted claim; or an LR-4 drawing convention in notes (drawing choice only); or remove the line and add a gaps entry. Never keep a line on golden-B alone.",
   why="LR-34 (W2-53): the parent card governs inherited lines.")

# ---------------- chin_up ----------------
_nsca = "NSCA-editor textbook guidance is to perform all grips with the thumbs around the bar."
ed(id="W2-7", sev="medium", file=CU, path=["claims",("id","c21"),"tags"], field="claims[id=c21].tags", mode="eq",
   old=["CONSENSUS"], new=["CONSENSUS","WEAK"], why="Quote is from a floor-to-thigh barbell drill; inferred for the bar hang (CARD-V2).")
ed(id="W2-7", sev="medium", file=CU, path=["claims",("id","c21"),"text"], field="claims[id=c21].text", mode="eq",
   old=_nsca, new=_nsca + " Written for barbell lifts (a drill lifting a bar from the floor); applied to the chin-up bar by inference.", why="Same.")
ed(id="W2-8", sev="medium", file=CU, path=["feel","rows",1,"means"], field="feel.rows[1].means", mode="eq",
   old="Usually means you are starting the pull with your shoulders up by your ears.",
   new="Fault: starting the pull with your shoulders up by your ears.", why="LR-6: no source links the feeling to the shrug; place + fault + fix.")
ed(id="W2-8", sev="medium", file=CU, path=["feel","rows",2,"means"], field="feel.rows[2].means", mode="eq",
   old="Usually means the shoulder does not like this arms-overhead, palms-toward-you position.",
   new="Arms high overhead narrow the space under the shoulder roof.", why="LR-6: no sourced pain-to-cause link; the parent's sourced risk wording.")
ed(id="W2-8", sev="medium", file=CU, path=["feel","rows",2,"fix"], field="feel.rows[2].fix", mode="eq",
   old="Stop the set. If it keeps happening or lasts, stop chin-ups.",
   new="Stop the set. Don't train through the pain.", why="LR-28: no sourced time; the time sits in the linked NHS box.")
ed(id="W2-8", sev="medium", file=CU, path=["feel","rows",3,"fix"], field="feel.rows[3].fix", mode="eq",
   old="Build up the sets slowly. If it lasts, don't train through it.",
   new="Build up the sets slowly. Don't train through the pain.", why="Same LR-28 point.")
_w28 = "W2-8 2026-10-18: No card source gives a time for shoulder or elbow pain. NASM (re-fetched, 200) says only 'persists'. So the red-flag row fixes say 'Stop the set. Don't train through the pain.' with no time, and the time comes from the linked NHS boxes (shoulder: no better after two weeks; elbow: no better after a few weeks) (LR-28). The shrug and shoulder rows have no sourced link from the feeling to a cause: Bullbar names the shrug only as a fault, and Prinold 2016 (efetch) links arm position to impingement risk, not pain to a cause. So they read place + the source's fault + fix, with no 'usually means' (LR-6). The elbow rows keep 'usually means', because NASM links elbow tendon irritation to overuse."
ed(id="W2-8", sev="medium", file=CU, path=["notes"], field="notes (append)", mode="append",
   new=_w28, why="Record of the change.")
ed(id="W2-5", sev="medium", file=CU, path=["zooms",0,"claim"], field="zooms[0].claim", mode="eq", status="superseded",
   old=["c3","c1","c20"], new=["c3","c1","c20","inherit:0","inherit:1"],
   why="Superseded by W2-53/LR-34: the zoom drops 'bar across the top of the palm' and 'under'; c1 already backs 'thumb wrapped around the bar'. Do not apply.")
ed(id="W2-53", sev="ruling", file=CU, path=["inherit"], field="inherit (replace array)", mode="eq", oldnote="ruling gave a summary; exact head value shown",
   old=None,  # filled from head
   new=[{"field":"grip.thumb (wrapped, never thumbless by default)","why":"true for this child because the lifter is still what falls if the hand opens, and ACE's chin-up setup itself asks for thumbs wrapped (c1, c21); parent c3."},{"field":"zooms.hand (full grip, thumb around the bar, is the only grip shown)","why":"true for this child because the thumb rule on a hang does not depend on palm direction (parent zoom 'hand' and c3; content.md 5.2 C4)."}],
   why="LR-34: hand contact, bar height and chalk are not on the pull_up card.")
ed(id="W2-53", sev="ruling", file=CU, path=["grip","handContact"], field="grip.handContact", mode="eq",
   old="Inherited from pull_up: bar across the top of the palm where the fingers start.",
   new="Not sourced: drawn as the bar primitive's natural hang grip (LR-4 drawing convention; the pull_up card does not source it, LR-34).", why="LR-34.")
ed(id="W2-53", sev="ruling", file=CU, path=["grip","thumb"], field="grip.thumb", mode="eq",
   old="Wrapped around the bar to meet the index finger (inherited from pull_up; ACE also asks for it).",
   new="Wrapped around the bar (c1, c21; inherited from pull_up, parent c3).", why="LR-34.")
ed(id="W2-53", sev="ruling", file=CU, path=["zooms",("key","hand"),"right"], field="zooms[key=hand].right (zooms[0])", mode="eq",
   old="Palm facing the face, bar across the top of the palm, thumb wrapped under, wrist straight in line with the forearm.",
   new="Palm facing the face, thumb wrapped around the bar, wrist straight in line with the forearm.", why="LR-34; this also settles W2-5 for chin_up.")
ed(id="W2-53", sev="ruling", file=CU, path=["notes",0], field="notes[0] (substring)", mode="sub",
   old="the pull_up card's setup lines are inherited for bar height and chalk.",
   new="bar height and chalk are not sourced on the pull_up card or here, so no line says them (LR-34).", why="LR-34.")
ed(id="W2-53", sev="ruling", file=CU, path=["notes"], field="notes[1]..notes[5] (the five 'W2A LR-8: inherit[n] holds' notes) -> one note", mode="replace_range", start=1, end=6, startswith="W2A LR-8: inherit[", oldnote="ruling gave a summary; exact head values are notes[1]-notes[5]",
   new=["W2A LR-8 check redone under LR-34 against cards/pull_up.json on this head (golden-B research is a source map only): the thumb holds (parent c3; c1 and c21 here); the hand zoom's full-grip-only rule holds (parent zoom 'hand', c3; content.md 5.2 C4); hand contact, bar height and chalk fail because the parent card does not source them. Those inherit entries are removed: hand contact is an LR-4 drawing convention, and bar height and chalk are not shown."],
   why="LR-34.")

# ---------------- hanging_knee_raise ----------------
ed(id="W2-2", sev="low", file=HK, path=["feel","rows",2,"means"], field="feel.rows[2].means", mode="eq",
   old="The straight-leg version measured about 3000 N of spine compression; bent knees likely load the spine less (inference).",
   new="The straight-leg version measured about 3000 N of spine compression; bent knees likely load the spine less.",
   why="LR-27/LR-23: research label on a shown line; 'likely' keeps how sure.")
ed(id="W2-7", sev="medium", file=HK, path=["claims",("id","c3"),"tags"], field="claims[id=c3].tags", mode="eq",
   old=["CONSENSUS"], new=["CONSENSUS","WEAK"], why="Floor-drill quote applied to a hang by inference (CARD-V2).")
ed(id="W2-7", sev="medium", file=HK, path=["claims",("id","c3"),"text"], field="claims[id=c3].text", mode="eq",
   old=_nsca, new=_nsca + " Written for barbell lifts (a drill lifting a bar from the floor); applied to the hanging bar by inference.", why="Same.")
ed(id="W2-7", sev="medium", file=HK, path=["setup",1,"claim"], field="setup[1].claim", mode="eq",
   old="c2", new=["c2","c3"], why="'thumbs wrapped' had no cited claim (c2's quote has no thumb words).")
ed(id="W2-3+W2-53", sev="low", file=HK, path=["notes",0], field="notes[0]", mode="eq", merged=True,
   old="Yessis also advises holding the breath and a slight lower-back arch at the start; neither is used, because the parent card and other sources teach a still, quiet hang and no source here supports breath-holding. Not sourced: a safe way down from the bar (inherited from the parent's box line). Escamilla 2006 measured the knee-up in arm straps, not a bare-hand hang. McGill 2015 measured straight legs only. The StrengthLog hanging knee raise page was re-fetched on 2026-09-30 (access full, quotes verbatim). feel.rows[3].fix comes from the inherited active-hang line (inherit[5]), not from a claim on this card.",
   new="Yessis also advises holding the breath and a slight lower-back arch at the start; neither is used, because the parent card and other sources teach a still, quiet hang and no source here supports breath-holding. Not sourced: a safe way down from the bar. Escamilla 2006 measured the knee-up in arm straps, not a bare-hand hang. McGill 2015 measured straight legs only. The StrengthLog hanging knee raise page was re-fetched on 2026-09-30 (access full, quotes verbatim).",
   why="Merged: W2-3 (the box line implied a way down, LR-3) + W2-53 (delete the inherit[5] sentence). W2-3's 'inherited box line (inherit[3])' sentence is dropped, because LR-34 removes inherit[3].")
ed(id="W2-3/W2-6", sev="low", file=HK, path=["feel","rows",3,"fix"], field="feel.rows[3].fix", mode="eq", status="superseded",
   old="Set the shoulders a little down from the ears before each rep (the inherited active hang).",
   new="Set the shoulders a little down from the ears before each rep.",
   why="Superseded by W2-53's rows[3] instruction (the active hang fails under LR-34). Do not apply.")
ed(id="W2-6", sev="low", file=HK, path=["feel","rows",3,"means"], field="feel.rows[3].means (only if rows[3] stays after the W2-53 step)", mode="eq", status="conditional",
   old="Arms high overhead narrow the space under the shoulder roof (measured in pull-ups).",
   new="Arms high overhead narrow the space under the shoulder roof.",
   why="Study note on a shown line, over the row limit; how sure stays in c15.")
ed(id="W2-53", sev="ruling", file=HK, path=["feel","rows",3], field="feel.rows[3] (Shoulder row; fix cites inherit:5)", mode="task",
   old=None,
   new="Replace the fix with one from a fetched, quoted source added to this card (fetcher-checked); the row then cites [\"c15\", \"<new claim>\"]. If none is found: remove rows[3], drop 'shoulder' from redFlags if no row links it, and add to gaps: \"No sourced fix for the shoulder feel row: the parent card has no active-hang line (LR-34). The shoulder risk line (c15) stays.\"",
   why="LR-34: the fix rests only on the failed active hang (inherit:5).")
ed(id="W2-6", sev="low", file=HK, path=["feel","rows",1], field="feel.rows[1] (grip row)", mode="task", status="conditional",
   old=None,
   new="W2-6's proposed means/fix/claim (cite inherit:4) are void: LR-34 removes inherit[4] (straps fail on the parent card). Same route as rows[3]: if a fetched, quoted source added to this card (fetcher-checked) links straps or ab slings to grip giving out, set means \"Usually means your grip ends the set before your abs are tired.\", fix \"Use straps or ab slings.\", claim [\"<new claim>\", \"c10\"]. If none is found, leave rows[1] exactly as on the head and add to gaps: \"No sourced link from grip giving out to straps or ab slings: the parent card has no strap line (LR-34); feel.rows[1] keeps the c10 wording.\"",
   why="Conflict W2-6 x W2-53, resolved by applying LR-34's ways out; nothing invented. Supervisor: the head row's means is still not a 'usually means' line (open, see findings).")
ed(id="W2-5", sev="medium", file=HK, path=["zooms",0,"claim"], field="zooms[0].claim", mode="eq", status="superseded",
   old=["c16","c2","c3"], new=["c16","c2","c3","inherit:1"],
   why="Superseded by W2-53/LR-34: the zoom drops 'bar across the base of the fingers'. Do not apply.")
ed(id="W2-53", sev="ruling", file=HK, path=["inherit"], field="inherit (replace array)", mode="eq", oldnote="ruling gave a summary; exact head value shown",
   old=None,
   new=[{"field":"grip.wrist (not curled forward)","why":"true for this child because the same overhand hang loads the hand the same way (c2, c16; parent c18)."},{"field":"grip.thumb (wrapped every set)","why":"true for this child because the lifter still falls if the hand opens (c3; parent c17)."},{"field":"setup: jump, or step up on a low stool, to reach the bar","why":"true for this child because the bar and the hang are the same (parent c1)."}],
   why="LR-34: width, hand contact, box-clear, chalk, straps and active hang are not on the parent card.")
ed(id="W2-53", sev="ruling", file=HK, path=["grip","width"], field="grip.width", mode="eq",
   old="Inherited: about shoulder width.",
   new="Not sourced (the parent card gives no width): LR-4 drawing convention (LR-34).", why="LR-34.")
ed(id="W2-53", sev="ruling", file=HK, path=["grip","handContact"], field="grip.handContact", mode="eq",
   old="Inherited: bar across the base of the fingers.",
   new="Not sourced (the parent card does not source it): LR-4 drawing convention (LR-34).", why="LR-34.")
ed(id="W2-53", sev="ruling", file=HK, path=["zooms",("key","hand"),"right"], field="zooms[key=hand].right (zooms[0])", mode="eq",
   old="Overhand, bar across the base of the fingers, thumb wrapped, wrist not curled.",
   new="Overhand, thumb wrapped, wrist not curled.", why="LR-34; this also settles W2-5 for hanging_knee_raise.")
ed(id="W2-53", sev="ruling", file=HK, path=["gaps",0], field="gaps[0] (substring)", mode="sub",
   old="the parent's box-clear setup line is inherited, nothing new invented.",
   new="the parent card has no box-clear setup line, so none is inherited (LR-34).", why="LR-34.")
ed(id="W2-2", sev="low", file=HK, path=["notes"], field="notes (append)", mode="append", expect_len=2,
   new="Verify w2 2026-10-18 (W2-2): feel.rows[2].means lost '(inference)' (LR-27 plain words; 'likely' keeps how sure). The fix 'Keep the knees bent.' is kept: it is the sourced progression (c13, c14: straight legs are the version measured at about 3000 N), not a stop line. No source on this card supports 'Stop the set. Don't train through the pain.', so none is added (LR-6 R1). Re-read by efetch: McGill 2015 (PMID 25111163) has no bent-knee load and no advice line; Escamilla 2006 (PMID 16649890) names the Power Wheel knee-up, reverse crunch and bent-knee sit-up, not the hanging knee-up, as possibly problematic for low back problems. gaps[2] and the pending redFlag 'back' stand.",
   why="Record of the change.")
ed(id="W2-6", sev="low", file=HK, path=["notes"], field="notes (append)", mode="append", merged=True,
   new="Verify W2-6 2026-10-18: feel.rows[3].means drops '(measured in pull-ups)' (kept only if the row stays after the LR-34 step); how sure stays in c15 (MECH, applied to a hang by reasoning). W2-6's straps fix for feel.rows[1] (cite inherit:4) is void under LR-34: the parent card has no strap line, and the Yessis page (curl 200, 2026-10-18) mentions no straps or slings. risks[0] and feel.rows[1].where kept: no source or study wording.",
   why="Merged: W2-6's note minus its LR-8 golden-sheet basis (void under LR-34).")
ed(id="W2-53", sev="ruling", file=HK, path=["notes"], field="notes (append)", mode="append",
   new="W2A LR-8 check under LR-34 against cards/hanging_leg_raise.json on this head: thumb (parent c17), wrist (parent c18) and the jump or step-up (parent c1) hold. Grip width, hand contact, the box-clear step, chalk, straps and the active hang fail: the parent card does not source them (the8.md lists them as unsourced golden-B points). Those entries are removed; width and hand contact are LR-4 drawing conventions.",
   why="LR-34.")

# ---------------- assisted_pull_up ----------------
ed(id="W2-7", sev="medium", file=AP, path=["claims",("id","c12"),"tags"], field="claims[id=c12].tags", mode="eq",
   old=["CONSENSUS"], new=["CONSENSUS","WEAK"], why="Floor-drill quote applied to the machine bar by inference.")
ed(id="W2-7", sev="medium", file=AP, path=["claims",("id","c12"),"text"], field="claims[id=c12].text", mode="eq",
   old=_nsca, new=_nsca + " Written for barbell lifts (a drill lifting a bar from the floor); applied to the assisted pull-up machine's bar by inference.", why="Same.")
ed(id="W2-8", sev="medium", file=AP, path=["feel","rows",0,"means"], field="feel.rows[0].means", mode="eq",
   old="Usually means you are shrugging to start the pull.",
   new="Fault: starting the pull with your shoulders up by your ears.", why="LR-6, as chin_up.")
ed(id="W2-8", sev="medium", file=AP, path=["feel","rows",1,"means"], field="feel.rows[1].means", mode="eq",
   old="Usually means the shoulder does not like the arms-overhead position.",
   new="Arms high overhead narrow the space under the shoulder roof.", why="LR-6.")
ed(id="W2-8", sev="medium", file=AP, path=["feel","rows",1,"fix"], field="feel.rows[1].fix", mode="eq",
   old="Stop the set. If it keeps happening or lasts, don't train through it.",
   new="Stop the set. Don't train through the pain.", why="LR-28.")
ed(id="W2-8", sev="medium", file=AP, path=["feel","rows",2,"fix"], field="feel.rows[2].fix", mode="eq",
   old="Build up the sets slowly. If it lasts, don't train through it.",
   new="Build up the sets slowly. Don't train through the pain.", why="LR-28.")
ed(id="W2-9", sev="low", file=AP, path=["gaps",0], field="gaps[0]", mode="eq",
   old="Tier A: no sourced way to get on and off the pad safely (including a knee slipping off the moving pad) or to leave the machine at the end of a set; left out, not invented.",
   new="Tier A: getting on the pad is sourced (c1, setup[2]); no sourced way to get off the pad, to handle a knee slipping off the moving pad, or to leave the machine at the end of a set; left out, not invented.",
   why="Getting on is sourced (c1); a false open tier-A item (LR-3).")
ed(id="W2-9", sev="low", file=AP, path=["notes",0], field="notes[0] (substring)", mode="sub",
   old="Not sourced, so left out: how to get on and off the pad safely and how to leave the machine at the end of a set (the tier-A 'way out').",
   new="Not sourced, so left out: how to get off the pad safely, what to do if a knee slips off the moving pad, and how to leave the machine at the end of a set (the tier-A 'way out'); getting on the pad is sourced (c1).",
   why="Same; W2-9 gave the whole notes[0], only this sentence changes.")
ed(id="W2-9", sev="low", file=AP, path=["notes",1], field="notes[1] (first substring)", mode="sub",
   old="acefitness.org exercise-library/190/assisted-pull-up/ -> 200 (mount and return only);",
   new="acefitness.org exercise-library/190/assisted-pull-up/ -> 301 to the ACE chin-ups page (exercise-library/190/chin-ups/; rechecked 2026-10-18), so no ACE assisted-machine page was read;",
   why="The ACE URL redirects to the chin-ups page.")
ed(id="W2-9", sev="low", file=AP, path=["notes",1], field="notes[1] (second substring)", mode="sub",
   old="No source says how to get on and off the pad safely, what to do if a knee slips off, or how to leave the machine at the end of a set.",
   new="No source says how to get off the pad safely, what to do if a knee slips off, or how to leave the machine at the end of a set; getting on the pad is sourced (c1). The ACE assisted-machine search goes back to LIB-WAYOUT (assist machine).",
   why="Same.")
ed(id="W2-8", sev="medium", file=AP, path=["notes"], field="notes (append)", mode="append", expect_len=2,
   new=_w28, why="Record of the change.")

# ---------------- shared dumbbell-kickup ----------------
ed(id="W2-49", sev="ruling", file=DK, path=["claims",("id","c5"),"text"], field="claims[id=c5].text", mode="eq",
   old="The same source says that if you get stuck in a dumbbell bench press you can drop the weights out to the side. Recorded as a conflict with the candidate rule; not used in any field.",
   new="Failed rep on a dumbbell bench press: if you get stuck, you can drop the weights out to the side. One coach source, in its benefits section; written for the flat bench and applied to the incline by inference. A failed-rep way out, not the normal set-down (c4).",
   why="LR-30: no conflict; c5 is the bench failed-rep step.")
ed(id="W2-49", sev="ruling", file=DK, path=["claims",("id","c5"),"tags"], field="claims[id=c5].tags", mode="eq",
   old=["WEAK"], new=["MECH","WEAK"], why="LR-30: incline by inference.")
ed(id="W2-49", sev="ruling", file=DK, path=["variants","bench","steps"], field="variants.bench.steps (append as the 5th step)", mode="append", expect_len=4, reserved=True,
   new={"kind":"safety","text":"Failed rep: drop the dumbbells out to your sides.","claim":"c5"},
   why="LR-30.")
ed(id="W2-49+W2-11", sev="ruling", file=DK, path=["variants","seated","steps"], field="variants.seated.steps (append 3 steps after the c3 get-in step)", mode="append", expect_len=2, reserved=True, merged=True,
   new=[{"kind":"finish","text":"After the set, bring your knees up one at a time to catch the dumbbells.","claim":"c6"},{"kind":"finish","text":"Or have a spotter take one of them.","claim":"c6"},{"kind":"finish","text":"Don't throw them from shoulder height onto the floor.","claim":"c6"}],
   why="LR-30's three c6 steps replace W2-11's two (ruling wins; same c6 content plus the don't-throw line). Seated then has 5 steps (limit 5).")
ed(id="W2-49+W2-11", sev="ruling", file=DK, path=["gaps",0], field="gaps[0]", mode="eq", merged=True,
   old="No source names a wrong kick-up or set-down pose, so postureArchetype.wrong is null. The candidate \"never dropped out to the sides\" is unsupported, and one source allows it when stuck (c5).",
   new="No source names a wrong kick-up pose or a wrong bench set-down. c6 names a wrong seated set-down (throwing the dumbbells from shoulder height onto the floor), shown as a seated finish step (LR-30), but postureArchetype is shared by both variants and its right pose is the bench kick-up (c1, c2), so postureArchetype.wrong stays null. The candidate \"never dropped out to the sides\" is unsupported, and one source allows it when stuck (c5). \"Never over the face\" (content.md 5.2) has no quote yet, so no line says it (LR-30).",
   why="Merged: W2-11's corrected reason (c6 names a wrong seated set-down; wrong stays null) without its 'waits on the ruling' clause, plus LR-30's sentence.")
ed(id="W2-49", sev="ruling", file=DK, path=["gaps",1], field="gaps[1]", mode="eq", merged=True,
   old="Seated set-down is now sourced (c6: knees up one at a time to catch the dumbbells, or a spotter takes one; one coach source, WEAK, applied to arnold_press by inference). The seated variant still has no finish step; adding one is outside W2A's scope (variants reserved). Until it is added, no seated way-out line is shown.",
   new="Seated set-down is sourced by one coach source (c6, WEAK; applied to arnold_press by inference) and shown as the seated finish steps (LR-30). No source gives a failed-rep way out for the seated press, so none is shown (LR-3).",
   why="LR-30 text; W2-11's gaps[1] is superseded.")
ed(id="W2-49", sev="ruling", file=DK, path=["notes",5], field="notes[5]", mode="eq", oldnote="ruling gave an abbreviated old; exact head value shown",
   old=None,
   new="W2A 2026-10-17, ruled LR-30 (supervisor 2026-10-18): no conflict. bb-db-shoulder-press covers the normal set-down after a seated press (c6: \"There's no reason to chuck them from shoulder height onto the floor.\"); fv-db-bench covers a stuck rep lying on a bench (c5: \"if you get stuck, you can simply drop the weights out to the side\"). c5 is the bench failed-rep step and c6 the seated finish steps. content.md 5.2's \"never over the face\" has no quote, so no line says it.",
   why="LR-30. The W2-11 notes line is not added: notes[5] now records the ruling.")
ed(id="W2-11", sev="medium", file=DK, path=["variants","seated","steps"], field="variants.seated.steps / gaps[0] / gaps[1] / notes (W2-11's own text)", mode="task", status="superseded",
   new="W2-11's two seated steps, gaps text and note are replaced by the LR-30 edits above.",
   why="W2-49 ruling wins on the same fields.")
ed(id="W2-15", sev="low", file=DKQ, path=["quotes",7,"note"], field="quotes[7].note (claim c4, fv-db-bench)", mode="eq",
   old="Source retrieved via WebFetch (direct curl blocked by Sucuri JS challenge); WebFetch confirmed this passage verbatim, keeping the source's own typo 'At the of your set'.",
   new="Re-checked by curl 2026-10-18 (desktop UA): the source URL answers HTTP 301 to https://fitnessvolt.com/dumbbell-bench-press-guide/, which returns HTTP 200 with the full page text; this passage matches verbatim, keeping the source's own typo 'At the of your set'.",
   why="WebFetch is not valid evidence; curl re-check confirms verbatim.")
ed(id="W2-15", sev="low", file=DKQ, path=["quotes",8,"note"], field="quotes[8].note (claim c5, fv-db-bench)", mode="eq",
   old="Source retrieved via WebFetch (direct curl blocked by Sucuri JS challenge); WebFetch confirmed this passage verbatim.",
   new="Re-checked by curl 2026-10-18 (desktop UA): the source URL answers HTTP 301 to https://fitnessvolt.com/dumbbell-bench-press-guide/, which returns HTTP 200 with the full page text; this passage matches verbatim.",
   why="Same.")

# ======================================================================
# Final rulings (w2fix/w2-rulings-final.md, LR-30 to LR-35, 2026-10-18).
# Items above keep their order and numbers; values are overridden here,
# and new items carry added=True (rendered after the old items).
# ======================================================================
def _find(id_, file_, field_):
    m = [e for e in E if e["id"] == id_ and e["file"] == file_ and e["field"] == field_]
    assert len(m) == 1, (id_, file_, field_, len(m))
    return m[0]
def _rep(s, old, new):
    assert s.count(old) == 1, (old, s.count(old))
    return s.replace(old, new)
def add(**k):
    k["added"] = True
    E.append(k)

# ---------------- LR-30 (W2-49): dumbbell kick-up ----------------
_e = _find("W2-49+W2-11", DK, "variants.seated.steps (append 3 steps after the c3 get-in step)")
assert _e["new"][0]["text"] == "After the set, bring your knees up one at a time to catch the dumbbells."
_e["new"][0]["text"] = "After the set, bring each knee up in turn to catch them."
_e["why"] = "LR-30's three c6 steps replace W2-11's two (ruling wins; same c6 content plus the don't-throw line). Seated then has 5 steps (limit 5, SETUP_MAX_STEPS); each step ≤12 words (SETUP_STEP_MAX_WORDS; D-LIB5-SPLIT): 12, 8 and 9 words by main's copy-lint words(), no BANNED hit."
_e = _find("W2-49", DK, "gaps[1]")
_e["new"] = "Seated set-down is sourced by one coach source (c6, WEAK; applied to arnold_press by inference) and shown as the seated finish steps (LR-30). A spotter way out for seated presses is sourced on the exercise cards (dumbbell_shoulder_press c7, arnold_press c10; ACE). No read source gives a seated failed-rep way out without a spotter, so none is shown here (LR-3)."
_e["why"] = "LR-30 text (final ruling: the spotter way out is sourced on the exercise cards; only the no-spotter gap is real); W2-11's gaps[1] is superseded."
_e = _find("W2-49", DK, "notes[5]")
_e["new"] = _rep(_e["new"], "\"There's no reason", "\"There’s no reason")
_e["why"] = "LR-30. The W2-11 notes line is not added: notes[5] now records the ruling. \"There’s\" keeps the source's U+2019, as in quotes/shared-dumbbell-kickup.json."

# ---------------- LR-34 (W2-53): shoulder_press ----------------
_e = _find("W2-53", SP, "inherit[0..4] LR-34 re-check + notes (append the result)")
_e["new"] = "Re-run the LR-8 check of all 5 inherit entries on head 5036283d against cards/machine_chest_press.json (the parent card, LR-34) and against any shared card on that head that has passed verification and lists shoulder_press in `appliesTo` (LR-29); golden-B is a source map only. An entry stays only where the parent's shipped How-to (tools/plates/layers/exercises/machine_chest_press.howto.mjs on main) has a string for it whose every clause that card or shared card supports (D-LIB5-FAMILY `===`). Append one notes entry that records, for each of inherit[0]-[4], holds or fails by the parent's claim id (or the shared card's file and claim id), never by setup index, and, per kept entry, the shipped-sheet path it restates, or \"no whole string\". Apply LR-34's ways out, in order, to any that fail: (1) the child's own claim, a verbatim quote fetched by curl and checked by the fetcher (tagged MECH or WEAK when written for another exercise), tried first for every shown or safety line; (2) an LR-4 drawing convention in notes, for a pure drawing choice only, never for a safety line; (3) remove the line and add a gaps entry (shoulder_press is tier A, so a removed safety line joins the owner's tier-A gap list, LR-3). A feel row, redFlag, risk line or content.md 5.2 tier-A point never leaves under LR-34: if way (1) finds no quote, keep the line and the inherit entry it rests on as on the head, record the failed check in notes, and report shoulder_press as stopped for a supervisor ruling in FIXED. When an entry is removed, every shown word that restates it goes too, and every \"inherit:<n>\" reference is re-indexed. Never keep a line on golden-B alone."
_e["why"] = "LR-34 (W2-53) as amended: parent card or verified shared card, claim ids, way (1) first, stop rule, shipped path per kept entry."

# ---------------- LR-34: chin_up ----------------
_e = _find("W2-53", CU, "inherit (replace array)")
_e["step"] = "LR-34 step"
_e["do"] = "Keep each entry below only if the parent's shipped string for it (tools/plates/layers/exercises/pull_up.howto.mjs on main) holds whole on cards/pull_up.json at 5036283d, every clause supported (D-LIB5-FAMILY `===`). Expected: both hold (thumb: parent c3; hand zoom: parent zoom 'hand', c3). An entry with no whole string leaves, and its line is cited to chin_up's own claims (the thumb: c1, c21; item 31's new value then reads \"Wrapped around the bar (c1, c21).\")."
_e["why"] = "LR-34: hand contact, bar height, a fixed and dry bar, chalk, and the thumbless, hook and false-grip labels are not on the pull_up card."
_hc_note = "Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (items 73-76, 85 and 86: source, claim c25, grip.claims, zoom claim, quotes file). If it does not, apply the fallback and skip those added items."
_e = _find("W2-53", CU, "grip.handContact")
_e["step"] = "LR-34 step"; _e["newquote"] = True; _e["do"] = _hc_note
_e["fallback"] = _e["new"]; _e["fallback_when"] = "the fetcher does not confirm the quote: LR-4 drawing convention"
_e["new"] = "Bar just below the base of the fingers, where the fingers meet the palm (c25)."
_e["why"] = "LR-34 way (1): the parent card does not source hand contact; bullbar-calluses (the source the approved pull_up sheet cites) says it, written for a palms-away hang (MECH, WEAK)."
_e = _find("W2-53", CU, "zooms[key=hand].right (zooms[0])")
_e["step"] = "LR-34 step"; _e["newquote"] = True; _e["do"] = _hc_note
_e["fallback"] = _e["new"]; _e["fallback_when"] = "the fetcher does not confirm the quote"
_e["new"] = "Palm facing the face, bar just below the base of the fingers, thumb wrapped around the bar, wrist straight in line with the forearm."
_e["why"] = "LR-34 way (1); this also settles W2-5 for chin_up (the zoom cites c25, not an inherit entry)."
_e = _find("W2-53", CU, "notes[0] (substring)")
_e["step"] = "LR-34 step"
_e["do"] = "Way (1) for the failed setup entries: the fetcher re-reads catalyst-pullup and bullbar-calluses for a fixed or dry bar and for bar height (supervisor and judge re-read 2026-10-18: neither says them; bullbar-calluses sources chalk). The setup has 5 of 5 steps (SETUP_MAX_STEPS), so chalk goes to gaps (item 77); a fixed bar and bar height go to gaps by item 78. If the fetcher finds a verbatim quote for a fixed bar or bar height, add it as a claim (MECH, WEAK) and write \"sourced (<source id>), no setup slot\" for that point here and in gaps instead."
_e["new"] = "bar height, a fixed and dry bar, and chalk are not on the pull_up card, so none is inherited (LR-34): chalk is sourced by bullbar-calluses but the setup has no free slot (5 of 5 steps), and catalyst-pullup and bullbar-calluses do not say the bar is fixed or dry or how high it is; all three are in gaps."
_e["why"] = "LR-34: the entries leave (no whole parent string is supported); way (1) outcome recorded."
_e = _find("W2-53", CU, "notes[1]..notes[5] (the five 'W2A LR-8: inherit[n] holds' notes) -> one note")
_e["step"] = "LR-34 step"
_e["do"] = "Write the note from the LR-34 step's results. The new value is the expected result (both kept entries hold on the shipped sheet; the hand-contact quote confirmed). If a result differs, change only the clause it affects."
_cu_note = "W2A LR-8 check redone under LR-34 against cards/pull_up.json on 5036283d (golden-B research is a source map only): the thumb holds (parent c3; c1 and c21 here) and the hand zoom's full-grip-only rule holds (parent zoom 'hand', c3; content.md 5.2 C4), each restating a whole string of tools/plates/layers/exercises/pull_up.howto.mjs on main. The thumbless, hook and gymnastics false-grip labels fail: the parent's baechle-earle quote gives only \"Perform all grips with your thumbs around the bar.\" (c3). Hand contact, bar height, a fixed and dry bar, and chalk fail because the parent card does not source them; those inherit entries are removed. Way (1): hand contact is this card's own c25 (bullbar-calluses, MECH, WEAK); chalk is sourced by bullbar-calluses but the setup has no free slot; catalyst-pullup and bullbar-calluses do not say the bar is fixed or dry or how high it is. Chalk, bar height and a fixed bar are in gaps."
_e["fallback"] = [_rep(_cu_note, "Way (1): hand contact is this card's own c25 (bullbar-calluses, MECH, WEAK);", "Way (1) found no verbatim hand-contact quote, so hand contact is an LR-4 drawing convention;")]
_e["fallback_when"] = "the fetcher does not confirm the hand-contact quote"
_e["new"] = [_cu_note]
_e["why"] = "LR-34 as amended: head sha, parent claim ids, shipped path per kept entry, the failed grip labels and the way-(1) outcomes."

# ---------------- LR-34: hanging_knee_raise ----------------
_e = _find("W2-3+W2-53", HK, "notes[0]")
_e["status"] = "conditional"
_e["do"] = "Apply new only when item 41 sources the shoulder fix. If item 41 stops the card, apply the fallback: W2-3's change only, with the active-hang sentence kept and re-indexed to inherit[2] (item 43's fallback)."
_e["fallback"] = _rep(_rep(_e["old"], " (inherited from the parent's box line)", ""), "(inherit[5])", "(inherit[2])")
_e["fallback_when"] = "item 41 stops the card"
_e["why"] = "Merged: W2-3 (the box line implied a way down, LR-3) + W2-53 (delete the inherit[5] sentence, only when item 41 sources the fix). W2-3's 'inherited box line (inherit[3])' sentence is dropped, because LR-34 removes inherit[3]."
_e = _find("W2-6", HK, "feel.rows[3].means (only if rows[3] stays after the W2-53 step)")
_e["field"] = "feel.rows[3].means (only when item 41 sources the fix)"
_e["do"] = "Apply only when item 41 sources the shoulder fix. If item 41 stops the card, rows[3] stays exactly as on the head (LR-34 stop rule)."
_e = _find("W2-53", HK, "feel.rows[3] (Shoulder row; fix cites inherit:5)")
_e["new"] = "Way (1) for the fix only; rows[3].where, rows[3].means (item 40 aside) and 'shoulder' in redFlags stay. Leads, both applied to a knee-raise hang by inference (MECH, WEAK): (a) bullbar-calluses, section \"3. The Hanging Mechanics: Active Shoulders, Not Passive Arms\": quote only \"Pull your shoulder blades down and back\"; its next sentence, \"Keep a slight bend in your elbows—never lock out fully.\", conflicts with c2 (\"Hang with your arms fully extended\"), so record that conflict in notes and do not use it; (b) nasm-chinup as quoted in cards/pull_up.json c8 (\"Set the scapulae first, cueing 'pull the shoulder blades down and back' before the arms take over, so the client leads with the back rather than yanking with the arms.\"). If the fetcher confirms a lead: add it as this card's claim c19 (c17 and c18 are item 81's, used or not), tagged MECH and WEAK, with its source in the card's and the quotes file's sources and its quote in the quotes file; set rows[3].fix from that quote's words (expected with lead (a): \"Pull your shoulder blades down and back before each rep.\"); set rows[3].claim to [\"c15\", \"<new claim>\"]; then items 39 and 40 apply new, and item 43 applies new (the active-hang entry leaves). If no lead is confirmed: rows[3], 'shoulder' in redFlags and the active-hang inherit entry stay as on the head (items 39 and 43 apply their fallbacks; item 84 re-indexes inherit:5 to inherit:2; item 40 does not apply); append the note \"LR-34: the active hang fails on cards/hanging_leg_raise.json; rows[3].fix is unsourced; hanging_knee_raise is stopped for a supervisor ruling.\"; and report hanging_knee_raise as stopped in FIXED. Never remove rows[3] or the 'shoulder' redFlag (LR-34 stop rule)."
_e["why"] = "LR-34: the fix rests only on the failed active hang (inherit:5). The remove-row fallback is dropped: the row and its redFlag are the card's only live shoulder warning link (content.md 5.2), so the card stops instead."
_e = _find("W2-53", HK, "inherit (replace array)")
_e["step"] = "LR-34 step"
_e["do"] = "Keep the wrist and thumb entries only if the parent's shipped strings for them (tools/plates/layers/exercises/hanging_leg_raise.howto.mjs on main) hold whole on cards/hanging_leg_raise.json at 5036283d (parent c18; c17); an entry that fails leaves, and its line cites this card's own claims (wrist: c16; thumb: c3). The jump/stool entry is dropped: the parent's sheet has no whole string for it (its only get-in string is \"Step up from a box, and check it's clear of your legs.\"), and setup[0] already cites this card's own c1. Apply new when item 41 sources the shoulder fix (the active-hang entry leaves); otherwise apply the fallback (the active-hang entry stays as on the head, now inherit[2])."
_hk_wr = _e["new"][0]; _hk_th = _e["new"][1]
assert _hk_wr["field"].startswith("grip.wrist") and _hk_th["field"].startswith("grip.thumb") and _e["new"][2]["field"].startswith("setup: jump")
_hk_active = {"field":"posture: active hang (shoulders a little down from the ears, arms straight)","why":"true for this child because the upper body does the same job as on the parent; the leg action is what changes."}
_e["new"] = [_hk_wr, _hk_th]
_e["fallback"] = [_hk_wr, _hk_th, _hk_active]
_e["fallback_when"] = "item 41 stops the card; the third entry is head inherit[5], unchanged"
_e["why"] = "LR-34: width, hand contact, the box-clear step, chalk and straps are not on the parent card; the jump/stool entry has no whole parent string (this card's own c1 sources it); the active hang leaves only with a sourced fix."
_e = _find("W2-53", HK, "grip.width")
_e["step"] = "LR-34 step"; _e["newquote"] = True
_e["do"] = "Way (1) first: apply new only if the fetcher confirms bullbar-calluses' width quote (claim c18: items 80-82, 87 and 88). If not, apply the fallback and skip c18."
_e["fallback"] = _e["new"]; _e["fallback_when"] = "the fetcher does not confirm the quote: LR-4 drawing convention"
_e["new"] = "Shoulder width (c18)."
_e["why"] = "LR-34 way (1): the parent card gives no width; bullbar-calluses gives a shoulder-width, palms-away grip for dead hangs (MECH, WEAK)."
_hk_hc = "Way (1) first: apply new only if the fetcher confirms bullbar-calluses' hand-contact quote (claim c17: items 80-83, 87 and 88). If not, apply the fallback and skip c17."
_e = _find("W2-53", HK, "grip.handContact")
_e["step"] = "LR-34 step"; _e["newquote"] = True; _e["do"] = _hk_hc
_e["fallback"] = _e["new"]; _e["fallback_when"] = "the fetcher does not confirm the quote: LR-4 drawing convention"
_e["new"] = "Bar just below the base of the fingers, where the fingers meet the palm (c17)."
_e["why"] = "LR-34 way (1): the parent's grip.handContact says Not sourced; bullbar-calluses says it, written for a dead hang (MECH, WEAK)."
_e = _find("W2-53", HK, "zooms[key=hand].right (zooms[0])")
_e["step"] = "LR-34 step"; _e["newquote"] = True; _e["do"] = _hk_hc
_e["fallback"] = _e["new"]; _e["fallback_when"] = "the fetcher does not confirm the quote"
_e["new"] = "Overhand, bar just below the base of the fingers, thumb wrapped, wrist not curled."
_e["why"] = "LR-34 way (1); this also settles W2-5 for hanging_knee_raise (the zoom cites c17, not an inherit entry)."
_e = _find("W2-6", HK, "notes (append)")
_e["new"] = _rep(_e["new"], "(kept only if the row stays after the LR-34 step)", "(only when the LR-34 step sources the row's fix; otherwise the row stays as on the head)")
_e["why"] = "Merged: W2-6's note minus its LR-8 golden-sheet basis (void under LR-34); its condition follows item 40's (final LR-34)."
_e = _find("W2-53", HK, "notes (append)")
_e["step"] = "LR-34 step"
_hk_note = "W2A LR-8 check under LR-34 against cards/hanging_leg_raise.json on 5036283d (golden-B research is a source map only): thumb (parent c17) and wrist (parent c18) hold, each restating a whole string of tools/plates/layers/exercises/hanging_leg_raise.howto.mjs on main. The jump or step-up holds (parent c1) and is cited to this card's own c1, not inherited: the parent's shipped get-in string is the box step, so there is no whole string. Grip width, hand contact, the box-clear step, chalk, straps and the active hang fail (the8.md:138 lists the width, straps and box clearance as unsourced golden-B points; the parent's grip.handContact says Not sourced; chalk and the active hang are not on the parent card). Those entries are removed. Way (1): hand contact and width are this card's own c17 and c18 (bullbar-calluses, MECH, WEAK); the shoulder row's fix is this card's own c19 (<source id>, MECH, WEAK); no quote gives the box clearance, so it stays in gaps."
_e["do"] = "Write the note from the LR-34 step's results. The new value is the expected result with every way-(1) quote confirmed, the shipped strings holding and item 41 sourcing the fix (fill <source id>). If a grip quote is not confirmed, that clause reads \"<hand contact | width> is an LR-4 drawing convention\". If item 41 stops the card, apply the fallback."
_e["new"] = _hk_note
_e["fallback"] = _rep(_hk_note, "Those entries are removed. Way (1): hand contact and width are this card's own c17 and c18 (bullbar-calluses, MECH, WEAK); the shoulder row's fix is this card's own c19 (<source id>, MECH, WEAK);", "The width, hand-contact, box-clear, chalk and straps entries are removed; the active-hang entry stays (inherit[2]) and the card is stopped for a ruling (see the LR-34 note). Way (1): hand contact and width are this card's own c17 and c18 (bullbar-calluses, MECH, WEAK); no quote gives a fix for the shoulder row;")
_e["fallback_when"] = "item 41 stops the card"
_e["why"] = "LR-34 as amended: head sha, parent claim ids, shipped path or 'no whole string' per kept entry, the way-(1) outcomes, and the corrected the8.md:138 parenthetical."

# ---------------- added: LR-31 steps (shoulder_press, chin_up, hanging_knee_raise) ----------------
_lr31 = "LR-31 step: the fetcher scans every read source of this card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed; write plate.mistake.rankNote: \"No source measures how often each fault happens.\" plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Report any change of pick or drawable in FIXED."
add(id="W2-51", sev="ruling", file=SP, path=["plate","mistake"], field="plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]", mode="task", step="LR-31 step",
    new=_lr31 + " No expected result is given for this card; report it.", why="LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.")
add(id="W2-51", sev="ruling", file=CU, path=["plate","mistake"], field="plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]", mode="task", step="LR-31 step",
    new=_lr31 + " Expected: step 3, the pick stays (c6).", why="LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.")
add(id="W2-51", sev="ruling", file=HK, path=["plate","mistake"], field="plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0]", mode="task", step="LR-31 step",
    new=_lr31 + " Expected: step 3, the pick stays (c4).", why="LR-31 (W2-51) rollout: LB1 cards in W2 fix round 1.")

# ---------------- added: LR-34 way (1) on chin_up (bullbar-calluses) ----------------
_bbc_url = "https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses"
_bbc_src = {"id":"bullbar-calluses","url":_bbc_url,"title":"How to Grip the Bar Without Getting Calluses (Bullbar Fit, manufacturer blog)","kind":"coach","year":None,"pmid":None,"access":"full","checked":"<YYYY-MM-DD>"}
_bbc_qsrc = {"id":"bullbar-calluses","access":"full","fixes":None}
_bbc_hand = "When you hang, the bar should sit just below the base of your fingers—where your fingers meet your palm."
_bbc_width = "For dead hangs or carries: shoulder-width, palms facing away (pronated grip)."
_bbc_hand_where = "1. The Grip: Hook, Don't Crush"
_bbc_width_where = "2. The Grip Width: Shoulder-Width or Slightly Wider"
def _qf(claim, source, quote):
    return {"claim": claim, "source": source, "quote": quote, "status": "verbatim", "closest": None}
_cif = "Only if the fetcher confirms the hand-contact quote (item 30's way (1)); otherwise skip."
add(id="W2-53", sev="ruling", file=CU, path=["sources"], field="sources (append bullbar-calluses)", mode="append", expect_len=11, status="conditional", do=_cif,
    new=_bbc_src, why="LR-34 way (1): source of c25. Fill checked with the fetcher's run date.")
add(id="W2-53", sev="ruling", file=CU, path=["claims"], field="claims (append new c25 after c24)", mode="append", expect_len=24, status="conditional", newquote=True, do=_cif,
    new={"id":"c25","text":"Hand contact: a manufacturer blog says that when you hang, the bar sits just below the base of the fingers, where the fingers meet the palm. Written for a palms-away hang (a callus blog) and applied to the chin-up by inference; weak evidence.","tags":["MECH","WEAK"],"sources":["bullbar-calluses"],"quotes":[{"source":"bullbar-calluses","text":_bbc_hand,"where":_bbc_hand_where}]},
    why="LR-34 way (1), tagged MECH and WEAK as the ruling says. Keep the em dash (U+2014) in 'fingers—where' (curl 2026-10-18).")
add(id="W2-53", sev="ruling", file=CU, path=["grip","claims"], field="grip.claims", mode="eq", status="conditional", do=_cif,
    old=["c1","c2","c3","c20","c21"], new=["c1","c2","c3","c20","c21","c25"], why="grip.handContact cites c25 (item 30).")
add(id="W2-53", sev="ruling", file=CU, path=["zooms",("key","hand"),"claim"], field="zooms[key=hand].claim (zooms[0])", mode="eq", status="conditional", do=_cif,
    old=["c3","c1","c20"], new=["c3","c1","c20","c25"], why="The zoom's new words cite c25 (item 32); replaces superseded W2-5.")
add(id="W2-53", sev="ruling", file=CU, path=["gaps"], field="gaps (append: chalk)", mode="append", expect_len=2, step="LR-34 step",
    do="Chalk is sourced by bullbar-calluses (\"Use chalk (magnesium carbonate) on your hands before every set.\", section \"4. The Secret Weapon: Chalk and Hand Care\"), but chin_up's setup has 5 of 5 steps (SETUP_MAX_STEPS), so it is not shown.",
    new="Chalk: sourced (bullbar-calluses), no setup slot.", why="LR-34 way (1) outcome for the chalk entry (final ruling text).")
add(id="W2-53", sev="ruling", file=CU, path=["gaps"], field="gaps (append: fixed bar and bar height)", mode="append", step="LR-34 step",
    do="Applies when item 33's way (1) finds no quote (expected). chin_up is tier A, so the supervisor adds \"bar fixed\" to the owner's tier-A gap list.",
    new="Tier A: no sourced line that the bar is fixed and dry or high enough for the feet to clear the floor; the pull_up card does not source them, and catalyst-pullup and bullbar-calluses do not say them (LR-34). Left out, not invented.",
    why="LR-34 way (3) for the failed setup entries (no shown line restates them).")
add(id="W2-53", sev="ruling", file="quotes/chin_up.json", path=["sources"], field="sources (append bullbar-calluses)", mode="append", expect_len=11, status="conditional", do=_cif,
    new=_bbc_qsrc, why="Quotes file follows the card.")
add(id="W2-53", sev="ruling", file="quotes/chin_up.json", path=["quotes"], field="quotes: insert after the last c24 entry", mode="insert_after_claim", claim="c24", status="conditional", newquote=True, do=_cif,
    new=[_qf("c25","bullbar-calluses",_bbc_hand)], why="Quotes file follows the card.")

# ---------------- added: LR-34 way (1) on hanging_knee_raise ----------------
_hif = "Only if the fetcher confirms the quote (items 44-46's way (1)); skip a claim whose quote is not confirmed (the other keeps its id; ids are never reused)."
add(id="W2-53", sev="ruling", file=HK, path=["sources"], field="sources (append bullbar-calluses)", mode="append", expect_len=8, status="conditional", do=_hif,
    new=_bbc_src, why="LR-34 way (1): source of c17 and c18. Fill checked with the fetcher's run date.")
add(id="W2-53", sev="ruling", file=HK, path=["claims"], field="claims (append new c17, c18 after c16)", mode="append", expect_len=16, status="conditional", newquote=True, do=_hif,
    new=[{"id":"c17","text":"Hand contact: a manufacturer blog says that when you hang, the bar sits just below the base of the fingers, where the fingers meet the palm. Written for a dead hang (a callus blog) and applied to the knee-raise hang by inference; weak evidence.","tags":["MECH","WEAK"],"sources":["bullbar-calluses"],"quotes":[{"source":"bullbar-calluses","text":_bbc_hand,"where":_bbc_hand_where}]},
         {"id":"c18","text":"Width: a manufacturer blog gives a shoulder-width grip with the palms facing away for dead hangs. Written for a dead hang (a callus blog) and applied to the knee-raise hang by inference; weak evidence.","tags":["MECH","WEAK"],"sources":["bullbar-calluses"],"quotes":[{"source":"bullbar-calluses","text":_bbc_width,"where":_bbc_width_where}]}],
    why="LR-34 way (1), tagged MECH and WEAK as the ruling says. Keep the em dash (U+2014) in 'fingers—where' (curl 2026-10-18).")
add(id="W2-53", sev="ruling", file=HK, path=["grip","claims"], field="grip.claims", mode="eq", status="conditional", do=_hif,
    old=["c2","c3","c16"], new=["c2","c3","c16","c17","c18"], why="grip.handContact and grip.width cite c17 and c18 (items 45, 44).")
add(id="W2-53", sev="ruling", file=HK, path=["zooms",("key","hand"),"claim"], field="zooms[key=hand].claim (zooms[0])", mode="eq", status="conditional", do="Only if the fetcher confirms the hand-contact quote (item 46's way (1)); otherwise skip.",
    old=["c16","c2","c3"], new=["c16","c2","c3","c17"], why="The zoom's new words cite c17 (item 46); replaces superseded W2-5.")
add(id="W2-53", sev="ruling", file=HK, path=["feel","rows",3,"claim"], field="feel.rows[3].claim (only if item 41 stops the card)", mode="eq", status="conditional", route="fallback",
    do="Apply only if item 41 stops the card: the active-hang entry stays and becomes inherit[2] under item 43's fallback. If item 41 sources the fix, item 41 sets this claim instead.",
    old=["c15","inherit:5"], new=["c15","inherit:2"], why="Re-index after item 43's fallback; the row stays as on the head (LR-34 stop rule).")
add(id="W2-53", sev="ruling", file="quotes/hanging_knee_raise.json", path=["sources"], field="sources (append bullbar-calluses)", mode="append", expect_len=8, status="conditional", do=_hif,
    new=_bbc_qsrc, why="Quotes file follows the card.")
add(id="W2-53", sev="ruling", file="quotes/hanging_knee_raise.json", path=["quotes"], field="quotes: insert after the last c16 entry (c17, then c18)", mode="insert_after_claim", claim="c16", status="conditional", newquote=True, do=_hif,
    new=[_qf("c17","bullbar-calluses",_bbc_hand), _qf("c18","bullbar-calluses",_bbc_width)], why="Quotes file follows the card.")

# ---------------- added: LR-31 on assisted_pull_up ----------------
add(id="W2-51", sev="ruling", file=AP, path=["plate","mistake","drawable"], field="plate.mistake.drawable", mode="eq", old=True, new=False,
    why="LR-31 step 1: \"Most people let the machine pull them back up too quickly\" (c16) is a frequency hit for the fast lowering, a fault whose only sign is speed, so it is never drawable.")
add(id="W2-51", sev="ruling", file=AP, path=["plate","mistake","why"], field="plate.mistake.why", mode="eq",
    old="Listed first among the machine's common mistakes and named by NASM; the anchor says full range builds full strength. Frequency is not measured.",
    new="Most people let the machine pull them back up too quickly, and dropping too fast at the bottom is named a shoulder impingement risk (c16). A fault seen only as speed cannot be drawn in a still plate, so the plate draws partial reps, first on the manufacturer's common-mistakes list (c8). Frequency is not measured.",
    why="LR-31. plate.mistake.what and .claim are unchanged.")
add(id="W2-51", sev="ruling", file=AP, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
    do="The fetcher confirms the two set-aside phrases on bullbar-assist-safety (curl, desktop UA) before push.",
    new="No source measures how often each fault happens. LR-31 step 1: \"Most people let the machine pull them back up too quickly\" (c16), a speed fault, so drawable is false. The drawn fault, by the same steps: partial reps, first on the beginner guide's common-mistakes list (c8). Set aside: \"I see lifters every week ... bouncing through partial reps\" says how often the author sees it, not how many lifters do it; \"Most beginners set it too high\" is the assistance chosen, not a fault.",
    why="LR-31: every plate.mistake carries a rankNote.")
_ap_short = {"mistake":"Stopping short: not straightening the arms at the bottom, or not getting the chin over the bar.","fix":"Full hang to chin over the bar, every rep. If you can't, add a little assistance.","claim":["c8","c5"]}
_ap_swing = {"mistake":"Swinging or using leg drive because the assistance is set too low.","fix":"Add assistance until every rep is controlled.","claim":"c5"}
_ap_fast = {"mistake":"Dropping fast on the way down and letting the machine do the braking.","fix":"Take three to four seconds to lower back to straight arms.","claim":"c16"}
add(id="W2-51", sev="ruling", file=AP, path=["handlingMistakes"], field="handlingMistakes (reorder: fast drop first, then stopping short, then swinging; text unchanged)", mode="eq",
    old=[_ap_short,_ap_swing,_ap_fast], new=[_ap_fast,_ap_short,_ap_swing],
    why="LR-31: handlingMistakes[0] is the top fault (the fast lowering, c16), which puts the impingement-risk fault first.")
