/**
 * @param {HTMLElement | null} root
 */
export function mountPagination(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Pagination</div>`;
}
