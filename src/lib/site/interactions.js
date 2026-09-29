import flatpickr from "flatpickr";
import { $, $$, gsap, once, refreshScroll, isDesktopPointer } from "./runtime";

/** DOM interactions from the theme bundle and the page-inline scripts. */
export function initInteractions(scope, ctx) {
  const safe = (fn) => ctx.add(null, fn);
  dialogs(scope);
  accordions(scope, safe);
  publications(scope, safe);
  hoverElements(scope);
  homeServices(scope);
  destinationHover(scope, safe);
  imageCursorPreview(scope);
  categoryFilters(scope);
  globalShare(scope);
  radialShare(scope);
  conciergeTabs(scope);
  spotNames(scope);
  svgIconPaths();
  resortTypeFilter(scope);
  readMore(scope);
  viewMore(scope);
  datePickers(scope);
  transportCalculators(scope);
  maps();
  contactForms(scope);
  cursorFollower(scope, safe);
}

// ---------------------------------------------------------------- dialogs

const closeAllDialogs = () => {
  $$("dialog[open]").forEach((d) => d.close());
  document.body.classList.remove("modal-open");
};

const capitalize = (s) => {
  const t = String(s).trim().toLowerCase();
  return t.charAt(0).toUpperCase() + t.slice(1);
};

function dialogs(scope) {
  scope.on(document.body, "click", (e) => {
    const opener = e.target.closest(".open_modal");
    if (opener) {
      const dialog = document.querySelector(`dialog[data-modal-id="${opener.dataset.modalId}"]`);
      if (!dialog) return;
      e.preventDefault();
      closeAllDialogs();
      document.body.classList.add("modal-open");
      dialog.showModal ? dialog.showModal() : dialog.setAttribute("open", "");
      dialog.querySelector(".close-dialog")?.blur();

      // "Request this room" buttons pre-select the room type.
      if (opener.hasAttribute("data-fill") && opener.dataset.postIndex) {
        const room = $(`.single-room[data-post-index="${opener.dataset.postIndex}"] .rooms-name`);
        const select = dialog.querySelector(".room_type-selected-field select");
        if (room && select) {
          select.value = capitalize(room.innerText);
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      }
      return;
    }

    const closer = e.target.closest(".close-dialog, .complete-filters-btn");
    if (closer && closer.closest("dialog")) {
      e.preventDefault();
      closeAllDialogs();
      return;
    }

    // Click on the backdrop (the <dialog> element itself).
    if (e.target.tagName === "DIALOG" && e.target.hasAttribute("open")) closeAllDialogs();
  });

  scope.on(document, "keydown", (e) => {
    if (e.key === "Escape" && $("dialog[open]")) {
      e.preventDefault();
      closeAllDialogs();
    }
  });

  scope.add(closeAllDialogs);
}

// ---------------------------------------------------------------- accordions

function accordions(scope, safe) {
  $$("[data-component='accordion']").forEach((acc) => {
    scope.on(
      acc,
      "click",
      safe((e) => {
        const header = e.target.closest("[data-accordion-header]");
        if (!header || !acc.contains(header)) return;
        const item = header.closest("[data-accordion-item]");
        const inner = item.querySelector("[data-accordion-inner]");
        const arrow = item.querySelector(".arrow");
        const hidden = getComputedStyle(inner).display === "none";
        if (hidden) {
          gsap.fromTo(
            inner,
            { display: "block", height: 0, overflow: "hidden" },
            { height: "auto", duration: 0.6, ease: "power2.out", onComplete: () => {
              gsap.set(inner, { clearProps: "height,overflow" });
              refreshScroll();
            } }
          );
          arrow?.classList.add("rotate");
          header.classList.add("active");
        } else {
          gsap.to(inner, {
            height: 0,
            overflow: "hidden",
            duration: 0.6,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(inner, { display: "none", clearProps: "height,overflow" });
              refreshScroll();
            },
          });
          arrow?.classList.remove("rotate");
          header.classList.remove("active");
        }
      })
    );
  });
}

// ---------------------------------------------------------------- publications (press list)

function publications(scope, safe) {
  const items = $$(".publication");
  items.forEach((pub, i) => {
    if (once(pub, "counter")) {
      const counter = document.createElement("span");
      counter.className = "publication-counter";
      counter.textContent = String(i + 1).padStart(2, "0");
      pub.querySelector(".title-wrapper")?.insertBefore(counter, pub.querySelector(".title"));
    }
    const content = pub.querySelector(".content-wrapper");
    if (!content) return;
    const full = content.scrollHeight;
    content.style.maxHeight = "0px";
    scope.on(pub, "click", () => {
      const open = content.classList.toggle("active");
      content.style.maxHeight = open ? `${full}px` : "0px";
      pub.querySelector(".publication-img")?.classList.toggle("active", open);
    });
  });

  if (window.innerWidth < 789) return;
  items
    .filter((p) => p.querySelector(".publication-img"))
    .forEach((pub) => {
      const img = pub.querySelector(".publication-img img");
      scope.on(pub, "mouseenter", safe(() => gsap.to(img, { autoAlpha: 1 })));
      scope.on(pub, "mouseleave", safe(() => gsap.to(img, { autoAlpha: 0 })));
      scope.on(
        pub,
        "mousemove",
        safe((e) => {
          const r = img.getBoundingClientRect();
          gsap.to(img, {
            x: e.clientX - (r.left + r.width / 2),
            y: e.clientY - (r.top - 30),
            duration: 1,
            ease: "power2.out",
          });
        })
      );
    });
}

// ---------------------------------------------------------------- small hovers

function hoverElements(scope) {
  if (window.innerWidth <= 768) return;
  const els = $$(".element");
  const select = (el) => {
    els.forEach((o) => {
      o.classList.toggle("hover", o === el);
      o.classList.toggle("non-hover", o !== el);
    });
  };
  els.forEach((el) => scope.on(el, "click", () => select(el)));
  if (els[0]) select(els[0]);
}

function homeServices(scope) {
  if (window.innerWidth <= 768) return;
  const items = $$(".home-services-list-item");
  const images = $$(".home-services-image-wrapper");
  const find = (text) => images.find((w) => w.dataset.item === text);
  if (items[0]) find(items[0].textContent)?.classList.add("active");
  items.forEach((item) =>
    scope.on(item, "mouseenter", () => {
      const target = find(item.textContent);
      if (!target) return;
      target.classList.add("active");
      images.forEach((w) => w !== target && w.classList.remove("active"));
    })
  );
}

function destinationHover(scope, safe) {
  const section = document.getElementById("default_destination");
  if (!section) return;
  const defaultBg = section.querySelector(".wrapper .default-bg");
  const titles = $$(".post-title a", section);
  const images = $$(".image-container", section);
  const touch = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || matchMedia("(hover: none)").matches;

  if (touch) {
    let i = 0;
    const cycle = safe(() => {
      gsap.to(images, { autoAlpha: 0, duration: 1, ease: "power2.inOut" });
      gsap.set(images[i], { zIndex: 2 });
      gsap.to(images[i], { autoAlpha: 1, duration: 1, ease: "power2.inOut" });
      i = (i + 1) % images.length;
      gsap.delayedCall(3, cycle);
    });
    cycle();
    return;
  }

  let current = null;
  let bgHidden = false;
  gsap.set(images, { autoAlpha: 0 });
  titles.forEach((a, i) => {
    const show = safe(() => {
      if (!bgHidden && defaultBg) {
        gsap.to(defaultBg, { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" });
        bgHidden = true;
      }
      if (current !== null && current !== i) gsap.to(images[current], { autoAlpha: 0, duration: 0.6, ease: "power2.inOut" });
      gsap.to(images[i], { autoAlpha: 1, duration: 0.6, ease: "power2.inOut" });
      current = i;
    });
    scope.on(a, "mouseenter", show);
    scope.on(a, "focus", show);
  });
}

// Floating preview image that follows the cursor over highlight lists.
function imageCursorPreview(scope) {
  const preview = $(".image-cursor-preview");
  const followers = $$(".following-image");
  $$(".list-wrapper").forEach((list) => {
    scope.on(list, "mousemove", (e) => {
      if (!preview) return;
      preview.style.left = `${e.pageX}px`;
      preview.style.top = `${e.pageY}px`;
      preview.classList.add("active");
    });
    scope.on(list, "mouseleave", () => {
      preview?.classList.remove("active");
      followers.forEach((f) => f.classList.remove("active"));
    });
  });
  $$(".highlight-list_item").forEach((item) => {
    scope.on(item, "mouseenter", () => {
      followers.forEach((f) => f.classList.toggle("active", f.dataset.index === item.dataset.index));
    });
    scope.on(item, "mouseleave", () => followers.forEach((f) => f.classList.remove("active")));
  });
}

function categoryFilters(scope) {
  $$(".category-filters a.has-children").forEach((a) =>
    scope.on(a, "click", (e) => {
      e.preventDefault();
      a.nextElementSibling?.classList.toggle("active");
    })
  );
}

// ---------------------------------------------------------------- share buttons

function globalShare(scope) {
  const wrap = $("#global-share.share-icon-wrapper");
  if (!wrap) return;
  const list = wrap.querySelector(".addtoany_list");
  if (list && once(list, "shareWrapped")) {
    list.classList.add("share__buttons");
    $$("a", list).forEach((a, i) => {
      const div = document.createElement("div");
      div.className = "share__button";
      a.classList.add("share__link");
      div.setAttribute("style", `--trans: ${((i + 1) * 0.05).toFixed(2)}s; --i: ${i + 1}`);
      div.appendChild(a);
      list.appendChild(div);
    });
  }
  wrap.style.visibility = "visible";
  const toggle = wrap.querySelector(".share__toggle");
  scope.on(toggle, "click", (e) => {
    e.preventDefault();
    if (list) list.style.visibility = "visible";
    toggle.classList.toggle("active");
  });
}

function radialShare(scope) {
  const radial = $("#default_page_share_to .radial");
  if (!radial) return;
  const toggle = radial.querySelector(".radial__toggle");
  const list = radial.querySelector(".addtoany_list");
  if (list && once(list, "radialWrapped")) {
    list.classList.add("radial__buttons");
    const links = $$("a", list);
    list.setAttribute("style", `--countItem: ${links.length}`);
    links.forEach((a, i) => {
      const div = document.createElement("div");
      div.className = "radial__button";
      div.id = `icon-${i + 1}`;
      div.setAttribute("style", `--trans: ${((i + 1) * 0.05).toFixed(2)}s; --index: ${i}`);
      a.classList.add("radial__link");
      div.appendChild(a);
      list.appendChild(div);
    });
  }
  radial.style.visibility = "visible";
  scope.on(toggle, "click", (e) => {
    e.preventDefault();
    toggle.classList.toggle("active");
    toggle.nextElementSibling?.classList.toggle("active");
  });
}

// ---------------------------------------------------------------- tabs & lists

function conciergeTabs(scope) {
  const section = $("#concierge_page_how_it_works");
  if (!section) return;
  const items = $$(".column-left li", section);
  const contents = $$(".column-right .content", section);
  if (!items.length || !contents.length) return;
  items[0].classList.add("active");
  contents[0].classList.add("active");
  items.forEach((li) =>
    scope.on(li, "click", () => {
      items.forEach((x) => x.classList.remove("active"));
      contents.forEach((x) => x.classList.remove("active"));
      li.classList.add("active");
      section.querySelector(`.content[data-index="${li.dataset.index}"]`)?.classList.add("active");
    })
  );
}

function spotNames(scope) {
  const names = $$(".spot-name");
  names.forEach((name) =>
    scope.on(name, "click", (e) => {
      e.preventDefault();
      const spot = name.dataset.spotIndex;
      const group = name.closest("[data-swiper-index]")?.dataset.swiperIndex;
      $$(`.spot-text[data-swiper-index="${group}"]`).forEach((t) => t.classList.remove("spot-text-active"));
      names.forEach((n) => {
        if (n.closest("[data-swiper-index]")?.dataset.swiperIndex === group) n.classList.remove("spot-name-active");
      });
      $$(`img[data-swiper-index="${group}"]`).forEach((img) => img.classList.remove("active-image"));
      $(`.spot-text[data-swiper-index="${group}"][data-spot-index="${spot}"]`)?.classList.add("spot-text-active");
      name.classList.add("spot-name-active");
      const img = $(`img[data-swiper-index="${group}"][data-spot-index="${spot}"]`);
      img?.classList.add("active-image", "active");
    })
  );
}

function svgIconPaths() {
  $$("#svg-icon path").forEach((p) => p.style.setProperty("--path", p.getTotalLength()));
}

function resortTypeFilter(scope) {
  const filters = $$(".filter span");
  const resorts = $$(".single-resort");
  filters.forEach((f) =>
    scope.on(f, "click", () => {
      const type = f.getAttribute("data-filter");
      $(".filter span.active")?.classList.remove("active");
      f.classList.add("active");
      resorts.forEach((r) => {
        r.style.display = type === "all" || r.getAttribute("data-resort-type") === type ? "" : "none";
      });
      refreshScroll();
    })
  );
}

function readMore(scope) {
  $$(".readmore-wrapper").forEach((wrap) => {
    const text = wrap.querySelector(".maintext-paragraph");
    if (!text) return;
    wrap.querySelector(".cs_readmore-btn-wrapper")?.remove();
    text.style.height = "";
    const full = text.scrollHeight;
    if (full <= 150) return;
    const collapsed = Math.min(Math.round(full / 2), 200);
    text.style.height = `${collapsed}px`;
    text.style.overflow = "hidden";
    text.style.transition = "height 0.6s ease";

    const btnWrap = document.createElement("div");
    btnWrap.className = "cs_readmore-btn-wrapper";
    const btn = document.createElement("button");
    btn.className = "cs_readmore-btn";
    const label = document.createElement("span");
    label.textContent = "Read More +";
    btn.appendChild(label);
    btnWrap.appendChild(btn);
    wrap.appendChild(btnWrap);

    let open = false;
    scope.on(btn, "click", () => {
      open = !open;
      text.style.height = open ? `${text.scrollHeight}px` : `${collapsed}px`;
      label.textContent = open ? "Read Less -" : "Read More +";
      btn.classList.toggle("expanded", open);
      scope.timeout(refreshScroll, 650);
    });
  });
}

function viewMore(scope) {
  $$(".view-more-container").forEach((container) =>
    scope.on(container, "click", (e) => {
      const link = e.target.closest(".view-more-link");
      if (!link) return;
      e.preventDefault();
      const group = link.closest("[data-view-more]");
      const hidden = group.querySelectorAll(".view-more-loop-item[data-hidden-loop]");
      const label = container.querySelector(".change-text");
      if (link.getAttribute("data-expanded") === "true") {
        hidden.forEach((i) => (i.style.display = "none"));
        label.textContent = "View More";
        link.setAttribute("data-expanded", "false");
        const anchor = group.querySelector('[data-scroll-to="true"]');
        if (anchor) window.scrollTo({ top: anchor.getBoundingClientRect().top + window.scrollY - 50, behavior: "smooth" });
      } else {
        let shown = 0;
        hidden.forEach((i) => {
          if (shown < 3 && i.style.display === "none") {
            i.style.display = "";
            shown++;
          }
        });
        if ([...hidden].every((i) => i.style.display !== "none")) {
          label.textContent = "View Less";
          link.setAttribute("data-expanded", "true");
        }
      }
      $$(".swiper").forEach((s) => s.swiper?.update());
      refreshScroll();
    })
  );
}

// ---------------------------------------------------------------- date pickers

function datePickers(scope) {
  const pickers = [];
  const make = (el, opts) => {
    if (!el) return null;
    const fp = flatpickr(el, opts);
    pickers.push(fp);
    return fp;
  };

  const checkin = $(".accommodation-checkin");
  const checkout = $(".accommodation-checkout");
  if (checkin && checkout) {
    const base = {
      dateFormat: "F j",
      minDate: "today",
      position: window.innerWidth < 768 ? "below auto" : "auto",
      disableMobile: true,
      static: true,
      clickOpens: false,
    };
    const out = make(checkout, base);
    const inn = make(checkin, {
      ...base,
      onChange([date]) {
        if (!date) return;
        const next = new Date(date);
        next.setDate(date.getDate() + 1);
        out.set("minDate", next);
        if (out.selectedDates[0] && out.selectedDates[0] <= date) out.clear();
      },
    });
    scope.on(checkin, "click", () => inn.open());
    scope.on(checkout, "click", () => out.open());
  }

  const range = { dateFormat: "d/m/Y", minDate: new Date(), mode: "range", static: true };
  $$(".custom_checkin, .custom_checkin2").forEach((el) => make(el, range));
  $$(".custom_checkout, .custom_checkout2").forEach((el) =>
    make(el, { dateFormat: "d/m/Y", minDate: new Date(), static: true })
  );
  $$(".custom_time").forEach((el) =>
    make(el, { enableTime: true, noCalendar: true, dateFormat: "H:i", defaultDate: "08:45", time_24hr: true, static: true })
  );

  scope.add(() => pickers.forEach((fp) => fp.destroy()));
}

// ---------------------------------------------------------------- transfer price calculators

const decodeHtml = (s) => {
  const t = document.createElement("textarea");
  t.innerHTML = s;
  return t.value;
};
const readJson = (el) =>
  JSON.parse(el.textContent).map((row) =>
    Object.fromEntries(Object.entries(row).map(([k, v]) => [k, typeof v === "string" ? decodeHtml(v) : v]))
  );
const num = (s) => parseFloat(String(s).replace(/[^\d.]/g, ""));
const options = (select, placeholder, values, label = (v) => v) => {
  select.innerHTML = `<option value="">${placeholder}</option>`;
  values.forEach((v) => select.appendChild(new Option(label(v), v)));
};
const uniq = (a) => [...new Set(a)];

function transportCalculators(scope) {
  $$("dialog[data-modal-id]").forEach((dialog) => {
    const id = dialog.dataset.modalId;
    const perHour = dialog.querySelector(`#perHour-data-${CSS.escape(id)}`);
    const perRoute = dialog.querySelector(`#perRoute-data-${CSS.escape(id)}`);
    if (perHour) hourCalculator(scope, dialog, readJson(perHour));
    if (perRoute) routeCalculator(scope, dialog, readJson(perRoute));
  });
}

function hourCalculator(scope, dialog, rows) {
  const region = dialog.querySelector(".regionSelect");
  const pickup = dialog.querySelector(".pickUpSelect");
  const hours = dialog.querySelector(".hoursInput");
  const results = dialog.querySelector(".results");
  if (!region || !pickup || !hours || !results) return;

  options(region, "Select Region", uniq(rows.map((r) => r.Region)), (g) => g.charAt(0).toUpperCase() + g.slice(1).toLowerCase());
  options(pickup, "Select Pick Up", []);
  const minHours = Math.min(...rows.map((r) => parseInt(r["Min Hour"], 10)));
  hours.setAttribute("min", minHours);

  const minus = hours.parentElement.querySelector(".hours-minus");
  const plus = hours.parentElement.querySelector(".hours-plus");
  const syncMinus = () => minus?.toggleAttribute("disabled", (parseInt(hours.value, 10) || minHours) <= minHours);

  const fillPickups = () => {
    options(pickup, "Select Pick Up", uniq(rows.filter((r) => r.Region === region.value).map((r) => r["Pick Up"])));
    results.innerHTML = "";
  };
  const render = () => {
    results.innerHTML = "";
    const h = parseInt(hours.value, 10);
    if (isNaN(h) || !region.value || !pickup.value) return;
    rows
      .filter((r) => r.Region === region.value && r["Pick Up"] === pickup.value)
      .forEach((r) => {
        const base = parseInt(r["Min Hour"], 10);
        const extra = Math.max(0, h - base);
        const total = h <= base ? num(r.Price) : num(r.Price) + (h - base) * num(r["Plus Per Hour"]);
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          ${r.Vehicle ? `<div class="row vehicles"><p class="label-title">Vehicle:</p><p class="value">${r.Vehicle}</p></div>` : ""}
          ${r.Inclusions ? `<div class="row inclusions"><p class="label-title">Inclusions:</p><p class="value">${r.Inclusions}</p></div>` : ""}
          ${r.Seater ? `<div class="row"><p class="label-title">Seats:</p><p class="value">${r.Seater}</p></div>` : ""}
          <div class="row"><p class="label-title">Base 8h Rate:</p><p class="value">${r.Price} EUR (${r["Min Hour"]}h)</p></div>
          <div class="row"><p class="label-title">Additional Hour:</p><p class="value">${r["Plus Per Hour"]} EUR</p></div>
          <div class="row"><p class="label-title">Total ${h}h:</p><p class="value price">${total} EUR${extra > 0 ? `<span class="extra-hours">(+${extra}h)</span>` : ""}</p></div>`;
        results.appendChild(card);
      });
  };

  scope.on(region, "change", () => {
    fillPickups();
    render();
  });
  scope.on(pickup, "change", render);
  scope.on(hours, "input", () => {
    syncMinus();
    render();
  });
  scope.on(hours, "blur", () => {
    if (!hours.value || parseInt(hours.value, 10) < minHours) hours.value = minHours;
    syncMinus();
    render();
  });
  scope.on(minus, "click", () => {
    const v = parseInt(hours.value, 10) || minHours;
    if (v > minHours) hours.value = v - 1;
    hours.dispatchEvent(new Event("input"));
  });
  scope.on(plus, "click", () => {
    hours.value = (parseInt(hours.value, 10) || minHours) + 1;
    hours.dispatchEvent(new Event("input"));
  });
  syncMinus();
}

function routeCalculator(scope, dialog, rows) {
  const region = dialog.querySelector(".perRouteForm .regionSelect");
  const pickup = dialog.querySelector(".pickUpSelect");
  const dropoff = dialog.querySelector(".dropOffSelect");
  const results = dialog.querySelector(".results");
  if (!region || !pickup || !dropoff || !results) return;

  options(region, "Select Region", uniq(rows.map((r) => r.Region)));
  options(pickup, "Select Pick Up", []);
  options(dropoff, "Select Drop Off", []);

  const render = () => {
    results.innerHTML = "";
    if (!region.value || !pickup.value || !dropoff.value) return;
    rows
      .filter((r) => r.Region === region.value && r["Pick Up"] === pickup.value && r["Drop Off"] === dropoff.value)
      .forEach((r) => {
        const prices = Object.keys(r)
          .filter((k) => !["Region", "Pick Up", "Drop Off", "Duration", "Inclusions"].includes(k))
          .map((k) => `<p class="value">${k}: <span class="value price">${r[k]} EUR</span></p>`)
          .join("");
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          ${r.Region ? `<div class="row region"><p class="label-title">Destination:</p><p class="value">${r.Region}</p></div>` : ""}
          <div class="row pickup"><p class="label-title">Pick Up:</p><p class="value">${r["Pick Up"]}</p></div>
          <div class="row dropoff"><p class="label-title">Drop Off:</p><p class="value">${r["Drop Off"]}</p></div>
          ${r.Duration ? `<div class="row duration"><p class="label-title">Duration:</p><p class="value">${r.Duration}</p></div>` : ""}
          ${r.Inclusions ? `<div class="row inclusions"><p class="label-title">Inclusions:</p><p class="value">${r.Inclusions}</p></div>` : ""}
          <div class="row"><p class="label-title">Vehicles / Price:</p><div class="grid-vehicles">${prices}</div></div>`;
        results.appendChild(card);
      });
  };

  scope.on(region, "change", () => {
    options(pickup, "Select Pick Up", uniq(rows.filter((r) => r.Region === region.value).map((r) => r["Pick Up"])));
    options(dropoff, "Select Drop Off", []);
    render();
  });
  scope.on(pickup, "change", () => {
    options(
      dropoff,
      "Select Drop Off",
      uniq(rows.filter((r) => r.Region === region.value && r["Pick Up"] === pickup.value).map((r) => r["Drop Off"]))
    );
    render();
  });
  scope.on(dropoff, "change", render);
}

// ---------------------------------------------------------------- maps

// The theme used the Google Maps JS API (needs a key); an embed needs none.
function maps() {
  $$("[data-coords]").forEach((el) => {
    if (!once(el, "mapInit")) return;
    let lat;
    let lng;
    const raw = el.getAttribute("data-coords").trim();
    try {
      if (raw.startsWith("[")) {
        const first = JSON.parse(raw)[0];
        lat = first?.lat;
        lng = first?.lng;
      } else {
        [lat, lng] = raw.split(",").map(parseFloat);
      }
    } catch {
      return;
    }
    if (lat == null || lng == null || isNaN(lat) || isNaN(lng)) return;
    const zoom = Number(el.dataset.zoom) || 12;
    const iframe = document.createElement("iframe");
    iframe.src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
    iframe.loading = "lazy";
    iframe.title = "Map";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.style.cssText = "border:0;width:100%;height:100%;filter:grayscale(1) contrast(1.05);";
    el.appendChild(iframe);
  });
}

// ---------------------------------------------------------------- forms

// Contact page enquiry form (same endpoint as the request dialog).
function contactForms(scope) {
  $$("form[data-contact-form]").forEach((form) =>
    scope.on(form, "submit", async (e) => {
      e.preventDefault();
      const msg = form.querySelector(".contact-form__message");
      const data = Object.fromEntries(new FormData(form));
      if (!data.name?.trim() || !data.mobile?.trim() || !data.message?.trim()) {
        msg.textContent = "Please fill in the required fields.";
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email ?? "")) {
        msg.textContent = "Please enter a valid email address.";
        return;
      }
      msg.textContent = "Sending…";
      try {
        const res = await fetch("/api/request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, context: "contact" }),
        });
        msg.textContent = res.ok ? "Your message has been sent successfully!" : "Something went wrong. Please try again.";
        if (res.ok) form.reset();
      } catch {
        msg.textContent = "Something went wrong. Please try again.";
      }
    })
  );
}

// ---------------------------------------------------------------- cursor follower

function cursorFollower(scope, safe) {
  if (!isDesktopPointer()) return;
  const el = document.createElement("div");
  el.className = "cursor-follower";
  document.body.appendChild(el);
  scope.add(() => el.remove());

  let shown = false;
  const show = safe((label = "DRAG") => {
    el.textContent = label;
    gsap.killTweensOf(el);
    gsap.to(el, { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out", force3D: false });
  });
  const hide = safe(() => {
    gsap.killTweensOf(el);
    gsap.to(el, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in", force3D: false });
  });
  safe(() => gsap.set(el, { scale: 0, opacity: 0, force3D: false }))();

  const qualifies = (zone) => {
    const s = zone.querySelector(".swiper");
    return !s || s.querySelectorAll(".swiper-slide").length > 3;
  };

  scope.on(
    window,
    "mousemove",
    safe(({ target, clientX, clientY }) => {
      const zone = target?.closest?.("[data-cursor]");
      const active = !!zone && qualifies(zone);
      if (active && !shown) {
        shown = true;
        show(zone.dataset.cursor);
      } else if (!active && shown) {
        shown = false;
        hide();
      }
      const off = window.innerWidth <= 991 ? 34 : window.innerWidth <= 1024 ? 30 : 23;
      gsap.to(el, {
        x: Math.round(clientX + off),
        y: Math.round(clientY + off),
        duration: 0.35,
        ease: "power2.out",
        force3D: false,
        overwrite: "auto",
      });
    })
  );
  scope.on(document, "mouseleave", () => {
    shown = false;
    hide();
  });
}
