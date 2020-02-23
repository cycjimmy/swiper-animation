(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.SwiperAnimation = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var PROMISE_POLYFILL_URL = 'https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js';
  var appendedPromisePolyfill = false;
  /**
   * isPromiseReady
   * @returns {boolean}
   */

  var isPromiseReady = function isPromiseReady() {
    return !!window.Promise;
  };
  /**
   * promisePolyfill
   */

  var promisePolyfill = function promisePolyfill() {
    if (appendedPromisePolyfill) {
      return;
    }

    if (isPromiseReady()) {
      return;
    }

    var oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = PROMISE_POLYFILL_URL;
    document.querySelector('head').appendChild(oScript);
    appendedPromisePolyfill = true;
  };

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var isNodeList = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  /**
   * 判断是否nodeList
   * @param nodeList
   */

  var _default = function _default(nodeList) {
    return Object.prototype.toString.call(nodeList) === '[object NodeList]';
  };

  exports["default"] = _default;
  });

  unwrapExports(isNodeList);

  var nodeListToArray = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _isNodeList = _interopRequireDefault(isNodeList);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }

  var _default = function _default(nodeList) {
    if (Array.isArray(nodeList)) {
      return nodeList;
    }

    if (!(0, _isNodeList["default"])(nodeList)) {
      return new Array(nodeList);
    }

    return Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
  };

  exports["default"] = _default;
  });

  var nodeListToArray$1 = unwrapExports(nodeListToArray);

  var sHidden = 'visibility: hidden;';
  /**
   * cacheAnimations
   * @param elements[HTMLElement]
   */

  var cacheAnimations = (function (elements) {
    elements.forEach(function (el) {
      el.animationData = {
        styleCache: el.attributes.style ? sHidden + el.style.cssText : sHidden,
        effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || '',
        duration: el.dataset.duration || '.5s',
        delay: el.dataset.delay || '.5s',
        outEffect: el.dataset.swiperOutAnimation || '',
        outDuration: el.dataset.outDuration || '.5s',
        isRecovery: true,
        runOnce: !!el.dataset.swiperAnimationOnce
      };
      el.style.cssText = el.animationData.styleCache;
    });
  });

  var isPromise = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;
  /**
   * @param promise
   * @returns {boolean}
   */

  var _default = function _default(promise) {
    return Object.prototype.toString.call(promise).slice(8, -1) === 'Promise';
  };

  exports["default"] = _default;
  });

  unwrapExports(isPromise);

  var functionToPromise = createCommonjsModule(function (module, exports) {

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports["default"] = void 0;

  var _isPromise = _interopRequireDefault(isPromise);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      "default": obj
    };
  }
  /**
   * function to promise
   * @param normalFunction
   * @param timeout
   * @returns {Promise<any>}
   */


  var _default = function _default(normalFunction) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if ((0, _isPromise["default"])(normalFunction)) {
      return normalFunction;
    }

    return new Promise(function (resolve) {
      normalFunction();
      setTimeout(resolve, timeout);
    });
  };

  exports["default"] = _default;
  });

  var functionToPromise$1 = unwrapExports(functionToPromise);

  /**
   * runAnimations
   * @param activeElements[HTMLElement]
   * @returns {Promise<unknown[]>}
   */

  var runAnimations = (function (activeElements) {
    var runAnimateTasks = activeElements.map(function (el) {
      if (!el.animationData) {
        return Promise.resolve();
      }

      return functionToPromise$1(function () {
        el.style.visibility = 'visible';
        el.style.cssText += " animation-duration:".concat(el.animationData.duration, "; -webkit-animation-duration:").concat(el.animationData.duration, "; animation-delay:").concat(el.animationData.delay, "; -webkit-animation-delay:").concat(el.animationData.delay, ";");
        el.classList.add(el.animationData.effect, 'animated');
        el.animationData.isRecovery = false;
      });
    });
    return Promise.all(runAnimateTasks);
  });

  /**
   * runOutAnimations
   * @param activeElements[HTMLElement]
   * @returns {Promise<unknown[]>}
   */

  var runOutAnimations = (function (activeElements) {
    var runOutTasks = activeElements.map(function (el) {
      if (el.animationData.isRecovery) {
        return Promise.resolve();
      }

      if (!el.animationData.outEffect) {
        return Promise.resolve();
      }

      return functionToPromise$1(function () {
        el.style.cssText = el.styleCache;
        el.style.visibility = 'visible';
        el.style.cssText += " animation-duration:".concat(el.animationData.outDuration, "; -webkit-animation-duration:").concat(el.animationData.outDuration, ";");
        el.classList.add(el.animationData.outEffect, 'animated');
      }, 500);
    });
    return Promise.all(runOutTasks);
  });

  /**
   * clearAnimations
   * @param activeElements[HTMLElement]
   * @returns {Promise<unknown[]>}
   */

  var clearAnimations = (function (activeElements) {
    var runClearTasks = activeElements.map(function (el) {
      if (el.animationData.isRecovery) {
        return Promise.resolve();
      }

      if (el.animationData.runOnce) {
        return Promise.resolve();
      }

      return functionToPromise$1(function () {
        var _el$classList;

        // recovery
        el.style.cssText = el.animationData.styleCache;

        (_el$classList = el.classList).remove.apply(_el$classList, _toConsumableArray([el.animationData.effect, el.animationData.outEffect, 'animated'].filter(function (str) {
          return !!str;
        })));

        el.animationData.isRecovery = true;
      });
    });
    return Promise.all(runClearTasks);
  });

  /**
   * getSwiperContainer
   * @param swiper
   * @returns {null|*|Object}
   */

  var getSwiperContainer = function getSwiperContainer(swiper) {
    if (swiper.el) {
      // swiper 4+
      return swiper.el;
    }

    if (swiper.container) {
      // swiper 3.x
      // eslint-disable-next-line prefer-destructuring
      return swiper.container[0];
    }

    throw new Error('Illegal swiper instance');
  };

  var _default =
  /*#__PURE__*/
  function () {
    function _default(swiper) {
      _classCallCheck(this, _default);

      this.swiper = swiper;
      this.container = getSwiperContainer(this.swiper);
      this.animationElements = [].concat(_toConsumableArray(nodeListToArray$1(this.container.querySelectorAll('[data-swiper-animation]'))), _toConsumableArray(nodeListToArray$1(this.container.querySelectorAll('[data-swiper-animation-once]'))));
      this.activeElements = [];
      cacheAnimations(this.animationElements);
    }
    /**
     * animate
     * @returns {Promise<unknown[]>}
     */


    _createClass(_default, [{
      key: "animate",
      value: function animate() {
        var _this = this;

        return Promise.resolve().then(function () {
          return runOutAnimations(_this.activeElements);
        }).then(function () {
          return clearAnimations(_this.activeElements);
        }).then(function () {
          return runAnimations(_this._updateActiveElements());
        });
      }
      /**
       * update activeElements
       * @returns {[]|*[]|*}
       * @private
       */

    }, {
      key: "_updateActiveElements",
      value: function _updateActiveElements() {
        this.activeElements = [].concat(_toConsumableArray(nodeListToArray$1(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]'))), _toConsumableArray(nodeListToArray$1(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]'))));
        return this.activeElements;
      }
    }]);

    return _default;
  }();

  var _default$1 =
  /*#__PURE__*/
  function () {
    function _default$1() {
      _classCallCheck(this, _default$1);

      this.animations = null;

      if (!isPromiseReady()) {
        promisePolyfill();
      }
    }
    /**
     * init
     * @param swiper
     */


    _createClass(_default$1, [{
      key: "init",
      value: function init(swiper) {
        if (!this.animations) {
          this.animations = new _default(swiper);
        }

        return this;
      }
      /**
       * run animations
       * @return {*}
       */

    }, {
      key: "animate",
      value: function animate() {
        var _this = this;

        if (!isPromiseReady()) {
          return setTimeout(function () {
            return _this.animate();
          }, 5e2);
        }

        return this.animations.animate();
      }
    }]);

    return _default$1;
  }();

  return _default$1;

})));
