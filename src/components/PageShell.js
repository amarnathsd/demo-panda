import BodyClass from "./BodyClass";
import { ROUTES } from "@/lib/routes";

// Wraps a page in the theme's <main> and applies its body class / header theme.
export default function PageShell({ route, children }) {
  const { bodyClass, header = "light" } = ROUTES[route];
  return (
    <>
      <BodyClass className={bodyClass} header={header} />
      <main id="main" className="site-main">
        {children}
      </main>
    </>
  );
}
