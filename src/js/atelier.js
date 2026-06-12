import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

/**
 * Portfolio works. To add a photo: drop the file in public/assets/galeria
 * (or /uslugi) and add one entry here — category does the rest.
 */
const WORKS = [
  { src: '/assets/galeria/01.jpg', cat: 'paznokcie', catLabel: 'Paznokcie', label: 'manicure hybrydowy', w: 900, h: 1150 },
  { src: '/assets/uslugi/02.jpg', cat: 'brwi', catLabel: 'Brwi', label: 'henna i regulacja', w: 900, h: 1100 },
  { src: '/assets/galeria/04.jpg', cat: 'makijaz', catLabel: 'Makijaż', label: 'makijaż wieczorowy', w: 900, h: 880 },
  { src: '/assets/galeria/03.jpg', cat: 'twarz', catLabel: 'Twarz', label: 'zabieg na twarz', w: 900, h: 1000 },
  { src: '/assets/galeria/05.jpg', cat: 'paznokcie', catLabel: 'Paznokcie', label: 'pedicure hybrydowy', w: 900, h: 1200 },
  { src: '/assets/uslugi/06.jpg', cat: 'depilacja', catLabel: 'Depilacja', label: 'depilacja woskiem', w: 900, h: 1100 },
  { src: '/assets/galeria/02.jpg', cat: 'brwi', catLabel: 'Brwi', label: 'architektura brwi', w: 900, h: 800 },
  { src: '/assets/uslugi/03.jpg', cat: 'makijaz', catLabel: 'Makijaż', label: 'makijaż dzienny', w: 900, h: 1100 },
  { src: '/assets/galeria/06.jpg', cat: 'paznokcie', catLabel: 'Paznokcie', label: 'przedłużanie żelem', w: 900, h: 760 },
  { src: '/assets/uslugi/04.jpg', cat: 'twarz', catLabel: 'Twarz', label: 'zabieg Theo Marvee', w: 900, h: 1100 },
  { src: '/assets/uslugi/01.jpg', cat: 'paznokcie', catLabel: 'Paznokcie', label: 'stylizacja klasyczna', w: 900, h: 1100 },
  { src: '/assets/uslugi/05.jpg', cat: 'twarz', catLabel: 'Twarz', label: 'oczyszczanie wodorowe', w: 900, h: 1100 },
];

export function initAtelier(reduced) {
  const grid = document.querySelector('.atelier__grid');
  if (!grid) return;

  grid.innerHTML = WORKS.map((w) => `
    <figure class="atelier__item" data-cat="${w.cat}">
      <div class="atelier__media" style="aspect-ratio: ${w.w} / ${w.h}">
        <img src="${w.src}" alt="${w.label} — Sekrety Urody" loading="lazy" width="${w.w}" height="${w.h}" />
      </div>
      <figcaption class="atelier__cap">
        <span class="atelier__cap-label">${w.label}</span>
        <span class="atelier__cap-cat">${w.catLabel}</span>
      </figcaption>
    </figure>`).join('');

  const filters = gsap.utils.toArray('.atelier__filter');
  const countEl = document.querySelector('.atelier__count-num');
  const items = () => gsap.utils.toArray('.atelier__item');

  const setCount = (cat) => {
    if (!countEl) return;
    const n = WORKS.filter((w) => cat === 'all' || w.cat === cat).length;
    countEl.textContent = String(n).padStart(2, '0');
  };
  setCount('all');

  if (reduced) {
    bindFilters((cat) => {
      items().forEach((it) => it.classList.toggle('is-hidden', !(cat === 'all' || it.dataset.cat === cat)));
      setCount(cat);
    });
    return;
  }

  // header intro — delayed when arriving under the curtain so it plays on reveal
  const underCurtain = document.documentElement.classList.contains('transitioning');
  gsap.from('.atelier__kicker, .atelier__title, .atelier__intro, .atelier__bar', {
    y: 28, autoAlpha: 0, duration: 1, stagger: 0.08, ease: 'power4.out',
    delay: underCurtain ? 0.55 : 0.1,
  });

  // grid reveals as it scrolls into view
  gsap.set('.atelier__item', { autoAlpha: 0, yPercent: 6, clipPath: 'inset(100% 0 0 0)' });
  ScrollTrigger.batch('.atelier__item', {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.to(batch, {
      autoAlpha: 1, yPercent: 0, clipPath: 'inset(0% 0 0 0)',
      duration: 1, stagger: 0.08, ease: 'power4.out', overwrite: true,
    }),
  });

  bindFilters((cat) => {
    const all = items();
    const state = Flip.getState(all);
    all.forEach((it) => it.classList.toggle('is-hidden', !(cat === 'all' || it.dataset.cat === cat)));
    Flip.from(state, {
      duration: 0.7,
      ease: 'power3.inOut',
      scale: true,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.4, ease: 'power2.in' }),
      onComplete: () => ScrollTrigger.refresh(),
    });
    setCount(cat);
  });

  function bindFilters(apply) {
    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.classList.contains('is-active')) return;
        filters.forEach((f) => f.classList.toggle('is-active', f === btn));
        apply(btn.dataset.filter);
      });
    });
  }
}
