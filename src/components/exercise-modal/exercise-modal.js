import { openModal } from '../ui/modal/modal.js';

export function openExerciseModal() {
  return openModal({
    name: 'exercise',
    content: `<div class="placeholder">Exercise modal</div>`,
  });
}
