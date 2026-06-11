import gsap from 'gsap';
import { splitWords } from './split.js';

/** The manifest sentence lights up word by word while scrolling. */
export function initManifest(reduced) {
  const el = document.querySelector('[data-manifest]');
  if (!el) return;

  // portrait slides out from the right edge as the section enters
  const portrait = document.querySelector('.manifest__portrait');
  if (portrait) {
    if (reduced) {
      gsap.set(portrait, { clipPath: 'inset(0 0 0 25%)' });
    } else {
      gsap.to(portrait, {
        clipPath: 'inset(0 0 0 25%)',
        ease: 'none',
        scrollTrigger: {
          trigger: '.manifest',
          start: 'top 80%',
          end: 'center center',
          scrub: 0.6,
        },
      });
    }
  }

  if (reduced) return; // keep plain champagne text

  const words = splitWords(el);
  gsap.to(words, {
    color: '#EFE6D8',
    stagger: 0.06,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top 78%',
      end: 'bottom 42%',
      scrub: 0.4,
    },
  });
}
