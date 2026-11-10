"""MO: finish the shared figure's rig in Blender (run with Blender 5's Python module, `pip install bpy==5.0.1`).

    python tools/motion/figure_rig.py <meshy-rigged.glb> <out.glb> <out.meta.json>

Meshy's rig has 24 bones and no fingers (rig task 01a0fdaf, 2026-10-02). This adds, per side:
  - 3 upper-arm twist bones (at 0, 1/3 and 2/3 of the upper arm) and 3 forearm twist bones (1/4, 1/2, 3/4),
    with the arm's own weight shared out along its length, so turning the arm or forearm spreads the twist
    instead of tearing the skin at one joint;
  - 15 finger bones (thumb: metacarpal, proximal, distal; fingers: proximal, middle, distal), found from the
    mesh itself: fingers are the long branches of the hand (a merge tree over the vertices, ordered by distance
    from the wrist), and weighted along each finger with smooth blends at the joints.
It also bakes a material class per vertex (skin / clothing) into COLOR_0.b from the texture, then drops the
texture: the app shades the figure with theme colours. COLOR_0.r/g stay 0 here; regions.py fills them.
"""
import bpy, sys, json
import numpy as np
from mathutils import Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
INP, OUT, META = argv[0], argv[1], argv[2]

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INP)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
me = mesh.data
n = len(me.vertices)

MW = np.array(mesh.matrix_world)
co = np.array([v.co for v in me.vertices])
P = (np.c_[co, np.ones(n)] @ MW.T)[:, :3]                      # world positions (Blender Z-up)

groups = {g.index: g.name for g in mesh.vertex_groups}
W = {name: np.zeros(n) for name in groups.values()}
for v in me.vertices:
    for g in v.groups:
        W[groups[g.group]][v.index] = g.weight

adj = [[] for _ in range(n)]
for e in me.edges:
    a, b = e.vertices
    adj[a].append(b); adj[b].append(a)
# glTF splits vertices at UV seams, so the imported mesh is many islands. Link vertices that share a position
# (the seams) so connectivity follows the surface, without changing the mesh itself.
_key = {}
for i, k in enumerate(map(tuple, np.round(co * 1e5).astype(np.int64))):
    if k in _key:
        j = _key[k]; adj[i].append(j); adj[j].append(i)
    else:
        _key[k] = i

def head(name):
    return np.array(arm.matrix_world @ arm.data.bones[name].head_local)

def norm(v):
    return v / np.linalg.norm(v)

def smooth(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)

def group(name):
    if name not in mesh.vertex_groups:
        mesh.vertex_groups.new(name=name)
        W[name] = np.zeros(n)
    return name

new_bones = []   # (name, head, tail, parent, roll_vector)
meta = {'fingers': {}, 'twist': {}}
FORWARD = np.array([0.0, -1.0, 0.0])                            # glTF +Z (figure's front) in Blender space

# ---------- twist bones ----------
def twist(side, seg, child, fracs, keep_end):
    a, b = head(f'{side}{seg}'), head(f'{side}{child}')
    axis = b - a
    L = np.linalg.norm(axis); d = axis / L
    names = [f'{side}{seg}Twist{i}' for i in range(len(fracs))]
    for nm, f in zip(names, fracs):
        p = a + d * L * f
        new_bones.append((nm, p, p + d * 0.03, f'{side}{seg}', FORWARD))
        group(nm)
    w = W[f'{side}{seg}'].copy()
    s = np.clip(((P - a) @ d) / L, 0, 1)
    stops = list(fracs) + [1.0]
    owners = names + [f'{side}{seg}']
    if keep_end == 'start':                                      # forearm: the segment bone itself owns s=0
        stops = [0.0] + list(fracs)
        owners = [f'{side}{seg}'] + names
    share = {o: np.zeros(n) for o in owners}
    for i in range(len(stops) - 1):
        lo, hi = stops[i], stops[i + 1]
        m = (s >= lo) & (s <= hi) if i == 0 else (s > lo) & (s <= hi)
        t = (s[m] - lo) / (hi - lo)
        share[owners[i]][m] += 1 - t
        share[owners[i + 1]][m] += t
    m = s < stops[0]; share[owners[0]][m] += 1
    m = s > stops[-1]; share[owners[-1]][m] += 1
    for o in owners:
        W[o] = w * share[o]                                      # the segment's own weight, shared along its length
    meta['twist'][f'{side}{seg}'] = {'bones': names, 'fractions': list(fracs), 'axisFrom': f'{side}{seg}', 'axisTo': f'{side}{child}'}

# ---------- fingers ----------
FN = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']
SEG = {}                                                          # side -> finger name -> member vertex ids


def hand_frame(side):
    hand = f'{side}Hand'
    wrist = head(hand)
    H = np.where(W[hand] > 0.5)[0]
    d = norm(P[H].mean(0) - wrist)
    C = P[H] - wrist
    C2 = C - np.outer(C @ d, d)
    evals, evecs = np.linalg.eigh(np.cov(C2.T))                  # ascending: ~0 along d, then thickness, then width
    nrm = evecs[:, 1]
    nrm = norm(nrm - d * (nrm @ d))
    if nrm @ FORWARD < 0: nrm = -nrm                               # palm faces forward in the rest pose
    lat = norm(np.cross(d, nrm))
    return wrist, H, d, nrm, lat, (P - wrist) @ d


def segment_by_tree(side):
    """Fingers = the 5 longest branches of a merge tree over the hand's vertices, tips first. None if the
    fingers touch (then a branch cannot be told apart by connectivity)."""
    wrist, H, d, nrm, lat, s_all = hand_frame(side)
    inH = np.zeros(n, bool); inH[H] = True
    order = H[np.argsort(-s_all[H])]
    parent = {}; members = {}; tip = {}
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]; x = parent[x]
        return x
    closed = {}
    MIN_LEN = 0.012
    for v in order:
        parent[v] = v; members[v] = [v]; tip[v] = s_all[v]
        for u in adj[v]:
            if not inH[u] or u not in parent: continue
            ru, rv = find(u), find(v)
            if ru == rv: continue
            sv = s_all[v]
            old, young = (ru, rv) if tip[ru] >= tip[rv] else (rv, ru)
            if tip[young] - sv >= MIN_LEN:
                closed[young] = {'tip_s': tip[young], 'base_s': sv, 'members': list(members[young])}
                if old not in closed and tip[old] - sv >= MIN_LEN:
                    closed[old] = {'tip_s': tip[old], 'base_s': sv, 'members': list(members[old])}
            parent[young] = old
            members[old].extend(members[young]); del members[young]
    comps = sorted(closed.values(), key=lambda c: -(c['tip_s'] - c['base_s']))[:5]
    if len(comps) != 5:
        print(f'{side}: merge tree found {len(comps)} finger branches; falling back to the mirrored hand')
        return None
    thumb = min(comps, key=lambda c: c['base_s'])
    rest = [c for c in comps if c is not thumb]
    tt = (P[thumb['members']] - wrist).mean(0) @ lat
    rest.sort(key=lambda c: abs((P[c['members']] - wrist).mean(0) @ lat - tt))
    return dict(zip(FN, [thumb['members']] + [c['members'] for c in rest]))


def segment_by_mirror(side, other):
    """Label this hand from the other hand's labels, mirrored across the body's midline (x = 0)."""
    _, H, _, _, _, _ = hand_frame(side)
    _, Ho, _, _, _, _ = hand_frame(other)
    lab_o = np.full(n, -1)
    for k, nm in enumerate(FN): lab_o[SEG[other][nm]] = k
    src = P[Ho] * np.array([-1.0, 1.0, 1.0])
    out = {nm: [] for nm in FN}
    for chunk in np.array_split(H, max(1, len(H) // 256)):
        dd = ((P[chunk][:, None, :] - src[None, :, :]) ** 2).sum(-1)
        nearest = Ho[np.argmin(dd, 1)]
        for v, k in zip(chunk, lab_o[nearest]):
            if k >= 0: out[FN[k]].append(int(v))
    return out


def fingers(side):
    hand = f'{side}Hand'
    wrist, H, d, nrm, lat, s_all = hand_frame(side)
    seg = SEG[side]
    lab = np.full(n, -1)
    for k, nm in enumerate(FN): lab[seg[nm]] = k
    bridges = sum(1 for e in me.edges if lab[e.vertices[0]] >= 1 and lab[e.vertices[1]] >= 1 and lab[e.vertices[0]] != lab[e.vertices[1]])
    meta.setdefault('fingerBridgeEdges', {})[side] = int(bridges)
    base_of = {nm: float(np.percentile(s_all[seg[nm]], 2)) for nm in FN}
    thumb = {'members': seg['Thumb'], 'base_s': base_of['Thumb']}
    rest = [{'members': seg[nm], 'base_s': base_of[nm]} for nm in FN[1:]]
    names = ['Index', 'Middle', 'Ring', 'Pinky']
    out = {}
    hand_len = s_all[H].max()

    def axis_of(M):
        X = P[M]; c = X.mean(0)
        e, V = np.linalg.eigh(np.cov((X - c).T)); a = V[:, np.argmax(e)]
        if a @ d < 0: a = -a
        return a, c

    def centroid_at(M, a, start, t):
        u = (P[M] - start) @ a
        L = u.max()
        m = np.abs(u - t * L) < max(0.04 * L, 0.002)
        return P[np.array(M)[m]].mean(0) if m.any() else start + a * t * L

    def weigh(chain, bones, M, palm_band, blend):
        # chain: joint points J0..Jk (k bones); weights along the chain parameter with smooth joint blends
        seg = [np.linalg.norm(chain[i + 1] - chain[i]) for i in range(len(bones))]
        total = sum(seg)
        def param(x):
            best = None
            acc = 0.0
            for i in range(len(bones)):
                a, b = chain[i], chain[i + 1]
                ab = b - a; L = seg[i]
                t = np.clip(((x - a) @ ab) / (L * L), 0, 1)
                dist = np.linalg.norm(x - (a + np.outer(t, ab)), axis=1)
                u = acc + t * L
                if best is None:
                    best = (dist, u)
                else:
                    take = dist < best[0]
                    best = (np.where(take, dist, best[0]), np.where(take, u, best[1]))
                acc += L
            return best[1]
        idx = np.array(sorted(set(M) | set(palm_band)))
        u = param(P[idx])
        joints_u = np.cumsum([0.0] + seg)
        wts = np.zeros((len(idx), len(bones) + 1))               # column 0 = hand bone
        b0 = blend * total
        wts[:, 0] = 1 - smooth((u - (joints_u[0] - b0)) / (2 * b0))
        for k in range(len(bones)):
            lo = smooth((u - (joints_u[k] - b0)) / (2 * b0))
            hi = 1 - smooth((u - (joints_u[k + 1] - b0)) / (2 * b0)) if k < len(bones) - 1 else np.ones(len(idx))
            wts[:, k + 1] = lo * hi
        wts /= wts.sum(1, keepdims=True)
        free = W[hand][idx].copy()                               # only the hand bone's share moves to the finger
        for k, b in enumerate(bones):
            group(b)
            W[b][idx] = free * wts[:, k + 1]
        W[hand][idx] = free * wts[:, 0]

    for c, nm in zip(rest, names):
        M = c['members']; a, _ = axis_of(M)
        base = P[M][((P[M] - wrist) @ d) <= c['base_s'] + 0.004].mean(0)
        tipp = P[M][np.argmax((P[M] - base) @ a)]
        Lv = (tipp - base) @ a
        J0 = base - a * 0.25 * Lv
        L = (tipp - J0) @ a
        J1 = centroid_at(M, a, J0, 0.48); J2 = centroid_at(M, a, J0, 0.78)
        J1 = J0 + a * 0.48 * L if np.linalg.norm(J1 - J0) < 0.2 * L else J1
        J2 = J0 + a * 0.78 * L if np.linalg.norm(J2 - J0) < 0.5 * L else J2
        chain = [J0, J1, J2, tipp - a * 0.002]
        bones = [f'{side}Hand{nm}{i}' for i in (1, 2, 3)]
        lat_c = (P[M] - wrist).mean(0) @ lat
        sp = 0.011
        band = [i for i in H if c['base_s'] - 0.035 <= s_all[i] <= c['base_s'] and abs((P[i] - wrist) @ lat - lat_c) < sp]
        weigh(chain, bones, M, band, 0.08)
        for i, b in enumerate(bones):
            new_bones.append((b, chain[i], chain[i + 1], f'{side}Hand' if i == 0 else bones[i - 1], nrm))
        out[nm] = {'bones': bones, 'joints': [list(map(float, j)) for j in chain]}

    M = thumb['members']; a, _ = axis_of(M)
    base = P[M][((P[M] - wrist) @ d) <= thumb['base_s'] + 0.004].mean(0)
    tipp = P[M][np.argmax((P[M] - base) @ a)]
    Lv = (tipp - base) @ a
    J1 = base - a * 0.08 * Lv
    J2 = J1 + a * 0.55 * ((tipp - J1) @ a)
    J0 = wrist + 0.35 * (J1 - wrist)
    chain = [J0, J1, J2, tipp - a * 0.002]
    bones = [f'{side}HandThumb{i}' for i in (1, 2, 3)]
    seg01 = J1 - J0
    tparam = np.clip(((P[H] - J0) @ seg01) / (seg01 @ seg01), 0, 1)
    dist = np.linalg.norm(P[H] - (J0 + np.outer(tparam, seg01)), axis=1)
    band = list(H[(dist < 0.022) & (tparam > 0.05)])
    weigh(chain, bones, M, band, 0.10)
    for i, b in enumerate(bones):
        new_bones.append((b, chain[i], chain[i + 1], f'{side}Hand' if i == 0 else bones[i - 1], nrm))
    out['Thumb'] = {'bones': bones, 'joints': [list(map(float, j)) for j in chain]}
    meta['fingers'][side] = {'fingers': out, 'palmNormal': list(map(float, nrm)), 'handAxis': list(map(float, d)), 'lateral': list(map(float, lat)), 'handLength': float(hand_len)}

# ---------- arm weights rebuilt from the arm's own shape ----------
# Below the armpit fold, every vertex of the arm is weighted from its position along shoulder -> elbow ->
# wrist -> hand tip only (smooth blends at the elbow and wrist); weight from any other bone is dropped.
# Arm vertices are those within the arm's measured radius (per 10% slice) that Meshy already gave some arm
# weight, or that sit well inside that radius.
def rebuild_arm(side):
    S, E, Wr = head(f'{side}Arm'), head(f'{side}ForeArm'), head(f'{side}Hand')
    tip = Wr + norm(Wr - E) * 0.21
    chain = [f'{side}Arm', f'{side}ForeArm', f'{side}Hand']
    pts = [S, E, Wr, tip]
    lens = [np.linalg.norm(pts[i + 1] - pts[i]) for i in range(3)]
    cum = np.concatenate([[0], np.cumsum(lens)])
    # arc-length coordinate u along the chain and distance r to it, for every vertex
    best_r = np.full(n, np.inf); u = np.zeros(n)
    for i in range(3):
        a, b = pts[i], pts[i + 1]; d = (b - a) / lens[i]
        t = np.clip((P - a) @ d, -0.05 if i == 0 else 0, lens[i] + (0.02 if i == 2 else 0))
        r = np.linalg.norm(P - (a + np.outer(t, d)), axis=1)
        take = r < best_r
        best_r[take] = r[take]; u[take] = cum[i] + t[take]
    armw = sum(W[b] for b in chain)
    # measured radius per slice of u (95th percentile of vertices Meshy weights mostly to the arm)
    core = armw > 0.85
    edges = np.linspace(0, cum[-1], 25)
    R = np.full(n, 0.0)
    for k in range(len(edges) - 1):
        sl = core & (u >= edges[k]) & (u < edges[k + 1])
        rr = np.percentile(best_r[sl], 95) if sl.sum() > 15 else 0.05
        R[(u >= edges[k]) & (u < edges[k + 1])] = rr
    fold = cum[0] + 0.30 * lens[0]                                    # below the armpit fold (30% down the upper arm)
    member = (u > fold) & (u <= cum[-1]) & (((best_r < R + 0.008) & (armw > 0.2)) | (best_r < 0.7 * R))
    m = np.where(member)[0]
    # chain weights by u: elbow blend +-4.5 cm, wrist blend +-2.5 cm
    fe = smooth((u[m] - (cum[1] - 0.045)) / 0.09)
    fw = smooth((u[m] - (cum[2] - 0.025)) / 0.05)
    wa = 1 - fe; wf = fe * (1 - fw); wh = fw
    for g in list(W.keys()):
        W[g][m] = 0.0
    W[chain[0]][m] = wa; W[chain[1]][m] = wf; W[chain[2]][m] = wh
    # blend into Meshy's own weights over the 8 cm above the fold, so the shoulder stays as Meshy made it
    meta.setdefault('armRebuilt', {})[side] = int(len(m))

for side in ('Left', 'Right'):
    rebuild_arm(side)

# ---------- limb ownership ----------
# At rest the arms hang beside the ribs and hips, and Meshy gave some arm skin to the spine, hips or thigh
# bones; lifting the arm then leaves that skin behind as a flap. Inside each arm segment's own radius
# (between its joints), weight from bones outside the arm chain goes to the segment's bone.
def own_limb(side):
    chain = {f'{side}Shoulder', f'{side}Arm', f'{side}ForeArm', f'{side}Hand'}
    segs = [(f'{side}Arm', f'{side}ForeArm', 0.070), (f'{side}ForeArm', f'{side}Hand', 0.055)]
    hand_tip = head(f'{side}Hand') + norm(head(f'{side}Hand') - head(f'{side}ForeArm')) * 0.2
    total = 0
    for a_name, b_name, rmax in segs + [(f'{side}Hand', None, 0.06)]:
        A = head(a_name); B = head(b_name) if b_name else hand_tip
        d = B - A; L = np.linalg.norm(d); d /= L
        sl = ((P - A) @ d) / L
        r = np.linalg.norm((P - A) - np.outer((P - A) @ d, d), axis=1)
        lo = 0.15 if a_name.endswith('Arm') and not a_name.endswith('ForeArm') else 0.05
        inside = (sl > lo) & (sl < 1.0) & (r < rmax)
        f = inside * (1 - smooth((r - (rmax - 0.015)) / 0.015))
        for g in list(W.keys()):
            if g in chain: continue
            moved = W[g] * f
            if moved.sum() <= 0: continue
            W[g] -= moved; W[a_name] += moved; total += int((moved > 1e-3).sum())
    meta.setdefault('limbOwnership', {})[side] = total

for side in ('Left', 'Right'):
    own_limb(side)

# ---------- armpit cleanup ----------
# Meshy gives torso vertices under the armpit some upper-arm weight, so raising the arm pulls a sheet of skin
# off the ribs. Upper-arm weight is kept only within the arm's own radius (measured per slice along the arm)
# plus a 3 cm blend; the rest goes to the spine bone nearest in height.
def armpit(side):
    S, E = head(f'{side}Arm'), head(f'{side}ForeArm')
    ax = E - S; L = np.linalg.norm(ax); d = ax / L
    names = [f'{side}Arm']
    wa = sum(W[nm] for nm in names)
    m = np.where(wa > 0)[0]
    s = ((P[m] - S) @ d) / L
    r = np.linalg.norm((P[m] - S) - np.outer((P[m] - S) @ d, d), axis=1)
    # arm radius per slice: 80th percentile radius of vertices that are mostly upper arm in that slice
    core = (wa[m] > 0.9)
    R = np.full(len(m), 0.06)
    for lo in np.arange(-0.2, 1.0, 0.1):
        sl = core & (s >= lo) & (s < lo + 0.1)
        if sl.sum() > 20:
            R[(s >= lo) & (s < lo + 0.1)] = np.percentile(r[sl], 80)
    keep = 1 - smooth((r - R) / 0.03)
    keep = np.where(s < -0.15, 1.0, keep)                             # the shoulder cap itself stays with the arm
    spines = ['Spine', 'Spine01', 'Spine02']
    sy = np.array([head(b)[2] for b in spines])                       # Blender Z = height
    for nm in names:
        moved = W[nm][m] * (1 - keep)
        W[nm][m] *= keep
        tgt = np.array(spines)[np.argmin(np.abs(P[m][:, 2][:, None] - sy[None, :]), 1)]
        for b in spines:
            sel = tgt == b
            W[b][m[sel]] += moved[sel]
    meta.setdefault('armpitMoved', {})[side] = int((keep < 0.99).sum())
    # the other way: skin inside the arm's own radius, below the armpit fold, belongs to the arm even where
    # Meshy gave it to the spine or shoulder (else the inner arm stays on the ribs when the arm lifts)
    torso = ['Spine', 'Spine01', 'Spine02', 'Hips', f'{side}Shoulder']
    tw = sum(W[b] for b in torso)
    cand = np.where(tw > 0)[0]
    s2 = ((P[cand] - S) @ d) / L
    r2 = np.linalg.norm((P[cand] - S) - np.outer((P[cand] - S) @ d, d), axis=1)
    Rm = np.interp(s2, [0.0, 0.5, 1.0], [0.065, 0.052, 0.045])
    take = smooth((s2 - 0.05) / 0.15) * (1 - smooth((r2 - Rm) / 0.012)) * (s2 < 1.0)
    for b in torso:
        moved = W[b][cand] * take
        W[b][cand] -= moved
        W[f'{side}Arm'][cand] += moved
    meta.setdefault('innerArmTaken', {})[side] = int((take > 0.01).sum())

for side in ('Left', 'Right'):
    armpit(side)

# ---------- smooth the weights around the shoulder and armpit ----------
# Linear blend skinning creases where weights change abruptly; averaging each vertex's weights with its
# neighbours inside an 18 cm ball around the shoulder joint spreads the stretch when the arm lifts.
nb_i = np.concatenate([np.full(len(a_), i) for i, a_ in enumerate(adj)]).astype(int)
nb_j = np.concatenate([np.array(a_, dtype=int) for a_ in adj])
deg_n = np.bincount(nb_i, minlength=n).astype(float)
def smooth_zone(side, radius=0.18, iters=10, lam=0.5):
    S = head(f'{side}Arm')
    dist = np.linalg.norm(P - S, axis=1)
    zone = smooth((radius - dist) / 0.05)                           # 1 well inside, fading at the edge
    zone[W[f'{side}Hand'] > 0.5] = 0
    names = [g for g in W if W[g][dist < radius + 0.05].sum() > 0]
    M = np.stack([W[g] for g in names], 1)
    for _ in range(iters):
        avg = np.stack([np.bincount(nb_i, weights=M[nb_j, k], minlength=n) for k in range(M.shape[1])], 1) / np.maximum(deg_n, 1)[:, None]
        M = M + (lam * zone)[:, None] * (avg - M)
    for k, g in enumerate(names): W[g] = M[:, k]
    meta.setdefault('shoulderSmoothed', {})[side] = int((zone > 0.01).sum())

for side in ('Left', 'Right'):
    smooth_zone(side)
# ---------- hinge re-blend (elbow, knee) ----------
# Meshy's weights around the elbow and knee are noisy, which tears a skirt of skin when the joint bends far.
# Near each hinge the two bones' combined weight is shared out by position along the limb: all upper bone
# 5 cm above the joint, all lower bone 5 cm below, smooth in between.
def hinge(upper, lower, child, half=0.05):
    a, j, b = head(upper), head(lower), head(child)
    du = norm(j - a); dl = norm(b - j)
    pair = W[upper] + W[lower]
    m = np.where(pair > 0.05)[0]
    # signed distance along the limb: negative above the joint (upper arm/thigh), positive below
    t = np.where(((P[m] - j) @ du) < 0, (P[m] - j) @ du, (P[m] - j) @ dl)
    near = np.abs(t) < half * 1.6
    m, t = m[near], t[near]
    f = smooth((t + half) / (2 * half))
    W[lower][m] = pair[m] * f
    W[upper][m] = pair[m] * (1 - f)
    meta.setdefault('hingeReblend', {})[lower] = int(len(m))

for side in ('Left', 'Right'):
    hinge(f'{side}UpLeg', f'{side}Leg', f'{side}Foot', 0.05)


for side, other in (('Left', 'Right'), ('Right', 'Left')):
    SEG[side] = segment_by_tree(side)
for side, other in (('Left', 'Right'), ('Right', 'Left')):
    if SEG[side] is None:
        if SEG[other] is None: raise SystemExit('no hand could be segmented')
        SEG[side] = segment_by_mirror(side, other)
        meta.setdefault('mirroredHands', []).append(side)
for side in ('Left', 'Right'):
    twist(side, 'Arm', 'ForeArm', [0.0, 1 / 3, 2 / 3], 'end')
    twist(side, 'ForeArm', 'Hand', [0.25, 0.5, 0.75], 'start')
    fingers(side)

# ---------- seams: vertices split at UV seams must share one weight set, or the skin cracks open ----------
groups_of = {}
for i, k in enumerate(map(tuple, np.round(co * 1e5).astype(np.int64))):
    groups_of.setdefault(k, []).append(i)
dups = [g for g in groups_of.values() if len(g) > 1]
for g in dups:
    for name in W:
        if W[name][g].any():
            W[name][g] = W[name][g].mean()
meta['seamGroups'] = len(dups)

# ---------- write bones ----------
bpy.context.view_layer.objects.active = arm
arm.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
inv = arm.matrix_world.inverted()
eb = arm.data.edit_bones
for name, h, t, par, roll in new_bones:
    b = eb.new(name)
    b.head = inv @ Vector(h); b.tail = inv @ Vector(t)
    b.parent = eb[par]
    b.align_roll(inv.to_3x3() @ Vector(roll))
bpy.ops.object.mode_set(mode='OBJECT')

# ---------- write weights (normalised, at most 4 influences) ----------
names = list(W.keys())
for nm in names: group(nm)
Wm = np.stack([W[nm] for nm in names], 1)
top = np.argsort(-Wm, 1)[:, :4]
for v in range(n):
    cols = top[v]; w = Wm[v, cols]; s = w.sum()
    w = w / s if s > 0 else w
    for g in mesh.vertex_groups:
        g.remove([v])
    for c, x in zip(cols, w):
        if x > 1e-4:
            mesh.vertex_groups[names[c]].add([v], float(x), 'REPLACE')

# ---------- material class from the texture, then drop materials ----------
cls = np.zeros(n)
img = None
for mat in me.materials:
    if mat and mat.use_nodes:
        for nd in mat.node_tree.nodes:
            if nd.type == 'TEX_IMAGE' and nd.image:
                img = nd.image; break
if img is not None:
    w, h = img.size
    px = np.array(img.pixels[:]).reshape(h, w, 4)
    uv = me.uv_layers.active.data
    lum = np.zeros(n); cnt = np.zeros(n)
    for poly in me.polygons:
        for li in poly.loop_indices:
            vi = me.loops[li].vertex_index
            u, v = uv[li].uv
            x = min(w - 1, max(0, int(u % 1 * w))); y = min(h - 1, max(0, int(v % 1 * h)))
            r, g, b, _ = px[y, x]
            lum[vi] += 0.2126 * r + 0.7152 * g + 0.0722 * b; cnt[vi] += 1
    lum /= np.maximum(cnt, 1)
    hist, edges = np.histogram(lum, 64, (0, 1))                   # Otsu split: charcoal clothing vs light clay skin
    best, thr = -1, 0.5
    for k in range(1, 64):
        w0, w1 = hist[:k].sum(), hist[k:].sum()
        if not w0 or not w1: continue
        c = (edges[:-1] + edges[1:]) / 2
        m0 = (hist[:k] * c[:k]).sum() / w0; m1 = (hist[k:] * c[k:]).sum() / w1
        between = w0 * w1 * (m0 - m1) ** 2
        if between > best: best, thr = between, edges[k]
    cls = (lum < thr).astype(float)
    meta['clothingThreshold'] = float(thr)
LAB = np.zeros(n)
for si, side in enumerate(('Left', 'Right')):
    for k, nm in enumerate(FN):
        LAB[SEG[side][nm]] = (1 + k + 5 * si) / 255.0
attr = me.color_attributes.new(name='Col', type='FLOAT_COLOR', domain='POINT')   # linear floats: ids survive exactly
for i in range(n):
    attr.data[i].color = (float(LAB[i]), 0.0, float(cls[i]), 1.0)
me.color_attributes.active_color = attr
# clothing mask texture (crisp waistband and hems at any mesh density): Otsu-split luminance of the base
# colour, 512 px, softened by a 1 px blur; carried as the base colour map of a material named 'figure'
if img is not None:
    w, h = img.size
    lumimg = px[:, :, 0] * 0.2126 + px[:, :, 1] * 0.7152 + px[:, :, 2] * 0.0722
    maskf = (lumimg < thr).astype(np.float32)
    k = max(1, w // 512)
    small = maskf[:h // k * k, :w // k * k].reshape(h // k, k, w // k, k).mean((1, 3))
    pad_ = np.pad(small, 1, mode='edge')
    blur = sum(pad_[1 + dy:1 + dy + small.shape[0], 1 + dx:1 + dx + small.shape[1]] for dy in (-1, 0, 1) for dx in (-1, 0, 1)) / 9.0
    mimg = bpy.data.images.new('figure_cloth', blur.shape[1], blur.shape[0], alpha=False)
    rgba = np.stack([blur, blur, blur, np.ones_like(blur)], -1).astype(np.float32)
    mimg.pixels.foreach_set(rgba.ravel())
    mimg.filepath_raw = META.replace('.meta.json', '-cloth.png'); mimg.file_format = 'PNG'; mimg.save()
me.materials.clear()
fmat = bpy.data.materials.new('figure'); fmat.use_nodes = True
if img is not None:
    tn = fmat.node_tree.nodes.new('ShaderNodeTexImage'); tn.image = mimg
    bsdf = fmat.node_tree.nodes['Principled BSDF']
    fmat.node_tree.links.new(tn.outputs['Color'], bsdf.inputs['Base Color'])
me.materials.append(fmat)
meta['clothingVertices'] = int(cls.sum())
meta['vertices'] = n

bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=False, export_skins=True,
                          export_yup=True, export_texcoords=True, export_normals=True, export_materials='EXPORT',
                          export_image_format='AUTO',
                          export_vertex_color='ACTIVE', export_all_influences=False, export_influence_nb=4)
json.dump(meta, open(META, 'w'), indent=1)
print('ok', {k: len(v['fingers']) for k, v in meta['fingers'].items()}, meta['clothingVertices'])
