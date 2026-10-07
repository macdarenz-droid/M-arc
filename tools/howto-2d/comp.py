# Keyframe composite: static parts always come from k0; only the regions that really moved come from each key.
import cv2, numpy as np
KEYS = ['k0', 'k1', 'k2', 'k25', 'k3', 'k35', 'k4']
K = [cv2.imread(f'{k}.png').astype(np.float32) for k in KEYS]
def moving_mask(a, b, ymax=640):
    d = np.abs(a - b).max(-1)
    m = (d > 30).astype(np.uint8)
    m = cv2.morphologyEx(m, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3)))
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (41, 41)))
    n, lab, st, _ = cv2.connectedComponentsWithStats(m)
    keep = np.zeros_like(m)
    for i in range(1, n):
        if st[i, cv2.CC_STAT_AREA] > 600: keep[lab == i] = 1
    keep[ymax:] = 0
    ff = keep.copy() * 255; h, w = ff.shape; fm = np.zeros((h + 2, w + 2), np.uint8); cv2.floodFill(ff, fm, (0, 0), 128); keep[ff == 0] = 1  # fill holes
    keep = cv2.dilate(keep, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
    a_ = cv2.GaussianBlur(keep.astype(np.float32), (0, 0), 6)
    return np.clip(a_, 0, 1)[..., None]
C = [K[0]]
for i in range(1, len(K)):
    a = moving_mask(K[0], K[i]); C.append(K[0] * (1 - a) + K[i] * a)
    cv2.imwrite(f'mask{i}.png', (a[..., 0] * 255).astype(np.uint8))
for i, c in enumerate(C): cv2.imwrite(f'c{i}.png', np.clip(c, 0, 255).astype(np.uint8))
# report how much of the frame each key replaces
for i in range(1, len(K)): print(i, round(float(cv2.imread(f'mask{i}.png', 0).mean() / 255 * 100), 1), '% of frame')
