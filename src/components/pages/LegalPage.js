import { C } from "@/lib/content";

// Group consecutive list items into <ul>s; section headings become <h2>.
function toBlocks(blocks) {
  const out = [];
  for (const b of blocks) {
    if (b.tag === "li") {
      const last = out.at(-1);
      if (last?.type === "list") last.items.push(b.text);
      else out.push({ type: "list", items: [b.text] });
    } else {
      out.push({ type: b.tag === "h3" ? "heading" : "paragraph", text: b.text });
    }
  }
  return out;
}

export default function LegalPage({ doc }) {
  return (
    <section id="privacy-policy">
      <h1 className="page-heading" data-animate-heading="" data-aos="zoom-in" data-aos-duration="1000" data-aos-delay="400">
        {doc.title}
      </h1>
      <div className="wrapper content-wrapper flow" data-aos="fade-up" data-aos-delay="600">
        <p>
          <strong>{C.site.name}</strong> — {doc.subtitle}
        </p>
        {toBlocks(doc.blocks).map((b, i) => {
          if (b.type === "heading") return <h2 key={i}>{b.text}</h2>;
          if (b.type === "paragraph") return <p key={i}>{b.text}</p>;
          return (
            <ul key={i}>
              {b.items.map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
          );
        })}
      </div>
    </section>
  );
}
