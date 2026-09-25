"""Quality checks: outlined SVGs, no font references, WCAG contrast.

    python3 scripts/check.py
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
FINAL = ["logo/svg", "favicon", "social", "podcast", "stationery"]
bad = []
n = 0
for d in FINAL:
    for f in (ROOT / d).rglob("*.svg"):
        n += 1
        s = f.read_text()
        if re.search(r"<text|<tspan|font-family|@font-face|<image|href=", s):
            bad.append(str(f.relative_to(ROOT)))
print(f"SVGs checked: {n}; with live text, font or external references: {len(bad)}")
for b in bad:
    print("  FAIL", b)


def lum(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    c = [x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]


def ratio(a, b):
    hi, lo = sorted([lum(a), lum(b)], reverse=True)
    return (hi + 0.05) / (lo + 0.05)


for a, b, label in [("#6F1F2A", "#F5F1E8", "burgundy / cream"),
                    ("#6F1F2A", "#F8E9E2", "burgundy / blush"),
                    ("#884850", "#F5F1E8", "dusty rose / cream"),
                    ("#1F1A1A", "#F5F1E8", "ink / cream")]:
    r = ratio(a, b)
    print(f"{label:20s} {r:5.2f}:1  AA {'pass' if r >= 4.5 else 'FAIL'}  AAA {'pass' if r >= 7 else 'no'}")
raise SystemExit(1 if bad else 0)
