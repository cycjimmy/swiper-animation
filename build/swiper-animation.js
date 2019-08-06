/*!
 * swiper-animation v2.0.1
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
/* harmony import */ var awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);


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
      _this2.activeBoxes = [].concat(Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2.swiper.slides[_this2.swiper.activeIndex].querySelectorAll('[data-swiper-animation]')), Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(_this2.swiper.slides[_this2.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]')));

      var runAnimations = _this2.activeBoxes.map(function (el) {
        if (!el.__animationData) {
          return Promise.resolve();
        }

        return Object(awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
          el.style.visibility = 'visible';
          el.style.cssText += ' animation-duration:' + el.__animationData.duration + '; -webkit-animation-duration:' + el.__animationData.duration + '; animation-delay:' + el.__animationData.delay + '; -webkit-animation-delay:' + el.__animationData.delay + ';';
          el.classList.add(el.__animationData.effect, 'animated');
          el.__animationData.isRecovery = false;
        });
      });

      return Promise.all(runAnimations);
    });
  };

  _proto._outAnimate = function _outAnimate() {
    var _runOutTasks = this.activeBoxes.map(function (el) {
      if (el.__animationData.isRecovery) {
        return Promise.resolve();
      }

      if (!el.__animationData.outEffect) {
        return Promise.resolve();
      }

      return Object(awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
        el.style.cssText = el.styleCache;
        el.style.visibility = 'visible';
        el.style.cssText += ' animation-duration:' + el.__animationData.outDuration + '; -webkit-animation-duration:' + el.__animationData.outDuration + ';';
        el.classList.add(el.__animationData.outEffect, 'animated');
      }, 500);
    });

    return Promise.all(_runOutTasks);
  };

  _proto._clear = function _clear() {
    var _this3 = this;

    var _runClearTasks = this.activeBoxes.map(function (el) {
      if (el.__animationData.isRecovery) {
        return Promise.resolve();
      }

      if (el.__animationData.runOnce) {
        return Promise.resolve();
      }

      return Object(awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
        var _el$classList;

        // recovery
        el.style.cssText = el.__animationData.styleCache;

        (_el$classList = el.classList).remove.apply(_el$classList, [el.__animationData.effect, el.__animationData.outEffect, 'animated'].filter(function (str) {
          return !!str;
        }));

        el.__animationData.isRecovery = true;
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
    } // start cache


    return Promise.resolve().then(function () {
      return _this4._initAllBoxes();
    }).then(function () {
      var _runCacheTasks = _this4.allBoxes.map(function (el) {
        return Object(awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
          el.__animationData = {
            styleCache: el.attributes['style'] ? sHidden + el.style.cssText : sHidden,
            effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || '',
            duration: el.dataset.duration || '.5s',
            delay: el.dataset.delay || '.5s',
            outEffect: el.dataset.swiperOutAnimation || '',
            outDuration: el.dataset.outDuration || '.5s',
            isRecovery: true,
            runOnce: !!el.dataset.swiperAnimationOnce
          };
          el.style.cssText = el.__animationData.styleCache;
        });
      });

      return Promise.all(_runCacheTasks);
    });
  };

  /**
   * init this.allBoxes
   * @returns {Promise<void>}
   * @private
   */
  _proto._initAllBoxes = function _initAllBoxes() {
    var _this5 = this;

    if (this.allBoxes.length) {
      return Promise.resolve();
    }

    return Object(awesome_js_funcs_typeConversion_functionToPromise__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
      var swiperWrapper = null;

      if (_this5.swiper.wrapperEl) {
        // swiper 4+
        swiperWrapper = _this5.swiper.wrapperEl;
      } else if (_this5.swiper.wrapper) {
        // swiper 3.x
        swiperWrapper = _this5.swiper.wrapper[0];
      }

      _this5.allBoxes = [].concat(Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(swiperWrapper.querySelectorAll('[data-swiper-animation]')), Object(awesome_js_funcs_typeConversion_nodeListToArray__WEBPACK_IMPORTED_MODULE_0__["default"])(swiperWrapper.querySelectorAll('[data-swiper-animation-once]')));
    });
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

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _judgeBasic_isPromise__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);

/**
 * function to promise
 * @param normalFunction
 * @param timeout
 * @returns {Promise<any>}
 */

/* harmony default export */ __webpack_exports__["default"] = (function (normalFunction, timeout) {
  if (timeout === void 0) {
    timeout = 0;
  }

  if (Object(_judgeBasic_isPromise__WEBPACK_IMPORTED_MODULE_0__["default"])(normalFunction)) {
    return normalFunction;
  }

  return new Promise(function (resolve) {
    normalFunction();
    setTimeout(resolve, timeout);
  });
});

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/**
 * @param promise
 * @returns {boolean}
 */
/* harmony default export */ __webpack_exports__["default"] = (function (promise) {
  return Object.prototype.toString.call(promise).slice(8, -1) === 'Promise';
});

/***/ })
/******/ ])["default"];
});