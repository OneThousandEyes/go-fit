import type { PaginationState } from '@/types/pagination.ts';
import { escapeHtml } from '@/utils/escape-html.ts';
import {
  renderChevronIcon,
  renderDoubleChevronIcon,
} from './pagination-icons.ts';

export type PageItem = number | 'ellipsis';

export function buildPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 3) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 2) {
    return [1, 2, 3, 'ellipsis'];
  }

  if (page >= totalPages - 1) {
    return ['ellipsis', totalPages - 2, totalPages - 1, totalPages];
  }

  return ['ellipsis', page - 1, page, page + 1, 'ellipsis'];
}

export function resolveActionPage(
  action: string,
  page: number,
  totalPages: number,
): number | null {
  switch (action) {
    case 'first':
      return 1;
    case 'prev':
      return page - 1;
    case 'next':
      return page + 1;
    case 'last':
      return totalPages;
    default:
      return null;
  }
}

function renderArrowButton(
  action: string,
  label: string,
  icon: string,
  isDisabled: boolean,
): string {
  const disabledAttr = isDisabled ? ' disabled' : '';

  return `
    <button
      type="button"
      class="pagination__arrow${isDisabled ? ' pagination__arrow--disabled' : ''}"
      data-action="${action}"
      aria-label="${escapeHtml(label)}"${disabledAttr}
    >
      ${icon}
    </button>`;
}

function renderPageItem(item: PageItem, page: number): string {
  if (item === 'ellipsis') {
    return `<span class="pagination__ellipsis" aria-hidden="true">...</span>`;
  }

  const isActive = item === page;
  const ariaCurrent = isActive ? ' aria-current="page"' : '';

  return `
    <button
      type="button"
      class="pagination__page${isActive ? ' pagination__page--active' : ''}"
      data-page="${item}"
      aria-label="Page ${item}"${ariaCurrent}
    >
      ${escapeHtml(String(item))}
    </button>`;
}

export function renderPaginationMarkup({
  page,
  totalPages,
}: PaginationState): string {
  const isHidden = totalPages <= 1;

  if (isHidden) {
    return '';
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;
  const showArrows = totalPages > 3;
  const pageItems = buildPageItems(page, totalPages);

  const prevArrows = showArrows
    ? `
    <div class="pagination__arrows">
      ${renderArrowButton(
        'first',
        'First page',
        renderDoubleChevronIcon('left'),
        isFirstPage,
      )}
      ${renderArrowButton(
        'prev',
        'Previous page',
        renderChevronIcon('left'),
        isFirstPage,
      )}
    </div>`
    : '';

  const nextArrows = showArrows
    ? `
    <div class="pagination__arrows">
      ${renderArrowButton(
        'next',
        'Next page',
        renderChevronIcon('right'),
        isLastPage,
      )}
      ${renderArrowButton(
        'last',
        'Last page',
        renderDoubleChevronIcon('right'),
        isLastPage,
      )}
    </div>`
    : '';

  return `
    ${prevArrows}
    <div class="pagination__pages">
      ${pageItems.map((item) => renderPageItem(item, page)).join('')}
    </div>
    ${nextArrows}`;
}

export function renderPagination(
  root: HTMLElement,
  state: PaginationState,
): void {
  const isHidden = state.totalPages <= 1;

  root.hidden = isHidden;

  if (isHidden) {
    root.innerHTML = '';
    return;
  }

  root.innerHTML = renderPaginationMarkup(state);
}
