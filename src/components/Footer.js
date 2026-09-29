import { C, icon, streetAddress, tel } from "@/lib/content";
import { Img, SmartLink } from "@/components/ui";

const s = C.site;
const DESTINATION_ICONS = ["schengen", "us", "uk", "canada", "australia", "new-zealand", "visa"];

const INFO_LINKS = [
  { href: "/aboutus", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/terms", label: "T&C" },
  { href: "/privacy-policy", label: "Privacy Policy" },
];

const SUPPORT_LINKS = [
  { href: "/contact", label: "Contact Us" },
  { href: "/faq", label: "FAQs" },
  { href: s.community, label: "Visa Community" },
];

function Menu({ title, links, className }) {
  return (
    <div className={className}>
      <p className="footer-menu-title">{title}</p>
      <ul className="menu">
        {links.map((l) => (
          <li className="menu-item" key={l.href}>
            <SmartLink href={l.href} className="link link--trans link--white">
              {l.label}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="site-footer" data-hide-elements="">
      <div className="container-boxed site-footer__container text-center">
        <div className="footer_wrapper" data-aos="fade-up" data-aos-duration="1000" data-aos-delay="400">
          <div className="footer-banner-wrapper">
            <div className="swiper marquee-swiper">
              <div className="swiper-wrapper">
                {DESTINATION_ICONS.map((d) => (
                  <div className="swiper-slide" key={d}>
                    <Img src={icon(d)} alt={d} className="footer-destination-icon" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="footer-content-wrapper wrapper">
            <div className="footer_left">
              <SmartLink href="/" className="logo-text-wrapper">
                <Img className="logo-img" src="/images/brand/logo-white.svg" alt={s.name} width="180" height="92" />
              </SmartLink>
              <p className="footer-tagline">{C.home.intro.title}</p>
              <div className="footer-social-wrapper">
                <p className="h5">Connect with {s.name}</p>
                <div className="socials">
                  {s.socials.map((x) => (
                    <SmartLink className="link link--trans" href={x.href} key={x.label}>
                      {x.label}
                    </SmartLink>
                  ))}
                </div>
              </div>
            </div>

            <div className="footer_right">
              <div className="footer_contact">
                <p>{streetAddress()}</p>
                <p>Wimbledon, United Kingdom SW19 3NW</p>
                <a className="link link--trans link--white" href={tel(s.phone)}>
                  T. {s.phone}
                </a>
                <a className="link link--trans link--white" href={`mailto:${s.email}`}>
                  <span>E.</span> <span>{s.email}</span>
                </a>
              </div>
              <div className="footer-nav-wrapper">
                <Menu title="Info" links={INFO_LINKS} className="footer-primary-menu" />
                <Menu title="Support" links={SUPPORT_LINKS} className="footer-secondary-menu" />
              </div>
            </div>
          </div>

          <div className="footer-bottom-wrapper wrapper">
            <div className="footer_bottom">
              <div className="copyright-info">2026 © {s.legalName}</div>
              <div className="footer-bottom-links">
                <SmartLink href="/terms">Terms and Conditions</SmartLink>
                <div className="divider" />
                <SmartLink href="/privacy-policy">Privacy Policy</SmartLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
