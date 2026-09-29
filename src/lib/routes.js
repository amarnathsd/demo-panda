import { C } from "./content";

// Per-page settings. `bodyClass` feeds the theme CSS (it keys off page body
// classes); `header: "dark"` gives light-topped pages the dark header.
export const ROUTES = {
  "/": {
    bodyClass: "home page",
    title: `${C.site.name} – ${C.site.tagline}`,
    description: C.site.description,
  },
  "/aboutus": {
    bodyClass: "page page-about",
    title: `About Us – ${C.site.name}`,
    description: C.about.mission.text,
  },
  "/services": {
    bodyClass: "page page-template-tmpl_concierge",
    title: `Our Services – ${C.site.name}`,
    description: C.services.intro,
  },
  "/pricing": {
    bodyClass: "page page-template-tmpl_sustainability",
    title: `Our Pricing – ${C.site.name}`,
    description: C.pricing.intro,
  },
  "/faq": {
    bodyClass: "page page-template-tmpl_faq",
    header: "dark",
    title: `FAQs – ${C.site.name}`,
    description: C.faq.intro,
  },
  "/contact": {
    bodyClass: "page page-template-tmpl_contact",
    header: "dark",
    title: `Contact – ${C.site.name}`,
    description: C.home.enquire.text,
  },
  "/privacy-policy": {
    bodyClass: "page page-template-tmpl_policy",
    header: "dark",
    title: `Privacy Policy – ${C.site.name}`,
    description: C.privacy.subtitle,
  },
  "/terms": {
    bodyClass: "page page-template-tmpl_policy",
    header: "dark",
    title: `Terms of Service – ${C.site.name}`,
    description: C.terms.subtitle,
  },
};

export function pageMetadata(route) {
  const r = ROUTES[route];
  const description = r.description.slice(0, 300);
  return {
    title: r.title,
    description,
    openGraph: { title: r.title, description, images: ["/images/photos/lofoten-islands.webp"] },
  };
}
