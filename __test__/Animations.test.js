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
  const createSwiper = (slides, visibleSlides) => {
    const el = document.createElement('div')
    slides.forEach(slide => el.appendChild(slide))

    // jsdom does not lay the elements out, so the rendered box is stubbed for
    // the layout model path
    el.getClientRects = () => [el]

    return {
      el,
      slides,
      activeIndex: 0,
      visibleSlides,
      // Swiper only fills `visibleSlides` while the progress is watched
      params: {
        watchSlidesProgress: Array.isArray(visibleSlides),
      },
    }
  }

  const createAnimatedElement = (slide, datasetKey = 'swiperAnimation') => {
    const element = document.createElement('div')
    element.dataset[datasetKey] = 'animate__fadeIn'
    slide.appendChild(element)

    return element
  }

  // Swiper 3-5 expose the slides as a Dom7 collection: `filter` gets
  // `(index, element)` and the collection itself is not iterable
  const createDom7Slides = (elements) => {
    const collection = {
      length: elements.length,
      filter(callback) {
        return createDom7Slides(elements.filter((el, index) => callback(index, el)))
      },
    }

    elements.forEach((el, index) => {
      collection[index] = el
    })

    return collection
  }

  it('animates every slide inside the viewport', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB, 'swiperAnimationOnce')

    // `slidesPerView` greater than 1
    const animations = new Animations(createSwiper([slideA, slideB], [slideA, slideB]))
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA, elementB])
    expect(elementA.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementB.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementB.style.visibility).toBe('visible')
  })

  it('keeps the active slide when the viewport ignores it', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)

    const animations = new Animations(createSwiper([slideA, slideB], [slideB]))
    await animations.animate()

    expect(animations.activeElements).toEqual([elementB, elementA])
    expect(elementA.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementB.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('falls back to the active slide without a visible slide list', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)

    // Swiper 3-5 and a viewport which has not been measured yet
    const animations = new Animations(createSwiper([slideA, slideB]))
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA])
    expect(elementA.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementB.classList.contains('animate__fadeIn')).toBe(false)
    expect(elementB.style.visibility).toBe('hidden')
  })

  it('measures the viewport when swiper reports no visible slide', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    // `watchSlidesProgress` is disabled, so `swiper.visibleSlides` stays empty
    const swiper = createSwiper([slideA, slideB, slideC])
    const mockRect = (left, right) => () => ({ left, right, top: 0, bottom: 100 })

    swiper.el.getBoundingClientRect = mockRect(0, 200)
    slideA.getBoundingClientRect = mockRect(0, 100)
    slideB.getBoundingClientRect = mockRect(100, 200)
    slideC.getBoundingClientRect = mockRect(200, 300)

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA, elementB])
    expect(elementB.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementC.classList.contains('animate__fadeIn')).toBe(false)
  })

  it('ignores the overlap of the container border', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    const swiper = createSwiper([slideA, slideB, slideC])
    const mockRect = (left, right) => () => ({ left, right, top: 0, bottom: 100 })

    // A bordered container reports a rect which includes both borders, while
    // Swiper lays the slides out in the padding box.
    swiper.el.style.border = '1px solid'
    swiper.el.getBoundingClientRect = mockRect(0, 202)
    slideA.getBoundingClientRect = mockRect(1, 101)
    slideB.getBoundingClientRect = mockRect(101, 201)
    slideC.getBoundingClientRect = mockRect(201, 301)

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA, elementB])
    expect(elementC.style.visibility).toBe('hidden')
  })

  it('animates a slide which is only partly inside the viewport', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    // `slidesPerView: 2.5`
    const swiper = createSwiper([slideA, slideB, slideC])
    const mockRect = (left, right) => () => ({ left, right, top: 0, bottom: 100 })

    swiper.el.getBoundingClientRect = mockRect(0, 250)
    slideA.getBoundingClientRect = mockRect(0, 100)
    slideB.getBoundingClientRect = mockRect(100, 200)
    slideC.getBoundingClientRect = mockRect(200, 300)

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA, elementB, elementC])
    expect(elementC.style.visibility).toBe('visible')
  })

  it('uses the target layout while the wrapper is still moving', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    const swiper = createSwiper([slideA, slideB, slideC])
    const mockRect = (left, right) => () => ({ left, right, top: 0, bottom: 100 })

    // The DOM still shows the pre-transition layout: slideA and slideB
    swiper.el.getBoundingClientRect = mockRect(0, 400)
    slideA.getBoundingClientRect = mockRect(0, 200)
    slideB.getBoundingClientRect = mockRect(200, 400)
    slideC.getBoundingClientRect = mockRect(400, 600)

    // The swiper model already points at the target layout: slideB and slideC
    swiper.activeIndex = 1
    swiper.translate = -200
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200
    slideC.swiperSlideOffset = 400

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementB, elementC])
    expect(elementB.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementC.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('runs the entering animation again when a slide comes back', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    createAnimatedElement(slideB)

    const swiper = createSwiper([slideA, slideB])
    swiper.translate = 0
    swiper.size = 200
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200

    const animations = new Animations(swiper)
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(false)

    // slide to B: A leaves the viewport and has to be reset
    swiper.translate = -200
    swiper.activeIndex = 1
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(true)
    expect(elementA.classList.contains('animate__fadeIn')).toBe(false)

    // back to A: the reset element runs its entering animation again
    swiper.translate = 0
    swiper.activeIndex = 0
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(false)
    expect(elementA.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('reads the Dom7 slide collection of Swiper 3-5', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    createAnimatedElement(slideB)

    // no layout model, so the rendered positions are measured
    const swiper = createSwiper([slideA, slideB])
    swiper.slides = createDom7Slides([slideA, slideB])

    const animations = new Animations(swiper)
    await animations.animate()

    // jsdom measures no viewport, so only the active slide is animated
    expect(animations.activeElements).toEqual([elementA])
  })

  it('reads a Dom7 slide collection with the layout model', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)

    const swiper = createSwiper([slideA, slideB])
    swiper.slides = createDom7Slides([slideA, slideB])
    swiper.translate = 0
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA, elementB])
  })

  it('reads the target layout in RTL', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    const swiper = createSwiper([slideA, slideB, slideC])
    swiper.rtlTranslate = true
    swiper.translate = 200
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200, 200]
    slideA.swiperSlideOffset = 200
    slideB.swiperSlideOffset = 0
    slideC.swiperSlideOffset = -200
    swiper.activeIndex = 1

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementB, elementC])
  })

  it('aligns the offsets with the first slide in css mode', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    const swiper = createSwiper([slideA, slideB, slideC])
    swiper.params = { cssMode: true, centeredSlides: true }
    swiper.translate = -200
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200, 200]
    slideA.swiperSlideOffset = 100
    slideB.swiperSlideOffset = 300
    slideC.swiperSlideOffset = 500
    swiper.activeIndex = 1

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementB, elementC])
  })

  it('resets the elements of a round which is superseded during its out animation', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    elementA.dataset.swiperOutAnimation = 'animate__fadeOut'
    createAnimatedElement(slideB)
    createAnimatedElement(slideC)

    const swiper = createSwiper([slideA, slideB, slideC])
    swiper.translate = 0
    swiper.size = 200
    swiper.slidesSizesGrid = [200, 200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200
    slideC.swiperSlideOffset = 400

    const animations = new Animations(swiper)
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(false)

    // slideA starts its out animation, which takes 500ms
    swiper.translate = -200
    swiper.activeIndex = 1
    const supersededRound = animations.animate()

    // slide away while the out animation of slideA is still running
    await new Promise(resolve => setTimeout(resolve, 50))
    swiper.translate = -400
    swiper.activeIndex = 2
    await animations.animate()
    await supersededRound

    expect(elementA.animationData.isRecovery).toBe(true)
    expect(elementA.classList.contains('animate__fadeOut')).toBe(false)
  })

  it('restores a slide which comes back before its out animation ends', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    elementA.dataset.swiperOutAnimation = 'animate__fadeOut'
    createAnimatedElement(slideB)

    const swiper = createSwiper([slideA, slideB])
    swiper.translate = 0
    swiper.size = 200
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200

    const animations = new Animations(swiper)
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(false)

    // slideA starts its out animation, which takes 500ms
    swiper.translate = -200
    swiper.activeIndex = 1
    const leavingRound = animations.animate()

    // back to slideA before the out animation ends
    await new Promise(resolve => setTimeout(resolve, 50))
    swiper.translate = 0
    swiper.activeIndex = 0
    await animations.animate()
    await leavingRound

    expect(elementA.classList.contains('animate__fadeOut')).toBe(false)
    expect(elementA.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementA.animationData.isRecovery).toBe(false)
  })

  it('ignores the visible slide list after the progress watching is disabled', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const slideC = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)
    const elementC = createAnimatedElement(slideC)

    // the list left over from `watchSlidesProgress: true`
    const swiper = createSwiper([slideA, slideB, slideC], [slideA, slideB])
    swiper.params = { watchSlidesProgress: false }
    swiper.translate = -200
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200
    slideC.swiperSlideOffset = 400
    swiper.activeIndex = 1

    const animations = new Animations(swiper)
    await animations.animate()

    // the stale list would keep slideA and leave slideC hidden
    expect(animations.activeElements).toEqual([elementB, elementC])
    expect(elementA.animationData.isRecovery).toBe(true)
    expect(elementC.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('reads the active column in grid mode', async () => {
    const slides = []

    for (let index = 0; index < 6; index += 1) {
      slides.push(document.createElement('div'))
    }
    const elements = slides.map(slide => createAnimatedElement(slide))

    // two rows, three columns
    const swiper = createSwiper(slides)
    swiper.params = {
      grid: { rows: 2 },
      watchSlidesProgress: false,
    }
    swiper.size = 200
    swiper.slidesSizesGrid = [200, 200, 200, 200, 200, 200]
    slides.forEach((slide, index) => {
      slide.column = Math.floor(index / 2)
      slide.swiperSlideOffset = Math.floor(index / 2) * 200
    })

    const animations = new Animations(swiper)
    await animations.animate()
    expect(animations.activeElements).toEqual([elements[0], elements[1]])

    // the second column scrolls into the viewport
    swiper.translate = -200
    swiper.activeIndex = 1
    await animations.animate()

    expect(animations.activeElements).toEqual([elements[2], elements[3]])
    expect(elements[0].animationData.isRecovery).toBe(true)
    expect(elements[1].animationData.isRecovery).toBe(true)
  })

  it('animates the active slide only while the container is not rendered', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB, 'swiperAnimationOnce')

    const swiper = createSwiper([slideA, slideB])
    // `display: none` keeps the stored size, but removes the rendered box and
    // reports a zero offset for every slide
    swiper.el.getClientRects = () => []
    swiper.translate = 0
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 0

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA])
    // the once animation of the second slide must not be consumed while hidden
    expect(elementB.classList.contains('animate__fadeIn')).toBe(false)
  })

  it('ignores the visible slide list of a hidden container', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB, 'swiperAnimationOnce')

    // `watchSlidesProgress` has already filled the list with every slide, which
    // happens when the offsets are measured while the container is hidden
    const swiper = createSwiper([slideA, slideB], [slideA, slideB])
    swiper.el.getClientRects = () => []
    swiper.translate = 0
    swiper.size = 400
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 0

    const animations = new Animations(swiper)
    await animations.animate()

    expect(animations.activeElements).toEqual([elementA])
    expect(elementB.classList.contains('animate__fadeIn')).toBe(false)
  })

  it('retries the reset when a clear is rejected', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    createAnimatedElement(slideB)

    const swiper = createSwiper([slideA, slideB])
    swiper.translate = 0
    swiper.size = 200
    swiper.slidesSizesGrid = [200, 200]
    slideA.swiperSlideOffset = 0
    slideB.swiperSlideOffset = 200

    const animations = new Animations(swiper)
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(false)

    // the reset of slideA fails once
    Object.defineProperty(elementA, 'classList', {
      configurable: true,
      get() {
        throw new Error('clear failed')
      },
    })

    swiper.translate = -200
    swiper.activeIndex = 1
    await expect(animations.animate()).rejects.toThrow('clear failed')

    // the leaving element is still tracked and the next round resets it
    delete elementA.classList
    await animations.animate()
    expect(elementA.animationData.isRecovery).toBe(true)
  })

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

    // the latest call does not clear an element which is still inside the viewport
    const removals = classNames.filter(className => !className.includes('animate__fadeIn'))

    expect(rounds[0]).toEqual([])
    expect(removals).toHaveLength(0)
    expect(element.classList.contains('animate__fadeIn')).toBe(true)
  })

  it('does not reset a slide which stays inside the viewport', async () => {
    const slideA = document.createElement('div')
    const slideB = document.createElement('div')
    const elementA = createAnimatedElement(slideA)
    const elementB = createAnimatedElement(slideB)

    // `slidesPerView: 2`: both slides are visible before and after the change
    const swiper = createSwiper([slideA, slideB], [slideA, slideB])
    const animations = new Animations(swiper)
    await animations.animate()

    const classNames = []
    const observer = new MutationObserver(() => classNames.push(elementB.className))
    observer.observe(elementB, {
      attributes: true,
      attributeFilter: ['class'],
    })

    swiper.activeIndex = 1
    swiper.visibleSlides = [slideB]
    await animations.animate()
    await new Promise(resolve => setTimeout(resolve, 0))
    observer.disconnect()

    // resetting slideB would hide it for a frame and make the slide flash
    const removals = classNames.filter(className => !className.includes('animate__fadeIn'))

    expect(removals).toHaveLength(0)
    expect(elementB.classList.contains('animate__fadeIn')).toBe(true)
    expect(elementB.animationData.isRecovery).toBe(false)
    expect(elementA.animationData.isRecovery).toBe(true)
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
