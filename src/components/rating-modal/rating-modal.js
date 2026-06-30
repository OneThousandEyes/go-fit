import { openModal } from '../ui/modal/modal.js';

export function openRatingModal() {
  return openModal({
    name: 'rating',
    label: 'Rate this exercise',
    content: `<div class="placeholder">Rating modal</div>`,
  });
}
