const OPEN_CLASS = 'mobile-menu--open';

export function initHeader(root: HTMLElement | null): void {
  if (!root) return;

  const menu = root.querySelector('[data-menu]');
  const openBtn = root.querySelector('[data-menu-open]');
  const closeBtn = root.querySelector('[data-menu-close]');
  if (!menu || !openBtn) return;

  const setScrollLock = (isLocked: boolean) => {
    document.body.style.overflow = isLocked ? 'hidden' : '';
  };

  const open = () => {
    menu.classList.add(OPEN_CLASS);
    openBtn.setAttribute('aria-expanded', 'true');
    setScrollLock(true);
  };

  const close = () => {
    menu.classList.remove(OPEN_CLASS);
    openBtn.setAttribute('aria-expanded', 'false');
    setScrollLock(false);
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);

  menu.addEventListener('click', (event) => {
    const target = event.target;

    if (target instanceof Element && target.closest('a')) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}
