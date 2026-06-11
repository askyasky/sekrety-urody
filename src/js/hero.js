import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { splitChars } from './split.js';

export function initHero(reduced) {
  const canvas = document.querySelector('.hero__canvas');

  if (!reduced) {
    // shader only on capable GPUs; CSS gradient stays as fallback
    import('./silk.js').then(({ initSilk }) => initSilk(canvas))
      .catch(() => canvas.remove());
  } else {
    canvas.remove();
  }

  // split hero words into chars, hide below their line masks
  const words = document.querySelectorAll('.hero__word');
  const allChars = [];
  words.forEach((w) => allChars.push(...splitChars(w)));

  if (!reduced) {
    gsap.set(allChars, { yPercent: 110, rotate: 3 });
    gsap.set(['.hero__kicker', '.hero__cta', '.hero__bar', '.nav'], { autoAlpha: 0, y: 24 });
    gsap.set('.hero__hand-wrap', { yPercent: 120 });

    // hand drifts down slowly as you scroll past the hero
    gsap.to('.hero__hand-wrap', {
      y: () => window.innerHeight * 0.2,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true },
    });
  }
}

/** Hero entrance — called by the preloader once the curtain opens. */
export function heroIntro(reduced) {
  if (reduced) return;
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero__word .char', { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.08 })
    .to('.hero__kicker', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.7')
    .to('.hero__cta', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.6')
    .to(['.hero__bar', '.nav'], { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.55')
    // hand rises subtly into the right corner, 1.4s in
    .to('.hero__hand-wrap', { yPercent: 0, duration: 1.4, ease: 'power3.out' }, 1.4);
  return tl;
}
