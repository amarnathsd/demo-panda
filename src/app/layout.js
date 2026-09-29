import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RequestDialog from "@/components/RequestDialog";
import SiteEffects from "@/components/SiteEffects";
import { ROUTES } from "@/lib/routes";
import "./globals.css";

// The theme CSS keys off page body classes, and light-topped pages need the dark
// header. Set both before first paint; <BodyClass> keeps them in sync on navigation.
const bodyClassScript = () => {
  const map = Object.fromEntries(Object.entries(ROUTES).map(([route, r]) => [route, [r.bodyClass, r.header ?? "light"]]));
  return `(function(){var m=${JSON.stringify(map)};var p=location.pathname.replace(/\\/+$/,"")||"/";var v=m[p]||["","light"];document.body.className=v[0];document.documentElement.dataset.header=v[1];})();`;
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "The Flying Panda – Your Partner in Seamless Visa Solutions",
  description:
    "Our mission is to make visa processes as seamless as possible, offering personalized solutions that cater to the unique needs of each traveler.",
  icons: {
    icon: "/images/brand/icon.png",
    apple: "/images/brand/icon.png",
  },
};

// Theme stylesheets, in cascade order.
const STYLESHEETS = [
  "/vendor/swiper7.min.css",
  "/vendor/aos.css",
  "/vendor/fancybox.css",
  "/vendor/flatpickr.min.css",
  "/theme/css/theme.css",
];

export default function RootLayout({ children }) {
  return (
    <html lang="en-US" className="js" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          href="/theme/fonts/basis-grotesque-regular-pro.woff2"
          crossOrigin=""
        />
        {STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
      </head>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: bodyClassScript() }} />
        <Header />
        <RequestDialog />
        <div id="smooth-wrapper" className="site-content">
          <div
            id="smooth-content"
            className="primary content-area"
            style={{ paddingTop: 1, marginTop: -1 }}
          >
            {children}
            <Footer />
          </div>
        </div>
        <SiteEffects />
      </body>
    </html>
  );
}
