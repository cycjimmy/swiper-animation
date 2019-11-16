import Swiper from 'swiper';
import SwiperAnimation from '../src/index';

const container = document.createElement('div');

container.style.width = '400px';
container.style.height = '300px';

container.innerHTML = `
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div data-swiper-animation="animate1"></div>
      <div data-swiper-animation="animate2" data-duration="2s"></div>
      <div data-swiper-animation="animate3" data-delay="3s"></div>
      <div data-swiper-animation="animate4" data-duration="1s" data-delay="1s"></div>
    </div>
  </div>
`;

const mySwiper = new Swiper(container);

describe('SwiperAnimation default test', () => {
  const swiperAnimation = new SwiperAnimation();

  it('SwiperAnimation.init return swiperAnimation instance', () => {
    expect(swiperAnimation.init(mySwiper)).toBe(swiperAnimation);
  });

  it('SwiperAnimation.animate test', () => {
    swiperAnimation.animate();
  });
});

describe('SwiperAnimation test when Promise undefined', () => {
  it('SwiperAnimation test', () => {
    // mock Promise undefined
    window.Promise = null;

    const swiperAnimation = new SwiperAnimation().init(mySwiper);
    swiperAnimation.animate();
  });
});
