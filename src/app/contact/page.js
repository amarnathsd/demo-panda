import PageShell from "@/components/PageShell";
import ContactPage from "@/components/pages/ContactPage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/contact");

export default function Page() {
  return (
    <PageShell route="/contact">
      <ContactPage />
    </PageShell>
  );
}
