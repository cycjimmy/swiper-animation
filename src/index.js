import nodeListToArray from 'awesome-js-funcs/typeConversion/nodeListToArray';

const sHidden = 'visibility: hidden;';
const PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js';

export default class SwiperAnimation {
  constructor() {
    this.swiper = null;
    this.allBoxes = [];
    this.activeBoxes = [];

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
      .then(() => this._outAnimate())
      .then(() => this._clear())
      .then(() => {
        this.activeBoxes = [
          ...nodeListToArray(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]')),
          ...nodeListToArray(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]')),
        ];

        const runAnimations = this.activeBoxes.map(el => new Promise(resolve => {
          el.style.visibility = 'visible';

          el.style.cssText += ' animation-duration:' + el.__animationData.duration
            + '; -webkit-animation-duration:' + el.__animationData.duration
            + '; animation-delay:' + el.__animationData.delay
            + '; -webkit-animation-delay:' + el.__animationData.delay
            + ';';

          el.classList.add(el.__animationData.effect, 'animated');
          el.__animationData.isRecovery = false;

          setTimeout(resolve, 0);
        }));

        return Promise.all(runAnimations);
      });
  };

  _outAnimate() {
    const _runOutTasks = this.activeBoxes.map(el => {
      if (el.__animationData.isRecovery) {
        return Promise.resolve();
      }

      if (!el.__animationData.outEffect) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        el.style.cssText = el.styleCache;
        el.style.visibility = 'visible';
        el.style.cssText += ' animation-duration:' + el.__animationData.outDuration
          + '; -webkit-animation-duration:' + el.__animationData.outDuration
          + ';';

        el.classList.add(el.__animationData.outEffect, 'animated');

        setTimeout(resolve, 500);
      });
    });

    return Promise.all(_runOutTasks)
  };

  _clear() {
    const _runClearTasks = this.activeBoxes.map(el => {
      if (el.__animationData.isRecovery) {
        return Promise.resolve();
      }

      if (el.__animationData.runOnce) {
        return Promise.resolve();
      }

      return new Promise(resolve => {
        // recovery
        el.style.cssText = el.__animationData.styleCache;

        el.classList.remove(
          ...[
            el.__animationData.effect,
            el.__animationData.outEffect,
            'animated',
          ].filter(str => !!str)
        );

        el.__animationData.isRecovery = true;
        setTimeout(resolve, 0);
      })
    });

    return Promise.all(_runClearTasks)
      .then(() => this.activeBoxes = []);
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

    // start cache
    return Promise.resolve()
      .then(() => this._initAllBoxes())
      .then(() => {
        const _runCacheTasks = this.allBoxes
          .map(el => new Promise(resolve => {
            el.__animationData = {
              styleCache: el.attributes['style']
                ? sHidden + el.style.cssText
                : sHidden,
              effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || '',
              duration: el.dataset.duration || '.5s',
              delay: el.dataset.delay || '.5s',
              outEffect: el.dataset.swiperOutAnimation || '',
              outDuration: el.dataset.outDuration || '.5s',
              isRecovery: true,
              runOnce: !!(el.dataset.swiperAnimationOnce),
            };

            el.style.cssText = el.__animationData.styleCache;

            setTimeout(resolve, 0);
          }));

        return Promise.all(_runCacheTasks);
      });
  };

  /**
   * init this.allBoxes
   * @returns {Promise<void>}
   * @private
   */
  _initAllBoxes() {
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    return new Promise(resolve => {
      let swiperWrapper = null;

      if (this.swiper.wrapperEl) {
        // swiper 4+
        swiperWrapper = this.swiper.wrapperEl;
      } else if (this.swiper.wrapper) {
        // swiper 3.x
        swiperWrapper = this.swiper.wrapper[0];
      }

      this.allBoxes = [
        ...nodeListToArray(swiperWrapper.querySelectorAll('[data-swiper-animation]')),
        ...nodeListToArray(swiperWrapper.querySelectorAll('[data-swiper-animation-once]')),
      ];

      setTimeout(resolve, 0);
    });
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

    const oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.onload = () => callback();
    oScript.src = PROMISE_POLYFILL_URL;
    document.querySelector('head').appendChild(oScript);
    this.appendedPromise = true;
  };
};
