import { Fragment } from "react";
import { C, photo, streetAddress, tel } from "@/lib/content";
import { ArrowIcon, Img, SmartLink } from "@/components/ui";

const s = C.site;
const DESTINATIONS = C.faq.groups.filter((g) => g.icon !== "visa").map((g) => g.title);

function Field({ id, label, required = true, hideLabel = false, children }) {
  return (
    <div className="field-holder">
      <label htmlFor={id} hidden={hideLabel}>
        {label}
        {required && <span className="req">*</span>}
      </label>
      <span className="wpcf7-form-control-wrap">{children}</span>
    </div>
  );
}

function TextInput({ id, name, type, placeholder }) {
  return (
    <input className="wpcf7-form-control wpcf7-text" id={id} name={name} type={type} placeholder={placeholder} required />
  );
}

function Featured() {
  return (
    <section id="contact_page_featured">
      <div className="featured-marquee">
        <h1 className="featured-marquee__text" data-direction="ltr">
          {Array.from({ length: 4 }, (_, i) => (
            <Fragment key={i}>
              <span className="gap" />
              Contact
            </Fragment>
          ))}
        </h1>
      </div>
      <div className="wrapper content-wrapper">
        <ul className="info-left list-none" data-aos="fade-right" data-aos-duration="1400" data-aos-delay="500">
          <li>
            {streetAddress()}
            <br />
            Wimbledon, United Kingdom
            <br />
            SW19 3NW
          </li>
        </ul>
        <div className="image" data-speed="clamp(1.4)">
          <Img
            src={photo("traveler-passport.webp")}
            alt="Traveler with passport"
            className="img vertical"
            loading="eager"
            data-aos="custom"
            data-aos-duration="1400"
          />
          <div className="info-right wysiwyg-content" data-aos="fade-left" data-aos-duration="1400" data-aos-delay="500">
            <ul>
              <li>
                <a href={tel(s.phone)}>T. {s.phone}</a>
              </li>
              <li>
                <a href={`mailto:${s.email}`}>E. {s.email}</a>
              </li>
              <li>
                <SmartLink href={s.whatsapp}>WhatsApp</SmartLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// Submitted by the delegated handler in lib/site/interactions.js (contactForms).
function EnquiryForm() {
  return (
    <section id="contact_page_form">
      <div className="wrapper">
        <div id="ContactUsForm" className="animated-heading text-center" data-aos="fade-up" data-aos-duration="1400" data-aos-delay="500">
          <h2 data-animate-heading="" className="form_heading">
            {C.home.enquire.title}
          </h2>
          <p className="contact-intro">{C.home.enquire.text}</p>
          <div className="wpcf7">
            <form className="wpcf7-form" data-contact-form="" noValidate>
              <div className="two-input-wrapper">
                <Field id="fullnamefield" label="FULL NAME">
                  <TextInput id="fullnamefield" name="name" type="text" placeholder="FULL NAME" />
                </Field>
                <Field id="emailfield" label="EMAIL">
                  <TextInput id="emailfield" name="email" type="email" placeholder="EMAIL ADDRESS" />
                </Field>
              </div>
              <div className="two-input-wrapper">
                <Field id="telephonefield" label="CONTACT NUMBER">
                  <TextInput id="telephonefield" name="mobile" type="tel" placeholder="CONTACT NUMBER" />
                </Field>
                <Field id="destinationfield" label="DESTINATION" required={false} hideLabel>
                  <select className="wpcf7-form-control wpcf7-select" id="destinationfield" name="destination" defaultValue="">
                    <option value="">Where are you going?</option>
                    {[...DESTINATIONS, "Other"].map((d) => (
                      <option value={d} key={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <div className="one-input-wrapper">
                <Field id="messagefield" label="MESSAGE">
                  <textarea
                    className="wpcf7-form-control wpcf7-textarea"
                    id="messagefield"
                    name="message"
                    rows={6}
                    placeholder="TYPE YOUR MESSAGE HERE"
                    required
                  />
                </Field>
              </div>
              <button type="submit" className="page-link arrow-anim">
                <span>SUBMIT</span> <ArrowIcon />
              </button>
              <p className="contact-form__message" role="status" />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ContactPage() {
  return (
    <>
      <Featured />
      <EnquiryForm />
    </>
  );
}
