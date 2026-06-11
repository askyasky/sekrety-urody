// Self-review screenshot helper.
// node scripts/shot.mjs --out shots/hero.png [--w 1440] [--h 900] [--scroll "#cennik"]
//   [--preloader] (keep the intro; default skips it) [--wait 2200] [--hover "selector"]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const arg = (name, def) => {
  const i = process.argv.indexOf('--' + name);
  return i > -1 ? (process.argv[i + 1]?.startsWith('--') || !process.argv[i + 1] ? true : process.argv[i + 1]) : def;
};

const out = arg('out', 'shots/shot.png');
const w = Number(arg('w', 1440));
const h = Number(arg('h', 900));
const scroll = arg('scroll', null);
const scrollY = arg('scrollY', null);
const keepPreloader = arg('preloader', false);
const wait = Number(arg('wait', 2400));
const hover = arg('hover', null);

mkdirSync(dirname(out), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
if (!keepPreloader) {
  await page.addInitScript(() => sessionStorage.setItem('su-intro-seen', '1'));
}
await page.goto('http://localhost:5173/', { waitUntil: keepPreloader ? 'domcontentloaded' : 'networkidle' });

const offset = Number(arg('offset', 0));
if (scroll || scrollY !== null) {
  await page.evaluate(({ scroll, scrollY, offset }) => {
    const y = (scroll
      ? document.querySelector(scroll).getBoundingClientRect().top + window.scrollY
      : Number(scrollY)) + offset;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  }, { scroll, scrollY, offset });
}

if (hover) await page.hover(hover);
await page.waitForTimeout(wait);
await page.screenshot({ path: out });
await browser.close();
console.log('saved', out);
