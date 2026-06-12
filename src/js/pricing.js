import gsap from 'gsap';

const DATA = [
  {
    cat: 'Manicure / Pedicure',
    items: [
      ['Klasyczny', '75 / 120 zł'],
      ['Z odżywką', '80 / 125 zł'],
      ['Z malowaniem', '90 / 140 zł'],
      ['Hybrydowy — krótkie', '130 zł'],
      ['Hybrydowy — długie', '140 zł'],
      ['Pedicure hybrydowy', '180 zł'],
      ['Manicure stóp z malowaniem', '120 zł'],
      ['Manicure stóp hybrydowy', '140 zł'],
      ['Uzupełnienie żelem — krótkie', '150 zł'],
      ['Uzupełnienie żelem — długie', '180 zł'],
      ['Żel na naturalnej płytce', '160 zł'],
      ['Przedłużenie — krótkie', '190 zł'],
      ['Przedłużenie — długie', '200 zł'],
    ],
  },
  {
    cat: 'Henna',
    items: [
      ['Brwi + regulacja', '60 zł'],
      ['Rzęsy', '40 zł'],
      ['Brwi + rzęsy + regulacja', '80 zł'],
      ['Regulacja', '30 zł'],
    ],
  },
  {
    cat: 'Makijaż',
    items: [
      ['Dzienny', '130 zł'],
      ['Wieczorowy', '150 zł'],
    ],
  },
  {
    cat: 'Zabiegi Theo Marvee',
    items: [
      ['Ferulage', '240 zł'],
      ['Shikimic', '230 zł'],
      ['Epigenial', '220 zł'],
      ['Gravity', '240 zł'],
      ['RH+', '250 zł'],
    ],
  },
  {
    cat: 'Zabiegi na twarz',
    note: 'serum + maska w cenie',
    items: [
      ['Kawitacja', '220 zł'],
      ['Mikrodermabrazja', '240 zł'],
      ['Oczyszczanie', '250 zł'],
    ],
  },
  {
    cat: 'Depilacja woskiem',
    items: [
      ['Wąsik', '25 zł'],
      ['Broda + wąsik', '40 zł'],
      ['Broda + żuchwa', '60 zł'],
      ['Baczki', '30 zł'],
      ['Całość', '100 zł'],
      ['Pachy', '70 zł'],
    ],
  },
];

export function initPricing(reduced) {
  const list = document.querySelector('.pricing__list');
  if (!list) return;

  DATA.forEach((group, gi) => {
    const id = 'cennik-panel-' + gi;
    const cat = document.createElement('div');
    cat.className = 'pricing-cat';
    cat.innerHTML = `
      <h3 class="pricing-cat__heading">
        <button class="pricing-cat__toggle" aria-expanded="${gi === 0}" aria-controls="${id}" data-cursor>
          <span class="pricing-cat__index">0${gi + 1}</span>
          <span class="pricing-cat__name">${group.cat}</span>
          ${group.note ? `<span class="pricing-cat__note">${group.note}</span>` : ''}
          <span class="pricing-cat__icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div class="pricing-cat__panel" id="${id}" role="region" aria-label="${group.cat}">
        <ul class="pricing-cat__items">
          ${group.items.map(([name, price]) => `
            <li class="price-row">
              <span class="price-row__name">${name}</span>
              <span class="price-row__dots" aria-hidden="true"></span>
              <span class="price-row__val">${price}</span>
            </li>`).join('')}
        </ul>
      </div>`;
    list.appendChild(cat);
  });

  list.querySelectorAll('.pricing-cat').forEach((cat, gi) => {
    const btn = cat.querySelector('.pricing-cat__toggle');
    const panel = cat.querySelector('.pricing-cat__panel');
    const open = gi === 0;
    cat.classList.toggle('is-open', open);
    gsap.set(panel, { height: open ? 'auto' : 0 });

    btn.addEventListener('click', () => {
      const willOpen = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(willOpen));
      cat.classList.toggle('is-open', willOpen);
      if (reduced) {
        gsap.set(panel, { height: willOpen ? 'auto' : 0 });
        return;
      }
      if (willOpen) {
        gsap.to(panel, { height: 'auto', duration: 0.7, ease: 'power3.inOut' });
        gsap.fromTo(panel.querySelectorAll('.price-row'),
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.025, delay: 0.15, ease: 'power2.out' });
      } else {
        gsap.to(panel, { height: 0, duration: 0.55, ease: 'power3.inOut' });
      }
    });
  });
}
