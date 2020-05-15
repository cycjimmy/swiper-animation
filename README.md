# Swiper Animation
![][workflows-badge-image]
[![build status][travis-image]][travis-url]
[![libraries dependency status][libraries-status-image]][libraries-status-url]
[![libraries sourcerank][libraries-sourcerank-image]][libraries-sourcerank-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Release date][release-date-image]][release-url]
[![rollup][rollup-image]][rollup-url]
[![semantic-release][semantic-image]][semantic-url]
[![jest][jest-image]][jest-url]
[![npm license][license-image]][download-url]

* Easier way to run animations on swiper. ([Demo][github-pages-url])
* **[swiper-animation](https://github.com/cycdpo/swiper-animation) has been renamed to @cycjimmy/swiper-animation for scoped NPM package.**

## Install
[![NPM version][npm-image]][npm-url]
[![NPM bundle size][npm-bundle-size-image]][npm-url]
[![npm download][download-image]][download-url]

```shell
# via npm
$ npm install @cycjimmy/swiper-animation --save

# or via yarn
$ yarn add @cycjimmy/swiper-animation
```

## Usage
**Swiper Animation based on [Swiper](https://github.com/nolimits4web/Swiper). Add Script of swiper in your project first.**

```javascript
import SwiperAnimation from '@cycjimmy/swiper-animation';

# OR
const SwiperAnimation = require('@cycjimmy/swiper-animation');

// use swiper 3.x
const swiperAnimation = new SwiperAnimation();
const mySwiper3 = new Swiper('.swiper-container', {
  onInit: function(swiper) {
    swiperAnimation.init(swiper).animate();
  },
  onSlideChangeEnd: function(swiper) {
    swiperAnimation.init(swiper).animate();
  }
});

// use swiper 4+
const swiperAnimation = new SwiperAnimation();
const mySwiper4 = new Swiper('.swiper-container', {
  on: {
    init: function () {
      swiperAnimation.init(this).animate();
    },
    slideChange: function () {
      swiperAnimation.init(this).animate();
    }
  }
});
```

### Add attribute on elements you want animated.
```html
<div 
  data-swiper-animation="animate__fadeIn" 
  data-duration=".5s" 
  data-delay="1s" 
  data-swiper-out-animation="animate__fadeOut"
  data-out-duration=".2s"
>Animation</div>
```

* `data-swiper-animation`: [Option] Animation class name for entering slide.
* `data-swiper-animation-once`: [Option] One-time Animation class name for entering slide.
* `data-duration`: [Option] Set animation-duration. Default: `.5s`.
* `data-delay`: [Option] Set animation-delay. Default: `.5s`.
* `data-swiper-out-animation`: [Option] Animation class name for leaving slide. Delay for leaving Animation is not supported.
* `data-out-duration`: [Option] Set animation-duration for leaving slide. The value must be less than `.5s`. Default: `.5s`.

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
      <div data-swiper-animation="animate__fadeIn">Slider1</div>
    </div>
    <div class="swiper-slide">
      <div data-swiper-animation="animate__fadeIn" data-duration=".5s">Slider2</div>
    </div>
    <div class="swiper-slide">
      <div data-swiper-animation="animate__fadeIn" data-duration=".5s" data-delay="1s">Slider3</div>
    </div>
  </div>
</div>

<script src="swiper.min.js"></script>
<script src="swiper-animation.min.js"></script>
<script>
  // use swiper 3.x
  var swiperAnimation = new SwiperAnimation();
  var mySwiper3 = new Swiper('.swiper-container', {
    onInit: function(swiper) {
      swiperAnimation.init(swiper).animate();
    },
    onSlideChangeEnd: function(swiper) {
      swiperAnimation.init(swiper).animate();
    }
  });

  // use swiper 4+
  var swiperAnimation = new SwiperAnimation();
  var mySwiper4 = new Swiper('.swiper-container', {
    on: {
      init: function () {
        swiperAnimation.init(this).animate();
      },
      slideChange: function () {
        swiperAnimation.init(this).animate();
      }
    }
  });
</script>
```

## CDN
[![jsdelivr][jsdelivr-image]][jsdelivr-url]

To use via a CDN include this in your HTML:
```text
<script src="https://cdn.jsdelivr.net/npm/@cycjimmy/swiper-animation@4/dist/swiper-animation.umd.min.js"></script>
```

## Earlier Version
* [1.x](https://github.com/cycdpo/swiper-animation/tree/1.x)

<!-- Links: -->
[npm-image]: https://img.shields.io/npm/v/@cycjimmy/swiper-animation
[npm-url]: https://npmjs.org/package/@cycjimmy/swiper-animation
[npm-bundle-size-image]: https://img.shields.io/bundlephobia/min/@cycjimmy/swiper-animation

[download-image]: https://img.shields.io/npm/dt/@cycjimmy/swiper-animation
[download-url]: https://npmjs.org/package/@cycjimmy/swiper-animation

[jsdelivr-image]: https://img.shields.io/jsdelivr/npm/hy/@cycjimmy/swiper-animation
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/@cycjimmy/swiper-animation

[workflows-badge-image]: https://github.com/cycjimmy/swiper-animation/workflows/Test%20CI/badge.svg
[travis-image]: https://img.shields.io/travis/cycjimmy/swiper-animation
[travis-url]: https://travis-ci.org/cycjimmy/swiper-animation

[libraries-status-image]: https://img.shields.io/librariesio/release/npm/@cycjimmy/swiper-animation
[libraries-sourcerank-image]: https://img.shields.io/librariesio/sourcerank/npm/@cycjimmy/swiper-animation
[libraries-status-url]: https://libraries.io/github/cycjimmy/swiper-animation
[libraries-sourcerank-url]: https://libraries.io/npm/@cycjimmy%2Fswiper-animation

[coverage-image]: https://img.shields.io/coveralls/github/cycjimmy/swiper-animation
[coverage-url]: https://coveralls.io/github/cycjimmy/swiper-animation

[release-date-image]: https://img.shields.io/github/release-date/cycjimmy/swiper-animation
[release-url]: https://github.com/cycjimmy/swiper-animation/releases

[rollup-image]: https://img.shields.io/github/package-json/dependency-version/cycjimmy/swiper-animation/dev/rollup
[rollup-url]: https://github.com/rollup/rollup

[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest

[license-image]: https://img.shields.io/npm/l/@cycjimmy/swiper-animation

[github-pages-url]: https://cycjimmy.github.io/swiper-animation/
