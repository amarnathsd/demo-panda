import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Swiper from "swiper";
import { Autoplay, EffectFade, FreeMode, Navigation, Pagination } from "swiper/modules";
import { LazySlides } from "./lazy";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, DrawSVGPlugin, ScrollToPlugin);

Swiper.use([Navigation, Pagination, Autoplay, EffectFade, FreeMode, LazySlides]);
// The theme styles Swiper 7's `::after` arrows, so don't inject Swiper 14's SVG icons.
Swiper.extendDefaults({ watchSlidesProgress: true, navigation: { addIcons: false } });

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, Swiper };

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

export const isDesktopPointer = () =>
  !("ontouchstart" in window || navigator.maxTouchPoints > 0);

export const refreshScroll = () => ScrollTrigger.refresh();

/**
 * Swiper 7 (what the theme was built on) cloned slides for loop mode; Swiper 14
 * needs enough real slides instead. Clone the slide set until there are enough,
 * or turn loop off when there is nothing to loop.
 */
function prepareLoop(el, params) {
  if (!params.loop) return params;
  const wrapper = el.querySelector(":scope > .swiper-wrapper");
  const slides = wrapper ? [...wrapper.children].filter((s) => s.classList.contains("swiper-slide")) : [];
  if (slides.length < 2) return { ...params, loop: false };
  if (params.effect === "fade") return params;

  const perViews = [params.slidesPerView, ...Object.values(params.breakpoints ?? {}).map((b) => b.slidesPerView)].filter(
    (v) => v !== undefined
  );
  let needed;
  if (perViews.includes("auto")) {
    const width = el.clientWidth || window.innerWidth;
    const slideWidth = Math.max(1, Math.min(...slides.map((s) => s.offsetWidth || width)));
    needed = Math.ceil(width / slideWidth) * 2 + 2;
  } else {
    const max = Math.max(1, ...perViews.map(Number));
    needed = Math.ceil(max) * 2 + 1;
  }
  const originals = slides.filter((s) => !s.classList.contains("swiper-slide-duplicate"));
  while (wrapper.children.length < needed) {
    originals.forEach((s) => {
      const clone = s.cloneNode(true);
      clone.classList.add("swiper-slide-duplicate");
      clone.setAttribute("aria-hidden", "true");
      wrapper.appendChild(clone);
    });
  }
  return params;
}

/**
 * Everything a page initialises (listeners, observers, swipers, DOM nodes) is
 * registered here so it can be torn down on client-side navigation.
 */
export function createScope() {
  const disposers = [];
  const swiperEls = new WeakSet();

  return {
    on(target, type, fn, opts) {
      if (!target) return;
      target.addEventListener(type, fn, opts);
      disposers.push(() => target.removeEventListener(type, fn, opts));
    },
    add(fn) {
      disposers.push(fn);
    },
    observe(observer) {
      disposers.push(() => observer.disconnect());
      return observer;
    },
    timeout(fn, ms) {
      const id = setTimeout(fn, ms);
      disposers.push(() => clearTimeout(id));
    },
    /** new Swiper() once per element; destroyed with the scope. */
    swiper(target, params, root = document) {
      const els =
        typeof target === "string" ? $$(target, root) : target instanceof Element ? [target] : [];
      let last = null;
      els.forEach((el) => {
        if (swiperEls.has(el) || el.swiper) return;
        swiperEls.add(el);
        const instance = new Swiper(el, prepareLoop(el, params));
        disposers.push(() => {
          if (!instance.destroyed) instance.destroy(true, true);
        });
        last = instance;
      });
      return last;
    },
    dispose() {
      while (disposers.length) {
        try {
          disposers.pop()();
        } catch (err) {
          console.error(err);
        }
      }
    },
  };
}

/** Run a DOM transform only once per element (safe under StrictMode double effects). */
export const once = (el, key) => {
  if (!el || el.dataset[key]) return false;
  el.dataset[key] = "1";
  return true;
};
