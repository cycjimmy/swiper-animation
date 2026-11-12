(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define([], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.SwiperAnimation = factory());
})(this, function() {
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isNodeList.js
	/**
	* determine nodeList type
	* @param nodeList
	*/
	var isNodeList_default = (nodeList) => Object.prototype.toString.call(nodeList) === "[object NodeList]";
	// node_modules/@cycjimmy/awesome-js-funcs/esm/judgeBasic/isArray.js
	/**
	* determine an array type
	* @param arr
	* @returns {boolean}
	*/
	var isArray_default = (arr) => Object.prototype.toString.call(arr).slice(8, -1) === "Array";
	// node_modules/@cycjimmy/awesome-js-funcs/esm/typeConversion/nodeListToArray.js
	/**
	* nodeList into array
	* @param nodeList
	* @returns {Array}
	*/
	var nodeListToArray_default = (nodeList) => {
		if (isArray_default(nodeList)) return nodeList;
		if (!isNodeList_default(nodeList)) return new Array(nodeList);
		return Array.from ? Array.from(nodeList) : Array.prototype.slice.call(nodeList);
	};
	// src/cacheAnimations.js
	var sHidden = "visibility: hidden;";
	/**
	* cacheAnimations
	* @param {HTMLElement[]} elements
	*/
	var cacheAnimations_default = (elements) => {
		elements.forEach((el) => {
			if (el.animationData) return;
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
	var isPromise_default = (promise) => Object.prototype.toString.call(promise).slice(8, -1) === "Promise";
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
			if (!el.animationData || el.animationData.isRecovery) return Promise.resolve();
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
			if (!el.animationData || el.animationData.isRecovery) return Promise.resolve();
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
	/**
	* isStaleElement
	* @param {HTMLElement} el
	* @returns {boolean} Whether the element still carries an unfinished animation round
	*/
	var isStaleElement = (el) => !el.animationData.isRecovery && !el.animationData.runOnce;
	/**
	* getAnimationElements
	* @param {HTMLElement} slide
	* @returns {HTMLElement[]} The elements of the slide carrying an animation attribute
	*/
	function getAnimationElements(slide) {
		return [...nodeListToArray_default(slide.querySelectorAll("[data-swiper-animation]")), ...nodeListToArray_default(slide.querySelectorAll("[data-swiper-animation-once]"))];
	}
	/**
	* getContainerViewport
	* @param {HTMLElement} container
	* @returns {{left: number, right: number, top: number, bottom: number}} The box Swiper lays the slides out in
	*/
	function getContainerViewport(container) {
		const rect = container.getBoundingClientRect();
		const style = getComputedStyle(container);
		const borderLeft = Number.parseFloat(style.borderLeftWidth) || 0;
		const borderRight = Number.parseFloat(style.borderRightWidth) || 0;
		const borderTop = Number.parseFloat(style.borderTopWidth) || 0;
		const borderBottom = Number.parseFloat(style.borderBottomWidth) || 0;
		return {
			left: rect.left + borderLeft,
			right: rect.right - borderRight,
			top: rect.top + borderTop,
			bottom: rect.bottom - borderBottom
		};
	}
	/**
	* isSlideVisible
	* @param {HTMLElement} slide
	* @param {{left: number, right: number, top: number, bottom: number}} viewport
	* @returns {boolean} Whether the slide has a visible area inside the viewport
	*/
	function isSlideVisible(slide, viewport) {
		const rect = slide.getBoundingClientRect();
		const overlapWidth = Math.min(rect.right, viewport.right) - Math.max(rect.left, viewport.left);
		const overlapHeight = Math.min(rect.bottom, viewport.bottom) - Math.max(rect.top, viewport.top);
		return overlapWidth > 1 && overlapHeight > 1;
	}
	/**
	* getTargetVisibleSlides
	* @param swiper
	* @returns {HTMLElement[]} The slides which will be inside the viewport once the transition is done
	*/
	function getTargetVisibleSlides(swiper) {
		if (typeof swiper.updateSlidesOffset === "function") swiper.updateSlidesOffset();
		const slides = Array.from(swiper.slides || []);
		const slidesSizesGrid = Array.from(swiper.slidesSizesGrid || []);
		const { params = {}, size } = swiper;
		const offsetCenter = -swiper.translate;
		const normalizeOffset = !!(params.cssMode && params.centeredSlides);
		let firstOffset = 0;
		if (normalizeOffset && slides.length && typeof slides[0].swiperSlideOffset === "number") firstOffset = slides[0].swiperSlideOffset;
		return slides.filter((slide, i) => {
			const slideSize = slidesSizesGrid[i];
			if (typeof slide.swiperSlideOffset !== "number" || typeof slideSize !== "number") return false;
			const slideOffset = slide.swiperSlideOffset - firstOffset;
			const slideBefore = -(offsetCenter - slideOffset);
			const slideAfter = slideBefore + slideSize;
			return slideBefore >= 0 && slideBefore < size - 1 || slideAfter > 1 && slideAfter <= size || slideBefore <= 0 && slideAfter >= size;
		});
	}
	/**
	* hasLayoutModel
	* @param swiper
	* @returns {boolean} Whether the target layout of swiper can be read without the DOM
	*/
	function hasLayoutModel(swiper) {
		return typeof swiper.translate === "number" && typeof swiper.size === "number" && swiper.size > 0 && Array.isArray(swiper.slidesSizesGrid);
	}
	/**
	* isContainerRendered
	* @param {HTMLElement} container
	* @returns {boolean} Whether the container has a rendered box to measure
	*/
	function isContainerRendered(container) {
		return typeof container.getClientRects === "function" && container.getClientRects().length > 0;
	}
	/**
	* getActiveSlides
	* @param swiper
	* @param {HTMLElement[]} slides
	* @returns {HTMLElement[]} The slides selected by the active index
	*/
	function getActiveSlides(swiper, slides) {
		const { params = {} } = swiper;
		if (params.grid && params.grid.rows > 1) return slides.filter((slide) => slide.column === swiper.activeIndex);
		const activeSlide = slides[swiper.activeIndex];
		if (activeSlide) return [activeSlide];
		return [];
	}
	/**
	* getVisibleSlides
	* @param swiper
	* @param {HTMLElement} container
	* @returns {HTMLElement[]} The slides inside the swiper viewport
	*/
	function getVisibleSlides(swiper, container) {
		const slides = Array.from(swiper.slides || []);
		if (!isContainerRendered(container)) return getActiveSlides(swiper, slides);
		const { params = {} } = swiper;
		const visibleSlides = Array.from(swiper.visibleSlides || []);
		const watchesProgress = !!(params.watchSlidesProgress || params.centeredSlides && params.autoHeight);
		let measuredSlides;
		if (watchesProgress && visibleSlides.length) measuredSlides = visibleSlides;
		else if (hasLayoutModel(swiper)) measuredSlides = getTargetVisibleSlides(swiper);
		else {
			const viewport = getContainerViewport(container);
			measuredSlides = slides.filter((slide) => isSlideVisible(slide, viewport));
		}
		const result = new Set(measuredSlides);
		getActiveSlides(swiper, slides).forEach((slide) => result.add(slide));
		return [...result];
	}
	var Animations_default = class {
		constructor(swiper) {
			this.swiper = swiper;
			this.container = getSwiperContainer(this.swiper);
			this.round = 0;
			this.started = false;
			this.invalidated = false;
			this.outElements = /* @__PURE__ */ new Set();
			this.animationElements = getAnimationElements(this.container);
			cacheAnimations_default(this.animationElements);
			this.activeElements = this.animationElements.filter(isStaleElement);
		}
		/**
		* animate
		* @returns {Promise<unknown[]>} Resolves when the whole animation round is done
		*/
		animate() {
			const round = ++this.round;
			const previousElements = this.activeElements;
			const previousElementSet = new Set(previousElements);
			let isFirstRound = false;
			let nextElements = [];
			let leavingElements = [];
			let resetElements = /* @__PURE__ */ new Set();
			return this._runStep(round, () => {
				isFirstRound = !this.started;
				nextElements = this._getActiveElements();
				const nextElementSet = new Set(nextElements);
				leavingElements = previousElements.filter((el) => !nextElementSet.has(el));
				leavingElements.forEach((el) => this.outElements.add(el));
				return runOutAnimations_default(leavingElements);
			}).then(() => this._runStep(round, () => {
				const returningElements = nextElements.filter((el) => this.outElements.has(el));
				const staleElements = nextElements.filter((el) => isStaleElement(el) && (isFirstRound || !previousElementSet.has(el)));
				resetElements = new Set(leavingElements);
				returningElements.forEach((el) => resetElements.add(el));
				staleElements.forEach((el) => resetElements.add(el));
				return clearAnimations_default([...resetElements]);
			})).then(() => this._runStep(round, () => {
				this.activeElements = nextElements;
				this.started = true;
				resetElements.forEach((el) => this.outElements.delete(el));
			})).then(() => this._runStep(round, () => runAnimations_default(this.activeElements)));
		}
		/**
		* invalidate
		* Stops the pending rounds of an instance which has been replaced by a new one
		* so that they cannot write to the DOM of the new binding.
		*/
		_invalidate() {
			this.invalidated = true;
		}
		/**
		* runStep
		* @param {number} round
		* @param {Function} step
		* @returns {Promise<*>} Resolves without running the step when the round is outdated
		* @private
		*/
		_runStep(round, step) {
			return Promise.resolve().then(() => {
				if (this.invalidated || round !== this.round) return [];
				return step();
			});
		}
		/**
		* getActiveElements
		* @returns {HTMLElement[]} The animation elements of the slides inside the viewport
		* @private
		*/
		_getActiveElements() {
			const elements = getVisibleSlides(this.swiper, this.container).reduce((list, slide) => list.concat(getAnimationElements(slide)), []);
			cacheAnimations_default(elements);
			return elements;
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
			if (!this.animations || swiper && this.animations.swiper !== swiper) {
				const previous = this.animations;
				this.animations = new Animations_default(swiper);
				if (previous) previous._invalidate();
			}
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
