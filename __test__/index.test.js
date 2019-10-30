import SwiperAnimation from '../src/index';
import Swiper from 'swiper';

const wrapper = document.createElement('div');

wrapper.style.width = '400px';
wrapper.style.height = '300px';

wrapper.innerHTML = `
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div data-swiper-animation="animate1"></div>
      <div data-swiper-animation="animate2" data-duration="2s"></div>
      <div data-swiper-animation="animate3" data-delay="3s"></div>
      <div data-swiper-animation="animate4" data-duration="1s" data-delay="1s"></div>
    </div>
  </div>
`;

describe('SwiperAnimation', () => {
  const mySwiper = new Swiper(wrapper);

  // mock onInit
  const swiperAnimation = new SwiperAnimation();

  it('SwiperAnimation.init return swiperAnimation instance', () => {
    expect(swiperAnimation.init(mySwiper)).toBe(swiperAnimation);
  });

  it('swiperAnimation.swiper should be swiper instance.', () => {
    expect(swiperAnimation.swiper).toBe(mySwiper);
  });

  it('after running swiperAnimation._initPromisePolyfill(), appendedPromise should be true.', () => {
    swiperAnimation._initPromisePolyfill();
    expect(swiperAnimation.appendedPromise).toBe(true);
  });

  it('swiperAnimation.allBoxes.length should be the number of elements with the data-swiper-animation attribute.', () => {
    return swiperAnimation._cache()
      .then(() => {
        // mySwiper.slides = activeIndex = 0;

        expect(swiperAnimation.allBoxes.length)
          .toEqual(wrapper.querySelectorAll('[data-swiper-animation]').length);
      });
  });

  it('swiperAnimation.activeBoxes.length should be the number of elements in active slide with the data-swiper-animation attribute.', () => {
    mySwiper.slides = wrapper.querySelectorAll('.swiper-slide');
    mySwiper.activeIndex = 0;
    return swiperAnimation.animate()
      .then(() => {
        expect(swiperAnimation.activeBoxes.length)
          .toEqual(mySwiper.slides[mySwiper.activeIndex].querySelectorAll('[data-swiper-animation]').length);
      });
  });

  it('after swiperAnimation._clear(), swiperAnimation.activeBoxes.length should be 0.', () => {
    return swiperAnimation._clear()
      .then(() => {
        expect(swiperAnimation.activeBoxes.length)
          .toEqual(0);
      });
  });
});

