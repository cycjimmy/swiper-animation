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

describe('animations test after the DOM is re-rendered', () => {
  const createSwiper = (slides) => {
    const el = document.createElement('div')
    slides.forEach(slide => el.appendChild(slide))

    return { el, slides, activeIndex: 0 }
  }

  it('caches the elements rendered after the instance was created', async () => {
    const slide = document.createElement('div')
    const swiper = createSwiper([slide])
    const animations = new Animations(swiper)

    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slide.appendChild(element)

    expect(element.animationData).toBeUndefined()

    await animations.animate()
    expect(element.animationData).toBeTruthy()
    expect(element.classList.contains('animate__fadeIn')).toBe(true)

    // the round which used to reject with `isRecovery of undefined`
    await expect(animations.animate()).resolves.toBeDefined()
    expect(element.animationData.styleCache).toBe('visibility: hidden;')
  })

  it('keeps the original style snapshot across rounds', async () => {
    const slide = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    element.style.color = 'red'
    slide.appendChild(element)

    const animations = new Animations(createSwiper([slide]))
    const { styleCache } = element.animationData

    await animations.animate()
    await animations.animate()

    expect(element.animationData.styleCache).toBe(styleCache)
  })

  it('resolves when the swiper has no active slide', async () => {
    await expect(new Animations(createSwiper([])).animate()).resolves.toEqual([])

    const swiper = createSwiper([])
    swiper.activeIndex = 2
    await expect(new Animations(swiper).animate()).resolves.toEqual([])
  })

  it('takes over the elements left animated by a previous instance', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slideA.appendChild(element)

    const swiper = createSwiper([slideA, slideB])
    await new Animations(swiper).animate()
    expect(element.animationData.isRecovery).toBe(false)

    // a re-created swiper reuses the container and starts from the second slide
    swiper.activeIndex = 1
    const animations = new Animations(swiper)

    expect(animations.activeElements).toEqual([element])

    await animations.animate()
    expect(element.animationData.isRecovery).toBe(true)
    expect(element.classList.contains('animate__fadeIn')).toBe(false)
  })

  it('does not clean up the round which was started later', async () => {
    const slide = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimation = 'animate__fadeIn'
    slide.appendChild(element)

    const animations = new Animations(createSwiper([slide]))
    await animations.animate()

    const classNames = []
    const observer = new MutationObserver(() => classNames.push(element.className))
    observer.observe(element, {
      attributes: true,
      attributeFilter: ['class'],
    })

    const rounds = await Promise.all([
      animations.animate(),
      animations.animate(),
    ])
    await new Promise(resolve => setTimeout(resolve, 0))
    observer.disconnect()

    // only the clear round of the latest call may remove the animation class
    const removals = classNames.filter(className => !className.includes('animate__fadeIn'))

    expect(rounds[0]).toEqual([])
    expect(removals).toHaveLength(1)
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('does not initialize once elements again after leaving and returning', async () => {
    const slideA = document.createElement('div')
    const element = document.createElement('div')
    element.dataset.swiperAnimationOnce = 'animate__fadeIn'
    slideA.appendChild(element)

    const secondSlide = document.createElement('div')
    const swiper = createSwiper([slideA, secondSlide])
    const animations = new Animations(swiper)
    const { animationData } = element

    await animations.animate()
    expect(element.animationData.isRecovery).toBe(false)

    swiper.activeIndex = 1
    await animations.animate()
    expect(element.animationData).toBe(animationData)
    expect(element.animationData.isRecovery).toBe(false)

    swiper.activeIndex = 0
    await animations.animate()
    expect(element.animationData).toBe(animationData)
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })
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
