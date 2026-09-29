import PageShell from "@/components/PageShell";
import FaqPage from "@/components/pages/FaqPage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/faq");

export default function Page() {
  return (
    <PageShell route="/faq">
      <FaqPage />
    </PageShell>
  );
}
