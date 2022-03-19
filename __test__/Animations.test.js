/* eslint no-undef: off */
import Swiper from 'swiper';

import Animations from '../src/Animations';

// mock swiper
const container = document.createElement('div');
const mySwiper = new Swiper(container);
// mock slides
mySwiper.slides = [document.createElement('div')];

describe('Animations default test', () => {
  const animations = new Animations(mySwiper);

  it('animations default properties', () => {
    expect(animations.swiper).toBe(mySwiper);
    expect(animations.container).toBe(container);
  });

  it('test animate', () => animations.animate());
});

describe('coverall getSwiperContainer', () => {
  it('mock swiper 3', () => {
    mySwiper.el = null;
    mySwiper.container = [container];

    const animations = new Animations(mySwiper);
    expect(animations.swiper).toBe(mySwiper);
    expect(animations.container).toBe(container);
  });

  it('mock illegal swiper instance', () => {
    mySwiper.el = null;
    mySwiper.container = null;

    expect(() => new Animations(mySwiper)).toThrowError();
  });
});
