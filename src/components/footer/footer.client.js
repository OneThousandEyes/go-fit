const SUBSCRIPTION_URL = 'https://your-energy.b.goit.study/api/subscription';

/**
 * @param {HTMLElement | null} root
 * @returns {void}
 */
export function initFooter(root) {
  if (!root) return;

  const form = root.querySelector('[data-footer-form]');

  if (!(form instanceof HTMLFormElement)) return;

  const input = form.querySelector('input[name="email"]');

  if (!(input instanceof HTMLInputElement)) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = input.value.trim();

    if (!input.checkValidity()) {
      input.reportValidity();
      return;
    }

    try {
      const response = await fetch(SUBSCRIPTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Subscription request failed');
      }

      form.reset();
    } catch (error) {
      console.error(error);
    }
  });
}
