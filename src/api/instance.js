import axios from 'axios';
import { hideLoader, showLoader } from '../components/ui/loader/loader.js';
import { API_BASE_URL, LOADER } from '../utils/constants.js';
import { notifyError } from '../utils/notify.js';

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

/**
 * @param {import('axios').InternalAxiosRequestConfig} [config]
 * @returns {string}
 */
function loaderMode(config) {
  return config?.meta?.loader ?? LOADER.GLOBAL;
}

http.interceptors.request.use((config) => {
  showLoader(loaderMode(config));
  return config;
});

http.interceptors.response.use(
  (response) => {
    hideLoader(loaderMode(response.config));
    return response;
  },
  (error) => {
    hideLoader(loaderMode(error.config));
    notifyError(toUserMessage(error));
    return Promise.reject(error);
  },
);

/**
 * Maps a technical Axios error to a safe user-facing message.
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
function toUserMessage(error) {
  if (error.response) {
    const { status } = error.response;

    if (status === 404) return 'Not found. Please try again.';
    if (status >= 500) return 'Server error. Please try later.';

    return 'Request failed. Please check your input.';
  }

  if (error.code === 'ECONNABORTED') return 'Request timed out. Please retry.';

  return 'Network error. Check your connection.';
}
