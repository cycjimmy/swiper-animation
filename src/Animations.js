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

/**
 * isStaleElement
 * @param {HTMLElement} el
 * @returns {boolean} Whether the element still carries an unfinished animation round
 */
const isStaleElement = el => !el.animationData.isRecovery && !el.animationData.runOnce

export default class {
  constructor(swiper) {
    this.swiper = swiper
    this.container = getSwiperContainer(this.swiper)
    this.round = 0
    this.invalidated = false
    this.animationElements = [
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation]')),
      ...nodeListToArray(this.container.querySelectorAll('[data-swiper-animation-once]')),
    ]

    cacheAnimations(this.animationElements)

    // A container reused by a re-created swiper keeps the state left by the
    // previous instance. Those elements have to go through the first clear
    // round, otherwise their entering animation cannot run again. Once
    // animations are never repeated.
    this.activeElements = this.animationElements.filter(isStaleElement)
  }

  /**
   * animate
   * @returns {Promise<unknown[]>} Resolves when the whole animation round is done
   */
  animate() {
    const round = ++this.round

    return this._runStep(round, () => runOutAnimations(this.activeElements))
      .then(() => this._runStep(round, () => clearAnimations(this.activeElements)))
      .then(() => this._runStep(round, () => {
        this._updateActiveElements()

        // A node can be re-attached after this instance was created while still
        // carrying an unfinished round, so the active elements are checked
        // again before their entering animation runs.
        const staleElements = this.activeElements.filter(isStaleElement)

        return staleElements.length
          ? clearAnimations(staleElements)
          : undefined
      }))
      .then(() => this._runStep(round, () => runAnimations(this.activeElements)))
  }

  /**
   * invalidate
   * Stops the pending rounds of an instance which has been replaced by a new one
   * so that they cannot write to the DOM of the new binding.
   */
  _invalidate() {
    this.invalidated = true
  }

  /**
   * runStep
   * @param {number} round
   * @param {Function} step
   * @returns {Promise<*>} Resolves without running the step when the round is outdated
   * @private
   */
  _runStep(round, step) {
    return Promise.resolve().then(() => {
      if (this.invalidated || round !== this.round) {
        return []
      }

      return step()
    })
  }

  /**
   * update activeElements
   * @returns {[]|*[]|*} The animation elements of the active slide
   * @private
   */
  _updateActiveElements() {
    const slide = this.swiper.slides && this.swiper.slides[this.swiper.activeIndex]

    this.activeElements = slide
      ? [
          ...nodeListToArray(slide.querySelectorAll('[data-swiper-animation]')),
          ...nodeListToArray(slide.querySelectorAll('[data-swiper-animation-once]')),
        ]
      : []

    // Elements rendered after the instance was created (route remounts, async
    // slide content) have no cache yet. They are cached right before their
    // entering animation runs; cached elements are skipped by cacheAnimations.
    cacheAnimations(this.activeElements)

    return this.activeElements
  }
}
