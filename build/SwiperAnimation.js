(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SwiperAnimation"] = factory();
	else
		root["SwiperAnimation"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var sHidden = 'visibility: hidden;';

var PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js';

var SwiperAnimation = function () {
  function SwiperAnimation() {
    _classCallCheck(this, SwiperAnimation);

    this.swiper = null;
    this.allBoxes = [];

    this.appendedPromise = false;
    this.isPromiseReady = false;
  }

  SwiperAnimation.prototype.init = function init(swiper) {
    var _this = this;

    if (!this.swiper) {
      this.swiper = swiper;
    }

    if (this.isPromiseReady || window.Promise) {
      this.isPromiseReady = true;
      return this;
    }

    // fix "Promise Is Undefined" in IE
    this._initPromisePolyfill(function () {
      _this.isPromiseReady = true;
    });
    return this;
  };

  /**
   * run animations
   * @return {*}
   */
  SwiperAnimation.prototype.animate = function animate() {
    var _this2 = this;

    if (!this.isPromiseReady) {
      return setTimeout(function () {
        return _this2.animate();
      }, 5e2);
    }

    return Promise.resolve().then(function () {
      return _this2._cache();
    }).then(function () {
      return _this2._clear();
    }).then(function () {
      var activeBoxes = Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2.swiper.slides[_this2.swiper.realIndex].querySelectorAll('[data-swiper-animation]'));

      var runAnimations = activeBoxes.map(function (el) {
        return new Promise(function (resolve) {
          var style = '',
              effect = el.dataset.swiperAnimation || '',
              duration = el.dataset.duration || '.5s',
              delay = el.dataset.delay || '.5s';

          el.style.visibility = 'visible';

          style = el.style.cssText + ' animation-duration:' + duration + '; -webkit-animation-duration:' + duration + '; animation-delay:' + delay + '; -webkit-animation-delay:' + delay + ';';

          el.style.cssText = style;

          el.classList.add(effect, 'animated');

          el.isRecovery = false;

          setTimeout(function () {
            return resolve();
          }, 0);
        });
      });

      return Promise.all(runAnimations);
    });
  };

  SwiperAnimation.prototype._clear = function _clear() {
    var _runClearTasks = this.allBoxes.map(function (el) {
      return new Promise(function (resolve) {
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
        setTimeout(function () {
          return resolve();
        }, 0);
      });
    });

    return Promise.all(_runClearTasks);
  };

  /**
   * cache allBoxes style
   * @return {*}
   * @private
   */
  SwiperAnimation.prototype._cache = function _cache() {
    var _this3 = this;

    // has cached
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    console.log('cache');

    // start cache
    return new Promise(function (resolve) {
      _this3._initAllBoxes();
      setTimeout(function () {
        return resolve();
      }, 0);
    }).then(function () {

      var _runCacheTasks = _this3.allBoxes.map(function (el) {
        return new Promise(function (resolve) {
          if (el.attributes['style']) {
            el.styleCache = sHidden + el.style.cssText;
          } else {
            el.styleCache = sHidden;
          }
          el.style.cssText = el.styleCache;
          el.isRecovery = true; // add el property isRecovery

          setTimeout(function () {
            return resolve();
          }, 0);
        });
      });

      return Promise.all(_runCacheTasks);
    });
  };

  /**
   * init this.allBoxes
   * @private
   */
  SwiperAnimation.prototype._initAllBoxes = function _initAllBoxes() {
    if (!this.allBoxes.length) {
      var swiperWrapper = null;

      if (this.swiper.wrapperEl) {
        // swiper 4
        swiperWrapper = this.swiper.wrapperEl;
      } else if (this.swiper.wrapper) {
        // swiper 3+
        swiperWrapper = this.swiper.wrapper[0];
      }

      this.allBoxes = Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(swiperWrapper.querySelectorAll('[data-swiper-animation]'));
    }
  };

  /**
   * init PromisePolyfill
   * @param callback
   * @private
   */
  SwiperAnimation.prototype._initPromisePolyfill = function _initPromisePolyfill() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

    // just add promise-polyfill script once
    if (this.appendedPromise) {
      return;
    }

    var oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.onload = function () {
      return callback();
    };
    oScript.src = PROMISE_POLYFILL_URL;
    document.querySelector('head').appendChild(oScript);
    this.appendedPromise = true;
  };

  return SwiperAnimation;
}();

/* harmony default export */ __webpack_exports__["default"] = (SwiperAnimation);
;

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _judgeBasic_isNodeList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);


/**
 * nodeList转变为数组
 * @param nodeList
 * @returns {Array}
 */
/* harmony default export */ __webpack_exports__["default"] = (function (nodeList) {

  if (Array.isArray(nodeList)) {
    return nodeList;
  }

  if (!Object(_judgeBasic_isNodeList__WEBPACK_IMPORTED_MODULE_0__["default"])(nodeList)) {
    return new Array(nodeList);
  }

  return Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
});

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * 判断是否nodeList
 * @param nodeList
 */
/* harmony default export */ __webpack_exports__["default"] = (function (nodeList) {
  return Object.prototype.toString.call(nodeList) === '[object NodeList]';
});

/***/ })
/******/ ])["default"];
});