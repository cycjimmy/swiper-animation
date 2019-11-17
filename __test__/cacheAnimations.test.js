import cacheAnimations from '../src/cacheAnimations';

describe('cacheAnimations default test', () => {
  const testEl01 = document.createElement('div');
  const testEl02 = document.createElement('div');
  testEl02.style.width = '10px';

  it('cacheAnimations', () => {
    cacheAnimations([testEl01, testEl02]);
    expect(testEl01.animationData).toBeTruthy();
    expect(testEl01.animationData.isRecovery).toBe(true);
  });
});
