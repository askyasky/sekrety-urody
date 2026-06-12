import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import { initCursor } from './cursor.js';
import { initMagnetic } from './magnetic.js';
import { initNav } from './nav.js';
import { initTransition } from './transition.js';
import { initAtelier } from './atelier.js';

gsap.registerPlugin(ScrollTrigger, Flip);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis = null;
if (!reduced) {
  lenis = new Lenis({ autoRaf: false, lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;
}

initCursor();
initMagnetic();
initNav();
initTransition();
initAtelier(reduced);

document.fonts.ready.then(() => ScrollTrigger.refresh());
