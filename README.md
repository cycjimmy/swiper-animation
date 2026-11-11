# Swiper Animation
![build status][workflows-badge-image]
[![libraries dependency status][libraries-status-image]][libraries-status-url]
[![libraries sourcerank][libraries-sourcerank-image]][libraries-sourcerank-url]
[![Coverage Status][coverage-image]][coverage-url]
[![Release date][release-date-image]][release-url]
[![vite][vite-image]][vite-url]
[![semantic-release][semantic-image]][semantic-url]
[![jest][jest-image]][jest-url]
[![npm license][license-image]][download-url]

* Easier way to run animations on swiper. ([Demo][github-pages-url])
* **[swiper-animation](https://github.com/cycdpo/swiper-animation) has been renamed to @cycjimmy/swiper-animation for scoped NPM package.**
* Since v7 the package ships **ESM only** (plus a UMD build for `<script>` tags). The CommonJS build and
  the Internet Explorer targets of v6 are gone, see [Migrating from v6](#migrating-from-v6).

## Install
[![NPM version][npm-image]][npm-url]
[![NPM bundle size][npm-bundle-size-image]][npm-url]
[![npm download][download-image]][download-url]

```shell
# via npm
npm install @cycjimmy/swiper-animation --save

# or via yarn
yarn add @cycjimmy/swiper-animation
```

## Usage
**Swiper Animation based on [Swiper](https://github.com/nolimits4web/Swiper). Add Script of swiper in your project first.**

* Tested with Swiper 3.x through 14. Both the `on` object of Swiper 4+ and the
  `onInit` / `onSlideChangeEnd` callbacks of Swiper 3.x are supported.

```javascript
import SwiperAnimation from '@cycjimmy/swiper-animation'

// use swiper 3.x
const swiperAnimation3 = new SwiperAnimation()
const mySwiper3 = new Swiper('.swiper-container', {
  onInit(swiper) {
    swiperAnimation3.init(swiper).animate()
  },
  onSlideChangeEnd(swiper) {
    swiperAnimation3.init(swiper).animate()
  },
})

// use swiper 4+
const swiperAnimation4 = new SwiperAnimation()
const mySwiper4 = new Swiper('.swiper-container', {
  on: {
    init() {
      swiperAnimation4.init(this).animate()
    },
    slideChange() {
      swiperAnimation4.init(this).animate()
    },
  },
})
```

### SPA and framework usage
* Create one `SwiperAnimation` instance per mounted component instead of sharing a module-level singleton.
  Reusing an instance is supported: `init(swiper)` rebinds when a **different** swiper instance is passed, and
  stays a no-op when the same instance is passed again.
* After a route change, wait until the new DOM is rendered and the new swiper is created, then call
  `swiperAnimation.init(newSwiper).animate()` again.
* Elements left mid-animation by a previous instance are reset before their next entering animation, even
  when the new swiper reuses the same container.
* Elements rendered after `init()` (async content, `v-if` blocks) are cached automatically the next time their
  slide becomes active, provided `swiper.slides` / `swiper.update()` already know about them. Pre-hide such
  content with your own CSS if it must not flash before that.
* Keep the existing event wiring; the library never destroys the swiper instance you pass in. Remove the
  callbacks and destroy the swiper yourself when the component unmounts.
* The cache lives on the DOM node, so `data-*` attribute changes on an already cached node are not picked up
  automatically.

```javascript
// Vue 3, after the asynchronous content has been rendered.
await nextTick()
swiper.update()
swiperAnimation.init(swiper).animate()
```

In Vue 2 use `this.$nextTick()` instead of the imported `nextTick()`.

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
<script src="swiper-animation.umd.min.js"></script>
<script>
  // use swiper 3.x
  var swiperAnimation3 = new SwiperAnimation();
  var mySwiper3 = new Swiper('.swiper-container', {
    onInit: function(swiper) {
      swiperAnimation3.init(swiper).animate();
    },
    onSlideChangeEnd: function(swiper) {
      swiperAnimation3.init(swiper).animate();
    }
  });

  // use swiper 4+
  var swiperAnimation4 = new SwiperAnimation();
  var mySwiper4 = new Swiper('.swiper-container', {
    on: {
      init: function () {
        swiperAnimation4.init(this).animate();
      },
      slideChange: function () {
        swiperAnimation4.init(this).animate();
      }
    }
  });
</script>
```

The UMD build exposes the `SwiperAnimation` global.

## CDN
[![jsdelivr][jsdelivr-image]][jsdelivr-url]

To use via a CDN include this in your HTML:
```text
<script src="https://cdn.jsdelivr.net/npm/@cycjimmy/swiper-animation@7/dist/swiper-animation.umd.min.js"></script>
```

`package.json` declares `unpkg` and `jsdelivr`, so the version-less URLs
(`https://unpkg.com/@cycjimmy/swiper-animation`) resolve to the minified UMD build.

## Module formats
* `dist/swiper-animation.esm.js` — the ESM entry (`import`, `module`, and the only `exports` entry).
  On Node.js >= 22.12 `require()` resolves it through `require(esm)`, but it returns the module
  namespace rather than the constructor: use `const { default: SwiperAnimation } = require('@cycjimmy/swiper-animation')`.
* `dist/swiper-animation.umd.js` / `dist/swiper-animation.umd.min.js` — UMD builds for `<script>` tags and CDN use.

## Migrating from v6
* The CommonJS build (`dist/swiper-animation.cjs`) is gone: use `import`, or `require()` on Node.js >= 22.12.
  `require()` no longer returns the constructor itself; destructure the default export
  (`const { default: SwiperAnimation } = require('@cycjimmy/swiper-animation')`).
* `package.json` keeps no `browser` field any more; CDN defaults are declared with `unpkg` / `jsdelivr`.
* The build target is ES2015, so Internet Explorer is no longer supported. Stay on v6 if you still need it.
* Working on the repository requires Node.js `^22.18.0 || >=24.11.0` (Babel 8 and Vite 8).

## Development
```shell
npm install              # Node.js ^22.18.0 || >=24.11.0
npm run dev              # Vite dev server on the root index.html
npm run lint             # ESLint (flat config, @antfu/eslint-config)
npm run lint:style       # Stylelint for the inline styles of the demo pages
npm test                 # Jest
npm run package          # build dist/ and assemble .release/
```

`index.html` in the repository root is the Vite dev entry and imports `src/` directly. The pages in
`static/` are the GitHub Pages demo: they load the bundled `swiper-animation.umd.js` through a
`<script>` tag and are published by `npm run build:deployment`.

## Earlier Version
* [v1](https://github.com/cycdpo/swiper-animation/tree/v1)

<!-- Links: -->
[npm-image]: https://img.shields.io/npm/v/@cycjimmy/swiper-animation
[npm-url]: https://npmjs.org/package/@cycjimmy/swiper-animation
[npm-bundle-size-image]: https://img.shields.io/bundlephobia/min/@cycjimmy/swiper-animation

[download-image]: https://img.shields.io/npm/dt/@cycjimmy/swiper-animation
[download-url]: https://npmjs.org/package/@cycjimmy/swiper-animation

[jsdelivr-image]: https://img.shields.io/jsdelivr/npm/hy/@cycjimmy/swiper-animation
[jsdelivr-url]: https://www.jsdelivr.com/package/npm/@cycjimmy/swiper-animation

[workflows-badge-image]: https://github.com/cycjimmy/swiper-animation/workflows/Test%20CI/badge.svg

[libraries-status-image]: https://img.shields.io/librariesio/release/npm/@cycjimmy/swiper-animation
[libraries-sourcerank-image]: https://img.shields.io/librariesio/sourcerank/npm/@cycjimmy/swiper-animation
[libraries-status-url]: https://libraries.io/github/cycjimmy/swiper-animation
[libraries-sourcerank-url]: https://libraries.io/npm/@cycjimmy%2Fswiper-animation

[coverage-image]: https://img.shields.io/coveralls/github/cycjimmy/swiper-animation
[coverage-url]: https://coveralls.io/github/cycjimmy/swiper-animation

[release-date-image]: https://img.shields.io/github/release-date/cycjimmy/swiper-animation
[release-url]: https://github.com/cycjimmy/swiper-animation/releases

[vite-image]: https://img.shields.io/github/package-json/dependency-version/cycjimmy/swiper-animation/dev/vite
[vite-url]: https://github.com/vitejs/vite

[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%20%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

[jest-image]: https://img.shields.io/badge/tested_with-jest-99424f.svg
[jest-url]: https://github.com/facebook/jest

[license-image]: https://img.shields.io/npm/l/@cycjimmy/swiper-animation

[github-pages-url]: https://cycjimmy.github.io/swiper-animation/
