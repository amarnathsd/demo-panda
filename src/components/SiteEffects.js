"use client";

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { usePathname, useRouter } from "next/navigation";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { initPage } from "@/lib/site";
import RequestForm from "./RequestForm";

const formRoots = new WeakMap();

const isInternal = (href) =>
  href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/images/") && !href.startsWith("/theme/") && !href.startsWith("/api/");

export default function SiteEffects() {
  const pathname = usePathname();
  const router = useRouter();

  // Page markup comes from HTML strings, so its <a> tags are plain anchors:
  // route internal ones through the Next router, and smooth-scroll hash links.
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");

      if (href.startsWith("#") && href.length > 1) {
        const target = document.getElementById(decodeURIComponent(href.slice(1)));
        if (target) {
          e.preventDefault();
          const smoother = ScrollSmoother.get();
          smoother ? smoother.scrollTo(target, true, "top 80px") : target.scrollIntoView({ behavior: "smooth" });
        }
        return;
      }
      if (isInternal(href)) {
        e.preventDefault();
        router.push(href);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  // (Re)initialise animations, sliders and interactions for each page.
  useEffect(() => {
    const cleanup = initPage();

    // Booking/enquiry forms inside page dialogs.
    const mounts = [...document.querySelectorAll("[data-request-form]")];
    mounts.forEach((el) => {
      let root = formRoots.get(el);
      if (!root) {
        root = createRoot(el);
        formRoots.set(el, root);
      }
      root.render(<RequestForm context={document.title} />);
    });

    return () => {
      cleanup();
      // Unmount once the old page is gone (not during the StrictMode re-run).
      setTimeout(() => {
        mounts.forEach((el) => {
          if (el.isConnected) return;
          formRoots.get(el)?.unmount();
          formRoots.delete(el);
        });
      }, 0);
    };
  }, [pathname]);

  return null;
}
