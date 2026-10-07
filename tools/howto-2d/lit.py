# The 7-key animation with the chest press muscles lit in every frame: chest Main, upper chest, front delts and
# triceps Helps. Labels: static body from the k0 colour map, moving parts from each key's map, carried between keys
# by the same flows as the drawing.
import cv2, numpy as np
from PIL import Image
from labels import labels, names
KEYS = ['k0', 'k1', 'k2', 'k25', 'k3', 'k35', 'k4']; N = len(KEYS)
MAPS = ['mk0.png', 'mk1.png', 'mk2.png', 'mk25.png', 'nk3.png', 'nk35.png', 'nk4.png']  # nk*: lats kept grey
C = [cv2.imread(f'c{i}.png').astype(np.float32) for i in range(N)]
def mode_filter(lab, k=11, keep=0.35):
    # majority label in a k x k window: drops outline pixels and speckles, keeps solid regions
    cnt = np.stack([cv2.boxFilter((lab == i).astype(np.float32), -1, (k, k)) for i in range(len(names))])
    best = cnt.argmax(0); return np.where(cnt.max(0) > keep, best, -1)
def grow(lab, it=3):
    lab = lab.copy()
    for _ in range(it):
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            sh = np.roll(np.roll(lab, dy, 0), dx, 1); m = (lab < 0) & (sh >= 0); lab[m] = sh[m]
    return lab
TORSO = ['chest', 'upper_chest', 'abs', 'obliques', 'serratus', 'traps']
L0 = grow(mode_filter(labels('mk0.png')))
L = [L0]
for i in range(1, N):
    li = grow(mode_filter(labels(MAPS[i]))); m = cv2.imread(f'mask{i}.png', 0) > 127
    # the torso never moves: inside the moving area keep the k0 torso labels wherever both maps say torso, so only
    # arms (and torso uncovered by an arm) take the key's labels
    torso = [names.index(n) for n in TORSO]
    both = np.isin(li, torso) & np.isin(L0, torso)
    li = np.where(both, L0, li)
    L.append(np.where(m, li, L0))
G = [cv2.cvtColor(c.astype(np.uint8), cv2.COLOR_BGR2GRAY) for c in C]
dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
h, w = G[0].shape; gy, gx = np.mgrid[0:h, 0:w].astype(np.float32)
flows = [(dis.calc(G[i], G[i + 1], None), dis.calc(G[i + 1], G[i], None)) for i in range(N - 1)]
def warp(img, f, s, interp=cv2.INTER_LINEAR):
    s = np.float32(s); return cv2.remap(img, (gx + s * f[..., 0]).astype(np.float32), (gy + s * f[..., 1]).astype(np.float32), interp, borderMode=cv2.BORDER_REPLICATE)
def at(p):
    i = min(int(p), N - 2); s = p - i
    if s < 1e-4: return C[i], L[i]
    if s > 1 - 1e-4: return C[i + 1], L[i + 1]
    fab, fba = flows[i]
    A, B = warp(C[i], fba, s), warp(C[i + 1], fab, 1 - s)
    e = np.linalg.norm(fab + warp(fba, fab, 1.0), axis=-1)
    bad = cv2.GaussianBlur((e > 3).astype(np.float32), (0, 0), 3)[..., None]
    wB = (1 - bad) * s + bad * (1.0 if s >= 0.5 else 0.0)
    la = warp(L[i].astype(np.float32), fba, s, cv2.INTER_NEAREST); lb = warp(L[i + 1].astype(np.float32), fab, 1 - s, cv2.INTER_NEAREST)
    return (1 - wB) * A + wB * B, np.where(wB[..., 0] < 0.5, la, lb).astype(int)
MAIN, HELPS = ['chest'], ['upper_chest', 'front_delts', 'triceps']
def light(img, lab):
    out = img.copy()
    for group, a, tint in ((MAIN, 0.95, (240, 98, 80)), (HELPS, 0.8, (245, 175, 165))):  # BGR of the demo accents
        m = np.isin(lab, [names.index(n) for n in group])
        m = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.2)[..., None]
        lum = img.mean(-1, keepdims=True)
        col = np.array(tint, np.float32) * np.clip(lum / 205, 0, 1.25)
        out = out * (1 - a * m) + col * (a * m)
    return out
ease = lambda u: 0.5 - 0.5 * np.cos(np.pi * u)
ps = [(N - 1) * ease(k / 24) for k in range(24)] + [N - 1] * 7 + [(N - 1) * (1 - ease(k / 36)) for k in range(36)] + [0] * 12
cache = {}
frames = []
for p in ps:
    key = round(p, 4)
    if key not in cache:
        img, lab = at(p); cache[key] = light(img, lab)
    frames.append(cache[key])
out = [Image.fromarray(cv2.cvtColor(np.clip(f, 0, 255).astype(np.uint8), cv2.COLOR_BGR2RGB)).crop((60, 40, 1000, 1010)) for f in frames]
small = [im.resize((560, 578), Image.LANCZOS) for im in out]
small[0].save('lit-anim.webp', save_all=True, append_images=small[1:], duration=42, loop=0, quality=85, method=4)
small[0].save('lit-anim.gif', save_all=True, append_images=small[1:], duration=42, loop=0, optimize=True)
strip = [small[i] for i in (0, 6, 12, 18, 23)]
s = Image.new('RGB', (560 * 5, 578), 'white'); [s.paste(im, (560 * j, 0)) for j, im in enumerate(strip)]; s.save('lit-strip.png')
print(len(frames))
import os
os.makedirs('frames', exist_ok=True)
for j, im in enumerate(out): im.resize((720, 744), Image.LANCZOS).save(f'frames/f{j:03d}.png')
