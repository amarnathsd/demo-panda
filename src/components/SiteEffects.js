"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { initPage } from "@/lib/site";

export default function SiteEffects() {
  const pathname = usePathname();

  // In-page #hash links scroll through ScrollSmoother (native jumps would fight it).
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest('a[href^="#"]');
      const href = a?.getAttribute("href");
      if (!href || href.length < 2) return;
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (!target) return;
      e.preventDefault();
      const smoother = ScrollSmoother.get();
      smoother ? smoother.scrollTo(target, true, "top 80px") : target.scrollIntoView({ behavior: "smooth" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // (Re)initialise animations, sliders and interactions for each page.
  useEffect(() => initPage(), [pathname]);

  return null;
}
