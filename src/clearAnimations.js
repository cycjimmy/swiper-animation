import functionToPromise from '@cycjimmy/awesome-js-funcs/typeConversion/functionToPromise';

import constants from './constants';

/**
 * clearAnimations
 * @param activeElements[HTMLElement]
 * @returns {Promise<unknown[]>}
 */
export default (activeElements) => {
  const runClearTasks = activeElements.map((el) => {
    if (el.animationData.isRecovery) {
      return Promise.resolve();
    }

    if (el.animationData.runOnce) {
      return Promise.resolve();
    }

    return functionToPromise(() => {
      // recovery
      el.style.cssText = el.animationData.styleCache;

      el.classList.remove(
        ...[
          el.animationData.effect,
          el.animationData.outEffect,
          ...constants.AnimateCssAnimated
        ].filter((str) => !!str)
      );

      el.animationData.isRecovery = true;
    });
  });

  return Promise.all(runClearTasks);
};
