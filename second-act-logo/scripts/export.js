// Second Act Advisory: export every production file from the SVG masters.
//
//   node scripts/export.js
//
// 1. Runs scripts/build_logo.py (Python: fontTools + uharfbuzz) to regenerate
//    the outlined SVG masters.
// 2. Uses headless Chromium (Playwright) to write PDFs, transparent PNGs,
//    social images, favicons, the podcast cover, the letterhead, the brand
//    guide PDF and the PNG contact sheet.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const ROOT = path.resolve(__dirname, '..');
const P = (...p) => path.join(ROOT, ...p);
const mkdir = (d) => fs.mkdirSync(d, { recursive: true });

function svgSize(svg) {
  const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  return { w: +m[1], h: +m[2] };
}

// Give the SVG an explicit pixel size so Chromium rasterises it crisply.
function sized(svg, w, h) {
  return svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${w}" height="${h}"`);
}

async function png(page, svg, outFile, width, { height, transparent = true, type = 'png' } = {}) {
  const { w, h } = svgSize(svg);
  const W = Math.round(width);
  const H = Math.round(height || (width * h) / w);
  await page.setViewportSize({ width: W, height: H });
  await page.setContent(
    `<!doctype html><style>html,body{margin:0;background:transparent}svg{display:block}</style>${sized(svg, W, H)}`
  );
  const el = await page.$('svg');
  await el.screenshot({ path: outFile, omitBackground: transparent, type, ...(type === 'jpeg' ? { quality: 92 } : {}) });
}

async function pdf(page, svg, outFile) {
  const { w, h } = svgSize(svg);
  // 1 SVG unit = 1 CSS px = 0.75 pt; the page matches the artboard exactly.
  const W = Math.ceil(w), H = Math.ceil(h);
  await page.setContent(
    `<!doctype html><style>@page{size:${W}px ${H}px;margin:0}html,body{margin:0}svg{display:block}</style>${sized(svg, W, H)}`
  );
  await page.pdf({ path: outFile, width: `${W}px`, height: `${H}px`, printBackground: true, pageRanges: '1' });
}

async function htmlToPdf(page, htmlFile, outFile) {
  await page.goto('file://' + htmlFile);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: outFile, preferCSSPageSize: true, printBackground: true });
}

// Minimal ICO writer: PNG-compressed entries (supported by all current browsers).
function writeIco(pngFiles, outFile) {
  const imgs = pngFiles.map((f) => fs.readFileSync(f));
  const header = Buffer.alloc(6 + 16 * imgs.length);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(imgs.length, 4);
  let offset = header.length;
  imgs.forEach((buf, i) => {
    const size = buf.readUInt32BE(16); // PNG IHDR width
    const e = 6 + i * 16;
    header.writeUInt8(size >= 256 ? 0 : size, e);
    header.writeUInt8(size >= 256 ? 0 : size, e + 1);
    header.writeUInt8(0, e + 2);
    header.writeUInt8(0, e + 3);
    header.writeUInt16LE(1, e + 4);
    header.writeUInt16LE(32, e + 6);
    header.writeUInt32LE(buf.length, e + 8);
    header.writeUInt32LE(offset, e + 12);
    offset += buf.length;
  });
  fs.writeFileSync(outFile, Buffer.concat([header, ...imgs]));
}

(async () => {
  console.log('1/7  building SVG masters');
  execFileSync('python3', [P('scripts', 'build_logo.py')], { stdio: 'inherit' });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const read = (f) => fs.readFileSync(f, 'utf8');

  console.log('2/7  logo PDFs and PNGs');
  mkdir(P('logo', 'pdf')); mkdir(P('logo', 'png'));
  const logos = fs.readdirSync(P('logo', 'svg')).filter((f) => f.endsWith('.svg')).sort();
  for (const f of logos) {
    const svg = read(P('logo', 'svg', f));
    const base = f.replace(/\.svg$/, '');
    await pdf(page, svg, P('logo', 'pdf', base + '.pdf'));
    for (const w of [512, 1024, 2048]) {
      await png(page, svg, P('logo', 'png', `${base}-${w}.png`), w);
    }
  }

  console.log('3/7  favicons');
  const fav = read(P('favicon', 'favicon-mark.svg'));
  const touch = read(P('favicon', 'touch-icon.svg'));
  const tmp = [];
  for (const s of [16, 32, 48]) {
    const f = P('favicon', `favicon-${s}.png`);
    await png(page, fav, f, s, { height: s });
    tmp.push(f);
  }
  writeIco(tmp, P('favicon', 'favicon.ico'));
  fs.renameSync(P('favicon', 'favicon-32.png'), P('favicon', 'favicon-32x32.png'));
  fs.unlinkSync(P('favicon', 'favicon-16.png'));
  fs.unlinkSync(P('favicon', 'favicon-48.png'));
  fs.copyFileSync(P('favicon', 'favicon-mark.svg'), P('favicon', 'favicon.svg'));
  await png(page, touch, P('favicon', 'apple-touch-icon.png'), 180, { transparent: false });
  await png(page, touch, P('favicon', 'icon-512.png'), 512, { transparent: false });

  console.log('4/7  social');
  const social = {
    'instagram/instagram-avatar-320': 320,
    'instagram/instagram-avatar-320-cream': 320,
    'instagram/instagram-footer-lockup-cream': 480,
    'instagram/instagram-footer-lockup-burgundy': 480,
    'facebook/facebook-avatar-320': 320,
    'facebook/facebook-cover-1640x624': 1640,
    'linkedin/linkedin-logo-400': 400,
    'linkedin/linkedin-banner-1128x191': 1128,
  };
  for (const [name, w] of Object.entries(social)) {
    const svg = read(P('social', name + '.svg'));
    const transparent = name.includes('footer');
    await png(page, svg, P('social', name + '.png'), w, { transparent });
  }

  console.log('5/7  podcast cover and email signature');
  const pod = read(P('podcast', 'already-qualified-cover-3000.svg'));
  await png(page, pod, P('podcast', 'already-qualified-cover-3000.png'), 3000, { transparent: false });
  await png(page, pod, P('podcast', 'already-qualified-cover-3000.jpg'), 3000, { transparent: false, type: 'jpeg' });
  const sig = read(P('stationery', 'email-signature.svg'));
  await png(page, sig, P('stationery', 'email-signature-600.png'), 600);

  console.log('6/7  letterhead and brand guide PDFs');
  await htmlToPdf(page, P('stationery', 'letterhead.html'), P('stationery', 'letterhead-a4.pdf'));
  await htmlToPdf(page, P('brand-guide', 'index.html'), P('brand-guide', 'second-act-advisory-brand-guide.pdf'));

  console.log('7/7  contact sheet');
  const pngs = [];
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).forEach((e) => {
    const f = path.join(d, e.name);
    if (e.isDirectory()) walk(f);
    else if (/\.(png|jpg)$/.test(e.name)) pngs.push(path.relative(P('logo'), f));
  });
  ['logo/png', 'favicon', 'social', 'podcast', 'stationery'].forEach((d) => walk(P(d)));
  const cells = pngs.sort().map((f) => {
    const dark = /-white-|footer-lockup-cream/.test(f);
    return `<figure class="${dark ? 'dk' : ''}"><div><img src="${f}"></div><figcaption>${path.basename(f)}</figcaption></figure>`;
  }).join('');
  fs.writeFileSync(P('logo', 'contact-sheet.html'), `<!doctype html><meta charset="utf-8"><title>Contact sheet</title>
<style>body{margin:0;padding:24px;background:#fff;font:10px/1.3 sans-serif;color:#555;display:grid;grid-template-columns:repeat(8,1fr);gap:12px}
figure{margin:0}figure div{height:130px;display:flex;align-items:center;justify-content:center;padding:8px;
background:repeating-conic-gradient(#e9e4de 0 25%,#fbf9f6 0 50%) 0 0/14px 14px;border:1px solid #ddd}
figure.dk div{background:repeating-conic-gradient(#3a2b2d 0 25%,#4a3739 0 50%) 0 0/14px 14px}
img{max-width:100%;max-height:100%}figcaption{margin-top:4px;word-break:break-all}</style>${cells}`);
  await page.setViewportSize({ width: 1800, height: 1000 });
  await page.goto('file://' + P('logo', 'contact-sheet.html'));
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: P('logo', 'contact-sheet.png'), fullPage: true });

  await browser.close();
  console.log(`done: ${logos.length} logo SVGs -> PDF + 3 PNG sizes each, ${pngs.length} raster files on the contact sheet`);
})();
