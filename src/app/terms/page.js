import PageShell from "@/components/PageShell";
import LegalPage from "@/components/pages/LegalPage";
import { pageMetadata } from "@/lib/routes";
import { C } from "@/lib/content";

export const metadata = pageMetadata("/terms");

export default function Page() {
  return (
    <PageShell route="/terms">
      <LegalPage doc={C.terms} />
    </PageShell>
  );
}
