import { subscribe } from '@/api/subscription.api.ts';
import { setButtonLoading } from '@/components/ui/button/button.ts';
import { LOADER } from '@/constants/loaders.ts';
import { extractApiMessage } from '@/utils/api-error-message.ts';
import { notifySuccess } from '@/utils/notify.ts';

const BUTTON_LOADING_CLASS = 'footer__button--loading';

export function initFooter(root: HTMLElement | null): void {
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

    setButtonLoading(submitButton, true, BUTTON_LOADING_CLASS);

    try {
      const result = await subscribe(email, { loader: LOADER.SILENT });

      form.reset();

      notifySuccess(
        extractApiMessage(result) ?? 'You have successfully subscribed!',
      );
    } catch {
      // notifyError is shown by the Axios interceptor.
    } finally {
      setButtonLoading(submitButton, false, BUTTON_LOADING_CLASS);
    }
  });
}
