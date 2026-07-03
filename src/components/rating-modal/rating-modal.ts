import { rateExercise } from '@/api/exercises.api.ts';
import { setButtonLoading } from '@/components/ui/button/button.ts';
import { openModal } from '@/components/ui/modal/modal.ts';
import { LOADER } from '@/constants/loaders.ts';
import { EMAIL_PATTERN } from '@/constants/patterns.ts';
import { notifySuccess } from '@/utils/notify.ts';
import { SPRITE_ICON, renderSpriteIcon } from '@/utils/sprite-icon.ts';

const MAX_RATING = 5;

const EMAIL_HTML_PATTERN = EMAIL_PATTERN.source
  .replace(/^\^/, '')
  .replace(/\$$/, '');

function renderStars(): string {
  let markup = '';

  for (let value = MAX_RATING; value >= 1; value -= 1) {
    const id = `rating-star-${value}`;
    const icon = renderSpriteIcon(SPRITE_ICON.STAR, {
      className: 'rating-modal__star-icon',
      width: 24,
      height: 24,
    });

    markup += `
      <input
        class="rating-modal__radio visually-hidden"
        type="radio"
        id="${id}"
        name="rate"
        value="${value}"
        required
      />
      <label class="rating-modal__star" for="${id}">
        ${icon}
        <span class="visually-hidden">${value} ${value === 1 ? 'star' : 'stars'}</span>
      </label>`;
  }

  return markup;
}

function renderContent(): string {
  return `
    <form class="rating-modal" data-rating-form>
      <p class="rating-modal__label">Rating</p>

      <div class="rating-modal__rating">
        <span class="rating-modal__value" data-rating-value>0.0</span>
        <fieldset class="rating-modal__stars">
          <legend class="visually-hidden">Choose a rating from 1 to 5</legend>
          ${renderStars()}
        </fieldset>
      </div>

      <label class="visually-hidden" for="rating-email">Email</label>
      <input
        class="rating-modal__input"
        id="rating-email"
        type="email"
        name="email"
        placeholder="Email"
        autocomplete="email"
        pattern="${EMAIL_HTML_PATTERN}"
        title="Enter a valid email address"
        required
      />

      <label class="visually-hidden" for="rating-comment">Your comment</label>
      <textarea
        class="rating-modal__input rating-modal__textarea"
        id="rating-comment"
        name="review"
        placeholder="Your comment"
        rows="4"
        required
      ></textarea>

      <button class="button rating-modal__send" type="submit" data-rating-submit>
        Send
      </button>
    </form>`;
}

async function submitRating(
  form: HTMLFormElement,
  exerciseId: string,
  close: () => void,
): Promise<void> {
  const submitButton = form.querySelector(
    '[data-rating-submit]',
  ) as HTMLButtonElement;
  const data = new FormData(form);
  const payload = {
    rate: Number(data.get('rate')),
    email: String(data.get('email') ?? '').trim(),
    review: String(data.get('review') ?? '').trim(),
  };

  setButtonLoading(submitButton, true);

  try {
    await rateExercise(exerciseId, payload, { loader: LOADER.SILENT });
    notifySuccess('Thank you for your feedback!');
    close();
  } catch {
    setButtonLoading(submitButton, false);
  }
}

export interface OpenRatingModalOptions {
  exerciseId?: string;
  onClose?: () => void;
}

export function openRatingModal({
  exerciseId,
  onClose,
}: OpenRatingModalOptions = {}): () => void {
  const close = openModal({
    name: 'rating',
    label: 'Rate this exercise',
    content: renderContent(),
    onClose,
  });

  const root = document.getElementById('modal-root');
  const form = root?.querySelector(
    '[data-rating-form]',
  ) as HTMLFormElement | null;
  if (!form) return close;

  const valueEl = form.querySelector(
    '[data-rating-value]',
  ) as HTMLElement | null;

  form.addEventListener('change', (event) => {
    const target = event.target as HTMLInputElement;
    if (valueEl && target.name === 'rate') {
      valueEl.textContent = Number(target.value).toFixed(1);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (exerciseId) {
      submitRating(form, exerciseId, close);
    }
  });

  return close;
}
