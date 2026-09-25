"""
Build the three logo concepts (A, B, C) as outlined SVGs, plus editable
live-text versions in /source/concepts.

    python3 scripts/build_concepts.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from salib import (Art, Run, numeral_ii, arch_frame, ROOT,
                   BURGUNDY, CREAM)

OUT = ROOT / "concepts" / "svg"
SRC = ROOT / "source" / "concepts"
OUT.mkdir(parents=True, exist_ok=True)
SRC.mkdir(parents=True, exist_ok=True)

# The house "II": fine bars, bracketed serifs
II = dict(stem=0.16, gap=0.23, bar=0.034, over=0.12, brx=0.065, bry=0.10)

# Optical kerning by hand, in em, keyed by character index (pair i, i+1)
# "Second Act": tighten the word space a touch and pull 'A' toward 'd'.
KERN_SECOND_ACT = {6: -0.02}
KERN_SECOND_ACT_CAPS = {6: -0.04}


def wordmark_lines(serif_size, caps=False, italic_act=False):
    if caps:
        l1 = Run("serif", "SECOND ACT", serif_size, wght=500, tracking=0.07,
                 kern=KERN_SECOND_ACT_CAPS)
        return [l1]
    if italic_act:
        a = Run("serif", "Second ", serif_size, wght=500)
        b = Run("serif-italic", "Act", serif_size, wght=500)
        return [a, b]
    return [Run("serif", "Second Act", serif_size, wght=500, kern=KERN_SECOND_ACT)]


def advisory(size, tracking=0.32):
    return Run("sans", "ADVISORY", size, wght=500, tracking=tracking)


def advisory_to_width(width, tracking=0.62, lo=8, hi=200):
    """Pick a size where ADVISORY at `tracking` spans exactly `width`."""
    for _ in range(40):
        mid = (lo + hi) / 2
        if advisory(mid, tracking).width > width:
            hi = mid
        else:
            lo = mid
    return advisory(lo, tracking)


def place(runs, x, y, art):
    """Place runs side by side on one baseline; return total width."""
    for r in runs:
        art.text(r, x, y)
        x += r.width
    return x


# ----------------------------------------------------------------- Concept A
def a_horizontal():
    art, pad = Art(), 40
    sa = wordmark_lines(100)[0]
    adv = advisory(29)
    cap = sa.cap
    base1 = pad + cap
    base2 = base1 + 50
    h_ii = base2 - pad
    d, w_ii = numeral_ii(pad, pad, h_ii, **II)
    art.shape(d)
    tx = pad + w_ii + h_ii * 0.34
    art.text(sa, tx - sa.ink_bounds()[0] * 0 - 2, base1)
    art.text(adv, tx + 1, base2)
    W = tx + max(sa.width, adv.width) + pad
    return art, W, base2 + pad


def a_stacked():
    art, pad = Art(), 40
    sa = wordmark_lines(100)[0]
    adv = advisory(26, 0.42)
    W = max(sa.width, adv.width) + pad * 2
    h_ii = 150
    d, w_ii = numeral_ii(0, 0, h_ii, **II)
    d, _ = numeral_ii((W - w_ii) / 2, pad, h_ii, **II)
    art.shape(d)
    base1 = pad + h_ii + 42 + sa.cap
    art.text(sa, (W - sa.width) / 2, base1)
    base2 = base1 + 50
    art.text(adv, (W - adv.width) / 2 + adv.tracking * adv.size * 0, base2)
    return art, W, base2 + pad


def a_mono():
    art, pad, h = Art(), 40, 220
    d, w = numeral_ii(pad, pad, h, **II)
    art.shape(d)
    return art, w + pad * 2, h + pad * 2


# ----------------------------------------------------------------- Concept B
ARCH_LINE = 0.018  # frame hairline as a fraction of arch height


def framed_ii(x, y, h_arch, art):
    """Arch frame with the II centred inside. Returns arch width."""
    w_arch = h_arch * 0.62
    art.shape(arch_frame(x, y, w_arch, h_arch, max(1.6, h_arch * ARCH_LINE)))
    h_ii = h_arch * 0.46
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    # sit the II slightly low so it is optically centred under the round top
    cy = y + h_arch * 0.585
    d, _ = numeral_ii(x + (w_arch - w_ii) / 2, cy - h_ii / 2, h_ii, **II)
    art.shape(d)
    return w_arch


def b_horizontal():
    art, pad = Art(), 40
    h_arch = 150
    w_arch = framed_ii(pad, pad, h_arch, art)
    sa = wordmark_lines(62, caps=True)[0]
    adv = advisory(24, 0.42)
    tx = pad + w_arch + 44
    # centre the two-line block vertically on the arch
    block = sa.cap + 26 + adv.cap
    top = pad + (h_arch - block) / 2 + 6
    art.text(sa, tx, top + sa.cap)
    art.text(adv, tx, top + sa.cap + 26 + adv.cap)
    return art, tx + sa.width + pad, h_arch + pad * 2


def b_stacked():
    art, pad = Art(), 40
    sa = wordmark_lines(62, caps=True)[0]
    adv = advisory(24, 0.42)
    W = sa.width + pad * 2
    h_arch = 200
    w_arch = h_arch * 0.62
    framed_ii((W - w_arch) / 2, pad, h_arch, art)
    base1 = pad + h_arch + 44 + sa.cap
    art.text(sa, pad, base1)
    base2 = base1 + 26 + adv.cap
    art.text(adv, (W - adv.width) / 2, base2)
    return art, W, base2 + pad


def b_mono():
    art, pad, h = Art(), 40, 240
    w = framed_ii(pad, pad, h, art)
    return art, w + pad * 2, h + pad * 2


# ----------------------------------------------------------------- Concept C
def c_word(x, base, size, art):
    """'Second Act' with italic Act, followed by a II whose extended bottom
    bar underlines 'Act'. Returns right edge."""
    second, act = wordmark_lines(size, italic_act=True)
    art.text(second, x, base)
    ax = x + second.width - size * 0.02
    art.text(act, ax, base)
    act_l, _, act_r, _ = act.ink_bounds(ax, base)
    h_ii = second.cap * 1.18
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    ix = act_r + size * 0.16
    below = size * 0.10                    # bar sits this far under the baseline
    top = base + below - h_ii
    bar_left = (ix - act_l) / h_ii + 0.0
    d, _ = numeral_ii(ix, top, h_ii, bar_left=bar_left - II["over"] + 0.0, **II)
    art.shape(d)
    return ix + w_ii, top, base + below


def c_horizontal():
    art, pad = Art(), 40
    size = 100
    probe = Run("serif", "S", size, wght=500)
    base1 = pad + probe.cap * 1.18 - size * 0.10
    right, _, bottom = c_word(pad, base1, size, art)
    adv = advisory(29)
    base2 = bottom + 50
    art.text(adv, pad + 2, base2)
    return art, right + pad, base2 + pad


def c_stacked():
    art, pad = Art(), 40
    size = 100
    second = Run("serif", "Second", size, wght=500)
    # measure the 'Act II' group on a scratch canvas
    tmp = Art()
    act_w = c_act_ii(0, 100, size, tmp)[0]
    adv = advisory(26, 0.42)
    W = max(second.width, act_w, adv.width) + pad * 2
    base1 = pad + second.cap
    art.text(second, (W - second.width) / 2, base1)
    base2 = base1 + size * 1.05
    _, bottom = c_act_ii((W - act_w) / 2, base2, size, art)
    base3 = bottom + 52
    art.text(adv, (W - adv.width) / 2, base3)
    return art, W, base3 + pad


def c_act_ii(x, base, size, art):
    """Italic 'Act' + II with the underline bar. Returns (width, bottom)."""
    act = Run("serif-italic", "Act", size, wght=500)
    probe = Run("serif", "S", size, wght=500)
    art.text(act, x, base)
    act_l, _, act_r, _ = act.ink_bounds(x, base)
    h_ii = probe.cap * 1.18
    below = size * 0.10
    ix = act_r + size * 0.16
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    d, _ = numeral_ii(ix, base + below - h_ii, h_ii,
                      bar_left=(ix - act_l) / h_ii - II["over"], **II)
    art.shape(d)
    return ix + w_ii - x, base + below


def c_mono():
    """Compact 'Act II' mark: the whole idea in two glyph groups."""
    art, pad = Art(), 40
    size = 150
    act = Run("serif-italic", "Act", size, wght=500)
    probe = Run("serif", "S", size, wght=500)
    h_ii = probe.cap * 1.18
    base = pad + h_ii - size * 0.10
    art.text(act, pad, base)
    act_l, _, act_r, _ = act.ink_bounds(pad, base)
    ix = act_r + size * 0.16
    _, w_ii = numeral_ii(0, 0, h_ii, **II)
    d, _ = numeral_ii(ix, pad, h_ii, bar_left=(ix - act_l) / h_ii - II["over"], **II)
    art.shape(d)
    return art, ix + w_ii + pad, h_ii + pad * 2 + 4


BUILDS = {
    "A": dict(horizontal=a_horizontal, stacked=a_stacked, monogram=a_mono),
    "B": dict(horizontal=b_horizontal, stacked=b_stacked, monogram=b_mono),
    "C": dict(horizontal=c_horizontal, stacked=c_stacked, monogram=c_mono),
}
WAYS = {
    "burgundy-on-cream": ({"fg": BURGUNDY}, CREAM),
    "cream-on-burgundy": ({"fg": CREAM}, BURGUNDY),
}

if __name__ == "__main__":
    for concept, kinds in BUILDS.items():
        for kind, fn in kinds.items():
            art, w, h = fn()
            for way, (col, bg) in WAYS.items():
                name = f"concept-{concept.lower()}-{kind}-{way}.svg"
                (OUT / name).write_text(art.svg(w, h, col, bg=bg))
            # transparent version for avatar mock-ups
            (OUT / f"concept-{concept.lower()}-{kind}-cream.svg").write_text(
                art.svg(w, h, {"fg": CREAM}))
            (OUT / f"concept-{concept.lower()}-{kind}-burgundy.svg").write_text(
                art.svg(w, h, {"fg": BURGUNDY}))
            (SRC / f"concept-{concept.lower()}-{kind}.svg").write_text(
                art.svg(w, h, {"fg": BURGUNDY}, bg=CREAM, live=True))
            print(f"{concept} {kind}: {w:.0f} x {h:.0f}")
