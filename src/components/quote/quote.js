/**
 * @param {HTMLElement | null} root
 */
export function mountQuote(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Quote of the day</div>`;
}
