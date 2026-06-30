import { ENDPOINTS } from '../utils/constants.js';
import { http } from './instance.js';

/**
 * Fetches the quote of the day.
 * @param {{ loader?: string }} [options] - loader target (LOADER.* or container selector)
 * @returns {Promise<{ author: string, quote: string }>}
 */
export async function getQuote({ loader } = {}) {
  const { data } = await http.get(ENDPOINTS.quote, { meta: { loader } });
  return data;
}
