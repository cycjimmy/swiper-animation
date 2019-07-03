/*!
 * swiper-animation v1.3.0
 * Homepage: https://github.com/cycdpo/swiper-animation#readme
 * Released under the MIT License.
 */
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SwiperAnimation; });
/* harmony import */ var awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

var sHidden = 'visibility: hidden;';
var PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@7/dist/polyfill.min.js';

var SwiperAnimation =
/*#__PURE__*/
function () {
  function SwiperAnimation() {
    this.swiper = null;
    this.allBoxes = [];
    this.activeBoxes = [];
    this.appendedPromise = false;
    this.isPromiseReady = false;
  }

  var _proto = SwiperAnimation.prototype;

  _proto.init = function init(swiper) {
    var _this = this;

    if (!this.swiper) {
      this.swiper = swiper;
    }

    if (this.isPromiseReady || window.Promise) {
      this.isPromiseReady = true;
      return this;
    } // fix "Promise Is Undefined" in IE


    this._initPromisePolyfill(function () {
      _this.isPromiseReady = true;
    });

    return this;
  };

  /**
   * run animations
   * @return {*}
   */
  _proto.animate = function animate() {
    var _this2 = this;

    if (!this.isPromiseReady) {
      return setTimeout(function () {
        return _this2.animate();
      }, 5e2);
    }

    return Promise.resolve().then(function () {
      return _this2._cache();
    }).then(function () {
      return _this2._outAnimate();
    }).then(function () {
      return _this2._clear();
    }).then(function () {
      _this2.activeBoxes = Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2.swiper.slides[_this2.swiper.activeIndex].querySelectorAll('[data-swiper-animation]'));

      var runAnimations = _this2.activeBoxes.map(function (el) {
        return new Promise(function (resolve) {
          var effect = el.dataset.swiperAnimation || '',
              duration = el.dataset.duration || '.5s',
              delay = el.dataset.delay || '.5s';
          el.style.visibility = 'visible';
          el.style.cssText += ' animation-duration:' + duration + '; -webkit-animation-duration:' + duration + '; animation-delay:' + delay + '; -webkit-animation-delay:' + delay + ';';
          el.classList.add(effect, 'animated');
          el.isRecovery = false;
          setTimeout(resolve, 0);
        });
      });

      return Promise.all(runAnimations);
    });
  };

  _proto._outAnimate = function _outAnimate() {
    var _runOutTasks = this.activeBoxes.map(function (el) {
      if (el.isRecovery) {
        return Promise.resolve();
      }

      var outEffect = el.dataset.swiperOutAnimation;

      if (!outEffect) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        var duration = el.dataset.outDuration || '.5s';
        el.style.cssText = el.styleCache;
        el.style.visibility = 'visible';
        el.style.cssText += ' animation-duration:' + duration + '; -webkit-animation-duration:' + duration + ';';
        el.classList.add(outEffect, 'animated');
        setTimeout(resolve, 500);
      });
    });

    return Promise.all(_runOutTasks);
  };

  _proto._clear = function _clear() {
    var _this3 = this;

    var _runClearTasks = this.activeBoxes.map(function (el) {
      return new Promise(function (resolve) {
        if (el.isRecovery) {
          resolve();
          return;
        } // recovery


        if (el.styleCache) {
          el.style.cssText = el.styleCache;
          el.classList.remove('animated');

          if (el.dataset.swiperAnimation) {
            el.classList.remove(el.dataset.swiperAnimation);
          }

          if (el.dataset.swiperOutAnimation) {
            el.classList.remove(el.dataset.swiperOutAnimation);
          }
        }

        el.isRecovery = true;
        setTimeout(function () {
          return resolve();
        }, 0);
      });
    });

    return Promise.all(_runClearTasks).then(function () {
      return _this3.activeBoxes = [];
    });
  };

  /**
   * cache allBoxes style
   * @return {*}
   * @private
   */
  _proto._cache = function _cache() {
    var _this4 = this;

    // has cached
    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    console.log('cache'); // start cache

    return new Promise(function (resolve) {
      _this4._initAllBoxes();

      setTimeout(resolve, 0);
    }).then(function () {
      var _runCacheTasks = _this4.allBoxes.map(function (el) {
        return new Promise(function (resolve) {
          if (el.attributes['style']) {
            el.styleCache = sHidden + el.style.cssText;
          } else {
            el.styleCache = sHidden;
          }

          el.style.cssText = el.styleCache;
          el.isRecovery = true; // add el property isRecovery

          setTimeout(resolve, 0);
        });
      });

      return Promise.all(_runCacheTasks);
    });
  };

  /**
   * init this.allBoxes
   * @private
   */
  _proto._initAllBoxes = function _initAllBoxes() {
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
  _proto._initPromisePolyfill = function _initPromisePolyfill(callback) {
    if (callback === void 0) {
      callback = function callback() {};
    }

    // just add promise-polyfill script once
    if (this.appendedPromise) {
      return;
    }

    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';

    oScript.onload = function () {
      return callback();
    };

    oScript.src = PROMISE_POLYFILL_URL;
    document.querySelector('head').appendChild(oScript);
    this.appendedPromise = true;
  };

  return SwiperAnimation;
}();


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