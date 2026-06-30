/**
 * @param {HTMLElement | null} root
 */
export function mountHeader(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Header</div>`;
}
