/**
 * @param {HTMLElement | null} root
 */
export function mountExerciseCard(root) {
  if (!root) return;
  root.innerHTML = `<div class="placeholder">Exercises list</div>`;
}
