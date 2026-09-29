// Shared site data used by the React-rendered chrome (header, request dialog).
import content from "@/content/panda-content.json";

const { site } = content;

export const SITE_NAME = site.name;
export const PHONE = site.phone;
export const EMAIL = site.email;
export const WHATSAPP = site.whatsapp;
export const COMMUNITY = site.community;
export const SOCIALS = site.socials;

export const MAIN_MENU = [
  { label: "About Us", href: "/aboutus", image: "/images/photos/hot-air-balloon.webp" },
  { label: "Services", href: "/services", image: "/images/photos/lofoten-islands.webp" },
  { label: "Pricing", href: "/pricing", image: "/images/photos/pricing.webp" },
  { label: "FAQs", href: "/faq", image: "/images/photos/our-vision.webp" },
  { label: "Contact", href: "/contact", image: "/images/photos/traveler-passport.webp" },
];

export const SECONDARY_MENU = [
  { label: "Visa Community", href: COMMUNITY, external: true },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy-policy" },
];

// Options for the enquiry form (destinations from the FAQ groups, services list).
export const DESTINATIONS = content.faq.groups.filter((g) => g.icon !== "visa").map((g) => g.title);
export const SERVICES = content.services.items.map((s) =>
  s.title.toLowerCase().replace(/(^|[\s/&])\w/g, (m) => m.toUpperCase())
);
export const GET_STARTED = content.home.getStarted;
