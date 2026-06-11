import gsap from 'gsap';

/** "Umów się" fills with magenta around the cursor. */
export function initContact(reduced) {
  const big = document.querySelector('.contact__big');
  if (!big) return;

  const text = big.querySelector('.contact__big-text');

  big.addEventListener('pointermove', (e) => {
    const r = text.getBoundingClientRect();
    text.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
    text.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
  });

  if (!reduced) {
    gsap.from(text, {
      yPercent: 60,
      autoAlpha: 0,
      duration: 1.4,
      ease: 'power4.out',
      scrollTrigger: { trigger: big, start: 'top 82%', once: true },
    });
  }
}
