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

describe('swiperAnimation rebinding test', () => {
  const createSwiper = () => {
    const container = document.createElement('div')
    const slide = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slide.appendChild(element)
    container.appendChild(slide)

    return {
      el: container,
      slides: [slide],
      activeIndex: 0,
    }
  }

  it('keeps the bound animations when init() receives the same swiper', () => {
    const swiperAnimation = new SwiperAnimation()
    const swiper = createSwiper()

    swiperAnimation.init(swiper)
    const { animations } = swiperAnimation
    swiperAnimation.init(swiper)

    expect(swiperAnimation.animations).toBe(animations)
  })

  it('rebinds when init() receives a different swiper', () => {
    const swiperAnimation = new SwiperAnimation()
    const oldSwiper = createSwiper()
    const newSwiper = createSwiper()
    const oldElement = oldSwiper.slides[0].firstElementChild
    const newElement = newSwiper.slides[0].firstElementChild

    swiperAnimation.init(oldSwiper)
    const oldAnimations = swiperAnimation.animations

    swiperAnimation.init(newSwiper)
    expect(swiperAnimation.animations).not.toBe(oldAnimations)

    return swiperAnimation.animate().then(() => {
      expect(newElement.classList.contains('animate__fadeIn')).toBe(true)
      expect(oldElement.classList.contains('animate__fadeIn')).toBe(false)
    })
  })

  it('replays the animations when the new swiper reuses the container', async () => {
    const container = document.createElement('div')
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slideA.appendChild(element)
    container.append(slideA, slideB)

    const swiperAnimation = new SwiperAnimation()
    const oldSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 0,
    }

    await swiperAnimation.init(oldSwiper).animate()
    expect(element.classList.contains('animate__fadeIn')).toBe(true)

    // the slider is re-created on the same DOM and starts from the second slide
    const newSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 1,
    }

    await swiperAnimation.init(newSwiper).animate()
    expect(element.animationData.isRecovery).toBe(true)
    expect(element.classList.contains('animate__fadeIn')).toBe(false)

    newSwiper.activeIndex = 0
    await swiperAnimation.animate()
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('resets the animations of a node re-attached after the rebind', async () => {
    const container = document.createElement('div')
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slideA.appendChild(element)
    container.append(slideA, slideB)

    const swiperAnimation = new SwiperAnimation()
    const oldSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 0,
    }

    await swiperAnimation.init(oldSwiper).animate()
    expect(element.classList.contains('animate__fadeIn')).toBe(true)

    // the slider is re-created while the animated node is detached from the DOM
    element.remove()
    const newSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 1,
    }
    swiperAnimation.init(newSwiper)

    const classNames = []
    const observer = new MutationObserver(() => classNames.push(element.className))
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class'],
    })

    slideB.appendChild(element)
    await swiperAnimation.animate()
    await new Promise(resolve => setTimeout(resolve, 0))
    observer.disconnect()

    // the leftover state is reset before the entering animation runs again
    expect(classNames.some(className => !className.includes('animate__fadeIn'))).toBe(true)
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('ignores the pending round of a replaced instance', async () => {
    const container = document.createElement('div')
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    element.dataset.swiperOutAnimation = 'animate__fadeOut'
    slideA.appendChild(element)
    container.append(slideA, slideB)

    const swiperAnimation = new SwiperAnimation()
    const oldSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 0,
    }

    await swiperAnimation.init(oldSwiper).animate()
    const replacedAnimations = swiperAnimation.animations

    // leave a round pending: the out animation keeps it alive for 500ms
    const pendingRound = swiperAnimation.animate()

    element.remove()
    const newSwiper = {
      el: container,
      slides: [slideA, slideB],
      activeIndex: 1,
    }
    swiperAnimation.init(newSwiper)

    slideB.appendChild(element)
    await swiperAnimation.animate()

    await pendingRound

    // the replaced instance resolves without touching the DOM any more
    await expect(replacedAnimations.animate()).resolves.toEqual([])

    expect(element.animationData.isRecovery).toBe(false)
    expect(element.style.visibility).toBe('visible')
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('keeps the bound animations when init() receives no swiper', () => {
    const swiperAnimation = new SwiperAnimation()

    swiperAnimation.init(createSwiper())
    const { animations } = swiperAnimation

    expect(swiperAnimation.init()).toBe(swiperAnimation)
    expect(swiperAnimation.animations).toBe(animations)
  })

  it('keeps the bound animations when the new swiper is illegal', () => {
    const swiperAnimation = new SwiperAnimation()

    swiperAnimation.init(createSwiper())
    const { animations } = swiperAnimation

    expect(() => swiperAnimation.init({})).toThrow()
    expect(swiperAnimation.animations).toBe(animations)

    return swiperAnimation.animate()
  })
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
