"""
Second Act Advisory: shared drawing library.

- Text is shaped with HarfBuzz (real kerning from the font) and converted to
  outlined SVG paths with fontTools, so final files never depend on fonts.
- The "II" monogram is drawn by hand as geometry, not taken from a font.
- Every text call can also emit a live <text> element for the editable
  versions kept in /source.
"""
from pathlib import Path

import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "fonts"

# Brand colours (exact)
BURGUNDY = "#6F1F2A"
CREAM = "#F5F1E8"
ROSE = "#884850"
BLUSH = "#F8E9E2"
INK = "#1F1A1A"
WHITE = "#FFFFFF"

FONT_FILES = {
    "serif": ("PlayfairDisplay[wght].ttf", "Playfair Display"),
    "serif-italic": ("PlayfairDisplay-Italic[wght].ttf", "Playfair Display"),
    "sans": ("Montserrat[wght].ttf", "Montserrat"),
}

_cache = {}


def _n(v):
    s = f"{v:.2f}".rstrip("0").rstrip(".")
    return "0" if s in ("-0", "") else s


class Face:
    def __init__(self, key, wght):
        fname, family = FONT_FILES[key]
        path = str(FONTS / fname)
        self.key, self.family, self.wght = key, family, wght
        self.italic = "italic" in key
        self.tt = TTFont(path)
        self.upem = self.tt["head"].unitsPerEm
        self.glyphset = self.tt.getGlyphSet(location={"wght": wght})
        self.order = self.tt.getGlyphOrder()
        self.hbfont = hb.Font(hb.Face(hb.Blob.from_file_path(path)))
        self.hbfont.set_variations({"wght": wght})
        os2 = self.tt["OS/2"]
        self.cap = os2.sCapHeight
        self.xh = os2.sxHeight


def face(key, wght):
    k = (key, wght)
    if k not in _cache:
        _cache[k] = Face(key, wght)
    return _cache[k]


class Run:
    """A shaped, positioned line of text."""

    def __init__(self, key, text, size, wght=400, tracking=0.0, kern=None):
        """
        tracking: extra space after each glyph, in em.
        kern: {i: em} manual optical kerning added between char i and i+1.
        """
        self.f = face(key, wght)
        self.text, self.size, self.tracking = text, size, tracking
        self.kern = kern or {}
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.f.hbfont, buf, {"kern": True, "liga": True})
        s = size / self.f.upem
        self.glyphs = []  # (name, x_offset_px, y_offset_px, cluster)
        x = 0.0
        n = len(buf.glyph_infos)
        for i, (inf, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
            name = self.f.order[inf.codepoint]
            self.glyphs.append((name, x + pos.x_offset * s, pos.y_offset * s, inf.cluster))
            x += pos.x_advance * s
            if i < n - 1:
                x += tracking * size + self.kern.get(inf.cluster, 0) * size
        self.width = x  # advance width, no trailing tracking
        self.scale = s
        self.cap = self.f.cap * s
        self.xh = self.f.xh * s

    def _draw(self, pen_factory, x, y):
        s = self.scale
        for name, gx, gy, _ in self.glyphs:
            pen = pen_factory()
            tp = TransformPen(pen, (s, 0, 0, -s, x + gx, y - gy))
            self.f.glyphset[name].draw(tp)
            yield pen

    def ink_bounds(self, x=0, y=0):
        """Actual ink extents (xmin, ymin, xmax, ymax) in SVG coordinates."""
        xs, ys = [], []
        for pen in self._draw(lambda: BoundsPen(self.f.glyphset), x, y):
            if pen.bounds:
                x0, y0, x1, y1 = pen.bounds
                xs += [x0, x1]
                ys += [y0, y1]
        return min(xs), min(ys), max(xs), max(ys)

    def path(self, x, y):
        """Outlined SVG path data with baseline origin at (x, y)."""
        parts = []
        for pen in self._draw(lambda: SVGPathPen(self.f.glyphset, ntos=_n), x, y):
            d = pen.getCommands()
            if d:
                parts.append(d)
        return "".join(parts)

    def live(self, x, y, fill):
        """Editable <text> equivalent for /source files."""
        style = (
            f"font-family:'{self.f.family}';font-size:{_n(self.size)}px;"
            f"font-weight:{self.f.wght};letter-spacing:{_n(self.tracking * self.size)}px"
        )
        if self.f.italic:
            style += ";font-style:italic"
        esc = self.text.replace("&", "&amp;").replace("<", "&lt;")
        return f'<text x="{_n(x)}" y="{_n(y)}" fill="{fill}" style="{style}">{esc}</text>'


# ---------------------------------------------------------------- the II mark

def numeral_ii(x, y, h, stem=0.17, gap=0.22, bar=0.045, over=0.14,
               brx=0.075, bry=0.11, bar_left=0.0, bar_right=0.0,
               stems=2):
    """
    Hand-drawn Roman numeral II with hairline top and bottom bars that join
    the two stems, and bracketed (curved) serifs. All proportions are
    fractions of the height h. Returns (path_d, width).

    bar_left / bar_right extend the bottom bar beyond the normal serif
    (used by Concept C to underline the word 'Act').
    """
    s, g, t, o = stem * h, gap * h, bar * h, over * h
    rx, ry = brx * h, bry * h
    k = 0.5523  # circle approximation for the bracket curves
    stem_x = [o + i * (s + g) for i in range(stems)]
    W = o * 2 + stems * s + (stems - 1) * g
    H = h
    bl, br = bar_left * h, bar_right * h

    def P(px, py):
        return f"{_n(x + px)},{_n(y + py)}"

    # Outer contour (clockwise)
    d = [f"M{P(0, 0)}", f"L{P(W, 0)}", f"L{P(W, t)}"]
    last = stem_x[-1] + s
    # top-right bracket down the outside of the last stem
    d.append(f"L{P(last + rx, t)}")
    d.append(f"C{P(last + rx*(1-k), t)} {P(last, t + ry*(1-k))} {P(last, t + ry)}")
    d.append(f"L{P(last, H - t - ry)}")
    d.append(f"C{P(last, H - t - ry*(1-k))} {P(last + rx*(1-k), H - t)} {P(last + rx, H - t)}")
    d.append(f"L{P(W + br, H - t)}")
    d.append(f"L{P(W + br, H)}")
    d.append(f"L{P(-bl, H)}")
    d.append(f"L{P(-bl, H - t)}")
    first = stem_x[0]
    d.append(f"L{P(first - rx, H - t)}")
    d.append(f"C{P(first - rx*(1-k), H - t)} {P(first, H - t - ry*(1-k))} {P(first, H - t - ry)}")
    d.append(f"L{P(first, t + ry)}")
    d.append(f"C{P(first, t + ry*(1-k))} {P(first - rx*(1-k), t)} {P(first - rx, t)}")
    d.append(f"L{P(0, t)}Z")
    # Counters between stems (anticlockwise so nonzero fill leaves holes)
    for i in range(stems - 1):
        a = stem_x[i] + s       # right edge of left stem
        b = stem_x[i + 1]       # left edge of right stem
        d.append(f"M{P(a + rx, t)}")
        d.append(f"C{P(a + rx*(1-k), t)} {P(a, t + ry*(1-k))} {P(a, t + ry)}")
        d.append(f"L{P(a, H - t - ry)}")
        d.append(f"C{P(a, H - t - ry*(1-k))} {P(a + rx*(1-k), H - t)} {P(a + rx, H - t)}")
        d.append(f"L{P(b - rx, H - t)}")
        d.append(f"C{P(b - rx*(1-k), H - t)} {P(b, H - t - ry*(1-k))} {P(b, H - t - ry)}")
        d.append(f"L{P(b, t + ry)}")
        d.append(f"C{P(b, t + ry*(1-k))} {P(b - rx*(1-k), t)} {P(b - rx, t)}Z")
    return "".join(d), W


def arch_frame(x, y, w, h, line):
    """Hairline arch (round-topped tall rectangle) as a filled ring path."""
    r = w / 2
    ri = r - line

    def arch(x0, y0, rr, bottom):
        k = 0.5523
        cx, cy = x0 + rr, y0 + rr
        return (f"M{_n(x0)},{_n(bottom)}L{_n(x0)},{_n(cy)}"
                f"C{_n(x0)},{_n(cy - rr*k)} {_n(cx - rr*k)},{_n(y0)} {_n(cx)},{_n(y0)}"
                f"C{_n(cx + rr*k)},{_n(y0)} {_n(x0 + 2*rr)},{_n(cy - rr*k)} {_n(x0 + 2*rr)},{_n(cy)}"
                f"L{_n(x0 + 2*rr)},{_n(bottom)}Z")

    outer = arch(x, y, r, y + h)
    # inner drawn in reverse direction to punch the hole
    x0, y0, bottom = x + line, y + line, y + h - line
    cx, cy = x0 + ri, y0 + ri
    k = 0.5523
    inner = (f"M{_n(x0)},{_n(bottom)}L{_n(x0 + 2*ri)},{_n(bottom)}L{_n(x0 + 2*ri)},{_n(cy)}"
             f"C{_n(x0 + 2*ri)},{_n(cy - ri*k)} {_n(cx + ri*k)},{_n(y0)} {_n(cx)},{_n(y0)}"
             f"C{_n(cx - ri*k)},{_n(y0)} {_n(x0)},{_n(cy - ri*k)} {_n(x0)},{_n(cy)}Z")
    return outer + inner


def rect(x, y, w, h):
    return f"M{_n(x)},{_n(y)}h{_n(w)}v{_n(h)}h{_n(-w)}Z"


def path_el(fill, d, role):
    """<path>; roles ending in '-eo' use the even-odd rule (for shapes
    whose holes are drawn in the same direction). Never used for text,
    because variable-font glyphs may contain overlapping contours."""
    eo = ' fill-rule="evenodd"' if role.endswith("-eo") else ""
    return f'<path fill="{fill}"{eo} d="{d}"/>'


class Art:
    """Collects outlined paths plus a parallel live-text version."""

    def __init__(self):
        self.paths = []   # (d, role)
        self.live = []    # svg fragments for the editable version

    def text(self, run, x, y, role="fg"):
        self.paths.append((run.path(x, y), role))
        self.live.append(("text", run, x, y, role))

    def shape(self, d, role="fg"):
        self.paths.append((d, role))
        self.live.append(("shape", d, role))

    def svg(self, w, h, colours, bg=None, title="Second Act Advisory", live=False):
        """colours: {'fg': hex, 'accent': hex}; bg: hex or None (transparent)."""
        out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {_n(w)} {_n(h)}" '
               f'width="{_n(w)}" height="{_n(h)}" role="img" aria-label="{title}">',
               f"<title>{title}</title>"]
        if bg:
            out.append(f'<rect width="100%" height="100%" fill="{bg}"/>')
        if live:
            for item in self.live:
                if item[0] == "text":
                    _, run, x, y, role = item
                    out.append(run.live(x, y, colours.get(role, colours["fg"])))
                else:
                    _, d, role = item
                    out.append(path_el(colours.get(role, colours["fg"]), d, role))
        else:
            # merge paths per colour role to keep the file clean
            by_role = {}
            for d, role in self.paths:
                by_role.setdefault(role, []).append(d)
            for role, ds in by_role.items():
                out.append(path_el(colours.get(role, colours["fg"]), "".join(ds), role))
        out.append("</svg>")
        return "\n".join(out) + "\n"
