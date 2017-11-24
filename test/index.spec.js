import SwiperAnimation from '../build/SwiperAnimation.min';
import Swiper from 'swiper';

describe('default spec', () => {
  const
    wrapper = document.createElement('div')
  ;

  wrapper.style.width = '400px';
  wrapper.style.height = '300px';

  wrapper.innerHTML = `
    <div data-swiper-animation="animate1"></div>
    <div data-swiper-animation="animate2" data-duration="2s"></div>
    <div data-swiper-animation="animate3" data-delay="3s"></div>
    <div data-swiper-animation="animate4" data-duration="1s" data-delay="1s"></div>
  `;


  let mySwiper = new Swiper(wrapper, {
      on: {
        init: () => setTimeout(() => new SwiperAnimation().animate(mySwiper), 0),
        slideChange: () => setTimeout(() => new SwiperAnimation().animate(mySwiper), 0)
      }
    })
  ;

  console.log(new SwiperAnimation().allBoxes);


  test('default test', () => {
    // expect(new SwiperAnimation().allBoxes.length).toBe(4);


    // expect(simulateChat.el.container).toBeTruthy();

    // expect(simulateChat.el.context).toBe(wrapper);
  });
});
