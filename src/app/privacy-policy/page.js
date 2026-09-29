import PageShell from "@/components/PageShell";
import LegalPage from "@/components/pages/LegalPage";
import { pageMetadata } from "@/lib/routes";
import { C } from "@/lib/content";

export const metadata = pageMetadata("/privacy-policy");

export default function Page() {
  return (
    <PageShell route="/privacy-policy">
      <LegalPage doc={C.privacy} />
    </PageShell>
  );
}
