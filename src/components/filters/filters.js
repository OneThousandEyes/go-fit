/**
 * @param {HTMLElement | null} root
 */
export function mountFilters(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Filters</div>`;
}
