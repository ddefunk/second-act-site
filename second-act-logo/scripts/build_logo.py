"""
Second Act Advisory: final logo system (Concept B, framed numeral).

Generates every vector master:
  logo/svg/        outlined SVGs, every asset x every colourway
  source/          the same artwork with live, editable text
  favicon/, social/, podcast/  SVG masters that export.js rasterises

Run via `node scripts/export.js` (which calls this first), or on its own:
    python3 scripts/build_logo.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from salib import (Art, Run, numeral_ii, arch_frame, path_el, ROOT, _n,
                   BURGUNDY, CREAM, ROSE, BLUSH, INK, WHITE)

# ------------------------------------------------------------ core geometry
# The house "II": fine bars joining two stems, bracketed serifs.
II = dict(stem=0.16, gap=0.23, bar=0.034, over=0.12, brx=0.065, bry=0.10)
ARCH_W = 0.62        # arch width as a fraction of its height
ARCH_LINE = 0.028    # arch stroke as a fraction of its height (was 0.018)
II_IN_ARCH = 0.46    # II height as a fraction of arch height
II_CENTRE = 0.585    # II centre sits a touch low, optically centred under the curve

# Optical kerning by hand (em, keyed by character index of the left glyph).
KERN = {
    "SECOND ACT": {1: -0.005, 2: -0.01, 3: 0.0, 4: 0.005, 6: -0.045, 7: -0.02, 8: -0.01},
}


def serif_caps(text, size, tracking=0.07):
    return Run("serif", text, size, wght=500, tracking=tracking, kern=KERN.get(text))


def sans_caps(text, size, tracking=0.42, wght=500):
    return Run("sans", text, size, wght=wght, tracking=tracking)


def mark(x, y, h, art, line=ARCH_LINE):
    """Arch frame with the II inside. Returns the arch width."""
    w = h * ARCH_W
    art.shape(arch_frame(x, y, w, h, h * line))
    h_ii = h * II_IN_ARCH
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    d, _ = numeral_ii(x + (w - w_ii) / 2, y + h * II_CENTRE - h_ii / 2, h_ii, **II)
    art.shape(d)
    return w


def solid_arch(x, y, w, h):
    r, k = w / 2, 0.5523
    return (f"M{_n(x)},{_n(y + h)}L{_n(x)},{_n(y + r)}"
            f"C{_n(x)},{_n(y + r - r*k)} {_n(x + r - r*k)},{_n(y)} {_n(x + r)},{_n(y)}"
            f"C{_n(x + r + r*k)},{_n(y)} {_n(x + w)},{_n(y + r - r*k)} {_n(x + w)},{_n(y + r)}"
            f"L{_n(x + w)},{_n(y + h)}Z")


def mark_solid(x, y, h, art):
    """Small-size variant: filled arch with a heavier II cut out as a true
    hole. Used for favicons, where a fine frame would blur away."""
    w = h * ARCH_W
    h_ii = h * 0.50
    heavy = dict(II, stem=0.20, gap=0.20, bar=0.075, brx=0.05, bry=0.07)
    _, w_ii = numeral_ii(0, 0, h_ii, **heavy)
    d_ii, _ = numeral_ii(x + (w - w_ii) / 2, y + h * 0.60 - h_ii / 2, h_ii, **heavy)
    art.shape(solid_arch(x, y, w, h) + d_ii, role="solid-eo")
    return w


# ------------------------------------------------------------ lockups
# Every builder returns (art, width, height). Clear space is built into the
# artboard: a margin equal to half the height of the II in that lockup.

def lockup_stacked():
    art = Art()
    sa = serif_caps("SECOND ACT", 62)
    adv = sans_caps("ADVISORY", 25)
    h_arch = 200
    h_ii = h_arch * II_IN_ARCH
    pad = h_ii / 2
    W = sa.width + pad * 2
    mark((W - h_arch * ARCH_W) / 2, pad, h_arch, art)
    base1 = pad + h_arch + 46 + sa.cap
    art.text(sa, pad, base1)
    base2 = base1 + 27 + adv.cap
    # trailing tracking is excluded from .width, so this centres the ink
    art.text(adv, (W - adv.width) / 2, base2)
    return art, W, base2 + pad


def lockup_horizontal(line2="ADVISORY", line2_track=0.42):
    art = Art()
    sa = serif_caps("SECOND ACT", 62)
    adv = sans_caps(line2, 25, line2_track)
    h_arch = 150
    h_ii = h_arch * II_IN_ARCH
    pad = h_ii / 2
    w_arch = mark(pad, pad, h_arch, art)
    tx = pad + w_arch + 44
    gap = 26
    block = sa.cap + gap + adv.cap
    top = pad + h_arch * 0.56 - block / 2      # align to the II, not the arch
    art.text(sa, tx, top + sa.cap)
    art.text(adv, tx + 1, top + sa.cap + gap + adv.cap)
    W = tx + max(sa.width, adv.width) + pad
    return art, W, h_arch + pad * 2


def lockup_studio():
    return lockup_horizontal("ADVISORY STUDIO", 0.30)


def lockup_monogram():
    art = Art()
    h = 240
    pad = h * II_IN_ARCH / 2
    w = mark(pad, pad, h, art)
    return art, w + pad * 2, h + pad * 2


def lockup_already_qualified():
    """Podcast sub-brand. Shares the arch, but opens it on its side as a
    doorway line, and swaps the II for a spoken, italic voice."""
    art = Art()
    a = Run("serif", "Already ", 92, wght=500)
    q = Run("serif-italic", "Qualified", 92, wght=500)
    sub = sans_caps("A SECOND ACT ADVISORY PODCAST", 19, 0.30)
    pad = 46
    h_arch = 118
    w_arch = mark(pad, pad, h_arch, art)
    tx = pad + w_arch + 36
    base1 = pad + h_arch * 0.62
    art.text(a, tx, base1)
    art.text(q, tx + a.width - 2, base1)
    base2 = base1 + 26 + sub.cap
    art.text(sub, tx + 2, base2)
    W = tx + max(a.width + q.width, sub.width) + pad
    return art, W, h_arch + pad * 2


ASSETS = {
    "stacked": lockup_stacked,
    "horizontal": lockup_horizontal,
    "monogram": lockup_monogram,
    "studio": lockup_studio,
    "already-qualified": lockup_already_qualified,
}

# name: (colours, background)
WAYS = {
    "burgundy-on-cream": ({"fg": BURGUNDY}, CREAM),
    "cream-on-burgundy": ({"fg": CREAM}, BURGUNDY),
    "ink": ({"fg": INK}, None),
    "white": ({"fg": WHITE}, None),
    "burgundy": ({"fg": BURGUNDY}, None),
}

TITLES = {
    "stacked": "Second Act Advisory",
    "horizontal": "Second Act Advisory",
    "monogram": "Second Act Advisory monogram",
    "studio": "Second Act Advisory Studio",
    "already-qualified": "Already Qualified, a Second Act Advisory podcast",
}


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)


# ------------------------------------------------------------ composed pieces
def compose(w, h, bg, layers, title):
    """layers: list of (art, art_w, art_h, x, y, scale, colours)."""
    out = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {_n(w)} {_n(h)}" '
           f'width="{_n(w)}" height="{_n(h)}" role="img" aria-label="{title}">',
           f"<title>{title}</title>"]
    if bg:
        out.append(f'<rect width="100%" height="100%" fill="{bg}"/>')
    for art, aw, ah, x, y, s, col in layers:
        by = {}
        for d, role in art.paths:
            by.setdefault(role, []).append(d)
        out.append(f'<g transform="translate({_n(x)} {_n(y)}) scale({s:.5f})">')
        for role, ds in by.items():
            out.append(path_el(col.get(role, col["fg"]), "".join(ds), role))
        out.append("</g>")
    out.append("</svg>")
    return "\n".join(out) + "\n"


def centred(art_tuple, box_x, box_y, box_w, box_h, col, fit_w=None, fit_h=None):
    art, aw, ah = art_tuple
    s = min((fit_w or box_w) / aw, (fit_h or box_h) / ah)
    return (art, aw, ah, box_x + (box_w - aw * s) / 2, box_y + (box_h - ah * s) / 2, s, col)


def text_art(runs_lines, align="centre"):
    """Lay out lines of runs. runs_lines: [(runs, baseline_gap)]. Returns art,w,h."""
    art = Art()
    widths = [sum(r.width for r in runs) for runs, _ in runs_lines]
    W = max(widths)
    y = 0
    for (runs, gap), lw in zip(runs_lines, widths):
        y += gap
        x = (W - lw) / 2 if align == "centre" else 0
        for r in runs:
            art.text(r, x, y)
            x += r.width
    return art, W, y


def build_social():
    B, C = {"fg": CREAM}, {"fg": BURGUNDY}
    mono = lockup_monogram()
    stacked = lockup_stacked()
    horiz = lockup_horizontal()
    tagline = text_art([
        ([Run("serif", "Build your second act ", 44, wght=400),
          Run("serif-italic", "while still thriving", 44, wght=400)], 44),
        ([Run("serif", "in your first.", 44, wght=400)], 58)])
    tag_one = text_art([([Run("serif", "Build your second act ", 30, wght=400),
                          Run("serif-italic", "while still thriving in your first.", 30, wght=400)], 30)])
    files = {}

    # Avatars: mark within the central 58% so a circular crop never touches it
    for name, bg, col in [("instagram/instagram-avatar-320", BURGUNDY, B),
                          ("facebook/facebook-avatar-320", BURGUNDY, B),
                          ("linkedin/linkedin-logo-400", BURGUNDY, B)]:
        size = 400 if "400" in name else 320
        files[name] = compose(size, size, bg, [centred(mono, 0, 0, size, size, col,
                              fit_h=size * 0.72)], "Second Act Advisory")
    files["instagram/instagram-avatar-320-cream"] = compose(
        320, 320, CREAM, [centred(mono, 0, 0, 320, 320, C, fit_h=320 * 0.72)], "Second Act Advisory")

    # Facebook cover 1640x624. Mobile shows roughly the central 1200 px;
    # desktop overlays the profile photo bottom-left, so content stays centred.
    files["facebook/facebook-cover-1640x624"] = compose(1640, 624, BURGUNDY, [
        centred(horiz, 0, 150, 1640, 190, B, fit_h=190),
        centred(tag_one, 0, 386, 1640, 60, {"fg": BLUSH}, fit_h=40),
    ], "Second Act Advisory")

    # LinkedIn banner 1128x191. Keep content inside the central ~ 800 px.
    files["linkedin/linkedin-banner-1128x191"] = compose(1128, 191, BURGUNDY, [
        centred(horiz, 0, 30, 1128, 70, B, fit_h=70),
        centred(tag_one, 0, 118, 1128, 40, {"fg": BLUSH}, fit_h=24),
    ], "Second Act Advisory")

    # Instagram template footer: small transparent lockups
    files["instagram/instagram-footer-lockup-cream"] = compose(
        horiz[1], horiz[2], None, [(horiz[0], horiz[1], horiz[2], 0, 0, 1, B)], "Second Act Advisory")
    files["instagram/instagram-footer-lockup-burgundy"] = compose(
        horiz[1], horiz[2], None, [(horiz[0], horiz[1], horiz[2], 0, 0, 1, C)], "Second Act Advisory")

    # Email signature master (exported at 600 px wide)
    files["../stationery/email-signature"] = compose(
        horiz[1], horiz[2], None, [(horiz[0], horiz[1], horiz[2], 0, 0, 1, C)], "Second Act Advisory")
    return files


def build_podcast():
    """3000x3000 cover: the arch scaled up as a doorway holding the title."""
    S = 3000
    art = Art()
    h_arch, w_arch = 2080, 2080 * ARCH_W * 1.3
    x0, y0 = (S - w_arch) / 2, 360
    art.shape(arch_frame(x0, y0, w_arch, h_arch, 22))
    a = Run("serif", "Already", 330, wght=500)
    q = Run("serif-italic", "Qualified", 330, wght=500)
    art.text(a, (S - a.width) / 2, y0 + h_arch * 0.52)
    art.text(q, (S - q.width) / 2, y0 + h_arch * 0.52 + 360)
    # small II mark as the family signature, top of the doorway
    h_ii = 190
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    d, _ = numeral_ii((S - w_ii) / 2, y0 + 330, h_ii, **II)
    art.shape(d)
    sub = sans_caps("A SECOND ACT ADVISORY PODCAST", 70, 0.30)
    art.text(sub, (S - sub.width) / 2, y0 + h_arch + 250)
    return art.svg(S, S, {"fg": CREAM}, bg=BURGUNDY,
                   title="Already Qualified, a Second Act Advisory podcast"), art


def build_favicon():
    files = {}
    # Small sizes: solid arch, II knocked out, on transparent
    art = Art()
    mark_solid(0, 0, 100, art)
    w = 100 * ARCH_W
    # square artboard, arch centred
    for name, bg, col in [("favicon-mark", None, {"fg": BURGUNDY})]:
        files[name] = compose(100, 100, bg, [(art, w, 100, (100 - w * 0.94) / 2, 3, 0.94, col)],
                              "Second Act Advisory")
    # Touch icons: full-bleed burgundy square with the standard cream mark
    mono = lockup_monogram()
    files["touch-icon"] = compose(180, 180, BURGUNDY, [centred(mono, 0, 0, 180, 180, {"fg": CREAM},
                                  fit_h=180 * 0.78)], "Second Act Advisory")
    return files


# ------------------------------------------------------------ main
def main():
    count = 0
    for asset, fn in ASSETS.items():
        art, w, h = fn()
        for way, (col, bg) in WAYS.items():
            write(ROOT / "logo" / "svg" / f"sa-{asset}-{way}.svg",
                  art.svg(w, h, col, bg=bg, title=TITLES[asset]))
            count += 1
        write(ROOT / "source" / f"sa-{asset}-live-text.svg",
              art.svg(w, h, {"fg": BURGUNDY}, bg=None,
                      title=TITLES[asset], live=True))
    for name, svg in build_social().items():
        write(ROOT / "social" / f"{name}.svg", svg)
        count += 1
    pod_svg, pod_art = build_podcast()
    write(ROOT / "podcast" / "already-qualified-cover-3000.svg", pod_svg)
    write(ROOT / "source" / "already-qualified-cover-live-text.svg",
          pod_art.svg(3000, 3000, {"fg": CREAM}, bg=BURGUNDY, live=True))
    for name, svg in build_favicon().items():
        write(ROOT / "favicon" / f"{name}.svg", svg)
        count += 1
    print(f"built {count + 1} SVG masters")


if __name__ == "__main__":
    main()
