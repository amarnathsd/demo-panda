import BodyClass from "./BodyClass";

// Renders a page's HTML exactly as the theme expects it. The markup is not
// managed by React, so GSAP/Swiper can mutate it freely (see SiteEffects).
export default function PageContent({ html, bodyClass, header }) {
  return (
    <>
      <BodyClass className={bodyClass} header={header} />
      <main id="main" className="site-main" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
