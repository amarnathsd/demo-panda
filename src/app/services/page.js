import PageShell from "@/components/PageShell";
import ServicesPage from "@/components/pages/ServicesPage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/services");

export default function Page() {
  return (
    <PageShell route="/services">
      <ServicesPage />
    </PageShell>
  );
}
