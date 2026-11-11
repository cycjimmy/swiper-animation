/* eslint no-undef: off */
import Swiper from 'swiper'

import SwiperAnimation from '../src/index'

// mock swiper
const container = document.createElement('div')
// swiper 9+ reads the computed style of the wrapper element while mounting, so
// the container needs the markup a real Swiper instance expects
container.innerHTML = '<div class="swiper-wrapper"><div class="swiper-slide"></div></div>'
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
