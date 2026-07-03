import { FILTER } from '@/constants/filters.ts';
import { escapeHtml } from '@/utils/escape-html.ts';

export const FILTER_TABS = [
  FILTER.MUSCLES,
  FILTER.BODY_PARTS,
  FILTER.EQUIPMENT,
] as const;

export function renderFiltersMarkup(activeFilter: string): string {
  return FILTER_TABS.map((label) => {
    const isActive = label === activeFilter;

    return `
      <button
        type="button"
        class="filters__tab${isActive ? ' filters__tab--active' : ''}"
        aria-pressed="${isActive}"
        data-filter="${escapeHtml(label)}"
      >
        <span class="filters__label">${escapeHtml(label)}</span>
        <span class="filters__underline" aria-hidden="true"></span>
      </button>`;
  }).join('');
}
