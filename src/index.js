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
    if (!this.animations) {
      this.animations = new Animations(swiper)
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
