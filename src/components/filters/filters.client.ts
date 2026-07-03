import { bindStoreIsland } from '@/components/shared/store-island.ts';
import { getState, setState } from '@/services/store.service.ts';
import type { AppState } from '@/types/app-state.ts';
import { renderFiltersMarkup } from './render-filters.ts';

function render(root: HTMLElement, activeFilter: string): void {
  const tabs = root.querySelectorAll('[data-filter]');

  if (tabs.length > 0) {
    for (const tab of tabs) {
      const filter = tab.getAttribute('data-filter') ?? '';
      const isActive = filter === activeFilter;

      tab.classList.toggle('filters__tab--active', isActive);
      tab.setAttribute('aria-pressed', String(isActive));
    }

    return;
  }

  root.innerHTML = renderFiltersMarkup(activeFilter);
}

function selectFilter(filter: string): void {
  const { activeFilter } = getState();

  if (filter === activeFilter) return;

  setState({
    activeFilter: filter,
    page: 1,
    category: null,
    keyword: '',
  });
}

export function initFilters(root: HTMLElement | null): () => void {
  if (!root) return () => {};

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const tab = target.closest('[data-filter]');

    if (!tab || !root.contains(tab)) return;

    selectFilter(tab.getAttribute('data-filter') ?? '');
  };

  const sync = (state: AppState) => render(root, state.activeFilter);

  return bindStoreIsland(sync, { root, listeners: [['click', onClick]] });
}
