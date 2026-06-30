/**
 * @typedef {import('./constants.js').API_EVENT[keyof typeof import('./constants.js').API_EVENT]} ApiEventType
 */

/** @type {Map<ApiEventType, Set<(...args: never[]) => void>>} */
const listeners = new Map();

/**
 * Subscribes to API-layer UI events (loader, notifications).
 * @param {ApiEventType} type
 * @param {(...args: never[]) => void} handler
 * @returns {() => void}
 */
export function onApiEvent(type, handler) {
  if (!listeners.has(type)) {
    listeners.set(type, new Set());
  }

  listeners.get(type).add(handler);

  return () => listeners.get(type)?.delete(handler);
}

/**
 * @param {ApiEventType} type
 * @param {...never[]} args
 */
export function emitApiEvent(type, ...args) {
  listeners.get(type)?.forEach((handler) => handler(...args));
}
