import PageShell from "@/components/PageShell";
import PricingPage from "@/components/pages/PricingPage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/pricing");

export default function Page() {
  return (
    <PageShell route="/pricing">
      <PricingPage />
    </PageShell>
  );
}
