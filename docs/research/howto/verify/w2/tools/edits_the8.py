# THE8 edits (merged). Loaded by check.py via exec; defines E (list).
E = []
def ed(**k): E.append(k)

BS = "cards/barbell_back_squat.json"; BSQ = "quotes/barbell_back_squat.json"
PU = "cards/pull_up.json"; PUQ = "quotes/pull_up.json"
HL = "cards/hanging_leg_raise.json"; HLQ = "quotes/hanging_leg_raise.json"
LP = "cards/lat_pulldown.json"; LPQ = "quotes/lat_pulldown.json"
SR = "cards/seated_cable_row.json"; SRQ = "quotes/seated_cable_row.json"
LG = "cards/leg_press.json"; LGQ = "quotes/leg_press.json"
MC = "cards/machine_chest_press.json"; MCQ = "quotes/machine_chest_press.json"
DL = "cards/dumbbell_lateral_raise.json"; DLQ = "quotes/dumbbell_lateral_raise.json"
T8 = "verify/the8.md"

def qf(claim, source, quote):
    return {"claim": claim, "source": source, "quote": quote, "status": "verbatim", "closest": None}

# ---------------- barbell_back_squat ----------------
ed(id="W2-16", sev="blocker", file=BS, path=["tierA","wayOut","text"], field="tierA.wayOut.text", mode="eq",
   old="Safeties just below your lowest depth, and a spotter for heavy sets when you can. To bail, push the bar backward off your shoulders while you move your body forward, so it falls onto the safeties. Practise with light weight first.",
   new="Safeties just below your lowest depth: if you can't finish the rep, lower the bar onto them. A spotter for heavy sets when you can, who can help if you struggle. On your own and must bail? Push the bar backward off your shoulders while you move your body forward, so it falls onto the safeties. Practise with light weight first.",
   why="Tier-A way out dropped c13's controlled step and left the backward dump unconditional (risk to a spotter behind).")
_c14q0 = {"source":"rep-fail","text":"Whenever possible, have a spotter when performing heavy squats.","where":"The Importance of Spotters and Safeties"}
_c14q1 = {"source":"rep-fail","text":"A spotter can assist in case you struggle with the lift, reducing the need to bail entirely.","where":"The Importance of Spotters and Safeties"}
ed(id="W2-16", sev="blocker", file=BS, path=["claims",("id","c14"),"text"], field="claims[id=c14].text", mode="eq",
   old="Have a spotter for heavy squats whenever possible.",
   new="Have a spotter for heavy squats whenever possible; a spotter can help if you struggle with the lift, reducing the need to bail.", why="Backs 'who can help if you struggle'.")
ed(id="W2-16", sev="blocker", file=BS, path=["claims",("id","c14"),"quotes"], field="claims[id=c14].quotes (append one)", mode="eq",
   old=[_c14q0], new=[_c14q0,_c14q1], newquote=True, why="Same.")
_c15q0 = {"source":"rep-fail","text":"If you must bail, push the bar backward off your shoulders while moving your body forward. This will let the bar fall onto the safety bars without hitting you. Practice this movement with lighter weights to get comfortable with the process.","where":"How to Safely Bail from a Squat, 1. How to Bail a Back Squat"}
_c15q1 = {"source":"rep-fail","text":"While the best course of action is always to have a spotter and use safety equipment, there are times when you might find yourself in a situation where you need to bail on your own.","where":"Introduction, before The Importance of Spotters and Safeties"}
ed(id="W2-16", sev="blocker", file=BS, path=["claims",("id","c15"),"text"], field="claims[id=c15].text", mode="eq",
   old="Way out: if you must bail a back squat, push the bar backward off the shoulders while moving the body forward so it falls onto the safety bars, and practise this with light weights first.",
   new="Way out: if you must bail a back squat on your own, without a spotter, push the bar backward off the shoulders while moving the body forward so it falls onto the safety bars, and practise this with light weights first.", why="Backs 'On your own and must bail?'.")
ed(id="W2-16", sev="blocker", file=BS, path=["claims",("id","c15"),"quotes"], field="claims[id=c15].quotes (append one)", mode="eq",
   old=[_c15q0], new=[_c15q0,_c15q1], newquote=True, why="Same. The source's non-breaking space in 'spotter and use' is written as a normal space.")
ed(id="W2-16", sev="blocker", file=BS, path=["sources",("id","rep-fail"),"checked"], field="sources[id=rep-fail].checked (sources[3])", mode="eq",
   old="2026-10-17", new="2026-10-18", why="Re-read 2026-10-18.")
ed(id="W2-16", sev="blocker", file=BSQ, path=["quotes"], field="quotes: insert after the last c14 entry (head quotes[23])", mode="insert_after_claim", claim="c14",
   new=[qf("c14","rep-fail",_c14q1["text"])], newquote=True, why="Quotes file matches the card.")
ed(id="W2-16", sev="blocker", file=BSQ, path=["quotes"], field="quotes: insert after the last c15 entry (head quotes[24])", mode="insert_after_claim", claim="c15",
   new=[qf("c15","rep-fail",_c15q1["text"])], newquote=True, why="Same.")
ed(id="W2-16", sev="blocker", file=BS, path=["notes"], field="notes (append)", mode="append", expect_len=6,
   new="2026-10-18 (W2-16): the tier-A way out now follows rep-fail's order. Lower the bar onto the safeties when you can't finish (c13). A spotter can help if you struggle (c14). The backward bail is for when you must bail on your own (c15; the source's intro sets bailing apart from having a spotter). No source read says where a back-squat spotter stands.",
   why="Record.")
ed(id="W2-19", sev="medium", file=BS, path=["risks",2,"risk"], field="risks[2].risk", mode="eq",
   old="Holding your breath under heavy load raises blood pressure; whether that harms healthy lifters is not confirmed.",
   new="Holding your breath under heavy load raises blood pressure.", why="'healthy lifters' scope is unsourced (Hackett names no group); dropping the hedge keeps the sourced fact (c18).")
ed(id="W2-19", sev="medium", file=BS, path=["gaps"], field="gaps (append)", mode="append", expect_len=2,
   new="Tier A breathing (content.md 5.2, 2026-10-18): no source read supports the squat's approved \"High blood pressure? Don't hold your breath long.\" pattern. Hackett 2013 (abstract) says only that lifters are often advised to avoid the breath-hold because of possible vascular events, and that its health risks remain unconfirmed; it names no condition and no time limit, and the NSCA summary gives no limit. Left out, not invented; risks[2] states only the sourced rise in blood pressure (c18), and the unsourced 'healthy lifters' scope was dropped.",
   why="Tier-A gap was not recorded (LR-3 owner gap list).")
ed(id="W2-20", sev="low", file=BS, path=["claims",("id","c26"),"text"], field="claims[id=c26].text", mode="eq",
   old="Tempo: no source read gives seconds for a novice back squat. The position stand gives 1-2 s up and 1-2 s down for intermediate to advanced heavy strength training (LR-15), and in a lab study one 8-RM parallel back-squat rep took about 3.3 to 3.6 s in all. The plate's 2 s down and 2 s up is a drawing convention taken from the top of the 1-2 s range, not a novice recommendation.",
   new="Tempo: no source read gives seconds for a novice back squat. The position stand gives 1-2 s up and 1-2 s down for intermediate to advanced heavy strength training (LR-15). A lab study of 8-RM parallel back squats compared reps with and without a weight-belt: reps with the belt were generally faster, especially the later reps (3.34 vs 3.56 s); it is a belt comparison, not a tempo source. The plate's 2 s down and 2 s up is a drawing convention taken from the top of the 1-2 s range, not a novice recommendation.",
   why="Lander's 3.34/3.56 s are with-belt vs no-belt times, not a rep-time range.")
ed(id="W2-20", sev="low", file=BS, path=["notes",1], field="notes[1]", mode="eq",
   old="Tempo (fact 2): c26 is a drawing convention under LR-15 (WEAK). The measured 8-RM rep took about 3.3 to 3.6 s in all (c26), shorter than the 4 s the plate draws; open question for the supervisor.",
   new="Tempo (fact 2): c26 is a named drawing convention under LR-15 and D-W2-TEMPO (WEAK). Lander's 3.34 and 3.56 s (c26) are the with-belt and no-belt rep times of 5 lifters at their 8-RM, the gap widest in the later reps; they compare belts and do not set or test the plate's 2 s down, 2 s up.",
   why="Same.")
ed(id="W2-20", sev="low", file=T8, path=None, field="line 78 (Barbell back squat, Fact 2, second bullet)", mode="md_sub",
   old="  - Lander measured one 8-RM rep at 3.34-3.56 s in total.",
   new="  - Lander (5 lifters, 8-RM sets): reps with a belt were generally faster than without, especially the later reps (3.34 vs 3.56 s). A belt comparison, not a tempo source.",
   why="Same.")
ed(id="W2-20", sev="low", file=T8, path=None, field="line 215 (Open questions, item 1, Squat sub-bullet)", mode="md_sub",
   old="   - Squat: the plate draws 4 s per rep, but the measured 8-RM rep took about 3.5 s. Keep 2/2, or use 2 down and 1-2 up?",
   new="   - Squat: answered by LR-15 and D-W2-TEMPO. The plate's 2 s down and 2 s up stays a named drawing convention tagged WEAK (c26). Lander's 3.34 vs 3.56 s are with-belt vs no-belt rep times (especially the later reps of 8-RM sets), not a tempo source, so they do not bear on 2/2.",
   why="Same.")
# W2-28 squat quotes
_b7 = {"source":"bloomquist2013","text":"Male students (n = 17) were randomly assigned to 12 weeks of progressive squat training (repetition matched, repetition maximum sets)","where":"abstract"}
_f1 = {"source":"fry2003","text":"Seven weight-trained men (mean +/- SD; age = 27.9 +/- 5.2 years) were videotaped while performing 2 variations of parallel barbell squats (barbell load = body weight).","where":"abstract"}
_f2 = {"source":"fry2003","text":"For the unrestricted squat, knee torque (N.m; mean +/- SD) = 150.1 +/- 50.8 and hip torque = 28.2 +/- 65.0. For the restricted squat, knee torque = 117.3 +/- 34.2 and hip torque = 302.7 +/- 71.2.","where":"abstract"}
_acsmOld = "at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
_acsmNew = "with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)."
_l1 = {"source":"lander1992","text":"multiple repetitions of the parallel back squat exercise. Five subjects were filmed (50 fps) as they performed eight consecutive trials at each of two weight-belt conditions [with belt = WB, without belt = WOB] in random order at their eight-repetition maximum effort.","where":"abstract"}
ed(id="W2-28", sev="low", file=BS, path=["claims",("id","c7"),"quotes"], field="claims[id=c7].quotes (append as quotes[2])", mode="append", expect_len=2, new=_b7, newquote=True, why="Population and duration stated in c7 but unquoted.")
ed(id="W2-28", sev="low", file=BSQ, path=["quotes"], field="quotes: insert after the last c7 entry (head quotes[11])", mode="insert_after_claim", claim="c7", new=[qf("c7","bloomquist2013",_b7["text"])], newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=BS, path=["claims",("id","c12"),"quotes"], field="claims[id=c12].quotes (append quotes[2], quotes[3])", mode="append", expect_len=2, new=[_f1,_f2], newquote=True, why="Population and hip torques stated in c12 but unquoted.")
ed(id="W2-28", sev="low", file=BSQ, path=["quotes"], field="quotes: insert after the last c12 entry (head quotes[20]), population first", mode="insert_after_claim", claim="c12", new=[qf("c12","fry2003",_f1["text"]), qf("c12","fry2003",_f2["text"])], newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=BS, path=["claims",("id","c26"),"quotes",1,"text"], field="claims[id=c26].quotes[1].text", mode="eq", old=_acsmOld, new=_acsmNew, newquote=True, why="ACSM 'heavy loading' stated in c26 but quoted only in part.")
ed(id="W2-28", sev="low", file=BSQ, path=["quotes",48,"quote"], field="quotes[48].quote (head index; c26 entry for card quote 1)", mode="eq", old=_acsmOld, new=_acsmNew, newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=BS, path=["claims",("id","c26"),"quotes"], field="claims[id=c26].quotes (append as quotes[3])", mode="append", expect_len=3, new=_l1, newquote=True, why="Lander's 8-RM parallel back squat and belt conditions (backs the W2-20 text).")
ed(id="W2-28", sev="low", file=BSQ, path=["quotes"], field="quotes: insert after the last c26 entry (head quotes[49])", mode="insert_after_claim", claim="c26", new=[qf("c26","lander1992",_l1["text"])], newquote=True, why="Same.")
# W2-30
_c23old = "In the squat the hands only stop the bar rolling down the back; the back should carry the load. A coach source (written for the low-bar squat) links supporting the bar with the hands, wrists or elbows to inner-elbow tendinitis."
_c23q2 = {"source":"barbell-logic-squat-grip","text":"If the back bears the load of the bar, there’s less chance of developing wrist, shoulder or elbow pain from squatting.","where":"article text"}
ed(id="W2-30", sev="low", file=BS, path=["claims",("id","c23"),"text"], field="claims[id=c23].text", mode="eq", old=_c23old,
   new=_c23old[:-1] + ", and says that when the back bears the load there is less chance of wrist, shoulder or elbow pain.", why="The wrist half of feel row 4 had no quote in the card.")
ed(id="W2-30", sev="low", file=BS, path=["claims",("id","c23"),"quotes"], field="claims[id=c23].quotes (append as quotes[2])", mode="append", expect_len=2, new=_c23q2, newquote=True, why="Same; keep the curly apostrophe in 'there’s'.")
ed(id="W2-30", sev="low", file=BS, path=["feel","rows",3,"claim"], field="feel.rows[3].claim", mode="eq", old=["c23","c24"], new="c23", why="c24 is a different wrist fault (wrapped thumbs) that the sources dispute.")
ed(id="W2-30", sev="low", file=BSQ, path=["quotes"], field="quotes: insert after the last c23 entry (head quotes[42])", mode="insert_after_claim", claim="c23", new=[qf("c23","barbell-logic-squat-grip",_c23q2["text"])], newquote=True, why="Same.")
ed(id="W2-30", sev="low", file=T8, path=None, field="Fetcher results table, barbell_back_squat row (line 25)", mode="md_sub", status="superseded",
   old="| barbell_back_squat | A | 26 | 15 | 50 | 50 | full 6, abstract 9 | 0 |",
   new="| barbell_back_squat | A | 26 | 15 | 51 | 51 | full 6, abstract 9 | 0 |",
   why="Not applied: the table is the 2026-10-17 fetcher record ('all checked 2026-10-17') and this round adds 7 squat quotes, not 1 (W2-16, W2-28, W2-30). The new totals go in the Fix round 1 fetcher line instead.")
ed(id="W2-30", sev="low", file=BS, path=["notes"], field="notes (append)", mode="append",
   new="2026-10-18 (W2-30): feel row 4 (wrists or the inside of the elbows) is backed by c23 alone. c23 now carries the barbell-logic page's closing line, 'If the back bears the load of the bar, there’s less chance of developing wrist, shoulder or elbow pain from squatting.', re-read word for word by curl on 2026-10-18. c24 (wrapped thumbs overextending the wrist) is a different wrist fault and the sources disagree on it (grip.thumb), so it stays in grip only and is not cited on the row.",
   why="Record.")
ed(id="W2-51", sev="ruling", file=BS, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 2: no frequency word for a squat fault (c25's \"most common\" is weights dropping on lifters across all training, not a technique fault). Back rounding (c10) and holding the bar up with the hands (c23) each have one harm source; back rounding is sourced for this lift directly, c23 is applied from the low-bar squat (MECH).",
   why="LR-31: every plate.mistake records its rank step.")

# ---------------- pull_up ----------------
ed(id="W2-17", sev="medium", file=PU, path=["plate","end"], field="plate.end", mode="eq",
   old="Chin above the bar (c5); elbows bent through the measured range, a mean of 93.4 ± 14.6 degrees from the full hang in a lab sample (c6); upper back extended, shoulder blades squeezed back and down (c5, c23); head level, no reaching with the chin (c7).",
   new="Chin above the bar (c5); upper back extended, shoulder blades squeezed back and down (c5, c23); head level, no reaching with the chin (c7).",
   why="Youdas gives a range, not a pose; 'from the full hang' is unsourced (D-LIB9-FACTPOSE).")
ed(id="W2-17", sev="medium", file=PU, path=["notes",0], field="notes[0]", mode="eq",
   old="Elbow positions: the start (elbows completely extended) and the top (chin above the bar) are coach words (c4, c5). The only number is Youdas 2010: the mean elbow range of motion, 93.4 ± 14.6 degrees (c6). No source gives the elbow angle at the top; the plate draws the range, not a sourced top angle.",
   new="Elbow positions: the start (elbows completely extended) and the top (chin above the bar) are coach words (c4, c5). The only number is Youdas 2010: the mean elbow range of motion, 93.4 ± 14.6 degrees (c6). It is a range, not a pose: the abstract gives no start or end angle and does not say the range starts from a full hang, so the plate does not use it. No source gives the elbow angle at the top. The plate draws the top from c5, c23 and c7 (chin above the bar, upper back extended, head level), and the elbow bend that puts the chin there is a drawing convention, not a sourced angle.",
   why="Same.")
ed(id="W2-22", sev="medium", file=PU, path=["feel","rows",1,"fix"], field="feel.rows[1].fix", mode="eq",
   old="Bring your hands in to just outside shoulder width. If the pain persists, do not train through it.",
   new="Bring your hands in to just outside shoulder width. Don't train through the pain.", why="LR-28: 'persists' has no sourced time; time sits in the linked box.")
ed(id="W2-22", sev="medium", file=PU, path=["feel","rows",2,"fix"], field="feel.rows[2].fix", mode="eq",
   old="Build up gradually. If the pain persists, do not train through it.",
   new="Build up gradually. Don't train through the pain.", why="Same.")
ed(id="W2-28", sev="low", file=PU, path=["claims",("id","c6"),"quotes"], field="claims[id=c6].quotes (append as quotes[1])", mode="append", expect_len=1,
   new={"source":"youdas2010","text":"Twenty-one men (24.9 ± 2.4 years) and 4 women (23.5 ± 1 years) volunteered to participate.","where":"abstract"}, newquote=True, why="Population stated in c6 but unquoted.")
ed(id="W2-28", sev="low", file=PUQ, path=["quotes"], field="quotes: insert after the last c6 entry (head quotes[6])", mode="insert_after_claim", claim="c6",
   new=[qf("c6","youdas2010","Twenty-one men (24.9 ± 2.4 years) and 4 women (23.5 ± 1 years) volunteered to participate.")], newquote=True, why="Same.")
ed(id="W2-29", sev="low", file=PU, path=["plate","mistake","what"], field="plate.mistake.what", mode="eq",
   old="Kipping: the body swings and the legs kick to throw the chin over the bar.",
   new="Kipping: the body swings, using momentum to get the chin over the bar.", why="No pull_up claim says the legs kick (CARD-V2: every word from its claims).")
ed(id="W2-29", sev="low", file=PU, path=["handlingMistakes",0,"mistake"], field="handlingMistakes[0].mistake", mode="eq",
   old="Kipping: swinging and kicking to get the chin over the bar.",
   new="Kipping: swinging and using momentum to get the chin over the bar.", why="Same, shown line.")
ed(id="W2-29", sev="low", file=PU, path=["zooms",3,"wrong"], field="zooms[3].wrong (key 'body line')", mode="eq",
   old="Body swinging, legs kicking (kipping).", new="Body swinging (kipping).", why="Same, shown line.")
ed(id="W2-32", sev="low", file=PU, path=["plate","start"], field="plate.start", mode="eq",
   old="Full hang: elbows completely extended, shoulders fully open (c4, c1); palms facing forward, hands just outside shoulder width (c1); body braced and slightly hollow, not swinging (c9); shoulder blades set down and back before the arms bend (c8).",
   new="Full hang: elbows completely extended, shoulders fully open (c4, c1); palms facing forward, hands just outside shoulder width (c1); body braced and slightly hollow, not swinging (c9).",
   why="c8 is the first move of the pull, not the start pose (D-LIB9-FACTPOSE).")
ed(id="W2-33", sev="low", file=PU, path=["claims",("id","c17"),"text"], field="claims[id=c17].text", mode="eq",
   old="The wide-grip pull-up showed less shoulder-blade movement with the arm at 90 degrees out to the side and 45 degrees turned out; the authors link wide (and reverse) pull-ups to higher impingement risk.",
   new="The wide-grip pull-up showed a smaller range of shoulder-blade protraction and retraction (sliding forward and back), and the arm also reached 90 degrees out to the side with 45 degrees turned out; the authors link wide (and reverse) pull-ups to higher impingement risk.",
   why="Prinold full text treats the two findings separately; the claim joined them.")
ed(id="W2-22", sev="medium", file=PU, path=["notes"], field="notes (append)", mode="append", expect_len=5,
   new="2026-10-18 (W2-22): The shoulder and elbow feel fixes drop 'If the pain persists'. NASM (c20) gives no time for 'persists', so the row gives none (LR-28, D-LR23-9). The research-based time comes from the linked shoulder and elbow boxes. 'Don't train through the pain' is from c20 ('rather than training through it'). 'Stop the set' is not added because no pull_up source says to stop (LR-6).",
   why="Record.")
ed(id="W2-32", sev="low", file=PU, path=["notes"], field="notes (append, after the W2-22 note)", mode="append",
   new="Start pose (D-LIB9-FACTPOSE, W2-32, 2026-10-18): the plate draws the open full hang as the start, elbows completely extended and shoulders fully open (c1, c4; c4's quote returns to 'fully open again' at the bottom, and catalyst-pullup's Notes, re-read 2026-10-18, ask that each rep start from a genuinely open shoulder position). Setting the shoulder blades down and back (c8) is the first move of the pull, 'before the arms take over', so it is drawn as the first phase, shown by the 'Shoulders set' checkpoint and the shoulders zoom, not as part of the start pose.",
   why="Record.")
ed(id="W2-33", sev="low", file=PU, path=["notes"], field="notes (append, after the W2-32 note)", mode="append",
   new="2026-10-18 (W2-33): c17's abstract sentence is ambiguous. The full text (PMC4916995, Discussion and Conclusion) treats the two wide-grip findings separately: \"a reduced range of ScT pro/retraction with a similar range of HT plane of elevation, and the achievement of 90\u00b0 of arm abduction with 45\u00b0 external rotation\". prinold2016 access stays \"abstract\" unless the full text is cited as a quote.",
   why="Record of why c17 now separates the two findings.")
ed(id="W2-51", sev="ruling", file=PU, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 3: no frequency word, and no quote ties one of NASM's listed faults to harm. Kipping and momentum come first in NASM's common-faults list (c10); that order is not a ranking.",
   why="LR-31.")

# ---------------- hanging_leg_raise ----------------
ed(id="W2-18", sev="medium", file=HL, path=["plate","end"], field="plate.end", mode="eq",
   old="Straight legs raised until the toes reach the bar, pelvis curled up by the abs as in a crunch (c3); pelvis in posterior tilt, not hyperextended (c8). Expert opinion (WEAK): hip flexion itself stops at approximately 30-45 degrees from the vertical, and the rest of the rise is the pelvis rotating backward with the leg-hip angle unchanged (c4).",
   new="Straight legs raised until the toes reach the bar, pelvis curled up by the abs as in a crunch (c3); pelvis in posterior tilt, not hyperextended (c8). No end hip angle is drawn: Yessis's approximately 30-45 degrees (c4) is where hip flexion stops while the legs keep rising, and the page does not say which vertical it is measured from (notes[0]).",
   why="The 30-45 degree point is mid-rise and its vertical is unstated; an end-pose number nobody can use without guessing.")
ed(id="W2-18", sev="medium", file=HL, path=["notes",0], field="notes[0]", mode="eq",
   old="Hip angle: no source gives a start angle (c2: full hang). The end is coach words, toes to the bar (c3). The only numbers are Yessis expert opinion, approximately 30-45 degrees from the vertical where hip flexion stops and the pelvis takes over (c4); the page does not say whether it means the thigh or the hip angle, so the words are kept and not converted.",
   new="Hip angle: no source gives a start angle (c2: full hang). The end is coach words, toes to the bar (c3). The only numbers are Yessis expert opinion, approximately 30-45 degrees from the vertical where hip flexion stops and the pelvis takes over (c4). The Training Tips sentence names the thighs (\"until the thighs reach approximately the 30-45 degree angle from the vertical\"), but the page has no figure and does not say whether that vertical is the hanging line or straight up, so the words are kept, not converted and not drawn; plate.end draws only toes to the bar and the posterior tilt (c3, c8). Corrected 2026-10-18: the earlier note said the page does not name the thigh.",
   why="c4's own third quote names the thighs.")
ed(id="W2-18", sev="medium", file=T8, path=None, field="line 126 (hanging_leg_raise, Fact 1, c4 bullet)", mode="md_sub",
   old="  - c4, tagged MECH and WEAK: Yessis says hip flexion reaches its maximum at \"approximately 30-45 degrees from the vertical\". He doesn't say whether he means the thigh or the hip angle, so the words are kept and not converted.",
   new="  - c4, tagged MECH and WEAK: Yessis says hip flexion reaches its maximum at \"approximately 30-45 degrees from the vertical\", and that the abs begin to shorten when \"the thighs reach\" that angle. He doesn't say whether the vertical is the hanging line or straight up, so the words are kept, not converted and not drawn; plate.end draws only toes to the bar and the posterior tilt (c3, c8) (2026-10-18).",
   why="Same.")
ed(id="W2-21", sev="medium", file=HL, path=["gaps"], field="gaps (append as gaps[3])", mode="append", expect_len=3,
   new="Tier A: no source says to move the stool clear of the legs once hanging (golden-B's box-clearance setup line, dropped as unsourced); not shown, not invented (LR-3, LIB-WAYOUT). Added 2026-10-18.",
   why="An approved safety line left the sheet without an owner-sheet gap (LR-3, LR-20).")
ed(id="W2-21", sev="medium", file=T8, path=None, field="line 135 (hanging_leg_raise, Tier A gaps list): add a bullet after it", mode="md_sub",
   old="  - The back row links the pending back box (LR-23, LR-26).",
   new="  - The back row links the pending back box (LR-23, LR-26).\n  - No source says to move the stool clear of the legs; golden-B's box-clearance line is not shown and is listed in the card's gaps (LR-3, LIB-WAYOUT; 2026-10-18).",
   why="Same.")
_m12 = {"source":"mcgill2015","text":"Fourteen males performed the exercises while muscle activity, external force and 3D body segment motion were recorded. A sophisticated and anatomically detailed 3D model used muscle activity and body segment kinematics to estimate muscle force","where":"abstract"}
ed(id="W2-28", sev="low", file=HL, path=["claims",("id","c12"),"quotes"], field="claims[id=c12].quotes (append as quotes[2])", mode="append", expect_len=2, new=_m12, newquote=True, why="Population and 3D model stated in c12 but unquoted.")
ed(id="W2-28", sev="low", file=HLQ, path=["quotes"], field="quotes: insert after the last c12 entry (head quotes[25])", mode="insert_after_claim", claim="c12", new=[qf("c12","mcgill2015",_m12["text"])], newquote=True, why="Same.")
ed(id="W2-29", sev="low", file=HL, path=["plate","mistake","why"], field="plate.mistake.why", mode="eq",
   old="All three technique sources forbid swinging (c6, c9), and the hanging raise is described as potentially the easiest leg raise to cheat with a swing (c7). How often it happens is not measured.",
   new="Yessis and StrengthLog say not to swing (c6), and Catalyst says to lift without swinging and, on a pull-up bar, to control the speed to minimise swinging (c3, c9). The hanging raise is described as potentially the easiest leg raise to cheat with a swing (c7). How often it happens is not measured.",
   why="It cited c9, which was not in its claim list; Catalyst's ban is in c3.")
ed(id="W2-29", sev="low", file=HL, path=["plate","mistake","claim"], field="plate.mistake.claim", mode="eq", old=["c7","c6"], new=["c7","c6","c3","c9"], why="Same.")
ed(id="W2-38", sev="low", file=HL, path=["feel","rows",0,"means"], field="feel.rows[0].means", mode="eq",
   old="Expected: the straight-leg hanging raise challenged the abs most of the exercises tested.",
   new="Expected: this raise works the abs very hard.", why="Study test-set wording on a shown line (LR-27).")
ed(id="W2-51", sev="ruling", file=HL, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 3: no frequency word, no common-mistakes list, and no quote ties a named fault to harm. Swinging is the fault the most read sources warn against (Yessis and StrengthLog c6, Catalyst c9, Wikipedia c7).",
   why="LR-31.")

# ---------------- lat_pulldown ----------------
_s02 = {"source":"signorile2002","text":"performance of the lat pull-down exercise using the WGA hand position produces greater muscle activity in the LD than any other hand position during both the concentric or eccentric phases of the movement.","where":"abstract"}
_p24old = {"source":"padovan2024","text":"The front-LPD appears to provide overall greater excitation in the prime movers.","where":"abstract"}
_p24new = {"source":"padovan2024","text":"During the descending phase, the front-LPD showed superior excitation of the latissimus dorsi (ES = 0.97) and the pectoralis major (ES = 1.17), while in the ascending phase, the back-LPD exhibited superior excitation of the latissimus dorsi (ES = 0.63)","where":"abstract"}
_sp09 = {"source":"sperandei2009","text":"For LD, there was no difference between techniques.","where":"abstract"}
ed(id="W2-23", sev="medium", file=LP, path=["claims",("id","c11"),"text"], field="claims[id=c11].text", mode="eq",
   old="Pulling in front of the face gave more lat activity than behind the neck in two EMG studies.",
   new="EMG studies of lat activity, pulling in front versus behind the neck, are mixed: one found more lat activity pulling in front, one found more in front only while the bar comes down and more behind the neck on the way back up, and one found no lat difference.",
   why="Padovan backs it only on the way down; Sperandei (on this card) found no lat difference.")
ed(id="W2-23", sev="medium", file=LP, path=["claims",("id","c11"),"tags"], field="claims[id=c11].tags", mode="eq", old=["DATA"], new=["DATA","WEAK"], why="Same.")
ed(id="W2-23", sev="medium", file=LP, path=["claims",("id","c11"),"sources"], field="claims[id=c11].sources", mode="eq", old=["signorile2002","padovan2024"], new=["signorile2002","padovan2024","sperandei2009"], why="Same.")
ed(id="W2-23", sev="medium", file=LP, path=["claims",("id","c11"),"quotes"], field="claims[id=c11].quotes", mode="eq", old=[_s02,_p24old], new=[_s02,_p24new,_sp09], newquote=True, why="Same.")
ed(id="W2-23", sev="medium", file=LP, path=["plate","mistake","why"], field="plate.mistake.why", mode="eq",
   old="NSCA technique text lists it among the common errors (frequency not measured); Sperandei 2009 concludes it should be avoided, Signorile 2002 and Padovan 2024 found less lat activity than pulling in front, and Kolber 2013 links behind-the-neck pulldowns to signs of anterior shoulder instability (association only).",
   new="NSCA technique text lists it among the common errors (frequency not measured); Sperandei 2009 concludes it should be avoided, though it found no lat difference; Signorile 2002 found less lat activity than pulling in front; Padovan 2024 found less lat activity only while the bar comes down and more on the way back up; and Kolber 2013 links behind-the-neck pulldowns to signs of anterior shoulder instability (association only).",
   why="Same.")
ed(id="W2-23", sev="medium", file=LP, path=["notes",1], field="notes[1]", mode="eq",
   old="plate.mistake choice: the NSCA common-errors list names four faults with no ranking (open grip, trunk flexion to assist, not fully extending, behind the neck). Behind the neck is drawn because it is visible from the side and is the only one with study backing for risk (c9, c10, c11). How often any of them happens is not measured.",
   new="plate.mistake choice: the NSCA common-errors list names four faults with no ranking (open grip, trunk flexion to assist, not fully extending, behind the neck). Behind the neck is drawn because it is visible from the side and is the only one with study backing (c9, c10; the lat data in c11 is mixed, 2026-10-18). How often any of them happens is not measured.",
   why="Same.")
ed(id="W2-23", sev="medium", file=LPQ, path=["quotes",20], field="quotes[20] (c11, padovan2024): replace, then insert the sperandei2009 entry right after it", mode="eq",
   old=qf("c11","padovan2024",_p24old["text"]), new=[qf("c11","padovan2024",_p24new["text"]), qf("c11","sperandei2009",_sp09["text"])], newquote=True, why="Same.")
ed(id="W2-23", sev="medium", file=T8, path=None, field="### lat_pulldown > Fact 3 bullet (line 154)", mode="md_sub",
   old="  - c11: less lat activity.",
   new="  - c11: lat activity is mixed (DATA, WEAK): Signorile less behind the neck; Padovan less only while the bar comes down, more on the way up; Sperandei no lat difference (W2-23, 2026-10-18).",
   why="Same.")
ed(id="W2-34", sev="low", file=LP, path=["feel","secondary"], field="feel.secondary", mode="eq",
   old=[{"muscleId":"mid_back","claim":["c17","c19"]},{"muscleId":"biceps","claim":["c18","c19"]}],
   new=[{"muscleId":"mid_back","claim":["c17","c19"]},{"muscleId":"biceps","claim":["c18","c19"]},{"muscleId":"rear_delts","claim":["c17","c23"]}],
   why="The 'helper' reason for watch-only has no source; NSCA lists the posterior deltoid as trained (c17).")
ed(id="W2-34", sev="low", file=LP, path=["feel","watch"], field="feel.watch", mode="eq", old=[{"muscleId":"rear_delts","claim":["c17","c23"]}], new=[], why="Same.")
ed(id="W2-34", sev="low", file=LP, path=["libraryDiff","add"], field="libraryDiff.add", mode="eq", old=[],
   new=[{"muscleId":"rear_delts","role":"secondary","why":"Listed as trained with the lats, teres major and rhomboids (c17), and rear-deltoid activity was higher with the 30 degree lean (c23)."}],
   why="Proposal only; library changes stay a supervisor batch decision.")
ed(id="W2-34", sev="low", file=LP, path=["libraryDiff","why"], field="libraryDiff.why", mode="eq",
   old="lats primary stands (c17, c19). mid_back secondary stands: middle trapezius is measured active (c19) and rhomboids are listed as trained (c17). biceps secondary stands: measured (c19) and the elbow flexors take part (c18). rear_delts is listed as trained (c17) and rises with the 30 degree lean (c23), but is kept as watch only, not added to the library list, because lat-focused texts treat it as a helper.",
   new="lats primary stands (c17, c19). mid_back secondary stands: middle trapezius is measured active (c19) and rhomboids are listed as trained (c17). biceps secondary stands: measured (c19) and the elbow flexors take part (c18). rear_delts secondary added: the rear deltoid is listed as trained (c17) and its activity was higher with the 30 degree lean (c23); the library list has no rear_delts.",
   why="Same.")
ed(id="W2-34", sev="low", file=LP, path=["notes"], field="notes (append)", mode="append",
   new="2026-10-18: rear_delts moved from watch to secondary. The earlier 'helper' reason had no source. NSCA lists the posterior deltoid among the primary muscles trained (c17). No source on the card ranks it against the lats, so secondary follows the card's mapping of the rhomboids from the same list (mid_back secondary) and the seated_cable_row card.",
   why="Record.")
ed(id="W2-51", sev="ruling", file=LP, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 2: no source uses a frequency word for a pulldown fault. Behind the neck is on the NSCA common-errors list and a study ties it to signs of front-shoulder instability (c9, c10). The past-end pull also has stated harm (c7) but is on no common-errors list.",
   why="LR-31.")

# ---------------- seated_cable_row ----------------
ed(id="W2-35", sev="low", file=SR, path=["feel","rows",0,"fix"], field="feel.rows[0].fix", mode="eq",
   old="Keep your torso upright and still. Use a weight you can pull without rocking.",
   new="Keep your torso upright and still.", why="No cited source gives load advice; tier C, so content.md 5.2 load wording does not apply.")
ed(id="W2-36", sev="low", file=SR, path=["risks",2,"risk"], field="risks[2].risk", mode="eq",
   old="Shoulder: when the tops of the shoulders take over, strain on the shoulder may rise; shown mainly in overhead and throwing athletes.",
   new="Shoulder: when the tops of the shoulders take over, strain on the shoulder may rise; this is linked to overhead and throwing sports.",
   why="Dos Anjos never tested injury; 'shown mainly' overstates a background line (LR-27).")
ed(id="W2-37", sev="low", file=SR, path=["sources",("id","deabreu2023"),"access"], field="sources[id=deabreu2023].access", mode="eq", old="full", new="abstract", why="Only the journal-page abstract was read.")
ed(id="W2-37", sev="low", file=SRQ, path=["sources",("id","deabreu2023"),"access"], field="sources[id=deabreu2023].access", mode="eq", old="full", new="abstract", why="Same.")
ed(id="W2-37", sev="low", file=T8, path=None, field="seated_cable_row > Read (lines 162-163)", mode="md_sub",
   old="  - full: unmc-cable-row (the anchor), nsca-low-row, ace-seated-row (a chest-pad machine row, so its claims are tagged MECH), baechle-earle, deabreu2023;\n  - abstracts: acsm2009, lehman2004, dosanjos2024, callaghan2001;",
   new="  - full: unmc-cable-row (the anchor), nsca-low-row, ace-seated-row (a chest-pad machine row, so its claims are tagged MECH), baechle-earle;\n  - abstracts: acsm2009, lehman2004, dosanjos2024, callaghan2001, deabreu2023 (journal page abstract);",
   why="Same.")
_c19 = {"source":"nsca-low-row","text":"In this position, the weight to be lifted will be suspended above the rest of the stack.","where":"Low Pulley Seated Row, Starting Position"}
ed(id="W2-37", sev="low", file=SR, path=["claims"], field="claims (append new c19 after c18)", mode="append", expect_len=18,
   new={"id":"c19","text":"In the start position (sitting upright, elbows straight), the weight being lifted hangs clear of the rest of the stack.","tags":["CONSENSUS"],"sources":["nsca-low-row"],"quotes":[_c19]},
   newquote=True, why="plate.equipment carried a free-text citation with no claim id (CARD-V2).")
ed(id="W2-37", sev="low", file=SRQ, path=["quotes"], field="quotes (append as quotes[33], after the c18 entry)", mode="append", expect_len=33,
   new=qf("c19","nsca-low-row",_c19["text"]), newquote=True, why="Same.")
ed(id="W2-37", sev="low", file=SR, path=["plate","equipment"], field="plate.equipment", mode="eq",
   old="Low cable with a close-grip V-handle, a long low seat or bench, and a foot plate the feet press against (c1). The weight stack hangs clear of the rest once seated upright (source text: the weight is suspended above the rest of the stack).",
   new="Low cable with a close-grip V-handle, a long low seat or bench, and a foot plate the feet press against (c1). In the upright start position the weight being lifted hangs clear of the rest of the stack (c19).",
   why="Same; only the plates being lifted hang clear.")
ed(id="W2-37", sev="low", file=SR, path=["notes",4], field="notes[4]", mode="eq",
   old="de Abreu 2023: read from the journal page abstract (https://journal.iusca.org/index.php/Journal/article/view/190); the DOI URL is the registry url. It has no PMID.",
   new="de Abreu 2023: read from the journal page abstract (https://journal.iusca.org/index.php/Journal/article/view/190); the DOI URL is the registry url. It has no PMID. Access is abstract: a free full-text PDF exists (CC BY 4.0) but it was not read for this card, and c14 rests on the abstract only (2026-10-18).",
   why="Same.")
ed(id="W2-37", sev="low", file=SR, path=["notes"], field="notes (append)", mode="append",
   new="c19 quote re-read 2026-10-18 by curl from the flashcard page (https://brainscape.com/flashcards/exercise-techniques-3136125/packs/4953113), under Low Pulley Seated Row, Starting Position; word for word.",
   why="Record.")
ed(id="W2-35", sev="low", file=SR, path=["notes"], field="notes (append)", mode="append",
   new="2026-10-18 (W2-35): removed the load line \"Use a weight you can pull without rocking.\" from feel.rows[0].fix. No cited source (unmc-cable-row, nsca-low-row, ace-seated-row) gives load advice for this row. Tier C, so the content.md 5.2 load wording (g1 R2, tier A only) does not apply. No sourced load line found.",
   why="Record.")
ed(id="W2-51", sev="ruling", file=SR, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 2: no frequency word. Two NSCA-listed errors have stated harm, one source each, both applied by reasoning: leaning back (c9) and bending forward on the return (c16). So the NSCA list order decides: jerking or leaning back is first (c6).",
   why="LR-31.")
ed(id="W2-52", sev="ruling", file=SR, path=["plate","tempo","text"], field="plate.tempo.text (substring: the ruling's old is part of the field)", mode="sub", oldmismatch="Ruling gave the old as the whole field; on the head it is a substring of: Drawing convention: 2 s pull, brief pause, 2 s slow return. No source gives seconds for this row; ACSM 1-2 s is stated for intermediate to advanced training (LR-15).",
   old="2 s pull, brief pause, 2 s slow return.",
   new="2 s pull, 1 s pause for ACE's \"pause momentarily\", 2 s slow return.", why="LR-33.")

# ---------------- leg_press ----------------
ed(id="W2-24", sev="high", file=LG, path=["setup",3], field="setup[3]", mode="eq",
   old={"step":"Hold the side handles lightly and brace your abs.","claim":["c12","c11"]},
   new={"step":"Hold the side handles lightly, brace your abs, then push the platform away and release the safety handles; on many machines they turn outwards.","claim":["c12","c11","c3"]},
   why="Merge two steps to free the 5th slot (CARD-V2 cap).")
ed(id="W2-24", sev="high", file=LG, path=["setup",4], field="setup[4]", mode="eq",
   old={"step":"Push the platform away and release the safety handles; on many machines they turn outwards.","claim":"c3"},
   new={"step":"After the set, pause at the top, pull the safety handles in and bend your knees gently until the platform rests on the safety stoppers.","claim":"c22"},
   why="Handles released but never re-locked; c22 sources the re-lock (real exit hazard, as pendulum_squat in w0).")
ed(id="W2-24", sev="high", file=LG, path=["notes"], field="notes (append)", mode="append", expect_len=6,
   new="W2-24 2026-10-18: the re-lock half of c22 is now the last setup step. The old setup steps 4 and 5 (handles and brace, then release) are merged into one to stay within 5 steps. Wording follows c22 (Bells of Steel section 6, re-read by curl 2026-10-18). Machines differ: some use locking levers (c3).",
   why="Record.")
ed(id="W2-25+W2-51", sev="low", file=LG, path=["notes",3], field="notes[3]", mode="eq", merged=True,
   old="Mistake (fact 3): c7 is the only fault a source calls common ('commonly cause low back injury'); the lockout (c8) is the second, also drawable.",
   new="Mistake (fact 3): under LR-31 step 1, c7 is the only fault a source calls common (Yessis: 'Leg press machines commonly cause low back injury because of the rounding of the back when the knees are close to the chest'), so it is the top fault and drawable is true (2026-10-18). NASM's 'Common Mistakes' list names the knees caving or collapsing inward (c10), locking out (c8) and going too far past 90 degrees (c7) without saying how often any of them happens; its order is not a ranking. The knee cave (c10) needs a front view and stays in handlingMistakes. The lockout (c8) is also drawable.",
   why="Merged: W2-25's real point (no source ranks the lockout second; NASM's list is unranked) restated under LR-31; W2-25's 'drawable is false' and 'not how often' wording is overruled by W2-51.")
ed(id="W2-26", sev="low", file=LG, path=["plate","tempo","pause"], field="plate.tempo.pause / text / notes[2] (W2-26's null version)", mode="eq", status="superseded",
   old=0, new=None, why="Superseded by W2-52 (LR-33): pause is 1, not null.")
ed(id="W2-51", sev="ruling", file=LG, path=["plate","mistake","drawable"], field="plate.mistake.drawable", mode="eq", old=False, new=True, reserved=True,
   why="LR-31 step 1: Yessis's 'commonly' (c7) is the only frequency word; the side view shows it.")
ed(id="W2-51", sev="ruling", file=LG, path=["plate","mistake","why"], field="plate.mistake.why", mode="eq",
   old="NASM's common-mistakes list starts with the knees caving inward, alone or from too much weight (c10); that is a sideways fault the side view cannot show. The drawn fault is the knees coming to the chest so the lower back rounds, which Yessis says commonly causes low back injury (c7); ACE and NASM give the same depth limit.",
   new="Yessis says leg press machines commonly cause low back injury because the back rounds when the knees come close to the chest (c7); no source uses a frequency word for any other leg-press fault. ACE and NASM give the same depth limit. NASM's common-mistakes list (excessive weight and the knee cave first, c10) gives no ranking.",
   why="LR-31.")
ed(id="W2-51", sev="ruling", file=LG, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote", mode="eq",
   old="No source measures how often each fault happens. NASM lists its mistakes without a frequency; the knee cave is listed first and stays in handlingMistakes (c10).",
   new="No source measures how often each fault happens. LR-31 step 1: Yessis's \"commonly cause low back injury because of the rounding\" (c7) is the only frequency word for a leg-press fault. NASM's list order is not a ranking; the knee cave stays in handlingMistakes (c10).",
   why="LR-31.")
ed(id="W2-52", sev="ruling", file=LG, path=["plate","tempo","pause"], field="plate.tempo.pause", mode="eq", old=0, new=1, merged=True,
   why="LR-33: ACE 'Pause momentarily' at the top (c24) is a 1 s drawing convention; 0 contradicted the card.")
ed(id="W2-52", sev="ruling", file=LG, path=["plate","tempo","claim"], field="plate.tempo.claim", mode="eq", old="c15", new=["c15","c24"], why="LR-33 (same as W2-26's claim edit).")
ed(id="W2-52", sev="ruling", file=LG, path=["plate","tempo","text"], field="plate.tempo.text", mode="eq",
   old="2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription; an optional one-second pause at the bottom is allowed (c15).",
   new="2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription. ACE asks for a momentary pause at the top and gives no seconds (c24); the 1 s top pause is a drawing convention (LR-33). An optional one-second pause at the bottom is allowed (c15).",
   why="LR-33.")
ed(id="W2-52", sev="ruling", file=LG, path=["notes",2], field="notes[2] (substring)", mode="sub",
   old="pause 0 at the top, with the one-second bottom pause optional.",
   new="the 1 s top pause is a drawing convention for ACE's \"pause momentarily\" (c24; LR-33), and the one-second bottom pause is optional (c15).",
   why="LR-33.")
_lg6 = {"source":"larsen2025","text":"Twenty-three participants (training age: 7.2 ± 3.5 years) completed a within-participant design, performing four sets of unilateral leg presses to momentary failure twice weekly for 8 weeks.","where":"abstract"}
_lg14a = {"source":"macdougall1985","text":"The purpose of this study was to record the blood pressure response to heavy weight-lifting exercise in five experienced body builders.","where":"abstract"}
_lg14b = {"source":"macdougall1985","text":"Exercises included single-arm curls, overhead presses, and both double- and single-leg presses performed to failure at 80, 90, 95, and 100% of maximum.","where":"abstract"}
_lg17 = {"source":"kinoshita2026","text":"Seventeen untrained adults performed KE with one leg and LP with the contralateral leg at 70% of one-repetition maximum, 10 reps/set, 5 sets/session, 2 sessions/week for 12 wk.","where":"abstract, methods"}
_lg19 = {"source":"dasilva2008","text":"Fourteen women performed 3 LP exercises: 45 degrees LP (LP45), LP high (LPH), and LP low (LPL) at 40% and 80% of the 1 repetition maximum.","where":"abstract"}
for cid, qs, n, why in [("c6",[_lg6],2,"Population and duration stated in c6 but unquoted."),("c14",[_lg14a,_lg14b],2,"Population and loads stated in c14 but unquoted."),("c17",[_lg17],2,"Population and duration stated in c17 but unquoted."),("c19",[_lg19],2,"Population stated in c19 but unquoted.")]:
    ed(id="W2-28", sev="low", file=LG, path=["claims",("id",cid),"quotes"], field="claims[id=%s].quotes (append)" % cid, mode="append", expect_len=n, new=qs if len(qs)>1 else qs[0], newquote=True, why=why)
    ed(id="W2-28", sev="low", file=LGQ, path=["quotes"], field="quotes: insert after the last %s entry, in card order" % cid, mode="insert_after_claim", claim=cid, new=[qf(cid,q["source"],q["text"]) for q in qs], newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=LG, path=["claims",("id","c16"),"text"], field="claims[id=c16].text", mode="eq",
   old="Muscles: Yessis names the glutes and hamstrings at the hip and the quadriceps at the knee as the primary muscles; NASM names the quadriceps as the primary mover and the glutes as assisting, with hamstrings and hip adductors secondary.",
   new="Muscles: Yessis names the glutes and hamstrings at the hip and the quadriceps at the knee as the primary muscles; NASM lists the quadriceps (the primary mover) and the glutes (assisting hip extension) as primary muscles, with hamstrings and hip adductors secondary.",
   why="NASM groups the glutes under Primary Muscles; the secondary list was unquoted.")
_n2o = "Quadriceps -- primary mover for knee extension and leg pressing power"
_n2n = "Primary Muscles: Quadriceps -- primary mover for knee extension and leg pressing power Glutes -- assist in hip extension and provide pressing power"
_n3o = "Glutes -- assist in hip extension and provide pressing power"
_n3n = "Secondary Muscles: Hamstrings Hip Adductors Core Stabilizers"
ed(id="W2-28", sev="low", file=LG, path=["claims",("id","c16"),"quotes",2,"text"], field="claims[id=c16].quotes[2].text", mode="eq", old=_n2o, new=_n2n, newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=LGQ, path=["quotes",41,"quote"], field="quotes[41].quote (head index; c16 entry for card quote 2)", mode="eq", old=_n2o, new=_n2n, newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=LG, path=["claims",("id","c16"),"quotes",3,"text"], field="claims[id=c16].quotes[3].text", mode="eq", old=_n3o, new=_n3n, newquote=True, why="Same.")
ed(id="W2-28", sev="low", file=LGQ, path=["quotes",42,"quote"], field="quotes[42].quote (head index; c16 entry for card quote 3)", mode="eq", old=_n3o, new=_n3n, newquote=True, why="Same.")

# ---------------- machine_chest_press ----------------
_mc9 = {"source":"muyor2023","text":"This velocity was controlled by a KORG MA−1 metronome","where":"Procedures"}
ed(id="W2-28", sev="low", file=MC, path=["claims",("id","c9"),"quotes"], field="claims[id=c9].quotes (append as quotes[2])", mode="append", expect_len=2, new=_mc9, newquote=True, why="Metronome stated in c9 but unquoted; keep U+2212 in 'MA−1'.")
ed(id="W2-28", sev="low", file=MCQ, path=["quotes"], field="quotes: insert after the last c9 entry (head quotes[11])", mode="insert_after_claim", claim="c9", new=[qf("c9","muyor2023",_mc9["text"])], newquote=True, why="Same.")
ed(id="W2-51", sev="ruling", file=MC, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 1: ACE says individuals \"very frequently\" press until the shoulder blades round forward off the backrest (c8).",
   why="LR-31.")
ed(id="W2-52", sev="ruling", file=MC, path=["plate","tempo","pause"], field="plate.tempo.pause", mode="eq", old=None, new=1, why="LR-33.")
ed(id="W2-52", sev="ruling", file=MC, path=["plate","tempo","text"], field="plate.tempo.text", mode="eq",
   old="Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds, so pause is null.",
   new="Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds; the 1 s pause is a drawing convention (LR-33).",
   why="LR-33.")
ed(id="W2-52", sev="ruling", file=MC, path=["notes",0], field="notes[0] (substring)", mode="sub",
   old="Pause is null: ACE says \"pause momentarily\" with no seconds (c7).",
   new="The 1 s pause is a drawing convention: ACE says \"pause momentarily\" with no seconds (c7; LR-33).",
   why="LR-33.")

# ---------------- dumbbell_lateral_raise ----------------
_d1 = {"source":"coratella2020","text":"each exercise was performed seated with a load that allowed eight repetitions (i.e., 8-RM).","where":"2.4 Exercise Protocols"}
_d2 = {"source":"coratella2020","text":"A metronome was used to pace the intended duty cycle","where":"2.4 Exercise Protocols"}
ed(id="W2-28", sev="low", file=DL, path=["claims",("id","c9"),"quotes"], field="claims[id=c9].quotes (append quotes[2], quotes[3])", mode="append", expect_len=2, new=[_d1,_d2], newquote=True, why="Seated protocol and metronome stated in c9 but unquoted.")
ed(id="W2-28", sev="low", file=DLQ, path=["quotes"], field="quotes: insert after the last c9 entry (head quotes[11]), seated first", mode="insert_after_claim", claim="c9", new=[qf("c9","coratella2020",_d1["text"]), qf("c9","coratella2020",_d2["text"])], newquote=True, why="Same.")
ed(id="W2-51", sev="ruling", file=DL, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
   new="No source measures how often each fault happens. LR-31 step 2: no frequency word or common-mistakes list. Raising above 90° is the only named fault a source ties to an injury sign (c13, association only).",
   why="LR-31.")

# ---------------- the8.md Fix round 1 ----------------
ed(id="W2-51+W2-52+W2-28", sev="ruling", file=T8, path=None, field="append a section at the end, after 'Fix round 0'", mode="md_append", merged=True,
   new="\n## Fix round 1 (supervisor rulings LR-31, LR-33, 2026-10-18)\n- Top fault (LR-31): every plate.mistake carries a rankNote naming the step used. All picks are unchanged. leg_press: Yessis's \"commonly\" (c7) decides under step 1, so `drawable` is true again, and its why and rankNote are rewritten; the knee cave stays in handlingMistakes (c10).\n- Pause (LR-33): ACE's \"pause momentarily\" is a 1 s drawing convention on the four cards that quote it. machine_chest_press pause null -> 1; leg_press pause 0 -> 1 (top pause, c24 added to tempo.claim); seated_cable_row's text names the 1 s; lat_pulldown unchanged.\n- LR-31 and LR-33 added or changed no quote.\n- 2026-10-18 (W2-28): quotes added for details the claim texts already stated: populations (leg_press c6, c14, c17, c19; barbell_back_squat c7, c12; pull_up c6; hanging_leg_raise c12), durations and loads (leg_press c6, c14, c17; barbell_back_squat c7), Fry's hip torques (barbell_back_squat c12), Lander's 8-RM parallel back squat and ACSM's heavy loading (barbell_back_squat c26), Coratella's seated and metronome protocol (dumbbell_lateral_raise c9), and Muyor's metronome (machine_chest_press c9). leg_press c16 now says NASM lists the quadriceps and glutes as primary muscles, quoting its Primary and Secondary Muscles lists; that quote now supports the libraryDiff adductor reason. All new quotes were re-read on 2026-10-18 by efetch (PubMed and PMC) and curl (NASM). They are verbatim and at most 50 words.\n- Fetcher, fix round 1 (checked <YYYY-MM-DD>): every new or changed quote re-fetched, <n> of <n> verbatim. Quotes-file totals after this round: barbell_back_squat 57 (W2-16 +2, W2-28 +4 and 1 changed, W2-30 +1); pull_up 37; hanging_leg_raise 37; lat_pulldown 41 (W2-23: 1 changed, 1 added); seated_cable_row 34 (W2-37 c19; 19 claims); leg_press 62 (W2-28: 5 added, 2 changed); machine_chest_press 24; dumbbell_lateral_raise 21. The 2026-10-17 table above stays the record of that run.\n",
   why="Merged: W2-51's section, with its 'No quote was added or changed.' line scoped to the two rulings (this round adds quotes via W2-16/23/28/30/37), plus W2-28's note and a fetcher line that replaces W2-30's table edit.")

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

# ---------------- LR-31 (W2-51): rankNotes ----------------
_e = _find("W2-51", PU, "plate.mistake.rankNote (add after drawable)")
_e["new"] = "No source measures how often each fault happens. LR-31 step 3: no frequency word for a pull-up fault (Catalyst's \"natural tendency\" to round the back near the bar, c23, is not one under LR-31), and no quote ties one of NASM's listed faults to harm. Kipping and momentum come first in NASM's common-faults list (c10); NASM's \"Discourage the common faults\" is a list sentence, not a ranking."
_e = _find("W2-51", HL, "plate.mistake.rankNote (add after drawable)")
_e["new"] = _rep(_e["new"], "LR-31 step 3: no frequency word,", "LR-31 step 3: no frequency word (Wikipedia's \"easiest to use bad form on\" and \"may use a swinging motion\", c7, say what can happen, not how often),")
_e = _find("W2-51", LP, "plate.mistake.rankNote (add after drawable)")
_e["new"] = "No source measures how often each fault happens. LR-31 step 1 has no candidate: Snyder's \"often rely on the elbow flexors\" (c18) is muscle use, which stays a feel row. LR-31 step 2: behind the neck is on the NSCA common-errors list and a study ties it to signs of front-shoulder instability (c9, c10). The past-end pull also has stated harm (c7) but is on no common-errors list."
_e = _find("W2-51", SR, "plate.mistake.rankNote (add after drawable)")
_e["new"] = "No source measures how often each fault happens. LR-31 step 2: no frequency word for a row fault (c15's \"often\" is upper-trapezius activity across resistance exercises). Two NSCA-listed errors have stated harm, one source each, both applied by reasoning: leaning back (c9, avoiding it reduces low-back stress) and bending forward on the return (c16). So the NSCA list order decides: jerking or leaning back is first (c6)."
_e = _find("W2-51", MC, "plate.mistake.rankNote (add after drawable)")
_e["new"] = _e["new"] + " Nance's \"many exercise disciplines\" (c14) is about wrist loading in other exercises."
_e = _find("W2-51", DL, "plate.mistake.rankNote (add after drawable)")
_e["new"] = "No source measures how often each fault happens. LR-31 step 1: no frequency word for a lateral-raise fault (ACE's \"this exercise traditionally positions the arms into internal rotation\" says how the exercise is taught, not how often lifters err). LR-31 step 2: two named faults are tied to harm, raising above 90° (Kolber 2014, signs of shoulder impingement, association only, c13) and arms turned in (ACE: the slight external rotation \"may reduce potential impingement\", c5). Neither is on a common-mistakes list; one harm source each; both sourced directly; no list names both. Step 3's count decides: Kolber tells lifters to avoid going beyond 90° (c13)."
_e["do"] = "Expected text: confirm it by the [LR-31 scan]. If step 3's count ties, write the tie in rankNote and stop dumbbell_lateral_raise for a supervisor ruling; report it in FIXED. Do not replace c5's quote (it is verbatim)."
_e["why"] = "LR-31 as amended: step 2 counts a quote that says avoiding the fault reduces harm (c5), so two faults are harm-tied and the tie order applies."

# ---------------- LR-33 (W2-52): leg_press ----------------
_e = _find("W2-52", LG, "plate.tempo.claim")
_e["new"] = ["c15","c25"]
_e["why"] = "LR-33: the new WEAK tempo claim c25 names the 1 s convention; c24 stays on posture[2] with its tags (W2-26's [c15, c24] is not used)."
_e = _find("W2-52", LG, "plate.tempo.text")
_e["new"] = "2 s down, 2 s up: the controlled pace two inclined leg press studies used in trained adults (c15), not a novice prescription. ACE asks for a momentary pause at the top and gives no seconds; the 1 s top pause is a drawing convention (c25; LR-33). An optional one-second pause at the bottom is allowed (c15)."
_e = _find("W2-52", LG, "notes[2] (substring)")
_e["new"] = "the 1 s top pause is a drawing convention for ACE's \"pause momentarily\" (c25; LR-33), and the one-second bottom pause is optional (c15)."

# ---------------- LR-33: machine_chest_press ----------------
_e = _find("W2-52", MC, "plate.tempo.text")
_e["new"] = "Lab pacing on this machine: 2 s pressing, 2 s lowering (study protocol, WEAK). ACE asks for a momentary pause at full press and gives no seconds; the 1 s pause is a drawing convention (c16; LR-33)."
_e = _find("W2-52", MC, "notes[0] (substring)")
_e["new"] = "The 1 s pause is a drawing convention: ACE says \"pause momentarily\" with no seconds (c16; LR-33)."

# ---------------- the8.md Fix round 1 ----------------
_e = _find("W2-51+W2-52+W2-28", T8, "append a section at the end, after 'Fix round 0'")
_s = _e["new"]
_s = _rep(_s, "All picks are unchanged.", "Picks are unchanged under LR-31 as ruled, each re-run with a scan of every read source.")
_s = _rep(_s, "(top pause, c24 added to tempo.claim)", "(top pause); new tempo claims leg_press c25 and machine_chest_press c16 [CONSENSUS, WEAK] name the 1 s, each a copy of the verified ACE quote in c24 and c7")
_s = _rep(_s, "- LR-31 and LR-33 added or changed no quote.", "- LR-31 added or changed no quote; LR-33's c16 and c25 copy verified ACE quotes (c7, c24).")
_s = _rep(_s, "leg_press 62 (W2-28: 5 added, 2 changed); machine_chest_press 24;", "leg_press 63 (W2-28: 5 added, 2 changed; LR-33: c25 added); machine_chest_press 25;")
_e["new"] = _s
_e["why"] = "Merged: W2-51's section, with its 'No quote was added or changed.' line scoped to the two rulings (this round adds quotes via W2-16/23/28/30/37 and LR-33's c16 and c25), plus W2-28's note and a fetcher line that replaces W2-30's table edit. Final LR-31 and LR-33 wording."

# ---------------- added: LR-33 claims and quotes ----------------
_mcq = "Pause momentarily then gently allow your elbows to flex (bend) in a slow, controlled manner while returning the bar back towards the starting position."
_lgq = "Pause momentarily, then slowly return to your starting position by flexing (bending) the hips and knees, and allowing the resistance plate to move towards you in a slow, controlled manner."
add(id="W2-52", sev="ruling", file=MC, path=["claims"], field="claims (append new c16 after c15)", mode="append", expect_len=15,
    new={"id":"c16","text":"Tempo: ACE asks for a momentary pause at full press and gives no seconds, so the 1 s pause on the plate is a drawing convention.","tags":["CONSENSUS","WEAK"],"sources":["ace-chest-press"],"quotes":[{"source":"ace-chest-press","text":_mcq,"where":"Step 3"}]},
    why="LR-33: the 1 s convention is named in a WEAK tempo claim; the quote is a copy of c7's verified ACE quote, so c7 keeps its CONSENSUS tag on posture[4].")
add(id="W2-52", sev="ruling", file=MC, path=["plate","tempo","claim"], field="plate.tempo.claim", mode="eq", old=["c9","c7"], new=["c9","c16"],
    why="LR-33: plate.tempo.claim cites the claim that names the convention; c7 stays on posture[4] with its tags.")
add(id="W2-52", sev="ruling", file=MCQ, path=["quotes"], field="quotes: insert after the last c15 entry", mode="insert_after_claim", claim="c15", newquote=True,
    new=[qf("c16","ace-chest-press",_mcq)], why="Quotes file follows the card (copy of the verified c7 entry).")
add(id="W2-52", sev="ruling", file=LG, path=["claims"], field="claims (append new c25 after c24)", mode="append", expect_len=24,
    new={"id":"c25","text":"Tempo: ACE asks for a momentary pause at the top and gives no seconds, so the 1 s top pause on the plate is a drawing convention.","tags":["CONSENSUS","WEAK"],"sources":["ace-leg-press"],"quotes":[{"source":"ace-leg-press","text":_lgq,"where":"Step 4"}]},
    why="LR-33: the 1 s convention is named in a WEAK tempo claim; the quote is a copy of c24's verified ACE quote, so c24 keeps its CONSENSUS tag on posture[2].")
add(id="W2-52", sev="ruling", file=LGQ, path=["quotes"], field="quotes: insert after the last c24 entry", mode="insert_after_claim", claim="c24", newquote=True,
    new=[qf("c25","ace-leg-press",_lgq)], why="Quotes file follows the card (copy of the verified c24 ACE entry).")
