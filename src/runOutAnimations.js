import functionToPromise from '@cycjimmy/awesome-js-funcs/esm/typeConversion/functionToPromise';

/**
 * runOutAnimations
 * @param activeElements[HTMLElement]
 * @returns {Promise<unknown[]>}
 */
export default (activeElements) => {
  const runOutTasks = activeElements.map((el) => {
    if (el.animationData.isRecovery) {
      return Promise.resolve();
    }

    if (!el.animationData.outEffect) {
      return Promise.resolve();
    }

    return functionToPromise(() => {
      el.style.cssText = el.animationData.styleCache;
      el.style.visibility = 'visible';
      el.style.cssText += ` animation-duration:${el.animationData.outDuration}; -webkit-animation-duration:${el.animationData.outDuration};`;

      el.classList.add(el.animationData.outEffect, 'animated');
    }, 500);
  });

  return Promise.all(runOutTasks);
};
