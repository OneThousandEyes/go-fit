import iziToast from 'izitoast';
import iziToastCssUrl from 'izitoast/dist/css/iziToast.min.css?url';

/** @type {import('izitoast').IziToastSettings} */
const BASE = { position: 'topRight', timeout: 4000 };

let toastCssLoaded = false;

function ensureToastCss() {
  if (toastCssLoaded || typeof document === 'undefined') return;

  toastCssLoaded = true;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = iziToastCssUrl;
  link.dataset.toastCss = 'true';
  document.head.appendChild(link);
}

/** @param {string} message */
export function notifySuccess(message) {
  ensureToastCss();
  iziToast.success({ ...BASE, message });
}

/** @param {string} message */
export function notifyError(message) {
  ensureToastCss();
  iziToast.error({ ...BASE, message });
}

/** @param {string} message */
export function notifyInfo(message) {
  ensureToastCss();
  iziToast.info({ ...BASE, message });
}
