import hashlib
from PIL import Image, ImageDraw, ImageStat
W, H, BAND = 1080, 1920, 420
BG, BODY, EDGE = "#08090a", "#1b1c1f", "#343536"
STRIP = "/mnt/data/marc-headlines.png"  # the uploaded headline strip
STRIP_SHA = "3a8fe76498639349a923f1a839f6f2003b311ab00675accbc1126917ee1ce932"

def headline(n):  # band n of the strip: the finished headline for card n
    s = Image.open(STRIP).convert("RGB")
    if s.size != (W, 8 * BAND) or hashlib.sha256(s.tobytes()).hexdigest() != STRIP_SHA:
        raise ValueError("marc-headlines.png was changed on upload. Re-attach it with Attach file.")
    return s.crop((0, BAND * (n - 1), W, BAND * n))

def phone(im, shot, x, y, w):
    b, r = 14, 80
    sw = w - 2 * b
    s = Image.open(shot).convert("RGB")
    if s.width < sw:
        raise ValueError(f"The screenshot is {s.width} px wide. Attach the original with Attach file.")
    s = s.resize((sw, round(s.height * sw / s.width)), Image.LANCZOS)  # scale only
    full = y + b + s.height <= H                                       # screen ends on the canvas?
    ImageDraw.Draw(im).rounded_rectangle([x, y, x + w, y + 2 * b + s.height if full else H + r],
                                         radius=r, fill=BODY, outline=EDGE, width=3)
    s = s.crop((0, 0, sw, min(s.height, H - y - b)))                   # crop at canvas bottom
    m = Image.new("L", s.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, sw - 1, s.height - 1 if full else s.height + r],
                                        radius=r - b, fill=255)
    im.paste(s, (x + b, y + b), m)

def by_theme(shots):  # card 8: returns [Silent Black, Paper, Midnight] whatever the upload order
    look = []
    for p in shots:
        m = ImageStat.Stat(Image.open(p).convert("RGB")).mean
        look.append((sum(m) / 3, m[2] - m[0], p))       # (brightness, blue minus red, path)
    look.sort()
    black_or_navy, white = look[:2], look[2]
    black, navy = sorted(black_or_navy, key=lambda t: t[1])
    if len(shots) != 3 or white[0] - navy[0] < 80 or white[0] - black[0] < 80 or navy[1] - black[1] < 15:
        raise ValueError("Card 8 needs one Silent Black, one Paper and one Midnight screenshot of Today.")
    return [black[2], white[2], navy[2]]

def card(n, shots):
    im = Image.new("RGB", (W, H), BG)
    im.paste(headline(n), (0, 0))
    if n != 8:
        phone(im, shots[0], 150, 420, 780)
    else:
        black, white, navy = by_theme(shots)
        phone(im, white, -100, 620, 640)
        phone(im, navy, 540, 620, 640)
        phone(im, black, 170, 440, 740)
    out = f"/mnt/data/marc-card-{n}.png"
    im.save(out, "PNG")
    chk = Image.open(out)
    assert chk.size == (W, H) and chk.mode == "RGB"
    return out
