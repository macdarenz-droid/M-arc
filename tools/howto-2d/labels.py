import numpy as np, sys, colorsys
from PIL import Image
KEY = {  # muscle: reference RGB of the colour named in the prompt key
 'chest':(225,35,35),'upper_chest':(245,145,25),'front_delts':(250,215,35),'side_delts':(160,205,45),
 'biceps':(35,135,55),'triceps':(40,205,215),'forearms':(85,165,240),'abs':(35,60,215),'obliques':(140,55,215),
 'serratus':(230,45,175),'traps':(240,160,185),'quads':(150,85,40),'adductors':(145,145,35),'calves':(25,40,140)}
names = list(KEY); ref = np.array([KEY[n] for n in names], float)
def labels(path):
    im = np.asarray(Image.open(path).convert('RGB')).astype(float)
    mx, mn = im.max(-1), im.min(-1); sat = (mx - mn) / np.maximum(mx, 1)
    d = ((im[:, :, None, :] - ref[None, None]) ** 2).sum(-1)
    k = d.argmin(-1); ok = (sat > 0.32) & (mx > 40) & (d.min(-1) < 95**2)
    return np.where(ok, k, -1)
if __name__ == '__main__':
    lab = labels(sys.argv[1])
    for i, n in enumerate(names): print(f'{n:12s} {(lab == i).sum():7d}')
