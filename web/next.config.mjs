/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudinary is wired up in Step 3 (real image uploads).
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    // Our own first-party placeholder is an SVG.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
