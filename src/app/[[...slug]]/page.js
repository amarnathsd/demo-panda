import { notFound } from "next/navigation";
import PageContent from "@/components/PageContent";
import { getAllPages, getPageByRoute, getPageHtml } from "@/lib/content";

// Every page is generated at build time from src/content/pages.json.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPages().map((p) => ({
    slug: p.route === "/" ? [] : p.route.slice(1).split("/"),
  }));
}

const routeFromParams = async (params) => {
  const { slug } = await params;
  return "/" + (slug ?? []).join("/");
};

export async function generateMetadata({ params }) {
  const page = getPageByRoute(await routeFromParams(params));
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      images: page.ogImage ? [page.ogImage] : undefined,
    },
  };
}

export default async function Page({ params }) {
  const page = getPageByRoute(await routeFromParams(params));
  if (!page) notFound();

  const html = await getPageHtml(page.slug);
  return <PageContent html={html} bodyClass={page.bodyClass} header={page.header} />;
}
