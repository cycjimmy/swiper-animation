/* eslint no-undef: off */
import cacheAnimations from '../src/cacheAnimations'
import clearAnimations from '../src/clearAnimations'

const swiperAnimation = 'effect'

describe('clearAnimations default test', () => {
  const testEl01 = document.createElement('div')
  testEl01.dataset.swiperAnimationOnce = swiperAnimation
  const testEl02 = document.createElement('div')
  testEl01.dataset.swiperAnimation = swiperAnimation
  const activeElements = [testEl01, testEl02]
  cacheAnimations(activeElements)

  it('clearAnimations default test', () => clearAnimations(activeElements).then(() => {
    expect(testEl01.animationData.isRecovery).toBe(true)
  }))

  it('clearAnimations test', () => {
    activeElements.forEach((el) => {
      el.animationData.isRecovery = false
    })

    return clearAnimations(activeElements).then(() => {
      expect(testEl02.animationData.isRecovery).toBe(true)
      expect(testEl02.classList.contains(swiperAnimation)).toBe(false)
    })
  })
})

describe('clearAnimations test when animationData is undefined', () => {
  it('skips elements which were never cached', () => {
    const testEl = document.createElement('div')
    testEl.className = 'untouched'
    testEl.style.visibility = 'visible'

    return clearAnimations([testEl]).then(() => {
      expect(testEl.animationData).toBeUndefined()
      expect(testEl.className).toBe('untouched')
      expect(testEl.style.visibility).toBe('visible')
    })
  })

  it('still recovers the cached elements of a mixed list', () => {
    const cachedEl = document.createElement('div')
    cachedEl.dataset.swiperAnimation = swiperAnimation
    cacheAnimations([cachedEl])
    cachedEl.animationData.isRecovery = false
    cachedEl.classList.add(swiperAnimation, 'animated')
    cachedEl.style.visibility = 'visible'

    const uncachedEl = document.createElement('div')
    uncachedEl.className = 'untouched'

    return clearAnimations([cachedEl, uncachedEl]).then(() => {
      expect(cachedEl.animationData.isRecovery).toBe(true)
      expect(cachedEl.classList.contains(swiperAnimation)).toBe(false)
      expect(cachedEl.classList.contains('animated')).toBe(false)
      expect(cachedEl.style.visibility).toBe('hidden')
      expect(uncachedEl.animationData).toBeUndefined()
      expect(uncachedEl.className).toBe('untouched')
    })
  })
})
