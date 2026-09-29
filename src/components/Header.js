"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SITE_NAME, PHONE, EMAIL, SOCIALS, MAIN_MENU, SECONDARY_MENU } from "@/lib/site-config";

gsap.registerPlugin(useGSAP);

const THEME_IMG = "/theme/images";
const TEL = `tel:${PHONE.replace(/s/g, "")}`;

function MenuButton() {
  return (
    <div className="menu_button_wrapper">
      <button className="menu_button" id="hamburger" aria-label="nav-menu">
        <span className="line" />
        <span className="line" />
        <span className="line" />
      </button>
    </div>
  );
}

export default function Header() {
  const headerRef = useRef(null);
  const menuApi = useRef({ close: () => {} });
  const pathname = usePathname();

  // Open / close timeline for the full-screen menu (ported from the theme bundle).
  useGSAP(
    (_ctx, contextSafe) => {
      const header = headerRef.current;
      const buttons = header.querySelectorAll(".menu_button");
      const panel = header.querySelector(".headermenu");
      const bottom = header.querySelector(".menu-right .menu-right-bottom");
      const itemsFor = () =>
        header.querySelectorAll(
          window.matchMedia("(max-width: 1024px)").matches
            ? "#menu-navigation-main-menu-1.menu .menu-item, #menu-navigation-secondary-menu.menu .menu-item"
            : "#menu-navigation-main-menu.menu .menu-item, #menu-navigation-secondary-menu.menu .menu-item"
        );
      const allItems = header.querySelectorAll(".headermenu .menu-item");

      gsap.set(allItems, { opacity: 0, y: 50 });
      gsap.set(bottom, { opacity: 0, x: "-100%" });
      gsap.set(panel, { y: "100%" });

      let open = false;

      const openMenu = contextSafe(() => {
        const items = itemsFor();
        gsap.killTweensOf([allItems, bottom, panel]);
        buttons.forEach((b) => b.classList.add("is-active"));
        document.body.style.overflowY = "hidden";
        panel.classList.add("is-active");
        header.classList.add("openmenu");
        header.classList.remove("scrolled");
        gsap
          .timeline()
          .to(panel, { duration: 1.4, y: 0, ease: "power4.inOut" }, 0)
          .to(items, { duration: 1.2, opacity: 1, y: 0, stagger: 0.06, ease: "power4.out" }, "<1")
          .to(bottom, { duration: 1.2, x: 0, opacity: 1, ease: "power4.out" }, "<0.5");
        open = true;
      });

      const closeMenu = contextSafe((instant = false) => {
        if (!open) return;
        const items = itemsFor();
        gsap.killTweensOf([allItems, bottom, panel]);
        buttons.forEach((b) => b.classList.remove("is-active"));
        const done = () => {
          header.classList.remove("openmenu");
          panel.classList.remove("is-active");
          document.body.style.overflowY = "";
        };
        open = false;
        if (instant) {
          gsap.set(allItems, { opacity: 0, y: 50 });
          gsap.set(bottom, { opacity: 0, x: "-100%" });
          gsap.set(panel, { y: "100%" });
          done();
          return;
        }
        gsap
          .timeline({ onComplete: done })
          .to(items, { duration: 0.5, opacity: 0, y: 50, stagger: 0.04, ease: "power4.in" }, 0)
          .to(bottom, { duration: 0.5, opacity: 0, x: "-100%", ease: "power4.in" }, "<0.5")
          .to(panel, { duration: 0.8, y: "100%", ease: "power4.in" }, "<0.4");
      });

      const onToggle = () => (open ? closeMenu() : openMenu());
      buttons.forEach((b) => b.addEventListener("click", onToggle));
      menuApi.current.close = closeMenu;

      // Desktop: cross-fade the preview image of the hovered menu item.
      const cleanups = [];
      if (window.matchMedia("(min-width: 1024px)").matches) {
        const container = header.querySelector("#menu-image-container");
        const defaultBg = container.querySelector(".default-bg");
        const images = [...container.querySelectorAll(".menu-image")];
        const links = header.querySelectorAll("#menu-navigation-main-menu li a");
        gsap.set(images, { autoAlpha: 0 });
        let current = null;
        links.forEach((link, i) => {
          const show = contextSafe(() => {
            if (current !== null && current !== i) {
              gsap.to(images[current], { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" });
            }
            gsap.to(defaultBg, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" });
            gsap.to(images[i], { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });
            current = i;
          });
          link.addEventListener("mouseenter", show);
          link.addEventListener("focus", show);
          cleanups.push(() => {
            link.removeEventListener("mouseenter", show);
            link.removeEventListener("focus", show);
          });
        });
      }

      return () => {
        buttons.forEach((b) => b.removeEventListener("click", onToggle));
        cleanups.forEach((fn) => fn());
        document.body.style.overflowY = "";
      };
    },
    { scope: headerRef }
  );

  // Close the menu when a link inside it navigates.
  useEffect(() => {
    menuApi.current.close(true);
  }, [pathname]);

  // Header state on scroll: solid background after 100px, hidden while scrolling down.
  useEffect(() => {
    const header = headerRef.current;
    let last = window.scrollY;
    const onScroll = () => {
      if (document.querySelector("dialog[open]")) return;
      const y = window.scrollY;
      header.classList.toggle("scrolled", y > 100 && !header.classList.contains("openmenu"));
      if (y > last && y > 0) {
        header.classList.add("down");
        document.getElementById("global-share")?.classList.add("appear");
      } else {
        header.classList.remove("down");
      }
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="header_wrapper">
        <div className="wrapper">
          <div className="header_right mobile-menu-button-wrapper">
            <MenuButton />
          </div>
          <div className="header_left">
            <Link href="/" className="logo-wrapper">
              <img className="logo-img" src="/images/brand/logo-mono.svg" alt={SITE_NAME} width="140" height="72" />
            </Link>
          </div>
          <div className="header_right">
            <div className="header_phone_wrapper">
              <a href={TEL}>
                <img src={`${THEME_IMG}/phone.svg`} alt="Call us" />
              </a>
            </div>
            <MenuButton />
            <button
              className="open_modal header-book"
              data-modal-id="request"
              style={{ border: "none", cursor: "pointer" }}
            >
              <span className="book-now-text">ENQUIRE</span>
            </button>
          </div>
        </div>
      </div>

      <div className="headermenu">
        <div id="menu-image-container">
          <div
            className="default-bg"
            style={{ backgroundImage: "url(/images/photos/travelers-group.webp)" }}
          />
          {MAIN_MENU.map((item) => (
            <div
              key={item.href}
              className="menu-image background-img"
              style={{ backgroundImage: `url(${item.image})` }}
            />
          ))}
        </div>

        <div className="menu-left">
          <div className="menu-navigation-main-menu-container">
            <ul id="menu-navigation-main-menu" className="menu">
              {MAIN_MENU.map((item) => (
                <li key={item.href} className="menu-item">
                  <Link href={item.href} className="link link--trans link--white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="menu-right">
          <div className="menu-navigation-main-menu-container">
            <ul id="menu-navigation-main-menu-1" className="menu">
              {MAIN_MENU.map((item) => (
                <li key={item.href} className="menu-item">
                  <Link href={item.href} className="link link--trans link--white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-navigation-secondary-menu-container">
            <ul id="menu-navigation-secondary-menu" className="menu">
              {SECONDARY_MENU.map((item) => (
                <li key={item.href} className="menu-item">
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noreferrer" className="link link--trans link--white">
                      {item.label}
                    </a>
                  ) : (
                    <Link href={item.href} className="link link--trans link--white">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="menu-right-bottom">
            <div className="menu-contact">
              <a className="link link--trans link--white" href={TEL}>
                T. {PHONE}
              </a>
              <a className="link link--trans link--white" href={`mailto:${EMAIL}`}>
                <span>E.</span> <span>{EMAIL}</span>
              </a>
            </div>
            <div className="menu-socials">
              {SOCIALS.map((s) => (
                <a key={s.label} className="link link--trans" href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
