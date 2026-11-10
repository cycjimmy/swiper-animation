import nodeListToArray from '@cycjimmy/awesome-js-funcs/esm/typeConversion/nodeListToArray'

import cacheAnimations from './cacheAnimations'
import clearAnimations from './clearAnimations'
import runAnimations from './runAnimations'
import runOutAnimations from './runOutAnimations'

/**
 * getSwiperContainer
 * @param swiper
 * @returns {null | * | object} The container element of the swiper instance
 */
function getSwiperContainer(swiper) {
  if (swiper.el) {
    // swiper 4+
    return swiper.el
  }

  if (swiper.container) {
    // swiper 3.x

    return swiper.container[0]
  }

  throw new Error('Illegal swiper instance')
}

export default class {
  constructor(swiper) {
    this.swiper = swiper
    this.container = getSwiperContainer(this.swiper)
    this.animationElements = [
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation]')),
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation-once]')),
    ]
    this.activeElements = []

    cacheAnimations(this.animationElements)
  }

  /**
   * animate
   * @returns {Promise<unknown[]>} Resolves when the whole animation round is done
   */
  animate() {
    return Promise.resolve()
      .then(() => runOutAnimations(this.activeElements))
      .then(() => clearAnimations(this.activeElements))
      .then(() => runAnimations(this._updateActiveElements()))
  }

  /**
   * update activeElements
   * @returns {[]|*[]|*} The animation elements of the active slide
   * @private
   */
  _updateActiveElements() {
    this.activeElements = [
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]'),
      ),
      ...nodeListToArray(
        this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]'),
      ),
    ]

    return this.activeElements
  }
}
