/* eslint no-undef: off */
import cacheAnimations from '../src/cacheAnimations'
import runOutAnimations from '../src/runOutAnimations'

const swiperOutAnimation = 'outEffect'

describe('runOutAnimations default test', () => {
  const testEl01 = document.createElement('div')
  testEl01.dataset.swiperOutAnimation = swiperOutAnimation
  const testEl02 = document.createElement('div')
  const activeElements = [testEl01, testEl02]
  cacheAnimations(activeElements)

  it('runOutAnimations test', () => {
    activeElements.forEach((el) => {
      el.animationData.isRecovery = false
    })
    return runOutAnimations(activeElements).then(() => {
      expect(testEl01.classList.contains(swiperOutAnimation)).toBe(true)

      testEl01.animationData.isRecovery = true
      return runOutAnimations(activeElements)
    })
  })
})

describe('runOutAnimations test when animationData is undefined', () => {
  it('skips elements which were never cached', () => {
    const testEl = document.createElement('div')
    testEl.className = 'untouched'

    return runOutAnimations([testEl]).then(() => {
      expect(testEl.animationData).toBeUndefined()
      expect(testEl.className).toBe('untouched')
    })
  })

  it('still runs the out animation of the cached elements of a mixed list', () => {
    const cachedEl = document.createElement('div')
    cachedEl.dataset.swiperOutAnimation = swiperOutAnimation
    cacheAnimations([cachedEl])
    cachedEl.animationData.isRecovery = false

    const uncachedEl = document.createElement('div')

    return runOutAnimations([cachedEl, uncachedEl]).then(() => {
      expect(cachedEl.classList.contains(swiperOutAnimation)).toBe(true)
      expect(uncachedEl.animationData).toBeUndefined()
    })
  })
})
