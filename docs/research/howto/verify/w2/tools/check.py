import json, sys, copy, os
BASE = "/tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad/w2fix"
HEAD = BASE + "/head/docs/research/howto/"
TOOLS = BASE + "/tools/"
OUT = BASE + "/dry/"

def load_edits(name):
    g = {}
    exec(open(TOOLS + name).read(), g)
    return g["E"]

ALL = {"W2A": load_edits("edits_w2a.py"), "THE8": load_edits("edits_the8.py"), "HELPER": load_edits("edits_helper.py")}

docs = {}
def doc(f):
    if f not in docs:
        p = HEAD + f
        if f.endswith(".json"):
            docs[f] = json.load(open(p))
        else:
            docs[f] = open(p).read()
    return docs[f]

head = {}
def headdoc(f):
    if f not in head:
        p = HEAD + f
        head[f] = json.load(open(p)) if f.endswith(".json") else open(p).read()
    return head[f]

def resolve(obj, path):
    cur = obj
    for p in path:
        if isinstance(p, tuple):
            k, v = p
            idx = [i for i, x in enumerate(cur) if isinstance(x, dict) and x.get(k) == v]
            if len(idx) != 1:
                raise KeyError("selector %r matched %d" % (p, len(idx)))
            cur = cur[idx[0]]
        else:
            cur = cur[p]
    return cur

def parent_key(obj, path):
    par = resolve(obj, path[:-1]) if len(path) > 1 else obj
    last = path[-1]
    if isinstance(last, tuple):
        k, v = last
        idx = [i for i, x in enumerate(par) if isinstance(x, dict) and x.get(k) == v]
        last = idx[0]
    return par, last

problems = []
report = []
for owner, edits in ALL.items():
    for e in edits:
        st = e.get("status", "apply")
        mode = e["mode"]
        f = e["file"]
        res = "ok"
        try:
            if mode == "task":
                res = "task"
            elif mode in ("md_sub",):
                txt = headdoc(f)
                n = txt.count(e["old"])
                if n != 1:
                    res = "MISMATCH: old occurs %d times" % n
            elif mode == "md_append":
                res = "ok (append)"
            else:
                h = headdoc(f)
                if mode == "eq":
                    v = resolve(h, e["path"])
                    if e.get("old") is None and e.get("oldnote"):
                        e["old_exact"] = v
                        res = "ok (old from head; %s)" % e["oldnote"]
                    elif v != e["old"]:
                        res = "MISMATCH: head=%s" % json.dumps(v, ensure_ascii=False)[:400]
                    e["old_exact"] = v
                elif mode == "sub":
                    v = resolve(h, e["path"])
                    n = v.count(e["old"])
                    if n != 1:
                        res = "MISMATCH: substring occurs %d times" % n
                elif mode == "append":
                    v = resolve(h, e["path"])
                    if "expect_len" in e and len(v) != e["expect_len"]:
                        res = "MISMATCH: len=%d expected %d" % (len(v), e["expect_len"])
                elif mode == "addkey":
                    par = resolve(h, e["path"][:-1])
                    if e["path"][-1] in par:
                        res = "MISMATCH: key exists = %s" % json.dumps(par[e["path"][-1]])[:200]
                elif mode in ("insert_after_claim", "insert_before_claim"):
                    q = resolve(h, e["path"])
                    idx = [i for i, x in enumerate(q) if x.get("claim") == e["claim"]]
                    if not idx:
                        res = "MISMATCH: no entries for claim"
                    e["anchor"] = idx[-1] if mode == "insert_after_claim" else idx[0]
                    if mode == "insert_before_claim" and e.get("old"):
                        got = [q[i] for i in idx]
                        if got != e["old"]:
                            res = "MISMATCH: claim entries differ: %s" % json.dumps(got, ensure_ascii=False)[:300]
                elif mode == "replace_range":
                    v = resolve(h, e["path"])
                    seg = v[e["start"]:e["end"]]
                    if not all(s.startswith(e["startswith"]) for s in seg) or len(seg) != e["end"] - e["start"]:
                        res = "MISMATCH: range"
                    e["old_exact"] = seg
                    if e["end"] < len(v) and v[e["end"]].startswith(e["startswith"]):
                        res = "MISMATCH: range shorter than the notes block"
                if "idcheck" in e:
                    a, i, sid = e["idcheck"]
                    if h[a][i].get("id") != sid:
                        res = "MISMATCH: %s[%d].id=%s" % (a, i, h[a][i].get("id"))
        except Exception as ex:
            res = "MISMATCH: %r" % ex
        e["check"] = res
        e["owner"] = owner
        report.append((owner, e["id"], f, e["field"], st, res))
        if res.startswith("MISMATCH"):
            problems.append((owner, e["id"], f, e["field"], res))

# conflict scan: same file+path touched by two applied edits
seen = {}
for owner, edits in ALL.items():
    for e in edits:
        if e.get("status", "apply") in ("superseded", "nochange") or e["mode"] in ("task", "md_append", "append"):
            continue
        key = (e["file"], json.dumps(e["path"], default=str) if e["path"] else e.get("old", "")[:60])
        seen.setdefault(key, []).append(e["id"] + ":" + e["field"])
conf = {k: v for k, v in seen.items() if len(v) > 1}

for r in report:
    print(" | ".join(str(x) for x in r))
print("\nPROBLEMS:", len(problems))
for p in problems:
    print(p)
print("\nSAME-FIELD (applied):")
for k, v in conf.items():
    print(k, v)
json.dump({o: [{k: v for k, v in e.items()} for e in es] for o, es in ALL.items()}, open(BASE + "/tools/checked.json", "w"), ensure_ascii=False, indent=1, default=str)
