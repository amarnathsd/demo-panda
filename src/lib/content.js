// Site content (text extracted from The Flying Panda) and small helpers used by the page components.
import content from "@/content/panda-content.json";

export const C = content;

export const photo = (name) => `/images/photos/${name}`;
export const icon = (name) => `/images/icons/${name}.${name === "reliability" ? "webp" : "svg"}`;

export const firstSentences = (text, n = 2) =>
  (text.match(/[^.!?]+[.!?]+/g) ?? [text]).slice(0, n).join(" ").trim();

export const pad = (n) => String(n).padStart(2, "0");

export const isExternal = (href) => /^(https?:|mailto:|tel:)/.test(href);

export const tel = (phone) => `tel:${phone.replace(/\s/g, "")}`;

// "The Long Lodge 265-269 Kingston Road" (the address without town/postcode)
export const streetAddress = () => content.site.address.replace(/ Wimbledon.*/, "");
