import { Fragment } from "react";
import { C, photo } from "@/lib/content";
import { Breadcrumbs, EnquireBanner, Img } from "@/components/ui";

const p = C.pricing;

export default function PricingPage() {
  return (
    <>
      <section id="sustainability-featured">
        <Img src={photo("pricing.webp")} alt={p.title} className="attachment-full size-full" loading="eager" fetchPriority="high" />
        <h1 data-animate-heading="">Our Pricing</h1>
      </section>

      <section id="sustainability-intro" className="wrapper">
        <Breadcrumbs label="pricing" />
        <h2 className="h3" data-animate-heading="">
          TRANSPARENT AND
          <br />
          FLEXIBLE PRICING
        </h2>
        <div className="intro-content" data-speed="clamp(0.9)">
          <Img src={photo("traveler-passport.webp")} alt={p.title} className="attachment-full size-full" />
          <div className="text">
            <p>{p.intro}</p>
            <p>
              <strong>{p.appointments.title}</strong>
            </p>
            <p>{p.appointments.text}</p>
          </div>
        </div>
      </section>

      <section id="sustainability-banner" style={{ backgroundImage: `url('${photo("lofoten-islands.webp")}')` }}>
        <p className="h5 wrapper" data-speed="clamp(0.9)">
          {p.appointments.title} — PRICED BY APPLICATION COUNTRY, CITIZENSHIP AND DESTINATION.
        </p>
      </section>

      <section id="content-default" className="wrapper pricing-list">
        <p className="text-center subtitle">{p.title}</p>
        {p.items.map((it) => (
          <Fragment key={it.title}>
            <h3>{it.title}</h3>
            <p>{it.text}</p>
          </Fragment>
        ))}
      </section>

      <EnquireBanner image="our-vision.webp" title="GET A TAILORED QUOTE" button={{ label: "ENQUIRE", modal: "request" }} />
    </>
  );
}
