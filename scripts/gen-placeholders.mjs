// Generates elegant dark gradient placeholder JPGs (owner will replace with real photos).
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

mkdirSync('public/assets/uslugi', { recursive: true });
mkdirSync('public/assets/galeria', { recursive: true });

const services = [
  { n: '01', name: 'Manicure', hue: 'radial-gradient(140% 110% at 20% 15%, #3a1030 0%, #1a0c16 55%, #0F0A0E 100%)' },
  { n: '02', name: 'Henna', hue: 'radial-gradient(140% 110% at 80% 20%, #2c1426 0%, #160d14 55%, #0F0A0E 100%)' },
  { n: '03', name: 'Makijaż', hue: 'radial-gradient(130% 120% at 30% 80%, #401034 0%, #1c0c18 60%, #0F0A0E 100%)' },
  { n: '04', name: 'Peelingi', hue: 'radial-gradient(150% 100% at 70% 75%, #33152c 0%, #170d14 55%, #0F0A0E 100%)' },
  { n: '05', name: 'Zabiegi', hue: 'radial-gradient(120% 130% at 25% 30%, #3d1230 0%, #190c15 60%, #0F0A0E 100%)' },
  { n: '06', name: 'Depilacja', hue: 'radial-gradient(140% 110% at 75% 30%, #2e1228 0%, #150c13 55%, #0F0A0E 100%)' },
];

const galeria = [
  { n: '01', w: 900, h: 1150 }, { n: '02', w: 900, h: 800 }, { n: '03', w: 900, h: 1000 },
  { n: '04', w: 900, h: 880 }, { n: '05', w: 900, h: 1200 }, { n: '06', w: 900, h: 760 },
];

const page = await (await chromium.launch()).newPage();

const frame = (inner, w, h) => `<!doctype html><html><head>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..600;1,9..144,300..600&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; }
    .ph { width: ${w}px; height: ${h}px; position: relative; overflow: hidden; font-family: 'Fraunces', serif; }
    .num { position: absolute; right: -0.06em; bottom: -0.22em; font-size: ${Math.round(h * 0.5)}px;
           font-style: italic; font-weight: 300; color: rgba(239, 230, 216, 0.07); line-height: 1; }
    .tag { position: absolute; left: 7%; top: 7%; font-size: ${Math.round(h * 0.034)}px; letter-spacing: 0.4em;
           text-transform: uppercase; color: rgba(232, 168, 200, 0.4); }
    .line { position: absolute; left: 7%; top: 12.5%; width: 14%; height: 1px; background: rgba(196, 6, 126, 0.55); }
    .grain { position: absolute; inset: 0; opacity: 0.5;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
    }
  </style></head><body>${inner}</body></html>`;

for (const s of services) {
  await page.setViewportSize({ width: 900, height: 1100 });
  await page.setContent(frame(
    `<div class="ph" style="background:${s.hue}"><div class="grain"></div><span class="tag">zdjęcie pracy</span><div class="line"></div><span class="num">${s.n}</span></div>`,
    900, 1100), { waitUntil: 'networkidle' });
  await page.locator('.ph').screenshot({ path: `public/assets/uslugi/${s.n}.jpg`, type: 'jpeg', quality: 82 });
  console.log('uslugi/' + s.n + '.jpg');
}

for (const g of galeria) {
  await page.setViewportSize({ width: g.w, height: g.h });
  const hue = services[(Number(g.n) - 1) % 6].hue;
  await page.setContent(frame(
    `<div class="ph" style="background:${hue}"><div class="grain"></div><span class="tag">galeria</span><div class="line"></div><span class="num">${g.n}</span></div>`,
    g.w, g.h), { waitUntil: 'networkidle' });
  await page.locator('.ph').screenshot({ path: `public/assets/galeria/${g.n}.jpg`, type: 'jpeg', quality: 82 });
  console.log('galeria/' + g.n + '.jpg');
}

await page.context().browser().close();
