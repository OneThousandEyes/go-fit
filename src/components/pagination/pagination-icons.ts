import { renderSpriteIcon, SPRITE_ICON } from '@/utils/sprite-icon.ts';

const CHEVRON_OPTIONS = {
  className: 'pagination__icon',
  width: 20,
  height: 20,
  viewBox: '0 0 20 20',
};

export function renderChevronIcon(direction: 'left' | 'right'): string {
  const iconId =
    direction === 'left' ? SPRITE_ICON.CHEVRON_LEFT : SPRITE_ICON.CHEVRON_RIGHT;

  return renderSpriteIcon(iconId, CHEVRON_OPTIONS);
}

export function renderDoubleChevronIcon(direction: 'left' | 'right'): string {
  const icon = renderChevronIcon(direction);
  return `<span class="pagination__icon-set pagination__icon-set--double">${icon}${icon}</span>`;
}
