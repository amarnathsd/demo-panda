import { $, $$, refreshScroll } from "./runtime";

/** Day tours page: destination select + category chips filter the excursion sliders. */
export function initTours(scope) {
  const sliders = $$(".excursions-swiper");
  if (!sliders.length) return;

  const filters = $(".tours-experiences-filters");
  const contents = $$("#tours_experiences_page_about .content");
  const list = $(".tours-experiences-filters .category-list");
  const select = document.getElementById("choose-category");
  const allItem = list?.querySelector(".category-list__item.all");
  const allContent = $(".content.all-content");
  const toggleBtn = $(".tours-experiences-filter-button");
  const closeBtn = $(".close-tours-experiences-filters");
  const applyBtn = $("#apply_filters");

  const setAllLabel = (text) => {
    const b = allItem?.querySelector("button");
    if (b) b.textContent = text;
  };

  // Center the slides when fewer than slidesPerView remain visible.
  const center = (s) => {
    const wrapper = s.el.querySelector(".swiper-wrapper");
    if (!wrapper) return;
    const visible = [...s.slides].filter((x) => x.style.display !== "none").length;
    let perView = s.params.slidesPerView;
    const bp = s.currentBreakpoint && s.originalParams.breakpoints?.[s.currentBreakpoint];
    if (bp?.slidesPerView !== undefined) perView = bp.slidesPerView;
    wrapper.classList.toggle("centered-slides", visible < perView);
  };

  const swipers = sliders
    .map((el) =>
      scope.swiper(el, {
        loop: false,
        spaceBetween: 100,
        slidesPerView: 3,
        speed: 1500,
        autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true, waitForTransition: true },
        breakpoints: {
          0: { slidesPerView: 1.1, spaceBetween: 20 },
          768: { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 2.4, spaceBetween: 40 },
          1240: { slidesPerView: 2.5, spaceBetween: 40 },
          1440: { slidesPerView: 3, spaceBetween: 60 },
          1680: { slidesPerView: 3.5, spaceBetween: 100 },
        },
        on: {
          init() {
            scope.on(this.el, "mouseenter", () => (this.params.speed = 400));
            scope.on(this.el, "mouseleave", () => (this.params.speed = 1500));
          },
        },
      })
    )
    .filter(Boolean);
  swipers.forEach(center);

  const syncSections = () => {
    sliders.forEach((el) => {
      const empty = [...el.querySelectorAll(".swiper-slide")].every((s) => s.style.display === "none");
      const section = el.closest("section");
      if (section) section.style.display = empty ? "none" : "block";
    });
    refreshScroll();
  };

  const filterSlides = (predicate) => {
    swipers.forEach((s) => {
      const active = s.activeIndex;
      s.slides.forEach((slide) => (slide.style.display = predicate(slide) ? "" : "none"));
      s.update();
      s.slideTo(active, 0, false);
      center(s);
    });
    syncSections();
  };

  const resetSlides = () => {
    swipers.forEach((s) => {
      s.slides.forEach((slide) => (slide.style.display = ""));
      s.update();
      s.slideTo(0, 0, false);
      center(s);
    });
    syncSections();
  };

  const showContent = (match) =>
    contents.forEach((c) => {
      const on = match(c);
      c.classList.toggle("active", on);
      c.style.opacity = on ? "1" : "0";
      c.style.pointerEvents = on ? "auto" : "none";
    });

  const destinations = (slide) => (slide.dataset.destination || "").split(",").map((x) => x.trim());
  const subfilters = (slide) => (slide.dataset.subfilter || "").split(",").map((x) => x.trim());

  const openPanel = (open) => filters?.classList.toggle("active", open);

  if (filters) {
    scope.on(toggleBtn, "click", () => window.innerWidth < 1366 && filters.classList.toggle("active"));
    scope.on(closeBtn, "click", () => openPanel(false));
    if (applyBtn && window.innerWidth < 1366) {
      scope.on(applyBtn, "click", () => {
        openPanel(false);
        scope.timeout(() => window.scrollY > 0 && window.scrollTo({ top: 0, behavior: "smooth" }), 200);
      });
    }
    scope.on(document, "click", (e) => {
      if (!e.target.closest(".tours-experiences-filters") && !e.target.closest(".tours-experiences-filter-button")) {
        openPanel(false);
      }
    });

    const footer = $("footer");
    scope.on(
      window,
      "scroll",
      () => {
        const footerVisible = footer?.getBoundingClientRect().top < window.innerHeight;
        toggleBtn?.classList.toggle("hidden-footer", !!footerVisible);
        toggleBtn?.classList.toggle("scrolled", window.scrollY !== 0);
        filters.classList.toggle("scrolled", !(window.scrollY < 200 || footerVisible));
      },
      { passive: true }
    );

    if (select && list) {
      scope.on(select, "change", () => {
        const index = select.options[select.selectedIndex]?.dataset.index;
        if (!index) {
          resetSlides();
          list.querySelectorAll(".category-list__item").forEach((i) => {
            if (!i.classList.contains("all")) i.style.display = "none";
          });
          setAllLabel("ALL");
          contents.forEach((c) => c.classList.remove("active"));
          allContent?.classList.add("active");
          history.replaceState(null, "", window.location.pathname);
          if (window.innerWidth < 1024) openPanel(true);
          return;
        }

        setAllLabel("RESET ALL");
        list.querySelectorAll(".category-list__item").forEach((i) => {
          i.style.display = i.classList.contains("all") || i.dataset.index === index ? "block" : "none";
        });
        const general = list.querySelector(`.category-list__item.general-text[data-index="${index}"]`);
        if (general) general.click();
        else {
          showContent(() => false);
          if (allContent) {
            allContent.classList.add("active");
            allContent.style.opacity = "1";
            allContent.style.pointerEvents = "auto";
          }
        }
        history.replaceState(null, "", `#${select.value.toLowerCase()}`);
        filterSlides((slide) => destinations(slide).includes(index));
        if (window.innerWidth < 1366) openPanel(true);
      });
    }

    if (list) {
      scope.on(list, "click", (e) => {
        const item = e.target.closest(".category-list__item");
        if (!item) return;

        if (item.classList.contains("all")) {
          setAllLabel("ALL");
          if (select) {
            select.selectedIndex = 0;
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
          showContent((c) => c.dataset.item === "0");
          return;
        }

        const { item: key, index } = item.dataset;
        const label = item.textContent.trim();
        showContent((c) => c.dataset.item === key && c.dataset.index === index);
        list.querySelectorAll(".category-list__item").forEach((i) => i.classList.remove("active"));
        item.classList.add("active");

        const dest = select?.options[select.selectedIndex]?.dataset.index;
        const value = select?.value.toLowerCase() ?? "";
        history.replaceState(null, "", label ? `#${value}#${label.toLowerCase()}` : `#${value}`);
        filterSlides((slide) => destinations(slide).includes(dest) && subfilters(slide).includes(label));
      });

      // Deep link: #destination#category
      const [dest, category] = decodeURIComponent(location.hash).slice(1).split("#").map((s) => s.trim());
      if (dest && select) {
        const opt = [...select.options].find((o) => o.value.toLowerCase() === dest.toLowerCase());
        if (opt) {
          select.selectedIndex = opt.index;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        if (category) {
          scope.timeout(() => {
            [...list.querySelectorAll(".category-list__item")]
              .filter((i) => getComputedStyle(i).display !== "none")
              .find((i) => i.textContent.trim().toLowerCase() === category.toLowerCase())
              ?.click();
          }, 100);
        }
      }
    }

    if (window.innerWidth < 1366) {
      filters.classList.add("hidden");
      scope.timeout(() => filters.classList.remove("hidden"), 100);
    }
  }

  // Smooth horizontal wheel scrolling for the category chips.
  if (list) {
    let animating = false;
    let target = 0;
    let current = 0;
    const step = () => {
      const diff = target - current;
      if (Math.abs(diff) < 1) {
        animating = false;
        return;
      }
      current += diff * 0.2;
      list.scrollLeft = current;
      requestAnimationFrame(step);
    };
    scope.on(
      list,
      "wheel",
      (e) => {
        if (e.deltaY === 0) return;
        e.preventDefault();
        if (!animating) current = target = list.scrollLeft;
        target += e.deltaY;
        animating = true;
        step();
      },
      { passive: false }
    );
  }
}
