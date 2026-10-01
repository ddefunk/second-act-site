# Second Act Advisory: logo system

The chosen route is Concept B, the framed numeral. A hand-drawn Roman numeral II sits inside an arch, like an act marker in a programme. The stacked lockup is the primary logo.

Every logo file is built from code. The type is Playfair Display and Montserrat, converted to outlines, so no fonts need to be installed to open or print anything.

## Where things are

| Folder | What it holds |
|---|---|
| `logo/svg/` | Master artwork. 5 assets × 5 colourways, with text outlined. Use these on the web and send them to designers. |
| `logo/pdf/` | The same 25 files as vector PDFs, for printers and Word or Canva uploads. |
| `logo/png/` | The same 25 files as PNGs at 512, 1024 and 2048 px wide. Transparent, except the two colourways that include a background. |
| `logo/contact-sheet.png` | Every raster file on one sheet, for checking. |
| `favicon/` | `favicon.ico` (16/32/48), `favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png` (180), `icon-512.png`. |
| `social/instagram/` | 320 px avatars (burgundy and cream), plus transparent footer lockups for carousel templates. |
| `social/facebook/` | 320 px avatar and the 1640 × 624 cover. |
| `social/linkedin/` | 400 px logo and the 1128 × 191 banner with the brand line. |
| `podcast/` | Already Qualified cover at 3000 × 3000, in PNG and JPG. |
| `meeting-backgrounds/` | Zoom and Teams backgrounds, 1920 × 1080 (PNG and JPG): Second Act Advisory and Already Qualified, each in wine and Library Green (#26473B, a background-only colour). |
| `stationery/` | A4 letterhead PDF (plus its HTML source), and the 600 px email signature PNG. |
| `stationery/email-signature/` | Ready-to-paste HTML email signature (open `index.html`, click Copy), its logo PNG and a plain-text version. Fill in the `[EMAIL]`, `[PHONE]` and `[WEBSITE]` placeholders. |
| `brand-guide/` | `index.html` and the 4-page PDF: logo versions, clear space, minimum sizes, colour, type and do's and don'ts. |
| `source/` | Editable SVGs with live text. You'll need the fonts in `fonts/` installed to see them correctly. |
| `concepts/` | Round 1 exploration (A, B, C) and trial renders, kept for the record. |
| `qa/` | Quality-check renders: 110 px avatars, 120 px lockups, carousel mock-up, previews. |
| `fonts/` | Playfair Display and Montserrat (the chosen pair), plus the other fonts trialled. Each has its SIL OFL licence. |
| `reference/` | Your original images. |

### Asset names

`sa-<asset>-<colourway>.<ext>`

- **Assets:** `stacked` (primary), `horizontal`, `monogram`, `studio` (website header), `already-qualified` (podcast sub-brand).
- **Colourways:**
  - `burgundy-on-cream` and `cream-on-burgundy` include a background.
  - `ink`, `white` and `burgundy` are transparent.

### Which file to use

| Situation | File |
|---|---|
| Website header | `logo/svg/sa-studio-burgundy.svg` (or `-white` on dark) |
| Website favicon | Put everything in `favicon/` at the site root, then add the tags below |
| Word and Google Docs | `logo/png/sa-horizontal-burgundy-1024.png` |
| Printer or signmaker | `logo/pdf/…` |
| Social profile pictures | `social/…/…-avatar-320.png` |

Favicon tags:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

### Meeting backgrounds

- **Zoom:** Settings → Backgrounds & effects → Virtual backgrounds → **+** → choose the PNG. Untick *Mirror my video* if you want to see the text the right way round. Others always see it correctly.
- **Teams:** in a meeting, go to More → Video effects → Add new, then choose the JPG.
- The logo sits top left, clear of your head and of the name label both apps show bottom left. Sit centred, roughly an arm's length from the camera.

## Re-exporting

You need Python 3 with `fonttools` and `uharfbuzz`, and Node 18 or later with `playwright`. Playwright uses its own Chromium.

```bash
pip install fonttools uharfbuzz
npm install playwright        # skip if it is already installed globally
node scripts/export.js        # rebuilds every SVG, PDF, PNG, ICO and the contact sheet
python3 scripts/check.py      # confirms outlines and contrast ratios
```

The export takes about 15 seconds and overwrites the generated files. Nothing in `source/`, `fonts/` or `reference/` is touched.

## Changing the logo later

All of the design lives in two files:

- `scripts/salib.py`
  - `numeral_ii()` draws the II: stem width, bar thickness and serif brackets, as fractions of its height.
  - `arch_frame()` draws the arch.
  - The brand colours are set at the top of the file.
- `scripts/build_logo.py`
  - `ARCH_LINE` sets the arch weight (currently 0.028), and `II_IN_ARCH` sets the numeral size.
  - `KERN` holds the hand-tuned letter spacing for "SECOND ACT".
  - The `lockup_*()` functions set every layout, and `build_social()` and `build_podcast()` set the composed pieces.

Change a number, run `node scripts/export.js`, and look at `logo/contact-sheet.png` before using anything.

To change the tagline or letterhead footer, edit `build_social()` or `stationery/letterhead.html` and re-export.

## Before commercial use

Search the UK IPO trade mark register (https://www.gov.uk/search-for-trademark) for the words "Second Act Advisory" and "Second Act", and for a Roman numeral II device mark. Search classes 35 (business advice), 41 (coaching, podcasts, education) and 45. Several "Second Act" brands already trade in coaching and careers, so a short consultation with a trade mark attorney is worth the cost before you file or print in volume.
