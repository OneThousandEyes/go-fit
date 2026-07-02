import { subscribe } from '../../api/subscription.api.js';
import { LOADER } from '../../utils/constants.js';
import { notifySuccess } from '../../utils/notify.js';
import { setButtonLoading } from '../ui/button/button.js';

const BUTTON_LOADING_CLASS = 'footer__button--loading';

/**
 * @param {HTMLButtonElement} button
 * @param {boolean} isLoading
 * @returns {void}
 */
function setFooterButtonLoading(button, isLoading) {
  setButtonLoading(button, isLoading);
  button.classList.toggle(BUTTON_LOADING_CLASS, isLoading);
}

/**
 * @param {{ message?: string, data?: { message?: string } } | null | undefined} result
 * @returns {string}
 */
function getSuccessMessage(result) {
  return (
    result?.message ??
    result?.data?.message ??
    'You have successfully subscribed!'
  );
}

/**
 * @param {HTMLElement | null} root
 * @returns {void}
 */
export function initFooter(root) {
  if (!root) return;

  const form = root.querySelector('[data-footer-form]');

  if (!(form instanceof HTMLFormElement)) return;

  const input = form.querySelector('input[name="email"]');
  const submitButton = form.querySelector('button[type="submit"]');

  if (!(input instanceof HTMLInputElement)) return;
  if (!(submitButton instanceof HTMLButtonElement)) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = input.value.trim();

    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }

    setFooterButtonLoading(submitButton, true);

    try {
      const result = await subscribe(email, { loader: LOADER.SILENT });

      form.reset();
      notifySuccess(getSuccessMessage(result));
    } catch {
      // Error notification is handled by the common API/interceptor layer.
    } finally {
      setFooterButtonLoading(submitButton, false);
    }
  });
}
