// Custom cursor — sharp dot + slow ring with magnetic snap.
// Hides native cursor and renders #cursor-dot / #cursor-ring via rAF + lerp.
// On hover над a/button/[data-cursor="snap"] — dot snaps to center, ring grows to bounds.
// Touch / reduced-motion / JS-disabled — graceful fallback to native.

const HOVER_DEVICE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (HOVER_DEVICE) {
  const DOT_K = REDUCED_MOTION ? 1 : 0.85;
  const RING_K = REDUCED_MOTION ? 1 : 0.15;
  const RING_PADDING = 12;
  const SNAP_SELECTOR = 'a, button, [data-cursor="snap"]';

  const init = (): void => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    document.body.classList.add('has-custom-cursor');

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let dotX = mouseX;
    let dotY = mouseY;
    let ringX = mouseX;
    let ringY = mouseY;
    let snapTarget: HTMLElement | null = null;

    document.addEventListener('mousemove', (e: MouseEvent) => {
      if (!snapTarget) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    });

    const targets = document.querySelectorAll<HTMLElement>(SNAP_SELECTOR);
    targets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        snapTarget = target;
        const rect = target.getBoundingClientRect();
        mouseX = rect.left + rect.width / 2;
        mouseY = rect.top + rect.height / 2;
        ring.style.width = `${rect.width + RING_PADDING}px`;
        ring.style.height = `${rect.height + RING_PADDING}px`;
        ring.style.borderRadius = '8px';
      });
      target.addEventListener('mouseleave', () => {
        snapTarget = null;
        ring.style.width = '';
        ring.style.height = '';
        ring.style.borderRadius = '';
      });
    });

    const frame = (): void => {
      dotX += (mouseX - dotX) * DOT_K;
      dotY += (mouseY - dotY) * DOT_K;
      ringX += (mouseX - ringX) * RING_K;
      ringY += (mouseY - ringY) * RING_K;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
