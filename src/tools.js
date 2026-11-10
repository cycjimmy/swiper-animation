const PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js'

let appendedPromisePolyfill = false

/**
 * isPromiseReady
 * @returns {boolean} Whether the native Promise is available
 */
export const isPromiseReady = () => !!window.Promise

/**
 * promisePolyfill
 */
export function promisePolyfill() {
  if (appendedPromisePolyfill) {
    return
  }

  if (isPromiseReady()) {
    return
  }

  const oScript = document.createElement('script')
  oScript.type = 'text/javascript'
  oScript.src = PROMISE_POLYFILL_URL
  document.querySelector('head').appendChild(oScript)

  appendedPromisePolyfill = true
}
