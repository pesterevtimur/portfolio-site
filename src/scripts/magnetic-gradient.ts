// Magnetic gradient hover.
// Hooks into elements with data-magnetic attribute,
// writes cursor position as CSS custom properties --mx/--my (0-100).
// Browser interpolates via @property + transition declared in globals.css.

const COARSE_POINTER = !window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!COARSE_POINTER) {
  const init = (): void => {
    const targets = document.querySelectorAll<HTMLElement>('[data-magnetic]');
    targets.forEach((el) => {
      el.addEventListener('mousemove', (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty('--mx', mx.toFixed(2));
        el.style.setProperty('--my', my.toFixed(2));
      });
      el.addEventListener('mouseleave', () => {
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
