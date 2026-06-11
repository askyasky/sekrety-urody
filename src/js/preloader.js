import gsap from 'gsap';
import { heroIntro } from './hero.js';

export function initPreloader(reduced) {
  const pre = document.querySelector('.preloader');
  const seen = sessionStorage.getItem('su-intro-seen');

  if (seen || reduced) {
    pre.remove();
    if (!reduced) {
      // still play the hero entrance, just without the curtain
      heroIntro(reduced);
    }
    return;
  }

  sessionStorage.setItem('su-intro-seen', '1');
  document.documentElement.style.overflow = 'hidden';

  const logo = pre.querySelector('.preloader__logo');

  gsap.set(logo, { autoAlpha: 0, scale: 0.94 });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    onComplete: () => {
      pre.remove();
      document.documentElement.style.overflow = '';
    },
  });

  tl.to(logo, { autoAlpha: 1, scale: 1, duration: 0.8 })
    .to('.preloader__center', { autoAlpha: 0, scale: 0.96, duration: 0.55, delay: 0.55 })
    .to('.preloader__panel--left', { xPercent: -101, duration: 1.05, ease: 'power4.inOut' }, '<+0.15')
    .to('.preloader__panel--right', { xPercent: 101, duration: 1.05, ease: 'power4.inOut' }, '<')
    .add(() => heroIntro(false), '-=0.55');
}
