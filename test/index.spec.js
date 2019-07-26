import SwiperAnimation from '../build/swiper-animation.min';
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

const mySwiper = new Swiper(wrapper);

// mock onInit
const swiperAnimation = new SwiperAnimation().init(mySwiper);

swiperAnimation._cache();

describe('default spec', () => {
  test('default test', () => {
    expect(swiperAnimation.swiper).toBe(mySwiper);
  });
});

