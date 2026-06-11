import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/** Pinned horizontal gallery (desktop) / native swipe carousel (mobile). */
export function initServices(reduced) {
  const section = document.querySelector('.services');
  if (!section) return;

  // RGB-split hover ghosts
  section.querySelectorAll('.service-card__media img').forEach((img) => {
    const ghost = img.cloneNode();
    ghost.classList.add('service-card__ghost');
    ghost.setAttribute('alt', '');
    ghost.setAttribute('aria-hidden', 'true');
    img.after(ghost);
  });

  const small = window.matchMedia('(max-width: 860px)').matches;
  if (reduced || small) return;

  const track = section.querySelector('.services__track');
  const head = section.querySelector('.services__head');

  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 15%',
      end: () => '+=' + (track.scrollWidth - window.innerWidth),
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });

  // cards drift in with a slight stagger as the section pins
  gsap.from(section.querySelectorAll('.service-card'), {
    x: 90,
    autoAlpha: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: 'power3.out',
    scrollTrigger: { trigger: section, start: 'top 65%', once: true },
  });

  ScrollTrigger.refresh();
}
