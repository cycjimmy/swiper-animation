/* eslint no-undef: off */
import Swiper from 'swiper'

import SwiperAnimation from '../src/index'

// mock swiper
const container = document.createElement('div')
const mySwiper = new Swiper(container)
// mock slides
mySwiper.slides = [
  document.createElement('div'),
]

describe('swiperAnimation default test', () => {
  const swiperAnimation = new SwiperAnimation()

  it('swiperAnimation.init return swiperAnimation instance', () => {
    expect(swiperAnimation.init(mySwiper)).toBe(swiperAnimation)
  })

  it('swiperAnimation.animate test', () => swiperAnimation.init(mySwiper).animate())
})

describe('swiperAnimation test when Promise undefined', () => {
  it('swiperAnimation test', (done) => {
    // mock Promise undefined
    window.Promise = null

    const swiperAnimation = new SwiperAnimation().init(mySwiper)
    swiperAnimation.animate()

    setTimeout(done, 1e3)
  })
})
