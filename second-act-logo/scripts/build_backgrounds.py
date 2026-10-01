"""
Zoom and Microsoft Teams virtual backgrounds, 1920 x 1080.

Layout rules for video calls:
- Brand top left: clear of the head and shoulders, and clear of the name
  label both apps place bottom left.
- Nothing important in the centre or along the bottom edge.
- A faint arch behind the speaker, so they appear inside the act marker.

    python3 scripts/build_backgrounds.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from salib import Art, Run, arch_frame, ROOT, CREAM, BLUSH, BURGUNDY
from build_logo import (compose, lockup_horizontal, lockup_already_qualified,
                        text_art, write)

W, H = 1920, 1080
LS = 1.25  # brand line scale (set at 34 px, shown at about 42 px)
GREEN = "#26473B"  # Library Green: backgrounds only, not a core brand colour

# Each ground gets a quiet arch tone only slightly lighter than itself.
GROUNDS = {
    "wine": (BURGUNDY, "#84353F"),
    "green": (GREEN, "#3A5C4F"),
}


def arch_layer(tone):
    art = Art()
    aw, top = 700, 210
    art.shape(arch_frame((W - aw) / 2, top, aw, H - top + 40, 5))
    return (art, W, H, 0, 0, 1, {"fg": tone})


def brand_line():
    return text_art([
        ([Run("serif", "Build your second act", 34, wght=400)], 34),
        ([Run("serif-italic", "while still thriving in your first.", 34, wght=400)], 48),
    ], align="right")


def build():
    files = {}
    horiz = lockup_horizontal()
    aq = lockup_already_qualified()
    line = brand_line()
    for name, (bg, tone) in GROUNDS.items():
        # Main brand: lockup 700 px wide top left, brand line top right
        s = 700 / horiz[1]
        files[f"second-act-advisory-{name}"] = compose(W, H, bg, [
            arch_layer(tone),
            (horiz[0], horiz[1], horiz[2], 50, 40, s, {"fg": CREAM}),
            # brand line sits level with the wordmark, mirrored to the right
            (line[0], line[1], line[2], W - 90 - line[1] * LS, 40 + horiz[2] * s * 0.36, LS,
             {"fg": BLUSH}),
        ], "Second Act Advisory meeting background")
        # Already Qualified: the podcast lockup, 820 px wide
        s2 = 820 / aq[1]
        files[f"already-qualified-{name}"] = compose(W, H, bg, [
            arch_layer(tone),
            (aq[0], aq[1], aq[2], 30, 30, s2, {"fg": CREAM}),
        ], "Already Qualified meeting background")
    for n, svg in files.items():
        write(ROOT / "meeting-backgrounds" / f"{n}.svg", svg)
    print(f"built {len(files)} meeting backgrounds")


if __name__ == "__main__":
    build()
