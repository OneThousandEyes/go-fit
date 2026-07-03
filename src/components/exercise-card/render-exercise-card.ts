import { renderBadge } from '@/components/ui/badge/badge.ts';
import type { Exercise } from '@/types/exercise.ts';
import { escapeHtml } from '@/utils/escape-html.ts';
import { renderSpriteIcon, SPRITE_ICON } from '@/utils/sprite-icon.ts';

const RUNNER_ICON = renderSpriteIcon(SPRITE_ICON.RUNNING, {
  className: 'exercise-card__icon-glyph',
  width: 14,
  height: 14,
});

const STAR_ICON = renderSpriteIcon(SPRITE_ICON.STAR, {
  className: 'exercise-card__star',
  width: 14,
  height: 14,
});

const TRASH_ICON = renderSpriteIcon(SPRITE_ICON.TRASH, {
  className: 'exercise-card__trash-icon',
  width: 18,
  height: 18,
  stroke: true,
});

const ARROW_ICON = renderSpriteIcon(SPRITE_ICON.ARROW_UP_RIGHT, {
  className: 'exercise-card__arrow',
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  stroke: true,
});

function formatRating(rating: unknown): string {
  const value = Number(rating);
  return (Number.isFinite(value) ? value : 0).toFixed(1);
}

function formatCalories(calories: unknown): string {
  const value = Number(calories);
  return Number.isFinite(value) ? `${value} / 3 min` : '—';
}

function renderMetaItem(label: string, value: string): string {
  return `
    <li class="exercise-card__meta-item">
      <span class="exercise-card__meta-label">${escapeHtml(label)}</span>
      <span class="exercise-card__meta-value">${escapeHtml(value || '—')}</span>
    </li>`;
}

function renderStartButton(id: string): string {
  return `
    <button
      type="button"
      class="exercise-card__start"
      data-id="${escapeHtml(id)}"
    >
      <span>Start</span>
      ${ARROW_ICON}
    </button>`;
}

function renderRating(id: string, rating: unknown): string {
  void id;

  return `
    <span class="exercise-card__rating">
      <span class="exercise-card__rating-value">${formatRating(rating)}</span>
      ${STAR_ICON}
    </span>`;
}

function renderRemoveButton(id: string): string {
  return `
    <button
      type="button"
      class="exercise-card__remove"
      data-remove-id="${escapeHtml(id)}"
      aria-label="Remove from favorites"
    >
      ${TRASH_ICON}
    </button>`;
}

function renderCardTop(
  id: string,
  variant: 'catalog' | 'favorite',
  rating: unknown,
): string {
  const actionMarkup =
    variant === 'favorite' ? renderRemoveButton(id) : renderRating(id, rating);

  return `
    <div class="exercise-card__top">
      ${renderBadge()}
      ${actionMarkup}
      ${renderStartButton(id)}
    </div>`;
}

export interface RenderExerciseCardOptions {
  variant?: 'catalog' | 'favorite';
}

export function renderExerciseCard(
  exercise: Partial<Exercise>,
  options: RenderExerciseCardOptions = {},
): string {
  const variant = options.variant ?? 'catalog';
  const id = String(exercise._id ?? '');
  const name = String(exercise.name ?? '');
  const bodyPart = String(exercise.bodyPart ?? '');
  const target = String(exercise.target ?? '');

  return `
    <li class="exercise-card">
      ${renderCardTop(id, variant, exercise.rating)}

      <div class="exercise-card__title">
        <span class="exercise-card__icon">${RUNNER_ICON}</span>
        <h3 class="exercise-card__name"${name ? ` title="${escapeHtml(name)}"` : ''}>${escapeHtml(name)}</h3>
      </div>

      <ul class="exercise-card__meta">
        ${renderMetaItem('Burned cal.:', formatCalories(exercise.burnedCalories))}
        ${renderMetaItem('Body part:', bodyPart)}
        ${renderMetaItem('Target:', target)}
      </ul>
    </li>`;
}

export function renderFavoriteExerciseCard(
  exercise: Partial<Exercise>,
): string {
  return renderExerciseCard(exercise, { variant: 'favorite' });
}
