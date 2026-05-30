// Custom cursor — sharp dot + slow ring with rAF lerp.
// Hides native cursor and renders #cursor-dot / #cursor-ring via rAF + lerp.
// Touch / reduced-motion / JS-disabled — graceful fallback to native.

const HOVER_DEVICE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (HOVER_DEVICE) {
  const DOT_K = REDUCED_MOTION ? 1 : 0.85;
  const RING_K = REDUCED_MOTION ? 1 : 0.15;

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

    document.addEventListener('mousemove', (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
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
