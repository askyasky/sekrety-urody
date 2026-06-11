import gsap from 'gsap';

/** Columns drift at different speeds for a layered parallax. */
export function initGallery(reduced) {
  const section = document.querySelector('.gallery');
  if (!section || reduced) return;

  section.querySelectorAll('.gallery__col').forEach((col) => {
    const speed = Number(col.dataset.speed || -60);
    gsap.fromTo(col, { y: -speed }, {
      y: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.8,
      },
    });
  });

  // items reveal on first entry
  gsap.from(section.querySelectorAll('.gallery__item'), {
    clipPath: 'inset(100% 0 0 0)',
    duration: 1.2,
    stagger: 0.1,
    ease: 'power4.out',
    scrollTrigger: { trigger: section, start: 'top 70%', once: true },
  });
}
