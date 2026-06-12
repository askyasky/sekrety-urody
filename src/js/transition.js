import gsap from 'gsap';

const FLAG = 'su-page-transition';

/**
 * Page-to-page curtain. Reuses the preloader's two-panel vocabulary so moving
 * between home and the gallery feels like one continuous piece, not a reload.
 *
 * OUT: intercept cross-page links, slide panels in to cover, then navigate.
 * IN:  the incoming page renders already covered (class set pre-paint by the
 *      inline head script), then we slide the panels away to reveal it.
 */
export function initTransition() {
  const overlay = document.querySelector('.page-transition');
  if (!overlay) return;

  const left = overlay.querySelector('.page-transition__panel--left');
  const right = overlay.querySelector('.page-transition__panel--right');
  const mark = overlay.querySelector('.page-transition__mark');
  const root = document.documentElement;

  if (root.classList.contains('transitioning')) {
    sessionStorage.removeItem(FLAG);
    gsap.set([left, right], { xPercent: 0 });
    gsap.set(mark, { autoAlpha: 1 });
    gsap.timeline({
      onComplete: () => {
        root.classList.remove('transitioning');
        overlay.style.visibility = 'hidden';
      },
    })
      .to(mark, { autoAlpha: 0, duration: 0.35, ease: 'power2.out' }, 0)
      .to(left, { xPercent: -101, duration: 0.9, ease: 'power4.inOut' }, 0.12)
      .to(right, { xPercent: 101, duration: 0.9, ease: 'power4.inOut' }, '<');
  } else {
    overlay.style.visibility = 'hidden';
  }

  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;

    let url;
    try { url = new URL(a.href, location.href); } catch { return; }
    if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname) return; // same page — let it be

    e.preventDefault();
    playOut(url.href);
  });

  function playOut(dest) {
    overlay.style.visibility = 'visible';
    overlay.style.pointerEvents = 'all';
    gsap.set(left, { xPercent: -101 });
    gsap.set(right, { xPercent: 101 });
    gsap.set(mark, { autoAlpha: 0, scale: 0.92 });
    sessionStorage.setItem(FLAG, '1');

    gsap.timeline({ onComplete: () => { window.location.href = dest; } })
      .to(left, { xPercent: 0, duration: 0.7, ease: 'power4.inOut' }, 0)
      .to(right, { xPercent: 0, duration: 0.7, ease: 'power4.inOut' }, '<')
      .to(mark, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power2.out' }, '-=0.4');
  }
}
