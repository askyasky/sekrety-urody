import gsap from 'gsap';

export function initCursor() {
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduced) return;

  document.body.classList.add('has-cursor');

  const cursor = document.querySelector('.cursor');
  const glow = document.querySelector('.cursor-glow');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');

  const dotX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
  const dotY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
  const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
  const glowX = gsap.quickTo(glow, 'x', { duration: 0.6, ease: 'power3.out' });
  const glowY = gsap.quickTo(glow, 'y', { duration: 0.6, ease: 'power3.out' });

  window.addEventListener('pointermove', (e) => {
    dotX(e.clientX); dotY(e.clientY);
    ringX(e.clientX); ringY(e.clientY);
    glowX(e.clientX); glowY(e.clientY);
  }, { passive: true });

  // grow + label over interactive elements
  const interactive = 'a, button, [data-cursor]';
  document.addEventListener('pointerover', (e) => {
    if (e.target.closest(interactive)) cursor.classList.add('is-hover');
  });
  document.addEventListener('pointerout', (e) => {
    if (e.target.closest(interactive)) cursor.classList.remove('is-hover');
  });
}
