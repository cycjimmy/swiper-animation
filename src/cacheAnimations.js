const sHidden = 'visibility: hidden;';

/**
 * cacheAnimations
 * @param elements[HTMLElement]
 */
export default (elements) => {
  elements.forEach((el) => {
    el.animationData = {
      styleCache: el.attributes.style ? sHidden + el.style.cssText : sHidden,
      effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || '',
      duration: el.dataset.duration || '.5s',
      delay: el.dataset.delay || '.5s',
      outEffect: el.dataset.swiperOutAnimation || '',
      outDuration: el.dataset.outDuration || '.5s',
      isRecovery: true,
      runOnce: !!el.dataset.swiperAnimationOnce
    };

    el.style.cssText = el.animationData.styleCache;
  });
};
