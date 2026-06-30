/**
 * @param {HTMLElement | null} root
 */
export function mountFooter(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Footer</div>`;
}
