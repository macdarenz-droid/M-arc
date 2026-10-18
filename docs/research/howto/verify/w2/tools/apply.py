import json, copy, os, re, sys
BASE = "/tmp/claude-0/-home-user/d421eb94-4cbc-5338-b4e9-9cfae1b5c8e9/scratchpad/w2fix"
HEAD = BASE + "/head/docs/research/howto/"
OUT = BASE + "/dry/"
TOOLS = BASE + "/tools/"

def load_edits(name):
    g = {}
    exec(open(TOOLS + name).read(), g)
    return g["E"]
ALL = {"W2A": load_edits("edits_w2a.py"), "THE8": load_edits("edits_the8.py"), "HELPER": load_edits("edits_helper.py")}

docs = {}
def doc(f):
    if f not in docs:
        p = HEAD + f
        docs[f] = json.load(open(p)) if f.endswith(".json") else open(p).read()
    return docs[f]

def sel(cur, p):
    if isinstance(p, tuple):
        k, v = p
        idx = [i for i, x in enumerate(cur) if isinstance(x, dict) and x.get(k) == v]
        assert len(idx) == 1, p
        return idx[0]
    return p

def walk(obj, path):
    cur = obj
    for p in path:
        cur = cur[sel(cur, p)]
    return cur

def setv(obj, path, val):
    par = walk(obj, path[:-1])
    k = sel(par, path[-1])
    if isinstance(par, list) and isinstance(val, list) and path[-2:] and path[-1] == 20 and isinstance(par[k], dict) and "claim" in par[k]:
        par[k:k+1] = val  # splice (lat_pulldown quotes[20])
    else:
        par[k] = val

applied = 0
for phase in (1, 2):
    for owner, edits in ALL.items():
        for e in edits:
            st = e.get("status", "apply")
            if st in ("superseded", "nochange") or e["mode"] == "task" or e.get("route") == "fallback":
                continue
            m = e["mode"]
            if (m in ("append", "insert_after_claim", "insert_before_claim", "md_append")) != (phase == 2):
                continue
            f = e["file"]
            if m == "md_sub":
                t = doc(f); assert t.count(e["old"]) == 1, e["field"]; docs[f] = t.replace(e["old"], e["new"])
            elif m == "md_append":
                docs[f] = doc(f).rstrip("\n") + "\n" + e["new"]
            elif m == "eq":
                setv(doc(f), e["path"], copy.deepcopy(e["new"]))
            elif m == "sub":
                v = walk(doc(f), e["path"]); assert v.count(e["old"]) == 1
                setv(doc(f), e["path"], v.replace(e["old"], e["new"]))
            elif m == "addkey":
                par = walk(doc(f), e["path"][:-1]); par[e["path"][-1]] = [e["new"]] if e.get("aslist") else e["new"]
            elif m == "replace_range":
                v = walk(doc(f), e["path"]); v[e["start"]:e["end"]] = e["new"]
            elif m == "append":
                v = walk(doc(f), e["path"])
                if isinstance(e["new"], list): v.extend(copy.deepcopy(e["new"]))
                else: v.append(copy.deepcopy(e["new"]))
            elif m in ("insert_after_claim", "insert_before_claim"):
                q = walk(doc(f), e["path"])
                idx = [i for i, x in enumerate(q) if x.get("claim") == e["claim"]]
                at = idx[-1] + 1 if m == "insert_after_claim" else idx[0]
                q[at:at] = copy.deepcopy(e["new"])
            applied += 1

os.makedirs(OUT, exist_ok=True)
for f, d in docs.items():
    p = OUT + f
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, "w") as fh:
        if f.endswith(".json"):
            json.dump(d, fh, ensure_ascii=False, indent=2); fh.write("\n")
        else:
            fh.write(d)
print("applied", applied, "files", len(docs))

# ---- validation ----
def words(s):
    return len([w for w in re.split(r"\s+", s.strip()) if w])

def refs(obj, out, where=""):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("claim", "claims") and where not in ("",) or (k == "claim"):
                pass
            if k == "claim":
                vals = v if isinstance(v, list) else [v]
                for x in vals:
                    if isinstance(x, str): out.append((where + "." + k, x))
            elif k == "claims" and where != "" and isinstance(v, list) and all(isinstance(x, str) for x in v):
                for x in v: out.append((where + "." + k, x))
            else:
                refs(v, out, where + "." + k)
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            refs(v, out, where + "[%d]" % i)

def card_issues(c):
    iss = []
    ids = [x["id"] for x in c.get("claims", [])]
    if len(ids) != len(set(ids)): iss.append("dup claim ids")
    ninh = len(c.get("inherit", []) or [])
    body = {k: v for k, v in c.items() if k not in ("claims", "sources")}
    rs = []; refs(body, rs)
    for w, r in rs:
        if r.startswith("inherit:"):
            n = int(r.split(":")[1])
            if n >= ninh: iss.append("bad %s at %s" % (r, w))
        elif r not in ids:
            iss.append("missing claim %r at %s" % (r, w))
    srcs = [s["id"] for s in c.get("sources", [])]
    used = set()
    for cl in c.get("claims", []):
        for s in cl.get("sources", []): used.add(s)
        for q in cl.get("quotes", []):
            if q["source"] not in cl.get("sources", []): iss.append("quote source %s not in %s sources" % (q["source"], cl["id"]))
            if words(q["text"]) > 50: iss.append("quote >50 words in %s" % cl["id"])
    orph = [s for s in srcs if s not in used]
    if orph: iss.append("orphan sources %s" % orph)
    return iss

def quotes_match(c, qf):
    a = {}
    for cl in c.get("claims", []):
        for q in cl.get("quotes", []):
            a.setdefault(cl["id"], []).append((q["source"], q["text"]))
    b = {}
    for q in qf.get("quotes", []):
        b.setdefault(q["claim"], []).append((q["source"], q.get("quote", q.get("text"))))
    bad = []
    for k in set(a) | set(b):
        if sorted(a.get(k, [])) != sorted(b.get(k, [])):
            bad.append(k)
    return bad

touched = sorted({f for f in docs if f.startswith("cards/") or f.startswith("shared/")})
for f in touched:
    after = docs[f]
    before = json.load(open(HEAD + f))
    ib, ia = set(card_issues(before)), set(card_issues(after))
    new = ia - ib
    gone = ib - ia
    qpath = ("quotes/" + f.split("/")[1]) if f.startswith("cards/") else "quotes/shared-" + f.split("/")[1]
    qa = docs.get(qpath) or json.load(open(HEAD + qpath))
    qb = json.load(open(HEAD + qpath))
    mm_a = quotes_match(after, qa); mm_b = quotes_match(before, qb)
    print("%-45s new_issues=%s fixed=%s quotes_mismatch_before=%s after=%s nquotes=%d" % (f, sorted(new), sorted(gone)[:3], mm_b, mm_a, len(qa.get("quotes", []))))
