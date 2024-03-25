(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.SwiperAnimation = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
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
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  /**
   * determine nodeList type
   * @param nodeList
   */
  var isNodeList = (nodeList => Object.prototype.toString.call(nodeList) === '[object NodeList]');

  /**
   * determine an array type
   * @param arr
   * @returns {boolean}
   */
  var isArray = (arr => Object.prototype.toString.call(arr).slice(8, -1) === 'Array');

  /**
   * nodeList into array
   * @param nodeList
   * @returns {Array}
   */
  var nodeListToArray = (nodeList => {
    if (isArray(nodeList)) {
      return nodeList;
    }
    if (!isNodeList(nodeList)) {
      return new Array(nodeList);
    }
    return Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
  });

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

  /**
   * determine a promise type
   * @param promise
   * @returns {boolean}
   */
  var isPromise = (promise => Object.prototype.toString.call(promise).slice(8, -1) === 'Promise');

  /**
   * function to promise
   * @param normalFunction
   * @param timeout
   * @returns {Promise<any>}
   */
  var functionToPromise = (function (normalFunction) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    if (isPromise(normalFunction)) {
      return normalFunction;
    }

    // eslint-disable-next-line no-undef
    return new Promise(resolve => {
      normalFunction();
      setTimeout(resolve, timeout);
    });
  });

  var constants = {
    /**
     * className `animated` for Animate.css
     * @type {string[]}
     */
    AnimateCssAnimated: ['animated', 'animate__animated']
  };

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
      return functionToPromise(function () {
        var _el$classList;
        el.style.visibility = 'visible';
        el.style.cssText += " animation-duration:".concat(el.animationData.duration, "; -webkit-animation-duration:").concat(el.animationData.duration, "; animation-delay:").concat(el.animationData.delay, "; -webkit-animation-delay:").concat(el.animationData.delay, ";");
        (_el$classList = el.classList).add.apply(_el$classList, [el.animationData.effect].concat(_toConsumableArray(constants.AnimateCssAnimated)));
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
      return functionToPromise(function () {
        el.style.cssText = el.animationData.styleCache;
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
      return functionToPromise(function () {
        var _el$classList;
        // recovery
        el.style.cssText = el.animationData.styleCache;
        (_el$classList = el.classList).remove.apply(_el$classList, _toConsumableArray([el.animationData.effect, el.animationData.outEffect].concat(_toConsumableArray(constants.AnimateCssAnimated)).filter(function (str) {
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
  var _default$1 = /*#__PURE__*/function () {
    function _default(swiper) {
      _classCallCheck(this, _default);
      this.swiper = swiper;
      this.container = getSwiperContainer(this.swiper);
      this.animationElements = [].concat(_toConsumableArray(nodeListToArray(this.container.querySelectorAll('[data-swiper-animation]'))), _toConsumableArray(nodeListToArray(this.container.querySelectorAll('[data-swiper-animation-once]'))));
      this.activeElements = [];
      cacheAnimations(this.animationElements);
    }

    /**
     * animate
     * @returns {Promise<unknown[]>}
     */
    return _createClass(_default, [{
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
        this.activeElements = [].concat(_toConsumableArray(nodeListToArray(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation]'))), _toConsumableArray(nodeListToArray(this.swiper.slides[this.swiper.activeIndex].querySelectorAll('[data-swiper-animation-once]'))));
        return this.activeElements;
      }
    }]);
  }();

  var _default = /*#__PURE__*/function () {
    function _default() {
      _classCallCheck(this, _default);
      this.animations = null;
      if (!isPromiseReady()) {
        promisePolyfill();
      }
    }

    /**
     * init
     * @param swiper
     */
    return _createClass(_default, [{
      key: "init",
      value: function init(swiper) {
        if (!this.animations) {
          this.animations = new _default$1(swiper);
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
  }();

  return _default;

}));
