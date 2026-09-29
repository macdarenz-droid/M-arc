"""Layout helpers for make_pdfs.py, matching the look of the application-2 PDFs (A4, DejaVu Sans, lavender cells)."""
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor

pdfmetrics.registerFont(TTFont('DV', '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'))
pdfmetrics.registerFont(TTFont('DVB', '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'))
from reportlab.pdfbase.pdfmetrics import registerFontFamily
registerFontFamily('DV', normal='DV', bold='DVB', italic='DV', boldItalic='DVB')

INK = HexColor('#201d27')
MUTED = HexColor('#635c6e')
CELL = HexColor('#f4f0fa')
RULE = HexColor('#d6ccdf')
ACCENT = HexColor('#68499c')
W, H = A4
L, R = 42.0, 553.3
TEXTW = R - L


def style(size, color=INK, bold=False, leading=None):
    return ParagraphStyle('s', fontName='DVB' if bold else 'DV', fontSize=size, textColor=color,
                          leading=leading or round(size * 1.42, 1))


class Page:
    def __init__(self, c, title, subtitle, footer, n, total):
        self.c, self.y, self.title = c, H - 49.8, title
        c.setFillColor(INK); c.setFont('DVB', 20); c.drawString(L, H - 69.8 + 4.6, title)
        c.setFillColor(MUTED); c.setFont('DV', 9.5); c.drawString(L, H - 89.8 + 2.4, subtitle)
        c.setFont('DV', 8); c.drawString(L, H - 816.8 + 1.9, footer)
        c.drawRightString(R, H - 816.8 + 1.9, f'{n} / {total}')
        self.y = H - 113.5

    def done(self):
        """Fails the build if content has run into the footer line."""
        if self.y < 44:
            raise SystemExit(f'{self.title!r} runs {44 - self.y:.0f} pt into the footer; shorten it')
        self.c.showPage()

    def gap(self, d):
        self.y -= d

    def para(self, html, size=10.4, color=INK, x=L, width=TEXTW, bold=False, leading=None):
        p = Paragraph(html, style(size, color, bold, leading))
        _, h = p.wrap(width, 1000)
        p.drawOn(self.c, x, self.y - h)
        self.y -= h
        return h

    def heading(self, text, before=18, after=8):
        self.gap(before)
        self.para(text, 12, bold=True)
        self.gap(after)

    def kv(self, rows, label_w=132, size=9.4, pad=6.8):
        c = self.c
        for label, value in rows:
            lp = Paragraph(label, style(size, bold=True, leading=13.4))
            vp = Paragraph(value, style(size, leading=13.4))
            _, lh = lp.wrap(label_w - 14, 1000)
            _, vh = vp.wrap(TEXTW - label_w - 14, 1000)
            h = max(lh, vh) + 2 * pad
            c.setFillColor(CELL); c.rect(L, self.y - h, label_w, h, stroke=0, fill=1)
            c.setStrokeColor(RULE); c.setLineWidth(0.4); c.line(L, self.y - h, R, self.y - h)
            lp.drawOn(c, L + 7, self.y - pad - lh)
            vp.drawOn(c, L + label_w + 9, self.y - pad - vh)
            self.y -= h

    def box(self, html, size=10.0, pad=13, border=False, bold_first=None):
        p = Paragraph(html, style(size, leading=14))
        _, h = p.wrap(TEXTW - 24, 1000)
        bh = h + 2 * pad
        c = self.c
        c.setFillColor(CELL)
        if border:
            c.setStrokeColor(RULE); c.setLineWidth(1.4)
        c.roundRect(L, self.y - bh, TEXTW, bh, 8, stroke=1 if border else 0, fill=1)
        p.drawOn(c, L + 12, self.y - pad - h)
        self.y -= bh

    def step_box(self, title, body, min_h=77):
        tp = Paragraph(title, style(11, bold=True))
        bp = Paragraph(body, style(9.5, leading=13.5))
        _, th = tp.wrap(TEXTW - 28, 1000)
        _, bh = bp.wrap(TEXTW - 28, 1000)
        h = max(min_h, th + bh + 34)
        c = self.c
        c.setFillColor(CELL); c.setStrokeColor(RULE); c.setLineWidth(1.4)
        c.roundRect(L, self.y - h, TEXTW, h, 8, stroke=1, fill=1)
        tp.drawOn(c, L + 14, self.y - 12 - th)
        bp.drawOn(c, L + 14, self.y - 12 - th - 7 - bh)
        self.y -= h

    def down_arrow(self):
        c = self.c
        x = (L + R) / 2
        c.setStrokeColor(ACCENT); c.setFillColor(ACCENT); c.setLineWidth(1.4)
        c.line(x, self.y - 4, x, self.y - 16)
        pth = c.beginPath(); pth.moveTo(x - 4, self.y - 13); pth.lineTo(x + 4, self.y - 13); pth.lineTo(x, self.y - 19); pth.close()
        c.drawPath(pth, stroke=0, fill=1)
        self.y -= 26.5

    def flow_diagram(self, left, right, arrows):
        """Two boxes and horizontal arrows. arrows: [(label, 'right'|'left')]."""
        c = self.c
        top = self.y
        for (x0, x1), (t, s) in zip([(L, 220.0), (375.3, R)], [left, right]):
            c.setFillColor(CELL); c.setStrokeColor(RULE); c.setLineWidth(1.0)
            c.roundRect(x0, top - 47, x1 - x0, 47, 8, stroke=1, fill=1)
            c.setFillColor(INK); c.setFont('DVB', 11); c.drawString(x0 + 10, top - 20.3, t)
            c.setFillColor(MUTED); c.setFont('DV', 8.8); c.drawString(x0 + 10, top - 37.2, s)
        y = top - 67
        for label, direction in arrows:
            c.setFillColor(MUTED); c.setFont('DV', 8.5); c.drawString(192, y - 6.6, label)
            ly = y - 22
            c.setStrokeColor(ACCENT); c.setLineWidth(1.6); c.line(92, ly, 503.3, ly)
            c.setFillColor(ACCENT)
            pth = c.beginPath()
            if direction == 'right':
                pth.moveTo(497.3, ly + 3.6); pth.lineTo(503.3, ly); pth.lineTo(497.3, ly - 3.6)
            else:
                pth.moveTo(98, ly + 3.6); pth.lineTo(92, ly); pth.lineTo(98, ly - 3.6)
            pth.close(); c.drawPath(pth, stroke=0, fill=1)
            y -= 38
        self.y = y - 4
