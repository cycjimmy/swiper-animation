import functionToPromise from '@cycjimmy/awesome-js-funcs/typeConversion/functionToPromise';

/**
 * clearAnimations
 * @param activeBoxes[HtmlElement]
 * @returns {Promise<unknown[]>}
 */
export default (activeBoxes) => {
  const runClearTasks = activeBoxes.map((el) => {
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
        ...[el.animationData.effect, el.animationData.outEffect, 'animated'].filter((str) => !!str)
      );

      el.animationData.isRecovery = true;
    });
  });

  return Promise.all(runClearTasks);
};
