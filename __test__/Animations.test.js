/* eslint no-undef: off */
import Swiper from 'swiper'

import Animations from '../src/Animations'

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

describe('animations default test', () => {
  const animations = new Animations(mySwiper)

  it('animations default properties', () => {
    expect(animations.swiper).toBe(mySwiper)
    expect(animations.container).toBe(container)
  })

  it('test animate', () => animations.animate())
})

describe('coverall getSwiperContainer', () => {
  it('mock swiper 3', () => {
    mySwiper.el = null
    mySwiper.container = [container]

    const animations = new Animations(mySwiper)
    expect(animations.swiper).toBe(mySwiper)
    expect(animations.container).toBe(container)
  })

  it('mock illegal swiper instance', () => {
    mySwiper.el = null
    mySwiper.container = null

    expect(() => new Animations(mySwiper)).toThrow()
  })
})
