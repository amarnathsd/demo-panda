import { $, $$, gsap, ScrollTrigger } from "./runtime";

// "01 / 05" + progress bar, used by most sliders on the site.
export const themePagination = (current, total, wrapperClass = "theme-pagination-wrapper") => `
  <div class="${wrapperClass}">
    <div class="spans-wrapper">
      <span class="current">${String(current).padStart(2, "0")}</span>
      /
      <span class="total">${String(total).padStart(2, "0")}</span>
    </div>
    <div class="progressbar-background">
      <div class="progressbar-fill" style="width: ${(current / total) * 100}%;"></div>
    </div>
  </div>`;

const customPagination = (el, wrapperClass) => ({
  el,
  type: "custom",
  renderCustom: (_s, current, total) => themePagination(current, total, wrapperClass),
});

// Toggles `.active` on [data-swiper-index] siblings of a slider's section.
const syncIndexed = (swiper, index) => {
  const section = swiper.el.closest("section");
  section?.querySelectorAll("[data-swiper-index]").forEach((el) => {
    el.classList.toggle("active", parseInt(el.dataset.swiperIndex, 10) === index);
  });
};

/** All Swiper instances from the theme bundle (Le() and friends). */
export function initSwipers(scope) {
  const S = (sel, params) => scope.swiper(sel, params);
  const w = window.innerWidth;

  if (w < 992) {
    S(".experience_details_swipe_mobile", {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      touchReleaseOnEdges: true,
      resistanceRatio: 0,
      autoplay: { delay: 5000 },
      pagination: customPagination($("#details .mobile-details-pagination")),
      navigation: {
        nextEl: $("#details .mobile-details-navigation .swiper-button-next"),
        prevEl: $("#details .mobile-details-navigation .swiper-button-prev"),
      },
    });
  }

  S(".marquee-swiper", {
    slidesPerView: "auto",
    spaceBetween: 80,
    loop: true,
    speed: 6000,
    allowTouchMove: false,
    autoplay: { delay: 1, disableOnInteraction: false },
    breakpoints: { 0: { speed: 3500, spaceBetween: 50 }, 769: { speed: 4500 } },
  });

  S(".portfolioswiper", {
    effect: "fade",
    loop: true,
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    allowTouchMove: false,
    autoplay: { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: true },
    navigation: { nextEl: $(".portfolioswiper .button-next"), prevEl: $(".portfolioswiper .button-prev") },
    pagination: customPagination($(".portfolioswiper .swiper-pagination")),
  });

  S(".travel_swipe", {
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    speed: 1500,
    autoplay: { delay: 5000 },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  });

  S(".experiences_home_swipe", {
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    speed: 1000,
    navigation: {
      nextEl: $("#home_tours .swiper-button-next.tour-nav"),
      prevEl: $("#home_tours .swiper-button-prev.tour-nav"),
    },
    pagination: customPagination($("#home_tours .swiper-pagination")),
  });

  S(".accommodation_swipe", {
    loop: true,
    grabCursor: true,
    slidesPerView: 1,
    speed: 1000,
    spaceBetween: 20,
    navigation: { nextEl: $(".swiper-button-next.acc-nav"), prevEl: $(".swiper-button-prev.acc-nav") },
  });

  S(".destinations-swiper", {
    slidesPerView: "auto",
    spaceBetween: 40,
    grabCursor: true,
    breakpoints: { 320: { slidesPerView: 1.1, spaceBetween: 15 }, 768: { slidesPerView: 1.4, spaceBetween: 20 } },
  });

  S(".agents-swiper", {
    loop: true,
    grabCursor: true,
    spaceBetween: 40,
    speed: 2000,
    centeredSlides: true,
    autoplay: { delay: 3000 },
    breakpoints: {
      320: { slidesPerView: 1.3, spaceBetween: 15 },
      768: { slidesPerView: 1.5, spaceBetween: 20 },
      960: { slidesPerView: 2, spaceBetween: 40 },
      1024: { slidesPerView: 3, spaceBetween: 40 },
    },
  });

  S(".areas-swiper", {
    effect: "fade",
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 1500,
    navigation: { nextEl: $("#town-review .button-next"), prevEl: $("#town-review .button-prev") },
    pagination: customPagination($("#town-review .swiper-pagination")),
  });

  if (w <= 769) {
    S(".restaurant-swiper", {
      slidesPerView: 1,
      grabCursor: true,
      spaceBetween: 20,
      breakpoints: { 0: { slidesPerView: 1.1, centeredSlides: true } },
    });
  }

  const gallery = {
    loop: true,
    slidesPerView: "auto",
    grabCursor: true,
    speed: 8000,
    breakpoints: { 0: { spaceBetween: 20 }, 768: { spaceBetween: 40 } },
  };
  $$(".gallery_top").forEach((el) => {
    const hasBottom = el.nextElementSibling?.classList.contains("gallery_bottom");
    S(el, { ...gallery, autoplay: { reverseDirection: !hasBottom, disableOnInteraction: true } });
  });
  $$(".gallery_bottom").forEach((el) =>
    S(el, { ...gallery, autoplay: { reverseDirection: true, disableOnInteraction: true } })
  );

  S(".reviews-swiper", {
    loop: true,
    slidesPerView: 1,
    speed: 1000,
    breakpoints: {
      0: { pagination: { enabled: true, el: ".swiper-pagination" } },
      991: {
        navigation: { enabled: true, nextEl: ".swiper-arrow-next", prevEl: ".swiper-arrow-prev" },
        pagination: { enabled: false, el: ".swiper-pagination" },
      },
    },
  });

  const resortBreakpoints = {
    0: { slidesPerView: 1.1, spaceBetween: 15 },
    768: { slidesPerView: 1.4, spaceBetween: 20 },
    956: { slidesPerView: 2, spaceBetween: 30 },
    1024: { slidesPerView: 2.3, spaceBetween: 35 },
    1250: { slidesPerView: 3, spaceBetween: 40 },
    1440: { slidesPerView: 3, spaceBetween: 80 },
  };
  const resortAutoplay = { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: true };
  S(".grid-swiper-resorts", {
    speed: 1500,
    grabCursor: true,
    slidesPerView: 3,
    spaceBetween: 120,
    autoplay: resortAutoplay,
    breakpoints: resortBreakpoints,
  });
  S(".swiper-resorts", {
    spaceBetween: 40,
    grabCursor: true,
    slidesPerView: 3,
    speed: 1500,
    autoplay: resortAutoplay,
    breakpoints: resortBreakpoints,
    on: {
      slideChange() {
        this.update();
      },
    },
  });

  $$(".swiper-inner-gallery").forEach((el) => {
    const prev = el.querySelector(".swiper-button-prev-custom");
    const next = el.querySelector(".swiper-button-next-custom");
    const pag = el.querySelector(".swiper-inner-gallery-pagination");
    S(el, {
      effect: "fade",
      loop: true,
      slidesPerView: 1,
      centeredSlides: true,
      allowTouchMove: false,
      speed: 1500,
      autoplay: { delay: 5000 },
      navigation: prev || next ? { prevEl: prev, nextEl: next } : false,
      pagination: pag ? { el: pag, clickable: false } : false,
    });
  });

  initViewAlso(scope);
  initDestinationSlider(scope);
  initReasons(scope);
  initItineraryGalleries(scope);
  initCustomSwipers(scope);
  initServiceSwiper(scope);

  $$(".itinerary-swiper").forEach((el) => {
    const parent = el.parentElement;
    S(el, {
      spaceBetween: 40,
      grabCursor: true,
      slidesPerView: 1,
      breakpoints: {
        0: { slidesPerView: 1.1, spaceBetween: 20 },
        768: { slidesPerView: 2.1, spaceBetween: 20 },
        1024: { slidesPerView: 1.8, spaceBetween: 20 },
        1240: { slidesPerView: 2.3, spaceBetween: 30 },
      },
      navigation: {
        nextEl: parent.querySelector(".itinerary-swiper-next"),
        prevEl: parent.querySelector(".itinerary-swiper-prev"),
      },
    });
  });

  S(".other-stories-swiper", {
    loop: true,
    grabCursor: true,
    slidesPerView: 2,
    speed: 2000,
    spaceBetween: 100,
    autoplay: { disableOnInteraction: false, delay: 4000 },
    navigation: { nextEl: ".stories-button-next", prevEl: ".stories-button-prev" },
    breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 } },
  });

  S(".instagram-swiper", {
    slidesPerView: "auto",
    spaceBetween: 40,
    freeMode: true,
    autoplay: { disableOnInteraction: false, delay: 0 },
    loop: true,
    speed: 18000,
    grabCursor: true,
    breakpoints: { 0: { spaceBetween: 20, speed: 14000 }, 768: { spaceBetween: 40, speed: 18000 } },
  });

  if (w <= 1024) {
    S(".about_howitworks_swiper", {
      slidesPerView: "auto",
      grabCursor: true,
      spaceBetween: 12,
      breakpoints: { 0: { spaceBetween: 12 }, 450: { spaceBetween: 20 } },
    });
  }
}

function initViewAlso(scope) {
  const el = $(".view-also-swiper");
  if (!el) return;
  const nexts = $$(".view-also-swiper .button-next");
  const prevs = $$(".view-also-swiper .button-prev");
  const sync = (s) => {
    prevs.forEach((b) => b.classList.toggle("disabled", s.isBeginning));
    nexts.forEach((b) => b.classList.toggle("disabled", s.isEnd));
  };
  const swiper = scope.swiper(el, {
    spaceBetween: 0,
    slidesPerView: 1,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 500,
    effect: "fade",
    on: {
      slideChange() {
        sync(this);
      },
      reachEnd() {
        sync(this);
      },
      reachBeginning() {
        sync(this);
      },
    },
  });
  if (!swiper) return;
  nexts.forEach((b) => scope.on(b, "click", () => swiper.slideNext()));
  prevs.forEach((b) => scope.on(b, "click", () => swiper.slidePrev()));
  sync(swiper);
}

function initDestinationSlider(scope) {
  const section = $("#destination_page_slider");
  if (!section) return;
  scope.swiper(section.querySelector(".destination_swiper"), {
    effect: "fade",
    speed: 1500,
    loop: true,
    navigation: { nextEl: section.querySelector(".button-next"), prevEl: section.querySelector(".button-prev") },
    pagination: customPagination(section.querySelector(".swiper-pagination"), "pagination-wrapper"),
    on: {
      init() {
        syncIndexed(this, this.realIndex);
      },
      slideChange() {
        syncIndexed(this, this.realIndex);
      },
    },
  });
}

function initReasons(scope) {
  const section = $("#choose_snami_about");
  if (!section) return;
  const swiper = scope.swiper(section.querySelector(".reasonsSwiper"), {
    effect: "fade",
    speed: 3500,
    navigation: { nextEl: section.querySelector(".button-next"), prevEl: section.querySelector(".button-prev") },
    pagination: customPagination(section.querySelector(".swiper-pagination"), "pagination-wrapper"),
    on: {
      init() {
        syncIndexed(this, this.realIndex);
      },
      slideChange() {
        syncIndexed(this, this.realIndex);
      },
    },
  });
  scope.on(section.querySelector("ul.tabs"), "click", (e) => {
    const btn = e.target.closest("button");
    if (!btn || !swiper) return;
    swiper.slideTo(parseInt(btn.parentElement.getAttribute("data-swiper-index"), 10));
  });
}

function initItineraryGalleries(scope) {
  const syncButtons = (s, prev, next) => {
    prev?.classList.toggle("swiper-button-disabled", s.isBeginning);
    next?.classList.toggle("swiper-button-disabled", s.isEnd);
  };
  $$(".itinerary-item").forEach((item) => {
    item.querySelectorAll(".swiper-pop-gallery").forEach((el) => {
      const prev = el.querySelector(".swiper-button-prev");
      const next = el.querySelector(".swiper-button-next");
      scope.timeout(() => {
        scope.swiper(el, {
          slidesPerView: 1,
          loop: false,
          navigation: { nextEl: next, prevEl: prev },
          on: {
            init() {
              syncButtons(this, prev, next);
            },
            slideChange() {
              syncButtons(this, prev, next);
            },
          },
        });
      }, 500);
    });
  });
}

// Fade sliders with "01 / 05" pagination used across destination / resort sections.
function initCustomSwipers(scope) {
  $$(".customSwiper").forEach((el, n) => {
    const section = el.closest("section");
    if (!section) return;
    const prev = section.querySelector(".swiper-button-prev") ?? section.querySelector(".button-prev");
    const next = section.querySelector(".swiper-button-next") ?? section.querySelector(".button-next");
    const pag = section.querySelector(".pagination") ?? section.querySelector(".swiper-pagination");
    const progress = section.querySelector(".progress");
    const notPlaying = !!el.closest(".not-playing");
    const editorsPicks = !!$("#editors-picks-slider");

    const swiper = scope.swiper(el, {
      spaceBetween: 0,
      slidesPerView: 1,
      centeredSlides: true,
      allowTouchMove: editorsPicks,
      loop: editorsPicks,
      grabCursor: editorsPicks,
      speed: 1500,
      watchSlidesProgress: n !== 1,
      effect: editorsPicks ? "slide" : "fade",
      autoplay: { delay: 3000, disableOnInteraction: false },
      navigation: { nextEl: next, prevEl: prev },
      pagination: customPagination(pag, "pagination-wrapper"),
      on: {
        init() {
          if (notPlaying) this.autoplay.stop();
          progress?.classList.remove("animate");
          progress?.classList.add("animate");
        },
        slideChange() {
          syncIndexed(this, this.realIndex);
        },
        slideChangeTransitionStart() {
          progress?.classList.remove("animate");
        },
        slideChangeTransitionEnd() {
          progress?.classList.add("animate");
        },
      },
    });

    // Sliders with a bullet pagination start playing once scrolled into view.
    if (swiper && section.querySelector(".swiper-pagination")) {
      swiper.autoplay.stop();
      const io = scope.observe(
        new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
            io.disconnect();
            if (!notPlaying) swiper.autoplay.start();
          }
        })
      );
      io.observe(swiper.el);
    }
  });
}

// Transportation services: fade slider whose slides contain tab groups.
function initServiceSwiper(scope) {
  const el = $(".swiper-service");
  if (!el) return;

  const syncNav = (s) =>
    s.slides.forEach((slide) => {
      const prev = slide.querySelector(".navigation .service-swiper-button-prev");
      const next = slide.querySelector(".navigation .service-swiper-button-next");
      [
        [prev, s.isBeginning],
        [next, s.isEnd],
      ].forEach(([btn, disabled]) => {
        if (!btn) return;
        btn.classList.toggle("swiper-button-disabled", disabled);
        btn.setAttribute("aria-disabled", disabled);
        btn.setAttribute("tabindex", disabled ? "-1" : "0");
      });
    });

  const activateTabs = (s) => {
    const slide = s.slides[s.activeIndex];
    $$(".tab-btn, .tab-content, .image-wrapper img").forEach((n) => n.classList.remove("active"));
    slide?.querySelector(`.tab-content[data-index="${s.activeIndex}"]`)?.classList.add("active");
  };

  const swiper = scope.swiper(el, {
    spaceBetween: 0,
    centeredSlides: true,
    loop: false,
    speed: 500,
    slidesPerView: 1,
    allowTouchMove: false,
    effect: "fade",
    fadeEffect: { crossFade: true },
    pagination: {
      el: ".swiper-pagination",
      type: "custom",
      renderCustom: (_s, c, t) => `
        <div class="swiper-pagination-nums">
          <span class="swiper-pagination-current">${String(c).padStart(2, "0")}</span> / <span class="swiper-pagination-total">${String(t).padStart(2, "0")}</span>
          <div class="progressbar-background"><div class="progressbar-fill" style="width: ${(c / t) * 100}%;"></div></div>
        </div>`,
    },
    on: {
      init(s) {
        syncNav(s);
        activateTabs(s);
      },
      slideChange(s) {
        syncNav(s);
        activateTabs(s);
      },
    },
  });
  if (!swiper) return;

  // Slide arrows and tab buttons (delegated, so they survive re-renders).
  scope.on(el, "click", (e) => {
    const prev = e.target.closest(".navigation .service-swiper-button-prev");
    const next = e.target.closest(".navigation .service-swiper-button-next");
    if (prev || next) {
      e.preventDefault();
      prev ? swiper.slidePrev() : swiper.slideNext();
      return;
    }
    const tab = e.target.closest(".tab-btn");
    if (!tab) return;
    e.preventDefault();
    const slide = tab.closest(".swiper-slide");
    const idx = tab.getAttribute("data-tab-index");
    slide.querySelectorAll(".tab-btn, .tab-content, .image-wrapper img").forEach((n) => n.classList.remove("active"));
    tab.classList.add("active");
    slide.querySelector(`.tab-content[data-tab-index="${idx}"]`)?.classList.add("active");
    slide.querySelector(`.image-wrapper img[data-tab-index="${idx}"]`)?.classList.add("active");
  });
}

/** Pinned, scroll-driven "experience details" slider (single experience/tour). */
export function initExperienceDetails(scope) {
  const el = $(".experience_details_swipe");
  if (!el) return;
  const swiper = scope.swiper(el, {
    effect: "fade",
    slidesPerView: 1,
    spaceBetween: 0,
    loop: false,
    allowTouchMove: false,
    speed: 500,
    pagination: { el: ".swiper-pagination" },
  });
  if (!swiper) return;
  const count = swiper.slides.length;
  if (count < 2) return;
  swiper.slides.forEach((slide) => {
    const content = slide.querySelector(".content.flow");
    if (content) {
      content.style.overflowY = "auto";
      content.style.maxHeight = "80vh";
    }
  });
  ScrollTrigger.create({
    trigger: el,
    start: window.innerWidth > 768 ? "center 50%" : "center 40%",
    end: () => `+=${count * 300}`,
    pin: true,
    scrub: 1,
    snap: { snapTo: 1 / (count - 1), delay: 0 },
    onUpdate: (self) => {
      const i = Math.round(self.progress * (count - 1));
      if (swiper.activeIndex !== i) {
        swiper.slideTo(i);
        gsap.fromTo(swiper.slides[i], { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" });
      }
    },
  });
}
