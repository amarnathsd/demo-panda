/** @type {import('next').NextConfig} */
const nextConfig = {
  // Friendly aliases for the main routes.
  async redirects() {
    return [
      { source: "/about", destination: "/aboutus", permanent: true },
      { source: "/contact-us", destination: "/contact", permanent: true },
      { source: "/saperatedfaq", destination: "/faq", permanent: true },
    ];
  },
};

export default nextConfig;
