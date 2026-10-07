"""
Zoom and Microsoft Teams virtual backgrounds, 1920 x 1080.

Sized for legibility in a video tile, which shows the frame at a fraction
of its size. Layout rules:
- The speaker owns the centre, roughly x 720 to 1200, and the lower half.
- Brand mark in a left column, words in a right column, both in the
  upper part of the frame, so text never sits behind the head.
- Nothing in the bottom-left corner, where both apps show the name label.
- 70 px margins, because Teams crops the edges in some views.

    python3 scripts/build_backgrounds.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from salib import Art, Run, ROOT, CREAM, BLUSH, BURGUNDY, ROSE
from build_logo import compose, lockup_stacked, mark, sans_caps, write

W, H = 1920, 1080
M = 70                    # outer margin
RIGHT = W - M             # right edge of the right-hand column
GREEN = "#26473B"         # Library Green: backgrounds only, not a core brand colour

# Name plate, matching the email signature. Change these two lines if needed.
PERSON = "Olufunke Adeyinka"
ROLE = "FOUNDER  ·  SECOND ACT ADVISORY"


def right(art, run, baseline, role="fg"):
    """Set a run flush right against the right-hand margin."""
    art.text(run, RIGHT - run.width, baseline, role=role)


def logo_left():
    """Stacked lockup, as large as the left column allows. Its built-in
    clear space is trimmed so the ink starts at the margin."""
    st, sw, sh = lockup_stacked()
    pad = 200 * 0.46 / 2          # clear space built into the stacked lockup
    s = 1.45                      # SECOND ACT at about 90 px, ink right edge about x 680
    return (st, sw, sh, M - pad * s, 56 - pad * s, s)


def brand_only(fg, accent):
    """Logo left; brand line right, in three large lines."""
    art = Art()
    for i, (txt, face) in enumerate([("Build your second act", "serif"),
                                     ("while still thriving", "serif-italic"),
                                     ("in your first.", "serif-italic")]):
        right(art, Run(face, txt, 58, wght=400), 150 + i * 74)
    return art


def signature(fg, accent):
    """Logo left; name, title and brand line right, like the email signature."""
    art = Art()
    right(art, Run("serif", PERSON, 82, wght=500), 150)
    right(art, Run("sans", ROLE, 31, wght=500, tracking=0.18), 216, role="accent")
    right(art, Run("serif", "Build your second act", 50, wght=400), 326)
    right(art, Run("serif-italic", "while still thriving in your first.", 50, wght=400), 388)
    return art


def already_qualified():
    """Podcast title stacked large on the left, series line on the right."""
    art = Art()
    h_arch = 170
    mark(M, 56, h_arch, art)
    a = Run("serif", "Already", 150, wght=500)
    q = Run("serif-italic", "Qualified", 150, wght=500)
    base1 = 56 + h_arch + 40 + a.cap
    art.text(a, M - 4, base1)
    art.text(q, M - 4, base1 + 150)
    right(art, sans_caps("A SECOND ACT ADVISORY", 40, 0.26), 128, role="accent")
    right(art, sans_caps("PODCAST", 40, 0.26), 192, role="accent")
    return art


def build():
    files = {}
    logo = logo_left()
    looks = [
        ("signature-cream", CREAM, BURGUNDY, ROSE, signature),
        ("signature-wine", BURGUNDY, CREAM, BLUSH, signature),
        ("second-act-advisory-wine", BURGUNDY, CREAM, BLUSH, brand_only),
        ("second-act-advisory-green", GREEN, CREAM, BLUSH, brand_only),
    ]
    for name, bg, fg, accent, words in looks:
        col = {"fg": fg, "accent": accent}
        files[name] = compose(W, H, bg, [
            (*logo, {"fg": fg}),
            (words(fg, accent), W, H, 0, 0, 1, col),
        ], "Second Act Advisory meeting background")
    for name, bg in [("already-qualified-wine", BURGUNDY), ("already-qualified-green", GREEN)]:
        files[name] = compose(W, H, bg, [
            (already_qualified(), W, H, 0, 0, 1, {"fg": CREAM, "accent": BLUSH}),
        ], "Already Qualified meeting background")
    for n, svg in files.items():
        write(ROOT / "meeting-backgrounds" / f"{n}.svg", svg)
    print(f"built {len(files)} meeting backgrounds")


if __name__ == "__main__":
    build()
