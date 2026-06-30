import { LOADER } from '../../../utils/constants.js';

const GLOBAL_KEY = '__global__';

const counters = new Map();
const overlays = new Map();

function resolveKey(mode) {
  if (!mode || mode === LOADER.GLOBAL) return GLOBAL_KEY;
  if (mode === LOADER.SILENT) return null;

  const el = document.querySelector(mode);
  return el ?? GLOBAL_KEY;
}

function createOverlay(isGlobal) {
  const el = document.createElement('div');

  el.className = `loader ${isGlobal ? 'loader--global' : 'loader--local'}`;
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="loader__spinner"></span>';

  return el;
}

function mount(key) {
  let overlay = overlays.get(key);

  if (!overlay) {
    const isGlobal = key === GLOBAL_KEY;
    overlay = createOverlay(isGlobal);

    if (isGlobal) {
      document.body.append(overlay);
    } else {
      key.classList.add('loader-host');
      key.append(overlay);
    }

    overlays.set(key, overlay);
  }

  overlay.classList.add('loader--visible');
}

function unmount(key) {
  const overlay = overlays.get(key);
  if (!overlay) return;

  if (key === GLOBAL_KEY) {
    overlay.classList.remove('loader--visible');
    return;
  }

  overlay.remove();

  key.classList.remove('loader-host');
  overlays.delete(key);
}

export function showLoader(mode) {
  const key = resolveKey(mode);
  if (key === null) return;

  counters.set(key, (counters.get(key) ?? 0) + 1);

  mount(key);
}

export function hideLoader(mode) {
  const key = resolveKey(mode);
  if (key === null) return;

  const current = counters.get(key) ?? 0;

  if (current <= 1) {
    counters.delete(key);
    unmount(key);

    return;
  }

  counters.set(key, current - 1);
}
