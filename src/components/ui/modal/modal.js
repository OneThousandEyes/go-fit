const ROOT_ID = 'modal-root';

let activeClose = null;

/**
 * Centralized modal shell. Renders the backdrop + dialog + close button into
 * #modal-root, wires close on the X / backdrop / Escape, and removes the keydown
 * listener on close. Opening a modal while another is open closes the first
 * (e.g. the rating modal opening over the exercise modal).
 *
 * Feature modals only provide their inner `content` — no shell duplication.
 *
 * @param {object} options
 * @param {string} options.name - modal id for the `data-modal` attribute
 * @param {string} [options.content] - inner HTML of the dialog body
 * @param {() => void} [options.onClose] - callback fired after the modal closes
 * @returns {() => void} close function
 */
export function openModal({ name, content = '', onClose } = {}) {
  const root = document.getElementById(ROOT_ID);
  if (!root) return () => {};

  if (activeClose) activeClose();

  root.innerHTML = `
    <div class="modal" data-modal="${name}">
      <div class="modal__backdrop" data-close></div>
      <div class="modal__dialog" role="dialog" aria-modal="true">
        <button class="modal__close" type="button" data-close aria-label="Close">×</button>
        ${content}
      </div>
    </div>`;

  const onKeydown = (event) => {
    if (event.key === 'Escape') close();
  };

  function close() {
    document.removeEventListener('keydown', onKeydown);
    root.innerHTML = '';
    activeClose = null;
    onClose?.();
  }

  root
    .querySelectorAll('[data-close]')
    .forEach((el) => el.addEventListener('click', close));
  document.addEventListener('keydown', onKeydown);

  activeClose = close;
  return close;
}

export function closeModal() {
  if (activeClose) activeClose();
}
