/* eslint no-undef: off */
import { isPromiseReady, promisePolyfill } from '../src/tools';

describe('Tools test', () => {
  it('isPromiseReady test', () => {
    expect(isPromiseReady()).toBe(true);
  });

  it('promisePolyfill test', () => {
    promisePolyfill();
  });

  it('promisePolyfill test when Promise undefined', (done) => {
    // mock Promise undefined
    window.Promise = null;

    expect(isPromiseReady()).toBe(false);

    promisePolyfill();
    setTimeout(promisePolyfill, 1e3);
    setTimeout(done, 2e3);
  });
});
