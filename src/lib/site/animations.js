import { $, $$, gsap, ScrollTrigger, SplitText } from "./runtime";

const byBreakpoint = (list) => list.find(({ breakpoint }) => window.innerWidth <= breakpoint);

/** Scroll-driven GSAP animations from the theme bundle. Runs inside a gsap.context. */
export function initAnimations(scope, ctx) {
  const safe = (fn) => ctx.add(null, fn);
  destinationSlider();
  mazeReveal();
  timeless();
  clipImages();
  scrollAnimation();
  conciergeAbout();
  mouseMovers(scope, safe);
  moveSwiper();
  portfolio();
  floatingMarquee();
  sectionParallax();
  panelOverlap();
  hideFloatingOnSections(scope, safe);
  sectionColors(scope, safe);
  pinnedImageSections();
  chooseUsPin();
  homeAgents();
  whoWeAre();
  overviewBar(scope, safe);
  shareCircle();
  scrollFeatured();
  transportation();
  revealImages();
  itineraryMap();
  headingReveals(scope, safe);
}

function destinationSlider() {
  const section = $("#destination_page_slider");
  if (!section) return;
  const clip = byBreakpoint([
    { breakpoint: 440, clipPath: "inset(0 15% 0 15%)" },
    { breakpoint: 780, clipPath: "inset(0 25% 0 25%)" },
    { breakpoint: 1240, clipPath: "inset(0 30% 0 30%)" },
    { breakpoint: Infinity, clipPath: "inset(0 35% 0 35%)" },
  ]).clipPath;

  gsap
    .timeline({
      defaults: { ease: "power2.out", duration: 1 },
      scrollTrigger: { trigger: section, start: "top 15%", end: "bottom bottom", scrub: 1, once: true },
    })
    .to(section.querySelector(".magical-text"), { opacity: 0, y: "-50%", color: "white", zIndex: 2 })
    .fromTo(
      $$(".heading-wrapper > h3", section),
      { left: "50%", top: "50%", x: "-50%" },
      { left: "50%", top: "0%", y: "-50%" },
      "<"
    )
    .to(section.querySelector(".content"), { opacity: 1 }, "<")
    .fromTo(
      section.querySelector(".destination_swiper"),
      { clipPath: clip, scale: 0.8 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1 },
      "<"
    )
    .to(section.querySelector(".swiper_controls"), { opacity: 1 }, "<");
}

function mazeReveal() {
  const section = $("#town-review");
  const maze = $(".maze-wrapper");
  const paths = maze ? $$("#maze-svg path", maze) : [];
  if (!section || !paths.length) return;
  gsap.set(paths, { opacity: 0, visibility: "visible", drawSVG: "0%" });
  const tl = gsap
    .timeline()
    .to(paths, { opacity: 1, drawSVG: "100%", ease: "power1.inOut" })
    .to(maze, { opacity: 0, yPercent: -100, zIndex: -1 });
  ScrollTrigger.create({
    trigger: section,
    animation: tl,
    start: "5% top",
    end: `+=${window.innerHeight * 2}`,
    scrub: 1,
    pin: true,
  });
}

function timeless() {
  const section = $("#timeless");
  if (!section) return;
  const lyrical = section.querySelector("#lyrical");
  gsap.set(lyrical, { y: "100%", opacity: 0 });
  const tl = gsap
    .timeline()
    .to(section.querySelector(".timeless"), { delay: 0.2, x: "100%", opacity: 0, zIndex: -1 }, 0)
    .to(lyrical, { y: 0, opacity: 1 }, 0.5);
  ScrollTrigger.create({
    trigger: section,
    animation: tl,
    start: "top top",
    end: "+=" + window.innerHeight * 2,
    scrub: true,
    pin: section,
    invalidateOnRefresh: true,
  });
}

function clipImages() {
  $$("[data-clip-image]").forEach((el) => {
    const img = el.querySelector("img");
    gsap
      .timeline({ defaults: { duration: 1.3, ease: "power4.out" } })
      .set(el, { autoAlpha: 1 })
      .from(el, { xPercent: -100 })
      .from(img, { xPercent: 100, scale: 1.3, delay: -1.3 });
  });
  $$("[data-item-gsap]").forEach((el) => {
    gsap.fromTo(
      el,
      { opacity: 0, yPercent: -100 },
      {
        opacity: 1,
        yPercent: 0,
        duration: 1,
        delay: 0.2,
        ease: "power2.inOut",
        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" },
      }
    );
  });
}

function scrollAnimation() {
  const featured = $("[data-featured]");
  $$("[data-scroll-animation]").forEach((el) => {
    const imageWrapper = el.querySelector(".image-wrapper");
    const scaleImage = el.querySelector(".scale-image");
    const circleText = el.querySelector(".circleText");
    const col = el.querySelector(".content-wrapper > .col-2");
    const steps = col ? $$(".step", col) : [];

    const tl = gsap.timeline({
      defaults: { ease: featured ? "power2.inOut" : "power2.in", duration: featured ? 0.6 : 1.5 },
      scrollTrigger: {
        trigger: el,
        start: "top 0%",
        end: featured ? undefined : "+=" + window.innerHeight * 2,
        scrub: featured ? 0.4 : 1,
        pin: true,
        anticipatePin: 1,
      },
    });
    if (circleText) tl.to(circleText, { opacity: 0 }, "<");
    if (scaleImage) {
      const start = byBreakpoint([
        { breakpoint: 480, width: "55%", height: "50%" },
        { breakpoint: 1024, width: "45%", height: "55%" },
        { breakpoint: Infinity, width: "30%", height: "75%" },
      ]);
      tl.fromTo(
        scaleImage,
        { width: start.width, height: start.height, "--opac": "1" },
        { width: "100%", height: "100%", "--opac": ".3" },
        "<"
      );
    }
    if (imageWrapper) tl.to(imageWrapper, { "--clr-1": "#00000070", "--clr-2": "#00000003" }, "<");
    if (col) tl.fromTo(col, { opacity: 0, y: "50%" }, { opacity: 1, y: "0%", zIndex: 2 }, "<");
    if (steps.length) tl.fromTo(steps, { opacity: 0, y: "50%" }, { opacity: 1, y: "0%", stagger: 1 }, "<");
  });
}

function conciergeAbout() {
  const section = $("#concierge_page_about");
  if (!section) return;
  const items = [".first-item", ".second-item", ".third-item"].map((s) => section.querySelector(s));
  const scaled = items[0]?.querySelector(".image-scaled");
  const media = ["left_top", "left_bottom", "right_top", "right_bottom"].map((c) =>
    items[2]?.querySelector(`.media.${c}`)
  );
  items.forEach((item, i) => {
    if (!item) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: item, start: "top 55%", end: "top 25%", scrub: 1 },
    });
    tl.to(item, { opacity: 1 });
    if (i === 0 && scaled) tl.to(scaled, { width: "100%", opacity: 0.7, ease: "power2.out" }, 0);
    if (i === 2)
      tl.to(
        media.filter(Boolean),
        {
          xPercent: (k) => [-30, -50, 50, 67][k],
          yPercent: (k) => [-8, 30, -27, 12][k],
          zIndex: 2,
          ease: "power2.out",
        },
        0
      );
  });
}

function mouseMovers(scope, safe) {
  const onMove = safe((e) => {
    const box = e.currentTarget;
    const movers = box.querySelectorAll(".mouse-mover");
    const ratio = gsap.utils.normalize(0, box.offsetWidth, e.pageX - box.offsetLeft);
    movers.forEach((m) => {
      const factor = Math.random() * 0.05 + 0.1;
      const amount = gsap.getProperty(m, "width") * factor;
      gsap.to(m, { duration: 1.5, x: ratio * amount - amount / 1.2, overwrite: true });
    });
  });
  $$("[data-mouse-move]").forEach((el) => scope.on(el, "mousemove", onMove));
}

function moveSwiper() {
  const el = $(".moveswiper");
  if (!el) return;
  const y = window.innerWidth < 1281 ? "80px" : "180px";
  gsap
    .timeline({
      defaults: { ease: "power2.out", duration: 1.2 },
      scrollTrigger: { trigger: el, start: "top 30%", end: "+=100px", toggleActions: "play none none reverse" },
    })
    .to(el, { y, "--opacity": "0.8" })
    .to($("main .content"), { opacity: 1, cursor: "auto", pointerEvents: "auto" });
}

function portfolio() {
  const el = $(".portfolioswiper");
  if (!el) return;
  const small = window.matchMedia("(max-width: 1281px)").matches;
  gsap
    .timeline({
      defaults: { ease: "power2.out", duration: 1 },
      scrollTrigger: { trigger: el, start: "top 30%", end: "bottom 30%", toggleActions: "play none none reverse" },
      onComplete: () => el.classList.add("animation-end"),
    })
    .to(el, { y: small ? "80px" : "130px" })
    .from($$(".main-content, .navigation-area", el), { opacity: 0 });
}

function floatingMarquee() {
  $$(".floating-marquee").forEach((el) => {
    const text = el.querySelector(".wrapperRollingText");
    if (!text) return;
    let dir = 1;
    const tween = gsap.to(text, { xPercent: -50, duration: 20, ease: "none", repeat: -1 });
    ScrollTrigger.create({
      trigger: el,
      onUpdate(self) {
        if (self.direction !== dir) {
          dir = self.direction;
          gsap.to(tween, { timeScale: dir, duration: 0.3 });
        }
      },
    });
  });
}

function sectionParallax() {
  $$("[data-section-scroll]").forEach((section) => {
    const bg = section.querySelector("img.bg");
    if (!bg) return;
    gsap.to(bg, {
      y: () => bg.offsetHeight - section.offsetHeight,
      ease: "none",
      scrollTrigger: { trigger: section, scrub: true, invalidateOnRefresh: true },
    });
  });
}

function panelOverlap() {
  if (!window.matchMedia("(min-width: 1440px)").matches) return;
  const panels = $$("[data-panel-overlap]");
  panels.forEach((panel, i) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      pin: i !== panels.length - 1,
      pinSpacing: false,
    });
  });
}

// Hides the floating share / request buttons over the footer and marked sections.
function hideFloatingOnSections(scope, safe) {
  const shares = $$("#global-share");
  const floatRequest = $("#float_request");
  if (floatRequest) gsap.set(floatRequest, { autoAlpha: 0, y: "100%" });
  let hidden = false;
  const update = safe(() => {
    if (hidden || !floatRequest) return;
    const show = window.scrollY > 30;
    gsap.to(floatRequest, { autoAlpha: show ? 1 : 0, y: show ? 0 : "100%", duration: 0 });
  });
  $$("[data-hide-elements]").forEach((el) => {
    const isFooter = el.tagName === "FOOTER";
    ScrollTrigger.create({
      trigger: el,
      start: isFooter ? "top 100%" : "top 60%",
      end: "bottom top",
      onToggle: ({ isActive }) => {
        hidden = isActive;
        shares.forEach((s) => gsap.set(s, { opacity: isActive ? 0 : 1, pointerEvents: isActive ? "none" : "auto" }));
        if (isActive && floatRequest) gsap.to(floatRequest, { autoAlpha: 0, y: "100%" });
        else update();
      },
    });
  });
  scope.on(window, "scroll", update, { passive: true });
}

// Sections with data-color tint the page background while they fill the viewport.
function sectionColors(scope, safe) {
  const sections = $$("[data-color]");
  if (!sections.length) return;
  const setBg = safe((color) =>
    gsap.to(document.body, { backgroundColor: color || "", duration: 0.35, ease: "none" })
  );
  const ratios = new Map(sections.map((s) => [s, 0]));
  let current = null;
  const io = scope.observe(
    new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target, e.intersectionRatio));
        let best = 0;
        let bestEl = null;
        ratios.forEach((r, el) => {
          if (r > best) {
            best = r;
            bestEl = el;
          }
        });
        if (bestEl && best >= 0.25) {
          const color = bestEl.getAttribute("data-color") || "";
          if (color !== current) {
            current = color;
            setBg(color);
          }
        } else if (current !== null) {
          current = null;
          setBg("");
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) }
    )
  );
  sections.forEach((s) => io.observe(s));
  scope.add(() => {
    document.body.style.backgroundColor = "";
  });
}

function pinnedImageSections() {
  const sections = $$(".section_animation");
  sections.forEach((section, i) => {
    const image = section.querySelector(".pinned_image");
    const heading = section.querySelector(".h4");
    const last = i === sections.length - 1;
    gsap.fromTo(
      image,
      { scale: 0 },
      {
        scale: 1,
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "bottom center",
          pin: true,
          pinSpacing: last,
          scrub: 1,
          onUpdate: (self) => {
            if (heading) heading.style.top = `${50 - self.progress * 20}%`;
          },
        },
      }
    );
    if (i > 0)
      gsap.fromTo(
        sections[i - 1],
        { opacity: 1 },
        { opacity: 0, scrollTrigger: { trigger: section, start: "top bottom", end: "top center", scrub: 1 } }
      );
    if (i === 0)
      gsap.fromTo(
        section,
        { opacity: 0 },
        { opacity: 1, scrollTrigger: { trigger: section, start: "top 90%", end: "top 50%", scrub: 1 } }
      );
    if (last)
      gsap.to(section, {
        opacity: 0,
        scrollTrigger: { trigger: section, start: "bottom center", end: "bottom top", scrub: 1 },
      });
  });
}

function chooseUsPin() {
  const section = $("#choose_snami_about");
  if (!section) return;
  const items = section.querySelectorAll(".itemstoanimate");
  if (!items.length) return;
  gsap
    .timeline({ scrollTrigger: { trigger: section, start: "top top", end: "+=100%", pin: section, scrub: 1 } })
    .fromTo(items[0], { scale: 1, y: 0 }, { scale: 0.8, y: "-100%" }, "<");
}

function homeAgents() {
  const section = $("#home_agents");
  if (!section) return;
  const inner = section.querySelector(".home_agents");
  const texts = $$(".text, .title", section);
  const mobile = window.matchMedia("(max-width: 801px)").matches;
  gsap.fromTo(
    section,
    { backgroundColor: "#ffffff", color: "#1a1a1a" },
    {
      backgroundColor: "#1a1a1a",
      color: "#ffffff",
      scrollTrigger: { trigger: inner, start: "top center", end: "top top", scrub: 1 },
    }
  );
  // Pinned: the heading settles, then the "why choose us" cards rise in one by one.
  const cards = $$(".why-card", section);
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: inner,
      start: "top top",
      end: "+=" + window.innerHeight * (mobile ? 1.3 : 1.5),
      scrub: 1,
      pin: true,
    },
  });
  tl.fromTo(texts, { opacity: 0.3, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1 }, 0);
  if (cards.length) {
    tl.fromTo(
      cards,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" },
      0.35
    );
  }
}

function whoWeAre() {
  if (!$(".whoweare_featured_div")) return;
  gsap
    .timeline({
      scrollTrigger: { trigger: ".whoweare_featured_div", start: "top top", end: "+=100%", scrub: true, pin: true, anticipatePin: 1 },
    })
    .to(".image_top", { scaleY: -1, transformOrigin: "top", ease: "none" })
    .to(".image_bottom", { scaleY: -1, transformOrigin: "bottom", ease: "none" }, "<");
}

// Sticky in-page nav on single resort / tour / experience / multi-day pages.
function overviewBar(scope, safe) {
  const bar = $("#floating-overviewbar");
  const pageTypes = ["page-template-tmpl_multidays", "single-resort", "single-tour", "single-experience"];
  if (!bar || !pageTypes.some((c) => document.body.classList.contains(c))) return;

  $$("a", bar).forEach((a) =>
    scope.on(
      a,
      "click",
      safe((e) => {
        e.preventDefault();
        const href = a.getAttribute("href");
        if (href) gsap.to(window, { scrollTo: href });
      })
    )
  );

  ScrollTrigger.create({
    start: "top 100%-=" + (bar.offsetHeight - 3),
    end: "max",
    pin: bar,
    pinSpacing: false,
  });

  const items = $$(".floating-overviewbar-item", bar);
  items.forEach((item) => {
    const target = document.querySelector(item.querySelector("a")?.getAttribute("href") || "#__none");
    if (!target) return;
    ScrollTrigger.create({
      trigger: target,
      start: "top center",
      end: "bottom center",
      toggleClass: { targets: item, className: "active" },
    });
  });

  const lastHref = items.at(-1)?.querySelector("a")?.getAttribute("href");
  const lastSection = lastHref ? document.querySelector(lastHref) : null;
  if (lastSection) {
    ScrollTrigger.create({
      trigger: lastSection,
      start: "bottom bottom",
      end: "bottom center",
      onEnter: () => bar.classList.add("remove"),
      onLeaveBack: () => bar.classList.remove("remove"),
    });
  }

  // Horizontal wheel scrolling for the overflowed bar.
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
    bar.scrollLeft = current;
    requestAnimationFrame(step);
  };
  scope.on(
    bar,
    "wheel",
    (e) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      if (!animating) current = target = bar.scrollLeft;
      target += e.deltaY;
      animating = true;
      step();
    },
    { passive: false }
  );
}

function shareCircle() {
  const section = $("#default_page_share_to");
  const circle = section?.querySelector(".image-circle");
  if (!circle) return;
  const scale = byBreakpoint([
    { breakpoint: 991, scale: 0.65 },
    { breakpoint: 1024, scale: 0.55 },
    { breakpoint: Infinity, scale: 0.45 },
  ]).scale;
  gsap.to(circle, {
    scale,
    scrollTrigger: { trigger: circle, start: "clamp(top 80%)", end: "clamp(top 30%)", scrub: 1 },
  });
}

function scrollFeatured() {
  $$("[data-scroll-featured]").forEach((section) => {
    const bg = section.querySelector(".scrolled-bgImage");
    if (!bg) return;
    const images = $$(".image", section);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: "top top", end: "center top", scrub: 1, pin: section, anticipatePin: 1 },
    });
    tl.to(bg, { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", filter: "brightness(0.3)" });
    $$("span", section).forEach((s) => gsap.to(s, { opacity: 1, duration: 0.8 }));
    images.forEach((image, i) => {
      const even = i % 2 === 0;
      const img = image.querySelector("img");
      gsap.set(image, { autoAlpha: 1 });
      gsap.from(image, { xPercent: even ? -100 : 100, duration: 0.8 });
      gsap.from(img, { xPercent: even ? 100 : -100, scale: 1.2, transformOrigin: even ? "left" : "right", duration: 0.8 });
      tl.to(image, { x: even ? "-100%" : "100%" }, "<");
    });
  });
}

function transportation() {
  const page = $(".page-template-tmpl_transportation") ?? (document.body.classList.contains("page-template-tmpl_transportation") ? document.body : null);
  if (!page) return;
  const middle = $("#private_transportation_middle-section");
  const services = $("#private_transportation_page_services");
  const holder = middle?.querySelector(".image-holder");
  const banner = services?.querySelector(".section-banner");
  if (!holder || !banner || !holder.querySelector(".centered-image.second img")) return;

  const list = (sel) => holder.querySelector(sel);
  const moves = [
    [list(".image-list.first"), "-100vw", "-20vw"],
    [list(".image-list.third"), "100vw", "-20vw"],
    [list(".image-list.forth"), "-100vw", "20vw"],
    [list(".image-list.fifth"), "100vw", "20vw"],
  ];
  const tl = gsap.timeline({
    scrollTrigger: { trigger: holder, pin: middle, start: "center center", end: "+=150%", scrub: 1.5 },
  });
  tl.to(holder, { scale: 1, y: "8vh", ease: "power2.inOut" });
  moves.forEach(([el, x, y]) => el && tl.to(el, { x, y, opacity: 0.3, z: 800, ease: "power2.out" }, 0));

  gsap.to(banner, {
    y: "-100%",
    opacity: 0,
    ease: "power2.inOut",
    scrollTrigger: {
      trigger: services,
      start: "0% top",
      end: "bottom 10%",
      pin: services,
      anticipatePin: 1,
      scrub: 1.5,
      invalidateOnRefresh: true,
    },
  });
}

function revealImages() {
  $$("[data-reveal-image]").forEach((el) => {
    const img = el.querySelector("img");
    gsap
      .timeline({ scrollTrigger: { trigger: el, toggleActions: "restart none none none" } })
      .to(el, { duration: 1, "--height": "100%", ease: "power2.inOut" })
      .to(el, { duration: 1, "--height": "0%", ease: "power2.inOut" })
      .to(img, { duration: 0.2, opacity: 1, delay: -1, height: "100%" })
      .from(img, { duration: 1, scale: 1.4, ease: "power2.inOut", delay: -1.2 })
      .to(el, { "--clr-1": "rgba(26, 26, 26, 0.6)", "--clr-2": "rgba(26, 26, 26, 0.3)" }, "<");
  });
}

function itineraryMap() {
  const map = $(".itinerary-map");
  const content = $(".itinerary-content");
  const wrapper = $(".itinerary-items-wrapper");
  const indicator = $(".scroll-indicator");
  if (!map || !content || !wrapper || !indicator) return;
  gsap.to(indicator, {
    y: () => wrapper.offsetHeight - 200,
    ease: "none",
    scrollTrigger: { trigger: content, pin: map, start: "top top", end: "bottom bottom", scrub: true, invalidateOnRefresh: true },
  });
}

// SplitText line reveals for [data-animate-heading] and [data-animate-text].
function headingReveals(scope, safe) {
  const heading = safe((el) => {
    const split = SplitText.create(el, { type: "lines" });
    gsap.set(el, { autoAlpha: 1 });
    gsap
      .timeline({ scrollTrigger: { trigger: el, start: "top 90%", end: "bottom 50%", toggleActions: "play none none none" } })
      .from(split.lines, {
        yPercent: 100,
        rotate: 4,
        autoAlpha: 0,
        transformOrigin: "0% 50% -50",
        ease: "power2.inOut",
        duration: 1.3,
        stagger: 0.12,
        onComplete: () => gsap.set(split.lines, { clearProps: "all" }),
      });
  });

  const text = safe((el) => {
    if (!el.textContent.trim()) return;
    const split = SplitText.create(el, { type: "lines", linesClass: "split-lines" });
    if (!split.lines?.length) return;
    gsap.from(split.lines, {
      y: "100%",
      autoAlpha: 0,
      duration: 1,
      ease: "power2.inOut",
      stagger: 0.15,
      scrollTrigger: { trigger: el, start: "top 80%", toggleActions: "play none none none" },
      onComplete: () => gsap.set(split.lines, { clearProps: "all" }),
    });
  });

  // Split lazily (one viewport ahead) once fonts are ready, like the original.
  const lazily = (els, fn) => {
    if (!els.length) return;
    const io = scope.observe(
      new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            io.unobserve(e.target);
            fn(e.target);
          }),
        { rootMargin: "0px 0px 100% 0px" }
      )
    );
    els.forEach((el) => io.observe(el));
  };

  let cancelled = false;
  scope.add(() => (cancelled = true));
  document.fonts.ready.then(() => {
    if (cancelled) return;
    lazily($$("[data-animate-heading]:not(h1)"), heading);
    lazily($$("[data-animate-text] > *"), text);
  });
}
