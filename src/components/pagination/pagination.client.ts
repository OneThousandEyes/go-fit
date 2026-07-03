import { bindStoreIsland } from '@/components/shared/store-island.ts';
import { DEFAULT_FILTER } from '@/constants/filters.ts';
import { getState, setState } from '@/services/store.service.ts';
import type { AppState } from '@/types/app-state.ts';
import { handlePaginationClick } from './pagination-controls.ts';
import { renderPagination } from './pagination-view.ts';

function matchesSsrState(
  state: Readonly<AppState>,
  ssrPage: number,
  ssrTotalPages: number,
): boolean {
  return (
    state.category === null &&
    state.activeFilter === DEFAULT_FILTER &&
    state.page === ssrPage &&
    state.totalPages === ssrTotalPages
  );
}

export function initPagination(root: HTMLElement | null): () => void {
  if (!root) return () => {};

  const ssrPage = Number(root.dataset.ssrPage);
  const ssrTotalPages = Number(root.dataset.totalPages);
  const hasSsrMarkup = Boolean(root.querySelector('.pagination__page'));
  const canReuseSsr =
    hasSsrMarkup &&
    Number.isFinite(ssrPage) &&
    Number.isFinite(ssrTotalPages) &&
    ssrTotalPages > 1;

  if (
    canReuseSsr &&
    ssrTotalPages !== getState().totalPages &&
    getState().category === null
  ) {
    setState({ totalPages: ssrTotalPages });
  }

  let skipSsrRender =
    canReuseSsr && matchesSsrState(getState(), ssrPage, ssrTotalPages);

  const onClick = (event: Event) => {
    const state = getState();
    handlePaginationClick(root, state, (page) => setState({ page }), event);
  };

  const sync = (state: Readonly<AppState>) => {
    if (skipSsrRender && matchesSsrState(state, ssrPage, ssrTotalPages)) {
      skipSsrRender = false;
      root.hidden = state.totalPages <= 1;
      return;
    }

    skipSsrRender = false;
    renderPagination(root, state);
  };

  return bindStoreIsland(sync, { root, listeners: [['click', onClick]] });
}
