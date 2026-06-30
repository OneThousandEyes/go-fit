import { openModal } from '../ui/modal/modal.js';

export function openRatingModal() {
  return openModal({
    name: 'rating',
    content: `<div class="placeholder">Rating modal</div>`,
  });
}
