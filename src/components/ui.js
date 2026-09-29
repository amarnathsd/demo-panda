import Link from "next/link";
import { isExternal, photo } from "@/lib/content";

// Internal links use the Next router; external ones open in a new tab.
export function SmartLink({ href, children, ...props }) {
  if (isExternal(href)) {
    const newTab = /^https?:/.test(href);
    return (
      <a href={href} {...(newTab ? { target: "_blank", rel: "noopener" } : {})} {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

export function ArrowIcon({ color = "#1a1a1a" }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="50.987" height="14.208" viewBox="0 0 50.987 14.208">
      <g transform="translate(-1143 -7586.331)">
        <g transform="translate(1164.072 7575.435)">
          <path d="M7.5,18H57.073" transform="translate(-28.573)" fill="none" stroke={color} strokeLinejoin="round" strokeWidth="2" />
          <path d="M18,7.5l6.4,6.4-6.4,6.4" transform="translate(4.103 4.103)" fill="none" stroke={color} strokeWidth="2" />
        </g>
      </g>
    </svg>
  );
}

export function CircleArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
      <g>
        <path d="M61.562,136.228A68.331,68.331,0,0,1,64.691,0" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
        <path
          d="M0,0A64.73,64.73,0,0,1,9.264,1.4a65.782,65.782,0,0,1,9.264,2.758,68.355,68.355,0,0,1,44.124,66.7c-1.34,34.091-28.238,62.064-61.791,65.261"
          transform="translate(73.956 0.132)"
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </g>
      <g transform="translate(68 87.038)">
        <path d="M7.5,18H57.073" transform="translate(-7.5 -11.603)" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
        <path d="M18,7.5l6.4,6.4-6.4,6.4" transform="translate(-18 -7.5)" fill="none" stroke="#ffffff" strokeLinecap="round" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function Img({ src, alt = "", ...props }) {
  // Plain <img>: the theme CSS and GSAP animations target these elements directly.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" decoding="async" {...props} />;
}

export function ArrowLink({ href, label, tone = "black" }) {
  return (
    <SmartLink href={href} className={`arrow_link ${tone}`}>
      <span>
        {label} <ArrowIcon color={tone === "white" ? "#fff" : "#1a1a1a"} />
      </span>
    </SmartLink>
  );
}

function Borders() {
  return (
    <>
      <span className="left_brd" />
      <span className="right_brd" />
      <span className="top_brd" />
      <span className="bottom_brd" />
    </>
  );
}

// Animated bordered button; `modal` opens a <dialog> (e.g. the request form).
export function ThemeButton({ label, href, modal, variant = "white" }) {
  if (modal) {
    return (
      <button
        data-aos="button"
        data-aos-once="true"
        className={`open_modal theme-btn theme-btn-animate--${variant}`}
        data-modal-id={modal}
      >
        {label} <Borders />
      </button>
    );
  }
  return (
    <SmartLink href={href} data-aos="button" data-aos-once="true" className={`theme-btn theme-btn-animate--${variant}`}>
      {label} <Borders />
    </SmartLink>
  );
}

export function Breadcrumbs({ label }) {
  return (
    <ul className="breadcrumbs" data-aos="fade-right" data-aos-duration="1300" data-aos-delay="300" data-aos-once="true">
      <li>
        <SmartLink href="/">Home</SmartLink>
      </li>
      <li>{label.toLowerCase()}</li>
    </ul>
  );
}

// Full-width closing banner with a parallax background image.
export function EnquireBanner({ image, title, button }) {
  return (
    <section id="default_enquire" data-section-scroll="">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo(image)} className="bg" alt="" decoding="async" />
      <div className="wrapper content-wrapper">
        <h3 data-animate-heading="">{title}</h3>
        <ThemeButton {...button} />
      </div>
    </section>
  );
}

// Big title slider (travel_experiences_slider).
export function BigSlider({ slides }) {
  return (
    <section id="travel_experiences_slider" data-post-page="">
      <div className="travel_swipe">
        <div className="swiper-wrapper">
          {slides.map((s) => (
            <div className="swiper-slide" data-bg={photo(s.bg)} key={s.title}>
              <div className="title" data-aos="zoom-in" data-aos-once="true" data-aos-duration="1200" data-aos-easing="ease-in-out">
                <h3 className="h1" data-animate-heading="">
                  {s.title}
                </h3>
              </div>
              <div className="image" data-aos-easing="ease-in-out">
                <p className="crystal white">{s.subtitle}</p>
                <Img src={photo(s.image)} alt={s.title} className="attachment-full size-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="swiper_controls">
        <div className="swiper-button-prev">
          <Img src="/theme/images/arrow_left.svg" alt="Previous" loading="eager" />
        </div>
        <div className="swiper-button-next">
          <Img src="/theme/images/arrow_right.svg" alt="Next" loading="eager" />
        </div>
      </div>
    </section>
  );
}
