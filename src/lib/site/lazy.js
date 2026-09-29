import { ScrollTrigger } from "gsap/ScrollTrigger";

// ---------------------------------------------------------------- data-bg

const loadBg = (el) => {
  const bg = el.getAttribute("data-bg");
  if (!bg) return;
  el.style.backgroundImage = `url("${bg}")`;
  el.removeAttribute("data-bg");
};

let bgObserver = null;
const getBgObserver = () =>
  (bgObserver ??= new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          loadBg(e.target);
          bgObserver.unobserve(e.target);
        }
      }),
    { rootMargin: "200% 0px" }
  ));

export const observeBackgrounds = (root = document) => {
  root.querySelectorAll("[data-bg]").forEach((el) => getBgObserver().observe(el));
};

/** data-bg backgrounds: near the viewport first, the rest once the user interacts. */
export function initLazyBackgrounds(scope) {
  observeBackgrounds(document);
  const events = ["pointerdown", "pointermove", "touchstart", "keydown", "wheel", "scroll"];
  const loadAll = () => {
    events.forEach((t) => window.removeEventListener(t, loadAll));
    const run = () => document.querySelectorAll("[data-bg]").forEach(loadBg);
    if ("requestIdleCallback" in window) requestIdleCallback(run, { timeout: 1500 });
    else setTimeout(run, 300);
  };
  events.forEach((t) => scope.on(window, t, loadAll, { passive: true }));
}

// ---------------------------------------------------------------- img[data-src]

const loadImg = (img) => {
  const { src, srcset, sizes } = img.dataset;
  if (srcset) img.srcset = srcset;
  if (sizes) img.sizes = sizes;
  if (src) img.src = src;
  delete img.dataset.src;
  delete img.dataset.srcset;
  delete img.dataset.sizes;
  img.classList.add("swiper-lazy-loaded");
};

/** Lazy <img data-src> outside sliders (e.g. inside dialogs). */
export function initLazyImages(scope) {
  const io = scope.observe(
    new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          loadImg(e.target);
        }),
      { rootMargin: "100% 0px" }
    )
  );
  document.querySelectorAll("img[data-src]").forEach((img) => {
    if (!img.closest(".swiper")) io.observe(img);
  });
}

// ---------------------------------------------------------------- Swiper lazy module

const AROUND = 2;
const ownedBy = (swiper, el) => {
  let p = el.parentElement;
  while (p) {
    if (p.swiper) return p.swiper === swiper;
    p = p.parentElement;
  }
  return false;
};

const loadSlide = (swiper, slide) => {
  slide.querySelectorAll('img[data-src], img[loading="lazy"]').forEach((img) => {
    if (!ownedBy(swiper, img)) return;
    if (img.dataset.src) loadImg(img);
    else img.loading = "eager";
  });
  if (slide.hasAttribute("data-bg")) loadBg(slide);
  slide.querySelectorAll("[data-bg]").forEach((el) => ownedBy(swiper, el) && loadBg(el));
};

const loadAround = (swiper) => {
  if (!swiper || swiper.destroyed || !swiper.lazyActive || !swiper.slides?.length) return;
  const slides = swiper.slides;
  const wanted = new Set();
  const add = (i) => i >= 0 && i < slides.length && wanted.add(i);
  const visible = swiper.visibleSlidesIndexes?.length ? swiper.visibleSlidesIndexes : [swiper.activeIndex];
  visible.forEach((i) => {
    for (let d = -AROUND; d <= AROUND; d++) add(i + d);
  });
  for (let d = -AROUND; d <= AROUND; d++) add(swiper.activeIndex + d);
  wanted.forEach((i) => loadSlide(swiper, slides[i]));
};

const activate = (swiper) => {
  if (swiper.lazyActive) return;
  swiper.lazyActive = true;
  loadAround(swiper);
};

/** Swiper module: loads slide images once the slider nears the viewport. */
export function LazySlides({ swiper, on }) {
  let io = null;
  on("init", () => {
    observeBackgrounds(swiper.el);
    io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          activate(swiper);
        }
      },
      { rootMargin: "100% 0px" }
    );
    io.observe(swiper.el);
  });
  ["slideChange", "transitionStart", "sliderMove"].forEach((ev) =>
    on(ev, () => {
      activate(swiper);
      loadAround(swiper);
    })
  );
  on("update", () => loadAround(swiper));
  on("resize", () => loadAround(swiper));
  on("destroy", () => io?.disconnect());
}

// ---------------------------------------------------------------- videos

/** Autoplay videos only while on screen (port of resort-video.js). */
export function initVideos(scope) {
  const videos = document.querySelectorAll("main video[autoplay], main video[data-autoplay]");
  if (!videos.length) return;
  const io = scope.observe(
    new IntersectionObserver((entries) => {
      entries.forEach(({ target: v, isIntersecting }) => {
        if (isIntersecting) {
          const poster = v.getAttribute("data-poster");
          if (poster) {
            v.setAttribute("poster", poster);
            v.removeAttribute("data-poster");
          }
          v.muted = true;
          v.playsInline = true;
          v.play()?.catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      });
    })
  );
  videos.forEach((v) => {
    v.muted = true;
    io.observe(v);
  });
}

// ---------------------------------------------------------------- AOS

const PLACEMENT = {
  "top-bottom": "top bottom",
  "center-bottom": "center bottom",
  "bottom-bottom": "bottom bottom",
  "top-center": "top center",
  "bottom-center": "bottom center",
  "center-center": "center center",
  "top-top": "top top",
  "bottom-top": "bottom top",
  "center-top": "center top",
};

/**
 * Minimal AOS replacement driven by ScrollTrigger (so it follows ScrollSmoother):
 * adds `aos-animate` when the element passes the trigger line, removes it when
 * scrolling back above unless data-aos-once="true". Uses the theme's aos.css.
 */
export function initAos() {
  const body = document.body;
  body.setAttribute("data-aos-easing", "ease");
  body.setAttribute("data-aos-duration", "400");
  body.setAttribute("data-aos-delay", "0");

  document.querySelectorAll("[data-aos]").forEach((el) => {
    el.classList.add("aos-init");
    const offsetAttr = el.getAttribute("data-aos-offset");
    const placement = el.getAttribute("data-aos-anchor-placement");
    const anchorSel = el.getAttribute("data-aos-anchor");
    const once = el.getAttribute("data-aos-once") === "true";
    const offset = offsetAttr ? parseInt(offsetAttr, 10) : placement ? 0 : 130;
    const [edge, line] = (PLACEMENT[placement] ?? "top bottom").split(" ");

    ScrollTrigger.create({
      trigger: (anchorSel && document.querySelector(anchorSel)) || el,
      start: `${edge} ${line}-=${offset}`,
      onEnter: () => el.classList.add("aos-animate"),
      onLeaveBack: () => !once && el.classList.remove("aos-animate"),
    });
  });
}
