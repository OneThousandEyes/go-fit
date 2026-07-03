import { bindStoreIsland } from '@/components/shared/store-island.ts';
import { setState } from '@/services/store.service.ts';
import type { AppState } from '@/types/app-state.ts';
import { escapeHtml } from '@/utils/escape-html.ts';

function render(root: HTMLElement, state: Readonly<AppState>): void {
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

export function initBreadcrumb(root: HTMLElement | null): () => void {
  if (!root) return () => {};

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('.breadcrumb__root--link');

    if (!link || !root.contains(link)) return;

    setState({ category: null, page: 1, keyword: '' });
  };

  const sync = (state: Readonly<AppState>) => render(root, state);

  return bindStoreIsland(sync, { root, listeners: [['click', onClick]] });
}
