/**
 * @param {HTMLButtonElement | null} root
 */
export function mountScrollUp(root) {
  if (!root) return;

  root.hidden = false;
  root.textContent = '↑';
}
