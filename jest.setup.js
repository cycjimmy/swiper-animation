// Swiper 9+ checks `element instanceof HTMLSlotElement` while initialising
// (swiper/shared/utils.mjs -> elementChildren). jsdom does not implement shadow
// DOM slots, so the bare identifier throws a ReferenceError. A stub class is
// enough: no Swiper code path reaches it for non-shadow markup.
globalThis.HTMLSlotElement ??= class HTMLSlotElement {}
