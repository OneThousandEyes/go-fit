import { ENDPOINTS, PAGE_LIMIT } from '../utils/constants.js';
import { http } from './instance.js';
import { normalizeEntity, normalizePaginated } from './normalizers.js';

/**
 * Fetches a paginated list of exercises filtered by category + keyword.
 * Pass exactly one of bodypart / muscles / equipment (the selected category type).
 * @param {object} params
 * @param {string} [params.bodypart]
 * @param {string} [params.muscles]
 * @param {string} [params.equipment]
 * @param {string} [params.keyword]
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {{ loader?: string }} [options] - loader target (LOADER.* or container selector)
 * @returns {Promise<{ results: object[], totalPages: number, page: number }>}
 */
export async function getExercises(
  {
    bodypart = '',
    muscles = '',
    equipment = '',
    keyword = '',
    page = 1,
    limit = PAGE_LIMIT.EXERCISES,
  } = {},
  { loader } = {},
) {
  const { data } = await http.get(ENDPOINTS.exercises, {
    params: { bodypart, muscles, equipment, keyword, page, limit },
    meta: { loader },
  });

  return normalizePaginated(data);
}

/**
 * Fetches a single exercise by id (for the exercise modal).
 * @param {string} id
 * @param {{ loader?: string }} [options]
 * @returns {Promise<object>}
 */
export async function getExerciseById(id, { loader } = {}) {
  const { data } = await http.get(ENDPOINTS.exerciseById(id), {
    meta: { loader },
  });

  return normalizeEntity(data);
}

/**
 * Submits a rating for an exercise.
 * @param {string} id
 * @param {{ rate: number, email: string, review: string }} payload
 * @param {{ loader?: string }} [options]
 * @returns {Promise<object>}
 */
export async function rateExercise(id, payload, { loader } = {}) {
  const { data } = await http.patch(ENDPOINTS.rating(id), payload, {
    meta: { loader },
  });

  return normalizeEntity(data);
}
