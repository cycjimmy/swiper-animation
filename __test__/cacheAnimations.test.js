/* eslint no-undef: off */
import cacheAnimations from '../src/cacheAnimations'

describe('cacheAnimations default test', () => {
  const testEl01 = document.createElement('div')
  const testEl02 = document.createElement('div')
  testEl02.style.width = '10px'

  it('cacheAnimations', () => {
    cacheAnimations([testEl01, testEl02])
    expect(testEl01.animationData).toBeTruthy()
    expect(testEl01.animationData.isRecovery).toBe(true)
  })
})

describe('cacheAnimations idempotency test', () => {
  it('keeps the first snapshot when the element is cached again', () => {
    const testEl = document.createElement('div')
    testEl.dataset.swiperAnimation = 'animate__fadeIn'
    testEl.style.color = 'red'

    cacheAnimations([testEl])
    const { animationData } = testEl
    const { styleCache } = animationData

    // simulate a running animation before the element is scanned a second time
    testEl.style.cssText += ' animation-duration: 1s;'
    animationData.isRecovery = false

    cacheAnimations([testEl])

    expect(testEl.animationData).toBe(animationData)
    expect(testEl.animationData.styleCache).toBe(styleCache)
    expect(testEl.animationData.isRecovery).toBe(false)
  })

  it('caches an element that is listed twice only once', () => {
    const testEl = document.createElement('div')
    testEl.dataset.swiperAnimationOnce = 'animate__fadeIn'

    cacheAnimations([testEl, testEl])

    expect(testEl.animationData.runOnce).toBe(true)
    expect(testEl.animationData.styleCache).toBe('visibility: hidden;')
  })
})
