/**
 * @param {HTMLElement | null} root
 */
export function mountDailyNorm(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Daily norm · 110 min</div>`;
}
