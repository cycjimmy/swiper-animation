import CreateInstance from 'awesome-js-funcs/designPattern/CreateInstance';
import nodeListToArray from 'awesome-js-funcs/typeConversion/nodeListToArray';

let
  _instance = new CreateInstance()
  , sHidden = 'visibility: hidden;'
;

export default class SwiperAnimation {
  constructor(swiper) {
    if (_instance()) {
      return _instance();
    }
    this.swiper = swiper;
    this.allBoxes = [];
    _instance(this);
  };

  animate() {
    return Promise.resolve()
      .then(() => this._cache())
      .then(() => this._clear())
      .then(() => {
        let
          activeBoxes = nodeListToArray(this.swiper.slides[this.swiper.realIndex].querySelectorAll('[data-swiper-animation]'))
        ;

        let runAnimations = activeBoxes.map(el => new Promise(resolve => {
          let
            style = ''
            , effect = el.dataset.swiperAnimation || ''
            , duration = el.dataset.duration || '.5s'
            , delay = el.dataset.delay || '.5s'
          ;

          el.style.visibility = 'visible';

          style = el.style.cssText
            + ' animation-duration:' + duration
            + '; -webkit-animation-duration:' + duration
            + '; animation-delay:' + delay
            + '; -webkit-animation-delay:' + delay
            + ';';

          el.style.cssText = style;

          el.classList.add(effect, 'animated');

          el.isRecovery = false;

          setTimeout(() => resolve(), 0);
        }));

        return Promise.all(runAnimations);
      });
  };

  _clear() {
    return Promise.all(
      this.allBoxes.map(el => {
        return new Promise(resolve => {
          if (el.isRecovery) {
            resolve();
            return;
          }

          // recovery
          if (el.styleCache) {
            el.style.cssText = el.styleCache;
            el.classList.remove('animated');

            if (el.dataset.swiperAnimation) {
              el.classList.remove(el.dataset.swiperAnimation);
            }
          }

          el.isRecovery = true;
          setTimeout(() => resolve(), 0);
        });
      }),
    );
  };

  _cache() {
    // has cached
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    console.log('cache');

    // start cache
    return new Promise(resolve => {
      this._initAllBoxes();
      setTimeout(() => resolve(), 0);
    })
      .then(() => {
        return new Promise(resolve => {
          this.allBoxes.forEach(el => {
            if (el.attributes['style']) {
              el.styleCache = sHidden + el.style.cssText;
            } else {
              el.styleCache = sHidden;
            }
            el.isRecovery = true;  // add el property isRecovery
          });

          setTimeout(() => resolve(), 0);
        });
      });
  };

  _initAllBoxes() {
    if (!this.allBoxes.length) {
      let
        swiperWrapper = null
      ;

      if (this.swiper.wrapperEl) {
        // swiper 4
        swiperWrapper = this.swiper.wrapperEl;
      } else if (this.swiper.wrapper) {
        // swiper 3+
        swiperWrapper = this.swiper.wrapper[0];
      }

      this.allBoxes = nodeListToArray(swiperWrapper.querySelectorAll('[data-swiper-animation]'));
    }
  };
};