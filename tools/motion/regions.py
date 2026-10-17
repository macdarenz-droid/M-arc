"""MO: paint muscle regions onto the shared figure (Blender 5 Python module).

    python tools/motion/regions.py <figure.glb> <out.glb> <out.regions.json>

Each vertex gets COLOR_0.r = region id (1..23, by the app's MuscleId list in src/data/muscles.ts) and
COLOR_0.g = how strongly it belongs (soft edges, 0..1). COLOR_0.b (clothing) is kept.

Regions are placed with anatomical rules in the figure's rest pose, measured from its own joints (spine,
shoulder, elbow, hip, knee, ankle), not copied by hand: around-limb angle (0 = front in the anatomical position,
90 = away from the body, 180 = back) and the fraction along the limb. Boundaries follow standard surface
anatomy (deltoid from the clavicle's outer third over the shoulder cap to about 45% of the upper arm; pectoral
from the clavicle to the 5th-6th rib; lats from below the armpit to the iliac crest, and so on); each rule's
numbers are listed in RULES below so a reviewer can check them against an anatomy reference.
"""
import bpy, sys, json, math
import numpy as np

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
INP, OUT, META = argv

IDS = ['chest', 'upper_chest', 'front_delts', 'side_delts', 'rear_delts', 'rotator_cuff', 'biceps', 'triceps',
       'brachialis', 'forearms', 'lats', 'mid_back', 'upper_traps', 'lower_back', 'abs', 'obliques', 'hip_flexors',
       'quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves']
RID = {m: i + 1 for i, m in enumerate(IDS)}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INP)
arm = next(o for o in bpy.data.objects if o.type == 'ARMATURE')
mesh = next(o for o in bpy.data.objects if o.type == 'MESH')
me = mesh.data
n = len(me.vertices)
MW = np.array(mesh.matrix_world)
co = np.array([v.co for v in me.vertices])
Pb = (np.c_[co, np.ones(n)] @ MW.T)[:, :3]
P = np.c_[Pb[:, 0], Pb[:, 2], -Pb[:, 1]]                       # glTF axes: x left(+)/right(-) of figure, y up, z front

def J(name):
    h = arm.matrix_world @ arm.data.bones[name].head_local
    return np.array([h.x, h.z, -h.y])

groups = {g.index: g.name for g in mesh.vertex_groups}
seg_of = {}
for name in groups.values():
    base = name.replace('Left', '').replace('Right', '')
    if base.startswith('HandThumb') or base.startswith('HandIndex') or base.startswith('HandMiddle') or base.startswith('HandRing') or base.startswith('HandPinky') or base == 'Hand': seg = 'hand'
    elif base.startswith('ForeArm'): seg = 'forearm'
    elif base.startswith('Arm'): seg = 'upperarm'
    elif base == 'UpLeg': seg = 'thigh'
    elif base == 'Leg': seg = 'shank'
    elif base in ('Foot', 'ToeBase'): seg = 'foot'
    elif base in ('Head', 'head_end', 'headfront', 'neck'): seg = 'head'
    else: seg = 'torso'                                          # Hips, Spine*, Shoulder (clavicle)
    side = 'L' if name.startswith('Left') else 'R' if name.startswith('Right') else ''
    seg_of[name] = (seg, side)
SEGS = ['torso', 'head', 'upperarm', 'forearm', 'hand', 'thigh', 'shank', 'foot']
segw = np.zeros((n, len(SEGS)))
for v in me.vertices:
    for g in v.groups:
        s, _ = seg_of[groups[g.group]]
        segw[v.index, SEGS.index(s)] += g.weight
seg = np.array(SEGS)[np.argmax(segw, 1)]
side = np.where(P[:, 0] >= 0, 'L', 'R')

def soft(x, lo, hi, w):
    """1 inside [lo, hi], fading to 0 over w outside."""
    a = np.clip((x - (lo - w)) / w, 0, 1) if w > 0 else (x >= lo).astype(float)
    b = np.clip(((hi + w) - x) / w, 0, 1) if w > 0 else (x <= hi).astype(float)
    return np.minimum(a, b)

def ang_soft(a, lo, hi, w):
    """soft membership on an angle in degrees (wraps)."""
    best = np.zeros_like(a)
    for k in (-360, 0, 360):
        best = np.maximum(best, soft(a + k, lo, hi, w))
    return best

def limb_coords(a, b, front, out, mask):
    """fraction along a->b, and the angle around the limb: 0 front, 90 out (away from the body), 180 back."""
    ax = b - a; L = np.linalg.norm(ax); d = ax / L
    f = front - d * (front @ d); f /= np.linalg.norm(f)
    o = np.cross(d, f)
    if o @ out < 0: o = -o
    w = P[mask] - a
    s = (w @ d) / L
    r = w - np.outer(w @ d, d)
    ang = np.degrees(np.arctan2(r @ o, r @ f))
    return s, ang

FRONT = np.array([0.0, 0.0, 1.0])
M = {m: np.zeros(n) for m in IDS}
hips, sp2, sp1, sp, neck = J('Hips'), J('Spine02'), J('Spine01'), J('Spine'), J('neck')
H = J('Head')[1]                                                 # head joint height, for proportions
RULES = {}

# ---------------- torso (both sides; x mirrored) ----------------
t = seg == 'torso'
ax = np.abs(P[:, 0]); y = P[:, 1]
cz = np.interp(y, [hips[1], sp2[1], sp1[1], sp[1], neck[1]], [hips[2], sp2[2], sp1[2], sp[2], neck[2]])
phi = np.degrees(np.arctan2(ax, P[:, 2] - cz))                  # 0 front, 90 side, 180 back (per side)
shoulder_y = J('LeftArm')[1]; sh_x = abs(J('LeftArm')[0])
clav_y = shoulder_y + 0.025
# nipple line, measured on the mesh: on each side, the vertex that stands out most from its surroundings
# (forward of the mean of its neighbours within 2 cm) in the chest area
nip_y = []
NIPPLES = []
for sx in (1, -1):
    m = t & (P[:, 0] * sx > 0.07) & (P[:, 0] * sx < 0.125) & (y > shoulder_y - 0.16) & (y < shoulder_y - 0.08) & (P[:, 2] > 0.05)
    cand = np.where(m)[0]
    prom = []
    for i in cand:
        dd = np.linalg.norm(P[cand] - P[i], axis=1)
        nb = cand[(dd < 0.02) & (dd > 0.006)]
        prom.append(P[i, 2] - P[nb, 2].mean() if len(nb) >= 6 else -1)
    nip_y.append(P[cand[int(np.argmax(prom))], 1])
    NIPPLES.append([float(x) for x in P[cand[int(np.argmax(prom))]]])
if abs(nip_y[0] - nip_y[1]) > 0.015:                              # the two sides must agree, else use anatomy
    print('WARNING: nipple detection disagrees', nip_y, '-> using shoulder - 0.12')
    nip_y = [shoulder_y - 0.12] * 2
nip_y = float(np.mean(nip_y))
pec_low = nip_y - 0.05                                           # lower pec border (5th-6th rib), about 5 cm below the nipple
# the lower border is not level: it starts at the 6th rib beside the sternum, passes about 2 cm under the nipple
# and rises to the front armpit fold (the pec's lower edge as it runs to the upper arm)
pec_x = sh_x - 0.035
pec_low_x = (nip_y - 0.06) + 0.10 * np.clip(ax / pec_x, 0, 1) ** 2.2
RULES['chest'] = dict(y=(nip_y - 0.06, clav_y), low_at_armpit=(nip_y + 0.04,), phi=(0, 72), x=(0.0, sh_x - 0.02))
M['chest'] = t * soft(y, pec_low_x, clav_y - 0.02, 0.02) * ang_soft(phi, -1, 70, 12) * soft(ax, 0.008, pec_x, 0.02)
_nx = float(np.mean([abs(n_[0]) for n_ in NIPPLES]))
print('pec lower border under the nipple: %.1f cm' % ((nip_y - ((nip_y - 0.06) + 0.10 * min(1, _nx / pec_x) ** 2.2)) * 100))
up_split = clav_y - 0.055                                        # clavicular head: the upper third of the pec
RULES['upper_chest'] = dict(y=(up_split, clav_y))
M['upper_chest'] = M['chest'] * soft(y, up_split, clav_y, 0.012)
M['chest'] = M['chest'] * (1 - soft(y, up_split, clav_y, 0.012))
abs_top = pec_low - 0.01; abs_low = hips[1] - 0.04
RULES['abs'] = dict(y=(abs_low, abs_top), x=(0, 0.075), phi=(0, 35))
M['abs'] = t * soft(y, abs_low, abs_top, 0.02) * soft(ax, 0, 0.07, 0.015) * ang_soft(phi, -1, 32, 8)
RULES['obliques'] = dict(y=(hips[1] - 0.02, pec_low - 0.02), phi=(40, 115))
M['obliques'] = t * soft(y, hips[1] - 0.01, pec_low - 0.03, 0.025) * ang_soft(phi, 42, 112, 10)
lat_top = shoulder_y - 0.09
RULES['lats'] = dict(y=(hips[1] + 0.06, lat_top), phi=(105, 165))
M['lats'] = t * soft(y, hips[1] + 0.07, lat_top, 0.03) * ang_soft(phi, 108, 160, 12) * soft(ax, 0.05, 0.2, 0.02)
RULES['mid_back'] = dict(y=(shoulder_y - 0.15, shoulder_y + 0.0), x=(0, 0.10), phi=(150, 180))
M['mid_back'] = t * soft(y, shoulder_y - 0.15, shoulder_y - 0.01, 0.02) * soft(ax, 0, 0.09, 0.02) * ang_soft(phi, 152, 181, 10)
RULES['rotator_cuff'] = dict(y=(shoulder_y - 0.13, shoulder_y - 0.02), x=(0.07, sh_x - 0.01), phi=(135, 170))
M['rotator_cuff'] = t * soft(y, shoulder_y - 0.12, shoulder_y - 0.03, 0.015) * soft(ax, 0.08, sh_x - 0.02, 0.015) * ang_soft(phi, 132, 168, 8)
RULES['upper_traps'] = dict(y=(clav_y - 0.01, neck[1] + 0.06), x=(0.03, sh_x - 0.01), phi=(60, 180))
M['upper_traps'] = ((t | (seg == 'head')) * soft(y, clav_y - 0.005, neck[1] + 0.05, 0.015) * soft(ax, 0.035, sh_x - 0.02, 0.015)
                    * ang_soft(phi, 70, 181, 15))
RULES['lower_back'] = dict(y=(hips[1] - 0.03, hips[1] + 0.20), x=(0, 0.07), phi=(155, 180))
M['lower_back'] = t * soft(y, hips[1] - 0.02, hips[1] + 0.19, 0.02) * soft(ax, 0, 0.065, 0.015) * ang_soft(phi, 158, 181, 8)
RULES['glutes'] = dict(y=(J('LeftUpLeg')[1] - 0.11, hips[1] + 0.02), phi=(120, 180))
glu = ((t | (seg == 'thigh')) * soft(y, J('LeftUpLeg')[1] - 0.10, hips[1] + 0.01, 0.025) * ang_soft(phi, 125, 181, 15) * soft(ax, 0.0, 0.17, 0.02))
M['glutes'] = glu
RULES['hip_flexors'] = dict(y=(J('LeftUpLeg')[1] - 0.04, hips[1] - 0.01), phi=(15, 55))
M['hip_flexors'] = (t | (seg == 'thigh')) * soft(y, J('LeftUpLeg')[1] - 0.04, hips[1] - 0.02, 0.015) * ang_soft(phi, 18, 55, 8) * soft(ax, 0.05, 0.14, 0.015)

# ---------------- arms ----------------
for S, sx in (('Left', 1.0), ('Right', -1.0)):
    out = np.array([sx, 0.0, 0.0])
    ua = (seg == 'upperarm') & (side == S[0]) | ((seg == 'torso') & (side == S[0]) & (np.abs(P[:, 0]) > sh_x - 0.045) & (P[:, 1] > shoulder_y - 0.08))
    s, a = limb_coords(J(f'{S}Arm'), J(f'{S}ForeArm'), FRONT, out, ua)
    idx = np.where(ua)[0]
    cap = soft(s, -0.25, 0.42, 0.06)                             # deltoid: shoulder cap to ~45% of the upper arm
    RULES['deltoids'] = dict(s=(-0.25, 0.42), front=(-35, 55), side=(55, 120), rear=(120, 205))
    M['front_delts'][idx] = np.maximum(M['front_delts'][idx], cap * ang_soft(a, -35, 52, 14))
    M['side_delts'][idx] = np.maximum(M['side_delts'][idx], cap * ang_soft(a, 58, 118, 14))
    M['rear_delts'][idx] = np.maximum(M['rear_delts'][idx], cap * ang_soft(a, 124, 205, 14))
    arm_only = (seg[idx] == 'upperarm').astype(float)
    RULES['biceps'] = dict(s=(0.32, 0.92), angle=(-55, 35))
    M['biceps'][idx] = arm_only * soft(s, 0.34, 0.9, 0.05) * ang_soft(a, -55, 32, 12)
    RULES['brachialis'] = dict(s=(0.55, 0.95), angle=(38, 78))
    M['brachialis'][idx] = arm_only * soft(s, 0.56, 0.94, 0.04) * ang_soft(a, 40, 76, 10)
    RULES['triceps'] = dict(s=(0.2, 0.95), angle=(112, 255))
    M['triceps'][idx] = arm_only * soft(s, 0.22, 0.93, 0.05) * ang_soft(a, 115, 252, 14)
    fa = (seg == 'forearm') & (side == S[0])
    s2, a2 = limb_coords(J(f'{S}ForeArm'), J(f'{S}Hand'), FRONT, out, fa)
    RULES['forearms'] = dict(s=(0.03, 0.82))
    M['forearms'][np.where(fa)[0]] = soft(s2, 0.04, 0.8, 0.06)

# ---------------- legs ----------------
for S, sx in (('Left', 1.0), ('Right', -1.0)):
    out = np.array([sx, 0.0, 0.0])
    th = ((seg == 'thigh') | (seg == 'torso')) & (side == S[0]) & (P[:, 1] < J(f'{S}UpLeg')[1] + 0.06)
    s, a = limb_coords(J(f'{S}UpLeg'), J(f'{S}Leg'), FRONT, out, th)
    idx = np.where(th)[0]
    RULES['quads'] = dict(s=(0.1, 0.93), angle=(-45, 95))
    M['quads'][idx] = np.maximum(M['quads'][idx], soft(s, 0.12, 0.92, 0.05) * ang_soft(a, -42, 92, 14))
    RULES['hamstrings'] = dict(s=(0.18, 0.93), angle=(135, 228))
    M['hamstrings'][idx] = soft(s, 0.2, 0.92, 0.05) * ang_soft(a, 138, 226, 14)
    RULES['adductors'] = dict(s=(0.05, 0.62), angle=(-128, -48))
    M['adductors'][idx] = soft(s, 0.06, 0.6, 0.05) * ang_soft(a, -128, -50, 12)
    RULES['abductors'] = dict(s=(-0.12, 0.22), angle=(70, 135))
    M['abductors'][idx] = np.maximum(M['abductors'][idx], soft(s, -0.12, 0.2, 0.04) * ang_soft(a, 72, 132, 12))
    sh = (seg == 'shank') & (side == S[0])
    s3, a3 = limb_coords(J(f'{S}Leg'), J(f'{S}Foot'), FRONT, out, sh)
    RULES['calves'] = dict(s=(0.04, 0.62), angle=(108, 252))
    M['calves'][np.where(sh)[0]] = soft(s3, 0.05, 0.6, 0.06) * ang_soft(a3, 110, 250, 14)

# ---------------- smooth each region over the surface (soft, rounded edges) ----------------
adj = [[] for _ in range(n)]
for e in me.edges:
    a_, b_ = e.vertices; adj[a_].append(b_); adj[b_].append(a_)
_key = {}
for i, k in enumerate(map(tuple, np.round(co * 1e5).astype(np.int64))):
    if k in _key: j = _key[k]; adj[i].append(j); adj[j].append(i)
    else: _key[k] = i
nb_i = np.concatenate([np.full(len(a_), i) for i, a_ in enumerate(adj)]).astype(int)
nb_j = np.concatenate([np.array(a_, dtype=int) for a_ in adj])
deg_ = np.bincount(nb_i, minlength=n).astype(float)
def laplace(x, it=4, lam=0.5):
    for _ in range(it):
        avg = np.bincount(nb_i, weights=x[nb_j], minlength=n) / np.maximum(deg_, 1)
        x = (1 - lam) * x + lam * avg
    return x
for m_ in IDS:
    M[m_] = laplace(M[m_])

# ---------------- pick one region per vertex ----------------
stack = np.stack([M[m] for m in IDS], 1)
best = np.argmax(stack, 1); val = stack[np.arange(n), best]
rid = np.where(val > 0.02, best + 1, 0)

attr = me.color_attributes.get('Col') or me.color_attributes[0]
cloth = np.zeros(n)
if attr.domain == 'POINT':
    cloth = np.array([attr.data[i].color[2] for i in range(n)])
else:                                                            # the glTF importer stores COLOR_0 per face corner
    for li, loop in enumerate(me.loops):
        cloth[loop.vertex_index] = max(cloth[loop.vertex_index], attr.data[li].color[2])
cloth = (cloth > 0.5).astype(float)
if cloth.sum() == 0:
    raise SystemExit('clothing channel missing in the input')
new = me.color_attributes.new(name='Col2', type='FLOAT_COLOR', domain='POINT')
for i in range(n):
    new.data[i].color = (rid[i] / 255.0, float(val[i]) if rid[i] else 0.0, float(cloth[i]), 1.0)
me.color_attributes.remove(attr)
new.name = 'Col'
me.color_attributes.active_color = new
counts = {m: int((rid == RID[m]).sum()) for m in IDS}
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_animations=False, export_skins=True, export_yup=True,
                          export_texcoords=True, export_normals=True, export_materials='EXPORT', export_image_format='AUTO', export_vertex_color='ACTIVE',
                          export_all_influences=False, export_influence_nb=4)
json.dump({'ids': RID, 'vertices': counts, 'rules': {k: {kk: [round(x, 3) for x in vv] for kk, vv in v.items()} for k, v in RULES.items()},
           'landmarks': {'shoulder_y': float(shoulder_y), 'nipple_y': float(nip_y), 'clavicle_y': float(clav_y), 'nipples': NIPPLES}}, open(META, 'w'), indent=1)
print('ok', counts)
