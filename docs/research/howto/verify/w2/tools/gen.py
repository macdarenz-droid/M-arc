import json
BASE = "/tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad/w2fix"
data = json.load(open(BASE + "/tools/checked.json"))
HEADSHA = "5036283d1e69f617cc45d5b49689e9281f3d61f3"
TOP = "Fix exactly these and nothing else; then re-run your A1-A6 / validation, have your Sonnet fetcher check every new or changed quote, push once, and post FIXED with the sha."

def js(v):
    return json.dumps(v, ensure_ascii=False)

def block(v, md=False):
    if md:
        return "```text\n" + v + "\n```"
    return "```json\n" + js(v) + "\n```"

INTRO = {
 "W2A": """- Head: `claude/libht-verify-w2` @ `{h}` (your files are unchanged there since `a33d8f3a`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Reserved field routed to you by name: `shared/dumbbell-kickup.json` `variants` (reserved on your card: "variants reserved"). Ruling LR-30 (W2-49) opens `variants.bench.steps` and `variants.seated.steps` to you for items marked **[reserved, opened by LR-30]** only. No other reserved field is opened.
- Routed to you by name under ruling LR-31 (W2-51): `cards/assisted_pull_up.json` `plate.mistake` (drawable, why, rankNote) and `handlingMistakes` order, and the LR-31 step on shoulder_press, chin_up and hanging_knee_raise.
- Items marked **[LR-34 step]** or **[LR-31 step]** are judgement steps under those rulings; they run on claude-opus-5-5, not Sonnet. LR-34 steps try way (1) first: the child's own claim, from a verbatim quote your fetcher confirms by curl. Where an item gives a **fallback new** value, apply it instead of new only when the fallback's condition holds. A feel row, redFlag, risk line or tier-A point never leaves a card under LR-34: keep it, stop the card and report it in FIXED. Never invent a fix or a way out (LR-3); never keep a line on golden-B alone.
- Items marked **[conditional]** apply only when the condition in their `do` line holds.
- Quotes-file inserts: apply by claim id and content, not by head index (indices shift after the first insert).
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA; PubMed by efetch) before you push. Fill each `<YYYY-MM-DD>` placeholder with that run's date.
""",
 "THE8": """- Head: `claude/libht-verify-w2` @ `{h}` (your files are unchanged there since `e6381fa4`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Reserved field routed to you by name: `cards/leg_press.json` `plate.mistake.drawable`, which the supervisor's fix round 0 set to false. Ruling LR-31 (W2-51) routes it back to you and sets it to true (item marked **[reserved, routed by LR-31]**). `plate.mistake` keys on the other 7 cards change only as listed (rankNote added; why/what/claim only where an item says so).
- **[LR-31 scan]** (ruling LR-31; judgement on claude-opus-5-5, fetching by your Sonnet fetcher): for each of the 8 cards, the fetcher scans every read source of the card (curl, desktop UA; PubMed by efetch, PMC by efetch db=pmc) for LR-31 step 1's frequency words (commonly, frequently, often, usually; most or many people, lifters or beginners) and for quotes that tie a named fault to harm, including a quote that says avoiding the fault, or the cue that corrects it, reduces that harm. Quote each hit about a fault or injury in that card's `plate.mistake.rankNote`, with why it counts or not. Not frequency words (LR-31's closed list): a 'common mistakes' heading or a list sentence read onto one item; 'tend', 'tendency', 'traditionally', 'can', 'may', 'easy to', 'easily'; a statement about all training, another exercise, a muscle's activity, a load, a grip or a stance. The rankNote items below are the expected texts. If the scan changes a pick or drawable (items 20 and 87-90 included), report it in FIXED. No plate, tell, `plate.mistake.firstKey`, How-to or golden-B text changes (D-LIB5-CARDS8).
- Quotes-file inserts: apply by claim id and content, not by head index (indices shift after the first insert). Each new entry goes right after that claim's existing entries, in the order listed.
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA; PubMed by efetch, PMC by efetch db=pmc) before you push. Fill the `<YYYY-MM-DD>` and `<n>` placeholders in the the8.md Fix round 1 fetcher line from that run.
- Expected quotes-file totals after this packet (a dry run on scratch copies matched every card to its quotes file): barbell_back_squat 57, pull_up 37, hanging_leg_raise 37, lat_pulldown 41, seated_cable_row 34, leg_press 63, machine_chest_press 25, dumbbell_lateral_raise 21.
""",
 "HELPER": """- Head: `claude/libht-verify-w2` @ `{h}` (your files are W2B's, unchanged there since `d4f30c70`). Paths are under `docs/research/howto/`.
- Final rulings: `w2-rulings-final.md` (LR-30 to LR-35; all amended, none rejected). Items keep their numbers from the first packet; items the final rulings added follow them, under "Added by the final rulings".
- Model: the exact edits below may run on claude-sonnet-5 (exact text, exact cards; stop on any mismatch). The items marked **[LR-34 step]** or **[LR-31 step]** are judgement work, so under lib4-cards section 12 item 14 they run on claude-opus-5-5, not Sonnet.
- Routed to you by name: `single_arm_lat_pulldown` `plate.mistake` (rankNote) and `handlingMistakes` order, by ruling LR-32 (W2-50; lib4-cards 13 Q1(b), which sent them to research), and its `claims[id=c14].text` by ruling LR-33; `underhand_lat_pulldown` `plate.mistake` (what, claim, why, rankNote) and `handlingMistakes` order, `leg_press_calf_raise` `plate.mistake.what`, and the LR-31 step on 8 LB1 cards, by ruling LR-31 (W2-51); and the LR-34 re-check of 8 children (W2-53). These are new scope for the W2B files, given here by name; nothing else is opened.
- Quotes-file edits: apply by claim id and content; the head indices are given only to locate the entry.
- Items marked **[fetcher]** add or change a quote: your Sonnet fetcher re-fetches each one by curl (desktop UA) before you push.
""",
}

def render_item(n, e):
    tags = []
    if e.get("step"): tags.append("[%s]" % e["step"])
    if e.get("newquote"): tags.append("[fetcher]")
    if e.get("reserved"):
        tags.append("[reserved, opened by LR-30]" if e["owner"] == "W2A" else "[reserved, routed by LR-31]")
    if e.get("status") == "nochange": tags.append("[no change]")
    if e["mode"] == "task" and e.get("status") != "nochange" and not e.get("step"): tags.append("[LR-34 step]" if "W2-53" in e["id"] or e.get("status") == "conditional" else "[task]")
    if e.get("status") == "conditional" and e["mode"] != "task": tags.append("[conditional]")
    if e.get("merged"): tags.append("[merged]")
    sev = e["sev"]
    head = "%d. **%s** · %s · `%s` · `%s` %s" % (n, e["id"], sev, e["file"], e["field"], " ".join(tags))
    out = [head.rstrip()]
    m = e["mode"]
    md = e["file"].endswith(".md")
    if e.get("do") and m != "task":
        out.append("   - do: " + e["do"])
    if m == "task":
        out.append("   - do: " + e["new"])
    else:
        if m == "eq":
            old = e.get("old_exact", e.get("old"))
            note = " (exact head value; %s)" % e["oldnote"] if e.get("oldnote") else ""
            out.append("   - old%s:\n" % note + indent(block(old)))
            out.append("   - new:\n" + indent(block(e["new"])))
        elif m == "sub":
            out.append("   - old (substring of the field, occurs once%s):\n" % ("; " + e["oldmismatch"] if e.get("oldmismatch") else "") + indent(block(e["old"])))
            out.append("   - new (replaces that substring):\n" + indent(block(e["new"])))
        elif m == "md_sub":
            out.append("   - old (exact text, occurs once):\n" + indent(block(e["old"], md=True)))
            out.append("   - new:\n" + indent(block(e["new"], md=True)))
        elif m == "md_append":
            out.append("   - old: (none; append at the end of the file)")
            out.append("   - new:\n" + indent(block(e["new"].strip("\n"), md=True)))
        elif m == "append":
            ex = " (head has %d entries)" % e["expect_len"] if "expect_len" in e else ""
            what = "these entries, in order" if isinstance(e["new"], list) else "this entry"
            out.append("   - old: (none; append %s at the end of the array%s)" % (what, ex))
            out.append("   - new:\n" + indent(block(e["new"])))
        elif m == "addkey":
            out.append("   - old: (key absent on the head; add it)")
            out.append("   - new:\n" + indent(block([e["new"]] if e.get("aslist") else e["new"])))
        elif m in ("insert_after_claim", "insert_before_claim"):
            where = "right after the last" if m == "insert_after_claim" else "right before the first"
            out.append("   - old: (none; insert %s `%s` entry, head index %d)" % (where, e["claim"], e["anchor"]))
            out.append("   - new:\n" + indent(block(e["new"])))
        elif m == "replace_range":
            out.append("   - old (exact head values; %s):\n" % e.get("oldnote", "") + indent(block(e["old_exact"])))
            out.append("   - new (these entries replace them, so the array shrinks by %d):\n" % (e["end"] - e["start"] - len(e["new"])) + indent(block(e["new"])))
    if "fallback" in e:
        what = "replaces that substring, " if m == "sub" else ""
        out.append("   - fallback new (%sonly when %s):\n" % (what, e["fallback_when"]) + indent(block(e["fallback"], md and m != "md_append")))
    out.append("   - why: " + e["why"])
    return "\n".join(out)

def indent(s):
    return "\n".join("     " + l for l in s.split("\n"))

for owner in ("W2A", "THE8", "HELPER"):
    es = data[owner]
    live = [e for e in es if e.get("status", "apply") not in ("superseded",)]
    sup = [e for e in es if e.get("status") == "superseded"]
    lines = ["# W2 fix packet: %s" % owner, "", TOP, "", INTRO[owner].format(h=HEADSHA)]
    # group by file, keep order of first appearance
    base = [e for e in live if not e.get("added")]
    added = [e for e in live if e.get("added")]
    n = 0
    for group, hdr in ((base, "##"), (added, "###")):
        if group is added and added:
            lines.append("## Added by the final rulings (w2-rulings-final.md)")
            lines.append("")
        files = []
        for e in group:
            if e["file"] not in files: files.append(e["file"])
        for f in files:
            lines.append("%s `%s`" % (hdr, f))
            lines.append("")
            for e in group:
                if e["file"] != f: continue
                n += 1
                e["n"] = n
                lines.append(render_item(n, e))
                lines.append("")
    if sup:
        lines.append("## Not to apply (superseded by a ruling; listed so the verify record is not applied twice)")
        lines.append("")
        for e in sup:
            lines.append("- **%s** `%s` `%s`: %s" % (e["id"], e["file"], e["field"], e["why"]))
        lines.append("")
    open(BASE + "/packet-%s.md" % owner, "w").write("\n".join(lines))
    print(owner, "items", n, "base", len(base), "added", len(added), "superseded", len(sup))
