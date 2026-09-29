// Renders the site pages from src/content/panda-content.json.
//
//   node scripts/build-pages.mjs
//
// Each page reuses the theme's section markup (ids/classes), so the theme CSS
// and the animations in src/lib/site apply unchanged. Edit the JSON (or the
// templates below) and re-run to update the pages.
//
// Writes:
//   src/content/pages/<slug>.html
//   src/content/partials/footer.html
//   src/content/pages.json
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const C = JSON.parse(fs.readFileSync(path.join(ROOT, "src/content/panda-content.json"), "utf8"));
const OUT_PAGES = path.join(ROOT, "src/content/pages");
const OUT_PARTIALS = path.join(ROOT, "src/content/partials");

// ---------------------------------------------------------------- helpers

const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const photo = (name) => `/images/photos/${name}`;
const icon = (name) => `/images/icons/${name}.${name === "reliability" ? "webp" : "svg"}`;
const img = (src, alt = "", attrs = "") =>
  `<img src="${src}" alt="${esc(alt)}" loading="lazy" decoding="async" ${attrs}/>`;
const paras = (list) => list.map((p) => `<p>${esc(p)}</p>`).join("\n");
const firstSentences = (text, n = 2) => (text.match(/[^.!?]+[.!?]+/g) ?? [text]).slice(0, n).join(" ").trim();
const upperBreak = (text, words = 2) => {
  const w = text.toUpperCase().split(" ");
  return w.length <= words ? esc(w.join(" ")) : `${esc(w.slice(0, words).join(" "))}<br>${esc(w.slice(words).join(" "))}`;
};
const isExternal = (href) => /^https?:/.test(href);
const target = (href) => (isExternal(href) ? ` target="_blank" rel="noopener"` : "");

const ARROW = (color) => `<svg xmlns="http://www.w3.org/2000/svg" width="50.987" height="14.208" viewBox="0 0 50.987 14.208">
  <g transform="translate(-1143 -7586.331)"><g transform="translate(1164.072 7575.435)">
    <path d="M7.5,18H57.073" transform="translate(-28.573)" fill="none" stroke="${color}" stroke-linejoin="round" stroke-width="2"/>
    <path d="M18,7.5l6.4,6.4-6.4,6.4" transform="translate(4.103 4.103)" fill="none" stroke="${color}" stroke-width="2"/>
  </g></g></svg>`;

const arrowLink = (href, label, tone = "black") =>
  `<a href="${href}"${target(href)} class="arrow_link ${tone}"><span>${esc(label)} ${ARROW(tone === "white" ? "#fff" : "#1a1a1a")}</span></a>`;

const BORDERS = `<span class="left_brd"></span><span class="right_brd"></span><span class="top_brd"></span><span class="bottom_brd"></span>`;
const themeButton = ({ label, href, modal, variant = "white" }) =>
  modal
    ? `<button data-aos="button" data-aos-once="true" class="open_modal theme-btn theme-btn-animate--${variant}" data-modal-id="${modal}">${esc(label)} ${BORDERS}</button>`
    : `<a data-aos="button" data-aos-once="true" class="theme-btn theme-btn-animate--${variant}" href="${href}"${target(href)}>${esc(label)} ${BORDERS}</a>`;

const breadcrumbs = (label) => `<ul class="breadcrumbs" data-aos="fade-right" data-aos-duration="1300" data-aos-delay="300" data-aos-once="true">
  <li><a href="/">Home</a></li>
  <li>${esc(label.toLowerCase())}</li>
</ul>`;

// Full-width closing banner with parallax background.
const enquireBanner = (image, title, button) => `<section id="default_enquire" data-section-scroll>
  <img src="${photo(image)}" class="bg" alt="" decoding="async" />
  <div class="wrapper content-wrapper">
    <h3 data-animate-heading>${esc(title)}</h3>
    ${themeButton(button)}
  </div>
</section>`;

// Big title slider (travel_experiences_slider).
const bigSlider = (slides) => `<section id="travel_experiences_slider" data-post-page>
  <div class="travel_swipe">
    <div class="swiper-wrapper">
${slides
  .map(
    (s) => `      <div class="swiper-slide" data-bg="${photo(s.bg)}">
        <div class="title" data-aos="zoom-in" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
          <h3 class="h1" data-animate-heading>${esc(s.title)}</h3>
        </div>
        <div class="image" data-aos-easing="ease-in-out">
          <p class="crystal white">${esc(s.subtitle)}</p>
          ${img(photo(s.image), s.title, 'class="attachment-full size-full"')}
        </div>
      </div>`
  )
  .join("\n")}
    </div>
  </div>
  <div class="swiper_controls">
    <div class="swiper-button-prev"><img src="/theme/images/arrow_left.svg" alt="Previous"></div>
    <div class="swiper-button-next"><img src="/theme/images/arrow_right.svg" alt="Next"></div>
  </div>
</section>`;

// ---------------------------------------------------------------- home

function homePage() {
  const h = C.home;
  const [visaServices, travelServices] = [C.services.items.slice(0, 5), C.services.items.slice(5, 9)];
  const visaImages = [
    ["traveler-passport.webp", "visa-applications.webp"],
    ["visa-applications.webp", "commitment.webp"],
    ["team-growth.webp", "clients-assisted.webp"],
    ["global-reach.webp", "our-vision.webp"],
    ["book-now.webp", "travelers-group.webp"],
  ];
  const travelImages = [
    ["global-reach.webp", "hot-air-balloon.webp"],
    ["lofoten-islands.webp", "our-vision.webp"],
    ["travelers-group.webp", "nationalities.webp"],
    ["visa-applications.webp", "traveler-passport.webp"],
  ];
  const faqGroups = C.faq.groups.slice(0, 4);
  const faqBgs = ["our-vision.webp", "global-reach.webp", "lofoten-islands.webp", "hot-air-balloon.webp"];
  const reviews = h.testimonials.items.filter((t) => t.text.length > 60 && t.text.length < 420).slice(0, 8);

  return `<section id="home_featured">
  <div class="featured_background">
    <img class="featured-media" src="${photo("lofoten-islands.webp")}" alt="" fetchpriority="high" decoding="async" />
    <div class="title">
      <h1>TRAVEL BOLDLY</h1>
    </div>
    <div class="btn-wrapper">
      ${themeButton({ label: h.hero.cta.toUpperCase(), modal: "request" })}
    </div>
  </div>
</section>
<section id="home_about">
  <div class="home_about_wrapper">
    <div class="image" data-aos="custom">
      ${img(photo("traveler-passport.webp"), "Traveler with passport", 'class="home-about-img"')}
    </div>
    <div class="info">
      <div class="title">
        <h2 data-animate-heading>YOUR PARTNER IN<br>SEAMLESS VISA SOLUTIONS</h2>
      </div>
      <div class="text" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="500" data-aos-once="true">
        <p>${esc(h.intro.text)}</p>
        <p>${esc(h.whatWeDo.text)}</p>
        ${arrowLink("/aboutus", h.whatWeDo.cta, "white")}
      </div>
    </div>
  </div>
</section>
<section id="home_agents">
  <div class="home_agents">
    <div class="agent_left" data-speed="clamp(1.3)">
      ${img(photo("hot-air-balloon.webp"), "Hot air balloons", 'class="agent-left-img" data-aos="zoom-in" data-aos-duration="1500" data-aos-once="true"')}
    </div>
    <div class="info" data-aos="zoom-out" data-aos-duration="1500" data-aos-delay="200" data-aos-once="true">
      <div class="title">
        <h2 class="h1">${upperBreak(h.whyChooseUs.title, 1)}</h2>
      </div>
      <div class="text">
        <p>${esc(h.whyChooseUs.intro)}</p>
      </div>
    </div>
    <div class="agent_right" data-speed="clamp(1.3)">
      ${img(photo("our-vision.webp"), "Mountain vision", 'class="agent-right-img" data-aos="zoom-in" data-aos-duration="1500" data-aos-once="true"')}
    </div>
  </div>
</section>
${bigSlider(
  h.stats.map((s, i) => ({
    title: `${s.value.toLocaleString("en-GB")}${s.suffix} ${s.label}`.toUpperCase(),
    subtitle: h.whyChooseUs.items[i].title,
    bg: ["travelers-group.webp", "milestones.webp", "clients-assisted.webp", "nationalities.webp"][i],
    image: ["travelers-group.webp", "milestones.webp", "clients-assisted.webp", "nationalities.webp"][i],
  }))
)}
<section id="home_accommodation" data-cursor="DRAG">
  <div class="swiper accommodation_swipe">
    <div class="swiper-wrapper">
${visaServices
  .map(
    (s, i) => `      <div class="swiper-slide">
        <div class="left">
          <p data-aos="fade-left" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">OUR SERVICES</p>
          <h2 class="h1" data-animate-heading data-aos="fade-up" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">VISA<br>SOLUTIONS</h2>
          <div class="image" data-speed="clamp(0.95)">
            ${img(photo(visaImages[i][0]), s.title, 'class="attachment-full size-full"')}
          </div>
        </div>
        <div class="right">
          <div class="image" data-speed="clamp(1.3)">
            ${img(photo(visaImages[i][1]), s.title, 'class="attachment-full size-full"')}
          </div>
          <h3 class="h4" data-animate-heading>${esc(s.title)}</h3>
          <div class="text"><p>${esc(firstSentences(s.text, 2))}</p></div>
          ${arrowLink("/services", "Discover")}
        </div>
      </div>`
  )
  .join("\n")}
    </div>
  </div>
  <div class="navigation">
    <div class="swiper-button-prev acc-nav">Previous</div>
    <div class="swiper-button-next acc-nav">Next</div>
  </div>
  <a href="/services" style="text-align: center; align-self: center; display: block; color: #1a1a1a; margin: 8vh auto;" class="underline-link"><span>Discover All</span></a>
</section>
<section id="home_tours">
  <div class="wrapper">
    <div class="navigation">
      <div class="swiper-button-prev tour-nav">Previous</div>
      <div class="swiper-button-next tour-nav">Next</div>
    </div>
    <div class="wrapper swiper-pagination" data-aos="fade-right" data-aos-duration="1200" data-aos-easing="ease-in-out" data-aos-once="true"></div>
    <div class="swiper experiences_home_swipe" data-cursor="DRAG">
      <div class="swiper-wrapper">
${travelServices
  .map(
    (s, i) => `        <div class="swiper-slide">
          <div class="left">
            <div class="image" data-speed="clamp(0.8)">
              ${img(photo(travelImages[i][0]), s.title, 'class="attachment-full size-full"')}
            </div>
            <div class="text">
              <h2 data-animate-heading>Travel Services</h2>
              <div class="info" data-speed="clamp(1.15)">
                <h3 data-animate-heading>${upperBreak(s.title, 2)}</h3>
                <p>${esc(firstSentences(s.text, 2))}</p>
                ${arrowLink("/services", "Discover", "white")}
              </div>
            </div>
          </div>
          <div class="right">
            ${img(photo(travelImages[i][1]), s.title, 'class="attachment-full size-full"')}
            ${img(photo(travelImages[(i + 1) % travelImages.length][0]), s.title, 'class="small-middle" data-speed="clamp(0.6)"')}
          </div>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </div>
</section>
<section id="home_custom_holidays">
  ${img(photo("book-now.webp"), "Traveller", 'class="image_right" data-speed="clamp(1.2)"')}
  <div class="wrapper">
    <p class="subtitle">${esc(h.tracker.text.toUpperCase())}</p>
    <div class="info">
      <div class="image">
        <h2 class="h1" data-animate-heading data-speed="clamp(0.8)" style="z-index:1;">SCHENGEN SLOTS</h2>
        ${img(photo("calendar.png"), "Calendar")}
      </div>
      <div class="text">
        <p>${esc(h.tracker.title)}. ${esc(C.services.items[9].text)}</p>
        <div class="link_center" data-aos="fade-up" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
          ${arrowLink(C.site.notificationGroup, h.tracker.cta)}
        </div>
      </div>
    </div>
  </div>
</section>
<section id="default_destination">
  <h2 class="section-heading"><a href="/faq">Visa guides by destination</a></h2>
  <div class="wrapper">
    <div class="default-bg background-img" style="background-image: url('${photo("travelers-group.webp")}');"></div>
${faqGroups.map((g, i) => `    <div class="image-container background-img" style="background-image: url('${photo(faqBgs[i])}');"></div>`).join("\n")}
    <div class="heading-wrappers">
${faqGroups
  .map((g) => `      <h3 class="post-title"><a href="/faq#${g.icon}">${esc(g.title.replace(/ Visa.*$/, "").toUpperCase())}</a></h3>`)
  .join("\n")}
    </div>
  </div>
</section>
<section id="home_services">
  <div class="services_wrapper">
${[
  ["/pricing", "OUR PRICING", "pricing.webp"],
  ["/faq", "VISA FAQS", "visa-applications.webp"],
]
  .map(
    ([href, label, image]) => `    <div class="service" data-aos="zoom-in" data-aos-once="true" data-aos-duration="1000">
      <a href="${href}">
        <h2 data-animate-heading>${esc(label)} ${ARROW("#fff")}</h2>
        ${img(photo(image), label, 'class="attachment-full size-full"')}
      </a>
    </div>`
  )
  .join("\n")}
  </div>
</section>
<section id="reviews" data-aos="svg-dash-animate" data-aos-once="true" data-color="#efefef">
  <div class="reviews-swiper" data-aos="custom" data-aos-once="true">
    <h3 class="section-heading" data-animate-heading>${esc(h.testimonials.title)}</h3>
    <div class="swiper-wrapper">
${reviews
  .map(
    (r) => `      <div class="swiper-slide">
        <div class="single-review-item">
          <p class="review-text">“${esc(r.text)}”</p>
          <span class="author-name">${esc(r.name)} — ${esc(r.title)}</span>
        </div>
      </div>`
  )
  .join("\n")}
    </div>
    <div class="swiper-pagination"></div>
    <div class="swiper-arrow-prev">${ARROW("#000")}</div>
    <div class="swiper-arrow-next">${ARROW("#000")}</div>
  </div>
  <p class="reviews-source"><a href="${C.site.trustpilot}" target="_blank" rel="noopener">★★★★★ Check what customers say about us on Trustpilot</a></p>
</section>
<section id="home_travel_stories">
  <div class="home_travel_wrapper" data-aos="custom" data-aos-anchor-placement="top-center">
    <div class="image">${img(photo("commitment.webp"), "Our commitment", 'class="attachment-full size-full"')}</div>
    <div class="info" data-speed="clamp(0.8)">
      <div class="title">
        <h2>Our</h2>
        <span></span>
        <h2>Story</h2>
      </div>
      <a href="/aboutus" class="link">Discover more</a>
    </div>
  </div>
</section>
<section id="home_enquire">
  <div class="home_enquire">
    <div class="marquee_wrapper">
      <div class="marquee_left"><p>${esc(h.enquire.title.toUpperCase())}. ${esc(h.enquire.title.toUpperCase())}.</p></div>
      <div class="marquee_right"><p>${esc(h.enquire.title.toUpperCase())}. ${esc(h.enquire.title.toUpperCase())}.</p></div>
    </div>
    ${themeButton({ label: "ENQUIRE", href: "/contact", variant: "gold" })}
  </div>
</section>
`;
}

// ---------------------------------------------------------------- about

function aboutPage() {
  const a = C.about;
  const story = a.story.paragraphs;
  return `<section id="about_featured">
  <div class="featured_background">
    <div class="image" data-speed="clamp(1.2)">
      ${img(photo("hot-air-balloon.webp"), "Hot air balloons", 'class="attachment-full size-full" data-aos="fade-up" data-aos-duration="1200"')}
    </div>
    <div class="title">
      <div class="marquee_wrapper">
        <div class="marquee_title">
          <h1>${Array(5).fill("ABOUT US").join(" ")}</h1>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="whoweare_about">
  <div class="whoweare_about">
    <h2 class="h1" data-speed="clamp(0.6)">OUR<br>STORY</h2>
    <div class="whoweare_featured_div">
      <div class="image image_top" style="background-image:url('${photo("lofoten-islands.webp")}')"></div>
      <div class="image image_bottom" style="background-image:url('${photo("lofoten-islands.webp")}')"></div>
    </div>
    <div class="whoweare_team_about">
      <h3>From a three-month wait<br>to a simple, powerful<br>solution</h3>
      <div class="team_overview">
        <div class="team_left" data-speed="clamp(1)">${img(photo("team-growth.webp"), "Our team", 'class="attachment-full size-full"')}</div>
        <div class="team_right" data-speed="clamp(1.3)">${img(photo("visa-applications.webp"), "Visa application", 'class="attachment-full size-full"')}</div>
      </div>
      <div class="text">
        <h3>${esc(a.story.title)}</h3>
        ${paras(story.slice(0, 2))}
      </div>
    </div>
  </div>
  <div class="whoweare_snami_origin" data-aos="custom" data-aos-anchor-placement="top-center" data-aos-once="true">
    <div class="image">${img(photo("our-vision.webp"), "Our mission", 'class="attachment-full size-full"')}</div>
    <div class="info" data-speed="clamp(0.8)">
      <div class="title"><h3>${esc(a.mission.title)}</h3></div>
      <div class="text"><p>${esc(a.mission.text)}</p></div>
    </div>
  </div>
  <div class="whoweare_cotraveler">
    <h2 class="h3">${esc(a.vision.title)}</h2>
    <div class="cotraveler_info">
      <div class="left">
        <h3 class="h4">Travel should be<br>accessible to all.</h3>
        ${img(photo("global-reach.webp"), "Global reach", 'class="attachment-full size-full"')}
      </div>
      <div class="right">
        ${img(photo("travelers-group.webp"), "Travelers", 'class="attachment-full size-full" data-speed="clamp(1.5)"')}
        <div class="text">
          <p>${esc(a.vision.text)}</p>
          ${story[2] ? `<p>${esc(story[2])}</p>` : ""}
        </div>
      </div>
    </div>
    <div class="big_text" data-aos="custom" data-aos-once="true">
      <p>TRAVEL</p>
      <p>BOLDLY</p>
    </div>
  </div>
  <div class="whoweare_dreams" data-aos="custom" data-aos-anchor-placement="10% 50%">
    <h2 class="h3">${esc(a.commitment.title)}</h2>
    <div class="image">
      <p class="h1" data-speed="clamp(1.1)" data-animate-heading>Every step<br>of the way</p>
      ${img(photo("commitment.webp"), "Our commitment", 'class="attachment-full size-full"')}
    </div>
    <div class="text">
      ${paras(a.commitment.paragraphs)}
    </div>
  </div>
</section>
<section id="principles_about">
  <div class="principles_wrapper">
    <div class="heading-wrapper">
      <h2 class="section-heading">${esc(a.values.title)}</h2>
      <span class="subtitle"><p>${esc(C.home.whyChooseUs.outro)}</p></span>
    </div>
    <div class="swiper customSwiper not-playing moveswiper">
      <div class="content">
        <div class="stacking-content title-wrapper">
${a.values.items
  .map(
    (v, i) => `          <div data-swiper-index="${i}"${i === 0 ? ' class="active"' : ""}>
            <h2 class="section-heading">${esc(v.title)}</h2>
            <span>${esc(firstSentences(v.text, 1))}</span>
          </div>`
  )
  .join("\n")}
        </div>
        <div class="three-columns-wrapper">
          <div class="navigation-area">
            <div class="navigation-buttons">
              <div class="button-prev">${CIRCLE_ARROW}</div>
              <div class="button-next">${CIRCLE_ARROW}</div>
            </div>
          </div>
          <div class="stacking-content paragraph-wrapper">
${a.values.items
  .map((v, i) => `            <div data-swiper-index="${i}"${i === 0 ? ' class="active"' : ""}><p>${esc(v.text)}</p></div>`)
  .join("\n")}
          </div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
      <div class="swiper-wrapper">
${["milestones.webp", "our-vision.webp", "global-reach.webp"]
  .map((p, i) => `        <div class="swiper-slide">${img(photo(p), a.values.items[i].title, 'class="attachment-full size-full"')}</div>`)
  .join("\n")}
      </div>
    </div>
  </div>
</section>
<section id="about_team" data-color="#efefef">
  <h2 class="section-heading text-center">${esc(a.milestones.title)}</h2>
  <p class="about-team-intro">${esc(a.milestones.intro)}</p>
  <div class="wrapper">
    <div class="swiper agents-swiper">
      <div class="floating-marquee" data-speed="clamp(1.1)">
        <div class="wrapperRollingText">
          <div class="rollingText text">EXCELLENCE · INNOVATION · A CLIENT-FIRST APPROACH</div>
        </div>
      </div>
      <div class="swiper-wrapper">
${a.milestones.items
  .map(
    (m) => `        <div class="swiper-slide">
          ${img(photo(m.image + ".webp"), m.title, 'class="agent-photo"')}
          <span class="agent-name">${esc(m.title)}</span>
          <div data-animate-text>
            <p class="agent-excerpt">${esc(m.text)}</p>
          </div>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </div>
  <p class="about-team-intro">${esc(a.milestones.outro)}</p>
</section>
${enquireBanner("milestones.webp", "READY TO TRAVEL BOLDLY?", { label: "ENQUIRE", href: "/contact" })}
`;
}

const CIRCLE_ARROW = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <g transform="translate(0 0)">
    <path d="M61.562,136.228A68.331,68.331,0,0,1,64.691,0" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2"/>
    <path d="M0,0A64.73,64.73,0,0,1,9.264,1.4a65.782,65.782,0,0,1,9.264,2.758,68.355,68.355,0,0,1,44.124,66.7c-1.34,34.091-28.238,62.064-61.791,65.261" transform="translate(73.956 0.132)" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2"/>
  </g>
  <g transform="translate(68 87.038)">
    <path d="M7.5,18H57.073" transform="translate(-7.5 -11.603)" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2"/>
    <path d="M18,7.5l6.4,6.4-6.4,6.4" transform="translate(-18 -7.5)" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-width="2"/>
  </g>
</svg>`;

// ---------------------------------------------------------------- services

function servicesPage() {
  const s = C.services;
  const media = [
    ["center", "travelers-group.webp"],
    ["left_top", "traveler-passport.webp"],
    ["left_bottom", "global-reach.webp"],
    ["right_top", "visa-applications.webp"],
    ["right_bottom", "hot-air-balloon.webp"],
  ];
  return `<section id="concierge_page_featured">
  <div class="background-img bg-container" style="background-image: url('${photo("lofoten-islands.webp")}');">
    <div class="wrapper center-content">
      <div class="stacking-content">
        <div class="image" data-clip-image>
          ${img(photo("book-now.webp"), "Traveller", 'class="attachment-full size-full" data-speed="clamp(1.3)"')}
        </div>
        <h1 class="section-heading" data-animate-heading>Our Services</h1>
      </div>
      <span class="small_sub_text white" data-speed="clamp(1.2)">& Seamless Visa Solutions</span>
    </div>
    <span class="featured-vertical-text white" data-speed="1.1">TRAVEL BOLDLY</span>
  </div>
</section>
<section id="concierge_page_about">
  ${breadcrumbs("services")}
  <div class="wrapper">
    <div class="first-item">
      <h2 class="section-heading" data-animate-heading>Your Partner in Seamless Visa Solutions</h2>
      <div class="image image-scaled background-img" style="background-image: url('${photo("our-vision.webp")}')"></div>
    </div>
    <div class="second-item">
      <span class="subtitle">THE FLYING PANDA</span>
      <h2 class="section-heading" data-animate-heading>SIMPLIFIES</h2>
      <span class="subtext">VISA APPOINTMENTS<br>DOCUMENTATION<br>REAL-TIME UPDATES</span>
    </div>
    <ul class="third-item media-wrapper list-none">
${media.map(([pos, p]) => `      <li class="media ${pos}">${img(photo(p), "", 'class="attachment-full size-full"')}</li>`).join("\n")}
    </ul>
    <div class="column column__left">
      <h2 class="secondary-heading" data-animate-heading data-speed="clamp(1.1)">YOUR JOURNEY<br>OUR EXPERTISE</h2>
    </div>
  </div>
</section>
<section id="concierge_page_purpose" data-speed="clamp(1.1)">
  <div class="text-wrapper">
    <div class="readmore-wrapper" data-aos="fade" data-aos-duration="1300" data-aos-delay="300" data-aos-once="true">
      <div class="maintext-paragraph">
        <p>${esc(s.intro)}</p>
        <p>&nbsp;</p>
        <p>${esc(C.home.whatWeDo.text)}</p>
      </div>
    </div>
  </div>
  <a href="/contact" class="theme-btn theme-btn-after--black">Let’s Connect</a>
</section>
<section id="concierge_page_how_it_works">
  <h2 class="section-heading" data-animate-heading>${esc(s.title)}</h2>
  <div class="wrapper two-columns" data-aos="custom">
    <ul class="column-left list-none">
${s.items
  .map((it, i) => `      <li data-index="${i}" data-aos="fade-up" data-aos-duration="400" data-aos-once="true"><button>${esc(it.title)}</button></li>`)
  .join("\n")}
    </ul>
    <div class="column-right stacking-content">
${s.items
  .map(
    (it, i) => `      <div class="content" data-index="${i}">
        <img src="${icon(it.icon)}" alt="${esc(it.title)}" width="120" height="140">
        <p>${esc(it.text)}</p>
        ${it.note ? `<p class="service-note">${esc(it.note)}</p>` : ""}
        ${it.icon === "notifications" ? `<p>${arrowLink(C.site.notificationGroup, s.notificationCta)}</p>` : ""}
      </div>`
  )
  .join("\n")}
    </div>
  </div>
</section>
${enquireBanner("travelers-group.webp", "NEED HELP WITH YOUR VISA?", { label: "ENQUIRE", href: "/contact" })}
`;
}

// ---------------------------------------------------------------- pricing

function pricingPage() {
  const p = C.pricing;
  return `<section id="sustainability-featured">
  <img src="${photo("pricing.webp")}" class="attachment-full size-full" alt="${esc(p.title)}" decoding="async" fetchpriority="high" />
  <h1 data-animate-heading>Our Pricing</h1>
</section>
<section id="sustainability-intro" class="wrapper">
  ${breadcrumbs("pricing")}
  <h2 class="h3" data-animate-heading>TRANSPARENT AND<br>FLEXIBLE PRICING</h2>
  <div class="intro-content" data-speed="clamp(0.9)">
    ${img(photo("traveler-passport.webp"), p.title, 'class="attachment-full size-full"')}
    <div class="text">
      <p>${esc(p.intro)}</p>
      <p><strong>${esc(p.appointments.title)}</strong></p>
      <p>${esc(p.appointments.text)}</p>
    </div>
  </div>
</section>
<section id="sustainability-banner" style="background-image:url('${photo("lofoten-islands.webp")}');">
  <p class="h5 wrapper" data-speed="clamp(0.9)">${esc(p.appointments.title)} — PRICED BY APPLICATION COUNTRY, CITIZENSHIP AND DESTINATION.</p>
</section>
<section id="content-default" class="wrapper pricing-list">
  <p class="text-center subtitle">${esc(p.title)}</p>
${p.items.map((it) => `  <h3>${esc(it.title)}</h3>\n  <p>${esc(it.text)}</p>`).join("\n")}
</section>
${enquireBanner("our-vision.webp", "GET A TAILORED QUOTE", { label: "ENQUIRE", modal: "request" })}
`;
}

// ---------------------------------------------------------------- faq

// Categories live in a rail that stays pinned beside the questions (see src/lib/site/faq.js).
function faqPage() {
  const f = C.faq;
  const pad = (n) => String(n).padStart(2, "0");
  const total = f.groups.reduce((n, g) => n + g.items.length, 0);
  return `<section id="faq-content" class="wrapper faq-board">
  <h1 class="text-center" data-animate-heading>FAQ</h1>
  <p class="faq-intro text-center">${esc(f.title)} ${esc(f.intro)}</p>
  <div class="faq-board__layout" data-faq-board>
    <aside class="faq-nav" data-faq-nav>
      <div class="faq-nav__inner">
        <label class="faq-search">
          <span class="sr-only">Search the FAQ</span>
          <input type="search" placeholder="Search ${total} questions" autocomplete="off" data-faq-search>
        </label>
        <p class="faq-nav__label">Categories</p>
        <ol class="faq-nav__list">
${f.groups
  .map(
    (g, i) => `          <li>
            <a class="faq-nav__item${i === 0 ? " is-active" : ""}" href="#${g.icon}" data-faq-target="${g.icon}">
              <span class="faq-nav__num">${pad(i + 1)}</span>
              <img class="faq-nav__icon" src="${icon(g.icon)}" alt="" width="36" height="36">
              <span class="faq-nav__name">${esc(g.title)}</span>
              <span class="faq-nav__count" data-faq-count>${g.items.length}</span>
              <span class="faq-nav__progress" aria-hidden="true"><i></i></span>
            </a>
          </li>`
  )
  .join("\n")}
        </ol>
      </div>
    </aside>
    <div class="faq-board__list">
      <p class="faq-empty" data-faq-empty hidden>No questions match your search. <a href="/contact">Ask us directly</a>.</p>
${f.groups
  .map(
    (g, i) => `      <div class="faq-group" id="${g.icon}" data-faq-group="${g.icon}">
        <h2 class="faq-group__title"><span class="faq-group__num">${pad(i + 1)}</span> ${esc(g.title)}</h2>
        <div class="faq-wrapper" data-component="accordion">
${g.items
  .map(
    (it) => `          <div class="faq-link" data-accordion-item>
            <div class="faq-question-wrapper" data-accordion-header>
              <h3 class="text-heading">${esc(it.q)}</h3>
              <div class="faq-arrow-wrapper"><img class="faq-arrow" src="/theme/images/black-chevron.svg" alt=""></div>
            </div>
            <div class="faq-answer-wrapper" data-accordion-inner>
              <div class="faq-answer"><p>${esc(it.a)}</p></div>
            </div>
          </div>`
  )
  .join("\n")}
        </div>
      </div>`
  )
  .join("\n")}
    </div>
  </div>
</section>
${enquireBanner("global-reach.webp", "DIDN’T FIND WHAT YOU WERE LOOKING FOR?", { label: "CONTACT US", href: "/contact" })}
`;
}

// ---------------------------------------------------------------- contact

function contactPage() {
  const s = C.site;
  const field = (id, label, input, required = true, hideLabel = false) => `<div class="field-holder">
      <label for="${id}"${hideLabel ? " hidden" : ""}>${label}${required ? '<span class="req">*</span>' : ""}</label>
      <span class="wpcf7-form-control-wrap">${input}</span>
    </div>`;
  const input = (id, name, type, placeholder) =>
    `<input class="wpcf7-form-control wpcf7-text" id="${id}" name="${name}" type="${type}" placeholder="${placeholder}" required>`;
  return `<section id="contact_page_featured">
  <div class="featured-marquee">
    <h1 class="featured-marquee__text" data-direction="ltr">${Array(4).fill('<span class="gap"></span>Contact').join("")}</h1>
  </div>
  <div class="wrapper content-wrapper">
    <ul class="info-left list-none" data-aos="fade-right" data-aos-duration="1400" data-aos-delay="500">
      <li>${esc(s.address.replace(/ Wimbledon.*/, ""))}<br>Wimbledon, United Kingdom<br>SW19 3NW</li>
    </ul>
    <div class="image" data-speed="clamp(1.4)">
      ${img(photo("traveler-passport.webp"), "Traveler with passport", 'class="img vertical" data-aos="custom" data-aos-duration="1400"')}
      <div class="info-right wysiwyg-content" data-aos="fade-left" data-aos-duration="1400" data-aos-delay="500">
        <ul>
          <li><a href="tel:${s.phone.replace(/\s/g, "")}">T. ${esc(s.phone)}</a></li>
          <li><a href="mailto:${s.email}">E. ${esc(s.email)}</a></li>
          <li><a href="${s.whatsapp}" target="_blank" rel="noopener">WhatsApp</a></li>
        </ul>
      </div>
    </div>
  </div>
</section>
<section id="contact_page_form">
  <div class="wrapper">
    <div id="ContactUsForm" class="animated-heading text-center" data-aos="fade-up" data-aos-duration="1400" data-aos-delay="500">
      <h2 data-animate-heading class="form_heading">${esc(C.home.enquire.title)}</h2>
      <p class="contact-intro">${esc(C.home.enquire.text)}</p>
      <div class="wpcf7">
        <form class="wpcf7-form" data-contact-form novalidate>
          <div class="two-input-wrapper">
            ${field("fullnamefield", "FULL NAME", input("fullnamefield", "name", "text", "FULL NAME"))}
            ${field("emailfield", "EMAIL", input("emailfield", "email", "email", "EMAIL ADDRESS"))}
          </div>
          <div class="two-input-wrapper">
            ${field("telephonefield", "CONTACT NUMBER", input("telephonefield", "mobile", "tel", "CONTACT NUMBER"))}
            ${field(
              "destinationfield",
              "DESTINATION",
              `<select class="wpcf7-form-control wpcf7-select" id="destinationfield" name="destination">${[
                "Where are you going?",
                ...C.faq.groups.filter((g) => g.icon !== "visa").map((g) => g.title),
                "Other",
              ]
                .map((o, i) => `<option value="${i ? esc(o) : ""}">${esc(o)}</option>`)
                .join("")}</select>`,
              false,
              true
            )}
          </div>
          <div class="one-input-wrapper">
            ${field("messagefield", "MESSAGE", `<textarea class="wpcf7-form-control wpcf7-textarea" id="messagefield" name="message" rows="6" placeholder="TYPE YOUR MESSAGE HERE" required></textarea>`)}
          </div>
          <button type="submit" class="page-link arrow-anim"><span>SUBMIT</span> ${ARROW("#1a1a1a")}</button>
          <p class="contact-form__message" role="status"></p>
        </form>
      </div>
    </div>
  </div>
</section>
`;
}

// ---------------------------------------------------------------- legal

function legalPage(doc) {
  const out = [];
  let list = null;
  for (const b of doc.blocks) {
    if (b.tag === "li") {
      list ??= [];
      list.push(`<li>${esc(b.text)}</li>`);
      continue;
    }
    if (list) {
      out.push(`<ul>${list.join("")}</ul>`);
      list = null;
    }
    out.push(b.tag === "h3" ? `<h2>${esc(b.text)}</h2>` : `<p>${esc(b.text)}</p>`);
  }
  if (list) out.push(`<ul>${list.join("")}</ul>`);
  return `<section id="privacy-policy">
  <h1 class="page-heading" data-animate-heading data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400">${esc(doc.title)}</h1>
  <div class="wrapper content-wrapper flow" data-aos="fade-up" data-aos-delay="600">
    <p><strong>${esc(C.site.name)}</strong> — ${esc(doc.subtitle)}</p>
    ${out.join("\n    ")}
  </div>
</section>
`;
}

// ---------------------------------------------------------------- footer

function footer() {
  const s = C.site;
  const destinations = ["schengen", "us", "uk", "canada", "australia", "new-zealand", "visa"];
  const link = (href, label) => `<li class="menu-item"><a href="${href}"${target(href)} class="link link--trans link--white">${esc(label)}</a></li>`;
  return `<div class="container-boxed site-footer__container text-center">
  <div class="footer_wrapper" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
    <div class="footer-banner-wrapper">
      <div class="swiper marquee-swiper">
        <div class="swiper-wrapper">
${destinations.map((d) => `          <div class="swiper-slide">${img(icon(d), d, 'class="footer-destination-icon"')}</div>`).join("\n")}
        </div>
      </div>
    </div>
    <div class="footer-content-wrapper wrapper">
      <div class="footer_left">
        <a href="/" class="logo-text-wrapper">
          <img class="logo-img" src="/images/brand/logo-white.svg" alt="${esc(s.name)}" width="180" height="92">
        </a>
        <p class="footer-tagline">${esc(C.home.intro.title)}</p>
        <div class="footer-social-wrapper">
          <p class="h5">Connect with ${esc(s.name)}</p>
          <div class="socials">
${s.socials.map((x) => `            <a class="link link--trans" href="${x.href}" target="_blank" rel="noopener">${esc(x.label)}</a>`).join("\n")}
          </div>
        </div>
      </div>
      <div class="footer_right">
        <div class="footer_contact">
          <p>${esc(s.address.replace(/ Wimbledon.*/, ""))}</p>
          <p>Wimbledon, United Kingdom SW19 3NW</p>
          <a class="link link--trans link--white" href="tel:${s.phone.replace(/\s/g, "")}">T. ${esc(s.phone)}</a>
          <a class="link link--trans link--white" href="mailto:${s.email}"><span>E.</span> <span>${esc(s.email)}</span></a>
        </div>
        <div class="footer-nav-wrapper">
          <div class="footer-primary-menu">
            <p class="footer-menu-title">Info</p>
            <ul class="menu">
              ${link("/aboutus", "About Us")}
              ${link("/services", "Services")}
              ${link("/pricing", "Pricing")}
              ${link("/terms", "T&C")}
              ${link("/privacy-policy", "Privacy Policy")}
            </ul>
          </div>
          <div class="footer-secondary-menu">
            <p class="footer-menu-title">Support</p>
            <ul class="menu">
              ${link("/contact", "Contact Us")}
              ${link("/faq", "FAQs")}
              ${link(s.community, "Visa Community")}
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom-wrapper wrapper">
      <div class="footer_bottom">
        <div class="copyright-info">2026 © ${esc(s.legalName)}</div>
        <div class="footer-bottom-links">
          <a href="/terms">Terms and Conditions</a>
          <div class="divider"></div>
          <a href="/privacy-policy">Privacy Policy</a>
        </div>
      </div>
    </div>
  </div>
</div>
`;
}

// ---------------------------------------------------------------- write

const pages = [
  { route: "/", slug: "home", render: homePage, bodyClass: "home page",
    title: `${C.site.name} – ${C.site.tagline}`, description: C.site.description },
  { route: "/aboutus", slug: "aboutus", render: aboutPage, bodyClass: "page page-about",
    title: `About Us – ${C.site.name}`, description: C.about.mission.text },
  { route: "/services", slug: "services", render: servicesPage, bodyClass: "page page-template-tmpl_concierge",
    title: `Our Services – ${C.site.name}`, description: C.services.intro },
  { route: "/pricing", slug: "pricing", render: pricingPage, bodyClass: "page page-template-tmpl_sustainability",
    title: `Our Pricing – ${C.site.name}`, description: C.pricing.intro },
  { route: "/faq", slug: "faq", render: faqPage, bodyClass: "page page-template-tmpl_faq", header: "dark",
    title: `FAQs – ${C.site.name}`, description: C.faq.intro },
  { route: "/contact", slug: "contact", render: contactPage, bodyClass: "page page-template-tmpl_contact", header: "dark",
    title: `Contact – ${C.site.name}`, description: C.home.enquire.text },
  { route: "/privacy-policy", slug: "privacy-policy", render: () => legalPage(C.privacy), bodyClass: "page page-template-tmpl_policy", header: "dark",
    title: `Privacy Policy – ${C.site.name}`, description: C.privacy.subtitle },
  { route: "/terms", slug: "terms", render: () => legalPage(C.terms), bodyClass: "page page-template-tmpl_policy", header: "dark",
    title: `Terms of Service – ${C.site.name}`, description: C.terms.subtitle },
];

fs.rmSync(OUT_PAGES, { recursive: true, force: true });
fs.mkdirSync(OUT_PAGES, { recursive: true });
fs.mkdirSync(OUT_PARTIALS, { recursive: true });

for (const p of pages) fs.writeFileSync(path.join(OUT_PAGES, `${p.slug}.html`), p.render());
fs.writeFileSync(path.join(OUT_PARTIALS, "footer.html"), footer());
fs.writeFileSync(
  path.join(ROOT, "src/content/pages.json"),
  JSON.stringify(
    pages.map(({ route, slug, title, description, bodyClass, header = "light" }) => ({ route, slug, title, description: description.slice(0, 300), ogImage: "/images/photos/lofoten-islands.webp", bodyClass, header })),
    null,
    2
  ) + "\n"
);
console.log(`built ${pages.length} pages`);
