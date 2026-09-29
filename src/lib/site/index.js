import { Fancybox } from "@fancyapps/ui";
import { gsap, ScrollTrigger, ScrollSmoother, createScope, refreshScroll } from "./runtime";
import { initAos, initLazyBackgrounds, initLazyImages, initVideos } from "./lazy";
import { initSwipers, initExperienceDetails } from "./swipers";
import { initAnimations } from "./animations";
import { initInteractions } from "./interactions";
import { initTours } from "./tours";
import { initFaq } from "./faq";

let fancyboxBound = false;

/**
 * Initialises every behaviour of the current page's markup. Returns a cleanup
 * function; SiteEffects calls it on client-side navigation.
 */
export function initPage() {
  const scope = createScope();

  if (!fancyboxBound) {
    // Delegated to document, so it covers every page (galleries use data-fancybox).
    Fancybox.bind("[data-fancybox]", {});
    fancyboxBound = true;
  }

  // Created empty first: the init functions need `ctx` to make context-safe handlers.
  const ctx = gsap.context(() => {});
  ctx.add(() => {
    const smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 2,
      smoothTouch: 0.1,
      effects: true,
    });

    // Freeze smooth scrolling while a <dialog> is open.
    scope
      .observe(new MutationObserver(() => smoother.paused(!!document.querySelector("dialog[open]"))))
      .observe(document.body, { attributes: true, subtree: true, attributeFilter: ["open"] });

    initLazyBackgrounds(scope);
    initLazyImages(scope);
    initVideos(scope);
    initInteractions(scope, ctx);
    initSwipers(scope);
    initExperienceDetails(scope);
    initTours(scope);
    initFaq(scope, ctx);
    initAnimations(scope, ctx);
    initAos();
  });

  // Layout settles after fonts and images; re-measure pins/triggers then.
  let alive = true;
  document.fonts.ready.then(() => alive && refreshScroll());
  if (document.readyState !== "complete") {
    scope.on(window, "load", () => refreshScroll(), { once: true });
  }
  scope.timeout(refreshScroll, 600);

  return () => {
    alive = false;
    Fancybox.close(true);
    ctx.revert();
    scope.dispose();
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
