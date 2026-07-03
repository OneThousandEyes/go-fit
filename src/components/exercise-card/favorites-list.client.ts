import { openExerciseModal } from '@/components/exercise-modal/exercise-modal.ts';
import { bindPaginationControls } from '@/components/pagination/pagination-controls.ts';
import { renderPagination } from '@/components/pagination/pagination-view.ts';
import { createListStatus } from '@/components/shared/list-status.ts';
import { PAGE_LIMIT } from '@/constants/patterns.ts';
import { STORAGE_KEYS } from '@/constants/storage-keys.ts';
import { getFavorites, removeFavorite } from '@/services/favorites.service.ts';
import type { Exercise } from '@/types/exercise.ts';
import type { PaginationState } from '@/types/pagination.ts';
import { renderFavoriteExerciseCard } from './render-exercise-card.ts';

const status = createListStatus('favorites-list');

function paginate(
  items: Exercise[],
  page: number,
): PaginationState & { items: Exercise[] } {
  const totalPages = Math.max(
    1,
    Math.ceil(items.length / PAGE_LIMIT.EXERCISES),
  );
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * PAGE_LIMIT.EXERCISES;

  return {
    items: items.slice(start, start + PAGE_LIMIT.EXERCISES),
    page: safePage,
    totalPages,
  };
}

export function initFavoritesList(root: HTMLElement | null): () => void {
  if (!root) return () => {};

  const listRoot = root.querySelector('.favorites-list');
  const paginationRoot = root.querySelector('[data-favorites-pagination]');

  if (
    !(listRoot instanceof HTMLElement) ||
    !(paginationRoot instanceof HTMLElement)
  ) {
    return () => {};
  }

  let favorites: Exercise[] = [];
  let currentPage = 1;

  const renderList = () => {
    if (!favorites.length) {
      status.renderEmpty(
        listRoot,
        "It appears that you haven't added any exercises to your favorites yet. To get started, you can add exercises that you like to your favorites for easier access in the future.",
      );

      renderPagination(paginationRoot, { page: 1, totalPages: 1 });

      return;
    }

    const slice = paginate(favorites, currentPage);
    currentPage = slice.page;

    listRoot.innerHTML = slice.items
      .map((item) => renderFavoriteExerciseCard(item))
      .join('');

    renderPagination(paginationRoot, {
      page: slice.page,
      totalPages: slice.totalPages,
    });
  };

  const refresh = (page = currentPage) => {
    favorites = getFavorites();
    currentPage = page;
    renderList();
  };

  const paginationTeardown = bindPaginationControls(paginationRoot, {
    getState: () => paginate(favorites, currentPage),
    onPageChange: (nextPage) => {
      currentPage = nextPage;
      renderList();
    },
  });

  const onClick = (event: Event) => {
    const target = event.target as HTMLElement;
    const removeButton = target.closest('[data-remove-id]');

    if (removeButton && listRoot.contains(removeButton)) {
      const id = removeButton.getAttribute('data-remove-id');

      if (!id) return;

      removeFavorite(id);
      refresh(currentPage);
      return;
    }

    const startButton = target.closest('.exercise-card__start');

    if (startButton && listRoot.contains(startButton)) {
      const exerciseId = startButton.getAttribute('data-id');

      if (!exerciseId) return;

      openExerciseModal(exerciseId, {
        onToggleFavorite: () => {
          refresh(currentPage);
        },
      });
    }
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== STORAGE_KEYS.FAVORITES) return;

    refresh(currentPage);
  };

  root.addEventListener('click', onClick);
  window.addEventListener('storage', onStorage);
  refresh(1);

  return () => {
    paginationTeardown();
    root.removeEventListener('click', onClick);
    window.removeEventListener('storage', onStorage);
  };
}
