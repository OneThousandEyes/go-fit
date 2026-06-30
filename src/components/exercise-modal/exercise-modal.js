import { openModal } from '../ui/modal/modal.js';

export function openExerciseModal() {
  return openModal({
    name: 'exercise',
    label: 'Exercise details',
    content: `<div class="placeholder">Exercise modal</div>`,
  });
}
