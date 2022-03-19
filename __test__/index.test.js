/* eslint no-undef: off */
import Swiper from 'swiper';

import SwiperAnimation from '../src/index';

// mock swiper
const container = document.createElement('div');
const mySwiper = new Swiper(container);
// mock slides
mySwiper.slides = [document.createElement('div')];

describe('SwiperAnimation default test', () => {
  const swiperAnimation = new SwiperAnimation();

  it('SwiperAnimation.init return swiperAnimation instance', () => {
    expect(swiperAnimation.init(mySwiper)).toBe(swiperAnimation);
  });

  it('SwiperAnimation.animate test', () => swiperAnimation.init(mySwiper).animate());
});

describe('SwiperAnimation test when Promise undefined', () => {
  it('SwiperAnimation test', (done) => {
    // mock Promise undefined
    window.Promise = null;

    const swiperAnimation = new SwiperAnimation().init(mySwiper);
    swiperAnimation.animate();

    setTimeout(done, 1e3);
  });
});
