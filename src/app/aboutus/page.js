import PageShell from "@/components/PageShell";
import AboutPage from "@/components/pages/AboutPage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/aboutus");

export default function Page() {
  return (
    <PageShell route="/aboutus">
      <AboutPage />
    </PageShell>
  );
}
