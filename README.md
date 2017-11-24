# Swiper Animation

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![David deps][david-image]][david-url]
[![devDependencies Status][david-dev-image]][david-dev-url]
[![node version][node-image]][node-url]
[![npm download][download-image]][download-url]
[![npm license][license-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/swiper-animation.svg?style=flat-square
[npm-url]: https://npmjs.org/package/swiper-animation
[travis-image]: https://img.shields.io/travis/cycdpo/swiper-animation.svg?style=flat-square
[travis-url]: https://travis-ci.org/cycdpo/swiper-animation
[david-image]: https://img.shields.io/david/cycdpo/swiper-animation.svg?style=flat-square
[david-url]: https://david-dm.org/cycdpo/swiper-animation
[david-dev-image]: https://david-dm.org/cycdpo/swiper-animation/dev-status.svg?style=flat-square
[david-dev-url]: https://david-dm.org/cycdpo/swiper-animation?type=dev
[node-image]: https://img.shields.io/badge/node.js-%3E=_6.0-green.svg?style=flat-square
[node-url]: http://nodejs.org/download/
[download-image]: https://img.shields.io/npm/dm/swiper-animation.svg?style=flat-square
[download-url]: https://npmjs.org/package/swiper-animation
[license-image]: https://img.shields.io/npm/l/swiper-animation.svg?style=flat-square

([Releases](https://github.com/cycdpo/swiper-animation/releases) | [Demo](https://cycdpo.github.io/swiper-animation/))

## Install
```shell
# via npm
$ npm install swiper-animation --save

# or via yarn
$ yarn add swiper-animation
```

## Usage
**Swiper Animation based on [Swiper](https://github.com/nolimits4web/Swiper). Add Script of swiper in your project first**

```javascript
import SwiperAnimation from 'swiper-animation';

# OR
const SwiperAnimation = require('swiper-animation');

// use swiper 3+
let mySwiper3 = new Swiper('.swiper-container', {
  onInit: () => (swiper) => new SwiperAnimation(swiper).animate(),
  onSlideChangeEnd: () => (swiper) => new SwiperAnimation(swiper).animate()
});

// use swiper 4+
let mySwiper4 = new Swiper('.swiper-container', {
  on: {
    init: () => new SwiperAnimation(mySwiper4).animate(),
    slideChange: () => new SwiperAnimation(mySwiper4).animate()
  }
});
```

### Add attribute on elements you want animate
```html
<div data-swiper-animation="fadeIn" data-duration=".5s" data-delay="1s">Animation</div>
```

* `data-swiper-animation`: [require] Animation class name.
* `data-duration`: [option] Set animation-duration. Default: `.5s`.
* `data-delay`: [option] Set animation-delay. Default: `.5s`.

### Animation Effect
* Recommended [Animate.css](https://github.com/daneden/animate.css)
* Other Animation lib
* Custom animation

## Use in browser
```html
<link href="animate.min.css" rel="stylesheet">
<link href="swiper.min.css" rel="stylesheet">

<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <div data-swiper-animation="fadeIn">Slider1</div>
    </div>
    <div class="swiper-slide">
      <div data-swiper-animation="fadeIn" data-duration=".5s">Slider2</div>
    </div>
    <div class="swiper-slide">
      <div data-swiper-animation="fadeIn" data-duration=".5s" data-delay="1s">Slider3</div>
    </div>
  </div>
</div>

<script src="swiper.min.js"></script>
<script src="SwiperAnimation.min.js"></script>
<script>
  // use swiper 3+
  var mySwiper3 = new Swiper('.swiper-container', {
    onInit: function(swiper) {
      new SwiperAnimation(swiper).animate();
    },
    onSlideChangeEnd: function(swiper) {
      new SwiperAnimation(swiper).animate();
    }
  });

  // use swiper 4+
  var mySwiper4 = new Swiper('.swiper-container', {
    on: {
      init: function () {
        new SwiperAnimation(this).animate();
      },
      slideChange: function () {
        new SwiperAnimation(this).animate();
      }
    }
  });
</script>
```



