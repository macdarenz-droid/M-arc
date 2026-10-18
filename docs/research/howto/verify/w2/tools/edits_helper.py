# HELPER edits (merged). Loaded by check.py via exec; defines E (list).
E = []
def ed(**k): E.append(k)

SA = "cards/single_arm_lat_pulldown.json"
UL = "cards/underhand_lat_pulldown.json"; ULQ = "quotes/underhand_lat_pulldown.json"
CS = "cards/cable_shrug.json"; CSQ = "quotes/cable_shrug.json"

def qf(claim, source, quote):
    return {"claim": claim, "source": source, "quote": quote, "status": "verbatim", "closest": None}

# ---------------- single_arm_lat_pulldown (W2-39 + W2-50) ----------------
ed(id="W2-39/W2-50", sev="medium", file=SA, path=["claims",("id","c6"),"quotes",0,"where"], field="claims[id=c6].quotes[0].where", mode="eq",
   old="FAQ", new="Single Arm Lat Pulldown Tips", why="The quote sits under PureGym's Tips, not the FAQ (re-fetched).")
ed(id="W2-39", sev="medium", file=SA, path=["claims",("id","c10"),"quotes",0,"where"], field="claims[id=c10].quotes[0].where", mode="eq",
   old="Common mistakes", new="Common Single-Arm Lat Pulldown Mistakes: Dumping Your Shoulders Forward", why="Exact BarBend section.")
ed(id="W2-39", sev="medium", file=SA, path=["claims",("id","c11"),"quotes",0,"where"], field="claims[id=c11].quotes[0].where", mode="eq",
   old="Common mistakes", new="Common Single-Arm Lat Pulldown Mistakes: Torso Twisting", why="Exact BarBend section.")
ed(id="W2-39", sev="medium", file=SA, path=["inherit",3,"why"], field="inherit[3].why", mode="eq",
   old="true for this child because the seat, pad and overhead pulley are the parent's; the coach sources here add that the torso must also not lean sideways or twist (c6, c11).",
   new="true for this child because the seat, pad and overhead pulley are the parent's; the coach sources here add that the torso must also not lean into each rep or twist (c6, c11).",
   why="'sideways' has no source; c11 says 'leaning into each repetition'.")
_tw = {"mistake":"Twisting or swinging the torso to finish the rep.","fix":"Brace the trunk. If it still twists, lower the load.","claim":"c6"}
_pe = {"mistake":"Pulling past the end so the elbow goes behind you and the shoulder rolls forward.","fix":"Stop when the handle just passes your chin.","claim":["c10","c2"]}
_ln = {"mistake":"Leaning into each rep to get the arm down.","fix":"Tighten your abs to hold the spine still. If your torso still swings or twists, lower the load.","claim":["c11","c6"]}
ed(id="W2-39/W2-50", sev="medium", file=SA, path=["handlingMistakes"], field="handlingMistakes (reorder: past-end first, then twist, then lean; text unchanged)", mode="eq",
   old=[_tw,_pe,_ln], new=[_pe,_tw,_ln], why="LR-32/LR-31: handlingMistakes[0] is the top fault (past-end pull), matching plate.mistake.")
ed(id="W2-39/W2-50", sev="medium", file=SA, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable; drawable stays true)", mode="addkey", merged=True,
   new="No source measures how often each fault happens. LR-31 step 2: no source uses a frequency word for a fault (BarBend's \"perfectly common\" is about one side being stronger). The past-end pull is first in BarBend's common-mistakes list and the only named fault a quote ties to harm (c10; ACE c13, two-arm pulldown, MECH). Torso twisting with the lean (c11) is BarBend's third item, and the twist line is a PureGym tip (c6); neither states a harm.",
   why="W2-50's ruling text replaces W2-39's proposed rankNote (same reasoning, LR-31 step named).")
ed(id="W2-50", sev="ruling", file=SA, path=["notes"], field="notes (append)", mode="append", expect_len=1,
   new="LR-32 (W2-50, supervisor 2026-10-18): the quotes cannot show which fault is most common. Under LR-31 the past-end pull is the top fault (first in BarBend's list, the only fault with stated harm), so drawable stays true and handlingMistakes starts with it. census.json's 'defining fault is a sideways lean' has no source.",
   why="LR-32.")
ed(id="W2-40", sev="low", file=SA, path=["zooms",0,"claim"], field="zooms[0].claim", mode="eq", status="superseded",
   old=["c15","c1"], new=["c15","c1","inherit:0"],
   why="Superseded by W2-53/LR-34: the parent lat_pulldown card's grip.handContact says 'not re-sourced on this card', so inherit[0] is expected to fail; the zoom words are settled in the LR-34 check below. Do not apply.")

# ---------------- underhand_lat_pulldown (W2-42) ----------------
_u1 = "To perform the reverse-grip lat pulldown, you’ll need a pulldown machine or a regular cable machine with a bar attachment."
_u2 = "This guide will focus on the version with a fully-equipped lat pulldown station."
ed(id="W2-42", sev="medium", file=UL, path=["plate","variantLine"], field="plate.variantLine", mode="eq", old=None,
   new="Drawn: the lat pulldown station with a long bar, the version BarBend's guide covers (c19). BarBend also names a regular cable machine with a bar attachment (c19); no card source describes that setup, so no line on this card is claimed to hold for it.",
   why="'Cable / Machine' equipment needs a variant line (content.md 4; D-LIB5-VARIANT 5; not exempt).")
ed(id="W2-42", sev="medium", file=UL, path=["claims"], field="claims (append new c19 after c18)", mode="append", expect_len=18,
   new={"id":"c19","text":"BarBend: the exercise needs a pulldown machine or a regular cable machine with a bar attachment; its guide covers the full lat pulldown station.","tags":["CONSENSUS"],"sources":["barbend-reverse-grip-lat-pulldown"],"quotes":[{"source":"barbend-reverse-grip-lat-pulldown","text":_u1,"where":"How to, intro"},{"source":"barbend-reverse-grip-lat-pulldown","text":_u2,"where":"How to, intro"}]},
   newquote=True, why="Same; keep the curly apostrophe in 'you’ll'.")
ed(id="W2-42", sev="medium", file=ULQ, path=["quotes"], field="quotes (append quotes[24], quotes[25] after the last c18 entry)", mode="append", expect_len=24,
   new=[qf("c19","barbend-reverse-grip-lat-pulldown",_u1), qf("c19","barbend-reverse-grip-lat-pulldown",_u2)], newquote=True, why="Same.")
ed(id="W2-42", sev="medium", file=UL, path=["notes"], field="notes (append)", mode="append",
   new="2026-10-18: c19 is taken from BarBend's 'How to' intro, re-read by curl. BarBend names a pulldown machine or a regular cable machine with a bar attachment and covers only the station. No card source describes the cable-machine setup, such as its seat, thigh pad or bar height, so the variant line claims no line for that kind.",
   why="Record.")

# ---------------- cable_fly, low_to_high_cable_fly (W2-44) ----------------
for f in ["cards/cable_fly.json","cards/low_to_high_cable_fly.json"]:
    ed(id="W2-44", sev="low", file=f, path=["plate","tempo","claim"], field="plate.tempo.claim", mode="eq", old="c12, c5", new=["c12","c5"],
       why="CARD-V2: a claim is an id, a list or inherit:<n>; a comma string resolves to nothing.")

# ---------------- cable_shrug (W2-45) ----------------
_q1 = {"source":"acsm2009","text":"For intermediate (individuals with approximately 6 months of consistent RT experience) to advanced (individuals with years of RT experience) training","where":"abstract"}
_q2 = {"source":"acsm2009","text":"with eventual emphasis on heavy loading (1-6 RM) using 3- to 5-min rest periods between sets performed at a moderate contraction velocity (1-2 s CON; 1-2 s ECC)","where":"abstract"}
_qe = {"source":"exercise-com-cable-shrug","text":"Hold the contraction at the top for a second.","where":"Step 3"}
_qa = {"source":"ace-shrug","text":"lowering slowly to the original starting position.","where":"exercise description"}
ed(id="W2-45", sev="low", file=CS, path=["claims",("id","c7"),"text"], field="claims[id=c7].text (claims[6])", mode="eq",
   old="Tempo: about 1-2 s up and 1-2 s down, with a one-second hold at the top and a slow lowering (the slow lowering is from the ACE barbell shrug page; same shoulder movement on a cable). ACSM gives its 1-2 s each way for intermediate to advanced lifters working toward heavy loads, so the seconds are a drawing convention.",
   new="Tempo: about 1-2 s up and 1-2 s down, with a one-second hold at the top. ACSM gives its 1-2 s each way for intermediate to advanced lifters working toward heavy loads, so the seconds are a drawing convention.",
   why="CONSENSUS+MECH+WEAK is not a tag set the 8 use (CARD-V2); split keeps both flags.")
ed(id="W2-45", sev="low", file=CS, path=["claims",("id","c7"),"tags"], field="claims[id=c7].tags", mode="eq", old=["CONSENSUS","MECH","WEAK"], new=["CONSENSUS","WEAK"], why="Same.")
ed(id="W2-45", sev="low", file=CS, path=["claims",("id","c7"),"sources"], field="claims[id=c7].sources", mode="eq", old=["acsm2009","exercise-com-cable-shrug","ace-shrug"], new=["acsm2009","exercise-com-cable-shrug"], why="Same.")
ed(id="W2-45", sev="low", file=CS, path=["claims",("id","c7"),"quotes"], field="claims[id=c7].quotes", mode="eq", old=[_q1,_q2,_qe,_qa], new=[_q1,_q2,_qe], why="Same.")
ed(id="W2-45", sev="low", file=CS, path=["claims"], field="claims (append new c16 after c15)", mode="append", expect_len=15,
   new={"id":"c16","text":"The lowering is slow, back to the starting position (from the ACE barbell shrug page; same shoulder movement on a cable).","tags":["CONSENSUS","MECH"],"sources":["ace-shrug"],"quotes":[_qa]},
   why="Same; the ACE lowering applied to the cable keeps MECH.")
ed(id="W2-45", sev="low", file=CS, path=["plate","tempo","claim"], field="plate.tempo.claim", mode="eq", old="c7", new=["c7","c16"], why="Same.")
ed(id="W2-45", sev="low", file=CS, path=["posture",3,"claim"], field="posture[3].claim", mode="eq", old="c7", new=["c7","c16"], why="'lower slowly' moves to c16.")
ed(id="W2-45", sev="low", file=CSQ, path=["quotes",10,"claim"], field="quotes[10].claim (ace-shrug 'lowering slowly...')", mode="eq", old="c7", new="c16", why="Same.")
ed(id="W2-45", sev="low", file=CS, path=["notes"], field="notes (new key: the card has no notes on the head; CARD-V2 allows the optional array)", mode="addkey", aslist=True,
   new="c7 is split (2026-10-18, W2-45). The ACE barbell-shrug slow lowering is now c16 [CONSENSUS, MECH], and c7 keeps the top hold plus the ACSM seconds as a drawing convention [CONSENSUS, WEAK] (LR-15, D-W2-TEMPO). Each tag set now matches one the 8 use (CARD-V2). plate.tempo and posture[3] cite both.",
   why="Record.")

# ---------------- W2-46: split tempo + load claims ----------------
_tempo = "For intermediate to advanced lifters with an eventual emphasis on heavy loads (1-6 RM), ACSM advises a moderate speed of 1-2 seconds up and 1-2 seconds down; the plate uses it only as a drawing convention for tempo."
_load = "Load goes up by 2-10% once the target reps are beaten by one or two."
_q3 = {"source":"acsm2009","text":"When training at a specific RM load, it is recommended that 2-10% increase in load be applied when the individual can perform the current workload for one to two repetitions over the desired number.","where":"abstract"}
for card, oldid, newid, idx, nclaims, setupidx, qidx in [
        ("chest_supported_row","c12","c13",11,12,4,18),
        ("horizontal_leg_press","c12","c14",11,13,None,22),
        ("incline_machine_press","c8","c9",7,8,3,13),
        ("straight_arm_pulldown","c15","c16",13,14,None,29)]:
    f = "cards/%s.json" % card; fq = "quotes/%s.json" % card
    ed(id="W2-46", sev="low", file=f, path=["claims",("id",oldid),"text"], field="claims[id=%s].text (claims[%d])" % (oldid, idx), mode="eq",
       old=_tempo + " " + _load, new=_tempo, why="Claims are atoms (content.md 3.2); load rule is not WEAK.")
    ed(id="W2-46", sev="low", file=f, path=["claims",("id",oldid),"quotes"], field="claims[id=%s].quotes (drop the load quote)" % oldid, mode="eq",
       old=[_q1,_q2,_q3], new=[_q1,_q2], why="The load quote moves to %s." % newid)
    ed(id="W2-46", sev="low", file=f, path=["claims"], field="claims (append new %s)" % newid, mode="append", expect_len=nclaims,
       new={"id":newid,"text":_load,"tags":["CONSENSUS"],"sources":["acsm2009"],"quotes":[_q3]}, why="Next free id%s." % (" (c14 not reused)" if card=="straight_arm_pulldown" else ""))
    if setupidx is not None:
        ed(id="W2-46", sev="low", file=f, path=["setup",setupidx,"claim"], field="setup[%d].claim" % setupidx, mode="eq", old=oldid, new=newid, why="The shown load line cites the load claim.")
    ed(id="W2-46", sev="low", file=fq, path=["quotes",qidx,"claim"], field="quotes[%d].claim (the 2-10%% load entry)" % qidx, mode="eq", old=oldid, new=newid, why="Quotes file follows the split.")

# ---------------- W2-47: quotes-file checked dates ----------------
for card, sidx, cid in [("conventional_deadlift",2,"c12"),("dumbbell_romanian_deadlift",5,"c20"),("sumo_deadlift",7,"c21")]:
    fq = "quotes/%s.json" % card
    ed(id="W2-47", sev="low", file=fq, path=["checked"], field="checked (top level)", mode="eq", old="2026-09-30", new="2026-10-17", why="File was rewritten on 2026-10-17 but kept the old date.")
    ed(id="W2-47", sev="low", file=fq, path=["sources",sidx,"checked"], field="sources[%d].checked (id acsm2009)" % sidx, mode="eq", old="2026-09-30", new="2026-10-17", why="Same.", idcheck=("sources",sidx,"acsm2009"))
    ed(id="W2-47", sev="low", file=fq, path=["sources",sidx,"changes"], field="sources[%d].changes (id acsm2009)" % sidx, mode="eq", old="none",
       new="none to the source record; LR-15 re-check: %s's tempo quote replaced by Q1 (intermediate to advanced scope) and Q2 (heavy loading, 1-2 s CON; 1-2 s ECC), both verbatim in the efetch abstract (PMID 19204579)" % cid, why="Same.")

# ---------------- W2-53: LR-34 re-checks (tasks) ----------------
ed(id="W2-53", sev="ruling", file="cards/{close_grip_pulldown,single_arm_lat_pulldown,underhand_lat_pulldown,leg_press_calf_raise,horizontal_leg_press,incline_machine_press,front_squat,goblet_squat}.json", path=None,
   field="inherit[*] LR-34 re-check + notes (append the result per card)", mode="task",
   new="For each of the 8 cards, re-run the LR-8 check of every inherit entry against the parent's card on head 5036283d (lat_pulldown for close_grip_pulldown, single_arm_lat_pulldown, underhand_lat_pulldown; leg_press for leg_press_calf_raise, horizontal_leg_press; machine_chest_press for incline_machine_press; barbell_back_squat for front_squat, goblet_squat). Golden-B sheets and grip-and-feel research are a source map only. Append one notes entry per card that records holds or fails for each inherit entry with the parent field or claim id. Apply LR-34 to any that fail: the child's own fetched, quoted claim; or an LR-4 drawing convention in notes (drawing choice only); or remove the line and add a gaps entry. Never keep a line on golden-B alone. When an inherit entry is removed, every shown word that restates it goes too, and every \"inherit:<n>\" reference is re-indexed. front_squat: check its unrack and walk-out lines against cards/barbell_back_squat.json (no rerack source) or shared/unrack-rerack.json.",
   why="LR-34 (W2-53).")
ed(id="W2-53/W2-40", sev="ruling", file="cards/{single_arm_lat_pulldown,close_grip_pulldown,underhand_lat_pulldown}.json", path=None,
   field="zooms[0].right (hand zoom) inside the LR-34 check", mode="task",
   new="Each hand zoom restates inherit[0] grip.handContact ('across the base of the fingers'): single_arm 'Single handle across the base of the fingers, wrist not curled.'; close_grip 'Neutral grip on the V-handle, handles across the base of the fingers, wrists not curled.'; underhand 'Palms facing you, bar across the base of the fingers, wrists not curled.'. The parent cards/lat_pulldown.json grip.handContact reads 'From the shared pull hand archetype; not re-sourced on this card.' If inherit[0] fails, remove the base-of-the-fingers words from the zoom (as LR-34 did for chin_up and hanging_knee_raise) and record grip.handContact as an LR-4 drawing convention; do not add \"inherit:0\" (W2-40's fix is superseded).",
   why="W2-40 x W2-53 conflict resolved by LR-34.")

# ---------------- W2-54 ----------------
ed(id="W2-54", sev="ruling", file="cards/{rear_delt_fly,bent_over_dumbbell_rear_delt_fly}.json", path=None, field="feel.secondary rotator_cuff (W2-48)", mode="task", status="nochange",
   new="No change: rotator_cuff in feel.secondary is allowed under C2 and LR-35. W2-48's rotator_cuff point is closed.",
   why="LR-35.")

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

# ---------------- LR-32 (W2-50): single_arm rankNote ----------------
_e = _find("W2-39/W2-50", SA, "plate.mistake.rankNote (add after drawable; drawable stays true)")
_e["new"] = "No source measures how often each fault happens. LR-31 step 1: no frequency word for a fault (BarBend's \"perfectly common\" is about one side being stronger; \"usually\" and \"frequently\" there, and PureGym's \"typically\", are about muscles, athletes or the load). LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c10; ACE c13, two-arm pulldown, MECH), and it is first in BarBend's common-mistakes list. BarBend's Going Too Heavy (a load choice) and Torso Twisting with the lean (c11), and the PureGym twist tip (c6), state no harm; if ACE's closing stress line is read onto the backward lean, the past-end pull still wins on harm sources (c10, c13)."
_e["why"] = "LR-32's final text replaces W2-39's proposed rankNote (step 1's finding filed under step 1; step 3 gives the same fault)."

# ---------------- LR-34 (W2-53): HELPER re-checks ----------------
_e = _find("W2-53", "cards/{close_grip_pulldown,single_arm_lat_pulldown,underhand_lat_pulldown,leg_press_calf_raise,horizontal_leg_press,incline_machine_press,front_squat,goblet_squat}.json", "inherit[*] LR-34 re-check + notes (append the result per card)")
_e["new"] = "For each of the 8 cards, re-run the LR-8 check of every inherit entry against the parent's card, or a verified shared card whose appliesTo lists the child (for example shared/selector-pin.json c1 for the pin line), on head 5036283d (lat_pulldown for close_grip_pulldown, single_arm_lat_pulldown, underhand_lat_pulldown; leg_press for leg_press_calf_raise, horizontal_leg_press; machine_chest_press for incline_machine_press; barbell_back_squat for front_squat, goblet_squat). Golden-B sheets and grip-and-feel research are a source map only. An inherit entry stays only where the parent's shipped How-to (tools/plates/layers/exercises/<parent>.howto.mjs on main) has a string for it whose every clause the parent card or shared card supports (D-LIB5-FAMILY `===`). Append one notes entry per card that records holds or fails for each inherit entry by claim id (the parent's, or the shared card's file and claim id), not by setup index (THE8's W2-24 merges leg_press setup[3] and [4]), and gives, per kept entry, the shipped-sheet path it restates, or \"no whole string\". Apply LR-34's ways out, in order, to any that fail: (1) the child's own fetched, quoted claim (tagged MECH or WEAK when written for another exercise), tried first for every shown or safety line; (2) an LR-4 drawing convention in notes, for a pure drawing choice only, never for a safety line; (3) remove the line and add a gaps entry; a removed safety line on a tier-A card joins the owner's tier-A gap list. A feel row, redFlag, risk line or tier-A point is never removed: if way (1) finds no quote, keep it and the inherit entry it rests on as on the head, record the failed check in notes, and report the card as stopped for a supervisor ruling. Never keep a line on golden-B alone. When an inherit entry is removed, every shown word that restates it goes too, and every \"inherit:<n>\" reference is re-indexed. Name any card whose inherit list becomes empty. front_squat: check each unrack and walk-out step, before its plate is drawn, against whichever of cards/barbell_back_squat.json and shared/unrack-rerack.json sources it; if they disagree, the line fails until the supervisor rules (see open point b)."
_e["why"] = "LR-34 (W2-53) as amended: verified shared cards count, claim ids, way (1) first, stop rule, shipped path per kept entry, LR-8's front_squat gates kept."
_e = _find("W2-53/W2-40", "cards/{single_arm_lat_pulldown,close_grip_pulldown,underhand_lat_pulldown}.json", "zooms[0].right (hand zoom) inside the LR-34 check")
_e["new"] = _rep(_e["new"], "If inherit[0] fails, remove the base-of-the-fingers words", "If inherit[0] fails and way (1), through the golden-B lat_pulldown source map, finds no verbatim quote for the handle contact, remove the base-of-the-fingers words")
_e["new"] = _e["new"] + " If way (1) finds one, add it as that card's own claim (fetcher-checked; MECH or WEAK when written for another exercise), keep the words, and cite the claim in the zoom and grip.handContact. Hand contact on a cable handle is a pure drawing choice, so way (2) is allowed."

# ---------------- added: LR-33 single_arm c14 ----------------
_c14 = "The plate uses a 2-second pull and a 2-second return (the cadence Lusk 2010 tested on two-arm pulldowns) with a brief pause at the bottom; a study protocol and coach cue, not a tested recommendation."
add(id="W2-52", sev="ruling", file=SA, path=["claims",("id","c14"),"text"], field="claims[id=c14].text", mode="eq",
    old=_c14, new=_c14 + " BarBend gives no seconds for the pause, so the 1 s on the plate is a drawing convention (LR-33).",
    why="LR-33: a pause-1 tempo claim names the 1 s as a drawing convention; c14 is the only LB1 tempo claim that does not. Tags (WEAK) and quotes are unchanged.")

# ---------------- added: LR-31 underhand_lat_pulldown ----------------
add(id="W2-51", sev="ruling", file=UL, path=["plate","mistake","what"], field="plate.mistake.what", mode="eq",
    old="Using momentum: the torso rocks back to drive the bar down.",
    new="Pulling the bar further down after it passes just below the chin, so the elbows start moving backwards.",
    why="LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c11). Words from c8, c6 and c11.")
add(id="W2-51", sev="ruling", file=UL, path=["plate","mistake","claim"], field="plate.mistake.claim", mode="eq",
    old=["c7","c5"], new=["c6","c8","c11"], why="LR-31.")
add(id="W2-51", sev="ruling", file=UL, path=["plate","mistake","why"], field="plate.mistake.why", mode="eq",
    old="The coach source names momentum first and asks for a stable torso; ACE limits the lean to about 30 degrees with no extra lean during the pull. Frequency is not measured.",
    new="The coach source says pulling the bar further down lets the forearms and deltoids take over (c8); ACE says pulling on once the elbows start moving back adds stress to the shoulder joint (c11, MECH: written for the overhand bar). Frequency is not measured.",
    why="LR-31.")
add(id="W2-51", sev="ruling", file=UL, path=["plate","mistake","drawable"], field="plate.mistake.drawable", mode="task", status="nochange",
    new="No change: drawable stays true. The census side view draws the past-end pull (a still pose).", why="LR-31.")
add(id="W2-51", sev="ruling", file=UL, path=["plate","mistake","rankNote"], field="plate.mistake.rankNote (add after drawable)", mode="addkey",
    new="No source measures how often each fault happens. LR-31 step 1: no frequency word for an underhand-pulldown fault. LR-31 step 2: the past-end pull is the only named fault a quote ties to harm (c11, MECH); c8 names a muscle shift, not harm. Momentum (c7) and the fast return (c9) state no harm.",
    why="LR-31: every plate.mistake carries a rankNote.")
_ul_rock = {"mistake":"Rocking the torso to swing the bar down.","fix":"Keep the torso still.","claim":"c7"}
_ul_far = {"mistake":"Pulling the bar down too far.","fix":"Stop when the bar passes just below your chin.","claim":["c8","c6"]}
_ul_fast = {"mistake":"Letting the bar fly back up.","fix":"Control it all the way up; if you can't, the weight is too heavy.","claim":"c9"}
add(id="W2-51", sev="ruling", file=UL, path=["handlingMistakes"], field="handlingMistakes (reorder: too far first, then rocking, then fast return; text unchanged)", mode="eq",
    old=[_ul_rock,_ul_far,_ul_fast], new=[_ul_far,_ul_rock,_ul_fast],
    why="LR-31: handlingMistakes[0] is the top fault (the past-end pull), matching plate.mistake.")

# ---------------- added: LR-31 leg_press_calf_raise what ----------------
add(id="W2-51", sev="ruling", file="cards/leg_press_calf_raise.json", path=["plate","mistake","what"], field="plate.mistake.what", mode="eq",
    old="Knees snap straight and lock while pushing the platform, often from going too fast.",
    new="Knees snap straight and lock while pushing the platform, which fast reps tend to cause.",
    why="LR-31: \"often\" has no frequency quote behind it (c5 says \"there is a tendency to fully straighten the legs\"); the locked knees are tied to harm (c6) and are a still sign, so the pick and drawable:true stay.")

# ---------------- added: LR-31 steps on 8 LB1 cards ----------------
add(id="W2-51", sev="ruling", file="cards/{close_grip_pulldown,straight_arm_pulldown,chest_supported_row,incline_machine_press,horizontal_leg_press,leg_press_calf_raise,inverted_row,resistance_band_row}.json", path=None,
    field="plate.mistake (top fault, drawable, rankNote) and handlingMistakes[0], per card", mode="task", step="LR-31 step",
    new="For each of the 8 cards: the fetcher scans every read source of the card (curl, desktop UA; PubMed by efetch) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Set the top fault (plate.mistake and handlingMistakes[0]) by LR-31's steps and tie order; drawable is false for a fault whose only sign is speed and true for a still sign even when speed causes it; write plate.mistake.rankNote: \"No source measures how often each fault happens.\" plus the step, the claim ids, and each frequency or harm quote about a fault that a step set aside, with why. A tie that LR-31's order leaves open: record it in rankNote and stop the card for a supervisor ruling. Expected: every pick unchanged. leg_press_calf_raise: rankNote names c5's \"there is a tendency to fully straighten the legs\" as set aside (a tendency is not a frequency word); the 'often' in plate.mistake.what is dropped by item 60; the locked knees are tied to harm (c6) and are a still sign, so the pick and drawable:true stay. horizontal_leg_press keeps its locked-knees pick (a still sign). resistance_band_row: the worn-band item is an equipment check, not a candidate. inverted_row takes step 3's last fallback (no source names a fault: the break of the instruction the most read sources give, said so in plate.mistake.why). Report any change of pick or drawable in FIXED.",
    why="LR-31 (W2-51) rollout: the LB1 cards in W2 fix round 1, before the merged head is named for LIB-9a's Do 6 re-copy.")
