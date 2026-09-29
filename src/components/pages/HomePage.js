import { C, firstSentences, icon, pad, photo } from "@/lib/content";
import { ArrowIcon, ArrowLink, BigSlider, Img, SmartLink, ThemeButton } from "@/components/ui";

const h = C.home;

const VISA_SERVICES = C.services.items.slice(0, 5);
const VISA_IMAGES = [
  ["traveler-passport.webp", "visa-applications.webp"],
  ["visa-applications.webp", "commitment.webp"],
  ["team-growth.webp", "clients-assisted.webp"],
  ["global-reach.webp", "our-vision.webp"],
  ["book-now.webp", "travelers-group.webp"],
];

const TRAVEL_SERVICES = C.services.items.slice(5, 9);
const TRAVEL_IMAGES = [
  ["global-reach.webp", "hot-air-balloon.webp"],
  ["lofoten-islands.webp", "our-vision.webp"],
  ["travelers-group.webp", "nationalities.webp"],
  ["visa-applications.webp", "traveler-passport.webp"],
];

const STAT_IMAGES = ["travelers-group.webp", "milestones.webp", "clients-assisted.webp", "nationalities.webp"];

const DESTINATIONS = C.faq.groups.slice(0, 4);
const DESTINATION_BACKGROUNDS = ["our-vision.webp", "global-reach.webp", "lofoten-islands.webp", "hot-air-balloon.webp"];

const REVIEWS = h.testimonials.items.filter((t) => t.text.length > 60 && t.text.length < 420).slice(0, 8);

const TILES = [
  { href: "/pricing", label: "OUR PRICING", image: "pricing.webp" },
  { href: "/faq", label: "VISA FAQS", image: "visa-applications.webp" },
];

// "HOTEL & TRAVEL BOOKINGS" -> "HOTEL &" / "TRAVEL BOOKINGS"
function TwoLine({ text, words = 2 }) {
  const w = text.toUpperCase().split(" ");
  if (w.length <= words) return w.join(" ");
  return (
    <>
      {w.slice(0, words).join(" ")}
      <br />
      {w.slice(words).join(" ")}
    </>
  );
}

function Hero() {
  return (
    <section id="home_featured">
      <div className="featured_background">
        <Img className="featured-media" src={photo("lofoten-islands.webp")} loading="eager" fetchPriority="high" />
        <div className="title">
          <h1>TRAVEL BOLDLY</h1>
        </div>
        <div className="btn-wrapper">
          <ThemeButton label={h.hero.cta.toUpperCase()} modal="request" />
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="home_about">
      <div className="home_about_wrapper">
        <div className="image" data-aos="custom">
          <Img src={photo("traveler-passport.webp")} alt="Traveler with passport" className="home-about-img" />
        </div>
        <div className="info">
          <div className="title">
            <h2 data-animate-heading="">
              YOUR PARTNER IN
              <br />
              SEAMLESS VISA SOLUTIONS
            </h2>
          </div>
          <div className="text" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="500" data-aos-once="true">
            <p>{h.intro.text}</p>
            <p>{h.whatWeDo.text}</p>
            <ArrowLink href="/aboutus" label={h.whatWeDo.cta} tone="white" />
          </div>
        </div>
      </div>
    </section>
  );
}

// Pinned dark band: heading + six reason cards (animated in lib/site/animations.js).
function WhyChooseUs() {
  return (
    <section id="home_agents" className="home-why">
      <div className="home_agents">
        <div className="info" data-aos="zoom-out" data-aos-duration="1500" data-aos-delay="200" data-aos-once="true">
          <div className="title">
            <h2 className="h1">{h.whyChooseUs.title}</h2>
          </div>
          <div className="text">
            <p>{h.whyChooseUs.intro}</p>
          </div>
        </div>
        <ul className="why-grid">
          {h.whyChooseUs.items.map((w, i) => (
            <li className="why-card" key={w.title}>
              <span className="why-card__num">{pad(i + 1)}</span>
              <Img className="why-card__icon" src={icon(w.icon)} width="52" height="52" />
              <h3 className="why-card__title">{w.title}</h3>
              <p className="why-card__text">{w.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stats() {
  return (
    <BigSlider
      slides={h.stats.map((s, i) => ({
        title: `${s.value.toLocaleString("en-GB")}${s.suffix} ${s.label}`.toUpperCase(),
        subtitle: h.whyChooseUs.items[i].title,
        bg: STAT_IMAGES[i],
        image: STAT_IMAGES[i],
      }))}
    />
  );
}

function VisaServices() {
  return (
    <section id="home_accommodation" data-cursor="DRAG">
      <div className="swiper accommodation_swipe">
        <div className="swiper-wrapper">
          {VISA_SERVICES.map((s, i) => (
            <div className="swiper-slide" key={s.title}>
              <div className="left">
                <p data-aos="fade-left" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
                  OUR SERVICES
                </p>
                <h2 className="h1" data-animate-heading="" data-aos="fade-up" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
                  VISA
                  <br />
                  SOLUTIONS
                </h2>
                <div className="image" data-speed="clamp(0.95)">
                  <Img src={photo(VISA_IMAGES[i][0])} alt={s.title} className="attachment-full size-full" />
                </div>
              </div>
              <div className="right">
                <div className="image" data-speed="clamp(1.3)">
                  <Img src={photo(VISA_IMAGES[i][1])} alt={s.title} className="attachment-full size-full" />
                </div>
                <h3 className="h4" data-animate-heading="">
                  {s.title}
                </h3>
                <div className="text">
                  <p>{firstSentences(s.text, 2)}</p>
                </div>
                <ArrowLink href="/services" label="Discover" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="navigation">
        <div className="swiper-button-prev acc-nav">Previous</div>
        <div className="swiper-button-next acc-nav">Next</div>
      </div>
      <SmartLink
        href="/services"
        className="underline-link"
        style={{ textAlign: "center", alignSelf: "center", display: "block", color: "#1a1a1a", margin: "8vh auto" }}
      >
        <span>Discover All</span>
      </SmartLink>
    </section>
  );
}

function TravelServices() {
  return (
    <section id="home_tours">
      <div className="wrapper">
        <div className="navigation">
          <div className="swiper-button-prev tour-nav">Previous</div>
          <div className="swiper-button-next tour-nav">Next</div>
        </div>
        <div className="wrapper swiper-pagination" data-aos="fade-right" data-aos-duration="1200" data-aos-easing="ease-in-out" data-aos-once="true" />
        <div className="swiper experiences_home_swipe" data-cursor="DRAG">
          <div className="swiper-wrapper">
            {TRAVEL_SERVICES.map((s, i) => (
              <div className="swiper-slide" key={s.title}>
                <div className="left">
                  <div className="image" data-speed="clamp(0.8)">
                    <Img src={photo(TRAVEL_IMAGES[i][0])} alt={s.title} className="attachment-full size-full" />
                  </div>
                  <div className="text">
                    <h2 data-animate-heading="">Travel Services</h2>
                    <div className="info" data-speed="clamp(1.15)">
                      <h3 data-animate-heading="">
                        <TwoLine text={s.title} />
                      </h3>
                      <p>{firstSentences(s.text, 2)}</p>
                      <ArrowLink href="/services" label="Discover" tone="white" />
                    </div>
                  </div>
                </div>
                <div className="right">
                  <Img src={photo(TRAVEL_IMAGES[i][1])} alt={s.title} className="attachment-full size-full" />
                  <Img
                    src={photo(TRAVEL_IMAGES[(i + 1) % TRAVEL_IMAGES.length][0])}
                    alt={s.title}
                    className="small-middle"
                    data-speed="clamp(0.6)"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SlotTracker() {
  return (
    <section id="home_custom_holidays">
      <Img src={photo("book-now.webp")} alt="Traveller" className="image_right" data-speed="clamp(1.2)" />
      <div className="wrapper">
        <p className="subtitle">{h.tracker.text.toUpperCase()}</p>
        <div className="info">
          <div className="image">
            <h2 className="h1" data-animate-heading="" data-speed="clamp(0.8)" style={{ zIndex: 1 }}>
              SCHENGEN SLOTS
            </h2>
            <Img src={photo("calendar.png")} alt="Calendar" />
          </div>
          <div className="text">
            <p>
              {h.tracker.title}. {C.services.items[9].text}
            </p>
            <div className="link_center" data-aos="fade-up" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
              <ArrowLink href={C.site.notificationGroup} label={h.tracker.cta} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Destinations() {
  return (
    <section id="default_destination">
      <h2 className="section-heading">
        <SmartLink href="/faq">Visa guides by destination</SmartLink>
      </h2>
      <div className="wrapper">
        <div className="default-bg background-img" style={{ backgroundImage: `url('${photo("travelers-group.webp")}')` }} />
        {DESTINATIONS.map((g, i) => (
          <div
            key={g.icon}
            className="image-container background-img"
            style={{ backgroundImage: `url('${photo(DESTINATION_BACKGROUNDS[i])}')` }}
          />
        ))}
        <div className="heading-wrappers">
          {DESTINATIONS.map((g) => (
            <h3 className="post-title" key={g.icon}>
              <SmartLink href={`/faq#${g.icon}`}>{g.title.replace(/ Visa.*$/, "").toUpperCase()}</SmartLink>
            </h3>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tiles() {
  return (
    <section id="home_services">
      <div className="services_wrapper">
        {TILES.map((t) => (
          <div className="service" data-aos="zoom-in" data-aos-once="true" data-aos-duration="1000" key={t.href}>
            <SmartLink href={t.href}>
              <h2 data-animate-heading="">
                {t.label} <ArrowIcon color="#fff" />
              </h2>
              <Img src={photo(t.image)} alt={t.label} className="attachment-full size-full" />
            </SmartLink>
          </div>
        ))}
      </div>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reviews" data-aos="svg-dash-animate" data-aos-once="true" data-color="#efefef">
      <div className="reviews-swiper" data-aos="custom" data-aos-once="true">
        <h3 className="section-heading" data-animate-heading="">
          {h.testimonials.title}
        </h3>
        <div className="swiper-wrapper">
          {REVIEWS.map((r) => (
            <div className="swiper-slide" key={r.name + r.title}>
              <div className="single-review-item">
                <p className="review-text">“{r.text}”</p>
                <span className="author-name">
                  {r.name} — {r.title}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination" />
        <div className="swiper-arrow-prev">
          <ArrowIcon color="#000" />
        </div>
        <div className="swiper-arrow-next">
          <ArrowIcon color="#000" />
        </div>
      </div>
      <p className="reviews-source">
        <SmartLink href={C.site.trustpilot}>★★★★★ Check what customers say about us on Trustpilot</SmartLink>
      </p>
    </section>
  );
}

function OurStory() {
  return (
    <section id="home_travel_stories">
      <div className="home_travel_wrapper" data-aos="custom" data-aos-anchor-placement="top-center">
        <div className="image">
          <Img src={photo("commitment.webp")} alt="Our commitment" className="attachment-full size-full" />
        </div>
        <div className="info" data-speed="clamp(0.8)">
          <div className="title">
            <h2>Our</h2>
            <span />
            <h2>Story</h2>
          </div>
          <SmartLink href="/aboutus" className="link">
            Discover more
          </SmartLink>
        </div>
      </div>
    </section>
  );
}

function Enquire() {
  const line = `${h.enquire.title.toUpperCase()}. ${h.enquire.title.toUpperCase()}.`;
  return (
    <section id="home_enquire">
      <div className="home_enquire">
        <div className="marquee_wrapper">
          <div className="marquee_left">
            <p>{line}</p>
          </div>
          <div className="marquee_right">
            <p>{line}</p>
          </div>
        </div>
        <ThemeButton label="ENQUIRE" href="/contact" variant="gold" />
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <WhyChooseUs />
      <Stats />
      <VisaServices />
      <TravelServices />
      <SlotTracker />
      <Destinations />
      <Tiles />
      <Reviews />
      <OurStory />
      <Enquire />
    </>
  );
}
