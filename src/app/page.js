import PageShell from "@/components/PageShell";
import HomePage from "@/components/pages/HomePage";
import { pageMetadata } from "@/lib/routes";

export const metadata = pageMetadata("/");

export default function Page() {
  return (
    <PageShell route="/">
      <HomePage />
    </PageShell>
  );
}
