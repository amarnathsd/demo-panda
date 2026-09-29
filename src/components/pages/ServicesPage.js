import { C, icon, photo } from "@/lib/content";
import { ArrowLink, Breadcrumbs, EnquireBanner, Img, SmartLink } from "@/components/ui";

const s = C.services;

const MEDIA = [
  ["center", "travelers-group.webp"],
  ["left_top", "traveler-passport.webp"],
  ["left_bottom", "global-reach.webp"],
  ["right_top", "visa-applications.webp"],
  ["right_bottom", "hot-air-balloon.webp"],
];

function Featured() {
  return (
    <section id="concierge_page_featured">
      <div className="background-img bg-container" style={{ backgroundImage: `url('${photo("lofoten-islands.webp")}')` }}>
        <div className="wrapper center-content">
          <div className="stacking-content">
            <div className="image" data-clip-image="">
              <Img src={photo("book-now.webp")} alt="Traveller" className="attachment-full size-full" loading="eager" data-speed="clamp(1.3)" />
            </div>
            <h1 className="section-heading" data-animate-heading="">
              Our Services
            </h1>
          </div>
          <span className="small_sub_text white" data-speed="clamp(1.2)">
            &amp; Seamless Visa Solutions
          </span>
        </div>
        <span className="featured-vertical-text white" data-speed="1.1">
          TRAVEL BOLDLY
        </span>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section id="concierge_page_about">
      <Breadcrumbs label="services" />
      <div className="wrapper">
        <div className="first-item">
          <h2 className="section-heading" data-animate-heading="">
            Your Partner in Seamless Visa Solutions
          </h2>
          <div className="image image-scaled background-img" style={{ backgroundImage: `url('${photo("our-vision.webp")}')` }} />
        </div>
        <div className="second-item">
          <span className="subtitle">THE FLYING PANDA</span>
          <h2 className="section-heading" data-animate-heading="">
            SIMPLIFIES
          </h2>
          <span className="subtext">
            VISA APPOINTMENTS
            <br />
            DOCUMENTATION
            <br />
            REAL-TIME UPDATES
          </span>
        </div>
        <ul className="third-item media-wrapper list-none">
          {MEDIA.map(([pos, p]) => (
            <li className={`media ${pos}`} key={pos}>
              <Img src={photo(p)} className="attachment-full size-full" />
            </li>
          ))}
        </ul>
        <div className="column column__left">
          <h2 className="secondary-heading" data-animate-heading="" data-speed="clamp(1.1)">
            YOUR JOURNEY
            <br />
            OUR EXPERTISE
          </h2>
        </div>
      </div>
    </section>
  );
}

function Purpose() {
  return (
    <section id="concierge_page_purpose" data-speed="clamp(1.1)">
      <div className="text-wrapper">
        <div className="readmore-wrapper" data-aos="fade" data-aos-duration="1300" data-aos-delay="300" data-aos-once="true">
          <div className="maintext-paragraph">
            <p>{s.intro}</p>
            <p>{" "}</p>
            <p>{C.home.whatWeDo.text}</p>
          </div>
        </div>
      </div>
      <SmartLink href="/contact" className="theme-btn theme-btn-after--black">
        Let’s Connect
      </SmartLink>
    </section>
  );
}

// Service list as tabs: titles on the left, icon + description on the right.
function ServiceTabs() {
  return (
    <section id="concierge_page_how_it_works">
      <h2 className="section-heading" data-animate-heading="">
        {s.title}
      </h2>
      <div className="wrapper two-columns" data-aos="custom">
        <ul className="column-left list-none">
          {s.items.map((it, i) => (
            <li data-index={i} data-aos="fade-up" data-aos-duration="400" data-aos-once="true" key={it.title}>
              <button>{it.title}</button>
            </li>
          ))}
        </ul>
        <div className="column-right stacking-content">
          {s.items.map((it, i) => (
            <div className="content" data-index={i} key={it.title}>
              <Img src={icon(it.icon)} alt={it.title} width="120" height="140" />
              <p>{it.text}</p>
              {it.note && <p className="service-note">{it.note}</p>}
              {it.icon === "notifications" && (
                <p>
                  <ArrowLink href={C.site.notificationGroup} label={s.notificationCta} />
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Featured />
      <Intro />
      <Purpose />
      <ServiceTabs />
      <EnquireBanner image="travelers-group.webp" title="NEED HELP WITH YOUR VISA?" button={{ label: "ENQUIRE", href: "/contact" }} />
    </>
  );
}
