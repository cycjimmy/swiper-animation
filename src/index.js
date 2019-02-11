import nodeListToArray from 'awesome-js-funcs/typeConversion/nodeListToArray';

const sHidden = 'visibility: hidden;';
const PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js';

export default class SwiperAnimation {
  constructor() {
    this.swiper = null;
    this.allBoxes = [];

    this.appendedPromise = false;
    this.isPromiseReady = false;
  };

  init(swiper) {
    if (!this.swiper) {
      this.swiper = swiper;
    }

    if (this.isPromiseReady || window.Promise) {
      this.isPromiseReady = true;
      return this;
    }

    // fix "Promise Is Undefined" in IE
    this._initPromisePolyfill(() => {
      this.isPromiseReady = true;
    });
    return this;
  };

  /**
   * run animations
   * @return {*}
   */
  animate() {
    if (!this.isPromiseReady) {
      return setTimeout(() => this.animate(), 5e2);
    }

    return Promise.resolve()
      .then(() => this._cache())
      .then(() => this._clear())
      .then(() => {
        const activeBoxes = nodeListToArray(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]'));

        const runAnimations = activeBoxes.map(el => new Promise(resolve => {
          const
            effect = el.dataset.swiperAnimation || ''
            , duration = el.dataset.duration || '.5s'
            , delay = el.dataset.delay || '.5s'
          ;

          el.style.visibility = 'visible';

          el.style.cssText += ' animation-duration:' + duration
            + '; -webkit-animation-duration:' + duration
            + '; animation-delay:' + delay
            + '; -webkit-animation-delay:' + delay
            + ';';

          el.classList.add(effect, 'animated');

          el.isRecovery = false;

          setTimeout(() => resolve(), 0);
        }));

        return Promise.all(runAnimations);
      });
  };

  _clear() {
    const _runClearTasks = this.allBoxes.map(el => new Promise(resolve => {
      if (el.isRecovery) {
        resolve();
        return;
      }

      // recovery
      if (el.styleCache) {
        el.style.cssText = el.styleCache;
        el.classList.remove('animated');

        if (el.dataset.swiperAnimation) {
          el.classList.remove(el.dataset.swiperAnimation);
        }
      }

      el.isRecovery = true;
      setTimeout(() => resolve(), 0);
    }));

    return Promise.all(_runClearTasks);
  };

  /**
   * cache allBoxes style
   * @return {*}
   * @private
   */
  _cache() {
    // has cached
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    console.log('cache');

    // start cache
    return new Promise(resolve => {
      this._initAllBoxes();
      setTimeout(() => resolve(), 0);
    })
      .then(() => {

        const _runCacheTasks = this.allBoxes.map(el => new Promise(resolve => {
          if (el.attributes['style']) {
            el.styleCache = sHidden + el.style.cssText;
          } else {
            el.styleCache = sHidden;
          }
          el.style.cssText = el.styleCache;
          el.isRecovery = true;  // add el property isRecovery

          setTimeout(() => resolve(), 0);
        }));

        return Promise.all(_runCacheTasks);
      });
  };

  /**
   * init this.allBoxes
   * @private
   */
  _initAllBoxes() {
    if (!this.allBoxes.length) {
      let
        swiperWrapper = null
      ;

      if (this.swiper.wrapperEl) {
        // swiper 4
        swiperWrapper = this.swiper.wrapperEl;
      } else if (this.swiper.wrapper) {
        // swiper 3+
        swiperWrapper = this.swiper.wrapper[0];
      }

      this.allBoxes = nodeListToArray(swiperWrapper.querySelectorAll('[data-swiper-animation]'));
    }
  };

  /**
   * init PromisePolyfill
   * @param callback
   * @private
   */
  _initPromisePolyfill(callback = () => {
  }) {
    // just add promise-polyfill script once
    if (this.appendedPromise) {
      return;
    }

    let oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.onload = () => callback();
    oScript.src = PROMISE_POLYFILL_URL;
    document.querySelector('head').appendChild(oScript);
    this.appendedPromise = true;
  };
};
