import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const BREADCRUMB_PATH = '@/components/breadcrumb/breadcrumb.client.ts';
const STORE_PATH = '@/services/store.service.ts';

type StoreModule = typeof import('@/services/store.service.ts');

let root: HTMLElement;
let teardown: () => void = () => {};
let store: StoreModule;

async function setup(): Promise<void> {
  localStorage.clear();
  vi.resetModules();

  store = await import(STORE_PATH);
  const { initBreadcrumb } = await import(BREADCRUMB_PATH);

  root = document.createElement('h2');
  root.setAttribute('data-component', 'breadcrumb');
  document.body.append(root);
  teardown = initBreadcrumb(root);
}

describe('breadcrumb island', () => {
  beforeEach(setup);

  afterEach(() => {
    teardown();
    root.remove();
  });

  it('renders only "Exercises" in the categories view', () => {
    expect(root.textContent?.trim()).toBe('Exercises');
    expect(root.querySelector('.breadcrumb__category')).toBeNull();
  });

  it('renders the selected category in the exercises view', () => {
    store.setState({ category: { name: 'waist', filter: 'bodypart' } });

    expect(root.querySelector('.breadcrumb__category')?.textContent).toBe(
      'waist',
    );
    expect(root.querySelector('.breadcrumb__root--link')).not.toBeNull();
  });

  it('returns to the categories view when "Exercises" is clicked', () => {
    store.setState({
      category: { name: 'waist', filter: 'bodypart' },
      page: 3,
      keyword: 'plank',
    });

    root.querySelector<HTMLElement>('.breadcrumb__root--link')!.click();

    const state = store.getState();
    expect(state.category).toBeNull();
    expect(state.page).toBe(1);
    expect(state.keyword).toBe('');
  });
});
