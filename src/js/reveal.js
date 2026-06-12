import gsap from 'gsap';

/** Curtain-style mask reveal for [data-reveal] elements. */
export function initReveals(reduced) {
  if (reduced) return;
  document.querySelectorAll('[data-reveal]').forEach((el) => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 0 100% 0)', y: 36 },
      {
        clipPath: 'inset(0 0 -35% 0)', y: 0,
        duration: 1.15,
        ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      });
  });
}
