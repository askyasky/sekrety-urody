// Open Graph image 1200x630
import { chromium } from 'playwright';

const page = await (await chromium.launch()).newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(`<!doctype html><html><head>
<link href="https://fonts.googleapis.com/css2?family=Figtree:wght@400&family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&display=swap" rel="stylesheet">
<style>
  * { margin: 0; }
  body { width: 1200px; height: 630px; display: grid; place-items: center; font-family: 'Fraunces', serif;
    background: radial-gradient(120% 130% at 80% 0%, #471038 0%, #1c0c18 52%, #0F0A0E 100%); color: #EFE6D8; }
  .in { text-align: center; }
  h1 { font-size: 110px; font-weight: 340; line-height: 1; letter-spacing: -0.01em; }
  h1 em { font-weight: 320; }
  .sub { margin-top: 28px; font-family: 'Figtree', sans-serif; font-size: 22px; letter-spacing: 0.32em;
    text-transform: uppercase; color: rgba(239, 230, 216, 0.72); }
  .tel { margin-top: 18px; font-style: italic; font-size: 30px; color: #E8A8C8; }
  .rule { width: 64px; height: 2px; background: #C4067E; margin: 30px auto 0; }
</style></head><body>
  <div class="in">
    <h1>Sekrety <em>Urody</em></h1>
    <div class="sub">Studio Kosmetyczne · Bełchatów</div>
    <div class="rule"></div>
    <div class="tel">577 707 455 · Piłsudskiego 15</div>
  </div>
</body></html>`, { waitUntil: 'networkidle' });
await page.screenshot({ path: 'public/assets/og.jpg', type: 'jpeg', quality: 88 });
await page.context().browser().close();
console.log('og.jpg done');
