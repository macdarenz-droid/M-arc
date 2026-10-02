"""MO: prepare a Meshy machine body for the motion view (Blender 5 Python module, `pip install bpy==5.0.1`).

    python tools/motion/machine_prep.py <meshy.glb> <out.glb> <spec.json>

spec.json (per machine, all boxes in the raw Meshy units, glTF axes: x right, y up, z toward the user's front):
  {"height_m": 1.65,                       # real overall height (from the research's manufacturer sizes)
   "centre_x_box": [[x0,y0,z0],[x1,y1,z1]], # the seat/pad box: its x centre becomes x = 0
   "decimate_tris": 24000,
   "parts": {"seat": [[...],[...]]},        # boxes split out as their own nodes (moving parts)
   "pad_boxes": [[[...],[...]], ...]}        # upholstery (shaded softer); metal comes from the metallic map

Writes one GLB: nodes "body" (+ one per part), materials "frame", "pad" and "metal" with no textures (the app
shades with theme colours). Floor at y = 0, sizes in metres.
"""
import bpy, bmesh, sys, json
import numpy as np
from mathutils import Matrix, Vector

argv = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
INP, OUT, SPEC = argv
spec = json.load(open(SPEC))

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INP)
ob = next(o for o in bpy.data.objects if o.type == 'MESH')
me = ob.data
bpy.context.view_layer.objects.active = ob
ob.select_set(True)

def gl(v):   # Blender (x, y, z) -> glTF (x, z, -y)
    return np.array([v[0], v[2], -v[1]])

MW = np.array(ob.matrix_world)
def world_gl(points):
    P = (np.c_[points, np.ones(len(points))] @ MW.T)[:, :3]
    return np.c_[P[:, 0], P[:, 2], -P[:, 1]]

def in_box(P, box):
    if isinstance(box[0][0], list):                                 # a list of boxes
        return np.any([in_box(P, b) for b in box], 0)
    lo, hi = np.array(box[0]), np.array(box[1])
    return np.all((P >= lo) & (P <= hi), 1)
# ---- classify faces before anything changes the mesh ----
img_base = img_mr = None
for mat in me.materials:
    for nd in mat.node_tree.nodes:
        if nd.type == 'TEX_IMAGE' and nd.image:
            to = [l.to_node.type + ':' + l.to_socket.name for o in nd.outputs for l in o.links]
            if any('Base Color' in t for t in to): img_base = nd.image
            if any('SEPARATE_COLOR' in t or 'Separate' in t for t in to): img_mr = nd.image
def px(img):
    w, h = img.size
    return np.array(img.pixels[:]).reshape(h, w, 4), w, h
uv = me.uv_layers.active.data
centres_uv = np.array([np.mean([uv[li].uv for li in p.loop_indices], 0) for p in me.polygons])
metal = np.zeros(len(me.polygons), bool)
if img_mr is not None:
    a, w, h = px(img_mr)
    xs = np.clip((centres_uv[:, 0] % 1 * w).astype(int), 0, w - 1); ys = np.clip((centres_uv[:, 1] % 1 * h).astype(int), 0, h - 1)
    metal = a[ys, xs, 2] > 0.5                                     # glTF metallicRoughness: blue = metallic
    # the texture has scratch streaks: keep only large connected metal regions (rods, pins), drop specks
    bm0 = bmesh.new(); bm0.from_mesh(me); bm0.faces.ensure_lookup_table()
    areas = np.array([f.calc_area() for f in bm0.faces])
    seen = np.zeros(len(metal), bool); keep = np.zeros(len(metal), bool)
    for f0 in np.where(metal)[0]:
        if seen[f0]: continue
        stack, comp = [f0], []
        seen[f0] = True
        while stack:
            f = stack.pop(); comp.append(f)
            for e in bm0.faces[f].edges:
                for g in e.link_faces:
                    if metal[g.index] and not seen[g.index]: seen[g.index] = True; stack.append(g.index)
        if areas[comp].sum() > spec.get('metal_min_area', 0.003): keep[comp] = True
    metal = keep
    if spec.get('metal_boxes'):                                     # rods and pins live only here
        metal &= in_box(world_gl(np.array([f.calc_center_median() for f in bm0.faces])), spec['metal_boxes'])
    bm0.free()
fc = world_gl(np.array([p.center for p in me.polygons]))
pad = np.zeros(len(fc), bool)
for box in spec.get('pad_boxes', []): pad |= in_box(fc, box)
cls = np.where(metal, 2, np.where(pad, 1, 0))                     # 0 frame, 1 pad, 2 metal

me.materials.clear()
for name in ('frame', 'pad', 'metal'):
    m = bpy.data.materials.new(name); me.materials.append(m)
for p, c in zip(me.polygons, cls): p.material_index = int(c)

# ---- real size, floor at 0, seat centre at x = 0 ----
V = world_gl(np.array([v.co for v in me.vertices]))
H = V[:, 1].max() - V[:, 1].min()
s = spec['height_m'] / H
cbox = in_box(V, spec['centre_x_box'])
cx = V[cbox, 0].mean() if cbox.any() else 0.0
floor = V[:, 1].min()
meta = {'object_matrix_identity': bool(np.allclose(MW, np.eye(4))), 'scale': s, 'raw_centre_x': float(cx), 'raw_floor_y': float(floor)}
def to_m(p): return [(p[0] - cx) * s, (p[1] - floor) * s, p[2] * s]

# ---- split moving parts into their own objects ----
parts_out = {}
for name, box in spec.get('parts', {}).items():
    bpy.ops.object.mode_set(mode='EDIT')
    bm = bmesh.from_edit_mesh(me)
    for f in bm.faces:
        c = gl(ob.matrix_world @ f.calc_center_median())
        f.select = bool(in_box(c[None], box)[0])
    bmesh.update_edit_mesh(me)
    bpy.ops.mesh.separate(type='SELECTED')
    bpy.ops.object.mode_set(mode='OBJECT')
    new = [o for o in bpy.context.selected_objects if o != ob and o.type == 'MESH'][-1]
    new.name = name
    parts_out[name] = new
    new.select_set(False)
    ob.select_set(True); bpy.context.view_layer.objects.active = ob
ob.name = 'body'

# ---- decimate, apply transforms ----
objs = [ob] + list(parts_out.values())
total = sum(len(o.data.polygons) for o in objs)
target = spec.get('decimate_tris', 24000)
for o in objs:
    bpy.context.view_layer.objects.active = o
    # merge the seam-split vertices first so collapse decimation does not tear the surface open
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.remove_doubles(threshold=1e-5); bpy.ops.object.mode_set(mode='OBJECT')
    now = sum(len(o2.data.polygons) for o2 in objs)
    mod = o.modifiers.new('dec', 'DECIMATE')
    mod.ratio = min(1.0, target / max(1, now))
    mod.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier='dec')
    # glTF (x, y, z) is Blender (x, -z, y): centre x, floor (glTF y) to 0, then metres
    o.data.transform(Matrix.Scale(s, 4) @ Matrix.Translation(Vector((-cx, 0.0, -floor))))
for o in objs:                                                   # crisp box edges, smooth round parts
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.shade_smooth_by_angle(angle=np.radians(35))
for o in objs:
    meta.setdefault('tris', {})[o.name] = sum(len(p.vertices) - 2 for p in o.data.polygons)

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', export_yup=True, export_texcoords=False,
                          export_normals=True, export_materials='EXPORT', export_image_format='NONE')
meta['spec'] = spec
json.dump(meta, open(OUT.replace('.glb', '.prep.json'), 'w'), indent=1)
print('ok', meta['tris'], 'scale', round(s, 4), 'centre_x', round(float(cx), 3))
