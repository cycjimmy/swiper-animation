/* eslint no-undef: off */
import cacheAnimations from '../src/cacheAnimations';
import runAnimations from '../src/runAnimations';

const swiperAnimation = 'effect';

describe('runAnimations default test', () => {
  const testEl = document.createElement('div');
  testEl.dataset.swiperAnimation = swiperAnimation;
  const activeElements = [testEl];

  it('clearAnimations test when animationData is undefined', () => runAnimations(activeElements).then(() => {
    expect(testEl.classList.contains(swiperAnimation)).toBe(false);
  }));

  it('clearAnimations default test', () => {
    cacheAnimations(activeElements);
    return runAnimations(activeElements).then(() => {
      expect(testEl.animationData.isRecovery).toBe(false);
      expect(testEl.classList.contains(swiperAnimation)).toBe(true);
    });
  });
});
