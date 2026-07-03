import type { PaginationState } from '@/types/pagination.ts';
import { renderPagination, resolveActionPage } from './pagination-view.ts';

export function handlePaginationClick(
  root: HTMLElement,
  state: PaginationState,
  onPageChange: (page: number) => void,
  event: Event,
): void {
  const target = event.target as HTMLElement;
  const control = target.closest('[data-page], [data-action]');

  if (!control || !root.contains(control)) return;
  if (control.hasAttribute('disabled')) return;

  const { page, totalPages } = state;
  const action = control.getAttribute('data-action');

  if (action) {
    const nextPage = resolveActionPage(action, page, totalPages);

    if (
      nextPage === null ||
      nextPage < 1 ||
      nextPage > totalPages ||
      nextPage === page
    ) {
      return;
    }

    onPageChange(nextPage);
    return;
  }

  const nextPage = Number(control.getAttribute('data-page'));

  if (!Number.isFinite(nextPage) || nextPage < 1 || nextPage === page) return;

  onPageChange(nextPage);
}

export interface BindPaginationControlsOptions {
  getState: () => PaginationState;
  onPageChange: (page: number) => void;
}

export function bindPaginationControls(
  root: HTMLElement | null,
  { getState, onPageChange }: BindPaginationControlsOptions,
): () => void {
  if (!root) return () => {};

  const sync = () => {
    renderPagination(root, getState());
  };

  const onClick = (event: Event) => {
    handlePaginationClick(root, getState(), onPageChange, event);
  };

  root.addEventListener('click', onClick);
  sync();

  return () => {
    root.removeEventListener('click', onClick);
  };
}
