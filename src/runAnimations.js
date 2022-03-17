import functionToPromise from '@cycjimmy/awesome-js-funcs/cjs/typeConversion/functionToPromise';

import constants from './constants';

/**
 * runAnimations
 * @param activeElements[HTMLElement]
 * @returns {Promise<unknown[]>}
 */
export default (activeElements) => {
  const runAnimateTasks = activeElements.map((el) => {
    if (!el.animationData) {
      return Promise.resolve();
    }

    return functionToPromise(() => {
      el.style.visibility = 'visible';

      el.style.cssText += ` animation-duration:${el.animationData.duration}; -webkit-animation-duration:${el.animationData.duration}; animation-delay:${el.animationData.delay}; -webkit-animation-delay:${el.animationData.delay};`;

      el.classList.add(el.animationData.effect, ...constants.AnimateCssAnimated);
      el.animationData.isRecovery = false;
    });
  });

  return Promise.all(runAnimateTasks);
};
