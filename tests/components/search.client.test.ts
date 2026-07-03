import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const SEARCH_PATH = '@/components/search/search.client.ts';
const STORE_PATH = '@/services/store.service.ts';

type StoreModule = typeof import('@/services/store.service.ts');

let root: HTMLFormElement;
let input: HTMLInputElement;
let teardown: () => void = () => {};
let store: StoreModule;

async function setup(): Promise<void> {
  localStorage.clear();
  vi.resetModules();

  store = await import(STORE_PATH);
  const { initSearch } = await import(SEARCH_PATH);

  root = document.createElement('form');
  root.setAttribute('data-component', 'search');
  input = document.createElement('input');
  input.className = 'search__input';
  const clearButton = document.createElement('button');
  clearButton.type = 'button';
  clearButton.className = 'search__clear';
  clearButton.hidden = true;
  root.append(input, clearButton);
  document.body.append(root);

  teardown = initSearch(root);
}

describe('search island', () => {
  beforeEach(setup);

  afterEach(() => {
    teardown();
    root.remove();
  });

  it('is hidden in the categories view and visible once a category is set', () => {
    expect(root.hidden).toBe(true);

    store.setState({ category: { name: 'waist', filter: 'bodypart' } });

    expect(root.hidden).toBe(false);
  });

  it('submits a normalized keyword and resets to page 1', () => {
    store.setState({
      category: { name: 'waist', filter: 'bodypart' },
      page: 4,
    });

    input.value = '  push   up  ';
    root.dispatchEvent(new Event('submit', { cancelable: true }));

    const state = store.getState();
    expect(state.keyword).toBe('push up');
    expect(state.page).toBe(1);
    expect(input.value).toBe('push up');
  });

  it('does not dispatch when the keyword is unchanged', () => {
    store.setState({ category: { name: 'waist', filter: 'bodypart' } });
    input.value = '';

    const spy = vi.fn();
    const stop = store.subscribe(spy);
    root.dispatchEvent(new Event('submit', { cancelable: true }));
    stop();

    expect(spy).not.toHaveBeenCalled();
  });

  it('syncs the input value from the store keyword', () => {
    store.setState({
      category: { name: 'waist', filter: 'bodypart' },
      keyword: 'plank',
    });

    expect(input.value).toBe('plank');
  });

  it('shows the clear button only when the input has text', () => {
    store.setState({ category: { name: 'waist', filter: 'bodypart' } });

    const clearButton = root.querySelector<HTMLButtonElement>('.search__clear');

    expect(clearButton?.hidden).toBe(true);

    input.value = 'air';
    input.dispatchEvent(new Event('input', { bubbles: true }));

    expect(clearButton?.hidden).toBe(false);
  });

  it('clears the keyword and resets to page 1 when clear is clicked', () => {
    store.setState({
      category: { name: 'waist', filter: 'bodypart' },
      keyword: 'air bike',
      page: 3,
    });

    const clearButton =
      root.querySelector<HTMLButtonElement>('.search__clear')!;

    clearButton.click();

    const state = store.getState();
    expect(state.keyword).toBe('');
    expect(state.page).toBe(1);
    expect(input.value).toBe('');
    expect(clearButton.hidden).toBe(true);
  });
});
