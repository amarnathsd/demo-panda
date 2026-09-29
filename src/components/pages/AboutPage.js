import { C, firstSentences, photo } from "@/lib/content";
import { CircleArrow, EnquireBanner, Img } from "@/components/ui";

const a = C.about;
const story = a.story.paragraphs;
const VALUE_IMAGES = ["milestones.webp", "our-vision.webp", "global-reach.webp"];

function Featured() {
  return (
    <section id="about_featured">
      <div className="featured_background">
        <div className="image" data-speed="clamp(1.2)">
          <Img
            src={photo("hot-air-balloon.webp")}
            alt="Hot air balloons"
            className="attachment-full size-full"
            loading="eager"
            data-aos="fade-up"
            data-aos-duration="1200"
          />
        </div>
        <div className="title">
          <div className="marquee_wrapper">
            <div className="marquee_title">
              <h1>{Array(5).fill("ABOUT US").join(" ")}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Story, mission, vision and commitment (theme "who we are" layout).
function Story() {
  return (
    <section id="whoweare_about">
      <div className="whoweare_about">
        <h2 className="h1" data-speed="clamp(0.6)">
          OUR
          <br />
          STORY
        </h2>
        <div className="whoweare_featured_div">
          <div className="image image_top" style={{ backgroundImage: `url('${photo("lofoten-islands.webp")}')` }} />
          <div className="image image_bottom" style={{ backgroundImage: `url('${photo("lofoten-islands.webp")}')` }} />
        </div>
        <div className="whoweare_team_about">
          <h3>
            From a three-month wait
            <br />
            to a simple, powerful
            <br />
            solution
          </h3>
          <div className="team_overview">
            <div className="team_left" data-speed="clamp(1)">
              <Img src={photo("team-growth.webp")} alt="Our team" className="attachment-full size-full" />
            </div>
            <div className="team_right" data-speed="clamp(1.3)">
              <Img src={photo("visa-applications.webp")} alt="Visa application" className="attachment-full size-full" />
            </div>
          </div>
          <div className="text">
            <h3>{a.story.title}</h3>
            {story.slice(0, 2).map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="whoweare_snami_origin" data-aos="custom" data-aos-anchor-placement="top-center" data-aos-once="true">
        <div className="image">
          <Img src={photo("our-vision.webp")} alt="Our mission" className="attachment-full size-full" />
        </div>
        <div className="info" data-speed="clamp(0.8)">
          <div className="title">
            <h3>{a.mission.title}</h3>
          </div>
          <div className="text">
            <p>{a.mission.text}</p>
          </div>
        </div>
      </div>

      <div className="whoweare_cotraveler">
        <h2 className="h3">{a.vision.title}</h2>
        <div className="cotraveler_info">
          <div className="left">
            <h3 className="h4">
              Travel should be
              <br />
              accessible to all.
            </h3>
            <Img src={photo("global-reach.webp")} alt="Global reach" className="attachment-full size-full" />
          </div>
          <div className="right">
            <Img src={photo("travelers-group.webp")} alt="Travelers" className="attachment-full size-full" data-speed="clamp(1.5)" />
            <div className="text">
              <p>{a.vision.text}</p>
              {story[2] && <p>{story[2]}</p>}
            </div>
          </div>
        </div>
        <div className="big_text" data-aos="custom" data-aos-once="true">
          <p>TRAVEL</p>
          <p>BOLDLY</p>
        </div>
      </div>

      <div className="whoweare_dreams" data-aos="custom" data-aos-anchor-placement="10% 50%">
        <h2 className="h3">{a.commitment.title}</h2>
        <div className="image">
          <p className="h1" data-speed="clamp(1.1)" data-animate-heading="">
            Every step
            <br />
            of the way
          </p>
          <Img src={photo("commitment.webp")} alt="Our commitment" className="attachment-full size-full" />
        </div>
        <div className="text">
          {a.commitment.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

// Values: fade slider with tabs + "01 / 03" pagination.
function Values() {
  return (
    <section id="principles_about">
      <div className="principles_wrapper">
        <div className="heading-wrapper">
          <h2 className="section-heading">{a.values.title}</h2>
          <span className="subtitle">
            <p>{C.home.whyChooseUs.outro}</p>
          </span>
        </div>
        <div className="swiper customSwiper not-playing moveswiper">
          <div className="content">
            <div className="stacking-content title-wrapper">
              {a.values.items.map((v, i) => (
                <div data-swiper-index={i} className={i === 0 ? "active" : undefined} key={v.title}>
                  <h2 className="section-heading">{v.title}</h2>
                  <span>{firstSentences(v.text, 1)}</span>
                </div>
              ))}
            </div>
            <div className="three-columns-wrapper">
              <div className="navigation-area">
                <div className="navigation-buttons">
                  <div className="button-prev">
                    <CircleArrow />
                  </div>
                  <div className="button-next">
                    <CircleArrow />
                  </div>
                </div>
              </div>
              <div className="stacking-content paragraph-wrapper">
                {a.values.items.map((v, i) => (
                  <div data-swiper-index={i} className={i === 0 ? "active" : undefined} key={v.title}>
                    <p>{v.text}</p>
                  </div>
                ))}
              </div>
              <div className="swiper-pagination" />
            </div>
          </div>
          <div className="swiper-wrapper">
            {VALUE_IMAGES.map((p, i) => (
              <div className="swiper-slide" key={p}>
                <Img src={photo(p)} alt={a.values.items[i].title} className="attachment-full size-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Milestones() {
  return (
    <section id="about_team" data-color="#efefef">
      <h2 className="section-heading text-center">{a.milestones.title}</h2>
      <p className="about-team-intro">{a.milestones.intro}</p>
      <div className="wrapper">
        <div className="swiper agents-swiper">
          <div className="floating-marquee" data-speed="clamp(1.1)">
            <div className="wrapperRollingText">
              <div className="rollingText text">EXCELLENCE · INNOVATION · A CLIENT-FIRST APPROACH</div>
            </div>
          </div>
          <div className="swiper-wrapper">
            {a.milestones.items.map((m) => (
              <div className="swiper-slide" key={m.title}>
                <Img src={photo(`${m.image}.webp`)} alt={m.title} className="agent-photo" />
                <span className="agent-name">{m.title}</span>
                <div data-animate-text="">
                  <p className="agent-excerpt">{m.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="about-team-intro">{a.milestones.outro}</p>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Featured />
      <Story />
      <Values />
      <Milestones />
      <EnquireBanner image="milestones.webp" title="READY TO TRAVEL BOLDLY?" button={{ label: "ENQUIRE", href: "/contact" }} />
    </>
  );
}
