import { ENDPOINTS, PAGE_LIMIT } from '../utils/constants.js';
import { http } from './instance.js';
import { normalizePaginated } from './normalizers.js';

/**
 * Fetches filter categories (Muscles / Body parts / Equipment).
 * @param {object} params
 * @param {string} params.filter - one of FILTER values
 * @param {number} [params.page]
 * @param {number} [params.limit]
 * @param {{ loader?: string }} [options] - loader target (LOADER.* or container selector)
 * @returns {Promise<{ results: object[], totalPages: number, page: number }>}
 */
export async function getFilters(
  { filter, page = 1, limit = PAGE_LIMIT.CATEGORIES },
  { loader } = {},
) {
  const { data } = await http.get(ENDPOINTS.filters, {
    params: { filter, page, limit },
    meta: { loader },
  });

  return normalizePaginated(data);
}
