import { bindStoreIsland } from '@/components/shared/store-island.ts';
import { getState, setState } from '@/services/store.service.ts';
import type { AppState } from '@/types/app-state.ts';
import { normalizeQuery } from '@/utils/validators.ts';

function updateClearVisibility(
  input: HTMLInputElement,
  clearButton: HTMLButtonElement | null,
): void {
  if (!clearButton) return;

  clearButton.hidden = input.value.length === 0;
}

export function initSearch(root: HTMLFormElement | null): () => void {
  if (!root) return () => {};

  const input = root.querySelector('.search__input') as HTMLInputElement | null;
  const clearButton = root.querySelector(
    '.search__clear',
  ) as HTMLButtonElement | null;

  if (!input) return () => {};

  const applyKeyword = (keyword: string) => {
    input.value = keyword;
    updateClearVisibility(input, clearButton);

    if (keyword === getState().keyword) return;

    setState({ keyword, page: 1 });
  };

  const onSubmit = (event: Event) => {
    event.preventDefault();
    applyKeyword(normalizeQuery(input.value));
  };

  const onInput = () => {
    updateClearVisibility(input, clearButton);
  };

  const onClear = () => {
    applyKeyword('');
    input.focus();
  };

  const sync = (state: Readonly<AppState>) => {
    root.hidden = state.category === null;

    if (document.activeElement !== input) {
      input.value = state.keyword;
      updateClearVisibility(input, clearButton);
    }
  };

  updateClearVisibility(input, clearButton);

  const storeTeardown = bindStoreIsland(sync, {
    root,
    listeners: [
      ['submit', onSubmit],
      ['input', onInput],
    ],
  });

  clearButton?.addEventListener('click', onClear);

  return () => {
    storeTeardown();
    clearButton?.removeEventListener('click', onClear);
  };
}
