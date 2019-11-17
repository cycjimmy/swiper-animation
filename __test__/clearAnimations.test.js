import cacheAnimations from '../src/cacheAnimations';
import clearAnimations from '../src/clearAnimations';

const swiperAnimation = 'effect';

describe('clearAnimations default test', () => {
  const testEl01 = document.createElement('div');
  testEl01.dataset.swiperAnimationOnce = swiperAnimation;
  const testEl02 = document.createElement('div');
  testEl01.dataset.swiperAnimation = swiperAnimation;
  const activeElements = [testEl01, testEl02];
  cacheAnimations(activeElements);

  it('clearAnimations default test', () =>
    clearAnimations(activeElements).then(() => {
      expect(testEl01.animationData.isRecovery).toBe(true);
    }));

  it('clearAnimations test', () => {
    activeElements.forEach((el) => {
      el.animationData.isRecovery = false;
    });

    return clearAnimations(activeElements).then(() => {
      expect(testEl02.animationData.isRecovery).toBe(true);
      expect(testEl02.classList.contains(swiperAnimation)).toBe(false);
    });
  });
});
