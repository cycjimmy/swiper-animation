(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define([], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SwiperAnimation = factory());
})(this, function() {
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isNodeList.js
	/**
	* determine nodeList type
	* @param nodeList
	*/
	var isNodeList_default = ((nodeList) => Object.prototype.toString.call(nodeList) === "[object NodeList]");
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isArray.js
	/**
	* determine an array type
	* @param arr
	* @returns {boolean}
	*/
	var isArray_default = ((arr) => Object.prototype.toString.call(arr).slice(8, -1) === "Array");
	// node_modules/@cycjimmy/awesome-js-funcs/esm/typeConversion/nodeListToArray.js
	/**
	* nodeList into array
	* @param nodeList
	* @returns {Array}
	*/
	var nodeListToArray_default = ((nodeList) => {
		if (isArray_default(nodeList)) return nodeList;
		if (!isNodeList_default(nodeList)) return new Array(nodeList);
		return Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
	});
	// src/cacheAnimations.js
	var sHidden = "visibility: hidden;";
	/**
	* cacheAnimations
	* @param {HTMLElement[]} elements
	*/
	var cacheAnimations_default = (elements) => {
		elements.forEach((el) => {
			el.animationData = {
				styleCache: el.attributes.style ? sHidden + el.style.cssText : sHidden,
				effect: el.dataset.swiperAnimation || el.dataset.swiperAnimationOnce || "",
				duration: el.dataset.duration || ".5s",
				delay: el.dataset.delay || ".5s",
				outEffect: el.dataset.swiperOutAnimation || "",
				outDuration: el.dataset.outDuration || ".5s",
				isRecovery: true,
				runOnce: !!el.dataset.swiperAnimationOnce
			};
			el.style.cssText = el.animationData.styleCache;
		});
	};
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isPromise.js
	/**
	* determine a promise type
	* @param promise
	* @returns {boolean}
	*/
	var isPromise_default = ((promise) => Object.prototype.toString.call(promise).slice(8, -1) === "Promise");
	// node_modules/@cycjimmy/awesome-js-funcs/esm/typeConversion/functionToPromise.js
	/**
	* function to promise
	* @param normalFunction
	* @param timeout
	* @returns {Promise<any>}
	*/
	var functionToPromise_default = (function(normalFunction) {
		var timeout = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
		if (isPromise_default(normalFunction)) return normalFunction;
		return new Promise((resolve) => {
			normalFunction();
			setTimeout(resolve, timeout);
		});
	});
	// src/constants.js
	var constants_default = { 
	/**
	* className `animated` for Animate.css
	* @type {string[]}
	*/
AnimateCssAnimated: ["animated", "animate__animated"] };
	// src/clearAnimations.js
	/**
	* clearAnimations
	* @param {HTMLElement[]} activeElements
	* @returns {Promise<unknown[]>} Resolves when every element is reset
	*/
	var clearAnimations_default = (activeElements) => {
		const runClearTasks = activeElements.map((el) => {
			if (el.animationData.isRecovery) return Promise.resolve();
			if (el.animationData.runOnce) return Promise.resolve();
			return functionToPromise_default(() => {
				el.style.cssText = el.animationData.styleCache;
				el.classList.remove(...[
					el.animationData.effect,
					el.animationData.outEffect,
					...constants_default.AnimateCssAnimated
				].filter((str) => !!str));
				el.animationData.isRecovery = true;
			});
		});
		return Promise.all(runClearTasks);
	};
	// src/runAnimations.js
	/**
	* runAnimations
	* @param {HTMLElement[]} activeElements
	* @returns {Promise<unknown[]>} Resolves when every entering animation is started
	*/
	var runAnimations_default = (activeElements) => {
		const runAnimateTasks = activeElements.map((el) => {
			if (!el.animationData) return Promise.resolve();
			return functionToPromise_default(() => {
				el.style.visibility = "visible";
				el.style.cssText += ` animation-duration:${el.animationData.duration}; -webkit-animation-duration:${el.animationData.duration}; animation-delay:${el.animationData.delay}; -webkit-animation-delay:${el.animationData.delay};`;
				el.classList.add(el.animationData.effect, ...constants_default.AnimateCssAnimated);
				el.animationData.isRecovery = false;
			});
		});
		return Promise.all(runAnimateTasks);
	};
	// src/runOutAnimations.js
	/**
	* runOutAnimations
	* @param {HTMLElement[]} activeElements
	* @returns {Promise<unknown[]>} Resolves when every leaving animation is started
	*/
	var runOutAnimations_default = (activeElements) => {
		const runOutTasks = activeElements.map((el) => {
			if (el.animationData.isRecovery) return Promise.resolve();
			if (!el.animationData.outEffect) return Promise.resolve();
			return functionToPromise_default(() => {
				el.style.cssText = el.animationData.styleCache;
				el.style.visibility = "visible";
				el.style.cssText += ` animation-duration:${el.animationData.outDuration}; -webkit-animation-duration:${el.animationData.outDuration};`;
				el.classList.add(el.animationData.outEffect, "animated");
			}, 500);
		});
		return Promise.all(runOutTasks);
	};
	// src/Animations.js
	/**
	* getSwiperContainer
	* @param swiper
	* @returns {null | * | object} The container element of the swiper instance
	*/
	function getSwiperContainer(swiper) {
		if (swiper.el) return swiper.el;
		if (swiper.container) return swiper.container[0];
		throw new Error("Illegal swiper instance");
	}
	var Animations_default = class {
		constructor(swiper) {
			this.swiper = swiper;
			this.container = getSwiperContainer(this.swiper);
			this.animationElements = [...nodeListToArray_default(this.container.querySelectorAll("[data-swiper-animation]")), ...nodeListToArray_default(this.container.querySelectorAll("[data-swiper-animation-once]"))];
			this.activeElements = [];
			cacheAnimations_default(this.animationElements);
		}
		/**
		* animate
		* @returns {Promise<unknown[]>} Resolves when the whole animation round is done
		*/
		animate() {
			return Promise.resolve().then(() => runOutAnimations_default(this.activeElements)).then(() => clearAnimations_default(this.activeElements)).then(() => runAnimations_default(this._updateActiveElements()));
		}
		/**
		* update activeElements
		* @returns {[]|*[]|*} The animation elements of the active slide
		* @private
		*/
		_updateActiveElements() {
			this.activeElements = [...nodeListToArray_default(this.swiper.slides[this.swiper.activeIndex].querySelectorAll("[data-swiper-animation]")), ...nodeListToArray_default(this.swiper.slides[this.swiper.activeIndex].querySelectorAll("[data-swiper-animation-once]"))];
			return this.activeElements;
		}
	};
	// src/tools.js
	var PROMISE_POLYFILL_URL = "https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js";
	var appendedPromisePolyfill = false;
	/**
	* isPromiseReady
	* @returns {boolean} Whether the native Promise is available
	*/
	var isPromiseReady = () => !!window.Promise;
	/**
	* promisePolyfill
	*/
	function promisePolyfill() {
		if (appendedPromisePolyfill) return;
		if (isPromiseReady()) return;
		const oScript = document.createElement("script");
		oScript.type = "text/javascript";
		oScript.src = PROMISE_POLYFILL_URL;
		document.querySelector("head").appendChild(oScript);
		appendedPromisePolyfill = true;
	}
	// src/index.js
	var src_default = class {
		constructor() {
			this.animations = null;
			if (!isPromiseReady()) promisePolyfill();
		}
		/**
		* init
		* @param swiper
		*/
		init(swiper) {
			if (!this.animations) this.animations = new Animations_default(swiper);
			return this;
		}
		/**
		* run animations
		* @return {*}
		*/
		animate() {
			if (!isPromiseReady()) return setTimeout(() => this.animate(), 500);
			return this.animations.animate();
		}
	};
	return src_default;
});
