/**
 * @param {HTMLElement | null} root
 */
export function mountHero(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Hero</div>`;
}
