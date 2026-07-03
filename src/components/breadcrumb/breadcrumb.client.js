import { setState } from '../../services/store.service.js';
import { escapeHtml } from '../../utils/escape-html.js';
import { bindStoreIsland } from '../shared/store-island.js';

/**
 * @typedef {import('../../services/store.service.js').AppState} AppState
 */

/**
 * @param {HTMLElement} root
 * @param {Readonly<AppState>} state
 */
function render(root, state) {
  if (!state.category) {
    if (root.querySelector('.breadcrumb__root:not(.breadcrumb__root--link)')) {
      return;
    }

    root.innerHTML = `<span class="breadcrumb__root">Exercises</span>`;
    return;
  }

  const categoryName = root.querySelector('.breadcrumb__category')?.textContent;

  if (categoryName === state.category.name) {
    return;
  }

  root.innerHTML = `
    <button type="button" class="breadcrumb__root breadcrumb__root--link">Exercises</button>
    <span class="breadcrumb__sep" aria-hidden="true">/</span>
    <span class="breadcrumb__category">${escapeHtml(state.category.name)}</span>`;
}

/**
 * @param {HTMLElement | null} root
 * @returns {() => void} teardown
 */
export function initBreadcrumb(root) {
  if (!root) return () => {};

  const onClick = (/** @type {Event} */ event) => {
    const target = /** @type {HTMLElement} */ (event.target);
    const link = target.closest('.breadcrumb__root--link');

    if (!link || !root.contains(link)) return;

    setState({ category: null, page: 1, keyword: '' });
  };

  const sync = (/** @type {Readonly<AppState>} */ state) => render(root, state);

  return bindStoreIsland(sync, { root, listeners: [['click', onClick]] });
}
