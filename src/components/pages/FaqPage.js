import { C, icon, pad } from "@/lib/content";
import { EnquireBanner, Img, SmartLink } from "@/components/ui";

const f = C.faq;
const TOTAL = f.groups.reduce((n, g) => n + g.items.length, 0);

// Category rail pinned beside the questions; behaviour lives in lib/site/faq.js.
function CategoryNav() {
  return (
    <aside className="faq-nav" data-faq-nav="">
      <div className="faq-nav__inner">
        <label className="faq-search">
          <span className="sr-only">Search the FAQ</span>
          <input type="search" placeholder={`Search ${TOTAL} questions`} autoComplete="off" data-faq-search="" />
        </label>
        <p className="faq-nav__label">Categories</p>
        <ol className="faq-nav__list">
          {f.groups.map((g, i) => (
            <li key={g.icon}>
              <a className={`faq-nav__item${i === 0 ? " is-active" : ""}`} href={`#${g.icon}`} data-faq-target={g.icon}>
                <span className="faq-nav__num">{pad(i + 1)}</span>
                <Img className="faq-nav__icon" src={icon(g.icon)} width="36" height="36" loading="eager" />
                <span className="faq-nav__name">{g.title}</span>
                <span className="faq-nav__count" data-faq-count="">
                  {g.items.length}
                </span>
                <span className="faq-nav__progress" aria-hidden="true">
                  <i />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

function Question({ q, a }) {
  return (
    <div className="faq-link" data-accordion-item="">
      <div className="faq-question-wrapper" data-accordion-header="">
        <h3 className="text-heading">{q}</h3>
        <div className="faq-arrow-wrapper">
          <Img className="faq-arrow" src="/theme/images/black-chevron.svg" loading="eager" />
        </div>
      </div>
      <div className="faq-answer-wrapper" data-accordion-inner="">
        <div className="faq-answer">
          <p>{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <>
      <section id="faq-content" className="wrapper faq-board">
        <h1 className="text-center" data-animate-heading="">
          FAQ
        </h1>
        <p className="faq-intro text-center">
          {f.title} {f.intro}
        </p>
        <div className="faq-board__layout" data-faq-board="">
          <CategoryNav />
          <div className="faq-board__list">
            <p className="faq-empty" data-faq-empty="" hidden>
              No questions match your search. <SmartLink href="/contact">Ask us directly</SmartLink>.
            </p>
            {f.groups.map((g, i) => (
              <div className="faq-group" id={g.icon} data-faq-group={g.icon} key={g.icon}>
                <h2 className="faq-group__title">
                  <span className="faq-group__num">{pad(i + 1)}</span> {g.title}
                </h2>
                <div className="faq-wrapper" data-component="accordion">
                  {g.items.map((it) => (
                    <Question key={it.q} q={it.q} a={it.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <EnquireBanner
        image="global-reach.webp"
        title="DIDN’T FIND WHAT YOU WERE LOOKING FOR?"
        button={{ label: "CONTACT US", href: "/contact" }}
      />
    </>
  );
}
