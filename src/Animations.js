import nodeListToArray from '@cycjimmy/awesome-js-funcs/esm/typeConversion/nodeListToArray'

import cacheAnimations from './cacheAnimations'
import clearAnimations from './clearAnimations'
import runAnimations from './runAnimations'
import runOutAnimations from './runOutAnimations'

/**
 * getSwiperContainer
 * @param swiper
 * @returns {null | * | object} The container element of the swiper instance
 */
function getSwiperContainer(swiper) {
  if (swiper.el) {
    // swiper 4+
    return swiper.el
  }

  if (swiper.container) {
    // swiper 3.x

    return swiper.container[0]
  }

  throw new Error('Illegal swiper instance')
}

/**
 * isStaleElement
 * @param {HTMLElement} el
 * @returns {boolean} Whether the element still carries an unfinished animation round
 */
const isStaleElement = el => !el.animationData.isRecovery && !el.animationData.runOnce

/**
 * getAnimationElements
 * @param {HTMLElement} slide
 * @returns {HTMLElement[]} The elements of the slide carrying an animation attribute
 */
function getAnimationElements(slide) {
  return [
    ...nodeListToArray(slide.querySelectorAll('[data-swiper-animation]')),
    ...nodeListToArray(slide.querySelectorAll('[data-swiper-animation-once]')),
  ]
}

/**
 * getContainerViewport
 * @param {HTMLElement} container
 * @returns {{left: number, right: number, top: number, bottom: number}} The box Swiper lays the slides out in
 */
function getContainerViewport(container) {
  const rect = container.getBoundingClientRect()
  const style = getComputedStyle(container)
  const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0
  const borderRight = Number.parseFloat(style.borderRightWidth) || 0
  const borderTop = Number.parseFloat(style.borderTopWidth) || 0
  const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0

  // Swiper sizes the slides from `clientWidth` / `clientHeight`, so the border
  // of the container is outside the viewport even though the rect includes it.
  return {
    left: rect.left + borderLeft,
    right: rect.right - borderRight,
    top: rect.top + borderTop,
    bottom: rect.bottom - borderBottom,
  }
}

/**
 * isSlideVisible
 * @param {HTMLElement} slide
 * @param {{left: number, right: number, top: number, bottom: number}} viewport
 * @returns {boolean} Whether the slide has a visible area inside the viewport
 */
function isSlideVisible(slide, viewport) {
  const rect = slide.getBoundingClientRect()
  const overlapWidth = Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left)
  const overlapHeight = Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top)

  // Fractional layout sizes leave sub-pixel overlaps on the adjacent slide, so
  // a slide has to be wider (and taller) than 1px to count as visible.
  return overlapWidth > 1 && overlapHeight > 1
}

/**
 * getTargetVisibleSlides
 * @param swiper
 * @returns {HTMLElement[]} The slides which will be inside the viewport once the transition is done
 */
function getTargetVisibleSlides(swiper) {
  // `swiperSlideOffset` is the static offset inside the wrapper, so the target
  // layout can be derived from the target `swiper.translate`. Reading the DOM
  // rects instead would return the pre-transition positions while the wrapper
  // is still moving. The rule below is the one Swiper uses to fill
  // `swiper.visibleSlides`.
  if (typeof swiper.updateSlidesOffset === 'function') {
    swiper.updateSlidesOffset()
  }

  // Swiper 3-5 expose the slides as a Dom7 collection which is neither
  // filterable with `Array.prototype.filter` nor iterable.
  const slides = Array.from(swiper.slides || [])
  const slidesSizesGrid = Array.from(swiper.slidesSizesGrid || [])
  const { params = {}, size } = swiper

  // Swiper normalizes the stored translate for RTL before computing the
  // offsets, so `-swiper.translate` holds for both directions.
  const offsetCenter = -swiper.translate

  // Swiper aligns the offsets on the first slide in css mode with centered slides
  const normalizeOffset = !!(params.cssMode && params.centeredSlides)
  let firstOffset = 0

  if (normalizeOffset && slides.length && typeof slides[0].swiperSlideOffset === 'number') {
    firstOffset = slides[0].swiperSlideOffset
  }

  return slides.filter((slide, i) => {
    const slideSize = slidesSizesGrid[i]

    if (typeof slide.swiperSlideOffset !== 'number' || typeof slideSize !== 'number') {
      return false
    }

    const slideOffset = slide.swiperSlideOffset - firstOffset
    const slideBefore = -(offsetCenter - slideOffset)
    const slideAfter = slideBefore + slideSize

    return (slideBefore >= 0 && slideBefore < size - 1)
      || (slideAfter > 1 && slideAfter <= size)
      || (slideBefore <= 0 && slideAfter >= size)
  })
}

/**
 * hasLayoutModel
 * @param swiper
 * @returns {boolean} Whether the target layout of swiper can be read without the DOM
 */
function hasLayoutModel(swiper) {
  return typeof swiper.translate === 'number'
    && typeof swiper.size === 'number'
    && swiper.size > 0
    && Array.isArray(swiper.slidesSizesGrid)
}

/**
 * isContainerRendered
 * @param {HTMLElement} container
 * @returns {boolean} Whether the container has a rendered box to measure
 */
function isContainerRendered(container) {
  // A hidden container (`display: none`, a closed tab) reports no client rect
  // while the stored size may still be greater than zero. The offsets read in
  // that state are all zero, which would mark every slide as visible.
  return typeof container.getClientRects === 'function'
    && container.getClientRects().length > 0
}

/**
 * getActiveSlides
 * @param swiper
 * @param {HTMLElement[]} slides
 * @returns {HTMLElement[]} The slides selected by the active index
 */
function getActiveSlides(swiper, slides) {
  const { params = {} } = swiper

  // In grid mode `swiper.activeIndex` is the column index, not the slide index
  if (params.grid && params.grid.rows > 1) {
    return slides.filter(slide => slide.column === swiper.activeIndex)
  }

  const activeSlide = slides[swiper.activeIndex]

  if (activeSlide) {
    return [activeSlide]
  }

  return []
}

/**
 * getVisibleSlides
 * @param swiper
 * @param {HTMLElement} container
 * @returns {HTMLElement[]} The slides inside the swiper viewport
 */
function getVisibleSlides(swiper, container) {
  const slides = Array.from(swiper.slides || [])

  // A hidden container reports zero offsets for every slide, so neither the
  // visible slide list nor the layout model can be trusted while it is hidden.
  // Only the active slide is animated until the container is rendered again.
  if (!isContainerRendered(container)) {
    return getActiveSlides(swiper, slides)
  }

  const { params = {} } = swiper
  const visibleSlides = Array.from(swiper.visibleSlides || [])

  // Swiper refreshes `visibleSlides` only while the progress is watched. A list
  // left over after `watchSlidesProgress` is disabled by a breakpoint is stale,
  // so the layout model has to be read instead.
  const watchesProgress = !!(params.watchSlidesProgress
    || (params.centeredSlides && params.autoHeight))
  let measuredSlides

  if (watchesProgress && visibleSlides.length) {
    measuredSlides = visibleSlides
  }
  else if (hasLayoutModel(swiper)) {
    measuredSlides = getTargetVisibleSlides(swiper)
  }
  else {
    // Swiper 3 has no layout model to read, so the rendered positions are used
    const viewport = getContainerViewport(container)
    measuredSlides = slides.filter(slide => isSlideVisible(slide, viewport))
  }

  // A viewport which has not been measured yet reports no slide at all.
  // The active slide is always animated so that the previous behaviour is kept.
  const result = new Set(measuredSlides)
  getActiveSlides(swiper, slides).forEach(slide => result.add(slide))

  return [...result]
}

export default class {
  constructor(swiper) {
    this.swiper = swiper
    this.container = getSwiperContainer(this.swiper)
    this.round = 0
    this.started = false
    this.invalidated = false
    // The elements whose out animation has been started but not reset yet
    this.outElements = new Set()
    this.animationElements = getAnimationElements(this.container)

    cacheAnimations(this.animationElements)

    // A container reused by a re-created swiper keeps the state left by the
    // previous instance. Those elements have to go through the first clear
    // round, otherwise their entering animation cannot run again. Once
    // animations are never repeated.
    this.activeElements = this.animationElements.filter(isStaleElement)
  }

  /**
   * animate
   * @returns {Promise<unknown[]>} Resolves when the whole animation round is done
   */
  animate() {
    const round = ++this.round
    const previousElements = this.activeElements
    const previousElementSet = new Set(previousElements)
    let isFirstRound = false
    let nextElements = []
    let leavingElements = []
    let resetElements = new Set()

    return this._runStep(round, () => {
      isFirstRound = !this.started
      nextElements = this._getActiveElements()

      const nextElementSet = new Set(nextElements)
      leavingElements = previousElements.filter(el => !nextElementSet.has(el))

      // The out animation is asynchronous. The elements which started leaving are
      // remembered until they are reset, so that a slide coming back before the
      // animation ends does not keep its out classes.
      leavingElements.forEach(el => this.outElements.add(el))

      return runOutAnimations(leavingElements)
    })
      .then(() => this._runStep(round, () => {
        // An element which comes back while its out animation is still running is
        // part of the viewport again, but it still has to be reset first.
        const returningElements = nextElements.filter(el => this.outElements.has(el))

        // The elements inherited from a replaced instance have to be reset once,
        // even when their slide is still inside the viewport, otherwise their
        // entering animation cannot run again. Newly rendered nodes are reset as
        // well before their first round.
        const staleElements = nextElements.filter(el => isStaleElement(el)
          && (isFirstRound || !previousElementSet.has(el)))

        // Elements which are still inside the viewport keep their state.
        // Clearing them would hide their slide for a frame before the entering
        // animation runs again, which shows up as a flash on every slide change.
        resetElements = new Set(leavingElements)
        returningElements.forEach(el => resetElements.add(el))
        staleElements.forEach(el => resetElements.add(el))

        return clearAnimations([...resetElements])
      }))
      .then(() => this._runStep(round, () => {
        // The state is committed only after the elements are reset, and only when
        // the round is still the latest one. A rejected clear would otherwise drop
        // the leaving elements from `previousElements` and from `outElements`, so
        // a later round could never reset them.
        this.activeElements = nextElements
        this.started = true
        resetElements.forEach(el => this.outElements.delete(el))
      }))
      .then(() => this._runStep(round, () => runAnimations(this.activeElements)))
  }

  /**
   * invalidate
   * Stops the pending rounds of an instance which has been replaced by a new one
   * so that they cannot write to the DOM of the new binding.
   */
  _invalidate() {
    this.invalidated = true
  }

  /**
   * runStep
   * @param {number} round
   * @param {Function} step
   * @returns {Promise<*>} Resolves without running the step when the round is outdated
   * @private
   */
  _runStep(round, step) {
    return Promise.resolve().then(() => {
      if (this.invalidated || round !== this.round) {
        return []
      }

      return step()
    })
  }

  /**
   * getActiveElements
   * @returns {HTMLElement[]} The animation elements of the slides inside the viewport
   * @private
   */
  _getActiveElements() {
    const elements = getVisibleSlides(this.swiper, this.container)
      .reduce((list, slide) => list.concat(getAnimationElements(slide)), [])

    // Elements rendered after the instance was created (route remounts, async
    // slide content) have no cache yet. They are cached right before their
    // entering animation runs; cached elements are skipped by cacheAnimations.
    cacheAnimations(elements)

    return elements
  }
}
