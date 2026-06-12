import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initCursor } from './cursor.js';
import { initPreloader } from './preloader.js';
import { initHero } from './hero.js';
import { initMagnetic } from './magnetic.js';
import { initReveals } from './reveal.js';
import { initManifest } from './manifest.js';
import { initServices } from './services.js';
import { initPricing } from './pricing.js';
import { initGallery } from './gallery.js';
import { initContact } from './contact.js';
import { initNav } from './nav.js';
import { initTransition } from './transition.js';

gsap.registerPlugin(ScrollTrigger);

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduced) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis; // used by self-test screenshots
}

initCursor();
initMagnetic();
initNav();
initTransition();
initHero(reduced);
initPreloader(reduced);
initReveals(reduced);
initManifest(reduced);
initServices(reduced);
initPricing(reduced);
initGallery(reduced);
initContact(reduced);

// re-measure pinned sections once webfonts settle
document.fonts.ready.then(() => ScrollTrigger.refresh());

// anchor links through lenis
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(target, { offset: 0 });
    else target.scrollIntoView();
  });
});
