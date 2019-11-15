import nodeListToArray from '@cycjimmy/awesome-js-funcs/typeConversion/nodeListToArray';
import functionToPromise from '@cycjimmy/awesome-js-funcs/typeConversion/functionToPromise';

import { isPromiseReady, promisePolyfill } from './tools';
import runAnimations from './runAnimations';
import clearAnimations from './clearAnimations';

const sHidden = 'visibility: hidden;';

export default class {
  constructor() {
    this.swiper = null;
    this.allBoxes = [];
    this.activeBoxes = [];

    if (!isPromiseReady()) {
      promisePolyfill();
    }
  }

  /**
   * init
   * @param swiper
   */
  init(swiper) {
    if (!this.swiper) {
      this.swiper = swiper;
    }

    return this;
  }

  /**
   * run animations
   * @return {*}
   */
  animate() {
    if (!isPromiseReady()) {
      return setTimeout(() => this.animate(), 5e2);
    }

    return Promise.resolve()
      .then(() => this._cache())
      .then(() => this._outAnimate())
      .then(() => this._clear())
      .then(() => runAnimations(this._updateActiveBoxes()));
  }

  _outAnimate() {
    const runOutTasks = this.activeBoxes.map((el) => {
      if (el.animationData.isRecovery) {
        return Promise.resolve();
      }

      if (!el.animationData.outEffect) {
        return Promise.resolve();
      }

      return functionToPromise(() => {
        el.style.cssText = el.styleCache;
        el.style.visibility = 'visible';
        el.style.cssText += ` animation-duration:${el.animationData.outDuration}; -webkit-animation-duration:${el.animationData.outDuration};`;

        el.classList.add(el.animationData.outEffect, 'animated');
      }, 500);
    });

    return Promise.all(runOutTasks);
  }

  /**
   * clearAnimations
   * @returns {Promise<Array>}
   * @private
   */
  _clear() {
    return clearAnimations(this.activeBoxes).then(() => (this.activeBoxes = []));
  }

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
        const runCacheTasks = this.allBoxes.map((el) =>
          functionToPromise(() => {
            el.animationData = {
              styleCache: el.attributes.style ? sHidden + el.style.cssText : sHidden,
              effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || '',
              duration: el.dataset.duration || '.5s',
              delay: el.dataset.delay || '.5s',
              outEffect: el.dataset.swiperOutAnimation || '',
              outDuration: el.dataset.outDuration || '.5s',
              isRecovery: true,
              runOnce: !!el.dataset.swiperAnimationOnce
            };

            el.style.cssText = el.animationData.styleCache;
          })
        );

        return Promise.all(runCacheTasks);
      });
  }

  /**
   * init this.allBoxes
   * @returns {Promise<void>}
   * @private
   */
  _initAllBoxes() {
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    return functionToPromise(() => {
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
        ...nodeListToArray(swiperWrapper.querySelectorAll('[data-swiper-animation-once]'))
      ];
    });
  }

  /**
   * update activeBoxes
   * @returns {[]|*[]|*}
   * @private
   */
  _updateActiveBoxes() {
    this.activeBoxes = [
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]')
      ),
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]')
      )
    ];

    return this.activeBoxes;
  }
}
