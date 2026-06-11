// Drive Lighthouse through a Playwright-launched Chromium (chrome-launcher can't
// spawn in this sandbox). Targets the dev server, which is reachable here.
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import { writeFileSync } from 'node:fs';

const URL = process.argv[2] || 'http://localhost:5173/';
const PORT = 9333;

const browser = await chromium.launch({
  args: [`--remote-debugging-port=${PORT}`, '--no-sandbox'],
});

// warm the page so the dev server has compiled everything
const page = await browser.newPage();
await page.addInitScript(() => sessionStorage.setItem('su-intro-seen', '1'));
await page.goto(URL, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.close();

const result = await lighthouse(URL, {
  port: PORT,
  output: ['json', 'html'],
  logLevel: 'error',
  formFactor: 'desktop',
  screenEmulation: { disabled: true },
  throttlingMethod: 'simulate',
  onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
});

writeFileSync('shots/lh.html', result.report[1]);
writeFileSync('shots/lh.json', result.report[0]);

const c = result.lhr.categories;
console.log('Performance    ', Math.round(c.performance.score * 100));
console.log('Accessibility  ', Math.round(c.accessibility.score * 100));
console.log('Best Practices ', Math.round(c['best-practices'].score * 100));
console.log('SEO            ', Math.round(c.seo.score * 100));

const a = result.lhr.audits;
const metric = (k) => a[k] ? a[k].displayValue : 'n/a';
console.log('---');
console.log('FCP', metric('first-contentful-paint'), '| LCP', metric('largest-contentful-paint'),
  '| TBT', metric('total-blocking-time'), '| CLS', metric('cumulative-layout-shift'),
  '| SI', metric('speed-index'));

// surface the biggest opportunities / a11y failures
const fails = Object.values(a).filter(x => x.score !== null && x.score < 0.9 &&
  ['accessibility', 'seo', 'best-practices'].some(() => true) && x.scoreDisplayMode !== 'informative');
console.log('--- notable audits below 0.9 ---');
for (const f of fails.slice(0, 25)) console.log(`[${f.score}] ${f.id}: ${f.title}`);

await browser.close();
