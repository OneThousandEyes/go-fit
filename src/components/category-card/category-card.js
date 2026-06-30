/**
 * @param {HTMLElement | null} root
 */
export function mountCategoryCard(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Category list</div>`;
}
