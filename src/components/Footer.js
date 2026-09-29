import { getPartialHtml } from "@/lib/content";

export default async function Footer() {
  const html = await getPartialHtml("footer");
  return (
    <footer
      className="site-footer"
      data-hide-elements=""
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
