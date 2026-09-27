# python3 montage.py out.png cols scale img1 img2 ...   (labels = file names)
import sys
from PIL import Image, ImageDraw
out, cols, scale, files = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
ims = [im.resize((int(im.width*scale), int(im.height*scale)), Image.LANCZOS) for im in ims]
w = max(i.width for i in ims); h = max(i.height for i in ims) + 16
rows = (len(ims)+cols-1)//cols
M = Image.new('RGB', (cols*w + (cols+1)*6, rows*h + (rows+1)*6), (60,60,60))
d = ImageDraw.Draw(M)
for k,(im,f) in enumerate(zip(ims,files)):
    x = 6 + (k%cols)*(w+6); y = 6 + (k//cols)*(h+6)
    d.text((x+2,y+1), f.split('/')[-1], fill=(255,255,255)); M.paste(im,(x,y+16))
M.save(out)
