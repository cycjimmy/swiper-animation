import nodeListToArray from '@cycjimmy/awesome-js-funcs/typeConversion/nodeListToArray';

import cacheAnimations from './cacheAnimations';
import runAnimations from './runAnimations';
import runOutAnimations from './runOutAnimations';
import clearAnimations from './clearAnimations';

/**
 * getSwiperContainer
 * @param swiper
 * @returns {null|*|Object}
 */
const getSwiperContainer = (swiper) => {
  if (swiper.el) {
    // swiper 4+
    return swiper.el;
  }

  if (swiper.container) {
    // swiper 3.x
    // eslint-disable-next-line prefer-destructuring
    return swiper.container[0];
  }

  throw new Error('Illegal swiper instance');
};

export default class {
  constructor(swiper) {
    this.swiper = swiper;
    this.container = getSwiperContainer(this.swiper);
    this.animationElements = [
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation]')),
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation-once]'))
    ];
    this.activeElements = [];

    cacheAnimations(this.animationElements);
  }

  /**
   * animate
   * @returns {Promise<unknown[]>}
   */
  animate() {
    return Promise.resolve()
      .then(() => runOutAnimations(this.activeElements))
      .then(() => clearAnimations(this.activeElements))
      .then(() => runAnimations(this._updateActiveElements()));
  }

  /**
   * update activeElements
   * @returns {[]|*[]|*}
   * @private
   */
  _updateActiveElements() {
    this.activeElements = [
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]')
      ),
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]')
      )
    ];

    return this.activeElements;
  }
}
