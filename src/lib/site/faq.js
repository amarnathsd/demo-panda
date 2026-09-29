import { $, $$, gsap, ScrollTrigger, ScrollSmoother, refreshScroll } from "./runtime";

const HEADER_OFFSET = 110;

/**
 * FAQ board: the category rail stays pinned beside the questions (ScrollTrigger
 * pin, since position:sticky doesn't work inside ScrollSmoother), highlights the
 * category being read with a progress bar, glides to a category on click, and
 * filters every question from the search box.
 */
export function initFaq(scope, ctx) {
  const board = $("[data-faq-board]");
  if (!board) return;
  const safe = (fn) => ctx.add(null, fn);

  const nav = $("[data-faq-nav]", board);
  const items = $$("[data-faq-target]", nav);
  const groups = $$("[data-faq-group]", board);
  const itemFor = (id) => items.find((a) => a.dataset.faqTarget === id);
  const mobile = () => window.matchMedia("(max-width: 991px)").matches;

  // Keep the rail in view for the whole list.
  ScrollTrigger.create({
    trigger: board,
    start: () => `top top+=${mobile() ? 0 : HEADER_OFFSET}`,
    end: () => `bottom top+=${nav.offsetHeight + (mobile() ? 0 : HEADER_OFFSET)}`,
    pin: nav,
    pinSpacing: false,
    invalidateOnRefresh: true,
  });

  // Active category + reading progress.
  const setActive = (id) => {
    items.forEach((a) => a.classList.toggle("is-active", a.dataset.faqTarget === id));
    // On mobile the rail is a horizontal chip row: keep the active chip visible.
    const active = itemFor(id);
    const list = active?.closest(".faq-nav__list");
    if (active && list && mobile()) {
      list.scrollTo({ left: active.offsetLeft - 16, behavior: "smooth" });
    }
  };
  groups.forEach((group) => {
    const bar = itemFor(group.dataset.faqGroup)?.querySelector(".faq-nav__progress i");
    ScrollTrigger.create({
      trigger: group,
      start: "top center",
      end: "bottom center",
      onToggle: (self) => self.isActive && setActive(group.dataset.faqGroup),
      onUpdate: (self) => bar && gsap.set(bar, { scaleX: self.progress }),
      onLeave: () => bar && gsap.set(bar, { scaleX: 1 }),
      onLeaveBack: () => bar && gsap.set(bar, { scaleX: 0 }),
    });
  });

  // Glide to a category.
  items.forEach((a) =>
    scope.on(
      a,
      "click",
      safe((e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.faqTarget);
        if (!target || target.hidden) return;
        const offset = mobile() ? nav.offsetHeight + 20 : HEADER_OFFSET;
        const smoother = ScrollSmoother.get();
        if (smoother) smoother.scrollTo(target, true, `top ${offset}px`);
        else target.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${a.dataset.faqTarget}`);
      })
    )
  );

  // Search across all categories.
  const input = $("[data-faq-search]", nav);
  const empty = $("[data-faq-empty]", board);
  const normalise = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  groups.forEach((g) =>
    $$("[data-accordion-item]", g).forEach((q) => (q.dataset.search = normalise(q.textContent)))
  );

  let timer = null;
  const filter = () => {
    const words = normalise(input.value).split(" ").filter(Boolean);
    let shown = 0;
    groups.forEach((g) => {
      let count = 0;
      $$("[data-accordion-item]", g).forEach((q) => {
        const match = words.every((w) => q.dataset.search.includes(w));
        q.hidden = !match;
        if (match) count++;
      });
      g.hidden = count === 0;
      shown += count;
      const item = itemFor(g.dataset.faqGroup);
      item.querySelector("[data-faq-count]").textContent = count;
      item.classList.toggle("is-empty", count === 0);
    });
    empty.hidden = shown > 0;
    board.classList.toggle("is-searching", words.length > 0);
    refreshScroll();

    // The list just changed height: bring the top of the results into view.
    const list = $(".faq-board__list", board);
    if (list.getBoundingClientRect().top < 0) {
      const offset = mobile() ? nav.offsetHeight + 20 : HEADER_OFFSET;
      const smoother = ScrollSmoother.get();
      if (smoother) smoother.scrollTo(list, false, `top ${offset}px`);
      else window.scrollTo(0, list.getBoundingClientRect().top + window.scrollY - offset);
    }
  };
  scope.on(input, "input", () => {
    clearTimeout(timer);
    timer = setTimeout(filter, 150);
  });
  scope.add(() => clearTimeout(timer));

  // Deep link: /faq#uk opens on that category.
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash && itemFor(hash)) scope.timeout(() => itemFor(hash).click(), 400);
}
