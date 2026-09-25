// Render a local HTML file to PNG (or PDF) with headless Chromium.
// Usage: node scripts/render-html.js <in.html> <out.png|out.pdf> [width] [height] [scale]
const path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); }
catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

(async () => {
  const [inFile, outFile, w = '1600', h = '1000', scale = '1'] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: +w, height: +h },
    deviceScaleFactor: +scale,
  });
  await page.goto('file://' + path.resolve(inFile));
  await page.evaluate(() => document.fonts.ready);
  if (outFile.endsWith('.pdf')) {
    await page.pdf({ path: outFile, preferCSSPageSize: true, printBackground: true });
  } else {
    await page.screenshot({ path: outFile, fullPage: true });
  }
  await browser.close();
})();
