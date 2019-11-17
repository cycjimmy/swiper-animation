import cacheAnimations from '../src/cacheAnimations';
import runOutAnimations from '../src/runOutAnimations';

const swiperOutAnimation = 'outEffect';

describe('runOutAnimations default test', () => {
  const testEl01 = document.createElement('div');
  testEl01.dataset.swiperOutAnimation = swiperOutAnimation;
  const testEl02 = document.createElement('div');
  const activeElements = [testEl01, testEl02];
  cacheAnimations(activeElements);

  it('runOutAnimations test', () => {
    activeElements.forEach((el) => {
      el.animationData.isRecovery = false;
    });
    return runOutAnimations(activeElements).then(() => {
      expect(testEl01.classList.contains(swiperOutAnimation)).toBe(true);

      testEl01.animationData.isRecovery = true;
      return runOutAnimations(activeElements);
    });
  });
});
