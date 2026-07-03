import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../src/api/quote.api.js', () => ({
  getQuote: vi.fn(),
}));

vi.mock('../../src/services/storage.service.js', () => ({
  readJSON: vi.fn(),
  writeJSON: vi.fn(),
}));

import { getQuote } from '../../src/api/quote.api.js';
import { initQuote } from '../../src/components/quote/quote.client.js';
import { readJSON, writeJSON } from '../../src/services/storage.service.js';
import { STORAGE_KEYS } from '../../src/utils/constants.js';

describe('initQuote', () => {
  /** @type {HTMLElement} */
  let root;

  beforeEach(() => {
    root = document.createElement('div');
    root.innerHTML = `
      <p data-quote-text>SSR quote</p>
      <p data-quote-author>SSR author</p>
    `;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('uses cached quote when date matches today', async () => {
    const today = new Date().toISOString().slice(0, 10);

    vi.mocked(readJSON).mockReturnValue({
      date: today,
      quote: 'Cached quote',
      author: 'Cached author',
    });

    await initQuote(root);

    expect(getQuote).not.toHaveBeenCalled();
    expect(root.querySelector('[data-quote-text]')?.textContent).toBe(
      'Cached quote',
    );
    expect(root.querySelector('[data-quote-author]')?.textContent).toBe(
      'Cached author',
    );
  });

  it('fetches and caches quote when cache is missing or stale', async () => {
    const today = new Date().toISOString().slice(0, 10);

    vi.mocked(readJSON).mockReturnValue({
      date: '2000-01-01',
      quote: 'Old quote',
      author: 'Old author',
    });
    vi.mocked(getQuote).mockResolvedValue({
      quote: 'Fresh quote',
      author: 'Fresh author',
    });

    await initQuote(root);

    expect(getQuote).toHaveBeenCalledOnce();
    expect(writeJSON).toHaveBeenCalledWith(STORAGE_KEYS.QUOTE, {
      date: today,
      quote: 'Fresh quote',
      author: 'Fresh author',
    });
    expect(root.querySelector('[data-quote-text]')?.textContent).toBe(
      'Fresh quote',
    );
  });
});
