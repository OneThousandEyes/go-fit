/**
 * @param {number} [rating]
 * @returns {string}
 */
export function renderRatingStars(rating = 0) {
  return `<span class="rating-stars" data-rating="${rating}">★★★★★</span>`;
}
