import Animations from './Animations'
import { isPromiseReady, promisePolyfill } from './tools'

export default class {
  constructor() {
    this.animations = null

    if (!isPromiseReady()) {
      promisePolyfill()
    }
  }

  /**
   * init
   * @param swiper
   */
  init(swiper) {
    // Rebind when another swiper instance is passed, e.g. after a single page
    // application re-creates the slider. A failed construction leaves the
    // previous binding untouched, and calling init() without an argument keeps
    // the existing one.
    if (!this.animations || (swiper && this.animations.swiper !== swiper)) {
      const previous = this.animations
      this.animations = new Animations(swiper)

      if (previous) {
        previous._invalidate()
      }
    }

    return this
  }

  /**
   * run animations
   * @return {*}
   */
  animate() {
    if (!isPromiseReady()) {
      return setTimeout(() => this.animate(), 5e2)
    }

    return this.animations.animate()
  }
}
