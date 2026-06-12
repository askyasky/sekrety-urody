import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

/**
 * Portfolio works are auto-discovered from src/assets/portfolio/<kategoria>/.
 * To add a photo: drop a .jpg/.png/.webp into the right category folder and
 * redeploy — no code change needed. Vite bundles whatever is in there.
 */
const FILES = import.meta.glob(
  '../assets/portfolio/**/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, query: '?url', import: 'default' }
);

const CATEGORIES = {
  paznokcie: 'Paznokcie',
  brwi: 'Brwi',
  makijaz: 'Makijaż',
};

function buildWorks() {
  return Object.entries(FILES)
    .map(([path, src]) => {
      const cat = (path.match(/portfolio\/([^/]+)\//) || [])[1];
      return { src, cat, catLabel: CATEGORIES[cat] };
    })
    .filter((w) => w.catLabel);
}

export function initAtelier(reduced) {
  const grid = document.querySelector('.atelier__grid');
  if (!grid) return;

  const works = buildWorks();
  const countEl = document.querySelector('.atelier__count-num');

  if (!works.length) {
    grid.classList.add('atelier__grid--empty');
    grid.innerHTML = '<p class="atelier__empty">Galeria w przygotowaniu — pierwsze prace pojawią się już wkrótce.</p>';
    if (countEl) countEl.textContent = '0';
    return;
  }

  grid.innerHTML = works.map((w) => `
    <figure class="atelier__item" data-cat="${w.cat}">
      <div class="atelier__media">
        <img src="${w.src}" alt="${w.catLabel} — Sekrety Urody" loading="lazy" />
      </div>
      <figcaption class="atelier__cap"><span class="atelier__cap-cat">${w.catLabel}</span></figcaption>
    </figure>`).join('');

  const filters = gsap.utils.toArray('.atelier__filter');
  const items = () => gsap.utils.toArray('.atelier__item');

  const setCount = (cat) => {
    if (!countEl) return;
    const n = works.filter((w) => cat === 'all' || w.cat === cat).length;
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

  // images have no known dimensions — recalc trigger positions once they load
  refreshOnImagesLoaded(grid);

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

function refreshOnImagesLoaded(grid) {
  const imgs = [...grid.querySelectorAll('img')];
  let pending = imgs.length;
  if (!pending) return;
  const done = () => { if (--pending <= 0) ScrollTrigger.refresh(); };
  imgs.forEach((img) => {
    if (img.complete) done();
    else {
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }
  });
}
